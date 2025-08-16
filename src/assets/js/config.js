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
