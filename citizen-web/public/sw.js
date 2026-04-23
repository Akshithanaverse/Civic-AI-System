const CACHE_NAME = 'civic-ai-citizen-v2'; // Updated version to force cache refresh
const URLS_TO_CACHE = ['/', '/index.html', '/Citizen app logo.png', '/manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Skip caching for data URLs (blob:, data:) and API calls
  if (event.request.url.startsWith('data:') ||
      event.request.url.startsWith('blob:') ||
      event.request.url.includes('/api/') ||
      event.request.method !== 'GET') {
    return; // Don't cache, let it go to network
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(networkResponse => {
        // Only cache successful GET requests for static assets
        if (networkResponse.ok && networkResponse.type === 'basic') {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Fallback for offline - only return cached index.html for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
