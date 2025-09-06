/**
 * ================================================================
 * GRIZALUM CONTROLADOR DE PERÍODOS v2.0
 * Manejo dinámico de períodos de tiempo
 * ================================================================
 */

class ControladorPeriodos {
    constructor() {
        this.version = '2.0.0';
        this.periodoActual = 'mes';
        this.botones = [];
        this.initialized = false;
        
        this.init();
    }

    init() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.finalizarInicializacion());
                return;
            }
            this.finalizarInicializacion();
        } catch (error) {
            console.error('[PERÍODOS] Error en inicialización:', error);
        }
    }

    finalizarInicializacion() {
        try {
            this.encontrarBotones();
            this.bindEventos();
            this.establecerPeriodoInicial();
            
            this.initialized = true;
            console.log('✅ Controlador de períodos GRIZALUM v2.0 inicializado');
            
        } catch (error) {
            console.error('[PERÍODOS] Error finalizando inicialización:', error);
        }
    }

    encontrarBotones() {
        // Buscar botones de período
        this.botones = document.querySelectorAll('.period-btn');
        
        if (this.botones.length === 0) {
            console.warn('[PERÍODOS] No se encontraron botones de período');
            return;
        }
        
        console.log(`[PERÍODOS] ${this.botones.length} botones encontrados`);
    }

    bindEventos() {
        this.botones.forEach(boton => {
            // Extraer período del onclick o texto
            let periodo = this.extraerPeriodo(boton);
            
            if (periodo) {
                // Limpiar evento anterior
                boton.onclick = null;
                
                // Agregar nuevo evento
                boton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.cambiarPeriodo(periodo, boton);
                });
                
                console.log(`[PERÍODOS] Evento agregado para: ${periodo}`);
            }
        });
    }

    extraerPeriodo(boton) {
        // Obtener período del texto del botón
        const texto = boton.textContent.toLowerCase().trim();
        
        const mapeo = {
            'hoy': 'hoy',
            'semana': 'semana', 
            'mes': 'mes',
            'trimestre': 'trimestre',
            'año': 'año'
        };
        
        return mapeo[texto] || null;
    }

    cambiarPeriodo(periodo, botonClickeado) {
        try {
            console.log(`[PERÍODOS] Cambiando a período: ${periodo}`);
            
            // Actualizar período actual
            this.periodoActual = periodo;
            
            // Actualizar botones activos
            this.actualizarBotonesActivos(botonClickeado);
            
            // Cambiar período en el sistema de datos
            if (window.cambiarPeriodoActivo) {
                window.cambiarPeriodoActivo(periodo);
            }
            
            // Actualizar métricas
            this.actualizarMetricas();
            
            // Actualizar gráficos
            this.actualizarGraficos();
            
            // Actualizar título de página
            this.actualizarTituloPagina();
            
            console.log(`✅ Período cambiado exitosamente a: ${periodo}`);
            
        } catch (error) {
            console.error('[PERÍODOS] Error cambiando período:', error);
        }
    }

    actualizarBotonesActivos(botonActivo) {
        // Remover clase active de todos los botones
        this.botones.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Agregar clase active al botón clickeado
        if (botonActivo) {
            botonActivo.classList.add('active');
        }
    }

    actualizarMetricas() {
        try {
            const datos = window.obtenerDatosActuales();
            if (!datos) return;
            
            const financiero = datos.financiero;
            
            // Actualizar tarjetas de métricas
            this.actualizarElemento('#revenueValue', window.formatearMoneda(financiero.ingresos));
            this.actualizarElemento('#expensesValue', window.formatearMoneda(financiero.gastos));
            this.actualizarElemento('#profitValue', window.formatearMoneda(financiero.utilidad));
            this.actualizarElemento('#growthValue', window.formatearPorcentaje(financiero.crecimiento));
            
            // Actualizar sidebar
            this.actualizarElemento('#sidebarCashFlow', window.formatearMoneda(financiero.flujoCaja));
            this.actualizarElemento('#sidebarProfit', window.formatearMoneda(financiero.utilidad));
            
            console.log('[PERÍODOS] Métricas actualizadas');
            
        } catch (error) {
            console.error('[PERÍODOS] Error actualizando métricas:', error);
        }
    }

    actualizarGraficos() {
        try {
            // Llamar función de actualización de gráficos si existe
            if (window.actualizarGraficos) {
                window.actualizarGraficos();
            } else if (window.GrizalumCharts && window.GrizalumCharts.updateCharts) {
                window.GrizalumCharts.updateCharts();
            }
            
            console.log('[PERÍODOS] Gráficos actualizados');
            
        } catch (error) {
            console.error('[PERÍODOS] Error actualizando gráficos:', error);
        }
    }

    actualizarTituloPagina() {
        try {
            const periodoTexto = window.PERIODOS_CONFIG[this.periodoActual]?.label || this.periodoActual;
            const subtitulo = document.getElementById('pageSubtitle');
            
            if (subtitulo) {
                subtitulo.textContent = `Resumen financiero - ${periodoTexto}`;
            }
            
        } catch (error) {
            console.error('[PERÍODOS] Error actualizando título:', error);
        }
    }

    actualizarElemento(selector, valor) {
        const elemento = document.querySelector(selector);
        if (elemento) {
            elemento.textContent = valor;
            
            // Agregar animación de actualización
            elemento.style.transform = 'scale(1.05)';
            setTimeout(() => {
                elemento.style.transform = 'scale(1)';
            }, 200);
        }
    }

    establecerPeriodoInicial() {
        // Establecer período inicial como activo
        const botonMes = Array.from(this.botones).find(btn => 
            btn.textContent.toLowerCase().includes('mes')
        );
        
        if (botonMes) {
            botonMes.classList.add('active');
        }
    }

    // Método público para cambiar período programáticamente
    setPeriodo(periodo) {
        const botonCorrespondiente = Array.from(this.botones).find(btn =>
            this.extraerPeriodo(btn) === periodo
        );
        
        if (botonCorrespondiente) {
            this.cambiarPeriodo(periodo, botonCorrespondiente);
        }
    }

    // Obtener período actual
    getPeriodoActual() {
        return this.periodoActual;
    }
}

// INICIALIZACIÓN AUTOMÁTICA
let controladorPeriodos = null;

function inicializarControladorPeriodos() {
    try {
        if (!document.body) {
            setTimeout(inicializarControladorPeriodos, 100);
            return;
        }
        
        if (controladorPeriodos) {
            console.log('🟡 Controlador de períodos ya inicializado');
            return;
        }
        
        controladorPeriodos = new ControladorPeriodos();
        
        // Hacer disponible globalmente
        window.controladorPeriodos = controladorPeriodos;
        window.actualizarMetricas = () => controladorPeriodos.actualizarMetricas();
        
        console.log('✅ CONTROLADOR DE PERÍODOS GRIZALUM v2.0 INICIALIZADO');
        
    } catch (error) {
        console.error('❌ Error inicializando controlador de períodos:', error);
    }
}

// Múltiples estrategias de inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarControladorPeriodos);
} else if (document.readyState === 'interactive') {
    setTimeout(inicializarControladorPeriodos, 100);
} else {
    inicializarControladorPeriodos();
}

console.log('🎯 Controlador de períodos GRIZALUM v2.0 cargado');
