/**
 * ================================================================
 * GRIZALUM HEADER CONTROLLER - ULTRA PROFESSIONAL EDITION v2.0
 * Sistema de control ejecutivo de cabecera con gestión inteligente
 * Integrado con ecosistema completo GRIZALUM
 * ================================================================
 */

class ControladorCabeceraGRIZALUM {
    constructor() {
        this.version = '2.0.0';
        this.header = null;
        this.botonesPeriodo = [];
        this.botonNotificaciones = null;
        this.botonIA = null;
        this.selectorEmpresa = null;
        this.utilidades = null;
        this.gestorTemas = null;
        this.cache = new Map();
        this.inicializado = false;
        
        // Estados del header
        this.periodoActual = 'hoy';
        this.notificacionesAbiertas = false;
        this.centroNotificacionesVisible = false;
        this.contadorNotificaciones = 3;
        this.estadoCarga = false;
        
        // Configuración avanzada
        this.configuracion = {
            periodos: [
                { id: 'hoy', nombre: 'Hoy', activo: true, multiplicador: 0.1 },
                { id: 'semana', nombre: 'Semana', activo: false, multiplicador: 0.7 },
                { id: 'mes', nombre: 'Mes', activo: false, multiplicador: 1.0 },
                { id: 'trimestre', nombre: 'Trimestre', activo: false, multiplicador: 3.2 },
                { id: 'año', nombre: 'Año', activo: false, multiplicador: 12.5 }
            ],
            notificaciones: {
                habilitadas: true,
                maxVisibles: 10,
                autoClose: 5000,
                posicion: 'top-right'
            },
            ia: {
                habilitada: true,
                modoDemo: true
            },
            animacion: {
                duracion: 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            persistencia: {
                recordarPeriodo: true,
                recordarNotificaciones: true,
                cacheKey: 'grizalum_header_state'
            },
            teclasAtajo: {
                habilitadas: true,
                notificaciones: 'n',
                ia: 'i',
                periodos: ['1', '2', '3', '4', '5']
            }
        };
        
        this.log('🚀 Inicializando GRIZALUM Header Controller v2.0...');
    }

    // ======= INICIALIZACIÓN AVANZADA =======
    
    /**
     * Inicializar el controlador del header
     */
    inicializar() {
        try {
            this.log('🏗️ Inicializando controlador del header...', 'info');
            
            // Detectar dependencias
            this.detectarDependencias();
            
            // Cargar configuración global
            this.cargarConfiguracionGlobal();
            
            // Mapear elementos del DOM
            this.mapearElementosDOM();
            
            // Cargar estado persistente
            this.cargarEstadoPersistente();
            
            // Configurar componentes
            this.configurarBotonesPeriodo();
            this.configurarCentroNotificaciones();
            this.configurarBotonIA();
            this.configurarSelectorEmpresa();
            
            // Configurar eventos
            this.configurarEventosGlobales();
            this.configurarEventosIntegracion();
            
            // Configurar accesibilidad
            this.configurarAccesibilidad();
            
            // Aplicar estilos dinámicos
            
            this.inicializado = true;
            this.log('✅ Controlador del header inicializado correctamente', 'success');
            
            // Disparar evento de inicialización
            this.dispararEvento('headerInicializado', {
                version: this.version,
                elementos: this.obtenerEstadoElementos(),
                configuracion: this.configuracion
            });
            
        } catch (error) {
            this.log(`❌ Error inicializando header: ${error.message}`, 'error');
            this.mostrarNotificacion('Error inicializando header', 'error');
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
        
        // Fusionar configuración del header
        if (config.header) {
            this.configuracion = this.fusionarConfiguracion(this.configuracion, config.header);
        }
        
        // Aplicar configuración de animaciones globales
        if (config.animation) {
            this.configuracion.animacion = {
                ...this.configuracion.animacion,
                duracion: config.animation.duration || this.configuracion.animacion.duracion,
                easing: config.animation.easing || this.configuracion.animacion.easing
            };
        }
        
        this.log('⚙️ Configuración global del header cargada', 'info');
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
            this.utilidades.log(`[Header] ${mensaje}`, tipo);
        } else {
            const timestamp = new Date().toLocaleTimeString('es-PE');
            const prefijo = `[GRIZALUM-Header ${timestamp}]`;
            
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

    mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
        if (this.utilidades) {
            this.utilidades.mostrarNotificacion(mensaje, tipo, duracion);
        } else {
            console.log(`${tipo.toUpperCase()}: ${mensaje}`);
        }
    }

    // ======= MAPEO DEL DOM =======
    
    mapearElementosDOM() {
        try {
            // Header principal
            this.header = document.querySelector('.executive-header') || 
                         document.querySelector('.header-section') ||
                         document.querySelector('header');
            
            if (!this.header) {
                throw new Error('Header ejecutivo no encontrado en el DOM');
            }

            // Botones de período
            this.botonesPeriodo = Array.from(document.querySelectorAll('.period-btn'));
            this.log(`📅 Botones de período encontrados: ${this.botonesPeriodo.length}`, 'info');

            // Botón de notificaciones
            this.botonNotificaciones = document.querySelector('.notification-center');
            if (this.botonNotificaciones) {
                this.log('🔔 Botón de notificaciones encontrado', 'info');
                this.cache.set('botonNotificaciones', this.botonNotificaciones);
            }

            // Botón IA Assistant
            this.botonIA = document.querySelector('.ai-header-button') ||
                          document.querySelector('.ai-toggle-button');
            if (this.botonIA) {
                this.log('🤖 Botón IA Assistant encontrado', 'info');
                this.cache.set('botonIA', this.botonIA);
            }

            // Selector de empresas
            this.selectorEmpresa = document.getElementById('companySelector');
            if (this.selectorEmpresa) {
                this.log('🏢 Selector de empresas encontrado', 'info');
                this.cache.set('selectorEmpresa', this.selectorEmpresa);
            }
            
            // Cachear otros elementos importantes
            this.cache.set('header', this.header);
            this.cache.set('notificationBadge', this.botonNotificaciones?.querySelector('.notification-badge'));
            
            this.log('📍 Elementos del DOM mapeados correctamente', 'info');
            
        } catch (error) {
            this.log(`❌ Error mapeando elementos DOM: ${error.message}`, 'error');
            throw error;
        }
    }

    // ======= PERSISTENCIA DE ESTADO =======
    
    cargarEstadoPersistente() {
        if (!this.configuracion.persistencia.recordarPeriodo) return;
        
        let estadoGuardado = null;
        
        if (this.utilidades) {
            estadoGuardado = this.utilidades.cargarDeStorage(this.configuracion.persistencia.cacheKey);
        } else {
            try {
                const guardado = localStorage.getItem(this.configuracion.persistencia.cacheKey);
                estadoGuardado = guardado ? JSON.parse(guardado) : null;
            } catch (error) {
                this.log(`Error cargando estado persistente: ${error.message}`, 'warn');
            }
        }
        
        if (estadoGuardado) {
            this.periodoActual = estadoGuardado.periodoActual || 'hoy';
            this.contadorNotificaciones = estadoGuardado.contadorNotificaciones || 3;
            
            this.log('📂 Estado persistente del header cargado', 'info');
        }
    }

    guardarEstadoPersistente() {
        if (!this.configuracion.persistencia.recordarPeriodo) return;
        
        const estado = {
            periodoActual: this.periodoActual,
            contadorNotificaciones: this.contadorNotificaciones,
            timestamp: Date.now(),
            version: this.version
        };
        
        if (this.utilidades) {
            this.utilidades.guardarEnStorage(this.configuracion.persistencia.cacheKey, estado);
        } else {
            try {
                localStorage.setItem(this.configuracion.persistencia.cacheKey, JSON.stringify(estado));
            } catch (error) {
                this.log(`Error guardando estado persistente: ${error.message}`, 'warn');
            }
        }
    }

    // ======= CONFIGURACIÓN DE COMPONENTES =======
    
    configurarBotonesPeriodo() {
        if (this.botonesPeriodo.length === 0) {
            this.log('⚠️ No se encontraron botones de período', 'warn');
            return;
        }

        this.botonesPeriodo.forEach((boton, index) => {
            // Agregar ID único si no lo tiene
            if (!boton.id) {
                boton.id = `grizalum-period-btn-${index}`;
            }

            // Configurar atributos de accesibilidad
            boton.setAttribute('role', 'tab');
            boton.setAttribute('tabindex', '0');
            
            // Obtener período del botón
            const periodo = this.extraerPeriodoDeBoton(boton);
            
            // Configurar tooltip
            boton.title = `Cambiar período a: ${periodo}`;
            boton.setAttribute('aria-label', `Cambiar período a ${periodo}`);

            // Configurar eventos
            boton.addEventListener('click', (evento) => {
                this.manejarCambioPeriodo(evento, boton);
            });
            
            // Soporte para teclado
            boton.addEventListener('keydown', (evento) => {
                if (evento.key === 'Enter' || evento.key === ' ') {
                    evento.preventDefault();
                    this.manejarCambioPeriodo(evento, boton);
                }
            });

            // Configurar estado inicial si coincide con período guardado
            if (periodo === this.periodoActual) {
                this.activarBotonPeriodo(boton);
            }
            
            // Cachear botón
            this.cache.set(`periodo_${periodo}`, boton);
        });

        this.log(`📅 ${this.botonesPeriodo.length} botones de período configurados`, 'success');
    }

    extraerPeriodoDeBoton(boton) {
        // Intentar múltiples fuentes para obtener el período
        return boton.dataset.periodo || 
               boton.getAttribute('data-period') ||
               boton.textContent.toLowerCase().trim();
    }

    configurarCentroNotificaciones() {
        if (!this.botonNotificaciones) {
            this.log('⚠️ Botón de notificaciones no encontrado', 'warn');
            return;
        }

        // Configurar accesibilidad
        this.botonNotificaciones.setAttribute('aria-label', 'Centro de notificaciones');
        this.botonNotificaciones.setAttribute('aria-expanded', 'false');
        this.botonNotificaciones.setAttribute('role', 'button');

        // Configurar evento click
        this.botonNotificaciones.addEventListener('click', (evento) => {
            evento.preventDefault();
            this.alternarCentroNotificaciones();
        });
        
        // Soporte para teclado
        this.botonNotificaciones.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                this.alternarCentroNotificaciones();
            }
        });

        // Actualizar contador inicial
        this.actualizarContadorNotificaciones(this.contadorNotificaciones);

        this.log('🔔 Centro de notificaciones configurado', 'success');
    }

    configurarBotonIA() {
        if (!this.botonIA) {
            this.log('⚠️ Botón IA Assistant no encontrado', 'warn');
            return;
        }

        // Configurar accesibilidad
        this.botonIA.setAttribute('aria-label', 'Abrir IA Assistant');
        this.botonIA.setAttribute('role', 'button');
        this.botonIA.title = 'Abrir IA Assistant';

        // Configurar evento click
        this.botonIA.addEventListener('click', (evento) => {
            evento.preventDefault();
            this.abrirIAAssistant();
        });
        
        // Soporte para teclado
        this.botonIA.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                this.abrirIAAssistant();
            }
        });

        this.log('🤖 Botón IA Assistant configurado', 'success');
    }

    configurarSelectorEmpresa() {
        if (!this.selectorEmpresa) {
            this.log('⚠️ Selector de empresas no encontrado', 'warn');
            return;
        }

        // El selector se maneja principalmente por company-manager.js
        // Aquí solo agregamos eventos de monitoreo
        this.selectorEmpresa.addEventListener('change', (evento) => {
            this.log(`🏢 Cambio de empresa detectado en header: ${evento.target.value}`, 'info');
        });

        this.log('🏢 Selector de empresas configurado', 'info');
    }

    // ======= EVENTOS =======
    
    configurarEventosGlobales() {
        // Responsive
        const manejarResize = this.utilidades?.debounce(() => {
            this.manejarCambioTamaño();
        }, 100) || (() => this.manejarCambioTamaño());
        
        window.addEventListener('resize', manejarResize);

        // Teclas de atajo
        if (this.configuracion.teclasAtajo.habilitadas) {
            document.addEventListener('keydown', (evento) => {
                this.manejarTeclasAtajo(evento);
            });
        }

        // Clic fuera para cerrar paneles
        document.addEventListener('click', (evento) => {
            this.manejarClickFuera(evento);
        });

        this.log('🎯 Eventos globales del header configurados', 'info');
    }

    configurarEventosIntegracion() {
        // Escuchar cuando se carguen datos de un período
        document.addEventListener('grizalumDatosPeriodoCargados', (evento) => {
            this.manejarDatosPeriodoCargados(evento.detail);
        });

        // Escuchar cambios de empresa
        document.addEventListener('grizalumCompanyChanged', (evento) => {
            this.manejarCambioEmpresa(evento.detail);
        });

        // Escuchar cambios de tema
        document.addEventListener('grizalumThemeChanged', (evento) => {
            this.aplicarEstilosDinamicos();
        });

        // Escuchar solicitudes de cambio de período desde otros módulos
        document.addEventListener('headerPeriodChangeRequest', (evento) => {
            if (evento.detail?.periodo) {
                this.cambiarPeriodoProgramaticamente(evento.detail.periodo);
            }
        });

        this.log('🔗 Eventos de integración configurados', 'info');
    }

    // ======= ACCESIBILIDAD =======
    
    configurarAccesibilidad() {
        if (!this.header) return;
        
        // Configurar header principal
        this.header.setAttribute('role', 'banner');
        this.header.setAttribute('aria-label', 'Cabecera ejecutiva');
        
        // Configurar región de controles
        const controlesContainer = this.header.querySelector('.header-controls') || this.header;
        controlesContainer.setAttribute('role', 'toolbar');
        controlesContainer.setAttribute('aria-label', 'Controles de período y notificaciones');
        
        this.log('♿ Accesibilidad del header configurada', 'info');
    }

    actualizarAriaEstados() {
        // Actualizar estado del botón de notificaciones
        if (this.botonNotificaciones) {
            this.botonNotificaciones.setAttribute('aria-expanded', 
                this.centroNotificacionesVisible.toString()
            );
        }
        
        // Actualizar estados de botones de período
        this.botonesPeriodo.forEach(boton => {
            const esActivo = boton.classList.contains('active');
            boton.setAttribute('aria-selected', esActivo.toString());
            boton.setAttribute('tabindex', esActivo ? '0' : '-1');
        });
    }

    // ======= FUNCIONALIDAD PRINCIPAL =======
    
    manejarCambioPeriodo(evento, botonClickeado) {
        if (!botonClickeado) {
            this.log('❌ Botón de período inválido', 'error');
            return false;
        }
        
        evento?.preventDefault();
        
        const nuevoPeriodo = this.extraerPeriodoDeBoton(botonClickeado);
        
        // Validar período
        if (!this.esPeriodoValido(nuevoPeriodo)) {
            this.log(`❌ Período inválido: ${nuevoPeriodo}`, 'error');
            this.mostrarNotificacion('Período inválido', 'error');
            return false;
        }
        
        // No hacer nada si ya está activo
        if (nuevoPeriodo === this.periodoActual) {
            this.log(`📅 Período ${nuevoPeriodo} ya está activo`, 'info');
            return true;
        }

        const periodoAnterior = this.periodoActual;
        
        try {
            // Actualizar estado visual
            this.actualizarEstadoVisualPeriodo(botonClickeado);
            
            // Actualizar período actual
            this.periodoActual = nuevoPeriodo;
            
            // Guardar estado
            this.guardarEstadoPersistente();
            
            this.log(`📅 Período cambiado: ${periodoAnterior} → ${nuevoPeriodo}`, 'success');

            // Disparar evento personalizado
            this.dispararEvento('grizalumPeriodoCambiado', {
                periodo: nuevoPeriodo,
                periodoAnterior: periodoAnterior,
                timestamp: Date.now(),
                boton: botonClickeado
            });

            // Mostrar notificación
            const nombrePeriodo = this.obtenerNombrePeriodo(nuevoPeriodo);
            this.mostrarNotificacion(`📅 Período: ${nombrePeriodo}`, 'success', 2000);

            // Simular carga de datos
            this.simularCargaDatos(nuevoPeriodo);
            
            return true;
            
        } catch (error) {
            this.log(`❌ Error cambiando período: ${error.message}`, 'error');
            this.mostrarNotificacion('Error cambiando período', 'error');
            return false;
        }
    }

    esPeriodoValido(periodo) {
        return this.configuracion.periodos.some(p => p.id === periodo);
    }

    obtenerNombrePeriodo(periodo) {
        const configPeriodo = this.configuracion.periodos.find(p => p.id === periodo);
        return configPeriodo?.nombre || this.utilidades?.capitalizar(periodo) || periodo;
    }

    actualizarEstadoVisualPeriodo(botonActivo) {
        // Remover clase active de todos los botones
        this.botonesPeriodo.forEach(boton => {
            boton.classList.remove('active');
        });

        // Agregar clase active al botón clickeado
        botonActivo.classList.add('active');
        
        // Actualizar estados ARIA
        this.actualizarAriaEstados();
    }

    activarBotonPeriodo(boton) {
        this.actualizarEstadoVisualPeriodo(boton);
    }

    cambiarPeriodoProgramaticamente(periodo) {
        const boton = this.cache.get(`periodo_${periodo}`) || 
                     this.botonesPeriodo.find(btn => this.extraerPeriodoDeBoton(btn) === periodo);
        
        if (boton) {
            return this.manejarCambioPeriodo(null, boton);
        } else {
            this.log(`❌ No se encontró botón para período: ${periodo}`, 'error');
            return false;
        }
    }

    // ======= CENTRO DE NOTIFICACIONES =======
    
    alternarCentroNotificaciones() {
        this.centroNotificacionesVisible = !this.centroNotificacionesVisible;
        
        if (this.centroNotificacionesVisible) {
            this.mostrarCentroNotificaciones();
        } else {
            this.ocultarCentroNotificaciones();
        }
        
        return this.centroNotificacionesVisible;
    }

    mostrarCentroNotificaciones() {
        this.log('🔔 Abriendo centro de notificaciones...', 'info');
        
        try {
            // Crear panel si no existe
            let panel = document.getElementById('grizalum-notifications-panel');
            if (!panel) {
                panel = this.crearPanelNotificaciones();
            }

            // Mostrar panel con animación
            panel.style.display = 'block';
            setTimeout(() => {
                panel.classList.add('show');
            }, 10);

            // Marcar botón como activo
            this.botonNotificaciones?.classList.add('active');

            // Actualizar estados ARIA
            this.actualizarAriaEstados();

            // Enfocar panel para accesibilidad
            setTimeout(() => {
                const primerElemento = panel.querySelector('button, [tabindex="0"]');
                if (primerElemento) {
                    primerElemento.focus();
                }
            }, this.configuracion.animacion.duracion);

            // Limpiar contador de notificaciones
            this.actualizarContadorNotificaciones(0);

            this.centroNotificacionesVisible = true;
            
            this.dispararEvento('notificacionesCentroAbierto', {
                timestamp: Date.now()
            });
            
        } catch (error) {
            this.log(`❌ Error mostrando centro de notificaciones: ${error.message}`, 'error');
            this.mostrarNotificacion('Error abriendo notificaciones', 'error');
        }
    }

    ocultarCentroNotificaciones() {
        const panel = document.getElementById('grizalum-notifications-panel');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => {
                panel.style.display = 'none';
            }, this.configuracion.animacion.duracion);
        }

        // Desmarcar botón como activo
        this.botonNotificaciones?.classList.remove('active');
        
        // Actualizar estados ARIA
        this.actualizarAriaEstados();

        this.centroNotificacionesVisible = false;
        
        this.log('🔔 Centro de notificaciones cerrado', 'info');
        
        this.dispararEvento('notificacionesCentroCerrado', {
            timestamp: Date.now()
        });
    }

    crearPanelNotificaciones() {
        const panel = this.utilidades?.crearElemento('div', {
            id: 'grizalum-notifications-panel',
            className: 'grizalum-notifications-panel',
            role: 'dialog',
            'aria-label': 'Centro de notificaciones',
            'aria-modal': 'false'
        }) || this.crearPanelManual();
        
        panel.innerHTML = this.generarContenidoNotificaciones();
        
        // Posicionar cerca del botón
        this.posicionarPanel(panel);
        
        // Configurar eventos del panel
        this.configurarEventosPanel(panel);
        
        document.body.appendChild(panel);
        
        this.log('🏗️ Panel de notificaciones creado', 'info');
        return panel;
    }

    crearPanelManual() {
        const panel = document.createElement('div');
        panel.id = 'grizalum-notifications-panel';
        panel.className = 'grizalum-notifications-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Centro de notificaciones');
        return panel;
    }

    generarContenidoNotificaciones() {
        const notificaciones = this.obtenerNotificacionesEjemplo();
        
        return `
            <div class="notifications-header">
                <h3>🔔 Centro de Notificaciones</h3>
                <button class="notifications-close" aria-label="Cerrar notificaciones" tabindex="0">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notifications-content">
                ${notificaciones.map(notif => `
                    <div class="notification-item" role="listitem">
                        <div class="notification-icon ${notif.tipo}">
                            <i class="${notif.icono}"></i>
                        </div>
                        <div class="notification-details">
                            <div class="notification-title">${notif.titulo}</div>
                            <div class="notification-time">${notif.tiempo}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="notifications-footer">
                <button class="btn-view-all" tabindex="0">Ver todas las notificaciones</button>
            </div>
        `;
    }

    obtenerNotificacionesEjemplo() {
        return [
            {
                tipo: 'success',
                icono: 'fas fa-check-circle',
                titulo: 'Sistema actualizado',
                tiempo: 'Hace 2 minutos'
            },
            {
                tipo: 'info',
                icono: 'fas fa-info-circle',
                titulo: 'Nuevo reporte disponible',
                tiempo: 'Hace 1 hora'
            },
            {
                tipo: 'warning',
                icono: 'fas fa-exclamation-triangle',
                titulo: 'Revisar gastos del mes',
                tiempo: 'Hace 3 horas'
            }
        ];
    }

    posicionarPanel(panel) {
        if (!this.botonNotificaciones) return;
        
        const rect = this.botonNotificaciones.getBoundingClientRect();
        
        Object.assign(panel.style, {
            position: 'fixed',
            top: `${rect.bottom + 10}px`,
            right: '20px',
            zIndex: '999999',
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: `all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing}`,
            display: 'none'
        });
    }

    configurarEventosPanel(panel) {
        // Botón cerrar
        const botonCerrar = panel.querySelector('.notifications-close');
        if (botonCerrar) {
            botonCerrar.addEventListener('click', () => {
                this.ocultarCentroNotificaciones();
            });
        }
        
        // Botón ver todas
        const botonVerTodas = panel.querySelector('.btn-view-all');
        if (botonVerTodas) {
            botonVerTodas.addEventListener('click', () => {
                this.mostrarNotificacion('Función próximamente disponible', 'info');
            });
        }
        
        // Tecla Escape para cerrar
        panel.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape') {
                this.ocultarCentroNotificaciones();
            }
        });
    }

    actualizarContadorNotificaciones(cantidad) {
        const badge = this.cache.get('notificationBadge') || 
                     this.botonNotificaciones?.querySelector('.notification-badge');
        
        if (!badge) {
            this.log('⚠️ Badge de notificaciones no encontrado', 'warn');
            return false;
        }

        this.contadorNotificaciones = Math.max(0, cantidad);

        if (this.contadorNotificaciones > 0) {
            badge.textContent = this.contadorNotificaciones > 99 ? '99+' : this.contadorNotificaciones;
            badge.style.display = 'block';
            badge.setAttribute('aria-label', `${this.contadorNotificaciones} notificaciones nuevas`);
        } else {
            badge.style.display = 'none';
            badge.removeAttribute('aria-label');
        }

        // Guardar estado
        this.guardarEstadoPersistente();

        this.log(`🔔 Contador de notificaciones actualizado: ${this.contadorNotificaciones}`, 'info');
        return true;
    }

    // ======= IA ASSISTANT =======
    
    abrirIAAssistant() {
    this.log('🧠 Abriendo IA Assistant...', 'info');
    
    try {
        // Marcar botón como activo temporalmente
        this.botonIA?.classList.add('active');
        
        setTimeout(() => {
            this.botonIA?.classList.remove('active');
        }, 1000);
        
        // Disparar evento personalizado
        this.dispararEvento('grizalumIAAssistantSolicitado', {
            timestamp: Date.now(),
            origen: 'header'
        });
        
        // ABRIR EL ASISTENTE IA REAL en lugar de mostrar notificación
        if (window.advancedAI) {
            window.advancedAI.toggle();
            this.log('✅ IA Assistant abierto exitosamente', 'success');
        } else {
            this.log('⚠️ IA Assistant no disponible aún', 'warning');
        }
        
        return true;
        
    } catch (error) {
        this.log('❌ Error abriendo IA Assistant: ${error.message}', 'error');
        return false;
    }
}

    // ======= SIMULACIÓN DE DATOS =======
    
    simularCargaDatos(periodo) {
        if (!this.esPeriodoValido(periodo)) {
            this.log(`❌ No se pueden cargar datos para período inválido: ${periodo}`, 'error');
            return false;
        }
        
        this.log(`📊 Iniciando carga de datos para período: ${periodo}`, 'info');
        
        // Mostrar indicador de carga
        this.mostrarIndicadorCarga();

        // Simular tiempo de carga realista
        const tiempoCarga = 800 + Math.random() * 700; // 800-1500ms
        
        setTimeout(() => {
            try {
                this.ocultarIndicadorCarga();
                
                const datos = this.generarDatosSimulados(periodo);
                
                // Disparar evento de datos cargados
                this.dispararEvento('grizalumDatosPeriodoCargados', {
                    periodo: periodo,
                    timestamp: Date.now(),
                    datos: datos,
                    tiempoCarga: tiempoCarga
                });

                this.log(`📊 Datos del período ${periodo} cargados exitosamente`, 'success');
                
            } catch (error) {
                this.ocultarIndicadorCarga();
                this.log(`❌ Error en simulación de datos: ${error.message}`, 'error');
                this.mostrarNotificacion('Error cargando datos', 'error');
            }
        }, tiempoCarga);
        
        return true;
    }

    generarDatosSimulados(periodo) {
        const configPeriodo = this.configuracion.periodos.find(p => p.id === periodo);
        const multiplicador = configPeriodo?.multiplicador || 1.0;
        
        // Datos base más realistas
        const datosBase = {
            revenue: 2847293,
            expenses: 287000,
            profit: 165000,
            growth: 24.8,
            cashFlow: 245000
        };
        
        // Aplicar multiplicador con algo de variación
        const variacion = 0.85 + Math.random() * 0.3; // ±15% de variación
        
        return {
            revenue: Math.round(datosBase.revenue * multiplicador * variacion),
            expenses: Math.round(datosBase.expenses * multiplicador * variacion),
            profit: Math.round(datosBase.profit * multiplicador * variacion),
            growth: `+${(datosBase.growth * multiplicador * variacion).toFixed(1)}%`,
            cashFlow: Math.round(datosBase.cashFlow * multiplicador * variacion),
            periodo: periodo,
            timestamp: Date.now()
        };
    }

    mostrarIndicadorCarga() {
        if (!this.header) return;
        
        this.estadoCarga = true;
        this.header.classList.add('loading');
        
        // Deshabilitar botones temporalmente
        this.botonesPeriodo.forEach(boton => {
            boton.disabled = true;
            boton.setAttribute('aria-disabled', 'true');
        });
        
        this.log('⏳ Indicador de carga activado', 'info');
    }

    ocultarIndicadorCarga() {
        if (!this.header) return;
        
        this.estadoCarga = false;
        this.header.classList.remove('loading');
        
        // Habilitar botones
        this.botonesPeriodo.forEach(boton => {
            boton.disabled = false;
            boton.removeAttribute('aria-disabled');
        });
        
        this.log('✅ Indicador de carga desactivado', 'info');
    }

    // ======= MANEJO DE EVENTOS =======
    
    manejarTeclasAtajo(evento) {
        if (!evento.altKey) return; // Solo teclas Alt+
        
        const tecla = evento.key.toLowerCase();
        
        // Alt + N = Notificaciones
        if (tecla === this.configuracion.teclasAtajo.notificaciones) {
            evento.preventDefault();
            this.alternarCentroNotificaciones();
            return;
        }

        // Alt + I = IA Assistant
        if (tecla === this.configuracion.teclasAtajo.ia) {
            evento.preventDefault();
            this.abrirIAAssistant();
            return;
        }

        // Alt + 1-5 = Períodos
        const indicePeriodo = this.configuracion.teclasAtajo.periodos.indexOf(tecla);
        if (indicePeriodo !== -1 && this.botonesPeriodo[indicePeriodo]) {
            evento.preventDefault();
            this.manejarCambioPeriodo(evento, this.botonesPeriodo[indicePeriodo]);
            return;
        }
    }

    manejarClickFuera(evento) {
        // Cerrar panel de notificaciones si está abierto
        if (this.centroNotificacionesVisible) {
            const panel = document.getElementById('grizalum-notifications-panel');
            const botonNotif = this.botonNotificaciones;
            
            if (panel && !panel.contains(evento.target) && 
                botonNotif && !botonNotif.contains(evento.target)) {
                this.ocultarCentroNotificaciones();
            }
        }
    }

    manejarCambioTamaño() {
        // Reposicionar panel de notificaciones si está abierto
        if (this.centroNotificacionesVisible) {
            const panel = document.getElementById('grizalum-notifications-panel');
            if (panel) {
                this.posicionarPanel(panel);
            }
        }
        
        this.log('📱 Cambio de tamaño manejado', 'info');
    }

    manejarDatosPeriodoCargados(detalle) {
        const { periodo, datos } = detalle;
        this.log(`📊 Header notificado de datos cargados para ${periodo}`, 'info');
        
        // Actualizar KPIs si la función está disponible
        if (window.actualizarKPIs && datos) {
            window.actualizarKPIs(datos);
        }
        
        if (window.GrizalumMetrics && datos) {
            window.GrizalumMetrics.updateMetrics(datos);
        }
    }

    manejarCambioEmpresa(detalle) {
        const { company } = detalle;
        this.log(`🏢 Header notificado del cambio de empresa: ${company?.name || 'Desconocida'}`, 'info');
        
        // Simular nueva carga de datos para la empresa
        setTimeout(() => {
            this.simularCargaDatos(this.periodoActual);
        }, 500);
    }

    // ======= ESTILOS DINÁMICOS =======
    
    aplicarEstilosDinamicos() {
        const idEstilo = 'grizalum-header-dynamic-styles';
        let estiloExistente = document.getElementById(idEstilo);
        
        if (estiloExistente) {
            estiloExistente.remove();
        }

        const estilo = document.createElement('style');
        estilo.id = idEstilo;
        estilo.textContent = this.generarCSSPersonalizado();
        
        document.head.appendChild(estilo);
        this.log('🎨 Estilos dinámicos del header aplicados', 'info');
    }

    generarCSSPersonalizado() {
        return `
            /* GRIZALUM Header Dynamic Styles v2.0 */
            /* BOTON NOTIFICACIONES DORADO */
.notification-center {
    background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%) !important;
    border: none !important;
    border-radius: 12px !important;
    width: 48px !important;
    height: 48px !important;
    color: white !important;
    font-size: 18px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.3s ease !important;
}

.notification-center:hover {
    background: linear-gradient(135deg, #e4c06a 0%, #d4af37 100%) !important;
    transform: translateY(-2px) scale(1.05) !important;
}

.notification-center i {
    color: white !important;
}
            
            .grizalum-notifications-panel {
                background: linear-gradient(135deg, var(--theme-surface, #1e293b) 0%, var(--theme-elevated, #334155) 100%) !important;
                border: var(--theme-border-glow, 1px solid rgba(255,255,255,0.2)) !important;
                border-radius: 12px !important;
                box-shadow: var(--theme-shadow-elevated, 0 20px 60px rgba(0,0,0,0.3)) !important;
                backdrop-filter: blur(20px) !important;
                width: 350px !important;
                max-height: 500px !important;
                overflow: hidden !important;
                opacity: 0 !important;
                transform: translateY(-10px) !important;
                transition: all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing} !important;
                display: none !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            
            .grizalum-notifications-panel.show {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .notifications-header {
                padding: 15px 20px !important;
                border-bottom: 1px solid rgba(255,255,255,0.1) !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                background: var(--theme-gradient-glass, rgba(255,255,255,0.05)) !important;
            }
            
            .notifications-header h3 {
                margin: 0 !important;
                color: var(--theme-text-primary, white) !important;
                font-size: 16px !important;
                font-weight: 600 !important;
            }
            
            .notifications-close {
                background: none !important;
                border: none !important;
                color: var(--theme-text-muted, rgba(255,255,255,0.6)) !important;
                cursor: pointer !important;
                padding: 8px !important;
                border-radius: 50% !important;
                transition: all 0.2s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 32px !important;
                height: 32px !important;
            }
            
            .notifications-close:hover {
                background: rgba(255,255,255,0.1) !important;
                color: var(--theme-text-primary, white) !important;
                transform: scale(1.1) !important;
            }
            
            .notifications-content {
                max-height: 350px !important;
                overflow-y: auto !important;
                padding: 5px 0 !important;
            }
            
            .notification-item {
                padding: 15px 20px !important;
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                transition: all 0.2s ease !important;
                cursor: pointer !important;
            }
            
            .notification-item:hover {
                background: var(--theme-glass-effect, rgba(255,255,255,0.05)) !important;
                transform: translateX(5px) !important;
            }
            
            .notification-item:last-child {
                border-bottom: none !important;
            }
            
            .notification-icon {
                width: 36px !important;
                height: 36px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 16px !important;
                flex-shrink: 0 !important;
            }
            
            .notification-icon.success {
                background: var(--theme-success, #10b981) !important;
                color: white !important;
            }
            
            .notification-icon.info {
                background: var(--theme-info, #3b82f6) !important;
                color: white !important;
            }
            
            .notification-icon.warning {
                background: var(--theme-warning, #f59e0b) !important;
                color: white !important;
            }
            
            .notification-details {
                flex: 1 !important;
                min-width: 0 !important;
            }
            
            .notification-title {
                color: var(--theme-text-primary, white) !important;
                font-weight: 500 !important;
                margin-bottom: 4px !important;
                font-size: 14px !important;
                line-height: 1.3 !important;
            }
            
            .notification-time {
                color: var(--theme-text-muted, rgba(255,255,255,0.6)) !important;
                font-size: 12px !important;
                line-height: 1.2 !important;
            }
            
            .notifications-footer {
                padding: 15px 20px !important;
                border-top: 1px solid rgba(255,255,255,0.1) !important;
                text-align: center !important;
                background: var(--theme-gradient-glass, rgba(255,255,255,0.02)) !important;
            }
            
            .btn-view-all {
                background: var(--theme-glass-effect, rgba(59, 130, 246, 0.2)) !important;
                border: 1px solid var(--theme-primary, #3b82f6) !important;
                color: var(--theme-primary, #60a5fa) !important;
                padding: 10px 20px !important;
                border-radius: 8px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                width: 100% !important;
            }
            
            .btn-view-all:hover {
                background: var(--theme-primary, rgba(59, 130, 246, 0.3)) !important;
                transform: translateY(-1px) !important;
                box-shadow: var(--theme-shadow-soft, 0 4px 12px rgba(0,0,0,0.15)) !important;
            }
            
            /* Loading state para header */
            .executive-header.loading,
            .header-section.loading {
                position: relative !important;
            }
            
            .executive-header.loading::after,
            .header-section.loading::after {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 3px !important;
                background: var(--theme-gradient-primary, linear-gradient(90deg, transparent, #3b82f6, transparent)) !important;
                animation: grizalum-header-loading 1.5s infinite !important;
                z-index: 10 !important;
            }
            
            @keyframes grizalum-header-loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            /* Estilos para botones de período */
            .period-btn {
                transition: all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing} !important;
                position: relative !important;
                overflow: hidden !important;
            }
            
            .period-btn:disabled {
                opacity: 0.6 !important;
                cursor: not-allowed !important;
            }
            
            .period-btn:focus {
                outline: 2px solid var(--theme-primary, #3b82f6) !important;
                outline-offset: 2px !important;
            }
            
            .period-btn.active {
                box-shadow: var(--theme-shadow-glow, 0 0 20px rgba(59, 130, 246, 0.4)) !important;
            }
            
            /* Estilos para botones IA y notificaciones */
            .ai-header-button,
            .ai-toggle-button,
            .notification-center {
                transition: all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing} !important;
            }
            
            .ai-header-button:focus,
            .ai-toggle-button:focus,
            .notification-center:focus {
                outline: 2px solid var(--theme-primary, #3b82f6) !important;
                outline-offset: 2px !important;
            }
            
            .notification-center.active {
                box-shadow: var(--theme-shadow-glow, 0 0 20px rgba(59, 130, 246, 0.4)) !important;
            }
            
            /* Scrollbar personalizado para panel */
            .notifications-content::-webkit-scrollbar {
                width: 6px !important;
            }
            
            .notifications-content::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.1) !important;
            }
            
            .notifications-content::-webkit-scrollbar-thumb {
                background: var(--theme-primary, #3b82f6) !important;
                border-radius: 3px !important;
            }
            
            .notifications-content::-webkit-scrollbar-thumb:hover {
                background: var(--theme-secondary, #2563eb) !important;
            }
            
            /* Responsive para móviles */
            @media (max-width: 768px) {
                .grizalum-notifications-panel {
                    width: calc(100vw - 40px) !important;
                    max-width: 350px !important;
                    left: 20px !important;
                    right: 20px !important;
                }
            }
        `;
    }

    // ======= UTILIDADES =======
    
    dispararEvento(nombreEvento, detalle = {}) {
        const evento = new CustomEvent(nombreEvento, {
            detail: {
                ...detalle,
                headerVersion: this.version,
                inicializado: this.inicializado,
                timestamp: detalle.timestamp || Date.now()
            }
        });
        document.dispatchEvent(evento);
    }

    obtenerEstadoElementos() {
        return {
            header: !!this.header,
            botonesPeriodo: this.botonesPeriodo.length,
            notificaciones: !!this.botonNotificaciones,
            ia: !!this.botonIA,
            selectorEmpresa: !!this.selectorEmpresa
        };
    }

    // ======= API PÚBLICA =======
    
    obtenerEstado() {
        return {
            version: this.version,
            inicializado: this.inicializado,
            periodoActual: this.periodoActual,
            notificacionesAbiertas: this.centroNotificacionesVisible,
            contadorNotificaciones: this.contadorNotificaciones,
            estadoCarga: this.estadoCarga,
            elementos: this.obtenerEstadoElementos(),
            configuracion: { ...this.configuracion }
        };
    }

    obtenerAnalyticas() {
        return {
            version: this.version,
            periodosDisponibles: this.configuracion.periodos.length,
            periodoActual: this.periodoActual,
            cambiosPeriodo: this.contadorCambiosPeriodo || 0,
            notificacionesVistas: this.contadorNotificacionesVistas || 0,
            usoIA: this.contadorUsoIA || 0
        };
    }

    // Métodos públicos para control programático
    cambiarPeriodo(periodo) {
        return this.cambiarPeriodoProgramaticamente(periodo);
    }

    abrirNotificaciones() {
        if (!this.centroNotificacionesVisible) {
            return this.alternarCentroNotificaciones();
        }
        return true;
    }

    cerrarNotificaciones() {
        if (this.centroNotificacionesVisible) {
            return this.alternarCentroNotificaciones();
        }
        return true;
    }

    agregarNotificacion(cantidad = 1) {
        return this.actualizarContadorNotificaciones(this.contadorNotificaciones + cantidad);
    }
}

// ======= INSTANCIA GLOBAL =======
let controladorCabeceraGrizalum = null;

// ======= INICIALIZACIÓN AUTOMÁTICA =======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏗️ DOM listo - Inicializando GRIZALUM Header Controller v2.0...');
    
    try {
        // Esperar un poco para que otros elementos se carguen
        setTimeout(() => {
            controladorCabeceraGrizalum = new ControladorCabeceraGRIZALUM();
            controladorCabeceraGrizalum.inicializar();
            
            // Alias globales
            window.headerController = controladorCabeceraGrizalum;
            window.controladorHeader = controladorCabeceraGrizalum; // Compatibilidad
            
        }, 300);
        
    } catch (error) {
        console.error('❌ Error inicializando Header Controller:', error);
    }
});

// ======= FUNCIONES GLOBALES PARA COMPATIBILIDAD =======

/**
 * Función global para cambiar período (llamada desde HTML)
 */
function changePeriod(periodo, boton) {
    if (window.headerController) {
        return window.headerController.manejarCambioPeriodo({ preventDefault: () => {} }, boton);
    }
    return false;
}

/**
 * Función global para mostrar notificaciones (llamada desde HTML)
 */
function showNotifications() {
    return window.headerController?.alternarCentroNotificaciones() || false;
}

/**
 * Función global para IA Assistant (llamada desde HTML)
 */
function toggleAIAssistant() {
    // Conectar con el asistente IA real que ya funciona
    if (window.advancedAI) {
        window.advancedAI.toggle();
        return true;
    } else {
        mostrarNotificacion('IA Assistant listo para ayudarte', 'success');
        return false;
    }
}

// ======= API PÚBLICA DEL HEADER =======
window.GRIZALUM_HEADER = {
    version: '2.0.0',
    
    // Métodos principales
    cambiarPeriodo: (periodo) => window.headerController?.cambiarPeriodo(periodo),
    mostrarNotificaciones: () => window.headerController?.abrirNotificaciones(),
    ocultarNotificaciones: () => window.headerController?.cerrarNotificaciones(),
    abrirIA: () => window.headerController?.abrirIAAssistant(),
    
    // Gestión de notificaciones
    actualizarContador: (cantidad) => window.headerController?.actualizarContadorNotificaciones(cantidad),
    agregarNotificacion: (cantidad) => window.headerController?.agregarNotificacion(cantidad),
    
    // Estado y analíticas
    obtenerEstado: () => window.headerController?.obtenerEstado(),
    obtenerAnalyticas: () => window.headerController?.obtenerAnalyticas(),
    
    // Control de carga
    mostrarCarga: () => window.headerController?.mostrarIndicadorCarga(),
    ocultarCarga: () => window.headerController?.ocultarIndicadorCarga(),
    
    // Utilidades
    estaInicializado: () => window.headerController?.inicializado || false
};

// Hacer funciones disponibles globalmente para el HTML
window.changePeriod = changePeriod;
window.showNotifications = showNotifications;
window.toggleAIAssistant = toggleAIAssistant;

console.log('🏗️ GRIZALUM Header Controller v2.0 cargado');
console.log('✨ Funcionalidades principales:');
console.log('  • 📅 Sistema de períodos inteligente con persistencia');
console.log('  • 🔔 Centro de notificaciones con panel dinámico');
console.log('  • 🤖 Botón IA Assistant integrado');
console.log('  • ⌨️ Teclas de atajo profesionales (Alt+N, Alt+I, Alt+1-5)');
console.log('  • 🎨 Integración completa con sistema de temas');
console.log('  • ♿ Accesibilidad completa (ARIA)');
console.log('  • 📊 Simulación de datos realista');
console.log('  • 🚀 Cache inteligente y rendimiento optimizado');
console.log('🚀 ¡Sistema de header de clase mundial listo!');

console.log(`
🏗️ ===================================================
   GRIZALUM HEADER CONTROLLER v2.0 - ULTRA PROFESSIONAL
🏗️ ===================================================

✨ FUNCIONES DISPONIBLES:
   • changePeriod(periodo, boton) - Cambiar período de tiempo
   • showNotifications() - Mostrar centro de notificaciones
   • toggleAIAssistant() - Abrir IA Assistant
   • GRIZALUM_HEADER.* - API completa del header

📅 PERÍODOS INTELIGENTES:
   • Hoy, Semana, Mes, Trimestre, Año
   • Persistencia de estado automática
   • Simulación realista de datos
   • Atajos de teclado: Alt + 1-5

🔔 CENTRO DE NOTIFICACIONES v2.0:
   • Panel deslizable con animaciones suaves
   • Contador dinámico persistente
   • Accesibilidad completa
   • Atajo de teclado: Alt + N

🤖 IA ASSISTANT PREPARADO:
   • Integración futura lista
   • Eventos personalizados
   • Atajo de teclado: Alt + I

🏗️ MEJORAS v2.0:
   • Integración con ecosistema GRIZALUM completo
   • Cache inteligente de elementos DOM
   • Persistencia de estado avanzada
   • Accesibilidad profesional (ARIA)
   • Configuración global centralizada
   • Manejo de errores robusto
   • Estilos dinámicos por tema
   • Validaciones exhaustivas

🏗️ ===================================================
`);
