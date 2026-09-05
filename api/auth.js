import crypto from "node:crypto";
import { Redis } from "@upstash/redis";
import { clearSession, readSession, setSession } from "./_session.js";

const redis = Redis.fromEnv();
const getMembers = async () => {
  const value = await redis.get("nyf:members");
  return !value ? [] : typeof value === "string" ? JSON.parse(value) : value;
};
const safeEqual = (left, right) => {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET" && req.query?.action === "session") {
    const session = readSession(req);
    if (!session) return res.status(200).json({ authenticated: false });
    if (session.role === "member") {
      const member = (await getMembers()).find((item) => item.code === session.code);
      if (!member?.active) {
        clearSession(res);
        return res.status(200).json({ authenticated: false, paused: Boolean(member) });
      }
      return res.status(200).json({ authenticated: true, role: "member", name: member.name });
    }
    return res.status(200).json({ authenticated: true, role: "staff" });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const action = req.body?.action;
  if (action === "memberLogin") {
    const code = String(req.body?.code || "").trim().toUpperCase();
    const member = (await getMembers()).find((item) => item.code === code);
    if (!member) return res.status(401).json({ error: "Code not recognised. Check with New You Fitness." });
    if (!member.active) return res.status(403).json({ error: "Your access is paused. Contact New You Fitness." });
    setSession(res, { role: "member", code });
    return res.status(200).json({ authenticated: true, role: "member", name: member.name });
  }
  if (action === "staffLogin") {
    const configuredPin = process.env.STAFF_PIN;
    if (!configuredPin) return res.status(500).json({ error: "Staff access has not been configured" });
    if (!safeEqual(req.body?.pin || "", configuredPin)) return res.status(401).json({ error: "Incorrect PIN" });
    setSession(res, { role: "staff" });
    return res.status(200).json({ authenticated: true, role: "staff" });
  }
  if (action === "logout") {
    clearSession(res);
    return res.status(200).json({ loggedOut: true });
  }
  return res.status(400).json({ error: "Unknown action" });
}
