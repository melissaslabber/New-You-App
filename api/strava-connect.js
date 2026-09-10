import crypto from "node:crypto";
import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";
import { appUrl, stravaConfig } from "./_strava.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const session = readSession(req);
    if (!session || session.role !== "member") return res.redirect(302, "/?strava=signin_required");
    const { clientId } = stravaConfig();
    const state = crypto.randomBytes(32).toString("base64url");
    await getRedis().set(`nyf:strava-state:${state}`, session.code, { ex: 600 });
    const redirectUri = `${appUrl(req)}/api/strava-callback`;
    const query = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      approval_prompt: "auto",
      scope: "read,activity:read_all",
      state,
    });
    return res.redirect(302, `https://www.strava.com/oauth/authorize?${query}`);
  } catch (error) {
    console.error("Strava connect error", error);
    return res.redirect(302, "/?strava=configuration_error");
  }
}

