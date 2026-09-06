import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "staff") return res.status(401).json({ error: "Staff sign-in required" });
    const redis = getRedis(); const stored = await redis.get("nyf:members");
    const members = !stored ? [] : typeof stored === "string" ? JSON.parse(stored) : stored;
    const records = await Promise.all(members.map(async (member) => { const raw = await redis.get(`nyf:data:${member.code}`); return { member, data: !raw ? {} : typeof raw === "string" ? JSON.parse(raw) : raw }; }));
    return res.status(200).json({ exportedAt: new Date().toISOString(), memberCount: records.length, records });
  } catch (error) { return res.status(500).json({ error: error.message || "Could not create backup" }); }
}
