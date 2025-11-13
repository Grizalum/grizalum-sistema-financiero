/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL - FIX DE RECARGA v2.0
 * Destruye y recarga correctamente gráficos al volver al panel
 * ═══════════════════════════════════════════════════════════════════
 */
(function() {
    'use strict';
    
    console.log('🛡️ [PanelFix] Sistema de recarga v2.0 iniciado');
    
    let ultimaVezVisible = null;
    let graficosDestruidos = false;
    
    function panelEstaVisible() {
        const contenedor = document.querySelector('.panel-control-contenedor');
        return contenedor && contenedor.offsetParent !== null;
    }
    
    function panelEstaOculto() {
        return !panelEstaVisible();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * LIMPIEZA PROFUNDA - Destruye TODO antes de recrear
     * ═══════════════════════════════════════════════════════════════
     */
    function destruirGraficosCompletamente() {
        console.log('🧹 [PanelFix] Limpieza profunda iniciada...');
        
        // 1. Destruir instancias de Chart.js
        if (window.panelControlUI && window.panelControlUI.graficos) {
            Object.values(window.panelControlUI.graficos).forEach(grafico => {
                if (grafico && typeof grafico.destroy === 'function') {
                    try {
                        grafico.destroy();
                        console.log('   ✅ Gráfico destruido');
                    } catch (e) {
                        console.warn('   ⚠️ Error destruyendo:', e);
                    }
                }
            });
            
            // Resetear objeto de gráficos
            window.panelControlUI.graficos = {
                principal: null,
                distribucion: null,
                comparativa: null,
                tendencia: null
            };
        }
        
        // 2. Limpiar todos los canvas (por si quedaron instancias huérfanas)
        const canvasIds = [
            'graficoFlujoCajaPrincipal',
            'graficoDistribucionGastos',
            'graficoIngresosVsGastos',
            'graficoTendenciaMensual'
        ];
        
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                // Obtener el Chart asociado (si existe)
                const chartInstance = Chart.getChart(canvas);
                if (chartInstance) {
                    chartInstance.destroy();
                    console.log(`   ✅ Canvas ${id} limpiado`);
                }
                
                // Limpiar completamente el canvas
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        });
        
        graficosDestruidos = true;
        console.log('✅ [PanelFix] Limpieza completada');
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * RECARGA COMPLETA - Datos + Gráficos
     * ═══════════════════════════════════════════════════════════════
     */
    function forzarRecargaCompleta() {
        if (!panelEstaVisible()) return;
        
        console.log('🔄 [PanelFix] Recarga completa iniciada...');
        
        // 1. Scroll arriba instantáneo
        const contenedorVistas = document.getElementById('contenedorVistas');
        if (contenedorVistas) {
            contenedorVistas.scrollTo({ top: 0, behavior: 'instant' });
        }
        
        // 2. Esperar que el DOM esté estable
        setTimeout(() => {
            // 3. Destruir gráficos anteriores
            destruirGraficosCompletamente();
            
            // 4. Esperar un poco para que se libere memoria
            setTimeout(() => {
                // 5. Recargar datos
                if (window.panelControlUI) {
                    try {
                        window.panelControlUI.cargarDatos();
                        console.log('✅ [PanelFix] Datos recargados');
                    } catch (e) {
                        console.error('❌ [PanelFix] Error cargando datos:', e);
                    }
                }
                
                // 6. Recrear gráficos desde cero
                setTimeout(() => {
                    if (window.panelControlUI) {
                        try {
                            window.panelControlUI.inicializarGraficos();
                            graficosDestruidos = false;
                            console.log('✅ [PanelFix] Gráficos recreados exitosamente');
                        } catch (e) {
                            console.error('❌ [PanelFix] Error recreando gráficos:', e);
                        }
                    }
                }, 300);
                
            }, 100);
            
        }, 200);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * OBSERVER - Detecta cuando el panel se muestra/oculta
     * ═══════════════════════════════════════════════════════════════
     */
    const observer = new MutationObserver(() => {
        const visible = panelEstaVisible();
        
        // Panel se volvió visible
        if (visible && !ultimaVezVisible) {
            console.log('👁️ [PanelFix] Panel ahora visible - Iniciando recarga');
            ultimaVezVisible = Date.now();
            forzarRecargaCompleta();
        } 
        // Panel se ocultó
        else if (!visible && ultimaVezVisible) {
            console.log('👋 [PanelFix] Panel ocultado');
            ultimaVezVisible = null;
            
            // Destruir gráficos cuando se oculta para liberar memoria
            if (!graficosDestruidos) {
                destruirGraficosCompletamente();
            }
        }
    });
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * INICIALIZACIÓN
     * ═══════════════════════════════════════════════════════════════
     */
    setTimeout(() => {
        const contenedor = document.getElementById('contenedorVistas') || document.body;
        observer.observe(contenedor, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        console.log('👀 [PanelFix] Observer activado');
    }, 500);
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * EVENTO DE CLICK EN NAVEGACIÓN
     * ═══════════════════════════════════════════════════════════════
     */
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-section="dashboard"]');
        if (target) {
            console.log('🖱️ [PanelFix] Click en navegación a Dashboard detectado');
            setTimeout(() => {
                if (panelEstaVisible()) {
                    forzarRecargaCompleta();
                }
            }, 1000);
        }
    });
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * SCROLL AUTOMÁTICO (mantener arriba)
     * ═══════════════════════════════════════════════════════════════
     */
    setInterval(() => {
        const contenedorVistas = document.getElementById('contenedorVistas');
        const panelVisible = panelEstaVisible();
        
        if (panelVisible && contenedorVistas && contenedorVistas.scrollTop > 100) {
            contenedorVistas.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 500);
    
    console.log('✅ [PanelFix] Sistema v2.0 completamente activo');
    
    // Exponer función de limpieza globalmente por si se necesita
    window.limpiarPanelControl = destruirGraficosCompletamente;
    
})();
