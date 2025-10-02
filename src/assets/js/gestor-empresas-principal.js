/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        GRIZALUM ENTERPRISE SUITE                              ║
 * ║                   GESTOR DE EMPRESAS ULTRA PROFESIONAL                       ║
 * ║                          Versión 3.0 - 2025                                  ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║ • Sistema visual moderno para gestión de múltiples empresas                 ║
 * ║ • Selector dinámico en header con métricas en tiempo real                   ║
 * ║ • Modal profesional para crear/editar empresas                              ║
 * ║ • Sistema de temas y colores personalizable                                 ║
 * ║ • Integración completa con dashboard y módulos GRIZALUM                     ║
 * ║ • Persistencia inteligente y sincronización automática                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

class GestorEmpresasProfesional {
    constructor() {
        // ═══════════════════════════════════════════════════════════════════════════
        // CONFIGURACIÓN ULTRA PROFESIONAL
        // ═══════════════════════════════════════════════════════════════════════════
        this.config = {
            version: '3.0.0',
            componente: 'GestorEmpresasProfesional',
            debug: false,
            
            // Configuración de empresas
            maxEmpresas: 50,
            empresaDefault: 'fundicion-laguna',
            autoSave: true,
            syncInterval: 30000, // 30 segundos
            
            // Configuración regional Perú
            regional: {
                moneda: 'S/.',
                pais: 'Perú',
                zona: 'America/Lima',
                idioma: 'es-PE'
            },
            
            // Temas disponibles
            temas: {
                'rojo': { primary: '#dc2626', secondary: '#b91c1c' },
                'azul': { primary: '#2563eb', secondary: '#1d4ed8' },
                'verde': { primary: '#059669', secondary: '#047857' },
                'morado': { primary: '#7c3aed', secondary: '#6d28d9' },
                'dorado': { primary: '#d97706', secondary: '#b45309' }
            }
        };

        // Estado del sistema
        this.estado = {
            inicializado: false,
            listaAbierta: false,
            empresaActual: null,
            empresas: {},
            tema: 'rojo',
            metricas: {}
        };

        // Registro de actividades
        this.actividades = [];
        
        // Cache y performance
        this.cache = new Map();
        this.observers = new Set();
        
        // Variable temporal para logos
        this.logoTemporal = null;
        
        this._inicializar();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE INICIALIZACIÓN ULTRA ROBUSTA
    // ═══════════════════════════════════════════════════════════════════════════
    async _inicializar() {
        try {
            this._log('info', '🚀 Iniciando Gestor de Empresas GRIZALUM v3.0...');
            
            // Cargar configuración y datos
            await this._cargarConfiguracion();
            await this._cargarEmpresas();
            await this._cargarActividades();
            
            // Inicializar componentes
            this._crearEstilosAvanzados();
            this._renderizarInterfaz();
            this._configurarEventos();
            this._iniciarSincronizacion();
            
            // Seleccionar empresa inicial
            this._seleccionarEmpresaInicial();
            
            // Calcular métricas iniciales
            this._calcularMetricas();
            
            this.estado.inicializado = true;
            this._log('success', '✅ Gestor de Empresas inicializado exitosamente');
            
            // Notificar a otros módulos
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
                this._log('info', `📂 Cargadas ${Object.keys(this.estado.empresas).length} empresas`);
            } else {
                this._crearEmpresasDefault();
                this._guardarEmpresas();
            }
            
            // Validar integridad de datos
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
                
                // Datos legales
                legal: {
                    ruc: '20123456789',
                    razonSocial: 'Fundición Laguna S.A.C.',
                    regimen: 'General',
                    tipoEmpresa: 'S.A.C.'
                },
                
                // Ubicación
                ubicacion: {
                    direccion: 'Av. Industrial 123',
                    distrito: 'Villa El Salvador',
                    provincia: 'Lima',
                    departamento: 'Lima',
                    codigoPostal: '15842'
                },
                
                // Contacto
                contacto: {
                    telefono: '+51 1 234-5678',
                    email: 'contacto@fundicionlaguna.pe',
                    web: 'www.fundicionlaguna.pe'
                },
                
                // Métricas financieras
                finanzas: {
                 caja: 0,
                 ingresos: 0,
                 gastos: 0,
                 utilidadNeta: 0,
                 margenNeto: 0,
                  roi: 0
                },
                
                // Metadatos
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
        
        this._log('info', '🏗️ Empresas por defecto creadas');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE ESTILOS ULTRA MODERNOS
    // ═══════════════════════════════════════════════════════════════════════════
    _crearEstilosAvanzados() {
        const estilosId = 'grizalum-gestor-empresas-styles';
        
        // Remover estilos previos si existen
        const estilosPrevios = document.getElementById(estilosId);
        if (estilosPrevios) {
            estilosPrevios.remove();
        }
        
        const estilos = document.createElement('style');
        estilos.id = estilosId;
        estilos.textContent = `
            /* ═══════════════════════════════════════════════════════════════════
               GRIZALUM GESTOR DE EMPRESAS - ESTILOS ULTRA PROFESIONALES
               ═══════════════════════════════════════════════════════════════════ */
            
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
            
            /* Contenedor principal */
            .grizalum-empresas-container {
                position: relative;
                min-width: 320px;
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                user-select: none;
            }
            
            /* Selector principal de empresa */
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
            
            /* Lista de empresas */
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
            
            .grizalum-empresa-card:hover .grizalum-card-actions {
                opacity: 1;
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

            /* Botones específicos por tipo y roles */
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
            
            /* Estados de empresa */
            .estado-operativo { color: #059669; }
            .estado-regular { color: #d97706; }
            .estado-critico { color: #dc2626; }
            .estado-mantenimiento { color: #6366f1; }
            
            /* Animaciones */
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
            
            /* Responsive design */
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
        this._log('info', '🎨 Estilos ultra profesionales aplicados');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE RENDERIZADO AVANZADO
    // ═══════════════════════════════════════════════════════════════════════════
    _renderizarInterfaz() {
        const contenedor = document.getElementById('companySelector');
        if (!contenedor) {
            this._log('error', 'No se encontró el contenedor #companySelector');
            return;
        }

        contenedor.innerHTML = this._generarHTMLSelector();
        this._actualizarListaEmpresas();
        this._log('info', '🎨 Interfaz renderizada exitosamente');
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
                            💰 ${this.config.regional.moneda} ${empresaActual?.finanzas?.caja?.toLocaleString() || '0'}
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
                        🏢 Mis Empresas
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
                        📊 ${totalEmpresas} empresa${totalEmpresas !== 1 ? 's' : ''} registrada${totalEmpresas !== 1 ? 's' : ''}
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
        
        // Evento de selección
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.grizalum-card-actions')) {
                this.seleccionarEmpresa(id);
            }
        });
        
        return card;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE BOTONES SEGÚN ROL
    // ═══════════════════════════════════════════════════════════════════════════
    _generarBotonesSegunRol(empresaId) {
        // Por ahora, simulamos que somos ADMIN
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
    // API PÚBLICA PRINCIPAL
    // ═══════════════════════════════════════════════════════════════════════════
    seleccionarEmpresa(empresaId) {
    if (!this.estado.empresas[empresaId]) {
         this._log('error', `Empresa no encontrada: ${empresaId}`);
      // AGREGAR ESTAS 3 LÍNEAS AL FINAL (antes del return true):
         window.empresaActual = { id: empresaId, nombre: empresa.nombre };
         const event = new CustomEvent('empresaCambiada', { detail: { empresaId } });
         document.dispatchEvent(event);
        return false;
    }

    const empresaAnterior = this.estado.empresaActual;
    this.estado.empresaActual = empresaId;
    this._aplicarColoresEmpresa(empresaId);    
    
    // Actualizar interfaz
    this._actualizarSelectorPrincipal();
    this._actualizarTarjetasActivas();
    this._cerrarLista();
    
    // NUEVA CONEXIÓN: Cambiar empresa en el sistema de datos
    if (window.changeCompany) {
        window.changeCompany(empresaId);
    }
    
    // NUEVA CONEXIÓN: Actualizar interfaz completa
    if (window.actualizarInterfazCompleta) {
        window.actualizarInterfazCompleta();
    }
    
    // Registrar actividad
    const empresa = this.estado.empresas[empresaId];
    this._registrarActividad('EMPRESA_SELECCIONADA', `Empresa seleccionada: ${empresa.nombre}`);
    
    // Notificar a otros módulos
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

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS INTERNOS DE GESTIÓN
    // ═══════════════════════════════════════════════════════════════════════════
    _actualizarSelectorPrincipal() {
    const empresa = this._obtenerEmpresaActual();
    if (!empresa) return;

    const avatar = document.getElementById('grizalumEmpresaAvatar');
    const nombre = document.getElementById('grizalumEmpresaNombre');
    const estado = document.getElementById('grizalumEmpresaEstado');
    const metricas = document.getElementById('grizalumEmpresaMetricas');

    // Actualizar contenido
    if (avatar) {
        if (empresa.logo) {
            avatar.innerHTML = `<img src="${empresa.logo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
        } else {
            avatar.textContent = empresa.icono;
        }
        
        // 🎨 APLICAR TEMA/COLOR DE LA EMPRESA
        const temaEmpresa = this.config.temas[empresa.tema] || this.config.temas.rojo;
        avatar.style.background = `linear-gradient(135deg, ${temaEmpresa.primary} 0%, ${temaEmpresa.secondary} 100%)`;
        avatar.style.boxShadow = `0 4px 12px ${temaEmpresa.primary}50`;
        
        // Actualizar variables CSS globales
        document.documentElement.style.setProperty('--grizalum-primary', temaEmpresa.primary);
        document.documentElement.style.setProperty('--grizalum-secondary', temaEmpresa.secondary);
    }
    
    if (nombre) nombre.textContent = empresa.nombre;
    if (estado) estado.innerHTML = this._generarEstadoEmpresa(empresa);
    if (metricas) metricas.innerHTML = `💰 ${this.config.regional.moneda} ${empresa.finanzas?.caja?.toLocaleString() || '0'}`;
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
        if (!empresa) return '<span class="estado-operativo">🟢 No seleccionada</span>';
        
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
    // ═══════════════════════════════════════════════════════════════════════════
// SISTEMA DE COLORES POR EMPRESA
// ═══════════════════════════════════════════════════════════════════════════

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
    
    // Aplicar colores de métricas
    root.style.setProperty('--color-ingresos', colores.ingresos);
    root.style.setProperty('--color-gastos', colores.gastos);
    root.style.setProperty('--color-utilidad', colores.utilidad);
    root.style.setProperty('--color-crecimiento', colores.crecimiento);
    
    // APLICAR TEMÁTICA (esto es lo que faltaba)
    root.style.setProperty('--color-primario', colores.tematica || colores.ingresos);
    root.style.setProperty('--color-secundario', colores.tematica || colores.ingresos);
    
    this._log('info', `🎨 Colores aplicados para: ${empresa.nombre}`);
}

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE PERSISTENCIA Y SINCRONIZACIÓN
    // ═══════════════════════════════════════════════════════════════════════════
    _guardarEmpresas() {
        try {
            localStorage.setItem('grizalum_empresas', JSON.stringify(this.estado.empresas));
            localStorage.setItem('grizalum_empresa_actual', this.estado.empresaActual);
            this._log('info', '💾 Empresas guardadas exitosamente');
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
            this._log('warn', `🔧 ${reparacionesNecesarias} reparaciones aplicadas a los datos`);
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

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE EVENTOS Y CONFIGURACIÓN
    // ═══════════════════════════════════════════════════════════════════════════
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

        this._log('info', '🎯 Eventos configurados exitosamente');
    }

    _dispararEvento(nombreEvento, datos) {
        const evento = new CustomEvent(nombreEvento, {
            detail: { ...datos, gestor: this },
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(evento);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE LOGGING Y REGISTRO
    // ═══════════════════════════════════════════════════════════════════════════
    _log(nivel, mensaje, datos = null) {
        const timestamp = new Date().toISOString();
        const prefijo = `[${timestamp}] [${this.config.componente}]`;
        
        switch (nivel) {
            case 'error':
                console.error(`${prefijo} ❌`, mensaje, datos);
                break;
            case 'warn':
                console.warn(`${prefijo} ⚠️`, mensaje, datos);
                break;
            case 'success':
                console.log(`${prefijo} ✅`, mensaje, datos);
                break;
            case 'info':
            default:
                if (this.config.debug) {
                    console.log(`${prefijo} ℹ️`, mensaje, datos);
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

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS DE GESTIÓN DE EMPRESAS
    // ═══════════════════════════════════════════════════════════════════════════
    abrirModalNuevaEmpresa() {
        this._log('info', '📝 Abriendo modal para nueva empresa');
        this._cerrarLista();
        this._crearModalNuevaEmpresa();
    }

    editarEmpresaBasico(empresaId) {
        const empresa = this.estado.empresas[empresaId];
        if (!empresa) {
            this._log('error', `Empresa no encontrada: ${empresaId}`);
            return;
        }

        this._log('info', `✏️ Editando empresa básica: ${empresa.nombre}`);
        this._cerrarLista();
        this._crearModalEdicionBasica(empresaId, empresa);
    }

   gestionarEmpresa(empresaId) {
    console.log('🔍 DEBUG - empresaId recibido:', empresaId);
    console.log('🔍 DEBUG - tipo de empresaId:', typeof empresaId);
    console.log('🔍 DEBUG - empresas disponibles:', Object.keys(this.estado.empresas));
    console.log('🔍 DEBUG - empresa buscada:', this.estado.empresas[empresaId]);
    console.log('🔍 DEBUG - this.estado completo:', this.estado);
    
    const empresa = this.estado.empresas[empresaId];
    if (!empresa) {
        console.error('❌ ERROR: Empresa no encontrada:', empresaId);
        console.log('📋 Todas las empresas:', this.estado.empresas);
        alert(`ERROR: No se encontró la empresa con ID: ${empresaId}`);
        this._log('error', `Empresa no encontrada: ${empresaId}`);
        return;
    }

    this._log('info', `👑 Abriendo panel admin para: ${empresa.nombre}`);
    this._cerrarLista();
    this._crearModalGestionAdmin(empresaId, empresa);
}
    
_crearModalGestionAdmin(empresaId, empresa) {
    const modalPrevio = document.getElementById('grizalumModalAdmin');
    if (modalPrevio) modalPrevio.remove();

    const modal = document.createElement('div');
    modal.id = 'grizalumModalAdmin';
    modal.style.cssText = `
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0,0,0,0.7); 
        z-index: 999999; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        padding: 20px;
        backdrop-filter: blur(5px);
    `;
    
    const temaEmpresa = this.config.temas[empresa.tema] || this.config.temas.rojo;
    
    modal.innerHTML = `
        <div style="
            background: #ffffff; 
            border-radius: 20px; 
            width: 900px; 
            max-width: 95vw; 
            max-height: 90vh; 
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease-out;
        ">
            <!-- Header Premium -->
            <div style="
                background: linear-gradient(135deg, ${temaEmpresa.primary} 0%, ${temaEmpresa.secondary} 100%); 
                color: white; 
                padding: 24px; 
                position: relative;
                overflow: hidden;
            ">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: translate(30px, -30px);"></div>
                <div style="position: relative; z-index: 2;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="
                                width: 56px; 
                                height: 56px; 
                                background: rgba(255,255,255,0.2); 
                                border-radius: 16px; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: 24px;
                                backdrop-filter: blur(10px);
                            ">
                                ${empresa.icono}
                            </div>
                            <div>
                                <h2 style="margin: 0; font-size: 24px; font-weight: 700;">👑 Gestión Admin</h2>
                                <div style="opacity: 0.9; font-size: 16px; margin-top: 4px;">${empresa.nombre}</div>
                            </div>
                        </div>
                        <button 
                            onclick="gestorEmpresas.cerrarModalAdmin()" 
                            style="
                                width: 40px; 
                                height: 40px; 
                                background: rgba(255,255,255,0.2); 
                                border: none; 
                                border-radius: 12px; 
                                color: white; 
                                cursor: pointer; 
                                font-size: 18px;
                                transition: all 0.3s ease;
                                backdrop-filter: blur(10px);
                            "
                            onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                            onmouseout="this.style.background='rgba(255,255,255,0.2)'"
                        >✕</button>
                    </div>
                    <div style="
                        opacity: 0.85; 
                        font-size: 14px; 
                        display: flex; 
                        align-items: center; 
                        gap: 12px;
                    ">
                        <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px;">${empresa.categoria}</span>
                        <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px;">${empresa.estado}</span>
                        <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px;">${empresa.ubicacion?.departamento || 'Lima'}</span>
                    </div>
                </div>
            </div>
            
            <!-- Contenido Principal -->
            <div style="padding: 0; max-height: calc(90vh - 200px); overflow-y: auto;">
                
                <!-- Métricas Top -->
                <div style="padding: 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                        <div style="
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                            color: white; 
                            padding: 20px; 
                            border-radius: 16px; 
                            text-align: center;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="position: absolute; top: -10px; right: -10px; width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
                            <div style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${this.config.regional.moneda} ${empresa.finanzas?.caja?.toLocaleString() || '0'}</div>
                            <div style="font-size: 12px; opacity: 0.9; font-weight: 600;">💰 CAJA ACTUAL</div>
                        </div>
                        
                        <div style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
                            color: white; 
                            padding: 20px; 
                            border-radius: 16px; 
                            text-align: center;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="position: absolute; top: -10px; right: -10px; width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
                            <div style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${empresa.finanzas?.margenNeto || 0}%</div>
                            <div style="font-size: 12px; opacity: 0.9; font-weight: 600;">📈 MARGEN NETO</div>
                        </div>
                        
                        <div style="
                            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); 
                            color: white; 
                            padding: 20px; 
                            border-radius: 16px; 
                            text-align: center;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="position: absolute; top: -10px; right: -10px; width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
                            <div style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${empresa.finanzas?.roi || 0}%</div>
                            <div style="font-size: 12px; opacity: 0.9; font-weight: 600;">🎯 ROI</div>
                        </div>
                        
                        <div style="
                            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                            color: white; 
                            padding: 20px; 
                            border-radius: 16px; 
                            text-align: center;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="position: absolute; top: -10px; right: -10px; width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
                            <div style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">${this._calcularDiasActiva(empresa.meta?.fechaCreacion)}</div>
                            <div style="font-size: 12px; opacity: 0.9; font-weight: 600;">📅 DÍAS ACTIVA</div>
                        </div>
                    </div>
                </div>
                
                <!-- Formulario de Edición -->
                <div style="padding: 32px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                        
                        <!-- Columna Izquierda -->
                        <div style="space-y: 24px;">
                            <div style="margin-bottom: 24px;">
                                <label style="
                                    display: block; 
                                    font-weight: 600; 
                                    margin-bottom: 8px; 
                                    color: #374151;
                                    font-size: 14px;
                                ">🏢 Nombre de la Empresa</label>
                                <input 
                                    type="text" 
                                    id="adminEmpresaNombre" 
                                    value="${empresa.nombre}" 
                                    style="
                                        width: 100%; 
                                        padding: 16px; 
                                        border: 2px solid #e5e7eb; 
                                        border-radius: 12px; 
                                        font-size: 16px;
                                        transition: all 0.3s ease;
                                        background: #ffffff;
                                    "
                                    onfocus="this.style.borderColor='${temaEmpresa.primary}'; this.style.boxShadow='0 0 0 3px ${temaEmpresa.primary}20'"
                                    onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
                                >
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <label style="
                                    display: block; 
                                    font-weight: 600; 
                                    margin-bottom: 8px; 
                                    color: #374151;
                                    font-size: 14px;
                                ">📋 Categoría</label>
                                <select 
                                    id="adminEmpresaCategoria" 
                                    style="
                                        width: 100%; 
                                        padding: 16px; 
                                        border: 2px solid #e5e7eb; 
                                        border-radius: 12px; 
                                        font-size: 16px;
                                        background: #ffffff;
                                        cursor: pointer;
                                    "
                                >
                                    <option value="Manufactura" ${empresa.categoria === 'Manufactura' ? 'selected' : ''}>🏭 Manufactura</option>
                                    <option value="Comercio" ${empresa.categoria === 'Comercio' ? 'selected' : ''}>🏪 Comercio</option>
                                    <option value="Servicios" ${empresa.categoria === 'Servicios' ? 'selected' : ''}>🛠️ Servicios</option>
                                    <option value="Agropecuario" ${empresa.categoria === 'Agropecuario' ? 'selected' : ''}>🌱 Agropecuario</option>
                                    <option value="Tecnología" ${empresa.categoria === 'Tecnología' ? 'selected' : ''}>💻 Tecnología</option>
                                    <option value="Salud" ${empresa.categoria === 'Salud' ? 'selected' : ''}>🏥 Salud</option>
                                    <option value="Educación" ${empresa.categoria === 'Educación' ? 'selected' : ''}>🎓 Educación</option>
                                    <option value="Restaurante" ${empresa.categoria === 'Restaurante' ? 'selected' : ''}>🍕 Restaurante</option>
                                    <option value="Transporte" ${empresa.categoria === 'Transporte' ? 'selected' : ''}>🚗 Transporte</option>
                                    <option value="Construcción" ${empresa.categoria === 'Construcción' ? 'selected' : ''}>🏗️ Construcción</option>
                                </select>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <label style="
                                    display: block; 
                                    font-weight: 600; 
                                    margin-bottom: 8px; 
                                    color: #374151;
                                    font-size: 14px;
                                ">⚡ Estado Operativo</label>
                                <select 
                                    id="adminEmpresaEstado" 
                                    style="
                                        width: 100%; 
                                        padding: 16px; 
                                        border: 2px solid #e5e7eb; 
                                        border-radius: 12px; 
                                        font-size: 16px;
                                        background: #ffffff;
                                        cursor: pointer;
                                    "
                                >
                                    <option value="Operativo" ${empresa.estado === 'Operativo' ? 'selected' : ''}>🟢 Operativo</option>
                                    <option value="Regular" ${empresa.estado === 'Regular' ? 'selected' : ''}>🟡 Regular</option>
                                    <option value="Crítico" ${empresa.estado === 'Crítico' ? 'selected' : ''}>🔴 Crítico</option>
                                    <option value="En Preparación" ${empresa.estado === 'En Preparación' ? 'selected' : ''}>🔵 En Preparación</option>
                                    <option value="Mantenimiento" ${empresa.estado === 'Mantenimiento' ? 'selected' : ''}>🔧 Mantenimiento</option>
                                    <option value="Suspendido" ${empresa.estado === 'Suspendido' ? 'selected' : ''}>⏸️ Suspendido</option>
                                    <option value="Inactivo" ${empresa.estado === 'Inactivo' ? 'selected' : ''}>⚫ Inactivo</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Columna Derecha -->
                        <div>
                            <div style="margin-bottom: 24px;">
                                <label style="
                                    display: block; 
                                    font-weight: 600; 
                                    margin-bottom: 8px; 
                                    color: #374151;
                                    font-size: 14px;
                                ">💰 Caja Actual</label>
                                <input 
                                    type="number" 
                                    id="adminEmpresaCaja" 
                                    value="${empresa.finanzas?.caja || 0}" 
                                    style="
                                        width: 100%; 
                                        padding: 16px; 
                                        border: 2px solid #e5e7eb; 
                                        border-radius: 12px; 
                                        font-size: 16px;
                                        background: #ffffff;
                                    "
                                    onfocus="this.style.borderColor='${temaEmpresa.primary}'; this.style.boxShadow='0 0 0 3px ${temaEmpresa.primary}20'"
                                    onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
                                >
                            </div>
                            
                            <!-- Info Card -->
                            <div style="
                                background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 20%); 
                                padding: 20px; 
                                border-radius: 16px; 
                                border: 1px solid #f59e0b;
                                margin-bottom: 20px;
                            ">
                                <div style="
                                    font-weight: 700; 
                                    color: #92400e; 
                                    display: flex; 
                                    align-items: center; 
                                    gap: 8px; 
                                    margin-bottom: 8px;
                                    font-size: 14px;
                                ">
                                    ⚠️ Información de la Empresa
                                </div>
                                <div style="font-size: 13px; color: #92400e; line-height: 1.5;">
                                    <strong>Creada:</strong> ${new Date(empresa.meta?.fechaCreacion).toLocaleDateString('es-PE')}<br>
                                    <strong>Actualizada:</strong> ${new Date(empresa.meta?.fechaActualizacion).toLocaleDateString('es-PE')}<br>
                                    <strong>ID:</strong> ${empresa.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer con Botones -->
            <div style="
                background: #f8fafc; 
                padding: 24px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                border-top: 1px solid #e2e8f0;
            ">
                <div style="display: flex; gap: 12px;">
                    <button 
                        onclick="gestorEmpresas.exportarDatosEmpresa('${empresaId}')" 
                        style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
                            color: white; 
                            border: none; 
                            padding: 12px 20px; 
                            border-radius: 12px; 
                            cursor: pointer; 
                            display: flex; 
                            align-items: center; 
                            gap: 8px;
                            font-weight: 600;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                    >
                        📤 Exportar
                    </button>
                    <button 
                        onclick="gestorEmpresas.duplicarEmpresa('${empresaId}')" 
                        style="
                            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); 
                            color: white; 
                            border: none; 
                            padding: 12px 20px; 
                            border-radius: 12px; 
                            cursor: pointer; 
                            display: flex; 
                            align-items: center; 
                            gap: 8px;
                            font-weight: 600;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(139, 92, 246, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                    >
                        📋 Duplicar
                    </button>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button 
                        onclick="gestorEmpresas.cerrarModalAdmin()" 
                        style="
                            background: #6b7280; 
                            color: white; 
                            border: none; 
                            padding: 12px 20px; 
                            border-radius: 12px; 
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.background='#4b5563'"
                        onmouseout="this.style.background='#6b7280'"
                    >❌ Cancelar</button>
                    <button 
                        onclick="gestorEmpresas.guardarCambiosAdmin('${empresaId}')" 
                        style="
                            background: linear-gradient(135deg, ${temaEmpresa.primary} 0%, ${temaEmpresa.secondary} 100%); 
                            color: white; 
                            border: none; 
                            padding: 12px 24px; 
                            border-radius: 12px; 
                            cursor: pointer;
                            font-weight: 700;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px ${temaEmpresa.primary}40'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                    >💾 Guardar Cambios</button>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes modalSlideIn {
                from { opacity: 0; transform: scale(0.9) translateY(20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
        </style>
    `;

    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('adminEmpresaNombre')?.focus(), 100);
    
    this._log('info', '👑 Modal admin premium abierto');
}
_calcularDiasActiva(fechaCreacion) {
    if (!fechaCreacion) return 0;
    const fechaInicio = new Date(fechaCreacion);
    const fechaActual = new Date();
    const diferencia = fechaActual - fechaInicio;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
}

cerrarModalAdmin() {
    const modal = document.getElementById('grizalumModalAdmin');
    if (modal) {
        modal.remove();
    }
}

guardarCambiosAdmin(empresaId) {
    const nuevoNombre = document.getElementById('adminEmpresaNombre').value.trim();
    const nuevaCategoria = document.getElementById('adminEmpresaCategoria').value;
    const nuevoEstado = document.getElementById('adminEmpresaEstado').value;
    const nuevaCaja = parseFloat(document.getElementById('adminEmpresaCaja').value) || 0;

    if (!nuevoNombre) {
        alert('❌ El nombre de la empresa es obligatorio');
        return;
    }

    this.estado.empresas[empresaId].nombre = nuevoNombre;
    this.estado.empresas[empresaId].categoria = nuevaCategoria;
    this.estado.empresas[empresaId].estado = nuevoEstado;
    this.estado.empresas[empresaId].finanzas.caja = nuevaCaja;
    this.estado.empresas[empresaId].meta.fechaActualizacion = new Date().toISOString();

    this._guardarEmpresas();
    this._actualizarListaEmpresas();
    this._actualizarSelectorPrincipal();
    this._calcularMetricas();
    this.cerrarModalAdmin();
    
    this._registrarActividad('EMPRESA_ADMIN_EDITADA', `Cambios admin guardados: ${nuevoNombre}`);
    this._log('success', `✅ Cambios admin guardados: ${nuevoNombre}`);
    this._dispararEvento('empresaActualizada', { empresaId, empresa: this.estado.empresas[empresaId] });
}

exportarDatosEmpresa(empresaId) {
    const empresa = this.estado.empresas[empresaId];
    if (!empresa) return;
    
    const datos = JSON.stringify(empresa, null, 2);
    const blob = new Blob([datos], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${empresa.nombre}_datos.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this._log('info', `📤 Datos exportados: ${empresa.nombre}`);
}

duplicarEmpresa(empresaId) {
    const empresa = this.estado.empresas[empresaId];
    if (!empresa) return;
    
    const nuevoId = empresa.id + '-copia-' + Date.now();
    const empresaDuplicada = JSON.parse(JSON.stringify(empresa));
    
    empresaDuplicada.id = nuevoId;
    empresaDuplicada.nombre = empresa.nombre + ' (Copia)';
    empresaDuplicada.meta.fechaCreacion = new Date().toISOString();
    empresaDuplicada.meta.fechaActualizacion = new Date().toISOString();
    
    this.estado.empresas[nuevoId] = empresaDuplicada;
    this._guardarEmpresas();
    this._actualizarListaEmpresas();
    this._calcularMetricas();
    this.cerrarModalAdmin();
    
    this._log('success', `📋 Empresa duplicada: ${empresaDuplicada.nombre}`);
}

    confirmarEliminarEmpresa(empresaId) {
        this._log('info', `🗑️ Solicitud eliminar empresa: ${empresaId}`);
        console.log('🚀 Eliminar empresa - Próximamente en Fase 3');
        this._cerrarLista();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MODALES Y FORMULARIOS
    // ═══════════════════════════════════════════════════════════════════════════
    _crearModalEdicionBasica(empresaId, empresa) {
        const modalPrevio = document.getElementById('grizalumModalEdicion');
        if (modalPrevio) modalPrevio.remove();

        const modal = document.createElement('div');
        modal.id = 'grizalumModalEdicion';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center;';
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; width: 500px; max-width: 90vw; box-shadow: 0 25px 50px rgba(0,0,0,0.3);">
                <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 1.5rem; border-radius: 16px 16px 0 0;">
                    <h3 style="margin: 0; display: flex; justify-content: space-between; align-items: center;">
                        ✏️ Editar Empresa
                        <span onclick="gestorEmpresas.cerrarModalEdicion()" style="cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border-radius: 50%;">✕</span>
                    </h3>
                </div>
                <div style="padding: 2rem;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">📝 Nombre de la Empresa:</label>
                        <input type="text" id="empresaNombre" value="${empresa.nombre}" maxlength="50" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">🎨 Icono:</label>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <input type="text" id="empresaEmoji" value="${empresa.icono || '🏢'}" maxlength="2" readonly style="width: 80px; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1.5rem; text-align: center; background: #f8fafc;">
                            <span style="color: #6b7280; font-size: 0.875rem;">👈 Selecciona un icono abajo</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.5rem; padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 1rem;">
                            ${this._generarGridEmojis()}
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">📷 O sube tu logo:</label>
                            <input type="file" id="empresaLogo" accept="image/*" style="width: 100%; padding: 0.75rem; border: 2px dashed #e5e7eb; border-radius: 8px;" onchange="gestorEmpresas.manejarUploadLogo(event)">
                            <div id="previewLogo" style="margin-top: 0.5rem;"></div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                        <button onclick="gestorEmpresas.cerrarModalEdicion()" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">❌ Cancelar</button>
                        <button onclick="gestorEmpresas.guardarEdicionBasica('${empresaId}')" style="background: #059669; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">💾 Guardar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => document.getElementById('empresaNombre').focus(), 100);
    }

    _generarGridEmojis() {
        const emojis = [
            '🏢', '🏭', '🏪', '🏦', '🏨', '🔥', '🐔', '🌟', 
            '💎', '⚡', '🚀', '🛠️', '🌱', '💡', '🎯', '💰',
            '🍕', '☕', '🚗', '✈️', '🏥', '🎓', '🎨', '🎵',
            '📱', '💻', '⚽', '🏀', '🎮', '📚', '🔧', '⚖️'
        ];
        
        return emojis.map(emoji => 
            `<div onclick="gestorEmpresas.seleccionarEmoji('${emoji}')" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: white; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 1.2rem; transition: all 0.3s ease;" onmouseover="this.style.background='#dc2626'; this.style.borderColor='#dc2626'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='white'; this.style.borderColor='#e5e7eb'; this.style.transform='scale(1)'">${emoji}</div>`
        ).join('');
    }

    manejarUploadLogo(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('previewLogo');
            preview.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <img src="${e.target.result}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <div style="font-weight: 600; color: #059669;">✅ Logo cargado</div>
                        <div style="font-size: 0.8rem; color: #6b7280;">${file.name}</div>
                    </div>
                    <button onclick="gestorEmpresas.usarLogo('${e.target.result}')" style="background: #059669; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">Usar este logo</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }

    usarLogo(logoData) {
        this.logoTemporal = logoData;
        document.getElementById('empresaEmoji').value = '📷';
        
        const preview = document.getElementById('previewLogo');
        preview.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem; background: #f0fdf4; border-radius: 8px; border: 1px solid #059669;">
                <img src="${logoData}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <div>
                    <div style="font-weight: 600; color: #059669;">🎉 Logo seleccionado</div>
                    <div style="font-size: 0.8rem; color: #059669;">Se guardará al hacer clic en "Guardar"</div>
                </div>
            </div>
        `;
    }

    _crearModalNuevaEmpresa() {
        const modalPrevio = document.getElementById('grizalumModalNuevaEmpresa');
        if (modalPrevio) modalPrevio.remove();

        const modal = document.createElement('div');
        modal.id = 'grizalumModalNuevaEmpresa';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center;';
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 16px; width: 700px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.3);">
                <div style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 1.5rem; border-radius: 16px 16px 0 0;">
                    <h3 style="margin: 0; display: flex; justify-content: space-between; align-items: center;">
                        ✨ Nueva Empresa
                        <span onclick="gestorEmpresas.cerrarModalNuevaEmpresa()" style="cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border-radius: 50%;">✕</span>
                    </h3>
                </div>
                <div style="padding: 2rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">🏢 Nombre de la Empresa:</label>
                            <input type="text" id="nuevaEmpresaNombre" placeholder="Ej: Mi Nueva Empresa" maxlength="50" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">📋 Categoría:</label>
                            <select id="nuevaEmpresaCategoria" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                                <option value="Manufactura">🏭 Manufactura</option>
                                <option value="Comercio">🏪 Comercio</option>
                                <option value="Servicios">🛠️ Servicios</option>
                                <option value="Agropecuario">🌱 Agropecuario</option>
                                <option value="Tecnología">💻 Tecnología</option>
                                <option value="Salud">🏥 Salud</option>
                                <option value="Educación">🎓 Educación</option>
                                <option value="Restaurante">🍕 Restaurante</option>
                                <option value="Transporte">🚗 Transporte</option>
                                <option value="Construcción">🏗️ Construcción</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="margin: 1.5rem 0;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">🎨 Icono de la Empresa:</label>
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <input type="text" id="nuevaEmpresaEmoji" value="🏢" maxlength="2" readonly style="width: 80px; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1.5rem; text-align: center; background: #f8fafc;">
                            <span style="color: #6b7280; font-size: 0.875rem;">👈 Selecciona un icono</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.5rem; padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 1rem;">
                            ${this._generarGridEmojis()}
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">📍 Distrito:</label>
                            <input type="text" id="nuevaEmpresaDistrito" placeholder="Ej: Lima" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">🏛️ Departamento:</label>
                            <select id="nuevaEmpresaDepartamento" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                                <option value="Lima">Lima</option>
                                <option value="Arequipa">Arequipa</option>
                                <option value="Cusco">Cusco</option>
                                <option value="Trujillo">Trujillo</option>
                                <option value="Chiclayo">Chiclayo</option>
                                <option value="Piura">Piura</option>
                                <option value="Iquitos">Iquitos</option>
                                <option value="Huancayo">Huancayo</option>
                                <option value="Tacna">Tacna</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    <div style="margin: 1.5rem 0;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">🎨 Tema de Colores:</label>
                        <div style="display: flex; gap: 1rem;">
                            <div 
                                data-tema="rojo" 
                                onclick="gestorEmpresas.seleccionarTema('rojo')" 
                                style="width: 60px; height: 40px; background: linear-gradient(135deg, #dc2626, #b91c1c); border-radius: 8px; cursor: pointer; border: 3px solid #dc2626; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem; transition: all 0.3s ease;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                                ROJO
                            </div>
                            <div 
                                data-tema="azul" 
                                onclick="gestorEmpresas.seleccionarTema('azul')" 
                                style="width: 60px; height: 40px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 8px; cursor: pointer; border: 3px solid transparent; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem; transition: all 0.3s ease;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                                AZUL
                            </div>
                            <div 
                                data-tema="verde" 
                                onclick="gestorEmpresas.seleccionarTema('verde')" 
                                style="width: 60px; height: 40px; background: linear-gradient(135deg, #059669, #047857); border-radius: 8px; cursor: pointer; border: 3px solid transparent; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem; transition: all 0.3s ease;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                                VERDE
                            </div>
                            <div 
                                data-tema="morado" 
                                onclick="gestorEmpresas.seleccionarTema('morado')" 
                                style="width: 60px; height: 40px; background: linear-gradient(135deg, #7c3aed, #6d28d9); border-radius: 8px; cursor: pointer; border: 3px solid transparent; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem; transition: all 0.3s ease;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                                MORADO
                            </div>
                            <div 
                                data-tema="dorado" 
                                onclick="gestorEmpresas.seleccionarTema('dorado')" 
                                style="width: 60px; height: 40px; background: linear-gradient(135deg, #d97706, #b45309); border-radius: 8px; cursor: pointer; border: 3px solid transparent; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem; transition: all 0.3s ease;"
                                onmouseover="this.style.transform='scale(1.05)'" 
                                onmouseout="this.style.transform='scale(1)'">
                                DORADO
                            </div>
                        </div>
                        <input type="hidden" id="nuevaEmpresaTema" value="rojo">
                    </div>
                </div>
                <div style="background: #f8fafc; padding: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #e5e7eb;">
                    <button onclick="gestorEmpresas.cerrarModalNuevaEmpresa()" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">❌ Cancelar</button>
                    <button onclick="gestorEmpresas.crearNuevaEmpresa()" style="background: #059669; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">✨ Crear Empresa</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => document.getElementById('nuevaEmpresaNombre').focus(), 100);
        
        this._log('info', '✨ Modal de nueva empresa abierto');
    }

    cerrarModalNuevaEmpresa() {
        const modal = document.getElementById('grizalumModalNuevaEmpresa');
        if (modal) {
            modal.remove();
        }
    }

        /**
     * Selecciona tema de colores (CONECTADO CON TU SISTEMA)
     * @param {string} tema - Tema seleccionado
     */
    seleccionarTema(tema) {
        const modal = document.getElementById('grizalumModalNuevaEmpresa');
        if (!modal) return;
        
        // Mapear temas del gestor a tu sistema CSS
        const mapaTemaCss = {
            'rojo': 'red',
            'azul': 'blue', 
            'verde': 'green',
            'morado': 'purple',
            'dorado': 'gold'
        };
        
        const temaCss = mapaTemaCss[tema] || 'gold';
        
        // Remover selección previa de TODOS los botones de tema
        modal.querySelectorAll('[data-tema]').forEach(el => {
            el.style.borderColor = 'transparent';
            el.style.transform = 'scale(1)';
            el.style.boxShadow = 'none';
        });
        
        // Encontrar el botón específico del tema seleccionado
        const botonSeleccionado = modal.querySelector(`[data-tema="${tema}"]`);
        if (botonSeleccionado) {
            botonSeleccionado.style.borderColor = this.config.temas[tema].primary;
            botonSeleccionado.style.transform = 'scale(1.1)';
            botonSeleccionado.style.boxShadow = `0 4px 15px ${this.config.temas[tema].primary}40`;
        }
        
        // Guardar selección en el input hidden
        const temaInput = document.getElementById('nuevaEmpresaTema');
        if (temaInput) {
            temaInput.value = tema;
        }
        
        // 🎨 APLICAR TEMA INMEDIATAMENTE AL MODAL (conexión con tu CSS)
        modal.setAttribute('data-theme', temaCss);
        
        // Efecto visual de cambio
        modal.classList.add('theme-changing');
        setTimeout(() => modal.classList.remove('theme-changing'), 500);
        
        this._log('info', `🎨 Tema seleccionado: ${tema} → CSS: ${temaCss}`);
    }
    
    crearNuevaEmpresa() {
        const nombre = document.getElementById('nuevaEmpresaNombre').value.trim();
        const categoria = document.getElementById('nuevaEmpresaCategoria').value;
        const emoji = document.getElementById('nuevaEmpresaEmoji').value;
        const distrito = document.getElementById('nuevaEmpresaDistrito').value.trim();
        const departamento = document.getElementById('nuevaEmpresaDepartamento').value;
        const tema = document.getElementById('nuevaEmpresaTema').value;

        if (!nombre) {
            alert('❌ El nombre de la empresa es obligatorio');
            return;
        }

        if (nombre.length < 3) {
            alert('❌ El nombre debe tener al menos 3 caracteres');
            return;
        }

        const empresaId = nombre.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
        
        if (this.estado.empresas[empresaId]) {
            alert('❌ Ya existe una empresa con ese nombre');
            return;
        }

        const nuevaEmpresa = {
            id: empresaId,
            nombre: nombre,
            icono: emoji,
            tema: tema,
            estado: 'Operativo',
            categoria: categoria,
            
            legal: {
                ruc: '20000000000',
                razonSocial: nombre + ' S.A.C.',
                regimen: 'General',
                tipoEmpresa: 'S.A.C.'
            },
            
            ubicacion: {
                direccion: 'Por definir',
                distrito: distrito || 'Lima',
                provincia: distrito || 'Lima',
                departamento: departamento,
                codigoPostal: '00000'
            },
            
            contacto: {
                telefono: 'Por definir',
                email: 'contacto@' + empresaId + '.pe',
                web: 'www.' + empresaId + '.pe'
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
        };

        this.estado.empresas[empresaId] = nuevaEmpresa;
        this._guardarEmpresas();
        this._actualizarListaEmpresas();
        this._calcularMetricas();
        this.cerrarModalNuevaEmpresa();
        this.seleccionarEmpresa(empresaId);
        this._registrarActividad('EMPRESA_CREADA', `Nueva empresa creada: ${nombre}`);
        this._log('success', `✅ Empresa creada: ${nombre}`);
        this._dispararEvento('empresaCreada', { empresaId, empresa: nuevaEmpresa });
    }

    seleccionarEmoji(emoji) {
        const editEmoji = document.getElementById('empresaEmoji');
        if (editEmoji) {
            editEmoji.value = emoji;
        }
        
        const newEmoji = document.getElementById('nuevaEmpresaEmoji');
        if (newEmoji) {
            newEmoji.value = emoji;
        }
        
        const modalEdicion = document.getElementById('grizalumModalEdicion');
        const modalNueva = document.getElementById('grizalumModalNuevaEmpresa');
        
        if (modalEdicion) {
            modalEdicion.querySelectorAll('[onclick*="seleccionarEmoji"]').forEach(el => {
                el.style.background = 'white';
                el.style.borderColor = '#e5e7eb';
            });
        }
        
        if (modalNueva) {
            modalNueva.querySelectorAll('[onclick*="seleccionarEmoji"]').forEach(el => {
                el.style.background = 'white';
                el.style.borderColor = '#e5e7eb';
            });
        }
        
        if (event && event.target) {
            event.target.style.background = '#dc2626';
            event.target.style.borderColor = '#dc2626';
        }
    }

    guardarEdicionBasica(empresaId) {
        const nuevoNombre = document.getElementById('empresaNombre').value.trim();
        const nuevoEmoji = document.getElementById('empresaEmoji').value;

        if (!nuevoNombre) {
            alert('❌ El nombre de la empresa es obligatorio');
            return;
        }

        if (nuevoNombre.length < 3) {
            alert('❌ El nombre debe tener al menos 3 caracteres');
            return;
        }

        this.estado.empresas[empresaId].nombre = nuevoNombre;

        if (this.logoTemporal) {
            this.estado.empresas[empresaId].logo = this.logoTemporal;
            this.estado.empresas[empresaId].icono = null;
            this.logoTemporal = null;
        } else {
            this.estado.empresas[empresaId].icono = nuevoEmoji;
            this.estado.empresas[empresaId].logo = null;
        }

        this.estado.empresas[empresaId].meta.fechaActualizacion = new Date().toISOString();

        this._guardarEmpresas();
        this._actualizarListaEmpresas();
        this._actualizarSelectorPrincipal();
        this.cerrarModalEdicion();
        this._registrarActividad('EMPRESA_EDITADA', `Empresa actualizada: ${nuevoNombre}`);
        this._log('success', `✅ Empresa actualizada: ${nuevoNombre}`);
        this._dispararEvento('empresaActualizada', { empresaId, empresa: this.estado.empresas[empresaId] });
    }

    cerrarModalEdicion() {
        const modal = document.getElementById('grizalumModalEdicion');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    _manejarErrorInicializacion(error) {
        console.error('❌ Error crítico en inicialización:', error);
        
        const contenedor = document.getElementById('companySelector');
        if (contenedor) {
            contenedor.innerHTML = `
                <div style="padding: 1rem; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; color: #dc2626;">
                    <strong>⚠️ Error del Gestor de Empresas</strong>
                    <p>No se pudo inicializar correctamente. Recarga la página.</p>
                    <button onclick="window.location.reload()" style="background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        🔄 Recargar
                    </button>
                </div>
            `;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE TEMAS POR EMPRESA (CONECTADO CON TU CSS)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Aplica el tema visual de la empresa seleccionada
     * @param {Object} empresa - Datos de la empresa
     */
    _aplicarTemaEmpresa(empresa) {
        if (!empresa || !empresa.tema) return;

        // Mapear temas del gestor a tu sistema CSS existente
        const mapaTemaCss = {
            'rojo': 'red',
            'azul': 'blue', 
            'verde': 'green',
            'morado': 'purple',
            'dorado': 'gold'
        };
        
        const temaCss = mapaTemaCss[empresa.tema] || 'gold';
        
        // Aplicar tema global usando tu sistema data-theme
        document.documentElement.setAttribute('data-theme', temaCss);
        
        // Aplicar clase de cambio de tema para transiciones suaves
        document.body.classList.add('theme-changing');
        setTimeout(() => document.body.classList.remove('theme-changing'), 500);
        
        // Actualizar selector de temas si existe
        const selectorTemas = document.querySelectorAll('.theme-option');
        selectorTemas.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === temaCss) {
                option.classList.add('active');
            }
        });

        // Actualizar variables CSS específicas del gestor de empresas
        const temaConfig = this.config.temas[empresa.tema];
        if (temaConfig) {
            document.documentElement.style.setProperty('--grizalum-primary', temaConfig.primary);
            document.documentElement.style.setProperty('--grizalum-secondary', temaConfig.secondary);
        }

        this._log('success', `🎨 Tema aplicado: ${empresa.tema} → ${temaCss}`);
        
        // Guardar preferencia de tema de la empresa
        localStorage.setItem('grizalum_tema_empresa_actual', empresa.tema);
    }

    /**
     * ACTUALIZAR el método _actualizarSelectorPrincipal (BUSCA Y REEMPLAZA)
     */
    _actualizarSelectorPrincipal() {
        const empresa = this._obtenerEmpresaActual();
        if (!empresa) return;

        const avatar = document.getElementById('grizalumEmpresaAvatar');
        const nombre = document.getElementById('grizalumEmpresaNombre');
        const estado = document.getElementById('grizalumEmpresaEstado');
        const metricas = document.getElementById('grizalumEmpresaMetricas');

        // Actualizar contenido
        if (avatar) {
            if (empresa.logo) {
                avatar.innerHTML = `<img src="${empresa.logo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
            } else {
                avatar.textContent = empresa.icono;
            }
        }
        
        if (nombre) nombre.textContent = empresa.nombre;
        if (estado) estado.innerHTML = this._generarEstadoEmpresa(empresa);
        if (metricas) metricas.innerHTML = `💰 ${this.config.regional.moneda} ${empresa.finanzas?.caja?.toLocaleString() || '0'}`;

        // 🎨 APLICAR TEMA DE LA EMPRESA AUTOMÁTICAMENTE
        this._aplicarTemaEmpresa(empresa);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN GLOBAL ULTRA ROBUSTA
// ═══════════════════════════════════════════════════════════════════════════

let gestorEmpresas = null;

function inicializarGestorEmpresas() {
    try {
        if (gestorEmpresas) {
            console.log('🟡 Gestor de Empresas ya inicializado');
            return gestorEmpresas;
        }

        gestorEmpresas = new GestorEmpresasProfesional();
        window.gestorEmpresas = gestorEmpresas;
        
        return gestorEmpresas;
        
    } catch (error) {
        console.error('❌ Error al inicializar Gestor de Empresas:', error);
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

function seleccionarEmpresa(empresaId) {
    if (window.gestorEmpresas) {
        return window.gestorEmpresas.seleccionarEmpresa(empresaId);
    }
    return false;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GestorEmpresasProfesional, inicializarGestorEmpresas };
}
// CONEXIÓN CON SISTEMA DE DATOS DINÁMICOS
window.addEventListener('empresaSeleccionada', (event) => {
    if (window.actualizarMetricas) {
        setTimeout(() => window.actualizarMetricas(), 100);
    }
    if (window.actualizarGraficos) {
        setTimeout(() => window.actualizarGraficos(), 200);
    }
});

// CONEXIÓN GLOBAL PARA CAMBIO DE EMPRESA
window.changeCompany = function(empresaId) {
    if (window.cambiarEmpresaActiva) {
        window.cambiarEmpresaActiva(empresaId);
    }
    
};

// Función corregida para el botón editar
// Función corregida para el botón editar
function editarEmpresaActual(empresaId) {
    console.log('📝 Intentando editar empresa:', empresaId);
    
    if (window.formularioEmpresas && typeof window.formularioEmpresas.editarEmpresa === 'function') {
        window.formularioEmpresas.editarEmpresa(empresaId);
    } else {
        console.error('❌ formularioEmpresas.editarEmpresa no disponible');
        alert('El editor de empresas no está listo. Recarga la página.');
    }
}
console.log(`
🏢 ═══════════════════════════════════════════════════════════════════════════════
   GRIZALUM GESTOR DE EMPRESAS ULTRA PROFESIONAL v3.0 - CORREGIDO
   Sistema Empresarial Premium para el Mercado Peruano
🏢 ═══════════════════════════════════════════════════════════════════════════════

✅ FUNCIONALIDADES COMPLETAMENTE OPERATIVAS:
   🎨 Selector de temas ARREGLADO (rojo, azul, verde, morado, dorado)
   ✏️ Edición básica de empresas FUNCIONAL
   📝 Creación de nuevas empresas FUNCIONAL
   📷 Upload de logos personalizados FUNCIONAL
   🎭 Selector de emojis FUNCIONAL
   💾 Persistencia automática FUNCIONAL
   📱 Diseño responsive FUNCIONAL

🛠️ API PRINCIPAL:
   • gestorEmpresas.seleccionarEmpresa(id)
   • gestorEmpresas.obtenerEmpresaActual()
   • gestorEmpresas.obtenerTodasLasEmpresas()
   • gestorEmpresas.alternarLista()

🏢 ═══════════════════════════════════════════════════════════════════════════════
`);
