/**
 * ================================================================
 * GRIZALUM NOTIFICACIONES PREMIUM - VERSIÓN CORREGIDA
 * Conexión perfecta con Panel Admin
 * ================================================================
 */

class GrizalumNotificacionesPremium {
    constructor() {
        this.version = '2.6.0';
        this.empresaActual = null;
        this.notificaciones = new Map();
        this.categorias = {
            FINANCIERO: { color: '#d4af37', icono: 'fas fa-coins' },
            VENCIMIENTO: { color: '#e74c3c', icono: 'fas fa-exclamation-triangle' },
            OPORTUNIDAD: { color: '#27ae60', icono: 'fas fa-chart-line' },
            SISTEMA: { color: '#3498db', icono: 'fas fa-cog' },
            RECORDATORIO: { color: '#9b59b6', icono: 'fas fa-bell' }
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
        console.log('✅ Notificaciones Premium v2.6 - Conectado con Admin');
    }

    crearBoton() {
        const existente = document.getElementById('grizalumNotificationBtn');
        if (existente) existente.remove();

        const boton = document.createElement('button');
        boton.id = 'grizalumNotificationBtn';
        boton.innerHTML = '<i class="fas fa-bell"></i><span class="notification-badge" id="notificationBadge">0</span>';
        
        document.body.appendChild(boton);
        boton.addEventListener('click', () => this.togglePanel());
    }

    crearPanel() {
        const existente = document.getElementById('grizalumNotificationPanel');
        if (existente) existente.remove();

        const panel = document.createElement('div');
        panel.id = 'grizalumNotificationPanel';
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Centro de Notificaciones</h3>
                <span id="empresaDisplay">GRIZALUM</span>
            </div>
            <div class="notification-filters">
                <button class="filter-btn active" data-filter="todas">Todas</button>
                <button class="filter-btn" data-filter="critica">Críticas</button>
                <button class="filter-btn" data-filter="alta">Importantes</button>
            </div>
            <div class="notification-stats">
                <div class="stat"><span class="stat-number" id="statCriticas">0</span><span class="stat-label">Críticas</span></div>
                <div class="stat"><span class="stat-number" id="statImportantes">0</span><span class="stat-label">Importantes</span></div>
                <div class="stat"><span class="stat-number" id="statTotal">0</span><span class="stat-label">Total</span></div>
            </div>
            <div class="notification-list" id="notificationList"></div>
            <div class="notification-footer">
                <button id="markAllReadBtn"><i class="fas fa-check-double"></i> Marcar leídas</button>
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
            #grizalumNotificationBtn{position:fixed;top:120px;right:20px;width:60px;height:60px;background:linear-gradient(135deg,#d4af37,#f1c40f);border:none;border-radius:50%;box-shadow:0 8px 25px rgba(212,175,55,.4);cursor:pointer;z-index:9999;display:flex;align-items:center;justify-content:center}
            #grizalumNotificationBtn:hover{transform:scale(1.1)}
            #grizalumNotificationBtn i{color:white;font-size:20px}
            .notification-badge{position:absolute;top:-5px;right:-5px;background:#e74c3c;color:white;border-radius:50%;width:24px;height:24px;font-size:11px;font-weight:700;display:none;align-items:center;justify-content:center}
            .notification-badge.active{display:flex}
            #grizalumNotificationPanel{position:fixed;top:80px;right:20px;width:400px;max-height:600px;background:white;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.15);z-index:9998;display:none;flex-direction:column;overflow:hidden}
            #grizalumNotificationPanel.active{display:flex}
            .notification-header{background:linear-gradient(135deg,#d4af37,#f1c40f);padding:20px;color:white}
            .notification-header h3{margin:0 0 5px 0;font-size:16px}
            .notification-filters{padding:16px 20px;display:flex;gap:8px;background:#f8f9fa}
            .filter-btn{padding:6px 12px;border:1px solid #dee2e6;background:white;border-radius:20px;font-size:12px;cursor:pointer}
            .filter-btn.active{background:#d4af37;color:white}
            .notification-stats{padding:16px 20px;display:flex;justify-content:space-around;background:#f8f9fa}
            .stat-number{display:block;font-size:18px;font-weight:700;color:#d4af37}
            .stat-label{font-size:11px;color:#6c757d}
            .notification-list{flex:1;overflow-y:auto;max-height:300px}
            .notification-item{padding:16px 20px;border-bottom:1px solid #f1f3f4;display:flex;gap:12px;cursor:pointer}
            .notification-item.unread{border-left:4px solid #d4af37;background:rgba(212,175,55,.05)}
            .notification-item.admin{border-left:4px solid #8b5cf6;background:rgba(139,92,246,.05)}
            .notification-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:white}
            .notification-content{flex:1}
            .notification-title{font-weight:600;font-size:14px;margin-bottom:4px}
            .notification-message{font-size:13px;color:#7f8c8d}
            .notification-time{font-size:11px;color:#95a5a6}
            .notification-footer button{width:100%;padding:12px;background:#d4af37;color:white;border:none;border-radius:8px;cursor:pointer}
            .empty-state{padding:40px 20px;text-align:center;color:#95a5a6}
        `;
        document.head.appendChild(styles);
    }

    configurarEventos() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
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
            // CORRECCIÓN CRÍTICA: Usar el mismo formato que el admin
            const nombreLimpio = nombreEmpresa.replace(/[^\w\s]/g, '').trim();
            const empresaKey = nombreLimpio
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .substring(0, 50);
            
            if (empresaKey !== this.empresaActual) {
                this.empresaActual = empresaKey;
                this.actualizarDisplay();
                this.cargarNotificaciones();
                console.log(`🏢 Empresa: ${empresaKey}`);
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
            lista.innerHTML = '<div class="empty-state">📭 No hay notificaciones</div>';
            return;
        }

        lista.innerHTML = filtradas.map(notif => {
            const cat = this.categorias[notif.categoria] || this.categorias.SISTEMA;
            const admin = notif.esAdmin ? 'admin' : '';
            const pref = notif.esAdmin ? '[ADMIN] ' : '';
            const tiempo = this.formatearTiempo(notif.fecha);
            return `<div class="notification-item ${!notif.leida ? 'unread' : ''} ${admin}" data-id="${notif.id}">
                <div class="notification-icon" style="background:${cat.color}"><i class="${cat.icono}"></i></div>
                <div class="notification-content">
                    <div class="notification-title">${pref}${notif.titulo}</div>
                    <div class="notification-message">${notif.mensaje}</div>
                    <div class="notification-time">${tiempo}</div>
                </div></div>`;
        }).join('');
        
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => this.marcarLeida(item.dataset.id));
        });
    }

    formatearTiempo(fecha) {
        const diff = Date.now() - new Date(fecha).getTime();
        if (diff < 60000) return 'Ahora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
        return `${Math.floor(diff / 86400000)}d`;
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
                        titulo, mensaje,
                        fecha: new Date().toISOString(),
                        leida: false,
                        esAdmin: true
                    };
                    const notifs = instanciaNotificaciones.notificaciones.get(empresaId) || [];
                    notifs.unshift(notif);
                    instanciaNotificaciones.notificaciones.set(empresaId, notifs);
                    
                    // Auto-renderizar si es la empresa actual
                    if (instanciaNotificaciones.empresaActual === empresaId) {
                        setTimeout(() => {
                            instanciaNotificaciones.actualizarContador();
                            instanciaNotificaciones.renderizar();
                        }, 200);
                    }
                    
                    console.log(`✅ Guardada para ${empresaId}. Total: ${notifs.length}`);
                    return notif.id;
                } catch (e) {
                    console.error('❌', e);
                    return null;
                }
            }
        };
        console.log('📡 API lista');
    }
}

const instanciaNotificaciones = new GrizalumNotificacionesPremium();
window.instanciaNotificaciones = instanciaNotificaciones;
setTimeout(() => {
    if (window.adminEmpresas && window.GrizalumNotificacionesPremium) {
        console.log('🎉 Admin ↔ Notificaciones CONECTADO');
    }
}, 2000);
