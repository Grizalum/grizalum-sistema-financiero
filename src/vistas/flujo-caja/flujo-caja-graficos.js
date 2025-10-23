/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - VISUALIZACIÓN DE GRÁFICOS
 * Sistema de gráficos para Flujo de Caja
 * Versión: 2.1 - FIXED - Espera inicialización completa
 * ═══════════════════════════════════════════════════════════════════
 */

class VisualizadorGraficos {
    constructor() {
        this.graficoDona = null;
        this.graficoBarras = null;
        this.chartJSCargado = false;
        
        console.log('📊 [Gráficos v2.1] Inicializado');
    }

    async dibujarGraficos() {
        console.log('🎨 [Gráficos] Iniciando dibujo...');
        
        try {
            // 1. Verificar que exista el contenedor
            const container = document.querySelector('#seccionGraficos .graficos-contenedor');
            if (!container) {
                console.warn('⚠️ [Gráficos] Contenedor no encontrado');
                return false;
            }

            // 2. Cargar Chart.js si no está
            if (typeof Chart === 'undefined') {
                console.log('📦 [Gráficos] Cargando Chart.js...');
                await this.cargarChartJS();
            }

            // 3. 🔧 NUEVO: Esperar a que FlujoCaja esté listo
            if (!window.flujoCaja) {
                console.error('❌ [Gráficos] flujoCaja no disponible');
                return false;
            }

            if (!window.flujoCaja.estaListo()) {
                console.log('⏳ [Gráficos] Esperando a que FlujoCaja termine de cargar...');
                await window.flujoCaja.esperarInicializacion();
                console.log('✅ [Gráficos] FlujoCaja listo, continuando...');
            }

            // 4. Obtener datos
            const datos = window.flujoCaja.calcularPorMes(6);
            const totalIngresos = datos.reduce((sum, d) => sum + d.ingresos, 0);
            const totalGastos = datos.reduce((sum, d) => sum + d.gastos, 0);
            
            // 5. Obtener categorías
            const porCategoria = window.flujoCaja.calcularPorCategoria();
            const top5 = porCategoria.sort((a, b) => b.monto - a.monto).slice(0, 5);

            console.log('📊 [Gráficos] Datos leídos:', { 
                ingresos: totalIngresos, 
                gastos: totalGastos,
                categorias: top5.length,
                transaccionesTotales: window.flujoCaja.transacciones.length
            });

            // 6. Validar que haya datos
            if (totalIngresos === 0 && totalGastos === 0 && top5.length === 0) {
                console.warn('⚠️ [Gráficos] No hay datos para mostrar');
                container.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; min-height: 320px;">
                        <div style="font-size: 64px; margin-bottom: 20px;">📊</div>
                        <h3 style="color: #9ca3af; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                            Sin datos para mostrar
                        </h3>
                        <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center; max-width: 400px;">
                            Agrega tu primera transacción para ver los gráficos
                        </p>
                    </div>
                `;
                return false;
            }

            // 7. Crear estructura HTML
            container.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 20px; min-height: 320px;">
                    <!-- COLUMNA 1: GRÁFICO DE DONA -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <h3 style="color: #f3f4f6; font-size: 14px; font-weight: 700; margin: 0 0 15px 0; text-align: center;">
                            💰 Composición Financiera
                        </h3>
                        <div style="width: 260px; height: 260px;">
                            <canvas id="canvasGraficoDona"></canvas>
                        </div>
                    </div>
                    
                    <!-- COLUMNA 2: GRÁFICO DE BARRAS -->
                    <div style="display: flex; flex-direction: column;">
                        <h3 style="color: #f3f4f6; font-size: 14px; font-weight: 700; margin: 0 0 15px 0; text-align: center;">
                            📊 Top 5 Categorías
                        </h3>
                        <div style="height: 260px;">
                            <canvas id="canvasGraficoBarras"></canvas>
                        </div>
                    </div>
                </div>
            `;

            // 8. Esperar un momento a que el DOM se actualice
            await new Promise(resolve => setTimeout(resolve, 100));

            // 9. Dibujar gráficos
            const isDark = document.body.classList.contains('modo-oscuro');
            
            this.crearGraficoDona(totalIngresos, totalGastos, isDark);
            
            // Solo crear gráfico de barras si hay categorías
            if (top5.length > 0) {
                this.crearGraficoBarras(top5, isDark);
            }

            console.log('✅ [Gráficos] Creados exitosamente');
            return true;

        } catch (error) {
            console.error('❌ [Gráficos] Error:', error);
            return false;
        }
    }

    crearGraficoDona(ingresos, gastos, isDark) {
        const canvas = document.getElementById('canvasGraficoDona');
        if (!canvas) {
            console.error('❌ Canvas dona no encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        // Destruir anterior
        if (this.graficoDona) {
            this.graficoDona.destroy();
        }

        this.graficoDona = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Ingresos', 'Gastos'],
                datasets: [{
                    data: [ingresos, gastos],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0,
                    spacing: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '68%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: isDark ? '#f3f4f6' : '#1f2937',
                            font: { size: 12, weight: '600' },
                            padding: 12,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#e5e7eb',
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: (ctx) => {
                                const total = ingresos + gastos;
                                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                                return `  ${ctx.label}: S/. ${ctx.parsed.toLocaleString('es-PE')} (${pct}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    // Verificar que chartArea exista
                    if (!chart.chartArea) return;
                    
                    const ctx = chart.ctx;
                    const { left, right, top, bottom } = chart.chartArea;
                    
                    ctx.save();
                    const centerX = (left + right) / 2;
                    const centerY = (top + bottom) / 2;
                    
                    // Emoji
                    ctx.font = '26px system-ui';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💎', centerX, centerY - 12);
                    
                    // Texto
                    ctx.font = '500 11px system-ui';
                    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
                    ctx.fillText('6 Meses', centerX, centerY + 13);
                    
                    ctx.restore();
                }
            }]
        });

        console.log('✅ Gráfico de dona creado');
    }

    crearGraficoBarras(categorias, isDark) {
        const canvas = document.getElementById('canvasGraficoBarras');
        if (!canvas) {
            console.error('❌ Canvas barras no encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        // Destruir anterior
        if (this.graficoBarras) {
            this.graficoBarras.destroy();
        }

        const colores = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6'];

        this.graficoBarras = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categorias.map(c => c.categoria),
                datasets: [{
                    label: 'Monto',
                    data: categorias.map(c => c.monto),
                    backgroundColor: colores.slice(0, categorias.length),
                    borderRadius: 5,
                    barThickness: 24
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#e5e7eb',
                        padding: 12,
                        callbacks: {
                            label: (ctx) => {
                                const cat = categorias[ctx.dataIndex];
                                return [
                                    `Monto: S/. ${ctx.parsed.x.toLocaleString('es-PE')}`,
                                    `Movimientos: ${cat.cantidad}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: isDark ? '#9ca3af' : '#6b7280',
                            font: { size: 10 },
                            callback: (v) => v >= 1000 ? `S/. ${(v/1000).toFixed(0)}k` : `S/. ${v}`
                        },
                        grid: {
                            color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        },
                        border: { display: false }
                    },
                    y: {
                        ticks: {
                            color: isDark ? '#f3f4f6' : '#1f2937',
                            font: { size: 12, weight: '600' },
                            padding: 8
                        },
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        console.log('✅ Gráfico de barras creado');
    }

    async cargarChartJS() {
        if (this.chartJSCargado) return;
        
        return new Promise((resolve, reject) => {
            // Verificar si ya existe
            if (typeof Chart !== 'undefined') {
                this.chartJSCargado = true;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            script.onload = () => {
                this.chartJSCargado = true;
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
        console.log('🔄 [Gráficos] Actualizando...');
        this.dibujarGraficos();
    }
}

// ═══════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════

window.visualizadorGraficos = new VisualizadorGraficos();

// Evento: Vista visible
window.addEventListener('flujoCajaVisible', () => {
    console.log('👁️ [Gráficos] Vista visible detectada');
    setTimeout(() => {
        window.visualizadorGraficos.dibujarGraficos();
    }, 500);
});

// 🆕 NUEVO: Evento cuando FlujoCaja está inicializado
document.addEventListener('grizalumFlujoCajaInicializado', () => {
    console.log('✅ [Gráficos] FlujoCaja inicializado - Datos disponibles');
    // Si la vista de gráficos está visible, dibujarlos
    if (document.getElementById('seccionGraficos')) {
        setTimeout(() => window.visualizadorGraficos.dibujarGraficos(), 300);
    }
});

// Eventos: Actualizar al modificar transacciones
const eventos = ['grizalumTransaccionAgregada', 'grizalumTransaccionEditada', 'grizalumTransaccionEliminada'];
eventos.forEach(evento => {
    document.addEventListener(evento, () => {
        console.log(`📝 [Gráficos] Evento ${evento}`);
        setTimeout(() => window.visualizadorGraficos.actualizar(), 300);
    });
});

console.log('✅ [Gráficos v2.1 FIXED] Módulo cargado - ' + new Date().toISOString());
