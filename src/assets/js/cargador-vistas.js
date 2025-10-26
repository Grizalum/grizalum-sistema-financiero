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
    console.log(`🔄 Cargando vista: ${vistaId}`);
    
    // Buscar contenedor
    this.contenedor = document.getElementById('contenedorVistas');
    if (!this.contenedor) {
        console.error('❌ No se encontró contenedor');
        return false;
    }

    // Obtener ruta
    const ruta = this.vistas[vistaId];
    if (!ruta) {
        console.error(`❌ Vista no encontrada: ${vistaId}`);
        return false;
    }

    try {
        // ═══════════════════════════════════════════════════════
        // ESTRATEGIA: Cargar TODO antes de mostrar
        // Sin visibility hidden, sin delays artificiales
        // ═══════════════════════════════════════════════════════
        
        // Limpiar vista anterior
        this.contenedor.innerHTML = '';
        this.contenedor.style.opacity = '0';
        
        // ═══ PASO 1: CSS PRIMERO ═══
        await this.cargarCSS(vistaId);
        
        // Esperar a que CSS se aplique
        await new Promise(resolve => setTimeout(resolve, 100));
        

        // ═══ PASO 3: HTML ═══
        const response = await fetch(ruta);
if (!response.ok) throw new Error(`HTTP ${response.status}`);

const html = await response.text();

// Crear un div temporal para parsear el HTML
const temp = document.createElement('div');
temp.innerHTML = html;

// Extraer los scripts
const scripts = temp.querySelectorAll('script');
const scriptsArray = Array.from(scripts);

// Remover scripts del HTML temporalmente
scriptsArray.forEach(s => s.remove());

// Insertar el HTML sin scripts
this.contenedor.innerHTML = temp.innerHTML;
this.vistaActual = vistaId;

// ✅ CARGAR SCRIPTS MANUALMENTE (para que se ejecuten)
for (const scriptOriginal of scriptsArray) {
    const script = document.createElement('script');
    
    if (scriptOriginal.src) {
        // Script externo
        script.src = scriptOriginal.src;
        script.async = false;
    } else {
        // Script inline
        script.textContent = scriptOriginal.textContent;
    }
    
    document.body.appendChild(script);
    
    // Esperar a que cargue si es externo
    if (scriptOriginal.src) {
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
        });
    }
}

        // ═══ PASO 4: JS NORMAL (otras vistas) ═══
// No cargar JS adicional si la vista ya tiene scripts en el HTML
const vistasConScripts = ['cash-flow', 'income-statement'];
if (!vistasConScripts.includes(vistaId)) {
    await this.cargarJS(vistaId);
}

        // ═══ PASO 5: FORZAR APLICACIÓN DE ESTILOS ═══
        // Esperar 2 frames del navegador para que aplique CSS
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });
        
       // ═══ PASO 6: FADE IN SUAVE ═══
        this.contenedor.style.transition = 'opacity 0.2s ease';
        this.contenedor.style.opacity = '1';
        
        // ═══ PASO 7: DISPARAR EVENTO DE VISTA CARGADA ═══
        setTimeout(() => {
            // Evento genérico
            window.dispatchEvent(new CustomEvent('vistaLista', { 
                detail: { vistaId: vistaId } 
            }));
            
            // Evento específico para flujo de caja
            if (vistaId === 'cash-flow') {
                window.dispatchEvent(new Event('flujoCajaVisible'));
                console.log('   📢 Evento flujoCajaVisible disparado');
            }
        }, 350); // Esperar a que termine la animación
        
       console.log(`✅ Vista ${vistaId} lista`);
        
        // FORZAR RECARGA PARA FLUJO DE CAJA
        if (vistaId === 'cash-flow') {
            setTimeout(() => {
                if (window.recargarFlujoCaja) {
                    window.recargarFlujoCaja();
                    console.log('🔄 Flujo de caja recargado automáticamente');
                }
            }, 500);
        }
        
        return true;
        
    } catch (error) {
        console.error(`❌ Error cargando vista:`, error);
        this.contenedor.innerHTML = `
            <div style="padding: 60px; text-align: center; color: var(--color-error);">
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
// ═══════════════════════════════════════════════════════════════
// FUNCIÓN GLOBAL DE RECARGA - FLUJO DE CAJA
// ═══════════════════════════════════════════════════════════════

window.recargarFlujoCaja = function() {
    console.log('🔄 [recargarFlujoCaja] Ejecutando desde cargador...');
    
    if (!window.flujoCajaUI) {
        console.error('❌ flujoCajaUI no disponible');
        return;
    }
    
    if (!window.flujoCajaUI.modulo) {
        console.error('❌ Módulo no conectado');
        return;
    }
    
    try {
        console.log('📊 Cargando balance...');
        window.flujoCajaUI.cargarBalance();
        
        console.log('📋 Cargando transacciones...');
        window.flujoCajaUI.cargarTransacciones();
        
        console.log('✅ Recarga completada');
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

console.log('✅ recargarFlujoCaja registrada desde cargador-vistas');

// ═══════════════════════════════════════════════════════════════
// FORZAR RECARGA EN DESARROLLO (quitar en producción)
// ═══════════════════════════════════════════════════════════════
if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) {
    console.log('🔄 Modo desarrollo: forzando recarga sin caché');
    
    // Sobrescribir cargarScriptEspecial para agregar timestamp
    const originalCargar = CargadorVistas.prototype.cargarScriptEspecial;
    CargadorVistas.prototype.cargarScriptEspecial = async function(src) {
        const timestamp = Date.now();
        const srcConTimestamp = src + '?t=' + timestamp;
        return originalCargar.call(this, srcConTimestamp);
    };
}
