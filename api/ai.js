// Vercel serverless function — calls Google's Gemini API (free tier) instead
// of a paid provider. Keeps the API key server-side, never in browser code.
//
// Setup:
// 1. Go to https://aistudio.google.com/apikey, sign in with a Google account,
//    click "Create API key". No credit card needed for the free tier.
// 2. In Vercel: Project -> Settings -> Environment Variables -> add
//    GEMINI_API_KEY with that value, save, then redeploy.
//
// Free tier notes (worth knowing, not hiding):
// - Rate-limited (roughly 10-15 requests/minute on Flash models as of
//   writing) — fine for occasional use by a small gym's members, but could
//   throttle if many people tap "Suggest meals" at the exact same moment.
// - Google's free-tier terms allow using your requests/responses to improve
//   their models. This app sends calorie/macro goals and liked foods, not
//   identifying health data, but it's worth knowing before relying on this
//   for real member use.
// - Google renames/retires Flash model versions periodically. If this stops
//   working, check the current model list at https://ai.google.dev/models
//   and update GEMINI_MODEL below (or set it as its own env var).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, maxTokens } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GEMINI_API_KEY" });
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: maxTokens || 1000 },
        }),
      }
    );

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || "Upstream error from Gemini" });
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim() || "";
    if (!text) {
      return res.status(502).json({ error: "Gemini returned no text — it may have blocked the response for safety reasons" });
    }

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Request to Gemini failed" });
  }
}
