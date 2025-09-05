// ================================================================
// 📊 GRIZALUM CHARTS MANAGER - VERSIÓN CORREGIDA FINAL
// Sistema de gráficos financieros optimizado y funcional
// ================================================================

console.log('🚀 Iniciando GRIZALUM Charts Manager - Versión Corregida');

// ================================================================
// 🔧 VARIABLES GLOBALES Y ESTADO
// ================================================================
let chartsInitialized = false;
let chartInstances = {};
let currentTheme = 'gold';
let currentPeriod = 'mes';

// ================================================================
// 🕒 VERIFICACIÓN ROBUSTA DE DEPENDENCIAS
// ================================================================
function waitForDependencies() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 30; // 6 segundos máximo
        
        function check() {
            attempts++;
            
            // Verificar Chart.js
            if (typeof Chart === 'undefined') {
                if (attempts >= maxAttempts) {
                    reject('Chart.js no disponible después de 6 segundos');
                    return;
                }
                console.log(`⏳ Esperando Chart.js... intento ${attempts}`);
                setTimeout(check, 200);
                return;
            }
            
            // Verificar contenedores
            const containers = ['cashFlowChart', 'expensesChart', 'revenueChart', 'agingChart', 'cashFlowDetailChart'];
            const missingContainers = containers.filter(id => !document.getElementById(id));
            
            if (missingContainers.length > 0) {
                if (attempts >= maxAttempts) {
                    reject(`Contenedores faltantes: ${missingContainers.join(', ')}`);
                    return;
                }
                console.log(`⏳ Esperando contenedores... faltan: ${missingContainers.join(', ')}`);
                setTimeout(check, 200);
                return;
            }
            
            console.log('✅ Todas las dependencias están listas');
            resolve();
        }
        
        check();
    });
}

// ================================================================
// 🎨 CONFIGURACIÓN DE TEMAS
// ================================================================
const THEMES = {
    gold: {
        primary: '#D4AF37',
        secondary: '#B8860B',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6'
    },
    blue: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#06B6D4'
    },
    green: {
        primary: '#10B981',
        secondary: '#059669',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6'
    }
};

function getThemeColor(colorType) {
    return THEMES[currentTheme]?.[colorType] || THEMES.gold[colorType];
}

// ================================================================
// 📊 DATOS DE EJEMPLO FINANCIEROS
// ================================================================
const FINANCIAL_DATA = {
    cashFlow: {
        labels: ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero'],
        ingresos: [2200000, 2350000, 2180000, 2420000, 2650000, 2847293],
        gastos: [1800000, 1850000, 1780000, 1920000, 1850000, 1892847]
    },
    expenses: {
        labels: ['Personal', 'Marketing', 'Operaciones', 'Tecnología', 'Otros'],
        values: [12000, 8500, 15200, 6800, 4200]
    },
    revenue: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        ingresos: [850000, 920000, 780000, 1100000],
        gastos: [720000, 800000, 650000, 950000]
    },
    aging: {
        labels: ['0-30 días', '31-60 días', '61-90 días', '+90 días'],
        values: [182000, 98000, 32000, 16000]
    },
    dailyCashFlow: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        values: [150000, 185000, 220000, 178000, 215000, 198000, 245000]
    }
};

// ================================================================
// 🛠️ UTILIDADES
// ================================================================
function formatCurrency(value, abbreviated = false) {
    if (abbreviated && value >= 1000000) {
        return `S/. ${(value / 1000000).toFixed(1)}M`;
    } else if (abbreviated && value >= 1000) {
        return `S/. ${(value / 1000).toFixed(0)}K`;
    }
    
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 0
    }).format(value);
}

function getBaseChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { family: 'Inter, sans-serif', size: 12 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: getThemeColor('primary'),
                borderWidth: 1,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                ticks: { font: { family: 'Inter, sans-serif', size: 11 } }
            },
            y: {
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                ticks: {
                    font: { family: 'Inter, sans-serif', size: 11 },
                    callback: function(value) {
                        return formatCurrency(value, true);
                    }
                }
            }
        }
    };
}

// ================================================================
// 📈 CREADORES DE GRÁFICOS
// ================================================================
function createCashFlowChart() {
    const canvas = document.getElementById('cashFlowChart');
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico existente si existe
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }
    
    const config = {
        type: 'line',
        data: {
            labels: FINANCIAL_DATA.cashFlow.labels,
            datasets: [{
                label: 'Ingresos',
                data: FINANCIAL_DATA.cashFlow.ingresos,
                borderColor: getThemeColor('success'),
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Gastos',
                data: FINANCIAL_DATA.cashFlow.gastos,
                borderColor: getThemeColor('danger'),
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            ...getBaseChartOptions(),
            plugins: {
                ...getBaseChartOptions().plugins,
                title: {
                    display: true,
                    text: 'Flujo de Caja - Últimos 6 Meses',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    };
    
    try {
        const chart = new Chart(ctx, config);
        console.log('✅ Gráfico de flujo de caja creado');
        return chart;
    } catch (error) {
        console.error('❌ Error creando gráfico de flujo de caja:', error);
        return null;
    }
}

function createExpensesChart() {
    const canvas = document.getElementById('expensesChart');
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();
    
    const config = {
        type: 'doughnut',
        data: {
            labels: FINANCIAL_DATA.expenses.labels,
            datasets: [{
                data: FINANCIAL_DATA.expenses.values,
                backgroundColor: [
                    getThemeColor('primary'),
                    getThemeColor('secondary'),
                    getThemeColor('success'),
                    getThemeColor('warning'),
                    getThemeColor('info')
                ],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            ...getBaseChartOptions(),
            cutout: '60%',
            plugins: {
                ...getBaseChartOptions().plugins,
                title: {
                    display: true,
                    text: 'Distribución de Gastos',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };
    
    try {
        const chart = new Chart(ctx, config);
        console.log('✅ Gráfico de gastos creado');
        return chart;
    } catch (error) {
        console.error('❌ Error creando gráfico de gastos:', error);
        return null;
    }
}

function createRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();
    
    const config = {
        type: 'bar',
        data: {
            labels: FINANCIAL_DATA.revenue.labels,
            datasets: [{
                label: 'Ingresos',
                data: FINANCIAL_DATA.revenue.ingresos,
                backgroundColor: getThemeColor('primary'),
                borderRadius: 6
            }, {
                label: 'Gastos',
                data: FINANCIAL_DATA.revenue.gastos,
                backgroundColor: getThemeColor('danger'),
                borderRadius: 6
            }]
        },
        options: {
            ...getBaseChartOptions(),
            plugins: {
                ...getBaseChartOptions().plugins,
                title: {
                    display: true,
                    text: 'Ingresos vs Gastos',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };
    
    try {
        const chart = new Chart(ctx, config);
        console.log('✅ Gráfico de ingresos vs gastos creado');
        return chart;
    } catch (error) {
        console.error('❌ Error creando gráfico de ingresos:', error);
        return null;
    }
}

function createAgingChart() {
    const canvas = document.getElementById('agingChart');
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();
    
    const config = {
        type: 'bar',
        data: {
            labels: FINANCIAL_DATA.aging.labels,
            datasets: [{
                label: 'Monto Pendiente',
                data: FINANCIAL_DATA.aging.values,
                backgroundColor: [
                    getThemeColor('success'),
                    getThemeColor('warning'),
                    getThemeColor('info'),
                    getThemeColor('danger')
                ],
                borderRadius: 8
            }]
        },
        options: {
            ...getBaseChartOptions(),
            plugins: {
                ...getBaseChartOptions().plugins,
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Antigüedad de Cuentas',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };
    
    try {
        const chart = new Chart(ctx, config);
        console.log('✅ Gráfico de antigüedad creado');
        return chart;
    } catch (error) {
        console.error('❌ Error creando gráfico de antigüedad:', error);
        return null;
    }
}

function createDailyCashFlowChart() {
    const canvas = document.getElementById('cashFlowDetailChart');
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();
    
    const config = {
        type: 'line',
        data: {
            labels: FINANCIAL_DATA.dailyCashFlow.labels,
            datasets: [{
                label: 'Saldo Diario',
                data: FINANCIAL_DATA.dailyCashFlow.values,
                borderColor: getThemeColor('success'),
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            ...getBaseChartOptions(),
            plugins: {
                ...getBaseChartOptions().plugins,
                title: {
                    display: true,
                    text: 'Flujo de Caja Diario',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    };
    
    try {
        const chart = new Chart(ctx, config);
        console.log('✅ Gráfico de flujo diario creado');
        return chart;
    } catch (error) {
        console.error('❌ Error creando gráfico de flujo diario:', error);
        return null;
    }
}

// ================================================================
// 🚀 FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// ================================================================
async function initializeCharts() {
    if (chartsInitialized) {
        console.log('⚠️ Gráficos ya inicializados');
        return true;
    }
    
    try {
        console.log('📊 Iniciando inicialización de gráficos...');
        
        // Esperar dependencias
        await waitForDependencies();
        
        // Configurar Chart.js globalmente
        Chart.defaults.font.family = 'Inter, sans-serif';
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#64748B';
        
        console.log('🏗️ Creando gráficos...');
        
        // Crear gráficos uno por uno con manejo de errores
        const chartCreators = [
            { name: 'cashFlow', creator: createCashFlowChart },
            { name: 'expenses', creator: createExpensesChart },
            { name: 'revenue', creator: createRevenueChart },
            { name: 'aging', creator: createAgingChart },
            { name: 'dailyCashFlow', creator: createDailyCashFlowChart }
        ];
        
        let successCount = 0;
        
        for (const { name, creator } of chartCreators) {
            try {
                const chart = creator();
                if (chart) {
                    chartInstances[name] = chart;
                    successCount++;
                    
                    // Pequeña pausa para evitar bloqueos
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (error) {
                console.error(`❌ Error creando gráfico ${name}:`, error);
            }
        }
        
        chartsInitialized = true;
        console.log(`🎉 Inicialización completada: ${successCount}/${chartCreators.length} gráficos creados`);
        
        // Notificar éxito si está disponible
        if (typeof window.mostrarNotificacion === 'function') {
            window.mostrarNotificacion(`${successCount} gráficos cargados correctamente`, 'success');
        }
        
        return true;
        
    } catch (error) {
        console.error('💥 Error fatal en inicialización:', error);
        
        if (typeof window.mostrarNotificacion === 'function') {
            window.mostrarNotificacion('Error cargando gráficos', 'error');
        }
        
        return false;
    }
}

// ================================================================
// 🔄 FUNCIONES DE GESTIÓN
// ================================================================
function refreshAllCharts() {
    if (!chartsInitialized) return;
    
    console.log('🔄 Refrescando gráficos...');
    Object.values(chartInstances).forEach(chart => {
        if (chart && typeof chart.update === 'function') {
            chart.update();
        }
    });
}

function destroyAllCharts() {
    Object.values(chartInstances).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    chartInstances = {};
    chartsInitialized = false;
    console.log('🗑️ Todos los gráficos destruidos');
}

function updateTheme(newTheme) {
    if (THEMES[newTheme]) {
        currentTheme = newTheme;
        console.log(`🎨 Cambiando tema a: ${newTheme}`);
        destroyAllCharts();
        setTimeout(initializeCharts, 500);
    }
}

// ================================================================
// 🌐 EXPOSICIÓN GLOBAL
// ================================================================
window.initializeCharts = initializeCharts;
window.refreshAllCharts = refreshAllCharts;
window.destroyAllCharts = destroyAllCharts;
window.updateTheme = updateTheme;

// Crear objeto global para compatibilidad
window.GrizalumCharts = {
    init: initializeCharts,
    refresh: refreshAllCharts,
    destroy: destroyAllCharts,
    updateTheme: updateTheme,
    instances: chartInstances,
    isInitialized: () => chartsInitialized
};

// ================================================================
// 🚀 AUTO-INICIALIZACIÓN MÚLTIPLE
// ================================================================

// Estrategia 1: DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, programando inicialización...');
    setTimeout(initializeCharts, 1000);
});

// Estrategia 2: Window Load (respaldo)
window.addEventListener('load', () => {
    console.log('🌐 Window load, verificando estado...');
    setTimeout(() => {
        if (!chartsInitialized) {
            console.log('🔄 Gráficos no inicializados, reintentando...');
            initializeCharts();
        }
    }, 2000);
});

// Estrategia 3: Timeout forzado (emergencia)
setTimeout(() => {
    if (!chartsInitialized && typeof Chart !== 'undefined') {
        console.log('⏰ Inicialización de emergencia');
        initializeCharts();
    }
}, 5000);

// ================================================================
// 📝 LOG FINAL
// ================================================================
console.log('📊 GRIZALUM Charts Manager cargado y listo');
console.log('🔧 Funciones disponibles: window.GrizalumCharts');
console.log('🎯 Sistema optimizado para máxima compatibilidad');
