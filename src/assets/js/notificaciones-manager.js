/**
 * ================================================================
 * GRIZALUM SISTEMA DE NOTIFICACIONES POR EMPRESA v1.0
 * Sistema básico funcional que no interfiere con arquitectura existente
 * ================================================================
 */

class NotificacionesManager {
    constructor() {
        this.version = '1.0.0';
        this.empresaActual = null;
        this.notificaciones = new Map(); // Map por empresa
        this.isInitialized = false;
        
        console.log('📧 Inicializando Sistema de Notificaciones por Empresa...');
        this.init();
    }

    init() {
        try {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.inicializar());
            } else {
                this.inicializar();
            }
        } catch (error) {
            console.error('[NOTIFICACIONES] Error en inicialización:', error);
        }
    }

    inicializar() {
        try {
            // Cargar notificaciones guardadas
            this.cargarNotificacionesGuardadas();
            
            // Crear interfaz de notificaciones
            this.crearInterfazNotificaciones();
            
            // Conectar con sistema de empresas
            this.conectarConSistemaEmpresas();
            
            // Crear API global
            this.crearAPIGlobal();
            
            this.isInitialized = true;
            console.log('✅ Sistema de Notificaciones inicializado');
            
        } catch (error) {
            console.error('[NOTIFICACIONES] Error en inicialización:', error);
        }
    }

    cargarNotificacionesGuardadas() {
        try {
            // Simular datos guardados por empresa (después conectarás con localStorage)
            const datosEjemplo = {
                'empresa-001': [
                    {
                        id: 'not-001',
                        titulo: 'Bienvenido a GRIZALUM',
                        mensaje: 'Tu sistema financiero está listo',
                        tipo: 'info',
                        fecha: new Date().toISOString(),
                        leida: false
                    }
                ],
                'empresa-002': [
                    {
                        id: 'not-002',
                        titulo: 'Factura Pendiente',
                        mensaje: 'Tienes facturas próximas a vencer',
                        tipo: 'warning',
                        fecha: new Date().toISOString(),
                        leida: false
                    }
                ]
            };

            // Cargar en el Map
            Object.entries(datosEjemplo).forEach(([empresaId, notifs]) => {
                this.notificaciones.set(empresaId, notifs);
            });

            console.log('📂 Notificaciones cargadas para', this.notificaciones.size, 'empresas');
        } catch (error) {
            console.error('[NOTIFICACIONES] Error cargando datos:', error);
        }
    }

    crearInterfazNotificaciones() {
        // Crear botón flotante de notificaciones
        this.crearBotonNotificaciones();
        
        // Crear panel de notificaciones
        this.crearPanelNotificaciones();
    }

    crearBotonNotificaciones() {
        // Verificar que no exista ya
        if (document.getElementById('grizalumNotificationBtn')) return;

        const boton = document.createElement('button');
        boton.id = 'grizalumNotificationBtn';
        boton.className = 'grizalum-notification-btn';
        boton.innerHTML = `
            <i class="fas fa-bell"></i>
            <span class="notification-count" id="notificationCount">0</span>
        `;
        
        // Posicionar el botón
        boton.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #d4af37, #f1c40f);
            border: none;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;

        // Estilos del ícono y contador
        const style = document.createElement('style');
        style.textContent = `
            .grizalum-notification-btn i {
                color: white;
                font-size: 18px;
            }
            
            .notification-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 11px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 20px;
            }
            
            .grizalum-notification-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(boton);

        // Agregar evento click
        boton.addEventListener('click', () => this.togglePanelNotificaciones());

        console.log('🔔 Botón de notificaciones creado');
    }

    crearPanelNotificaciones() {
        // Verificar que no exista ya
        if (document.getElementById('grizalumNotificationPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'grizalumNotificationPanel';
        panel.className = 'grizalum-notification-panel';
        panel.style.cssText = `
            position: fixed;
            top: 180px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 9998;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e1e8ed;
        `;

        panel.innerHTML = `
            <div class="notification-header" style="
                background: linear-gradient(135deg, #d4af37, #f1c40f);
                color: white;
                padding: 15px 20px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <span>Notificaciones</span>
                <button id="closeNotificationPanel" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="notification-empresa-info" id="notificationEmpresaInfo" style="
                padding: 12px 20px;
                background: #f8f9fa;
                border-bottom: 1px solid #e1e8ed;
                font-size: 13px;
                color: #666;
            ">
                Empresa: <span id="currentEmpresaName">Sin seleccionar</span>
            </div>
            
            <div class="notification-list" id="notificationList" style="
                flex: 1;
                overflow-y: auto;
                max-height: 350px;
            ">
                <!-- Las notificaciones se cargan aquí -->
            </div>
            
            <div class="notification-footer" style="
                padding: 12px 20px;
                background: #f8f9fa;
                border-top: 1px solid #e1e8ed;
                text-align: center;
            ">
                <button id="markAllReadBtn" style="
                    background: none;
                    border: 1px solid #d4af37;
                    color: #d4af37;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                ">
                    Marcar todas como leídas
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // Agregar eventos
        document.getElementById('closeNotificationPanel').addEventListener('click', () => {
            this.cerrarPanelNotificaciones();
        });

        document.getElementById('markAllReadBtn').addEventListener('click', () => {
            this.marcarTodasComoLeidas();
        });

        console.log('📋 Panel de notificaciones creado');
    }

    conectarConSistemaEmpresas() {
        // Observar cambios en el selector de empresas
        const observarEmpresa = () => {
            const selector = document.getElementById('companySelector');
            if (selector) {
                const observer = new MutationObserver(() => {
                    this.detectarCambioEmpresa();
                });
                
                observer.observe(selector, { 
                    childList: true, 
                    subtree: true 
                });
            }
        };

        // Intentar conectar ahora o esperar
        observarEmpresa();
        
        // También observar cada 2 segundos por si el selector se carga después
        setTimeout(() => observarEmpresa(), 2000);

        console.log('🔗 Conectado con sistema de empresas');
    }

    detectarCambioEmpresa() {
        // Detectar empresa actual (adaptar según tu selector)
        const selector = document.getElementById('companySelector');
        if (!selector) return;

        // Buscar empresa activa (adaptar según tu estructura)
        const empresaActiva = selector.querySelector('.active') || 
                             selector.querySelector('[data-selected="true"]') ||
                             selector.querySelector('.selected');

        if (empresaActiva) {
            const empresaId = empresaActiva.dataset.empresaId || 
                             empresaActiva.dataset.id || 
                             'empresa-001'; // fallback

            if (empresaId !== this.empresaActual) {
                this.empresaActual = empresaId;
                this.actualizarNotificacionesParaEmpresa();
                console.log('🏢 Empresa cambiada a:', empresaId);
            }
        }
    }

    actualizarNotificacionesParaEmpresa() {
        if (!this.empresaActual) return;

        // Obtener notificaciones de la empresa actual
        const notificacionesEmpresa = this.notificaciones.get(this.empresaActual) || [];
        
        // Actualizar contador
        this.actualizarContador(notificacionesEmpresa);
        
        // Actualizar panel si está abierto
        this.actualizarPanelNotificaciones(notificacionesEmpresa);
        
        // Actualizar info de empresa
        this.actualizarInfoEmpresa();
    }

    actualizarContador(notificaciones) {
        const contador = document.getElementById('notificationCount');
        if (contador) {
            const noLeidas = notificaciones.filter(n => !n.leida).length;
            contador.textContent = noLeidas;
            contador.style.display = noLeidas > 0 ? 'flex' : 'none';
        }
    }

    actualizarPanelNotificaciones(notificaciones) {
        const lista = document.getElementById('notificationList');
        if (!lista) return;

        if (notificaciones.length === 0) {
            lista.innerHTML = `
                <div style="
                    padding: 40px 20px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                ">
                    <i class="fas fa-bell-slash" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                    No hay notificaciones
                </div>
            `;
            return;
        }

        lista.innerHTML = notificaciones.map(notif => `
            <div class="notification-item" data-id="${notif.id}" style="
                padding: 15px 20px;
                border-bottom: 1px solid #f1f3f4;
                cursor: pointer;
                transition: background 0.2s;
                ${!notif.leida ? 'background: #f8f9ff; border-left: 3px solid #d4af37;' : ''}
            ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h4 style="
                            margin: 0 0 5px 0;
                            font-size: 14px;
                            font-weight: 600;
                            color: #333;
                        ">${notif.titulo}</h4>
                        <p style="
                            margin: 0 0 5px 0;
                            font-size: 13px;
                            color: #666;
                            line-height: 1.4;
                        ">${notif.mensaje}</p>
                        <small style="
                            font-size: 11px;
                            color: #999;
                        ">${this.formatearFecha(notif.fecha)}</small>
                    </div>
                    <div style="margin-left: 10px;">
                        <span class="notification-type" style="
                            padding: 2px 6px;
                            border-radius: 10px;
                            font-size: 10px;
                            font-weight: 600;
                            text-transform: uppercase;
                            ${this.getEstiloTipo(notif.tipo)}
                        ">${notif.tipo}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Agregar eventos click a las notificaciones
        lista.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                this.marcarComoLeida(item.dataset.id);
            });
        });
    }

    actualizarInfoEmpresa() {
        const info = document.getElementById('currentEmpresaName');
        if (info) {
            // Obtener nombre de empresa (adaptar según tu sistema)
            const nombreEmpresa = this.obtenerNombreEmpresa(this.empresaActual);
            info.textContent = nombreEmpresa;
        }
    }

    obtenerNombreEmpresa(empresaId) {
        // Mapeo básico (después conectar con tu sistema de empresas)
        const empresas = {
            'empresa-001': 'Fundición Laguna',
            'empresa-002': 'Constructora Lima',
            'empresa-003': 'Comercial Perú'
        };
        
        return empresas[empresaId] || `Empresa ${empresaId}`;
    }

    formatearFecha(fecha) {
        const date = new Date(fecha);
        const ahora = new Date();
        const diff = ahora - date;
        
        if (diff < 60000) return 'Hace un momento';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
        
        return date.toLocaleDateString('es-PE');
    }

    getEstiloTipo(tipo) {
        const estilos = {
            'info': 'background: #e3f2fd; color: #1976d2;',
            'warning': 'background: #fff3e0; color: #f57c00;',
            'error': 'background: #ffebee; color: #d32f2f;',
            'success': 'background: #e8f5e8; color: #388e3c;'
        };
        
        return estilos[tipo] || estilos.info;
    }

    togglePanelNotificaciones() {
        const panel = document.getElementById('grizalumNotificationPanel');
        if (!panel) return;

        if (panel.style.display === 'none' || !panel.style.display) {
            panel.style.display = 'flex';
            this.actualizarNotificacionesParaEmpresa();
        } else {
            panel.style.display = 'none';
        }
    }

    cerrarPanelNotificaciones() {
        const panel = document.getElementById('grizalumNotificationPanel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    marcarComoLeida(notificacionId) {
        if (!this.empresaActual) return;

        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        const notificacion = notificaciones.find(n => n.id === notificacionId);
        
        if (notificacion && !notificacion.leida) {
            notificacion.leida = true;
            this.actualizarNotificacionesParaEmpresa();
            console.log('✅ Notificación marcada como leída:', notificacionId);
        }
    }

    marcarTodasComoLeidas() {
        if (!this.empresaActual) return;

        const notificaciones = this.notificaciones.get(this.empresaActual) || [];
        notificaciones.forEach(n => n.leida = true);
        
        this.actualizarNotificacionesParaEmpresa();
        console.log('✅ Todas las notificaciones marcadas como leídas');
    }

    // API PÚBLICA
    crearAPIGlobal() {
        window.GrizalumNotificaciones = {
            // Crear nueva notificación para empresa específica
            crear: (empresaId, notificacion) => this.crearNotificacion(empresaId, notificacion),
            
            // Obtener notificaciones de empresa
            obtener: (empresaId) => this.obtenerNotificaciones(empresaId),
            
            // Marcar como leída
            marcarLeida: (empresaId, notifId) => this.marcarComoLeida(notifId),
            
            // Estado del sistema
            estado: () => ({
                inicializado: this.isInitialized,
                empresaActual: this.empresaActual,
                totalEmpresas: this.notificaciones.size
            })
        };

        console.log('🌐 API global de notificaciones creada');
    }

    crearNotificacion(empresaId, notificacion) {
        if (!empresaId || !notificacion) return false;

        const nuevaNotificacion = {
            id: `not-${Date.now()}`,
            titulo: notificacion.titulo || 'Notificación',
            mensaje: notificacion.mensaje || '',
            tipo: notificacion.tipo || 'info',
            fecha: new Date().toISOString(),
            leida: false
        };

        // Obtener notificaciones existentes o crear array vacío
        const notificacionesEmpresa = this.notificaciones.get(empresaId) || [];
        
        // Agregar nueva notificación al inicio
        notificacionesEmpresa.unshift(nuevaNotificacion);
        
        // Actualizar Map
        this.notificaciones.set(empresaId, notificacionesEmpresa);
        
        // Si es la empresa actual, actualizar interfaz
        if (empresaId === this.empresaActual) {
            this.actualizarNotificacionesParaEmpresa();
        }

        console.log('📧 Nueva notificación creada para', empresaId);
        return true;
    }

    obtenerNotificaciones(empresaId) {
        return this.notificaciones.get(empresaId) || [];
    }
}

// INICIALIZACIÓN AUTOMÁTICA
const grizalumNotificaciones = new NotificacionesManager();

// FUNCIONES DE COMPATIBILIDAD
window.mostrarNotificacion = (mensaje, tipo = 'info', empresaId = null) => {
    const empresa = empresaId || grizalumNotificaciones.empresaActual || 'empresa-001';
    return grizalumNotificaciones.crearNotificacion(empresa, {
        titulo: tipo === 'error' ? 'Error' : tipo === 'success' ? 'Éxito' : 'Información',
        mensaje,
        tipo
    });
};

console.log('📧 GRIZALUM Sistema de Notificaciones por Empresa v1.0 cargado');
console.log('✨ Características:');
console.log('  🏢 Notificaciones específicas por empresa');
console.log('  🔔 Botón flotante inteligente');
console.log('  📊 Contador de no leídas');
console.log('  🎯 No interfiere con arquitectura existente');
console.log('  🔧 API simple para expansión futura');
