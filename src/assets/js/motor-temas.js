// ================================================================
// MOTOR DE TEMAS GRIZALUM V2.1 - CORREGIDO PARA COLORES POR EMPRESA
// Sistema profesional de temas con efectos modernos
// SOLUCIÓN: Cada empresa mantiene colores únicos e independientes
// ================================================================

console.log('🎨 Cargando Motor de Temas GRIZALUM v2.1 - CORREGIDO...');

// ================================================================
// CONFIGURACIÓN GLOBAL DEL MOTOR
// ================================================================
const GRIZALUM_THEME_CONFIG = {
    version: '2.1.0',
    defaultTheme: 'gold',
    transitionDuration: '0.4s',
    enableAnimations: true,
    enableGlassEffects: true,
    enableParallax: true,
    autoSave: true
};

// ================================================================
// CLASE PRINCIPAL DEL MOTOR DE TEMAS MEJORADO
// ================================================================
class GrizalumThemeEngine {
    constructor() {
        this.currentTheme = null;
        this.currentCompany = null;
        this.companyThemes = new Map(); // NUEVO: Temas específicos por empresa
        this.isInitialized = false;
        this.transitionInProgress = false;
        
        // MAPEO CORREGIDO: HTML names -> Theme definitions
        this.themeMap = {
            'gold': {
                id: 'gold',
                name: 'Goldman Executive',
                primary: '#d4af37',
                primaryDark: '#b8941f', 
                primaryLight: '#e8c55a',
                secondary: '#f4e4a7',
                accent: '#c19b26',
                description: 'Tema dorado ejecutivo premium'
            },
            'blue': {
                id: 'blue',
                name: 'Corporate Blue',
                primary: '#0ea5e9',
                primaryDark: '#0284c7',
                primaryLight: '#38bdf8', 
                secondary: '#e0f2fe',
                accent: '#0369a1',
                description: 'Azul corporativo moderno'
            },
            'green': {
                id: 'green',
                name: 'Growth Green',
                primary: '#10b981',
                primaryDark: '#059669',
                primaryLight: '#34d399',
                secondary: '#d1fae5',
                accent: '#047857',
                description: 'Verde crecimiento sostenible'
            },
            'purple': {
                id: 'purple', 
                name: 'Innovation Purple',
                primary: '#8b5cf6',
                primaryDark: '#7c3aed',
                primaryLight: '#a78bfa',
                secondary: '#ede9fe',
                accent: '#6d28d9',
                description: 'Púrpura innovación premium'
            },
            'red': {
                id: 'red',
                name: 'Energy Orange',
                primary: '#f97316',
                primaryDark: '#ea580c', 
                primaryLight: '#fb923c',
                secondary: '#fed7aa',
                accent: '#dc2626',
                description: 'Naranja energía vibrante'
            },
            'dark': {
                id: 'dark',
                name: 'Professional Dark',
                primary: '#60a5fa',
                primaryDark: '#3b82f6',
                primaryLight: '#93c5fd',
                secondary: '#1e293b',
                accent: '#2563eb',
                description: 'Modo oscuro profesional'
            }
        };
        
        this.customThemes = new Map();
    }

    // ================================================================
    // INICIALIZACIÓN DEL MOTOR
    // ================================================================
    initialize() {
        if (this.isInitialized) {
            console.warn('Motor de temas ya inicializado');
            return;
        }

        console.log('🚀 Inicializando Motor de Temas v2.1...');
        
        this.createBaseStyles();
        this.setupEventListeners();
        this.loadSavedPreferences();
        this.setupThemeSelector();
        this.applyDefaultTheme();
        
        this.isInitialized = true;
        
        // Notificar que el motor está listo
        this.dispatchEvent('themeEngineReady', {
            version: GRIZALUM_THEME_CONFIG.version,
            availableThemes: Object.keys(this.themeMap)
        });
        
        console.log('✅ Motor de Temas inicializado correctamente');
        console.log('🎨 Temas disponibles:', Object.keys(this.themeMap));
    }

    // ================================================================
    // CREACIÓN DE ESTILOS BASE
    // ================================================================
    createBaseStyles() {
        const styleId = 'grizalum-theme-engine-base';
        
        // Eliminar estilos previos
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* ===== GRIZALUM THEME ENGINE V2.1 BASE STYLES ===== */
            
            :root {
                --theme-transition: ${GRIZALUM_THEME_CONFIG.transitionDuration};
                --glass-opacity: 0.08;
                --glass-blur: 20px;
                --shadow-strength: 0.15;
                --glow-strength: 0.25;
            }
            
            /* Base futurista mejorada */
            body {
                background: linear-gradient(135deg, 
                    #0f1419 0%, 
                    #1a1f2e 25%, 
                    #2d3748 50%, 
                    #1a1f2e 75%, 
                    #0f1419 100%) !important;
                color: #e2e8f0 !important;
                min-height: 100vh;
                transition: all var(--theme-transition) cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Transiciones globales suaves */
            *:not(.no-transition) {
                transition: 
                    background-color var(--theme-transition) cubic-bezier(0.4, 0, 0.2, 1),
                    border-color var(--theme-transition) cubic-bezier(0.4, 0, 0.2, 1),
                    color var(--theme-transition) cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow var(--theme-transition) cubic-bezier(0.4, 0, 0.2, 1),
                    transform var(--theme-transition) cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            /* Estados de transición */
            .theme-transitioning {
                pointer-events: none;
                opacity: 0.9;
            }
            
            .theme-transitioning::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, 
                    transparent, 
                    var(--theme-primary, #d4af37), 
                    transparent);
                animation: themeLoading 1s ease-in-out;
                z-index: 999999;
            }
            
            @keyframes themeLoading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            /* Efectos de cristal mejorados */
            .glass-effect {
                background: rgba(255, 255, 255, var(--glass-opacity)) !important;
                backdrop-filter: blur(var(--glass-blur)) saturate(180%) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            
            [data-theme="dark"] .glass-effect {
                background: rgba(30, 41, 59, 0.8) !important;
                backdrop-filter: blur(var(--glass-blur)) saturate(180%) brightness(0.8) !important;
            }
            
            /* Animaciones de entrada */
            .fade-in-up {
                animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Efectos de hover mejorados */
            .hover-lift:hover {
                transform: translateY(-4px) !important;
            }
            
            .hover-glow:hover {
                box-shadow: 0 0 30px var(--theme-primary-alpha, rgba(212, 175, 55, 0.3)) !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 Estilos base del motor aplicados');
    }

    // ================================================================
    // FUNCIÓN PRINCIPAL DE CAMBIO DE TEMA (MEJORADA)
    // ================================================================
    changeTheme(themeName, options = {}) {
        if (this.transitionInProgress) {
            console.warn('Transición de tema en progreso, esperando...');
            return;
        }

        const theme = this.themeMap[themeName];
        if (!theme) {
            console.error(`Tema "${themeName}" no encontrado. Temas disponibles:`, Object.keys(this.themeMap));
            return;
        }

        console.log(`🎨 Cambiando al tema: ${theme.name}`);
        
        this.transitionInProgress = true;
        this.showTransitionEffect();
        
        setTimeout(() => {
            this.applyTheme(theme, options);
            this.updateThemeSelector(themeName);
            this.saveThemePreference(themeName);
            this.hideTransitionEffect();
            this.transitionInProgress = false;
            
            // Notificar cambio completado
            this.dispatchEvent('themeChanged', {
                theme: theme,
                previousTheme: this.currentTheme,
                timestamp: Date.now()
            });
            
            this.currentTheme = theme;
            
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion(`Tema ${theme.name} aplicado`, 'success', 3000);
            }
            
        }, 200);
    }

    // ================================================================
    // NUEVA FUNCIÓN: CAMBIO DE TEMA POR EMPRESA ESPECÍFICA
    // ================================================================
    changeThemeForCompany(themeName, companyId, options = {}) {
        console.log(`🎨 Aplicando tema específico para empresa: ${companyId} → ${themeName}`);
        
        const theme = this.themeMap[themeName];
        if (!theme) {
            console.error(`Tema "${themeName}" no encontrado`);
            return;
        }

        // Guardar tema específico de la empresa
        this.companyThemes.set(companyId, themeName);
        this.currentCompany = companyId;
        
        // Aplicar tema específico de la empresa
        this.applyCompanyTheme(theme, companyId, options);
        
        // Marcar empresa actual en el body
        document.body.setAttribute('data-company', companyId);
        
        // Guardar preferencia específica
        this.saveCompanyThemePreference(companyId, themeName);
        
        console.log(`✅ Tema ${theme.name} aplicado a empresa: ${companyId}`);
    }

    // ================================================================
    // APLICACIÓN DE TEMA ESPECÍFICO POR EMPRESA
    // ================================================================
    applyCompanyTheme(theme, companyId, options = {}) {
        // Generar CSS específico para la empresa
        this.generateCompanyCSS(theme, companyId, options);
        
        // Actualizar variables CSS específicas de la empresa
        this.updateCompanyCSSVariables(theme, companyId);
        
        // Aplicar efectos especiales si están habilitados
        if (GRIZALUM_THEME_CONFIG.enableAnimations) {
            this.applyAnimationEffects(theme);
        }
        
        console.log(`✅ Tema ${theme.name} aplicado a empresa ${companyId}`);
    }

    // ================================================================
    // GENERACIÓN DE CSS ESPECÍFICO POR EMPRESA
    // ================================================================
    generateCompanyCSS(theme, companyId, options = {}) {
        const styleId = `grizalum-theme-company-${companyId}`;
        
        // Eliminar CSS anterior de esta empresa
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = this.buildCompanyThemeCSS(theme, companyId, options);
        document.head.appendChild(style);
        
        console.log(`🎨 CSS específico generado para empresa: ${companyId}`);
    }

    buildCompanyThemeCSS(theme, companyId, options) {
        const { primary, primaryDark, primaryLight, secondary, accent } = theme;
        const companyName = options.companyName || '';
        
        return `
            /* ===== TEMA EMPRESA ESPECÍFICO: ${theme.name.toUpperCase()} - ${companyId.toUpperCase()} ===== */
            
            /* Variables dinámicas específicas de la empresa */
            [data-company="${companyId}"] {
                --theme-primary: ${primary};
                --theme-primary-dark: ${primaryDark};
                --theme-primary-light: ${primaryLight};
                --theme-secondary: ${secondary};
                --theme-accent: ${accent};
                --theme-primary-alpha: ${this.hexToRgba(primary, 0.12)};
                --theme-primary-glow: ${this.hexToRgba(primary, 0.25)};
                --theme-gradient: linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%);
                --theme-gradient-soft: linear-gradient(135deg, ${primaryLight} 20%, ${primary} 80%);
                --theme-gradient-radial: radial-gradient(circle at center, ${primary} 0%, ${primaryDark} 100%);
            }
            
            /* ===== SIDEBAR ESPECÍFICO DE LA EMPRESA ===== */
            [data-company="${companyId}"] .sidebar {
                background: linear-gradient(180deg, 
                    ${this.hexToRgba(primary, 0.95)} 0%, 
                    ${this.hexToRgba(primaryDark, 0.9)} 50%, 
                    ${this.hexToRgba(primary, 0.95)} 100%) !important;
                border-right: 1px solid ${this.hexToRgba(primary, 0.3)} !important;
                box-shadow: 
                    4px 0 30px ${this.hexToRgba(primary, 0.2)},
                    inset -1px 0 0 ${this.hexToRgba('#ffffff', 0.1)} !important;
            }
            
            [data-company="${companyId}"] .sidebar-header {
                background: linear-gradient(135deg, 
                    ${this.hexToRgba('#000000', 0.4)} 0%, 
                    ${this.hexToRgba('#000000', 0.2)} 100%) !important;
                border-bottom: 2px solid ${this.hexToRgba(primary, 0.5)} !important;
            }
            
            [data-company="${companyId}"] .company-brand .brand-text h1 {
                color: #ffffff !important;
                text-shadow: 0 0 15px ${this.hexToRgba(primary, 0.6)} !important;
            }
            
            /* ===== HEADER ESPECÍFICO DE LA EMPRESA ===== */
            [data-company="${companyId}"] .executive-header {
                border-bottom: 3px solid ${primary} !important;
                box-shadow: 
                    0 8px 40px ${this.hexToRgba('#000000', 0.3)},
                    0 2px 0 ${this.hexToRgba(primary, 0.5)} !important;
            }
            
            [data-company="${companyId}"] .page-title {
                background: linear-gradient(135deg, #ffffff 0%, ${primaryLight} 100%) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
            }
            
            [data-company="${companyId}"] .ai-insights {
                background: linear-gradient(90deg, 
                    ${this.hexToRgba(primary, 0.15)} 0%, 
                    transparent 100%) !important;
                color: ${primaryLight} !important;
                border: 1px solid ${this.hexToRgba(primary, 0.3)} !important;
            }
            
            /* ===== TARJETAS MÉTRICAS ESPECÍFICAS ===== */
            [data-company="${companyId}"] .metric-card {
                border-top: 4px solid ${primary} !important;
                border: 1px solid ${this.hexToRgba(primary, 0.2)} !important;
            }
            
            [data-company="${companyId}"] .metric-card::before {
                background: linear-gradient(90deg, 
                    ${primary} 0%, 
                    ${primaryLight} 50%, 
                    ${primary} 100%);
            }
            
            [data-company="${companyId}"] .metric-card:hover {
                box-shadow: 
                    0 20px 60px ${this.hexToRgba('#000000', 0.4)},
                    0 0 30px ${this.hexToRgba(primary, 0.3)} !important;
                border-color: ${this.hexToRgba(primary, 0.6)} !important;
            }
            
            [data-company="${companyId}"] .metric-card:hover .metric-value {
                color: ${primaryLight} !important;
                text-shadow: 0 0 15px ${this.hexToRgba(primary, 0.8)} !important;
            }
            
            /* ===== ICONOS ESPECÍFICOS ===== */
            [data-company="${companyId}"] .metric-icon {
                background: linear-gradient(135deg, 
                    ${primary} 0%, 
                    ${primaryDark} 100%) !important;
                box-shadow: 
                    0 8px 25px ${this.hexToRgba(primary, 0.4)},
                    inset 0 1px 0 ${this.hexToRgba('#ffffff', 0.2)} !important;
            }
            
            [data-company="${companyId}"] .metric-icon:hover {
                box-shadow: 
                    0 12px 35px ${this.hexToRgba(primary, 0.6)},
                    0 0 25px ${this.hexToRgba(primary, 0.4)} !important;
            }
            
            /* ===== NAVEGACIÓN ESPECÍFICA ===== */
            [data-company="${companyId}"] .nav-link.active {
                background: linear-gradient(135deg, 
                    ${this.hexToRgba('#ffffff', 0.2)} 0%, 
                    ${this.hexToRgba('#ffffff', 0.1)} 100%) !important;
                border: 1px solid ${this.hexToRgba('#ffffff', 0.15)} !important;
            }
            
            [data-company="${companyId}"] .nav-link.active::before {
                background: linear-gradient(180deg, ${primary}, ${primaryLight});
                box-shadow: 0 0 10px ${this.hexToRgba(primary, 0.8)};
            }
            
            [data-company="${companyId}"] .nav-link:hover:not(.active) {
                background: ${this.hexToRgba(primary, 0.1)} !important;
                color: ${primaryLight} !important;
                border-left: 3px solid ${primary} !important;
                text-shadow: 0 0 8px ${this.hexToRgba(primary, 0.6)} !important;
            }
            
            /* ===== BOTONES ESPECÍFICOS ===== */
            [data-company="${companyId}"] .period-btn.active {
                background: linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%) !important;
                box-shadow: 
                    0 8px 25px ${this.hexToRgba(primary, 0.4)},
                    0 0 20px ${this.hexToRgba(primary, 0.3)} !important;
            }
            
            [data-company="${companyId}"] .period-btn:hover:not(.active) {
                border-color: ${this.hexToRgba(primary, 0.6)} !important;
                color: ${primaryLight} !important;
                background: ${this.hexToRgba(primary, 0.1)} !important;
            }
            
            [data-company="${companyId}"] .ai-header-button {
                background: linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%) !important;
                box-shadow: 
                    0 8px 25px ${this.hexToRgba(primary, 0.4)},
                    0 0 20px ${this.hexToRgba(primary, 0.3)} !important;
            }
            
            [data-company="${companyId}"] .ai-header-button:hover {
                box-shadow: 
                    0 15px 40px ${this.hexToRgba(primary, 0.5)},
                    0 0 30px ${this.hexToRgba(primary, 0.4)} !important;
            }
            
            /* ===== GRÁFICOS ESPECÍFICOS ===== */
            [data-company="${companyId}"] .chart-card {
                border-top: 4px solid ${primary} !important;
                border: 1px solid ${this.hexToRgba(primary, 0.2)} !important;
            }
            
            [data-company="${companyId}"] .chart-card:hover {
                box-shadow: 
                    0 15px 50px ${this.hexToRgba('#000000', 0.4)},
                    0 0 25px ${this.hexToRgba(primary, 0.2)} !important;
                border-color: ${this.hexToRgba(primary, 0.4)} !important;
            }
            
            [data-company="${companyId}"] .chart-title {
                text-shadow: 0 0 10px ${this.hexToRgba(primary, 0.5)} !important;
            }
            
            [data-company="${companyId}"] .filter-btn.active {
                background: ${primary} !important;
                box-shadow: 0 6px 20px ${this.hexToRgba(primary, 0.4)} !important;
            }
            
            /* ===== NOTIFICACIONES ESPECÍFICAS ===== */
            [data-company="${companyId}"] .grizalum-notification {
                border-left: 4px solid ${primary} !important;
                box-shadow: 
                    0 10px 40px ${this.hexToRgba('#000000', 0.3)},
                    0 0 20px ${this.hexToRgba(primary, 0.2)} !important;
            }
            
            [data-company="${companyId}"] .notification-badge {
                background: linear-gradient(135deg, ${primary}, ${primaryDark}) !important;
                box-shadow: 0 0 15px ${this.hexToRgba(primary, 0.6)} !important;
            }
            
            /* ===== SCROLLBAR ESPECÍFICO ===== */
            [data-company="${companyId}"] ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, ${primary}, ${primaryDark}) !important;
                box-shadow: 0 0 10px ${this.hexToRgba(primary, 0.5)} !important;
            }
            
            [data-company="${companyId}"] ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, ${primaryLight}, ${primary}) !important;
                box-shadow: 0 0 15px ${this.hexToRgba(primary, 0.8)} !important;
            }
            
            /* ===== EFECTOS ESPECIALES POR EMPRESA ===== */
            ${companyName ? `
            [data-company="${companyId}"] .company-brand .brand-text h1::after {
                content: ' • ${companyName}';
                font-size: 0.6em;
                color: ${primaryLight};
                opacity: 0.9;
                font-weight: 400;
            }
            ` : ''}
        `;
    }

    // ================================================================
    // UTILIDADES Y HELPERS
    // ================================================================
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    updateCompanyCSSVariables(theme, companyId) {
        // Solo actualizar variables específicas si la empresa actual coincide
        if (this.currentCompany === companyId) {
            const root = document.documentElement;
            root.style.setProperty('--theme-primary', theme.primary);
            root.style.setProperty('--theme-primary-dark', theme.primaryDark);
            root.style.setProperty('--theme-primary-light', theme.primaryLight);
            root.style.setProperty('--theme-secondary', theme.secondary);
            root.style.setProperty('--theme-accent', theme.accent);
            root.style.setProperty('--theme-primary-alpha', this.hexToRgba(theme.primary, 0.12));
            root.style.setProperty('--theme-primary-glow', this.hexToRgba(theme.primary, 0.25));
        }
    }

    updateCSSVariables(theme) {
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-primary-dark', theme.primaryDark);
        root.style.setProperty('--theme-primary-light', theme.primaryLight);
        root.style.setProperty('--theme-secondary', theme.secondary);
        root.style.setProperty('--theme-accent', theme.accent);
        root.style.setProperty('--theme-primary-alpha', this.hexToRgba(theme.primary, 0.12));
        root.style.setProperty('--theme-primary-glow', this.hexToRgba(theme.primary, 0.25));
    }

    // ================================================================
    // APLICACIÓN DE TEMA COMPLETA (VERSIÓN ORIGINAL)
    // ================================================================
    applyTheme(theme, options = {}) {
        // Aplicar atributo data-theme para CSS existente
        document.documentElement.setAttribute('data-theme', theme.id);
        
        // Generar CSS dinámico avanzado
        this.generateDynamicCSS(theme, options);
        
        // Actualizar variables CSS
        this.updateCSSVariables(theme);
        
        // Aplicar efectos especiales si están habilitados
        if (GRIZALUM_THEME_CONFIG.enableAnimations) {
            this.applyAnimationEffects(theme);
        }
        
        console.log(`✅ Tema ${theme.name} aplicado completamente`);
    }

    // ================================================================
    // GENERACIÓN DE CSS DINÁMICO AVANZADO (VERSIÓN ORIGINAL)
    // ================================================================
    generateDynamicCSS(theme, options = {}) {
        const styleId = 'grizalum-dynamic-theme-global';
        
        // Eliminar CSS anterior
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = this.buildAdvancedThemeCSS(theme, options);
        document.head.appendChild(style);
    }

    buildAdvancedThemeCSS(theme, options) {
        const { primary, primaryDark, primaryLight, secondary, accent } = theme;
        const companyName = options.companyName || '';
        
        return `
            /* ===== TEMA DINÁMICO GLOBAL: ${theme.name.toUpperCase()} ===== */
            
            /* Variables dinámicas del tema */
            :root {
                --theme-primary: ${primary};
                --theme-primary-dark: ${primaryDark};
                --theme-primary-light: ${primaryLight};
                --theme-secondary: ${secondary};
                --theme-accent: ${accent};
                --theme-primary-alpha: ${this.hexToRgba(primary, 0.12)};
                --theme-primary-glow: ${this.hexToRgba(primary, 0.25)};
                --theme-gradient: linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%);
                --theme-gradient-soft: linear-gradient(135deg, ${primaryLight} 20%, ${primary} 80%);
                --theme-gradient-radial: radial-gradient(circle at center, ${primary} 0%, ${primaryDark} 100%);
            }
            
            /* ===== SELECTOR DE TEMAS MEJORADO ===== */
            .theme-selector {
                background: ${this.hexToRgba('#1e293b', 0.9)} !important;
                backdrop-filter: blur(20px) saturate(180%) !important;
                border: 1px solid ${this.hexToRgba(primary, 0.3)} !important;
                box-shadow: 
                    0 15px 40px ${this.hexToRgba('#000000', 0.3)},
                    0 0 20px ${this.hexToRgba(primary, 0.2)} !important;
            }
            
            .theme-selector:hover {
                transform: translateY(-6px) !important;
                box-shadow: 
                    0 20px 60px ${this.hexToRgba('#000000', 0.4)},
                    0 0 30px ${this.hexToRgba(primary, 0.3)} !important;
            }
            
            .theme-option.active {
                border-color: ${primary} !important;
                box-shadow: 
                    0 0 0 3px ${this.hexToRgba(primary, 0.3)},
                    0 8px 25px ${this.hexToRgba(primary, 0.4)} !important;
                transform: scale(1.15) !important;
            }
            
            /* ===== ANIMACIONES ESPECIALES ===== */
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            @keyframes gradientFlow {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            @keyframes pulseGlow {
                0%, 100% { 
                    box-shadow: 0 0 20px ${this.hexToRgba(primary, 0.3)};
                }
                50% { 
                    box-shadow: 0 0 40px ${this.hexToRgba(primary, 0.6)};
                }
            }
        `;
    }

    // ================================================================
    // EFECTOS DE TRANSICIÓN
    // ================================================================
    showTransitionEffect() {
        document.body.classList.add('theme-transitioning');
        
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion('Aplicando tema...', 'info', 1000);
        }
    }

    hideTransitionEffect() {
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    applyAnimationEffects(theme) {
        // Agregar clases de animación a elementos clave
        const elements = document.querySelectorAll('.metric-card, .chart-card');
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 100}ms`;
            el.classList.add('fade-in-up');
        });
    }

    // ================================================================
    // GESTIÓN DEL SELECTOR DE TEMAS
    // ================================================================
    setupThemeSelector() {
        const selector = document.querySelector('.theme-selector');
        if (!selector) {
            console.warn('Selector de temas no encontrado');
            return;
        }

        // Asegurar que los botones existan y tengan los event listeners correctos
        const themeButtons = selector.querySelectorAll('.theme-option');
        themeButtons.forEach(button => {
            const themeName = button.getAttribute('data-theme');
            if (themeName && this.themeMap[themeName]) {
                button.addEventListener('click', () => this.changeTheme(themeName));
                console.log(`Botón de tema ${themeName} configurado`);
            }
        });
    }

    updateThemeSelector(activeTheme) {
        const buttons = document.querySelectorAll('.theme-option');
        buttons.forEach(button => {
            const themeName = button.getAttribute('data-theme');
            button.classList.toggle('active', themeName === activeTheme);
        });
    }

    // ================================================================
    // SISTEMA DE EVENTOS
    // ================================================================
    setupEventListeners() {
        // Escuchar cambios de empresa
        document.addEventListener('empresaSeleccionada', (event) => {
            const { empresaId, empresa } = event.detail;
            this.handleCompanyChange(empresaId, empresa);
        });

        // Escuchar comandos de tema personalizados
        document.addEventListener('grizalumApplyTheme', (event) => {
            const { themeName, options } = event.detail;
            this.changeTheme(themeName, options);
        });

        console.log('Event listeners configurados');
    }

    handleCompanyChange(empresaId, empresa) {
        console.log(`🏢 Cambio de empresa detectado: ${empresaId}`);
        
        if (empresa && empresa.tema) {
            // Mapear tema del gestor a tema del motor
            const temaMap = {
                'rojo': 'red',
                'azul': 'blue',
                'verde': 'green',
                'morado': 'purple',
                'dorado': 'gold'
            };
            
            const temaCss = temaMap[empresa.tema] || 'gold';
            
            // Aplicar tema específico de la empresa
            this.changeThemeForCompany(temaCss, empresaId, {
                companyName: empresa.nombre
            });
        }
    }

    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`grizalum${eventName}`, {
            detail: detail,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // ================================================================
    // TEMAS DE EMPRESA
    // ================================================================
    applyCompanyTheme(companyId, company) {
        if (!company || !company.theme) {
            console.warn(`No se encontró tema para empresa: ${companyId}`);
            return;
        }

        this.currentCompany = company;
        
        if (company.theme.id && this.themeMap[company.theme.id]) {
            // Usar tema predefinido
            this.changeTheme(company.theme.id, { companyName: company.name });
        } else if (company.theme.primary) {
            // Crear tema dinámico
            this.applyCustomTheme(company.theme, company);
        } else {
            console.warn('Tema de empresa mal configurado');
        }
    }

    applyCustomTheme(colors, company) {
        const customTheme = {
            id: `custom-${company.id}`,
            name: `Tema de ${company.name}`,
            primary: colors.primary,
            primaryDark: colors.primaryDark || this.darkenColor(colors.primary, 20),
            primaryLight: colors.primaryLight || this.lightenColor(colors.primary, 20),
            secondary: colors.secondary || this.lightenColor(colors.primary, 40),
            accent: colors.accent || colors.primary
        };

        this.customThemes.set(customTheme.id, customTheme);
        this.applyTheme(customTheme, { companyName: company.name });
        this.currentTheme = customTheme;
    }

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 0 ? 0 : R) * 0x10000 + (G < 0 ? 0 : G) * 0x100 + (B < 0 ? 0 : B)).toString(16).slice(1);
    }

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R > 255 ? 255 : R) * 0x10000 + (G > 255 ? 255 : G) * 0x100 + (B > 255 ? 255 : B)).toString(16).slice(1);
    }

    // ================================================================
    // PERSISTENCIA
    // ================================================================
    saveThemePreference(themeName) {
        if (GRIZALUM_THEME_CONFIG.autoSave) {
            localStorage.setItem('grizalum_current_theme', themeName);
            localStorage.setItem('grizalum_theme_timestamp', Date.now().toString());
        }
    }

    saveCompanyThemePreference(companyId, themeName) {
        if (GRIZALUM_THEME_CONFIG.autoSave) {
            localStorage.setItem(`grizalum_company_theme_${companyId}`, themeName);
            localStorage.setItem(`grizalum_company_theme_timestamp_${companyId}`, Date.now().toString());
        }
    }

    loadSavedPreferences() {
        const savedTheme = localStorage.getItem('grizalum_current_theme');
        if (savedTheme && this.themeMap[savedTheme]) {
            console.log(`Cargando tema guardado: ${savedTheme}`);
            return savedTheme;
        }
        return GRIZALUM_THEME_CONFIG.defaultTheme;
    }

    loadCompanyThemePreference(companyId) {
        const savedTheme = localStorage.getItem(`grizalum_company_theme_${companyId}`);
        if (savedTheme && this.themeMap[savedTheme]) {
            console.log(`Cargando tema guardado para empresa ${companyId}: ${savedTheme}`);
            return savedTheme;
        }
        return null;
    }

    applyDefaultTheme() {
        const themeToApply = this.loadSavedPreferences();
        this.changeTheme(themeToApply);
    }

    // ================================================================
    // API PÚBLICA
    // ================================================================
    getAvailableThemes() {
        return Object.values(this.themeMap).map(theme => ({
            id: theme.id,
            name: theme.name,
            description: theme.description,
            primary: theme.primary
        }));
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getCompanyTheme(companyId) {
        return this.companyThemes.get(companyId);
    }

    createCustomTheme(config) {
        const themeId = `custom-${Date.now()}`;
        const theme = {
            id: themeId,
            name: config.name || 'Tema Personalizado',
            primary: config.primary,
            primaryDark: config.primaryDark || this.darkenColor(config.primary, 20),
            primaryLight: config.primaryLight || this.lightenColor(config.primary, 20),
            secondary: config.secondary || this.lightenColor(config.primary, 40),
            accent: config.accent || config.primary,
            description: config.description || 'Tema personalizado'
        };

        this.customThemes.set(themeId, theme);
        return themeId;
    }

    // ================================================================
    // FUNCIÓN PARA LIMPIAR TEMAS DE EMPRESAS
    // ================================================================
    cleanupCompanyTheme(companyId) {
        const styleElement = document.getElementById(`grizalum-theme-company-${companyId}`);
        if (styleElement) {
            styleElement.remove();
            console.log(`🧹 CSS de empresa ${companyId} eliminado`);
        }
    }

    cleanupAllCompanyThemes() {
        const companyStyles = document.querySelectorAll('[id^="grizalum-theme-company-"]');
        companyStyles.forEach(style => style.remove());
        console.log('🧹 Todos los CSS de empresas eliminados');
    }
}

// ================================================================
// INICIALIZACIÓN GLOBAL
// ================================================================
let grizalumThemeEngine = null;

// Función global para cambio de tema (compatible con HTML existente)
function changeTheme(themeName) {
    if (grizalumThemeEngine) {
        grizalumThemeEngine.changeTheme(themeName);
    } else {
        console.warn('Motor de temas no inicializado');
    }
}

// NUEVA: Función para cambiar tema específico de empresa
function changeThemeForCompany(themeName, companyId) {
    if (grizalumThemeEngine) {
        grizalumThemeEngine.changeThemeForCompany(themeName, companyId);
    } else {
        console.warn('Motor de temas no inicializado');
    }
}

// Funciones de compatibilidad
function aplicarTemaEmpresa(empresaId) {
    if (window.gestorEmpresas && grizalumThemeEngine) {
        const empresa = window.gestorEmpresas.estado.empresas[empresaId];
        if (empresa) {
            // Mapear tema del gestor al motor
            const temaMap = {
                'rojo': 'red',
                'azul': 'blue', 
                'verde': 'green',
                'morado': 'purple',
                'dorado': 'gold'
            };
            
            const temaCss = temaMap[empresa.tema] || 'gold';
            grizalumThemeEngine.changeThemeForCompany(temaCss, empresaId, {
                companyName: empresa.nombre
            });
        }
    }
}

function aplicarTema(temaId) {
    if (grizalumThemeEngine) {
        grizalumThemeEngine.changeTheme(temaId);
    }
}

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando Motor de Temas GRIZALUM v2.1...');
    
    grizalumThemeEngine = new GrizalumThemeEngine();
    grizalumThemeEngine.initialize();
    
    // Exponer API global
    window.GRIZALUM_THEMES = {
        version: GRIZALUM_THEME_CONFIG.version,
        engine: grizalumThemeEngine,
        changeTheme: changeTheme,
        changeThemeForCompany: changeThemeForCompany,
        aplicarTemaEmpresa: aplicarTemaEmpresa,
        getAvailableThemes: () => grizalumThemeEngine.getAvailableThemes(),
        getCurrentTheme: () => grizalumThemeEngine.getCurrentTheme(),
        createCustomTheme: (config) => grizalumThemeEngine.createCustomTheme(config)
    };
    
    // Funciones globales para compatibilidad
    window.changeTheme = changeTheme;
    window.changeThemeForCompany = changeThemeForCompany;
    window.aplicarTemaEmpresa = aplicarTemaEmpresa;
    window.aplicarTema = aplicarTema;
});

// ================================================================
// LOG DE INICIO
// ================================================================
console.log(`
🎨 =====================================================
   MOTOR DE TEMAS GRIZALUM V2.1 - CORREGIDO
🎨 =====================================================

✨ SOLUCIÓN IMPLEMENTADA:
   🏢 Colores independientes por empresa
   🎯 CSS específico con [data-company="id"]
   💾 Persistencia por empresa individual
   🔄 Transiciones suaves entre empresas
   🧹 Limpieza automática de temas

🎯 FUNCIONES NUEVAS:
   • changeThemeForCompany(theme, companyId)
   • aplicarTemaEmpresa(empresaId)
   • cleanupCompanyTheme(companyId)
   • loadCompanyThemePreference(companyId)

🔧 MAPEO DE TEMAS:
   • rojo → red
   • azul → blue
   • verde → green
   • morado → purple
   • dorado → gold

⚡ MEJORAS V2.1:
   • Cada empresa mantiene colores únicos
   • Sin interferencia entre empresas
   • Sistema de eventos mejorado
   • Mejor rendimiento y limpieza

🎨 =====================================================
`);
