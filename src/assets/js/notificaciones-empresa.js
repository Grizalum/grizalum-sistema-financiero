/**
 * ================================================================
 * GRIZALUM NOTIFICACIONES EMPRESA - FUNCIONES ESPECÍFICAS v1.0
 * Complementa el sistema principal con funciones específicas por empresa
 * ================================================================
 */

class NotificacionesEmpresa {
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
        
        console.log('🏢 Inicializando Notificaciones Empresa...');
        this.init();
    }

    init() {
        // Esperar a que el sistema principal esté listo
        this.waitForMainSystem();
    }

    waitForMainSystem() {
        const checkSystem = () => {
            if (window.GrizalumNotificaciones) {
                this.setupEmpresaFunctions();
                this.setupAutoNotifications();
                this.initialized = true;
                console.log('✅ Notificaciones Empresa inicializado');
            } else {
                setTimeout(checkSystem, 500);
            }
        };
        
        checkSystem();
    }

    setupEmpresaFunctions() {
        // Funciones específicas para notificaciones de empresa
        this.createNotificationTemplates();
        this.setupPeriodicChecks();
    }

    createNotificationTemplates() {
        // Templates de notificaciones comunes para empresas
        window.NotificacionesTemplates = {
            // Notificaciones financieras
            facturaVencimiento: (dias, monto) => ({
                titulo: '⚠️ Factura próxima a vencer',
                mensaje: `Tienes una factura de S/. ${monto} que vence en ${dias} días`,
                tipo: 'warning'
            }),

            metaAlcanzada: (metrica, valor) => ({
                titulo: '🎯 Meta alcanzada',
                mensaje: `¡Felicitaciones! Has alcanzado tu meta de ${metrica}: ${valor}`,
                tipo: 'success'
            }),

            alertaCashFlow: (nivel) => ({
                titulo: '💰 Alerta de Flujo de Caja',
                mensaje: `Tu flujo de caja está en nivel ${nivel}. Considera revisar tus finanzas`,
                tipo: 'warning'
            }),

            reporteDisponible: (tipoReporte) => ({
                titulo: '📊 Reporte disponible',
                mensaje: `Tu ${tipoReporte} está listo para revisión`,
                tipo: 'info'
            }),

            // Notificaciones de sistema
            backupCompletado: () => ({
                titulo: '💾 Backup completado',
                mensaje: 'Tus datos han sido respaldados exitosamente',
                tipo: 'success'
            }),

            mantenimientoProgramado: (fecha) => ({
                titulo: '🔧 Mantenimiento programado',
                mensaje: `Mantenimiento del sistema programado para ${fecha}`,
                tipo: 'info'
            })
        };

        console.log('📋 Templates de notificaciones creados');
    }

    setupPeriodicChecks() {
        // Verificaciones automáticas cada 5 minutos
        setInterval(() => {
            this.checkFinancialAlerts();
            this.checkSystemAlerts();
        }, 5 * 60 * 1000); // 5 minutos

        console.log('⏰ Verificaciones periódicas configuradas');
    }

    checkFinancialAlerts() {
        // Verificar alertas financieras automáticas
        try {
            const empresaActual = window.GrizalumNotificaciones?.estado()?.empresaActual;
            if (!empresaActual) return;

            // Verificar métricas financieras
            this.checkCashFlowAlerts(empresaActual);
            this.checkGoalAlerts(empresaActual);
            
        } catch (error) {
            console.warn('[NOTIF-EMPRESA] Error en verificación financiera:', error);
        }
    }

    checkCashFlowAlerts(empresaId) {
        // Obtener datos financieros actuales
        const metricas = window.GrizalumMetrics?.getCurrentMetrics();
        if (!metricas) return;

        const cashFlow = metricas.sidebarCashFlow?.value || 0;
        const expenses = metricas.expensesValue?.value || 0;

        // Alerta si el flujo de caja es bajo en relación a gastos
        if (expenses > 0 && cashFlow < (expenses * 0.5)) {
            this.enviarNotificacionEmpresa(empresaId, 
                window.NotificacionesTemplates.alertaCashFlow('bajo')
            );
        }
    }

    checkGoalAlerts(empresaId) {
        // Verificar si se han alcanzado metas (ejemplo básico)
        const metricas = window.GrizalumMetrics?.getCurrentMetrics();
        if (!metricas) return;

        const crecimiento = metricas.growthValue?.value || 0;
        
        // Alerta si se alcanza meta de crecimiento del 20%
        if (crecimiento >= 20) {
            this.enviarNotificacionEmpresa(empresaId,
                window.NotificacionesTemplates.metaAlcanzada('crecimiento', `${crecimiento}%`)
            );
        }
    }

    checkSystemAlerts() {
        // Verificaciones del sistema
        const ahora = new Date();
        const hora = ahora.getHours();
        
        // Backup automático diario a las 23:00
        if (hora === 23 && ahora.getMinutes() === 0) {
            this.enviarBackupNotification();
        }
    }

    setupAutoNotifications() {
        // Configurar notificaciones automáticas basadas en eventos
        
        // Escuchar cambios en métricas
        document.addEventListener('allMetricsUpdated', (e) => {
            this.handleMetricsUpdate(e.detail);
        });

        // Escuchar cambios de empresa
        document.addEventListener('companyChanged', (e) => {
            this.handleCompanyChange(e.detail);
        });

        console.log('🔔 Notificaciones automáticas configuradas');
    }

    handleMetricsUpdate(metricsData) {
        const empresaActual = window.GrizalumNotificaciones?.estado()?.empresaActual;
        if (!empresaActual || !metricsData) return;

        // Generar notificaciones basadas en cambios de métricas
        if (metricsData.updatedCount > 0) {
            // Ejemplo: notificar cuando todas las métricas se actualizan
            setTimeout(() => {
                this.enviarNotificacionEmpresa(empresaActual, {
                    titulo: '📊 Métricas actualizadas',
                    mensaje: `Se han actualizado ${metricsData.updatedCount} métricas financieras`,
                    tipo: 'info'
                });
            }, 2000); // Retraso para no saturar
        }
    }

    handleCompanyChange(companyData) {
        if (!companyData || !companyData.empresaId) return;

        // Notificación de bienvenida al cambiar empresa
        setTimeout(() => {
            this.enviarNotificacionEmpresa(companyData.empresaId, {
                titulo: `🏢 Bienvenido a ${companyData.nombre || 'tu empresa'}`,
                mensaje: 'Sistema financiero cargado correctamente',
                tipo: 'success'
            });
        }, 1000);
    }

    enviarNotificacionEmpresa(empresaId, notificacion) {
        if (!window.GrizalumNotificaciones) return false;

        // Verificar que no existe una notificación similar reciente
        const existentes = window.GrizalumNotificaciones.obtener(empresaId);
        const yaExiste = existentes.some(n => 
            n.titulo === notificacion.titulo && 
            Date.now() - new Date(n.fecha).getTime() < 300000 // 5 minutos
        );

        if (yaExiste) {
            console.log('📧 Notificación duplicada evitada:', notificacion.titulo);
            return false;
        }

        return window.GrizalumNotificaciones.crear(empresaId, notificacion);
    }

    enviarBackupNotification() {
        const empresaActual = window.GrizalumNotificaciones?.estado()?.empresaActual;
        if (empresaActual) {
            this.enviarNotificacionEmpresa(empresaActual,
                window.NotificacionesTemplates.backupCompletado()
            );
        }
    }

    // FUNCIONES PARA ADMIN (integración futura)
    crearNotificacionPersonalizada(empresaId, titulo, mensaje, tipo = 'info') {
        return this.enviarNotificacionEmpresa(empresaId, {
            titulo: titulo,
            mensaje: mensaje,
            tipo: tipo
        });
    }

    // FUNCIONES DE UTILIDAD
    obtenerEstadisticasNotificaciones(empresaId) {
        const notificaciones = window.GrizalumNotificaciones?.obtener(empresaId) || [];
        
        return {
            total: notificaciones.length,
            noLeidas: notificaciones.filter(n => !n.leida).length,
            porTipo: {
                info: notificaciones.filter(n => n.tipo === 'info').length,
                warning: notificaciones.filter(n => n.tipo === 'warning').length,
                error: notificaciones.filter(n => n.tipo === 'error').length,
                success: notificaciones.filter(n => n.tipo === 'success').length
            }
        };
    }

    limpiarNotificacionesAntiguas(empresaId, diasAntiguedad = 30) {
        const notificaciones = window.GrizalumNotificaciones?.obtener(empresaId) || [];
        const limite = new Date();
        limite.setDate(limite.getDate() - diasAntiguedad);

        const notificacionesLimpias = notificaciones.filter(n => 
            new Date(n.fecha) > limite
        );

        // Actualizar las notificaciones (esto se conectará mejor en la versión completa)
        console.log(`🧹 Limpieza de notificaciones: ${notificaciones.length - notificacionesLimpias.length} eliminadas`);
        
        return notificacionesLimpias.length;
    }

    // INTEGRACIÓN CON IA (preparación para expansión)
    configurarNotificacionesIA() {
        // Preparar integración con sistema de IA
        if (window.asistentesIA) {
            window.asistentesIA.onRecommendation = (recomendacion) => {
                const empresaActual = window.GrizalumNotificaciones?.estado()?.empresaActual;
                if (empresaActual) {
                    this.enviarNotificacionEmpresa(empresaActual, {
                        titulo: '🤖 Recomendación de IA',
                        mensaje: recomendacion,
                        tipo: 'info'
                    });
                }
            };
        }
    }

    // API PÚBLICA PARA ESTA CLASE
    getPublicAPI() {
        return {
            // Crear notificación personalizada
            crear: (empresaId, titulo, mensaje, tipo) => 
                this.crearNotificacionPersonalizada(empresaId, titulo, mensaje, tipo),
            
            // Obtener estadísticas
            estadisticas: (empresaId) => 
                this.obtenerEstadisticasNotificaciones(empresaId),
            
            // Limpiar antiguas
            limpiar: (empresaId, dias) => 
                this.limpiarNotificacionesAntiguas(empresaId, dias),
            
            // Templates disponibles
            templates: () => window.NotificacionesTemplates || {},
            
            // Estado
            estado: () => ({
                inicializado: this.initialized,
                version: this.version
            })
        };
    }
}

// INICIALIZACIÓN
const notificacionesEmpresa = new NotificacionesEmpresa();

// HACER DISPONIBLE GLOBALMENTE
setTimeout(() => {
    if (notificacionesEmpresa.initialized) {
        window.NotificacionesEmpresa = notificacionesEmpresa.getPublicAPI();
        console.log('🌐 API de NotificacionesEmpresa disponible');
    }
}, 2000);

// FUNCIONES DE CONVENIENCIA GLOBAL
window.enviarNotificacionEmpresa = (empresaId, titulo, mensaje, tipo = 'info') => {
    return notificacionesEmpresa.crearNotificacionPersonalizada(empresaId, titulo, mensaje, tipo);
};

window.notificarTodasLasEmpresas = (titulo, mensaje, tipo = 'info') => {
    const sistema = window.GrizalumNotificaciones?.estado();
    if (!sistema) return false;
    
    // Obtener todas las empresas con notificaciones
    const empresas = ['empresa-001', 'empresa-002', 'empresa-003']; // Después conectar con tu sistema
    
    empresas.forEach(empresaId => {
        notificacionesEmpresa.crearNotificacionPersonalizada(empresaId, titulo, mensaje, tipo);
    });
    
    return true;
};

console.log('🏢 GRIZALUM Notificaciones Empresa v1.0 cargado');
console.log('✨ Funciones disponibles:');
console.log('  📧 Templates de notificaciones comunes');
console.log('  ⏰ Verificaciones automáticas financieras');
console.log('  🤖 Preparado para integración con IA');
console.log('  📊 Estadísticas de notificaciones');
console.log('  🧹 Limpieza automática de notificaciones antiguas');
console.log('  🌐 API pública para expansión futura');
