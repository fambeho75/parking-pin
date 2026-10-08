/* Parking Pin — minimal offline cache */
const CACHE = "parking-pin-v18";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg?v=17",
  "./apple-touch-icon.png?v=17",
  "./favicon-32.png?v=17",
  "./icon-192.png?v=17",
  "./icon-512.png?v=17",
  "./icon-maskable-192.png?v=17",
  "./icon-maskable-512.png?v=17"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
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
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Do not intercept sw.js. A cached worker script would block later updates.
  if (url.pathname.endsWith("/sw.js")) return;

  const isAppShell = req.mode === "navigate" ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith("/index.html");

  if (isAppShell) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
