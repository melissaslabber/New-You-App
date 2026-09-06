import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

const parse = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const session = readSession(req);
    if (!session || session.role !== "member" || !session.code) return res.status(401).json({ error: "Member sign-in required" });
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey || !process.env.VAPID_PRIVATE_KEY) return res.status(503).json({ error: "Push notifications have not been configured" });
    const redis = getRedis();
    const key = `nyf:push:${session.code}`;
    const subscriptions = parse(await redis.get(key), []);
    if (req.method === "GET") return res.status(200).json({ publicKey, subscribed: subscriptions.length > 0 });
    if (req.method === "POST") {
      const subscription = req.body?.subscription;
      if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) return res.status(400).json({ error: "Invalid push subscription" });
      const next = [...subscriptions.filter((item) => item.endpoint !== subscription.endpoint), subscription].slice(-5);
      await redis.set(key, JSON.stringify(next));
      return res.status(200).json({ subscribed: true });
    }
    if (req.method === "DELETE") {
      const endpoint = String(req.body?.endpoint || "");
      const next = endpoint ? subscriptions.filter((item) => item.endpoint !== endpoint) : [];
      if (next.length) await redis.set(key, JSON.stringify(next)); else await redis.del(key);
      return res.status(200).json({ subscribed: false });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Push subscription error", error);
    return res.status(500).json({ error: "Could not update notification settings" });
  }
}
