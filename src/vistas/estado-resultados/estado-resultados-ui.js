/**
 * ═══════════════════════════════════════════════════════════════════
 * ESTADO DE RESULTADOS - INTERFAZ DE USUARIO
 * Maneja toda la interacción con el DOM
 * ═══════════════════════════════════════════════════════════════════
 */

if (!window.EstadoResultadosUI) {
    class EstadoResultadosUI {
        
    constructor() {
        this.modulo = null;
        this._inicializar();
    }

    async _inicializar() {
        console.log('🎨 Inicializando interfaz Estado de Resultados...');
        
        // Esperar módulo
        await this._esperarModulo();
        
        // Esperar DOM
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Configurar eventos
        this.configurarEventos();
        
        // Cargar datos iniciales
        this.cargarResultados();
        
        console.log('✅ Interfaz Estado de Resultados lista');
    }

    async _esperarModulo() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.estadoResultados) {
                    this.modulo = window.estadoResultados;
                    console.log('✅ Módulo conectado a la UI');
                    resolve();
                } else {
                    setTimeout(verificar, 200);
                }
            };
            verificar();
        });
    }

    configurarEventos() {
        // Botones de período
        const botonesPeriodo = document.querySelectorAll('.er-filtro-btn');
        botonesPeriodo.forEach(btn => {
            btn.addEventListener('click', () => {
                const periodo = btn.dataset.periodo;
                this.cambiarPeriodo(periodo);
            });
        });

        // Botón exportar
        const btnExportar = document.getElementById('btnExportarER');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => this.exportarExcel());
        }

        // Escuchar eventos del módulo
        document.addEventListener('grizalumResultadosCalculados', () => {
            this.cargarResultados();
        });

        // Escuchar cambio de empresa
        document.addEventListener('grizalumCompanyChanged', () => {
            setTimeout(() => this.cargarResultados(), 500);
        });

        console.log('✅ Eventos configurados');
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CAMBIAR PERÍODO
     * ═══════════════════════════════════════════════════════════════
     */

    cambiarPeriodo(periodoId) {
        console.log('📅 Cambiando a período:', periodoId);
        
        // Actualizar botones
        document.querySelectorAll('.er-filtro-btn').forEach(btn => {
            btn.classList.remove('activo');
            if (btn.dataset.periodo === periodoId) {
                btn.classList.add('activo');
            }
        });

        // Calcular resultados
        this.modulo.cambiarPeriodo(periodoId);
        
        // Actualizar subtítulo
        const subtitulo = document.getElementById('erPeriodoActual');
        if (subtitulo) {
            const nombres = {
                'hoy': 'Hoy',
                'semana': 'Esta semana',
                'mes': 'Este mes',
                'trimestre': 'Este trimestre',
                'año': 'Este año'
            };
            subtitulo.textContent = nombres[periodoId] || periodoId;
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CARGAR RESULTADOS
     * ═══════════════════════════════════════════════════════════════
     */

    cargarResultados() {
        console.log('📊 Cargando resultados...');
        
        const resultados = this.modulo.obtenerResultados();
        
        if (!resultados) {
            console.warn('No hay resultados');
            this.mostrarEstadoVacio();
            return;
        }

        // Ocultar estado vacío
        const estadoVacio = document.getElementById('erEstadoVacio');
        if (estadoVacio) estadoVacio.style.display = 'none';

        // Cargar tarjetas resumen
        this.cargarTarjetasResumen(resultados);
        
        // Cargar tabla
        this.cargarTabla(resultados);
        
        // Cargar ratios (si está activo)
        if (this.modulo.componenteActivo('ratiosFinancieros')) {
            this.cargarRatios(resultados);
        }
        
        // Cargar gráficos (si está activo)
        if (this.modulo.componenteActivo('graficosBasicos')) {
            this.cargarGraficos(resultados);
        }
        
        // Mostrar comparación (si está activo)
        if (this.modulo.componenteActivo('comparacionPeriodos')) {
            this.cargarComparacion();
        }

        console.log('✅ Resultados cargados');
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * TARJETAS RESUMEN
     * ═══════════════════════════════════════════════════════════════
     */

    cargarTarjetasResumen(resultados) {
        // Ingresos
        this.actualizarTarjeta('erIngresosTotales', resultados.ingresos.total);
        
        // Costos
        this.actualizarTarjeta('erCostosTotales', resultados.costos.total);
        
        // Gastos
        this.actualizarTarjeta('erGastosTotales', resultados.gastosOperativos.total);
        
        // Utilidad Neta
        this.actualizarTarjeta('erUtilidadNeta', resultados.utilidadNeta);
    }

    actualizarTarjeta(elementoId, monto) {
        const elemento = document.getElementById(elementoId);
        if (elemento) {
            elemento.textContent = this.formatearMoneda(monto);
            
            // Color según si es positivo o negativo
            if (elementoId === 'erUtilidadNeta') {
                elemento.classList.remove('er-monto-positivo', 'er-monto-negativo');
                elemento.classList.add(monto >= 0 ? 'er-monto-positivo' : 'er-monto-negativo');
            }
        }
    }

    cargarComparacion() {
        const comparacion = this.modulo.calcularComparacion();
        
        // Actualizar cada tarjeta con comparación
        this.actualizarComparacion('erIngresosComparacion', comparacion.ingresos);
        this.actualizarComparacion('erCostosComparacion', comparacion.costos);
        this.actualizarComparacion('erGastosComparacion', comparacion.gastosOperativos);
        this.actualizarComparacion('erUtilidadComparacion', comparacion.utilidadNeta);
    }

    actualizarComparacion(elementoId, variacion) {
        const elemento = document.getElementById(elementoId);
        if (!elemento) return;

        const icono = variacion.tipo === 'positivo' ? 'fa-arrow-up' : 
                     variacion.tipo === 'negativo' ? 'fa-arrow-down' : 'fa-minus';
        
        const clase = variacion.tipo === 'positivo' ? 'er-comparacion-positivo' : 
                     variacion.tipo === 'negativo' ? 'er-comparacion-negativo' : '';

        elemento.innerHTML = `
            <i class="fas ${icono}"></i>
            <span>${Math.abs(variacion.porcentaje).toFixed(1)}% vs anterior</span>
        `;
        
        elemento.className = `er-card-comparacion ${clase}`;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * TABLA ESTADO DE RESULTADOS
     * ═══════════════════════════════════════════════════════════════
     */

    cargarTabla(resultados) {
        const tbody = document.getElementById('erTablaBody');
        if (!tbody) return;

        const ingresosTotales = resultados.ingresos.total;
        let html = '';

        // INGRESOS
        html += this.crearSeccionTabla('INGRESOS OPERACIONALES', '#10B981');
        resultados.ingresos.porCategoria.forEach(cat => {
            const porcentaje = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100).toFixed(1) : 0;
            html += this.crearFilaTabla(cat.categoria, cat.monto, porcentaje);
        });
        html += this.crearSubtotalTabla('TOTAL INGRESOS', resultados.ingresos.total, 100);

        // COSTOS
        if (resultados.costos.total > 0) {
            html += this.crearSeccionTabla('COSTOS DE VENTA', '#F59E0B');
            resultados.costos.porCategoria.forEach(cat => {
                const porcentaje = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100).toFixed(1) : 0;
                html += this.crearFilaTabla(cat.categoria, -cat.monto, porcentaje, true);
            });
            html += this.crearSubtotalTabla('TOTAL COSTOS', -resultados.costos.total, 
                ingresosTotales > 0 ? (resultados.costos.total / ingresosTotales * 100).toFixed(1) : 0, true);
        }

        // UTILIDAD BRUTA
        const pctBruta = ingresosTotales > 0 ? (resultados.utilidadBruta / ingresosTotales * 100).toFixed(1) : 0;
        html += this.crearTotalTabla('UTILIDAD BRUTA', resultados.utilidadBruta, pctBruta);

        // GASTOS OPERATIVOS
        if (resultados.gastosOperativos.total > 0) {
            html += this.crearSeccionTabla('GASTOS OPERATIVOS', '#EF4444');
            resultados.gastosOperativos.porCategoria.forEach(cat => {
                const porcentaje = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100).toFixed(1) : 0;
                html += this.crearFilaTabla(cat.categoria, -cat.monto, porcentaje, true);
            });
            html += this.crearSubtotalTabla('TOTAL GASTOS OPERATIVOS', -resultados.gastosOperativos.total,
                ingresosTotales > 0 ? (resultados.gastosOperativos.total / ingresosTotales * 100).toFixed(1) : 0, true);
        }

        // UTILIDAD OPERATIVA
        const pctOperativa = ingresosTotales > 0 ? (resultados.utilidadOperativa / ingresosTotales * 100).toFixed(1) : 0;
        html += this.crearTotalTabla('UTILIDAD OPERATIVA', resultados.utilidadOperativa, pctOperativa);

        // GASTOS FINANCIEROS
        if (resultados.gastosFinancieros.total > 0) {
            html += this.crearSeccionTabla('GASTOS FINANCIEROS', '#8B5CF6');
            resultados.gastosFinancieros.porCategoria.forEach(cat => {
                const porcentaje = ingresosTotales > 0 ? (cat.monto / ingresosTotales * 100).toFixed(1) : 0;
                html += this.crearFilaTabla(cat.categoria, -cat.monto, porcentaje, true);
            });
            html += this.crearSubtotalTabla('TOTAL GASTOS FINANCIEROS', -resultados.gastosFinancieros.total,
                ingresosTotales > 0 ? (resultados.gastosFinancieros.total / ingresosTotales * 100).toFixed(1) : 0, true);
        }

        // UTILIDAD NETA
        const pctNeta = ingresosTotales > 0 ? (resultados.utilidadNeta / ingresosTotales * 100).toFixed(1) : 0;
        html += this.crearTotalTabla('UTILIDAD NETA', resultados.utilidadNeta, pctNeta, true);

        tbody.innerHTML = html;
    }

    crearSeccionTabla(titulo, color) {
        return `
            <tr class="er-seccion-titulo">
                <td colspan="3" style="color: ${color}">${titulo}</td>
            </tr>
        `;
    }

    crearFilaTabla(concepto, monto, porcentaje, esNegativo = false) {
        const claseColor = monto < 0 ? 'er-monto-negativo' : '';
        return `
            <tr class="er-fila">
                <td class="er-categoria">${concepto}</td>
                <td class="er-monto ${claseColor}">${this.formatearMoneda(monto)}</td>
                <td class="er-monto">${porcentaje}%</td>
            </tr>
        `;
    }

    crearSubtotalTabla(concepto, monto, porcentaje, esNegativo = false) {
        const claseColor = monto < 0 ? 'er-monto-negativo' : '';
        return `
            <tr class="er-fila er-subtotal">
                <td class="er-categoria">${concepto}</td>
                <td class="er-monto ${claseColor}">${this.formatearMoneda(monto)}</td>
                <td class="er-monto">${porcentaje}%</td>
            </tr>
        `;
    }

    crearTotalTabla(concepto, monto, porcentaje, esUtilidadNeta = false) {
        const claseColor = monto < 0 ? 'er-monto-negativo' : 'er-monto-positivo';
        return `
            <tr class="er-fila er-total">
                <td class="er-categoria">${concepto}</td>
                <td class="er-monto ${claseColor}">${this.formatearMoneda(monto)}</td>
                <td class="er-monto">${porcentaje}%</td>
            </tr>
        `;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * RATIOS FINANCIEROS
     * ═══════════════════════════════════════════════════════════════
     */

    cargarRatios(resultados) {
        const seccion = document.getElementById('seccionRatios');
        if (seccion) seccion.classList.remove('oculto');

        this.actualizarRatio('erMargenBruto', 'erBarraMargenBruto', resultados.ratios.margenBruto);
        this.actualizarRatio('erMargenOperativo', 'erBarraMargenOperativo', resultados.ratios.margenOperativo);
        this.actualizarRatio('erMargenNeto', 'erBarraMargenNeto', resultados.ratios.margenNeto);
    }

    actualizarRatio(valorId, barraId, porcentaje) {
        const valor = document.getElementById(valorId);
        const barra = document.getElementById(barraId);

        if (valor) {
            valor.textContent = `${porcentaje.toFixed(1)}%`;
        }

        if (barra) {
            const pct = Math.max(0, Math.min(100, porcentaje));
            barra.style.width = `${pct}%`;
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * GRÁFICOS
     * ═══════════════════════════════════════════════════════════════
     */

    cargarGraficos(resultados) {
        const seccion = document.getElementById('seccionGraficos');
        if (seccion) seccion.classList.remove('oculto');

        if (window.EstadoResultadosGraficos) {
            window.EstadoResultadosGraficos.crearGraficoBarras(resultados);
            window.EstadoResultadosGraficos.crearGraficoTorta(resultados);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * EXPORTAR EXCEL
     * ═══════════════════════════════════════════════════════════════
     */

    async exportarExcel() {
        console.log('📥 Exportando a Excel...');
        
        try {
            if (typeof ExcelJS === 'undefined') {
                alert('❌ Librería ExcelJS no disponible');
                return;
            }

            if (typeof ExportadorEstadoResultados === 'undefined') {
                alert('❌ Exportador no disponible');
                return;
            }

            const datos = this.modulo.exportarJSON();
            const exportador = new ExportadorEstadoResultados();
            await exportador.exportar(datos);
            
            this.mostrarNotificacion('✅ Excel exportado exitosamente', 'success');
            
        } catch (error) {
            console.error('❌ Error exportando:', error);
            alert('Error al exportar: ' + error.message);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * UTILIDADES
     * ═══════════════════════════════════════════════════════════════
     */

    mostrarEstadoVacio() {
        const estadoVacio = document.getElementById('erEstadoVacio');
        if (estadoVacio) estadoVacio.style.display = 'flex';
        
        const tbody = document.getElementById('erTablaBody');
        if (tbody) tbody.innerHTML = '';
    }

    formatearMoneda(monto) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(monto);
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        if (window.NotificacionesManager) {
            window.NotificacionesManager.mostrar(mensaje, tipo);
        } else {
            console.log(mensaje);
        }
    }
}
    
    window.EstadoResultadosUI = EstadoResultadosUI;
}

// Inicialización
if (!window.estadoResultadosUIInstancia) {
    window.estadoResultadosUIInstancia = null;
}

function inicializarEstadoResultadosUI() {
    console.log('🚀 Inicializando Estado de Resultados UI...');
    
    if (!window.estadoResultadosUIInstancia) {
        window.estadoResultadosUIInstancia = new window.EstadoResultadosUI();
        window.estadoResultadosUI = window.estadoResultadosUIInstancia;
    }
}

// Escuchar cuando la vista se hace visible
window.addEventListener('estadoResultadosVisible', () => {
    console.log('👁️ Vista Estado de Resultados visible');
    inicializarEstadoResultadosUI();
});

// NUEVO: Recargar cuando el contenedor se muestra
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        const app = document.getElementById('estadoResultadosApp');
        if (app && window.getComputedStyle(app).display !== 'none') {
            if (window.estadoResultadosUI && window.estadoResultadosUI.cargarResultados) {
                console.log('🔄 Recargando datos de Estado de Resultados');
                window.estadoResultadosUI.cargarResultados();
            }
        }
    });
    
    const app = document.getElementById('estadoResultadosApp');
    if (app) {
        observer.observe(app.parentElement || document.body, {
            attributes: true,
            attributeFilter: ['style', 'class'],
            subtree: true
        });
    }
});

// También intentar inicializar al cargar
if (document.readyState === 'complete') {
    inicializarEstadoResultadosUI();
} else {
    window.addEventListener('load', inicializarEstadoResultadosUI);
}

console.log('🎨 UI de Estado de Resultados lista para inicializar');

// FORZAR RECARGA
setInterval(() => {
    const app = document.getElementById('estadoResultadosApp');
    if (app && window.getComputedStyle(app).display !== 'none') {
        if (window.estadoResultadosUI && window.estadoResultadosUI.modulo) {
            const resultados = window.estadoResultadosUI.modulo.obtenerResultados();
            if (resultados && resultados.totalTransacciones > 0) {
                const elementoIngresos = document.getElementById('erIngresosTotales');
                if (elementoIngresos && elementoIngresos.textContent === 'S/. 0.00') {
                        console.log('🔄 Forzando recarga de UI...');
                        window.estadoResultadosUI.cargarResultados();
                    }
                }
            }
        }
    }, 1000);
    
   let graficosInicializados = false;

const cargarGraficosUnaVez = () => {
    if (graficosInicializados) return;
    
    const app = document.getElementById('estadoResultadosApp');
    if (!app || window.getComputedStyle(app).display === 'none') return;
    
    if (window.estadoResultadosUI && window.estadoResultadosUI.modulo) {
        const resultados = window.estadoResultadosUI.modulo.obtenerResultados();
        if (resultados && resultados.totalTransacciones > 0) {
            if (window.estadoResultadosUI.modulo.componenteActivo('graficosBasicos')) {
                console.log('🎨 Cargando gráficos inicial...');
                window.estadoResultadosUI.cargarGraficos(resultados);
                graficosInicializados = true;
            }
        }
    }
};

// Ejecutar una vez cuando la vista está lista
setTimeout(cargarGraficosUnaVez, 1500);

// Escuchar cuando se muestre la vista
window.addEventListener('estadoResultadosVisible', () => {
    graficosInicializados = false;
    setTimeout(cargarGraficosUnaVez, 500);
});

console.log('✅ Gráficos configurados para carga única');
