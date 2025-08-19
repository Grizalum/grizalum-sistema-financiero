// ================================================================
// 🧠 GRIZALUM - CONTROLADOR PRINCIPAL v2.0
// Sistema Financiero Empresarial Premium para Empresas Peruanas
// ================================================================

/**
 * GRIZALUM Principal Controller
 * Coordinador maestro de toda la aplicación financiera
 * Maneja inicialización, navegación, eventos y módulos
 */

// ======= CLASE PRINCIPAL GRIZALUM APP =======
class GrizalumApp {
    constructor() {
        this.isInitialized = false;
        this.currentSection = 'dashboard';
        this.modules = {};
        this.charts = {};
        this.config = window.GRIZALUM_CONFIG || this.getDefaultConfig();
        this.startTime = Date.now();
        
        console.log(`🚀 Inicializando ${this.config.name || 'GRIZALUM'} v${this.config.version}`);
        this.init();
    }

    // Configuración de respaldo si config.js no carga
    getDefaultConfig() {
        return {
            version: '2.0.0',
            name: 'GRIZALUM',
            locale: 'es-PE',
            currency: 'PEN',
            loadingDuration: 2000,
            features: {
                charts: true,
                notifications: true,
                ai: true,
                themes: true
            }
        };
    }

    // ======= INICIALIZACIÓN PRINCIPAL =======
    async init() {
        try {
            // 1. 🎬 Mostrar pantalla de carga con progreso
            this.showLoadingScreen();
            
            // 2. 🔧 Verificar dependencias críticas
            await this.checkDependencies();
            
            // 3. 📦 Inicializar módulos en orden
            await this.initializeModules();
            
            // 4. 🎨 Configurar interfaz y eventos
            this.initializeInterface();
            this.bindGlobalEvents();
            
            // 5. 👤 Cargar preferencias del usuario
            this.loadUserPreferences();
            
            // 6. 📊 Inicializar datos financieros
            this.initializeFinancialData();
            
            // 7. ✅ Finalizar carga
            setTimeout(() => {
                this.finalizeInitialization();
            }, this.config.loadingDuration);
            
        } catch (error) {
            console.error('❌ Error crítico inicializando GRIZALUM:', error);
            this.showErrorState(error);
        }
    }

    // ======= VERIFICACIÓN DE DEPENDENCIAS =======
    async checkDependencies() {
        const dependencies = [
            { name: 'Chart.js', check: () => typeof Chart !== 'undefined' },
            { name: 'FontAwesome', check: () => document.querySelector('.fas, .far, .fab') !== null },
            { name: 'Config', check: () => window.GRIZALUM_CONFIG !== undefined }
        ];

        const missing = [];
        
        for (const dep of dependencies) {
            if (!dep.check()) {
                missing.push(dep.name);
                console.warn(`⚠️ Dependencia faltante: ${dep.name}`);
            }
        }

        if (missing.length > 0) {
            console.warn(`⚠️ Dependencias faltantes: ${missing.join(', ')}`);
            // La aplicación puede continuar sin algunas dependencias
        }

        console.log('✅ Verificación de dependencias completada');
    }

    // ======= INICIALIZACIÓN DE MÓDULOS =======
    async initializeModules() {
        console.log('📦 Inicializando módulos especializados...');
        
        // Módulos críticos primero
        await this.waitForModule('GrizalumUtils', 3000);
        await this.waitForModule('GrizalumCharts', 3000);
        await this.waitForModule('GrizalumMetrics', 3000);
        
        // Módulos opcionales
        this.waitForModule('CompanyManager', 2000, false);
        this.waitForModule('AIAssistant', 2000, false);
        this.waitForModule('ThemeManager', 2000, false);
        
        console.log('✅ Módulos inicializados');
    }

    async waitForModule(moduleName, timeout = 5000, critical = true) {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = timeout / 100;
            
            const checkModule = () => {
                if (window[moduleName]) {
                    this.modules[moduleName] = window[moduleName];
                    console.log(`✅ Módulo ${moduleName} cargado`);
                    resolve(true);
                    return;
                }
                
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(checkModule, 100);
                } else {
                    if (critical) {
                        console.error(`❌ Módulo crítico ${moduleName} no cargó en ${timeout}ms`);
                    } else {
                        console.warn(`⚠️ Módulo opcional ${moduleName} no disponible`);
                    }
                    resolve(false);
                }
            };
            
            checkModule();
        });
    }

    // ======= GESTIÓN DE PANTALLA DE CARGA =======
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        loadingScreen.style.display = 'flex';
        
        // Animar barra de progreso de manera más realista
        const progressBar = loadingScreen.querySelector('.loading-progress');
        if (progressBar) {
            let progress = 0;
            const steps = [
                { target: 20, message: 'Cargando configuración...' },
                { target: 40, message: 'Inicializando módulos...' },
                { target: 60, message: 'Configurando interfaz...' },
                { target: 80, message: 'Cargando datos financieros...' },
                { target: 100, message: 'Finalizando...' }
            ];
            
            let currentStep = 0;
            
            const updateProgress = () => {
                if (currentStep < steps.length) {
                    const step = steps[currentStep];
                    const increment = (step.target - progress) / 10;
                    
                    const interval = setInterval(() => {
                        progress += increment;
                        progressBar.style.width = `${Math.min(progress, step.target)}%`;
                        
                        if (progress >= step.target) {
                            clearInterval(interval);
                            currentStep++;
                            
                            // Actualizar mensaje si existe
                            const messageEl = loadingScreen.querySelector('.loading-message');
                            if (messageEl) {
                                messageEl.textContent = step.message;
                            }
                            
                            setTimeout(updateProgress, 200);
                        }
                    }, 50);
                }
            };
            
            updateProgress();
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    // ======= NAVEGACIÓN Y SECCIONES =======
    showSection(sectionId) {
        console.log(`📄 Navegando a sección: ${sectionId}`);
        
        // Ocultar todas las secciones
        const allSections = document.querySelectorAll('[id$="Content"]');
        allSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Mostrar sección objetivo
        const targetSection = document.getElementById(sectionId + 'Content');
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            
            // Animar entrada
            setTimeout(() => {
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Actualizar navegación y título
        this.updateNavigation(sectionId);
        this.updatePageTitle(sectionId);
        this.triggerSectionChange(sectionId);
        
        // Actualizar sección actual
        this.currentSection = sectionId;
    }

    updateNavigation(sectionId) {
        // Remover clase activa de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar clase activa al enlace correspondiente
        const activeLink = document.querySelector(`[onclick*="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updatePageTitle(sectionId) {
        const titles = {
            'dashboard': 'Panel de Control Ejecutivo',
            'cash-flow': 'Gestión de Flujo de Caja',
            'income-statement': 'Estado de Resultados',
            'balance-sheet': 'Balance General',
            'inventory': 'Gestión de Inventario',
            'sales': 'Gestión de Ventas'
        };

        const subtitles = {
            'dashboard': 'Resumen financiero en tiempo real',
            'cash-flow': 'Control y proyección de flujo de caja',
            'income-statement': 'Análisis de ingresos y gastos',
            'balance-sheet': 'Situación patrimonial de la empresa',
            'inventory': 'Control de stock y valorización',
            'sales': 'Gestión comercial y facturación'
        };

        const titleElement = document.getElementById('pageTitle');
        const subtitleElement = document.getElementById('pageSubtitle');
        
        if (titleElement) {
            titleElement.textContent = titles[sectionId] || 'GRIZALUM';
        }
        if (subtitleElement) {
            subtitleElement.textContent = subtitles[sectionId] || '';
        }
    }

    triggerSectionChange(sectionId) {
        const event = new CustomEvent('sectionChanged', {
            detail: { 
                from: this.currentSection, 
                to: sectionId,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    // ======= GESTIÓN DE PERÍODOS FINANCIEROS =======
    changePeriod(period, buttonElement) {
        console.log(`📅 Cambiando período financiero a: ${period}`);
        
        // Actualizar botones activos
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        // Actualizar datos para el nuevo período
        this.updateDataForPeriod(period);
        
        // Notificar cambio
        this.showNotification(
            `📅 Período cambiado a: ${this.capitalizeFirst(period)}`,
            'info',
            2000
        );
    }

    updateDataForPeriod(period) {
        // Mostrar indicador de carga
        this.showLoadingOverlay('Actualizando datos financieros...');
        
        // Simular carga de datos (aquí conectarías con tu API)
        setTimeout(() => {
            // Actualizar métricas si el módulo está disponible
            if (this.modules.GrizalumMetrics) {
                this.modules.GrizalumMetrics.updateForPeriod(period);
            }
            
            // Actualizar gráficos si están disponibles
            if (this.modules.GrizalumCharts) {
                this.modules.GrizalumCharts.updateForPeriod(period);
            }
            
            this.hideLoadingOverlay();
            console.log(`📊 Datos actualizados para período: ${period}`);
        }, 1000);
    }

    // ======= SIDEBAR RESPONSIVO =======
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar) {
            const isCollapsed = sidebar.classList.contains('collapsed');
            
            if (isCollapsed) {
                sidebar.classList.remove('collapsed');
                if (mainContent) mainContent.classList.remove('sidebar-collapsed');
            } else {
                sidebar.classList.add('collapsed');
                if (mainContent) mainContent.classList.add('sidebar-collapsed');
            }
            
            // Guardar preferencia
            this.saveUserPreference('sidebarCollapsed', !isCollapsed);
        }
    }

    handleResponsiveDesign() {
        const sidebar = document.getElementById('sidebar');
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024;
        
        if (sidebar) {
            if (isMobile) {
                sidebar.classList.add('mobile-hidden');
                document.body.classList.add('mobile-view');
            } else {
                sidebar.classList.remove('mobile-hidden');
                document.body.classList.remove('mobile-view');
            }
            
            if (isTablet) {
                document.body.classList.add('tablet-view');
            } else {
                document.body.classList.remove('tablet-view');
            }
        }
    }

    // ======= SISTEMA DE NOTIFICACIONES INTEGRADO =======
    showNotifications() {
        console.log('🔔 Mostrando centro de notificaciones');
        
        // Simular notificaciones financieras realistas
        const notifications = [
            { 
                type: 'info', 
                title: 'Reporte Mensual',
                message: 'Nuevo reporte financiero disponible', 
                time: '5 min',
                action: () => this.showSection('reports')
            },
            { 
                type: 'warning', 
                title: 'Factura Pendiente',
                message: 'Factura #001234 próxima a vencer', 
                time: '1 hora',
                action: () => this.showSection('accounts-receivable')
            },
            { 
                type: 'success', 
                title: 'Pago Procesado',
                message: 'Pago de S/. 15,000 recibido exitosamente', 
                time: '2 horas',
                action: () => this.showSection('cash-flow')
            }
        ];
        
        notifications.forEach((notif, index) => {
            setTimeout(() => {
                this.showNotification(
                    `${notif.title}: ${notif.message} (${notif.time})`,
                    notif.type,
                    4000,
                    notif.action
                );
            }, index * 500);
        });
    }

    showNotification(message, type = 'info', duration = 3000, action = null) {
        const container = document.getElementById('notificationContainer') || this.createNotificationContainer();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
                ${action ? '<button class="notification-action">Ver detalles</button>' : ''}
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Event listeners
        if (action) {
            notification.querySelector('.notification-action').addEventListener('click', action);
        }
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-remover si tiene duración
        if (duration > 0) {
            setTimeout(() => this.removeNotification(notification), duration);
        }
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    removeNotification(notification) {
        notification.classList.add('removing');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ======= DATOS FINANCIEROS =======
    initializeFinancialData() {
        console.log('💰 Inicializando datos financieros...');
        
        // Datos ejemplo realistas para empresas peruanas
        const defaultData = {
            ingresos: 2847293,
            gastos: 1847293,
            utilidad: 1000000,
            crecimiento: 24.8,
            flujo_caja: 524500,
            moneda: 'PEN'
        };
        
        // Actualizar métricas en dashboard
        this.updateFinancialMetrics(defaultData);
        
        // Inicializar gráficos si Chart.js está disponible
        if (typeof Chart !== 'undefined' && this.modules.GrizalumCharts) {
            this.modules.GrizalumCharts.initialize(defaultData);
        }
    }

    updateFinancialMetrics(datos) {
        const formatter = new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        });
        
        // Actualizar valores con animación
        this.animateValue('revenueValue', formatter.format(datos.ingresos));
        this.animateValue('expensesValue', formatter.format(datos.gastos));
        this.animateValue('profitValue', formatter.format(datos.utilidad));
        this.animateValue('growthValue', `+${datos.crecimiento}%`);
        
        // Actualizar sidebar
        this.animateValue('sidebarCashFlow', formatter.format(datos.flujo_caja));
        this.animateValue('sidebarProfit', formatter.format(datos.utilidad));
    }

    animateValue(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.transform = 'scale(1.05)';
            element.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
            }, 100);
        }
    }

    // ======= EVENTOS GLOBALES =======
    bindGlobalEvents() {
        console.log('🔗 Configurando eventos globales...');
        
        // Responsive design
        window.addEventListener('resize', this.debounce(() => {
            this.handleResponsiveDesign();
        }, 250));
        
        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Eventos de conectividad
        window.addEventListener('online', () => {
            this.showNotification('🌐 Conexión restaurada', 'success', 3000);
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('📡 Trabajando sin conexión', 'warning', 5000);
        });
        
        // Click fuera para cerrar elementos
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
        
        console.log('✅ Eventos globales configurados');
    }

    handleKeyboardShortcuts(e) {
        // Alt + número para cambiar secciones rápidamente
        if (e.altKey) {
            const shortcuts = {
                '1': 'dashboard',
                '2': 'cash-flow',
                '3': 'income-statement',
                '4': 'balance-sheet'
            };
            
            if (shortcuts[e.key]) {
                e.preventDefault();
                this.showSection(shortcuts[e.key]);
            }
        }
        
        // Escape para cerrar modales
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal, .management-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
    }

    handleOutsideClick(event) {
        // Cerrar dropdowns
        const dropdowns = document.querySelectorAll('.dropdown.show');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // ======= PREFERENCIAS DE USUARIO =======
    loadUserPreferences() {
        const defaultPreferences = {
            theme: 'gold',
            sidebarCollapsed: false,
            defaultPeriod: 'mes',
            language: 'es-PE',
            currency: 'PEN'
        };
        
        const saved = localStorage.getItem('grizalum_preferences');
        const preferences = saved ? JSON.parse(saved) : defaultPreferences;
        
        this.applyPreferences(preferences);
        console.log('👤 Preferencias cargadas');
    }

    saveUserPreference(key, value) {
        const saved = localStorage.getItem('grizalum_preferences');
        const preferences = saved ? JSON.parse(saved) : {};
        
        preferences[key] = value;
        localStorage.setItem('grizalum_preferences', JSON.stringify(preferences));
    }

    applyPreferences(preferences) {
        // Aplicar tema
        if (preferences.theme && preferences.theme !== 'gold') {
            this.changeTheme(preferences.theme);
        }
        
        // Aplicar estado del sidebar
        if (preferences.sidebarCollapsed) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('collapsed');
        }
    }

    // ======= UTILIDADES =======
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showLoadingOverlay(message = 'Cargando...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <p>${message}</p>
        `;
        document.body.appendChild(overlay);
    }

    hideLoadingOverlay() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    showErrorState(error) {
        console.error('💥 Estado de error:', error);
        
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-state';
        errorContainer.innerHTML = `
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2>Error al cargar GRIZALUM</h2>
            <p>${error.message || 'Ha ocurrido un error inesperado'}</p>
            <button onclick="location.reload()" class="error-reload-btn">
                <i class="fas fa-redo"></i>
                Recargar Aplicación
            </button>
        `;
        
        document.body.appendChild(errorContainer);
    }

    // ======= FINALIZACIÓN =======
    finalizeInitialization() {
        this.hideLoadingScreen();
        this.isInitialized = true;
        
        const loadTime = Date.now() - this.startTime;
        console.log(`🎉 GRIZALUM inicializado en ${loadTime}ms`);
        
        // Mostrar mensaje de bienvenida
        this.showNotification(
            `¡Bienvenido a ${this.config.name}! Sistema financiero listo.`,
            'success',
            3000
        );
        
        // Trigger evento de app lista
        const readyEvent = new CustomEvent('grizalumReady', {
            detail: { 
                version: this.config.version,
                loadTime: loadTime,
                modules: Object.keys(this.modules)
            }
        });
        document.dispatchEvent(readyEvent);
        
        // Aplicar responsive design inicial
        this.handleResponsiveDesign();
        
        console.log('🚀 Sistema GRIZALUM completamente operativo');
    }

    // ======= MÉTODOS PÚBLICOS PARA HTML =======
    changeTheme(theme) {
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
        this.saveUserPreference('theme', theme);
        
        // Actualizar selector de temas
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const activeOption = document.querySelector(`[data-theme="${theme}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    toggleAIAssistant() {
        console.log('🧠 Activando asistente IA...');
        if (this.modules.AIAssistant) {
            this.modules.AIAssistant.toggle();
        } else {
            this.showNotification(
                '🧠 Asistente IA próximamente disponible',
                'info',
                3000
            );
        }
    }
}

// ======= FUNCIONES GLOBALES PARA HTML =======

// Variables globales
let grizalumApp = null;

// Funciones principales exportadas para uso en HTML
function showSection(sectionId) {
    if (grizalumApp) {
        grizalumApp.showSection(sectionId);
    }
}

function changePeriod(period, buttonElement) {
    if (grizalumApp) {
        grizalumApp.changePeriod(period, buttonElement);
    }
}

function toggleSidebar() {
    if (grizalumApp) {
        grizalumApp.toggleSidebar();
    }
}

function showNotifications() {
    if (grizalumApp) {
        grizalumApp.showNotifications();
    }
}

function changeTheme(theme) {
    if (grizalumApp) {
        grizalumApp.changeTheme(theme);
    }
}

function toggleAIAssistant() {
    if (grizalumApp) {
        grizalumApp.toggleAIAssistant();
    }
}

// ======= INICIALIZACIÓN =======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado - Iniciando GRIZALUM...');
    
    try {
        // Crear instancia principal
        grizalumApp = new GrizalumApp();
        
        // Hacer disponible globalmente
        window.grizalumApp = grizalumApp;
        
        // Manejo de errores globales
        window.addEventListener('error', (e) => {
            console.error('❌ Error JavaScript:', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Promesa rechazada:', e.reason);
        });
        
    } catch (error) {
        console.error('💥 Error crítico iniciando GRIZALUM:', error);
    }
});

// ======= INFORMACIÓN DEL SISTEMA =======
window.getGrizalumInfo = function() {
    return {
        version: grizalumApp?.config?.version || '2.0.0',
        name: grizalumApp?.config?.name || 'GRIZALUM',
        isInitialized: grizalumApp?.isInitialized || false,
        currentSection: grizalumApp?.currentSection || null,
        modules: grizalumApp?.modules || {},
        loadTime: grizalumApp ? Date.now() - grizalumApp.startTime : 0,
        timestamp: new Date().toISOString()
    };
};

console.log('🎯 GRIZALUM Principal Controller cargado y listo');
console.log('✨ Funcionalidades integradas:');
console.log('  • 🧠 Coordinación inteligente de módulos');
console.log('  • 📊 Gestión financiera profesional');
console.log('  • 🎨 Interfaz responsiva premium');
console.log('  • 🔔 Sistema de notificaciones integrado');
console.log('  • ⚡ Eventos y shortcuts optimizados');
console.log('  • 💾 Persistencia de preferencias');
console.log('  • 🛡️ Manejo robusto de errores');
console.log('🚀 Controlador principal listo para empresas peruanas');

/**
 * ===================================================
 * CONECTROR PARA IA ASSISTANT - GRIZALUM v4.0
 * Conecta el botón del header con el asistente IA
 * ===================================================
 */
function toggleAIAssistant() {
    console.log('🎯 Botón IA Assistant clickeado desde header');
    
    // Verificar si el asistente está inicializado
    if (window.assistantAI && typeof window.assistantAI.toggle === 'function') {
        console.log('✅ Conectando con assistantAI.toggle()');
        window.assistantAI.toggle();
        
        // Asegurar visibilidad del panel
        setTimeout(() => {
            const panel = document.getElementById('aiAssistantPanel');
            if (panel && panel.classList.contains('show')) {
                panel.style.zIndex = '999999'; // Encima de sidebar (z-index: 1000)
                console.log('🔝 Z-index del panel ajustado');
            }
        }, 100);
        
    } else if (window.advancedAI && typeof window.advancedAI.toggle === 'function') {
        console.log('✅ Conectando con advancedAI.toggle()');
        window.advancedAI.toggle();
        
    } else {
        console.error('❌ Asistente IA no encontrado');
        // Mostrar notificación usando tu sistema
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('Asistente IA no disponible', 'error');
        }
    }
}
