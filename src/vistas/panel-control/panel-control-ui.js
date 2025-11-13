/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - PANEL DE CONTROL UI v1.1 (SIMPLIFICADO Y FUNCIONAL)
 * ═══════════════════════════════════════════════════════════════════
 */

class PanelControlUI {
    constructor() {
        this.config = {
            version: '1.1.0',
            componente: 'PanelControlUI',
            debug: true
        };

        this.panelControl = null;
        this.graficos = {
            principal: null,
            distribucion: null,
            comparativa: null,
            tendencia: null
        };

        this._log('info', '🎨 Panel Control UI inicializando...');
        this._inicializar();
    }

    async _inicializar() {
        try {
            // Esperar a que panelControl esté listo
            await this._esperarPanelControl();
            
            this._log('success', '✅ Panel Control UI listo');
            
        } catch (error) {
            this._log('error', 'Error inicializando UI:', error);
        }
    }

    async _esperarPanelControl() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.panelControl && window.panelControl.estaListo()) {
                    this.panelControl = window.panelControl;
                    this._log('info', '✅ panelControl conectado');
                    resolve();
                } else {
                    setTimeout(verificar, 200);
                }
            };
            verificar();
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CARGA DE DATOS EN MÉTRICAS
     * ═══════════════════════════════════════════════════════════════
     */

    cargarDatos() {
        this._log('info', '📊 Cargando datos en métricas...');

        if (!this.panelControl) {
            this._log('error', 'panelControl no disponible');
            return;
        }

        const datos = this.panelControl.obtenerDatos();
        
        this._log('info', 'Datos obtenidos:', datos);

        // Verificar que los elementos existan
        const totalIngresos = document.getElementById('totalIngresos');
        const totalGastos = document.getElementById('totalGastos');
        const balanceTotal = document.getElementById('balanceTotal');
        const metricaCrecimiento = document.getElementById('metrica-crecimiento');

        if (!totalIngresos || !totalGastos || !balanceTotal || !metricaCrecimiento) {
            this._log('warn', 'Elementos HTML no encontrados, esperando...');
            setTimeout(() => this.cargarDatos(), 500);
            return;
        }

        // Actualizar métricas
        totalIngresos.textContent = `S/. ${this._formatearNumero(datos.ingresos)}`;
        
        totalGastos.textContent = `S/. ${this._formatearNumero(datos.gastos)}`;
        
        balanceTotal.textContent = `${datos.balance < 0 ? '-' : ''}S/. ${this._formatearNumero(Math.abs(datos.balance))}`;
        balanceTotal.style.color = datos.balance >= 0 ? 'var(--success)' : '#ef4444';
        
        metricaCrecimiento.textContent = `+${datos.crecimiento.toFixed(1)}%`;

        // Actualizar badges
        this._actualizarBadges(datos);

        this._log('success', '✅ Métricas actualizadas');
    }

    _actualizarBadges(datos) {
        // Badge de ingresos
        const badgeIngresos = document.getElementById('badge-ingresos');
        if (badgeIngresos && datos.ingresos > 0) {
            badgeIngresos.innerHTML = '<i class="fas fa-arrow-up"></i> Activo';
            badgeIngresos.className = 'metrica-badge badge-positivo';
        }

        // Badge de gastos
        const badgeGastos = document.getElementById('badge-gastos');
        if (badgeGastos && datos.gastos > 0) {
            badgeGastos.innerHTML = `<i class="fas fa-arrow-down"></i> ${datos.cantidadGastos || 0} registros`;
            badgeGastos.className = 'metrica-badge badge-negativo';
        }

        // Badge de utilidad
        const badgeUtilidad = document.getElementById('badge-utilidad');
        if (badgeUtilidad) {
            if (datos.utilidad > 0) {
                badgeUtilidad.innerHTML = '<i class="fas fa-arrow-up"></i> Positivo';
                badgeUtilidad.className = 'metrica-badge badge-positivo';
            } else if (datos.utilidad < 0) {
                badgeUtilidad.innerHTML = '<i class="fas fa-arrow-down"></i> Negativo';
                badgeUtilidad.className = 'metrica-badge badge-negativo';
            } else {
                badgeUtilidad.innerHTML = '<i class="fas fa-minus"></i> Neutral';
                badgeUtilidad.className = 'metrica-badge badge-neutral';
            }
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * INICIALIZACIÓN DE GRÁFICOS
     * ═══════════════════════════════════════════════════════════════
     */

    inicializarGraficos() {
        this._log('info', '📈 Inicializando gráficos...');

        if (typeof Chart === 'undefined') {
            this._log('error', 'Chart.js no está cargado');
            return;
        }

        // Configuración global de Chart.js
        Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
        Chart.defaults.color = '#8b92a7';

        // Inicializar cada gráfico con verificación
        setTimeout(() => {
            this._inicializarGraficoPrincipal();
            this._inicializarGraficoDistribucion();
            this._inicializarGraficoComparativa();
            this._inicializarGraficoTendencia();
            this._log('success', '✅ Gráficos inicializados');
        }, 500);
    }

    _inicializarGraficoPrincipal() {
        const canvas = document.getElementById('graficoFlujoCajaPrincipal');
        if (!canvas) {
            this._log('warn', 'Canvas graficoFlujoCajaPrincipal no encontrado');
            return;
        }

        // Destruir gráfico anterior si existe
        if (this.graficos.principal) {
            this.graficos.principal.destroy();
        }

        const datos = this.panelControl.obtenerDatosFlujoCaja(6);

        const ctx = canvas.getContext('2d');
        this.graficos.principal = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.mes),
                datasets: [
                    {
                        label: 'Ingresos',
                        data: datos.map(d => d.ingresos),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Gastos',
                        data: datos.map(d => d.gastos),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Balance',
                        data: datos.map(d => d.balance),
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: S/. ${this._formatearNumero(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(139, 146, 167, 0.1)'
                        },
                        ticks: {
                            callback: (value) => `S/. ${this._formatearNumero(value)}`
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    _inicializarGraficoDistribucion() {
        const canvas = document.getElementById('graficoDistribucionGastos');
        if (!canvas) return;

        if (this.graficos.distribucion) {
            this.graficos.distribucion.destroy();
        }

        const categorias = this.panelControl.obtenerDatosCategoria('gasto');
        const top5 = categorias.slice(0, 5);

        const ctx = canvas.getContext('2d');
        this.graficos.distribucion = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: top5.map(c => c.categoria),
                datasets: [{
                    data: top5.map(c => c.monto),
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#8b5cf6',
                        '#06b6d4',
                        '#ec4899'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: S/. ${this._formatearNumero(context.parsed)} (${porcentaje}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    _inicializarGraficoComparativa() {
        const canvas = document.getElementById('graficoIngresosVsGastos');
        if (!canvas) return;

        if (this.graficos.comparativa) {
            this.graficos.comparativa.destroy();
        }

        const datos = this.panelControl.obtenerComparativaIngresosGastos(6);

        const ctx = canvas.getContext('2d');
        this.graficos.comparativa = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datos.labels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: datos.ingresos,
                        backgroundColor: '#10b981'
                    },
                    {
                        label: 'Gastos',
                        data: datos.gastos,
                        backgroundColor: '#ef4444'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: S/. ${this._formatearNumero(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(139, 146, 167, 0.1)'
                        },
                        ticks: {
                            callback: (value) => `S/. ${this._formatearNumero(value)}`
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    _inicializarGraficoTendencia() {
        const canvas = document.getElementById('graficoTendenciaMensual');
        if (!canvas) return;

        if (this.graficos.tendencia) {
            this.graficos.tendencia.destroy();
        }

        const datos = this.panelControl.obtenerDatosFlujoCaja(6);

        const ctx = canvas.getContext('2d');
        this.graficos.tendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.mes),
                datasets: [{
                    label: 'Balance Mensual',
                    data: datos.map(d => d.balance),
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Balance: S/. ${this._formatearNumero(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(139, 146, 167, 0.1)'
                        },
                        ticks: {
                            callback: (value) => `S/. ${this._formatearNumero(value)}`
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * UTILIDADES
     * ═══════════════════════════════════════════════════════════════
     */

    _formatearNumero(numero) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    _log(nivel, mensaje, datos = null) {
        if (!this.config.debug && nivel !== 'error' && nivel !== 'success') return;
        
        const timestamp = new Date().toISOString();
        const prefijo = `[${timestamp}] [${this.config.componente}]`;
        
        if (nivel === 'error') {
            console.error(`${prefijo}`, mensaje, datos);
        } else if (nivel === 'warn') {
            console.warn(`${prefijo}`, mensaje, datos);
        } else if (nivel === 'success') {
            console.log(`%c${prefijo} ${mensaje}`, 'color: #10b981; font-weight: bold', datos);
        } else {
            console.log(`${prefijo}`, mensaje, datos);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * API PÚBLICA
     * ═══════════════════════════════════════════════════════════════
     */

    actualizar() {
        this.cargarDatos();
        this.inicializarGraficos();
    }

    destruirGraficos() {
        Object.values(this.graficos).forEach(grafico => {
            if (grafico) {
                grafico.destroy();
            }
        });
        
        this.graficos = {
            principal: null,
            distribucion: null,
            comparativa: null,
            tendencia: null
        };
    }
}

// Inicialización global CON MANEJO DE ERRORES
try {
    window.panelControlUI = new PanelControlUI();
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎨 PANEL CONTROL UI v1.1 (SIMPLIFICADO)                     ║
║  ✅ Cargado exitosamente                                      ║
╚═══════════════════════════════════════════════════════════════╝
    `);
} catch (error) {
    console.error('❌ Error creando PanelControlUI:', error);
}
