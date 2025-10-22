/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - VISUALIZACIÓN DE GRÁFICOS
 * Sistema de gráficos para Flujo de Caja
 * ═══════════════════════════════════════════════════════════════════
 */

class VisualizadorGraficos {
    constructor() {
        this.graficoActual = null;
        this.colores = {
            ingresos: {
                fondo: 'rgba(16, 185, 129, 0.85)',
                borde: 'rgba(16, 185, 129, 1)',
                degradado: ['rgba(16, 185, 129, 0.9)', 'rgba(5, 150, 105, 0.7)']
            },
            gastos: {
                fondo: 'rgba(239, 68, 68, 0.85)',
                borde: 'rgba(239, 68, 68, 1)',
                degradado: ['rgba(239, 68, 68, 0.9)', 'rgba(220, 38, 38, 0.7)']
            },
            balance: {
                positivo: 'rgba(52, 211, 153, 1)',
                negativo: 'rgba(248, 113, 113, 1)'
            }
        };
        
        console.log('📊 Visualizador de Gráficos inicializado');
    }

    async dibujarGraficoMensual() {
        console.log('🎨 Dibujando gráfico mensual...');
        
        const canvas = document.getElementById('graficoMensual');
        if (!canvas) {
            console.warn('⚠️ Canvas no encontrado');
            return;
        }

        // Verificar Chart.js
        if (typeof Chart === 'undefined') {
            console.log('📦 Cargando Chart.js...');
            await this.cargarChartJS();
        }

        // Destruir gráfico anterior
        if (this.graficoActual) {
            this.graficoActual.destroy();
        }

        // Obtener datos
        const datos = window.flujoCaja.calcularPorMes(6);
        console.log('📊 Datos obtenidos:', datos);

        // Crear degradados
        const ctx = canvas.getContext('2d');
        
        const degradadoIngresos = ctx.createLinearGradient(0, 0, 0, 400);
        degradadoIngresos.addColorStop(0, this.colores.ingresos.degradado[0]);
        degradadoIngresos.addColorStop(1, this.colores.ingresos.degradado[1]);
        
        const degradadoGastos = ctx.createLinearGradient(0, 0, 0, 400);
        degradadoGastos.addColorStop(0, this.colores.gastos.degradado[0]);
        degradadoGastos.addColorStop(1, this.colores.gastos.degradado[1]);

        // Crear gráfico mejorado
        this.graficoActual = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datos.map(d => d.mes),
                datasets: [
                    {
                        label: '💰 Ingresos',
                        data: datos.map(d => d.ingresos),
                        backgroundColor: degradadoIngresos,
                        borderColor: this.colores.ingresos.borde,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderSkipped: false,
                        barThickness: 40,
                        maxBarThickness: 50
                    },
                    {
                        label: '💸 Gastos',
                        data: datos.map(d => d.gastos),
                        backgroundColor: degradadoGastos,
                        borderColor: this.colores.gastos.borde,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderSkipped: false,
                        barThickness: 40,
                        maxBarThickness: 50
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'center',
                        labels: {
                            color: '#f3f4f6',
                            font: { 
                                size: 14, 
                                weight: 'bold',
                                family: "'Inter', 'Segoe UI', sans-serif"
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                            boxWidth: 12,
                            boxHeight: 12
                        }
                    },
                    title: {
                        display: true,
                        text: '📈 Evolución Financiera - Últimos 6 Meses',
                        color: '#ffffff',
                        font: { 
                            size: 20, 
                            weight: 'bold',
                            family: "'Inter', 'Segoe UI', sans-serif"
                        },
                        padding: {
                            top: 15,
                            bottom: 25
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        titleColor: '#f9fafb',
                        bodyColor: '#e5e7eb',
                        borderColor: 'rgba(107, 114, 128, 0.3)',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: true,
                        boxWidth: 12,
                        boxHeight: 12,
                        usePointStyle: true,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y || 0;
                                return `${label}: S/. ${value.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                            },
                            footer: function(tooltipItems) {
                                const ingresos = tooltipItems[0]?.parsed.y || 0;
                                const gastos = tooltipItems[1]?.parsed.y || 0;
                                const balance = ingresos - gastos;
                                const simbolo = balance >= 0 ? '✅' : '⚠️';
                                return `${simbolo} Balance: S/. ${balance.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: '#d1d5db',
                            font: { 
                                size: 12,
                                weight: '500'
                            },
                            padding: 10,
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString('es-PE', {maximumFractionDigits: 0});
                            }
                        },
                        grid: { 
                            color: 'rgba(255, 255, 255, 0.08)',
                            drawBorder: false,
                            lineWidth: 1
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        ticks: { 
                            color: '#d1d5db',
                            font: { 
                                size: 13,
                                weight: '600'
                            },
                            padding: 10
                        },
                        grid: { 
                            display: false
                        },
                        border: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                }
            }
        });

        console.log('✅ Gráfico mensual dibujado');
    }

    async cargarChartJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            script.onload = () => {
                console.log('✅ Chart.js cargado');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Error cargando Chart.js');
                reject();
            };
            document.head.appendChild(script);
        });
    }

    actualizar() {
        console.log('🔄 Actualizando gráficos...');
        this.dibujarGraficoMensual();
    }
}

// Instancia global
window.visualizadorGraficos = new VisualizadorGraficos();

// Auto-inicializar cuando la vista esté lista
window.addEventListener('flujoCajaVisible', () => {
    setTimeout(() => {
        if (window.flujoCaja && document.getElementById('graficoMensual')) {
            window.visualizadorGraficos.dibujarGraficoMensual();
        }
    }, 800);
});

// Actualizar al agregar/editar/eliminar transacciones
['grizalumTransaccionAgregada', 'grizalumTransaccionEditada', 'grizalumTransaccionEliminada'].forEach(evento => {
    document.addEventListener(evento, () => {
        setTimeout(() => window.visualizadorGraficos.actualizar(), 400);
    });
});

console.log('✅ Módulo de gráficos cargado');
