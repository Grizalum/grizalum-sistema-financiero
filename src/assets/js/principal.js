// ================================================================
// GRIZALUM - CONTROLADOR PRINCIPAL v3.0 REFACTORIZADO
// Sistema Financiero Empresarial Premium
// ================================================================

class GrizalumApp {
    constructor() {
        this.isInitialized = false;
        this.currentSection = 'dashboard';
        this.modules = {};
        this.charts = {};
        this.config = window.GRIZALUM_CONFIG || this.getDefaultConfig();
        this.startTime = Date.now();
        
        // Registro de secciones disponibles
        this.sections = new Map();
        
        this.financialData = {
            ingresos: 0,
            gastos: 0,
            utilidad: 0,
            crecimiento: 0,
            flujo_caja: 0,
            moneda: 'PEN'
        };
        
        console.log(`Inicializando ${this.config.name || 'GRIZALUM'} v${this.config.version}`);
        this.init();
    }

    getDefaultConfig() {
        return {
            version: '3.0.0',
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

    async init() {
        try {
            this.showLoadingScreen();
            await this.checkDependencies();
            await this.initializeModules();
            this.registerSections(); // NUEVO: Registrar secciones disponibles
            this.bindGlobalEvents();
            this.loadUserPreferences();
            this.initializeFinancialData();
            
            setTimeout(() => {
                this.finalizeInitialization();
            }, this.config.loadingDuration);
            
        } catch (error) {
            console.error('Error crítico inicializando GRIZALUM:', error);
            this.showErrorState(error);
        }
    }

    async checkDependencies() {
        const dependencies = [
            { name: 'Chart.js', check: () => typeof Chart !== 'undefined' },
            { name: 'FontAwesome', check: () => document.querySelector('.fas, .far, .fab') !== null }
        ];

        const missing = [];
        
        for (const dep of dependencies) {
            if (!dep.check()) {
                missing.push(dep.name);
                console.warn(`Dependencia faltante: ${dep.name}`);
            }
        }

        if (missing.length > 0) {
            console.warn(`Dependencias faltantes: ${missing.join(', ')}`);
        }

        console.log('Verificación de dependencias completada');
    }

    async initializeModules() {
        console.log('Inicializando módulos especializados...');
        
        setTimeout(() => {
            if (window.GrizalumCharts) {
                this.modules.GrizalumCharts = window.GrizalumCharts;
                console.log('Módulo GrizalumCharts detectado');
            }
            
            if (window.GrizalumMetrics) {
                this.modules.GrizalumMetrics = window.GrizalumMetrics;
                console.log('Módulo GrizalumMetrics detectado');
            }
            
            if (window.GestorCuentasBancarias) {
                this.modules.CuentasBancarias = window.GestorCuentasBancarias;
                console.log('Módulo Cuentas Bancarias detectado');
            }
        }, 1000);
        
        console.log('Módulos verificados');
    }

    // NUEVO: Sistema de registro de secciones
    registerSections() {
        console.log('Registrando secciones disponibles...');
        
        // Buscar todas las secciones en el DOM
        const sectionElements = document.querySelectorAll('.dashboard-content[id$="Content"]');
        
        sectionElements.forEach(element => {
            const sectionId = element.id.replace('Content', '');
            
            this.sections.set(sectionId, {
                id: sectionId,
                elementId: element.id,
                element: element,
                title: this.getSectionTitle(sectionId),
                subtitle: this.getSectionSubtitle(sectionId)
            });
            
            console.log(`  Sección registrada: ${sectionId}`);
        });
        
        console.log(`Total secciones registradas: ${this.sections.size}`);
    }

    getSectionTitle(sectionId) {
        const titles = {
            'dashboard': 'Panel de Control Ejecutivo',
            'cash-flow': 'Gestión de Flujo de Caja',
            'income-statement': 'Estado de Resultados',
            'balance-sheet': 'Balance General',
            'cuentas-bancarias': 'Gestión de Cuentas Bancarias',
            'inventory': 'Gestión de Inventario',
            'sales': 'Gestión de Ventas'
        };
        return titles[sectionId] || 'GRIZALUM';
    }

    getSectionSubtitle(sectionId) {
        const subtitles = {
            'dashboard': 'Resumen financiero en tiempo real',
            'cash-flow': 'Control y proyección de flujo de caja',
            'income-statement': 'Análisis de ingresos y gastos',
            'balance-sheet': 'Situación patrimonial de la empresa',
            'cuentas-bancarias': 'Administra tus cuentas, cajas y movimientos',
            'inventory': 'Control de stock y valorización',
            'sales': 'Gestión comercial y facturación'
        };
        return subtitles[sectionId] || '';
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        loadingScreen.style.display = 'flex';
        
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

    // MÉTODO REFACTORIZADO: Navegación robusta
    showSection(sectionId) {
        console.log(`Navegando a sección: ${sectionId}`);
        
        // Verificar si la sección está registrada
        if (!this.sections.has(sectionId)) {
            console.warn(`Sección no encontrada: ${sectionId}`);
            console.log('Secciones disponibles:', Array.from(this.sections.keys()));
            return false;
        }
        
        const sectionData = this.sections.get(sectionId);
        
        // Ocultar todas las secciones
        this.sections.forEach((section) => {
            if (section.element) {
                section.element.classList.remove('active');
                section.element.style.display = 'none';
                section.element.style.opacity = '0';
            }
        });
        
        // Mostrar la sección objetivo
        if (sectionData.element) {
            sectionData.element.style.display = 'flex';
            sectionData.element.classList.add('active');
            
            // Animar entrada
            requestAnimationFrame(() => {
                sectionData.element.style.opacity = '1';
                sectionData.element.style.transform = 'translateY(0)';
            });
            
            // Actualizar título
            this.updatePageTitle(sectionData.title, sectionData.subtitle);
            
            // Actualizar navegación
            this.updateNavigation(sectionId);
            
            // Disparar evento
            this.triggerSectionChange(sectionId);
            
            // Actualizar sección actual
            this.currentSection = sectionId;
            
            console.log(`Sección mostrada exitosamente: ${sectionId}`);
            return true;
        }
        
        return false;
    }

    updateNavigation(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Buscar enlace por múltiples métodos
        const activeLink = document.querySelector(`[onclick*="'${sectionId}'"]`) ||
                          document.querySelector(`[onclick*='"${sectionId}"']`) ||
                          document.querySelector(`[data-section="${sectionId}"]`);
        
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updatePageTitle(title, subtitle = '') {
        const titleElement = document.getElementById('pageTitle');
        const subtitleElement = document.getElementById('pageSubtitle');
        
        if (titleElement) {
            titleElement.textContent = title;
        }
        if (subtitleElement) {
            subtitleElement.textContent = subtitle;
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

    changePeriod(period, buttonElement) {
        console.log(`Cambiando período financiero a: ${period}`);
        
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        this.updateDataForPeriod(period);
        this.mostrarNotificacionSegura(`Período cambiado a: ${this.capitalizeFirst(period)}`, 'info');
    }

    updateDataForPeriod(period) {
        const periodData = this.generateDataForPeriod(period);
        this.updateFinancialMetrics(periodData);
        
        const event = new CustomEvent('periodChanged', {
            detail: { period, data: periodData, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
        
        console.log(`Datos actualizados para período: ${period}`, periodData);
    }

    generateDataForPeriod(period) {
        const baseData = { ...this.financialData };
        
        const multipliers = {
            'hoy': 0.03,
            'semana': 0.2,
            'mes': 1.0,
            'trimestre': 3.2,
            'año': 12.5
        };
        
        const multiplier = multipliers[period] || 1.0;
        
        return {
            ingresos: Math.round(baseData.ingresos * multiplier),
            gastos: Math.round(baseData.gastos * multiplier),
            utilidad: Math.round(baseData.utilidad * multiplier),
            crecimiento: baseData.crecimiento + (Math.random() * 10 - 5),
            flujo_caja: Math.round(baseData.flujo_caja * multiplier),
            moneda: baseData.moneda
        };
    }

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

    showNotifications() {
        console.log('Mostrando centro de notificaciones');
        
        const notifications = [
            'Reporte Mensual: Nuevo reporte financiero disponible',
            'Factura Pendiente: Factura #001234 próxima a vencer',
            'Pago Procesado: Pago de S/. 15,000 recibido exitosamente'
        ];
        
        notifications.forEach((message, index) => {
            setTimeout(() => {
                const types = ['info', 'warning', 'success'];
                this.mostrarNotificacionSegura(message, types[index] || 'info');
            }, index * 500);
        });
    }

    mostrarNotificacionSegura(mensaje, tipo = 'info', duracion = 5000) {
        try {
            if (window.sistemaNotificaciones && window.sistemaNotificaciones.mostrar) {
                return window.sistemaNotificaciones.mostrar(mensaje, tipo, duracion);
            } else if (window.mostrarNotificacion && typeof window.mostrarNotificacion === 'function') {
                return window.mostrarNotificacion(mensaje, tipo, duracion);
            } else if (window.GrizalumNotifications && window.GrizalumNotifications.mostrar) {
                return window.GrizalumNotifications.mostrar(mensaje, tipo, duracion);
            } else {
                const emoji = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
                console.log(`${emoji[tipo] || 'ℹ️'} [${tipo.toUpperCase()}] ${mensaje}`);
                return null;
            }
        } catch (error) {
            console.warn('Error mostrando notificación:', error);
            console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
            return null;
        }
    }

    initializeFinancialData() {
        console.log('Inicializando datos financieros consistentes...');
        this.updateFinancialMetrics(this.financialData);
        console.log('Datos iniciales aplicados:', this.financialData);
    }

    updateFinancialMetrics(datos) {
        const formatter = new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        });
        
        this.updateValue('revenueValue', formatter.format(datos.ingresos));
        this.updateValue('expensesValue', formatter.format(datos.gastos));
        this.updateValue('profitValue', formatter.format(datos.utilidad));
        this.updateValue('growthValue', `+${datos.crecimiento.toFixed(1)}%`);
        this.updateValue('sidebarCashFlow', formatter.format(datos.flujo_caja));
        this.updateValue('sidebarProfit', formatter.format(datos.utilidad));
        
        console.log('Métricas actualizadas con datos consistentes');
    }

    updateValue(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = newValue;
        }
    }

    bindGlobalEvents() {
        console.log('Configurando eventos globales...');
        
        window.addEventListener('resize', this.debounce(() => {
            this.handleResponsiveDesign();
        }, 250));
        
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        window.addEventListener('online', () => {
            this.mostrarNotificacionSegura('Conexión restaurada', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.mostrarNotificacionSegura('Trabajando sin conexión', 'warning');
        });
        
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
        
        console.log('Eventos globales configurados');
    }

    handleKeyboardShortcuts(e) {
        if (e.altKey) {
            const shortcuts = {
                '1': 'dashboard',
                '2': 'cash-flow',
                '3': 'income-statement',
                '4': 'balance-sheet',
                '5': 'cuentas-bancarias'
            };
            
            if (shortcuts[e.key]) {
                e.preventDefault();
                this.showSection(shortcuts[e.key]);
            }
        }
        
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
        const dropdowns = document.querySelectorAll('.dropdown.show');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

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
            console.log('Preferencias cargadas');
        } catch (error) {
            console.warn('Error cargando preferencias, usando valores por defecto');
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
            console.warn('Error guardando preferencia');
        }
    }

    applyPreferences(preferences) {
        if (preferences.theme && preferences.theme !== 'gold') {
            this.changeTheme(preferences.theme);
        }
        
        if (preferences.sidebarCollapsed) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('collapsed');
        }
    }

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
        console.error('Estado de error:', error);
        
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

    finalizeInitialization() {
    this.hideLoadingScreen();
    this.isInitialized = true;
    
    // CRÍTICO: Registrar secciones AQUÍ cuando el DOM está completamente listo
    this.registerSections();
    
    const loadTime = Date.now() - this.startTime;
    console.log(`GRIZALUM inicializado en ${loadTime}ms`);
    
    this.mostrarNotificacionSegura(`¡Bienvenido a ${this.config.name}! Sistema financiero listo.`, 'success');
    
    const readyEvent = new CustomEvent('grizalumReady', {
        detail: { 
            version: this.config.version,
            loadTime: loadTime,
            modules: Object.keys(this.modules),
            sections: Array.from(this.sections.keys())
        }
    });
    document.dispatchEvent(readyEvent);
    
    this.handleResponsiveDesign();
    
    // Mostrar dashboard por defecto
    this.showSection('dashboard');
    
    console.log('Sistema GRIZALUM completamente operativo');
    console.log(`Secciones registradas: ${this.sections.size}`);
}

    changeTheme(theme) {
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
        this.saveUserPreference('theme', theme);
        
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const activeOption = document.querySelector(`[data-theme="${theme}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    toggleAIAssistant() {
        console.log('Activando asistente IA...');
        
        if (window.assistantAI && typeof window.assistantAI.toggle === 'function') {
            window.assistantAI.toggle();
        } else if (window.advancedAI && typeof window.advancedAI.toggle === 'function') {
            window.advancedAI.toggle();
        } else if (window.AIAssistant && typeof window.AIAssistant.toggle === 'function') {
            window.AIAssistant.toggle();
        } else {
            this.mostrarNotificacionSegura('Asistente IA próximamente disponible', 'info');
        }
    }
}

// Funciones globales
let grizalumApp = null;

function showSection(sectionId) {
    if (grizalumApp) {
        return grizalumApp.showSection(sectionId);
    }
    console.warn('GrizalumApp no inicializada');
    return false;
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

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Iniciando GRIZALUM...');
    
    try {
        grizalumApp = new GrizalumApp();
        window.grizalumApp = grizalumApp;
        
        window.addEventListener('error', (e) => {
            console.error('Error JavaScript:', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promesa rechazada:', e.reason);
        });
        
    } catch (error) {
        console.error('Error crítico iniciando GRIZALUM:', error);
    }
});

window.getGrizalumInfo = function() {
    return {
        version: grizalumApp?.config?.version || '3.0.0',
        name: grizalumApp?.config?.name || 'GRIZALUM',
        isInitialized: grizalumApp?.isInitialized || false,
        currentSection: grizalumApp?.currentSection || null,
        modules: grizalumApp?.modules || {},
        sections: grizalumApp ? Array.from(grizalumApp.sections.keys()) : [],
        loadTime: grizalumApp ? Date.now() - grizalumApp.startTime : 0,
        financialData: grizalumApp?.financialData || {},
        timestamp: new Date().toISOString()
    };
};

console.log('GRIZALUM Principal Controller v3.0 REFACTORIZADO cargado');
console.log('Mejoras v3.0:');
console.log('  • Sistema de registro de secciones automático');
console.log('  • Navegación robusta sin conflictos');
console.log('  • Validación de secciones existentes');
console.log('  • Preparado para escalabilidad');
console.log('  • Sincronización perfecta con módulos');
