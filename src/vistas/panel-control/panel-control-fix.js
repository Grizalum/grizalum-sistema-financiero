/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL - FIX DE RECARGA
 * Asegura que todo se recargue correctamente al volver al panel
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    console.log('🛡️ [PanelFix] Sistema de recarga iniciado');
    
    // ✅ SCROLL AUTOMÁTICO ARRIBA
    setInterval(() => {
        const contenedorVistas = document.getElementById('contenedorVistas');
        const panelVisible = document.querySelector('.panel-control-contenedor');
        
        if (panelVisible && contenedorVistas && contenedorVistas.scrollTop > 100) {
            contenedorVistas.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 500);
    
    let ultimaVezVisible = null;
    
    function panelEstaVisible() {
        const contenedor = document.querySelector('.panel-control-contenedor');
        return contenedor && contenedor.offsetParent !== null;
    }
    
    function forzarRecarga() {
        if (!panelEstaVisible()) return;
        
        console.log('🔄 [PanelFix] Forzando recarga...');
        
        // Forzar scroll arriba
        const contenedorVistas = document.getElementById('contenedorVistas');
        if (contenedorVistas) {
            contenedorVistas.scrollTo({ top: 0, behavior: 'instant' });
        }
        
        // Recargar datos
        if (window.panelControlUI) {
            setTimeout(() => {
                try {
                    window.panelControlUI.cargarDatos();
                    console.log('✅ [PanelFix] Datos recargados');
                } catch (e) {
                    console.error('❌ [PanelFix] Error:', e);
                }
            }, 500);
            
            setTimeout(() => {
                try {
                    window.panelControlUI.inicializarGraficos();
                    console.log('✅ [PanelFix] Gráficos reinicializados');
                } catch (e) {
                    console.error('❌ [PanelFix] Error con gráficos:', e);
                }
            }, 1000);
        }
    }
    
    const observer = new MutationObserver(() => {
        const visible = panelEstaVisible();
        
        if (visible && !ultimaVezVisible) {
            console.log('👁️ [PanelFix] Panel visible');
            ultimaVezVisible = Date.now();
            forzarRecarga();
        } else if (!visible) {
            ultimaVezVisible = null;
        }
    });
    
    setTimeout(() => {
        const contenedor = document.getElementById('contenedorVistas') || document.body;
        observer.observe(contenedor, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }, 500);
    
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-section="dashboard"]');
        if (target) {
            setTimeout(forzarRecarga, 1500);
        }
    });
    
    console.log('✅ [PanelFix] Sistema activo');
})();
