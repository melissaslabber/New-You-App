// Standalone-deploy storage shim.
// Claude's artifact preview provides a built-in window.storage API that syncs
// data across users/devices. Outside that preview (e.g. once deployed to
// Vercel/Netlify), no such service exists automatically — so this shim keeps
// the app working using the browser's localStorage instead.
//
// IMPORTANT: localStorage is per-browser/per-device only. That means the
// member access-code list (used for the paid-access gate) will NOT sync
// across different members' phones until this is connected to a real
// backend/database. Fine for your own testing on one device; not yet
// suitable for real multi-member gating. See README.md.

function keyFor(key, shared) {
  return shared ? `nyf-shared:${key}` : `nyf-personal:${key}`;
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key, shared = false) {
      const raw = localStorage.getItem(keyFor(key, shared));
      if (raw === null) throw new Error("Key not found");
      return { key, value: raw, shared };
    },
    async set(key, value, shared = false) {
      localStorage.setItem(keyFor(key, shared), value);
      return { key, value, shared };
    },
    async delete(key, shared = false) {
      localStorage.removeItem(keyFor(key, shared));
      return { key, deleted: true, shared };
    },
    async list(prefix = "", shared = false) {
      const p = keyFor(prefix, shared);
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(p)) keys.push(k.replace(keyFor("", shared), ""));
      }
      return { keys, prefix, shared };
    },
  };
}
