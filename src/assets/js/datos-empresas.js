/**
 * ================================================================
 * GRIZALUM DATOS DE EMPRESAS v3.0 - SOLO DATOS REALES
 * Puente entre gestor de empresas y la UI
 * Sin datos ficticios - Todo inicia en 0
 * ================================================================
 */

console.log('📊 Iniciando Sistema de Datos Empresas v3.0');

// ================================================================
// CONFIGURACIÓN DE PERÍODOS
// ================================================================
const PERIODOS_CONFIG = {
    hoy: { label: "Hoy", multiplicador: 1, dias: 1 },
    semana: { label: "Semana", multiplicador: 7, dias: 7 },
    mes: { label: "Mes", multiplicador: 30, dias: 30 },
    trimestre: { label: "Trimestre", multiplicador: 90, dias: 90 },
    año: { label: "Año", multiplicador: 365, dias: 365 }
};

// Variables de estado
let periodoActivo = 'mes';

// ================================================================
// OBTENER DATOS REALES DE LA EMPRESA ACTIVA
// ================================================================
function obtenerDatosActuales() {
    // Verificar que existe el gestor de empresas
    if (!window.gestorEmpresas || !window.gestorEmpresas.estado) {
        console.warn('⚠️ Gestor de empresas no disponible');
        return datosVacios();
    }

    const empresaId = window.gestorEmpresas.estado.empresaActual;
    
    if (!empresaId) {
        console.warn('⚠️ No hay empresa activa');
        return datosVacios();
    }

    const empresa = window.gestorEmpresas.estado.empresas[empresaId];
    
    if (!empresa) {
        console.warn('⚠️ Empresa no encontrada:', empresaId);
        return datosVacios();
    }

    // Extraer datos financieros reales (o 0 si no existen)
    const finanzas = empresa.finanzas || {};
    
    return {
        info: {
            id: empresaId,
            nombre: empresa.nombre || 'Sin nombre',
            emoji: empresa.icono || '🏢',
            ubicacion: empresa.ubicacion?.distrito || 'Lima',
            sector: empresa.categoria || 'General',
            status: empresa.estado || 'Activo'
        },
        financiero: {
            ingresos: parseFloat(finanzas.ingresos) || 0,
            gastos: parseFloat(finanzas.gastos) || 0,
            utilidad: parseFloat(finanzas.utilidadNeta) || 0,
            crecimiento: parseFloat(finanzas.roi) || 0,
            flujoCaja: parseFloat(finanzas.caja) || 0,
            margen: parseFloat(finanzas.margenNeto) || 0
        },
        graficos: {
            // Gráficos inician vacíos - se llenan con movimientos reales
            flujoMeses: [0, 0, 0, 0, 0, finanzas.caja || 0],
            gastosDistribucion: [0, 0, 0, 0, 0],
            ingresosVsGastos: [
                finanzas.ingresos || 0,
                finanzas.gastos || 0,
                finanzas.utilidadNeta || 0
            ],
            antiguedadCuentas: [0, 0, 0, 0],
            flujoDiario: [0, 0, 0, 0, 0, 0, 0]
        }
    };
}

// ================================================================
// DATOS VACÍOS PARA EMPRESAS NUEVAS
// ================================================================
function datosVacios() {
    return {
        info: {
            id: null,
            nombre: 'Sin empresa',
            emoji: '🏢',
            ubicacion: 'Lima',
            sector: 'General',
            status: 'Inactivo'
        },
        financiero: {
            ingresos: 0,
            gastos: 0,
            utilidad: 0,
            crecimiento: 0,
            flujoCaja: 0,
            margen: 0
        },
        graficos: {
            flujoMeses: [0, 0, 0, 0, 0, 0],
            gastosDistribucion: [0, 0, 0, 0, 0],
            ingresosVsGastos: [0, 0, 0],
            antiguedadCuentas: [0, 0, 0, 0],
            flujoDiario: [0, 0, 0, 0, 0, 0, 0]
        }
    };
}

// ================================================================
// OBTENER LISTA DE TODAS LAS EMPRESAS
// ================================================================
function obtenerListaEmpresas() {
    if (!window.gestorEmpresas || !window.gestorEmpresas.estado.empresas) {
        return [];
    }

    const empresas = window.gestorEmpresas.estado.empresas;
    
    return Object.keys(empresas).map(id => ({
        id,
        nombre: empresas[id].nombre,
        emoji: empresas[id].icono,
        ubicacion: empresas[id].ubicacion?.distrito || 'Lima',
        sector: empresas[id].categoria,
        status: empresas[id].estado,
        ingresos: empresas[id].finanzas?.ingresos || 0,
        gastos: empresas[id].finanzas?.gastos || 0,
        utilidad: empresas[id].finanzas?.utilidadNeta || 0
    }));
}

// ================================================================
// CAMBIAR PERÍODO ACTIVO
// ================================================================
function cambiarPeriodoActivo(periodo) {
    if (!PERIODOS_CONFIG[periodo]) {
        console.error('❌ Período inválido:', periodo);
        return false;
    }

    periodoActivo = periodo;
    console.log(`📅 Período cambiado a: ${PERIODOS_CONFIG[periodo].label}`);
    
    // Actualizar botones en UI
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Disparar evento para que otros módulos se enteren
    document.dispatchEvent(new CustomEvent('grizalumPeriodoActualizado', {
        detail: { periodo, config: PERIODOS_CONFIG[periodo] }
    }));
    
    return true;
}

// ================================================================
// FUNCIONES DE FORMATEO
// ================================================================
function formatearMoneda(valor, incluirSimbolo = true) {
    const numero = parseFloat(valor) || 0;
    
    if (incluirSimbolo) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numero);
    }
    
    return numero.toLocaleString('es-PE');
}

function formatearPorcentaje(valor, incluirSigno = true) {
    const numero = parseFloat(valor) || 0;
    const signo = incluirSigno && numero > 0 ? '+' : '';
    return `${signo}${numero.toFixed(1)}%`;
}

function formatearNumero(valor, decimales = 0) {
    const numero = parseFloat(valor) || 0;
    return numero.toLocaleString('es-PE', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    });
}

function abreviarNumero(valor) {
    const numero = parseFloat(valor) || 0;
    
    if (numero >= 1000000) {
        return `${(numero / 1000000).toFixed(1)}M`;
    } else if (numero >= 1000) {
        return `${(numero / 1000).toFixed(1)}K`;
    }
    
    return numero.toString();
}

// ================================================================
// CALCULAR DATOS POR PERÍODO
// ================================================================
function calcularDatosPorPeriodo(datos, periodo) {
    if (!PERIODOS_CONFIG[periodo]) {
        return datos;
    }

    const multiplicador = PERIODOS_CONFIG[periodo].multiplicador;
    
    // Si el período es "año", los datos ya están en base anual
    // Para otros períodos, dividir proporcionalmente
    const factor = 365 / multiplicador;
    
    return {
        ingresos: datos.ingresos / factor,
        gastos: datos.gastos / factor,
        utilidad: datos.utilidad / factor,
        flujoCaja: datos.flujoCaja / factor,
        // Crecimiento y margen no se dividen, son porcentajes
        crecimiento: datos.crecimiento,
        margen: datos.margen
    };
}

// ================================================================
// ACTUALIZAR INTERFAZ COMPLETA
// ================================================================
function actualizarInterfazCompleta() {
    try {
        console.log('🔄 Actualizando interfaz con datos reales');
        
        const datos = obtenerDatosActuales();
        
        // Disparar evento con los datos actualizados
        document.dispatchEvent(new CustomEvent('grizalumDatosActualizados', {
            detail: { 
                datos,
                periodo: periodoActivo,
                timestamp: Date.now()
            }
        }));
        
        console.log('✅ Interfaz actualizada');
        
    } catch (error) {
        console.error('❌ Error actualizando interfaz:', error);
    }
}

// ================================================================
// ESCUCHAR CAMBIOS DE EMPRESA
// ================================================================
document.addEventListener('grizalumCompanyChanged', function(evento) {
    const { companyId, company } = evento.detail;
    console.log(`🏢 Empresa cambiada: ${company.name}`);
    
    // Actualizar interfaz con datos de la nueva empresa
    setTimeout(actualizarInterfazCompleta, 100);
});

// ================================================================
// EXPORTAR API GLOBAL
// ================================================================
window.PERIODOS_CONFIG = PERIODOS_CONFIG;
window.obtenerDatosActuales = obtenerDatosActuales;
window.obtenerListaEmpresas = obtenerListaEmpresas;
window.cambiarPeriodoActivo = cambiarPeriodoActivo;
window.actualizarInterfazCompleta = actualizarInterfazCompleta;
window.formatearMoneda = formatearMoneda;
window.formatearPorcentaje = formatearPorcentaje;
window.formatearNumero = formatearNumero;
window.abreviarNumero = abreviarNumero;
window.calcularDatosPorPeriodo = calcularDatosPorPeriodo;

// Crear objeto global organizado
window.GrizalumDatos = {
    version: '3.0.0',
    periodos: PERIODOS_CONFIG,
    obtenerActuales: obtenerDatosActuales,
    listarEmpresas: obtenerListaEmpresas,
    cambiarPeriodo: cambiarPeriodoActivo,
    actualizar: actualizarInterfazCompleta,
    formatear: {
        moneda: formatearMoneda,
        porcentaje: formatearPorcentaje,
        numero: formatearNumero,
        abreviar: abreviarNumero
    }
};

console.log('✅ Sistema de Datos v3.0 cargado');
console.log('📊 Conectado con gestor de empresas real');
console.log('🎯 Todas las empresas nuevas inician en S/. 0');
