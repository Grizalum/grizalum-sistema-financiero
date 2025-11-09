/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTADOR PROFESIONAL DE EXCEL - FLUJO DE CAJA GRIZALUM
 * Usa ExcelJS para estilos REALES con colores
 * VERSION: 4.0 - Adaptativo por plan + Gráfico posicionado correctamente
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

    // ✅ AMBOS MÉTODOS DISPONIBLES PARA COMPATIBILIDAD
    async generarExcelProfesional(datos) {
        return await this.exportar(datos);
    }

    async exportar(datos) {
        try {
            console.log('📊 Generando Excel profesional con ExcelJS...');

            // ✅ NUEVO: Determinar plan/nivel
            const nivel = datos.nivel || 0;
            const plan = this._determinarPlan(nivel);
            console.log(`📋 Exportando para plan: ${plan} (nivel ${nivel})`);

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'GRIZALUM Sistema Financiero';
            workbook.created = new Date();

            // ✅ Dashboard (TODOS los planes)
            const hoja1 = workbook.addWorksheet('📊 Dashboard', {
                views: [{ showGridLines: false }]
            });
            this._crearDashboard(hoja1, datos, plan);

            // ✅ Transacciones (TODOS los planes)
            const hoja2 = workbook.addWorksheet('📋 Transacciones', {
                views: [{ showGridLines: false }]
            });
            this._crearTransacciones(hoja2, datos, plan);

            // ✅ Categorías (Profesional+)
            if (plan !== 'Individual') {
                const hoja3 = workbook.addWorksheet('🏷️ Categorías', {
                    views: [{ showGridLines: false }]
                });
                this._crearCategorias(hoja3, datos, plan);
            }

            // ✅ Análisis (Empresarial+)
            if (plan === 'Empresarial' || plan === 'Corporativo') {
                const hoja4 = workbook.addWorksheet('📈 Análisis', {
                    views: [{ showGridLines: false }]
                });
                await this._crearAnalisis(hoja4, datos, workbook, plan);
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GRIZALUM_FlujoCaja_${datos.empresa}_${plan}_${this._fecha()}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

            console.log('✅ Excel profesional generado exitosamente');
            return true;

        } catch (error) {
            console.error('❌ Error exportando:', error);
            throw error;
        }
    }

    /**
     * Determinar plan según nivel
     */
    _determinarPlan(nivel) {
        if (nivel >= 70) return 'Corporativo';
        if (nivel >= 50) return 'Empresarial';
        if (nivel >= 30) return 'Profesional';
        return 'Individual';
    }

    _crearDashboard(sheet, datos, plan) {
        const balance = datos.balance || {};

        // Título con indicador de plan
        sheet.mergeCells('A1:F1');
        const titulo = sheet.getCell('A1');
        titulo.value = `FLUJO DE CAJA - DASHBOARD EJECUTIVO [${plan.toUpperCase()}]`;
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

        sheet.getColumn(1).width = 25;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 15;
        sheet.getColumn(5).width = 20;
    }

    _crearTransacciones(sheet, datos, plan) {
        const transacciones = datos.transacciones || [];

        sheet.mergeCells('A1:G1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'REGISTRO DE TRANSACCIONES';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        const headers = ['FECHA', 'TIPO', 'CATEGORÍA', 'DESCRIPCIÓN', 'MONTO (S/.)', 'MÉTODO', 'NOTAS'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(3, i + 1);
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

        transacciones.forEach((t, index) => {
            const row = index + 4;
            const esIngreso = t.tipo === 'ingreso';

            sheet.getCell(row, 1).value = new Date(t.fecha).toLocaleDateString('es-PE');
            sheet.getCell(row, 2).value = esIngreso ? '📈 INGRESO' : '📉 GASTO';
            sheet.getCell(row, 3).value = t.categoria;
            sheet.getCell(row, 4).value = t.descripcion || '';
            sheet.getCell(row, 5).value = t.monto;
            sheet.getCell(row, 5).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 6).value = t.metodoPago || 'Efectivo';
            sheet.getCell(row, 7).value = t.notas || '';

            for (let col = 1; col <= 7; col++) {
                const cell = sheet.getCell(row, col);
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                };

                if (col === 2) {
                    cell.fill = { 
                        type: 'pattern', 
                        pattern: 'solid', 
                        fgColor: { argb: esIngreso ? 'FFD1FAE5' : 'FFFECACA' } 
                    };
                    cell.font = { bold: true };
                }

                if (col === 5) {
                    cell.font = { 
                        bold: true, 
                        color: { argb: esIngreso ? 'FF10B981' : 'FFEF4444' } 
                    };
                    cell.alignment = { horizontal: 'right' };
                }
            }
        });

        sheet.getColumn(1).width = 15;
        sheet.getColumn(2).width = 15;
        sheet.getColumn(3).width = 20;
        sheet.getColumn(4).width = 30;
        sheet.getColumn(5).width = 18;
        sheet.getColumn(6).width = 15;
        sheet.getColumn(7).width = 30;
    }

    _crearCategorias(sheet, datos, plan) {
        const transacciones = datos.transacciones || [];
        const balance = datos.balance || {};

        sheet.mergeCells('A1:E1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'ANÁLISIS POR CATEGORÍAS';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        const categoriasIngresos = this._agruparPorCategoria(transacciones.filter(t => t.tipo === 'ingreso'));
        const categoriasGastos = this._agruparPorCategoria(transacciones.filter(t => t.tipo === 'gasto'));

        sheet.getCell('A3').value = '📈 INGRESOS POR CATEGORÍA';
        sheet.getCell('A3').font = { bold: true, size: 12 };
        sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };

        const headersIngresos = ['CATEGORÍA', 'MONTO (S/.)', 'CANTIDAD', '% DEL INGRESO', 'PROMEDIO'];
        headersIngresos.forEach((header, i) => {
            const cell = sheet.getCell(4, i + 1);
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

        let row = 5;
        categoriasIngresos.forEach(cat => {
            sheet.getCell(row, 1).value = cat.categoria;
            sheet.getCell(row, 2).value = cat.monto;
            sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 3).value = cat.cantidad;
            sheet.getCell(row, 4).value = this._porcentaje(cat.monto, balance.ingresos);
            sheet.getCell(row, 5).value = cat.monto / cat.cantidad;
            sheet.getCell(row, 5).numFmt = '"S/. "#,##0.00';

            for (let col = 1; col <= 5; col++) {
                const cell = sheet.getCell(row, col);
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                };
                if (col >= 2) {
                    cell.alignment = { horizontal: 'right' };
                }
            }
            row++;
        });

        row += 2;
        sheet.getCell(row, 1).value = '📉 GASTOS POR CATEGORÍA';
        sheet.getCell(row, 1).font = { bold: true, size: 12 };
        sheet.getCell(row, 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };

        row++;
        headersIngresos.forEach((header, i) => {
            const cell = sheet.getCell(row, i + 1);
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

        row++;
        categoriasGastos.forEach(cat => {
            sheet.getCell(row, 1).value = cat.categoria;
            sheet.getCell(row, 2).value = cat.monto;
            sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 3).value = cat.cantidad;
            sheet.getCell(row, 4).value = this._porcentaje(cat.monto, balance.gastos);
            sheet.getCell(row, 5).value = cat.monto / cat.cantidad;
            sheet.getCell(row, 5).numFmt = '"S/. "#,##0.00';

            for (let col = 1; col <= 5; col++) {
                const cell = sheet.getCell(row, col);
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                };
                if (col >= 2) {
                    cell.alignment = { horizontal: 'right' };
                }
            }
            row++;
        });

        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 18;
        sheet.getColumn(5).width = 18;
    }

    async _crearAnalisis(sheet, datos, workbook, plan) {
        const balance = datos.balance || {};
        const transacciones = datos.transacciones || [];

        sheet.mergeCells('A1:C1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'ANÁLISIS FINANCIERO';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        // ✅ SECCIÓN 1: DISTRIBUCIÓN PORCENTUAL (Lado izquierdo)
        sheet.getCell('A3').value = 'DISTRIBUCIÓN PORCENTUAL';
        sheet.getCell('A3').font = { bold: true, size: 12 };
        sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        sheet.getCell('A4').value = 'Tipo';
        sheet.getCell('B4').value = 'Porcentaje';
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

        const total = balance.ingresos + balance.gastos;
        const pctIngresos = total > 0 ? ((balance.ingresos / total) * 100).toFixed(1) : 0;
        const pctGastos = total > 0 ? ((balance.gastos / total) * 100).toFixed(1) : 0;

        sheet.getCell('A5').value = 'Ingresos';
        sheet.getCell('B5').value = `${pctIngresos}%`;
        sheet.getCell('B5').alignment = { horizontal: 'right' };
        
        sheet.getCell('A6').value = 'Gastos';
        sheet.getCell('B6').value = `${pctGastos}%`;
        sheet.getCell('B6').alignment = { horizontal: 'right' };

        for (let row = 5; row <= 6; row++) {
            for (let col = 1; col <= 2; col++) {
                sheet.getCell(row, col).border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            }
        }

        // ✅ SECCIÓN 2: INDICADORES CLAVE (Lado izquierdo, debajo)
        sheet.getCell('A9').value = 'INDICADORES CLAVE (KPIs)';
        sheet.getCell('A9').font = { bold: true, size: 12 };
        sheet.getCell('A9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        sheet.getCell('A10').value = 'Indicador';
        sheet.getCell('B10').value = 'Valor';
        sheet.getCell('C10').value = 'Estado';
        ['A10', 'B10', 'C10'].forEach(cell => {
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
        sheet.getCell('A11').value = 'Ratio Ingresos/Gastos';
        sheet.getCell('B11').value = ratio;
        sheet.getCell('C11').value = ratio >= 1.5 ? '🟢 Excelente' : ratio >= 1 ? '🟡 Aceptable' : '🔴 Crítico';

        const promedioTrans = transacciones.length > 0 ? ((balance.ingresos + balance.gastos) / transacciones.length) : 0;
        sheet.getCell('A12').value = 'Promedio por Transacción';
        sheet.getCell('B12').value = promedioTrans;
        sheet.getCell('B12').numFmt = '"S/. "#,##0.00';
        sheet.getCell('C12').value = '📊 Informativo';

        const tasaAhorro = balance.ingresos > 0 ? ((balance.balance / balance.ingresos) * 100).toFixed(1) : 0;
        sheet.getCell('A13').value = 'Tasa de Ahorro';
        sheet.getCell('B13').value = `${tasaAhorro}%`;
        sheet.getCell('C13').value = tasaAhorro > 20 ? '🟢 Muy bien' : tasaAhorro > 0 ? '🟡 Mejorable' : '🔴 Déficit';

        for (let row = 11; row <= 13; row++) {
            for (let col = 1; col <= 3; col++) {
                sheet.getCell(row, col).border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            }
        }

        // ✅ CORREGIDO: GRÁFICO EN COLUMNA H (al lado derecho)
        sheet.getCell('H3').value = 'DISTRIBUCIÓN FINANCIERA';
        sheet.getCell('H3').font = { bold: true, size: 12 };
        sheet.getCell('H3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        try {
            const imagenBase64 = this._crearGraficoCircular(balance);
            const imageId = workbook.addImage({
                base64: imagenBase64,
                extension: 'png'
            });

            // ✅ POSICIÓN CORREGIDA: Columna H (índice 7), fila 4
            sheet.addImage(imageId, {
                tl: { col: 7, row: 3 },  // Columna H = índice 7, fila 4 = índice 3
                ext: { width: 500, height: 400 }
            });

            console.log('✅ Gráfico agregado exitosamente en columna H');
        } catch (error) {
            console.error('⚠️ Error al agregar gráfico:', error);
        }

        // Ajustar anchos de columna
        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 20;
        sheet.getColumn(7).width = 5;  // Separación
        sheet.getColumn(8).width = 40; // Gráfico
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

    _agruparPorCategoria(transacciones) {
        const categorias = {};
        
        transacciones.forEach(t => {
            if (!categorias[t.categoria]) {
                categorias[t.categoria] = {
                    categoria: t.categoria,
                    monto: 0,
                    cantidad: 0
                };
            }
            categorias[t.categoria].monto += t.monto;
            categorias[t.categoria].cantidad++;
        });

        return Object.values(categorias).sort((a, b) => b.monto - a.monto);
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
console.log('✅ Exportador Excel Profesional v4.0 - Adaptativo por plan + Gráfico corregido');
