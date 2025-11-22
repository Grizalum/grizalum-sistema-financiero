/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - PANEL DE CONTROL UI v1.4 (100% CORREGIDO)
 * ✅ Loop infinito RESUELTO con límites de intentos
 * ✅ Timeouts en TODAS las esperas
 * ✅ Verificaciones robustas de panelControl
 * ✅ Manejo de errores completo
 * ✅ Sin errores de Canvas
 * ═══════════════════════════════════════════════════════════════════
 */

class PanelControlUI {
    constructor() {
        this.config = {
            version: '1.4.0',
            componente: 'PanelControlUI',
            debug: true,
            maxIntentos: 20,
            timeoutEspera: 10000 // 10 segundos
        };

        this.panelControl = null;
        this.graficos = {
            principal: null,
            distribucion: null,
            comparativa: null,
            tendencia: null
        };

        this.inicializando = false;
        this._intentosInicializacion = 0;
        this._graficosInicializados = false;

        this._log('info', '🎨 Panel Control UI v1.4 inicializando...');
        this._inicializar();
    }

    async _inicializar() {
        try {
            // Esperar a que panelControl esté listo CON TIMEOUT
            const conectado = await this._esperarPanelControl();
            
            if (conectado) {
                this._log('success', '✅ Panel Control UI listo');
            } else {
                this._log('error', '❌ No se pudo conectar a panelControl (timeout)');
            }
            
        } catch (error) {
            this._log('error', 'Error inicializando UI:', error);
        }
    }

    async _esperarPanelControl() {
        const startTime = Date.now();
        
        return new Promise((resolve) => {
            const verificar = () => {
                // Verificar timeout
                if (Date.now() - startTime > this.config.timeoutEspera) {
                    this._log('error', `❌ Timeout esperando panelControl (${this.config.timeoutEspera}ms)`);
                    resolve(false);
                    return;
                }

                if (window.panelControl && typeof window.panelControl.estaListo === 'function' && window.panelControl.estaListo()) {
                    this.panelControl = window.panelControl;
                    this._log('info', '✅ panelControl conectado');
                    resolve(true);
                } else {
                    setTimeout(verificar, 100);
                }
            };
            verificar();
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CARGA DE DATOS CON LOADING STATE Y VERIFICACIONES
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
            // ✅ VERIFICACIÓN ROBUSTA
            if (!this.panelControl) {
                this._log('error', 'panelControl no disponible');
                return;
            }

            if (typeof this.panelControl.obtenerDatos !== 'function') {
                this._log('error', 'panelControl.obtenerDatos no es una función');
                return;
            }

            const datos = this.panelControl.obtenerDatos();
            
            if (!datos) {
                this._log('error', 'No se obtuvieron datos de panelControl');
                return;
            }

            this._log('info', 'Datos obtenidos:', datos);

            // Verificar que los elementos existan
            const elementos = this._obtenerElementos();
            
            if (!elementos.todosExisten) {
                this._log('warn', 'Elementos HTML no encontrados, esperando...');
                const elementosListos = await this._esperarElementos();
                
                if (!elementosListos) {
                    this._log('error', 'Timeout esperando elementos HTML');
                    return;
                }
                
                // Reintentar con elementos listos
                return this.cargarDatos();
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
        try {
            // Ocultar skeletons primero
            this._ocultarSkeletons();
            
            // Actualizar y mostrar valores reales
            if (elementos.totalIngresos) {
                elementos.totalIngresos.textContent = `S/. ${this._formatearNumero(datos.ingresos || 0)}`;
                elementos.totalIngresos.style.display = 'block';
            }
            
            if (elementos.totalGastos) {
                elementos.totalGastos.textContent = `S/. ${this._formatearNumero(datos.gastos || 0)}`;
                elementos.totalGastos.style.display = 'block';
            }
            
            if (elementos.balanceTotal) {
                const balance = datos.balance || 0;
                elementos.balanceTotal.textContent = 
                    `${balance < 0 ? '-' : ''}S/. ${this._formatearNumero(Math.abs(balance))}`;
                elementos.balanceTotal.style.color = balance >= 0 ? 'var(--success)' : '#ef4444';
                elementos.balanceTotal.style.display = 'block';
            }
            
            if (elementos.metricaCrecimiento) {
                elementos.metricaCrecimiento.textContent = `+${(datos.crecimiento || 0).toFixed(1)}%`;
                elementos.metricaCrecimiento.style.display = 'block';
            }
        } catch (error) {
            this._log('error', 'Error actualizando métricas:', error);
        }
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
        try {
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
                const utilidad = datos.utilidad || 0;
                if (utilidad > 0) {
                    badgeUtilidad.innerHTML = '<i class="fas fa-arrow-up"></i> Positivo';
                    badgeUtilidad.className = 'metrica-badge badge-positivo';
                } else if (utilidad < 0) {
                    badgeUtilidad.innerHTML = '<i class="fas fa-arrow-down"></i> Negativo';
                    badgeUtilidad.className = 'metrica-badge badge-negativo';
                } else {
                    badgeUtilidad.innerHTML = '<i class="fas fa-minus"></i> Neutral';
                    badgeUtilidad.className = 'metrica-badge badge-neutral';
                }
                badgeUtilidad.style.display = 'block';
            }
        } catch (error) {
            this._log('error', 'Error actualizando badges:', error);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * INICIALIZACIÓN DE GRÁFICOS CON LÍMITE DE INTENTOS
     * ═══════════════════════════════════════════════════════════════
     */

    inicializarGraficos() {
        this._log('info', '📈 Inicializando gráficos...');

        // ⭐ CRÍTICO: Verificar que panelControl esté disponible CON LÍMITE
        if (!this.panelControl) {
            this._intentosInicializacion++;
            
            if (this._intentosInicializacion >= this.config.maxIntentos) {
                this._log('error', `❌ panelControl no disponible después de ${this.config.maxIntentos} intentos. Abortando.`);
                return;
            }
            
            this._log('warn', `⚠️ panelControl no disponible aún, reintentando... (${this._intentosInicializacion}/${this.config.maxIntentos})`);
            setTimeout(() => this.inicializarGraficos(), 500);
            return;
        }

        // ✅ Resetear contador cuando se encuentra
        this._intentosInicializacion = 0;

        // Verificar que sea una función válida
        if (typeof this.panelControl.obtenerDatosFlujoCaja !== 'function') {
            this._log('error', 'panelControl.obtenerDatosFlujoCaja no es una función');
            return;
        }

        if (typeof Chart === 'undefined') {
            this._log('error', 'Chart.js no está cargado');
            return;
        }

        // Prevenir inicialización múltiple simultánea
        if (this._graficosInicializados) {
            this._log('warn', 'Gráficos ya inicializados, destruyendo primero...');
            this.destruirGraficos();
        }

        try {
            // Configuración global de Chart.js
            Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
            Chart.defaults.color = '#8b92a7';

            // Destruir gráficos anteriores primero
            this.destruirGraficos();

            // Esperar un frame para que se libere memoria
            requestAnimationFrame(() => {
                try {
                    this._inicializarGraficoPrincipal();
                    this._inicializarGraficoDistribucion();
                    this._inicializarGraficoComparativa();
                    this._inicializarGraficoTendencia();
                    
                    this._graficosInicializados = true;
                    this._log('success', '✅ Gráficos inicializados');
                } catch (error) {
                    this._log('error', 'Error en requestAnimationFrame:', error);
                }
            });
        } catch (error) {
            this._log('error', 'Error inicializando gráficos:', error);
        }
    }

    _inicializarGraficoPrincipal() {
        const canvas = document.getElementById('graficoFlujoCajaPrincipal');
        if (!canvas) {
            this._log('warn', 'Canvas graficoFlujoCajaPrincipal no encontrado');
            return;
        }

        try {
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

            // ✅ Verificar que el método exista
            if (typeof this.panelControl.obtenerDatosFlujoCaja !== 'function') {
                this._log('error', 'panelControl.obtenerDatosFlujoCaja no disponible');
                return;
            }

            const datos = this.panelControl.obtenerDatosFlujoCaja(6);

            if (!datos || !Array.isArray(datos) || datos.length === 0) {
                this._log('warn', 'No hay datos de flujo de caja para mostrar');
                return;
            }

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
        } catch (error) {
            this._log('error', 'Error creando gráfico principal:', error);
        }
    }

    _inicializarGraficoDistribucion() {
        const canvas = document.getElementById('graficoDistribucionGastos');
        if (!canvas) {
            this._log('warn', 'Canvas graficoDistribucionGastos no encontrado');
            return;
        }

        try {
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

            // ✅ Verificar que el método exista
            if (typeof this.panelControl.obtenerDatosCategoria !== 'function') {
                this._log('error', 'panelControl.obtenerDatosCategoria no disponible');
                return;
            }

            const categorias = this.panelControl.obtenerDatosCategoria('gasto');
            
            if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
                this._log('warn', 'No hay categorías de gastos para mostrar');
                return;
            }

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
        } catch (error) {
            this._log('error', 'Error creando gráfico distribución:', error);
        }
    }

    _inicializarGraficoComparativa() {
        const canvas = document.getElementById('graficoIngresosVsGastos');
        if (!canvas) {
            this._log('warn', 'Canvas graficoIngresosVsGastos no encontrado');
            return;
        }

        try {
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

            // ✅ Verificar que el método exista
            if (typeof this.panelControl.obtenerComparativaIngresosGastos !== 'function') {
                this._log('error', 'panelControl.obtenerComparativaIngresosGastos no disponible');
                return;
            }

            const datos = this.panelControl.obtenerComparativaIngresosGastos(6);

            if (!datos || !datos.labels || !datos.ingresos || !datos.gastos) {
                this._log('warn', 'No hay datos comparativos para mostrar');
                return;
            }

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
        } catch (error) {
            this._log('error', 'Error creando gráfico comparativa:', error);
        }
    }

    _inicializarGraficoTendencia() {
        const canvas = document.getElementById('graficoTendenciaMensual');
        if (!canvas) {
            this._log('warn', 'Canvas graficoTendenciaMensual no encontrado');
            return;
        }

        try {
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

            // ✅ Verificar que el método exista
            if (typeof this.panelControl.obtenerDatosFlujoCaja !== 'function') {
                this._log('error', 'panelControl.obtenerDatosFlujoCaja no disponible');
                return;
            }

            const datos = this.panelControl.obtenerDatosFlujoCaja(6);

            if (!datos || !Array.isArray(datos) || datos.length === 0) {
                this._log('warn', 'No hay datos de tendencia para mostrar');
                return;
            }

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
        } catch (error) {
            this._log('error', 'Error creando gráfico tendencia:', error);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * UTILIDADES
     * ═══════════════════════════════════════════════════════════════
     */

    _formatearNumero(numero) {
        if (typeof numero !== 'number' || isNaN(numero)) {
            return '0.00';
        }
        
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
        try {
            await this.cargarDatos();
            this.inicializarGraficos();
        } catch (error) {
            this._log('error', 'Error en actualizar():', error);
        }
    }

    destruirGraficos() {
        this._log('info', '🧹 Destruyendo gráficos...');
        
        try {
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
            
            this._graficosInicializados = false;
            
            this._log('success', '✅ Todos los gráficos destruidos y limpiados');
        } catch (error) {
            this._log('error', 'Error en destruirGraficos():', error);
        }
    }

    limpiarYReinicializar() {
        this._log('info', '🔄 Limpieza y reinicialización completa...');
        
        try {
            // 1. Destruir gráficos existentes
            this.destruirGraficos();
            
            // 2. Esperar un frame para liberar recursos
            requestAnimationFrame(async () => {
                try {
                    // 3. Recargar datos
                    await this.cargarDatos();
                    
                    // 4. Recrear gráficos
                    requestAnimationFrame(() => {
                        this.inicializarGraficos();
                        this._log('success', '✅ Reinicialización completada');
                    });
                } catch (error) {
                    this._log('error', 'Error en reinicialización:', error);
                }
            });
        } catch (error) {
            this._log('error', 'Error en limpiarYReinicializar():', error);
        }
    }
}

// Inicialización global CON MANEJO DE ERRORES
try {
    window.panelControlUI = new PanelControlUI();
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎨 PANEL CONTROL UI v1.4 (100% CORREGIDO)                   ║
║  ✅ Loop infinito RESUELTO                                    ║
║  ✅ Timeouts en TODAS las esperas                            ║
║  ✅ Verificaciones robustas                                   ║
║  ✅ Sin errores de Canvas                                     ║
╚═══════════════════════════════════════════════════════════════╝
    `);
} catch (error) {
    console.error('❌ Error creando PanelControlUI:', error);
}
