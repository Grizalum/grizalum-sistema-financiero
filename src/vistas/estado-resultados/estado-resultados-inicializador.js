/**
 * ═══════════════════════════════════════════════════════════════════
 * ESTADO DE RESULTADOS - INICIALIZADOR UNIFICADO
 * Sistema único de inicialización que garantiza carga correcta
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    class EstadoResultadosInicializador {
        constructor() {
            this.inicializado = false;
            this.intentosMaximos = 20;
            this.intentos = 0;
            this.intervaloVerificacion = 200; // ms
            
            console.log('🚀 [Inicializador] Estado de Resultados preparado');
            
            // Iniciar proceso
            this._iniciar();
        }

        _iniciar() {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this._verificarDependencias());
            } else {
                this._verificarDependencias();
            }

            // Escuchar eventos de cambio de vista
            this._configurarListeners();
        }

        _configurarListeners() {
            // Evento principal desde cargador-vistas.js
            document.addEventListener('vistaEstadoResultadosCargada', () => {
                console.log('👁️ [Inicializador] Vista Estado de Resultados cargada');
                this._verificarVista();
            });

            // Backup: Detectar cuando el contenedor se hace visible
            const observer = new MutationObserver(() => {
                if (this._vistaEsVisible()) {
                    this._verificarVista();
                }
            });

            // Observar cambios en el body
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['style', 'class'],
                subtree: true,
                childList: true
            });
        }

        _verificarDependencias() {
            const verificar = () => {
                this.intentos++;

                // Verificar que todas las clases estén disponibles
                const dependenciasListas = 
                    window.EstadoResultados &&
                    window.EstadoResultadosUI &&
                    window.EstadoResultadosConfig &&
                    window.EstadoResultadosGraficos &&
                    window.gestorEmpresas &&
                    window.sistemaNiveles;
                    window.flujoCaja &&  // ← AGREGAR ESTA LÍNEA
                    window.flujoCaja.inicializado;  // ← Y ESTA

                if (dependenciasListas) {
                    console.log('✅ [Inicializador] Todas las dependencias cargadas');
                    this._inicializarModulos();
                } else if (this.intentos < this.intentosMaximos) {
                    setTimeout(verificar, this.intervaloVerificacion);
                } else {
                    console.error('❌ [Inicializador] Timeout esperando dependencias');
                    this._mostrarError();
                }
            };

            verificar();
        }

        _inicializarModulos() {
            try {
                // Inicializar módulo principal si no existe
                if (!window.estadoResultados) {
                    window.estadoResultados = new window.EstadoResultados();
                    console.log('✅ [Inicializador] Módulo principal creado');
                }

                // ✅ SIEMPRE crear nueva instancia de UI
                  window.estadoResultadosUI = new window.EstadoResultadosUI();

                this.inicializado = true;
                console.log('🎉 [Inicializador] Sistema completamente inicializado');

                // Si la vista ya está visible, cargar datos
                if (this._vistaEsVisible()) {
                    this._verificarVista();
                }

            } catch (error) {
                console.error('❌ [Inicializador] Error inicializando:', error);
                this._mostrarError();
            }
        }

        _verificarVista() {
            if (!this.inicializado) {
                console.log('⏳ [Inicializador] Sistema aún no listo');
                return;
            }

            if (!this._vistaEsVisible()) {
                console.log('👀 [Inicializador] Vista no visible, esperando...');
                return;
            }

            // Vista visible y sistema listo - cargar datos
            this._cargarDatos();
        }

       _cargarDatos() {
            try {
                console.log('📊 [Inicializador] Cargando datos...');
                
                setTimeout(() => {
                    if (window.estadoResultados && window.estadoResultadosUI) {
                        
                        if (!window.estadoResultados.configuracion) {
                            window.estadoResultados.configuracion = window.EstadoResultadosConfig;
                        }
                        
                        window.estadoResultados.calcularResultados();
                        
                        setTimeout(() => {
                            window.estadoResultadosUI.cargarResultados();
                            console.log('✅ [Inicializador] Datos cargados');
                        }, 300);
                    }
                }, 500);
                
            } catch (error) {
                console.error('❌ [Inicializador] Error:', error);
            }
        }
        _cargarGraficos() {
            try {
                if (!window.estadoResultados || !window.estadoResultadosUI) return;

                const resultados = window.estadoResultados.obtenerResultados();
                
                if (resultados && resultados.totalTransacciones > 0) {
                    
                    // Verificar si gráficos están activos según el plan
                    const graficosActivos = window.estadoResultados.componenteActivo('graficosBasicos');
                    
                    if (graficosActivos && window.EstadoResultadosGraficos) {
                        setTimeout(() => {
                            console.log('📊 [Inicializador] Cargando gráficos...');
                            window.EstadoResultadosGraficos.crearGraficoBarras(resultados);
                            window.EstadoResultadosGraficos.crearGraficoTorta(resultados);
                            console.log('✅ [Inicializador] Gráficos renderizados');
                        }, 800);
                    }
                }
            } catch (error) {
                console.error('⚠️ [Inicializador] Error cargando gráficos:', error);
            }
        }

        _vistaEsVisible() {
            const app = document.getElementById('estadoResultadosApp');
            if (!app) return false;

            const estilo = window.getComputedStyle(app);
            const visible = estilo.display !== 'none' && estilo.visibility !== 'hidden';
            
            return visible;
        }

        _mostrarError() {
            const app = document.getElementById('estadoResultadosApp');
            if (app) {
                app.innerHTML = `
                    <div style="padding: 3rem; text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                        <h2 style="color: var(--texto-principal); margin-bottom: 1rem;">
                            Error al cargar Estado de Resultados
                        </h2>
                        <p style="color: var(--texto-secundario); margin-bottom: 2rem;">
                            No se pudieron cargar los componentes necesarios. 
                            Por favor, recarga la página.
                        </p>
                        <button onclick="location.reload()" 
                                style="padding: 0.75rem 1.5rem; background: var(--color-primario); 
                                       color: white; border: none; border-radius: 8px; 
                                       cursor: pointer; font-weight: 600;">
                            Recargar Página
                        </button>
                    </div>
                `;
            }
        }
    }

    // Crear instancia única global
    if (!window.estadoResultadosInicializador) {
        window.estadoResultadosInicializador = new EstadoResultadosInicializador();
    }

    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🚀 INICIALIZADOR ESTADO DE RESULTADOS v2.0                   ║
║  Sistema unificado de inicialización                         ║
╚═══════════════════════════════════════════════════════════════╝
    `);

})();
