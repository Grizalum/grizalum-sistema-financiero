/**
 * ═══════════════════════════════════════════════════════════════════
 * ESTADO DE RESULTADOS - CONFIGURACIÓN ADAPTATIVA MEJORADA v2.0
 * Sistema de componentes progresivos según score empresarial
 * ═══════════════════════════════════════════════════════════════════
 */

if (!window.EstadoResultadosConfig) {
    window.EstadoResultadosConfig = {
    version: '2.0.0',
    
    // ═══════════════════════════════════════════════════════════
    // COMPONENTES ADAPTATIVOS DEL MÓDULO
    // ═══════════════════════════════════════════════════════════
    componentes: {
        
        // NÚCLEO (Score 0+) - Siempre activo
        core: {
            reporteBasico: {
                id: 'reporteBasico',
                nombre: 'Reporte Básico',
                descripcion: 'Ingresos, Costos, Gastos y Utilidad',
                icono: '📊',
                scoreMinimo: 0,
                obligatorio: true,
                categoria: 'core'
            },
            
            visualizacionSimple: {
                id: 'visualizacionSimple',
                nombre: 'Vista Simple',
                descripcion: 'Resumen de resultados del período',
                icono: '💼',
                scoreMinimo: 0,
                obligatorio: true,
                categoria: 'core'
            }
        },
        
        // MEJORAS BÁSICAS (Score 15-30)
        mejorasBasicas: {
            filtrosPeriodo: {
                id: 'filtrosPeriodo',
                nombre: 'Filtros de Período',
                descripcion: 'Hoy, Semana, Mes, Trimestre, Año',
                icono: '📅',
                scoreMinimo: 15,
                obligatorio: false,
                categoria: 'filtros'
            },
            
            desgloseCategorias: {
                id: 'desgloseCategorias',
                nombre: 'Desglose por Categorías',
                descripcion: 'Ver detalle de cada categoría',
                icono: '🏷️',
                scoreMinimo: 20,
                obligatorio: false,
                categoria: 'organizacion'
            },
            
            comparacionPeriodos: {
                id: 'comparacionPeriodos',
                nombre: 'Comparación vs Anterior',
                descripcion: 'Comparar con período previo',
                icono: '📈',
                scoreMinimo: 25,
                obligatorio: false,
                categoria: 'analisis'
            }
        },
        
        // VISUALIZACIÓN AVANZADA (Score 30-50)
        visualizacionAvanzada: {
            ratiosFinancieros: {
                id: 'ratiosFinancieros',
                nombre: 'Ratios Financieros',
                descripcion: 'Margen Bruto, Operativo, Neto',
                icono: '📊',
                scoreMinimo: 30,
                obligatorio: false,
                categoria: 'metricas'
            },
            
            graficosBasicos: {
                id: 'graficosBasicos',
                nombre: 'Gráficos Básicos',
                descripcion: 'Barras y tortas de resultados',
                icono: '📉',
                scoreMinimo: 35,
                obligatorio: false,
                categoria: 'visualizacion'
            },
            
            exportarExcel: {
                id: 'exportarExcel',
                nombre: 'Exportar a Excel',
                descripcion: 'Descargar Estado de Resultados',
                icono: '📥',
                scoreMinimo: 40,
                obligatorio: false,
                categoria: 'utilidades'
            }
        },
        
        // ANÁLISIS INTERMEDIO (Score 50-70)
        analisisIntermedio: {
            analisisVertical: {
                id: 'analisisVertical',
                nombre: 'Análisis Vertical',
                descripcion: 'Porcentaje sobre ingresos totales',
                icono: '📊',
                scoreMinimo: 50,
                obligatorio: false,
                categoria: 'analisis'
            },
            
            puntoEquilibrio: {
                id: 'puntoEquilibrio',
                nombre: 'Punto de Equilibrio',
                descripcion: 'Calcular punto de equilibrio',
                icono: '⚖️',
                scoreMinimo: 55,
                obligatorio: false,
                categoria: 'analisis'
            },
            
            tendenciasHistoricas: {
                id: 'tendenciasHistoricas',
                nombre: 'Tendencias Históricas',
                descripcion: 'Evolución últimos 6-12 meses',
                icono: '📈',
                scoreMinimo: 60,
                obligatorio: false,
                categoria: 'analisis'
            }
        },
        
        // PROFESIONAL (Score 70-85)
        profesional: {
            analisisHorizontal: {
                id: 'analisisHorizontal',
                nombre: 'Análisis Horizontal',
                descripcion: 'Variación entre períodos',
                icono: '📊',
                scoreMinimo: 70,
                obligatorio: false,
                categoria: 'profesional'
            },
            
            proyecciones: {
                id: 'proyecciones',
                nombre: 'Proyecciones',
                descripcion: 'Proyectar próximos períodos',
                icono: '🔮',
                scoreMinimo: 75,
                obligatorio: false,
                categoria: 'profesional',
                requiereIA: true
            },
            
            kpisAvanzados: {
                id: 'kpisAvanzados',
                nombre: 'KPIs Avanzados',
                descripcion: 'ROE, ROA, EBITDA',
                icono: '🎯',
                scoreMinimo: 80,
                obligatorio: false,
                categoria: 'profesional'
            }
        },
        
        // ELITE (Score 85-100)
        elite: {
            analisisComparativo: {
                id: 'analisisComparativo',
                nombre: 'Análisis Comparativo',
                descripcion: 'Comparar múltiples empresas',
                icono: '🏆',
                scoreMinimo: 85,
                obligatorio: false,
                categoria: 'elite'
            },
            
            presupuestoVsReal: {
                id: 'presupuestoVsReal',
                nombre: 'Presupuesto vs Real',
                descripcion: 'Comparar con presupuesto',
                icono: '🎯',
                scoreMinimo: 90,
                obligatorio: false,
                categoria: 'elite'
            },
            
            analisisIA: {
                id: 'analisisIA',
                nombre: 'Análisis con IA',
                descripcion: 'Insights y recomendaciones IA',
                icono: '🤖',
                scoreMinimo: 95,
                obligatorio: false,
                categoria: 'elite',
                requiereIA: true
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════
    // MAPEO DE CATEGORÍAS - FLUJO DE CAJA A ESTADO DE RESULTADOS
    // ═══════════════════════════════════════════════════════════
    mapeoCategoriasER: {
        // INGRESOS
        ingresos: {
            seccion: 'INGRESOS OPERACIONALES',
            categorias: ['ventas', 'servicios', 'venta pollos', 'venta huevos', 'venta pollitos bb', 
                        'ventas local', 'delivery', 'eventos', 'ventas efectivo', 'ventas tarjeta', 
                        'ventas online', 'contratos', 'adelantos', 'extras', 'otros ingresos',
                        'ingreso', 'venta'],
            tipo: 'ingreso',
            color: '#10B981'
        },
        
        // COSTOS DE VENTA (directos)
        costos: {
            seccion: 'COSTOS DE VENTA',
            categorias: ['alimento', 'medicinas', 'insumos', 'compra mercadería', 'materiales', 
                        'mano obra', 'mano de obra', 'costo de productos', 'costo de servicios',
                        'materia prima', 'compras', 'inventario'],
            tipo: 'gasto',
            color: '#F59E0B'
        },
        
        // GASTOS OPERATIVOS
        gastosOperativos: {
            seccion: 'GASTOS OPERATIVOS',
            categorias: ['sueldos', 'salarios', 'personal', 'alquiler', 'servicios', 'marketing', 
                        'publicidad', 'mantenimiento', 'transporte', 'administrativos', 
                        'luz', 'agua', 'internet', 'teléfono', 'limpieza', 'seguridad',
                        'papelería', 'útiles', 'permisos', 'otros gastos', 'otros', 'gasto'],
            tipo: 'gasto',
            color: '#EF4444'
        },
        
        // GASTOS FINANCIEROS
        gastosFinancieros: {
            seccion: 'GASTOS FINANCIEROS',
            categorias: ['intereses', 'comisiones', 'comisiones bancarias', 'gastos bancarios',
                        'préstamo', 'crédito', 'financiero'],
            tipo: 'gasto',
            color: '#8B5CF6'
        }
    },
    
    // ═══════════════════════════════════════════════════════════
    // CLASIFICACIÓN AUTOMÁTICA MEJORADA
    // ═══════════════════════════════════════════════════════════
    clasificarCategoria(nombreCategoria) {
        const categoriaLower = nombreCategoria.toLowerCase().trim();
        
        // Buscar en cada sección
        for (const [seccion, config] of Object.entries(this.mapeoCategoriasER)) {
            const encontrado = config.categorias.some(cat => {
                const catLower = cat.toLowerCase();
                // Coincidencia exacta o parcial
                return categoriaLower === catLower || 
                       categoriaLower.includes(catLower) || 
                       catLower.includes(categoriaLower);
            });
            
            if (encontrado) {
                return {
                    seccion: config.seccion,
                    tipo: config.tipo,
                    color: config.color,
                    grupo: seccion
                };
            }
        }
        
        // Por defecto, si no se encuentra
        return {
            seccion: 'OTROS GASTOS',
            tipo: 'gasto',
            color: '#6B7280',
            grupo: 'gastosOperativos' // Por defecto a gastos operativos
        };
    },
    
    // ═══════════════════════════════════════════════════════════
    // CONFIGURACIÓN DE PERÍODOS MEJORADA
    // ═══════════════════════════════════════════════════════════
    periodos: {
        hoy: {
            id: 'hoy',
            nombre: 'Hoy',
            icono: '📅',
            calcularRango: () => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const fin = new Date(hoy);
                fin.setHours(23, 59, 59, 999);
                return { inicio: hoy, fin: fin };
            }
        },
        
        semana: {
            id: 'semana',
            nombre: 'Semana',
            icono: '📆',
            calcularRango: () => {
                const hoy = new Date();
                const diaSemana = hoy.getDay();
                const inicio = new Date(hoy);
                inicio.setDate(hoy.getDate() - diaSemana);
                inicio.setHours(0, 0, 0, 0);
                const fin = new Date(inicio);
                fin.setDate(inicio.getDate() + 6);
                fin.setHours(23, 59, 59, 999);
                return { inicio, fin };
            }
        },
        
        mes: {
            id: 'mes',
            nombre: 'Mes',
            icono: '📊',
            calcularRango: () => {
                const hoy = new Date();
                const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);
                return { inicio, fin };
            }
        },
        
        trimestre: {
            id: 'trimestre',
            nombre: 'Trimestre',
            icono: '📈',
            calcularRango: () => {
                const hoy = new Date();
                const mesActual = hoy.getMonth();
                const trimestreInicio = Math.floor(mesActual / 3) * 3;
                const inicio = new Date(hoy.getFullYear(), trimestreInicio, 1);
                const fin = new Date(hoy.getFullYear(), trimestreInicio + 3, 0, 23, 59, 59, 999);
                return { inicio, fin };
            }
        },
        
        año: {
            id: 'año',
            nombre: 'Año',
            icono: '📅',
            calcularRango: () => {
                const hoy = new Date();
                const inicio = new Date(hoy.getFullYear(), 0, 1);
                const fin = new Date(hoy.getFullYear(), 11, 31, 23, 59, 59, 999);
                return { inicio, fin };
            }
        },
        
        // ✅ NUEVO: Período personalizado
        personalizado: {
            id: 'personalizado',
            nombre: 'Personalizado',
            icono: '🗓️',
            calcularRango: (fechaInicio, fechaFin) => {
                // Acepta strings ISO o Date objects
                const inicio = typeof fechaInicio === 'string' ? new Date(fechaInicio) : fechaInicio;
                const fin = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin;
                
                if (!inicio || !fin || isNaN(inicio) || isNaN(fin)) {
                    console.warn('Fechas inválidas para período personalizado');
                    // Fallback a mes actual
                    return this.periodos.mes.calcularRango();
                }
                
                inicio.setHours(0, 0, 0, 0);
                fin.setHours(23, 59, 59, 999);
                
                return { inicio, fin };
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════
    // MÉTODOS AUXILIARES
    // ═══════════════════════════════════════════════════════════
    
    obtenerComponentesActivos(score, componentesOcultos = []) {
        const activos = {
            core: {},
            mejorasBasicas: {},
            visualizacionAvanzada: {},
            analisisIntermedio: {},
            profesional: {},
            elite: {}
        };
        
        Object.entries(this.componentes).forEach(([grupo, componentes]) => {
            Object.entries(componentes).forEach(([key, componente]) => {
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
    
    obtenerRangoPeriodo(periodoId, fechaInicio = null, fechaFin = null) {
        const periodo = this.periodos[periodoId];
        
        if (!periodo) {
            console.warn(`Período ${periodoId} no encontrado, usando 'mes'`);
            return this.periodos.mes.calcularRango();
        }
        
        // Si es personalizado, pasar las fechas
        if (periodoId === 'personalizado' && fechaInicio && fechaFin) {
            return periodo.calcularRango(fechaInicio, fechaFin);
        }
        
        return periodo.calcularRango();
    },
    
    calcularPeriodoAnterior(periodoId) {
        const rangoActual = this.obtenerRangoPeriodo(periodoId);
        const dias = Math.ceil((rangoActual.fin - rangoActual.inicio) / (1000 * 60 * 60 * 24));
        
        const inicioAnterior = new Date(rangoActual.inicio);
        inicioAnterior.setDate(inicioAnterior.getDate() - dias - 1);
        
        const finAnterior = new Date(rangoActual.inicio);
        finAnterior.setDate(finAnterior.getDate() - 1);
        finAnterior.setHours(23, 59, 59, 999);
        
        return { inicio: inicioAnterior, fin: finAnterior };
    },
    
    // ✅ NUEVO: Validar rango de fechas
    validarRangoFechas(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        
        if (isNaN(inicio) || isNaN(fin)) {
            return { valido: false, error: 'Fechas inválidas' };
        }
        
        if (inicio > fin) {
            return { valido: false, error: 'La fecha de inicio debe ser anterior a la fecha fin' };
        }
        
        const diasDiferencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
        if (diasDiferencia > 365) {
            return { valido: false, error: 'El rango no puede superar 1 año' };
        }
        
        return { valido: true, dias: diasDiferencia };
    }
    };
}

console.log('⚙️ [Estado de Resultados] Configuración v2.0 cargada - Con soporte personalizado');
