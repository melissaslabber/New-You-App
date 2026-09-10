import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";
import { activeAccessToken, getToken, tokenKey } from "./_strava.js";

function activityName(item) {
  return String(item.name || item.sport_type || item.type || "Strava activity").slice(0, 100);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "member") return res.status(401).json({ error: "Sign-in required" });

    if (req.method === "GET") {
      const token = await getToken(session.code);
      return res.status(200).json({
        connected: Boolean(token),
        athlete: token?.athlete ? { firstname: token.athlete.firstname || "", lastname: token.athlete.lastname || "" } : null,
      });
    }

    if (req.method === "DELETE") {
      const token = await activeAccessToken(session.code);
      if (token?.access_token) {
        try {
          await fetch("https://www.strava.com/oauth/deauthorize", {
            method: "POST",
            headers: { Authorization: `Bearer ${token.access_token}` },
          });
        } catch (error) {
          console.warn("Strava deauthorisation request failed", error);
        }
      }
      await getRedis().del(tokenKey(session.code));
      return res.status(200).json({ disconnected: true });
    }

    if (req.method === "POST") {
      const token = await activeAccessToken(session.code);
      if (!token) return res.status(404).json({ error: "Connect Strava first" });
      const after = Math.floor((Date.now() - 90 * 86400 * 1000) / 1000);
      const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100&page=1`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load Strava activities");
      const activities = data.map((item) => ({
        id: `strava-${item.id}`,
        stravaId: String(item.id),
        source: "strava",
        date: String(item.start_date_local || item.start_date || "").slice(0, 10),
        activity: activityName(item),
        sportType: item.sport_type || item.type || "Activity",
        calories: Math.max(0, Math.round((Number(item.kilojoules) || 0) / 4.184)),
        durationMinutes: Math.max(0, Math.round((Number(item.moving_time) || 0) / 60)),
        distanceKm: Math.max(0, Math.round((Number(item.distance) || 0) / 100) / 10),
        syncedAt: new Date().toISOString(),
      })).filter((item) => item.date);
      return res.status(200).json({ activities, syncedAt: new Date().toISOString() });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Strava API error", error);
    return res.status(500).json({ error: error.message || "Strava service unavailable" });
  }
}
