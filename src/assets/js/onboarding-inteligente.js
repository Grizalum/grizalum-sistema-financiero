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
        descripcion: 'Selecciona el sector que mejor describa tu actividad',
        opciones: 'dynamic'
    },
    {
        id: 'tamano',
        tipo: 'seleccion',
        pregunta: '¿Qué tamaño tiene tu empresa actualmente?',
        descripcion: 'Esto nos ayuda a configurar la complejidad adecuada',
        opciones: [
            { id: 'solo', nombre: 'Solo yo', descripcion: 'Emprendimiento individual', icono: '👤' },
            { id: 'micro', nombre: 'Micro (2-5)', descripcion: '2-5 personas trabajando', icono: '👥' },
            { id: 'pequena', nombre: 'Pequeña (6-20)', descripcion: '6-20 empleados', icono: '👨‍👩‍👧' },
            { id: 'mediana', nombre: 'Mediana (21-100)', descripcion: '21-100 empleados', icono: '👨‍👩‍👧‍👦' },
            { id: 'grande', nombre: 'Grande (+100)', descripcion: 'Más de 100 empleados', icono: '🏢' }
        ]
    },
    {
        id: 'volumen-negocio',
        tipo: 'seleccion',
        pregunta: '¿Cuál es tu volumen de operaciones mensual?',
        descripcion: 'Aproximado en cantidad de transacciones o movimientos',
        opciones: [
            { id: 'bajo', nombre: 'Bajo', descripcion: '1-20 movimientos/mes', icono: '📊' },
            { id: 'medio', nombre: 'Medio', descripcion: '21-100 movimientos/mes', icono: '📈' },
            { id: 'alto', nombre: 'Alto', descripcion: '101-500 movimientos/mes', icono: '🚀' },
            { id: 'muy-alto', nombre: 'Muy Alto', descripcion: '+500 movimientos/mes', icono: '⚡' }
        ]
    },
    {
        id: 'objetivos',
        tipo: 'multiple',
        pregunta: '¿Qué necesitas controlar principalmente?',
        descripcion: 'Selecciona todas las que apliquen',
        opciones: [
            { id: 'dinero', nombre: 'Dinero (ingresos y gastos)', icono: '💰' },
            { id: 'inventario', nombre: 'Productos o inventario', icono: '📦' },
            { id: 'clientes', nombre: 'Clientes y ventas', icono: '👥' },
            { id: 'empleados', nombre: 'Empleados y planilla', icono: '👷' },
            { id: 'proyectos', nombre: 'Proyectos u obras', icono: '🎯' },
            { id: 'proveedores', nombre: 'Proveedores', icono: '🤝' }
        ]
    },
    {
        id: 'contexto-especifico',
        tipo: 'dinamico',
        pregunta: 'dynamic', // Se genera según industria
        descripcion: 'dynamic',
        opciones: 'dynamic'
    },
    {
        id: 'complejidad-operaciones',
        tipo: 'seleccion',
        pregunta: '¿Qué tan complejas son tus operaciones?',
        descripcion: 'Esto determina el nivel de detalle que necesitas',
        opciones: [
            { id: 'simple', nombre: 'Simple', descripcion: 'Compras, ventas básicas', icono: '🌱' },
            { id: 'intermedio', nombre: 'Intermedio', descripcion: 'Múltiples productos/servicios', icono: '🌿' },
            { id: 'complejo', nombre: 'Complejo', descripcion: 'Procesos elaborados, múltiples etapas', icono: '🌳' }
        ]
    },
    {
        id: 'facturacion',
        tipo: 'seleccion',
        pregunta: '¿Emites facturas o comprobantes?',
        descripcion: 'Importante para configurar el módulo de facturación',
        opciones: [
            { id: 'no', nombre: 'No emito', descripcion: 'Ventas sin comprobantes', icono: '❌' },
            { id: 'boletas', nombre: 'Solo Boletas', descripcion: 'Boletas de venta', icono: '🧾' },
            { id: 'facturas', nombre: 'Facturas', descripcion: 'Facturas electrónicas', icono: '📄' },
            { id: 'ambos', nombre: 'Boletas y Facturas', descripcion: 'Ambos tipos', icono: '📋' }
        ]
    },
    {
        id: 'ciclo-negocio',
        tipo: 'seleccion',
        pregunta: '¿Cómo es el ciclo de tu negocio?',
        descripcion: 'Esto afecta cómo organizamos tus reportes',
        opciones: [
            { id: 'diario', nombre: 'Diario', descripcion: 'Operaciones todos los días', icono: '☀️' },
            { id: 'semanal', nombre: 'Semanal', descripcion: 'Ciclos semanales', icono: '📅' },
            { id: 'mensual', nombre: 'Mensual', descripcion: 'Operaciones mensuales', icono: '📆' },
            { id: 'estacional', nombre: 'Estacional', descripcion: 'Temporadas específicas', icono: '🗓️' }
        ]
    },
    {
        id: 'experiencia',
        tipo: 'seleccion',
        pregunta: '¿Qué experiencia tienes con sistemas de gestión?',
        descripcion: 'Ajustaremos la interfaz según tu nivel',
        opciones: [
            { id: 'ninguna', nombre: 'Primera vez', descripcion: 'Nunca he usado algo similar', icono: '🌱' },
            { id: 'basica', nombre: 'Básica', descripcion: 'Excel o apps simples', icono: '📊' },
            { id: 'avanzada', nombre: 'Avanzada', descripcion: 'He usado sistemas ERP', icono: '🚀' }
        ]
    },
    {
        id: 'urgencia',
        tipo: 'seleccion',
        pregunta: '¿Qué necesitas hacer primero?',
        descripcion: 'Priorizaremos estas funciones',
        opciones: [
            { id: 'organizar', nombre: 'Organizar mis datos', descripcion: 'Necesito orden', icono: '📋' },
            { id: 'control', nombre: 'Control de gastos', descripcion: 'Reducir pérdidas', icono: '💸' },
            { id: 'crecer', nombre: 'Crecer el negocio', descripcion: 'Vender más', icono: '📈' },
            { id: 'eficiencia', nombre: 'Ser más eficiente', descripcion: 'Ahorrar tiempo', icono: '⚡' }
        ]
    },
    {
        id: 'preferencia',
        tipo: 'seleccion',
        pregunta: '¿Cómo prefieres empezar?',
        descripcion: 'Puedes cambiar módulos en cualquier momento',
        opciones: [
            { id: 'minimo', nombre: 'Mínimo Esencial', descripcion: 'Solo lo absolutamente necesario', icono: '🎯' },
            { id: 'balanceado', nombre: 'Balanceado', descripcion: 'Lo recomendado para tu industria', icono: '⚖️' },
            { id: 'completo', nombre: 'Todo Activado', descripcion: 'Todas las herramientas disponibles', icono: '🚀' }
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
            <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
                <div class="wizard-icono">🎯</div>
                <div>
                    <h2>Configuración Inicial</h2>
                    <p>Te ayudaremos a configurar tu empresa en minutos</p>
                </div>
            </div>
            <button class="wizard-btn-cerrar" onclick="onboarding.cancelar()" title="Cerrar (puedes configurar después)">
                ✕
            </button>
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
                case 'dinamico':  // AGREGAR ESTE CASO
            const preguntaDinamica = this._generarPreguntaDinamica();
            if (preguntaDinamica) {
                pregunta.pregunta = preguntaDinamica.pregunta;
                pregunta.descripcion = preguntaDinamica.descripcion;
                pregunta.opciones = preguntaDinamica.opciones;
                contenido = this._generarSeleccion(pregunta);
            }
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
    
    let html = '<div class="industrias-grid">';
    
    // Mostrar perfiles existentes
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
    
    // Opción "Otra industria"
    const esOtra = this.respuestas[pregunta.id] === 'personalizada';
    html += `
        <div class="industria-card ${esOtra ? 'seleccionado' : ''}" onclick="onboarding.crearIndustriaPersonalizada()">
            <div class="industria-icono">➕</div>
            <div class="industria-nombre">Otra Industria</div>
            <div class="industria-categoria">Personalizada</div>
        </div>
    `;
    
    html += '</div>';
    
    // Input para industria personalizada
    if (esOtra) {
        html += `
            <div class="input-personalizado" style="margin-top: 24px;">
                <input type="text" 
                       id="nombreIndustriaPersonalizada" 
                       placeholder="Ej: Importadora, Joyería, Panadería, etc."
                       class="wizard-input-text"
                       value="${this.respuestas.nombreIndustriaPersonalizada || ''}"
                       oninput="onboarding.guardarNombrePersonalizado(this.value)">
                <small style="color: var(--wizard-texto-terciario); display: block; margin-top: 8px;">
                    Escribe el nombre de tu industria. Configuraremos los módulos esenciales.
                </small>
            </div>
        `;
    }
    
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
        const puedeAvanzar = this._validarPasoActual();
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
    console.log('🎯 Finalizando onboarding...');
    console.log('📋 Respuestas completas:', this.respuestas);
    
    this._analizarRespuestas();
    
    if (!this.perfilRecomendado) {
        console.error('❌ No se pudo determinar el perfil');
        alert('Error al configurar la empresa. Por favor, intenta de nuevo.');
        return;
    }
    
    this._configurarEmpresa();
    
    // Verificar que se guardó
    const empresa = this.gestor.estado.empresas[this.empresaId];
    if (empresa && empresa.onboarding && empresa.onboarding.completado) {
        console.log('✅ Empresa configurada y guardada correctamente');
        this._mostrarResumen();
    } else {
        console.error('❌ Error al guardar la configuración');
        alert('Hubo un problema al guardar. Verifica los datos e intenta de nuevo.');
    }
}

    _analizarRespuestas() {
    const industriaId = this.respuestas.industria;
    
    console.log('🔍 Industria detectada:', industriaId);
    
    // Si es industria personalizada, ya tenemos el perfil creado
    if (industriaId === 'personalizada') {
        console.log('✅ Es personalizada, creando perfil...');
        
        const nombre = this.respuestas.nombreIndustriaPersonalizada || 'Empresa Personalizada';
        
        this.perfilRecomendado = {
            id: 'personalizada',
            nombre: nombre,
            icono: '🏢',
            categoria: 'Personalizada',
            modulosRecomendados: {
                'flujo-caja': { prioridad: 10, obligatorio: true },
                'inventario': { prioridad: 7, obligatorio: false },
                'clientes': { prioridad: 7, obligatorio: false },
                'facturacion': { prioridad: 6, obligatorio: false },
                'reportes': { prioridad: 8, obligatorio: false },
                'empleados': { prioridad: 5, obligatorio: false },
                'proyectos': { prioridad: 5, obligatorio: false },
                'contabilidad': { prioridad: 4, obligatorio: false }
            }
        };
        
        console.log('✅ Perfil personalizado creado:', this.perfilRecomendado);
    } else {
        console.log('📋 Buscando perfil predefinido...');
        this.perfilRecomendado = this.perfiles?.obtenerPerfil(industriaId);
    }
    
    console.log('📊 Análisis de respuestas:', this.respuestas);
    console.log('🎯 Perfil recomendado:', this.perfilRecomendado?.nombre);
    console.log('🏭 Industria ID:', industriaId);
}
    _configurarEmpresa() {
    const empresa = this.gestor.estado.empresas[this.empresaId];
    if (!empresa || !this.perfilRecomendado) return;
    
    // Aplicar perfil industrial
    if (this.respuestas.industria === 'personalizada') {
        empresa.perfilIndustrial = 'personalizada';
        empresa.categoria = 'Personalizada';
        empresa.nombreIndustria = this.respuestas.nombreIndustriaPersonalizada;
    } else {
        empresa.perfilIndustrial = this.perfilRecomendado.id;
        empresa.categoria = this.perfilRecomendado.categoria;
    }
    
    // Configurar módulos según respuestas
    empresa.modulosActivos = this._determinarModulosActivos();
    
    // Guardar preferencias
    empresa.onboarding = {
        completado: true,
        fecha: new Date().toISOString(),
        respuestas: this.respuestas,
        version: '1.0'
    };
    
    // Guardar contexto profundo
    empresa.contextoNegocio = {
        tamano: this.respuestas.tamano,
        volumenNegocio: this.respuestas['volumen-negocio'],
        complejidad: this.respuestas['complejidad-operaciones'],
        ciclo: this.respuestas['ciclo-negocio'],
        contextoEspecifico: this.respuestas['contexto-especifico']
    };
    
    // Guardar patrón para aprendizaje
    this._guardarPatronAprendizaje();
    
    // Guardar primero la empresa
    this.gestor._guardarEmpresas();
    console.log('✅ Empresa configurada automáticamente');
    
    // ⬇️⬇️⬇️ NOTIFICAR AL SISTEMA DE NIVELES (AL FINAL) ⬇️⬇️⬇️
    try {
        // Validar que tenemos todos los datos necesarios
        if (!this.empresaId) {
            console.error('❌ empresaId no definido');
            return;
        }
        if (!this.respuestas) {
            console.error('❌ respuestas no definidas');
            return;
        }
        if (!this.perfilRecomendado) {
            console.error('❌ perfilRecomendado no definido');
            return;
        }
        
        // Esperar 500ms para asegurar que todo se guardó
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('grizalumOnboardingCompletado', {
                detail: {
                    empresaId: this.empresaId,
                    respuestas: this.respuestas,
                    perfilRecomendado: this.perfilRecomendado
                }
            }));
            
            console.log('📡 Datos enviados al Sistema de Niveles');
            console.log('   Empresa:', this.empresaId);
            console.log('   Respuestas:', this.respuestas);
            console.log('   Perfil:', this.perfilRecomendado.nombre);
        }, 500);
        
    } catch (error) {
        console.error('❌ Error al notificar Sistema de Niveles:', error);
    }
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

    _generarPreguntaDinamica() {
    const industriaId = this.respuestas.industria;
    if (!industriaId) return null;
    
    const preguntasEspecificas = {
        'avicola': {
            pregunta: '¿Qué produces principalmente?',
            descripcion: 'Esto personaliza tus métricas',
            opciones: [
                { id: 'pollos', nombre: 'Pollos de engorde', icono: '🐔' },
                { id: 'huevos', nombre: 'Huevos', icono: '🥚' },
                { id: 'ambos', nombre: 'Pollos y huevos', icono: '🐔🥚' },
                { id: 'otros', nombre: 'Otras aves', icono: '🦆' }
            ]
        },
        'fundicion': {
            pregunta: '¿Qué tipo de fundición realizas?',
            descripcion: 'Configura métricas específicas',
            opciones: [
                { id: 'hierro', nombre: 'Hierro/Acero', icono: '⚙️' },
                { id: 'aluminio', nombre: 'Aluminio', icono: '🔩' },
                { id: 'bronce', nombre: 'Bronce/Cobre', icono: '🔧' },
                { id: 'varios', nombre: 'Varios metales', icono: '🏭' }
            ]
        },
        'importadora': {
            pregunta: '¿Qué tipo de productos importas?',
            descripcion: 'Personalizaremos tu control',
            opciones: [
                { id: 'tecnologia', nombre: 'Tecnología/Electrónica', icono: '💻' },
                { id: 'textiles', nombre: 'Textiles/Ropa', icono: '👔' },
                { id: 'alimentos', nombre: 'Alimentos', icono: '🍕' },
                { id: 'maquinaria', nombre: 'Maquinaria', icono: '⚙️' },
                { id: 'varios', nombre: 'Productos variados', icono: '📦' }
            ]
        },
        'comercio-retail': {
            pregunta: '¿Qué tipo de productos vendes?',
            descripcion: 'Optimiza tu inventario',
            opciones: [
                { id: 'abarrotes', nombre: 'Abarrotes/Bodega', icono: '🛒' },
                { id: 'ropa', nombre: 'Ropa/Textiles', icono: '👕' },
                { id: 'tecnologia', nombre: 'Tecnología', icono: '📱' },
                { id: 'farmacia', nombre: 'Farmacia', icono: '💊' },
                { id: 'varios', nombre: 'Varios rubros', icono: '🏪' }
            ]
        },
        'construccion': {
            pregunta: '¿Qué tipo de obras realizas?',
            descripcion: 'Configura seguimiento de proyectos',
            opciones: [
                { id: 'edificios', nombre: 'Edificios', icono: '🏢' },
                { id: 'casas', nombre: 'Casas/Viviendas', icono: '🏠' },
                { id: 'infraestructura', nombre: 'Infraestructura', icono: '🛣️' },
                { id: 'remodelacion', nombre: 'Remodelación', icono: '🔨' }
            ]
        },
        'restaurante': {
            pregunta: '¿Qué tipo de servicio ofreces?',
            descripcion: 'Personaliza tu operación',
            opciones: [
                { id: 'fast-food', nombre: 'Comida rápida', icono: '🍔' },
                { id: 'restaurante', nombre: 'Restaurante', icono: '🍽️' },
                { id: 'delivery', nombre: 'Solo delivery', icono: '🚚' },
                { id: 'cafeteria', nombre: 'Cafetería', icono: '☕' }
            ]
        },
        'transporte': {
            pregunta: '¿Qué tipo de transporte realizas?',
            descripcion: 'Configura control de rutas',
            opciones: [
                { id: 'carga', nombre: 'Carga pesada', icono: '🚛' },
                { id: 'pasajeros', nombre: 'Pasajeros', icono: '🚌' },
                { id: 'courier', nombre: 'Courier/Mensajería', icono: '📦' },
                { id: 'taxi', nombre: 'Taxi/Transporte privado', icono: '🚕' }
            ]
        }
    };
    
    return preguntasEspecificas[industriaId] || {
        pregunta: '¿Qué caracteriza tu operación?',
        descripcion: 'Ayúdanos a conocer mejor tu negocio',
        opciones: [
            { id: 'estandar', nombre: 'Operación estándar', icono: '✅' },
            { id: 'personalizado', nombre: 'Necesito personalización', icono: '⚙️' }
        ]
    };
}

_guardarPatronAprendizaje() {
    try {
        const patrones = JSON.parse(localStorage.getItem('grizalum_patrones_aprendizaje') || '{}');
        const industriaId = this.respuestas.industria;
        
        if (!industriaId) return;
        
        if (!patrones[industriaId]) {
            patrones[industriaId] = {
                configuraciones: [],
                modulosMasUsados: {},
                componentesMasUsados: []
            };
        }
        
        patrones[industriaId].configuraciones.push({
            respuestas: this.respuestas,
            modulos: this._determinarModulosActivos(),
            fecha: new Date().toISOString(),
            version: '1.0'
        });
        
        // Mantener solo últimas 50 configuraciones por industria
        if (patrones[industriaId].configuraciones.length > 50) {
            patrones[industriaId].configuraciones = patrones[industriaId].configuraciones.slice(-50);
        }
        
        localStorage.setItem('grizalum_patrones_aprendizaje', JSON.stringify(patrones));
        console.log(`📊 Patrón guardado para industria: ${industriaId}`);
    } catch (error) {
        console.error('Error guardando patrón:', error);
    }
}
    crearIndustriaPersonalizada() {
    this.respuestas.industria = 'personalizada';
    this._actualizarWizard();
}

guardarNombrePersonalizado(nombre) {
    this.respuestas.nombreIndustriaPersonalizada = nombre.trim();
    
    // Si escribió algo, crear perfil temporal
    if (nombre.trim().length > 2) {
        this.perfilRecomendado = {
            id: 'personalizada',
            nombre: nombre.trim(),
            icono: '🏢',
            categoria: 'Personalizada',
            modulosRecomendados: {
                'flujo-caja': { prioridad: 10, obligatorio: true },
                'inventario': { prioridad: 7, obligatorio: false },
                'clientes': { prioridad: 7, obligatorio: false },
                'facturacion': { prioridad: 6, obligatorio: false },
                'reportes': { prioridad: 8, obligatorio: false },
                'empleados': { prioridad: 5, obligatorio: false },
                'proyectos': { prioridad: 5, obligatorio: false },
                'contabilidad': { prioridad: 4, obligatorio: false }
            }
        };
    }
    
    // Actualizar botón en tiempo real
    this._actualizarBotonSiguiente();
}

_actualizarBotonSiguiente() {
    const boton = document.querySelector('.wizard-btn-siguiente');
    if (!boton) return;
    
    const puedeAvanzar = this._validarPasoActual();
    boton.disabled = !puedeAvanzar;
}
    cancelar() {
    // Crear modal de confirmación personalizado
    const modalConfirm = document.createElement('div');
    modalConfirm.className = 'wizard-confirm-overlay';
    modalConfirm.innerHTML = `
        <div class="wizard-confirm-card">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
                <h3 style="margin: 0 0 8px 0; color: var(--wizard-texto-principal); font-size: 20px;">
                    ¿Qué deseas hacer?
                </h3>
                <p style="margin: 0; color: var(--wizard-texto-secundario); font-size: 14px;">
                    Has avanzado ${this.pasoActual + 1} de ${this.preguntas.length} pasos
                </p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="onboarding.opcionCancelar('continuar')" style="padding: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                    ✅ Guardar y Configurar Después
                    <small style="display: block; opacity: 0.9; font-size: 12px; margin-top: 4px; font-weight: 400;">
                        Tu empresa se guarda con configuración básica
                    </small>
                </button>
                
                <button onclick="onboarding.opcionCancelar('completar')" style="padding: 16px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                    🤖 Que la IA lo Complete por Mí
                    <small style="display: block; opacity: 0.9; font-size: 12px; margin-top: 4px; font-weight: 400;">
                        La IA configura automáticamente según tu industria
                    </small>
                </button>
                
                <button onclick="onboarding.opcionCancelar('eliminar')" style="padding: 16px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 2px solid #ef4444; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                    🗑️ Cancelar y Eliminar Empresa
                    <small style="display: block; opacity: 0.9; font-size: 12px; margin-top: 4px; font-weight: 400;">
                        Se borrará todo lo que has hecho
                    </small>
                </button>
            </div>
            
            <button onclick="document.querySelector('.wizard-confirm-overlay').remove()" style="margin-top: 16px; width: 100%; padding: 12px; background: transparent; color: var(--wizard-texto-terciario); border: none; cursor: pointer; font-weight: 600;">
                Volver al Asistente
            </button>
        </div>
    `;
    
    document.body.appendChild(modalConfirm);
    setTimeout(() => modalConfirm.classList.add('show'), 10);
}

opcionCancelar(opcion) {
    const empresa = this.gestor.estado.empresas[this.empresaId];
    
    switch(opcion) {
        case 'continuar':
            // Guardar empresa con configuración mínima
            this._configurarMinimo();
            alert('✅ Empresa guardada\n\nPuedes completar la configuración después desde el menú de ajustes.');
            this.cerrarYRecargar();
            break;
            
        case 'completar':
            // IA completa automáticamente
            this._completarAutomaticamente();
            alert('🤖 IA ha configurado tu empresa\n\nRevisa los módulos activados y ajusta lo que necesites.');
            this.cerrarYRecargar();
            break;
            
        case 'eliminar':
            if (confirm('⚠️ ¿Seguro que quieres eliminar esta empresa?\n\nEsta acción no se puede deshacer.')) {
                delete this.gestor.estado.empresas[this.empresaId];
                this.gestor._guardarEmpresas();
                alert('🗑️ Empresa eliminada');
                this.cerrar();
                location.reload();
            }
            break;
    }
    
    // Cerrar modal de confirmación
    document.querySelector('.wizard-confirm-overlay')?.remove();
}

_configurarMinimo() {
    const empresa = this.gestor.estado.empresas[this.empresaId];
    if (!empresa) return;
    
    // Solo activar lo esencial
    empresa.modulosActivos = {
        'flujo-caja': true,
        'dashboard': true,
        'reportes': true
    };
    
    empresa.onboarding = {
        completado: false,
        parcial: true,
        fecha: new Date().toISOString(),
        respuestas: this.respuestas
    };
    
    this.gestor._guardarEmpresas();
}

_completarAutomaticamente() {
    // Completar respuestas faltantes con valores inteligentes
    if (!this.respuestas.tamano) this.respuestas.tamano = 'micro';
    if (!this.respuestas['volumen-negocio']) this.respuestas['volumen-negocio'] = 'medio';
    if (!this.respuestas['complejidad-operaciones']) this.respuestas['complejidad-operaciones'] = 'intermedio';
    if (!this.respuestas.facturacion) this.respuestas.facturacion = 'boletas';
    if (!this.respuestas['ciclo-negocio']) this.respuestas['ciclo-negocio'] = 'diario';
    if (!this.respuestas.experiencia) this.respuestas.experiencia = 'basica';
    if (!this.respuestas.urgencia) this.respuestas.urgencia = 'organizar';
    if (!this.respuestas.preferencia) this.respuestas.preferencia = 'balanceado';
    
    if (!this.respuestas.objetivos || this.respuestas.objetivos.length === 0) {
        this.respuestas.objetivos = ['dinero', 'inventario', 'clientes'];
    }
    
    // Configurar empresa completa
    this._analizarRespuestas();
    this._configurarEmpresa();
}
    _validarPasoActual() {
        const pregunta = this.preguntas[this.pasoActual];
        const respuesta = this.respuestas[pregunta.id];
        
        // Validación especial para industria personalizada
        if (pregunta.id === 'industria' && respuesta === 'personalizada') {
            const nombre = this.respuestas.nombreIndustriaPersonalizada;
            return nombre && nombre.trim().length >= 3;
        }
        
        // Validación para preguntas múltiples
        if (pregunta.tipo === 'multiple') {
            return Array.isArray(respuesta) && respuesta.length > 0;
        }
        
        // Validación estándar
        return respuesta !== undefined && respuesta !== null && respuesta !== '';
    }
     cerrar() {
        // Cerrar modal de confirmación si existe
        const modalConfirm = document.querySelector('.wizard-confirm-overlay');
        if (modalConfirm) {
            modalConfirm.remove();
        }
        
        // Cerrar wizard
        const wizard = document.getElementById('onboardingWizard');
        if (wizard) {
            wizard.classList.remove('show');
            setTimeout(() => {
                wizard.remove();
            }, 300);
        }
    }
}

// Inicialización global
window.onboarding = new OnboardingInteligente();
// Inyectar estilos del botón cerrar
const estilosOnboarding = document.createElement('style');
estilosOnboarding.textContent = `
    .wizard-btn-cerrar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: var(--wizard-texto-principal);
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .wizard-btn-cerrar:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        transform: rotate(90deg);
    }
    
    .wizard-confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 200000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 20px;
    }
    
    .wizard-confirm-overlay.show {
        opacity: 1;
    }
    
    .wizard-confirm-card {
        background: var(--wizard-fondo-principal);
        border-radius: 16px;
        padding: 32px;
        max-width: 480px;
        width: 100%;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .wizard-confirm-card button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(estilosOnboarding);

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎯 ONBOARDING INTELIGENTE v1.0                               ║
║  Asistente de configuración inicial listo                     ║
╚═══════════════════════════════════════════════════════════════╝
`);
