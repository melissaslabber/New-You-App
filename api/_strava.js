import { getRedis } from "./_redis.js";

export const STRAVA_TOKEN_TTL = 400 * 86400;

export function appUrl(req) {
  const configured = String(process.env.APP_URL || "").replace(/\/$/, "");
  if (configured) return configured;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

export function stravaConfig() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Strava is not configured yet");
  return { clientId, clientSecret };
}

export function tokenKey(memberCode) {
  return `nyf:strava:${memberCode}`;
}

export async function getToken(memberCode) {
  const value = await getRedis().get(tokenKey(memberCode));
  if (!value) return null;
  return typeof value === "string" ? JSON.parse(value) : value;
}

export async function saveToken(memberCode, token) {
  await getRedis().set(tokenKey(memberCode), JSON.stringify(token), { ex: STRAVA_TOKEN_TTL });
}

export async function activeAccessToken(memberCode) {
  const saved = await getToken(memberCode);
  if (!saved) return null;
  if (Number(saved.expires_at || 0) > Math.floor(Date.now() / 1000) + 3600) return saved;

  const { clientId, clientSecret } = stravaConfig();
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: saved.refresh_token,
    }),
  });
  const refreshed = await response.json();
  if (!response.ok) throw new Error(refreshed.message || "Could not refresh Strava access");
  const next = { ...saved, ...refreshed, athlete: refreshed.athlete || saved.athlete };
  await saveToken(memberCode, next);
  return next;
}

