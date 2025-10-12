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
        console.log(`\n═══════════════════════════════════════`);
        console.log(`📂 Cargando vista: ${vistaId}`);
        console.log(`═══════════════════════════════════════`);
        
        // Limpiar CSS residuales de flujo-caja
        document.querySelectorAll('link[href*="flujo-caja.css"]').forEach(el => {
            console.log('🗑️ Eliminando link residual:', el.href);
            el.remove();
        });
        
        // Buscar contenedor
        this.contenedor = document.getElementById('contenedorVistas');
        if (!this.contenedor) {
            console.error('❌ No se encontró contenedor de vistas');
            return false;
        }

        // Obtener ruta
        const ruta = this.vistas[vistaId];
        if (!ruta) {
            console.error(`❌ Vista no encontrada: ${vistaId}`);
            return false;
        }

        // Ocultar contenedor mientras carga
        this.contenedor.style.opacity = '0';
        this.contenedor.style.transition = 'opacity 0.3s ease';

        try {
            // ═══════════════════════════════════════════════════════
            // PASO 1: CARGAR CSS PRIMERO (SIEMPRE)
            // ═══════════════════════════════════════════════════════
            console.log('🎨 [PASO 1/5] Cargando CSS...');
            await this.cargarCSS(vistaId);
            await new Promise(resolve => setTimeout(resolve, 250));
            console.log('✅ CSS cargado y aplicado\n');

            // ═══════════════════════════════════════════════════════
            // PASO 2: SCRIPTS ESPECIALES (SOLO PARA CASH-FLOW)
            // ═══════════════════════════════════════════════════════
            if (vistaId === 'cash-flow') {
                console.log('📦 [PASO 2/5] Pre-cargando scripts de Flujo de Caja...');
                
                await this.cargarScriptEspecial('src/vistas/flujo-caja/flujo-caja-config.js');
                await new Promise(resolve => setTimeout(resolve, 150));
                
                await this.cargarScriptEspecial('src/vistas/flujo-caja/flujo-caja.js');
                await new Promise(resolve => setTimeout(resolve, 150));
                
                await this.cargarScriptEspecial('src/vistas/flujo-caja/flujo-caja-ui.js');
                await new Promise(resolve => setTimeout(resolve, 150));
                
                console.log('✅ Scripts pre-cargados\n');
            }

            // ═══════════════════════════════════════════════════════
            // PASO 3: CARGAR HTML
            // ═══════════════════════════════════════════════════════
            console.log('📄 [PASO 3/5] Cargando HTML...');
            const response = await fetch(ruta);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const html = await response.text();
            this.contenedor.innerHTML = html;
            this.vistaActual = vistaId;
            console.log('✅ HTML inyectado\n');

            // ═══════════════════════════════════════════════════════
            // PASO 4: CARGAR JS NORMAL (OTRAS VISTAS)
            // ═══════════════════════════════════════════════════════
            if (vistaId !== 'cash-flow') {
                console.log('📜 [PASO 4/5] Cargando JavaScript...');
                await this.cargarJS(vistaId);
                console.log('✅ JavaScript cargado\n');
            }

            // ═══════════════════════════════════════════════════════
            // PASO 5: MOSTRAR CON FADE-IN
            // ═══════════════════════════════════════════════════════
            console.log('✨ [PASO 5/5] Mostrando vista...');
            await new Promise(resolve => setTimeout(resolve, 200));
            this.contenedor.style.opacity = '1';
            
            console.log(`═══════════════════════════════════════`);
            console.log(`✅ Vista ${vistaId} cargada exitosamente`);
            console.log(`═══════════════════════════════════════\n`);
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
        
        console.log(`   🎨 Ruta CSS: ${rutaCSS}`);
        
        // Eliminar TODOS los CSS anteriores
        document.querySelectorAll('link[id="vista-css-dinamico"]').forEach(el => {
            console.log('   🗑️ Eliminando link anterior');
            el.remove();
        });
        
        document.querySelectorAll('style[id="vista-css-dinamico"]').forEach(el => {
            console.log('   🗑️ Eliminando style anterior');
            el.remove();
        });
        
        try {
            // Cargar CSS con fetch
            const response = await fetch(rutaCSS);
            
            if (response.ok) {
                const cssText = await response.text();
                
                // Crear style tag
                const style = document.createElement('style');
                style.id = 'vista-css-dinamico';
                style.textContent = cssText;
                document.head.appendChild(style);
                
                const numReglas = style.sheet?.cssRules?.length || 0;
                console.log(`   ✅ ${cssText.length} caracteres, ${numReglas} reglas CSS`);
                
                // Esperar a que se aplique
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } else {
                console.warn(`   ⚠️ CSS no encontrado (${response.status})`);
            }
            
        } catch (error) {
            console.error(`   ❌ Error cargando CSS:`, error);
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
                
                console.log(`   ✅ JS ejecutado: ${rutaJS}`);
            }
        } catch (error) {
            console.warn(`   ⚠️ Sin JS específico para ${vistaId}`);
        }
    }

    async cargarScriptEspecial(src) {
        return new Promise((resolve, reject) => {
            // Verificar si ya existe
            const existente = document.querySelector(`script[src="${src}"]`);
            if (existente) {
                console.log(`   ℹ️ Script ya cargado: ${src.split('/').pop()}`);
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            
            script.onload = () => {
                console.log(`   ✅ ${src.split('/').pop()}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`   ❌ Error: ${src.split('/').pop()}`);
                reject(new Error(`No se pudo cargar ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }
}

// Instancia global
window.cargadorVistas = new CargadorVistas();

// Función de navegación
async function cambiarSeccion(seccionId, event) {
    if (event) {
        event.preventDefault();
    }
    
    // Remover active de todos los links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Activar link actual
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // Cargar vista
    await window.cargadorVistas.cargarVista(seccionId);
}

// Sobrescribir función global
window.cambiarSeccion = cambiarSeccion;

// Cargar vista inicial
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.cargadorVistas.cargarVista('dashboard');
    }, 500);
});

console.log('✅ Sistema de cargador de vistas listo');
