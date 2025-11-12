/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - PANEL DE CONTROL UI
 * Maneja toda la interacción con el DOM
 * ═══════════════════════════════════════════════════════════════════
 */

class PanelControlUI {
    constructor() {
        this.modulo = null;
        this.graficos = {};
        
        this._inicializar();
    }

    async _inicializar() {
        console.log('🎨 Inicializando interfaz Panel de Control...');
        
        // Esperar a que el módulo esté listo
        await this._esperarModulo();
        
        // Esperar a que el DOM esté completamente listo
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Cargar datos iniciales
        this.cargarDatos();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Inicializar gráficos
        this.inicializarGraficos();
        
        console.log('✅ Interfaz Panel de Control lista');
    }

    async _esperarModulo() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.panelControl && window.panelControl.estaListo()) {
                    this.modulo = window.panelControl;
                    console.log('✅ Módulo conectado a la UI');
                    resolve();
                } else {
                    setTimeout(verificar, 200);
                }
            };
            verificar();
        });
    }

    configurarEventos() {
        // Escuchar actualizaciones del módulo
        document.addEventListener('grizalumPanelControlActualizado', () => {
            console.log('🔄 Panel actualizado, recargando UI...');
            this.cargarDatos();
            this.actualizarGraficos();
        });

        // Escuchar cambio de empresa
        document.addEventListener('grizalumCompanyChanged', () => {
            console.log('🏢 Empresa cambiada, actualizando panel...');
            setTimeout(() => {
                this.cargarDatos();
                this.actualizarGraficos();
            }, 500);
        });

        // Escuchar cambio de plan
        document.addEventListener('grizalumPanelControlPlanCambiado', (e) => {
            console.log('📊 Plan cambiado:', e.detail.plan.nombre);
            this.aplicarRestricciones();
        });

        // Botones de filtro de tiempo
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
                e.target.classList.add('activo');
                // Aquí se pueden agregar filtros en el futuro
            });
        });

        console.log('✅ Eventos configurados');
    }

    cargarDatos() {
        const datos = this.modulo.obtenerDatos();
        
        // Actualizar métricas
        this.actualizarMetricas(datos);
        
        console.log('📊 Datos cargados en UI');
    }

    actualizarMetricas(datos) {
        // Actualizar valores con animación
        this._actualizarValor('revenueValue', datos.ingresos, true);
        this._actualizarValor('expensesValue', datos.gastos, true);
        this._actualizarValor('profitValue', datos.utilidad, true);
        this._actualizarValor('growthValue', datos.crecimiento, false, '%');

        // Actualizar indicadores de cambio (calcular vs mes anterior)
        this._actualizarCambios(datos);
    }

    _actualizarValor(elementId, valor, esMoneda = false, sufijo = '') {
        const elemento = document.getElementById(elementId);
        if (!elemento) return;

        let valorFormateado;
        if (esMoneda) {
            valorFormateado = `S/. ${this._formatearNumero(valor)}`;
        } else if (sufijo === '%') {
            const signo = valor >= 0 ? '+' : '';
            valorFormateado = `${signo}${valor}${sufijo}`;
        } else {
            valorFormateado = this._formatearNumero(valor);
        }

        // Animación de conteo
        this._animarConteo(elemento, valorFormateado);
    }

    _animarConteo(elemento, valorFinal) {
        elemento.textContent = valorFinal;
        elemento.style.transform = 'scale(1.05)';
        setTimeout(() => {
            elemento.style.transform = 'scale(1)';
        }, 300);
    }

    _actualizarCambios(datos) {
        // Por ahora usar crecimiento como indicador
        // En el futuro se puede calcular cambios específicos por métrica
        
        const cambios = {
            gastos: Math.abs(datos.crecimiento * 0.3), // Estimado
            utilidad: Math.abs(datos.crecimiento * 1.2), // Estimado
            crecimiento: datos.crecimiento,
            ingresos: datos.crecimiento
        };

        // Actualizar cada tarjeta
        Object.entries(cambios).forEach(([tipo, cambio]) => {
            const tarjeta = document.querySelector(`.metrica-tarjeta.${tipo}`);
            if (!tarjeta) return;

            const cambioElement = tarjeta.querySelector('.metrica-cambio');
            if (!cambioElement) return;

            const esPositivo = cambio >= 0;
            cambioElement.className = `metrica-cambio ${esPositivo ? 'positivo' : 'negativo'}`;
            
            const icono = cambioElement.querySelector('i');
            if (icono) {
                icono.className = `fas fa-arrow-${esPositivo ? 'up' : 'down'}`;
            }

            const texto = cambioElement.querySelector('span');
            if (texto) {
                texto.textContent = `${esPositivo ? '+' : ''}${Math.abs(cambio).toFixed(1)}% vs mes anterior`;
            }
        });
    }

    _formatearNumero(numero) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * GRÁFICOS
     * ═══════════════════════════════════════════════════════════════
     */

   inicializarGraficos() {
    console.log('📊 Inicializando gráficos...');

    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js no está cargado');
        return;
    }

    // ✅ DESTRUIR GRÁFICOS EXISTENTES PRIMERO
    if (this.graficos && Object.keys(this.graficos).length > 0) {
        console.log('🧹 Destruyendo gráficos anteriores...');
        Object.values(this.graficos).forEach(grafico => {
            if (grafico && typeof grafico.destroy === 'function') {
                try {
                    grafico.destroy();
                } catch (e) {
                    console.warn('⚠️ Error destruyendo gráfico:', e);
                }
            }
        });
        this.graficos = {};
        console.log('✅ Gráficos anteriores destruidos');
    }

    // Configuración global de Chart.js
    Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Crear gráficos
    this._crearGraficoFlujoCaja();
    this._crearGraficoGastos();
    this._crearGraficoIngresosVsGastos();
    this._crearGraficoAntiguedad();
    this._crearGraficoFlujoDiario();

    console.log('✅ Gráficos inicializados');
}
    _crearGraficoFlujoCaja() {
        const ctx = document.getElementById('mainCashFlowChart');
        if (!ctx) return;

        const datos = this.modulo.obtenerDatosFlujoCaja(6);

        this.graficos.flujoCaja = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.mes),
                datasets: [{
                    label: 'Ingresos',
                    data: datos.map(d => d.ingresos),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Gastos',
                    data: datos.map(d => d.gastos),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Balance',
                    data: datos.map(d => d.balance),
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 15,
                            font: { size: 12, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 13, weight: '700' },
                        bodyFont: { size: 12 },
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: S/. ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `S/. ${value}`
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
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

    _crearGraficoGastos() {
        const ctx = document.getElementById('expensesChart');
        if (!ctx) return;

        const datos = this.modulo.obtenerDatosCategoria('gasto');

        this.graficos.gastos = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: datos.map(d => d.categoria),
                datasets: [{
                    data: datos.map(d => d.monto),
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#ec4899',
                        '#8b5cf6',
                        '#6366f1'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 12,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const porcentaje = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: S/. ${context.parsed.toFixed(2)} (${porcentaje}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    _crearGraficoIngresosVsGastos() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const datos = this.modulo.obtenerComparativaIngresosGastos(6);

        this.graficos.ingresosVsGastos = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datos.labels,
                datasets: [{
                    label: 'Ingresos',
                    data: datos.ingresos,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderRadius: 6
                }, {
                    label: 'Gastos',
                    data: datos.gastos,
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: S/. ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `S/. ${value}`
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
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

    _crearGraficoAntiguedad() {
        const ctx = document.getElementById('agingChart');
        if (!ctx) return;

        // Datos de ejemplo para antigüedad de cuentas
        const datos = this.modulo.obtenerDatos();
        
        this.graficos.antiguedad = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0-30 días', '31-60 días', '61-90 días', '+90 días'],
                datasets: [{
                    label: 'Monto',
                    data: [
                        datos.ingresos * 0.6,
                        datos.ingresos * 0.25,
                        datos.ingresos * 0.1,
                        datos.ingresos * 0.05
                    ],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(127, 29, 29, 0.8)'
                    ],
                    borderRadius: 6
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                return `Monto: S/. ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `S/. ${value}`
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
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

    _crearGraficoFlujoDiario() {
        const ctx = document.getElementById('cashFlowDetailChart');
        if (!ctx) return;

        const datos = this.modulo.obtenerFlujoDiario(30);

        this.graficos.flujoDiario = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.labels,
                datasets: [{
                    label: 'Balance Diario',
                    data: datos.datos,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                return `Balance: S/. ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => `S/. ${value}`
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    actualizarGraficos() {
        console.log('🔄 Actualizando gráficos...');

        if (this.graficos.flujoCaja) {
            const datos = this.modulo.obtenerDatosFlujoCaja(6);
            this.graficos.flujoCaja.data.labels = datos.map(d => d.mes);
            this.graficos.flujoCaja.data.datasets[0].data = datos.map(d => d.ingresos);
            this.graficos.flujoCaja.data.datasets[1].data = datos.map(d => d.gastos);
            this.graficos.flujoCaja.data.datasets[2].data = datos.map(d => d.balance);
            this.graficos.flujoCaja.update();
        }

        if (this.graficos.gastos) {
            const datos = this.modulo.obtenerDatosCategoria('gasto');
            this.graficos.gastos.data.labels = datos.map(d => d.categoria);
            this.graficos.gastos.data.datasets[0].data = datos.map(d => d.monto);
            this.graficos.gastos.update();
        }

        if (this.graficos.ingresosVsGastos) {
            const datos = this.modulo.obtenerComparativaIngresosGastos(6);
            this.graficos.ingresosVsGastos.data.labels = datos.labels;
            this.graficos.ingresosVsGastos.data.datasets[0].data = datos.ingresos;
            this.graficos.ingresosVsGastos.data.datasets[1].data = datos.gastos;
            this.graficos.ingresosVsGastos.update();
        }

        if (this.graficos.flujoDiario) {
            const datos = this.modulo.obtenerFlujoDiario(30);
            this.graficos.flujoDiario.data.labels = datos.labels;
            this.graficos.flujoDiario.data.datasets[0].data = datos.datos;
            this.graficos.flujoDiario.update();
        }

        console.log('✅ Gráficos actualizados');
    }

    aplicarRestricciones() {
        const plan = this.modulo.obtenerPlan();
        if (!plan) return;

        // Mostrar/ocultar elementos según el plan
        const graficosSecundarios = document.querySelectorAll('.grafico-tarjeta:not(.principal)');
        
        if (plan.id === 'individual') {
            // Solo gráfico principal
            graficosSecundarios.forEach(g => g.style.display = 'none');
        } else {
            // Mostrar todos
            graficosSecundarios.forEach(g => g.style.display = 'flex');
        }

        console.log(`🔒 Restricciones aplicadas para plan: ${plan.nombre}`);
    }
}

// Inicialización global
window.panelControlUI = new PanelControlUI();

console.log('✅ [panel-control-ui.js] Módulo cargado - ' + new Date().toISOString());
