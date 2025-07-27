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
