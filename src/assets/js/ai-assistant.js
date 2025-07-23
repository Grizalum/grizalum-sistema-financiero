/**
 * ================================================
 * GRIZALUM - AI ASSISTANT MODULE
 * Sistema de chat IA conversacional
 * ================================================
 */

// ======= VARIABLES GLOBALES DEL AI =======
const AI_CONFIG = {
    colorPalettes: [
        { name: 'Oro Empresarial', primary: '#d4af37', secondary: '#b87333' },
        { name: 'Verde Prosperidad', primary: '#059669', secondary: '#10b981' },
        { name: 'Azul Corporativo', primary: '#1e40af', secondary: '#3b82f6' },
        { name: 'Púrpura Premium', primary: '#7c3aed', secondary: '#8b5cf6' },
        { name: 'Rojo Dinámico', primary: '#dc2626', secondary: '#ef4444' },
        { name: 'Naranja Energético', primary: '#ea580c', secondary: '#f97316' },
        { name: 'Turquesa Moderno', primary: '#0891b2', secondary: '#06b6d4' },
        { name: 'Rosa Innovador', primary: '#ec4899', secondary: '#f472b6' }
    ],
    currentPaletteIndex: 0,
    recognition: null,
    isRecording: false,
    isInitialized: false
};

// ======= CLASE PRINCIPAL AI ASSISTANT =======
class AIAssistant {
    constructor() {
        this.config = AI_CONFIG;
        this.init();
    }

    // Inicializar AI Assistant
    init() {
        if (this.config.isInitialized) return;
        
        console.log('🤖 Inicializando AI Assistant GRIZALUM...');
        
        this.bindEvents();
        this.initializeVoiceRecognition();
        this.loadSavedPalette();
        this.createAIPanel();
        
        this.config.isInitialized = true;
        console.log('✅ AI Assistant inicializado correctamente');
    }

    // Crear panel de IA si no existe
    createAIPanel() {
        if (document.getElementById('aiAssistantPanel')) return;

        const panelHTML = `
            <!-- BOTÓN FLOTANTE DE IA -->
            <div id="aiAssistantButton" class="ai-assistant-button" onclick="aiAssistant.toggle()">
                <div class="ai-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="ai-pulse"></div>
            </div>

            <!-- PANEL DEL ASISTENTE IA -->
            <div id="aiAssistantPanel" class="ai-assistant-panel">
                <div class="ai-panel-header">
                    <div class="ai-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="ai-info">
                        <h4>GRIZALUM IA</h4>
                        <p>Listo para ayudarte</p>
                    </div>
                    <div class="ai-controls">
                        <button class="ai-control-btn" onclick="aiAssistant.toggleColorPalette()" title="Cambiar colores">
                            <i class="fas fa-palette"></i>
                        </button>
                        <button class="ai-control-btn" onclick="aiAssistant.clearChat()">
                            <i class="fas fa-broom"></i>
                        </button>
                        <button class="ai-control-btn" onclick="aiAssistant.toggle()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="ai-insights-section">
                    <h5>🎯 Insights Automáticos</h5>
                    <div id="aiInsights" class="ai-insights-container">
                        <div class="ai-insight-item success">
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">📈 Flujo de caja estable este mes</div>
                            <div style="font-size: 0.7rem; opacity: 0.8;">💡 Ver detalles</div>
                        </div>
                        <div class="ai-insight-item info">
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">🎯 IA lista para analizar tus datos</div>
                            <div style="font-size: 0.7rem; opacity: 0.8;">💡 Comenzar análisis</div>
                        </div>
                    </div>
                </div>

                <div class="ai-chat-container">
                    <div class="ai-chat-messages" id="aiChatMessages">
                        <div class="ai-message">
                            <div class="ai-message-avatar">🤖</div>
                            <div class="ai-message-content">
                                <p>¡Hola! Soy tu asistente financiero IA especializado en empresas peruanas. Puedo ayudarte con:</p>
                                <div class="ai-quick-actions">
                                    <button class="quick-action-btn" onclick="aiAssistant.askQuestion('¿Cómo van mis ventas?')">📈 ¿Cómo van las ventas?</button>
                                    <button class="quick-action-btn" onclick="aiAssistant.askQuestion('¿Puedo invertir más dinero?')">💰 ¿Puedo invertir?</button>
                                    <button class="quick-action-btn" onclick="aiAssistant.askQuestion('¿Cómo está mi flujo de caja?')">💧 Flujo de caja</button>
                                    <button class="quick-action-btn" onclick="aiAssistant.askQuestion('Dame predicciones para el próximo mes')">🔮 Predicciones</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ai-chat-input">
                        <div class="ai-input-container">
                            <input type="text" id="aiChatInput" placeholder="Pregúntame sobre tu empresa..." 
                                   onkeydown="aiAssistant.handleKeypress(event)">
                            <button class="ai-send-btn" onclick="aiAssistant.sendMessage()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                            <button class="ai-voice-btn" onclick="aiAssistant.toggleVoice()" id="voiceInputBtn">
                                <i class="fas fa-microphone"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHTML);
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🔗 Vinculando eventos AI Assistant...');
        });
    }

    // ======= FUNCIONES PRINCIPALES =======

    // Toggle panel IA
    toggle() {
        const panel = document.getElementById('aiAssistantPanel');
        if (!panel) {
            console.error('❌ Panel IA no encontrado');
            return;
        }
        
        panel.classList.toggle('show');
        console.log('🤖 Panel IA toggled');
    }

    // Enviar mensaje
    sendMessage() {
        const input = document.getElementById('aiChatInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        console.log('💬 Enviando mensaje:', message);
        
        this.addMessage(message, 'user');
        input.value = '';
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'ai');
        }, 1500);
    }

    // Manejar tecla Enter
    handleKeypress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    // Pregunta rápida
    askQuestion(question) {
        const input = document.getElementById('aiChatInput');
        if (input) {
            input.value = question;
            this.sendMessage();
        }
    }

    // ======= GESTIÓN DE MENSAJES =======

    // Agregar mensaje al chat
    addMessage(message, sender) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        const avatar = sender === 'ai' ? '🤖' : '👤';
        const avatarClass = sender === 'ai' ? 'ai-message-avatar' : 'user-message-avatar';
        const contentClass = sender === 'ai' ? 'ai-message-content' : 'user-message-content';
        
        messageDiv.innerHTML = `
            <div class="${avatarClass}">${avatar}</div>
            <div class="${contentClass}">
                <p>${message}</p>
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        // Animación suave
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    // Mostrar indicador de escritura
    showTypingIndicator() {
        const container = document.getElementById('aiChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'ai-message';
        typingDiv.innerHTML = `
            <div class="ai-message-avatar">🤖</div>
            <div class="ai-message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }

    // Ocultar indicador de escritura
    hideTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    // ======= GENERACIÓN DE RESPUESTAS IA =======

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Obtener datos de la empresa actual
        const currentCompany = window.companyManager ? 
            window.companyManager.getCurrentSelected() : null;
        
        console.log('🧠 Generando respuesta para:', message);
        
        // RESPUESTAS SOBRE VENTAS
        if (this.containsKeywords(message, ['ventas', 'vender', 'ingresos'])) {
            return this.generateSalesResponse(currentCompany);
        }
        
        // RESPUESTAS SOBRE FLUJO DE CAJA
        if (this.containsKeywords(message, ['flujo', 'caja', 'liquidez'])) {
            return this.generateCashFlowResponse(currentCompany);
        }
        
        // RESPUESTAS SOBRE INVERSIÓN
        if (this.containsKeywords(message, ['invertir', 'inversión', 'expandir'])) {
            return this.generateInvestmentResponse(currentCompany);
        }
        
        // RESPUESTAS SOBRE GASTOS
        if (this.containsKeywords(message, ['gastos', 'costos', 'reducir'])) {
            return this.generateExpensesResponse(currentCompany);
        }
        
        // RESPUESTAS SOBRE PREDICCIONES
        if (this.containsKeywords(message, ['futuro', 'predicción', 'pronóstico'])) {
            return this.generatePredictionResponse(currentCompany);
        }
        
        // RESPUESTAS DE SALUDO
        if (this.containsKeywords(message, ['hola', 'buenos', 'buenas'])) {
            return this.getRandomGreeting();
        }
        
        // RESPUESTAS DE AGRADECIMIENTO
        if (this.containsKeywords(message, ['gracias', 'thank'])) {
            return '😊 ¡Siempre a tu servicio! Estoy disponible 24/7 para ayudarte a hacer crecer tu negocio. ¿Hay algo más que pueda analizar para ti?';
        }
        
        return this.getDefaultResponse(userMessage);
    }

    // Verificar palabras clave
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    // Generar respuesta sobre ventas
    generateSalesResponse(company) {
        if (!company) {
            return '📊 Selecciona una empresa específica para analizar sus ventas en detalle.';
        }
        
        const growth = Math.random() > 0.5 ? 'crecimiento' : 'estabilidad';
        const percentage = (Math.random() * 25 + 5).toFixed(1);
        const advice = growth === 'crecimiento' ? 
            'Recomiendo mantener esta estrategia y considerar expansión.' : 
            'Sugiero implementar nuevas estrategias de marketing digital.';
        
        return `📈 **Análisis de Ventas - ${company.name}**

Las ventas actuales son S/. ${company.data.revenue.toLocaleString()} con una tendencia de ${growth} del ${percentage}%.

${advice}

**Recomendaciones:**
• Enfócate en productos de mayor margen
• Implementa programas de fidelización
• Considera promociones estacionales`;
    }

    // Generar respuesta sobre flujo de caja
    generateCashFlowResponse(company) {
        if (!company) {
            return '💰 Necesito que selecciones una empresa para revisar su flujo de caja.';
        }
        
        const health = company.data.cashFlow > 25000 ? 'excelente' : 
                      company.data.cashFlow > 15000 ? 'bueno' : 'necesita atención';
        const color = company.data.cashFlow > 25000 ? '🟢' : 
                     company.data.cashFlow > 15000 ? '🟡' : '🔴';
        
        return `💧 **Flujo de Caja - ${company.name}**

${color} Estado: ${health.toUpperCase()}
💰 Disponible: S/. ${company.data.cashFlow.toLocaleString()}

**Análisis:**
${company.data.cashFlow > 25000 ? 
    '• Excelente liquidez para inversiones\n• Considera expansión o nuevos equipos\n• Mantén reserva del 20% para emergencias' :
    '• Acelera cobranzas pendientes\n• Revisa gastos no esenciales\n• Negocia mejores términos con proveedores'}`;
    }

    // Generar respuesta sobre inversión
    generateInvestmentResponse(company) {
        if (!company) {
            return '💡 Selecciona una empresa para evaluar su capacidad de inversión.';
        }
        
        const canInvest = company.data.cashFlow > 30000;
        const riskLevel = company.data.profit / company.data.revenue > 0.2 ? 'bajo' : 'moderado';
        
        return `💡 **Análisis de Inversión - ${company.name}**

${canInvest ? '✅ RECOMENDADO' : '⚠️ PRECAUCIÓN'}

**Capacidad actual:**
• Flujo disponible: S/. ${company.data.cashFlow.toLocaleString()}
• Margen de ganancia: ${((company.data.profit/company.data.revenue)*100).toFixed(1)}%
• Nivel de riesgo: ${riskLevel}

**Recomendación:**
${canInvest ? 
    'Puedes invertir hasta S/. ' + Math.floor(company.data.cashFlow * 0.6).toLocaleString() + ' manteniendo liquidez segura.' :
    'Fortalece primero el flujo de caja antes de inversiones grandes. Enfócate en optimizar operaciones actuales.'}`;
    }

    // Generar respuesta sobre gastos
    generateExpensesResponse(company) {
        if (!company) {
            return '💸 Elige una empresa para analizar sus gastos y encontrar oportunidades de ahorro.';
        }
        
        const expenseRatio = (company.data.expenses / company.data.revenue * 100).toFixed(1);
        const efficiency = expenseRatio < 60 ? 'excelente' : expenseRatio < 75 ? 'buena' : 'necesita mejora';
        
        return `💸 **Análisis de Gastos - ${company.name}**

📊 Gastos actuales: S/. ${company.data.expenses.toLocaleString()}
📈 Porcentaje de ingresos: ${expenseRatio}%
⚡ Eficiencia: ${efficiency}

**Oportunidades de optimización:**
• Renegociar contratos con proveedores principales
• Automatizar procesos repetitivos
• Revisar gastos de marketing menos efectivos
• Considerar equipos más eficientes energéticamente`;
    }

    // Generar respuesta sobre predicciones
    generatePredictionResponse(company) {
        if (!company) {
            return '🔮 Selecciona una empresa para generar predicciones específicas basadas en sus datos.';
        }
        
        const trend = Math.random() > 0.5 ? 'positiva' : 'estable';
        const nextMonth = Math.round(company.data.revenue * (trend === 'positiva' ? 1.15 : 1.05));
        
        return `🔮 **Predicción Financiera - ${company.name}**

**Próximo mes:**
📈 Ingresos proyectados: S/. ${nextMonth.toLocaleString()}
📊 Tendencia: ${trend}
🎯 Confianza: 85%

**Factores considerados:**
• Tendencias históricas de la empresa
• Estacionalidad del sector
• Condiciones del mercado peruano
• Indicadores económicos actuales

**Recomendación:** ${trend === 'positiva' ? 'Prepárate para el crecimiento aumentando inventario' : 'Mantén operaciones estables y enfócate en eficiencia'}`;
    }

    // Saludos aleatorios
    getRandomGreeting() {
        const greetings = [
            '¡Hola! 👋 Soy tu asistente financiero inteligente. Puedo ayudarte con análisis de ventas, flujo de caja, predicciones y estrategias de crecimiento.',
            '¡Saludos! 🚀 Estoy aquí para optimizar las finanzas de tu empresa. ¿Qué aspecto de tu negocio quieres revisar?',
            '¡Buen día! 📊 Especialista en análisis empresarial a tu servicio. ¿Comenzamos con un análisis de rentabilidad?'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Respuesta por defecto
    getDefaultResponse(userMessage) {
        const defaultResponses = [
            `🤔 Entiendo que preguntas sobre "${userMessage}". Puedo ayudarte con:

📈 **Análisis de Ventas** - Tendencias y oportunidades
💧 **Flujo de Caja** - Liquidez y gestión financiera  
💡 **Estrategias de Inversión** - Cuándo y dónde invertir
🔮 **Predicciones** - Proyecciones basadas en datos
💸 **Optimización de Gastos** - Reducir costos sin afectar calidad

¿Sobre cuál de estos temas te gustaría que profundice?`,
            
            `💡 Interesante consulta sobre "${userMessage}". Para darte la mejor respuesta, ¿te refieres a:

• **Análisis financiero** de una empresa específica
• **Comparación** entre tus diferentes negocios  
• **Estrategias** para mejorar rentabilidad
• **Predicciones** de crecimiento futuro

¡Dime qué necesitas y te ayudo con datos precisos!`
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // ======= SISTEMA DE COLORES =======

    // Cambiar paleta de colores
    toggleColorPalette() {
        console.log('🎨 Cambiando paleta de colores...');
        
        // Seleccionar paleta aleatoria (diferente a la actual)
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.config.colorPalettes.length);
        } while (newIndex === this.config.currentPaletteIndex);
        
        this.config.currentPaletteIndex = newIndex;
        const palette = this.config.colorPalettes[newIndex];
        
        this.applyColorPalette(palette);
        this.showColorChangeNotification(palette.name);
    }

    // Aplicar paleta de colores
    applyColorPalette(palette) {
        console.log(`🎨 Aplicando: ${palette.name}`);
        
        // Actualizar variables CSS
        document.documentElement.style.setProperty('--peru-gold', palette.primary);
        document.documentElement.style.setProperty('--company-primary', palette.primary);
        document.documentElement.style.setProperty('--company-secondary', palette.secondary);
        
        // Actualizar botones principales
        const buttons = document.querySelectorAll('.btn-primary, .btn-add-company');
        buttons.forEach(btn => {
            btn.style.background = `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`;
        });
        
        // Actualizar botón IA
        const aiButton = document.getElementById('aiAssistantButton');
        if (aiButton) {
            aiButton.style.background = `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`;
        }
        
        // Actualizar header IA
        const aiHeader = document.querySelector('.ai-panel-header');
        if (aiHeader) {
            aiHeader.style.background = `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`;
        }
        
        // Actualizar selector de empresa
        const selectedCompany = document.querySelector('.selected-company');
        if (selectedCompany) {
            selectedCompany.style.borderColor = palette.primary + '80'; // 50% transparencia
        }
        
        // Guardar preferencia
        localStorage.setItem('grizalum_current_palette', JSON.stringify(palette));
        
        console.log('✅ Paleta aplicada correctamente');
    }

    // Mostrar notificación de cambio de color
    showColorChangeNotification(paletteName) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--company-primary), var(--company-secondary));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.innerHTML = `🎨 Paleta cambiada a: ${paletteName}`;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Quitar después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Cargar paleta guardada
    loadSavedPalette() {
        const savedPalette = localStorage.getItem('grizalum_current_palette');
        if (savedPalette) {
            try {
                const palette = JSON.parse(savedPalette);
                this.applyColorPalette(palette);
            } catch (e) {
                console.log('No se pudo cargar paleta guardada');
            }
        }
    }

    // ======= RECONOCIMIENTO DE VOZ =======

    // Inicializar reconocimiento de voz
    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.config.recognition = new SpeechRecognition();
            
            this.config.recognition.continuous = false;
            this.config.recognition.interimResults = false;
            this.config.recognition.lang = 'es-PE';
            
            this.config.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const input = document.getElementById('aiChatInput');
                if (input) {
                    input.value = transcript;
                    this.stopVoiceInput();
                    setTimeout(() => this.sendMessage(), 500);
                }
            };
            
            this.config.recognition.onerror = (event) => {
                console.warn('Error de voz:', event.error);
                this.stopVoiceInput();
                this.addMessage('❌ Error en reconocimiento de voz. Intenta nuevamente.', 'ai');
            };
            
            this.config.recognition.onend = () => {
                this.stopVoiceInput();
            };
            
            console.log('🎤 Reconocimiento de voz listo');
        }
    }

    // Toggle reconocimiento de voz
    toggleVoice() {
        if (!this.config.recognition) {
            this.addMessage('❌ Reconocimiento de voz no disponible.', 'ai');
            return;
        }
        
        if (this.config.isRecording) {
            this.stopVoiceInput();
            return;
        }
        
        this.startVoiceInput();
    }

    // Iniciar entrada de voz
    startVoiceInput() {
        this.config.isRecording = true;
        const button = document.getElementById('voiceInputBtn');
        if (button) {
            button.style.background = '#ef4444';
            button.innerHTML = '<i class="fas fa-stop"></i>';
            button.classList.add('active');
        }
        
        this.config.recognition.start();
        this.addMessage('🎤 Escuchando... Habla ahora', 'ai');
    }

    // Detener entrada de voz
    stopVoiceInput() {
        this.config.isRecording = false;
        if (this.config.recognition) this.config.recognition.stop();
        
        const button = document.getElementById('voiceInputBtn');
        if (button) {
            button.style.background = '#6b7280';
            button.innerHTML = '<i class="fas fa-microphone"></i>';
            button.classList.remove('active');
        }
    }

    // ======= GESTIÓN DEL CHAT =======

    // Limpiar chat
    clearChat() {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;
        
        container.innerHTML = `
            <div class="ai-message">
                <div class="ai-message-avatar">🤖</div>
                <div class="ai-message-content">
                    <p>Chat reiniciado. Soy tu asistente financiero IA especializado en empresas peruanas. ¿En qué puedo ayudarte?</p>
                    <div class="ai-quick-actions">
                        <button class="quick-action-btn" onclick="aiAssistant.askQuestion('¿Cómo van mis ventas?')">📈 Analizar Ventas</button>
                        <button class="quick-action-btn" onclick="aiAssistant.askQuestion('¿Puedo invertir más dinero?')">💰 ¿Puedo Invertir?</button>
                        <button class="quick-action-btn" onclick="aiAssistant.askQuestion('¿Cómo está mi flujo de caja?')">💧 Flujo de Caja</button>
                        <button class="quick-action-btn" onclick="aiAssistant.askQuestion('Dame predicciones para el próximo mes')">🔮 Predicciones</button>
                    </div>
                </div>
            </div>
        `;
    }

    // ======= UTILIDADES =======

    // Mostrar notificación general
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Quitar después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// ======= INICIALIZACIÓN AUTOMÁTICA =======

// Instancia global del AI Assistant
let aiAssistant = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando módulo AI Assistant...');
    
    // Crear instancia global
    aiAssistant = new AIAssistant();
    
    // Hacer disponible globalmente para compatibilidad
    window.aiAssistant = aiAssistant;
    
    console.log('✅ AI Assistant GRIZALUM listo para usar');
});

// ======= FUNCIONES GLOBALES PARA COMPATIBILIDAD =======

// Funciones que se pueden llamar desde HTML directamente
function toggleAIAssistant() {
    if (aiAssistant) aiAssistant.toggle();
}

function sendAIMessage() {
    if (aiAssistant) aiAssistant.sendMessage();
}

function handleAIChatKeypress(event) {
    if (aiAssistant) aiAssistant.handleKeypress(event);
}

function askAI(question) {
    if (aiAssistant) aiAssistant.askQuestion(question);
}

function clearAIChat() {
    if (aiAssistant) aiAssistant.clearChat();
}

function toggleColorPalette() {
    if (aiAssistant) aiAssistant.toggleColorPalette();
}

function startVoiceInput() {
    if (aiAssistant) aiAssistant.toggleVoice();
}

console.log('🎯 AI Assistant Module cargado');
console.log('✨ Funciones disponibles:');
console.log('  • Chat inteligente y conversacional');
console.log('  • Cambio de colores aleatorio');
console.log('  • Reconocimiento de voz en español');
console.log('  • Respuestas contextuales sobre el negocio');
console.log('  • Análisis financiero detallado');
console.log('🚀 ¡Listo para usar!');
