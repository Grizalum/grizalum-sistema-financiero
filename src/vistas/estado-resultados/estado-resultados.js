/**
 * ═══════════════════════════════════════════════════════════════════
 * ESTADO DE RESULTADOS - MÓDULO PRINCIPAL v2.1.1 CORREGIDO
 * Genera reportes financieros desde transacciones del Flujo de Caja
 * ✅ FIX: Propiedades ingresosTotales, gastosTotales, costosTotales
 * ✅ FIX: Función obtenerTransaccionesFiltradas()
 * ✅ FIX: Key correcta grizalum_flujo_caja_
 * ═══════════════════════════════════════════════════════════════════
 */

if (typeof EstadoResultados === 'undefined') {
    class EstadoResultados {
        constructor() {
            this.config = {
                version: '2.1.1', // ✅ ACTUALIZADO - Fix key localStorage
                componente: 'EstadoResultados',
                debug: true
            };
            
            this.empresaActual = null;
            this.nivel = null;
            this.componentesActivos = {};
            this.periodoActual = 'mes';
            this.resultados = null;
            
            this.gestor = null;
            this.sistemaNiveles = null;
            this.configuracion = null;
            this.flujoCaja = null;
            this.inicializado = false;
            
            this._inicializar();
        }

        async _inicializar() {
            try {
                this._log('info', '📊 Estado de Resultados inicializando...');
                
                await this._esperarDependencias();
                await this._cargarEmpresaActual();
                this._calcularResultados();
                
                this.inicializado = true;
                
                this._log('success', '✅ Estado de Resultados listo');
                
                this._dispararEvento('estadoResultadosInicializado', {
                    empresa: this.empresaActual,
                    periodo: this.periodoActual
                });
                
            } catch (error) {
                this._log('error', 'Error inicializando:', error);
            }
        }

        async _esperarDependencias() {
            return new Promise((resolve) => {
                const verificar = () => {
                    if (window.gestorEmpresas && 
                        window.sistemaNiveles && 
                        window.EstadoResultadosConfig &&
                        window.flujoCaja) {
                        
                        this.gestor = window.gestorEmpresas;
                        this.sistemaNiveles = window.sistemaNiveles;
                        this.configuracion = window.EstadoResultadosConfig || null;
                        this.flujoCaja = window.flujoCaja;
                        
                        this._log('info', '✅ Dependencias conectadas (incluye FlujoCaja)');
                        resolve();
                    } else {
                        setTimeout(verificar, 300);
                    }
                };
                verificar();
            });
        }

        async _cargarEmpresaActual() {
            this.empresaActual = this.gestor?.estado?.empresaActual;
            
            if (!this.empresaActual) {
                const stored = localStorage.getItem('grizalum_empresa_actual');
                this.empresaActual = stored || 'avicola';
                this._log('warn', `Empresa no en gestor, usando: ${this.empresaActual}`);
            }

            if (this.flujoCaja && this.flujoCaja.empresaActual !== this.empresaActual) {
                this._log('info', '🔄 Sincronizando empresa con FlujoCaja...');
                if (this.flujoCaja._cargarEmpresaActual) {
                    await this.flujoCaja._cargarEmpresaActual();
                    await this.flujoCaja._cargarTransacciones();
                }
            }

            this._log('info', '🔓 Modo desarrollo - SIN RESTRICCIONES DE NIVEL');
            
            this.nivel = {
                score: 100,
                nivel: { nombre: 'Corporativo', id: 'corporativo' },
                componentesOcultos: []
            };

            this.componentesActivos = {
                core: {
                    reporteBasico: { id: 'reporteBasico', activo: true, obligatorio: true },
                    visualizacionSimple: { id: 'visualizacionSimple', activo: true, obligatorio: true }
                },
                mejorasBasicas: {
                    filtrosPeriodo: { id: 'filtrosPeriodo', activo: true },
                    desgloseCategorias: { id: 'desgloseCategorias', activo: true },
                    comparacionPeriodos: { id: 'comparacionPeriodos', activo: true }
                },
                visualizacionAvanzada: {
                    ratiosFinancieros: { id: 'ratiosFinancieros', activo: true },
                    graficosBasicos: { id: 'graficosBasicos', activo: true },
                    exportarExcel: { id: 'exportarExcel', activo: true }
                },
                analisisIntermedio: {
                    analisisVertical: { id: 'analisisVertical', activo: true },
                    puntoEquilibrio: { id: 'puntoEquilibrio', activo: true },
                    tendenciasHistoricas: { id: 'tendenciasHistoricas', activo: true }
                },
                profesional: {
                    analisisHorizontal: { id: 'analisisHorizontal', activo: true },
                    proyecciones: { id: 'proyecciones', activo: true },
                    kpisAvanzados: { id: 'kpisAvanzados', activo: true }
                },
                elite: {
                    analisisComparativo: { id: 'analisisComparativo', activo: true },
                    presupuestoVsReal: { id: 'presupuestoVsReal', activo: true },
                    analisisIA: { id: 'analisisIA', activo: true }
                }
            };

            this._log('info', `Empresa: ${this.empresaActual}, Nivel: ${this.nivel.nivel.nombre} (Score: ${this.nivel.score})`);
        }

        /**
         * ═══════════════════════════════════════════════════════════════
         * CÁLCULO DE ESTADO DE RESULTADOS
         * ✅ FIX: Ahora incluye ingresosTotales, gastosTotales, costosTotales
         * ═══════════════════════════════════════════════════════════════
         */
        calcularResultados(periodoId = null) {
            if (periodoId) {
                this.periodoActual = periodoId;
            }

            // ✅ FIX: Si es personalizado, pasar las fechas
            let rango;
            if (this.periodoActual === 'personalizado' && this.fechaInicioPersonalizada && this.fechaFinPersonalizada) {
                rango = this.configuracion.obtenerRangoPeriodo(
                    'personalizado', 
                    this.fechaInicioPersonalizada, 
                    this.fechaFinPersonalizada
                );
            } else {
                rango = this.configuracion.obtenerRangoPeriodo(this.periodoActual);
            }

            const transacciones = this._obtenerTransaccionesDeFlujoCaja(rango.inicio, rango.fin);
            
            this._log('info', `Calculando resultados para ${this.periodoActual} (${transacciones.length} transacciones)`);

            const clasificadas = this._clasificarTransacciones(transacciones);
            
            const ingresos = this._calcularTotales(clasificadas.ingresos);
            const costos = this._calcularTotales(clasificadas.costos);
            const gastosOperativos = this._calcularTotales(clasificadas.gastosOperativos);
            const gastosFinancieros = this._calcularTotales(clasificadas.gastosFinancieros);

            const utilidadBruta = ingresos.total - costos.total;
            const utilidadOperativa = utilidadBruta - gastosOperativos.total;
            const utilidadNeta = utilidadOperativa - gastosFinancieros.total;

            const ratios = this._calcularRatios(ingresos.total, utilidadBruta, utilidadOperativa, utilidadNeta);
            const insights = this._generarInsights(ingresos.total, gastosOperativos.total, utilidadNeta, ratios);

            // ✅ FIX: Agregar propiedades faltantes
            this.resultados = {
                periodo: this.periodoActual,
                rango: rango,
                ingresos: ingresos,
                costos: costos,
                gastosOperativos: gastosOperativos,
                gastosFinancieros: gastosFinancieros,
                utilidadBruta: utilidadBruta,
                utilidadOperativa: utilidadOperativa,
                utilidadNeta: utilidadNeta,
                ratios: ratios,
                insights: insights,
                totalTransacciones: transacciones.length,
                // ✅ NUEVAS PROPIEDADES para compatibilidad
                ingresosTotales: ingresos.total,
                costosTotales: costos.total,
                gastosTotales: gastosOperativos.total
            };

            this._log('info', 'Resultados calculados:', this.resultados);
            
            this._dispararEvento('resultadosCalculados', this.resultados);
            
            return this.resultados;
        }

        /**
         * ═══════════════════════════════════════════════════════════════
         * ✅ NUEVA FUNCIÓN: obtenerTransaccionesFiltradas
         * Retorna transacciones filtradas por período
         * ═══════════════════════════════════════════════════════════════
         */
        obtenerTransaccionesFiltradas(periodoId = null) {
            const periodo = periodoId || this.periodoActual;
            const empresa = this.empresaActual;
            
            // Obtener rango del período
            const rango = this.configuracion.obtenerRangoPeriodo(periodo);
            if (!rango) {
                this._log('warn', `Período ${periodo} no válido`);
                return [];
            }
            
            // Intentar desde FlujoCaja primero
            if (this.flujoCaja) {
                try {
                    const todasTrans = this.flujoCaja.obtenerTransacciones();
                    return todasTrans.filter(t => {
                        if (!t.fecha) return false;
                        const fecha = new Date(t.fecha);
                        return fecha >= rango.inicio && fecha <= rango.fin;
                    });
                } catch (error) {
                    this._log('warn', 'Error obteniendo desde FlujoCaja, usando localStorage');
                }
            }
            
            // ✅ FIX: Fallback a localStorage con key correcta
            const key = `grizalum_flujo_caja_${empresa}`;
            const data = localStorage.getItem(key);
            const todasTrans = data ? JSON.parse(data) : [];
            
            return todasTrans.filter(t => {
                if (!t.fecha) return false;
                const fecha = new Date(t.fecha);
                return fecha >= rango.inicio && fecha <= rango.fin;
            });
        }

        /**
         * ═══════════════════════════════════════════════════════════════
         * OBTENER TRANSACCIONES DE FLUJOCAJA (Sin duplicación)
         * ═══════════════════════════════════════════════════════════════
         */
        _obtenerTransaccionesDeFlujoCaja(fechaInicio, fechaFin) {
            try {
                if (!this.flujoCaja) {
                    this._log('warn', 'FlujoCaja no disponible, intentando localStorage...');
                    return this._obtenerTransaccionesDesdeLocalStorage(this.empresaActual, fechaInicio, fechaFin);
                }

                if (this.flujoCaja.empresaActual !== this.empresaActual) {
                    this._log('warn', '⚠️ FlujoCaja en empresa diferente, sincronizando...');
                }

                const todasTransacciones = this.flujoCaja.obtenerTransacciones();
                
                const transaccionesFiltradas = todasTransacciones.filter(t => {
                    if (!t.fecha) return false;
                    
                    const fechaTransaccion = new Date(t.fecha);
                    return fechaTransaccion >= fechaInicio && fechaTransaccion <= fechaFin;
                });
                
                this._log('info', `📊 ${transaccionesFiltradas.length} de ${todasTransacciones.length} transacciones en el período`);
                
                return transaccionesFiltradas;
                
            } catch (error) {
                this._log('error', 'Error obteniendo transacciones de FlujoCaja:', error);
                return this._obtenerTransaccionesDesdeLocalStorage(this.empresaActual, fechaInicio, fechaFin);
            }
        }

        /**
         * FALLBACK: Leer desde localStorage si FlujoCaja falla
         */
        _obtenerTransaccionesDesdeLocalStorage(empresaId, fechaInicio, fechaFin) {
            try {
                // ✅ FIX: Usar grizalum_flujo_caja en vez de grizalum_transacciones
                const key = `grizalum_flujo_caja_${empresaId}`;
                const dataStr = localStorage.getItem(key);
                
                if (!dataStr) {
                    this._log('info', `No hay transacciones guardadas para ${empresaId}`);
                    return [];
                }
                
                const allTransacciones = JSON.parse(dataStr);
                
                if (!Array.isArray(allTransacciones)) {
                    this._log('warn', 'Datos de transacciones inválidos');
                    return [];
                }
                
                const transaccionesFiltradas = allTransacciones.filter(t => {
                    if (!t.fecha) return false;
                    
                    const fechaTransaccion = new Date(t.fecha);
                    return fechaTransaccion >= fechaInicio && fechaTransaccion <= fechaFin;
                });
                
                this._log('info', `📊 ${transaccionesFiltradas.length} transacciones desde localStorage`);
                
                return transaccionesFiltradas;
                
            } catch (error) {
                this._log('error', 'Error leyendo localStorage:', error);
                return [];
            }
        }

        _clasificarTransacciones(transacciones) {
            const clasificadas = {
                ingresos: [],
                costos: [],
                gastosOperativos: [],
                gastosFinancieros: []
            };

            transacciones.forEach(t => {
                const clasificacion = this.configuracion.clasificarCategoria(t.categoria);
                
                if (t.tipo === 'ingreso') {
                    clasificadas.ingresos.push({
                        ...t,
                        clasificacion: clasificacion
                    });
                } else {
                    if (clasificacion.grupo === 'costos') {
                        clasificadas.costos.push({ ...t, clasificacion });
                    } else if (clasificacion.grupo === 'gastosFinancieros') {
                        clasificadas.gastosFinancieros.push({ ...t, clasificacion });
                    } else {
                        clasificadas.gastosOperativos.push({ ...t, clasificacion });
                    }
                }
            });

            return clasificadas;
        }

        _calcularTotales(transacciones) {
            const porCategoria = {};
            let total = 0;

            transacciones.forEach(t => {
                const categoria = t.categoria;
                
                if (!porCategoria[categoria]) {
                    porCategoria[categoria] = {
                        categoria: categoria,
                        monto: 0,
                        cantidad: 0,
                        transacciones: []
                    };
                }

                porCategoria[categoria].monto += t.monto;
                porCategoria[categoria].cantidad++;
                porCategoria[categoria].transacciones.push(t);
                
                total += t.monto;
            });

            return {
                total: total,
                porCategoria: Object.values(porCategoria).sort((a, b) => b.monto - a.monto),
                cantidad: transacciones.length
            };
        }

        _calcularRatios(ingresos, utilidadBruta, utilidadOperativa, utilidadNeta) {
            const margenBruto = ingresos > 0 ? (utilidadBruta / ingresos) * 100 : 0;
            const margenOperativo = ingresos > 0 ? (utilidadOperativa / ingresos) * 100 : 0;
            const margenNeto = ingresos > 0 ? (utilidadNeta / ingresos) * 100 : 0;

            return {
                margenBruto: Math.max(0, Math.min(100, margenBruto)),
                margenOperativo: Math.max(-100, Math.min(100, margenOperativo)),
                margenNeto: Math.max(-100, Math.min(100, margenNeto))
            };
        }

        /**
         * ═══════════════════════════════════════════════════════════════
         * INSIGHTS AUTOMÁTICOS
         * ═══════════════════════════════════════════════════════════════
         */
        _generarInsights(ingresos, gastos, utilidad, ratios) {
            const insights = [];

            if (ratios.margenNeto > 15) {
                insights.push({
                    tipo: 'positivo',
                    icono: '💰',
                    mensaje: `Excelente rentabilidad con ${ratios.margenNeto.toFixed(1)}% de margen neto`
                });
            } else if (ratios.margenNeto < 5 && ratios.margenNeto > 0) {
                insights.push({
                    tipo: 'advertencia',
                    icono: '⚠️',
                    mensaje: `Margen neto bajo (${ratios.margenNeto.toFixed(1)}%). Revisar estructura de costos`
                });
            } else if (utilidad < 0) {
                insights.push({
                    tipo: 'negativo',
                    icono: '🔴',
                    mensaje: `Pérdida de S/. ${Math.abs(utilidad).toFixed(2)}. Reducir gastos urgentemente`
                });
            }

            if (ingresos > 0) {
                const ratioGastos = (gastos / ingresos) * 100;
                if (ratioGastos > 70) {
                    insights.push({
                        tipo: 'advertencia',
                        icono: '📊',
                        mensaje: `Gastos operativos representan ${ratioGastos.toFixed(1)}% de ingresos. Optimizar`
                    });
                }
            }

            if (ratios.margenBruto > 50) {
                insights.push({
                    tipo: 'positivo',
                    icono: '✅',
                    mensaje: `Margen bruto saludable del ${ratios.margenBruto.toFixed(1)}%`
                });
            }

            return insights;
        }

        /**
         * ═══════════════════════════════════════════════════════════════
         * COMPARACIÓN CON PERÍODO ANTERIOR
         * ═══════════════════════════════════════════════════════════════
         */
        calcularComparacion() {
            const rangoAnterior = this.configuracion.calcularPeriodoAnterior(this.periodoActual);
            
            const transaccionesAnteriores = this._obtenerTransaccionesDeFlujoCaja(
                rangoAnterior.inicio,
                rangoAnterior.fin
            );

            const clasificadas = this._clasificarTransacciones(transaccionesAnteriores);
            const ingresos = this._calcularTotales(clasificadas.ingresos);
            const costos = this._calcularTotales(clasificadas.costos);
            const gastosOperativos = this._calcularTotales(clasificadas.gastosOperativos);
            const gastosFinancieros = this._calcularTotales(clasificadas.gastosFinancieros);
            
            const utilidadBruta = ingresos.total - costos.total;
            const utilidadOperativa = utilidadBruta - gastosOperativos.total;
            const utilidadNeta = utilidadOperativa - gastosFinancieros.total;

            const variaciones = {
                ingresos: this._calcularVariacion(this.resultados.ingresos.total, ingresos.total),
                costos: this._calcularVariacion(this.resultados.costos.total, costos.total),
                gastosOperativos: this._calcularVariacion(this.resultados.gastosOperativos.total, gastosOperativos.total),
                gastosFinancieros: this._calcularVariacion(this.resultados.gastosFinancieros.total, gastosFinancieros.total),
                utilidadNeta: this._calcularVariacion(this.resultados.utilidadNeta, utilidadNeta)
            };

            return variaciones;
        }

        _calcularVariacion(actual, anterior) {
            if (anterior === 0) {
                return {
                    monto: actual,
                    porcentaje: actual > 0 ? 100 : 0,
                    tipo: actual > 0 ? 'positivo' : actual < 0 ? 'negativo' : 'neutral'
                };
            }

            const diferencia = actual - anterior;
            const porcentaje = (diferencia / anterior) * 100;

            return {
                monto: diferencia,
                porcentaje: porcentaje,
                tipo: diferencia > 0 ? 'positivo' : diferencia < 0 ? 'negativo' : 'neutral'
            };
        }

        /**
         * ═══════════════════════════════════════════════════════════════
         * API PÚBLICA
         * ═══════════════════════════════════════════════════════════════
         */
        obtenerResultados() {
            return this.resultados;
        }

        obtenerInfo() {
            return {
                empresaActual: this.empresaActual,
                nivel: this.nivel,
                componentesActivos: this.componentesActivos,
                periodoActual: this.periodoActual,
                resultados: this.resultados
            };
        }

        componenteActivo(componenteId) {
            if (!this.componentesActivos || typeof this.componentesActivos !== 'object') {
                return false;
            }
            
            for (const grupo of Object.values(this.componentesActivos)) {
                if (!grupo || typeof grupo !== 'object') continue;
                
                for (const componente of Object.values(grupo)) {
                    if (componente && componente.id === componenteId) {
                        return componente.activo === true;
                    }
                }
            }

            return false;
        }

        cambiarPeriodo(periodoId) {
            this.periodoActual = periodoId;
            this.calcularResultados();
            return this.resultados;
        }

        exportarJSON() {
            return {
                empresa: this.empresaActual,
                periodo: this.periodoActual,
                fecha: new Date().toISOString(),
                resultados: this.resultados
            };
        }

        /**
         * ═══════════════════════════════════════════════════════════════
         * UTILIDADES
         * ═══════════════════════════════════════════════════════════════
         */
        _dispararEvento(nombre, datos) {
            const evento = new CustomEvent(`grizalum${nombre.charAt(0).toUpperCase() + nombre.slice(1)}`, {
                detail: datos,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(evento);
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
                console.log(`%c${prefijo} ${mensaje}`, 'color: #10b981; font-weight: bold', datos || '');
            } else {
                console.log(`${prefijo}`, mensaje, datos);
            }
        }

        _calcularResultados() {
            this.calcularResultados();
        }
    }
    
    window.EstadoResultados = EstadoResultados;
}

// Inicialización global
if (!window.estadoResultados) {
    window.estadoResultados = new window.EstadoResultados();
}

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  📊 ESTADO DE RESULTADOS v2.1.1 CORREGIDO                    ║
║  ✅ Fix: ingresosTotales, gastosTotales, costosTotales      ║
║  ✅ Fix: obtenerTransaccionesFiltradas() agregada           ║
║  ✅ Fix: Key correcta grizalum_flujo_caja_                  ║
╚═══════════════════════════════════════════════════════════════╝
`);
