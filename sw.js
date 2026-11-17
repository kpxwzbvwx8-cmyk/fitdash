// Offline-Cache: App startet auch ohne Internet.
// Immer zuerst frisch vom Server laden (am Browser-Zwischenspeicher vorbei),
// nur ohne Netz die gespeicherte Kopie verwenden.
const C='fitdash-v14';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==location.origin)return;
  const key=url.origin+url.pathname;
  e.respondWith(fetch(key,{cache:'no-store',credentials:'same-origin'})
    .then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(key,cp))}return r})
    .catch(()=>caches.match(key).then(m=>m||caches.match(url.origin+url.pathname.replace(/[^/]*$/,'')))));
});
