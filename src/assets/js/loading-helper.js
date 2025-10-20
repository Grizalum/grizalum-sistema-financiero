/**
 * ════════════════════════════════════════════════════════════════
 * LOADING HELPER - Sistema de carga global
 * ════════════════════════════════════════════════════════════════
 * Proporciona funciones para mostrar/ocultar indicadores de carga
 * en botones y pantalla completa
 */

const LoadingHelper = {
    // ═══════════════════════════════════════════════════════════════
    // LOADING EN BOTONES
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Muestra loading en un botón
     * @param {HTMLElement|string} buttonElement - Elemento o ID del botón
     * @param {string} text - Texto a mostrar
     */
    show: function(buttonElement, text = 'Cargando...') {
        const btn = typeof buttonElement === 'string' 
            ? document.getElementById(buttonElement) 
            : buttonElement;
            
        if (!btn) {
            console.warn('LoadingHelper.show: Botón no encontrado');
            return;
        }
        
        // Guardar estado original
        btn.dataset.originalHTML = btn.innerHTML;
        btn.dataset.originalDisabled = btn.disabled;
        
        // Aplicar loading
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
        btn.classList.add('loading');
        
        console.log('✅ Loading activado:', btn.id || 'botón');
    },
    
    /**
     * Oculta loading del botón
     * @param {HTMLElement|string} buttonElement - Elemento o ID del botón
     */
    hide: function(buttonElement) {
        const btn = typeof buttonElement === 'string' 
            ? document.getElementById(buttonElement) 
            : buttonElement;
            
        if (!btn) {
            console.warn('LoadingHelper.hide: Botón no encontrado');
            return;
        }
        
        // Restaurar estado original
        btn.disabled = btn.dataset.originalDisabled === 'true';
        btn.innerHTML = btn.dataset.originalHTML || btn.innerHTML;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.classList.remove('loading');
        
        // Limpiar datasets
        delete btn.dataset.originalHTML;
        delete btn.dataset.originalDisabled;
        
        console.log('✅ Loading desactivado:', btn.id || 'botón');
    },
    
    // ═══════════════════════════════════════════════════════════════
    // LOADING DE PANTALLA COMPLETA
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Muestra overlay de loading en toda la pantalla
     * @param {string} text - Texto a mostrar
     */
    showOverlay: function(text = 'Procesando...') {
        // Remover overlay existente si hay
        this.hideOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-overlay__content">
                <i class="fas fa-spinner fa-spin loading-overlay__spinner"></i>
                <p class="loading-overlay__text">${text}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animación de entrada
        setTimeout(() => overlay.classList.add('show'), 10);
        
        console.log('✅ Overlay loading activado');
    },
    
    /**
     * Oculta overlay de loading
     */
    hideOverlay: function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
            console.log('✅ Overlay loading desactivado');
        }
    },
    
    // ═══════════════════════════════════════════════════════════════
    // UTILIDADES
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Ejecuta función con loading automático
     * @param {Function} fn - Función a ejecutar
     * @param {HTMLElement|string} button - Botón opcional
     * @param {string} loadingText - Texto de loading
     */
    async wrap: async function(fn, button = null, loadingText = 'Procesando...') {
        try {
            if (button) this.show(button, loadingText);
            else this.showOverlay(loadingText);
            
            const result = await fn();
            
            return result;
        } catch (error) {
            console.error('❌ Error en LoadingHelper.wrap:', error);
            throw error;
        } finally {
            if (button) this.hide(button);
            else this.hideOverlay();
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// ESTILOS CSS
// ═══════════════════════════════════════════════════════════════
(function() {
    const style = document.createElement('style');
    style.id = 'loading-helper-styles';
    style.textContent = `
        /* Overlay de loading */
        .loading-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .loading-overlay.show {
            opacity: 1;
        }
        
        .loading-overlay__content {
            text-align: center;
            color: white;
        }
        
        .loading-overlay__spinner {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .loading-overlay__text {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0;
        }
        
        /* Botones con loading */
        button.loading {
            position: relative;
            pointer-events: none;
        }
        
        button.loading i.fa-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    
    // Solo agregar si no existe
    if (!document.getElementById('loading-helper-styles')) {
        document.head.appendChild(style);
    }
})();

// ═══════════════════════════════════════════════════════════════
// EXPORTAR (Global)
// ═══════════════════════════════════════════════════════════════
if (typeof window !== 'undefined') {
    window.LoadingHelper = LoadingHelper;
    console.log('✅ LoadingHelper cargado globalmente');
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingHelper;
}
