// GRIZALUM - Gráficos Chart.js
// Sistema Financiero Empresarial

// Esperar a que Chart.js esté disponible
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js no está disponible');
        return;
    }
    
    initializeCharts();
});

function initializeCharts() {
    console.log('📊 Inicializando gráficos GRIZALUM');
    
    // Configuración global de Chart.js
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.color = '#64748b';
    
    // Inicializar cada gráfico
    initRevenueChart();
    initExpensesChart();
    initCashFlowChart();
    initAgingChart();
    initCashFlowDetailChart();
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Ingresos',
                data: [35000, 38000, 42000, 39000, 44000, 40300, 45200],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Gastos',
                data: [28000, 29500, 31000, 30200, 32500, 30200, 28700],
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        font: { weight: 'bold' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'S/. ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initExpensesChart() {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Operativos', 'Administrativos', 'Ventas', 'Financieros'],
            datasets: [{
                data: [12500, 8200, 5500, 2500],
                backgroundColor: [
                    '#059669',
                    '#3b82f6',
                    '#d4af37',
                    '#dc2626'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        font: { weight: 'bold' },
                        padding: 20
                    }
                }
            }
        }
    });
}

function initCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Proyección IA',
                data: [28000, 32000, 35000, 38000, 42000],
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: '#6366f1',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        font: { weight: 'bold' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'S/. ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initAgingChart() {
    const ctx = document.getElementById('agingChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0-30 días', '31-60 días', '61-90 días', '+90 días'],
            datasets: [{
                label: 'Monto (S/.)',
                data: [18200, 9800, 3200, 1600],
                backgroundColor: [
                    '#059669',
                    '#f59e0b',
                    '#d97706',
                    '#dc2626'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'S/. ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initCashFlowDetailChart() {
    const ctx = document.getElementById('cashFlowDetailChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1 Jul', '5 Jul', '10 Jul', '15 Jul', '20 Jul', '25 Jul', '30 Jul'],
            datasets: [{
                label: 'Saldo Diario',
                data: [15000, 18500, 22000, 17800, 21500, 19800, 24500],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#059669',
                pointBorderWidth: 3,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        font: { weight: 'bold' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'S/. ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

console.log('📈 GRIZALUM Charts.js cargado correctamente');
