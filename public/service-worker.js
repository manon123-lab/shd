const basePath = '/shd/';

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("app-cache").then(cache => {
      return cache.addAll([
        basePath,
        basePath + 'index.html',
        // add other static assets you want cached (css, js, images)
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        // Return offline page or cached asset if available
        return caches.match(basePath + 'index.html');
      });
    })
  );
});