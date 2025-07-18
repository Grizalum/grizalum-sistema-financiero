// GRIZALUM - Utilidades y Funciones Helper
// Sistema Financiero Empresarial Premium

// FORMATO DE NÚMEROS Y MONEDA
const formatCurrency = (amount, currency = 'PEN') => {
    const formatter = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Reemplazar PEN con S/.
    return formatter.format(amount).replace('PEN', 'S/.');
};

const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('es-PE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
};

const formatPercentage = (value, decimals = 1) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
};

// FORMATO DE FECHAS
const formatDate = (date, format = 'short') => {
    const dateObj = new Date(date);
    
    const options = {
        short: { day: '2-digit', month: '2-digit', year: 'numeric' },
        long: { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        },
        time: { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        }
    };
    
    return dateObj.toLocaleDateString('es-PE', options[format]);
};

const formatDateTime = (date) => {
    return `${formatDate(date, 'short')} ${formatDate(date, 'time')}`;
};

const getRelativeTime = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
        const days = Math.floor(diffInDays);
        return `hace ${days} día${days !== 1 ? 's' : ''}`;
    } else {
        return formatDate(date);
    }
};

// VALIDACIONES
const validateRUC = (ruc) => {
    // Validación básica de RUC peruano (11 dígitos)
    const rucPattern = /^\d{11}$/;
    if (!rucPattern.test(ruc)) return false;
    
    // Verificar dígito verificador (simplificado)
    const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
        sum += parseInt(ruc[i]) * factors[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;
    
    return parseInt(ruc[10]) === checkDigit;
};

const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

const validatePhone = (phone) => {
    // Validación para números peruanos
    const phonePattern = /^(\+51)?[9]\d{8}$/;
    return phonePattern.test(phone.replace(/\s/g, ''));
};

const validateAmount = (amount) => {
    const amountPattern = /^\d+(\.\d{1,2})?$/;
    return amountPattern.test(amount) && parseFloat(amount) > 0;
};

// STORAGE Y CACHÉ
const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(`grizalum_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Error leyendo del storage:', error);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(`grizalum_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('Error escribiendo al storage:', error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(`grizalum_${key}`);
            return true;
        } catch (error) {
            console.warn('Error eliminando del storage:', error);
            return false;
        }
    },
    
    clear: () => {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith('grizalum_'))
                .forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.warn('Error limpiando storage:', error);
            return false;
        }
    }
};

// DEBOUNCE Y THROTTLE
const debounce = (func, wait, immediate = false) => {
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
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// NOTIFICACIONES
const notify = {
    success: (message, duration = 4000) => {
        showNotification(message, 'success', duration);
    },
    
    error: (message, duration = 5000) => {
        showNotification(message, 'error', duration);
    },
    
    warning: (message, duration = 4000) => {
        showNotification(message, 'warning', duration);
    },
    
    info: (message, duration = 3000) => {
        showNotification(message, 'info', duration);
    }
};

function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        error: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        info: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        word-wrap: break-word;
    `;
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            cursor: pointer;
            margin-left: auto;
        ">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// CÁLCULOS FINANCIEROS
const financial = {
    // Calcular porcentaje de cambio
    percentageChange: (oldValue, newValue) => {
        if (oldValue === 0) return newValue > 0 ? 100 : 0;
        return ((newValue - oldValue) / oldValue) * 100;
    },
    
    // Calcular margen de ganancia
    profitMargin: (revenue, cost) => {
        if (revenue === 0) return 0;
        return ((revenue - cost) / revenue) * 100;
    },
    
    // Calcular ROI
    roi: (gain, cost) => {
        if (cost === 0) return 0;
        return ((gain - cost) / cost) * 100;
    },
    
    // Calcular tasa de crecimiento
    growthRate: (values) => {
        if (values.length < 2) return 0;
        const first = values[0];
        const last = values[values.length - 1];
        const periods = values.length - 1;
        return (Math.pow(last / first, 1 / periods) - 1) * 100;
    },
    
    // Proyección lineal simple
    linearProjection: (values, periods = 1) => {
        if (values.length < 2) return values[values.length - 1] || 0;
        
        const n = values.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
        const sumX2 = values.reduce((sum, val, index) => sum + (index * index), 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        const projections = [];
        for (let i = 0; i < periods; i++) {
            projections.push(slope * (n + i) + intercept);
        }
        
        return periods === 1 ? projections[0] : projections;
    }
};

// UTILIDADES DOM
const dom = {
    $: (selector) => document.querySelector(selector),
    $$: (selector) => document.querySelectorAll(selector),
    
    create: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },
    
    remove: (element) => {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },
    
    show: (element) => {
        if (element) element.style.display = 'block';
    },
    
    hide: (element) => {
        if (element) element.style.display = 'none';
    },
    
    toggle: (element) => {
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    }
};

// EXPORTAR DATOS
const exportData = {
    toCSV: (data, filename = 'grizalum_export.csv') => {
        const csvContent = data.map(row => 
            Object.values(row).map(value => 
                typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value
            ).join(',')
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },
    
    toJSON: (data, filename = 'grizalum_export.json') => {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
};

// DETECTORES
const device = {
    isMobile: () => window.innerWidth <= 768,
    isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: () => window.innerWidth > 1024,
    isTouchDevice: () => 'ontouchstart' in window,
    isOnline: () => navigator.onLine,
    isPWA: () => window.matchMedia('(display-mode: standalone)').matches
};

// LOGGER MEJORADO
const logger = {
    info: (message, data = null) => {
        console.log(`🔵 GRIZALUM: ${message}`, data || '');
    },
    
    success: (message, data = null) => {
        console.log(`🟢 GRIZALUM: ${message}`, data || '');
    },
    
    warning: (message, data = null) => {
        console.warn(`🟡 GRIZALUM: ${message}`, data || '');
    },
    
    error: (message, error = null) => {
        console.error(`🔴 GRIZALUM: ${message}`, error || '');
    }
};

// INICIALIZACIÓN
console.log('🛠️ GRIZALUM Utils cargado correctamente');

// Hacer disponibles globalmente las funciones más usadas
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.notify = notify;
window.storage = storage;
window.financial = financial;
window.device = device;
