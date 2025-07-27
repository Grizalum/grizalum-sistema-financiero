/**
 * ================================================================
 * GRIZALUM CHARTS MANAGER - VERSIÓN PROFESIONAL 2.0
 * Sistema modular y escalable de gráficos Chart.js
 * ================================================================
 */

// Importar configuración (cuando esté disponible)
// import { GRIZALUM_CONFIG, CHART_CONFIGS } from './config.js';

class GrizalumChartsManager {
    constructor() {
        this.charts = new Map();
        this.isInitialized = false;
        this.config = {
            enabled: ['cashFlow', 'expenses', 'revenue', 'aging', 'cashFlowDetail'],
            containers: {
                cashFlow: 'cashFlowChart',
                expenses: 'expensesChart',
                revenue: 'revenueChart',
                aging: 'agingChart',
                cashFlowDetail: 'cashFlowDetailChart'
            }
        };
    }

    async initialize() {
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js no está disponible');
            return false;
        }

        console.log('📊 Inicializando GRIZALUM Charts Manager v2.0');
        
        try {
            this.configureGlobalSettings();
            await this.initializeAllCharts();
            this.isInitialized = true;
            
            console.log('✅ Charts Manager inicializado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Charts Manager:', error);
            return false;
        }
    }

    configureGlobalSettings() {
        Chart.defaults.font.family = 'Inter, sans-serif';
        Chart.defaults.color = '#64748b';
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
    }

    async initializeAllCharts() {
        const promises = this.config.enabled.map(async (chartType) => {
            try {
                await this.createChart(chartType);
                console.log(`✅ Gráfico creado: ${chartType}`);
            } catch (error) {
                console.warn(`⚠️ No se pudo crear gráfico ${chartType}:`, error);
            }
        });

        await Promise.all(promises);
    }

    async createChart(type) {
        const containerId = this.config.containers[type];
        const ctx = document.getElementById(containerId);

        if (!ctx) {
            throw new Error(`Contenedor no encontrado: ${containerId}`);
        }

        const chartConfig = this.getChartConfig(type);
        if (!chartConfig) {
            throw new Error(`Configuración no encontrada para: ${type}`);
        }

        const chart = new Chart(ctx, chartConfig);
        this.charts.set(type, chart);

        return chart;
    }

    getChartConfig(type) {
        const configs = {
            cashFlow: this.getCashFlowConfig(),
            expenses: this.getExpensesConfig(),
            revenue: this.getRevenueConfig(),
            aging: this.getAgingConfig(),
            cashFlowDetail: this.getCashFlowDetailConfig()
        };

        return configs[type] || null;
    }

    // Configuraciones específicas de cada gráfico
    getCashFlowConfig() {
        return {
            type: 'line',
            data: {
                labels: ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero'],
                datasets: [{
                    label: 'Ingresos',
                    data: [2200000, 2350000, 2180000, 2420000, 2650000, 2847293],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }, {
                    label: 'Gastos',
                    data: [1800000, 1850000, 1780000, 1920000, 1850000, 1892847],
                    borderColor: '#ed8936',
                    backgroundColor: 'rgba(237, 137, 54, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ed8936',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 20 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    },
                    x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } }
                }
            }
        };
    }

    getExpensesConfig() {
        return {
            type: 'doughnut',
            data: {
                labels: ['Nómina', 'Marketing', 'Operaciones', 'Tecnología', 'Otros'],
                datasets: [{
                    data: [45, 20, 15, 12, 8],
                    backgroundColor: ['#667eea', '#ed8936', '#48bb78', '#f093fb', '#a0aec0'],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { usePointStyle: true, padding: 15 }
                    }
                }
            }
        };
    }

    getRevenueConfig() {
        return {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Ingresos',
                    data: [35000, 38000, 42000, 39000, 44000, 40300, 45200],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Gastos',
                    data: [28000, 29500, 31000, 30200, 32500, 30200, 28700],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { usePointStyle: true, font: { weight: 'bold' } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        };
    }

    getAgingConfig() {
        return {
            type: 'bar',
            data: {
                labels: ['0-30 días', '31-60 días', '61-90 días', '+90 días'],
                datasets: [{
                    label: 'Monto (S/.)',
                    data: [18200, 9800, 3200, 1600],
                    backgroundColor: ['#059669', '#f59e0b', '#d97706', '#dc2626'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        };
    }

    getCashFlowDetailConfig() {
        return {
            type: 'line',
            data: {
                labels: ['1 Jul', '5 Jul', '10 Jul', '15 Jul', '20 Jul', '25 Jul', '30 Jul'],
                datasets: [{
                    label: 'Saldo Diario',
                    data: [15000, 18500, 22000, 17800, 21500, 19800, 24500],
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#059669',
                    pointBorderWidth: 3,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { usePointStyle: true, font: { weight: 'bold' } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        };
    }

    // API pública
    getChart(type) {
        return this.charts.get(type);
    }

    updateChart(type, newData) {
        const chart = this.charts.get(type);
        if (chart && newData) {
            chart.data = { ...chart.data, ...newData };
            chart.update();
        }
    }

    destroyChart(type) {
        const chart = this.charts.get(type);
        if (chart) {
            chart.destroy();
            this.charts.delete(type);
        }
    }

    destroyAll() {
        this.charts.forEach((chart) => chart.destroy());
        this.charts.clear();
        this.isInitialized = false;
    }
}

// Crear instancia global
const grizalumChartsManager = new GrizalumChartsManager();

// Función de compatibilidad (para el HTML actual)
function initializeCharts() {
    return grizalumChartsManager.initialize();
}

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    grizalumChartsManager.initialize();
});

// Exportar globalmente
window.GrizalumChartsManager = grizalumChartsManager;

console.log('📈 GRIZALUM Charts Manager v2.0 cargado');
