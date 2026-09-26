/* Minimal Virilion PWA service worker — network-first docs, shell assets only */
const CACHE = "virilion-staging-v3";
const PRECACHE = ["/manifest.webmanifest", "/virilion-logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  // Never cache-first HTML/document navigations — stale / shell was resetting Realm presence UI.
  const isDocument =
    event.request.mode === "navigate" ||
    event.request.destination === "document" ||
    (event.request.headers.get("accept") || "").includes("text/html");
  if (isDocument || url.pathname === "/" || url.pathname.endsWith(".html")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => res)
        .catch(() => caches.match(event.request))
    );
    return;
  }
  // Static shell assets: cache falling back to network
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
