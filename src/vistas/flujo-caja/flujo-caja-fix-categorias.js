/**
 * GRIZALUM - Fix de carga automática de categorías
 * Refuerza la inicialización del módulo principal
 */

(function() {
    'use strict';
    
    console.log('🔧 Fix categorías cargado');
    
    function forzarCargaCategorias() {
        if (window.GRIZALUM_inicializarCategorias) {
            console.log('✅ [Fix] Ejecutando GRIZALUM_inicializarCategorias()');
            window.GRIZALUM_inicializarCategorias();
            return true;
        }
        return false;
    }
    
    // Ejecutar varias veces para asegurar
    setTimeout(forzarCargaCategorias, 300);
    setTimeout(forzarCargaCategorias, 800);
    setTimeout(forzarCargaCategorias, 1500);
    
    // Escuchar eventos
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail && e.detail.to === 'flujo-caja') {
            console.log('🔄 [Fix] Sección cambiada, recargando categorías');
            setTimeout(forzarCargaCategorias, 300);
        }
    });
    
    window.addEventListener('flujoCajaVisible', function() {
        console.log('🔄 [Fix] Evento flujoCajaVisible, recargando categorías');
        setTimeout(forzarCargaCategorias, 300);
    });
    
    console.log('✅ [Fix] Protección de categorías activada');
})();
