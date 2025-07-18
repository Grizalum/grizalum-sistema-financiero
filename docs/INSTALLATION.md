# 🛠️ Guía de Instalación - GRIZALUM

> Instalación técnica completa del Sistema Financiero Empresarial GRIZALUM

## 📋 Tabla de Contenidos

1. [📋 Requisitos del Sistema](#-requisitos-del-sistema)
2. [🚀 Instalación Rápida](#-instalación-rápida)
3. [💻 Instalación Local](#-instalación-local)
4. [🌐 Instalación en Servidor](#-instalación-en-servidor)
5. [📱 Configuración PWA](#-configuración-pwa)
6. [⚙️ Configuración Avanzada](#️-configuración-avanzada)
7. [🔧 Troubleshooting](#-troubleshooting)

---

## 📋 Requisitos del Sistema

### **🌐 Navegadores Compatibles**

| Navegador | Versión Mínima | Estado | Notas |
|-----------|----------------|--------|-------|
| **Chrome** | 88+ | ✅ Recomendado | Mejor performance |
| **Firefox** | 85+ | ✅ Compatible | Funcionalidad completa |
| **Safari** | 14+ | ✅ Compatible | iOS/macOS optimizado |
| **Edge** | 88+ | ✅ Compatible | Chromium-based |
| **Opera** | 74+ | ✅ Compatible | Chromium-based |

### **📱 Dispositivos Soportados**

#### **Móviles:**
- **iOS** 12+ (iPhone 6S+)
- **Android** 8+ (API level 26+)
- **Resolución mínima**: 320x568px

#### **Tablets:**
- **iPad** (6ta generación+)
- **Android tablets** 8+
- **Resolución óptima**: 768x1024px+

#### **Desktop:**
- **Windows** 10/11
- **macOS** 10.15+
- **Linux** (Ubuntu 18.04+)
- **Resolución mínima**: 1024x768px

### **⚡ Recursos del Sistema**

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **RAM** | 2GB | 4GB+ |
| **Almacenamiento** | 50MB | 100MB |
| **CPU** | Dual-core | Quad-core+ |
| **Internet** | 512 kbps | 2 Mbps+ |

---

## 🚀 Instalación Rápida

### **Opción 1: GitHub Pages (Más Fácil)**

```bash
# Simplemente visita:
https://grizalum.github.io/grizalum-sistema-financiero/

# ¡No requiere instalación! ✨
```

**Ventajas:**
- ✅ Sin instalación local
- ✅ Siempre actualizado
- ✅ Acceso desde cualquier dispositivo
- ✅ SSL automático (HTTPS)

### **Opción 2: PWA (Progressive Web App)**

#### **En Chrome/Edge:**
1. Visita el sistema
2. **Clic en ⚙️** en la barra de direcciones
3. **"Instalar GRIZALUM"**
4. **Confirmar instalación**
5. **¡Listo!** Funciona como app nativa

#### **En móvil (Android):**
1. Abrir en Chrome
2. **Menú** → "Agregar a pantalla de inicio"
3. **Confirmar**
4. **Ícono** aparece en launcher

#### **En iOS (Safari):**
1. Abrir en Safari
2. **Compartir** 📤 → "Agregar a pantalla de inicio"
3. **Confirmar nombre**
4. **Listo** - funciona offline

---

## 💻 Instalación Local

### **Método 1: Git Clone (Recomendado)**

```bash
# 1. Clonar repositorio
git clone https://github.com/Grizalum/grizalum-sistema-financiero.git

# 2. Navegar al directorio
cd grizalum-sistema-financiero

# 3. Verificar estructura
ls -la
# Deberías ver: index.html, src/, docs/, config/, LICENSE, README.md

# 4. Abrir en navegador
# Opción A: Doble clic en index.html
# Opción B: Servidor local (ver abajo)
```

### **Método 2: Descargar ZIP**

```bash
# 1. Ir a GitHub
https://github.com/Grizalum/grizalum-sistema-financiero

# 2. Code → Download ZIP
# 3. Extraer archivo
unzip grizalum-sistema-financiero-main.zip

# 4. Renombrar carpeta (opcional)
mv grizalum-sistema-financiero-main grizalum-sistema-financiero

# 5. Abrir index.html
```

### **Método 3: GitHub CLI**

```bash
# 1. Instalar GitHub CLI (si no lo tienes)
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: sudo apt install gh

# 2. Clonar con gh
gh repo clone Grizalum/grizalum-sistema-financiero

# 3. Entrar al directorio
cd grizalum-sistema-financiero
```

---

## 🌐 Instalación en Servidor

### **Servidor Web Local**

#### **Con Python 3:**
```bash
# Navegar al directorio del proyecto
cd grizalum-sistema-financiero

# Iniciar servidor
python -m http.server 8000

# Abrir navegador
http://localhost:8000
```

#### **Con Node.js:**
```bash
# Instalar serve globalmente
npm install -g serve

# Iniciar servidor
serve .

# O especificar puerto
serve . -p 8000
```

#### **Con PHP:**
```bash
# Si tienes PHP instalado
php -S localhost:8000

# Abrir navegador
http://localhost:8000
```

### **Servidor de Producción**

#### **Apache (.htaccess):**
```apache
# Crear archivo .htaccess en la raíz
RewriteEngine On

# Cache para recursos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 6 months"
    ExpiresByType image/jpg "access plus 6 months"
    ExpiresByType image/jpeg "access plus 6 months"
    ExpiresByType image/gif "access plus 6 months"
    ExpiresByType image/ico "access plus 6 months"
    ExpiresByType image/icon "access plus 6 months"
    ExpiresByType image/x-icon "access plus 6 months"
</IfModule>

# Compresión GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Seguridad
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

#### **Nginx (nginx.conf):**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /path/to/grizalum-sistema-financiero;
    index index.html;

    # Cache para recursos estáticos
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }

    # Compresión
    gzip on;
    gzip_types text/css application/javascript text/javascript application/json;
    gzip_min_length 1000;

    # Seguridad
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # Fallback para SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### **Docker (Dockerfile):**
```dockerfile
FROM nginx:alpine

# Copiar archivos del proyecto
COPY . /usr/share/nginx/html/

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Construir imagen Docker
docker build -t grizalum-sistema .

# Ejecutar contenedor
docker run -d -p 8080:80 grizalum-sistema

# Acceder en http://localhost:8080
```

---

## 📱 Configuración PWA

### **Manifest.json**

Crear archivo `manifest.json` en la raíz:

```json
{
  "name": "GRIZALUM - Sistema Financiero",
  "short_name": "GRIZALUM",
  "description": "Sistema Financiero Empresarial Premium",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#d4af37",
  "orientation": "portrait-primary",
  "categories": ["business", "finance", "productivity"],
  "lang": "es",
  "icons": [
    {
      "src": "src/assets/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "src/assets/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "src/assets/images/screenshot-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "src/assets/images/screenshot-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

### **Service Worker**

Crear `sw.js` en la raíz:

```javascript
const CACHE_NAME = 'grizalum-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/assets/css/styles.css',
  '/src/assets/css/responsive.css',
  '/src/assets/js/main.js',
  '/src/assets/js/charts.js',
  '/src/assets/js/ai.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

### **Registrar Service Worker**

Agregar al final de `index.html`:

```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado: ', registration);
      })
      .catch(registrationError => {
        console.log('SW falló: ', registrationError);
      });
  });
}
</script>
```

---

## ⚙️ Configuración Avanzada

### **Variables de Entorno**

Crear `config/environment.js`:

```javascript
const ENV = {
  // Configuración de desarrollo
  development: {
    API_URL: 'http://localhost:3000',
    DEBUG_MODE: true,
    UPDATE_INTERVAL: 60000,
    CACHE_ENABLED: false
  },
  
  // Configuración de producción
  production: {
    API_URL: 'https://api.grizalum.com',
    DEBUG_MODE: false,
    UPDATE_INTERVAL: 300000,
    CACHE_ENABLED: true
  },
  
  // Detectar entorno actual
  current: window.location.hostname === 'localhost' ? 'development' : 'production'
};

// Exportar configuración activa
window.ENV = ENV[ENV.current];
```

### **Configuración de Base de Datos**

Crear `config/database.js`:

```javascript
const dbConfig = {
  // IndexedDB para almacenamiento local
  indexedDB: {
    name: 'GrizalumDB',
    version: 1,
    stores: [
      {
        name: 'transactions',
        keyPath: 'id',
        autoIncrement: true
      },
      {
        name: 'settings',
        keyPath: 'key'
      },
      {
        name: 'cache',
        keyPath: 'timestamp'
      }
    ]
  },
  
  // Firebase (opcional)
  firebase: {
    apiKey: "tu-api-key",
    authDomain: "grizalum.firebaseapp.com",
    projectId: "grizalum",
    storageBucket: "grizalum.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};
```

### **Configuración de Temas**

Crear `config/themes.js`:

```javascript
const themes = {
  default: {
    name: 'GRIZALUM Classic',
    colors: {
      primary: '#d4af37',
      secondary: '#0f172a',
      success: '#059669',
      danger: '#dc2626',
      warning: '#f59e0b',
      info: '#3b82f6'
    }
  },
  
  dark: {
    name: 'Modo Nocturno',
    colors: {
      primary: '#d4af37',
      secondary: '#1e293b',
      background: '#0f172a',
      text: '#f8fafc'
    }
  },
  
  corporate: {
    name: 'Corporativo',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#f59e0b'
    }
  }
};
```

---

## 🔧 Troubleshooting

### **❌ Problemas Comunes**

#### **Error: "No se pueden cargar los gráficos"**

**Síntomas:**
```
Uncaught ReferenceError: Chart is not defined
```

**Soluciones:**
```bash
# 1. Verificar conexión a CDN
curl -I https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js

# 2. Verificar orden de scripts en HTML
# Chart.js debe cargarse ANTES de main.js

# 3. Alternativa local
wget https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js
# Guardar en src/assets/js/vendor/chart.min.js
```

#### **Error: "CORS Policy"**

**Síntomas:**
```
Access to fetch at 'file://' has been blocked by CORS policy
```

**Soluciones:**
```bash
# 1. Usar servidor local (NO abrir archivo directamente)
python -m http.server 8000

# 2. Chrome con CORS deshabilitado (solo desarrollo)
chrome --disable-web-security --user-data-dir=/tmp/chrome

# 3. Firefox about:config
security.fileuri.strict_origin_policy = false
```

#### **Error: "IndexedDB no funciona"**

**Síntomas:**
- Datos no se guardan
- Error al abrir base de datos

**Soluciones:**
```javascript
// Verificar soporte
if (!window.indexedDB) {
  console.error('IndexedDB no soportado');
  // Fallback a localStorage
  window.indexedDB = {
    open: () => Promise.reject('No soportado')
  };
}

// Limpiar base de datos corrupta
indexedDB.deleteDatabase('GrizalumDB');
```

### **🐛 Debugging**

#### **Modo Debug:**
```javascript
// Agregar al inicio de main.js
window.DEBUG = true;

// Logs adicionales
if (window.DEBUG) {
  console.log('🐛 Modo debug activado');
  console.log('📊 Charts disponibles:', Object.keys(charts));
  console.log('🤖 IA inicializada:', !!window.financialAI);
}
```

#### **Verificación de Performance:**
```javascript
// Medir tiempo de carga
const startTime = performance.now();

window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`⚡ Tiempo de carga: ${loadTime.toFixed(2)}ms`);
});

// Monitorear memoria
setInterval(() => {
  if (performance.memory) {
    console.log('💾 Memoria:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
    });
  }
}, 30000);
```

### **🔍 Herramientas de Diagnóstico**

#### **Health Check Script:**
```javascript
// Ejecutar en consola del navegador
const healthCheck = {
  browser: navigator.userAgent,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  memory: performance.memory ? 
    Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 'N/A',
  charts: !!window.Chart,
  ai: !!window.financialAI,
  storage: !!window.indexedDB,
  pwa: !!navigator.serviceWorker,
  online: navigator.onLine
};

console.table(healthCheck);
```

#### **Network Test:**
```bash
# Probar conectividad a CDNs
curl -w "Tiempo: %{time_total}s\n" -o /dev/null -s \
  https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.min.js

curl -w "Tiempo: %{time_total}s\n" -o /dev/null -s \
  https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
```

---

## 🚀 Optimización de Performance

### **Carga Lazy (Diferida)**

```javascript
// Cargar módulos bajo demanda
const loadModule = async (moduleName) => {
  switch(moduleName) {
    case 'charts':
      return import('./src/assets/js/charts.js');
    case 'ai':
      return import('./src/assets/js/ai.js');
    default:
      throw new Error(`Módulo ${moduleName} no encontrado`);
  }
};

// Uso
document.getElementById('showCharts').addEventListener('click', async () => {
  const chartsModule = await loadModule('charts');
  chartsModule.initializeCharts();
});
```

### **Cache Inteligente**

```javascript
// Service Worker con cache estratégico
const CACHE_STRATEGIES = {
  'cache-first': ['/src/assets/css/', '/src/assets/js/'],
  'network-first': ['/api/', '/data/'],
  'stale-while-revalidate': ['/src/assets/images/']
};
```

### **Compresión de Assets**

```bash
# Minificar CSS
npm install -g clean-css-cli
cleancss -o src/assets/css/styles.min.css src/assets/css/styles.css

# Minificar JavaScript
npm install -g terser
terser src/assets/js/main.js -o src/assets/js/main.min.js -m -c

# Optimizar imágenes
npm install -g imagemin-cli
imagemin src/assets/images/*.png --out-dir=src/assets/images/optimized/
```

---

## 📚 Scripts de Automatización

### **Build Script (build.js):**

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔨 Construyendo GRIZALUM...');

// Verificar archivos requeridos
const requiredFiles = [
  'index.html',
  'src/assets/css/styles.css',
  'src/assets/js/main.js'
];

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Archivo faltante: ${file}`);
    process.exit(1);
  }
});

console.log('✅ Todos los archivos presentes');
console.log('🚀 Build completado exitosamente');
```

### **Deploy Script (deploy.js):**

```javascript
#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🚀 Desplegando GRIZALUM...');

try {
  // Git add, commit, push
  execSync('git add .');
  execSync('git commit -m "Deploy: actualizando sistema"');
  execSync('git push origin main');
  
  console.log('✅ Deploy exitoso');
  console.log('🌐 Sistema disponible en: https://grizalum.github.io/grizalum-sistema-financiero/');
} catch (error) {
  console.error('❌ Error en deploy:', error.message);
  process.exit(1);
}
```

---

## 📞 Soporte Técnico

### **🆘 Obtener Ayuda**

Si tienes problemas con la instalación:

1. **📖 Revisar documentación** completa
2. **🔍 Buscar en Issues** existentes
3. **🐛 Crear nuevo Issue** con detalles
4. **📧 Contactar soporte**: soporte@grizalum.com

### **📋 Información para Soporte**

Incluir en tu reporte:

```bash
# Información del sistema
echo "OS: $(uname -a)"
echo "Node: $(node --version 2>/dev/null || echo 'No instalado')"
echo "Python: $(python --version 2>/dev/null || echo 'No instalado')"
echo "Git: $(git --version)"

# Información del navegador (desde consola)
console.log({
  userAgent: navigator.userAgent,
  viewport: `${screen.width}x${screen.height}`,
  language: navigator.language,
  platform: navigator.platform
});
```

---

<div align="center">

**¡Instalación Completa! 🎉**

Tu sistema GRIZALUM está listo para transformar tu gestión financiera

[🚀 Acceder al Sistema](https://grizalum.github.io/grizalum-sistema-financiero/) • [📖 Manual de Usuario](USER_GUIDE.md) • [🔧 Soporte](https://github.com/Grizalum/grizalum-sistema-financiero/issues)

</div>
