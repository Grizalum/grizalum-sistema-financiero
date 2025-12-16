/**
 * ═══════════════════════════════════════════════════════════════════
 * FLUJO DE CAJA - CONFIGURACIÓN DE COMPONENTES ADAPTATIVOS
 * Define qué mostrar según el nivel de la empresa (Score 0-100)
 * VERSIÓN CORREGIDA: Categorías completas
 * ═══════════════════════════════════════════════════════════════════
 */

const FlujoCajaConfig = {
    version: '1.0.1',
    
    // COMPONENTES DEL MÓDULO
    // Cada componente tiene un scoreMinimo para activarse
    componentes: {
        
        // ═══════════════════════════════════════════════════════════
        // NÚCLEO (Siempre activo - Score 0+)
        // ═══════════════════════════════════════════════════════════
        core: {
            registroRapido: {
                id: 'registroRapido',
                nombre: 'Registro Rápido',
                descripcion: 'Agregar ingresos y gastos fácilmente',
                icono: '⚡',
                scoreMinimo: 0,
                obligatorio: true,
                categoria: 'core'
            },
            
            visualizacionBasica: {
                id: 'visualizacionBasica',
                nombre: 'Balance Actual',
                descripcion: 'Ver ingresos, gastos y balance',
                icono: '💰',
                scoreMinimo: 0,
                obligatorio: true,
                categoria: 'core'
            },
            
            listaMovimientos: {
                id: 'listaMovimientos',
                nombre: 'Lista de Movimientos',
                descripcion: 'Historial de transacciones',
                icono: '📋',
                scoreMinimo: 0,
                obligatorio: true,
                categoria: 'core'
            }
        },
        
        // ═══════════════════════════════════════════════════════════
        // MEJORAS BÁSICAS (Score 15-30)
        // ═══════════════════════════════════════════════════════════
        mejorasBasicas: {
            categorias: {
                id: 'categorias',
                nombre: 'Categorías',
                descripcion: 'Organizar por categorías personalizadas',
                icono: '🏷️',
                scoreMinimo: 15,
                obligatorio: false,
                categoria: 'organizacion'
            },
            
            filtrosFecha: {
                id: 'filtrosFecha',
                nombre: 'Filtros Temporales',
                descripcion: 'Filtrar por día, semana, mes',
                icono: '📅',
                scoreMinimo: 20,
                obligatorio: false,
                categoria: 'organizacion'
            },
            
            busqueda: {
                id: 'busqueda',
                nombre: 'Buscador',
                descripcion: 'Buscar transacciones específicas',
                icono: '🔍',
                scoreMinimo: 25,
                obligatorio: false,
                categoria: 'organizacion'
            }
        },
        
        // ═══════════════════════════════════════════════════════════
        // VISUALIZACIÓN AVANZADA (Score 30-50)
        // ═══════════════════════════════════════════════════════════
        visualizacionAvanzada: {
            graficosBasicos: {
                id: 'graficosBasicos',
                nombre: 'Gráficos Básicos',
                descripcion: 'Gráfico de barras mensual',
                icono: '📊',
                scoreMinimo: 30,
                obligatorio: false,
                categoria: 'visualizacion'
            },
            
            comparativas: {
                id: 'comparativas',
                nombre: 'Comparativas',
                descripcion: 'Comparar periodos (mes vs mes)',
                icono: '📈',
                scoreMinimo: 35,
                obligatorio: false,
                categoria: 'visualizacion'
            },
            
            exportarExcel: {
                id: 'exportarExcel',
                nombre: 'Exportar a Excel',
                descripcion: 'Descargar datos en formato Excel',
                icono: '📥',
                scoreMinimo: 40,
                obligatorio: false,
                categoria: 'utilidades'
            }
        },
        
        // ═══════════════════════════════════════════════════════════
        // ANÁLISIS INTERMEDIO (Score 50-70)
        // ═══════════════════════════════════════════════════════════
        analisisIntermedio: {
            proyecciones: {
                id: 'proyecciones',
                nombre: 'Proyecciones Simples',
                descripcion: 'Proyectar próximos 30 días',
                icono: '🔮',
                scoreMinimo: 50,
                obligatorio: false,
                categoria: 'analisis',
                requiereIA: true
            },
            
            alertas: {
                id: 'alertas',
                nombre: 'Alertas Inteligentes',
                descripcion: 'Avisos de gastos inusuales',
                icono: '🔔',
                scoreMinimo: 55,
                obligatorio: false,
                categoria: 'analisis',
                requiereIA: true
            },
            
            tendencias: {
                id: 'tendencias',
                nombre: 'Análisis de Tendencias',
                descripcion: 'Detectar patrones de gasto',
                icono: '📉',
                scoreMinimo: 60,
                obligatorio: false,
                categoria: 'analisis',
                requiereIA: true
            }
        },
        
        // ═══════════════════════════════════════════════════════════
        // PROFESIONAL (Score 70-85)
        // ═══════════════════════════════════════════════════════════
        profesional: {
            dashboardEjecutivo: {
                id: 'dashboardEjecutivo',
                nombre: 'Dashboard Ejecutivo',
                descripcion: 'Vista gerencial con KPIs',
                icono: '📊',
                scoreMinimo: 70,
                obligatorio: false,
                categoria: 'profesional'
            },
            
            escenarios: {
                id: 'escenarios',
                nombre: 'Escenarios Múltiples',
                descripcion: 'Optimista, Realista, Pesimista',
                icono: '🎭',
                scoreMinimo: 75,
                obligatorio: false,
                categoria: 'profesional',
                requiereIA: true
            },
            
            metricasAvanzadas: {
                id: 'metricasAvanzadas',
                nombre: 'Métricas Financieras',
                descripcion: 'ROI, TIR, Flujo descontado',
                icono: '🎯',
                scoreMinimo: 80,
                obligatorio: false,
                categoria: 'profesional'
            }
        },
        
        // ═══════════════════════════════════════════════════════════
        // ELITE (Score 85-100)
        // ═══════════════════════════════════════════════════════════
        elite: {
            prediccionIA: {
                id: 'prediccionIA',
                nombre: 'Predicción con IA',
                descripcion: 'Predicciones avanzadas ML',
                icono: '🤖',
                scoreMinimo: 85,
                obligatorio: false,
                categoria: 'elite',
                requiereIA: true
            },
            
            benchmarking: {
                id: 'benchmarking',
                nombre: 'Benchmarking Industrial',
                descripcion: 'Comparar con tu industria',
                icono: '🏆',
                scoreMinimo: 90,
                obligatorio: false,
                categoria: 'elite'
            },
            
            optimizacionAutomatica: {
                id: 'optimizacionAutomatica',
                nombre: 'Optimización Automática',
                descripcion: 'IA sugiere mejoras financieras',
                icono: '✨',
                scoreMinimo: 95,
                obligatorio: false,
                categoria: 'elite',
                requiereIA: true
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════
    // CONFIGURACIÓN POR INDUSTRIA
    // ✅ CORREGIDO: Categorías completas (8 ingresos, 12 gastos)
    // ═══════════════════════════════════════════════════════════
    categoriasPorIndustria: {
        'avicola': {
            ingresos: ['Venta Pollos', 'Venta Huevos', 'Venta Pollitos BB', 'Otros Ingresos'],
            gastos: ['Alimento', 'Medicinas', 'Mano de Obra', 'Servicios', 'Mantenimiento', 'Otros']
        },
        'restaurante': {
            ingresos: ['Ventas Local', 'Delivery', 'Eventos', 'Otros'],
            gastos: ['Insumos', 'Personal', 'Alquiler', 'Servicios', 'Marketing', 'Otros']
        },
        'comercio-retail': {
            ingresos: ['Ventas Efectivo', 'Ventas Tarjeta', 'Ventas Online', 'Otros'],
            gastos: ['Compra Mercadería', 'Alquiler', 'Personal', 'Servicios', 'Marketing', 'Otros']
        },
        'construccion': {
            ingresos: ['Contratos', 'Adelantos', 'Extras', 'Otros'],
            gastos: ['Materiales', 'Mano Obra', 'Maquinaria', 'Transporte', 'Permisos', 'Otros']
        },
        'personalizada': {
            ingresos: [
                'Ventas',
                'Servicios', 
                'Cobros a clientes',
                'Intereses bancarios',
                'Ingresos por inversión',
                'Préstamo recibido',
                'Subsidios/Donaciones',
                'Otros Ingresos'
            ],
            gastos: [
                'Compras de inventario',
                'Sueldos y salarios',
                'Alquiler',
                'Servicios (luz, agua, internet)',
                'Transporte y logística',
                'Marketing y publicidad',
                'Mantenimiento',
                'Impuestos y tasas',
                'Seguros',
                'Pago de préstamo',
                'Gastos Operativos',
                'Otros Gastos'
            ]
        },
        'default': {
            ingresos: [
                'Ventas',
                'Servicios', 
                'Cobros a clientes',
                'Intereses bancarios',
                'Ingresos por inversión',
                'Préstamo recibido',
                'Subsidios/Donaciones',
                'Otros Ingresos'
            ],
            gastos: [
                'Compras de inventario',
                'Sueldos y salarios',
                'Alquiler',
                'Servicios (luz, agua, internet)',
                'Transporte y logística',
                'Marketing y publicidad',
                'Mantenimiento',
                'Impuestos y tasas',
                'Seguros',
                'Pago de préstamo',
                'Gastos Operativos',
                'Otros Gastos'
            ]
        }
    },
    
    /**
     * Obtener componentes activos según score
     */
    obtenerComponentesActivos(score, componentesOcultos = []) {
        const activos = {
            core: {},
            mejorasBasicas: {},
            visualizacionAvanzada: {},
            analisisIntermedio: {},
            profesional: {},
            elite: {}
        };
        
        // Recorrer todos los componentes
        Object.entries(this.componentes).forEach(([grupo, componentes]) => {
            Object.entries(componentes).forEach(([key, componente]) => {
                // Activar si cumple el score y no está oculto manualmente
                const cumpleScore = score >= componente.scoreMinimo;
                const noOculto = !componentesOcultos.includes(componente.id);
                
                activos[grupo][key] = {
                    ...componente,
                    activo: cumpleScore && (componente.obligatorio || noOculto)
                };
            });
        });
        
        return activos;
    },
    
    /**
     * Obtener categorías según industria
     */
    obtenerCategorias(industriaId) {
        return this.categoriasPorIndustria.default;
    }
};

// Exportar globalmente
window.FlujoCajaConfig = FlujoCajaConfig;

console.log('⚙️ Configuración de Flujo de Caja cargada v1.0.1 - Categorías completas');
