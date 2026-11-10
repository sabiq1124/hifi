const V='hifz-v6';const CORE=['./','index.html','quran.json','layouts.json','indopak.woff2','timing.json','similar.json','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='hifz-api').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const keep=(name,req,res)=>{if(res&&res.ok){const c=res.clone();caches.open(name).then(x=>x.put(req,c))}return res};
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  if(u.origin===location.origin){ // network first for the page (to get updates), cache first for data
    if(e.request.mode==='navigate'||u.pathname.endsWith('index.html')){e.respondWith(fetch(e.request).then(r=>keep(V,e.request,r)).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));return}
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>keep(V,e.request,n))));return}
  if(u.hostname==='api.quran.com'){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>keep('hifz-api',e.request,n))));return}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>keep(V,e.request,n))))}});
