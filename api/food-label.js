import { readSession } from "./_session.js";

const cleanNumber = (value) => Math.max(0, Math.round((Number(value) || 0) * 10) / 10);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = readSession(req);
  if (!session || session.role !== "member") return res.status(401).json({ error: "Member sign-in required" });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
  const supplied = Array.isArray(req.body?.images) ? req.body.images : [];
  const imageParts = supplied.slice(0, 2).filter((image) => typeof image?.data === "string" && image.data.length < 5000000 && /^image\/(jpeg|png|webp)$/.test(image.mimeType || "")).map((image) => ({ inlineData: { mimeType: image.mimeType, data: image.data } }));
  if (!imageParts.length) return res.status(400).json({ error: "Add a barcode or nutrition-label photo" });
  const prompt = `Read these photographs of one packaged food product sold in South Africa. Extract the English product name, brand, barcode digits, stated serving size, and nutrition per 100 g or per 100 ml. If the label only gives nutrition per serving, calculate the per-100 values using the stated serving size. Convert kilojoules to kilocalories using kcal = kJ / 4.184 when kcal is absent. Do not guess unreadable values. Return only valid JSON in this exact form: {"name":"","brand":"","barcode":"","servingSize":100,"unit":"g","cal":0,"protein":0,"carb":0,"fat":0,"confidence":"high|medium|low","notes":""}. Use unit g or ml only. Numbers must be ordinary decimals.`;
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${encodeURIComponent(apiKey)}`, { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }], generationConfig: { temperature: 0.1, maxOutputTokens: 700, responseMimeType: "application/json" } }) });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Could not read the label" });
    const raw = (data?.candidates?.[0]?.content?.parts || []).map((part) => part.text || "").join("").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    return res.status(200).json({ product: { name: String(parsed.name || "").slice(0, 120), brand: String(parsed.brand || "").slice(0, 80), barcode: String(parsed.barcode || "").replace(/\D/g, "").slice(0, 32), servingSize: cleanNumber(parsed.servingSize) || 100, unit: parsed.unit === "ml" ? "ml" : "g", cal: cleanNumber(parsed.cal), protein: cleanNumber(parsed.protein), carb: cleanNumber(parsed.carb), fat: cleanNumber(parsed.fat), confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "low", notes: String(parsed.notes || "").slice(0, 200) } });
  } catch (error) {
    return res.status(error?.name === "AbortError" ? 504 : 422).json({ error: error?.name === "AbortError" ? "Reading the label took too long. Try clearer, closer photos." : "The label could not be read. Retake the photo in good light or enter the values manually." });
  } finally { clearTimeout(timeout); }
}
