import crypto from "node:crypto";
import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "staff") return res.status(401).json({ error: "Staff sign-in required" });
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const code = String(req.body?.code || "").trim().toUpperCase();
    const text = String(req.body?.text || "").trim().slice(0, 1000);
    if (!code || !text) return res.status(400).json({ error: "Member and message are required" });
    const redis = getRedis();
    const key = `nyf:data:${code}`;
    const current = await redis.get(key);
    const data = !current ? {} : typeof current === "string" ? JSON.parse(current) : current;
    const coachMessages = Array.isArray(data.coachMessages) ? data.coachMessages : [];
    coachMessages.push({ id: crypto.randomUUID(), role: "coach", text, date: new Date().toISOString() });
    const updated = { ...data, coachMessages, updatedAt: new Date().toISOString() };
    await redis.set(key, JSON.stringify(updated));
    return res.status(200).json({ data: updated });
  } catch (error) {
    console.error("Coach message error", error);
    return res.status(500).json({ error: error.message || "Could not send message" });
  }
}
