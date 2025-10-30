/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - SISTEMA DE MÓDULOS v2.1 (FIX NAVEGACIÓN)
 * Arregla el problema de los 3 botones principales
 * ═══════════════════════════════════════════════════════════════════
 * 
 * PROBLEMA SOLUCIONADO:
 * - Los módulos ya no se destruyen al cambiar de vista
 * - Se mantiene el estado entre navegaciones
 * - Los 3 botones funcionan correctamente desde el inicio
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

class SistemaModulos {
    constructor() {
        this.modulos = new Map();
        this.moduloActual = null;
        this.inicializado = false;
        
        console.log('🎯 Sistema de Módulos v2.1 inicializado');
    }

    /**
     * Registrar un módulo nuevo
     */
    registrar(config) {
        const {
            id,
            nombre,
            ruta,
            nivel,
            dependencias = [],
            onCargar,
            onMostrar,
            onOcultar,
            onDestruir
        } = config;

        this.modulos.set(id, {
            id,
            nombre,
            ruta,
            nivel,
            dependencias,
            onCargar,
            onMostrar,
            onOcultar,
            onDestruir,
            instancia: null,
            cargado: false,
            activo: false
        });

        console.log(`📦 Módulo registrado: ${id}`);
    }

    /**
     * Activar módulo (MEJORADO - NO destruye)
     */
    async activar(moduloId) {
        console.log(`\n🔄 Activando módulo: ${moduloId}`);
        
        const modulo = this.modulos.get(moduloId);
        
        if (!modulo) {
            console.error(`❌ Módulo no encontrado: ${moduloId}`);
            return false;
        }

        try {
            // ═══════════════════════════════════════════════════════
            // PASO 1: Verificar nivel (solo si existe sistema de niveles)
            // ═══════════════════════════════════════════════════════
            if (!this._verificarAcceso(modulo)) {
                this._mostrarBloqueado(modulo);
                return false;
            }

            // ═══════════════════════════════════════════════════════
            // PASO 2: SOLO OCULTAR módulo actual (NO destruir)
            // ═══════════════════════════════════════════════════════
            if (this.moduloActual && this.moduloActual !== moduloId) {
                const moduloAnterior = this.modulos.get(this.moduloActual);
                if (moduloAnterior && moduloAnterior.activo) {
                    console.log(`   👁️‍🗨️ Ocultando: ${this.moduloActual}`);
                    
                    // Ejecutar callback onOcultar
                    if (moduloAnterior.onOcultar) {
                        await moduloAnterior.onOcultar();
                    }
                    
                    moduloAnterior.activo = false;
                }
            }

            // ═══════════════════════════════════════════════════════
            // PASO 3: Cargar módulo (si no está cargado)
            // ═══════════════════════════════════════════════════════
            if (!modulo.cargado) {
                await this._cargarModulo(modulo);
            } else {
                console.log(`   ℹ️ Módulo ${moduloId} ya estaba cargado (reutilizando)`);
            }

            // ═══════════════════════════════════════════════════════
            // PASO 4: Mostrar módulo
            // ═══════════════════════════════════════════════════════
            await this._mostrarModulo(modulo);

            this.moduloActual = moduloId;
            
            console.log(`✅ Módulo ${moduloId} activado\n`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error activando módulo ${moduloId}:`, error);
            return false;
        }
    }

    /**
     * Verificar acceso (compatible con sistema de niveles)
     */
    _verificarAcceso(modulo) {
        // Si no requiere nivel, siempre disponible
        if (!modulo.nivel || modulo.nivel === 0) {
            return true;
        }

        // Si no hay sistema de niveles, permitir acceso
        if (!window.grizalumNiveles && !window.sistemaNiveles) {
            console.warn('⚠️ Sistema de niveles no disponible, permitiendo acceso');
            return true;
        }

        const sistemaNiveles = window.grizalumNiveles || window.sistemaNiveles;

        // Obtener empresa actual
        const empresaActual = window.gestorEmpresas?.estado?.empresaActual;
        
        if (!empresaActual) {
            // Si no hay empresa, verificar si estamos en modo dev
            if (sistemaNiveles.modoDev) {
                console.log(`   🔧 Modo dev: Acceso permitido sin empresa`);
                return true;
            }
            
            console.warn('⚠️ No hay empresa seleccionada');
            return false;
        }

        // Obtener nivel de la empresa
        const nivelEmpresa = sistemaNiveles.obtenerNivelEmpresa(empresaActual);
        
        if (!nivelEmpresa) {
            console.warn('⚠️ No se pudo determinar nivel de empresa');
            return true; // Permitir por defecto
        }

        const scoreEmpresa = nivelEmpresa.score || nivelEmpresa.nivel?.scoreMin || 0;

        // Verificar si tiene el nivel requerido
        if (scoreEmpresa < modulo.nivel) {
            console.warn(`🔒 Módulo ${modulo.id} bloqueado. Requiere ${modulo.nivel}, tienes ${scoreEmpresa}`);
            return false;
        }

        return true;
    }

    /**
     * Mostrar módulo bloqueado
     */
    _mostrarBloqueado(modulo) {
        const contenedor = document.getElementById('contenedorVistas');
        if (!contenedor) return;

        contenedor.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 500px;
                padding: 40px;
                text-align: center;
            ">
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    width: 120px;
                    height: 120px;
                    border-radius: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 30px;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                ">
                    <i class="fas fa-lock" style="font-size: 48px; color: white;"></i>
                </div>
                
                <h2 style="
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--color-text);
                    margin-bottom: 15px;
                ">
                    Módulo Bloqueado
                </h2>
                
                <p style="
                    font-size: 16px;
                    color: var(--color-text-secondary);
                    max-width: 500px;
                    line-height: 1.6;
                    margin-bottom: 25px;
                ">
                    Este módulo requiere un nivel superior.<br>
                    Continúa usando GRIZALUM para desbloquearlo.
                </p>
            </div>
        `;
    }

    /**
     * Cargar módulo
     */
    async _cargarModulo(modulo) {
        console.log(`   📦 Cargando módulo: ${modulo.id}`);
        
        try {
            // Cargar dependencias
            for (const dep of modulo.dependencias) {
                await this._cargarDependencia(dep);
            }

            // Ejecutar callback onCargar
            if (modulo.onCargar) {
                console.log(`   🎯 Ejecutando onCargar de ${modulo.id}`);
                await modulo.onCargar();
            }

            modulo.cargado = true;
            console.log(`   ✅ Módulo ${modulo.id} cargado`);
            
        } catch (error) {
            console.error(`   ❌ Error cargando módulo:`, error);
            throw error;
        }
    }

    /**
     * Mostrar módulo
     */
    async _mostrarModulo(modulo) {
        console.log(`   👁️ Mostrando módulo: ${modulo.id}`);
        
        try {
            // Ejecutar callback onMostrar
            if (modulo.onMostrar) {
                await modulo.onMostrar();
            }

            modulo.activo = true;
            
            // Disparar evento
            window.dispatchEvent(new CustomEvent('grizalumModuloMostrado', {
                detail: { moduloId: modulo.id }
            }));
            
        } catch (error) {
            console.error(`   ❌ Error mostrando módulo:`, error);
            throw error;
        }
    }

    /**
     * Cargar dependencia
     */
    async _cargarDependencia(url) {
        return new Promise((resolve, reject) => {
            // Verificar si ya existe
            const existente = document.querySelector(`script[src="${url}"]`);
            if (existente) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = false;
            
            script.onload = () => {
                console.log(`   ✅ Dependencia cargada: ${url.split('/').pop()}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`   ❌ Error cargando: ${url}`);
                reject(new Error(`No se pudo cargar ${url}`));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Recargar módulo actual
     */
    async recargar() {
        if (!this.moduloActual) return;
        
        const modulo = this.modulos.get(this.moduloActual);
        if (!modulo) return;

        console.log(`🔄 Recargando módulo: ${this.moduloActual}`);
        
        if (modulo.onMostrar) {
            await modulo.onMostrar();
        }
    }

    /**
     * Obtener módulo actual
     */
    obtenerModuloActual() {
        return this.moduloActual;
    }

    /**
     * Verificar si módulo está cargado
     */
    estaCargado(moduloId) {
        const modulo = this.modulos.get(moduloId);
        return modulo ? modulo.cargado : false;
    }

    /**
     * Verificar si módulo está activo
     */
    estaActivo(moduloId) {
        const modulo = this.modulos.get(moduloId);
        return modulo ? modulo.activo : false;
    }

    /**
     * Listar módulos (útil para debug)
     */
    listarModulos() {
        const lista = [];
        this.modulos.forEach((modulo, id) => {
            lista.push({
                id: id,
                nombre: modulo.nombre,
                nivel: modulo.nivel || 0,
                cargado: modulo.cargado,
                activo: modulo.activo
            });
        });
        return lista;
    }
}

// ═══════════════════════════════════════════════════════════════════
// INSTANCIA GLOBAL
// ═══════════════════════════════════════════════════════════════════

window.grizalumModulos = new SistemaModulos();

// Debug helpers
window.debugModulos = {
    listar: () => console.table(window.grizalumModulos.listarModulos()),
    recargar: () => window.grizalumModulos.recargar(),
    moduloActual: () => window.grizalumModulos.obtenerModuloActual()
};

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎯 SISTEMA DE MÓDULOS v2.1 (FIX NAVEGACIÓN)                  ║
║  ✅ No destruye módulos al cambiar                            ║
║  ✅ Mantiene estado entre vistas                              ║
║  ✅ Los 3 botones funcionan correctamente                     ║
║  💡 Debug: window.debugModulos.listar()                       ║
╚═══════════════════════════════════════════════════════════════╝
`);
