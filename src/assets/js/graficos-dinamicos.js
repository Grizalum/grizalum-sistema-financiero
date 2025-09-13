/**
 * ================================================================
 * GRIZALUM EXTENSIÓN DE GRÁFICOS DINÁMICOS v1.1 - CORREGIDA
 * Complemento que extiende el sistema de gráficos existente
 * NO MODIFICA EL ARCHIVO GRAFICOS.JS ORIGINAL
 * ================================================================
 */

class GraficosExtension {
    constructor() {
        this.version = '1.1.0';
        this.initialized = false;
        this.chartExtensions = {};
        
        this.init();
    }

    init() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.finalizarInicializacion());
                return;
            }
            this.finalizarInicializacion();
        } catch (error) {
            console.error('[GRÁFICOS-EXT] Error en inicialización:', error);
        }
    }

    finalizarInicializacion() {
        try {
            // Esperar a que el sistema original esté listo
            this.esperarSistemaOriginal();
            
        } catch (error) {
            console.error('[GRÁFICOS-EXT] Error finalizando inicialización:', error);
        }
    }

    esperarSistemaOriginal() {
        const checkSistema = () => {
            // Verificar que Chart.js y el sistema de datos estén listos
            if (typeof Chart !== 'undefined' && window.obtenerDatosActuales) {
                this.extenderSistemaExistente();
                this.initialized = true;
                console.log('✅ Extensión de gráficos dinámicos inicializada');
            } else {
                setTimeout(checkSistema, 500);
            }
        };
        
        checkSistema();
        // Crear función obtener datos si no existe
        this.crearFuncionObtenerDatos();
    }

    crearFuncionObtenerDatos() {
        if (!window.obtenerDatosActuales) {
            window.obtenerDatosActuales = () => this.obtenerDatosDesdeMetricas();
            console.log('[GRÁFICOS-EXT] Función obtenerDatosActuales creada');
        }
    }

    extenderSistemaExistente() {
        // Crear función global de actualización que no interfiera
        if (!window.actualizarGraficosDinamicos) {
            window.actualizarGraficosDinamicos = () => this.actualizarTodosLosGraficos();
        }

        // Extender función de actualización existente
        this.extenderFuncionActualizacion();

        // Conectar con eventos de cambio de empresa/período
        this.conectarEventos();
    }

    extenderFuncionActualizacion() {
        // Si ya existe una función de actualización, la extendemos
        const funcionOriginal = window.actualizarGraficos;
        
        window.actualizarGraficos = () => {
            // Ejecutar función original si existe
            if (funcionOriginal && typeof funcionOriginal === 'function') {
                try {
                    funcionOriginal();
                } catch (error) {
                    console.warn('[GRÁFICOS-EXT] Error en función original:', error);
                }
            }
            
            // Ejecutar nuestra extensión
            this.actualizarTodosLosGraficos();
        };
    }

    conectarEventos() {
        // Observar cambios en el DOM para detectar actualizaciones
        this.observarCambiosEmpresa();
        this.observarCambiosPeriodo();
    }

    observarCambiosEmpresa() {
        // Observar cambios en el selector de empresas
        const observer = new MutationObserver(() => {
            this.actualizarTodosLosGraficos();
        });

        const selectorEmpresas = document.getElementById('companySelector');
        if (selectorEmpresas) {
            observer.observe(selectorEmpresas, { 
                childList: true, 
                subtree: true 
            });
        }
    }

    observarCambiosPeriodo() {
        // Observar clics en botones de período
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => this.actualizarTodosLosGraficos(), 100);
            });
        });
    }

    actualizarTodosLosGraficos() {
        try {
            const datos = window.obtenerDatosActuales() || this.obtenerDatosDesdeMetricas();
            if (!datos) {
                console.warn('[GRÁFICOS-EXT] No hay datos disponibles');
                return;
            }

            // Actualizar cada gráfico específico
            this.actualizarGraficoSiExiste('mainCashFlowChart', datos.graficos.flujoMeses, 'line');
            this.actualizarGraficoSiExiste('expensesChart', datos.graficos.gastosDistribucion, 'doughnut');
            this.actualizarGraficoSiExiste('revenueChart', datos.graficos.ingresosVsGastos, 'bar');
            this.actualizarGraficoSiExiste('agingChart', datos.graficos.antiguedadCuentas, 'pie');
            this.actualizarGraficoSiExiste('cashFlowDetailChart', datos.graficos.flujoDiario, 'line');

            console.log('[GRÁFICOS-EXT] Gráficos actualizados dinámicamente');

        } catch (error) {
            console.error('[GRÁFICOS-EXT] Error actualizando gráficos:', error);
        }
    }

    actualizarGraficoSiExiste(canvasId, nuevosdatos, tipoGrafico) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Buscar instancia de Chart existente
        const chart = Chart.getChart(canvas);
        if (!chart) {
            // Si no existe, crear uno nuevo
            this.crearGraficoNuevo(canvasId, nuevosdatos, tipoGrafico);
            return;
        }

        // Actualizar datos del gráfico existente
        try {
            if (tipoGrafico === 'line' || tipoGrafico === 'bar') {
               chart.data.datasets[0].data = nuevosdatos;
            } else if (tipoGrafico === 'doughnut' || tipoGrafico === 'pie') {
                // Para gráficos circulares
                chart.data.datasets[0].data = nuevosdatos;
            }

            chart.update('active');

        } catch (error) {
            console.warn(`[GRÁFICOS-EXT] Error actualizando ${canvasId}:`, error);
        }
    }

    crearGraficoNuevo(canvasId, datos, tipo) {
        // Solo crear si no existe el gráfico
        const canvas = document.getElementById(canvasId);
        if (!canvas || Chart.getChart(canvas)) return;

        const configuraciones = this.obtenerConfiguracionGrafico(canvasId, datos, tipo);
        
        try {
            new Chart(canvas, configuraciones);
            console.log(`[GRÁFICOS-EXT] Gráfico ${canvasId} creado`);
        } catch (error) {
            console.error(`[GRÁFICOS-EXT] Error creando ${canvasId}:`, error);
        }
    }

    obtenerDatosDesdeMetricas() {
        // Conectar con el actualizador de métricas existente
        const metricas = window.GrizalumMetrics ? window.GrizalumMetrics.getCurrentMetrics() : null;
        
        if (!metricas) {
            // Datos por defecto si no hay métricas
            return this.generarDatosPorDefecto();
        }

        // Convertir métricas a formato de gráficos
        return {
            graficos: {
                flujoMeses: [0, 0, 0, 0, 0, 0],
                gastosDistribucion: [0, 0, 0, 0, 0],
                ingresosVsGastos: [
                    metricas.revenueValue?.value || 0,
                    metricas.expensesValue?.value || 0,
                    metricas.profitValue?.value || 0
                ],
                antiguedadCuentas: [0, 0, 0, 0],
                flujoDiario: [0, 0, 0, 0, 0, 0, 0]
            }
        };
    }

    generarDatosPorDefecto() {
        return {
            graficos: {
                flujoMeses: [0, 0, 0, 0, 0, 0],
                gastosDistribucion: [0, 0, 0, 0, 0],
                ingresosVsGastos: [0, 0, 0],
                antiguedadCuentas: [0, 0, 0, 0],
                flujoDiario: [0, 0, 0, 0, 0, 0, 0]
            }
        };
    }

    obtenerConfiguracionGrafico(canvasId, datos, tipo) {
        const configuracionesBase = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: tipo !== 'line'
                }
            }
        };

        switch (canvasId) {
            case 'mainCashFlowChart':
                return {
                    type: 'line',
                    data: {
                        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Flujo de Caja',
                            data: datos,
                            borderColor: '#d4af37',
                            backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: configuracionesBase
                };

            case 'expensesChart':
                return {
                    type: 'doughnut',
                    data: {
                        labels: ['Personal', 'Operaciones', 'Marketing', 'Admin', 'Otros'],
                        datasets: [{
                            data: datos,
                            backgroundColor: ['#d4af37', '#fbbf24', '#f59e0b', '#d97706', '#92400e']
                        }]
                    },
                    options: configuracionesBase
                };

            case 'revenueChart':
                return {
                    type: 'bar',
                    data: {
                        labels: ['Ingresos', 'Gastos', 'Utilidad'],
                        datasets: [{
                            data: datos,
                            backgroundColor: ['#10b981', '#ef4444', '#d4af37']
                        }]
                    },
                    options: configuracionesBase
                };

            case 'agingChart':
                return {
                    type: 'pie',
                    data: {
                        labels: ['0-30 días', '31-60 días', '61-90 días', '+90 días'],
                        datasets: [{
                            data: datos,
                            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280']
                        }]
                    },
                    options: configuracionesBase
                };

            case 'cashFlowDetailChart':
                return {
                    type: 'line',
                    data: {
                        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                        datasets: [{
                            label: 'Flujo Diario',
                            data: datos,
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            fill: true
                        }]
                    },
                    options: configuracionesBase
                };

            default:
                return null;
        }
    }

    // Método público para forzar actualización
    forzarActualizacion() {
        console.log('[GRÁFICOS-EXT] Forzando actualización de gráficos...');
        setTimeout(() => this.actualizarTodosLosGraficos(), 100);
    }

    // Método para verificar estado
    verificarEstado() {
        const charts = [];
        ['mainCashFlowChart', 'expensesChart', 'revenueChart', 'agingChart', 'cashFlowDetailChart'].forEach(id => {
            const canvas = document.getElementById(id);
            const chart = canvas ? Chart.getChart(canvas) : null;
            charts.push({
                id,
                existe: !!canvas,
                tieneGrafico: !!chart
            });
        });
        
        console.log('[GRÁFICOS-EXT] Estado de gráficos:', charts);
        return charts;
    }
}

// INICIALIZACIÓN AUTOMÁTICA
let graficosExtension = null;

function inicializarExtensionGraficos() {
    try {
        if (graficosExtension) {
            console.log('🟡 Extensión de gráficos ya inicializada');
            return;
        }
        
        graficosExtension = new GraficosExtension();
        
        // Hacer disponible globalmente
        window.graficosExtension = graficosExtension;
        window.forzarActualizacionGraficos = () => graficosExtension.forzarActualizacion();
        
        console.log('✅ EXTENSIÓN DE GRÁFICOS DINÁMICOS INICIALIZADA v1.1');
        
    } catch (error) {
        console.error('❌ Error inicializando extensión de gráficos:', error);
    }
}

// Inicialización con retardo para no interferir con el sistema original
setTimeout(() => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(inicializarExtensionGraficos, 1000);
        });
    } else {
        setTimeout(inicializarExtensionGraficos, 1000);
    }
}, 500);

console.log('📊 Extensión de gráficos dinámicos v1.1 CORREGIDA cargada');
