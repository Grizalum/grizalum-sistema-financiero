/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - CARGADOR DE VISTAS v2.0 (MEJORADO)
 * Usa el Sistema de Módulos para gestionar el ciclo de vida
 * ═══════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════
// PASO 1: REGISTRAR TODOS LOS MÓDULOS
// ═══════════════════════════════════════════════════════════════════

function registrarModulos() {
    console.log('📦 Registrando módulos...');

    // ───────────────────────────────────────────────────────────────
    // PANEL DE CONTROL (DASHBOARD)
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'dashboard',
        nombre: 'Panel de Control',
        ruta: 'src/vistas/panel-control/panel-control.html',
        nivel: 0, // Siempre disponible

        onCargar: async function() {
            // Cargar CSS
            await cargarEstilos('src/vistas/panel-control/panel-control.css');
            
            // Cargar dependencias
            await cargarScript('src/vistas/panel-control/panel-control.js');
        },

        onMostrar: async function() {
            // Cargar HTML
            const html = await fetch('src/vistas/panel-control/panel-control.html').then(r => r.text());
            document.getElementById('contenedorVistas').innerHTML = html;
            
            // Inicializar módulo
            if (window.inicializarPanelControl) {
                window.inicializarPanelControl();
            }
        },

        onOcultar: function() {
            // Limpiar si es necesario
        }
    });

    // ───────────────────────────────────────────────────────────────
    // FLUJO DE CAJA
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'cash-flow',
        nombre: 'Flujo de Caja',
        ruta: 'src/vistas/flujo-caja/flujo-caja.html',
        nivel: 0, // Disponible desde INDIVIDUAL

        dependencias: [
            'src/vistas/flujo-caja/flujo-caja-categorias.js',
            'src/vistas/flujo-caja/flujo-caja-config.js'
        ],

        onCargar: async function() {
            console.log('   💰 Cargando Flujo de Caja...');
            
            // Cargar CSS
            await cargarEstilos('src/vistas/flujo-caja/flujo-caja.css');
            
            // ⚠️ IMPORTANTE: NO cargar flujo-caja.js aquí
            // porque ya está en el HTML como script inline
        },

onMostrar: async function() {
            console.log('   👁️ Mostrando Flujo de Caja...');
            
            const contenedor = document.getElementById('contenedorVistas');
            
            contenedor.style.opacity = '1';
            contenedor.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; 
                            min-height: 400px;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; animation: spin 1s linear infinite;">⚙️</div>
                        <p style="color: var(--texto-terciario); margin-top: 1rem;">
                            Cargando Flujo de Caja...
                        </p>
                    </div>
                </div>
                <style>
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
            `;
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const html = await fetch('src/vistas/flujo-caja/flujo-caja.html').then(r => r.text());
            
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const scripts = temp.querySelectorAll('script');
            const scriptsArray = Array.from(scripts);
            scriptsArray.forEach(s => s.remove());
            
            contenedor.innerHTML = temp.innerHTML;
            
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setTimeout(resolve, 100);
                    });
                });
            });
            
            // Ejecutar scripts
for (const scriptOriginal of scriptsArray) {
    // Si es un script externo, verificar si ya existe
    if (scriptOriginal.src) {
        const srcSinQuery = scriptOriginal.src.split('?')[0];
        const yaExiste = Array.from(document.querySelectorAll('script[src]')).some(s => 
            s.src.split('?')[0] === srcSinQuery
        );
        
        if (yaExiste) {
            console.log(`⏭️ Script ya cargado: ${scriptOriginal.src}`);
            continue; // Saltar este script
        }
        
        const script = document.createElement('script');
        script.src = scriptOriginal.src;
        script.async = false;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
        });
    } else {
        // Scripts inline siempre se ejecutan
        const script = document.createElement('script');
        script.textContent = scriptOriginal.textContent;
        document.body.appendChild(script);
    }
}
            
            contenedor.style.opacity = '1';
            contenedor.style.display = 'block';
            
            if (window.flujoCaja) {
                await window.flujoCaja.esperarInicializacion();
            }
            
            setTimeout(() => {
                window.dispatchEvent(new Event('flujoCajaVisible'));
                
                console.log('🔄 Forzando recarga de datos...');
                
                let intentos = 0;
                const forzarRecarga = setInterval(() => {
                    intentos++;
                    
                    if (window.flujoCajaUI && window.flujoCajaUI.modulo) {
                        console.log('✅ Recargando datos (intento ' + intentos + ')');
                        window.flujoCajaUI.cargarBalance();
                        window.flujoCajaUI.cargarTransacciones();
                        window.flujoCajaUI.cargarNivel();
                        clearInterval(forzarRecarga);
                    } else if (intentos > 10) {
                        console.error('❌ No se pudo recargar datos después de 10 intentos');
                        clearInterval(forzarRecarga);
                    }
                }, 200);
                
            }, 300);
        
            // ✅ SCROLL SUAVE AL INICIO
            setTimeout(() => {
                const contenedor = document.getElementById('contenedorVistas');
                if (contenedor) {
                    contenedor.scrollTo({ top: 0, behavior: 'smooth' });
                    console.log('✅ Scroll al inicio');
                }
            }, 400);
        },
        onOcultar: function() {
            console.log('   👁️‍🗨️ Ocultando Flujo de Caja');
            
            // Limpiar listeners si es necesario
        },

        onDestruir: function() {
            console.log('   🗑️ Destruyendo Flujo de Caja');
            
            // Limpiar instancias si es necesario
            // (pero NO destruir window.flujoCaja, solo limpiarlo)
        }
    });

    // ───────────────────────────────────────────────────────────────
    // ESTADO DE RESULTADOS
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'income-statement',
        nombre: 'Estado de Resultados',
        ruta: 'src/vistas/estado-resultados/estado-resultados.html',
        nivel: 25, // Requiere PROFESIONAL

        dependencias: [
            'src/vistas/estado-resultados/estado-resultados-config.js',
            'src/vistas/estado-resultados/estado-resultados-exportador.js',
            'src/vistas/estado-resultados/estado-resultados-graficos.js'
        ],

        onCargar: async function() {
            console.log('   📊 Cargando Estado de Resultados...');
            await cargarEstilos('src/vistas/estado-resultados/estado-resultados.css');
        },

        onMostrar: async function() {
            console.log('   👁️ Mostrando Estado de Resultados...');
            
            const contenedor = document.getElementById('contenedorVistas');
            
            // Loading inicial
            contenedor.style.opacity = '1';
            contenedor.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; 
                            min-height: 400px;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; animation: spin 1s linear infinite;">📊</div>
                        <p style="color: var(--texto-terciario); margin-top: 1rem;">
                            Cargando Estado de Resultados...
                        </p>
                    </div>
                </div>
                <style>
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
            `;
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Cargar HTML
            const html = await fetch('src/vistas/estado-resultados/estado-resultados.html').then(r => r.text());
            
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const scripts = temp.querySelectorAll('script');
            const scriptsArray = Array.from(scripts);
            scriptsArray.forEach(s => s.remove());
            
            contenedor.innerHTML = temp.innerHTML;
            
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setTimeout(resolve, 100);
                    });
                });
            });
            
            // Ejecutar scripts (evitar duplicados)
            for (const scriptOriginal of scriptsArray) {
                if (scriptOriginal.src) {
                    const srcSinQuery = scriptOriginal.src.split('?')[0];
                    const yaExiste = Array.from(document.querySelectorAll('script[src]')).some(s => 
                        s.src.split('?')[0] === srcSinQuery
                    );
                    
                    if (yaExiste) {
                        console.log(`⏭️ Script ya cargado: ${scriptOriginal.src}`);
                        continue;
                    }
                    
                    const script = document.createElement('script');
                    script.src = scriptOriginal.src;
                    script.async = false;
                    document.body.appendChild(script);
                    
                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                    });
                } else {
                    const script = document.createElement('script');
                    script.textContent = scriptOriginal.textContent;
                    document.body.appendChild(script);
                }
            }
            
            contenedor.style.opacity = '1';
            contenedor.style.display = 'block';
            
            // Disparar evento y scroll
            setTimeout(() => {
                window.dispatchEvent(new Event('vistaEstadoResultadosCargada'));
                
                // Scroll al inicio
                setTimeout(() => {
                    const contenedor = document.getElementById('contenedorVistas');
                    if (contenedor) {
                        contenedor.scrollTo({ top: 0, behavior: 'instant' });
                        console.log('✅ Estado de Resultados: Scroll al inicio');
                    }
                }, 100);
            }, 350);
        });

    // ───────────────────────────────────────────────────────────────
    // BALANCE GENERAL
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'balance-sheet',
        nombre: 'Balance General',    
        ruta: 'src/vistas/balance-general/balance-general.html',
        nivel: 25, // Requiere PROFESIONAL

        onCargar: async function() {
            await cargarEstilos('src/vistas/balance-general/balance-general.css');
            await cargarScript('src/vistas/balance-general/balance-general.js');
        },

        onMostrar: async function() {
            const html = await fetch('src/vistas/balance-general/balance-general.html').then(r => r.text());
            document.getElementById('contenedorVistas').innerHTML = html;
            
            if (window.inicializarBalanceGeneral) {
                window.inicializarBalanceGeneral();
            }
        }
    });

    // ───────────────────────────────────────────────────────────────
    // CUENTAS BANCARIAS
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'cuentas-bancarias',
        nombre: 'Cuentas Bancarias',
        ruta: 'src/vistas/cuentas-bancarias/cuentas-bancarias.html',
        nivel: 0, // Disponible desde INDIVIDUAL

        dependencias: [
            'src/assets/js/gestor-cuentas-bancarias.js',
            'src/assets/js/ui-cuentas-bancarias.js'
        ],

        onCargar: async function() {
            await cargarEstilos('src/vistas/cuentas-bancarias/cuentas-bancarias.css');
        },

        onMostrar: async function() {
            const html = await fetch('src/vistas/cuentas-bancarias/cuentas-bancarias.html').then(r => r.text());
            document.getElementById('contenedorVistas').innerHTML = html;
            
            setTimeout(() => {
                if (window.mostrarSeccionCuentasBancarias) {
                    window.mostrarSeccionCuentasBancarias();
                }
            }, 100);
        }
    });

    // ───────────────────────────────────────────────────────────────
    // INVENTARIO
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'inventory',
        nombre: 'Inventario',
        ruta: 'src/vistas/inventario/inventario.html',
        nivel: 50, // Requiere EMPRESARIAL

        onCargar: async function() {
            await cargarEstilos('src/vistas/inventario/inventario.css');
            await cargarScript('src/vistas/inventario/inventario.js');
        },

        onMostrar: async function() {
            const html = await fetch('src/vistas/inventario/inventario.html').then(r => r.text());
            document.getElementById('contenedorVistas').innerHTML = html;
            
            if (window.inicializarInventario) {
                window.inicializarInventario();
            }
        }
    });

    // ───────────────────────────────────────────────────────────────
    // VENTAS
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'sales',
        nombre: 'Ventas',
        ruta: 'src/vistas/ventas/ventas.html',
        nivel: 50, // Requiere EMPRESARIAL

        onCargar: async function() {
            await cargarEstilos('src/vistas/ventas/ventas.css');
            await cargarScript('src/vistas/ventas/ventas.js');
        },

        onMostrar: async function() {
            const html = await fetch('src/vistas/ventas/ventas.html').then(r => r.text());
            document.getElementById('contenedorVistas').innerHTML = html;
            
            if (window.inicializarVentas) {
                window.inicializarVentas();
            }
        }
    });

    console.log('✅ Módulos registrados correctamente');
}

// ═══════════════════════════════════════════════════════════════════
// PASO 2: FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════

async function cargarEstilos(url) {
    try {
        // Eliminar CSS anterior del módulo
        document.querySelectorAll('link[id="vista-css-dinamico"], style[id="vista-css-dinamico"]').forEach(el => {
            el.remove();
        });
        
        const response = await fetch(url);
        
        if (response.ok) {
            const cssText = await response.text();
            
            const style = document.createElement('style');
            style.id = 'vista-css-dinamico';
            style.textContent = cssText;
            document.head.appendChild(style);
            
            console.log(`   ✅ CSS cargado: ${url.split('/').pop()}`);
            
            // Esperar a que se aplique
            await new Promise(resolve => setTimeout(resolve, 50));
        } else {
            console.warn(`   ⚠️ CSS no encontrado: ${url}`);
        }
    } catch (error) {
        console.error(`   ❌ Error cargando CSS:`, error);
    }
}

async function cargarScript(url) {
    return new Promise((resolve, reject) => {
        // Verificar si ya existe
        const existente = document.querySelector(`script[src="${url}"]`);
        if (existente) {
            console.log(`   ℹ️ Script ya cargado: ${url.split('/').pop()}`);
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = url;
        script.async = false;
        
        script.onload = () => {
            console.log(`   ✅ Script cargado: ${url.split('/').pop()}`);
            resolve();
        };
        
        script.onerror = () => {
            console.error(`   ❌ Error cargando script: ${url}`);
            reject(new Error(`No se pudo cargar ${url}`));
        };
        
        document.head.appendChild(script);
    });
}

// ═══════════════════════════════════════════════════════════════════
// PASO 3: FUNCIÓN DE NAVEGACIÓN GLOBAL
// ═══════════════════════════════════════════════════════════════════

async function cambiarSeccion(seccionId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log(`\n🔄 Cambiando a sección: ${seccionId}`);
    
    // Remover active de todos los links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Activar link actual
    const linkActual = document.querySelector(`[data-section="${seccionId}"]`);
    if (linkActual) {
        linkActual.classList.add('active');
    }
    
    // Si event.currentTarget existe, también activarlo
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // Activar módulo
    await window.grizalumModulos.activar(seccionId);
}

// Hacer global
window.cambiarSeccion = cambiarSeccion;

// ═══════════════════════════════════════════════════════════════════
// PASO 4: FUNCIÓN DE RECARGA GLOBAL
// ═══════════════════════════════════════════════════════════════════

window.recargarFlujoCaja = function() {
    console.log('🔄 [recargarFlujoCaja] Ejecutando...');
    
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

// ═══════════════════════════════════════════════════════════════════
// PASO 5: INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando sistema de navegación...');
    
    // Esperar a que Sistema de Módulos esté listo
    const verificar = () => {
        if (window.grizalumModulos) {
            registrarModulos();
            
            // Cargar vista inicial después de un delay
            setTimeout(() => {
                cambiarSeccion('dashboard');
            }, 500);
        } else {
            setTimeout(verificar, 100);
        }
    };
    
    verificar();
});

console.log('✅ Cargador de vistas v2.0 inicializado');

// ═══════════════════════════════════════════════════════════════════
// MODO DESARROLLO: Forzar recarga sin caché
// ═══════════════════════════════════════════════════════════════════

if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) {
    console.log('🔧 Modo desarrollo: timestamps activados');
    
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && (url.endsWith('.html') || url.endsWith('.css') || url.endsWith('.js'))) {
            const separator = url.includes('?') ? '&' : '?';
            url = url + separator + 't=' + Date.now();
        }
        return originalFetch(url, options);
    };
}
