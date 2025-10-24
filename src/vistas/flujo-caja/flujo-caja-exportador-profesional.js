/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTADOR PROFESIONAL DE EXCEL - FLUJO DE CAJA GRIZALUM
 * Usa ExcelJS para estilos REALES con colores
 * VERSION: 3.0 PREMIUM
 * ═══════════════════════════════════════════════════════════════════
 */

class ExportadorExcelProfesional {
    constructor() {
        // Colores GRIZALUM (tu app)
        this.colores = {
            primario: '667EEA',      // Morado principal
            verde: '10B981',         // Verde ingresos
            rojo: 'EF4444',          // Rojo gastos
            morado: '8B5CF6',        // Morado balance
            fondoOscuro: '1F2937',   // Fondo oscuro
            blanco: 'FFFFFF',
            gris: 'D1D5DB'
        };
    }

    async exportar(datos) {
        try {
            console.log('📊 Generando Excel profesional con ExcelJS...');

            // Crear libro
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'GRIZALUM Sistema Financiero';
            workbook.created = new Date();

            // ═══════════════════════════════════════════════════════════
            // HOJA 1: DASHBOARD EJECUTIVO
            // ═══════════════════════════════════════════════════════════
            const hoja1 = workbook.addWorksheet('📊 Dashboard', {
                views: [{ showGridLines: false }]
            });

            this._crearDashboard(hoja1, datos);

            // ═══════════════════════════════════════════════════════════
            // HOJA 2: TRANSACCIONES
            // ═══════════════════════════════════════════════════════════
            const hoja2 = workbook.addWorksheet('📋 Transacciones', {
                views: [{ showGridLines: false }]
            });

            this._crearTransacciones(hoja2, datos);

            // ═══════════════════════════════════════════════════════════
            // HOJA 3: CATEGORÍAS
            // ═══════════════════════════════════════════════════════════
            const hoja3 = workbook.addWorksheet('🏷️ Categorías', {
                views: [{ showGridLines: false }]
            });

            this._crearCategorias(hoja3, datos);

            // ═══════════════════════════════════════════════════════════
            // HOJA 4: ANÁLISIS
            // ═══════════════════════════════════════════════════════════
            const hoja4 = workbook.addWorksheet('📈 Análisis', {
                views: [{ showGridLines: false }]
            });

            this._crearAnalisis(hoja4, datos);

            // ═══════════════════════════════════════════════════════════
            // DESCARGAR
            // ═══════════════════════════════════════════════════════════
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GRIZALUM_FlujoCaja_${datos.empresa}_${this._fecha()}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

            console.log('✅ Excel profesional generado');
            return true;

        } catch (error) {
            console.error('❌ Error:', error);
            throw error;
        }
    }

    _crearDashboard(sheet, datos) {
        const balance = datos.balance || {};

        // ═══ TÍTULO PRINCIPAL ═══
        sheet.mergeCells('A1:F1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'FLUJO DE CAJA - DASHBOARD EJECUTIVO';
        titulo.font = { name: 'Inter', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        titulo.border = {
            bottom: { style: 'thick', color: { argb: 'FF667EEA' } }
        };
        sheet.getRow(1).height = 40;

        // ═══ METADATOS ═══
        sheet.getCell('A3').value = 'Empresa:';
        sheet.getCell('B3').value = datos.empresa || 'N/A';
        sheet.getCell('D3').value = 'Fecha:';
        sheet.getCell('E3').value = new Date().toLocaleDateString('es-PE');
        // Bordes para metadatos
        ['A3', 'B3', 'D3', 'E3'].forEach(cell => {
           const c = sheet.getCell(cell);
           c.border = {
              top: { style: 'thin', color: { argb: 'FF4B5563' } },
              bottom: { style: 'thin', color: { argb: 'FF4B5563' } },
              left: { style: 'thin', color: { argb: 'FF4B5563' } },
              right: { style: 'thin', color: { argb: 'FF4B5563' } }
           };
       });
        
        // ═══ RESUMEN FINANCIERO ═══
        sheet.mergeCells('A5:F5');
        const subtitulo = sheet.getCell('A5');
        subtitulo.value = '💎 RESUMEN FINANCIERO';
        subtitulo.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
        subtitulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF764BA2' } };
        subtitulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(5).height = 30;

        // ═══ HEADERS ═══
        const headers = ['CONCEPTO', 'MONTO (S/.)', 'CANTIDAD', '% DEL TOTAL', 'ESTADO'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(7, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // ═══ INGRESOS ═══
        sheet.getCell('A8').value = '📈 INGRESOS TOTALES';
        sheet.getCell('B8').value = balance.ingresos;
        sheet.getCell('B8').numFmt = '"S/. "#,##0.00';
        sheet.getCell('C8').value = balance.cantidadIngresos || 0;
        sheet.getCell('D8').value = this._porcentaje(balance.ingresos, balance.ingresos + balance.gastos);
        sheet.getCell('E8').value = '✅ POSITIVO';

        ['B8', 'C8', 'D8', 'E8'].forEach(cell => {
            const c = sheet.getCell(cell);
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.alignment = { horizontal: cell === 'B8' ? 'right' : 'center' };
        });

        // ═══ GASTOS ═══
        sheet.getCell('A9').value = '📉 GASTOS TOTALES';
        sheet.getCell('B9').value = balance.gastos;
        sheet.getCell('B9').numFmt = '"S/. "#,##0.00';
        sheet.getCell('C9').value = balance.cantidadGastos || 0;
        sheet.getCell('D9').value = this._porcentaje(balance.gastos, balance.ingresos + balance.gastos);
        sheet.getCell('E9').value = '⚠️ NEGATIVO';

        ['B9', 'C9', 'D9', 'E9'].forEach(cell => {
            const c = sheet.getCell(cell);
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.alignment = { horizontal: cell === 'B9' ? 'right' : 'center' };
        });

        // ═══ BALANCE FINAL ═══
        sheet.getCell('A11').value = '💰 BALANCE FINAL';
        sheet.getCell('B11').value = balance.balance;
        sheet.getCell('B11').numFmt = '"S/. "#,##0.00';
        sheet.getCell('C11').value = balance.total || 0;
        sheet.getCell('D11').value = '100%';
        sheet.getCell('E11').value = balance.balance >= 0 ? '✅ SUPERÁVIT' : '❌ DÉFICIT';

        ['A11', 'B11', 'C11', 'D11', 'E11'].forEach(cell => {
            const c = sheet.getCell(cell);
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } };
            c.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
            c.alignment = { horizontal: cell === 'B11' ? 'right' : 'center' };
            c.border = {
                top: { style: 'thick', color: { argb: 'FF667EEA' } },
                bottom: { style: 'thick', color: { argb: 'FF667EEA' } }
            };
        });

        // Anchos de columna
        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 15;
        sheet.getColumn(5).width = 20;
    }

    _crearTransacciones(sheet, datos) {
        const transacciones = datos.transacciones || [];

        // Título
        sheet.mergeCells('A1:F1');
        const titulo = sheet.getCell('A1');
        titulo.value = '📋 LISTADO COMPLETO DE TRANSACCIONES';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        // Headers
        const headers = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto (S/.)', 'Método'];
        headers.forEach((h, i) => {
            const cell = sheet.getCell(3, i + 1);
            cell.value = h;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center' };
        });

        // Datos
        transacciones.forEach((t, i) => {
            const row = i + 4;
            sheet.getCell(row, 1).value = new Date(t.fecha).toLocaleDateString('es-PE');
            sheet.getCell(row, 2).value = t.tipo.toUpperCase();
            sheet.getCell(row, 3).value = t.categoria;
            sheet.getCell(row, 4).value = t.descripcion || '-';
            sheet.getCell(row, 5).value = t.monto;
            sheet.getCell(row, 5).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 6).value = t.metodoPago || 'Efectivo';

            // Color según tipo
            const colorCell = sheet.getCell(row, 5);
            if (t.tipo === 'ingreso') {
                colorCell.font = { bold: true, color: { argb: 'FF10B981' } };
            } else {
                colorCell.font = { bold: true, color: { argb: 'FFEF4444' } };
            }
        });

        // Anchos
        sheet.getColumn(1).width = 12;
        sheet.getColumn(2).width = 10;
        sheet.getColumn(3).width = 20;
        sheet.getColumn(4).width = 35;
        sheet.getColumn(5).width = 15;
        sheet.getColumn(6).width = 15;
    }

    _crearCategorias(sheet, datos) {
        const transacciones = datos.transacciones || [];
        
        // Agrupar por categoría
        const porCategoria = {};
        transacciones.forEach(t => {
            if (!porCategoria[t.categoria]) {
                porCategoria[t.categoria] = { monto: 0, cantidad: 0, tipo: t.tipo };
            }
            porCategoria[t.categoria].monto += t.monto;
            porCategoria[t.categoria].cantidad++;
        });

        const categorias = Object.keys(porCategoria).map(cat => ({
            categoria: cat,
            ...porCategoria[cat]
        })).sort((a, b) => b.monto - a.monto);

        // Título
        sheet.mergeCells('A1:E1');
        const titulo = sheet.getCell('A1');
        titulo.value = '🏷️ ANÁLISIS POR CATEGORÍA';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        // Headers
        ['Categoría', 'Monto Total', 'Cantidad', 'Promedio', 'Tipo'].forEach((h, i) => {
            const cell = sheet.getCell(3, i + 1);
            cell.value = h;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
        });

        // Datos
        categorias.forEach((c, i) => {
            const row = i + 4;
            sheet.getCell(row, 1).value = c.categoria;
            sheet.getCell(row, 2).value = c.monto;
            sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 3).value = c.cantidad;
            sheet.getCell(row, 4).value = c.monto / c.cantidad;
            sheet.getCell(row, 4).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 5).value = c.tipo.toUpperCase();

            // Color
            const color = c.tipo === 'ingreso' ? 'FF10B981' : 'FFEF4444';
            [2, 4].forEach(col => {
                sheet.getCell(row, col).font = { bold: true, color: { argb: color } };
            });
        });

        sheet.getColumn(1).width = 25;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 12;
        sheet.getColumn(4).width = 18;
        sheet.getColumn(5).width = 12;
    }

    _crearAnalisis(sheet, datos) {
        const balance = datos.balance || {};

        sheet.mergeCells('A1:C1');
        const titulo = sheet.getCell('A1');
        titulo.value = '📈 ANÁLISIS Y GRÁFICOS';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center' };
        sheet.getRow(1).height = 35;

        // Datos para gráficos
        sheet.getCell('A3').value = 'Concepto';
        sheet.getCell('B3').value = 'Monto';
        
        sheet.getCell('A4').value = 'Ingresos';
        sheet.getCell('B4').value = balance.ingresos;
        
        sheet.getCell('A5').value = 'Gastos';
        sheet.getCell('B5').value = balance.gastos;
        
        sheet.getCell('A6').value = 'Balance';
        sheet.getCell('B6').value = balance.balance;

        sheet.getColumn(1).width = 20;
        sheet.getColumn(2).width = 15;
    }

    _porcentaje(parte, total) {
        if (total === 0) return '0%';
        return `${((parte / total) * 100).toFixed(1)}%`;
    }

    _fecha() {
        const hoy = new Date();
        return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    }
}

window.ExportadorExcelProfesional = ExportadorExcelProfesional;
console.log('✅ Exportador Excel Profesional v3.0 cargado');
