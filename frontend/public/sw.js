// Service Worker for PWA functionality
const CACHE_NAME = 'pothole-reporter-v1';
const STATIC_CACHE = 'pothole-static-v1';
const DYNAMIC_CACHE = 'pothole-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/citizen',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
  // Add other static assets
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (except for allowed domains)
  if (!url.origin.includes(self.location.origin) &&
      !url.origin.includes('clerk.dev') &&
      !url.origin.includes('openstreetmap.org') &&
      !url.origin.includes('tile.openstreetmap.org')) {
    return;
  }

  // Handle API requests - network first, then cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets - cache first
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache if not successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (request.destination === 'document') {
              return caches.match('/citizen');
            }
          });
      })
  );
});

// Background sync for offline reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();

    // Find pending reports in cache
    const reportRequests = keys.filter(request =>
      request.url.includes('/api/reports') && request.method === 'POST'
    );

    for (const request of reportRequests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.log('Failed to sync report:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}