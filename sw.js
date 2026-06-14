const CACHE = 'atlas-v4';

const PRECACHE = [
  './platform.html',
  './index.html',
  './workout-bank.html',
  './manifest.json',
  './sw.js',
  // icons
  './icons/icon-57.png',
  './icons/icon-60.png',
  './icons/icon-72.png',
  './icons/icon-76.png',
  './icons/icon-96.png',
  './icons/icon-114.png',
  './icons/icon-120.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-167.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  // splash screens
  './splash/splash-640x1136.png',
  './splash/splash-750x1334.png',
  './splash/splash-1242x2208.png',
  './splash/splash-1125x2436.png',
  './splash/splash-1242x2688.png',
  './splash/splash-828x1792.png',
  './splash/splash-1170x2532.png',
  './splash/splash-1284x2778.png',
  './splash/splash-1179x2556.png',
  './splash/splash-1290x2796.png',
];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Atlas — Offline</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{
    background:#0A0A0F;color:#F0F0F5;
    font-family:'Inter',-apple-system,sans-serif;
    display:flex;flex-direction:column;align-items:center;
    justify-content:center;min-height:100vh;
    padding:env(safe-area-inset-top) env(safe-area-inset-right)
            env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
  .icon{width:64px;height:64px;background:#111118;border-radius:16px;
        border:1px solid #2A2A3D;
        display:flex;align-items:center;justify-content:center;
        font-size:28px;font-weight:700;color:#4F8EF7;margin-bottom:20px;
        font-family:-apple-system,sans-serif;letter-spacing:-0.02em}
  h1{font-size:20px;font-weight:600;margin-bottom:6px;letter-spacing:-0.02em}
  p{font-size:13px;color:#8888AA;text-align:center;max-width:260px;line-height:1.6}
  .dot{width:6px;height:6px;background:#4F8EF7;border-radius:50%;
       display:inline-block;margin-bottom:28px;opacity:0.6}
</style>
</head>
<body>
  <div class="icon">A</div>
  <h1>ATLAS</h1>
  <span class="dot"></span>
  <p>You're offline. Connect to the internet and reload to continue.</p>
</body>
</html>`;

// ── INSTALL: pre-cache everything ─────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => null))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: purge old caches ────────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first for same-origin, network-first for cross-origin ────────
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // Cross-origin (Google Fonts, CDN): network-first, cache fallback
  if (url.origin !== self.location.origin) {
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // HTML navigation: network-first so updates always show immediately
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      }).catch(() => {
        return caches.match(request).then(cached => cached ||
          new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } })
        );
      })
    );
    return;
  }

  // Other same-origin assets (icons, JS, etc): cache-first, fall back to network
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      }).catch(() => new Response('', { status: 408 }));
    })
  );
});

// ── MESSAGE: skipWaiting on demand (for update banner) ────────────────────────
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
