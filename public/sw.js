const CACHE = "new-you-v6";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).pathname.startsWith("/api/")) return;
  event.respondWith(fetch(event.request).then((response) => { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); return response; }).catch(() => caches.match(event.request)));
});
self.addEventListener("message", (event) => {
  if (event.data?.type === "FOOD_REMINDER") self.registration.showNotification("New You food check-in", { body: event.data.body || "Take a moment to log what you ate.", icon: "/icon-192.png", badge: "/icon-192.png", tag: event.data.tag || "new-you-food-reminder", renotify: true });
});
self.addEventListener("notificationclick", (event) => { event.notification.close(); event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => windows[0] ? windows[0].focus() : clients.openWindow("/"))); });
