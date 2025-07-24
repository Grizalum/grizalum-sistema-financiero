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
            // 🌌 TEMA MIDNIGHT CORPORATE (TU FAVORITO)
            'midnight-corporate': {
                name: 'Midnight Corporate',
                description: 'Diseño Netflix/Tesla - Ultra Premium',
                colors: {
                    // Colores principales
                    primary: '#00d9ff',           // Cian eléctrico
                    secondary: '#8b5cf6',         // Púrpura neón
                    accent: '#00ff87',            // Verde éxito
                    warning: '#ffb800',           // Ámbar premium
                    danger: '#ff4757',            // Rojo elegante
                    
                    // Fondos
                    background: '#0a0a0b',        // Negro carbón
                    surface: '#1a1b23',           // Obsidiana
                    elevated: '#2d2e3f',          // Carbón elevado
                    
                    // Texto
                    textPrimary: '#ffffff',
                    textSecondary: '#a3a3a3',
                    textMuted: '#6b6b6b',
                    
                    // Gradientes
                    gradientPrimary: 'linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #00ff87 0%, #00b894 100%)',
                    gradientWarning: 'linear-gradient(135deg, #ffb800 0%, #ff6b35 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ff4757 0%, #e84118 100%)',
                    
                    // Efectos
                    shadowGlow: '0 0 30px rgba(0, 217, 255, 0.4)',
                    shadowDark: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    glassEffect: 'rgba(255, 255, 255, 0.05)'
                }
            },

            // 🚀 TEMA CYBER BLUE
            'cyber-blue': {
                name: 'Cyber Blue',
                description: 'Futurista azul neón',
                colors: {
                    primary: '#0ea5e9',
                    secondary: '#3b82f6',
                    accent: '#06b6d4',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    background: '#0f172a',
                    surface: '#1e293b',
                    elevated: '#334155',
                    textPrimary: '#f8fafc',
                    textSecondary: '#cbd5e1',
                    textMuted: '#64748b',
                    gradientPrimary: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    shadowGlow: '0 0 30px rgba(14, 165, 233, 0.4)',
                    shadowDark: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    glassEffect: 'rgba(255, 255, 255, 0.05)'
                }
            },

            // 💚 TEMA EMERALD CORPORATE
            'emerald-corporate': {
                name: 'Emerald Corporate',
                description: 'Verde corporativo elegante',
                colors: {
                    primary: '#10b981',
                    secondary: '#059669',
                    accent: '#34d399',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    background: '#064e3b',
                    surface: '#065f46',
                    elevated: '#047857',
                    textPrimary: '#ecfdf5',
                    textSecondary: '#a7f3d0',
                    textMuted: '#6ee7b7',
                    gradientPrimary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    shadowGlow: '0 0 30px rgba(16, 185, 129, 0.4)',
                    shadowDark: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    glassEffect: 'rgba(255, 255, 255, 0.05)'
                }
            },

            // 🟣 TEMA ROYAL PURPLE
            'royal-purple': {
                name: 'Royal Purple',
                description: 'Púrpura real premium',
                colors: {
                    primary: '#8b5cf6',
                    secondary: '#a78bfa',
                    accent: '#c084fc',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    background: '#1e1b4b',
                    surface: '#312e81',
                    elevated: '#3730a3',
                    textPrimary: '#f3f4f6',
                    textSecondary: '#d1d5db',
                    textMuted: '#9ca3af',
                    gradientPrimary: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    shadowGlow: '0 0 30px rgba(139, 92, 246, 0.4)',
                    shadowDark: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    glassEffect: 'rgba(255, 255, 255, 0.05)'
                }
            },

            // 🔴 TEMA CRIMSON CORPORATE
            'crimson-corporate': {
                name: 'Crimson Corporate',
                description: 'Rojo corporativo potente',
                colors: {
                    primary: '#dc2626',
                    secondary: '#ef4444',
                    accent: '#f87171',
                    warning: '#f59e0b',
                    danger: '#991b1b',
                    background: '#450a0a',
                    surface: '#7f1d1d',
                    elevated: '#991b1b',
                    textPrimary: '#fef2f2',
                    textSecondary: '#fca5a5',
                    textMuted: '#f87171',
                    gradientPrimary: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
                    shadowGlow: '0 0 30px rgba(220, 38, 38, 0.4)',
                    shadowDark: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    glassEffect: 'rgba(255, 255, 255, 0.05)'
                }
            },

            // 🌅 TEMA SUNSET ORANGE
            'sunset-orange': {
                name: 'Sunset Orange',
                description: 'Naranja sunset vibrante',
                colors: {
                    primary: '#ea580c',
                    secondary: '#f97316',
                    accent: '#fb923c',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    background: '#431407',
                    surface: '#9a3412',
                    elevated: '#c2410c',
                    textPrimary: '#fff7ed',
                    textSecondary: '#fed7aa',
                    textMuted: '#fdba74',
                    gradientPrimary: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    shadowGlow: '0 0 30px rgba(234, 88, 12, 0.4)',
                    shadowDark: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    glassEffect: 'rgba(255, 255, 255, 0.05)'
                }
            },

            // 🌸 TEMA ROSE GOLD
            'rose-gold': {
                name: 'Rose Gold',
                description: 'Rosa dorado elegante',
                colors: {
                    primary: '#f43f5e',
                    secondary: '#ec4899',
                    accent: '#f472b6',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    background: '#500724',
                    surface: '#831843',
                    elevated: '#be185d',
                    textPrimary: '#fdf2f8',
                    textSecondary: '#fbcfe8',
                    textMuted: '#f8bbd9',
                    gradientPrimary: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    shadowGlow: '0 0 30px rgba(244, 63, 94, 0.4)',
                    shadowDark: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    glassEffect: 'rgba(255, 255, 255, 0.05)'
                }
            },

            // 🖤 TEMA DARK ELEGANCE
            'dark-elegance': {
                name: 'Dark Elegance',
                description: 'Elegancia oscura minimalista',
                colors: {
                    primary: '#6b7280',
                    secondary: '#9ca3af',
                    accent: '#d1d5db',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    background: '#111827',
                    surface: '#1f2937',
                    elevated: '#374151',
                    textPrimary: '#f9fafb',
                    textSecondary: '#e5e7eb',
                    textMuted: '#d1d5db',
                    gradientPrimary: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    shadowGlow: '0 0 30px rgba(107, 114, 128, 0.4)',
                    shadowDark: '0 10px 30px rgba(0, 0, 0, 0.5)',
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
            'fundicion-laguna': 'crimson-corporate',
            'fundicion-joel': 'sunset-orange', 
            'avicola-san-juan': 'emerald-corporate',
            'import-lm': 'royal-purple',
            'bodega-central': 'cyber-blue'
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
