/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - CONFIGURACIÓN MAESTRA DE PLANES
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Este archivo define QUÉ puede hacer cada plan en cada módulo.
 * 
 * CUANDO AGREGUES NUEVAS FUNCIONES:
 * 1. Agrégalas aquí con su plan requerido
 * 2. El sistema las bloqueará/desbloqueará automáticamente
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

window.GrizalumRestricciones = {
    
    // ═══════════════════════════════════════════════════════════════
    // FLUJO DE CAJA
    // ═══════════════════════════════════════════════════════════════
    flujoCaja: {
        nuevaTransaccion: 'individual',     // ✅ Todos pueden agregar
        buscarMovimientos: 'profesional',   // 🔒 Desde Profesional
        graficos: 'profesional',            // 🔒 Desde Profesional
        exportarExcel: 'profesional',       // 🔒 Desde Profesional
        filtrosAvanzados: 'empresarial',    // 🔒 Desde Empresarial
        multiEmpresa: 'empresarial',        // 🔒 Desde Empresarial
        asistentIA: 'corporativo'           // 🔒 Solo Corporativo
    },
    
    // ═══════════════════════════════════════════════════════════════
    // PANEL DE CONTROL
    // ═══════════════════════════════════════════════════════════════
    panelControl: {
        metricasBasicas: 'individual',           // ✅ 4 métricas principales
        graficoFlujoCaja: 'profesional',         // 🔒 Gráfico principal
        graficoDistribucion: 'profesional',      // 🔒 Dona de gastos
        graficoComparativo: 'empresarial',       // 🔒 Ingresos vs Gastos
        graficoTendencias: 'corporativo',        // 🔒 Tendencia mensual
        exportarExcel: 'profesional',            // 🔒 Desde Profesional
        personalizarDashboard: 'corporativo'     // 🔒 Solo Corporativo
    },
    
    // ═══════════════════════════════════════════════════════════════
    // ESTADO DE RESULTADOS
    // ═══════════════════════════════════════════════════════════════
    estadoResultados: {
        modulo: 'profesional',              // 🔒 Módulo completo desde Profesional
        exportarPDF: 'empresarial',         // 🔒 PDF desde Empresarial
        comparativoAnual: 'empresarial'     // 🔒 Desde Empresarial
    },
    
    // ═══════════════════════════════════════════════════════════════
    // BALANCE GENERAL
    // ═══════════════════════════════════════════════════════════════
    balanceGeneral: {
        modulo: 'empresarial',              // 🔒 Módulo completo desde Empresarial
        exportar: 'empresarial'
    },
    
    // ═══════════════════════════════════════════════════════════════
    // CUENTAS BANCARIAS
    // ═══════════════════════════════════════════════════════════════
    cuentasBancarias: {
        modulo: 'empresarial',              // 🔒 Módulo completo desde Empresarial
        multiBanco: 'corporativo'           // 🔒 Múltiples bancos solo Corporativo
    },
    
    // ═══════════════════════════════════════════════════════════════
    // INVENTARIO
    // ═══════════════════════════════════════════════════════════════
    inventario: {
        modulo: 'corporativo'               // 🔒 Solo Corporativo
    },
    
    // ═══════════════════════════════════════════════════════════════
    // VENTAS
    // ═══════════════════════════════════════════════════════════════
    ventas: {
        modulo: 'corporativo'               // 🔒 Solo Corporativo
    },
    
    // ═══════════════════════════════════════════════════════════════
    // FUNCIONES AUXILIARES
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Verifica si el usuario puede usar una función específica
     */
    puedeusar(modulo, funcion) {
        const planActual = localStorage.getItem('grizalum_planActual') || 'individual';
        const planes = ['individual', 'profesional', 'empresarial', 'corporativo'];
        
        const restricciones = this[modulo];
        if (!restricciones) return false;
        
        const planRequerido = restricciones[funcion];
        if (!planRequerido) return false;
        
        const nivelActual = planes.indexOf(planActual);
        const nivelRequerido = planes.indexOf(planRequerido);
        
        return nivelActual >= nivelRequerido;
    },
    
    /**
     * Oculta elementos según plan
     */
    aplicarRestricciones(modulo) {
        const restricciones = this[modulo];
        if (!restricciones) return;
        
        Object.keys(restricciones).forEach(funcion => {
            if (funcion === 'modulo') return;
            
            const puede = this.puedeusar(modulo, funcion);
            const elemento = document.getElementById(`${modulo}-${funcion}`);
            
            if (elemento) {
                if (!puede) {
                    elemento.style.display = 'none';
                    // Agregar badge de "Premium"
                    const badge = document.createElement('div');
                    badge.className = 'premium-badge';
                    badge.textContent = `🔒 ${restricciones[funcion]}`;
                    elemento.parentElement?.appendChild(badge);
                }
            }
        });
    }
};

console.log('✅ Sistema de restricciones cargado');
