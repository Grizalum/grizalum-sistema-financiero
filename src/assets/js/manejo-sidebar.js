// ================================================================
// MANEJO DEL SIDEBAR (MENÚ LATERAL)
// Este archivo maneja SOLO el menú lateral de la aplicación
// ================================================================

console.log('📱 Cargando controlador del sidebar...');

// ================================================================
// VARIABLES DEL SIDEBAR
// ================================================================
let sidebarAbierto = false;
let seccionActual = 'dashboard';

// ================================================================
// CLASE PRINCIPAL DEL SIDEBAR
// ================================================================
class ManejadorSidebar {
    constructor() {
        this.sidebar = null;
        this.enlaces = [];
        this.seccionActual = 'dashboard';
        this.datosFinancieros = {
            cashFlow: 24500,
            profit: 16500
        };
    }

    /**
     * Inicializar el controlador del sidebar
     */
    inicializar() {
        console.log('🚀 Inicializando controlador del sidebar...');
        
        // Encontrar el sidebar en el DOM
        this.sidebar = document.getElementById('sidebar');
        if (!this.sidebar) {
            console.error('❌ No se encontró el sidebar en el DOM');
            return;
        }

        // Encontrar todos los enlaces de navegación
        this.enlaces = document.querySelectorAll('.nav-link');
        
        // Configurar eventos
        this.configurarEventos();
        
        // Configurar responsivo para móviles
        this.configurarResponsive();
        
        console.log('✅ Sidebar inicializado correctamente');
        console.log(`📊 Enlaces encontrados: ${this.enlaces.length}`);
    }

    /**
     * Configurar todos los eventos del sidebar
     */
    configurarEventos() {
        // Eventos para los enlaces de navegación
        this.enlaces.forEach((enlace, index) => {
            enlace.addEventListener('click', (evento) => {
                this.manejarClickEnlace(evento, enlace);
            });
        });

        // Escuchar clics fuera del sidebar para cerrarlo en móvil
        document.addEventListener('click', (evento) => {
            this.manejarClickFuera(evento);
        });

        // Escuchar cambios de tamaño de ventana
        window.addEventListener('resize', () => {
            this.manejarCambioTamaño();
        });

        console.log('🎯 Eventos del sidebar configurados');
    }

    /**
     * Configurar comportamiento responsivo
     */
    configurarResponsive() {
        // En pantallas grandes, asegurar que el sidebar esté visible
        if (window.innerWidth > 768) {
            this.sidebar.classList.remove('open');
            sidebarAbierto = false;
        }
    }

    /**
     * Abrir o cerrar el sidebar (toggle)
     * Esta es la función principal que se llama desde el HTML
     */
    toggle() {
        if (!this.sidebar) {
            console.error('❌ Sidebar no disponible para toggle');
            return;
        }

        sidebarAbierto = !sidebarAbierto;
        
        if (sidebarAbierto) {
            this.abrir();
        } else {
            this.cerrar();
        }
    }

    /**
     * Abrir el sidebar
     */
    abrir() {
        this.sidebar.classList.add('open');
        sidebarAbierto = true;
        
        // Agregar overlay para móviles
        this.crearOverlay();
        
        console.log('📱 Sidebar abierto');
        
        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('sidebarAbierto', {
            detail: { timestamp: Date.now() }
        }));
    }

    /**
     * Cerrar el sidebar
     */
    cerrar() {
        this.sidebar.classList.remove('open');
        sidebarAbierto = false;
        
        // Remover overlay
        this.removerOverlay();
        
        console.log('📱 Sidebar cerrado');
        
        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('sidebarCerrado', {
            detail: { timestamp: Date.now() }
        }));
    }

    /**
     * Crear overlay oscuro para móviles
     */
    crearOverlay() {
        // No crear si ya existe
        if (document.getElementById('sidebar-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            display: block;
        `;
        
        // Cerrar sidebar al hacer clic en overlay
        overlay.addEventListener('click', () => {
            this.cerrar();
        });
        
        document.body.appendChild(overlay);
    }

    /**
     * Remover overlay oscuro
     */
    removerOverlay() {
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    /**
     * Manejar clic en enlaces de navegación
     */
    manejarClickEnlace(evento, enlace) {
        // Prevenir navegación por defecto
        evento.preventDefault();
        
        // Extraer sección del onclick
        const onclick = enlace.getAttribute('onclick');
        let seccion = 'dashboard';
        
        if (onclick) {
            const match = onclick.match(/showSection\('(.+?)'\)/);
            if (match) {
                seccion = match[1];
            }
        }
        
        // Navegar a la sección
        this.navegarASeccion(seccion, enlace);
    }

    /**
     * Navegar a una sección específica
     */
    navegarASeccion(seccion, enlaceActivo = null) {
        console.log(`🧭 Navegando a sección: ${seccion}`);
        
        // Actualizar sección actual
        this.seccionActual = seccion;
        
        // Actualizar estados activos
        this.actualizarEnlaceActivo(enlaceActivo || this.encontrarEnlacePorSeccion(seccion));
        
        // Cerrar sidebar en móvil después de navegar
        if (window.innerWidth <= 768 && sidebarAbierto) {
            setTimeout(() => {
                this.cerrar();
            }, 300);
        }
        
        // Disparar evento de navegación
        document.dispatchEvent(new CustomEvent('navegacionSidebar', {
            detail: { 
                seccion: seccion, 
                timestamp: Date.now(),
                enlace: enlaceActivo 
            }
        }));
        
        // Mostrar notificación temporal
        if (window.GRIZALUM && window.GRIZALUM.mostrarNotificacion) {
            window.GRIZALUM.mostrarNotificacion(`📱 Sección: ${this.obtenerNombreSeccion(seccion)}`, 'info', 2000);
        }
    }

    /**
     * Encontrar enlace por sección
     */
    encontrarEnlacePorSeccion(seccion) {
        return Array.from(this.enlaces).find(enlace => {
            const onclick = enlace.getAttribute('onclick');
            return onclick && onclick.includes(`showSection('${seccion}')`);
        });
    }

    /**
     * Actualizar enlace activo en la navegación
     */
    actualizarEnlaceActivo(enlaceNuevo) {
        // Remover clase active de todos los enlaces
        this.enlaces.forEach(enlace => {
            enlace.classList.remove('active');
        });
        
        // Agregar clase active al enlace seleccionado
        if (enlaceNuevo) {
            enlaceNuevo.classList.add('active');
            console.log(`✅ Enlace activo actualizado: ${enlaceNuevo.textContent.trim()}`);
        }
    }

    /**
     * Obtener nombre amigable de la sección
     */
    obtenerNombreSeccion(seccion) {
        const nombres = {
            'dashboard': 'Panel de Control',
            'cash-flow': 'Flujo de Caja',
            'income-statement': 'Estado de Resultados',
            'balance-sheet': 'Balance General',
            'inventory': 'Inventario',
            'sales': 'Ventas'
        };
        
        return nombres[seccion] || seccion;
    }

    /**
     * Manejar clic fuera del sidebar para cerrarlo en móvil
     */
    manejarClickFuera(evento) {
        // Solo en móviles y si el sidebar está abierto
        if (window.innerWidth > 768 || !sidebarAbierto) return;
        
        // Si el clic fue dentro del sidebar, no hacer nada
        if (this.sidebar.contains(evento.target)) return;
        
        // Si el clic fue en el botón de toggle, no hacer nada
        const botonToggle = document.querySelector('.mobile-menu-toggle');
        if (botonToggle && botonToggle.contains(evento.target)) return;
        
        // Cerrar sidebar
        this.cerrar();
    }

    /**
     * Manejar cambio de tamaño de ventana
     */
    manejarCambioTamaño() {
        // En pantallas grandes, cerrar sidebar y remover overlay
        if (window.innerWidth > 768) {
            this.cerrar();
        }
    }

    /**
     * Actualizar resumen financiero en el sidebar
     */
    actualizarResumenFinanciero(datos) {
        if (!datos) return;
        
        try {
            // Actualizar flujo de caja
            const elementoCashFlow = document.getElementById('sidebarCashFlow');
            if (elementoCashFlow && datos.cashFlow !== undefined) {
                elementoCashFlow.textContent = `S/. ${datos.cashFlow.toLocaleString()}`;
                this.datosFinancieros.cashFlow = datos.cashFlow;
            }
            
            // Actualizar utilidad neta
            const elementoProfit = document.getElementById('sidebarProfit');
            if (elementoProfit && datos.profit !== undefined) {
                elementoProfit.textContent = `S/. ${datos.profit.toLocaleString()}`;
                this.datosFinancieros.profit = datos.profit;
            }
            
            console.log('💰 Resumen financiero del sidebar actualizado');
            console.log(`   Flujo de Caja: S/. ${this.datosFinancieros.cashFlow.toLocaleString()}`);
            console.log(`   Utilidad Neta: S/. ${this.datosFinancieros.profit.toLocaleString()}`);
            
        } catch (error) {
            console.error('❌ Error actualizando resumen financiero del sidebar:', error);
        }
    }

    /**
     * Obtener estado actual del sidebar
     */
    obtenerEstado() {
        return {
            abierto: sidebarAbierto,
            seccionActual: this.seccionActual,
            datosFinancieros: this.datosFinancieros,
            cantidadEnlaces: this.enlaces.length
        };
    }

    /**
     * Resaltar sección específica temporalmente
     */
    resaltarSeccion(seccion, duracion = 2000) {
        const enlace = this.encontrarEnlacePorSeccion(seccion);
        if (!enlace) return;
        
        enlace.style.background = 'rgba(255, 255, 255, 0.2)';
        enlace.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            enlace.style.background = '';
        }, duracion);
        
        console.log(`✨ Sección ${seccion} resaltada por ${duracion}ms`);
    }
}

// ================================================================
// INSTANCIA GLOBAL DEL MANEJADOR
// ================================================================
const manejadorSidebar = new ManejadorSidebar();

// ================================================================
// EVENTOS DE INTEGRACIÓN CON OTROS MÓDULOS
// ================================================================

// Escuchar cuando cambien los datos financieros
document.addEventListener('grizalumDatosFinancierosActualizados', function(evento) {
    const datos = evento.detail;
    manejadorSidebar.actualizarResumenFinanciero(datos);
});

// Escuchar cuando cambie la empresa
document.addEventListener('grizalumCompanyChanged', function(evento) {
    const { company } = evento.detail;
    if (company && company.data) {
        manejadorSidebar.actualizarResumenFinanciero(company.data);
    }
});

// ================================================================
// FUNCIONES GLOBALES PARA EL HTML
// ================================================================

/**
 * Función global para toggle del sidebar (llamada desde HTML)
 */
function toggleSidebar() {
    manejadorSidebar.toggle();
}

/**
 * Función global para navegar a sección (llamada desde HTML)
 */
function showSection(seccion) {
    manejadorSidebar.navegarASeccion(seccion);
}

// Hacer funciones disponibles globalmente
window.toggleSidebar = toggleSidebar;
window.showSection = showSection;

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM listo - Inicializando manejador del sidebar...');
    manejadorSidebar.inicializar();
});

// ================================================================
// API PÚBLICA DEL SIDEBAR
// ================================================================

// Exponer API del sidebar
window.GRIZALUM_SIDEBAR = {
    version: '1.0.0',
    toggle: () => manejadorSidebar.toggle(),
    abrir: () => manejadorSidebar.abrir(),
    cerrar: () => manejadorSidebar.cerrar(),
    navegarA: (seccion) => manejadorSidebar.navegarASeccion(seccion),
    obtenerEstado: () => manejadorSidebar.obtenerEstado(),
    actualizarFinanciero: (datos) => manejadorSidebar.actualizarResumenFinanciero(datos),
    resaltar: (seccion, duracion) => manejadorSidebar.resaltarSeccion(seccion, duracion)
};

console.log(`
📱 ===================================================
   CONTROLADOR DEL SIDEBAR CARGADO
📱 ===================================================

✨ FUNCIONES DISPONIBLES:
   • toggleSidebar() - Abrir/cerrar menú lateral
   • showSection(seccion) - Navegar a sección específica
   • GRIZALUM_SIDEBAR.abrir() - Abrir sidebar programáticamente
   • GRIZALUM_SIDEBAR.cerrar() - Cerrar sidebar programáticamente
   • GRIZALUM_SIDEBAR.obtenerEstado() - Ver estado actual

📱 CARACTERÍSTICAS:
   • Responsive automático para móviles
   • Overlay oscuro en móviles
   • Estados activos automáticos
   • Integración con datos financieros
   • Eventos personalizados

🔗 EVENTOS QUE ESCUCHA:
   • grizalumDatosFinancierosActualizados
   • grizalumCompanyChanged

🔗 EVENTOS QUE EMITE:
   • sidebarAbierto
   • sidebarCerrado
   • navegacionSidebar

📱 ===================================================
`);
