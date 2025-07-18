// ===================================================================
// GRIZALUM - Service Worker
// Funcionalidad offline y cache inteligente
// ===================================================================

const CACHE_NAME = 'grizalum-v2.0.0';
const CACHE_VERSION = 'v2.0.0';

// Archivos críticos que se cachean inmediatamente
const CORE_CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/assets/css/styles.css',
  '/src/assets/css/responsive.css',
  '/src/assets/js/main.js',
  '/src/assets/js/charts.js',
  '/src/assets/js/ai.js',
  '/config/app-config.js',
  '/src/data/sample-data.json'
];

// CDNs externos críticos
const EXTERNAL_CACHE_FILES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
];

// Archivos de datos que se cachean bajo demanda
const DATA_CACHE_FILES = [
  '/src/data/',
  '/api/'
];

// Configuración de cache
const CACHE_CONFIG = {
  maxAge: 86400000,        // 24 horas
  maxEntries: 100,         // Máximo 100 archivos
  cleanupInterval: 3600000 // Limpiar cada hora
};

// ===================================================================
// EVENTOS DE INSTALACIÓN
// ===================================================================

self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    Promise.all([
      cachesCoreFiles(),
      cacheExternalFiles(),
      self.skipWaiting()
    ])
  );
});

// Cachear archivos principales
async function cachesCoreFiles() {
  try {
    const cache = await caches.open(CACHE_NAME);
    console.log('📦 Cacheando archivos principales...');
    
    // Cachear archivos uno por uno para mejor control de errores
    for (const file of CORE_CACHE_FILES) {
      try {
        await cache.add(file);
        console.log(`✅ Cacheado: ${file}`);
      } catch (error) {
        console.warn(`⚠️ Error cacheando ${file}:`, error);
      }
    }
    
    console.log('🎉 Archivos principales cacheados exitosamente');
  } catch (error) {
    console.error('❌ Error cacheando archivos principales:', error);
  }
}

// Cachear archivos externos
async function cacheExternalFiles() {
  try {
    const cache = await caches.open(CACHE_NAME + '-external');
    console.log('🌐 Cacheando recursos externos...');
    
    for (const url of EXTERNAL_CACHE_FILES) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log(`✅ Externo cacheado: ${url}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error cacheando externo ${url}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Error cacheando externos:', error);
  }
}

// ===================================================================
// ACTIVACIÓN DEL SERVICE WORKER
// ===================================================================

self.addEventListener('activate', event => {
  console.log('⚡ Service Worker: Activando...');
  
  event.waitUntil(
    Promise.all([
      cleanOldCaches(),
      self.clients.claim(),
      setupPeriodicSync()
    ])
  );
});

// Limpiar caches antiguos
async function cleanOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames
      .filter(name => name !== CACHE_NAME && name !== CACHE_NAME + '-external')
      .map(name => {
        console.log(`🗑️ Eliminando cache antiguo: ${name}`);
        return caches.delete(name);
      });
    
    await Promise.all(deletePromises);
    console.log('🧹 Caches antiguos eliminados');
  } catch (error) {
    console.error('❌ Error limpiando caches:', error);
  }
}

// Configurar sincronización periódica
async function setupPeriodicSync() {
  try {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('data-sync');
      console.log('🔄 Sincronización periódica configurada');
    }
  } catch (error) {
    console.warn('⚠️ Sincronización no disponible:', error);
  }
}

// ===================================================================
// INTERCEPTACIÓN DE REQUESTS (FETCH)
// ===================================================================

self.addEventListener('fetch', event => {
  const { request } = event;
  const { url, method, destination } = request;
  
  // Solo manejar requests GET
  if (method !== 'GET') return;
  
  // Determinar estrategia de cache
  if (isCoreFile(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isExternalResource(url)) {
    event.respondWith(staleWhileRevalidate(request));
  } else if (isDataFile(url)) {
    event.respondWith(networkFirst(request));
  } else if (isImageFile(url)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// ===================================================================
// ESTRATEGIAS DE CACHE
// ===================================================================

// Cache First - Para archivos críticos del core
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log(`📦 Desde cache: ${request.url}`);
      return cachedResponse;
    }
    
    console.log(`🌐 Desde red: ${request.url}`);
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error en cacheFirst:', error);
    return createOfflineResponse(request);
  }
}

// Network First - Para datos dinámicos
async function networkFirst(request) {
  try {
    console.log(`🌐 Network first: ${request.url}`);
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log(`📦 Fallback cache: ${request.url}`);
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    return cachedResponse || createOfflineResponse(request);
  }
}

// Stale While Revalidate - Para recursos externos
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME + '-external');
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.warn('⚠️ Error fetching:', error);
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// ===================================================================
// FUNCIONES DE UTILIDAD
// ===================================================================

// Verificar si es archivo del core
function isCoreFile(url) {
  return CORE_CACHE_FILES.some(file => url.includes(file)) ||
         url.includes('/src/assets/') ||
         url.includes('/config/');
}

// Verificar si es recurso externo
function isExternalResource(url) {
  return url.includes('cdnjs.cloudflare.com') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fonts.gstatic.com');
}

// Verificar si es archivo de datos
function isDataFile(url) {
  return url.includes('/src/data/') ||
         url.includes('/api/') ||
         url.includes('.json');
}

// Verificar si es imagen
function isImageFile(url) {
  return /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(url);
}

// Crear respuesta offline
function createOfflineResponse(request) {
  if (request.destination === 'document') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GRIZALUM - Sin Conexión</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            text-align: center;
          }
          .offline-container {
            max-width: 400px;
            padding: 2rem;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.8;
          }
          h1 {
            color: #d4af37;
            margin-bottom: 1rem;
          }
          .retry-btn {
            background: #d4af37;
            color: #0f172a;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="icon">📡</div>
          <h1>Sin Conexión a Internet</h1>
          <p>No se puede conectar al servidor. Verifica tu conexión e intenta nuevamente.</p>
          <button class="retry-btn" onclick="window.location.reload()">
            🔄 Reintentar
          </button>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  return new Response('Sin conexión', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// ===================================================================
// EVENTOS DE SINCRONIZACIÓN
// ===================================================================

self.addEventListener('sync', event => {
  console.log('🔄 Evento de sincronización:', event.tag);
  
  if (event.tag === 'data-sync') {
    event.waitUntil(syncData());
  }
});

// Sincronizar datos cuando hay conexión
async function syncData() {
  try {
    console.log('📊 Sincronizando datos...');
    
    // Obtener datos locales pendientes
    const pendingData = await getStoredData('pendingSync');
    
    if (pendingData && pendingData.length > 0) {
      for (const item of pendingData) {
        await syncDataItem(item);
      }
      
      // Limpiar datos sincronizados
      await clearStoredData('pendingSync');
      console.log('✅ Datos sincronizados exitosamente');
    }
  } catch (error) {
    console.error('❌ Error sincronizando datos:', error);
  }
}

// ===================================================================
// GESTIÓN DE NOTIFICACIONES
// ===================================================================

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Si hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Mostrar notificación push
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/src/assets/images/icon-192.png',
    badge: '/src/assets/images/icon-72.png',
    tag: data.tag || 'grizalum-notification',
    renotify: true,
    requireInteraction: data.urgent || false,
    actions: [
      {
        action: 'view',
        title: '👁️ Ver',
        icon: '/src/assets/images/action-view.png'
      },
      {
        action: 'dismiss',
        title: '❌ Cerrar',
        icon: '/src/assets/images/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ===================================================================
// UTILIDADES DE ALMACENAMIENTO
// ===================================================================

// Obtener datos almacenados
async function getStoredData(key) {
  try {
    const cache = await caches.open(CACHE_NAME + '-data');
    const response = await cache.match(`/storage/${key}`);
    
    if (response) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    return null;
  }
}

// Almacenar datos
async function storeData(key, data) {
  try {
    const cache = await caches.open(CACHE_NAME + '-data');
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put(`/storage/${key}`, response);
    return true;
  } catch (error) {
    console.error('Error almacenando datos:', error);
    return false;
  }
}

// Limpiar datos almacenados
async function clearStoredData(key) {
  try {
    const cache = await caches.open(CACHE_NAME + '-data');
    await cache.delete(`/storage/${key}`);
    return true;
  } catch (error) {
    console.error('Error limpiando datos:', error);
    return false;
  }
}

// ===================================================================
// LIMPIEZA PERIÓDICA
// ===================================================================

// Limpiar cache periódicamente
setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      if (cacheName.includes('grizalum')) {
        await cleanExpiredCache(cacheName);
      }
    }
  } catch (error) {
    console.error('Error en limpieza periódica:', error);
  }
}, CACHE_CONFIG.cleanupInterval);

// Limpiar entradas expiradas del cache
async function cleanExpiredCache(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const dateHeader = response.headers.get('date');
      
      if (dateHeader) {
        const age = Date.now() - new Date(dateHeader).getTime();
        
        if (age > CACHE_CONFIG.maxAge) {
          await cache.delete(request);
          console.log(`🗑️ Eliminado del cache: ${request.url}`);
        }
      }
    }
  } catch (error) {
    console.error('Error limpiando cache expirado:', error);
  }
}

// ===================================================================
// MENSAJES DEL CLIENTE
// ===================================================================

self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ size });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(success => {
        event.ports[0].postMessage({ success });
      });
      break;
      
    case 'SYNC_DATA':
      syncData().then(() => {
        event.ports[0].postMessage({ synced: true });
      });
      break;
      
    default:
      console.warn('Mensaje no reconocido:', type);
  }
});

// Obtener tamaño del cache
async function getCacheSize() {
  try {
    let totalSize = 0;
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      if (cacheName.includes('grizalum')) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error calculando tamaño:', error);
    return 0;
  }
}

// Limpiar todos los caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames
      .filter(name => name.includes('grizalum'))
      .map(name => caches.delete(name));
    
    await Promise.all(deletePromises);
    console.log('🧹 Todos los caches eliminados');
    return true;
  } catch (error) {
    console.error('Error limpiando caches:', error);
    return false;
  }
}

// ===================================================================
// INICIALIZACIÓN
// ===================================================================

console.log('🚀 GRIZALUM Service Worker v2.0.0 iniciado');
console.log('📦 Cache configurado:', CACHE_NAME);
console.log('⚙️ Configuración:', CACHE_CONFIG);
