/**
 * ═══════════════════════════════════════════════════════════════════
 * 🌐 GRIZALUM - COMPATIBILIDAD UNIVERSAL DE NAVEGADORES
 * ═══════════════════════════════════════════════════════════════════
 * Versión: 2.0
 * Compatible con: Chrome, Firefox, Safari, Edge, Safari iOS, Chrome Android
 * Fecha: 2025
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // 🔍 DETECCIÓN DE NAVEGADOR Y SISTEMA OPERATIVO
    // ═══════════════════════════════════════════════════════════════
    const BrowserDetector = {
        userAgent: navigator.userAgent.toLowerCase(),
        
        isSafari: function() {
            return this.userAgent.indexOf('safari') !== -1 && 
                   this.userAgent.indexOf('chrome') === -1;
        },
        
        isChrome: function() {
            return this.userAgent.indexOf('chrome') !== -1 && 
                   this.userAgent.indexOf('edge') === -1;
        },
        
        isFirefox: function() {
            return this.userAgent.indexOf('firefox') !== -1;
        },
        
        isEdge: function() {
            return this.userAgent.indexOf('edge') !== -1 || 
                   this.userAgent.indexOf('edg/') !== -1;
        },
        
        isMac: function() {
            return this.userAgent.indexOf('mac') !== -1;
        },
        
        isWindows: function() {
            return this.userAgent.indexOf('win') !== -1;
        },
        
        isMobile: function() {
            return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(this.userAgent);
        }
    };

    // Guardar información del navegador globalmente
    window.GRIZALUM_BROWSER = {
        isSafari: BrowserDetector.isSafari(),
        isChrome: BrowserDetector.isChrome(),
        isFirefox: BrowserDetector.isFirefox(),
        isEdge: BrowserDetector.isEdge(),
        isMac: BrowserDetector.isMac(),
        isWindows: BrowserDetector.isWindows(),
        isMobile: BrowserDetector.isMobile()
    };

    console.log('🌐 GRIZALUM Navegador detectado:', window.GRIZALUM_BROWSER);

    // ═══════════════════════════════════════════════════════════════
    // 📦 COMPATIBILIDAD LOCALSTORAGE (Safari es más restrictivo)
    // ═══════════════════════════════════════════════════════════════
    const SafeStorage = {
        isAvailable: function() {
            try {
                const test = '__storage_test__';
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                console.warn('⚠️ localStorage no disponible:', e);
                return false;
            }
        },

        setItem: function(key, value) {
            try {
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.error('❌ Error guardando en localStorage:', key, e);
                // Fallback: usar memoria temporal
                if (!window.__GRIZALUM_TEMP_STORAGE__) {
                    window.__GRIZALUM_TEMP_STORAGE__ = {};
                }
                window.__GRIZALUM_TEMP_STORAGE__[key] = value;
                return false;
            }
        },

        getItem: function(key) {
            try {
                let value = localStorage.getItem(key);
                if (value === null && window.__GRIZALUM_TEMP_STORAGE__) {
                    value = window.__GRIZALUM_TEMP_STORAGE__[key];
                }
                return value;
            } catch (e) {
                console.error('❌ Error leyendo localStorage:', key, e);
                if (window.__GRIZALUM_TEMP_STORAGE__) {
                    return window.__GRIZALUM_TEMP_STORAGE__[key];
                }
                return null;
            }
        },

        removeItem: function(key) {
            try {
                localStorage.removeItem(key);
                if (window.__GRIZALUM_TEMP_STORAGE__) {
                    delete window.__GRIZALUM_TEMP_STORAGE__[key];
                }
            } catch (e) {
                console.error('❌ Error eliminando de localStorage:', key, e);
            }
        },

        clear: function() {
            try {
                localStorage.clear();
                if (window.__GRIZALUM_TEMP_STORAGE__) {
                    window.__GRIZALUM_TEMP_STORAGE__ = {};
                }
            } catch (e) {
                console.error('❌ Error limpiando localStorage:', e);
            }
        }
    };

    // Exponer SafeStorage globalmente
    window.SafeStorage = SafeStorage;

    // ═══════════════════════════════════════════════════════════════
    // 🎯 INICIALIZADOR DE SELECTS/DROPDOWNS (Crítico para Safari)
    // ═══════════════════════════════════════════════════════════════
    window.initializarSelectSeguro = function(selectId, opciones, valorDefault) {
        console.log(`🔧 Inicializando select: ${selectId}`);
        
        // Función para intentar inicializar
        const intentarInicializar = () => {
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

            // Forzar actualización del select (importante en Safari)
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
    // 🎨 COMPATIBILIDAD DE EVENTOS (Safari necesita eventos explícitos)
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
    // 📱 DETECCIÓN Y AJUSTES PARA MÓVILES
    // ═══════════════════════════════════════════════════════════════
    if (window.GRIZALUM_BROWSER.isMobile) {
        // Agregar clase al body para estilos móviles
        document.documentElement.classList.add('grizalum-mobile');
        
        // Prevenir zoom en inputs (Safari iOS)
        const addMaximumScaleToMetaViewport = () => {
            const el = document.querySelector('meta[name=viewport]');
            if (el !== null) {
                let content = el.getAttribute('content');
                const re = /maximum\-scale=[0-9\.]+/g;
                if (re.test(content)) {
                    content = content.replace(re, 'maximum-scale=1.0');
                } else {
                    content = [content, 'maximum-scale=1.0'].join(', ');
                }
                el.setAttribute('content', content);
            }
        };
        
        addMaximumScaleToMetaViewport();
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔄 POLYFILLS PARA SAFARI Y NAVEGADORES ANTIGUOS
    // ═══════════════════════════════════════════════════════════════
    
    // Polyfill para Array.prototype.find (Safari antiguo)
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

    // Polyfill para Object.assign (Safari antiguo)
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

    // ═══════════════════════════════════════════════════════════════
    // 🎯 HELPER PARA ESPERAR QUE EL DOM ESTÉ LISTO
    // ═══════════════════════════════════════════════════════════════
    window.esperarDOM = function(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    };

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
    console.log('✅ GRIZALUM - Sistema de compatibilidad universal cargado');
    console.log('📊 localStorage disponible:', SafeStorage.isAvailable());
    
})();
