const APP_NAME = "AmazonUrlShortener";
const VERSION = "202405290844JST";
const CACHE_NAME = APP_NAME + "_" + VERSION;
const assets = [
    "/amazon-url-shortener/",
    "/amazon-url-shortener/index.html",
    "/amazon-url-shortener/img/favicon.png",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
    "/amazon-url-shortener/css/style.css",
    "/amazon-url-shortener/js/main.js",
];

/**
 * Handling service worker install events
 */
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assets);
        })
    );
});

/**
 * What happens when you access the server from a service worker
 */
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            // If the file is cached, it will be referenced locally without any communication.
            return response ? response : fetch(e.request);
        })
    );
});

/**
 * What happens when a service worker starts
 */
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});
