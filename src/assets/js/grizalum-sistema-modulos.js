/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - SISTEMA DE MÓDULOS UNIFICADO v2.0
 * Gestiona el ciclo de vida de todos los módulos de la aplicación
 * ═══════════════════════════════════════════════════════════════════
 */

class SistemaModulos {
    constructor() {
        this.modulos = new Map();
        this.moduloActual = null;
        this.inicializado = false;
        
        console.log('🎯 Sistema de Módulos inicializado');
    }

    /**
     * Registrar un módulo nuevo
     */
    registrar(config) {
        const {
            id,                  // 'flujo-caja', 'estado-resultados', etc
            nombre,              // Nombre legible
            ruta,                // Ruta del HTML
            nivel,               // Nivel mínimo requerido
            dependencias = [],   // Scripts que necesita
            
            // Callbacks del ciclo de vida
            onCargar,           // Se ejecuta AL CARGAR el módulo
            onMostrar,          // Se ejecuta AL MOSTRAR (puede ser múltiples veces)
            onOcultar,          // Se ejecuta AL OCULTAR
            onDestruir          // Se ejecuta AL DESTRUIR/CAMBIAR de módulo
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
     * Cargar y mostrar un módulo
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
            // PASO 1: Verificar nivel de acceso
            // ═══════════════════════════════════════════════════════
            if (!this._verificarAcceso(modulo)) {
                this._mostrarBloqueado(modulo);
                return false;
            }

            // ═══════════════════════════════════════════════════════
            // PASO 2: Destruir módulo actual si existe
            // ═══════════════════════════════════════════════════════
            if (this.moduloActual && this.moduloActual !== moduloId) {
                await this._destruirModulo(this.moduloActual);
            }

            // ═══════════════════════════════════════════════════════
            // PASO 3: Cargar módulo (si no está cargado)
            // ═══════════════════════════════════════════════════════
            if (!modulo.cargado) {
                await this._cargarModulo(modulo);
            }

            // ═══════════════════════════════════════════════════════
            // PASO 4: Mostrar módulo
            // ═══════════════════════════════════════════════════════
            await this._mostrarModulo(modulo);

            this.moduloActual = moduloId;
            
            console.log(`✅ Módulo ${moduloId} activado correctamente`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error activando módulo ${moduloId}:`, error);
            return false;
        }
    }

    /**
     * Verificar si el usuario tiene acceso al módulo
     */
    _verificarAcceso(modulo) {
        if (!window.sistemaNiveles) {
            console.warn('⚠️ Sistema de niveles no disponible, permitiendo acceso');
            return true;
        }

        const empresaActual = window.gestorEmpresas?.estado?.empresaActual;
        if (!empresaActual) {
            console.warn('⚠️ No hay empresa seleccionada');
            return false;
        }

        const nivelEmpresa = window.sistemaNiveles.obtenerNivelEmpresa(empresaActual);
        const scoreEmpresa = nivelEmpresa?.score || 0;

        // Si el módulo requiere nivel, verificar
        if (modulo.nivel && scoreEmpresa < modulo.nivel) {
            console.warn(`🔒 Módulo ${modulo.id} bloqueado. Requiere nivel ${modulo.nivel}, tienes ${scoreEmpresa}`);
            return false;
        }

        return true;
    }

    /**
     * Mostrar pantalla de módulo bloqueado
     */
    _mostrarBloqueado(modulo) {
        const contenedor = document.getElementById('contenedorVistas');
        if (!contenedor) return;

        const nivelRequerido = this._obtenerNombreNivel(modulo.nivel);

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
                    Este módulo requiere <strong>Nivel ${nivelRequerido}</strong>.<br>
                    Continúa usando GRIZALUM y la IA te notificará cuando estés listo para desbloquearlo.
                </p>
                
                <div style="
                    background: var(--color-card-bg);
                    padding: 20px 30px;
                    border-radius: 12px;
                    border-left: 4px solid var(--color-accent);
                    max-width: 500px;
                    text-align: left;
                ">
                    <p style="
                        font-size: 14px;
                        color: var(--color-text-secondary);
                        margin: 0 0 10px 0;
                    ">
                        <i class="fas fa-lightbulb" style="color: var(--color-accent); margin-right: 8px;"></i>
                        <strong>¿Cómo desbloquear?</strong>
                    </p>
                    <ul style="
                        font-size: 14px;
                        color: var(--color-text-secondary);
                        margin: 0;
                        padding-left: 20px;
                    ">
                        <li>Usa más funciones de GRIZALUM</li>
                        <li>Registra más transacciones</li>
                        <li>Completa tareas sugeridas por la IA</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Cargar un módulo (HTML + CSS + JS + Dependencias)
     */
    async _cargarModulo(modulo) {
        console.log(`   📦 Cargando módulo: ${modulo.id}`);
        
        try {
            // 1. Cargar dependencias
            for (const dep of modulo.dependencias) {
                await this._cargarDependencia(dep);
            }

            // 2. Ejecutar callback onCargar si existe
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
     * Mostrar un módulo ya cargado
     */
    async _mostrarModulo(modulo) {
        console.log(`   👁️ Mostrando módulo: ${modulo.id}`);
        
        try {
            // Ejecutar callback onMostrar
            if (modulo.onMostrar) {
                await modulo.onMostrar();
            }

            modulo.activo = true;
            
            // Disparar evento global
            window.dispatchEvent(new CustomEvent('grizalumModuloMostrado', {
                detail: { moduloId: modulo.id }
            }));
            
        } catch (error) {
            console.error(`   ❌ Error mostrando módulo:`, error);
            throw error;
        }
    }

    /**
     * Destruir módulo actual
     */
    async _destruirModulo(moduloId) {
        const modulo = this.modulos.get(moduloId);
        if (!modulo || !modulo.activo) return;

        console.log(`   🗑️ Destruyendo módulo: ${moduloId}`);

        try {
            // Ejecutar callback onOcultar
            if (modulo.onOcultar) {
                await modulo.onOcultar();
            }

            // Ejecutar callback onDestruir
            if (modulo.onDestruir) {
                await modulo.onDestruir();
            }

            modulo.activo = false;

            // Limpiar instancia si existe
            if (modulo.instancia) {
                modulo.instancia = null;
            }

            console.log(`   ✅ Módulo ${moduloId} destruido`);
            
        } catch (error) {
            console.error(`   ❌ Error destruyendo módulo:`, error);
        }
    }

    /**
     * Cargar una dependencia (script externo)
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
     * Obtener nombre legible del nivel
     */
    _obtenerNombreNivel(score) {
        if (score <= 25) return 'INDIVIDUAL';
        if (score <= 50) return 'PROFESIONAL';
        if (score <= 75) return 'EMPRESARIAL';
        return 'CORPORATIVO';
    }

    /**
     * Recargar módulo actual
     */
    async recargar() {
        if (!this.moduloActual) return;
        
        const modulo = this.modulos.get(this.moduloActual);
        if (!modulo) return;

        console.log(`🔄 Recargando módulo: ${this.moduloActual}`);
        
        // Ejecutar onMostrar de nuevo (simula recarga)
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
     * Verificar si un módulo está cargado
     */
    estaCargado(moduloId) {
        const modulo = this.modulos.get(moduloId);
        return modulo ? modulo.cargado : false;
    }

    /**
     * Verificar si un módulo está activo
     */
    estaActivo(moduloId) {
        const modulo = this.modulos.get(moduloId);
        return modulo ? modulo.activo : false;
    }
}

// ═══════════════════════════════════════════════════════════════════
// INSTANCIA GLOBAL
// ═══════════════════════════════════════════════════════════════════

window.sistemaModulos = new SistemaModulos();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎯 SISTEMA DE MÓDULOS v2.0                                   ║
║  Gestión unificada del ciclo de vida                          ║
╚═══════════════════════════════════════════════════════════════╝
`);
