/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTADOR EXCEL PROFESIONAL - ESTADO DE RESULTADOS v2.1
 * Genera reportes financieros en Excel con formato profesional
 * GRIZALUM Sistema Financiero
 * ═══════════════════════════════════════════════════════════════════
 */

if (!window.ExportadorEstadoResultados) {
    class ExportadorEstadoResultados {
        
    constructor() {
        this.colores = {
            primario: 'FF667EEA',
            verde: 'FF10B981',
            verdeOscuro: 'FF059669',
            amarillo: 'FFF59E0B',
            rojo: 'FFEF4444',
            rojoOscuro: 'FFDC2626',
            morado: 'FF8B5CF6',
            fondoOscuro: 'FF1F2937',
            fondoClaro: 'FFF9FAFB',
            blanco: 'FFFFFFFF',
            gris: 'FFD1D5DB',
            grisClaro: 'FFE5E7EB',
            grisMedio: 'FF6B7280',
            grisTexto: 'FF9CA3AF',
            negro: 'FF111827'
        };
    }

    async exportar(datos) {
        try {
            console.log('📊 Generando Estado de Resultados en Excel v2.1...');

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'GRIZALUM Sistema Financiero';
            workbook.created = new Date();

            const hoja1 = workbook.addWorksheet('Estado de Resultados', {
                views: [{ showGridLines: false }],
                properties: { tabColor: { argb: '667EEA' } }
            });
            this._crearEstadoResultados(hoja1, datos);

            const hoja2 = workbook.addWorksheet('Análisis Financiero', {
                views: [{ showGridLines: false }],
                properties: { tabColor: { argb: '10B981' } }
            });
            this._crearAnalisis(hoja2, datos);

            const hoja3 = workbook.addWorksheet('Detalle Categorías', {
                views: [{ showGridLines: false }],
                properties: { tabColor: { argb: 'F59E0B' } }
            });
            this._crearDetalleCategorias(hoja3, datos);

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });

            const empresaNombre = (datos.empresa || 'empresa').replace(/[^a-zA-Z0-9]/g, '_');
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GRIZALUM_EstadoResultados_${empresaNombre}_${this._fecha()}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

            console.log('✅ Excel v2.1 generado exitosamente');
            return true;

        } catch (error) {
            console.error('❌ Error exportando:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // HOJA 1: ESTADO DE RESULTADOS
    // ═══════════════════════════════════════════════════════════════

    _crearEstadoResultados(sheet, datos) {
        const r = datos.resultados;
        const ingTotal = r.ingresos.total;

        // ── ANCHOS GENEROSOS ──
        sheet.getColumn(1).width = 42;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 16;
        sheet.getColumn(4).width = 24;
        sheet.getColumn(5).width = 2;

        // ── BARRA SUPERIOR ──
        sheet.mergeCells('A1:E1');
        const h1 = sheet.getCell('A1');
        h1.value = 'GRIZALUM  |  Sistema de Control Financiero';
        h1.font = { name: 'Arial', size: 9, bold: true, color: { argb: this.colores.blanco } };
        h1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.fondoOscuro } };
        h1.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 24;

        // ── TÍTULO ──
        sheet.mergeCells('A2:E2');
        const h2 = sheet.getCell('A2');
        h2.value = 'ESTADO DE RESULTADOS';
        h2.font = { name: 'Arial', size: 18, bold: true, color: { argb: this.colores.blanco } };
        h2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.primario } };
        h2.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(2).height = 45;

        // ── RANGO DE FECHAS ──
        sheet.mergeCells('A3:E3');
        const h3 = sheet.getCell('A3');
        h3.value = this._obtenerRangoTexto(r);
        h3.font = { name: 'Arial', size: 10, italic: true, color: { argb: this.colores.blanco } };
        h3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.primario } };
        h3.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(3).height = 22;

        sheet.getRow(4).height = 6;

        // ── INFO EMPRESA ──
        const info = [
            ['Empresa:', this._capitalizar(datos.empresa)],
            ['Período:', this._nombrePeriodo(r.periodo)],
            ['Moneda:', 'Soles (S/.)'],
            ['Fecha de emisión:', new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })]
        ];
        info.forEach(([label, val], i) => {
            const rn = 5 + i;
            sheet.getCell(rn, 1).value = label;
            sheet.getCell(rn, 1).font = { name: 'Arial', size: 10, bold: true, color: { argb: this.colores.grisMedio } };
            sheet.mergeCells(rn, 2, rn, 4);
            sheet.getCell(rn, 2).value = val;
            sheet.getCell(rn, 2).font = { name: 'Arial', size: 10, color: { argb: this.colores.negro } };
        });

        sheet.getRow(9).height = 10;

        // ── HEADERS TABLA ──
        ['CONCEPTO', 'MONTO (S/.)', '% INGRESOS', 'OBSERVACIÓN'].forEach((h, i) => {
            const cell = sheet.getCell(10, i + 1);
            cell.value = h;
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: this.colores.blanco } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.fondoOscuro } };
            cell.alignment = { horizontal: i === 0 ? 'left' : 'center', vertical: 'middle' };
            cell.border = this._borde();
        });
        sheet.getRow(10).height = 30;

        let row = 11;

        // ══════ INGRESOS ══════
        row = this._seccion(sheet, row, 'INGRESOS OPERACIONALES', this.colores.verde);
        if (r.ingresos.porCategoria.length > 0) {
            r.ingresos.porCategoria.forEach(cat => {
                const pct = ingTotal > 0 ? cat.monto / ingTotal * 100 : 0;
                row = this._fila(sheet, row, cat.categoria, cat.monto, pct, this._obsIngreso(pct));
            });
        } else {
            row = this._filaVacia(sheet, row, 'Sin ingresos registrados en este período');
        }
        row = this._subtotal(sheet, row, 'TOTAL INGRESOS', ingTotal, 100);
        row = this._espacio(sheet, row);

        // ══════ COSTOS ══════
        row = this._seccion(sheet, row, 'COSTOS DE VENTA', this.colores.amarillo);
        if (r.costos && r.costos.total > 0) {
            r.costos.porCategoria.forEach(cat => {
                const pct = ingTotal > 0 ? cat.monto / ingTotal * 100 : 0;
                row = this._fila(sheet, row, cat.categoria, -cat.monto, pct, '');
            });
            row = this._subtotal(sheet, row, 'TOTAL COSTOS', -r.costos.total, ingTotal > 0 ? r.costos.total / ingTotal * 100 : 0);
        } else {
            row = this._filaVacia(sheet, row, 'Sin costos de venta registrados');
            row = this._subtotal(sheet, row, 'TOTAL COSTOS', 0, 0);
        }
        row = this._espacio(sheet, row);

        // ══════ UTILIDAD BRUTA ══════
        const pctB = ingTotal > 0 ? r.utilidadBruta / ingTotal * 100 : 0;
        row = this._totalDestacado(sheet, row, 'UTILIDAD BRUTA', r.utilidadBruta, pctB, this._evalMargen('Bruto', pctB));
        row = this._espacio(sheet, row);

        // ══════ GASTOS OPERATIVOS ══════
        row = this._seccion(sheet, row, 'GASTOS OPERATIVOS', this.colores.rojo);
        if (r.gastosOperativos && r.gastosOperativos.total > 0) {
            r.gastosOperativos.porCategoria.forEach(cat => {
                const pct = ingTotal > 0 ? cat.monto / ingTotal * 100 : 0;
                row = this._fila(sheet, row, cat.categoria, -cat.monto, pct, '');
            });
            row = this._subtotal(sheet, row, 'TOTAL GASTOS OPERATIVOS', -r.gastosOperativos.total, ingTotal > 0 ? r.gastosOperativos.total / ingTotal * 100 : 0);
        } else {
            row = this._filaVacia(sheet, row, 'Sin gastos operativos registrados');
            row = this._subtotal(sheet, row, 'TOTAL GASTOS OPERATIVOS', 0, 0);
        }
        row = this._espacio(sheet, row);

        // ══════ UTILIDAD OPERATIVA ══════
        const pctO = ingTotal > 0 ? r.utilidadOperativa / ingTotal * 100 : 0;
        row = this._totalDestacado(sheet, row, 'UTILIDAD OPERATIVA', r.utilidadOperativa, pctO, this._evalMargen('Operativo', pctO));
        row = this._espacio(sheet, row);

        // ══════ GASTOS FINANCIEROS ══════
        if (r.gastosFinancieros && r.gastosFinancieros.total > 0) {
            row = this._seccion(sheet, row, 'GASTOS FINANCIEROS', this.colores.morado);
            r.gastosFinancieros.porCategoria.forEach(cat => {
                const pct = ingTotal > 0 ? cat.monto / ingTotal * 100 : 0;
                row = this._fila(sheet, row, cat.categoria, -cat.monto, pct, '');
            });
            row = this._subtotal(sheet, row, 'TOTAL GASTOS FINANCIEROS', -r.gastosFinancieros.total, ingTotal > 0 ? r.gastosFinancieros.total / ingTotal * 100 : 0);
            row = this._espacio(sheet, row);
        }

        // ══════ RESULTADO FINAL ══════
        const pctN = ingTotal > 0 ? r.utilidadNeta / ingTotal * 100 : 0;
        row = this._resultadoFinal(sheet, row, r.utilidadNeta, pctN);

        // ── PIE ──
        row += 2;
        sheet.mergeCells(row, 1, row, 5);
        sheet.getCell(row, 1).value = 'Documento generado por GRIZALUM Sistema Financiero';
        sheet.getCell(row, 1).font = { name: 'Arial', size: 8, italic: true, color: { argb: this.colores.grisTexto } };
        sheet.getCell(row, 1).alignment = { horizontal: 'center' };

        sheet.pageSetup = { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1 };
    }

    // ═══════════════════════════════════════════════════════════════
    // HOJA 2: ANÁLISIS FINANCIERO
    // ═══════════════════════════════════════════════════════════════

    _crearAnalisis(sheet, datos) {
        const r = datos.resultados;
        const ing = r.ingresos.total;

        sheet.getColumn(1).width = 32;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 18;
        sheet.getColumn(4).width = 24;
        sheet.getColumn(5).width = 2;

        // Título
        sheet.mergeCells('A1:E1');
        const t1 = sheet.getCell('A1');
        t1.value = 'ANÁLISIS FINANCIERO';
        t1.font = { name: 'Arial', size: 18, bold: true, color: { argb: this.colores.blanco } };
        t1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.primario } };
        t1.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 42;

        sheet.mergeCells('A2:E2');
        const t2 = sheet.getCell('A2');
        t2.value = this._capitalizar(datos.empresa) + '  |  ' + this._obtenerRangoTexto(r);
        t2.font = { name: 'Arial', size: 10, italic: true, color: { argb: this.colores.blanco } };
        t2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.primario } };
        t2.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(2).height = 22;

        // ── RESUMEN ──
        let row = 4;
        sheet.mergeCells(row, 1, row, 4);
        const sec1 = sheet.getCell(row, 1);
        sec1.value = '  RESUMEN EJECUTIVO';
        sec1.font = { name: 'Arial', size: 12, bold: true, color: { argb: this.colores.blanco } };
        sec1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.fondoOscuro } };
        sec1.alignment = { horizontal: 'left', vertical: 'middle' };
        sheet.getRow(row).height = 30;
        row++;

        const lineas = [
            { c: 'Ingresos Totales', m: ing, p: '100%', o: 'Base de cálculo', b: false },
            { c: '(-) Costos de Venta', m: -(r.costos?.total||0), p: this._pct(r.costos?.total,ing), o: '', b: false },
            { c: '= Utilidad Bruta', m: r.utilidadBruta, p: this._pct2(r.utilidadBruta,ing), o: this._evalMargen('Bruto', ing>0?r.utilidadBruta/ing*100:0), b: true },
            { c: '(-) Gastos Operativos', m: -(r.gastosOperativos?.total||0), p: this._pct(r.gastosOperativos?.total,ing), o: '', b: false },
            { c: '= Utilidad Operativa', m: r.utilidadOperativa, p: this._pct2(r.utilidadOperativa,ing), o: this._evalMargen('Operativo', ing>0?r.utilidadOperativa/ing*100:0), b: true },
            { c: '(-) Gastos Financieros', m: -(r.gastosFinancieros?.total||0), p: this._pct(r.gastosFinancieros?.total,ing), o: '', b: false },
            { c: '═ UTILIDAD NETA', m: r.utilidadNeta, p: this._pct2(r.utilidadNeta,ing), o: this._evalMargen('Neto', ing>0?r.utilidadNeta/ing*100:0), b: true, f: true }
        ];

        lineas.forEach(l => {
            sheet.getCell(row, 1).value = '  ' + l.c;
            sheet.getCell(row, 1).font = { name: 'Arial', size: l.f ? 12 : 10, bold: l.b, color: { argb: l.b ? this.colores.negro : this.colores.grisMedio } };
            sheet.getCell(row, 2).value = l.m;
            sheet.getCell(row, 2).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00;"-"';
            sheet.getCell(row, 2).font = { name: 'Arial', size: l.f ? 12 : 10, bold: l.b, color: { argb: l.m >= 0 ? this.colores.verde : this.colores.rojo } };
            sheet.getCell(row, 2).alignment = { horizontal: 'right' };
            sheet.getCell(row, 3).value = l.p;
            sheet.getCell(row, 3).font = { name: 'Arial', size: 10 };
            sheet.getCell(row, 3).alignment = { horizontal: 'center' };
            sheet.getCell(row, 4).value = l.o;
            sheet.getCell(row, 4).font = { name: 'Arial', size: 10 };
            sheet.getCell(row, 4).alignment = { horizontal: 'center' };
            if (l.b) {
                const bg = l.f ? 'FFE0E7FF' : 'FFF3F4F6';
                [1,2,3,4].forEach(c => {
                    sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
                    sheet.getCell(row, c).border = { top: { style: 'thin', color: { argb: this.colores.gris } }, bottom: { style: 'thin', color: { argb: this.colores.gris } } };
                });
            }
            if (l.f) sheet.getRow(row).height = 30;
            row++;
        });

        // ── INDICADORES ──
        row += 2;
        sheet.mergeCells(row, 1, row, 4);
        const sec2 = sheet.getCell(row, 1);
        sec2.value = '  INDICADORES FINANCIEROS';
        sec2.font = { name: 'Arial', size: 12, bold: true, color: { argb: this.colores.blanco } };
        sec2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.fondoOscuro } };
        sec2.alignment = { horizontal: 'left', vertical: 'middle' };
        sheet.getRow(row).height = 30;
        row++;

        ['Indicador', 'Valor', 'Referencia', 'Estado'].forEach((h, i) => {
            const cell = sheet.getCell(row, i + 1);
            cell.value = h;
            cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: this.colores.grisMedio } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = { bottom: { style: 'thin', color: { argb: this.colores.gris } } };
        });
        row++;

        [['Margen Bruto', r.ratios?.margenBruto||0, '> 40% ideal', 'Bruto'],
         ['Margen Operativo', r.ratios?.margenOperativo||0, '> 15% ideal', 'Operativo'],
         ['Margen Neto', r.ratios?.margenNeto||0, '> 10% ideal', 'Neto']
        ].forEach(([n, v, ref, t]) => {
            sheet.getCell(row, 1).value = '  ' + n;
            sheet.getCell(row, 1).font = { name: 'Arial', size: 10 };
            sheet.getCell(row, 2).value = v.toFixed(1) + '%';
            sheet.getCell(row, 2).font = { name: 'Arial', size: 11, bold: true, color: { argb: v > 0 ? this.colores.verde : this.colores.rojo } };
            sheet.getCell(row, 2).alignment = { horizontal: 'center' };
            sheet.getCell(row, 3).value = ref;
            sheet.getCell(row, 3).font = { name: 'Arial', size: 9, color: { argb: this.colores.grisTexto } };
            sheet.getCell(row, 3).alignment = { horizontal: 'center' };
            sheet.getCell(row, 4).value = this._evalMargen(t, v);
            sheet.getCell(row, 4).font = { name: 'Arial', size: 10 };
            sheet.getCell(row, 4).alignment = { horizontal: 'center' };
            [1,2,3,4].forEach(c => { sheet.getCell(row, c).border = { bottom: { style: 'thin', color: { argb: this.colores.grisClaro } } }; });
            row++;
        });

        // ── DIAGNÓSTICO ──
        row += 2;
        sheet.mergeCells(row, 1, row, 4);
        const sec3 = sheet.getCell(row, 1);
        sec3.value = '  DIAGNÓSTICO';
        sec3.font = { name: 'Arial', size: 12, bold: true, color: { argb: this.colores.blanco } };
        sec3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.fondoOscuro } };
        sec3.alignment = { horizontal: 'left', vertical: 'middle' };
        sheet.getRow(row).height = 30;
        row++;

        this._diagnosticos(r, ing).forEach(d => {
            sheet.mergeCells(row, 1, row, 4);
            sheet.getCell(row, 1).value = '  ' + d;
            sheet.getCell(row, 1).font = { name: 'Arial', size: 10 };
            sheet.getCell(row, 1).alignment = { wrapText: true, vertical: 'top' };
            sheet.getRow(row).height = 24;
            row++;
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // HOJA 3: DETALLE POR CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════

    _crearDetalleCategorias(sheet, datos) {
        const r = datos.resultados;

        sheet.getColumn(1).width = 8;
        sheet.getColumn(2).width = 32;
        sheet.getColumn(3).width = 12;
        sheet.getColumn(4).width = 20;
        sheet.getColumn(5).width = 16;
        sheet.getColumn(6).width = 2;

        sheet.mergeCells('A1:F1');
        const t = sheet.getCell('A1');
        t.value = 'DETALLE POR CATEGORÍAS';
        t.font = { name: 'Arial', size: 18, bold: true, color: { argb: this.colores.blanco } };
        t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.amarillo } };
        t.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 42;

        sheet.mergeCells('A2:F2');
        const t2 = sheet.getCell('A2');
        t2.value = this._capitalizar(datos.empresa) + '  |  ' + this._obtenerRangoTexto(r);
        t2.font = { name: 'Arial', size: 10, italic: true, color: { argb: this.colores.blanco } };
        t2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.amarillo } };
        t2.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(2).height = 22;

        let row = 4;

        const addSec = (titulo, cats, color, esIng) => {
            sheet.mergeCells(row, 1, row, 6);
            const s = sheet.getCell(row, 1);
            s.value = '  ' + titulo;
            s.font = { name: 'Arial', size: 11, bold: true, color: { argb: this.colores.blanco } };
            s.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
            s.alignment = { horizontal: 'left', vertical: 'middle' };
            sheet.getRow(row).height = 28;
            row++;

            ['#', 'Categoría', 'Cantidad', 'Monto (S/.)', '% del Total'].forEach((h, i) => {
                const cell = sheet.getCell(row, i + 1);
                cell.value = h;
                cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: this.colores.grisMedio } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
                cell.alignment = { horizontal: 'center' };
                cell.border = { bottom: { style: 'thin', color: { argb: this.colores.gris } } };
            });
            row++;

            if (cats && cats.length > 0) {
                const tot = cats.reduce((s, c) => s + c.monto, 0);
                [...cats].sort((a, b) => b.monto - a.monto).forEach((cat, idx) => {
                    sheet.getCell(row, 1).value = idx + 1;
                    sheet.getCell(row, 1).font = { name: 'Arial', size: 9, color: { argb: this.colores.grisTexto } };
                    sheet.getCell(row, 1).alignment = { horizontal: 'center' };
                    sheet.getCell(row, 2).value = cat.categoria;
                    sheet.getCell(row, 2).font = { name: 'Arial', size: 10 };
                    sheet.getCell(row, 3).value = cat.cantidad || '-';
                    sheet.getCell(row, 3).font = { name: 'Arial', size: 10 };
                    sheet.getCell(row, 3).alignment = { horizontal: 'center' };
                    sheet.getCell(row, 4).value = esIng ? cat.monto : -cat.monto;
                    sheet.getCell(row, 4).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00;"-"';
                    sheet.getCell(row, 4).font = { name: 'Arial', size: 10, color: { argb: esIng ? this.colores.verde : this.colores.rojo } };
                    sheet.getCell(row, 4).alignment = { horizontal: 'right' };
                    sheet.getCell(row, 5).value = tot > 0 ? (cat.monto / tot * 100).toFixed(1) + '%' : '0%';
                    sheet.getCell(row, 5).font = { name: 'Arial', size: 10 };
                    sheet.getCell(row, 5).alignment = { horizontal: 'center' };
                    if (idx % 2 === 0) [1,2,3,4,5].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.fondoClaro } }; });
                    [1,2,3,4,5].forEach(c => { sheet.getCell(row, c).border = { bottom: { style: 'thin', color: { argb: this.colores.grisClaro } } }; });
                    row++;
                });
            } else {
                sheet.mergeCells(row, 1, row, 5);
                sheet.getCell(row, 1).value = '  Sin registros en este período';
                sheet.getCell(row, 1).font = { name: 'Arial', size: 10, italic: true, color: { argb: this.colores.grisTexto } };
                row++;
            }
            row++;
        };

        addSec('INGRESOS', r.ingresos.porCategoria, this.colores.verde, true);
        if (r.costos) addSec('COSTOS DE VENTA', r.costos.porCategoria, this.colores.amarillo, false);
        if (r.gastosOperativos) addSec('GASTOS OPERATIVOS', r.gastosOperativos.porCategoria, this.colores.rojo, false);
        if (r.gastosFinancieros?.porCategoria?.length > 0) addSec('GASTOS FINANCIEROS', r.gastosFinancieros.porCategoria, this.colores.morado, false);
    }

    // ═══════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════

    _seccion(sheet, row, titulo, color) {
        sheet.mergeCells(row, 1, row, 5);
        const c = sheet.getCell(row, 1);
        c.value = '  ' + titulo;
        c.font = { name: 'Arial', bold: true, size: 11, color: { argb: this.colores.blanco } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
        c.alignment = { horizontal: 'left', vertical: 'middle' };
        sheet.getRow(row).height = 28;
        return row + 1;
    }

    _fila(sheet, row, concepto, monto, pct, obs) {
        sheet.getCell(row, 1).value = '      ' + concepto;
        sheet.getCell(row, 1).font = { name: 'Arial', size: 10, color: { argb: this.colores.negro } };
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00;"-"';
        sheet.getCell(row, 2).font = { name: 'Arial', size: 10, color: { argb: monto < 0 ? this.colores.rojo : this.colores.verde } };
        sheet.getCell(row, 2).alignment = { horizontal: 'right' };
        sheet.getCell(row, 3).value = pct.toFixed(1) + '%';
        sheet.getCell(row, 3).font = { name: 'Arial', size: 10 };
        sheet.getCell(row, 3).alignment = { horizontal: 'center' };
        sheet.getCell(row, 4).value = obs || '';
        sheet.getCell(row, 4).font = { name: 'Arial', size: 9, italic: true, color: { argb: this.colores.grisMedio } };
        sheet.getCell(row, 4).alignment = { horizontal: 'center' };
        [1,2,3,4].forEach(c => { sheet.getCell(row, c).border = { bottom: { style: 'thin', color: { argb: this.colores.grisClaro } } }; });
        if (row % 2 === 0) [1,2,3,4].forEach(c => { sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.fondoClaro } }; });
        return row + 1;
    }

    _filaVacia(sheet, row, texto) {
        sheet.mergeCells(row, 1, row, 4);
        sheet.getCell(row, 1).value = '      ' + texto;
        sheet.getCell(row, 1).font = { name: 'Arial', size: 10, italic: true, color: { argb: this.colores.grisTexto } };
        return row + 1;
    }

    _subtotal(sheet, row, concepto, monto, pct) {
        sheet.getCell(row, 1).value = '  ' + concepto;
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00;"-"';
        sheet.getCell(row, 3).value = (typeof pct === 'number' ? pct.toFixed(1) : pct) + '%';
        [1,2,3,4].forEach(c => {
            const cell = sheet.getCell(row, c);
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: this.colores.negro } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: this.colores.grisClaro } };
            cell.border = { top: { style: 'thin', color: { argb: this.colores.gris } }, bottom: { style: 'thin', color: { argb: this.colores.gris } } };
            if (c === 2) cell.alignment = { horizontal: 'right' };
            if (c === 3) cell.alignment = { horizontal: 'center' };
        });
        sheet.getRow(row).height = 26;
        return row + 1;
    }

    _totalDestacado(sheet, row, concepto, monto, pct, eval_) {
        sheet.getCell(row, 1).value = concepto;
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00;"-"';
        sheet.getCell(row, 3).value = pct.toFixed(1) + '%';
        sheet.getCell(row, 4).value = eval_;
        const bg = monto >= 0 ? this.colores.primario : this.colores.rojo;
        [1,2,3,4].forEach(c => {
            const cell = sheet.getCell(row, c);
            cell.font = { name: 'Arial', bold: true, size: 11, color: { argb: this.colores.blanco } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
            cell.border = this._borde();
            if (c === 2) cell.alignment = { horizontal: 'right', vertical: 'middle' };
            if (c >= 3) cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        sheet.getRow(row).height = 32;
        return row + 1;
    }

    _resultadoFinal(sheet, row, utilNeta, pctNeta) {
        const pos = utilNeta >= 0;
        const bg = pos ? this.colores.verdeOscuro : this.colores.rojoOscuro;
        sheet.getCell(row, 1).value = 'RESULTADO DEL PERÍODO';
        sheet.getCell(row, 2).value = utilNeta;
        sheet.getCell(row, 2).numFmt = '"S/." #,##0.00;[Red]"S/." -#,##0.00;"-"';
        sheet.getCell(row, 3).value = pctNeta.toFixed(1) + '%';
        sheet.getCell(row, 4).value = pos ? 'UTILIDAD' : 'PÉRDIDA';
        [1,2,3,4].forEach(c => {
            const cell = sheet.getCell(row, c);
            cell.font = { name: 'Arial', bold: true, size: 14, color: { argb: this.colores.blanco } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
            cell.border = { top: { style: 'medium', color: { argb: 'FF000000' } }, bottom: { style: 'medium', color: { argb: 'FF000000' } }, left: { style: 'medium', color: { argb: 'FF000000' } }, right: { style: 'medium', color: { argb: 'FF000000' } } };
            if (c === 1) cell.alignment = { horizontal: 'left', vertical: 'middle' };
            if (c === 2) cell.alignment = { horizontal: 'right', vertical: 'middle' };
            if (c >= 3) cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        sheet.getRow(row).height = 40;
        return row + 1;
    }

    _espacio(sheet, row) { sheet.getRow(row).height = 6; return row + 1; }

    _borde() {
        return { top: { style: 'thin', color: { argb: this.colores.gris } }, bottom: { style: 'thin', color: { argb: this.colores.gris } }, left: { style: 'thin', color: { argb: this.colores.gris } }, right: { style: 'thin', color: { argb: this.colores.gris } } };
    }

    _obtenerRangoTexto(r) {
        if (r.rango?.inicio && r.rango?.fin) {
            const o = { year: 'numeric', month: 'long', day: 'numeric' };
            try { return 'Del ' + new Date(r.rango.inicio).toLocaleDateString('es-PE', o) + ' al ' + new Date(r.rango.fin).toLocaleDateString('es-PE', o); } catch(e) {}
        }
        return 'Período: ' + (r.periodo || 'N/A');
    }

    _nombrePeriodo(p) { return { hoy:'Hoy', semana:'Semana Actual', mes:'Mes Actual', trimestre:'Trimestre Actual', anio:'Año Actual', personalizado:'Personalizado' }[p] || p || 'N/A'; }
    _capitalizar(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'N/A'; }
    _pct(v, t) { return t > 0 ? (-Math.abs(v||0) / t * 100).toFixed(1) + '%' : '0%'; }
    _pct2(v, t) { return t > 0 ? (v / t * 100).toFixed(1) + '%' : '0%'; }
    _obsIngreso(p) { return p >= 50 ? 'Fuente principal' : p >= 25 ? 'Significativo' : p >= 10 ? 'Secundario' : ''; }
    _evalMargen(t, v) {
        if (t==='Bruto') return v>40?'● Excelente':v>20?'● Aceptable':v>0?'● Bajo':'● Crítico';
        if (t==='Operativo') return v>15?'● Excelente':v>5?'● Aceptable':v>0?'● Bajo':'● Negativo';
        if (t==='Neto') return v>10?'● Excelente':v>0?'● Aceptable':'● Pérdida';
        return '';
    }
    _diagnosticos(r, ing) {
        const d = [];
        if (!ing) { d.push('⚠ No se registraron ingresos en este período.'); d.push('→ Revise que las transacciones estén categorizadas en Flujo de Caja.'); return d; }
        const mb = r.ratios?.margenBruto||0;
        d.push(mb>40 ? '✓ Margen bruto saludable ('+mb.toFixed(1)+'%).' : '⚠ Margen bruto bajo ('+mb.toFixed(1)+'%). Renegociar costos.');
        const pg = ing>0 ? (r.gastosOperativos?.total||0)/ing*100 : 0;
        d.push(pg>30 ? '⚠ Gastos operativos altos ('+pg.toFixed(1)+'%). Optimizar.' : '✓ Gastos operativos razonables ('+pg.toFixed(1)+'%).');
        d.push(r.utilidadNeta>0 ? '✓ Cierra con utilidad: S/. '+r.utilidadNeta.toFixed(2) : r.utilidadNeta<0 ? '✗ Cierra con pérdida: S/. '+Math.abs(r.utilidadNeta).toFixed(2) : '→ Punto de equilibrio.');
        return d;
    }
    _fecha() { const h=new Date(); return h.getFullYear()+'-'+String(h.getMonth()+1).padStart(2,'0')+'-'+String(h.getDate()).padStart(2,'0'); }
}
    
    window.ExportadorEstadoResultados = ExportadorEstadoResultados;
}

console.log('✅ Exportador Estado de Resultados v2.1 cargado');
