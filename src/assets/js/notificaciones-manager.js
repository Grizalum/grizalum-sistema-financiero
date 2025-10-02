/**
 * ================================================================
 * GRIZALUM NOTIFICACIONES PREMIUM v3.0 - DISEÑO ULTRA MODERNO
 * Mantiene toda la funcionalidad + Mejora visual dramática
 * ================================================================
 */

class GrizalumNotificacionesPremium {
    constructor() {
        this.version = '3.0.0';
        this.empresaActual = null;
        this.notificaciones = new Map();
        this.categorias = {
            FINANCIERO: { color: '#d4af37', icono: 'fas fa-coins', gradient: 'linear-gradient(135deg, #d4af37, #f1c40f)' },
            VENCIMIENTO: { color: '#e74c3c', icono: 'fas fa-exclamation-triangle', gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)' },
            OPORTUNIDAD: { color: '#27ae60', icono: 'fas fa-chart-line', gradient: 'linear-gradient(135deg, #27ae60, #2ecc71)' },
            SISTEMA: { color: '#3498db', icono: 'fas fa-cog', gradient: 'linear-gradient(135deg, #3498db, #2980b9)' },
            RECORDATORIO: { color: '#9b59b6', icono: 'fas fa-bell', gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)' }
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
        this.crearBoton();
        this.crearPanel();
        this.inyectarEstilos();
        this.conectarSistema();
        this.crearAPI();
        console.log('✅ Notificaciones Premium v3.0 - Ultra Moderno Activado');
    }

    crearBoton() {
        const existente = document.getElementById('grizalumNotificationBtn');
        if (existente) existente.remove();

        const boton = document.createElement('button');
        boton.id = 'grizalumNotificationBtn';
        boton.innerHTML = `
            <div class="notification-btn-content">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" id="notificationBadge">0</span>
            </div>
        `;
        
        document.body.appendChild(boton);
        boton.addEventListener('click', () => this.togglePanel());
    }

    crearPanel() {
        const existente = document.getElementById('grizalumNotificationPanel');
        if (existente) existente.remove();

        const panel = document.createElement('div');
        panel.id = 'grizalumNotificationPanel';
        panel.innerHTML = `
            <div class="notification-header-premium">
                <div class="header-title-section">
                    <i class="fas fa-bell header-bell-icon"></i>
                    <div class="header-text">
                        <h3>Centro de Notificaciones</h3>
                        <span class="company-name" id="empresaDisplay">GRIZALUM</span>
                    </div>
                </div>
                <button class="close-panel-btn" onclick="instanciaNotificaciones.togglePanel()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="notification-stats-premium">
                <div class="stat-card critical">
                    <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
                    <div class="stat-info">
                        <span class="stat-number" id="statCriticas">0</span>
                        <span class="stat-label">Críticas</span>
                    </div>
                </div>
                <div class="stat-card important">
                    <div class="stat-icon"><i class="fas fa-star"></i></div>
                    <div class="stat-info">
                        <span class="stat-number" id="statImportantes">0</span>
                        <span class="stat-label">Importantes</span>
                    </div>
                </div>
                <div class="stat-card total">
                    <div class="stat-icon"><i class="fas fa-inbox"></i></div>
                    <div class="stat-info">
                        <span class="stat-number" id="statTotal">0</span>
                        <span class="stat-label">Total</span>
                    </div>
                </div>
            </div>

            <div class="notification-filters-premium">
                <button class="filter-btn-premium active" data-filter="todas">
                    <i class="fas fa-list"></i> Todas
                </button>
                <button class="filter-btn-premium" data-filter="critica">
                    <i class="fas fa-exclamation-triangle"></i> Críticas
                </button>
                <button class="filter-btn-premium" data-filter="alta">
                    <i class="fas fa-star"></i> Importantes
                </button>
            </div>

            <div class="notification-list-premium" id="notificationList"></div>

            <div class="notification-footer-premium">
                <button id="markAllReadBtn" class="mark-read-btn">
                    <i class="fas fa-check-double"></i> Marcar todas como leídas
                </button>
            </div>
        `;

        document.body.appendChild(panel);
        this.configurarEventos();
    }

    inyectarEstilos() {
        if (document.getElementById('grizalum-notifications-styles')) return;
        const styles = document.createElement('style');
        styles.id = 'grizalum-notifications-styles';
        styles.textContent = `
            /* BOTÓN FLOTANTE MEJORADO */
            #grizalumNotificationBtn {
                position: fixed;
                top: 120px;
                right: 20px;
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #d4af37 0%, #f1c40f 100%);
                border: none;
                border-radius: 50%;
                box-shadow: 0 10px 40px rgba(212, 175, 55, 0.5);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #grizalumNotificationBtn:hover {
                transform: scale(1.1) translateY(-2px);
                box-shadow: 0 15px 50px rgba(212, 175, 55, 0.6);
            }

            #grizalumNotificationBtn:active {
                transform: scale(0.95);
            }

            .notification-btn-content {
                position: relative;
            }

            #grizalumNotificationBtn i {
                color: white;
                font-size: 24px;
                animation: bellRing 2s ease-in-out infinite;
            }

            @keyframes bellRing {
                0%, 100% { transform: rotate(0deg); }
                10%, 30% { transform: rotate(-10deg); }
                20%, 40% { transform: rotate(10deg); }
            }

            .notification-badge {
                position: absolute;
                top: -12px;
                right: -12px;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                font-size: 12px;
                font-weight: 700;
                display: none;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(231, 76, 60, 0.5);
                animation: pulse 2s ease-in-out infinite;
            }

            .notification-badge.active {
                display: flex;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            /* PANEL PRINCIPAL PREMIUM */
            #grizalumNotificationPanel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 440px;
                max-height: 650px;
                background: #ffffff;
                border-radius: 24px;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
                z-index: 9998;
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #grizalumNotificationPanel.active {
                display: flex;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            /* HEADER PREMIUM */
            .notification-header-premium {
                background: linear-gradient(135deg, #d4af37 0%, #f1c40f 100%);
                padding: 24px;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                overflow: hidden;
            }

            .notification-header-premium::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -10%;
                width: 200px;
                height: 200px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
            }

            .header-title-section {
                display: flex;
                align-items: center;
                gap: 16px;
                position: relative;
                z-index: 1;
            }

            .header-bell-icon {
                font-size: 28px;
                animation: bellRing 2s ease-in-out infinite;
            }

            .header-text h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 700;
            }

            .company-name {
                font-size: 13px;
                opacity: 0.9;
                font-weight: 500;
            }

            .close-panel-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
                z-index: 1;
            }

            .close-panel-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            /* ESTADÍSTICAS PREMIUM */
            .notification-stats-premium {
                padding: 20px;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                background: linear-gradient(to bottom, #f8f9fa, #ffffff);
            }

            .stat-card {
                background: white;
                border-radius: 16px;
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                transition: all 0.3s;
                border: 2px solid transparent;
            }

            .stat-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            }

            .stat-card.critical {
                border-color: rgba(231, 76, 60, 0.2);
            }

            .stat-card.critical .stat-icon {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
            }

            .stat-card.important {
                border-color: rgba(241, 196, 15, 0.2);
            }

            .stat-card.important .stat-icon {
                background: linear-gradient(135deg, #f1c40f, #f39c12);
            }

            .stat-card.total {
                border-color: rgba(52, 152, 219, 0.2);
            }

            .stat-card.total .stat-icon {
                background: linear-gradient(135deg, #3498db, #2980b9);
            }

            .stat-icon {
                width: 40px;
                height: 40px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
            }

            .stat-info {
                display: flex;
                flex-direction: column;
            }

            .stat-number {
                font-size: 22px;
                font-weight: 700;
                color: #2c3e50;
                line-height: 1;
            }

            .stat-label {
                font-size: 11px;
                color: #7f8c8d;
                margin-top: 4px;
            }

            /* FILTROS PREMIUM */
            .notification-filters-premium {
                padding: 16px 20px;
                display: flex;
                gap: 10px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .filter-btn-premium {
                flex: 1;
                padding: 10px 16px;
                border: 2px solid #dee2e6;
                background: white;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }

            .filter-btn-premium:hover {
                border-color: #d4af37;
                transform: translateY(-1px);
            }

            .filter-btn-premium.active {
                background: linear-gradient(135deg, #d4af37, #f1c40f);
                color: white;
                border-color: #d4af37;
                box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
            }

            /* LISTA DE NOTIFICACIONES PREMIUM */
            .notification-list-premium {
                flex: 1;
                overflow-y: auto;
                max-height: 320px;
                padding: 8px;
            }

            .notification-list-premium::-webkit-scrollbar {
                width: 6px;
            }

            .notification-list-premium::-webkit-scrollbar-thumb {
                background: #d4af37;
                border-radius: 3px;
            }

            .notification-item {
                margin: 8px;
                padding: 18px;
                background: white;
                border-radius: 16px;
                display: flex;
                gap: 14px;
                cursor: pointer;
                transition: all 0.3s;
                border: 2px solid #f1f3f4;
                position: relative;
                overflow: hidden;
            }

            .notification-item::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: transparent;
                transition: all 0.3s;
            }

            .notification-item:hover {
                transform: translateX(4px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                border-color: #e9ecef;
            }

            .notification-item.unread {
                background: linear-gradient(to right, rgba(212, 175, 55, 0.08), white);
                border-color: rgba(212, 175, 55, 0.3);
            }

            .notification-item.unread::before {
                background: linear-gradient(to bottom, #d4af37, #f1c40f);
            }

            .notification-item.admin {
                background: linear-gradient(to right, rgba(139, 92, 246, 0.08), white);
                border-color: rgba(139, 92, 246, 0.3);
            }

            .notification-item.admin::before {
                background: linear-gradient(to bottom, #8b5cf6, #7c3aed);
            }

            .notification-icon {
                width: 48px;
                height: 48px;
                min-width: 48px;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .notification-content {
                flex: 1;
                min-width: 0;
            }

            .notification-title {
                font-weight: 700;
                font-size: 15px;
                margin-bottom: 6px;
                color: #2c3e50;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .notification-message {
                font-size: 13px;
                color: #7f8c8d;
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .notification-time {
                font-size: 11px;
                color: #95a5a6;
                margin-top: 8px;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .notification-time::before {
                content: '⏰';
                font-size: 10px;
            }

            /* FOOTER PREMIUM */
            .notification-footer-premium {
                padding: 16px 20px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
            }

            .mark-read-btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #d4af37, #f1c40f);
                color: white;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s;
            }

            .mark-read-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
            }

            .mark-read-btn:active {
                transform: translateY(0);
            }

            /* ESTADO VACÍO */
            .empty-state {
                padding: 60px 20px;
                text-align: center;
                color: #95a5a6;
            }

            .empty-state::before {
                content: '📭';
                font-size: 48px;
                display: block;
                margin-bottom: 16px;
            }

            /* RESPONSIVE */
            @media (max-width: 768px) {
                #grizalumNotificationPanel {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }

                .notification-stats-premium {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    configurarEventos() {
        document.querySelectorAll('.filter-btn-premium').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn-premium').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderizar(btn.dataset.filter);
            });
        });
        document.getElementById('markAllReadBtn').addEventListener('click', () => this.marcarTodasLeidas());
    }

    conectarSistema() {
        setTimeout(() => this.detectarEmpresa(), 1000);
        const observer = new MutationObserver(() => this.detectarEmpresa());
        const selector = document.getElementById('companySelector');
        if (selector) observer.observe(selector, { childList: true, subtree: true });
    }

    detectarEmpresa() {
        let nombreEmpresa = null;
        const selector = document.getElementById('companySelector');
        if (selector) {
            const activa = selector.querySelector('.active, [data-selected="true"], .selected');
            if (activa) nombreEmpresa = activa.textContent?.trim();
        }
        
        if (nombreEmpresa && nombreEmpresa.length > 0) {
            const nombreLimpio = nombreEmpresa.replace(/[^\w\s]/g, '').trim();
            const empresaKey = nombreLimpio
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .split('-')
                .slice(0, 2)
                .join('-');
            
            if (empresaKey !== this.empresaActual) {
                this.empresaActual = empresaKey;
                this.actualizarDisplay();
                this.cargarNotificaciones();
                console.log(`🏢 Empresa detectada: ${empresaKey}`);
            }
        }
    }

    actualizarDisplay() {
        const display = document.getElementById('empresaDisplay');
        if (display && this.empresaActual) {
            display.textContent = this.empresaActual.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
    }

    crearNotificacion(config) {
        if (!this.empresaActual) return;
        const notif = {
            id: `not-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            categoria: config.categoria || 'SISTEMA',
            prioridad: config.prioridad || 'media',
            titulo: config.titulo,
            mensaje: config.mensaje,
            fecha: new Date().toISOString(),
            leida: false,
            esAdmin: config.esAdmin || false
        };
        const notifs = this.notificaciones.get(this.empresaActual) || [];
        notifs.unshift(notif);
        this.notificaciones.set(this.empresaActual, notifs);
        this.actualizarContador();
        this.renderizar();
        return notif.id;
    }

    marcarLeida(id) {
        if (!this.empresaActual) return;
        const notifs = this.notificaciones.get(this.empresaActual) || [];
        const notif = notifs.find(n => n.id === id);
        if (notif) {
            notif.leida = true;
            this.actualizarContador();
            this.renderizar();
        }
    }

    marcarTodasLeidas() {
        if (!this.empresaActual) return;
        const notifs = this.notificaciones.get(this.empresaActual) || [];
        notifs.forEach(n => n.leida = true);
        this.actualizarContador();
        this.renderizar();
    }

    actualizarContador() {
        const notifs = this.notificaciones.get(this.empresaActual) || [];
        const noLeidas = notifs.filter(n => !n.leida).length;
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = noLeidas;
            badge.classList.toggle('active', noLeidas > 0);
        }
        document.getElementById('statCriticas').textContent = notifs.filter(n => n.prioridad === 'critica').length;
        document.getElementById('statImportantes').textContent = notifs.filter(n => n.prioridad === 'alta').length;
        document.getElementById('statTotal').textContent = notifs.length;
    }

    renderizar(filtro = 'todas') {
        const lista = document.getElementById('notificationList');
        if (!lista) return;
        const notifs = this.notificaciones.get(this.empresaActual) || [];
        let filtradas = filtro === 'todas' ? notifs : notifs.filter(n => n.prioridad === filtro);
        
        if (filtradas.length === 0) {
            lista.innerHTML = '<div class="empty-state">No hay notificaciones</div>';
            return;
        }

        lista.innerHTML = filtradas.map(notif => {
            const cat = this.categorias[notif.categoria] || this.categorias.SISTEMA;
            const admin = notif.esAdmin ? 'admin' : '';
            const pref = notif.esAdmin ? '🎖️ [ADMIN] ' : '';
            const tiempo = this.formatearTiempo(notif.fecha);
            return `
                <div class="notification-item ${!notif.leida ? 'unread' : ''} ${admin}" data-id="${notif.id}">
                    <div class="notification-icon" style="background:${cat.gradient}">
                        <i class="${cat.icono}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${pref}${notif.titulo}</div>
                        <div class="notification-message">${notif.mensaje}</div>
                        <div class="notification-time">${tiempo}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => this.marcarLeida(item.dataset.id));
        });
    }

    formatearTiempo(fecha) {
        const diff = Date.now() - new Date(fecha).getTime();
        if (diff < 60000) return 'Ahora mismo';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} horas`;
        return `Hace ${Math.floor(diff / 86400000)} días`;
    }

    togglePanel() {
        const panel = document.getElementById('grizalumNotificationPanel');
        panel?.classList.toggle('active');
        if (panel?.classList.contains('active')) this.cargarNotificaciones();
    }

    cargarNotificaciones() {
        this.actualizarContador();
        this.renderizar();
    }

    crearAPI() {
        window.GrizalumNotificacionesPremium = {
            crear: (c) => instanciaNotificaciones.crearNotificacion(c),
            obtener: (empresaId) => {
                const id = empresaId || instanciaNotificaciones.empresaActual;
                return instanciaNotificaciones.notificaciones.get(id) || [];
            },
            recibirDelAdmin: (empresaId, titulo, mensaje, tipo = 'admin') => {
                try {
                    console.log(`📨 [ADMIN] → ${empresaId}: ${titulo}`);
                    const map = {
                        admin: { cat: 'SISTEMA', prio: 'alta' },
                        info: { cat: 'SISTEMA', prio: 'media' },
                        warning: { cat: 'VENCIMIENTO', prio: 'alta' },
                        urgent: { cat: 'FINANCIERO', prio: 'critica' },
                        success: { cat: 'OPORTUNIDAD', prio: 'media' }
                    };
                    const cfg = map[tipo] || map['admin'];
                    const notif = {
                        id: `not-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                        categoria: cfg.cat,
                        prioridad: cfg.prio,
                        titulo, 
                        mensaje,
                        fecha: new Date().toISOString(),
                        leida: false,
                        esAdmin: true
                    };
                    const notifs = instanciaNotificaciones.notificaciones.get(empresaId) || [];
                    notifs.unshift(notif);
                    instanciaNotificaciones.notificaciones.set(empresaId, notifs);
                    
                    if (instanciaNotificaciones.empresaActual === empresaId) {
                        setTimeout(() => {
                            instanciaNotificaciones.actualizarContador();
                            instanciaNotificaciones.renderizar();
                        }, 200);
                    }
                    
                    console.log(`✅ Notificación guardada para ${empresaId}. Total: ${notifs.length}`);
                    return notif.id;
                } catch (e) {
                    console.error('❌ Error al crear notificación:', e);
                    return null;
                }
            }
        };
        console.log('📡 API de Notificaciones lista');
    }
}

const instanciaNotificaciones = new GrizalumNotificacionesPremium();
window.instanciaNotificaciones = instanciaNotificaciones;

setTimeout(() => {
    if (window.adminEmpresas && window.GrizalumNotificacionesPremium) {
        console.log('🎉 Admin ↔ Notificaciones CONECTADO EXITOSAMENTE');
    }
}, 2000);
