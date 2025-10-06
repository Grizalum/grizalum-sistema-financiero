/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - BASE DE DATOS DE PERFILES INDUSTRIALES
 * Configuraciones optimizadas por tipo de empresa
 * ═══════════════════════════════════════════════════════════════════
 */

class PerfilesIndustriales {
    constructor() {
        this.version = '1.0.0';
        this.ultimaActualizacion = '2025-01-15';
        
        // Base de conocimiento de 25 industrias
        this.perfiles = {
            'avicola': {
                id: 'avicola',
                nombre: 'Avícola y Granja',
                icono: '🐔',
                descripcion: 'Producción de aves, huevos y derivados',
                categoria: 'Agropecuario',
                
                tamanos: {
                    micro: { aves: '< 500', empleados: '1-2' },
                    pequena: { aves: '500-5000', empleados: '3-10' },
                    mediana: { aves: '5000-50000', empleados: '11-50' },
                    grande: { aves: '> 50000', empleados: '> 50' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'inventario': { prioridad: 9, obligatorio: true },
                    'produccion': { prioridad: 9, obligatorio: false },
                    'clientes': { prioridad: 7, obligatorio: false },
                    'empleados': { prioridad: 6, obligatorio: false },
                    'reportes': { prioridad: 8, obligatorio: false },
                    'facturacion': { prioridad: 5, obligatorio: false },
                    'contabilidad': { prioridad: 4, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['produccion-diaria', 'mortalidad', 'conversion-alimento'],
                    'inventario': ['alimento', 'aves-vivas', 'huevos', 'medicamentos'],
                    'flujo-caja': ['venta-aves', 'venta-huevos', 'compra-alimento']
                },
                
                metricasClave: [
                    { id: 'conversion-alimenticia', nombre: 'Conversión Alimenticia', unidad: 'kg/kg' },
                    { id: 'mortalidad', nombre: 'Tasa de Mortalidad', unidad: '%' },
                    { id: 'produccion-huevos', nombre: 'Producción de Huevos', unidad: 'unidades/día' },
                    { id: 'peso-promedio', nombre: 'Peso Promedio', unidad: 'kg' }
                ],
                
                ciclosProduccion: {
                    pollos: { duracion: 42, unidad: 'días' },
                    ponedoras: { duracion: 365, unidad: 'días' }
                }
            },

            'fundicion': {
                id: 'fundicion',
                nombre: 'Fundición y Metalurgia',
                icono: '🔥',
                descripcion: 'Fundición de metales y fabricación de piezas',
                categoria: 'Manufactura',
                
                tamanos: {
                    micro: { produccion: '< 10 ton/mes', empleados: '1-5' },
                    pequena: { produccion: '10-50 ton/mes', empleados: '6-20' },
                    mediana: { produccion: '50-200 ton/mes', empleados: '21-100' },
                    grande: { produccion: '> 200 ton/mes', empleados: '> 100' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'inventario': { prioridad: 8, obligatorio: true },
                    'produccion': { prioridad: 10, obligatorio: true },
                    'proyectos': { prioridad: 9, obligatorio: false },
                    'empleados': { prioridad: 8, obligatorio: false },
                    'clientes': { prioridad: 7, obligatorio: false },
                    'reportes': { prioridad: 8, obligatorio: false },
                    'contabilidad': { prioridad: 6, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['ordenes-activas', 'hornos-operativos', 'eficiencia-produccion'],
                    'inventario': ['materia-prima', 'productos-terminados', 'herramientas', 'moldes'],
                    'produccion': ['control-calidad', 'tiempos-fundicion', 'desperdicios']
                },
                
                metricasClave: [
                    { id: 'eficiencia-hornos', nombre: 'Eficiencia de Hornos', unidad: '%' },
                    { id: 'desperdicio', nombre: 'Tasa de Desperdicio', unidad: '%' },
                    { id: 'produccion-diaria', nombre: 'Producción Diaria', unidad: 'kg' },
                    { id: 'costo-energia', nombre: 'Costo de Energía', unidad: 'S/.' }
                ]
            },

            'comercio-retail': {
                id: 'comercio-retail',
                nombre: 'Comercio y Retail',
                icono: '🏪',
                descripcion: 'Tiendas, bodegas y comercio al por menor',
                categoria: 'Comercio',
                
                tamanos: {
                    micro: { local: 'único', empleados: '1-2' },
                    pequena: { local: '2-3 locales', empleados: '3-10' },
                    mediana: { local: '4-10 locales', empleados: '11-50' },
                    grande: { local: '> 10 locales', empleados: '> 50' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'inventario': { prioridad: 10, obligatorio: true },
                    'clientes': { prioridad: 8, obligatorio: false },
                    'facturacion': { prioridad: 9, obligatorio: false },
                    'empleados': { prioridad: 6, obligatorio: false },
                    'reportes': { prioridad: 7, obligatorio: false },
                    'contabilidad': { prioridad: 5, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['ventas-dia', 'productos-top', 'stock-bajo'],
                    'inventario': ['productos-rapidos', 'alertas-vencimiento', 'rotacion'],
                    'clientes': ['programa-puntos', 'creditos', 'historial-compras']
                },
                
                metricasClave: [
                    { id: 'ticket-promedio', nombre: 'Ticket Promedio', unidad: 'S/.' },
                    { id: 'rotacion-inventario', nombre: 'Rotación de Inventario', unidad: 'veces/mes' },
                    { id: 'margen-bruto', nombre: 'Margen Bruto', unidad: '%' },
                    { id: 'ventas-dia', nombre: 'Ventas del Día', unidad: 'S/.' }
                ]
            },

            'restaurante': {
                id: 'restaurante',
                nombre: 'Restaurante y Gastronomía',
                icono: '🍽️',
                descripcion: 'Restaurantes, cafeterías y servicios de comida',
                categoria: 'Alimentos y Bebidas',
                
                tamanos: {
                    micro: { mesas: '< 10', empleados: '1-3' },
                    pequena: { mesas: '10-30', empleados: '4-15' },
                    mediana: { mesas: '30-80', empleados: '16-50' },
                    grande: { mesas: '> 80', empleados: '> 50' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'inventario': { prioridad: 9, obligatorio: true },
                    'clientes': { prioridad: 7, obligatorio: false },
                    'empleados': { prioridad: 8, obligatorio: false },
                    'facturacion': { prioridad: 6, obligatorio: false },
                    'reportes': { prioridad: 7, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['ventas-turno', 'platos-populares', 'mesas-ocupadas'],
                    'inventario': ['ingredientes', 'bebidas', 'alertas-merma', 'recetas'],
                    'empleados': ['turnos', 'propinas', 'comisiones']
                },
                
                metricasClave: [
                    { id: 'ticket-promedio', nombre: 'Consumo Promedio', unidad: 'S/.' },
                    { id: 'rotacion-mesas', nombre: 'Rotación de Mesas', unidad: 'veces/día' },
                    { id: 'costo-alimentos', nombre: 'Costo de Alimentos', unidad: '%' },
                    { id: 'propinas', nombre: 'Propinas', unidad: 'S/.' }
                ]
            },

            'construccion': {
                id: 'construccion',
                nombre: 'Construcción y Obras',
                icono: '🏗️',
                descripcion: 'Constructoras y servicios de construcción',
                categoria: 'Construcción',
                
                tamanos: {
                    micro: { proyectos: '1-2', empleados: '1-5' },
                    pequena: { proyectos: '3-10', empleados: '6-30' },
                    mediana: { proyectos: '> 10', empleados: '31-100' },
                    grande: { proyectos: 'múltiples', empleados: '> 100' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'proyectos': { prioridad: 10, obligatorio: true },
                    'inventario': { prioridad: 8, obligatorio: true },
                    'empleados': { prioridad: 9, obligatorio: false },
                    'clientes': { prioridad: 7, obligatorio: false },
                    'facturacion': { prioridad: 8, obligatorio: false },
                    'contabilidad': { prioridad: 7, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['obras-activas', 'avance-proyectos', 'presupuestos'],
                    'proyectos': ['cronograma', 'materiales', 'subcontratos', 'valorizaciones'],
                    'inventario': ['materiales-construccion', 'herramientas', 'maquinaria']
                },
                
                metricasClave: [
                    { id: 'avance-obra', nombre: 'Avance de Obra', unidad: '%' },
                    { id: 'rentabilidad-proyecto', nombre: 'Rentabilidad', unidad: '%' },
                    { id: 'costo-m2', nombre: 'Costo por m²', unidad: 'S/.' },
                    { id: 'dias-atraso', nombre: 'Días de Atraso', unidad: 'días' }
                ]
            },

            'transporte': {
                id: 'transporte',
                nombre: 'Transporte y Logística',
                icono: '🚚',
                descripcion: 'Servicios de transporte y logística',
                categoria: 'Logística',
                
                tamanos: {
                    micro: { vehiculos: '1-2', empleados: '1-3' },
                    pequena: { vehiculos: '3-10', empleados: '4-20' },
                    mediana: { vehiculos: '11-50', empleados: '21-100' },
                    grande: { vehiculos: '> 50', empleados: '> 100' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'clientes': { prioridad: 9, obligatorio: false },
                    'empleados': { prioridad: 8, obligatorio: false },
                    'facturacion': { prioridad: 9, obligatorio: false },
                    'reportes': { prioridad: 7, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['viajes-dia', 'vehiculos-ruta', 'combustible'],
                    'clientes': ['rutas-frecuentes', 'contratos', 'tarifas'],
                    'empleados': ['conductores', 'asistencias', 'bonos']
                },
                
                metricasClave: [
                    { id: 'viajes-completados', nombre: 'Viajes Completados', unidad: 'viajes' },
                    { id: 'costo-km', nombre: 'Costo por Km', unidad: 'S/.' },
                    { id: 'consumo-combustible', nombre: 'Consumo Combustible', unidad: 'gal' },
                    { id: 'rentabilidad-viaje', nombre: 'Rentabilidad', unidad: '%' }
                ]
            },

            'servicios-profesionales': {
                id: 'servicios-profesionales',
                nombre: 'Servicios Profesionales',
                icono: '💼',
                descripcion: 'Consultoría, contabilidad, legal, etc.',
                categoria: 'Servicios',
                
                tamanos: {
                    micro: { profesionales: '1-2', empleados: '1-3' },
                    pequena: { profesionales: '3-10', empleados: '4-20' },
                    mediana: { profesionales: '11-30', empleados: '21-80' },
                    grande: { profesionales: '> 30', empleados: '> 80' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'clientes': { prioridad: 10, obligatorio: true },
                    'proyectos': { prioridad: 8, obligatorio: false },
                    'facturacion': { prioridad: 9, obligatorio: false },
                    'reportes': { prioridad: 7, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['horas-facturables', 'clientes-activos', 'proyectos-curso'],
                    'clientes': ['contratos', 'horas-servicio', 'facturacion-recurrente'],
                    'proyectos': ['hitos', 'entregables', 'presupuesto-horas']
                },
                
                metricasClave: [
                    { id: 'horas-facturables', nombre: 'Horas Facturables', unidad: 'hrs' },
                    { id: 'tarifa-promedio', nombre: 'Tarifa Promedio', unidad: 'S/./hr' },
                    { id: 'utilizacion', nombre: 'Tasa de Utilización', unidad: '%' },
                    { id: 'proyectos-activos', nombre: 'Proyectos Activos', unidad: 'cantidad' }
                ]
            },

            'salud-clinica': {
                id: 'salud-clinica',
                nombre: 'Salud y Clínicas',
                icono: '🏥',
                descripcion: 'Clínicas, consultorios y servicios de salud',
                categoria: 'Salud',
                
                tamanos: {
                    micro: { consultorios: '1', empleados: '1-3' },
                    pequena: { consultorios: '2-5', empleados: '4-15' },
                    mediana: { consultorios: '6-20', empleados: '16-80' },
                    grande: { consultorios: '> 20', empleados: '> 80' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'clientes': { prioridad: 10, obligatorio: true },
                    'inventario': { prioridad: 7, obligatorio: false },
                    'empleados': { prioridad: 8, obligatorio: false },
                    'facturacion': { prioridad: 9, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['citas-dia', 'pacientes-nuevos', 'ingresos-especialidad'],
                    'clientes': ['historial-clinico', 'citas-programadas', 'seguros'],
                    'inventario': ['medicamentos', 'insumos-medicos', 'equipamiento']
                },
                
                metricasClave: [
                    { id: 'pacientes-dia', nombre: 'Pacientes por Día', unidad: 'cantidad' },
                    { id: 'ingreso-consulta', nombre: 'Ingreso por Consulta', unidad: 'S/.' },
                    { id: 'tasa-ocupacion', nombre: 'Tasa de Ocupación', unidad: '%' },
                    { id: 'satisfaccion', nombre: 'Satisfacción', unidad: '/5' }
                ]
            },

            'educacion': {
                id: 'educacion',
                nombre: 'Educación y Academia',
                icono: '📚',
                descripcion: 'Colegios, academias e institutos',
                categoria: 'Educación',
                
                tamanos: {
                    micro: { alumnos: '< 50', empleados: '1-5' },
                    pequena: { alumnos: '50-200', empleados: '6-20' },
                    mediana: { alumnos: '200-800', empleados: '21-100' },
                    grande: { alumnos: '> 800', empleados: '> 100' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'clientes': { prioridad: 9, obligatorio: true },
                    'empleados': { prioridad: 8, obligatorio: false },
                    'reportes': { prioridad: 7, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['alumnos-activos', 'pensiones-cobradas', 'cursos-populares'],
                    'clientes': ['matriculas', 'pagos-pension', 'historial-academico'],
                    'empleados': ['docentes', 'asistencias', 'cursos-asignados']
                },
                
                metricasClave: [
                    { id: 'alumnos-matriculados', nombre: 'Alumnos Matriculados', unidad: 'cantidad' },
                    { id: 'tasa-desercion', nombre: 'Tasa de Deserción', unidad: '%' },
                    { id: 'pension-promedio', nombre: 'Pensión Promedio', unidad: 'S/.' },
                    { id: 'ocupacion-aulas', nombre: 'Ocupación de Aulas', unidad: '%' }
                ]
            },

            'ecommerce': {
                id: 'ecommerce',
                nombre: 'E-commerce y Tienda Online',
                icono: '🛒',
                descripcion: 'Tiendas virtuales y comercio electrónico',
                categoria: 'Digital',
                
                tamanos: {
                    micro: { pedidos: '< 50/mes', empleados: '1-2' },
                    pequena: { pedidos: '50-500/mes', empleados: '3-10' },
                    mediana: { pedidos: '500-5000/mes', empleados: '11-50' },
                    grande: { pedidos: '> 5000/mes', empleados: '> 50' }
                },
                
                modulosRecomendados: {
                    'flujo-caja': { prioridad: 10, obligatorio: true },
                    'inventario': { prioridad: 10, obligatorio: true },
                    'clientes': { prioridad: 9, obligatorio: true },
                    'facturacion': { prioridad: 8, obligatorio: false },
                    'reportes': { prioridad: 8, obligatorio: false }
                },
                
                componentesPersonalizados: {
                    'panel-control': ['ventas-online', 'pedidos-pendientes', 'productos-top'],
                    'inventario': ['stock-multicanal', 'productos-agotados', 'rotacion'],
                    'clientes': ['carrito-abandonado', 'recompra', 'reviews']
                },
                
                metricasClave: [
                    { id: 'conversion-rate', nombre: 'Tasa de Conversión', unidad: '%' },
                    { id: 'ticket-promedio', nombre: 'Ticket Promedio', unidad: 'S/.' },
                    { id: 'costo-adquisicion', nombre: 'CAC', unidad: 'S/.' },
                    { id: 'lifetime-value', nombre: 'LTV', unidad: 'S/.' }
                ]
            }
        };

        console.log(`✅ Base de ${Object.keys(this.perfiles).length} perfiles industriales cargada`);
    }

    obtenerPerfil(industriaId) {
        return this.perfiles[industriaId] || null;
    }

    obtenerTodosLosPerfiles() {
        return this.perfiles;
    }

    buscarPerfilesPorCategoria(categoria) {
        return Object.values(this.perfiles).filter(p => p.categoria === categoria);
    }

    obtenerCategorias() {
        const categorias = new Set();
        Object.values(this.perfiles).forEach(p => categorias.add(p.categoria));
        return Array.from(categorias);
    }

    recomendarPerfil(respuestasOnboarding) {
        // Lógica para recomendar perfil basado en respuestas
        // Se implementará en el módulo de onboarding
        return null;
    }

    agregarPerfilPersonalizado(perfil) {
        if (!perfil.id || this.perfiles[perfil.id]) {
            console.error('Perfil inválido o ya existe');
            return false;
        }

        this.perfiles[perfil.id] = perfil;
        this._guardarPerfilesPersonalizados();
        return true;
    }

    _guardarPerfilesPersonalizados() {
        try {
            const personalizados = Object.values(this.perfiles)
                .filter(p => p.personalizado === true);
            localStorage.setItem('grizalum_perfiles_personalizados', JSON.stringify(personalizados));
        } catch (error) {
            console.error('Error guardando perfiles personalizados:', error);
        }
    }

    _cargarPerfilesPersonalizados() {
        try {
            const personalizados = localStorage.getItem('grizalum_perfiles_personalizados');
            if (personalizados) {
                const perfiles = JSON.parse(personalizados);
                perfiles.forEach(p => {
                    if (!this.perfiles[p.id]) {
                        this.perfiles[p.id] = p;
                    }
                });
            }
        } catch (error) {
            console.error('Error cargando perfiles personalizados:', error);
        }
    }
}

// Inicialización global
window.perfilesIndustriales = new PerfilesIndustriales();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  📊 BASE DE DATOS DE PERFILES INDUSTRIALES                    ║
║  ${Object.keys(window.perfilesIndustriales.perfiles).length} industrias configuradas y listas                      ║
╚═══════════════════════════════════════════════════════════════╝
`);
