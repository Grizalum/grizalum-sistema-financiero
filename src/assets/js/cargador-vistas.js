/**
 * GRIZALUM - CARGADOR DE VISTAS
 * Sistema modular para cargar vistas dinámicamente
 */

class CargadorVistas {
    constructor() {
        this.vistas = {
            'dashboard': 'src/vistas/panel-control/panel-control.html',
            'cuentas-bancarias': 'src/vistas/cuentas-bancarias/cuentas-bancarias.html',
            'cash-flow': 'src/vistas/flujo-caja/flujo-caja.html',
            'income-statement': 'src/vistas/estado-resultados/estado-resultados.html',
            'balance-sheet': 'src/vistas/balance-general/balance-general.html',
            'inventory': 'src/vistas/inventario/inventario.html',
            'sales': 'src/vistas/ventas/ventas.html'
        };
        
        this.vistaActual = null;
        this.contenedor = null;
        console.log('Cargador de vistas inicializado');
    }

    async cargarVista(vistaId) {
        console.log(`Cargando vista: ${vistaId}`);
        
        // Buscar contenedor
        this.contenedor = document.getElementById('contenedorVistas');
        if (!this.contenedor) {
            console.error('No se encontró contenedor de vistas');
            return false;
        }

        // Obtener ruta
        const ruta = this.vistas[vistaId];
        if (!ruta) {
            console.error(`Vista no encontrada: ${vistaId}`);
            return false;
        }

        try {
            // Cargar HTML
            const response = await fetch(ruta);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Inyectar en contenedor
            this.contenedor.innerHTML = html;
            this.vistaActual = vistaId;
            
            // Cargar CSS si existe
            await this.cargarCSS(vistaId);
            
            // Cargar JS si existe
            await this.cargarJS(vistaId);
            
            console.log(`Vista ${vistaId} cargada exitosamente`);
            return true;
            
        } catch (error) {
            console.error(`Error cargando vista ${vistaId}:`, error);
            this.contenedor.innerHTML = `
                <div style="padding: 60px; text-align: center; color: #e74c3c;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <h2>Error al cargar la vista</h2>
                    <p>${error.message}</p>
                </div>
            `;
            return false;
        }
    }

    async cargarCSS(vistaId) {
        const carpeta = this.vistas[vistaId].replace('.html', '');
        const rutaCSS = carpeta + '.css';
        
        // Eliminar CSS anterior si existe
        const cssAnterior = document.getElementById('vista-css-dinamico');
        if (cssAnterior) {
            cssAnterior.remove();
        }
        
        // Crear nuevo link CSS
        const link = document.createElement('link');
        link.id = 'vista-css-dinamico';
        link.rel = 'stylesheet';
        link.href = rutaCSS;
        document.head.appendChild(link);
        
        console.log(`CSS cargado: ${rutaCSS}`);
    }

    async cargarJS(vistaId) {
        const carpeta = this.vistas[vistaId].replace('.html', '');
        const rutaJS = carpeta + '.js';
        
        try {
            const response = await fetch(rutaJS);
            if (response.ok) {
                const script = await response.text();
                eval(script);
                
                // Ejecutar inicializador si existe
                const inicializador = `inicializar_${vistaId.replace(/-/g, '_')}`;
                if (window[inicializador]) {
                    window[inicializador]();
                }
                
                console.log(`JS cargado y ejecutado: ${rutaJS}`);
            }
        } catch (error) {
            console.warn(`No se pudo cargar JS para ${vistaId}:`, error);
        }
    }
}

// Instancia global
window.cargadorVistas = new CargadorVistas();

// Función de navegación actualizada
async function cambiarSeccion(seccionId, event) {
    if (event) {
        event.preventDefault();
    }
    
    console.log(`Cambiando a sección: ${seccionId}`);
    
    // Remover active de todos los links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Activar link actual
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // Cargar vista
    const cargado = await window.cargadorVistas.cargarVista(seccionId);
    
    if (cargado) {
        console.log(`Sección ${seccionId} cargada correctamente`);
    }
}

// Sobrescribir función global
window.cambiarSeccion = cambiarSeccion;

// Cargar vista inicial (dashboard) cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.cargadorVistas.cargarVista('dashboard');
        console.log('Vista inicial (dashboard) cargada');
    }, 500);
});

console.log('Sistema de cargador de vistas listo');
