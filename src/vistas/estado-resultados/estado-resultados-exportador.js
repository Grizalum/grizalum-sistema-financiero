/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTADOR EXCEL PROFESIONAL - ESTADO DE RESULTADOS
 * Genera reportes financieros en Excel con formato profesional
 * ═══════════════════════════════════════════════════════════════════
 */

class ExportadorEstadoResultados {
    constructor() {
        this.colores = {
            primario: '667EEA',
            verde: '10B981',
            amarillo: 'F59E0B',
            rojo: 'EF4444',
            morado: '8B5CF6',
            fondoOscuro: '1F2937',
            blanco: 'FFFFFF',
            gris: 'D1D5DB'
        };
    }

    async exportar(datos) {
        try {
            console.log('📊 Generando Estado de Resultados en Excel...');

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'GRIZALUM Sistema Financiero';
            workbook.created = new Date();

            // Hoja 1: Estado de Resultados
            const hoja1 = workbook.addWorksheet('📊 Estado de Resultados', {
                views: [{ showGridLines: false }]
            });
            this._crearEstadoResultados(hoja1, datos);

            // Hoja 2: Análisis
            const hoja2 = workbook.addWorksheet('📈 Análisis', {
                views: [{ showGridLines: false }]
            });
            this._crearAnalisis(hoja2, datos);

            // Generar archivo
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GRIZALUM_EstadoResultados_${datos.empresa}_${this._fecha()}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

            console.log('✅ Excel generado exitosamente');
            return true;

        } catch (error) {
            console.error('❌ Error exportando:', error);
            throw error;
        }
    }

    _crearEstadoResultados(sheet, datos) {
        const resultados = datos.resultados;
        const ingresosTotales = resultados.ingresos.total;

        // TÍTULO
        sheet.mergeCells('A1:D1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'ESTADO DE RESULTADOS';
        titulo.font = { name: 'Inter', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 40;

        // INFORMACIÓN
        sheet.getCell('A3').value = 'Empresa:';
        sheet.getCell('B3').value = datos.empresa || 'N/A';
        sheet.getCell('A4').value = 'Período:';
        sheet.getCell('B4').value = resultados.periodo;
        sheet.getCell('A5').value = 'Fecha:';
        sheet.getCell('B5').value = new Date().toLocaleDateString('es-PE');

        // HEADERS
        const headers = ['CONCEPTO', 'MONTO (S/.)', '% INGRESOS', 'ANÁLISIS'];
        let row = 7;
        headers.forEach((header, i) => {
            const cell = sheet.getCell(row, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = this._bordes();
        });
        row++;

        // INGRESOS
        row = this._crearSeccion(sheet, row, 'INGRESOS OPERACIONALES', 'FF10B981');
        resultados.ingresos.porCategoria.forEach(cat => {
            const pct = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100).toFixed(1) : 0;
            row = this._crearFila(sheet, row, cat.categoria, cat.monto, pct, true);
        });
        row = this._crearSubtotal(sheet, row, 'TOTAL INGRESOS', resultados.ingresos.total, 100);
        row++;

        // COSTOS
        if (resultados.costos.total > 0) {
            row = this._crearSeccion(sheet, row, 'COSTOS DE VENTA', 'FFF59E0B');
            resultados.costos.porCategoria.forEach(cat => {
                const pct = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100).toFixed(1) : 0;
                row = this._crearFila(sheet, row, cat.categoria, -cat.monto, pct, false);
            });
            row = this._crearSubtotal(sheet, row, 'TOTAL COSTOS', -resultados.costos.total, 
                ingresosTotales > 0 ? (resultados.costos.total / ingresosTotales * 100).toFixed(1) : 0);
            row++;
        }

        // UTILIDAD BRUTA
        const pctBruta = ingresosTotales > 0 ? (resultados.utilidadBruta / ingresosTotales * 100).toFixed(1) : 0;
        row = this._crearTotal(sheet, row, 'UTILIDAD BRUTA', resultados.utilidadBruta, pctBruta);
        row++;

        // GASTOS OPERATIVOS
        if (resultados.gastosOperativos.total > 0) {
            row = this._crearSeccion(sheet, row, 'GASTOS OPERATIVOS', 'FFEF4444');
            resultados.gastosOperativos.porCategoria.forEach(cat => {
                const pct = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100).toFixed(1) : 0;
                row = this._crearFila(sheet, row, cat.categoria, -cat.monto, pct, false);
            });
            row = this._crearSubtotal(sheet, row, 'TOTAL GASTOS OPERATIVOS', -resultados.gastosOperativos.total,
                ingresosTotales > 0 ? (resultados.gastosOperativos.total / ingresosTotales * 100).toFixed(1) : 0);
            row++;
        }

        // UTILIDAD OPERATIVA
        const pctOperativa = ingresosTotales > 0 ? (resultados.utilidadOperativa / ingresosTotales * 100).toFixed(1) : 0;
        row = this._crearTotal(sheet, row, 'UTILIDAD OPERATIVA', resultados.utilidadOperativa, pctOperativa);
        row++;

        // GASTOS FINANCIEROS
        if (resultados.gastosFinancieros.total > 0) {
            row = this._crearSeccion(sheet, row, 'GASTOS FINANCIEROS', 'FF8B5CF6');
            resultados.gastosFinancieros.porCategoria.forEach(cat => {
                const pct = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100).toFixed(1) : 0;
                row = this._crearFila(sheet, row, cat.categoria, -cat.monto, pct, false);
            });
            row = this._crearSubtotal(sheet, row, 'TOTAL GASTOS FINANCIEROS', -resultados.gastosFinancieros.total,
                ingresosTotales > 0 ? (resultados.gastosFinancieros.total / ingresosTotales * 100).toFixed(1) : 0);
            row++;
        }

        // UTILIDAD NETA
        const pctNeta = ingresosTotales > 0 ? (resultados.utilidadNeta / ingresosTotales * 100).toFixed(1) : 0;
        row = this._crearTotal(sheet, row, 'UTILIDAD NETA', resultados.utilidadNeta, pctNeta, true);

        // Anchos de columna
        sheet.getColumn(1).width = 35;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 25;
    }

    _crearSeccion(sheet, row, titulo, color) {
        sheet.mergeCells(row, 1, row, 4);
        const cell = sheet.getCell(row, 1);
        cell.value = titulo;
        cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.border = this._bordes();
        sheet.getRow(row).height = 25;
        return row + 1;
    }

    _crearFila(sheet, row, concepto, monto, porcentaje, esIngreso = false) {
        sheet.getCell(row, 1).value = '    ' + concepto;
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
        sheet.getCell(row, 3).value = porcentaje + '%';
        sheet.getCell(row, 4).value = esIngreso ? '📈 Ingreso' : '📉 Egreso';

        [1, 2, 3, 4].forEach(col => {
            const cell = sheet.getCell(row, col);
            cell.border = this._bordes();
            if (col === 2) {
                cell.alignment = { horizontal: 'right' };
                cell.font = { color: { argb: monto < 0 ? 'FFEF4444' : 'FF10B981' } };
            }
        });

        return row + 1;
    }

    _crearSubtotal(sheet, row, concepto, monto, porcentaje) {
        sheet.getCell(row, 1).value = concepto;
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
        sheet.getCell(row, 3).value = porcentaje + '%';

        [1, 2, 3, 4].forEach(col => {
            const cell = sheet.getCell(row, col);
            cell.font = { bold: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
            cell.border = this._bordes();
            if (col === 2) {
                cell.alignment = { horizontal: 'right' };
            }
        });

        return row + 1;
    }

    _crearTotal(sheet, row, concepto, monto, porcentaje, esFinal = false) {
        sheet.getCell(row, 1).value = concepto;
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
        sheet.getCell(row, 3).value = porcentaje + '%';

        const colorFondo = esFinal ? 'FF8B5CF6' : 'FF667EEA';

        [1, 2, 3, 4].forEach(col => {
            const cell = sheet.getCell(row, col);
            cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorFondo } };
            cell.border = this._bordes();
            if (col === 2) {
                cell.alignment = { horizontal: 'right' };
            }
        });

        sheet.getRow(row).height = 30;

        return row + 1;
    }

    _crearAnalisis(sheet, datos) {
        const resultados = datos.resultados;

        // TÍTULO
        sheet.mergeCells('A1:C1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'ANÁLISIS FINANCIERO';
        titulo.font = { name: 'Inter', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 40;

        // RATIOS
        sheet.getCell('A3').value = 'RATIOS FINANCIEROS';
        sheet.getCell('A3').font = { bold: true, size: 12 };
        sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        const headers = ['Ratio', 'Valor', 'Evaluación'];
        headers.forEach((h, i) => {
            const cell = sheet.getCell(4, i + 1);
            cell.value = h;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = this._bordes();
        });

        // Margen Bruto
        this._agregarRatio(sheet, 5, 'Margen Bruto', resultados.ratios.margenBruto);
        this._agregarRatio(sheet, 6, 'Margen Operativo', resultados.ratios.margenOperativo);
        this._agregarRatio(sheet, 7, 'Margen Neto', resultados.ratios.margenNeto);

        // RESUMEN
        sheet.getCell('A9').value = 'RESUMEN EJECUTIVO';
        sheet.getCell('A9').font = { bold: true, size: 12 };
        sheet.getCell('A9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        sheet.getCell('A10').value = 'Ingresos Totales:';
        sheet.getCell('B10').value = resultados.ingresos.total;
        sheet.getCell('B10').numFmt = '"S/. "#,##0.00';

        sheet.getCell('A11').value = 'Utilidad Bruta:';
        sheet.getCell('B11').value = resultados.utilidadBruta;
        sheet.getCell('B11').numFmt = '"S/. "#,##0.00';

        sheet.getCell('A12').value = 'Utilidad Operativa:';
        sheet.getCell('B12').value = resultados.utilidadOperativa;
        sheet.getCell('B12').numFmt = '"S/. "#,##0.00';

        sheet.getCell('A13').value = 'Utilidad Neta:';
        sheet.getCell('B13').value = resultados.utilidadNeta;
        sheet.getCell('B13').numFmt = '"S/. "#,##0.00';
        sheet.getCell('B13').font = { bold: true, color: { argb: resultados.utilidadNeta >= 0 ? 'FF10B981' : 'FFEF4444' } };

        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 25;
    }

    _agregarRatio(sheet, row, nombre, valor) {
        sheet.getCell(row, 1).value = nombre;
        sheet.getCell(row, 2).value = `${valor.toFixed(1)}%`;
        sheet.getCell(row, 3).value = this._evaluarRatio(nombre, valor);

        [1, 2, 3].forEach(col => {
            const cell = sheet.getCell(row, col);
            cell.border = this._bordes();
            if (col === 2) {
                cell.alignment = { horizontal: 'right' };
            }
        });
    }

    _evaluarRatio(nombre, valor) {
        if (nombre.includes('Bruto')) {
            return valor > 40 ? '🟢 Excelente' : valor > 20 ? '🟡 Aceptable' : '🔴 Bajo';
        } else if (nombre.includes('Operativo')) {
            return valor > 15 ? '🟢 Excelente' : valor > 5 ? '🟡 Aceptable' : '🔴 Bajo';
        } else if (nombre.includes('Neto')) {
            return valor > 10 ? '🟢 Excelente' : valor > 0 ? '🟡 Aceptable' : '🔴 Pérdida';
        }
        return '';
    }

    _bordes() {
        return {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
        };
    }

    _fecha() {
        const hoy = new Date();
        return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    }
}

window.ExportadorEstadoResultados = ExportadorEstadoResultados;
console.log('✅ Exportador Estado de Resultados cargado');
