/**
 * ================================================================
 * GRIZALUM THEME MANAGER - ULTRA PROFESSIONAL EDITION v2.0
 * Sistema de temas dinámicos inspirado en Goldman Sachs + Tesla
 * Paletas de nivel Fortune 500 para sistemas financieros
 * ================================================================
 */

class GestorTemasGRIZALUM {
    constructor() {
        this.version = '2.0.0';
        this.temaActual = 'goldman-platinum';
        this.temas = this.inicializarTemasUltraPremium();
        this.temasEmpresa = this.cargarTemasEmpresa();
        this.cache = new Map();
        this.inicializado = false;
        this.utilidades = null;
        
        this.inicializar();
    }

    // ======= INICIALIZACIÓN AVANZADA =======
    inicializar() {
        try {
            this.log('🚀 Inicializando GRIZALUM Theme Manager Ultra Professional v2.0...');
            
            // Detectar utilidades GRIZALUM
            this.detectarUtilidades();
            
            // Cargar configuración global
            this.cargarConfiguracionGlobal();
            
            // Crear estilos dinámicos
            this.crearSistemaEstilosDinamicos();
            
            // Cargar tema guardado
            this.cargarTemaGuardado();
            
            // Configurar eventos
            this.configurarEventos();
            
            this.inicializado = true;
            this.log('✅ GRIZALUM Theme Manager inicializado correctamente', 'success');
            this.mostrarInformacionSistema();
            
        } catch (error) {
            this.log(`❌ Error inicializando Theme Manager: ${error.message}`, 'error');
        }
    }

    detectarUtilidades() {
        this.utilidades = window.GrizalumUtils || null;
        if (this.utilidades) {
            this.log('🔗 Sistema de utilidades GRIZALUM detectado', 'success');
        } else {
            this.log('⚠️ Sistema de utilidades no detectado, usando funciones básicas', 'warn');
        }
    }

    cargarConfiguracionGlobal() {
        const config = window.GRIZALUM_CONFIG || {};
        
        this.configuracion = {
            empresaActual: config.currentCompany || 'fundicion-laguna',
            animaciones: {
                duracion: config.animation?.duration || 400,
                easing: config.animation?.easing || 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            cache: {
                habilitado: true,
                tiempoVida: 300000 // 5 minutos
            },
            rendimiento: {
                cargaLazy: config.performance?.lazyLoad || true,
                optimizarCSS: config.performance?.optimizeCSS || true
            }
        };
        
        this.log('⚙️ Configuración global cargada', 'info');
    }

    log(mensaje, tipo = 'info') {
        if (this.utilidades) {
            this.utilidades.log(`[ThemeManager] ${mensaje}`, tipo);
        } else {
            const timestamp = new Date().toLocaleTimeString('es-PE');
            const prefijo = `[GRIZALUM-Themes ${timestamp}]`;
            
            switch (tipo) {
                case 'error':
                    console.error(`${prefijo} ❌`, mensaje);
                    break;
                case 'warn':
                    console.warn(`${prefijo} ⚠️`, mensaje);
                    break;
                case 'success':
                    console.log(`${prefijo} ✅`, mensaje);
                    break;
                default:
                    console.log(`${prefijo} ℹ️`, mensaje);
            }
        }
    }

    // ======= PALETAS ULTRA PROFESIONALES =======
    inicializarTemasUltraPremium() {
        return {
            // 🏦 GOLDMAN PLATINUM - Inspirado en Goldman Sachs
            'goldman-platinum': {
                nombre: 'Goldman Platinum',
                descripcion: 'Elegancia bancaria de clase mundial',
                categoria: 'financial-elite',
                prioridad: 1,
                colores: {
                    // Colores principales
                    primary: '#d4af37',                    // Oro Goldman Sachs
                    secondary: '#b8941f',                  // Oro oscuro
                    accent: '#f5d76e',                     // Oro luminoso
                    
                    // Fondos premium
                    background: '#0a0a0b',                 // Negro carbón absoluto
                    surface: '#1a1b23',                    // Carbón elegante
                    elevated: '#2d2e3f',                   // Superficie elevada
                    
                    // Texto jerarquizado
                    textPrimary: '#ffffff',                // Blanco puro
                    textSecondary: '#d4af37',              // Dorado elegante
                    textMuted: '#a0a0a0',                  // Gris premium
                    
                    // Estados y alertas
                    success: '#10b981',                    // Verde esmeralda
                    warning: '#f59e0b',                    // Ámbar ejecutivo
                    danger: '#ef4444',                     // Rojo corporativo
                    info: '#3b82f6',                       // Azul información
                    
                    // Gradientes sofisticados
                    gradientPrimary: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 148, 31, 0.05) 100%)',
                    
                    // Efectos premium
                    shadowGlow: '0 0 40px rgba(212, 175, 55, 0.4)',
                    shadowElevated: '0 20px 40px rgba(0, 0, 0, 0.6)',
                    shadowSoft: '0 8px 25px rgba(0, 0, 0, 0.3)',
                    glassEffect: 'rgba(212, 175, 55, 0.08)',
                    borderGlow: '1px solid rgba(212, 175, 55, 0.3)'
                }
            },

            // 🚀 TESLA FUTURISTIC - Inspirado en el diseño de Tesla
            'tesla-futuristic': {
                nombre: 'Tesla Futuristic',
                descripcion: 'El futuro según Elon Musk',
                categoria: 'tech-innovation',
                prioridad: 2,
                colores: {
                    primary: '#ff0040',                    // Rojo Tesla icónico
                    secondary: '#1a1a1a',                  // Negro Tesla profundo
                    accent: '#00d4ff',                     // Cian futurista
                    
                    background: '#000000',                 // Negro absoluto Tesla
                    surface: '#0f0f0f',                    // Surface mínimo
                    elevated: '#1a1a1a',                   // Elevado sutil
                    
                    textPrimary: '#ffffff',
                    textSecondary: '#cccccc',
                    textMuted: '#888888',
                    
                    success: '#00ff87',                    // Verde neón
                    warning: '#ffaa00',                    // Ámbar vibrante
                    danger: '#ff1744',                     // Rojo alerta
                    info: '#00d4ff',                       // Cian info
                    
                    gradientPrimary: 'linear-gradient(135deg, #ff0040 0%, #00d4ff 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #00ff87 0%, #00cc6a 100%)',
                    gradientWarning: 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(255, 0, 64, 0.12) 0%, rgba(0, 212, 255, 0.04) 100%)',
                    
                    shadowGlow: '0 0 50px rgba(255, 0, 64, 0.5)',
                    shadowElevated: '0 25px 50px rgba(0, 0, 0, 0.8)',
                    shadowSoft: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    glassEffect: 'rgba(255, 0, 64, 0.06)',
                    borderGlow: '1px solid rgba(255, 0, 64, 0.4)'
                }
            },

            // 🍎 CUPERTINO ELITE - Inspirado en Apple
            'cupertino-elite': {
                nombre: 'Cupertino Elite',
                descripcion: 'Diseño premium desde Cupertino',
                categoria: 'design-excellence',
                prioridad: 3,
                colores: {
                    primary: '#007aff',                    // Azul Apple
                    secondary: '#5856d6',                  // Púrpura iOS
                    accent: '#30d158',                     // Verde Apple
                    
                    background: '#000000',                 // Negro Apple
                    surface: '#1c1c1e',                    // Gris sistema oscuro
                    elevated: '#2c2c2e',                   // Elevado iOS
                    
                    textPrimary: '#ffffff',
                    textSecondary: '#ebebf5',              // Texto secundario iOS
                    textMuted: '#ebebf580',                // Texto terciario
                    
                    success: '#30d158',                    // Verde sistema
                    warning: '#ff9f0a',                    // Naranja iOS
                    danger: '#ff453a',                     // Rojo sistema
                    info: '#64d2ff',                       // Azul claro
                    
                    gradientPrimary: 'linear-gradient(135deg, #007aff 0%, #5856d6 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #30d158 0%, #248a3d 100%)',
                    gradientWarning: 'linear-gradient(135deg, #ff9f0a 0%, #ff8c00 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ff453a 0%, #e63946 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.05) 100%)',
                    
                    shadowGlow: '0 0 30px rgba(0, 122, 255, 0.4)',
                    shadowElevated: '0 15px 35px rgba(0, 0, 0, 0.5)',
                    shadowSoft: '0 6px 20px rgba(0, 0, 0, 0.25)',
                    glassEffect: 'rgba(0, 122, 255, 0.08)',
                    borderGlow: '1px solid rgba(0, 122, 255, 0.3)'
                }
            },

            // 🔴 NETFLIX PREMIUM - Inspirado en Netflix
            'netflix-premium': {
                nombre: 'Netflix Premium',
                descripcion: 'Entretenimiento de clase mundial',
                categoria: 'media-excellence',
                prioridad: 4,
                colores: {
                    primary: '#e50914',                    // Rojo Netflix icónico
                    secondary: '#221f1f',                  // Gris oscuro Netflix
                    accent: '#ffffff',                     // Blanco contraste
                    
                    background: '#141414',                 // Negro Netflix
                    surface: '#181818',                    // Surface Netflix
                    elevated: '#2f2f2f',                   // Elevado Netflix
                    
                    textPrimary: '#ffffff',
                    textSecondary: '#b3b3b3',              // Gris Netflix
                    textMuted: '#737373',                  // Gris apagado
                    
                    success: '#46d369',                    // Verde Netflix
                    warning: '#f5c518',                    // Amarillo dorado
                    danger: '#dc1a28',                     // Rojo intenso
                    info: '#54b3d6',                       // Azul información
                    
                    gradientPrimary: 'linear-gradient(135deg, #e50914 0%, #b81d24 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #46d369 0%, #1db954 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f5c518 0%, #e6ac00 100%)',
                    gradientDanger: 'linear-gradient(135deg, #dc1a28 0%, #b81d24 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(184, 29, 36, 0.05) 100%)',
                    
                    shadowGlow: '0 0 35px rgba(229, 9, 20, 0.5)',
                    shadowElevated: '0 18px 35px rgba(0, 0, 0, 0.6)',
                    shadowSoft: '0 8px 25px rgba(0, 0, 0, 0.3)',
                    glassEffect: 'rgba(229, 9, 20, 0.08)',
                    borderGlow: '1px solid rgba(229, 9, 20, 0.4)'
                }
            },

            // 💎 MIDNIGHT CORPORATE - Tema nocturno premium
            'midnight-corporate': {
                nombre: 'Midnight Corporate',
                descripcion: 'Elegancia nocturna corporativa',
                categoria: 'corporate-premium',
                prioridad: 5,
                colores: {
                    primary: '#00d9ff',                    // Cian eléctrico
                    secondary: '#8b5cf6',                  // Púrpura neón
                    accent: '#00ff87',                     // Verde neón
                    
                    background: '#0a0a0b',                 // Negro carbón
                    surface: '#1a1b23',                    // Obsidiana
                    elevated: '#2d2e3f',                   // Carbón elevado
                    
                    textPrimary: '#ffffff',
                    textSecondary: '#a3a3a3',
                    textMuted: '#6b6b6b',
                    
                    success: '#00ff87',                    // Verde éxito
                    warning: '#ffb800',                    // Ámbar premium
                    danger: '#ff4757',                     // Rojo elegante
                    info: '#00d9ff',                       // Cian info
                    
                    gradientPrimary: 'linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #00ff87 0%, #00b894 100%)',
                    gradientWarning: 'linear-gradient(135deg, #ffb800 0%, #ff6b35 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ff4757 0%, #e84118 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(0, 217, 255, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
                    
                    shadowGlow: '0 0 40px rgba(0, 217, 255, 0.5)',
                    shadowElevated: '0 20px 40px rgba(0, 0, 0, 0.7)',
                    shadowSoft: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    glassEffect: 'rgba(0, 217, 255, 0.08)',
                    borderGlow: '1px solid rgba(0, 217, 255, 0.3)'
                }
            },

            // 🖤 EXECUTIVE DARK - Tema ejecutivo minimalista
            'executive-dark': {
                nombre: 'Executive Dark',
                descripcion: 'Minimalismo ejecutivo sofisticado',
                categoria: 'executive-minimal',
                prioridad: 6,
                colores: {
                    primary: '#6b7280',                    // Gris ejecutivo
                    secondary: '#4b5563',                  // Gris profundo
                    accent: '#d1d5db',                     // Gris claro
                    
                    background: '#111827',                 // Negro suave
                    surface: '#1f2937',                    // Gris oscuro
                    elevated: '#374151',                   // Gris elevado
                    
                    textPrimary: '#f9fafb',
                    textSecondary: '#e5e7eb',
                    textMuted: '#d1d5db',
                    
                    success: '#10b981',                    // Verde corporativo
                    warning: '#f59e0b',                    // Ámbar ejecutivo
                    danger: '#ef4444',                     // Rojo corporativo
                    info: '#3b82f6',                       // Azul corporativo
                    
                    gradientPrimary: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    gradientGlass: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(75, 85, 99, 0.04) 100%)',
                    
                    shadowGlow: '0 0 25px rgba(107, 114, 128, 0.3)',
                    shadowElevated: '0 15px 30px rgba(0, 0, 0, 0.4)',
                    shadowSoft: '0 6px 20px rgba(0, 0, 0, 0.2)',
                    glassEffect: 'rgba(107, 114, 128, 0.06)',
                    borderGlow: '1px solid rgba(107, 114, 128, 0.2)'
                }
            }
        };
    }

    // ======= ASIGNACIÓN ESTRATÉGICA POR EMPRESA =======
    cargarTemasEmpresa() {
        const cacheKey = 'grizalum_company_themes_v2';
        let temasGuardados = null;
        
        if (this.utilidades) {
            temasGuardados = this.utilidades.cargarDeStorage(cacheKey);
        } else {
            try {
                const guardado = localStorage.getItem(cacheKey);
                temasGuardados = guardado ? JSON.parse(guardado) : null;
            } catch (error) {
                this.log(`Error cargando temas de empresa: ${error.message}`, 'error');
            }
        }

        if (temasGuardados) {
            this.log('📂 Temas de empresa cargados desde storage', 'info');
            return temasGuardados;
        }

        // Asignación estratégica de temas por tipo de empresa
        const temasDefecto = {
            'fundicion-laguna': 'tesla-futuristic',      // Tecnología + Futurista
            'fundicion-joel': 'netflix-premium',         // Entretenimiento Premium
            'avicola-san-juan': 'cupertino-elite',       // Diseño Elegante
            'import-lm': 'goldman-platinum',             // Financiero Élite
            'bodega-central': 'executive-dark',          // Ejecutivo Minimalista
            'empresa-demo': 'midnight-corporate'         // Corporativo Premium
        };

        this.guardarTemasEmpresa(temasDefecto);
        this.log('🏢 Temas de empresa inicializados por defecto', 'info');
        return temasDefecto;
    }

    guardarTemasEmpresa(temas) {
        const cacheKey = 'grizalum_company_themes_v2';
        
        if (this.utilidades) {
            this.utilidades.guardarEnStorage(cacheKey, temas);
        } else {
            try {
                localStorage.setItem(cacheKey, JSON.stringify(temas));
            } catch (error) {
                this.log(`Error guardando temas de empresa: ${error.message}`, 'error');
            }
        }
    }

    // ======= APLICACIÓN DE TEMAS OPTIMIZADA =======
    aplicarTema(nombreTema) {
        if (!this.temas[nombreTema]) {
            this.log(`❌ Tema '${nombreTema}' no encontrado`, 'error');
            if (this.utilidades) {
                this.utilidades.mostrarError(`Tema '${nombreTema}' no encontrado`);
            }
            return false;
        }

        const tema = this.temas[nombreTema];
        const inicio = performance.now();

        try {
            // Verificar cache
            const cacheKey = `tema_${nombreTema}`;
            if (this.cache.has(cacheKey) && this.configuracion.cache.habilitado) {
                const datosCache = this.cache.get(cacheKey);
                if (Date.now() - datosCache.timestamp < this.configuracion.cache.tiempoVida) {
                    this.aplicarVariablesCSS(datosCache.variables);
                    this.log(`🚀 Tema aplicado desde cache: ${tema.nombre}`, 'success');
                    return true;
                }
            }

            // Aplicar tema y guardar en cache
            const variables = this.aplicarVariablesCSS(tema.colores);
            
            if (this.configuracion.cache.habilitado) {
                this.cache.set(cacheKey, {
                    variables,
                    timestamp: Date.now()
                });
            }

            this.temaActual = nombreTema;
            this.guardarTemaActual(nombreTema);
            
            const duracion = (performance.now() - inicio).toFixed(2);
            this.log(`🎨 Tema aplicado: ${tema.nombre} (${tema.categoria}) - ${duracion}ms`, 'success');
            
            // Mostrar notificación si está disponible
            if (this.utilidades) {
                this.utilidades.mostrarExito(`Tema cambiado a: ${tema.nombre}`, 2000);
            }
            
            // Disparar evento personalizado
            this.dispararEventoCambioTema(nombreTema, tema);
            return true;
            
        } catch (error) {
            this.log(`❌ Error aplicando tema: ${error.message}`, 'error');
            if (this.utilidades) {
                this.utilidades.mostrarError(`Error aplicando tema: ${error.message}`);
            }
            return false;
        }
    }

    aplicarVariablesCSS(colores) {
        const root = document.documentElement;
        const variables = {};

        Object.entries(colores).forEach(([clave, valor]) => {
            const cssVar = this.camelAKebab(clave);
            const nombreVariable = `--theme-${cssVar}`;
            root.style.setProperty(nombreVariable, valor);
            variables[nombreVariable] = valor;
        });

        return variables;
    }

    aplicarTemaEmpresa(idEmpresa) {
        const nombreTema = this.temasEmpresa[idEmpresa];
        if (nombreTema && this.temas[nombreTema]) {
            const exito = this.aplicarTema(nombreTema);
            if (exito) {
                this.log(`🏢 Empresa: ${idEmpresa} → Tema: ${this.temas[nombreTema].nombre}`, 'info');
                return true;
            }
        } else {
            this.log(`⚠️ No hay tema asignado para: ${idEmpresa}, usando tema por defecto`, 'warn');
            this.aplicarTema('goldman-platinum');
            return false;
        }
    }

    // ======= SISTEMA DE ESTILOS DINÁMICOS AVANZADO =======
    crearSistemaEstilosDinamicos() {
        const idEstilo = 'grizalum-ultra-theme-system-v2';
        let estiloExistente = document.getElementById(idEstilo);
        
        if (estiloExistente) {
            estiloExistente.remove();
        }

        const estilo = document.createElement('style');
        estilo.id = idEstilo;
        estilo.textContent = this.generarCSSUltraProfesional();
        
        document.head.appendChild(estilo);
        this.log('🎨 Sistema de estilos dinámicos v2.0 creado', 'info');
    }

    generarCSSUltraProfesional() {
        return `
            /* ========================================= */
            /* GRIZALUM ULTRA PROFESSIONAL THEME v2.0   */
            /* ========================================= */
            
            :root {
                /* Variables dinámicas que se actualizan con cada tema */
                --theme-primary: #d4af37;
                --theme-secondary: #b8941f;
                --theme-accent: #f5d76e;
                --theme-background: #0a0a0b;
                --theme-surface: #1a1b23;
                --theme-elevated: #2d2e3f;
                --theme-text-primary: #ffffff;
                --theme-text-secondary: #d4af37;
                --theme-text-muted: #a0a0a0;
                --theme-success: #10b981;
                --theme-warning: #f59e0b;
                --theme-danger: #ef4444;
                --theme-info: #3b82f6;
                --theme-gradient-primary: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
                --theme-gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
                --theme-gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                --theme-gradient-danger: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                --theme-gradient-glass: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 148, 31, 0.05) 100%);
                --theme-shadow-glow: 0 0 40px rgba(212, 175, 55, 0.4);
                --theme-shadow-elevated: 0 20px 40px rgba(0, 0, 0, 0.6);
                --theme-shadow-soft: 0 8px 25px rgba(0, 0, 0, 0.3);
                --theme-glass-effect: rgba(212, 175, 55, 0.08);
                --theme-border-glow: 1px solid rgba(212, 175, 55, 0.3);
                
                /* Variables adicionales para mejor control */
                --theme-transition: all ${this.configuracion.animaciones.duracion}ms ${this.configuracion.animaciones.easing};
                --theme-border-radius: 12px;
                --theme-border-radius-lg: 16px;
                --theme-blur: 20px;
                --theme-blur-heavy: 30px;
            }

            /* === APLICACIÓN GLOBAL MEJORADA === */
            body {
                background: var(--theme-background) !important;
                color: var(--theme-text-primary) !important;
                transition: var(--theme-transition) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            }

            /* === CONTENEDOR PRINCIPAL === */
            .main-content {
                background: var(--theme-background) !important;
                min-height: 100vh !important;
            }

            /* === SIDEBAR ULTRA PREMIUM === */
            .sidebar {
                background: linear-gradient(180deg, var(--theme-surface) 0%, var(--theme-background) 100%) !important;
                border-right: var(--theme-border-glow) !important;
                backdrop-filter: blur(var(--theme-blur)) !important;
                position: relative !important;
            }

            .sidebar::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
            }

            .sidebar-header {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
                border-radius: 0 0 var(--theme-border-radius) var(--theme-border-radius) !important;
                margin: 1rem !important;
                padding: 1.5rem !important;
            }

            .sidebar-header h3 {
                color: white !important;
                font-weight: 700 !important;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
            }

            /* === NAVEGACIÓN PREMIUM === */
            .nav-link {
                transition: var(--theme-transition) !important;
                border-radius: var(--theme-border-radius) !important;
                margin: 0.25rem 0.75rem !important;
                position: relative !important;
                overflow: hidden !important;
            }

            .nav-link::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 0;
                background: var(--theme-gradient-primary) !important;
                transition: width 0.3s ease !important;
                z-index: -1;
            }

            .nav-link.active::before,
            .nav-link:hover::before {
                width: 100% !important;
            }

            .nav-link.active {
                color: white !important;
                box-shadow: var(--theme-shadow-glow) !important;
                border-left: 4px solid var(--theme-primary) !important;
                font-weight: 600 !important;
            }

            .nav-link:hover {
                color: var(--theme-primary) !important;
                background: var(--theme-glass-effect) !important;
                transform: translateX(5px) !important;
            }

            /* === HEADER EJECUTIVO === */
            .executive-header,
            .header-section {
                background: var(--theme-glass-effect) !important;
                backdrop-filter: blur(var(--theme-blur-heavy)) !important;
                border-bottom: var(--theme-border-glow) !important;
                box-shadow: var(--theme-shadow-soft) !important;
                border-radius: 0 0 var(--theme-border-radius-lg) var(--theme-border-radius-lg) !important;
            }

            .page-header h1 {
                background: var(--theme-gradient-primary) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
                font-weight: 800 !important;
                text-shadow: none !important;
            }

            /* === BOTÓN IA PREMIUM === */
            .ai-header-button,
            .ai-toggle-button {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
                border: var(--theme-border-glow) !important;
                border-radius: var(--theme-border-radius) !important;
                color: white !important;
                font-weight: 600 !important;
                position: relative !important;
                overflow: hidden !important;
            }

            .ai-header-button:hover,
            .ai-toggle-button:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 15px 35px rgba(var(--theme-primary), 0.4) !important;
            }

            .ai-header-button::before,
            .ai-toggle-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s ease !important;
            }

            .ai-header-button:hover::before,
            .ai-toggle-button:hover::before {
                left: 100% !important;
            }

            /* === TARJETAS MÉTRICAS ULTRA PREMIUM === */
            .metric-card,
            .chart-card,
            .card {
                background: var(--theme-glass-effect) !important;
                backdrop-filter: blur(var(--theme-blur)) !important;
                border: var(--theme-border-glow) !important;
                box-shadow: var(--theme-shadow-soft) !important;
                border-radius: var(--theme-border-radius-lg) !important;
                position: relative !important;
                overflow: hidden !important;
                transition: var(--theme-transition) !important;
            }

            .metric-card::before,
            .chart-card::before,
            .card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--theme-gradient-primary) !important;
                opacity: 0.7 !important;
            }

            .metric-card:hover,
            .chart-card:hover,
            .card:hover {
                box-shadow: var(--theme-shadow-elevated) !important;
                border-color: var(--theme-primary) !important;
                transform: translateY(-8px) !important;
            }

            .metric-card:hover::before,
            .chart-card:hover::before,
            .card:hover::before {
                opacity: 1 !important;
                box-shadow: var(--theme-shadow-glow) !important;
            }

            .metric-value,
            .kpi-value {
                background: var(--theme-gradient-primary) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
                font-weight: 800 !important;
                font-size: 2.5rem !important;
            }

            /* === INSIGHTS IA === */
            .ai-insights,
            .ai-panel {
                background: var(--theme-gradient-glass) !important;
                border: var(--theme-border-glow) !important;
                color: var(--theme-text-primary) !important;
                backdrop-filter: blur(var(--theme-blur)) !important;
                border-radius: var(--theme-border-radius-lg) !important;
                position: relative !important;
            }

            .ai-insights::before,
            .ai-panel::before {
                content: '🤖';
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 1.5rem;
                opacity: 0.3;
            }

            /* === SELECTOR DE EMPRESAS === */
            .company-dropdown,
            .dropdown-menu {
                background: var(--theme-surface) !important;
                border: var(--theme-border-glow) !important;
                box-shadow: var(--theme-shadow-elevated) !important;
                backdrop-filter: blur(var(--theme-blur-heavy)) !important;
                border-radius: var(--theme-border-radius-lg) !important;
            }

            .company-item,
            .dropdown-item {
                transition: var(--theme-transition) !important;
                border-radius: var(--theme-border-radius) !important;
                margin: 0.25rem !important;
            }

            .company-item:hover,
            .dropdown-item:hover {
                background: var(--theme-glass-effect) !important;
                border-left: 3px solid var(--theme-primary) !important;
                color: var(--theme-primary) !important;
                transform: translateX(5px) !important;
            }

            .company-item.active {
                background: var(--theme-gradient-glass) !important;
                border: var(--theme-border-glow) !important;
                box-shadow: var(--theme-shadow-glow) !important;
                color: var(--theme-primary) !important;
            }

            /* === BOTONES PREMIUM === */
            .btn-primary {
                background: var(--theme-gradient-primary) !important;
                box-shadow: var(--theme-shadow-glow) !important;
                border: none !important;
                border-radius: var(--theme-border-radius) !important;
                color: white !important;
                font-weight: 600 !important;
                transition: var(--theme-transition) !important;
            }

            .btn-primary:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 12px 30px rgba(var(--theme-primary), 0.4) !important;
            }

            .btn-success {
                background: var(--theme-gradient-success) !important;
                border: none !important;
                color: white !important;
            }

            .btn-warning {
                background: var(--theme-gradient-warning) !important;
                border: none !important;
                color: white !important;
            }

            .btn-danger {
                background: var(--theme-gradient-danger) !important;
                border: none !important;
                color: white !important;
            }

            .btn-neutral,
            .btn-outline {
                background: var(--theme-glass-effect) !important;
                border: var(--theme-border-glow) !important;
                color: var(--theme-text-primary) !important;
                backdrop-filter: blur(10px) !important;
            }

            /* === PERÍODOS === */
            .period-btn {
                transition: var(--theme-transition) !important;
                border-radius: var(--theme-border-radius) !important;
                border: var(--theme-border-glow) !important;
                background: var(--theme-glass-effect) !important;
            }

            .period-btn.active {
                background: var(--theme-gradient-primary) !important;
                color: white !important;
                box-shadow: var(--theme-shadow-glow) !important;
                border-color: var(--theme-primary) !important;
            }

            .period-btn:hover {
                border-color: var(--theme-primary) !important;
                color: var(--theme-primary) !important;
                transform: translateY(-2px) !important;
            }

            /* === NOTIFICACIONES === */
            .notification-center {
                transition: var(--theme-transition) !important;
                border-radius: var(--theme-border-radius) !important;
            }

            .notification-center:hover {
                border-color: var(--theme-primary) !important;
                color: var(--theme-primary) !important;
                box-shadow: var(--theme-shadow-soft) !important;
            }

            /* === SCROLLBAR ULTRA PREMIUM === */
            ::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }

            ::-webkit-scrollbar-track {
                background: var(--theme-surface);
                border-radius: 5px;
            }

            ::-webkit-scrollbar-thumb {
                background: var(--theme-gradient-primary);
                border-radius: 5px;
                border: 2px solid var(--theme-surface);
            }

            ::-webkit-scrollbar-thumb:hover {
                background: var(--theme-primary);
                box-shadow: var(--theme-shadow-glow);
            }

            /* === ANIMACIONES ESPECIALES === */
            @keyframes theme-glow-pulse {
                0%, 100% { 
                    box-shadow: var(--theme-shadow-soft); 
                }
                50% { 
                    box-shadow: var(--theme-shadow-glow); 
                }
            }

            .pulse-effect {
                animation: theme-glow-pulse 2s infinite;
            }

            /* === EFECTOS DE CARGA === */
            .loading-shimmer {
                background: linear-gradient(90deg, 
                    var(--theme-surface) 25%, 
                    var(--theme-elevated) 50%, 
                    var(--theme-surface) 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            /* === MODO ALTO CONTRASTE === */
            @media (prefers-contrast: high) {
                :root {
                    --theme-border-glow: 2px solid var(--theme-primary);
                    --theme-shadow-glow: 0 0 20px var(--theme-primary);
                }
            }

            /* === MODO MOVIMIENTO REDUCIDO === */
            @media (prefers-reduced-motion: reduce) {
                * {
                    transition: none !important;
                    animation: none !important;
                }
            }
        `;
    }

    // ======= EVENTOS Y COMUNICACIÓN =======
    configurarEventos() {
        // Listener para cambios de empresa
        document.addEventListener('companyChanged', (evento) => {
            if (evento.detail?.companyId) {
                this.aplicarTemaEmpresa(evento.detail.companyId);
            }
        });

        // Listener para cambios de tema personalizado
        document.addEventListener('themeChangeRequest', (evento) => {
            if (evento.detail?.themeName) {
                this.aplicarTema(evento.detail.themeName);
            }
        });

        // Listener para vista previa de tema
        document.addEventListener('themePreviewRequest', (evento) => {
            if (evento.detail?.themeName && evento.detail?.duration) {
                this.previsualizarTema(evento.detail.themeName, evento.detail.duration);
            }
        });

        this.log('🔗 Eventos de tema configurados', 'info');
    }

    dispararEventoCambioTema(nombreTema, tema) {
        const evento = new CustomEvent('grizalumThemeChanged', {
            detail: { 
                nombreTema, 
                tema, 
                timestamp: Date.now(),
                categoria: tema.categoria,
                version: this.version
            }
        });
        document.dispatchEvent(evento);
    }

    // ======= UTILIDADES OPTIMIZADAS =======
    camelAKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    cargarTemaGuardado() {
        const cacheKey = 'grizalum_current_theme_v2';
        let temaGuardado = null;
        
        if (this.utilidades) {
            temaGuardado = this.utilidades.cargarDeStorage(cacheKey);
        } else {
            try {
                temaGuardado = localStorage.getItem(cacheKey);
            } catch (error) {
                this.log(`Error cargando tema guardado: ${error.message}`, 'error');
            }
        }
        
        if (temaGuardado && this.temas[temaGuardado]) {
            this.aplicarTema(temaGuardado);
        } else {
            this.aplicarTema('goldman-platinum');
        }
    }

    guardarTemaActual(nombreTema) {
        const cacheKey = 'grizalum_current_theme_v2';
        
        if (this.utilidades) {
            this.utilidades.guardarEnStorage(cacheKey, nombreTema);
        } else {
            try {
                localStorage.setItem(cacheKey, nombreTema);
            } catch (error) {
                this.log(`Error guardando tema actual: ${error.message}`, 'error');
            }
        }
    }

    // ======= API PÚBLICA AVANZADA =======
    obtenerTemasDisponibles() {
        return Object.keys(this.temas).map(clave => ({
            clave,
            nombre: this.temas[clave].nombre,
            descripcion: this.temas[clave].descripcion,
            categoria: this.temas[clave].categoria,
            prioridad: this.temas[clave].prioridad
        })).sort((a, b) => a.prioridad - b.prioridad);
    }

    obtenerTemaActual() {
        return {
            clave: this.temaActual,
            tema: this.temas[this.temaActual]
        };
    }

    obtenerColoresTema(nombreTema) {
        return this.temas[nombreTema]?.colores || null;
    }

    establecerTemaEmpresa(idEmpresa, nombreTema) {
        if (!this.temas[nombreTema]) {
            this.log(`❌ Tema '${nombreTema}' no existe`, 'error');
            return false;
        }

        this.temasEmpresa[idEmpresa] = nombreTema;
        this.guardarTemasEmpresa(this.temasEmpresa);
        
        this.log(`✅ Tema asignado: ${idEmpresa} → ${nombreTema}`, 'success');
        
        if (this.utilidades) {
            this.utilidades.mostrarExito(`Tema ${this.temas[nombreTema].nombre} asignado a ${idEmpresa}`);
        }
        
        return true;
    }

    previsualizarTema(nombreTema, duracion = 3000) {
        if (!this.temas[nombreTema]) {
            this.log(`❌ Tema '${nombreTema}' no existe para previsualización`, 'error');
            return false;
        }
        
        const temaAnterior = this.temaActual;
        this.aplicarTema(nombreTema);
        
        this.log(`👁️ Previsualizando tema: ${this.temas[nombreTema].nombre}`, 'info');
        
        if (this.utilidades) {
            this.utilidades.mostrarInfo(`Previsualizando: ${this.temas[nombreTema].nombre}`, duracion);
        }
        
        setTimeout(() => {
            this.aplicarTema(temaAnterior);
            this.log(`↩️ Revirtiendo a tema: ${this.temas[temaAnterior].nombre}`, 'info');
        }, duracion);
        
        return true;
    }

    // ======= ANÁLISIS Y MÉTRICAS =======
    obtenerAnalyticasTemas() {
        return {
            version: this.version,
            totalTemas: Object.keys(this.temas).length,
            temaActual: this.temaActual,
            temasEmpresa: this.temasEmpresa,
            categorias: [...new Set(Object.values(this.temas).map(t => t.categoria))],
            inicializado: this.inicializado,
            cache: {
                entradas: this.cache.size,
                habilitado: this.configuracion.cache.habilitado
            },
            rendimiento: {
                tiempoInicializacion: this.tiempoInicializacion || 0,
                temasEnCache: this.cache.size
            }
        };
    }

    limpiarCache() {
        const entradas = this.cache.size;
        this.cache.clear();
        this.log(`🧹 Cache de temas limpiado: ${entradas} entradas eliminadas`, 'info');
    }

    // ======= EXPORTAR/IMPORTAR CONFIGURACIÓN =======
    exportarConfiguracionTemas() {
        return {
            version: this.version,
            temaActual: this.temaActual,
            temasEmpresa: this.temasEmpresa,
            configuracion: this.configuracion,
            timestamp: Date.now(),
            sistema: 'GRIZALUM-Ultra-Professional-v2'
        };
    }

    importarConfiguracionTemas(config) {
        try {
            if (config.version && config.temasEmpresa) {
                this.temasEmpresa = config.temasEmpresa;
                this.guardarTemasEmpresa(config.temasEmpresa);
                
                if (config.temaActual && this.temas[config.temaActual]) {
                    this.aplicarTema(config.temaActual);
                }
                
                this.log('✅ Configuración de temas importada correctamente', 'success');
                
                if (this.utilidades) {
                    this.utilidades.mostrarExito('Configuración de temas importada');
                }
                
                return true;
            }
            return false;
        } catch (error) {
            this.log(`❌ Error importando configuración: ${error.message}`, 'error');
            
            if (this.utilidades) {
                this.utilidades.mostrarError('Error importando configuración de temas');
            }
            
            return false;
        }
    }

    // ======= INFORMACIÓN DEL SISTEMA =======
    mostrarInformacionSistema() {
        console.log(`
🏆 ===================================================
   GRIZALUM THEME MANAGER - ULTRA PROFESSIONAL v2.0
🏆 ===================================================

📊 CARACTERÍSTICAS AVANZADAS:
   • 6 Temas Ultra Premium (Fortune 500 Level)
   • Paletas Goldman Sachs + Tesla + Apple + Netflix
   • Sistema dinámico de variables CSS optimizado
   • Cache inteligente para mejor rendimiento
   • Cambio automático por empresa
   • Efectos premium (glassmorphism, gradientes)
   • Persistencia mejorada en localStorage
   • API completa para personalización avanzada
   • Transiciones suaves y profesionales
   • Integración con sistema de utilidades

🎨 TEMAS DISPONIBLES:
   1. Goldman Platinum (Financiero Élite)
   2. Tesla Futuristic (Tecnología Innovación)
   3. Cupertino Elite (Diseño Excelencia)
   4. Netflix Premium (Media Excelencia)
   5. Midnight Corporate (Corporativo Premium)
   6. Executive Dark (Ejecutivo Minimalista)

🔧 MEJORAS v2.0:
   - Integración con GrizalumUtils
   - Cache inteligente con TTL
   - Validaciones robustas
   - Sistema de eventos unificado
   - Mejor manejo de errores
   - Notificaciones integradas
   - Rendimiento optimizado

💫 ¡Tu dashboard nunca se verá igual!
🏆 ===================================================
        `);
    }
}

// ======= INSTANCIA GLOBAL =======
let gestorTemasGrizalum = null;

// ======= INICIALIZACIÓN =======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando GRIZALUM Theme Manager Ultra Professional v2.0...');
    
    try {
        // Crear instancia global
        gestorTemasGrizalum = new GestorTemasGRIZALUM();
        window.themeManager = gestorTemasGrizalum;
        window.gestorTemas = gestorTemasGrizalum; // Alias en español
        
        // Listener para eventos de tema
        document.addEventListener('grizalumThemeChanged', function(evento) {
            console.log('🎨 Evento de cambio de tema:', evento.detail);
        });
        
        console.log('✅ GRIZALUM Theme Manager v2.0 cargado exitosamente');
        
    } catch (error) {
        console.error('❌ Error inicializando Theme Manager:', error);
    }
});

// ======= INTEGRACIÓN CON SELECTOR DE EMPRESAS =======
function aplicarTemaEmpresaIntegracion(idEmpresa) {
    if (window.themeManager && window.themeManager.inicializado) {
        const exito = window.themeManager.aplicarTemaEmpresa(idEmpresa);
        if (exito) {
            console.log(`🏢 Tema de empresa aplicado: ${idEmpresa}`);
        }
        return exito;
    } else {
        console.warn('⚠️ Theme Manager no está inicializado');
        return false;
    }
}

// ======= UTILIDADES GLOBALES =======
window.GrizalumThemeUtils = {
    // Obtener tema actual
    getCurrentTheme: () => window.themeManager?.obtenerTemaActual(),
    
    // Obtener todos los temas disponibles
    getAvailableThemes: () => window.themeManager?.obtenerTemasDisponibles(),
    
    // Previsualizar tema
    previewTheme: (themeName, duration) => window.themeManager?.previsualizarTema(themeName, duration),
    
    // Obtener analíticas
    getAnalytics: () => window.themeManager?.obtenerAnalyticasTemas(),
    
    // Exportar configuración
    export: () => window.themeManager?.exportarConfiguracionTemas(),
    
    // Importar configuración
    import: (config) => window.themeManager?.importarConfiguracionTemas(config),
    
    // Limpiar cache
    clearCache: () => window.themeManager?.limpiarCache(),
    
    // Aplicar tema específico
    applyTheme: (themeName) => window.themeManager?.aplicarTema(themeName),
    
    // Establecer tema para empresa
    setCompanyTheme: (companyId, themeName) => window.themeManager?.establecerTemaEmpresa(companyId, themeName)
};

// ======= EXPORTAR CLASE =======
window.GestorTemasGRIZALUM = GestorTemasGRIZALUM;

// ======= FUNCIONES DE COMPATIBILIDAD =======
window.applyCompanyTheme = aplicarTemaEmpresaIntegracion;
window.changeTheme = (themeName) => window.themeManager?.aplicarTema(themeName);

console.log('🎨 GRIZALUM Theme Manager v2.0 cargado');
console.log('✨ Funcionalidades principales:');
console.log('  • 🏆 6 Temas Ultra Premium de Fortune 500');
console.log('  • 🎨 Sistema de variables CSS dinámicas');
console.log('  • 🏢 Asignación automática por empresa');
console.log('  • 💎 Efectos glassmorphism y gradientes');
console.log('  • 🚀 Cache inteligente para rendimiento');
console.log('  • 🔔 Integración con sistema de notificaciones');
console.log('  • 📱 API completa y eventos unificados');
console.log('🚀 ¡Sistema de temas de clase mundial listo!');
