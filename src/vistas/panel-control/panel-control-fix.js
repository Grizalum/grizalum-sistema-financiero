/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL - FIX DE RECARGA
 * Asegura que todo se recargue correctamente al volver al panel
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    console.log('🛡️ [PanelFix] Sistema de recarga iniciado');
    
    let ultimaVezVisible = null;
    
    /**
     * Verificar si el panel está visible
     */
    function panelEstaVisible() {
        const contenedor = document.querySelector('.panel-control-contenedor');
        return contenedor && contenedor.offsetParent !== null;
    }
    
    /**
     * Forzar recarga completa del panel
     */
    function forzarRecarga() {
        if (!panelEstaVisible()) return;
        
        console.log('🔄 [PanelFix] Forzando recarga...');
        
        // Recargar datos
        if (window.panelControlUI) {
            setTimeout(() => {
                try {
                    window.panelControlUI.cargarDatos();
                    console.log('✅ [PanelFix] Datos recargados');
                } catch (e) {
                    console.error('❌ [PanelFix] Error cargando datos:', e);
                }
            }, 500);
            
            // Reinicializar gráficos
            setTimeout(() => {
                try {
                    window.panelControlUI.inicializarGraficos();
                    console.log('✅ [PanelFix] Gráficos reinicializados');
                } catch (e) {
                    console.error('❌ [PanelFix] Error con gráficos:', e);
                }
            }, 1000);
        }
        
        // Actualizar banner
        if (window.PanelBanner) {
            setTimeout(() => {
                try {
                    window.PanelBanner.actualizarBanner?.();
                    console.log('✅ [PanelFix] Banner actualizado');
                } catch (e) {
                    console.error('❌ [PanelFix] Error con banner:', e);
                }
            }, 300);
        }
    }
    
    /**
     * Observer para detectar cuando el panel se hace visible
     */
    const observer = new MutationObserver(() => {
        const visible = panelEstaVisible();
        
        if (visible && !ultimaVezVisible) {
            console.log('👁️ [PanelFix] Panel ahora visible, recargando...');
            ultimaVezVisible = Date.now();
            forzarRecarga();
        } else if (!visible && ultimaVezVisible) {
            console.log('👁️‍🗨️ [PanelFix] Panel oculto');
            ultimaVezVisible = null;
        }
    });
    
    // Iniciar observer
    setTimeout(() => {
        const contenedor = document.getElementById('contenedorVistas') || document.body;
        observer.observe(contenedor, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        console.log('✅ [PanelFix] Observer activado');
    }, 500);
    
    // Escuchar clicks en el botón Panel de Control
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-section="dashboard"]');
        if (target) {
            console.log('🖱️ [PanelFix] Click en Panel de Control detectado');
            setTimeout(forzarRecarga, 1500);
        }
    });
    
    // Verificación periódica
    setInterval(() => {
        if (panelEstaVisible()) {
            const contenedor = document.querySelector('.panel-control-contenedor');
            const canvas = contenedor?.querySelector('canvas');
            
            // Si el panel está visible pero no hay gráficos, recargar
            if (contenedor && !canvas) {
                console.log('⚠️ [PanelFix] Panel sin gráficos, recargando...');
                forzarRecarga();
            }
        }
    }, 2000);
    
    console.log('✅ [PanelFix] Sistema completo activo');
})();
