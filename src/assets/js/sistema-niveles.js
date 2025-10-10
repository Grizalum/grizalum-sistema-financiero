/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - SISTEMA DE NIVELES ADAPTATIVOS
 * Cerebro que determina qué mostrar a cada empresa según su madurez
 * ═══════════════════════════════════════════════════════════════════
 */

class SistemaNiveles {
    constructor() {
        this.config = {
            version: '1.0.0',
            componente: 'SistemaNiveles',
            debug: true
        };

        this.empresas = {};
        this.gestor = null;
        
        // Factores de score
        this.factores = {
            tamano: {
                'solo': 5,
                'micro': 15,
                'pequena': 30,
                'mediana': 50,
                'grande': 70
            },
            volumenNegocio: {
                'bajo': 5,
                'medio': 15,
                'alto': 30,
                'muy-alto': 50
            },
            experiencia: {
                'ninguna': 0,
                'basica': 20,
                'avanzada': 50
            },
            complejidad: {
                'simple': 5,
                'intermedio': 20,
                'complejo': 40
            },
            preferencia: {
                'minimo': -10,
                'balanceado': 0,
                'completo': 20
            }
        };

        // Rangos de niveles
        this.rangos = {
            inicial: { min: 0, max: 30, nombre: 'Inicial', icono: '🌱', descripcion: 'Comenzando' },
            crecimiento: { min: 31, max: 60, nombre: 'Crecimiento', icono: '🌿', descripcion: 'En desarrollo' },
            profesional: { min: 61, max: 85, nombre: 'Profesional', icono: '🌳', descripcion: 'Consolidado' },
            elite: { min: 86, max: 100, nombre: 'Elite', icono: '🏆', descripcion: 'Nivel experto' }
        };

        this._inicializar();
    }

    async _inicializar() {
        try {
            this._log('info', '🧠 Sistema de Niveles inicializando...');
            
            // Esperar gestor de empresas
            await this._esperarGestor();
            
            // Cargar datos guardados
            await this._cargarDatos();
            
            // Escuchar eventos
            this._configurarEventos();
            
            this._log('success', '✅ Sistema de Niveles listo');
            
        } catch (error) {
            this._log('error', 'Error inicializando Sistema de Niveles:', error);
        }
    }

    async _esperarGestor() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.gestorEmpresas) {
                    this.gestor = window.gestorEmpresas;
                    this._log('info', '✅ Gestor de Empresas conectado');
                    resolve();
                } else {
                    setTimeout(verificar, 500);
                }
            };
            verificar();
        });
    }

    async _cargarDatos() {
        try {
            const datos = localStorage.getItem('grizalum_niveles_empresas');
            if (datos) {
                this.empresas = JSON.parse(datos);
                this._log('info', `Cargados niveles de ${Object.keys(this.empresas).length} empresas`);
            }
        } catch (error) {
            this._log('warn', 'No se pudieron cargar niveles guardados');
        }
    }

    _configurarEventos() {
        // Escuchar cuando se completa el onboarding
        document.addEventListener('grizalumOnboardingCompletado', (e) => {
            this._procesarOnboarding(e.detail);
        });

        // Escuchar cambio de empresa
        document.addEventListener('grizalumCompanyChanged', (e) => {
            this._cargarNivelEmpresa(e.detail.companyId);
        });
    }

    /**
     * CALCULAR SCORE INICIAL DESDE ONBOARDING
     */
    calcularScoreInicial(empresaId, respuestasOnboarding) {
        this._log('info', `📊 Calculando score inicial para: ${empresaId}`);
        
        let score = 0;
        
        // Factor 1: Tamaño empresa
        const tamano = respuestasOnboarding.tamano;
        if (tamano && this.factores.tamano[tamano]) {
            score += this.factores.tamano[tamano];
            this._log('debug', `  Tamaño (${tamano}): +${this.factores.tamano[tamano]}`);
        }
        
        // Factor 2: Volumen de negocio
        const volumen = respuestasOnboarding['volumen-negocio'];
        if (volumen && this.factores.volumenNegocio[volumen]) {
            score += this.factores.volumenNegocio[volumen];
            this._log('debug', `  Volumen (${volumen}): +${this.factores.volumenNegocio[volumen]}`);
        }
        
        // Factor 3: Experiencia del usuario
        const experiencia = respuestasOnboarding.experiencia;
        if (experiencia && this.factores.experiencia[experiencia]) {
            score += this.factores.experiencia[experiencia];
            this._log('debug', `  Experiencia (${experiencia}): +${this.factores.experiencia[experiencia]}`);
        }
        
        // Factor 4: Complejidad de operaciones
        const complejidad = respuestasOnboarding['complejidad-operaciones'];
        if (complejidad && this.factores.complejidad[complejidad]) {
            score += this.factores.complejidad[complejidad];
            this._log('debug', `  Complejidad (${complejidad}): +${this.factores.complejidad[complejidad]}`);
        }
        
        // Factor 5: Preferencia del usuario
        const preferencia = respuestasOnboarding.preferencia;
        if (preferencia && this.factores.preferencia[preferencia]) {
            score += this.factores.preferencia[preferencia];
            this._log('debug', `  Preferencia (${preferencia}): ${this.factores.preferencia[preferencia] >= 0 ? '+' : ''}${this.factores.preferencia[preferencia]}`);
        }
        
        // Asegurar que esté en rango 0-100
        score = Math.max(0, Math.min(100, score));
        
        this._log('success', `✅ Score inicial calculado: ${score}`);
        
        return score;
    }

    /**
     * PROCESAR DATOS DEL ONBOARDING
     */
    _procesarOnboarding(data) {
        const { empresaId, respuestas } = data;
        
        if (!empresaId || !respuestas) {
            this._log('error', 'Datos de onboarding incompletos');
            return;
        }
        
        const scoreInicial = this.calcularScoreInicial(empresaId, respuestas);
        const nivelInfo = this._obtenerNivelPorScore(scoreInicial);
        
        // Guardar información de la empresa
        this.empresas[empresaId] = {
            score: scoreInicial,
            nivel: nivelInfo.nombre,
            respuestasOnboarding: respuestas,
            fechaCreacion: new Date().toISOString(),
            ultimaActualizacion: new Date().toISOString(),
            historialScore: [
                {
                    fecha: new Date().toISOString(),
                    score: scoreInicial,
                    motivo: 'Onboarding inicial'
                }
            ],
            usoComponentes: {},
            componentesOcultos: [],
            componentesDesbloqueados: []
        };
        
        this._guardarDatos();
        
        this._log('success', `✅ Empresa ${empresaId} posicionada en nivel ${nivelInfo.nombre} (Score: ${scoreInicial})`);
        
        // Disparar evento
        this._dispararEvento('nivelEmpresaCalculado', {
            empresaId,
            score: scoreInicial,
            nivel: nivelInfo,
            componentes: this._determinarComponentesActivos(empresaId)
        });
    }

    /**
     * OBTENER NIVEL POR SCORE
     */
    _obtenerNivelPorScore(score) {
        for (const [key, rango] of Object.entries(this.rangos)) {
            if (score >= rango.min && score <= rango.max) {
                return { ...rango, key };
            }
        }
        return this.rangos.inicial;
    }

    /**
     * DETERMINAR QUÉ COMPONENTES ACTIVAR
     */
    _determinarComponentesActivos(empresaId) {
        const empresa = this.empresas[empresaId];
        if (!empresa) return {};
        
        const score = empresa.score;
        const componentesOcultos = empresa.componentesOcultos || [];
        
        // Componentes base (siempre activos)
        const componentes = {
            core: {
                registroRapido: true,
                visualizacionBasica: true,
                balance: true
            },
            mejoras: {
                categorias: score >= 15,
                graficosAvanzados: score >= 30,
                filtros: score >= 25,
                exportar: score >= 35,
                proyecciones: score >= 50,
                analisisTendencias: score >= 60,
                escenarios: score >= 75,
                metricsAvanzadas: score >= 80
            }
        };
        
        // Aplicar componentes ocultos manualmente por el usuario
        componentesOcultos.forEach(comp => {
            if (componentes.mejoras[comp] !== undefined) {
                componentes.mejoras[comp] = false;
            }
        });
        
        return componentes;
    }

    /**
     * REGISTRAR USO DE COMPONENTE
     */
    registrarUso(empresaId, componente) {
        const empresa = this.empresas[empresaId];
        if (!empresa) return;
        
        if (!empresa.usoComponentes[componente]) {
            empresa.usoComponentes[componente] = {
                vecesUsado: 0,
                primeraVez: new Date().toISOString(),
                ultimoUso: null
            };
        }
        
        empresa.usoComponentes[componente].vecesUsado++;
        empresa.usoComponentes[componente].ultimoUso = new Date().toISOString();
        
        // Aumentar score por uso activo
        if (empresa.usoComponentes[componente].vecesUsado === 10) {
            this.ajustarScore(empresaId, 2, `Uso activo de ${componente}`);
        }
        
        this._guardarDatos();
    }

    /**
     * AJUSTAR SCORE DINÁMICAMENTE
     */
    ajustarScore(empresaId, cambio, motivo) {
        const empresa = this.empresas[empresaId];
        if (!empresa) return;
        
        const scoreAnterior = empresa.score;
        empresa.score = Math.max(0, Math.min(100, empresa.score + cambio));
        
        empresa.historialScore.push({
            fecha: new Date().toISOString(),
            scoreAnterior,
            scoreNuevo: empresa.score,
            cambio,
            motivo
        });
        
        empresa.ultimaActualizacion = new Date().toISOString();
        
        const nivelNuevo = this._obtenerNivelPorScore(empresa.score);
        const nivelAnterior = empresa.nivel;
        
        empresa.nivel = nivelNuevo.nombre;
        
        this._guardarDatos();
        
        this._log('info', `📈 Score ajustado: ${scoreAnterior} → ${empresa.score} (${motivo})`);
        
        // Si cambió de nivel, notificar
        if (nivelAnterior !== nivelNuevo.nombre) {
            this._notificarCambioNivel(empresaId, nivelAnterior, nivelNuevo);
        }
    }

    /**
     * OCULTAR COMPONENTE MANUALMENTE
     */
    ocultarComponente(empresaId, componente) {
        const empresa = this.empresas[empresaId];
        if (!empresa) return;
        
        if (!empresa.componentesOcultos.includes(componente)) {
            empresa.componentesOcultos.push(componente);
            this._guardarDatos();
            
            this._log('info', `👁️ Componente "${componente}" ocultado para ${empresaId}`);
            
            this._dispararEvento('componenteOculto', { empresaId, componente });
        }
    }

    /**
     * MOSTRAR COMPONENTE OCULTO
     */
    mostrarComponente(empresaId, componente) {
        const empresa = this.empresas[empresaId];
        if (!empresa) return;
        
        const index = empresa.componentesOcultos.indexOf(componente);
        if (index > -1) {
            empresa.componentesOcultos.splice(index, 1);
            this._guardarDatos();
            
            this._log('info', `👁️ Componente "${componente}" mostrado para ${empresaId}`);
            
            this._dispararEvento('componenteMostrado', { empresaId, componente });
        }
    }

    /**
     * OBTENER INFORMACIÓN DE NIVEL ACTUAL
     */
    obtenerNivelEmpresa(empresaId) {
        const empresa = this.empresas[empresaId];
        if (!empresa) return null;
        
        const nivelInfo = this._obtenerNivelPorScore(empresa.score);
        
        return {
            score: empresa.score,
            nivel: nivelInfo,
            componentesActivos: this._determinarComponentesActivos(empresaId),
            componentesOcultos: empresa.componentesOcultos || [],
            historial: empresa.historialScore || []
        };
    }

    /**
     * NOTIFICAR CAMBIO DE NIVEL
     */
    _notificarCambioNivel(empresaId, nivelAnterior, nivelNuevo) {
        this._log('success', `🎉 ¡Nivel subió! ${nivelAnterior} → ${nivelNuevo.nombre}`);
        
        this._dispararEvento('cambioNivel', {
            empresaId,
            nivelAnterior,
            nivelNuevo,
            nuevosComponentes: this._determinarComponentesActivos(empresaId)
        });
        
        // Mostrar notificación al usuario
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion({
                tipo: 'success',
                titulo: '🎉 ¡Nivel Desbloqueado!',
                mensaje: `Tu empresa subió a nivel ${nivelNuevo.nombre}. Nuevas herramientas disponibles.`,
                duracion: 5000
            });
        }
    }

    /**
     * CARGAR NIVEL DE EMPRESA ACTUAL
     */
    _cargarNivelEmpresa(empresaId) {
        const nivel = this.obtenerNivelEmpresa(empresaId);
        
        if (nivel) {
            this._log('info', `📊 Nivel cargado: ${nivel.nivel.nombre} (Score: ${nivel.score})`);
        }
    }

    /**
     * GUARDAR DATOS
     */
    _guardarDatos() {
        try {
            localStorage.setItem('grizalum_niveles_empresas', JSON.stringify(this.empresas));
        } catch (error) {
            this._log('error', 'Error guardando niveles:', error);
        }
    }

    /**
     * DISPARAR EVENTO
     */
    _dispararEvento(nombre, datos) {
        const evento = new CustomEvent(`grizalum${nombre.charAt(0).toUpperCase() + nombre.slice(1)}`, {
            detail: datos,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(evento);
    }

    /**
     * LOG
     */
    _log(nivel, mensaje, datos = null) {
        if (!this.config.debug && nivel !== 'error' && nivel !== 'success') return;
        
        const timestamp = new Date().toISOString();
        const prefijo = `[${timestamp}] [${this.config.componente}]`;
        
        if (nivel === 'error') {
            console.error(`${prefijo}`, mensaje, datos);
        } else if (nivel === 'warn') {
            console.warn(`${prefijo}`, mensaje, datos);
        } else {
            console.log(`${prefijo}`, mensaje, datos);
        }
    }
}

// Inicialización global
window.sistemaNiveles = new SistemaNiveles();

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🧠 SISTEMA DE NIVELES ADAPTATIVOS v1.0                       ║
║  Cerebro inteligente que adapta la experiencia                ║
╚═══════════════════════════════════════════════════════════════╝
`);
