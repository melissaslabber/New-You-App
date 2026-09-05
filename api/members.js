import { Redis } from "@upstash/redis";
import { readSession } from "./_session.js";

const redis = Redis.fromEnv();
const getMembers = async () => {
  const value = await redis.get("nyf:members");
  return !value ? [] : typeof value === "string" ? JSON.parse(value) : value;
};
const saveMembers = (members) => redis.set("nyf:members", JSON.stringify(members));
const publicMember = ({ id, name, code, active }) => ({ id, name, code, active });

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const session = readSession(req);
  if (!session || session.role !== "staff") return res.status(401).json({ error: "Staff sign-in required" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { action, name, code, id } = req.body || {};
  const members = await getMembers();
  if (action === "list") return res.status(200).json({ members: members.map(publicMember) });
  if (action === "add") {
    const cleanName = String(name || "").trim();
    const cleanCode = String(code || "").trim().toUpperCase();
    if (!cleanName || !/^[A-Z0-9]{6,12}$/.test(cleanCode)) return res.status(400).json({ error: "Enter a name and a 6–12 character code" });
    if (members.some((member) => member.code === cleanCode)) return res.status(409).json({ error: "That access code is already in use" });
    members.push({ id: crypto.randomUUID(), name: cleanName, code: cleanCode, active: true, createdAt: new Date().toISOString() });
    await saveMembers(members);
    return res.status(200).json({ members: members.map(publicMember) });
  }
  if (action === "toggle") {
    const updated = members.map((member) => member.id === id ? { ...member, active: !member.active } : member);
    await saveMembers(updated);
    return res.status(200).json({ members: updated.map(publicMember) });
  }
  if (action === "remove") {
    const member = members.find((item) => item.id === id);
    const updated = members.filter((item) => item.id !== id);
    await saveMembers(updated);
    if (member) await redis.del(`nyf:data:${member.code}`);
    return res.status(200).json({ members: updated.map(publicMember) });
  }
  return res.status(400).json({ error: "Unknown action" });
}
