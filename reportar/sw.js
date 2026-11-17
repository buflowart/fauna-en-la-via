// Service worker: deja la página disponible sin señal y envía la cola en segundo plano
// (en Android, cuando el navegador lo permite). Al cambiar archivos, subir la versión.
const CACHE = 'fauna-via-v6';
const ARCHIVOS = ['./', 'index.html', 'app.js', 'manifest.webmanifest', 'icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Red primero (para recibir cambios), con la copia guardada si no hay señal o tarda más de 4 s.
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith((async () => {
    const guardada = await caches.match(e.request, { ignoreSearch: true });
    // no-cache: pregunta siempre a GitHub si hay versión nueva (sin esto, el celular puede quedarse 10 min con la vieja)
    const red = fetch(e.request.url, { cache: 'no-cache' }).then((resp) => {
      if (resp.ok) { const copia = resp.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); }
      return resp;
    });
    if (!guardada) return red;
    const espera = new Promise((ok) => setTimeout(() => ok(guardada), 4000));
    return Promise.race([red.catch(() => guardada), espera]);
  })());
});

// ===== Envío en segundo plano =====
function abrirDB() {
  return new Promise((ok, mal) => {
    const q = indexedDB.open('reportes', 1);
    q.onupgradeneeded = () => q.result.createObjectStore('cola', { keyPath: 'id' });
    q.onsuccess = () => ok(q.result); q.onerror = () => mal(q.error);
  });
}
function tx(d, modo, fn) {
  return new Promise((ok, mal) => {
    const t = d.transaction('cola', modo);
    const req = fn(t.objectStore('cola'));
    t.oncomplete = () => ok(req ? req.result : undefined);
    t.onerror = () => mal(t.error);
  });
}
async function vaciarCola() {
  const d = await abrirDB();
  const items = await tx(d, 'readonly', (s) => s.getAll());
  for (const x of items) {
    const { destino, ...datos } = x;
    if (!destino) continue; // modo prueba: lo maneja la página
    const resp = await fetch(destino, { method: 'POST', body: JSON.stringify(datos) });
    const j = await resp.json();
    if (!j.ok) throw new Error('El servidor no aceptó el reporte');
    await tx(d, 'readwrite', (s) => s.delete(x.id));
  }
}
self.addEventListener('sync', (e) => {
  if (e.tag === 'enviar-reportes') e.waitUntil(vaciarCola());
});
