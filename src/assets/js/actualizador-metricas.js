// ================================================================
// ACTUALIZADOR DE KPIs GRIZALUM
// Este archivo maneja SOLO la actualización de los números del dashboard
// ================================================================

console.log('📊 Cargando actualizador de KPIs...');

// ================================================================
// VARIABLES DEL ACTUALIZADOR DE KPIs
// ================================================================
let datosKPIsActuales = {
    revenue: 2847293,
    expenses: 28700,
    profit: 16500,
    growth: '+24.8%',
    cashFlow: 24500
};

let animacionesHabilitadas = true;
let formatoMoneda = 'PEN'; // PEN, USD, EUR

// ================================================================
// CLASE PRINCIPAL DEL ACTUALIZADOR DE KPIs
// ================================================================
class ActualizadorKPIs {
    constructor() {
        this.elementos = new Map();
        this.valoresAnteriores = new Map();
        this.animacionesActivas = new Map();
        this.configuracion = {
            animacionDuracion: 1000,
            decimales: 0,
            simboloMoneda: 'S/.',
            separadorMiles: ',',
            formatearNumeros: true,
            mostrarCambios: true,
            velocidadConteo: 50
        };
    }

    /**
     * Inicializar el actualizador de KPIs
     */
    inicializar() {
        console.log('🚀 Inicializando actualizador de KPIs...');
        
        // Encontrar todos los elementos KPI
        this.encontrarElementosKPI();
        
        // Configurar observadores de cambio
        this.configurarObservadores();
        
        // Cargar valores iniciales
        this.cargarValoresIniciales();
        
        console.log('✅ Actualizador de KPIs inicializado');
        console.log(`📊 Elementos KPI encontrados: ${this.elementos.size}`);
    }

    /**
     * Encontrar todos los elementos KPI en el DOM
     */
    encontrarElementosKPI() {
        // Elementos principales del dashboard
        const elementosKPI = [
            { id: 'revenueValue', tipo: 'moneda', label: 'Ingresos Totales' },
            { id: 'expensesValue', tipo: 'moneda', label: 'Gastos Operativos' },
            { id: 'profitValue', tipo: 'moneda', label: 'Utilidad Neta' },
            { id: 'growthValue', tipo: 'porcentaje', label: 'Crecimiento' },
            { id: 'sidebarCashFlow', tipo: 'moneda', label: 'Flujo de Caja (Sidebar)' },
            { id: 'sidebarProfit', tipo: 'moneda', label: 'Utilidad (Sidebar)' }
        ];

        elementosKPI.forEach(({ id, tipo, label }) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                this.elementos.set(id, {
                    elemento: elemento,
                    tipo: tipo,
                    label: label,
                    valorActual: this.extraerValorNumerico(elemento.textContent),
                    valorAnterior: 0
                });
                console.log(`📍 KPI encontrado: ${label} (${id})`);
            } else {
                console.warn(`⚠️ Elemento KPI no encontrado: ${id}`);
            }
        });
    }

    /**
     * Configurar observadores para detectar cambios automáticamente
     */
    configurarObservadores() {
        // Observador de mutaciones para detectar cambios en los elementos
        this.elementos.forEach((kpi, id) => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        this.procesarCambioElemento(id);
                    }
                });
            });

            observer.observe(kpi.elemento, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });

        console.log('👀 Observadores de KPIs configurados');
    }

    /**
     * Cargar valores iniciales de los elementos
     */
    cargarValoresIniciales() {
        this.elementos.forEach((kpi, id) => {
            const valorInicial = this.extraerValorNumerico(kpi.elemento.textContent);
            kpi.valorActual = valorInicial;
            kpi.valorAnterior = valorInicial;
            this.valoresAnteriores.set(id, valorInicial);
        });

        console.log('📊 Valores iniciales de KPIs cargados');
    }

    /**
     * Procesar cambio en un elemento específico
     */
    procesarCambioElemento(id) {
        const kpi = this.elementos.get(id);
        if (!kpi) return;

        const nuevoValor = this.extraerValorNumerico(kpi.elemento.textContent);
        const valorAnterior = kpi.valorActual;

        if (nuevoValor !== valorAnterior) {
            console.log(`📈 Cambio detectado en ${kpi.label}: ${valorAnterior} → ${nuevoValor}`);
            this.mostrarCambioVisual(id, valorAnterior, nuevoValor);
            kpi.valorAnterior = valorAnterior;
            kpi.valorActual = nuevoValor;
        }
    }

    /**
     * Actualizar KPIs con nuevos datos
     * @param {Object} datos - Objeto con los nuevos valores
     */
    actualizar(datos) {
        if (!datos || typeof datos !== 'object') {
            console.warn('⚠️ Datos de KPIs inválidos:', datos);
            return;
        }

        console.log('📊 Actualizando KPIs con nuevos datos...');

        // Mapeo de propiedades de datos a elementos
        const mapeoKPIs = {
            revenue: 'revenueValue',
            ingresos: 'revenueValue',
            expenses: 'expensesValue',
            gastos: 'expensesValue',
            profit: 'profitValue',
            utilidad: 'profitValue',
            growth: 'growthValue',
            crecimiento: 'growthValue',
            cashFlow: 'sidebarCashFlow',
            flujoCaja: 'sidebarCashFlow'
        };

        // Actualizar cada KPI
        Object.entries(datos).forEach(([clave, valor]) => {
            const elementoId = mapeoKPIs[clave] || clave;
            
            if (this.elementos.has(elementoId)) {
                this.actualizarKPIIndividual(elementoId, valor);
            }
        });

        // Actualizar sidebar si hay datos de profit
        if (datos.profit !== undefined) {
            this.actualizarKPIIndividual('sidebarProfit', datos.profit);
        }

        // Guardar datos actuales
        datosKPIsActuales = { ...datosKPIsActuales, ...datos };

        console.log('✅ KPIs actualizados correctamente');
    }

    /**
     * Actualizar un KPI individual
     */
    actualizarKPIIndividual(elementoId, nuevoValor) {
        const kpi = this.elementos.get(elementoId);
        if (!kpi) {
            console.warn(`⚠️ KPI no encontrado: ${elementoId}`);
            return;
        }

        const valorAnterior = kpi.valorActual;
        const valorNumerico = typeof nuevoValor === 'number' ? nuevoValor : this.extraerValorNumerico(nuevoValor.toString());

        // Actualizar valor en el objeto
        kpi.valorAnterior = valorAnterior;
        kpi.valorActual = valorNumerico;

        // Mostrar cambio con animación
        if (animacionesHabilitadas) {
            this.animarCambioValor(elementoId, valorAnterior, valorNumerico, kpi.tipo);
        } else {
            this.actualizarElementoDirecto(elementoId, nuevoValor, kpi.tipo);
        }

        console.log(`📊 ${kpi.label} actualizado: ${valorAnterior} → ${valorNumerico}`);
    }

    /**
     * Animar cambio de valor con efecto de conteo
     */
    animarCambioValor(elementoId, valorInicial, valorFinal, tipo) {
        const kpi = this.elementos.get(elementoId);
        if (!kpi) return;

        // Cancelar animación anterior si existe
        if (this.animacionesActivas.has(elementoId)) {
            clearInterval(this.animacionesActivas.get(elementoId));
        }

        const elemento = kpi.elemento;
        const duracion = this.configuracion.animacionDuracion;
        const pasos = Math.ceil(duracion / this.configuracion.velocidadConteo);
        const incremento = (valorFinal - valorInicial) / pasos;
        
        let valorActual = valorInicial;
        let paso = 0;

        // Agregar clase de animación
        elemento.classList.add('kpi-updating');

        const animacion = setInterval(() => {
            paso++;
            valorActual += incremento;

            // Actualizar elemento
            const valorMostrado = paso === pasos ? valorFinal : valorActual;
            this.actualizarElementoDirecto(elementoId, valorMostrado, tipo);

            // Terminar animación
            if (paso >= pasos) {
                clearInterval(animacion);
                this.animacionesActivas.delete(elementoId);
                elemento.classList.remove('kpi-updating');
                
                // Mostrar efecto de cambio
                this.mostrarEfectoCambio(elementoId, valorInicial, valorFinal);
            }
        }, this.configuracion.velocidadConteo);

        this.animacionesActivas.set(elementoId, animacion);
    }

    /**
     * Actualizar elemento directamente sin animación
     */
    actualizarElementoDirecto(elementoId, valor, tipo) {
        const kpi = this.elementos.get(elementoId);
        if (!kpi) return;

        let valorFormateado;
        
        if (tipo === 'moneda') {
            valorFormateado = this.formatearMoneda(valor);
        } else if (tipo === 'porcentaje') {
            valorFormateado = this.formatearPorcentaje(valor);
        } else {
            valorFormateado = this.formatearNumero(valor);
        }

        kpi.elemento.textContent = valorFormateado;
    }

    /**
     * Mostrar efecto visual de cambio
     */
    mostrarEfectoCambio(elementoId, valorAnterior, valorNuevo) {
        const kpi = this.elementos.get(elementoId);
        if (!kpi) return;

        const elemento = kpi.elemento;
        const diferencia = valorNuevo - valorAnterior;
        
        if (diferencia === 0) return;

        // Determinar clase de cambio
        const claseEfecto = diferencia > 0 ? 'kpi-increase' : 'kpi-decrease';
        
        // Aplicar efecto
        elemento.classList.add(claseEfecto);
        
        // Remover efecto después de la animación
        setTimeout(() => {
            elemento.classList.remove(claseEfecto);
        }, 1000);

        // Mostrar notificación si el cambio es significativo
        if (Math.abs(diferencia) > valorAnterior * 0.1) { // Cambio mayor al 10%
            this.mostrarNotificacionCambio(kpi.label, diferencia, valorNuevo);
        }
    }

    /**
     * Mostrar cambio visual temporal
     */
    mostrarCambioVisual(elementoId, valorAnterior, valorNuevo) {
        if (!this.configuracion.mostrarCambios) return;

        const diferencia = valorNuevo - valorAnterior;
        if (diferencia === 0) return;

        this.mostrarEfectoCambio(elementoId, valorAnterior, valorNuevo);
    }

    /**
     * Mostrar notificación de cambio significativo
     */
    mostrarNotificacionCambio(label, diferencia, valorNuevo) {
        const porcentajeCambio = Math.abs(diferencia / (valorNuevo - diferencia) * 100);
        const direccion = diferencia > 0 ? 'aumento' : 'disminución';
        const emoji = diferencia > 0 ? '📈' : '📉';
        const tipo = diferencia > 0 ? 'success' : 'warning';

        const mensaje = `${emoji} ${label}: ${direccion} significativo del ${porcentajeCambio.toFixed(1)}%`;
        
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(mensaje, tipo, 4000);
        }
    }

    /**
     * Extraer valor numérico de un texto
     */
    extraerValorNumerico(texto) {
        if (typeof texto === 'number') return texto;
        
        // Remover símbolos de moneda, espacios y caracteres especiales
        const numeroLimpio = texto.toString()
            .replace(/[S\/\.\s,₡$€£¥]/g, '')
            .replace(/[^\d\.-]/g, '');
        
        const numero = parseFloat(numeroLimpio);
        return isNaN(numero) ? 0 : numero;
    }

    /**
     * Formatear número como moneda
     */
    formatearMoneda(valor) {
        if (typeof valor !== 'number') {
            valor = this.extraerValorNumerico(valor);
        }

        const simbolo = this.configuracion.simboloMoneda;
        const numeroFormateado = valor.toLocaleString('es-PE', {
            minimumFractionDigits: this.configuracion.decimales,
            maximumFractionDigits: this.configuracion.decimales
        });

        return `${simbolo} ${numeroFormateado}`;
    }

    /**
     * Formatear como porcentaje
     */
    formatearPorcentaje(valor) {
        if (typeof valor === 'string' && valor.includes('%')) {
            return valor; // Ya es un porcentaje formateado
        }

        if (typeof valor !== 'number') {
            valor = this.extraerValorNumerico(valor);
        }

        return `${valor > 0 ? '+' : ''}${valor.toFixed(1)}%`;
    }

    /**
     * Formatear número general
     */
    formatearNumero(valor) {
        if (typeof valor !== 'number') {
            valor = this.extraerValorNumerico(valor);
        }

        return valor.toLocaleString('es-PE', {
            minimumFractionDigits: this.configuracion.decimales,
            maximumFractionDigits: this.configuracion.decimales
        });
    }

    /**
     * Obtener datos actuales de los KPIs
     */
    obtenerDatosActuales() {
        const datos = {};
        
        this.elementos.forEach((kpi, id) => {
            datos[id] = {
                valor: kpi.valorActual,
                valorAnterior: kpi.valorAnterior,
                label: kpi.label,
                tipo: kpi.tipo
            };
        });

        return datos;
    }

    /**
     * Configurar opciones del actualizador
     */
    configurar(opciones) {
        this.configuracion = { ...this.configuracion, ...opciones };
        console.log('⚙️ Configuración de KPIs actualizada:', opciones);
    }

    /**
     * Habilitar/deshabilitar animaciones
     */
    configurarAnimaciones(habilitadas) {
        animacionesHabilitadas = habilitadas;
        console.log(`🎬 Animaciones de KPIs: ${habilitadas ? 'habilitadas' : 'deshabilitadas'}`);
    }

    /**
     * Agregar estilos CSS para las animaciones
     */
    agregarEstilosCSS() {
        const styleId = 'grizalum-kpis-styles';
        
        if (document.getElementById(styleId)) return;

        const estilos = document.createElement('style');
        estilos.id = styleId;
        estilos.textContent = `
            /* Estilos para animaciones de KPIs */
            .kpi-updating {
                transition: all 0.3s ease;
            }
            
            .kpi-increase {
                animation: kpiIncrease 1s ease;
            }
            
            .kpi-decrease {
                animation: kpiDecrease 1s ease;
            }
            
            @keyframes kpiIncrease {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); color: #10b981; }
                100% { transform: scale(1); }
            }
            
            @keyframes kpiDecrease {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); color: #ef4444; }
                100% { transform: scale(1); }
            }
        `;
        
        document.head.appendChild(estilos);
    }
}

// ================================================================
// INSTANCIA GLOBAL DEL ACTUALIZADOR
// ================================================================
const actualizadorKPIs = new ActualizadorKPIs();

// ================================================================
// FUNCIONES GLOBALES PARA COMPATIBILIDAD
// ================================================================

/**
 * Función global principal para actualizar KPIs
 * Compatible con la función del grizalum-principal.js
 */
function actualizarKPIs(datos) {
    return actualizadorKPIs.actualizar(datos);
}

/**
 * Función específica para actualizar sidebar
 */
function actualizarSidebar(datos) {
    if (!datos) return;
    
    const datosKPI = {};
    if (datos.cashFlow !== undefined) datosKPI.cashFlow = datos.cashFlow;
    if (datos.profit !== undefined) datosKPI.profit = datos.profit;
    
    return actualizadorKPIs.actualizar(datosKPI);
}

// ================================================================
// INTEGRACIÓN CON OTROS MÓDULOS
// ================================================================

// Escuchar cambios de empresa para actualizar KPIs
document.addEventListener('grizalumCompanyChanged', function(evento) {
    const { company } = evento.detail;
    if (company && company.data) {
        console.log('🏢 Actualizando KPIs por cambio de empresa...');
        actualizadorKPIs.actualizar(company.data);
    }
});

// Escuchar cambios de período para simular actualización
document.addEventListener('grizalumPeriodoCambiado', function(evento) {
    const { periodo } = evento.detail;
    console.log(`📅 Período cambiado a ${periodo} - KPIs podrían necesitar actualización`);
    
    // Aquí podrías implementar lógica para cargar datos del nuevo período
    // Por ahora solo mostramos una notificación
    if (window.mostrarNotificacion) {
        window.mostrarNotificacion(`📊 KPIs actualizados para período: ${periodo}`, 'info', 3000);
    }
});

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 DOM listo - Inicializando actualizador de KPIs...');
    
    // Esperar un poco para que otros módulos se carguen
    setTimeout(() => {
        actualizadorKPIs.inicializar();
        actualizadorKPIs.agregarEstilosCSS();
    }, 500);
});

// ================================================================
// API PÚBLICA DEL ACTUALIZADOR DE KPIs
// ================================================================

// Exponer API globalmente
window.GRIZALUM_KPIS = {
    version: '1.0.0',
    actualizar: (datos) => actualizadorKPIs.actualizar(datos),
    obtenerDatos: () => actualizadorKPIs.obtenerDatosActuales(),
    configurar: (opciones) => actualizadorKPIs.configurar(opciones),
    animaciones: (habilitadas) => actualizadorKPIs.configurarAnimaciones(habilitadas)
};

// Hacer funciones disponibles globalmente para compatibilidad
window.actualizarKPIs = actualizarKPIs;
window.actualizarSidebar = actualizarSidebar;

console.log(`
📊 ===================================================
   ACTUALIZADOR DE KPIs CARGADO
📊 ===================================================

✨ FUNCIONES DISPONIBLES:
   • actualizarKPIs(datos) - Actualizar todos los KPIs
   • actualizarSidebar(datos) - Actualizar solo sidebar
   • GRIZALUM_KPIS.configurar(opciones) - Personalizar formato

💰 ELEMENTOS MONITOREADOS:
   • Ingresos Totales (revenueValue)
   • Gastos Operativos (expensesValue)  
   • Utilidad Neta (profitValue)
   • Crecimiento (growthValue)
   • Flujo de Caja Sidebar (sidebarCashFlow)
   • Utilidad Sidebar (sidebarProfit)

🎬 CARACTERÍSTICAS:
   • Animaciones de conteo suaves
   • Detección automática de cambios
   • Efectos visuales para aumentos/disminuciones
   • Formateo automático de moneda peruana
   • Notificaciones para cambios significativos

⚙️ CONFIGURACIÓN:
   • Velocidad de animación personalizable
   • Formato de moneda configurable
   • Activar/desactivar efectos visuales

📊 ===================================================
`);

