// ================================================================
// GRIZALUM ACTUALIZADOR DE MÉTRICAS v3.0 - SOLO DATOS REALES
// Sistema conectado 100% con el gestor de empresas
// ================================================================

class GrizalumMetricsUpdater {
    constructor() {
        this.isInitialized = false;
        this.config = null;
        this.elements = new Map();
        this.animations = new Map();
        this.defaultData = null;
        
        console.log('Inicializando Actualizador de Métricas v3.0...');
    }

    // INICIALIZACIÓN
    initialize() {
        try {
            this.loadConfiguration();
            this.loadDefaultData();
            this.mapDOMElements();
            this.injectStyles();
            this.bindEvents();
            this.initializeWithDefaults();
            
            this.isInitialized = true;
            console.log('Actualizador de Métricas inicializado');
            
            return true;
            
        } catch (error) {
            console.error('Error inicializando Actualizador de Métricas:', error);
            return false;
        }
    }

    loadConfiguration() {
        this.config = {
            currency: 'PEN',
            locale: 'es-PE',
            financial: {
                currency_symbol: 'S/.',
                decimal_places: 0,
                thousand_separator: ',',
                update_interval: 30000
            },
            animation: {
                duration: 800,
                easing: 'ease-out',
                counter_speed: 50
            }
        };
    }

    loadDefaultData() {
        // CORREGIDO: Solo ceros, sin datos ficticios
        this.defaultData = {
            ingresos: 0,
            gastos: 0,
            utilidad: 0,
            crecimiento: 0,
            flujoCaja: 0
        };
    }

    mapDOMElements() {
        const metricsMap = [
            { id: 'revenueValue', type: 'currency', label: 'Ingresos Totales', defaultKey: 'ingresos' },
            { id: 'expensesValue', type: 'currency', label: 'Gastos Operativos', defaultKey: 'gastos' },
            { id: 'profitValue', type: 'currency', label: 'Utilidad Neta', defaultKey: 'utilidad' },
            { id: 'growthValue', type: 'percentage', label: 'Crecimiento', defaultKey: 'crecimiento' },
            { id: 'sidebarCashFlow', type: 'currency', label: 'Flujo de Caja', defaultKey: 'flujoCaja' },
            { id: 'sidebarProfit', type: 'currency', label: 'Utilidad Sidebar', defaultKey: 'utilidad' }
        ];

        metricsMap.forEach(({ id, type, label, defaultKey }) => {
            const element = document.getElementById(id);
            if (element) {
                this.elements.set(id, {
                    element,
                    type,
                    label,
                    defaultKey,
                    currentValue: this.extractNumericValue(element.textContent),
                    previousValue: 0
                });
            }
        });
    }

    initializeWithDefaults() {
        console.log('Inicializando con datos por defecto (0)...');
        
        try {
            this.elements.forEach((metric, id) => {
                const defaultValue = this.defaultData[metric.defaultKey];
                if (defaultValue !== undefined) {
                    const formattedValue = this.formatValue(defaultValue, metric.type);
                    metric.element.textContent = formattedValue;
                    metric.currentValue = defaultValue;
                }
            });
        } catch (error) {
            console.error('Error en inicialización por defecto:', error);
        }
    }

    // API PRINCIPAL - CORREGIDA
    updateMetrics(data) {
        if (!this.isInitialized || !data) {
            console.warn('Actualizador no inicializado o datos inválidos');
            return false;
        }

        console.log('Actualizando métricas financieras...', data);

        const dataMap = {
            // Español
            ingresos: 'revenueValue',
            ingresosTotales: 'revenueValue',
            gastos: 'expensesValue',
            gastosOperativos: 'expensesValue',
            utilidad: 'profitValue',
            utilidadNeta: 'profitValue',
            crecimiento: 'growthValue',
            flujo_caja: 'sidebarCashFlow',
            flujoCaja: 'sidebarCashFlow',
            
            // Inglés
            revenue: 'revenueValue',
            totalRevenue: 'revenueValue',
            expenses: 'expensesValue',
            operatingExpenses: 'expensesValue',
            profit: 'profitValue',
            netProfit: 'profitValue',
            growth: 'growthValue',
            cashFlow: 'sidebarCashFlow'
        };

        let updated = 0;
        
        Object.entries(data).forEach(([key, value]) => {
            const elementId = dataMap[key] || key;
            
            if (this.elements.has(elementId)) {
                this.updateSingleMetric(elementId, value);
                updated++;
            }
        });

        // Actualizar sidebar profit
        if (data.profit !== undefined || data.utilidad !== undefined || data.utilidadNeta !== undefined) {
            const profitValue = data.profit || data.utilidad || data.utilidadNeta;
            if (this.elements.has('sidebarProfit')) {
                this.updateSingleMetric('sidebarProfit', profitValue);
                updated++;
            }
        }

        console.log(`${updated} métricas actualizadas exitosamente`);
        
        this.triggerGlobalUpdateEvent(data, updated);
        
        return true;
    }

    updateSingleMetric(elementId, newValue) {
        const metric = this.elements.get(elementId);
        if (!metric) return;

        const numericValue = this.extractNumericValue(newValue);
        const previousValue = metric.currentValue;

        metric.previousValue = previousValue;
        metric.currentValue = numericValue;

        this.animateMetricChange(elementId, previousValue, numericValue, metric.type);

        const change = numericValue - previousValue;
        if (Math.abs(change) > Math.abs(previousValue) * 0.05) {
            this.showChangeEffect(metric.element, change);
        }
    }

    // ANIMACIONES
    animateMetricChange(elementId, fromValue, toValue, type) {
        const metric = this.elements.get(elementId);
        if (!metric) return;

        if (this.animations.has(elementId)) {
            clearInterval(this.animations.get(elementId));
            this.animations.delete(elementId);
        }

        const element = metric.element;
        const duration = this.config.animation.duration;
        const steps = Math.ceil(duration / this.config.animation.counter_speed);
        const increment = (toValue - fromValue) / steps;
        
        let currentValue = fromValue;
        let currentStep = 0;

        element.classList.add('metric-updating');

        const animation = setInterval(() => {
            currentStep++;
            currentValue += increment;

            const displayValue = currentStep === steps ? toValue : currentValue;
            element.textContent = this.formatValue(displayValue, type);

            if (currentStep >= steps) {
                clearInterval(animation);
                this.animations.delete(elementId);
                element.classList.remove('metric-updating');
                this.triggerUpdateEvent(elementId, fromValue, toValue);
            }
        }, this.config.animation.counter_speed);

        this.animations.set(elementId, animation);
    }

    showChangeEffect(element, changeValue) {
        const isIncrease = changeValue > 0;
        const effectClass = isIncrease ? 'metric-increase' : 'metric-decrease';
        
        element.classList.add(effectClass);
        this.createChangeIndicator(element, changeValue, isIncrease);
        
        setTimeout(() => {
            element.classList.remove(effectClass);
        }, 1000);
    }

    createChangeIndicator(element, changeValue, isIncrease) {
        const indicator = document.createElement('div');
        indicator.className = `metric-change-indicator ${isIncrease ? 'positive' : 'negative'}`;
        indicator.innerHTML = `
            <i class="fas fa-arrow-${isIncrease ? 'up' : 'down'}"></i>
            <span>${isIncrease ? '+' : ''}${this.formatValue(Math.abs(changeValue), 'currency', true)}</span>
        `;
        
        const rect = element.getBoundingClientRect();
        indicator.style.position = 'fixed';
        indicator.style.left = `${rect.right + 10}px`;
        indicator.style.top = `${rect.top}px`;
        indicator.style.zIndex = '1000';
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(-20px)';
        }, 100);
        
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 1500);
    }

    // FORMATEO
    formatValue(value, type, abbreviated = false) {
        if (typeof value !== 'number') {
            value = this.extractNumericValue(value);
        }

        switch (type) {
            case 'currency':
                return this.formatCurrency(value, abbreviated);
            case 'percentage':
                return this.formatPercentage(value);
            default:
                return this.formatNumber(value);
        }
    }

    formatCurrency(value, abbreviated = false) {
        const { currency_symbol, decimal_places } = this.config.financial;
        
        if (abbreviated && value >= 1000000) {
            return `${currency_symbol} ${(value / 1000000).toFixed(1)}M`;
        } else if (abbreviated && value >= 1000) {
            return `${currency_symbol} ${(value / 1000).toFixed(0)}K`;
        }
        
        return new Intl.NumberFormat(this.config.locale, {
            style: 'currency',
            currency: this.config.currency,
            minimumFractionDigits: decimal_places,
            maximumFractionDigits: decimal_places
        }).format(value);
    }

    formatPercentage(value) {
        if (typeof value === 'string' && value.includes('%')) {
            return value;
        }
        
        const numValue = typeof value === 'number' ? value : this.extractNumericValue(value);
        const sign = numValue >= 0 ? '+' : '';
        return `${sign}${numValue.toFixed(1)}%`;
    }

    formatNumber(value) {
        return new Intl.NumberFormat(this.config.locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(value);
    }

    extractNumericValue(text) {
        if (typeof text === 'number') return text;
        if (!text || text === undefined || text === null) return 0;
        
        const cleanText = text.toString()
            .replace(/[S\/\.\s,₡$€£¥%]/g, '')
            .replace(/[^\d\.-]/g, '');
        
        const number = parseFloat(cleanText);
        return isNaN(number) ? 0 : number;
    }

    // UTILIDADES - CORREGIDO: Obtener datos del gestor real
    updateForPeriod(period) {
        console.log(`Actualizando métricas para período: ${period}`);
        
        try {
            // CORREGIDO: Obtener datos reales del gestor
            const datosReales = this.obtenerDatosDelGestor();
            
            if (datosReales) {
                this.updateMetrics(datosReales);
                console.log(`Métricas actualizadas para período: ${period}`, datosReales);
                return true;
            } else {
                console.warn('No hay datos disponibles del gestor');
                return false;
            }
        } catch (error) {
            console.error(`Error actualizando para período ${period}:`, error);
            return false;
        }
    }

    // NUEVA FUNCIÓN: Obtener datos del gestor real
    obtenerDatosDelGestor() {
        if (window.obtenerDatosActuales && typeof window.obtenerDatosActuales === 'function') {
            const datos = window.obtenerDatosActuales();
            if (datos && datos.financiero) {
                return datos.financiero;
            }
        }
        
        // Fallback: devolver datos en 0
        return this.defaultData;
    }

    getCurrentMetrics() {
        const metrics = {};
        this.elements.forEach((metric, id) => {
            metrics[id] = {
                value: metric.currentValue,
                previousValue: metric.previousValue,
                label: metric.label,
                type: metric.type,
                formattedValue: this.formatValue(metric.currentValue, metric.type)
            };
        });
        return metrics;
    }

    // EVENTOS - CORREGIDO: Conectado con datos-empresas.js
    bindEvents() {
        // Escuchar cambios de período
        document.addEventListener('grizalumPeriodoCambiado', (e) => {
            if (e.detail && e.detail.periodo) {
                this.updateForPeriod(e.detail.periodo);
            }
        });

        // CRÍTICO: Escuchar datos actualizados del gestor
        document.addEventListener('grizalumDatosActualizados', (e) => {
            if (e.detail && e.detail.datos && e.detail.datos.financiero) {
                this.updateMetrics(e.detail.datos.financiero);
            }
        });

        // Escuchar cambios de empresa
        document.addEventListener('grizalumCompanyChanged', (e) => {
            if (e.detail && e.detail.company) {
                const datosReales = this.obtenerDatosDelGestor();
                if (datosReales) {
                    this.updateMetrics(datosReales);
                }
            }
        });

        console.log('Eventos de métricas configurados');
    }

    triggerUpdateEvent(elementId, oldValue, newValue) {
        const event = new CustomEvent('metricUpdated', {
            detail: {
                elementId,
                oldValue,
                newValue,
                change: newValue - oldValue,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    triggerGlobalUpdateEvent(data, updatedCount) {
        const event = new CustomEvent('grizalumMetricsUpdated', {
            detail: {
                data,
                updatedCount,
                totalElements: this.elements.size,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    // ESTILOS CSS
    injectStyles() {
        const styleId = 'grizalum-metrics-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            .metric-updating {
                transition: transform 0.2s ease;
            }
            
            .metric-increase {
                animation: metricIncrease 1s ease;
            }
            
            .metric-decrease {
                animation: metricDecrease 1s ease;
            }
            
            .metric-change-indicator {
                position: fixed;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.3s ease;
                pointer-events: none;
                z-index: 9999;
            }
            
            .metric-change-indicator.positive {
                background: rgba(16, 185, 129, 0.9);
            }
            
            .metric-change-indicator.negative {
                background: rgba(239, 68, 68, 0.9);
            }
            
            @keyframes metricIncrease {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); color: #10b981; }
                100% { transform: scale(1); }
            }
            
            @keyframes metricDecrease {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); color: #ef4444; }
                100% { transform: scale(1); }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // API PÚBLICA
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            elementsCount: this.elements.size,
            activeAnimations: this.animations.size,
            elements: Array.from(this.elements.keys())
        };
    }

    forceUpdate() {
        console.log('Forzando actualización con datos del gestor...');
        const datosReales = this.obtenerDatosDelGestor();
        this.updateMetrics(datosReales);
    }
}

// INSTANCIA GLOBAL
const grizalumMetricsUpdater = new GrizalumMetricsUpdater();

// FUNCIONES DE COMPATIBILIDAD
function actualizarMetricas(data) {
    if (!data) {
        console.warn('Datos nulos para actualizar métricas');
        return false;
    }
    
    return grizalumMetricsUpdater.updateMetrics(data);
}

function actualizarSidebar(data) {
    if (!data) return false;
    
    const sidebarData = {};
    if (data.cashFlow !== undefined) sidebarData.cashFlow = data.cashFlow;
    if (data.profit !== undefined) sidebarData.profit = data.profit;
    if (data.flujoCaja !== undefined) sidebarData.cashFlow = data.flujoCaja;
    if (data.utilidad !== undefined) sidebarData.profit = data.utilidad;
    
    return grizalumMetricsUpdater.updateMetrics(sidebarData);
}

function forzarActualizacionMetricas() {
    return grizalumMetricsUpdater.forceUpdate();
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando métricas...');
    
    setTimeout(() => {
        const success = grizalumMetricsUpdater.initialize();
        if (success) {
            console.log('Métricas inicializadas correctamente');
        } else {
            console.error('Error inicializando métricas');
        }
    }, 800);
});

// EXPORTACIÓN GLOBAL
window.GrizalumMetrics = grizalumMetricsUpdater;
window.actualizarMetricas = actualizarMetricas;
window.actualizarSidebar = actualizarSidebar;
window.forzarActualizacionMetricas = forzarActualizacionMetricas;
window.actualizarKPIs = actualizarMetricas;

console.log('GRIZALUM Metrics Updater v3.0 cargado - Solo datos reales');
