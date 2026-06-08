/* Gym Diary service worker — offline app shell, network-first for navigations. */
const CACHE = "gymdiary-v1";
const CORE = [
  "./",
  "index.html",
  "styles.css",
  "data.js",
  "exercise-meta.js",
  "app.js",
  "manifest.json",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Same-origin app shell: network-first so deploys/edits always win when online,
  // falling back to cache when offline (the part that makes it installable).
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match("index.html")))
    );
    return;
  }

  // Cross-origin (exercise GIFs on jsDelivr etc): stale-while-revalidate.
  e.respondWith(
    caches.open(CACHE).then(c =>
      c.match(req).then(hit => {
        const net = fetch(req).then(res => { c.put(req, res.clone()).catch(() => {}); return res; }).catch(() => hit);
        return hit || net;
      })
    )
  );
});
