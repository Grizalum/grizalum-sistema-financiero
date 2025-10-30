/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - SISTEMA DE NIVELES v2.0
 * Sistema inteligente de niveles progresivos
 * ═══════════════════════════════════════════════════════════════════
 */

class SistemaNivelesProfesional {
    constructor() {
        this.niveles = this._definirNiveles();
        this.evaluador = new EvaluadorNiveles();
        
        console.log('📊 Sistema de Niveles Profesional inicializado');
    }

    /**
     * Definición de los 4 niveles
     */
    _definirNiveles() {
        return {
            INDIVIDUAL: {
                id: 'INDIVIDUAL',
                nombre: 'Individual',
                descripcion: 'Control básico para emprendedores',
                scoreMin: 0,
                scoreMax: 25,
                color: '#4A90E2',
                icono: '👤',
                
                funcionalidades: [
                    'Registro de transacciones',
                    'Balance básico',
                    'Lista de movimientos',
                    'Categorías predefinidas (6)',
                    'Reportes PDF básicos'
                ],
                
                limites: {
                    transacciones: 100,
                    empresas: 1,
                    usuarios: 1
                }
            },

            PROFESIONAL: {
                id: 'PROFESIONAL',
                nombre: 'Profesional',
                descripcion: 'Análisis avanzado para negocios establecidos',
                scoreMin: 26,
                scoreMax: 50,
                color: '#7B68EE',
                icono: '💼',
                
                funcionalidades: [
                    'Todo de Individual +',
                    'Filtros avanzados',
                    'Búsqueda inteligente',
                    'Categorías personalizadas ilimitadas',
                    'Gráficos interactivos',
                    'Comparativa mensual',
                    'Exportar PDF avanzado'
                ],
                
                limites: {
                    transacciones: 500,
                    empresas: 2,
                    usuarios: 2
                }
            },

            EMPRESARIAL: {
                id: 'EMPRESARIAL',
                nombre: 'Empresarial',
                descripcion: 'Gestión integral con proyecciones',
                scoreMin: 51,
                scoreMax: 75,
                color: '#E67E22',
                icono: '🏢',
                
                funcionalidades: [
                    'Todo de Profesional +',
                    'Proyecciones financieras',
                    'Multi-cuenta bancaria',
                    'Exportar Excel',
                    'Reportes ejecutivos',
                    'Presupuestos',
                    'Comparativa trimestral',
                    'IA analista avanzada'
                ],
                
                limites: {
                    transacciones: 2000,
                    empresas: 5,
                    usuarios: 10
                }
            },

            CORPORATIVO: {
                id: 'CORPORATIVO',
                nombre: 'Corporativo',
                descripcion: 'Business Intelligence completo',
                scoreMin: 76,
                scoreMax: 100,
                color: '#9B59B6',
                icono: '🏛️',
                
                funcionalidades: [
                    'Todo de Empresarial +',
                    'Consolidación de grupos',
                    'Business Intelligence',
                    'API e integraciones',
                    'Facturación SUNAT',
                    'Roles y permisos avanzados',
                    'Auditoría completa',
                    'Soporte 24/7 prioritario'
                ],
                
                limites: {
                    transacciones: Infinity,
                    empresas: Infinity,
                    usuarios: Infinity
                }
            }
        };
    }

    /**
     * Obtener nivel según score
     */
    obtenerNivelPorScore(score) {
        for (const [id, nivel] of Object.entries(this.niveles)) {
            if (score >= nivel.scoreMin && score <= nivel.scoreMax) {
                return nivel;
            }
        }
        return this.niveles.INDIVIDUAL;
    }

    /**
     * Obtener nivel de una empresa
     */
    obtenerNivelEmpresa(empresaId) {
        if (!window.gestorEmpresas) {
            console.warn('⚠️ Gestor de empresas no disponible');
            return null;
        }

        const empresa = window.gestorEmpresas.estado.empresas[empresaId];
        if (!empresa) {
            console.warn(`⚠️ Empresa ${empresaId} no encontrada`);
            return null;
        }

        const score = empresa.score || 0;
        const nivel = this.obtenerNivelPorScore(score);

        return {
            nivel,
            score,
            empresaId
        };
    }

    /**
     * Evaluar si una empresa puede subir de nivel
     */
    async evaluarAscenso(empresaId) {
        const resultado = await this.evaluador.evaluar(empresaId);
        
        if (resultado.listo) {
            console.log(`🎉 Empresa ${empresaId} lista para subir a ${resultado.nivelSiguiente.nombre}`);
            
            // Disparar evento
            window.dispatchEvent(new CustomEvent('grizalumEmpresaListaAscenso', {
                detail: {
                    empresaId,
                    nivelActual: resultado.nivelActual,
                    nivelSiguiente: resultado.nivelSiguiente,
                    razones: resultado.razones
                }
            }));
        }
        
        return resultado;
    }

    /**
     * Forzar ascenso manual (para testing o IA)
     */
    async ascenderEmpresa(empresaId, nuevoScore) {
        if (!window.gestorEmpresas) return false;

        const empresa = window.gestorEmpresas.estado.empresas[empresaId];
        if (!empresa) return false;

        const nivelAnterior = this.obtenerNivelPorScore(empresa.score);
        empresa.score = nuevoScore;
        const nivelNuevo = this.obtenerNivelPorScore(nuevoScore);

        // Guardar cambios
        window.gestorEmpresas._guardarEstado();

        console.log(`✨ Empresa ${empresaId} ascendida a ${nivelNuevo.nombre}`);

        // Disparar evento
        window.dispatchEvent(new CustomEvent('grizalumCambioNivel', {
            detail: {
                empresaId,
                nivelAnterior,
                nivelNuevo,
                scoreNuevo: nuevoScore
            }
        }));

        return true;
    }

    /**
     * Verificar si una funcionalidad está disponible
     */
    tieneAcceso(empresaId, funcionalidad) {
        const nivel = this.obtenerNivelEmpresa(empresaId);
        if (!nivel) return false;

        return nivel.nivel.funcionalidades.some(f => 
            f.toLowerCase().includes(funcionalidad.toLowerCase())
        );
    }

    /**
     * Obtener todos los niveles
     */
    obtenerTodosLosNiveles() {
        return this.niveles;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * EVALUADOR DE NIVELES
 * Analiza el comportamiento del usuario para recomendar ascenso
 * ═══════════════════════════════════════════════════════════════════
 */

class EvaluadorNiveles {
    constructor() {
        this.criterios = this._definirCriterios();
    }

    /**
     * Definir criterios de ascenso
     */
    _definirCriterios() {
        return {
            INDIVIDUAL_a_PROFESIONAL: {
                transaccionesMinimas: 100,
                diasUsoMinimos: 15,
                categoriasUsadas: 5,
                intentosFuncionesAvanzadas: 3,
                
                mensaje: (datos) => `
                    🎯 ANÁLISIS DE TU NEGOCIO
                    
                    He observado tu actividad:
                    ✅ ${datos.transacciones} transacciones registradas
                    ✅ ${datos.diasUso} días de uso constante
                    ✅ ${datos.categorias} categorías diferentes
                    ✅ Has intentado usar funciones avanzadas ${datos.intentos} veces
                    
                    Tu negocio ha evolucionado. El nivel INDIVIDUAL se está quedando corto.
                    
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    
                    💼 TE RECOMIENDO: NIVEL PROFESIONAL
                    
                    Con este nivel podrás:
                    • 📊 Filtros avanzados para encontrar transacciones
                    • 🔍 Búsqueda inteligente
                    • 🏷️ Crear tus propias categorías
                    • 📈 Ver gráficos de tendencias
                    • 📑 Comparar períodos
                    
                    🎁 Prueba GRATIS por 30 días
                `
            },

            PROFESIONAL_a_EMPRESARIAL: {
                transaccionesMinimas: 500,
                volumenMensual: 200,
                exportaciones: 5,
                busquedasComplejas: 10,
                
                mensaje: (datos) => `
                    📊 EVALUACIÓN DE CRECIMIENTO
                    
                    ${datos.nombreEmpresa}, tu negocio está en otro nivel:
                    
                    📈 ${datos.transacciones} transacciones totales
                    💰 Volumen mensual: ${datos.volumenMensual} operaciones
                    📑 Has exportado reportes ${datos.exportaciones} veces
                    
                    El nivel PROFESIONAL ya no es suficiente.
                    
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    
                    🏢 ES MOMENTO DE: NIVEL EMPRESARIAL
                    
                    Ganarás:
                    • 📊 Proyecciones financieras automáticas
                    • 🏦 Gestión de múltiples cuentas bancarias
                    • 📑 Exportación avanzada a Excel
                    • 📈 Reportes ejecutivos profesionales
                    • 💼 Presupuestos y control de gastos
                    
                    Esto te ahorrará 10+ horas/semana.
                `
            },

            EMPRESARIAL_a_CORPORATIVO: {
                transaccionesMinimas: 2000,
                empresasMultiples: 3,
                usuariosMultiples: 5,
                complejidadOperaciones: 'alta',
                
                mensaje: (datos) => `
                    🏛️ ANÁLISIS CORPORATIVO
                    
                    Tu operación ha alcanzado nivel corporativo:
                    
                    🏢 ${datos.empresas} empresas gestionadas
                    👥 ${datos.usuarios} usuarios activos
                    📊 ${datos.transacciones}+ transacciones
                    
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    
                    🏛️ NIVEL CORPORATIVO DISPONIBLE
                    
                    Incluye:
                    • 🔗 Consolidación de grupos empresariales
                    • 📊 Business Intelligence avanzado
                    • 🔌 API para integraciones
                    • 📋 Facturación electrónica SUNAT
                    • 🛡️ Auditoría y permisos avanzados
                    • 🎯 Soporte prioritario 24/7
                    
                    Contacta con ventas para una demo personalizada.
                `
            }
        };
    }

    /**
     * Evaluar empresa
     */
    async evaluar(empresaId) {
        if (!window.gestorEmpresas) {
            return { listo: false, razon: 'Gestor no disponible' };
        }

        const empresa = window.gestorEmpresas.estado.empresas[empresaId];
        if (!empresa) {
            return { listo: false, razon: 'Empresa no encontrada' };
        }

        const score = empresa.score || 0;
        const nivelActual = window.grizalumNiveles.obtenerNivelPorScore(score);
        
        // Determinar siguiente nivel
        const nivelSiguiente = this._obtenerSiguienteNivel(nivelActual.id);
        if (!nivelSiguiente) {
            return { listo: false, razon: 'Ya estás en el nivel máximo' };
        }

        // Obtener criterios
        const criteriosKey = `${nivelActual.id}_a_${nivelSiguiente.id}`;
        const criterios = this.criterios[criteriosKey];
        
        if (!criterios) {
            return { listo: false, razon: 'Criterios no definidos' };
        }

        // Analizar comportamiento
        const analisis = await this._analizarComportamiento(empresaId);
        
        // Verificar si cumple criterios
        const cumpleCriterios = this._verificarCriterios(analisis, criterios);
        
        if (!cumpleCriterios) {
            return {
                listo: false,
                razon: 'No cumple criterios todavía',
                analisis,
                criterios
            };
        }

        // Listo para ascender
        return {
            listo: true,
            nivelActual,
            nivelSiguiente,
            analisis,
            razones: this._generarRazones(analisis, criterios),
            mensaje: criterios.mensaje(analisis)
        };
    }

    /**
     * Analizar comportamiento de la empresa
     */
    async _analizarComportamiento(empresaId) {
        // Datos de transacciones
        const keyTransacciones = `grizalum_flujo_caja_${empresaId}`;
        const transaccionesData = localStorage.getItem(keyTransacciones);
        const transacciones = transaccionesData ? JSON.parse(transaccionesData) : [];

        // Datos de uso
        const keyUso = `grizalum_uso_${empresaId}`;
        const usoData = localStorage.getItem(keyUso);
        const uso = usoData ? JSON.parse(usoData) : {};

        // Calcular métricas
        const ahora = new Date();
        const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const transaccionesMes = transacciones.filter(t => 
            new Date(t.fecha) >= hace30Dias
        ).length;

        const categoriasUsadas = new Set(transacciones.map(t => t.categoria)).size;

        const diasUso = uso.diasActivos || 0;
        const intentosFunciones = uso.intentosFuncionesAvanzadas || 0;
        const exportaciones = uso.exportaciones || 0;
        const busquedas = uso.busquedasRealizadas || 0;

        return {
            empresaId,
            nombreEmpresa: window.gestorEmpresas.estado.empresas[empresaId]?.nombre || empresaId,
            transacciones: transacciones.length,
            transaccionesMes,
            volumenMensual: transaccionesMes,
            categorias: categoriasUsadas,
            diasUso,
            intentos: intentosFunciones,
            exportaciones,
            busquedasComplejas: busquedas,
            empresas: Object.keys(window.gestorEmpresas.estado.empresas).length,
            usuarios: 1 // TODO: implementar multi-usuario
        };
    }

    /**
     * Verificar si cumple criterios
     */
    _verificarCriterios(analisis, criterios) {
        const checks = [];

        if (criterios.transaccionesMinimas) {
            checks.push(analisis.transacciones >= criterios.transaccionesMinimas);
        }

        if (criterios.diasUsoMinimos) {
            checks.push(analisis.diasUso >= criterios.diasUsoMinimos);
        }

        if (criterios.categoriasUsadas) {
            checks.push(analisis.categorias >= criterios.categoriasUsadas);
        }

        if (criterios.intentosFuncionesAvanzadas) {
            checks.push(analisis.intentos >= criterios.intentosFuncionesAvanzadas);
        }

        if (criterios.volumenMensual) {
            checks.push(analisis.volumenMensual >= criterios.volumenMensual);
        }

        if (criterios.exportaciones) {
            checks.push(analisis.exportaciones >= criterios.exportaciones);
        }

        if (criterios.busquedasComplejas) {
            checks.push(analisis.busquedasComplejas >= criterios.busquedasComplejas);
        }

        if (criterios.empresasMultiples) {
            checks.push(analisis.empresas >= criterios.empresasMultiples);
        }

        if (criterios.usuariosMultiples) {
            checks.push(analisis.usuarios >= criterios.usuariosMultiples);
        }

        // Debe cumplir al menos el 70% de los criterios
        const cumplidos = checks.filter(c => c).length;
        const total = checks.length;
        const porcentaje = total > 0 ? (cumplidos / total) * 100 : 0;

        return porcentaje >= 70;
    }

    /**
     * Generar razones legibles
     */
    _generarRazones(analisis, criterios) {
        const razones = [];

        if (criterios.transaccionesMinimas && analisis.transacciones >= criterios.transaccionesMinimas) {
            razones.push(`Tienes ${analisis.transacciones} transacciones (excelente)`);
        }

        if (criterios.diasUsoMinimos && analisis.diasUso >= criterios.diasUsoMinimos) {
            razones.push(`Usas GRIZALUM consistentemente (${analisis.diasUso} días)`);
        }

        if (criterios.categoriasUsadas && analisis.categorias >= criterios.categoriasUsadas) {
            razones.push(`Usas ${analisis.categorias} categorías diferentes`);
        }

        if (criterios.volumenMensual && analisis.volumenMensual >= criterios.volumenMensual) {
            razones.push(`Alto volumen mensual: ${analisis.volumenMensual} operaciones`);
        }

        return razones;
    }

    /**
     * Obtener siguiente nivel
     */
    _obtenerSiguienteNivel(nivelActualId) {
        const niveles = window.grizalumNiveles.niveles;
        const orden = ['INDIVIDUAL', 'PROFESIONAL', 'EMPRESARIAL', 'CORPORATIVO'];
        const index = orden.indexOf(nivelActualId);
        
        if (index === -1 || index === orden.length - 1) {
            return null;
        }

        return niveles[orden[index + 1]];
    }
}

// ═══════════════════════════════════════════════════════════════════
// INSTANCIA GLOBAL (nombre único para evitar conflictos)
// ═══════════════════════════════════════════════════════════════════

window.grizalumNiveles = new SistemaNivelesProfesional();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  📊 SISTEMA DE NIVELES v2.0                                   ║
║  👤 INDIVIDUAL → 💼 PROFESIONAL → 🏢 EMPRESARIAL → 🏛️ CORPORATIVO ║
╚═══════════════════════════════════════════════════════════════╝
`);
