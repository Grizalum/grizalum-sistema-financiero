/**
 * ================================================================
 * GRIZALUM NOTIFICACIONES PREMIUM - VERSIÓN FINAL CORREGIDA
 * Sin notificaciones automáticas molestas y con todas las referencias arregladas
 * ================================================================
 */

class GrizalumNotificacionesPremium {
    constructor() {
        this.version = '2.5.0';
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
        this.generarEjemplo();
        console.log('✅ GRIZALUM Notificaciones v2.5 - SIN SPAM DE GUARDADO');
    }

    crearBoton() {
        const existente = document.getElementById('grizalumNotificationBtn');
        if (existente) existente.remove();

        const boton = document.createElement('button');
        boton.id = 'grizalumNotificationBtn';
        boton.innerHTML = `
            <i class="fas fa-bell"></i>
            <span class="notification-badge" id="notificationBadge">0</span>
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
            <div class="notification-header">
                <h3>Centro de Notificaciones</h3>
                <span id="empresaDisplay">GRIZALUM</span>
            </div>
            
            <div class="notification-filters">
                <button class="filter-btn active" data-filter="todas">Todas</button>
                <button class="filter-btn" data-filter="critica">Críticas</button>
                <button class="filter-btn" data-filter="alta">Importantes</button>
                <button class="filter-btn" data-filter="media">Generales</button>
            </div>

            <div class="notification-stats">
                <div class="stat">
                    <span class="stat-number" id="statCriticas">0</span>
                    <span class="stat-label">Críticas</span>
                </div>
                <div class="stat">
                    <span class="stat-number" id="statImportantes">0</span>
                    <span class="stat-label">Importantes</span>
                </div>
                <div class="stat">
                    <span class="stat-number" id="statTotal">0</span>
                    <span class="stat-label">Total</span>
                </div>
            </div>

            <div class="notification-list" id="notificationList">
                <!-- Notificaciones aquí -->
            </div>

            <div class="notification-footer">
                <button id="markAllReadBtn">
                    <i class="fas fa-check-double"></i>
                    Marcar todas como leídas
                </button>
            </div>
        `;

        document.body.appendChild(panel);
        this.configurarEventos();
    }

    inyectarEstilos() {
        const styleId = 'grizalum-notifications-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            #grizalumNotificationBtn {
                position: fixed;
                top: 120px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #d4af37, #f1c40f);
                border: none;
                border-radius: 50%;
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            #grizalumNotificationBtn:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 35px rgba(212, 175, 55, 0.6);
            }

            #grizalumNotificationBtn i {
                color: white;
                font-size: 20px;
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                font-size: 11px;
                font-weight: 700;
                display: none;
                align-items: center;
                justify-content: center;
            }

            .notification-badge.active {
                display: flex;
            }

            #grizalumNotificationPanel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 400px;
                max-height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                z-index: 9998;
                display: none;
                flex-direction: column;
                overflow: hidden;
                transform: translateY(-20px) scale(0.95);
                opacity: 0;
                transition: all 0.3s ease;
            }

            #grizalumNotificationPanel.active {
                display: flex;
                transform: translateY(0) scale(1);
                opacity: 1;
            }

            .notification-header {
                background: linear-gradient(135deg, #d4af37, #f1c40f);
                padding: 20px;
                color: white;
            }

            .notification-header h3 {
                margin: 0 0 5px 0;
                font-size: 16px;
                font-weight: 600;
            }

            .notification-header span {
                font-size: 12px;
                opacity: 0.9;
            }

            .notification-filters {
                padding: 16px 20px;
                display: flex;
                gap: 8px;
                background: #f8f9fa;
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
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
            }

            .stat {
                text-align: center;
            }

            .stat-number {
                display: block;
                font-size: 18px;
                font-weight: 700;
                color: #d4af37;
            }

            .stat-label {
                font-size: 11px;
                color: #6c757d;
                text-transform: uppercase;
            }

            .notification-list {
                flex: 1;
                overflow-y: auto;
                max-height: 300px;
            }

            .notification-item {
                padding: 16px 20px;
                border-bottom: 1px solid #f1f3f4;
                display: flex;
                gap: 12px;
                position: relative;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .notification-item:hover {
                background: #f8f9fa;
            }

            .notification-item.unread {
                border-left: 4px solid #d4af37;
                background: rgba(212, 175, 55, 0.05);
            }

            .notification-item.critical {
                border-left-color: #e74c3c;
            }

            .notification-item.admin {
                border-left: 4px solid #8b5cf6;
                background: rgba(139, 92, 246, 0.05);
            }

            .notification-icon {
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

            .notification-content {
                flex: 1;
                min-width: 0;
                padding-right: 30px;
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
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
            }

            .priority-critica { background: #ffebee; color: #c62828; }
            .priority-alta { background: #fff3e0; color: #ef6c00; }
            .priority-media { background: #e3f2fd; color: #1565c0; }
            .priority-baja { background: #f3e5f5; color: #7b1fa2; }

            .delete-btn {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 20px;
                height: 20px;
                background: rgba(239, 68, 68, 0.1);
                border: none;
                border-radius: 50%;
                color: #e74c3c;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                opacity: 0;
                transition: all 0.2s ease;
            }

            .notification-item:hover .delete-btn {
                opacity: 1;
            }

            .delete-btn:hover {
                background: rgba(239, 68, 68, 0.2);
                transform: scale(1.1);
            }

            .notification-footer {
                padding: 16px 20px;
                background: #f8f9fa;
            }

            .notification-footer button {
                width: 100%;
                padding: 12px;
                background: #d4af37;
                color: white;
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

            .notification-footer button:hover {
                background: #b8941f;
                transform: translateY(-1px);
            }

            .empty-state {
                padding: 40px 20px;
                text-align: center;
                color: #95a5a6;
            }

            .empty-state i {
                font-size: 36px;
                margin-bottom: 12px;
                opacity: 0.5;
            }

            .empty-state h4 {
                margin: 0 0 6px 0;
                font-size: 14px;
                color: #7f8c8d;
            }

            @media (max-width: 768px) {
                #grizalumNotificationPanel {
                    right: 10px;
                    left: 10px;
                    width: auto;
                }
                
                #grizalumNotificationBtn {
                    right: 15px;
                    width: 50px;
                    height: 50px;
                }
            }
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

        document.getElementById('markAllReadBtn').addEventListener('click', () => {
            this.marcarTodasLeidas();
        });
    }

    conectarSistema() {
        setTimeout(() => this.detectarEmpresa(), 1000);
        
        const observer = new MutationObserver(() => this.detectarEmpresa());
        const selector = document.getElementById('companySelector');
        if (selector) {
            observer.observe(selector, { childList: true, subtree: true });
        }

        const observerGlobal = new MutationObserver(() => {
            if (!this.empresaActual) {
                this.detectarEmpresa();
            }
        });
        observerGlobal.observe(document.body, { childList: true, subtree: true });
    }

    detectarEmpresa() {
    // Múltiples métodos de detección
    let nombreEmpresa = null;
    
    // Método 1: Buscar en selector principal
    const selector = document.getElementById('companySelector');
    if (selector) {
        const activa = selector.querySelector('.active, [data-selected="true"], .selected');
        if (activa) nombreEmpresa = activa.textContent?.trim();
    }
    
    // Método 2: Buscar en título de página o header
    if (!nombreEmpresa) {
        const pageTitle = document.querySelector('h1, .page-title, .company-name');
        if (pageTitle) nombreEmpresa = pageTitle.textContent?.trim();
    }
    
    // Método 3: Buscar en URL
    if (!nombreEmpresa) {
        const url = window.location.href;
        const match = url.match(/empresa=([^&]+)/);
        if (match) nombreEmpresa = decodeURIComponent(match[1]);
    }
    
    if (nombreEmpresa && nombreEmpresa.length > 0) {
        const empresaKey = nombreEmpresa
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .substring(0, 50);
            
        if (empresaKey !== this.empresaActual) {
            this.empresaActual = empresaKey;
            this.actualizarDisplay();
            this.cargarNotificaciones();
            console.log(`🏢 Empresa cambiada a: ${empresaKey}`);
        }
    }
}
    actualizarDisplay() {
        const display = document.getElementById('empresaDisplay');
        if (display && this.empresaActual) {
            display.textContent = this.empresaActual.split('-').map(w => 
                w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ');
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

    eliminarNotificacion(id) {
        if (!this.empresaActual) return;

        const notifs = this.notificaciones.get(this.empresaActual) || [];
        const filtradas = notifs.filter(n => n.id !== id);
        this.notificaciones.set(this.empresaActual, filtradas);
        
        this.actualizarContador();
        this.renderizar();
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

        this.actualizarEstadisticas(notifs);
    }

    actualizarEstadisticas(notifs) {
        const criticas = notifs.filter(n => n.prioridad === 'critica').length;
        const importantes = notifs.filter(n => n.prioridad === 'alta').length;
        
        document.getElementById('statCriticas').textContent = criticas;
        document.getElementById('statImportantes').textContent = importantes;
        document.getElementById('statTotal').textContent = notifs.length;
    }

    renderizar(filtro = 'todas') {
        const lista = document.getElementById('notificationList');
        if (!lista) return;

        const notifs = this.notificaciones.get(this.empresaActual) || [];
        let filtradas = notifs;

        if (filtro !== 'todas') {
            filtradas = notifs.filter(n => n.prioridad === filtro);
        }

        if (filtradas.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <h4>No hay notificaciones</h4>
                    <p>Todo está al día</p>
                </div>
            `;
            return;
        }

        lista.innerHTML = filtradas.map(notif => this.renderizarItem(notif)).join('');
        this.agregarEventosItems();
    }

    renderizarItem(notif) {
        const categoria = this.categorias[notif.categoria] || this.categorias.SISTEMA;
        const tiempo = this.formatearTiempo(notif.fecha);
        
        const claseAdmin = notif.esAdmin ? 'admin' : '';
        const prefijoTitulo = notif.esAdmin ? '[ADMIN] ' : '';
        
        return `
            <div class="notification-item ${!notif.leida ? 'unread' : ''} ${notif.prioridad === 'critica' ? 'critical' : ''} ${claseAdmin}" 
                 data-id="${notif.id}">
                <div class="notification-icon" style="background: ${categoria.color}">
                    <i class="${categoria.icono}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${prefijoTitulo}${notif.titulo}</div>
                    <div class="notification-message">${notif.mensaje}</div>
                    <div class="notification-meta">
                        <div class="notification-time">${tiempo}</div>
                        <div class="notification-priority priority-${notif.prioridad}">
                            ${notif.prioridad}
                        </div>
                    </div>
                </div>
                <button class="delete-btn" data-delete="${notif.id}" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    agregarEventosItems() {
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn')) {
                    this.marcarLeida(item.dataset.id);
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.eliminarNotificacion(btn.dataset.delete);
            });
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
        if (!panel) return;

        if (panel.classList.contains('active')) {
            panel.classList.remove('active');
        } else {
            panel.classList.add('active');
            this.cargarNotificaciones();
        }
    }

    cargarNotificaciones() {
        this.actualizarContador();
        this.renderizar();
    }

    generarEjemplo() {
        if (!this.empresaActual) return;

        const ejemplos = [
            {
                categoria: 'FINANCIERO',
                prioridad: 'alta',
                titulo: 'Revisión de Flujo de Caja',
                mensaje: 'Recomendable revisar flujo de caja para el próximo trimestre'
            },
            {
                categoria: 'OPORTUNIDAD',
                prioridad: 'media',
                titulo: 'Oportunidad de Crecimiento',
                mensaje: 'Tus métricas muestran potencial para expandir'
            }
        ];

        ejemplos.forEach(config => this.crearNotificacion(config));
    }

    crearAPI() {
        window.GrizalumNotificacionesPremium = {
            crear: (config) => instanciaNotificaciones.crearNotificacion(config),
            obtener: () => instanciaNotificaciones.notificaciones.get(instanciaNotificaciones.empresaActual) || [],
            eliminar: (id) => instanciaNotificaciones.eliminarNotificacion(id),
            marcarLeida: (id) => instanciaNotificaciones.marcarLeida(id),
            
            recibirDelAdmin: (empresaId, titulo, mensaje, tipo = 'info') => {
    // Control de duplicados en recepción
    const claveUnica = `${empresaId}-${titulo}-${mensaje}`;
    if (window.notificacionesRecibidas && window.notificacionesRecibidas.includes(claveUnica)) {
        console.log('🚫 Notificación duplicada ignorada');
        return null;
    }
    
    if (!window.notificacionesRecibidas) window.notificacionesRecibidas = [];
    window.notificacionesRecibidas.push(claveUnica);
    
    setTimeout(() => {
        const index = window.notificacionesRecibidas.indexOf(claveUnica);
        if (index > -1) window.notificacionesRecibidas.splice(index, 1);
    }, 3000);

    try {
        console.log(`✅ Recibiendo ÚNICA vez para: ${empresaId}`);
        
        const empresaOriginal = instanciaNotificaciones.empresaActual;
        instanciaNotificaciones.empresaActual = empresaId;
        
        const config = {
            categoria: 'SISTEMA',
            prioridad: 'alta',
            titulo: titulo,
            mensaje: mensaje,
            esAdmin: true
        };
        
        const id = instanciaNotificaciones.crearNotificacion(config);
        instanciaNotificaciones.empresaActual = empresaOriginal;
        
        if (empresaOriginal === empresaId) {
            setTimeout(() => {
                instanciaNotificaciones.cargarNotificaciones();
            }, 100);
        }
        
        return id;
    } catch (error) {
        console.error('Error recibiendo notificación:', error);
        return null;
    }
},

        // FUNCIÓN FILTRADA - Solo notificaciones importantes, NO guardado automático
window.mostrarNotificacion = (mensaje, tipo = 'info') => {
    const mensajesProhibidos = [
        'guardado', 'saved', 'actualizado', 'cargado', 'loading',
        'gráficos', 'métricas', 'interfaz', 'datos', 'sistema',
        'correctamente', 'dinámicamente', 'automáticamente'
    ];
    
    const mensajeLower = mensaje.toLowerCase();
    const esProhibido = mensajesProhibidos.some(palabra => 
        mensajeLower.includes(palabra)
    );
    
    if (esProhibido) {
        console.log('🚫 Notificación bloqueada:', mensaje);
        return null;
    }
    
    const cats = { error: 'FINANCIERO', warning: 'VENCIMIENTO', success: 'OPORTUNIDAD', info: 'SISTEMA' };
    const prios = { error: 'critica', warning: 'alta', success: 'media', info: 'baja' };
    
    return instanciaNotificaciones.crearNotificacion({
        categoria: cats[tipo] || 'SISTEMA',
        prioridad: prios[tipo] || 'media',
        titulo: tipo === 'error' ? 'Alerta' : 'Información',
        mensaje
    });
};

        console.log('📡 API de notificaciones con filtro anti-spam creada');
    }
}

// Inicialización global
const instanciaNotificaciones = new GrizalumNotificacionesPremium();

// Verificar conexión con admin
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.adminEmpresas && window.GrizalumNotificacionesPremium) {
            console.log('🎉 CONEXIÓN BIDIRECCIONAL ESTABLECIDA:');
            console.log('✅ Admin Premium ↔ Sistema Notificaciones');
            console.log('📨 Los avisos del admin ahora llegan a las notificaciones');
            console.log('🚫 Notificaciones de guardado automático BLOQUEADAS');
        } else {
            console.log('⏳ Esperando conexión con sistema admin...');
        }
    }, 2000);
});

console.log('✅ Sistema de Notificaciones Premium v2.5 - SIN SPAM DE GUARDADO');
