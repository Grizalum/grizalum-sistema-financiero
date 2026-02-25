/**
 * ═══════════════════════════════════════════════════════════════════
 * BALANCE GENERAL - GRIZALUM Sistema Financiero
 * Calcula Activos, Pasivos y Patrimonio desde FlujoCaja
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // Evitar doble inicialización
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

            // Clasificación de categorías para el balance
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
            
            this.inicializado = true;
            console.log('✅ [BalanceGeneral] Inicializado');
        }

        async _esperarDependencias() {
            return new Promise((resolve) => {
                let intentos = 0;
                const maxIntentos = 30;
                
                const verificar = () => {
                    intentos++;
                    const tieneFlujoCaja = !!window.flujoCaja;
                    
                    if (tieneFlujoCaja) {
                        this.flujoCaja = window.flujoCaja;
                        console.log('✅ [BalanceGeneral] FlujoCaja conectado');
                        resolve();
                        return;
                    }
                    
                    if (intentos >= maxIntentos) {
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
            // Botones de período
            document.querySelectorAll('.bg-filtro-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.bg-filtro-btn').forEach(b => b.classList.remove('activo'));
                    btn.classList.add('activo');
                    this.periodoActual = btn.dataset.periodo;
                    this.calcular();
                    this._renderizar();
                    
                    // Actualizar subtítulo
                    const nombres = { 'hoy':'Hoy', 'semana':'Esta semana', 'mes':'Mes actual', 'trimestre':'Este trimestre', 'año':'Este año' };
                    const sub = document.getElementById('bgPeriodoActual');
                    if (sub) sub.textContent = nombres[this.periodoActual] || this.periodoActual;
                });
            });

            // Exportar
            const btnExportar = document.getElementById('btnExportarBG');
            if (btnExportar) {
                btnExportar.addEventListener('click', () => this._exportarExcel());
            }

            // Cambio de empresa
            if (this._onCompanyChanged) {
                document.removeEventListener('grizalumCompanyChanged', this._onCompanyChanged);
            }
            this._onCompanyChanged = () => {
                this.empresaActual = localStorage.getItem('grizalum_empresa_actual') || 'avicola';
                this._cargarDatosGuardados();
                this.calcular();
                this._renderizar();
            };
            document.addEventListener('grizalumCompanyChanged', this._onCompanyChanged);
        }

        // ═══════════════════════════════════════════════════════════════
        // CÁLCULOS
        // ═══════════════════════════════════════════════════════════════

        calcular() {
            const transacciones = this._obtenerTransacciones();
            const rango = this._calcularRango(this.periodoActual);
            
            // Filtrar por período
            const txEnPeriodo = transacciones.filter(t => {
                const fecha = new Date(t.fecha);
                return fecha >= rango.inicio && fecha <= rango.fin;
            });

            console.log(`📋 [BalanceGeneral] ${txEnPeriodo.length} de ${transacciones.length} transacciones en período`);

            // Calcular efectivo (ingresos - gastos del período)
            let totalIngresos = 0;
            let totalGastos = 0;
            let prestamosRecibidos = 0;

            txEnPeriodo.forEach(t => {
                if (t.tipo === 'ingreso') {
                    totalIngresos += t.monto || 0;
                    if (t.categoria && t.categoria.toLowerCase().includes('préstamo')) {
                        prestamosRecibidos += t.monto || 0;
                    }
                } else if (t.tipo === 'gasto') {
                    totalGastos += t.monto || 0;
                }
            });

            const efectivo = totalIngresos - totalGastos;
            const resultadoEjercicio = totalIngresos - prestamosRecibidos - totalGastos;

            // ── Calcular Activos ──
            const activosCorrientes = this._calcularSeccion('activosCorrientes', { efectivo });
            const activosNoCorrientes = this._calcularSeccion('activosNoCorrientes', {});
            const totalActivos = activosCorrientes.total + activosNoCorrientes.total;

            // ── Calcular Pasivos ──
            const pasivosCorrientes = this._calcularSeccion('pasivosCorrientes', { prestamosCorto: prestamosRecibidos });
            const pasivosNoCorrientes = this._calcularSeccion('pasivosNoCorrientes', {});
            const totalPasivos = pasivosCorrientes.total + pasivosNoCorrientes.total;

            // ── Calcular Patrimonio ──
            const patrimonio = this._calcularSeccion('patrimonio', { resultadoEjercicio });
            const totalPatrimonio = patrimonio.total;

            // ── Ratios ──
            const ratios = {
                liquidez: pasivosCorrientes.total > 0 ? activosCorrientes.total / pasivosCorrientes.total : activosCorrientes.total > 0 ? 99 : 0,
                endeudamiento: totalActivos > 0 ? (totalPasivos / totalActivos * 100) : 0,
                solvencia: totalPasivos > 0 ? totalActivos / totalPasivos : totalActivos > 0 ? 99 : 0,
                capitalTrabajo: activosCorrientes.total - pasivosCorrientes.total
            };

            this.resultados = {
                periodo: this.periodoActual,
                rango,
                activos: {
                    corrientes: activosCorrientes,
                    noCorrientes: activosNoCorrientes,
                    total: totalActivos
                },
                pasivos: {
                    corrientes: pasivosCorrientes,
                    noCorrientes: pasivosNoCorrientes,
                    total: totalPasivos
                },
                patrimonio: {
                    detalle: patrimonio,
                    total: totalPatrimonio
                },
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

                items.push({
                    id: cuenta.id,
                    nombre: cuenta.nombre,
                    valor: valor,
                    tipo: cuenta.tipo
                });

                total += valor;
            });

            return { items, total };
        }

        _obtenerTransacciones() {
            // Intentar FlujoCaja primero
            if (this.flujoCaja && this.flujoCaja.obtenerTransacciones) {
                const txs = this.flujoCaja.obtenerTransacciones();
                if (txs && txs.length > 0) {
                    return txs;
                }
            }
            
            // Fallback: localStorage directo
            const key = `grizalum_flujo_caja_${this.empresaActual}`;
            try {
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                if (Array.isArray(data) && data.length > 0) {
                    console.log(`📋 [BalanceGeneral] ${data.length} transacciones desde localStorage`);
                    return data;
                }
            } catch(e) {}

            // Fallback 2: key alternativa
            const key2 = `flujoCaja_${this.empresaActual}`;
            try {
                const data2 = JSON.parse(localStorage.getItem(key2) || '{}');
                if (data2.transacciones && Array.isArray(data2.transacciones)) {
                    console.log(`📋 [BalanceGeneral] ${data2.transacciones.length} transacciones desde localStorage (alt)`);
                    return data2.transacciones;
                }
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
                    const diaSemana = hoy.getDay();
                    inicio = new Date(hoy);
                    inicio.setDate(hoy.getDate() - diaSemana);
                    inicio.setHours(0,0,0,0);
                    fin = new Date(inicio);
                    fin.setDate(inicio.getDate() + 6);
                    fin.setHours(23,59,59,999);
                    break;
                case 'trimestre':
                    const trimestre = Math.floor(hoy.getMonth() / 3);
                    inicio = new Date(hoy.getFullYear(), trimestre * 3, 1);
                    fin = new Date(hoy.getFullYear(), (trimestre + 1) * 3, 0, 23, 59, 59, 999);
                    break;
                case 'año':
                    inicio = new Date(hoy.getFullYear(), 0, 1);
                    fin = new Date(hoy.getFullYear(), 11, 31, 23, 59, 59, 999);
                    break;
                case 'mes':
                default:
                    inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                    fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);
                    break;
            }

            return { inicio, fin };
        }

        // ═══════════════════════════════════════════════════════════════
        // PERSISTENCIA DE DATOS MANUALES
        // ═══════════════════════════════════════════════════════════════

        _obtenerValorManual(seccionId, cuentaId) {
            const key = `grizalum_balance_${this.empresaActual}`;
            try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                return data[seccionId]?.[cuentaId] || 0;
            } catch(e) {
                return 0;
            }
        }

        guardarValorManual(seccionId, cuentaId, valor) {
            const key = `grizalum_balance_${this.empresaActual}`;
            try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (!data[seccionId]) data[seccionId] = {};
                data[seccionId][cuentaId] = parseFloat(valor) || 0;
                localStorage.setItem(key, JSON.stringify(data));
                this.calcular();
                this._renderizar();
            } catch(e) {
                console.error('Error guardando valor manual:', e);
            }
        }

        _cargarDatosGuardados() {
            // Los datos manuales se cargan desde localStorage automáticamente
            // en _obtenerValorManual cuando se calcula
        }

        // ═══════════════════════════════════════════════════════════════
        // RENDERIZADO UI
        // ═══════════════════════════════════════════════════════════════

        _renderizar() {
            if (!this.resultados) return;
            const r = this.resultados;

            const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            // Ecuación principal
            this._setText('bgTotalActivos', fmt(r.activos.total));
            this._setText('bgTotalPasivos', fmt(r.pasivos.total));
            this._setText('bgTotalPatrimonio', fmt(r.patrimonio.total));

            // Status ecuación
            const statusEl = document.getElementById('bgEcuacionStatus');
            if (statusEl) {
                if (r.ecuacionBalanceada) {
                    statusEl.innerHTML = '<span class="bg-status-icon">✅</span><span class="bg-status-text">Ecuación contable balanceada</span>';
                    statusEl.classList.remove('desbalanceado');
                } else {
                    const diff = Math.abs(r.activos.total - (r.pasivos.total + r.patrimonio.total));
                    statusEl.innerHTML = `<span class="bg-status-icon">⚠️</span><span class="bg-status-text">Diferencia: ${fmt(diff)} — Ajuste pendiente</span>`;
                    statusEl.classList.add('desbalanceado');
                }
            }

            // Totales de secciones
            this._setText('bgActivosTotal', fmt(r.activos.total));
            this._setText('bgActivosCorrientes', fmt(r.activos.corrientes.total));
            this._setText('bgActivosNoCorrientes', fmt(r.activos.noCorrientes.total));
            this._setText('bgPasivosTotal', fmt(r.pasivos.total));
            this._setText('bgPasivosCorrientes', fmt(r.pasivos.corrientes.total));
            this._setText('bgPasivosNoCorrientes', fmt(r.pasivos.noCorrientes.total));
            this._setText('bgPatrimonioTotal', fmt(r.patrimonio.total));
            this._setText('bgCapitalResultados', fmt(r.patrimonio.total));

            // Listas de items
            this._renderizarItems('bgListaActivosCorrientes', r.activos.corrientes.items, 'activosCorrientes');
            this._renderizarItems('bgListaActivosNoCorrientes', r.activos.noCorrientes.items, 'activosNoCorrientes');
            this._renderizarItems('bgListaPasivosCorrientes', r.pasivos.corrientes.items, 'pasivosCorrientes');
            this._renderizarItems('bgListaPasivosNoCorrientes', r.pasivos.noCorrientes.items, 'pasivosNoCorrientes');
            this._renderizarItems('bgListaPatrimonio', r.patrimonio.detalle.items, 'patrimonio');

            // Ratios
            this._renderizarRatios(r.ratios);

            // Estado vacío
            const vacio = document.getElementById('bgEstadoVacio');
            const detalle = document.querySelector('.bg-detalle-container');
            const ratiosEl = document.querySelector('.bg-ratios-container');
            const ecuacionEl = document.querySelector('.bg-ecuacion-container');
            const statusElContainer = document.getElementById('bgEcuacionStatus');
            
            if (r.transaccionesEnPeriodo === 0 && r.activos.total === 0 && r.pasivos.total === 0 && r.patrimonio.total === 0) {
                if (vacio) vacio.style.display = 'block';
                if (detalle) detalle.style.display = 'none';
                if (ratiosEl) ratiosEl.style.display = 'none';
                if (ecuacionEl) ecuacionEl.style.display = 'none';
                if (statusElContainer) statusElContainer.style.display = 'none';
            } else {
                if (vacio) vacio.style.display = 'none';
                if (detalle) detalle.style.display = 'flex';
                if (ratiosEl) ratiosEl.style.display = 'block';
                if (ecuacionEl) ecuacionEl.style.display = 'flex';
                if (statusElContainer) statusElContainer.style.display = 'flex';
            }
        }

        _renderizarItems(containerId, items, seccionId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            if (!items || items.length === 0) {
                container.innerHTML = '<div class="bg-item-vacio">Sin registros</div>';
                return;
            }

            container.innerHTML = items.map(item => {
                const claseColor = item.valor > 0 ? 'positivo' : item.valor < 0 ? 'negativo' : '';
                const fmt = 'S/ ' + Math.abs(item.valor || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const signo = item.valor < 0 ? '-' : '';
                const editable = item.tipo === 'manual' ? 'data-editable="true"' : '';
                
                return `
                    <div class="bg-item" ${editable} data-seccion="${seccionId}" data-cuenta="${item.id}">
                        <span class="bg-item-nombre">${item.nombre}</span>
                        <span class="bg-item-monto ${claseColor}">${signo}${fmt}</span>
                    </div>
                `;
            }).join('');

            // Agregar click para editar valores manuales
            container.querySelectorAll('[data-editable="true"]').forEach(el => {
                el.style.cursor = 'pointer';
                el.title = 'Click para editar';
                el.addEventListener('click', () => {
                    const seccion = el.dataset.seccion;
                    const cuenta = el.dataset.cuenta;
                    const item = items.find(i => i.id === cuenta);
                    const nuevoValor = prompt(`${item.nombre}\nIngrese el nuevo valor:`, item.valor || 0);
                    if (nuevoValor !== null) {
                        this.guardarValorManual(seccion, cuenta, nuevoValor);
                    }
                });
            });
        }

        _renderizarRatios(ratios) {
            // Liquidez
            const liqValor = Math.min(ratios.liquidez, 99);
            this._setText('bgRatioLiquidez', liqValor >= 99 ? '∞' : liqValor.toFixed(2));
            this._setProgreso('bgBarraLiquidez', Math.min(liqValor / 3 * 100, 100), 
                liqValor >= 1.5 ? '' : liqValor >= 1 ? 'alerta' : 'peligro');

            // Endeudamiento
            this._setText('bgRatioEndeudamiento', ratios.endeudamiento.toFixed(1) + '%');
            this._setProgreso('bgBarraEndeudamiento', Math.min(ratios.endeudamiento, 100), 
                ratios.endeudamiento <= 40 ? '' : ratios.endeudamiento <= 60 ? 'alerta' : 'peligro');

            // Solvencia
            const solValor = Math.min(ratios.solvencia, 99);
            this._setText('bgRatioSolvencia', solValor >= 99 ? '∞' : solValor.toFixed(2));
            this._setProgreso('bgBarraSolvencia', Math.min(solValor / 3 * 100, 100),
                solValor >= 1.5 ? '' : solValor >= 1 ? 'alerta' : 'peligro');

            // Capital de trabajo
            const fmt = 'S/ ' + ratios.capitalTrabajo.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this._setText('bgRatioCapitalTrabajo', fmt);
            this._setProgreso('bgBarraCapitalTrabajo', ratios.capitalTrabajo > 0 ? 75 : 25,
                ratios.capitalTrabajo > 0 ? '' : 'peligro');
        }

        // ═══════════════════════════════════════════════════════════════
        // EXPORTAR EXCEL
        // ═══════════════════════════════════════════════════════════════

        async _exportarExcel() {
            if (!this.resultados) {
                alert('No hay datos para exportar. Seleccione un período con transacciones.');
                return;
            }

            try {
                if (typeof ExcelJS === 'undefined') {
                    alert('ExcelJS no disponible');
                    return;
                }

                const wb = new ExcelJS.Workbook();
                wb.creator = 'GRIZALUM Sistema Financiero';
                const sheet = wb.addWorksheet('Balance General', { views: [{ showGridLines: false }] });
                
                const r = this.resultados;
                const fmt = (v) => v || 0;

                // Anchos
                sheet.getColumn(1).width = 40;
                sheet.getColumn(2).width = 22;
                sheet.getColumn(3).width = 2;

                // Título
                sheet.mergeCells('A1:C1');
                const t = sheet.getCell('A1');
                t.value = 'BALANCE GENERAL';
                t.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
                t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
                t.alignment = { horizontal: 'center', vertical: 'middle' };
                sheet.getRow(1).height = 42;

                // Info
                sheet.getCell('A3').value = 'Empresa:';
                sheet.getCell('A3').font = { name: 'Arial', size: 10, bold: true };
                sheet.getCell('B3').value = (this.empresaActual || 'N/A').charAt(0).toUpperCase() + (this.empresaActual || '').slice(1);
                sheet.getCell('A4').value = 'Fecha:';
                sheet.getCell('A4').font = { name: 'Arial', size: 10, bold: true };
                sheet.getCell('B4').value = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

                let row = 6;

                const addSeccion = (titulo, items, total, color) => {
                    sheet.mergeCells(row, 1, row, 2);
                    const s = sheet.getCell(row, 1);
                    s.value = titulo;
                    s.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
                    s.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
                    s.alignment = { horizontal: 'left', vertical: 'middle' };
                    sheet.getRow(row).height = 28;
                    row++;

                    items.forEach(item => {
                        sheet.getCell(row, 1).value = '    ' + item.nombre;
                        sheet.getCell(row, 1).font = { name: 'Arial', size: 10 };
                        sheet.getCell(row, 2).value = item.valor;
                        sheet.getCell(row, 2).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00;"-"';
                        sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                        row++;
                    });

                    // Total
                    sheet.getCell(row, 1).value = '  TOTAL';
                    sheet.getCell(row, 1).font = { name: 'Arial', size: 10, bold: true };
                    sheet.getCell(row, 2).value = total;
                    sheet.getCell(row, 2).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00;"-"';
                    sheet.getCell(row, 2).font = { name: 'Arial', size: 10, bold: true };
                    sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                    [1,2].forEach(c => {
                        sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
                    });
                    row += 2;
                };

                addSeccion('ACTIVOS CORRIENTES', r.activos.corrientes.items, r.activos.corrientes.total, 'FF10B981');
                addSeccion('ACTIVOS NO CORRIENTES', r.activos.noCorrientes.items, r.activos.noCorrientes.total, 'FF059669');

                // Total activos
                sheet.getCell(row, 1).value = 'TOTAL ACTIVOS';
                sheet.getCell(row, 1).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
                sheet.getCell(row, 2).value = r.activos.total;
                sheet.getCell(row, 2).numFmt = '"S/." #,##0.00';
                sheet.getCell(row, 2).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
                sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                [1,2].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }; });
                sheet.getRow(row).height = 32;
                row += 2;

                addSeccion('PASIVOS CORRIENTES', r.pasivos.corrientes.items, r.pasivos.corrientes.total, 'FFEF4444');
                addSeccion('PASIVOS NO CORRIENTES', r.pasivos.noCorrientes.items, r.pasivos.noCorrientes.total, 'FFDC2626');

                // Total pasivos
                sheet.getCell(row, 1).value = 'TOTAL PASIVOS';
                sheet.getCell(row, 1).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
                sheet.getCell(row, 2).value = r.pasivos.total;
                sheet.getCell(row, 2).numFmt = '"S/." #,##0.00';
                sheet.getCell(row, 2).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
                sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                [1,2].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } }; });
                sheet.getRow(row).height = 32;
                row += 2;

                addSeccion('PATRIMONIO', r.patrimonio.detalle.items, r.patrimonio.total, 'FF667EEA');

                // Total Pasivos + Patrimonio
                sheet.getCell(row, 1).value = 'TOTAL PASIVOS + PATRIMONIO';
                sheet.getCell(row, 1).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
                sheet.getCell(row, 2).value = r.pasivos.total + r.patrimonio.total;
                sheet.getCell(row, 2).numFmt = '"S/." #,##0.00';
                sheet.getCell(row, 2).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
                sheet.getCell(row, 2).alignment = { horizontal: 'right' };
                [1,2].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } }; });
                sheet.getRow(row).height = 32;

                const buffer = await wb.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `GRIZALUM_BalanceGeneral_${this.empresaActual}_${new Date().toISOString().split('T')[0]}.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
                
                console.log('✅ Excel Balance General exportado');
            } catch(e) {
                console.error('❌ Error exportando Balance General:', e);
                alert('Error al exportar: ' + e.message);
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // HELPERS
        // ═══════════════════════════════════════════════════════════════

        _setText(id, text) {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        }

        _setProgreso(id, porcentaje, clase) {
            const el = document.getElementById(id);
            if (el) {
                el.style.width = Math.max(0, Math.min(100, porcentaje)) + '%';
                el.className = 'bg-ratio-progreso' + (clase ? ' ' + clase : '');
            }
        }

        obtenerResultados() {
            return this.resultados;
        }
    }

    // ── Inicializar ──
    window.BalanceGeneral = BalanceGeneral;
    window.balanceGeneral = new BalanceGeneral();

    // Función global para el cargador
    window.inicializarBalanceGeneral = function() {
        if (!window.balanceGeneral || !window.balanceGeneral.inicializado) {
            window.balanceGeneral = new BalanceGeneral();
        } else {
            window.balanceGeneral.calcular();
            window.balanceGeneral._renderizar();
        }
    };

    console.log('✅ Balance General cargado');
})();
