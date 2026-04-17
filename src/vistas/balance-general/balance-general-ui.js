/**
 * ═══════════════════════════════════════════════════════════════════
 * BALANCE GENERAL - UI
 * Renderizado de pantalla: tarjetas, listas, ratios y estado vacío
 * Depende de: balance-general-config.js, balance-general-calculos.js
 * v20260417
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    window.BalanceGeneralUI = {

        // ─── Formatear moneda ─────────────────────────────────────────
        fmt(valor) {
            const cfg = window.BalanceGeneralConfig;
            return cfg.moneda + ' ' + (valor || 0).toLocaleString('es-PE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        },

        // ─── Actualizar texto de un elemento por ID ───────────────────
        setText(id, texto) {
            const el = document.getElementById(id);
            if (el) el.textContent = texto;
        },

        // ─── Actualizar barra de progreso ─────────────────────────────
        setProgreso(id, porcentaje, clase) {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.width = Math.max(0, Math.min(100, porcentaje)) + '%';
            el.className = 'bg-ratio-progreso' + (clase ? ' ' + clase : '');
        },

        // ─── Renderizado principal ────────────────────────────────────
        renderizar(resultados) {
            if (!resultados) return;
            const r = resultados;

            // Tarjetas principales
            this.setText('bgTotalActivos',    this.fmt(r.activos.total));
            this.setText('bgTotalPasivos',    this.fmt(r.pasivos.total));
            this.setText('bgTotalPatrimonio', this.fmt(r.patrimonio.total));

            // Badge de endeudamiento
            const pctEl = document.getElementById('bgPctEndeudamiento');
            if (pctEl) pctEl.textContent = r.ratios.endeudamiento.toFixed(1) + '%';

            // Estado de la ecuación contable
            this._renderizarEcuacion(r);

            // Totales de secciones
            this.setText('bgActivosTotal',         this.fmt(r.activos.total));
            this.setText('bgActivosCorrientes',     this.fmt(r.activos.corrientes.total));
            this.setText('bgActivosNoCorrientes',   this.fmt(r.activos.noCorrientes.total));
            this.setText('bgPasivosTotal',          this.fmt(r.pasivos.total));
            this.setText('bgPasivosCorrientes',     this.fmt(r.pasivos.corrientes.total));
            this.setText('bgPasivosNoCorrientes',   this.fmt(r.pasivos.noCorrientes.total));
            this.setText('bgPatrimonioTotal',       this.fmt(r.patrimonio.total));
            this.setText('bgCapitalResultados',     this.fmt(r.patrimonio.total));

            // Listas de cuentas
            this.renderizarItems('bgListaActivosCorrientes',   r.activos.corrientes.items,   'activosCorrientes');
            this.renderizarItems('bgListaActivosNoCorrientes', r.activos.noCorrientes.items, 'activosNoCorrientes');
            this.renderizarItems('bgListaPasivosCorrientes',   r.pasivos.corrientes.items,   'pasivosCorrientes');
            this.renderizarItems('bgListaPasivosNoCorrientes', r.pasivos.noCorrientes.items, 'pasivosNoCorrientes');
            this.renderizarItems('bgListaPatrimonio',          r.patrimonio.detalle.items,   'patrimonio');

            // Ratios financieros
            this._renderizarRatios(r.ratios);

            // Mostrar u ocultar secciones según si hay datos
            this._toggleSecciones(r);
        },

        // ─── Ecuación contable ────────────────────────────────────────
        _renderizarEcuacion(r) {
            const el = document.getElementById('bgEcuacionStatus');
            if (!el) return;

            if (r.ecuacionBalanceada) {
                el.innerHTML = `
                    <div class="bg-ecuacion-badge positivo">
                        <i class="fas fa-check-circle"></i>
                        <span>Ecuación contable balanceada: <strong>Activos = Pasivos + Patrimonio</strong></span>
                    </div>`;
            } else {
                const diff = Math.abs(r.activos.total - (r.pasivos.total + r.patrimonio.total));
                el.innerHTML = `
                    <div class="bg-ecuacion-badge negativo">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Diferencia: <strong>${this.fmt(diff)}</strong> — Revisa los valores ingresados</span>
                    </div>`;
            }
        },

        // ─── Lista de cuentas con edición manual ──────────────────────
        renderizarItems(containerId, items, seccionId) {
            const container = document.getElementById(containerId);
            if (!container || !items) return;

            if (items.length === 0) {
                container.innerHTML = '<div class="bg-item-vacio">Sin registros</div>';
                return;
            }

            container.innerHTML = items.map(item => {
                const cls      = item.valor > 0 ? 'positivo' : item.valor < 0 ? 'negativo' : '';
                const signo    = item.valor < 0 ? '-' : '';
                const editable = item.tipo === 'manual';
                return `
                    <div class="bg-item${editable ? ' bg-item-editable' : ''}"
                         ${editable ? 'data-editable="true"' : ''}
                         data-seccion="${seccionId}"
                         data-cuenta="${item.id}"
                         ${editable ? 'title="Click para editar"' : ''}>
                        <span class="bg-item-nombre">
                            ${item.nombre}
                            ${editable ? '<i class="fas fa-pencil-alt" style="font-size:0.65rem;opacity:0.45;margin-left:4px;"></i>' : ''}
                        </span>
                        <span class="bg-item-monto ${cls}">${signo}${this.fmt(item.valor)}</span>
                    </div>`;
            }).join('');

            // Activar edición al hacer click en cuentas manuales
            container.querySelectorAll('[data-editable="true"]').forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', () => {
                    const item = items.find(i => i.id === el.dataset.cuenta);
                    if (!item) return;
                    const nuevoValor = prompt(`✏️ ${item.nombre}\nIngrese el valor (${window.BalanceGeneralConfig.moneda}):`, item.valor || 0);
                    if (nuevoValor !== null && nuevoValor !== '') {
                        window.BalanceGeneralCalculos.guardarValorManual(el.dataset.seccion, el.dataset.cuenta, nuevoValor);
                        // Recalcular y re-renderizar todo
                        if (window.balanceGeneral) window.balanceGeneral.actualizar();
                    }
                });
            });
        },

        // ─── Ratios financieros con barras ────────────────────────────
        _renderizarRatios(ratios) {
            // Liquidez
            const liq = Math.min(ratios.liquidez, 99);
            this.setText('bgRatioLiquidez', liq >= 99 ? '∞' : liq.toFixed(2));
            this.setProgreso('bgBarraLiquidez', Math.min(liq / 3 * 100, 100),
                liq >= 1.5 ? '' : liq >= 1 ? 'alerta' : 'peligro');

            // Endeudamiento
            this.setText('bgRatioEndeudamiento', ratios.endeudamiento.toFixed(1) + '%');
            this.setProgreso('bgBarraEndeudamiento', Math.min(ratios.endeudamiento, 100),
                ratios.endeudamiento <= 40 ? '' : ratios.endeudamiento <= 60 ? 'alerta' : 'peligro');

            // Solvencia
            const sol = Math.min(ratios.solvencia, 99);
            this.setText('bgRatioSolvencia', sol >= 99 ? '∞' : sol.toFixed(2));
            this.setProgreso('bgBarraSolvencia', Math.min(sol / 3 * 100, 100),
                sol >= 1.5 ? '' : sol >= 1 ? 'alerta' : 'peligro');

            // Capital de trabajo
            this.setText('bgRatioCapitalTrabajo', this.fmt(ratios.capitalTrabajo));
            this.setProgreso('bgBarraCapitalTrabajo',
                ratios.capitalTrabajo > 0 ? 75 : 25,
                ratios.capitalTrabajo > 0 ? '' : 'peligro');
        },

        // ─── Mostrar/ocultar secciones según si hay datos ─────────────
        _toggleSecciones(r) {
            const sinDatos = r.transaccionesEnPeriodo === 0
                && r.activos.total === 0
                && r.pasivos.total === 0
                && r.patrimonio.total === 0;

            const mostrar = (selector, show, display) => {
                // Acepta tanto ID como selector CSS
                const el = selector.startsWith('#') || selector.startsWith('.')
                    ? document.querySelector(selector)
                    : document.getElementById(selector);
                if (el) el.style.display = show ? (display || 'block') : 'none';
            };

            mostrar('bgEstadoVacio',      sinDatos);
            mostrar('.bg-detalle-grid',   !sinDatos, 'grid');
            mostrar('.bg-ratios-section', !sinDatos);
            mostrar('.bg-graficos',       !sinDatos, 'grid');
            mostrar('bgEcuacionStatus',   !sinDatos);
        }
    };

    console.log('✅ [BG-UI] Cargado');

})();
