const CACHE_NAME = "waterwatch";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/emergency-water.html",
  "/css/main.css",
  "/data/schedule.json",
  "/js/main.js",
  "/js/service-worker.js",
  "/img/favicon.png",
  "/img/manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(URLS_TO_CACHE).catch((err) => console.log(err))
      )
      .catch((err) => console.log(err))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((resp) => resp || fetch(e.request).catch((err) => console.log(err)))
  );
});
