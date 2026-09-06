// Citri-Fresh Service Worker - Soporte Offline Resiliente y Caché Dinámico
const CACHE_NAME = 'citrifresh-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/pages/inicio.html',
  '/pages/producto.html',
  '/pages/nosotros.html',
  '/pages/registro_cosecha.html',
  '/pages/perfil.html',
  '/pages/carrito.html',
  '/pages/panel_productor.html',
  '/pages/auth/login.html',
  '/pages/auth/registro.html',
  '/css/reset.css',
  '/css/variables.css',
  '/css/fonts.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/nav.css',
  '/css/footer.css',
  '/css/catalog.css',
  '/css/home.css',
  '/css/auth.css',
  '/css/cart.css',
  '/js/app.js',
  '/manifest.json',
  '/public/images/n-comer.jpg',
  '/public/images/l-criollo.jpg',
  '/public/images/mandarina.jpeg'
];

// Instalación: Guardar recursos estáticos principales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Citri-Fresh SW] Precargando activos críticos para funcionamiento offline...');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[Citri-Fresh SW] Algunos activos no se precargaron:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Citri-Fresh SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones (Estrategia: Network-First con fallback a Caché para API y Cache-First con Network Fallback para Estáticos)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorar peticiones que no sean GET (POST/PUT/DELETE se manejan en la cola de sincronización de la app)
  if (req.method !== 'GET') {
    return;
  }

  // Peticiones a la API de datos (productos, zonas, etc.) -> Network First con respaldo en caché
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.ok) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(req).then((cachedRes) => {
            if (cachedRes) {
              console.log('[Citri-Fresh SW] Devolviendo datos API desde caché offline:', req.url);
              return cachedRes;
            }
            return new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Peticiones de Páginas y Activos Estáticos -> Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si no hay red y se pedía una página HTML, devolver la página solicitada en caché o inicio
          if (req.headers.get('accept')?.includes('text/html')) {
            return cachedResponse || caches.match('/pages/inicio.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
