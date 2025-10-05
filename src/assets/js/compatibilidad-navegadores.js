/**
 * GRIZALUM - Compatibilidad Cross-Browser
 * Asegura que funcione igual en Windows, Mac, iOS, Android
 */

(function() {
    'use strict';
    
    // Detectar navegador y OS
    const esWebkit = /Safari|WebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const esMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    const esIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const esAndroid = /Android/.test(navigator.userAgent);
    
    console.log('Sistema detectado:', {
        webkit: esWebkit,
        mac: esMac,
        ios: esIOS,
        android: esAndroid
    });
    
    // Fix 1: Agregar prefijos Webkit a variables CSS
    if (esWebkit) {
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            .metric-value,
            .page-title,
            .chart-title {
                -webkit-text-fill-color: inherit;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fix 2: localStorage seguro con fallback
    window.almacenamientoSeguro = {
        setItem: function(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn('localStorage bloqueado, usando sessionStorage');
                try {
                    sessionStorage.setItem(key, value);
                    return true;
                } catch (e2) {
                    console.error('Almacenamiento no disponible');
                    return false;
                }
            }
        },
        
        getItem: function(key) {
            try {
                return localStorage.getItem(key) || sessionStorage.getItem(key);
            } catch (e) {
                return null;
            }
        },
        
        removeItem: function(key) {
            try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            } catch (e) {
                console.warn('No se pudo eliminar item');
            }
        }
    };
    
    // Fix 3: Aplicar tema al cargar (Safari a veces no ejecuta DOMContentLoaded correctamente)
    function aplicarTemaSafari() {
        const root = document.documentElement;
        const temaGuardado = window.almacenamientoSeguro.getItem('grizalum_tema_actual');
        
        if (temaGuardado) {
            console.log('Aplicando tema guardado en Safari:', temaGuardado);
            
            // Temas disponibles
            const temas = {
                'dorado-clasico': {
                    primario: '#d4af37',
                    secundario: '#b8941f',
                    ingresos: '#d4af37',
                    gastos: '#ff6b35',
                    utilidad: '#2ecc71',
                    crecimiento: '#9b59b6'
                },
                'azul-corporativo': {
                    primario: '#3b82f6',
                    secundario: '#2563eb',
                    ingresos: '#3b82f6',
                    gastos: '#ef4444',
                    utilidad: '#10b981',
                    crecimiento: '#8b5cf6'
                },
                'verde-fresco': {
                    primario: '#10b981',
                    secundario: '#059669',
                    ingresos: '#10b981',
                    gastos: '#f97316',
                    utilidad: '#14b8a6',
                    crecimiento: '#06b6d4'
                }
                // Agrega más temas aquí
            };
            
            const colores = temas[temaGuardado] || temas['dorado-clasico'];
            
            // Aplicar con ambos métodos (estándar y webkit)
            Object.entries(colores).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
                // Forzar actualización en webkit
                root.style.setProperty(`--webkit-color-${key}`, value);
            });
            
            console.log('Tema aplicado exitosamente');
        }
    }
    
    // Ejecutar inmediatamente y después de cargar
    aplicarTemaSafari();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarTemaSafari);
    } else {
        setTimeout(aplicarTemaSafari, 100);
    }
    
    // Fix 4: Smooth scroll en iOS
    if (esIOS) {
        document.documentElement.style.webkitOverflowScrolling = 'touch';
    }
    
    // Fix 5: Prevenir zoom en iOS en inputs
    if (esIOS || esAndroid) {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }
    
    console.log('Compatibilidad cross-platform cargada');
    
})();
