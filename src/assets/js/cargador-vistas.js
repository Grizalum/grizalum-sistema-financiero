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
    
    // Limpiar CSS residuales
    document.querySelectorAll('link[href*="flujo-caja.css"]').forEach(el => {
        console.log('🗑️ Eliminando link residual al inicio:', el.href);
        el.remove();
    });
    
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

    // OCULTAR CONTENEDOR
    this.contenedor.style.opacity = '0';
    this.contenedor.style.transition = 'opacity 0.3s ease';

    try {
        // ⬇️⬇️⬇️ PASO 1: CARGAR CSS PRIMERO ⬇️⬇️⬇️
        console.log('🎨 Paso 1: Cargando CSS...');
        await this.cargarCSS(vistaId);
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('✅ CSS aplicado');
        // ⬆️⬆️⬆️

        // ⬇️⬇️⬇️ PASO 2: SCRIPTS (SOLO CASH-FLOW) ⬇️⬇️⬇️
        if (vistaId === 'cash-flow') {
            console.log('📦 Paso 2: Pre-cargando scripts de Flujo de Caja...');
            
            await this.cargarScriptEspecial('src/vistas/flujo-caja/flujo-caja-config.js');
            await new Promise(resolve => setTimeout(resolve, 100));
            
            await this.cargarScriptEspecial('src/vistas/flujo-caja/flujo-caja.js');
            await new Promise(resolve => setTimeout(resolve, 100));
            
            await this.cargarScriptEspecial('src/vistas/flujo-caja/flujo-caja-ui.js');
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log('✅ Scripts cargados');
        }
        // ⬆️⬆️⬆️

        // ⬇️⬇️⬇️ PASO 3: CARGAR HTML ⬇️⬇️⬇️
        console.log('📄 Paso 3: Cargando HTML...');
        const response = await fetch(ruta);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const html = await response.text();
        this.contenedor.innerHTML = html;
        this.vistaActual = vistaId;
        console.log('✅ HTML inyectado');
        // ⬆️⬆️⬆️

        // ⬇️⬇️⬇️ PASO 4: JS NORMAL ⬇️⬇️⬇️
        if (vistaId !== 'cash-flow') {
            await this.cargarJS(vistaId);
        }
        // ⬆️⬆️⬆️

        // ⬇️⬇️⬇️ PASO 5: MOSTRAR ⬇️⬇️⬇️
        console.log('✨ Paso 5: Mostrando vista...');
        await new Promise(resolve => setTimeout(resolve, 150));
        this.contenedor.style.opacity = '1';
        // ⬆️⬆️⬆️
        
        console.log(`✅ Vista ${vistaId} cargada exitosamente`);
        return true;
        
    } catch (error) {
        console.error(`❌ Error cargando vista ${vistaId}:`, error);
        this.contenedor.innerHTML = `
            <div style="padding: 60px; text-align: center; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h2>Error al cargar la vista</h2>
                <p>${error.message}</p>
            </div>
        `;
        this.contenedor.style.opacity = '1';
        return false;
    }
}
   async cargarCSS(vistaId) {
    const carpeta = this.vistas[vistaId].replace('.html', '');
    const rutaCSS = carpeta + '.css';
    
    console.log(`🎨 Cargando CSS para: ${vistaId}`);
    
    // ⬇️⬇️⬇️ ELIMINAR TODOS LOS CSS ANTERIORES ⬇️⬇️⬇️
    // Eliminar links viejos
    document.querySelectorAll('link[id="vista-css-dinamico"]').forEach(el => {
        console.log('🗑️ Eliminando link:', el.href);
        el.remove();
    });
    
    // Eliminar style tags viejos
    document.querySelectorAll('style[id="vista-css-dinamico"]').forEach(el => {
        console.log('🗑️ Eliminando style tag');
        el.remove();
    });
    
    // Eliminar cualquier link de flujo-caja residual
    document.querySelectorAll('link[href*="flujo-caja.css"]').forEach(el => {
        console.log('🗑️ Eliminando link residual de flujo-caja');
        el.remove();
    });
    // ⬆️⬆️⬆️
    
    try {
        // MÉTODO DEFINITIVO: Fetch + Style tag
        const response = await fetch(rutaCSS);
        
        if (response.ok) {
            const cssText = await response.text();
            
            // Crear style tag con el CSS
            const style = document.createElement('style');
            style.id = 'vista-css-dinamico';
            style.textContent = cssText;
            document.head.appendChild(style);
            
            const numReglas = style.sheet?.cssRules?.length || 0;
            console.log(`✅ CSS aplicado: ${cssText.length} caracteres, ${numReglas} reglas CSS`);
            
            // Esperar a que el navegador aplique los estilos
            await new Promise(resolve => setTimeout(resolve, 50));
            
        } else {
            console.warn(`⚠️ CSS no encontrado: ${rutaCSS} (${response.status})`);
        }
        
    } catch (error) {
        console.error(`❌ Error cargando CSS ${rutaCSS}:`, error);
    }
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

    // ⬇️⬇️⬇️ FUNCIÓN NUEVA PARA CARGAR SCRIPTS ESPECIALES ⬇️⬇️⬇️
    async cargarScriptEspecial(src) {
        return new Promise((resolve, reject) => {
            // Verificar si ya existe
            const existente = document.querySelector(`script[src="${src}"]`);
            if (existente) {
                console.log(`Script ya existe: ${src}`);
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            
            script.onload = () => {
                console.log(`✅ Script cargado: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ Error cargando: ${src}`);
                reject(new Error(`No se pudo cargar ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }
    // ⬆️⬆️⬆️ FIN FUNCIÓN NUEVA ⬆️⬆️⬆️
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

