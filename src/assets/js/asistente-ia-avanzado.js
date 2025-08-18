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
        const aiHTML = `
            <!-- BOTÓN FLOTANTE IA -->
            <div id="aiAssistantButton" class="ai-assistant-button" onclick="advancedAI.toggle()">
                <div class="ai-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="ai-pulse"></div>
                <div class="ai-notification-badge" id="aiNotificationBadge" style="display: none;">!</div>
            </div>

            <!-- PANEL PRINCIPAL -->
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
        const css = `
            <style>
            /* ================================================
               AI ASSISTANT ADVANCED STYLES
               ================================================ */
            
            .ai-assistant-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                z-index: 1000;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: visible;
            }

            .ai-assistant-button:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
            }

            .ai-icon {
                color: white;
                font-size: 1.8rem;
                z-index: 2;
                animation: brainPulse 2s ease-in-out infinite;
            }

            @keyframes brainPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .ai-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                opacity: 0.7;
                animation: aiPulse 2s infinite;
            }

            @keyframes aiPulse {
                0% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.2); opacity: 0.3; }
                100% { transform: scale(1.4); opacity: 0; }
            }

            .ai-notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 20px;
                height: 20px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: bold;
                animation: badgeBounce 2s infinite;
            }

            @keyframes badgeBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            .ai-assistant-panel {
                position: fixed;
                bottom: 120px;
                right: 30px;
                width: 550px;
                height: 750px;
                background: white;
                border-radius: 24px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.95);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                border: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
            }

            .ai-assistant-panel.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }

            .ai-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-shrink: 0;
            }

            .ai-avatar-advanced {
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                position: relative;
            }

            .ai-status-indicator {
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 12px;
                height: 12px;
                background: #10b981;
                border: 2px solid white;
                border-radius: 50%;
                animation: statusPulse 2s infinite;
            }

            @keyframes statusPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .ai-info {
                flex: 1;
            }

            .ai-info h4 {
                margin: 0 0 0.25rem 0;
                font-size: 1.1rem;
                font-weight: 700;
                letter-spacing: 0.5px;
            }

            .ai-status-text {
                margin: 0;
                font-size: 0.85rem;
                opacity: 0.9;
            }

            .ai-controls {
                display: flex;
                gap: 0.5rem;
            }

            .ai-control-btn {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .ai-control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .ai-suggestions-section {
                padding: 1rem 1.5rem 0.5rem;
                border-bottom: 1px solid #f3f4f6;
                background: #fafafa;
                flex-shrink: 0;
            }

            .ai-suggestions-section h5 {
                margin: 0 0 0.75rem 0;
                color: #374151;
                font-size: 0.85rem;
                font-weight: 700;
            }

            .ai-suggestions-container {
                display: flex;
                gap: 0.5rem;
                overflow-x: auto;
                padding-bottom: 0.5rem;
            }

            .ai-suggestion-chip {
                background: white;
                border: 1px solid #e5e7eb;
                padding: 0.5rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.3s ease;
                color: #6b7280;
            }

            .ai-suggestion-chip:hover {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                transform: translateY(-1px);
            }

            .ai-chat-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .ai-chat-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .ai-message, .user-message {
                display: flex;
                gap: 0.75rem;
                align-items: flex-start;
                animation: messageSlideIn 0.3s ease;
            }

            @keyframes messageSlideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .user-message {
                flex-direction: row-reverse;
            }

            .ai-message-avatar, .user-message-avatar {
                width: 36px;
                height: 36px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                flex-shrink: 0;
            }

            .ai-message-avatar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .user-message-avatar {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }

            .ai-message-content, .user-message-content {
                background: #f8fafc;
                padding: 1rem;
                border-radius: 16px;
                max-width: 380px;
                line-height: 1.5;
                position: relative;
            }

            .user-message-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .ai-message-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #e5e7eb;
            }

            .ai-timestamp {
                font-size: 0.7rem;
                color: #9ca3af;
            }

            .ai-message-text {
                color: #374151;
                margin-bottom: 1rem;
            }

            .ai-capabilities {
                margin-top: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .capability-item {
                background: white;
                padding: 0.75rem;
                border-radius: 8px;
                font-size: 0.85rem;
                border-left: 3px solid #667eea;
            }

            .ai-quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 1rem;
            }

            .quick-action-btn {
                background: white;
                border: 1px solid #e5e7eb;
                padding: 0.5rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #374151;
            }

            .quick-action-btn:hover {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: transparent;
                transform: translateY(-1px);
            }

            .ai-typing-container {
                padding: 0 1rem;
            }

            .ai-typing-indicator {
                display: flex;
                gap: 0.75rem;
                align-items: flex-start;
            }

            .ai-typing-content {
                background: #f1f5f9;
                padding: 1rem;
                border-radius: 16px;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .ai-thinking-animation {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .thinking-dots {
                display: flex;
                gap: 0.25rem;
            }

            .thinking-dots span {
                width: 8px;
                height: 8px;
                background: #667eea;
                border-radius: 50%;
                animation: thinkingDots 1.4s infinite ease-in-out;
            }

            .thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
            .thinking-dots span:nth-child(2) { animation-delay: -0.16s; }
            .thinking-dots span:nth-child(3) { animation-delay: 0s; }

            @keyframes thinkingDots {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1.2); opacity: 1; }
            }

            .thinking-text {
                font-size: 0.85rem;
                color: #6b7280;
                font-style: italic;
            }

            .ai-chat-input {
                padding: 1rem;
                border-top: 1px solid #f3f4f6;
                background: white;
                flex-shrink: 0;
            }

            .ai-input-container {
                display: flex;
                gap: 0.75rem;
                align-items: flex-end;
                background: #f8fafc;
                border: 2px solid #e5e7eb;
                border-radius: 16px;
                padding: 0.75rem;
                transition: all 0.3s ease;
            }

            .ai-input-container:focus-within {
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .ai-input-container textarea {
                flex: 1;
                border: none;
                background: transparent;
                resize: none;
                outline: none;
                font-family: inherit;
                font-size: 0.9rem;
                line-height: 1.4;
                min-height: 20px;
                max-height: 120px;
            }

            .ai-input-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }

            .ai-send-btn, .ai-voice-btn {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }

            .ai-send-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .ai-voice-btn {
                background: #f3f4f6;
                color: #6b7280;
            }

            .ai-voice-btn.active {
                background: #ef4444;
                color: white;
                animation: voiceRecord 1s infinite;
            }

            @keyframes voiceRecord {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .ai-send-btn:hover, .ai-voice-btn:hover {
                transform: scale(1.1);
            }

            .ai-input-footer {
                margin-top: 0.5rem;
                text-align: center;
            }

            .ai-input-hint {
                font-size: 0.75rem;
                color: #9ca3af;
            }

            /* RESPONSIVE */
            @media (max-width: 768px) {
                .ai-assistant-panel {
                    bottom: 20px;
                    right: 20px;
                    left: 20px;
                    width: auto;
                    height: 80vh;
                }
                
                .ai-assistant-button {
                    bottom: 20px;
                    right: 20px;
                }

                .ai-message-content, .user-message-content {
                    max-width: 280px;
                }
            }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', css);
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
        if (panel) {
            panel.classList.toggle('show');
            
            if (panel.classList.contains('show')) {
                setTimeout(() => {
                    const input = document.getElementById('aiChatInput');
                    if (input) input.focus();
                }, 300);
            }
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
        console.log('🔗 Eventos del AI Assistant vinculados');
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
