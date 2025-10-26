/**
 * ═══════════════════════════════════════════════════════════════════
 * ESTADO DE RESULTADOS - GRÁFICOS PROFESIONALES
 * Visualización de datos financieros con Chart.js
 * ═══════════════════════════════════════════════════════════════════
 */

const EstadoResultadosGraficos = {
    graficos: {},
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * GRÁFICO DE BARRAS - COMPOSICIÓN
     * ═══════════════════════════════════════════════════════════════
     */
    crearGraficoBarras(resultados) {
        const canvas = document.getElementById('erGraficoBarras');
        if (!canvas) return;

        // Destruir gráfico anterior
        if (this.graficos.barras) {
            this.graficos.barras.destroy();
        }

        const ctx = canvas.getContext('2d');

        const datos = {
            labels: ['Resultados'],
            datasets: [
                {
                    label: 'Ingresos',
                    data: [resultados.ingresos.total],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10B981',
                    borderWidth: 2
                },
                {
                    label: 'Costos',
                    data: [resultados.costos.total],
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: '#F59E0B',
                    borderWidth: 2
                },
                {
                    label: 'Gastos Operativos',
                    data: [resultados.gastosOperativos.total],
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: '#EF4444',
                    borderWidth: 2
                },
                {
                    label: 'Gastos Financieros',
                    data: [resultados.gastosFinancieros.total],
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: '#8B5CF6',
                    borderWidth: 2
                }
            ]
        };

        const config = {
            type: 'bar',
            data: datos,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--texto-primario').trim() || '#000',
                            font: {
                                size: 12,
                                weight: 600
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
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
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--texto-secundario').trim() || '#666'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--borde').trim() || '#e5e7eb'
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--texto-secundario').trim() || '#666',
                            callback: function(value) {
                                return 'S/. ' + value.toLocaleString('es-PE');
                            }
                        }
                    }
                }
            }
        };

        this.graficos.barras = new Chart(ctx, config);
        console.log('✅ Gráfico de barras creado');
    },

    /**
     * ═══════════════════════════════════════════════════════════════
     * GRÁFICO DE TORTA - DISTRIBUCIÓN DE GASTOS
     * ═══════════════════════════════════════════════════════════════
     */
    crearGraficoTorta(resultados) {
        const canvas = document.getElementById('erGraficoTorta');
        if (!canvas) return;

        // Destruir gráfico anterior
        if (this.graficos.torta) {
            this.graficos.torta.destroy();
        }

        const ctx = canvas.getContext('2d');

        // Preparar datos - Top 5 categorías de gastos
        const todasCategorias = [
            ...resultados.costos.porCategoria.map(c => ({ ...c, tipo: 'Costo' })),
            ...resultados.gastosOperativos.porCategoria.map(c => ({ ...c, tipo: 'Gasto Op.' })),
            ...resultados.gastosFinancieros.porCategoria.map(c => ({ ...c, tipo: 'Gasto Fin.' }))
        ];

        const top5 = todasCategorias
            .sort((a, b) => b.monto - a.monto)
            .slice(0, 5);

        const otrosMonto = todasCategorias
            .slice(5)
            .reduce((sum, cat) => sum + cat.monto, 0);

        const labels = top5.map(c => c.categoria);
        const data = top5.map(c => c.monto);
        
        if (otrosMonto > 0) {
            labels.push('Otros');
            data.push(otrosMonto);
        }

        const colores = [
            'rgba(245, 158, 11, 0.8)',   // Amarillo
            'rgba(239, 68, 68, 0.8)',     // Rojo
            'rgba(139, 92, 246, 0.8)',    // Morado
            'rgba(59, 130, 246, 0.8)',    // Azul
            'rgba(236, 72, 153, 0.8)',    // Rosa
            'rgba(107, 114, 128, 0.8)'    // Gris
        ];

        const config = {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colores,
                    borderColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--fondo-tarjeta').trim() || '#fff',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--texto-primario').trim() || '#000',
                            font: {
                                size: 12,
                                weight: 600
                            },
                            padding: 15,
                            generateLabels: function(chart) {
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
                        callbacks: {
                            label: function(context) {
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
        console.log('✅ Gráfico de torta creado');
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
        console.log('🗑️ Gráficos destruidos');
    }
};

// Exportar globalmente
window.EstadoResultadosGraficos = EstadoResultadosGraficos;

console.log('📊 Módulo de gráficos Estado de Resultados cargado');
