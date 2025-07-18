// ===================================================================
// GRIZALUM - Charts Module
// Funciones específicas para gráficos y visualizaciones
// ===================================================================

// Configuración global de Chart.js
Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.color = '#334155';

// ===================================================================
// CONFIGURACIONES DE GRÁFICOS AVANZADOS
// ===================================================================

const chartConfigurations = {
    // Configuración para gráfico de líneas avanzado
    advancedLineChart: {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { weight: 'bold' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#d4af37',
                    bodyColor: 'white',
                    borderColor: '#d4af37',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return `Período: ${context[0].label}`;
                        },
                        label: function(context) {
                            return `${context.dataset.label}: S/. ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(203, 213, 225, 0.3)'
                    },
                    ticks: {
                        font: { weight: '600' }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(203, 213, 225, 0.3)'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'S/. ' + value.toLocaleString();
                        },
                        font: { weight: '600' }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutCubic'
            }
        }
    },

    // Configuración para gráfico de barras
    barChart: {
        type: 'bar',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#d4af37',
                    bodyColor: 'white',
                    borderColor: '#d4af37',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Monto: S/. ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { weight: '600' }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(203, 213, 225, 0.3)'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'S/. ' + value.toLocaleString();
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            }
        }
    },

    // Configuración para gráfico de dona
    doughnutChart: {
        type: 'doughnut',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { weight: 'bold' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#d4af37',
                    bodyColor: 'white',
                    borderColor: '#d4af37',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: S/. ${context.parsed.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    }
};

// ===================================================================
// FUNCIONES DE GRÁFICOS ESPECÍFICOS
// ===================================================================

// Gráfico de flujo de caja detallado
function initCashFlowDetailChart() {
    const ctx = document.getElementById('cashFlowDetailChart');
    if (!ctx) return;

    const data = {
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
            pointBorderColor: '#ffffff',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    charts.cashFlowDetail = new Chart(ctx, {
        ...chartConfigurations.advancedLineChart,
        data: data
    });
}

// Gráfico de tendencias de rentabilidad
function initProfitabilityChart() {
    const ctx = document.getElementById('profitabilityChart');
    if (!ctx) return;

    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Margen Bruto %',
            data: [32, 35, 38, 34, 40, 37, 42],
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }, {
            label: 'Margen Neto %',
            data: [18, 21, 24, 20, 26, 23, 28],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };

    charts.profitability = new Chart(ctx, {
        ...chartConfigurations.advancedLineChart,
        data: data,
        options: {
            ...chartConfigurations.advancedLineChart.options,
            scales: {
                ...chartConfigurations.advancedLineChart.options.scales,
                y: {
                    ...chartConfigurations.advancedLineChart.options.scales.y,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de inventario por categorías
function initInventoryChart() {
    const ctx = document.getElementById('inventoryChart');
    if (!ctx) return;

    const data = {
        labels: ['Materia Prima', 'Productos Terminados', 'En Proceso', 'Suministros'],
        datasets: [{
            data: [32000, 18500, 8200, 8600],
            backgroundColor: [
                '#059669',
                '#3b82f6',
                '#f59e0b',
                '#dc2626'
            ],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    charts.inventory = new Chart(ctx, {
        ...chartConfigurations.doughnutChart,
        data: data
    });
}

// Gráfico de análisis de clientes
function initCustomerAnalysisChart() {
    const ctx = document.getElementById('customerAnalysisChart');
    if (!ctx) return;

    const data = {
        labels: ['Clientes A', 'Clientes B', 'Clientes C', 'Nuevos'],
        datasets: [{
            label: 'Ventas por Segmento',
            data: [28500, 15200, 8900, 12400],
            backgroundColor: [
                'rgba(5, 150, 105, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(212, 175, 55, 0.8)'
            ],
            borderColor: [
                '#059669',
                '#3b82f6',
                '#f59e0b',
                '#d4af37'
            ],
            borderWidth: 2,
            borderRadius: 8
        }]
    };

    charts.customerAnalysis = new Chart(ctx, {
        ...chartConfigurations.barChart,
        data: data,
        options: {
            ...chartConfigurations.barChart.options,
            plugins: {
                ...chartConfigurations.barChart.options.plugins,
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// ===================================================================
// FUNCIONES DE ACTUALIZACIÓN DE DATOS
// ===================================================================

// Actualizar datos de gráficos con animación
function updateChartData(chartInstance, newData, animationDuration = 1000) {
    if (!chartInstance) return;

    chartInstance.data.datasets.forEach((dataset, index) => {
        if (newData[index]) {
            dataset.data = newData[index];
        }
    });

    chartInstance.options.animation.duration = animationDuration;
    chartInstance.update('active');
}

// Simular datos en tiempo real
function simulateRealTimeData() {
    const charts = ['revenue', 'expenses', 'cashFlow', 'aging'];
    
    charts.forEach(chartName => {
        const chart = window.charts[chartName];
        if (chart) {
            chart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(value => {
                    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
                    return Math.round(value * (1 + variation));
                });
            });
            chart.update('none');
        }
    });
}

// ===================================================================
// FUNCIONES DE EXPORTACIÓN
// ===================================================================

// Exportar gráfico como imagen
function exportChartAsImage(chartInstance, filename = 'chart.png') {
    if (!chartInstance) return;

    const url = chartInstance.toBase64Image();
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
}

// Exportar todos los gráficos
function exportAllCharts() {
    Object.keys(charts).forEach(chartName => {
        if (charts[chartName]) {
            exportChartAsImage(charts[chartName], `grizalum_${chartName}_${new Date().toISOString().split('T')[0]}.png`);
        }
    });
    
    showSuccessMessage('📊 Todos los gráficos exportados exitosamente');
}

// ===================================================================
// FUNCIONES DE ANÁLISIS AVANZADO
// ===================================================================

// Calcular tendencias
function calculateTrend(data) {
    if (data.length < 2) return 0;
    
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    
    return ((lastValue - firstValue) / firstValue) * 100;
}

// Detectar anomalías en los datos
function detectAnomalies(data, threshold = 2) {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const standardDeviation = Math.sqrt(variance);
    
    return data.map((value, index) => {
        const zScore = Math.abs((value - mean) / standardDeviation);
        return {
            index,
            value,
            isAnomaly: zScore > threshold,
            zScore
        };
    });
}

// Generar insights automáticos
function generateChartInsights() {
    const insights = [];
    
    // Analizar tendencia de ingresos
    if (charts.revenue && charts.revenue.data.datasets[0]) {
        const revenueData = charts.revenue.data.datasets[0].data;
        const revenueTrend = calculateTrend(revenueData);
        
        if (revenueTrend > 10) {
            insights.push({
                type: 'positive',
                message: `📈 Excelente: Ingresos creciendo ${revenueTrend.toFixed(1)}%`,
                priority: 'high'
            });
        } else if (revenueTrend < -5) {
            insights.push({
                type: 'warning',
                message: `⚠️ Alerta: Ingresos decreciendo ${Math.abs(revenueTrend).toFixed(1)}%`,
                priority: 'high'
            });
        }
    }
    
    // Analizar flujo de caja
    if (charts.cashFlowDetail && charts.cashFlowDetail.data.datasets[0]) {
        const cashFlowData = charts.cashFlowDetail.data.datasets[0].data;
        const anomalies = detectAnomalies(cashFlowData);
        const anomalyCount = anomalies.filter(a => a.isAnomaly).length;
        
        if (anomalyCount > 0) {
            insights.push({
                type: 'info',
                message: `🔍 Detectadas ${anomalyCount} fluctuaciones inusuales en flujo de caja`,
                priority: 'medium'
            });
        }
    }
    
    return insights;
}

// ===================================================================
// FUNCIONES DE INTERACTIVIDAD
// ===================================================================

// Agregar zoom a gráficos
function enableChartZoom(chartInstance) {
    if (!chartInstance) return;
    
    chartInstance.options.plugins.zoom = {
        zoom: {
            wheel: {
                enabled: true,
            },
            pinch: {
                enabled: true
            },
            mode: 'x',
        },
        pan: {
            enabled: true,
            mode: 'x',
        }
    };
    
    chartInstance.update();
}

// Agregar filtros interactivos
function addChartFilters(chartInstance, filterOptions) {
    // Implementar filtros personalizados según las opciones
    console.log('Filtros aplicados:', filterOptions);
}

// ===================================================================
// INICIALIZACIÓN DE GRÁFICOS ADICIONALES
// ===================================================================

// Inicializar todos los gráficos adicionales
function initializeAdditionalCharts() {
    initCashFlowDetailChart();
    initProfitabilityChart();
    initInventoryChart();
    initCustomerAnalysisChart();
    
    console.log('📊 Gráficos adicionales inicializados');
}

// ===================================================================
// EVENTOS Y LISTENERS
// ===================================================================

// Configurar eventos de gráficos
function setupChartEvents() {
    // Auto-refresh cada 5 minutos
    setInterval(() => {
        if (document.getElementById('autoRefreshCharts')?.checked) {
            simulateRealTimeData();
        }
    }, 300000);
    
    // Generar insights cada 10 minutos
    setInterval(() => {
        const insights = generateChartInsights();
        if (insights.length > 0) {
            console.log('📊 Insights generados:', insights);
            // Mostrar insights en la UI si es necesario
        }
    }, 600000);
}

// ===================================================================
// EXPORTAR FUNCIONES GLOBALES
// ===================================================================

// Hacer funciones disponibles globalmente
window.chartFunctions = {
    updateChartData,
    simulateRealTimeData,
    exportChartAsImage,
    exportAllCharts,
    generateChartInsights,
    enableChartZoom,
    addChartFilters,
    initializeAdditionalCharts
};

console.log('📊 Módulo de gráficos cargado completamente');
