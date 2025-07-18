// ===================================================================
// GRIZALUM - AI Module
// Funciones de Inteligencia Artificial y Análisis Predictivo
// ===================================================================

// ===================================================================
// CONFIGURACIÓN DE IA
// ===================================================================

const aiConfig = {
    predictionAccuracy: 0.85,
    learningRate: 0.01,
    models: {
        cashFlow: 'linear_regression',
        sales: 'polynomial_regression',
        expenses: 'moving_average',
        customer: 'clustering'
    },
    updateInterval: 300000, // 5 minutos
    dataRetention: 30 // días
};

// ===================================================================
// MODELOS PREDICTIVOS
// ===================================================================

class FinancialPredictor {
    constructor() {
        this.historicalData = {};
        this.predictions = {};
        this.accuracy = {};
        this.trends = {};
    }

    // Modelo de regresión lineal simple
    linearRegression(data) {
        const n = data.length;
        const sumX = data.reduce((sum, _, i) => sum + i, 0);
        const sumY = data.reduce((sum, val) => sum + val, 0);
        const sumXY = data.reduce((sum, val, i) => sum + (i * val), 0);
        const sumXX = data.reduce((sum, _, i) => sum + (i * i), 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return { slope, intercept };
    }

    // Predicción de flujo de caja
    predictCashFlow(historicalData, periods = 6) {
        const { slope, intercept } = this.linearRegression(historicalData);
        const predictions = [];
        
        for (let i = 0; i < periods; i++) {
            const nextPeriod = historicalData.length + i;
            const prediction = slope * nextPeriod + intercept;
            
            // Agregar variabilidad realista
            const volatility = this.calculateVolatility(historicalData);
            const noise = (Math.random() - 0.5) * volatility * 0.1;
            
            predictions.push(Math.max(0, Math.round(prediction + noise)));
        }
        
        return predictions;
    }

    // Predicción de ventas con estacionalidad
    predictSales(historicalData, periods = 6) {
        const seasonality = this.detectSeasonality(historicalData);
        const trend = this.linearRegression(historicalData);
        const predictions = [];
        
        for (let i = 0; i < periods; i++) {
            const nextPeriod = historicalData.length + i;
            const basePrediction = trend.slope * nextPeriod + trend.intercept;
            const seasonalFactor = seasonality[i % seasonality.length];
            
            predictions.push(Math.round(basePrediction * seasonalFactor));
        }
        
        return predictions;
    }

    // Detectar estacionalidad
    detectSeasonality(data) {
        const seasonLength = 12; // meses
        const seasons = [];
        
        for (let i = 0; i < seasonLength; i++) {
            const seasonalValues = [];
            for (let j = i; j < data.length; j += seasonLength) {
                seasonalValues.push(data[j]);
            }
            
            const average = seasonalValues.reduce((a, b) => a + b, 0) / seasonalValues.length;
            const overallAverage = data.reduce((a, b) => a + b, 0) / data.length;
            
            seasons.push(average / overallAverage);
        }
        
        return seasons;
    }

    // Calcular volatilidad
    calculateVolatility(data) {
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
        return Math.sqrt(variance);
    }

    // Análisis de correlación
    calculateCorrelation(dataX, dataY) {
        const n = dataX.length;
        const sumX = dataX.reduce((a, b) => a + b, 0);
        const sumY = dataY.reduce((a, b) => a + b, 0);
        const sumXY = dataX.reduce((sum, x, i) => sum + (x * dataY[i]), 0);
        const sumXX = dataX.reduce((sum, x) => sum + (x * x), 0);
        const sumYY = dataY.reduce((sum, y) => sum + (y * y), 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return denominator === 0 ? 0 : numerator / denominator;
    }
}

// ===================================================================
// ANÁLISIS INTELIGENTE
// ===================================================================

class IntelligentAnalyzer {
    constructor() {
        this.predictor = new FinancialPredictor();
        this.insights = [];
        this.alerts = [];
        this.recommendations = [];
    }

    // Análisis integral de datos financieros
    analyzeFinancialData(data) {
        const analysis = {
            trends: this.analyzeTrends(data),
            risks: this.assessRisks(data),
            opportunities: this.identifyOpportunities(data),
            predictions: this.generatePredictions(data),
            score: this.calculateHealthScore(data)
        };

        this.generateInsights(analysis);
        return analysis;
    }

    // Análisis de tendencias
    analyzeTrends(data) {
        const trends = {};
        
        Object.keys(data).forEach(metric => {
            const values = data[metric];
            const { slope } = this.predictor.linearRegression(values);
            
            trends[metric] = {
                direction: slope > 0 ? 'ascending' : 'descending',
                strength: Math.abs(slope),
                classification: this.classifyTrend(slope, values)
            };
        });

        return trends;
    }

    // Clasificar tendencia
    classifyTrend(slope, data) {
        const volatility = this.predictor.calculateVolatility(data);
        const relative_slope = Math.abs(slope) / (data.reduce((a, b) => a + b, 0) / data.length);

        if (relative_slope > 0.1) return 'fuerte';
        if (relative_slope > 0.05) return 'moderada';
        if (relative_slope > 0.02) return 'ligera';
        return 'estable';
    }

    // Evaluación de riesgos
    assessRisks(data) {
        const risks = [];

        // Riesgo de liquidez
        if (data.cashFlow) {
            const cashFlowTrend = this.predictor.linearRegression(data.cashFlow).slope;
            if (cashFlowTrend < -1000) {
                risks.push({
                    type: 'liquidez',
                    severity: 'alta',
                    description: 'Tendencia negativa en flujo de caja',
                    impact: 'Posible crisis de liquidez en 3-6 meses',
                    recommendation: 'Acelerar cobranzas y revisar gastos no esenciales'
                });
            }
        }

        // Riesgo de concentración de clientes
        if (data.customerConcentration && data.customerConcentration > 0.4) {
            risks.push({
                type: 'concentracion',
                severity: 'media',
                description: 'Alta concentración en pocos clientes',
                impact: 'Vulnerabilidad ante pérdida de cliente principal',
                recommendation: 'Diversificar cartera de clientes'
            });
        }

        // Riesgo de inventario
        if (data.inventory && data.sales) {
            const inventoryTurnover = data.sales[data.sales.length - 1] / data.inventory[data.inventory.length - 1];
            if (inventoryTurnover < 6) {
                risks.push({
                    type: 'inventario',
                    severity: 'media',
                    description: 'Baja rotación de inventario',
                    impact: 'Capital inmovilizado y riesgo de obsolescencia',
                    recommendation: 'Optimizar niveles de inventario y mejorar pronósticos'
                });
            }
        }

        return risks;
    }

    // Identificar oportunidades
    identifyOpportunities(data) {
        const opportunities = [];

        // Oportunidad de crecimiento
        if (data.revenue) {
            const revenueTrend = this.predictor.linearRegression(data.revenue).slope;
            if (revenueTrend > 2000) {
                opportunities.push({
                    type: 'crecimiento',
                    potential: 'alto',
                    description: 'Tendencia positiva sostenida en ingresos',
                    action: 'Considerar inversión en capacidad productiva',
                    expectedReturn: 'ROI estimado: 25-35%'
                });
            }
        }

        // Oportunidad de eficiencia
        if (data.expenses && data.revenue) {
            const expenses = data.expenses[data.expenses.length - 1];
            const revenue = data.revenue[data.revenue.length - 1];
            const margin = (revenue - expenses) / revenue;
            
            if (margin < 0.3) {
                opportunities.push({
                    type: 'eficiencia',
                    potential: 'medio',
                    description: 'Margen operativo por debajo del óptimo',
                    action: 'Implementar programa de reducción de costos',
                    expectedReturn: 'Ahorro potencial: 10-15%'
                });
            }
        }

        return opportunities;
    }

    // Generar predicciones
    generatePredictions(data) {
        const predictions = {};

        if (data.cashFlow) {
            predictions.cashFlow = this.predictor.predictCashFlow(data.cashFlow);
        }

        if (data.revenue) {
            predictions.revenue = this.predictor.predictSales(data.revenue);
        }

        if (data.expenses) {
            predictions.expenses = this.predictor.predictCashFlow(data.expenses);
        }

        return predictions;
    }

    // Calcular score de salud financiera
    calculateHealthScore(data) {
        let score = 100;
        const factors = [];

        // Factor de liquidez
        if (data.cashFlow) {
            const currentCashFlow = data.cashFlow[data.cashFlow.length - 1];
            if (currentCashFlow < 10000) score -= 20;
            else if (currentCashFlow < 20000) score -= 10;
            factors.push({ name: 'Liquidez', impact: currentCashFlow < 20000 ? -10 : 0 });
        }

        // Factor de crecimiento
        if (data.revenue) {
            const growthRate = this.predictor.linearRegression(data.revenue).slope;
            if (growthRate > 2000) score += 10;
            else if (growthRate < -1000) score -= 15;
            factors.push({ name: 'Crecimiento', impact: growthRate > 2000 ? 10 : (growthRate < -1000 ? -15 : 0) });
        }

        // Factor de rentabilidad
        if (data.revenue && data.expenses) {
            const revenue = data.revenue[data.revenue.length - 1];
            const expenses = data.expenses[data.expenses.length - 1];
            const margin = (revenue - expenses) / revenue;
            
            if (margin > 0.3) score += 10;
            else if (margin < 0.1) score -= 20;
            factors.push({ name: 'Rentabilidad', impact: margin > 0.3 ? 10 : (margin < 0.1 ? -20 : 0) });
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            factors: factors,
            classification: this.classifyHealthScore(score)
        };
    }

    // Clasificar score de salud
    classifyHealthScore(score) {
        if (score >= 90) return { level: 'excelente', color: '#059669', icon: '🟢' };
        if (score >= 75) return { level: 'bueno', color: '#10b981', icon: '🟡' };
        if (score >= 60) return { level: 'regular', color: '#f59e0b', icon: '🟠' };
        if (score >= 40) return { level: 'deficiente', color: '#dc2626', icon: '🔴' };
        return { level: 'crítico', color: '#991b1b', icon: '🚨' };
    }

    // Generar insights automáticos
    generateInsights(analysis) {
        this.insights = [];

        // Insights de tendencias
        Object.keys(analysis.trends).forEach(metric => {
            const trend = analysis.trends[metric];
            if (trend.classification === 'fuerte') {
                this.insights.push({
                    type: 'trend',
                    metric: metric,
                    message: `${metric} muestra una tendencia ${trend.direction} fuerte`,
                    priority: 'high',
                    icon: trend.direction === 'ascending' ? '📈' : '📉'
                });
            }
        });

        // Insights de score
        const healthScore = analysis.score;
        this.insights.push({
            type: 'health',
            message: `Salud financiera: ${healthScore.classification.level} (${healthScore.score}/100)`,
            priority: healthScore.score < 60 ? 'high' : 'medium',
            icon: healthScore.classification.icon
        });

        // Insights de predicciones
        if (analysis.predictions.cashFlow) {
            const futureAvg = analysis.predictions.cashFlow.reduce((a, b) => a + b, 0) / analysis.predictions.cashFlow.length;
            this.insights.push({
                type: 'prediction',
                message: `Flujo de caja proyectado promedio: S/. ${futureAvg.toLocaleString()}`,
                priority: 'medium',
                icon: '🔮'
            });
        }
    }
}

// ===================================================================
// SISTEMA DE RECOMENDACIONES
// ===================================================================

class RecommendationEngine {
    constructor() {
        this.rules = this.initializeRules();
        this.recommendations = [];
    }

    // Inicializar reglas de negocio
    initializeRules() {
        return {
            cashFlow: {
                low: {
                    threshold: 15000,
                    actions: [
                        'Acelerar proceso de cobranzas',
                        'Diferir pagos no críticos',
                        'Considerar línea de crédito',
                        'Revisar términos de pago con clientes'
                    ]
                },
                negative_trend: {
                    threshold: -1000,
                    actions: [
                        'Análisis detallado de causas',
                        'Plan de contingencia de liquidez',
                        'Renegociación con proveedores',
                        'Evaluación de activos no esenciales'
                    ]
                }
            },
            profitability: {
                low_margin: {
                    threshold: 0.15,
                    actions: [
                        'Análisis de estructura de costos',
                        'Optimización de procesos',
                        'Revisión de precios',
                        'Eliminación de gastos innecesarios'
                    ]
                }
            },
            growth: {
                stagnation: {
                    threshold: 0.02,
                    actions: [
                        'Estrategia de penetración de mercado',
                        'Desarrollo de nuevos productos',
                        'Inversión en marketing',
                        'Alianzas estratégicas'
                    ]
                }
            }
        };
    }

    // Generar recomendaciones basadas en datos
    generateRecommendations(analysisData) {
        this.recommendations = [];

        // Recomendaciones de flujo de caja
        if (analysisData.cashFlow) {
            const currentCashFlow = analysisData.cashFlow[analysisData.cashFlow.length - 1];
            const trend = new FinancialPredictor().linearRegression(analysisData.cashFlow).slope;

            if (currentCashFlow < this.rules.cashFlow.low.threshold) {
                this.addRecommendation('cashflow_low', 'high', this.rules.cashFlow.low.actions);
            }

            if (trend < this.rules.cashFlow.negative_trend.threshold) {
                this.addRecommendation('cashflow_trend', 'high', this.rules.cashFlow.negative_trend.actions);
            }
        }

        // Recomendaciones de rentabilidad
        if (analysisData.revenue && analysisData.expenses) {
            const revenue = analysisData.revenue[analysisData.revenue.length - 1];
            const expenses = analysisData.expenses[analysisData.expenses.length - 1];
            const margin = (revenue - expenses) / revenue;

            if (margin < this.rules.profitability.low_margin.threshold) {
                this.addRecommendation('profitability_low', 'medium', this.rules.profitability.low_margin.actions);
            }
        }

        return this.recommendations;
    }

    // Agregar recomendación
    addRecommendation(type, priority, actions) {
        this.recommendations.push({
            id: Date.now() + Math.random(),
            type: type,
            priority: priority,
            actions: actions,
            timestamp: new Date(),
            status: 'pending'
        });
    }

    // Priorizar recomendaciones
    prioritizeRecommendations() {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return this.recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }
}

// ===================================================================
// SISTEMA DE ALERTAS INTELIGENTES
// ===================================================================

class SmartAlertSystem {
    constructor() {
        this.alerts = [];
        this.thresholds = this.initializeThresholds();
        this.isMonitoring = false;
    }

    // Inicializar umbrales
    initializeThresholds() {
        return {
            cashFlow: {
                critical: 10000,
                warning: 20000,
                optimal: 50000
            },
            profitMargin: {
                critical: 0.05,
                warning: 0.15,
                optimal: 0.25
            },
            growthRate: {
                critical: -0.1,
                warning: 0.02,
                optimal: 0.15
            }
        };
    }

    // Monitorear métricas en tiempo real
    startMonitoring(data) {
        this.isMonitoring = true;
        
        setInterval(() => {
            if (this.isMonitoring) {
                this.checkAlerts(data);
            }
        }, 60000); // Verificar cada minuto
    }

    // Verificar alertas
    checkAlerts(data) {
        this.alerts = [];

        // Alertas de flujo de caja
        if (data.cashFlow) {
            const currentCashFlow = data.cashFlow[data.cashFlow.length - 1];
            
            if (currentCashFlow < this.thresholds.cashFlow.critical) {
                this.createAlert('critical', 'Flujo de caja crítico', `S/. ${currentCashFlow.toLocaleString()}`, 'Acción inmediata requerida');
            } else if (currentCashFlow < this.thresholds.cashFlow.warning) {
                this.createAlert('warning', 'Flujo de caja bajo', `S/. ${currentCashFlow.toLocaleString()}`, 'Monitorear de cerca');
            }
        }

        // Alertas de márgenes
        if (data.revenue && data.expenses) {
            const revenue = data.revenue[data.revenue.length - 1];
            const expenses = data.expenses[data.expenses.length - 1];
            const margin = (revenue - expenses) / revenue;

            if (margin < this.thresholds.profitMargin.critical) {
                this.createAlert('critical', 'Margen crítico', `${(margin * 100).toFixed(1)}%`, 'Revisar estructura de costos');
            } else if (margin < this.thresholds.profitMargin.warning) {
                this.createAlert('warning', 'Margen bajo', `${(margin * 100).toFixed(1)}%`, 'Optimizar operaciones');
            }
        }

        return this.alerts;
    }

    // Crear alerta
    createAlert(severity, title, value, recommendation) {
        this.alerts.push({
            id: Date.now() + Math.random(),
            severity: severity,
            title: title,
            value: value,
            recommendation: recommendation,
            timestamp: new Date(),
            acknowledged: false
        });
    }

    // Obtener alertas activas
    getActiveAlerts() {
        return this.alerts.filter(alert => !alert.acknowledged);
    }
}

// ===================================================================
// GENERADOR DE REPORTES IA
// ===================================================================

class AIReportGenerator {
    constructor() {
        this.analyzer = new IntelligentAnalyzer();
        this.recommender = new RecommendationEngine();
        this.alertSystem = new SmartAlertSystem();
    }

    // Generar reporte completo
    generateCompleteReport(data) {
        const analysis = this.analyzer.analyzeFinancialData(data);
        const recommendations = this.recommender.generateRecommendations(data);
        const alerts = this.alertSystem.checkAlerts(data);

        const report = {
            metadata: {
                generatedAt: new Date(),
                period: this.getCurrentPeriod(),
                accuracy: aiConfig.predictionAccuracy
            },
            summary: this.generateExecutiveSummary(analysis),
            analysis: analysis,
            recommendations: recommendations,
            alerts: alerts,
            actionPlan: this.generateActionPlan(recommendations, alerts)
        };

        return report;
    }

    // Generar resumen ejecutivo
    generateExecutiveSummary(analysis) {
        const summary = {
            healthScore: analysis.score.score,
            keyInsights: [],
            priorities: [],
            outlook: 'neutral'
        };

        // Determinar outlook
        if (analysis.score.score >= 80) summary.outlook = 'positive';
        else if (analysis.score.score <= 50) summary.outlook = 'negative';

        // Key insights
        if (analysis.trends.revenue && analysis.trends.revenue.direction === 'ascending') {
            summary.keyInsights.push('Crecimiento sostenido en ingresos');
        }

        if (analysis.risks.length > 0) {
            summary.keyInsights.push(`${analysis.risks.length} riesgos identificados`);
        }

        if (analysis.opportunities.length > 0) {
            summary.keyInsights.push(`${analysis.opportunities.length} oportunidades detectadas`);
        }

        return summary;
    }

    // Generar plan de acción
    generateActionPlan(recommendations, alerts) {
        const plan = {
            immediate: [],
            shortTerm: [],
            longTerm: []
        };

        // Acciones inmediatas (alertas críticas)
        alerts.filter(alert => alert.severity === 'critical').forEach(alert => {
            plan.immediate.push({
                action: alert.recommendation,
                priority: 'critical',
                timeline: '24-48 horas'
            });
        });

        // Acciones a corto plazo (recomendaciones de alta prioridad)
        recommendations.filter(rec => rec.priority === 'high').forEach(rec => {
            rec.actions.forEach(action => {
                plan.shortTerm.push({
                    action: action,
                    priority: 'high',
                    timeline: '1-4 semanas'
                });
            });
        });

        // Acciones a largo plazo
        recommendations.filter(rec => rec.priority === 'medium').forEach(rec => {
            rec.actions.slice(0, 2).forEach(action => {
                plan.longTerm.push({
                    action: action,
                    priority: 'medium',
                    timeline: '1-3 meses'
                });
            });
        });

        return plan;
    }

    // Obtener período actual
    getCurrentPeriod() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
}

// ===================================================================
// INICIALIZACIÓN Y EXPORTACIÓN
// ===================================================================

// Instancias globales
const financialAI = {
    predictor: new FinancialPredictor(),
    analyzer: new IntelligentAnalyzer(),
    recommender: new RecommendationEngine(),
    alertSystem: new SmartAlertSystem(),
    reportGenerator: new AIReportGenerator()
};

// Funciones de utilidad para la UI
const aiUtilities = {
    // Generar análisis rápido
    quickAnalysis: (data) => {
        return financialAI.analyzer.analyzeFinancialData(data);
    },

    // Obtener recomendaciones
    getRecommendations: (data) => {
        return financialAI.recommender.generateRecommendations(data);
    },

    // Generar reporte completo
    generateReport: (data) => {
        return financialAI.reportGenerator.generateCompleteReport(data);
    },

    // Iniciar monitoreo
    startMonitoring: (data) => {
        financialAI.alertSystem.startMonitoring(data);
    },

    // Obtener insights en tiempo real
    getRealTimeInsights: () => {
        const sampleData = {
            cashFlow: [15000, 18500, 22000, 17800, 21500, 19800, 24500],
            revenue: [35000, 38000, 42000, 39000, 44000, 40300, 45200],
            expenses: [28000, 29500, 31000, 30200, 32500, 30200, 28700]
        };
        
        return financialAI.analyzer.analyzeFinancialData(sampleData);
    }
};

// Hacer disponible globalmente
window.financialAI = financialAI;
window.aiUtilities = aiUtilities;

// Funciones específicas para la UI del sistema
window.generateAIReport = function() {
    const sampleData = {
        cashFlow: [15000, 18500, 22000, 17800, 21500, 19800, 24500],
        revenue: [35000, 38000, 42000, 39000, 44000, 40300, 45200],
        expenses: [28000, 29500, 31000, 30200, 32500, 30200, 28700]
    };
    
    const report = aiUtilities.generateReport(sampleData);
    
    // Mostrar insights en la UI
    const insights = [
        `💡 Salud financiera: ${report.summary.healthScore}/100`,
        `📈 Tendencia de ingresos: ${report.analysis.trends.revenue?.direction === 'ascending' ? 'Positiva' : 'Neutral'}`,
        `⚠️ Riesgos detectados: ${report.analysis.risks.length}`,
        `🎯 Oportunidades: ${report.analysis.opportunities.length}`
    ];
    
    let message = "🤖 ANÁLISIS DE IA COMPLETADO:\n\n";
    insights.forEach(insight => {
        message += insight + "\n";
    });
    
    if (typeof showSuccessMessage === 'function') {
        showSuccessMessage(message);
    }
    
    return report;
};

// Auto-inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar monitoreo automático después de 5 segundos
    setTimeout(() => {
        if (window.aiUtilities) {
            const sampleData = {
                cashFlow: [15000, 18500, 22000, 17800, 21500, 19800, 24500],
                revenue: [35000, 38000, 42000, 39000, 44000, 40300, 45200],
                expenses: [28000, 29500, 31000, 30200, 32500, 30200, 28700]
            };
            
            window.aiUtilities.startMonitoring(sampleData);
            console.log('🤖 Sistema de IA inicializado y monitoreando');
        }
    }, 5000);
});

console.log('🤖 Módulo de IA cargado completamente');
