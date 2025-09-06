/* ================================================================
   GESTOR DE TEMAS FUTURISTAS GRIZALUM
   Archivo: gestor-temas-futuristas.js
   Integración con sistema modular existente
   ================================================================ */

class GrizalumFuturisticThemes {
    constructor() {
        this.currentTheme = 'gold'; // tema por defecto
        this.futuristicThemes = [
            'cyber-blue',
            'neon-purple', 
            'mint-green',
            'coral-fusion',
            'quantum-silver'
        ];
        
        this.companyThemes = new Map(); // Almacena temas personalizados por empresa
        this.initialize();
    }

    initialize() {
        this.createFuturisticThemeSelector();
        this.setupEventListeners();
        this.loadSavedThemes();
        this.integrateWithCompanySelector();
    }

    /* ===== CREACIÓN DEL SELECTOR EXPANDIDO ===== */
    createFuturisticThemeSelector() {
        const themeSelector = document.querySelector('.theme-selector');
        if (!themeSelector) return;

        // Agregar nuevos temas futuristas
        const futuristicThemeButtons = this.futuristicThemes.map(theme => {
            return `<div class="theme-option" data-theme="${theme}" onclick="grizalumFuturisticThemes.changeTheme('${theme}')"></div>`;
        }).join('');

        // Agregar botón de personalización
        const customButton = `
            <div class="theme-option theme-custom" onclick="grizalumFuturisticThemes.openThemeCustomizer()" title="Personalizar tema">
                <i class="fas fa-palette"></i>
            </div>
        `;

        themeSelector.insertAdjacentHTML('beforeend', futuristicThemeButtons + customButton);
    }

    /* ===== CAMBIO DE TEMA PRINCIPAL ===== */
    changeTheme(themeName, companyId = null) {
        // Remover tema anterior
        document.documentElement.className = document.documentElement.className
            .replace(/data-theme-[\w-]+/g, '');
        
        // Aplicar nuevo tema
        document.documentElement.setAttribute('data-theme', themeName);
        this.currentTheme = themeName;

        // Actualizar selector visual
        this.updateThemeSelector(themeName);

        // Si es tema de empresa, aplicar personalización
        if (companyId && this.companyThemes.has(companyId)) {
            this.applyCompanyCustomization(companyId);
        }

        // Guardar preferencia
        this.saveThemePreference(themeName, companyId);

        // Notificar cambio a otros módulos
        this.notifyThemeChange(themeName);

        // Mostrar notificación
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(`Tema ${this.getThemeDisplayName(themeName)} aplicado`, 'success');
        }
    }

    /* ===== PERSONALIZACIÓN POR EMPRESA ===== */
    openThemeCustomizer() {
        const modal = this.createCustomizerModal();
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => modal.classList.add('show'), 100);
    }

    createCustomizerModal() {
        const modal = document.createElement('div');
        modal.className = 'grizalum-modal theme-customizer-modal';
        modal.innerHTML = `
            <div class="grizalum-modal-content theme-customizer">
                <div class="grizalum-modal-header">
                    <h2><i class="fas fa-palette"></i> Personalizar Tema Empresarial</h2>
                    <button class="modal-close" onclick="this.closest('.grizalum-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="customizer-body">
                    <div class="customizer-section">
                        <h3>Empresa Actual</h3>
                        <div class="company-info" id="currentCompanyInfo">
                            <span class="company-name">Selecciona una empresa</span>
                        </div>
                    </div>

                    <div class="customizer-section">
                        <h3>Color Primario</h3>
                        <div class="color-picker-group">
                            <input type="color" id="primaryColor" value="#d4af37" class="color-picker">
                            <input type="text" id="primaryColorHex" value="#d4af37" class="color-input">
                        </div>
                    </div>

                    <div class="customizer-section">
                        <h3>Color Secundario</h3>
                        <div class="color-picker-group">
                            <input type="color" id="secondaryColor" value="#b87333" class="color-picker">
                            <input type="text" id="secondaryColorHex" value="#b87333" class="color-input">
                        </div>
                    </div>

                    <div class="customizer-section">
                        <h3>Estilo de Efectos</h3>
                        <div class="effect-selector">
                            <div class="effect-option active" data-effect="glass">
                                <i class="fas fa-gem"></i>
                                <span>Cristal</span>
                            </div>
                            <div class="effect-option" data-effect="neon">
                                <i class="fas fa-bolt"></i>
                                <span>Neón</span>
                            </div>
                            <div class="effect-option" data-effect="minimal">
                                <i class="fas fa-circle"></i>
                                <span>Minimalista</span>
                            </div>
                        </div>
                    </div>

                    <div class="customizer-section">
                        <h3>Vista Previa</h3>
                        <div class="theme-preview">
                            <div class="preview-card">
                                <div class="preview-header">Panel de Control</div>
                                <div class="preview-metrics">
                                    <div class="preview-metric">
                                        <span>Ingresos</span>
                                        <span class="preview-value">S/. 125,000</span>
                                    </div>
                                </div>
                                <div class="preview-button">Botón de Acción</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="customizer-footer">
                    <button class="btn-cancel" onclick="this.closest('.grizalum-modal').remove()">
                        Cancelar
                    </button>
                    <button class="btn-apply" onclick="grizalumFuturisticThemes.applyCustomTheme()">
                        Aplicar Tema
                    </button>
                    <button class="btn-save" onclick="grizalumFuturisticThemes.saveCustomTheme()">
                        Guardar para Empresa
                    </button>
                </div>
            </div>
        `;

        this.setupCustomizerEvents(modal);
        return modal;
    }

    setupCustomizerEvents(modal) {
        // Color pickers
        const primaryColor = modal.querySelector('#primaryColor');
        const primaryHex = modal.querySelector('#primaryColorHex');
        const secondaryColor = modal.querySelector('#secondaryColor');
        const secondaryHex = modal.querySelector('#secondaryColorHex');

        primaryColor.addEventListener('input', (e) => {
            primaryHex.value = e.target.value;
            this.updatePreview(modal);
        });

        primaryHex.addEventListener('input', (e) => {
            if (this.isValidHex(e.target.value)) {
                primaryColor.value = e.target.value;
                this.updatePreview(modal);
            }
        });

        secondaryColor.addEventListener('input', (e) => {
            secondaryHex.value = e.target.value;
            this.updatePreview(modal);
        });

        secondaryHex.addEventListener('input', (e) => {
            if (this.isValidHex(e.target.value)) {
                secondaryColor.value = e.target.value;
                this.updatePreview(modal);
            }
        });

        // Effect selector
        modal.querySelectorAll('.effect-option').forEach(option => {
            option.addEventListener('click', () => {
                modal.querySelectorAll('.effect-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.updatePreview(modal);
            });
        });

        // Cargar información de empresa actual
        this.loadCurrentCompanyInfo(modal);
    }

    updatePreview(modal) {
        const primaryColor = modal.querySelector('#primaryColor').value;
        const secondaryColor = modal.querySelector('#secondaryColor').value;
        const effect = modal.querySelector('.effect-option.active').dataset.effect;
        
        const preview = modal.querySelector('.theme-preview');
        const primaryRgb = this.hexToRgb(primaryColor);
        const secondaryRgb = this.hexToRgb(secondaryColor);

        // Aplicar colores a la vista previa
        const cssVars = `
            --preview-primary: ${primaryColor};
            --preview-secondary: ${secondaryColor};
            --preview-primary-alpha: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15);
            --preview-effect: ${this.getEffectStyles(effect, primaryRgb)};
        `;

        preview.style.cssText = cssVars;
        preview.className = `theme-preview effect-${effect}`;
    }

    getEffectStyles(effect, rgb) {
        switch(effect) {
            case 'glass':
                return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`;
            case 'neon':
                return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
            case 'minimal':
                return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`;
            default:
                return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
        }
    }

    /* ===== APLICACIÓN Y GUARDADO DE TEMAS PERSONALIZADOS ===== */
    applyCustomTheme() {
        const modal = document.querySelector('.theme-customizer-modal');
        if (!modal) return;

        const primaryColor = modal.querySelector('#primaryColor').value;
        const secondaryColor = modal.querySelector('#secondaryColor').value;
        const effect = modal.querySelector('.effect-option.active').dataset.effect;

        this.setCustomThemeVariables(primaryColor, secondaryColor, effect);
        this.changeTheme('empresa-custom');
        modal.remove();
    }

    saveCustomTheme() {
        const modal = document.querySelector('.theme-customizer-modal');
        if (!modal) return;

        const currentCompany = this.getCurrentCompanyId();
        if (!currentCompany) {
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion('Selecciona una empresa primero', 'warning');
            }
            return;
        }

        const primaryColor = modal.querySelector('#primaryColor').value;
        const secondaryColor = modal.querySelector('#secondaryColor').value;
        const effect = modal.querySelector('.effect-option.active').dataset.effect;

        // Guardar tema personalizado para la empresa
        const customTheme = {
            primaryColor,
            secondaryColor,
            effect,
            name: `${this.getCurrentCompanyName()}_custom`,
            timestamp: Date.now()
        };

        this.companyThemes.set(currentCompany, customTheme);
        this.saveCompanyThemes();
        this.applyCustomTheme();

        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(`Tema personalizado guardado para ${this.getCurrentCompanyName()}`, 'success');
        }
    }

    setCustomThemeVariables(primaryColor, secondaryColor, effect) {
        const primaryRgb = this.hexToRgb(primaryColor);
        const secondaryRgb = this.hexToRgb(secondaryColor);
        
        const root = document.documentElement;
        root.style.setProperty('--empresa-color-primario', primaryColor);
        root.style.setProperty('--empresa-color-oscuro', secondaryColor);
        root.style.setProperty('--empresa-color-claro', this.lightenColor(primaryColor, 20));
        root.style.setProperty('--empresa-color-alpha', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`);
        root.style.setProperty('--empresa-color-brillo', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`);
        
        root.style.setProperty('--empresa-gradiente', 
            `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`);
        root.style.setProperty('--empresa-gradiente-suave', 
            `linear-gradient(135deg, ${this.lightenColor(primaryColor, 20)} 0%, ${primaryColor} 100%)`);
            
        root.style.setProperty('--empresa-cristal', 
            `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${this.getEffectOpacity(effect)})`);
        root.style.setProperty('--empresa-borde-cristal', 
            `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`);
            
        root.style.setProperty('--empresa-sombra', 
            `0 15px 35px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)`);
        root.style.setProperty('--empresa-sombra-suave', 
            `0 8px 25px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`);
        root.style.setProperty('--empresa-brillo', 
            `0 0 20px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`);
    }

    getEffectOpacity(effect) {
        switch(effect) {
            case 'glass': return '0.08';
            case 'neon': return '0.15';
            case 'minimal': return '0.03';
            default: return '0.08';
        }
    }

    /* ===== INTEGRACIÓN CON SELECTOR DE EMPRESAS ===== */
    integrateWithCompanySelector() {
        // Escuchar cambios de empresa
        document.addEventListener('empresaCambiada', (event) => {
            const companyId = event.detail.empresaId;
            this.loadCompanyTheme(companyId);
        });
    }

    loadCompanyTheme(companyId) {
        if (this.companyThemes.has(companyId)) {
            const theme = this.companyThemes.get(companyId);
            this.setCustomThemeVariables(theme.primaryColor, theme.secondaryColor, theme.effect);
            this.changeTheme('empresa-custom', companyId);
        }
    }

    /* ===== UTILIDADES ===== */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 212, g: 175, b: 55 };
    }

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    getCurrentCompanyId() {
        // Integrar con el sistema de empresas existente
        return window.empresaActual?.id || null;
    }

    getCurrentCompanyName() {
        return window.empresaActual?.nombre || 'Empresa';
    }

    loadCurrentCompanyInfo(modal) {
        const info = modal.querySelector('#currentCompanyInfo .company-name');
        if (this.getCurrentCompanyId()) {
            info.textContent = this.getCurrentCompanyName();
            
            // Cargar tema existente si lo hay
            const companyId = this.getCurrentCompanyId();
            if (this.companyThemes.has(companyId)) {
                const theme = this.companyThemes.get(companyId);
                modal.querySelector('#primaryColor').value = theme.primaryColor;
                modal.querySelector('#primaryColorHex').value = theme.primaryColor;
                modal.querySelector('#secondaryColor').value = theme.secondaryColor;
                modal.querySelector('#secondaryColorHex').value = theme.secondaryColor;
                
                modal.querySelectorAll('.effect-option').forEach(option => {
                    option.classList.toggle('active', option.dataset.effect === theme.effect);
                });
                
                this.updatePreview(modal);
            }
        }
    }

    updateThemeSelector(themeName) {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === themeName);
        });
    }

    getThemeDisplayName(themeName) {
        const names = {
            'cyber-blue': 'Cyber Azul',
            'neon-purple': 'Neón Púrpura',
            'mint-green': 'Verde Menta',
            'coral-fusion': 'Coral Fusion',
            'quantum-silver': 'Plata Cuántica',
            'empresa-custom': 'Personalizado'
        };
        return names[themeName] || themeName;
    }

    /* ===== PERSISTENCIA DE DATOS ===== */
    saveThemePreference(themeName, companyId = null) {
        const preference = {
            theme: themeName,
            companyId: companyId,
            timestamp: Date.now()
        };
        localStorage.setItem('grizalum_theme_preference', JSON.stringify(preference));
    }

    saveCompanyThemes() {
        const themesObject = Object.fromEntries(this.companyThemes);
        localStorage.setItem('grizalum_company_themes', JSON.stringify(themesObject));
    }

    loadSavedThemes() {
        // Cargar temas de empresa
        const savedCompanyThemes = localStorage.getItem('grizalum_company_themes');
        if (savedCompanyThemes) {
            const themesObject = JSON.parse(savedCompanyThemes);
            this.companyThemes = new Map(Object.entries(themesObject));
        }

        // Cargar preferencia de tema
        const savedPreference = localStorage.getItem('grizalum_theme_preference');
        if (savedPreference) {
            const preference = JSON.parse(savedPreference);
            this.changeTheme(preference.theme, preference.companyId);
        }
    }

    notifyThemeChange(themeName) {
        // Notificar a otros módulos del sistema
        const event = new CustomEvent('temaFuturistaCambiado', {
            detail: { 
                tema: themeName,
                esFuturista: this.futuristicThemes.includes(themeName)
            }
        });
        document.dispatchEvent(event);

        // Actualizar gráficos si es necesario
        if (window.GrizalumCharts && this.futuristicThemes.includes(themeName)) {
            setTimeout(() => {
                window.GrizalumCharts.updateThemeColors();
            }, 300);
        }
    }

    /* ===== API PÚBLICA ===== */
    getAvailableThemes() {
        return [...this.futuristicThemes, 'empresa-custom'];
    }

    isThemeFuturistic(themeName) {
        return this.futuristicThemes.includes(themeName) || themeName === 'empresa-custom';
    }

    exportCompanyTheme(companyId) {
        if (this.companyThemes.has(companyId)) {
            return JSON.stringify(this.companyThemes.get(companyId), null, 2);
        }
        return null;
    }

    importCompanyTheme(companyId, themeJson) {
        try {
            const theme = JSON.parse(themeJson);
            this.companyThemes.set(companyId, theme);
            this.saveCompanyThemes();
            return true;
        } catch (error) {
            console.error('Error importing theme:', error);
            return false;
        }
    }
}

/* ===== ESTILOS CSS PARA EL CUSTOMIZADOR ===== */
const customizerStyles = `
<style>
.theme-customizer-modal .grizalum-modal-content {
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.customizer-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.customizer-section h3 {
    margin: 0 0 15px 0;
    color: var(--theme-primary);
    font-size: 16px;
    font-weight: 600;
}

.color-picker-group {
    display: flex;
    gap: 10px;
    align-items: center;
}

.color-picker {
    width: 50px;
    height: 40px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.color-input {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--gray-300);
    border-radius: 8px;
    font-family: monospace;
}

.effect-selector {
    display: flex;
    gap: 10px;
}

.effect-option {
    flex: 1;
    padding: 15px;
    border: 2px solid var(--gray-300);
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.effect-option.active {
    border-color: var(--theme-primary);
    background: var(--theme-primary-alpha);
}

.effect-option i {
    display: block;
    font-size: 20px;
    margin-bottom: 5px;
}

.theme-preview {
    border: 1px solid var(--gray-300);
    border-radius: 12px;
    overflow: hidden;
    background: var(--preview-effect, var(--gray-50));
}

.preview-card {
    padding: 20px;
}

.preview-header {
    font-size: 18px;
    font-weight: 600;
    color: var(--preview-primary);
    margin-bottom: 15px;
}

.preview-metrics {
    background: var(--preview-primary-alpha, rgba(0,0,0,0.05));
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
}

.preview-metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.preview-value {
    font-weight: 600;
    color: var(--preview-primary);
}

.preview-button {
    background: linear-gradient(135deg, var(--preview-primary) 0%, var(--preview-secondary) 100%);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
}

.customizer-footer {
    display: flex;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid var(--gray-200);
    justify-content: flex-end;
}

.customizer-footer button {
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancel {
    background: var(--gray-200);
    color: var(--gray-700);
}

.btn-apply, .btn-save {
    background: var(--theme-gradient);
    color: white;
}

.company-info {
    padding: 15px;
    background: var(--gray-50);
    border-radius: 8px;
    border: 1px solid var(--gray-200);
}

.theme-custom {
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
}

@media (max-width: 768px) {
    .effect-selector {
        flex-direction: column;
    }
    
    .customizer-footer {
        flex-direction: column;
    }
}
</style>
`;

/* ===== INICIALIZACIÓN ===== */
document.head.insertAdjacentHTML('beforeend', customizerStyles);

// Crear instancia global
window.grizalumFuturisticThemes = new GrizalumFuturisticThemes();

// Exportar para compatibilidad con módulos existentes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GrizalumFuturisticThemes;
}
