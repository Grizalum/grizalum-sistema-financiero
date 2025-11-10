/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTADOR PROFESIONAL DE EXCEL - PANEL DE CONTROL GRIZALUM
 * Usa ExcelJS para estilos REALES con colores
 * VERSION: 1.0.0 - Adaptativo por plan
 * ═══════════════════════════════════════════════════════════════════
 */

class ExportadorPanelControl {
    constructor() {
        this.colores = {
            primario: '667EEA',
            verde: '10B981',
            rojo: 'EF4444',
            morado: '8B5CF6',
            amarillo: 'F59E0B',
            fondoOscuro: '1F2937',
            blanco: 'FFFFFF',
            gris: 'D1D5DB'
        };
    }

    async exportar(datos) {
        try {
            console.log('📊 Generando Excel profesional del Panel de Control...');

            if (typeof ExcelJS === 'undefined') {
                throw new Error('ExcelJS no está disponible');
            }

            // Determinar plan/nivel
            const nivel = datos.nivel || 0;
            const plan = this._determinarPlan(nivel);
            console.log(`📋 Exportando para plan: ${plan} (nivel ${nivel})`);

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'GRIZALUM Sistema Financiero';
            workbook.created = new Date();

            // ✅ Hoja 1: Dashboard Ejecutivo (TODOS)
            const hoja1 = workbook.addWorksheet('📊 Dashboard Ejecutivo', {
                views: [{ showGridLines: false }]
            });
            this._crearDashboard(hoja1, datos, plan);

            // ✅ Hoja 2: Flujo de Caja Detallado (TODOS)
            const hoja2 = workbook.addWorksheet('💰 Flujo de Caja', {
                views: [{ showGridLines: false }]
            });
            this._crearFlujoCaja(hoja2, datos, plan);

            // ✅ Hoja 3: Análisis por Categorías (Profesional+)
            if (plan !== 'Individual') {
                const hoja3 = workbook.addWorksheet('📂 Categorías', {
                    views: [{ showGridLines: false }]
                });
                this._crearCategorias(hoja3, datos, plan);
            }

            // ✅ Hoja 4: KPIs y Proyecciones (Empresarial+)
            if (plan === 'Empresarial' || plan === 'Corporativo') {
                const hoja4 = workbook.addWorksheet('📈 KPIs & Proyecciones', {
                    views: [{ showGridLines: false }]
                });
                await this._crearKPIs(hoja4, datos, workbook, plan);
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GRIZALUM_PanelControl_${datos.empresa}_${plan}_${this._fecha()}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

            console.log('✅ Excel profesional generado exitosamente');
            return true;

        } catch (error) {
            console.error('❌ Error exportando:', error);
            throw error;
        }
    }

    _determinarPlan(nivel) {
        if (nivel >= 70) return 'Corporativo';
        if (nivel >= 50) return 'Empresarial';
        if (nivel >= 30) return 'Profesional';
        return 'Individual';
    }

    _crearDashboard(sheet, datos, plan) {
        // Título principal
        sheet.mergeCells('A1:F1');
        const titulo = sheet.getCell('A1');
        titulo.value = `PANEL DE CONTROL EJECUTIVO [${plan.toUpperCase()}]`;
        titulo.font = { name: 'Inter', size: 20, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 45;

        // Información de la empresa
        sheet.getCell('A3').value = 'Empresa:';
        sheet.getCell('B3').value = datos.empresa || 'N/A';
        sheet.getCell('D3').value = 'Fecha de Reporte:';
        sheet.getCell('E3').value = new Date().toLocaleDateString('es-PE');
        sheet.getCell('D4').value = 'Plan:';
        sheet.getCell('E4').value = plan;

        ['A3', 'B3', 'D3', 'E3', 'D4', 'E4'].forEach(cell => {
            const c = sheet.getCell(cell);
            c.border = this._bordes();
            if (cell.startsWith('A') || cell.startsWith('D')) {
                c.font = { bold: true };
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };
            }
        });

        // Sección de Métricas Principales
        sheet.mergeCells('A6:F6');
        const subtitulo = sheet.getCell('A6');
        subtitulo.value = '📊 MÉTRICAS PRINCIPALES';
        subtitulo.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
        subtitulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } };
        subtitulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(6).height = 30;

        // Headers
        const headers = ['MÉTRICA', 'VALOR ACTUAL', 'CAMBIO %', 'ESTADO', 'META ANUAL'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(8, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = this._bordes();
        });

        // Datos de métricas
        const metricas = [
            {
                nombre: '💰 Ingresos Totales',
                valor: datos.datos.ingresos,
                cambio: datos.datos.crecimiento,
                estado: datos.datos.crecimiento >= 0 ? '✅ POSITIVO' : '⚠️ ATENCIÓN',
                meta: datos.datos.ingresos * 1.2
            },
            {
                nombre: '💸 Gastos Operativos',
                valor: datos.datos.gastos,
                cambio: datos.datos.crecimiento * 0.3,
                estado: '📊 NORMAL',
                meta: datos.datos.gastos * 0.9
            },
            {
                nombre: '💎 Utilidad Neta',
                valor: datos.datos.utilidad,
                cambio: datos.datos.crecimiento * 1.5,
                estado: datos.datos.utilidad > 0 ? '🟢 SUPERÁVIT' : '🔴 DÉFICIT',
                meta: datos.datos.ingresos * 0.3
            },
            {
                nombre: '📈 Crecimiento',
                valor: `${datos.datos.crecimiento}%`,
                cambio: datos.datos.crecimiento,
                estado: datos.datos.crecimiento >= 10 ? '🚀 EXCELENTE' : '📊 ESTABLE',
                meta: '20%'
            }
        ];

        let row = 9;
        metricas.forEach(metrica => {
            sheet.getCell(row, 1).value = metrica.nombre;
            
            const valorCell = sheet.getCell(row, 2);
            if (typeof metrica.valor === 'number') {
                valorCell.value = metrica.valor;
                valorCell.numFmt = '"S/. "#,##0.00';
            } else {
                valorCell.value = metrica.valor;
            }
            valorCell.font = { bold: true, size: 12 };
            valorCell.alignment = { horizontal: 'right' };

            sheet.getCell(row, 3).value = `${metrica.cambio >= 0 ? '+' : ''}${metrica.cambio.toFixed(1)}%`;
            sheet.getCell(row, 3).alignment = { horizontal: 'center' };
            sheet.getCell(row, 3).font = { 
                color: { argb: metrica.cambio >= 0 ? 'FF10B981' : 'FFEF4444' },
                bold: true
            };

            sheet.getCell(row, 4).value = metrica.estado;
            sheet.getCell(row, 4).alignment = { horizontal: 'center' };

            const metaCell = sheet.getCell(row, 5);
            if (typeof metrica.meta === 'number') {
                metaCell.value = metrica.meta;
                metaCell.numFmt = '"S/. "#,##0.00';
            } else {
                metaCell.value = metrica.meta;
            }
            metaCell.alignment = { horizontal: 'right' };

            for (let col = 1; col <= 5; col++) {
                sheet.getCell(row, col).border = this._bordes();
            }

            row++;
        });

        // Ajustar anchos
        sheet.getColumn(1).width = 25;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 18;
        sheet.getColumn(5).width = 18;
    }

    _crearFlujoCaja(sheet, datos, plan) {
        // Título
        sheet.mergeCells('A1:H1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'FLUJO DE CAJA - ANÁLISIS DETALLADO';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        // Resumen mensual
        sheet.getCell('A3').value = '📅 RESUMEN MENSUAL - ÚLTIMOS 6 MESES';
        sheet.getCell('A3').font = { bold: true, size: 12 };
        sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        const headers = ['MES', 'INGRESOS', 'GASTOS', 'BALANCE', 'VARIACIÓN %', 'ESTADO'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(4, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = this._bordes();
        });

        // Datos mensuales
        const flujoMensual = datos.flujoCaja || [];
        let row = 5;
        let balanceAnterior = 0;

        flujoMensual.forEach((mes, index) => {
            sheet.getCell(row, 1).value = mes.mes;
            
            sheet.getCell(row, 2).value = mes.ingresos;
            sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 2).font = { color: { argb: 'FF10B981' }, bold: true };
            
            sheet.getCell(row, 3).value = mes.gastos;
            sheet.getCell(row, 3).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 3).font = { color: { argb: 'FFEF4444' }, bold: true };
            
            sheet.getCell(row, 4).value = mes.balance;
            sheet.getCell(row, 4).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 4).font = { bold: true };

            const variacion = balanceAnterior !== 0 ? 
                ((mes.balance - balanceAnterior) / balanceAnterior * 100) : 0;
            
            sheet.getCell(row, 5).value = `${variacion >= 0 ? '+' : ''}${variacion.toFixed(1)}%`;
            sheet.getCell(row, 5).font = { 
                color: { argb: variacion >= 0 ? 'FF10B981' : 'FFEF4444' },
                bold: true
            };
            sheet.getCell(row, 5).alignment = { horizontal: 'center' };

            sheet.getCell(row, 6).value = mes.balance >= 0 ? '✅ POSITIVO' : '⚠️ DÉFICIT';
            sheet.getCell(row, 6).alignment = { horizontal: 'center' };

            for (let col = 1; col <= 6; col++) {
                sheet.getCell(row, col).border = this._bordes();
            }

            balanceAnterior = mes.balance;
            row++;
        });

        // Totales
        row++;
        sheet.getCell(row, 1).value = 'TOTALES';
        sheet.getCell(row, 1).font = { bold: true };
        sheet.getCell(row, 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } };

        const totalIngresos = flujoMensual.reduce((sum, m) => sum + m.ingresos, 0);
        const totalGastos = flujoMensual.reduce((sum, m) => sum + m.gastos, 0);

        sheet.getCell(row, 2).value = totalIngresos;
        sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
        sheet.getCell(row, 2).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getCell(row, 2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };

        sheet.getCell(row, 3).value = totalGastos;
        sheet.getCell(row, 3).numFmt = '"S/. "#,##0.00';
        sheet.getCell(row, 3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getCell(row, 3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };

        sheet.getCell(row, 4).value = totalIngresos - totalGastos;
        sheet.getCell(row, 4).numFmt = '"S/. "#,##0.00';
        sheet.getCell(row, 4).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        sheet.getCell(row, 4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } };

        // Ajustar anchos
        sheet.getColumn(1).width = 18;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 18;
        sheet.getColumn(4).width = 18;
        sheet.getColumn(5).width = 15;
        sheet.getColumn(6).width = 18;
    }

    _crearCategorias(sheet, datos, plan) {
        // Título
        sheet.mergeCells('A1:E1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'ANÁLISIS POR CATEGORÍAS';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        // Sección Ingresos
        sheet.getCell('A3').value = '📈 INGRESOS POR CATEGORÍA';
        sheet.getCell('A3').font = { bold: true, size: 12 };
        sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
        sheet.getCell('A3').font.color = { argb: 'FFFFFFFF' };

        const headersIngresos = ['CATEGORÍA', 'MONTO (S/.)', 'CANTIDAD', '% DEL TOTAL', 'PROMEDIO'];
        headersIngresos.forEach((header, i) => {
            const cell = sheet.getCell(4, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = this._bordes();
        });

        // Datos de ingresos
        const categoriasIngresos = datos.categoriasIngresos || [];
        let row = 5;
        const totalIngresos = categoriasIngresos.reduce((sum, c) => sum + c.monto, 0);

        categoriasIngresos.forEach(cat => {
            sheet.getCell(row, 1).value = cat.categoria;
            sheet.getCell(row, 2).value = cat.monto;
            sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 3).value = cat.cantidad;
            sheet.getCell(row, 4).value = this._porcentaje(cat.monto, totalIngresos);
            sheet.getCell(row, 5).value = cat.monto / cat.cantidad;
            sheet.getCell(row, 5).numFmt = '"S/. "#,##0.00';

            for (let col = 1; col <= 5; col++) {
                sheet.getCell(row, col).border = this._bordes();
                if (col >= 2) sheet.getCell(row, col).alignment = { horizontal: 'right' };
            }
            row++;
        });

        // Sección Gastos
        row += 2;
        sheet.getCell(row, 1).value = '📉 GASTOS POR CATEGORÍA';
        sheet.getCell(row, 1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        sheet.getCell(row, 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };

        row++;
        headersIngresos.forEach((header, i) => {
            const cell = sheet.getCell(row, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = this._bordes();
        });

        // Datos de gastos
        row++;
        const categoriasGastos = datos.categoriasGastos || [];
        const totalGastos = categoriasGastos.reduce((sum, c) => sum + c.monto, 0);

        categoriasGastos.forEach(cat => {
            sheet.getCell(row, 1).value = cat.categoria;
            sheet.getCell(row, 2).value = cat.monto;
            sheet.getCell(row, 2).numFmt = '"S/. "#,##0.00';
            sheet.getCell(row, 3).value = cat.cantidad;
            sheet.getCell(row, 4).value = this._porcentaje(cat.monto, totalGastos);
            sheet.getCell(row, 5).value = cat.monto / cat.cantidad;
            sheet.getCell(row, 5).numFmt = '"S/. "#,##0.00';

            for (let col = 1; col <= 5; col++) {
                sheet.getCell(row, col).border = this._bordes();
                if (col >= 2) sheet.getCell(row, col).alignment = { horizontal: 'right' };
            }
            row++;
        });

        // Ajustar anchos
        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 18;
        sheet.getColumn(3).width = 15;
        sheet.getColumn(4).width = 15;
        sheet.getColumn(5).width = 18;
    }

    async _crearKPIs(sheet, datos, workbook, plan) {
        // Título
        sheet.mergeCells('A1:C1');
        const titulo = sheet.getCell('A1');
        titulo.value = 'KPIs Y ANÁLISIS AVANZADO';
        titulo.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } };
        titulo.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        // Indicadores clave
        sheet.getCell('A3').value = 'INDICADORES FINANCIEROS CLAVE';
        sheet.getCell('A3').font = { bold: true, size: 12 };
        sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1D5DB' } };

        const headers = ['INDICADOR', 'VALOR', 'EVALUACIÓN'];
        headers.forEach((header, i) => {
            const cell = sheet.getCell(4, i + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = this._bordes();
        });

        // Calcular KPIs
        const ingresos = datos.datos.ingresos;
        const gastos = datos.datos.gastos;
        const utilidad = datos.datos.utilidad;

        const kpis = [
            {
                nombre: 'Ratio Ingresos/Gastos',
                valor: gastos > 0 ? (ingresos / gastos).toFixed(2) : 'N/A',
                evaluacion: (ingresos / gastos) >= 1.5 ? '🟢 Excelente' : (ingresos / gastos) >= 1 ? '🟡 Aceptable' : '🔴 Crítico'
            },
            {
                nombre: 'Margen de Utilidad',
                valor: ingresos > 0 ? `${((utilidad / ingresos) * 100).toFixed(1)}%` : '0%',
                evaluacion: (utilidad / ingresos) >= 0.2 ? '🟢 Muy bueno' : (utilidad / ingresos) > 0 ? '🟡 Mejorable' : '🔴 Déficit'
            },
            {
                nombre: 'Tasa de Crecimiento',
                valor: `${datos.datos.crecimiento}%`,
                evaluacion: datos.datos.crecimiento >= 15 ? '🚀 Excelente' : datos.datos.crecimiento >= 5 ? '🟢 Bueno' : '🟡 Estable'
            },
            {
                nombre: 'Eficiencia Operativa',
                valor: ingresos > 0 ? `${((1 - (gastos / ingresos)) * 100).toFixed(1)}%` : '0%',
                evaluacion: (1 - (gastos / ingresos)) >= 0.3 ? '🟢 Eficiente' : '🟡 Optimizable'
            }
        ];

        let row = 5;
        kpis.forEach(kpi => {
            sheet.getCell(row, 1).value = kpi.nombre;
            sheet.getCell(row, 2).value = kpi.valor;
            sheet.getCell(row, 2).alignment = { horizontal: 'center' };
            sheet.getCell(row, 2).font = { bold: true };
            sheet.getCell(row, 3).value = kpi.evaluacion;
            sheet.getCell(row, 3).alignment = { horizontal: 'center' };

            for (let col = 1; col <= 3; col++) {
                sheet.getCell(row, col).border = this._bordes();
            }
            row++;
        });

        // Ajustar anchos
        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 20;
        sheet.getColumn(3).width = 20;
    }

    _bordes() {
        return {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
        };
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

window.ExportadorPanelControl = ExportadorPanelControl;
console.log('✅ Exportador Panel Control v1.0.0 - Adaptativo por plan');
