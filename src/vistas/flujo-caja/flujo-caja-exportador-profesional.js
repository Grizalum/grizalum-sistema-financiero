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

   _crearCategorias(sheet, datos) {
    const transacciones = datos.transacciones || [];

    // Título
    sheet.mergeCells('A1:E1');
    const titulo = sheet.getCell('A1');
    titulo.value = '🏷️ ANÁLISIS POR CATEGORÍA';
    titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
    titulo.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 35;

    // Headers
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

    // Agrupar por categoría + tipo
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

        // Color según tipo
        const color = c.tipo === 'ingreso' ? 'FF10B981' : 'FFEF4444';
        [2, 4].forEach(col => {
            sheet.getCell(row, col).font = { bold: true, color: { argb: color } };
        });

        // Bordes
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

_crearAnalisis(sheet, datos) {
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

    sheet.getCell('A20').value = '📊 INSTRUCCIONES PARA GRÁFICOS:';
    sheet.getCell('A20').font = { bold: true, size: 11, color: { argb: 'FF667EEA' } };
    
    sheet.getCell('A21').value = '1. Selecciona las celdas A4:B7 (tabla de resumen)';
    sheet.getCell('A22').value = '2. Ve a Insertar > Gráfico > Circular';
    sheet.getCell('A23').value = '3. Elige "Gráfico circular 3D" o "Gráfico de anillos"';
    sheet.getCell('A24').value = '4. ¡Listo! Tendrás un gráfico como tu referencia';

    sheet.getColumn(1).width = 30;
    sheet.getColumn(2).width = 20;
    sheet.getColumn(3).width = 20;
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
