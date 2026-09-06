import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "staff") return res.status(401).json({ error: "Staff sign-in required" });
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const code = String(req.body?.code || "").trim().toUpperCase(); const goals = req.body?.goals || {};
    if (!code) return res.status(400).json({ error: "Member code required" });
    const redis = getRedis(); const key = `nyf:data:${code}`; const raw = await redis.get(key);
    const data = !raw ? {} : typeof raw === "string" ? JSON.parse(raw) : raw;
    const clean = { calorieGoal: +goals.calorieGoal || 0, proteinGoal: +goals.proteinGoal || 0, carbGoal: +goals.carbGoal || 0, fatGoal: +goals.fatGoal || 0, exerciseCredit: [0, 50, 100].includes(+goals.exerciseCredit) ? +goals.exerciseCredit : 50, coachControlled: true };
    const updated = { ...data, profile: { ...(data.profile || {}), ...clean }, updatedAt: new Date().toISOString() };
    await redis.set(key, JSON.stringify(updated));
    return res.status(200).json({ data: updated });
  } catch (error) { return res.status(500).json({ error: error.message || "Could not save goals" }); }
}
