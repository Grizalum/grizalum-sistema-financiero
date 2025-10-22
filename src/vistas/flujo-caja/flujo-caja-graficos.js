/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - VISUALIZACIÓN DE GRÁFICOS PROFESIONAL
 * Sistema de gráficos premium para Flujo de Caja
 * ═══════════════════════════════════════════════════════════════════
 */

class VisualizadorGraficos {
    constructor() {
        this.graficoActual = null;
        this.colores = {
            ingresos: '#10b981',
            gastos: '#ef4444',
            ingresosLight: '#34d399',
            gastosLight: '#f87171',
            balance: '#3b82f6'
        };
        
        console.log('📊 Visualizador de Gráficos inicializado');
    }

    async dibujarGraficoMensual() {
    console.log('🎨 Dibujando gráficos profesionales...');
    
    const canvas = document.getElementById('graficoMensual');
    if (!canvas) {
        console.warn('⚠️ Canvas no encontrado');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.log('📦 Cargando Chart.js...');
        await this.cargarChartJS();
    }

    if (this.graficoActual) {
        this.graficoActual.destroy();
    }

    // Obtener datos
    const datos = window.flujoCaja.calcularPorMes(6);
    const totalIngresos = datos.reduce((sum, d) => sum + d.ingresos, 0);
    const totalGastos = datos.reduce((sum, d) => sum + d.gastos, 0);

    // Obtener top 5 categorías
    const porCategoria = window.flujoCaja.calcularPorCategoria();
    const top5Categorias = porCategoria
        .sort((a, b) => b.monto - a.monto)
        .slice(0, 5);

    // Crear contenedor con dos gráficos
    const container = canvas.parentElement;
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 20px;">
            <!-- GRÁFICO DE DONA -->
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <h3 style="color: #f3f4f6; font-size: 15px; font-weight: 700; margin-bottom: 20px; text-align: center;">
                    Composición Financiera
                </h3>
                <canvas id="graficoDonaCanvas" style="max-width: 280px; max-height: 280px;"></canvas>
            </div>
            
            <!-- GRÁFICO DE BARRAS HORIZONTALES -->
            <div style="display: flex; flex-direction: column;">
                <h3 style="color: #f3f4f6; font-size: 15px; font-weight: 700; margin-bottom: 20px; text-align: center;">
                    Top 5 Categorías por Movimiento
                </h3>
                <canvas id="graficoBarrasCanvas" style="height: 280px;"></canvas>
            </div>
        </div>
    `;

    const isDark = document.body.classList.contains('modo-oscuro');
    const colores = {
        texto: isDark ? '#f3f4f6' : '#1f2937',
        subtexto: isDark ? '#9ca3af' : '#6b7280'
    };

    // ==========================================
    // GRÁFICO DE DONA
    // ==========================================
    const canvasDona = document.getElementById('graficoDonaCanvas');
    const ctxDona = canvasDona.getContext('2d');

    this.graficoActual = new Chart(ctxDona, {
        type: 'doughnut',
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                data: [totalIngresos, totalGastos],
                backgroundColor: [this.colores.ingresos, this.colores.gastos],
                borderWidth: 0,
                spacing: 4,
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            layout: { padding: 10 },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: colores.texto,
                        font: { size: 13, weight: '600' },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10,
                        generateLabels: (chart) => {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return {
                                    text: `${label} (${percentage}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.98)',
                    titleColor: '#ffffff',
                    bodyColor: '#e5e7eb',
                    borderColor: 'rgba(75, 85, 99, 0.5)',
                    borderWidth: 1,
                    padding: 14,
                    titleFont: { size: 14, weight: '700' },
                    bodyFont: { size: 13, weight: '600' },
                    callbacks: {
                        label: (ctx) => {
                            const value = ctx.parsed;
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `  ${ctx.label}: S/. ${value.toLocaleString('es-PE')} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                duration: 1400,
                easing: 'easeInOutQuart'
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: (chart) => {
                const { ctx, chartArea: { left, right, top, bottom } } = chart;
                ctx.save();
                
                const centerX = (left + right) / 2;
                const centerY = (top + bottom) / 2;
                
                // Icono
                ctx.font = '28px system-ui';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💰', centerX, centerY - 15);
                
                // Label
                ctx.font = '600 12px system-ui';
                ctx.fillStyle = colores.subtexto;
                ctx.fillText('Últimos 6 Meses', centerX, centerY + 15);
                
                ctx.restore();
            }
        }]
    });

    // ==========================================
    // GRÁFICO DE BARRAS HORIZONTALES
    // ==========================================
    const canvasBarras = document.getElementById('graficoBarrasCanvas');
    const ctxBarras = canvasBarras.getContext('2d');

    // Colores dinámicos para cada categoría
    const coloresCategorias = [
        '#3b82f6', // Azul
        '#8b5cf6', // Púrpura
        '#ec4899', // Rosa
        '#f59e0b', // Ámbar
        '#14b8a6'  // Teal
    ];

    new Chart(ctxBarras, {
        type: 'bar',
        data: {
            labels: top5Categorias.map(c => c.categoria),
            datasets: [{
                label: 'Monto Total',
                data: top5Categorias.map(c => c.monto),
                backgroundColor: coloresCategorias,
                borderRadius: 6,
                barThickness: 28
            }]
        },
        options: {
            indexAxis: 'y', // Barras horizontales
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { left: 10, right: 20, top: 5, bottom: 5 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.98)',
                    titleColor: '#ffffff',
                    bodyColor: '#e5e7eb',
                    borderColor: 'rgba(75, 85, 99, 0.5)',
                    borderWidth: 1,
                    padding: 14,
                    titleFont: { size: 14, weight: '700' },
                    bodyFont: { size: 13, weight: '600' },
                    callbacks: {
                        title: (items) => items[0].label,
                        label: (ctx) => {
                            const categoria = top5Categorias[ctx.dataIndex];
                            return [
                                `Monto: S/. ${ctx.parsed.x.toLocaleString('es-PE')}`,
                                `Transacciones: ${categoria.cantidad}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: colores.subtexto,
                        font: { size: 11, weight: '500' },
                        callback: (value) => {
                            if (value >= 1000) return 'S/. ' + (value/1000).toFixed(0) + 'k';
                            return 'S/. ' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    border: { display: false }
                },
                y: {
                    ticks: {
                        color: colores.texto,
                        font: { size: 13, weight: '600' },
                        padding: 10
                    },
                    grid: { display: false },
                    border: { display: false }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeInOutQuart',
                delay: (ctx) => ctx.dataIndex * 100
            }
        }
    });

    console.log('✅ Gráficos profesionales creados');
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

console.log('✅ Módulo de gráficos premium cargado');
