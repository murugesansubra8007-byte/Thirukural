self.options = {
    "domain": "5gvci.com",
    "zoneId": 11920028
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')

/* குறளகம் — service worker. Build stamps CACHE_VERSION via mumifwho. */
const CACHE_VERSION = 'mumjt5vp';
const CACHE = 'kuralagam-' + CACHE_VERSION;
const OFFLINE = '/offline.html';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  OFFLINE,
  '/manifest.webmanifest',
  '/resources/images/logo.png',
  '/resources/images/icons/icon-192.png',
  '/resources/images/icons/icon-512.png',
  '/resources/images/icons/icon-512-maskable.png',
  '/resources/images/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request, OFFLINE));
    return;
  }
  event.respondWith(staleWhileRevalidate(event.request));
});

async function networkFirst(request, fallback) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallback) {
      const off = await cache.match(fallback);
      if (off) return off;
    }
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    return cached || new Response('', { status: 408, statusText: 'Offline' });
  }
}