/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - VISUALIZACIÓN DE GRÁFICOS
 * Sistema de gráficos para Flujo de Caja
 * Versión: 3.0 - TEXTOS LEGIBLES + SOPORTE THEME-PURPLE
 * 
 * ✅ CORRECCIONES APLICADAS:
 * - Soporte para theme-purple (tu tema actual)
 * - Textos más grandes (16px para categorías, 13px para valores)
 * - Colores con mejor contraste
 * - Configuración optimizada para pantallas HD
 * ═══════════════════════════════════════════════════════════════════
 */

class VisualizadorGraficos {
    constructor() {
        this.graficoDona = null;
        this.graficoBarras = null;
        this.chartJSCargado = false;
        
        console.log('📊 [Gráficos v3.0 MEJORADO] Inicializado');
    }

    detectarModoVisual() {
        const body = document.body;
        
        // ✅ NUEVO: Detectar theme-purple
        if (body.classList.contains('theme-purple')) {
            return 'theme-purple';
        }
        
        if (body.classList.contains('modo-neutro')) {
            return 'neutro';
        } else if (body.classList.contains('modo-claro')) {
            return 'claro';
        } else if (body.classList.contains('modo-oscuro')) {
            return 'oscuro';
        }
        
        // ✅ Por defecto usar theme-purple si no encuentra nada
        return 'theme-purple';
    }

    obtenerPaletaColores(modo) {
        const paletas = {
            // ✅ NUEVO: Paleta para theme-purple (tu tema actual)
            'theme-purple': {
                textoTitulo: '#ffffff',
                textoPrincipal: '#ffffff',
                textoSecundario: '#e9d5ff',
                textoTerciario: '#d8b4fe',
                ingresos: '#34d399',
                gastos: '#f87171',
                barras: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'],  
                gridLineas: 'rgba(255,255,255,0.1)',
                tooltipBg: 'rgba(17, 24, 39, 0.98)',
                tooltipTexto: '#ffffff',
                tooltipBorde: '#8b5cf6'
            },
            claro: {
                textoTitulo: '#111827',
                textoPrincipal: '#1f2937',
                textoSecundario: '#374151',
                textoTerciario: '#4b5563',
                ingresos: '#059669',
                gastos: '#dc2626',
                barras: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'],
                gridLineas: 'rgba(0,0,0,0.15)',
                tooltipBg: 'rgba(255, 255, 255, 0.98)',
                tooltipTexto: '#111827',
                tooltipBorde: '#e5e7eb'
            },
            oscuro: {
                textoTitulo: '#ffffff',
                textoPrincipal: '#f9fafb',
                textoSecundario: '#e5e7eb',
                textoTerciario: '#d1d5db',
                ingresos: '#10b981',
                gastos: '#ef4444',
               barras: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'],
                gridLineas: 'rgba(255,255,255,0.15)',
                tooltipBg: 'rgba(17, 24, 39, 0.98)',
                tooltipTexto: '#f9fafb',
                tooltipBorde: '#4b5563'
            },
            neutro: {
                textoTitulo: '#ffffff',
                textoPrincipal: '#ffffff',
                textoSecundario: '#f3f4f6',
                textoTerciario: '#e5e7eb',
                ingresos: '#34d399',
                gastos: '#f87171',
                barras: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'],
                gridLineas: 'rgba(255,255,255,0.12)',
                tooltipBg: 'rgba(0, 0, 0, 0.95)',
                tooltipTexto: '#ffffff',
                tooltipBorde: '#6b7280'
            }
        };

        return paletas[modo] || paletas['theme-purple'];
    }

    async dibujarGraficos() {
        console.log('🎨 [Gráficos] Iniciando dibujo...');
        
        try {
            const container = document.querySelector('#seccionGraficos .graficos-contenedor');
            if (!container) {
                console.warn('⚠️ [Gráficos] Contenedor no encontrado');
                return false;
            }

            if (typeof Chart === 'undefined') {
                console.log('📦 [Gráficos] Cargando Chart.js...');
                await this.cargarChartJS();
            }

            if (!window.flujoCaja) {
                console.error('❌ [Gráficos] flujoCaja no disponible');
                return false;
            }

            if (!window.flujoCaja.estaListo()) {
                console.log('⏳ [Gráficos] Esperando a que FlujoCaja termine de cargar...');
                await window.flujoCaja.esperarInicializacion();
                console.log('✅ [Gráficos] FlujoCaja listo, continuando...');
            }

            const datos = window.flujoCaja.calcularPorMes(6);
            const totalIngresos = datos.reduce((sum, d) => sum + d.ingresos, 0);
            const totalGastos = datos.reduce((sum, d) => sum + d.gastos, 0);
            
            const porCategoria = window.flujoCaja.calcularPorCategoria();
            const top5 = porCategoria.sort((a, b) => b.monto - a.monto).slice(0, 5);

            const modoVisual = this.detectarModoVisual();
            console.log('📊 [Gráficos] Modo visual:', modoVisual);
            console.log('📊 [Gráficos] Datos leídos:', { 
                ingresos: totalIngresos, 
                gastos: totalGastos,
                categorias: top5.length,
                transaccionesTotales: window.flujoCaja.transacciones.length
            });

            if (totalIngresos === 0 && totalGastos === 0 && top5.length === 0) {
                console.warn('⚠️ [Gráficos] No hay datos para mostrar');
                const colores = this.obtenerPaletaColores(modoVisual);
                container.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; min-height: 320px;">
                        <div style="font-size: 64px; margin-bottom: 20px;">📊</div>
                        <h3 style="color: ${colores.textoSecundario}; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                            Sin datos para mostrar
                        </h3>
                        <p style="color: ${colores.textoTerciario}; font-size: 14px; margin: 0; text-align: center; max-width: 400px;">
                            Agrega tu primera transacción para ver los gráficos
                        </p>
                    </div>
                `;
                return false;
            }

            const colores = this.obtenerPaletaColores(modoVisual);
            container.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 20px; min-height: 320px;">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <h3 style="color: ${colores.textoPrincipal}; font-size: 16px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">
                            💰 Composición Financiera
                        </h3>
                        <div style="width: 280px; height: 280px;">
                            <canvas id="canvasGraficoDona"></canvas>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column;">
                        <h3 style="color: ${colores.textoPrincipal}; font-size: 16px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">
                            📊 Top 5 Categorías
                        </h3>
                        <div style="height: 280px;">
                            <canvas id="canvasGraficoBarras"></canvas>
                        </div>
                    </div>
                </div>
            `;

            await new Promise(resolve => setTimeout(resolve, 100));

            this.crearGraficoDona(totalIngresos, totalGastos, modoVisual, colores);
            
            if (top5.length > 0) {
                this.crearGraficoBarras(top5, modoVisual, colores);
            }

            console.log('✅ [Gráficos] Creados exitosamente');
            return true;

        } catch (error) {
            console.error('❌ [Gráficos] Error:', error);
            return false;
        }
    }

    crearGraficoDona(ingresos, gastos, modo, colores) {
        const canvas = document.getElementById('canvasGraficoDona');
        if (!canvas) {
            console.error('❌ Canvas dona no encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        if (this.graficoDona) {
            this.graficoDona.destroy();
        }

        this.graficoDona = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Ingresos', 'Gastos'],
                datasets: [{
                    data: [ingresos, gastos],
                    backgroundColor: [colores.ingresos, colores.gastos],
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
                            color: colores.textoPrincipal,
                            font: {
                                size: 14,  // ✅ AUMENTADO de 12 a 14
                                weight: '700',
                                family: 'system-ui, -apple-system, sans-serif'
                            },
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: colores.tooltipBg,
                        titleColor: colores.tooltipTexto,
                        bodyColor: colores.tooltipTexto,
                        borderColor: colores.tooltipBorde,
                        borderWidth: 1,
                        padding: 14,
                        titleFont: { 
                            weight: '700', 
                            size: 14  // ✅ AUMENTADO de 13 a 14
                        },
                        bodyFont: { 
                            size: 13  // ✅ AUMENTADO de 12 a 13
                        },
                        callbacks: {
                            label: (ctx) => {
                                const total = ingresos + gastos;
                                const porcentaje = ((ctx.parsed / total) * 100).toFixed(1);
                                return `${ctx.label}: S/ ${ctx.parsed.toLocaleString('es-PE')} (${porcentaje}%)`;
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
                    if (!chart.chartArea) return;
                    
                    const ctx = chart.ctx;
                    const { left, right, top, bottom } = chart.chartArea;
                    
                    ctx.save();
                    const centerX = (left + right) / 2;
                    const centerY = (top + bottom) / 2;
                    
                    ctx.font = '32px system-ui';  // ✅ AUMENTADO de 28px a 32px
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💎', centerX, centerY - 14);
                    
                    ctx.font = '700 13px system-ui';  // ✅ AUMENTADO de 12px a 13px
                    ctx.fillStyle = colores.textoSecundario;
                    ctx.fillText('6 Meses', centerX, centerY + 15);
                    
                    ctx.restore();
                }
            }]
        });

        console.log('✅ Gráfico de dona creado');
    }

    crearGraficoBarras(categorias, modo, colores) {
        const canvas = document.getElementById('canvasGraficoBarras');
        if (!canvas) {
            console.error('❌ Canvas barras no encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        if (this.graficoBarras) {
            this.graficoBarras.destroy();
        }

        this.graficoBarras = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categorias.map(c => c.categoria),
                datasets: [{
                    label: 'Monto',
                    data: categorias.map(c => c.monto),
                    backgroundColor: colores.barras.slice(0, categorias.length),
                    borderRadius: 8,  // ✅ AUMENTADO de 6 a 8
                    barThickness: 32  // ✅ AUMENTADO de 26 a 32
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 20,
                        top: 10,
                        bottom: 10
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colores.tooltipBg,
                        titleColor: colores.tooltipTexto,
                        bodyColor: colores.tooltipTexto,
                        borderColor: colores.tooltipBorde,
                        borderWidth: 1,
                        padding: 14,
                        titleFont: { 
                            weight: '700', 
                            size: 14  // ✅ AUMENTADO de 13 a 14
                        },
                        bodyFont: { 
                            size: 13  // ✅ AUMENTADO de 12 a 13
                        },
                        callbacks: {
                            label: (ctx) => {
                                const cat = categorias[ctx.dataIndex];
                                return [
                                    `Monto: S/ ${ctx.parsed.x.toLocaleString('es-PE')}`,
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
                            color: colores.textoTerciario,
                            font: { 
                                size: 13,  // ✅ AUMENTADO de 11 a 13
                                weight: '600',
                                family: 'system-ui, -apple-system, sans-serif'
                            },
                            padding: 8,
                            callback: (v) => v >= 1000 ? `S/ ${(v/1000).toFixed(0)}k` : `S/ ${v}`
                        },
                        grid: {
                            color: colores.gridLineas,
                            drawBorder: false,
                            lineWidth: 1
                        },
                        border: { display: false }
                    },
                    y: {
                        ticks: {
                            color: colores.textoPrincipal,
                            font: { 
                                size: 16,  // ✅ AUMENTADO de 14 a 16 (CLAVE PARA LEGIBILIDAD)
                                weight: '700',
                                family: 'system-ui, -apple-system, sans-serif'
                            },
                            padding: 12,  // ✅ AUMENTADO de 10 a 12
                            autoSkip: false
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

window.visualizadorGraficos = new VisualizadorGraficos();

window.addEventListener('flujoCajaVisible', () => {
    console.log('👁️ [Gráficos] Vista visible detectada');
    setTimeout(() => {
        window.visualizadorGraficos.dibujarGraficos();
    }, 500);
});

document.addEventListener('grizalumFlujoCajaInicializado', () => {
    console.log('✅ [Gráficos] FlujoCaja inicializado - Datos disponibles');
    if (document.getElementById('seccionGraficos')) {
        setTimeout(() => window.visualizadorGraficos.dibujarGraficos(), 300);
    }
});

const eventos = ['grizalumTransaccionAgregada', 'grizalumTransaccionEditada', 'grizalumTransaccionEliminada'];
eventos.forEach(evento => {
    document.addEventListener(evento, () => {
        console.log(`📝 [Gráficos] Evento ${evento}`);
        setTimeout(() => window.visualizadorGraficos.actualizar(), 300);
    });
});

const observarCambiosTema = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && mutation.target === document.body) {
                console.log('🎨 [Gráficos] Clase del body cambió, redibujando...');
                setTimeout(() => window.visualizadorGraficos.actualizar(), 200);
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observarCambiosTema);
} else {
    observarCambiosTema();
}

console.log('✅ [Gráficos v3.0 THEME-PURPLE + TEXTOS GRANDES] Módulo cargado - ' + new Date().toISOString());
