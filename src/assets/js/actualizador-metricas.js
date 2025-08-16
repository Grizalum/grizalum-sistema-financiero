// ================================================================
// 📊 GRIZALUM ACTUALIZADOR DE MÉTRICAS - VERSIÓN OPTIMIZADA 2.0
// Sistema eficiente y liviano para actualización de KPIs financieros
// ================================================================

/**
 * GRIZALUM Metrics Updater
 * Actualizador optimizado de métricas financieras con animaciones profesionales
 * Diseñado específicamente para empresas peruanas
 */

class GrizalumMetricsUpdater {
    constructor() {
        this.isInitialized = false;
        this.config = null;
        this.elements = new Map();
        this.animations = new Map();
        
        console.log('📊 Inicializando Actualizador de Métricas v2.0...');
    }

    // ======= INICIALIZACIÓN =======
    initialize() {
        try {
            // Cargar configuración
            this.loadConfiguration();
            
            // Mapear elementos del DOM
            this.mapDOMElements();
            
            // Agregar estilos CSS
            this.injectStyles();
            
            // Configurar eventos
            this.bindEvents();
            
            this.isInitialized = true;
            console.log('✅ Actualizador de Métricas inicializado');
            
            return true;
            
        } catch (error) {
            console.error('❌ Error inicializando Actualizador de Métricas:', error);
            return false;
        }
    }

    loadConfiguration() {
        // Usar configuración global o valores por defecto
        this.config = {
            currency: window.GRIZALUM_CONFIG?.currency || 'PEN',
            locale: window.GRIZALUM_CONFIG?.locale || 'es-PE',
            financial: window.GRIZALUM_CONFIG?.financial || {
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
        
        console.log('⚙️ Configuración de métricas cargada');
    }

    mapDOMElements() {
        // Definir elementos de métricas principales
        const metricsMap = [
            { id: 'revenueValue', type: 'currency', label: 'Ingresos Totales' },
            { id: 'expensesValue', type: 'currency', label: 'Gastos Operativos' },
            { id: 'profitValue', type: 'currency', label: 'Utilidad Neta' },
            { id: 'growthValue', type: 'percentage', label: 'Crecimiento' },
            { id: 'sidebarCashFlow', type: 'currency', label: 'Flujo de Caja' },
            { id: 'sidebarProfit', type: 'currency', label: 'Utilidad Sidebar' }
        ];

        let found = 0;
        metricsMap.forEach(({ id, type, label }) => {
            const element = document.getElementById(id);
            if (element) {
                this.elements.set(id, {
                    element,
                    type,
                    label,
                    currentValue: this.extractNumericValue(element.textContent),
                    previousValue: 0
                });
                found++;
            }
        });
        
        console.log(`📍 Elementos de métricas mapeados: ${found}/${metricsMap.length}`);
    }

    // ======= API PRINCIPAL =======
    updateMetrics(data) {
        if (!this.isInitialized || !data) {
            console.warn('⚠️ Actualizador no inicializado o datos inválidos');
            return false;
        }

        console.log('📊 Actualizando métricas financieras...');

        // Mapeo de propiedades de datos a elementos
        const dataMap = {
            // Datos en español
            ingresos: 'revenueValue',
            gastos: 'expensesValue',
            utilidad: 'profitValue',
            crecimiento: 'growthValue',
            flujo_caja: 'sidebarCashFlow',
            flujoCaja: 'sidebarCashFlow',
            
            // Datos en inglés (compatibilidad)
            revenue: 'revenueValue',
            expenses: 'expensesValue',
            profit: 'profitValue',
            growth: 'growthValue',
            cashFlow: 'sidebarCashFlow'
        };

        let updated = 0;
        
        // Procesar cada dato
        Object.entries(data).forEach(([key, value]) => {
            const elementId = dataMap[key] || key;
            
            if (this.elements.has(elementId)) {
                this.updateSingleMetric(elementId, value);
                updated++;
            }
        });

        // Actualizar sidebar profit si hay datos de utilidad
        if (data.profit !== undefined || data.utilidad !== undefined) {
            const profitValue = data.profit || data.utilidad;
            this.updateSingleMetric('sidebarProfit', profitValue);
        }

        console.log(`✅ ${updated} métricas actualizadas`);
        return true;
    }

    updateSingleMetric(elementId, newValue) {
        const metric = this.elements.get(elementId);
        if (!metric) return;

        const numericValue = this.extractNumericValue(newValue);
        const previousValue = metric.currentValue;

        // Actualizar valores
        metric.previousValue = previousValue;
        metric.currentValue = numericValue;

        // Animar cambio
        this.animateMetricChange(elementId, previousValue, numericValue, metric.type);

        // Mostrar efecto visual si hay cambio significativo
        const change = numericValue - previousValue;
        if (Math.abs(change) > Math.abs(previousValue) * 0.05) { // Cambio > 5%
            this.showChangeEffect(metric.element, change);
        }
    }

    // ======= ANIMACIONES =======
    animateMetricChange(elementId, fromValue, toValue, type) {
        const metric = this.elements.get(elementId);
        if (!metric) return;

        // Cancelar animación anterior
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

        // Aplicar clase de animación
        element.classList.add('metric-updating');

        const animation = setInterval(() => {
            currentStep++;
            currentValue += increment;

            // Valor final en el último paso
            const displayValue = currentStep === steps ? toValue : currentValue;
            
            // Actualizar elemento
            element.textContent = this.formatValue(displayValue, type);

            // Finalizar animación
            if (currentStep >= steps) {
                clearInterval(animation);
                this.animations.delete(elementId);
                element.classList.remove('metric-updating');
                
                // Trigger evento de actualización
                this.triggerUpdateEvent(elementId, fromValue, toValue);
            }
        }, this.config.animation.counter_speed);

        this.animations.set(elementId, animation);
    }

    showChangeEffect(element, changeValue) {
        const isIncrease = changeValue > 0;
        const effectClass = isIncrease ? 'metric-increase' : 'metric-decrease';
        
        // Aplicar efecto
        element.classList.add(effectClass);
        
        // Crear indicador de cambio
        this.createChangeIndicator(element, changeValue, isIncrease);
        
        // Remover efecto
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
        
        // Posicionar indicador
        const rect = element.getBoundingClientRect();
        indicator.style.position = 'fixed';
        indicator.style.left = `${rect.right + 10}px`;
        indicator.style.top = `${rect.top}px`;
        indicator.style.zIndex = '1000';
        
        document.body.appendChild(indicator);
        
        // Animar y remover
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

    // ======= FORMATEO =======
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
            return value; // Ya formateado
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
        
        // Extraer número de texto con símbolos de moneda
        const cleanText = text.toString()
            .replace(/[S\/\.\s,₡$€£¥%]/g, '')
            .replace(/[^\d\.-]/g, '');
        
        const number = parseFloat(cleanText);
        return isNaN(number) ? 0 : number;
    }

    // ======= UTILIDADES =======
    updateForPeriod(period) {
        console.log(`📅 Métricas actualizadas para período: ${period}`);
        
        // Aquí podrías implementar lógica específica por período
        // Por ejemplo, cargar datos diferentes según el período
        
        // Disparar evento para notificar a otros módulos
        const event = new CustomEvent('metricsUpdatedForPeriod', {
            detail: { period, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
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

    // ======= EVENTOS =======
    bindEvents() {
        // Escuchar cambios de período
        document.addEventListener('periodChanged', (e) => {
            if (e.detail?.period) {
                this.updateForPeriod(e.detail.period);
            }
        });

        // Escuchar cambios de empresa
        document.addEventListener('companyChanged', (e) => {
            if (e.detail?.data) {
                this.updateMetrics(e.detail.data);
            }
        });

        console.log('🔗 Eventos de métricas configurados');
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

    // ======= ESTILOS CSS =======
    injectStyles() {
        const styleId = 'grizalum-metrics-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            /* Estilos para animaciones de métricas */
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
        console.log('🎨 Estilos de métricas inyectados');
    }

    // ======= API PÚBLICA =======
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            elementsCount: this.elements.size,
            activeAnimations: this.animations.size,
            config: this.config
        };
    }
}

// ======= INSTANCIA GLOBAL =======
const grizalumMetricsUpdater = new GrizalumMetricsUpdater();

// ======= FUNCIONES DE COMPATIBILIDAD =======

/**
 * Función principal para actualizar métricas (compatibilidad)
 */
function actualizarMetricas(data) {
    return grizalumMetricsUpdater.updateMetrics(data);
}

/**
 * Función para actualizar sidebar específicamente
 */
function actualizarSidebar(data) {
    if (!data) return false;
    
    const sidebarData = {};
    if (data.cashFlow !== undefined) sidebarData.cashFlow = data.cashFlow;
    if (data.profit !== undefined) sidebarData.profit = data.profit;
    if (data.flujoCaja !== undefined) sidebarData.cashFlow = data.flujoCaja;
    if (data.utilidad !== undefined) sidebarData.profit = data.utilidad;
    
    return grizalumMetricsUpdater.updateMetrics(sidebarData);
}

// ======= INICIALIZACIÓN =======
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización con retraso para asegurar que el DOM esté listo
    setTimeout(() => {
        grizalumMetricsUpdater.initialize();
    }, 600);
});

// ======= EXPORTACIÓN GLOBAL =======

// API principal
window.GrizalumMetrics = grizalumMetricsUpdater;

// Funciones de compatibilidad
window.actualizarMetricas = actualizarMetricas;
window.actualizarSidebar = actualizarSidebar;

// Alias para compatibilidad con código existente
window.actualizarKPIs = actualizarMetricas;

console.log('📊 GRIZALUM Metrics Updater v2.0 cargado');
console.log('✨ Funcionalidades:');
console.log('  • 📊 Actualización animada de métricas');
console.log('  • 💰 Formato de moneda peruana optimizado');
console.log('  • 📈 Indicadores visuales de cambios');
console.log('  • ⚡ Animaciones suaves y profesionales');
console.log('  • 🔗 Integración con sistema de períodos');
console.log('  • 📱 Optimizado para rendimiento');
console.log('🚀 Actualizador de métricas listo para empresas peruanas');
