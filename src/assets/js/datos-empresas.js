/**
 * ================================================================
 * GRIZALUM SISTEMA DE DATOS POR EMPRESA v2.0
 * Base de datos coherente para todas las empresas
 * ================================================================
 */

// BASE DE DATOS COMPLETA DE EMPRESAS
const EMPRESAS_DATA = {
    "fundicion-laguna": {
        nombre: "Fundición Laguna",
        emoji: "🔥",
        ubicacion: "Lima, Lima",
        sector: "Industrial",
        status: "Operativo",
        datos: {
            año: {
                ingresos: 2847293,
                gastos: 344076,
                utilidad: 165000,
                crecimiento: 24.8,
                flujoCaja: 245000,
                margen: 15.2
            },
            trimestre: {
                ingresos: 711823,
                gastos: 86019,
                utilidad: 41250,
                crecimiento: 22.1,
                flujoCaja: 61250,
                margen: 14.8
            },
            mes: {
                ingresos: 237274,
                gastos: 28673,
                utilidad: 13750,
                crecimiento: 21.5,
                flujoCaja: 20417,
                margen: 14.5
            },
            semana: {
                ingresos: 54824,
                gastos: 6631,
                utilidad: 3177,
                crecimiento: 18.2,
                flujoCaja: 4722,
                margen: 13.8
            },
            hoy: {
                ingresos: 7831,
                gastos: 947,
                utilidad: 454,
                crecimiento: 15.7,
                flujoCaja: 675,
                margen: 13.2
            }
        },
        graficos: {
            flujoMeses: [185000, 210000, 225000, 198000, 267000, 245000],
            gastosDistribucion: [45, 28, 15, 8, 4], // Personal, Operaciones, Marketing, Admin, Otros
            ingresosVsGastos: [237274, 28673, 208601],
            antiguedadCuentas: [65, 25, 7, 3], // 0-30, 31-60, 61-90, +90 días
            flujoDiario: [850, 920, 780, 1100, 950, 850, 675]
        }
    },
    
    "avicola-san-juan": {
        nombre: "Avícola San Juan",
        emoji: "🐔",
        ubicacion: "Lima, Lima",
        sector: "Agropecuario",
        status: "Operativo",
        datos: {
            año: {
                ingresos: 1950000,
                gastos: 287500,
                utilidad: 125000,
                crecimiento: 18.5,
                flujoCaja: 195000,
                margen: 12.8
            },
            trimestre: {
                ingresos: 487500,
                gastos: 71875,
                utilidad: 31250,
                crecimiento: 17.2,
                flujoCaja: 48750,
                margen: 12.5
            },
            mes: {
                ingresos: 162500,
                gastos: 23958,
                utilidad: 10417,
                crecimiento: 16.8,
                flujoCaja: 16250,
                margen: 12.2
            },
            semana: {
                ingresos: 37500,
                gastos: 5531,
                utilidad: 2404,
                crecimiento: 14.9,
                flujoCaja: 3750,
                margen: 11.8
            },
            hoy: {
                ingresos: 5357,
                gastos: 790,
                utilidad: 343,
                crecimiento: 12.4,
                flujoCaja: 536,
                margen: 11.2
            }
        },
        graficos: {
            flujoMeses: [165000, 178000, 185000, 170000, 201000, 195000],
            gastosDistribucion: [52, 23, 12, 8, 5],
            ingresosVsGastos: [162500, 23958, 138542],
            antiguedadCuentas: [70, 20, 6, 4],
            flujoDiario: [620, 580, 690, 750, 620, 580, 536]
        }
    },

    "constructora-delta": {
        nombre: "Constructora Delta",
        emoji: "🏗️",
        ubicacion: "Lima, Lima",
        sector: "Construcción",
        status: "Operativo",
        datos: {
            año: {
                ingresos: 4200000,
                gastos: 525000,
                utilidad: 294000,
                crecimiento: 32.1,
                flujoCaja: 420000,
                margen: 17.5
            },
            trimestre: {
                ingresos: 1050000,
                gastos: 131250,
                utilidad: 73500,
                crecimiento: 30.8,
                flujoCaja: 105000,
                margen: 17.2
            },
            mes: {
                ingresos: 350000,
                gastos: 43750,
                utilidad: 24500,
                crecimiento: 29.5,
                flujoCaja: 35000,
                margen: 16.8
            },
            semana: {
                ingresos: 80769,
                gastos: 10096,
                utilidad: 5653,
                crecimiento: 26.7,
                flujoCaja: 8077,
                margen: 16.2
            },
            hoy: {
                ingresos: 11538,
                gastos: 1442,
                utilidad: 808,
                crecimiento: 22.3,
                flujoCaja: 1154,
                margen: 15.5
            }
        },
        graficos: {
            flujoMeses: [350000, 380000, 395000, 365000, 445000, 420000],
            gastosDistribucion: [38, 32, 15, 10, 5],
            ingresosVsGastos: [350000, 43750, 306250],
            antiguedadCuentas: [55, 30, 10, 5],
            flujoDiario: [1250, 1380, 1100, 1450, 1320, 1180, 1154]
        }
    },

    "tech-innovations": {
        nombre: "Tech Innovations",
        emoji: "💻",
        ubicacion: "Lima, Lima",
        sector: "Tecnología",
        status: "Operativo",
        datos: {
            año: {
                ingresos: 1800000,
                gastos: 216000,
                utilidad: 126000,
                crecimiento: 45.2,
                flujoCaja: 180000,
                margen: 21.0
            },
            trimestre: {
                ingresos: 450000,
                gastos: 54000,
                utilidad: 31500,
                crecimiento: 43.8,
                flujoCaja: 45000,
                margen: 20.7
            },
            mes: {
                ingresos: 150000,
                gastos: 18000,
                utilidad: 10500,
                crecimiento: 42.1,
                flujoCaja: 15000,
                margen: 20.2
            },
            semana: {
                ingresos: 34615,
                gastos: 4154,
                utilidad: 2423,
                crecimiento: 38.9,
                flujoCaja: 3462,
                margen: 19.5
            },
            hoy: {
                ingresos: 4945,
                gastos: 593,
                utilidad: 346,
                crecimiento: 35.2,
                flujoCaja: 495,
                margen: 18.8
            }
        },
        graficos: {
            flujoMeses: [120000, 145000, 165000, 155000, 195000, 180000],
            gastosDistribucion: [55, 20, 15, 7, 3],
            ingresosVsGastos: [150000, 18000, 132000],
            antiguedadCuentas: [80, 15, 3, 2],
            flujoDiario: [520, 480, 610, 700, 580, 520, 495]
        }
    }
};

// CONFIGURACIÓN DE PERÍODOS
const PERIODOS_CONFIG = {
    hoy: { label: "Hoy", multiplicador: 1 },
    semana: { label: "Semana", multiplicador: 7 },
    mes: { label: "Mes", multiplicador: 30 },
    trimestre: { label: "Trimestre", multiplicador: 90 },
    año: { label: "Año", multiplicador: 365 }
};

// EMPRESA Y PERÍODO ACTIVO
let empresaActiva = "fundicion-laguna";
let periodoActivo = "mes";

// FUNCIONES PRINCIPALES
function obtenerDatosEmpresa(empresaId, periodo = "mes") {
    // Primero intentar obtener desde tu gestor existente
    if (window.gestorEmpresas && window.gestorEmpresas.estado.empresas[empresaId]) {
        const empresaReal = window.gestorEmpresas.estado.empresas[empresaId];
        
        return {
            info: {
                nombre: empresaReal.nombre,
                emoji: empresaReal.icono,
                ubicacion: empresaReal.ubicacion?.distrito || 'Lima',
                sector: empresaReal.categoria,
                status: empresaReal.estado
            },
            financiero: {
                ingresos: empresaReal.finanzas?.ingresos || 0,
                gastos: empresaReal.finanzas?.gastos || 0,
                utilidad: empresaReal.finanzas?.utilidadNeta || 0,
                crecimiento: empresaReal.finanzas?.roi || 0,
                flujoCaja: empresaReal.finanzas?.caja || 0,
                margen: empresaReal.finanzas?.margenNeto || 0
            },
            graficos: {
                flujoMeses: [100, 120, 110, 130, 125, empresaReal.finanzas?.caja || 0],
                gastosDistribucion: [45, 25, 15, 10, 5],
                ingresosVsGastos: [
                    empresaReal.finanzas?.ingresos || 0,
                    empresaReal.finanzas?.gastos || 0,
                    empresaReal.finanzas?.utilidadNeta || 0
                ]
            }
        };
    }
    
    // Fallback a datos de ejemplo si no existe
    return EMPRESAS_DATA[empresaId] || null;
}

function cambiarEmpresaActiva(empresaId) {
    if (EMPRESAS_DATA[empresaId]) {
        empresaActiva = empresaId;
        console.log(`Empresa activa cambiada a: ${EMPRESAS_DATA[empresaId].nombre}`);
        actualizarInterfazCompleta();
        return true;
    }
    return false;
}

function cambiarPeriodoActivo(periodo) {
    if (PERIODOS_CONFIG[periodo]) {
        periodoActivo = periodo;
        console.log(`Período activo cambiado a: ${PERIODOS_CONFIG[periodo].label}`);
        actualizarInterfazCompleta();
        return true;
    }
    return false;
}

function obtenerDatosActuales() {
    // SOLO usar datos del gestor de empresas real, no los de ejemplo
    if (window.gestorEmpresas && window.gestorEmpresas.estado.empresaActual) {
        const empresaId = window.gestorEmpresas.estado.empresaActual;
        const empresaReal = window.gestorEmpresas.estado.empresas[empresaId];
        
        if (empresaReal) {
            return {
                info: {
                    nombre: empresaReal.nombre,
                    emoji: empresaReal.icono,
                    ubicacion: empresaReal.ubicacion?.distrito || 'Lima'
                },
                financiero: {
                    ingresos: empresaReal.finanzas?.ingresos || 0,
                    gastos: empresaReal.finanzas?.gastos || 0,
                    utilidad: empresaReal.finanzas?.utilidadNeta || 0,
                    crecimiento: empresaReal.finanzas?.roi || 0,
                    flujoCaja: empresaReal.finanzas?.caja || 0,
                    margen: empresaReal.finanzas?.margenNeto || 0
                },
                graficos: {
                    flujoMeses: [0, 0, 0, 0, 0, empresaReal.finanzas?.caja || 0],
                    gastosDistribucion: [0, 0, 0, 0, 0],
                    ingresosVsGastos: [
                        empresaReal.finanzas?.ingresos || 0,
                        empresaReal.finanzas?.gastos || 0,
                        empresaReal.finanzas?.utilidadNeta || 0
                    ]
                }
            };
        }
    }
    
    // Fallback con datos en cero
    return {
        financiero: { ingresos: 0, gastos: 0, utilidad: 0, crecimiento: 0, flujoCaja: 0, margen: 0 },
        graficos: { flujoMeses: [0,0,0,0,0,0], gastosDistribucion: [0,0,0,0,0], ingresosVsGastos: [0,0,0] }
    };
}

function obtenerListaEmpresas() {
    return Object.keys(EMPRESAS_DATA).map(id => ({
        id,
        nombre: EMPRESAS_DATA[id].nombre,
        emoji: EMPRESAS_DATA[id].emoji,
        ubicacion: EMPRESAS_DATA[id].ubicacion,
        sector: EMPRESAS_DATA[id].sector,
        status: EMPRESAS_DATA[id].status
    }));
}

// FUNCIÓN PARA ACTUALIZAR TODA LA INTERFAZ
function actualizarInterfazCompleta() {
    try {
        // NO actualizar métricas desde datos de ejemplo
        console.log('Interfaz actualizada con datos reales únicamente');
        
        // Solo actualizar gráficos si es necesario
        if (window.actualizarGraficos) {
            window.actualizarGraficos();
        }
        
        // Actualizar selector de empresas
        if (window.actualizarSelectorEmpresas) {
            window.actualizarSelectorEmpresas();
        }
        
    } catch (error) {
        console.error('Error actualizando interfaz:', error);
    }
}
function actualizarBotonPeriodo() {
    // Actualizar botones de período
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const botonActivo = document.querySelector(`[onclick*="${periodoActivo}"]`);
    if (botonActivo) {
        botonActivo.classList.add('active');
    }
}

// FUNCIONES AUXILIARES
function formatearMoneda(valor) {
    return `S/. ${valor.toLocaleString('es-PE')}`;
}

function formatearPorcentaje(valor) {
    return `${valor > 0 ? '+' : ''}${valor}%`;
}

function obtenerIconoTendencia(valor) {
    return valor > 0 ? '📈' : valor < 0 ? '📉' : '➡️';
}

// FUNCIONES PARA EVENTOS DE UI
// Variable global para prevenir doble click
let isUpdating = false;

function changePeriod(periodo, elemento) {
    // Prevenir doble click
    if (isUpdating) {
        console.log('Actualización en progreso, ignorando click');
        return;
    }
    
    isUpdating = true;
    
    if (window.cambiarPeriodoActivo) {
        window.cambiarPeriodoActivo(periodo);
    }
    
    // Actualizar botones activos
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (elemento) {
        elemento.classList.add('active');
    }
    
    // Evitar múltiples actualizaciones
    clearTimeout(window.updateTimeout);
    window.updateTimeout = setTimeout(() => {
        if (window.actualizarInterfazCompleta) {
            window.actualizarInterfazCompleta();
        }
        // Liberar el lock después de actualizar
        setTimeout(() => {
            isUpdating = false;
        }, 500);
    }, 100);
}

function changeCompany(empresaId) {
    cambiarEmpresaActiva(empresaId);
}

// HACER DISPONIBLE GLOBALMENTE
window.EMPRESAS_DATA = EMPRESAS_DATA;
window.PERIODOS_CONFIG = PERIODOS_CONFIG;
window.obtenerDatosEmpresa = obtenerDatosEmpresa;
window.cambiarEmpresaActiva = cambiarEmpresaActiva;
window.cambiarPeriodoActivo = cambiarPeriodoActivo;
window.obtenerDatosActuales = obtenerDatosActuales;
window.obtenerListaEmpresas = obtenerListaEmpresas;
window.actualizarInterfazCompleta = actualizarInterfazCompleta;
window.formatearMoneda = formatearMoneda;
window.formatearPorcentaje = formatearPorcentaje;
window.changePeriod = changePeriod;
window.changeCompany = changeCompany;

console.log('✅ Sistema de datos de empresas GRIZALUM v2.0 cargado');
console.log(`📊 ${Object.keys(EMPRESAS_DATA).length} empresas configuradas`);
console.log(`🎯 Empresa activa: ${EMPRESAS_DATA[empresaActiva].nombre}`);
console.log(`📅 Período activo: ${PERIODOS_CONFIG[periodoActivo].label}`);
