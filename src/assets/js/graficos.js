// ================================================================
// 📊 GRIZALUM CHARTS MANAGER - VERSIÓN PROFESIONAL v2.2 CORREGIDA
// Sistema avanzado de gráficos financieros para empresas peruanas
// ================================================================

/**
 * GRIZALUM Charts Manager
 * Gestor profesional de gráficos financieros integrado con Chart.js
 * Optimizado para datos financieros de empresas en Perú
 */

class GrizalumChartsManager {
    constructor() {
        this.charts = new Map();
        this.isInitialized = false;
        this.currentPeriod = 'mes';
        this.currentTheme = 'gold';
        this.config = null;
        this.dataGenerator = new FinancialDataGenerator();
        this.retryCount = 0;
        this.maxRetries = 5;
        
        console.log('📊 Inicializando GRIZALUM Charts Manager v2.2...');
    }

    // ======= INICIALIZACIÓN MEJORADA =======
    async initialize(initialData = null) {
        // Verificar dependencias
        if (!this.checkDependencies()) {
            console.log('⏳ Esperando dependencias...');
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                setTimeout(() => this.initialize(initialData), 1000);
                return false;
            }
            console.error('❌ No se pudieron cargar las dependencias después de múltiples intentos');
            return false;
        }

        try {
            console.log('📈 Configurando sistema de gráficos...');
            
            // Cargar configuración
            this.loadConfiguration();
            
            // Configurar Chart.js globalmente
            this.configureGlobalSettings();
            
            // Inicializar datos si se proporcionan
            if (initialData) {
                this.dataGenerator.setBaseData(initialData);
            }
            
            // Verificar que los contenedores existan
            if (!this.checkContainers()) {
                console.log('⏳ Esperando contenedores del DOM...');
                setTimeout(() => this.initialize(initialData), 500);
                return false;
            }
            
            // Crear todos los gráficos
            await this.initializeAllCharts();
            
            // Configurar eventos
            this.bindEvents();
            
            this.isInitialized = true;
            console.log('✅ Sistema de gráficos inicializado correctamente');
            
            // Mostrar notificación de éxito
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion('Gráficos cargados correctamente', 'success');
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Error inicializando Charts Manager:', error);
            
            // Mostrar notificación de error
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion('Error cargando gráficos', 'error');
            }
            
            return false;
        }
    }

    checkDependencies() {
        if (typeof Chart === 'undefined') {
            console.log('⚠️ Chart.js no está disponible aún');
            return false;
        }
        
        console.log('✅ Chart.js disponible:', Chart.version);
        return true;
    }

    checkContainers() {
        const requiredContainers = [
            'cashFlowChart',
            'expensesChart', 
            'revenueChart',
            'agingChart',
            'cashFlowDetailChart'
        ];
        
        for (const containerId of requiredContainers) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.log(`⚠️ Contenedor no encontrado: ${containerId}`);
                return false;
            }
        }
        
        console.log('✅ Todos los contenedores están disponibles');
        return true;
    }

    loadConfiguration() {
        // Usar configuración global o fallback
        this.config = window.GRIZALUM_CONFIG?.charts || {
            enabled: ['cashFlow', 'expenses', 'revenue', 'aging', 'cashFlowDetail'],
            containers: {
                cashFlow: 'cashFlowChart',
                expenses: 'expensesChart',
                revenue: 'revenueChart',
                aging: 'agingChart',
                cashFlowDetail: 'cashFlowDetailChart'
            },
            defaultOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
        };
        
        console.log('⚙️ Configuración de gráficos cargada:', this.config.enabled);
    }

    configureGlobalSettings() {
        // Configuración global de Chart.js optimizada
        Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#64748B';
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        
        // Configuraciones de animación más suaves
        Chart.defaults.animation.duration = 800;
        Chart.defaults.animation.easing = 'easeInOutQuart';
        
        console.log('🎨 Configuración global de Chart.js aplicada');
    }

    // ======= GESTIÓN DE GRÁFICOS MEJORADA =======
    async initializeAllCharts() {
        console.log('🏗️ Creando gráficos financieros...');
        
        // Destruir gráficos existentes primero
        this.destroyAll();
        
        let successCount = 0;
        
        // Crear gráficos de forma secuencial para mejor rendimiento
        for (const chartType of this.config.enabled) {
            try {
                await this.createChart(chartType);
                console.log(`✅ Gráfico ${chartType} creado exitosamente`);
                successCount++;
                
                // Pequeña pausa para evitar bloqueo del UI
                await this.delay(100);
                
            } catch (error) {
                console.warn(`⚠️ No se pudo crear gráfico ${chartType}:`, error.message);
            }
        }
        
        console.log(`📊 ${successCount}/${this.config.enabled.length} gráficos inicializados`);
        
        // Si no se creó ningún gráfico, intentar de nuevo
        if (successCount === 0) {
            console.log('🔄 Reintentando creación de gráficos en 2 segundos...');
            setTimeout(() => this.initializeAllCharts(), 2000);
        }
    }

    async createChart(type) {
        const containerId = this.config.containers[type];
        const ctx = document.getElementById(containerId);

        if (!ctx) {
            throw new Error(`Contenedor no encontrado: ${containerId}`);
        }

        // Verificar que el contenedor sea un canvas
        if (ctx.tagName.toLowerCase() !== 'canvas') {
            throw new Error(`El elemento ${containerId} no es un canvas`);
        }

        // Limpiar canvas si ya existe un gráfico
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        const chartConfig = this.getChartConfig(type);
        if (!chartConfig) {
            throw new Error(`Configuración no encontrada para: ${type}`);
        }

        // Aplicar tema actual
        this.applyThemeToConfig(chartConfig);

        // Crear el gráfico con manejo de errores
        let chart;
        try {
            chart = new Chart(ctx, chartConfig);
            this.charts.set(type, chart);
            
            // Animación de entrada personalizada
            this.animateChartEntry(chart, type);
            
            console.log(`📈 Gráfico ${type} renderizado en ${containerId}`);
            
        } catch (renderError) {
            console.error(`Error renderizando gráfico ${type}:`, renderError);
            throw renderError;
        }

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

    // ======= CONFIGURACIONES ESPECÍFICAS DE GRÁFICOS (Mismas que antes) =======
    getCashFlowConfig() {
        const data = this.dataGenerator.getCashFlowData(this.currentPeriod);
        
        return {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Ingresos',
                    data: data.ingresos,
                    borderColor: this.getThemeColor('primary'),
                    backgroundColor: this.getThemeColor('primaryAlpha'),
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.getThemeColor('primary'),
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: 'Gastos',
                    data: data.gastos,
                    borderColor: this.getThemeColor('warning'),
                    backgroundColor: this.getThemeColor('warningAlpha'),
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.getThemeColor('warning'),
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { 
                            usePointStyle: true, 
                            padding: 20,
                            font: { weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.getThemeColor('primary'),
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                return `${context.dataset.label}: ${this.formatCurrency(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { 
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        border: { display: false },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true),
                            font: { weight: '500' }
                        }
                    },
                    x: { 
                        grid: { 
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        border: { display: false },
                        ticks: {
                            font: { weight: '500' }
                        }
                    }
                }
            }
        };
    }

    getExpensesConfig() {
        const data = this.dataGenerator.getExpensesData(this.currentPeriod);
        
        return {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        this.getThemeColor('primary'),
                        this.getThemeColor('secondary'),
                        this.getThemeColor('success'),
                        this.getThemeColor('warning'),
                        this.getThemeColor('info')
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: { 
                            usePointStyle: true, 
                            padding: 15,
                            font: { weight: '500' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${percentage}% (${this.formatCurrency(value * 1000)})`;
                            }
                        }
                    }
                }
            }
        };
    }

    getRevenueConfig() {
        const data = this.dataGenerator.getRevenueComparisonData(this.currentPeriod);
        
        return {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Ingresos',
                    data: data.ingresos,
                    backgroundColor: this.getThemeColor('primary'),
                    borderColor: this.getThemeColor('primary'),
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }, {
                    label: 'Gastos',
                    data: data.gastos,
                    backgroundColor: this.getThemeColor('danger'),
                    borderColor: this.getThemeColor('danger'),
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { 
                            usePointStyle: true, 
                            font: { weight: '600' } 
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { 
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        border: { display: false },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                }
            }
        };
    }

    getAgingConfig() {
        const data = this.dataGenerator.getAgingData();
        
        return {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Monto Pendiente',
                    data: data.values,
                    backgroundColor: [
                        this.getThemeColor('success'),
                        this.getThemeColor('warning'),
                        this.getThemeColor('info'),
                        this.getThemeColor('danger')
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return `${context.label}: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { 
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        border: { display: false },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                }
            }
        };
    }

    getCashFlowDetailConfig() {
        const data = this.dataGenerator.getCashFlowDetailData(this.currentPeriod);
        
        return {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Saldo Diario',
                    data: data.values,
                    borderColor: this.getThemeColor('success'),
                    backgroundColor: this.getThemeColor('successAlpha'),
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.getThemeColor('success'),
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: { 
                            usePointStyle: true, 
                            font: { weight: '600' } 
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return `Saldo: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { 
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        border: { display: false },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    },
                    x: {
                        grid: { 
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        border: { display: false }
                    }
                }
            }
        };
    }

    // ======= GESTIÓN DE TEMAS (Igual que antes) =======
    getThemeColor(colorType) {
        const themes = {
            gold: {
                primary: '#D4AF37',
                primaryAlpha: 'rgba(212, 175, 55, 0.2)',
                secondary: '#B8860B',
                success: '#10B981',
                successAlpha: 'rgba(16, 185, 129, 0.2)',
                warning: '#F59E0B',
                warningAlpha: 'rgba(245, 158, 11, 0.2)',
                danger: '#EF4444',
                info: '#3B82F6'
            },
            blue: {
                primary: '#3B82F6',
                primaryAlpha: 'rgba(59, 130, 246, 0.2)',
                secondary: '#1E40AF',
                success: '#10B981',
                successAlpha: 'rgba(16, 185, 129, 0.2)',
                warning: '#F59E0B',
                warningAlpha: 'rgba(245, 158, 11, 0.2)',
                danger: '#EF4444',
                info: '#06B6D4'
            },
            green: {
                primary: '#10B981',
                primaryAlpha: 'rgba(16, 185, 129, 0.2)',
                secondary: '#059669',
                success: '#22C55E',
                successAlpha: 'rgba(34, 197, 94, 0.2)',
                warning: '#F59E0B',
                warningAlpha: 'rgba(245, 158, 11, 0.2)',
                danger: '#EF4444',
                info: '#3B82F6'
            }
        };

        return themes[this.currentTheme]?.[colorType] || themes.gold[colorType];
    }

    applyThemeToConfig(config) {
        // Esta función se puede expandir para aplicar temas más complejos
    }

    updateTheme(newTheme) {
        this.currentTheme = newTheme;
        console.log(`🎨 Aplicando tema: ${newTheme}`);
        this.refreshAllCharts();
    }

    // ======= GESTIÓN DE PERÍODOS =======
    updateForPeriod(period) {
        this.currentPeriod = period;
        console.log(`📅 Actualizando gráficos para período: ${period}`);
        this.refreshAllCharts();
    }

    async refreshAllCharts() {
        if (!this.isInitialized) return;
        
        console.log('🔄 Actualizando todos los gráficos...');
        
        for (const [type, chart] of this.charts) {
            try {
                const newConfig = this.getChartConfig(type);
                if (newConfig) {
                    chart.data = newConfig.data;
                    chart.update('active');
                }
            } catch (error) {
                console.warn(`⚠️ Error actualizando gráfico ${type}:`, error);
            }
        }
    }

    // ======= UTILIDADES (Iguales que antes) =======
    formatCurrency(value, abbreviated = false) {
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    animateChartEntry(chart, type) {
        const container = chart.canvas.parentElement;
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.transition = 'all 0.6s ease-out';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // ======= EVENTOS =======
    bindEvents() {
        document.addEventListener('themeChanged', (e) => {
            this.updateTheme(e.detail.theme);
        });
        
        document.addEventListener('periodChanged', (e) => {
            this.updateForPeriod(e.detail.period);
        });
        
        window.addEventListener('resize', this.debounce(() => {
            this.charts.forEach(chart => chart.resize());
        }, 250));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ======= API PÚBLICA (Iguales que antes) =======
    getChart(type) {
        return this.charts.get(type);
    }

    updateChart(type, newData) {
        const chart = this.charts.get(type);
        if (chart && newData) {
            chart.data = { ...chart.data, ...newData };
            chart.update('active');
        }
    }

    destroyChart(type) {
        const chart = this.charts.get(type);
        if (chart) {
            chart.destroy();
            this.charts.delete(type);
            console.log(`🗑️ Gráfico ${type} destruido`);
        }
    }

    destroyAll() {
        this.charts.forEach((chart, type) => {
            chart.destroy();
        });
        this.charts.clear();
        this.isInitialized = false;
    }

    getStatus() {
        return {
            isInitialized: this.isInitialized,
            chartsCount: this.charts.size,
            currentPeriod: this.currentPeriod,
            currentTheme: this.currentTheme,
            activeCharts: Array.from(this.charts.keys())
        };
    }
}

// ======= GENERADOR DE DATOS FINANCIEROS (Igual que antes) =======
class FinancialDataGenerator {
    constructor() {
        this.baseData = null;
        this.currency = 'PEN';
    }

    setBaseData(data) {
        this.baseData = data;
    }

    getCashFlowData(period) {
        const periods = {
            'hoy': {
                labels: ['06:00', '09:00', '12:00', '15:00', '18:00'],
                ingresos: [45000, 67000, 89000, 76000, 94000],
                gastos: [23000, 34000, 45000, 38000, 42000]
            },
            'semana': {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                ingresos: [320000, 385000, 420000, 390000, 445000, 280000, 195000],
                gastos: [180000, 195000, 210000, 205000, 225000, 140000, 98000]
            },
            'mes': {
                labels: ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero'],
                ingresos: [2200000, 2350000, 2180000, 2420000, 2650000, 2847293],
                gastos: [1800000, 1850000, 1780000, 1920000, 1850000, 1892847]
            },
            'trimestre': {
                labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
                ingresos: [6800000, 7200000, 6950000, 7650000],
                gastos: [5400000, 5650000, 5520000, 6100000]
            },
            'año': {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                ingresos: [18500000, 22300000, 26800000, 28200000, 30150000],
                gastos: [15200000, 17800000, 21200000, 22100000, 23800000]
            }
        };

        return periods[period] || periods['mes'];
    }

    getExpensesData(period) {
        return {
            labels: ['Nómina y Beneficios', 'Marketing Digital', 'Operaciones', 'Tecnología', 'Otros Gastos'],
            values: [45, 20, 15, 12, 8]
        };
    }

    getRevenueComparisonData(period) {
        const data = this.getCashFlowData(period);
        return {
            labels: data.labels.slice(-6),
            ingresos: data.ingresos.slice(-6),
            gastos: data.gastos.slice(-6)
        };
    }

    getAgingData() {
        return {
            labels: ['0-30 días', '31-60 días', '61-90 días', '+90 días'],
            values: [182000, 98000, 32000, 16000]
        };
    }

    getCashFlowDetailData(period) {
        const detailPeriods = {
            'hoy': {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                values: [24500, 26800, 45300, 67800, 78200, 82500]
            },
            'semana': {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                values: [150000, 185000, 220000, 178000, 215000, 198000, 245000]
            },
            'mes': {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                values: [580000, 645000, 720000, 824500]
            },
            'trimestre': {
                labels: ['Ene', 'Feb', 'Mar'],
                values: [1200000, 1450000, 1680000]
            },
            'año': {
                labels: ['2023', '2024'],
                values: [8500000, 9200000]
            }
        };

        return detailPeriods[period] || detailPeriods['semana'];
    }
}

// ======= INICIALIZACIÓN Y EXPORTACIÓN =======

// Crear instancia global
const grizalumChartsManager = new GrizalumChartsManager();

// Funciones de compatibilidad para el HTML actual
function initializeCharts() {
    return grizalumChartsManager.initialize();
}

// Función específica para forzar inicialización
function forceInitializeCharts() {
    console.log('🔥 Forzando inicialización de gráficos...');
    return grizalumChartsManager.initialize();
}

// Auto-inicialización inteligente mejorada
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, iniciando verificación de gráficos...');
    
    const checkAndInit = () => {
        if (typeof Chart !== 'undefined') {
            console.log('✅ Chart.js detectado, esperando 1 segundo para asegurar DOM completo...');
            setTimeout(() => {
                grizalumChartsManager.initialize();
            }, 1000);
        } else {
            console.log('⏳ Esperando Chart.js...');
            setTimeout(checkAndInit, 300);
        }
    };
    
    checkAndInit();
});

// Inicialización adicional cuando la ventana está completamente cargada
window.addEventListener('load', () => {
    console.log('🚀 Ventana completamente cargada');
    
    // Si los gráficos aún no están inicializados, intentar de nuevo
    setTimeout(() => {
        if (!grizalumChartsManager.isInitialized) {
            console.log('🔄 Reintentando inicialización después de window.load...');
            grizalumChartsManager.initialize();
        }
    }, 500);
});

// Exportar globalmente
window.GrizalumCharts = grizalumChartsManager;
window.GrizalumChartsManager = grizalumChartsManager;
window.forceInitializeCharts = forceInitializeCharts;

console.log('📈 GRIZALUM Charts Manager v2.2 CORREGIDO cargado');
console.log('✨ Mejoras:');
console.log('  • 🔍 Verificación de contenedores mejorada');
console.log('  • ⏳ Sistema de reintentos inteligente');
console.log('  • 🎯 Manejo de errores robusto');
console.log('  • 📊 5 tipos de gráficos financieros');
console.log('  • 🎨 Sistema de temas integrado');
console.log('  • 📅 Datos dinámicos por período');
console.log('  • 💰 Formato de moneda peruana');
console.log('  • ⚡ Animaciones optimizadas');
console.log('  • 📱 Totalmente responsivo');
console.log('🚀 Sistema listo para empresas peruanas');
