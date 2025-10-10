/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        GRIZALUM ENTERPRISE SUITE                              ║
 * ║                   GESTOR DE EMPRESAS ULTRA PROFESIONAL                       ║
 * ║                          Versión 4.0 UNIFICADO - 2025                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║ CARACTERÍSTICAS:                                                              ║
 * ║ ✅ Sistema completo de gestión de empresas                                   ║
 * ║ ✅ Crear, editar y eliminar empresas                                         ║
 * ║ ✅ Sin empresas de prueba (empieza en 0)                                     ║
 * ║ ✅ Integración con onboarding automático                                     ║
 * ║ ✅ Personalización completa de colores y modos visuales                      ║
 * ║ ✅ Compatible con todos los módulos existentes                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

class GestorEmpresasUnificado {
    constructor() {
        this.config = {
            version: '4.0.0',
            componente: 'GestorEmpresasUnificado',
            debug: false,
            
            maxEmpresas: 50,
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

        // Editor integrado
        this.empresaEditando = null;
        this.logoTemporal = null;
        this.emojiSeleccionado = null;
        this.coloresTemp = {
            ingresos: '#d4af37',
            gastos: '#ff6b35',
            utilidad: '#2ecc71',
            crecimiento: '#9b59b6',
            tematica: '#d4af37'
        };

        this.actividades = [];
        this.cache = new Map();
        
        this._inicializar();
    }

    async _inicializar() {
        try {
            this._log('info', 'Iniciando Gestor de Empresas GRIZALUM v4.0 Unificado...');
            
            await this._cargarConfiguracion();
            await this._cargarEmpresas();
            await this._cargarActividades();
            
            this._crearEstilos();
            this._inyectarEstilosModal();
            this._renderizarInterfaz();
            this._configurarEventos();
            this._iniciarSincronizacion();
            
            if (Object.keys(this.estado.empresas).length > 0) {
                this._seleccionarEmpresaInicial();
                this._calcularMetricas();
            } else {
                this._log('info', 'No hay empresas registradas. Sistema listo para crear la primera empresa.');
            }
            
            this.estado.inicializado = true;
            this._log('success', 'Gestor de Empresas inicializado exitosamente');
            
            this._dispararEvento('gestorEmpresasListo', { version: this.config.version });
            
        } catch (error) {
            this._log('error', 'Error crítico al inicializar:', error);
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
                this.estado.empresas = {};
                this._log('info', 'Sin empresas registradas. Sistema limpio.');
            }
            
            this._validarIntegridadEmpresas();
            
        } catch (error) {
            this._log('error', 'Error cargando empresas:', error);
            this.estado.empresas = {};
        }
    }

    _crearEstilos() {
        const estilosId = 'grizalum-gestor-empresas-styles';
        
        if (document.getElementById(estilosId)) return;
        
        const estilos = document.createElement('style');
        estilos.id = estilosId;
        estilos.textContent = `
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
            }
            
            .grizalum-btn-nueva:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
            }
            
            .grizalum-empresas-grid {
                max-height: 360px;
                overflow-y: auto;
                padding: 0.75rem;
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
            }
            
            .grizalum-empresa-card:hover {
                background: var(--grizalum-bg-secondary);
                transform: translateX(5px);
                border-color: var(--grizalum-border);
            }
            
            .grizalum-empresa-card.active {
                background: linear-gradient(135deg, var(--grizalum-primary)15 0%, var(--grizalum-secondary)08 100%);
                border-color: var(--grizalum-primary);
            }
            
            .grizalum-card-avatar {
                width: 45px;
                height: 45px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                flex-shrink: 0;
            }
            
            .grizalum-card-info {
                flex: 1;
            }
            
            .grizalum-card-nombre {
                font-weight: 700;
                color: var(--grizalum-text);
                font-size: 0.95rem;
            }
            
            .grizalum-card-actions {
                display: flex;
                gap: 0.5rem;
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
                background: var(--grizalum-bg);
                color: var(--grizalum-text-light);
            }
            
            .grizalum-action-btn:hover {
                transform: scale(1.1);
            }
            
            .grizalum-list-footer {
                padding: 1.25rem;
                background: var(--grizalum-bg-secondary);
                border-top: 1px solid var(--grizalum-border);
                text-align: center;
            }
            
            @media (max-width: 768px) {
                .grizalum-empresas-list {
                    width: 360px;
                }
            }
        `;
        
        document.head.appendChild(estilos);
    }

    _inyectarEstilosModal() {
        if (document.getElementById('grizalum-modal-css')) return;
        
        const link = document.createElement('link');
        link.id = 'grizalum-modal-css';
        link.rel = 'stylesheet';
        link.href = 'src/assets/css/gestor-empresas-modal.css';
        document.head.appendChild(link);
    }

    _renderizarInterfaz() {
        const contenedor = document.getElementById('companySelector');
        if (!contenedor) {
            this._log('error', 'No se encontró el contenedor #companySelector');
            return;
        }

        contenedor.innerHTML = this._generarHTMLSelector();
        this._actualizarListaEmpresas();
    }

    _generarHTMLSelector() {
        const empresaActual = this._obtenerEmpresaActual();
        const totalCaja = this._calcularTotalCaja();
        const totalEmpresas = Object.keys(this.estado.empresas).length;

        if (totalEmpresas === 0) {
            return `
                <div class="grizalum-empresas-container">
                    <div class="grizalum-empresa-selector" onclick="gestorEmpresas.abrirModalNuevaEmpresa()">
                        <div class="grizalum-empresa-info">
                            <div class="grizalum-empresa-avatar">
                                🏢
                            </div>
                            <div class="grizalum-empresa-details">
                                <div class="grizalum-empresa-nombre">Sin empresas</div>
                                <div class="grizalum-empresa-estado">Click para crear tu primera empresa</div>
                            </div>
                        </div>
                        <div class="grizalum-dropdown-arrow">
                            <i class="fas fa-plus"></i>
                        </div>
                    </div>
                </div>
            `;
        }

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
                        </div>
                    </div>
                    <div class="grizalum-dropdown-arrow" id="grizalumDropdownArrow">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>

                <div class="grizalum-empresas-list" id="grizalumEmpresasList">
                    <div class="grizalum-list-header">
                        <h4 class="grizalum-list-title">Mis Empresas</h4>
                        <button class="grizalum-btn-nueva" onclick="gestorEmpresas.abrirModalNuevaEmpresa()">
                            <i class="fas fa-plus"></i>
                            Nueva
                        </button>
                    </div>
                    
                    <div class="grizalum-empresas-grid" id="grizalumEmpresasGrid"></div>
                    
                                        <div class="grizalum-list-footer">
                        <div style="font-size: 1.1rem; font-weight: 800; color: var(--grizalum-primary); margin-bottom: 8px;">
                           💼 ${totalEmpresas} empresa${totalEmpresas !== 1 ? 's' : ''} activa${totalEmpresas !== 1 ? 's' : ''}
                     </div>
                      <div style="font-size: 0.9rem; color: var(--grizalum-text-light); font-style: italic;">
                        ${this._obtenerMensajeMotivacional()}
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
            .forEach(([id, empresa]) => {
                const card = this._crearTarjetaEmpresa(id, empresa);
                grid.appendChild(card);
            });
    }

    _crearTarjetaEmpresa(id, empresa) {
        const esActiva = this.estado.empresaActual === id;
        const card = document.createElement('div');
        
        card.className = `grizalum-empresa-card ${esActiva ? 'active' : ''}`;
        card.dataset.empresaId = id;
        
        const temaEmpresa = this.config.temas[empresa.tema] || this.config.temas.rojo;
        
        card.innerHTML = `
            <div class="grizalum-card-avatar" style="background: linear-gradient(135deg, ${temaEmpresa.primary} 0%, ${temaEmpresa.secondary} 100%);">
                ${empresa.logo ? `<img src="${empresa.logo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">` : empresa.icono}
            </div>
            <div class="grizalum-card-info">
                <div class="grizalum-card-nombre">${empresa.nombre}</div>
                <div style="font-size: 0.75rem; font-weight: 600;">
                  ${this._generarBadgeEstado(empresa.estado)}
             </div>
            </div>
            <div class="grizalum-card-actions">
                <button class="grizalum-action-btn" onclick="event.stopPropagation(); gestorEmpresas.editarEmpresa('${id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="grizalum-action-btn" onclick="event.stopPropagation(); gestorEmpresas.confirmarEliminarEmpresa('${id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.grizalum-card-actions')) {
                this.seleccionarEmpresa(id);
            }
        });
        
        return card;
    }

    // ═══════════════════════════════════════════════════════════════
    // FUNCIONES PRINCIPALES
    // ═══════════════════════════════════════════════════════════════

    seleccionarEmpresa(empresaId) {
        if (!this.estado.empresas[empresaId]) {
            this._log('error', `Empresa no encontrada: ${empresaId}`);
            return false;
        }

        const empresa = this.estado.empresas[empresaId];
        this.estado.empresaActual = empresaId;
        
        this._aplicarColoresEmpresa(empresaId);
        this._aplicarModoVisualEmpresa(empresaId);
        
        this._actualizarSelectorPrincipal();
        this._actualizarTarjetasActivas();
        this._cerrarLista();
        
        this._dispararEvento('grizalumCompanyChanged', {
            companyId: empresaId,
            company: {
                id: empresaId,
                name: empresa.nombre,
                data: empresa
            }
        });
        
        if (window.actualizarInterfazCompleta) {
            setTimeout(() => window.actualizarInterfazCompleta(), 100);
        }
        
        this._registrarActividad('EMPRESA_SELECCIONADA', `Empresa seleccionada: ${empresa.nombre}`);
        this._calcularMetricas();
        
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

    // ═══════════════════════════════════════════════════════════════
    // CREAR NUEVA EMPRESA
    // ═══════════════════════════════════════════════════════════════

    abrirModalNuevaEmpresa() {
        this._cerrarLista();
        
        const modal = document.createElement('div');
        modal.className = 'grizalum-modal-editor';
        modal.id = 'grizalumModalNuevaEmpresa';

        modal.innerHTML = `
            <div class="grizalum-modal-contenido">
                <div class="grizalum-modal-header">
                    <div class="grizalum-modal-titulo">
                        <div class="grizalum-modal-icono">➕</div>
                        <div>
                            <h2>Crear Nueva Empresa</h2>
                            <p>Configura tu empresa en minutos</p>
                        </div>
                    </div>
                    <button class="grizalum-btn-cerrar" onclick="gestorEmpresas.cerrarModal()">✕</button>
                </div>

                <div class="grizalum-modal-body">
                    <div class="grizalum-seccion">
                        <div class="grizalum-seccion-titulo">Información Básica</div>
                        
                        <div class="grizalum-campo">
                            <label class="grizalum-label">Nombre de la Empresa *</label>
                            <input type="text" id="nuevaEmpresaNombre" class="grizalum-input" 
                                   placeholder="Ej: Mi Empresa S.A.C." maxlength="80">
                        </div>

                        <div class="grizalum-campo">
                            <label class="grizalum-label">RUC (Opcional)</label>
                            <input type="text" id="nuevaEmpresaRuc" class="grizalum-input" 
                                   placeholder="20123456789" maxlength="11">
                        </div>
                    </div>

                    <div class="grizalum-seccion">
                        <div class="grizalum-seccion-titulo">🎨 Color Temático de la Empresa</div>
                        <p style="color: var(--modal-texto-terciario); font-size: 13px; margin-bottom: 12px;">
                            Este será el color principal de tu empresa
                        </p>
                        
                        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px;">
                            <div onclick="gestorEmpresas.seleccionarTemaNew('rojo')" style="cursor: pointer; padding: 16px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 10px; text-align: center; color: white; font-weight: 700; transition: all 0.3s ease;" class="tema-selector">
                                🔴 Rojo
                            </div>
                            <div onclick="gestorEmpresas.seleccionarTemaNew('azul')" style="cursor: pointer; padding: 16px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 10px; text-align: center; color: white; font-weight: 700; transition: all 0.3s ease;" class="tema-selector">
                                🔵 Azul
                            </div>
                            <div onclick="gestorEmpresas.seleccionarTemaNew('verde')" style="cursor: pointer; padding: 16px; background: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius: 10px; text-align: center; color: white; font-weight: 700; transition: all 0.3s ease;" class="tema-selector">
                                🟢 Verde
                            </div>
                            <div onclick="gestorEmpresas.seleccionarTemaNew('morado')" style="cursor: pointer; padding: 16px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border-radius: 10px; text-align: center; color: white; font-weight: 700; transition: all 0.3s ease;" class="tema-selector">
                                🟣 Morado
                            </div>
                            <div onclick="gestorEmpresas.seleccionarTemaNew('dorado')" style="cursor: pointer; padding: 16px; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); border-radius: 10px; text-align: center; color: white; font-weight: 700; transition: all 0.3s ease;" class="tema-selector">
                                🟡 Dorado
                            </div>
                        </div>

                        <style>
                            .tema-selector:hover {
                                transform: translateY(-3px);
                                box-shadow: 0 8px 20px rgba(0,0,0,0.4);
                            }
                            .tema-selector.selected {
                                box-shadow: 0 0 0 3px white, 0 0 0 5px currentColor;
                                transform: scale(1.05);
                            }
                        </style>
                    </div>

                    <div class="grizalum-seccion">
                        <div class="grizalum-seccion-titulo">Identidad Visual</div>
                        
                        <div class="grizalum-tabs" style="display: flex; border-bottom: 2px solid var(--modal-borde); margin-bottom: 20px;">
                            <div class="tab-btn active" data-tab="emoji" onclick="gestorEmpresas.cambiarTabNew('emoji')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; font-weight: 700; border-bottom: 3px solid #dc2626; color: var(--modal-texto-principal);">
                                😀 Emoji
                            </div>
                            <div class="tab-btn" data-tab="logo" onclick="gestorEmpresas.cambiarTabNew('logo')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; font-weight: 700; color: var(--modal-texto-terciario);">
                                🖼️ Logo
                            </div>
                        </div>

                        <div class="tab-content active" id="tabEmojiNew">
                            <div class="grizalum-emoji-grid">
                                ${['🏢', '🏭', '🏪', '🏬', '🏦', '🍽️', '💻', '🔥', '⚙️', '🌾', '🐄', '🐔', '⛏️', '🏗️', '💎', '⚡', '🚀', '💡', '🎯', '💰'].map(emoji => `
                                    <div class="grizalum-emoji-item" onclick="gestorEmpresas.seleccionarEmojiNueva('${emoji}')">${emoji}</div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="tab-content" id="tabLogoNew" style="display: none;">
                            <input type="file" id="logoInputNew" accept="image/*" style="display:none" onchange="gestorEmpresas.subirLogoNueva(event)">
                            <div onclick="document.getElementById('logoInputNew').click()" style="padding: 40px; border: 2px dashed var(--modal-borde); border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: rgba(255,255,255,0.02);">
                                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: var(--modal-texto-terciario); margin-bottom: 12px;"></i>
                                <div style="font-weight: 700; color: var(--modal-texto-principal); margin-bottom: 8px;">Subir logo de tu empresa</div>
                                <small style="color: var(--modal-texto-terciario);">PNG, JPG (máx 2MB)</small>
                            </div>
                            <div id="logoPreviewNew" style="display: none; margin-top: 16px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; align-items: center; gap: 16px;">
                                <img id="logoImgNew" style="width: 80px; height: 80px; object-fit: contain; border-radius: 8px; background: white;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 700; color: var(--modal-texto-principal);">Logo cargado</div>
                                    <small style="color: var(--modal-texto-terciario);">Se guardará al crear la empresa</small>
                                </div>
                                <button onclick="event.stopPropagation(); gestorEmpresas.eliminarLogoNueva()" style="padding: 8px 16px; background: rgba(239, 68, 68, 0.2); color: #ef4444; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                    <i class="fas fa-trash"></i> Quitar
                                </button>
                            </div>
                        </div>
                    </div>

                <div class="grizalum-modal-footer">
                    <button class="grizalum-btn grizalum-btn-cancelar" onclick="gestorEmpresas.cerrarModal()">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button class="grizalum-btn grizalum-btn-guardar" onclick="gestorEmpresas.crearNuevaEmpresa()">
                        <i class="fas fa-check"></i> Crear Empresa
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        
        this.emojiSeleccionado = '🏢';
        document.querySelector('.grizalum-emoji-item')?.classList.add('selected');
    }

    seleccionarEmojiNueva(emoji) {
        document.querySelectorAll('.grizalum-emoji-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.target.classList.add('selected');
        this.emojiSeleccionado = emoji;
    }
    seleccionarTemaNew(tema) {
        this.temaNuevo = tema;
        
        // Actualizar estilos visuales
        document.querySelectorAll('.tema-selector').forEach(el => {
            el.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        console.log('✅ Tema seleccionado:', tema);
    }

    cambiarTabNew(tab) {
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.borderBottom = 'none';
            btn.style.color = 'var(--modal-texto-terciario)';
        });
        
        const btnActivo = document.querySelector(`[data-tab="${tab}"]`);
        if (btnActivo) {
            btnActivo.classList.add('active');
            btnActivo.style.borderBottom = '3px solid #dc2626';
            btnActivo.style.color = 'var(--modal-texto-principal)';
        }
        
        // Mostrar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        const contentActivo = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}New`);
        if (contentActivo) {
            contentActivo.classList.add('active');
            contentActivo.style.display = 'block';
        }
    }

    subirLogoNueva(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('❌ El logo no puede superar 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.logoTemporal = e.target.result;
            
            const preview = document.getElementById('logoPreviewNew');
            const img = document.getElementById('logoImgNew');
            
            img.src = e.target.result;
            preview.style.display = 'flex';
            
            console.log('✅ Logo cargado temporalmente');
        };
        reader.readAsDataURL(file);
    }

    eliminarLogoNueva() {
        this.logoTemporal = null;
        
        const preview = document.getElementById('logoPreviewNew');
        const input = document.getElementById('logoInputNew');
        
        preview.style.display = 'none';
        input.value = '';
        
        console.log('🗑️ Logo eliminado');
    }

    crearNuevaEmpresa() {
        const nombre = document.getElementById('nuevaEmpresaNombre').value.trim();
        const ruc = document.getElementById('nuevaEmpresaRuc').value.trim();

        if (!nombre || nombre.length < 3) {
            alert('❌ El nombre debe tener al menos 3 caracteres');
            return;
        }

        const empresaId = this._generarIdEmpresa(nombre);
        
        const nuevaEmpresa = {
            id: empresaId,
            nombre: nombre,
            icono: this.emojiSeleccionado || '🏢',
            logo: this.logoTemporal || null,
            tema: this.temaNuevo || 'rojo',
            estado: 'Operativo',
            categoria: 'General',
            
            legal: {
                ruc: ruc || '',
                razonSocial: nombre,
                regimen: 'General',
                tipoEmpresa: 'S.A.C.'
            },
            
            ubicacion: {
                direccion: '',
                distrito: '',
                provincia: 'Lima',
                departamento: 'Lima'
            },
            
            contacto: {
                telefono: '',
                email: '',
                web: ''
            },
            
            finanzas: {
                caja: 0,
                ingresos: 0,
                gastos: 0,
                utilidadNeta: 0,
                margenNeto: 0,
                roi: 0
            },
            
            coloresPersonalizados: {
                ingresos: '#d4af37',
                gastos: '#ff6b35',
                utilidad: '#2ecc71',
                crecimiento: '#9b59b6',
                tematica: '#d4af37'
            },
            
            modoVisual: 'oscuro',
            
            meta: {
                fechaCreacion: new Date().toISOString(),
                fechaActualizacion: new Date().toISOString(),
                version: '1.0',
                activa: true
            }
        };

        this.estado.empresas[empresaId] = nuevaEmpresa;
        this._guardarEmpresas();
        
        this.cerrarModal();
        this._renderizarInterfaz();
        this.seleccionarEmpresa(empresaId);
        
        this._registrarActividad('EMPRESA_CREADA', `Nueva empresa creada: ${nombre}`);
        
        // ✅ INTEGRACIÓN CON ONBOARDING AUTOMÁTICO
        setTimeout(() => {
            if (window.onboarding) {
                console.log('🎯 Iniciando onboarding automático para:', nombre);
                onboarding.iniciar(empresaId);
            } else {
                alert(`✅ Empresa "${nombre}" creada exitosamente`);
            }
        }, 500);
    }

    _generarIdEmpresa(nombre) {
        const base = nombre
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 30);
        
        let id = base;
        let contador = 1;
        
        while (this.estado.empresas[id]) {
            id = `${base}-${contador}`;
            contador++;
        }
        
        return id;
    }

    // ═══════════════════════════════════════════════════════════════
    // EDITAR EMPRESA
    // ═══════════════════════════════════════════════════════════════

    editarEmpresa(empresaId) {
        const empresa = this.estado.empresas[empresaId];
        if (!empresa) {
            alert('❌ Empresa no encontrada');
            return;
        }

        this.empresaEditando = empresaId;
        this.logoTemporal = empresa.logo || null;
        this.emojiSeleccionado = empresa.icono || '🏢';
        this.coloresTemp = empresa.coloresPersonalizados || {
            ingresos: '#d4af37',
            gastos: '#ff6b35',
            utilidad: '#2ecc71',
            crecimiento: '#9b59b6',
            tematica: '#d4af37'
        };
        this.modoVisual = empresa.modoVisual || 'oscuro';
        
        this._mostrarModalEditar(empresa);
    }

    _mostrarModalEditar(empresa) {
        const emojis = ['🏢', '🏭', '🏪', '🏬', '🏦', '🏥', '🚚', '🍽️', '💻', '🔥', '⚙️', '🌾', '🐄', '🐟', '⛏️', '🏗️', '💎', '⚡', '🚀', '💡', '🎯', '💰', '🍕', '☕', '🚗', '✈️', '🏀', '🎮', '📱', '🔧'];

        const modal = document.createElement('div');
        modal.className = 'grizalum-modal-editor';
        modal.id = 'grizalumModalEditor';

        modal.innerHTML = `
            <div class="grizalum-modal-contenido">
                <div class="grizalum-modal-header">
                    <div class="grizalum-modal-titulo">
                        <div class="grizalum-modal-icono">${empresa.icono || '🏢'}</div>
                        <div>
                            <h2>Editar Empresa</h2>
                            <p>${empresa.nombre}</p>
                        </div>
                    </div>
                    <button class="grizalum-btn-cerrar" onclick="gestorEmpresas.cerrarModal()">✕</button>
                </div>

                <div class="grizalum-modal-body">
                    <div class="grizalum-seccion">
                        <div class="grizalum-seccion-titulo">Información Básica</div>
                        
                        <div class="grizalum-campo">
                            <label class="grizalum-label">Nombre de la Empresa</label>
                            <input type="text" id="empresaNombre" class="grizalum-input" value="${empresa.nombre}" maxlength="80">
                        </div>

                        <div class="grizalum-campo">
                            <label class="grizalum-label">RUC (Opcional)</label>
                            <input type="text" id="empresaRuc" class="grizalum-input" value="${empresa.legal?.ruc || ''}" maxlength="11">
                        </div>
                    </div>

                   <div class="grizalum-seccion">
    <div class="grizalum-seccion-titulo">🎨 Paletas de Colores</div>
    <p style="color: var(--modal-texto-terciario); font-size: 13px; margin-bottom: 16px;">
        Elige una paleta rápida o personaliza cada color manualmente
    </p>
    
    <div style="margin-bottom: 20px;">
        <div style="font-weight: 600; color: var(--modal-texto-principal); margin-bottom: 12px; font-size: 14px;">
            🎨 Paletas Sólidas
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('dorado-clasico')" 
                    style="background: #d4af37; color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 13px; transition: all 0.3s ease;">
                <div>✨ Dorado</div>
                <small style="opacity: 0.8; font-size: 11px;">Clásico</small>
            </button>
            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('azul-corporativo')"
                    style="background: #2563eb; color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 13px; transition: all 0.3s ease;">
                <div>💼 Azul</div>
                <small style="opacity: 0.8; font-size: 11px;">Corporativo</small>
            </button>
            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('verde-fresco')"
                    style="background: #10b981; color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 13px; transition: all 0.3s ease;">
                <div>🌿 Verde</div>
                <small style="opacity: 0.8; font-size: 11px;">Fresco</small>
            </button>
        </div>
    </div>

    <div>
        <div style="font-weight: 600; color: var(--modal-texto-principal); margin-bottom: 12px; font-size: 14px;">
            🌈 Paletas Mixtas (Degradados)
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('sunset-pro')" 
                    style="background: linear-gradient(135deg, #ff6b6b 0%, #f39c12 100%); color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 13px; transition: all 0.3s ease;">
                <div>🌅 Sunset</div>
                <small style="opacity: 0.8; font-size: 11px;">Rojo-Naranja</small>
            </button>
            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('ocean-pro')"
                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 13px; transition: all 0.3s ease;">
                <div>🌊 Ocean</div>
                <small style="opacity: 0.8; font-size: 11px;">Azul-Morado</small>
            </button>
            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('forest-pro')"
                    style="background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 13px; transition: all 0.3s ease;">
                <div>🌲 Forest</div>
                <small style="opacity: 0.8; font-size: 11px;">Verde-Lima</small>
            </button>
        </div>
    </div>

    <style>
        .grizalum-paleta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }
    </style>
</div>

                    <div class="grizalum-seccion">
                        <div class="grizalum-seccion-titulo">🌓 Modo de Visualización</div>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
                            <button onclick="gestorEmpresas.aplicarModoVisual('oscuro')" 
                                    style="background: linear-gradient(135deg, #1a1b23 0%, #16213e 100%); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                🌙 Modo Oscuro
                            </button>
                            <button onclick="gestorEmpresas.aplicarModoVisual('claro')"
                                    style="background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%); color: #1f2937; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                ☀️ Modo Claro
                            </button>
                            <button onclick="gestorEmpresas.aplicarModoVisual('neutro')"
                                    style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                ⚖️ Modo Neutro
                            </button>
                        </div>
                    </div>

                    <div class="grizalum-seccion">
                        <div class="grizalum-seccion-titulo">Identidad Visual</div>
                        
                        <div style="display: flex; border-bottom: 2px solid var(--modal-borde); margin-bottom: 20px;">
                            <div class="tab-edit-btn active" data-tab="emoji" onclick="gestorEmpresas.cambiarTabEdit('emoji')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; font-weight: 700; border-bottom: 3px solid var(--color-primario); color: var(--modal-texto-principal); transition: all 0.3s ease;">
                                😀 Emoji
                            </div>
                            <div class="tab-edit-btn" data-tab="logo" onclick="gestorEmpresas.cambiarTabEdit('logo')" style="flex: 1; padding: 12px; text-align: center; cursor: pointer; font-weight: 700; color: var(--modal-texto-terciario); transition: all 0.3s ease;">
                                🖼️ Logo Premium
                            </div>
                        </div>

                        <div class="tab-edit-content active" id="tabEmojiEdit">
                            <div class="grizalum-emoji-grid">
                                ${emojis.map(emoji => `
                                    <div class="grizalum-emoji-item ${emoji === empresa.icono ? 'selected' : ''}" 
                                         onclick="gestorEmpresas.seleccionarEmoji('${emoji}')">${emoji}</div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="tab-edit-content" id="tabLogoEdit" style="display: none;">
                            <input type="file" id="logoInputEdit" accept="image/*" style="display:none" onchange="gestorEmpresas.subirLogoEdit(event)">
                            
                            <div onclick="document.getElementById('logoInputEdit').click()" style="padding: 40px; border: 2px dashed var(--modal-borde); border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: rgba(255,255,255,0.02); position: relative; overflow: hidden;">
                                <div style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;">
                                    ⭐ PREMIUM
                                </div>
                                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: var(--modal-texto-terciario); margin-bottom: 12px; display: block;"></i>
                                <div style="font-weight: 700; color: var(--modal-texto-principal); margin-bottom: 8px; font-size: 16px;">Subir logo personalizado</div>
                                <small style="color: var(--modal-texto-terciario); display: block;">PNG, JPG, SVG (máx 2MB)</small>
                                <small style="color: var(--modal-texto-terciario); display: block; margin-top: 8px; opacity: 0.7;">Recomendado: 500x500px fondo transparente</small>
                            </div>

                            ${empresa.logo || this.logoTemporal ? `
                                <div id="logoPreviewEdit" style="display: flex; margin-top: 20px; padding: 20px; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border-radius: 12px; align-items: center; gap: 20px; border: 1px solid var(--modal-borde);">
                                    <div style="width: 80px; height: 80px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 10px;">
                                        <img id="logoImgEdit" src="${empresa.logo || this.logoTemporal}" style="width: 100%; height: 100%; object-fit: contain;">
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 700; color: var(--modal-texto-principal); font-size: 15px; margin-bottom: 4px;">✅ Logo cargado</div>
                                        <small style="color: var(--modal-texto-terciario); display: block;">Se guardará al confirmar cambios</small>
                                        <small style="color: var(--modal-texto-terciario); display: block; margin-top: 4px; opacity: 0.7;">Aparecerá en lugar del emoji</small>
                                    </div>
                                    <button onclick="event.stopPropagation(); gestorEmpresas.eliminarLogoEdit()" style="padding: 10px 20px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%); color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; cursor: pointer; font-weight: 700; transition: all 0.3s ease;">
                                        <i class="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <style>
                            .tab-edit-btn:hover {
                                background: rgba(255,255,255,0.05);
                            }
                            .tab-edit-btn.active {
                                border-bottom: 3px solid var(--color-primario) !important;
                                color: var(--modal-texto-principal) !important;
                            }
                            [onclick*="logoInputEdit"]:hover {
                                border-color: var(--color-primario);
                                background: rgba(255,255,255,0.05);
                                transform: scale(1.01);
                            }
                        </style>
                    </div>

                    <div class="grizalum-seccion">
                        <div class="grizalum-seccion-titulo">Colores de Métricas</div>
                        
                        ${this._generarColorPicker('Ingresos', 'ingresos', this.coloresTemp.ingresos, '💰')}
                        ${this._generarColorPicker('Gastos', 'gastos', this.coloresTemp.gastos, '💸')}
                        ${this._generarColorPicker('Utilidad', 'utilidad', this.coloresTemp.utilidad, '📈')}
                        ${this._generarColorPicker('Crecimiento', 'crecimiento', this.coloresTemp.crecimiento, '🚀')}
                        ${this._generarColorPicker('Temática', 'tematica', this.coloresTemp.tematica, '🎨')}
                    </div>

                    <div class="grizalum-seccion">
                        <div class="grizalum-seccion-titulo">Vista Previa</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; text-align: center;">
                                <div style="font-size: 12px; color: var(--modal-texto-terciario); margin-bottom: 8px;">💰 Ingresos</div>
                                <div style="font-size: 24px; font-weight: 800; color: ${this.coloresTemp.ingresos};">
                                    S/. ${(empresa.finanzas?.ingresos || 0).toLocaleString()}
                                </div>
                            </div>
                            <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; text-align: center;">
                                <div style="font-size: 12px; color: var(--modal-texto-terciario); margin-bottom: 8px;">💸 Gastos</div>
                                <div style="font-size: 24px; font-weight: 800; color: ${this.coloresTemp.gastos};">
                                    S/. ${(empresa.finanzas?.gastos || 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grizalum-modal-footer">
                    <button class="grizalum-btn grizalum-btn-cancelar" onclick="gestorEmpresas.cerrarModal()">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button class="grizalum-btn grizalum-btn-guardar" onclick="gestorEmpresas.guardarEdicion()">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    _generarColorPicker(nombre, id, color, emoji) {
       // Sistema especial para Temática con degradado mixto
        if (id === 'tematica') {
            const color1 = this.coloresTemp.tematica || '#d4af37';
            const color2 = this.coloresTemp.tematicaSecundario || '#b8941f';
            
            // Detectar Safari para usar sistema alternativo
            const esSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
            
            return `
                <div style="padding: 20px; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--modal-borde);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                        <div style="font-weight: 700; color: var(--modal-texto-principal); font-size: 16px;">
                            ${emoji} ${nombre}
                        </div>
                        <div style="padding: 4px 12px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border-radius: 20px; font-size: 11px; font-weight: 700;">
                            🌈 DEGRADADO MIXTO
                        </div>
                    </div>
                    
                    <p style="color: var(--modal-texto-terciario); font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
                        Crea un degradado único combinando 2 colores. Este será el color principal de tu empresa.
                    </p>
                    
                    <!-- COLOR 1: Principal -->
                    <div style="margin-bottom: 16px;">
                        <label style="font-size: 13px; color: var(--modal-texto-secundario); display: block; margin-bottom: 8px; font-weight: 600;">
                            🎨 Color Principal (Inicio del degradado)
                        </label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 50px; height: 50px; background: ${color1}; border-radius: 10px; cursor: pointer; border: 3px solid var(--modal-borde); transition: all 0.3s ease; box-shadow: 0 4px 12px ${color1}40;" 
                                 onclick="${esSafari ? `gestorEmpresas.abrirPaletaPremium('tematica', '${color1}')` : `document.getElementById('colortematica').click()`}"
                                 onmouseover="this.style.transform='scale(1.1)'; this.style.borderColor='${color1}';"
                                 onmouseout="this.style.transform='scale(1)'; this.style.borderColor='var(--modal-borde)';">
                            </div>
                            ${esSafari ? 
                                `<input type="text" id="hextematica" value="${color1}" maxlength="7" 
                                        placeholder="#RRGGBB"
                                        style="flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 2px solid var(--modal-borde); border-radius: 8px; color: var(--modal-texto-principal); font-family: 'Courier New', monospace; font-size: 14px; font-weight: 700; transition: all 0.3s ease;"
                                        oninput="gestorEmpresas.cambiarColorManualConPreview('tematica', this.value)"
                                        onfocus="this.style.borderColor='${color1}'"
                                        onblur="this.style.borderColor='var(--modal-borde)'">` :
                                `<div style="flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 2px solid var(--modal-borde); border-radius: 8px;">
                                    <div style="font-family: 'Courier New', monospace; color: var(--modal-texto-principal); font-size: 14px; font-weight: 700;" id="hextematica">${color1}</div>
                                 </div>`
                            }
                            ${!esSafari ? `<input type="color" id="colortematica" value="${color1}" style="display:none" onchange="gestorEmpresas.cambiarColorConPreview('tematica', this.value)">` : ''}
                            <button onclick="gestorEmpresas.abrirPaletaPremium('tematica', '${color1}')" 
                                    style="padding: 12px 16px; background: rgba(255,255,255,0.1); border: 2px solid var(--modal-borde); border-radius: 8px; cursor: pointer; color: var(--modal-texto-principal); font-weight: 700; transition: all 0.3s ease;"
                                    onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='${color1}';"
                                    onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='var(--modal-borde)';">
                                🎨 Paleta
                            </button>
                        </div>
                    </div>

                    <!-- COLOR 2: Secundario -->
                    <div style="margin-bottom: 20px;">
                        <label style="font-size: 13px; color: var(--modal-texto-secundario); display: block; margin-bottom: 8px; font-weight: 600;">
                            🎨 Color Secundario (Fin del degradado)
                        </label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 50px; height: 50px; background: ${color2}; border-radius: 10px; cursor: pointer; border: 3px solid var(--modal-borde); transition: all 0.3s ease; box-shadow: 0 4px 12px ${color2}40;" 
                                 onclick="${esSafari ? `gestorEmpresas.abrirPaletaPremium('tematicaSecundario', '${color2}')` : `document.getElementById('colortematicaSecundario').click()`}"
                                 onmouseover="this.style.transform='scale(1.1)'; this.style.borderColor='${color2}';"
                                 onmouseout="this.style.transform='scale(1)'; this.style.borderColor='var(--modal-borde)';">
                            </div>
                            ${esSafari ? 
                                `<input type="text" id="hextematicaSecundario" value="${color2}" maxlength="7" 
                                        placeholder="#RRGGBB"
                                        style="flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 2px solid var(--modal-borde); border-radius: 8px; color: var(--modal-texto-principal); font-family: 'Courier New', monospace; font-size: 14px; font-weight: 700; transition: all 0.3s ease;"
                                        oninput="gestorEmpresas.cambiarColorManualConPreview('tematicaSecundario', this.value)"
                                        onfocus="this.style.borderColor='${color2}'"
                                        onblur="this.style.borderColor='var(--modal-borde)'">` :
                                `<div style="flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 2px solid var(--modal-borde); border-radius: 8px;">
                                    <div style="font-family: 'Courier New', monospace; color: var(--modal-texto-principal); font-size: 14px; font-weight: 700;" id="hextematicaSecundario">${color2}</div>
                                 </div>`
                            }
                            ${!esSafari ? `<input type="color" id="colortematicaSecundario" value="${color2}" style="display:none" onchange="gestorEmpresas.cambiarColorConPreview('tematicaSecundario', this.value)">` : ''}
                            <button onclick="gestorEmpresas.abrirPaletaPremium('tematicaSecundario', '${color2}')" 
                                    style="padding: 12px 16px; background: rgba(255,255,255,0.1); border: 2px solid var(--modal-borde); border-radius: 8px; cursor: pointer; color: var(--modal-texto-principal); font-weight: 700; transition: all 0.3s ease;"
                                    onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='${color2}';"
                                    onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='var(--modal-borde)';">
                                🎨 Paleta
                            </button>
                        </div>
                    </div>

                    <!-- PREVIEW DEL DEGRADADO -->
                    <div id="previewDegradado" style="padding: 24px; background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%); border-radius: 12px; text-align: center; color: white; font-weight: 700; font-size: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); position: relative; overflow: hidden;">
                        <div style="position: relative; z-index: 1;">
                            ✨ Vista Previa del Degradado
                        </div>
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.1); opacity: 0; transition: opacity 0.3s ease;" 
                             onmouseover="this.style.opacity='1'" 
                             onmouseout="this.style.opacity='0'">
                        </div>
                    </div>
                </div>
            `;
        }
        
        // COLORES NORMALES (no temática)
        const esSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        return `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                <div style="width: 40px; height: 40px; background: ${color}; border-radius: 8px; cursor: pointer; border: 2px solid var(--modal-borde);" 
                     onclick="${esSafari ? `gestorEmpresas.abrirPaletaPremium('${id}', '${color}')` : `document.getElementById('color${id}').click()`}">
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--modal-texto-principal); margin-bottom: 4px;">${emoji} ${nombre}</div>
                    ${esSafari ? 
                        `<input type="text" id="hex${id}" value="${color}" maxlength="7" 
                                style="width: 100%; padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--modal-borde); border-radius: 6px; color: var(--modal-texto-principal); font-family: monospace;"
                                oninput="gestorEmpresas.cambiarColorManualConPreview('${id}', this.value)">` :
                        `<div style="font-size: 13px; color: var(--modal-texto-terciario); font-family: monospace;" id="hex${id}">${color}</div>`
                    }
                </div>
                ${!esSafari ? `<input type="color" id="color${id}" value="${color}" style="display:none" onchange="gestorEmpresas.cambiarColorConPreview('${id}', this.value)">` : ''}
            </div>
        `;
    }
    
    seleccionarEmoji(emoji) {
        document.querySelectorAll('.grizalum-emoji-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.target.classList.add('selected');
        this.emojiSeleccionado = emoji;
    }
    cambiarTabEdit(tab) {
        // Actualizar botones
        document.querySelectorAll('.tab-edit-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.borderBottom = 'none';
            btn.style.color = 'var(--modal-texto-terciario)';
        });
        
        const btnActivo = document.querySelector(`.tab-edit-btn[data-tab="${tab}"]`);
        if (btnActivo) {
            btnActivo.classList.add('active');
            btnActivo.style.borderBottom = '3px solid var(--color-primario)';
            btnActivo.style.color = 'var(--modal-texto-principal)';
        }
        
        // Mostrar contenido
        document.querySelectorAll('.tab-edit-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        const contentActivo = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}Edit`);
        if (contentActivo) {
            contentActivo.classList.add('active');
            contentActivo.style.display = 'block';
        }
    }

    subirLogoEdit(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tamaño
        if (file.size > 2 * 1024 * 1024) {
            alert('❌ El logo no puede superar 2MB\n\nTip: Usa herramientas como TinyPNG para comprimir tu imagen.');
            return;
        }

        // Validar formato
        const formatosValidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!formatosValidos.includes(file.type)) {
            alert('❌ Formato no válido\n\nSolo se aceptan: PNG, JPG, SVG');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.logoTemporal = e.target.result;
            
            // Crear preview si no existe
            let preview = document.getElementById('logoPreviewEdit');
            if (!preview) {
                const container = document.getElementById('tabLogoEdit');
                preview = document.createElement('div');
                preview.id = 'logoPreviewEdit';
                preview.innerHTML = `
                    <div style="width: 80px; height: 80px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 10px;">
                        <img id="logoImgEdit" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: var(--modal-texto-principal); font-size: 15px; margin-bottom: 4px;">✅ Logo cargado</div>
                        <small style="color: var(--modal-texto-terciario); display: block;">Se guardará al confirmar cambios</small>
                    </div>
                    <button onclick="event.stopPropagation(); gestorEmpresas.eliminarLogoEdit()" style="padding: 10px 20px; background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; cursor: pointer; font-weight: 700;">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                `;
                preview.style.cssText = 'display: flex; margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px; align-items: center; gap: 20px; border: 1px solid var(--modal-borde);';
                container.appendChild(preview);
            }
            
            const img = document.getElementById('logoImgEdit');
            img.src = e.target.result;
            preview.style.display = 'flex';
            
            console.log('✅ Logo cargado - Tamaño:', (file.size / 1024).toFixed(2), 'KB');
        };
        reader.readAsDataURL(file);
    }

    eliminarLogoEdit() {
        this.logoTemporal = null;
        
        const preview = document.getElementById('logoPreviewEdit');
        const input = document.getElementById('logoInputEdit');
        
        if (preview) preview.style.display = 'none';
        if (input) input.value = '';
        
        console.log('🗑️ Logo eliminado del editor');
    }

   cambiarColorConPreview(tipo, color) {
        this.coloresTemp[tipo] = color;
        
        const hex = document.getElementById(`hex${tipo}`);
        if (hex) {
            if (hex.tagName === 'INPUT') {
                hex.value = color;
            } else {
                hex.textContent = color;
            }
        }
        
        // Actualizar preview visual del cuadro
        const preview = document.querySelector(`input#color${tipo}`)?.parentElement?.querySelector('div[style*="background"]');
        if (preview) preview.style.background = color;
        
        // Actualizar preview del degradado si es temática
        this.actualizarPreviewDegradado();
    }

    cambiarColorManualConPreview(tipo, valor) {
        // Validar formato hexadecimal
        if (!/^#[0-9A-F]{6}$/i.test(valor)) {
            return;
        }
        
        this.coloresTemp[tipo] = valor;
        
        // Actualizar cuadro de color
        const preview = document.getElementById(`hex${tipo}`)?.parentElement?.parentElement?.querySelector('div[style*="border-radius: 10px"]');
        if (preview) {
            preview.style.background = valor;
            preview.style.boxShadow = `0 4px 12px ${valor}40`;
        }
        
        // Actualizar preview del degradado
        this.actualizarPreviewDegradado();
    }

    actualizarPreviewDegradado() {
        const preview = document.getElementById('previewDegradado');
        if (preview && this.coloresTemp.tematica && this.coloresTemp.tematicaSecundario) {
            preview.style.background = `linear-gradient(135deg, ${this.coloresTemp.tematica} 0%, ${this.coloresTemp.tematicaSecundario} 100%)`;
        }
    }

    abrirPaletaPremium(tipo, colorActual) {
        // Paleta premium con colores profesionales organizados por categorías
        const paletaPremium = {
            'Dorados y Cálidos': ['#d4af37', '#ffd700', '#f1c40f', '#f39c12', '#e67e22', '#d35400'],
            'Rojos y Naranjas': ['#e74c3c', '#c0392b', '#ff6b6b', '#ff4757', '#ff6348', '#ff7675'],
            'Verdes': ['#2ecc71', '#27ae60', '#00b894', '#55efc4', '#10b981', '#059669'],
            'Azules': ['#3498db', '#2980b9', '#0984e3', '#74b9ff', '#2563eb', '#1d4ed8'],
            'Morados': ['#9b59b6', '#8e44ad', '#a29bfe', '#6c5ce7', '#7c3aed', '#6d28d9'],
            'Rosas': ['#e91e63', '#f093fb', '#fd79a8', '#fab1a0', '#ff6b9d', '#c44569'],
            'Grises y Neutros': ['#95a5a6', '#7f8c8d', '#636e72', '#2d3436', '#34495e', '#2c3e50']
        };
        
        let html = `
            <div class="paleta-premium-overlay" onclick="this.remove()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 200000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); animation: fadeIn 0.3s ease;">
                <div onclick="event.stopPropagation()" style="background: var(--modal-fondo-principal); border-radius: 16px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div>
                            <h3 style="margin: 0; color: var(--modal-texto-principal); font-size: 20px;">🎨 Paleta Premium</h3>
                            <p style="margin: 4px 0 0 0; color: var(--modal-texto-terciario); font-size: 13px;">Selecciona un color profesional</p>
                        </div>
                        <button onclick="this.closest('.paleta-premium-overlay').remove()" style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); border: none; color: var(--modal-texto-principal); cursor: pointer; font-size: 20px; transition: all 0.3s ease;"
                                onmouseover="this.style.background='rgba(255,0,0,0.2)'; this.style.transform='rotate(90deg)';"
                                onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='rotate(0deg)';">
                            ✕
                        </button>
                    </div>
        `;
        
        Object.entries(paletaPremium).forEach(([categoria, colores]) => {
            html += `
                <div style="margin-bottom: 24px;">
                    <div style="font-weight: 700; color: var(--modal-texto-principal); margin-bottom: 12px; font-size: 14px;">${categoria}</div>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px;">
                        ${colores.map(color => `
                            <div onclick="gestorEmpresas.seleccionarColorDePaleta('${tipo}', '${color}')" 
                                 style="aspect-ratio: 1; background: ${color}; border-radius: 10px; cursor: pointer; border: 3px solid ${color === colorActual ? 'white' : 'transparent'}; transition: all 0.3s ease; position: relative; box-shadow: 0 4px 12px ${color}40;"
                                 onmouseover="this.style.transform='scale(1.15)'; this.style.boxShadow='0 8px 24px ${color}60';"
                                 onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px ${color}40';"
                                 title="${color}">
                                ${color === colorActual ? '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 20px;">✓</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        html += `
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--modal-borde);">
                        <label style="display: block; font-weight: 700; color: var(--modal-texto-principal); margin-bottom: 8px; font-size: 14px;">
                            ✏️ O ingresa un color personalizado:
                        </label>
                        <div style="display: flex; gap: 12px;">
                            <input type="text" id="colorPersonalizado${tipo}" placeholder="#RRGGBB" maxlength="7" 
                                   style="flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 2px solid var(--modal-borde); border-radius: 8px; color: var(--modal-texto-principal); font-family: 'Courier New', monospace; font-weight: 700; font-size: 14px;"
                                   value="${colorActual}">
                            <button onclick="gestorEmpresas.aplicarColorPersonalizado('${tipo}')" 
                                    style="padding: 12px 24px; background: linear-gradient(135deg, var(--color-primario) 0%, var(--color-secundario) 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; transition: all 0.3s ease;"
                                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)';"
                                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }

    seleccionarColorDePaleta(tipo, color) {
        this.cambiarColorManualConPreview(tipo, color);
        
        // Actualizar input si existe
        const input = document.getElementById(`hex${tipo}`);
        if (input) {
            if (input.tagName === 'INPUT') {
                input.value = color;
            } else {
                input.textContent = color;
            }
        }
        
        // Cerrar paleta
        document.querySelector('.paleta-premium-overlay')?.remove();
    }

    aplicarColorPersonalizado(tipo) {
        const input = document.getElementById(`colorPersonalizado${tipo}`);
        const color = input?.value;
        
        if (!color || !/^#[0-9A-F]{6}$/i.test(color)) {
            alert('❌ Color inválido\n\nUsa el formato: #RRGGBB\nEjemplo: #d4af37');
            return;
        }
        
        this.seleccionarColorDePaleta(tipo, color);
    }

    mostrarPaletaSafari(tipo) {
        const colores = {
            'Dorados': ['#d4af37', '#f1c40f', '#f39c12', '#e67e22'],
            'Rojos': ['#e74c3c', '#c0392b', '#ff6b6b', '#ff4757'],
            'Verdes': ['#2ecc71', '#27ae60', '#00b894', '#55efc4'],
            'Azules': ['#3498db', '#2980b9', '#0984e3', '#74b9ff'],
            'Morados': ['#9b59b6', '#8e44ad', '#a29bfe', '#6c5ce7']
        };
        
        let html = '<div style="background: var(--modal-fondo-card); padding: 12px; border-radius: 8px; margin-top: 8px;">';
        
        Object.entries(colores).forEach(([cat, cols]) => {
            html += `<div style="margin-bottom: 8px;"><strong style="color: var(--modal-texto-principal);">${cat}</strong><div style="display: flex; gap: 8px; margin-top: 4px;">`;
            cols.forEach(c => {
                html += `<div onclick="gestorEmpresas.aplicarColorSeleccionado('${tipo}', '${c}')" 
                              style="width: 32px; height: 32px; background: ${c}; border-radius: 6px; cursor: pointer;"></div>`;
            });
            html += '</div></div>';
        });
        
        html += '</div>';
        
        const input = document.getElementById(`hex${tipo}`);
        const existing = input.parentElement.querySelector('[style*="padding: 12px"]');
        if (existing) {
            existing.remove();
        } else {
            const div = document.createElement('div');
            div.innerHTML = html;
            input.parentElement.appendChild(div.firstElementChild);
        }
    }

    aplicarColorSeleccionado(tipo, color) {
        this.coloresTemp[tipo] = color;
        const input = document.getElementById(`hex${tipo}`);
        if (input) input.value = color;
        
        const preview = input.parentElement.querySelector('div[style*="background"]');
        if (preview) preview.style.background = color;
        
        const paleta = input.parentElement.querySelector('[style*="padding: 12px"]');
        if (paleta) paleta.remove();
    }

   aplicarPaleta(nombrePaleta) {
    const paletas = {
        // PALETAS SÓLIDAS
        'dorado-clasico': {
            ingresos: '#d4af37',
            gastos: '#ff6b35',
            utilidad: '#10b981',
            crecimiento: '#3b82f6',
            tematica: '#d4af37',
            tematicaSecundario: '#d4af37'
        },
        'azul-corporativo': {
            ingresos: '#2563eb',
            gastos: '#f59e0b',
            utilidad: '#10b981',
            crecimiento: '#8b5cf6',
            tematica: '#2563eb',
            tematicaSecundario: '#2563eb'
        },
        'verde-fresco': {
            ingresos: '#10b981',
            gastos: '#ef4444',
            utilidad: '#22c55e',
            crecimiento: '#06b6d4',
            tematica: '#10b981',
            tematicaSecundario: '#10b981'
        },
        // PALETAS MIXTAS (DEGRADADOS)
        'sunset-pro': {
            ingresos: '#ff6b6b',
            gastos: '#f39c12',
            utilidad: '#10b981',
            crecimiento: '#e74c3c',
            tematica: '#ff6b6b',
            tematicaSecundario: '#f39c12'
        },
        'ocean-pro': {
            ingresos: '#667eea',
            gastos: '#f093fb',
            utilidad: '#4facfe',
            crecimiento: '#764ba2',
            tematica: '#667eea',
            tematicaSecundario: '#764ba2'
        },
        'forest-pro': {
            ingresos: '#56ab2f',
            gastos: '#ff6b35',
            utilidad: '#a8e063',
            crecimiento: '#38b000',
            tematica: '#56ab2f',
            tematicaSecundario: '#a8e063'
        }
    };

    const colores = paletas[nombrePaleta];
    if (!colores) return;

    this.coloresTemp = { ...colores };

    // Actualizar todos los inputs
    Object.keys(colores).forEach(tipo => {
        const input = document.getElementById(`color${tipo}`);
        const hex = document.getElementById(`hex${tipo}`);
        
        if (input) input.value = colores[tipo];
        if (hex) {
            if (hex.tagName === 'INPUT') {
                hex.value = colores[tipo];
            } else {
                hex.textContent = colores[tipo];
            }
        }
        
        // Actualizar preview visual
        const preview = hex?.parentElement?.parentElement?.querySelector('div[style*="background"]');
        if (preview) {
            preview.style.background = colores[tipo];
            if (tipo.includes('tematica')) {
                preview.style.boxShadow = `0 4px 12px ${colores[tipo]}40`;
            }
        }
    });

    // Actualizar preview del degradado temático
    this.actualizarPreviewDegradado();
    // Aplicar colores inmediatamente al sistema
    const root = document.documentElement;
    root.style.setProperty('--color-ingresos', colores.ingresos);
    root.style.setProperty('--color-gastos', colores.gastos);
    root.style.setProperty('--color-utilidad', colores.utilidad);
    root.style.setProperty('--color-crecimiento', colores.crecimiento);
    root.style.setProperty('--color-primario', colores.tematica);
    root.style.setProperty('--color-secundario', colores.tematicaSecundario || colores.tematica);
    
    // Actualizar gráficos si existen
    if (window.actualizarGraficosConColores) {
        window.actualizarGraficosConColores(colores);
    }

    console.log(`✅ Paleta "${nombrePaleta}" aplicada`);
}
    aplicarModoVisual(modo) {
        this.modoVisual = modo;
        
        document.body.classList.remove('modo-oscuro', 'modo-claro', 'modo-neutro');
        
        if (modo === 'claro') {
            document.body.classList.add('modo-claro');
        } else if (modo === 'neutro') {
            document.body.classList.add('modo-neutro');
        }
    }

    guardarEdicion() {
        const nombre = document.getElementById('empresaNombre').value.trim();
        const ruc = document.getElementById('empresaRuc').value.trim();

        if (!nombre || nombre.length < 3) {
            alert('❌ El nombre debe tener al menos 3 caracteres');
            return;
        }

        const empresa = this.estado.empresas[this.empresaEditando];
        
        empresa.nombre = nombre;
        if (empresa.legal) empresa.legal.ruc = ruc;
        
        if (this.logoTemporal) {
        empresa.logo = this.logoTemporal;
        empresa.icono = null;
      } else if (this.emojiSeleccionado) {
        empresa.icono = this.emojiSeleccionado;
        empresa.logo = null;
      }
        empresa.coloresPersonalizados = { ...this.coloresTemp };
        empresa.modoVisual = this.modoVisual || 'oscuro';
        // Asegurar que tematicaSecundario existe
         if (!empresa.coloresPersonalizados.tematicaSecundario) {
          empresa.coloresPersonalizados.tematicaSecundario = empresa.coloresPersonalizados.tematica;
       }
        
        if (empresa.meta) {
            empresa.meta.fechaActualizacion = new Date().toISOString();
        }

        const root = document.documentElement;
        const root = document.documentElement;
        root.style.setProperty('--color-ingresos', this.coloresTemp.ingresos);
        root.style.setProperty('--color-gastos', this.coloresTemp.gastos);
        root.style.setProperty('--color-utilidad', this.coloresTemp.utilidad);
        root.style.setProperty('--color-crecimiento', this.coloresTemp.crecimiento);
        root.style.setProperty('--color-primario', this.coloresTemp.tematica);
        root.style.setProperty('--color-secundario', this.coloresTemp.tematicaSecundario || this.coloresTemp.tematica);

        // Disparar evento para actualizar gráficos
        document.dispatchEvent(new CustomEvent('empresaColoresActualizados', {
            detail: { 
                colores: this.coloresTemp,
                empresaId: this.empresaEditando
            }
        }));

        this._guardarEmpresas();
        this._actualizarListaEmpresas();
        this._actualizarSelectorPrincipal();
        this.cerrarModal();
        
        setTimeout(() => {
            alert(`✅ Empresa "${nombre}" actualizada correctamente`);
        }, 300);
    }oresTemp.ingresos);
        root.style.setProperty('--color-gastos', this.coloresTemp.gastos);
        root.style.setProperty('--color-utilidad', this.coloresTemp.utilidad);
        root.style.setProperty('--color-crecimiento', this.coloresTemp.crecimiento);

        this._guardarEmpresas();
        this._actualizarListaEmpresas();
        this._actualizarSelectorPrincipal();

        this.cerrarModal();
        
        setTimeout(() => {
            alert(`✅ Empresa "${nombre}" actualizada correctamente`);
        }, 300);
    }

    // ═══════════════════════════════════════════════════════════════
    // ELIMINAR EMPRESA
    // ═══════════════════════════════════════════════════════════════

    confirmarEliminarEmpresa(empresaId) {
        const empresa = this.estado.empresas[empresaId];
        if (!empresa) return;

        if (confirm(`¿Eliminar la empresa "${empresa.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
            delete this.estado.empresas[empresaId];
            
            if (this.estado.empresaActual === empresaId) {
                const primeraEmpresa = Object.keys(this.estado.empresas)[0];
                if (primeraEmpresa) {
                    this.seleccionarEmpresa(primeraEmpresa);
                } else {
                    this.estado.empresaActual = null;
                }
            }
            
            this._guardarEmpresas();
            this._renderizarInterfaz();
            
            alert(`✅ Empresa "${empresa.nombre}" eliminada`);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILIDADES
    // ═══════════════════════════════════════════════════════════════

    cerrarModal() {
        const modales = ['grizalumModalNuevaEmpresa', 'grizalumModalEditor'];
        modales.forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        this.empresaEditando = null;
        this.logoTemporal = null;
        this.emojiSeleccionado = null;
    }

    _cerrarLista() {
        this.estado.listaAbierta = false;
        const lista = document.getElementById('grizalumEmpresasList');
        const arrow = document.getElementById('grizalumDropdownArrow');
        lista?.classList.remove('show');
        arrow?.classList.remove('rotated');
    }

    _seleccionarEmpresaInicial() {
        const primeraEmpresa = Object.keys(this.estado.empresas)[0];
        if (primeraEmpresa) {
            this.seleccionarEmpresa(primeraEmpresa);
        }
    }

    _obtenerEmpresaActual() {
        return this.estado.empresas[this.estado.empresaActual];
    }

    _generarEstadoEmpresa(empresa) {
        if (!empresa) return 'No seleccionada';
        return `🟢 ${empresa.estado}`;
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
            totalGastos: empresas.reduce((sum, e) => sum + (e.finanzas?.gastos || 0), 0)
        };
    }

    _aplicarColoresEmpresa(empresaId) {
    const empresa = this.estado.empresas[empresaId];
    if (!empresa) return;
    
    const colores = empresa.coloresPersonalizados || {
        ingresos: '#d4af37',
        gastos: '#ff6b35',
        utilidad: '#2ecc71',
        crecimiento: '#9b59b6',
        tematica: '#d4af37',
        tematicaSecundario: '#b8941f'
    };
    
    // Asegurar que tematicaSecundario existe
    if (!colores.tematicaSecundario) {
        colores.tematicaSecundario = colores.tematica;
    }
    
    const root = document.documentElement;
    root.style.setProperty('--color-ingresos', colores.ingresos);
    root.style.setProperty('--color-gastos', colores.gastos);
    root.style.setProperty('--color-utilidad', colores.utilidad);
    root.style.setProperty('--color-crecimiento', colores.crecimiento);
    root.style.setProperty('--color-primario', colores.tematica);
    root.style.setProperty('--color-secundario', colores.tematicaSecundario);
    
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
    }

    _actualizarSelectorPrincipal() {
        const empresa = this._obtenerEmpresaActual();
        if (!empresa) return;

        const avatar = document.getElementById('grizalumEmpresaAvatar');
        const nombre = document.getElementById('grizalumEmpresaNombre');
        const estado = document.getElementById('grizalumEmpresaEstado');

        if (avatar) {
            if (empresa.logo) {
                avatar.innerHTML = `<img src="${empresa.logo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
            } else {
                avatar.textContent = empresa.icono;
            }
            
            const temaEmpresa = this.config.temas[empresa.tema] || this.config.temas.rojo;
            avatar.style.background = `linear-gradient(135deg, ${temaEmpresa.primary} 0%, ${temaEmpresa.secondary} 100%)`;
        }
        
        if (nombre) nombre.textContent = empresa.nombre;
        if (estado) estado.innerHTML = this._generarEstadoEmpresa(empresa);
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

    _guardarEmpresas() {
        try {
            localStorage.setItem('grizalum_empresas', JSON.stringify(this.estado.empresas));
            localStorage.setItem('grizalum_empresa_actual', this.estado.empresaActual);
        } catch (error) {
            this._log('error', 'Error guardando empresas:', error);
        }
    }

    _validarIntegridadEmpresas() {
        Object.entries(this.estado.empresas).forEach(([id, empresa]) => {
            if (!empresa.meta) {
                empresa.meta = {
                    fechaCreacion: new Date().toISOString(),
                    fechaActualizacion: new Date().toISOString(),
                    version: '1.0',
                    activa: true
                };
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
            }
        });
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

        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape') {
                this._cerrarLista();
                this.cerrarModal();
            }
        });
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
        
        if (nivel === 'error') {
            console.error(`${prefijo}`, mensaje, datos);
        } else if (nivel === 'warn') {
            console.warn(`${prefijo}`, mensaje, datos);
        } else if (this.config.debug || nivel === 'success') {
            console.log(`${prefijo}`, mensaje, datos);
        }
    }

    _registrarActividad(accion, descripcion, datos = {}) {
        const registro = {
            id: Date.now() + Math.random(),
            accion,
            descripcion,
            datos,
            timestamp: Date.now(),
            fecha: new Date().toISOString()
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

    // ═══════════════════════════════════════════════════════════════
    // API PÚBLICA
    // ═══════════════════════════════════════════════════════════════

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
    _generarBadgeEstado(estado) {
        const estados = {
            'Activo': { emoji: '🟢', color: '#10b981', texto: 'Activo' },
            'Operativo': { emoji: '🟢', color: '#10b981', texto: 'Operativo' },
            'Ocupado': { emoji: '🟡', color: '#f59e0b', texto: 'Ocupado' },
            'Inactivo': { emoji: '⚫', color: '#6b7280', texto: 'Inactivo' },
            'Mantenimiento': { emoji: '🔧', color: '#3b82f6', texto: 'Mantenimiento' },
            'Suspendido': { emoji: '⏸️', color: '#ef4444', texto: 'Suspendido' }
        };
        
        const info = estados[estado] || estados['Operativo'];
        
        return `
            <span style="
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 10px;
                background: ${info.color}20;
                color: ${info.color};
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
            ">
                ${info.emoji} ${info.texto}
            </span>
        `;
    }
    _obtenerMensajeMotivacional() {
        const mensajes = [
            '✨ Cada día es una nueva oportunidad',
            '🚀 El éxito comienza con un paso',
            '💡 Las grandes ideas se convierten en realidad',
            '🎯 Enfócate en tus metas',
            '💪 La constancia es la clave del éxito',
            '🌟 Hoy es el día perfecto para crecer',
            '⚡ Tu esfuerzo tiene recompensa',
            '🔥 Trabaja con pasión',
            '🎨 Crea algo extraordinario hoy',
            '🌈 El futuro lo construyes tú'
        ];
        
        const hora = new Date().getHours();
        
        if (hora < 12) return '☀️ Buenos días, ¡comienza con energía!';
        if (hora < 18) return '🌤️ Buenas tardes, ¡sigue adelante!';
        
        return mensajes[Math.floor(Math.random() * mensajes.length)];
    }

    cerrarLista() {
        this._cerrarLista();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN GLOBAL
// ═══════════════════════════════════════════════════════════════════════════

let gestorEmpresas = null;

function inicializarGestorEmpresas() {
    try {
        if (gestorEmpresas) {
            console.log('✅ Gestor de Empresas ya inicializado');
            return gestorEmpresas;
        }

        gestorEmpresas = new GestorEmpresasUnificado();
        window.gestorEmpresas = gestorEmpresas;
        
        console.log('✅ Gestor de Empresas Unificado v4.0 inicializado');
        return gestorEmpresas;
        
    } catch (error) {
        console.error('❌ Error al inicializar Gestor de Empresas:', error);
        return null;
    }
}

// Auto-inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGestorEmpresas);
} else if (document.readyState === 'interactive') {
    setTimeout(inicializarGestorEmpresas, 200);
} else {
    inicializarGestorEmpresas();
}

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🏢 GRIZALUM GESTOR DE EMPRESAS UNIFICADO v4.0               ║
╠═══════════════════════════════════════════════════════════════╣
║  ✅ Sistema completo de gestión                               ║
║  ✅ Crear, editar y eliminar empresas                         ║
║  ✅ Sin empresas de prueba (inicio limpio)                    ║
║  ✅ Onboarding automático integrado                           ║
║  ✅ Personalización total de colores                          ║
║  ✅ 3 modos visuales (oscuro/claro/neutro)                    ║
║  ✅ Compatible con todos los módulos                          ║
╚═══════════════════════════════════════════════════════════════╝
`);
        
