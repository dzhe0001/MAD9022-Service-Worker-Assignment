const version = "1";
const cacheName = `ddzhemchuk-${version}`;

self.addEventListener("fetch", (e) => {
  if (e.request.url.startsWith("https://random-data-api.com/")) {
    e.respondWith(
      caches.match("/users.json").then((resp) => {
        if (resp) {
          return resp;
        }

        return caches.open(cacheName).then((cache) =>
          fetch(e.request).then((resp) => {
            const customReq = new Request("/users.json", {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });

            cache.put(customReq, resp.clone());
            return resp;
          })
        );
      })
    );
  } else {
    return fetch(e.request);
  }
});

self.addEventListener("message", (ev) => {
  clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      if (client.id === ev.source.id) return;
      client.postMessage(ev.data);
    });
  });
});