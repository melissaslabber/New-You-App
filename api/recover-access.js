import { getRedis } from "./_redis.js";

const normalEmail = (value) => String(value || "").trim().toLowerCase();
const normalPhone = (value) => {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `27${digits.slice(1)}`;
  return digits;
};
const clientIp = (req) => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();

async function sendEmail(to, code) {
  if (!process.env.RESEND_API_KEY || !process.env.RECOVERY_FROM_EMAIL) return false;
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RECOVERY_FROM_EMAIL, to: [to], subject: "Your New You access code", html: `<p>Your New You access code is <strong>${code}</strong>.</p><p>Keep this code private. If you did not request it, contact New You Fitness.</p>` }) });
  return response.ok;
}

async function sendWhatsApp(to, code) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN; const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return false;
  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", to, type: "template", template: { name: process.env.WHATSAPP_RECOVERY_TEMPLATE || "new_you_access_code", language: { code: "en" }, components: [{ type: "body", parameters: [{ type: "text", text: code }] }] } }) });
  return response.ok;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const generic = { sent: true, message: "If those details match an active account and that delivery service is configured, the access code will be sent shortly." };
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const redis = getRedis(); const rateKey = `nyf:recovery:${clientIp(req)}`; const count = await redis.incr(rateKey);
    if (count === 1) await redis.expire(rateKey, 86400);
    if (count > 5) return res.status(200).json(generic);
    const method = req.body?.method === "whatsapp" ? "whatsapp" : "email";
    const identifier = method === "email" ? normalEmail(req.body?.identifier) : normalPhone(req.body?.identifier);
    if (!identifier) return res.status(400).json({ error: "Enter the email address or mobile number used for your account." });
    const raw = await redis.get("nyf:members"); const members = !raw ? [] : typeof raw === "string" ? JSON.parse(raw) : raw;
    for (const member of members.filter((item) => item.active)) {
      const stored = await redis.get(`nyf:data:${member.code}`); const data = !stored ? {} : typeof stored === "string" ? JSON.parse(stored) : stored;
      const matches = method === "email" ? normalEmail(data.profile?.email) === identifier : normalPhone(data.profile?.phone) === identifier;
      if (matches) { if (method === "email") await sendEmail(identifier, member.code); else await sendWhatsApp(identifier, member.code); break; }
    }
    return res.status(200).json(generic);
  } catch (error) { console.error("Access recovery error", error); return res.status(200).json(generic); }
}
