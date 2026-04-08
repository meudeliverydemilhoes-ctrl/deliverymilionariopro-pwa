const CACHE='delivery-pro-v1';
const URLS=['./','./index.html','https://cdn.tailwindcss.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
if(e.request.method!=='GET')return;
if(e.request.url.includes('/api/')){
e.respondWith(fetch(e.request).catch(()=>new Response(JSON.stringify({error:'Offline'}),{headers:{'Content-Type':'application/json'}})));
return;}
e.respondWith(fetch(e.request).then(r=>{if(r.ok){const rc=r.clone();caches.open(CACHE).then(c=>c.put(e.request,rc));}return r;}).catch(()=>caches.match(e.request)));
});