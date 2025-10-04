/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        GRIZALUM ENTERPRISE SUITE                              ║
 * ║                   GESTOR DE EMPRESAS ULTRA PROFESIONAL                       ║
 * ║                          Versión 3.1 - 2025                                  ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║ CORREGIDO: Conexión con datos-empresas.js y eventos                         ║
 * ║ SIN TOCAR: Sistema de gráficos y períodos (funciona bien)                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

class GestorEmpresasProfesional {
    constructor() {
        this.config = {
            version: '3.1.0',
            componente: 'GestorEmpresasProfesional',
            debug: false,
            
            maxEmpresas: 50,
            empresaDefault: 'fundicion-laguna',
            autoSave: true,
            syncInterval: 30000,
            
            regional: {
                moneda: 'S/.',
                pais: 'Perú',
                zona: 'America/Lima',
                idioma: 'es-PE'
            },
            
            temas: {
                'rojo': { primary: '#dc2626', secondary: '#b91c1c' },
                'azul': { primary: '#2563eb', secondary: '#1d4ed8' },
                'verde': { primary: '#059669', secondary: '#047857' },
                'morado': { primary: '#7c3aed', secondary: '#6d28d9' },
                'dorado': { primary: '#d97706', secondary: '#b45309' }
            }
        };

        this.estado = {
            inicializado: false,
            listaAbierta: false,
            empresaActual: null,
            empresas: {},
            tema: 'rojo',
            metricas: {}
        };

        this.actividades = [];
        this.cache = new Map();
        this.observers = new Set();
        this.logoTemporal = null;
        
        this._inicializar();
    }

    async _inicializar() {
        try {
            this._log('info', 'Iniciando Gestor de Empresas GRIZALUM v3.1...');
            
            await this._cargarConfiguracion();
            await this._cargarEmpresas();
            await this._cargarActividades();
            
            this._crearEstilosAvanzados();
            this._renderizarInterfaz();
            this._configurarEventos();
            this._iniciarSincronizacion();
            
            this._seleccionarEmpresaInicial();
            this._calcularMetricas();
            
            this.estado.inicializado = true;
            this._log('success', 'Gestor de Empresas inicializado exitosamente');
            
            this._dispararEvento('gestorEmpresasListo', { version: this.config.version });
            
        } catch (error) {
            this._log('error', 'Error crítico al inicializar:', error);
            this._manejarErrorInicializacion(error);
        }
    }

    async _cargarConfiguracion() {
        try {
            const configGuardada = localStorage.getItem('grizalum_config_empresas');
            if (configGuardada) {
                const config = JSON.parse(configGuardada);
                this.config = { ...this.config, ...config };
            }
        } catch (error) {
            this._log('warn', 'No se pudo cargar configuración guardada');
        }
    }

    async _cargarEmpresas() {
        try {
            const datosGuardados = localStorage.getItem('grizalum_empresas');
            
            if (datosGuardados) {
                this.estado.empresas = JSON.parse(datosGuardados);
                this._log('info', `Cargadas ${Object.keys(this.estado.empresas).length} empresas`);
            } else {
                this._crearEmpresasDefault();
                this._guardarEmpresas();
            }
            
            this._validarIntegridadEmpresas();
            
        } catch (error) {
            this._log('error', 'Error cargando empresas:', error);
            this._crearEmpresasDefault();
        }
    }

    _crearEmpresasDefault() {
        this.estado.empresas = {
            'fundicion-laguna': {
                id: 'fundicion-laguna',
                nombre: 'Fundición Laguna',
                icono: '🔥',
                tema: 'rojo',
                estado: 'Operativo',
                categoria: 'Manufactura',
                
                legal: {
                    ruc: '20123456789',
                    razonSocial: 'Fundición Laguna S.A.C.',
                    regimen: 'General',
                    tipoEmpresa: 'S.A.C.'
                },
                
                ubicacion: {
                    direccion: 'Av. Industrial 123',
                    distrito: 'Villa El Salvador',
                    provincia: 'Lima',
                    departamento: 'Lima',
                    codigoPostal: '15842'
                },
                
                contacto: {
                    telefono: '+51 1 234-5678',
                    email: 'contacto@fundicionlaguna.pe',
                    web: 'www.fundicionlaguna.pe'
                },
                
                finanzas: {
                    caja: 0,
                    ingresos: 0,
                    gastos: 0,
                    utilidadNeta: 0,
                    margenNeto: 0,
                    roi: 0
                },
                
                meta: {
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString(),
                    version: '1.0',
                    activa: true
                }
            },
            
            'avicola-san-juan': {
                id: 'avicola-san-juan',
                nombre: 'Avícola San Juan',
                icono: '🐔',
                tema: 'verde',
                estado: 'Operativo',
                categoria: 'Agropecuario',
                
                legal: {
                    ruc: '20987654321',
                    razonSocial: 'Avícola San Juan E.I.R.L.',
                    regimen: 'MYPE',
                    tipoEmpresa: 'E.I.R.L.'
                },
                
                ubicacion: {
                    direccion: 'Fundo Los Álamos Km 8',
                    distrito: 'Cerro Colorado',
                    provincia: 'Arequipa',
                    departamento: 'Arequipa',
                    codigoPostal: '04013'
                },
                
                contacto: {
                    telefono: '+51 54 456-7890',
                    email: 'ventas@avicolasanjuan.pe',
                    web: 'www.avicolasanjuan.pe'
                },
                
                finanzas: {
                    caja: 0,
                    ingresos: 0,
                    gastos: 0,
                    utilidadNeta: 0,
                    margenNeto: 0,
                    roi: 0
                },
                
                meta: {
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString(),
                    version: '1.0',
                    activa: true
                }
            },
            
            'comercial-lima': {
                id: 'comercial-lima',
                nombre: 'Comercial Lima',
                icono: '🏪',
                tema: 'azul',
                estado: 'Regular',
                categoria: 'Comercio',
                
                legal: {
                    ruc: '20555666777',
                    razonSocial: 'Comercial Lima S.R.L.',
                    regimen: 'General',
                    tipoEmpresa: 'S.R.L.'
                },
                
                ubicacion: {
                    direccion: 'Jr. Gamarra 1285',
                    distrito: 'La Victoria',
                    provincia: 'Lima',
                    departamento: 'Lima',
                    codigoPostal: '15033'
                },
                
                contacto: {
                    telefono: '+51 1 567-8901',
                    email: 'info@comerciallima.pe',
                    web: 'www.comerciallima.pe'
                },
                
                finanzas: {
                    caja: 0,
                    ingresos: 0,
                    gastos: 0,
                    utilidadNeta: 0,
                    margenNeto: 0,
                    roi: 0
                },
                
                meta: {
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString(),
                    version: '1.0',
                    activa: true
                }
            }
        };
        
        this._log('info', 'Empresas por defecto creadas');
    }

    // [INCLUIR TODOS LOS ESTILOS CSS - SIN CAMBIOS]
    _crearEstilosAvanzados() {
        const estilosId = 'grizalum-gestor-empresas-styles';
        
        const estilosPrevios = document.getElementById(estilosId);
        if (estilosPrevios) {
            estilosPrevios.remove();
        }
        
        const estilos = document.createElement('style');
        estilos.id = estilosId;
        estilos.textContent = `
            /* [TODO EL CSS IGUAL QUE ANTES - NO CAMBIÓ] */
            :root {
                --grizalum-primary: #dc2626;
                --grizalum-secondary: #b91c1c;
                --grizalum-success: #059669;
                --grizalum-warning: #d97706;
                --grizalum-error: #dc2626;
                --grizalum-info: #2563eb;
                --grizalum-text: #1f2937;
                --grizalum-text-light: #6b7280;
                --grizalum-bg: #ffffff;
                --grizalum-bg-secondary: #f8fafc;
                --grizalum-border: #e5e7eb;
                --grizalum-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                --grizalum-shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.15);
                --grizalum-radius: 12px;
                --grizalum-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .grizalum-empresas-container {
                position: relative;
                min-width: 320px;
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                user-select: none;
            }
            
            .grizalum-empresa-selector {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--grizalum-bg);
                border: 2px solid var(--grizalum-primary);
                border-radius: var(--grizalum-radius);
                padding: 1rem 1.25rem;
                cursor: pointer;
                transition: var(--grizalum-transition);
                box-shadow: var(--grizalum-shadow);
                position: relative;
                overflow: hidden;
            }
            
            .grizalum-empresa-selector::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, var(--grizalum-primary)08 0%, transparent 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .grizalum-empresa-selector:hover {
                transform: translateY(-2px);
                box-shadow: var(--grizalum-shadow-hover);
                border-color: var(--grizalum-secondary);
            }
            
            .grizalum-empresa-selector:hover::before {
                opacity: 1;
            }
            
            .grizalum-empresa-info {
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 1;
            }
            
            .grizalum-empresa-avatar {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, var(--grizalum-primary) 0%, var(--grizalum-secondary) 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                position: relative;
                overflow: hidden;
            }
            
            .grizalum-empresa-avatar::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.1);
                transform: translateX(-100%);
                transition: transform 0.6s ease;
            }
            
            .grizalum-empresa-selector:hover .grizalum-empresa-avatar::before {
                transform: translateX(100%);
            }
            
            .grizalum-empresa-details {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .grizalum-empresa-nombre {
                font-size: 1.1rem;
                font-weight: 700;
                color: var(--grizalum-text);
                line-height: 1.2;
            }
            
            .grizalum-empresa-estado {
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--grizalum-text-light);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .grizalum-empresa-metricas {
                font-size: 0.8rem;
                color: var(--grizalum-success);
                font-weight: 600;
            }
            
            .grizalum-dropdown-arrow {
                color: var(--grizalum-text-light);
                transition: var(--grizalum-transition);
                font-size: 1.2rem;
                z-index: 1;
            }
            
            .grizalum-dropdown-arrow.rotated {
                transform: rotate(180deg);
                color: var(--grizalum-primary);
            }
            
            .grizalum-empresas-list {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                width: 420px;
                background: var(--grizalum-bg);
                border-radius: 16px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                border: 1px solid var(--grizalum-border);
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-20px) scale(0.95);
                transition: var(--grizalum-transition);
                overflow: hidden;
                backdrop-filter: blur(10px);
                background: rgba(255, 255, 255, 0.95);
            }
            
            .grizalum-empresas-list.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            
            .grizalum-list-header {
                padding: 1.5rem;
                background: linear-gradient(135deg, var(--grizalum-bg-secondary) 0%, rgba(248, 250, 252, 0.8) 100%);
                border-bottom: 1px solid var(--grizalum-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .grizalum-list-title {
                margin: 0;
                color: var(--grizalum-text);
                font-size: 1.1rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .grizalum-btn-nueva {
                background: linear-gradient(135deg, var(--grizalum-success) 0%, #047857 100%);
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: var(--grizalum-transition);
                box-shadow: 0 3px 10px rgba(5, 150, 105, 0.3);
            }
            
            .grizalum-btn-nueva:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
            }
            
            .grizalum-empresas-grid {
                max-height: 360px;
                overflow-y: auto;
                padding: 0.75rem;
                scrollbar-width: thin;
                scrollbar-color: var(--grizalum-border) transparent;
            }
            
            .grizalum-empresas-grid::-webkit-scrollbar {
                width: 6px;
            }
            
            .grizalum-empresas-grid::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .grizalum-empresas-grid::-webkit-scrollbar-thumb {
                background: var(--grizalum-border);
                border-radius: 3px;
            }
            
            .grizalum-empresa-card {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-radius: 10px;
                cursor: pointer;
                transition: var(--grizalum-transition);
                margin-bottom: 0.5rem;
                border: 1px solid transparent;
                position: relative;
                overflow: hidden;
            }
            
            .grizalum-empresa-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, var(--grizalum-primary)08 0%, transparent 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .grizalum-empresa-card:hover {
                background: linear-gradient(135deg, var(--grizalum-bg-secondary) 0%, rgba(248, 250, 252, 0.8) 100%);
                transform: translateX(5px);
                border-color: var(--grizalum-border);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            }
            
            .grizalum-empresa-card:hover::before {
                opacity: 1;
            }
            
            .grizalum-empresa-card.active {
                background: linear-gradient(135deg, var(--grizalum-primary)15 0%, var(--grizalum-secondary)08 100%);
                border-color: var(--grizalum-primary);
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
            }
            
            .grizalum-card-avatar {
                width: 45px;
                height: 45px;
                background: linear-gradient(135deg, var(--grizalum-bg-secondary) 0%, var(--grizalum-border) 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                transition: var(--grizalum-transition);
                flex-shrink: 0;
                z-index: 1;
            }
            
            .grizalum-empresa-card:hover .grizalum-card-avatar {
                background: linear-gradient(135deg, var(--grizalum-primary) 0%, var(--grizalum-secondary) 100%);
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
            }
            
            .grizalum-card-info {
                flex: 1;
                z-index: 1;
            }
            
            .grizalum-card-nombre {
                font-weight: 700;
                color: var(--grizalum-text);
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
                line-height: 1.2;
            }
            
            .grizalum-card-datos {
                font-size: 0.8rem;
                color: var(--grizalum-text-light);
                display: flex;
                flex-direction: column;
                gap: 0.125rem;
            }
            
            .grizalum-card-ubicacion {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .grizalum-card-finanzas {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                color: var(--grizalum-success);
                font-weight: 600;
            }
            
            .grizalum-card-estado {
                font-size: 1.2rem;
                opacity: 0.8;
                z-index: 1;
            }
            
            .grizalum-card-actions {
                display: flex;
                gap: 0.5rem;
                opacity: 1;
                transition: var(--grizalum-transition);
                z-index: 1;
            }
            
            .grizalum-action-btn {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--grizalum-transition);
                font-size: 0.8rem;
                background: var(--grizalum-bg);
                color: var(--grizalum-text-light);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .grizalum-action-btn:hover {
                transform: scale(1.1);
                color: var(--grizalum-primary);
            }

            .grizalum-btn-editar:hover {
                background: #3b82f6;
                color: white;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                transform: scale(1.1);
            }

            .grizalum-btn-admin:hover {
                background: #8b5cf6;
                color: white;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
                transform: scale(1.1);
            }

            .grizalum-btn-eliminar:hover {
                background: #ef4444;
                color: white;
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
                transform: scale(1.1);
            }
            
            .grizalum-list-footer {
                padding: 1.25rem;
                background: linear-gradient(135deg, var(--grizalum-bg-secondary) 0%, rgba(248, 250, 252, 0.6) 100%);
                border-top: 1px solid var(--grizalum-border);
                text-align: center;
            }
            
            .grizalum-total-empresas {
                font-weight: 700;
                color: var(--grizalum-text);
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }
            
            .grizalum-total-caja {
                font-size: 1.1rem;
                font-weight: 800;
                color: var(--grizalum-success);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
            
            .estado-operativo { color: #059669; }
            .estado-regular { color: #d97706; }
            .estado-critico { color: #dc2626; }
            .estado-mantenimiento { color: #6366f1; }
            
            @keyframes grizalumFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes grizalumPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .grizalum-empresa-card {
                animation: grizalumFadeIn 0.3s ease-out;
            }
            
            .grizalum-empresa-avatar.pulse {
                animation: grizalumPulse 2s infinite;
            }
            
            @media (max-width: 768px) {
                .grizalum-empresas-list {
                    width: 360px;
                    right: -10px;
                }
                
                .grizalum-empresas-container {
                    min-width: 280px;
                }
                
                .grizalum-empresa-selector {
                    padding: 0.875rem 1rem;
                }
                
                .grizalum-empresa-avatar {
                    width: 45px;
                    height: 45px;
                    font-size: 1.2rem;
                }
            }
            
            @media (max-width: 480px) {
                .grizalum-empresas-list {
                    width: calc(100vw - 40px);
                    right: -20px;
                }
                
                .grizalum-card-datos {
                    font-size: 0.75rem;
                }
                
                .grizalum-card-actions {
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(estilos);
        this._log('info', 'Estilos ultra profesionales aplicados');
    }

    // [RESTO DE FUNCIONES SIN CAMBIOS HASTA seleccionarEmpresa]
    
    _renderizarInterfaz() {
        const contenedor = document.getElementById('companySelector');
        if (!contenedor) {
            this._log('error', 'No se encontró el contenedor #companySelector');
            return;
        }

        contenedor.innerHTML = this._generarHTMLSelector();
        this._actualizarListaEmpresas();
        this._log('info', 'Interfaz renderizada exitosamente');
    }

    _generarHTMLSelector() {
        const empresaActual = this._obtenerEmpresaActual();
        const totalCaja = this._calcularTotalCaja();
        const totalEmpresas = Object.keys(this.estado.empresas).length;

        return `
            <div class="grizalum-empresas-container" id="grizalumCompanyContainer">
                <div class="grizalum-empresa-selector" onclick="gestorEmpresas.alternarLista()">
                    <div class="grizalum-empresa-info">
                        <div class="grizalum-empresa-avatar" id="grizalumEmpresaAvatar">
                            ${empresaActual?.icono || '🏢'}
                        </div>
                        <div class="grizalum-empresa-details">
                            <div class="grizalum-empresa-nombre" id="grizalumEmpresaNombre">
                                ${empresaActual?.nombre || 'Seleccionar Empresa'}
                            </div>
                            <div class="grizalum-empresa-estado" id="grizalumEmpresaEstado">
                                ${this._generarEstadoEmpresa(empresaActual)}
                            </div>
                            <div class="grizalum-empresa-metricas" id="grizalumEmpresaMetricas">
                                ${this.config.regional.moneda} ${empresaActual?.finanzas?.caja?.toLocaleString() || '0'}
                            </div>
                        </div>
                    </div>
                    <div class="grizalum-dropdown-arrow" id="grizalumDropdownArrow">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>

                <div class="grizalum-empresas-list" id="grizalumEmpresasList">
                    <div class="grizalum-list-header">
                        <h4 class="grizalum-list-title">
                            Mis Empresas
                        </h4>
                        <button class="grizalum-btn-nueva" onclick="gestorEmpresas.abrirModalNuevaEmpresa()">
                            <i class="fas fa-plus"></i>
                            Nueva
                        </button>
                    </div>
                    
                    <div class="grizalum-empresas-grid" id="grizalumEmpresasGrid">
                        <!-- Se llena dinámicamente -->
                    </div>
                    
                    <div class="grizalum-list-footer">
                        <div class="grizalum-total-empresas">
                            ${totalEmpresas} empresa${totalEmpresas !== 1 ? 's' : ''}
                registrada${totalEmpresas !== 1 ? 's' : ''}
                        </div>
                        <div class="grizalum-total-caja">
                            <i class="fas fa-coins"></i>
                            Total en Caja: ${this.config.regional.moneda} ${totalCaja.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _actualizarListaEmpresas() {
        const grid = document.getElementById('grizalumEmpresasGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        Object.entries(this.estado.empresas)
            .filter(([_, empresa]) => empresa.meta?.activa !== false)
            .forEach(([id, empresa], index) => {
                const card = this._crearTarjetaEmpresa(id, empresa, index);
                grid.appendChild(card);
            });
    }

    _crearTarjetaEmpresa(id, empresa, index) {
        const esActiva = this.estado.empresaActual === id;
        const card = document.createElement('div');
        
        card.className = `grizalum-empresa-card ${esActiva ? 'active' : ''}`;
        card.dataset.empresaId = id;
        card.style.animationDelay = `${index * 50}ms`;
        
        card.innerHTML = `
           <div class="grizalum-card-avatar" style="background: linear-gradient(135deg, ${this.config.temas[empresa.tema]?.primary || this.config.temas.rojo.primary} 0%, ${this.config.temas[empresa.tema]?.secondary || this.config.temas.rojo.secondary} 100%); box-shadow: 0 4px 12px ${this.config.temas[empresa.tema]?.primary || this.config.temas.rojo.primary}30;">
               ${empresa.logo ? `<img src="${empresa.logo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">` : empresa.icono}
            </div>
            <div class="grizalum-card-info">
                <div class="grizalum-card-nombre">${empresa.nombre}</div>
                <div class="grizalum-card-datos">
                    <div class="grizalum-card-ubicacion">
                        <i class="fas fa-map-marker-alt"></i>
                        ${empresa.ubicacion?.distrito || 'Lima'}, ${empresa.ubicacion?.departamento || 'Lima'}
                    </div>
                    <div class="grizalum-card-finanzas">
                        <i class="fas fa-coins"></i>
                        ${this.config.regional.moneda} ${empresa.finanzas?.caja?.toLocaleString() || '0'}
                    </div>
                </div>
            </div>
            <div class="grizalum-card-estado">
                ${this._obtenerEmojiEstado(empresa.estado)}
            </div>
           <div class="grizalum-card-actions">
                <button class="grizalum-action-btn grizalum-btn-editar" onclick="event.stopPropagation(); editorEmpresas.editarEmpresa('${id}')" title="Editar Empresa">
                  <i class="fas fa-edit"></i>
                </button>
                ${this._generarBotonesSegunRol(id)}
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.grizalum-card-actions')) {
                this.seleccionarEmpresa(id);
            }
        });
        
        return card;
    }

    _generarBotonesSegunRol(empresaId) {
        const esAdmin = true;
        
        if (esAdmin) {
            return `
                <button class="grizalum-action-btn grizalum-btn-admin" onclick="gestorEmpresas.gestionarEmpresa('${empresaId}')" title="Gestión Admin">
                    <i class="fas fa-crown"></i>
                </button>
                <button class="grizalum-action-btn grizalum-btn-eliminar" onclick="gestorEmpresas.confirmarEliminarEmpresa('${empresaId}')" title="Eliminar Empresa">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        } else {
            return '';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚡ FUNCIÓN CRÍTICA CORREGIDA - seleccionarEmpresa()
    // ═══════════════════════════════════════════════════════════════════════════
    seleccionarEmpresa(empresaId) {
        // Validar que la empresa existe
        if (!this.estado.empresas[empresaId]) {
            this._log('error', `Empresa no encontrada: ${empresaId}`);
            return false;
        }

        const empresaAnterior = this.estado.empresaActual;
        const empresa = this.estado.empresas[empresaId];
        
        // Actualizar estado
        this.estado.empresaActual = empresaId;
        
        // Aplicar tema y colores de la empresa
        this._aplicarColoresEmpresa(empresaId); 
        this._aplicarModoVisualEmpresa(empresaId);
        
        // Actualizar interfaz
        this._actualizarSelectorPrincipal();
        this._actualizarTarjetasActivas();
        this._cerrarLista();
        
        // ✅ FIX 1: DISPARAR EVENTO CORRECTO PARA datos-empresas.js
        this._dispararEvento('grizalumCompanyChanged', {
            companyId: empresaId,
            company: {
                id: empresaId,
                name: empresa.nombre,
                data: empresa
            }
        });
        
        // ✅ FIX 2: ACTUALIZAR INTERFAZ COMPLETA
        if (window.actualizarInterfazCompleta) {
            setTimeout(() => window.actualizarInterfazCompleta(), 100);
        }
        
        // Registrar actividad
        this._registrarActividad('EMPRESA_SELECCIONADA', `Empresa seleccionada: ${empresa.nombre}`);
        
        // Evento secundario para compatibilidad
        this._dispararEvento('empresaSeleccionada', {
            empresaId,
            empresa,
            empresaAnterior,
            timestamp: Date.now()
        });
        
        this._calcularMetricas();
        this._log('info', `Empresa seleccionada: ${empresa.nombre}`);
        
        return true;
    }

    alternarLista() {
        this.estado.listaAbierta = !this.estado.listaAbierta;
        
        const lista = document.getElementById('grizalumEmpresasList');
        const arrow = document.getElementById('grizalumDropdownArrow');
        
        if (this.estado.listaAbierta) {
            lista?.classList.add('show');
            arrow?.classList.add('rotated');
            this._actualizarListaEmpresas();
        } else {
            lista?.classList.remove('show');
            arrow?.classList.remove('rotated');
        }
    }

    cerrarLista() {
        this._cerrarLista();
    }

    obtenerEmpresaActual() {
        return {
            id: this.estado.empresaActual,
            datos: this.estado.empresas[this.estado.empresaActual]
        };
    }

    obtenerTodasLasEmpresas() {
        return { ...this.estado.empresas };
    }

    obtenerMetricas() {
        return { ...this.estado.metricas };
    }

    _actualizarSelectorPrincipal() {
        const empresa = this._obtenerEmpresaActual();
        if (!empresa) return;

        const avatar = document.getElementById('grizalumEmpresaAvatar');
        const nombre = document.getElementById('grizalumEmpresaNombre');
        const estado = document.getElementById('grizalumEmpresaEstado');
        const metricas = document.getElementById('grizalumEmpresaMetricas');

        if (avatar) {
            if (empresa.logo) {
                avatar.innerHTML = `<img src="${empresa.logo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
            } else {
                avatar.textContent = empresa.icono;
            }
            
            const temaEmpresa = this.config.temas[empresa.tema] || this.config.temas.rojo;
            avatar.style.background = `linear-gradient(135deg, ${temaEmpresa.primary} 0%, ${temaEmpresa.secondary} 100%)`;
            avatar.style.boxShadow = `0 4px 12px ${temaEmpresa.primary}50`;
            
            document.documentElement.style.setProperty('--grizalum-primary', temaEmpresa.primary);
            document.documentElement.style.setProperty('--grizalum-secondary', temaEmpresa.secondary);
        }
        
        if (nombre) nombre.textContent = empresa.nombre;
        if (estado) estado.innerHTML = this._generarEstadoEmpresa(empresa);
        if (metricas) metricas.innerHTML = `${this.config.regional.moneda} ${empresa.finanzas?.caja?.toLocaleString() || '0'}`;
    }

    _actualizarTarjetasActivas() {
        document.querySelectorAll('.grizalum-empresa-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const tarjetaActiva = document.querySelector(`[data-empresa-id="${this.estado.empresaActual}"]`);
        if (tarjetaActiva) {
            tarjetaActiva.classList.add('active');
        }
    }

    _cerrarLista() {
        this.estado.listaAbierta = false;
        
        const lista = document.getElementById('grizalumEmpresasList');
        const arrow = document.getElementById('grizalumDropdownArrow');
        
        lista?.classList.remove('show');
        arrow?.classList.remove('rotated');
    }

    _seleccionarEmpresaInicial() {
        const empresaDefault = this.estado.empresas[this.config.empresaDefault];
        const primeraEmpresa = Object.keys(this.estado.empresas)[0];
        
        if (empresaDefault) {
            this.seleccionarEmpresa(this.config.empresaDefault);
        } else if (primeraEmpresa) {
            this.seleccionarEmpresa(primeraEmpresa);
        }
    }

    _obtenerEmpresaActual() {
        return this.estado.empresas[this.estado.empresaActual];
    }

    _generarEstadoEmpresa(empresa) {
        if (!empresa) return '<span class="estado-operativo">No seleccionada</span>';
        
        const emoji = this._obtenerEmojiEstado(empresa.estado);
        const clase = `estado-${empresa.estado.toLowerCase().replace(' ', '-')}`;
        
        return `<span class="${clase}">${emoji} ${empresa.estado}</span>`;
    }

    _obtenerEmojiEstado(estado) {
        const estados = {
            'Operativo': '🟢',
            'Regular': '🟡',
            'Crítico': '🔴',
            'En Preparación': '🔵',
            'Mantenimiento': '🔧',
            'Suspendido': '⏸️',
            'Inactivo': '⚫'
        };
        return estados[estado] || '🟢';
    }

    _calcularTotalCaja() {
        return Object.values(this.estado.empresas)
            .filter(empresa => empresa.meta?.activa !== false)
            .reduce((total, empresa) => total + (empresa.finanzas?.caja || 0), 0);
    }

    _calcularMetricas() {
        const empresas = Object.values(this.estado.empresas).filter(e => e.meta?.activa !== false);
        
        this.estado.metricas = {
            totalEmpresas: empresas.length,
            totalCaja: empresas.reduce((sum, e) => sum + (e.finanzas?.caja || 0), 0),
            totalIngresos: empresas.reduce((sum, e) => sum + (e.finanzas?.ingresos || 0), 0),
            totalGastos: empresas.reduce((sum, e) => sum + (e.finanzas?.gastos || 0), 0),
            promedioMargen: empresas.reduce((sum, e) => sum + (e.finanzas?.margenNeto || 0), 0) / empresas.length,
            empresasOperativas: empresas.filter(e => e.estado === 'Operativo').length,
            ultimaActualizacion: Date.now()
        };
    }

    // ✅ FIX 3: FUNCIÓN DE COLORES CORREGIDA
    _aplicarColoresEmpresa(empresaId) {
        const empresa = this.estado.empresas[empresaId];
        if (!empresa) return;
        
        const colores = empresa.coloresPersonalizados || {
            ingresos: '#d4af37',
            gastos: '#ff6b35',
            utilidad: '#2ecc71',
            crecimiento: '#9b59b6',
            tematica: '#d4af37'
        };
        
        const root = document.documentElement;
        
        root.style.setProperty('--color-ingresos', colores.ingresos);
        root.style.setProperty('--color-gastos', colores.gastos);
        root.style.setProperty('--color-utilidad', colores.utilidad);
        root.style.setProperty('--color-crecimiento', colores.crecimiento);
        root.style.setProperty('--color-primario', colores.tematica || colores.ingresos);
        root.style.setProperty('--color-secundario', colores.tematica || colores.ingresos);
        
        this._log('info', `Colores aplicados para: ${empresa.nombre}`);
    }

    _aplicarModoVisualEmpresa(empresaId) {
        const empresa = this.estado.empresas[empresaId];
        if (!empresa) return;
        
        const modoVisual = empresa.modoVisual || 'oscuro';
        
        document.body.classList.remove('modo-oscuro', 'modo-claro', 'modo-neutro');
        
        if (modoVisual === 'claro') {
            document.body.classList.add('modo-claro');
        } else if (modoVisual === 'neutro') {
            document.body.classList.add('modo-neutro');
        }
        
        this._log('info', `Modo visual de ${empresa.nombre}: ${modoVisual}`);
    }

    _guardarEmpresas() {
        try {
            localStorage.setItem('grizalum_empresas', JSON.stringify(this.estado.empresas));
            localStorage.setItem('grizalum_empresa_actual', this.estado.empresaActual);
            this._log('info', 'Empresas guardadas exitosamente');
        } catch (error) {
            this._log('error', 'Error guardando empresas:', error);
        }
    }

    _validarIntegridadEmpresas() {
        let reparacionesNecesarias = 0;
        
        Object.entries(this.estado.empresas).forEach(([id, empresa]) => {
            if (!empresa.id) {
                empresa.id = id;
                reparacionesNecesarias++;
            }
            
            if (!empresa.meta) {
                empresa.meta = {
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString(),
                    version: '1.0',
                    activa: true
                };
                reparacionesNecesarias++;
            }
            
            if (!empresa.finanzas) {
                empresa.finanzas = {
                    caja: 0,
                    ingresos: 0,
                    gastos: 0,
                    utilidadNeta: 0,
                    margenNeto: 0,
                    roi: 0
                };
                reparacionesNecesarias++;
            }
        });
        
        if (reparacionesNecesarias > 0) {
            this._log('warn', `${reparacionesNecesarias} reparaciones aplicadas a los datos`);
            this._guardarEmpresas();
        }
    }

    _iniciarSincronizacion() {
        if (this.config.autoSave) {
            setInterval(() => {
                this._guardarEmpresas();
                this._calcularMetricas();
            }, this.config.syncInterval);
        }
    }

    _configurarEventos() {
        document.addEventListener('click', (evento) => {
            const container = document.querySelector('.grizalum-empresas-container');
            if (container && !container.contains(evento.target)) {
                this._cerrarLista();
            }
        });

        document.addEventListener('empresaActualizada', (evento) => {
            this._actualizarListaEmpresas();
            this._calcularMetricas();
        });

        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && this.estado.listaAbierta) {
                this._cerrarLista();
            }
        });

        this._log('info', 'Eventos configurados exitosamente');
    }

    _dispararEvento(nombreEvento, datos) {
        const evento = new CustomEvent(nombreEvento, {
            detail: { ...datos, gestor: this },
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(evento);
    }

    _log(nivel, mensaje, datos = null) {
        const timestamp = new Date().toISOString();
        const prefijo = `[${timestamp}] [${this.config.componente}]`;
        
        switch (nivel) {
            case 'error':
                console.error(`${prefijo}`, mensaje, datos);
                break;
            case 'warn':
                console.warn(`${prefijo}`, mensaje, datos);
                break;
            case 'success':
                console.log(`${prefijo}`, mensaje, datos);
                break;
            case 'info':
            default:
                if (this.config.debug) {
                    console.log(`${prefijo}`, mensaje, datos);
                }
        }
    }

    _registrarActividad(accion, descripcion, datos = {}) {
        const registro = {
            id: Date.now() + Math.random(),
            accion,
            descripcion,
            datos,
            timestamp: Date.now(),
            fecha: new Date().toISOString(),
            usuario: 'Sistema'
        };
        
        this.actividades.unshift(registro);
        
        if (this.actividades.length > 100) {
            this.actividades = this.actividades.slice(0, 100);
        }
        
        this._guardarActividades();
    }

    async _cargarActividades() {
        try {
            const actividades = localStorage.getItem('grizalum_actividades_empresas');
            if (actividades) {
                this.actividades = JSON.parse(actividades);
            }
        } catch (error) {
            this._log('warn', 'No se pudieron cargar las actividades');
        }
    }

    _guardarActividades() {
        try {
            localStorage.setItem('grizalum_actividades_empresas', JSON.stringify(this.actividades));
        } catch (error) {
            this._log('warn', 'No se pudieron guardar las actividades');
        }
    }

    // [INCLUIR TODAS LAS FUNCIONES DE MODALES SIN CAMBIOS]
    // abrirModalNuevaEmpresa, crearNuevaEmpresa, gestionarEmpresa, etc.
    // (Son demasiado largas para incluir aquí, pero NO tienen cambios)
    
    abrirModalNuevaEmpresa() {
        this._log('info', 'Abriendo modal para nueva empresa');
        this._cerrarLista();
        this._crearModalNuevaEmpresa();
    }

    // [RESTO DE FUNCIONES SIN CAMBIOS - Continúa en siguiente mensaje debido al límite]
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN GLOBAL
// ═══════════════════════════════════════════════════════════════════════════

let gestorEmpresas = null;

function inicializarGestorEmpresas() {
    try {
        if (gestorEmpresas) {
            console.log('Gestor de Empresas ya inicializado');
            return gestorEmpresas;
        }

        gestorEmpresas = new GestorEmpresasProfesional();
        window.gestorEmpresas = gestorEmpresas;
        
        return gestorEmpresas;
        
    } catch (error) {
        console.error('Error al inicializar Gestor de Empresas:', error);
        return null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGestorEmpresas);
} else if (document.readyState === 'interactive') {
    setTimeout(inicializarGestorEmpresas, 200);
} else {
    inicializarGestorEmpresas();
}

console.log('GRIZALUM GESTOR DE EMPRESAS v3.1 - CORREGIDO Y OPTIMIZADO');
console.log('FIXES APLICADOS:');
console.log('  Evento grizalumCompanyChanged conectado');
console.log('  Función seleccionarEmpresa() corregida');
console.log('  Colores por empresa funcionando');
console.log('  Sistema de gráficos NO tocado (funciona bien)');
