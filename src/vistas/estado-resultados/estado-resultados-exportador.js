/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTADOR EXCEL PROFESIONAL - ESTADO DE RESULTADOS v2.0
 * Genera reportes financieros en Excel con formato profesional
 * GRIZALUM Sistema Financiero
 * ═══════════════════════════════════════════════════════════════════
 */

if (!window.ExportadorEstadoResultados) {
    class ExportadorEstadoResultados {
        
    constructor() {
        this.colores = {
            primario: '667EEA',
            verde: '10B981',
            verdeOscuro: '059669',
            amarillo: 'F59E0B',
            rojo: 'EF4444',
            morado: '8B5CF6',
            fondoOscuro: '1F2937',
            fondoClaro: 'F9FAFB',
            blanco: 'FFFFFF',
            gris: 'D1D5DB',
            grisClaro: 'E5E7EB',
            grisMedio: '6B7280',
            negro: '111827'
        };
    }

    async exportar(datos) {
        try {
            console.log('📊 Generando Estado de Resultados en Excel v2.0...');

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'GRIZALUM Sistema Financiero';
            workbook.created = new Date();

            // Hoja 1: Estado de Resultados
            const hoja1 = workbook.addWorksheet('Estado de Resultados', {
                views: [{ showGridLines: false }],
                properties: { tabColor: { argb: 'FF667EEA' } }
            });
            this._crearEstadoResultados(hoja1, datos);

            // Hoja 2: Análisis Financiero
            const hoja2 = workbook.addWorksheet('Análisis Financiero', {
                views: [{ showGridLines: false }],
                properties: { tabColor: { argb: 'FF10B981' } }
            });
            this._crearAnalisis(hoja2, datos);

            // Hoja 3: Detalle por Categorías
            const hoja3 = workbook.addWorksheet('Detalle Categorías', {
                views: [{ showGridLines: false }],
                properties: { tabColor: { argb: 'FFF59E0B' } }
            });
            this._crearDetalleCategorias(hoja3, datos);

            // Generar archivo
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

            console.log('✅ Excel generado exitosamente');
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
        const resultados = datos.resultados;
        const ingresosTotales = resultados.ingresos.total;

        // Anchos de columna
        sheet.getColumn(1).width = 40;
        sheet.getColumn(2).width = 22;
        sheet.getColumn(3).width = 16;
        sheet.getColumn(4).width = 28;

        // ── ENCABEZADO EMPRESA ──
        sheet.mergeCells('A1:D1');
        const headerEmpresa = sheet.getCell('A1');
        headerEmpresa.value = 'GRIZALUM';
        headerEmpresa.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        headerEmpresa.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
        headerEmpresa.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 25;

        // ── TÍTULO ──
        sheet.mergeCells('A2:D2');
        const titulo = sheet.getCell('A2');
        titulo.value = 'ESTADO DE RESULTADOS';
        titulo.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(2).height = 38;

        // ── SUBTÍTULO CON PERÍODO ──
        sheet.mergeCells('A3:D3');
        const subtitulo = sheet.getCell('A3');
        const rangoTexto = this._obtenerRangoTexto(resultados);
        subtitulo.value = rangoTexto;
        subtitulo.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FFFFFFFF' } };
        subtitulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        subtitulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(3).height = 22;

        // ── INFORMACIÓN DE LA EMPRESA ──
        let row = 5;
        const infoLabels = [
            ['Empresa:', (datos.empresa || 'N/A').charAt(0).toUpperCase() + (datos.empresa || 'N/A').slice(1)],
            ['Período:', this._nombrePeriodo(resultados.periodo)],
            ['Moneda:', 'Soles (S/.)'],
            ['Fecha de emisión:', new Date().toLocaleDateString('es-PE', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            })]
        ];

        infoLabels.forEach(([label, valor]) => {
            const cellLabel = sheet.getCell(row, 1);
            cellLabel.value = label;
            cellLabel.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF6B7280' } };
            
            const cellValor = sheet.getCell(row, 2);
            cellValor.value = valor;
            cellValor.font = { name: 'Arial', size: 10, color: { argb: 'FF111827' } };
            row++;
        });

        row++; // Espacio

        // ── HEADERS DE TABLA ──
        const headers = ['CONCEPTO', 'MONTO (S/.)', '% INGRESOS', 'OBSERVACIÓN'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(row, i + 1);
            cell.value = header;
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: i === 0 ? 'left' : 'center', vertical: 'middle' };
            cell.border = this._bordes();
        });
        sheet.getRow(row).height = 28;
        row++;

        // ── INGRESOS OPERACIONALES ──
        row = this._crearSeccion(sheet, row, 'INGRESOS OPERACIONALES', 'FF10B981');
        
        if (resultados.ingresos.porCategoria.length > 0) {
            resultados.ingresos.porCategoria.forEach(cat => {
                const pct = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100) : 0;
                const obs = this._observacionIngreso(cat.categoria, pct);
                row = this._crearFila(sheet, row, cat.categoria, cat.monto, pct, obs, true);
            });
        } else {
            row = this._crearFilaVacia(sheet, row, 'Sin ingresos registrados');
        }
        row = this._crearSubtotal(sheet, row, 'TOTAL INGRESOS', resultados.ingresos.total, 100);
        row = this._crearEspacioSeparador(sheet, row);

        // ── COSTOS DE VENTA ──
        row = this._crearSeccion(sheet, row, 'COSTOS DE VENTA', 'FFF59E0B');
        
        if (resultados.costos && resultados.costos.total > 0) {
            resultados.costos.porCategoria.forEach(cat => {
                const pct = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100) : 0;
                row = this._crearFila(sheet, row, cat.categoria, -cat.monto, pct, '', false);
            });
            const pctCostos = ingresosTotales > 0 ? (resultados.costos.total / ingresosTotales * 100) : 0;
            row = this._crearSubtotal(sheet, row, 'TOTAL COSTOS', -resultados.costos.total, pctCostos);
        } else {
            row = this._crearFilaVacia(sheet, row, 'Sin costos de venta registrados');
            row = this._crearSubtotal(sheet, row, 'TOTAL COSTOS', 0, 0);
        }
        row = this._crearEspacioSeparador(sheet, row);

        // ── UTILIDAD BRUTA ──
        const pctBruta = ingresosTotales > 0 ? (resultados.utilidadBruta / ingresosTotales * 100) : 0;
        row = this._crearTotal(sheet, row, 'UTILIDAD BRUTA', resultados.utilidadBruta, pctBruta, 
            this._evaluarMargen('Bruto', pctBruta));
        row = this._crearEspacioSeparador(sheet, row);

        // ── GASTOS OPERATIVOS ──
        row = this._crearSeccion(sheet, row, 'GASTOS OPERATIVOS', 'FFEF4444');
        
        if (resultados.gastosOperativos && resultados.gastosOperativos.total > 0) {
            resultados.gastosOperativos.porCategoria.forEach(cat => {
                const pct = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100) : 0;
                row = this._crearFila(sheet, row, cat.categoria, -cat.monto, pct, '', false);
            });
            const pctGastos = ingresosTotales > 0 ? (resultados.gastosOperativos.total / ingresosTotales * 100) : 0;
            row = this._crearSubtotal(sheet, row, 'TOTAL GASTOS OPERATIVOS', -resultados.gastosOperativos.total, pctGastos);
        } else {
            row = this._crearFilaVacia(sheet, row, 'Sin gastos operativos registrados');
            row = this._crearSubtotal(sheet, row, 'TOTAL GASTOS OPERATIVOS', 0, 0);
        }
        row = this._crearEspacioSeparador(sheet, row);

        // ── UTILIDAD OPERATIVA ──
        const pctOperativa = ingresosTotales > 0 ? (resultados.utilidadOperativa / ingresosTotales * 100) : 0;
        row = this._crearTotal(sheet, row, 'UTILIDAD OPERATIVA', resultados.utilidadOperativa, pctOperativa,
            this._evaluarMargen('Operativo', pctOperativa));
        row = this._crearEspacioSeparador(sheet, row);

        // ── GASTOS FINANCIEROS ──
        if (resultados.gastosFinancieros && resultados.gastosFinancieros.total > 0) {
            row = this._crearSeccion(sheet, row, 'GASTOS FINANCIEROS', 'FF8B5CF6');
            resultados.gastosFinancieros.porCategoria.forEach(cat => {
                const pct = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100) : 0;
                row = this._crearFila(sheet, row, cat.categoria, -cat.monto, pct, '', false);
            });
            const pctFin = ingresosTotales > 0 ? (resultados.gastosFinancieros.total / ingresosTotales * 100) : 0;
            row = this._crearSubtotal(sheet, row, 'TOTAL GASTOS FINANCIEROS', -resultados.gastosFinancieros.total, pctFin);
            row = this._crearEspacioSeparador(sheet, row);
        }

        // ── UTILIDAD NETA (RESULTADO FINAL) ──
        const pctNeta = ingresosTotales > 0 ? (resultados.utilidadNeta / ingresosTotales * 100) : 0;
        row = this._crearResultadoFinal(sheet, row, resultados.utilidadNeta, pctNeta);

        // ── PIE DE PÁGINA ──
        row += 2;
        sheet.mergeCells(row, 1, row, 4);
        const pie = sheet.getCell(row, 1);
        pie.value = 'Documento generado por GRIZALUM Sistema Financiero | www.grizalum.com';
        pie.font = { name: 'Arial', size: 8, italic: true, color: { argb: 'FF9CA3AF' } };
        pie.alignment = { horizontal: 'center' };

        // Configurar impresión
        sheet.pageSetup = {
            paperSize: 9, // A4
            orientation: 'portrait',
            fitToPage: true,
            fitToWidth: 1,
            margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75 }
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // HOJA 2: ANÁLISIS FINANCIERO
    // ═══════════════════════════════════════════════════════════════

    _crearAnalisis(sheet, datos) {
        const resultados = datos.resultados;
        const ingresosTotales = resultados.ingresos.total;

        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 18;
        sheet.getColumn(4).width = 22;

        // ── TÍTULO ──
        sheet.mergeCells('A1:D1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'ANÁLISIS FINANCIERO';
        titulo.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 38;

        sheet.mergeCells('A2:D2');
        const sub = sheet.getCell('A2');
        sub.value = (datos.empresa || '').charAt(0).toUpperCase() + (datos.empresa || '').slice(1) + ' | ' + this._obtenerRangoTexto(resultados);
        sub.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FFFFFFFF' } };
        sub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        sub.alignment = { horizontal: 'center', vertical: 'middle' };

        // ── RESUMEN EJECUTIVO ──
        let row = 4;
        sheet.mergeCells(row, 1, row, 4);
        const secResumen = sheet.getCell(row, 1);
        secResumen.value = '  RESUMEN EJECUTIVO';
        secResumen.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        secResumen.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
        sheet.getRow(row).height = 28;
        row++;

        const resumenItems = [
            ['Ingresos Totales', resultados.ingresos.total, '100%', 'Base de cálculo'],
            ['(-) Costos de Venta', resultados.costos ? -resultados.costos.total : 0, 
                ingresosTotales > 0 ? (-(resultados.costos?.total || 0) / ingresosTotales * 100).toFixed(1) + '%' : '0%', ''],
            ['= Utilidad Bruta', resultados.utilidadBruta, 
                ingresosTotales > 0 ? (resultados.utilidadBruta / ingresosTotales * 100).toFixed(1) + '%' : '0%',
                this._evaluarMargen('Bruto', ingresosTotales > 0 ? resultados.utilidadBruta / ingresosTotales * 100 : 0)],
            ['(-) Gastos Operativos', resultados.gastosOperativos ? -resultados.gastosOperativos.total : 0,
                ingresosTotales > 0 ? (-(resultados.gastosOperativos?.total || 0) / ingresosTotales * 100).toFixed(1) + '%' : '0%', ''],
            ['= Utilidad Operativa', resultados.utilidadOperativa,
                ingresosTotales > 0 ? (resultados.utilidadOperativa / ingresosTotales * 100).toFixed(1) + '%' : '0%',
                this._evaluarMargen('Operativo', ingresosTotales > 0 ? resultados.utilidadOperativa / ingresosTotales * 100 : 0)],
            ['(-) Gastos Financieros', resultados.gastosFinancieros ? -resultados.gastosFinancieros.total : 0,
                ingresosTotales > 0 ? (-(resultados.gastosFinancieros?.total || 0) / ingresosTotales * 100).toFixed(1) + '%' : '0%', ''],
            ['= UTILIDAD NETA', resultados.utilidadNeta,
                ingresosTotales > 0 ? (resultados.utilidadNeta / ingresosTotales * 100).toFixed(1) + '%' : '0%',
                this._evaluarMargen('Neto', ingresosTotales > 0 ? resultados.utilidadNeta / ingresosTotales * 100 : 0)]
        ];

        resumenItems.forEach(([concepto, monto, pct, eval_], idx) => {
            const esTotal = concepto.startsWith('=');
            const esNeto = concepto.includes('NETA');
            
            sheet.getCell(row, 1).value = concepto;
            sheet.getCell(row, 1).font = { name: 'Arial', size: 10, bold: esTotal, 
                color: { argb: esTotal ? 'FF111827' : 'FF6B7280' } };
            
            sheet.getCell(row, 2).value = monto;
            sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00;[Red]"S/. "-#,##0.00';
            sheet.getCell(row, 2).font = { name: 'Arial', size: 10, bold: esTotal,
                color: { argb: monto >= 0 ? 'FF10B981' : 'FFEF4444' } };
            sheet.getCell(row, 2).alignment = { horizontal: 'right' };

            sheet.getCell(row, 3).value = pct;
            sheet.getCell(row, 3).font = { name: 'Arial', size: 10 };
            sheet.getCell(row, 3).alignment = { horizontal: 'center' };

            sheet.getCell(row, 4).value = eval_;
            sheet.getCell(row, 4).font = { name: 'Arial', size: 10 };
            sheet.getCell(row, 4).alignment = { horizontal: 'center' };

            if (esTotal) {
                [1,2,3,4].forEach(col => {
                    sheet.getCell(row, col).fill = { type: 'pattern', pattern: 'solid', 
                        fgColor: { argb: esNeto ? 'FFE0E7FF' : 'FFF3F4F6' } };
                    sheet.getCell(row, col).border = {
                        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } }
                    };
                });
            }

            if (esNeto) {
                sheet.getRow(row).height = 28;
                sheet.getCell(row, 1).font = { name: 'Arial', size: 12, bold: true };
                sheet.getCell(row, 2).font = { name: 'Arial', size: 12, bold: true,
                    color: { argb: monto >= 0 ? 'FF059669' : 'FFEF4444' } };
            }

            row++;
        });

        // ── RATIOS FINANCIEROS ──
        row += 2;
        sheet.mergeCells(row, 1, row, 4);
        const secRatios = sheet.getCell(row, 1);
        secRatios.value = '  INDICADORES FINANCIEROS';
        secRatios.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        secRatios.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
        sheet.getRow(row).height = 28;
        row++;

        // Headers ratios
        ['Indicador', 'Valor', 'Referencia', 'Estado'].forEach((h, i) => {
            const cell = sheet.getCell(row, i + 1);
            cell.value = h;
            cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF6B7280' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = { bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } } };
        });
        row++;

        const ratios = [
            ['Margen Bruto', resultados.ratios?.margenBruto || 0, '> 40% ideal', 'Bruto'],
            ['Margen Operativo', resultados.ratios?.margenOperativo || 0, '> 15% ideal', 'Operativo'],
            ['Margen Neto', resultados.ratios?.margenNeto || 0, '> 10% ideal', 'Neto']
        ];

        ratios.forEach(([nombre, valor, ref, tipo]) => {
            sheet.getCell(row, 1).value = nombre;
            sheet.getCell(row, 1).font = { name: 'Arial', size: 10 };
            
            sheet.getCell(row, 2).value = valor.toFixed(1) + '%';
            sheet.getCell(row, 2).font = { name: 'Arial', size: 11, bold: true,
                color: { argb: valor > 0 ? 'FF10B981' : 'FFEF4444' } };
            sheet.getCell(row, 2).alignment = { horizontal: 'center' };

            sheet.getCell(row, 3).value = ref;
            sheet.getCell(row, 3).font = { name: 'Arial', size: 9, color: { argb: 'FF9CA3AF' } };
            sheet.getCell(row, 3).alignment = { horizontal: 'center' };

            sheet.getCell(row, 4).value = this._evaluarMargen(tipo, valor);
            sheet.getCell(row, 4).alignment = { horizontal: 'center' };

            [1,2,3,4].forEach(col => {
                sheet.getCell(row, col).border = { 
                    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } } 
                };
            });
            row++;
        });

        // ── DIAGNÓSTICO ──
        row += 2;
        sheet.mergeCells(row, 1, row, 4);
        const secDiag = sheet.getCell(row, 1);
        secDiag.value = '  DIAGNÓSTICO';
        secDiag.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        secDiag.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
        sheet.getRow(row).height = 28;
        row++;

        const diagnosticos = this._generarDiagnosticos(resultados, ingresosTotales);
        diagnosticos.forEach(diag => {
            sheet.mergeCells(row, 1, row, 4);
            const cell = sheet.getCell(row, 1);
            cell.value = '  ' + diag;
            cell.font = { name: 'Arial', size: 10 };
            cell.alignment = { wrapText: true, vertical: 'top' };
            sheet.getRow(row).height = 22;
            row++;
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // HOJA 3: DETALLE POR CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════

    _crearDetalleCategorias(sheet, datos) {
        const resultados = datos.resultados;

        sheet.getColumn(1).width = 8;
        sheet.getColumn(2).width = 30;
        sheet.getColumn(3).width = 12;
        sheet.getColumn(4).width = 18;
        sheet.getColumn(5).width = 16;

        // Título
        sheet.mergeCells('A1:E1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'DETALLE POR CATEGORÍAS';
        titulo.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 38;

        let row = 3;

        // Función helper para agregar sección
        const agregarSeccion = (titulo, categorias, color, esIngreso) => {
            sheet.mergeCells(row, 1, row, 5);
            const secCell = sheet.getCell(row, 1);
            secCell.value = '  ' + titulo;
            secCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
            secCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
            sheet.getRow(row).height = 26;
            row++;

            // Headers
            ['#', 'Categoría', 'Cant.', 'Monto (S/.)', '% del Total'].forEach((h, i) => {
                const cell = sheet.getCell(row, i + 1);
                cell.value = h;
                cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF6B7280' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
                cell.alignment = { horizontal: 'center' };
                cell.border = { bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } } };
            });
            row++;

            if (categorias && categorias.length > 0) {
                const total = categorias.reduce((sum, c) => sum + c.monto, 0);
                categorias.sort((a, b) => b.monto - a.monto).forEach((cat, idx) => {
                    sheet.getCell(row, 1).value = idx + 1;
                    sheet.getCell(row, 1).alignment = { horizontal: 'center' };
                    sheet.getCell(row, 1).font = { name: 'Arial', size: 9, color: { argb: 'FF9CA3AF' } };
                    
                    sheet.getCell(row, 2).value = cat.categoria;
                    sheet.getCell(row, 2).font = { name: 'Arial', size: 10 };
                    
                    sheet.getCell(row, 3).value = cat.cantidad || '-';
                    sheet.getCell(row, 3).alignment = { horizontal: 'center' };
                    sheet.getCell(row, 3).font = { name: 'Arial', size: 10 };
                    
                    sheet.getCell(row, 4).value = esIngreso ? cat.monto : -cat.monto;
                    sheet.getCell(row, 4).numFmt = '"S/. "#,##0.00;[Red]"S/. "-#,##0.00';
                    sheet.getCell(row, 4).alignment = { horizontal: 'right' };
                    sheet.getCell(row, 4).font = { name: 'Arial', size: 10, 
                        color: { argb: esIngreso ? 'FF10B981' : 'FFEF4444' } };
                    
                    const pct = total > 0 ? (cat.monto / total * 100).toFixed(1) : '0.0';
                    sheet.getCell(row, 5).value = pct + '%';
                    sheet.getCell(row, 5).alignment = { horizontal: 'center' };
                    sheet.getCell(row, 5).font = { name: 'Arial', size: 10 };

                    // Fondo alternado
                    if (idx % 2 === 0) {
                        [1,2,3,4,5].forEach(col => {
                            sheet.getCell(row, col).fill = { type: 'pattern', pattern: 'solid', 
                                fgColor: { argb: 'FFF9FAFB' } };
                        });
                    }

                    [1,2,3,4,5].forEach(col => {
                        sheet.getCell(row, col).border = { 
                            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } } 
                        };
                    });

                    row++;
                });
            } else {
                sheet.mergeCells(row, 1, row, 5);
                sheet.getCell(row, 1).value = '  Sin registros en este período';
                sheet.getCell(row, 1).font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF9CA3AF' } };
                row++;
            }

            row++;
        };

        agregarSeccion('INGRESOS', resultados.ingresos.porCategoria, 'FF10B981', true);
        
        if (resultados.costos && resultados.costos.porCategoria) {
            agregarSeccion('COSTOS DE VENTA', resultados.costos.porCategoria, 'FFF59E0B', false);
        }
        
        if (resultados.gastosOperativos && resultados.gastosOperativos.porCategoria) {
            agregarSeccion('GASTOS OPERATIVOS', resultados.gastosOperativos.porCategoria, 'FFEF4444', false);
        }
        
        if (resultados.gastosFinancieros && resultados.gastosFinancieros.porCategoria && 
            resultados.gastosFinancieros.porCategoria.length > 0) {
            agregarSeccion('GASTOS FINANCIEROS', resultados.gastosFinancieros.porCategoria, 'FF8B5CF6', false);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // FUNCIONES AUXILIARES DE FORMATO
    // ═══════════════════════════════════════════════════════════════

    _crearSeccion(sheet, row, titulo, color) {
        sheet.mergeCells(row, 1, row, 4);
        const cell = sheet.getCell(row, 1);
        cell.value = '  ' + titulo;
        cell.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.border = this._bordes();
        sheet.getRow(row).height = 26;
        return row + 1;
    }

    _crearFila(sheet, row, concepto, monto, porcentaje, observacion = '', esIngreso = false) {
        sheet.getCell(row, 1).value = '      ' + concepto;
        sheet.getCell(row, 1).font = { name: 'Arial', size: 10 };
        
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00;[Red]"S/. "-#,##0.00';
        sheet.getCell(row, 2).alignment = { horizontal: 'right' };
        sheet.getCell(row, 2).font = { name: 'Arial', size: 10, 
            color: { argb: monto < 0 ? 'FFEF4444' : 'FF10B981' } };
        
        sheet.getCell(row, 3).value = porcentaje.toFixed(1) + '%';
        sheet.getCell(row, 3).font = { name: 'Arial', size: 10 };
        sheet.getCell(row, 3).alignment = { horizontal: 'center' };

        sheet.getCell(row, 4).value = observacion;
        sheet.getCell(row, 4).font = { name: 'Arial', size: 9, color: { argb: 'FF6B7280' } };
        sheet.getCell(row, 4).alignment = { horizontal: 'center' };

        [1, 2, 3, 4].forEach(col => {
            sheet.getCell(row, col).border = {
                bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }
            };
        });

        // Fondo alternado sutil
        if (row % 2 === 0) {
            [1, 2, 3, 4].forEach(col => {
                sheet.getCell(row, col).fill = { type: 'pattern', pattern: 'solid', 
                    fgColor: { argb: 'FFF9FAFB' } };
            });
        }

        return row + 1;
    }

    _crearFilaVacia(sheet, row, texto) {
        sheet.mergeCells(row, 1, row, 4);
        const cell = sheet.getCell(row, 1);
        cell.value = '      ' + texto;
        cell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF9CA3AF' } };
        cell.border = { bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } } };
        return row + 1;
    }

    _crearSubtotal(sheet, row, concepto, monto, porcentaje) {
        sheet.getCell(row, 1).value = '  ' + concepto;
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00;[Red]"S/. "-#,##0.00';
        sheet.getCell(row, 3).value = (typeof porcentaje === 'number' ? porcentaje.toFixed(1) : porcentaje) + '%';

        [1, 2, 3, 4].forEach(col => {
            const cell = sheet.getCell(row, col);
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF111827' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } }
            };
            if (col === 2) cell.alignment = { horizontal: 'right' };
            if (col === 3) cell.alignment = { horizontal: 'center' };
        });

        sheet.getRow(row).height = 24;
        return row + 1;
    }

    _crearTotal(sheet, row, concepto, monto, porcentaje, evaluacion = '') {
        sheet.getCell(row, 1).value = concepto;
        sheet.getCell(row, 2).value = monto;
        sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00;[Red]"S/. "-#,##0.00';
        sheet.getCell(row, 3).value = porcentaje.toFixed(1) + '%';
        sheet.getCell(row, 4).value = evaluacion;

        const colorFondo = monto >= 0 ? 'FF667EEA' : 'FFEF4444';

        [1, 2, 3, 4].forEach(col => {
            const cell = sheet.getCell(row, col);
            cell.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorFondo } };
            cell.border = this._bordes();
            if (col === 2) cell.alignment = { horizontal: 'right' };
            if (col === 3 || col === 4) cell.alignment = { horizontal: 'center' };
        });

        sheet.getRow(row).height = 30;
        return row + 1;
    }

    _crearResultadoFinal(sheet, row, utilidadNeta, pctNeta) {
        // Fila de resultado final destacada
        sheet.mergeCells(row, 1, row, 1);
        sheet.getCell(row, 1).value = 'RESULTADO DEL PERÍODO';

        sheet.getCell(row, 2).value = utilidadNeta;
        sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00;[Red]"S/. "-#,##0.00';
        sheet.getCell(row, 3).value = pctNeta.toFixed(1) + '%';

        const esPositivo = utilidadNeta >= 0;
        sheet.getCell(row, 4).value = esPositivo ? 'UTILIDAD' : 'PÉRDIDA';

        const colorFondo = esPositivo ? 'FF059669' : 'FFDC2626';

        [1, 2, 3, 4].forEach(col => {
            const cell = sheet.getCell(row, col);
            cell.font = { name: 'Arial', bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorFondo } };
            cell.border = {
                top: { style: 'medium', color: { argb: 'FF000000' } },
                bottom: { style: 'medium', color: { argb: 'FF000000' } },
                left: { style: 'medium', color: { argb: 'FF000000' } },
                right: { style: 'medium', color: { argb: 'FF000000' } }
            };
            if (col === 2) cell.alignment = { horizontal: 'right', vertical: 'middle' };
            if (col === 3 || col === 4) cell.alignment = { horizontal: 'center', vertical: 'middle' };
            if (col === 1) cell.alignment = { horizontal: 'left', vertical: 'middle' };
        });

        sheet.getRow(row).height = 35;
        return row + 1;
    }

    _crearEspacioSeparador(sheet, row) {
        sheet.getRow(row).height = 8;
        return row + 1;
    }

    // ═══════════════════════════════════════════════════════════════
    // FUNCIONES DE UTILIDAD
    // ═══════════════════════════════════════════════════════════════

    _obtenerRangoTexto(resultados) {
        if (resultados.rango && resultados.rango.inicio && resultados.rango.fin) {
            const opts = { year: 'numeric', month: 'long', day: 'numeric' };
            try {
                const inicio = new Date(resultados.rango.inicio).toLocaleDateString('es-PE', opts);
                const fin = new Date(resultados.rango.fin).toLocaleDateString('es-PE', opts);
                return `Del ${inicio} al ${fin}`;
            } catch(e) {
                return `Período: ${resultados.periodo || 'N/A'}`;
            }
        }
        return `Período: ${resultados.periodo || 'N/A'}`;
    }

    _nombrePeriodo(periodo) {
        const nombres = {
            'hoy': 'Hoy',
            'semana': 'Semana Actual',
            'mes': 'Mes Actual',
            'trimestre': 'Trimestre Actual',
            'anio': 'Año Actual',
            'personalizado': 'Personalizado'
        };
        return nombres[periodo] || periodo || 'N/A';
    }

    _observacionIngreso(categoria, porcentaje) {
        if (porcentaje >= 50) return 'Principal fuente de ingreso';
        if (porcentaje >= 25) return 'Fuente significativa';
        if (porcentaje >= 10) return 'Fuente secundaria';
        return '';
    }

    _evaluarMargen(tipo, valor) {
        if (tipo === 'Bruto') {
            if (valor > 40) return '● Excelente';
            if (valor > 20) return '● Aceptable';
            if (valor > 0) return '● Bajo';
            return '● Crítico';
        } else if (tipo === 'Operativo') {
            if (valor > 15) return '● Excelente';
            if (valor > 5) return '● Aceptable';
            if (valor > 0) return '● Bajo';
            return '● Negativo';
        } else if (tipo === 'Neto') {
            if (valor > 10) return '● Excelente';
            if (valor > 0) return '● Aceptable';
            return '● Pérdida';
        }
        return '';
    }

    _generarDiagnosticos(resultados, ingresosTotales) {
        const diags = [];
        
        if (ingresosTotales === 0) {
            diags.push('⚠ No se registraron ingresos en este período.');
            diags.push('→ Revise que las transacciones estén correctamente categorizadas en Flujo de Caja.');
            return diags;
        }

        // Margen bruto
        const margenBruto = resultados.ratios?.margenBruto || 0;
        if (margenBruto > 40) {
            diags.push('✓ El margen bruto es saludable (' + margenBruto.toFixed(1) + '%). Los costos directos están controlados.');
        } else if (margenBruto > 0) {
            diags.push('⚠ El margen bruto es bajo (' + margenBruto.toFixed(1) + '%). Considere renegociar costos con proveedores.');
        }

        // Gastos operativos
        const pctGastos = ingresosTotales > 0 ? ((resultados.gastosOperativos?.total || 0) / ingresosTotales * 100) : 0;
        if (pctGastos > 30) {
            diags.push('⚠ Los gastos operativos representan el ' + pctGastos.toFixed(1) + '% de los ingresos. Busque oportunidades de optimización.');
        } else if (pctGastos > 0) {
            diags.push('✓ Los gastos operativos están dentro de un rango razonable (' + pctGastos.toFixed(1) + '%).');
        }

        // Resultado final
        if (resultados.utilidadNeta > 0) {
            diags.push('✓ El período cierra con utilidad neta positiva de S/. ' + resultados.utilidadNeta.toFixed(2) + '.');
        } else if (resultados.utilidadNeta < 0) {
            diags.push('✗ El período cierra con pérdida neta de S/. ' + Math.abs(resultados.utilidadNeta).toFixed(2) + '. Se requieren acciones correctivas.');
        } else {
            diags.push('→ El período cierra en punto de equilibrio (ni ganancia ni pérdida).');
        }

        return diags;
    }

    _bordes() {
        return {
            top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
        };
    }

    _fecha() {
        const hoy = new Date();
        return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    }
}
    
    window.ExportadorEstadoResultados = ExportadorEstadoResultados;
}

console.log('✅ Exportador Estado de Resultados v2.0 cargado');
