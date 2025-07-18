// GRIZALUM - Service Worker para PWA
// Sistema Financiero Empresarial Premium

const CACHE_NAME = 'grizalum-financiero-v1.2.0';
const STATIC_CACHE = 'grizalum-static-v1.2.0';
const DYNAMIC_CACHE = 'grizalum-dynamic-v1.2.0';

// Archivos esenciales para cachear
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/assets/css/styles.css',
    '/src/assets/css/responsive.css',
    '/src/assets/js/main.js',
    '/src/assets/js/charts.js',
    '/src/assets/js/ai.js',
    // CDN Resources
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js'
];

// URLs dinámicas que se cachearán según uso
const DYNAMIC_URLS = [
    '/api/dashboard',
    '/api/cash-flow',
    '/api/transactions',
    '/api/reports'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    console.log('🚀 GRIZALUM SW: Instalando Service Worker v1.2.0');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 GRIZALUM SW: Cacheando archivos estáticos');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ GRIZALUM SW: Archivos estáticos cacheados correctamente');
                return self.skipWaiting(); // Fuerza la activación inmediata
            })
            .catch(error => {
                console.error('❌ GRIZALUM SW: Error cacheando archivos:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    console.log('⚡ GRIZALUM SW: Activando Service Worker');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Eliminar cachés antiguos
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ GRIZALUM SW: Eliminando caché obsoleto:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ GRIZALUM SW: Service Worker activado correctamente');
                return self.clients.claim(); // Toma control inmediato
            })
    );
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Solo manejar peticiones HTTP/HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Estrategia: Cache First para archivos estáticos
    if (isStaticAsset(request.url)) {
        event.respondWith(cacheFirst(request));
    }
    // Estrategia: Network First para API y datos dinámicos
    else if (isApiRequest(request.url)) {
        event.respondWith(networkFirst(request));
    }
    // Estrategia: Stale While Revalidate para documentos HTML
    else if (request.destination === 'document') {
        event.respondWith(staleWhileRevalidate(request));
    }
    // Estrategia por defecto
    else {
        event.respondWith(networkFirst(request));
    }
});

// Estrategia Cache First - Para archivos estáticos (CSS, JS, imágenes)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('⚠️ GRIZALUM SW: Error en Cache First:', error);
        return caches.match('/offline.html') || createOfflineResponse();
    }
}

// Estrategia Network First - Para API y datos dinámicos
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('⚠️ GRIZALUM SW: Red no disponible, buscando en caché');
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Mostrar banner de modo offline
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'OFFLINE_MODE',
                        message: 'Trabajando en modo offline'
                    });
                });
            });
            return cachedResponse;
        }
        return createOfflineResponse();
    }
}

// Estrategia Stale While Revalidate - Para documentos HTML
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const networkPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => null);
    
    return cachedResponse || networkPromise || createOfflineResponse();
}

// Detectar si es un archivo estático
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
    return staticExtensions.some(ext => url.includes(ext)) || 
           url.includes('fonts.googleapis.com') || 
           url.includes('cdnjs.cloudflare.com');
}

// Detectar si es una petición a API
function isApiRequest(url) {
    return url.includes('/api/') || 
           url.includes('localhost:3000') || 
           url.includes('grizalum-api');
}

// Crear respuesta offline personalizada
function createOfflineResponse() {
    return new Response(
        JSON.stringify({
            error: 'No hay conexión a internet',
            message: 'GRIZALUM está funcionando en modo offline',
            timestamp: new Date().toISOString(),
            offline: true
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }
    );
}

// Manejar mensajes del cliente
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CACHE_TRANSACTION':
            // Cachear transacción para sincronización posterior
            cacheTransaction(data);
            break;
            
        case 'GET_CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage(status);
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
    }
});

// Cachear transacción para sincronización offline
async function cacheTransaction(transactionData) {
    try {
        const cache = await caches.open('grizalum-transactions');
        const key = `transaction-${Date.now()}`;
        const response = new Response(JSON.stringify(transactionData));
        await cache.put(key, response);
        console.log('💾 Transacción cacheada para sincronización:', key);
    } catch (error) {
        console.error('❌ Error cacheando transacción:', error);
    }
}

// Obtener estado del caché
async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        status[cacheName] = {
            size: keys.length,
            lastModified: new Date().toISOString()
        };
    }
    
    return status;
}

// Limpiar todos los cachés
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🗑️ Todos los cachés eliminados');
}

// Sincronización en segundo plano
self.addEventListener('sync', event => {
    console.log('🔄 GRIZALUM SW: Evento de sincronización:', event.tag);
    
    if (event.tag === 'grizalum-sync-transactions') {
        event.waitUntil(syncTransactions());
    }
    
    if (event.tag === 'grizalum-sync-reports') {
        event.waitUntil(syncReports());
    }
});

// Sincronizar transacciones cuando hay conectividad
async function syncTransactions() {
    try {
        console.log('📡 Sincronizando transacciones pendientes...');
        
        const cache = await caches.open('grizalum-transactions');
        const requests = await cache.keys();
        
        for (const request of requests) {
            try {
                const response = await cache.match(request);
                const transactionData = await response.json();
                
                // Enviar al servidor
                const syncResponse = await fetch('/api/transactions/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transactionData)
                });
                
                if (syncResponse.ok) {
                    await cache.delete(request);
                    console.log('✅ Transacción sincronizada y eliminada del caché');
                }
            } catch (error) {
                console.warn('⚠️ Error sincronizando transacción:', error);
            }
        }
    } catch (error) {
        console.error('❌ Error en sincronización de transacciones:', error);
    }
}

// Sincronizar reportes
async function syncReports() {
    try {
        console.log('📊 Sincronizando reportes...');
        // Implementar lógica de sincronización de reportes
    } catch (error) {
        console.error('❌ Error sincronizando reportes:', error);
    }
}

// Notificaciones push
self.addEventListener('push', event => {
    console.log('🔔 GRIZALUM SW: Notificación push recibida');
    
    const options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: '/src/assets/images/icon-192x192.png',
        badge: '/src/assets/images/badge-72x72.png',
        data: {
            url: '/',
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'open',
                title: 'Abrir GRIZALUM'
            },
            {
                action: 'close',
                title: 'Cerrar'
            }
        ],
        requireInteraction: true,
        vibrate: [200, 100, 200]
    };
    
    event.waitUntil(
        self.registration.showNotification('GRIZALUM Financiero', options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
    console.log('👆 Click en notificación:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Logging para debugging
console.log('🏗️ GRIZALUM Service Worker cargado correctamente');
console.log('📋 Versión:', CACHE_NAME);
console.log('⚙️ Estrategias configuradas: Cache First, Network First, Stale While Revalidate');
console.log('🔄 Sincronización offline habilitada');
console.log('🔔 Notificaciones push configuradas');
