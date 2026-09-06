import crypto from "node:crypto";
import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

const PENDING_KEY = "nyf:foods:pending";
const APPROVED_KEY = "nyf:foods:approved";
const text = (value, max = 120) => String(value || "").trim().slice(0, max);
const number = (value) => Math.max(0, Math.round((Number(value) || 0) * 10) / 10);
const readList = async (redis, key) => {
  const raw = await redis.get(key);
  const value = !raw ? [] : typeof raw === "string" ? JSON.parse(raw) : raw;
  return Array.isArray(value) ? value : [];
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session) return res.status(401).json({ error: "Sign-in required" });
    const redis = getRedis();
    if (req.method === "GET") {
      if (session.role !== "staff") return res.status(403).json({ error: "Staff access required" });
      const [pending, approved] = await Promise.all([readList(redis, PENDING_KEY), readList(redis, APPROVED_KEY)]);
      return res.status(200).json({ pending, approved });
    }
    if (req.method === "POST") {
      if (session.role !== "member") return res.status(403).json({ error: "Member access required" });
      const item = req.body?.item || {};
      const name = text(item.name);
      if (!name || !number(item.cal)) return res.status(400).json({ error: "Food name and calories are required" });
      const pending = await readList(redis, PENDING_KEY);
      const submission = { id: crypto.randomUUID(), submittedAt: new Date().toISOString(), memberCode: session.code, memberName: text(session.name, 80), name, brand: text(item.brand, 80), barcode: text(item.barcode, 32).replace(/[^0-9]/g, ""), cal: number(item.cal), protein: number(item.protein), carb: number(item.carb), fat: number(item.fat), servingSize: number(item.servingSize) || 100, unit: ["g", "ml"].includes(item.unit) ? item.unit : "g", status: "pending" };
      await redis.set(PENDING_KEY, JSON.stringify([submission, ...pending].slice(0, 500)));
      return res.status(201).json({ submitted: true });
    }
    if (req.method === "PATCH") {
      if (session.role !== "staff") return res.status(403).json({ error: "Staff access required" });
      const id = text(req.body?.id, 80); const action = text(req.body?.action, 20);
      const pending = await readList(redis, PENDING_KEY); const item = pending.find((entry) => entry.id === id);
      if (!item) return res.status(404).json({ error: "Submission not found" });
      const remaining = pending.filter((entry) => entry.id !== id);
      await redis.set(PENDING_KEY, JSON.stringify(remaining));
      if (action === "approve") {
        const approved = await readList(redis, APPROVED_KEY);
        const food = { ...item, id: `approved-${item.id}`, verified: true, approvedAt: new Date().toISOString(), status: "approved", defaultQty: item.servingSize, aliases: `${item.name} ${item.brand}` };
        await redis.set(APPROVED_KEY, JSON.stringify([food, ...approved.filter((entry) => !(item.barcode && entry.barcode === item.barcode))].slice(0, 2000)));
      }
      return res.status(200).json({ updated: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Food submission error", error);
    return res.status(500).json({ error: error.message || "Food directory unavailable" });
  }
}
