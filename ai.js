// Vercel serverless function — keeps the Anthropic API key server-side.
// Requires an environment variable ANTHROPIC_API_KEY set in Vercel:
// Project -> Settings -> Environment Variables -> add ANTHROPIC_API_KEY,
// then redeploy (or it applies to the next deploy automatically).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, maxTokens } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens || 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || "Upstream error" });
    }

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "Request to Anthropic failed" });
  }
}
