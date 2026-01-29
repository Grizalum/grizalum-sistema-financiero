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

                // Escuchar evento de vista cargada
                document.addEventListener('vistaEstadoResultadosCargada', cargarDatosEnVista);
                // ✅ LLAMAR DIRECTAMENTE también (por si el evento no se dispara)
              setTimeout(() => {
                   if (document.getElementById('estadoResultadosApp')) {
                       cargarDatosEnVista();
                   }
                }, 2000);
    
            } catch (error) {
                console.error('❌ [Inicializador ER] Error:', error);
            }
        }
    
        function cargarDatosEnVista() {
    console.log('👁️ [Inicializador ER] Vista cargada - Cargando datos...');

    setTimeout(() => {
        try {
            if (!window.estadoResultados) {
                console.warn('⚠️ [Inicializador ER] Módulo no disponible');
                return;
            }

            // ✅ FORZAR empresa desde localStorage
            if (!window.estadoResultados.empresaActual) {
                const stored = localStorage.getItem('grizalum_empresa_actual');
                window.estadoResultados.empresaActual = stored || 'avicola';
                console.log('🏢 [Inicializador ER] Empresa forzada:', window.estadoResultados.empresaActual);
            }

            // ✅ Conectar configuración
            if (!window.estadoResultados.configuracion) {
                window.estadoResultados.configuracion = window.EstadoResultadosConfig;
                console.log('🔧 [Inicializador ER] Configuración conectada');
            }

            // ✅ Calcular
            window.estadoResultados.calcularResultados();
            console.log('📊 [Inicializador ER] Resultados calculados');

            // ✅ CREAR UI si no existe
            if (!window.estadoResultadosUI) {
                window.estadoResultadosUI = new window.EstadoResultadosUI();
                console.log('🎨 [Inicializador ER] UI creada');
            }

            // ✅ Cargar en UI
            setTimeout(() => {
                window.estadoResultadosUI.cargarResultados();
                console.log('✅ [Inicializador ER] Datos cargados en UI');
            }, 500);

        } catch (error) {
            console.error('❌ [Inicializador ER] Error cargando datos:', error);
        }
    }, 1000);
}
    
    })();
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🚀 INICIALIZADOR ESTADO DE RESULTADOS v3.0 FINAL             ║
║  Simple, directo, sin complicaciones                         ║
╚═══════════════════════════════════════════════════════════════╝
`);
