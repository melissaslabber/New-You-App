import { getRedis } from "./_redis.js";
import { appUrl, saveToken, stravaConfig } from "./_strava.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const base = appUrl(req);
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const state = String(req.query?.state || "");
    const code = String(req.query?.code || "");
    if (!state || !code || req.query?.error) return res.redirect(302, `${base}/?strava=cancelled`);
    const redis = getRedis();
    const memberCode = await redis.get(`nyf:strava-state:${state}`);
    await redis.del(`nyf:strava-state:${state}`);
    if (!memberCode) return res.redirect(302, `${base}/?strava=expired`);

    const { clientId, clientSecret } = stravaConfig();
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });
    const token = await response.json();
    if (!response.ok) throw new Error(token.message || "Strava authorisation failed");
    await saveToken(String(memberCode), token);
    return res.redirect(302, `${base}/?strava=connected`);
  } catch (error) {
    console.error("Strava callback error", error);
    return res.redirect(302, `${base}/?strava=failed`);
  }
}

