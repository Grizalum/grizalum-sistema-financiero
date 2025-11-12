/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - PANEL DE CONTROL UI v1.0
 * Interfaz visual que conecta datos de FlujoCaja con el dashboard
 * ═══════════════════════════════════════════════════════════════════
 */

class PanelControlUI {
    constructor() {
        this.config = {
            version: '1.0.0',
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

        this._inicializar();
    }

    async _inicializar() {
        try {
            this._log('info', '🎨 Panel Control UI inicializando...');
            
            // Esperar a que panelControl esté listo
            await this._esperarPanelControl();
            
            // Cargar datos iniciales
            this.cargarDatos();
            
            // Inicializar gráficos
            this.inicializarGraficos();
            
            // Configurar botones
            this._configurarBotones();
            
            // Configurar eventos
            this._configurarEventos();
            
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

        // Actualizar métricas
        this._actualizarMetrica('ingresos', datos.ingresos);
        this._actualizarMetrica('gastos', datos.gastos);
        this._actualizarMetrica('utilidad', datos.utilidad);
        this._actualizarMetrica('crecimiento', datos.crecimiento);

        // Actualizar badges de variación
        this._actualizarBadges(datos);

        this._log('success', '✅ Métricas actualizadas');
    }

    _actualizarMetrica(tipo, valor) {
        const elemento = document.getElementById(`metrica-${tipo}`);
        
        if (!elemento) {
            this._log('warn', `Elemento metrica-${tipo} no encontrado`);
            return;
        }

        // Formatear valor según tipo
        let valorFormateado;
        
        if (tipo === 'crecimiento') {
            valorFormateado = `${valor >= 0 ? '+' : ''}${valor.toFixed(1)}%`;
        } else {
            valorFormateado = `S/. ${this._formatearNumero(Math.abs(valor))}`;
            if (valor < 0 && tipo === 'utilidad') {
                valorFormateado = `-${valorFormateado}`;
            }
        }

        elemento.textContent = valorFormateado;

        // Aplicar color según el valor
        if (tipo === 'utilidad') {
            elemento.style.color = valor >= 0 ? 'var(--success)' : 'var(--danger)';
        }
    }

    _actualizarBadges(datos) {
        // Badge de ingresos (positivo si hay ingresos)
        const badgeIngresos = document.getElementById('badge-ingresos');
        if (badgeIngresos && datos.ingresos > 0) {
            badgeIngresos.innerHTML = '<i class="fas fa-arrow-up"></i> Activo';
            badgeIngresos.className = 'metrica-badge badge-positivo';
        }

        // Badge de gastos (negativo si hay gastos)
        const badgeGastos = document.getElementById('badge-gastos');
        if (badgeGastos && datos.gastos > 0) {
            badgeGastos.innerHTML = `<i class="fas fa-arrow-down"></i> ${datos.cantidadGastos || 0} registros`;
            badgeGastos.className = 'metrica-badge badge-negativo';
        }

        // Badge de utilidad (según balance)
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

        // Inicializar cada gráfico
        this._inicializarGraficoPrincipal();
        this._inicializarGraficoDistribucion();
        this._inicializarGraficoComparativa();
        this._inicializarGraficoTendencia();

        this._log('success', '✅ Gráficos inicializados');
    }

    _inicializarGraficoPrincipal() {
        const canvas = document.getElementById('graficoFlujoCajaPrincipal');
        if (!canvas) return;

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
     * CONFIGURACIÓN DE BOTONES Y EVENTOS
     * ═══════════════════════════════════════════════════════════════
     */

    _configurarBotones() {
        // Botón Exportar a Excel
        const btnExportar = document.getElementById('btnExportarPanel');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => {
                this._log('info', '📥 Exportando a Excel...');
                
                if (window.PanelControlExportador && window.PanelControlExportador.exportarExcel) {
                    window.PanelControlExportador.exportarExcel();
                } else {
                    this._mostrarNotificacion('Exportador no disponible', 'error');
                }
            });
        }

        // Botón Personalizar Dashboard
        const btnPersonalizar = document.getElementById('btnPersonalizarPanel');
        if (btnPersonalizar) {
            btnPersonalizar.addEventListener('click', () => {
                this._mostrarNotificacion('Función de personalización próximamente', 'info');
            });
        }

        // Botones de período del gráfico principal
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('activo'));
                e.target.classList.add('activo');
                
                const periodo = e.target.dataset.periodo;
                this._cambiarPeriodoGrafico(periodo);
            });
        });
    }

    _cambiarPeriodoGrafico(periodo) {
        let meses;
        
        switch(periodo) {
            case '6m':
                meses = 6;
                break;
            case '1a':
                meses = 12;
                break;
            case '2a':
                meses = 24;
                break;
            default:
                meses = 6;
        }

        this._log('info', `Cambiando período a ${meses} meses`);
        
        // Actualizar gráfico principal con nuevo período
        const canvas = document.getElementById('graficoFlujoCajaPrincipal');
        if (!canvas || !this.graficos.principal) return;

        const datos = this.panelControl.obtenerDatosFlujoCaja(meses);

        this.graficos.principal.data.labels = datos.map(d => d.mes);
        this.graficos.principal.data.datasets[0].data = datos.map(d => d.ingresos);
        this.graficos.principal.data.datasets[1].data = datos.map(d => d.gastos);
        this.graficos.principal.data.datasets[2].data = datos.map(d => d.balance);
        
        this.graficos.principal.update();
    }

    _configurarEventos() {
        // Escuchar actualizaciones del Panel de Control
        document.addEventListener('grizalumPanelControlActualizado', () => {
            this._log('info', '🔄 Panel actualizado, recargando datos...');
            this.cargarDatos();
            this.inicializarGraficos();
        });

        // Escuchar cambios de empresa
        document.addEventListener('grizalumCompanyChanged', () => {
            this._log('info', '🔄 Empresa cambiada, recargando...');
            setTimeout(() => {
                this.cargarDatos();
                this.inicializarGraficos();
            }, 1000);
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

    _mostrarNotificacion(mensaje, tipo = 'info') {
        // Usar sistema de notificaciones si existe
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(mensaje, tipo);
        } else {
            console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
        }
    }

    _log(nivel, mensaje, datos = null) {
        if (!this.config.debug && nivel !== 'error' && nivel !== 'success') return;
        
        const timestamp = new Date().toISOString();
        const prefijo = `[${timestamp}] [${this.config.componente}]`;
        
        if (nivel === 'error') {
            console.error(`${prefijo}`, mensaje, datos);
        } else if (nivel === 'warn') {
            console.warn(`${prefijo}`, mensaje, datos);
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

// Inicialización global
window.panelControlUI = new PanelControlUI();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎨 PANEL CONTROL UI v1.0.0                                   ║
║  Interfaz visual del dashboard ejecutivo                      ║
║  ✅ Conectado con Panel de Control                            ║
║  ✅ Gráficos con Chart.js                                     ║
╚═══════════════════════════════════════════════════════════════╝
`);
