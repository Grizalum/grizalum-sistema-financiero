/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - MÓDULO FLUJO DE CAJA v2.0 CORREGIDO
 * Sistema adaptativo de gestión de ingresos y gastos
 * VERSIÓN MULTI-EMPRESA GARANTIZADA - 100% SEPARACIÓN DE DATOS
 * ✅ FIX: Inicialización de categorías correcta
 * ═══════════════════════════════════════════════════════════════════
 */

class FlujoCaja {
    constructor() {
        this.config = {
            version: '2.0.1', // 🔥 VERSIÓN CORREGIDA
            componente: 'FlujoCaja',
            debug: true
        };

        this.empresaActual = null;
        this.nivel = null;
        this.componentesActivos = null;
        this.transacciones = [];
        
        // ✅ FIX: Inicializar categorías con estructura correcta
        this.categorias = {
            ingresos: ['Ventas', 'Servicios', 'Otros Ingresos'],
            gastos: ['Compras', 'Servicios', 'Gastos Operativos', 'Otros Gastos']
        };
        
        this.gestor = null;
        this.sistemaNiveles = null;
        this.configuracion = null;

        // 🆕 NUEVO: Flag para saber si está listo
        this.inicializado = false;

        // 🔒 NUEVO: Lock para prevenir operaciones durante cambio de empresa
        this.cambiandoEmpresa = false;
        this.esperandoCambio = [];

        this._inicializar();
    }

    async _inicializar() {
        try {
            this._log('info', '💰 Flujo de Caja v2.0.1 inicializando...');
            
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
            
            this._log('success', `✅ Flujo de Caja listo para empresa: ${this.empresaActual}`);
            
            // 🆕 NUEVO: Disparar evento de inicialización completa
            this._dispararEvento('flujoCajaInicializado', {
                empresaId: this.empresaActual,
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
                if (window.gestorEmpresas && window.sistemaNiveles && window.FlujoCajaConfig && window.FlujoCajaPlanes) {
                    this.gestor = window.gestorEmpresas;
                    this.sistemaNiveles = window.sistemaNiveles;
                    this.configuracion = window.FlujoCajaConfig;
                    this.planes = window.FlujoCajaPlanes;
                    
                    this._log('info', '✅ Dependencias conectadas (incluido FlujoCajaPlanes)');
                    resolve();
                } else {
                    setTimeout(verificar, 500);
                }
            };
            verificar();
        });
    }

    /**
     * 🔥 CRÍTICO: Cargar empresa actual con múltiples fuentes de verdad
     */
    async _cargarEmpresaActual(empresaIdOverride = null) {
        // 🎯 PRIORIDAD 1: Usar override si se proporciona (desde evento)
        if (empresaIdOverride) {
            this.empresaActual = empresaIdOverride;
            this._log('info', `🎯 Empresa cargada desde override: ${this.empresaActual}`);
        }
        // 🎯 PRIORIDAD 2: Leer de gestorEmpresas
        else if (this.gestor && this.gestor.estado && this.gestor.estado.empresaActual) {
            this.empresaActual = this.gestor.estado.empresaActual;
            this._log('info', `🏢 Empresa cargada desde gestor: ${this.empresaActual}`);
        }
        // 🎯 PRIORIDAD 3: Leer de localStorage
        else {
            const empresaStorage = localStorage.getItem('grizalum_empresa_actual');
            if (empresaStorage && empresaStorage !== 'null' && empresaStorage !== 'undefined') {
                this.empresaActual = empresaStorage;
                this._log('warn', `⚠️ Empresa cargada desde localStorage: ${this.empresaActual}`);
            }
        }
        
        // ⭐ CRÍTICO: Validar que NO sea null o undefined
        if (!this.empresaActual || this.empresaActual === 'null' || this.empresaActual === 'undefined') {
            this._log('error', '❌ Empresa actual es null/undefined, buscando fallback');
            
            // Buscar la primera empresa disponible
            const empresas = Object.keys(this.gestor.estado.empresas || {});
            if (empresas.length > 0) {
                this.empresaActual = empresas[0];
                this._log('warn', `⚠️ Usando empresa fallback: ${this.empresaActual}`);
                
                // Actualizar en gestorEmpresas
                this.gestor.estado.empresaActual = this.empresaActual;
                localStorage.setItem('grizalum_empresa_actual', this.empresaActual);
            } else {
                this._log('error', '❌ No hay empresas disponibles');
                return;
            }
        }

        // Obtener nombre de la empresa para logs
        const nombreEmpresa = this._obtenerNombreEmpresa(this.empresaActual);
        this._log('success', `✅ Empresa confirmada: ${nombreEmpresa} (${this.empresaActual})`);

        // Obtener nivel de la empresa
        this.nivel = this.sistemaNiveles.obtenerNivelEmpresa(this.empresaActual);
        
        if (!this.nivel) {
            this._log('warn', 'Empresa sin nivel asignado');
            return;
        }

        // ✅ PRIORIDAD 1: Leer de localStorage (componentes forzados)
        const componentesForzados = localStorage.getItem('grizalum_componentes_forzados');
        
        if (componentesForzados) {
            this._log('info', '🎯 Usando componentes FORZADOS de localStorage');
            this.componentesActivos = JSON.parse(componentesForzados);
        } 
        // ✅ PRIORIDAD 2: Usar sistema de planes
        else if (window.FlujoCajaPlanes) {
            this._log('info', '🎯 Usando sistema de PLANES');
            this.componentesActivos = window.FlujoCajaPlanes.obtenerComponentesActivos();
        } 
        // ✅ PRIORIDAD 3: Fallback al sistema de score antiguo
        else {
            this._log('warn', '⚠️ Fallback: usando sistema de SCORE');
            const componentesOcultos = this.nivel.componentesOcultos || [];
            this.componentesActivos = this.configuracion.obtenerComponentesActivos(
                this.nivel.score,
                componentesOcultos
            );
        }

        // ✅ FIX: Obtener categorías según industria con manejo de errores
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        const industriaId = empresa?.perfilIndustrial || 'default';
        
        try {
            const categoriasObtenidas = this.configuracion.obtenerCategorias(industriaId);
            
            // ✅ VERIFICAR que tiene la estructura correcta
            if (categoriasObtenidas && 
                Array.isArray(categoriasObtenidas.ingresos) && 
                Array.isArray(categoriasObtenidas.gastos)) {
                this.categorias = categoriasObtenidas;
                this._log('info', `Categorías cargadas para industria: ${industriaId}`);
            } else {
                this._log('warn', '⚠️ Categorías con formato incorrecto, usando default');
            }
        } catch (error) {
            this._log('error', 'Error cargando categorías, usando default:', error);
        }

        this._log('info', `Nivel: ${this.nivel.nivel.nombre} (Score: ${this.nivel.score})`);
    }

    async _cargarTransacciones() {
        try {
            // 🔒 VERIFICACIÓN: Asegurar que empresa actual está definida
            if (!this.empresaActual || this.empresaActual === 'null' || this.empresaActual === 'undefined') {
                this._log('error', '❌ No se puede cargar transacciones: empresa no definida');
                this.transacciones = [];
                return;
            }

            const key = `grizalum_flujo_caja_${this.empresaActual}`;
            const datos = localStorage.getItem(key);
            
            if (datos) {
                const transaccionesCargadas = JSON.parse(datos);
                
                // 🔒 FILTRO DE SEGURIDAD: Solo cargar transacciones de esta empresa
                this.transacciones = transaccionesCargadas.filter(t => {
                    if (!t.empresaId || t.empresaId === this.empresaActual) {
                        // Si no tiene empresaId, asignarlo ahora
                        if (!t.empresaId) {
                            t.empresaId = this.empresaActual;
                        }
                        return true;
                    }
                    
                    // ⚠️ Transacción de otra empresa encontrada
                    this._log('warn', `⚠️ Transacción de otra empresa encontrada y DESCARTADA: ${t.empresaId} (actual: ${this.empresaActual})`);
                    return false;
                });
                
                const nombreEmpresa = this._obtenerNombreEmpresa(this.empresaActual);
                this._log('success', `✅ Cargadas ${this.transacciones.length} transacciones para ${nombreEmpresa}`);
            } else {
                this.transacciones = [];
                const nombreEmpresa = this._obtenerNombreEmpresa(this.empresaActual);
                this._log('info', `📋 Sin transacciones previas para ${nombreEmpresa}`);
            }
        } catch (error) {
            this._log('error', 'Error cargando transacciones:', error);
            this.transacciones = [];
        }
    }

    _configurarEventos() {
        // 🔥 EVENTO CRÍTICO: Cambio de empresa
        document.addEventListener('grizalumCompanyChanged', async (e) => {
            this._log('info', '🔄 ═════════════════════════════════════════');
            this._log('info', '🔄 CAMBIO DE EMPRESA DETECTADO');
            
            // 🔒 ACTIVAR LOCK: No permitir operaciones durante el cambio
            this.cambiandoEmpresa = true;
            this.inicializado = false;
            
            // 🎯 OBTENER NUEVA EMPRESA del evento (CRÍTICO)
            const nuevaEmpresaId = e.detail?.empresaId || e.detail?.empresa;
            
            if (!nuevaEmpresaId) {
                this._log('error', '❌ Evento sin empresaId, abortando cambio');
                this.cambiandoEmpresa = false;
                return;
            }
            
            const empresaAnterior = this.empresaActual;
            const nombreAnterior = this._obtenerNombreEmpresa(empresaAnterior);
            const nombreNueva = this._obtenerNombreEmpresa(nuevaEmpresaId);
            
            this._log('info', `🔄 Cambiando de: ${nombreAnterior} → ${nombreNueva}`);
            
            try {
                // 1. Limpiar transacciones actuales en memoria
                this.transacciones = [];
                this._log('info', '🧹 Transacciones en memoria limpiadas');
                
                // 2. Cargar datos de la nueva empresa (USAR empresaId del evento)
                await this._cargarEmpresaActual(nuevaEmpresaId);
                this._log('success', `✅ Nueva empresa cargada: ${this.empresaActual}`);
                
                // 3. Cargar transacciones de la nueva empresa
                await this._cargarTransacciones();
                this._log('success', `✅ ${this.transacciones.length} transacciones cargadas para ${nombreNueva}`);
                
                // 4. Marcar como inicializado
                this.inicializado = true;
                
                // 5. Desactivar lock
                this.cambiandoEmpresa = false;
                
                // 6. Resolver promesas pendientes
                this.esperandoCambio.forEach(resolver => resolver());
                this.esperandoCambio = [];
                
                // 7. Actualizar UI
                this._log('info', '🎨 Actualizando UI...');
                
                if (window.flujoCajaUI) {
                    // Forzar sincronización de empresa en UI
                    if (window.flujoCajaUI.empresaActual !== this.empresaActual) {
                        window.flujoCajaUI.empresaActual = this.empresaActual;
                        this._log('info', `🔄 UI sincronizada con empresa: ${this.empresaActual}`);
                    }
                    
                    await window.flujoCajaUI.cargarBalance();
                    await window.flujoCajaUI.cargarTransacciones();
                    await window.flujoCajaUI.cargarNivel();
                    await window.flujoCajaUI.cargarCategorias();
                    this._log('success', '✅ UI actualizada correctamente');
                } else {
                    this._log('warn', '⚠️ flujoCajaUI no disponible');
                }
                
                // 8. Disparar evento para otros componentes
                this._dispararEvento('flujoCajaActualizado', {
                    empresaActual: this.empresaActual,
                    empresaAnterior: empresaAnterior,
                    transacciones: this.transacciones.length,
                    balance: this.calcularBalance()
                });
                
                this._log('success', `🎉 Cambio completado: ${nombreAnterior} → ${nombreNueva}`);
                this._log('info', '🔄 ═════════════════════════════════════════');
                
            } catch (error) {
                this._log('error', '❌ Error durante cambio de empresa:', error);
                this.cambiandoEmpresa = false;
                this.inicializado = false;
            }
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
     * 🔒 LOCK: Esperar si se está cambiando de empresa
     */
    async _esperarSiCambiando() {
        if (!this.cambiandoEmpresa) {
            return true;
        }

        this._log('warn', '⏳ Operación en espera - cambiando de empresa...');

        return new Promise((resolve) => {
            this.esperandoCambio.push(resolve);
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CRUD DE TRANSACCIONES - CON VERIFICACIÓN MULTI-EMPRESA
     * ═══════════════════════════════════════════════════════════════
     */

    async agregarTransaccion(datos) {
        // 🔒 LOCK: Esperar si se está cambiando de empresa
        await this._esperarSiCambiando();

        // 🔒 VERIFICACIÓN: Asegurar que empresa actual está definida
        if (!this.empresaActual || this.empresaActual === 'null' || this.empresaActual === 'undefined') {
            this._log('error', '❌ No se puede agregar transacción: empresa no definida');
            throw new Error('Empresa actual no definida');
        }

        // 🔒 VERIFICACIÓN: Asegurar que el módulo está inicializado
        if (!this.inicializado) {
            this._log('error', '❌ No se puede agregar transacción: módulo no inicializado');
            throw new Error('Módulo no inicializado');
        }

        // 🎯 OBTENER empresa actual EN EL MOMENTO de guardar
        const empresaParaGuardar = this.empresaActual;
        const nombreEmpresa = this._obtenerNombreEmpresa(empresaParaGuardar);

        const transaccion = {
            id: this._generarId(),
            empresaId: empresaParaGuardar, // 🔥 CRÍTICO: Guardar con empresa actual
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
                fechaModificacion: new Date().toISOString(),
                empresaNombre: nombreEmpresa // Para debugging
            }
        };

        // 🔒 VERIFICACIÓN FINAL: Empresa no cambió durante la operación
        if (this.empresaActual !== empresaParaGuardar) {
            this._log('error', '❌ ABORT: Empresa cambió durante operación');
            throw new Error('Empresa cambió durante operación');
        }

        this.transacciones.unshift(transaccion);
        this.guardar();
        
        // ✅ FIX: Verificar que el método exista antes de llamarlo
        if (this.sistemaNiveles && typeof this.sistemaNiveles.registrarUso === 'function') {
            this.sistemaNiveles.registrarUso(this.empresaActual, 'registroRapido');
        }
        
        this._log('success', `✅ ${datos.tipo.toUpperCase()} agregado para ${nombreEmpresa}: S/. ${datos.monto} (empresaId: ${transaccion.empresaId})`);
        
        // Disparar evento
        this._dispararEvento('transaccionAgregada', transaccion);
        
        return transaccion;
    }

    async editarTransaccion(id, datosNuevos) {
        // 🔒 LOCK: Esperar si se está cambiando de empresa
        await this._esperarSiCambiando();

        const index = this.transacciones.findIndex(t => t.id === id);
        
        if (index === -1) {
            this._log('error', 'Transacción no encontrada');
            return false;
        }

        // 🔒 VERIFICACIÓN: La transacción pertenece a esta empresa
        if (this.transacciones[index].empresaId !== this.empresaActual) {
            this._log('error', `❌ Intento de editar transacción de otra empresa: ${this.transacciones[index].empresaId}`);
            return false;
        }

        this.transacciones[index] = {
            ...this.transacciones[index],
            ...datosNuevos,
            empresaId: this.empresaActual, // 🔒 Mantener empresaId actual
            meta: {
                ...this.transacciones[index].meta,
                fechaModificacion: new Date().toISOString()
            }
        };

        this.guardar();
        
        const nombreEmpresa = this._obtenerNombreEmpresa(this.empresaActual);
        this._log('info', `✏️ Transacción ${id} editada en ${nombreEmpresa}`);
        
        this._dispararEvento('transaccionEditada', this.transacciones[index]);
        
        return this.transacciones[index];
    }

    async eliminarTransaccion(id) {
        // 🔒 LOCK: Esperar si se está cambiando de empresa
        await this._esperarSiCambiando();

        const index = this.transacciones.findIndex(t => t.id === id);
        
        if (index === -1) {
            this._log('error', 'Transacción no encontrada');
            return false;
        }

        // 🔒 VERIFICACIÓN: La transacción pertenece a esta empresa
        if (this.transacciones[index].empresaId !== this.empresaActual) {
            this._log('error', `❌ Intento de eliminar transacción de otra empresa: ${this.transacciones[index].empresaId}`);
            return false;
        }

        const transaccionEliminada = this.transacciones[index];
        this.transacciones.splice(index, 1);
        
        this.guardar();
        
        const nombreEmpresa = this._obtenerNombreEmpresa(this.empresaActual);
        this._log('info', `🗑️ Transacción ${id} eliminada de ${nombreEmpresa}`);
        
        this._dispararEvento('transaccionEliminada', transaccionEliminada);
        
        return true;
    }

    obtenerTransaccion(id) {
        const transaccion = this.transacciones.find(t => t.id === id);
        
        // 🔒 VERIFICACIÓN: La transacción pertenece a esta empresa
        if (transaccion && transaccion.empresaId !== this.empresaActual) {
            this._log('warn', `⚠️ Transacción ${id} pertenece a otra empresa`);
            return null;
        }
        
        return transaccion;
    }

    obtenerTransacciones(filtros = {}) {
        let resultado = [...this.transacciones];

        // 🔒 FILTRO OBLIGATORIO: Solo transacciones de esta empresa
        resultado = resultado.filter(t => 
            !t.empresaId || t.empresaId === this.empresaActual
        );

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
            ? this.obtenerTransacciones({ tipo })
            : this.obtenerTransacciones();

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
     /**
 * ═══════════════════════════════════════════════════════════════
 * PERSISTENCIA - GUARDADO EN LOCALSTORAGE
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * 💾 Guardar transacciones en localStorage
 * Este método es llamado automáticamente después de cada operación CRUD
 */
guardar() {
    try {
        // 🔒 VERIFICACIÓN: Empresa actual definida
        if (!this.empresaActual || this.empresaActual === 'null' || this.empresaActual === 'undefined') {
            this._log('error', '❌ No se puede guardar: empresa no definida');
            return false;
        }

        // 🔒 FILTRO DE SEGURIDAD: Solo guardar transacciones de esta empresa
        const transaccionesEmpresa = this.transacciones.filter(t => 
            !t.empresaId || t.empresaId === this.empresaActual
        );

        const key = `grizalum_flujo_caja_${this.empresaActual}`;
        
        // Guardar en localStorage
        localStorage.setItem(key, JSON.stringify(transaccionesEmpresa));
        
        const nombreEmpresa = this._obtenerNombreEmpresa(this.empresaActual);
        this._log('success', `💾 ${transaccionesEmpresa.length} transacciones guardadas para ${nombreEmpresa}`);
        
        return true;
    } catch (error) {
        this._log('error', '❌ Error al guardar transacciones:', error);
        return false;
    }
}
    _guardarTransacciones() {
        try {
            // 🔒 VERIFICACIÓN: Empresa actual definida
            if (!this.empresaActual || this.empresaActual === 'null' || this.empresaActual === 'undefined') {
                this._log('error', '❌ No se puede guardar: empresa no definida');
                return;
            }

            // 🔒 FILTRO DE SEGURIDAD: Solo guardar transacciones de esta empresa
            const transaccionesEmpresa = this.transacciones.filter(t => 
                !t.empresaId || t.empresaId === this.empresaActual
            );

            const key = `grizalum_flujo_caja_${this.empresaActual}`;
            localStorage.setItem(key, JSON.stringify(transaccionesEmpresa));
            
            const nombreEmpresa = this._obtenerNombreEmpresa(this.empresaActual);
            this._log('info', `💾 ${transaccionesEmpresa.length} transacciones guardadas para ${nombreEmpresa}`);
        } catch (error) {
            this._log('error', 'Error guardando transacciones:', error);
        }
    }

    _generarId() {
        return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    _obtenerNombreEmpresa(empresaId) {
        if (!empresaId || !this.gestor || !this.gestor.estado || !this.gestor.estado.empresas) {
            return empresaId || 'Desconocida';
        }

        const empresa = this.gestor.estado.empresas[empresaId];
        return empresa?.nombre || empresaId;
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
        
        const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
        const empresaNombre = this._obtenerNombreEmpresa(this.empresaActual);
        const prefijo = `[${timestamp}] [${this.config.componente}] [${empresaNombre}]`;
        
        if (nivel === 'error') {
            console.error(`${prefijo}`, mensaje, datos || '');
        } else if (nivel === 'warn') {
            console.warn(`${prefijo}`, mensaje, datos || '');
        } else if (nivel === 'success') {
            console.log(`%c${prefijo} ${mensaje}`, 'color: #10b981; font-weight: bold', datos || '');
        } else {
            console.log(`${prefijo}`, mensaje, datos || '');
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * API PÚBLICA
     * ═══════════════════════════════════════════════════════════════
     */

    // 🆕 NUEVO: Verificar si está inicializado
    estaListo() {
        return this.inicializado && !this.cambiandoEmpresa;
    }

    // 🆕 NUEVO: Esperar a que esté listo
    async esperarInicializacion() {
        if (this.estaListo()) {
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
            empresaNombre: this._obtenerNombreEmpresa(this.empresaActual),
            nivel: this.nivel,
            componentesActivos: this.componentesActivos,
            categorias: this.categorias,
            balance: this.calcularBalance(),
            totalTransacciones: this.transacciones.length,
            cambiandoEmpresa: this.cambiandoEmpresa,
            inicializado: this.inicializado
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
            empresaNombre: this._obtenerNombreEmpresa(this.empresaActual),
            fecha: new Date().toISOString(),
            transacciones: this.transacciones,
            balance: this.calcularBalance(),
            porCategoria: this.calcularPorCategoria()
        };
    }
}

// Inicialización global
// ✅ Solo crear si no existe (prevenir duplicación al cambiar de vista)
if (!window.flujoCaja) {
    window.flujoCaja = new FlujoCaja();
    console.log('✅ [FlujoCaja] Instancia creada por primera vez');
} else {
    console.log('⚠️ [FlujoCaja] Ya existe, reinicializando datos...');
    // Reinicializar datos si cambió la empresa
    if (window.flujoCaja._cargarEmpresaActual) {
        window.flujoCaja._cargarEmpresaActual().then(() => {
            window.flujoCaja._cargarTransacciones();
            console.log('✅ [FlujoCaja] Datos actualizados');
        });
    }
}

// ✅ FIX: Crear funciones compatibles del modal
if (!window.flujoCaja.abrirModal) {
    window.flujoCaja.abrirModal = function(tipo, transaccion) {
        if (window.abrirModalTransaccion) {
            window.abrirModalTransaccion(tipo, transaccion);
        }
    };
}

if (!window.flujoCaja.abrirModalTransaccion) {
    window.flujoCaja.abrirModalTransaccion = window.flujoCaja.abrirModal;
}

console.log('✅ [FlujoCaja] Funciones de modal exportadas');

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  💰 FLUJO DE CAJA v2.0.1 - MULTI-EMPRESA GARANTIZADO         ║
║  Sistema adaptativo de gestión financiera                     ║
║  🔒 100% Separación de datos por empresa                      ║
║  🔒 Locks para prevenir contaminación                         ║
║  🔒 Verificación en cada operación                            ║
║  🎯 Empresa actual desde eventos                              ║
║  ✅ FIX: Inicialización de categorías correcta               ║
╚═══════════════════════════════════════════════════════════════╝
`);
