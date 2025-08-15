// ================================================================
// SISTEMA DE NOTIFICACIONES GRIZALUM
// Este archivo maneja SOLO las notificaciones y alertas del sistema
// ================================================================

console.log('🔔 Cargando sistema de notificaciones...');

// ================================================================
// VARIABLES DEL SISTEMA DE NOTIFICACIONES
// ================================================================
let notificacionesActivas = [];
let contenedorNotificaciones = null;
let contadorNotificaciones = 0;

// ================================================================
// CLASE PRINCIPAL DEL SISTEMA DE NOTIFICACIONES
// ================================================================
class SistemaNotificaciones {
    constructor() {
        this.notificaciones = [];
        this.contenedor = null;
        this.posicion = 'top-right'; // top-right, top-left, bottom-right, bottom-left
        this.duracionPorDefecto = 5000; // 5 segundos
        this.maxNotificaciones = 5;
        this.configuracion = {
            animacionEntrada: 'slideInRight',
            animacionSalida: 'slideOutRight',
            sonidoHabilitado: false,
            agruparSimilares: true
        };
    }

    /**
     * Inicializar el sistema de notificaciones
     */
    inicializar() {
        console.log('🚀 Inicializando sistema de notificaciones...');
        
        // Crear contenedor principal
        this.crearContenedorPrincipal();
        
        // Crear estilos CSS
        this.crearEstilosCSS();
        
        // Configurar eventos globales
        this.configurarEventos();
        
        console.log('✅ Sistema de notificaciones inicializado');
        console.log(`📍 Posición: ${this.posicion}`);
        console.log(`⏱️ Duración por defecto: ${this.duracionPorDefecto}ms`);
    }

    /**
     * Crear contenedor principal de notificaciones
     */
    crearContenedorPrincipal() {
        // Eliminar contenedor existente si existe
        const contenedorExistente = document.getElementById('grizalum-notifications-container');
        if (contenedorExistente) {
            contenedorExistente.remove();
        }

        // Crear nuevo contenedor
        this.contenedor = document.createElement('div');
        this.contenedor.id = 'grizalum-notifications-container';
        this.contenedor.className = `notifications-container ${this.posicion}`;
        
        document.body.appendChild(this.contenedor);
        contenedorNotificaciones = this.contenedor;
        
        console.log('📦 Contenedor de notificaciones creado');
    }

    /**
     * Crear estilos CSS para las notificaciones
     */
    crearEstilosCSS() {
        const styleId = 'grizalum-notifications-styles';
        
        // Eliminar estilos existentes
        const estilosExistentes = document.getElementById(styleId);
        if (estilosExistentes) {
            estilosExistentes.remove();
        }

        const estilos = document.createElement('style');
        estilos.id = styleId;
        estilos.textContent = `
            /* ===== ESTILOS DEL SISTEMA DE NOTIFICACIONES ===== */
            
            .notifications-container {
                position: fixed;
                z-index: 999999;
                pointer-events: none;
                max-width: 400px;
                width: 100%;
            }
            
            /* Posiciones del contenedor */
            .notifications-container.top-right {
                top: 20px;
                right: 20px;
            }
            
            .notifications-container.top-left {
                top: 20px;
                left: 20px;
            }
            
            .notifications-container.bottom-right {
                bottom: 20px;
                right: 20px;
            }
            
            .notifications-container.bottom-left {
                bottom: 20px;
                left: 20px;
            }
            
            /* Notificación individual */
            .grizalum-notification {
                background: linear-gradient(135deg, 
                    rgba(30, 41, 59, 0.95) 0%, 
                    rgba(51, 65, 85, 0.9) 100%);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 12px;
                box-shadow: 
                    0 10px 30px rgba(0,0,0,0.3),
                    0 0 20px rgba(0,0,0,0.1);
                backdrop-filter: blur(20px);
                color: white;
                margin-bottom: 12px;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                pointer-events: all;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                max-width: 100%;
                word-break: break-word;
            }
            
            /* Barra de progreso */
            .grizalum-notification::before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                width: 100%;
                background: linear-gradient(90deg, 
                    var(--notification-color, #3b82f6) 0%, 
                    var(--notification-color-secondary, #60a5fa) 100%);
                transform: scaleX(1);
                transform-origin: left;
                animation: notificationProgress var(--duration, 5000ms) linear forwards;
            }
            
            @keyframes notificationProgress {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
            
            /* Tipos de notificaciones */
            .grizalum-notification.success {
                --notification-color: #10b981;
                --notification-color-secondary: #34d399;
                border-left: 4px solid #10b981;
            }
            
            .grizalum-notification.error {
                --notification-color: #ef4444;
                --notification-color-secondary: #f87171;
                border-left: 4px solid #ef4444;
            }
            
            .grizalum-notification.warning {
                --notification-color: #f59e0b;
                --notification-color-secondary: #fbbf24;
                border-left: 4px solid #f59e0b;
            }
            
            .grizalum-notification.info {
                --notification-color: #3b82f6;
                --notification-color-secondary: #60a5fa;
                border-left: 4px solid #3b82f6;
            }
            
            /* Contenido de la notificación */
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
                color: white;
            }
            
            .notification-icon {
                font-size: 20px;
                min-width: 20px;
                opacity: 0.9;
            }
            
            .notification-text {
                flex: 1;
                line-height: 1.4;
                font-weight: 500;
            }
            
            .notification-title {
                font-weight: 600;
                margin-bottom: 4px;
                font-size: 14px;
            }
            
            .notification-message {
                font-size: 13px;
                opacity: 0.9;
            }
            
            /* Botón de cerrar */
            .notification-close {
                background: none;
                border: none;
                color: rgba(255,255,255,0.6);
                cursor: pointer;
                padding: 4px;
                border-radius: 6px;
                font-size: 14px;
                min-width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .notification-close:hover {
                background: rgba(255,255,255,0.1);
                color: white;
                transform: scale(1.1);
            }
            
            /* Animaciones de entrada */
            .notification-enter {
                animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideInLeft {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            /* Animaciones de salida */
            .notification-exit {
                animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            /* Hover effects */
            .grizalum-notification:hover {
                transform: translateY(-2px);
                box-shadow: 
                    0 15px 40px rgba(0,0,0,0.4),
                    0 0 25px rgba(0,0,0,0.15);
            }
            
            .grizalum-notification:hover::before {
                animation-play-state: paused;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .notifications-container {
                    left: 10px !important;
                    right: 10px !important;
                    max-width: none;
                }
                
                .grizalum-notification {
                    margin-bottom: 8px;
                    padding: 12px 16px;
                }
                
                .notification-text {
                    font-size: 14px;
                }
            }
        `;
        
        document.head.appendChild(estilos);
        console.log('🎨 Estilos de notificaciones aplicados');
    }

    /**
     * Configurar eventos del sistema
     */
    configurarEventos() {
        // Limpiar notificaciones cuando cambie de página
        window.addEventListener('beforeunload', () => {
            this.limpiarTodas();
        });

        console.log('🎯 Eventos de notificaciones configurados');
    }

    /**
     * Mostrar notificación principal
     * @param {string|Object} mensaje - Texto o configuración completa
     * @param {string} tipo - 'success', 'error', 'warning', 'info'
     * @param {number} duracion - Tiempo en milisegundos
     * @param {Object} opciones - Opciones adicionales
     */
    mostrar(mensaje, tipo = 'info', duracion = null, opciones = {}) {
        // Si el mensaje es un objeto, extraer configuración
        let configuracion = {};
        if (typeof mensaje === 'object') {
            configuracion = mensaje;
            mensaje = configuracion.mensaje || configuracion.text || '';
            tipo = configuracion.tipo || configuracion.type || 'info';
            duracion = configuracion.duracion || configuracion.duration || null;
            opciones = configuracion.opciones || configuracion.options || {};
        }

        // Usar duración por defecto si no se especifica
        duracion = duracion || this.duracionPorDefecto;

        // Verificar límite de notificaciones
        if (this.notificaciones.length >= this.maxNotificaciones) {
            this.removerMasAntigua();
        }

        // Crear la notificación
        const notificacion = this.crearNotificacion(mensaje, tipo, duracion, opciones);
        
        // Agregar al contenedor
        this.contenedor.appendChild(notificacion);
        this.notificaciones.push(notificacion);
        notificacionesActivas.push(notificacion);
        contadorNotificaciones++;

        // Activar animación de entrada
        setTimeout(() => {
            notificacion.classList.add('notification-enter');
        }, 10);

        // Auto-remover después del tiempo especificado
        if (duracion > 0) {
            setTimeout(() => {
                this.remover(notificacion);
            }, duracion);
        }

        console.log(`🔔 Notificación mostrada: ${tipo} - ${mensaje.substring(0, 50)}...`);
        
        return notificacion;
    }

    /**
     * Crear elemento de notificación
     */
    crearNotificacion(mensaje, tipo, duracion, opciones = {}) {
        const notificacion = document.createElement('div');
        notificacion.className = `grizalum-notification ${tipo}`;
        notificacion.style.setProperty('--duration', `${duracion}ms`);
        
        // ID único para la notificación
        notificacion.id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Iconos por tipo
        const iconos = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };

        // Estructura HTML
        const titulo = opciones.titulo || opciones.title || '';
        const icono = opciones.icono || opciones.icon || iconos[tipo] || iconos.info;
        
        notificacion.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${icono}"></i>
                <div class="notification-text">
                    ${titulo ? `<div class="notification-title">${titulo}</div>` : ''}
                    <div class="notification-message">${mensaje}</div>
                </div>
            </div>
            <button class="notification-close" title="Cerrar notificación">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Configurar botón de cerrar
        const botonCerrar = notificacion.querySelector('.notification-close');
        botonCerrar.addEventListener('click', () => {
            this.remover(notificacion);
        });

        // Pausar progreso al hacer hover
        notificacion.addEventListener('mouseenter', () => {
            notificacion.style.setProperty('--duration', 'paused');
        });

        notificacion.addEventListener('mouseleave', () => {
            notificacion.style.setProperty('--duration', `${duracion}ms`);
        });

        return notificacion;
    }

    /**
     * Remover notificación específica
     */
    remover(notificacion) {
        if (!notificacion || !notificacion.parentElement) return;

        // Animación de salida
        notificacion.classList.add('notification-exit');

        // Remover después de la animación
        setTimeout(() => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
            
            // Remover de arrays
            this.notificaciones = this.notificaciones.filter(n => n !== notificacion);
            notificacionesActivas = notificacionesActivas.filter(n => n !== notificacion);
            
        }, 300);

        console.log('🗑️ Notificación removida');
    }

    /**
     * Remover la notificación más antigua
     */
    removerMasAntigua() {
        if (this.notificaciones.length > 0) {
            this.remover(this.notificaciones[0]);
        }
    }

    /**
     * Limpiar todas las notificaciones
     */
    limpiarTodas() {
        this.notificaciones.forEach(notificacion => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
        });
        
        this.notificaciones = [];
        notificacionesActivas = [];
        console.log('🧹 Todas las notificaciones limpiadas');
    }

    /**
     * Métodos de conveniencia para tipos específicos
     */
    exito(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'success', opciones.duracion, opciones);
    }

    error(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'error', opciones.duracion || 7000, opciones);
    }

    advertencia(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'warning', opciones.duracion || 6000, opciones);
    }

    informacion(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'info', opciones.duracion, opciones);
    }

    /**
     * Configurar posición de las notificaciones
     */
    configurarPosicion(posicion) {
        const posicionesValidas = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
        
        if (!posicionesValidas.includes(posicion)) {
            console.warn(`⚠️ Posición inválida: ${posicion}`);
            return;
        }

        this.posicion = posicion;
        this.contenedor.className = `notifications-container ${posicion}`;
        
        console.log(`📍 Posición de notificaciones cambiada a: ${posicion}`);
    }

    /**
     * Obtener estadísticas del sistema
     */
    obtenerEstadisticas() {
        return {
            activas: this.notificaciones.length,
            totalMostradas: contadorNotificaciones,
            posicion: this.posicion,
            duracionPorDefecto: this.duracionPorDefecto,
            maxNotificaciones: this.maxNotificaciones
        };
    }
}

// ================================================================
// INSTANCIA GLOBAL DEL SISTEMA
// ================================================================
const sistemaNotificaciones = new SistemaNotificaciones();

// ================================================================
// FUNCIONES GLOBALES PARA COMPATIBILIDAD
// ================================================================

/**
 * Función global principal para mostrar notificaciones
 * Compatible con la función del grizalum-principal.js
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 5000) {
    return sistemaNotificaciones.mostrar(mensaje, tipo, duracion);
}

/**
 * Funciones de conveniencia globales
 */
function notificacionExito(mensaje, opciones = {}) {
    return sistemaNotificaciones.exito(mensaje, opciones);
}

function notificacionError(mensaje, opciones = {}) {
    return sistemaNotificaciones.error(mensaje, opciones);
}

function notificacionAdvertencia(mensaje, opciones = {}) {
    return sistemaNotificaciones.advertencia(mensaje, opciones);
}

function notificacionInfo(mensaje, opciones = {}) {
    return sistemaNotificaciones.informacion(mensaje, opciones);
}

// ================================================================
// INTEGRACIÓN CON OTROS MÓDULOS
// ================================================================

// Escuchar eventos del sistema para mostrar notificaciones automáticas
document.addEventListener('grizalumCompanyChanged', function(evento) {
    const { company } = evento.detail;
    notificacionExito(`🏢 Empresa cambiada a: ${company.name}`, {
        duracion: 3000
    });
});

document.addEventListener('grizalumPeriodoCambiado', function(evento) {
    const { periodo } = evento.detail;
    notificacionInfo(`📅 Período cambiado a: ${periodo}`, {
        duracion: 2000
    });
});

document.addEventListener('navegacionSidebar', function(evento) {
    const { seccion } = evento.detail;
    const nombres = {
        'dashboard': 'Panel de Control',
        'cash-flow': 'Flujo de Caja',
        'income-statement': 'Estado de Resultados',
        'balance-sheet': 'Balance General',
        'inventory': 'Inventario',
        'sales': 'Ventas'
    };
    
    const nombre = nombres[seccion] || seccion;
    notificacionInfo(`📱 ${nombre}`, {
        duracion: 2000
    });
});

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔔 DOM listo - Inicializando sistema de notificaciones...');
    sistemaNotificaciones.inicializar();
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        notificacionExito('🚀 Sistema GRIZALUM iniciado correctamente', {
            titulo: '¡Bienvenido!',
            duracion: 4000
        });
    }, 2000);
});

// ================================================================
// API PÚBLICA DEL SISTEMA DE NOTIFICACIONES
// ================================================================

// Exponer API globalmente
window.GRIZALUM_NOTIFICATIONS = {
    version: '1.0.0',
    mostrar: (mensaje, tipo, duracion, opciones) => sistemaNotificaciones.mostrar(mensaje, tipo, duracion, opciones),
    exito: (mensaje, opciones) => sistemaNotificaciones.exito(mensaje, opciones),
    error: (mensaje, opciones) => sistemaNotificaciones.error(mensaje, opciones),
    advertencia: (mensaje, opciones) => sistemaNotificaciones.advertencia(mensaje, opciones),
    info: (mensaje, opciones) => sistemaNotificaciones.informacion(mensaje, opciones),
    limpiar: () => sistemaNotificaciones.limpiarTodas(),
    configurarPosicion: (posicion) => sistemaNotificaciones.configurarPosicion(posicion),
    estadisticas: () => sistemaNotificaciones.obtenerEstadisticas()
};

// Hacer funciones disponibles globalmente para compatibilidad
window.mostrarNotificacion = mostrarNotificacion;
window.notificacionExito = notificacionExito;
window.notificacionError = notificacionError;
window.notificacionAdvertencia = notificacionAdvertencia;
window.notificacionInfo = notificacionInfo;

console.log(`
🔔 ===================================================
   SISTEMA DE NOTIFICACIONES CARGADO
🔔 ===================================================

✨ FUNCIONES DISPONIBLES:
   • mostrarNotificacion(mensaje, tipo, duracion)
   • notificacionExito(mensaje, opciones)
   • notificacionError(mensaje, opciones)
   • notificacionAdvertencia(mensaje, opciones)
   • notificacionInfo(mensaje, opciones)

🎨 CARACTERÍSTICAS:
   • 4 tipos: success, error, warning, info
   • Animaciones suaves de entrada/salida
   • Barra de progreso automática
   • Responsive para móviles
   • Hover para pausar auto-close
   • Límite máximo de notificaciones

⚙️ API AVANZADA:
   • GRIZALUM_NOTIFICATIONS.configurarPosicion('top-left')
   • GRIZALUM_NOTIFICATIONS.limpiar()
   • GRIZALUM_NOTIFICATIONS.estadisticas()

🔗 INTEGRACIÓN AUTOMÁTICA:
   • Reacciona a cambios de empresa
   • Reacciona a cambios de período
   • Reacciona a navegación del sidebar

🔔 ===================================================
`);
