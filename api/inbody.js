import { readSession } from "./_session.js";

const numberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(String(value).replace(",", "."));
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : null;
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = readSession(req);
  if (!session || session.role !== "member") return res.status(401).json({ error: "Member sign-in required" });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
  const image = req.body?.image;
  if (!image || image.mimeType !== "image/jpeg" || typeof image.data !== "string") return res.status(400).json({ error: "Add an InBody JPG image" });
  if (image.data.length > 3500000) return res.status(413).json({ error: "The image is too large. Upload a JPG smaller than 2.5 MB." });

  const prompt = `Read this photograph of a full InBody body-composition assessment sheet. Extract only values visibly printed for the newest assessment. Decimal commas mean decimal points. Return only valid JSON in this exact shape: {"testDate":"YYYY-MM-DD","weight":null,"skeletalMuscleMass":null,"bodyFatMass":null,"percentBodyFat":null,"bmi":null,"score":null,"visceralFatLevel":null,"waistHipRatio":null,"totalBodyWater":null,"bmr":null,"targetWeight":null,"weightControl":null,"fatControl":null,"muscleControl":null,"confidence":"high|medium|low","notes":""}. Values must be numbers without units or null when unreadable. SMM means skeletal muscle mass and PBF means percent body fat. Do not use older values from the Body Composition History chart as the current result. Do not provide medical diagnoses.`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: image.data } }] }], generationConfig: { temperature: 0.1, maxOutputTokens: 900, responseMimeType: "application/json" } }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Could not read the InBody report" });
    const raw = (data?.candidates?.[0]?.content?.parts || []).map((part) => part.text || "").join("").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    const assessment = { testDate: /^\d{4}-\d{2}-\d{2}$/.test(parsed.testDate || "") ? parsed.testDate : new Date().toISOString().slice(0, 10), confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "low", notes: String(parsed.notes || "").slice(0, 240) };
    ["weight", "skeletalMuscleMass", "bodyFatMass", "percentBodyFat", "bmi", "score", "visceralFatLevel", "waistHipRatio", "totalBodyWater", "bmr", "targetWeight", "weightControl", "fatControl", "muscleControl"].forEach((key) => { assessment[key] = numberOrNull(parsed[key]); });
    if (assessment.weight === null && assessment.skeletalMuscleMass === null && assessment.percentBodyFat === null) return res.status(422).json({ error: "The main InBody results could not be read. Please upload the original clear PDF." });
    return res.status(200).json({ assessment });
  } catch (error) {
    return res.status(error?.name === "AbortError" ? 504 : 422).json({ error: error?.name === "AbortError" ? "Reading the report took too long. Please try again." : "The image could not be read. Please upload a clear photo of the full InBody sheet." });
  } finally {
    clearTimeout(timeout);
  }
}
