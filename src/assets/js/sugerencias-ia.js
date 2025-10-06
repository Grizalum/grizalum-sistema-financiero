/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - SISTEMA DE SUGERENCIAS INTELIGENTES
 * Motor de análisis de comportamiento y recomendaciones contextuales
 * ═══════════════════════════════════════════════════════════════════
 */

class SistemaSugerenciasIA {
    constructor() {
        this.gestor = null;
        this.perfiles = null;
        this.empresaActual = null;
        
        // Sistema de tracking
        this.tracking = {
            modulosAbiertos: {},
            botonesClicados: {},
            tiempoEnModulos: {},
            erroresUsuario: [],
            patronesDetectados: []
        };
        
        // Umbrales de detección
        this.umbrales = {
            usoMinimo: 3, // Veces que debe usar algo para considerar "usado"
            tiempoMinimo: 30000, // 30 segundos en módulo
            diasParaSugerir: 0, // Días antes de mostrar sugerencias
            sugerenciasPorDia: 3 // Máximo de sugerencias por día
        };
        
        // Cola de sugerencias pendientes
        this.sugerenciasPendientes = [];
        this.sugerenciasMostradas = [];
        
        console.log('🤖 Sistema de Sugerencias IA inicializando...');
        this._esperarDependencias();
    }

    _esperarDependencias() {
        const intentar = () => {
            if (window.gestorEmpresas && window.perfilesIndustriales) {
                this.gestor = window.gestorEmpresas;
                this.perfiles = window.perfilesIndustriales;
                this._inicializar();
                return true;
            }
            return false;
        };

        if (!intentar()) {
            setTimeout(() => {
                if (!intentar()) {
                    setTimeout(() => {
                        if (!intentar()) {
                            setTimeout(intentar, 2000);
                        }
                    }, 1000);
                }
            }, 500);
        }
    }

    _inicializar() {
        // Escuchar cambios de empresa
        document.addEventListener('grizalumCompanyChanged', (e) => {
            this.empresaActual = e.detail.companyId;
            this._cargarDatosTracking();
            this._analizarYSugerir();
        });

        // Iniciar tracking de actividad
        this._iniciarTracking();
        
        // Verificar sugerencias cada 5 minutos
        setInterval(() => this._analizarYSugerir(), 300000);
        
        console.log('✅ Sistema de Sugerencias IA listo');
    }

    _iniciarTracking() {
        // Tracking de clics en módulos
        document.addEventListener('click', (e) => {
            const moduloLink = e.target.closest('[data-modulo]');
            if (moduloLink) {
                const moduloId = moduloLink.dataset.modulo;
                this._registrarAcceso(moduloId);
            }
        });

        // Tracking de tiempo en página
        let tiempoInicio = Date.now();
        let moduloActual = null;

        const detectarModuloActual = () => {
            const url = window.location.hash || window.location.pathname;
            if (url.includes('flujo-caja')) return 'flujo-caja';
            if (url.includes('inventario')) return 'inventario';
            if (url.includes('clientes')) return 'clientes';
            if (url.includes('empleados')) return 'empleados';
            return 'panel-control';
        };

        setInterval(() => {
            const modulo = detectarModuloActual();
            if (modulo !== moduloActual) {
                if (moduloActual) {
                    const tiempo = Date.now() - tiempoInicio;
                    this._registrarTiempo(moduloActual, tiempo);
                }
                moduloActual = modulo;
                tiempoInicio = Date.now();
            }
        }, 5000);

        console.log('📊 Tracking de comportamiento activado');
    }

    _registrarAcceso(moduloId) {
        if (!this.empresaActual) return;

        if (!this.tracking.modulosAbiertos[moduloId]) {
            this.tracking.modulosAbiertos[moduloId] = 0;
        }
        this.tracking.modulosAbiertos[moduloId]++;

        this._guardarTracking();
    }

    _registrarTiempo(moduloId, milisegundos) {
        if (!this.empresaActual) return;

        if (!this.tracking.tiempoEnModulos[moduloId]) {
            this.tracking.tiempoEnModulos[moduloId] = 0;
        }
        this.tracking.tiempoEnModulos[moduloId] += milisegundos;

        this._guardarTracking();
    }

    _analizarYSugerir() {
        if (!this.empresaActual) return;

        const empresa = this.gestor.estado.empresas[this.empresaActual];
        if (!empresa) return;


        // No exceder límite diario
        if (this._sugerenciasHoy() >= this.umbrales.sugerenciasPorDia) {
            console.log('⏸️ Límite de sugerencias diarias alcanzado');
            return;
        }

        // Generar sugerencias
        this.sugerenciasPendientes = [];
        
        this._analizarModulosInactivos(empresa);
        this._analizarComponentesNoUsados(empresa);
        this._analizarPatronesIndustria(empresa);
        this._analizarOportunidadesMejora(empresa);

        // Mostrar la mejor sugerencia
        if (this.sugerenciasPendientes.length > 0) {
            this._mostrarSugerencia(this.sugerenciasPendientes[0]);
        }
    }

    _analizarModulosInactivos(empresa) {
        const modulosActivos = empresa.modulosActivos || {};
        const perfil = this.perfiles.obtenerPerfil(empresa.perfilIndustrial);
        
        if (!perfil) return;

        Object.entries(perfil.modulosRecomendados).forEach(([moduloId, config]) => {
            // Si el módulo está inactivo pero tiene alta prioridad
            if (!modulosActivos[moduloId] && config.prioridad >= 8) {
                
                // Verificar si hay evidencia de necesidad
                const necesita = this._detectarNecesidad(moduloId, empresa);
                
                if (necesita) {
                    const modulo = window.sistemaModulos.catalogoModulos[moduloId];
                    
                    this.sugerenciasPendientes.push({
                        id: `activar-${moduloId}`,
                        tipo: 'modulo-nuevo',
                        prioridad: config.prioridad,
                        icono: modulo?.icono || '🔧',
                        titulo: `¿Activar módulo de ${modulo?.nombre}?`,
                        descripcion: necesita.razon,
                        beneficio: modulo?.descripcion || 'Mejora tu control',
                        accion: {
                            tipo: 'activar-modulo',
                            moduloId: moduloId
                        },
                        confianza: necesita.confianza
                    });
                }
            }
        });
    }

    _detectarNecesidad(moduloId, empresa) {
        const tracking = this.tracking;
        const contexto = empresa.contextoNegocio || {};
        // Fallback si no hay contexto (empresas sin onboarding)
if (!contexto.complejidad && empresa.modulosActivos) {
    const modulosActivos = Object.values(empresa.modulosActivos).filter(v => v).length;
    contexto.complejidad = modulosActivos > 5 ? 'complejo' : modulosActivos > 3 ? 'intermedio' : 'simple';
}

        // Detección inteligente por módulo
        switch (moduloId) {
            case 'inventario':
                if (contexto.complejidad === 'complejo' && !empresa.modulosActivos?.inventario) {
                    return {
                        razon: 'Detectamos operaciones complejas. El control de inventario te ayudará',
                        confianza: 85
                    };
                }
                break;

            case 'clientes':
                const usaFlujoCaja = tracking.modulosAbiertos['flujo-caja'] > 10;
                if (usaFlujoCaja && !empresa.modulosActivos?.clientes) {
                    return {
                        razon: 'Registras muchos movimientos. Un CRM mejorará tus ventas',
                        confianza: 78
                    };
                }
                break;

            case 'facturacion':
                if (contexto.facturacion === 'facturas' && !empresa.modulosActivos?.facturacion) {
                    return {
                        razon: 'Emites facturas. Activa este módulo para agilizar el proceso',
                        confianza: 92
                    };
                }
                break;

            case 'empleados':
                if (contexto.tamano !== 'solo' && !empresa.modulosActivos?.empleados) {
                    return {
                        razon: 'Tienes personal. Control de empleados simplifica la gestión',
                        confianza: 80
                    };
                }
                break;
        }

        return null;
    }

    _analizarComponentesNoUsados(empresa) {
        // Analizar qué componentes visuales nunca usa
        Object.entries(this.tracking.modulosAbiertos).forEach(([moduloId, veces]) => {
            if (veces < this.umbrales.usoMinimo && empresa.modulosActivos?.[moduloId]) {
                
                const modulo = window.sistemaModulos.catalogoModulos[moduloId];
                
                this.sugerenciasPendientes.push({
                    id: `desactivar-${moduloId}`,
                    tipo: 'optimizacion',
                    prioridad: 5,
                    icono: '✨',
                    titulo: `Simplifica tu interfaz`,
                    descripcion: `Casi no usas ${modulo?.nombre}. ¿Lo ocultamos?`,
                    beneficio: 'Interfaz más limpia y rápida',
                    accion: {
                        tipo: 'desactivar-modulo',
                        moduloId: moduloId
                    },
                    confianza: 70
                });
            }
        });
    }

    _analizarPatronesIndustria(empresa) {
        // Comparar con patrones de empresas similares
        const patrones = JSON.parse(localStorage.getItem('grizalum_patrones_aprendizaje') || '{}');
        const industriaId = empresa.perfilIndustrial;
        
        if (!patrones[industriaId]) return;

        const configuraciones = patrones[industriaId].configuraciones || [];
        if (configuraciones.length < 5) return; // Pocos datos

        // Analizar qué módulos son más comunes
        const modulosFrecuentes = {};
        configuraciones.forEach(config => {
            Object.entries(config.modulos || {}).forEach(([moduloId, activo]) => {
                if (activo) {
                    modulosFrecuentes[moduloId] = (modulosFrecuentes[moduloId] || 0) + 1;
                }
            });
        });

        // Sugerir módulos que el 70%+ de empresas similares usan
        Object.entries(modulosFrecuentes).forEach(([moduloId, cantidad]) => {
            const porcentaje = (cantidad / configuraciones.length) * 100;
            
            if (porcentaje >= 70 && !empresa.modulosActivos?.[moduloId]) {
                const modulo = window.sistemaModulos.catalogoModulos[moduloId];
                
                this.sugerenciasPendientes.push({
                    id: `colectivo-${moduloId}`,
                    tipo: 'aprendizaje-colectivo',
                    prioridad: 7,
                    icono: '👥',
                    titulo: `Aprendizaje colectivo`,
                    descripcion: `El ${Math.round(porcentaje)}% de ${empresa.categoria || 'empresas similares'} usan ${modulo?.nombre}`,
                    beneficio: 'Basado en experiencia de usuarios reales',
                    accion: {
                        tipo: 'activar-modulo',
                        moduloId: moduloId
                    },
                    confianza: porcentaje
                });
            }
        });
    }

    _analizarOportunidadesMejora(empresa) {
        const contexto = empresa.contextoNegocio || {};

        // Sugerencias según urgencia declarada
        if (contexto.urgencia === 'eficiencia') {
            this.sugerenciasPendientes.push({
                id: 'eficiencia-atajos',
                tipo: 'consejo',
                prioridad: 6,
                icono: '💡',
                titulo: 'Ahorra tiempo con atajos',
                descripcion: 'Usa Ctrl+N para registrar movimientos rápidos',
                beneficio: 'Registro 3x más rápido',
                accion: {
                    tipo: 'mostrar-tutorial',
                    tema: 'atajos-teclado'
                },
                confianza: 100
            });
        }

        // Sugerencia si tiene muchos movimientos pero no usa reportes
        const usaFlujoCaja = this.tracking.modulosAbiertos['flujo-caja'] > 15;
        const usaReportes = this.tracking.modulosAbiertos['reportes'] > 3;
        
        if (usaFlujoCaja && !usaReportes && empresa.modulosActivos?.reportes) {
            this.sugerenciasPendientes.push({
                id: 'usa-reportes',
                tipo: 'consejo',
                prioridad: 8,
                icono: '📊',
                titulo: 'Aprovecha tus reportes',
                descripcion: 'Tienes muchos datos. Los reportes te darán insights valiosos',
                beneficio: 'Decisiones basadas en datos',
                accion: {
                    tipo: 'abrir-modulo',
                    moduloId: 'reportes'
                },
                confianza: 85
            });
        }
    }

    _mostrarSugerencia(sugerencia) {
        // Verificar que no se haya mostrado antes
        if (this.sugerenciasMostradas.includes(sugerencia.id)) return;

        // Crear notificación elegante
        const notif = document.createElement('div');
        notif.className = 'sugerencia-ia';
        notif.dataset.sugerenciaId = sugerencia.id;

        notif.innerHTML = `
            <div class="sugerencia-contenido">
                <div class="sugerencia-icono">${sugerencia.icono}</div>
                <div class="sugerencia-info">
                    <div class="sugerencia-header">
                        <h4>${sugerencia.titulo}</h4>
                        <button class="sugerencia-cerrar" onclick="sugerenciasIA.descartarSugerencia('${sugerencia.id}')">✕</button>
                    </div>
                    <p class="sugerencia-descripcion">${sugerencia.descripcion}</p>
                    <div class="sugerencia-beneficio">✓ ${sugerencia.beneficio}</div>
                    <div class="sugerencia-confianza">
                        Confianza: ${sugerencia.confianza}%
                        <div class="confianza-bar">
                            <div class="confianza-fill" style="width: ${sugerencia.confianza}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sugerencia-acciones">
                <button class="btn-sugerencia-ignorar" onclick="sugerenciasIA.ignorarSugerencia('${sugerencia.id}')">
                    Ahora no
                </button>
                <button class="btn-sugerencia-aceptar" onclick="sugerenciasIA.aceptarSugerencia('${sugerencia.id}', ${JSON.stringify(sugerencia.accion).replace(/"/g, '&quot;')})">
                    ${this._obtenerTextoBoton(sugerencia.accion)}
                </button>
            </div>
        `;

        document.body.appendChild(notif);
        setTimeout(() => notif.classList.add('mostrar'), 100);

        // Registrar que se mostró
        this.sugerenciasMostradas.push(sugerencia.id);
        this._guardarSugerenciasMostradas();

        console.log(`💡 Sugerencia mostrada: ${sugerencia.titulo}`);
    }

    _obtenerTextoBoton(accion) {
        switch (accion.tipo) {
            case 'activar-modulo': return 'Activar ahora';
            case 'desactivar-modulo': return 'Ocultar módulo';
            case 'abrir-modulo': return 'Ver ahora';
            case 'mostrar-tutorial': return 'Ver tutorial';
            default: return 'Aplicar';
        }
    }

    aceptarSugerencia(sugerenciaId, accion) {
        console.log('✅ Sugerencia aceptada:', sugerenciaId, accion);

        switch (accion.tipo) {
            case 'activar-modulo':
                this._activarModulo(accion.moduloId);
                break;
            case 'desactivar-modulo':
                this._desactivarModulo(accion.moduloId);
                break;
            case 'abrir-modulo':
                this._abrirModulo(accion.moduloId);
                break;
            case 'mostrar-tutorial':
                alert(`Tutorial: ${accion.tema} (próximamente)`);
                break;
        }

        this._cerrarSugerencia(sugerenciaId);
    }

    ignorarSugerencia(sugerenciaId) {
        console.log('⏭️ Sugerencia ignorada:', sugerenciaId);
        this._cerrarSugerencia(sugerenciaId);
    }

    descartarSugerencia(sugerenciaId) {
        console.log('❌ Sugerencia descartada:', sugerenciaId);
        this._cerrarSugerencia(sugerenciaId);
        
        // Guardar como "no volver a sugerir"
        const noSugerir = JSON.parse(localStorage.getItem('grizalum_no_sugerir') || '[]');
        noSugerir.push(sugerenciaId);
        localStorage.setItem('grizalum_no_sugerir', JSON.stringify(noSugerir));
    }

    _cerrarSugerencia(sugerenciaId) {
        const notif = document.querySelector(`[data-sugerencia-id="${sugerenciaId}"]`);
        if (notif) {
            notif.classList.remove('mostrar');
            setTimeout(() => notif.remove(), 300);
        }
    }

    _activarModulo(moduloId) {
        if (!this.empresaActual) return;
        
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        if (!empresa.modulosActivos) empresa.modulosActivos = {};
        
        empresa.modulosActivos[moduloId] = true;
        this.gestor._guardarEmpresas();
        
        setTimeout(() => {
            alert(`✅ Módulo activado. Recarga la página para verlo.`);
            location.reload();
        }, 500);
    }

    _desactivarModulo(moduloId) {
        if (!this.empresaActual) return;
        
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        if (empresa.modulosActivos) {
            empresa.modulosActivos[moduloId] = false;
            this.gestor._guardarEmpresas();
        }
        
        setTimeout(() => {
            alert(`✅ Módulo ocultado. Recarga la página.`);
            location.reload();
        }, 500);
    }

    _abrirModulo(moduloId) {
        // Navegar al módulo
        window.location.hash = `#${moduloId}`;
    }

    _calcularDiasDesdeCreacion(empresa) {
        const fechaCreacion = new Date(empresa.meta?.fechaCreacion || Date.now());
        const ahora = new Date();
        const diferencia = ahora - fechaCreacion;
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    }

    _sugerenciasHoy() {
        const hoy = new Date().toDateString();
        const historial = JSON.parse(localStorage.getItem('grizalum_sugerencias_historial') || '[]');
        return historial.filter(s => new Date(s.fecha).toDateString() === hoy).length;
    }

    _cargarDatosTracking() {
        try {
            const key = `grizalum_tracking_${this.empresaActual}`;
            const datos = localStorage.getItem(key);
            if (datos) {
                this.tracking = JSON.parse(datos);
            }
        } catch (error) {
            console.error('Error cargando tracking:', error);
        }
    }

    _guardarTracking() {
        try {
            const key = `grizalum_tracking_${this.empresaActual}`;
            localStorage.setItem(key, JSON.stringify(this.tracking));
        } catch (error) {
            console.error('Error guardando tracking:', error);
        }
    }

    _guardarSugerenciasMostradas() {
        const historial = JSON.parse(localStorage.getItem('grizalum_sugerencias_historial') || '[]');
        historial.push({
            fecha: new Date().toISOString(),
            sugerencias: this.sugerenciasMostradas
        });
        localStorage.setItem('grizalum_sugerencias_historial', JSON.stringify(historial));
    }
}

// Inicialización global
window.sugerenciasIA = new SistemaSugerenciasIA();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🤖 SISTEMA DE SUGERENCIAS IA v1.0                            ║
║  Motor de análisis inteligente activado                       ║
╚═══════════════════════════════════════════════════════════════╝
`);
