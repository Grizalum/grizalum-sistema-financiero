/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL UI - VERSIÓN PROFESIONAL v2.0
 * Lógica limpia, clara y sin errores
 * ═══════════════════════════════════════════════════════════════════
 */

class PanelControlUINuevo {
    constructor() {
        this.modulo = null;
        this.graficos = {};
        this.colores = {
            primario: '#667eea',
            ingresos: '#10b981',
            gastos: '#ef4444',
            utilidad: '#8b5cf6',
            crecimiento: '#3b82f6'
        };
        
        this._inicializar();
    }

    async _inicializar() {
        console.log('🎨 [PanelUI v2.0] Inicializando...');
        
        // Esperar módulo principal
        await this._esperarModulo();
        
        // Cargar datos
        this.cargarDatos();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Inicializar gráficos
        setTimeout(() => {
            this.inicializarGraficos();
        }, 500);
        
        console.log('✅ [PanelUI v2.0] Listo');
    }

    async _esperarModulo() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.panelControl && window.panelControl.estaListo()) {
                    this.modulo = window.panelControl;
                    console.log('✅ Módulo conectado');
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
     * CARGAR Y ACTUALIZAR DATOS
     * ═══════════════════════════════════════════════════════════════
     */

    cargarDatos() {
        if (!this.modulo) {
            console.warn('⚠️ Módulo no disponible');
            return;
        }

        const datos = this.modulo.obtenerDatos();
        console.log('📊 Cargando datos:', datos);

        // Actualizar valores
        this.actualizarMetrica('metrica-ingresos', datos.ingresos, true);
        this.actualizarMetrica('metrica-gastos', datos.gastos, true);
        this.actualizarMetrica('metrica-utilidad', datos.utilidad, true);
        this.actualizarMetrica('metrica-crecimiento', datos.crecimiento, false, '%');

        // Actualizar badges
        this.actualizarBadges(datos);

        console.log('✅ Datos actualizados en UI');
    }

    actualizarMetrica(elementId, valor, esMoneda = false, sufijo = '') {
        const elemento = document.getElementById(elementId);
        if (!elemento) return;

        let valorFormateado;
        
        if (esMoneda) {
            valorFormateado = `S/. ${this.formatearNumero(valor)}`;
        } else if (sufijo === '%') {
            const signo = valor >= 0 ? '+' : '';
            valorFormateado = `${signo}${valor}${sufijo}`;
        } else {
            valorFormateado = this.formatearNumero(valor);
        }

        // Actualizar con animación
        elemento.style.transform = 'scale(1.05)';
        elemento.textContent = valorFormateado;
        
        setTimeout(() => {
            elemento.style.transform = 'scale(1)';
        }, 300);
    }

    actualizarBadges(datos) {
        // Badge ingresos
        const badgeIngresos = document.getElementById('badge-ingresos');
        if (badgeIngresos) {
            const cambio = this._calcularCambio(datos.ingresos, datos.crecimiento);
            badgeIngresos.innerHTML = `<i class="fas fa-arrow-${cambio >= 0 ? 'up' : 'down'}"></i> ${Math.abs(cambio).toFixed(1)}%`;
            badgeIngresos.className = `metrica-badge ${cambio >= 0 ? 'badge-positivo' : 'badge-negativo'}`;
        }

        // Badge gastos
        const badgeGastos = document.getElementById('badge-gastos');
        if (badgeGastos) {
            const cambio = this._calcularCambio(datos.gastos, datos.crecimiento * 0.3);
            badgeGastos.innerHTML = `<i class="fas fa-arrow-${cambio >= 0 ? 'up' : 'down'}"></i> ${Math.abs(cambio).toFixed(1)}%`;
            badgeGastos.className = `metrica-badge ${cambio >= 0 ? 'badge-negativo' : 'badge-positivo'}`;
        }

        // Badge utilidad
        const badgeUtilidad = document.getElementById('badge-utilidad');
        if (badgeUtilidad) {
            const estado = datos.utilidad >= 0 ? 'Superávit' : 'Déficit';
            badgeUtilidad.innerHTML = `<i class="fas fa-${datos.utilidad >= 0 ? 'check-circle' : 'exclamation-circle'}"></i> ${estado}`;
            badgeUtilidad.className = `metrica-badge ${datos.utilidad >= 0 ? 'badge-positivo' : 'badge-negativo'}`;
        }
    }

    _calcularCambio(valor, crecimiento) {
        return crecimiento || 0;
    }

    formatearNumero(numero) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CONFIGURAR EVENTOS
     * ═══════════════════════════════════════════════════════════════
     */

    configurarEventos() {
        // Actualización automática
        document.addEventListener('grizalumPanelControlActualizado', () => {
            console.log('🔄 Panel actualizado');
            this.cargarDatos();
            this.actualizarGraficos();
        });

        // Cambio de empresa
        document.addEventListener('grizalumCompanyChanged', () => {
            setTimeout(() => {
                this.cargarDatos();
                this.actualizarGraficos();
            }, 500);
        });

        // Botones
        this.configurarBotones();

        console.log('✅ Eventos configurados');
    }

    configurarBotones() {
        // Botón exportar
        const btnExportar = document.getElementById('btnExportarPanel');
        if (btnExportar) {
            btnExportar.addEventListener('click', async () => {
                await this.exportar();
            });
        }

        // Botón personalizar
        const btnPersonalizar = document.getElementById('btnPersonalizarPanel');
        if (btnPersonalizar) {
            btnPersonalizar.addEventListener('click', () => {
                this.personalizar();
            });
        }
    }

    async exportar() {
        try {
            console.log('📊 Exportando...');
            
            if (!window.panelControl || !window.panelControl.estaListo()) {
                alert('⚠️ Panel de Control no está listo');
                return;
            }
            
            if (typeof ExportadorPanelControl === 'undefined') {
                alert('⚠️ Sistema de exportación no disponible');
                return;
            }

            const info = window.panelControl.obtenerInfo();
            const flujoCaja = window.panelControl.obtenerDatosFlujoCaja(6);
            
            const datosExportar = {
                empresa: info.empresaActual || 'default',
                nivel: info.nivel?.score || 0,
                plan: info.plan?.nombre || 'Individual',
                datos: info.datos,
                flujoCaja: flujoCaja,
                categoriasIngresos: window.panelControl.obtenerDatosCategoria('ingreso'),
                categoriasGastos: window.panelControl.obtenerDatosCategoria('gasto')
            };

            const exportador = new ExportadorPanelControl();
            await exportador.exportar(datosExportar);
            
            alert('✅ Excel exportado exitosamente');
            
        } catch (error) {
            console.error('❌ Error exportando:', error);
            alert('❌ Error: ' + error.message);
        }
    }

    personalizar() {
        if (!window.PanelControlPlanes) {
            alert('⚠️ Sistema de planes no disponible');
            return;
        }
        
        const tieneFuncionalidad = window.PanelControlPlanes.tieneFuncionalidad('personalizarDashboard');
        
        if (!tieneFuncionalidad) {
            alert('⚠️ Personalización requiere plan Empresarial o superior');
            return;
        }
        
        alert('🎨 Sistema de personalización en desarrollo');
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * GRÁFICOS
     * ═══════════════════════════════════════════════════════════════
     */

    inicializarGraficos() {
        console.log('📊 Inicializando gráficos...');

        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js no disponible');
            return;
        }

        // Destruir gráficos anteriores
        this.destruirGraficos();

        // Configurar Chart.js
        Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";

        // Crear gráficos
        this.crearGraficoFlujoCajaPrincipal();
        this.crearGraficoDistribucionGastos();
        this.crearGraficoIngresosVsGastos();
        this.crearGraficoTendenciaMensual();

        console.log('✅ Gráficos creados');
    }

    destruirGraficos() {
        if (Object.keys(this.graficos).length > 0) {
            console.log('🧹 Destruyendo gráficos anteriores...');
            Object.values(this.graficos).forEach(grafico => {
                if (grafico && typeof grafico.destroy === 'function') {
                    try {
                        grafico.destroy();
                    } catch (e) {
                        // Ignorar errores
                    }
                }
            });
            this.graficos = {};
        }
    }

    crearGraficoFlujoCajaPrincipal() {
        const ctx = document.getElementById('graficoFlujoCajaPrincipal');
        if (!ctx) return;

        const datos = this.modulo.obtenerDatosFlujoCaja(6);

        this.graficos.principal = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.map(d => d.mes),
                datasets: [{
                    label: 'Ingresos',
                    data: datos.map(d => d.ingresos),
                    borderColor: this.colores.ingresos,
                    backgroundColor: this.colores.ingresos + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Gastos',
                    data: datos.map(d => d.gastos),
                    borderColor: this.colores.gastos,
                    backgroundColor: this.colores.gastos + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Balance',
                    data: datos.map(d => d.balance),
                    borderColor: this.colores.utilidad,
                    backgroundColor: this.colores.utilidad + '20',
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
                            font: { size: 13, weight: '600' },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: '700' },
                        bodyFont: { size: 13 },
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

    crearGraficoDistribucionGastos() {
        const ctx = document.getElementById('graficoDistribucionGastos');
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
                        '#3b82f6'
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
                            font: { size: 12 }
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

    crearGraficoIngresosVsGastos() {
        const ctx = document.getElementById('graficoIngresosVsGastos');
        if (!ctx) return;

        const datos = this.modulo.obtenerComparativaIngresosGastos(6);

        this.graficos.comparativa = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datos.labels,
                datasets: [{
                    label: 'Ingresos',
                    data: datos.ingresos,
                    backgroundColor: this.colores.ingresos + 'CC',
                    borderRadius: 8
                }, {
                    label: 'Gastos',
                    data: datos.gastos,
                    backgroundColor: this.colores.gastos + 'CC',
                    borderRadius: 8
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
                            font: { size: 12 }
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

    crearGraficoTendenciaMensual() {
        const ctx = document.getElementById('graficoTendenciaMensual');
        if (!ctx) return;

        const datos = this.modulo.obtenerFlujoDiario(30);

        this.graficos.tendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.labels,
                datasets: [{
                    label: 'Balance Diario',
                    data: datos.datos,
                    borderColor: this.colores.crecimiento,
                    backgroundColor: this.colores.crecimiento + '20',
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

        // Actualizar cada gráfico con nuevos datos
        if (this.graficos.principal) {
            const datos = this.modulo.obtenerDatosFlujoCaja(6);
            this.graficos.principal.data.labels = datos.map(d => d.mes);
            this.graficos.principal.data.datasets[0].data = datos.map(d => d.ingresos);
            this.graficos.principal.data.datasets[1].data = datos.map(d => d.gastos);
            this.graficos.principal.data.datasets[2].data = datos.map(d => d.balance);
            this.graficos.principal.update();
        }

        if (this.graficos.gastos) {
            const datos = this.modulo.obtenerDatosCategoria('gasto');
            this.graficos.gastos.data.labels = datos.map(d => d.categoria);
            this.graficos.gastos.data.datasets[0].data = datos.map(d => d.monto);
            this.graficos.gastos.update();
        }

        if (this.graficos.comparativa) {
            const datos = this.modulo.obtenerComparativaIngresosGastos(6);
            this.graficos.comparativa.data.labels = datos.labels;
            this.graficos.comparativa.data.datasets[0].data = datos.ingresos;
            this.graficos.comparativa.data.datasets[1].data = datos.gastos;
            this.graficos.comparativa.update();
        }

        if (this.graficos.tendencia) {
            const datos = this.modulo.obtenerFlujoDiario(30);
            this.graficos.tendencia.data.labels = datos.labels;
            this.graficos.tendencia.data.datasets[0].data = datos.datos;
            this.graficos.tendencia.update();
        }

        console.log('✅ Gráficos actualizados');
    }
}

// Inicialización
window.panelControlUI = new PanelControlUINuevo();

console.log('✅ [panel-control-ui-nuevo.js] v2.0 cargado');
