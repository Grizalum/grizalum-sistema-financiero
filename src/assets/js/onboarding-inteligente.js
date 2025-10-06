/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - ONBOARDING INTELIGENTE
 * Asistente de configuración inicial para nuevas empresas
 * ═══════════════════════════════════════════════════════════════════
 */

class OnboardingInteligente {
    constructor() {
        this.gestor = null;
        this.perfiles = null;
        this.pasoActual = 0;
        this.respuestas = {};
        this.perfilRecomendado = null;
        
        this.preguntas = [
            {
                id: 'industria',
                tipo: 'seleccion-visual',
                pregunta: '¿A qué se dedica tu empresa?',
                descripcion: 'Esto nos ayudará a configurar las herramientas adecuadas',
                opciones: 'dynamic' // Se carga desde perfiles
            },
            {
                id: 'tamano',
                tipo: 'seleccion',
                pregunta: '¿Qué tamaño tiene tu empresa?',
                descripcion: 'Esto determinará qué módulos son más útiles para ti',
                opciones: [
                    { id: 'micro', nombre: 'Micro', descripcion: '1-5 empleados o solo tú', icono: '👤' },
                    { id: 'pequena', nombre: 'Pequeña', descripcion: '6-20 empleados', icono: '👥' },
                    { id: 'mediana', nombre: 'Mediana', descripcion: '21-100 empleados', icono: '👨‍👩‍👧‍👦' },
                    { id: 'grande', nombre: 'Grande', descripcion: 'Más de 100 empleados', icono: '🏢' }
                ]
            },
            {
                id: 'objetivos',
                tipo: 'multiple',
                pregunta: '¿Qué necesitas controlar principalmente?',
                descripcion: 'Puedes elegir varias opciones',
                opciones: [
                    { id: 'dinero', nombre: 'Dinero (ingresos y gastos)', icono: '💰' },
                    { id: 'inventario', nombre: 'Productos o inventario', icono: '📦' },
                    { id: 'clientes', nombre: 'Clientes y ventas', icono: '👥' },
                    { id: 'empleados', nombre: 'Empleados y planilla', icono: '👷' },
                    { id: 'proyectos', nombre: 'Proyectos u obras', icono: '🎯' }
                ]
            },
            {
                id: 'experiencia',
                tipo: 'seleccion',
                pregunta: '¿Qué experiencia tienes con apps de gestión?',
                descripcion: 'Nos ayuda a ajustar la complejidad de la interfaz',
                opciones: [
                    { id: 'ninguna', nombre: 'Primera vez', descripcion: 'Nunca he usado algo similar', icono: '🌱' },
                    { id: 'basica', nombre: 'Básica', descripcion: 'He usado Excel o apps simples', icono: '📊' },
                    { id: 'avanzada', nombre: 'Avanzada', descripcion: 'He usado sistemas completos', icono: '🚀' }
                ]
            },
            {
                id: 'preferencia',
                tipo: 'seleccion',
                pregunta: '¿Qué prefieres al inicio?',
                descripcion: 'Siempre puedes cambiar esto después',
                opciones: [
                    { id: 'simple', nombre: 'Simple y Básico', descripcion: 'Solo lo esencial, sin complicaciones', icono: '✨' },
                    { id: 'balanceado', nombre: 'Balanceado', descripcion: 'Lo necesario para empezar bien', icono: '⚖️' },
                    { id: 'completo', nombre: 'Completo', descripcion: 'Todas las herramientas disponibles', icono: '🎯' }
                ]
            }
        ];
        
        console.log('🎯 Onboarding Inteligente inicializando...');
        this._esperarDependencias();
    }

    _esperarDependencias() {
        const intentar = () => {
            if (window.gestorEmpresas && window.perfilesIndustriales) {
                this.gestor = window.gestorEmpresas;
                this.perfiles = window.perfilesIndustriales;
                console.log('✅ Onboarding listo');
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

    iniciar(empresaId) {
        this.empresaId = empresaId;
        this.pasoActual = 0;
        this.respuestas = {};
        this.perfilRecomendado = null;
        
        this._mostrarWizard();
    }

    _mostrarWizard() {
        const modal = document.createElement('div');
        modal.className = 'onboarding-wizard';
        modal.id = 'onboardingWizard';

        modal.innerHTML = `
            <div class="wizard-contenido">
                ${this._generarHeaderWizard()}
                ${this._generarProgressBar()}
                ${this._generarPasoActual()}
                ${this._generarFooterWizard()}
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    _generarHeaderWizard() {
        return `
            <div class="wizard-header">
                <div class="wizard-icono">🎯</div>
                <div>
                    <h2>Configuración Inicial</h2>
                    <p>Te ayudaremos a configurar tu empresa en minutos</p>
                </div>
            </div>
        `;
    }

    _generarProgressBar() {
        const progreso = ((this.pasoActual + 1) / this.preguntas.length) * 100;
        
        return `
            <div class="wizard-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progreso}%"></div>
                </div>
                <div class="progress-texto">Paso ${this.pasoActual + 1} de ${this.preguntas.length}</div>
            </div>
        `;
    }

    _generarPasoActual() {
        const pregunta = this.preguntas[this.pasoActual];
        let contenido = '';

        switch (pregunta.tipo) {
            case 'seleccion-visual':
                contenido = this._generarSeleccionVisual(pregunta);
                break;
            case 'seleccion':
                contenido = this._generarSeleccion(pregunta);
                break;
            case 'multiple':
                contenido = this._generarMultiple(pregunta);
                break;
        }

        return `
            <div class="wizard-paso">
                <h3 class="paso-pregunta">${pregunta.pregunta}</h3>
                <p class="paso-descripcion">${pregunta.descripcion}</p>
                <div class="paso-opciones">
                    ${contenido}
                </div>
            </div>
        `;
    }

    _generarSeleccionVisual(pregunta) {
        const perfiles = Object.values(this.perfiles.obtenerTodosLosPerfiles());
        const categorias = this.perfiles.obtenerCategorias();
        
        let html = '<div class="industrias-grid">';
        
        perfiles.forEach(perfil => {
            const seleccionado = this.respuestas[pregunta.id] === perfil.id ? 'seleccionado' : '';
            html += `
                <div class="industria-card ${seleccionado}" onclick="onboarding.seleccionarOpcion('${pregunta.id}', '${perfil.id}')">
                    <div class="industria-icono">${perfil.icono}</div>
                    <div class="industria-nombre">${perfil.nombre}</div>
                    <div class="industria-categoria">${perfil.categoria}</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    _generarSeleccion(pregunta) {
        let html = '<div class="opciones-grid">';
        
        pregunta.opciones.forEach(opcion => {
            const seleccionado = this.respuestas[pregunta.id] === opcion.id ? 'seleccionado' : '';
            html += `
                <div class="opcion-card ${seleccionado}" onclick="onboarding.seleccionarOpcion('${pregunta.id}', '${opcion.id}')">
                    <div class="opcion-icono">${opcion.icono}</div>
                    <div class="opcion-nombre">${opcion.nombre}</div>
                    <div class="opcion-descripcion">${opcion.descripcion}</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    _generarMultiple(pregunta) {
        if (!this.respuestas[pregunta.id]) {
            this.respuestas[pregunta.id] = [];
        }
        
        let html = '<div class="opciones-grid multiple">';
        
        pregunta.opciones.forEach(opcion => {
            const seleccionado = this.respuestas[pregunta.id].includes(opcion.id) ? 'seleccionado' : '';
            html += `
                <div class="opcion-card ${seleccionado}" onclick="onboarding.toggleOpcionMultiple('${pregunta.id}', '${opcion.id}')">
                    <div class="opcion-icono">${opcion.icono}</div>
                    <div class="opcion-nombre">${opcion.nombre}</div>
                    ${seleccionado ? '<div class="check-mark">✓</div>' : ''}
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    _generarFooterWizard() {
        const puedeAvanzar = this.respuestas[this.preguntas[this.pasoActual].id] !== undefined;
        const esUltimoPaso = this.pasoActual === this.preguntas.length - 1;
        
        return `
            <div class="wizard-footer">
                <button class="wizard-btn-anterior" 
                        onclick="onboarding.retroceder()" 
                        ${this.pasoActual === 0 ? 'disabled' : ''}>
                    ← Anterior
                </button>
                <button class="wizard-btn-siguiente" 
                        onclick="onboarding.${esUltimoPaso ? 'finalizar' : 'avanzar'}()"
                        ${!puedeAvanzar ? 'disabled' : ''}>
                    ${esUltimoPaso ? 'Finalizar Configuración ✓' : 'Siguiente →'}
                </button>
            </div>
        `;
    }

    seleccionarOpcion(preguntaId, opcionId) {
        this.respuestas[preguntaId] = opcionId;
        this._actualizarWizard();
    }

    toggleOpcionMultiple(preguntaId, opcionId) {
        if (!this.respuestas[preguntaId]) {
            this.respuestas[preguntaId] = [];
        }
        
        const index = this.respuestas[preguntaId].indexOf(opcionId);
        if (index > -1) {
            this.respuestas[preguntaId].splice(index, 1);
        } else {
            this.respuestas[preguntaId].push(opcionId);
        }
        
        this._actualizarWizard();
    }

    avanzar() {
        if (this.pasoActual < this.preguntas.length - 1) {
            this.pasoActual++;
            this._actualizarWizard();
        }
    }

    retroceder() {
        if (this.pasoActual > 0) {
            this.pasoActual--;
            this._actualizarWizard();
        }
    }

    _actualizarWizard() {
        const wizard = document.getElementById('onboardingWizard');
        if (!wizard) return;
        
        const contenido = wizard.querySelector('.wizard-contenido');
        contenido.innerHTML = `
            ${this._generarHeaderWizard()}
            ${this._generarProgressBar()}
            ${this._generarPasoActual()}
            ${this._generarFooterWizard()}
        `;
    }

    finalizar() {
        this._analizarRespuestas();
        this._configurarEmpresa();
        this._mostrarResumen();
    }

    _analizarRespuestas() {
        const industriaId = this.respuestas.industria;
        this.perfilRecomendado = this.perfiles.obtenerPerfil(industriaId);
        
        console.log('📊 Análisis de respuestas:', this.respuestas);
        console.log('🎯 Perfil recomendado:', this.perfilRecomendado?.nombre);
    }

    _configurarEmpresa() {
        const empresa = this.gestor.estado.empresas[this.empresaId];
        if (!empresa || !this.perfilRecomendado) return;
        
        // Aplicar perfil industrial
        empresa.perfilIndustrial = this.perfilRecomendado.id;
        empresa.categoria = this.perfilRecomendado.categoria;
        
        // Configurar módulos según respuestas
        empresa.modulosActivos = this._determinarModulosActivos();
        
        // Guardar preferencias
        empresa.onboarding = {
            completado: true,
            fecha: new Date().toISOString(),
            respuestas: this.respuestas,
            version: '1.0'
        };
        
        this.gestor._guardarEmpresas();
        console.log('✅ Empresa configurada automáticamente');
    }

    _determinarModulosActivos() {
        const modulos = {};
        const perfil = this.perfilRecomendado;
        const preferencia = this.respuestas.preferencia;
        const objetivos = this.respuestas.objetivos || [];
        
        Object.entries(perfil.modulosRecomendados).forEach(([moduloId, config]) => {
            let activar = false;
            
            // Siempre activar módulos obligatorios
            if (config.obligatorio) {
                activar = true;
            }
            // Activar según preferencia del usuario
            else if (preferencia === 'completo') {
                activar = true;
            }
            else if (preferencia === 'balanceado' && config.prioridad >= 7) {
                activar = true;
            }
            else if (preferencia === 'simple' && config.prioridad >= 9) {
                activar = true;
            }
            
            // Activar según objetivos específicos
            if (objetivos.includes('inventario') && moduloId === 'inventario') activar = true;
            if (objetivos.includes('clientes') && moduloId === 'clientes') activar = true;
            if (objetivos.includes('empleados') && moduloId === 'empleados') activar = true;
            if (objetivos.includes('proyectos') && moduloId === 'proyectos') activar = true;
            
            modulos[moduloId] = activar;
        });
        
        return modulos;
    }

    _mostrarResumen() {
        const wizard = document.getElementById('onboardingWizard');
        if (!wizard) return;
        
        const modulosActivos = this._determinarModulosActivos();
        const cantidadActivos = Object.values(modulosActivos).filter(v => v).length;
        
        wizard.querySelector('.wizard-contenido').innerHTML = `
            <div class="wizard-resumen">
                <div class="resumen-icono">🎉</div>
                <h2>¡Todo listo!</h2>
                <p>Hemos configurado ${cantidadActivos} módulos para tu empresa</p>
                
                <div class="resumen-modulos">
                    ${Object.entries(modulosActivos)
                        .filter(([_, activo]) => activo)
                        .map(([moduloId]) => {
                            const modulo = window.sistemaModulos.catalogoModulos[moduloId];
                            return modulo ? `
                                <div class="modulo-resumen">
                                    <span>${modulo.icono}</span>
                                    <span>${modulo.nombre}</span>
                                </div>
                            ` : '';
                        }).join('')}
                </div>
                
                <div class="resumen-nota">
                    💡 Puedes activar o desactivar módulos en cualquier momento desde la configuración
                </div>
                
                <button class="wizard-btn-finalizar" onclick="onboarding.cerrarYRecargar()">
                    Empezar a usar GRIZALUM →
                </button>
            </div>
        `;
    }

    cerrarYRecargar() {
        const wizard = document.getElementById('onboardingWizard');
        if (wizard) {
            wizard.classList.remove('show');
            setTimeout(() => {
                wizard.remove();
                location.reload(); // Recargar para aplicar configuración
            }, 300);
        }
    }

    cerrar() {
        const wizard = document.getElementById('onboardingWizard');
        if (wizard) {
            wizard.classList.remove('show');
            setTimeout(() => wizard.remove(), 300);
        }
    }
}

// Inicialización global
window.onboarding = new OnboardingInteligente();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎯 ONBOARDING INTELIGENTE v1.0                               ║
║  Asistente de configuración inicial listo                     ║
╚═══════════════════════════════════════════════════════════════╝
`);
