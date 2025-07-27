/**
 * GRIZALUM - Configuración Central
 * Configuración unificada para toda la aplicación
 */

export const GRIZALUM_CONFIG = {
    // Versión del sistema
    version: '2.0.0',
    
    // Configuración de gráficos
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
            font: {
                family: 'Inter, sans-serif'
            }
        }
    },
    
    // Configuración de empresas
    companies: {
        default: 'fundicion-laguna',
        dataKeys: ['cashFlow', 'revenue', 'expenses', 'profit']
    },
    
    // Configuración de módulos
    modules: {
        ai: { enabled: true, endpoint: '/api/ai' },
        notifications: { enabled: true, maxCount: 10 },
        themes: { enabled: true, persistent: true }
    }
};
