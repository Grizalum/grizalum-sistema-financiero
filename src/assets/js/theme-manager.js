/**
 * ================================================================
 * GRIZALUM THEME MANAGER - ULTRA PROFESSIONAL EDITION
 * Sistema de temas dinámicos inspirado en Goldman Sachs + Tesla
 * Paletas de nivel Fortune 500 para sistemas financieros
 * ================================================================
 */

class GrizalumThemeManager {
    constructor() {
        this.currentTheme = 'goldman-platinum';
        this.themes = this.initializeUltraPremiumThemes();
        this.companyThemes = this.loadCompanyThemes();
        this.isInitialized = false;
        this.init();
    }

    init() {
        try {
            this.createDynamicThemeStyles();
            this.loadSavedTheme();
            this.isInitialized = true;
            console.log('🏆 GRIZALUM Theme Manager - Ultra Professional Edition Loaded');
            console.log('💎 6 Premium Themes Available - Fortune 500 Level');
        } catch (error) {
            console.error('❌ Theme Manager Error:', error);
        }
    }

    // ======= PALETAS ULTRA PROFESIONALES =======
    initializeUltraPremiumThemes() {
        return {
            // 🏦 GOLDMAN PLATINUM - Inspirado en Goldman Sachs
            'goldman-platinum': {
                name: 'Goldman Platinum',
                description: 'Elegancia bancaria de clase mundial',
                category: 'financial-elite',
                colors: {
                    // Colores principales
                    primary: '#d4af37',                    // Oro Goldman Sachs
                    secondary: '#b8941f',                  // Oro oscuro
                    accent: '#f5d76e',                     // Oro luminoso
                    
                    // Fondos premium
                    background: '#0a0a0b',                 // Negro carbón absoluto
                    surface: '#1a1b23',                    // Carbón elegante
                    elevated: '#2d2e3f',                   // Superficie elevada
                    
                    // Texto jerarquizado
                    textPrimary: '#ffffff',                // Blanco puro
                    textSecondary: '#d4af37',              // Dorado elegante
                    textMuted: '#a0a0a0',                  // Gris premium
                    
                    // Estados y alertas
                    success: '#10b981',                    // Verde esmeralda
                    warning: '#f59e0b',                    // Ámbar ejecutivo
                    danger: '#ef4444',                     // Rojo corporativo
                    info: '#3b82f6',                       // Azul información
                    
                    // Gradientes sofisticados
                    gradientPrimary: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 148, 31, 0.05) 100%)',
                    
                    // Efectos premium
                    shadowGlow: '0 0 40px rgba(212, 175, 55, 0.4)',
                    shadowElevated: '0 20px 40px rgba(0, 0, 0, 0.6)',
                    shadowSoft: '0 8px 25px rgba(0, 0, 0, 0.3)',
                    glassEffect: 'rgba(212, 175, 55, 0.08)',
                    borderGlow: '1px solid rgba(212, 175, 55, 0.3)'
                }
            },

            // 🚀 TESLA FUTURISTIC - Inspirado en el diseño de Tesla
            'tesla-futuristic': {
                name: 'Tesla Futuristic',
                description: 'El futuro según Elon Musk',
                category: 'tech-innovation',
                colors: {
                    primary: '#ff0040',                    // Rojo Tesla icónico
                    secondary: '#1a1a1a',                  // Negro Tesla profundo
                    accent: '#00d4ff',                     // Cian futurista
                    
                    background: '#000000',                 // Negro absoluto Tesla
                    surface: '#0f0f0f',                    // Surface mínimo
                    elevated: '#1a1a1a',                   // Elevado sutil
                    
                    textPrimary: '#ffffff',
                    textSecondary: '#cccccc',
                    textMuted: '#888888',
                    
                    success: '#00ff87',                    // Verde neón
                    warning: '#ffaa00',                    // Ámbar vibrante
                    danger: '#ff1744',                     // Rojo alerta
                    info: '#00d4ff',                       // Cian info
                    
                    gradientPrimary: 'linear-gradient(135deg, #ff0040 0%, #00d4ff 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #00ff87 0%, #00cc6a 100%)',
                    gradientWarning: 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(255, 0, 64, 0.12) 0%, rgba(0, 212, 255, 0.04) 100%)',
                    
                    shadowGlow: '0 0 50px rgba(255, 0, 64, 0.5)',
                    shadowElevated: '0 25px 50px rgba(0, 0, 0, 0.8)',
                    shadowSoft: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    glassEffect: 'rgba(255, 0, 64, 0.06)',
                    borderGlow: '1px solid rgba(255, 0, 64, 0.4)'
                }
            },

            // 🍎 CUPERTINO ELITE - Inspirado en Apple
            'cupertino-elite': {
                name: 'Cupertino Elite',
                description: 'Diseño premium desde Cupertino',
                category: 'design-excellence',
                colors: {
                    primary: '#007aff',                    // Azul Apple
                    secondary: '#5856d6',                  // Púrpura iOS
                    accent: '#30d158',                     // Verde Apple
                    
                    background: '#000000',                 // Negro Apple
                    surface: '#1c1c1e',                    // Gris sistema oscuro
                    elevated: '#2c2c2e',                   // Elevado iOS
                    
                    textPrimary: '#ffffff',
                    textSecondary: '#ebebf5',              // Texto secundario iOS
                    textMuted: '#ebebf580',                // Texto terciario
                    
                    success: '#30d158',                    // Verde sistema
                    warning: '#ff9f0a',                    // Naranja iOS
                    danger: '#ff453a',                     // Rojo sistema
                    info: '#64d2ff',                       // Azul claro
                    
                    gradientPrimary: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #30d158 0%, #248a3d 100%)',
                    gradientWarning: 'linear-gradient(135deg, #ff9f0a 0%, #ff8c00 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ff453a 0%, #e63946 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.05) 100%)',
                    
                    shadowGlow: '0 0 30px rgba(0, 122, 255, 0.4)',
                    shadowElevated: '0 15px 35px rgba(0, 0, 0, 0.5)',
                    shadowSoft: '0 6px 20px rgba(0, 0, 0, 0.25)',
                    glassEffect: 'rgba(0, 122, 255, 0.08)',
                    borderGlow: '1px solid rgba(0, 122, 255, 0.3)'
                }
            },

            // 🔴 NETFLIX PREMIUM - Inspirado en Netflix
            'netflix-premium': {
                name: 'Netflix Premium',
                description: 'Entretenimiento de clase mundial',
                category: 'media-excellence',
                colors: {
                    primary: '#e50914',                    // Rojo Netflix icónico
                    secondary: '#221f1f',                  // Gris oscuro Netflix
                    accent: '#ffffff',                     // Blanco contraste
                    
                    background: '#141414',                 // Negro Netflix
                    surface: '#181818',                    // Surface Netflix
                    elevated: '#2f2f2f',                   // Elevado Netflix
                    
                    textPrimary: '#ffffff',
                    textSecondary: '#b3b3b3',              // Gris Netflix
                    textMuted: '#737373',                  // Gris apagado
                    
                    success: '#46d369',                    // Verde Netflix
                    warning: '#f5c518',                    // Amarillo dorado
                    danger: '#dc1a28',                     // Rojo intenso
                    info: '#54b3d6',                       // Azul información
                    
                    gradientPrimary: 'linear-gradient(135deg, #e50914 0%, #b81d24 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #46d369 0%, #1db954 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f5c518 0%, #e6ac00 100%)',
                    gradientDanger: 'linear-gradient(135deg, #dc1a28 0%, #b81d24 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(184, 29, 36, 0.05) 100%)',
                    
                    shadowGlow: '0 0 35px rgba(229, 9, 20, 0.5)',
                    shadowElevated: '0 18px 35px rgba(0, 0, 0, 0.6)',
                    shadowSoft: '0 8px 25px rgba(0, 0, 0, 0.3)',
                    glassEffect: 'rgba(229, 9, 20, 0.08)',
                    borderGlow: '1px solid rgba(229, 9, 20, 0.4)'
                }
            },

            // 💎 MIDNIGHT CORPORATE - Tema nocturno premium
            'midnight-corporate': {
                name: 'Midnight Corporate',
                description: 'Elegancia nocturna corporativa',
                category: 'corporate-premium',
                colors: {
                    primary: '#00d9ff',                    // Cian eléctrico
                    secondary: '#8b5cf6',                  // Púrpura neón
                    accent: '#00ff87',                     // Verde neón
                    
                    background: '#0a0a0b',                 // Negro carbón
                    surface: '#1a1b23',                    // Obsidiana
                    elevated: '#2d2e3f',                   // Carbón elevado
                    
                    textPrimary: '#ffffff',
                    textSecondary: '#a3a3a3',
                    textMuted: '#6b6b6b',
                    
                    success: '#00ff87',                    // Verde éxito
                    warning: '#ffb800',                    // Ámbar premium
                    danger: '#ff4757',                     // Rojo elegante
                    info: '#00d9ff',                       // Cian info
                    
                    gradientPrimary: 'linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #00ff87 0%, #00b894 100%)',
                    gradientWarning: 'linear-gradient(135deg, #ffb800 0%, #ff6b35 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ff4757 0%, #e84118 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(0, 217, 255, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
                    
                    shadowGlow: '0 0 40px rgba(0, 217, 255, 0.5)',
                    shadowElevated: '0 20px 40px rgba(0, 0, 0, 0.7)',
                    shadowSoft: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    glassEffect: 'rgba(0, 217, 255, 0.08)',
                    borderGlow: '1px solid rgba(0, 217, 255, 0.3)'
                }
            },

            // 🖤 EXECUTIVE DARK - Tema ejecutivo minimalista
            'executive-dark': {
                name: 'Executive Dark',
                description: 'Minimalismo ejecutivo sofisticado',
                category: 'executive-minimal',
                colors: {
                    primary: '#6b7280',                    // Gris ejecutivo
                    secondary: '#4b5563',                  // Gris profundo
                    accent: '#d1d5db',                     // Gris claro
                    
                    background: '#111827',                 // Negro suave
                    surface: '#1f2937',                    // Gris oscuro
                    elevated: '#374151',                   // Gris elevado
                    
                    textPrimary: '#f9fafb',
                    textSecondary: '#e5e7eb',
                    textMuted: '#d1d5db',
                    
                    success: '#10b981',                    // Verde corporativo
                    warning: '#f59e0b',                    // Ámbar ejecutivo
                    danger: '#ef4444',                     // Rojo corporativo
                    info: '#3b82f6',                       // Azul corporativo
                    
                    gradientPrimary: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(75, 85, 99, 0.04) 100%)',
                    
                    shadowGlow: '0 0 25px rgba(107, 114, 128, 0.3)',
                    shadowElevated: '0 15px 30px rgba(0, 0, 0, 0.4)',
                    shadowSoft: '0 6px 20px rgba(0, 0, 0, 0.2)',
                    glassEffect: 'rgba(107, 114, 128, 0.06)',
                    borderGlow: '1px solid rgba(107, 114, 128, 0.2)'
                }
            }
        };
    }

    // ======= ASIGNACIÓN DE TEMAS POR EMPRESA =======
    loadCompanyThemes() {
        const saved = localStorage.getItem('grizalum_company_themes');
        if (saved) {
            return JSON.parse(saved);
        }

        // Asignación estratégica de temas por tipo de empresa
        const defaultThemes = {
            'fundicion-laguna': 'tesla-futuristic',      // Tecnología + Futurista
            'fundicion-joel': 'netflix-premium',         // Entretenimiento Premium
            'avicola-san-juan': 'cupertino-elite',       // Diseño Elegante
            'import-lm': 'goldman-platinum',             // Financiero Élite
            'bodega-central': 'executive-dark'           // Ejecutivo Minimalista
        };

        this.saveCompanyThemes(defaultThemes);
        return defaultThemes;
    }

    saveCompanyThemes(themes) {
        localStorage.setItem('grizalum_company_themes', JSON.stringify(themes));
    }

    // ======= APLICACIÓN DE TEMAS =======
    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error(`❌ Tema '${themeName}' no encontrado`);
            return false;
        }

        const theme = this.themes[themeName];
        const root = document.documentElement;

        try {
            // Aplicar todas las variables CSS del tema
            Object.entries(theme.colors).forEach(([key, value]) => {
                const cssVar = this.camelToKebab(key);
                root.style.setProperty(`--theme-${cssVar}`, value);
            });

            this.currentTheme = themeName;
            localStorage.setItem('grizalum_current_theme', themeName);
            
            console.log(`🎨 Tema aplicado: ${theme.name} (${theme.category})`);
            
            // Disparar evento para otros componentes
            this.dispatchThemeChangeEvent(themeName, theme);
            return true;
            
        } catch (error) {
            console.error('❌ Error aplicando tema:', error);
            return false;
        }
    }

    applyCompanyTheme(companyId) {
        const themeName = this.companyThemes[companyId];
        if (themeName && this.themes[themeName]) {
            this.applyTheme(themeName);
            console.log(`🏢 Empresa: ${companyId} → Tema: ${this.themes[themeName].name}`);
            return true;
        } else {
            console.warn(`⚠️ No hay tema asignado para: ${companyId}, usando tema por defecto`);
            this.applyTheme('goldman-platinum');
            return false;
        }
    }

    // ======= ESTILOS DINÁMICOS =======
    createDynamicThemeStyles() {
        const styleId = 'grizalum-ultra-theme-system';
        let existingStyle = document.getElementById(styleId);
        
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* ========================================= */
            /* GRIZALUM ULTRA PROFESSIONAL THEME SYSTEM */
            /* ========================================= */
            
            :root {
                /* Variables dinámicas que se actualizan con cada tema */
                --theme-primary: #d4af37;
                --theme-secondary: #b8941f;
                --theme-accent: #f5d76e;
                --theme-background: #0a0a0b;
                --theme-surface: #1a1b23;
                --theme-elevated: #2d2e3f;
                --theme-text-primary: #ffffff;
                --theme-text-secondary: #d4af37;
                --theme-text-muted: #a0a0a0;
                --theme-success: #10b981;
                --theme-warning: #f59e0b;
                --theme-danger: #ef4444;
                --theme-info: #3b82f6;
                --theme-gradient-primary: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
                --theme-gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
                --theme-gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                --theme-gradient-danger: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                --theme-gradient-glass: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 148, 31, 0.05) 100%);
                --theme-shadow-glow: 0 0 40px rgba(212, 175, 55, 0.4);
                --theme-shadow-elevated: 0 20px 40px rgba(0, 0, 0, 0.6);
                --theme-shadow-soft: 0 8px 25px rgba(0, 0, 0, 0.3);
                --theme-glass-effect: rgba(212, 175, 55, 0.08);
                --theme-border-glow: 1px solid rgba(212, 175, 55, 0.3);
            }

            /* === APLICACIÓN GLOBAL DEL TEMA === */
            body {
                background: var(--theme-background) !important;
                color: var(--theme-text-primary) !important;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            /* === SIDEBAR PREMIUM === */
            .sidebar {
                background: linear-gradient(180deg, var(--theme-surface) 0%, var(--theme-background) 100%) !important;
                border-right: var(--theme-border-glow) !important;
                backdrop-filter: blur(20px) !important;
            }

            .sidebar-header {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
            }

            /* === NAVEGACIÓN PREMIUM === */
            .nav-link.active {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
                border-left: 4px solid var(--theme-primary) !important;
            }

            .nav-link:hover {
                background: var(--theme-glass-effect) !important;
                color: var(--theme-primary) !important;
                border-left: 2px solid var(--theme-primary) !important;
            }

            /* === HEADER EJECUTIVO === */
            .executive-header {
                background: var(--theme-glass-effect) !important;
                backdrop-filter: blur(30px) !important;
                border-bottom: var(--theme-border-glow) !important;
                box-shadow: var(--theme-shadow-soft) !important;
            }

            .page-header h1 {
                background: var(--theme-gradient-primary) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
            }

            /* === BOTÓN IA PREMIUM === */
            .ai-header-button {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
                border: var(--theme-border-glow) !important;
            }

            .ai-header-button:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 15px 35px var(--theme-primary)40 !important;
            }

            /* === TARJETAS MÉTRICAS PREMIUM === */
            .metric-card {
                background: var(--theme-glass-effect) !important;
                backdrop-filter: blur(25px) !important;
                border: var(--theme-border-glow) !important;
                box-shadow: var(--theme-shadow-soft) !important;
            }

            .metric-card:hover {
                box-shadow: var(--theme-shadow-elevated) !important;
                border-color: var(--theme-primary) !important;
            }

            .metric-card::before {
                background: var(--theme-gradient-primary) !important;
                height: 5px !important;
            }

            .metric-value {
                background: var(--theme-gradient-primary) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
            }

            /* === INSIGHTS IA === */
            .ai-insights {
                background: var(--theme-gradient-glass) !important;
                border: var(--theme-border-glow) !important;
                color: var(--theme-primary) !important;
                backdrop-filter: blur(15px) !important;
            }

            /* === SELECTOR DE EMPRESAS === */
            .company-dropdown {
                background: var(--theme-surface) !important;
                border: var(--theme-border-glow) !important;
                box-shadow: var(--theme-shadow-elevated) !important;
                backdrop-filter: blur(30px) !important;
            }

            .company-item:hover {
                background: var(--theme-glass-effect) !important;
                border-left: 3px solid var(--theme-primary) !important;
            }

            .company-item.active {
                background: var(--theme-gradient-glass) !important;
                border: var(--theme-border-glow) !important;
                box-shadow: var(--theme-shadow-glow) !important;
            }

            /* === GRÁFICOS PREMIUM === */
            .chart-card {
                background: var(--theme-glass-effect) !important;
                border: var(--theme-border-glow) !important;
                backdrop-filter: blur(20px) !important;
                box-shadow: var(--theme-shadow-soft) !important;
            }

            /* === BOTONES === */
            .btn-primary {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
            }

            .btn-success {
                background: var(--theme-gradient-success) !important;
            }

            .btn-neutral {
                background: var(--theme-glass-effect) !important;
                border: var(--theme-border-glow) !important;
                color: var(--theme-text-primary) !important;
            }

            /* === EFECTOS PREMIUM === */
            .period-btn.active {
                background: var(--theme-gradient-primary) !important;
                color: white !important;
                box-shadow: var(--theme-shadow-glow) !important;
            }

            .notification-center:hover {
                border-color: var(--theme-primary) !important;
                color: var(--theme-primary) !important;
                box-shadow: var(--theme-shadow-soft) !important;
            }

            /* === TRANSICIONES SUAVES === */
            * {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            /* === SCROLLBAR PREMIUM === */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: var(--theme-surface);
            }

            ::-webkit-scrollbar-thumb {
                background: var(--theme-primary);
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: var(--theme-secondary);
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 Sistema de estilos dinámicos creado');
    }

    // ======= UTILIDADES =======
    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    loadSavedTheme() {
        const saved = localStorage.getItem('grizalum_current_theme');
        if (saved && this.themes[saved]) {
            this.applyTheme(saved);
        } else {
            this.applyTheme('goldman-platinum');
        }
    }

    dispatchThemeChangeEvent(themeName, theme) {
        const event = new CustomEvent('grizalumThemeChanged', {
            detail: { 
                themeName, 
                theme, 
                timestamp: Date.now(),
                category: theme.category
            }
        });
        document.dispatchEvent(event);
    }

    // ======= API PÚBLICA =======
    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            key,
            name: this.themes[key].name,
            description: this.themes[key].description,
            category: this.themes[key].category
        }));
    }

    getCurrentTheme() {
        return {
            key: this.currentTheme,
            theme: this.themes[this.currentTheme]
        };
    }

    getThemeColors(themeName) {
        return this.themes[themeName]?.colors || null;
    }

    setCompanyTheme(companyId, themeName) {
        if (!this.themes[themeName]) {
            console.error(`❌ Tema '${themeName}' no existe`);
            return false;
        }

        this.companyThemes[companyId] = themeName;
        this.saveCompanyThemes(this.companyThemes);
        
        console.log(`✅ Tema asignado: ${companyId} → ${themeName}`);
        return true;
    }

    previewTheme(themeName, duration = 3000) {
        if (!this.themes[themeName]) return false;
        
        const currentTheme = this.currentTheme;
        this.applyTheme(themeName);
        
        console.log(`👁️ Previsualizando tema: ${this.themes[themeName].name}`);
        
        setTimeout(() => {
            this.applyTheme(currentTheme);
            console.log(`↩️ Revirtiendo a tema: ${this.themes[currentTheme].name}`);
        }, duration);
        
        return true;
    }

    // ======= ANÁLISIS DE TEMAS =======
    getThemeAnalytics() {
        return {
            totalThemes: Object.keys(this.themes).length,
            currentTheme: this.currentTheme,
            companyThemes: this.companyThemes,
            categories: [...new Set(Object.values(this.themes).map(t => t.category))],
            isInitialized: this.isInitialized
        };
    }

    // ======= EXPORTAR/IMPORTAR CONFIGURACIÓN =======
    exportThemeConfiguration() {
        return {
            version: '1.0.0',
            currentTheme: this.currentTheme,
            companyThemes: this.companyThemes,
            timestamp: Date.now(),
            system: 'GRIZALUM-Ultra-Professional'
        };
    }

    importThemeConfiguration(config) {
        try {
            if (config.version && config.companyThemes) {
                this.companyThemes = config.companyThemes;
                this.saveCompanyThemes(config.companyThemes);
                
                if (config.currentTheme && this.themes[config.currentTheme]) {
                    this.applyTheme(config.currentTheme);
                }
                
                console.log('✅ Configuración de temas importada correctamente');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error importando configuración:', error);
            return false;
        }
    }
}

// ======= INICIALIZACIÓN GLOBAL =======
let grizalumThemeManager = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando GRIZALUM Theme Manager Ultra Professional...');
    
    try {
        // Crear instancia global
        grizalumThemeManager = new GrizalumThemeManager();
        window.themeManager = grizalumThemeManager;
        
        // Listener para eventos de tema
        document.addEventListener('grizalumThemeChanged', function(event) {
            console.log('🎨 Tema cambiado:', event.detail);
        });
        
        console.log('✅ GRIZALUM Theme Manager cargado exitosamente');
        console.log('💎 Sistema Ultra Profesional - 6 Temas Premium Disponibles');
        
    } catch (error) {
        console.error('❌ Error inicializando Theme Manager:', error);
    }
});

// ======= INTEGRACIÓN CON SELECTOR DE EMPRESAS =======
function applyCompanyThemeIntegration(companyId) {
    if (window.themeManager && window.themeManager.isInitialized) {
        const success = window.themeManager.applyCompanyTheme(companyId);
        if (success) {
            console.log(`🏢 Tema de empresa aplicado: ${companyId}`);
        }
        return success;
    } else {
        console.warn('⚠️ Theme Manager no está inicializado');
        return false;
    }
}

// ======= FUNCIONES DE UTILIDAD GLOBAL =======
window.GrizalumThemeUtils = {
    // Obtener tema actual
    getCurrentTheme: () => window.themeManager?.getCurrentTheme(),
    
    // Obtener todos los temas disponibles
    getAvailableThemes: () => window.themeManager?.getAvailableThemes(),
    
    // Previsualizar tema
    previewTheme: (themeName, duration) => window.themeManager?.previewTheme(themeName, duration),
    
    // Obtener analíticas
    getAnalytics: () => window.themeManager?.getThemeAnalytics(),
    
    // Exportar configuración
    export: () => window.themeManager?.exportThemeConfiguration(),
    
    // Importar configuración
    import: (config) => window.themeManager?.importThemeConfiguration(config)
};

// ======= EXPORTAR CLASE PARA USO AVANZADO =======
window.GrizalumThemeManager = GrizalumThemeManager;

// ======= INFORMACIÓN DEL SISTEMA =======
console.log(`
🏆 ===================================================
   GRIZALUM THEME MANAGER - ULTRA PROFESSIONAL
🏆 ===================================================

📊 CARACTERÍSTICAS:
   • 6 Temas Ultra Premium (Fortune 500 Level)
   • Paletas Goldman Sachs + Tesla + Apple + Netflix
   • Sistema dinámico de variables CSS
   • Cambio automático por empresa
   • Efectos premium (glassmorphism, gradientes)
   • Persistencia en localStorage
   • API completa para personalización avanzada
   • Transiciones suaves y profesionales

🎨 TEMAS DISPONIBLES:
   1. Goldman Platinum (Financiero Élite)
   2. Tesla Futuristic (Tecnología Innovación)
   3. Cupertino Elite (Diseño Excelencia)
   4. Netflix Premium (Media Excelencia)
   5. Midnight Corporate (Corporativo Premium)
   6. Executive Dark (Ejecutivo Minimalista)

🔧 USO:
   - Cambio automático: Por empresa
   - Preview: themeManager.previewTheme('theme-name')
   - Analytics: themeManager.getThemeAnalytics()
   - Export/Import: Configuración completa

💫 ¡Tu dashboard nunca se verá igual!
🏆 ===================================================
`);
