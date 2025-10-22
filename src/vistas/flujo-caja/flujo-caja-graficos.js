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
        console.log('🎨 Dibujando gráfico profesional...');
        
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
        const totalIngresos = datos.reduce((sum, d) => sum + d.ingresos, 0);
        const totalGastos = datos.reduce((sum, d) => sum + d.gastos, 0);
        const balance = totalIngresos - totalGastos;

        // Crear contenedor con layout de dos columnas
        const container = canvas.parentElement;
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: center; padding: 20px;">
                <!-- COLUMNA IZQUIERDA: GRÁFICO -->
                <div style="display: flex; justify-content: center; align-items: center;">
                    <canvas id="graficoDonaCanvas" style="max-width: 320px; max-height: 320px;"></canvas>
                </div>
                
                <!-- COLUMNA DERECHA: DESGLOSE -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- Balance Total -->
                    <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%); 
                                border-radius: 16px; padding: 24px; border: 2px solid rgba(59, 130, 246, 0.3);">
                        <div style="font-size: 13px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                            💎 Balance Total
                        </div>
                        <div style="font-size: 36px; font-weight: 800; color: ${balance >= 0 ? '#10b981' : '#ef4444'}; font-family: system-ui; line-height: 1.2;">
                            S/. ${balance.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </div>
                        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                            ${balance >= 0 ? '✅ Saldo positivo' : '⚠️ Saldo negativo'}
                        </div>
                    </div>
                    
                    <!-- Ingresos -->
                    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%); 
                                border-radius: 14px; padding: 20px; border: 2px solid rgba(16, 185, 129, 0.25);">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: #10b981;"></div>
                            <div style="font-size: 13px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">
                                Ingresos
                            </div>
                        </div>
                        <div style="font-size: 28px; font-weight: 700; color: #f3f4f6; font-family: system-ui; margin-bottom: 6px;">
                            S/. ${totalIngresos.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="font-size: 12px; color: #6b7280;">
                                ${datos.filter(d => d.ingresos > 0).length} meses con ingresos
                            </div>
                            <div style="font-size: 16px; font-weight: 700; color: #10b981;">
                                ${((totalIngresos / (totalIngresos + totalGastos)) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                    
                    <!-- Gastos -->
                    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 100%); 
                                border-radius: 14px; padding: 20px; border: 2px solid rgba(239, 68, 68, 0.25);">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></div>
                            <div style="font-size: 13px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">
                                Gastos
                            </div>
                        </div>
                        <div style="font-size: 28px; font-weight: 700; color: #f3f4f6; font-family: system-ui; margin-bottom: 6px;">
                            S/. ${totalGastos.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="font-size: 12px; color: #6b7280;">
                                ${datos.filter(d => d.gastos > 0).length} meses con gastos
                            </div>
                            <div style="font-size: 16px; font-weight: 700; color: #ef4444;">
                                ${((totalGastos / (totalIngresos + totalGastos)) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Crear gráfico de dona
        const canvasDona = document.getElementById('graficoDonaCanvas');
        const ctx = canvasDona.getContext('2d');

        const isDark = document.body.classList.contains('modo-oscuro');
        const colores = {
            texto: isDark ? '#f3f4f6' : '#1f2937',
            subtexto: isDark ? '#9ca3af' : '#6b7280'
        };

        this.graficoActual = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Ingresos', 'Gastos'],
                datasets: [{
                    data: [totalIngresos, totalGastos],
                    backgroundColor: [this.colores.ingresos, this.colores.gastos],
                    borderWidth: 0,
                    spacing: 4,
                    hoverOffset: 12,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '65%',
                layout: {
                    padding: 15
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Composición Financiera',
                        color: colores.texto,
                        font: { 
                            size: 16, 
                            weight: '700',
                            family: 'system-ui, -apple-system, sans-serif'
                        },
                        padding: { bottom: 15 }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(17, 24, 39, 0.98)',
                        titleColor: '#ffffff',
                        bodyColor: '#e5e7eb',
                        borderColor: 'rgba(75, 85, 99, 0.5)',
                        borderWidth: 1,
                        padding: 16,
                        titleFont: { size: 15, weight: '700' },
                        bodyFont: { size: 14, weight: '600' },
                        displayColors: true,
                        boxWidth: 14,
                        boxHeight: 14,
                        boxPadding: 6,
                        callbacks: {
                            label: (ctx) => {
                                const value = ctx.parsed;
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                const valorFormateado = value.toLocaleString('es-PE', {
                                    style: 'currency',
                                    currency: 'PEN'
                                });
                                return `  ${ctx.label}: ${valorFormateado} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: false,
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
                    ctx.font = '32px system-ui';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💰', centerX, centerY - 20);
                    
                    // Label
                    ctx.font = '600 13px system-ui';
                    ctx.fillStyle = colores.subtexto;
                    ctx.fillText('Últimos 6 Meses', centerX, centerY + 15);
                    
                    ctx.restore();
                }
            }]
        });

        console.log('✅ Gráfico profesional creado');
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
