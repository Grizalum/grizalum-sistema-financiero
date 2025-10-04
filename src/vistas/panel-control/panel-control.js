/**
 * PANEL DE CONTROL - LÓGICA DE VISTA
 * Maneja la inicialización y actualización del panel principal
 */

function inicializar_dashboard() {
    console.log('📊 Inicializando Panel de Control...');
    
    // Conectar con sistema de métricas
    if (window.actualizarInterfazCompleta) {
        setTimeout(() => {
            window.actualizarInterfazCompleta();
            console.log('✅ Métricas actualizadas');
        }, 100);
    }
    
    // Conectar con sistema de gráficos
    if (window.inicializarGraficos) {
        setTimeout(() => {
            window.inicializarGraficos();
            console.log('✅ Gráficos inicializados');
        }, 200);
    }
    
    // Actualizar título de página
    const titulo = document.getElementById('pageTitle');
    const subtitulo = document.getElementById('pageSubtitle');
    
    if (titulo) titulo.textContent = 'Panel de Control Ejecutivo';
    if (subtitulo) subtitulo.textContent = 'Resumen financiero en tiempo real';
    
    console.log('✅ Panel de Control cargado');
}

// Función para actualizar métricas del panel
function actualizarMetricasPanel(datos) {
    if (!datos) {
        console.warn('No hay datos para actualizar panel');
        return;
    }
    
    // Actualizar valores
    const elementos = {
        revenueValue: datos.ingresos || 0,
        expensesValue: datos.gastos || 0,
        profitValue: datos.utilidad || 0,
        growthValue: datos.crecimiento || 0
    };
    
    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'growthValue') {
                elemento.textContent = `+${valor}%`;
            } else {
                elemento.textContent = `S/. ${valor.toLocaleString()}`;
            }
        }
    });
    
    console.log('📊 Métricas del panel actualizadas');
}

// Exponer funciones globalmente
window.inicializar_dashboard = inicializar_dashboard;
window.actualizarMetricasPanel = actualizarMetricasPanel;

console.log('✅ panel-control.js cargado');
