// Service worker disabled due to caching conflicts with GitHub Pages
// Uncomment and configure when needed for production PWA

/*
const basePath = '/shd/';

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("app-cache").then(cache => {
      return cache.addAll([
        basePath,
        basePath + 'index.html',
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        return caches.match(basePath + 'index.html');
      });
    })
  );
});
*/