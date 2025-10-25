/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - MÓDULO FLUJO DE CAJA
 * Sistema adaptativo de gestión de ingresos y gastos
 * VERSIÓN CORREGIDA: Soluciona problema de race condition con gráficos
 * ═══════════════════════════════════════════════════════════════════
 */

class FlujoCaja {
    constructor() {
        this.config = {
            version: '1.0.1', // 🔧 Incrementado
            componente: 'FlujoCaja',
            debug: true
        };

        this.empresaActual = null;
        this.nivel = null;
        this.componentesActivos = null;
        this.transacciones = [];
        this.categorias = {};
        
        this.gestor = null;
        this.sistemaNiveles = null;
        this.configuracion = null;

        // 🆕 NUEVO: Flag para saber si está listo
        this.inicializado = false;

        this._inicializar();
    }

    async _inicializar() {
        try {
            this._log('info', '💰 Flujo de Caja inicializando...');
            
            // Esperar dependencias
            await this._esperarDependencias();
            
            // Cargar empresa actual
            await this._cargarEmpresaActual();
            
            // Cargar transacciones
            await this._cargarTransacciones();
            
            // Configurar eventos
            this._configurarEventos();
            
            // 🆕 NUEVO: Marcar como inicializado
            this.inicializado = true;
            
            this._log('success', '✅ Flujo de Caja listo');
            
            // 🆕 NUEVO: Disparar evento de inicialización completa
            this._dispararEvento('flujoCajaInicializado', {
                transacciones: this.transacciones.length,
                balance: this.calcularBalance()
            });
            
        } catch (error) {
            this._log('error', 'Error inicializando Flujo de Caja:', error);
        }
    }

    async _esperarDependencias() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.gestorEmpresas && window.sistemaNiveles && window.FlujoCajaConfig) {
                    this.gestor = window.gestorEmpresas;
                    this.sistemaNiveles = window.sistemaNiveles;
                    this.configuracion = window.FlujoCajaConfig;
                    
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
        
        if (!this.nivel) {
            this._log('warn', 'Empresa sin nivel asignado');
            return;
        }

        // Obtener componentes activos según score
        const componentesOcultos = this.nivel.componentesOcultos || [];
        this.componentesActivos = this.configuracion.obtenerComponentesActivos(
            this.nivel.score,
            componentesOcultos
        );

        // Obtener categorías según industria
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        const industriaId = empresa?.perfilIndustrial || 'default';
        this.categorias = this.configuracion.obtenerCategorias(industriaId);

        this._log('info', `Empresa cargada: ${this.empresaActual}`);
        this._log('info', `Nivel: ${this.nivel.nivel.nombre} (Score: ${this.nivel.score})`);
        this._log('info', `Categorías cargadas:`, this.categorias);
    }

    async _cargarTransacciones() {
        try {
            const key = `grizalum_flujo_caja_${this.empresaActual}`;
            const datos = localStorage.getItem(key);
            
            if (datos) {
                this.transacciones = JSON.parse(datos);
                this._log('info', `✅ Cargadas ${this.transacciones.length} transacciones`);
            } else {
                this.transacciones = [];
                this._log('info', 'Sin transacciones previas');
            }
        } catch (error) {
            this._log('error', 'Error cargando transacciones:', error);
            this.transacciones = [];
        }
    }

_configurarEventos() {
        // Escuchar cambio de empresa
        document.addEventListener('grizalumCompanyChanged', (e) => {
            this._log('info', '🔄 Empresa cambiada, recargando...');
            console.log('🔄 [FlujoCaja] Empresa cambiada:', e.detail);
            
            this.inicializado = false;
            
            // Limpiar transacciones actuales en memoria
            this.transacciones = [];
            
            // Recargar datos de la nueva empresa
            this._cargarEmpresaActual().then(() => {
                console.log('📊 [FlujoCaja] Empresa cargada:', this.empresaActual);
                
                this._cargarTransacciones().then(() => {
                    console.log(`📋 [FlujoCaja] Cargadas ${this.transacciones.length} transacciones`);
                    
                    this.inicializado = true;
                    
                    // ✅ CRÍTICO: Forzar actualización de UI
                    console.log('🎨 [FlujoCaja] Actualizando UI...');
                    
                    if (window.flujoCajaUI) {
                        window.flujoCajaUI.cargarBalance();
                        window.flujoCajaUI.cargarTransacciones();
                        window.flujoCajaUI.cargarNivel();
                        window.flujoCajaUI.cargarCategorias();
                        console.log('✅ [FlujoCaja] UI actualizada correctamente');
                    } else {
                        console.warn('⚠️ [FlujoCaja] flujoCajaUI no disponible');
                    }
                    
                    // Disparar evento para otros componentes
                    this._dispararEvento('flujoCajaActualizado', {
                        empresaActual: this.empresaActual,
                        transacciones: this.transacciones.length,
                        balance: this.calcularBalance()
                    });
                });
            });
        });
        
        // Escuchar cambio de nivel
        document.addEventListener('grizalumCambioNivel', (e) => {
            if (e.detail.empresaId === this.empresaActual) {
                this._log('success', '🎉 Nivel actualizado, nuevos componentes disponibles');
                this._cargarEmpresaActual();
                this._renderizar();
            }
        });
        
        // Escuchar componente oculto/mostrado
        document.addEventListener('grizalumComponenteOculto', (e) => {
            this._actualizarComponentesActivos();
        });
        
        document.addEventListener('grizalumComponenteMostrado', (e) => {
            this._actualizarComponentesActivos();
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CRUD DE TRANSACCIONES
     * ═══════════════════════════════════════════════════════════════
     */

    agregarTransaccion(datos) {
        const transaccion = {
            id: this._generarId(),
            empresaId: this.empresaActual,
            tipo: datos.tipo, // 'ingreso' o 'gasto'
            monto: parseFloat(datos.monto),
            categoria: datos.categoria,
            descripcion: datos.descripcion || '',
            fecha: datos.fecha || new Date().toISOString(),
            metodoPago: datos.metodoPago || 'efectivo',
            comprobante: datos.comprobante || null,
            notas: datos.notas || '',
            meta: {
                creadoPor: 'usuario',
                fechaCreacion: new Date().toISOString(),
                fechaModificacion: new Date().toISOString()
            }
        };

        this.transacciones.unshift(transaccion);
        this._guardarTransacciones();
        
        // Registrar uso del componente
        this.sistemaNiveles.registrarUso(this.empresaActual, 'registroRapido');
        
        this._log('success', `✅ ${datos.tipo} agregado: S/. ${datos.monto}`);
        
        // Disparar evento
        this._dispararEvento('transaccionAgregada', transaccion);
        
        return transaccion;
    }

    editarTransaccion(id, datosNuevos) {
        const index = this.transacciones.findIndex(t => t.id === id);
        
        if (index === -1) {
            this._log('error', 'Transacción no encontrada');
            return false;
        }

        this.transacciones[index] = {
            ...this.transacciones[index],
            ...datosNuevos,
            meta: {
                ...this.transacciones[index].meta,
                fechaModificacion: new Date().toISOString()
            }
        };

        this._guardarTransacciones();
        
        this._log('info', `Transacción ${id} editada`);
        
        this._dispararEvento('transaccionEditada', this.transacciones[index]);
        
        return this.transacciones[index];
    }

    eliminarTransaccion(id) {
        const index = this.transacciones.findIndex(t => t.id === id);
        
        if (index === -1) {
            this._log('error', 'Transacción no encontrada');
            return false;
        }

        const transaccionEliminada = this.transacciones[index];
        this.transacciones.splice(index, 1);
        
        this._guardarTransacciones();
        
        this._log('info', `Transacción ${id} eliminada`);
        
        this._dispararEvento('transaccionEliminada', transaccionEliminada);
        
        return true;
    }

    obtenerTransaccion(id) {
        return this.transacciones.find(t => t.id === id);
    }

    obtenerTransacciones(filtros = {}) {
        let resultado = [...this.transacciones];

        // Filtrar por tipo
        if (filtros.tipo) {
            resultado = resultado.filter(t => t.tipo === filtros.tipo);
        }

        // Filtrar por categoría
        if (filtros.categoria) {
            resultado = resultado.filter(t => t.categoria === filtros.categoria);
        }

        // Filtrar por rango de fechas
        if (filtros.fechaInicio) {
            resultado = resultado.filter(t => new Date(t.fecha) >= new Date(filtros.fechaInicio));
        }

        if (filtros.fechaFin) {
            resultado = resultado.filter(t => new Date(t.fecha) <= new Date(filtros.fechaFin));
        }

        // Búsqueda por texto
        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            resultado = resultado.filter(t => 
                t.descripcion.toLowerCase().includes(busqueda) ||
                t.categoria.toLowerCase().includes(busqueda)
            );
        }

        return resultado;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CÁLCULOS Y ANÁLISIS
     * ═══════════════════════════════════════════════════════════════
     */

    calcularBalance(filtros = {}) {
        const transacciones = this.obtenerTransacciones(filtros);
        
        const ingresos = transacciones
            .filter(t => t.tipo === 'ingreso')
            .reduce((sum, t) => sum + t.monto, 0);
        
        const gastos = transacciones
            .filter(t => t.tipo === 'gasto')
            .reduce((sum, t) => sum + t.monto, 0);
        
        const balance = ingresos - gastos;

        return {
            ingresos,
            gastos,
            balance,
            cantidadIngresos: transacciones.filter(t => t.tipo === 'ingreso').length,
            cantidadGastos: transacciones.filter(t => t.tipo === 'gasto').length,
            total: transacciones.length
        };
    }

    calcularPorCategoria(tipo = null) {
    const transacciones = tipo 
        ? this.transacciones.filter(t => t.tipo === tipo)
        : this.transacciones;

    const porCategoria = {};

    transacciones.forEach(t => {
        // ✅ NORMALIZAR: convertir a minúsculas para agrupar
        const categoriaNormalizada = t.categoria.toLowerCase();
        
        if (!porCategoria[categoriaNormalizada]) {
            porCategoria[categoriaNormalizada] = {
                categoria: t.categoria, // Mantener el nombre original (primera ocurrencia)
                monto: 0,
                cantidad: 0,
                transacciones: []
            };
        }

        porCategoria[categoriaNormalizada].monto += t.monto;
        porCategoria[categoriaNormalizada].cantidad++;
        porCategoria[categoriaNormalizada].transacciones.push(t);
    });

    return Object.values(porCategoria).sort((a, b) => b.monto - a.monto);
}
    calcularPorMes(meses = 6) {
        const ahora = new Date();
        const resultado = [];

        for (let i = meses - 1; i >= 0; i--) {
            const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
            const mesInicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
            const mesFin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59);

            const balance = this.calcularBalance({
                fechaInicio: mesInicio.toISOString(),
                fechaFin: mesFin.toISOString()
            });

            resultado.push({
                mes: fecha.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' }),
                fecha: fecha.toISOString(),
                ...balance
            });
        }

        return resultado;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * UTILIDADES
     * ═══════════════════════════════════════════════════════════════
     */

    _guardarTransacciones() {
        try {
            const key = `grizalum_flujo_caja_${this.empresaActual}`;
            localStorage.setItem(key, JSON.stringify(this.transacciones));
        } catch (error) {
            this._log('error', 'Error guardando transacciones:', error);
        }
    }

    _generarId() {
        return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    _actualizarComponentesActivos() {
        this._cargarEmpresaActual();
    }

    _renderizar() {
        this._dispararEvento('flujoCajaActualizado', {
            nivel: this.nivel,
            componentesActivos: this.componentesActivos,
            balance: this.calcularBalance()
        });
    }

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

    /**
     * ═══════════════════════════════════════════════════════════════
     * API PÚBLICA
     * ═══════════════════════════════════════════════════════════════
     */

    // 🆕 NUEVO: Verificar si está inicializado
    estaListo() {
        return this.inicializado;
    }

    // 🆕 NUEVO: Esperar a que esté listo
    async esperarInicializacion() {
        if (this.inicializado) {
            return true;
        }

        return new Promise((resolve) => {
            const listener = () => {
                document.removeEventListener('grizalumFlujoCajaInicializado', listener);
                resolve(true);
            };
            document.addEventListener('grizalumFlujoCajaInicializado', listener);
        });
    }

    // Obtener información del módulo
    obtenerInfo() {
        return {
            empresaActual: this.empresaActual,
            nivel: this.nivel,
            componentesActivos: this.componentesActivos,
            categorias: this.categorias,
            balance: this.calcularBalance(),
            totalTransacciones: this.transacciones.length
        };
    }

    // Verificar si un componente está activo
    componenteActivo(componenteId) {
        for (const grupo of Object.values(this.componentesActivos)) {
            for (const componente of Object.values(grupo)) {
                if (componente.id === componenteId) {
                    return componente.activo === true;
                }
            }
        }
        return false;
    }

    // Exportar datos a JSON
    exportarJSON() {
        return {
            empresa: this.empresaActual,
            fecha: new Date().toISOString(),
            transacciones: this.transacciones,
            balance: this.calcularBalance(),
            porCategoria: this.calcularPorCategoria()
        };
    }
}

// Inicialización global
window.flujoCaja = new FlujoCaja();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  💰 FLUJO DE CAJA v1.0.1 (FIXED)                              ║
║  Sistema adaptativo de gestión financiera                     ║
║  🔧 Corregido: Race condition con gráficos                    ║
╚═══════════════════════════════════════════════════════════════╝
`);
