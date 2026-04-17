/**
 * ═══════════════════════════════════════════════════════════════════
 * BALANCE GENERAL - GRIZALUM Sistema Financiero
 * Calcula Activos, Pasivos y Patrimonio desde FlujoCaja
 * v20260417 - Gráficos completos + fixes renderizado
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    if (window._balanceGeneralCargado) {
        console.log('⚠️ Balance General ya cargado, omitiendo...');
        return;
    }
    window._balanceGeneralCargado = true;

    class BalanceGeneral {
        constructor() {
            this.empresaActual = null;
            this.periodoActual = 'mes';
            this.resultados = null;
            this.flujoCaja = null;
            this.inicializado = false;
            this.graficos = {};

            this.clasificacion = {
                activosCorrientes: {
                    nombre: 'Activos Corrientes',
                    categorias: ['Ventas', 'Servicios', 'Préstamo recibido', 'Freelance', 'Comisiones', 'Inversiones', 'Otros ingresos'],
                    cuentas: [
                        { id: 'efectivo', nombre: 'Efectivo y Equivalentes', tipo: 'calculado' },
                        { id: 'cuentasCobrar', nombre: 'Cuentas por Cobrar', tipo: 'manual', valor: 0 },
                        { id: 'inventario', nombre: 'Inventario', tipo: 'manual', valor: 0 }
                    ]
                },
                activosNoCorrientes: {
                    nombre: 'Activos No Corrientes',
                    cuentas: [
                        { id: 'equipos', nombre: 'Equipos y Maquinaria', tipo: 'manual', valor: 0 },
                        { id: 'muebles', nombre: 'Muebles y Enseres', tipo: 'manual', valor: 0 },
                        { id: 'vehiculos', nombre: 'Vehículos', tipo: 'manual', valor: 0 },
                        { id: 'depreciacion', nombre: '(-) Depreciación Acumulada', tipo: 'manual', valor: 0 }
                    ]
                },
                pasivosCorrientes: {
                    nombre: 'Pasivos Corrientes',
                    cuentas: [
                        { id: 'cuentasPagar', nombre: 'Cuentas por Pagar', tipo: 'manual', valor: 0 },
                        { id: 'prestamosCorto', nombre: 'Préstamos a Corto Plazo', tipo: 'calculado' },
                        { id: 'impuestos', nombre: 'Impuestos por Pagar', tipo: 'manual', valor: 0 }
                    ]
                },
                pasivosNoCorrientes: {
                    nombre: 'Pasivos No Corrientes',
                    cuentas: [
                        { id: 'prestamosLargo', nombre: 'Préstamos a Largo Plazo', tipo: 'manual', valor: 0 },
                        { id: 'hipotecas', nombre: 'Hipotecas', tipo: 'manual', valor: 0 }
                    ]
                },
                patrimonio: {
                    nombre: 'Patrimonio',
                    cuentas: [
                        { id: 'capital', nombre: 'Capital Social', tipo: 'manual', valor: 0 },
                        { id: 'reservas', nombre: 'Reservas', tipo: 'manual', valor: 0 },
                        { id: 'resultadoEjercicio', nombre: 'Resultado del Ejercicio', tipo: 'calculado' },
                        { id: 'resultadosAcumulados', nombre: 'Resultados Acumulados', tipo: 'manual', valor: 0 }
                    ]
                }
            };

            this._inicializar();
        }

        async _inicializar() {
            console.log('📋 [BalanceGeneral] Inicializando...');
            await this._esperarDependencias();
            this.empresaActual = localStorage.getItem('grizalum_empresa_actual') || 'avicola';
            this._cargarDatosGuardados();
            this._configurarEventos();
            this.calcular();
            this._renderizar();
            this._renderizarGraficos();
            this.inicializado = true;
            console.log('✅ [BalanceGeneral] Inicializado');
        }

        async _esperarDependencias() {
            return new Promise((resolve) => {
                let intentos = 0;
                const verificar = () => {
                    intentos++;
                    if (window.flujoCaja) {
                        this.flujoCaja = window.flujoCaja;
                        console.log('✅ [BalanceGeneral] FlujoCaja conectado');
                        resolve();
                        return;
                    }
                    if (intentos >= 30) {
                        console.warn('⚠️ [BalanceGeneral] FlujoCaja no disponible, usando localStorage');
                        resolve();
                        return;
                    }
                    setTimeout(verificar, 300);
                };
                verificar();
            });
        }

        _configurarEventos() {
            document.querySelectorAll('.bg-filtro-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.bg-filtro-btn').forEach(b => b.classList.remove('activo'));
                    btn.classList.add('activo');
                    this.periodoActual = btn.dataset.periodo;
                    this.calcular();
                    this._renderizar();
                    this._renderizarGraficos();
                    const nombres = { hoy:'Hoy', semana:'Esta semana', mes:'Mes actual', trimestre:'Este trimestre', 'año':'Este año' };
                    const sub = document.getElementById('bgPeriodoActual');
                    if (sub) sub.textContent = nombres[this.periodoActual] || this.periodoActual;
                });
            });

            const btnExportar = document.getElementById('btnExportarBG');
            if (btnExportar) btnExportar.addEventListener('click', () => this._exportarExcel());

            if (this._onCompanyChanged) document.removeEventListener('grizalumCompanyChanged', this._onCompanyChanged);
            this._onCompanyChanged = () => {
                this.empresaActual = localStorage.getItem('grizalum_empresa_actual') || 'avicola';
                this._cargarDatosGuardados();
                this.calcular();
                this._renderizar();
                this._renderizarGraficos();
            };
            document.addEventListener('grizalumCompanyChanged', this._onCompanyChanged);
        }

        // ═══════════════════════════════════════════════════════════════
        // CÁLCULOS
        // ═══════════════════════════════════════════════════════════════

        calcular() {
            const transacciones = this._obtenerTransacciones();
            const rango = this._calcularRango(this.periodoActual);
            const txEnPeriodo = transacciones.filter(t => {
                const fecha = new Date(t.fecha);
                return fecha >= rango.inicio && fecha <= rango.fin;
            });

            let totalIngresos = 0, totalGastos = 0, prestamosRecibidos = 0;
            txEnPeriodo.forEach(t => {
                if (t.tipo === 'ingreso') {
                    totalIngresos += t.monto || 0;
                    if (t.categoria && t.categoria.toLowerCase().includes('préstamo')) prestamosRecibidos += t.monto || 0;
                } else if (t.tipo === 'gasto') {
                    totalGastos += t.monto || 0;
                }
            });

            const efectivo = totalIngresos - totalGastos;
            const resultadoEjercicio = totalIngresos - prestamosRecibidos - totalGastos;

            const activosCorrientes = this._calcularSeccion('activosCorrientes', { efectivo });
            const activosNoCorrientes = this._calcularSeccion('activosNoCorrientes', {});
            const totalActivos = activosCorrientes.total + activosNoCorrientes.total;

            const pasivosCorrientes = this._calcularSeccion('pasivosCorrientes', { prestamosCorto: prestamosRecibidos });
            const pasivosNoCorrientes = this._calcularSeccion('pasivosNoCorrientes', {});
            const totalPasivos = pasivosCorrientes.total + pasivosNoCorrientes.total;

            const patrimonio = this._calcularSeccion('patrimonio', { resultadoEjercicio });
            const totalPatrimonio = patrimonio.total;

            const ratios = {
                liquidez: pasivosCorrientes.total > 0 ? activosCorrientes.total / pasivosCorrientes.total : activosCorrientes.total > 0 ? 99 : 0,
                endeudamiento: totalActivos > 0 ? (totalPasivos / totalActivos * 100) : 0,
                solvencia: totalPasivos > 0 ? totalActivos / totalPasivos : totalActivos > 0 ? 99 : 0,
                capitalTrabajo: activosCorrientes.total - pasivosCorrientes.total
            };

            this.resultados = {
                periodo: this.periodoActual, rango,
                activos: { corrientes: activosCorrientes, noCorrientes: activosNoCorrientes, total: totalActivos },
                pasivos: { corrientes: pasivosCorrientes, noCorrientes: pasivosNoCorrientes, total: totalPasivos },
                patrimonio: { detalle: patrimonio, total: totalPatrimonio },
                ecuacionBalanceada: Math.abs(totalActivos - (totalPasivos + totalPatrimonio)) < 0.01,
                ratios,
                transaccionesEnPeriodo: txEnPeriodo.length
            };
            return this.resultados;
        }

        _calcularSeccion(seccionId, valoresCalculados) {
            const seccion = this.clasificacion[seccionId];
            const items = [];
            let total = 0;
            seccion.cuentas.forEach(cuenta => {
                let valor = 0;
                if (cuenta.tipo === 'calculado' && valoresCalculados[cuenta.id] !== undefined) {
                    valor = valoresCalculados[cuenta.id];
                } else if (cuenta.tipo === 'manual') {
                    valor = this._obtenerValorManual(seccionId, cuenta.id);
                }
                items.push({ id: cuenta.id, nombre: cuenta.nombre, valor, tipo: cuenta.tipo });
                total += valor;
            });
            return { items, total };
        }

        _obtenerTransacciones() {
            if (this.flujoCaja && this.flujoCaja.obtenerTransacciones) {
                const txs = this.flujoCaja.obtenerTransacciones();
                if (txs && txs.length > 0) return txs;
            }
            try {
                const data = JSON.parse(localStorage.getItem(`grizalum_flujo_caja_${this.empresaActual}`) || '[]');
                if (Array.isArray(data) && data.length > 0) return data;
            } catch(e) {}
            try {
                const data2 = JSON.parse(localStorage.getItem(`flujoCaja_${this.empresaActual}`) || '{}');
                if (data2.transacciones && Array.isArray(data2.transacciones)) return data2.transacciones;
            } catch(e) {}
            return [];
        }

        _calcularRango(periodo) {
            const hoy = new Date();
            let inicio, fin;
            switch(periodo) {
                case 'hoy':
                    inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                    fin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
                    break;
                case 'semana':
                    inicio = new Date(hoy); inicio.setDate(hoy.getDate() - hoy.getDay()); inicio.setHours(0,0,0,0);
                    fin = new Date(inicio); fin.setDate(inicio.getDate() + 6); fin.setHours(23,59,59,999);
                    break;
                case 'trimestre':
                    const trim = Math.floor(hoy.getMonth() / 3);
                    inicio = new Date(hoy.getFullYear(), trim * 3, 1);
                    fin = new Date(hoy.getFullYear(), (trim + 1) * 3, 0, 23, 59, 59, 999);
                    break;
                case 'año':
                    inicio = new Date(hoy.getFullYear(), 0, 1);
                    fin = new Date(hoy.getFullYear(), 11, 31, 23, 59, 59, 999);
                    break;
                default:
                    inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                    fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);
            }
            return { inicio, fin };
        }

        // ═══════════════════════════════════════════════════════════════
        // PERSISTENCIA
        // ═══════════════════════════════════════════════════════════════

        _obtenerValorManual(seccionId, cuentaId) {
            try {
                const data = JSON.parse(localStorage.getItem(`grizalum_balance_${this.empresaActual}`) || '{}');
                return data[seccionId]?.[cuentaId] || 0;
            } catch(e) { return 0; }
        }

        guardarValorManual(seccionId, cuentaId, valor) {
            try {
                const key = `grizalum_balance_${this.empresaActual}`;
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (!data[seccionId]) data[seccionId] = {};
                data[seccionId][cuentaId] = parseFloat(valor) || 0;
                localStorage.setItem(key, JSON.stringify(data));
                this.calcular();
                this._renderizar();
                this._renderizarGraficos();
            } catch(e) { console.error('Error guardando:', e); }
        }

        _cargarDatosGuardados() {}

        // ═══════════════════════════════════════════════════════════════
        // RENDERIZADO
        // ═══════════════════════════════════════════════════════════════

        _renderizar() {
            if (!this.resultados) return;
            const r = this.resultados;
            const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            this._setText('bgTotalActivos', fmt(r.activos.total));
            this._setText('bgTotalPasivos', fmt(r.pasivos.total));
            this._setText('bgTotalPatrimonio', fmt(r.patrimonio.total));

            const pctEl = document.getElementById('bgPctEndeudamiento');
            if (pctEl) pctEl.textContent = r.ratios.endeudamiento.toFixed(1) + '%';

            const statusEl = document.getElementById('bgEcuacionStatus');
            if (statusEl) {
                statusEl.innerHTML = r.ecuacionBalanceada
                    ? '<div class="bg-ecuacion-badge positivo"><i class="fas fa-check-circle"></i><span>Ecuación contable balanceada: <strong>Activos = Pasivos + Patrimonio</strong></span></div>'
                    : `<div class="bg-ecuacion-badge negativo"><i class="fas fa-exclamation-triangle"></i><span>Diferencia: <strong>${fmt(Math.abs(r.activos.total - (r.pasivos.total + r.patrimonio.total)))}</strong> — Ajuste pendiente</span></div>`;
            }

            this._setText('bgActivosTotal', fmt(r.activos.total));
            this._setText('bgActivosCorrientes', fmt(r.activos.corrientes.total));
            this._setText('bgActivosNoCorrientes', fmt(r.activos.noCorrientes.total));
            this._setText('bgPasivosTotal', fmt(r.pasivos.total));
            this._setText('bgPasivosCorrientes', fmt(r.pasivos.corrientes.total));
            this._setText('bgPasivosNoCorrientes', fmt(r.pasivos.noCorrientes.total));
            this._setText('bgPatrimonioTotal', fmt(r.patrimonio.total));
            this._setText('bgCapitalResultados', fmt(r.patrimonio.total));

            this._renderizarItems('bgListaActivosCorrientes', r.activos.corrientes.items, 'activosCorrientes');
            this._renderizarItems('bgListaActivosNoCorrientes', r.activos.noCorrientes.items, 'activosNoCorrientes');
            this._renderizarItems('bgListaPasivosCorrientes', r.pasivos.corrientes.items, 'pasivosCorrientes');
            this._renderizarItems('bgListaPasivosNoCorrientes', r.pasivos.noCorrientes.items, 'pasivosNoCorrientes');
            this._renderizarItems('bgListaPatrimonio', r.patrimonio.detalle.items, 'patrimonio');

            this._renderizarRatios(r.ratios);

            const sinDatos = r.transaccionesEnPeriodo === 0 && r.activos.total === 0 && r.pasivos.total === 0 && r.patrimonio.total === 0;
            const toggleDisplay = (sel, show, tipo) => { const el = typeof sel === 'string' ? document.querySelector(sel) : document.getElementById(sel); if (el) el.style.display = show ? (tipo || 'block') : 'none'; };

            toggleDisplay('bgEstadoVacio', sinDatos);
            toggleDisplay('.bg-detalle-grid', !sinDatos, 'grid');
            toggleDisplay('.bg-ratios-section', !sinDatos);
            toggleDisplay('.bg-graficos', !sinDatos, 'grid');
            toggleDisplay('bgEcuacionStatus', !sinDatos);
        }

        _renderizarItems(containerId, items, seccionId) {
            const container = document.getElementById(containerId);
            if (!container || !items) return;
            const fmt = (v) => 'S/ ' + Math.abs(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            container.innerHTML = items.map(item => {
                const cls = item.valor > 0 ? 'positivo' : item.valor < 0 ? 'negativo' : '';
                const editable = item.tipo === 'manual';
                return `
                    <div class="bg-item${editable ? ' bg-item-editable' : ''}"
                         ${editable ? 'data-editable="true"' : ''}
                         data-seccion="${seccionId}" data-cuenta="${item.id}"
                         ${editable ? 'title="Click para editar"' : ''}>
                        <span class="bg-item-nombre">${item.nombre}${editable ? ' <i class="fas fa-pencil-alt" style="font-size:0.65rem;opacity:0.5;margin-left:4px;"></i>' : ''}</span>
                        <span class="bg-item-monto ${cls}">${item.valor < 0 ? '-' : ''}${fmt(item.valor)}</span>
                    </div>`;
            }).join('');

            container.querySelectorAll('[data-editable="true"]').forEach(el => {
                el.style.cursor = 'pointer';
                el.addEventListener('click', () => {
                    const item = items.find(i => i.id === el.dataset.cuenta);
                    if (!item) return;
                    const nuevoValor = prompt(`✏️ ${item.nombre}\nIngrese el valor (S/.):`, item.valor || 0);
                    if (nuevoValor !== null && nuevoValor !== '') this.guardarValorManual(el.dataset.seccion, el.dataset.cuenta, nuevoValor);
                });
            });
        }

        _renderizarRatios(ratios) {
            const liq = Math.min(ratios.liquidez, 99);
            this._setText('bgRatioLiquidez', liq >= 99 ? '∞' : liq.toFixed(2));
            this._setProgreso('bgBarraLiquidez', Math.min(liq / 3 * 100, 100), liq >= 1.5 ? '' : liq >= 1 ? 'alerta' : 'peligro');

            this._setText('bgRatioEndeudamiento', ratios.endeudamiento.toFixed(1) + '%');
            this._setProgreso('bgBarraEndeudamiento', Math.min(ratios.endeudamiento, 100), ratios.endeudamiento <= 40 ? '' : ratios.endeudamiento <= 60 ? 'alerta' : 'peligro');

            const sol = Math.min(ratios.solvencia, 99);
            this._setText('bgRatioSolvencia', sol >= 99 ? '∞' : sol.toFixed(2));
            this._setProgreso('bgBarraSolvencia', Math.min(sol / 3 * 100, 100), sol >= 1.5 ? '' : sol >= 1 ? 'alerta' : 'peligro');

            const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this._setText('bgRatioCapitalTrabajo', fmt(ratios.capitalTrabajo));
            this._setProgreso('bgBarraCapitalTrabajo', ratios.capitalTrabajo > 0 ? 75 : 25, ratios.capitalTrabajo > 0 ? '' : 'peligro');
        }

        // ═══════════════════════════════════════════════════════════════
        // GRÁFICOS — PARTE NUEVA (el 40% que faltaba)
        // ═══════════════════════════════════════════════════════════════

        _renderizarGraficos() {
            if (!this.resultados) return;
            if (typeof Chart === 'undefined') {
                setTimeout(() => this._renderizarGraficos(), 500);
                return;
            }
            this._graficoComposicion();
            this._graficoEstructura();
        }

        _graficoComposicion() {
            const contenedor = document.getElementById('bgGraficoComposicion');
            if (!contenedor) return;
            if (this.graficos.composicion) { this.graficos.composicion.destroy(); this.graficos.composicion = null; }
            contenedor.innerHTML = '<canvas id="bgCanvasComposicion"></canvas>';
            const canvas = document.getElementById('bgCanvasComposicion');
            if (!canvas) return;

            const r = this.resultados;
            this.graficos.composicion = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Activos Corrientes', 'Activos No Corrientes', 'Pasivos Corrientes', 'Pasivos No Corrientes', 'Patrimonio'],
                    datasets: [{
                        data: [
                            r.activos.corrientes.total,
                            Math.max(r.activos.noCorrientes.total, 0),
                            r.pasivos.corrientes.total,
                            r.pasivos.noCorrientes.total,
                            Math.max(r.patrimonio.total, 0)
                        ],
                        backgroundColor: ['rgba(16,185,129,0.85)','rgba(5,150,105,0.85)','rgba(239,68,68,0.85)','rgba(185,28,28,0.85)','rgba(139,92,246,0.85)'],
                        borderColor: ['#10b981','#059669','#ef4444','#b91c1c','#8b5cf6'],
                        borderWidth: 2,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '60%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 12, usePointStyle: true } },
                        tooltip: { callbacks: { label: (ctx) => {
                            const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
                            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                            return ` S/ ${ctx.parsed.toLocaleString('es-PE', {minimumFractionDigits:2})} (${pct}%)`;
                        }}}
                    }
                }
            });
        }

        _graficoEstructura() {
            const contenedor = document.getElementById('bgGraficoEstructura');
            if (!contenedor) return;
            if (this.graficos.estructura) { this.graficos.estructura.destroy(); this.graficos.estructura = null; }
            contenedor.innerHTML = '<canvas id="bgCanvasEstructura"></canvas>';
            const canvas = document.getElementById('bgCanvasEstructura');
            if (!canvas) return;

            const r = this.resultados;
            this.graficos.estructura = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: ['Act. Corrientes', 'Act. No Corrientes', 'Pas. Corrientes', 'Pas. No Corrientes', 'Patrimonio'],
                    datasets: [{
                        label: 'S/.',
                        data: [
                            r.activos.corrientes.total,
                            Math.max(r.activos.noCorrientes.total, 0),
                            r.pasivos.corrientes.total,
                            r.pasivos.noCorrientes.total,
                            Math.max(r.patrimonio.total, 0)
                        ],
                        backgroundColor: ['rgba(16,185,129,0.7)','rgba(5,150,105,0.7)','rgba(239,68,68,0.7)','rgba(185,28,28,0.7)','rgba(139,92,246,0.7)'],
                        borderColor: ['#10b981','#059669','#ef4444','#b91c1c','#8b5cf6'],
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: (ctx) => ` S/ ${ctx.parsed.y.toLocaleString('es-PE', {minimumFractionDigits:2})}` }}
                    },
                    scales: {
                        x: { ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 20 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                        y: { ticks: { color: '#94a3b8', font: { size: 10 }, callback: (v) => 'S/.' + v.toLocaleString('es-PE') }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true }
                    }
                }
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // EXPORTAR EXCEL
        // ═══════════════════════════════════════════════════════════════

        async _exportarExcel() {
            if (!this.resultados) { alert('No hay datos para exportar.'); return; }
            try {
                if (typeof ExcelJS === 'undefined') { alert('ExcelJS no disponible'); return; }
                const wb = new ExcelJS.Workbook();
                wb.creator = 'GRIZALUM Sistema Financiero';
                const sheet = wb.addWorksheet('Balance General', { views: [{ showGridLines: false }] });
                const r = this.resultados;

                sheet.getColumn(1).width = 40;
                sheet.getColumn(2).width = 22;

                sheet.mergeCells('A1:B1');
                const t = sheet.getCell('A1');
                t.value = 'BALANCE GENERAL - GRIZALUM';
                t.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
                t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
                t.alignment = { horizontal: 'center', vertical: 'middle' };
                sheet.getRow(1).height = 40;

                sheet.getCell('A3').value = 'Empresa:'; sheet.getCell('A3').font = { bold: true };
                sheet.getCell('B3').value = (this.empresaActual || '').charAt(0).toUpperCase() + (this.empresaActual || '').slice(1);
                sheet.getCell('A4').value = 'Fecha:'; sheet.getCell('A4').font = { bold: true };
                sheet.getCell('B4').value = new Date().toLocaleDateString('es-PE', { year:'numeric', month:'long', day:'numeric' });

                let row = 6;
                const addSeccion = (titulo, items, total, color) => {
                    sheet.mergeCells(row, 1, row, 2);
                    const s = sheet.getCell(row, 1);
                    s.value = titulo;
                    s.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
                    s.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
                    s.alignment = { horizontal: 'left', vertical: 'middle' };
                    sheet.getRow(row).height = 26;
                    row++;
                    items.forEach(item => {
                        sheet.getCell(row, 1).value = '    ' + item.nombre;
                        sheet.getCell(row, 2).value = item.valor;
                        sheet.getCell(row, 2).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00';
                        sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                        row++;
                    });
                    sheet.getCell(row, 1).value = '  TOTAL'; sheet.getCell(row, 1).font = { bold: true };
                    sheet.getCell(row, 2).value = total;
                    sheet.getCell(row, 2).numFmt = '"S/." #,##0.00'; sheet.getCell(row, 2).font = { bold: true };
                    sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                    [1,2].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } }; });
                    row += 2;
                };

                addSeccion('ACTIVOS CORRIENTES', r.activos.corrientes.items, r.activos.corrientes.total, 'FF10B981');
                addSeccion('ACTIVOS NO CORRIENTES', r.activos.noCorrientes.items, r.activos.noCorrientes.total, 'FF059669');

                [1,2].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }; });
                sheet.getCell(row, 1).value = 'TOTAL ACTIVOS'; sheet.getCell(row, 1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
                sheet.getCell(row, 2).value = r.activos.total; sheet.getCell(row, 2).numFmt = '"S/." #,##0.00';
                sheet.getCell(row, 2).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }; sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                sheet.getRow(row).height = 30; row += 2;

                addSeccion('PASIVOS CORRIENTES', r.pasivos.corrientes.items, r.pasivos.corrientes.total, 'FFEF4444');
                addSeccion('PASIVOS NO CORRIENTES', r.pasivos.noCorrientes.items, r.pasivos.noCorrientes.total, 'FFDC2626');

                [1,2].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } }; });
                sheet.getCell(row, 1).value = 'TOTAL PASIVOS'; sheet.getCell(row, 1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
                sheet.getCell(row, 2).value = r.pasivos.total; sheet.getCell(row, 2).numFmt = '"S/." #,##0.00';
                sheet.getCell(row, 2).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }; sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                sheet.getRow(row).height = 30; row += 2;

                addSeccion('PATRIMONIO NETO', r.patrimonio.detalle.items, r.patrimonio.total, 'FF667EEA');

                [1,2].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } }; });
                sheet.getCell(row, 1).value = 'TOTAL PASIVOS + PATRIMONIO'; sheet.getCell(row, 1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
                sheet.getCell(row, 2).value = r.pasivos.total + r.patrimonio.total; sheet.getCell(row, 2).numFmt = '"S/." #,##0.00';
                sheet.getCell(row, 2).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }; sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                sheet.getRow(row).height = 30;

                const buffer = await wb.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `GRIZALUM_BalanceGeneral_${this.empresaActual}_${new Date().toISOString().split('T')[0]}.xlsx`;
                a.click(); URL.revokeObjectURL(url);
                console.log('✅ Excel exportado');
            } catch(e) {
                console.error('❌ Error exportando:', e);
                alert('Error al exportar: ' + e.message);
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // HELPERS
        // ═══════════════════════════════════════════════════════════════

        _setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
        _setProgreso(id, pct, cls) { const el = document.getElementById(id); if (el) { el.style.width = Math.max(0, Math.min(100, pct)) + '%'; el.className = 'bg-ratio-progreso' + (cls ? ' ' + cls : ''); } }
        obtenerResultados() { return this.resultados; }
    }

    // ── Inicializar ──
    window.BalanceGeneral = BalanceGeneral;
    window.balanceGeneral = new BalanceGeneral();

    window.inicializarBalanceGeneral = function() {
        if (!window.balanceGeneral || !window.balanceGeneral.inicializado) {
            window.balanceGeneral = new BalanceGeneral();
        } else {
            window.balanceGeneral.calcular();
            window.balanceGeneral._renderizar();
            window.balanceGeneral._renderizarGraficos();
        }
    };

    console.log('✅ [GRIZALUM] Balance General v20260417 cargado');
})();
