/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    GESTOR-EMPRESAS-PRINCIPAL.JS - ARREGLADO                  ║
 * ║                        Reemplaza solo el archivo roto                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

class GestorEmpresasPrincipal {
    constructor() {
        this.version = '3.0.0';
        this.debug = true;
        
        // Estado del gestor
        this.estado = {
            inicializado: false,
            listaAbierta: false,
            empresaActual: null,
            empresas: {}
        };

        // Configuración de temas
        this.temaMapping = {
            'rojo': { cssTheme: 'red', primary: '#dc2626', secondary: '#b91c1c' },
            'azul': { cssTheme: 'blue', primary: '#2563eb', secondary: '#1d4ed8' },
            'verde': { cssTheme: 'green', primary: '#059669', secondary: '#047857' },
            'morado': { cssTheme: 'purple', primary: '#7c3aed', secondary: '#6d28d9' },
            'dorado': { cssTheme: 'gold', primary: '#d97706', secondary: '#b45309' }
        };

        this._inicializar();
    }

    async _inicializar() {
        try {
            console.log('🚀 Iniciando Gestor de Empresas Principal...');
            
            // Esperar DOM
            if (document.readyState === 'loading') {
                await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
            }

            await this._cargarEmpresas();
            this._crearEstilos();
            await this._esperarContenedor();
            this._renderizar();
            this._configurarEventos();
            this._seleccionarEmpresaInicial();
            this._hacerDisponibleGlobalmente();
            
            this.estado.inicializado = true;
            console.log('✅ Gestor Principal inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error en Gestor Principal:', error);
        }
    }

    async _esperarContenedor() {
        return new Promise((resolve) => {
            const check = () => {
                if (document.getElementById('companySelector')) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    async _cargarEmpresas() {
        try {
            const datos = localStorage.getItem('grizalum_empresas');
            if (datos) {
                this.estado.empresas = JSON.parse(datos);
                console.log(`📂 Cargadas ${Object.keys(this.estado.empresas).length} empresas`);
            } else {
                this._crearEmpresasDefault();
            }
        } catch (error) {
            console.error('Error cargando empresas:', error);
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
                ubicacion: { distrito: 'Villa El Salvador', departamento: 'Lima' },
                finanzas: { caja: 124500, ingresos: 2847293, gastos: 344076, utilidadNeta: 165000, roi: 24.8 },
                meta: { fechaCreacion: new Date().toISOString(), activa: true }
            },
            'avicola-san-juan': {
                id: 'avicola-san-juan',
                nombre: 'Avícola San Juan',
                icono: '🐔',
                tema: 'verde',
                estado: 'Operativo',
                categoria: 'Agropecuario',
                ubicacion: { distrito: 'Cerro Colorado', departamento: 'Arequipa' },
                finanzas: { caja: 89300, ingresos: 1950000, gastos: 287500, utilidadNeta: 125000, roi: 18.5 },
                meta: { fechaCreacion: new Date().toISOString(), activa: true }
            },
            'comercial-lima': {
                id: 'comercial-lima',
                nombre: 'Comercial Lima',
                icono: '🏪',
                tema: 'azul',
                estado: 'Regular',
                categoria: 'Comercio',
                ubicacion: { distrito: 'La Victoria', departamento: 'Lima' },
                finanzas: { caja: 45200, ingresos: 950000, gastos: 780000, utilidadNeta: 170000, roi: 12.4 },
                meta: { fechaCreacion: new Date().toISOString(), activa: true }
            }
        };
        this._guardarEmpresas();
        console.log('📊 Empresas por defecto creadas');
    }

    _renderizar() {
        const contenedor = document.getElementById('companySelector');
        if (!contenedor) {
            console.error('⚠️ No se encontró #companySelector');
            return;
        }

        contenedor.innerHTML = this._generarHTML();
        this._actualizarListaEmpresas();
        console.log('🎨 Interfaz renderizada');
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
                            <div class="grizalum-empresa-estado">
                                ${this._generarEstadoEmpresa(empresaActual)}
                            </div>
                            <div class="grizalum-empresa-metricas">
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
                        <h4>🏢 Mis Empresas</h4>
                        <button class="grizalum-btn-nueva" onclick="alert('Función disponible en otros módulos')">
                            <i class="fas fa-plus"></i> Nueva
                        </button>
                    </div>
                    
                    <div class="grizalum-empresas-grid" id="grizalumEmpresasGrid">
                        <!-- Se llena dinámicamente -->
                    </div>
                    
                    <div class="grizalum-list-footer">
                        <div>📊 ${Object.keys(this.estado.empresas).length} empresas</div>
                        <div>💰 Total: S/. ${this._calcularTotalCaja().toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    _actualizarListaEmpresas() {
        const grid = document.getElementById('grizalumEmpresasGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        Object.entries(this.estado.empresas).forEach(([id, empresa]) => {
            const card = this._crearTarjetaEmpresa(id, empresa);
            grid.appendChild(card);
        });
    }

    _crearTarjetaEmpresa(id, empresa) {
        const esActiva = this.estado.empresaActual === id;
        const temaConfig = this.temaMapping[empresa.tema] || this.temaMapping.rojo;
        
        const card = document.createElement('div');
        card.className = `grizalum-empresa-card ${esActiva ? 'active' : ''}`;
        card.dataset.empresaId = id;
        
        card.innerHTML = `
            <div class="grizalum-card-avatar" style="background: linear-gradient(135deg, ${temaConfig.primary}, ${temaConfig.secondary});">
                ${empresa.icono}
            </div>
            <div class="grizalum-card-info">
                <div class="grizalum-card-nombre">${empresa.nombre}</div>
                <div class="grizalum-card-datos">
                    <div><i class="fas fa-map-marker-alt"></i> ${empresa.ubicacion?.distrito || 'Lima'}</div>
                    <div><i class="fas fa-coins"></i> S/. ${empresa.finanzas?.caja?.toLocaleString() || '0'}</div>
                </div>
            </div>
            <div class="grizalum-card-estado">${this._obtenerEmojiEstado(empresa.estado)}</div>
        `;
        
        card.addEventListener('click', () => {
            this.seleccionarEmpresa(id);
        });
        
        return card;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // API PRINCIPAL
    // ═══════════════════════════════════════════════════════════════════════════
    seleccionarEmpresa(empresaId) {
        if (!this.estado.empresas[empresaId]) {
            console.error(`❌ Empresa no encontrada: ${empresaId}`);
            return false;
        }

        const empresa = this.estado.empresas[empresaId];
        this.estado.empresaActual = empresaId;
        
        this._actualizarSelector();
        this._actualizarTarjetas();
        this._cerrarLista();
        this._aplicarTema(empresa);
        this._notificarCambio(empresaId, empresa);
        
        console.log(`✅ Empresa seleccionada: ${empresa.nombre}`);
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

        if (avatar) {
            avatar.textContent = empresa.icono;
            const tema = this.temaMapping[empresa.tema] || this.temaMapping.rojo;
            avatar.style.background = `linear-gradient(135deg, ${tema.primary}, ${tema.secondary})`;
        }
        
        if (nombre) nombre.textContent = empresa.nombre;
    }

    _actualizarTarjetas() {
        document.querySelectorAll('.grizalum-empresa-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const activa = document.querySelector(`[data-empresa-id="${this.estado.empresaActual}"]`);
        if (activa) activa.classList.add('active');
    }

    _cerrarLista() {
        this.estado.listaAbierta = false;
        document.getElementById('grizalumEmpresasList')?.classList.remove('show');
        document.getElementById('grizalumDropdownArrow')?.classList.remove('rotated');
    }

    _aplicarTema(empresa) {
        const tema = this.temaMapping[empresa.tema];
        if (!tema) return;

        if (window.grizalumFuturisticThemes && window.grizalumFuturisticThemes.changeTheme) {
            window.grizalumFuturisticThemes.changeTheme(tema.cssTheme);
        } else if (window.changeTheme) {
            window.changeTheme(tema.cssTheme);
        }
    }

    _notificarCambio(empresaId, empresa) {
        // Evento principal
        document.dispatchEvent(new CustomEvent('empresaSeleccionada', {
            detail: { empresaId, empresa },
            bubbles: true
        }));

        // Variable global
        window.empresaActual = { id: empresaId, nombre: empresa.nombre, datos: empresa };

        // Actualizar sistemas
        setTimeout(() => {
            if (window.actualizarMetricas) window.actualizarMetricas();
            if (window.actualizarGraficos) window.actualizarGraficos();
            if (window.actualizarInterfazCompleta) window.actualizarInterfazCompleta();
        }, 100);
    }

    _seleccionarEmpresaInicial() {
        const guardada = localStorage.getItem('grizalum_empresa_actual');
        const porDefecto = 'fundicion-laguna';
        const primera = Object.keys(this.estado.empresas)[0];
        
        if (guardada && this.estado.empresas[guardada]) {
            this.seleccionarEmpresa(guardada);
        } else if (this.estado.empresas[porDefecto]) {
            this.seleccionarEmpresa(porDefecto);
        } else if (primera) {
            this.seleccionarEmpresa(primera);
        }
    }

    _hacerDisponibleGlobalmente() {
        window.gestorEmpresas = this;
        window.cambiarEmpresaActiva = (id) => this.seleccionarEmpresa(id);
        window.obtenerDatosActuales = () => this.obtenerDatosActuales();
        
        // Compatibilidad con períodos
        window.changePeriod = (periodo, elemento) => {
            if (elemento) {
                document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
                elemento.classList.add('active');
            }
            setTimeout(() => {
                if (window.actualizarMetricas) window.actualizarMetricas();
                if (window.actualizarGraficos) window.actualizarGraficos();
            }, 100);
        };
    }

    _configurarEventos() {
        document.addEventListener('click', (evento) => {
            const container = document.querySelector('.grizalum-empresas-container');
            if (container && !container.contains(evento.target)) {
                this._cerrarLista();
            }
        });
    }

    _obtenerEmpresaActual() {
        return this.estado.empresas[this.estado.empresaActual];
    }

    _generarEstadoEmpresa(empresa) {
        if (!empresa) return '🟢 No seleccionada';
        return `${this._obtenerEmojiEstado(empresa.estado)} ${empresa.estado}`;
    }

    _obtenerEmojiEstado(estado) {
        const estados = {
            'Operativo': '🟢',
            'Regular': '🟡', 
            'Crítico': '🔴',
            'Mantenimiento': '🔧'
        };
        return estados[estado] || '🟢';
    }

    _calcularTotalCaja() {
        return Object.values(this.estado.empresas)
            .reduce((total, empresa) => total + (empresa.finanzas?.caja || 0), 0);
    }

    _guardarEmpresas() {
        try {
            localStorage.setItem('grizalum_empresas', JSON.stringify(this.estado.empresas));
            localStorage.setItem('grizalum_empresa_actual', this.estado.empresaActual);
        } catch (error) {
            console.error('Error guardando empresas:', error);
        }
    }

    _crearEstilos() {
        if (document.getElementById('grizalum-gestor-styles')) return;
        
        const estilos = document.createElement('style');
        estilos.id = 'grizalum-gestor-styles';
        estilos.textContent = `
            .grizalum-empresas-container {
                position: relative;
                min-width: 320px;
                font-family: 'Inter', sans-serif;
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
            
            .grizalum-dropdown-arrow {
                color: #6b7280;
                transition: transform 0.3s ease;
            }
            
            .grizalum-dropdown-arrow.rotated {
                transform: rotate(180deg);
            }
            
            .grizalum-empresas-list {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                width: 420px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-20px);
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .grizalum-empresas-list.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .grizalum-list-header {
                padding: 1.5rem;
                background: #f8fafc;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .grizalum-btn-nueva {
                background: #059669;
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
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
                transition: all 0.3s ease;
                margin-bottom: 0.5rem;
            }
            
            .grizalum-empresa-card:hover {
                background: #f8fafc;
                transform: translateX(5px);
            }
            
            .grizalum-empresa-card.active {
                background: rgba(220, 38, 38, 0.1);
                border: 1px solid #dc2626;
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
                color: #1f2937;
                margin-bottom: 0.25rem;
            }
            
            .grizalum-card-datos {
                font-size: 0.8rem;
                color: #6b7280;
                display: flex;
                flex-direction: column;
                gap: 0.125rem;
            }
            
            .grizalum-list-footer {
                padding: 1rem;
                background: #f8fafc;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                .grizalum-empresas-list {
                    width: 360px;
                    right: -10px;
                }
            }
        `;
        
        document.head.appendChild(estilos);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════════════════

let gestorEmpresas = null;

function inicializarGestorEmpresas() {
    if (gestorEmpresas) return gestorEmpresas;
    
    try {
        gestorEmpresas = new GestorEmpresasPrincipal();
        return gestorEmpresas;
    } catch (error) {
        console.error('❌ Error inicializando gestor:', error);
        return null;
    }
}

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGestorEmpresas);
} else {
    setTimeout(inicializarGestorEmpresas, 100);
}

// Funciones globales para compatibilidad
window.seleccionarEmpresa = (id) => gestorEmpresas?.seleccionarEmpresa(id);
window.editarEmpresaActual = (id) => console.log('Función de edición disponible en otros módulos');

console.log('🏢 Gestor de Empresas Principal v3.0 - ARREGLADO');
