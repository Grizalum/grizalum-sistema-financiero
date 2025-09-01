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
    mostrarNotificacion('🚀 Sistema GRIZALUM iniciado correctamente', 'success');
}

// ================================================================
// CONFIGURAR TODOS LOS EVENTOS DEL SISTEMA
// ================================================================
function configurarEventos() {
    console.log('🎯 Configurando eventos del sistema...');
    
    // Eventos para filtros de gráficos
    document.querySelectorAll('.filter-btn').forEach(boton => {
        boton.addEventListener('click', function() {
            // Quitar active de todos los botones
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            // Agregar active al botón clickeado
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

/**
 * Abrir/cerrar el menú lateral en móviles
 * Esta función se llama desde el HTML: onclick="toggleSidebar()"
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
        console.log('📱 Menú lateral toggled');
    } else {
        console.error('❌ No se encontró el sidebar');
    }
}

/**
 * Navegar entre secciones de la aplicación
 * Esta función se llama desde el HTML: onclick="showSection('dashboard')"
 */
function showSection(seccion) {
    console.log(`🧭 Navegando a sección: ${seccion}`);
    
    // Aquí puedes agregar lógica para mostrar/ocultar secciones
    // Por ahora solo mostramos una notificación
    
    // Actualizar enlaces activos
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Encontrar y activar el enlace correspondiente
    const enlaceActivo = document.querySelector(`[onclick="showSection('${seccion}')"]`);
    if (enlaceActivo) {
        enlaceActivo.classList.add('active');
    }
    
    // Disparar evento para otros módulos
    document.dispatchEvent(new CustomEvent('grizalumSeccionCambiada', {
        detail: { seccion: seccion, timestamp: Date.now() }
    }));
    
    // Mostrar notificación temporal
    mostrarNotificacion(`📱 Navegando a: ${seccion}`, 'info');
}

// ================================================================
// FUNCIONES DEL HEADER (BARRA SUPERIOR)
// ================================================================

/**
 * Cambiar período de tiempo (Hoy, Semana, Mes, etc.)
 * Esta función se llama desde el HTML: onclick="changePeriod('hoy', this)"
 */
function changePeriod(periodo, boton) {
    if (!boton) {
        console.error('❌ No se recibió el botón para changePeriod');
        return;
    }
    
    // Actualizar botones activos
    document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');
    
    // Guardar período actual
    periodoActual = periodo;
    
    console.log(`📅 Período cambiado a: ${periodo}`);
    
    // Disparar evento para que otros módulos se enteren
    document.dispatchEvent(new CustomEvent('grizalumPeriodoCambiado', {
        detail: { periodo: periodo, timestamp: Date.now() }
    }));
    
    // Mostrar notificación
    mostrarNotificacion(`📅 Período cambiado a: ${periodo}`, 'info');
}

/**
 * Mostrar centro de notificaciones
 * Esta función se llama desde el HTML: onclick="showNotifications()"
 */
function showNotifications() {
    console.log('🔔 Abriendo centro de notificaciones');
    mostrarNotificacionesAdmin();
}
// Actualizar contador al cambiar empresa
function actualizarNotificacionesEmpresa() {
    if (typeof actualizarContadorCampana === 'function') {
        actualizarContadorCampana();
    }
}

/**
 * Abrir/cerrar IA Assistant
 * Esta función se llama desde el HTML: onclick="toggleAIAssistant()"
 */
function toggleAIAssistant() {
    console.log('🤖 Abriendo IA Assistant');
    mostrarNotificacion('🤖 IA Assistant próximamente', 'info');
}

// ================================================================
// SISTEMA DE NOTIFICACIONES
// ================================================================

/**
 * Mostrar notificación en pantalla
 * @param {string} mensaje - El texto a mostrar
 * @param {string} tipo - 'success', 'error', 'warning', 'info'
 * @param {number} duracion - Tiempo en milisegundos (default: 5000)
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 5000) {
    // Crear la notificación
    const notificacion = document.createElement('div');
    notificacion.className = `grizalum-notification ${tipo}`;
    
    // Iconos para cada tipo de notificación
    const iconos = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle', 
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    // HTML de la notificación
    notificacion.innerHTML = `
        <div class="notification-content">
            <i class="${iconos[tipo] || iconos.info}"></i>
            <span>${mensaje}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Buscar o crear contenedor de notificaciones
    let contenedor = document.getElementById('notificationContainer');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'notificationContainer';
        contenedor.className = 'notification-container';
        document.body.appendChild(contenedor);
    }
    
    // Agregar notificación al contenedor
    contenedor.appendChild(notificacion);
    
    // Auto-remover después del tiempo especificado
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

/**
 * Actualizar los KPIs (números grandes) del dashboard
 * @param {Object} datos - Objeto con revenue, expenses, profit, growth
 */
function actualizarKPIs(datos) {
    if (!datos) {
        console.warn('⚠️ No se recibieron datos para actualizar KPIs');
        return;
    }
    
    try {
        // Elementos que vamos a actualizar
        const elementos = {
            revenueValue: datos.revenue,
            expensesValue: datos.expenses,
            profitValue: datos.profit,
            growthValue: datos.growth || '+24.8%'
        };
        
        // Actualizar cada elemento
        Object.entries(elementos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                if (typeof valor === 'number') {
                    elemento.textContent = `S/. ${valor.toLocaleString()}`;
                } else {
                    elemento.textContent = valor;
                }
                console.log(`📊 KPI actualizado: ${id} = ${valor}`);
            } else {
                console.warn(`⚠️ No se encontró elemento: ${id}`);
            }
        });
        
        console.log('✅ Todos los KPIs actualizados correctamente');
        
    } catch (error) {
        console.error('❌ Error actualizando KPIs:', error);
        mostrarNotificacion('❌ Error actualizando datos del dashboard', 'error');
    }
}

/**
 * Actualizar resumen financiero en el sidebar
 * @param {Object} datos - Objeto con cashFlow y profit
 */
function actualizarSidebar(datos) {
    if (!datos) return;
    
    try {
        const elementoCashFlow = document.getElementById('sidebarCashFlow');
        const elementoProfit = document.getElementById('sidebarProfit');
        
        if (elementoCashFlow && datos.cashFlow) {
            elementoCashFlow.textContent = `S/. ${datos.cashFlow.toLocaleString()}`;
        }
        
        if (elementoProfit && datos.profit) {
            elementoProfit.textContent = `S/. ${datos.profit.toLocaleString()}`;
        }
        
        console.log('💰 Sidebar financiero actualizado');
        
    } catch (error) {
        console.error('❌ Error actualizando sidebar:', error);
    }
}

// ================================================================
// APLICAR TEMAS DE EMPRESAS
// ================================================================

/**
 * Aplicar tema visual de una empresa
 * @param {string} empresaId - ID de la empresa
 */
function aplicarTemaEmpresa(empresaId) {
    console.log(`🎨 Aplicando tema para empresa: ${empresaId}`);
    
    // Obtener datos de la empresa desde company-manager
    let empresa = null;
    if (window.grizalumCompanyManager && window.grizalumCompanyManager.companies) {
        empresa = window.grizalumCompanyManager.companies[empresaId];
    }
    
    if (!empresa || !empresa.theme) {
        console.warn('❌ No se encontró empresa o tema');
        mostrarNotificacion('⚠️ No se pudo aplicar el tema de la empresa', 'warning');
        return;
    }
    
    const tema = empresa.theme;
    console.log(`🌈 Aplicando colores: ${tema.primary} -> ${tema.secondary}`);
    
    // Remover tema anterior si existe
    const temaAnterior = document.getElementById('grizalum-tema-dinamico');
    if (temaAnterior) {
        temaAnterior.remove();
    }
    
    // Crear nuevos estilos CSS
    const estilo = document.createElement('style');
    estilo.id = 'grizalum-tema-dinamico';
    estilo.textContent = generarCSSTema(tema);
    document.head.appendChild(estilo);
    
    console.log(`✅ Tema aplicado correctamente`);
    mostrarNotificacion(`🎨 Tema de ${empresa.name} aplicado`, 'success');
    
    // Disparar evento para otros módulos
    document.dispatchEvent(new CustomEvent('grizalumTemaAplicado', {
        detail: { empresaId, empresa, tema, timestamp: Date.now() }
    }));
}

/**
 * Generar CSS personalizado para el tema
 * @param {Object} tema - Objeto con primary y secondary colors
 * @returns {string} CSS generado
 */
function generarCSSTema(tema) {
    return `
        /* === TEMA DINÁMICO GRIZALUM === */
        /* BOTÓN NOTIFICACIONES CON TEMA */
.notification-center {
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

.notification-center:hover {
    background: linear-gradient(135deg, ${tema.secondary} 0%, ${tema.primary} 100%) !important;
    transform: translateY(-2px) scale(1.05) !important;
}

.notification-center i {
    color: white !important;
}
        
        /* Sidebar con colores de la empresa */
        .sidebar {
            background: linear-gradient(180deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
            box-shadow: 4px 0 20px rgba(0,0,0,0.5) !important;
        }
        
        /* Header con tema de empresa */
        .executive-header {
            border-bottom: 2px solid ${tema.primary} !important;
        }
        
        /* Tarjetas métricas con borde del tema */
        .metric-card::before {
            background: linear-gradient(90deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
        }
        
        /* Iconos con colores del tema */
        .metric-icon {
            background: linear-gradient(135deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
        }
        
        /* Botones activos con tema */
        .period-btn.active {
            background: linear-gradient(135deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
            color: white !important;
        }
        
        /* Botón IA con tema */
        .ai-header-button {
            background: linear-gradient(135deg, 
                ${tema.primary} 0%, 
                ${tema.secondary} 100%) !important;
            color: white !important;
        }
        
        /* Gráficos con borde del tema */
        .chart-card {
            border-top: 3px solid ${tema.primary} !important;
        }
        
        /* Navegación activa */
        .nav-link.active {
            background: rgba(255,255,255,0.15) !important;
            color: white !important;
        }
        
        /* Notificaciones con tema */
        .grizalum-notification.success {
            border-left: 4px solid ${tema.primary} !important;
        }
    `;
}

// ================================================================
// EVENTOS DE INTEGRACIÓN CON OTROS MÓDULOS
// ================================================================

// Escuchar cuando cambie la empresa desde company-manager
document.addEventListener('grizalumCompanyChanged', function(evento) {
    const { companyId, company } = evento.detail;
    console.log(`🏢 Empresa cambiada en sistema principal: ${company.name}`);
    
    // Actualizar datos en el dashboard
    actualizarKPIs(company.data);
    actualizarSidebar(company.data);
    
    // Aplicar tema si existe
    if (company.theme) {
        aplicarTemaEmpresa(companyId);
    }
});

// Actualizar contador de notificaciones
    actualizarNotificacionesEmpresa();

// Escuchar cambios de período
document.addEventListener('grizalumPeriodoCambiado', function(evento) {
    console.log(`📅 Período cambiado en el sistema: ${evento.detail.periodo}`);
    // Aquí otros módulos pueden reaccionar al cambio de período
});

// Escuchar cambios de sección
document.addEventListener('grizalumSeccionCambiada', function(evento) {
    console.log(`📱 Sección cambiada en el sistema: ${evento.detail.seccion}`);
    // Aquí otros módulos pueden reaccionar al cambio de sección
});

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================

// Cuando el DOM esté listo, iniciar todo el sistema
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 DOM cargado - Iniciando GRIZALUM...');
    iniciarSistemaGrizalum();
});

// ================================================================
// API PÚBLICA - FUNCIONES DISPONIBLES GLOBALMENTE
// ================================================================

// Crear objeto global GRIZALUM con funciones públicas
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

// ================================================================
// FUNCIONES GLOBALES PARA EL HTML
// Estas funciones se llaman directamente desde los onclick del HTML
// ================================================================

// Hacer funciones disponibles globalmente para el HTML
window.toggleSidebar = toggleSidebar;
window.showSection = showSection;
window.changePeriod = changePeriod;
window.showNotifications = showNotifications;
window.toggleAIAssistant = toggleAIAssistant;

console.log(`
🌟 ===================================================
   GRIZALUM - ARCHIVO PRINCIPAL CARGADO
🌟 ===================================================

✨ FUNCIONES DISPONIBLES:
   • toggleSidebar() - Abrir/cerrar menú lateral
   • showSection(seccion) - Navegar entre secciones
   • changePeriod(periodo, boton) - Cambiar período de tiempo
   • showNotifications() - Mostrar notificaciones
   • toggleAIAssistant() - Abrir IA Assistant
   • mostrarNotificacion(mensaje, tipo) - Mostrar alertas
   • actualizarKPIs(datos) - Actualizar números dashboard
   • aplicarTemaEmpresa(empresaId) - Cambiar tema visual

🔗 INTEGRACIÓN:
   • Se conecta automáticamente con company-manager.js
   • Escucha eventos de cambio de empresa
   • Maneja temas y colores dinámicos
   • Sistema de notificaciones integrado

🌟 ===================================================
`);
