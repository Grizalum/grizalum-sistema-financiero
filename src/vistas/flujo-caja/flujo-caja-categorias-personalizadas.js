/**
 * ═══════════════════════════════════════════════════════════════════
 * 🏷️ GRIZALUM - SISTEMA DE CATEGORÍAS PERSONALIZADAS
 * Gestión de categorías individuales por empresa
 * ═══════════════════════════════════════════════════════════════════
 */

class CategoriasPersonalizadas {
    constructor() {
        this.empresaActual = null;
        this.categoriasDefault = null;
        this.categoriasPersonalizadas = {};
        
        this._inicializar();
    }

    async _inicializar() {
        // Esperar dependencias
        await this._esperarDependencias();
        
        // Cargar empresa actual
        this._cargarEmpresaActual();
        
        // Cargar categorías personalizadas
        this._cargarCategoriasPersonalizadas();
        
        // Configurar eventos
        this._configurarEventos();
        
        console.log('✅ [CategoríasPersonalizadas] Sistema listo');
    }

    async _esperarDependencias() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.gestorEmpresas && window.FlujoCajaConfig) {
                    resolve();
                } else {
                    setTimeout(verificar, 100);
                }
            };
            verificar();
        });
    }

    _cargarEmpresaActual() {
        this.empresaActual = window.gestorEmpresas?.estado?.empresaActual;
        
        if (!this.empresaActual) {
            console.error('❌ Empresa actual no disponible');
            return;
        }
        
        // Obtener categorías default de la industria
        const empresa = window.gestorEmpresas.estado.empresas[this.empresaActual];
        const industriaId = empresa?.perfilIndustrial || 'default';
        this.categoriasDefault = window.FlujoCajaConfig.obtenerCategorias(industriaId);
        
        console.log(`✅ Empresa: ${this.empresaActual}, Industria: ${industriaId}`);
    }

    _cargarCategoriasPersonalizadas() {
        const key = `grizalum_categorias_personalizadas_${this.empresaActual}`;
        const datos = localStorage.getItem(key);
        
        if (datos) {
            this.categoriasPersonalizadas = JSON.parse(datos);
            console.log('✅ Categorías personalizadas cargadas:', this.categoriasPersonalizadas);
        } else {
            this.categoriasPersonalizadas = { ingresos: [], gastos: [] };
            console.log('📋 Sin categorías personalizadas previas');
        }
    }

    _guardarCategoriasPersonalizadas() {
        const key = `grizalum_categorias_personalizadas_${this.empresaActual}`;
        localStorage.setItem(key, JSON.stringify(this.categoriasPersonalizadas));
        console.log('💾 Categorías personalizadas guardadas');
    }

    _configurarEventos() {
        // Evento: Cambio de empresa
        document.addEventListener('grizalumCompanyChanged', (e) => {
            const nuevaEmpresa = e.detail?.empresaId;
            
            if (nuevaEmpresa && nuevaEmpresa !== this.empresaActual) {
                console.log(`🔄 Cambio de empresa: ${this.empresaActual} → ${nuevaEmpresa}`);
                this.empresaActual = nuevaEmpresa;
                this._cargarEmpresaActual();
                this._cargarCategoriasPersonalizadas();
            }
        });
    }

    /**
     * Obtener todas las categorías (default + personalizadas)
     */
    obtenerCategorias(tipo) {
        const categoriasDefault = this.categoriasDefault?.[tipo === 'ingreso' ? 'ingresos' : 'gastos'] || [];
        const categoriasPersonalizadas = this.categoriasPersonalizadas[tipo === 'ingreso' ? 'ingresos' : 'gastos'] || [];
        
        // Combinar y eliminar duplicados
        const todas = [...new Set([...categoriasDefault, ...categoriasPersonalizadas])];
        
        return todas;
    }

    /**
     * Agregar categoría personalizada
     */
    agregarCategoria(tipo, nombreCategoria) {
        const tipoKey = tipo === 'ingreso' ? 'ingresos' : 'gastos';
        
        // Validar
        if (!nombreCategoria || nombreCategoria.trim() === '') {
            throw new Error('El nombre de la categoría no puede estar vacío');
        }
        
        nombreCategoria = nombreCategoria.trim();
        
        // Verificar si ya existe
        const todasCategorias = this.obtenerCategorias(tipo);
        if (todasCategorias.includes(nombreCategoria)) {
            throw new Error('Esta categoría ya existe');
        }
        
        // Agregar
        this.categoriasPersonalizadas[tipoKey].push(nombreCategoria);
        this._guardarCategoriasPersonalizadas();
        
        console.log(`✅ Categoría agregada: ${nombreCategoria} (${tipo})`);
        
        // Disparar evento
        document.dispatchEvent(new CustomEvent('grizalumCategoriaAgregada', {
            detail: { tipo, categoria: nombreCategoria }
        }));
        
        return true;
    }

    /**
     * Eliminar categoría personalizada
     */
    eliminarCategoria(tipo, nombreCategoria) {
        const tipoKey = tipo === 'ingreso' ? 'ingresos' : 'gastos';
        
        // Verificar que sea una categoría personalizada (no default)
        const categoriasDefault = this.categoriasDefault?.[tipoKey] || [];
        
        if (categoriasDefault.includes(nombreCategoria)) {
            throw new Error('No puedes eliminar categorías predeterminadas');
        }
        
        // Eliminar
        const index = this.categoriasPersonalizadas[tipoKey].indexOf(nombreCategoria);
        
        if (index > -1) {
            this.categoriasPersonalizadas[tipoKey].splice(index, 1);
            this._guardarCategoriasPersonalizadas();
            
            console.log(`🗑️ Categoría eliminada: ${nombreCategoria} (${tipo})`);
            
            // Disparar evento
            document.dispatchEvent(new CustomEvent('grizalumCategoriaEliminada', {
                detail: { tipo, categoria: nombreCategoria }
            }));
            
            return true;
        }
        
        return false;
    }

    /**
     * Verificar si una categoría es personalizada
     */
    esPersonalizada(tipo, nombreCategoria) {
        const tipoKey = tipo === 'ingreso' ? 'ingresos' : 'gastos';
        return this.categoriasPersonalizadas[tipoKey].includes(nombreCategoria);
    }
}

// Inicializar globalmente
window.categoriasPersonalizadas = new CategoriasPersonalizadas();

console.log('✅ [CategoríasPersonalizadas] Módulo cargado');
