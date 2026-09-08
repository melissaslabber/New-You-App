import { readSession } from "./_session.js";
import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = readSession(req);
  if (!session || session.role !== "member") return res.status(401).json({ error: "Member sign-in required" });
  const redis = getRedis(); const rateKey = `nyf:ai-rate:${session.code}:${new Date().toISOString().slice(0, 10)}`;
  const count = await redis.incr(rateKey); if (count === 1) await redis.expire(rateKey, 86400);
  if (count > 40) return res.status(429).json({ error: "Daily coaching limit reached. Please try again tomorrow." });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });

  const { prompt, maxTokens = 1200, jsonMode = false, images = [] } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.length > 12000) return res.status(400).json({ error: "A valid prompt is required" });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const imageParts = (Array.isArray(images) ? images : []).slice(0, 2).filter((image) => typeof image?.data === "string" && image.data.length < 6000000 && /^image\/(jpeg|png|webp)$/.test(image.mimeType || "")).map((image) => ({ inlineData: { mimeType: image.mimeType, data: image.data } }));
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
          generationConfig: {
            temperature: 0.45,
            maxOutputTokens: Math.min(Number(maxTokens) || 1200, 2048),
            ...(jsonMode ? { responseMimeType: "application/json" } : {}),
          },
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Gemini request failed" });
    const text = (data?.candidates?.[0]?.content?.parts || []).map((part) => part.text || "").join("").trim();
    if (!text) return res.status(502).json({ error: "Gemini returned no text" });
    return res.status(200).json({ text });
  } catch (error) {
    return res.status(error?.name === "AbortError" ? 504 : 500).json({ error: error?.name === "AbortError" ? "Meal generation timed out" : "AI request failed" });
  } finally {
    clearTimeout(timeout);
  }
}
