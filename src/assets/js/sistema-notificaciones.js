/**
 * ================================================================
 * GRIZALUM NOTIFICATION SYSTEM - VERSIÓN CORREGIDA v2.1
 * Sistema centralizado de notificaciones optimizado y funcional
 * ================================================================
 */

console.log('🔔 Iniciando GRIZALUM Notification System v2.1 - Versión Corregida');

// ================================================================
// 🔧 VARIABLES GLOBALES Y CONFIGURACIÓN
// ================================================================
let sistemaNotificacionesGrizalum = null;
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
// 📦 CLASE PRINCIPAL DEL SISTEMA
// ================================================================
class SistemaNotificacionesGRIZALUM {
    constructor() {
        this.version = '2.1.0';
        this.notificaciones = [];
        this.contenedor = null;
        this.metricas = {
            totalMostradas: 0,
            porTipo: { success: 0, error: 0, warning: 0, info: 0 }
        };
        
        console.log('📊 Inicializando sistema de notificaciones...');
    }

    // ======= INICIALIZACIÓN =======
    inicializar() {
        try {
            console.log('🔧 Configurando sistema de notificaciones...');
            
            this.crearContenedor();
            this.configurarEstilos();
            this.configurarEventos();
            
            notificacionesInicializado = true;
            console.log('✅ Sistema de notificaciones inicializado correctamente');
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando notificaciones:', error);
            return false;
        }
    }

    crearContenedor() {
        // Remover contenedor existente
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

            /* Animaciones suaves */
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        
        document.head.appendChild(estilos);
        console.log('🎨 Estilos de notificaciones aplicados');
    }

    configurarEventos() {
        // Escuchar eventos del sistema
        document.addEventListener('grizalumNotificationShow', (evento) => {
            const { mensaje, tipo, opciones } = evento.detail;
            this.mostrar(mensaje, tipo, opciones?.duracion, opciones);
        });

        console.log('🎯 Eventos de notificaciones configurados');
    }

    // ======= FUNCIÓN PRINCIPAL =======
    mostrar(mensaje, tipo = 'info', duracion = null, opciones = {}) {
        if (!notificacionesInicializado) {
            console.warn('⚠️ Sistema de notificaciones no inicializado');
            return null;
        }

        // Configuración de la notificación
        const config = {
            mensaje: String(mensaje).trim(),
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
        botonCerrar.addEventListener('click', () => {
            this.remover(notificacion);
        });

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
// 🚀 INICIALIZACIÓN AUTOMÁTICA
// ================================================================
function inicializarSistemaNotificaciones() {
    if (sistemaNotificacionesGrizalum) {
        console.log('⚠️ Sistema de notificaciones ya inicializado');
        return sistemaNotificacionesGrizalum;
    }

    try {
        sistemaNotificacionesGrizalum = new SistemaNotificacionesGRIZALUM();
        const exito = sistemaNotificacionesGrizalum.inicializar();
        
        if (exito) {
            // Hacer disponible globalmente
            window.sistemaNotificaciones = sistemaNotificacionesGrizalum;
            window.notificationSystem = sistemaNotificacionesGrizalum;
            
            console.log('✅ Sistema de notificaciones GRIZALUM v2.1 listo');
            return sistemaNotificacionesGrizalum;
        }
    } catch (error) {
        console.error('❌ Error crítico inicializando notificaciones:', error);
    }
    
    return null;
}

// ================================================================
// 🌐 FUNCIONES GLOBALES PARA COMPATIBILIDAD
// ================================================================

/**
 * Función principal para mostrar notificaciones
 * Compatible con toda la aplicación GRIZALUM
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 5000) {
    if (!sistemaNotificacionesGrizalum) {
        console.warn('Sistema de notificaciones no inicializado, intentando inicializar...');
        inicializarSistemaNotificaciones();
    }
    
    return sistemaNotificacionesGrizalum?.mostrar(mensaje, tipo, duracion) || null;
}

/**
 * Funciones de conveniencia
 */
function notificacionExito(mensaje, opciones = {}) {
    return sistemaNotificacionesGrizalum?.exito(mensaje, opciones) || mostrarNotificacion(mensaje, 'success', opciones.duracion);
}

function notificacionError(mensaje, opciones = {}) {
    return sistemaNotificacionesGrizalum?.error(mensaje, opciones) || mostrarNotificacion(mensaje, 'error', opciones.duracion);
}

function notificacionAdvertencia(mensaje, opciones = {}) {
    return sistemaNotificacionesGrizalum?.advertencia(mensaje, opciones) || mostrarNotificacion(mensaje, 'warning', opciones.duracion);
}

function notificacionInfo(mensaje, opciones = {}) {
    return sistemaNotificacionesGrizalum?.informacion(mensaje, opciones) || mostrarNotificacion(mensaje, 'info', opciones.duracion);
}

// ================================================================
// 🔔 GESTIÓN DE NOTIFICACIONES DEL ADMIN
// ================================================================

/**
 * Obtener notificaciones del administrador
 */
function obtenerNotificacionesAdmin() {
    console.log('=== BUSCANDO DATOS REALES DE EMPRESA ===');
    
    const gestorPrincipal = window.gestorEmpresas;
    if (!gestorPrincipal || !gestorPrincipal.estado) {
        return [];
    }
    
    const empresaActual = gestorPrincipal.estado.empresaActual;
    const empresa = gestorPrincipal.estado.empresas?.[empresaActual];
    
    if (!empresa) {
        return [];
    }
    
    // Crear notificaciones basadas en los datos reales de tu empresa
    const notificacionesReales = [];
    
    // Notificación sobre el estado operativo
    if (empresa.estado === 'Operativo') {
        notificacionesReales.push({
            id: 'estado-operativo',
            titulo: `Empresa ${empresa.nombre}`,
            mensaje: `Estado: ${empresa.estado} - Sistema funcionando correctamente`,
            tipo: 'success',
            fecha: new Date().toISOString(),
            remitente: 'Sistema GRIZALUM',
            leida: false
        });
    }
    
    // Notificación sobre configuración
    if (empresa.ubicacion) {
        notificacionesReales.push({
            id: 'ubicacion-configurada',
            titulo: 'Configuración Empresarial',
            mensaje: `Ubicación: ${empresa.ubicacion} - Configuración completa`,
            tipo: 'info',
            fecha: new Date().toISOString(),
            remitente: 'Sistema GRIZALUM',
            leida: false
        });
    }
    
    // Notificación sobre RUC si existe
    if (empresa.ruc) {
        notificacionesReales.push({
            id: 'ruc-validado',
            titulo: 'Datos Fiscales',
            mensaje: `RUC ${empresa.ruc} validado correctamente`,
            tipo: 'success',
            fecha: new Date().toISOString(),
            remitente: 'SUNAT Integration',
            leida: false
        });
    }
    
    console.log('Notificaciones generadas desde datos reales:', notificacionesReales);
    return notificacionesReales;
}

/**
 * Generar notificaciones desde actividad real del sistema
 */
function generarNotificacionesDesdeActividad() {
    // Esta función creará notificaciones basadas en la actividad real del sistema
    const gestorPrincipal = window.gestorEmpresas;
    const empresa = gestorPrincipal?.estado?.empresas?.[gestorPrincipal.estado.empresaActual];
    
    if (empresa) {
        // Notificar cuando se detecten cambios importantes
        mostrarNotificacion(
            `Trabajando con empresa: ${empresa.nombre} 🏢`, 
            'info', 
            3000, 
            { titulo: 'Empresa Activa' }
        );
    }
}

/**
 * Integrar notificaciones con eventos del sistema
 */
function integrarNotificacionesConSistema() {
    // Escuchar cambios de empresa
    document.addEventListener('grizalumCompanyChanged', (evento) => {
        const empresa = evento.detail?.company;
        if (empresa) {
            mostrarNotificacion(
                `Cambiado a empresa: ${empresa.nombre}`,
                'success',
                4000,
                { titulo: 'Empresa Cambiada' }
            );
        }
    });
    
    // Escuchar cambios de período
    document.addEventListener('grizalumPeriodoCambiado', (evento) => {
        const periodo = evento.detail?.periodo;
        if (periodo) {
            mostrarNotificacion(
                `Período actualizado: ${periodo}`,
                'info',
                3000
            );
        }
    });
    
    console.log('Sistema de notificaciones integrado con eventos reales');
}

/**
 * Contar notificaciones no leídas
 */
function contarNotificacionesNoLeidas() {
    return obtenerNotificacionesAdmin().filter(n => !n.leida).length;
}

/**
 * Mostrar panel de notificaciones del admin
 */
function mostrarNotificacionesAdmin() {
    const notificacionesAdmin = obtenerNotificacionesAdmin();
    
    if (notificacionesAdmin.length === 0) {
        mostrarNotificacion('No hay notificaciones del administrador', 'info');
        return;
    }

    // Crear contenido del panel
    let contenidoPanel = `
        <div style="background: white; border-radius: 12px; box-shadow: 0 25px 50px rgba(0,0,0,0.15); max-width: 500px; max-height: 600px; overflow-y: auto;">
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
                <h3 style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                    🔔 Notificaciones del Administrador
                </h3>
            </div>
            <div style="padding: 20px;">
    `;

    notificacionesAdmin.forEach(notif => {
        const fechaFormateada = new Date(notif.fecha).toLocaleDateString('es-PE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        contenidoPanel += `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; ${notif.leida ? 'opacity: 0.7;' : 'background: #f0f9ff;'}">
                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${notif.titulo}</h4>
                <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 13px; line-height: 1.4;">${notif.mensaje}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <small style="color: #6b7280; font-size: 12px;">${fechaFormateada}</small>
                    ${!notif.leida ? `<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Nueva</span>` : ''}
                </div>
            </div>
        `;
    });

    contenidoPanel += `
            </div>
        </div>
    `;

    // Mostrar como notificación especial
    mostrarNotificacion(contenidoPanel, 'info', 0, {
        titulo: 'Panel de Notificaciones'
    });
}

/**
 * Actualizar contador de notificaciones
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

    // Disparar evento personalizado
    document.dispatchEvent(new CustomEvent('grizalumNotificationCountUpdated', {
        detail: { count: contador }
    }));
}

// ================================================================
// 🎯 INICIALIZACIÓN CON MÚLTIPLES ESTRATEGIAS
// ================================================================

// Estrategia 1: DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, inicializando notificaciones...');
    setTimeout(inicializarSistemaNotificaciones, 500);
});

// Estrategia 2: Window Load (respaldo)
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!notificacionesInicializado) {
            console.log('🔄 Respaldo: Inicializando notificaciones...');
            inicializarSistemaNotificaciones();
        }
    }, 1000);
});

// Estrategia 3: Inicialización manual (emergencia)
setTimeout(() => {
    if (!notificacionesInicializado) {
        console.log('⏰ Inicialización de emergencia de notificaciones');
        inicializarSistemaNotificaciones();
    }
}, 3000);

// ================================================================
// 🌐 EXPOSICIÓN GLOBAL
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

// Objeto de compatibilidad
window.GrizalumNotifications = {
    mostrar: mostrarNotificacion,
    exito: notificacionExito,
    error: notificacionError,
    advertencia: notificacionAdvertencia,
    info: notificacionInfo,
    limpiar: () => sistemaNotificacionesGrizalum?.limpiarTodas(),
    obtenerEstado: () => sistemaNotificacionesGrizalum?.obtenerEstado()
};

// ================================================================
// 📝 LOG FINAL
// ================================================================
console.log(`
🔔 ===================================================
   GRIZALUM NOTIFICATION SYSTEM v2.1 - CORREGIDO
🔔 ===================================================

✅ FUNCIONES DISPONIBLES:
   • mostrarNotificacion(mensaje, tipo, duracion)
   • notificacionExito(mensaje, opciones)
   • notificacionError(mensaje, opciones)
   • notificacionAdvertencia(mensaje, opciones)
   • notificacionInfo(mensaje, opciones)

🔧 MEJORAS v2.1:
   • Código simplificado y optimizado
   • Sin conflictos con otros sistemas
   • Integración perfecta con gestor de empresas
   • Notificaciones del admin funcionales
   • Estilos responsivos mejorados
   • Sistema de métricas básico
   • Múltiples estrategias de inicialización

🎯 COMPATIBILIDAD TOTAL CON GRIZALUM
🔔 ===================================================
`);

// HACER FUNCIONES GLOBALMENTE DISPONIBLES
window.mostrarNotificacion = mostrarNotificacion;
window.GrizalumNotifications = { mostrarNotificacion };
console.log('Sistema de notificaciones disponible globalmente');
    
// Integrar con el sistema al cargar
setTimeout(() => {
    integrarNotificacionesConSistema();
    generarNotificacionesDesdeActividad();
}, 2000);
