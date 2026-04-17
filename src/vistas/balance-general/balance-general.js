/**
 * ═══════════════════════════════════════════════════════════════════
 * BALANCE GENERAL - PRINCIPAL
 * Coordina todos los módulos del Balance General
 * Depende de (en orden):
 *   1. balance-general-config.js
 *   2. balance-general-calculos.js
 *   3. balance-general-ui.js
 *   4. balance-general-graficos.js
 *   5. balance-general-exportador.js
 * v20260417
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // Evitar doble inicialización
    if (window._balanceGeneralCargado) {
        console.log('⚠️ [BalanceGeneral] Ya cargado, omitiendo...');
        return;
    }
    window._balanceGeneralCargado = true;

    class BalanceGeneral {

        constructor() {
            this.periodo      = 'mes';
            this.resultados   = null;
            this.inicializado = false;
            this._init();
        }

        // ─── Inicialización ───────────────────────────────────────────
        async _init() {
            console.log('📋 [BalanceGeneral] Inicializando...');

            // Esperar que FlujoCaja esté disponible (máx 9 seg)
            await this._esperarFlujoCaja();

            this._configurarEventos();
            this.actualizar();

            this.inicializado = true;
            console.log('✅ [BalanceGeneral] Listo');
        }

        // ─── Esperar FlujoCaja ────────────────────────────────────────
        _esperarFlujoCaja() {
            return new Promise((resolve) => {
                let intentos = 0;
                const check = () => {
                    intentos++;
                    if (window.flujoCaja) {
                        console.log('✅ [BalanceGeneral] FlujoCaja conectado');
                        resolve();
                    } else if (intentos >= 30) {
                        console.warn('⚠️ [BalanceGeneral] FlujoCaja no disponible, usando localStorage');
                        resolve();
                    } else {
                        setTimeout(check, 300);
                    }
                };
                check();
            });
        }

        // ─── Configurar eventos de botones y cambio de empresa ────────
        _configurarEventos() {
            // Botones de período (Hoy / Semana / Mes / Trimestre / Año)
            document.querySelectorAll('.bg-filtro-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.bg-filtro-btn').forEach(b => b.classList.remove('activo'));
                    btn.classList.add('activo');
                    this.periodo = btn.dataset.periodo;

                    // Actualizar subtítulo del header
                    const sub = document.getElementById('bgPeriodoActual');
                    if (sub) sub.textContent = window.BalanceGeneralConfig.nombresPeriodos[this.periodo] || this.periodo;

                    this.actualizar();
                });
            });

            // Botón exportar Excel
            const btnExportar = document.getElementById('btnExportarBG');
            if (btnExportar) {
                btnExportar.addEventListener('click', () => {
                    window.BalanceGeneralExportador.exportar(this.resultados);
                });
            }

            // Cambio de empresa
            if (this._onEmpresaCambiada) {
                document.removeEventListener('grizalumCompanyChanged', this._onEmpresaCambiada);
            }
            this._onEmpresaCambiada = () => this.actualizar();
            document.addEventListener('grizalumCompanyChanged', this._onEmpresaCambiada);
        }

        // ─── Recalcular y re-renderizar todo ──────────────────────────
        actualizar() {
            this.resultados = window.BalanceGeneralCalculos.calcularTodo(this.periodo);
            window.BalanceGeneralUI.renderizar(this.resultados);
            window.BalanceGeneralGraficos.renderizar(this.resultados);
        }

        // ─── API pública ──────────────────────────────────────────────
        obtenerResultados() {
            return this.resultados;
        }
    }

    // ── Crear instancia global ──
    window.balanceGeneral = new BalanceGeneral();

    // Función para el cargador de vistas (cargador-vistas-v2.js la llama)
    window.inicializarBalanceGeneral = function () {
        if (!window.balanceGeneral || !window.balanceGeneral.inicializado) {
            window._balanceGeneralCargado = false;
            window.balanceGeneral = new BalanceGeneral();
        } else {
            window.balanceGeneral.actualizar();
        }
    };

    console.log('✅ [GRIZALUM] Balance General v20260417 — todos los módulos activos');

})();
