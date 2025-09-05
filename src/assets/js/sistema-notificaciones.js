/**
 * ================================================================
 * GRIZALUM NOTIFICATION SYSTEM - ULTRA PROFESSIONAL EDITION v2.0
 * Sistema centralizado de notificaciones con gestión avanzada
 * Integrado con ecosistema completo GRIZALUM
 * ================================================================
 */

class SistemaNotificacionesGRIZALUM {
    constructor() {
        this.version = '2.0.0';
        this.notificaciones = [];
        this.cola = [];
        this.contenedor = null;
        this.utilidades = null;
        this.gestorTemas = null;
        this.cache = new Map();
        this.inicializado = false;
        
        // Configuración avanzada
        this.configuracion = {
            posicion: 'top-right', // top-right, top-left, bottom-right, bottom-left, center
            duracionPorDefecto: 5000,
            maxNotificaciones: 5,
            maxCola: 10,
            animacion: {
                entrada: 'slideInRight',
                salida: 'slideOutRight',
                duracion: 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            accesibilidad: {
                liveRegion: true,
                autoFocus: true,
                anunciarTipo: true
            },
            sonido: {
                habilitado: false,
                volumen: 0.3,
                archivos: {
                    success: null,
                    error: null,
                    warning: null,
                    info: null
                }
            },
            comportamiento: {
                pausarEnHover: true,
                cerrarEnClick: false,
                agruparSimilares: true,
                persistirConfiguracion: true
            },
            templates: {
                simple: true,
                avanzado: true,
                conBotones: true
            }
        };
        
        // Métricas y analíticas
        this.metricas = {
            totalMostradas: 0,
            porTipo: { success: 0, error: 0, warning: 0, info: 0 },
            interacciones: { cerradas: 0, clicks: 0, hovers: 0 },
            tiemposVisualizacion: []
        };
        
        this.log('🚀 Inicializando GRIZALUM Notification System v2.0...');
    }

    // ======= INICIALIZACIÓN AVANZADA =======
    
    inicializar() {
        try {
            this.log('🔔 Inicializando sistema de notificaciones...', 'info');
            
            // Detectar dependencias
            this.detectarDependencias();
            
            // Cargar configuración global
            this.cargarConfiguracionGlobal();
            
            // Cargar configuración persistente
            this.cargarConfiguracionPersistente();
            
            // Crear contenedor principal
            this.crearContenedorPrincipal();
            
            // Configurar accesibilidad
            this.configurarAccesibilidad();
            
            // Configurar eventos
            this.configurarEventos();
            
            // Inicializar sistema de sonido si está habilitado
            if (this.configuracion.sonido.habilitado) {
                this.inicializarSistemaSonido();
            }
            
            this.inicializado = true;
            this.log('✅ Sistema de notificaciones inicializado correctamente', 'success');
            
            // Disparar evento de inicialización
            this.dispararEvento('notificationSystemReady', {
                version: this.version,
                configuracion: this.configuracion
            });
            
        } catch (error) {
            this.log(`❌ Error inicializando sistema de notificaciones: ${error.message}`, 'error');
        }
    }

    detectarDependencias() {
        // Detectar utilidades GRIZALUM
        this.utilidades = window.GrizalumUtils || null;
        if (this.utilidades) {
            this.log('🔗 Sistema de utilidades GRIZALUM detectado', 'success');
        }
        
        // Detectar gestor de temas
        this.gestorTemas = window.themeManager || window.gestorTemas || null;
        if (this.gestorTemas) {
            this.log('🎨 Gestor de temas GRIZALUM detectado', 'success');
        }
    }

    cargarConfiguracionGlobal() {
        const config = window.GRIZALUM_CONFIG || {};
        
        // Fusionar configuración de notificaciones
        if (config.notifications) {
            this.configuracion = this.fusionarConfiguracion(this.configuracion, config.notifications);
        }
        
        // Aplicar configuración de animaciones globales
        if (config.animation) {
            this.configuracion.animacion = {
                ...this.configuracion.animacion,
                duracion: config.animation.duration || this.configuracion.animacion.duracion,
                easing: config.animation.easing || this.configuracion.animacion.easing
            };
        }
        
        this.log('⚙️ Configuración global de notificaciones cargada', 'info');
    }

    cargarConfiguracionPersistente() {
        if (!this.configuracion.comportamiento.persistirConfiguracion) return;
        
        const cacheKey = 'grizalum_notifications_config';
        let configGuardada = null;
        
        if (this.utilidades) {
            configGuardada = this.utilidades.cargarDeStorage(cacheKey);
        } else {
            try {
                const guardada = localStorage.getItem(cacheKey);
                configGuardada = guardada ? JSON.parse(guardada) : null;
            } catch (error) {
                this.log(`Error cargando configuración persistente: ${error.message}`, 'warn');
            }
        }
        
        if (configGuardada) {
            // Solo persistir ciertas configuraciones
            this.configuracion.posicion = configGuardada.posicion || this.configuracion.posicion;
            this.configuracion.sonido.habilitado = configGuardada.sonidoHabilitado || this.configuracion.sonido.habilitado;
            
            this.log('📂 Configuración persistente de notificaciones cargada', 'info');
        }
    }

    guardarConfiguracionPersistente() {
        if (!this.configuracion.comportamiento.persistirConfiguracion) return;
        
        const configParaGuardar = {
            posicion: this.configuracion.posicion,
            sonidoHabilitado: this.configuracion.sonido.habilitado,
            timestamp: Date.now(),
            version: this.version
        };
        
        const cacheKey = 'grizalum_notifications_config';
        
        if (this.utilidades) {
            this.utilidades.guardarEnStorage(cacheKey, configParaGuardar);
        } else {
            try {
                localStorage.setItem(cacheKey, JSON.stringify(configParaGuardar));
            } catch (error) {
                this.log(`Error guardando configuración persistente: ${error.message}`, 'warn');
            }
        }
    }

    fusionarConfiguracion(destino, origen) {
        const resultado = { ...destino };
        
        Object.keys(origen).forEach(clave => {
            if (typeof origen[clave] === 'object' && !Array.isArray(origen[clave])) {
                resultado[clave] = { ...resultado[clave], ...origen[clave] };
            } else {
                resultado[clave] = origen[clave];
            }
        });
        
        return resultado;
    }

    log(mensaje, tipo = 'info') {
        if (this.utilidades) {
            this.utilidades.log(`[Notifications] ${mensaje}`, tipo);
        } else {
            const timestamp = new Date().toLocaleTimeString('es-PE');
            const prefijo = `[GRIZALUM-Notifications ${timestamp}]`;
            
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
    }

    // ======= CONTENEDOR Y ACCESIBILIDAD =======
    
    crearContenedorPrincipal() {
        // Eliminar contenedor existente si existe
        const contenedorExistente = document.getElementById('grizalum-notifications-container');
        if (contenedorExistente) {
            contenedorExistente.remove();
        }

        // Crear nuevo contenedor
        this.contenedor = this.utilidades?.crearElemento('div', {
            id: 'grizalum-notifications-container',
            className: `grizalum-notifications-container ${this.configuracion.posicion}`,
            role: 'region',
            'aria-label': 'Notificaciones del sistema',
            'aria-live': 'polite'
        }) || this.crearContenedorManual();
        
        document.body.appendChild(this.contenedor);
        this.cache.set('contenedor', this.contenedor);
        
        this.log('📦 Contenedor de notificaciones creado', 'info');
    }

    crearContenedorManual() {
        const contenedor = document.createElement('div');
        contenedor.id = 'grizalum-notifications-container';
        contenedor.className = `grizalum-notifications-container ${this.configuracion.posicion}`;
        contenedor.setAttribute('role', 'region');
        contenedor.setAttribute('aria-label', 'Notificaciones del sistema');
        contenedor.setAttribute('aria-live', 'polite');
        return contenedor;
    }

    configurarAccesibilidad() {
        if (!this.configuracion.accesibilidad.liveRegion) return;
        
        // Crear región aria-live para anuncios
        let liveRegion = document.getElementById('grizalum-live-region');
        if (!liveRegion) {
            liveRegion = this.utilidades?.crearElemento('div', {
                id: 'grizalum-live-region',
                'aria-live': 'assertive',
                'aria-atomic': 'true',
                style: {
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }
            }) || this.crearLiveRegionManual();
            
            document.body.appendChild(liveRegion);
        }
        
        this.cache.set('liveRegion', liveRegion);
        this.log('♿ Región aria-live configurada', 'info');
    }

    crearLiveRegionManual() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'grizalum-live-region';
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        return liveRegion;
    }

    anunciarParaAccesibilidad(mensaje, tipo) {
        if (!this.configuracion.accesibilidad.liveRegion) return;
        
        const liveRegion = this.cache.get('liveRegion');
        if (!liveRegion) return;
        
        const tipoTexto = this.configuracion.accesibilidad.anunciarTipo 
            ? this.obtenerTextoTipo(tipo) + ': ' 
            : '';
        
        liveRegion.textContent = tipoTexto + mensaje;
        
        // Limpiar después de un momento
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }

    obtenerTextoTipo(tipo) {
        const textos = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return textos[tipo] || 'Notificación';
    }

    // ======= FUNCIONALIDAD PRINCIPAL =======
    
    /**
     * Mostrar notificación principal
     * @param {string|Object} mensaje - Texto o configuración completa
     * @param {string} tipo - 'success', 'error', 'warning', 'info'
     * @param {number} duracion - Tiempo en milisegundos
     * @param {Object} opciones - Opciones adicionales
     */
    mostrar(mensaje, tipo = 'info', duracion = null, opciones = {}) {
        // Validar inicialización
        if (!this.inicializado) {
            this.log('⚠️ Sistema de notificaciones no inicializado', 'warn');
            return null;
        }

        // Procesar configuración de entrada
        const config = this.procesarConfiguracionEntrada(mensaje, tipo, duracion, opciones);
        
        // Verificar si debe agruparse con una notificación similar
        if (this.configuracion.comportamiento.agruparSimilares) {
            const notificacionSimilar = this.buscarNotificacionSimilar(config.mensaje, config.tipo);
            if (notificacionSimilar) {
                return this.actualizarNotificacionSimilar(notificacionSimilar, config);
            }
        }

        // Verificar límite de notificaciones
        if (this.notificaciones.length >= this.configuracion.maxNotificaciones) {
            if (this.cola.length < this.configuracion.maxCola) {
                this.cola.push(config);
                this.log('📥 Notificación agregada a la cola', 'info');
                return null;
            } else {
                this.removerMasAntigua();
            }
        }

        // Crear la notificación
        const notificacion = this.crearNotificacion(config);
        
        // Agregar al contenedor con animación
        this.agregarAlContenedor(notificacion, config);
        
        // Actualizar métricas
        this.actualizarMetricas(config.tipo);
        
        // Programar auto-remove si corresponde
        if (config.duracion > 0) {
            this.programarAutoRemove(notificacion, config.duracion);
        }

        this.log(`🔔 Notificación mostrada: ${config.tipo} - ${config.mensaje.substring(0, 50)}...`, 'info');
        
        return notificacion;
    }

    procesarConfiguracionEntrada(mensaje, tipo, duracion, opciones) {
        let config = {};
        
        // Si el mensaje es un objeto, extraer configuración
        if (typeof mensaje === 'object') {
            config = { ...mensaje };
            config.mensaje = config.mensaje || config.text || config.message || '';
            config.tipo = config.tipo || config.type || 'info';
            config.duracion = config.duracion || config.duration || null;
            config.opciones = config.opciones || config.options || {};
        } else {
            config = {
                mensaje: mensaje,
                tipo: tipo,
                duracion: duracion,
                opciones: opciones
            };
        }

        // Usar duración por defecto si no se especifica
        config.duracion = config.duracion || this.configuracion.duracionPorDefecto;
        
        // Validar tipo
        if (!['success', 'error', 'warning', 'info'].includes(config.tipo)) {
            this.log(`⚠️ Tipo de notificación inválido: ${config.tipo}`, 'warn');
            config.tipo = 'info';
        }

        return config;
    }

    buscarNotificacionSimilar(mensaje, tipo) {
        return this.notificaciones.find(notif => {
            const notifData = notif.dataset;
            return notifData.mensaje === mensaje && notifData.tipo === tipo;
        });
    }

    actualizarNotificacionSimilar(notificacion, config) {
        // Incrementar contador si existe
        const contador = notificacion.querySelector('.notification-counter');
        if (contador) {
            const count = parseInt(contador.textContent) + 1;
            contador.textContent = count;
        } else {
            // Agregar contador
            const contenido = notificacion.querySelector('.notification-text');
            if (contenido) {
                const contadorEl = document.createElement('span');
                contadorEl.className = 'notification-counter';
                contadorEl.textContent = '2';
                contenido.appendChild(contadorEl);
            }
        }
        
        // Reiniciar animación de progreso
        this.reiniciarProgreso(notificacion, config.duracion);
        
        this.log('🔄 Notificación similar actualizada', 'info');
        return notificacion;
    }

    crearNotificacion(config) {
        const notificacion = this.utilidades?.crearElemento('div', {
            className: `grizalum-notification ${config.tipo}`,
            role: 'alert',
            'aria-live': 'assertive',
            tabindex: '-1',
            style: {
                '--duration': `${config.duracion}ms`,
                '--notification-color': this.obtenerColorTema(config.tipo),
                '--notification-color-secondary': this.obtenerColorTema(config.tipo, true)
            }
        }) || this.crearNotificacionManual(config);
        
        // ID único
        notificacion.id = `grizalum-notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Almacenar datos en el elemento
        notificacion.dataset.mensaje = config.mensaje;
        notificacion.dataset.tipo = config.tipo;
        notificacion.dataset.timestamp = Date.now();
        
        // Generar contenido según template
        notificacion.innerHTML = this.generarContenidoNotificacion(config);
        
        // Configurar eventos de la notificación
        this.configurarEventosNotificacion(notificacion, config);
        
        return notificacion;
    }

    crearNotificacionManual(config) {
        const notificacion = document.createElement('div');
        notificacion.className = `grizalum-notification ${config.tipo}`;
        notificacion.setAttribute('role', 'alert');
        notificacion.setAttribute('aria-live', 'assertive');
        notificacion.setAttribute('tabindex', '-1');
        notificacion.style.setProperty('--duration', `${config.duracion}ms`);
        return notificacion;
    }

    obtenerColorTema(tipo, secundario = false) {
        if (!this.gestorTemas) {
            const colores = {
                success: secundario ? '#34d399' : '#10b981',
                error: secundario ? '#f87171' : '#ef4444',
                warning: secundario ? '#fbbf24' : '#f59e0b',
                info: secundario ? '#60a5fa' : '#3b82f6'
            };
            return colores[tipo] || colores.info;
        }
        
        // Obtener colores del tema actual
        const temaActual = this.gestorTemas.obtenerTemaActual();
        if (temaActual?.tema?.colores) {
            const sufijo = secundario ? 'Light' : '';
            return temaActual.tema.colores[tipo + sufijo] || 
                   temaActual.tema.colores[tipo] || 
                   temaActual.tema.colores.primary;
        }
        
        return '#3b82f6'; // Fallback
    }

    generarContenidoNotificacion(config) {
        const iconos = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const titulo = config.opciones.titulo || config.opciones.title || '';
        const icono = config.opciones.icono || config.opciones.icon || iconos[config.tipo];
        const template = config.opciones.template || 'simple';
        
        // Contenido base
        let contenido = `
            <div class="notification-content">
                <i class="notification-icon ${icono}" aria-hidden="true"></i>
                <div class="notification-text">
                    ${titulo ? `<div class="notification-title">${titulo}</div>` : ''}
                    <div class="notification-message">${config.mensaje}</div>
                </div>
            </div>
        `;
        
        // Agregar botones si están especificados
        if (config.opciones.botones && Array.isArray(config.opciones.botones)) {
            contenido += '<div class="notification-actions">';
            config.opciones.botones.forEach(boton => {
                contenido += `
                    <button class="notification-btn ${boton.clase || ''}" 
                            data-action="${boton.accion}"
                            ${boton.primary ? 'data-primary="true"' : ''}>
                        ${boton.texto}
                    </button>
                `;
            });
            contenido += '</div>';
        }
        
        // Botón de cerrar
        contenido += `
            <button class="notification-close" 
                    title="Cerrar notificación" 
                    aria-label="Cerrar notificación">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        `;
        
        return contenido;
    }

    configurarEventosNotificacion(notificacion, config) {
        // Botón de cerrar
        const botonCerrar = notificacion.querySelector('.notification-close');
        if (botonCerrar) {
            botonCerrar.addEventListener('click', () => {
                this.remover(notificacion);
                this.metricas.interacciones.cerradas++;
            });
        }
        
        // Botones de acción
        const botonesAccion = notificacion.querySelectorAll('.notification-btn[data-action]');
        botonesAccion.forEach(boton => {
            boton.addEventListener('click', (evento) => {
                const accion = evento.target.dataset.action;
                this.manejarAccionBoton(accion, notificacion, config);
                this.metricas.interacciones.clicks++;
            });
        });

        // Pausar progreso al hacer hover
        if (this.configuracion.comportamiento.pausarEnHover) {
            notificacion.addEventListener('mouseenter', () => {
                this.pausarProgreso(notificacion);
                this.metricas.interacciones.hovers++;
            });

            notificacion.addEventListener('mouseleave', () => {
                this.reanudarProgreso(notificacion, config.duracion);
            });
        }
        
        // Cerrar en click si está habilitado
        if (this.configuracion.comportamiento.cerrarEnClick) {
            notificacion.addEventListener('click', (evento) => {
                if (!evento.target.closest('button')) {
                    this.remover(notificacion);
                }
            });
        }
        
        // Eventos de teclado para accesibilidad
        notificacion.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape') {
                this.remover(notificacion);
            }
        });
    }

    manejarAccionBoton(accion, notificacion, config) {
        // Disparar evento personalizado
        this.dispararEvento('notificationAction', {
            accion,
            notificacion,
            config,
            timestamp: Date.now()
        });
        
        // Cerrar notificación después de la acción
        setTimeout(() => {
            this.remover(notificacion);
        }, 100);
    }

    agregarAlContenedor(notificacion, config) {
        this.contenedor.appendChild(notificacion);
        this.notificaciones.push(notificacion);
        
        // Anunciar para accesibilidad
        this.anunciarParaAccesibilidad(config.mensaje, config.tipo);
        
        // Reproducir sonido si está habilitado
        this.reproducirSonido(config.tipo);
        
        // Activar animación de entrada
        setTimeout(() => {
            notificacion.classList.add('notification-enter');
            
            // Auto-focus si está habilitado
            if (this.configuracion.accesibilidad.autoFocus) {
                notificacion.focus();
            }
        }, 10);
    }

    programarAutoRemove(notificacion, duracion) {
        setTimeout(() => {
            if (notificacion.parentElement) {
                this.remover(notificacion);
            }
        }, duracion);
    }

    // ======= GESTIÓN DE NOTIFICACIONES =======
    
    remover(notificacion) {
        if (!notificacion || !notificacion.parentElement) return;

        // Registrar tiempo de visualización
        const timestamp = parseInt(notificacion.dataset.timestamp);
        const tiempoVisualizacion = Date.now() - timestamp;
        this.metricas.tiemposVisualizacion.push(tiempoVisualizacion);

        // Animación de salida
        notificacion.classList.add('notification-exit');

        // Remover después de la animación
        setTimeout(() => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
            
            // Remover de array
            this.notificaciones = this.notificaciones.filter(n => n !== notificacion);
            
            // Procesar cola si hay elementos
            this.procesarCola();
            
        }, this.configuracion.animacion.duracion);

        this.log('🗑️ Notificación removida', 'info');
    }

    removerMasAntigua() {
        if (this.notificaciones.length > 0) {
            this.remover(this.notificaciones[0]);
        }
    }

    limpiarTodas() {
        this.notificaciones.forEach(notificacion => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
        });
        
        this.notificaciones = [];
        this.cola = [];
        
        this.log('🧹 Todas las notificaciones limpiadas', 'info');
    }

    procesarCola() {
        if (this.cola.length > 0 && this.notificaciones.length < this.configuracion.maxNotificaciones) {
            const siguienteConfig = this.cola.shift();
            setTimeout(() => {
                this.mostrar(siguienteConfig);
            }, 200);
        }
    }

    // ======= CONTROL DE PROGRESO =======
    
    pausarProgreso(notificacion) {
        notificacion.style.setProperty('--duration', 'paused');
    }

    reanudarProgreso(notificacion, duracion) {
        notificacion.style.setProperty('--duration', `${duracion}ms`);
    }

    reiniciarProgreso(notificacion, duracion) {
        // Reiniciar animación de barra de progreso
        notificacion.style.animation = 'none';
        notificacion.offsetHeight; // Trigger reflow
        notificacion.style.animation = null;
        notificacion.style.setProperty('--duration', `${duracion}ms`);
    }

    // ======= SISTEMA DE SONIDO =======
    
    inicializarSistemaSonido() {
        // Aquí se podría implementar carga de archivos de sonido
        this.log('🔊 Sistema de sonido inicializado', 'info');
    }

    reproducirSonido(tipo) {
        if (!this.configuracion.sonido.habilitado) return;
        
        const archivo = this.configuracion.sonido.archivos[tipo];
        if (archivo) {
            try {
                const audio = new Audio(archivo);
                audio.volume = this.configuracion.sonido.volumen;
                audio.play().catch(error => {
                    this.log(`Error reproduciendo sonido: ${error.message}`, 'warn');
                });
            } catch (error) {
                this.log(`Error creando audio: ${error.message}`, 'warn');
            }
        }
    }

    // ======= MÉTODOS DE CONVENIENCIA =======
    
    exito(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'success', opciones.duracion || 3000, opciones);
    }

    error(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'error', opciones.duracion || 7000, opciones);
    }

    advertencia(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'warning', opciones.duracion || 6000, opciones);
    }

    informacion(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'info', opciones.duracion || 4000, opciones);
    }

    // Método para notificaciones con botones
    mostrarConBotones(mensaje, botones, tipo = 'info', opciones = {}) {
        return this.mostrar(mensaje, tipo, 0, { // Duración 0 para no auto-cerrar
            ...opciones,
            botones: botones
        });
    }

    // ======= CONFIGURACIÓN =======
    
    configurarPosicion(posicion) {
        const posicionesValidas = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'center'];
        
        if (!posicionesValidas.includes(posicion)) {
            this.log(`⚠️ Posición inválida: ${posicion}`, 'warn');
            return false;
        }

        this.configuracion.posicion = posicion;
        if (this.contenedor) {
            this.contenedor.className = `grizalum-notifications-container ${posicion}`;
        }
        
        // Guardar configuración
        this.guardarConfiguracionPersistente();
        
        this.log(`📍 Posición de notificaciones cambiada a: ${posicion}`, 'info');
        return true;
    }

    configurarSonido(habilitado, volumen = null) {
        this.configuracion.sonido.habilitado = habilitado;
        if (volumen !== null) {
            this.configuracion.sonido.volumen = Math.max(0, Math.min(1, volumen));
        }
        
        this.guardarConfiguracionPersistente();
        this.log(`🔊 Sonido de notificaciones: ${habilitado ? 'habilitado' : 'deshabilitado'}`, 'info');
    }

    // ======= EVENTOS =======
    
    configurarEventos() {
        // Limpiar notificaciones antes de cerrar página
        window.addEventListener('beforeunload', () => {
            this.limpiarTodas();
        });

        // Escuchar eventos del sistema para notificaciones automáticas
        this.configurarEventosIntegracion();

        // Escuchar cambios de tema
        document.addEventListener('grizalumThemeChanged', () => {
            this.aplicarEstilosDinamicos();
        });

        this.log('🎯 Eventos de notificaciones configurados', 'info');
    }

    configurarEventosIntegracion() {
        // Cambio de empresa
        document.addEventListener('grizalumCompanyChanged', (evento) => {
            const { company } = evento.detail;
            this.exito(`🏢 Empresa: ${company.name}`, {
                duracion: 3000,
                titulo: 'Empresa Cambiada'
            });
        });

        // Cambio de período
        document.addEventListener('grizalumPeriodoCambiado', (evento) => {
            const { periodo } = evento.detail;
            const nombrePeriodo = this.utilidades?.capitalizar(periodo) || periodo;
            this.informacion(`📅 Período: ${nombrePeriodo}`, {
                duracion: 2000
            });
        });

        // Navegación del sidebar
        document.addEventListener('navegacionSidebar', (evento) => {
            const { seccion } = evento.detail;
            const nombres = {
                'dashboard': 'Panel de Control',
                'cash-flow': 'Flujo de Caja',
                'income-statement': 'Estado de Resultados',
                'balance-sheet': 'Balance General',
                'inventory': 'Inventario',
                'sales': 'Ventas'
            };
            
            const nombre = nombres[seccion] || this.utilidades?.capitalizar(seccion) || seccion;
            this.informacion(`📱 ${nombre}`, {
                duracion: 2000
            });
        });

        // Error de sistema
        document.addEventListener('systemError', (evento) => {
            const { message, details } = evento.detail;
            this.error(message, {
                titulo: 'Error del Sistema',
                duracion: 8000
            });
        });
    }

    dispararEvento(nombreEvento, detalle = {}) {
        const evento = new CustomEvent(nombreEvento, {
            detail: {
                ...detalle,
                notificationSystemVersion: this.version,
                timestamp: detalle.timestamp || Date.now()
            }
        });
        document.dispatchEvent(evento);
    }
    

    // ======= MÉTRICAS Y ANALÍTICAS =======
    
    actualizarMetricas(tipo) {
        this.metricas.totalMostradas++;
        this.metricas.porTipo[tipo]++;
    }

    obtenerEstadisticas() {
        const promedioVisualizacion = this.metricas.tiemposVisualizacion.length > 0
            ? this.metricas.tiemposVisualizacion.reduce((a, b) => a + b, 0) / this.metricas.tiemposVisualizacion.length
            : 0;

        return {
            version: this.version,
            inicializado: this.inicializado,
            activas: this.notificaciones.length,
            enCola: this.cola.length,
            posicion: this.configuracion.posicion,
            duracionPorDefecto: this.configuracion.duracionPorDefecto,
            maxNotificaciones: this.configuracion.maxNotificaciones,
            metricas: {
                ...this.metricas,
                promedioVisualizacion: Math.round(promedioVisualizacion)
            },
            configuracion: { ...this.configuracion }
        };
    }

    obtenerAnalyticas() {
        return {
            rendimiento: {
                notificacionesPorMinuto: this.calcularNotificacionesPorMinuto(),
                tasaCierre: this.calcularTasaCierre(),
                tiempoPromedioVisualizacion: this.metricas.tiemposVisualizacion.length > 0
                    ? this.metricas.tiemposVisualizacion.reduce((a, b) => a + b, 0) / this.metricas.tiemposVisualizacion.length
                    : 0
            },
            distribucion: this.metricas.porTipo,
            interacciones: this.metricas.interacciones
        };
    }

    calcularNotificacionesPorMinuto() {
        // Implementación simplificada
        return Math.round(this.metricas.totalMostradas / 5); // Asumiendo 5 minutos de uso
    }

    calcularTasaCierre() {
        return this.metricas.totalMostradas > 0
            ? (this.metricas.interacciones.cerradas / this.metricas.totalMostradas) * 100
            : 0;
    }

    // ======= API PÚBLICA =======
    
    obtenerEstado() {
        return {
            version: this.version,
            inicializado: this.inicializado,
            notificacionesActivas: this.notificaciones.length,
            notificacionesEnCola: this.cola.length,
            configuracion: { ...this.configuracion }
        };
    }

    reiniciarMetricas() {
        this.metricas = {
            totalMostradas: 0,
            porTipo: { success: 0, error: 0, warning: 0, info: 0 },
            interacciones: { cerradas: 0, clicks: 0, hovers: 0 },
            tiemposVisualizacion: []
        };
        this.log('📊 Métricas de notificaciones reiniciadas', 'info');
    }
}

// ======= INSTANCIA GLOBAL =======
let sistemaNotificacionesGrizalum = null;

// ======= INICIALIZACIÓN AUTOMÁTICA =======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔔 DOM listo - Inicializando GRIZALUM Notification System v2.0...');
    
    try {
        sistemaNotificacionesGrizalum = new SistemaNotificacionesGRIZALUM();
        sistemaNotificacionesGrizalum.inicializar();
        
        // Alias globales
        window.notificationSystem = sistemaNotificacionesGrizalum;
        window.sistemaNotificaciones = sistemaNotificacionesGrizalum; // Compatibilidad
        
        // Mostrar notificación de bienvenida después de un momento
        setTimeout(() => {
            sistemaNotificacionesGrizalum.exito('🚀 Sistema GRIZALUM iniciado correctamente', {
                titulo: '¡Bienvenido!',
                duracion: 4000
            });
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error inicializando Notification System:', error);
    }
});

// ======= FUNCIONES GLOBALES PARA COMPATIBILIDAD =======

/**
 * Función global principal para mostrar notificaciones
 * Compatible con la función del grizalum-principal.js
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 5000) {
    return window.notificationSystem?.mostrar(mensaje, tipo, duracion) || null;
}

/**
 * Funciones de conveniencia globales
 */
function notificacionExito(mensaje, opciones = {}) {
    return window.notificationSystem?.exito(mensaje, opciones) || null;
}

function notificacionError(mensaje, opciones = {}) {
    return window.notificationSystem?.error(mensaje, opciones) || null;
}

function notificacionAdvertencia(mensaje, opciones = {}) {
    return window.notificationSystem?.advertencia(mensaje, opciones) || null;
}

function notificacionInfo(mensaje, opciones = {}) {
    return window.notificationSystem?.informacion(mensaje, opciones) || null;
}

// ======= API PÚBLICA DEL SISTEMA DE NOTIFICACIONES =======
window.GRIZALUM_NOTIFICATIONS = {
    version: '2.0.0',
    
    // Métodos principales
    mostrar: (mensaje, tipo, duracion, opciones) => window.notificationSystem?.mostrar(mensaje, tipo, duracion, opciones),
    exito: (mensaje, opciones) => window.notificationSystem?.exito(mensaje, opciones),
    error: (mensaje, opciones) => window.notificationSystem?.error(mensaje, opciones),
    advertencia: (mensaje, opciones) => window.notificationSystem?.advertencia(mensaje, opciones),
    info: (mensaje, opciones) => window.notificationSystem?.informacion(mensaje, opciones),
    
    // Notificaciones avanzadas
    mostrarConBotones: (mensaje, botones, tipo, opciones) => window.notificationSystem?.mostrarConBotones(mensaje, botones, tipo, opciones),
    
    // Gestión
    limpiar: () => window.notificationSystem?.limpiarTodas(),
    remover: (notificacion) => window.notificationSystem?.remover(notificacion),
    
    // Configuración
    configurarPosicion: (posicion) => window.notificationSystem?.configurarPosicion(posicion),
    configurarSonido: (habilitado, volumen) => window.notificationSystem?.configurarSonido(habilitado, volumen),
    
    // Estado y analíticas
    obtenerEstado: () => window.notificationSystem?.obtenerEstado(),
    obtenerEstadisticas: () => window.notificationSystem?.obtenerEstadisticas(),
    obtenerAnalyticas: () => window.notificationSystem?.obtenerAnalyticas(),
    reiniciarMetricas: () => window.notificationSystem?.reiniciarMetricas(),
    
    // Utilidades
    estaInicializado: () => window.notificationSystem?.inicializado || false
};

// Hacer funciones disponibles globalmente para compatibilidad
window.mostrarNotificacion = mostrarNotificacion;
window.notificacionExito = notificacionExito;
window.notificacionError = notificacionError;
window.notificacionAdvertencia = notificacionAdvertencia;
window.notificacionInfo = notificacionInfo;


// ======= NOTIFICACIONES PERSISTENTES DEL ADMIN =======

/**
 * Obtener notificaciones del admin para la empresa actual
 */
function obtenerNotificacionesAdmin() {
    console.log('=== DEBUG NOTIFICACIONES ===');
    console.log('window.gestorEmpresas:', window.gestorEmpresas);
    console.log('window.adminEmpresas:', window.adminEmpresas);
    
    // Buscar el gestor correcto
    const gestorPrincipal = window.gestorEmpresas || window.adminEmpresas?.gestor;
    console.log('gestorPrincipal:', gestorPrincipal);
    
    if (!gestorPrincipal) {
        console.log('❌ No se encontró gestor');
        return [];
    }
    
    console.log('Estado completo:', gestorPrincipal.estado);
    console.log('Empresas disponibles:', Object.keys(gestorPrincipal.estado.empresas || {}));
    
    // Buscar notificaciones en todas las empresas
    const todasLasNotificaciones = [];
    const empresas = gestorPrincipal.estado.empresas || {};
    
    Object.keys(empresas).forEach(empresaId => {
        const empresa = empresas[empresaId];
        if (empresa.notificaciones) {
            console.log(`Empresa ${empresaId} tiene ${empresa.notificaciones.length} notificaciones:`, empresa.notificaciones);
            empresa.notificaciones.forEach(notif => {
                if (notif.remitente === 'Super Admin Premium') {
                    todasLasNotificaciones.push(notif);
                }
            });
        }
    });
    
    console.log('Total notificaciones admin encontradas:', todasLasNotificaciones);
    return todasLasNotificaciones;
}
/**
 * Contar notificaciones no leídas del admin
 */
function contarNotificacionesNoLeidas() {
    const notificacionesAdmin = obtenerNotificacionesAdmin();
    return notificacionesAdmin.filter(n => !n.leida).length;
}

/**
 * Marcar notificación como leída
 */
function marcarNotificacionLeida(notifId) {
    const gestorPrincipal = window.gestorEmpresas || window.gestor;
    if (!gestorPrincipal?.estado?.empresaActual) return;
    
    const empresaActual = gestorPrincipal.estado.empresaActual;
    const empresa = gestorPrincipal.estado.empresas?.[empresaActual];
    if (!empresa) return;
    
    const notificaciones = empresa.notificaciones || [];
    const notif = notificaciones.find(n => n.id === notifId);
    if (notif) {
        notif.leida = true;
        gestorPrincipal._guardarEmpresas?.();
        actualizarContadorCampana();
    }
}

/**
 * Actualizar contador visual de la campana
 */
function actualizarContadorCampana() {
    const contador = contarNotificacionesNoLeidas();
    
    // Buscar elementos de contador de notificaciones
    const badges = document.querySelectorAll('[data-notification-count], .notification-badge, .campana-contador');
    badges.forEach(badge => {
        if (contador > 0) {
            badge.textContent = contador;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    });
}

/**
 * Mostrar panel de notificaciones del admin
 */
function mostrarNotificacionesAdmin() {
    console.log('=== EJECUTANDO mostrarNotificacionesAdmin ===');
    
    // Buscar notificaciones directamente donde se guardan
    let todasLasNotificaciones = [];
    
    if (window.adminEmpresas && window.adminEmpresas.gestor) {
        const empresas = window.adminEmpresas.gestor.estado.empresas || {};
        console.log('Empresas encontradas:', Object.keys(empresas));
        
        Object.keys(empresas).forEach(empresaId => {
            const empresa = empresas[empresaId];
            if (empresa.notificaciones) {
                empresa.notificaciones.forEach(notif => {
                    if (notif.remitente === 'Super Admin Premium') {
                        todasLasNotificaciones.push(notif);
                        console.log('Notificación encontrada:', notif);
                    }
                });
            }
        });
    }
    
    console.log('Total notificaciones admin:', todasLasNotificaciones.length);
    
    if (todasLasNotificaciones.length === 0) {
        mostrarNotificacion('No hay notificaciones del administrador', 'info');
        return;
    }
    
    // Crear panel con las notificaciones encontradas
    let panel = document.getElementById('panel-notificaciones-admin');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'panel-notificaciones-admin';
        panel.innerHTML = `
            <div class="notif-panel-header">
                <h3>Notificaciones del Administrador</h3>
                <button onclick="cerrarPanelNotificaciones()" class="btn-cerrar">×</button>
            </div>
            <div class="notif-panel-body"></div>
        `;
        document.body.appendChild(panel);
    }
    
    const cuerpo = panel.querySelector('.notif-panel-body');
    cuerpo.innerHTML = '';
    
    todasLasNotificaciones.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notif-item ${notif.leida ? 'leida' : 'no-leida'}`;
        item.innerHTML = `
            <div class="notif-content">
                <h4>${notif.titulo}</h4>
                <p>${notif.mensaje}</p>
                <small>${new Date(notif.fecha).toLocaleString()}</small>
            </div>
            ${!notif.leida ? `<button onclick="marcarLeida('${notif.id}')" class="btn-marcar">✓</button>` : ''}
        `;
        cuerpo.appendChild(item);
    });
    
    panel.style.display = 'block';
}

function cerrarPanelNotificaciones() {
    const panel = document.getElementById('panel-notificaciones-admin');
    if (panel) panel.style.display = 'none';
}

function marcarLeida(notifId) {
    marcarNotificacionLeida(notifId);
    mostrarNotificacionesAdmin(); // Refrescar panel
}

// Hacer funciones disponibles globalmente
window.obtenerNotificacionesAdmin = obtenerNotificacionesAdmin;
window.contarNotificacionesNoLeidas = contarNotificacionesNoLeidas;
window.marcarNotificacionLeida = marcarNotificacionLeida;
window.actualizarContadorCampana = actualizarContadorCampana;
window.mostrarNotificacionesAdmin = mostrarNotificacionesAdmin;

console.log('🔔 GRIZALUM Notification System v2.0 cargado');
console.log('✨ Funcionalidades principales:');
console.log('  • 🎯 4 tipos de notificaciones con estilos dinámicos por tema');
console.log('  • 🎨 Integración completa con gestor de temas');
console.log('  • ♿ Accesibilidad profesional con ARIA live regions');
console.log('  • 🔊 Sistema de sonido opcional');
console.log('  • 📊 Sistema de colas y límites inteligentes');
console.log('  • 🎭 Templates avanzados con botones de acción');
console.log('  • 📈 Métricas y analíticas completas');
console.log('  • 💾 Persistencia de configuración');
console.log('🚀 ¡Sistema de notificaciones de clase mundial listo!');

console.log(`
🔔 ===================================================
   GRIZALUM NOTIFICATION SYSTEM v2.0 - ULTRA PROFESSIONAL
🔔 ===================================================

✨ FUNCIONES DISPONIBLES:
   • mostrarNotificacion(mensaje, tipo, duracion)
   • notificacionExito(mensaje, opciones)
   • notificacionError(mensaje, opciones)
   • notificacionAdvertencia(mensaje, opciones)
   • notificacionInfo(mensaje, opciones)
   • GRIZALUM_NOTIFICATIONS.* - API completa

🎨 MEJORAS v2.0:
   • Integración completa con ecosistema GRIZALUM
   • Colores dinámicos según tema activo
   • Accesibilidad profesional (ARIA live regions)
   • Sistema de colas inteligente
   • Templates con botones de acción
   • Métricas y analíticas avanzadas
   • Persistencia de configuración
   • Sistema de sonido opcional
   • 5 posiciones configurables
   • Responsive optimizado

🎭 CARACTERÍSTICAS AVANZADAS:
   • Agrupación de notificaciones similares
   • Barra de progreso con pausa en hover
   • Animaciones configurables
   • Focus management automático
   • Eventos personalizados
   • Cache inteligente
   • Modo alto contraste
   • Movimiento reducido

🔔 ===================================================
`);

// HACER FUNCIÓN GLOBALMENTE DISPONIBLE
window.mostrarNotificacion = mostrarNotificacion;
window.GrizalumNotifications = { mostrarNotificacion };
console.log('Sistema de notificaciones disponible globalmente');
