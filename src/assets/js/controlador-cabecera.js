// ================================================================
// CONTROLADOR DEL HEADER GRIZALUM
// Este archivo maneja SOLO la barra superior (header) de la aplicación
// ================================================================

console.log('🏗️ Cargando controlador del header...');

// ================================================================
// VARIABLES DEL HEADER
// ================================================================
let periodoActual = 'hoy';
let notificacionesAbiertas = false;
let centroNotificacionesVisible = false;

// ================================================================
// CLASE PRINCIPAL DEL CONTROLADOR DE HEADER
// ================================================================
class ControladorHeader {
    constructor() {
        this.header = null;
        this.botonesPeriodo = [];
        this.botonNotificaciones = null;
        this.botonIA = null;
        this.selectorEmpresa = null;
        this.contadorNotificaciones = 3; // Valor inicial
        
        this.configuracion = {
            periodos: [
                { id: 'hoy', nombre: 'Hoy', activo: true },
                { id: 'semana', nombre: 'Semana', activo: false },
                { id: 'mes', nombre: 'Mes', activo: false },
                { id: 'trimestre', nombre: 'Trimestre', activo: false },
                { id: 'año', nombre: 'Año', activo: false }
            ],
            notificacionesHabilitadas: true,
            iaHabilitada: true
        };
    }

    /**
     * Inicializar el controlador del header
     */
    inicializar() {
        console.log('🚀 Inicializando controlador del header...');
        
        // Encontrar elementos del header
        this.encontrarElementos();
        
        // Configurar botones de período
        this.configurarBotonesPeriodo();
        
        // Configurar centro de notificaciones
        this.configurarCentroNotificaciones();
        
        // Configurar botón IA Assistant
        this.configurarBotonIA();
        
        // Configurar selector de empresas
        this.configurarSelectorEmpresa();
        
        // Configurar eventos globales
        this.configurarEventos();
        
        console.log('✅ Controlador del header inicializado');
    }

    /**
     * Encontrar todos los elementos del header
     */
    encontrarElementos() {
        this.header = document.querySelector('.executive-header');
        if (!this.header) {
            console.error('❌ Header ejecutivo no encontrado');
            return;
        }

        // Botones de período
        this.botonesPeriodo = document.querySelectorAll('.period-btn');
        console.log(`📅 Botones de período encontrados: ${this.botonesPeriodo.length}`);

        // Botón de notificaciones
        this.botonNotificaciones = document.querySelector('.notification-center');
        if (this.botonNotificaciones) {
            console.log('🔔 Botón de notificaciones encontrado');
        }

        // Botón IA Assistant
        this.botonIA = document.querySelector('.ai-header-button');
        if (this.botonIA) {
            console.log('🤖 Botón IA Assistant encontrado');
        }

        // Selector de empresas
        this.selectorEmpresa = document.getElementById('companySelector');
        if (this.selectorEmpresa) {
            console.log('🏢 Selector de empresas encontrado');
        }
    }

    /**
     * Configurar botones de período de tiempo
     */
    configurarBotonesPeriodo() {
        if (this.botonesPeriodo.length === 0) {
            console.warn('⚠️ No se encontraron botones de período');
            return;
        }

        this.botonesPeriodo.forEach((boton, index) => {
            // Agregar ID único si no lo tiene
            if (!boton.id) {
                boton.id = `period-btn-${index}`;
            }

            // Configurar evento click
            boton.addEventListener('click', (evento) => {
                this.manejarCambioPeriodo(evento, boton);
            });

            // Agregar tooltip
            const periodo = boton.textContent.toLowerCase();
            boton.title = `Cambiar período a: ${periodo}`;

            // Configurar estado inicial
            if (boton.classList.contains('active')) {
                periodoActual = periodo;
            }
        });

        console.log(`📅 ${this.botonesPeriodo.length} botones de período configurados`);
    }

    /**
     * Configurar centro de notificaciones
     */
    configurarCentroNotificaciones() {
        if (!this.botonNotificaciones) {
            console.warn('⚠️ Botón de notificaciones no encontrado');
            return;
        }

        // Configurar evento click
        this.botonNotificaciones.addEventListener('click', (evento) => {
            this.alternarCentroNotificaciones();
        });

        // Actualizar contador inicial
        this.actualizarContadorNotificaciones(this.contadorNotificaciones);

        console.log('🔔 Centro de notificaciones configurado');
    }

    /**
     * Configurar botón IA Assistant
     */
    configurarBotonIA() {
        if (!this.botonIA) {
            console.warn('⚠️ Botón IA Assistant no encontrado');
            return;
        }

        // Configurar evento click
        this.botonIA.addEventListener('click', (evento) => {
            this.abrirIAAssistant();
        });

        // Agregar tooltip
        this.botonIA.title = 'Abrir IA Assistant';

        console.log('🤖 Botón IA Assistant configurado');
    }

    /**
     * Configurar selector de empresas
     */
    configurarSelectorEmpresa() {
        if (!this.selectorEmpresa) {
            console.warn('⚠️ Selector de empresas no encontrado');
            return;
        }

        // El selector se maneja principalmente por company-manager.js
        // Aquí solo agregamos algunos eventos si es necesario
        
        console.log('🏢 Selector de empresas configurado');
    }

    /**
     * Configurar eventos globales del header
     */
    configurarEventos() {
        // Hacer header responsive
        window.addEventListener('resize', () => {
            this.manejarCambioTamaño();
        });

        // Escuchar teclas de atajo
        document.addEventListener('keydown', (evento) => {
            this.manejarTeclasAtajo(evento);
        });

        // Cerrar paneles abiertos al hacer clic fuera
        document.addEventListener('click', (evento) => {
            this.manejarClickFuera(evento);
        });

        console.log('🎯 Eventos globales del header configurados');
    }

    /**
     * Manejar cambio de período
     */
    manejarCambioPeriodo(evento, botonClickeado) {
        evento.preventDefault();
        
        const nuevoPeriodo = botonClickeado.textContent.toLowerCase();
        
        // No hacer nada si ya está activo
        if (nuevoPeriodo === periodoActual) {
            console.log(`📅 Período ${nuevoPeriodo} ya está activo`);
            return;
        }

        // Remover clase active de todos los botones
        this.botonesPeriodo.forEach(boton => {
            boton.classList.remove('active');
        });

        // Agregar clase active al botón clickeado
        botonClickeado.classList.add('active');

        // Actualizar período actual
        const periodoAnterior = periodoActual;
        periodoActual = nuevoPeriodo;

        console.log(`📅 Período cambiado: ${periodoAnterior} → ${nuevoPeriodo}`);

        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('grizalumPeriodoCambiado', {
            detail: { 
                periodo: nuevoPeriodo,
                periodoAnterior: periodoAnterior,
                timestamp: Date.now(),
                boton: botonClickeado
            }
        }));

        // Mostrar notificación
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(
                `📅 Período cambiado a: ${nuevoPeriodo}`, 
                'info', 
                2000
            );
        }

        // Simular carga de datos para el nuevo período
        this.simularCargaDatos(nuevoPeriodo);
    }

    /**
     * Alternar centro de notificaciones
     */
    alternarCentroNotificaciones() {
        centroNotificacionesVisible = !centroNotificacionesVisible;
        
        if (centroNotificacionesVisible) {
            this.mostrarCentroNotificaciones();
        } else {
            this.ocultarCentroNotificaciones();
        }
    }

    /**
     * Mostrar centro de notificaciones
     */
    mostrarCentroNotificaciones() {
        console.log('🔔 Abriendo centro de notificaciones...');
        
        // Crear panel de notificaciones si no existe
        let panel = document.getElementById('notifications-panel');
        if (!panel) {
            panel = this.crearPanelNotificaciones();
        }

        // Mostrar panel
        panel.style.display = 'block';
        setTimeout(() => {
            panel.classList.add('show');
        }, 10);

        // Marcar botón como activo
        this.botonNotificaciones.classList.add('active');

        // Limpiar contador de notificaciones
        this.actualizarContadorNotificaciones(0);

        centroNotificacionesVisible = true;
    }

    /**
     * Ocultar centro de notificaciones
     */
    ocultarCentroNotificaciones() {
        const panel = document.getElementById('notifications-panel');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
        }

        // Desmarcar botón como activo
        this.botonNotificaciones.classList.remove('active');

        centroNotificacionesVisible = false;
        console.log('🔔 Centro de notificaciones cerrado');
    }

    /**
     * Crear panel de notificaciones
     */
    crearPanelNotificaciones() {
        const panel = document.createElement('div');
        panel.id = 'notifications-panel';
        panel.className = 'notifications-panel';
        
        panel.innerHTML = `
            <div class="notifications-header">
                <h3>🔔 Centro de Notificaciones</h3>
                <button class="notifications-close" onclick="this.closest('.notifications-panel').style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notifications-content">
                <div class="notification-item">
                    <div class="notification-icon success">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">Sistema actualizado</div>
                        <div class="notification-time">Hace 2 minutos</div>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon info">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">Nuevo reporte disponible</div>
                        <div class="notification-time">Hace 1 hora</div>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon warning">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">Revisar gastos del mes</div>
                        <div class="notification-time">Hace 3 horas</div>
                    </div>
                </div>
            </div>
            <div class="notifications-footer">
                <button class="btn-view-all">Ver todas las notificaciones</button>
            </div>
        `;

        // Agregar estilos
        this.agregarEstilosPanelNotificaciones();
        
        // Posicionar cerca del botón
        const rect = this.botonNotificaciones.getBoundingClientRect();
        panel.style.position = 'fixed';
        panel.style.top = (rect.bottom + 10) + 'px';
        panel.style.right = '20px';
        panel.style.zIndex = '999999';

        document.body.appendChild(panel);
        return panel;
    }

    /**
     * Abrir IA Assistant
     */
    abrirIAAssistant() {
        console.log('🤖 Abriendo IA Assistant...');
        
        // Marcar botón como activo temporalmente
        this.botonIA.classList.add('active');
        
        setTimeout(() => {
            this.botonIA.classList.remove('active');
        }, 1000);

        // Mostrar notificación temporal
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(
                '🤖 IA Assistant próximamente disponible', 
                'info', 
                3000
            );
        }

        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('grizalumIAAssistantSolicitado', {
            detail: { timestamp: Date.now() }
        }));
    }

    /**
     * Actualizar contador de notificaciones
     */
    actualizarContadorNotificaciones(cantidad) {
        const badge = this.botonNotificaciones.querySelector('.notification-badge');
        if (!badge) return;

        this.contadorNotificaciones = cantidad;

        if (cantidad > 0) {
            badge.textContent = cantidad > 99 ? '99+' : cantidad;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }

        console.log(`🔔 Contador de notificaciones actualizado: ${cantidad}`);
    }

    /**
     * Simular carga de datos para nuevo período
     */
    simularCargaDatos(periodo) {
        // Mostrar indicador de carga
        this.mostrarIndicadorCarga();

        // Simular tiempo de carga
        setTimeout(() => {
            this.ocultarIndicadorCarga();
            
            // Disparar evento de datos cargados
            document.dispatchEvent(new CustomEvent('grizalumDatosPeriodoCargados', {
                detail: { 
                    periodo: periodo,
                    timestamp: Date.now(),
                    datos: this.generarDatosSimulados(periodo)
                }
            }));

            console.log(`📊 Datos del período ${periodo} cargados (simulación)`);
        }, 1500);
    }

    /**
     * Mostrar indicador de carga
     */
    mostrarIndicadorCarga() {
        // Agregar clase loading al header
        this.header.classList.add('loading');
        
        // Deshabilitar botones temporalmente
        this.botonesPeriodo.forEach(boton => {
            boton.disabled = true;
        });
    }

    /**
     * Ocultar indicador de carga
     */
    ocultarIndicadorCarga() {
        // Remover clase loading del header
        this.header.classList.remove('loading');
        
        // Habilitar botones
        this.botonesPeriodo.forEach(boton => {
            boton.disabled = false;
        });
    }

    /**
     * Generar datos simulados para un período
     */
    generarDatosSimulados(periodo) {
        const multiplicadores = {
            'hoy': 0.1,
            'semana': 0.7,
            'mes': 1.0,
            'trimestre': 3.2,
            'año': 12.5
        };

        const multiplicador = multiplicadores[periodo] || 1.0;
        
        return {
            revenue: Math.round(2847293 * multiplicador),
            expenses: Math.round(28700 * multiplicador),
            profit: Math.round(16500 * multiplicador),
            growth: `+${(24.8 * multiplicador).toFixed(1)}%`,
            cashFlow: Math.round(24500 * multiplicador)
        };
    }

    /**
     * Manejar teclas de atajo
     */
    manejarTeclasAtajo(evento) {
        // Alt + N = Notificaciones
        if (evento.altKey && evento.key === 'n') {
            evento.preventDefault();
            this.alternarCentroNotificaciones();
        }

        // Alt + I = IA Assistant
        if (evento.altKey && evento.key === 'i') {
            evento.preventDefault();
            this.abrirIAAssistant();
        }

        // Números 1-5 para cambiar períodos rápidamente
        if (evento.altKey && evento.key >= '1' && evento.key <= '5') {
            evento.preventDefault();
            const indice = parseInt(evento.key) - 1;
            if (this.botonesPeriodo[indice]) {
                this.manejarCambioPeriodo({ preventDefault: () => {} }, this.botonesPeriodo[indice]);
            }
        }
    }

    /**
     * Manejar clic fuera para cerrar paneles
     */
    manejarClickFuera(evento) {
        // Cerrar panel de notificaciones si está abierto
        if (centroNotificacionesVisible) {
            const panel = document.getElementById('notifications-panel');
            const botonNotif = this.botonNotificaciones;
            
            if (panel && !panel.contains(evento.target) && !botonNotif.contains(evento.target)) {
                this.ocultarCentroNotificaciones();
            }
        }
    }

    /**
     * Manejar cambio de tamaño de ventana
     */
    manejarCambioTamaño() {
        // Reposicionar panel de notificaciones si está abierto
        if (centroNotificacionesVisible) {
            const panel = document.getElementById('notifications-panel');
            if (panel) {
                const rect = this.botonNotificaciones.getBoundingClientRect();
                panel.style.top = (rect.bottom + 10) + 'px';
                panel.style.right = '20px';
            }
        }
    }

    /**
     * Agregar estilos para el panel de notificaciones
     */
    agregarEstilosPanelNotificaciones() {
        const styleId = 'notifications-panel-styles';
        
        if (document.getElementById(styleId)) return;

        const estilos = document.createElement('style');
        estilos.id = styleId;
        estilos.textContent = `
            .notifications-panel {
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.9));
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                backdrop-filter: blur(20px);
                width: 350px;
                max-height: 500px;
                overflow: hidden;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                display: none;
            }
            
            .notifications-panel.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .notifications-header {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notifications-header h3 {
                margin: 0;
                color: white;
                font-size: 16px;
            }
            
            .notifications-close {
                background: none;
                border: none;
                color: rgba(255,255,255,0.6);
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .notifications-close:hover {
                background: rgba(255,255,255,0.1);
                color: white;
            }
            
            .notifications-content {
                max-height: 350px;
                overflow-y: auto;
            }
            
            .notification-item {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background 0.2s ease;
            }
            
            .notification-item:hover {
                background: rgba(255,255,255,0.05);
            }
            
            .notification-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            }
            
            .notification-icon.success {
                background: #10b981;
                color: white;
            }
            
            .notification-icon.info {
                background: #3b82f6;
                color: white;
            }
            
            .notification-icon.warning {
                background: #f59e0b;
                color: white;
            }
            
            .notification-details {
                flex: 1;
            }
            
            .notification-title {
                color: white;
                font-weight: 500;
                margin-bottom: 4px;
            }
            
            .notification-time {
                color: rgba(255,255,255,0.6);
                font-size: 12px;
            }
            
            .notifications-footer {
                padding: 15px 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                text-align: center;
            }
            
            .btn-view-all {
                background: rgba(59, 130, 246, 0.2);
                border: 1px solid #3b82f6;
                color: #60a5fa;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .btn-view-all:hover {
                background: rgba(59, 130, 246, 0.3);
                transform: translateY(-1px);
            }
            
            /* Loading state para header */
            .executive-header.loading::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, transparent, #3b82f6, transparent);
                animation: headerLoading 1.5s infinite;
            }
            
            @keyframes headerLoading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        
        document.head.appendChild(estilos);
    }

    /**
     * Obtener estado actual del header
     */
    obtenerEstado() {
        return {
            periodoActual: periodoActual,
            notificacionesAbiertas: centroNotificacionesVisible,
            contadorNotificaciones: this.contadorNotificaciones,
            botonesPeriodo: this.botonesPeriodo.length,
            elementosEncontrados: {
                header: !!this.header,
                notificaciones: !!this.botonNotificaciones,
                ia: !!this.botonIA,
                selectorEmpresa: !!this.selectorEmpresa
            }
        };
    }
}

// ================================================================
// INSTANCIA GLOBAL DEL CONTROLADOR
// ================================================================
const controladorHeader = new ControladorHeader();

// ================================================================
// FUNCIONES GLOBALES PARA COMPATIBILIDAD
// ================================================================

/**
 * Función global para cambiar período (llamada desde HTML)
 */
function changePeriod(periodo, boton) {
    if (boton) {
        controladorHeader.manejarCambioPeriodo({ preventDefault: () => {} }, boton);
    }
}

/**
 * Función global para mostrar notificaciones (llamada desde HTML)
 */
function showNotifications() {
    controladorHeader.alternarCentroNotificaciones();
}

/**
 * Función global para IA Assistant (llamada desde HTML)
 */
function toggleAIAssistant() {
    controladorHeader.abrirIAAssistant();
}

// ================================================================
// INTEGRACIÓN CON OTROS MÓDULOS
// ================================================================

// Escuchar cuando se carguen datos de un período
document.addEventListener('grizalumDatosPeriodoCargados', function(evento) {
    const { periodo, datos } = evento.detail;
    console.log(`📊 Datos del período ${periodo} cargados, actualizando KPIs...`);
    
    // Actualizar KPIs con los nuevos datos
    if (window.actualizarKPIs && datos) {
        window.actualizarKPIs(datos);
    }
});

// Escuchar cambios de empresa para actualizar el header
document.addEventListener('grizalumCompanyChanged', function(evento) {
    const { company } = evento.detail;
    console.log(`🏢 Header notificado del cambio de empresa: ${company.name}`);
    
    // Simular nueva carga de datos para la empresa
    setTimeout(() => {
        controladorHeader.simularCargaDatos(periodoActual);
    }, 500);
});

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏗️ DOM listo - Inicializando controlador del header...');
    
    // Esperar un poco para que otros elementos se carguen
    setTimeout(() => {
        controladorHeader.inicializar();
    }, 300);
});

// ================================================================
// API PÚBLICA DEL CONTROLADOR DE HEADER
// ================================================================

// Exponer API globalmente
window.GRIZALUM_HEADER = {
    version: '1.0.0',
    cambiarPeriodo: (periodo) => {
        const boton = Array.from(controladorHeader.botonesPeriodo).find(btn => 
            btn.textContent.toLowerCase() === periodo.toLowerCase()
        );
        if (boton) {
            controladorHeader.manejarCambioPeriodo({ preventDefault: () => {} }, boton);
        }
    },
    mostrarNotificaciones: () => controladorHeader.mostrarCentroNotificaciones(),
    ocultarNotificaciones: () => controladorHeader.ocultarCentroNotificaciones(),
    abrirIA: () => controladorHeader.abrirIAAssistant(),
    actualizarContador: (cantidad) => controladorHeader.actualizarContadorNotificaciones(cantidad),
    obtenerEstado: () => controladorHeader.obtenerEstado()
};

// Hacer funciones disponibles globalmente para el HTML
window.changePeriod = changePeriod;
window.showNotifications = showNotifications;
window.toggleAIAssistant = toggleAIAssistant;

console.log(`
🏗️ ===================================================
   CONTROLADOR DEL HEADER CARGADO
🏗️ ===================================================

✨ FUNCIONES DISPONIBLES:
   • changePeriod(periodo, boton) - Cambiar período de tiempo
   • showNotifications() - Mostrar centro de notificaciones
   • toggleAIAssistant() - Abrir IA Assistant
   • GRIZALUM_HEADER.actualizarContador(cantidad) - Actualizar badge

📅 BOTONES DE PERÍODO:
   • Hoy, Semana, Mes, Trimestre, Año
   • Atajos de teclado: Alt + 1-5
   • Simulación automática de datos

🔔 CENTRO DE NOTIFICACIONES:
   • Panel deslizable desde botón
   • Contador dinámico de notificaciones
   • Atajo de teclado: Alt + N

🤖 IA ASSISTANT:
   • Botón preparado para integración futura
   • Atajo de teclado: Alt + I

⚙️ CARACTERÍSTICAS:
   • Responsive automático
   • Estados de carga visuales
   • Eventos personalizados
   • Integración con KPIs
   • Teclas de atajo

🏗️ ===================================================
`);


