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
        
        // ANÁLISIS FINANCIERO INTELIGENTE
        if (this.containsKeywords(message, ['flujo', 'caja', 'liquidez', 'dinero', 'efectivo'])) {
            response = this.generateCashFlowAnalysis(message);
        }
        // ESTRATEGIA EMPRESARIAL
        else if (this.containsKeywords(message, ['crecer', 'expandir', 'estrategia', 'competencia', 'mercado'])) {
            response = this.generateBusinessStrategy(message);
        }
        // ANÁLISIS DE COSTOS
        else if (this.containsKeywords(message, ['costos', 'gastos', 'reducir', 'ahorrar', 'eficiencia'])) {
            response = this.generateCostAnalysis(message);
        }
        // TRIBUTARIO PERUANO
        else if (this.containsKeywords(message, ['tribut', 'impuesto', 'sunat', 'igv', 'renta', 'legal'])) {
            response = this.generateTaxGuidance(message);
        }
        // MARKETING Y VENTAS
        else if (this.containsKeywords(message, ['ventas', 'marketing', 'cliente', 'promocion', 'publicidad'])) {
            response = this.generateMarketingAdvice(message);
        }
        // ANÁLISIS DE RATIOS
        else if (this.containsKeywords(message, ['ratio', 'indicador', 'kpi', 'rentabilidad', 'solvencia'])) {
            response = this.generateRatioAnalysis(message);
        }
        // RECURSOS HUMANOS
        else if (this.containsKeywords(message, ['empleado', 'personal', 'planilla', 'rrhh', 'contrato'])) {
            response = this.generateHRAdvice(message);
        }
        // OPERACIONES
        else if (this.containsKeywords(message, ['proceso', 'operacion', 'produccion', 'inventario', 'logistica'])) {
            response = this.generateOperationalAdvice(message);
        }
        // RESPUESTA GENERAL INTELIGENTE
        else {
            response = this.generateContextualResponse(message);
        }
        
        // Agregar recomendaciones personalizadas
        response += this.addPersonalizedRecommendations();
        
        return response;
    }
        
generateCashFlowAnalysis(message) {
        const companyData = this.getCurrentCompanyData();
        const cashFlow = companyData?.cashFlow || 24500;
        const revenue = companyData?.revenue || 45200;
        const expenses = companyData?.expenses || 28700;
        
        const cashFlowRatio = (cashFlow / expenses * 100).toFixed(1);
        const operatingMargin = ((revenue - expenses) / revenue * 100).toFixed(1);
        
        return `💧 **ANÁLISIS INTELIGENTE DE FLUJO DE CAJA**

**📊 SITUACIÓN ACTUAL:**
• Flujo de caja disponible: **S/. ${cashFlow.toLocaleString()}**
• Cobertura de gastos: **${cashFlowRatio}%** (${cashFlowRatio > 85 ? 'Excelente' : cashFlowRatio > 60 ? 'Bueno' : 'Necesita atención'})
• Margen operativo: **${operatingMargin}%**

**🎯 DIAGNÓSTICO INTELIGENTE:**
${cashFlow > 30000 ? 
    `✅ **Situación sólida**: Tu flujo de caja es saludable. Tienes capacidad para:
    • Inversiones estratégicas (hasta S/. ${Math.floor(cashFlow * 0.4).toLocaleString()})
    • Reserva de emergencia (${Math.floor(cashFlow * 0.3).toLocaleString()})
    • Expansión operativa` :
    `⚠️ **Situación de atención**: Tu flujo requiere optimización:
    • Acelerar cobranzas (reducir días de cobro)
    • Negociar mejores términos de pago con proveedores
    • Revisar gastos no esenciales`}

**🚀 RECOMENDACIONES ESPECÍFICAS:**

1. **OPTIMIZACIÓN INMEDIATA (0-30 días):**
   • Implementa política de cobro más agresiva
   • Negocia descuentos por pronto pago con clientes
   • Revisa contratos de servicios recurrentes

2. **ESTRATEGIAS MEDIANO PLAZO (1-3 meses):**
   • Diversifica fuentes de ingresos
   • Implementa sistema de facturación automática
   • Establece línea de crédito como respaldo

3. **PROYECCIÓN INTELIGENTE:**
   • Meta próximo trimestre: S/. ${Math.floor(cashFlow * 1.25).toLocaleString()}
   • ROI esperado con optimizaciones: 15-25%

¿Te gustaría que profundice en alguna estrategia específica?`;
    }

    generateBusinessStrategy(message) {
        const companyName = this.getCurrentCompanyName();
        const industry = this.detectIndustry(companyName);
        
        return `🚀 **ESTRATEGIA DE CRECIMIENTO INTELIGENTE**

**🎯 ANÁLISIS PARA ${companyName.toUpperCase()}**
Sector identificado: **${industry}**

**📈 ESTRATEGIAS DE CRECIMIENTO RECOMENDADAS:**

**1. EXPANSIÓN ORGÁNICA (Riesgo: Bajo)**
   • Ampliar productos/servicios complementarios
   • Penetrar nuevos segmentos de mercado
   • Mejorar propuesta de valor actual
   • *Inversión estimada: S/. 15,000 - 40,000*

**2. EXPANSIÓN GEOGRÁFICA (Riesgo: Medio)**
   • Lima metropolitana (si estás en provincia)
   • Ciudades principales: Arequipa, Trujillo, Chiclayo
   • Modelo de franquicias o distribuidores
   • *ROI esperado: 18-35% anual*

**3. TRANSFORMACIÓN DIGITAL (Riesgo: Bajo)**
   • Presencia online profesional
   • E-commerce / ventas digitales
   • Automatización de procesos
   • *Retorno: 6-12 meses*

**🔍 ANÁLISIS COMPETITIVO:**
• **Ventaja competitiva clave**: ${this.getCompetitiveAdvantage(industry)}
• **Oportunidad principal**: ${this.getMainOpportunity(industry)}
• **Amenaza a monitorear**: ${this.getMainThreat(industry)}

**💡 PLAN DE ACCIÓN INTELIGENTE (90 días):**

**MES 1: FUNDACIÓN**
• Análisis profundo de mercado objetivo
• Validación de propuesta de valor
• Estructura financiera para crecimiento

**MES 2: IMPLEMENTACIÓN**
• Lanzamiento de iniciativas piloto
• Desarrollo de canales de distribución
• Capacitación del equipo

**MES 3: ESCALAMIENTO**
• Medición de resultados y ajustes
• Expansión basada en aprendizajes
• Preparación para siguiente fase

**📊 MÉTRICAS CLAVE A MONITOREAR:**
• CAC (Costo de Adquisición de Cliente)
• LTV (Valor de Vida del Cliente)
• Tasa de conversión
• Margen de contribución

¿Quieres que desarrolle alguna estrategia específica en detalle?`;
    }

    generateCostAnalysis(message) {
        const companyData = this.getCurrentCompanyData();
        const expenses = companyData?.expenses || 28700;
        const revenue = companyData?.revenue || 45200;
        const expenseRatio = (expenses / revenue * 100).toFixed(1);
        
        return `💰 **ANÁLISIS INTELIGENTE DE COSTOS**

**📊 DIAGNÓSTICO ACTUAL:**
• Gastos totales: **S/. ${expenses.toLocaleString()}**
• Ratio gastos/ingresos: **${expenseRatio}%**
• Eficiencia: ${expenseRatio < 60 ? '🟢 Excelente' : expenseRatio < 75 ? '🟡 Buena' : '🔴 Necesita mejora'}

**🎯 OPORTUNIDADES DE AHORRO IDENTIFICADAS:**

**1. GASTOS OPERATIVOS (Ahorro potencial: 8-15%)**
   • **Servicios públicos**: Auditoría energética (ahorro: S/. 200-500/mes)
   • **Telefonía/Internet**: Renegociar contratos (ahorro: S/. 150-300/mes)
   • **Seguros**: Comparar proveedores (ahorro: S/. 100-400/mes)

**2. GASTOS ADMINISTRATIVOS (Ahorro potencial: 10-20%)**
   • **Suministros de oficina**: Compras al por mayor (ahorro: 15%)
   • **Software**: Migrar a soluciones cloud (ahorro: S/. 300-800/mes)
   • **Contabilidad**: Automatizar procesos básicos

**3. GASTOS DE PERSONAL (Optimización: 5-12%)**
   • **Productividad**: Capacitación especializada
   • **Estructura**: Evaluar outsourcing de funciones no core
   • **Beneficios**: Optimizar paquete de compensaciones

**🔍 ANÁLISIS DETALLADO POR CATEGORÍA:**

**GASTOS FIJOS (70% del total)**
• Alquiler: ${(expenses * 0.25).toLocaleString()} 
• Personal: ${(expenses * 0.35).toLocaleString()}
• Servicios: ${(expenses * 0.10).toLocaleString()}

**GASTOS VARIABLES (30% del total)**
• Materiales: ${(expenses * 0.20).toLocaleString()}
• Marketing: ${(expenses * 0.07).toLocaleString()}
• Otros: ${(expenses * 0.03).toLocaleString()}

**💡 PLAN DE REDUCCIÓN INTELIGENTE:**

**FASE 1 (Mes 1): GANANCIAS RÁPIDAS**
• Renegociar 3 contratos principales
• Implementar medidas de ahorro energético
• Optimizar inventarios
• *Ahorro esperado: S/. ${Math.floor(expenses * 0.05).toLocaleString()}*

**FASE 2 (Mes 2-3): OPTIMIZACIÓN ESTRUCTURAL**
• Automatizar procesos manuales
• Revisar estructura organizacional
• Implementar KPIs de eficiencia
• *Ahorro esperado: S/. ${Math.floor(expenses * 0.08).toLocaleString()}*

**FASE 3 (Mes 4-6): TRANSFORMACIÓN**
• Digitalizar operaciones clave
• Establecer acuerdos estratégicos
• Implementar mejora continua
• *Ahorro esperado: S/. ${Math.floor(expenses * 0.12).toLocaleString()}*

**🎯 RESULTADO PROYECTADO:**
• **Ahorro total anual**: S/. ${Math.floor(expenses * 0.15).toLocaleString()}
• **ROI de la optimización**: 300-500%
• **Tiempo de recuperación**: 2-4 meses

⚠️ **IMPORTANTE**: Mantener calidad del servicio/producto durante la optimización.

¿Quieres que detalle alguna estrategia específica de ahorro?`;
    }

    generateTaxGuidance(message) {
        return `⚖️ **GUÍA TRIBUTARIA INTELIGENTE PARA PERÚ**

**📋 OBLIGACIONES PRINCIPALES:**

**🏢 SEGÚN TU TIPO DE EMPRESA:**
• **Régimen MYPE Tributario**: Hasta 1,700 UIT ventas anuales
• **Régimen General**: Sin límites, impuesto a la renta 29.5%
• **Régimen Especial**: Hasta 525 UIT, 1.5% de ingresos netos

**📅 CALENDARIO TRIBUTARIO 2025:**

**MENSUAL:**
• **IGV**: 18% sobre valor agregado
• **Retenciones**: 4ta y 5ta categoría
• **ESSALUD**: 9% sobre planilla
• **Fecha límite**: Según último dígito del RUC

**ANUAL:**
• **Renta Anual**: Hasta 31 marzo 2026
• **ITAN**: Impuesto Temporal a los Activos Netos
• **Gratificaciones**: Julio y diciembre + 9% ESSALUD

**💡 ESTRATEGIAS DE OPTIMIZACIÓN TRIBUTARIA:**

**1. GASTOS DEDUCIBLES CLAVE:**
   • Gastos necesarios para generar renta
   • Depreciación de activos fijos
   • Provisiones para cobranza dudosa
   • Capacitación del personal

**2. BENEFICIOS TRIBUTARIOS:**
   • **Ley MYPE**: Depreciación acelerada
   • **I+D**: Deducción del 175%
   • **Amazonía**: Exoneración del 0% a 10%
   • **Zona Alto Andino**: Reducción del 40%

**3. PLANIFICACIÓN FISCAL:**
   • Distribución temporal de ingresos
   • Aprovechamiento de pérdidas tributarias
   • Estructura de financiamiento óptima

**🚨 RIESGOS A EVITAR:**

**INFRACCIONES COMUNES:**
• **No llevar libros contables**: Multa desde 0.6% UIT
• **Atraso en declaraciones**: 50% del tributo omitido
• **Emisión incorrecta de comprobantes**: Multa desde 50% del valor

**FISCALIZACIÓN SUNAT:**
• **Sectores de riesgo**: Construcción, servicios, comercio
• **Indicios de omisión**: Ratios anómalos, gastos personales
• **Documentación clave**: Mantener sustento de operaciones

**🔍 ANÁLISIS DE TU SITUACIÓN:**

**RECOMENDACIONES ESPECÍFICAS:**
• Implementar sistema contable robusto
• Revisar contratos con proveedores para optimizar IGV
• Evaluar cambio de régimen tributario si conviene
• Establecer políticas de gastos claras

**📊 PROYECCIÓN TRIBUTARIA ANUAL:**
• **IGV estimado**: S/. ${Math.floor(45200 * 0.18).toLocaleString()}
• **Renta estimada**: S/. ${Math.floor(16500 * 0.295).toLocaleString()}
• **Total carga tributaria**: S/. ${Math.floor((45200 * 0.18) + (16500 * 0.295)).toLocaleString()}

**🎯 PLAN DE CUMPLIMIENTO:**
• Calendario automatizado de obligaciones
• Revisión mensual de ratios tributarios
• Asesoría preventiva vs. correctiva
• Backup digital de documentación

¿Necesitas ayuda con algún aspecto tributario específico?`;
    }

    generateMarketingAdvice(message) {
        const companyName = this.getCurrentCompanyName();
        
        return `🎯 **ESTRATEGIA DE MARKETING INTELIGENTE**

**📊 ANÁLISIS PARA ${companyName.toUpperCase()}**

**🚀 MARKETING DIGITAL (ROI: 300-800%)**

**1. PRESENCIA ONLINE BÁSICA:**
   • **Google My Business**: Gratis, impacto inmediato
   • **Página web profesional**: S/. 1,500-3,000
   • **SEO local**: Aparecer en búsquedas relevantes
   • *Tiempo de implementación: 2-4 semanas*

**2. REDES SOCIALES ESTRATÉGICAS:**
   • **LinkedIn**: B2B, networking profesional
   • **Facebook**: Alcance local masivo
   • **Instagram**: Visual, productos/servicios
   • **WhatsApp Business**: Atención al cliente
   • *Inversión mensual: S/. 500-1,200*

**3. PUBLICIDAD DIGITAL:**
   • **Google Ads**: Palabras clave específicas
   • **Facebook Ads**: Segmentación demográfica
   • **YouTube**: Video marketing
   • *ROI esperado: 400-600%*

**📺 MARKETING TRADICIONAL (ROI: 150-300%)**

**1. MARKETING LOCAL:**
   • **Radio local**: Horarios estratégicos
   • **Periódicos locales**: Sección de negocios
   • **Volantes dirigidos**: Zonas específicas
   • **Ferias empresariales**: Networking directo

**2. MARKETING REFERENCIAL:**
   • **Programa de referidos**: 10-15% comisión
   • **Testimonios**: Videos de clientes satisfechos
   • **Casos de éxito**: Portfolio detallado
   • **Network profesional**: Cámaras de comercio

**🎨 ESTRATEGIA DE CONTENIDO:**

**CONTENIDO QUE CONVIERTE:**
• **Educativo**: Tips de tu industria (80%)
• **Promocional**: Ofertas y servicios (15%)
• **Personal**: Historia de la empresa (5%)

**CALENDARIO EDITORIAL:**
• **Lunes**: Tip educativo
• **Miércoles**: Caso de éxito
• **Viernes**: Promoción especial
• **Domingo**: Contenido inspiracional

**💰 PRESUPUESTO INTELIGENTE (Mensual):**

**BÁSICO (S/. 800-1,200):**
• Redes sociales: S/. 400
• Google Ads: S/. 300
• Contenido: S/. 200
• Herramientas: S/. 100-300

**INTERMEDIO (S/. 1,500-2,500):**
• Todo lo básico +
• Video marketing: S/. 500
• Email marketing: S/. 200
• Diseño gráfico: S/. 300

**AVANZADO (S/. 3,000-5,000):**
• Todo lo intermedio +
• Influencer marketing: S/. 1,000
• Marketing automation: S/. 500
• Publicidad tradicional: S/. 1,000

**📈 MÉTRICAS CLAVE:**

**MÉTRICAS DE VANIDAD (NO priorizar):**
• Likes, followers, impresiones

**MÉTRICAS QUE IMPORTAN:**
• **CAC**: Costo de adquisición de cliente
• **ROAS**: Retorno de inversión publicitaria
• **Conversion Rate**: Tasa de conversión
• **LTV**: Valor de vida del cliente

**🎯 PLAN DE ACCIÓN 90 DÍAS:**

**MES 1: FUNDACIÓN**
• Optimizar Google My Business
• Crear contenido base (20 posts)
• Lanzar campañas Google Ads básicas
• *Meta: 50 leads nuevos*

**MES 2: AMPLIFICACIÓN**
• Activar Facebook/Instagram Ads
• Implementar email marketing
• Crear video testimonios
• *Meta: 100 leads nuevos*

**MES 3: OPTIMIZACIÓN**
• Analizar métricas y optimizar
• Escalar campañas exitosas
• Desarrollar marketing automation
• *Meta: 150 leads nuevos*

**🚨 ERRORES A EVITAR:**
• Querer estar en todas las plataformas
• No medir resultados
• Contenido puramente promocional
• No definir buyer persona

¿Quieres que detalle alguna estrategia específica?`;
    }

    generateRatioAnalysis(message) {
        const companyData = this.getCurrentCompanyData();
        const revenue = companyData?.revenue || 45200;
        const expenses = companyData?.expenses || 28700;
        const profit = companyData?.profit || 16500;
        const cashFlow = companyData?.cashFlow || 24500;
        
        // Ratios calculados
        const profitMargin = (profit / revenue * 100).toFixed(1);
        const expenseRatio = (expenses / revenue * 100).toFixed(1);
        const cashRatio = (cashFlow / expenses * 100).toFixed(1);
        const efficiency = (profit / expenses * 100).toFixed(1);
        
        return `📊 **ANÁLISIS INTELIGENTE DE RATIOS FINANCIEROS**

**🎯 RATIOS PRINCIPALES CALCULADOS:**

**📈 RENTABILIDAD:**
• **Margen Neto**: ${profitMargin}% ${profitMargin > 15 ? '🟢 Excelente' : profitMargin > 8 ? '🟡 Bueno' : '🔴 Bajo'}
• **ROA simulado**: ${(profit / (revenue * 1.5) * 100).toFixed(1)}%
• **Eficiencia Operativa**: ${efficiency}% ${efficiency > 50 ? '🟢' : efficiency > 30 ? '🟡' : '🔴'}

**💧 LIQUIDEZ:**
• **Ratio de Efectivo**: ${cashRatio}% ${cashRatio > 80 ? '🟢 Excelente' : cashRatio > 50 ? '🟡 Adecuado' : '🔴 Crítico'}
• **Cobertura de Gastos**: ${(cashFlow / (expenses/12)).toFixed(1)} meses

**⚖️ EFICIENCIA:**
• **Ratio Gastos/Ingresos**: ${expenseRatio}% ${expenseRatio < 60 ? '🟢' : expenseRatio < 75 ? '🟡' : '🔴'}
• **Productividad**: S/. ${(revenue / 100).toFixed(0)} por S/. 100 invertidos

**🔍 ANÁLISIS COMPARATIVO POR SECTOR:**

**TU EMPRESA vs. SECTOR:**
• Margen Neto: ${profitMargin}% vs. 12% (sector) ${profitMargin > 12 ? '👆 Superior' : '👇 Inferior'}
• Ratio de Gastos: ${expenseRatio}% vs. 68% (sector) ${expenseRatio < 68 ? '👆 Mejor' : '👇 Peor'}
• Eficiencia: ${efficiency}% vs. 45% (sector) ${efficiency > 45 ? '👆 Superior' : '👇 Inferior'}

**📋 INTERPRETACIÓN INTELIGENTE:**

${profitMargin > 15 ? 
    `✅ **FORTALEZAS IDENTIFICADAS:**
    • Excelente control de costos
    • Margen superior al mercado
    • Modelo de negocio eficiente
    • Potencial para reinversión` :
    `⚠️ **ÁREAS DE MEJORA:**
    • Optimizar estructura de costos
    • Revisar estrategia de precios
    • Mejorar eficiencia operativa
    • Buscar economías de escala`}

**🎯 RATIOS OBJETIVO (Siguientes 12 meses):**

**METAS REALISTAS:**
• **Margen Neto**: ${Math.min(profitMargin * 1.2, 25).toFixed(1)}%
• **Eficiencia Operativa**: ${Math.min(efficiency * 1.15, 80).toFixed(1)}%
• **Ratio de Liquidez**: ${Math.min(cashRatio * 1.1, 120).toFixed(1)}%

**PLAN DE MEJORA:**

**CORTO PLAZO (1-3 meses):**
• Renegociar contratos principales
• Optimizar procesos operativos
• Implementar control de gastos
• *Meta: Mejorar margen 2-3%*

**MEDIANO PLAZO (3-6 meses):**
• Automatizar procesos clave
• Diversificar fuentes de ingreso
• Optimizar estructura organizacional
• *Meta: Mejorar eficiencia 10-15%*

**LARGO PLAZO (6-12 meses):**
• Invertir en tecnología
• Expandir operaciones
• Desarrollar nuevos productos
• *Meta: Alcanzar ratios objetivo*

**🚨 ALERTAS Y MONITOREO:**

**INDICADORES DE ALERTA:**
• Margen < 8%: Revisar modelo de negocio
• Liquidez < 2 meses: Acelerar cobranzas
• Gastos > 80%: Reestructuración urgente

**FRECUENCIA DE MONITOREO:**
• **Semanal**: Flujo de caja
• **Mensual**: Márgenes y gastos
• **Trimestral**: Ratios completos
• **Anual**: Benchmarking sectorial

**📊 HERRAMIENTAS RECOMENDADAS:**
• Dashboard financiero automatizado
• Alertas automáticas de ratios
• Comparativas históricas
• Proyecciones inteligentes

¿Quieres que profundice en algún ratio específico o desarrolle un plan de mejora detallado?`;
    }

    generateHRAdvice(message) {
        return `👥 **CONSULTORÍA DE RECURSOS HUMANOS INTELIGENTE**

**📋 MARCO LEGAL PERUANO ACTUALIZADO:**

**🔒 OBLIGACIONES LABORALES BÁSICAS:**

**CONTRATOS Y MODALIDADES:**
• **Indefinido**: Máxima estabilidad, difícil terminación
• **Sujeto a modalidad**: 5 años máximo, causas específicas
• **Part-time**: Mínimo 4 horas, proporcional a beneficios
• **Locación de servicios**: Sin vínculo laboral

**💰 BENEFICIOS OBLIGATORIOS:**

**MENSUAL:**
• **Remuneración mínima**: S/. 1,025 (2025)
• **ESSALUD**: 9% sobre bruto (empleador)
• **AFP/ONP**: 10-13% sobre bruto (empleado)

**SEMESTRAL:**
• **Gratificaciones**: Julio y diciembre (1 sueldo + 9% ESSALUD)
• **CTS**: Mayo y noviembre (1/2 sueldo anual)

**ANUAL:**
• **Vacaciones**: 30 días calendario
• **Utilidades**: 10% para empresas con 20+ trabajadores

**🎯 ESTRATEGIAS DE GESTIÓN HUMANA:**

**1. OPTIMIZACIÓN DE PLANILLA:**
   • **Estructura mixta**: 70% planilla + 30% servicios
   • **Tercerización**: Funciones no core (limpieza, seguridad)
   • **Freelancers**: Proyectos específicos
   • *Ahorro potencial: 20-35%*

**2. PRODUCTIVIDAD Y RETENCIÓN:**
   • **Capacitación continua**: 2% de planilla anual
   • **Incentivos por metas**: 5-15% adicional
   • **Trabajo híbrido**: Reducir costos operativos
   • *ROI: 300-500%*

**3. CLIMA LABORAL:**
   • **Evaluaciones 360°**: Feedback constructivo
   • **Reconocimientos**: Programa mensual
   • **Team building**: Actividades trimestrales
   • *Impacto: +25% productividad*

**📊 COSTOS REALES POR EMPLEADO:**

**EMPLEADO PROMEDIO (S/. 2,500 bruto):**
• Sueldo bruto: S/. 2,500
• ESSALUD (9%): S/. 225
• Gratificaciones: S/. 208
• CTS: S/. 208
• Vacaciones: S/. 208
• **TOTAL REAL**: S/. 3,349/mes

**🔍 ANÁLISIS DE TU ESTRUCTURA:**

**RECOMENDACIONES ESPECÍFICAS:**
• **Tamaño óptimo actual**: 3-5 empleados clave
• **Estructura sugerida**: 1 administrativo + 2-4 operativos
• **Modalidades recomendadas**: 60% indefinido + 40% modal/servicios

**⚖️ CUMPLIMIENTO LEGAL:**

**REGISTROS OBLIGATORIOS:**
• **T-REGISTRO**: Altas y bajas en línea
• **PLAME**: Planilla electrónica mensual
• **Libro de planillas**: Físico o digital

**DOCUMENTOS CLAVE:**
• Contratos firmados y registrados
• Expedientes personales completos
• Políticas internas escritas
• Reglamento interno de trabajo

**🚨 RIESGOS LABORALES:**

**INFRACCIONES FRECUENTES:**
• **Trabajo no registrado**: Multa 0.45-1.35 UIT x trabajador
• **Falta de contratos**: Multa 0.14-0.35 UIT x trabajador
• **CTS impaga**: Multa + intereses legales

**FISCALIZACIÓN SUNAFIL:**
• **Indicadores de riesgo**: Denuncias, accidentes, quejas
• **Documentación crítica**: Contratos, planillas, pagos
• **Sanciones**: Desde amonestación hasta cierre temporal

**🎯 PLAN DE ACCIÓN RRHH:**

**INMEDIATO (1-2 semanas):**
• Auditoría de cumplimiento legal
• Actualización de contratos
• Registro correcto en T-REGISTRO
• *Inversión: S/. 500-1,000*

**CORTO PLAZO (1-3 meses):**
• Implementar políticas internas
• Capacitación en normativa laboral
• Sistema de evaluación de desempeño
• *Inversión: S/. 1,500-3,000*

**MEDIANO PLAZO (3-6 meses):**
• Programa de desarrollo de talentos
• Optimización de estructura organizacional
• Implementación de beneficios adicionales
• *ROI esperado: 200-400%*

**💡 CONSEJOS INTELIGENTES:**

**CONTRATACIÓN EFICIENTE:**
• Período de prueba: 3 meses máximo
• Referencias laborales verificadas
• Evaluaciones psicotécnicas básicas
• Contratos claros y específicos

**GESTIÓN DEL DESEMPEÑO:**
• Objetivos SMART (específicos, medibles)
• Feedback mensual formal
• Plan de desarrollo individual
• Reconocimiento público de logros

¿Necesitas ayuda con algún aspecto específico de RRHH?`;
    }

    generateOperationalAdvice(message) {
        return `⚙️ **CONSULTORÍA OPERACIONAL INTELIGENTE**

**🎯 DIAGNÓSTICO DE PROCESOS ACTUALES:**

**📊 EFICIENCIA OPERATIVA:**

**PROCESOS CLAVE IDENTIFICADOS:**
• **Adquisiciones**: Compra → Recepción → Pago
• **Producción/Servicio**: Planificación → Ejecución → Control
• **Ventas**: Prospección → Cotización → Cierre → Entrega
• **Finanzas**: Facturación → Cobranza → Conciliación

**⏱️ ANÁLISIS DE TIEMPOS:**

**TIEMPOS ACTUALES vs. ÓPTIMOS:**
• **Proceso de compras**: 5-7 días → **Óptimo**: 2-3 días
• **Tiempo de entrega**: 3-5 días → **Óptimo**: 1-2 días
• **Ciclo de cobranza**: 45 días → **Óptimo**: 30 días
• **Procesamiento de pedidos**: 24 horas → **Óptimo**: 4 horas

**🚀 ESTRATEGIAS DE OPTIMIZACIÓN:**

**1. AUTOMATIZACIÓN INTELIGENTE:**
   • **CRM básico**: Gestión de clientes y ventas
   • **ERP simple**: Integración de procesos
   • **Facturación electrónica**: Cumplimiento y eficiencia
   • **Inventarios**: Control automático de stock
   • *ROI: 300-600%*

**2. LEAN OPERATIONS:**
   • **Eliminación de desperdicios**: 7 tipos de waste
   • **5S**: Organización del espacio de trabajo
   • **Kaizen**: Mejora continua
   • **Just in Time**: Inventario mínimo
   • *Reducción costos: 15-25%*

**3. DIGITALIZACIÓN:**
   • **Documentos digitales**: Reducir papel 80%
   • **Comunicación interna**: WhatsApp Business, Slack
   • **Reportes automáticos**: Dashboards en tiempo real
   • **Backup en la nube**: Seguridad de información

**📋 GESTIÓN DE INVENTARIOS:**

**ESTRATEGIA ABC:**
• **Clase A (80/20)**: Productos de alto valor - Control estricto
• **Clase B (15/30)**: Productos medios - Control moderado  
• **Clase C (5/50)**: Productos bajo valor - Control básico

**INDICADORES CLAVE:**
• **Rotación de inventario**: 6-12 veces/año (óptimo)
• **Nivel de servicio**: 95%+ disponibilidad
• **Costo de mantener**: 15-25% del valor del inventario
• **Stock de seguridad**: 10-15 días de venta

**🔧 MEJORA DE PROCESOS:**

**METODOLOGÍA DMAIC:**

**1. DEFINIR** (Semana 1-2):
• Mapear procesos actuales
• Identificar puntos de dolor
• Establecer métricas baseline
• Definir objetivos SMART

**2. MEDIR** (Semana 3-4):
• Tiempo de ciclo por proceso
• Tasa de errores/reprocesos
• Satisfacción del cliente
• Costos operativos por unidad

**3. ANALIZAR** (Semana 5-6):
• Identificar causas raíz
• Análisis de valor agregado
• Cuellos de botella principales
• Oportunidades de mejora

**4. IMPLEMENTAR** (Semana 7-10):
• Soluciones piloto
• Capacitación del equipo
• Nuevos procedimientos
• Sistemas de monitoreo

**5. CONTROLAR** (Semana 11-12):
• Métricas de seguimiento
• Procedimientos estándar
• Mejora continua
• Sostenibilidad del cambio

**💡 TECNOLOGÍA OPERATIVA:**

**HERRAMIENTAS ESENCIALES:**
• **WhatsApp Business API**: Comunicación con clientes
• **Google Workspace**: Colaboración y documentos
• **Trello/Asana**: Gestión de proyectos y tareas
• **QuickBooks**: Contabilidad integrada
• *Inversión mensual: S/. 200-500*

**AUTOMATIZACIONES CLAVE:**
• **Recordatorios de pago**: WhatsApp/Email automático
• **Reabastecimiento**: Alertas por stock mínimo
• **Reportes diarios**: Dashboard automático
• **Seguimiento de pedidos**: Notificaciones automáticas

**📊 INDICADORES DE PERFORMANCE (KPIs):**

**OPERACIONALES:**
• **OEE** (Overall Equipment Effectiveness): >85%
• **Tiempo de ciclo**: Reducción 20-40%
• **Primera vez bien**: >95%
• **Utilización de capacidad**: 75-85%

**FINANCIEROS:**
• **Costo por unidad**: Reducción 10-20%
• **Productividad por empleado**: Aumento 15-25%
• **Margen operativo**: Mejora 3-5%
• **ROI de mejoras**: >200%

**🎯 PLAN DE IMPLEMENTACIÓN 90 DÍAS:**

**MES 1: DIAGNÓSTICO Y PLANIFICACIÓN**
Semana 1-2: Mapeo de procesos actuales
Semana 3-4: Identificación de oportunidades de mejora
*Entregable: Plan de optimización detallado*

**MES 2: IMPLEMENTACIÓN PILOTO**
Semana 5-6: Implementar 2-3 mejoras de alto impacto
Semana 7-8: Capacitación del equipo y ajustes
*Meta: 20% mejora en proceso piloto*

**MES 3: ESCALAMIENTO Y CONTROL**
Semana 9-10: Expandir mejoras a todos los procesos
Semana 11-12: Establecer controles y métricas
*Meta: 15% mejora general en eficiencia*

**🚨 RIESGOS OPERACIONALES:**

**PRINCIPALES AMENAZAS:**
• **Dependencia de personas clave**: 60% de conocimiento en 1-2 personas
• **Falta de respaldos**: Sistemas críticos sin backup
• **Procesos manuales**: 80%+ de actividades sin automatizar
• **Comunicación deficiente**: Información fragmentada

**ESTRATEGIAS DE MITIGACIÓN:**
• **Documentación de procesos**: Procedimientos estándar escritos
• **Cross-training**: Capacitación cruzada del equipo
• **Sistemas redundantes**: Backup de información crítica
• **Comunicación estructurada**: Reuniones y reportes regulares

**💰 ANÁLISIS COSTO-BENEFICIO:**

**INVERSIÓN REQUERIDA:**
• **Tecnología básica**: S/. 3,000-5,000
• **Capacitación**: S/. 1,500-2,500
• **Consultoría**: S/. 2,000-4,000
• **Total**: S/. 6,500-11,500

**RETORNO ESPERADO (Anual):**
• **Reducción de costos**: S/. 15,000-25,000
• **Aumento de ingresos**: S/. 20,000-35,000
• **Ahorro de tiempo**: 200-400 horas/año
• **ROI total**: 300-500%

**🔍 BENCHMARKING SECTORIAL:**

**TU SECTOR vs. MEJORES PRÁCTICAS:**
• Tiempo de entrega: Tuyo vs. Líder del sector
• Costo operativo: Tuyo vs. Promedio del mercado
• Satisfacción del cliente: Tuyo vs. Benchmark
• Productividad: Tuyo vs. Empresas similares

**🎯 SIGUIENTE NIVEL:**

**OBJETIVOS A 6 MESES:**
• Reducir tiempos de proceso en 30%
• Aumentar productividad en 25%
• Mejorar satisfacción del cliente a 90%+
• Reducir costos operativos en 20%

**OBJETIVOS A 1 AÑO:**
• Implementar sistema ERP completo
• Lograr certificación de calidad (ISO 9001)
• Expandir capacidad operativa 50%
• Convertirse en benchmark del sector

¿Te gustaría que profundice en algún proceso específico o desarrolle un plan de implementación detallado?`;

    }

    generateContextualResponse(message) {
        const responses = [
            `🤔 **Análisis de tu consulta: "${message}"**

Como experto en gestión empresarial, veo que tu pregunta toca aspectos importantes del negocio. 

**💡 Mi recomendación:**
Para darte la respuesta más precisa y valiosa, necesito entender mejor tu contexto específico. 

**🎯 ¿Te refieres a:**
• **Análisis financiero** de tu situación actual
• **Estrategia de crecimiento** para tu empresa
• **Optimización de procesos** operativos
• **Cumplimiento legal** en Perú
• **Gestión de recursos humanos**

**📊 Información que me ayudaría:**
• Tamaño aproximado de tu empresa
• Sector de tu industria
• Principal desafío actual
• Objetivo que buscas lograr

Mientras tanto, aquí tienes algunas **recomendaciones generales**:

✅ **Mantén control financiero diario**
✅ **Invierte en tecnología básica** 
✅ **Capacita constantemente a tu equipo**
✅ **Mantén comunicación cercana con clientes**
✅ **Cumple todas las obligaciones legales**

¿Puedes ser más específico para darte una respuesta más detallada y accionable?`,

            `💡 **Interesante consulta sobre "${message}"**

Como tu asesor de IA especializado en empresas peruanas, puedo ayudarte con análisis más profundos.

**🚀 Áreas donde puedo aportar mayor valor:**

**📈 ANÁLISIS FINANCIERO:**
• Ratios e indicadores clave
• Proyecciones de flujo de caja
• Estrategias de financiamiento
• Optimización de costos

**⚖️ LEGAL Y TRIBUTARIO:**
• Obligaciones SUNAT actualizadas
• Estrategias de optimización fiscal
• Cumplimiento laboral
• Constitución de empresas

**🎯 ESTRATEGIA COMERCIAL:**
• Marketing digital efectivo
• Estrategias de crecimiento
• Análisis de competencia
• Desarrollo de productos/servicios

**⚙️ OPTIMIZACIÓN OPERATIVA:**
• Mejora de procesos
• Automatización inteligente
• Gestión de inventarios
• Control de calidad

**💼 GESTIÓN EMPRESARIAL:**
• Liderazgo y gestión de equipos
• Cultura organizacional
• Planificación estratégica
• Innovación y transformación digital

**🎯 Para darte la mejor respuesta:**
Reformula tu pregunta incluyendo:
• Tu situación específica
• El resultado que buscas
• Tu industria o sector
• El plazo que manejas

¡Estoy aquí para convertir tu consulta en un plan de acción concreto y rentable!`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    addPersonalizedRecommendations() {
        const companyData = this.getCurrentCompanyData();
        const recommendations = [];

        // Recomendaciones basadas en flujo de caja
        if (companyData?.cashFlow < 20000) {
            recommendations.push("💡 **Prioridad**: Mejorar flujo de caja - considera factoring o línea de crédito");
        }

        // Recomendaciones basadas en margen
        const margin = ((companyData?.profit || 0) / (companyData?.revenue || 1) * 100);
        if (margin < 10) {
            recommendations.push("⚠️ **Alerta**: Margen bajo - revisa estrategia de precios y costos");
        }

        // Recomendaciones generales
        recommendations.push("📈 **Tip del día**: Revisa tus métricas semanalmente para tomar decisiones informadas");

        return recommendations.length > 0 ? 
            `\n\n**🎯 RECOMENDACIONES PERSONALIZADAS:**\n${recommendations.join('\n')}` : '';
    }

    // ======= UTILIDADES =======
    
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    analyzeContext(message) {
        return {
            intent: this.detectIntent(message),
            urgency: this.detectUrgency(message),
            complexity: this.detectComplexity(message),
            industry: this.detectIndustry(message)
        };
    }

    detectIntent(message) {
        if (this.containsKeywords(message, ['como', 'que', 'cual', 'cuando'])) return 'question';
        if (this.containsKeywords(message, ['ayuda', 'problema', 'error', 'falla'])) return 'help';
        if (this.containsKeywords(message, ['quiero', 'necesito', 'busco'])) return 'need';
        return 'general';
    }

    detectUrgency(message) {
        if (this.containsKeywords(message, ['urgente', 'rapido', 'inmediato', 'ya'])) return 'high';
        if (this.containsKeywords(message, ['pronto', 'esta semana', 'este mes'])) return 'medium';
        return 'low';
    }

    detectComplexity(message) {
        const complexWords = ['estrategia', 'analisis', 'implementar', 'optimizar', 'integrar'];
        const complexity = complexWords.filter(word => message.includes(word)).length;
        return complexity > 2 ? 'high' : complexity > 0 ? 'medium' : 'low';
    }

    detectIndustry(text) {
        const industries = {
            'fundicion': 'Metalurgia y Fundición',
            'avicola': 'Sector Avícola',
            'bodega': 'Retail y Comercio',
            'importacion': 'Comercio Internacional',
            'construccion': 'Construcción',
            'textil': 'Industria Textil',
            'alimentos': 'Industria Alimentaria',
            'servicios': 'Sector Servicios'
        };

        for (const [key, industry] of Object.entries(industries)) {
            if (text.includes(key)) return industry;
        }
        return 'General';
    }

    getCurrentCompanyData() {
        if (window.companyManager) {
            return window.companyManager.getCurrentSelected();
        }
        return {
            cashFlow: 24500,
            revenue: 45200,
            expenses: 28700,
            profit: 16500
        };
    }

    getCurrentCompanyName() {
        if (window.companyManager) {
            const company = window.companyManager.getCurrentSelected();
            return company?.name || 'Tu Empresa';
        }
        return 'Tu Empresa';
    }

    getCompetitiveAdvantage(industry) {
        const advantages = {
            'Metalurgia y Fundición': 'Calidad técnica especializada',
            'Sector Avícola': 'Frescura y trazabilidad',
            'Retail y Comercio': 'Atención personalizada',
            'Comercio Internacional': 'Red de contactos globales',
            'General': 'Servicio personalizado y confiabilidad'
        };
        return advantages[industry] || advantages['General'];
    }

    getMainOpportunity(industry) {
        const opportunities = {
            'Metalurgia y Fundición': 'Expansión a sectores mineros',
            'Sector Avícola': 'Productos orgánicos premium',
            'Retail y Comercio': 'E-commerce y delivery',
            'Comercio Internacional': 'Nuevos mercados emergentes',
            'General': 'Transformación digital y automatización'
        };
        return opportunities[industry] || opportunities['General'];
    }

    getMainThreat(industry) {
        const threats = {
            'Metalurgia y Fundición': 'Competencia china de bajo costo',
            'Sector Avícola': 'Regulaciones sanitarias cambiantes',
            'Retail y Comercio': 'Grandes cadenas y marketplaces',
            'Comercio Internacional': 'Volatilidad cambiaria',
            'General': 'Disrupción tecnológica y nuevos competidores'
        };
        return threats[industry] || threats['General'];
    }

    // ======= FUNCIONES DE INTERFAZ =======

    async sendMessage() {
        const input = document.getElementById('aiChatInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message || this.isThinking) return;
        
        // Agregar mensaje del usuario
        this.addUserMessage(message);
        
        // Limpiar input
        input.value = '';
        this.adjustTextareaHeight(input);
        
        // Mostrar indicador de pensamiento
        this.showThinkingIndicator();
        
        // Guardar en historial
        this.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });
        
        try {
            // Generar respuesta inteligente
            const response = await this.generateIntelligentResponse(message);
            
            // Ocultar indicador y mostrar respuesta
            this.hideThinkingIndicator();
            this.addAIMessage(response);
            
            // Guardar respuesta en historial
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date()
            });
            
            // Actualizar sugerencias
            this.generateSmartSuggestions();
            
            // Guardar conversación
            this.saveConversationHistory();
            
        } catch (error) {
            console.error('Error generando respuesta:', error);
            this.hideThinkingIndicator();
            this.addAIMessage('❌ Lo siento, hubo un error procesando tu consulta. Por favor, intenta nuevamente.');
        }
    }

    addUserMessage(message) {
        const container = document.getElementById('aiChatMessages');
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
        const thinkingTexts = [
            'Analizando tu consulta...',
            'Procesando datos financieros...',
            'Consultando base de conocimiento...',
            'Generando recomendaciones...',
            'Preparando respuesta detallada...'
        ];
        
        const randomText = thinkingTexts[Math.floor(Math.random() * thinkingTexts.length)];
        container.querySelector('.thinking-text').textContent = randomText;
        container.style.display = 'block';
        
        // Actualizar estado del asistente
        const statusText = document.querySelector('.ai-status-text');
        if (statusText) statusText.textContent = 'Pensando...';
    }

    hideThinkingIndicator() {
        this.isThinking = false;
        const container = document.getElementById('aiTypingContainer');
        container.style.display = 'none';
        
        // Restaurar estado del asistente
        const statusText = document.querySelector('.ai-status-text');
        if (statusText) statusText.textContent = 'Listo para ayudarte';
    }

    formatAIResponse(response) {
        // Convertir markdown básico a HTML
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
        
        // Seleccionar 4 sugerencias aleatorias
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
        panel.classList.toggle('show');
        
        if (panel.classList.contains('show')) {
            // Focus en input cuando se abre
            setTimeout(() => {
                const input = document.getElementById('aiChatInput');
                if (input) input.focus();
            }, 300);
        }
    }

    clearConversation() {
        const container = document.getElementById('aiChatMessages');
        this.conversationHistory = [];
        
        // Mensaje de bienvenida inicial
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
        
        this.generateSmartSuggestions();
        this.saveConversationHistory();
    }

    showHelp() {
        const helpMessage = `🆘 **GUÍA DE USO - GRIZALUM AI EXPERT**

**🤖 ¿Qué puedo hacer por ti?**

**📊 ANÁLISIS FINANCIERO:**
• "Analiza mi flujo de caja"
• "¿Cómo mejorar mi rentabilidad?"
• "Calcula mis ratios financieros"

**⚖️ LEGAL Y TRIBUTARIO:**
• "Obligaciones SUNAT 2025"
• "¿Cómo optimizar mis impuestos?"
• "Normativa laboral peruana"

**🚀 ESTRATEGIA EMPRESARIAL:**
• "Estrategias para crecer mi empresa"
• "¿Cómo expandir a nuevos mercados?"
• "Análisis de competencia"

**💰 OPTIMIZACIÓN DE COSTOS:**
• "¿Cómo reducir gastos sin afectar calidad?"
• "Optimizar estructura de costos"
• "Eficiencia operativa"

**🎯 CONSEJOS PARA MEJORES RESPUESTAS:**

✅ **Sé específico**: "¿Cómo mejorar el flujo de caja de mi fundición?" vs "¿Cómo mejorar?"

✅ **Incluye contexto**: "Tengo una empresa de 5 empleados en Lima..."

✅ **Define objetivos**: "Quiero reducir costos en 20% este año"

✅ **Menciona plazos**: "Necesito una estrategia para los próximos 6 meses"

**🔧 FUNCIONES ESPECIALES:**
• **Reconocimiento de voz**: Botón del micrófono
• **Descargar conversación**: Guarda tus consultas
• **Sugerencias inteligentes**: Chips de temas relevantes

**💡 EJEMPLOS DE CONSULTAS PODEROSAS:**
• "Tengo S/. 25,000 de flujo de caja, ¿puedo invertir en nueva maquinaria?"
• "Mi margen de ganancia es 12%, ¿cómo llevarlo a 18%?"
• "¿Qué obligaciones tributarias tengo como empresa en régimen general?"

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

    bindEvents() {
        // Los eventos ya están vinculados en el HTML generado
        console.log('🔗 Eventos del AI Assistant vinculados');
    }
}

// ======= INICIALIZACIÓN =======

let advancedAI = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧠 Inicializando Advanced AI Assistant...');
    
    // Crear instancia del AI avanzado
    advancedAI = new AdvancedAIAssistant();
    
    // Hacer disponible globalmente
    window.advancedAI = advancedAI;
    
    console.log('✅ Advanced AI Assistant listo - Nivel ChatGPT/Claude');
});

console.log('🚀 GRIZALUM AI EXPERT CARGADO');
console.log('🧠 Capacidades:');
console.log('  • Análisis financiero inteligente');
console.log('  • Asesoría legal y tributaria para Perú');
console.log('  • Estrategias de crecimiento empresarial');
console.log('  • Optimización de costos y operaciones');
console.log('  • Marketing y ventas efectivas');
console.log('  • Gestión de recursos humanos');
console.log('  • Respuestas contextuales avanzadas');
console.log('🎯 ¡Tu consultor empresarial 24/7!');
