// ================================================================
// MOTOR DE TEMAS GRIZALUM
// Este archivo maneja SOLO los colores, temas y estilos dinámicos
// ================================================================

console.log('🎨 Cargando motor de temas...');

// ================================================================
// VARIABLES DEL MOTOR DE TEMAS
// ================================================================
let temaActual = null;
let empresaActual = null;
let modoOscuro = true; // Por defecto modo oscuro futurista

// ================================================================
// CLASE PRINCIPAL DEL MOTOR DE TEMAS
// ================================================================
class MotorTemas {
    constructor() {
        this.temas = new Map();
        this.temasPersonalizados = new Map();
        this.configuracion = {
            transicionDuracion: '0.3s',
            animacionesHabilitadas: true,
            modoOscuroForzado: true,
            efectosVisuales: true,
            blur: true
        };
        
        // Temas predefinidos de alta calidad
        this.temasBase = {
            'goldman-platinum': {
                primary: '#d4af37',
                secondary: '#f4e4a7',
                accent: '#b8941f',
                nombre: 'Goldman Platinum',
                descripcion: 'Tema dorado premium inspirado en Goldman Sachs'
            },
            'tech-blue': {
                primary: '#0066cc',
                secondary: '#4d9eff',
                accent: '#0052a3',
                nombre: 'Tech Blue',
                descripcion: 'Azul tecnológico moderno'
            },
            'forest-green': {
                primary: '#10b981',
                secondary: '#34d399',
                accent: '#059669',
                nombre: 'Forest Green',
                descripcion: 'Verde empresarial sostenible'
            },
            'royal-purple': {
                primary: '#8b5cf6',
                secondary: '#a78bfa',
                accent: '#7c3aed',
                nombre: 'Royal Purple',
                descripcion: 'Púrpura real y elegante'
            },
            'sunset-orange': {
                primary: '#f59e0b',
                secondary: '#fbbf24',
                accent: '#d97706',
                nombre: 'Sunset Orange',
                descripcion: 'Naranja vibrante y energético'
            },
            'crimson-red': {
                primary: '#ef4444',
                secondary: '#f87171',
                accent: '#dc2626',
                nombre: 'Crimson Red',
                descripcion: 'Rojo audaz y poderoso'
            }
        };
    }

    /**
     * Inicializar el motor de temas
     */
    inicializar() {
        console.log('🚀 Inicializando motor de temas...');
        
        // Cargar temas base
        this.cargarTemasBase();
        
        // Crear base CSS
        this.crearBaseCSS();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Aplicar tema por defecto
        this.aplicarTemaPorDefecto();
        
        console.log('✅ Motor de temas inicializado');
        console.log(`🎨 Temas disponibles: ${this.temas.size}`);
    }

    /**
     * Cargar temas base en el sistema
     */
    cargarTemasBase() {
        Object.entries(this.temasBase).forEach(([id, tema]) => {
            this.temas.set(id, {
                ...tema,
                id: id,
                tipo: 'base',
                fechaCreacion: Date.now()
            });
        });

        console.log(`🎨 ${Object.keys(this.temasBase).length} temas base cargados`);
    }

    /**
     * Crear CSS base para el sistema de temas
     */
    crearBaseCSS() {
        const styleId = 'grizalum-base-theme-system';
        
        // Eliminar estilos existentes
        const estilosExistentes = document.getElementById(styleId);
        if (estilosExistentes) {
            estilosExistentes.remove();
        }

        const estilos = document.createElement('style');
        estilos.id = styleId;
        estilos.textContent = `
            /* ===== SISTEMA BASE DE TEMAS GRIZALUM ===== */
            
            :root {
                --grizalum-primary: #d4af37;
                --grizalum-secondary: #f4e4a7;
                --grizalum-accent: #b8941f;
                --grizalum-transition: ${this.configuracion.transicionDuracion};
            }
            
            /* Transiciones globales suaves */
            * {
                transition: background-color var(--grizalum-transition) ease,
                           border-color var(--grizalum-transition) ease,
                           color var(--grizalum-transition) ease,
                           box-shadow var(--grizalum-transition) ease !important;
            }
            
            /* Base futurista oscura */
            body {
                background: linear-gradient(135deg, 
                    #0f172a 0%, 
                    #1e293b 25%, 
                    #334155 50%, 
                    #1e293b 75%, 
                    #0f172a 100%) !important;
                color: white !important;
                min-height: 100vh;
                transition: all var(--grizalum-transition) ease;
            }
            
            .app-container {
                background: transparent !important;
            }
            
            .main-content {
                background: rgba(15, 23, 42, 0.8) !important;
                backdrop-filter: blur(20px) !important;
            }
            
            /* Sistema de animaciones de cambio de tema */
            .tema-cambiando {
                animation: temaCambiando 0.6s ease-in-out;
            }
            
            @keyframes temaCambiando {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
            
            /* Efectos de hover mejorados */
            .metric-card:hover,
            .chart-card:hover,
            .nav-link:hover {
                transform: translateY(-2px) !important;
            }
            
            /* Loading state para cambio de tema */
            .tema-loading::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, 
                    transparent, 
                    var(--grizalum-primary), 
                    transparent);
                animation: temaLoading 1.5s infinite;
                z-index: 999999;
            }
            
            @keyframes temaLoading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        
        document.head.appendChild(estilos);
        console.log('🎨 CSS base del sistema de temas aplicado');
    }

    /**
     * Configurar eventos del motor de temas
     */
    configurarEventos() {
        // Escuchar cambios de empresa
        document.addEventListener('grizalumCompanyChanged', (evento) => {
            const { companyId, company } = evento.detail;
            this.aplicarTemaEmpresa(companyId, company);
        });

        // Escuchar comandos de tema
        document.addEventListener('grizalumCambiarTema', (evento) => {
            const { temaId, empresa } = evento.detail;
            this.aplicarTema(temaId, empresa);
        });

        console.log('🎯 Eventos del motor de temas configurados');
    }

    /**
     * Aplicar tema por defecto
     */
    aplicarTemaPorDefecto() {
        this.aplicarTema('goldman-platinum');
    }

    /**
     * Aplicar tema de empresa específica
     */
    aplicarTemaEmpresa(empresaId, empresa) {
        if (!empresa || !empresa.theme) {
            console.warn(`⚠️ No se encontró tema para empresa: ${empresaId}`);
            return;
        }

        empresaActual = empresa;
        
        console.log(`🏢 Aplicando tema de empresa: ${empresa.name}`);
        
        // Si la empresa tiene un tema custom, usarlo
        if (empresa.theme.id) {
            this.aplicarTema(empresa.theme.id, empresa);
        } else {
            // Crear tema dinámico desde los colores de la empresa
            this.aplicarTemaDinamico(empresa.theme, empresa);
        }
    }

    /**
     * Aplicar tema por ID
     */
    aplicarTema(temaId, empresa = null) {
        const tema = this.temas.get(temaId);
        if (!tema) {
            console.error(`❌ Tema no encontrado: ${temaId}`);
            return;
        }

        console.log(`🎨 Aplicando tema: ${tema.nombre}`);
        
        // Mostrar indicador de carga
        this.mostrarIndicadorCarga();
        
        // Aplicar tema después de un delay para mostrar la transición
        setTimeout(() => {
            this.generarCSSTema(tema, empresa);
            this.actualizarVariablesCSS(tema);
            this.ocultarIndicadorCarga();
            
            temaActual = tema;
            
            // Disparar evento de tema aplicado
            document.dispatchEvent(new CustomEvent('grizalumTemaAplicado', {
                detail: { 
                    tema: tema,
                    empresa: empresa,
                    timestamp: Date.now()
                }
            }));
            
            // Mostrar notificación
            if (window.mostrarNotificacion) {
                const mensaje = empresa 
                    ? `🎨 Tema de ${empresa.name} aplicado`
                    : `🎨 Tema ${tema.nombre} aplicado`;
                window.mostrarNotificacion(mensaje, 'success', 3000);
            }
            
        }, 100);
    }

    /**
     * Aplicar tema dinámico desde colores personalizados
     */
    aplicarTemaDinamico(colores, empresa) {
        const temaDinamico = {
            id: `custom-${Date.now()}`,
            primary: colores.primary,
            secondary: colores.secondary,
            accent: colores.accent || colores.primary,
            nombre: `Tema de ${empresa?.name || 'Empresa'}`,
            descripcion: 'Tema personalizado dinámico',
            tipo: 'dinamico',
            empresa: empresa
        };

        console.log(`🎨 Aplicando tema dinámico para: ${empresa?.name || 'Empresa'}`);
        
        this.mostrarIndicadorCarga();
        
        setTimeout(() => {
            this.generarCSSTema(temaDinamico, empresa);
            this.actualizarVariablesCSS(temaDinamico);
            this.ocultarIndicadorCarga();
            
            temaActual = temaDinamico;
            
        }, 100);
    }

    /**
     * Generar CSS completo para un tema
     */
    generarCSSTema(tema, empresa = null) {
        const styleId = 'grizalum-tema-dinamico';
        
        // Eliminar tema anterior
        const temaAnterior = document.getElementById(styleId);
        if (temaAnterior) {
            temaAnterior.remove();
        }

        const estilo = document.createElement('style');
        estilo.id = styleId;
        estilo.textContent = this.construirCSSTemaCompleto(tema, empresa);
        document.head.appendChild(estilo);
        
        console.log(`✅ CSS del tema ${tema.nombre} generado y aplicado`);
    }

    /**
     * Construir CSS completo del tema
     */
    construirCSSTemaCompleto(tema, empresa) {
        const { primary, secondary, accent } = tema;
        
        return `
            /* ===== TEMA DINÁMICO: ${tema.nombre.toUpperCase()} ===== */
            
            /* SIDEBAR FUTURISTA CON TEMA */
            .sidebar {
                background: linear-gradient(180deg, 
                    ${primary} 0%, 
                    ${secondary} 50%, 
                    ${primary} 100%) !important;
                box-shadow: 
                    4px 0 20px rgba(0,0,0,0.5),
                    inset -1px 0 0 rgba(255,255,255,0.1) !important;
                border-right: 1px solid rgba(255,255,255,0.1) !important;
            }
            
            .sidebar-header {
                background: linear-gradient(135deg, 
                    rgba(0,0,0,0.3) 0%, 
                    rgba(0,0,0,0.1) 100%) !important;
                border-bottom: 1px solid rgba(255,255,255,0.2) !important;
                backdrop-filter: blur(10px) !important;
            }
            
            /* HEADER EJECUTIVO */
            .executive-header {
                background: linear-gradient(135deg, 
                    rgba(15, 23, 42, 0.95) 0%, 
                    rgba(30, 41, 59, 0.9) 50%, 
                    rgba(15, 23, 42, 0.95) 100%) !important;
                border-bottom: 2px solid ${primary} !important;
                box-shadow: 
                    0 4px 20px rgba(0,0,0,0.3),
                    0 1px 0 rgba(255,255,255,0.1) !important;
                backdrop-filter: blur(20px) !important;
            }
            
            .page-title {
                color: white !important;
                text-shadow: 0 0 10px ${primary}50 !important;
            }
            
            .ai-insights {
                background: linear-gradient(90deg, ${primary}20, transparent) !important;
                color: ${primary} !important;
                border: 1px solid ${primary}30 !important;
            }
            
            /* TARJETAS MÉTRICAS FUTURISTAS */
            .metric-card {
                background: linear-gradient(135deg, 
                    rgba(30, 41, 59, 0.8) 0%, 
                    rgba(51, 65, 85, 0.6) 100%) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-top: 3px solid ${primary} !important;
                border-radius: 16px !important;
                box-shadow: 
                    0 8px 32px rgba(0,0,0,0.3),
                    inset 0 1px 0 rgba(255,255,255,0.1) !important;
                backdrop-filter: blur(10px) !important;
                color: white !important;
                position: relative;
                overflow: hidden;
            }
            
            .metric-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, 
                    ${primary} 0%, 
                    ${secondary} 50%, 
                    ${primary} 100%);
                background-size: 200% 100%;
                animation: borderGlow 3s infinite;
            }
            
            @keyframes borderGlow {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            .metric-card:hover {
                transform: translateY(-5px) !important;
                box-shadow: 
                    0 15px 40px rgba(0,0,0,0.4),
                    0 0 20px ${primary}30 !important;
                border-color: ${primary}50 !important;
            }
            
            /* ICONOS FUTURISTAS */
            .metric-icon {
                background: linear-gradient(135deg, 
                    ${primary} 0%, 
                    ${secondary} 100%) !important;
                color: white !important;
                box-shadow: 
                    0 6px 20px ${primary}40,
                    inset 0 1px 0 rgba(255,255,255,0.2) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
            }
            
            .metric-icon:hover {
                transform: scale(1.1) !important;
                box-shadow: 
                    0 8px 25px ${primary}60,
                    0 0 15px ${primary}40 !important;
            }
            
            /* BOTONES CON TEMA */
            .period-btn.active {
                background: linear-gradient(135deg, 
                    ${primary} 0%, 
                    ${secondary} 100%) !important;
                color: white !important;
                border-color: transparent !important;
                box-shadow: 
                    0 6px 20px ${primary}40,
                    0 0 15px ${primary}30 !important;
                transform: scale(1.05) !important;
            }
            
            .period-btn:hover:not(.active) {
                border-color: ${primary}50 !important;
                color: white !important;
                transform: translateY(-2px) !important;
            }
            
            /* BOTÓN IA ASSISTANT */
            .ai-header-button {
                background: linear-gradient(135deg, 
                    ${primary} 0%, 
                    ${secondary} 100%) !important;
                color: white !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
                box-shadow: 
                    0 6px 20px ${primary}40,
                    0 0 15px ${primary}30 !important;
            }
            
            .ai-header-button:hover {
                transform: translateY(-2px) scale(1.05) !important;
                box-shadow: 
                    0 10px 30px ${primary}50,
                    0 0 20px ${primary}40 !important;
            }
            
            /* TARJETAS DE GRÁFICOS */
            .chart-card {
                background: linear-gradient(135deg, 
                    rgba(30, 41, 59, 0.8) 0%, 
                    rgba(51, 65, 85, 0.6) 100%) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-top: 3px solid ${primary} !important;
                border-radius: 16px !important;
                box-shadow: 
                    0 8px 32px rgba(0,0,0,0.3),
                    inset 0 1px 0 rgba(255,255,255,0.1) !important;
                backdrop-filter: blur(10px) !important;
                color: white !important;
            }
            
            .chart-card:hover {
                transform: translateY(-3px) !important;
                box-shadow: 
                    0 12px 40px rgba(0,0,0,0.4),
                    0 0 15px ${primary}20 !important;
            }
            
            .chart-title {
                color: white !important;
                text-shadow: 0 0 8px ${primary}50 !important;
            }
            
            /* NAVEGACIÓN */
            .nav-link.active {
                background: linear-gradient(135deg, 
                    rgba(255,255,255,0.15) 0%, 
                    rgba(255,255,255,0.05) 100%) !important;
                color: white !important;
                border-radius: 10px !important;
                box-shadow: 
                    0 4px 15px rgba(0,0,0,0.3),
                    inset 0 1px 0 rgba(255,255,255,0.2) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
            }
            
            .nav-link:hover:not(.active) {
                background: rgba(255,255,255,0.08) !important;
                color: white !important;
                border-radius: 10px !important;
                transform: translateX(5px) !important;
                border-left: 3px solid ${primary} !important;
            }
            
            /* FILTROS */
            .filter-btn.active {
                background: ${primary} !important;
                color: white !important;
                border-color: transparent !important;
                box-shadow: 0 4px 12px ${primary}40 !important;
            }
            
            /* NOTIFICACIONES CON TEMA */
            .notification-badge {
                background: ${secondary} !important;
                box-shadow: 0 0 10px ${secondary}60 !important;
            }
            
            .grizalum-notification.success {
                border-left: 4px solid ${primary} !important;
            }
            
            /* SCROLLBAR TEMÁTICO */
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, ${primary}, ${secondary}) !important;
                box-shadow: 0 0 5px ${primary}50 !important;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                box-shadow: 0 0 10px ${primary}80 !important;
            }
            
            /* SELECTORES DE EMPRESA */
            .grizalum-selected-company:hover {
                border-color: ${primary}60 !important;
                box-shadow: 
                    0 6px 20px rgba(0,0,0,0.4),
                    0 0 15px ${primary}30 !important;
            }
            
            .grizalum-company-item:hover {
                border-left: 3px solid ${primary} !important;
            }
            
            .grizalum-company-item.active {
                border: 1px solid ${primary}60 !important;
                border-left: 4px solid ${primary} !important;
            }
            
            .grizalum-company-item-icon {
                background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%) !important;
            }
            
            .grizalum-btn-add-company {
                background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%) !important;
                box-shadow: 0 4px 12px ${primary}40 !important;
            }
            
            .grizalum-btn-add-company:hover {
                box-shadow: 0 6px 20px ${primary}60 !important;
            }
            
            /* EFECTOS ESPECIALES */
            .metric-card.kpi-increase {
                border-top-color: ${primary} !important;
                box-shadow: 0 0 20px ${primary}40 !important;
            }
            
            /* TEMA ESPECÍFICO PARA ${empresa ? empresa.name.toUpperCase() : 'EMPRESA'} */
            ${empresa ? `
            .company-brand .brand-text h1::after {
                content: ' • ${empresa.name}';
                font-size: 0.7em;
                color: ${primary};
                opacity: 0.8;
            }
            ` : ''}
        `;
    }

    /**
     * Actualizar variables CSS principales
     */
    actualizarVariablesCSS(tema) {
        const root = document.documentElement;
        root.style.setProperty('--grizalum-primary', tema.primary);
        root.style.setProperty('--grizalum-secondary', tema.secondary);
        root.style.setProperty('--grizalum-accent', tema.accent || tema.primary);
        
        console.log('🎨 Variables CSS actualizadas');
    }

    /**
     * Mostrar indicador de carga de tema
     */
    mostrarIndicadorCarga() {
        document.body.classList.add('tema-loading');
        
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion('🎨 Aplicando tema...', 'info', 1000);
        }
    }

    /**
     * Ocultar indicador de carga de tema
     */
    ocultarIndicadorCarga() {
        setTimeout(() => {
            document.body.classList.remove('tema-loading');
        }, 500);
    }

    /**
     * Crear tema personalizado
     */
    crearTemaPersonalizado(configuracion) {
        const temaId = `custom-${Date.now()}`;
        const tema = {
            id: temaId,
            primary: configuracion.primary,
            secondary: configuracion.secondary,
            accent: configuracion.accent || configuracion.primary,
            nombre: configuracion.nombre || 'Tema Personalizado',
            descripcion: configuracion.descripcion || 'Tema creado por el usuario',
            tipo: 'personalizado',
            fechaCreacion: Date.now()
        };

        this.temasPersonalizados.set(temaId, tema);
        this.temas.set(temaId, tema);
        
        console.log(`🎨 Tema personalizado creado: ${tema.nombre}`);
        return temaId;
    }

    /**
     * Obtener lista de todos los temas disponibles
     */
    obtenerTemas() {
        return Array.from(this.temas.values()).map(tema => ({
            id: tema.id,
            nombre: tema.nombre,
            descripcion: tema.descripcion,
            primary: tema.primary,
            secondary: tema.secondary,
            tipo: tema.tipo
        }));
    }

    /**
     * Obtener tema actual
     */
    obtenerTemaActual() {
        return temaActual;
    }

    /**
     * Obtener empresa actual
     */
    obtenerEmpresaActual() {
        return empresaActual;
    }

    /**
     * Configurar motor de temas
     */
    configurar(opciones) {
        this.configuracion = { ...this.configuracion, ...opciones };
        
        // Actualizar duración de transición
        if (opciones.transicionDuracion) {
            const root = document.documentElement;
            root.style.setProperty('--grizalum-transition', opciones.transicionDuracion);
        }
        
        console.log('⚙️ Configuración del motor de temas actualizada');
    }
}

// ================================================================
// INSTANCIA GLOBAL DEL MOTOR
// ================================================================
const motorTemas = new MotorTemas();

// ================================================================
// FUNCIONES GLOBALES PARA COMPATIBILIDAD
// ================================================================

/**
 * Función global principal para aplicar tema de empresa
 * Compatible con la función del grizalum-principal.js
 */
function aplicarTemaEmpresa(empresaId) {
    // Obtener empresa desde company-manager
    let empresa = null;
    if (window.grizalumCompanyManager && window.grizalumCompanyManager.companies) {
        empresa = window.grizalumCompanyManager.companies[empresaId];
    }
    
    if (empresa) {
        motorTemas.aplicarTemaEmpresa(empresaId, empresa);
    } else {
        console.warn(`⚠️ No se pudo aplicar tema para empresa: ${empresaId}`);
    }
}

/**
 * Función para aplicar tema por ID
 */
function aplicarTema(temaId) {
    motorTemas.aplicarTema(temaId);
}

// ================================================================
// INTEGRACIÓN CON OTROS MÓDULOS
// ================================================================

// Escuchar cuando termine la inicialización de company-manager
document.addEventListener('grizalumCompanyManagerReady', function(evento) {
    console.log('🏢 Company manager listo, sincronizando temas...');
    
    // Si hay una empresa activa, aplicar su tema
    if (window.grizalumCompanyManager && window.grizalumCompanyManager.currentCompanyId) {
        const empresaActiva = window.grizalumCompanyManager.companies[window.grizalumCompanyManager.currentCompanyId];
        if (empresaActiva && empresaActiva.theme) {
            motorTemas.aplicarTemaEmpresa(window.grizalumCompanyManager.currentCompanyId, empresaActiva);
        }
    }
});

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 DOM listo - Inicializando motor de temas...');
    motorTemas.inicializar();
});

// ================================================================
// API PÚBLICA DEL MOTOR DE TEMAS
// ================================================================

// Exponer API globalmente
window.GRIZALUM_TEMAS = {
    version: '1.0.0',
    aplicarTema: (temaId) => motorTemas.aplicarTema(temaId),
    aplicarTemaEmpresa: (empresaId, empresa) => motorTemas.aplicarTemaEmpresa(empresaId, empresa),
    crearTemaPersonalizado: (config) => motorTemas.crearTemaPersonalizado(config),
    obtenerTemas: () => motorTemas.obtenerTemas(),
    obtenerTemaActual: () => motorTemas.obtenerTemaActual(),
    configurar: (opciones) => motorTemas.configurar(opciones)
};

// Hacer funciones disponibles globalmente para compatibilidad
window.aplicarTemaEmpresa = aplicarTemaEmpresa;
window.aplicarTema = aplicarTema;

console.log(`
🎨 ===================================================
   MOTOR DE TEMAS CARGADO
🎨 ===================================================

✨ FUNCIONES DISPONIBLES:
   • aplicarTemaEmpresa(empresaId) - Aplicar tema de empresa
   • aplicarTema(temaId) - Aplicar tema específico
   • GRIZALUM_TEMAS.crearTemaPersonalizado(config) - Crear tema custom
   • GRIZALUM_TEMAS.obtenerTemas() - Listar todos los temas

🎨 TEMAS DISPONIBLES:
   • goldman-platinum (Dorado premium) 
   • tech-blue (Azul tecnológico)
   • forest-green (Verde empresarial)
   • royal-purple (Púrpura elegante)
   • sunset-orange (Naranja vibrante)
   • crimson-red (Rojo audaz)

🌟 CARACTERÍSTICAS:
   • 6 temas base de alta calidad
   • Temas dinámicos por empresa
   • Transiciones suaves automáticas
   • Efectos futuristas y glassmorphism
   • Variables CSS dinámicas
   • Modo oscuro forzado para elegancia

⚙️ CONFIGURACIÓN:
   • Duración de transiciones personalizable
   • Efectos visuales activar/desactivar
   • Temas personalizados por usuario

🎨 ===================================================
`);
