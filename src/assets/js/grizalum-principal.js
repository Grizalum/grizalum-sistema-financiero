// ================================================================
// GRIZALUM - ARCHIVO PRINCIPAL 
// Este archivo es el "CEREBRO" de tu aplicación
// Reemplaza todo el script masivo que tenías en index.html
// ================================================================

console.log('🚀 GRIZALUM - Archivo principal cargando...');

// ================================================================
// VARIABLES GLOBALES DEL SISTEMA
// ================================================================
let sistemaListo = false;
let temaActual = 'goldman-platinum';
let periodoActual = 'hoy';

// ================================================================
// FUNCIÓN PRINCIPAL - INICIA TODO EL SISTEMA
// ================================================================
function iniciarSistemaGrizalum() {
    console.log('🌟 Iniciando sistema GRIZALUM...');
    
    // 1. Ocultar pantalla de carga después de 3 segundos
    setTimeout(() => {
        const pantallaCarga = document.getElementById('loadingScreen');
        if (pantallaCarga) {
            pantallaCarga.classList.add('hide');
            console.log('✅ Pantalla de carga ocultada');
        }
    }, 3000);
    
    // 2. Inicializar gráficos después de 1 segundo
    setTimeout(() => {
        if (typeof Chart !== 'undefined' && typeof initializeCharts === 'function') {
            try {
                initializeCharts();
                console.log('📊 Gráficos inicializados correctamente');
            } catch (error) {
                console.error('❌ Error al inicializar gráficos:', error);
            }
        } else {
            console.warn('⚠️ Chart.js o initializeCharts no está disponible');
        }
    }, 1000);
    
    // 3. Configurar todos los eventos
    configurarEventos();
    
    // 4. Marcar sistema como listo
    sistemaListo = true;
    console.log('✅ Sistema GRIZALUM completamente listo');
    
    // 5. Mostrar mensaje de bienvenida
    // mostrarNotificacion('Sistema GRIZALUM iniciado correctamente', 'success');
}

// ================================================================
// CONFIGURAR TODOS LOS EVENTOS DEL SISTEMA
// ================================================================
function configurarEventos() {
    console.log('🎯 Configurando eventos del sistema...');
    
    // Eventos para filtros de gráficos
    document.querySelectorAll('.filter-btn').forEach(boton => {
        boton.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            console.log(`📊 Filtro de gráfico cambiado: ${this.textContent}`);
        });
    });
    
    // Eventos para botones de período
    document.querySelectorAll('.period-btn').forEach(boton => {
        boton.addEventListener('click', function() {
            const periodo = this.textContent.toLowerCase();
            cambiarPeriodo(periodo, this);
        });
    });
    
    console.log('✅ Eventos configurados correctamente');
}

// ================================================================
// FUNCIONES DEL SIDEBAR (MENÚ LATERAL)
// ================================================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
        console.log('📱 Menú lateral toggled');
    } else {
        console.error('❌ No se encontró el sidebar');
    }
}

// ================================================================
// NAVEGACIÓN ENTRE SECCIONES - VERSIÓN CORREGIDA
// ================================================================
function showSection(seccion) {
    console.log(`🧭 Navegando a sección: ${seccion}`);
    
    // Ocultar todas las secciones
    document.querySelectorAll('.dashboard-content').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Mostrar la sección solicitada
    const targetSection = document.getElementById(seccion + 'Content');
    if (targetSection) {
        targetSection.style.display = 'flex';
        targetSection.classList.add('active');
        console.log(`✅ Sección ${seccion} mostrada correctamente`);
    } else {
        console.error(`❌ No se encontró la sección: ${seccion}Content`);
        return;
    }
    
    // Actualizar enlaces activos en el menú
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const enlaceActivo = document.querySelector(`[data-section="${seccion}"]`);
    if (enlaceActivo) {
        enlaceActivo.classList.add('active');
    }
    
    // Actualizar títulos del header
    const titles = {
        'dashboard': { title: 'Panel de Control Ejecutivo', subtitle: 'Resumen financiero en tiempo real' },
        'cash-flow': { title: 'Flujo de Caja', subtitle: 'Control de ingresos y egresos' },
        'income-statement': { title: 'Estado de Resultados', subtitle: 'Análisis de rentabilidad' },
        'balance-sheet': { title: 'Balance General', subtitle: 'Situación financiera' },
        'inventory': { title: 'Inventario', subtitle: 'Gestión de stock y productos' },
        'sales': { title: 'Ventas', subtitle: 'Registro y análisis de ventas' }
    };
    
    if (titles[seccion]) {
        const titleElement = document.getElementById('pageTitle');
        const subtitleElement = document.getElementById('pageSubtitle');
        if (titleElement) titleElement.textContent = titles[seccion].title;
        if (subtitleElement) subtitleElement.textContent = titles[seccion].subtitle;
    }
    
    // Disparar evento para otros módulos
    document.dispatchEvent(new CustomEvent('grizalumSeccionCambiada', {
        detail: { seccion: seccion, timestamp: Date.now() }
    }));
}

// ================================================================
// FUNCIONES DEL HEADER (BARRA SUPERIOR)
// ================================================================

function changePeriod(periodo, boton) {
    if (!boton) {
        console.error('❌ No se recibió el botón para changePeriod');
        return;
    }
    
    document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');
    
    periodoActual = periodo;
    
    console.log(`📅 Período cambiado a: ${periodo}`);
    
    document.dispatchEvent(new CustomEvent('grizalumPeriodoCambiado', {
        detail: { periodo: periodo, timestamp: Date.now() }
    }));
    
   // mostrarNotificacion(`Período cambiado a: ${periodo}`, 'info');
}

function showNotifications() {
    console.log('🔔 Abriendo centro de notificaciones');
    if (typeof mostrarNotificacionesAdmin === 'function') {
        mostrarNotificacionesAdmin();
    }
}

function actualizarNotificacionesEmpresa() {
    if (typeof actualizarContadorCampana === 'function') {
        actualizarContadorCampana();
    }
}

function toggleAIAssistant() {
    console.log('🤖 Abriendo IA Assistant');
    mostrarNotificacion('IA Assistant próximamente', 'info');
}

// ================================================================
// SISTEMA DE NOTIFICACIONES
// ================================================================

function mostrarNotificacion(mensaje, tipo = 'info', duracion = 5000) {
    const notificacion = document.createElement('div');
    notificacion.className = `grizalum-notification ${tipo}`;
    
    const iconos = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle', 
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    notificacion.innerHTML = `
        <div class="notification-content">
            <i class="${iconos[tipo] || iconos.info}"></i>
            <span>${mensaje}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    let contenedor = document.getElementById('notificationContainer');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'notificationContainer';
        contenedor.className = 'notification-container';
        document.body.appendChild(contenedor);
    }
    
    contenedor.appendChild(notificacion);
    
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, duracion);
    
    console.log(`🔔 Notificación mostrada: ${tipo} - ${mensaje}`);
}

// ================================================================
// ACTUALIZAR DATOS EN PANTALLA
// ================================================================

function actualizarKPIs(datos) {
    return;
}

function actualizarSidebar(datos) {
    return;
}

// ================================================================
// APLICAR TEMAS DE EMPRESAS
// ================================================================

function aplicarTemaEmpresa(empresaId) {
    console.log(`🎨 Aplicando tema para empresa: ${empresaId}`);
    
    let empresa = null;
    if (window.grizalumCompanyManager && window.grizalumCompanyManager.companies) {
        empresa = window.grizalumCompanyManager.companies[empresaId];
    }
    
    if (!empresa || !empresa.theme) {
        console.warn('❌ No se encontró empresa o tema');
        mostrarNotificacion('No se pudo aplicar el tema de la empresa', 'warning');
        return;
    }
    
    const tema = empresa.theme;
    console.log(`🌈 Aplicando colores: ${tema.primary} -> ${tema.secondary}`);
    
    const temaAnterior = document.getElementById('grizalum-tema-dinamico');
    if (temaAnterior) {
        temaAnterior.remove();
    }
    
    const estilo = document.createElement('style');
    estilo.id = 'grizalum-tema-dinamico';
    estilo.textContent = generarCSSTema(tema);
    document.head.appendChild(estilo);
    
    console.log(`✅ Tema aplicado correctamente`);
    mostrarNotificacion(`Tema de ${empresa.name} aplicado`, 'success');
    
    document.dispatchEvent(new CustomEvent('grizalumTemaAplicado', {
        detail: { empresaId, empresa, tema, timestamp: Date.now() }
    }));
}

function generarCSSTema(tema) {
    return `
        /* === TEMA DINÁMICO GRIZALUM === */
        .notification-center:not(.custom-gold-button),
        .grizalum-notif-btn:not(.custom-gold-button) {
            background: linear-gradient(135deg, ${tema.primary} 0%, ${tema.secondary} 100%) !important;
            border: none !important;
            border-radius: 12px !important;
            width: 48px !important;
            height: 48px !important;
            color: white !important;
            font-size: 18px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease !important;
        }
        
        .sidebar {
            background: linear-gradient(180deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
            box-shadow: 4px 0 20px rgba(0,0,0,0.5) !important;
        }
        
        .executive-header {
            border-bottom: 2px solid ${tema.primary} !important;
        }
        
        .metric-card::before {
            background: linear-gradient(90deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
        }
        
        .metric-icon {
            background: linear-gradient(135deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
        }
        
        .period-btn.active {
            background: linear-gradient(135deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
            color: white !important;
        }
        
        .ai-header-button {
            background: linear-gradient(135deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
            color: white !important;
        }
        
        .chart-card {
            border-top: 3px solid ${tema.primary} !important;
        }
        
        .nav-link.active {
            background: rgba(255,255,255,0.15) !important;
            color: white !important;
        }
        
        .grizalum-notification.success {
            border-left: 4px solid ${tema.primary} !important;
        }
    `;
}

// ================================================================
// EVENTOS DE INTEGRACIÓN CON OTROS MÓDULOS
// ================================================================

document.addEventListener('grizalumCompanyChanged', function(evento) {
    const { companyId, company } = evento.detail;
    console.log(`🏢 Empresa cambiada en sistema principal: ${company.name}`);
    
    if (company.theme) {
        aplicarTemaEmpresa(companyId);
    }
    
    actualizarNotificacionesEmpresa();
});

document.addEventListener('grizalumPeriodoCambiado', function(evento) {
    console.log(`📅 Período cambiado en el sistema: ${evento.detail.periodo}`);
});

document.addEventListener('grizalumSeccionCambiada', function(evento) {
    console.log(`📱 Sección cambiada en el sistema: ${evento.detail.seccion}`);
});

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 DOM cargado - Iniciando GRIZALUM...');
    iniciarSistemaGrizalum();
});

// ================================================================
// API PÚBLICA - FUNCIONES DISPONIBLES GLOBALMENTE
// ================================================================

window.GRIZALUM = {
    version: '2.0.0',
    estaListo: () => sistemaListo,
    actualizarKPIs: actualizarKPIs,
    actualizarSidebar: actualizarSidebar,
    mostrarNotificacion: mostrarNotificacion,
    aplicarTema: aplicarTemaEmpresa,
    periodoActual: () => periodoActual,
    temaActual: () => temaActual
};

window.toggleSidebar = toggleSidebar;
window.showSection = showSection;
window.changePeriod = changePeriod;
window.showNotifications = showNotifications;
window.toggleAIAssistant = toggleAIAssistant;

console.log('✅ GRIZALUM - ARCHIVO PRINCIPAL CARGADO COMPLETAMENTE');
