/**
 * GRIZALUM - Fix de carga automática de categorías
 * Asegura que las categorías se carguen al iniciar
 */

(function() {
    'use strict';
    
    console.log('🔧 Fix categorías cargado');
    
    function cargarCategoriasInicial() {
        if (!window.flujoCajaCategorias || !window.flujoCajaUI) {
            return false;
        }
        
        if (window.flujoCajaCategorias.inicializar) {
            window.flujoCajaCategorias.inicializar();
        }
        
        if (window.flujoCajaUI.cargarCategorias) {
            window.flujoCajaUI.cargarCategorias();
        }
        
        if (window.flujoCajaUI.inicializarCategorias) {
            window.flujoCajaUI.inicializarCategorias();
        }
        
        return true;
    }
    
    setTimeout(() => {
        let intentos = 0;
        const intervalo = setInterval(() => {
            intentos++;
            if (cargarCategoriasInicial()) {
                clearInterval(intervalo);
                console.log('✅ Categorías cargadas automáticamente');
            } else if (intentos >= 20) {
                clearInterval(intervalo);
                console.warn('⚠️ Timeout cargando categorías');
            }
        }, 200);
    }, 500);
    
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.to === 'flujo-caja') {
            setTimeout(cargarCategoriasInicial, 300);
        }
    });
})();
