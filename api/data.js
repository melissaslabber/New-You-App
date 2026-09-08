import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

const ALLOWED_KEYS = new Set(["profile","weightLogs","foodLogs","favoriteMeals","checkedGroceryItems","likedFoods","weeklyCheckIns","measurementLogs","dailyHabits","progressPhotos","exerciseLogs","stepLogs","savedMeals","inbodyAssessments"]);
function safeJson(value, depth = 0) {
  if (depth > 8) throw new Error("Saved data is too deeply nested");
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") return value.slice(0, 200000);
  if (Array.isArray(value)) {
    if (value.length > 5000) throw new Error("Too many saved entries");
    return value.map((item) => safeJson(item, depth + 1));
  }
  if (typeof value === "object") {
    const clean = {};
    for (const [key, item] of Object.entries(value)) {
      if (["__proto__", "prototype", "constructor"].includes(key)) continue;
      clean[String(key).slice(0, 80)] = safeJson(item, depth + 1);
    }
    return clean;
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session) return res.status(401).json({ error: "Sign-in required" });
    const requestedCode = String(req.query?.code || "").trim().toUpperCase();
    const code = session.role === "staff" ? requestedCode : session.code;
    if (!code) return res.status(400).json({ error: "Missing member code" });
    const key = `nyf:data:${code}`;
    const redis = getRedis();
    if (req.method === "GET") {
      const value = await redis.get(key);
      return res.status(200).json(!value ? {} : typeof value === "string" ? JSON.parse(value) : value);
    }
    if (req.method === "POST") {
      if (session.role !== "member" || session.code !== code) return res.status(403).json({ error: "Members may only update their own data" });
      const data = req.body?.data;
      if (!data || typeof data !== "object") return res.status(400).json({ error: "Missing data" });
      const unexpected = Object.keys(data).filter((name) => !ALLOWED_KEYS.has(name));
      if (unexpected.length) return res.status(400).json({ error: "Saved data contains unsupported fields" });
      const clean = safeJson(data); const now = new Date().toISOString();
      const encoded = JSON.stringify({ ...clean, schemaVersion: 2, updatedAt: now });
      if (Buffer.byteLength(encoded, "utf8") > 4_500_000) return res.status(413).json({ error: "Your saved record is too large. Remove older photos and try again." });
      const previous = await redis.get(key);
      if (previous) {
        const backupKey = `nyf:backup:${code}:${Date.now()}`;
        await redis.set(backupKey, typeof previous === "string" ? previous : JSON.stringify(previous), { ex: 2592000 });
        await redis.lpush(`nyf:backups:${code}`, backupKey);
        await redis.ltrim(`nyf:backups:${code}`, 0, 9);
      }
      await redis.set(key, encoded);
      return res.status(200).json({ saved: true, backedUp: Boolean(previous), savedAt: now });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Member data error", error);
    return res.status(500).json({ error: error.message || "Member data service unavailable" });
  }
}
