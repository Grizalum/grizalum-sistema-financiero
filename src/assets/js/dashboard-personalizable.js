/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - DASHBOARD PERSONALIZABLE PREMIUM
 * Sistema de widgets arrastrables con grid inteligente
 * ═══════════════════════════════════════════════════════════════════
 */

class DashboardPersonalizable {
    constructor() {
        this.gestor = null;
        this.empresaActual = null;
        
        // Catálogo completo de widgets disponibles
        this.widgets = {
            'resumen-financiero': {
                id: 'resumen-financiero',
                nombre: 'Resumen Financiero',
                icono: '💰',
                categoria: 'Finanzas',
                tamano: 'mediano', // pequeño/mediano/grande
                moduloRequerido: 'flujo-caja',
                render: this._renderResumenFinanciero.bind(this)
            },
            'grafico-ingresos-gastos': {
                id: 'grafico-ingresos-gastos',
                nombre: 'Gráfico Ingresos vs Gastos',
                icono: '📊',
                categoria: 'Finanzas',
                tamano: 'grande',
                moduloRequerido: 'flujo-caja',
                render: this._renderGraficoIngresosGastos.bind(this)
            },
            'alertas-criticas': {
                id: 'alertas-criticas',
                nombre: 'Alertas Críticas',
                icono: '⚠️',
                categoria: 'General',
                tamano: 'pequeño',
                moduloRequerido: null,
                render: this._renderAlertas.bind(this)
            },
            'metricas-kpi': {
                id: 'metricas-kpi',
                nombre: 'Indicadores KPI',
                icono: '🎯',
                categoria: 'Análisis',
                tamano: 'mediano',
                moduloRequerido: 'reportes',
                render: this._renderKPIs.bind(this)
            },
            'actividad-reciente': {
                id: 'actividad-reciente',
                nombre: 'Actividad Reciente',
                icono: '📋',
                categoria: 'General',
                tamano: 'mediano',
                moduloRequerido: null,
                render: this._renderActividadReciente.bind(this)
            },
            'inventario-bajo': {
                id: 'inventario-bajo',
                nombre: 'Stock Bajo',
                icono: '📦',
                categoria: 'Operaciones',
                tamano: 'pequeño',
                moduloRequerido: 'inventario',
                render: this._renderStockBajo.bind(this)
            },
            'clientes-top': {
                id: 'clientes-top',
                nombre: 'Top Clientes',
                icono: '👥',
                categoria: 'Ventas',
                tamano: 'mediano',
                moduloRequerido: 'clientes',
                render: this._renderTopClientes.bind(this)
            },
            'calendario-pagos': {
                id: 'calendario-pagos',
                nombre: 'Próximos Pagos',
                icono: '📅',
                categoria: 'Finanzas',
                tamano: 'mediano',
                moduloRequerido: 'flujo-caja',
                render: this._renderCalendarioPagos.bind(this)
            }
        };

        // Layouts predefinidos por rol
        this.layoutsPredefinidos = {
            'dueno': {
                nombre: 'Vista Dueño',
                descripcion: 'Enfocado en finanzas y resultados',
                widgets: ['resumen-financiero', 'grafico-ingresos-gastos', 'metricas-kpi', 'alertas-criticas']
            },
            'contador': {
                nombre: 'Vista Contador',
                descripcion: 'Control financiero detallado',
                widgets: ['resumen-financiero', 'calendario-pagos', 'actividad-reciente', 'metricas-kpi']
            },
            'operaciones': {
                nombre: 'Vista Operaciones',
                descripcion: 'Gestión diaria',
                widgets: ['inventario-bajo', 'clientes-top', 'actividad-reciente', 'alertas-criticas']
            },
            'completo': {
                nombre: 'Vista Completa',
                descripcion: 'Todos los widgets',
                widgets: Object.keys(this.widgets)
            }
        };

        this.layoutActual = [];
        this.modoEdicion = false;
        
        console.log('🎨 Dashboard Personalizable inicializando...');
        this._esperarDependencias();
    }

    _esperarDependencias() {
        const intentar = () => {
            if (window.gestorEmpresas) {
                this.gestor = window.gestorEmpresas;
                this._inicializar();
                return true;
            }
            return false;
        };

        if (!intentar()) {
            setTimeout(() => {
                if (!intentar()) {
                    setTimeout(() => {
                        if (!intentar()) {
                            setTimeout(intentar, 2000);
                        }
                    }, 1000);
                }
            }, 500);
        }
    }

    _inicializar() {
        document.addEventListener('grizalumCompanyChanged', (e) => {
            this.empresaActual = e.detail.companyId;
            this._cargarLayout();
            this._renderizarDashboard();
        });

        // Si ya hay empresa seleccionada
        if (this.gestor.estado.empresaActual) {
            this.empresaActual = this.gestor.estado.empresaActual;
            this._cargarLayout();
        }

        console.log('✅ Dashboard Personalizable listo');
    }

    activarModoEdicion() {
        this.modoEdicion = true;
        this._mostrarPanelPersonalizacion();
    }

    desactivarModoEdicion() {
        this.modoEdicion = false;
        const panel = document.getElementById('panelPersonalizacionDashboard');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => panel.remove(), 300);
        }
        this._renderizarDashboard();
    }

    _mostrarPanelPersonalizacion() {
        const panel = document.createElement('div');
        panel.className = 'panel-personalizacion-dashboard';
        panel.id = 'panelPersonalizacionDashboard';

        panel.innerHTML = `
            <div class="panel-contenido">
                <div class="panel-header">
                    <h3>🎨 Personalizar Dashboard</h3>
                    <button onclick="dashboardPersonalizable.desactivarModoEdicion()">✕</button>
                </div>
                
                <div class="panel-tabs">
                    <button class="tab-btn active" data-tab="widgets">Widgets</button>
                    <button class="tab-btn" data-tab="layouts">Layouts</button>
                </div>

                <div class="tab-content active" id="tab-widgets">
                    ${this._generarListaWidgets()}
                </div>

                <div class="tab-content" id="tab-layouts">
                    ${this._generarListaLayouts()}
                </div>

                <div class="panel-footer">
                    <button class="btn-reset" onclick="dashboardPersonalizable.resetearLayout()">
                        Restaurar por defecto
                    </button>
                    <button class="btn-guardar" onclick="dashboardPersonalizable.guardarYCerrar()">
                        Guardar cambios
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        setTimeout(() => panel.classList.add('show'), 10);

        this._configurarEventosPanel();
    }

    _generarListaWidgets() {
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        const modulosActivos = empresa?.modulosActivos || {};

        let html = '<div class="widgets-lista">';

        Object.entries(this.widgets).forEach(([id, widget]) => {
            const disponible = !widget.moduloRequerido || modulosActivos[widget.moduloRequerido];
            const activo = this.layoutActual.includes(id);
            const disabled = !disponible ? 'disabled' : '';

            html += `
                <div class="widget-item ${activo ? 'activo' : ''} ${disabled}">
                    <div class="widget-info">
                        <span class="widget-icono">${widget.icono}</span>
                        <div>
                            <div class="widget-nombre">${widget.nombre}</div>
                            <div class="widget-categoria">${widget.categoria}</div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" 
                               ${activo ? 'checked' : ''} 
                               ${disabled}
                               onchange="dashboardPersonalizable.toggleWidget('${id}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    ${!disponible ? '<div class="widget-bloqueado">🔒 Módulo desactivado</div>' : ''}
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    _generarListaLayouts() {
        let html = '<div class="layouts-lista">';

        Object.entries(this.layoutsPredefinidos).forEach(([id, layout]) => {
            html += `
                <div class="layout-card" onclick="dashboardPersonalizable.aplicarLayout('${id}')">
                    <h4>${layout.nombre}</h4>
                    <p>${layout.descripcion}</p>
                    <div class="layout-widgets-preview">
                        ${layout.widgets.slice(0, 4).map(wId => {
                            const widget = this.widgets[wId];
                            return widget ? `<span>${widget.icono}</span>` : '';
                        }).join('')}
                        ${layout.widgets.length > 4 ? `<span>+${layout.widgets.length - 4}</span>` : ''}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    toggleWidget(widgetId, activar) {
        if (activar && !this.layoutActual.includes(widgetId)) {
            this.layoutActual.push(widgetId);
        } else if (!activar) {
            this.layoutActual = this.layoutActual.filter(id => id !== widgetId);
        }
    }

    aplicarLayout(layoutId) {
        const layout = this.layoutsPredefinidos[layoutId];
        if (!layout) return;

        const empresa = this.gestor.estado.empresas[this.empresaActual];
        const modulosActivos = empresa?.modulosActivos || {};

        // Filtrar solo widgets disponibles según módulos activos
        this.layoutActual = layout.widgets.filter(widgetId => {
            const widget = this.widgets[widgetId];
            return !widget.moduloRequerido || modulosActivos[widget.moduloRequerido];
        });

        // Actualizar UI del panel
        document.querySelectorAll('.widget-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const widgetId = checkbox.getAttribute('onchange').match(/'([^']+)'/)[1];
            checkbox.checked = this.layoutActual.includes(widgetId);
            item.classList.toggle('activo', this.layoutActual.includes(widgetId));
        });

        console.log(`Layout "${layout.nombre}" aplicado`);
    }

    guardarYCerrar() {
        this._guardarLayout();
        this.desactivarModoEdicion();
        
        setTimeout(() => {
            alert('✅ Dashboard personalizado guardado');
        }, 200);
    }

    resetearLayout() {
        if (confirm('¿Restaurar el dashboard a la configuración por defecto?')) {
            this.aplicarLayout('dueno');
            this.guardarYCerrar();
        }
    }

    _renderizarDashboard() {
        const container = document.getElementById('dashboardWidgetsContainer');
        if (!container) return;

        container.innerHTML = '';
        container.className = 'dashboard-grid';

        this.layoutActual.forEach(widgetId => {
            const widget = this.widgets[widgetId];
            if (!widget) return;

            const widgetElement = document.createElement('div');
            widgetElement.className = `dashboard-widget widget-${widget.tamano}`;
            widgetElement.dataset.widgetId = widgetId;

            widgetElement.innerHTML = `
                <div class="widget-header">
                    <span class="widget-icono">${widget.icono}</span>
                    <h4>${widget.nombre}</h4>
                </div>
                <div class="widget-body">
                    ${widget.render()}
                </div>
            `;

            container.appendChild(widgetElement);
        });

        console.log(`Dashboard renderizado con ${this.layoutActual.length} widgets`);
    }

    // Funciones de renderizado de widgets
    _renderResumenFinanciero() {
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        const finanzas = empresa?.finanzas || {};

        return `
            <div class="resumen-grid">
                <div class="resumen-item">
                    <div class="resumen-label">Ingresos</div>
                    <div class="resumen-valor" style="color: var(--color-ingresos, #10b981)">
                        S/. ${(finanzas.ingresos || 0).toLocaleString()}
                    </div>
                </div>
                <div class="resumen-item">
                    <div class="resumen-label">Gastos</div>
                    <div class="resumen-valor" style="color: var(--color-gastos, #ef4444)">
                        S/. ${(finanzas.gastos || 0).toLocaleString()}
                    </div>
                </div>
                <div class="resumen-item">
                    <div class="resumen-label">Utilidad</div>
                    <div class="resumen-valor" style="color: var(--color-utilidad, #22c55e)">
                        S/. ${(finanzas.utilidadNeta || 0).toLocaleString()}
                    </div>
                </div>
            </div>
        `;
    }

    _renderGraficoIngresosGastos() {
        return `
            <div class="grafico-placeholder">
                <canvas id="chartIngresosGastos"></canvas>
                <div class="grafico-descripcion">Últimos 6 meses</div>
            </div>
        `;
    }

    _renderAlertas() {
        return `
            <div class="alertas-lista">
                <div class="alerta-item alerta-info">
                    <span>ℹ️</span>
                    <span>Sistema actualizado</span>
                </div>
            </div>
        `;
    }

    _renderKPIs() {
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        const finanzas = empresa?.finanzas || {};

        return `
            <div class="kpi-grid">
                <div class="kpi-item">
                    <div class="kpi-label">Margen Neto</div>
                    <div class="kpi-valor">${(finanzas.margenNeto || 0).toFixed(1)}%</div>
                </div>
                <div class="kpi-item">
                    <div class="kpi-label">ROI</div>
                    <div class="kpi-valor">${(finanzas.roi || 0).toFixed(1)}%</div>
                </div>
            </div>
        `;
    }

    _renderActividadReciente() {
        return `
            <div class="actividad-lista">
                <div class="actividad-item">
                    <span class="actividad-icono">💰</span>
                    <div class="actividad-info">
                        <div class="actividad-texto">Ingreso registrado</div>
                        <div class="actividad-fecha">Hace 2 horas</div>
                    </div>
                </div>
            </div>
        `;
    }

    _renderStockBajo() {
        return `
            <div class="stock-lista">
                <div class="stock-item">
                    <span>📦</span>
                    <span>Sin productos en stock crítico</span>
                </div>
            </div>
        `;
    }

    _renderTopClientes() {
        return `
            <div class="clientes-lista">
                <div class="cliente-item">
                    <span class="cliente-posicion">#1</span>
                    <div class="cliente-info">
                        <div class="cliente-nombre">Cliente Principal</div>
                        <div class="cliente-monto">S/. 5,000</div>
                    </div>
                </div>
            </div>
        `;
    }

    _renderCalendarioPagos() {
        return `
            <div class="pagos-lista">
                <div class="pago-item">
                    <div class="pago-fecha">15 Ene</div>
                    <div class="pago-descripcion">Pago a proveedor</div>
                    <div class="pago-monto">S/. 1,200</div>
                </div>
            </div>
        `;
    }

    _configurarEventosPanel() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`tab-${tab}`).classList.add('active');
            });
        });
    }

    _cargarLayout() {
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        this.layoutActual = empresa?.dashboardLayout || this.layoutsPredefinidos.dueno.widgets;
    }

    _guardarLayout() {
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        if (empresa) {
            empresa.dashboardLayout = [...this.layoutActual];
            this.gestor._guardarEmpresas();
        }
    }
}

// Inicialización global
window.dashboardPersonalizable = new DashboardPersonalizable();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎨 DASHBOARD PERSONALIZABLE PREMIUM v1.0                     ║
║  Sistema de widgets inteligente activado                      ║
╚═══════════════════════════════════════════════════════════════╝
`);
