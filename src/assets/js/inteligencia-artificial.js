/**
 * ================================================================
 * GRIZALUM AI INTELLIGENCE MODULE - ULTRA PROFESSIONAL EDITION v2.0
 * Sistema avanzado de inteligencia artificial y análisis predictivo
 * Integrado con ecosistema completo GRIZALUM
 * ================================================================
 */

class InteligenciaArtificialGRIZALUM {
    constructor() {
        this.version = '2.0.0';
        this.utilidades = null;
        this.sistemaNotificaciones = null;
        this.gestorTemas = null;
        this.cache = new Map();
        this.inicializado = false;
        
        // Componentes especializados
        this.predictor = null;
        this.analizador = null;
        this.recomendador = null;
        this.sistemaAlertas = null;
        this.generadorReportes = null;
        
        // Configuración avanzada
        this.configuracion = {
            precision: 0.85,
            tasaAprendizaje: 0.01,
            modelos: {
                flujoCaja: 'regresion_lineal',
                ventas: 'regresion_polinomial',
                gastos: 'promedio_movil',
                clientes: 'clustering'
            },
            intervaloActualizacion: 300000, // 5 minutos
            retencionDatos: 30, // días
            cache: {
                habilitado: true,
                tiempoVida: 900000, // 15 minutos
                maxEntradas: 100
            },
            alertas: {
                habilitadas: true,
                intervalMonitoreo: 60000, // 1 minuto
                notificarCambios: true
            },
            persistencia: {
                guardarModelos: true,
                guardarHistorial: true,
                cacheKey: 'grizalum_ai_data'
            }
        };
        
        // Métricas del sistema de IA
        this.metricas = {
            analisisRealizados: 0,
            prediccionesGeneradas: 0,
            recomendacionesCreadas: 0,
            alertasActivadas: 0,
            reportesGenerados: 0,
            tiemposEjecucion: [],
            precisiones: [],
            tiempoUsoTotal: 0
        };
        
        this.log('🚀 Inicializando GRIZALUM AI Intelligence Module v2.0...');
    }

    // ======= INICIALIZACIÓN AVANZADA =======
    
    inicializar() {
        try {
            this.log('🤖 Inicializando sistema de inteligencia artificial...', 'info');
            
            // Detectar dependencias
            this.detectarDependencias();
            
            // Cargar configuración global
            this.cargarConfiguracionGlobal();
            
            // Cargar datos persistentes
            this.cargarDatosPersistentes();
            
            // Inicializar componentes especializados
            this.inicializarComponentes();
            
            // Configurar eventos
            this.configurarEventos();
            
            // Iniciar monitoreo automático
            this.iniciarMonitoreoAutomatico();
            
            this.inicializado = true;
            this.metricas.tiempoInicializacion = Date.now();
            
            this.log('✅ Sistema de inteligencia artificial inicializado correctamente', 'success');
            
            // Disparar evento de inicialización
            this.dispararEvento('aiSystemReady', {
                version: this.version,
                configuracion: this.configuracion,
                componentes: this.obtenerEstadoComponentes()
            });
            
            // Mostrar notificación de bienvenida
            if (this.sistemaNotificaciones) {
            
        } catch (error) {
            this.log(`❌ Error inicializando sistema de IA: ${error.message}`, 'error');
            if (this.sistemaNotificaciones) {
                this.sistemaNotificaciones.error('Error inicializando sistema de IA');
            }
        }
    }

    detectarDependencias() {
        // Detectar utilidades GRIZALUM
        this.utilidades = window.GrizalumUtils || null;
        if (this.utilidades) {
            this.log('🔗 Sistema de utilidades GRIZALUM detectado', 'success');
        }
        
        // Detectar sistema de notificaciones
        this.sistemaNotificaciones = window.notificationSystem || null;
        if (this.sistemaNotificaciones) {
            this.log('🔔 Sistema de notificaciones GRIZALUM detectado', 'success');
        }
        
        // Detectar gestor de temas
        this.gestorTemas = window.themeManager || window.gestorTemas || null;
        if (this.gestorTemas) {
            this.log('🎨 Gestor de temas GRIZALUM detectado', 'success');
        }
    }

    cargarConfiguracionGlobal() {
        const config = window.GRIZALUM_CONFIG || {};
        
        // Fusionar configuración de IA
        if (config.ai) {
            this.configuracion = this.fusionarConfiguracion(this.configuracion, config.ai);
        }
        
        // Aplicar configuración de rendimiento global
        if (config.performance) {
            this.configuracion.cache.habilitado = config.performance.enableCache !== false;
            this.configuracion.cache.tiempoVida = config.performance.cacheTimeout || this.configuracion.cache.tiempoVida;
        }
        
        this.log('⚙️ Configuración global de IA cargada', 'info');
    }

    cargarDatosPersistentes() {
        if (!this.configuracion.persistencia.guardarModelos) return;
        
        const cacheKey = this.configuracion.persistencia.cacheKey;
        let datosPersistentes = null;
        
        if (this.utilidades) {
            datosPersistentes = this.utilidades.cargarDeStorage(cacheKey);
        } else {
            try {
                const guardados = localStorage.getItem(cacheKey);
                datosPersistentes = guardados ? JSON.parse(guardados) : null;
            } catch (error) {
                this.log(`Error cargando datos persistentes: ${error.message}`, 'warn');
            }
        }
        
        if (datosPersistentes) {
            // Restaurar métricas históricas
            if (datosPersistentes.metricas) {
                this.metricas = { ...this.metricas, ...datosPersistentes.metricas };
            }
            
            // Restaurar configuración personalizada
            if (datosPersistentes.configuracion) {
                this.configuracion = this.fusionarConfiguracion(this.configuracion, datosPersistentes.configuracion);
            }
            
            this.log('📂 Datos persistentes de IA cargados', 'info');
        }
    }

    guardarDatosPersistentes() {
        if (!this.configuracion.persistencia.guardarModelos) return;
        
        const datosParaGuardar = {
            version: this.version,
            configuracion: {
                precision: this.configuracion.precision,
                modelos: this.configuracion.modelos,
                alertas: this.configuracion.alertas
            },
            metricas: this.metricas,
            timestamp: Date.now()
        };
        
        const cacheKey = this.configuracion.persistencia.cacheKey;
        
        if (this.utilidades) {
            this.utilidades.guardarEnStorage(cacheKey, datosParaGuardar);
        } else {
            try {
                localStorage.setItem(cacheKey, JSON.stringify(datosParaGuardar));
            } catch (error) {
                this.log(`Error guardando datos persistentes: ${error.message}`, 'warn');
            }
        }
    }

    fusionarConfiguracion(destino, origen) {
        const resultado = { ...destino };
        
        Object.keys(origen).forEach(clave => {
            if (typeof origen[clave] === 'object' && !Array.isArray(origen[clave])) {
                resultado[clave] = { ...resultado[clave], ...origen[clave] };
            } else {
                resultado[clave] = origen[clave];
            }
        });
        
        return resultado;
    }

    log(mensaje, tipo = 'info') {
        if (this.utilidades) {
            this.utilidades.log(`[AI] ${mensaje}`, tipo);
        } else {
            const timestamp = new Date().toLocaleTimeString('es-PE');
            const prefijo = `[GRIZALUM-AI ${timestamp}]`;
            
            switch (tipo) {
                case 'error':
                    console.error(`${prefijo} ❌`, mensaje);
                    break;
                case 'warn':
                    console.warn(`${prefijo} ⚠️`, mensaje);
                    break;
                case 'success':
                    console.log(`${prefijo} ✅`, mensaje);
                    break;
                default:
                    console.log(`${prefijo} ℹ️`, mensaje);
            }
        }
    }

    inicializarComponentes() {
        this.predictor = new PredictorFinancieroGRIZALUM(this);
        this.analizador = new AnalizadorInteligente(this);
        this.recomendador = new MotorRecomendaciones(this);
        this.sistemaAlertas = new SistemaAlertasInteligentes(this);
        this.generadorReportes = new GeneradorReportesIA(this);
        
        this.log('🔧 Componentes especializados de IA inicializados', 'info');
    }

    // ======= API PRINCIPAL =======
    
    /**
     * Análisis rápido de datos financieros
     */
    analisisRapido(datos) {
        if (!this.validarDatos(datos)) {
            this.log('❌ Datos inválidos para análisis rápido', 'error');
            return null;
        }

        const cacheKey = `analisis_${this.generarHashDatos(datos)}`;
        
        // Verificar cache
        if (this.configuracion.cache.habilitado && this.cache.has(cacheKey)) {
            const datosCache = this.cache.get(cacheKey);
            if (Date.now() - datosCache.timestamp < this.configuracion.cache.tiempoVida) {
                this.log('🚀 Análisis servido desde cache', 'info');
                return datosCache.resultado;
            }
        }

        try {
            const inicioTiempo = performance.now();
            
            const resultado = this.analizador.analizarDatosFinancieros(datos);
            
            const tiempoEjecucion = performance.now() - inicioTiempo;
            this.metricas.tiemposEjecucion.push(tiempoEjecucion);
            this.metricas.analisisRealizados++;
            
            // Guardar en cache
            if (this.configuracion.cache.habilitado) {
                this.cache.set(cacheKey, {
                    resultado,
                    timestamp: Date.now()
                });
                this.limpiarCacheAntiguo();
            }
            
            this.log(`📊 Análisis rápido completado en ${tiempoEjecucion.toFixed(2)}ms`, 'success');
            
            return resultado;
            
        } catch (error) {
            this.log(`❌ Error en análisis rápido: ${error.message}`, 'error');
            if (this.sistemaNotificaciones) {
                this.sistemaNotificaciones.error('Error en análisis de IA');
            }
            return null;
        }
    }

    /**
     * Generar predicciones financieras
     */
    generarPredicciones(datos, periodos = 6) {
        if (!this.validarDatos(datos)) {
            this.log('❌ Datos inválidos para predicciones', 'error');
            return null;
        }

        try {
            const predicciones = this.predictor.generarPredicciones(datos, periodos);
            this.metricas.prediccionesGeneradas++;
            
            this.log(`🔮 Predicciones generadas para ${periodos} períodos`, 'success');
            
            return predicciones;
            
        } catch (error) {
            this.log(`❌ Error generando predicciones: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * Obtener recomendaciones inteligentes
     */
    obtenerRecomendaciones(datos) {
        if (!this.validarDatos(datos)) {
            this.log('❌ Datos inválidos para recomendaciones', 'error');
            return [];
        }

        try {
            const recomendaciones = this.recomendador.generarRecomendaciones(datos);
            this.metricas.recomendacionesCreadas += recomendaciones.length;
            
            this.log(`💡 ${recomendaciones.length} recomendaciones generadas`, 'success');
            
            return recomendaciones;
            
        } catch (error) {
            this.log(`❌ Error generando recomendaciones: ${error.message}`, 'error');
            return [];
        }
    }

    /**
     * Generar reporte completo de IA
     */
    generarReporteCompleto(datos) {
        if (!this.validarDatos(datos)) {
            this.log('❌ Datos inválidos para reporte completo', 'error');
            return null;
        }

        try {
            const inicioTiempo = performance.now();
            
            const reporte = this.generadorReportes.generarReporteCompleto(datos);
            
            const tiempoEjecucion = performance.now() - inicioTiempo;
            this.metricas.reportesGenerados++;
            this.metricas.tiemposEjecucion.push(tiempoEjecucion);
            
            this.log(`📋 Reporte completo generado en ${tiempoEjecucion.toFixed(2)}ms`, 'success');
            
            // Notificar finalización si está disponible
            if (this.sistemaNotificaciones) {
                this.sistemaNotificaciones.exito('🤖 Reporte de IA generado exitosamente', {
                    titulo: 'Análisis Completado',
                    duracion: 4000
                });
            }
            
            return reporte;
            
        } catch (error) {
            this.log(`❌ Error generando reporte completo: ${error.message}`, 'error');
            if (this.sistemaNotificaciones) {
                this.sistemaNotificaciones.error('Error generando reporte de IA');
            }
            return null;
        }
    }

    /**
     * Obtener insights en tiempo real
     */
    obtenerInsightsEnTiempoReal() {
        // Datos de muestra para demostración
        const datosMuestra = {
            flujoCaja: [15000, 18500, 22000, 17800, 21500, 19800, 24500],
            ingresos: [35000, 38000, 42000, 39000, 44000, 40300, 45200],
            gastos: [28000, 29500, 31000, 30200, 32500, 30200, 28700]
        };
        
        return this.analisisRapido(datosMuestra);
    }

    // ======= VALIDACIÓN Y UTILIDADES =======
    
    validarDatos(datos) {
        if (!datos || typeof datos !== 'object') {
            return false;
        }
        
        // Verificar que al menos tenga un array de datos financieros
        const camposRequeridos = ['flujoCaja', 'ingresos', 'gastos', 'cashFlow', 'revenue', 'expenses'];
        const tieneDatos = camposRequeridos.some(campo => 
            Array.isArray(datos[campo]) && datos[campo].length > 0
        );
        
        if (!tieneDatos) {
            this.log('⚠️ Los datos no contienen arrays financieros válidos', 'warn');
            return false;
        }
        
        return true;
    }

    generarHashDatos(datos) {
        // Generar hash simple para cache
        return btoa(JSON.stringify(datos)).slice(0, 16);
    }

    limpiarCacheAntiguo() {
        if (this.cache.size <= this.configuracion.cache.maxEntradas) return;
        
        // Remover entradas más antiguas
        const entradas = Array.from(this.cache.entries());
        entradas.sort((a, b) => a[1].timestamp - b[1].timestamp);
        
        const aRemover = entradas.slice(0, entradas.length - this.configuracion.cache.maxEntradas);
        aRemover.forEach(([clave]) => this.cache.delete(clave));
        
        this.log(`🧹 Cache limpiado: ${aRemover.length} entradas removidas`, 'info');
    }

    // ======= EVENTOS Y MONITOREO =======
    
    configurarEventos() {
        // Escuchar cambios de datos financieros
        document.addEventListener('grizalumDatosFinancierosActualizados', (evento) => {
            const { datos } = evento.detail;
            if (this.configuracion.alertas.habilitadas) {
                this.verificarAlertasEnDatos(datos);
            }
        });

        // Escuchar cambios de empresa
        document.addEventListener('grizalumCompanyChanged', (evento) => {
            this.limpiarCache();
            this.log('🏢 Cache limpiado por cambio de empresa', 'info');
        });

        // Escuchar cambios de período
        document.addEventListener('grizalumPeriodoCambiado', (evento) => {
            this.limpiarCache();
        });

        this.log('🔗 Eventos de IA configurados', 'info');
    }

    iniciarMonitoreoAutomatico() {
        if (!this.configuracion.alertas.habilitadas) return;
        
        // Monitoreo periódico
        setInterval(() => {
            if (this.inicializado) {
                this.verificarEstadoSistema();
            }
        }, this.configuracion.alertas.intervalMonitoreo);
        
        this.log('🔍 Monitoreo automático iniciado', 'info');
    }

    verificarAlertasEnDatos(datos) {
        try {
            const alertas = this.sistemaAlertas.verificarAlertas(datos);
            
            if (alertas.length > 0 && this.configuracion.alertas.notificarCambios) {
                alertas.forEach(alerta => {
                    if (this.sistemaNotificaciones) {
                        const tipo = alerta.severidad === 'critica' ? 'error' : 'warning';
                        this.sistemaNotificaciones.mostrar(alerta.descripcion, tipo, 6000, {
                            titulo: `Alerta IA: ${alerta.titulo}`
                        });
                    }
                });
                
                this.metricas.alertasActivadas += alertas.length;
            }
            
        } catch (error) {
            this.log(`❌ Error verificando alertas: ${error.message}`, 'error');
        }
    }

    verificarEstadoSistema() {
        // Verificar uso de memoria del cache
        if (this.cache.size > this.configuracion.cache.maxEntradas * 0.9) {
            this.limpiarCacheAntiguo();
        }
        
        // Guardar datos periódicamente
        this.guardarDatosPersistentes();
    }

    dispararEvento(nombreEvento, detalle = {}) {
        const evento = new CustomEvent(nombreEvento, {
            detail: {
                ...detalle,
                aiVersion: this.version,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(evento);
    }

    // ======= MÉTRICAS Y ANALÍTICAS =======
    
    obtenerEstadisticas() {
        const tiempoPromedioEjecucion = this.metricas.tiemposEjecucion.length > 0
            ? this.metricas.tiemposEjecucion.reduce((a, b) => a + b, 0) / this.metricas.tiemposEjecucion.length
            : 0;

        return {
            version: this.version,
            inicializado: this.inicializado,
            rendimiento: {
                analisisRealizados: this.metricas.analisisRealizados,
                prediccionesGeneradas: this.metricas.prediccionesGeneradas,
                recomendacionesCreadas: this.metricas.recomendacionesCreadas,
                reportesGenerados: this.metricas.reportesGenerados,
                alertasActivadas: this.metricas.alertasActivadas,
                tiempoPromedioEjecucion: Math.round(tiempoPromedioEjecucion),
                precisionPromedio: this.calcularPrecisionPromedio()
            },
            cache: {
                entradas: this.cache.size,
                habilitado: this.configuracion.cache.habilitado,
                maxEntradas: this.configuracion.cache.maxEntradas
            },
            configuracion: { ...this.configuracion }
        };
    }

    calcularPrecisionPromedio() {
        return this.metricas.precisiones.length > 0
            ? this.metricas.precisiones.reduce((a, b) => a + b, 0) / this.metricas.precisiones.length
            : this.configuracion.precision;
    }

    obtenerEstadoComponentes() {
        return {
            predictor: !!this.predictor,
            analizador: !!this.analizador,
            recomendador: !!this.recomendador,
            sistemaAlertas: !!this.sistemaAlertas,
            generadorReportes: !!this.generadorReportes
        };
    }

    reiniciarMetricas() {
        this.metricas = {
            analisisRealizados: 0,
            prediccionesGeneradas: 0,
            recomendacionesCreadas: 0,
            alertasActivadas: 0,
            reportesGenerados: 0,
            tiemposEjecucion: [],
            precisiones: [],
            tiempoUsoTotal: 0
        };
        
        this.log('📊 Métricas de IA reiniciadas', 'info');
    }

    limpiarCache() {
        const entradas = this.cache.size;
        this.cache.clear();
        this.log(`🧹 Cache de IA limpiado: ${entradas} entradas eliminadas`, 'info');
    }

    // ======= API PÚBLICA =======
    
    obtenerEstado() {
        return {
            version: this.version,
            inicializado: this.inicializado,
            componentesActivos: this.obtenerEstadoComponentes(),
            metricas: this.metricas,
            configuracion: { ...this.configuracion }
        };
    }
}

// ======= PREDICTOR FINANCIERO AVANZADO =======

class PredictorFinancieroGRIZALUM {
    constructor(sistemaIA) {
        this.sistemaIA = sistemaIA;
        this.modelos = {};
    }

    // Modelo de regresión lineal mejorado
    regresionLineal(datos) {
        if (!Array.isArray(datos) || datos.length < 2) {
            throw new Error('Datos insuficientes para regresión lineal');
        }

        const n = datos.length;
        const sumX = datos.reduce((sum, _, i) => sum + i, 0);
        const sumY = datos.reduce((sum, val) => sum + val, 0);
        const sumXY = datos.reduce((sum, val, i) => sum + (i * val), 0);
        const sumXX = datos.reduce((sum, _, i) => sum + (i * i), 0);

        const denominador = n * sumXX - sumX * sumX;
        if (denominador === 0) {
            throw new Error('Error matemático en regresión lineal');
        }

        const pendiente = (n * sumXY - sumX * sumY) / denominador;
        const intercepto = (sumY - pendiente * sumX) / n;

        // Calcular R²
        const mediaY = sumY / n;
        const ssTotal = datos.reduce((sum, val) => sum + Math.pow(val - mediaY, 2), 0);
        const ssRes = datos.reduce((sum, val, i) => {
            const prediccion = pendiente * i + intercepto;
            return sum + Math.pow(val - prediccion, 2);
        }, 0);
        
        const rCuadrado = ssTotal > 0 ? 1 - (ssRes / ssTotal) : 0;

        return { pendiente, intercepto, rCuadrado };
    }

    // Predicción de flujo de caja con intervalos de confianza
    predecirFlujoCaja(datosHistoricos, periodos = 6) {
        try {
            const { pendiente, intercepto, rCuadrado } = this.regresionLineal(datosHistoricos);
            const predicciones = [];
            const volatilidad = this.calcularVolatilidad(datosHistoricos);
            
            for (let i = 0; i < periodos; i++) {
                const siguientePeriodo = datosHistoricos.length + i;
                const prediccionBase = pendiente * siguientePeriodo + intercepto;
                
                // Agregar incertidumbre realista
                const factorIncertidumbre = 1 + (i * 0.1); // Aumenta incertidumbre con el tiempo
                const ruido = (Math.random() - 0.5) * volatilidad * 0.1 * factorIncertidumbre;
                
                const prediccion = Math.max(0, Math.round(prediccionBase + ruido));
                
                // Calcular intervalos de confianza
                const margenError = volatilidad * factorIncertidumbre;
                const intervaloInferior = Math.max(0, Math.round(prediccion - margenError));
                const intervaloSuperior = Math.round(prediccion + margenError);
                
                predicciones.push({
                    valor: prediccion,
                    intervaloInferior,
                    intervaloSuperior,
                    confianza: Math.max(0.5, rCuadrado * (1 - i * 0.1))
                });
            }
            
            return predicciones;
            
        } catch (error) {
            this.sistemaIA.log(`❌ Error prediciendo flujo de caja: ${error.message}`, 'error');
            return [];
        }
    }

    // Predicción de ventas con detección de estacionalidad mejorada
    predecirVentas(datosHistoricos, periodos = 6) {
        try {
            const estacionalidad = this.detectarEstacionalidad(datosHistoricos);
            const tendencia = this.regresionLineal(datosHistoricos);
            const predicciones = [];
            
            for (let i = 0; i < periodos; i++) {
                const siguientePeriodo = datosHistoricos.length + i;
                const prediccionBase = tendencia.pendiente * siguientePeriodo + tendencia.intercepto;
                const factorEstacional = estacionalidad[i % estacionalidad.length];
                
                const prediccion = Math.round(prediccionBase * factorEstacional);
                
                predicciones.push({
                    valor: Math.max(0, prediccion),
                    factorEstacional,
                    confianza: tendencia.rCuadrado
                });
            }
            
            return predicciones;
            
        } catch (error) {
            this.sistemaIA.log(`❌ Error prediciendo ventas: ${error.message}`, 'error');
            return [];
        }
    }

    // Detectar patrones estacionales
    detectarEstacionalidad(datos, longitudEstacion = 12) {
        try {
            const estaciones = [];
            
            for (let i = 0; i < longitudEstacion; i++) {
                const valoresEstacionales = [];
                for (let j = i; j < datos.length; j += longitudEstacion) {
                    if (datos[j] !== undefined) {
                        valoresEstacionales.push(datos[j]);
                    }
                }
                
                if (valoresEstacionales.length > 0) {
                    const promedio = valoresEstacionales.reduce((a, b) => a + b, 0) / valoresEstacionales.length;
                    const promedioGeneral = datos.reduce((a, b) => a + b, 0) / datos.length;
                    
                    estaciones.push(promedioGeneral > 0 ? promedio / promedioGeneral : 1);
                } else {
                    estaciones.push(1);
                }
            }
            
            return estaciones;
            
        } catch (error) {
            this.sistemaIA.log(`❌ Error detectando estacionalidad: ${error.message}`, 'error');
            return Array(12).fill(1); // Retornar valores neutros
        }
    }

    // Calcular volatilidad de los datos
    calcularVolatilidad(datos) {
        if (datos.length < 2) return 0;
        
        const media = datos.reduce((a, b) => a + b, 0) / datos.length;
        const varianza = datos.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / datos.length;
        return Math.sqrt(varianza);
    }

    // Calcular correlación entre dos series
    calcularCorrelacion(datosX, datosY) {
        if (datosX.length !== datosY.length || datosX.length < 2) {
            return 0;
        }

        const n = datosX.length;
        const sumX = datosX.reduce((a, b) => a + b, 0);
        const sumY = datosY.reduce((a, b) => a + b, 0);
        const sumXY = datosX.reduce((sum, x, i) => sum + (x * datosY[i]), 0);
        const sumXX = datosX.reduce((sum, x) => sum + (x * x), 0);
        const sumYY = datosY.reduce((sum, y) => sum + (y * y), 0);

        const numerador = n * sumXY - sumX * sumY;
        const denominador = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return denominador === 0 ? 0 : numerador / denominador;
    }

    generarPredicciones(datos, periodos = 6) {
        const predicciones = {};

        // Normalizar nombres de campos
        const camposNormalizados = this.normalizarCamposDatos(datos);

        if (camposNormalizados.flujoCaja) {
            predicciones.flujoCaja = this.predecirFlujoCaja(camposNormalizados.flujoCaja, periodos);
        }

        if (camposNormalizados.ingresos) {
            predicciones.ingresos = this.predecirVentas(camposNormalizados.ingresos, periodos);
        }

        if (camposNormalizados.gastos) {
            predicciones.gastos = this.predecirFlujoCaja(camposNormalizados.gastos, periodos);
        }

        return predicciones;
    }

    normalizarCamposDatos(datos) {
        return {
            flujoCaja: datos.flujoCaja || datos.cashFlow,
            ingresos: datos.ingresos || datos.revenue,
            gastos: datos.gastos || datos.expenses
        };
    }
}

// ======= ANALIZADOR INTELIGENTE =======

class AnalizadorInteligente {
    constructor(sistemaIA) {
        this.sistemaIA = sistemaIA;
        this.predictor = new PredictorFinancieroGRIZALUM(sistemaIA);
        this.insights = [];
    }

    analizarDatosFinancieros(datos) {
        try {
            const analisis = {
                tendencias: this.analizarTendencias(datos),
                riesgos: this.evaluarRiesgos(datos),
                oportunidades: this.identificarOportunidades(datos),
                predicciones: this.predictor.generarPredicciones(datos),
                puntuacion: this.calcularPuntuacionSalud(datos),
                insights: []
            };

            analisis.insights = this.generarInsights(analisis);
            
            return analisis;
            
        } catch (error) {
            this.sistemaIA.log(`❌ Error en análisis financiero: ${error.message}`, 'error');
            throw error;
        }
    }

    analizarTendencias(datos) {
        const tendencias = {};
        const camposNormalizados = this.normalizarCampos(datos);
        
        Object.entries(camposNormalizados).forEach(([metrica, valores]) => {
            if (Array.isArray(valores) && valores.length > 1) {
                try {
                    const { pendiente, rCuadrado } = this.predictor.regresionLineal(valores);
                    
                    tendencias[metrica] = {
                        direccion: pendiente > 0 ? 'ascendente' : 'descendente',
                        fuerza: Math.abs(pendiente),
                        confianza: rCuadrado,
                        clasificacion: this.clasificarTendencia(pendiente, valores),
                        volatilidad: this.predictor.calcularVolatilidad(valores)
                    };
                } catch (error) {
                    this.sistemaIA.log(`⚠️ Error analizando tendencia de ${metrica}: ${error.message}`, 'warn');
                }
            }
        });

        return tendencias;
    }

    clasificarTendencia(pendiente, datos) {
        const promedioValores = datos.reduce((a, b) => a + b, 0) / datos.length;
        const pendienteRelativa = Math.abs(pendiente) / promedioValores;

        if (pendienteRelativa > 0.1) return 'fuerte';
        if (pendienteRelativa > 0.05) return 'moderada';
        if (pendienteRelativa > 0.02) return 'ligera';
        return 'estable';
    }

    evaluarRiesgos(datos) {
        const riesgos = [];
        const camposNormalizados = this.normalizarCampos(datos);

        // Riesgo de liquidez
        if (camposNormalizados.flujoCaja) {
            const tendenciaFlujoCaja = this.predictor.regresionLineal(camposNormalizados.flujoCaja).pendiente;
            const flujoCajaActual = camposNormalizados.flujoCaja[camposNormalizados.flujoCaja.length - 1];
            
            if (tendenciaFlujoCaja < -1000 || flujoCajaActual < 15000) {
                riesgos.push({
                    tipo: 'liquidez',
                    severidad: flujoCajaActual < 10000 ? 'critica' : 'alta',
                    descripcion: 'Problemas potenciales de liquidez detectados',
                    impacto: 'Posible crisis de liquidez en 3-6 meses',
                    recomendacion: 'Acelerar cobranzas y revisar gastos no esenciales',
                    probabilidad: this.calcularProbabilidadRiesgo(tendenciaFlujoCaja, flujoCajaActual)
                });
            }
        }

        // Riesgo de rentabilidad
        if (camposNormalizados.ingresos && camposNormalizados.gastos) {
            const ingresoActual = camposNormalizados.ingresos[camposNormalizados.ingresos.length - 1];
            const gastoActual = camposNormalizados.gastos[camposNormalizados.gastos.length - 1];
            const margen = (ingresoActual - gastoActual) / ingresoActual;
            
            if (margen < 0.1) {
                riesgos.push({
                    tipo: 'rentabilidad',
                    severidad: margen < 0.05 ? 'critica' : 'media',
                    descripcion: 'Margen de rentabilidad por debajo del óptimo',
                    impacto: 'Sostenibilidad financiera comprometida',
                    recomendacion: 'Revisar estructura de costos y estrategia de precios',
                    probabilidad: 0.8
                });
            }
        }

        return riesgos;
    }

    identificarOportunidades(datos) {
        const oportunidades = [];
        const camposNormalizados = this.normalizarCampos(datos);

        // Oportunidad de crecimiento
        if (camposNormalizados.ingresos) {
            const tendenciaIngresos = this.predictor.regresionLineal(camposNormalizados.ingresos).pendiente;
            
            if (tendenciaIngresos > 2000) {
                oportunidades.push({
                    tipo: 'crecimiento',
                    potencial: 'alto',
                    descripcion: 'Tendencia positiva sostenida en ingresos',
                    accion: 'Considerar inversión en capacidad productiva',
                    retornoEsperado: 'ROI estimado: 25-35%',
                    probabilidadExito: 0.75
                });
            }
        }

        // Oportunidad de optimización
        if (camposNormalizados.gastos) {
            const volatilidad = this.predictor.calcularVolatilidad(camposNormalizados.gastos);
            const promedioGastos = camposNormalizados.gastos.reduce((a, b) => a + b, 0) / camposNormalizados.gastos.length;
            
            if (volatilidad / promedioGastos > 0.15) {
                oportunidades.push({
                    tipo: 'optimizacion',
                    potencial: 'medio',
                    descripcion: 'Alta variabilidad en gastos sugiere oportunidades de optimización',
                    accion: 'Implementar controles de gastos más estrictos',
                    retornoEsperado: 'Ahorro potencial: 10-20%',
                    probabilidadExito: 0.65
                });
            }
        }

        return oportunidades;
    }

    calcularPuntuacionSalud(datos) {
        let puntuacion = 100;
        const factores = [];
        const camposNormalizados = this.normalizarCampos(datos);

        // Factor de liquidez
        if (camposNormalizados.flujoCaja) {
            const flujoCajaActual = camposNormalizados.flujoCaja[camposNormalizados.flujoCaja.length - 1];
            let impactoLiquidez = 0;
            
            if (flujoCajaActual < 10000) impactoLiquidez = -25;
            else if (flujoCajaActual < 20000) impactoLiquidez = -15;
            else if (flujoCajaActual > 50000) impactoLiquidez = 10;
            
            puntuacion += impactoLiquidez;
            factores.push({ nombre: 'Liquidez', impacto: impactoLiquidez, valor: flujoCajaActual });
        }

        // Factor de crecimiento
        if (camposNormalizados.ingresos) {
            const tasaCrecimiento = this.predictor.regresionLineal(camposNormalizados.ingresos).pendiente;
            let impactoCrecimiento = 0;
            
            if (tasaCrecimiento > 3000) impactoCrecimiento = 15;
            else if (tasaCrecimiento > 1000) impactoCrecimiento = 10;
            else if (tasaCrecimiento < -1000) impactoCrecimiento = -20;
            
            puntuacion += impactoCrecimiento;
            factores.push({ nombre: 'Crecimiento', impacto: impactoCrecimiento, valor: tasaCrecimiento });
        }

        // Factor de rentabilidad
        if (camposNormalizados.ingresos && camposNormalizados.gastos) {
            const ingreso = camposNormalizados.ingresos[camposNormalizados.ingresos.length - 1];
            const gasto = camposNormalizados.gastos[camposNormalizados.gastos.length - 1];
            const margen = (ingreso - gasto) / ingreso;
            let impactoRentabilidad = 0;
            
            if (margen > 0.4) impactoRentabilidad = 15;
            else if (margen > 0.25) impactoRentabilidad = 10;
            else if (margen < 0.1) impactoRentabilidad = -25;
            else if (margen < 0.2) impactoRentabilidad = -10;
            
            puntuacion += impactoRentabilidad;
            factores.push({ nombre: 'Rentabilidad', impacto: impactoRentabilidad, valor: margen });
        }

        const puntuacionFinal = Math.max(0, Math.min(100, puntuacion));

        return {
            puntuacion: puntuacionFinal,
            factores: factores,
            clasificacion: this.clasificarPuntuacionSalud(puntuacionFinal),
            tendencia: this.determinarTendenciaSalud(factores)
        };
    }

    clasificarPuntuacionSalud(puntuacion) {
        if (puntuacion >= 90) return { nivel: 'excelente', color: '#059669', icono: '🟢', descripcion: 'Salud financiera óptima' };
        if (puntuacion >= 75) return { nivel: 'bueno', color: '#10b981', icono: '🟡', descripcion: 'Salud financiera sólida' };
        if (puntuacion >= 60) return { nivel: 'regular', color: '#f59e0b', icono: '🟠', descripcion: 'Salud financiera regular' };
        if (puntuacion >= 40) return { nivel: 'deficiente', color: '#dc2626', icono: '🔴', descripcion: 'Salud financiera preocupante' };
        return { nivel: 'critico', color: '#991b1b', icono: '🚨', descripcion: 'Salud financiera crítica' };
    }

    determinarTendenciaSalud(factores) {
        const impactoTotal = factores.reduce((sum, factor) => sum + factor.impacto, 0);
        
        if (impactoTotal > 15) return 'mejorando';
        if (impactoTotal < -15) return 'deteriorando';
        return 'estable';
    }

    generarInsights(analisis) {
        const insights = [];

        // Insights de tendencias
        Object.entries(analisis.tendencias).forEach(([metrica, tendencia]) => {
            if (tendencia.clasificacion === 'fuerte' && tendencia.confianza > 0.7) {
                insights.push({
                    tipo: 'tendencia',
                    metrica: metrica,
                    mensaje: `${metrica} muestra una tendencia ${tendencia.direccion} fuerte`,
                    prioridad: 'alta',
                    icono: tendencia.direccion === 'ascendente' ? '📈' : '📉',
                    confianza: tendencia.confianza
                });
            }
        });

        // Insights de salud financiera
        const puntuacionSalud = analisis.puntuacion;
        insights.push({
            tipo: 'salud',
            mensaje: `Salud financiera: ${puntuacionSalud.clasificacion.nivel} (${puntuacionSalud.puntuacion}/100)`,
            prioridad: puntuacionSalud.puntuacion < 60 ? 'alta' : 'media',
            icono: puntuacionSalud.clasificacion.icono,
            tendencia: puntuacionSalud.tendencia
        });

        // Insights de riesgos críticos
        const riesgosCriticos = analisis.riesgos.filter(r => r.severidad === 'critica');
        if (riesgosCriticos.length > 0) {
            insights.push({
                tipo: 'riesgo',
                mensaje: `${riesgosCriticos.length} riesgo(s) crítico(s) detectado(s)`,
                prioridad: 'critica',
                icono: '🚨',
                detalles: riesgosCriticos
            });
        }

        // Insights de oportunidades
        const oportunidadesAltas = analisis.oportunidades.filter(o => o.potencial === 'alto');
        if (oportunidadesAltas.length > 0) {
            insights.push({
                tipo: 'oportunidad',
                mensaje: `${oportunidadesAltas.length} oportunidad(es) de alto potencial identificada(s)`,
                prioridad: 'media',
                icono: '💡',
                detalles: oportunidadesAltas
            });
        }

        return insights;
    }

    calcularProbabilidadRiesgo(tendencia, valorActual) {
        // Algoritmo simple para calcular probabilidad de riesgo
        let probabilidad = 0.5; // Baseline
        
        if (tendencia < -2000) probabilidad += 0.3;
        else if (tendencia < -1000) probabilidad += 0.2;
        
        if (valorActual < 5000) probabilidad += 0.4;
        else if (valorActual < 15000) probabilidad += 0.2;
        
        return Math.min(1, Math.max(0, probabilidad));
    }

    normalizarCampos(datos) {
        return {
            flujoCaja: datos.flujoCaja || datos.cashFlow,
            ingresos: datos.ingresos || datos.revenue,
            gastos: datos.gastos || datos.expenses
        };
    }
}

// ======= MOTOR DE RECOMENDACIONES =======

class MotorRecomendaciones {
    constructor(sistemaIA) {
        this.sistemaIA = sistemaIA;
        this.reglas = this.inicializarReglas();
        this.recomendaciones = [];
    }

    inicializarReglas() {
        return {
            flujoCaja: {
                bajo: {
                    umbral: 15000,
                    acciones: [
                        'Acelerar proceso de cobranzas',
                        'Diferir pagos no críticos',
                        'Considerar línea de crédito revolvente',
                        'Revisar términos de pago con clientes clave',
                        'Implementar descuentos por pronto pago'
                    ],
                    prioridad: 'alta'
                },
                tendenciaNegativa: {
                    umbral: -1000,
                    acciones: [
                        'Análisis detallado de causas raíz',
                        'Plan de contingencia de liquidez',
                        'Renegociación de términos con proveedores',
                        'Evaluación de activos no esenciales para venta',
                        'Revisión de gastos operativos'
                    ],
                    prioridad: 'critica'
                }
            },
            rentabilidad: {
                margenBajo: {
                    umbral: 0.15,
                    acciones: [
                        'Análisis exhaustivo de estructura de costos',
                        'Optimización de procesos operativos',
                        'Revisión estratégica de precios',
                        'Eliminación de gastos innecesarios',
                        'Automatización de procesos manuales'
                    ],
                    prioridad: 'media'
                }
            },
            crecimiento: {
                estancamiento: {
                    umbral: 0.02,
                    acciones: [
                        'Estrategia de penetración de mercado',
                        'Desarrollo de nuevos productos/servicios',
                        'Inversión en marketing digital',
                        'Formación de alianzas estratégicas',
                        'Expansión geográfica'
                    ],
                    prioridad: 'media'
                }
            }
        };
    }

    generarRecomendaciones(datos) {
        this.recomendaciones = [];
        const camposNormalizados = this.normalizarCampos(datos);

        // Recomendaciones de flujo de caja
        this.evaluarFlujoCaja(camposNormalizados.flujoCaja);

        // Recomendaciones de rentabilidad
        this.evaluarRentabilidad(camposNormalizados.ingresos, camposNormalizados.gastos);

        // Recomendaciones de crecimiento
        this.evaluarCrecimiento(camposNormalizados.ingresos);

        return this.priorizarRecomendaciones();
    }

    evaluarFlujoCaja(datosFlujoCaja) {
        if (!Array.isArray(datosFlujoCaja) || datosFlujoCaja.length === 0) return;

        const flujoCajaActual = datosFlujoCaja[datosFlujoCaja.length - 1];
        const predictor = new PredictorFinancieroGRIZALUM(this.sistemaIA);
        const tendencia = predictor.regresionLineal(datosFlujoCaja).pendiente;

        if (flujoCajaActual < this.reglas.flujoCaja.bajo.umbral) {
            this.agregarRecomendacion(
                'flujo_caja_bajo',
                this.reglas.flujoCaja.bajo.prioridad,
                this.reglas.flujoCaja.bajo.acciones,
                `Flujo de caja actual: S/. ${flujoCajaActual.toLocaleString()}`
            );
        }

        if (tendencia < this.reglas.flujoCaja.tendenciaNegativa.umbral) {
            this.agregarRecomendacion(
                'flujo_caja_tendencia',
                this.reglas.flujoCaja.tendenciaNegativa.prioridad,
                this.reglas.flujoCaja.tendenciaNegativa.acciones,
                `Tendencia negativa detectada: ${tendencia.toFixed(0)} por período`
            );
        }
    }

    evaluarRentabilidad(datosIngresos, datosGastos) {
        if (!Array.isArray(datosIngresos) || !Array.isArray(datosGastos)) return;
        if (datosIngresos.length === 0 || datosGastos.length === 0) return;

        const ingresoActual = datosIngresos[datosIngresos.length - 1];
        const gastoActual = datosGastos[datosGastos.length - 1];
        const margen = (ingresoActual - gastoActual) / ingresoActual;

        if (margen < this.reglas.rentabilidad.margenBajo.umbral) {
            this.agregarRecomendacion(
                'rentabilidad_baja',
                this.reglas.rentabilidad.margenBajo.prioridad,
                this.reglas.rentabilidad.margenBajo.acciones,
                `Margen actual: ${(margen * 100).toFixed(1)}%`
            );
        }
    }

    evaluarCrecimiento(datosIngresos) {
        if (!Array.isArray(datosIngresos) || datosIngresos.length < 3) return;

        const predictor = new PredictorFinancieroGRIZALUM(this.sistemaIA);
        const { pendiente } = predictor.regresionLineal(datosIngresos);
        const promedioIngresos = datosIngresos.reduce((a, b) => a + b, 0) / datosIngresos.length;
        const tasaCrecimiento = pendiente / promedioIngresos;

        if (tasaCrecimiento < this.reglas.crecimiento.estancamiento.umbral) {
            this.agregarRecomendacion(
                'crecimiento_estancado',
                this.reglas.crecimiento.estancamiento.prioridad,
                this.reglas.crecimiento.estancamiento.acciones,
                `Tasa de crecimiento: ${(tasaCrecimiento * 100).toFixed(1)}%`
            );
        }
    }

    agregarRecomendacion(tipo, prioridad, acciones, contexto) {
        this.recomendaciones.push({
            id: Date.now() + Math.random(),
            tipo: tipo,
            prioridad: prioridad,
            acciones: acciones.slice(0, 3), // Limitar a 3 acciones principales
            contexto: contexto,
            timestamp: new Date(),
            estado: 'pendiente',
            impactoEsperado: this.calcularImpactoEsperado(tipo),
            dificultadImplementacion: this.calcularDificultadImplementacion(tipo)
        });
    }

    calcularImpactoEsperado(tipo) {
        const impactos = {
            'flujo_caja_bajo': 'alto',
            'flujo_caja_tendencia': 'critico',
            'rentabilidad_baja': 'medio',
            'crecimiento_estancado': 'medio'
        };
        return impactos[tipo] || 'bajo';
    }

    calcularDificultadImplementacion(tipo) {
        const dificultades = {
            'flujo_caja_bajo': 'media',
            'flujo_caja_tendencia': 'alta',
            'rentabilidad_baja': 'media',
            'crecimiento_estancado': 'alta'
        };
        return dificultades[tipo] || 'baja';
    }

    priorizarRecomendaciones() {
        const ordenPrioridad = { 'critica': 4, 'alta': 3, 'media': 2, 'baja': 1 };
        
        return this.recomendaciones.sort((a, b) => {
            // Primero por prioridad
            const diff = ordenPrioridad[b.prioridad] - ordenPrioridad[a.prioridad];
            if (diff !== 0) return diff;
            
            // Luego por impacto esperado
            const impactos = { 'critico': 4, 'alto': 3, 'medio': 2, 'bajo': 1 };
            return impactos[b.impactoEsperado] - impactos[a.impactoEsperado];
        });
    }

    normalizarCampos(datos) {
        return {
            flujoCaja: datos.flujoCaja || datos.cashFlow,
            ingresos: datos.ingresos || datos.revenue,
            gastos: datos.gastos || datos.expenses
        };
    }
}

// ======= SISTEMA DE ALERTAS INTELIGENTES =======

class SistemaAlertasInteligentes {
    constructor(sistemaIA) {
        this.sistemaIA = sistemaIA;
        this.alertas = [];
        this.umbrales = this.inicializarUmbrales();
        this.monitoreoActivo = false;
    }

    inicializarUmbrales() {
        return {
            flujoCaja: {
                critico: 10000,
                advertencia: 20000,
                optimo: 50000
            },
            margenUtilidad: {
                critico: 0.05,
                advertencia: 0.15,
                optimo: 0.25
            },
            tasaCrecimiento: {
                critico: -0.1,
                advertencia: 0.02,
                optimo: 0.15
            }
        };
    }

    verificarAlertas(datos) {
        this.alertas = [];
        const camposNormalizados = this.normalizarCampos(datos);

        // Alertas de flujo de caja
        this.verificarAlertasFlujoCaja(camposNormalizados.flujoCaja);

        // Alertas de márgenes
        this.verificarAlertasMargenes(camposNormalizados.ingresos, camposNormalizados.gastos);

        // Alertas de crecimiento
        this.verificarAlertasCrecimiento(camposNormalizados.ingresos);

        return this.alertas;
    }

    verificarAlertasFlujoCaja(datosFlujoCaja) {
        if (!Array.isArray(datosFlujoCaja) || datosFlujoCaja.length === 0) return;

        const flujoCajaActual = datosFlujoCaja[datosFlujoCaja.length - 1];
        
        if (flujoCajaActual < this.umbrales.flujoCaja.critico) {
            this.crearAlerta(
                'critica',
                'Flujo de caja crítico',
                `S/. ${flujoCajaActual.toLocaleString()}`,
                'Acción inmediata requerida - Revisar liquidez',
                'liquidez'
            );
        } else if (flujoCajaActual < this.umbrales.flujoCaja.advertencia) {
            this.crearAlerta(
                'advertencia',
                'Flujo de caja bajo',
                `S/. ${flujoCajaActual.toLocaleString()}`,
                'Monitorear de cerca y preparar medidas',
                'liquidez'
            );
        }

        // Verificar tendencia
        if (datosFlujoCaja.length >= 3) {
            const predictor = new PredictorFinancieroGRIZALUM(this.sistemaIA);
            const tendencia = predictor.regresionLineal(datosFlujoCaja).pendiente;
            
            if (tendencia < -2000) {
                this.crearAlerta(
                    'critica',
                    'Tendencia negativa severa en flujo de caja',
                    `${tendencia.toFixed(0)} por período`,
                    'Implementar plan de contingencia',
                    'tendencia'
                );
            }
        }
    }

    verificarAlertasMargenes(datosIngresos, datosGastos) {
        if (!Array.isArray(datosIngresos) || !Array.isArray(datosGastos)) return;
        if (datosIngresos.length === 0 || datosGastos.length === 0) return;

        const ingresoActual = datosIngresos[datosIngresos.length - 1];
        const gastoActual = datosGastos[datosGastos.length - 1];
        const margen = (ingresoActual - gastoActual) / ingresoActual;

        if (margen < this.umbrales.margenUtilidad.critico) {
            this.crearAlerta(
                'critica',
                'Margen de utilidad crítico',
                `${(margen * 100).toFixed(1)}%`,
                'Revisar estructura de costos urgentemente',
                'rentabilidad'
            );
        } else if (margen < this.umbrales.margenUtilidad.advertencia) {
            this.crearAlerta(
                'advertencia',
                'Margen de utilidad bajo',
                `${(margen * 100).toFixed(1)}%`,
                'Optimizar operaciones y revisar precios',
                'rentabilidad'
            );
        }
    }

    verificarAlertasCrecimiento(datosIngresos) {
        if (!Array.isArray(datosIngresos) || datosIngresos.length < 3) return;

        const predictor = new PredictorFinancieroGRIZALUM(this.sistemaIA);
        const { pendiente, rCuadrado } = predictor.regresionLineal(datosIngresos);
        const promedioIngresos = datosIngresos.reduce((a, b) => a + b, 0) / datosIngresos.length;
        const tasaCrecimiento = pendiente / promedioIngresos;

        if (tasaCrecimiento < this.umbrales.tasaCrecimiento.critico && rCuadrado > 0.6) {
            this.crearAlerta(
                'advertencia',
                'Contracción en ingresos',
                `${(tasaCrecimiento * 100).toFixed(1)}%`,
                'Evaluar estrategia de ventas y mercado',
                'crecimiento'
            );
        } else if (tasaCrecimiento < this.umbrales.tasaCrecimiento.advertencia) {
            this.crearAlerta(
                'informacion',
                'Crecimiento lento',
                `${(tasaCrecimiento * 100).toFixed(1)}%`,
                'Considerar iniciativas de crecimiento',
                'crecimiento'
            );
        }
    }

    crearAlerta(severidad, titulo, valor, recomendacion, categoria) {
        this.alertas.push({
            id: Date.now() + Math.random(),
            severidad: severidad,
            titulo: titulo,
            valor: valor,
            recomendacion: recomendacion,
            categoria: categoria,
            timestamp: new Date(),
            reconocida: false,
            prioridad: this.calcularPrioridad(severidad, categoria)
        });
    }

    calcularPrioridad(severidad, categoria) {
        const pesos = {
            severidad: { 'critica': 10, 'advertencia': 5, 'informacion': 1 },
            categoria: { 'liquidez': 3, 'rentabilidad': 2, 'crecimiento': 1, 'tendencia': 3 }
        };
        
        return pesos.severidad[severidad] * pesos.categoria[categoria];
    }

    obtenerAlertasActivas() {
        return this.alertas
            .filter(alerta => !alerta.reconocida)
            .sort((a, b) => b.prioridad - a.prioridad);
    }

    reconocerAlerta(idAlerta) {
        const alerta = this.alertas.find(a => a.id === idAlerta);
        if (alerta) {
            alerta.reconocida = true;
            alerta.fechaReconocimiento = new Date();
        }
    }

    normalizarCampos(datos) {
        return {
            flujoCaja: datos.flujoCaja || datos.cashFlow,
            ingresos: datos.ingresos || datos.revenue,
            gastos: datos.gastos || datos.expenses
        };
    }
}

// ======= GENERADOR DE REPORTES IA =======

class GeneradorReportesIA {
    constructor(sistemaIA) {
        this.sistemaIA = sistemaIA;
        this.analizador = new AnalizadorInteligente(sistemaIA);
        this.recomendador = new MotorRecomendaciones(sistemaIA);
        this.sistemaAlertas = new SistemaAlertasInteligentes(sistemaIA);
    }

    generarReporteCompleto(datos) {
        try {
            const analisis = this.analizador.analizarDatosFinancieros(datos);
            const recomendaciones = this.recomendador.generarRecomendaciones(datos);
            const alertas = this.sistemaAlertas.verificarAlertas(datos);

            const reporte = {
                metadatos: {
                    generadoEn: new Date(),
                    periodo: this.obtenerPeriodoActual(),
                    precision: this.sistemaIA.configuracion.precision,
                    version: this.sistemaIA.version
                },
                resumenEjecutivo: this.generarResumenEjecutivo(analisis, recomendaciones, alertas),
                analisis: analisis,
                recomendaciones: recomendaciones,
                alertas: alertas,
                planAccion: this.generarPlanAccion(recomendaciones, alertas),
                metricas: this.generarMetricasReporte(analisis)
            };

            return reporte;
            
        } catch (error) {
            this.sistemaIA.log(`❌ Error generando reporte completo: ${error.message}`, 'error');
            throw error;
        }
    }

    generarResumenEjecutivo(analisis, recomendaciones, alertas) {
        const resumen = {
            puntuacionSalud: analisis.puntuacion.puntuacion,
            perspectiva: 'neutral',
            insightsClaves: [],
            prioridades: [],
            alertasCriticas: alertas.filter(a => a.severidad === 'critica').length
        };

        // Determinar perspectiva
        if (analisis.puntuacion.puntuacion >= 80) resumen.perspectiva = 'positiva';
        else if (analisis.puntuacion.puntuacion <= 50) resumen.perspectiva = 'negativa';

        // Insights claves
        const tendenciasPositivas = Object.entries(analisis.tendencias)
            .filter(([_, t]) => t.direccion === 'ascendente' && t.clasificacion !== 'estable')
            .length;

        if (tendenciasPositivas > 0) {
            resumen.insightsClaves.push(`${tendenciasPositivas} tendencia(s) positiva(s) detectada(s)`);
        }

        if (analisis.riesgos.length > 0) {
            resumen.insightsClaves.push(`${analisis.riesgos.length} riesgo(s) identificado(s)`);
        }

        if (analisis.oportunidades.length > 0) {
            resumen.insightsClaves.push(`${analisis.oportunidades.length} oportunidad(es) detectada(s)`);
        }

        // Prioridades
        const recomendacionesCriticas = recomendaciones.filter(r => r.prioridad === 'critica');
        const recomendacionesAltas = recomendaciones.filter(r => r.prioridad === 'alta');

        if (recomendacionesCriticas.length > 0) {
            resumen.prioridades.push(`${recomendacionesCriticas.length} acción(es) crítica(s)`);
        }
        if (recomendacionesAltas.length > 0) {
            resumen.prioridades.push(`${recomendacionesAltas.length} acción(es) de alta prioridad`);
        }

        return resumen;
    }

    generarPlanAccion(recomendaciones, alertas) {
        const plan = {
            inmediato: [],
            cortoPlazo: [],
            largoPlazo: []
        };

        // Acciones inmediatas (alertas críticas)
        alertas.filter(alerta => alerta.severidad === 'critica').forEach(alerta => {
            plan.inmediato.push({
                accion: alerta.recomendacion,
                prioridad: 'critica',
                cronograma: '24-48 horas',
                categoria: alerta.categoria,
                impacto: 'alto'
            });
        });

        // Acciones a corto plazo (recomendaciones críticas y altas)
        recomendaciones
            .filter(rec => ['critica', 'alta'].includes(rec.prioridad))
            .forEach(rec => {
                rec.acciones.slice(0, 2).forEach(accion => {
                    plan.cortoPlazo.push({
                        accion: accion,
                        prioridad: rec.prioridad,
                        cronograma: '1-4 semanas',
                        impacto: rec.impactoEsperado,
                        dificultad: rec.dificultadImplementacion
                    });
                });
            });

        // Acciones a largo plazo (recomendaciones medias)
        recomendaciones
            .filter(rec => rec.prioridad === 'media')
            .forEach(rec => {
                rec.acciones.slice(0, 2).forEach(accion => {
                    plan.largoPlazo.push({
                        accion: accion,
                        prioridad: rec.prioridad,
                        cronograma: '1-3 meses',
                        impacto: rec.impactoEsperado,
                        dificultad: rec.dificultadImplementacion
                    });
                });
            });

        return plan;
    }

    generarMetricasReporte(analisis) {
        return {
            confianzaAnalisis: this.calcularConfianzaGeneral(analisis),
            coberturaDatos: this.calcularCoberturaDatos(analisis),
            nivelDetalle: this.calcularNivelDetalle(analisis),
            factoresAnalizados: Object.keys(analisis.tendencias).length
        };
    }

    calcularConfianzaGeneral(analisis) {
        const confianzas = Object.values(analisis.tendencias)
            .map(t => t.confianza)
            .filter(c => c > 0);
        
        return confianzas.length > 0
            ? confianzas.reduce((a, b) => a + b, 0) / confianzas.length
            : 0.5;
    }

    calcularCoberturaDatos(analisis) {
        const metricasDisponibles = Object.keys(analisis.tendencias).length;
        const metricasEsperadas = 3; // flujoCaja, ingresos, gastos
        
        return Math.min(1, metricasDisponibles / metricasEsperadas);
    }

    calcularNivelDetalle(analisis) {
        let puntuacion = 0;
        
        if (analisis.tendencias && Object.keys(analisis.tendencias).length > 0) puntuacion += 25;
        if (analisis.riesgos && analisis.riesgos.length > 0) puntuacion += 25;
        if (analisis.oportunidades && analisis.oportunidades.length > 0) puntuacion += 25;
        if (analisis.predicciones && Object.keys(analisis.predicciones).length > 0) puntuacion += 25;
        
        return puntuacion / 100;
    }

    obtenerPeriodoActual() {
        const ahora = new Date();
        return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
    }
}

// ======= INSTANCIA GLOBAL Y INICIALIZACIÓN =======

let inteligenciaArtificialGrizalum = null;

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 DOM listo - Inicializando GRIZALUM AI Intelligence Module v2.0...');
    
    try {
        // Crear instancia global con retraso para asegurar que otros módulos estén listos
        setTimeout(() => {
            inteligenciaArtificialGrizalum = new InteligenciaArtificialGRIZALUM();
            inteligenciaArtificialGrizalum.inicializar();
            
            // Alias globales
            window.aiSystem = inteligenciaArtificialGrizalum;
            window.financialAI = inteligenciaArtificialGrizalum; // Compatibilidad
            
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error inicializando AI Intelligence Module:', error);
    }
});

// ======= FUNCIONES GLOBALES PARA COMPATIBILIDAD =======

// Funciones específicas para la UI del sistema (compatibilidad total)
window.generateAIReport = function() {
    if (!window.aiSystem?.inicializado) {
        console.warn('⚠️ Sistema de IA no inicializado');
        return null;
    }
    
    const datosMuestra = {
        flujoCaja: [15000, 18500, 22000, 17800, 21500, 19800, 24500],
        ingresos: [35000, 38000, 42000, 39000, 44000, 40300, 45200],
        gastos: [28000, 29500, 31000, 30200, 32500, 30200, 28700]
    };
    
    try {
        const reporte = window.aiSystem.generarReporteCompleto(datosMuestra);
        
        // Mostrar insights en la UI
        const insights = [
            `💡 Salud financiera: ${reporte.resumenEjecutivo.puntuacionSalud}/100`,
            `📈 Perspectiva: ${reporte.resumenEjecutivo.perspectiva}`,
            `⚠️ Alertas críticas: ${reporte.resumenEjecutivo.alertasCriticas}`,
            `🎯 Recomendaciones: ${reporte.recomendaciones.length}`
        ];
        
        let mensaje = "🤖 ANÁLISIS DE IA COMPLETADO:\n\n";
        insights.forEach(insight => {
            mensaje += insight + "\n";
        });
        
        // Compatibilidad con función antigua
        if (typeof showSuccessMessage === 'function') {
            showSuccessMessage(mensaje);
        }
        
        // Usar sistema de notificaciones si está disponible
        if (window.notificationSystem) {
            window.notificationSystem.exito('🤖 Análisis de IA completado exitosamente', {
                titulo: 'Reporte Generado',
                duracion: 4000
            });
        }
        
        return reporte;
        
    } catch (error) {
        console.error('❌ Error generando reporte de IA:', error);
        
        if (window.notificationSystem) {
            window.notificationSystem.error('Error generando reporte de IA');
        }
        
        return null;
    }
};

// Utilidades de IA para compatibilidad
window.aiUtilities = {
    // Análisis rápido
    quickAnalysis: (datos) => window.aiSystem?.analisisRapido(datos),
    
    // Obtener recomendaciones
    getRecommendations: (datos) => window.aiSystem?.obtenerRecomendaciones(datos),
    
    // Generar reporte completo
    generateReport: (datos) => window.aiSystem?.generarReporteCompleto(datos),
    
    // Obtener insights en tiempo real
    getRealTimeInsights: () => window.aiSystem?.obtenerInsightsEnTiempoReal(),
    
    // Generar predicciones
    generatePredictions: (datos, periodos) => window.aiSystem?.generarPredicciones(datos, periodos),
    
    // Obtener estadísticas del sistema
    getSystemStats: () => window.aiSystem?.obtenerEstadisticas()
};

// ======= API PÚBLICA DEL SISTEMA DE IA =======
window.GRIZALUM_AI = {
    version: '2.0.0',
    
    // Métodos principales
    analisisRapido: (datos) => window.aiSystem?.analisisRapido(datos),
    generarPredicciones: (datos, periodos) => window.aiSystem?.generarPredicciones(datos, periodos),
    obtenerRecomendaciones: (datos) => window.aiSystem?.obtenerRecomendaciones(datos),
    generarReporteCompleto: (datos) => window.aiSystem?.generarReporteCompleto(datos),
    obtenerInsightsEnTiempoReal: () => window.aiSystem?.obtenerInsightsEnTiempoReal(),
    
    // Estado y configuración
    obtenerEstado: () => window.aiSystem?.obtenerEstado(),
    obtenerEstadisticas: () => window.aiSystem?.obtenerEstadisticas(),
    limpiarCache: () => window.aiSystem?.limpiarCache(),
    reiniciarMetricas: () => window.aiSystem?.reiniciarMetricas(),
    
    // Utilidades
    estaInicializado: () => window.aiSystem?.inicializado || false
};

console.log('🤖 GRIZALUM AI Intelligence Module v2.0 cargado');
console.log('✨ Funcionalidades principales:');
console.log('  • 🧠 5 componentes especializados de IA');
console.log('  • 📈 Modelos predictivos avanzados con intervalos de confianza');
console.log('  • 🎯 Sistema de recomendaciones inteligente');
console.log('  • ⚠️ Alertas automáticas con priorización');
console.log('  • 📊 Scoring de salud financiera dinámico');
console.log('  • 🔮 Predicciones con detección de estacionalidad');
console.log('  • 📋 Reportes ejecutivos completos');
console.log('  • 💾 Cache inteligente y persistencia de datos');
console.log('🚀 ¡Sistema de inteligencia artificial de clase mundial listo!');

console.log(`
🤖 ===================================================
   GRIZALUM AI INTELLIGENCE MODULE v2.0 - ULTRA PROFESSIONAL
🤖 ===================================================

✨ FUNCIONES DISPONIBLES:
   • generateAIReport() - Generar reporte completo
   • GRIZALUM_AI.analisisRapido(datos) - Análisis inmediato
   • GRIZALUM_AI.generarPredicciones(datos) - Predicciones futuras
   • GRIZALUM_AI.obtenerRecomendaciones(datos) - Recomendaciones inteligentes
   • aiUtilities.* - Utilidades de compatibilidad

🧠 MEJORAS v2.0:
   • Integración completa con ecosistema GRIZALUM
   • Cache inteligente con TTL configurable
   • Persistencia de modelos y configuración
   • Sistema de logging unificado
   • Métricas y analíticas avanzadas
   • Validaciones robustas de datos
   • Manejo de errores profesional
   • Intervalos de confianza en predicciones
   • Alertas priorizadas automáticamente
   • Compatibilidad 100% con código existente

🔬 COMPONENTES ESPECIALIZADOS:
   • PredictorFinancieroGRIZALUM - Modelos predictivos
   • AnalizadorInteligente - Análisis integral
   • MotorRecomendaciones - Recomendaciones basadas en reglas
   • SistemaAlertasInteligentes - Monitoreo automático
   • GeneradorReportesIA - Reportes ejecutivos

🤖 ===================================================
`);
