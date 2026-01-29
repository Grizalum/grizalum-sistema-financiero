/**
 * ═══════════════════════════════════════════════════════════════════
 * ESTADO DE RESULTADOS - INICIALIZADOR SIMPLE Y DIRECTO
 * Sin loops, sin timeouts, sin complicaciones
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('🚀 [Inicializador ER] Módulo cargado v3.0');

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }

    function iniciar() {
        // Verificar dependencias cada 200ms
        const intervalo = setInterval(() => {
            
            const listo = 
              window.EstadoResultados &&
              window.EstadoResultadosUI &&
              window.EstadoResultadosConfig &&
              window.gestorEmpresas &&
              window.flujoCaja &&
              window.flujoCaja.inicializado;

            if (listo) {
                clearInterval(intervalo);
                inicializarModulos();
            }
        }, 200);

        // Timeout de seguridad (10 segundos)
        setTimeout(() => {
            clearInterval(intervalo);
        }, 10000);
    }

    function inicializarModulos() {
        try {
            console.log('✅ [Inicializador ER] Dependencias listas');

            // Crear módulo principal si no existe
            if (!window.estadoResultados) {
                window.estadoResultados = new window.EstadoResultados();
            }

            // SIEMPRE crear nueva instancia de UI
            window.estadoResultadosUI = new window.EstadoResultadosUI();

            console.log('🎉 [Inicializador ER] Sistema inicializado');
            
        } catch (error) {
            console.error('❌ [Inicializador ER] Error:', error);
        }
    }

})();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🚀 INICIALIZADOR ESTADO DE RESULTADOS v3.0 FINAL             ║
║  Simple, directo, sin complicaciones                         ║
╚═══════════════════════════════════════════════════════════════╝
`);
