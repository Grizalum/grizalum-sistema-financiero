/**
 * ═══════════════════════════════════════════════════════════════════
 * EXPORTADOR PROFESIONAL DE EXCEL - FLUJO DE CAJA GRIZALUM
 * Genera archivos Excel con formato ejecutivo premium
 * VERSION: 2.0 PROFESSIONAL
 * ═══════════════════════════════════════════════════════════════════
 */

class ExportadorExcelProfesional {
    constructor() {
        // Paleta de colores GRIZALUM (modo oscuro de tu app)
        this.colores = {
            // Colores principales
            primario: 'FF667EEA',        // Morado/Azul principal
            secundario: 'FF764BA2',      // Morado secundario
            
            // Colores de datos
            ingreso: 'FF10B981',         // Verde (ingresos)
            gasto: 'FFEF4444',           // Rojo (gastos)
            balance: 'FF8B5CF6',         // Morado (balance)
            
            // Colores de fondo
            header: 'FF1F2937',          // Gris oscuro header
            subheader: 'FF374151',       // Gris medio
            background: 'FF111827',      // Fondo oscuro
            card: 'FF1F2937',            // Card background
            
            // Textos
            textoBlanco: 'FFFFFFFF',
            textoGris: 'FFD1D5DB',
            textoOscuro: 'FF111827',
            
            // Bordes
            borde: 'FF4B5563',
            
            // Acentos
            warning: 'FFF59E0B',
            info: 'FF3B82F6',
            success: 'FF10B981',
            danger: 'FFEF4444'
        };
        
        // Estilos base
        this.estilos = this._crearEstilos();
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CREAR ESTILOS BASE
     * ═══════════════════════════════════════════════════════════════
     */
    _crearEstilos() {
        return {
            // Título principal (H1)
            tituloPrincipal: {
                font: { 
                    name: 'Inter',
                    sz: 24, 
                    bold: true, 
                    color: { rgb: this.colores.textoBlanco } 
                },
                fill: { 
                    fgColor: { rgb: this.colores.primario } 
                },
                alignment: { 
                    vertical: 'center', 
                    horizontal: 'center' 
                },
                border: {
                    bottom: { style: 'thick', color: { rgb: this.colores.primario } }
                }
            },
            
            // Subtítulo (H2)
            subtitulo: {
                font: { 
                    name: 'Inter',
                    sz: 18, 
                    bold: true, 
                    color: { rgb: this.colores.textoBlanco } 
                },
                fill: { 
                    fgColor: { rgb: this.colores.secundario } 
                },
                alignment: { 
                    vertical: 'center', 
                    horizontal: 'center' 
                }
            },
            
            // Header de tabla
            headerTabla: {
                font: { 
                    name: 'Inter',
                    sz: 12, 
                    bold: true, 
                    color: { rgb: this.colores.textoBlanco } 
                },
                fill: { 
                    fgColor: { rgb: this.colores.header } 
                },
                alignment: { 
                    vertical: 'center', 
                    horizontal: 'center' 
                },
                border: {
                    top: { style: 'thin', color: { rgb: this.colores.borde } },
                    bottom: { style: 'thin', color: { rgb: this.colores.borde } },
                    left: { style: 'thin', color: { rgb: this.colores.borde } },
                    right: { style: 'thin', color: { rgb: this.colores.borde } }
                }
            },
            
            // Celda normal
            celdaNormal: {
                font: { 
                    name: 'Inter',
                    sz: 11, 
                    color: { rgb: this.colores.textoOscuro } 
                },
                alignment: { 
                    vertical: 'center' 
                },
                border: {
                    top: { style: 'thin', color: { rgb: this.colores.borde } },
                    bottom: { style: 'thin', color: { rgb: this.colores.borde } },
                    left: { style: 'thin', color: { rgb: this.colores.borde } },
                    right: { style: 'thin', color: { rgb: this.colores.borde } }
                }
            },
            
            // Celda de ingreso (verde)
            celdaIngreso: {
                font: { 
                    name: 'Inter',
                    sz: 11, 
                    bold: true,
                    color: { rgb: this.colores.textoBlanco } 
                },
                fill: { 
                    fgColor: { rgb: this.colores.ingreso } 
                },
                alignment: { 
                    vertical: 'center', 
                    horizontal: 'right' 
                },
                border: {
                    top: { style: 'thin', color: { rgb: this.colores.borde } },
                    bottom: { style: 'thin', color: { rgb: this.colores.borde } },
                    left: { style: 'thin', color: { rgb: this.colores.borde } },
                    right: { style: 'thin', color: { rgb: this.colores.borde } }
                },
                numFmt: '"S/. "#,##0.00'
            },
            
            // Celda de gasto (rojo)
            celdaGasto: {
                font: { 
                    name: 'Inter',
                    sz: 11, 
                    bold: true,
                    color: { rgb: this.colores.textoBlanco } 
                },
                fill: { 
                    fgColor: { rgb: this.colores.gasto } 
                },
                alignment: { 
                    vertical: 'center', 
                    horizontal: 'right' 
                },
                border: {
                    top: { style: 'thin', color: { rgb: this.colores.borde } },
                    bottom: { style: 'thin', color: { rgb: this.colores.borde } },
                    left: { style: 'thin', color: { rgb: this.colores.borde } },
                    right: { style: 'thin', color: { rgb: this.colores.borde } }
                },
                numFmt: '"S/. "#,##0.00'
            },
            
            // Total destacado
            totalDestacado: {
                font: { 
                    name: 'Inter',
                    sz: 14, 
                    bold: true, 
                    color: { rgb: this.colores.textoBlanco } 
                },
                fill: { 
                    fgColor: { rgb: this.colores.balance } 
                },
                alignment: { 
                    vertical: 'center', 
                    horizontal: 'right' 
                },
                border: {
                    top: { style: 'thick', color: { rgb: this.colores.primario } },
                    bottom: { style: 'thick', color: { rgb: this.colores.primario } }
                },
                numFmt: '"S/. "#,##0.00'
            },
            
            // Metadatos (info de empresa)
            metadata: {
                font: { 
                    name: 'Inter',
                    sz: 10, 
                    italic: true,
                    color: { rgb: this.colores.textoGris } 
                },
                alignment: { 
                    vertical: 'center' 
                }
            }
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * EXPORTAR A EXCEL PROFESIONAL
     * ═══════════════════════════════════════════════════════════════
     */
    async exportar(datos) {
        try {
            console.log('📊 Iniciando exportación profesional...');
            
            // Crear libro de trabajo
            const wb = XLSX.utils.book_new();
            wb.Props = {
                Title: 'Flujo de Caja - GRIZALUM',
                Subject: 'Reporte Financiero',
                Author: 'GRIZALUM Sistema Financiero',
                CreatedDate: new Date()
            };

            // ═══════════════════════════════════════════════════════════
            // HOJA 1: DASHBOARD EJECUTIVO
            // ═══════════════════════════════════════════════════════════
            const hojaDashboard = this._crearHojaDashboard(datos);
            XLSX.utils.book_append_sheet(wb, hojaDashboard, '📊 Dashboard');

            // ═══════════════════════════════════════════════════════════
            // HOJA 2: TRANSACCIONES DETALLADAS
            // ═══════════════════════════════════════════════════════════
            const hojaTransacciones = this._crearHojaTransacciones(datos);
            XLSX.utils.book_append_sheet(wb, hojaTransacciones, '📋 Transacciones');

            // ═══════════════════════════════════════════════════════════
            // HOJA 3: ANÁLISIS POR CATEGORÍA
            // ═══════════════════════════════════════════════════════════
            const hojaCategorias = this._crearHojaCategorias(datos);
            XLSX.utils.book_append_sheet(wb, hojaCategorias, '🏷️ Categorías');

            // ═══════════════════════════════════════════════════════════
            // HOJA 4: GRÁFICOS Y TENDENCIAS
            // ═══════════════════════════════════════════════════════════
            const hojaGraficos = this._crearHojaGraficos(datos);
            XLSX.utils.book_append_sheet(wb, hojaGraficos, '📈 Análisis');

            // ═══════════════════════════════════════════════════════════
            // GENERAR Y DESCARGAR
            // ═══════════════════════════════════════════════════════════
            const nombreArchivo = `GRIZALUM_FlujoCaja_${datos.empresa}_${this._formatearFecha()}.xlsx`;
            
            XLSX.writeFile(wb, nombreArchivo, {
                bookType: 'xlsx',
                bookSST: false,
                type: 'binary'
            });

            console.log('✅ Excel profesional generado:', nombreArchivo);
            
            return true;
            
        } catch (error) {
            console.error('❌ Error generando Excel:', error);
            throw error;
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CREAR HOJA DASHBOARD EJECUTIVO
     * ═══════════════════════════════════════════════════════════════
     */
    _crearHojaDashboard(datos) {
        const ws = {};
        const balance = datos.balance || { ingresos: 0, gastos: 0, balance: 0 };
        
        // ═══ TÍTULO PRINCIPAL ═══
        ws['A1'] = { 
            v: '💰 FLUJO DE CAJA - DASHBOARD EJECUTIVO', 
            t: 's',
            s: this.estilos.tituloPrincipal
        };
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

        // ═══ METADATOS ═══
        ws['A3'] = { v: 'Empresa:', t: 's', s: this.estilos.metadata };
        ws['B3'] = { v: datos.empresa || 'N/A', t: 's', s: this.estilos.celdaNormal };
        
        ws['A4'] = { v: 'Fecha Exportación:', t: 's', s: this.estilos.metadata };
        ws['B4'] = { v: this._formatearFechaCompleta(), t: 's', s: this.estilos.celdaNormal };
        
        ws['A5'] = { v: 'Total Transacciones:', t: 's', s: this.estilos.metadata };
        ws['B5'] = { v: datos.transacciones?.length || 0, t: 'n', s: this.estilos.celdaNormal };

        // ═══ RESUMEN FINANCIERO ═══
        ws['A7'] = { 
            v: '💎 RESUMEN FINANCIERO', 
            t: 's',
            s: this.estilos.subtitulo
        };
        ws['!merges'].push({ s: { r: 6, c: 0 }, e: { r: 6, c: 5 } });

        // Headers
        const row = 8;
        ws[`A${row}`] = { v: 'CONCEPTO', t: 's', s: this.estilos.headerTabla };
        ws[`B${row}`] = { v: 'MONTO (S/.)', t: 's', s: this.estilos.headerTabla };
        ws[`C${row}`] = { v: 'CANTIDAD', t: 's', s: this.estilos.headerTabla };
        ws[`D${row}`] = { v: '% DEL TOTAL', t: 's', s: this.estilos.headerTabla };
        ws[`E${row}`] = { v: 'ESTADO', t: 's', s: this.estilos.headerTabla };

        // Ingresos
        const rowIngresos = 9;
        ws[`A${rowIngresos}`] = { v: '📈 INGRESOS TOTALES', t: 's', s: this.estilos.celdaNormal };
        ws[`B${rowIngresos}`] = { v: balance.ingresos, t: 'n', s: this.estilos.celdaIngreso };
        ws[`C${rowIngresos}`] = { v: balance.cantidadIngresos || 0, t: 'n', s: this.estilos.celdaNormal };
        ws[`D${rowIngresos}`] = { 
            v: this._calcularPorcentaje(balance.ingresos, balance.ingresos + balance.gastos), 
            t: 's', 
            s: this.estilos.celdaIngreso 
        };
        ws[`E${rowIngresos}`] = { v: '✅ POSITIVO', t: 's', s: this.estilos.celdaIngreso };

        // Gastos
        const rowGastos = 10;
        ws[`A${rowGastos}`] = { v: '📉 GASTOS TOTALES', t: 's', s: this.estilos.celdaNormal };
        ws[`B${rowGastos}`] = { v: balance.gastos, t: 'n', s: this.estilos.celdaGasto };
        ws[`C${rowGastos}`] = { v: balance.cantidadGastos || 0, t: 'n', s: this.estilos.celdaNormal };
        ws[`D${rowGastos}`] = { 
            v: this._calcularPorcentaje(balance.gastos, balance.ingresos + balance.gastos), 
            t: 's', 
            s: this.estilos.celdaGasto 
        };
        ws[`E${rowGastos}`] = { v: '⚠️ NEGATIVO', t: 's', s: this.estilos.celdaGasto };

        // Balance Final
        const rowBalance = 12;
        const esPositivo = balance.balance >= 0;
        ws[`A${rowBalance}`] = { v: '💰 BALANCE FINAL', t: 's', s: this.estilos.totalDestacado };
        ws[`B${rowBalance}`] = { v: balance.balance, t: 'n', s: this.estilos.totalDestacado };
        ws[`C${rowBalance}`] = { v: balance.total || 0, t: 'n', s: this.estilos.totalDestacado };
        ws[`D${rowBalance}`] = { v: '100%', t: 's', s: this.estilos.totalDestacado };
        ws[`E${rowBalance}`] = { 
            v: esPositivo ? '✅ SUPERÁVIT' : '❌ DÉFICIT', 
            t: 's', 
            s: esPositivo ? this.estilos.celdaIngreso : this.estilos.celdaGasto 
        };

        // ═══ INDICADORES CLAVE ═══
        ws['A14'] = { 
            v: '📊 INDICADORES CLAVE (KPIs)', 
            t: 's',
            s: this.estilos.subtitulo
        };
        ws['!merges'].push({ s: { r: 13, c: 0 }, e: { r: 13, c: 5 } });

        // KPI 1: Ratio Ingresos/Gastos
        ws['A16'] = { v: 'Ratio Ingresos/Gastos:', t: 's', s: this.estilos.celdaNormal };
        const ratio = balance.gastos > 0 ? (balance.ingresos / balance.gastos).toFixed(2) : 'N/A';
        ws['B16'] = { v: ratio, t: 's', s: this.estilos.totalDestacado };
        ws['C16'] = { 
            v: ratio >= 1.5 ? '🟢 Excelente' : ratio >= 1 ? '🟡 Aceptable' : '🔴 Crítico', 
            t: 's', 
            s: this.estilos.celdaNormal 
        };

        // KPI 2: Promedio de Ingresos
        ws['A17'] = { v: 'Promedio por Ingreso:', t: 's', s: this.estilos.celdaNormal };
        const promedioIngreso = balance.cantidadIngresos > 0 ? balance.ingresos / balance.cantidadIngresos : 0;
        ws['B17'] = { v: promedioIngreso, t: 'n', s: this.estilos.celdaIngreso };

        // KPI 3: Promedio de Gastos
        ws['A18'] = { v: 'Promedio por Gasto:', t: 's', s: this.estilos.celdaNormal };
        const promedioGasto = balance.cantidadGastos > 0 ? balance.gastos / balance.cantidadGastos : 0;
        ws['B18'] = { v: promedioGasto, t: 'n', s: this.estilos.celdaGasto };

        // Anchos de columna
        ws['!cols'] = [
            { wch: 30 },  // A
            { wch: 20 },  // B
            { wch: 15 },  // C
            { wch: 15 },  // D
            { wch: 20 }   // E
        ];

        // Altura de filas importantes
        ws['!rows'] = [
            { hpt: 40 },  // Fila 1 (título)
            {},
            {},
            {},
            {},
            {},
            { hpt: 35 },  // Fila 7 (subtítulo)
        ];

        return ws;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CREAR HOJA DE TRANSACCIONES
     * ═══════════════════════════════════════════════════════════════
     */
    _crearHojaTransacciones(datos) {
        const transacciones = datos.transacciones || [];
        
        // Crear array de datos
        const datosArray = [
            ['📋 LISTADO COMPLETO DE TRANSACCIONES'],
            [],
            ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto (S/.)', 'Método de Pago'],
            ...transacciones.map(t => [
                new Date(t.fecha).toLocaleDateString('es-PE'),
                t.tipo.toUpperCase(),
                t.categoria,
                t.descripcion || '-',
                t.monto,
                t.metodoPago || 'Efectivo'
            ])
        ];

        // Agregar totales al final
        const balance = datos.balance || {};
        datosArray.push([]);
        datosArray.push(['', '', '', 'TOTAL INGRESOS:', balance.ingresos]);
        datosArray.push(['', '', '', 'TOTAL GASTOS:', balance.gastos]);
        datosArray.push(['', '', '', 'BALANCE FINAL:', balance.balance]);

        // Crear worksheet
        const ws = XLSX.utils.aoa_to_sheet(datosArray);

        // Aplicar estilos
        // Título
        ws['A1'].s = this.estilos.tituloPrincipal;
        
        // Headers (fila 3)
        ['A3', 'B3', 'C3', 'D3', 'E3', 'F3'].forEach(cell => {
            if (ws[cell]) ws[cell].s = this.estilos.headerTabla;
        });

        // Aplicar estilos a las transacciones
        for (let i = 4; i < 4 + transacciones.length; i++) {
            const tipo = ws[`B${i}`]?.v;
            
            // Estilo según tipo
            if (tipo === 'INGRESO') {
                ws[`E${i}`].s = this.estilos.celdaIngreso;
                ws[`E${i}`].z = '"S/. "#,##0.00';
            } else if (tipo === 'GASTO') {
                ws[`E${i}`].s = this.estilos.celdaGasto;
                ws[`E${i}`].z = '"S/. "#,##0.00';
            }
        }

        // Merge del título
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

        // Anchos de columna
        ws['!cols'] = [
            { wch: 12 },  // Fecha
            { wch: 10 },  // Tipo
            { wch: 20 },  // Categoría
            { wch: 35 },  // Descripción
            { wch: 15 },  // Monto
            { wch: 15 }   // Método de Pago
        ];

        return ws;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CREAR HOJA DE CATEGORÍAS
     * ═══════════════════════════════════════════════════════════════
     */
    _crearHojaCategorias(datos) {
        const transacciones = datos.transacciones || [];
        
        // Agrupar por categoría
        const porCategoria = {};
        
        transacciones.forEach(t => {
            if (!porCategoria[t.categoria]) {
                porCategoria[t.categoria] = {
                    categoria: t.categoria,
                    monto: 0,
                    cantidad: 0,
                    tipo: t.tipo
                };
            }
            porCategoria[t.categoria].monto += t.monto;
            porCategoria[t.categoria].cantidad++;
        });

        // Convertir a array y ordenar
        const categorias = Object.values(porCategoria).sort((a, b) => b.monto - a.monto);

        // Crear datos
        const datosArray = [
            ['🏷️ ANÁLISIS POR CATEGORÍA'],
            [],
            ['Categoría', 'Monto Total (S/.)', 'Cantidad', 'Promedio (S/.)', 'Tipo'],
            ...categorias.map(c => [
                c.categoria,
                c.monto,
                c.cantidad,
                c.monto / c.cantidad,
                c.tipo.toUpperCase()
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(datosArray);

        // Aplicar estilos
        ws['A1'].s = this.estilos.tituloPrincipal;
        ['A3', 'B3', 'C3', 'D3', 'E3'].forEach(cell => {
            if (ws[cell]) ws[cell].s = this.estilos.headerTabla;
        });

        // Estilos a datos
        for (let i = 4; i < 4 + categorias.length; i++) {
            const tipo = ws[`E${i}`]?.v;
            if (tipo === 'INGRESO') {
                ws[`B${i}`].s = this.estilos.celdaIngreso;
                ws[`D${i}`].s = this.estilos.celdaIngreso;
            } else {
                ws[`B${i}`].s = this.estilos.celdaGasto;
                ws[`D${i}`].s = this.estilos.celdaGasto;
            }
            
            ws[`B${i}`].z = '"S/. "#,##0.00';
            ws[`D${i}`].z = '"S/. "#,##0.00';
        }

        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

        ws['!cols'] = [
            { wch: 25 },  // Categoría
            { wch: 18 },  // Monto Total
            { wch: 12 },  // Cantidad
            { wch: 18 },  // Promedio
            { wch: 12 }   // Tipo
        ];

        return ws;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CREAR HOJA DE GRÁFICOS Y ANÁLISIS
     * ═══════════════════════════════════════════════════════════════
     */
    _crearHojaGraficos(datos) {
        const balance = datos.balance || {};
        
        // Datos para gráficos (formato texto ya que XLSX no soporta gráficos nativos)
        const datosArray = [
            ['📈 DATOS PARA GRÁFICOS'],
            [],
            ['NOTA: Copia estos datos y crea un gráfico en Excel usando Insertar > Gráfico'],
            [],
            ['RESUMEN GENERAL'],
            ['Concepto', 'Monto'],
            ['Ingresos', balance.ingresos],
            ['Gastos', balance.gastos],
            ['Balance', balance.balance],
            [],
            ['DISTRIBUCIÓN PORCENTUAL'],
            ['Tipo', 'Porcentaje'],
            ['Ingresos', this._calcularPorcentaje(balance.ingresos, balance.ingresos + balance.gastos)],
            ['Gastos', this._calcularPorcentaje(balance.gastos, balance.ingresos + balance.gastos)]
        ];

        const ws = XLSX.utils.aoa_to_sheet(datosArray);
        
        ws['A1'].s = this.estilos.tituloPrincipal;
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
        
        ws['!cols'] = [
            { wch: 25 },
            { wch: 20 }
        ];

        return ws;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * UTILIDADES
     * ═══════════════════════════════════════════════════════════════
     */
    _formatearFecha() {
        const ahora = new Date();
        const año = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    }

    _formatearFechaCompleta() {
        return new Date().toLocaleString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    _calcularPorcentaje(parte, total) {
        if (total === 0) return '0%';
        return `${((parte / total) * 100).toFixed(1)}%`;
    }
}

// Exportar clase
window.ExportadorExcelProfesional = ExportadorExcelProfesional;

console.log('✅ Exportador Excel Profesional cargado');
