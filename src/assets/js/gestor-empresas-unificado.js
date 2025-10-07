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
                        <div style="font-weight: 700; color: var(--grizalum-text); margin-bottom: 0.5rem;">
                            ${totalEmpresas} empresa${totalEmpresas !== 1 ? 's' : ''}
                        </div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: var(--grizalum-success);">
                            Total: ${this.config.regional.moneda} ${totalCaja.toLocaleString()}
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
                <div style="font-size: 0.8rem; color: var(--grizalum-text-light);">
                    ${this.config.regional.moneda} ${empresa.finanzas?.caja?.toLocaleString() || '0'}
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
                        <div class="grizalum-seccion-titulo">Identidad Visual</div>
                        
                        <div class="grizalum-emoji-grid">
                            ${['🏢', '🏭', '🏪', '🏬', '🏦', '🍽️', '💻', '🔥', '⚙️', '🌾', '🐄', '🐔', '⛏️', '🏗️', '💎', '⚡', '🚀', '💡', '🎯', '💰'].map(emoji => `
                                <div class="grizalum-emoji-item" onclick="gestorEmpresas.seleccionarEmojiNueva('${emoji}')">${emoji}</div>
                            `).join('')}
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
            tema: 'rojo',
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
                        <div class="grizalum-seccion-titulo">🎨 Paletas Predefinidas</div>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
                            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('dorado-clasico')" 
                                    style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                ✨ Dorado Clásico
                            </button>
                            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('azul-corporativo')"
                                    style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                💼 Azul Corporativo
                            </button>
                            <button class="grizalum-paleta-btn" onclick="gestorEmpresas.aplicarPaleta('verde-fresco')"
                                    style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                🌿 Verde Fresco
                            </button>
                        </div>
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
                        
                        <div class="grizalum-emoji-grid">
                            ${emojis.map(emoji => `
                                <div class="grizalum-emoji-item ${emoji === empresa.icono ? 'selected' : ''}" 
                                     onclick="gestorEmpresas.seleccionarEmoji('${emoji}')">${emoji}</div>
                            `).join('')}
                        </div>
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
        const esSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        return `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                <div style="width: 40px; height: 40px; background: ${color}; border-radius: 8px; cursor: pointer;" 
                     onclick="${esSafari ? `gestorEmpresas.mostrarPaletaSafari('${id}')` : `document.getElementById('color${id}').click()`}">
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--modal-texto-principal);">${emoji} ${nombre}</div>
                    ${esSafari ? 
                        `<input type="text" id="hex${id}" value="${color}" maxlength="7" 
                                style="width: 100%; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid var(--modal-borde); border-radius: 6px; color: var(--modal-texto-principal);"
                                oninput="gestorEmpresas.cambiarColorManual('${id}', this.value)">` :
                        `<div style="font-size: 12px; color: var(--modal-texto-terciario);" id="hex${id}">${color}</div>`
                    }
                </div>
                ${!esSafari ? `<input type="color" id="color${id}" value="${color}" style="display:none" onchange="gestorEmpresas.cambiarColor('${id}', this.value)">` : ''}
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

    cambiarColor(tipo, color) {
        this.coloresTemp[tipo] = color;
        const hex = document.getElementById(`hex${tipo}`);
        if (hex) hex.textContent = color;
        
        const preview = document.querySelector(`input#color${tipo}`).parentElement.querySelector('div[style*="background"]');
        if (preview) preview.style.background = color;
    }

    cambiarColorManual(tipo, valor) {
        if (!/^#[0-9A-F]{6}$/i.test(valor)) return;
        
        this.coloresTemp[tipo] = valor;
        const preview = document.getElementById(`hex${tipo}`).parentElement.querySelector('div[style*="background"]');
        if (preview) preview.style.background = valor;
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
            'dorado-clasico': {
                ingresos: '#d4af37',
                gastos: '#ff6b35',
                utilidad: '#10b981',
                crecimiento: '#3b82f6',
                tematica: '#d4af37'
            },
            'azul-corporativo': {
                ingresos: '#2563eb',
                gastos: '#f59e0b',
                utilidad: '#10b981',
                crecimiento: '#8b5cf6',
                tematica: '#2563eb'
            },
            'verde-fresco': {
                ingresos: '#10b981',
                gastos: '#ef4444',
                utilidad: '#22c55e',
                crecimiento: '#06b6d4',
                tematica: '#10b981'
            }
        };

        const colores = paletas[nombrePaleta];
        if (!colores) return;

        this.coloresTemp = { ...colores };

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
            
            const preview = hex?.parentElement.querySelector('div[style*="background"]');
            if (preview) preview.style.background = colores[tipo];
        });
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
        
        empresa.icono = this.emojiSeleccionado;
        empresa.coloresPersonalizados = { ...this.coloresTemp };
        empresa.modoVisual = this.modoVisual || 'oscuro';
        
        if (empresa.meta) {
            empresa.meta.fechaActualizacion = new Date().toISOString();
        }

        const root = document.documentElement;
        root.style.setProperty('--color-ingresos', this.coloresTemp.ingresos);
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
            tematica: '#d4af37'
        };
        
        const root = document.documentElement;
        root.style.setProperty('--color-ingresos', colores.ingresos);
        root.style.setProperty('--color-gastos', colores.gastos);
        root.style.setProperty('--color-utilidad', colores.utilidad);
        root.style.setProperty('--color-crecimiento', colores.crecimiento);
        root.style.setProperty('--color-primario', colores.tematica);
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
        
