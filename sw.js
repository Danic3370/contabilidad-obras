// Service Worker - Contabilidad Obras
const CACHE = 'obras-v2';
const ASSETS = [
  '/', '/index.html', '/manifest.json',
  '/favicon.ico', '/favicon-16.png', '/favicon-32.png', '/favicon-48.png',
  '/icon-192.png', '/icon-512.png',
  '/icon-maskable-192.png', '/icon-maskable-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // Se cachea cada archivo por separado: si uno falta, no se cae la instalación
      .then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Para requests a Supabase, siempre ir a la red
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
