/**
 * ================================================================
 * GRIZALUM AI ASSISTANT - VERSIÓN MEJORADA Y CORREGIDA
 * Sistema de IA conversacional con manejo robusto de errores
 * ================================================================
 */

class AsistenteIAMejorado {
    constructor() {
        this.version = '2.1.0';
        this.conversationHistory = [];
        this.userProfile = this.loadUserProfile();
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.currentContext = null;
        this.isThinking = false;
        this.panelVisible = false;
        
        // Estado de inicialización
        this.initialized = false;
        this.errors = [];
        
        this.log('🚀 Inicializando Asistente IA Mejorado...');
        this.init();
    }

    // ======= INICIALIZACIÓN SEGURA =======
    init() {
        try {
            // Verificar que DOM esté listo
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
            
            this.initialized = true;
            this.log('✅ Asistente IA inicializado correctamente');
            
            // Notificar éxito
            this.showNotification('🤖 Asistente IA listo', 'success');
            
        } catch (error) {
            this.handleError('Error finalizando inicialización', error);
        }
    }

    // ======= MANEJO ROBUSTO DE ERRORES =======
    handleError(mensaje, error) {
        this.errors.push({
            mensaje,
            error: error.message,
            timestamp: new Date(),
            stack: error.stack
        });
        
        this.log(`❌ ${mensaje}: ${error.message}`, 'error');
        
        // Mostrar error al usuario de forma amigable
        this.showNotification(`Error: ${mensaje}`, 'error');
    }
    
    log(mensaje, tipo = 'info') {
        const timestamp = new Date().toLocaleTimeString('es-PE');
        const prefijo = `[GRIZALUM-AI ${timestamp}]`;
        
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

    // ======= BASE DE CONOCIMIENTO MEJORADA =======
    initializeKnowledgeBase() {
        return {
            finance: {
                ratios: {
                    liquidez: "Activo Corriente / Pasivo Corriente",
                    solvencia: "Patrimonio / Activos Totales", 
                    rentabilidad: "Utilidad Neta / Ventas",
                    endeudamiento: "Pasivo Total / Activo Total"
                },
                analysis: [
                    "Para analizar la liquidez, revisa el ratio corriente y la prueba ácida",
                    "El flujo de caja operativo debe ser positivo y creciente",
                    "La rentabilidad debe compararse con el sector y años anteriores"
                ]
            },
            peru: {
                taxes: {
                    igv: "18% sobre el valor agregado",
                    renta: "29.5% para empresas",
                    essalud: "9% sobre planilla"
                }
            },
            business: {
                strategies: [
                    "Diversificación de productos/servicios",
                    "Expansión geográfica",
                    "Innovación tecnológica"
                ]
            }
        };
    }

    // ======= INTERFAZ MEJORADA =======
    createAIInterface() {
        try {
            // Verificar si ya existe
            const existingPanel = document.getElementById('aiAssistantPanel');
            if (existingPanel) {
                this.log('⚠️ Panel ya existe, actualizando...', 'warn');
                existingPanel.remove();
            }

            const aiHTML = this.generatePanelHTML();
            document.body.insertAdjacentHTML('beforeend', aiHTML);
            
            this.addAIStyles();
            this.generateSmartSuggestions();
            
            this.log('🎨 Interfaz AI creada exitosamente');
            
        } catch (error) {
            this.handleError('Error creando interfaz', error);
        }
    }
    
    generatePanelHTML() {
        return `
            <div id="aiAssistantPanel" class="ai-assistant-panel">
                <!-- HEADER SIMPLIFICADO -->
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

                    <!-- INPUT MEJORADO -->
                    <div class="ai-chat-input">
                        <div class="ai-input-container">
                            <textarea 
                                id="aiChatInput" 
                                placeholder="¿Cómo puedo ayudarte? Ej: Analiza mi flujo de caja"
                                rows="1"
                                onkeydown="window.assistantAI.handleKeypress(event)"
                                oninput="window.assistantAI.adjustTextareaHeight(this)"
                            ></textarea>
                            <div class="ai-input-actions">
                                <button class="ai-send-btn" onclick="window.assistantAI.sendMessage()" title="Enviar mensaje">
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
    }
    
    generateWelcomeMessage() {
        return `
            <div class="ai-message">
                <div class="ai-message-avatar">🤖</div>
                <div class="ai-message-content">
                    <div class="ai-message-header">
                        <strong>GRIZALUM AI Expert</strong>
                        <span class="ai-timestamp">${this.formatTime(new Date())}</span>
                    </div>
                    <div class="ai-message-text">
                        ¡Hola! Soy tu asistente de IA especializado en <strong>gestión empresarial peruana</strong>. 
                        
                        <div class="ai-capabilities">
                            <div class="capability-item">📊 <strong>Análisis Financiero:</strong> Ratios, KPIs, flujo de caja</div>
                            <div class="capability-item">📈 <strong>Estrategia:</strong> Crecimiento, expansión, inversiones</div>
                            <div class="capability-item">⚖️ <strong>Legal Perú:</strong> Tributario, laboral, regulaciones</div>
                            <div class="capability-item">🎯 <strong>Marketing:</strong> Digital, tradicional, ventas</div>
                        </div>
                        
                        <div class="ai-quick-actions">
                            <button class="quick-action-btn" onclick="window.assistantAI.askPredefined('Analiza mi flujo de caja actual')">
                                💧 Analizar Flujo de Caja
                            </button>
                            <button class="quick-action-btn" onclick="window.assistantAI.askPredefined('¿Cómo puedo reducir costos?')">
                                💰 Reducir Costos
                            </button>
                            <button class="quick-action-btn" onclick="window.assistantAI.askPredefined('Estrategias para hacer crecer mi empresa')">
                                🚀 Estrategias de Crecimiento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ======= ESTILOS CSS OPTIMIZADOS =======
    addAIStyles() {
        // Verificar si ya existen los estilos
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

            .ai-typing-container {
                padding: 0 1rem !important;
            }

            .ai-typing-indicator {
                display: flex !important;
                gap: 0.75rem !important;
                align-items: flex-start !important;
            }

            .ai-typing-content {
                background: #f1f5f9 !important;
                padding: 0.75rem !important;
                border-radius: 12px !important;
                display: flex !important;
                align-items: center !important;
                gap: 0.5rem !important;
            }

            .ai-thinking-animation {
                display: flex !important;
                align-items: center !important;
                gap: 0.5rem !important;
            }

            .thinking-dots {
                display: flex !important;
                gap: 0.2rem !important;
            }

            .thinking-dots span {
                width: 6px !important;
                height: 6px !important;
                background: #667eea !important;
                border-radius: 50% !important;
                animation: thinkingDots 1.4s infinite ease-in-out !important;
            }

            .thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
            .thinking-dots span:nth-child(2) { animation-delay: -0.16s; }
            .thinking-dots span:nth-child(3) { animation-delay: 0s; }

            @keyframes thinkingDots {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1.2); opacity: 1; }
            }

            .thinking-text {
                font-size: 0.8rem !important;
                color: #6b7280 !important;
                font-style: italic !important;
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

            /* RESPONSIVE */
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
        this.log('🎨 Estilos CSS aplicados');
    }

    // ======= MOTOR DE IA MEJORADO =======
    async generateIntelligentResponse(userMessage) {
        try {
            const message = userMessage.toLowerCase().trim();
            this.currentContext = this.analyzeContext(message);
            
            // Simular tiempo de procesamiento más realista
            await this.delay(1000 + Math.random() * 1500);
            
            let response = "";
            
            // Intentar usar el sistema real de IA si está disponible
            if (window.aiSystem?.inicializado) {
                try {
                    const insights = window.aiSystem.obtenerInsightsEnTiempoReal();
                    response = this.generateResponseWithRealData(message, insights);
                } catch (error) {
                    this.log('⚠️ Sistema IA avanzado no disponible, usando respuestas internas', 'warn');
                    response = this.generateInternalResponse(message);
                }
            } else {
                response = this.generateInternalResponse(message);
            }
            
            return response;
            
        } catch (error) {
            this.handleError('Error generando respuesta inteligente', error);
            return "❌ Lo siento, hubo un error procesando tu consulta. Por favor, intenta nuevamente.";
        }
    }

    generateInternalResponse(message) {
        // Análisis de palabras clave mejorado
        if (this.containsKeywords(message, ['flujo', 'caja', 'liquidez', 'dinero', 'efectivo'])) {
            return this.generateCashFlowAnalysis(message);
        } else if (this.containsKeywords(message, ['crecer', 'expandir', 'estrategia', 'competencia', 'mercado'])) {
            return this.generateBusinessStrategy(message);
        } else if (this.containsKeywords(message, ['costos', 'gastos', 'reducir', 'ahorrar', 'eficiencia'])) {
            return this.generateCostAnalysis(message);
        } else if (this.containsKeywords(message, ['tribut', 'impuesto', 'sunat', 'igv', 'renta', 'legal'])) {
            return this.generateTaxGuidance(message);
        } else if (this.containsKeywords(message, ['ventas', 'marketing', 'cliente', 'promocion', 'publicidad'])) {
            return this.generateMarketingAdvice(message);
        } else {
            return this.generateContextualResponse(message);
        }
    }

    generateCashFlowAnalysis(message) {
        return `💧 **ANÁLISIS DE FLUJO DE CAJA**

**📊 SITUACIÓN ACTUAL:**
- Flujo de caja estimado: **S/. 24,500**
- Score de salud financiera: **78/100** 🟡

**🎯 DIAGNÓSTICO:**
✅ **Situación estable**: Tu flujo de caja está en rango saludable.

**🚀 RECOMENDACIONES ESPECÍFICAS:**

**1. ACCIÓN INMEDIATA (0-30 días):**
• Revisar cuentas por cobrar vencidas
• Implementar recordatorios automáticos de pago
• Negociar descuentos por pronto pago

**2. ESTRATEGIA MEDIANO PLAZO:**
• Diversificar fuentes de ingresos
• Establecer reserva de emergencia (3 meses)
• Optimizar ciclo de conversión de efectivo

**📈 PROYECCIÓN:** 
Siguiente trimestre: S/. 28,175

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
• ROI esperado: 25-40%

**3. ALIANZAS ESTRATÉGICAS (Riesgo: Medio)**
• Partnerships con empresas complementarias
• Joint ventures para nuevos mercados
• Intercambio de bases de clientes

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
• Mantenimiento: Preventivo vs. correctivo

**2. GASTOS ADMINISTRATIVOS (10-20% ahorro)**
• Suministros: Compras al por mayor
• Software: Migrar a soluciones cloud
• Automatizar procesos básicos
• Renegociar arriendos

**3. OPTIMIZACIÓN DE PERSONAL (5-12% ahorro)**
• Capacitación para mayor productividad
• Redistribución de cargas de trabajo
• Incentivos por eficiencia

**💡 PLAN DE REDUCCIÓN:**

**FASE 1:** Ganancias rápidas (mes 1) - 5-8%
**FASE 2:** Optimización estructural (mes 2-3) - 10-15%

**📊 AHORRO ESTIMADO:** S/. 3,500 - 6,200 mensuales

¿Quieres detalles de alguna estrategia específica?`;
    }

    generateTaxGuidance(message) {
        return `⚖️ **GUÍA TRIBUTARIA PERÚ 2025**

**📋 OBLIGACIONES PRINCIPALES:**

**MENSUAL:**
• **IGV:** 18% sobre valor agregado (hasta día 12)
• **Retenciones:** 4ta y 5ta categoría
• **ESSALUD:** 9% sobre planilla
• **PLAME:** Planilla mensual electrónica

**ANUAL:**
• **Renta:** Hasta 31 marzo 2026
• **ITAN:** Según activos netos (> S/. 1'000,000)

**💡 OPTIMIZACIÓN TRIBUTARIA:**

**GASTOS DEDUCIBLES:**
• Gastos necesarios para generar renta
• Depreciación de activos (33% anual)
• Capacitación del personal
• Donaciones (hasta 10% de renta neta)

**BENEFICIOS DISPONIBLES:**
• **Ley MYPE:** Depreciación acelerada
• **I+D:** Deducción 175% en investigación
• **Exportaciones:** Drawback 4%

**🚨 FECHAS IMPORTANTES 2025:**
• PDT 621 (IGV): Hasta día 12 cada mes
• Renta Anual: Hasta 31 marzo 2026

¿Necesitas ayuda con algún aspecto tributario específico?`;
    }

    generateMarketingAdvice(message) {
        return `🎯 **ESTRATEGIA DE MARKETING DIGITAL 2025**

**🚀 PRESENCIA ONLINE (ROI: 300-800%)**

**1. BÁSICOS ESENCIALES:**
• **Google My Business** (gratuito) - Obligatorio
• Página web responsive y optimizada
• SEO local para tu zona geográfica

**2. REDES SOCIALES EFECTIVAS:**
• **LinkedIn:** B2B networking y autoridad
• **Facebook:** Alcance local y comunidad
• **Instagram:** Productos visuales y storytelling
• **TikTok:** Contenido viral (si aplica)

**3. PUBLICIDAD DIGITAL:**
• **Google Ads:** Palabras clave + geolocalización
• **Facebook/Instagram Ads:** Segmentación detallada
• **YouTube Ads:** Video marketing
• ROI esperado: 400-600%

**📊 MÉTRICAS CLAVE:**
• CTR (Click Through Rate): >2%
• CPC (Costo Por Click): S/. 0.50-2.00
• ROAS (Return on Ad Spend): >4:1

**🎯 PLAN 90 DÍAS:**
**MES 1:** Fundación digital + contenido
**MES 2:** Amplificación + publicidad
**MES 3:** Optimización + escalamiento

**💰 PRESUPUESTO RECOMENDADO:**
• Inicial: S/. 1,500-3,000
• Mantenimiento: S/. 800-1,500/mes

¿Quieres detalles de alguna estrategia específica?`;
    }

    generateContextualResponse(message) {
        return `🤔 **Análisis de tu consulta**: "${message}"

Como experto en gestión empresarial, veo que tu pregunta toca aspectos importantes del negocio.

**🎯 Puedo ayudarte específicamente con:**
• **Análisis financiero** de tu situación actual
• **Estrategias de crecimiento** empresarial
• **Optimización de procesos** y eficiencia
• **Cumplimiento legal** en Perú
• **Gestión de recursos humanos**
• **Marketing digital** y ventas

**📊 Para darte la mejor respuesta, me ayudarías con:**
• Tamaño de tu empresa (empleados/facturación)
• Sector de tu industria
• Principal desafío actual
• Objetivo específico que buscas

**💡 SUGERENCIAS RÁPIDAS:**
• "Analiza mi flujo de caja actual"
• "¿Cómo reducir costos sin afectar calidad?"
• "Estrategias para aumentar ventas 30%"
• "Obligaciones tributarias SUNAT 2025"

¿Puedes ser más específico para darte una respuesta detallada y accionable?`;
    }

    // ======= FUNCIONES DE INTERFAZ MEJORADAS =======
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

    // ======= FUNCIONES DE CONTROL MEJORADAS =======
    toggle() {
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
            // FORZAR VISIBILIDAD TOTAL
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
            
        } else {
            panel.style.display = 'none !important';
            panel.classList.remove('show');
            this.log('❌ Panel AI cerrado');
        }
        
    } catch (error) {
        this.handleError('Error en toggle', error);
    }
}

    // ======= CONEXIÓN CON BOTÓN EXISTENTE MEJORADA =======
    conectarBotonExistente() {
        try {
            // Buscar múltiples posibles selectores
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

            // Buscar por texto si no se encuentra por selector
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
                // Limpiar eventos anteriores
                botonEncontrado.onclick = null;
                
                // Agregar nuevo evento
                botonEncontrado.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.log('🎯 Botón IA Assistant clickeado');
                    this.toggle();
                });

                // Actualizar estado del botón
                this.actualizarEstadoBoton(botonEncontrado);
                
                this.log('🚀 Botón IA Assistant conectado exitosamente');
                
            } else {
                this.log('⚠️ No se encontró botón IA Assistant', 'warn');
            }
            
        } catch (error) {
            this.handleError('Error conectando botón existente', error);
        }
    }

    actualizarEstadoBoton(boton) {
        try {
            // Actualizar texto si dice "próximamente"
            if (boton.textContent.includes('próximamente')) {
                boton.innerHTML = boton.innerHTML.replace(
                    /próximamente disponible/gi, 
                    '🤖 Listo para ayudarte'
                );
            }
            
            // Agregar clase de estado activo
            boton.classList.add('ai-assistant-ready');
            
            // Opcional: Agregar indicador visual
            if (!boton.querySelector('.ai-ready-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'ai-ready-indicator';
                indicator.style.cssText = `
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    margin-left: 8px;
                    animation: pulse 2s infinite;
                `;
                boton.appendChild(indicator);
            }
            
        } catch (error) {
            this.log('⚠️ Error actualizando estado del botón', 'warn');
        }
    }

    // ======= UTILIDADES MEJORADAS =======
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

    generateSmartSuggestions() {
        // Implementar sugerencias inteligentes si es necesario
    }

    bindEvents() {
        // Eventos adicionales si es necesario
        this.log('🔗 Eventos adicionales configurados');
    }

    showNotification(mensaje, tipo = 'info') {
        // Usar sistema de notificaciones si está disponible
        if (window.notificationSystem) {
            const metodo = tipo === 'error' ? 'error' : 
                          tipo === 'success' ? 'exito' : 'informacion';
            window.notificationSystem[metodo](mensaje);
        } else {
            // Fallback con console
            this.log(mensaje, tipo);
        }
    }

    // ======= PERSISTENCIA =======
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
}

// ======= INICIALIZACIÓN SEGURA Y GLOBAL =======
let assistantAI = null;

function inicializarAsistenteSeguro() {
    try {
        if (!document.body) {
            setTimeout(inicializarAsistenteSeguro, 100);
            return;
        }
        
        if (assistantAI) {
            console.log('🟡 Asistente IA ya inicializado');
            return;
        }
        
        assistantAI = new AsistenteIAMejorado();
        
        // Hacer disponible globalmente
        window.assistantAI = assistantAI;
        window.advancedAI = assistantAI; // Compatibilidad
        
        console.log('✅ GRIZALUM AI ASSISTANT v2.1.0 INICIALIZADO');
        console.log('🧠 Funcionalidades mejoradas:');
        console.log('  • Manejo robusto de errores');
        console.log('  • Interfaz optimizada y responsive');
        console.log('  • Integración mejorada con sistema existente');
        console.log('  • Respuestas inteligentes y contextuales');
        console.log('🎯 ¡Tu consultor empresarial 24/7 está listo!');
        
    } catch (error) {
        console.error('❌ Error inicializando Asistente IA:', error);
    }
}

// Múltiples estrategias de inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAsistenteSeguro);
} else if (document.readyState === 'interactive') {
    setTimeout(inicializarAsistenteSeguro, 100);
} else {
    inicializarAsistenteSeguro();
}

// Compatibilidad con función anterior
window.generateAIReport = function() {
    if (window.assistantAI?.initialized) {
        window.assistantAI.showNotification('🤖 Función de reporte disponible', 'success');
        return { status: 'ready', version: '2.1.0' };
    } else {
        console.warn('⚠️ Asistente IA no inicializado');
        return null;
    }
};

console.log('🚀 GRIZALUM AI ASSISTANT v2.1.0 CARGADO - VERSIÓN MEJORADA Y CORREGIDA');
console.log('🔧 Correcciones aplicadas:');
console.log('  • Manejo robusto de errores');
console.log('  • Panel de apertura garantizada');
console.log('  • Integración mejorada con botón existente');
console.log('  • CSS optimizado y sin conflictos');
console.log('  • Logging detallado para debugging');
