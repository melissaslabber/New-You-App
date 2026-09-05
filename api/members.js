// Vercel serverless function — manages the shared member access list using
// Vercel KV, so member codes work from any device (not just the one that
// added them). Requires a KV store connected to this project (Vercel
// dashboard -> Storage -> Create Database -> KV), which auto-adds the
// KV_REST_API_URL / KV_REST_API_TOKEN environment variables this needs.

import { kv } from "@vercel/kv";

const ADMIN_PIN = "1412"; // keep this in sync with ADMIN_PIN in src/App.jsx

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, code, pin, name, id } = req.body || {};

  try {
    // Public action — any member's own login screen calls this, no PIN needed.
    if (action === "checkCode") {
      if (!code) return res.status(400).json({ error: "Missing code" });
      const members = (await kv.get("members")) || [];
      const entry = members.find((m) => m.code.toUpperCase() === String(code).toUpperCase());
      if (!entry) return res.status(200).json({ valid: false });
      return res.status(200).json({ valid: true, active: entry.active, name: entry.name });
    }

    // Everything below is staff-only — require the matching PIN.
    if (pin !== ADMIN_PIN) {
      return res.status(403).json({ error: "Incorrect staff PIN" });
    }

    if (action === "list") {
      const members = (await kv.get("members")) || [];
      return res.status(200).json({ members });
    }

    if (action === "add") {
      if (!name || !code) return res.status(400).json({ error: "Missing name or code" });
      const members = (await kv.get("members")) || [];
      members.push({ id: genId(), name: String(name).trim(), code: String(code).trim().toUpperCase(), active: true });
      await kv.set("members", members);
      return res.status(200).json({ members });
    }

    if (action === "toggle") {
      if (!id) return res.status(400).json({ error: "Missing id" });
      const members = (await kv.get("members")) || [];
      const updated = members.map((m) => (m.id === id ? { ...m, active: !m.active } : m));
      await kv.set("members", updated);
      return res.status(200).json({ members: updated });
    }

    if (action === "remove") {
      if (!id) return res.status(400).json({ error: "Missing id" });
      const members = (await kv.get("members")) || [];
      const updated = members.filter((m) => m.id !== id);
      await kv.set("members", updated);
      return res.status(200).json({ members: updated });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: `KV request failed — is a KV store connected to this project? (${e.message})` });
  }
}
