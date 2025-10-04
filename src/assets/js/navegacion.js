/**
 * GRIZALUM - Sistema de Navegación v2.0
 */

console.log('Cargando sistema de navegación...');

function cambiarSeccion(seccionId, event) {
    console.log('cambiarSeccion llamada con:', seccionId);
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Mapeo de secciones
    const mapeo = {
        'dashboard': 'dashboardContent',
        'cash-flow': 'cash-flowContent',
        'income-statement': 'income-statementContent',
        'balance-sheet': 'balance-sheetContent',
        'cuentas-bancarias': 'cuentasBancariasContent',
        'inventory': 'inventoryContent',
        'sales': 'salesContent'
    };
    
    const contenedorId = mapeo[seccionId];
    
    if (!contenedorId) {
        console.error('ID de sección desconocido:', seccionId);
        return;
    }
    
    console.log('Buscando contenedor:', contenedorId);
    
    // Ocultar TODAS las secciones
    document.querySelectorAll('.dashboard-content').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });
    
    // Remover active de TODOS los links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const seccion = document.getElementById(contenedorId);
    
    if (seccion) {
        seccion.style.display = 'block';
        seccion.classList.add('active');
        console.log('Sección mostrada:', contenedorId);
    } else {
        console.error('No se encontró el contenedor:', contenedorId);
        return;
    }
    
    // Activar el link clickeado
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        // Buscar por data-section
        const link = document.querySelector(`[data-section="${seccionId}"]`);
        if (link) {
            link.classList.add('active');
        }
    }
    
    // Si es Cuentas Bancarias, cargar su UI
    if (seccionId === 'cuentas-bancarias') {
        console.log('Cargando Cuentas Bancarias...');
        if (window.mostrarSeccionCuentasBancarias) {
            setTimeout(() => window.mostrarSeccionCuentasBancarias(), 100);
        }
    }
}

// Hacer global
window.cambiarSeccion = cambiarSeccion;

console.log('Sistema de navegación cargado - cambiarSeccion disponible');
