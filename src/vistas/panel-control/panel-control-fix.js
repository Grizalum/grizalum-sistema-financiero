/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL - FIX DE RECARGA v2.0
 * Compatible con panel-control-ui v1.2
 * Recarga rápida y profesional
 * ═══════════════════════════════════════════════════════════════════
 */
(function() {
    'use strict';
    
    console.log('🛡️ [PanelFix] v2.0 Sistema de recarga iniciado');
    
    let ultimaVezVisible = null;
    let recargando = false;
    
    function panelEstaVisible() {
        const contenedor = document.querySelector('.panel-control-contenedor');
        return contenedor && contenedor.offsetParent !== null;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * RECARGA RÁPIDA Y PROFESIONAL
     * ═══════════════════════════════════════════════════════════════
     */
    async function recargarPanel() {
        if (!panelEstaVisible() || recargando) return;
        
        recargando = true;
        console.log('🔄 [PanelFix] Recarga iniciada...');
        
        try {
            // 1. Scroll arriba instantáneo
            const contenedorVistas = document.getElementById('contenedorVistas');
            if (contenedorVistas) {
                contenedorVistas.scrollTo({ top: 0, behavior: 'instant' });
            }
            
            // 2. Verificar que panelControlUI existe
            if (!window.panelControlUI) {
                console.error('   ❌ panelControlUI NO existe');
                recargando = false;
                return;
            }
            
            // 3. Usar el método limpiarYReinicializar (más eficiente)
            if (typeof window.panelControlUI.limpiarYReinicializar === 'function') {
                window.panelControlUI.limpiarYReinicializar();
                console.log('   ✅ Recarga completa exitosa');
                setTimeout(() => window.pcmActualizar?.(), 2500);
            } else {
                // Fallback: método manual
                await window.panelControlUI.cargarDatos();
                window.panelControlUI.inicializarGraficos();
                console.log('   ✅ Recarga manual exitosa');
            }
            
        } catch (error) {
            console.error('   ❌ Error en recarga:', error);
        } finally {
            recargando = false;
        }
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
       console.log('👁️ [PanelFix] Panel ahora visible');
       ultimaVezVisible = Date.now();
    
       // Esperar un poco a que todo el DOM esté listo
       setTimeout(() => {
           recargarPanel();
        }, 1000); // ← CAMBIAR 300 A 1000
     }
        // Panel se ocultó
        else if (!visible && ultimaVezVisible) {
            console.log('👋 [PanelFix] Panel ocultado');
            ultimaVezVisible = null;
            
            // Destruir gráficos cuando se oculta para liberar memoria
            if (window.panelControlUI && window.panelControlUI.destruirGraficos) {
                window.panelControlUI.destruirGraficos();
                console.log('   🧹 Gráficos destruidos para liberar memoria');
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
                if (panelEstaVisible() && !recargando) {
                    recargarPanel();
                }
            }, 800);
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
    }, 1000);
    
    console.log('✅ [PanelFix] v2.0 completamente activo');
    
    // Exponer función de limpieza globalmente
    window.recargarPanelControl = recargarPanel;
    
})();
