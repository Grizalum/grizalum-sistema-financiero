/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - VISUALIZACIÓN DE GRÁFICOS
 * Sistema de gráficos para Flujo de Caja
 * Versión: 2.3 - MEJOR CONTRASTE - Optimizado para 3 modos visuales
 * ═══════════════════════════════════════════════════════════════════
 */

class VisualizadorGraficos {
    constructor() {
        this.graficoDona = null;
        this.graficoBarras = null;
        this.chartJSCargado = false;
        
        console.log('📊 [Gráficos v2.3] Inicializado con soporte multi-tema');
    }

    /**
     * Detecta el modo visual actual de la aplicación
     * @returns {string} 'claro', 'oscuro', o 'nocturno'
     */
    detectarModoVisual() {
        const body = document.body;
        
        if (body.classList.contains('modo-oscuro')) {
            return 'oscuro';
        } else if (body.classList.contains('modo-nocturno')) {
            return 'nocturno';
        } else {
            return 'claro';
        }
    }

    /**
     * Obtiene la paleta de colores según el modo visual
     */
    obtenerPaletaColores(modo) {
        const paletas = {
            claro: {
                // Modo claro (fondo blanco)
                textoTitulo: '#111827',
                textoPrincipal: '#1f2937',
                textoSecundario: '#4b5563',
                textoTerciario: '#6b7280',
                ingresos: '#059669',      // Verde más oscuro
                gastos: '#dc2626',        // Rojo más oscuro
                barras: ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#0d9488'],
                gridLineas: 'rgba(0,0,0,0.08)',
                tooltipBg: 'rgba(255, 255, 255, 0.98)',
                tooltipTexto: '#111827',
                tooltipBorde: '#e5e7eb'
            },
            oscuro: {
                // Modo oscuro (fondo gris oscuro/negro)
                textoTitulo: '#f9fafb',
                textoPrincipal: '#f3f4f6',
                textoSecundario: '#d1d5db',
                textoTerciario: '#9ca3af',
                ingresos: '#10b981',      // Verde brillante
                gastos: '#ef4444',        // Rojo brillante
                barras: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6'],
                gridLineas: 'rgba(255,255,255,0.06)',
                tooltipBg: 'rgba(17, 24, 39, 0.98)',
                tooltipTexto: '#f9fafb',
                tooltipBorde: '#374151'
            },
            nocturno: {
                // Modo nocturno (similar a oscuro pero con tonos más suaves)
                textoTitulo: '#f9fafb',
                textoPrincipal: '#f3f4f6',
                textoSecundario: '#d1d5db',
                textoTerciario: '#9ca3af',
                ingresos: '#10b981',
                gastos: '#ef4444',
                barras: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6'],
                gridLineas: 'rgba(255,255,255,0.05)',
                tooltipBg: 'rgba(17, 24, 39, 0.98)',
                tooltipTexto: '#f9fafb',
                tooltipBorde: '#374151'
            }
        };

        return paletas[modo] || paletas.oscuro;
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

            // 3. Esperar a que FlujoCaja esté listo
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

            // 6. Detectar modo visual
            const modoVisual = this.detectarModoVisual();
            console.log('📊 [Gráficos] Modo visual:', modoVisual);
            console.log('📊 [Gráficos] Datos leídos:', { 
                ingresos: totalIngresos, 
                gastos: totalGastos,
                categorias: top5.length,
                transaccionesTotales: window.flujoCaja.transacciones.length
            });

            // 7. Validar que haya datos
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

            // 8. Crear estructura HTML con colores adaptados
            const colores = this.obtenerPaletaColores(modoVisual);
            container.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 20px; min-height: 320px;">
                    <!-- COLUMNA 1: GRÁFICO DE DONA -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <h3 style="color: ${colores.textoPrincipal}; font-size: 15px; font-weight: 700; margin: 0 0 15px 0; text-align: center;">
                            💰 Composición Financiera
                        </h3>
                        <div style="width: 260px; height: 260px;">
                            <canvas id="canvasGraficoDona"></canvas>
                        </div>
                    </div>
                    
                    <!-- COLUMNA 2: GRÁFICO DE BARRAS -->
                    <div style="display: flex; flex-direction: column;">
                        <h3 style="color: ${colores.textoPrincipal}; font-size: 15px; font-weight: 700; margin: 0 0 15px 0; text-align: center;">
                            📊 Top 5 Categorías
                        </h3>
                        <div style="height: 260px;">
                            <canvas id="canvasGraficoBarras"></canvas>
                        </div>
                    </div>
                </div>
            `;

            // 9. Esperar un momento a que el DOM se actualice
            await new Promise(resolve => setTimeout(resolve, 100));

            // 10. Dibujar gráficos con la paleta de colores
            this.crearGraficoDona(totalIngresos, totalGastos, modoVisual, colores);
            
            // Solo crear gráfico de barras si hay categorías
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
                                size: 13,
                                weight: '700',
                                family: 'system-ui, -apple-system, sans-serif'
                            },
                            padding: 14,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 10,
                            boxHeight: 10
                        }
                    },
                    tooltip: {
                        backgroundColor: colores.tooltipBg,
                        titleColor: colores.tooltipTexto,
                        bodyColor: colores.tooltipTexto,
                        borderColor: colores.tooltipBorde,
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        titleFont: { weight: '700', size: 13 },
                        bodyFont: { size: 12 },
                        callbacks: {
                            label: (ctx) => {
                                const total = ingresos + gastos;
                                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                                return `  ${ctx.label}: S/ ${ctx.parsed.toLocaleString('es-PE')} (${pct}%)`;
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
                    
                    // Emoji
                    ctx.font = '28px system-ui';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💎', centerX, centerY - 12);
                    
                    // Texto
                    ctx.font = '700 12px system-ui';
                    ctx.fillStyle = colores.textoSecundario;
                    ctx.fillText('6 Meses', centerX, centerY + 13);
                    
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
        
        // Destruir anterior
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
                    borderRadius: 6,
                    barThickness: 26
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colores.tooltipBg,
                        titleColor: colores.tooltipTexto,
                        bodyColor: colores.tooltipTexto,
                        borderColor: colores.tooltipBorde,
                        borderWidth: 1,
                        padding: 12,
                        titleFont: { weight: '700', size: 13 },
                        bodyFont: { size: 12 },
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
                                size: 11,
                                weight: '600',
                                family: 'system-ui, -apple-system, sans-serif'
                            },
                            padding: 6,
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
                                size: 13,
                                weight: '700',
                                family: 'system-ui, -apple-system, sans-serif'
                            },
                            padding: 10,
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

// Evento cuando FlujoCaja está inicializado
document.addEventListener('grizalumFlujoCajaInicializado', () => {
    console.log('✅ [Gráficos] FlujoCaja inicializado - Datos disponibles');
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

// 🆕 NUEVO: Escuchar cambio de modo visual
document.addEventListener('grizalumCambioTema', () => {
    console.log('🎨 [Gráficos] Cambio de tema detectado, redibujando...');
    setTimeout(() => window.visualizadorGraficos.actualizar(), 200);
});

// También escuchar click en botones de tema (si existen)
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

// Iniciar observador cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observarCambiosTema);
} else {
    observarCambiosTema();
}

console.log('✅ [Gráficos v2.3 MULTI-TEMA] Módulo cargado - ' + new Date().toISOString());
