/**
 * ================================================================
 * GRIZALUM SIDEBAR MANAGER - ULTRA PROFESSIONAL EDITION v2.0
 * Sistema de navegación lateral dinámico e inteligente
 * Integrado con sistema de temas y utilidades GRIZALUM
 * ================================================================
 */

class ManejadorSidebarGRIZALUM {
    constructor() {
        this.version = '2.0.0';
        this.sidebar = null;
        this.enlaces = [];
        this.seccionActual = 'dashboard';
        this.sidebarAbierto = false;
        this.utilidades = null;
        this.gestorTemas = null;
        this.cache = new Map();
        this.inicializado = false;
        
        // Datos financieros del sidebar
        this.datosFinancieros = {
            cashFlow: 24500,
            profit: 16500,
            ultimaActualizacion: Date.now()
        };
        
        // Configuración
        this.configuracion = {
            animacion: {
                duracion: 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            responsivo: {
                breakpointMovil: 768,
                autoClose: true
            },
            persistencia: {
                recordarEstado: true,
                cacheKey: 'grizalum_sidebar_state'
            }
        };
        
        this.log('🚀 Inicializando GRIZALUM Sidebar Manager v2.0...');
    }

    // ======= INICIALIZACIÓN AVANZADA =======
    
    /**
     * Inicializar el controlador del sidebar
     */
    inicializar() {
        try {
            this.log('📱 Inicializando controlador del sidebar...', 'info');
            
            // Detectar dependencias
            this.detectarDependencias();
            
            // Cargar configuración global
            this.cargarConfiguracionGlobal();
            
            // Encontrar elementos del DOM
            this.mapearElementosDOM();
            
            // Cargar estado persistente
            this.cargarEstadoPersistente();
            
            // Configurar eventos
            this.configurarEventos();
            
            // Configurar accesibilidad
            this.configurarAccesibilidad();
            
            // Configurar responsivo
            this.configurarResponsive();
            
            // Aplicar estilos dinámicos
            this.aplicarEstilosDinamicos();
            
            this.inicializado = true;
            this.log('✅ Sidebar inicializado correctamente', 'success');
            this.log(`📊 Enlaces encontrados: ${this.enlaces.length}`, 'info');
            
            // Disparar evento de inicialización
            this.dispararEvento('sidebarInicializado', {
                version: this.version,
                enlaces: this.enlaces.length,
                seccionActual: this.seccionActual
            });
            
        } catch (error) {
            this.log(`❌ Error inicializando sidebar: ${error.message}`, 'error');
            this.mostrarNotificacion('Error inicializando sidebar', 'error');
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
        
        // Fusionar configuración
        if (config.sidebar) {
            this.configuracion = {
                ...this.configuracion,
                ...config.sidebar
            };
        }
        
        if (config.animation) {
            this.configuracion.animacion = {
                ...this.configuracion.animacion,
                duracion: config.animation.duration || this.configuracion.animacion.duracion,
                easing: config.animation.easing || this.configuracion.animacion.easing
            };
        }
        
        this.log('⚙️ Configuración global del sidebar cargada', 'info');
    }

    log(mensaje, tipo = 'info') {
        if (this.utilidades) {
            this.utilidades.log(`[Sidebar] ${mensaje}`, tipo);
        } else {
            const timestamp = new Date().toLocaleTimeString('es-PE');
            const prefijo = `[GRIZALUM-Sidebar ${timestamp}]`;
            
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
        // Encontrar el sidebar en el DOM
        this.sidebar = document.getElementById('sidebar');
        if (!this.sidebar) {
            this.log('❌ No se encontró el sidebar en el DOM', 'error');
            throw new Error('Sidebar no encontrado en el DOM');
        }

        // Encontrar todos los enlaces de navegación
        this.enlaces = Array.from(document.querySelectorAll('.nav-link'));
        
        // Cachear elementos importantes
        this.cache.set('botonToggle', document.querySelector('.mobile-menu-toggle'));
        this.cache.set('elementoCashFlow', document.getElementById('sidebarCashFlow'));
        this.cache.set('elementoProfit', document.getElementById('sidebarProfit'));
        
        this.log(`📍 Elementos del DOM mapeados correctamente`, 'info');
    }

    // ======= PERSISTENCIA DE ESTADO =======
    
    cargarEstadoPersistente() {
        if (!this.configuracion.persistencia.recordarEstado) return;
        
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
            this.seccionActual = estadoGuardado.seccionActual || 'dashboard';
            // No restaurar estado abierto en móviles
            if (window.innerWidth > this.configuracion.responsivo.breakpointMovil) {
                this.sidebarAbierto = estadoGuardado.sidebarAbierto || false;
            }
            
            this.log('📂 Estado persistente del sidebar cargado', 'info');
        }
    }

    guardarEstadoPersistente() {
        if (!this.configuracion.persistencia.recordarEstado) return;
        
        const estado = {
            seccionActual: this.seccionActual,
            sidebarAbierto: this.sidebarAbierto,
            timestamp: Date.now()
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

    // ======= EVENTOS AVANZADOS =======
    
    configurarEventos() {
        // Eventos para los enlaces de navegación
        this.enlaces.forEach((enlace, index) => {
            enlace.addEventListener('click', (evento) => {
                this.manejarClickEnlace(evento, enlace);
            });
            
            // Mejorar accesibilidad con teclado
            enlace.addEventListener('keydown', (evento) => {
                if (evento.key === 'Enter' || evento.key === ' ') {
                    evento.preventDefault();
                    this.manejarClickEnlace(evento, enlace);
                }
            });
        });

        // Escuchar clics fuera del sidebar para cerrarlo en móvil
        document.addEventListener('click', (evento) => {
            this.manejarClickFuera(evento);
        });

        // Escuchar cambios de tamaño de ventana con debounce
        const manejarResize = this.utilidades?.debounce(() => {
            this.manejarCambioTamaño();
        }, 100) || (() => this.manejarCambioTamaño());
        
        window.addEventListener('resize', manejarResize);

        // Escuchar tecla Escape para cerrar sidebar
        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && this.sidebarAbierto) {
                this.cerrar();
            }
        });

        // Eventos de integración con otros módulos
        this.configurarEventosIntegracion();
        
        this.log('🎯 Eventos del sidebar configurados', 'info');
    }

    configurarEventosIntegracion() {
        // Escuchar cuando cambien los datos financieros
        document.addEventListener('grizalumDatosFinancierosActualizados', (evento) => {
            this.actualizarResumenFinanciero(evento.detail);
        });

        // Escuchar cuando cambie la empresa
        document.addEventListener('grizalumCompanyChanged', (evento) => {
            const { company } = evento.detail;
            if (company?.data) {
                this.actualizarResumenFinanciero(company.data);
            }
        });

        // Escuchar cambios de tema
        document.addEventListener('grizalumThemeChanged', (evento) => {
            this.aplicarEstilosDinamicos();
        });

        // Escuchar actualizaciones de métricas
        document.addEventListener('metricUpdated', (evento) => {
            const { elementId, newValue } = evento.detail;
            if (elementId === 'sidebarCashFlow' || elementId === 'sidebarProfit') {
                this.actualizarElementoFinanciero(elementId, newValue);
            }
        });
    }

    // ======= ACCESIBILIDAD =======
    
    configurarAccesibilidad() {
        if (!this.sidebar) return;
        
        // Configurar atributos ARIA
        this.sidebar.setAttribute('role', 'navigation');
        this.sidebar.setAttribute('aria-label', 'Navegación principal');
        
        // Configurar enlaces con aria-current
        this.enlaces.forEach(enlace => {
            enlace.setAttribute('role', 'menuitem');
            enlace.setAttribute('tabindex', '0');
        });
        
        // Configurar botón toggle si existe
        const botonToggle = this.cache.get('botonToggle');
        if (botonToggle) {
            botonToggle.setAttribute('aria-label', 'Abrir menú de navegación');
            botonToggle.setAttribute('aria-expanded', 'false');
        }
        
        this.log('♿ Accesibilidad del sidebar configurada', 'info');
    }

    actualizarAriaEstados() {
        const botonToggle = this.cache.get('botonToggle');
        if (botonToggle) {
            botonToggle.setAttribute('aria-expanded', this.sidebarAbierto.toString());
            botonToggle.setAttribute('aria-label', 
                this.sidebarAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
            );
        }
        
        // Actualizar aria-current para enlace activo
        this.enlaces.forEach(enlace => {
            const esActivo = enlace.classList.contains('active');
            enlace.setAttribute('aria-current', esActivo ? 'page' : 'false');
        });
    }

    // ======= FUNCIONALIDAD PRINCIPAL =======
    
    /**
     * Abrir o cerrar el sidebar (toggle)
     * Esta es la función principal que se llama desde el HTML
     */
    toggle() {
        if (!this.inicializado) {
            this.log('⚠️ Sidebar no inicializado para toggle', 'warn');
            return false;
        }

        this.sidebarAbierto = !this.sidebarAbierto;
        
        if (this.sidebarAbierto) {
            this.abrir();
        } else {
            this.cerrar();
        }
        
        return this.sidebarAbierto;
    }

    /**
     * Abrir el sidebar con animación suave
     */
    abrir() {
        if (!this.sidebar) return false;
        
        this.sidebar.classList.add('open');
        this.sidebarAbierto = true;
        
        // Agregar overlay para móviles
        if (this.esMobil()) {
            this.crearOverlay();
        }
        
        // Actualizar estados ARIA
        this.actualizarAriaEstados();
        
        // Guardar estado
        this.guardarEstadoPersistente();
        
        this.log('📱 Sidebar abierto', 'info');
        
        // Disparar evento personalizado
        this.dispararEvento('sidebarAbierto', {
            timestamp: Date.now(),
            esMobil: this.esMobil()
        });
        
        // Enfocar primer enlace para accesibilidad
        setTimeout(() => {
            if (this.enlaces.length > 0) {
                this.enlaces[0].focus();
            }
        }, this.configuracion.animacion.duracion);
        
        return true;
    }

    /**
     * Cerrar el sidebar con animación suave
     */
    cerrar() {
        if (!this.sidebar) return false;
        
        this.sidebar.classList.remove('open');
        this.sidebarAbierto = false;
        
        // Remover overlay
        this.removerOverlay();
        
        // Actualizar estados ARIA
        this.actualizarAriaEstados();
        
        // Guardar estado
        this.guardarEstadoPersistente();
        
        this.log('📱 Sidebar cerrado', 'info');
        
        // Disparar evento personalizado
        this.dispararEvento('sidebarCerrado', {
            timestamp: Date.now(),
            esMobil: this.esMobil()
        });
        
        return true;
    }

    // ======= OVERLAY PARA MÓVILES =======
    
    crearOverlay() {
        // No crear si ya existe
        if (document.getElementById('grizalum-sidebar-overlay')) return;

        const overlay = this.utilidades?.crearElemento('div', {
            id: 'grizalum-sidebar-overlay',
            className: 'grizalum-sidebar-overlay',
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.6)',
                zIndex: '998',
                display: 'block',
                opacity: '0',
                transition: `opacity ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing}`,
                backdropFilter: 'blur(4px)'
            }
        }) || this.crearOverlayManual();
        
        // Cerrar sidebar al hacer clic en overlay
        overlay.addEventListener('click', () => {
            this.cerrar();
        });
        
        document.body.appendChild(overlay);
        
        // Animar entrada
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        this.log('🌫️ Overlay de sidebar creado', 'info');
    }

    crearOverlayManual() {
        const overlay = document.createElement('div');
        overlay.id = 'grizalum-sidebar-overlay';
        overlay.className = 'grizalum-sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 998;
            display: block;
            opacity: 0;
            transition: opacity ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing};
            backdrop-filter: blur(4px);
        `;
        return overlay;
    }

    removerOverlay() {
        const overlay = document.getElementById('grizalum-sidebar-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, this.configuracion.animacion.duracion);
        }
    }

    // ======= NAVEGACIÓN =======
    
    manejarClickEnlace(evento, enlace) {
        evento.preventDefault();
        
        // Extraer sección del onclick o href
        let seccion = this.extraerSeccionDeEnlace(enlace);
        
        // Navegar a la sección
        this.navegarASeccion(seccion, enlace);
    }

    extraerSeccionDeEnlace(enlace) {
        // Intentar extraer de onclick
        const onclick = enlace.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/showSection\(['"](.+?)['"]\)/);
            if (match) return match[1];
        }
        
        // Intentar extraer de href
        const href = enlace.getAttribute('href');
        if (href && href.startsWith('#')) {
            return href.substring(1);
        }
        
        // Intentar extraer de data-section
        const dataSection = enlace.getAttribute('data-section');
        if (dataSection) return dataSection;
        
        return 'dashboard'; // Valor por defecto
    }

    navegarASeccion(seccion, enlaceActivo = null) {
        this.log(`🧭 Navegando a sección: ${seccion}`, 'info');
        
        // Validar sección
        if (!seccion || typeof seccion !== 'string') {
            this.log('❌ Sección inválida proporcionada', 'error');
            this.mostrarNotificacion('Error: Sección inválida', 'error');
            return false;
        }
        
        const seccionAnterior = this.seccionActual;
        this.seccionActual = seccion;
        
        // Actualizar estados activos
        this.actualizarEnlaceActivo(enlaceActivo || this.encontrarEnlacePorSeccion(seccion));
        
        // Cerrar sidebar en móvil después de navegar
        if (this.esMobil() && this.sidebarAbierto && this.configuracion.responsivo.autoClose) {
            setTimeout(() => {
                this.cerrar();
            }, 150);
        }
        
        // Guardar estado
        this.guardarEstadoPersistente();
        
        // Disparar evento de navegación
        this.dispararEvento('navegacionSidebar', {
            seccion: seccion,
            seccionAnterior: seccionAnterior,
            timestamp: Date.now(),
            enlace: enlaceActivo
        });
        
        // Mostrar notificación con nombre amigable
        const nombreSeccion = this.obtenerNombreSeccion(seccion);
        this.mostrarNotificacion(`📱 ${nombreSeccion}`, 'info', 2000);
        
        return true;
    }

    encontrarEnlacePorSeccion(seccion) {
        return this.enlaces.find(enlace => {
            const seccionEnlace = this.extraerSeccionDeEnlace(enlace);
            return seccionEnlace === seccion;
        });
    }

    actualizarEnlaceActivo(enlaceNuevo) {
        // Remover clase active de todos los enlaces
        this.enlaces.forEach(enlace => {
            enlace.classList.remove('active');
        });
        
        // Agregar clase active al enlace seleccionado
        if (enlaceNuevo) {
            enlaceNuevo.classList.add('active');
            this.log(`✅ Enlace activo actualizado: ${enlaceNuevo.textContent.trim()}`, 'info');
        }
        
        // Actualizar estados ARIA
        this.actualizarAriaEstados();
    }

    obtenerNombreSeccion(seccion) {
        const nombres = {
            'dashboard': 'Panel de Control',
            'cash-flow': 'Flujo de Caja',
            'income-statement': 'Estado de Resultados',
            'balance-sheet': 'Balance General',
            'inventory': 'Inventario',
            'sales': 'Ventas',
            'reports': 'Reportes',
            'settings': 'Configuración',
            'analytics': 'Análisis',
            'ai-insights': 'Insights IA'
        };
        
        return nombres[seccion] || this.utilidades?.capitalizar(seccion) || seccion;
    }

    // ======= MANEJO DE EVENTOS =======
    
    manejarClickFuera(evento) {
        // Solo en móviles y si el sidebar está abierto
        if (!this.esMobil() || !this.sidebarAbierto) return;
        
        // Si el clic fue dentro del sidebar, no hacer nada
        if (this.sidebar.contains(evento.target)) return;
        
        // Si el clic fue en el botón de toggle, no hacer nada
        const botonToggle = this.cache.get('botonToggle');
        if (botonToggle && botonToggle.contains(evento.target)) return;
        
        // Cerrar sidebar
        this.cerrar();
    }

    manejarCambioTamaño() {
        const esMobilAhora = this.esMobil();
        
        // En pantallas grandes, cerrar sidebar automáticamente
        if (!esMobilAhora && this.sidebarAbierto) {
            this.cerrar();
        }
        
        // Remover overlay si cambiamos a desktop
        if (!esMobilAhora) {
            this.removerOverlay();
        }
        
        this.log(`📱 Cambio de tamaño detectado - Móvil: ${esMobilAhora}`, 'info');
    }

    esMobil() {
        return window.innerWidth <= this.configuracion.responsivo.breakpointMovil;
    }

    // ======= ACTUALIZACIÓN FINANCIERA =======
    
    actualizarResumenFinanciero(datos) {
        if (!datos || typeof datos !== 'object') {
            this.log('⚠️ Datos financieros inválidos para sidebar', 'warn');
            return false;
        }
        
        try {
            let actualizaciones = 0;
            
            // Actualizar flujo de caja
            if (datos.cashFlow !== undefined || datos.flujoCaja !== undefined) {
                const valor = datos.cashFlow ?? datos.flujoCaja;
                const exito = this.actualizarElementoFinanciero('sidebarCashFlow', valor);
                if (exito) {
                    this.datosFinancieros.cashFlow = valor;
                    actualizaciones++;
                }
            }
            
            // Actualizar utilidad neta
            if (datos.profit !== undefined || datos.utilidad !== undefined) {
                const valor = datos.profit ?? datos.utilidad;
                const exito = this.actualizarElementoFinanciero('sidebarProfit', valor);
                if (exito) {
                    this.datosFinancieros.profit = valor;
                    actualizaciones++;
                }
            }
            
            if (actualizaciones > 0) {
                this.datosFinancieros.ultimaActualizacion = Date.now();
                
                this.log('💰 Resumen financiero del sidebar actualizado', 'success');
                this.log(`   Flujo de Caja: ${this.formatearMoneda(this.datosFinancieros.cashFlow)}`, 'info');
                this.log(`   Utilidad Neta: ${this.formatearMoneda(this.datosFinancieros.profit)}`, 'info');
                
                // Disparar evento de actualización
                this.dispararEvento('sidebarFinancieroActualizado', {
                    datosFinancieros: { ...this.datosFinancieros },
                    actualizaciones
                });
            }
            
            return actualizaciones > 0;
            
        } catch (error) {
            this.log(`❌ Error actualizando resumen financiero del sidebar: ${error.message}`, 'error');
            this.mostrarNotificacion('Error actualizando datos financieros', 'error');
            return false;
        }
    }

    actualizarElementoFinanciero(idElemento, valor) {
        const elemento = this.cache.get(idElemento) || document.getElementById(idElemento);
        if (!elemento) {
            this.log(`⚠️ Elemento financiero no encontrado: ${idElemento}`, 'warn');
            return false;
        }
        
        // Cachear elemento si no estaba
        if (!this.cache.has(idElemento)) {
            this.cache.set(idElemento, elemento);
        }
        
        const valorFormateado = this.formatearMoneda(valor);
        
        // Aplicar animación de actualización
        elemento.style.transition = `all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing}`;
        elemento.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            elemento.textContent = valorFormateado;
            elemento.style.transform = 'scale(1)';
        }, this.configuracion.animacion.duracion / 2);
        
        return true;
    }

    formatearMoneda(valor) {
        if (this.utilidades?.formatearMoneda) {
            return this.utilidades.formatearMoneda(valor, true, true);
        }
        
        // Fallback manual
        if (typeof valor !== 'number') {
            valor = parseFloat(valor) || 0;
        }
        
        return `S/. ${valor.toLocaleString('es-PE')}`;
    }

    // ======= ESTILOS DINÁMICOS =======
    
    aplicarEstilosDinamicos() {
        if (!this.gestorTemas) return;
        
        const idEstilo = 'grizalum-sidebar-dynamic-styles';
        let estiloExistente = document.getElementById(idEstilo);
        
        if (estiloExistente) {
            estiloExistente.remove();
        }

        const estilo = document.createElement('style');
        estilo.id = idEstilo;
        estilo.textContent = this.generarCSSPersonalizado();
        
        document.head.appendChild(estilo);
        this.log('🎨 Estilos dinámicos del sidebar aplicados', 'info');
    }

    generarCSSPersonalizado() {
        return `
            /* GRIZALUM Sidebar Dynamic Styles */
            .grizalum-sidebar-overlay {
                backdrop-filter: blur(4px) !important;
                transition: opacity ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing} !important;
            }
            
            .sidebar {
                transition: transform ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing} !important;
            }
            
            .sidebar.open {
                transform: translateX(0) !important;
            }
            
            .nav-link {
                transition: all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing} !important;
            }
            
            .nav-link:focus {
                outline: 2px solid var(--theme-primary, #d4af37) !important;
                outline-offset: 2px !important;
            }
            
            #sidebarCashFlow,
            #sidebarProfit {
                transition: all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing} !important;
            }
            
            @media (max-width: ${this.configuracion.responsivo.breakpointMovil}px) {
                .sidebar {
                    transform: translateX(-100%) !important;
                }
                
                .sidebar.open {
                    transform: translateX(0) !important;
                }
            }
            
            /* Animación de actualización de datos financieros */
            @keyframes grizalum-financial-update {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .financial-updating {
                animation: grizalum-financial-update 0.3s ease !important;
            }
        `;
    }

    // ======= UTILIDADES =======
    
    resaltarSeccion(seccion, duracion = 2000) {
        const enlace = this.encontrarEnlacePorSeccion(seccion);
        if (!enlace) {
            this.log(`⚠️ No se encontró enlace para sección: ${seccion}`, 'warn');
            return false;
        }
        
        const colorResaltado = 'var(--theme-primary, #d4af37)';
        const estiloOriginal = enlace.style.background;
        
        enlace.style.background = `linear-gradient(90deg, ${colorResaltado}20, transparent)`;
        enlace.style.borderLeft = `3px solid ${colorResaltado}`;
        enlace.style.transition = `all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing}`;
        
        setTimeout(() => {
            enlace.style.background = estiloOriginal;
            enlace.style.borderLeft = '';
        }, duracion);
        
        this.log(`✨ Sección ${seccion} resaltada por ${duracion}ms`, 'info');
        return true;
    }

    dispararEvento(nombreEvento, detalle = {}) {
        const evento = new CustomEvent(nombreEvento, {
            detail: {
                ...detalle,
                sidebarVersion: this.version,
                inicializado: this.inicializado
            }
        });
        document.dispatchEvent(evento);
    }

    // ======= API PÚBLICA =======
    
    obtenerEstado() {
        return {
            version: this.version,
            inicializado: this.inicializado,
            abierto: this.sidebarAbierto,
            seccionActual: this.seccionActual,
            datosFinancieros: { ...this.datosFinancieros },
            cantidadEnlaces: this.enlaces.length,
            esMobil: this.esMobil(),
            configuracion: { ...this.configuracion }
        };
    }

    obtenerAnalyticas() {
        return {
            version: this.version,
            tiempoUsoTotal: Date.now() - (this.tiempoInicializacion || Date.now()),
            navegacionesTotales: this.contadorNavegaciones || 0,
            seccionMasUsada: this.seccionMasUsada || this.seccionActual,
            configuracion: this.configuracion
        };
    }

    configurarResponsive() {
        // Configuración inicial basada en tamaño de pantalla
        this.manejarCambioTamaño();
        this.log('📱 Configuración responsiva aplicada', 'info');
    }
}

// ======= INSTANCIA GLOBAL =======
let manejadorSidebarGrizalum = null;

// ======= INICIALIZACIÓN AUTOMÁTICA =======
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM listo - Inicializando GRIZALUM Sidebar Manager v2.0...');
    
    try {
        manejadorSidebarGrizalum = new ManejadorSidebarGRIZALUM();
        manejadorSidebarGrizalum.inicializar();
        
        // Alias globales
        window.sidebarManager = manejadorSidebarGrizalum;
        window.manejadorSidebar = manejadorSidebarGrizalum; // Compatibilidad
        
    } catch (error) {
        console.error('❌ Error inicializando Sidebar Manager:', error);
    }
});

// ======= FUNCIONES GLOBALES PARA HTML =======

/**
 * Función global para toggle del sidebar (llamada desde HTML)
 */
function toggleSidebar() {
    return window.sidebarManager?.toggle() || false;
}

/**
 * Función global para navegar a sección (llamada desde HTML)
 */
function showSection(seccion) {
    return window.sidebarManager?.navegarASeccion(seccion) || false;
}

// Hacer funciones disponibles globalmente
window.toggleSidebar = toggleSidebar;
window.showSection = showSection;

// ======= API PÚBLICA DEL SIDEBAR =======
window.GRIZALUM_SIDEBAR = {
    version: '2.0.0',
    toggle: () => window.sidebarManager?.toggle(),
    abrir: () => window.sidebarManager?.abrir(),
    cerrar: () => window.sidebarManager?.cerrar(),
    navegarA: (seccion) => window.sidebarManager?.navegarASeccion(seccion),
    obtenerEstado: () => window.sidebarManager?.obtenerEstado(),
    obtenerAnalyticas: () => window.sidebarManager?.obtenerAnalyticas(),
    actualizarFinanciero: (datos) => window.sidebarManager?.actualizarResumenFinanciero(datos),
    resaltar: (seccion, duracion) => window.sidebarManager?.resaltarSeccion(seccion, duracion),
    
    // Nuevas funciones v2.0
    esMobil: () => window.sidebarManager?.esMobil(),
    obtenerSeccionActual: () => window.sidebarManager?.seccionActual,
    configurarAnimacion: (duracion, easing) => {
        if (window.sidebarManager) {
            window.sidebarManager.configuracion.animacion = { duracion, easing };
        }
    }
};

console.log('📱 GRIZALUM Sidebar Manager v2.0 cargado');
console.log('✨ Funcionalidades principales:');
console.log('  • 🎯 Navegación inteligente con persistencia');
console.log('  • 📱 Responsive automático para móviles');
console.log('  • 💰 Actualización de datos financieros');
console.log('  • 🎨 Integración con sistema de temas');
console.log('  • ♿ Accesibilidad completa (ARIA)');
console.log('  • 🔔 Sistema de notificaciones integrado');
console.log('  • 🚀 Cache inteligente y rendimiento optimizado');
console.log('  • 📊 API completa con analíticas');
console.log('🚀 ¡Sistema de navegación de clase mundial listo!');

console.log(`
📱 ===================================================
   GRIZALUM SIDEBAR MANAGER v2.0 - ULTRA PROFESSIONAL
📱 ===================================================

✨ FUNCIONES DISPONIBLES:
   • toggleSidebar() - Abrir/cerrar menú lateral
   • showSection(seccion) - Navegar a sección específica
   • GRIZALUM_SIDEBAR.* - API completa del sidebar

📱 MEJORAS v2.0:
   • Integración con utilidades GRIZALUM
   • Integración con gestor de temas
   • Persistencia de estado inteligente
   • Accesibilidad completa (ARIA)
   • Cache de elementos DOM
   • Animaciones suaves personalizables
   • Eventos unificados
   • Mejor manejo de errores

🔗 EVENTOS QUE ESCUCHA:
   • grizalumDatosFinancierosActualizados
   • grizalumCompanyChanged
   • grizalumThemeChanged
   • metricUpdated

🔗 EVENTOS QUE EMITE:
   • sidebarInicializado
   • sidebarAbierto
   • sidebarCerrado
   • navegacionSidebar
   • sidebarFinancieroActualizado

📱 ===================================================
`);
