// ================================================================
// 🧠 GRIZALUM - CONTROLADOR PRINCIPAL v2.1 CORREGIDO
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
        
        // DATOS FINANCIEROS CONSISTENTES
        this.financialData = {
            ingresos: 2847293,
            gastos: 28700,
            utilidad: 16500,
            crecimiento: 24.8,
            flujo_caja: 24500,
            moneda: 'PEN'
        };
        
        console.log(`🚀 Inicializando ${this.config.name || 'GRIZALUM'} v${this.config.version}`);
        this.init();
    }

    // Configuración de respaldo si config.js no carga
    getDefaultConfig() {
        return {
            version: '2.1.0',
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
            
            // 3. 📦 Inicializar módulos en orden - NO FORZAR GRÁFICOS AQUÍ
            await this.initializeModules();
            
            // 4. 🎨 Configurar interfaz y eventos
            this.bindGlobalEvents();
            
            // 5. 👤 Cargar preferencias del usuario
            this.loadUserPreferences();
            
            // 6. 📊 Inicializar datos financieros PRIMERO
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
            { name: 'FontAwesome', check: () => document.querySelector('.fas, .far, .fab') !== null }
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
        }

        console.log('✅ Verificación de dependencias completada');
    }

    // ======= INICIALIZACIÓN DE MÓDULOS - CORREGIDA =======
    async initializeModules() {
        console.log('📦 Inicializando módulos especializados...');
        
        // NO FORZAR INICIALIZACIÓN DE GRÁFICOS AQUÍ
        // Dejar que cada módulo se inicialice por su cuenta
        
        // Solo verificar disponibilidad sin forzar
        setTimeout(() => {
            if (window.GrizalumCharts) {
                this.modules.GrizalumCharts = window.GrizalumCharts;
                console.log('✅ Módulo GrizalumCharts detectado');
            }
            
            if (window.GrizalumMetrics) {
                this.modules.GrizalumMetrics = window.GrizalumMetrics;
                console.log('✅ Módulo GrizalumMetrics detectado');
            }
        }, 1000);
        
        console.log('✅ Módulos verificados');
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

    // ======= GESTIÓN DE PERÍODOS FINANCIEROS - CORREGIDA =======
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
        
        // Notificar cambio usando sistema correcto
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(`Período cambiado a: ${this.capitalizeFirst(period)}`, 'info');
        }
    }

    updateDataForPeriod(period) {
        // Generar datos consistentes según el período
        const periodData = this.generateDataForPeriod(period);
        
        // Actualizar métricas usando los datos consistentes
        this.updateFinancialMetrics(periodData);
        
        // Disparar evento para que otros módulos se actualicen
        const event = new CustomEvent('periodChanged', {
            detail: { period, data: periodData, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
        
        console.log(`📊 Datos actualizados para período: ${period}`, periodData);
    }

    generateDataForPeriod(period) {
        // Usar datos base consistentes
        const baseData = { ...this.financialData };
        
        const multipliers = {
            'hoy': 0.03,      // Datos del día
            'semana': 0.2,    // Datos de la semana
            'mes': 1.0,       // Base mensual (datos actuales)
            'trimestre': 3.2,  // Datos trimestrales
            'año': 12.5       // Datos anuales
        };
        
        const multiplier = multipliers[period] || 1.0;
        
        return {
            ingresos: Math.round(baseData.ingresos * multiplier),
            gastos: Math.round(baseData.gastos * multiplier),
            utilidad: Math.round(baseData.utilidad * multiplier),
            crecimiento: baseData.crecimiento + (Math.random() * 10 - 5), // Variación ±5%
            flujo_caja: Math.round(baseData.flujo_caja * multiplier),
            moneda: baseData.moneda
        };
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

    // ======= SISTEMA DE NOTIFICACIONES - CORREGIDO =======
    showNotifications() {
        console.log('🔔 Mostrando centro de notificaciones');
        
        // Usar sistema de notificaciones existente si está disponible
        if (window.mostrarNotificacion) {
            const notifications = [
                'Reporte Mensual: Nuevo reporte financiero disponible',
                'Factura Pendiente: Factura #001234 próxima a vencer',
                'Pago Procesado: Pago de S/. 15,000 recibido exitosamente'
            ];
            
            notifications.forEach((message, index) => {
                setTimeout(() => {
                    const types = ['info', 'warning', 'success'];
                    window.mostrarNotificacion(message, types[index] || 'info');
                }, index * 500);
            });
        }
    }

    // ======= DATOS FINANCIEROS - CORREGIDOS =======
    initializeFinancialData() {
        console.log('💰 Inicializando datos financieros consistentes...');
        
        // Usar datos consistentes que coincidan con el HTML
        this.updateFinancialMetrics(this.financialData);
        
        console.log('📊 Datos iniciales aplicados:', this.financialData);
    }

    updateFinancialMetrics(datos) {
        const formatter = new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        });
        
        // Actualizar valores sin animación para evitar conflictos
        this.updateValue('revenueValue', formatter.format(datos.ingresos));
        this.updateValue('expensesValue', formatter.format(datos.gastos));
        this.updateValue('profitValue', formatter.format(datos.utilidad));
        this.updateValue('growthValue', `+${datos.crecimiento.toFixed(1)}%`);
        
        // Actualizar sidebar con los mismos datos
        this.updateValue('sidebarCashFlow', formatter.format(datos.flujo_caja));
        this.updateValue('sidebarProfit', formatter.format(datos.utilidad));
        
        console.log('📊 Métricas actualizadas con datos consistentes');
    }

    updateValue(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = newValue;
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
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion('Conexión restaurada', 'success');
            }
        });
        
        window.addEventListener('offline', () => {
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion('Trabajando sin conexión', 'warning');
            }
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
        
        try {
            const saved = localStorage.getItem('grizalum_preferences');
            const preferences = saved ? JSON.parse(saved) : defaultPreferences;
            this.applyPreferences(preferences);
            console.log('👤 Preferencias cargadas');
        } catch (error) {
            console.warn('⚠️ Error cargando preferencias, usando valores por defecto');
            this.applyPreferences(defaultPreferences);
        }
    }

    saveUserPreference(key, value) {
        try {
            const saved = localStorage.getItem('grizalum_preferences');
            const preferences = saved ? JSON.parse(saved) : {};
            
            preferences[key] = value;
            localStorage.setItem('grizalum_preferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('⚠️ Error guardando preferencia');
        }
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
        
        // Mostrar mensaje de bienvenida usando sistema correcto
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(`¡Bienvenido a ${this.config.name}! Sistema financiero listo.`, 'success');
        }
        
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
        
        // Verificar múltiples posibles nombres del asistente
        if (window.assistantAI && typeof window.assistantAI.toggle === 'function') {
            window.assistantAI.toggle();
        } else if (window.advancedAI && typeof window.advancedAI.toggle === 'function') {
            window.advancedAI.toggle();
        } else if (window.AIAssistant && typeof window.AIAssistant.toggle === 'function') {
            window.AIAssistant.toggle();
        } else {
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion('Asistente IA próximamente disponible', 'info');
            }
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
        version: grizalumApp?.config?.version || '2.1.0',
        name: grizalumApp?.config?.name || 'GRIZALUM',
        isInitialized: grizalumApp?.isInitialized || false,
        currentSection: grizalumApp?.currentSection || null,
        modules: grizalumApp?.modules || {},
        loadTime: grizalumApp ? Date.now() - grizalumApp.startTime : 0,
        financialData: grizalumApp?.financialData || {},
        timestamp: new Date().toISOString()
    };
};

console.log('🎯 GRIZALUM Principal Controller v2.1 CORREGIDO cargado y listo');
console.log('✨ Correcciones aplicadas:');
console.log('  • 📊 Datos financieros consistentes entre sidebar y dashboard');
console.log('  • 🔧 Eliminada inicialización forzada de gráficos que causaba conflictos');
console.log('  • 🔔 Integración correcta con sistema de notificaciones existente');
console.log('  • 📅 Generación de datos coherentes por período');
console.log('  • 🛡️ Manejo robusto de errores mejorado');
console.log('🚀 Controlador principal optimizado para empresas peruanas');
