/**
 * ================================================================
 * GRIZALUM AI ASSISTANT v3.0 - SÚPER INTELIGENTE
 * Sistema de IA conversacional avanzado con lectura de datos reales
 * SIN DATOS FICTICIOS - Solo datos del gestor real
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
        
        this.log('Inicializando GRIZALUM AI v3.0 - Súper Inteligente...');
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
            this.log('GRIZALUM AI v3.0 inicializado correctamente');
            
        } catch (error) {
            this.handleError('Error finalizando inicialización', error);
        }
    }

    // ======= LECTOR DE DATOS REALES v3.0 - CORREGIDO =======
    startRealTimeDataReader() {
        // Leer datos iniciales
        this.readDashboardData();
        
        // Actualizar cada 30 segundos
        setInterval(() => {
            this.readDashboardData();
        }, 30000);
        
        this.log('Lector de datos reales iniciado');
    }

    readDashboardData() {
        try {
            // CORREGIDO: Obtener datos del gestor real, no del DOM
            const datosReales = this.obtenerDatosDelGestor();
            
            this.realTimeData = {
                ingresos: datosReales.ingresos,
                gastos: datosReales.gastos,
                utilidad: datosReales.utilidad,
                crecimiento: datosReales.crecimiento,
                flujoCaja: datosReales.flujoCaja,
                timestamp: new Date(),
                
                // Datos calculados
                margenUtilidad: this.calculateMargin(datosReales),
                tendencia: this.analyzeTrend(datosReales),
                salud: this.calculateHealthScore(datosReales)
            };
            
            this.log(`Datos leídos: Ingresos ${this.realTimeData.ingresos}, Gastos ${this.realTimeData.gastos}`);
            
        } catch (error) {
            this.log('Error leyendo datos del dashboard', 'warn');
        }
    }

    // NUEVA FUNCIÓN: Obtener datos del gestor de empresas real
    obtenerDatosDelGestor() {
        // Intentar obtener desde el gestor de empresas
        if (window.obtenerDatosActuales && typeof window.obtenerDatosActuales === 'function') {
            const datos = window.obtenerDatosActuales();
            if (datos && datos.financiero) {
                return {
                    ingresos: parseFloat(datos.financiero.ingresos) || 0,
                    gastos: parseFloat(datos.financiero.gastos) || 0,
                    utilidad: parseFloat(datos.financiero.utilidad) || 0,
                    crecimiento: parseFloat(datos.financiero.crecimiento) || 0,
                    flujoCaja: parseFloat(datos.financiero.flujoCaja) || 0
                };
            }
        }
        
        // Fallback: Leer del DOM si el gestor no está disponible
        return {
            ingresos: this.extractValue('#revenueValue') || 0,
            gastos: this.extractValue('#expensesValue') || 0,
            utilidad: this.extractValue('#profitValue') || 0,
            crecimiento: this.extractPercentage('#growthValue') || 0,
            flujoCaja: this.extractValue('#sidebarCashFlow') || 0
        };
    }

    // CORREGIDO: Sin fallbacks ficticios
    extractValue(selector) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent.trim();
                const match = text.match(/[\d,]+\.?\d*/);
                return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }

    extractPercentage(selector) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent.trim();
                const match = text.match(/[+-]?[\d.]+/);
                return match ? parseFloat(match[0]) : 0;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }

    // CORREGIDO: Cálculos sin valores ficticios
    calculateMargin(datos) {
        if (datos && datos.ingresos > 0) {
            return ((datos.ingresos - datos.gastos) / datos.ingresos * 100).toFixed(1);
        }
        return 0;
    }

    analyzeTrend(datos) {
        if (!datos) return 'sin_datos';
        
        const margin = parseFloat(this.calculateMargin(datos));
        if (margin > 20) return 'positiva';
        if (margin > 10) return 'estable';
        if (margin > 0) return 'atención';
        return 'crítica';
    }

    calculateHealthScore(datos) {
        if (!datos) return 0;
        
        const margin = parseFloat(this.calculateMargin(datos));
        const growth = datos.crecimiento || 0;
        
        let score = 50;
        if (margin > 15) score += 20;
        if (margin > 25) score += 15;
        if (growth > 15) score += 15;
        
        return Math.min(100, Math.max(0, score));
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
            return "Lo siento, hubo un error procesando tu consulta. Por favor, intenta nuevamente.";
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
                return "**Memoria de conversación reiniciada**\n\nEmpezamos de nuevo. ¿En qué puedo ayudarte?";
                
            default:
                return `**Comando desconocido**: "${command}"\n\nEscribe \`/ayuda\` para ver comandos disponibles.`;
        }
    }

    generateExecutiveAnalysis() {
        const datos = this.realTimeData;
        
        return `**ANÁLISIS EJECUTIVO EN TIEMPO REAL**

**SITUACIÓN FINANCIERA ACTUAL:**
- **Ingresos:** S/. ${(datos.ingresos || 0).toLocaleString()}
- **Gastos:** S/. ${(datos.gastos || 0).toLocaleString()}  
- **Utilidad:** S/. ${(datos.utilidad || 0).toLocaleString()}
- **Margen:** ${datos.margenUtilidad || 0}%

**INDICADORES CLAVE:**
- **Score de Salud:** ${datos.salud || 0}/100 ${this.getHealthIcon()}
- **Tendencia:** ${this.getTrendIcon()} ${datos.tendencia || 'Sin datos'}
- **Crecimiento:** ${datos.crecimiento || 0}%

**INSIGHTS AUTOMÁTICOS:**
${this.generateAutoInsights()}

**ACCIONES RECOMENDADAS:**
${this.generateActionItems()}

*Análisis generado: ${new Date().toLocaleString('es-PE')}*`;
    }

    // ======= RESPUESTAS INTELIGENTES CON DATOS REALES =======
    generateSmartCashFlowAnalysis(message) {
        const datos = this.realTimeData;
        const flujoCaja = datos.flujoCaja || 0;
        const salud = datos.salud || 0;
        
        return `**ANÁLISIS INTELIGENTE DE FLUJO DE CAJA**

**SITUACIÓN ACTUAL (DATOS REALES):**
- **Flujo de caja:** S/. ${flujoCaja.toLocaleString()}
- **Score de salud:** ${salud}/100 ${this.getHealthIcon()}
- **Tendencia:** ${this.getTrendIcon()} ${datos.tendencia}

**DIAGNÓSTICO IA:**
${this.generateCashFlowDiagnosis(flujoCaja, salud)}

**PLAN DE ACCIÓN PERSONALIZADO:**

**INMEDIATO (0-7 días):**
${this.generateImmediateActions(flujoCaja)}

**MEDIANO PLAZO (1-4 semanas):**
${this.generateMediumTermActions()}

**PROYECCIÓN INTELIGENTE:**
- Próxima semana: S/. ${Math.round(flujoCaja * 1.03).toLocaleString()}
- Próximo mes: S/. ${Math.round(flujoCaja * 1.12).toLocaleString()}`;
    }

    // [Continúa con las demás funciones igual que antes, pero usando this.realTimeData que ya no tiene valores ficticios]
    
    generateSmartBusinessStrategy(message) {
        const datos = this.realTimeData;
        const crecimiento = datos.crecimiento || 0;
        const margen = datos.margenUtilidad || 0;
        
        return `**ESTRATEGIA EMPRESARIAL INTELIGENTE**

**ANÁLISIS DE TU SITUACIÓN:**
- **Crecimiento actual:** ${crecimiento}%
- **Margen de utilidad:** ${margen}%
- **Capacidad de inversión:** ${this.getInvestmentCapacity(margen)}

**ESTRATEGIAS PERSONALIZADAS:**
${this.generatePersonalizedStrategies(crecimiento, margen)}

**PLAN DE CRECIMIENTO 90 DÍAS:**
${this.generateGrowthPlan(crecimiento, margen)}

**ROI ESPERADO:** ${this.calculateExpectedROI(margen)}%`;
    }

    // ======= INTERFAZ MEJORADA v3.0 =======
    generatePanelHTML() {
        return `
            <div id="aiAssistantPanel" class="ai-assistant-panel">
                <div class="ai-panel-header">
                    <div class="ai-avatar-advanced">
                        <i class="fas fa-brain"></i>
                        <div class="ai-status-indicator"></div>
                    </div>
                    <div class="ai-info">
                        <h4>GRIZALUM AI v3.0</h4>
                        <p class="ai-status-text">Súper Inteligente</p>
                    </div>
                    <div class="ai-controls">
                        <button class="ai-control-btn" onclick="if(window.assistantAI) window.assistantAI.clearConversation();" title="Nueva conversación">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="ai-control-btn" onclick="if(window.assistantAI) window.assistantAI.toggle();" title="Cerrar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="ai-chat-container">
                    <div class="ai-chat-messages" id="aiChatMessages">
                        ${this.generateWelcomeMessage()}
                    </div>

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

                    <div class="ai-chat-input">
                        <div class="ai-input-container">
                            <textarea 
                                id="aiChatInput" 
                                placeholder="Pregunta algo o usa comandos: /analizar /reportar /predecir"
                                rows="1"
                                onkeydown="if(window.assistantAI) window.assistantAI.handleKeypress(event);"
                                oninput="if(window.assistantAI) window.assistantAI.adjustTextareaHeight(this);"
                            ></textarea>
                            <div class="ai-input-actions">
                                <button class="ai-send-btn" onclick="if(window.assistantAI) window.assistantAI.sendMessage();" title="Enviar mensaje">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                        <div class="ai-input-footer">
                            <span class="ai-input-hint">v3.0 con datos reales • Usa /ayuda para comandos</span>
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
                        <strong>GRIZALUM AI v3.0</strong>
                        <span class="ai-timestamp">${this.formatTime(new Date())}</span>
                    </div>
                    <div class="ai-message-text">
                        Soy tu **Asistente IA Súper Inteligente** v3.0
                        
                        **NUEVAS CAPACIDADES:**
                        <div class="ai-capabilities">
                            <div class="capability-item">**Datos Reales:** Leo tu dashboard en tiempo real</div>
                            <div class="capability-item">**Memoria Inteligente:** Recuerdo nuestra conversación</div>
                            <div class="capability-item">**Comandos Especiales:** /analizar /reportar /predecir</div>
                            <div class="capability-item">**Predicciones:** Analizo tendencias y proyecciones</div>
                        </div>
                        
                        **COMANDOS RÁPIDOS:**
                        <div class="ai-quick-actions">
                            <button class="quick-action-btn" onclick="if(window.assistantAI) window.assistantAI.askPredefined('/analizar');">
                                /analizar
                            </button>
                            <button class="quick-action-btn" onclick="if(window.assistantAI) window.assistantAI.askPredefined('/reportar');">
                                /reportar
                            </button>
                            <button class="quick-action-btn" onclick="if(window.assistantAI) window.assistantAI.askPredefined('/predecir');">
                                /predecir
                            </button>
                            <button class="quick-action-btn" onclick="if(window.assistantAI) window.assistantAI.askPredefined('¿Cómo puedo aumentar mis ingresos?');">
                                Aumentar Ingresos
                            </button>
                        </div>
                        
                        **Ejemplo:** Pregunta "¿Cómo está mi flujo de caja?" y analizaré tus datos reales.
                    </div>
                </div>
            </div>
        `;
    }

    // [El resto de funciones continúan igual - toggle, createAIInterface, addAIStyles, etc.]
    // Las funciones auxiliares también se mantienen

    // UTILIDADES
    getHealthIcon() {
        const salud = this.realTimeData.salud || 0;
        if (salud >= 80) return '🟢';
        if (salud >= 60) return '🟡';
        if (salud > 0) return '🔴';
        return '⚪';
    }

    getTrendIcon() {
        const tendencia = this.realTimeData.tendencia || 'sin_datos';
        if (tendencia === 'positiva') return '📈';
        if (tendencia === 'crítica' || tendencia === 'atención') return '📉';
        return '➡️';
    }

    generateAutoInsights() {
        const margen = parseFloat(this.realTimeData.margenUtilidad || 0);
        const insights = [];
        
        if (margen > 20) {
            insights.push('• Excelente margen de utilidad - Posición sólida para inversiones');
        } else if (margen < 10 && margen > 0) {
            insights.push('• Margen bajo - Revisar estructura de costos urgentemente');
        } else if (margen === 0) {
            insights.push('• Sin datos financieros - Registra tus primeras transacciones');
        }
        
        if (this.realTimeData.crecimiento > 20) {
            insights.push('• Crecimiento excepcional - Considerar expansión acelerada');
        }
        
        if (insights.length === 0) {
            insights.push('• Registra datos financieros para obtener insights personalizados');
        }
        
        return insights.join('\n');
    }

    generateActionItems() {
        const margen = parseFloat(this.realTimeData.margenUtilidad || 0);
        const actions = [];
        
        if (margen === 0) {
            actions.push('• Registra tus primeros ingresos y gastos en el sistema');
            actions.push('• Configura las cuentas bancarias de tu empresa');
        } else if (margen < 15) {
            actions.push('• CRÍTICO: Optimizar costos operativos (meta: +5% margen)');
        } else {
            actions.push('• Revisar precios y competencia mensualmente');
            actions.push('• Diversificar fuentes de ingresos (objetivo: +20%)');
        }
        
        return actions.join('\n');
    }

    // Resto de funciones auxiliares simplificadas
    getInvestmentCapacity(margen) {
        if (margen > 25) return 'Alta';
        if (margen > 15) return 'Media';
        if (margen > 0) return 'Limitada';
        return 'Sin datos';
    }

    calculateExpectedROI(margen) {
        if (margen > 20) return 28;
        if (margen > 10) return 18;
        return 8;
    }

    generateCashFlowDiagnosis(flujoCaja, salud) {
        if (flujoCaja === 0) {
            return '**Sin datos**: Registra tus movimientos de caja para obtener diagnóstico.';
        } else if (flujoCaja > 30000 && salud > 80) {
            return '**Excelente**: Tu flujo de caja es sólido y saludable. Momento ideal para inversiones estratégicas.';
        } else if (flujoCaja > 20000 && salud > 60) {
            return '**Bueno**: Situación estable con oportunidades de mejora. Enfócate en optimización.';
        } else {
            return '**Atención**: Tu flujo de caja requiere atención inmediata. Prioriza la gestión de liquidez.';
        }
    }

    generateImmediateActions(flujoCaja) {
        if (flujoCaja === 0) {
            return '• Registra tus movimientos diarios de caja\n• Define tus cuentas bancarias principales\n• Establece presupuestos iniciales';
        } else if (flujoCaja < 15000) {
            return '• URGENTE: Acelerar cobranzas pendientes\n• Diferir pagos no críticos\n• Activar línea de crédito de emergencia';
        } else {
            return '• Optimizar ciclo de conversión de efectivo\n• Evaluar inversiones de corto plazo\n• Implementar dashboard de liquidez diaria';
        }
    }

    generateMediumTermActions() {
        return '• Diversificar fuentes de ingresos\n• Establecer múltiples líneas de crédito\n• Implementar control presupuestario estricto\n• Crear reserva de emergencia (3-6 meses de gastos)';
    }

    generatePersonalizedStrategies(crecimiento, margen) {
        if (crecimiento === 0 && margen === 0) {
            return `**INICIO DE OPERACIONES:**
- Registra tus primeras transacciones en el sistema
- Establece objetivos financieros mensuales
- Implementa controles básicos de gastos`;
        } else if (margen < 15) {
            return `**OPTIMIZACIÓN INMEDIATA:**
- PRIORIDAD: Reducir costos operativos
- Mantener eficiencia actual
- Buscar economías de escala`;
        } else {
            return `**EXPANSIÓN ESTRATÉGICA:**
- Acelerar expansión - momento óptimo
- Explorar nuevos segmentos
- Reinvertir utilidades estratégicamente`;
        }
    }

    generateGrowthPlan(crecimiento, margen) {
        if (margen === 0) {
            return `**MES 1:** Establecer base de datos financieros
**MES 2:** Implementar controles y presupuestos
**MES 3:** Análisis y primeras optimizaciones`;
        }
        return `**MES 1:** Auditoría y optimización
**MES 2:** Implementación de mejoras
**MES 3:** Expansión y consolidación`;
    }

    generateSmartCostAnalysis(message) {
        const gastos = this.realTimeData.gastos || 0;
        const margen = this.realTimeData.margenUtilidad || 0;
        
        if (gastos === 0) {
            return `**ANÁLISIS DE COSTOS**

**SITUACIÓN ACTUAL:**
- **Gastos totales:** S/. 0 (Sin datos registrados)

**PRIMEROS PASOS:**
- Registra tus gastos operativos diarios
- Categoriza tus gastos principales
- Establece presupuestos mensuales

**PRÓXIMOS PASOS:**
Cuando tengas datos registrados, podré darte análisis detallados y recomendaciones personalizadas.`;
        }
        
        return `**ANÁLISIS INTELIGENTE DE COSTOS**

**SITUACIÓN ACTUAL (DATOS REALES):**
- **Gastos totales:** S/. ${gastos.toLocaleString()}
- **Margen de utilidad:** ${margen}%
- **Eficiencia:** ${this.calculateCostEfficiency(margen)}

**OPORTUNIDADES IDENTIFICADAS:**
${this.generateCostOptimizationPlan(margen)}

**IMPACTO PROYECTADO:**
- Ahorro estimado: S/. ${Math.round(gastos * 0.15).toLocaleString()}/mes
- Mejora de margen: +3.5%`;
    }

    calculateCostEfficiency(margen) {
        if (margen > 25) return 'Excelente';
        if (margen > 15) return 'Buena';
        if (margen > 0) return 'Mejorable';
        return 'Sin datos';
    }

    generateCostOptimizationPlan(margen) {
        if (margen === 0) {
            return `**ESTABLECER BASE:**
- Registrar todos los gastos operativos
- Crear categorías de gastos
- Implementar controles básicos`;
        } else if (margen < 15) {
            return `**PRIORIDAD ALTA:**
- Auditoría completa de gastos operativos
- Renegociación de contratos principales
- Eliminación de gastos innecesarios (objetivo: -20%)`;
        } else {
            return `**OPTIMIZACIÓN CONTINUA:**
- Automatización de procesos (ahorro: 8-12%)
- Compras consolidadas (ahorro: 5-8%)
- Eficiencia energética (ahorro: 3-5%)`;
        }
    }

    // Continúa con el resto de funciones estándar...
    // [Por brevedad, incluyo solo las críticas]

    toggle() {
        if (this.isToggling) {
            this.log('Toggle ya en progreso, ignorando...', 'warn');
            return;
        }
        this.isToggling = true;
        
        setTimeout(() => {
            this.isToggling = false;
        }, 500);
        
        try {
            this.log('Toggle del panel AI ejecutado');
            
            let panel = document.getElementById('aiAssistantPanel');
            if (!panel) {
                this.log('Panel no existe, creándolo...', 'warn');
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
                this.log('Panel AI abierto CON ESTILOS FORZADOS');
                
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
                this.log('Panel AI cerrado CORRECTAMENTE');
            }
            
        } catch (error) {
            this.handleError('Error en toggle', error);
        }
    }

    createAIInterface() {
        try {
            const existingPanel = document.getElementById('aiAssistantPanel');
            if (existingPanel) {
                this.log('Panel ya existe, actualizando...', 'warn');
                existingPanel.remove();
            }

            const aiHTML = this.generatePanelHTML();
            document.body.insertAdjacentHTML('beforeend', aiHTML);
            
            this.addAIStyles();
            
            this.log('Interfaz AI v3.0 creada exitosamente');
            
        } catch (error) {
            this.handleError('Error creando interfaz', error);
        }
    }

    // Funciones auxiliares estándar
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
            this.addAIMessage('Lo siento, hubo un error procesando tu consulta. Por favor, intenta nuevamente.');
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
                    <strong>GRIZALUM AI v3.0</strong>
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
    }

    hideThinkingIndicator() {
        this.isThinking = false;
        const container = document.getElementById('aiTypingContainer');
        if (container) {
            container.style.display = 'none';
        }
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
            
        } catch (error) {
            this.handleError('Error limpiando conversación', error);
        }
    }

    handleError(mensaje, error) {
        this.errors.push({
            mensaje,
            error: error.message,
            timestamp: new Date(),
            stack: error.stack
        });
        
        this.log(`${mensaje}: ${error.message}`, 'error');
    }
    
    log(mensaje, tipo = 'info') {
        const timestamp = new Date().toLocaleTimeString('es-PE');
        const prefijo = `[GRIZALUM-AI-v3.0 ${timestamp}]`;
        
        switch (tipo) {
            case 'error':
                console.error(`${prefijo}`, mensaje);
                break;
            case 'warn':
                console.warn(`${prefijo}`, mensaje);
                break;
            default:
                console.log(`${prefijo}`, mensaje);
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
                '.ai-header-button',
                '#iaAssistantBtn',
                '[onclick*="toggleAIAssistant"]'
            ];

            let botonEncontrado = null;

            for (const selector of posiblesSelectores) {
                try {
                    botonEncontrado = document.querySelector(selector);
                    if (botonEncontrado) {
                        this.log(`Botón IA Assistant encontrado: ${selector}`);
                        break;
                    }
                } catch (e) {
                    // Continuar buscando
                }
            }

            if (botonEncontrado) {
                botonEncontrado.onclick = null;
                botonEncontrado.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle();
                });

                this.log('Botón IA Assistant conectado exitosamente');
                
            } else {
                this.log('No se encontró botón IA Assistant', 'warn');
            }
            
        } catch (error) {
            this.handleError('Error conectando botón existente', error);
        }
    }
    
    saveConversationHistory() {
        try {
            localStorage.setItem('grizalum_ai_conversation', JSON.stringify(this.conversationHistory));
        } catch (error) {
            this.log('No se pudo guardar historial', 'warn');
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('grizalum_ai_conversation');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
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
        // Eventos adicionales si se necesitan
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

    // Funciones auxiliares para comandos especiales
    generateCommandHelp() {
        return `**COMANDOS ESPECIALES DISPONIBLES**

**/analizar** - Análisis ejecutivo completo
**/reportar** - Reporte ejecutivo automatizado
**/predecir** - Predicciones y proyecciones
**/estado** - Estado actual del sistema
**/ayuda** - Esta ayuda
**/reset** - Reiniciar conversación

**EJEMPLOS:**
- "¿Cómo está mi flujo de caja?"
- "/analizar"
- "Predice mis ventas del próximo mes"`;
    }

    generateSystemStatus() {
        return `**ESTADO DEL SISTEMA IA v3.0**

**DATOS CONECTADOS:**
- Ingresos: ${this.realTimeData.ingresos > 0 ? 'Conectado' : 'Sin datos'}
- Gastos: ${this.realTimeData.gastos > 0 ? 'Conectado' : 'Sin datos'}
- Flujo de Caja: ${this.realTimeData.flujoCaja > 0 ? 'Conectado' : 'Sin datos'}

**MEMORIA IA:**
- Conversaciones: ${this.conversationMemory.length}
- Comandos ejecutados: ${this.commandHistory.length}
- Última actualización: ${this.realTimeData.timestamp ? this.realTimeData.timestamp.toLocaleTimeString('es-PE') : 'N/A'}

**VERSIÓN:** ${this.version}
**ESTADO:** Completamente operativo`;
    }

    generateExecutiveReport() {
        const datos = this.realTimeData;
        return `**REPORTE EJECUTIVO AUTOMATIZADO**

**RESUMEN FINANCIERO:**
- Ingresos: S/. ${(datos.ingresos || 0).toLocaleString()}
- Gastos: S/. ${(datos.gastos || 0).toLocaleString()}
- Utilidad: S/. ${(datos.utilidad || 0).toLocaleString()}
- Margen: ${datos.margenUtilidad || 0}%

**ANÁLISIS:**
${this.generateAutoInsights()}

**ALERTAS:**
${this.generateActionItems()}

*Reporte #${this.commandHistory.filter(c => c.command.includes('reporte')).length} - ${new Date().toLocaleDateString('es-PE')}*`;
    }

    generatePredictions() {
        const datos = this.realTimeData;
        const ingresos = datos.ingresos || 0;
        const gastos = datos.gastos || 0;
        
        if (ingresos === 0) {
            return `**PREDICCIONES INTELIGENTES**

Sin datos suficientes para generar predicciones.

Registra tus transacciones durante al menos un mes para obtener proyecciones precisas.`;
        }
        
        return `**PREDICCIONES INTELIGENTES**

**PROYECCIONES (30 DÍAS):**
- **Ingresos proyectados:** S/. ${Math.round(ingresos * 1.15).toLocaleString()}
- **Gastos estimados:** S/. ${Math.round(gastos * 1.08).toLocaleString()}
- **Utilidad esperada:** S/. ${Math.round((ingresos * 1.15) - (gastos * 1.08)).toLocaleString()}

**ESCENARIOS:**
**Optimista:** Crecimiento +20%
**Realista:** Crecimiento +15%  
**Conservador:** Crecimiento +8%

*Predicciones basadas en algoritmos propietarios GRIZALUM*`;
    }

    generateComprehensiveAnalysis() {
        return this.generateExecutiveAnalysis();
    }

    generateSmartContextualResponse(message) {
        const datos = this.realTimeData;
        
        return `**Análisis Inteligente**

He analizado tu pregunta: "${message}"

**DATOS ACTUALES:**
- Ingresos: S/. ${(datos.ingresos || 0).toLocaleString()}
- Margen: ${datos.margenUtilidad || 0}%
- Salud financiera: ${datos.salud || 0}/100

**RECOMENDACIÓN:**
${datos.ingresos === 0 ? 
    'Comienza registrando tus primeras transacciones para obtener recomendaciones personalizadas.' :
    'Utiliza /analizar para un análisis completo o pregunta sobre temas específicos.'}`;
    }

    generateSmartTaxGuidance(message) {
        const utilidad = this.realTimeData.utilidad || 0;
        const ingresos = this.realTimeData.ingresos || 0;
        
        if (ingresos === 0) {
            return `**GUÍA TRIBUTARIA PERÚ 2025**

Sin datos financieros registrados.

Cuando tengas datos, podré calcular:
- IGV mensual estimado
- Renta anual proyectada
- Régimen tributario recomendado
- Calendario de obligaciones`;
        }
        
        return `**GUÍA TRIBUTARIA INTELIGENTE PERÚ 2025**

**ANÁLISIS:**
- **Ingresos anualizados:** S/. ${(ingresos * 12).toLocaleString()}
- **Régimen sugerido:** ${ingresos * 12 <= 1700000 ? 'MYPE Tributario' : 'Régimen General'}

**ESTIMACIÓN TRIBUTARIA:**
- **IGV mensual:** S/. ${Math.round(ingresos * 0.18).toLocaleString()}
- **Renta anual:** S/. ${Math.round((utilidad * 12) * 0.295).toLocaleString()}

**CALENDARIO 2025:**
- Mensual: PDT 621 (IGV) hasta día 12
- Marzo 2026: Renta Anual 2025`;
    }

    generateSmartMarketingAdvice(message) {
        const ingresos = this.realTimeData.ingresos || 0;
        
        if (ingresos === 0) {
            return `**ESTRATEGIA DE MARKETING**

Sin datos de ingresos para calcular presupuesto óptimo.

Registra tus ventas para obtener:
- Presupuesto de marketing recomendado
- Estrategia personalizada
- ROI proyectado
- Plan de inversión digital`;
        }
        
        const budget = Math.round(ingresos * 0.1);
        
        return `**ESTRATEGIA DE MARKETING INTELIGENTE**

**PRESUPUESTO RECOMENDADO:** S/. ${budget.toLocaleString()} (10% ingresos)

**PLAN DE INVERSIÓN DIGITAL:**
- Google Ads: S/. ${Math.round(budget * 0.4).toLocaleString()} (40%)
- Facebook/Instagram: S/. ${Math.round(budget * 0.3).toLocaleString()} (30%)
- SEO/Contenido: S/. ${Math.round(budget * 0.2).toLocaleString()} (20%)
- Email/Automation: S/. ${Math.round(budget * 0.1).toLocaleString()} (10%)

**ROI OBJETIVO:** 350%`;
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
                font-size: 0.85rem !important;
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
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', css);
        this.log('Estilos CSS v3.0 aplicados');
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
            console.log('Asistente IA v3.0 ya inicializado');
            return;
        }
        
        assistantAI = new AsistenteIAInteligente();
        
        window.assistantAI = assistantAI;
        window.advancedAI = assistantAI;
        
        console.log('GRIZALUM AI ASSISTANT v3.0 INICIALIZADO');
        console.log('CARACTERÍSTICAS v3.0:');
        console.log('  • Lee datos reales del gestor de empresas');
        console.log('  • Memoria inteligente de conversaciones');
        console.log('  • Comandos especiales (/analizar /reportar /predecir)');
        console.log('  • Sin datos ficticios - Todo es real');
        
    } catch (error) {
        console.error('Error inicializando Asistente IA v3.0:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAsistenteInteligente);
} else if (document.readyState === 'interactive') {
    setTimeout(inicializarAsistenteInteligente, 100);
} else {
    inicializarAsistenteInteligente();
}

window.generateAIReport = function() {
    if (window.assistantAI && window.assistantAI.initialized) {
        return window.assistantAI.generateExecutiveReport();
    } else {
        console.warn('Asistente IA v3.0 no inicializado');
        return null;
    }
};

console.log('GRIZALUM AI ASSISTANT v3.0 CARGADO - SIN DATOS FICTICIOS');
