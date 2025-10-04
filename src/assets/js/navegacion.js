/**
 * GRIZALUM - Sistema de Navegación
 */

function cambiarSeccion(seccionId, event) {
    if (event) {
        event.preventDefault();
    }
    
    console.log('Cambiando a sección:', seccionId);
    
    // Ocultar todas las secciones
    document.querySelectorAll('.dashboard-content').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('active');
    });
    
    // Remover active de todos los links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mapeo de IDs
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
    const seccion = document.getElementById(contenedorId);
    
    if (seccion) {
        seccion.style.display = 'block';
        seccion.classList.add('active');
        console.log('✅ Sección mostrada:', contenedorId);
    } else {
        console.error('❌ No se encontró:', contenedorId);
    }
    
    // Activar link
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // Si es Cuentas Bancarias
    if (seccionId === 'cuentas-bancarias' && window.mostrarSeccionCuentasBancarias) {
        window.mostrarSeccionCuentasBancarias();
    }
}

window.cambiarSeccion = cambiarSeccion;
console.log('✅ Sistema de navegación cargado');
