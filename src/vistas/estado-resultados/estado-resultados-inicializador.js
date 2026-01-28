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
                window.gestorEmpresas;

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

            // Escuchar evento de vista cargada
            document.addEventListener('vistaEstadoResultadosCargada', cargarDatosEnVista);

        } catch (error) {
            console.error('❌ [Inicializador ER] Error:', error);
        }
    }

    function cargarDatosEnVista() {
        console.log('👁️ [Inicializador ER] Vista cargada - Cargando datos...');

        // Esperar un momento para que todo esté renderizado
        setTimeout(() => {
            try {
                // Verificar que todo existe
                if (!window.estadoResultados || !window.estadoResultadosUI) {
                    console.warn('⚠️ [Inicializador ER] Módulos no disponibles');
                    return;
                }

                // Conectar configuración si falta
                if (!window.estadoResultados.configuracion && window.EstadoResultadosConfig) {
                    window.estadoResultados.configuracion = window.EstadoResultadosConfig;
                    console.log('🔧 [Inicializador ER] Configuración conectada');
                }

                // Calcular resultados
                window.estadoResultados.calcularResultados();
                console.log('📊 [Inicializador ER] Resultados calculados');

                // Cargar en UI
                setTimeout(() => {
                    window.estadoResultadosUI.cargarResultados();
                    console.log('✅ [Inicializador ER] Datos cargados en UI');
                }, 300);

            } catch (error) {
                console.error('❌ [Inicializador ER] Error cargando datos:', error);
            }
        }, 500);
    }

})();

// Listener adicional: cuando FlujoCaja esté listo
document.addEventListener('flujoCajaVisible', () => {
    console.log('💰 [Inicializador ER] FlujoCaja visible - Recargando datos');
    
    setTimeout(() => {
        if (window.estadoResultados && window.estadoResultadosUI) {
            if (!window.estadoResultados.configuracion) {
                window.estadoResultados.configuracion = window.EstadoResultadosConfig;
            }
            window.estadoResultados.calcularResultados();
            window.estadoResultadosUI.cargarResultados();
        }
    }, 1000);
});

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🚀 INICIALIZADOR ESTADO DE RESULTADOS v3.0 FINAL             ║
║  Simple, directo, sin complicaciones                         ║
╚═══════════════════════════════════════════════════════════════╝
`);
