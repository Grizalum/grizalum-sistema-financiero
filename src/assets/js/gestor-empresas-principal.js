/**
 * GRIZALUM GESTOR DE EMPRESAS v3.1 - FUNCIONAL
 * Sistema profesional sin errores de sintaxis
 * Colores independientes por empresa
 */

class GestorEmpresasProfesional {
    constructor() {
        this.config = {
            version: '3.1.0',
            empresaDefault: 'fundicion-laguna',
            regional: { moneda: 'S/.' },
            temaMapping: {
                'rojo': { id: 'rojo', cssTheme: 'red', primary: '#dc2626', secondary: '#b91c1c', name: 'Rojo Corporativo' },
                'azul': { id: 'azul', cssTheme: 'blue', primary: '#2563eb', secondary: '#1d4ed8', name: 'Azul Profesional' },
                'verde': { id: 'verde', cssTheme: 'green', primary: '#059669', secondary: '#047857', name: 'Verde Crecimiento' },
                'morado': { id: 'morado', cssTheme: 'purple', primary: '#7c3aed', secondary: '#6d28d9', name: 'Morado Innovación' },
                'dorado': { id: 'dorado', cssTheme: 'gold', primary: '#d97706', secondary: '#b45309', name: 'Dorado Premium' }
            }
        };

        this.estado = {
            inicializado: false,
            listaAbierta: false,
            empresaActual: null,
            empresas: {}
        };

        this.logoTemporal = null;
        this._inicializar();
    }

    async _inicializar() {
        try {
            await this._cargarEmpresas();
            this._crearEstilos();
            this._renderizarInterfaz();
            this._configurarEventos();
            this._seleccionarEmpresaInicial();
            
            this.estado.inicializado = true;
            console.log('✅ Gestor de Empresas inicializado correctamente');
            
            this._dispararEvento('gestorEmpresasListo', { version: this.config.version });
        } catch (error) {
            console.error('❌ Error al inicializar:', error);
            this._manejarError();
        }
    }

    async _cargarEmpresas() {
        try {
            const datosGuardados = localStorage.getItem('grizalum_empresas');
            if (datosGuardados) {
                this.estado.empresas = JSON.parse(datosGuardados);
            } else {
                this._crearEmpresasDefault();
                this._guardarEmpresas();
            }
        } catch (error) {
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
                finanzas: { caja: 124500, ingresos: 2847293, gastos: 1892847, utilidadNeta: 954446, margenNeto: 33.5, roi: 24.8 },
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
                finanzas: { caja: 89300, ingresos: 1850000, gastos: 1200000, utilidadNeta: 650000, margenNeto: 35.1, roi: 28.9 },
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
                finanzas: { caja: 45200, ingresos: 950000, gastos: 780000, utilidadNeta: 170000, margenNeto: 17.9, roi: 12.4 },
                meta: { fechaCreacion: new Date().toISOString(), activa: true }
            }
        };
    }

    _crearEstilos() {
        const styleId = 'grizalum-gestor-styles';
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .grizalum-empresas-container {
                position: relative;
                min-width: 320px;
                font-family: 'Inter', sans-serif;
            }
            
            .grizalum-empresa-selector {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #ffffff;
                border: 2px solid var(--grizalum-primary, #dc2626);
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
                background: linear-gradient(135deg, var(--grizalum-primary, #dc2626), var(--grizalum-secondary, #b91c1c));
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
            }
            
            .grizalum-empresas-list {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                width: 420px;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                border: 1px solid #e5e7eb;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-20px) scale(0.95);
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .grizalum-empresas-list.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            
            .grizalum-list-header {
                padding: 1.5rem;
                background: #f8fafc;
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
            }
            
            .grizalum-btn-nueva {
                background: linear-gradient(135deg, #059669, #047857);
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
                transition: all 0.3s ease;
                margin-bottom: 0.5rem;
                border: 1px solid transparent;
            }
            
            .grizalum-empresa-card:hover {
                background: #f8fafc;
                transform: translateX(5px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            }
            
            .grizalum-empresa-card.active {
                background: rgba(220, 38, 38, 0.1);
                border-color: #dc2626;
            }
            
            .grizalum-card-avatar {
                width: 45px;
                height: 45px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                transition: all 0.3s ease;
            }
            
            .grizalum-card-info {
                flex: 1;
            }
            
            .grizalum-card-nombre {
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
            }
            
            .grizalum-card-datos {
                font-size: 0.8rem;
                color: #6b7280;
            }
            
            .grizalum-card-finanzas {
                color: #059669;
                font-weight: 600;
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
                transition: all 0.3s ease;
                font-size: 0.8rem;
                background: #ffffff;
                color: #6b7280;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .grizalum-action-btn:hover {
                transform: scale(1.1);
            }
            
            .grizalum-btn-editar:hover {
                background: #3b82f6;
                color: white;
            }
            
            .grizalum-btn-admin:hover {
                background: #8b5cf6;
                color: white;
            }
            
            .grizalum-list-footer {
                padding: 1.25rem;
                background: #f8fafc;
                border-top: 1px solid #e5e7eb;
                text-align: center;
            }
            
            .grizalum-total-caja {
                font-size: 1.1rem;
                font-weight: 800;
                color: #059669;
            }
            
            @media (max-width: 768px) {
                .grizalum-empresas-list {
                    width: 360px;
                    right: -10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    _renderizarInterfaz() {
        const contenedor = document.getElementById('companySelector');
        if (!contenedor) {
            console.error('No se encontró #companySelector');
            return;
        }

        contenedor.innerHTML = this._generarHTML();
        this._actualizarLista();
    }

    _generarHTML() {
        const empresa = this._obtenerEmpresaActual();
        const total = this._calcularTotalCaja();

        return `
            <div class="grizalum-empresas-container">
                <div class="grizalum-empresa-selector" onclick="gestorEmpresas.alternarLista()">
                    <div class="grizalum-empresa-info">
                        <div class="grizalum-empresa-avatar" id="empresaAvatar">
                            ${empresa?.icono || '🏢'}
                        </div>
                        <div class="grizalum-empresa-details">
                            <div class="grizalum-empresa-nombre" id="empresaNombre">
                                ${empresa?.nombre || 'Seleccionar Empresa'}
                            </div>
                            <div class="grizalum-empresa-estado">
                                ${empresa?.estado || 'Sin seleccionar'}
                            </div>
                            <div class="grizalum-empresa-metricas">
                                💰 ${this.config.regional.moneda} ${empresa?.finanzas?.caja?.toLocaleString() || '0'}
                            </div>
                        </div>
                    </div>
                    <div class="grizalum-dropdown-arrow" id="dropdownArrow">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>

                <div class="grizalum-empresas-list" id="empresasList">
                    <div class="grizalum-list-header">
                        <h4 class="grizalum-list-title">🏢 Mis Empresas</h4>
                        <button class="grizalum-btn-nueva" onclick="gestorEmpresas.nuevaEmpresa()">
                            <i class="fas fa-plus"></i> Nueva
                        </button>
                    </div>
                    
                    <div class="grizalum-empresas-grid" id="empresasGrid">
                        <!-- Se llena dinámicamente -->
                    </div>
                    
                    <div class="grizalum-list-footer">
                        <div class="grizalum-total-caja">
                            <i class="fas fa-coins"></i>
                            Total: ${this.config.regional.moneda} ${total.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _actualizarLista() {
        const grid = document.getElementById('empresasGrid');
        if (!grid) return;

        grid.innerHTML = '';
        Object.entries(this.estado.empresas).forEach(([id, empresa]) => {
            const card = this._crearTarjeta(id, empresa);
            grid.appendChild(card);
        });
    }

    _crearTarjeta(id, empresa) {
        const esActiva = this.estado.empresaActual === id;
        const temaConfig = this.config.temaMapping[empresa.tema] || this.config.temaMapping.rojo;
        
        const card = document.createElement('div');
        card.className = `grizalum-empresa-card ${esActiva ? 'active' : ''}`;
        card.innerHTML = `
            <div class="grizalum-card-avatar" style="background: linear-gradient(135deg, ${temaConfig.primary}, ${temaConfig.secondary});">
                ${empresa.icono}
            </div>
            <div class="grizalum-card-info">
                <div class="grizalum-card-nombre">${empresa.nombre}</div>
                <div class="grizalum-card-datos">
                    <div>📍 ${empresa.ubicacion?.distrito}, ${empresa.ubicacion?.departamento}</div>
                    <div class="grizalum-card-finanzas">💰 ${this.config.regional.moneda} ${empresa.finanzas?.caja?.toLocaleString()}</div>
                </div>
            </div>
            <div class="grizalum-card-actions">
                <button class="grizalum-action-btn grizalum-btn-editar" onclick="gestorEmpresas.editarEmpresa('${id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="grizalum-action-btn grizalum-btn-admin" onclick="gestorEmpresas.adminEmpresa('${id}')" title="Admin">
                    <i class="fas fa-crown"></i>
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

    // API PÚBLICA
    seleccionarEmpresa(empresaId) {
        const empresa = this.estado.empresas[empresaId];
        if (!empresa) return false;

        this.estado.empresaActual = empresaId;
        
        // Aplicar tema específico de la empresa
        this._aplicarTemaEmpresa(empresa);
        
        // Actualizar interfaz
        this._actualizarSelector();
        this._actualizarTarjetasActivas();
        this._cerrarLista();
        
        // Notificar cambio
        this._dispararEventoCambio(empresaId, empresa);
        
        console.log(`Empresa seleccionada: ${empresa.nombre}`);
        return true;
    }

    _aplicarTemaEmpresa(empresa) {
        const temaConfig = this.config.temaMapping[empresa.tema];
        if (!temaConfig) return;

        // Marcar empresa en el body
        document.body.setAttribute('data-company', empresa.id);
        
        // Aplicar variables CSS específicas
        document.documentElement.style.setProperty('--grizalum-primary', temaConfig.primary);
        document.documentElement.style.setProperty('--grizalum-secondary', temaConfig.secondary);
        
        // Conectar con motor de temas si existe
        if (window.changeThemeForCompany) {
            window.changeThemeForCompany(temaConfig.cssTheme, empresa.id);
        }
    }

    _actualizarSelector() {
        const empresa = this._obtenerEmpresaActual();
        if (!empresa) return;

        const avatar = document.getElementById('empresaAvatar');
        const nombre = document.getElementById('empresaNombre');
        
        if (avatar) {
            avatar.textContent = empresa.icono;
            const temaConfig = this.config.temaMapping[empresa.tema];
            avatar.style.background = `linear-gradient(135deg, ${temaConfig.primary}, ${temaConfig.secondary})`;
        }
        
        if (nombre) {
            nombre.textContent = empresa.nombre;
        }
    }

    _actualizarTarjetasActivas() {
        document.querySelectorAll('.grizalum-empresa-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const empresaCard = Array.from(document.querySelectorAll('.grizalum-empresa-card'))
            .find(card => card.innerHTML.includes(this.estado.empresaActual));
        
        if (empresaCard) {
            empresaCard.classList.add('active');
        }
    }

    alternarLista() {
        this.estado.listaAbierta = !this.estado.listaAbierta;
        
        const lista = document.getElementById('empresasList');
        const arrow = document.getElementById('dropdownArrow');
        
        if (this.estado.listaAbierta) {
            lista?.classList.add('show');
            arrow?.classList.add('rotated');
            this._actualizarLista();
        } else {
            lista?.classList.remove('show');
            arrow?.classList.remove('rotated');
        }
    }

    _cerrarLista() {
        this.estado.listaAbierta = false;
        document.getElementById('empresasList')?.classList.remove('show');
        document.getElementById('dropdownArrow')?.classList.remove('rotated');
    }

    _configurarEventos() {
        document.addEventListener('click', (e) => {
            const container = document.querySelector('.grizalum-empresas-container');
            if (container && !container.contains(e.target)) {
                this._cerrarLista();
            }
        });
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

    _dispararEventoCambio(empresaId, empresa) {
        const evento = new CustomEvent('empresaSeleccionada', {
            detail: { empresaId, empresa },
            bubbles: true
        });
        document.dispatchEvent(evento);
        
        window.empresaActual = { id: empresaId, nombre: empresa.nombre };
        
        // Conectar con sistemas externos
        setTimeout(() => {
            if (window.actualizarInterfazCompleta) window.actualizarInterfazCompleta();
            if (window.actualizarMetricas) window.actualizarMetricas();
            if (window.actualizarGraficos) window.actualizarGraficos();
        }, 100);
    }

    _dispararEvento(nombre, datos) {
        document.dispatchEvent(new CustomEvent(nombre, { detail: datos, bubbles: true }));
    }

    // Métodos auxiliares
    _obtenerEmpresaActual() {
        return this.estado.empresas[this.estado.empresaActual];
    }

    _calcularTotalCaja() {
        return Object.values(this.estado.empresas)
            .reduce((total, empresa) => total + (empresa.finanzas?.caja || 0), 0);
    }

    _guardarEmpresas() {
        localStorage.setItem('grizalum_empresas', JSON.stringify(this.estado.empresas));
    }

    _manejarError() {
        const contenedor = document.getElementById('companySelector');
        if (contenedor) {
            contenedor.innerHTML = `
                <div style="padding: 1rem; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; color: #dc2626;">
                    <strong>⚠️ Error del Gestor</strong>
                    <p>Recarga la página</p>
                    <button onclick="location.reload()" style="background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        Recargar
                    </button>
                </div>
            `;
        }
    }

    // Métodos públicos adicionales
    nuevaEmpresa() {
        console.log('Crear nueva empresa - Funcionalidad básica');
        alert('Funcionalidad de nueva empresa próximamente');
    }

    editarEmpresa(empresaId) {
        console.log('Editar empresa:', empresaId);
        alert(`Editar empresa: ${this.estado.empresas[empresaId]?.nombre}`);
    }

    adminEmpresa(empresaId) {
        console.log('Admin empresa:', empresaId);
        alert(`Panel admin: ${this.estado.empresas[empresaId]?.nombre}`);
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
}

// INICIALIZACIÓN GLOBAL
let gestorEmpresas = null;

function inicializarGestor() {
    if (!gestorEmpresas) {
        gestorEmpresas = new GestorEmpresasProfesional();
        window.gestorEmpresas = gestorEmpresas;
    }
    return gestorEmpresas;
}

// Función global para compatibilidad
function editarEmpresaActual(empresaId) {
    if (window.gestorEmpresas && empresaId) {
        window.gestorEmpresas.editarEmpresa(empresaId);
    }
}

// INICIALIZACIÓN AUTOMÁTICA
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGestor);
} else {
    setTimeout(inicializarGestor, 100);
}

console.log('✅ Gestor de Empresas FUNCIONAL cargado correctamente');
