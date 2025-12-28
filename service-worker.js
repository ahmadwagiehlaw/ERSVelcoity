// ✅ Cache version (غيّر الرقم مع كل تحديث مهم)
const CACHE_NAME = 'ers-velocity-v1.3-static';

// ✅ خليك في المحلي فقط عشان install مايفشلش بسبب روابط خارجية
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './ers-logo.png',
  './service-worker.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // ✅ صفحات التنقل: Network-first لضمان آخر نسخة
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // ✅ باقي الملفات: Cache-first
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
