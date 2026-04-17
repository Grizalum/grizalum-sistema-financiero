/**
 * ═══════════════════════════════════════════════════════════════════
 * BALANCE GENERAL - GRÁFICOS
 * Gráfico de dona (composición) y barras (estructura financiera)
 * Depende de: balance-general-config.js, Chart.js
 * v20260417
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    window.BalanceGeneralGraficos = {

        // Instancias activas de Chart.js
        instancias: {},

        // ─── Renderizar ambos gráficos ────────────────────────────────
        renderizar(resultados) {
            if (!resultados) return;

            // Si Chart.js aún no cargó, reintentar en 500ms
            if (typeof Chart === 'undefined') {
                console.warn('[BG-Graficos] Chart.js no disponible, reintentando...');
                setTimeout(() => this.renderizar(resultados), 500);
                return;
            }

            this._graficoComposicion(resultados);
            this._graficoEstructura(resultados);
        },

        // ─── Destruir instancia previa de un gráfico ──────────────────
        _destruir(nombre) {
            if (this.instancias[nombre]) {
                this.instancias[nombre].destroy();
                this.instancias[nombre] = null;
            }
        },

        // ─── Gráfico 1: Dona — Composición del Balance ────────────────
        _graficoComposicion(r) {
            const contenedor = document.getElementById('bgGraficoComposicion');
            if (!contenedor) return;

            this._destruir('composicion');

            // Crear canvas fresco
            contenedor.innerHTML = '<canvas id="bgCanvasComposicion"></canvas>';
            const canvas = document.getElementById('bgCanvasComposicion');
            if (!canvas) return;

            const cfg = window.BalanceGeneralConfig.colores;

            this.instancias.composicion = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: [
                        'Activos Corrientes',
                        'Activos No Corrientes',
                        'Pasivos Corrientes',
                        'Pasivos No Corrientes',
                        'Patrimonio'
                    ],
                    datasets: [{
                        data: [
                            r.activos.corrientes.total,
                            Math.max(r.activos.noCorrientes.total, 0),
                            r.pasivos.corrientes.total,
                            r.pasivos.noCorrientes.total,
                            Math.max(r.patrimonio.total, 0)
                        ],
                        backgroundColor: [
                            cfg.activosCorrientes.fondo,
                            cfg.activosNoCorrientes.fondo,
                            cfg.pasivosCorrientes.fondo,
                            cfg.pasivosNoCorrientes.fondo,
                            cfg.patrimonio.fondo
                        ],
                        borderColor: [
                            cfg.activosCorrientes.borde,
                            cfg.activosNoCorrientes.borde,
                            cfg.pasivosCorrientes.borde,
                            cfg.pasivosNoCorrientes.borde,
                            cfg.patrimonio.borde
                        ],
                        borderWidth: 2,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#94a3b8',
                                font: { size: 11 },
                                padding: 12,
                                usePointStyle: true,
                                pointStyleWidth: 8
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct   = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                                    return ` S/ ${ctx.parsed.toLocaleString('es-PE', { minimumFractionDigits: 2 })} (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            });
        },

        // ─── Gráfico 2: Barras — Estructura Financiera ────────────────
        _graficoEstructura(r) {
            const contenedor = document.getElementById('bgGraficoEstructura');
            if (!contenedor) return;

            this._destruir('estructura');

            // Crear canvas fresco
            contenedor.innerHTML = '<canvas id="bgCanvasEstructura"></canvas>';
            const canvas = document.getElementById('bgCanvasEstructura');
            if (!canvas) return;

            const cfg = window.BalanceGeneralConfig.colores;

            this.instancias.estructura = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: [
                        'Act. Corrientes',
                        'Act. No Corrientes',
                        'Pas. Corrientes',
                        'Pas. No Corrientes',
                        'Patrimonio'
                    ],
                    datasets: [{
                        label: 'S/.',
                        data: [
                            r.activos.corrientes.total,
                            Math.max(r.activos.noCorrientes.total, 0),
                            r.pasivos.corrientes.total,
                            r.pasivos.noCorrientes.total,
                            Math.max(r.patrimonio.total, 0)
                        ],
                        backgroundColor: [
                            cfg.activosCorrientes.fondo,
                            cfg.activosNoCorrientes.fondo,
                            cfg.pasivosCorrientes.fondo,
                            cfg.pasivosNoCorrientes.fondo,
                            cfg.patrimonio.fondo
                        ],
                        borderColor: [
                            cfg.activosCorrientes.borde,
                            cfg.activosNoCorrientes.borde,
                            cfg.pasivosCorrientes.borde,
                            cfg.pasivosNoCorrientes.borde,
                            cfg.patrimonio.borde
                        ],
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => ` S/ ${ctx.parsed.y.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 20 },
                            grid:  { color: 'rgba(255,255,255,0.05)' }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#94a3b8',
                                font: { size: 10 },
                                callback: (v) => 'S/.' + v.toLocaleString('es-PE')
                            },
                            grid: { color: 'rgba(255,255,255,0.06)' }
                        }
                    }
                }
            });
        }
    };

    console.log('✅ [BG-Graficos] Cargado');

})();
