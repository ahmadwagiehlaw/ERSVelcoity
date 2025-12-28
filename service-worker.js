// غيرنا الاسم هنا لـ V12 عشان نجبر المتصفح يحمل التحديث الجديد
const CACHE_NAME = 'ers-velocity-v12-static';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './ers-logo.png',
  // ضيف أي ملفات تانية لو عندك صور تانية
  'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // مهم: يخلي التحديث ينزل فوراً
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // استراتيجية: الشبكة أولاً للملف الرئيسي، عشان دايما يشوف آخر تحديث
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
  }
});
