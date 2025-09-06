// ================================================================
// 🔧 GRIZALUM - Configuración Central v2.0
// Configuración unificada para toda la aplicación
// ================================================================

// 🌍 Variable global accesible desde todos los módulos
window.GRIZALUM_CONFIG = {
    // 📋 Información del sistema
    version: '2.0.0',
    name: 'GRIZALUM',
    locale: 'es-PE',
    currency: 'PEN',
    
    // 📊 Configuración de gráficos
    charts: {
        enabled: ['cashFlow', 'expenses', 'revenue', 'aging', 'cashFlowDetail'],
        containers: {
            cashFlow: 'cashFlowChart',
            expenses: 'expensesChart', 
            revenue: 'revenueChart',
            aging: 'agingChart',
            cashFlowDetail: 'cashFlowDetailChart'
        },
        defaultOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'Inter, sans-serif'
                        }
                    }
                }
            }
        }
    },
    
    // 🏢 Configuración de empresas
    companies: {
        default: 'fundicion-laguna',
        dataKeys: ['cashFlow', 'revenue', 'expenses', 'profit', 'growth']
    },
    
    // 🧠 Configuración de módulos
    modules: {
        ai: { enabled: true, endpoint: '/api/ai' },
        notifications: { enabled: true, maxCount: 10 },
        themes: { enabled: true, persistent: true },
        sidebar: { enabled: true, collapsible: true }
    },
    
    // 💰 Configuración financiera
    financial: {
        currency_symbol: 'S/.',
        decimal_places: 2,
        thousand_separator: ',',
        update_interval: 30000 // 30 segundos
    }
};

// 🚀 Inicializar configuración
console.log('⚙️ Configuración GRIZALUM cargada:', window.GRIZALUM_CONFIG.version);
// Al final de tu config.js, después de la línea del console.log, agrega:

// 🔗 CONEXIÓN CON SISTEMA DE DATOS DINÁMICOS
window.addEventListener('DOMContentLoaded', () => {
    // Conectar configuración con sistema de empresas cuando esté listo
    setTimeout(() => {
        if (window.EMPRESAS_DATA && window.GRIZALUM_CONFIG) {
            console.log('🔗 Configuración conectada con sistema de datos');
        }
    }, 1000);
});
