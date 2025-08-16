/**
 * ================================================================
 * GRIZALUM GESTOR DE EMPRESAS - FORMULARIOS Y WIZARD
 * Creación y edición de empresas paso a paso
 * Versión: 2.0 - Adaptado para el mercado peruano
 * ================================================================
 */

class FormularioEmpresas {
    constructor(gestorPrincipal) {
        this.gestor = gestorPrincipal;
        this.pasoActual = 1;
        this.totalPasos = 3;
        this.datosFormulario = {};
        this.emojiSeleccionado = '🏢';
        
        // Datos específicos para Perú
        this.regionesPeruana = {
            'lima': {
                nombre: 'Lima',
                provincias: ['Lima', 'Barranca', 'Cajatambo', 'Canta', 'Cañete', 'Huaral', 'Huarochirí', 'Huaura', 'Oyón', 'Yauyos']
            },
            'arequipa': {
                nombre: 'Arequipa',
                provincias: ['Arequipa', 'Camaná', 'Caravelí', 'Castilla', 'Caylloma', 'Condesuyos', 'Islay', 'La Unión']
            },
            'cusco': {
                nombre: 'Cusco',
                provincias: ['Cusco', 'Acomayo', 'Anta', 'Calca', 'Canas', 'Canchis', 'Chumbivilcas', 'Espinar', 'La Convención', 'Paruro', 'Paucartambo', 'Quispicanchi', 'Urubamba']
            },
            'piura': {
                nombre: 'Piura',
                provincias: ['Piura', 'Ayabaca', 'Huancabamba', 'Morropón', 'Paita', 'Sullana', 'Talara', 'Sechura']
            },
            'la-libertad': {
                nombre: 'La Libertad',
                provincias: ['Trujillo', 'Ascope', 'Bolívar', 'Chepén', 'Julcán', 'Otuzco', 'Pacasmayo', 'Pataz', 'Sánchez Carrión', 'Santiago de Chuco', 'Gran Chimú', 'Virú']
            }
        };
        
        this.tiposEmpresa = [
            { valor: 'manufactura', nombre: '🏭 Manufactura/Industria', descripcion: 'Producción y fabricación' },
            { valor: 'comercio', nombre: '🏪 Comercio/Retail', descripcion: 'Venta de productos' },
            { valor: 'servicios', nombre: '⚙️ Servicios', descripcion: 'Prestación de servicios' },
            { valor: 'construccion', nombre: '🏗️ Construcción', descripcion: 'Obras y construcción' },
            { valor: 'mineria', nombre: '⛏️ Minería', descripcion: 'Extracción minera' },
            { valor: 'agricultura', nombre: '🌾 Agricultura', descripcion: 'Cultivos y cosechas' },
            { valor: 'ganaderia', nombre: '🐄 Ganadería', descripcion: 'Crianza de animales' },
            { valor: 'pesca', nombre: '🐟 Pesca', descripcion: 'Pesca y acuicultura' },
            { valor: 'tecnologia', nombre: '💻 Tecnología', descripcion: 'Software y TI' },
            { valor: 'turismo', nombre: '✈️ Turismo', descripcion: 'Servicios turísticos' },
            { valor: 'transporte', nombre: '🚚 Transporte', descripcion: 'Logística y transporte' },
            { valor: 'restaurantes', nombre: '🍽️ Restaurantes', descripcion: 'Comida y bebidas' }
        ];
        
        this.configurarEstilosFormulario();
    }

    // ================================================================
    // CONFIGURAR ESTILOS DEL FORMULARIO
    // ================================================================
    
    configurarEstilosFormulario() {
        const estilos = document.createElement('style');
        estilos.id = 'grizalum-formulario-estilos';
        estilos.textContent = `
            /* Formulario de Empresas - Estilos */
            .modal-formulario {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .modal-formulario.mostrar {
                opacity: 1;
                visibility: visible;
            }
            
            .contenido-modal {
                background: white;
                border-radius: 20px;
                width: 95%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                animation: modalEntrada 0.3s ease;
            }
            
            @keyframes modalEntrada {
                from { opacity: 0; transform: scale(0.9) translateY(-20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            
            .cabecera-modal {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .titulo-modal {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.5rem;
                font-weight: 800;
                margin: 0;
            }
            
            .boton-cerrar-modal {
                background: none;
                border: none;
                color: white;
                font-size: 1.8rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .boton-cerrar-modal:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg) scale(1.1);
            }
            
            /* Wizard de pasos */
            .wizard-pasos {
                display: flex;
                justify-content: center;
                padding: 1.5rem;
                background: #f8f9fa;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .paso-wizard {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                font-weight: 600;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .paso-wizard::after {
                content: '';
                position: absolute;
                right: -20px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-left: 10px solid #e5e7eb;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
            }
            
            .paso-wizard:last-child::after {
                display: none;
            }
            
            .paso-wizard.activo {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                transform: scale(1.05);
            }
            
            .paso-wizard.activo::after {
                border-left-color: #dc2626;
            }
            
            .paso-wizard.completado {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }
            
            .paso-wizard.completado::after {
                border-left-color: #10b981;
            }
            
            /* Contenido del formulario */
            .cuerpo-modal {
                padding: 2rem;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .contenido-paso {
                display: none;
            }
            
            .contenido-paso.activo {
                display: block;
                animation: pasoEntrada 0.4s ease;
            }
            
            @keyframes pasoEntrada {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            .titulo-paso {
                font-size: 1.3rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .descripcion-paso {
                color: #6b7280;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .grupo-campo {
                margin-bottom: 1.5rem;
            }
            
            .etiqueta-campo {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }
            
            .campo-requerido {
                color: #dc2626;
            }
            
            .input-texto, .input-select, .input-textarea {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                font-size: 1rem;
                transition: all 0.3s ease;
                outline: none;
                box-sizing: border-box;
            }
            
            .input-texto:focus, .input-select:focus, .input-textarea:focus {
                border-color: #dc2626;
                box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
                transform: translateY(-1px);
            }
            
            .ayuda-campo {
                font-size: 0.8rem;
                color: #6b7280;
                margin-top: 0.5rem;
                display: block;
            }
            
            .input-grupo {
                display: flex;
                align-items: center;
                position: relative;
            }
            
            .prefijo-input {
                position: absolute;
                left: 1rem;
                font-weight: 600;
                color: #6b7280;
                z-index: 2;
            }
            
            .input-con-prefijo {
                padding-left: 3rem;
            }
            
            /* Selector de emoji */
            .selector-emoji {
                display: flex;
                align-items: center;
                gap: 1rem;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .selector-emoji:hover {
                border-color: #dc2626;
                box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
            }
            
            .emoji-mostrar {
                font-size: 2rem;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f3f4f6;
                border-radius: 10px;
                transition: all 0.3s ease;
            }
            
            .texto-emoji {
                flex: 1;
                font-weight: 600;
                color: #374151;
            }
            
            /* Selector de tipo de empresa */
            .tipos-empresa {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1rem;
            }
            
            .opcion-tipo {
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
            }
            
            .opcion-tipo:hover, .opcion-tipo.seleccionado {
                border-color: #dc2626;
                background: rgba(220, 38, 38, 0.05);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
            }
            
            .nombre-tipo {
                font-weight: 600;
                margin-bottom: 0.25rem;
                color: #1f2937;
            }
            
            .descripcion-tipo {
                font-size: 0.85rem;
                color: #6b7280;
            }
            
            /* Estados */
            .selector-estados {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .opcion-estado {
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .opcion-estado:hover, .opcion-estado.seleccionado {
                border-color: #dc2626;
                background: rgba(220, 38, 38, 0.05);
                transform: translateY(-2px);
            }
            
            .punto-estado {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }
            
            .punto-estado.verde { background: #10b981; }
            .punto-estado.azul { background: #3b82f6; }
            .punto-estado.amarillo { background: #f59e0b; }
            
            .info-estado strong {
                display: block;
                margin-bottom: 0.25rem;
                color: #1f2937;
            }
            
            .info-estado small {
                color: #6b7280;
                font-size: 0.8rem;
            }
            
            /* Pie del modal */
            .pie-modal {
                padding: 1.5rem 2rem;
                background: #f8f9fa;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #e5e7eb;
            }
            
            .boton-anterior, .boton-siguiente, .boton-crear {
                padding: 0.875rem 1.75rem;
                border-radius: 10px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                border: none;
            }
            
            .boton-anterior {
                background: white;
                color: #6b7280;
                border: 2px solid #e5e7eb;
            }
            
            .boton-anterior:hover {
                border-color: #d1d5db;
                color: #374151;
                transform: translateY(-2px);
            }
            
            .boton-siguiente, .boton-crear {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
            }
            
            .boton-siguiente:hover, .boton-crear:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
            }
            
            .boton-anterior:disabled, .boton-siguiente:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .contenido-modal {
                    width: 98%;
                    margin: 1rem;
                }
                
                .cabecera-modal {
                    padding: 1.5rem;
                }
                
                .titulo-modal {
                    font-size: 1.2rem;
                }
                
                .cuerpo-modal {
                    padding: 1.5rem;
                }
                
                .tipos-empresa {
                    grid-template-columns: 1fr;
                }
                
                .selector-estados {
                    grid-template-columns: 1fr;
                }
                
                .wizard-pasos {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .paso-wizard::after {
                    display: none;
                }
            }
        `;
        
        document.head.appendChild(estilos);
    }

    // ================================================================
    // MOSTRAR FORMULARIO PRINCIPAL
    // ================================================================
    
    mostrarFormulario() {
        console.log('📝 Abriendo formulario para nueva empresa');
        
        // Reiniciar datos
        this.pasoActual = 1;
        this.datosFormulario = {};
        this.emojiSeleccionado = '🏢';
        
        const modal = this.crearModal();
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('mostrar');
        }, 100);
        
        this.actualizarPaso();
    }

    crearModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-formulario';
        modal.id = 'modalNuevaEmpresa';
        
        modal.innerHTML = `
            <div class="contenido-modal">
                <div class="cabecera-modal">
                    <h2 class="titulo-modal">
                        <span>🏢</span>
                        <span>Nueva Empresa Peruana</span>
                    </h2>
                    <button class="boton-cerrar-modal" onclick="formularioEmpresas.cerrarFormulario()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="wizard-pasos">
                    <div class="paso-wizard activo" data-paso="1">
                        <i class="fas fa-building"></i>
                        <span>Datos Básicos</span>
                    </div>
                    <div class="paso-wizard" data-paso="2">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Ubicación</span>
                    </div>
                    <div class="paso-wizard" data-paso="3">
                        <i class="fas fa-calculator"></i>
                        <span>Finanzas</span>
                    </div>
                </div>
                
                <div class="cuerpo-modal">
                    ${this.generarPaso1()}
                    ${this.generarPaso2()}
                    ${this.generarPaso3()}
                </div>
                
                <div class="pie-modal">
                    <button class="boton-anterior" onclick="formularioEmpresas.pasoAnterior()" style="visibility: hidden;">
                        <i class="fas fa-arrow-left"></i> Anterior
                    </button>
                    <button class="boton-siguiente" onclick="formularioEmpresas.pasoSiguiente()">
                        Siguiente <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        return modal;
    }

    // ================================================================
    // GENERAR CONTENIDO DE CADA PASO
    // ================================================================
    
    generarPaso1() {
        return `
            <div class="contenido-paso activo" id="paso-1">
                <h3 class="titulo-paso">📋 Información Básica</h3>
                <p class="descripcion-paso">Ingresa los datos principales de tu empresa</p>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">
                        Nombre de la Empresa <span class="campo-requerido">*</span>
                    </label>
                    <input type="text" id="nombreEmpresa" class="input-texto" 
                           placeholder="Ej: Mi Empresa S.A.C." required maxlength="100">
                    <small class="ayuda-campo">Nombre comercial o razón social completa</small>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">RUC (Opcional)</label>
                    <input type="text" id="rucEmpresa" class="input-texto" 
                           placeholder="20123456789" maxlength="11">
                    <small class="ayuda-campo">Registro Único de Contribuyentes - 11 dígitos</small>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">
                        Tipo de Empresa <span class="campo-requerido">*</span>
                    </label>
                    <div class="tipos-empresa" id="tiposEmpresa">
                        ${this.tiposEmpresa.map(tipo => `
                            <div class="opcion-tipo" data-tipo="${tipo.valor}" onclick="formularioEmpresas.seleccionarTipo('${tipo.valor}')">
                                <div class="nombre-tipo">${tipo.nombre}</div>
                                <div class="descripcion-tipo">${tipo.descripcion}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Icono Representativo</label>
                    <div class="selector-emoji" onclick="formularioEmpresas.mostrarSelectorEmoji()">
                        <div class="emoji-mostrar" id="emojiMostrar">🏢</div>
                        <span class="texto-emoji">Seleccionar icono para la empresa</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
        `;
    }

    generarPaso2() {
        return `
            <div class="contenido-paso" id="paso-2">
                <h3 class="titulo-paso">📍 Ubicación y Contacto</h3>
                <p class="descripcion-paso">¿Dónde está ubicada tu empresa?</p>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">
                        Región/Departamento <span class="campo-requerido">*</span>
                    </label>
                    <select id="regionEmpresa" class="input-select" onchange="formularioEmpresas.cargarProvincias()" required>
                        <option value="">Selecciona la región</option>
                        ${Object.entries(this.regionesPeruana).map(([valor, region]) => 
                            `<option value="${valor}">${region.nombre}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Provincia</label>
                    <select id="provinciaEmpresa" class="input-select">
                        <option value="">Primero selecciona la región</option>
                    </select>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Distrito</label>
                    <input type="text" id="distritoEmpresa" class="input-texto" 
                           placeholder="Ej: Miraflores, San Isidro">
                    <small class="ayuda-campo">Distrito donde opera la empresa</small>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Dirección Completa</label>
                    <textarea id="direccionEmpresa" class="input-textarea" rows="3" 
                              placeholder="Av. Principal 123, Urbanización..."></textarea>
                    <small class="ayuda-campo">Dirección física de la empresa</small>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Teléfono</label>
                    <input type="tel" id="telefonoEmpresa" class="input-texto" 
                           placeholder="+51 1 234-5678">
                    <small class="ayuda-campo">Número de contacto principal</small>
                </div>
            </div>
        `;
    }

    generarPaso3() {
        return `
            <div class="contenido-paso" id="paso-3">
                <h3 class="titulo-paso">💰 Información Financiera</h3>
                <p class="descripcion-paso">Datos financieros iniciales para empezar</p>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Dinero en Caja Actual</label>
                    <div class="input-grupo">
                        <span class="prefijo-input">S/.</span>
                        <input type="number" id="dineroEnCaja" class="input-texto input-con-prefijo" 
                               placeholder="50000" min="0" step="100">
                    </div>
                    <small class="ayuda-campo">Efectivo disponible en caja y bancos</small>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Ingresos Anuales Estimados</label>
                    <div class="input-grupo">
                        <span class="prefijo-input">S/.</span>
                        <input type="number" id="ingresosAnuales" class="input-texto input-con-prefijo" 
                               placeholder="1000000" min="0" step="1000">
                    </div>
                    <small class="ayuda-campo">Facturación anual aproximada</small>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Gastos Mensuales Promedio</label>
                    <div class="input-grupo">
                        <span class="prefijo-input">S/.</span>
                        <input type="number" id="gastosMensuales" class="input-texto input-con-prefijo" 
                               placeholder="50000" min="0" step="1000">
                    </div>
                    <small class="ayuda-campo">Costos operativos, personal, alquileres, etc.</small>
                </div>
                
                <div class="grupo-campo">
                    <label class="etiqueta-campo">Estado Operativo Inicial</label>
                    <div class="selector-estados">
                        <div class="opcion-estado seleccionado" data-estado="operativo" onclick="formularioEmpresas.seleccionarEstado('operativo')">
                            <span class="punto-estado verde"></span>
                            <div class="info-estado">
                                <strong>Operativo</strong>
                                <small>Funcionando normalmente</small>
                            </div>
                        </div>
                        <div class="opcion-estado" data-estado="preparacion" onclick="formularioEmpresas.seleccionarEstado('preparacion')">
                            <span class="punto-estado azul"></span>
                            <div class="info-estado">
                                <strong>En Preparación</strong>
                                <small>Próximo a iniciar</small>
                            </div>
                        </div>
                        <div class="opcion-estado" data-estado="expansion" onclick="formularioEmpresas.seleccionarEstado('expansion')">
                            <span class="punto-estado amarillo"></span>
                            <div class="info-estado">
                                <strong>En Expansión</strong>
                                <small>Crecimiento acelerado</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ================================================================
    // NAVEGACIÓN ENTRE PASOS
    // ================================================================
    
    pasoSiguiente() {
        if (this.validarPasoActual()) {
            this.guardarDatosPaso();
            
            if (this.pasoActual < this.totalPasos) {
                this.pasoActual++;
                this.actualizarPaso();
            } else {
                this.crearEmpresa();
            }
        }
    }

    pasoAnterior() {
        if (this.pasoActual > 1) {
            this.pasoActual--;
            this.actualizarPaso();
        }
    }

    actualizarPaso() {
        // Actualizar indicadores de pasos
        document.querySelectorAll('.paso-wizard').forEach((paso, index) => {
            paso.classList.remove('activo', 'completado');
            
            if (index + 1 < this.pasoActual) {
                paso.classList.add('completado');
            } else if (index + 1 === this.pasoActual) {
                paso.classList.add('activo');
            }
        });

        // Mostrar contenido del paso actual
        document.querySelectorAll('.contenido-paso').forEach((contenido, index) => {
            contenido.classList.remove('activo');
            
            if (index + 1 === this.pasoActual) {
                contenido.classList.add('activo');
            }
        });

        // Actualizar botones
        const botonAnterior = document.querySelector('.boton-anterior');
        const botonSiguiente = document.querySelector('.boton-siguiente');

        botonAnterior.style.visibility = this.pasoActual === 1 ? 'hidden' : 'visible';
        
        if (this.pasoActual === this.totalPasos) {
            botonSiguiente.innerHTML = '<i class="fas fa-check"></i> Crear Empresa';
            botonSiguiente.className = 'boton-crear';
        } else {
            botonSiguiente.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
            botonSiguiente.className = 'boton-siguiente';
        }
    }

    // ================================================================
    // VALIDACIONES
    // ================================================================
    
    validarPasoActual() {
        switch (this.pasoActual) {
            case 1:
                return this.validarPaso1();
            case 2:
                return this.validarPaso2();
            case 3:
                return this.validarPaso3();
            default:
                return false;
        }
    }

    validarPaso1() {
        const nombre = document.getElementById('nombreEmpresa').value.trim();
        const tipoSeleccionado = document.querySelector('.opcion-tipo.seleccionado');

        if (!nombre) {
            this.mostrarError('El nombre de la empresa es requerido');
            return false;
        }

        if (nombre.length < 3) {
            this.mostrarError('El nombre debe tener al menos 3 caracteres');
            return false;
        }

        if (!tipoSeleccionado) {
            this.mostrarError('Selecciona el tipo de empresa');
            return false;
        }

        // Validar RUC si se ingresó
        const ruc = document.getElementById('rucEmpresa').value.trim();
        if (ruc && !this.validarRUC(ruc)) {
            this.mostrarError('El RUC debe tener 11 dígitos');
            return false;
        }

        return true;
    }

    validarPaso2() {
        const region = document.getElementById('regionEmpresa').value;

        if (!region) {
            this.mostrarError('Selecciona la región donde está ubicada la empresa');
            return false;
        }

        return true;
    }

    validarPaso3() {
        // Los campos financieros son opcionales, pero si se llenan deben ser válidos
        const caja = parseFloat(document.getElementById('dineroEnCaja').value) || 0;
        const ingresos = parseFloat(document.getElementById('ingresosAnuales').value) || 0;
        const gastos = parseFloat(document.getElementById('gastosMensuales').value) || 0;

        if (caja < 0 || ingresos < 0 || gastos < 0) {
            this.mostrarError('Los valores financieros no pueden ser negativos');
            return false;
        }

        return true;
    }

    validarRUC(ruc) {
        return /^\d{11}$/.test(ruc);
    }

    mostrarError(mensaje) {
        // Simple alert por ahora - se puede mejorar con notificaciones
        alert('❌ ' + mensaje);
    }

    // ================================================================
    // FUNCIONES DE SELECCIÓN
    // ================================================================
    
    seleccionarTipo(tipo) {
        document.querySelectorAll('.opcion-tipo').forEach(opcion => {
            opcion.classList.remove('seleccionado');
        });
        
        document.querySelector(`[data-tipo="${tipo}"]`).classList.add('seleccionado');
    }

    seleccionarEstado(estado) {
        document.querySelectorAll('.opcion-estado').forEach(opcion => {
            opcion.classList.remove('seleccionado');
        });
        
        document.querySelector(`[data-estado="${estado}"]`).classList.add('seleccionado');
    }

    cargarProvincias() {
        const regionSelect = document.getElementById('regionEmpresa');
        const provinciaSelect = document.getElementById('provinciaEmpresa');
        const regionSeleccionada = regionSelect.value;

        provinciaSelect.innerHTML = '<option value="">Selecciona la provincia</option>';

        if (regionSeleccionada && this.regionesPeruana[regionSeleccionada]) {
            const provincias = this.regionesPeruana[regionSeleccionada].provincias;
            
            provincias.forEach(provincia => {
                const option = document.createElement('option');
                option.value = provincia.toLowerCase().replace(/\s+/g, '-');
                option.textContent = provincia;
                provinciaSelect.appendChild(option);
            });
        }
    }

    mostrarSelectorEmoji() {
        // Por ahora, una lista simple de emojis comunes
        const emojisComunes = ['🏢', '🏭', '🏪', '🏬', '🏦', '🏥', '🚚', '🍽️', '💻', '🔥', '⚙️', '🌾', '🐄', '🐟', '⛏️', '🏗️'];
        
        const emojiActual = prompt('Selecciona un emoji:\n\n' + emojisComunes.join(' '), this.emojiSeleccionado);
        
        if (emojiActual && emojisComunes.includes(emojiActual)) {
            this.emojiSeleccionado = emojiActual;
            document.getElementById('emojiMostrar').textContent = emojiActual;
        }
    }

    // ================================================================
    // GUARDAR DATOS Y CREAR EMPRESA
    // ================================================================
    
    guardarDatosPaso() {
        switch (this.pasoActual) {
            case 1:
                this.datosFormulario.nombre = document.getElementById('nombreEmpresa').value.trim();
                this.datosFormulario.ruc = document.getElementById('rucEmpresa').value.trim();
                this.datosFormulario.tipo = document.querySelector('.opcion-tipo.seleccionado')?.dataset.tipo;
                this.datosFormulario.icono = this.emojiSeleccionado;
                break;
                
            case 2:
                this.datosFormulario.region = document.getElementById('regionEmpresa').value;
                this.datosFormulario.provincia = document.getElementById('provinciaEmpresa').value;
                this.datosFormulario.distrito = document.getElementById('distritoEmpresa').value.trim();
                this.datosFormulario.direccion = document.getElementById('direccionEmpresa').value.trim();
                this.datosFormulario.telefono = document.getElementById('telefonoEmpresa').value.trim();
                break;
                
            case 3:
                this.datosFormulario.dineroEnCaja = parseFloat(document.getElementById('dineroEnCaja').value) || 0;
                this.datosFormulario.ingresosAnuales = parseFloat(document.getElementById('ingresosAnuales').value) || 0;
                this.datosFormulario.gastosMensuales = parseFloat(document.getElementById('gastosMensuales').value) || 0;
                this.datosFormulario.estado = document.querySelector('.opcion-estado.seleccionado')?.dataset.estado || 'operativo';
                break;
        }
    }

    crearEmpresa() {
        this.guardarDatosPaso();
        
        // Construir ubicación
        const ubicacionParts = [
            this.datosFormulario.distrito,
            document.getElementById('provinciaEmpresa').selectedOptions[0]?.text,
            this.regionesPeruana[this.datosFormulario.region]?.nombre
        ].filter(Boolean);
        
        const ubicacion = ubicacionParts.join(', ') || 'Perú';
        
        // Calcular ganancia estimada
        const gananciaMensual = (this.datosFormulario.ingresosAnuales / 12) - this.datosFormulario.gastosMensuales;
        const gananciAnual = gananciaMensual * 12;
        
        // Convertir estado
        const estadosMap = {
            'operativo': 'Operativo',
            'preparacion': 'En Preparación',
            'expansion': 'En Expansión'
        };

        // Crear objeto empresa
        const nuevaEmpresa = {
            nombre: this.datosFormulario.nombre,
            icono: this.datosFormulario.icono,
            estado: estadosMap[this.datosFormulario.estado],
            ruc: this.datosFormulario.ruc || '',
            ubicacion: ubicacion,
            telefono: this.datosFormulario.telefono || '',
            direccion: this.datosFormulario.direccion || '',
            tipo: this.datosFormulario.tipo,
            dinero: {
                caja: this.datosFormulario.dineroEnCaja,
                ingresos: this.datosFormulario.ingresosAnuales,
                gastos: this.datosFormulario.gastosMensuales * 12,
                ganancia: Math.max(0, gananciAnual)
            },
            fechaCreacion: new Date().toISOString()
        };

        // Generar ID único
        const empresaId = this.generarIdEmpresa(nuevaEmpresa.nombre);
        
        // Verificar que no exista
        if (this.gestor.empresas[empresaId]) {
            this.mostrarError('Ya existe una empresa con ese nombre');
            return;
        }

        // Agregar al gestor
        this.gestor.empresas[empresaId] = nuevaEmpresa;
        this.gestor.guardarEmpresas();
        
        // Actualizar UI
        this.gestor.actualizarListaEmpresas();
        this.gestor.seleccionarEmpresa(empresaId);
        
        // Cerrar formulario
        this.cerrarFormulario();
        
        // Notificación de éxito
        console.log(`✅ Empresa "${nuevaEmpresa.nombre}" creada exitosamente`);
        alert(`🎉 ¡Empresa "${nuevaEmpresa.nombre}" creada exitosamente!`);
    }

    generarIdEmpresa(nombre) {
        let baseId = nombre.toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        // Verificar unicidad
        let contador = 1;
        let idFinal = baseId;
        
        while (this.gestor.empresas[idFinal]) {
            idFinal = `${baseId}-${contador}`;
            contador++;
        }
        
        return idFinal;
    }

    // ================================================================
    // CERRAR FORMULARIO
    // ================================================================
    
    cerrarFormulario() {
        const modal = document.getElementById('modalNuevaEmpresa');
        if (modal) {
            modal.classList.remove('mostrar');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
}

// ================================================================
// INICIALIZACIÓN
// ================================================================

let formularioEmpresas = null;

// Inicializar cuando el gestor principal esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.gestorEmpresas) {
            formularioEmpresas = new FormularioEmpresas(window.gestorEmpresas);
            window.formularioEmpresas = formularioEmpresas;
            
            // Conectar con el gestor principal
            window.gestorEmpresas.mostrarFormularioNuevaEmpresa = function() {
                formularioEmpresas.mostrarFormulario();
            };
            
            console.log('📝 Formulario de empresas listo');
        }
    }, 400);
});

console.log(`
📝 ===================================================
   GRIZALUM FORMULARIO DE EMPRESAS v2.0
   Creación de empresas paso a paso
📝 ===================================================

✨ CARACTERÍSTICAS:
   • 🎯 Wizard paso a paso intuitivo
   • 🇵🇪 Regiones y provincias del Perú
   • 📋 Validación de RUC peruano
   • 💰 Cálculos financieros automáticos
   • 📱 Interfaz responsive completa

📝 ===================================================
`);
