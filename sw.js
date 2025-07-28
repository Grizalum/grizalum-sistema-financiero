/**
 * ================================================================
 * GRIZALUM - SERVICE WORKER PROFESIONAL v3.0
 * Sistema Financiero Empresarial Premium
 * Optimizado para sincronización perfecta con dashboard
 * ================================================================
 */

const VERSION = '3.0.0';
const CACHE_NAME = `grizalum-financiero-v${VERSION}`;
const STATIC_CACHE = `grizalum-static-v${VERSION}`;
const DYNAMIC_CACHE = `grizalum-dynamic-v${VERSION}`;

// Archivos críticos del sistema GRIZALUM
const CRITICAL_FILES = [
    '/',
    '/index.html',
    // CSS crítico
    '/src/assets/css/styles.css',
    // JavaScript esencial
    '/src/assets/js/charts.js',
    // Fuentes profesionales
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    // Iconos FontAwesome
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    // Chart.js para gráficos
    'https://unpkg.com/chart.js'
];

// URLs que NUNCA deben cachearse (para evitar problemas de versiones)
const NEVER_CACHE = [
    '/api/',
    'chrome-extension://',
    'moz-extension://',
    'localhost:',
    '127.0.0.1'
];

// ================================================================
// INSTALACIÓN PROFESIONAL
// ================================================================
self.addEventListener('install', event => {
    console.log(`🚀 GRIZALUM SW v${VERSION}: Instalando...`);
    
    event.waitUntil(
        Promise.all([
            // Cachear archivos críticos
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 GRIZALUM SW: Cacheando archivos críticos');
                return cache.addAll(CRITICAL_FILES.filter(file => 
                    !NEVER_CACHE.some(never => file.includes(never))
                ));
            }),
            // Activación inmediata para nuevas versiones
            self.skipWaiting()
        ]).then(() => {
            console.log('✅ GRIZALUM SW: Instalación completada');
        }).catch(error => {
            console.warn('⚠️ GRIZALUM SW: Error en instalación:', error);
        })
    );
});

// ================================================================
// ACTIVACIÓN PROFESIONAL
// ================================================================
self.addEventListener('activate', event => {
    console.log(`⚡ GRIZALUM SW v${VERSION}: Activando...`);
    
    event.waitUntil(
        Promise.all([
            // Limpiar cachés obsoletos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.includes('grizalum') && 
                            !cacheName.includes(VERSION)) {
                            console.log('🗑️ GRIZALUM SW: Eliminando caché obsoleto:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Tomar control inmediato
            self.clients.claim()
        ]).then(() => {
            console.log('✅ GRIZALUM SW: Activación completada');
            
            // Notificar a todas las pestañas del nuevo SW
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_UPDATED',
                        version: VERSION,
                        message: 'GRIZALUM actualizado correctamente'
                    });
                });
            });
        })
    );
});

// ================================================================
// ESTRATEGIA DE FETCH PROFESIONAL
// ================================================================
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Ignorar peticiones no HTTP
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Ignorar URLs específicas
    if (NEVER_CACHE.some(never => request.url.includes(never))) {
        return;
    }
    
    // Estrategia según el tipo de recurso
    if (isDocumentRequest(request)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (isStaticAsset(request)) {
        event.respondWith(cacheFirstStrategy(request));
    } else {
        event.respondWith(networkFirstStrategy(request));
    }
});

// ================================================================
// ESTRATEGIAS PROFESIONALES
// ================================================================

/**
 * Network First - Para documentos HTML y datos críticos
 * Prioriza contenido fresco, usa caché como respaldo
 */
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request, {
            cache: 'no-cache' // Fuerza contenido fresco
        });
        
        if (networkResponse.ok && request.method === 'GET') {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('⚠️ GRIZALUM SW: Red no disponible, usando caché');
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Notificar modo offline
            notifyOfflineMode();
            return cachedResponse;
        }
        
        return createOfflineResponse();
    }
}

/**
 * Cache First - Para assets estáticos (CSS, JS, imágenes)
 * Prioriza velocidad, actualiza en segundo plano
 */
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Actualizar en segundo plano si es necesario
        fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
                caches.open(STATIC_CACHE).then(cache => {
                    cache.put(request, networkResponse);
                });
            }
        }).catch(() => {
            // Red no disponible, usar caché existente
        });
        
        return cachedResponse;
    }
    
    // Si no está en caché, ir a red
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return createOfflineResponse();
    }
}

// ================================================================
// UTILIDADES PROFESIONALES
// ================================================================

function isDocumentRequest(request) {
    return request.destination === 'document' || 
           request.headers.get('accept')?.includes('text/html');
}

function isStaticAsset(request) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => request.url.includes(ext)) ||
           request.url.includes('fonts.googleapis.com') ||
           request.url.includes('cdnjs.cloudflare.com') ||
           request.url.includes('unpkg.com');
}

function createOfflineResponse() {
    if (isDocumentRequest({ url: '/', headers: new Headers() })) {
        // Para documentos HTML, devolver página offline
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>GRIZALUM - Offline</title>
                <meta charset="UTF-8">
                <style>
                    body { 
                        font-family: 'Inter', sans-serif; 
                        text-align: center; 
                        padding: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    .logo { font-size: 3rem; margin-bottom: 1rem; }
                    .message { font-size: 1.2rem; opacity: 0.9; }
                </style>
            </head>
            <body>
                <div class="logo">📊 GRIZALUM</div>
                <h1>Modo Offline</h1>
                <p class="message">Sistema funcionando sin conexión</p>
                <p>Reconectando automáticamente...</p>
                <script>
                    setTimeout(() => window.location.reload(), 5000);
                </script>
            </body>
            </html>
        `, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    // Para otros recursos
    return new Response(JSON.stringify({
        error: 'Recurso no disponible offline',
        service: 'GRIZALUM Financiero',
        version: VERSION
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
    });
}

function notifyOfflineMode() {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'OFFLINE_MODE',
                message: 'GRIZALUM funcionando offline'
            });
        });
    });
}

// ================================================================
// COMUNICACIÓN PROFESIONAL CON LA APP
// ================================================================
self.addEventListener('message', event => {
    const { type, data } = event.data || {};
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0]?.postMessage({ version: VERSION });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0]?.postMessage({ success: true });
            });
            break;
            
        case 'FORCE_REFRESH':
            // Forzar actualización de caché
            caches.delete(DYNAMIC_CACHE).then(() => {
                event.ports[0]?.postMessage({ refreshed: true });
            });
            break;
    }
});

// ================================================================
// LIMPIEZA PROFESIONAL
// ================================================================
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    const grizalumCaches = cacheNames.filter(name => name.includes('grizalum'));
    
    await Promise.all(grizalumCaches.map(name => caches.delete(name)));
    console.log('🗑️ GRIZALUM SW: Cachés limpiados');
}

// ================================================================
// NOTIFICACIONES PROFESIONALES
// ================================================================
self.addEventListener('push', event => {
    const data = event.data?.json() || {};
    
    const options = {
        body: data.body || 'Nueva actualización en GRIZALUM',
        icon: '/src/assets/images/icon-192x192.png',
        badge: '/src/assets/images/badge-72x72.png',
        data: { url: data.url || '/' },
        actions: [
            { action: 'open', title: 'Abrir Dashboard' },
            { action: 'dismiss', title: 'Descartar' }
        ],
        requireInteraction: false,
        silent: false
    };
    
    event.waitUntil(
        self.registration.showNotification('GRIZALUM Financiero', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(clients.openWindow('/'));
    }
});

// ================================================================
// LOGGING PROFESIONAL
// ================================================================
console.log(`
🏆 ===================================================
   GRIZALUM SERVICE WORKER v${VERSION} - PROFESIONAL
🏆 ===================================================

✅ CARACTERÍSTICAS:
   • Network First para contenido fresco
   • Cache inteligente para assets estáticos
   • Limpieza automática de versiones obsoletas
   • Notificaciones offline profesionales
   • Comunicación bidireccional con dashboard
   • Optimizado para métricas en tiempo real

🎯 ESTRATEGIA:
   • HTML/Datos: Siempre fresco (Network First)
   • CSS/JS/Imágenes: Cache con actualización background
   • Fallback offline elegante y funcional

🏆 ===================================================
`);

// Auto-registro de debugging en desarrollo
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('🔧 GRIZALUM SW: Modo desarrollo detectado');
}
