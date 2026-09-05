// Vercel serverless function — stores each member's own app data (goals,
// weight/body fat log, food log, favorites, liked foods) in Vercel KV, keyed
// by their access code. This is what makes a member's data follow them
// across devices, and lets staff view any member's progress from the admin
// panel using the same code.

import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const code = (req.method === "GET" ? req.query.code : req.body?.code);
  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }
  const key = `data:${String(code).toUpperCase()}`;

  try {
    if (req.method === "GET") {
      const data = (await kv.get(key)) || {};
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { data } = req.body || {};
      if (!data) return res.status(400).json({ error: "Missing data" });
      await kv.set(key, data);
      return res.status(200).json({ saved: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: `KV request failed — is a KV store connected to this project? (${e.message})` });
  }
}
