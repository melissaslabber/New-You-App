import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "staff") return res.status(401).json({ error: "Staff sign-in required" });
    const redis = getRedis();
    const stored = await redis.get("nyf:members");
    const members = !stored ? [] : typeof stored === "string" ? JSON.parse(stored) : stored;
    const now = Date.now();
    const summaries = await Promise.all(members.map(async (member) => {
      const raw = await redis.get(`nyf:data:${member.code}`);
      const data = !raw ? {} : typeof raw === "string" ? JSON.parse(raw) : raw;
      const foods = data.foodLogs || []; const weights = [...(data.weightLogs || [])].sort((a,b) => a.date.localeCompare(b.date));
      const recentFoods = foods.filter((item) => now - new Date(`${item.date}T00:00:00Z`).getTime() <= 7 * 86400000);
      const totals = recentFoods.reduce((sum,item) => ({ cal: sum.cal + (+item.cal || 0), protein: sum.protein + (+item.protein || 0) }), { cal: 0, protein: 0 });
      const days = new Set(recentFoods.map((item) => item.date)).size;
      return { code: member.code, latestWeight: weights.at(-1)?.weight || null, weightChange: weights.length > 1 ? +(weights.at(-1).weight - weights[0].weight).toFixed(1) : null, lastFoodDate: [...foods].sort((a,b) => b.date.localeCompare(a.date))[0]?.date || null, lastCheckIn: [...(data.weeklyCheckIns || [])].sort((a,b) => b.date.localeCompare(a.date))[0]?.date || null, averageCalories: days ? Math.round(totals.cal / days) : null, averageProtein: days ? Math.round(totals.protein / days) : null };
    }));
    return res.status(200).json({ summaries });
  } catch (error) { return res.status(500).json({ error: error.message || "Could not load overview" }); }
}
