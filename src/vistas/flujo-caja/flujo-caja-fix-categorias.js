/**
 * GRIZALUM - Fix de carga automática de categorías
 * Asegura que las categorías se carguen al iniciar
 */

(function() {
    'use strict';
    
    console.log('🔧 Fix categorías cargado v2');
    
    function forzarCargaCategorias() {
        // Usar la función global expuesta por flujo-caja-categorias.js
        if (window.GRIZALUM_inicializarCategorias) {
            console.log('✅ Ejecutando GRIZALUM_inicializarCategorias()');
            window.GRIZALUM_inicializarCategorias();
            return true;
        }
        return false;
    }
    
    // Ejecutar inmediatamente
    setTimeout(() => {
        let intentos = 0;
        const intervalo = setInterval(() => {
            intentos++;
            if (forzarCargaCategorias()) {
                clearInterval(intervalo);
                console.log('✅ Categorías inicializadas automáticamente');
            } else if (intentos >= 20) {
                clearInterval(intervalo);
                console.warn('⚠️ No se pudo forzar carga de categorías');
            }
        }, 200);
    }, 500);
    
    // También al cambiar a flujo-caja
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail && e.detail.to === 'flujo-caja') {
            console.log('🔄 Sección cambiada a flujo-caja, recargando categorías');
            setTimeout(forzarCargaCategorias, 300);
        }
    });
    
    // Y al evento específico de flujo-caja
    window.addEventListener('flujoCajaVisible', function() {
        console.log('🔄 Evento flujoCajaVisible, recargando categorías');
        setTimeout(forzarCargaCategorias, 300);
    });
})();
