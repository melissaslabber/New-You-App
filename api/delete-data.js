import { clearSession, readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "member") return res.status(401).json({ error: "Member sign-in required" });
    if (req.method !== "POST" || req.body?.confirm !== "DELETE") return res.status(400).json({ error: "Deletion confirmation required" });
    const redis = getRedis(); const code = session.code;
    const backupKeys = await redis.lrange(`nyf:backups:${code}`, 0, -1);
    if (backupKeys.length) await redis.del(...backupKeys);
    await redis.del(`nyf:data:${code}`, `nyf:backups:${code}`);
    if (req.body?.scope === "account") {
      const raw = await redis.get("nyf:members"); const members = !raw ? [] : typeof raw === "string" ? JSON.parse(raw) : raw;
      await redis.set("nyf:members", JSON.stringify(members.filter((item) => item.code !== code)));
    }
    clearSession(res);
    return res.status(200).json({ deleted: true, scope: req.body?.scope === "account" ? "account" : "data" });
  } catch (error) { return res.status(500).json({ error: error.message || "Could not delete data" }); }
}
