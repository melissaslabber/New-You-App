import crypto from "node:crypto";
import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

const MEMBERS_KEY = "nyf:members";
const parseMembers = (value) => !value ? [] : typeof value === "string" ? JSON.parse(value) : value;
const cleanName = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 80);
const cleanCode = (value) => String(value || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "staff") return res.status(401).json({ error: "Staff sign-in required" });
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const redis = getRedis();
    const members = parseMembers(await redis.get(MEMBERS_KEY));
    const action = req.body?.action;
    if (action === "list") return res.status(200).json({ members });
    if (action === "add") {
      const name = cleanName(req.body?.name); const code = cleanCode(req.body?.code);
      if (name.length < 2) return res.status(400).json({ error: "Enter the member's full name" });
      if (!/^[A-Z0-9-]{6,24}$/.test(code)) return res.status(400).json({ error: "Access code must contain 6-24 letters, numbers or hyphens" });
      if (members.some((item) => item.code === code)) return res.status(409).json({ error: "That access code is already in use" });
      const now = new Date().toISOString();
      members.push({ id: crypto.randomUUID(), name, code, active: true, createdAt: now, updatedAt: now });
    } else if (action === "toggle") {
      const member = members.find((item) => item.id === String(req.body?.id || ""));
      if (!member) return res.status(404).json({ error: "Member not found" });
      member.active = !member.active; member.updatedAt = new Date().toISOString();
    } else {
      return res.status(400).json({ error: "Unknown member action" });
    }
    await redis.set(MEMBERS_KEY, JSON.stringify(members));
    return res.status(200).json({ members });
  } catch (error) {
    console.error("Member management error", error);
    return res.status(500).json({ error: error.message || "Member service unavailable" });
  }
}
