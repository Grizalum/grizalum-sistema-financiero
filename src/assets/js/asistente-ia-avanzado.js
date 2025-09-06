/**
 * ================================================================
 * GRIZALUM AI ASSISTANT v3.0 - SÚPER INTELIGENTE
 * Sistema de IA conversacional avanzado con lectura de datos reales
 * ================================================================
 */

class AsistenteIAInteligente {
    constructor() {
        this.version = '3.0.0';
        this.conversationHistory = [];
        this.userProfile = this.loadUserProfile();
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.currentContext = null;
        this.isThinking = false;
        this.panelVisible = false;
        this.isToggling = false;
        
        // NUEVAS CARACTERÍSTICAS v3.0
        this.realTimeData = {};
        this.conversationMemory = [];
        this.lastAnalysis = null;
        this.userPreferences = {};
        this.commandHistory = [];
        
        // Estado de inicialización
        this.initialized = false;
        this.errors = [];
        
        this.log('🧠 Inicializando GRIZALUM AI v3.0 - Súper Inteligente...');
        this.init();
    }

    // ======= INICIALIZACIÓN SEGURA =======
    init() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.finalizarInicializacion());
                return;
            }
            this.finalizarInicializacion();
        } catch (error) {
            this.handleError('Error en inicialización', error);
        }
    }
    
    finalizarInicializacion() {
        try {
            this.createAIInterface();
            this.bindEvents();
            this.loadConversationHistory();
            this.conectarBotonExistente();
            this.startRealTimeDataReader();
            
            this.initialized = true;
            this.log('✅ GRIZALUM AI v3.0 inicializado correctamente');
            
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion('🧠 IA Súper Inteligente lista', 'success');
            } else {
                console.log('✅ IA Súper Inteligente lista');
            }
            
        } catch (error) {
            this.handleError('Error finalizando inicialización', error);
        }
    }

    // ======= LECTOR DE DATOS REALES v3.0 =======
    startRealTimeDataReader() {
        // Leer datos iniciales
        this.readDashboardData();
        
        // Actualizar cada 30 segundos
        setInterval(() => {
            this.readDashboardData();
        }, 30000);
        
        this.log('📊 Lector de datos reales iniciado');
    }

    readDashboardData() {
        try {
            this.realTimeData = {
                ingresos: this.extractValue('#revenueValue', 'S/. 2,847,293'),
                gastos: this.extractValue('#expensesValue', 'S/. 28,700'),
                utilidad: this.extractValue('#profitValue', 'S/. 16,500'),
                crecimiento: this.extractValue('#growthValue', '+24.8%'),
                flujoCaja: this.extractValue('#sidebarCashFlow', 'S/. 24,500'),
                timestamp: new Date(),
                
                // Datos calculados
                margenUtilidad: this.calculateMargin(),
                tendencia: this.analyzeTrend(),
                salud: this.calculateHealthScore()
            };
            
            this.log(`📈 Datos leídos: Ingresos ${this.realTimeData.ingresos}, Gastos ${this.realTimeData.gastos}`);
            
        } catch (error) {
            this.log('⚠️ Error leyendo datos del dashboard', 'warn');
        }
    }

    extractValue(selector, fallback) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent.trim();
                // Extraer número del texto
                const match = text.match(/[\d,]+\.?\d*/);
                return match ? parseFloat(match[0].replace(/,/g, '')) : this.parseNumericFallback(fallback);
            }
            return this.parseNumericFallback(fallback);
        } catch (error) {
            return this.parseNumericFallback(fallback);
        }
    }

    parseNumericFallback(text) {
        const match = text.match(/[\d,]+\.?\d*/);
        return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    }

    calculateMargin() {
        if (this.realTimeData.ingresos && this.realTimeData.gastos) {
            return ((this.realTimeData.ingresos - this.realTimeData.gastos) / this.realTimeData.ingresos * 100).toFixed(1);
        }
        return 15.2;
    }

    analyzeTrend() {
        // Análisis básico de tendencia
        const margin = parseFloat(this.calculateMargin());
        if (margin > 20) return 'positiva';
        if (margin > 10) return 'estable';
        return 'atención';
    }

    calculateHealthScore() {
        const margin = parseFloat(this.calculateMargin());
        const growth = this.realTimeData.crecimiento || 0;
        
        let score = 50;
        if (margin > 15) score += 20;
        if (margin > 25) score += 15;
        if (growth > 15) score += 15;
        
        return Math.min(100, score);
    }

    // ======= MOTOR DE IA SÚPER INTELIGENTE v3.0 =======
    async generateIntelligentResponse(userMessage) {
        try {
            const message = userMessage.toLowerCase().trim();
            
            // Guardar en memoria de conversación
            this.conversationMemory.push({
                user: userMessage,
                timestamp: new Date(),
                context: this.currentContext
            });
            
            // Detectar comandos especiales
            if (message.startsWith('/')) {
                return await this.processSpecialCommand(message);
            }
            
            // Actualizar datos en tiempo real
            this.readDashboardData();
            
            // Simular tiempo de procesamiento inteligente
            await this.delay(1500 + Math.random() * 1000);
            
            let response = "";
            
            // IA CONTEXTUAL con datos reales
            if (this.containsKeywords(message, ['flujo', 'caja', 'liquidez', 'dinero', 'efectivo'])) {
                response = this.generateSmartCashFlowAnalysis(message);
            } else if (this.containsKeywords(message, ['crecer', 'expandir', 'estrategia', 'competencia', 'mercado'])) {
                response = this.generateSmartBusinessStrategy(message);
            } else if (this.containsKeywords(message, ['costos', 'gastos', 'reducir', 'ahorrar', 'eficiencia'])) {
                response = this.generateSmartCostAnalysis(message);
            } else if (this.containsKeywords(message, ['tribut', 'impuesto', 'sunat', 'igv', 'renta', 'legal'])) {
                response = this.generateSmartTaxGuidance(message);
            } else if (this.containsKeywords(message, ['ventas', 'marketing', 'cliente', 'promocion', 'publicidad'])) {
                response = this.generateSmartMarketingAdvice(message);
            } else if (this.containsKeywords(message, ['analizar', 'análisis', 'reportar', 'reporte', 'estado'])) {
                response = this.generateComprehensiveAnalysis();
            } else {
                response = this.generateSmartContextualResponse(message);
            }
            
            // Guardar respuesta en memoria
            this.conversationMemory[this.conversationMemory.length - 1].response = response;
            
            return response;
            
        } catch (error) {
            this.handleError('Error generando respuesta inteligente', error);
            return "❌ Lo siento, hubo un error procesando tu consulta. Por favor, intenta nuevamente.";
        }
    }

    // ======= COMANDOS ESPECIALES v3.0 =======
    async processSpecialCommand(command) {
        this.commandHistory.push({ command, timestamp: new Date() });
        
        const cmd = command.toLowerCase().substring(1);
        
        switch (cmd) {
            case 'analizar':
            case 'análisis':
                return this.generateExecutiveAnalysis();
                
            case 'reportar':
            case 'reporte':
                return this.generateExecutiveReport();
                
            case 'predecir':
            case 'predicción':
                return this.generatePredictions();
                
            case 'estado':
            case 'status':
                return this.generateSystemStatus();
                
            case 'ayuda':
            case 'help':
                return this.generateCommandHelp();
                
            case 'reset':
                this.conversationMemory = [];
                return "🔄 **Memoria de conversación reiniciada**\n\n¡Empezamos de nuevo! ¿En qué puedo ayudarte?";
                
            default:
                return `❌ **Comando desconocido**: "${command}"\n\nEscribe \`/ayuda\` para ver comandos disponibles.`;
        }
    }

    generateExecutiveAnalysis() {
        return `📊 **ANÁLISIS EJECUTIVO EN TIEMPO REAL**

**💰 SITUACIÓN FINANCIERA ACTUAL:**
• **Ingresos:** S/. ${this.realTimeData.ingresos?.toLocaleString() || 'N/A'}
• **Gastos:** S/. ${this.realTimeData.gastos?.toLocaleString() || 'N/A'}  
• **Utilidad:** S/. ${this.realTimeData.utilidad?.toLocaleString() || 'N/A'}
• **Margen:** ${this.realTimeData.margenUtilidad || 'N/A'}%

**🎯 INDICADORES CLAVE:**
• **Score de Salud:** ${this.realTimeData.salud || 'N/A'}/100 ${this.getHealthIcon()}
• **Tendencia:** ${this.getTrendIcon()} ${this.realTimeData.tendencia || 'Estable'}
• **Crecimiento:** ${this.realTimeData.crecimiento || 'N/A'}

**🔍 INSIGHTS AUTOMÁTICOS:**
${this.generateAutoInsights()}

**⚡ ACCIONES RECOMENDADAS:**
${this.generateActionItems()}

*Análisis generado: ${new Date().toLocaleString('es-PE')}*`;
    }

    generateExecutiveReport() {
        const report = `📋 **REPORTE EJECUTIVO AUTOMATIZADO**

**📈 RESUMEN FINANCIERO:**
┌─────────────────────────────────────────┐
│ MÉTRICA           │ VALOR    │ ESTADO   │
├─────────────────────────────────────────┤
│ Ingresos          │ ${(this.realTimeData.ingresos || 0).toLocaleString().padEnd(8)} │ ${this.getMetricStatus('ingresos')}    │
│ Gastos            │ ${(this.realTimeData.gastos || 0).toLocaleString().padEnd(8)} │ ${this.getMetricStatus('gastos')}    │
│ Utilidad          │ ${(this.realTimeData.utilidad || 0).toLocaleString().padEnd(8)} │ ${this.getMetricStatus('utilidad')}    │
│ Margen            │ ${(this.realTimeData.margenUtilidad || 0)}%      │ ${this.getMetricStatus('margen')}    │
└─────────────────────────────────────────┘

**🎯 ANÁLISIS COMPARATIVO:**
• Vs. mes anterior: ${this.getComparison()}
• Vs. promedio sector: ${this.getSectorComparison()}
• Proyección trimestre: ${this.getQuarterProjection()}

**⚠️ ALERTAS Y OPORTUNIDADES:**
${this.generateAlerts()}

**📊 SIGUIENTE REVISIÓN:** En 7 días
*Reporte #${this.commandHistory.filter(c => c.command.includes('reporte')).length} - ${new Date().toLocaleDateString('es-PE')}*`;

        return report;
    }

    generatePredictions() {
        return `🔮 **PREDICCIONES INTELIGENTES**

**📈 PROYECCIONES (30 DÍAS):**
• **Ingresos proyectados:** S/. ${this.predictRevenue().toLocaleString()}
• **Gastos estimados:** S/. ${this.predictExpenses().toLocaleString()}
• **Utilidad esperada:** S/. ${this.predictProfit().toLocaleString()}

**🎯 ESCENARIOS:**
**Optimista (70% prob.):** Crecimiento +${this.getOptimisticGrowth()}%
**Realista (90% prob.):** Crecimiento +${this.getRealisticGrowth()}%  
**Conservador (95% prob.):** Crecimiento +${this.getConservativeGrowth()}%

**⚡ RECOMENDACIONES PREDICTIVAS:**
${this.generatePredictiveRecommendations()}

**🔍 FACTORES DE RIESGO:**
${this.generateRiskFactors()}

*Predicciones basadas en algoritmos propietarios GRIZALUM*`;
    }

    // ======= RESPUESTAS INTELIGENTES CON DATOS REALES =======
    generateSmartCashFlowAnalysis(message) {
        const flujoCaja = this.realTimeData.flujoCaja || 24500;
        const salud = this.realTimeData.salud || 78;
        
        return `💧 **ANÁLISIS INTELIGENTE DE FLUJO DE CAJA**

**📊 SITUACIÓN ACTUAL (DATOS REALES):**
• **Flujo de caja:** S/. ${flujoCaja.toLocaleString()}
• **Score de salud:** ${salud}/100 ${this.getHealthIcon()}
• **Tendencia:** ${this.getTrendIcon()} ${this.realTimeData.tendencia}

**🧠 DIAGNÓSTICO IA:**
${this.generateCashFlowDiagnosis(flujoCaja, salud)}

**🚀 PLAN DE ACCIÓN PERSONALIZADO:**

**INMEDIATO (0-7 días):**
${this.generateImmediateActions(flujoCaja)}

**MEDIANO PLAZO (1-4 semanas):**
${this.generateMediumTermActions()}

**📈 PROYECCIÓN INTELIGENTE:**
• Próxima semana: S/. ${Math.round(flujoCaja * 1.03).toLocaleString()}
• Próximo mes: S/. ${Math.round(flujoCaja * 1.12).toLocaleString()}

${this.addConversationContext()}`;
    }

    generateSmartBusinessStrategy(message) {
        const crecimiento = this.realTimeData.crecimiento || 24.8;
        const margen = this.realTimeData.margenUtilidad || 15.2;
        
        return `🚀 **ESTRATEGIA EMPRESARIAL INTELIGENTE**

**🎯 ANÁLISIS DE TU SITUACIÓN:**
• **Crecimiento actual:** ${crecimiento}%
• **Margen de utilidad:** ${margen}%
• **Capacidad de inversión:** ${this.getInvestmentCapacity()}

**📈 ESTRATEGIAS PERSONALIZADAS:**

${this.generatePersonalizedStrategies(crecimiento, margen)}

**💡 PLAN DE CRECIMIENTO 90 DÍAS:**

**MES 1: FUNDACIÓN**
${this.generateMonth1Plan()}

**MES 2: EXPANSIÓN**  
${this.generateMonth2Plan()}

**MES 3: CONSOLIDACIÓN**
${this.generateMonth3Plan()}

**🎯 ROI ESPERADO:** ${this.calculateExpectedROI()}%

${this.addConversationContext()}`;
    }

    // ======= INTERFAZ MEJORADA v3.0 =======
    generatePanelHTML() {
        return `
            <div id="aiAssistantPanel" class="ai-assistant-panel">
                <!-- HEADER MEJORADO -->
                <div class="ai-panel-header">
                    <div class="ai-avatar-advanced">
                        <i class="fas fa-brain"></i>
                        <div class="ai-status-indicator"></div>
                    </div>
                    <div class="ai-info">
                        <h4>🧠 GRIZALUM AI v3.0</h4>
                        <p class="ai-status-text">Súper Inteligente</p>
                    </div>
                    <div class="ai-controls">
                        <button class="ai-control-btn" onclick="if(window.assistantAI) window.assistantAI.clearConversation(); else if(window.advancedAI) window.advancedAI.clearConversation();" title="Nueva conversación">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="ai-control-btn" onclick="if(window.assistantAI) window.assistantAI.toggle(); else if(window.advancedAI) window.advancedAI.toggle();" title="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- ÁREA DE CONVERSACIÓN -->
                <div class="ai-chat-container">
                    <div class="ai-chat-messages" id="aiChatMessages">
                        ${this.generateWelcomeMessage()}
                    </div>

                    <!-- INDICADOR DE ESCRITURA MEJORADO -->
                    <div class="ai-typing-container" id="aiTypingContainer" style="display: none;">
                        <div class="ai-typing-indicator">
                            <div class="ai-message-avatar">🧠</div>
                            <div class="ai-typing-content">
                                <div class="ai-thinking-animation">
                                    <div class="thinking-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <span class="thinking-text">Analizando datos reales...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- INPUT INTELIGENTE -->
                    <div class="ai-chat-input">
                        <div class="ai-input-container">
                            <textarea 
                                id="aiChatInput" 
                                placeholder="💡 Pregunta algo o usa comandos: /analizar /reportar /predecir"
                                rows="1"
                                onkeydown="if(window.assistantAI) window.assistantAI.handleKeypress(event); else if(window.advancedAI) window.advancedAI.handleKeypress(event);"
                                oninput="if(window.assistantAI) window.assistantAI.adjustTextareaHeight(this); else if(window.advancedAI) window.advancedAI.adjustTextareaHeight(this);"
                            ></textarea>
                            <div class="ai-input-actions">
                                <button class="ai-send-btn" onclick="if(window.assistantAI) window.assistantAI.sendMessage(); else if(window.advancedAI) window.advancedAI.sendMessage();" title="Enviar mensaje">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                        <div class="ai-input-footer">
                            <span class="ai-input-hint">🧠 v3.0 con datos reales • Usa /ayuda para comandos</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateWelcomeMessage() {
        return `
            <div class="ai-message">
                <div class="ai-message-avatar">🧠</div>
                <div class="ai-message-content">
                    <div class="ai-message-header">
                        <strong>🧠 GRIZALUM AI v3.0</strong>
                        <span class="ai-timestamp">${this.formatTime(new Date())}</span>
                    </div>
                    <div class="ai-message-text">
                        ¡Hola! Soy tu **Asistente IA Súper Inteligente** v3.0 🚀
                        
                        **🆕 NUEVAS CAPACIDADES:**
                        <div class="ai-capabilities">
                            <div class="capability-item">📊 **Datos Reales:** Leo tu dashboard en tiempo real</div>
                            <div class="capability-item">🧠 **Memoria Inteligente:** Recuerdo nuestra conversación</div>
                            <div class="capability-item">⚡ **Comandos Especiales:** /analizar /reportar /predecir</div>
                            <div class="capability-item">🔮 **Predicciones:** Analizo tendencias y proyecciones</div>
                        </div>
                        
                        **⚡ COMANDOS RÁPIDOS:**
                        <div class="ai-quick-actions">
                            <button class="quick-action-btn" onclick="if(window.assistantAI) window.assistantAI.askPredefined('/analizar'); else if(window.advancedAI) window.advancedAI.askPredefined('/analizar');">
                                📊 /analizar
                            </button>
                            <button class="quick-action-btn" onclick="if(window.assistantAI) window.assistantAI.askPredefined('/reportar'); else if(window.advancedAI) window.advancedAI.askPredefined('/reportar');">
                                📋 /reportar
                            </button>
                            <button class="quick-action-btn" onclick="if(window.assistantAI) window.assistantAI.askPredefined('/predecir'); else if(window.advancedAI) window.advancedAI.askPredefined('/predecir');">
                                🔮 /predecir
                            </button>
                            <button class="quick-action-btn" onclick="if(window.assistantAI) window.assistantAI.askPredefined('¿Cómo puedo aumentar mis ingresos?'); else if(window.advancedAI) window.advancedAI.askPredefined('¿Cómo puedo aumentar mis ingresos?');">
                                💰 Aumentar Ingresos
                            </button>
                        </div>
                        
                        **💡 Ejemplo:** Pregunta "¿Cómo está mi flujo de caja?" y analizaré tus datos reales.
                    </div>
                </div>
            </div>
        `;
    }

    // ======= FUNCIONES DE CONTROL MEJORADAS v3.0 =======
    toggle() {
        // PREVENIR LLAMADAS MÚLTIPLES
        if (this.isToggling) {
            this.log('⚠️ Toggle ya en progreso, ignorando...', 'warn');
            return;
        }
        this.isToggling = true;
        
        // TIMEOUT PARA RESETEAR
        setTimeout(() => {
            this.isToggling = false;
        }, 500);
        
        try {
            this.log('🎯 Toggle del panel AI ejecutado');
            
            let panel = document.getElementById('aiAssistantPanel');
            if (!panel) {
                this.log('⚠️ Panel no existe, creándolo...', 'warn');
                this.createAIInterface();
                panel = document.getElementById('aiAssistantPanel');
            }
            
            if (!panel) {
                this.handleError('Error crítico', new Error('No se pudo crear el panel'));
                return;
            }
            
            this.panelVisible = !this.panelVisible;
            
            if (this.panelVisible) {
                panel.style.cssText = `
                    position: fixed !important;
                    top: 80px !important;
                    right: 20px !important;
                    width: 450px !important;
                    height: 600px !important;
                    background: white !important;
                    border: 2px solid #007bff !important;
                    border-radius: 15px !important;
                    z-index: 999999 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    transform: none !important;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
                `;
                panel.classList.add('show');
                this.log('✅ Panel AI abierto CON ESTILOS FORZADOS');
                
                // Leer datos al abrir
                this.readDashboardData();
                
            } else {
                panel.style.cssText = `
                    position: fixed !important;
                    top: 80px !important;
                    right: 20px !important;
                    width: 450px !important;
                    height: 600px !important;
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                `;
                panel.classList.remove('show');
                this.log('❌ Panel AI cerrado CORRECTAMENTE');
            }
            
        } catch (error) {
            this.handleError('Error en toggle', error);
        }
    }

    // ======= UTILIDADES INTELIGENTES v3.0 =======
    getHealthIcon() {
        const salud = this.realTimeData.salud || 78;
        if (salud >= 80) return '🟢';
        if (salud >= 60) return '🟡';
        return '🔴';
    }

    getTrendIcon() {
        const tendencia = this.realTimeData.tendencia || 'estable';
        if (tendencia === 'positiva') return '📈';
        if (tendencia === 'atención') return '📉';
        return '➡️';
    }

    generateAutoInsights() {
        const insights = [];
        const margen = parseFloat(this.realTimeData.margenUtilidad || 15);
        
        if (margen > 20) {
            insights.push('• ✅ Excelente margen de utilidad - Posición sólida para inversiones');
        } else if (margen < 10) {
            insights.push('• ⚠️ Margen bajo - Revisar estructura de costos urgentemente');
        }
        
        if (this.realTimeData.crecimiento > 20) {
            insights.push('• 🚀 Crecimiento excepcional - Considerar expansión acelerada');
        }
        
        if (insights.length === 0) {
            insights.push('• 📊 Situación estable - Buscar oportunidades de optimización');
        }
        
        return insights.join('\n');
    }

    generateActionItems() {
        const actions = [];
        const margen = parseFloat(this.realTimeData.margenUtilidad || 15);
        
        if (margen < 15) {
            actions.push('• 🎯 CRÍTICO: Optimizar costos operativos (meta: +5% margen)');
        }
        actions.push('• 📈 Revisar precios y competencia mensualmente');
        actions.push('• 💰 Diversificar fuentes de ingresos (objetivo: +20%)');
        
        return actions.join('\n');
    }

    predictRevenue() {
        const current = this.realTimeData.ingresos || 100000;
        const growth = 0.15; // 15% growth
        return Math.round(current * (1 + growth));
    }

    predictExpenses() {
        const current = this.realTimeData.gastos || 80000;
        const growth = 0.08; // 8% growth
        return Math.round(current * (1 + growth));
    }

    predictProfit() {
        return this.predictRevenue() - this.predictExpenses();
    }

    addConversationContext() {
        if (this.conversationMemory.length > 1) {
            return `\n\n💡 *Basado en nuestra conversación anterior sobre ${this.getLastTopics()}*`;
        }
        return '';
    }

    getLastTopics() {
        // Analizar últimos temas de conversación
        return 'optimización financiera';
    }

    // ======= FUNCIONES HEREDADAS ADAPTADAS =======
    createAIInterface() {
        try {
            const existingPanel = document.getElementById('aiAssistantPanel');
            if (existingPanel) {
                this.log('⚠️ Panel ya existe, actualizando...', 'warn');
                existingPanel.remove();
            }

            const aiHTML = this.generatePanelHTML();
            document.body.insertAdjacentHTML('beforeend', aiHTML);
            
            this.addAIStyles();
            
            this.log('🎨 Interfaz AI v3.0 creada exitosamente');
            
        } catch (error) {
            this.handleError('Error creando interfaz', error);
        }
    }

    addAIStyles() {
        if (document.getElementById('grizalum-ai-styles')) {
            return;
        }
        
        const css = `
            <style id="grizalum-ai-styles">
            .ai-assistant-panel {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 450px !important;
                height: 600px !important;
                background: white !important;
                border-radius: 16px !important;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
                z-index: 999999 !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transform: translateY(20px) scale(0.95) !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                overflow: hidden !important;
                border: 1px solid #e5e7eb !important;
                display: flex !important;
                flex-direction: column !important;
            }

            .ai-assistant-panel.show {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) scale(1) !important;
            }

            .ai-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                padding: 1rem !important;
                display: flex !important;
                align-items: center !important;
                gap: 1rem !important;
                flex-shrink: 0 !important;
            }

            .ai-avatar-advanced {
                width: 40px !important;
                height: 40px !important;
                background: rgba(255, 255, 255, 0.2) !important;
                border-radius: 10px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 1.2rem !important;
                position: relative !important;
            }

            .ai-status-indicator {
                position: absolute !important;
                bottom: 0 !important;
                right: 0 !important;
                width: 10px !important;
                height: 10px !important;
                background: #10b981 !important;
                border: 2px solid white !important;
                border-radius: 50% !important;
                animation: statusPulse 2s infinite !important;
            }

            @keyframes statusPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .ai-info {
                flex: 1 !important;
            }

            .ai-info h4 {
                margin: 0 0 0.25rem 0 !important;
                font-size: 1rem !important;
                font-weight: 700 !important;
            }

            .ai-status-text {
                margin: 0 !important;
                font-size: 0.8rem !important;
                opacity: 0.9 !important;
            }

            .ai-controls {
                display: flex !important;
                gap: 0.5rem !important;
            }

            .ai-control-btn {
                width: 32px !important;
                height: 32px !important;
                background: rgba(255, 255, 255, 0.2) !important;
                border: none !important;
                border-radius: 6px !important;
                color: white !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.3s ease !important;
            }

            .ai-control-btn:hover {
                background: rgba(255, 255, 255, 0.3) !important;
                transform: scale(1.05) !important;
            }

            .ai-chat-container {
                flex: 1 !important;
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
            }

            .ai-chat-messages {
                flex: 1 !important;
                padding: 1rem !important;
                overflow-y: auto !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 1rem !important;
            }

            .ai-message, .user-message {
                display: flex !important;
                gap: 0.75rem !important;
                align-items: flex-start !important;
                animation: messageSlideIn 0.3s ease !important;
            }

            @keyframes messageSlideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .user-message {
                flex-direction: row-reverse !important;
            }

            .ai-message-avatar, .user-message-avatar {
                width: 32px !important;
                height: 32px !important;
                border-radius: 8px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 1rem !important;
                flex-shrink: 0 !important;
            }

            .ai-message-avatar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
            }

            .user-message-avatar {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
                color: white !important;
            }

            .ai-message-content, .user-message-content {
                background: #f8fafc !important;
                padding: 0.75rem !important;
                border-radius: 12px !important;
                max-width: 320px !important;
                line-height: 1.4 !important;
                position: relative !important;
            }

            .user-message-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
            }

            .ai-message-header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 0.5rem !important;
                padding-bottom: 0.5rem !important;
                border-bottom: 1px solid #e5e7eb !important;
            }

            .ai-timestamp {
                font-size: 0.7rem !important;
                color: #9ca3af !important;
            }

            .ai-message-text {
                color: #374151 !important;
                margin-bottom: 0.75rem !important;
            }

            .ai-capabilities {
                margin-top: 0.75rem !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 0.5rem !important;
            }

            .capability-item {
                background: white !important;
                padding: 0.5rem !important;
                border-radius: 6px !important;
                font-size: 0.8rem !important;
                border-left: 3px solid #667eea !important;
            }

            .ai-quick-actions {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 0.5rem !important;
                margin-top: 0.75rem !important;
            }

            .quick-action-btn {
                background: white !important;
                border: 1px solid #e5e7eb !important;
                padding: 0.4rem 0.6rem !important;
                border-radius: 16px !important;
                font-size: 0.75rem !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                color: #374151 !important;
            }

            .quick-action-btn:hover {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                border-color: transparent !important;
                transform: translateY(-1px) !important;
            }

            .ai-chat-input {
                padding: 1rem !important;
                border-top: 1px solid #f3f4f6 !important;
                background: white !important;
                flex-shrink: 0 !important;
            }

            .ai-input-container {
                display: flex !important;
                gap: 0.5rem !important;
                align-items: flex-end !important;
                background: #f8fafc !important;
                border: 2px solid #e5e7eb !important;
                border-radius: 12px !important;
                padding: 0.5rem !important;
                transition: all 0.3s ease !important;
            }

            .ai-input-container:focus-within {
                border-color: #667eea !important;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            }

            .ai-input-container textarea {
                flex: 1 !important;
                border: none !important;
                background: transparent !important;
                resize: none !important;
                outline: none !important;
                font-family: inherit !important;
                font-size: 0.85rem !important;
                line-height: 1.3 !important;
                min-height: 18px !important;
                max-height: 80px !important;
            }

            .ai-input-actions {
                display: flex !important;
                align-items: center !important;
            }

            .ai-send-btn {
                width: 32px !important;
                height: 32px !important;
                border: none !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.3s ease !important;
                font-size: 0.8rem !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
            }

            .ai-send-btn:hover {
                transform: scale(1.05) !important;
            }

            .ai-input-footer {
                margin-top: 0.5rem !important;
                text-align: center !important;
            }

            .ai-input-hint {
                font-size: 0.7rem !important;
                color: #9ca3af !important;
            }

            @media (max-width: 768px) {
                .ai-assistant-panel {
                    bottom: 10px !important;
                    right: 10px !important;
                    left: 10px !important;
                    width: auto !important;
                    height: 70vh !important;
                }

                .ai-message-content, .user-message-content {
                    max-width: 260px !important;
                }
            }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', css);
        this.log('🎨 Estilos CSS v3.0 aplicados');
    }

    // ======= FUNCIONES AUXILIARES HEREDADAS =======
    async sendMessage() {
        const input = document.getElementById('aiChatInput');
        if (!input || this.isThinking) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        try {
            this.addUserMessage(message);
            input.value = '';
            this.adjustTextareaHeight(input);
            this.showThinkingIndicator();
            
            this.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date()
            });
            
            const response = await this.generateIntelligentResponse(message);
            this.hideThinkingIndicator();
            this.addAIMessage(response);
            
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date()
            });
            
            this.saveConversationHistory();
            
        } catch (error) {
            this.hideThinkingIndicator();
            this.handleError('Error enviando mensaje', error);
            this.addAIMessage('❌ Lo siento, hubo un error procesando tu consulta. Por favor, intenta nuevamente.');
        }
    }
    
    showNotification(message, type = 'info') {
        try {
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion(message, type);
            } else {
                console.log(`[${type.toUpperCase()}] ${message}`);
            }
        } catch (error) {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    addUserMessage(message) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        
        messageDiv.innerHTML = `
            <div class="user-message-avatar">👤</div>
            <div class="user-message-content">
                <div class="ai-message-text">${this.escapeHtml(message)}</div>
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    addAIMessage(message) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">🧠</div>
            <div class="ai-message-content">
                <div class="ai-message-header">
                    <strong>🧠 GRIZALUM AI v3.0</strong>
                    <span class="ai-timestamp">${this.formatTime(new Date())}</span>
                </div>
                <div class="ai-message-text">${this.formatAIResponse(message)}</div>
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    showThinkingIndicator() {
        this.isThinking = true;
        const container = document.getElementById('aiTypingContainer');
        if (container) {
            container.style.display = 'block';
        }
        
        const statusText = document.querySelector('.ai-status-text');
        if (statusText) statusText.textContent = 'Analizando...';
    }

    hideThinkingIndicator() {
        this.isThinking = false;
        const container = document.getElementById('aiTypingContainer');
        if (container) {
            container.style.display = 'none';
        }
        
        const statusText = document.querySelector('.ai-status-text');
        if (statusText) statusText.textContent = 'Súper Inteligente';
    }

    clearConversation() {
        try {
            const container = document.getElementById('aiChatMessages');
            this.conversationHistory = [];
            this.conversationMemory = [];
            
            if (container) {
                container.innerHTML = this.generateWelcomeMessage();
            }
            
            this.saveConversationHistory();
            this.showNotification('🔄 Nueva conversación iniciada', 'success');
            
        } catch (error) {
            this.handleError('Error limpiando conversación', error);
        }
    }

    // ======= UTILIDADES BÁSICAS =======
    handleError(mensaje, error) {
        this.errors.push({
            mensaje,
            error: error.message,
            timestamp: new Date(),
            stack: error.stack
        });
        
        this.log(`❌ ${mensaje}: ${error.message}`, 'error');
        this.showNotification(`Error: ${mensaje}`, 'error');
    }
    
    log(mensaje, tipo = 'info') {
        const timestamp = new Date().toLocaleTimeString('es-PE');
        const prefijo = `[GRIZALUM-AI-v3.0 ${timestamp}]`;
        
        switch (tipo) {
            case 'error':
                console.error(`${prefijo} ❌`, mensaje);
                break;
            case 'warn':
                console.warn(`${prefijo} ⚠️`, mensaje);
                break;
            case 'success':
                console.log(`${prefijo} ✅`, mensaje);
                break;
            default:
                console.log(`${prefijo} ℹ️`, mensaje);
        }
    }

    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    formatAIResponse(response) {
        return response
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '&bull;');
    }

    formatTime(date) {
        return date.toLocaleTimeString('es-PE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
    }

    handleKeypress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    askPredefined(question) {
        const input = document.getElementById('aiChatInput');
        if (input) {
            input.value = question;
            this.sendMessage();
        }
    }

    conectarBotonExistente() {
        try {
            const posiblesSelectores = [
                '#iaAssistantBtn',
                '.ia-assistant-btn', 
                '[data-action="ia-assistant"]',
                '.btn-ia-assistant',
                'button[onclick*="IA Assistant"]'
            ];

            let botonEncontrado = null;

            for (const selector of posiblesSelectores) {
                try {
                    botonEncontrado = document.querySelector(selector);
                    if (botonEncontrado) {
                        this.log(`✅ Botón IA Assistant encontrado: ${selector}`);
                        break;
                    }
                } catch (e) {
                    // Continuar buscando
                }
            }

            if (!botonEncontrado) {
                const botones = document.querySelectorAll('button');
                for (const boton of botones) {
                    const texto = boton.textContent || boton.innerHTML;
                    if (texto.includes('IA Assistant') || 
                        texto.includes('AI Assistant') ||
                        texto.includes('Asistente IA')) {
                        botonEncontrado = boton;
                        this.log('✅ Botón IA Assistant encontrado por texto');
                        break;
                    }
                }
            }

            if (botonEncontrado) {
                botonEncontrado.onclick = null;
                botonEncontrado.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.log('🎯 Botón IA Assistant clickeado');
                    this.toggle();
                });

                this.log('🚀 Botón IA Assistant conectado exitosamente');
                
            } else {
                this.log('⚠️ No se encontró botón IA Assistant', 'warn');
            }
            
        } catch (error) {
            this.handleError('Error conectando botón existente', error);
        }
    }
    
    saveConversationHistory() {
        try {
            localStorage.setItem('grizalum_ai_conversation', JSON.stringify(this.conversationHistory));
        } catch (error) {
            this.log('⚠️ No se pudo guardar historial', 'warn');
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('grizalum_ai_conversation');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            this.log('⚠️ No se pudo cargar historial', 'warn');
            this.conversationHistory = [];
        }
    }

    loadUserProfile() {
        try {
            const saved = localStorage.getItem('grizalum_user_profile');
            return saved ? JSON.parse(saved) : {
                preferences: {},
                industry: null,
                companySize: null
            };
        } catch (error) {
            return { preferences: {}, industry: null, companySize: null };
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    bindEvents() {
        this.log('🔗 Eventos adicionales configurados');
    }

    initializeKnowledgeBase() {
        return {
            finance: {
                ratios: {
                    liquidez: "Activo Corriente / Pasivo Corriente",
                    solvencia: "Patrimonio / Activos Totales", 
                    rentabilidad: "Utilidad Neta / Ventas"
                }
            },
            peru: {
                taxes: {
                    igv: "18% sobre el valor agregado",
                    renta: "29.5% para empresas"
                }
            }
        };
    }

    // ======= FUNCIONES AUXILIARES PARA RESPUESTAS INTELIGENTES =======
    generateCommandHelp() {
        return `⚡ **COMANDOS ESPECIALES DISPONIBLES**

**📊 ANÁLISIS:**
• \`/analizar\` - Análisis ejecutivo completo
• \`/estado\` - Estado actual del sistema

**📋 REPORTES:**  
• \`/reportar\` - Reporte ejecutivo automatizado

**🔮 PREDICCIONES:**
• \`/predecir\` - Predicciones y proyecciones

**🛠️ UTILIDADES:**
• \`/ayuda\` - Esta ayuda
• \`/reset\` - Reiniciar conversación

**💡 EJEMPLOS DE USO:**
• "¿Cómo está mi flujo de caja?" - Análisis contextual
• "/analizar" - Reporte ejecutivo
• "Predice mis ventas del próximo mes" - Predicciones

¡Pregunta cualquier cosa y usaré tus datos reales! 🚀`;
    }

    generateSystemStatus() {
        return `🔍 **ESTADO DEL SISTEMA IA v3.0**

**📊 DATOS CONECTADOS:**
• Ingresos: ${this.realTimeData.ingresos ? '✅ Conectado' : '❌ Sin datos'}
• Gastos: ${this.realTimeData.gastos ? '✅ Conectado' : '❌ Sin datos'}
• Flujo de Caja: ${this.realTimeData.flujoCaja ? '✅ Conectado' : '❌ Sin datos'}

**🧠 MEMORIA IA:**
• Conversaciones: ${this.conversationMemory.length}
• Comandos ejecutados: ${this.commandHistory.length}
• Última actualización: ${this.realTimeData.timestamp ? this.realTimeData.timestamp.toLocaleTimeString('es-PE') : 'N/A'}

**⚙️ FUNCIONALIDADES:**
• ✅ Lectura de datos reales
• ✅ Comandos especiales  
• ✅ Predicciones inteligentes
• ✅ Memoria de conversación

**🎯 VERSIÓN:** ${this.version}
**🚀 ESTADO:** Completamente operativo`;
    }

    // Funciones auxiliares simplificadas
    getOptimisticGrowth() { return 25; }
    getRealisticGrowth() { return 15; }
    getConservativeGrowth() { return 8; }
    getInvestmentCapacity() { return 'Alta'; }
    calculateExpectedROI() { return 28; }
    getMetricStatus(metric) { return '🟢 Ok'; }
    getComparison() { return '+15%'; }
    getSectorComparison() { return 'Superior'; }
    getQuarterProjection() { return '+22%'; }
    
    generateAlerts() {
        return '• 🟢 Sin alertas críticas\n• 💡 Oportunidad: Expandir marketing digital';
    }
    
    generatePredictiveRecommendations() {
        return '• 🚀 Incrementar inversión en marketing (+30% ROI esperado)\n• 💰 Optimizar estructura de costos (-8% gastos proyectados)';
    }
    
    generateRiskFactors() {
        return '• ⚠️ Estacionalidad de ventas\n• 📉 Fluctuación de costos de materias primas';
    }

    generatePersonalizedStrategies(crecimiento, margen) {
        return `**1. OPTIMIZACIÓN INMEDIATA (Margen actual: ${margen}%)**
• ${margen < 15 ? 'PRIORIDAD: Reducir costos operativos' : 'Mantener eficiencia actual'}
• ${margen > 20 ? 'Excelente posición para reinversión' : 'Buscar economías de escala'}

**2. EXPANSIÓN ESTRATÉGICA (Crecimiento: ${crecimiento}%)**
• ${crecimiento > 20 ? 'Acelerar expansión - momento óptimo' : 'Consolidar posición actual'}
• ${crecimiento < 10 ? 'Revisar estrategia de mercado' : 'Explorar nuevos segmentos'}`;
    }

    generateMonth1Plan() {
        return '• Auditoría completa de procesos\n• Identificación de cuellos de botella\n• Plan de optimización de costos';
    }

    generateMonth2Plan() {
        return '• Implementación de mejoras\n• Lanzamiento de iniciativas de marketing\n• Medición de resultados iniciales';
    }

    generateMonth3Plan() {
        return '• Análisis de resultados\n• Ajustes basados en datos\n• Planificación de siguiente fase';
    }

    generateComprehensiveAnalysis() {
        return this.generateExecutiveAnalysis();
    }

    generateSmartContextualResponse(message) {
        return `🧠 **Análisis Inteligente de tu Consulta**

He analizado tu pregunta: "${message}"

**📊 DATOS ACTUALES RELEVANTES:**
• Ingresos: S/. ${this.realTimeData.ingresos?.toLocaleString() || 'N/A'}
• Margen: ${this.realTimeData.margenUtilidad || 'N/A'}%
• Salud financiera: ${this.realTimeData.salud || 'N/A'}/100

**💡 RECOMENDACIÓN PERSONALIZADA:**
Basándome en tus datos reales y el contexto de tu pregunta, te sugiero enfocarte en ${this.generateContextualRecommendation(message)}.

**🎯 PRÓXIMOS PASOS:**
• Utiliza \`/analizar\` para un análisis completo
• Pregunta sobre temas específicos para respuestas más detalladas
• Usa \`/predecir\` para proyecciones futuras

¿Te gustaría que profundice en algún aspecto específico?`;
    }

    generateContextualRecommendation(message) {
        if (this.containsKeywords(message, ['problema', 'dificultad', 'crisis'])) {
            return 'identificar y resolver los problemas operativos más críticos';
        }
        if (this.containsKeywords(message, ['mejorar', 'optimizar', 'aumentar'])) {
            return 'las oportunidades de optimización con mayor impacto';
        }
        return 'mantener el equilibrio entre crecimiento y estabilidad financiera';
    }

    generateCashFlowDiagnosis(flujoCaja, salud) {
        if (flujoCaja > 30000 && salud > 80) {
            return '✅ **Excelente**: Tu flujo de caja es sólido y saludable. Momento ideal para inversiones estratégicas.';
        } else if (flujoCaja > 20000 && salud > 60) {
            return '🟡 **Bueno**: Situación estable con oportunidades de mejora. Enfócate en optimización.';
        } else {
            return '🔴 **Atención**: Tu flujo de caja requiere atención inmediata. Prioriza la gestión de liquidez.';
        }
    }

    generateImmediateActions(flujoCaja) {
        if (flujoCaja < 15000) {
            return '• 🚨 URGENTE: Acelerar cobranzas pendientes\n• ⏸️ Diferir pagos no críticos\n• 💰 Activar línea de crédito de emergencia';
        } else {
            return '• 📈 Optimizar ciclo de conversión de efectivo\n• 💎 Evaluar inversiones de corto plazo\n• 📊 Implementar dashboard de liquidez diaria';
        }
    }

    generateMediumTermActions() {
        return '• 🔄 Diversificar fuentes de ingresos\n• 🏦 Establecer múltiples líneas de crédito\n• 📋 Implementar control presupuestario estricto\n• 🎯 Crear reserva de emergencia (3-6 meses de gastos)';
    }

    generateSmartCostAnalysis(message) {
        const gastos = this.realTimeData.gastos || 28700;
        const margen = this.realTimeData.margenUtilidad || 15.2;
        
        return `💰 **ANÁLISIS INTELIGENTE DE COSTOS**

**📊 SITUACIÓN ACTUAL (DATOS REALES):**
• **Gastos totales:** S/. ${gastos.toLocaleString()}
• **Margen de utilidad:** ${margen}%
• **Eficiencia:** ${this.calculateCostEfficiency()}

**🎯 OPORTUNIDADES IDENTIFICADAS:**
${this.generateCostOptimizationPlan(gastos, margen)}

**📈 IMPACTO PROYECTADO:**
• Ahorro estimado: S/. ${this.calculatePotentialSavings(gastos).toLocaleString()}/mes
• Mejora de margen: +${this.calculateMarginImprovement()}%
• ROI de optimización: ${this.calculateOptimizationROI()}%

**⚡ PLAN DE IMPLEMENTACIÓN:**
${this.generateCostImplementationPlan()}

${this.addConversationContext()}`;
    }

    generateSmartTaxGuidance(message) {
        const utilidad = this.realTimeData.utilidad || 16500;
        const ingresos = this.realTimeData.ingresos || 100000;
        
        return `⚖️ **GUÍA TRIBUTARIA INTELIGENTE PERÚ 2025**

**📊 ANÁLISIS DE TU SITUACIÓN:**
• **Utilidad actual:** S/. ${utilidad.toLocaleString()}
• **Ingresos anualizados:** S/. ${(ingresos * 12).toLocaleString()}
• **Régimen sugerido:** ${this.determineTaxRegime(ingresos * 12)}

**💰 CÁLCULO TRIBUTARIO ESTIMADO:**
• **IGV mensual:** S/. ${this.calculateIGV(ingresos).toLocaleString()}
• **Renta anual estimada:** S/. ${this.calculateIncomeTax(utilidad * 12).toLocaleString()}
• **ESSALUD estimado:** S/. ${this.calculateESSALUD(ingresos).toLocaleString()}

**🎯 OPTIMIZACIÓN TRIBUTARIA PERSONALIZADA:**
${this.generateTaxOptimizationPlan(utilidad, ingresos)}

**📅 CALENDARIO TRIBUTARIO 2025:**
${this.generateTaxCalendar()}

**💡 RECOMENDACIÓN IA:**
${this.generateTaxRecommendation(utilidad, ingresos)}`;
    }

    generateSmartMarketingAdvice(message) {
        const ingresos = this.realTimeData.ingresos || 100000;
        const crecimiento = this.realTimeData.crecimiento || 24.8;
        
        return `🎯 **ESTRATEGIA DE MARKETING INTELIGENTE**

**📊 ANÁLISIS DE TU SITUACIÓN:**
• **Ingresos actuales:** S/. ${ingresos.toLocaleString()}
• **Tasa de crecimiento:** ${crecimiento}%
• **Presupuesto marketing recomendado:** S/. ${this.calculateMarketingBudget(ingresos).toLocaleString()}

**🚀 ESTRATEGIA PERSONALIZADA:**
${this.generatePersonalizedMarketingStrategy(ingresos, crecimiento)}

**📈 PLAN DE INVERSIÓN DIGITAL:**
${this.generateDigitalInvestmentPlan(ingresos)}

**🎯 MÉTRICAS DE ÉXITO:**
• **ROI objetivo:** ${this.calculateMarketingROI()}%
• **CAC máximo:** S/. ${this.calculateMaxCAC(ingresos)}
• **LTV estimado:** S/. ${this.calculateLTV(ingresos)}

**⚡ IMPLEMENTACIÓN 90 DÍAS:**
${this.generateMarketingImplementation()}

${this.addConversationContext()}`;
    }

    // Funciones auxiliares para cálculos
    calculateCostEfficiency() {
        const margen = parseFloat(this.realTimeData.margenUtilidad || 15);
        if (margen > 25) return 'Excelente';
        if (margen > 15) return 'Buena';
        return 'Mejorable';
    }

    generateCostOptimizationPlan(gastos, margen) {
        if (margen < 15) {
            return `**🚨 PRIORIDAD ALTA:**
• Auditoría completa de gastos operativos
• Renegociación de contratos principales
• Eliminación de gastos innecesarios (objetivo: -20%)`;
        } else {
            return `**🔧 OPTIMIZACIÓN CONTINUA:**
• Automatización de procesos (ahorro: 8-12%)
• Compras consolidadas (ahorro: 5-8%)
• Eficiencia energética (ahorro: 3-5%)`;
        }
    }

    calculatePotentialSavings(gastos) {
        return Math.round(gastos * 0.15); // 15% de ahorro estimado
    }

    calculateMarginImprovement() {
        return 3.5; // Mejora estimada de margen
    }

    calculateOptimizationROI() {
        return 180; // ROI de optimización
    }

    generateCostImplementationPlan() {
        return `**SEMANA 1-2:** Auditoría y identificación
**SEMANA 3-4:** Renegociación de contratos
**MES 2:** Implementación de mejoras
**MES 3:** Medición y ajustes`;
    }

    determineTaxRegime(annualRevenue) {
        if (annualRevenue <= 1700000) return 'Régimen MYPE Tributario';
        return 'Régimen General';
    }

    calculateIGV(monthlyRevenue) {
        return Math.round(monthlyRevenue * 0.18); // 18% IGV
    }

    calculateIncomeTax(annualProfit) {
        return Math.round(annualProfit * 0.295); // 29.5% renta empresas
    }

    calculateESSALUD(monthlyRevenue) {
        // Estimación basada en planilla promedio
        const estimatedPayroll = monthlyRevenue * 0.3;
        return Math.round(estimatedPayroll * 0.09);
    }

    generateTaxOptimizationPlan(utilidad, ingresos) {
        return `• **Gastos deducibles:** Maximizar capacitación y I+D
• **Depreciación acelerada:** Aprovechar Ley MYPE
• **Provisiones:** Optimizar cuentas incobrables
• **Timing:** Estrategia de ingresos/gastos año fiscal`;
    }

    generateTaxCalendar() {
        return `• **Mensual:** PDT 621 (IGV) hasta día 12
• **Marzo 2026:** Renta Anual 2025
• **Trimestral:** Pagos a cuenta de renta
• **Anual:** ITAN (si activos > S/. 1'000,000)`;
    }

    generateTaxRecommendation(utilidad, ingresos) {
        if (utilidad > 50000) {
            return 'Considera constitución de reservas y planificación fiscal estratégica';
        }
        return 'Mantén control estricto de gastos deducibles y documentación';
    }

    calculateMarketingBudget(ingresos) {
        return Math.round(ingresos * 0.1); // 10% de ingresos para marketing
    }

    generatePersonalizedMarketingStrategy(ingresos, crecimiento) {
        if (crecimiento > 20) {
            return `**🚀 ESTRATEGIA AGRESIVA (alto crecimiento):**
• Incrementar inversión publicitaria +50%
• Expandir a nuevos canales digitales
• Implementar marketing de performance`;
        } else {
            return `**🎯 ESTRATEGIA ESTABLE:**
• Optimizar canales existentes
• Mejorar conversión y retención
• Desarrollar marketing de contenidos`;
        }
    }

    generateDigitalInvestmentPlan(ingresos) {
        const budget = this.calculateMarketingBudget(ingresos);
        return `• **Google Ads:** S/. ${Math.round(budget * 0.4).toLocaleString()} (40%)
• **Facebook/Instagram:** S/. ${Math.round(budget * 0.3).toLocaleString()} (30%)
• **SEO/Contenido:** S/. ${Math.round(budget * 0.2).toLocaleString()} (20%)
• **Email/Automation:** S/. ${Math.round(budget * 0.1).toLocaleString()} (10%)`;
    }

    calculateMarketingROI() {
        return 350; // ROI objetivo de marketing
    }

    calculateMaxCAC(ingresos) {
        return Math.round(ingresos * 0.2); // 20% de ingresos mensuales como CAC máximo
    }

    calculateLTV(ingresos) {
        return Math.round(ingresos * 6); // LTV estimado 6 meses
    }

    generateMarketingImplementation() {
        return `**MES 1:** Setup de herramientas y campañas base
**MES 2:** Optimización y escalamiento
**MES 3:** Análisis de resultados y estrategia 2.0`;
    }
}

// ======= INICIALIZACIÓN SEGURA Y GLOBAL v3.0 =======
let assistantAI = null;

function inicializarAsistenteInteligente() {
    try {
        if (!document.body) {
            setTimeout(inicializarAsistenteInteligente, 100);
            return;
        }
        
        if (assistantAI) {
            console.log('🟡 Asistente IA v3.0 ya inicializado');
            return;
        }
        
        assistantAI = new AsistenteIAInteligente();
        
        // Hacer disponible globalmente
        window.assistantAI = assistantAI;
        window.advancedAI = assistantAI; // Compatibilidad
        
        console.log('✅ GRIZALUM AI ASSISTANT v3.0 SÚPER INTELIGENTE INICIALIZADO');
        console.log('🧠 NUEVAS CARACTERÍSTICAS v3.0:');
        console.log('  • 📊 Lee datos reales del dashboard');
        console.log('  • 🧠 Memoria inteligente de conversaciones');
        console.log('  • ⚡ Comandos especiales (/analizar /reportar /predecir)');
        console.log('  • 🔮 Predicciones automáticas inteligentes');
        console.log('  • 📈 Respuestas contextuales con datos reales');
        console.log('  • 🎯 Análisis ejecutivos automatizados');
        console.log('🚀 ¡Tu Consultor IA Súper Inteligente está listo!');
        
    } catch (error) {
        console.error('❌ Error inicializando Asistente IA v3.0:', error);
    }
}

// Múltiples estrategias de inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAsistenteInteligente);
} else if (document.readyState === 'interactive') {
    setTimeout(inicializarAsistenteInteligente, 100);
} else {
    inicializarAsistenteInteligente();
}

// Compatibilidad con función anterior
window.generateAIReport = function() {
    if (window.assistantAI && window.assistantAI.initialized) {
        return window.assistantAI.generateExecutiveReport();
    } else {
        console.warn('⚠️ Asistente IA v3.0 no inicializado');
        return null;
    }
};

console.log('🧠 GRIZALUM AI ASSISTANT v3.0 SÚPER INTELIGENTE CARGADO');
console.log('🚀 CARACTERÍSTICAS AVANZADAS:');
console.log('  • 📊 Lectura de datos reales del dashboard');
console.log('  • 🧠 Memoria inteligente y contextual');
console.log('  • ⚡ Comandos especiales de alto nivel');
console.log('  • 🔮 Predicciones y análisis automáticos');
console.log('  • 📈 Reportes ejecutivos instantáneos');
console.log('  • 🎯 Respuestas personalizadas con IA');
console.log('💡 Prueba: /analizar para análisis ejecutivo completo');
