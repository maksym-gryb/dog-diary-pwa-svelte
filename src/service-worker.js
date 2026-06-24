/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const CACHE = `app-cache-${version}`;

const ASSETS = [...build, ...files];

// Install: cache assets
self.addEventListener('install', (event/*: ExtendableEvent*/) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );

  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event/*: ExtendableEvent*/) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE) return caches.delete(key);
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch: cache-first strategy
// self.addEventListener('fetch', (event/*: FetchEvent*/) => {
//   const { request } = event;

//   event.respondWith(
//     caches.match(request).then((cached) => {
//       if (cached) return cached;

//       return fetch(request)
//         .then((res) => {
//           const copy = res.clone();
//           caches.open(CACHE).then((cache) => cache.put(request, copy));
//           return res;
//         })
//         .catch(() => caches.match('/offline.html'));
//     })
//   );
// });

// only cache GET && same-origin assets
const isCacheableRequest = (request) =>
  request.method === "GET" &&
  new URL(request.url).origin === self.location.origin;

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (!isCacheableRequest(request)) {
    return fetch(request);
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => res.ok ? res : Promise.reject())
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          // cache get requests
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match('/offline.html'));
    })
  );
});