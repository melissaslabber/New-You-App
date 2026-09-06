import crypto from "node:crypto";
import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

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
    if (req.method === "GET") { const approved = await readList(redis, APPROVED_KEY); return res.status(200).json({ approved }); }
    if (req.method === "POST") {
      if (session.role !== "member") return res.status(403).json({ error: "Member access required" });
      const item = req.body?.item || {};
      const name = text(item.name);
      if (!name || !number(item.cal)) return res.status(400).json({ error: "Food name and calories are required" });
      const approved = await readList(redis, APPROVED_KEY);
      const barcode = text(item.barcode, 32).replace(/[^0-9]/g, ""); const brand = text(item.brand, 80);
      const food = { id: `community-${crypto.randomUUID()}`, submittedAt: new Date().toISOString(), memberCode: session.code, name, brand, barcode, cal: number(item.cal), protein: number(item.protein), carb: number(item.carb), fat: number(item.fat), servingSize: number(item.servingSize) || 100, defaultQty: number(item.servingSize) || 100, unit: ["g", "ml"].includes(item.unit) ? item.unit : "g", verified: false, communityAdded: true, aliases: `${name} ${brand}` };
      const duplicate = (entry) => (barcode && entry.barcode === barcode) || (!barcode && `${entry.name}|${entry.brand}`.toLowerCase() === `${name}|${brand}`.toLowerCase());
      await redis.set(APPROVED_KEY, JSON.stringify([food, ...approved.filter((entry) => !duplicate(entry))].slice(0, 2000)));
      return res.status(201).json({ saved: true, food });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Food submission error", error);
    return res.status(500).json({ error: error.message || "Food directory unavailable" });
  }
}
