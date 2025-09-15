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
