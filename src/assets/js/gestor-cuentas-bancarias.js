/**
 * ================================================================
 * GRIZALUM - GESTOR DE CUENTAS BANCARIAS PROFESIONAL
 * Aislamiento total por empresa - Sin datos de ejemplo
 * ================================================================
 */

class GestorCuentasBancarias {
    constructor() {
        this.version = '2.0.0';
        this.empresaActual = null;
        this.baseDatos = new Map();
        
        this.bancosDisponibles = {
            BCP: { nombre: 'Banco de Crédito del Perú', color: '#002d72', icono: 'fas fa-landmark' },
            BBVA: { nombre: 'BBVA Continental', color: '#004481', icono: 'fas fa-university' },
            INTERBANK: { nombre: 'Interbank', color: '#00a651', icono: 'fas fa-building-columns' },
            SCOTIABANK: { nombre: 'Scotiabank', color: '#ec1c24', icono: 'fas fa-piggy-bank' },
            BN: { nombre: 'Banco de la Nación', color: '#c8102e', icono: 'fas fa-monument' },
            PICHINCHA: { nombre: 'Banco Pichincha', color: '#ffcc00', icono: 'fas fa-university' },
            GNB: { nombre: 'GNB Perú', color: '#e30613', icono: 'fas fa-landmark' },
            FALABELLA: { nombre: 'Banco Falabella', color: '#00a19a', icono: 'fas fa-store' },
            RIPLEY: { nombre: 'Banco Ripley', color: '#9b1c8e', icono: 'fas fa-shopping-bag' },
            PAYONEER: { nombre: 'Payoneer', color: '#ff6900', icono: 'fas fa-credit-card' },
            PAYPAL: { nombre: 'PayPal', color: '#003087', icono: 'fab fa-paypal' },
            YAPE: { nombre: 'Yape BCP', color: '#6b2e8f', icono: 'fas fa-mobile-alt' },
            PLIN: { nombre: 'Plin Interbank', color: '#00b2a9', icono: 'fas fa-mobile-screen' },
            TUNKI: { nombre: 'Tunki BBVA', color: '#072146', icono: 'fas fa-wallet' }
        };

        this.tiposCaja = {
            CAJA_PRINCIPAL: { nombre: 'Caja Principal', color: '#27ae60', icono: 'fas fa-cash-register', descripcion: 'Caja registradora o efectivo principal' },
            CAJA_CHICA: { nombre: 'Caja Chica', color: '#f39c12', icono: 'fas fa-wallet', descripcion: 'Para gastos menores y urgentes' },
            CAJA_FUERTE: { nombre: 'Caja Fuerte', color: '#34495e', icono: 'fas fa-vault', descripcion: 'Efectivo en caja de seguridad' },
            BOVEDA: { nombre: 'Bóveda', color: '#7f8c8d', icono: 'fas fa-lock', descripcion: 'Efectivo almacenado en bóveda' },
            FONDO_ROTATORIO: { nombre: 'Fondo Rotatorio', color: '#16a085', icono: 'fas fa-sync-alt', descripcion: 'Fondo fijo que se repone' },
            SUCURSAL: { nombre: 'Caja Sucursal', color: '#e67e22', icono: 'fas fa-store-alt', descripcion: 'Efectivo en otra sucursal' }
        };

        this.tiposCuenta = ['Ahorros', 'Corriente', 'CTS', 'Caja', 'Digital'];
        this.monedas = ['PEN', 'USD', 'EUR'];
        
        this.categoriasPropositoAhorro = [
            'Pago de Impuestos',
            'Planilla de Personal',
            'Compra de Equipos',
            'Pago a Proveedores',
            'Inversión en Inventario',
            'Mantenimiento y Reparaciones',
            'Marketing y Publicidad',
            'Capacitación del Personal',
            'Expansión del Negocio',
            'Reserva de Emergencia',
            'Pago de Préstamos',
            'Renovación de Licencias',
            'Servicios Profesionales',
            'Alquiler Local Comercial',
            'Servicios Básicos',
            'Otro (personalizado)'
        ];

        this.init();
    }

    init() {
        this.cargarDatos();
        this.conectarSistemaEmpresas();
        this.crearAPI();
        console.log(`Sistema de Cuentas Bancarias v${this.version} - Listo`);
    }

    conectarSistemaEmpresas() {
        const detectarEmpresa = () => {
            const selector = document.getElementById('companySelector');
            if (!selector) return;

            const activa = selector.querySelector('.active, [data-selected="true"], .selected');
            if (!activa) return;

            const nombreEmpresa = activa.textContent?.trim();
            if (!nombreEmpresa) return;

            const empresaKey = nombreEmpresa
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
                .substring(0, 50);

            if (empresaKey && empresaKey !== this.empresaActual) {
                this.empresaActual = empresaKey;
                this.inicializarEmpresa(empresaKey);
            }
        };

        setTimeout(detectarEmpresa, 800);
        const observer = new MutationObserver(detectarEmpresa);
        const selector = document.getElementById('companySelector');
        if (selector) observer.observe(selector, { childList: true, subtree: true, attributes: true });
    }

    inicializarEmpresa(empresaKey) {
        if (!this.baseDatos.has(empresaKey)) {
            this.baseDatos.set(empresaKey, {
                cuentas: [],
                transacciones: [],
                configuracion: {
                    monedaPrincipal: 'PEN',
                    fechaCreacion: new Date().toISOString(),
                    modulos: {
                        conciliacionBancaria: false,
                        pagosProgramados: false,
                        controlCheques: false,
                        calculoIntereses: false,
                        arqueoCaja: false,
                        presupuestos: false,
                        multiMoneda: true,
                        cuentasPropositivas: true,
                        alertasLimites: false
                    }
                }
            });
            this.guardarDatos();
        }
    }

    obtenerDatosEmpresa() {
        if (!this.empresaActual) return null;
        return this.baseDatos.get(this.empresaActual) || null;
    }

    crearCuenta(datos) {
        if (!this.empresaActual) {
            throw new Error('No hay empresa seleccionada');
        }

        const validacion = this.validarDatosCuenta(datos);
        if (!validacion.valido) {
            throw new Error(validacion.error);
        }

        const empresa = this.obtenerDatosEmpresa();
        if (!empresa) {
            throw new Error('Empresa no inicializada');
        }

        const cuenta = {
            id: `CTA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            banco: datos.banco,
            tipoCuenta: datos.tipoCuenta,
            tipoCaja: datos.tipoCaja || null,
            numeroCuenta: datos.numeroCuenta || '',
            alias: datos.alias,
            moneda: datos.moneda,
            saldoInicial: parseFloat(datos.saldoInicial) || 0,
            saldoActual: parseFloat(datos.saldoInicial) || 0,
            esPropositiva: datos.esPropositiva || false,
            proposito: datos.proposito || null,
            metaMonto: datos.metaMonto || null,
            fechaCreacion: new Date().toISOString(),
            fechaModificacion: new Date().toISOString(),
            activa: true,
            notas: datos.notas || '',
            empresaId: this.empresaActual
        };

        empresa.cuentas.push(cuenta);
        this.guardarDatos();

        if (cuenta.saldoInicial !== 0) {
            this.registrarMovimiento({
                cuentaId: cuenta.id,
                tipo: 'ajuste_inicial',
                monto: cuenta.saldoInicial,
                concepto: 'Saldo inicial de cuenta',
                categoria: 'apertura'
            });
        }

        return cuenta;
    }

    validarDatosCuenta(datos) {
        if (!datos.banco || !this.bancosDisponibles[datos.banco]) {
            if (!datos.tipoCaja || !this.tiposCaja[datos.tipoCaja]) {
                return { valido: false, error: 'Banco o tipo de caja no válido' };
            }
        }
        if (datos.tipoCuenta === 'Caja' && !datos.tipoCaja) {
            return { valido: false, error: 'Debe especificar el tipo de caja' };
        }
        if (!datos.alias || datos.alias.trim() === '') {
            return { valido: false, error: 'Debe proporcionar un alias para la cuenta' };
        }
        if (!datos.moneda || !this.monedas.includes(datos.moneda)) {
            return { valido: false, error: 'Moneda no válida' };
        }
        if (!datos.tipoCuenta || !this.tiposCuenta.includes(datos.tipoCuenta)) {
            return { valido: false, error: 'Tipo de cuenta no válido' };
        }
        return { valido: true };
    }

    obtenerCuentas(filtros = {}) {
        const empresa = this.obtenerDatosEmpresa();
        if (!empresa) return [];

        let cuentas = empresa.cuentas;

        if (filtros.soloActivas) {
            cuentas = cuentas.filter(c => c.activa);
        }
        if (filtros.banco) {
            cuentas = cuentas.filter(c => c.banco === filtros.banco);
        }
        if (filtros.moneda) {
            cuentas = cuentas.filter(c => c.moneda === filtros.moneda);
        }
        if (filtros.soloPropositivas !== undefined) {
            cuentas = cuentas.filter(c => c.esPropositiva === filtros.soloPropositivas);
        }

        return cuentas;
    }

    obtenerCuenta(cuentaId) {
        const empresa = this.obtenerDatosEmpresa();
        if (!empresa) return null;
        return empresa.cuentas.find(c => c.id === cuentaId) || null;
    }

    actualizarCuenta(cuentaId, cambios) {
        const cuenta = this.obtenerCuenta(cuentaId);
        if (!cuenta) {
            throw new Error('Cuenta no encontrada');
        }

        const camposEditables = ['alias', 'numeroCuenta', 'notas', 'metaMonto', 'proposito'];
        
        camposEditables.forEach(campo => {
            if (cambios[campo] !== undefined) {
                cuenta[campo] = cambios[campo];
            }
        });

        cuenta.fechaModificacion = new Date().toISOString();
        this.guardarDatos();
        return cuenta;
    }

    desactivarCuenta(cuentaId) {
        const cuenta = this.obtenerCuenta(cuentaId);
        if (!cuenta) {
            throw new Error('Cuenta no encontrada');
        }

        if (cuenta.saldoActual !== 0) {
            throw new Error('No se puede desactivar una cuenta con saldo. Transfiera el saldo primero.');
        }

        cuenta.activa = false;
        cuenta.fechaModificacion = new Date().toISOString();
        this.guardarDatos();
        return true;
    }

    registrarMovimiento(datos) {
        if (!this.empresaActual) {
            throw new Error('No hay empresa seleccionada');
        }

        const cuenta = this.obtenerCuenta(datos.cuentaId);
        if (!cuenta) {
            throw new Error('Cuenta no encontrada');
        }

        const empresa = this.obtenerDatosEmpresa();
        const monto = parseFloat(datos.monto);

        const movimiento = {
            id: `MOV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            cuentaId: datos.cuentaId,
            tipo: datos.tipo,
            monto: monto,
            concepto: datos.concepto,
            categoria: datos.categoria || 'otros',
            fecha: datos.fecha || new Date().toISOString(),
            referencia: datos.referencia || '',
            saldoAnterior: cuenta.saldoActual,
            empresaId: this.empresaActual
        };

        if (datos.tipo === 'ingreso' || datos.tipo === 'ajuste_inicial') {
            cuenta.saldoActual += monto;
        } else if (datos.tipo === 'egreso') {
            if (cuenta.saldoActual < monto) {
                throw new Error('Saldo insuficiente en la cuenta');
            }
            cuenta.saldoActual -= monto;
        }

        movimiento.saldoNuevo = cuenta.saldoActual;
        cuenta.fechaModificacion = new Date().toISOString();

        empresa.transacciones.push(movimiento);
        this.guardarDatos();

        return movimiento;
    }

    transferirEntreCuentas(datos) {
        const cuentaOrigen = this.obtenerCuenta(datos.cuentaOrigenId);
        const cuentaDestino = this.obtenerCuenta(datos.cuentaDestinoId);

        if (!cuentaOrigen || !cuentaDestino) {
            throw new Error('Una o ambas cuentas no existen');
        }

        if (cuentaOrigen.saldoActual < datos.monto) {
            throw new Error('Saldo insuficiente en cuenta origen');
        }

        if (cuentaOrigen.moneda !== cuentaDestino.moneda && !datos.tipoCambio) {
            throw new Error('Debe proporcionar tipo de cambio para transferencias entre monedas');
        }

        const empresa = this.obtenerDatosEmpresa();
        const monto = parseFloat(datos.monto);
        const montoDestino = cuentaOrigen.moneda === cuentaDestino.moneda 
            ? monto 
            : monto * parseFloat(datos.tipoCambio);

        const transferencia = {
            id: `TRANS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            tipo: 'transferencia',
            cuentaOrigenId: datos.cuentaOrigenId,
            cuentaDestinoId: datos.cuentaDestinoId,
            montoOrigen: monto,
            montoDestino: montoDestino,
            tipoCambio: datos.tipoCambio || 1,
            concepto: datos.concepto,
            fecha: datos.fecha || new Date().toISOString(),
            saldoOrigenAnterior: cuentaOrigen.saldoActual,
            saldoDestinoAnterior: cuentaDestino.saldoActual,
            empresaId: this.empresaActual
        };

        cuentaOrigen.saldoActual -= monto;
        cuentaDestino.saldoActual += montoDestino;

        transferencia.saldoOrigenNuevo = cuentaOrigen.saldoActual;
        transferencia.saldoDestinoNuevo = cuentaDestino.saldoActual;

        cuentaOrigen.fechaModificacion = new Date().toISOString();
        cuentaDestino.fechaModificacion = new Date().toISOString();

        empresa.transacciones.push(transferencia);
        this.guardarDatos();

        return transferencia;
    }

    obtenerSaldoTotal(moneda = null) {
        const cuentas = this.obtenerCuentas({ soloActivas: true });
        
        if (moneda) {
            return cuentas
                .filter(c => c.moneda === moneda)
                .reduce((total, c) => total + c.saldoActual, 0);
        }

        const porMoneda = {};
        cuentas.forEach(c => {
            if (!porMoneda[c.moneda]) {
                porMoneda[c.moneda] = 0;
            }
            porMoneda[c.moneda] += c.saldoActual;
        });

        return porMoneda;
    }

    obtenerDistribucionPorBanco() {
        const cuentas = this.obtenerCuentas({ soloActivas: true });
        const distribucion = {};

        cuentas.forEach(c => {
            if (!distribucion[c.banco]) {
                distribucion[c.banco] = {
                    cantidad: 0,
                    saldos: {}
                };
            }
            distribucion[c.banco].cantidad++;
            
            if (!distribucion[c.banco].saldos[c.moneda]) {
                distribucion[c.banco].saldos[c.moneda] = 0;
            }
            distribucion[c.banco].saldos[c.moneda] += c.saldoActual;
        });

        return distribucion;
    }

    calcularLiquidez() {
        const cuentas = this.obtenerCuentas({ soloActivas: true });
        const resultado = {
            total: {},
            disponible: {},
            comprometido: {}
        };

        cuentas.forEach(c => {
            if (!resultado.total[c.moneda]) {
                resultado.total[c.moneda] = 0;
                resultado.disponible[c.moneda] = 0;
                resultado.comprometido[c.moneda] = 0;
            }

            resultado.total[c.moneda] += c.saldoActual;

            if (c.esPropositiva) {
                resultado.comprometido[c.moneda] += c.saldoActual;
            } else {
                resultado.disponible[c.moneda] += c.saldoActual;
            }
        });

        return resultado;
    }

    obtenerHistorialTransacciones(filtros = {}) {
        const empresa = this.obtenerDatosEmpresa();
        if (!empresa) return [];

        let transacciones = [...empresa.transacciones];

        if (filtros.cuentaId) {
            transacciones = transacciones.filter(t => 
                t.cuentaId === filtros.cuentaId || 
                t.cuentaOrigenId === filtros.cuentaId || 
                t.cuentaDestinoId === filtros.cuentaId
            );
        }

        if (filtros.tipo) {
            transacciones = transacciones.filter(t => t.tipo === filtros.tipo);
        }

        if (filtros.fechaDesde) {
            transacciones = transacciones.filter(t => new Date(t.fecha) >= new Date(filtros.fechaDesde));
        }

        if (filtros.fechaHasta) {
            transacciones = transacciones.filter(t => new Date(t.fecha) <= new Date(filtros.fechaHasta));
        }

        return transacciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    generarReporte() {
        if (!this.empresaActual) return null;

        const cuentas = this.obtenerCuentas({ soloActivas: true });
        const saldos = this.obtenerSaldoTotal();
        const distribucion = this.obtenerDistribucionPorBanco();
        const liquidez = this.calcularLiquidez();

        return {
            empresa: this.empresaActual,
            fechaReporte: new Date().toISOString(),
            totalCuentas: cuentas.length,
            cuentasActivas: cuentas.filter(c => c.activa).length,
            saldosPorMoneda: saldos,
            distribucionBancaria: distribucion,
            analisisLiquidez: liquidez,
            cuentasPropositivas: cuentas.filter(c => c.esPropositiva).length
        };
    }

    guardarDatos() {
        try {
            const data = {
                version: this.version,
                timestamp: new Date().toISOString(),
                empresas: Array.from(this.baseDatos.entries())
            };
            localStorage.setItem('grizalum_cuentas_bancarias_v2', JSON.stringify(data));
        } catch (error) {
            console.error('Error al guardar datos de cuentas:', error);
        }
    }

    cargarDatos() {
        try {
            const data = localStorage.getItem('grizalum_cuentas_bancarias_v2');
            if (data) {
                const parsed = JSON.parse(data);
                this.baseDatos = new Map(parsed.empresas || []);
            }
        } catch (error) {
            console.error('Error al cargar datos de cuentas:', error);
            this.baseDatos = new Map();
        }
    }

    exportarDatos(empresaId = null) {
        const id = empresaId || this.empresaActual;
        if (!id) return null;

        const datos = this.baseDatos.get(id);
        if (!datos) return null;

        return {
            empresa: id,
            exportacion: new Date().toISOString(),
            version: this.version,
            datos: datos
        };
    }

    importarDatos(datosExportados) {
        if (!datosExportados.empresa || !datosExportados.datos) {
            throw new Error('Formato de datos inválido');
        }

        this.baseDatos.set(datosExportados.empresa, datosExportados.datos);
        this.guardarDatos();
        return true;
    }

    crearAPI() {
        window.GestorCuentasBancarias = {
            version: this.version,
            
            cuentas: {
                crear: (datos) => this.crearCuenta(datos),
                obtener: (id) => this.obtenerCuenta(id),
                listar: (filtros) => this.obtenerCuentas(filtros),
                actualizar: (id, cambios) => this.actualizarCuenta(id, cambios),
                desactivar: (id) => this.desactivarCuenta(id)
            },

            movimientos: {
                registrar: (datos) => this.registrarMovimiento(datos),
                transferir: (datos) => this.transferirEntreCuentas(datos),
                historial: (filtros) => this.obtenerHistorialTransacciones(filtros)
            },

            reportes: {
                saldoTotal: (moneda) => this.obtenerSaldoTotal(moneda),
                porBanco: () => this.obtenerDistribucionPorBanco(),
                liquidez: () => this.calcularLiquidez(),
                completo: () => this.generarReporte()
            },

            datos: {
                exportar: (empresaId) => this.exportarDatos(empresaId),
                importar: (datos) => this.importarDatos(datos)
            },

            catalogos: {
                bancos: this.bancosDisponibles,
                tiposCaja: this.tiposCaja,
                tiposCuenta: this.tiposCuenta,
                monedas: this.monedas,
                propositos: this.categoriasPropositoAhorro
            }
        };

        console.log('API de Cuentas Bancarias disponible');
    }
}

const gestorCuentas = new GestorCuentasBancarias();
window.gestorCuentas = gestorCuentas;
