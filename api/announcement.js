import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session) return res.status(401).json({ error: "Sign-in required" });
    const redis = getRedis();
    if (req.method === "GET") return res.status(200).json({ announcement: (await redis.get("nyf:announcement")) || null });
    if (req.method === "POST" && session.role === "staff") {
      const text = String(req.body?.text || "").trim().slice(0, 500);
      const announcement = text ? { text, updatedAt: new Date().toISOString() } : null;
      if (announcement) await redis.set("nyf:announcement", JSON.stringify(announcement)); else await redis.del("nyf:announcement");
      return res.status(200).json({ announcement });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return res.status(500).json({ error: error.message || "Announcement service unavailable" }); }
}
