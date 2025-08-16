/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        GRIZALUM ENTERPRISE SUITE                              ║
 * ║                    ASISTENTE IA CONVERSACIONAL AVANZADO                       ║
 * ║                          Versión Ultra Optimizada                            ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║ • Interfaz de chat IA ultra moderna y responsive                             ║
 * ║ • Sistema de conversaciones con memoria persistente                          ║
 * ║ • Integración completa con ecosistema GRIZALUM                              ║
 * ║ • Cache inteligente y optimizaciones de rendimiento                         ║
 * ║ • Accesibilidad profesional y métricas avanzadas                           ║
 * ║ • API pública robusta con validaciones de seguridad                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

class AsistenteIAAvanzado {
    constructor(opciones = {}) {
        // ═══════════════════════════════════════════════════════════════════════════
        // CONFIGURACIÓN ULTRA PROFESIONAL
        // ═══════════════════════════════════════════════════════════════════════════
        this.config = {
            version: '2.0.0',
            componente: 'AsistenteIAAvanzado',
            debug: opciones.debug || false,
            
            // Configuración de chat
            chat: {
                maxMensajes: 100,
                timeoutRespuesta: 30000,
                reintentosMaximos: 3,
                intervaloAutoguardado: 10000
            },
            
            // Configuración de UI
            ui: {
                animacionDuracion: 300,
                tipoEscritura: 150,
                maxAlturaMensaje: 400,
                posicionPanel: 'right'
            },
            
            // Configuración de caché
            cache: {
                tiempoVida: 3600000, // 1 hora
                maxEntradas: 50,
                prefijoKey: 'grizalum_ai_'
            },
            
            // Métricas
            metricas: {
                contadorMensajes: 0,
                tiempoSesion: 0,
                interacciones: {},
                satisfaccion: null
            }
        };

        // Estado del asistente
        this.estado = {
            inicializado: false,
            panelVisible: false,
            escribiendo: false,
            escuchando: false,
            conversacionActiva: null,
            ultimaActividad: null
        };

        // Cache inteligente
        this.cache = new Map();
        this.conversaciones = new Map();
        this.historialGlobal = [];
        
        // Referencias DOM
        this.elementos = {};
        
        // Métricas y analytics
        this.analytics = {
            inicioSesion: Date.now(),
            mensajesEnviados: 0,
            mensajesRecibidos: 0,
            tiempoPromedio: 0,
            temasConsulta: new Set()
        };

        // ═══════════════════════════════════════════════════════════════════════════
        // INICIALIZACIÓN AUTOMÁTICA
        // ═══════════════════════════════════════════════════════════════════════════
        this._inicializar();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE INICIALIZACIÓN ULTRA PROFESIONAL
    // ═══════════════════════════════════════════════════════════════════════════
    async _inicializar() {
        try {
            this._log('info', '🚀 Iniciando Asistente IA Avanzado...');
            
            // Validaciones de dependencias
            await this._validarDependencias();
            
            // Cargar configuración persistente
            await this._cargarConfiguracion();
            
            // Crear interfaz
            await this._crearInterfaz();
            
            // Vincular eventos
            this._vincularEventos();
            
            // Cargar historial
            await this._cargarHistorial();
            
            // Inicializar cache
            this._inicializarCache();
            
            // Configurar autoguardado
            this._configurarAutoguardado();
            
            // Métricas iniciales
            this._inicializarMetricas();
            
            this.estado.inicializado = true;
            this._log('success', '✅ Asistente IA Avanzado inicializado correctamente');
            
            // Notificación de sistema
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('🤖 Asistente IA listo para ayudarte', 'success');
            }
            
        } catch (error) {
            this._log('error', 'Error al inicializar Asistente IA:', error);
            this._manejarErrorInicializacion(error);
        }
    }

    async _validarDependencias() {
        const dependencias = [
            { nombre: 'financialAI', objeto: window.financialAI },
            { nombre: 'aiUtilities', objeto: window.aiUtilities },
            { nombre: 'utilidades', objeto: window.utilidades },
            { nombre: 'sistemaNotificaciones', objeto: window.sistemaNotificaciones }
        ];

        for (const dep of dependencias) {
            if (!dep.objeto) {
                this._log('warn', `⚠️ Dependencia faltante: ${dep.nombre}`);
            }
        }
    }

    async _cargarConfiguracion() {
        try {
            const configGuardada = localStorage.getItem(`${this.config.cache.prefijoKey}config`);
            if (configGuardada) {
                const config = JSON.parse(configGuardada);
                this.config = { ...this.config, ...config };
            }
        } catch (error) {
            this._log('warn', 'No se pudo cargar configuración guardada');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE INTERFAZ ULTRA MODERNA
    // ═══════════════════════════════════════════════════════════════════════════
    async _crearInterfaz() {
        const interfazHTML = this._generarHTMLInterfaz();
        document.body.insertAdjacentHTML('beforeend', interfazHTML);
        
        // Referencias DOM
        this._mapearElementos();
        
        // Aplicar tema actual
        this._aplicarTema();
        
        // Configurar accesibilidad
        this._configurarAccesibilidad();
        
        // Generar sugerencias iniciales
        this._generarSugerencias();
    }

    _generarHTMLInterfaz() {
        return `
            <!-- BOTÓN FLOTANTE ULTRA PROFESIONAL -->
            <div id="grizalumAIBtn" class="grizalum-ai-btn" 
                 title="Asistente IA GRIZALUM" 
                 aria-label="Abrir Asistente de Inteligencia Artificial"
                 role="button" 
                 tabindex="0">
                <div class="grizalum-ai-icon">
                    <i class="fas fa-brain" aria-hidden="true"></i>
                </div>
                <div class="grizalum-ai-pulse"></div>
                <div id="grizalumAIBadge" class="grizalum-ai-badge" style="display: none;">
                    <span id="grizalumAIBadgeText">1</span>
                </div>
            </div>

            <!-- PANEL PRINCIPAL ULTRA AVANZADO -->
            <div id="grizalumAIPanel" class="grizalum-ai-panel" role="dialog" aria-labelledby="aiPanelTitle">
                
                <!-- HEADER EJECUTIVO -->
                <header class="grizalum-ai-header">
                    <div class="grizalum-ai-avatar">
                        <i class="fas fa-robot" aria-hidden="true"></i>
                        <div class="grizalum-ai-status-dot" id="aiStatusDot"></div>
                    </div>
                    <div class="grizalum-ai-info">
                        <h1 id="aiPanelTitle" class="grizalum-ai-title">GRIZALUM AI EXPERT</h1>
                        <p id="aiStatusText" class="grizalum-ai-status">Listo para optimizar tu negocio</p>
                    </div>
                    <div class="grizalum-ai-controls">
                        <button id="aiHelpBtn" class="grizalum-ai-control-btn" title="Ayuda y comandos" aria-label="Mostrar ayuda">
                            <i class="fas fa-question-circle"></i>
                        </button>
                        <button id="aiNewChatBtn" class="grizalum-ai-control-btn" title="Nueva conversación" aria-label="Iniciar nueva conversación">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button id="aiExportBtn" class="grizalum-ai-control-btn" title="Exportar chat" aria-label="Exportar conversación">
                            <i class="fas fa-download"></i>
                        </button>
                        <button id="aiSettingsBtn" class="grizalum-ai-control-btn" title="Configuración" aria-label="Configuración del asistente">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button id="aiCloseBtn" class="grizalum-ai-control-btn" title="Cerrar panel" aria-label="Cerrar asistente">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </header>

                <!-- SUGERENCIAS INTELIGENTES -->
                <section class="grizalum-ai-suggestions" id="aiSuggestions">
                    <h2 class="grizalum-ai-suggestions-title">💡 Sugerencias inteligentes</h2>
                    <div class="grizalum-ai-suggestions-grid" id="aiSuggestionsGrid">
                        <!-- Generado dinámicamente -->
                    </div>
                </section>

                <!-- ÁREA DE CONVERSACIÓN -->
                <main class="grizalum-ai-chat-container">
                    <div class="grizalum-ai-messages" id="aiMessages" role="log" aria-live="polite" aria-label="Conversación con el asistente">
                        <!-- Mensaje de bienvenida -->
                        <div class="grizalum-ai-message-wrapper">
                            <div class="grizalum-ai-message ai-message">
                                <div class="grizalum-ai-message-avatar">
                                    <i class="fas fa-robot"></i>
                                </div>
                                <div class="grizalum-ai-message-content">
                                    <div class="grizalum-ai-message-header">
                                        <strong>GRIZALUM AI Expert</strong>
                                        <time class="grizalum-ai-timestamp">${this._formatearHora(new Date())}</time>
                                    </div>
                                    <div class="grizalum-ai-message-text">
                                        ${this._generarMensajeBienvenida()}
                                    </div>
                                    <div class="grizalum-ai-quick-actions">
                                        <button class="grizalum-ai-quick-btn" data-action="analizar-flujo">
                                            💧 Analizar Flujo de Caja
                                        </button>
                                        <button class="grizalum-ai-quick-btn" data-action="estrategia-crecimiento">
                                            🚀 Estrategia de Crecimiento
                                        </button>
                                        <button class="grizalum-ai-quick-btn" data-action="optimizar-costos">
                                            💰 Optimizar Costos
                                        </button>
                                        <button class="grizalum-ai-quick-btn" data-action="cumplimiento-legal">
                                            ⚖️ Cumplimiento Legal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- INDICADOR DE ESCRITURA -->
                    <div class="grizalum-ai-typing" id="aiTyping" style="display: none;">
                        <div class="grizalum-ai-message ai-message">
                            <div class="grizalum-ai-message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="grizalum-ai-typing-content">
                                <div class="grizalum-ai-thinking">
                                    <div class="grizalum-ai-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <span id="aiThinkingText" class="grizalum-ai-thinking-text">Analizando tu consulta...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- INPUT INTELIGENTE -->
                <footer class="grizalum-ai-input-section">
                    <div class="grizalum-ai-input-container">
                        <div class="grizalum-ai-input-wrapper">
                            <textarea 
                                id="aiInput" 
                                class="grizalum-ai-input"
                                placeholder="Pregúntame sobre finanzas, estrategia, legal, operaciones..."
                                rows="1"
                                maxlength="1000"
                                aria-label="Escribe tu consulta al asistente IA"
                                autocomplete="off"
                                spellcheck="true"></textarea>
                            
                            <div class="grizalum-ai-input-actions">
                                <button id="aiVoiceBtn" class="grizalum-ai-input-btn voice-btn" title="Dictado por voz" aria-label="Activar dictado por voz">
                                    <i class="fas fa-microphone"></i>
                                </button>
                                <button id="aiSendBtn" class="grizalum-ai-input-btn send-btn" title="Enviar mensaje" aria-label="Enviar mensaje">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="grizalum-ai-input-footer">
                            <div class="grizalum-ai-input-hint">
                                <i class="fas fa-lightbulb"></i>
                                <span>Tip: Sé específico para obtener respuestas más precisas</span>
                            </div>
                            <div class="grizalum-ai-input-stats">
                                <span id="aiCharCount">0/1000</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <!-- MODAL DE CONFIGURACIÓN -->
            <div id="aiSettingsModal" class="grizalum-ai-modal" style="display: none;">
                <div class="grizalum-ai-modal-content">
                    <header class="grizalum-ai-modal-header">
                        <h2>⚙️ Configuración del Asistente IA</h2>
                        <button id="closeSettingsModal" class="grizalum-ai-modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </header>
                    <div class="grizalum-ai-modal-body">
                        <div class="grizalum-ai-settings-section">
                            <h3>🎨 Apariencia</h3>
                            <label class="grizalum-ai-switch">
                                <input type="checkbox" id="aiDarkMode">
                                <span class="grizalum-ai-slider"></span>
                                Modo Oscuro
                            </label>
                            <label class="grizalum-ai-switch">
                                <input type="checkbox" id="aiAnimations" checked>
                                <span class="grizalum-ai-slider"></span>
                                Animaciones
                            </label>
                        </div>
                        <div class="grizalum-ai-settings-section">
                            <h3>🔔 Notificaciones</h3>
                            <label class="grizalum-ai-switch">
                                <input type="checkbox" id="aiNotifications" checked>
                                <span class="grizalum-ai-slider"></span>
                                Notificaciones push
                            </label>
                            <label class="grizalum-ai-switch">
                                <input type="checkbox" id="aiSounds">
                                <span class="grizalum-ai-slider"></span>
                                Sonidos
                            </label>
                        </div>
                        <div class="grizalum-ai-settings-section">
                            <h3>🤖 Comportamiento de IA</h3>
                            <label>
                                Velocidad de respuesta:
                                <select id="aiResponseSpeed">
                                    <option value="fast">Rápida</option>
                                    <option value="normal" selected>Normal</option>
                                    <option value="detailed">Detallada</option>
                                </select>
                            </label>
                            <label>
                                Nivel de detalle:
                                <select id="aiDetailLevel">
                                    <option value="basic">Básico</option>
                                    <option value="intermediate" selected>Intermedio</option>
                                    <option value="expert">Experto</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _generarMensajeBienvenida() {
        return `
            <div class="grizalum-ai-welcome">
                <h3>¡Hola! Soy tu Asistente IA Empresarial 🚀</h3>
                <p>Especializado en <strong>gestión empresarial peruana</strong> con capacidades avanzadas de análisis financiero, estrategia y cumplimiento legal.</p>
                
                <div class="grizalum-ai-capabilities">
                    <div class="capability-card">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <strong>Análisis Financiero</strong>
                            <p>Flujo de caja, ratios, KPIs, proyecciones</p>
                        </div>
                    </div>
                    <div class="capability-card">
                        <i class="fas fa-rocket"></i>
                        <div>
                            <strong>Estrategia</strong>
                            <p>Crecimiento, expansión, competitividad</p>
                        </div>
                    </div>
                    <div class="capability-card">
                        <i class="fas fa-balance-scale"></i>
                        <div>
                            <strong>Legal Perú</strong>
                            <p>SUNAT, laboral, tributario, normativas</p>
                        </div>
                    </div>
                    <div class="capability-card">
                        <i class="fas fa-cogs"></i>
                        <div>
                            <strong>Operaciones</strong>
                            <p>Procesos, eficiencia, optimización</p>
                        </div>
                    </div>
                </div>
                
                <p class="grizalum-ai-welcome-footer">
                    <i class="fas fa-magic"></i>
                    Conectado con el sistema de IA predictiva de GRIZALUM para brindarte insights precisos
                </p>
            </div>
        `;
    }

    _mapearElementos() {
        this.elementos = {
            // Elementos principales
            boton: document.getElementById('grizalumAIBtn'),
            panel: document.getElementById('grizalumAIPanel'),
            mensajes: document.getElementById('aiMessages'),
            input: document.getElementById('aiInput'),
            typing: document.getElementById('aiTyping'),
            
            // Controles
            btnEnviar: document.getElementById('aiSendBtn'),
            btnVoz: document.getElementById('aiVoiceBtn'),
            btnCerrar: document.getElementById('aiCloseBtn'),
            btnNuevo: document.getElementById('aiNewChatBtn'),
            btnAyuda: document.getElementById('aiHelpBtn'),
            btnExportar: document.getElementById('aiExportBtn'),
            btnConfiguracion: document.getElementById('aiSettingsBtn'),
            
            // Estados
            statusDot: document.getElementById('aiStatusDot'),
            statusText: document.getElementById('aiStatusText'),
            badge: document.getElementById('grizalumAIBadge'),
            
            // Sugerencias
            sugerencias: document.getElementById('aiSuggestions'),
            sugGrid: document.getElementById('aiSuggestionsGrid'),
            
            // Modal
            modal: document.getElementById('aiSettingsModal'),
            btnCerrarModal: document.getElementById('closeSettingsModal')
        };
    }

    _aplicarTema() {
        if (typeof gestorTemas !== 'undefined' && gestorTemas.temaActual) {
            const tema = gestorTemas.temaActual;
            this.elementos.panel?.setAttribute('data-theme', tema.id);
        }
    }

    _configurarAccesibilidad() {
        // Configurar navegación por teclado
        this.elementos.boton?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Configurar ARIA labels dinámicos
        this._actualizarAriaLabels();
    }

    _actualizarAriaLabels() {
        const estadoPanel = this.estado.panelVisible ? 'abierto' : 'cerrado';
        this.elementos.boton?.setAttribute('aria-expanded', this.estado.panelVisible.toString());
        this.elementos.boton?.setAttribute('aria-label', `Asistente IA ${estadoPanel}`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE EVENTOS ULTRA INTELIGENTE
    // ═══════════════════════════════════════════════════════════════════════════
    _vincularEventos() {
        // Evento principal del botón
        this.elementos.boton?.addEventListener('click', () => this.toggle());
        
        // Controles del panel
        this.elementos.btnCerrar?.addEventListener('click', () => this.cerrar());
        this.elementos.btnNuevo?.addEventListener('click', () => this.nuevaConversacion());
        this.elementos.btnAyuda?.addEventListener('click', () => this.mostrarAyuda());
        this.elementos.btnExportar?.addEventListener('click', () => this.exportarConversacion());
        this.elementos.btnConfiguracion?.addEventListener('click', () => this.abrirConfiguracion());
        
        // Input de chat
        this.elementos.input?.addEventListener('keydown', (e) => this._manejarTeclas(e));
        this.elementos.input?.addEventListener('input', (e) => this._manejarInput(e));
        this.elementos.btnEnviar?.addEventListener('click', () => this.enviarMensaje());
        this.elementos.btnVoz?.addEventListener('click', () => this.alternarVoz());
        
        // Acciones rápidas
        this.elementos.mensajes?.addEventListener('click', (e) => {
            if (e.target.classList.contains('grizalum-ai-quick-btn')) {
                this._ejecutarAccionRapida(e.target.dataset.action);
            }
        });
        
        // Sugerencias
        this.elementos.sugGrid?.addEventListener('click', (e) => {
            if (e.target.classList.contains('grizalum-ai-suggestion-chip')) {
                this._ejecutarSugerencia(e.target.textContent.trim());
            }
        });
        
        // Modal de configuración
        this.elementos.btnCerrarModal?.addEventListener('click', () => this.cerrarConfiguracion());
        this.elementos.modal?.addEventListener('click', (e) => {
            if (e.target === this.elementos.modal) {
                this.cerrarConfiguracion();
            }
        });
        
        // Eventos de sistema
        window.addEventListener('resize', () => this._manejarResize());
        window.addEventListener('beforeunload', () => this._guardarEstado());
        
        // Eventos de temas (si existe el gestor)
        if (typeof gestorTemas !== 'undefined') {
            document.addEventListener('temaActualizado', (e) => {
                this._aplicarTema();
            });
        }
        
        this._log('info', '🔗 Eventos vinculados correctamente');
    }

    _manejarTeclas(evento) {
        const tecla = evento.key;
        const esCtrl = evento.ctrlKey || evento.metaKey;
        
        switch (tecla) {
            case 'Enter':
                if (!evento.shiftKey) {
                    evento.preventDefault();
                    this.enviarMensaje();
                }
                break;
                
            case 'Escape':
                this.cerrar();
                break;
                
            case 'n':
                if (esCtrl) {
                    evento.preventDefault();
                    this.nuevaConversacion();
                }
                break;
                
            case 's':
                if (esCtrl) {
                    evento.preventDefault();
                    this.exportarConversacion();
                }
                break;
        }
    }

    _manejarInput(evento) {
        const texto = evento.target.value;
        const longitud = texto.length;
        
        // Actualizar contador de caracteres
        const contador = document.getElementById('aiCharCount');
        if (contador) {
            contador.textContent = `${longitud}/1000`;
            contador.className = longitud > 900 ? 'warning' : '';
        }
        
        // Auto-resize del textarea
        this._ajustarAlturaInput(evento.target);
        
        // Detectar intención (typing indicators)
        this._detectarIntencion(texto);
    }

    _ajustarAlturaInput(input) {
        input.style.height = 'auto';
        const nuevaAltura = Math.min(input.scrollHeight, this.config.ui.maxAlturaMensaje);
        input.style.height = nuevaAltura + 'px';
    }

    _detectarIntencion(texto) {
        // Analizar palabras clave para mostrar sugerencias contextuales
        const palabrasClave = {
            financiero: ['dinero', 'flujo', 'caja', 'ganancia', 'perdida', 'ingresos'],
            legal: ['sunat', 'impuesto', 'tributo', 'legal', 'norma', 'ley'],
            estrategia: ['crecer', 'expandir', 'competencia', 'mercado', 'strategy']
        };
        
        const textoLower = texto.toLowerCase();
        for (const [categoria, palabras] of Object.entries(palabrasClave)) {
            if (palabras.some(palabra => textoLower.includes(palabra))) {
                this._mostrarSugerenciasContextuales(categoria);
                break;
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MOTOR DE INTELIGENCIA ARTIFICIAL INTEGRADO
    // ═══════════════════════════════════════════════════════════════════════════
    async enviarMensaje(mensajeTexto = null) {
        try {
            const mensaje = mensajeTexto || this.elementos.input?.value?.trim();
            
            if (!mensaje || this.estado.escribiendo) {
                return;
            }
            
            // Validaciones
            if (!this._validarMensaje(mensaje)) {
                return;
            }
            
            // Limpiar input
            if (this.elementos.input && !mensajeTexto) {
                this.elementos.input.value = '';
                this._ajustarAlturaInput(this.elementos.input);
            }
            
            // Agregar mensaje del usuario
            this._agregarMensajeUsuario(mensaje);
            
            // Mostrar indicador de escritura
            this._mostrarEscribiendo();
            
            // Analizar contexto
            const contexto = this._analizarContexto(mensaje);
            
            // Registrar métrica
            this._registrarInteraccion('mensaje_enviado', { mensaje, contexto });
            
            // Generar respuesta inteligente
            const respuesta = await this._generarRespuestaIA(mensaje, contexto);
            
            // Ocultar indicador
            this._ocultarEscribiendo();
            
            // Agregar respuesta de IA
            this._agregarMensajeIA(respuesta);
            
            // Actualizar sugerencias
            this._actualizarSugerencias(contexto);
            
            // Guardar conversación
            this._guardarConversacion();
            
        } catch (error) {
            this._log('error', 'Error al enviar mensaje:', error);
            this._manejarErrorEnvio(error);
        }
    }

    _validarMensaje(mensaje) {
        if (mensaje.length > 1000) {
            this._mostrarNotificacion('Mensaje muy largo. Máximo 1000 caracteres.', 'warning');
            return false;
        }
        
        if (mensaje.length < 3) {
            this._mostrarNotificacion('Mensaje muy corto. Mínimo 3 caracteres.', 'warning');
            return false;
        }
        
        return true;
    }

    _analizarContexto(mensaje) {
        const mensajeLower = mensaje.toLowerCase();
        
        // Detectar intención principal
        const intenciones = {
            financiero: ['flujo', 'caja', 'dinero', 'ganancia', 'perdida', 'rentabilidad', 'kpi'],
            legal: ['sunat', 'impuesto', 'tributo', 'ley', 'norma', 'legal', 'obligacion'],
            estrategia: ['crecer', 'expandir', 'competencia', 'mercado', 'estrategia', 'plan'],
            operaciones: ['proceso', 'eficiencia', 'productividad', 'operacion', 'mejora'],
            rrhh: ['empleado', 'personal', 'planilla', 'contrato', 'capacitacion']
        };
        
        let intencionPrincipal = 'general';
        let confianza = 0;
        
        for (const [categoria, palabras] of Object.entries(intenciones)) {
            const coincidencias = palabras.filter(palabra => mensajeLower.includes(palabra)).length;
            const porcentaje = coincidencias / palabras.length;
            
            if (porcentaje > confianza) {
                confianza = porcentaje;
                intencionPrincipal = categoria;
            }
        }
        
        return {
            intencion: intencionPrincipal,
            confianza: confianza,
            urgencia: this._detectarUrgencia(mensaje),
            complejidad: this._calcularComplejidad(mensaje),
            entidades: this._extraerEntidades(mensaje)
        };
    }

    _detectarUrgencia(mensaje) {
        const palabrasUrgencia = ['urgente', 'crisis', 'problema', 'ayuda', 'inmediato', 'rapido'];
        return palabrasUrgencia.some(palabra => mensaje.toLowerCase().includes(palabra)) ? 'alta' : 'normal';
    }

    _calcularComplejidad(mensaje) {
        const longitud = mensaje.length;
        const palabras = mensaje.split(' ').length;
        const preguntasMultiples = (mensaje.match(/\?/g) || []).length > 1;
        
        if (longitud > 200 || palabras > 30 || preguntasMultiples) return 'alta';
        if (longitud > 100 || palabras > 15) return 'media';
        return 'baja';
    }

    _extraerEntidades(mensaje) {
        const entidades = {};
        
        // Extraer números (montos, porcentajes)
        const numeros = mensaje.match(/\d+(?:[.,]\d+)?/g);
        if (numeros) entidades.numeros = numeros;
        
        // Extraer fechas
        const fechas = mensaje.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{1,2}-\d{1,2}/g);
        if (fechas) entidades.fechas = fechas;
        
        return entidades;
    }

    async _generarRespuestaIA(mensaje, contexto) {
        try {
            // Usar el sistema de IA existente de GRIZALUM
            if (window.financialAI && window.aiUtilities) {
                return await this._usarSistemaIAIntegrado(mensaje, contexto);
            }
            
            // Fallback a sistema interno
            return await this._generarRespuestaInterna(mensaje, contexto);
            
        } catch (error) {
            this._log('error', 'Error generando respuesta IA:', error);
            return this._generarRespuestaError();
        }
    }

    async _usarSistemaIAIntegrado(mensaje, contexto) {
        const { intencion, complejidad, urgencia } = contexto;
        
        // Simular tiempo de procesamiento realista
        const tiempoBase = complejidad === 'alta' ? 2000 : complejidad === 'media' ? 1500 : 1000;
        const tiempoAleatorio = Math.random() * 1000;
        await this._delay(tiempoBase + tiempoAleatorio);
        
        // Obtener datos del sistema
        const datosEmpresa = this._obtenerDatosEmpresa();
        
        switch (intencion) {
            case 'financiero':
                return this._generarAnalisisFinanciero(mensaje, datosEmpresa);
                
            case 'legal':
                return this._generarAsesoriaLegal(mensaje);
                
            case 'estrategia':
                return this._generarEstrategiaEmpresarial(mensaje, datosEmpresa);
                
            case 'operaciones':
                return this._generarConsultoriaOperacional(mensaje);
                
            case 'rrhh':
                return this._generarAsesoriaRRHH(mensaje);
                
            default:
                return this._generarRespuestaGeneral(mensaje, contexto);
        }
    }

    _obtenerDatosEmpresa() {
        // Integrar con el sistema financiero existente
        if (window.aiUtilities) {
            try {
                return window.aiUtilities.getRealTimeInsights();
            } catch (error) {
                this._log('warn', 'No se pudieron obtener datos reales, usando datos de ejemplo');
            }
        }
        
        // Datos de ejemplo mejorados
        return {
            cashFlow: [18500, 22000, 24500, 21800, 26500, 23800, 28500],
            revenue: [42000, 46000, 48000, 44000, 51000, 47300, 53200],
            expenses: [31500, 33000, 31000, 32200, 34500, 33200, 31700],
            employees: 8,
            sector: 'Servicios',
            ubicacion: 'Lima, Perú'
        };
    }

    _generarAnalisisFinanciero(mensaje, datos) {
        const { cashFlow, revenue, expenses } = datos;
        const cashFlowActual = cashFlow[cashFlow.length - 1];
        const ingresoActual = revenue[revenue.length - 1];
        const gastoActual = expenses[expenses.length - 1];
        const margenNeto = ((ingresoActual - gastoActual) / ingresoActual * 100).toFixed(1);
        
        return `💰 **ANÁLISIS FINANCIERO INTELIGENTE**

**📊 SITUACIÓN ACTUAL:**
- **Flujo de caja**: S/. ${cashFlowActual.toLocaleString()}
- **Ingresos**: S/. ${ingresoActual.toLocaleString()}  
- **Gastos**: S/. ${gastoActual.toLocaleString()}
- **Margen neto**: ${margenNeto}% ${this._clasificarMargen(parseFloat(margenNeto))}

**🎯 DIAGNÓSTICO INTELIGENTE:**
${this._generarDiagnosticoFinanciero(cashFlowActual, parseFloat(margenNeto))}

**🚀 RECOMENDACIONES PRIORITARIAS:**

**1. ACCIÓN INMEDIATA (0-30 días):**
${this._generarRecomendacionesInmediatas(datos)}

**2. ESTRATEGIA MEDIANO PLAZO (1-3 meses):**
${this._generarEstrategiaMedioPlazo(datos)}

**📈 PROYECCIÓN INTELIGENTE:**
Basado en tendencias actuales, proyección próximo trimestre: S/. ${Math.floor(cashFlowActual * 1.15).toLocaleString()}

${this._generarMetricasAdicionales(datos)}

¿Te gustaría que profundice en algún aspecto específico del análisis?`;
    }

    _clasificarMargen(margen) {
        if (margen > 20) return '🟢 Excelente';
        if (margen > 15) return '🟡 Bueno';
        if (margen > 10) return '🟠 Regular';
        return '🔴 Necesita atención';
    }

    _generarDiagnosticoFinanciero(cashFlow, margen) {
        if (cashFlow > 25000 && margen > 15) {
            return `✅ **Situación financiera sólida**: Tu empresa muestra indicadores saludables con capacidad para inversiones estratégicas y expansión.`;
        } else if (cashFlow > 20000 || margen > 10) {
            return `⚠️ **Situación estable con oportunidades**: Hay potencial de mejora en eficiencia operativa y optimización de márgenes.`;
        } else {
            return `🚨 **Situación requiere atención**: Es prioritario optimizar flujo de caja y revisar estructura de costos.`;
        }
    }

    _generarRecomendacionesInmediatas(datos) {
        const recomendaciones = [
            '• Implementar política de cobranza más agresiva (reducir días de cobro)',
            '• Revisar y renegociar contratos de servicios recurrentes',
            '• Establecer control diario de gastos operativos'
        ];
        
        if (datos.cashFlow[datos.cashFlow.length - 1] < 20000) {
            recomendaciones.push('• Considerar línea de crédito como respaldo de liquidez');
        }
        
        return recomendaciones.join('\n');
    }

    _generarEstrategiaMedioPlazo(datos) {
        return `• Diversificar fuentes de ingresos (2-3 líneas de negocio)
• Implementar sistema de facturación automática
• Optimizar inventarios y ciclo de conversión de efectivo
• Establecer reserva de emergencia (3 meses de gastos)`;
    }

    _generarMetricasAdicionales(datos) {
        const roi = ((datos.revenue[datos.revenue.length - 1] - datos.expenses[datos.expenses.length - 1]) / datos.expenses[datos.expenses.length - 1] * 100).toFixed(1);
        
        return `\n**📊 MÉTRICAS CLAVE:**
- **ROI**: ${roi}%
- **Eficiencia operativa**: ${(100 - (datos.expenses[datos.expenses.length - 1] / datos.revenue[datos.revenue.length - 1] * 100)).toFixed(1)}%
- **Tendencia**: ${this._calcularTendencia(datos.cashFlow)}`;
    }

    _calcularTendencia(datos) {
        const ultimo = datos[datos.length - 1];
        const anterior = datos[datos.length - 2];
        const diferencia = ((ultimo - anterior) / anterior * 100).toFixed(1);
        
        return diferencia > 0 ? `📈 Creciente (+${diferencia}%)` : `📉 Descendente (${diferencia}%)`;
    }

    _generarAsesoriaLegal(mensaje) {
        return `⚖️ **ASESORÍA LEGAL EMPRESARIAL PERÚ**

**📋 MARCO TRIBUTARIO ACTUAL 2025:**

**🏢 OBLIGACIONES PRINCIPALES:**
- **IGV**: 18% mensual (según cronograma SUNAT)
- **Renta**: 29.5% anual (empresas)
- **ESSALUD**: 9% sobre planilla
- **Gratificaciones**: Julio y diciembre + 9% ESSALUD

**📅 FECHAS CRÍTICAS:**
- **Declaraciones mensuales**: Según último dígito RUC
- **Renta anual 2024**: Hasta 31 marzo 2025
- **Libros electrónicos**: Hasta el 10 del mes siguiente

**💡 ESTRATEGIAS DE OPTIMIZACIÓN:**

**1. BENEFICIOS TRIBUTARIOS DISPONIBLES:**
• **Régimen MYPE**: Hasta 1,700 UIT (depreciación acelerada)
• **Gastos de capacitación**: 100% deducibles
• **I+D**: Deducción del 175%
• **Zona selva**: Exoneración 0%-10%

**2. CUMPLIMIENTO PREVENTIVO:**
• Facturación electrónica obligatoria
• Libros electrónicos actualizados
• Bancarización de operaciones >S/. 3,500
• Registro de activos fijos

**⚠️ ALERTAS IMPORTANTES:**
- Nuevas fiscalizaciones SUNAT en servicios digitales
- Modificaciones en detracciones 2025
- Obligatoriedad reporte país por país (>S/. 2,700 millones)

¿Necesitas ayuda con algún aspecto específico del cumplimiento legal?`;
    }

    _generarEstrategiaEmpresarial(mensaje, datos) {
        const industria = datos.sector || 'General';
        
        return `🚀 **ESTRATEGIA DE CRECIMIENTO EMPRESARIAL**

**🎯 ANÁLISIS ESTRATÉGICO PARA ${industria.toUpperCase()}**

**📈 OPORTUNIDADES DE CRECIMIENTO IDENTIFICADAS:**

**1. EXPANSIÓN ORGÁNICA (Riesgo: Bajo)**
• Ampliar líneas de productos/servicios complementarios
• Penetrar nuevos segmentos de mercado existente
• Mejorar propuesta de valor con tecnología
• *Inversión estimada: S/. 15,000 - 40,000*

**2. TRANSFORMACIÓN DIGITAL (Riesgo: Bajo)**
• Presencia online profesional y e-commerce
• Automatización de procesos clave
• CRM para gestión de clientes
• *ROI esperado: 6-12 meses*

**3. EXPANSIÓN GEOGRÁFICA (Riesgo: Medio)**
• Lima Metropolitana (si estás en provincia)
• Ciudades principales: Arequipa, Trujillo, Chiclayo
• Modelo de franquicias o distribuidores
• *ROI proyectado: 18-35% anual*

**💡 PLAN ESTRATÉGICO 90 DÍAS:**

**🎯 MES 1: FUNDACIÓN**
- Análisis profundo de mercado y competencia
- Validación de propuesta de valor mejorada
- Estructura financiera para crecimiento

**🚀 MES 2: IMPLEMENTACIÓN**
- Lanzamiento de iniciativas piloto
- Desarrollo de canales de distribución
- Capacitación intensiva del equipo

**📊 MES 3: ESCALAMIENTO**
- Medición de resultados y ajustes
- Expansión basada en aprendizajes
- Preparación para siguiente fase

**🔥 VENTAJAS COMPETITIVAS A DESARROLLAR:**
${this._generarVentajasCompetitivas(industria)}

¿Quieres que desarrolle alguna estrategia específica en mayor detalle?`;
    }

    _generarVentajasCompetitivas(industria) {
        const ventajas = {
            'Servicios': '• Especialización técnica y certificaciones\n• Atención personalizada y tiempo de respuesta\n• Tecnología y automatización de procesos',
            'Comercio': '• Diferenciación de productos y exclusividad\n• Logística eficiente y entrega rápida\n• Experiencia de compra omnicanal',
            'General': '• Calidad superior y consistencia\n• Innovación constante en productos/servicios\n• Relaciones sólidas con clientes y proveedores'
        };
        
        return ventajas[industria] || ventajas['General'];
    }

    _generarConsultoriaOperacional(mensaje) {
        return `⚙️ **CONSULTORÍA OPERACIONAL INTELIGENTE**

**🎯 DIAGNÓSTICO DE EFICIENCIA OPERATIVA:**

**⏱️ ANÁLISIS DE TIEMPOS Y PROCESOS:**

**TIEMPOS PROMEDIO vs. BENCHMARKS:**
- **Ciclo de ventas**: 15 días → *Óptimo*: 7-10 días
- **Tiempo de entrega**: 5 días → *Óptimo*: 2-3 días  
- **Procesamiento pedidos**: 24 horas → *Óptimo*: 4-6 horas
- **Ciclo de cobranza**: 45 días → *Óptimo*: 30 días

**🚀 ESTRATEGIAS DE OPTIMIZACIÓN:**

**1. AUTOMATIZACIÓN INTELIGENTE (ROI: 300-600%)**
• **CRM integrado**: Gestión completa de clientes
• **ERP básico**: Procesos interconectados
• **Facturación electrónica**: Eficiencia y cumplimiento
• **Control de inventarios**: Stock óptimo automatizado

**2. METODOLOGÍA LEAN (Ahorro: 15-25%)**
• **Eliminación de desperdicios**: 7 tipos de waste
• **5S**: Organización sistemática del workspace
• **Kaizen**: Mejora continua colaborativa
• **Just in Time**: Inventario mínimo eficiente

**💻 STACK TECNOLÓGICO RECOMENDADO:**

**HERRAMIENTAS ESENCIALES (S/. 300-600/mes):**
- **WhatsApp Business API**: Comunicación automatizada
- **Google Workspace**: Colaboración en tiempo real
- **Trello/Monday**: Gestión de proyectos visual
- **QuickBooks/ContaSOL**: Contabilidad integrada

**📊 MÉTRICAS DE RENDIMIENTO:**
- **Productividad por empleado**: +25% en 90 días
- **Reducción de errores**: -40% con automatización
- **Tiempo de respuesta cliente**: -50% con CRM
- **Eficiencia general**: +30% con Lean

**🎯 ROADMAP DE IMPLEMENTACIÓN:**

**SEMANAS 1-4: DIAGNÓSTICO Y DISEÑO**
✅ Mapeo detallado de procesos actuales
✅ Identificación de cuellos de botella
✅ Selección de herramientas tecnológicas

**SEMANAS 5-8: IMPLEMENTACIÓN PILOTO**
✅ Automatización de 2-3 procesos críticos
✅ Capacitación intensiva del equipo
✅ Métricas de seguimiento

**SEMANAS 9-12: ESCALAMIENTO Y OPTIMIZACIÓN**
✅ Expansión a todos los procesos
✅ Ajustes basados en datos
✅ Cultura de mejora continua

¿Te interesa que profundice en alguna área operacional específica?`;
    }

    _generarAsesoriaRRHH(mensaje) {
        return `👥 **CONSULTORÍA DE RECURSOS HUMANOS ESTRATÉGICA**

**📋 MARCO LEGAL LABORAL PERÚ 2025:**

**💰 ESTRUCTURA SALARIAL OBLIGATORIA:**

**CONCEPTOS MENSUALES:**
- **Sueldo mínimo**: S/. 1,025 (2025)
- **ESSALUD**: 9% sobre bruto (empleador)
- **AFP/ONP**: 10-13% sobre bruto (trabajador)
- **SCTR**: Según actividad de riesgo

**BENEFICIOS SEMESTRALES:**
- **Gratificaciones**: Julio y diciembre (equivalente a 1 sueldo + 9% ESSALUD)
- **CTS**: Mayo y noviembre (1/2 sueldo anual depositado)

**BENEFICIOS ANUALES:**
- **Vacaciones**: 30 días calendario remunerados
- **Utilidades**: 10% utilidades antes de impuestos (empresas 20+ trabajadores)

**🎯 ESTRATEGIAS DE GESTIÓN HUMANA:**

**1. ESTRUCTURA ORGANIZACIONAL ÓPTIMA:**
• **Planilla fija**: 60-70% (roles core del negocio)
• **Servicios terceros**: 20-30% (funciones de apoyo)
• **Freelancers**: 10-20% (proyectos específicos)
• *Ahorro potencial: 20-35% en costos laborales*

**2. DESARROLLO Y RETENCIÓN:**
• **Capacitación continua**: 2-3% de planilla anual
• **Incentivos por performance**: 5-15% sobre sueldo base
• **Beneficios flexibles**: Seguro médico, tiempo flexible
• *ROI en retención: 300-500%*

**💡 CÁLCULO REAL DE COSTOS POR EMPLEADO:**

**EJEMPLO: EMPLEADO S/. 3,000 BRUTO MENSUAL**
- Sueldo bruto mensual: S/. 3,000
- ESSALUD (9%): S/. 270
- Gratificaciones (prorrateadas): S/. 270
- CTS (prorrateada): S/. 250
- Vacaciones (prorrateadas): S/. 250
- **COSTO TOTAL REAL**: S/. 4,040/mes

**📊 INDICADORES DE GESTIÓN HUMANA:**
- **Rotación objetivo**: < 15% anual
- **Ausentismo objetivo**: < 3%
- **Satisfacción laboral**: > 80%
- **Productividad por empleado**: Medición mensual

**🚀 PLAN DE OPTIMIZACIÓN RRHH:**

**FASE 1 (30 días): DIAGNÓSTICO**
✅ Evaluación de estructura actual
✅ Análisis de costos reales vs. productividad
✅ Identificación de gaps de talento

**FASE 2 (60 días): REESTRUCTURACIÓN**
✅ Optimización de planilla y tercerización
✅ Implementación de políticas claras
✅ Sistema de evaluación de desempeño

**FASE 3 (90 días): DESARROLLO**
✅ Programa de capacitación estructurado
✅ Sistema de incentivos por objetivos
✅ Cultura organizacional sólida

¿Necesitas ayuda con algún aspecto específico de gestión humana o planilla?`;
    }

    _generarRespuestaGeneral(mensaje, contexto) {
        return `🤔 **Análisis de tu consulta**: "${mensaje}"

Como tu experto en gestión empresarial, analizo que tu pregunta aborda aspectos importantes del negocio que requieren una respuesta personalizada.

**🎯 PUEDO AYUDARTE ESPECÍFICAMENTE CON:**

**📊 ANÁLISIS FINANCIERO AVANZADO**
• Flujo de caja y proyecciones de liquidez
• Ratios financieros y KPIs empresariales  
• Análisis de rentabilidad y márgenes
• Estrategias de financiamiento

**⚖️ CUMPLIMIENTO LEGAL PERÚ**
• Obligaciones SUNAT y cronograma tributario
• Normativa laboral y planilla de pagos
• Regulaciones sectoriales específicas
• Optimización tributaria legal

**🚀 ESTRATEGIA Y CRECIMIENTO**
• Planes de expansión y nuevos mercados
• Análisis competitivo y posicionamiento
• Transformación digital y tecnología
• Alianzas estratégicas

**⚙️ OPTIMIZACIÓN OPERACIONAL**
• Mejora de procesos y eficiencia
• Reducción de costos operativos
• Automatización y herramientas digitales
• Gestión de inventarios y logística

**👥 GESTIÓN DE TALENTO**
• Estructura organizacional óptima
• Políticas de RRHH y compensaciones
• Desarrollo de competencias
• Clima laboral y productividad

**💡 PARA DARTE LA MEJOR RESPUESTA, COMPÁRTEME:**
- ¿Cuál es el tamaño aproximado de tu empresa?
- ¿En qué sector o industria opera?
- ¿Cuál es tu principal desafío actual?
- ¿Qué objetivo específico buscas lograr?

**🎯 MIENTRAS TANTO, AQUÍ TIENES RECOMENDACIONES GENERALES:**

✅ **Mantén control financiero diario** con dashboards en tiempo real
✅ **Invierte en tecnología básica** que automatice tareas repetitivas  
✅ **Capacita constantemente a tu equipo** en nuevas competencias
✅ **Comunícate regularmente con clientes** para anticipar necesidades
✅ **Cumple proactivamente las obligaciones legales** para evitar sanciones

¿Puedes ser más específico para brindarte una respuesta detallada y accionable?`;
    }

    _generarRespuestaError() {
        return `❌ **Lo siento, hubo un problema técnico**

No pude procesar tu consulta en este momento, pero estoy aquí para ayudarte.

**🔧 PUEDES INTENTAR:**
• Reformular tu pregunta de manera más específica
• Verificar que incluyes el contexto necesario
• Usar las sugerencias rápidas disponibles

**🆘 O CONTÁCTAME DIRECTAMENTE:**
• Usa los botones de acción rápida
• Selecciona una sugerencia del panel
• Reinicia la conversación si persiste el problema

¡Tu éxito empresarial es mi prioridad! 🚀`;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE MENSAJES Y UI
    // ═══════════════════════════════════════════════════════════════════════════
    _agregarMensajeUsuario(mensaje) {
        const mensajeHTML = `
            <div class="grizalum-ai-message-wrapper usuario">
                <div class="grizalum-ai-message user-message">
                    <div class="grizalum-ai-message-content">
                        <div class="grizalum-ai-message-text">${this._escaparHTML(mensaje)}</div>
                    </div>
                    <div class="grizalum-ai-message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
            </div>
        `;
        
        this.elementos.mensajes?.insertAdjacentHTML('beforeend', mensajeHTML);
        this._scrollToBottom();
        
        // Registrar en historial
        this._agregarAlHistorial('user', mensaje);
    }

    _agregarMensajeIA(respuesta) {
        const mensajeHTML = `
            <div class="grizalum-ai-message-wrapper ia">
                <div class="grizalum-ai-message ai-message">
                    <div class="grizalum-ai-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="grizalum-ai-message-content">
                        <div class="grizalum-ai-message-header">
                            <strong>GRIZALUM AI Expert</strong>
                            <time class="grizalum-ai-timestamp">${this._formatearHora(new Date())}</time>
                        </div>
                        <div class="grizalum-ai-message-text">${this._formatearRespuestaIA(respuesta)}</div>
                        <div class="grizalum-ai-message-actions">
                            <button class="grizalum-ai-action-btn" data-action="copiar" title="Copiar respuesta">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="grizalum-ai-action-btn" data-action="like" title="Me gusta">
                                <i class="far fa-thumbs-up"></i>
                            </button>
                            <button class="grizalum-ai-action-btn" data-action="dislike" title="No me gusta">
                                <i class="far fa-thumbs-down"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.elementos.mensajes?.insertAdjacentHTML('beforeend', mensajeHTML);
        this._scrollToBottom();
        
        // Registrar en historial
        this._agregarAlHistorial('assistant', respuesta);
        
        // Animar entrada
        this._animarMensaje();
    }

    _mostrarEscribiendo() {
        this.estado.escribiendo = true;
        
        // Textos de carga dinámicos
        const textosEscribiendo = [
            'Analizando tu consulta empresarial...',
            'Consultando base de datos financiera...',
            'Generando insights personalizados...',
            'Procesando métricas y KPIs...',
            'Preparando recomendaciones...'
        ];
        
        const textoAleatorio = textosEscribiendo[Math.floor(Math.random() * textosEscribiendo.length)];
        
        const thinkingText = document.getElementById('aiThinkingText');
        if (thinkingText) {
            thinkingText.textContent = textoAleatorio;
        }
        
        this.elementos.typing?.style.setProperty('display', 'block');
        this._scrollToBottom();
        
        // Actualizar estado visual
        this._actualizarEstadoVisual('thinking');
    }

    _ocultarEscribiendo() {
        this.estado.escribiendo = false;
        this.elementos.typing?.style.setProperty('display', 'none');
        this._actualizarEstadoVisual('ready');
    }

    _actualizarEstadoVisual(estado) {
        const statusDot = this.elementos.statusDot;
        const statusText = this.elementos.statusText;
        
        if (!statusDot || !statusText) return;
        
        statusDot.className = 'grizalum-ai-status-dot';
        
        switch (estado) {
            case 'thinking':
                statusDot.classList.add('thinking');
                statusText.textContent = 'Procesando consulta...';
                break;
                
            case 'ready':
                statusDot.classList.add('ready');
                statusText.textContent = 'Listo para optimizar tu negocio';
                break;
                
            case 'error':
                statusDot.classList.add('error');
                statusText.textContent = 'Error - Intenta nuevamente';
                break;
        }
    }

    _scrollToBottom() {
        if (this.elementos.mensajes) {
            this.elementos.mensajes.scrollTop = this.elementos.mensajes.scrollHeight;
        }
    }

    _animarMensaje() {
        const ultimoMensaje = this.elementos.mensajes?.lastElementChild;
        if (ultimoMensaje) {
            ultimoMensaje.style.opacity = '0';
            ultimoMensaje.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                ultimoMensaje.style.transition = 'all 0.3s ease';
                ultimoMensaje.style.opacity = '1';
                ultimoMensaje.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILIDADES Y FORMATEO
    // ═══════════════════════════════════════════════════════════════════════════
    _formatearRespuestaIA(respuesta) {
        return respuesta
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '&bull;')
            .replace(/✅/g, '<span class="check-icon">✅</span>')
            .replace(/⚠️/g, '<span class="warning-icon">⚠️</span>')
            .replace(/🚀/g, '<span class="rocket-icon">🚀</span>');
    }

    _formatearHora(fecha) {
        return fecha.toLocaleTimeString('es-PE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    _escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE PERSISTENCIA Y CACHE
    // ═══════════════════════════════════════════════════════════════════════════
    _agregarAlHistorial(rol, contenido) {
        const entrada = {
            rol,
            contenido,
            timestamp: Date.now(),
            id: this._generarId()
        };
        
        this.historialGlobal.push(entrada);
        this.analytics.mensajesEnviados += rol === 'user' ? 1 : 0;
        this.analytics.mensajesRecibidos += rol === 'assistant' ? 1 : 0;
    }

    async _cargarHistorial() {
        try {
            const historialGuardado = localStorage.getItem(`${this.config.cache.prefijoKey}historial`);
            if (historialGuardado) {
                this.historialGlobal = JSON.parse(historialGuardado);
                this._restaurarConversacion();
            }
        } catch (error) {
            this._log('warn', 'Error cargando historial:', error);
        }
    }

    _guardarConversacion() {
        try {
            localStorage.setItem(
                `${this.config.cache.prefijoKey}historial`, 
                JSON.stringify(this.historialGlobal)
            );
            
            // Guardar métricas
            this._guardarMetricas();
            
        } catch (error) {
            this._log('warn', 'Error guardando conversación:', error);
        }
    }

    _inicializarCache() {
        // Limpiar cache antiguo
        this._limpiarCacheAntiguo();
        
        // Configurar limpieza automática
        setInterval(() => {
            this._limpiarCacheAntiguo();
        }, this.config.cache.tiempoVida);
    }

    _limpiarCacheAntiguo() {
        const ahora = Date.now();
        const expirado = ahora - this.config.cache.tiempoVida;
        
        for (const [key, entry] of this.cache.entries()) {
            if (entry.timestamp < expirado) {
                this.cache.delete(key);
            }
        }
    }

    _configurarAutoguardado() {
        setInterval(() => {
            this._guardarEstado();
        }, this.config.chat.intervaloAutoguardado);
    }

    _guardarEstado() {
        try {
            const estado = {
                historial: this.historialGlobal,
                metricas: this.analytics,
                configuracion: this.config,
                timestamp: Date.now()
            };
            
            localStorage.setItem(`${this.config.cache.prefijoKey}estado`, JSON.stringify(estado));
        } catch (error) {
            this._log('warn', 'Error guardando estado:', error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // API PÚBLICA PROFESIONAL
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Abre o cierra el panel del asistente
     */
    toggle() {
        if (this.estado.panelVisible) {
            this.cerrar();
        } else {
            this.abrir();
        }
    }

    /**
     * Abre el panel del asistente
     */
    abrir() {
        if (!this.estado.inicializado) {
            this._log('warn', 'Asistente no inicializado');
            return;
        }
        
        this.estado.panelVisible = true;
        this.elementos.panel?.classList.add('show');
        this._actualizarAriaLabels();
        
        // Focus en input
        setTimeout(() => {
            this.elementos.input?.focus();
        }, this.config.ui.animacionDuracion);
        
        // Registrar métrica
        this._registrarInteraccion('panel_abierto');
        
        this._log('info', 'Panel del asistente abierto');
    }

    /**
     * Cierra el panel del asistente
     */
    cerrar() {
        this.estado.panelVisible = false;
        this.elementos.panel?.classList.remove('show');
        this._actualizarAriaLabels();
        
        // Registrar métrica
        this._registrarInteraccion('panel_cerrado');
        
        this._log('info', 'Panel del asistente cerrado');
    }

    /**
     * Inicia una nueva conversación
     */
    nuevaConversacion() {
        this.historialGlobal = [];
        this.elementos.mensajes.innerHTML = '';
        
        // Agregar mensaje de bienvenida
        const bienvenida = `
            <div class="grizalum-ai-message-wrapper">
                <div class="grizalum-ai-message ai-message">
                    <div class="grizalum-ai-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="grizalum-ai-message-content">
                        <div class="grizalum-ai-message-header">
                            <strong>GRIZALUM AI Expert</strong>
                            <time class="grizalum-ai-timestamp">${this._formatearHora(new Date())}</time>
                        </div>
                        <div class="grizalum-ai-message-text">
                            ¡Nueva conversación iniciada! 🚀<br><br>
                            Soy tu experto en gestión empresarial. ¿En qué puedo ayudarte a optimizar tu negocio hoy?
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.elementos.mensajes?.insertAdjacentHTML('beforeend', bienvenida);
        this._generarSugerencias();
        this._guardarConversacion();
        
        // Registrar métrica
        this._registrarInteraccion('nueva_conversacion');
        
        this._log('info', 'Nueva conversación iniciada');
    }

    /**
     * Muestra la ayuda del sistema
     */
    mostrarAyuda() {
        const mensajeAyuda = `🆘 **GUÍA COMPLETA - GRIZALUM AI EXPERT**

**🤖 ¿Qué puedo hacer por ti?**

**📊 ANÁLISIS FINANCIERO AVANZADO:**
- "Analiza mi flujo de caja y dame recomendaciones"
- "¿Cómo mejorar la rentabilidad de mi empresa?"
- "Calcula los ratios financieros más importantes"
- "Proyecta mi situación financiera a 6 meses"

**⚖️ ASESORÍA LEGAL Y TRIBUTARIA:**
- "¿Cuáles son mis obligaciones con SUNAT este mes?"
- "¿Cómo optimizar mis impuestos legalmente?"
- "Explícame la normativa laboral para mi empresa"
- "¿Qué beneficios tributarios puedo aprovechar?"

**🚀 ESTRATEGIA EMPRESARIAL:**
- "Dame estrategias para hacer crecer mi empresa"
- "¿Cómo expandir a nuevos mercados en Perú?"
- "Analiza mi competencia y posicionamiento"
- "Plan de transformación digital para mi negocio"

**💰 OPTIMIZACIÓN DE COSTOS:**
- "¿Cómo reducir gastos sin afectar la calidad?"
- "Identifica oportunidades de ahorro en mi empresa"
- "Optimiza mi estructura de costos operativos"
- "Mejora la eficiencia de mis procesos"

**👥 GESTIÓN DE RECURSOS HUMANOS:**
- "¿Cómo estructurar la planilla de mi empresa?"
- "Calcula el costo real de un empleado en Perú"
- "Estrategias para retener el mejor talento"
- "¿Qué beneficios laborales debo ofrecer?"

**💡 CONSEJOS PARA CONSULTAS EFECTIVAS:**

✅ **Sé específico con el contexto:**
"Tengo una empresa de servicios con 10 empleados en Lima..."

✅ **Incluye datos relevantes:**
"Mi flujo de caja mensual es S/. 25,000..."

✅ **Define tus objetivos:**
"Quiero reducir costos en 20% en los próximos 6 meses"

✅ **Menciona plazos:**
"Necesito una estrategia para implementar en 90 días"

**⌨️ ATAJOS DE TECLADO:**
- **Enter**: Enviar mensaje
- **Shift + Enter**: Nueva línea
- **Ctrl + N**: Nueva conversación
- **Ctrl + S**: Exportar conversación
- **Escape**: Cerrar panel

**🎯 EJEMPLOS DE CONSULTAS PODEROSAS:**

💧 "Tengo S/. 30,000 de flujo de caja mensual. ¿Puedo invertir en nueva maquinaria por S/. 80,000?"

📈 "Mi margen de ganancia es 12%, quiero llevarlo a 20%. ¿Qué estrategias específicas recomiendas?"

⚖️ "Soy del Régimen General, ¿qué obligaciones tributarias tengo en marzo 2025?"

🚀 "Tengo una panadería exitosa en Miraflores, ¿cómo expando a otros distritos de Lima?"

¡Estoy aquí 24/7 para convertir tus preguntas en planes de acción rentables! 🎯`;

        this._agregarMensajeIA(mensajeAyuda);
        
        // Registrar métrica
        this._registrarInteraccion('ayuda_mostrada');
    }

    /**
     * Exporta la conversación actual
     */
    exportarConversacion() {
        try {
            const fecha = new Date().toISOString().split('T')[0];
            const conversacion = this.historialGlobal.map(msg => 
                `[${new Date(msg.timestamp).toLocaleString('es-PE')}] ${msg.rol.toUpperCase()}: ${msg.contenido}`
            ).join('\n\n');
            
            const contenido = `GRIZALUM AI EXPERT - Conversación Empresarial
Fecha de exportación: ${new Date().toLocaleString('es-PE')}
Mensajes totales: ${this.historialGlobal.length}

${'='.repeat(60)}

${conversacion}

${'='.repeat(60)}

Métricas de la sesión:
- Tiempo de sesión: ${Math.round((Date.now() - this.analytics.inicioSesion) / 60000)} minutos
- Mensajes enviados: ${this.analytics.mensajesEnviados}
- Mensajes recibidos: ${this.analytics.mensajesRecibidos}

Generado por GRIZALUM AI Expert
Sistema de Inteligencia Artificial Empresarial
`;
            
            const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `grizalum-ai-conversacion-${fecha}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this._mostrarNotificacion('Conversación exportada exitosamente', 'success');
            
            // Registrar métrica
            this._registrarInteraccion('conversacion_exportada');
            
        } catch (error) {
            this._log('error', 'Error exportando conversación:', error);
            this._mostrarNotificacion('Error al exportar conversación', 'error');
        }
    }

    /**
     * Abre el modal de configuración
     */
    abrirConfiguracion() {
        this.elementos.modal?.style.setProperty('display', 'flex');
        this._registrarInteraccion('configuracion_abierta');
    }

    /**
     * Cierra el modal de configuración
     */
    cerrarConfiguracion() {
        this.elementos.modal?.style.setProperty('display', 'none');
        this._registrarInteraccion('configuracion_cerrada');
    }

    /**
     * Alterna el reconocimiento de voz
     */
    alternarVoz() {
        if (this.estado.escuchando) {
            this._detenerVoz();
        } else {
            this._iniciarVoz();
        }
    }

    /**
     * Envía un mensaje programático
     * @param {string} mensaje - El mensaje a enviar
     */
    enviarMensajeProgramatico(mensaje) {
        if (typeof mensaje === 'string' && mensaje.trim()) {
            this.enviarMensaje(mensaje.trim());
        }
    }

    /**
     * Obtiene las métricas del asistente
     * @returns {Object} Métricas actuales
     */
    obtenerMetricas() {
        return {
            ...this.analytics,
            tiempoSesionActual: Date.now() - this.analytics.inicioSesion,
            eficiencia: this.analytics.mensajesRecibidos / Math.max(this.analytics.mensajesEnviados, 1),
            estadoActual: this.estado
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE SUGERENCIAS INTELIGENTES
    // ═══════════════════════════════════════════════════════════════════════════
    _generarSugerencias() {
        const sugerencias = [
            { emoji: '💰', texto: 'Analizar flujo de caja', accion: 'analizar-flujo' },
            { emoji: '📊', texto: 'KPIs principales', accion: 'mostrar-kpis' },
            { emoji: '⚖️', texto: 'Obligaciones SUNAT', accion: 'cumplimiento-legal' },
            { emoji: '🚀', texto: 'Estrategia crecimiento', accion: 'estrategia-crecimiento' },
            { emoji: '💡', texto: 'Reducir costos', accion: 'optimizar-costos' },
            { emoji: '📈', texto: 'Marketing digital', accion: 'marketing-digital' },
            { emoji: '👥', texto: 'Gestión RRHH', accion: 'gestion-rrhh' },
            { emoji: '⚙️', texto: 'Optimizar procesos', accion: 'optimizar-procesos' }
        ];
        
        // Seleccionar 4 sugerencias aleatorias
        const sugerenciasSeleccionadas = sugerencias
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        const html = sugerenciasSeleccionadas
            .map(sug => `
                <button class="grizalum-ai-suggestion-chip" data-action="${sug.accion}">
                    ${sug.emoji} ${sug.texto}
                </button>
            `).join('');
        
        if (this.elementos.sugGrid) {
            this.elementos.sugGrid.innerHTML = html;
        }
    }

    _mostrarSugerenciasContextuales(categoria) {
        const sugerenciasContextuales = {
            financiero: [
                '💧 Analizar flujo de caja actual',
                '📊 Calcular ratios financieros',
                '📈 Proyección de ingresos',
                '⚠️ Identificar riesgos financieros'
            ],
            legal: [
                '📋 Obligaciones tributarias',
                '⚖️ Normativa laboral vigente',
                '💼 Beneficios tributarios',
                '📅 Calendario fiscal 2025'
            ],
            estrategia: [
                '🚀 Plan de crecimiento',
                '🎯 Análisis competitivo',
                '🌐 Expansión de mercado',
                '💻 Transformación digital'
            ]
        };
        
        const sugerencias = sugerenciasContextuales[categoria] || [];
        if (sugerencias.length > 0 && this.elementos.sugGrid) {
            const html = sugerencias
                .map(sug => `
                    <button class="grizalum-ai-suggestion-chip contextuales" onclick="advancedAI.enviarMensajeProgramatico('${sug}')">
                        ${sug}
                    </button>
                `).join('');
            
            this.elementos.sugGrid.innerHTML = html;
        }
    }

    _actualizarSugerencias(contexto) {
        // Regenerar sugerencias basadas en el contexto de la conversación
        setTimeout(() => {
            this._generarSugerencias();
        }, 2000);
    }

    _ejecutarAccionRapida(accion) {
        const acciones = {
            'analizar-flujo': 'Analiza mi flujo de caja actual y dame recomendaciones específicas para optimizarlo',
            'estrategia-crecimiento': 'Dame estrategias concretas para hacer crecer mi empresa en el mercado peruano',
            'optimizar-costos': '¿Cómo puedo reducir costos operativos sin afectar la calidad de mi producto/servicio?',
            'cumplimiento-legal': 'Explícame las obligaciones tributarias y legales que debo cumplir como empresa en Perú',
            'mostrar-kpis': 'Muéstrame los KPIs más importantes que debo monitorear en mi empresa',
            'marketing-digital': 'Desarrolla una estrategia de marketing digital efectiva para mi negocio',
            'gestion-rrhh': 'Ayúdame a optimizar la gestión de recursos humanos y planilla de mi empresa',
            'optimizar-procesos': 'Identifica oportunidades para mejorar la eficiencia de mis procesos operativos'
        };
        
        const mensaje = acciones[accion];
        if (mensaje) {
            this.enviarMensajeProgramatico(mensaje);
        }
    }

    _ejecutarSugerencia(texto) {
        this.enviarMensajeProgramatico(texto);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE VOZ Y ACCESIBILIDAD
    // ═══════════════════════════════════════════════════════════════════════════
    _iniciarVoz() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this._mostrarNotificacion('Reconocimiento de voz no soportado en este navegador', 'warning');
            return;
        }
        
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.reconocimientoVoz = new SpeechRecognition();
            
            this.reconocimientoVoz.lang = 'es-PE';
            this.reconocimientoVoz.continuous = false;
            this.reconocimientoVoz.interimResults = true;
            
            this.reconocimientoVoz.onstart = () => {
                this.estado.escuchando = true;
                this.elementos.btnVoz?.classList.add('active');
                this._mostrarNotificacion('🎤 Escuchando... Habla ahora', 'info');
            };
            
            this.reconocimientoVoz.onresult = (event) => {
                const resultado = event.results[event.results.length - 1];
                if (resultado.isFinal) {
                    const texto = resultado[0].transcript;
                    if (this.elementos.input) {
                        this.elementos.input.value = texto;
                        this._ajustarAlturaInput(this.elementos.input);
                    }
                }
            };
            
            this.reconocimientoVoz.onerror = (event) => {
                this._log('error', 'Error en reconocimiento de voz:', event.error);
                this._detenerVoz();
                this._mostrarNotificacion('Error en el reconocimiento de voz', 'error');
            };
            
            this.reconocimientoVoz.onend = () => {
                this._detenerVoz();
            };
            
            this.reconocimientoVoz.start();
            
        } catch (error) {
            this._log('error', 'Error iniciando reconocimiento de voz:', error);
            this._mostrarNotificacion('Error al iniciar reconocimiento de voz', 'error');
        }
    }

    _detenerVoz() {
        this.estado.escuchando = false;
        this.elementos.btnVoz?.classList.remove('active');
        
        if (this.reconocimientoVoz) {
            this.reconocimientoVoz.stop();
            this.reconocimientoVoz = null;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE MÉTRICAS Y ANALYTICS
    // ═══════════════════════════════════════════════════════════════════════════
    _inicializarMetricas() {
        this.analytics.inicioSesion = Date.now();
        this._registrarInteraccion('sesion_iniciada');
    }

    _registrarInteraccion(tipo, datos = {}) {
        const interaccion = {
            tipo,
            timestamp: Date.now(),
            datos,
            sessionId: this._obtenerSessionId()
        };
        
        this.analytics.interacciones[tipo] = (this.analytics.interacciones[tipo] || 0) + 1;
        
        // Log para desarrollo
        if (this.config.debug) {
            this._log('info', `📊 Métrica registrada: ${tipo}`, datos);
        }
    }

    _guardarMetricas() {
        try {
            localStorage.setItem(`${this.config.cache.prefijoKey}analytics`, JSON.stringify(this.analytics));
        } catch (error) {
            this._log('warn', 'Error guardando métricas:', error);
        }
    }

    _obtenerSessionId() {
        let sessionId = sessionStorage.getItem('grizalum_ai_session');
        if (!sessionId) {
            sessionId = this._generarId();
            sessionStorage.setItem('grizalum_ai_session', sessionId);
        }
        return sessionId;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE NOTIFICACIONES
    // ═══════════════════════════════════════════════════════════════════════════
    _mostrarNotificacion(mensaje, tipo = 'info') {
        // Integrar con sistema de notificaciones de GRIZALUM
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, tipo);
            return;
        }
        
        // Fallback a console
        const emoji = {
            'success': '✅',
            'warning': '⚠️',
            'error': '❌',
            'info': 'ℹ️'
        };
        
        console.log(`${emoji[tipo]} ${mensaje}`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MANEJO DE ERRORES Y LOGGING
    // ═══════════════════════════════════════════════════════════════════════════
    _manejarErrorInicializacion(error) {
        console.error('❌ Error crítico en Asistente IA:', error);
        
        // Mostrar interfaz de error
        document.body.insertAdjacentHTML('beforeend', `
            <div id="grizalumAIError" class="grizalum-ai-error">
                <div class="error-content">
                    <h3>⚠️ Error del Asistente IA</h3>
                    <p>Hubo un problema al inicializar el asistente. Por favor, recarga la página.</p>
                    <button onclick="window.location.reload()">🔄 Recargar Página</button>
                </div>
            </div>
        `);
    }

    _manejarErrorEnvio(error) {
        this._ocultarEscribiendo();
        this._agregarMensajeIA(this._generarRespuestaError());
        this._actualizarEstadoVisual('error');
        
        setTimeout(() => {
            this._actualizarEstadoVisual('ready');
        }, 3000);
    }

    _manejarResize() {
        // Ajustar posición del panel en móviles
        if (window.innerWidth < 768 && this.elementos.panel) {
            this.elementos.panel.style.bottom = '10px';
            this.elementos.panel.style.right = '10px';
            this.elementos.panel.style.left = '10px';
        }
    }

    _log(nivel, mensaje, datos = null) {
        if (!this.config.debug && nivel !== 'error') return;
        
        const timestamp = new Date().toISOString();
        const prefijo = `[${timestamp}] [${this.config.componente}]`;
        
        switch (nivel) {
            case 'error':
                console.error(`${prefijo} ❌`, mensaje, datos);
                break;
            case 'warn':
                console.warn(`${prefijo} ⚠️`, mensaje, datos);
                break;
            case 'success':
                console.log(`${prefijo} ✅`, mensaje, datos);
                break;
            default:
                console.log(`${prefijo} ℹ️`, mensaje, datos);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILIDADES INTERNAS
    // ═══════════════════════════════════════════════════════════════════════════
    _generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    _restaurarConversacion() {
        // Restaurar mensajes del historial si existe
        if (this.historialGlobal.length > 1) { // Más que solo bienvenida
            this.elementos.mensajes.innerHTML = '';
            
            this.historialGlobal.forEach(entrada => {
                if (entrada.rol === 'user') {
                    this._agregarMensajeUsuarioSinHistorial(entrada.contenido);
                } else {
                    this._agregarMensajeIASinHistorial(entrada.contenido);
                }
            });
        }
    }

    _agregarMensajeUsuarioSinHistorial(mensaje) {
        const mensajeHTML = `
            <div class="grizalum-ai-message-wrapper usuario">
                <div class="grizalum-ai-message user-message">
                    <div class="grizalum-ai-message-content">
                        <div class="grizalum-ai-message-text">${this._escaparHTML(mensaje)}</div>
                    </div>
                    <div class="grizalum-ai-message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
            </div>
        `;
        
        this.elementos.mensajes?.insertAdjacentHTML('beforeend', mensajeHTML);
    }

    _agregarMensajeIASinHistorial(respuesta) {
        const mensajeHTML = `
            <div class="grizalum-ai-message-wrapper ia">
                <div class="grizalum-ai-message ai-message">
                    <div class="grizalum-ai-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="grizalum-ai-message-content">
                        <div class="grizalum-ai-message-header">
                            <strong>GRIZALUM AI Expert</strong>
                            <time class="grizalum-ai-timestamp">${this._formatearHora(new Date())}</time>
                        </div>
                        <div class="grizalum-ai-message-text">${this._formatearRespuestaIA(respuesta)}</div>
                    </div>
                </div>
            </div>
        `;
        
        this.elementos.mensajes?.insertAdjacentHTML('beforeend', mensajeHTML);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS CSS ULTRA PROFESIONALES INTEGRADOS
// ═══════════════════════════════════════════════════════════════════════════

const estilosAsistenteIA = `
<style>
/* ================================================
   GRIZALUM AI ASSISTANT - ESTILOS ULTRA PROFESIONALES
   ================================================ */

/* Variables CSS */
:root {
    --grizalum-ai-primary: #667eea;
    --grizalum-ai-secondary: #764ba2;
    --grizalum-ai-success: #10b981;
    --grizalum-ai-warning: #f59e0b;
    --grizalum-ai-error: #ef4444;
    --grizalum-ai-text: #1f2937;
    --grizalum-ai-text-light: #6b7280;
    --grizalum-ai-bg: #ffffff;
    --grizalum-ai-bg-secondary: #f8fafc;
    --grizalum-ai-border: #e5e7eb;
    --grizalum-ai-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    --grizalum-ai-shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
    --grizalum-ai-radius: 16px;
    --grizalum-ai-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Botón flotante principal */
.grizalum-ai-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--grizalum-ai-shadow);
    z-index: 10000;
    transition: var(--grizalum-ai-transition);
    border: 3px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}

.grizalum-ai-btn:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: var(--grizalum-ai-shadow-hover);
}

.grizalum-ai-btn:active {
    transform: translateY(-2px) scale(1.02);
}

.grizalum-ai-icon {
    color: white;
    font-size: 1.8rem;
    animation: grizalumAIHeartbeat 2s ease-in-out infinite;
}

@keyframes grizalumAIHeartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.grizalum-ai-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
    opacity: 0.7;
    animation: grizalumAIPulse 2s infinite;
}

@keyframes grizalumAIPulse {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 0.3; }
    100% { transform: scale(1.4); opacity: 0; }
}

.grizalum-ai-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 24px;
    height: 24px;
    background: var(--grizalum-ai-error);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0 6px;
    border: 2px solid white;
    animation: grizalumAIBadgeBounce 2s infinite;
}

@keyframes grizalumAIBadgeBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}

/* Panel principal */
.grizalum-ai-panel {
    position: fixed;
    bottom: 120px;
    right: 30px;
    width: 450px;
    height: 700px;
    background: var(--grizalum-ai-bg);
    border-radius: var(--grizalum-ai-radius);
    box-shadow: var(--grizalum-ai-shadow-hover);
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px) scale(0.95);
    transition: var(--grizalum-ai-transition);
    overflow: hidden;
    border: 1px solid var(--grizalum-ai-border);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.95);
}

.grizalum-ai-panel.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
}

/* Header del panel */
.grizalum-ai-header {
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
    color: white;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
}

.grizalum-ai-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
}

.grizalum-ai-avatar {
    width: 52px;
    height: 52px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    position: relative;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.grizalum-ai-status-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    border: 2px solid white;
    border-radius: 50%;
    background: var(--grizalum-ai-success);
}

.grizalum-ai-status-dot.thinking {
    background: var(--grizalum-ai-warning);
    animation: grizalumAIThinking 1s infinite;
}

.grizalum-ai-status-dot.error {
    background: var(--grizalum-ai-error);
}

@keyframes grizalumAIThinking {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.grizalum-ai-info {
    flex: 1;
    z-index: 1;
}

.grizalum-ai-title {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: 0.025em;
}

.grizalum-ai-status {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.9;
    font-weight: 400;
}

.grizalum-ai-controls {
    display: flex;
    gap: 0.5rem;
    z-index: 1;
}

.grizalum-ai-control-btn {
    width: 38px;
    height: 38px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--grizalum-ai-transition);
    backdrop-filter: blur(10px);
}

.grizalum-ai-control-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

/* Sección de sugerencias */
.grizalum-ai-suggestions {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grizalum-ai-border);
    background: var(--grizalum-ai-bg-secondary);
    flex-shrink: 0;
}

.grizalum-ai-suggestions-title {
    margin: 0 0 0.75rem 0;
    color: var(--grizalum-ai-text);
    font-size: 0.875rem;
    font-weight: 600;
}

.grizalum-ai-suggestions-grid {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--grizalum-ai-border) transparent;
}

.grizalum-ai-suggestions-grid::-webkit-scrollbar {
    height: 4px;
}

.grizalum-ai-suggestions-grid::-webkit-scrollbar-track {
    background: transparent;
}

.grizalum-ai-suggestions-grid::-webkit-scrollbar-thumb {
    background: var(--grizalum-ai-border);
    border-radius: 2px;
}

.grizalum-ai-suggestion-chip {
    background: white;
    border: 1px solid var(--grizalum-ai-border);
    padding: 0.5rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    transition: var(--grizalum-ai-transition);
    color: var(--grizalum-ai-text-light);
    font-weight: 500;
}

.grizalum-ai-suggestion-chip:hover,
.grizalum-ai-suggestion-chip.contextuales:hover {
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Contenedor de chat */
.grizalum-ai-chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.grizalum-ai-messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    scrollbar-width: thin;
    scrollbar-color: var(--grizalum-ai-border) transparent;
}

.grizalum-ai-messages::-webkit-scrollbar {
    width: 6px;
}

.grizalum-ai-messages::-webkit-scrollbar-track {
    background: transparent;
}

.grizalum-ai-messages::-webkit-scrollbar-thumb {
    background: var(--grizalum-ai-border);
    border-radius: 3px;
}

/* Mensajes */
.grizalum-ai-message-wrapper {
    display: flex;
    animation: grizalumAIMessageSlideIn 0.3s ease-out;
}

.grizalum-ai-message-wrapper.usuario {
    justify-content: flex-end;
}

@keyframes grizalumAIMessageSlideIn {
    from { 
        opacity: 0; 
        transform: translateY(20px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
}

.grizalum-ai-message {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    max-width: 85%;
}

.user-message {
    flex-direction: row-reverse;
}

.grizalum-ai-message-avatar {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
    color: white;
}

.ai-message .grizalum-ai-message-avatar {
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
}

.user-message .grizalum-ai-message-avatar {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.grizalum-ai-message-content {
    background: var(--grizalum-ai-bg-secondary);
    padding: 1rem;
    border-radius: 16px;
    line-height: 1.6;
    position: relative;
    border: 1px solid var(--grizalum-ai-border);
}

.user-message .grizalum-ai-message-content {
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
    color: white;
    border-color: transparent;
}

.grizalum-ai-message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--grizalum-ai-border);
    font-size: 0.875rem;
}

.grizalum-ai-timestamp {
    font-size: 0.75rem;
    color: var(--grizalum-ai-text-light);
    font-weight: 400;
}

.grizalum-ai-message-text {
    color: var(--grizalum-ai-text);
    margin-bottom: 0.75rem;
}

.user-message .grizalum-ai-message-text {
    color: white;
}

/* Elementos de contenido especiales */
.grizalum-ai-welcome h3 {
    color: var(--grizalum-ai-primary);
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
}

.grizalum-ai-welcome p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
}

.grizalum-ai-capabilities {
    display: grid;
    gap: 0.75rem;
    margin: 1rem 0;
}

.capability-card {
    background: white;
    padding: 0.75rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid var(--grizalum-ai-border);
    transition: var(--grizalum-ai-transition);
}

.capability-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.capability-card i {
    color: var(--grizalum-ai-primary);
    font-size: 1.25rem;
    width: 24px;
}

.capability-card strong {
    color: var(--grizalum-ai-text);
    display: block;
    margin-bottom: 0.25rem;
}

.capability-card p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--grizalum-ai-text-light);
}

.grizalum-ai-welcome-footer {
    background: rgba(102, 126, 234, 0.1);
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-size: 0.875rem;
    color: var(--grizalum-ai-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Acciones rápidas */
.grizalum-ai-quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}

.grizalum-ai-quick-btn {
    background: white;
    border: 1px solid var(--grizalum-ai-border);
    padding: 0.5rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: var(--grizalum-ai-transition);
    color: var(--grizalum-ai-text);
    font-weight: 500;
}

.grizalum-ai-quick-btn:hover {
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
    color: white;
    border-color: transparent;
    transform: translateY(-1px);
}

/* Acciones de mensaje */
.grizalum-ai-message-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--grizalum-ai-border);
}

.grizalum-ai-action-btn {
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--grizalum-ai-border);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--grizalum-ai-transition);
    color: var(--grizalum-ai-text-light);
}

.grizalum-ai-action-btn:hover {
    background: var(--grizalum-ai-primary);
    color: white;
    border-color: var(--grizalum-ai-primary);
}

/* Indicador de escritura */
.grizalum-ai-typing {
    padding: 0 1rem;
}

.grizalum-ai-typing-content {
    background: var(--grizalum-ai-bg-secondary);
    padding: 1rem;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid var(--grizalum-ai-border);
}

.grizalum-ai-thinking {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.grizalum-ai-dots {
    display: flex;
    gap: 0.25rem;
}

.grizalum-ai-dots span {
    width: 8px;
    height: 8px;
    background: var(--grizalum-ai-primary);
    border-radius: 50%;
    animation: grizalumAIDots 1.4s infinite ease-in-out;
}

.grizalum-ai-dots span:nth-child(1) { animation-delay: -0.32s; }
.grizalum-ai-dots span:nth-child(2) { animation-delay: -0.16s; }
.grizalum-ai-dots span:nth-child(3) { animation-delay: 0s; }

@keyframes grizalumAIDots {
    0%, 80%, 100% { 
        transform: scale(0.8); 
        opacity: 0.5; 
    }
    40% { 
        transform: scale(1.2); 
        opacity: 1; 
    }
}

.grizalum-ai-thinking-text {
    font-size: 0.875rem;
    color: var(--grizalum-ai-text-light);
    font-style: italic;
}

/* Sección de input */
.grizalum-ai-input-section {
    padding: 1rem;
    border-top: 1px solid var(--grizalum-ai-border);
    background: white;
    flex-shrink: 0;
}

.grizalum-ai-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.grizalum-ai-input-wrapper {
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
    background: var(--grizalum-ai-bg-secondary);
    border: 2px solid var(--grizalum-ai-border);
    border-radius: 16px;
    padding: 0.75rem;
    transition: var(--grizalum-ai-transition);
}

.grizalum-ai-input-wrapper:focus-within {
    border-color: var(--grizalum-ai-primary);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.grizalum-ai-input {
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
    color: var(--grizalum-ai-text);
}

.grizalum-ai-input::placeholder {
    color: var(--grizalum-ai-text-light);
}

.grizalum-ai-input-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.grizalum-ai-input-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--grizalum-ai-transition);
    font-size: 0.9rem;
}

.voice-btn {
    background: var(--grizalum-ai-bg-secondary);
    color: var(--grizalum-ai-text-light);
    border: 1px solid var(--grizalum-ai-border);
}

.voice-btn:hover {
    background: var(--grizalum-ai-border);
    color: var(--grizalum-ai-text);
}

.voice-btn.active {
    background: var(--grizalum-ai-error);
    color: white;
    animation: grizalumAIVoiceRecord 1s infinite;
}

@keyframes grizalumAIVoiceRecord {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.send-btn {
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
    color: white;
}

.send-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.grizalum-ai-input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--grizalum-ai-text-light);
}

.grizalum-ai-input-hint {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.grizalum-ai-input-stats {
    font-family: monospace;
}

.grizalum-ai-input-stats.warning {
    color: var(--grizalum-ai-warning);
    font-weight: 600;
}

/* Modal de configuración */
.grizalum-ai-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    backdrop-filter: blur(4px);
}

.grizalum-ai-modal-content {
    background: white;
    border-radius: var(--grizalum-ai-radius);
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: var(--grizalum-ai-shadow-hover);
}

.grizalum-ai-modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--grizalum-ai-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, var(--grizalum-ai-primary) 0%, var(--grizalum-ai-secondary) 100%);
    color: white;
    border-radius: var(--grizalum-ai-radius) var(--grizalum-ai-radius) 0 0;
}

.grizalum-ai-modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
}

.grizalum-ai-modal-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--grizalum-ai-transition);
}

.grizalum-ai-modal-close:hover {
    background: rgba(255, 255, 255, 0.3);
}

.grizalum-ai-modal-body {
    padding: 1.5rem;
}

.grizalum-ai-settings-section {
    margin-bottom: 2rem;
}

.grizalum-ai-settings-section h3 {
    margin: 0 0 1rem 0;
    color: var(--grizalum-ai-text);
    font-size: 1rem;
    font-weight: 600;
}

.grizalum-ai-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    cursor: pointer;
}

.grizalum-ai-switch input {
    display: none;
}

.grizalum-ai-slider {
    width: 44px;
    height: 24px;
    background: var(--grizalum-ai-border);
    border-radius: 12px;
    position: relative;
    transition: var(--grizalum-ai-transition);
}

.grizalum-ai-slider::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: var(--grizalum-ai-transition);
}

.grizalum-ai-switch input:checked + .grizalum-ai-slider {
    background: var(--grizalum-ai-primary);
}

.grizalum-ai-switch input:checked + .grizalum-ai-slider::before {
    transform: translateX(20px);
}

/* Error de inicialización */
.grizalum-ai-error {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    color: white;
    text-align: center;
}

.error-content {
    background: var(--grizalum-ai-error);
    padding: 2rem;
    border-radius: var(--grizalum-ai-radius);
    max-width: 400px;
}

.error-content h3 {
    margin-top: 0;
}

.error-content button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: var(--grizalum-ai-transition);
}

.error-content button:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
    .grizalum-ai-panel {
        bottom: 20px;
        right: 20px;
        left: 20px;
        width: auto;
        height: 80vh;
    }
    
    .grizalum-ai-btn {
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
    }

    .grizalum-ai-message {
        max-width: 95%;
    }

    .grizalum-ai-header {
        padding: 1rem;
    }

    .grizalum-ai-suggestions {
        padding: 0.75rem 1rem;
    }

    .grizalum-ai-messages {
        padding: 0.75rem;
    }
}

@media (max-width: 480px) {
    .grizalum-ai-panel {
        bottom: 10px;
        right: 10px;
        left: 10px;
        height: 85vh;
    }

    .grizalum-ai-btn {
        bottom: 10px;
        right: 10px;
        width: 55px;
        height: 55px;
    }

    .grizalum-ai-icon {
        font-size: 1.5rem;
    }

    .grizalum-ai-capabilities {
        grid-template-columns: 1fr;
    }

    .grizalum-ai-quick-actions {
        flex-direction: column;
    }

    .grizalum-ai-quick-btn {
        text-align: center;
    }
}

/* Tema oscuro (si está habilitado) */
.grizalum-ai-panel[data-theme="dark"] {
    --grizalum-ai-bg: #1f2937;
    --grizalum-ai-bg-secondary: #374151;
    --grizalum-ai-text: #f9fafb;
    --grizalum-ai-text-light: #d1d5db;
    --grizalum-ai-border: #4b5563;
}

/* Animaciones de alta performance */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Accesibilidad mejorada */
@media (prefers-contrast: high) {
    :root {
        --grizalum-ai-border: #000000;
        --grizalum-ai-text-light: #000000;
    }
}

/* Focus visible para navegación por teclado */
.grizalum-ai-btn:focus-visible,
.grizalum-ai-control-btn:focus-visible,
.grizalum-ai-input-btn:focus-visible,
.grizalum-ai-suggestion-chip:focus-visible,
.grizalum-ai-quick-btn:focus-visible {
    outline: 2px solid var(--grizalum-ai-primary);
    outline-offset: 2px;
}

/* Utilidades */
.check-icon { color: var(--grizalum-ai-success); }
.warning-icon { color: var(--grizalum-ai-warning); }
.rocket-icon { color: var(--grizalum-ai-primary); }
</style>
`;

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN AUTOMÁTICA ULTRA PROFESIONAL
// ═══════════════════════════════════════════════════════════════════════════

// Variable global para la instancia
let grizalumAsistenteIA = null;

// Función de inicialización controlada
function inicializarAsistenteIA() {
    try {
        // Verificar que no exista ya una instancia
        if (grizalumAsistenteIA) {
            console.warn('🟡 Asistente IA ya está inicializado');
            return grizalumAsistenteIA;
        }

        // Inyectar estilos CSS
        if (!document.getElementById('grizalum-ai-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'grizalum-ai-styles';
            styleElement.innerHTML = estilosAsistenteIA.replace('<style>', '').replace('</style>', '');
            document.head.appendChild(styleElement);
        }

        // Crear instancia del asistente
        grizalumAsistenteIA = new AsistenteIAAvanzado({
            debug: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        });

        // Hacer disponible globalmente
        window.grizalumAsistenteIA = grizalumAsistenteIA;
        window.advancedAI = grizalumAsistenteIA; // Retrocompatibilidad

        // APIs públicas adicionales
        window.abrirAsistenteIA = () => grizalumAsistenteIA.abrir();
        window.cerrarAsistenteIA = () => grizalumAsistenteIA.cerrar();
        window.enviarMensajeIA = (mensaje) => grizalumAsistenteIA.enviarMensajeProgramatico(mensaje);

        console.log('🚀 GRIZALUM AI EXPERT INICIALIZADO EXITOSAMENTE');
        console.log('📊 Capacidades disponibles:');
        console.log('  • Análisis financiero inteligente');
        console.log('  • Asesoría legal y tributaria para Perú');
        console.log('  • Estrategias de crecimiento empresarial');
        console.log('  • Optimización de costos y operaciones');
        console.log('  • Marketing y ventas efectivas');
        console.log('  • Gestión de recursos humanos');
        console.log('  • Respuestas contextuales avanzadas');
        console.log('🎯 Tu consultor empresarial 24/7 está listo!');

        return grizalumAsistenteIA;

    } catch (error) {
        console.error('❌ Error al inicializar Asistente IA:', error);
        return null;
    }
}

// Auto-inicialización inteligente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAsistenteIA);
} else {
    // DOM ya cargado, inicializar inmediatamente
    setTimeout(inicializarAsistenteIA, 100);
}

// Exportar para uso modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AsistenteIAAvanzado, inicializarAsistenteIA };
}

// Log de carga del módulo
console.log('🧠 Módulo AsistenteIAAvanzado cargado - Versión 2.0.0');
console.log('🔗 Integración completa con ecosistema GRIZALUM');
console.log('⚡ Optimizaciones de rendimiento aplicadas');
console.log('🛡️ Validaciones de seguridad implementadas');
console.log('📱 Diseño responsive y accesibilidad profesional');
console.log('📊 Sistema de métricas y analytics integrado');
