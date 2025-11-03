/**
 * ================================================================
 * GRIZALUM SIDEBAR MANAGER v2.5 - CORREGIDO
 * Integrado perfectamente con principal.js
 * ================================================================
 */
class ManejadorSidebarGRIZALUM {
    constructor() {
        this.version = '2.5.0';
        this.sidebar = null;
        this.enlaces = [];
        this.seccionActual = 'dashboard';
        this.sidebarAbierto = false;
        this.utilidades = null;
        this.gestorTemas = null;
        this.cache = new Map();
        this.inicializado = false;
        
        this.datosFinancieros = {
            cashFlow: 0,
            profit: 0,
            ultimaActualizacion: Date.now()
        };
        
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
        
        this.log('Inicializando GRIZALUM Sidebar Manager v2.5...');
    }

    inicializar() {
        try {
            this.log('Inicializando controlador del sidebar...', 'info');
            
            this.detectarDependencias();
            this.cargarConfiguracionGlobal();
            this.mapearElementosDOM();
            this.cargarEstadoPersistente();
            this.configurarEventos();
            this.configurarAccesibilidad();
            this.configurarResponsive();
            this.aplicarEstilosDinamicos();
            
            this.inicializado = true;
            this.log('Sidebar inicializado correctamente', 'success');
            
            this.dispararEvento('sidebarInicializado', {
                version: this.version,
                enlaces: this.enlaces.length,
                seccionActual: this.seccionActual
            });
            
        } catch (error) {
            this.log(`Error inicializando sidebar: ${error.message}`, 'error');
        }
    }

    detectarDependencias() {
        this.utilidades = window.GrizalumUtils || null;
        this.gestorTemas = window.themeManager || window.gestorTemas || null;
    }

    cargarConfiguracionGlobal() {
        const config = window.GRIZALUM_CONFIG || {};
        if (config.sidebar) {
            this.configuracion = { ...this.configuracion, ...config.sidebar };
        }
    }

    log(mensaje, tipo = 'info') {
        const timestamp = new Date().toLocaleTimeString('es-PE');
        const prefijo = `[GRIZALUM-Sidebar ${timestamp}]`;
        
        switch (tipo) {
            case 'error':
                console.error(`${prefijo}`, mensaje);
                break;
            case 'warn':
                console.warn(`${prefijo}`, mensaje);
                break;
            case 'success':
                console.log(`${prefijo}`, mensaje);
                break;
            default:
                console.log(`${prefijo}`, mensaje);
        }
    }

    mapearElementosDOM() {
        this.sidebar = document.getElementById('sidebar');
        if (!this.sidebar) {
            throw new Error('Sidebar no encontrado en el DOM');
        }

        this.enlaces = Array.from(document.querySelectorAll('.nav-link'));
        this.cache.set('botonToggle', document.querySelector('.mobile-menu-toggle'));
        this.cache.set('elementoCashFlow', document.getElementById('sidebarCashFlow'));
        this.cache.set('elementoProfit', document.getElementById('sidebarProfit'));
    }

    cargarEstadoPersistente() {
        if (!this.configuracion.persistencia.recordarEstado) return;
        
        try {
            const guardado = localStorage.getItem(this.configuracion.persistencia.cacheKey);
            const estadoGuardado = guardado ? JSON.parse(guardado) : null;
            
            if (estadoGuardado) {
                this.seccionActual = estadoGuardado.seccionActual || 'dashboard';
                if (window.innerWidth > this.configuracion.responsivo.breakpointMovil) {
                    this.sidebarAbierto = estadoGuardado.sidebarAbierto || false;
                }
            }
        } catch (error) {
            this.log(`Error cargando estado persistente: ${error.message}`, 'warn');
        }
    }

    guardarEstadoPersistente() {
        if (!this.configuracion.persistencia.recordarEstado) return;
        
        try {
            const estado = {
                seccionActual: this.seccionActual,
                sidebarAbierto: this.sidebarAbierto,
                timestamp: Date.now()
            };
            localStorage.setItem(this.configuracion.persistencia.cacheKey, JSON.stringify(estado));
        } catch (error) {
            this.log(`Error guardando estado: ${error.message}`, 'warn');
        }
    }

    configurarEventos() {
        // CAMBIO CRÍTICO: Solo manejamos clicks sin navegar
        this.enlaces.forEach((enlace) => {
            enlace.addEventListener('click', (evento) => {
                this.manejarClickEnlace(evento, enlace);
            });
            
            enlace.addEventListener('keydown', (evento) => {
                if (evento.key === 'Enter' || evento.key === ' ') {
                    evento.preventDefault();
                    this.manejarClickEnlace(evento, enlace);
                }
            });
        });

        document.addEventListener('click', (evento) => {
            this.manejarClickFuera(evento);
        });

        const manejarResize = () => this.manejarCambioTamaño();
        window.addEventListener('resize', this.debounce(manejarResize, 100));

        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && this.sidebarAbierto) {
                this.cerrar();
            }
        });

        this.configurarEventosIntegracion();
    }

    configurarEventosIntegracion() {
        document.addEventListener('grizalumDatosFinancierosActualizados', (evento) => {
            this.actualizarResumenFinanciero(evento.detail);
        });

        document.addEventListener('grizalumCompanyChanged', (evento) => {
            const { company } = evento.detail;
            if (company?.data) {
                this.actualizarResumenFinanciero(company.data);
            }
        });

        document.addEventListener('grizalumThemeChanged', () => {
            this.aplicarEstilosDinamicos();
        });

               // NUEVO: Escuchar cuando principal.js cambie de sección
        document.addEventListener('sectionChanged', (evento) => {
            this.seccionActual = evento.detail.to;
            this.actualizarEnlaceActivo(this.encontrarEnlacePorSeccion(evento.detail.to));
            this.guardarEstadoPersistente();
            
            // ✅ CARGAR NIVEL DE FLUJO DE CAJA
            if (evento.detail.to === 'flujo-caja') {
                setTimeout(() => {
                    if (window.cargarNivel && window.flujoCaja?.inicializado) {
                        console.log('🎯 Cargando nivel al entrar a Flujo de Caja...');
                        window.cargarNivel();
                     }
                 }, 300);
             }
          });
        }

    configurarAccesibilidad() {
        if (!this.sidebar) return;
        
        this.sidebar.setAttribute('role', 'navigation');
        this.sidebar.setAttribute('aria-label', 'Navegación principal');
        
        this.enlaces.forEach(enlace => {
            enlace.setAttribute('role', 'menuitem');
            enlace.setAttribute('tabindex', '0');
        });
        
        const botonToggle = this.cache.get('botonToggle');
        if (botonToggle) {
            botonToggle.setAttribute('aria-label', 'Abrir menú de navegación');
            botonToggle.setAttribute('aria-expanded', 'false');
        }
    }

    actualizarAriaEstados() {
        const botonToggle = this.cache.get('botonToggle');
        if (botonToggle) {
            botonToggle.setAttribute('aria-expanded', this.sidebarAbierto.toString());
            botonToggle.setAttribute('aria-label', 
                this.sidebarAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
            );
        }
        
        this.enlaces.forEach(enlace => {
            const esActivo = enlace.classList.contains('active');
            enlace.setAttribute('aria-current', esActivo ? 'page' : 'false');
        });
    }

    toggle() {
        if (!this.inicializado) return false;
        
        this.sidebarAbierto = !this.sidebarAbierto;
        
        if (this.sidebarAbierto) {
            this.abrir();
        } else {
            this.cerrar();
        }
        
        return this.sidebarAbierto;
    }

    abrir() {
        if (!this.sidebar) return false;
        
        this.sidebar.classList.add('open');
        this.sidebarAbierto = true;
        
        if (this.esMobil()) {
            this.crearOverlay();
        }
        
        this.actualizarAriaEstados();
        this.guardarEstadoPersistente();
        
        this.dispararEvento('sidebarAbierto', {
            timestamp: Date.now(),
            esMobil: this.esMobil()
        });
        
        setTimeout(() => {
            if (this.enlaces.length > 0) {
                this.enlaces[0].focus();
            }
        }, this.configuracion.animacion.duracion);
        
        return true;
    }

    cerrar() {
        if (!this.sidebar) return false;
        
        this.sidebar.classList.remove('open');
        this.sidebarAbierto = false;
        
        this.removerOverlay();
        this.actualizarAriaEstados();
        this.guardarEstadoPersistente();
        
        this.dispararEvento('sidebarCerrado', {
            timestamp: Date.now(),
            esMobil: this.esMobil()
        });
        
        return true;
    }

    crearOverlay() {
        if (document.getElementById('grizalum-sidebar-overlay')) return;
        
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
        
        overlay.addEventListener('click', () => {
            this.cerrar();
        });
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
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

    // CAMBIO CRÍTICO: Solo actualiza UI, no navega
    manejarClickEnlace(evento, enlace) {
        // NO PREVENIMOS el default - dejamos que principal.js maneje la navegación
        // Solo actualizamos el estado visual
        
        const seccion = this.extraerSeccionDeEnlace(enlace);
        this.seccionActual = seccion;
        
        // Actualizar enlace activo visualmente
        this.actualizarEnlaceActivo(enlace);
        
        // Cerrar sidebar en móvil
        if (this.esMobil() && this.sidebarAbierto && this.configuracion.responsivo.autoClose) {
            setTimeout(() => {
                this.cerrar();
            }, 150);
        }
        
        // Guardar estado
        this.guardarEstadoPersistente();
        
        // Disparar evento sin navegación
        this.dispararEvento('navegacionSidebar', {
            seccion: seccion,
            timestamp: Date.now(),
            enlace: enlace
        });
    }

    extraerSeccionDeEnlace(enlace) {
        const onclick = enlace.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/showSection\(['"](.+?)['"]\)/);
            if (match) return match[1];
        }
        
        const href = enlace.getAttribute('href');
        if (href && href.startsWith('#')) {
            return href.substring(1);
        }
        
        const dataSection = enlace.getAttribute('data-section');
        if (dataSection) return dataSection;
        
        return 'dashboard';
    }

    encontrarEnlacePorSeccion(seccion) {
        return this.enlaces.find(enlace => {
            const seccionEnlace = this.extraerSeccionDeEnlace(enlace);
            return seccionEnlace === seccion;
        });
    }

    actualizarEnlaceActivo(enlaceNuevo) {
        this.enlaces.forEach(enlace => {
            enlace.classList.remove('active');
        });
        
        if (enlaceNuevo) {
            enlaceNuevo.classList.add('active');
        }
        
        this.actualizarAriaEstados();
    }

    manejarClickFuera(evento) {
        if (!this.esMobil() || !this.sidebarAbierto) return;
        if (this.sidebar.contains(evento.target)) return;
        
        const botonToggle = this.cache.get('botonToggle');
        if (botonToggle && botonToggle.contains(evento.target)) return;
        
        this.cerrar();
    }

    manejarCambioTamaño() {
        const esMobilAhora = this.esMobil();
        
        if (!esMobilAhora && this.sidebarAbierto) {
            this.cerrar();
        }
        
        if (!esMobilAhora) {
            this.removerOverlay();
        }
    }

    esMobil() {
        return window.innerWidth <= this.configuracion.responsivo.breakpointMovil;
    }

    actualizarResumenFinanciero(datos) {
        if (!datos || typeof datos !== 'object') return false;
        
        try {
            let actualizaciones = 0;
            
            if (datos.cashFlow !== undefined || datos.flujoCaja !== undefined) {
                const valor = datos.cashFlow ?? datos.flujoCaja;
                if (this.actualizarElementoFinanciero('sidebarCashFlow', valor)) {
                    this.datosFinancieros.cashFlow = valor;
                    actualizaciones++;
                }
            }
            
            if (datos.profit !== undefined || datos.utilidad !== undefined) {
                const valor = datos.profit ?? datos.utilidad;
                if (this.actualizarElementoFinanciero('sidebarProfit', valor)) {
                    this.datosFinancieros.profit = valor;
                    actualizaciones++;
                }
            }
            
            if (actualizaciones > 0) {
                this.datosFinancieros.ultimaActualizacion = Date.now();
                
                this.dispararEvento('sidebarFinancieroActualizado', {
                    datosFinancieros: { ...this.datosFinancieros },
                    actualizaciones
                });
            }
            
            return actualizaciones > 0;
            
        } catch (error) {
            this.log(`Error actualizando resumen financiero: ${error.message}`, 'error');
            return false;
        }
    }

    actualizarElementoFinanciero(idElemento, valor) {
        const elemento = this.cache.get(idElemento) || document.getElementById(idElemento);
        if (!elemento) return false;
        
        if (!this.cache.has(idElemento)) {
            this.cache.set(idElemento, elemento);
        }
        
        const valorFormateado = this.formatearMoneda(valor);
        
        elemento.style.transition = `all ${this.configuracion.animacion.duracion}ms ${this.configuracion.animacion.easing}`;
        elemento.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            elemento.textContent = valorFormateado;
            elemento.style.transform = 'scale(1)';
        }, this.configuracion.animacion.duracion / 2);
        
        return true;
    }

    formatearMoneda(valor) {
        if (typeof valor !== 'number') {
            valor = parseFloat(valor) || 0;
        }
        return `S/. ${valor.toLocaleString('es-PE')}`;
    }

    aplicarEstilosDinamicos() {
        const idEstilo = 'grizalum-sidebar-dynamic-styles';
        let estiloExistente = document.getElementById(idEstilo);
        
        if (estiloExistente) {
            estiloExistente.remove();
        }
        
        const estilo = document.createElement('style');
        estilo.id = idEstilo;
        estilo.textContent = this.generarCSSPersonalizado();
        
        document.head.appendChild(estilo);
    }

    generarCSSPersonalizado() {
        return `
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
        `;
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

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    obtenerEstado() {
        return {
            version: this.version,
            inicializado: this.inicializado,
            abierto: this.sidebarAbierto,
            seccionActual: this.seccionActual,
            datosFinancieros: { ...this.datosFinancieros },
            cantidadEnlaces: this.enlaces.length,
            esMobil: this.esMobil()
        };
    }

    configurarResponsive() {
        this.manejarCambioTamaño();
    }
}

let manejadorSidebarGrizalum = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando GRIZALUM Sidebar Manager v2.5...');
    
    try {
        manejadorSidebarGrizalum = new ManejadorSidebarGRIZALUM();
        manejadorSidebarGrizalum.inicializar();
        
        window.sidebarManager = manejadorSidebarGrizalum;
        window.manejadorSidebar = manejadorSidebarGrizalum;
        
    } catch (error) {
        console.error('Error inicializando Sidebar Manager:', error);
    }
});

function toggleSidebar() {
    return window.sidebarManager?.toggle() || false;
}

function showSection(seccion) {
    // DELEGAMOS A principal.js
    return window.grizalumApp?.showSection(seccion) || false;
}

window.toggleSidebar = toggleSidebar;
window.showSection = showSection;

window.GRIZALUM_SIDEBAR = {
    version: '2.5.0',
    toggle: () => window.sidebarManager?.toggle(),
    abrir: () => window.sidebarManager?.abrir(),
    cerrar: () => window.sidebarManager?.cerrar(),
    obtenerEstado: () => window.sidebarManager?.obtenerEstado(),
    actualizarFinanciero: (datos) => window.sidebarManager?.actualizarResumenFinanciero(datos),
    esMobil: () => window.sidebarManager?.esMobil()
};

console.log('GRIZALUM Sidebar Manager v2.5 CORREGIDO cargado');
console.log('Cambios clave:');
console.log('  • Navegación delegada a principal.js');
console.log('  • Sin conflictos de secciones');
console.log('  • Sincronización perfecta');

/**
 * ═══════════════════════════════════════════════════════════════════
 * FIX PERMANENTE - REMOVER OVERLAYS DE CARGA
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Este código debe agregarse al FINAL de tu archivo principal
 * (index.html o main.js)
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN: Remover pantallas de carga
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function removerPantallaDeCarga() {
    console.log('🧹 Limpiando overlays de carga...');
    
    const selectores = [
        '.loading-content',
        '.loading-logo',
        '.loading-bar',
        '.loading-progress',
        '.loading-version',
        '.brand-icon.loading-logo',
        '#loading-screen',
        '#pantalla-carga',
        '[class*="loading"]'
    ];
    
    let removidos = 0;
    
    selectores.forEach(selector => {
        const elementos = document.querySelectorAll(selector);
        elementos.forEach(el => {
            // Solo remover si es un overlay de carga, no parte del contenido
            if (!el.closest('#contenedorVistas')) {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.3s';
                
                setTimeout(() => {
                    el.remove();
                }, 300);
                
                removidos++;
            }
        });
    });
    
    console.log(`✅ ${removidos} overlays de carga removidos`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN: Asegurar que los modales se cierren correctamente
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function limpiarModalesAbiertos() {
    console.log('🧹 Limpiando modales...');
    
    const modales = document.querySelectorAll('.modal, [class*="modal-"]');
    
    modales.forEach(modal => {
        // Solo cerrar modales que NO están dentro del contenido
        if (!modal.closest('#contenedorVistas')) {
            const styles = window.getComputedStyle(modal);
            
            if (styles.display !== 'none' && parseFloat(styles.opacity) > 0) {
                modal.style.display = 'none';
                console.log(`  ✅ Modal cerrado: ${modal.className}`);
            }
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN: Limpiar al cambiar de módulo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function limpiarOverlaysAlNavegar() {
    console.log('🔄 Limpiando al navegar...');
    
    removerPantallaDeCarga();
    limpiarModalesAbiertos();
    
    // Asegurar que el contenedor no tenga transiciones problemáticas
    const contenedor = document.getElementById('contenedorVistas');
    if (contenedor) {
        // Remover transiciones solo si están causando problemas
        const styles = window.getComputedStyle(contenedor);
        if (styles.transition.includes('opacity') || styles.transition.includes('all')) {
            contenedor.style.transition = 'none';
            console.log('  ✅ Transiciones del contenedor desactivadas');
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTOS: Ejecutar limpieza automáticamente
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando limpieza automática de overlays...');
    
    // Esperar un poco para que todo cargue
    setTimeout(() => {
        removerPantallaDeCarga();
    }, 2000);
});

// Al cambiar de módulo
if (window.grizalumModulos) {
    window.addEventListener('grizalumModuloMostrado', (e) => {
        console.log(`📺 Módulo mostrado: ${e.detail.moduloId}`);
        
        // Limpiar overlays después de un breve delay
        setTimeout(() => {
            limpiarOverlaysAlNavegar();
        }, 500);
    });
}

// Al hacer clic en los links de navegación
document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-section]');
    if (link) {
        // Limpiar antes de cambiar de vista
        setTimeout(() => {
            limpiarOverlaysAlNavegar();
        }, 800);
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN GLOBAL: Para limpiar manualmente
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

window.limpiarOverlays = function() {
    limpiarOverlaysAlNavegar();
    console.log('✅ Limpieza manual completada');
};

console.log('✅ Sistema de limpieza de overlays activado');
console.log('💡 Función disponible: window.limpiarOverlays()');
