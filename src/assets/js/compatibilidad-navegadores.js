/**
 * ═══════════════════════════════════════════════════════════════════
 * 🌐 GRIZALUM - COMPATIBILIDAD CROSS-BROWSER v3.0 MEJORADA
 * ═══════════════════════════════════════════════════════════════════
 * Asegura que funcione igual en Windows, Mac, iOS, Android
 * Compatible con: Safari, Chrome, Edge, Firefox, móviles
 * 
 * CONSERVA: Todo tu código original que ya funciona
 * AGREGA: Funciones necesarias para dropdowns/selects en Safari
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    // ═══════════════════════════════════════════════════════════════
    // 🔍 DETECCIÓN MEJORADA DE NAVEGADOR Y OS
    // ═══════════════════════════════════════════════════════════════
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Detección original (conservada)
    const esWebkit = /Safari|WebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const esMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    const esIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const esAndroid = /Android/.test(navigator.userAgent);
    
    // Detección extendida (nueva)
    const esSafari = userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1;
    const esChrome = userAgent.indexOf('chrome') !== -1 && userAgent.indexOf('edge') === -1;
    const esEdge = userAgent.indexOf('edge') !== -1 || userAgent.indexOf('edg/') !== -1;
    const esFirefox = userAgent.indexOf('firefox') !== -1;
    const esWindows = userAgent.indexOf('win') !== -1;
    const esMovil = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    // Información del navegador (global)
    window.GRIZALUM_BROWSER = {
        // Original
        webkit: esWebkit,
        mac: esMac,
        ios: esIOS,
        android: esAndroid,
        // Nuevo
        isSafari: esSafari,
        isChrome: esChrome,
        isEdge: esEdge,
        isFirefox: esFirefox,
        isMac: esMac,
        isWindows: esWindows,
        isMobile: esMovil
    };
    
    console.log('🌐 Sistema detectado:', window.GRIZALUM_BROWSER);
    
    // ═══════════════════════════════════════════════════════════════
    // 🎨 FIX 1: PREFIJOS WEBKIT (ORIGINAL - CONSERVADO)
    // ═══════════════════════════════════════════════════════════════
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
        console.log('✅ Prefijos Webkit aplicados');
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 💾 FIX 2: ALMACENAMIENTO SEGURO MEJORADO
    // ═══════════════════════════════════════════════════════════════
    
    // Función auxiliar para probar disponibilidad
    function probarStorage(tipo) {
        try {
            const storage = window[tipo];
            const test = '__storage_test__';
            storage.setItem(test, test);
            storage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    const localStorageDisponible = probarStorage('localStorage');
    const sessionStorageDisponible = probarStorage('sessionStorage');
    
    // Versión mejorada de almacenamientoSeguro (conserva la original + mejoras)
    window.almacenamientoSeguro = {
        setItem: function(key, value) {
            // Convertir objetos a JSON automáticamente
            if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
            }
            
            try {
                if (localStorageDisponible) {
                    localStorage.setItem(key, value);
                    return true;
                }
            } catch (e) {
                console.warn('⚠️ localStorage bloqueado, usando sessionStorage');
            }
            
            try {
                if (sessionStorageDisponible) {
                    sessionStorage.setItem(key, value);
                    return true;
                }
            } catch (e2) {
                console.warn('⚠️ sessionStorage bloqueado, usando memoria temporal');
            }
            
            // Fallback: memoria temporal
            if (!window.__GRIZALUM_TEMP_STORAGE__) {
                window.__GRIZALUM_TEMP_STORAGE__ = {};
            }
            window.__GRIZALUM_TEMP_STORAGE__[key] = value;
            return false;
        },
        
        getItem: function(key) {
            let value = null;
            
            try {
                value = localStorage.getItem(key);
            } catch (e) {}
            
            if (value === null) {
                try {
                    value = sessionStorage.getItem(key);
                } catch (e) {}
            }
            
            if (value === null && window.__GRIZALUM_TEMP_STORAGE__) {
                value = window.__GRIZALUM_TEMP_STORAGE__[key];
            }
            
            return value;
        },
        
        removeItem: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {}
            
            try {
                sessionStorage.removeItem(key);
            } catch (e) {}
            
            if (window.__GRIZALUM_TEMP_STORAGE__) {
                delete window.__GRIZALUM_TEMP_STORAGE__[key];
            }
        },
        
        clear: function() {
            try {
                localStorage.clear();
            } catch (e) {}
            
            try {
                sessionStorage.clear();
            } catch (e) {}
            
            if (window.__GRIZALUM_TEMP_STORAGE__) {
                window.__GRIZALUM_TEMP_STORAGE__ = {};
            }
        }
    };
    
    // Alias para compatibilidad con el nuevo sistema
    window.SafeStorage = window.almacenamientoSeguro;
    
    console.log('✅ Almacenamiento seguro inicializado');
    console.log('   localStorage:', localStorageDisponible);
    console.log('   sessionStorage:', sessionStorageDisponible);
    
    // ═══════════════════════════════════════════════════════════════
    // 🎨 FIX 3: APLICAR TEMA (ORIGINAL - CONSERVADO Y MEJORADO)
    // ═══════════════════════════════════════════════════════════════
    function aplicarTemaSafari() {
        const root = document.documentElement;
        const temaGuardado = window.almacenamientoSeguro.getItem('grizalum_tema_actual');
        
        if (temaGuardado) {
            console.log('🎨 Aplicando tema guardado:', temaGuardado);
            
            // Temas disponibles (conservados de tu código original)
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
            };
            
            const colores = temas[temaGuardado] || temas['dorado-clasico'];
            
            // Aplicar con ambos métodos (estándar y webkit)
            Object.entries(colores).forEach(function([key, value]) {
                root.style.setProperty(`--color-${key}`, value);
                // Forzar actualización en webkit
                root.style.setProperty(`--webkit-color-${key}`, value);
            });
            
            console.log('✅ Tema aplicado exitosamente');
        }
    }
    
    // Ejecutar inmediatamente y después de cargar
    aplicarTemaSafari();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarTemaSafari);
    } else {
        setTimeout(aplicarTemaSafari, 100);
    }
    
    // Función global para cambiar tema
    window.aplicarTemaGRIZALUM = aplicarTemaSafari;
    
    // ═══════════════════════════════════════════════════════════════
    // 📱 FIX 4: SMOOTH SCROLL EN iOS (ORIGINAL - CONSERVADO)
    // ═══════════════════════════════════════════════════════════════
    if (esIOS) {
        document.documentElement.style.webkitOverflowScrolling = 'touch';
        console.log('✅ Smooth scroll iOS activado');
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 🔍 FIX 5: PREVENIR ZOOM EN iOS/ANDROID (ORIGINAL - MEJORADO)
    // ═══════════════════════════════════════════════════════════════
    if (esIOS || esAndroid) {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            let content = meta.getAttribute('content');
            const re = /maximum\-scale=[0-9\.]+/g;
            
            if (re.test(content)) {
                content = content.replace(re, 'maximum-scale=1.0');
            } else {
                content = [content, 'maximum-scale=1.0', 'user-scalable=no'].join(', ');
            }
            
            meta.setAttribute('content', content);
            console.log('✅ Prevención de zoom activada');
        }
        
        // Agregar clase para estilos móviles
        document.documentElement.classList.add('grizalum-mobile');
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 🆕 FIX 6: INICIALIZACIÓN SEGURA DE SELECTS/DROPDOWNS
    // (NUEVO - NECESARIO PARA QUE FUNCIONEN LAS CATEGORÍAS)
    // ═══════════════════════════════════════════════════════════════
    window.initializarSelectSeguro = function(selectId, opciones, valorDefault) {
        console.log(`🔧 Inicializando select: ${selectId}`);
        
        // Función para intentar inicializar
        const intentarInicializar = function() {
            const selectElement = document.getElementById(selectId);
            
            if (!selectElement) {
                console.warn(`⚠️ Select "${selectId}" no encontrado aún`);
                return false;
            }

            // Limpiar opciones existentes
            selectElement.innerHTML = '';

            // Agregar opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = valorDefault || 'Selecciona una opción';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            selectElement.appendChild(defaultOption);

            // Agregar opciones
            if (Array.isArray(opciones)) {
                opciones.forEach(function(opcion) {
                    const optionElement = document.createElement('option');
                    if (typeof opcion === 'string') {
                        optionElement.value = opcion;
                        optionElement.textContent = opcion;
                    } else {
                        optionElement.value = opcion.value || opcion.id;
                        optionElement.textContent = opcion.text || opcion.nombre;
                        if (opcion.icon) {
                            optionElement.setAttribute('data-icon', opcion.icon);
                        }
                    }
                    selectElement.appendChild(optionElement);
                });
            } else if (typeof opciones === 'object') {
                Object.keys(opciones).forEach(function(key) {
                    const optionElement = document.createElement('option');
                    optionElement.value = key;
                    optionElement.textContent = opciones[key];
                    selectElement.appendChild(optionElement);
                });
            }

            // Forzar actualización del select (CRÍTICO para Safari)
            selectElement.blur();
            selectElement.style.display = 'none';
            setTimeout(function() {
                selectElement.style.display = '';
            }, 10);

            console.log(`✅ Select "${selectId}" inicializado con ${selectElement.options.length - 1} opciones`);
            return true;
        };

        // Intentar inmediatamente
        if (!intentarInicializar()) {
            // Si falla, reintentar cuando el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', intentarInicializar);
            } else {
                // DOM ya está listo, reintentar en el siguiente tick
                setTimeout(intentarInicializar, 100);
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // 🆕 FIX 7: AGREGAR EVENTOS DE FORMA SEGURA
    // (NUEVO - PREVIENE MEMORY LEAKS)
    // ═══════════════════════════════════════════════════════════════
    window.agregarEventoSeguro = function(elemento, evento, callback) {
        const el = typeof elemento === 'string' ? document.getElementById(elemento) : elemento;
        
        if (!el) {
            console.warn(`⚠️ Elemento no encontrado para evento ${evento}`);
            return;
        }

        // Remover evento previo si existe
        const eventKey = `_grizalum_${evento}_handler`;
        if (el[eventKey]) {
            el.removeEventListener(evento, el[eventKey]);
        }

        // Agregar nuevo evento
        el[eventKey] = callback;
        el.addEventListener(evento, callback, false);
        
        console.log(`✅ Evento "${evento}" agregado a elemento`);
    };
    
    // ═══════════════════════════════════════════════════════════════
    // 🆕 FIX 8: HELPER PARA ESPERAR QUE EL DOM ESTÉ LISTO
    // (NUEVO - ÚTIL PARA INICIALIZACIONES)
    // ═══════════════════════════════════════════════════════════════
    window.esperarDOM = function(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // 🆕 FIX 9: POLYFILLS PARA NAVEGADORES ANTIGUOS
    // (NUEVO - GARANTIZA COMPATIBILIDAD)
    // ═══════════════════════════════════════════════════════════════
    
    // Polyfill para Array.prototype.find
    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }

    // Polyfill para Array.prototype.findIndex
    if (!Array.prototype.findIndex) {
        Array.prototype.findIndex = function(predicate) {
            if (this == null) {
                throw new TypeError('Array.prototype.findIndex called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return i;
                }
            }
            return -1;
        };
    }

    // Polyfill para Object.assign
    if (typeof Object.assign !== 'function') {
        Object.assign = function(target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }
    
    console.log('✅ Polyfills cargados');
    
    // ═══════════════════════════════════════════════════════════════
    // 🛡️ PROTECCIÓN CONTRA ERRORES SILENCIOSOS
    // ═══════════════════════════════════════════════════════════════
    window.addEventListener('error', function(e) {
        console.error('🚨 Error detectado:', e.error);
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('🚨 Promise rechazada:', e.reason);
    });
    
    // ═══════════════════════════════════════════════════════════════
    // ✅ CONFIRMACIÓN DE CARGA
    // ═══════════════════════════════════════════════════════════════
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ GRIZALUM - Compatibilidad Cross-Browser v3.0 MEJORADA cargada');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Funciones disponibles:');
    console.log('  - almacenamientoSeguro / SafeStorage');
    console.log('  - initializarSelectSeguro()');
    console.log('  - agregarEventoSeguro()');
    console.log('  - esperarDOM()');
    console.log('  - aplicarTemaGRIZALUM()');
    console.log('  - GRIZALUM_BROWSER (info del navegador)');
    console.log('═══════════════════════════════════════════════════════════════');
    
})();
