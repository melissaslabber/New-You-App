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
      const wantedPrefix = keyFor(prefix, shared);
      const keys = [];
      for (let index = 0; index < localStorage.length; index += 1) {
        const storedKey = localStorage.key(index);
        if (storedKey?.startsWith(wantedPrefix)) keys.push(storedKey.replace(keyFor("", shared), ""));
      }
      return { keys, prefix, shared };
    },
  };
}
