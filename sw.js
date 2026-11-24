const C="scheda-v1";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.add("./index.html")))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
// Serve dalla cache subito, intanto aggiorna in background se c'è rete
self.addEventListener("fetch",e=>{
  if(e.request.mode!="navigate")return;
  e.respondWith(caches.open(C).then(async c=>{
    const net=fetch("./index.html",{cache:"no-cache"}).then(r=>{if(r.ok)c.put("./index.html",r.clone());return r}).catch(()=>null);
    const hit=await c.match("./index.html");
    return hit||(await net)||Response.error();
  }));
});
