/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL - SISTEMA DE PLANES
 * Maneja restricciones y funcionalidades por plan de suscripción
 * VERSION: 1.0.0
 * ═══════════════════════════════════════════════════════════════════
 */

window.PanelControlPlanes = (function() {
    'use strict';

    /**
     * Obtener funcionalidades disponibles según el plan actual
     */
    function obtenerFuncionalidades() {
        const planActual = window.FlujoCajaPlanes?.obtenerPlanActual();
        
        if (!planActual) {
            console.warn('⚠️ No se pudo obtener el plan actual');
            return obtenerFuncionalidadesDefault();
        }

        const planId = planActual.id;

        return {
            // Todos los planes tienen métricas básicas
            metricasBasicas: true,
            
            // Todos tienen el gráfico principal
            graficoPrincipal: true,
            
            // Gráficos secundarios desde Profesional
            graficosSecundarios: planId !== 'individual',
            
            // Exportar Excel desde Profesional
            exportarExcel: planId !== 'individual',
            
            // Personalización desde Empresarial
            personalizarDashboard: planId === 'empresarial' || planId === 'corporativo',
            
            // KPIs avanzados desde Empresarial
            kpisAvanzados: planId === 'empresarial' || planId === 'corporativo',
            
            // Análisis predictivo solo Corporativo
            analisisPredictivo: planId === 'corporativo',
            
            // Reportes automáticos solo Corporativo
            reportesAutomaticos: planId === 'corporativo'
        };
    }

    /**
     * Funcionalidades por defecto (Individual)
     */
    function obtenerFuncionalidadesDefault() {
        return {
            metricasBasicas: true,
            graficoPrincipal: true,
            graficosSecundarios: false,
            exportarExcel: false,
            personalizarDashboard: false,
            kpisAvanzados: false,
            analisisPredictivo: false,
            reportesAutomaticos: false
        };
    }

    /**
     * Aplicar restricciones visuales según el plan
     */
    function aplicarRestricciones() {
        console.log('🔒 Aplicando restricciones de plan al Panel de Control...');
        
        const funcionalidades = obtenerFuncionalidades();
        const planActual = window.FlujoCajaPlanes?.obtenerPlanActual();
        
        // Gráficos secundarios
        const graficosSecundarios = document.querySelectorAll('.grafico-tarjeta:not(.principal)');
        
        if (funcionalidades.graficosSecundarios) {
            graficosSecundarios.forEach(g => {
                g.style.display = 'flex';
                g.classList.remove('bloqueado');
            });
        } else {
            graficosSecundarios.forEach(g => {
                g.style.display = 'none';
            });
        }

        // Botón de exportar
        const btnExportar = document.querySelector('[onclick*="exportarPanelControl"]');
        if (btnExportar) {
            if (funcionalidades.exportarExcel) {
                btnExportar.style.display = 'flex';
                btnExportar.disabled = false;
            } else {
                btnExportar.style.display = 'none';
            }
        }

        // Botón de personalizar
        const btnPersonalizar = document.querySelector('[onclick*="dashboardPersonalizable"]');
        if (btnPersonalizar) {
            if (funcionalidades.personalizarDashboard) {
                btnPersonalizar.style.display = 'flex';
                btnPersonalizar.disabled = false;
            } else {
                btnPersonalizar.style.display = 'none';
            }
        }

        console.log(`✅ Restricciones aplicadas para plan: ${planActual?.nombre || 'Individual'}`);
    }

    /**
     * Verificar si el usuario tiene acceso a una funcionalidad
     */
    function tieneFuncionalidad(funcionalidad) {
        const funcionalidades = obtenerFuncionalidades();
        return funcionalidades[funcionalidad] === true;
    }

    /**
     * Mostrar modal de upgrade cuando se intenta usar función bloqueada
     */
    function mostrarModalUpgrade(funcionalidad) {
        const planActual = window.FlujoCajaPlanes?.obtenerPlanActual();
        
        // Determinar plan requerido
        let planRequerido = 'profesional';
        
        if (funcionalidad === 'personalizarDashboard' || 
            funcionalidad === 'kpisAvanzados') {
            planRequerido = 'empresarial';
        } else if (funcionalidad === 'analisisPredictivo' || 
                   funcionalidad === 'reportesAutomaticos') {
            planRequerido = 'corporativo';
        }

        // Usar el modal del sistema de planes si existe
        if (window.FlujoCajaPlanes?.mostrarModalUpgrade) {
            window.FlujoCajaPlanes.mostrarModalUpgrade(funcionalidad, planRequerido);
        } else {
            alert(`Esta funcionalidad requiere el plan ${planRequerido.toUpperCase()}`);
        }
    }

    /**
     * Inicializar sistema de planes
     */
    function inicializar() {
        console.log('📊 Inicializando sistema de planes del Panel de Control...');
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(aplicarRestricciones, 500);
            });
        } else {
            setTimeout(aplicarRestricciones, 500);
        }

        // Escuchar cambio de plan
        document.addEventListener('grizalumPlanCambiado', () => {
            console.log('🔄 Plan cambiado, reaplica restricciones...');
            setTimeout(aplicarRestricciones, 200);
        });

        // Escuchar cuando el panel se inicializa
        document.addEventListener('grizalumPanelControlInicializado', () => {
            console.log('📊 Panel inicializado, aplicando restricciones...');
            setTimeout(aplicarRestricciones, 300);
        });

        console.log('✅ Sistema de planes del Panel de Control listo');
    }

    // Auto-inicializar
    inicializar();

    // API Pública
    return {
        obtenerFuncionalidades,
        aplicarRestricciones,
        tieneFuncionalidad,
        mostrarModalUpgrade,
        inicializar
    };
})();

console.log('✅ Panel Control Planes v1.0.0 cargado');
