/**
 * ================================================
 * GRIZALUM - MAIN MODULE
 * Coordinador principal y funciones generales
 * ================================================
 */

// ======= CONFIGURACIÓN GLOBAL =======
const GRIZALUM_CONFIG = {
    version: '1.0.0',
    appName: 'GRIZALUM',
    debug: true,
    loadingDuration: 2000,
    features: {
        aiAssistant: true,
        companyManager: true,
        charts: true,
        notifications: true,
        responsiveDesign: true
    }
};

// ======= CLASE PRINCIPAL GRIZALUM APP =======
class GrizalumApp {
    constructor() {
        this.isInitialized = false;
        this.currentSection = 'dashboard';
        this.modules = {};
        this.init();
    }

    // Inicializar aplicación
    async init() {
        console.log(`🚀 Inicializando ${GRIZALUM_CONFIG.appName} v${GRIZALUM_CONFIG.version}`);
        
        try {
            // Mostrar loading screen
            this.showLoadingScreen();
            
            // Inicializar módulos base
            await this.initializeModules();
            
            // Configurar eventos globales
            this.bindGlobalEvents();
            
            // Inicializar interfaz
            this.initializeInterface();
            
            // Cargar configuración guardada
            this.loadUserPreferences();
            
            // Ocultar loading después del tiempo configurado
            setTimeout(() => {
                this.hideLoadingScreen();
                this.isInitialized = true;
                this.onAppReady();
            }, GRIZALUM_CONFIG.loadingDuration);
            
        } catch (error) {
            console.error('❌ Error inicializando GRIZALUM:', error);
            this.showErrorState(error);
        }
    }

    // Inicializar módulos
    async initializeModules() {
        console.log('📦 Inicializando módulos...');
        
        // Los módulos se inicializan automáticamente con sus propios DOMContentLoaded
        // Aquí solo registramos las referencias cuando estén disponibles
        
        this.waitForModule('companyManager', 5000);
        this.waitForModule('aiAssistant', 5000);
        
        console.log('✅ Módulos registrados');
    }

    // Esperar a que un módulo esté disponible
    waitForModule(moduleName, timeout = 5000) {
        let attempts = 0;
        const maxAttempts = timeout / 100;
        
        const checkModule = () => {
            if (window[moduleName]) {
                this.modules[moduleName] = window[moduleName];
                console.log(`✅ Módulo ${moduleName} disponible`);
                return;
            }
            
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(checkModule, 100);
            } else {
                console.warn(`⚠️ Módulo ${moduleName} no se cargó en ${timeout}ms`);
            }
        };
        
        checkModule();
    }

    // ======= GESTIÓN DE LOADING =======

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            
            // Animar barra de progreso
            const progressBar = loadingScreen.querySelector('.loading-progress');
            if (progressBar) {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress > 100) progress = 100;
                    
                    progressBar.style.width = `${progress}%`;
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                    }
                }, 200);
            }
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    // ======= GESTIÓN DE SECCIONES =======

    showSection(sectionId) {
        console.log(`📄 Cambiando a sección: ${sectionId}`);
        
        // Ocultar todas las secciones
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar sección solicitada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Actualizar navegación
            this.updateNavigation(sectionId);
            
            // Actualizar título de página
            this.updatePageTitle(sectionId);
            
            // Trigger evento personalizado
            this.triggerSectionChange(sectionId);
        } else {
            console.warn(`⚠️ Sección no encontrada: ${sectionId}`);
        }
    }

    updateNavigation(sectionId) {
        // Actualizar enlaces activos en navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[onclick*="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updatePageTitle(sectionId) {
        const titles = {
            'dashboard': 'Dashboard Ejecutivo',
            'cash-flow': 'Gestión de Flujo de Caja',
            'income-statement': 'Estado de Resultados',
            'balance-sheet': 'Balance General',
            'accounts-receivable': 'Cuentas por Cobrar',
            'accounts-payable': 'Cuentas por Pagar',
            'inventory': 'Gestión de Inventario',
            'sales': 'Gestión de Ventas',
            'purchases': 'Gestión de Compras',
            'financial-analysis': 'Análisis Financiero',
            'reports': 'Reportes Gerenciales'
        };

        const subtitles = {
            'dashboard': 'Resumen financiero en tiempo real',
            'cash-flow': 'Control y proyección de flujo de caja',
            'income-statement': 'Análisis de ingresos y gastos',
            'balance-sheet': 'Situación patrimonial de la empresa',
            'accounts-receivable': 'Gestión de cobranzas y clientes',
            'accounts-payable': 'Control de pagos a proveedores',
            'inventory': 'Control de stock y valorización',
            'sales': 'Gestión comercial y facturación',
            'purchases': 'Gestión de compras y proveedores',
            'financial-analysis': 'Indicadores y ratios financieros',
            'reports': 'Informes ejecutivos y operativos'
        };

        const titleElement = document.getElementById('pageTitle');
        const subtitleElement = document.getElementById('pageSubtitle');
        
        if (titleElement) titleElement.textContent = titles[sectionId] || 'GRIZALUM';
        if (subtitleElement) subtitleElement.textContent = subtitles[sectionId] || '';
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

    // ======= GESTIÓN DE PERÍODOS =======

    changePeriod(period, buttonElement) {
        console.log(`📅 Cambiando período a: ${period}`);
        
        // Actualizar botones activos
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        // Aquí se actualizarían los datos según el período
        this.updateDataForPeriod(period);
        
        // Mostrar notificación
        if (window.GrizalumUtils) {
            window.GrizalumUtils.showInfoNotification(
                `📅 Período cambiado a: ${this.capitalizeFirst(period)}`,
                2000
            );
        }
    }

    updateDataForPeriod(period) {
        // Simular actualización de datos
        const loadingOverlay = window.GrizalumUtils ? 
            window.GrizalumUtils.showLoading(
                document.querySelector('.content-area'),
                `Cargando datos de ${period}...`
            ) : null;
        
        // Simular carga de datos
        setTimeout(() => {
            if (loadingOverlay && window.GrizalumUtils) {
                window.GrizalumUtils.hideLoading(document.querySelector('.content-area'));
            }
            
            console.log(`📊 Datos actualizados para período: ${period}`);
        }, 1000);
    }

    // ======= RESPONSIVE Y SIDEBAR =======

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
            
            if (mainContent) {
                mainContent.classList.toggle('sidebar-collapsed');
            }
        }
    }

    // Auto-colapsar sidebar en móviles
    handleResponsiveDesign() {
        const sidebar = document.getElementById('sidebar');
        const isMobile = window.innerWidth <= 768;
        
        if (sidebar) {
            if (isMobile) {
                sidebar.classList.add('mobile-hidden');
            } else {
                sidebar.classList.remove('mobile-hidden');
            }
        }
    }

    // ======= NOTIFICACIONES =======

    showNotifications() {
        console.log('🔔 Mostrando centro de notificaciones');
        
        // Simular notificaciones
        const notifications = [
            { type: 'info', message: 'Nuevo reporte mensual disponible', time: '5 min' },
            { type: 'warning', message: 'Factura #001 próxima a vencer', time: '1 hora' },
            { type: 'success', message: 'Pago de cliente procesado exitosamente', time: '2 horas' }
        ];
        
        if (window.GrizalumUtils) {
            notifications.forEach((notif, index) => {
                setTimeout(() => {
                    window.GrizalumUtils.showNotification(
                        `${notif.message} (${notif.time})`,
                        notif.type,
                        4000
                    );
                }, index * 500);
            });
        }
    }

    // ======= EVENTOS GLOBALES =======

    bindGlobalEvents() {
        console.log('🔗 Vinculando eventos globales...');
        
        // Responsive design
        window.addEventListener('resize', window.GrizalumUtils ? 
            window.GrizalumUtils.debounce(() => this.handleResponsiveDesign(), 250) :
            () => this.handleResponsiveDesign()
        );
        
        // Escape key para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Eventos de sección personalizada
        document.addEventListener('sectionChanged', (e) => {
            console.log(`📄 Sección cambiada: ${e.detail.from} → ${e.detail.to}`);
        });
        
        // Click fuera de elementos para cerrar dropdowns
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
        
        // Prevenir zoom en iOS
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
        
        console.log('✅ Eventos globales vinculados');
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal, .management-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
    }

    handleOutsideClick(event) {
        // Cerrar dropdowns si se hace click fuera
        const dropdowns = document.querySelectorAll('.dropdown.show, .company-dropdown.show');
        dropdowns.forEach(dropdown => {
            const container = dropdown.closest('.dropdown-container, .company-selector');
            if (container && !container.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // ======= INICIALIZACIÓN DE INTERFAZ =======

    initializeInterface() {
        console.log('🎨 Inicializando interfaz...');
        
        // Aplicar responsive design inicial
        this.handleResponsiveDesign();
        
        // Configurar tooltips si están disponibles
        this.initializeTooltips();
        
        // Configurar animaciones de entrada
        this.initializeAnimations();
        
        console.log('✅ Interfaz inicializada');
    }

    initializeTooltips() {
        const elementsWithTooltips = document.querySelectorAll('[title]');
        elementsWithTooltips.forEach(element => {
            // Aquí se podrían inicializar tooltips más avanzados
            element.addEventListener('mouseenter', function() {
                // Mostrar tooltip personalizado
            });
        });
    }

    initializeAnimations() {
        // Observador de intersección para animaciones on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observar elementos animables
        document.querySelectorAll('.kpi-card, .chart-card, .executive-card').forEach(el => {
            observer.observe(el);
        });
    }

    // ======= PREFERENCIAS DE USUARIO =======

    loadUserPreferences() {
        console.log('👤 Cargando preferencias de usuario...');
        
        if (!window.GrizalumUtils) return;
        
        const preferences = window.GrizalumUtils.loadFromStorage('grizalum_preferences', {
            theme: 'light',
            sidebarCollapsed: false,
            defaultPeriod: 'mes',
            language: 'es'
        });
        
        this.applyPreferences(preferences);
        
        console.log('✅ Preferencias cargadas:', preferences);
    }

    saveUserPreferences(preferences) {
        if (window.GrizalumUtils) {
            window.GrizalumUtils.saveToStorage('grizalum_preferences', preferences);
        }
    }

    applyPreferences(preferences) {
        // Aplicar tema
        if (preferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Aplicar estado del sidebar
        if (preferences.sidebarCollapsed) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('collapsed');
        }
        
        // Aplicar período por defecto
        const defaultPeriodBtn = document.querySelector(`[onclick*="${preferences.defaultPeriod}"]`);
        if (defaultPeriodBtn) {
            this.changePeriod(preferences.defaultPeriod, defaultPeriodBtn);
        }
    }

    // ======= UTILIDADES =======

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showErrorState(error) {
        const errorHTML = `
            <div class="error-state" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 1rem;
                z-index: 10000;
            ">
                <div style="color: #ef4444; font-size: 3rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 style="color: #374151; margin: 0;">Error al cargar GRIZALUM</h2>
                <p style="color: #6b7280; margin: 0; text-align: center; max-width: 400px;">
                    ${error.message || 'Ha ocurrido un error inesperado. Por favor, recarga la página.'}
                </p>
                <button onclick="location.reload()" style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    Recargar Página
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }

    onAppReady() {
        console.log('🎉 GRIZALUM está listo para usar!');
        
        // Mostrar mensaje de bienvenida
        if (window.GrizalumUtils) {
            window.GrizalumUtils.showSuccessNotification(
                `¡Bienvenido a ${GRIZALUM_CONFIG.appName}! Sistema cargado exitosamente.`,
                3000
            );
        }
        
        // Trigger evento de app lista
        const readyEvent = new CustomEvent('grizalumReady', {
            detail: { 
                version: GRIZALUM_CONFIG.version,
                loadTime: Date.now(),
                modules: Object.keys(this.modules)
            }
        });
        
        document.dispatchEvent(readyEvent);
        
        // Log de estado final
        console.log('📊 Estado de la aplicación:');
        console.log('  ✅ Aplicación iniciada');
        console.log('  ✅ Módulos cargados:', Object.keys(this.modules));
        console.log('  ✅ Sección actual:', this.currentSection);
        console.log('🚀 ¡Sistema listo para operar!');
    }
}

// ======= FUNCIONES PLACEHOLDER =======

// Funciones que se implementarán en futuras versiones
function generateAIReport() {
    console.log('🤖 Generando reporte con IA...');
    if (window.GrizalumUtils) {
        window.GrizalumUtils.showInfoNotification(
            '🤖 Generando análisis con IA... Próximamente funcionalidad completa',
            3000
        );
    }
}

function exportCashFlow() {
    console.log('📁 Exportando flujo de caja...');
    if (window.GrizalumUtils) {
        window.GrizalumUtils.showInfoNotification(
            '📁 Exportación de datos próximamente',
            3000
        );
    }
}

function showCashFlowForm() {
    console.log('📝 Mostrando formulario de flujo de caja...');
    if (window.GrizalumUtils) {
        window.GrizalumUtils.showInfoNotification(
            '📝 Formulario de transacciones próximamente',
            3000
        );
    }
}

function editTransaction(id) {
    console.log(`✏️ Editando transacción ${id}...`);
    if (window.GrizalumUtils) {
        window.GrizalumUtils.showInfoNotification(
            `✏️ Editor de transacciones próximamente`,
            3000
        );
    }
}

// ======= FUNCIONES GLOBALES EXPORTADAS =======

// Función principal para mostrar secciones (usada en HTML)
function showSection(sectionId) {
    // Ocultar todas las secciones
    const allSections = document.querySelectorAll('[id$="Content"]');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección solicitada
    const targetSection = document.getElementById(sectionId + 'Content');
    if (targetSection) {
        targetSection.style.display = 'block';
        console.log(`✅ Mostrando sección: ${sectionId}`);
    } else {
        console.warn(`⚠️ Sección no encontrada: ${sectionId}Content`);
    }
}

// Función para cambiar período (usada en HTML)
function changePeriod(period, buttonElement) {
    if (window.grizalumApp) {
        window.grizalumApp.changePeriod(period, buttonElement);
    }
}

// Función para toggle sidebar (usada en HTML)
function toggleSidebar() {
    if (window.grizalumApp) {
        window.grizalumApp.toggleSidebar();
    }
}

// Función para mostrar notificaciones (usada en HTML)
function showNotifications() {
    if (window.grizalumApp) {
        window.grizalumApp.showNotifications();
    }
}

// ======= PWA Y SERVICE WORKER =======

// Registro del Service Worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            console.log('✅ Service Worker registrado:', registration.scope);
            
            // Escuchar actualizaciones
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // Nueva versión disponible
                            if (window.GrizalumUtils) {
                                window.GrizalumUtils.showNotification(
                                    'Nueva versión disponible',
                                    'info',
                                    0,
                                    [{
                                        label: 'Actualizar',
                                        handler: () => location.reload()
                                    }]
                                );
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error('❌ Error registrando Service Worker:', error);
        }
    }
}

// ======= INICIALIZACIÓN =======

// Instancia global de la aplicación
let grizalumApp = null;

// Event listener principal
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM cargado, iniciando GRIZALUM...');
    
    try {
        // Crear instancia principal de la aplicación
        grizalumApp = new GrizalumApp();
        
        // Hacer disponible globalmente
        window.grizalumApp = grizalumApp;
        
        // Registrar Service Worker
        await registerServiceWorker();
        
        // Event listener para cuando la app esté lista
        document.addEventListener('grizalumReady', (e) => {
            console.log('🎉 GRIZALUM completamente inicializado:', e.detail);
        });
        
    } catch (error) {
        console.error('❌ Error crítico iniciando GRIZALUM:', error);
    }
});

// ======= DETECCIÓN DE CAMBIOS DE CONEXIÓN =======

// Manejar cambios en la conectividad
window.addEventListener('online', () => {
    console.log('🌐 Conexión restaurada');
    if (window.GrizalumUtils) {
        window.GrizalumUtils.showSuccessNotification(
            '🌐 Conexión a internet restaurada',
            3000
        );
    }
});

window.addEventListener('offline', () => {
    console.log('📡 Sin conexión a internet');
    if (window.GrizalumUtils) {
        window.GrizalumUtils.showWarningNotification(
            '📡 Sin conexión a internet. Trabajando en modo offline.',
            5000
        );
    }
});

// ======= MANEJO DE ERRORES GLOBALES =======

// Capturar errores JavaScript no manejados
window.addEventListener('error', (e) => {
    console.error('❌ Error JavaScript:', e.error);
    
    if (GRIZALUM_CONFIG.debug && window.GrizalumUtils) {
        window.GrizalumUtils.showErrorNotification(
            `Error: ${e.error?.message || 'Error desconocido'}`,
            5000
        );
    }
});

// Capturar promesas rechazadas no manejadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promesa rechazada:', e.reason);
    
    if (GRIZALUM_CONFIG.debug && window.GrizalumUtils) {
        window.GrizalumUtils.showErrorNotification(
            `Error de promesa: ${e.reason?.message || 'Error desconocido'}`,
            5000
        );
    }
});

// ======= EXPORTAR CONFIGURACIÓN =======

// Hacer configuración disponible globalmente
window.GRIZALUM_CONFIG = GRIZALUM_CONFIG;

// Función para obtener información del sistema
window.getGrizalumInfo = function() {
    return {
        version: GRIZALUM_CONFIG.version,
        appName: GRIZALUM_CONFIG.appName,
        isInitialized: grizalumApp?.isInitialized || false,
        currentSection: grizalumApp?.currentSection || null,
        modules: grizalumApp?.modules || {},
        features: GRIZALUM_CONFIG.features,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
};

console.log('🎯 Main Module cargado');
console.log('✨ Funcionalidades principales:');
console.log('  • Coordinación de módulos');
console.log('  • Gestión de secciones y navegación');
console.log('  • Sistema de notificaciones');
console.log('  • Manejo de responsive design');
console.log('  • PWA y Service Worker');
console.log('  • Preferencias de usuario');
console.log('  • Manejo de errores globales');
console.log('🚀 ¡Coordinador principal listo!');
