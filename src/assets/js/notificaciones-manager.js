/**
 * ================================================================
 * GRIZALUM SISTEMA DE NOTIFICACIONES PREMIUM v2.0
 * Sistema inteligente de notificaciones financieras por empresa
 * ================================================================
 */

class GrizalumNotificacionesPremium {
    constructor() {
        this.version = '2.0.0';
        this.empresaActual = null;
        this.notificaciones = new Map();
        this.configuracion = {
            maxNotificaciones: 50,
            tiempoLimpieza: 7 * 24 * 60 * 60 * 1000, // 7 días
            sonidoActivado: true,
            animacionesActivadas: true
        };
        this.categorias = {
            FINANCIERO: {
                color: '#d4af37',
                icono: 'fas fa-coins',
                prioridad: 'alta'
            },
            VENCIMIENTO: {
                color: '#e74c3c',
                icono: 'fas fa-exclamation-triangle',
                prioridad: 'critica'
            },
            OPORTUNIDAD: {
                color: '#27ae60',
                icono: 'fas fa-chart-line',
                prioridad: 'media'
            },
            SISTEMA: {
                color: '#3498db',
                icono: 'fas fa-cog',
                prioridad: 'baja'
            },
            RECORDATORIO: {
                color: '#9b59b6',
                icono: 'fas fa-bell',
                prioridad: 'media'
            }
        };
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.inicializar());
        } else {
            this.inicializar();
        }
    }

    inicializar() {
        this.cargarConfiguracion();
        this.configurarMonitoreoFinanciero();
        this.crearInterfazPremium();
        this.conectarConSistema();
        this.crearAPI();
        this.iniciarVerificacionesPeriodicas();
        
        console.log('✨ GRIZALUM Notificaciones Premium v2.0 inicializado');
    }

    cargarConfiguracion() {
        // Configuración inteligente basada en empresa
        this.reglasNotificacion = {
            cashFlowBajo: {
                umbral: 0.3, // 30% de gastos mensuales
                frecuencia: 'diaria',
                activa: true
            },
            facturasVencimiento: {
                diasAnticipacion: [30, 15, 7, 1],
                activa: true
            },
            metasAlcanzadas: {
                umbrales: [50, 75, 100, 125],
                activa: true
            },
            gastosElevados: {
                incrementoAlerta: 0.2, // 20% más que promedio
                activa: true
            }
        };
    }

    configurarMonitoreoFinanciero() {
        // Monitoreo inteligente de métricas financieras
        this.monitores = {
            flujoCaja: new FinancialMonitor('cashFlow', this.reglasNotificacion.cashFlowBajo),
            gastos: new FinancialMonitor('expenses', this.reglasNotificacion.gastosElevados),
            ingresos: new FinancialMonitor('revenue', {}),
            crecimiento: new FinancialMonitor('growth', this.reglasNotificacion.metasAlcanzadas)
        };
    }

    crearInterfazPremium() {
        this.crearBotonPremium();
        this.crearPanelPremium();
        this.inyectarEstilosPremium();
    }

    crearBotonPremium() {
        const botonExistente = document.getElementById('grizalumNotificationBtn');
        if (botonExistente) botonExistente.remove();

        const contenedor = document.createElement('div');
        contenedor.id = 'grizalumNotificationContainer';
        contenedor.innerHTML = `
            <button id="grizalumNotificationBtn" class="grizalum-notification-btn-premium">
                <div class="notification-icon-container">
                    <i class="fas fa-bell"></i>
                    <div class="notification-pulse"></div>
                </div>
                <span class="notification-count-premium" id="notificationCount">0</span>
                <div class="notification-priorities" id="notificationPriorities">
                    <div class="priority-indicator critical" title="Críticas"></div>
                    <div class="priority-indicator high" title="Altas"></div>
                    <div class="priority-indicator medium" title="Medias"></div>
                </div>
            </button>
        `;

        document.body.appendChild(contenedor);
        
        document.getElementById('grizalumNotificationBtn').addEventListener('click', () => {
            this.togglePanel();
        });
    }

    crearPanelPremium() {
        const panelExistente = document.getElementById('grizalumNotificationPanel');
        if (panelExistente) panelExistente.remove();

        const panel = document.createElement('div');
        panel.id = 'grizalumNotificationPanel';
        panel.className = 'grizalum-notification-panel-premium';
        panel.innerHTML = `
            <div class="notification-header-premium">
                <div class="header-left">
                    <div class="header-icon">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div class="header-text">
                        <h3>Centro de Notificaciones</h3>
                        <span id="empresaActualDisplay">GRIZALUM Premium</span>
                    </div>
                </div>
                <div class="header-controls">
                    <button id="notificationSettings" class="control-btn" title="Configuración">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button id="clearAllNotifications" class="control-btn" title="Limpiar todo">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button id="closeNotificationPanel" class="control-btn close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div class="notification-filters">
                <button class="filter-btn active" data-filter="todas">Todas</button>
                <button class="filter-btn" data-filter="critica">Críticas</button>
                <button class="filter-btn" data-filter="alta">Importantes</button>
                <button class="filter-btn" data-filter="media">Generales</button>
            </div>

            <div class="notification-stats">
                <div class="stat-item">
                    <span class="stat-number" id="statCriticas">0</span>
                    <span class="stat-label">Críticas</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="statImportantes">0</span>
                    <span class="stat-label">Importantes</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="statTotal">0</span>
                    <span class="stat-label">Total</span>
                </div>
            </div>

            <div class="notification-content">
                <div class="notification-list" id="notificationList">
                    <!-- Notificaciones se cargan aquí -->
                </div>
            </div>

            <div class="notification-footer-premium">
                <button id="markAllReadBtn" class="footer-btn primary">
                    <i class="fas fa-check-double"></i>
                    Marcar todas como leídas
                </button>
                <button id="exportNotificationsBtn" class="footer-btn secondary">
                    <i class="fas fa-download"></i>
                    Exportar
                </button>
            </div>
        `;

        document.body.appendChild(panel);
        this.configurarEventosPanel();
    }

    inyectarEstilosPremium() {
        const styleId = 'grizalum-notifications-premium-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            /* Botón Premium */
            .grizalum-notification-btn-premium {
                position: fixed;
                top: 120px;
                right: 20px;
                width: 65px;
                height: 65px;
                background: linear-gradient(135deg, #d4af37 0%, #f1c40f 50%, #d4af37 100%);
                border: none;
                border-radius: 50%;
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: visible;
            }

            .grizalum-notification-btn-premium:hover {
                transform: scale(1.1) rotateZ(5deg);
                box-shadow: 0 12px 35px rgba(212, 175, 55, 0.6);
            }

            .notification-icon-container {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-icon-container i {
                color: white;
                font-size: 22px;
                z-index: 2;
            }

            .notification-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                animation: notificationPulse 2s infinite;
            }

            .notification-count-premium {
                position: absolute;
                top: -8px;
                right: -8px;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                font-size: 12px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
                transform: scale(0);
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .notification-count-premium.active {
                transform: scale(1);
            }

            .notification-priorities {
                position: absolute;
                bottom: -12px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 3px;
            }

            .priority-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .priority-indicator.critical { background: #e74c3c; }
            .priority-indicator.high { background: #f39c12; }
            .priority-indicator.medium { background: #3498db; }

            .priority-indicator.active {
                opacity: 1;
                animation: priorityGlow 1.5s infinite alternate;
            }

            /* Panel Premium */
            .grizalum-notification-panel-premium {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 420px;
                max-height: 600px;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
                z-index: 9998;
                display: none;
                flex-direction: column;
                overflow: hidden;
                transform: translateY(-20px) scale(0.95);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .grizalum-notification-panel-premium.active {
                display: flex;
                transform: translateY(0) scale(1);
                opacity: 1;
            }

            .notification-header-premium {
                background: linear-gradient(135deg, #d4af37, #f1c40f);
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: white;
            }

            .header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .header-icon {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }

            .header-text h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .header-text span {
                font-size: 12px;
                opacity: 0.9;
            }

            .header-controls {
                display: flex;
                gap: 8px;
            }

            .control-btn {
                width: 32px;
                height: 32px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease;
            }

            .control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .notification-filters {
                padding: 16px 20px;
                display: flex;
                gap: 8px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .filter-btn {
                padding: 6px 12px;
                border: 1px solid #dee2e6;
                background: white;
                border-radius: 20px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #6c757d;
            }

            .filter-btn.active, .filter-btn:hover {
                background: #d4af37;
                border-color: #d4af37;
                color: white;
            }

            .notification-stats {
                padding: 16px 20px;
                display: flex;
                justify-content: space-around;
                background: linear-gradient(135deg, #f8f9fa, #ffffff);
            }

            .stat-item {
                text-align: center;
            }

            .stat-number {
                display: block;
                font-size: 20px;
                font-weight: 700;
                color: #d4af37;
            }

            .stat-label {
                font-size: 11px;
                color: #6c757d;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .notification-content {
                flex: 1;
                overflow-y: auto;
                max-height: 300px;
            }

            .notification-list {
                padding: 0;
            }

            .notification-item-premium {
                padding: 16px 20px;
                border-bottom: 1px solid #f1f3f4;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                background: white;
            }

            .notification-item-premium:hover {
                background: #f8f9fa;
                transform: translateX(4px);
            }

            .notification-item-premium.unread {
                border-left: 4px solid #d4af37;
                background: linear-gradient(90deg, rgba(212, 175, 55, 0.05), transparent);
            }

            .notification-item-premium.critical {
                border-left-color: #e74c3c;
            }

            .notification-item-content {
                display: flex;
                gap: 12px;
            }

            .notification-category-icon {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: white;
                flex-shrink: 0;
            }

            .notification-text {
                flex: 1;
            }

            .notification-title {
                font-weight: 600;
                font-size: 14px;
                color: #2c3e50;
                margin-bottom: 4px;
            }

            .notification-message {
                font-size: 13px;
                color: #7f8c8d;
                line-height: 1.4;
                margin-bottom: 6px;
            }

            .notification-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .notification-time {
                font-size: 11px;
                color: #95a5a6;
            }

            .notification-priority {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
            }

            .priority-critica { background: #ffebee; color: #c62828; }
            .priority-alta { background: #fff3e0; color: #ef6c00; }
            .priority-media { background: #e3f2fd; color: #1565c0; }
            .priority-baja { background: #f3e5f5; color: #7b1fa2; }

            .notification-footer-premium {
                padding: 16px 20px;
                background: #f8f9fa;
                display: flex;
                gap: 12px;
            }

            .footer-btn {
                flex: 1;
                padding: 10px 16px;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s ease;
            }

            .footer-btn.primary {
                background: #d4af37;
                color: white;
            }

            .footer-btn.primary:hover {
                background: #b8941f;
                transform: translateY(-1px);
            }

            .footer-btn.secondary {
                background: white;
                color: #6c757d;
                border: 1px solid #dee2e6;
            }

            .footer-btn.secondary:hover {
                background: #f8f9fa;
            }

            .empty-notifications {
                padding: 60px 40px;
                text-align: center;
                color: #95a5a6;
            }

            .empty-notifications i {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.5;
            }

            .empty-notifications h4 {
                margin: 0 0 8px 0;
                font-size: 16px;
                color: #7f8c8d;
            }

            .empty-notifications p {
                margin: 0;
                font-size: 13px;
            }

            /* Animaciones */
            @keyframes notificationPulse {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.2); opacity: 0.4; }
                100% { transform: scale(1); opacity: 0.8; }
            }

            @keyframes priorityGlow {
                0% { box-shadow: 0 0 5px currentColor; }
                100% { box-shadow: 0 0 15px currentColor; }
            }

            @keyframes slideInNotification {
                from { 
                    transform: translateX(100%); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
            }

            .notification-item-premium.new {
                animation: slideInNotification 0.3s ease-out;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .grizalum-notification-panel-premium {
                    right: 10px;
                    left: 10px;
                    width: auto;
                    max-height: 80vh;
                }
                
                .grizalum-notification-btn-premium {
                    right: 15px;
                    width: 55px;
                    height: 55px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    configurarEventosPanel() {
        // Cerrar panel
        document.getElementById('closeNotificationPanel').addEventListener('click', () => {
            this.cerrarPanel();
        });

        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filtrarNotificaciones(btn.dataset.filter);
            });
        });

        // Marcar todas como leídas
        document.getElementById('markAllReadBtn').addEventListener('click', () => {
            this.marcarTodasComoLeidas();
        });

        // Limpiar todas
        document.getElementById('clearAllNotifications').addEventListener('click', () => {
            this.limpiarTodasLasNotificaciones();
        });

        // Exportar
        document.getElementById('exportNotificationsBtn').addEventListener('click', () => {
            this.exportarNotificaciones();
        });
    }

    conectarConSistema() {
        // Observar cambios de empresa
        this.observarCambioEmpresa();
        
        // Conectar con métricas financieras
        document.addEventListener('allMetricsUpdated', (e) => {
            this.analizarMetricas(e.detail);
        });

        // Conectar con cambios de período
        document.addEventListener('periodChanged', (e) => {
            this.actualizarParaPeriodo(e.detail.period);
        });
    }

    observarCambioEmpresa() {
        const observer = new MutationObserver(() => {
            this.detectarEmpresaActual();
        });

        const selector = document.getElementById('companySelector');
        if (selector) {
            observer.observe(selector, { childList: true, subtree: true });
        }

        // Detectar empresa inicial
        setTimeout(() => this.detectarEmpresaActual(), 1000);
    }

    detectarEmpresaActual() {
        const selector = document.getElementById('companySelector');
        if (!selector) return;

        const empresaActiva = selector.querySelector('.active, [data-selected="true"], .selected');
        if (empresaActiva) {
            const nuevaEmpresa = empresaActiva.dataset.empresaId || 
                                empresaActiva.dataset.id || 
                                this.extraerIdEmpresa(empresaActiva.textContent);

            if (nuevaEmpresa !== this.empresaActual) {
                this.empresaActual = nuevaEmpresa;
                this.actualizarInterfazParaEmpresa();
                this.cargarNotificacionesEmpresa();
            }
        }
    }

    extraerIdEmpresa(texto) {
        return texto.toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9\-]/g, '');
    }

    actualizarInterfazParaEmpresa() {
        const display = document.getElementById('empresaActualDisplay');
        if (display && this.empresaActual) {
            display.textContent = this.formatearNombreEmpresa(this.empresaActual);
        }
    }

    formatearNombreEmpresa(empresaId) {
        return empresaId.split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
    }

    analizarMetricas(datos) {
        if (!this.empresaActual || !datos) return;

        // Análisis inteligente de métricas
        this.verificarAlertas(datos);
    }

    verificarAlertas(datos) {
        const metricas = window.GrizalumMetrics?.getCurrentMetrics();
        if (!metricas) return;

        // Verificar flujo de caja bajo
        this.verificarFlujoCajaBajo(metricas);
        
        // Verificar gastos elevados
        this.verificarGastosElevados(metricas);
        
        // Verificar oportunidades de crecimiento
        this.verificarOportunidades(metricas);
    }

    verificarFlujoCajaBajo(metricas) {
        const cashFlow = metricas.sidebarCashFlow?.value || 0;
        const gastos = metricas.expensesValue?.value || 0;

        if (gastos > 0 && cashFlow < (gastos * this.reglasNotificacion.cashFlowBajo.umbral)) {
            this.crearNotificacion({
                categoria: 'FINANCIERO',
                prioridad: 'critica',
                titulo: 'Flujo de Caja Crítico',
                mensaje: `Tu flujo de caja (S/. ${this.formatearMonto(cashFlow)}) está por debajo del 30% de tus gastos mensuales`,
                acciones: [
                    { texto: 'Ver Detalles', accion: 'verFlujoCaja' },
                    { texto: 'Generar Reporte', accion: 'generarReporte' }
                ]
            });
        }
    }

    verificarGastosElevados(metricas) {
        const gastos = metricas.expensesValue?.value || 0;
        const promedioHistorico = this.obtenerPromedioGastos();

        if (promedioHistorico > 0 && gastos > (promedioHistorico * 1.2)) {
            this.crearNotificacion({
                categoria: 'FINANCIERO',
                prioridad: 'alta',
                titulo: 'Gastos Elevados Detectados',
                mensaje: `Tus gastos actuales superan en 20% el promedio histórico`,
                acciones: [
                    { texto: 'Analizar Gastos', accion: 'analizarGastos' }
                ]
            });
        }
    }

    verificarOportunidades(metricas) {
        const crecimiento = metricas.growthValue?.value || 0;
        
        if (crecimiento >= 15) {
            this.crearNotificacion({
                categoria: 'OPORTUNIDAD',
                prioridad: 'media',
                titulo: 'Excelente Crecimiento',
                mensaje: `¡Felicitaciones! Tu empresa está creciendo un ${crecimiento}%`,
                acciones: [
                    { texto: 'Ver Tendencias', accion: 'verTendencias' }
                ]
            });
        }
    }

    crearNotificacion(config) {
        if (!this.empresaActual) return;

        // Evitar duplicados recientes
        if (this.existeNotificacionReciente(config.titulo)) return;

        const notificacion = {
            id: `not-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            categoria: config.categoria || 'SISTEMA',
            prioridad: config.prioridad || 'media',
            titulo: config.titulo,
            mensaje: config.mensaje,
            acciones: config.acciones || [],
            fecha: new Date().toISOString(),
            leida: false,
            empresaId: this.empresaActual
        };

        // Agregar a la empresa actual
        const notificacionesEmpresa = this.notificaciones.get(this.empresaActual) || [];
        notificacionesEmpresa.unshift(notificacion);

        // Limitar número de notificaciones
        if (notificacionesEmpresa.length > this.configuracion.maxNotificaciones) {
            notificacionesEmpresa.splice(this.configuracion.maxNotificaciones);
        }

        this.notificaciones.set(this.empresaActual, notificacionesEmpresa);
        
        // Actualizar interfaz
        this.actualizarContador();
        this.renderizarNotificaciones();
        
        // Efecto de nueva notificación
        this.mostrarEfectoNuevaNotificacion(notificacion);

        return notificacion.id;
    }

    existeNotificacionReciente(titulo) {
        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        const tiempoLimite = Date.now() - (5 * 60 * 1000); // 5 minutos
        
        return notificaciones.some(n => 
            n.titulo === titulo && 
            new Date(n.fecha).getTime() > tiempoLimite
        );
    }

    actualizarContador() {
        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        const noLeidas = notificaciones.filter(n => !n.leida);
        const contador = document.getElementById('notificationCount');
        
        if (contador) {
            contador.textContent = noLeidas.length;
            contador.classList.toggle('active', noLeidas.length > 0);
        }

        // Actualizar indicadores de prioridad
        this.actualizarIndicadoresPrioridad(noLeidas);
        
        // Actualizar estadísticas
        this.actualizarEstadisticas(notificaciones);
    }

    actualizarIndicadoresPrioridad(notificaciones) {
        const indicadores = document.getElementById('notificationPriorities');
        if (!indicadores) return;

        const criticas = notificaciones.filter(n => n.prioridad === 'critica').length;
        const altas = notificaciones.filter(n => n.prioridad === 'alta').length;
        const medias = notificaciones.filter(n => n.prioridad === 'media').length;

        indicadores.querySelector('.critical').classList.toggle('active', criticas > 0);
        indicadores.querySelector('.high').classList.toggle('active', altas > 0);
        indicadores.querySelector('.medium').classList.toggle('active', medias > 0);
    }

    actualizarEstadisticas(notificaciones) {
        const statCriticas = document.getElementById('statCriticas');
        const statImportantes = document.getElementById('statImportantes');
        const statTotal = document.getElementById('statTotal');

        if (statCriticas) {
            statCriticas.textContent = notificaciones.filter(n => n.prioridad === 'critica').length;
        }
        if (statImportantes) {
            statImportantes.textContent = notificaciones.filter(n => n.prioridad === 'alta').length;
        }
        if (statTotal) {
            statTotal.textContent = notificaciones.length;
        }
    }

    renderizarNotificaciones(filtro = 'todas') {
        const lista = document.getElementById('notificationList');
        if (!lista) return;

        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        let notificacionesFiltradas = this.filtrarPorTipo(notificaciones, filtro);

        if (notificacionesFiltradas.length === 0) {
            lista.innerHTML = this.renderizarEstadoVacio(filtro);
            return;
        }

        lista.innerHTML = notificacionesFiltradas.map(notif => 
            this.renderizarNotificacion(notif)
        ).join('');

        // Agregar eventos a las notificaciones
        this.agregarEventosNotificaciones();
    }

    filtrarPorTipo(notificaciones, filtro) {
        switch (filtro) {
            case 'critica':
                return notificaciones.filter(n => n.prioridad === 'critica');
            case 'alta':
                return notificaciones.filter(n => n.prioridad === 'alta');
            case 'media':
                return notificaciones.filter(n => n.prioridad === 'media');
            default:
                return notificaciones;
        }
    }

    renderizarNotificacion(notif) {
        const categoria = this.categorias[notif.categoria] || this.categorias.SISTEMA;
        const claseNoLeida = !notif.leida ? 'unread' : '';
        const clasePrioridad = notif.prioridad === 'critica' ? 'critical' : '';

        return `
            <div class="notification-item-premium ${claseNoLeida} ${clasePrioridad}" 
                 data-id="${notif.id}" 
                 data-categoria="${notif.categoria}"
                 data-prioridad="${notif.prioridad}">
                <div class="notification-item-content">
                    <div class="notification-category-icon" style="background: ${categoria.color}">
                        <i class="${categoria.icono}"></i>
                    </div>
                    <div class="notification-text">
                        <div class="notification-title">${notif.titulo}</div>
                        <div class="notification-message">${notif.mensaje}</div>
                        <div class="notification-meta">
                            <div class="notification-time">${this.formatearTiempo(notif.fecha)}</div>
                            <div class="notification-priority priority-${notif.prioridad}">
                                ${notif.prioridad}
                            </div>
                        </div>
                        ${this.renderizarAcciones(notif.acciones)}
                    </div>
                </div>
            </div>
        `;
    }

    renderizarAcciones(acciones) {
        if (!acciones || acciones.length === 0) return '';

        return `
            <div class="notification-actions" style="margin-top: 8px; display: flex; gap: 6px;">
                ${acciones.map(accion => `
                    <button class="action-btn" data-accion="${accion.accion}" style="
                        padding: 4px 8px;
                        background: rgba(212, 175, 55, 0.1);
                        border: 1px solid rgba(212, 175, 55, 0.3);
                        border-radius: 4px;
                        font-size: 11px;
                        color: #d4af37;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">
                        ${accion.texto}
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderizarEstadoVacio(filtro) {
        const mensajes = {
            'todas': 'No tienes notificaciones',
            'critica': 'No tienes notificaciones críticas',
            'alta': 'No tienes notificaciones importantes',
            'media': 'No tienes notificaciones generales'
        };

        return `
            <div class="empty-notifications">
                <i class="fas fa-bell-slash"></i>
                <h4>${mensajes[filtro]}</h4>
                <p>Cuando tengas nuevas notificaciones aparecerán aquí</p>
            </div>
        `;
    }

    agregarEventosNotificaciones() {
        // Click en notificación para marcar como leída
        document.querySelectorAll('.notification-item-premium').forEach(item => {
            item.addEventListener('click', () => {
                this.marcarComoLeida(item.dataset.id);
            });
        });

        // Click en acciones
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.ejecutarAccion(btn.dataset.accion);
            });
        });
    }

    formatearTiempo(fecha) {
        const ahora = new Date();
        const fechaNotif = new Date(fecha);
        const diff = ahora - fechaNotif;

        if (diff < 60000) return 'Ahora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
        
        return fechaNotif.toLocaleDateString('es-PE', { 
            day: 'numeric', 
            month: 'short' 
        });
    }

    formatearMonto(valor) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    }

    obtenerPromedioGastos() {
        // Simulación - en producción conectar con datos históricos
        return 25000;
    }

    mostrarEfectoNuevaNotificacion(notificacion) {
        // Efecto visual en el botón
        const boton = document.getElementById('grizalumNotificationBtn');
        if (boton) {
            boton.style.animation = 'none';
            setTimeout(() => {
                boton.style.animation = 'notificationPulse 0.6s ease-out';
            }, 10);
        }

        // Sonido de notificación (opcional)
        if (this.configuracion.sonidoActivado && notificacion.prioridad === 'critica') {
            this.reproducirSonidoNotificacion();
        }
    }

    reproducirSonidoNotificacion() {
        // Sonido sutil para notificaciones críticas
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    togglePanel() {
        const panel = document.getElementById('grizalumNotificationPanel');
        if (!panel) return;

        const isActive = panel.classList.contains('active');
        
        if (isActive) {
            this.cerrarPanel();
        } else {
            this.abrirPanel();
        }
    }

    abrirPanel() {
        const panel = document.getElementById('grizalumNotificationPanel');
        if (panel) {
            panel.classList.add('active');
            this.cargarNotificacionesEmpresa();
            
            // Marcar notificaciones como vistas (no leídas, pero vistas)
            setTimeout(() => {
                this.marcarNotificacionesComoVistas();
            }, 1000);
        }
    }

    cerrarPanel() {
        const panel = document.getElementById('grizalumNotificationPanel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    cargarNotificacionesEmpresa() {
        if (!this.empresaActual) {
            this.generarNotificacionesEjemplo();
        }
        
        this.renderizarNotificaciones();
        this.actualizarContador();
    }

    generarNotificacionesEjemplo() {
        if (!this.empresaActual) return;

        const notificacionesEjemplo = [
            {
                categoria: 'FINANCIERO',
                prioridad: 'alta',
                titulo: 'Revisión de Flujo de Caja',
                mensaje: 'Es recomendable revisar tu flujo de caja para el próximo trimestre',
                acciones: [
                    { texto: 'Ver Reporte', accion: 'verReporte' }
                ]
            },
            {
                categoria: 'OPORTUNIDAD',
                prioridad: 'media',
                titulo: 'Oportunidad de Crecimiento',
                mensaje: 'Tus métricas muestran potencial para expandir operaciones',
                acciones: [
                    { texto: 'Analizar', accion: 'analizar' }
                ]
            }
        ];

        notificacionesEjemplo.forEach(config => {
            this.crearNotificacion(config);
        });
    }

    marcarComoLeida(notificacionId) {
        if (!this.empresaActual) return;

        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        const notificacion = notificaciones.find(n => n.id === notificacionId);
        
        if (notificacion && !notificacion.leida) {
            notificacion.leida = true;
            this.actualizarContador();
            this.renderizarNotificaciones();
        }
    }

    marcarTodasComoLeidas() {
        if (!this.empresaActual) return;

        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        notificaciones.forEach(n => n.leida = true);
        
        this.actualizarContador();
        this.renderizarNotificaciones();
    }

    limpiarTodasLasNotificaciones() {
        if (!this.empresaActual) return;

        this.notificaciones.set(this.empresaActual, []);
        this.actualizarContador();
        this.renderizarNotificaciones();
    }

    filtrarNotificaciones(filtro) {
        this.renderizarNotificaciones(filtro);
    }

    ejecutarAccion(accion) {
        switch (accion) {
            case 'verFlujoCaja':
                console.log('Navegando a flujo de caja...');
                // Aquí conectar con tu sistema de navegación
                break;
            case 'generarReporte':
                console.log('Generando reporte...');
                // Aquí conectar con tu sistema de reportes
                break;
            case 'analizarGastos':
                console.log('Analizando gastos...');
                break;
            default:
                console.log('Acción:', accion);
        }
    }

    exportarNotificaciones() {
        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        const datos = {
            empresa: this.empresaActual,
            fecha: new Date().toISOString(),
            notificaciones: notificaciones
        };

        const blob = new Blob([JSON.stringify(datos, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `notificaciones-${this.empresaActual}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    iniciarVerificacionesPeriodicas() {
        // Verificaciones cada 5 minutos
        setInterval(() => {
            this.ejecutarVerificacionesAutomaticas();
        }, 5 * 60 * 1000);

        // Limpieza diaria
        setInterval(() => {
            this.limpiarNotificacionesAntiguas();
        }, 24 * 60 * 60 * 1000);
    }

    ejecutarVerificacionesAutomaticas() {
        if (!this.empresaActual) return;

        // Solo ejecutar verificaciones si no hay notificaciones críticas recientes
        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        const criticasRecientes = notificaciones.filter(n => 
            n.prioridad === 'critica' && 
            Date.now() - new Date(n.fecha).getTime() < 30 * 60 * 1000 // 30 minutos
        );

        if (criticasRecientes.length === 0) {
            const metricas = window.GrizalumMetrics?.getCurrentMetrics();
            if (metricas) {
                this.verificarAlertas({ data: metricas });
            }
        }
    }

    limpiarNotificacionesAntiguas() {
        this.notificaciones.forEach((notificaciones, empresaId) => {
            const limite = Date.now() - this.configuracion.tiempoLimpieza;
            const notificacionesLimpias = notificaciones.filter(n => 
                new Date(n.fecha).getTime() > limite
            );
            
            if (notificacionesLimpias.length !== notificaciones.length) {
                this.notificaciones.set(empresaId, notificacionesLimpias);
            }
        });
    }

    crearAPI() {
        window.GrizalumNotificacionesPremium = {
            crear: (config) => this.crearNotificacion(config),
            obtener: () => this.notificaciones.get(this.empresaActual) || [],
            marcarLeida: (id) => this.marcarComoLeida(id),
            limpiar: () => this.limpiarTodasLasNotificaciones(),
            estado: () => ({
                empresa: this.empresaActual,
                total: (this.notificaciones.get(this.empresaActual) || []).length,
                noLeidas: (this.notificaciones.get(this.empresaActual) || []).filter(n => !n.leida).length
            })
        };

        // Compatibilidad con API anterior
        window.mostrarNotificacion = (mensaje, tipo = 'info') => {
            const categorias = {
                'error': 'FINANCIERO',
                'warning': 'VENCIMIENTO', 
                'success': 'OPORTUNIDAD',
                'info': 'SISTEMA'
            };

            const prioridades = {
                'error': 'critica',
                'warning': 'alta',
                'success': 'media',
                'info': 'baja'
            };

            return this.crearNotificacion({
                categoria: categorias[tipo] || 'SISTEMA',
                prioridad: prioridades[tipo] || 'media',
                titulo: tipo === 'error' ? 'Alerta' : tipo === 'warning' ? 'Atención' : 
                       tipo === 'success' ? 'Éxito' : 'Información',
                mensaje: mensaje
            });
        };
    }
}

// Clase auxiliar para monitoreo financiero
class FinancialMonitor {
    constructor(metrica, reglas) {
        this.metrica = metrica;
        this.reglas = reglas;
        this.historial = [];
    }

    actualizar(valor) {
        this.historial.push({
            valor: valor,
            fecha: new Date().toISOString()
        });

        // Mantener solo últimos 30 valores
        if (this.historial.length > 30) {
            this.historial = this.historial.slice(-30);
        }
    }

    obtenerPromedio() {
        if (this.historial.length === 0) return 0;
        const suma = this.historial.reduce((acc, item) => acc + item.valor, 0);
        return suma / this.historial.length;
    }

    detectarTendencia() {
        if (this.historial.length < 5) return 'estable';
        
        const ultimos5 = this.historial.slice(-5);
        const primeros3 = ultimos5.slice(0, 3);
        const ultimos2 = ultimos5.slice(-2);
        
        const promedioInicial = primeros3.reduce((acc, item) => acc + item.valor, 0) / 3;
        const promedioFinal = ultimos2.reduce((acc, item) => acc + item.valor, 0) / 2;
        
        const diferencia = (promedioFinal - promedioInicial) / promedioInicial;
        
        if (diferencia > 0.1) return 'creciente';
        if (diferencia < -0.1) return 'decreciente';
        return 'estable';
    }
}

// Inicialización
const grizalumNotificacionesPremium = new GrizalumNotificacionesPremium();

console.log('✨ GRIZALUM Notificaciones Premium v2.0 cargado');
console.log('🎯 Características Premium:');
console.log('  • 🎨 Interfaz premium con animaciones suaves');
console.log('  • 🧠 Análisis inteligente de métricas financieras');
console.log('  • 🔔 Notificaciones por categorías y prioridades');
console.log('  • 📊 Estadísticas y filtros avanzados');
console.log('  • 🎵 Efectos sonoros para alertas críticas');
console.log('  • 📁 Exportación de notificaciones');
console.log('  • 🔄 Verificaciones automáticas periódicas');
console.log('  • 📱 Diseño completamente responsive');
