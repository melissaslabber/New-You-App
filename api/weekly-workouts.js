import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
const text = (value, max = 240) => String(value || "").trim().slice(0, max);
const seconds = (value, fallback) => Math.min(600, Math.max(0, Math.round(Number(value) || fallback)));

function cleanPlan(plan, date) {
  const exercises = Array.isArray(plan?.exercises) ? plan.exercises.slice(0, 60).map((item, index) => ({
    id: text(item.id, 60) || `${Date.now()}-${index}`,
    section: item.section === "warmup" ? "warmup" : "workout",
    name: text(item.name, 100),
    work: seconds(item.work, 45),
    rest: seconds(item.rest, 15),
    instructions: text(item.instructions, 500),
    level1: text(item.level1, 160), level2: text(item.level2, 160), level3: text(item.level3, 160),
  })).filter((item) => item.name) : [];
  if (!exercises.length) throw new Error("Add at least one exercise");
  return { date, title: text(plan?.title, 100) || "Coach workout", location: ["home", "gym", "both"].includes(plan?.location) ? plan.location : "both", estimatedCalories: Math.min(1000, Math.max(0, Math.round(Number(plan?.estimatedCalories) || 250))), exercises, publishedAt: new Date().toISOString() };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session) return res.status(401).json({ error: "Sign-in required" });
    const date = String(req.method === "GET" ? req.query?.date : req.body?.date || "");
    if (!validDate(date)) return res.status(400).json({ error: "A valid workout date is required" });
    const redis = getRedis(); const key = `nyf:workout:${date}`;
    if (req.method === "GET") {
      const raw = await redis.get(key); const plan = !raw ? null : typeof raw === "string" ? JSON.parse(raw) : raw;
      return res.status(200).json({ plan });
    }
    if (session.role !== "staff") return res.status(403).json({ error: "Staff access required" });
    if (req.method === "DELETE") { await redis.del(key); return res.status(200).json({ deleted: true }); }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const plan = cleanPlan(req.body?.plan, date); await redis.set(key, JSON.stringify(plan));
    return res.status(200).json({ saved: true, plan });
  } catch (error) {
    console.error("Weekly workout error", error);
    return res.status(500).json({ error: error.message || "Could not save workout" });
  }
}
