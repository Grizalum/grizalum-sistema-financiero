/**
 * ================================================================
 * GRIZALUM NOTIFICATION SYSTEM - VERSIÓN CORREGIDA v3.0
 * Sistema centralizado de notificaciones optimizado y funcional
 * ================================================================
 */

console.log('🔔 Iniciando GRIZALUM Notification System v3.0 - Versión Corregida');

// ================================================================
// 🔧 VARIABLES GLOBALES Y CONFIGURACIÓN - CORREGIDAS
// ================================================================
let sistemaNotificacionesGRIZALUM = null; // Nombre único sin conflictos
let notificacionesInicializado = false;

const CONFIGURACION_NOTIFICACIONES = {
    posicion: 'top-right',
    duracionPorDefecto: 5000,
    maxNotificaciones: 5,
    animacion: {
        duracion: 300,
        entrada: 'slideInRight',
        salida: 'slideOutRight'
    },
    tipos: {
        success: { icono: 'fas fa-check-circle', color: '#10b981' },
        error: { icono: 'fas fa-exclamation-circle', color: '#ef4444' },
        warning: { icono: 'fas fa-exclamation-triangle', color: '#f59e0b' },
        info: { icono: 'fas fa-info-circle', color: '#3b82f6' }
    }
};

// ================================================================
// 📦 CLASE PRINCIPAL DEL SISTEMA - SIMPLIFICADA
// ================================================================
class SistemaNotificacionesGRIZALUM {
    constructor() {
        this.version = '3.0.0';
        this.notificaciones = [];
        this.contenedor = null;
        this.metricas = {
            totalMostradas: 0,
            porTipo: { success: 0, error: 0, warning: 0, info: 0 }
        };
        
        console.log('📊 Inicializando sistema de notificaciones v3.0...');
    }

    // ======= INICIALIZACIÓN SIMPLIFICADA =======
    inicializar() {
        try {
            console.log('🔧 Configurando sistema de notificaciones...');
            
            this.crearContenedor();
            this.configurarEstilos();
            
            notificacionesInicializado = true;
            console.log('✅ Sistema de notificaciones inicializado correctamente');
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando notificaciones:', error);
            return false;
        }
    }

    crearContenedor() {
        // Remover contenedor existente si existe
        const existente = document.getElementById('grizalum-notifications-container');
        if (existente) {
            existente.remove();
        }

        // Crear nuevo contenedor
        this.contenedor = document.createElement('div');
        this.contenedor.id = 'grizalum-notifications-container';
        this.contenedor.className = `notifications-container ${CONFIGURACION_NOTIFICACIONES.posicion}`;
        this.contenedor.setAttribute('aria-live', 'polite');
        this.contenedor.setAttribute('aria-label', 'Notificaciones del sistema');
        
        document.body.appendChild(this.contenedor);
        console.log('📦 Contenedor de notificaciones creado');
    }

    configurarEstilos() {
        // Verificar si ya existen los estilos
        if (document.getElementById('grizalum-notification-styles')) {
            return;
        }

        const estilos = document.createElement('style');
        estilos.id = 'grizalum-notification-styles';
        estilos.textContent = `
            .notifications-container {
                position: fixed;
                z-index: 10000;
                pointer-events: none;
                max-width: 400px;
                width: 100%;
            }

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

            .grizalum-notification {
                background: white;
                border-left: 4px solid #3b82f6;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                margin-bottom: 12px;
                padding: 16px;
                pointer-events: auto;
                position: relative;
                transform: translateX(100%);
                transition: all 0.3s ease;
                opacity: 0;
                max-width: 100%;
                font-family: 'Inter', sans-serif;
            }

            .grizalum-notification.notification-enter {
                transform: translateX(0);
                opacity: 1;
            }

            .grizalum-notification.notification-exit {
                transform: translateX(100%);
                opacity: 0;
            }

            .grizalum-notification.success {
                border-left-color: #10b981;
            }

            .grizalum-notification.error {
                border-left-color: #ef4444;
            }

            .grizalum-notification.warning {
                border-left-color: #f59e0b;
            }

            .grizalum-notification.info {
                border-left-color: #3b82f6;
            }

            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }

            .notification-icon {
                font-size: 20px;
                margin-top: 2px;
                flex-shrink: 0;
            }

            .notification-icon.success { color: #10b981; }
            .notification-icon.error { color: #ef4444; }
            .notification-icon.warning { color: #f59e0b; }
            .notification-icon.info { color: #3b82f6; }

            .notification-text {
                flex: 1;
                min-width: 0;
            }

            .notification-title {
                font-weight: 600;
                font-size: 14px;
                color: #1f2937;
                margin-bottom: 4px;
            }

            .notification-message {
                font-size: 14px;
                color: #4b5563;
                line-height: 1.4;
                word-wrap: break-word;
            }

            .notification-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                font-size: 16px;
                padding: 4px;
                border-radius: 4px;
                transition: color 0.2s ease;
            }

            .notification-close:hover {
                color: #6b7280;
                background: #f3f4f6;
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                opacity: 0.3;
                border-radius: 0 0 8px 0;
                transition: width linear;
            }

            @media (max-width: 640px) {
                .notifications-container {
                    max-width: calc(100vw - 40px);
                    left: 20px !important;
                    right: 20px !important;
                }

                .grizalum-notification {
                    font-size: 13px;
                    padding: 12px;
                }
            }

            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }

            @keyframes progressBar {
                from { width: 100%; }
                to { width: 0%; }
            }
        `;
        
        document.head.appendChild(estilos);
        console.log('🎨 Estilos de notificaciones aplicados');
    }

    // ======= FUNCIÓN PRINCIPAL CORREGIDA =======
    mostrar(mensaje, tipo = 'info', duracion = null, opciones = {}) {
        if (!notificacionesInicializado) {
            console.warn('⚠️ Sistema de notificaciones no inicializado, inicializando...');
            this.inicializar();
        }

        // Validación y configuración
        const config = {
            mensaje: String(mensaje || 'Sin mensaje').trim(),
            tipo: ['success', 'error', 'warning', 'info'].includes(tipo) ? tipo : 'info',
            duracion: duracion || opciones.duracion || CONFIGURACION_NOTIFICACIONES.duracionPorDefecto,
            titulo: opciones.titulo || opciones.title || '',
            icono: opciones.icono || CONFIGURACION_NOTIFICACIONES.tipos[tipo]?.icono,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
        };

        // Verificar límite de notificaciones
        if (this.notificaciones.length >= CONFIGURACION_NOTIFICACIONES.maxNotificaciones) {
            this.removerMasAntigua();
        }

        // Crear la notificación
        const notificacion = this.crearElementoNotificacion(config);
        
        // Agregar al contenedor
        if (this.contenedor) {
            this.contenedor.appendChild(notificacion);
            this.notificaciones.push(notificacion);

            // Activar animación de entrada
            setTimeout(() => {
                notificacion.classList.add('notification-enter');
            }, 10);

            // Programar auto-remove
            if (config.duracion > 0) {
                setTimeout(() => {
                    this.remover(notificacion);
                }, config.duracion);
            }

            // Actualizar métricas
            this.metricas.totalMostradas++;
            this.metricas.porTipo[config.tipo]++;

            console.log(`🔔 Notificación mostrada: ${config.tipo} - ${config.mensaje.substring(0, 30)}...`);
        }
        
        return notificacion;
    }

    crearElementoNotificacion(config) {
        const notificacion = document.createElement('div');
        notificacion.className = `grizalum-notification ${config.tipo}`;
        notificacion.id = config.id;
        notificacion.setAttribute('role', 'alert');
        notificacion.setAttribute('aria-live', 'assertive');

        notificacion.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${config.tipo} ${config.icono}" aria-hidden="true"></i>
                <div class="notification-text">
                    ${config.titulo ? `<div class="notification-title">${config.titulo}</div>` : ''}
                    <div class="notification-message">${config.mensaje}</div>
                </div>
            </div>
            <button class="notification-close" title="Cerrar notificación" aria-label="Cerrar">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
            ${config.duracion > 0 ? `<div class="notification-progress" style="animation: progressBar ${config.duracion}ms linear"></div>` : ''}
        `;

        // Configurar evento de cerrar
        const botonCerrar = notificacion.querySelector('.notification-close');
        if (botonCerrar) {
            botonCerrar.addEventListener('click', () => {
                this.remover(notificacion);
            });
        }

        return notificacion;
    }

    // ======= GESTIÓN DE NOTIFICACIONES =======
    remover(notificacion) {
        if (!notificacion || !notificacion.parentElement) return;

        notificacion.classList.add('notification-exit');

        setTimeout(() => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
            this.notificaciones = this.notificaciones.filter(n => n !== notificacion);
        }, CONFIGURACION_NOTIFICACIONES.animacion.duracion);
    }

    removerMasAntigua() {
        if (this.notificaciones.length > 0) {
            this.remover(this.notificaciones[0]);
        }
    }

    limpiarTodas() {
        this.notificaciones.forEach(notificacion => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
        });
        this.notificaciones = [];
        console.log('🧹 Todas las notificaciones limpiadas');
    }

    // ======= MÉTODOS DE CONVENIENCIA =======
    exito(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'success', opciones.duracion || 3000, opciones);
    }

    error(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'error', opciones.duracion || 7000, opciones);
    }

    advertencia(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'warning', opciones.duracion || 5000, opciones);
    }

    informacion(mensaje, opciones = {}) {
        return this.mostrar(mensaje, 'info', opciones.duracion || 4000, opciones);
    }

    // ======= ESTADO Y MÉTRICAS =======
    obtenerEstado() {
        return {
            version: this.version,
            inicializado: notificacionesInicializado,
            activas: this.notificaciones.length,
            metricas: { ...this.metricas }
        };
    }
}

// ================================================================
// 🚀 INICIALIZACIÓN ÚNICA Y ROBUSTA
// ================================================================
function inicializarSistemaNotificaciones() {
    if (sistemaNotificacionesGRIZALUM) {
        console.log('⚠️ Sistema de notificaciones ya inicializado');
        return sistemaNotificacionesGRIZALUM;
    }

    try {
        sistemaNotificacionesGRIZALUM = new SistemaNotificacionesGRIZALUM();
        const exito = sistemaNotificacionesGRIZALUM.inicializar();
        
        if (exito) {
            // Hacer disponible globalmente
            window.sistemaNotificaciones = sistemaNotificacionesGRIZALUM;
            window.notificationSystem = sistemaNotificacionesGRIZALUM;
            
            console.log('✅ Sistema de notificaciones GRIZALUM v3.0 listo');
            return sistemaNotificacionesGRIZALUM;
        }
    } catch (error) {
        console.error('❌ Error crítico inicializando notificaciones:', error);
    }
    
    return null;
}

// ================================================================
// 🌐 FUNCIONES GLOBALES PRINCIPALES
// ================================================================

/**
 * Función principal para mostrar notificaciones
 * Compatible con toda la aplicación GRIZALUM
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 5000) {
    if (!sistemaNotificacionesGRIZALUM) {
        console.warn('Sistema de notificaciones no inicializado, intentando inicializar...');
        inicializarSistemaNotificaciones();
    }
    
    return sistemaNotificacionesGRIZALUM?.mostrar(mensaje, tipo, duracion) || null;
}

/**
 * Funciones de conveniencia
 */
function notificacionExito(mensaje, opciones = {}) {
    return sistemaNotificacionesGRIZALUM?.exito(mensaje, opciones) || mostrarNotificacion(mensaje, 'success', opciones.duracion);
}

function notificacionError(mensaje, opciones = {}) {
    return sistemaNotificacionesGRIZALUM?.error(mensaje, opciones) || mostrarNotificacion(mensaje, 'error', opciones.duracion);
}

function notificacionAdvertencia(mensaje, opciones = {}) {
    return sistemaNotificacionesGRIZALUM?.advertencia(mensaje, opciones) || mostrarNotificacion(mensaje, 'warning', opciones.duracion);
}

function notificacionInfo(mensaje, opciones = {}) {
    return sistemaNotificacionesGRIZALUM?.informacion(mensaje, opciones) || mostrarNotificacion(mensaje, 'info', opciones.duracion);
}

// ================================================================
// 🔔 GESTIÓN DE NOTIFICACIONES DEL ADMIN - CORREGIDA
// ================================================================

/**
 * Obtener notificaciones reales basadas en datos de la empresa actual
 */
function obtenerNotificacionesAdmin() {
    console.log('=== OBTENIENDO NOTIFICACIONES REALES ===');
    
    const gestorPrincipal = window.gestorEmpresas;
    if (!gestorPrincipal || !gestorPrincipal.estado) {
        console.log('No hay gestor de empresas disponible');
        return [];
    }
    
    const empresaActual = gestorPrincipal.estado.empresaActual;
    const empresa = gestorPrincipal.estado.empresas?.[empresaActual];
    
    if (!empresa) {
        console.log('No hay empresa actual seleccionada');
        return [];
    }
    
    // SOLO generar notificaciones si hay datos importantes que reportar
    const notificacionesReales = [];
    const ahora = new Date().toISOString();
    
    // Solo notificar cambios recientes o estados importantes
    if (empresa.estado === 'Operativo') {
        notificacionesReales.push({
            id: `empresa-${empresaActual}-status`,
            titulo: `Empresa: ${empresa.nombre}`,
            mensaje: `Sistema operativo - Última actualización: ${new Date().toLocaleTimeString('es-PE')}`,
            tipo: 'success',
            fecha: ahora,
            remitente: 'Sistema GRIZALUM',
            leida: false
        });
    }
    
    console.log(`Notificaciones generadas: ${notificacionesReales.length}`);
    return notificacionesReales;
}

/**
 * Integración limpia con eventos del sistema
 */
function integrarNotificacionesConSistema() {
    // Solo escuchar eventos importantes
    document.addEventListener('grizalumCompanyChanged', (evento) => {
        const empresa = evento.detail?.company;
        if (empresa && empresa.nombre) {
            mostrarNotificacion(
                `Empresa cambiada: ${empresa.nombre}`,
                'info',
                3000
            );
        }
    });
    
    console.log('Sistema de notificaciones integrado con eventos');
}

/**
 * Contar notificaciones no leídas reales
 */
function contarNotificacionesNoLeidas() {
    const notificaciones = obtenerNotificacionesAdmin();
    return notificaciones.filter(n => !n.leida).length;
}

/**
 * Mostrar centro de notificaciones del administrador
 */
function mostrarNotificacionesAdmin() {
    const notificacionesAdmin = obtenerNotificacionesAdmin();
    
    if (notificacionesAdmin.length === 0) {
        mostrarNotificacion('No hay notificaciones pendientes', 'info', 3000);
        return;
    }

    // Mostrar resumen de notificaciones
    const mensaje = `${notificacionesAdmin.length} notificación(es) del sistema`;
    mostrarNotificacion(mensaje, 'info', 5000);
}

/**
 * Actualizar contador de notificaciones en la UI
 */
function actualizarContadorNotificaciones() {
    const contador = contarNotificacionesNoLeidas();
    
    // Actualizar badges de notificaciones
    const elementos = document.querySelectorAll('.notification-badge, [data-notification-count]');
    elementos.forEach(elemento => {
        if (contador > 0) {
            elemento.textContent = contador;
            elemento.style.display = 'inline-block';
        } else {
            elemento.style.display = 'none';
        }
    });
}

// ================================================================
// 🎯 INICIALIZACIÓN CONTROLADA
// ================================================================

// Una sola estrategia de inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, inicializando sistema de notificaciones...');
    
    // Esperar un poco para que otros sistemas se carguen
    setTimeout(() => {
        inicializarSistemaNotificaciones();
        
        // Integrar con eventos después de inicializar
        setTimeout(() => {
            integrarNotificacionesConSistema();
        }, 500);
        
    }, 100);
});

// Respaldo de inicialización
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!notificacionesInicializado) {
            console.log('🔄 Respaldo: Inicializando notificaciones...');
            inicializarSistemaNotificaciones();
        }
    }, 1000);
});

// ================================================================
// 🌐 EXPOSICIÓN GLOBAL CONTROLADA
// ================================================================

// Funciones principales
window.mostrarNotificacion = mostrarNotificacion;
window.notificacionExito = notificacionExito;
window.notificacionError = notificacionError;
window.notificacionAdvertencia = notificacionAdvertencia;
window.notificacionInfo = notificacionInfo;

// Funciones del admin
window.obtenerNotificacionesAdmin = obtenerNotificacionesAdmin;
window.contarNotificacionesNoLeidas = contarNotificacionesNoLeidas;
window.mostrarNotificacionesAdmin = mostrarNotificacionesAdmin;
window.actualizarContadorNotificaciones = actualizarContadorNotificaciones;

// Objeto de compatibilidad simplificado
window.GrizalumNotifications = {
    mostrar: mostrarNotificacion,
    exito: notificacionExito,
    error: notificacionError,
    advertencia: notificacionAdvertencia,
    info: notificacionInfo,
    limpiar: () => sistemaNotificacionesGRIZALUM?.limpiarTodas(),
    obtenerEstado: () => sistemaNotificacionesGRIZALUM?.obtenerEstado()
};

// ================================================================
// 📝 LOG FINAL
// ================================================================
console.log(`
🔔 ===================================================
   GRIZALUM NOTIFICATION SYSTEM v3.0 - CORREGIDO
🔔 ===================================================

✅ CORRECCIONES APLICADAS:
   • Eliminadas declaraciones duplicadas
   • Eliminadas notificaciones fantasma
   • Simplificada inicialización única
   • Corregidos errores de sintaxis
   • Optimizada gestión de memoria
   • Integración real con datos de empresa

🔧 FUNCIONES DISPONIBLES:
   • mostrarNotificacion(mensaje, tipo, duracion)
   • notificacionExito/Error/Advertencia/Info
   • Sistema de notificaciones del admin

🎯 SISTEMA ROBUSTO Y LIMPIO
🔔 ===================================================
`);

// Exposición final controlada
window.inicializarSistemaNotificaciones = inicializarSistemaNotificaciones;
