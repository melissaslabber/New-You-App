import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";
import { activeAccessToken, getToken, tokenKey } from "./_strava.js";

function activityName(item) {
  return String(item.name || item.sport_type || item.type || "Strava activity").slice(0, 100);
}

function johannesburgDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function activityDate(item) {
  // Strava supplies the athlete's local calendar time separately. Prefer its
  // date portion so a South African activity always lands on the day shown in Strava.
  const local = String(item?.start_date_local || "").slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(local)) return local;
  return johannesburgDate(item?.start_date);
}

function estimatedCalories(item, weightKg) {
  const minutes = Math.max(0, Number(item.moving_time || item.elapsed_time || 0) / 60);
  const weight = Math.max(35, Number(weightKg) || 70);
  const type = String(item.sport_type || item.type || "").toLowerCase();
  const met = type.includes("walk") ? 3.8
    : type.includes("hike") ? 6
    : type.includes("run") ? 9.8
    : type.includes("ride") || type.includes("cycl") ? 7.5
    : type.includes("weight") ? 5
    : type.includes("yoga") ? 3
    : type.includes("swim") ? 8
    : type.includes("hiit") || type.includes("workout") || type.includes("training") ? 8
    : 6;
  return Math.max(0, Math.round((met * 3.5 * weight / 200) * minutes));
}

async function detailedActivities(accessToken, summaries) {
  const results = [];
  for (let index = 0; index < summaries.length; index += 5) {
    const batch = summaries.slice(index, index + 5);
    const detailed = await Promise.all(batch.map(async (summary) => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await fetch(`https://www.strava.com/api/v3/activities/${summary.id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (response.ok) return { ...summary, ...(await response.json()), stravaDetailLoaded: true };
          if (response.status === 401 || response.status === 403 || response.status === 429) break;
        } catch {
          // Retry once for a short-lived network failure.
        }
      }
      return { ...summary, stravaDetailLoaded: false };
    }));
    results.push(...detailed);
  }
  return results;
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
      // Detail calls are only needed mainly for calories and can be slow on a
      // serverless request. Enrich the newest ten, then use summaries for older history.
      const newest = data.slice(0, 10);
      const detailedNewest = await detailedActivities(token.access_token, newest);
      const detailed = [...detailedNewest, ...data.slice(10)];
      const redis = getRedis();
      const savedData = await redis.get(`nyf:data:${session.code}`);
      const memberData = !savedData ? {} : typeof savedData === "string" ? JSON.parse(savedData) : savedData;
      const weightKg = Number(memberData?.profile?.weight) || 70;
      const activities = detailed.map((item) => {
        // Strava's `kilojoules` is mechanical work, not the calorie total shown
        // in the Strava app. Only its detailed `calories` field is an exact match.
        const hasStravaCalories = item.stravaDetailLoaded && Object.prototype.hasOwnProperty.call(item, "calories") && Number.isFinite(Number(item.calories));
        const stravaCalories = hasStravaCalories ? Number(item.calories) : null;
        return {
        id: `strava-${item.id}`,
        stravaId: String(item.id),
        source: "strava",
        // Strava's start_date is UTC. Convert it to South African time so an
        // evening workout is not stored against the previous calendar day.
        date: activityDate(item),
        startDateLocal: String(item.start_date_local || ""),
        startDateUtc: String(item.start_date || ""),
        activity: activityName(item),
        sportType: item.sport_type || item.type || "Activity",
        calories: hasStravaCalories ? Math.round(stravaCalories) : estimatedCalories(item, weightKg),
        calorieSource: hasStravaCalories ? "strava" : "estimated",
        durationMinutes: Math.max(0, Math.round((Number(item.moving_time) || 0) / 60)),
        distanceKm: Math.max(0, Math.round((Number(item.distance) || 0) / 100) / 10),
        syncedAt: new Date().toISOString(),
      };
      }).filter((item) => item.date);
      const existingExercise = Array.isArray(memberData.exerciseLogs) ? memberData.exerciseLogs : [];
      const mergedStrava = new Map(existingExercise.filter((item) => item.source === "strava").map((item) => [String(item.stravaId || item.id), item]));
      activities.forEach((item) => {
        const key = String(item.stravaId || item.id);
        const previous = mergedStrava.get(key);
        if (item.calorieSource === "estimated" && previous?.calorieSource === "strava") {
          mergedStrava.set(key, { ...item, calories: previous.calories, calorieSource: "strava" });
        } else {
          mergedStrava.set(key, item);
        }
      });
      const exerciseLogs = [...existingExercise.filter((item) => item.source !== "strava"), ...mergedStrava.values()];
      await redis.set(`nyf:data:${session.code}`, JSON.stringify({ ...memberData, exerciseLogs, schemaVersion: 2, updatedAt: new Date().toISOString() }));
      return res.status(200).json({ activities, syncedAt: new Date().toISOString(), latestActivity: activities[0] || null });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Strava API error", error);
    return res.status(500).json({ error: error.message || "Strava service unavailable" });
  }
}
