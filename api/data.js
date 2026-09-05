import { Redis } from "@upstash/redis";
import { readSession } from "./_session.js";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const session = readSession(req);
  if (!session) return res.status(401).json({ error: "Sign-in required" });
  const requestedCode = String(req.query?.code || "").trim().toUpperCase();
  const code = session.role === "staff" ? requestedCode : session.code;
  if (!code) return res.status(400).json({ error: "Missing member code" });
  const key = `nyf:data:${code}`;
  if (req.method === "GET") {
    const value = await redis.get(key);
    return res.status(200).json(!value ? {} : typeof value === "string" ? JSON.parse(value) : value);
  }
  if (req.method === "POST") {
    if (session.role !== "member" || session.code !== code) return res.status(403).json({ error: "Members may only update their own data" });
    const data = req.body?.data;
    if (!data || typeof data !== "object") return res.status(400).json({ error: "Missing data" });
    await redis.set(key, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
    return res.status(200).json({ saved: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
