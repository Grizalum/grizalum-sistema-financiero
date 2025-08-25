/**
 * ================================================================
 * GRIZALUM GESTOR DE EMPRESAS - TEMAS VISUALES
 * Sistema de temas y personalización visual
 * Versión: 2.0 - Adaptado para empresas peruanas
 * ================================================================
 */

class GestorTemas {
    constructor(gestorPrincipal) {
        this.gestor = gestorPrincipal;
        this.temaActual = null;
        this.temasDisponibles = {};
        
        // Temas predefinidos inspirados en el mercado peruano
        this.temasPredefinidos = {
            'dorado-peruano': {
                nombre: '🏆 Dorado Peruano',
                descripcion: 'Elegancia dorada inspirada en el oro peruano',
                primario: '#d4af37',
                secundario: '#b8860b',
                categoria: 'elegante'
            },
            'rojo-comercial': {
                nombre: '🏪 Rojo Comercial',
                descripcion: 'Vibrante y llamativo para comercios',
                primario: '#dc2626',
                secundario: '#b91c1c',
                categoria: 'comercial'
            },
            'verde-agricultura': {
                nombre: '🌾 Verde Agricultura',
                descripcion: 'Natural y fresco para empresas agrícolas',
                primario: '#16a34a',
                secundario: '#15803d',
                categoria: 'agricultura'
            },
            'azul-industria': {
                nombre: '🏭 Azul Industria',
                descripcion: 'Confiable y robusto para industrias',
                primario: '#2563eb',
                secundario: '#1d4ed8',
                categoria: 'industria'
            },
            'morado-innovacion': {
                nombre: '💻 Morado Innovación',
                descripcion: 'Moderno y tecnológico',
                primario: '#7c3aed',
                secundario: '#6d28d9',
                categoria: 'tecnologia'
            },
            'naranja-energia': {
                nombre: '🔥 Naranja Energía',
                descripcion: 'Dinámico para empresas energéticas',
                primario: '#ea580c',
                secundario: '#dc2626',
                categoria: 'energia'
            },
            'turquesa-marino': {
                nombre: '🐟 Turquesa Marino',
                descripcion: 'Inspirado en el mar peruano',
                primario: '#0891b2',
                secundario: '#0e7490',
                categoria: 'marino'
            },
            'marron-tierra': {
                nombre: '⛏️ Marrón Tierra',
                descripcion: 'Sólido para empresas mineras',
                primario: '#a16207',
                secundario: '#92400e',
                categoria: 'mineria'
            }
        };
        
        this.configurarEstilosTemas();
        this.cargarTemasPrevios();
    }

    // ================================================================
    // CONFIGURACIÓN DE ESTILOS
    // ================================================================
    
    configurarEstilosTemas() {
        const estilos = document.createElement('style');
        estilos.id = 'grizalum-temas-estilos';
        estilos.textContent = `
            /* Sistema de Temas - Estilos */
            .panel-temas {
                position: fixed;
                top: 0; right: -400px;
                width: 380px;
                height: 100vh;
                background: white;
                box-shadow: -5px 0 20px rgba(0, 0, 0, 0.2);
                z-index: 15000;
                transition: right 0.3s ease;
                overflow-y: auto;
            }
            
            .panel-temas.abierto {
                right: 0;
            }
            
            .cabecera-panel-temas {
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                color: white;
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            
            .titulo-panel-temas {
                font-size: 1.3rem;
                font-weight: 700;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .boton-cerrar-panel {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .boton-cerrar-panel:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }
            
            .contenido-panel-temas {
                padding: 1.5rem;
            }
            
            .seccion-tema {
                margin-bottom: 2rem;
            }
            
            .titulo-seccion-tema {
                font-size: 1rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e5e7eb;
            }
            
            .temas-predefinidos {
                display: grid;
                gap: 1rem;
            }
            
            .tarjeta-tema {
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
            }
            
            .tarjeta-tema:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border-color: #d1d5db;
            }
            
            .tarjeta-tema.activo {
                border-color: #d4af37;
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
                transform: translateY(-2px);
            }
            
            .preview-tema {
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: 1.1rem;
                position: relative;
                overflow: hidden;
            }
            
            .preview-tema::before {
                content: '';
                position: absolute;
                top: 0; left: -100%;
                width: 100%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.6s ease;
            }
            
            .tarjeta-tema:hover .preview-tema::before {
                left: 100%;
            }
            
            .info-tema {
                padding: 1rem;
            }
            
            .nombre-tema {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 0.25rem;
                font-size: 0.9rem;
            }
            
            .descripcion-tema {
                font-size: 0.8rem;
                color: #6b7280;
                line-height: 1.4;
            }
            
            .categoria-tema {
                display: inline-block;
                background: #f3f4f6;
                color: #6b7280;
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
                margin-top: 0.5rem;
                text-transform: uppercase;
            }
            
            /* Personalización de colores */
            .personalizacion-colores {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 1.5rem;
                margin-top: 1rem;
            }
            
            .grupo-color {
                margin-bottom: 1rem;
            }
            
            .etiqueta-color {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }
            
            .selector-color {
                display: flex;
                align-items: center;
                gap: 1rem;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                padding: 0.75rem;
                transition: all 0.3s ease;
            }
            
            .selector-color:hover {
                border-color: #d1d5db;
            }
            
            .input-color {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .input-color:hover {
                transform: scale(1.1);
            }
            
            .codigo-color {
                flex: 1;
                background: #f8f9fa;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                padding: 0.5rem;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                font-weight: 600;
                color: #374151;
            }
            
            .preview-personalizado {
                height: 80px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: 1.2rem;
                margin: 1rem 0;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            
            .acciones-tema {
                display: flex;
                gap: 0.75rem;
                margin-top: 1.5rem;
            }
            
            .boton-tema {
                flex: 1;
                padding: 0.75rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                font-size: 0.9rem;
            }
            
            .boton-aplicar {
                background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
            }
            
            .boton-aplicar:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4);
            }
            
            .boton-resetear {
                background: white;
                color: #6b7280;
                border: 2px solid #e5e7eb;
            }
            
            .boton-resetear:hover {
                border-color: #d1d5db;
                color: #374151;
                transform: translateY(-2px);
            }
            
            /* Empresa actual */
            .empresa-actual-tema {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
                border: 1px solid rgba(212, 175, 55, 0.2);
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .icono-empresa-tema {
                width: 50px;
                height: 50px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .info-empresa-tema {
                flex: 1;
            }
            
            .nombre-empresa-tema {
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.25rem;
            }
            
            .tipo-empresa-tema {
                font-size: 0.85rem;
                color: #6b7280;
                font-weight: 500;
            }
            
            /* Botón flotante para abrir panel */
            .boton-temas-flotante {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }
            
            .boton-temas-flotante:hover {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .panel-temas {
                    width: 100vw;
                    right: -100vw;
                }
                
                .boton-temas-flotante {
                    bottom: 1rem;
                    right: 1rem;
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
            }
        `;
        
        document.head.appendChild(estilos);
    }

    // ================================================================
    // CREAR PANEL DE TEMAS
    // ================================================================
    
    crearPanelTemas() {
        // Eliminar panel existente si existe
        const panelExistente = document.getElementById('panelTemas');
        if (panelExistente) {
            panelExistente.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'panelTemas';
        panel.className = 'panel-temas';
        
        panel.innerHTML = `
            <div class="cabecera-panel-temas">
                <h3 class="titulo-panel-temas">
                    <span>🎨</span>
                    <span>Temas Visuales</span>
                </h3>
                <button class="boton-cerrar-panel" onclick="gestorTemas.cerrarPanel()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="contenido-panel-temas">
                ${this.generarEmpresaActual()}
                ${this.generarTemasPredefinidos()}
                ${this.generarPersonalizacion()}
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Crear botón flotante si no existe
        this.crearBotonFlotante();
    }

    generarEmpresaActual() {
        const empresaActual = this.gestor?.obtenerEmpresaActual?.() || { datos: null, id: null };
        
        if (!empresaActual.datos) {
            return `
                <div class="empresa-actual-tema">
                    <div class="icono-empresa-tema" style="background: #f3f4f6; color: #9ca3af;">
                        🏢
                    </div>
                    <div class="info-empresa-tema">
                        <div class="nombre-empresa-tema">Ninguna empresa seleccionada</div>
                        <div class="tipo-empresa-tema">Selecciona una empresa para personalizar</div>
                    </div>
                </div>
            `;
        }

        cconst empresa = empresaActual?.datos;
        const temaActual = this.obtenerTemaEmpresa(empresaActual.id);
        
        return `
            <div class="empresa-actual-tema">
                <div class="icono-empresa-tema" style="background: linear-gradient(135deg, ${temaActual.primario} 0%, ${temaActual.secundario} 100%);">
                    ${empresa.icono}
                </div>
                <div class="info-empresa-tema">
                    <div class="nombre-empresa-tema">${empresa.nombre}</div>
                    <div class="tipo-empresa-tema">${this.obtenerNombreTipo(empresa.tipo)}</div>
                </div>
            </div>
        `;
    }

    generarTemasPredefinidos() {
        const temasPorCategoria = this.agruparTemasPorCategoria();
        
        let html = `
            <div class="seccion-tema">
                <h4 class="titulo-seccion-tema">
                    <i class="fas fa-palette"></i>
                    Temas Predefinidos
                </h4>
                <div class="temas-predefinidos">
        `;
        
        Object.entries(this.temasPredefinidos).forEach(([id, tema]) => {
            const esActivo = this.esTemaActivo(id) ? 'activo' : '';
            
            html += `
                <div class="tarjeta-tema ${esActivo}" onclick="gestorTemas.seleccionarTema('${id}')">
                    <div class="preview-tema" style="background: linear-gradient(135deg, ${tema.primario} 0%, ${tema.secundario} 100%);">
                        ${tema.nombre.split(' ')[0]} Tema
                    </div>
                    <div class="info-tema">
                        <div class="nombre-tema">${tema.nombre}</div>
                        <div class="descripcion-tema">${tema.descripcion}</div>
                        <span class="categoria-tema">${tema.categoria}</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

    generarPersonalizacion() {
        const empresaActual = this.gestor.obtenerEmpresaActual();
        const temaActual = empresaActual.datos ? 
            this.obtenerTemaEmpresa(empresaActual.id) : 
            { primario: '#d4af37', secundario: '#b8860b' };
        
        return `
            <div class="seccion-tema">
                <h4 class="titulo-seccion-tema">
                    <i class="fas fa-sliders-h"></i>
                    Personalización
                </h4>
                <div class="personalizacion-colores">
                    <div class="grupo-color">
                        <label class="etiqueta-color">Color Primario</label>
                        <div class="selector-color">
                            <input type="color" id="colorPrimario" class="input-color" 
                                   value="${temaActual.primario}" 
                                   onchange="gestorTemas.actualizarColorPersonalizado()">
                            <input type="text" id="codigoPrimario" class="codigo-color" 
                                   value="${temaActual.primario}"
                                   onchange="gestorTemas.sincronizarColorPrimario()">
                        </div>
                    </div>
                    
                    <div class="grupo-color">
                        <label class="etiqueta-color">Color Secundario</label>
                        <div class="selector-color">
                            <input type="color" id="colorSecundario" class="input-color" 
                                   value="${temaActual.secundario}" 
                                   onchange="gestorTemas.actualizarColorPersonalizado()">
                            <input type="text" id="codigoSecundario" class="codigo-color" 
                                   value="${temaActual.secundario}"
                                   onchange="gestorTemas.sincronizarColorSecundario()">
                        </div>
                    </div>
                    
                    <div class="preview-personalizado" id="previewPersonalizado" 
                         style="background: linear-gradient(135deg, ${temaActual.primario} 0%, ${temaActual.secundario} 100%);">
                        Vista Previa Personalizada
                    </div>
                    
                    <div class="acciones-tema">
                        <button class="boton-tema boton-aplicar" onclick="gestorTemas.aplicarTemaPersonalizado()">
                            <i class="fas fa-check"></i>
                            Aplicar
                        </button>
                        <button class="boton-tema boton-resetear" onclick="gestorTemas.resetearColores()">
                            <i class="fas fa-undo"></i>
                            Resetear
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    crearBotonFlotante() {
        // Eliminar botón existente si existe
        const botonExistente = document.getElementById('botonTemasFlotante');
        if (botonExistente) {
            botonExistente.remove();
        }

        const boton = document.createElement('button');
        boton.id = 'botonTemasFlotante';
        boton.className = 'boton-temas-flotante';
        boton.innerHTML = '<i class="fas fa-palette"></i>';
        boton.onclick = () => this.abrirPanel();
        boton.title = 'Personalizar Temas';
        
        document.body.appendChild(boton);
    }

    // ================================================================
    // GESTIÓN DEL PANEL
    // ================================================================
    
    abrirPanel() {
        this.crearPanelTemas();
        
        setTimeout(() => {
            document.getElementById('panelTemas').classList.add('abierto');
        }, 100);
    }

    cerrarPanel() {
        const panel = document.getElementById('panelTemas');
        if (panel) {
            panel.classList.remove('abierto');
            setTimeout(() => {
                panel.remove();
            }, 300);
        }
    }

    // ================================================================
    // SELECCIÓN Y APLICACIÓN DE TEMAS
    // ================================================================
    
    seleccionarTema(temaId) {
        const tema = this.temasPredefinidos[temaId];
        if (!tema) return;

        // Actualizar tarjetas activas
        document.querySelectorAll('.tarjeta-tema').forEach(tarjeta => {
            tarjeta.classList.remove('activo');
        });
        event.target.closest('.tarjeta-tema').classList.add('activo');

        // Aplicar tema inmediatamente
        this.aplicarTema(tema.primario, tema.secundario);
        
        // Guardar tema para la empresa actual
        this.guardarTemaEmpresa(temaId, tema);
        
        console.log(`🎨 Tema "${tema.nombre}" aplicado`);
    }

    aplicarTema(colorPrimario, colorSecundario) {
        // Aplicar al selector de empresas
        this.aplicarTemaSelector(colorPrimario, colorSecundario);
        
        // Aplicar al dashboard principal
        this.aplicarTemaDashboard(colorPrimario, colorSecundario);
        
        // Actualizar preview personalizado si el panel está abierto
        const preview = document.getElementById('previewPersonalizado');
        if (preview) {
            preview.style.background = `linear-gradient(135deg, ${colorPrimario} 0%, ${colorSecundario} 100%)`;
        }
        
        // Actualizar inputs de color personalizados
        this.actualizarInputsColor(colorPrimario, colorSecundario);
    }

    aplicarTemaSelector(primario, secundario) {
        // Selector principal
        const selectorEmpresa = document.querySelector('.selector-empresa-actual');
        if (selectorEmpresa) {
            selectorEmpresa.style.borderColor = primario;
            selectorEmpresa.style.boxShadow = `0 4px 15px ${primario}40`;
        }

        // Icono de empresa actual
        const iconoEmpresa = document.querySelector('.icono-empresa-actual');
        if (iconoEmpresa) {
            iconoEmpresa.style.background = `linear-gradient(135deg, ${primario} 0%, ${secundario} 100%)`;
        }

        // Cabecera de lista
        const cabeceraLista = document.querySelector('.cabecera-lista');
        if (cabeceraLista) {
            cabeceraLista.style.background = `linear-gradient(135deg, ${primario}20 0%, ${secundario}10 100%)`;
            cabeceraLista.style.borderColor = `${primario}30`;
        }

        // Tarjetas hover
        const estiloHover = document.getElementById('tema-hover-style') || document.createElement('style');
        estiloHover.id = 'tema-hover-style';
        estiloHover.textContent = `
            .tarjeta-empresa:hover {
                background: linear-gradient(135deg, ${primario}15 0%, ${secundario}08 100%) !important;
                border-color: ${primario}50 !important;
            }
            .tarjeta-empresa.activa {
                background: linear-gradient(135deg, ${primario}25 0%, ${secundario}15 100%) !important;
                border-color: ${primario}60 !important;
            }
        `;
        if (!document.head.contains(estiloHover)) {
            document.head.appendChild(estiloHover);
        }
    }

    aplicarTemaDashboard(primario, secundario) {
        // Buscar elementos del dashboard principal
        const header = document.querySelector('.executive-header, .header-principal, .cabecera-dashboard');
        if (header) {
            header.style.background = `linear-gradient(135deg, ${primario}15 0%, ${secundario}08 100%)`;
            header.style.borderBottom = `3px solid ${primario}`;
        }

        // Tarjetas de métricas
        const tarjetasMetricas = document.querySelectorAll('.metric-card, .tarjeta-metrica, .card-kpi');
        tarjetasMetricas.forEach(tarjeta => {
            tarjeta.style.borderTop = `4px solid ${primario}`;
        });

        // Iconos de métricas
        const iconosMetricas = document.querySelectorAll('.metric-icon, .icono-metrica, .kpi-icon');
        iconosMetricas.forEach(icono => {
            icono.style.background = `linear-gradient(135deg, ${primario} 0%, ${secundario} 100%)`;
        });

        // Botones principales
        const botonesPrincipales = document.querySelectorAll('.btn-primary, .boton-principal');
        botonesPrincipales.forEach(boton => {
            boton.style.background = `linear-gradient(135deg, ${primario} 0%, ${secundario} 100%)`;
        });

        // Variables CSS globales
        document.documentElement.style.setProperty('--color-primario', primario);
        document.documentElement.style.setProperty('--color-secundario', secundario);
        document.documentElement.style.setProperty('--gradiente-principal', `linear-gradient(135deg, ${primario} 0%, ${secundario} 100%)`);
    }

    // ================================================================
    // PERSONALIZACIÓN DE COLORES
    // ================================================================
    
    actualizarColorPersonalizado() {
        const primario = document.getElementById('colorPrimario').value;
        const secundario = document.getElementById('colorSecundario').value;
        
        // Actualizar códigos de texto
        document.getElementById('codigoPrimario').value = primario;
        document.getElementById('codigoSecundario').value = secundario;
        
        // Actualizar preview
        const preview = document.getElementById('previewPersonalizado');
        if (preview) {
            preview.style.background = `linear-gradient(135deg, ${primario} 0%, ${secundario} 100%)`;
        }
    }

    sincronizarColorPrimario() {
        const codigo = document.getElementById('codigoPrimario').value;
        if (this.esColorValido(codigo)) {
            document.getElementById('colorPrimario').value = codigo;
            this.actualizarColorPersonalizado();
        }
    }

    sincronizarColorSecundario() {
        const codigo = document.getElementById('codigoSecundario').value;
        if (this.esColorValido(codigo)) {
            document.getElementById('colorSecundario').value = codigo;
            this.actualizarColorPersonalizado();
        }
    }

    aplicarTemaPersonalizado() {
        const primario = document.getElementById('colorPrimario').value;
        const secundario = document.getElementById('colorSecundario').value;
        
        this.aplicarTema(primario, secundario);
        
        // Guardar tema personalizado
        const temaPersonalizado = {
            nombre: 'Tema Personalizado',
            descripcion: 'Colores personalizados por el usuario',
            primario: primario,
            secundario: secundario,
            categoria: 'personalizado'
        };
        
        this.guardarTemaEmpresa('personalizado', temaPersonalizado);
        
        console.log('🎨 Tema personalizado aplicado');
        alert('✅ Tema personalizado aplicado correctamente');
    }

    resetearColores() {
        const empresaActual = this.gestor.obtenerEmpresaActual();
        if (empresaActual.datos) {
            const tipoEmpresa = empresaActual.datos.tipo;
            const temaDefault = this.obtenerTemaPorTipo(tipoEmpresa);
            
            document.getElementById('colorPrimario').value = temaDefault.primario;
            document.getElementById('colorSecundario').value = temaDefault.secundario;
            
            this.actualizarColorPersonalizado();
        }
    }

    // ================================================================
    // UTILIDADES
    // ================================================================
    
    obtenerTemaEmpresa(empresaId) {
        // Verificar si hay un tema guardado específicamente para esta empresa
        const temasGuardados = JSON.parse(localStorage.getItem('grizalum_temas_empresas') || '{}');
        
        if (temasGuardados[empresaId]) {
            return temasGuardados[empresaId];
        }
        
        // Si no, usar tema por defecto según el tipo de empresa
        const empresa = this.gestor?.estado?.empresas?.[empresaId];
        if (empresa && empresa.tipo) {
            return this.obtenerTemaPorTipo(empresa.tipo);
        }
        
        // Tema por defecto
        return { primario: '#d4af37', secundario: '#b8860b' };
    }

    obtenerTemaPorTipo(tipoEmpresa) {
        const mapaTemasxTipo = {
            'manufactura': this.temasPredefinidos['azul-industria'],
            'comercio': this.temasPredefinidos['rojo-comercial'],
            'servicios': this.temasPredefinidos['dorado-peruano'],
            'construccion': this.temasPredefinidos['marron-tierra'],
            'mineria': this.temasPredefinidos['marron-tierra'],
            'agricultura': this.temasPredefinidos['verde-agricultura'],
            'ganaderia': this.temasPredefinidos['verde-agricultura'],
            'pesca': this.temasPredefinidos['turquesa-marino'],
            'tecnologia': this.temasPredefinidos['morado-innovacion'],
            'turismo': this.temasPredefinidos['dorado-peruano'],
            'transporte': this.temasPredefinidos['azul-industria'],
            'restaurantes': this.temasPredefinidos['naranja-energia']
        };
        
        return mapaTemasxTipo[tipoEmpresa] || this.temasPredefinidos['dorado-peruano'];
    }

    guardarTemaEmpresa(temaId, tema) {
        const empresaActual = this.gestor.obtenerEmpresaActual();
        if (!empresaActual.id) return;
        
        const temasGuardados = JSON.parse(localStorage.getItem('grizalum_temas_empresas') || '{}');
        temasGuardados[empresaActual.id] = {
            id: temaId,
            nombre: tema.nombre,
            primario: tema.primario,
            secundario: tema.secundario,
            fechaAplicacion: new Date().toISOString()
        };
        
        localStorage.setItem('grizalum_temas_empresas', JSON.stringify(temasGuardados));
    }

    cargarTemasPrevios() {
        // Cargar temas guardados y aplicar el tema de la empresa actual si existe
        setTimeout(() => {
            const empresaActual = this.gestor.obtenerEmpresaActual();
            if (empresaActual.id) {
                const tema = this.obtenerTemaEmpresa(empresaActual.id);
                this.aplicarTema(tema.primario, tema.secundario);
            }
        }, 500);
    }

    esTemaActivo(temaId) {
        const empresaActual = this.gestor.obtenerEmpresaActual();
        if (!empresaActual.id) return false;
        
        const temasGuardados = JSON.parse(localStorage.getItem('grizalum_temas_empresas') || '{}');
        return temasGuardados[empresaActual.id]?.id === temaId;
    }

    obtenerNombreTipo(tipo) {
        const mapaTypes = {
            'manufactura': 'Manufactura/Industria',
            'comercio': 'Comercio/Retail',
            'servicios': 'Servicios',
            'construccion': 'Construcción',
            'mineria': 'Minería',
            'agricultura': 'Agricultura',
            'ganaderia': 'Ganadería',
            'pesca': 'Pesca',
            'tecnologia': 'Tecnología',
            'turismo': 'Turismo',
            'transporte': 'Transporte',
            'restaurantes': 'Restaurantes'
        };
        
        return mapaTypes[tipo] || 'Empresa';
    }

    agruparTemasPorCategoria() {
        const grupos = {};
        Object.entries(this.temasPredefinidos).forEach(([id, tema]) => {
            if (!grupos[tema.categoria]) {
                grupos[tema.categoria] = [];
            }
            grupos[tema.categoria].push({ id, ...tema });
        });
        return grupos;
    }

    esColorValido(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    actualizarInputsColor(primario, secundario) {
        const inputPrimario = document.getElementById('colorPrimario');
        const inputSecundario = document.getElementById('colorSecundario');
        const codigoPrimario = document.getElementById('codigoPrimario');
        const codigoSecundario = document.getElementById('codigoSecundario');
        
        if (inputPrimario) inputPrimario.value = primario;
        if (inputSecundario) inputSecundario.value = secundario;
        if (codigoPrimario) codigoPrimario.value = primario;
        if (codigoSecundario) codigoSecundario.value = secundario;
    }

    // ================================================================
    // MÉTODOS PÚBLICOS
    // ================================================================
    
    aplicarTemaAEmpresa(empresaId, temaId) {
        const tema = this.temasPredefinidos[temaId];
        if (!tema) return false;
        
        this.aplicarTema(tema.primario, tema.secundario);
        this.guardarTemaEmpresa(temaId, tema);
        
        return true;
    }

    obtenerTemasDisponibles() {
        return this.temasPredefinidos;
    }

    cambiarEmpresa() {
        // Método llamado cuando cambia la empresa seleccionada
        setTimeout(() => {
            const empresaActual = this.gestor.obtenerEmpresaActual();
            if (empresaActual.id) {
                const tema = this.obtenerTemaEmpresa(empresaActual.id);
                this.aplicarTema(tema.primario, tema.secundario);
                
                // Actualizar panel si está abierto
                const panel = document.getElementById('panelTemas');
                if (panel && panel.classList.contains('abierto')) {
                    this.abrirPanel(); // Recrear el panel con la nueva empresa
                }
            }
        }, 100);
    }
}

// ================================================================
// INICIALIZACIÓN
// ================================================================

let gestorTemas = null;

// Inicializar cuando el gestor principal esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.gestorEmpresas) {
            gestorTemas = new GestorTemas(window.gestorEmpresas);
            window.gestorTemas = gestorTemas;
            
            // Escuchar cambios de empresa
            document.addEventListener('empresaCambiada', function(event) {
                gestorTemas.cambiarEmpresa();
            });
            
            console.log('🎨 Gestor de Temas inicializado');
        }
    }, 600);
});

console.log(`
🎨 ===================================================
   GRIZALUM GESTOR DE TEMAS v2.0
   Personalización visual para empresas peruanas
🎨 ===================================================

✨ CARACTERÍSTICAS:
   • 🏆 8 temas predefinidos inspirados en Perú
   • 🎯 Temas automáticos por tipo de empresa
   • 🌈 Personalización completa de colores
   • 📱 Panel lateral moderno
   • 💾 Guardado automático por empresa

🎨 ===================================================
`);
