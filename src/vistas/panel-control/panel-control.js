/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - PANEL DE CONTROL
 * Sistema de dashboard ejecutivo con datos reales
 * VERSION: 1.0.0
 * ═══════════════════════════════════════════════════════════════════
 */

class PanelControl {
    constructor() {
        this.config = {
            version: '1.0.0',
            componente: 'PanelControl',
            debug: true
        };

        this.empresaActual = null;
        this.nivel = null;
        this.planActual = null;
        this.datos = {
            ingresos: 0,
            gastos: 0,
            utilidad: 0,
            crecimiento: 0,
            balance: 0,
            transacciones: []
        };
        
        this.flujoCaja = null;
        this.gestor = null;
        this.sistemaNiveles = null;
        this.planes = null;

        this.inicializado = false;

        this._inicializar();
    }

    async _inicializar() {
        try {
            this._log('info', '📊 Panel de Control inicializando...');
            
            // Esperar dependencias
            await this._esperarDependencias();
            
            // Cargar empresa actual
            await this._cargarEmpresaActual();
            
            // Cargar datos financieros
            await this._cargarDatosFinancieros();
            
            // Configurar eventos
            this._configurarEventos();
            
            this.inicializado = true;
            
            this._log('success', '✅ Panel de Control listo');
            
            // Disparar evento de inicialización
            this._dispararEvento('panelControlInicializado', {
                empresa: this.empresaActual,
                plan: this.planActual?.nombre,
                datos: this.datos
            });
            
        } catch (error) {
            this._log('error', 'Error inicializando Panel de Control:', error);
        }
    }

    async _esperarDependencias() {
        return new Promise((resolve) => {
            const verificar = () => {
                const dependenciasListas = 
                    window.gestorEmpresas && 
                    window.sistemaNiveles && 
                    window.FlujoCajaPlanes &&
                    window.flujoCaja;

                if (dependenciasListas) {
                    this.gestor = window.gestorEmpresas;
                    this.sistemaNiveles = window.sistemaNiveles;
                    this.planes = window.FlujoCajaPlanes;
                    this.flujoCaja = window.flujoCaja;
                    
                    this._log('info', '✅ Dependencias conectadas');
                    resolve();
                } else {
                    setTimeout(verificar, 500);
                }
            };
            verificar();
        });
    }

    async _cargarEmpresaActual() {
        this.empresaActual = this.gestor.estado.empresaActual;
        
        if (!this.empresaActual) {
            this._log('warn', 'No hay empresa seleccionada');
            return;
        }

        // Obtener nivel de la empresa
        this.nivel = this.sistemaNiveles.obtenerNivelEmpresa(this.empresaActual);
        
        // Obtener plan actual
        if (this.planes) {
            this.planActual = this.planes.obtenerPlanActual();
        }

        this._log('info', `Empresa cargada: ${this.empresaActual}`);
        this._log('info', `Plan actual: ${this.planActual?.nombre || 'Individual'}`);
    }

    async _cargarDatosFinancieros() {
        try {
            // Obtener datos del Flujo de Caja
            if (this.flujoCaja && this.flujoCaja.estaListo()) {
                // 🎯 FIX: Verificar que FlujoCaja esté usando la empresa correcta
            if (this.flujoCaja.empresaActual !== this.empresaActual) {
                this._log('warn', `⚠️ FlujoCaja en empresa incorrecta. Esperado: ${this.empresaActual}, Actual: ${this.flujoCaja.empresaActual}`);
                
                // Forzar recarga de empresa en FlujoCaja
                if (this.flujoCaja._cargarEmpresaActual) {
                    await this.flujoCaja._cargarEmpresaActual();
                    await this.flujoCaja._cargarTransacciones();
                    this._log('success', '✅ FlujoCaja sincronizado con empresa correcta');
                }
            }
                const balance = this.flujoCaja.calcularBalance();
                const transacciones = this.flujoCaja.obtenerTransacciones();
                
                this.datos = {
                    ingresos: balance.ingresos || 0,
                    gastos: balance.gastos || 0,
                    utilidad: balance.balance || 0,
                    balance: balance.balance || 0,
                    crecimiento: this._calcularCrecimiento(transacciones),
                    cantidadIngresos: balance.cantidadIngresos || 0,
                    cantidadGastos: balance.cantidadGastos || 0,
                    transacciones: transacciones
                };

                this._log('info', '📊 Datos financieros cargados:', this.datos);
            } else {
                this._log('warn', 'FlujoCaja no está listo, esperando...');
                
                // Esperar a que FlujoCaja se inicialice
                await new Promise((resolve) => {
                    const listener = () => {
                        document.removeEventListener('grizalumFlujoCajaInicializado', listener);
                        resolve();
                    };
                    document.addEventListener('grizalumFlujoCajaInicializado', listener);
                });

                // Reintentar carga
                await this._cargarDatosFinancieros();
            }
        } catch (error) {
            this._log('error', 'Error cargando datos financieros:', error);
            
            // Datos por defecto
            this.datos = {
                ingresos: 0,
                gastos: 0,
                utilidad: 0,
                balance: 0,
                crecimiento: 0,
                cantidadIngresos: 0,
                cantidadGastos: 0,
                transacciones: []
            };
        }
    }

    _calcularCrecimiento(transacciones) {
        if (!transacciones || transacciones.length === 0) {
            return 0;
        }

        // Calcular ingresos del mes actual vs mes anterior
        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const añoActual = ahora.getFullYear();
        
        const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
        const añoAnterior = mesActual === 0 ? añoActual - 1 : añoActual;

        const ingresosActuales = transacciones
            .filter(t => {
                const fecha = new Date(t.fecha);
                return t.tipo === 'ingreso' && 
                       fecha.getMonth() === mesActual && 
                       fecha.getFullYear() === añoActual;
            })
            .reduce((sum, t) => sum + t.monto, 0);

        const ingresosAnteriores = transacciones
            .filter(t => {
                const fecha = new Date(t.fecha);
                return t.tipo === 'ingreso' && 
                       fecha.getMonth() === mesAnterior && 
                       fecha.getFullYear() === añoAnterior;
            })
            .reduce((sum, t) => sum + t.monto, 0);

        if (ingresosAnteriores === 0) {
            return ingresosActuales > 0 ? 100 : 0;
        }

        const crecimiento = ((ingresosActuales - ingresosAnteriores) / ingresosAnteriores) * 100;
        return Math.round(crecimiento * 10) / 10; // Redondear a 1 decimal
    }

    _configurarEventos() {
        // Escuchar cambio de empresa
        document.addEventListener('grizalumCompanyChanged', async (e) => {
            this._log('info', '🔄 Empresa cambiada, recargando panel...');
            
            this.inicializado = false;
            
            await this._cargarEmpresaActual();
            await this._cargarDatosFinancieros();
            
            this.inicializado = true;
            
            this._dispararEvento('panelControlActualizado', {
                empresa: this.empresaActual,
                datos: this.datos
            });
        });

        // Escuchar cambios en Flujo de Caja
        document.addEventListener('grizalumTransaccionAgregada', () => {
            this._actualizarDatos();
        });

        document.addEventListener('grizalumTransaccionEditada', () => {
            this._actualizarDatos();
        });

        document.addEventListener('grizalumTransaccionEliminada', () => {
            this._actualizarDatos();
        });

        // Escuchar cambio de plan
        document.addEventListener('grizalumPlanCambiado', (e) => {
            this.planActual = e.detail.plan;
            this._log('info', `📊 Plan cambiado a: ${this.planActual.nombre}`);
            this._dispararEvento('panelControlPlanCambiado', { plan: this.planActual });
        });
    }

    async _actualizarDatos() {
        this._log('info', '🔄 Actualizando datos del panel...');
        await this._cargarDatosFinancieros();
        this._dispararEvento('panelControlActualizado', {
            empresa: this.empresaActual,
            datos: this.datos
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * OBTENCIÓN DE DATOS PARA GRÁFICOS
     * ═══════════════════════════════════════════════════════════════
     */

    obtenerDatosFlujoCaja(meses = 6) {
        if (!this.flujoCaja) {
            return this._datosVacios(meses);
        }

        return this.flujoCaja.calcularPorMes(meses);
    }

    obtenerDatosCategoria(tipo = null) {
        if (!this.flujoCaja) {
            return [];
        }

        return this.flujoCaja.calcularPorCategoria(tipo);
    }

    obtenerComparativaIngresosGastos(meses = 6) {
        const datosMensuales = this.obtenerDatosFlujoCaja(meses);
        
        return {
            labels: datosMensuales.map(m => m.mes),
            ingresos: datosMensuales.map(m => m.ingresos),
            gastos: datosMensuales.map(m => m.gastos)
        };
    }

    obtenerFlujoDiario(dias = 30) {
        if (!this.flujoCaja) {
            return { labels: [], datos: [] };
        }

        const ahora = new Date();
        const resultado = [];

        for (let i = dias - 1; i >= 0; i--) {
            const fecha = new Date(ahora);
            fecha.setDate(fecha.getDate() - i);
            fecha.setHours(0, 0, 0, 0);

            const fechaFin = new Date(fecha);
            fechaFin.setHours(23, 59, 59, 999);

            const balance = this.flujoCaja.calcularBalance({
                fechaInicio: fecha.toISOString(),
                fechaFin: fechaFin.toISOString()
            });

            resultado.push({
                fecha: fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
                balance: balance.balance
            });
        }

        return {
            labels: resultado.map(r => r.fecha),
            datos: resultado.map(r => r.balance)
        };
    }

    _datosVacios(meses) {
        const resultado = [];
        const ahora = new Date();

        for (let i = meses - 1; i >= 0; i--) {
            const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
            resultado.push({
                mes: fecha.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' }),
                ingresos: 0,
                gastos: 0,
                balance: 0
            });
        }

        return resultado;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * API PÚBLICA
     * ═══════════════════════════════════════════════════════════════
     */

    estaListo() {
        return this.inicializado;
    }

    async esperarInicializacion() {
        if (this.inicializado) {
            return true;
        }

        return new Promise((resolve) => {
            const listener = () => {
                document.removeEventListener('grizalumPanelControlInicializado', listener);
                resolve(true);
            };
            document.addEventListener('grizalumPanelControlInicializado', listener);
        });
    }

    obtenerInfo() {
        return {
            empresaActual: this.empresaActual,
            nivel: this.nivel,
            plan: this.planActual,
            datos: this.datos,
            inicializado: this.inicializado
        };
    }

    obtenerDatos() {
        return this.datos;
    }

    obtenerPlan() {
        return this.planActual;
    }

    tieneFuncionalidad(funcionalidad) {
        if (!this.planes) return false;
        return this.planes.tieneFuncionalidad(funcionalidad);
    }

    exportarJSON() {
        return {
            empresa: this.empresaActual,
            plan: this.planActual?.nombre,
            fecha: new Date().toISOString(),
            datos: this.datos,
            flujoCaja: this.obtenerDatosFlujoCaja(6)
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
        } else {
            console.log(`${prefijo}`, mensaje, datos);
        }
    }
}

// Inicialización global
window.panelControl = new PanelControl();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  📊 PANEL DE CONTROL v1.0.0                                   ║
║  Dashboard ejecutivo con datos reales                         ║
║  ✅ Integrado con Flujo de Caja                               ║
║  ✅ Sistema de planes adaptativo                              ║
╚═══════════════════════════════════════════════════════════════╝
`);
