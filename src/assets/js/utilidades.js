/**
 * ========================================
 * GRIZALUM - SISTEMA DE UTILIDADES CORE
 * ========================================
 * Funciones utilitarias centralizadas para toda la aplicación
 * Versión: 2.0 | Última actualización: 2025
 */

class UtilidadesGRIZALUM {
    constructor() {
        this.debug = true;
        this.inicializado = false;
        this.configuracion = this.cargarConfiguracion();
        this.cache = new Map();
        this.sistemaNotificaciones = null;
        
        this.inicializar();
    }

    // ======= INICIALIZACIÓN =======
    inicializar() {
        try {
            this.log('🔧 Inicializando Sistema de Utilidades GRIZALUM v2.0...');
            
            this.configurarErrorHandler();
            this.verificarCompatibilidad();
            this.inyectarEstilos();
            this.inicializarSistemaNotificaciones();
            
            this.inicializado = true;
            this.log('✅ Sistema de Utilidades inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando Utilidades GRIZALUM:', error);
        }
    }

    cargarConfiguracion() {
        // Integración con configuración global de GRIZALUM
        const configGlobal = window.GRIZALUM_CONFIG || {};
        
        return {
            // Configuración regional (Perú)
            moneda: configGlobal.currency || 'PEN',
            locale: configGlobal.locale || 'es-PE',
            simboloMoneda: configGlobal.financial?.currency_symbol || 'S/.',
            decimales: configGlobal.financial?.decimal_places || 0,
            separadorMiles: configGlobal.financial?.thousand_separator || ',',
            
            // Configuración de animaciones
            animacion: {
                duracion: 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                velocidadContador: 50
            },
            
            // Configuración de notificaciones
            notificaciones: {
                duracionDefecto: 5000,
                posicion: 'top-right',
                maxVisibles: 5
            },
            
            // Configuración de formato
            formato: {
                fecha: 'DD/MM/YYYY',
                idioma: 'es'
            }
        };
    }

    configurarErrorHandler() {
        window.addEventListener('error', (event) => {
            if (this.debug) {
                console.error('🚨 Error global capturado:', event.error);
            }
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            if (this.debug) {
                console.error('🚨 Promise rechazada:', event.reason);
            }
        });
    }

    verificarCompatibilidad() {
        const funcionalidades = {
            localStorage: typeof Storage !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            promises: typeof Promise !== 'undefined',
            customEvents: typeof CustomEvent !== 'undefined'
        };

        const incompatibles = Object.entries(funcionalidades)
            .filter(([nombre, disponible]) => !disponible)
            .map(([nombre]) => nombre);

        if (incompatibles.length > 0) {
            this.log(`⚠️ Funcionalidades no disponibles: ${incompatibles.join(', ')}`);
        }

        return funcionalidades;
    }

    log(mensaje, tipo = 'info') {
        if (!this.debug) return;
        
        const timestamp = new Date().toLocaleTimeString('es-PE');
        const prefijo = `[GRIZALUM-Utils ${timestamp}]`;
        
        switch (tipo) {
            case 'error':
                console.error(`${prefijo} ❌`, mensaje);
                break;
            case 'warn':
                console.warn(`${prefijo} ⚠️`, mensaje);
                break;
            case 'success':
                console.log(`${prefijo} ✅`, mensaje);
                break;
            default:
                console.log(`${prefijo} ℹ️`, mensaje);
        }
    }

    // ======= FORMATEO DE DATOS =======

    formatearMoneda(cantidad, incluirSimbolo = true, abreviado = false) {
        if (typeof cantidad !== 'number') {
            cantidad = this.extraerValorNumerico(cantidad);
        }

        const { simboloMoneda, decimales, locale } = this.configuracion;
        
        if (abreviado && cantidad >= 1000000) {
            return `${simboloMoneda} ${(cantidad / 1000000).toFixed(1)}M`;
        } else if (abreviado && cantidad >= 1000) {
            return `${simboloMoneda} ${(cantidad / 1000).toFixed(0)}K`;
        }
        
        const formateado = new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        }).format(cantidad);
        
        return incluirSimbolo ? `${simboloMoneda} ${formateado}` : formateado;
    }

    formatearPorcentaje(valor, decimales = 1) {
        if (typeof valor === 'string' && valor.includes('%')) {
            return valor; // Ya formateado
        }
        
        const numValor = typeof valor === 'number' ? valor : this.extraerValorNumerico(valor);
        const signo = numValor >= 0 ? '+' : '';
        return `${signo}${numValor.toFixed(decimales)}%`;
    }

    formatearFecha(fecha, formato = null) {
        const formatoFinal = formato || this.configuracion.formato.fecha;
        const d = new Date(fecha);
        
        if (isNaN(d.getTime())) {
            this.log('Fecha inválida proporcionada', 'warn');
            return '';
        }
        
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const año = d.getFullYear();
        
        switch (formatoFinal) {
            case 'DD/MM/YYYY':
                return `${dia}/${mes}/${año}`;
            case 'MM/DD/YYYY':
                return `${mes}/${dia}/${año}`;
            case 'YYYY-MM-DD':
                return `${año}-${mes}-${dia}`;
            case 'relativo':
                return this.obtenerTiempoRelativo(d);
            default:
                return d.toLocaleDateString('es-PE');
        }
    }

    obtenerTiempoRelativo(fecha) {
        const ahora = new Date();
        const diffMs = ahora - fecha;
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutos = Math.floor(diffMs / (1000 * 60));
        
        if (diffMinutos < 1) return 'Ahora mismo';
        if (diffMinutos < 60) return `Hace ${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`;
        if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
        if (diffDias === 1) return 'Ayer';
        if (diffDias < 7) return `Hace ${diffDias} días`;
        if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semana${Math.floor(diffDias / 7) > 1 ? 's' : ''}`;
        if (diffDias < 365) return `Hace ${Math.floor(diffDias / 30)} mes${Math.floor(diffDias / 30) > 1 ? 'es' : ''}`;
        return `Hace ${Math.floor(diffDias / 365)} año${Math.floor(diffDias / 365) > 1 ? 's' : ''}`;
    }

    extraerValorNumerico(texto) {
        if (typeof texto === 'number') return texto;
        
        // Extraer número de texto con símbolos de moneda peruanos
        const textoLimpio = texto.toString()
            .replace(/[S\/\.\s,₡$€£¥%]/g, '')
            .replace(/[^\d\.-]/g, '');
        
        const numero = parseFloat(textoLimpio);
        return isNaN(numero) ? 0 : numero;
    }

    // ======= VALIDACIONES PERUANAS =======

    esEmailValido(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    esRUCValido(ruc) {
        if (!ruc || ruc.length !== 11) return false;
        
        // Verificar que sean solo números
        if (!/^\d{11}$/.test(ruc)) return false;
        
        // Verificar primer dígito (10, 20 para empresas, 15 para extranjeros)
        const primerDigito = parseInt(ruc.substring(0, 2));
        if (![10, 20, 15].includes(primerDigito)) return false;
        
        // Algoritmo de validación RUC
        const factores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let suma = 0;
        
        for (let i = 0; i < 10; i++) {
            suma += parseInt(ruc[i]) * factores[i];
        }
        
        const residuo = suma % 11;
        const digitoVerificacion = residuo < 2 ? residuo : 11 - residuo;
        
        return digitoVerificacion === parseInt(ruc[10]);
    }

    esDNIValido(dni) {
        return /^\d{8}$/.test(dni);
    }

    esTelefonoValido(telefono) {
        // Formatos: 999999999, +51999999999, 51999999999
        const regexTelefono = /^(\+?51)?[9][0-9]{8}$/;
        return regexTelefono.test(telefono.replace(/\s+/g, ''));
    }

    // ======= MANIPULACIÓN DEL DOM =======

    crearElemento(etiqueta, atributos = {}, contenido = '') {
        const elemento = document.createElement(etiqueta);
        
        Object.entries(atributos).forEach(([clave, valor]) => {
            if (clave === 'className') {
                elemento.className = valor;
            } else if (clave === 'innerHTML') {
                elemento.innerHTML = valor;
            } else if (clave === 'textContent') {
                elemento.textContent = valor;
            } else if (clave === 'style' && typeof valor === 'object') {
                Object.assign(elemento.style, valor);
            } else {
                elemento.setAttribute(clave, valor);
            }
        });
        
        if (contenido) {
            elemento.innerHTML = contenido;
        }
        
        return elemento;
    }

    alternarElemento(elemento, mostrar = null) {
        if (typeof elemento === 'string') {
            elemento = document.getElementById(elemento);
        }
        
        if (!elemento) {
            this.log('Elemento no encontrado para alternar', 'warn');
            return;
        }
        
        const esVisible = elemento.style.display !== 'none';
        const debeMostrar = mostrar !== null ? mostrar : !esVisible;
        
        if (debeMostrar) {
            elemento.style.display = 'block';
            elemento.style.opacity = '0';
            setTimeout(() => {
                elemento.style.transition = `opacity ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing}`;
                elemento.style.opacity = '1';
            }, 10);
        } else {
            elemento.style.transition = `opacity ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing}`;
            elemento.style.opacity = '0';
            setTimeout(() => {
                elemento.style.display = 'none';
            }, this.configuracion.animacion.duracion);
        }
    }

    // ======= OPTIMIZACIÓN DE EVENTOS =======

    debounce(func, espera, inmediato = false) {
        let timeout;
        return function ejecutarFuncion(...args) {
            const tarde = () => {
                timeout = null;
                if (!inmediato) func(...args);
            };
            const llamarAhora = inmediato && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(tarde, espera);
            if (llamarAhora) func(...args);
        };
    }

    throttle(func, limite) {
        let enThrottle;
        return function(...args) {
            if (!enThrottle) {
                func.apply(this, args);
                enThrottle = true;
                setTimeout(() => enThrottle = false, limite);
            }
        };
    }

    // ======= ALMACENAMIENTO LOCAL =======

    guardarEnStorage(clave, datos) {
        try {
            const datosSerializados = JSON.stringify({
                valor: datos,
                timestamp: Date.now(),
                version: '2.0'
            });
            localStorage.setItem(`grizalum_${clave}`, datosSerializados);
            return true;
        } catch (error) {
            this.log(`Error guardando en localStorage: ${error.message}`, 'error');
            return false;
        }
    }

    cargarDeStorage(clave, valorDefecto = null) {
        try {
            const item = localStorage.getItem(`grizalum_${clave}`);
            if (!item) return valorDefecto;
            
            const datosDeserializados = JSON.parse(item);
            
            // Verificar si los datos son del formato nuevo
            if (datosDeserializados.version && datosDeserializados.valor !== undefined) {
                return datosDeserializados.valor;
            }
            
            // Compatibilidad con formato anterior
            return datosDeserializados;
            
        } catch (error) {
            this.log(`Error cargando de localStorage: ${error.message}`, 'error');
            return valorDefecto;
        }
    }

    eliminarDeStorage(clave) {
        try {
            localStorage.removeItem(`grizalum_${clave}`);
            return true;
        } catch (error) {
            this.log(`Error eliminando de localStorage: ${error.message}`, 'error');
            return false;
        }
    }

    // ======= PETICIONES HTTP =======

    async peticionHTTP(url, opciones = {}) {
        const opcionesDefecto = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'GRIZALUM-App'
            },
            timeout: 10000
        };
        
        const opcionesFusionadas = { ...opcionesDefecto, ...opciones };
        
        try {
            // Crear AbortController para timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), opcionesFusionadas.timeout);
            
            const response = await fetch(url, {
                ...opcionesFusionadas,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const tipoContenido = response.headers.get('content-type');
            if (tipoContenido && tipoContenido.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
            
        } catch (error) {
            this.log(`Error en petición HTTP a ${url}: ${error.message}`, 'error');
            throw error;
        }
    }

    // ======= UTILIDADES MATEMÁTICAS =======

    aleatorioEnRango(min, max) {
        return Math.random() * (max - min) + min;
    }

    redondearADecimales(numero, decimales = 2) {
        return Math.round(numero * Math.pow(10, decimales)) / Math.pow(10, decimales);
    }

    calcularCambioPorcentual(valorAnterior, valorNuevo) {
        if (valorAnterior === 0) return valorNuevo > 0 ? 100 : 0;
        return ((valorNuevo - valorAnterior) / valorAnterior) * 100;
    }

    calcularPromedio(numeros) {
        if (!Array.isArray(numeros) || numeros.length === 0) return 0;
        const suma = numeros.reduce((acc, num) => acc + num, 0);
        return suma / numeros.length;
    }

    // ======= UTILIDADES DE ARRAYS =======

    agruparPor(array, clave) {
        return array.reduce((resultado, item) => {
            const grupo = typeof clave === 'function' ? clave(item) : item[clave];
            if (!resultado[grupo]) {
                resultado[grupo] = [];
            }
            resultado[grupo].push(item);
            return resultado;
        }, {});
    }

    eliminarDuplicados(array, clave = null) {
        if (clave) {
            const vistos = new Set();
            return array.filter(item => {
                const val = typeof clave === 'function' ? clave(item) : item[clave];
                if (vistos.has(val)) {
                    return false;
                }
                vistos.add(val);
                return true;
            });
        }
        return [...new Set(array)];
    }

    ordenarPor(array, ...criterios) {
        return array.sort((a, b) => {
            for (const criterio of criterios) {
                let { clave, orden = 'asc' } = typeof criterio === 'string' 
                    ? { clave: criterio } 
                    : criterio;
                
                const valorA = typeof clave === 'function' ? clave(a) : a[clave];
                const valorB = typeof clave === 'function' ? clave(b) : b[clave];
                
                if (valorA < valorB) return orden === 'asc' ? -1 : 1;
                if (valorA > valorB) return orden === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    // ======= UTILIDADES DE TEXTO =======

    capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    aTituloCompleto(str) {
        return str.replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    truncarTexto(texto, longitudMaxima, sufijo = '...') {
        if (texto.length <= longitudMaxima) return texto;
        return texto.substring(0, longitudMaxima) + sufijo;
    }

    generarSlug(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // ======= UTILIDADES DE DISPOSITIVO =======

    esMobil() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    esTablet() {
        return /iPad|Android(?=.*Tablet)|Tablet/i.test(navigator.userAgent);
    }

    obtenerInfoNavegador() {
        const ua = navigator.userAgent;
        let navegador = 'Desconocido';
        
        if (ua.includes('Chrome')) navegador = 'Chrome';
        else if (ua.includes('Firefox')) navegador = 'Firefox';
        else if (ua.includes('Safari')) navegador = 'Safari';
        else if (ua.includes('Edge')) navegador = 'Edge';
        else if (ua.includes('Opera')) navegador = 'Opera';
        
        return {
            navegador,
            userAgent: ua,
            plataforma: navigator.platform,
            idioma: navigator.language,
            esMobil: this.esMobil(),
            esTablet: this.esTablet()
        };
    }

    // ======= SISTEMA DE NOTIFICACIONES =======

    inicializarSistemaNotificaciones() {
        this.sistemaNotificaciones = new SistemaNotificacionesGRIZALUM(this.configuracion.notificaciones);
    }

    mostrarNotificacion(mensaje, tipo = 'info', duracion = null, acciones = []) {
        return this.sistemaNotificaciones.mostrar(mensaje, tipo, duracion, acciones);
    }

    mostrarExito(mensaje, duracion = 3000) {
        return this.mostrarNotificacion(mensaje, 'success', duracion);
    }

    mostrarError(mensaje, duracion = 5000) {
        return this.mostrarNotificacion(mensaje, 'error', duracion);
    }

    mostrarAdvertencia(mensaje, duracion = 4000) {
        return this.mostrarNotificacion(mensaje, 'warning', duracion);
    }

    mostrarInfo(mensaje, duracion = 3000) {
        return this.mostrarNotificacion(mensaje, 'info', duracion);
    }

    // ======= SISTEMA DE CARGA =======

    mostrarCarga(objetivo = document.body, mensaje = 'Cargando...') {
        const overlay = this.crearElemento('div', {
            className: 'grizalum-loading-overlay',
            style: {
                position: objetivo === document.body ? 'fixed' : 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '9999',
                flexDirection: 'column',
                gap: '1rem',
                backdropFilter: 'blur(2px)'
            }
        });
        
        const spinner = this.crearElemento('div', {
            className: 'grizalum-spinner',
            style: {
                width: '48px',
                height: '48px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'grizalum-spin 1s linear infinite'
            }
        });
        
        const texto = this.crearElemento('div', {
            style: {
                color: '#374151',
                fontWeight: '600',
                fontSize: '14px'
            },
            textContent: mensaje
        });
        
        overlay.appendChild(spinner);
        overlay.appendChild(texto);
        objetivo.appendChild(overlay);
        
        return overlay;
    }

    ocultarCarga(objetivo = document.body) {
        const overlay = objetivo.querySelector('.grizalum-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, this.configuracion.animacion.duracion);
        }
    }

    // ======= MEDICIÓN DE RENDIMIENTO =======

    medirTiempo(etiqueta, fn) {
        const inicio = performance.now();
        const resultado = fn();
        const fin = performance.now();
        this.log(`${etiqueta}: ${(fin - inicio).toFixed(2)}ms`, 'info');
        return resultado;
    }

    async medirTiempoAsync(etiqueta, fn) {
        const inicio = performance.now();
        const resultado = await fn();
        const fin = performance.now();
        this.log(`${etiqueta}: ${(fin - inicio).toFixed(2)}ms`, 'info');
        return resultado;
    }

    // ======= ESTILOS CSS =======

    inyectarEstilos() {
        const idEstilo = 'grizalum-utilidades-estilos';
        if (document.getElementById(idEstilo)) return;

        const estilos = this.crearElemento('style', { id: idEstilo });
        estilos.textContent = `
            /* GRIZALUM - Estilos de Utilidades */
            @keyframes grizalum-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes grizalum-fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes grizalum-slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes grizalum-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .grizalum-loading-overlay {
                backdrop-filter: blur(2px) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .grizalum-notification-container {
                pointer-events: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .grizalum-notification {
                pointer-events: all;
                animation: grizalum-slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .grizalum-notification:hover {
                transform: translateX(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
            }
            
            .grizalum-fade-in {
                animation: grizalum-fadeIn 0.3s ease-out;
            }
            
            .grizalum-pulse {
                animation: grizalum-pulse 2s infinite;
            }
        `;
        
        document.head.appendChild(estilos);
        this.log('🎨 Estilos de utilidades inyectados');
    }

    // ======= API PÚBLICA =======

    obtenerEstado() {
        return {
            inicializado: this.inicializado,
            configuracion: this.configuracion,
            cache: {
                entradas: this.cache.size,
                claves: Array.from(this.cache.keys())
            },
            notificaciones: this.sistemaNotificaciones?.obtenerEstado() || null,
            compatibilidad: this.verificarCompatibilidad()
        };
    }

    limpiarCache() {
        const entradas = this.cache.size;
        this.cache.clear();
        this.log(`🧹 Cache limpiado: ${entradas} entradas eliminadas`);
    }
}

// ======= SISTEMA DE NOTIFICACIONES AVANZADO =======

class SistemaNotificacionesGRIZALUM {
    constructor(configuracion = {}) {
        this.configuracion = {
            duracionDefecto: configuracion.duracionDefecto || 5000,
            posicion: configuracion.posicion || 'top-right',
            maxVisibles: configuracion.maxVisibles || 5,
            ...configuracion
        };
        
        this.notificaciones = new Map();
        this.contenedor = this.crearContenedor();
        this.contador = 0;
    }
    
    crearContenedor() {
        let contenedor = document.getElementById('grizalum-notification-container');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.id = 'grizalum-notification-container';
            contenedor.className = 'grizalum-notification-container';
            
            const posicionEstilos = this.obtenerEstilosPosicion();
            Object.assign(contenedor.style, {
                position: 'fixed',
                zIndex: '10000',
                maxWidth: '420px',
                ...posicionEstilos
            });
            
            document.body.appendChild(contenedor);
        }
        return contenedor;
    }
    
    obtenerEstilosPosicion() {
        switch (this.configuracion.posicion) {
            case 'top-left':
                return { top: '20px', left: '20px' };
            case 'top-center':
                return { top: '20px', left: '50%', transform: 'translateX(-50%)' };
            case 'top-right':
                return { top: '20px', right: '20px' };
            case 'bottom-left':
                return { bottom: '20px', left: '20px' };
            case 'bottom-center':
                return { bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
            case 'bottom-right':
                return { bottom: '20px', right: '20px' };
            default:
                return { top: '20px', right: '20px' };
        }
    }
    
    mostrar(mensaje, tipo = 'info', duracion = null, acciones = []) {
        // Limitar número de notificaciones visibles
        if (this.notificaciones.size >= this.configuracion.maxVisibles) {
            const primeraNotificacion = this.notificaciones.keys().next().value;
            this.eliminar(primeraNotificacion);
        }
        
        const id = `grizalum_notif_${++this.contador}_${Date.now()}`;
        const duracionFinal = duracion !== null ? duracion : this.configuracion.duracionDefecto;
        
        const notificacion = this.crearNotificacion(id, mensaje, tipo, acciones);
        this.contenedor.appendChild(notificacion);
        this.notificaciones.set(id, notificacion);
        
        // Animación de entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
            notificacion.style.opacity = '1';
        }, 10);
        
        // Auto-eliminación
        if (duracionFinal > 0) {
            setTimeout(() => {
                this.eliminar(id);
            }, duracionFinal);
        }
        
        return id;
    }
    
    crearNotificacion(id, mensaje, tipo, acciones) {
        const colores = {
            success: { 
                bg: 'linear-gradient(135deg, #10b981, #059669)', 
                icono: 'fas fa-check-circle',
                border: '#10b981'
            },
            error: { 
                bg: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                icono: 'fas fa-exclamation-circle',
                border: '#ef4444'
            },
            warning: { 
                bg: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                icono: 'fas fa-exclamation-triangle',
                border: '#f59e0b'
            },
            info: { 
                bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
                icono: 'fas fa-info-circle',
                border: '#3b82f6'
            }
        };
        
        const config = colores[tipo] || colores.info;
        
        const notificacion = document.createElement('div');
        notificacion.className = 'grizalum-notification';
        Object.assign(notificacion.style, {
            background: config.bg,
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateX(100%)',
            opacity: '0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '500',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${config.border}`,
            fontSize: '14px',
            lineHeight: '1.4'
        });
        
        // Icono
        if (typeof config.icono === 'string') {
            const icono = document.createElement('i');
            icono.className = config.icono;
            icono.style.fontSize = '18px';
            notificacion.appendChild(icono);
        }
        
        // Mensaje
        const mensajeEl = document.createElement('div');
        mensajeEl.style.flex = '1';
        mensajeEl.innerHTML = mensaje;
        notificacion.appendChild(mensajeEl);
        
        // Acciones
        if (acciones.length > 0) {
            const contenedorAcciones = document.createElement('div');
            Object.assign(contenedorAcciones.style, {
                display: 'flex',
                gap: '8px',
                marginLeft: '8px'
            });
            
            acciones.forEach(accion => {
                const boton = document.createElement('button');
                Object.assign(boton.style, {
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                });
                boton.textContent = accion.etiqueta;
                
                boton.addEventListener('click', () => {
                    accion.manejador();
                    this.eliminar(id);
                });
                
                boton.addEventListener('mouseenter', () => {
                    boton.style.background = 'rgba(255,255,255,0.3)';
                    boton.style.transform = 'translateY(-1px)';
                });
                
                boton.addEventListener('mouseleave', () => {
                    boton.style.background = 'rgba(255,255,255,0.2)';
                    boton.style.transform = 'translateY(0)';
                });
                
                contenedorAcciones.appendChild(boton);
            });
            
            notificacion.appendChild(contenedorAcciones);
        }
        
        // Botón cerrar
        const botonCerrar = document.createElement('button');
        Object.assign(botonCerrar.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '8px',
            opacity: '0.8',
            transition: 'all 0.2s ease',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
        });
        botonCerrar.innerHTML = '&times;';
        
        botonCerrar.addEventListener('click', () => this.eliminar(id));
        botonCerrar.addEventListener('mouseenter', () => {
            botonCerrar.style.opacity = '1';
            botonCerrar.style.background = 'rgba(255,255,255,0.2)';
        });
        botonCerrar.addEventListener('mouseleave', () => {
            botonCerrar.style.opacity = '0.8';
            botonCerrar.style.background = 'none';
        });
        
        notificacion.appendChild(botonCerrar);
        
        return notificacion;
    }
    
    eliminar(id) {
        const notificacion = this.notificaciones.get(id);
        if (!notificacion) return;
        
        notificacion.style.transform = 'translateX(100%)';
        notificacion.style.opacity = '0';
        
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
            this.notificaciones.delete(id);
        }, 300);
    }
    
    limpiar() {
        this.notificaciones.forEach((_, id) => this.eliminar(id));
    }
    
    obtenerEstado() {
        return {
            notificacionesActivas: this.notificaciones.size,
            configuracion: this.configuracion
        };
    }
}

// ======= INSTANCIA GLOBAL =======
const utilidadesGrizalum = new UtilidadesGRIZALUM();

// ======= EXPORTACIÓN GLOBAL =======

// API principal
window.GrizalumUtils = utilidadesGrizalum;

// Funciones de conveniencia globales
window.formatCurrency = (amount, includeSymbol) => utilidadesGrizalum.formatearMoneda(amount, includeSymbol);
window.formatPercentage = (value, decimals) => utilidadesGrizalum.formatearPorcentaje(value, decimals);
window.formatDate = (date, format) => utilidadesGrizalum.formatearFecha(date, format);
window.showNotification = (...args) => utilidadesGrizalum.mostrarNotificacion(...args);
window.showSuccessNotification = (message, duration) => utilidadesGrizalum.mostrarExito(message, duration);
window.showErrorNotification = (message, duration) => utilidadesGrizalum.mostrarError(message, duration);
window.showWarningNotification = (message, duration) => utilidadesGrizalum.mostrarAdvertencia(message, duration);
window.showInfoNotification = (message, duration) => utilidadesGrizalum.mostrarInfo(message, duration);

// Compatibilidad con código existente
window.debounce = (...args) => utilidadesGrizalum.debounce(...args);
window.throttle = (...args) => utilidadesGrizalum.throttle(...args);
window.isValidEmail = (email) => utilidadesGrizalum.esEmailValido(email);
window.isValidRUC = (ruc) => utilidadesGrizalum.esRUCValido(ruc);
window.isValidDNI = (dni) => utilidadesGrizalum.esDNIValido(dni);

// ======= INICIALIZACIÓN =======
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que otros módulos estén listos
    setTimeout(() => {
        // Disparar evento de inicialización
        const evento = new CustomEvent('grizalumUtilsReady', {
            detail: { 
                version: '2.0',
                utils: utilidadesGrizalum,
                timestamp: Date.now() 
            }
        });
        document.dispatchEvent(evento);
        
        utilidadesGrizalum.log('🚀 GRIZALUM Utils completamente inicializado y listo', 'success');
        
    }, 100);
});

console.log('🛠️ GRIZALUM Sistema de Utilidades v2.0 cargado');
console.log('✨ Funcionalidades principales:');
console.log('  • 💰 Formateo de moneda peruana optimizado');
console.log('  • 📊 Validaciones específicas para Perú (RUC, DNI)');
console.log('  • 🔔 Sistema de notificaciones avanzado');
console.log('  • 📱 Detección de dispositivos móviles');
console.log('  • 💾 Gestión de almacenamiento local');
console.log('  • 🎨 Animaciones y transiciones suaves');
console.log('  • ⚡ Optimización de eventos y rendimiento');
console.log('  • 🌐 Peticiones HTTP con timeout');
console.log('  • 🔧 Manipulación avanzada del DOM');
console.log('🚀 ¡Sistema de utilidades listo para empresas peruanas!');
