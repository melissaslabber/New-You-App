import crypto from "node:crypto";
import { clearSession, readSession, setSession } from "./_session.js";
import { getRedis } from "./_redis.js";

const getMembers = async () => { const value = await getRedis().get("nyf:members"); return !value ? [] : typeof value === "string" ? JSON.parse(value) : value; };
const safeEqual = (left, right) => { const a = Buffer.from(String(left)); const b = Buffer.from(String(right)); return a.length === b.length && crypto.timingSafeEqual(a, b); };
const clientIp = (req) => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
async function checkRateLimit(req, action) {
  const redis = getRedis(); const key = `nyf:login-attempts:${action}:${clientIp(req)}`; const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 900);
  return { allowed: count <= (action === "staffLogin" ? 8 : 12), key };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET" && req.query?.action === "session") {
      const session = readSession(req); if (!session) return res.status(200).json({ authenticated: false });
      if (session.role === "member") { const member = (await getMembers()).find((item) => item.code === session.code); if (!member?.active) { clearSession(res); return res.status(200).json({ authenticated: false, paused: Boolean(member) }); } return res.status(200).json({ authenticated: true, role: "member", name: member.name }); }
      return res.status(200).json({ authenticated: true, role: "staff" });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const action = req.body?.action;
    if (action === "logout") { clearSession(res); return res.status(200).json({ loggedOut: true }); }
    if (!["memberLogin", "staffLogin"].includes(action)) return res.status(400).json({ error: "Unknown action" });
    const rate = await checkRateLimit(req, action); if (!rate.allowed) return res.status(429).json({ error: "Too many attempts. Please wait 15 minutes and try again." });
    if (action === "memberLogin") { const code = String(req.body?.code || "").trim().toUpperCase(); const member = (await getMembers()).find((item) => item.code === code); if (!member) return res.status(401).json({ error: "Code not recognised. Check with New You Fitness." }); if (!member.active) return res.status(403).json({ error: "Your access is paused. Contact New You Fitness." }); await getRedis().del(rate.key); setSession(res, { role: "member", code }); return res.status(200).json({ authenticated: true, role: "member", name: member.name }); }
    const configuredPin = process.env.STAFF_PIN; if (!configuredPin) return res.status(500).json({ error: "Staff access has not been configured" }); if (!safeEqual(req.body?.pin || "", configuredPin)) return res.status(401).json({ error: "Incorrect PIN" }); await getRedis().del(rate.key); setSession(res, { role: "staff" }); return res.status(200).json({ authenticated: true, role: "staff" });
  } catch (error) { console.error("Authentication error", error); return res.status(500).json({ error: error.message || "Authentication service unavailable" }); }
}
