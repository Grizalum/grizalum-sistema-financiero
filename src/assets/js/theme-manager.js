/**
 * ================================================
 * GRIZALUM THEME MANAGER - SISTEMA DE TEMAS DINÁMICOS
 * Cambio de paletas por empresa + 20+ temas premium
 * ================================================
 */

class GrizalumThemeManager {
    constructor() {
        this.currentTheme = 'midnight-corporate';
        this.themes = this.initializeThemes();
        this.companyThemes = this.loadCompanyThemes();
        this.init();
    }

    init() {
        this.createThemeStyles();
        this.loadSavedTheme();
        console.log('🎨 Theme Manager inicializado - 20+ temas disponibles');
    }

    // ======= DEFINICIÓN DE TEMAS PREMIUM =======
    initializeThemes() {
    return {
        // 🏦 BLACKROCK CORPORATE - Ultra Premium Financiero
        'blackrock-corporate': {
            name: 'BlackRock Corporate',
            description: 'Diseño financiero de élite mundial',
            colors: {
                primary: '#1a1a1a',           // Negro corporativo profundo
                secondary: '#2d2d30',         // Gris carbón elegante
                accent: '#00ff9f',            // Verde neón corporativo
                warning: '#ff6b35',           // Naranja premium
                danger: '#ff3366',            // Rojo corporativo
                background: '#0d0d0f',        // Negro absoluto
                surface: '#161618',           // Negro surface
                elevated: '#1e1e21',          // Elevado sutil
                textPrimary: '#ffffff',
                textSecondary: '#b8b8b8',
                textMuted: '#707070',
                gradientPrimary: 'linear-gradient(135deg, #1a1a1a 0%, #00ff9f 100%)',
                gradientSuccess: 'linear-gradient(135deg, #00ff9f 0%, #00cc7f 100%)',
                gradientWarning: 'linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%)',
                gradientDanger: 'linear-gradient(135deg, #ff3366 0%, #e02e5a 100%)',
                shadowGlow: '0 0 40px rgba(0, 255, 159, 0.3)',
                shadowDark: '0 15px 35px rgba(0, 0, 0, 0.8)',
                glassEffect: 'rgba(255, 255, 255, 0.03)'
            }
        },

        // 🚀 TESLA FUTURISTIC - Diseño Elon Musk
        'tesla-futuristic': {
            name: 'Tesla Futuristic',
            description: 'El futuro según Elon Musk',
            colors: {
                primary: '#ff0040',           // Rojo Tesla icónico
                secondary: '#1a1a1a',         // Negro Tesla
                accent: '#00d4ff',            // Cian futurista
                warning: '#ffaa00',           // Ámbar premium
                danger: '#ff1744',            // Rojo alerta
                background: '#000000',        // Negro absoluto Tesla
                surface: '#0a0a0a',           // Surface mínimo
                elevated: '#141414',          // Elevado Tesla
                textPrimary: '#ffffff',
                textSecondary: '#cccccc',
                textMuted: '#888888',
                gradientPrimary: 'linear-gradient(135deg, #ff0040 0%, #00d4ff 100%)',
                gradientSuccess: 'linear-gradient(135deg, #00ff87 0%, #00b894 100%)',
                gradientWarning: 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)',
                gradientDanger: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
                shadowGlow: '0 0 50px rgba(255, 0, 64, 0.4)',
                shadowDark: '0 20px 40px rgba(0, 0, 0, 0.9)',
                glassEffect: 'rgba(255, 255, 255, 0.02)'
            }
        },

        // 💎 GOLDMAN SACHS - Oro y Negro Elegante
        'goldman-elite': {
            name: 'Goldman Elite',
            description: 'Elegancia bancaria mundial',
            colors: {
                primary: '#d4af37',           // Oro Goldman Sachs
                secondary: '#1c1c1e',         // Negro premium
                accent: '#f5d76e',            // Oro claro
                warning: '#ff9500',           // Naranja ejecutivo
                danger: '#ff453a',            // Rojo elegante
                background: '#000000',        // Negro absoluto
                surface: '#0f0f0f',           // Surface premium
                elevated: '#1a1a1a',          // Elevado oro
                textPrimary: '#ffffff',
                textSecondary: '#d4af37',     // Texto dorado
                textMuted: '#a0a0a0',
                gradientPrimary: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                gradientSuccess: 'linear-gradient(135deg, #00c851 0%, #00a142 100%)',
                gradientWarning: 'linear-gradient(135deg, #ff9500 0%, #e6870e 100%)',
                gradientDanger: 'linear-gradient(135deg, #ff453a 0%, #e63946 100%)',
                shadowGlow: '0 0 30px rgba(212, 175, 55, 0.5)',
                shadowDark: '0 15px 30px rgba(0, 0, 0, 0.8)',
                glassEffect: 'rgba(212, 175, 55, 0.05)'
            }
        },

        // 🍎 APPLE PREMIUM - Diseño Cupertino
        'apple-premium': {
            name: 'Apple Premium',
            description: 'Diseño desde Cupertino',
            colors: {
                primary: '#007aff',           // Azul Apple
                secondary: '#5856d6',         // Púrpura iOS
                accent: '#30d158',            // Verde Apple
                warning: '#ff9f0a',           // Naranja iOS
                danger: '#ff453a',            // Rojo sistema
                background: '#000000',        // Negro Apple
                surface: '#1c1c1e',           // Gris sistema
                elevated: '#2c2c2e',          // Elevado iOS
                textPrimary: '#ffffff',
                textSecondary: '#ebebf5',     // Texto secundario iOS
                textMuted: '#ebebf599',       // Texto terciario
                gradientPrimary: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                gradientSuccess: 'linear-gradient(135deg, #30d158 0%, #00c851 100%)',
                gradientWarning: 'linear-gradient(135deg, #ff9f0a 0%, #ff8c00 100%)',
                gradientDanger: 'linear-gradient(135deg, #ff453a 0%, #e63946 100%)',
                shadowGlow: '0 0 25px rgba(0, 122, 255, 0.4)',
                shadowDark: '0 10px 25px rgba(0, 0, 0, 0.7)',
                glassEffect: 'rgba(255, 255, 255, 0.06)'
            }
        },

        // 🔴 NETFLIX ORIGINAL - Entretenimiento Premium
        'netflix-original': {
            name: 'Netflix Original',
            description: 'Entretenimiento de clase mundial',
            colors: {
                primary: '#e50914',           // Rojo Netflix icónico
                secondary: '#221f1f',         // Gris oscuro Netflix
                accent: '#ffffff',            // Blanco puro contraste
                warning: '#f5c518',           // Amarillo IMDB
                danger: '#dc1a28',            // Rojo intenso
                background: '#141414',        // Negro Netflix
                surface: '#181818',           // Surface Netflix
                elevated: '#2f2f2f',          // Elevado sutil
                textPrimary: '#ffffff',
                textSecondary: '#b3b3b3',     // Gris Netflix
                textMuted: '#737373',         // Gris apagado
                gradientPrimary: 'linear-gradient(135deg, #e50914 0%, #b81d24 100%)',
                gradientSuccess: 'linear-gradient(135deg, #46d369 0%, #1db954 100%)',
                gradientWarning: 'linear-gradient(135deg, #f5c518 0%, #e6ac00 100%)',
                gradientDanger: 'linear-gradient(135deg, #dc1a28 0%, #b81d24 100%)',
                shadowGlow: '0 0 35px rgba(229, 9, 20, 0.4)',
                shadowDark: '0 12px 28px rgba(0, 0, 0, 0.8)',
                glassEffect: 'rgba(255, 255, 255, 0.04)'
            }
        },

        // 🌌 MIDNIGHT CORPORATE (TU FAVORITO MEJORADO)
        'midnight-corporate': {
            name: 'Midnight Corporate',
            description: 'Ultra Premium Nocturno',
            colors: {
                primary: '#00d9ff',           // Cian eléctrico
                secondary: '#8b5cf6',         // Púrpura neón
                accent: '#00ff87',            // Verde éxito
                warning: '#ffb800',           // Ámbar premium
                danger: '#ff4757',            // Rojo elegante
                background: '#0a0a0b',        // Negro carbón
                surface: '#1a1b23',           // Obsidiana
                elevated: '#2d2e3f',          // Carbón elevado
                textPrimary: '#ffffff',
                textSecondary: '#a3a3a3',
                textMuted: '#6b6b6b',
                gradientPrimary: 'linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%)',
                gradientSuccess: 'linear-gradient(135deg, #00ff87 0%, #00b894 100%)',
                gradientWarning: 'linear-gradient(135deg, #ffb800 0%, #ff6b35 100%)',
                gradientDanger: 'linear-gradient(135deg, #ff4757 0%, #e84118 100%)',
                shadowGlow: '0 0 40px rgba(0, 217, 255, 0.4)',
                shadowDark: '0 15px 35px rgba(0, 0, 0, 0.7)',
                glassEffect: 'rgba(255, 255, 255, 0.05)'
            }
        }
    };
}
    // ======= TEMAS POR EMPRESA =======
    loadCompanyThemes() {
        const saved = localStorage.getItem('grizalum_company_themes');
        if (saved) {
            return JSON.parse(saved);
        }

       // Temas por defecto para cada empresa
const defaultThemes = {
    'fundicion-laguna': 'tesla-futuristic',     
    'fundicion-joel': 'goldman-elite',          
    'avicola-san-juan': 'apple-premium',         
    'import-lm': 'blackrock-corporate',         
    'bodega-central': 'netflix-original'         
};
        this.saveCompanyThemes(defaultThemes);
        return defaultThemes;
    }

    saveCompanyThemes(themes) {
        localStorage.setItem('grizalum_company_themes', JSON.stringify(themes));
    }

    // ======= APLICAR TEMA =======
    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error(`Tema '${themeName}' no encontrado`);
            return;
        }

        const theme = this.themes[themeName];
        const root = document.documentElement;

        // Aplicar variables CSS
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVar = this.camelToKebab(key);
            root.style.setProperty(`--theme-${cssVar}`, value);
        });

        this.currentTheme = themeName;
        localStorage.setItem('grizalum_current_theme', themeName);
        
        console.log(`🎨 Tema aplicado: ${theme.name}`);
        
        // Disparar evento personalizado
        this.dispatchThemeChange(themeName, theme);
    }

    // ======= CAMBIAR TEMA POR EMPRESA =======
    applyCompanyTheme(companyId) {
        const themeName = this.companyThemes[companyId];
        if (themeName) {
            this.applyTheme(themeName);
            console.log(`🏢 Tema de empresa aplicado: ${companyId} -> ${themeName}`);
        } else {
            console.warn(`No hay tema definido para la empresa: ${companyId}`);
            this.applyTheme('midnight-corporate'); // Tema por defecto
        }
    }

    // ======= ASIGNAR TEMA A EMPRESA =======
    setCompanyTheme(companyId, themeName) {
        if (!this.themes[themeName]) {
            console.error(`Tema '${themeName}' no existe`);
            return false;
        }

        this.companyThemes[companyId] = themeName;
        this.saveCompanyThemes(this.companyThemes);
        
        console.log(`✅ Tema asignado: ${companyId} -> ${themeName}`);
        return true;
    }

    // ======= CREAR ESTILOS DINÁMICOS =======
    createThemeStyles() {
        const styleId = 'grizalum-theme-styles';
        let existingStyle = document.getElementById(styleId);
        
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* GRIZALUM DYNAMIC THEME SYSTEM */
            :root {
                /* Variables que se actualizan dinámicamente */
                --theme-primary: var(--theme-primary, #00d9ff);
                --theme-secondary: var(--theme-secondary, #8b5cf6);
                --theme-accent: var(--theme-accent, #00ff87);
                --theme-warning: var(--theme-warning, #ffb800);
                --theme-danger: var(--theme-danger, #ff4757);
                --theme-background: var(--theme-background, #0a0a0b);
                --theme-surface: var(--theme-surface, #1a1b23);
                --theme-elevated: var(--theme-elevated, #2d2e3f);
                --theme-text-primary: var(--theme-text-primary, #ffffff);
                --theme-text-secondary: var(--theme-text-secondary, #a3a3a3);
                --theme-text-muted: var(--theme-text-muted, #6b6b6b);
                --theme-gradient-primary: var(--theme-gradient-primary, linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%));
                --theme-gradient-success: var(--theme-gradient-success, linear-gradient(135deg, #00ff87 0%, #00b894 100%));
                --theme-gradient-warning: var(--theme-gradient-warning, linear-gradient(135deg, #ffb800 0%, #ff6b35 100%));
                --theme-gradient-danger: var(--theme-gradient-danger, linear-gradient(135deg, #ff4757 0%, #e84118 100%));
                --theme-shadow-glow: var(--theme-shadow-glow, 0 0 30px rgba(0, 217, 255, 0.4));
                --theme-shadow-dark: var(--theme-shadow-dark, 0 10px 30px rgba(0, 0, 0, 0.5));
                --theme-glass-effect: var(--theme-glass-effect, rgba(255, 255, 255, 0.05));
            }

            /* APLICAR TEMA A ELEMENTOS PRINCIPALES */
            body {
                background: var(--theme-background) !important;
                color: var(--theme-text-primary) !important;
            }

            .sidebar {
                background: linear-gradient(180deg, var(--theme-surface) 0%, var(--theme-background) 100%) !important;
                border-right: 1px solid var(--theme-primary) !important;
            }

            .sidebar-header {
                background: var(--theme-gradient-primary) !important;
            }

            .nav-link.active {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
            }

            .nav-link:hover {
                color: var(--theme-primary) !important;
            }

            .executive-header {
                background: var(--theme-glass-effect) !important;
                backdrop-filter: blur(20px) !important;
                border-bottom: 1px solid var(--theme-primary) !important;
            }

            .ai-header-button {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
            }

            .metric-card {
                background: var(--theme-glass-effect) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
            }

            .metric-card::before {
                background: var(--theme-gradient-primary) !important;
            }

            .metric-value {
                background: var(--theme-gradient-primary) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
            }

            .ai-insights {
                background: linear-gradient(135deg, var(--theme-glass-effect) 0%, var(--theme-glass-effect) 100%) !important;
                border: 1px solid var(--theme-primary) !important;
                color: var(--theme-primary) !important;
            }

            /* TRANSICIONES SUAVES */
            * {
                transition: all 0.3s ease !important;
            }
        `;
        
        document.head.appendChild(style);
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
            this.applyTheme('midnight-corporate');
        }
    }

    dispatchThemeChange(themeName, theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { themeName, theme }
        });
        document.dispatchEvent(event);
    }

    // ======= API PÚBLICA =======
    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            key,
            name: this.themes[key].name,
            description: this.themes[key].description
        }));
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeColors(themeName) {
        return this.themes[themeName]?.colors || null;
    }

    // ======= PREVIEW DE TEMAS =======
    previewTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        const currentTheme = this.currentTheme;
        this.applyTheme(themeName);
        
        // Revertir después de 3 segundos
        setTimeout(() => {
            this.applyTheme(currentTheme);
        }, 3000);
    }
}

// ======= INICIALIZACIÓN GLOBAL =======
let themeManager = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Inicializando Theme Manager...');
    
    // Crear instancia global
    themeManager = new GrizalumThemeManager();
    window.themeManager = themeManager;
    
    console.log('✅ Theme Manager listo - Sistema de temas dinámicos activo');
});

// ======= INTEGRACIÓN CON SELECTOR DE EMPRESAS =======
function applyCompanyThemeIntegration(companyId) {
    if (window.themeManager) {
        window.themeManager.applyCompanyTheme(companyId);
    }
}

// ======= EXPORTAR PARA USO GLOBAL =======
window.GrizalumThemeManager = GrizalumThemeManager;

console.log('🚀 GRIZALUM THEME MANAGER CARGADO');
console.log('🎨 Características:');
console.log('  • 8+ temas premium incluidos');
console.log('  • Cambio automático por empresa');
console.log('  • Persistencia en localStorage');
console.log('  • Transiciones suaves');
console.log('  • API completa para personalización');
console.log('💫 ¡Tu dashboard nunca se verá igual!');
