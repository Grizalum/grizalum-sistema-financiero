/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - SISTEMA DE MÓDULOS PERSONALIZABLES
 * Permite a cada empresa activar/desactivar funcionalidades
 * ═══════════════════════════════════════════════════════════════════
 */

class SistemaModulosEmpresas {
    constructor() {
        this.gestor = null;
        this.empresaActual = null;
        
        // Catálogo completo de módulos disponibles
        this.catalogoModulos = {
            'flujo-caja': {
                id: 'flujo-caja',
                nombre: 'Flujo de Caja',
                icono: '💰',
                descripcion: 'Gestión de ingresos y egresos',
                categoria: 'Finanzas',
                nivel: 'basico',
                elementosDOM: ['#moduloFlujoCaja', '.menu-flujo-caja'],
                dependencias: []
            },
            'inventario': {
                id: 'inventario',
                nombre: 'Inventario',
                icono: '📦',
                descripcion: 'Control de productos y stock',
                categoria: 'Operaciones',
                nivel: 'intermedio',
                elementosDOM: ['#moduloInventario', '.menu-inventario'],
                dependencias: []
            },
            'facturacion': {
                id: 'facturacion',
                nombre: 'Facturación',
                icono: '🧾',
                descripcion: 'Emisión de facturas y comprobantes',
                categoria: 'Ventas',
                nivel: 'intermedio',
                elementosDOM: ['#moduloFacturacion', '.menu-facturacion'],
                dependencias: ['flujo-caja']
            },
            'clientes': {
                id: 'clientes',
                nombre: 'Clientes (CRM)',
                icono: '👥',
                descripcion: 'Gestión de clientes y ventas',
                categoria: 'Ventas',
                nivel: 'intermedio',
                elementosDOM: ['#moduloClientes', '.menu-clientes'],
                dependencias: []
            },
            'empleados': {
                id: 'empleados',
                nombre: 'Empleados',
                icono: '👷',
                descripcion: 'Gestión de personal y planilla',
                categoria: 'Recursos Humanos',
                nivel: 'avanzado',
                elementosDOM: ['#moduloEmpleados', '.menu-empleados'],
                dependencias: ['flujo-caja']
            },
            'reportes': {
                id: 'reportes',
                nombre: 'Reportes',
                icono: '📊',
                descripcion: 'Reportes y análisis avanzados',
                categoria: 'Análisis',
                nivel: 'intermedio',
                elementosDOM: ['#moduloReportes', '.menu-reportes'],
                dependencias: ['flujo-caja']
            },
            'proyectos': {
                id: 'proyectos',
                nombre: 'Proyectos',
                icono: '🎯',
                descripcion: 'Gestión de proyectos y tareas',
                categoria: 'Operaciones',
                nivel: 'avanzado',
                elementosDOM: ['#moduloProyectos', '.menu-proyectos'],
                dependencias: []
            },
            'contabilidad': {
                id: 'contabilidad',
                nombre: 'Contabilidad',
                icono: '📚',
                descripcion: 'Libro diario, mayor y balances',
                categoria: 'Finanzas',
                nivel: 'avanzado',
                elementosDOM: ['#moduloContabilidad', '.menu-contabilidad'],
                dependencias: ['flujo-caja']
            }
        };
        
        console.log('🧩 Sistema de Módulos inicializando...');
        this._esperarGestor();
    }

    _esperarGestor() {
        const intentar = () => {
            if (window.gestorEmpresas) {
                this.gestor = window.gestorEmpresas;
                console.log('✅ Sistema de Módulos conectado');
                this._inicializar();
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

    _inicializar() {
        // Escuchar cambios de empresa
        document.addEventListener('grizalumCompanyChanged', (e) => {
            this.empresaActual = e.detail.companyId;
            this._aplicarModulosActivos();
        });

        // Inicializar módulos por defecto si no existen
        this._inicializarModulosPorDefecto();
        
        console.log('✅ Sistema de Módulos listo');
    }

    _inicializarModulosPorDefecto() {
        Object.values(this.gestor.estado.empresas).forEach(empresa => {
            if (!empresa.modulosActivos) {
                // Módulos básicos activos por defecto
                empresa.modulosActivos = {
                    'flujo-caja': true,
                    'inventario': false,
                    'facturacion': false,
                    'clientes': false,
                    'empleados': false,
                    'reportes': true,
                    'proyectos': false,
                    'contabilidad': false
                };
            }
        });
        
        this.gestor._guardarEmpresas();
    }

    _aplicarModulosActivos() {
        if (!this.empresaActual) return;
        
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        if (!empresa || !empresa.modulosActivos) return;

        // Ocultar todos primero
        Object.values(this.catalogoModulos).forEach(modulo => {
            modulo.elementosDOM.forEach(selector => {
                const elemento = document.querySelector(selector);
                if (elemento) {
                    elemento.style.display = 'none';
                }
            });
        });

        // Mostrar solo los activos
        Object.entries(empresa.modulosActivos).forEach(([moduloId, activo]) => {
            if (activo && this.catalogoModulos[moduloId]) {
                const modulo = this.catalogoModulos[moduloId];
                modulo.elementosDOM.forEach(selector => {
                    const elemento = document.querySelector(selector);
                    if (elemento) {
                        elemento.style.display = '';
                    }
                });
            }
        });

        console.log(`✅ Módulos aplicados para: ${empresa.nombre}`);
    }

    abrirPanelModulos() {
        if (!this.empresaActual) {
            alert('⚠️ Selecciona una empresa primero');
            return;
        }

        this._crearModalModulos();
    }

    _crearModalModulos() {
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        
        const modal = document.createElement('div');
        modal.className = 'grizalum-modal-modulos';
        modal.id = 'grizalumModalModulos';

        modal.innerHTML = `
            <div class="grizalum-modal-modulos-contenido">
                ${this._generarHeaderModulos(empresa)}
                ${this._generarBodyModulos(empresa)}
                ${this._generarFooterModulos()}
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        this._configurarEventosModulos();
    }

    _generarHeaderModulos(empresa) {
        return `
            <div class="modulos-header">
                <div class="modulos-header-info">
                    <div class="modulos-icono">🧩</div>
                    <div>
                        <h2>Personalizar Módulos</h2>
                        <p>${empresa.nombre}</p>
                    </div>
                </div>
                <button class="modulos-btn-cerrar" onclick="sistemaModulos.cerrar()">✕</button>
            </div>
        `;
    }

    _generarBodyModulos(empresa) {
        const categorias = this._agruparPorCategoria();
        
        let html = '<div class="modulos-body">';
        
        // Explicación
        html += `
            <div class="modulos-explicacion">
                <div class="explicacion-icono">💡</div>
                <div class="explicacion-texto">
                    <strong>Personaliza tu experiencia</strong>
                    <p>Activa solo los módulos que necesitas. Puedes cambiarlos en cualquier momento.</p>
                </div>
            </div>
        `;

        // Módulos por categoría
        Object.entries(categorias).forEach(([categoria, modulos]) => {
            html += `
                <div class="modulos-categoria">
                    <h3 class="categoria-titulo">${categoria}</h3>
                    <div class="modulos-grid">
                        ${modulos.map(modulo => this._generarTarjetaModulo(modulo, empresa)).join('')}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    _generarTarjetaModulo(modulo, empresa) {
        const activo = empresa.modulosActivos[modulo.id];
        const nivelColor = {
            'basico': '#10b981',
            'intermedio': '#f59e0b',
            'avanzado': '#8b5cf6'
        };

        return `
            <div class="modulo-tarjeta ${activo ? 'activa' : ''}" data-modulo="${modulo.id}">
                <div class="modulo-header">
                    <div class="modulo-icono">${modulo.icono}</div>
                    <div class="modulo-toggle">
                        <label class="switch">
                            <input type="checkbox" 
                                   ${activo ? 'checked' : ''} 
                                   onchange="sistemaModulos.toggleModulo('${modulo.id}', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div class="modulo-info">
                    <h4>${modulo.nombre}</h4>
                    <p>${modulo.descripcion}</p>
                    <div class="modulo-nivel" style="background: ${nivelColor[modulo.nivel]}20; color: ${nivelColor[modulo.nivel]}">
                        ${modulo.nivel.charAt(0).toUpperCase() + modulo.nivel.slice(1)}
                    </div>
                </div>
            </div>
        `;
    }

    _agruparPorCategoria() {
        const categorias = {};
        
        Object.values(this.catalogoModulos).forEach(modulo => {
            if (!categorias[modulo.categoria]) {
                categorias[modulo.categoria] = [];
            }
            categorias[modulo.categoria].push(modulo);
        });
        
        return categorias;
    }

    _generarFooterModulos() {
        return `
            <div class="modulos-footer">
                <button class="btn-modulos-cancelar" onclick="sistemaModulos.cerrar()">
                    Cancelar
                </button>
                <button class="btn-modulos-guardar" onclick="sistemaModulos.guardarYCerrar()">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        `;
    }

    toggleModulo(moduloId, activo) {
        if (!this.empresaActual) return;
        
        const empresa = this.gestor.estado.empresas[this.empresaActual];
        empresa.modulosActivos[moduloId] = activo;
        
        // Actualizar UI de la tarjeta
        const tarjeta = document.querySelector(`[data-modulo="${moduloId}"]`);
        if (tarjeta) {
            if (activo) {
                tarjeta.classList.add('activa');
            } else {
                tarjeta.classList.remove('activa');
            }
        }
        
        console.log(`${activo ? '✅' : '❌'} Módulo ${moduloId}`);
    }

    guardarYCerrar() {
        this.gestor._guardarEmpresas();
        this._aplicarModulosActivos();
        this.cerrar();
        
        setTimeout(() => {
            alert('✅ Módulos actualizados correctamente');
            location.reload(); // Recargar para aplicar cambios
        }, 200);
    }

    cerrar() {
        const modal = document.getElementById('grizalumModalModulos');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    _configurarEventosModulos() {
        const modal = document.getElementById('grizalumModalModulos');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.cerrar();
        });
    }
}

// Inicialización
window.sistemaModulos = new SistemaModulosEmpresas();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🧩 SISTEMA DE MÓDULOS PERSONALIZABLES                        ║
║  Cada empresa activa solo lo que necesita                     ║
╚═══════════════════════════════════════════════════════════════╝
`);
