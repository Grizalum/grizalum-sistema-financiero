/**
 * GRIZALUM - Sistema de Planes de Flujo de Caja
 * Configuración de funcionalidades por plan de pago
 * @version 1.0
 */

window.FlujoCajaPlanes = (function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // DEFINICIÓN DE PLANES
    // ═══════════════════════════════════════════════════════════════
    const PLANES = {
        individual: {
            id: 'individual',
            nombre: 'Individual',
            icono: '👤',
            color: '#6366f1',
            descripcion: 'Perfecto para uso personal y freelancers',
            limiteTransacciones: 100,
            funcionalidades: {
                transaccionesBasicas: true,
                balanceBasico: true,
                categoriasPredefdinidas: true,
                filtrosFecha: true,
                busquedaSimple: true,
                graficos: false,
                exportarExcel: false,
                categoriasPersonalizadas: false,
                historialDescripciones: false,
                graficosAvanzados: false,
                reportesPersonalizados: false,
                proyecciones: false,
                multiUsuario: false,
                apiAccess: false,
                soportePrioritario: false
            }
        },
        
        profesional: {
            id: 'profesional',
            nombre: 'Profesional',
            icono: '💼',
            color: '#8b5cf6',
            descripcion: 'Para pequeños negocios y profesionales',
            limiteTransacciones: 500,
            funcionalidades: {
                transaccionesBasicas: true,
                balanceBasico: true,
                categoriasPredefdinidas: true,
                filtrosFecha: true,
                busquedaSimple: true,
                graficos: true,
                exportarExcel: true,
                categoriasPersonalizadas: true,
                historialDescripciones: true,
                graficosAvanzados: false,
                reportesPersonalizados: false,
                proyecciones: false,
                multiUsuario: false,
                apiAccess: false,
                soportePrioritario: false
            }
        },
        
        empresarial: {
            id: 'empresarial',
            nombre: 'Empresarial',
            icono: '🏢',
            color: '#ec4899',
            descripcion: 'Para empresas medianas con necesidades avanzadas',
            limiteTransacciones: -1, // Ilimitado
            funcionalidades: {
                transaccionesBasicas: true,
                balanceBasico: true,
                categoriasPredefdinidas: true,
                filtrosFecha: true,
                busquedaSimple: true,
                graficos: true,
                exportarExcel: true,
                categoriasPersonalizadas: true,
                historialDescripciones: true,
                graficosAvanzados: true,
                reportesPersonalizados: true,
                proyecciones: true,
                multiUsuario: false,
                apiAccess: false,
                soportePrioritario: false
            }
        },
        
        corporativo: {
            id: 'corporativo',
            nombre: 'Corporativo',
            icono: '🌐',
            color: '#f59e0b',
            descripcion: 'Solución completa para grandes empresas',
            limiteTransacciones: -1, // Ilimitado
            funcionalidades: {
                transaccionesBasicas: true,
                balanceBasico: true,
                categoriasPredefdinidas: true,
                filtrosFecha: true,
                busquedaSimple: true,
                graficos: true,
                exportarExcel: true,
                categoriasPersonalizadas: true,
                historialDescripciones: true,
                graficosAvanzados: true,
                reportesPersonalizados: true,
                proyecciones: true,
                multiUsuario: true,
                apiAccess: true,
                soportePrioritario: true
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // GESTIÓN DE PLAN ACTUAL
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Obtener el plan actual del usuario
     * Por defecto: Individual
     */
    function obtenerPlanActual() {
        const planGuardado = localStorage.getItem('grizalum_planActual') || 'individual';
        return PLANES[planGuardado] || PLANES.individual;
    }
    
    /**
     * Cambiar el plan del usuario
     */
    function cambiarPlan(planId) {
        if (!PLANES[planId]) {
            console.error('❌ Plan no válido:', planId);
            return false;
        }
        
        localStorage.setItem('grizalum_planActual', planId);
        console.log('✅ Plan cambiado a:', PLANES[planId].nombre);
        
        // Emitir evento para que otros módulos se actualicen
        document.dispatchEvent(new CustomEvent('grizalumPlanCambiado', {
            detail: { plan: PLANES[planId] }
        }));
        
        return true;
    }
    
    /**
     * Verificar si el usuario tiene acceso a una funcionalidad
     */
    function tieneFuncionalidad(funcionalidad) {
        const planActual = obtenerPlanActual();
        return planActual.funcionalidades[funcionalidad] === true;
    }
    
    /**
     * Verificar si el usuario puede agregar más transacciones
     */
    function puedeAgregarTransaccion(cantidadActual) {
        const planActual = obtenerPlanActual();
        
        // -1 = ilimitado
        if (planActual.limiteTransacciones === -1) {
            return true;
        }
        
        return cantidadActual < planActual.limiteTransacciones;
    }
    
    /**
     * Obtener todos los planes disponibles
     */
    function obtenerTodosLosPlanes() {
        return Object.values(PLANES);
    }
    
    /**
     * Obtener componentes activos según el plan
     */
    function obtenerComponentesActivos() {
        const plan = obtenerPlanActual();
        const func = plan.funcionalidades;
        
        return {
            mejorasBasicas: {
                filtrosFecha: {
                    activo: func.filtrosFecha,
                    nombre: 'Filtros por Fecha'
                },
                busqueda: {
                    activo: func.busquedaSimple,
                    nombre: 'Búsqueda'
                }
            },
            visualizacionAvanzada: {
                graficosBasicos: {
                    activo: func.graficos,
                    nombre: 'Gráficos Básicos',
                    requierePlan: func.graficos ? null : 'profesional'
                },
                graficosAvanzados: {
                    activo: func.graficosAvanzados,
                    nombre: 'Gráficos Avanzados',
                    requierePlan: func.graficosAvanzados ? null : 'empresarial'
                },
                exportarExcel: {
                    activo: func.exportarExcel,
                    nombre: 'Exportar a Excel',
                    requierePlan: func.exportarExcel ? null : 'profesional'
                }
            },
            caracteristicasAvanzadas: {
                categoriasPersonalizadas: {
                    activo: func.categoriasPersonalizadas,
                    nombre: 'Categorías Personalizadas',
                    requierePlan: func.categoriasPersonalizadas ? null : 'profesional'
                },
                historialDescripciones: {
                    activo: func.historialDescripciones,
                    nombre: 'Autocompletado Inteligente',
                    requierePlan: func.historialDescripciones ? null : 'profesional'
                },
                reportesPersonalizados: {
                    activo: func.reportesPersonalizados,
                    nombre: 'Reportes Personalizados',
                    requierePlan: func.reportesPersonalizados ? null : 'empresarial'
                },
                proyecciones: {
                    activo: func.proyecciones,
                    nombre: 'Proyecciones',
                    requierePlan: func.proyecciones ? null : 'empresarial'
                }
            },
            empresarial: {
                multiUsuario: {
                    activo: func.multiUsuario,
                    nombre: 'Multi-Usuario',
                    requierePlan: func.multiUsuario ? null : 'corporativo'
                },
                apiAccess: {
                    activo: func.apiAccess,
                    nombre: 'API Access',
                    requierePlan: func.apiAccess ? null : 'corporativo'
                },
                soportePrioritario: {
                    activo: func.soportePrioritario,
                    nombre: 'Soporte Prioritario',
                    requierePlan: func.soportePrioritario ? null : 'corporativo'
                }
            }
        };
    }
    
    /**
     * Mostrar modal de upgrade cuando se intenta usar una función bloqueada
     */
    function mostrarModalUpgrade(funcionalidad, planRequerido) {
        const plan = PLANES[planRequerido];
        
        if (!plan) return;
        
        // Crear modal simple
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            animation: fadeIn 0.3s;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                text-align: center;
                animation: slideUp 0.3s;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${plan.icono}</div>
                <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #1f2937;">
                    Mejora a ${plan.nombre}
                </h2>
                <p style="color: #6b7280; margin-bottom: 1.5rem;">
                    Esta funcionalidad requiere el plan ${plan.nombre}
                </p>
                <button onclick="this.closest('div').parentElement.remove()" style="
                    width: 100%;
                    padding: 0.75rem;
                    background: ${plan.color};
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                ">
                    Mejorar Ahora
                </button>
                <button onclick="this.closest('div').parentElement.remove()" style="
                    width: 100%;
                    padding: 0.75rem;
                    background: transparent;
                    color: #6b7280;
                    border: none;
                    cursor: pointer;
                    font-size: 0.875rem;
                ">
                    Cancelar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // INICIALIZACIÓN
    // ═══════════════════════════════════════════════════════════════
    
    console.log('✅ Sistema de Planes cargado');
    console.log('📊 Plan actual:', obtenerPlanActual().nombre);

    // API Pública
    return {
        PLANES,
        obtenerPlanActual,
        cambiarPlan,
        tieneFuncionalidad,
        puedeAgregarTransaccion,
        obtenerTodosLosPlanes,
        obtenerComponentesActivos,
        mostrarModalUpgrade
    };
})();
