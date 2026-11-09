const CACHE = "nt-v4";

self.addEventListener("install", () => {
  // Skip waiting immediately — no blocking network request on install.
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

// Network-first for navigation — never breaks Next.js SSR/ISR pages.
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match("/").then((r) => r ?? Response.error())
    )
  );
});
