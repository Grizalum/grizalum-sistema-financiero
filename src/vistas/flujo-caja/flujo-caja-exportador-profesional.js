/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTADOR PROFESIONAL DE EXCEL - FLUJO DE CAJA GRIZALUM
 * Usa ExcelJS para estilos REALES con colores
 * VERSION: 3.0 PREMIUM CON GRÁFICOS
 * ═══════════════════════════════════════════════════════════════════
 */

class ExportadorExcelProfesional {
    constructor() {
        this.colores = {
            primario: '667EEA',
            verde: '10B981',
            rojo: 'EF4444',
            morado: '8B5CF6',
            fondoOscuro: '1F2937',
            blanco: 'FFFFFF',
            gris: 'D1D5DB'
        };
    }

    async exportar(datos) {
         // Validar que hay datos
         if (!datos || !datos.balance) {
            console.error('❌ No hay datos para exportar');
            alert('No hay datos disponibles para exportar');
            return false;
        }
        try {
            console.log('📊 Generando Excel profesional con ExcelJS...');

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'GRIZALUM Sistema Financiero';
            workbook.created = new Date();

            const hoja1 = workbook.addWorksheet('📊 Dashboard', {
                views: [{ showGridLines: false }]
            });
            this._crearDashboard(hoja1, datos);

            const hoja2 = workbook.addWorksheet('📋 Transacciones', {
                views: [{ showGridLines: false }]
            });
            this._crearTransacciones(hoja2, datos);

            const hoja3 = workbook.addWorksheet('🏷️ Categorías', {
                views: [{ showGridLines: false }]
            });
            this._crearCategorias(hoja3, datos);

            const hoja4 = workbook.addWorksheet('📈 Análisis', {
                views: [{ showGridLines: false }]
            });
            await this._crearAnalisis(hoja4, datos, workbook);

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

            console.log('✅ Excel profesional generado exitosamente con gráfico');
            return true;

        } catch (error) {
            console.error('❌ Error exportando:', error);
            alert('Error al generar el Excel. Por favor intenta nuevamente.');
            throw error;
        }
    }

    _crearDashboard(sheet, datos) {
        const balance = datos.balance || {};

        sheet.mergeCells('A1:F1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'FLUJO DE CAJA - DASHBOARD EJECUTIVO';
        titulo.font = { name: 'Inter', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        titulo.border = {
            bottom: { style: 'thin', color: { argb: 'FF000000' } }
        };
        sheet.getRow(1).height = 40;

        sheet.getCell('A3').value = 'Empresa:';
        sheet.getCell('B3').value = datos.empresa || 'N/A';
        sheet.getCell('D3').value = 'Fecha:';
        sheet.getCell('E3').value = new Date().toLocaleDateString('es-PE');

        ['A3', 'B3', 'D3', 'E3'].forEach(cell => {
            const c = sheet.getCell(cell);
            c.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        sheet.mergeCells('A5:F5');
        const subtitulo = sheet.getCell('A5');
        subtitulo.value = '💎 RESUMEN FINANCIERO';
        subtitulo.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
        subtitulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF764BA2' } };
        subtitulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(5).height = 30;

        const headers = ['CONCEPTO', 'MONTO (S/.)', 'CANTIDAD', '% DEL TOTAL', 'ESTADO'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(7, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        sheet.getCell('A8').value = '📈 INGRESOS TOTALES';
        sheet.getCell('B8').value = balance.ingresos;
        sheet.getCell('B8').numFmt = '"S/. "#,##0.00';
        sheet.getCell('C8').value = balance.cantidadIngresos || 0;
        sheet.getCell('D8').value = this._porcentaje(balance.ingresos, balance.ingresos + balance.gastos);
        sheet.getCell('E8').value = '✅ POSITIVO';

        ['A8', 'B8', 'C8', 'D8', 'E8'].forEach(cell => {
            const c = sheet.getCell(cell);
            if (cell !== 'A8') {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
                c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                c.alignment = { horizontal: cell === 'B8' ? 'right' : 'center' };
            }
            c.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        sheet.getCell('A9').value = '📉 GASTOS TOTALES';
        sheet.getCell('B9').value = balance.gastos;
        sheet.getCell('B9').numFmt = '"S/. "#,##0.00';
        sheet.getCell('C9').value = balance.cantidadGastos || 0;
        sheet.getCell('D9').value = this._porcentaje(balance.gastos, balance.ingresos + balance.gastos);
        sheet.getCell('E9').value = '⚠️ NEGATIVO';

        ['A9', 'B9', 'C9', 'D9', 'E9'].forEach(cell => {
            const c = sheet.getCell(cell);
            if (cell !== 'A9') {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };
                c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                c.alignment = { horizontal: cell === 'B9' ? 'right' : 'center' };
            }
            c.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

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
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 15;
        sheet.getColumn(5).width = 20;
    }

    _crearTransacciones(sheet, datos) {
        const transacciones = datos.transacciones || [];

        sheet.mergeCells('A1:F1');
        const titulo = sheet.getCell('A1');
        titulo.value = '📋 LISTADO COMPLETO DE TRANSACCIONES';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        const headers = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto (S/.)', 'Método'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(3, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        transacciones.forEach((t, i) => {
            const row = i + 4;
            
            sheet.getCell(row, 1).value = new Date(t.fecha).toLocaleDateString('es-PE');
            sheet.getCell(row, 2).value = t.tipo.toUpperCase();
            sheet.getCell(row, 3).value = t.categoria;
            sheet.getCell(row, 4).value = t.descripcion || '-';
            sheet.getCell(row, 5).value = t.monto;
            sheet.getCell(row, 5).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 6).value = t.metodoPago || 'Efectivo';

            const colorCell = sheet.getCell(row, 5);
            if (t.tipo === 'ingreso') {
                colorCell.font = { bold: true, color: { argb: 'FF10B981' } };
            } else {
                colorCell.font = { bold: true, color: { argb: 'FFEF4444' } };
            }

            for (let col = 1; col <= 6; col++) {
                sheet.getCell(row, col).border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            }
        });

        sheet.getColumn(1).width = 12;
        sheet.getColumn(2).width = 10;
        sheet.getColumn(3).width = 20;
        sheet.getColumn(4).width = 35;
        sheet.getColumn(5).width = 15;
        sheet.getColumn(6).width = 15;
    }

    _crearCategorias(sheet, datos) {
        const transacciones = datos.transacciones || [];

        sheet.mergeCells('A1:E1');
        const titulo = sheet.getCell('A1');
        titulo.value = '🏷️ ANÁLISIS POR CATEGORÍA';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        const headers = ['Categoría', 'Monto Total', 'Cantidad', 'Promedio', 'Tipo'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(3, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        const porCategoria = {};
        transacciones.forEach(t => {
            const clave = `${t.categoria}|||${t.tipo}`;
            if (!porCategoria[clave]) {
                porCategoria[clave] = { 
                    categoria: t.categoria,
                    monto: 0, 
                    cantidad: 0, 
                    tipo: t.tipo 
                };
            }
            porCategoria[clave].monto += t.monto;
            porCategoria[clave].cantidad++;
        });

        const categorias = Object.values(porCategoria).sort((a, b) => b.monto - a.monto);

        categorias.forEach((c, i) => {
            const row = i + 4;
            sheet.getCell(row, 1).value = c.categoria;
            sheet.getCell(row, 2).value = c.monto;
            sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 3).value = c.cantidad;
            sheet.getCell(row, 4).value = c.monto / c.cantidad;
            sheet.getCell(row, 4).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 5).value = c.tipo.toUpperCase();

            const color = c.tipo === 'ingreso' ? 'FF10B981' : 'FFEF4444';
            [2, 4].forEach(col => {
                sheet.getCell(row, col).font = { bold: true, color: { argb: color } };
            });

            for (let col = 1; col <= 5; col++) {
                sheet.getCell(row, col).border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            }
        });

        sheet.getColumn(1).width = 20;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 12;
        sheet.getColumn(4).width = 15;
        sheet.getColumn(5).width = 15;
    }

    async _crearAnalisis(sheet, datos, workbook) {
        const balance = datos.balance || {};
        const transacciones = datos.transacciones || [];

        sheet.mergeCells('A1:D1');
        const titulo = sheet.getCell('A1');
        titulo.value = '📈 ANÁLISIS Y GRÁFICOS';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        sheet.getCell('A3').value = 'RESUMEN GENERAL';
        sheet.getCell('A3').font = { bold: true, size: 12 };
        sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
        
        sheet.getCell('A4').value = 'Concepto';
        sheet.getCell('B4').value = 'Monto (S/.)';
        ['A4', 'B4'].forEach(cell => {
            const c = sheet.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            c.alignment = { horizontal: 'center' };
            c.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        sheet.getCell('A5').value = 'Ingresos';
        sheet.getCell('B5').value = balance.ingresos;
        sheet.getCell('B5').numFmt = '"S/. "#,##0.00';
        sheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
        sheet.getCell('A5').font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getCell('B5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
        sheet.getCell('B5').font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getCell('B5').alignment = { horizontal: 'right' };

        sheet.getCell('A6').value = 'Gastos';
        sheet.getCell('B6').value = balance.gastos;
        sheet.getCell('B6').numFmt = '"S/. "#,##0.00';
        sheet.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };
        sheet.getCell('A6').font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };
        sheet.getCell('B6').font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getCell('B6').alignment = { horizontal: 'right' };

        sheet.getCell('A7').value = 'Balance';
        sheet.getCell('B7').value = balance.balance;
        sheet.getCell('B7').numFmt = '"S/. "#,##0.00';
        sheet.getCell('A7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } };
        sheet.getCell('A7').font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getCell('B7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } };
        sheet.getCell('B7').font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getCell('B7').alignment = { horizontal: 'right' };

        for (let row = 5; row <= 7; row++) {
            for (let col = 1; col <= 2; col++) {
                sheet.getCell(row, col).border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            }
        }

     try {
            const imageBase64 = this._crearGraficoCircular(balance);
            const imageId = workbook.addImage({
                base64: imageBase64,
                extension: 'png',
            });
            
            sheet.addImage(imageId, 'D4:H16');
            console.log('✅ Gráfico agregado exitosamente');
        } catch (error) {
            console.error('⚠️ Error al agregar gráfico:', error);
        }
        sheet.getCell('A9').value = 'DISTRIBUCIÓN PORCENTUAL';
        sheet.getCell('A9').font = { bold: true, size: 12 };
        sheet.getCell('A9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        sheet.getCell('A10').value = 'Tipo';
        sheet.getCell('B10').value = 'Porcentaje';
        ['A10', 'B10'].forEach(cell => {
            const c = sheet.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            c.alignment = { horizontal: 'center' };
            c.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        const total = balance.ingresos + balance.gastos;
        const pctIngresos = total > 0 ? ((balance.ingresos / total) * 100).toFixed(1) : 0;
        const pctGastos = total > 0 ? ((balance.gastos / total) * 100).toFixed(1) : 0;

        sheet.getCell('A11').value = 'Ingresos';
        sheet.getCell('B11').value = `${pctIngresos}%`;
        sheet.getCell('B11').alignment = { horizontal: 'right' };
        
        sheet.getCell('A12').value = 'Gastos';
        sheet.getCell('B12').value = `${pctGastos}%`;
        sheet.getCell('B12').alignment = { horizontal: 'right' };

        for (let row = 11; row <= 12; row++) {
            for (let col = 1; col <= 2; col++) {
                sheet.getCell(row, col).border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            }
        }

        sheet.getCell('A14').value = 'INDICADORES CLAVE (KPIs)';
        sheet.getCell('A14').font = { bold: true, size: 12 };
        sheet.getCell('A14').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        sheet.getCell('A15').value = 'Indicador';
        sheet.getCell('B15').value = 'Valor';
        sheet.getCell('C15').value = 'Estado';
        ['A15', 'B15', 'C15'].forEach(cell => {
            const c = sheet.getCell(cell);
            c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            c.alignment = { horizontal: 'center' };
            c.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        const ratio = balance.gastos > 0 ? (balance.ingresos / balance.gastos).toFixed(2) : 'N/A';
        sheet.getCell('A16').value = 'Ratio Ingresos/Gastos';
        sheet.getCell('B16').value = ratio;
        sheet.getCell('C16').value = ratio >= 1.5 ? '🟢 Excelente' : ratio >= 1 ? '🟡 Aceptable' : '🔴 Crítico';

        const promedioTrans = transacciones.length > 0 ? ((balance.ingresos + balance.gastos) / transacciones.length) : 0;
        sheet.getCell('A17').value = 'Promedio por Transacción';
        sheet.getCell('B17').value = promedioTrans;
        sheet.getCell('B17').numFmt = '"S/. "#,##0.00';
        sheet.getCell('C17').value = '📊 Informativo';

        const tasaAhorro = balance.ingresos > 0 ? ((balance.balance / balance.ingresos) * 100).toFixed(1) : 0;
        sheet.getCell('A18').value = 'Tasa de Ahorro';
        sheet.getCell('B18').value = `${tasaAhorro}%`;
        sheet.getCell('C18').value = tasaAhorro > 20 ? '🟢 Muy bien' : tasaAhorro > 0 ? '🟡 Mejorable' : '🔴 Déficit';

        for (let row = 16; row <= 18; row++) {
            for (let col = 1; col <= 3; col++) {
                sheet.getCell(row, col).border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            }
        }

        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 20;
    }

    _crearGraficoCircular(balance) {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 500, 400);

        const total = balance.ingresos + balance.gastos;
        if (total === 0) {
            ctx.fillStyle = '#000000';
            ctx.font = '16px Arial';
            ctx.fillText('Sin datos', 220, 200);
            return canvas.toDataURL().split(',')[1];
        }

        const pctIngresos = balance.ingresos / total;
        const pctGastos = balance.gastos / total;

        const centerX = 250;
        const centerY = 180;
        const radius = 100;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, pctIngresos * 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#10B981';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, pctIngresos * 2 * Math.PI, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.fillRect(80, 320, 25, 25);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(80, 320, 25, 25);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Ingresos: S/. ${balance.ingresos.toFixed(2)} (${(pctIngresos * 100).toFixed(1)}%)`, 115, 338);

        ctx.fillStyle = '#EF4444';
        ctx.fillRect(80, 355, 25, 25);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(80, 355, 25, 25);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Gastos: S/. ${balance.gastos.toFixed(2)} (${(pctGastos * 100).toFixed(1)}%)`, 115, 373);

        ctx.fillStyle = '#667EEA';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('DISTRIBUCIÓN FINANCIERA', 250, 30);

        return canvas.toDataURL().split(',')[1];
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
console.log('✅ Exportador Excel Profesional v3.0 con gráficos cargado');
