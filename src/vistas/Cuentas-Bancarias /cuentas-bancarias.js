/**
 * ═══════════════════════════════════════════════════════════════════
 * CUENTAS BANCARIAS - PRINCIPAL
 * Conecta GestorCuentasBancarias + UICuentasBancarias con el HTML
 * v20260504
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    if (window._cuentasBancariasCargado) {
        console.log('⚠️ [CuentasBancarias] Ya cargado, omitiendo...');
        return;
    }
    window._cuentasBancariasCargado = true;

    class CuentasBancarias {

        constructor() {
            this.inicializado = false;
            this._init();
        }

        async _init() {
            console.log('🏦 [CuentasBancarias] Inicializando...');

            // Esperar que el gestor y la UI estén disponibles
            await this._esperarDependencias();

            // Conectar empresa actual
            this._sincronizarEmpresa();

            // Configurar eventos
            this._configurarEventos();

            // Renderizar
            this.actualizar();

            this.inicializado = true;
            console.log('✅ [CuentasBancarias] Listo');
        }

        // ─── Esperar GestorCuentasBancarias y UICuentasBancarias ─────
        _esperarDependencias() {
            return new Promise((resolve) => {
                let intentos = 0;
                const check = () => {
                    intentos++;
                    const gestorListo = window.GestorCuentasBancarias || window.gestorCuentasBancarias;
                    const uiLista    = window.UICuentasBancarias || window.uiCuentasBancarias;

                    if (gestorListo && uiLista) {
                        // Normalizar referencias globales
                        if (!window.gestorCuentasBancarias) window.gestorCuentasBancarias = window.GestorCuentasBancarias;
                        if (!window.uiCuentasBancarias)     window.uiCuentasBancarias     = window.UICuentasBancarias;
                        console.log('✅ [CuentasBancarias] Dependencias listas');
                        resolve();
                    } else if (intentos >= 30) {
                        console.warn('⚠️ [CuentasBancarias] Dependencias no disponibles, continuando...');
                        resolve();
                    } else {
                        setTimeout(check, 300);
                    }
                };
                check();
            });
        }

        // ─── Sincronizar empresa actual ───────────────────────────────
        _sincronizarEmpresa() {
            const empresa = localStorage.getItem('grizalum_empresa_actual') || 'default';
            if (window.gestorCuentasBancarias && window.gestorCuentasBancarias.cambiarEmpresa) {
                window.gestorCuentasBancarias.cambiarEmpresa(empresa);
            }
        }

        // ─── Configurar eventos ───────────────────────────────────────
        _configurarEventos() {
            // Botón nueva cuenta
            const btnNueva = document.getElementById('btnNuevaCuenta');
            if (btnNueva) {
                btnNueva.addEventListener('click', () => {
                    if (window.uiCuentasBancarias && window.uiCuentasBancarias.abrirModalNuevaCuenta) {
                        window.uiCuentasBancarias.abrirModalNuevaCuenta();
                    } else if (window.uiCuentasBancarias && window.uiCuentasBancarias.mostrarFormulario) {
                        window.uiCuentasBancarias.mostrarFormulario();
                    } else {
                        console.warn('[CuentasBancarias] Función para nueva cuenta no encontrada');
                    }
                });
            }

            // Botón exportar
            const btnExportar = document.getElementById('btnExportarCB');
            if (btnExportar) {
                btnExportar.addEventListener('click', () => {
                    if (window.uiCuentasBancarias && window.uiCuentasBancarias.exportar) {
                        window.uiCuentasBancarias.exportar();
                    } else {
                        console.warn('[CuentasBancarias] Función exportar no encontrada');
                    }
                });
            }

            // Cambio de empresa
            if (this._onEmpresaCambiada) {
                document.removeEventListener('grizalumCompanyChanged', this._onEmpresaCambiada);
            }
            this._onEmpresaCambiada = () => {
                this._sincronizarEmpresa();
                this.actualizar();
            };
            document.addEventListener('grizalumCompanyChanged', this._onEmpresaCambiada);
        }

        // ─── Actualizar vista ─────────────────────────────────────────
        actualizar() {
            this._actualizarTarjetas();
            this._renderizarContenido();
        }

        // ─── Actualizar tarjetas de resumen ───────────────────────────
        _actualizarTarjetas() {
            try {
                const gestor = window.gestorCuentasBancarias;
                if (!gestor) return;

                const cuentas = gestor.cuentas
                    ? gestor.cuentas.listar({ soloActivas: true })
                    : (gestor.listarCuentas ? gestor.listarCuentas() : []);

                let totalGeneral = 0, totalBancos = 0, totalCajas = 0;
                let cantBancos = 0, cantCajas = 0;

                cuentas.forEach(c => {
                    const saldo = c.saldoActual || c.saldo || 0;
                    totalGeneral += saldo;
                    if (c.tipoCuenta === 'Caja' || c.tipo === 'caja') {
                        totalCajas += saldo;
                        cantCajas++;
                    } else {
                        totalBancos += saldo;
                        cantBancos++;
                    }
                });

                const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

                this._setText('cbTotalGeneral', fmt(totalGeneral));
                this._setText('cbTotalBancos',  fmt(totalBancos));
                this._setText('cbTotalCajas',   fmt(totalCajas));
                this._setText('cbTotalCuentas', cuentas.length + ' cuentas activas');
                this._setText('cbCantBancos',   cantBancos + ' cuentas bancarias');
                this._setText('cbCantCajas',    cantCajas + ' cajas registradas');

                // Estado vacío
                const vacio    = document.getElementById('cbEstadoVacio');
                const contenido = document.getElementById('cuentasBancariasContent');
                if (vacio && contenido) {
                    vacio.style.display    = cuentas.length === 0 ? 'flex' : 'none';
                    contenido.style.display = cuentas.length === 0 ? 'none' : 'block';
                }

            } catch (e) {
                console.warn('[CuentasBancarias] Error actualizando tarjetas:', e);
            }
        }

        // ─── Renderizar contenido principal ───────────────────────────
        _renderizarContenido() {
            try {
                const ui = window.uiCuentasBancarias;
                if (!ui) return;

                if (ui.mostrarSeccion) {
                    ui.mostrarSeccion();
                } else if (ui.renderizarContenido) {
                    ui.renderizarContenido();
                } else if (window.mostrarSeccionCuentasBancarias) {
                    window.mostrarSeccionCuentasBancarias();
                }
            } catch (e) {
                console.warn('[CuentasBancarias] Error renderizando contenido:', e);
            }
        }

        // ─── Helper ───────────────────────────────────────────────────
        _setText(id, texto) {
            const el = document.getElementById(id);
            if (el) el.textContent = texto;
        }
    }

    // ── Crear instancia global ──
    window.cuentasBancarias = new CuentasBancarias();

    // Función para el cargador de vistas
    window.inicializarCuentasBancarias = function () {
        if (!window.cuentasBancarias || !window.cuentasBancarias.inicializado) {
            window._cuentasBancariasCargado = false;
            window.cuentasBancarias = new CuentasBancarias();
        } else {
            window.cuentasBancarias.actualizar();
        }
    };

    console.log('✅ [GRIZALUM] Cuentas Bancarias v20260504 cargado');

})();
