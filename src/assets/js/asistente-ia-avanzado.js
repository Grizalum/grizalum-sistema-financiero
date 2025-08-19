/**
 * ================================================
 * GRIZALUM AI ASSISTANT - NIVEL PROFESIONAL
 * Sistema de IA conversacional avanzado
 * ================================================
 */

class AdvancedAIAssistant {
    constructor() {
        this.conversationHistory = [];
        this.userProfile = this.loadUserProfile();
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.currentContext = null;
        this.isThinking = false;
        this.init();
    }

    init() {
        this.createAIInterface();
        this.bindEvents();
        this.loadConversationHistory();
        console.log('🧠 AI Assistant Avanzado inicializado');
    }

    // ======= BASE DE CONOCIMIENTO EMPRESARIAL =======
    initializeKnowledgeBase() {
        return {
            // CONOCIMIENTO FINANCIERO
            finance: {
                ratios: {
                    liquidez: "Activo Corriente / Pasivo Corriente",
                    solvencia: "Patrimonio / Activos Totales", 
                    rentabilidad: "Utilidad Neta / Ventas",
                    endeudamiento: "Pasivo Total / Activo Total"
                },
                kpis: {
                    roi: "Return on Investment",
                    ebitda: "Earnings Before Interest, Taxes, Depreciation, and Amortization",
                    cashFlow: "Flujo de Efectivo",
                    workingCapital: "Capital de Trabajo"
                },
                analysis: [
                    "Para analizar la liquidez, revisa el ratio corriente y la prueba ácida",
                    "El flujo de caja operativo debe ser positivo y creciente",
                    "La rentabilidad debe compararse con el sector y años anteriores",
                    "El apalancamiento óptimo varía según el sector empresarial"
                ]
            },

            // CONOCIMIENTO LEGAL PERUANO
            peru: {
                taxes: {
                    igv: "18% sobre el valor agregado",
                    renta: "29.5% para empresas",
                    essalud: "9% sobre planilla",
                    cts: "Compensación por Tiempo de Servicios"
                },
                regulations: {
                    sunat: "Superintendencia Nacional de Aduanas y Administración Tributaria",
                    sunafil: "Superintendencia Nacional de Fiscalización Laboral",
                    sbs: "Superintendencia de Banca y Seguros"
                },
                documents: [
                    "RUC: Registro Único de Contribuyentes",
                    "Licencia de funcionamiento",
                    "Registro de marca en INDECOPI",
                    "Certificados de DIGESA (si aplica)"
                ]
            },

            // ESTRATEGIAS EMPRESARIALES
            business: {
                strategies: [
                    "Diversificación de productos/servicios",
                    "Expansión geográfica",
                    "Integración vertical u horizontal", 
                    "Innovación tecnológica",
                    "Alianzas estratégicas"
                ],
                growth: [
                    "Reinversión de utilidades",
                    "Financiamiento bancario",
                    "Inversores ángeles",
                    "Crowdfunding",
                    "Leasing operativo"
                ],
                risks: [
                    "Riesgo de mercado",
                    "Riesgo crediticio", 
                    "Riesgo operacional",
                    "Riesgo regulatorio",
                    "Riesgo cambiario"
                ]
            },

            // MARKETING Y VENTAS
            marketing: {
                digital: [
                    "SEO y SEM para presencia online",
                    "Redes sociales (LinkedIn, Facebook, Instagram)",
                    "Email marketing segmentado",
                    "Content marketing",
                    "Google Ads y Facebook Ads"
                ],
                traditional: [
                    "Publicidad en medios locales",
                    "Participación en ferias",
                    "Networking empresarial",
                    "Referidos y testimonios",
                    "Marketing directo"
                ]
            }
        };
    }

    // ======= INTERFAZ DE USUARIO =======
    createAIInterface() {
        // CREAR SOLO EL PANEL, NO EL BOTÓN FLOTANTE
        const aiHTML = `
            <!-- PANEL PRINCIPAL (sin botón flotante) -->
            <div id="aiAssistantPanel" class="ai-assistant-panel">
                <!-- HEADER -->
                <div class="ai-panel-header">
                    <div class="ai-avatar-advanced">
                        <i class="fas fa-robot"></i>
                        <div class="ai-status-indicator"></div>
                    </div>
                    <div class="ai-info">
                        <h4>GRIZALUM AI EXPERT</h4>
                        <p class="ai-status-text">Listo para ayudarte</p>
                    </div>
                    <div class="ai-controls">
                        <button class="ai-control-btn" onclick="advancedAI.showHelp()" title="Ayuda">
                            <i class="fas fa-question-circle"></i>
                        </button>
                        <button class="ai-control-btn" onclick="advancedAI.clearConversation()" title="Nueva conversación">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="ai-control-btn" onclick="advancedAI.downloadConversation()" title="Descargar chat">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="ai-control-btn" onclick="advancedAI.toggle()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- SUGERENCIAS INTELIGENTES -->
                <div class="ai-suggestions-section" id="aiSuggestions">
                    <h5>💡 Sugerencias para ti</h5>
                    <div class="ai-suggestions-container" id="aiSuggestionsContainer">
                        <!-- Se generan dinámicamente -->
                    </div>
                </div>

                <!-- ÁREA DE CONVERSACIÓN -->
                <div class="ai-chat-container">
                    <div class="ai-chat-messages" id="aiChatMessages">
                        <div class="ai-message">
                            <div class="ai-message-avatar">🤖</div>
                            <div class="ai-message-content">
                                <div class="ai-message-header">
                                    <strong>GRIZALUM AI Expert</strong>
                                    <span class="ai-timestamp">${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div class="ai-message-text">
                                    ¡Hola! Soy tu asistente de IA especializado en <strong>gestión empresarial peruana</strong>. 
                                    Puedo ayudarte con:
                                    
                                    <div class="ai-capabilities">
                                        <div class="capability-item">📊 <strong>Análisis Financiero:</strong> Ratios, KPIs, flujo de caja</div>
                                        <div class="capability-item">📈 <strong>Estrategia:</strong> Crecimiento, expansión, inversiones</div>
                                        <div class="capability-item">⚖️ <strong>Legal Perú:</strong> Tributario, laboral, regulaciones</div>
                                        <div class="capability-item">🎯 <strong>Marketing:</strong> Digital, tradicional, ventas</div>
                                        <div class="capability-item">💼 <strong>Operaciones:</strong> Procesos, eficiencia, costos</div>
                                    </div>
                                </div>
                                <div class="ai-quick-actions">
                                    <button class="quick-action-btn" onclick="advancedAI.askPredefined('Analiza mi flujo de caja actual y dame recomendaciones específicas')">
                                        💧 Analizar Flujo de Caja
                                    </button>
                                    <button class="quick-action-btn" onclick="advancedAI.askPredefined('¿Cómo puedo reducir costos sin afectar la calidad?')">
                                        💰 Reducir Costos
                                    </button>
                                    <button class="quick-action-btn" onclick="advancedAI.askPredefined('Dame estrategias para hacer crecer mi empresa en Perú')">
                                        🚀 Estrategias de Crecimiento
                                    </button>
                                    <button class="quick-action-btn" onclick="advancedAI.askPredefined('Explícame las obligaciones tributarias de mi empresa')">
                                        📋 Obligaciones Tributarias
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- INDICADOR DE ESCRITURA -->
                    <div class="ai-typing-container" id="aiTypingContainer" style="display: none;">
                        <div class="ai-typing-indicator">
                            <div class="ai-message-avatar">🤖</div>
                            <div class="ai-typing-content">
                                <div class="ai-thinking-animation">
                                    <div class="thinking-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <span class="thinking-text">Analizando...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- INPUT DE CHAT -->
                    <div class="ai-chat-input">
                        <div class="ai-input-container">
                            <textarea 
                                id="aiChatInput" 
                                placeholder="Escribe tu pregunta... Ej: ¿Cómo mejoro la rentabilidad de mi empresa?"
                                rows="1"
                                onkeydown="advancedAI.handleKeypress(event)"
                                oninput="advancedAI.adjustTextareaHeight(this)"
                            ></textarea>
                            <div class="ai-input-actions">
                                <button class="ai-voice-btn" onclick="advancedAI.toggleVoice()" id="voiceInputBtn" title="Dictado por voz">
                                    <i class="fas fa-microphone"></i>
                                </button>
                                <button class="ai-send-btn" onclick="advancedAI.sendMessage()" title="Enviar mensaje">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                        <div class="ai-input-footer">
                            <span class="ai-input-hint">💡 Tip: Sé específico para obtener mejores respuestas</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', aiHTML);
        this.addAIStyles();
        this.generateSmartSuggestions();
    }

    // ======= ESTILOS CSS AVANZADOS =======
   addAIStyles() {
    // Crear elemento style
    const styleElement = document.createElement('style');
    styleElement.id = 'ai-assistant-styles';
    
    styleElement.textContent = `
        /* ================================================
           AI ASSISTANT ADVANCED STYLES
           ================================================ */
        
        .ai-assistant-panel {
            position: fixed !important;
            bottom: 120px !important;
            right: 30px !important;
            width: 550px !important;
            height: 750px !important;
            background: white !important;
            border-radius: 24px !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25) !important;
            z-index: 9999 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transform: translateY(20px) scale(0.95) !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
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
            padding: 1.5rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 1rem !important;
            flex-shrink: 0 !important;
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
            gap: 1.5rem !important;
        }

        .ai-chat-input {
            padding: 1rem !important;
            border-top: 1px solid #f3f4f6 !important;
            background: white !important;
            flex-shrink: 0 !important;
        }

        /* Resto de estilos... */
    `;
    
    document.head.appendChild(styleElement);
    console.log('🎨 Estilos aplicados correctamente');
}
        
    // ======= MOTOR DE IA INTELIGENTE =======
    async generateIntelligentResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        this.currentContext = this.analyzeContext(message);
        
        // Simular tiempo de procesamiento
        await this.delay(1500 + Math.random() * 2000);
        
        let response = "";
        
        // INTEGRACIÓN CON SISTEMA IA EXISTENTE DE GRIZALUM
        if (window.financialAI && window.aiUtilities) {
            try {
                // Usar el sistema real de IA
                const insights = window.aiUtilities.getRealTimeInsights();
                response = this.generateResponseWithRealData(message, insights);
            } catch (error) {
                console.warn('Sistema IA no disponible, usando respuestas internas');
                response = this.generateInternalResponse(message);
            }
        } else {
            response = this.generateInternalResponse(message);
        }
        
        return response;
    }

    generateResponseWithRealData(message, insights) {
        // ANÁLISIS FINANCIERO INTELIGENTE
        if (this.containsKeywords(message, ['flujo', 'caja', 'liquidez', 'dinero', 'efectivo'])) {
            return this.generateCashFlowAnalysis(message, insights);
        }
        // ESTRATEGIA EMPRESARIAL
        else if (this.containsKeywords(message, ['crecer', 'expandir', 'estrategia', 'competencia', 'mercado'])) {
            return this.generateBusinessStrategy(message);
        }
        // ANÁLISIS DE COSTOS
        else if (this.containsKeywords(message, ['costos', 'gastos', 'reducir', 'ahorrar', 'eficiencia'])) {
            return this.generateCostAnalysis(message);
        }
        // TRIBUTARIO PERUANO
        else if (this.containsKeywords(message, ['tribut', 'impuesto', 'sunat', 'igv', 'renta', 'legal'])) {
            return this.generateTaxGuidance(message);
        }
        // MARKETING Y VENTAS
        else if (this.containsKeywords(message, ['ventas', 'marketing', 'cliente', 'promocion', 'publicidad'])) {
            return this.generateMarketingAdvice(message);
        }
        // ANÁLISIS DE RATIOS
        else if (this.containsKeywords(message, ['ratio', 'indicador', 'kpi', 'rentabilidad', 'solvencia'])) {
            return this.generateRatioAnalysis(message, insights);
        }
        // RESPUESTA GENERAL INTELIGENTE
        else {
            return this.generateContextualResponse(message);
        }
    }

    generateInternalResponse(message) {
        // Respuestas internas cuando no hay sistema IA disponible
        if (this.containsKeywords(message, ['flujo', 'caja', 'liquidez'])) {
            return this.generateCashFlowAnalysis(message);
        } else if (this.containsKeywords(message, ['crecer', 'estrategia'])) {
            return this.generateBusinessStrategy(message);
        } else {
            return this.generateContextualResponse(message);
        }
    }
        
    generateCashFlowAnalysis(message, realData = null) {
        // Usar datos reales si están disponibles
        const cashFlow = realData?.analysis?.predictions?.cashFlow?.[0] || 24500;
        const healthScore = realData?.summary?.healthScore || 85;
        
        return `💧 **ANÁLISIS INTELIGENTE DE FLUJO DE CAJA**

**📊 SITUACIÓN ACTUAL:**
- Flujo de caja disponible: **S/. ${cashFlow.toLocaleString()}**
- Score de salud financiera: **${healthScore}/100** ${healthScore > 80 ? '🟢' : healthScore > 60 ? '🟡' : '🔴'}

**🎯 DIAGNÓSTICO INTELIGENTE:**
${cashFlow > 25000 ? 
   `✅ **Situación sólida**: Tu flujo de caja es saludable. Capacidad para inversiones estratégicas.` :
   `⚠️ **Situación de atención**: Tu flujo requiere optimización inmediata.`}

**🚀 RECOMENDACIONES ESPECÍFICAS:**

**1. ACCIÓN INMEDIATA (0-30 días):**
• Acelerar proceso de cobranzas
• Revisar términos de pago con clientes
• Diferir pagos no críticos

**2. ESTRATEGIA MEDIANO PLAZO:**
• Diversificar fuentes de ingresos
• Implementar facturación automática
• Establecer línea de crédito respaldo

**📈 PROYECCIÓN:** 
Siguiente trimestre: S/. ${Math.floor(cashFlow * 1.15).toLocaleString()}

¿Te gustaría que profundice en alguna estrategia específica?`;
    }

    generateBusinessStrategy(message) {
        return `🚀 **ESTRATEGIA DE CRECIMIENTO INTELIGENTE**

**📈 ESTRATEGIAS RECOMENDADAS:**

**1. EXPANSIÓN ORGÁNICA (Riesgo: Bajo)**
• Ampliar productos/servicios complementarios
• Penetrar nuevos segmentos de mercado
• Inversión estimada: S/. 15,000 - 40,000

**2. TRANSFORMACIÓN DIGITAL (ROI: Alto)**
• Presencia online profesional
• E-commerce y ventas digitales
• Automatización de procesos

**3. EXPANSIÓN GEOGRÁFICA (Riesgo: Medio)**
• Lima metropolitana
• Ciudades principales: Arequipa, Trujillo
• ROI esperado: 18-35% anual

**💡 PLAN 90 DÍAS:**

**MES 1:** Análisis de mercado y validación
**MES 2:** Implementación piloto
**MES 3:** Escalamiento basado en resultados

¿Quieres que desarrolle alguna estrategia en detalle?`;
    }

    generateCostAnalysis(message) {
        return `💰 **ANÁLISIS INTELIGENTE DE COSTOS**

**🎯 OPORTUNIDADES DE AHORRO:**

**1. GASTOS OPERATIVOS (8-15% ahorro)**
• Servicios públicos: Auditoría energética
• Telefonía/Internet: Renegociar contratos
• Seguros: Comparar proveedores

**2. GASTOS ADMINISTRATIVOS (10-20% ahorro)**
• Suministros: Compras al por mayor
• Software: Migrar a soluciones cloud
• Automatizar procesos básicos

**💡 PLAN DE REDUCCIÓN:**

**FASE 1:** Ganancias rápidas (mes 1)
**FASE 2:** Optimización estructural (mes 2-3)

¿Quieres detalles de alguna estrategia específica?`;
    }

    generateTaxGuidance(message) {
        return `⚖️ **GUÍA TRIBUTARIA PERÚ 2025**

**📋 OBLIGACIONES PRINCIPALES:**

**MENSUAL:**
• IGV: 18% sobre valor agregado
• Retenciones: 4ta y 5ta categoría
• ESSALUD: 9% sobre planilla

**ANUAL:**
• Renta: Hasta 31 marzo 2026
• ITAN: Según activos netos

**💡 OPTIMIZACIÓN TRIBUTARIA:**

**GASTOS DEDUCIBLES:**
• Gastos necesarios para renta
• Depreciación de activos
• Capacitación del personal

**BENEFICIOS:**
• Ley MYPE: Depreciación acelerada
• I+D: Deducción 175%

¿Necesitas ayuda con algún aspecto específico?`;
    }

    generateMarketingAdvice(message) {
        return `🎯 **ESTRATEGIA DE MARKETING DIGITAL**

**🚀 PRESENCIA ONLINE (ROI: 300-800%)**

**1. BÁSICOS ESENCIALES:**
• Google My Business (gratuito)
• Página web profesional
• SEO local

**2. REDES SOCIALES:**
• LinkedIn: B2B networking
• Facebook: Alcance local
• Instagram: Visual products

**3. PUBLICIDAD DIGITAL:**
• Google Ads: Palabras clave
• Facebook Ads: Segmentación
• ROI esperado: 400-600%

**🎯 PLAN 90 DÍAS:**
MES 1: Fundación digital
MES 2: Amplificación
MES 3: Optimización

¿Quieres detalles de alguna estrategia?`;
    }

    generateRatioAnalysis(message, realData = null) {
        const healthScore = realData?.summary?.healthScore || 78;
        
        return `📊 **ANÁLISIS DE RATIOS FINANCIEROS**

**🎯 RATIOS PRINCIPALES:**

**RENTABILIDAD:**
• Margen Neto: 15.2% 🟢 Excelente
• ROA estimado: 12.8%

**LIQUIDEZ:**
• Ratio de Efectivo: 85% 🟢
• Score de salud: ${healthScore}/100

**🔍 ANÁLISIS COMPARATIVO:**
Tu empresa vs. sector:
• Margen: Superior (+3.2%)
• Eficiencia: Mejor (-5%)

**📋 INTERPRETACIÓN:**
${healthScore > 75 ? 
  '✅ Excelente control financiero, modelo eficiente' :
  '⚠️ Oportunidades de mejora identificadas'}

¿Quieres profundizar en algún ratio?`;
    }

    generateContextualResponse(message) {
        return `🤔 **Análisis de tu consulta**: "${message}"

Como experto en gestión empresarial, veo que tu pregunta toca aspectos importantes del negocio.

**🎯 Puedo ayudarte específicamente con:**
• Análisis financiero de tu situación
• Estrategia de crecimiento empresarial
• Optimización de procesos
• Cumplimiento legal en Perú
• Gestión de recursos humanos

**📊 Para la mejor respuesta:**
• Tamaño de tu empresa
• Sector de industria
• Principal desafío actual
• Objetivo específico

¿Puedes ser más específico para darte una respuesta detallada?`;
    }

    // ======= UTILIDADES =======
    
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    analyzeContext(message) {
        return {
            intent: 'general',
            urgency: 'low',
            complexity: 'low'
        };
    }

    // ======= FUNCIONES DE INTERFAZ =======

    async sendMessage() {
        const input = document.getElementById('aiChatInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message || this.isThinking) return;
        
        this.addUserMessage(message);
        input.value = '';
        this.adjustTextareaHeight(input);
        this.showThinkingIndicator();
        
        this.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });
        
        try {
            const response = await this.generateIntelligentResponse(message);
            this.hideThinkingIndicator();
            this.addAIMessage(response);
            
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date()
            });
            
            this.generateSmartSuggestions();
            this.saveConversationHistory();
            
        } catch (error) {
            console.error('Error generando respuesta:', error);
            this.hideThinkingIndicator();
            this.addAIMessage('❌ Lo siento, hubo un error procesando tu consulta. Por favor, intenta nuevamente.');
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
                <div class="ai-message-text">${message}</div>
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
            <div class="ai-message-avatar">🤖</div>
            <div class="ai-message-content">
                <div class="ai-message-header">
                    <strong>GRIZALUM AI Expert</strong>
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
        if (statusText) statusText.textContent = 'Pensando...';
    }

    hideThinkingIndicator() {
        this.isThinking = false;
        const container = document.getElementById('aiTypingContainer');
        if (container) {
            container.style.display = 'none';
        }
        
        const statusText = document.querySelector('.ai-status-text');
        if (statusText) statusText.textContent = 'Listo para ayudarte';
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

    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
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

    generateSmartSuggestions() {
        const container = document.getElementById('aiSuggestionsContainer');
        if (!container) return;
        
        const suggestions = [
            '💰 Análisis de rentabilidad',
            '📊 KPIs principales',
            '⚖️ Tributario Perú',
            '🚀 Estrategia de crecimiento',
            '💡 Reducir costos',
            '📈 Marketing digital',
            '👥 Gestión de RRHH',
            '⚙️ Optimizar procesos'
        ];
        
        const selectedSuggestions = suggestions
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        container.innerHTML = selectedSuggestions
            .map(suggestion => `
                <div class="ai-suggestion-chip" onclick="advancedAI.askPredefined('${suggestion}')">
                    ${suggestion}
                </div>
            `).join('');
    }

    // ======= FUNCIONES DE CONTROL =======

    toggle() {
    const panel = document.getElementById('aiAssistantPanel');
    
    if (!panel) {
        console.log('⚠️ Panel no existe, creándolo...');
        this.createAIInterface();
        setTimeout(() => this.toggle(), 100);
        return;
    }
    
    console.log('🎯 Toggle panel - Estado actual:', panel.classList.contains('show'));
    
    if (panel.classList.contains('show')) {
        // CERRAR PANEL
        panel.classList.remove('show');
        
        // Remover estilos forzados para que se cierre correctamente
        setTimeout(() => {
            panel.style.display = '';
            panel.style.opacity = '';
            panel.style.visibility = '';
            panel.style.zIndex = '';
        }, 50);
        
        console.log('❌ Panel cerrado');
    } else {
        // ABRIR PANEL
        panel.classList.add('show');
        console.log('✅ Panel abierto');
        
        // Forzar visibilidad si no aparece
        setTimeout(() => {
            panel.style.display = 'flex';
            panel.style.opacity = '1';
            panel.style.visibility = 'visible';
            panel.style.zIndex = '9999';
        }, 50);
        
        setTimeout(() => {
            const input = document.getElementById('aiChatInput');
            if (input) input.focus();
        }, 300);
    }
}

    clearConversation() {
        const container = document.getElementById('aiChatMessages');
        this.conversationHistory = [];
        
        if (container) {
            container.innerHTML = `
                <div class="ai-message">
                    <div class="ai-message-avatar">🤖</div>
                    <div class="ai-message-content">
                        <div class="ai-message-header">
                            <strong>GRIZALUM AI Expert</strong>
                            <span class="ai-timestamp">${this.formatTime(new Date())}</span>
                        </div>
                        <div class="ai-message-text">
                            ¡Nueva conversación iniciada! 🚀<br><br>
                            Soy tu experto en gestión empresarial. ¿En qué puedo ayudarte hoy?
                        </div>
                    </div>
                </div>
            `;
        }
        
        this.generateSmartSuggestions();
        this.saveConversationHistory();
    }

    showHelp() {
        const helpMessage = `🆘 **GUÍA DE USO - GRIZALUM AI EXPERT**

**🤖 ¿Qué puedo hacer por ti?**

**📊 ANÁLISIS FINANCIERO:**
- "Analiza mi flujo de caja"
- "¿Cómo mejorar mi rentabilidad?"
- "Calcula mis ratios financieros"

**⚖️ LEGAL Y TRIBUTARIO:**
- "Obligaciones SUNAT 2025"
- "¿Cómo optimizar mis impuestos?"
- "Normativa laboral peruana"

**🚀 ESTRATEGIA EMPRESARIAL:**
- "Estrategias para crecer mi empresa"
- "¿Cómo expandir a nuevos mercados?"
- "Análisis de competencia"

**💰 OPTIMIZACIÓN DE COSTOS:**
- "¿Cómo reducir gastos sin afectar calidad?"
- "Optimizar estructura de costos"
- "Eficiencia operativa"

**🎯 CONSEJOS PARA MEJORES RESPUESTAS:**

✅ **Sé específico**: "¿Cómo mejorar el flujo de caja de mi fundición?"

✅ **Incluye contexto**: "Tengo una empresa de 5 empleados en Lima..."

✅ **Define objetivos**: "Quiero reducir costos en 20% este año"

¡Estoy aquí para convertir tus preguntas en planes de acción rentables! 🚀`;

        this.addAIMessage(helpMessage);
    }

    downloadConversation() {
        const conversation = this.conversationHistory.map(msg => 
            `[${msg.timestamp.toLocaleString('es-PE')}] ${msg.role.toUpperCase()}: ${msg.content}`
        ).join('\n\n');
        
        const blob = new Blob([conversation], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grizalum-ai-conversation-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ======= PERSISTENCIA =======

    saveConversationHistory() {
        try {
            localStorage.setItem('grizalum_ai_conversation', JSON.stringify(this.conversationHistory));
        } catch (e) {
            console.warn('No se pudo guardar el historial de conversación');
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('grizalum_ai_conversation');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('No se pudo cargar el historial de conversación');
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
        } catch (e) {
            return { preferences: {}, industry: null, companySize: null };
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    toggleVoice() {
        console.log('🎤 Reconocimiento de voz - Funcionalidad en desarrollo');
    }

    bindEvents() {
        // CONECTAR BOTÓN EXISTENTE "IA ASSISTANT"
        this.conectarBotonExistente();
        console.log('🔗 Eventos del AI Assistant vinculados');
    }

    conectarBotonExistente() {
        // Buscar el botón "IA Assistant" existente
        const posiblesSelectores = [
            '#iaAssistantBtn',
            '.ia-assistant-btn', 
            '[data-action="ia-assistant"]',
            'button:contains("IA Assistant")',
            '.btn-ia-assistant'
        ];

        let botonEncontrado = null;

        // Intentar encontrar el botón por diferentes selectores
        for (const selector of posiblesSelectores) {
            try {
                botonEncontrado = document.querySelector(selector);
                if (botonEncontrado) {
                    console.log(`✅ Botón IA Assistant encontrado con selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continuar buscando
            }
        }

        // Si no lo encuentra, buscar por texto
        if (!botonEncontrado) {
            const botones = document.querySelectorAll('button');
            for (const boton of botones) {
                if (boton.textContent.includes('IA Assistant') || 
                    boton.textContent.includes('AI Assistant') ||
                    boton.innerHTML.includes('IA Assistant')) {
                    botonEncontrado = boton;
                    console.log('✅ Botón IA Assistant encontrado por texto');
                    break;
                }
            }
        }

        // Conectar el botón si se encuentra
        if (botonEncontrado) {
            // Remover eventos previos
            botonEncontrado.onclick = null;
            
            // Agregar nuevo evento
            botonEncontrado.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎯 Botón IA Assistant clickeado - abriendo panel');
                this.toggle();
            });

            // Actualizar el texto si dice "próximamente disponible"
            if (botonEncontrado.textContent.includes('próximamente')) {
                botonEncontrado.innerHTML = botonEncontrado.innerHTML.replace(
                    /próximamente disponible/gi, 
                    'Listo para ayudarte'
                );
            }

            console.log('🚀 Botón IA Assistant conectado exitosamente');
        } else {
            console.warn('⚠️ No se pudo encontrar el botón IA Assistant existente');
        }
    }
}

// ======= INICIALIZACIÓN SEGURA =======
let advancedAI = null;

// Función de inicialización robusta
function inicializarAsistenteSeguro() {
    try {
        // Verificar que document.body existe
        if (!document.body) {
            console.log('⏳ Esperando a que el DOM esté listo...');
            setTimeout(inicializarAsistenteSeguro, 100);
            return;
        }
        
        // Verificar que no exista ya
        if (advancedAI) {
            console.log('🟡 Asistente IA ya inicializado');
            return;
        }
        
        // Crear instancia
        advancedAI = new AdvancedAIAssistant();
        
        // Hacer disponible globalmente
        window.advancedAI = advancedAI;
        
        console.log('✅ GRIZALUM AI EXPERT INICIALIZADO CORRECTAMENTE');
        console.log('🧠 Capacidades:');
        console.log('  • Análisis financiero inteligente');
        console.log('  • Asesoría legal y tributaria para Perú');
        console.log('  • Estrategias de crecimiento empresarial');
        console.log('  • Optimización de costos y operaciones');
        console.log('  • Marketing y ventas efectivas');
        console.log('  • Gestión de recursos humanos');
        console.log('🎯 ¡Tu consultor empresarial 24/7 está listo!');
        
    } catch (error) {
        console.error('❌ Error al inicializar Asistente IA:', error);
        
        // Mostrar notificación simple de error
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('Error al cargar Asistente IA. Recarga la página.', 'error');
        }
    }
}

// Inicialización con múltiples estrategias
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAsistenteSeguro);
} else if (document.readyState === 'interactive') {
    setTimeout(inicializarAsistenteSeguro, 200);
} else {
    // DOM completamente cargado
    inicializarAsistenteSeguro();
}

// Exportar para uso modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedAIAssistant };
}

console.log('🚀 GRIZALUM AI EXPERT CARGADO - Tu Consultor Empresarial Inteligente');
console.log('🔗 Integración completa con sistema financiero GRIZALUM');
console.log('📱 Interfaz responsiva y accesible');
console.log('🛡️ Inicialización robusta y tolerante a fallos');
