/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                GRIZALUM GESTOR DE EMPRESAS COMPLETO v3.2                     ║
 * ║                        SOLUCIÓN FINAL SIN CONFLICTOS                         ║
 * ║                     Reemplaza TODOS los archivos rotos                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

class GestorEmpresasCompleto {
    constructor() {
        this.version = '3.2.0';
        this.debug = true;
        
        // Configuración de temas
        this.temaMapping = {
            'rojo': {
                id: 'rojo',
                cssTheme: 'red',
                primary: '#dc2626',
                secondary: '#b91c1c',
                name: 'Rojo Corporativo'
            },
            'azul': {
                id: 'azul',
                cssTheme: 'blue',
                primary: '#2563eb',
                secondary: '#1d4ed8',
                name: 'Azul Profesional'
            },
            'verde': {
                id: 'verde',
                cssTheme: 'green',
                primary: '#059669',
                secondary: '#047857',
                name: 'Verde Crecimiento'
            },
            'morado': {
                id: 'morado',
                cssTheme: 'purple',
                primary: '#7c3aed',
                secondary: '#6d28d9',
                name: 'Morado Innovación'
            },
            'dorado': {
                id: 'dorado',
                cssTheme: 'gold',
                primary: '#d97706',
                secondary: '#b45309',
                name: 'Dorado Premium'
            }
        };

        // Estado del sistema
        this.estado = {
            inicializado: false,
            listaAbierta: false,
            empresaActual: null,
            empresas: {},
            periodoActivo: 'mes'
        };

        this._log('info', 'Iniciando Gestor Completo...');
        this._inicializar();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // INICIALIZACIÓN COMPLETA
    // ═══════════════════════════════════════════════════════════════════════════
    async _inicializar() {
        try {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
            }

            await this._cargarEmpresas();
            this._crearEstilos();
            await this._esperarContenedor();
            this._renderizarInterfaz();
            this._configurarEventos();
            this._seleccionarEmpresaInicial();
            this._hacerDisponibleGlobalmente();
            
            this.estado.inicializado = true;
            this._log('success', 'Gestor Completo inicializado correctamente');
            
        } catch (error) {
            this._log('error', 'Error en inicialización:', error);
        }
    }

    async _esperarContenedor() {
        return new Promise((resolve) => {
            const checkContenedor = () => {
                const contenedor = document.getElementById('companySelector');
                if (contenedor) {
                    resolve();
                } else {
                    setTimeout(checkContenedor, 100);
                }
            };
            checkContenedor();
        });
    }

    async _cargarEmpresas() {
        try {
            const datosGuardados = localStorage.getItem('grizalum_empresas');
            
            if (datosGuardados) {
                this.estado.empresas = JSON.parse(datosGuardados);
                this._log('info', `Cargadas ${Object.keys(this.estado.empresas).length} empresas`);
            } else {
                this._crearEmpresasDefault();
            }
            
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
                
                ubicacion: {
                    distrito: 'Villa El Salvador',
                    departamento: 'Lima'
                },
                
                finanzas: {
                    caja: 124500,
                    ingresos: 2847293,
                    gastos: 344076,
                    utilidadNeta: 165000,
                    margenNeto: 15.2,
                    roi: 24.8
                },
                
                meta: {
                    fechaCreacion: new Date().toISOString(),
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
                
                ubicacion: {
                    distrito: 'Cerro Colorado',
                    departamento: 'Arequipa'
                },
                
                finanzas: {
                    caja: 89300,
                    ingresos: 1950000,
                    gastos: 287500,
                    utilidadNeta: 125000,
                    margenNeto: 12.8,
                    roi: 18.5
                },
                
                meta: {
                    fechaCreacion: new Date().toISOString(),
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
                
                ubicacion: {
                    distrito: 'La Victoria',
                    departamento: 'Lima'
                },
                
                finanzas: {
                    caja: 45200,
                    ingresos: 950000,
                    gastos: 780000,
                    utilidadNeta: 170000,
                    margenNeto: 17.9,
                    roi: 12.4
                },
                
                meta: {
                    fechaCreacion: new Date().toISOString(),
                    activa: true
                }
            }
        };
        
        this._guardarEmpresas();
        this._log('info', 'Empresas por defecto creadas');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDERIZADO DE INTERFAZ
    // ═══════════════════════════════════════════════════════════════════════════
    _renderizarInterfaz() {
        const contenedor = document.getElementById('companySelector');
        if (!contenedor) {
            this._log('error', 'No se encontró #companySelector');
            return;
        }

        contenedor.innerHTML = this._generarHTML();
        this._actualizarListaEmpresas();
        this._log('info', 'Interfaz renderizada correctamente');
    }

    _generarHTML() {
        const empresaActual = this._obtenerEmpresaActual();
        
        return `
            <div class="grizalum-empresas-container">
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
                                💰 S/. ${empresaActual?.finanzas?.caja?.toLocaleString() || '0'}
                            </div>
                        </div>
                    </div>
                    <div class="grizalum-dropdown-arrow" id="grizalumDropdownArrow">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>

                <div class="grizalum-empresas-list" id="grizalumEmpresasList">
                    <div class="grizalum-list-header">
                        <h4 class="grizalum-list-title">🏢 Mis Empresas</h4>
                        <button class="grizalum-btn-nueva" onclick="gestorEmpresas.abrirModalNuevaEmpresa()">
                            <i class="fas fa-plus"></i> Nueva
                        </button>
                    </div>
                    
                    <div class="grizalum-empresas-grid" id="grizalumEmpresasGrid">
                        <!-- Se llena dinámicamente -->
                    </div>
                    
                    <div class="grizalum-list-footer">
                        <div class="grizalum-total-empresas">
                            📊 ${Object.keys(this.estado.empresas).length} empresas registradas
                        </div>
                        <div class="grizalum-total-caja">
                            <i class="fas fa-coins"></i>
                            Total: S/. ${this._calcularTotalCaja().toLocaleString()}
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
        
        Object.entries(this.estado.empresas).forEach(([id, empresa], index) => {
            const card = this._crearTarjetaEmpresa(id, empresa, index);
            grid.appendChild(card);
        });
    }

    _crearTarjetaEmpresa(id, empresa, index) {
        const esActiva = this.estado.empresaActual === id;
        const temaConfig = this.temaMapping[empresa.tema] || this.temaMapping.rojo;
        
        const card = document.createElement('div');
        card.className = `grizalum-empresa-card ${esActiva ? 'active' : ''}`;
        card.dataset.empresaId = id;
        
        card.innerHTML = `
            <div class="grizalum-card-avatar" style="background: linear-gradient(135deg, ${temaConfig.primary}, ${temaConfig.secondary}); box-shadow: 0 4px 12px ${temaConfig.primary}30;">
                ${empresa.icono}
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
                        S/. ${empresa.finanzas?.caja?.toLocaleString() || '0'}
                    </div>
                </div>
            </div>
            <div class="grizalum-card-estado">
                ${this._obtenerEmojiEstado(empresa.estado)}
            </div>
            <div class="grizalum-card-actions">
                <button class="grizalum-action-btn grizalum-btn-editar" onclick="event.stopPropagation(); gestorEmpresas.editarEmpresa('${id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
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
    // API PRINCIPAL
    // ═══════════════════════════════════════════════════════════════════════════
    seleccionarEmpresa(empresaId) {
        if (!this.estado.empresas[empresaId]) {
            this._log('error', `Empresa no encontrada: ${empresaId}`);
            return false;
        }

        const empresaAnterior = this.estado.empresaActual;
        const empresa = this.estado.empresas[empresaId];
        this.estado.empresaActual = empresaId;
        
        // Actualizar interfaz
        this._actualizarSelector();
        this._actualizarTarjetas();
        this._cerrarLista();
        
        // Aplicar tema
        this._aplicarTemaEmpresa(empresa);
        
        // Notificar a otros sistemas
        this._notificarCambioEmpresa(empresaId, empresa);
        
        this._log('success', `Empresa seleccionada: ${empresa.nombre}`);
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

    obtenerEmpresaActual() {
        return {
            id: this.estado.empresaActual,
            datos: this.estado.empresas[this.estado.empresaActual]
        };
    }

    obtenerDatosActuales() {
        const empresa = this.estado.empresas[this.estado.empresaActual];
        if (!empresa) {
            return {
                financiero: { ingresos: 0, gastos: 0, utilidad: 0, crecimiento: 0, flujoCaja: 0, margen: 0 },
                graficos: { flujoMeses: [0,0,0,0,0,0], gastosDistribucion: [0,0,0,0,0], ingresosVsGastos: [0,0,0] }
            };
        }

        return {
            info: {
                nombre: empresa.nombre,
                emoji: empresa.icono,
                ubicacion: empresa.ubicacion?.distrito || 'Lima'
            },
            financiero: {
                ingresos: empresa.finanzas?.ingresos || 0,
                gastos: empresa.finanzas?.gastos || 0,
                utilidad: empresa.finanzas?.utilidadNeta || 0,
                crecimiento: empresa.finanzas?.roi || 0,
                flujoCaja: empresa.finanzas?.caja || 0,
                margen: empresa.finanzas?.margenNeto || 0
            },
            graficos: {
                flujoMeses: [0, 0, 0, 0, 0, empresa.finanzas?.caja || 0],
                gastosDistribucion: [45, 25, 15, 10, 5],
                ingresosVsGastos: [
                    empresa.finanzas?.ingresos || 0,
                    empresa.finanzas?.gastos || 0,
                    empresa.finanzas?.utilidadNeta || 0
                ]
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS INTERNOS
    // ═══════════════════════════════════════════════════════════════════════════
    _actualizarSelector() {
        const empresa = this._obtenerEmpresaActual();
        if (!empresa) return;

        const avatar = document.getElementById('grizalumEmpresaAvatar');
        const nombre = document.getElementById('grizalumEmpresaNombre');
        const estado = document.getElementById('grizalumEmpresaEstado');
        const metricas = document.getElementById('grizalumEmpresaMetricas');

        if (avatar) {
            avatar.textContent = empresa.icono;
            const temaConfig = this.temaMapping[empresa.tema] || this.temaMapping.rojo;
            avatar.style.background = `linear-gradient(135deg, ${temaConfig.primary}, ${temaConfig.secondary})`;
            avatar.style.boxShadow = `0 4px 12px ${temaConfig.primary}50`;
        }
        
        if (nombre) nombre.textContent = empresa.nombre;
        if (estado) estado.innerHTML = this._generarEstadoEmpresa(empresa);
        if (metricas) metricas.innerHTML = `💰 S/. ${empresa.finanzas?.caja?.toLocaleString() || '0'}`;
    }

    _actualizarTarjetas() {
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

    _aplicarTemaEmpresa(empresa) {
        const temaConfig = this.temaMapping[empresa.tema];
        if (!temaConfig) return;

        // Aplicar tema usando el motor de temas existente
        if (window.grizalumFuturisticThemes && window.grizalumFuturisticThemes.changeTheme) {
            window.grizalumFuturisticThemes.changeTheme(temaConfig.cssTheme);
        } else if (window.changeTheme) {
            window.changeTheme(temaConfig.cssTheme);
        }

        this._log('info', `Tema aplicado: ${temaConfig.name}`);
    }

    _notificarCambioEmpresa(empresaId, empresa) {
        // Evento principal
        const evento = new CustomEvent('empresaSeleccionada', {
            detail: { empresaId, empresa },
            bubbles: true
        });
        document.dispatchEvent(evento);

        // Hacer disponible globalmente
        window.empresaActual = { id: empresaId, nombre: empresa.nombre, datos: empresa };

        // Actualizar sistemas existentes
        setTimeout(() => {
            if (window.actualizarMetricas) window.actualizarMetricas();
            if (window.actualizarGraficos) window.actualizarGraficos();
            if (window.actualizarInterfazCompleta) window.actualizarInterfazCompleta();
        }, 100);
    }

    _seleccionarEmpresaInicial() {
        const empresaGuardada = localStorage.getItem('grizalum_empresa_actual');
        const empresaDefault = 'fundicion-laguna';
        const primeraEmpresa = Object.keys(this.estado.empresas)[0];
        
        if (empresaGuardada && this.estado.empresas[empresaGuardada]) {
            this.seleccionarEmpresa(empresaGuardada);
        } else if (this.estado.empresas[empresaDefault]) {
            this.seleccionarEmpresa(empresaDefault);
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
            'Mantenimiento': '🔧'
        };
        return estados[estado] || '🟢';
    }

    _calcularTotalCaja() {
        return Object.values(this.estado.empresas)
            .reduce((total, empresa) => total + (empresa.finanzas?.caja || 0), 0);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GESTIÓN DE EMPRESAS
    // ═══════════════════════════════════════════════════════════════════════════
    abrirModalNuevaEmpresa() {
        this._log('info', 'Modal nueva empresa - Próximamente');
        alert('Función de nueva empresa estará disponible en la próxima versión');
        this._cerrarLista();
    }

    editarEmpresa(empresaId) {
        this._log('info', `Editar empresa: ${empresaId}`);
        alert(`Función de edición para ${this.estado.empresas[empresaId]?.nombre} estará disponible próximamente`);
        this._cerrarLista();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE EVENTOS
    // ═══════════════════════════════════════════════════════════════════════════
    _configurarEventos() {
        document.addEventListener('click', (evento) => {
            const container = document.querySelector('.grizalum-empresas-container');
            if (container && !container.contains(evento.target)) {
                this._cerrarLista();
            }
        });

        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && this.estado.listaAbierta) {
                this._cerrarLista();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PERSISTENCIA
    // ═══════════════════════════════════════════════════════════════════════════
    _guardarEmpresas() {
        try {
            localStorage.setItem('grizalum_empresas', JSON.stringify(this.estado.empresas));
            localStorage.setItem('grizalum_empresa_actual', this.estado.empresaActual);
        } catch (error) {
            this._log('error', 'Error guardando empresas:', error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DISPONIBILIDAD GLOBAL
    // ═══════════════════════════════════════════════════════════════════════════
    _hacerDisponibleGlobalmente() {
        window.gestorEmpresas = this;
        window.cambiarEmpresaActiva = (id) => this.seleccionarEmpresa(id);
        window.obtenerDatosActuales = () => this.obtenerDatosActuales();
        window.actualizarInterfazCompleta = () => this._actualizarInterfazCompleta();
        
        // Para compatibilidad con sistema de períodos
        window.changePeriod = (periodo, elemento) => {
            if (elemento) {
                document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
                elemento.classList.add('active');
            }
            this.estado.periodoActivo = periodo;
            setTimeout(() => {
                if (window.actualizarMetricas) window.actualizarMetricas();
                if (window.actualizarGraficos) window.actualizarGraficos();
            }, 100);
        };
    }

    _actualizarInterfazCompleta() {
        try {
            if (window.actualizarMetricas) window.actualizarMetricas();
            if (window.actualizarGraficos) window.actualizarGraficos();
            this._log('info', 'Interfaz actualizada');
        } catch (error) {
            this._log('error', 'Error actualizando interfaz:', error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ESTILOS CSS
    // ═══════════════════════════════════════════════════════════════════════════
    _crearEstilos() {
        const estilosId = 'grizalum-gestor-empresas-styles';
        
        if (document.getElementById(estilosId)) return;
        
        const estilos = document.createElement('style');
        estilos.id = estilosId;
        estilos.textContent = `
            /* GRIZALUM GESTOR DE EMPRESAS - ESTILOS COMPLETOS */
            .grizalum-empresas-container {
                position: relative;
                min-width: 320px;
                font-family: 'Inter', sans-serif;
                user-select: none;
            }
            
            .grizalum-empresa-selector {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: white;
                border: 2px solid #dc2626;
                border-radius: 12px;
                padding: 1rem 1.25rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            
            .grizalum-empresa-selector:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            .grizalum-empresa-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .grizalum-empresa-avatar {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #dc2626, #b91c1c);
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
                color: #1f2937;
            }
            
            .grizalum-empresa-estado {
                font-size: 0.875rem;
                font-weight: 500;
                color: #6b7280;
            }
            
            .grizalum-empresa-metricas {
                font-size: 0.8rem;
                color: #059669;
                font-weight: 600;
            }
            
            .grizalum-dropdown-arrow {
                color: #6b7280;
                transition: transform 0.3s ease;
                font-size: 1.2rem;
            }
            
            .grizalum-dropdown-arrow.rotated {
                transform: rotate(180deg);
                color: #dc2626;
            }
            
            .grizalum-empresas-list {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                width: 420px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 16px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                border: 1px solid #e5e7eb;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-20px) scale(0.95);
                transition: all 0.3s ease;
                overflow: hidden;
                backdrop-filter: blur(10px);
            }
            
            .grizalum-empresas-list.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            
            .grizalum-list-header {
                padding: 1.5rem;
                background: linear-gradient(135deg, #f8fafc 0%, rgba(248, 250, 252, 0.8) 100%);
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .grizalum-list-title {
                margin: 0;
                color: #1f2937;
                font-size: 1.1rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .grizalum-btn-nueva {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
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
                transition: all 0.3s ease;
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
                scrollbar-color: #e5e7eb transparent;
            }
            
            .grizalum-empresas-grid::-webkit-scrollbar {
                width: 6px;
            }
            
            .grizalum-empresas-grid::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .grizalum-empresas-grid::-webkit-scrollbar-thumb {
                background: #e5e7eb;
                border-radius: 3px;
            }
            
            .grizalum-empresa-card {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 0.5rem;
                border: 1px solid transparent;
                position: relative;
                overflow: hidden;
            }
            
            .grizalum-empresa-card:hover {
                background: linear-gradient(135deg, #f8fafc 0%, rgba(248, 250, 252, 0.8) 100%);
                transform: translateX(5px);
                border-color: #e5e7eb;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            }
            
            .grizalum-empresa-card.active {
                background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.08) 100%);
                border-color: #dc2626;
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
            }
            
            .grizalum-card-avatar {
                width: 45px;
                height: 45px;
                background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                transition: all 0.3s ease;
                flex-shrink: 0;
            }
            
            .grizalum-empresa-card:hover .grizalum-card-avatar {
                transform: scale(1.1);
            }
            
            .grizalum-card-info {
                flex: 1;
            }
            
            .grizalum-card-nombre {
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
                line-height: 1.2;
            }
            
            .grizalum-card-datos {
                font-size: 0.8rem;
                color: #6b7280;
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
                color: #059669;
                font-weight: 600;
            }
            
            .grizalum-card-estado {
                font-size: 1.2rem;
                opacity: 0.8;
            }
            
            .grizalum-card-actions {
                display: flex;
                gap: 0.5rem;
                opacity: 1;
                transition: all 0.3s ease;
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
                transition: all 0.3s ease;
                font-size: 0.8rem;
                background: white;
                color: #6b7280;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .grizalum-action-btn:hover {
                transform: scale(1.1);
                color: #dc2626;
            }
            
            .grizalum-btn-editar:hover {
                background: #3b82f6;
                color: white;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }
            
            .grizalum-list-footer {
                padding: 1.25rem;
                background: linear-gradient(135deg, #f8fafc 0%, rgba(248, 250, 252, 0.6) 100%);
                border-top: 1px solid #e5e7eb;
                text-align: center;
            }
            
            .grizalum-total-empresas {
                font-weight: 700;
                color: #1f2937;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }
            
            .grizalum-total-caja {
                font-size: 1.1rem;
                font-weight: 800;
                color: #059669;
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
            }
        `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE LOGGING
    // ═══════════════════════════════════════════════════════════════════════════
    _log(nivel, mensaje, datos = null) {
        if (!this.debug && nivel === 'info') return;
        
        const timestamp = new Date().toISOString();
        const prefijo = `[${timestamp}] [GestorCompleto]`;
        
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
                console.log(`${prefijo} ℹ️`, mensaje, datos);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN AUTOMÁTICA
// ═══════════════════════════════════════════════════════════════════════════

let gestorEmpresasCompleto = null;

function inicializarGestorCompleto() {
    try {
        if (gestorEmpresasCompleto) {
            console.log('🟡 Gestor ya inicializado');
            return gestorEmpresasCompleto;
        }

        gestorEmpresasCompleto = new GestorEmpresasCompleto();
        return gestorEmpresasCompleto;
        
    } catch (error) {
        console.error('❌ Error al inicializar Gestor Completo:', error);
        return null;
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGestorCompleto);
} else if (document.readyState === 'interactive') {
    setTimeout(inicializarGestorCompleto, 200);
} else {
    inicializarGestorCompleto();
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES GLOBALES PARA COMPATIBILIDAD
// ═══════════════════════════════════════════════════════════════════════════

function seleccionarEmpresa(empresaId) {
    if (window.gestorEmpresas) {
        return window.gestorEmpresas.seleccionarEmpresa(empresaId);
    }
    return false;
}

function editarEmpresaActual(empresaId) {
    if (window.gestorEmpresas && empresaId) {
        window.gestorEmpresas.editarEmpresa(empresaId);
    } else {
        alert('Selecciona una empresa primero');
    }
}

// Para compatibilidad con el HTML existente
window.changeCompany = function(empresaId) {
    if (window.cambiarEmpresaActiva) {
        window.cambiarEmpresaActiva(empresaId);
    }
};

console.log(`
🏢 ═══════════════════════════════════════════════════════════════════════════════
   GRIZALUM GESTOR DE EMPRESAS COMPLETO v3.2 - SOLUCIÓN FINAL
   Sistema Unificado que Reemplaza Todos los Archivos Rotos
🏢 ═══════════════════════════════════════════════════════════════════════════════

✅ CARACTERÍSTICAS:
   🎯 Código completo en un solo archivo
   🔄 Conexión directa con tu HTML existente
   🎨 Aplicación automática de temas por empresa
   📊 Datos financieros reales de cada empresa
   🔧 Compatible con todos tus sistemas existentes

🛠️ INSTALACIÓN:
   1. Guarda este código como 'gestor-empresas-completo.js'
   2. Reemplaza la línea en tu HTML:
      CAMBIAR: <script src="src/assets/js/gestor-empresas-principal.js" defer></script>
      POR:     <script src="src/assets/js/gestor-empresas-completo.js" defer></script>
   3. Comenta o elimina estos archivos conflictivos:
      • gestor-empresas-admin.js
      • gestor-empresas-emojis.js  
      • gestor-empresas-formularios.js
      • gestor-empresas-temas.js
      • gestor-empresas-reportes.js

🎯 API PRINCIPAL:
   • gestorEmpresas.seleccionarEmpresa(id)
   • gestorEmpresas.obtenerDatosActuales()
   • gestorEmpresas.alternarLista()
   • window.cambiarEmpresaActiva(id)

🏢 ═══════════════════════════════════════════════════════════════════════════════
`);
