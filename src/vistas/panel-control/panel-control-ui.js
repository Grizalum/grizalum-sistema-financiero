/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - PANEL DE CONTROL UI v1.3 (FIX CANVAS)
 * ✅ Carga rápida con loading state profesional
 * ✅ Compatible con panel-control-fix.js
 * ✅ FIX: Canvas is already in use - Verificación antes de crear gráficos
 * ═══════════════════════════════════════════════════════════════════
 */

class PanelControlUI {
    constructor() {
        this.config = {
            version: '1.3.0',
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

        this.inicializando = false;

        this._log('info', '🎨 Panel Control UI v1.3 inicializando...');
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
                    setTimeout(verificar, 100);
                }
            };
            verificar();
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CARGA DE DATOS CON LOADING STATE
     * ═══════════════════════════════════════════════════════════════
     */

    async cargarDatos() {
        if (this.inicializando) {
            this._log('warn', 'Ya hay una carga en proceso, ignorando...');
            return;
        }

        this.inicializando = true;
        this._log('info', '📊 Cargando datos en métricas...');

        try {
            if (!this.panelControl) {
                this._log('error', 'panelControl no disponible');
                this.inicializando = false;
                return;
            }

            const datos = this.panelControl.obtenerDatos();
            
            this._log('info', 'Datos obtenidos:', datos);

            // Verificar que los elementos existan
            const elementos = this._obtenerElementos();
            
            if (!elementos.todosExisten) {
                this._log('warn', 'Elementos HTML no encontrados, esperando...');
                await this._esperarElementos();
                return this.cargarDatos(); // Reintentar
            }

            // Actualizar métricas RÁPIDO
            this._actualizarMetricas(datos, elementos);

            // Actualizar badges
            this._actualizarBadges(datos);

           this._log('success', '✅ Métricas actualizadas');

        } catch (error) {
            this._log('error', 'Error cargando datos:', error);
        } finally {
            this.inicializando = false;
        }
    }

    _obtenerElementos() {
        const elementos = {
            totalIngresos: document.getElementById('totalIngresos'),
            totalGastos: document.getElementById('totalGastos'),
            balanceTotal: document.getElementById('balanceTotal'),
            metricaCrecimiento: document.getElementById('metrica-crecimiento'),
            todosExisten: false
        };

        elementos.todosExisten = 
            elementos.totalIngresos !== null &&
            elementos.totalGastos !== null &&
            elementos.balanceTotal !== null &&
            elementos.metricaCrecimiento !== null;

        return elementos;
    }

    async _esperarElementos(timeout = 5000) {
        const start = Date.now();
        
        return new Promise((resolve) => {
            const verificar = () => {
                const elementos = this._obtenerElementos();
                
                if (elementos.todosExisten) {
                    resolve(true);
                } else if (Date.now() - start > timeout) {
                    this._log('error', 'Timeout esperando elementos HTML');
                    resolve(false);
                } else {
                    setTimeout(verificar, 100);
                }
            };
            verificar();
        });
    }

    _actualizarMetricas(datos, elementos) {
    // Ocultar skeletons primero
    this._ocultarSkeletons();
    
    // Actualizar y mostrar valores reales
    elementos.totalIngresos.textContent = `S/. ${this._formatearNumero(datos.ingresos)}`;
    elementos.totalIngresos.style.display = 'block';
    
    elementos.totalGastos.textContent = `S/. ${this._formatearNumero(datos.gastos)}`;
    elementos.totalGastos.style.display = 'block';
    
    elementos.balanceTotal.textContent = 
        `${datos.balance < 0 ? '-' : ''}S/. ${this._formatearNumero(Math.abs(datos.balance))}`;
    elementos.balanceTotal.style.color = datos.balance >= 0 ? 'var(--success)' : '#ef4444';
    elementos.balanceTotal.style.display = 'block';
    
    elementos.metricaCrecimiento.textContent = `+${datos.crecimiento.toFixed(1)}%`;
    elementos.metricaCrecimiento.style.display = 'block';
}
    _ocultarSkeletons() {
    const skeletons = [
        'skeleton-ingresos',
        'skeleton-gastos', 
        'skeleton-balance',
        'skeleton-crecimiento',
        'skeleton-badge-ingresos',
        'skeleton-badge-gastos',
        'skeleton-badge-balance'
    ];
    
    skeletons.forEach(id => {
        const skeleton = document.getElementById(id);
        if (skeleton) {
            skeleton.style.display = 'none';
        }
    });
}

    _actualizarBadges(datos) {
    // Badge de ingresos
    const badgeIngresos = document.getElementById('badge-ingresos');
    if (badgeIngresos && datos.ingresos > 0) {
        badgeIngresos.innerHTML = '<i class="fas fa-arrow-up"></i> Activo';
        badgeIngresos.className = 'metrica-badge badge-positivo';
        badgeIngresos.style.display = 'block';
    }

    // Badge de gastos
    const badgeGastos = document.getElementById('badge-gastos');
    if (badgeGastos && datos.gastos > 0) {
        badgeGastos.innerHTML = `<i class="fas fa-arrow-down"></i> ${datos.cantidadGastos || 0} registros`;
        badgeGastos.className = 'metrica-badge badge-negativo';
        badgeGastos.style.display = 'block';
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
        badgeUtilidad.style.display = 'block';
    }
}

    /**
     * ═══════════════════════════════════════════════════════════════
     * INICIALIZACIÓN DE GRÁFICOS CON MEJOR TIMING
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

        // Destruir gráficos anteriores primero
        this.destruirGraficos();

        // Esperar un frame para que se libere memoria
        requestAnimationFrame(() => {
            this._inicializarGraficoPrincipal();
            this._inicializarGraficoDistribucion();
            this._inicializarGraficoComparativa();
            this._inicializarGraficoTendencia();
            this._log('success', '✅ Gráficos inicializados');
        });
    }

    _inicializarGraficoPrincipal() {
        const canvas = document.getElementById('graficoFlujoCajaPrincipal');
        if (!canvas) {
            this._log('warn', 'Canvas graficoFlujoCajaPrincipal no encontrado');
            return;
        }

        // ⭐ CRÍTICO: Destruir cualquier gráfico existente en este canvas
        const existente = Chart.getChart(canvas);
        if (existente) {
            this._log('warn', '⚠️ Gráfico existente encontrado, destruyendo...');
            try {
                existente.destroy();
            } catch (e) {
                this._log('error', 'Error destruyendo gráfico existente:', e);
            }
            
            // Esperar un frame para que se libere completamente
            return requestAnimationFrame(() => this._inicializarGraficoPrincipal());
        }

        const datos = this.panelControl.obtenerDatosFlujoCaja(6);

        const ctx = canvas.getContext('2d');
        
        // ⭐ Limpiar canvas antes de crear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
                animation: {
                    duration: 750
                },
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
        
        this._log('success', '✅ Gráfico principal creado');
    }

    _inicializarGraficoDistribucion() {
        const canvas = document.getElementById('graficoDistribucionGastos');
        if (!canvas) {
            this._log('warn', 'Canvas graficoDistribucionGastos no encontrado');
            return;
        }

        // ⭐ CRÍTICO: Destruir cualquier gráfico existente en este canvas
        const existente = Chart.getChart(canvas);
        if (existente) {
            this._log('warn', '⚠️ Gráfico distribución existente, destruyendo...');
            try {
                existente.destroy();
            } catch (e) {
                this._log('error', 'Error destruyendo gráfico:', e);
            }
            return requestAnimationFrame(() => this._inicializarGraficoDistribucion());
        }

        const categorias = this.panelControl.obtenerDatosCategoria('gasto');
        const top5 = categorias.slice(0, 5);

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
                animation: {
                    duration: 750
                },
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
        
        this._log('success', '✅ Gráfico distribución creado');
    }

    _inicializarGraficoComparativa() {
        const canvas = document.getElementById('graficoIngresosVsGastos');
        if (!canvas) {
            this._log('warn', 'Canvas graficoIngresosVsGastos no encontrado');
            return;
        }

        // ⭐ CRÍTICO: Destruir cualquier gráfico existente en este canvas
        const existente = Chart.getChart(canvas);
        if (existente) {
            this._log('warn', '⚠️ Gráfico comparativa existente, destruyendo...');
            try {
                existente.destroy();
            } catch (e) {
                this._log('error', 'Error destruyendo gráfico:', e);
            }
            return requestAnimationFrame(() => this._inicializarGraficoComparativa());
        }

        const datos = this.panelControl.obtenerComparativaIngresosGastos(6);

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
                animation: {
                    duration: 750
                },
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
        
        this._log('success', '✅ Gráfico comparativa creado');
    }

    _inicializarGraficoTendencia() {
        const canvas = document.getElementById('graficoTendenciaMensual');
        if (!canvas) {
            this._log('warn', 'Canvas graficoTendenciaMensual no encontrado');
            return;
        }

        // ⭐ CRÍTICO: Destruir cualquier gráfico existente en este canvas
        const existente = Chart.getChart(canvas);
        if (existente) {
            this._log('warn', '⚠️ Gráfico tendencia existente, destruyendo...');
            try {
                existente.destroy();
            } catch (e) {
                this._log('error', 'Error destruyendo gráfico:', e);
            }
            return requestAnimationFrame(() => this._inicializarGraficoTendencia());
        }

        const datos = this.panelControl.obtenerDatosFlujoCaja(6);

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
                animation: {
                    duration: 750
                },
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
        
        this._log('success', '✅ Gráfico tendencia creado');
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

    async actualizar() {
        await this.cargarDatos();
        this.inicializarGraficos();
    }

    destruirGraficos() {
        this._log('info', '🧹 Destruyendo gráficos...');
        
        // 1. Destruir usando referencias guardadas
        Object.entries(this.graficos).forEach(([nombre, grafico]) => {
            if (grafico) {
                try {
                    grafico.destroy();
                    this._log('info', `  ✅ ${nombre} destruido`);
                } catch (e) {
                    this._log('warn', `  ⚠️ Error destruyendo ${nombre}:`, e.message);
                }
            }
        });
        
        // 2. Destruir usando Chart.getChart() para limpiar huérfanos
        const canvasIds = [
            'graficoFlujoCajaPrincipal',
            'graficoDistribucionGastos',
            'graficoIngresosVsGastos',
            'graficoTendenciaMensual'
        ];
        
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                // Obtener instancia de Chart.js asociada al canvas
                const chartInstance = Chart.getChart(canvas);
                if (chartInstance) {
                    try {
                        chartInstance.destroy();
                        this._log('info', `  ✅ Canvas ${id} limpiado`);
                    } catch (e) {
                        // Ignorar errores de canvas ya destruidos
                    }
                }
                
                // ⭐ Limpiar el canvas manualmente
                try {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Resetear tamaño para forzar redibujado
                    canvas.width = canvas.width;
                } catch (e) {
                    // Ignorar si el canvas ya no existe
                }
            }
        });
        
        // 3. Resetear referencias
        this.graficos = {
            principal: null,
            distribucion: null,
            comparativa: null,
            tendencia: null
        };
        
        this._log('success', '✅ Todos los gráficos destruidos y limpiados');
    }

    limpiarYReinicializar() {
        this._log('info', '🔄 Limpieza y reinicialización completa...');
        
        // 1. Destruir gráficos existentes
        this.destruirGraficos();
        
        // 2. Esperar un frame para liberar recursos
        requestAnimationFrame(async () => {
            // 3. Recargar datos
            await this.cargarDatos();
            
            // 4. Recrear gráficos
            requestAnimationFrame(() => {
                this.inicializarGraficos();
                this._log('success', '✅ Reinicialización completada');
            });
        });
    }
}

// Inicialización global CON MANEJO DE ERRORES
try {
    window.panelControlUI = new PanelControlUI();
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎨 PANEL CONTROL UI v1.3 (FIX CANVAS)                       ║
║  ✅ Cargado exitosamente                                      ║
║  ⚡ Carga rápida + Loading state                             ║
║  🔧 Canvas is already in use - RESUELTO                      ║
╚═══════════════════════════════════════════════════════════════╝
    `);
} catch (error) {
    console.error('❌ Error creando PanelControlUI:', error);
}
