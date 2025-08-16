/**
 * ================================================
 * GRIZALUM - UTILS MODULE
 * Funciones utilitarias y helpers
 * ================================================
 */

// ======= UTILIDADES GENERALES =======

// Formatear números a moneda peruana
function formatCurrency(amount, includeSymbol = true) {
    const formatted = new Intl.NumberFormat('es-PE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
    
    return includeSymbol ? `S/. ${formatted}` : formatted;
}

// Formatear porcentajes
function formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
}

// Formatear fechas
function formatDate(date, format = 'dd/mm/yyyy') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'mm/dd/yyyy':
            return `${month}/${day}/${year}`;
        case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;
        case 'relative':
            return getRelativeTime(d);
        default:
            return d.toLocaleDateString('es-PE');
    }
}

// Obtener tiempo relativo (hace 2 horas, ayer, etc.)
function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Ahora mismo';
    if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
    return `Hace ${Math.floor(diffDays / 365)} año${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
}

// ======= VALIDACIONES =======

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar RUC peruano
function isValidRUC(ruc) {
    if (!ruc || ruc.length !== 11) return false;
    
    // Verificar que sean solo números
    if (!/^\d{11}$/.test(ruc)) return false;
    
    // Verificar primer dígito
    const firstDigit = parseInt(ruc[0]);
    if (![1, 2].includes(firstDigit)) return false;
    
    // Algoritmo de validación RUC
    const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
        sum += parseInt(ruc[i]) * factors[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;
    
    return checkDigit === parseInt(ruc[10]);
}

// Validar DNI peruano
function isValidDNI(dni) {
    return /^\d{8}$/.test(dni);
}

// Validar número de teléfono peruano
function isValidPhone(phone) {
    // Formatos: 999999999, +51999999999, 51999999999
    const phoneRegex = /^(\+?51)?[9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// ======= MANIPULACIÓN DEL DOM =======

// Crear elemento con atributos
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (content) {
        element.innerHTML = content;
    }
    
    return element;
}

// Mostrar/ocultar elemento con animación
function toggleElement(element, show = null) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    
    if (!element) return;
    
    const isVisible = element.style.display !== 'none';
    const shouldShow = show !== null ? show : !isVisible;
    
    if (shouldShow) {
        element.style.display = 'block';
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '1';
        }, 10);
    } else {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    }
}

// ======= GESTIÓN DE EVENTOS =======

// Debounce para optimizar eventos
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle para limitar frecuencia de eventos
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ======= ALMACENAMIENTO LOCAL =======

// Guardar en localStorage con manejo de errores
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error guardando en localStorage:', e);
        return false;
    }
}

// Cargar de localStorage con manejo de errores
function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error cargando de localStorage:', e);
        return defaultValue;
    }
}

// Eliminar de localStorage
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Error eliminando de localStorage:', e);
        return false;
    }
}

// ======= UTILIDADES DE RED =======

// Realizar petición HTTP simple
async function httpRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('Error en petición HTTP:', error);
        throw error;
    }
}

// ======= UTILIDADES MATEMÁTICAS =======

// Generar número aleatorio en rango
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Redondear a decimales específicos
function roundToDecimals(number, decimals = 2) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Calcular porcentaje de cambio
function calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
}

// Calcular promedio de array
function calculateAverage(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

// ======= UTILIDADES DE ARRAYS =======

// Agrupar array por propiedad
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

// Eliminar duplicados de array
function removeDuplicates(array, key = null) {
    if (key) {
        const seen = new Set();
        return array.filter(item => {
            const val = item[key];
            if (seen.has(val)) {
                return false;
            }
            seen.add(val);
            return true;
        });
    }
    return [...new Set(array)];
}

// Ordenar array por múltiples criterios
function sortBy(array, ...criteria) {
    return array.sort((a, b) => {
        for (const criterion of criteria) {
            let { key, order = 'asc' } = typeof criterion === 'string' 
                ? { key: criterion } 
                : criterion;
            
            const aValue = a[key];
            const bValue = b[key];
            
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
        }
        return 0;
    });
}

// ======= UTILIDADES DE TEXTO =======

// Capitalizar primera letra
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Convertir a título
function toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

// Truncar texto
function truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
}

// Generar slug URL-friendly
function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ======= UTILIDADES DE COLORES =======

// Convertir hex a RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Convertir RGB a hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Obtener color de contraste (blanco o negro)
function getContrastColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#000000';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

// ======= UTILIDADES DE RENDIMIENTO =======

// Medir tiempo de ejecución
function measureTime(label, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${label}: ${end - start} milliseconds`);
    return result;
}

// Cargar script dinámicamente
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Cargar CSS dinámicamente
function loadCSS(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

// ======= UTILIDADES DE DISPOSITIVO =======

// Detectar si es dispositivo móvil
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detectar si es tablet
function isTablet() {
    return /iPad|Android(?=.*Tablet)|Tablet/i.test(navigator.userAgent);
}

// Obtener información del navegador
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';
    
    return {
        browser,
        userAgent: ua,
        platform: navigator.platform,
        language: navigator.language
    };
}

// ======= UTILIDADES DE FORMULARIOS =======

// Serializar formulario a objeto
function serializeForm(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

// Validar formulario
function validateForm(form, rules = {}) {
    const errors = {};
    const formData = serializeForm(form);
    
    Object.entries(rules).forEach(([field, rule]) => {
        const value = formData[field];
        
        if (rule.required && (!value || value.trim() === '')) {
            errors[field] = rule.requiredMessage || `${field} es requerido`;
            return;
        }
        
        if (value && rule.minLength && value.length < rule.minLength) {
            errors[field] = rule.minLengthMessage || 
                `${field} debe tener al menos ${rule.minLength} caracteres`;
            return;
        }
        
        if (value && rule.pattern && !rule.pattern.test(value)) {
            errors[field] = rule.patternMessage || `${field} tiene formato inválido`;
            return;
        }
        
        if (value && rule.custom && !rule.custom(value)) {
            errors[field] = rule.customMessage || `${field} no es válido`;
            return;
        }
    });
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ======= UTILIDADES DE NOTIFICACIONES =======

// Sistema de notificaciones mejorado
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
        this.notifications = new Map();
        this.defaultDuration = 5000;
    }
    
    createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = createElement('div', {
                id: 'notification-container',
                className: 'notification-container',
                style: 'position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 400px;'
            });
            document.body.appendChild(container);
        }
        return container;
    }
    
    show(message, type = 'info', duration = null, actions = []) {
        const id = 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const finalDuration = duration !== null ? duration : this.defaultDuration;
        
        const notification = this.createNotification(id, message, type, actions);
        this.container.appendChild(notification);
        this.notifications.set(id, notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Auto-remove si tiene duración
        if (finalDuration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, finalDuration);
        }
        
        return id;
    }
    
    createNotification(id, message, type, actions) {
        const colors = {
            success: { bg: '#10b981', icon: 'fas fa-check-circle' },
            error: { bg: '#ef4444', icon: 'fas fa-exclamation-circle' },
            warning: { bg: '#f59e0b', icon: 'fas fa-exclamation-triangle' },
            info: { bg: '#3b82f6', icon: 'fas fa-info-circle' }
        };
        
        const config = colors[type] || colors.info;
        
        const notification = createElement('div', {
            className: 'notification',
            style: `
                background: ${config.bg};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                margin-bottom: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 500;
                position: relative;
                overflow: hidden;
            `
        });
        
        // Icono
        const icon = createElement('i', { className: config.icon });
        notification.appendChild(icon);
        
        // Mensaje
        const messageEl = createElement('div', { 
            style: 'flex: 1; line-height: 1.4;',
            innerHTML: message 
        });
        notification.appendChild(messageEl);
        
        // Acciones
        if (actions.length > 0) {
            const actionsContainer = createElement('div', {
                style: 'display: flex; gap: 0.5rem; margin-left: 0.5rem;'
            });
            
            actions.forEach(action => {
                const btn = createElement('button', {
                    style: `
                        background: rgba(255,255,255,0.2);
                        border: 1px solid rgba(255,255,255,0.3);
                        color: white;
                        padding: 0.25rem 0.75rem;
                        border-radius: 4px;
                        font-size: 0.8rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    `,
                    textContent: action.label
                });
                
                btn.addEventListener('click', () => {
                    action.handler();
                    this.remove(id);
                });
                
                btn.addEventListener('mouseenter', () => {
                    btn.style.background = 'rgba(255,255,255,0.3)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.background = 'rgba(255,255,255,0.2)';
                });
                
                actionsContainer.appendChild(btn);
            });
            
            notification.appendChild(actionsContainer);
        }
        
        // Botón cerrar
        const closeBtn = createElement('button', {
            style: `
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                margin-left: 0.5rem;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            `,
            innerHTML: '&times;'
        });
        
        closeBtn.addEventListener('click', () => this.remove(id));
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
        
        notification.appendChild(closeBtn);
        
        return notification;
    }
    
    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;
        
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }
    
    clear() {
        this.notifications.forEach((_, id) => this.remove(id));
    }
}

// Instancia global del sistema de notificaciones
const notificationSystem = new NotificationSystem();

// Funciones de conveniencia para notificaciones
function showNotification(message, type = 'info', duration = null, actions = []) {
    return notificationSystem.show(message, type, duration, actions);
}

function showSuccessNotification(message, duration = 3000) {
    return notificationSystem.show(message, 'success', duration);
}

function showErrorNotification(message, duration = 5000) {
    return notificationSystem.show(message, 'error', duration);
}

function showWarningNotification(message, duration = 4000) {
    return notificationSystem.show(message, 'warning', duration);
}

function showInfoNotification(message, duration = 3000) {
    return notificationSystem.show(message, 'info', duration);
}

// ======= UTILIDADES DE CARGA =======

// Loading spinner simple
function showLoading(target = document.body, message = 'Cargando...') {
    const overlay = createElement('div', {
        className: 'loading-overlay',
        style: `
            position: ${target === document.body ? 'fixed' : 'absolute'};
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            flex-direction: column;
            gap: 1rem;
        `
    });
    
    const spinner = createElement('div', {
        style: `
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `
    });
    
    const text = createElement('div', {
        style: 'color: #374151; font-weight: 500;',
        textContent: message
    });
    
    overlay.appendChild(spinner);
    overlay.appendChild(text);
    target.appendChild(overlay);
    
    return overlay;
}

function hideLoading(target = document.body) {
    const overlay = target.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

// ======= EXPORTAR UTILIDADES =======

// Objeto con todas las utilidades para fácil acceso
window.GrizalumUtils = {
    // Formateo
    formatCurrency,
    formatPercentage,
    formatDate,
    getRelativeTime,
    
    // Validaciones
    isValidEmail,
    isValidRUC,
    isValidDNI,
    isValidPhone,
    
    // DOM
    createElement,
    toggleElement,
    
    // Eventos
    debounce,
    throttle,
    
    // Storage
    saveToStorage,
    loadFromStorage,
    removeFromStorage,
    
    // Red
    httpRequest,
    
    // Matemáticas
    randomInRange,
    roundToDecimals,
    calculatePercentageChange,
    calculateAverage,
    
    // Arrays
    groupBy,
    removeDuplicates,
    sortBy,
    
    // Texto
    capitalize,
    toTitleCase,
    truncateText,
    generateSlug,
    
    // Colores
    hexToRgb,
    rgbToHex,
    getContrastColor,
    
    // Rendimiento
    measureTime,
    loadScript,
    loadCSS,
    
    // Dispositivo
    isMobile,
    isTablet,
    getBrowserInfo,
    
    // Formularios
    serializeForm,
    validateForm,
    
    // Notificaciones
    showNotification,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    
    // Loading
    showLoading,
    hideLoading,
    
    // Sistema de notificaciones
    notificationSystem
};

// Agregar estilos CSS necesarios
const utilsCSS = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .notification-container {
        pointer-events: none;
    }
    
    .notification-container .notification {
        pointer-events: all;
    }
    
    .loading-overlay {
        backdrop-filter: blur(2px);
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = utilsCSS;
document.head.appendChild(styleSheet);

console.log('🛠️ Utils Module cargado');
console.log('✨ Utilidades disponibles en window.GrizalumUtils:');
console.log('  • Formateo de números, fechas y texto');
console.log('  • Validaciones (RUC, DNI, email, etc.)');
console.log('  • Manipulación del DOM');
console.log('  • Sistema de notificaciones avanzado');
console.log('  • Utilidades matemáticas y de arrays');
console.log('  • Gestión de almacenamiento local');
console.log('  • Y mucho más...');
console.log('🚀 ¡Listo para usar!');
