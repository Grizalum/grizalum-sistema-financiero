/**
 * ═══════════════════════════════════════════════════════════════════
 * BALANCE GENERAL - EXPORTADOR
 * Genera el archivo Excel profesional del Balance General
 * Depende de: balance-general-config.js, ExcelJS
 * v20260417
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    window.BalanceGeneralExportador = {

        // ─── Exportar a Excel ─────────────────────────────────────────
        async exportar(resultados) {
            if (!resultados) {
                alert('No hay datos para exportar. Selecciona un período con transacciones.');
                return;
            }

            if (typeof ExcelJS === 'undefined') {
                alert('ExcelJS no está disponible. Recarga la página e intenta de nuevo.');
                return;
            }

            try {
                const wb    = new ExcelJS.Workbook();
                wb.creator  = 'GRIZALUM Sistema Financiero';
                wb.created  = new Date();

                const sheet = wb.addWorksheet('Balance General', {
                    views: [{ showGridLines: false }]
                });

                // Anchos de columnas
                sheet.getColumn(1).width = 42;
                sheet.getColumn(2).width = 22;

                // ── Título principal ──
                sheet.mergeCells('A1:B1');
                const titulo = sheet.getCell('A1');
                titulo.value     = 'BALANCE GENERAL — GRIZALUM';
                titulo.font      = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
                titulo.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
                titulo.alignment = { horizontal: 'center', vertical: 'middle' };
                sheet.getRow(1).height = 42;

                // ── Info empresa y fecha ──
                const empresa = (window.BalanceGeneralCalculos?.obtenerEmpresa() || 'N/A');
                this._celda(sheet, 'A3', 'Empresa:', true);
                this._celda(sheet, 'B3', empresa.charAt(0).toUpperCase() + empresa.slice(1));
                this._celda(sheet, 'A4', 'Fecha:', true);
                this._celda(sheet, 'B4', new Date().toLocaleDateString('es-PE', {
                    year: 'numeric', month: 'long', day: 'numeric'
                }));
                this._celda(sheet, 'A5', 'Período:', true);
                this._celda(sheet, 'B5', window.BalanceGeneralConfig?.nombresPeriodos?.[resultados.periodo] || resultados.periodo);

                let fila = 7;
                const r  = resultados;

                // ── Secciones ──
                fila = this._seccion(sheet, fila, 'ACTIVOS CORRIENTES',    r.activos.corrientes.items,   r.activos.corrientes.total,   'FF10B981');
                fila = this._seccion(sheet, fila, 'ACTIVOS NO CORRIENTES', r.activos.noCorrientes.items, r.activos.noCorrientes.total, 'FF059669');
                fila = this._totalGrande(sheet, fila, 'TOTAL ACTIVOS', r.activos.total, 'FF10B981');

                fila++;
                fila = this._seccion(sheet, fila, 'PASIVOS CORRIENTES',    r.pasivos.corrientes.items,   r.pasivos.corrientes.total,   'FFEF4444');
                fila = this._seccion(sheet, fila, 'PASIVOS NO CORRIENTES', r.pasivos.noCorrientes.items, r.pasivos.noCorrientes.total, 'FFDC2626');
                fila = this._totalGrande(sheet, fila, 'TOTAL PASIVOS', r.pasivos.total, 'FFEF4444');

                fila++;
                fila = this._seccion(sheet, fila, 'PATRIMONIO NETO', r.patrimonio.detalle.items, r.patrimonio.total, 'FF667EEA');
                fila = this._totalGrande(sheet, fila, 'TOTAL PASIVOS + PATRIMONIO', r.pasivos.total + r.patrimonio.total, 'FF667EEA');

                // ── Indicadores ──
                fila += 2;
                sheet.mergeCells(fila, 1, fila, 2);
                const kpiTitulo = sheet.getCell(fila, 1);
                kpiTitulo.value     = 'INDICADORES FINANCIEROS';
                kpiTitulo.font      = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
                kpiTitulo.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
                kpiTitulo.alignment = { horizontal: 'left', vertical: 'middle' };
                sheet.getRow(fila).height = 26;
                fila++;

                const rat = r.ratios;
                const kpis = [
                    ['Liquidez Corriente',  rat.liquidez >= 99 ? '∞' : rat.liquidez.toFixed(2),           'Ideal: mayor a 1.5'],
                    ['Endeudamiento',       rat.endeudamiento.toFixed(1) + '%',                            'Ideal: menor a 60%'],
                    ['Solvencia',           rat.solvencia >= 99 ? '∞' : rat.solvencia.toFixed(2),          'Ideal: mayor a 1.0'],
                    ['Capital de Trabajo',  'S/ ' + rat.capitalTrabajo.toLocaleString('es-PE', { minimumFractionDigits: 2 }), 'Ideal: positivo']
                ];

                kpis.forEach(([label, valor, nota]) => {
                    sheet.getCell(fila, 1).value = '  ' + label;
                    sheet.getCell(fila, 1).font  = { name: 'Arial', size: 10 };
                    sheet.getCell(fila, 2).value = valor + '  (' + nota + ')';
                    sheet.getCell(fila, 2).font  = { name: 'Arial', size: 10, bold: true };
                    sheet.getCell(fila, 2).alignment = { horizontal: 'right' };
                    fila++;
                });

                // ── Generar y descargar ──
                const buffer = await wb.xlsx.writeBuffer();
                const blob   = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url    = URL.createObjectURL(blob);
                const a      = document.createElement('a');
                const fecha  = new Date().toISOString().split('T')[0];
                const emp    = window.BalanceGeneralCalculos?.obtenerEmpresa() || 'empresa';
                a.href       = url;
                a.download   = `GRIZALUM_BalanceGeneral_${emp}_${fecha}.xlsx`;
                a.click();
                URL.revokeObjectURL(url);

                console.log('✅ [BG-Exportador] Excel generado correctamente');

            } catch (e) {
                console.error('❌ [BG-Exportador] Error:', e);
                alert('Error al exportar: ' + e.message);
            }
        },

        // ─── Helper: celda simple ─────────────────────────────────────
        _celda(sheet, ref, valor, negrita) {
            const c  = sheet.getCell(ref);
            c.value  = valor;
            c.font   = { name: 'Arial', size: 10, bold: !!negrita };
        },

        // ─── Helper: sección con items ────────────────────────────────
        _seccion(sheet, fila, titulo, items, total, colorHex) {
            // Encabezado de sección
            sheet.mergeCells(fila, 1, fila, 2);
            const enc  = sheet.getCell(fila, 1);
            enc.value  = titulo;
            enc.font   = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
            enc.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorHex } };
            enc.alignment = { horizontal: 'left', vertical: 'middle' };
            sheet.getRow(fila).height = 26;
            fila++;

            // Items
            items.forEach(item => {
                sheet.getCell(fila, 1).value = '    ' + item.nombre;
                sheet.getCell(fila, 1).font  = { name: 'Arial', size: 10 };
                sheet.getCell(fila, 2).value = item.valor;
                sheet.getCell(fila, 2).numFmt     = '"S/." #,##0.00;[Red]"S/." -#,##0.00';
                sheet.getCell(fila, 2).alignment  = { horizontal: 'right' };
                fila++;
            });

            // Subtotal
            sheet.getCell(fila, 1).value = '  TOTAL';
            sheet.getCell(fila, 1).font  = { name: 'Arial', size: 10, bold: true };
            sheet.getCell(fila, 2).value = total;
            sheet.getCell(fila, 2).numFmt    = '"S/." #,##0.00';
            sheet.getCell(fila, 2).font      = { name: 'Arial', size: 10, bold: true };
            sheet.getCell(fila, 2).alignment = { horizontal: 'right' };
            [1, 2].forEach(c => {
                sheet.getCell(fila, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
            });
            fila += 2;
            return fila;
        },

        // ─── Helper: fila de total grande ─────────────────────────────
        _totalGrande(sheet, fila, label, valor, colorHex) {
            [1, 2].forEach(c => {
                sheet.getCell(fila, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorHex } };
            });
            sheet.getCell(fila, 1).value = label;
            sheet.getCell(fila, 1).font  = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
            sheet.getCell(fila, 2).value = valor;
            sheet.getCell(fila, 2).numFmt    = '"S/." #,##0.00';
            sheet.getCell(fila, 2).font      = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
            sheet.getCell(fila, 2).alignment = { horizontal: 'right' };
            sheet.getRow(fila).height = 30;
            return fila + 1;
        }
    };

    console.log('✅ [BG-Exportador] Cargado');

})();
