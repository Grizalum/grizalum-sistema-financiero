/**
 * ═══════════════════════════════════════════════════════════════════
 * ESTADO DE RESULTADOS - GRÁFICOS PROFESIONALES v2.0
 * Visualización de datos financieros con Chart.js
 * Colores modernos 2026 + Animaciones suaves
 * ═══════════════════════════════════════════════════════════════════
 */

if (!window.EstadoResultadosGraficos) {
    window.EstadoResultadosGraficos = {
        
    version: '2.0.0',
    graficos: {},
    
    // ✅ PALETA DE COLORES MODERNA 2026
    colores: {
        ingresos: {
            base: 'rgba(16, 185, 129, 0.85)',
            borde: '#10B981',
            gradiente: ['rgba(16, 185, 129, 0.9)', 'rgba(5, 150, 105, 0.7)']
        },
        costos: {
            base: 'rgba(245, 158, 11, 0.85)',
            borde: '#F59E0B',
            gradiente: ['rgba(245, 158, 11, 0.9)', 'rgba(217, 119, 6, 0.7)']
        },
        gastosOp: {
            base: 'rgba(239, 68, 68, 0.85)',
            borde: '#EF4444',
            gradiente: ['rgba(239, 68, 68, 0.9)', 'rgba(220, 38, 38, 0.7)']
        },
        gastosFin: {
            base: 'rgba(139, 92, 246, 0.85)',
            borde: '#8B5CF6',
            gradiente: ['rgba(139, 92, 246, 0.9)', 'rgba(124, 58, 237, 0.7)']
        },
        // Paleta adicional para pie chart
        paleta: [
            'rgba(245, 158, 11, 0.85)',   // Amarillo
            'rgba(239, 68, 68, 0.85)',     // Rojo
            'rgba(139, 92, 246, 0.85)',    // Morado
            'rgba(59, 130, 246, 0.85)',    // Azul
            'rgba(236, 72, 153, 0.85)',    // Rosa
            'rgba(20, 184, 166, 0.85)',    // Teal
            'rgba(251, 146, 60, 0.85)',    // Naranja
            'rgba(107, 114, 128, 0.85)'    // Gris
        ]
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * GRÁFICO DE BARRAS - COMPOSICIÓN MEJORADO
     * ═══════════════════════════════════════════════════════════════
     */
    crearGraficoBarras(resultados) {
        const canvas = document.getElementById('erGraficoBarras');
        if (!canvas) {
            console.warn('⚠️ Canvas erGraficoBarras no encontrado');
            return;
        }

        // Destruir gráfico anterior
        if (this.graficos.barras) {
            this.graficos.barras.destroy();
        }

        const ctx = canvas.getContext('2d');

        // ✅ Crear gradientes
        const gradienteIngresos = ctx.createLinearGradient(0, 0, 0, 400);
        gradienteIngresos.addColorStop(0, this.colores.ingresos.gradiente[0]);
        gradienteIngresos.addColorStop(1, this.colores.ingresos.gradiente[1]);

        const gradienteCostos = ctx.createLinearGradient(0, 0, 0, 400);
        gradienteCostos.addColorStop(0, this.colores.costos.gradiente[0]);
        gradienteCostos.addColorStop(1, this.colores.costos.gradiente[1]);

        const gradienteGastosOp = ctx.createLinearGradient(0, 0, 0, 400);
        gradienteGastosOp.addColorStop(0, this.colores.gastosOp.gradiente[0]);
        gradienteGastosOp.addColorStop(1, this.colores.gastosOp.gradiente[1]);

        const gradienteGastosFin = ctx.createLinearGradient(0, 0, 0, 400);
        gradienteGastosFin.addColorStop(0, this.colores.gastosFin.gradiente[0]);
        gradienteGastosFin.addColorStop(1, this.colores.gastosFin.gradiente[1]);

        const datos = {
            labels: ['Resultados'],
            datasets: [
                {
                    label: 'Ingresos',
                    data: [resultados.ingresos.total],
                    backgroundColor: gradienteIngresos,
                    borderColor: this.colores.ingresos.borde,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderSkipped: false
                },
                {
                    label: 'Costos',
                    data: [resultados.costos.total],
                    backgroundColor: gradienteCostos,
                    borderColor: this.colores.costos.borde,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderSkipped: false
                },
                {
                    label: 'Gastos Operativos',
                    data: [resultados.gastosOperativos.total],
                    backgroundColor: gradienteGastosOp,
                    borderColor: this.colores.gastosOp.borde,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderSkipped: false
                },
                {
                    label: 'Gastos Financieros',
                    data: [resultados.gastosFinancieros.total],
                    backgroundColor: gradienteGastosFin,
                    borderColor: this.colores.gastosFin.borde,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderSkipped: false
                }
            ]
        };

        const config = {
            type: 'bar',
            data: datos,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                // ✅ Animación suave
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: this._obtenerColorTexto(),
                            font: {
                                size: 13,
                                weight: 600,
                                family: "'Inter', sans-serif"
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat('es-PE', {
                                    style: 'currency',
                                    currency: 'PEN'
                                }).format(context.parsed.y);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: this._obtenerColorSecundario(),
                            font: {
                                size: 12,
                                weight: 600
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this._obtenerColorBorde(),
                            drawBorder: false
                        },
                        ticks: {
                            color: this._obtenerColorSecundario(),
                            font: {
                                size: 12
                            },
                            callback: (value) => {
                                return 'S/. ' + value.toLocaleString('es-PE');
                            }
                        }
                    }
                }
            }
        };

        this.graficos.barras = new Chart(ctx, config);
        console.log('✅ [Gráficos] Gráfico de barras creado (v2.0)');
    },

    /**
     * ═══════════════════════════════════════════════════════════════
     * GRÁFICO DE TORTA - DISTRIBUCIÓN DE GASTOS MEJORADO
     * ═══════════════════════════════════════════════════════════════
     */
    crearGraficoTorta(resultados) {
        const canvas = document.getElementById('erGraficoTorta');
        if (!canvas) {
            console.warn('⚠️ Canvas erGraficoTorta no encontrado');
            return;
        }

        // Destruir gráfico anterior
        if (this.graficos.torta) {
            this.graficos.torta.destroy();
        }

        const ctx = canvas.getContext('2d');

        // Preparar datos - Top 6 categorías de gastos
        const todasCategorias = [
            ...resultados.costos.porCategoria.map(c => ({ ...c, tipo: 'Costo' })),
            ...resultados.gastosOperativos.porCategoria.map(c => ({ ...c, tipo: 'Gasto Op.' })),
            ...resultados.gastosFinancieros.porCategoria.map(c => ({ ...c, tipo: 'Gasto Fin.' }))
        ];

        const top6 = todasCategorias
            .sort((a, b) => b.monto - a.monto)
            .slice(0, 6);

        const otrosMonto = todasCategorias
            .slice(6)
            .reduce((sum, cat) => sum + cat.monto, 0);

        const labels = top6.map(c => c.categoria);
        const data = top6.map(c => c.monto);
        
        if (otrosMonto > 0) {
            labels.push('Otros');
            data.push(otrosMonto);
        }

        const config = {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: this.colores.paleta,
                    borderColor: this._obtenerColorFondo(),
                    borderWidth: 4,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                // ✅ Animación suave
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart',
                    animateRotate: true,
                    animateScale: true
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: this._obtenerColorTexto(),
                            font: {
                                size: 12,
                                weight: 600,
                                family: "'Inter', sans-serif"
                            },
                            padding: 12,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            generateLabels: (chart) => {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
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
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: (context) => {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                
                                label += new Intl.NumberFormat('es-PE', {
                                    style: 'currency',
                                    currency: 'PEN'
                                }).format(value);
                                label += ` (${percentage}%)`;
                                
                                return label;
                            }
                        }
                    }
                }
            }
        };

        this.graficos.torta = new Chart(ctx, config);
        console.log('✅ [Gráficos] Gráfico de torta creado (v2.0)');
    },

    /**
     * ═══════════════════════════════════════════════════════════════
     * UTILIDADES - OBTENER COLORES DEL TEMA
     * ═══════════════════════════════════════════════════════════════
     */

    _obtenerColorTexto() {
        const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--texto-principal').trim();
        return color || '#1f2937';
    },

    _obtenerColorSecundario() {
        const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--texto-secundario').trim();
        return color || '#6b7280';
    },

    _obtenerColorBorde() {
        const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--borde-principal').trim();
        return color || 'rgba(209, 213, 219, 0.3)';
    },

    _obtenerColorFondo() {
        const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--fondo-card').trim();
        return color || '#ffffff';
    },

    /**
     * ═══════════════════════════════════════════════════════════════
     * DESTRUIR TODOS LOS GRÁFICOS
     * ═══════════════════════════════════════════════════════════════
     */
    destruirGraficos() {
        Object.values(this.graficos).forEach(grafico => {
            if (grafico) {
                grafico.destroy();
            }
        });
        this.graficos = {};
        console.log('🗑️ [Gráficos] Todos los gráficos destruidos');
    }
    };
}
console.log('📊 Módulo de gráficos Estado de Resultados v2.0 - Colores 2026 cargado');
