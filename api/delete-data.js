import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "member") return res.status(401).json({ error: "Member sign-in required" });
    if (req.method !== "POST" || req.body?.confirm !== "DELETE") return res.status(400).json({ error: "Deletion confirmation required" });
    await getRedis().del(`nyf:data:${session.code}`);
    return res.status(200).json({ deleted: true });
  } catch (error) { return res.status(500).json({ error: error.message || "Could not delete data" }); }
}
