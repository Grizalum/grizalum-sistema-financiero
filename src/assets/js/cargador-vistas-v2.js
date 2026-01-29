/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - CARGADOR DE VISTAS v2.3 (ESTADO DE RESULTADOS FIXED)
 * ✅ Estado de Resultados se reinicializa correctamente
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
        nivel: 0,

        dependencias: [
            'src/vistas/flujo-caja/flujo-caja-categorias.js',
            'src/vistas/flujo-caja/flujo-caja-config.js'
        ],

        onCargar: async function() {
            console.log('   📊 Cargando Panel de Control...');
            
            console.log('   📦 Cargando dependencias del Flujo de Caja...');
            await cargarScript('src/vistas/flujo-caja/flujo-caja.js');
            await cargarScript('src/vistas/flujo-caja/historial-descripciones.js');
            await cargarScript('src/vistas/flujo-caja/flujo-caja-ui.js');
            await cargarScript('src/vistas/flujo-caja/flujo-caja-planes.js');
            await cargarScript('src/vistas/flujo-caja/flujo-caja-categorias.js');
            
            if (window.flujoCaja) {
                await window.flujoCaja.esperarInicializacion();
                console.log('   ✅ Flujo de Caja inicializado');
            }
            
            await cargarEstilos('src/vistas/panel-control/panel-control.css');
            
            if (typeof Chart === 'undefined') {
                console.log('   📊 Cargando Chart.js...');
                await cargarScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js');
                console.log('   ✅ Chart.js cargado');
            }
            
            if (typeof ExcelJS === 'undefined') {
                console.log('   📦 Cargando ExcelJS...');
                await cargarScript('https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js');
                console.log('   ✅ ExcelJS cargado');
            }

            await cargarScript('src/vistas/panel-control/panel-control.js');
            await cargarScript('src/vistas/panel-control/panel-control-planes.js');
            await cargarScript('src/vistas/panel-control/panel-control-exportador.js');
            
            console.log('   ✅ Panel de Control (core) cargado');
        },

        onMostrar: async function() {
            console.log('   👁️ Mostrando Panel de Control...');
            
            const contenedor = document.getElementById('contenedorVistas'); 
            
            await cargarEstilos('src/vistas/panel-control/panel-control.css');
            
            contenedor.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; 
                            min-height: 400px;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; animation: spin 1s linear infinite;">📊</div>
                        <p style="color: var(--texto-terciario); margin-top: 1rem;">
                            Cargando Panel de Control...
                        </p>
                    </div>
                </div>
                <style>
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
            `;
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const html = await fetch('src/vistas/panel-control/panel-control.html').then(r => r.text());
            
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
            
            console.log('   ⏳ Esperando datos del Panel de Control...');

            if (window.panelControl) {
                let intentos = 0;
                while (!window.panelControl.estaListo() && intentos < 30) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    intentos++;
                }
    
                if (window.panelControl.estaListo()) {
                    console.log('   ✅ Panel de Control con datos cargados');
                    await new Promise(resolve => setTimeout(resolve, 200));
                } else {
                    console.warn('   ⚠️ Timeout esperando datos del Panel');
                }
            }
            
            console.log('   📦 Cargando scripts del HTML...');
            
            for (const scriptOriginal of scriptsArray) {
                if (!scriptOriginal.src) {
                    const script = document.createElement('script');
                    script.textContent = scriptOriginal.textContent;
                    document.body.appendChild(script);
                    console.log('   ✅ Script inline ejecutado');
                    continue;
                }
                
                const srcCompleto = scriptOriginal.src;
                const srcBase = srcCompleto.split('?')[0];
                const nombreArchivo = srcBase.split('/').pop();
                
                const yaExiste = Array.from(document.querySelectorAll('script[src]')).some(s => {
                    const sSrcBase = s.src.split('?')[0];
                    return sSrcBase === srcBase;
                });
                
                if (yaExiste) {
                    console.log(`   ⏭️ Ya cargado: ${nombreArchivo}`);
                    continue;
                }
                
                try {
                    console.log(`   📥 Cargando: ${nombreArchivo}`);
                    await cargarScript(srcCompleto);
                    console.log(`   ✅ Cargado: ${nombreArchivo}`);
                } catch (error) {
                    console.error(`   ❌ Error cargando ${nombreArchivo}:`, error);
                }
            }
            
            if (window.panelControl) {
                await window.panelControl.esperarInicializacion();
            }

            console.log('   ⏳ Esperando a panelControlUI...');
            let intentos = 0;
            while (!window.panelControlUI && intentos < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                intentos++;
            }
            
            if (window.panelControlUI) {
                console.log('   ✅ panelControlUI disponible');
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                setTimeout(() => {
                    console.log('   🔄 Inicializando UI del Panel de Control...');
                    
                    if (window.panelControlUI.cargarDatos) {
                        window.panelControlUI.cargarDatos();
                        console.log('   ✅ Datos cargados en UI');
                    }
                    
                    if (window.panelControlUI.inicializarGraficos) {
                        window.panelControlUI.inicializarGraficos();
                        console.log('   ✅ Gráficos inicializados');
                    }
                    
                    if (window.PanelControlPlanes && window.PanelControlPlanes.aplicarRestricciones) {
                        window.PanelControlPlanes.aplicarRestricciones();
                        console.log('   ✅ Restricciones aplicadas');
                    }
                    
                    window.dispatchEvent(new Event('vistaPanelControlCargada'));
                    contenedor.scrollTo({ top: 0, behavior: 'smooth' });
                    console.log('   ✅ Panel de Control completamente listo');
                }, 200);
                
            } else {
                console.error('   ❌ panelControlUI NO se cargó después de esperar');
                console.error('   💡 Verifica que panel-control-ui.js no tenga errores');
            }
        }
    });

    // ───────────────────────────────────────────────────────────────
    // FLUJO DE CAJA
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'cash-flow',
        nombre: 'Flujo de Caja',
        ruta: 'src/vistas/flujo-caja/flujo-caja.html',
        nivel: 0,

        dependencias: [
            'src/vistas/flujo-caja/flujo-caja-categorias.js',
            'src/vistas/flujo-caja/flujo-caja-config.js'
        ],

        onCargar: async function() {
            console.log('   💰 Cargando Flujo de Caja...');
            await cargarEstilos('src/vistas/flujo-caja/flujo-caja.css');
        },

        onMostrar: async function() {
            console.log('   👁️ Mostrando Flujo de Caja...');
            
            const contenedor = document.getElementById('contenedorVistas');
            
            contenedor.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; 
                            min-height: 400px;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; animation: spin 1s linear infinite;">💰</div>
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
        
            setTimeout(() => {
                contenedor.scrollTo({ top: 0, behavior: 'smooth' });
                console.log('✅ Flujo de Caja cargado');
            }, 400);
        },
        
        onOcultar: function() {
            console.log('   👁️‍🗨️ Ocultando Flujo de Caja');
        }
    });

    // ───────────────────────────────────────────────────────────────
    // ESTADO DE RESULTADOS - CORREGIDO
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'income-statement',
        nombre: 'Estado de Resultados',
        ruta: 'src/vistas/estado-resultados/estado-resultados.html',
        nivel: 0,

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
            
            console.log('   🔄 Reinicializando Estado de Resultados...');
            
            if (window.estadoResultadosUI) {
                window.estadoResultadosUI = null;
            }
            
            for (const scriptOriginal of scriptsArray) {
                if (!scriptOriginal.src) {
                    const script = document.createElement('script');
                    script.textContent = scriptOriginal.textContent;
                    document.body.appendChild(script);
                }
            }
            
            setTimeout(() => {
                window.dispatchEvent(new Event('vistaEstadoResultadosCargada'));
                contenedor.scrollTo({ top: 0, behavior: 'instant' });
                console.log('✅ Estado de Resultados cargado');
            }, 350);
        }
    });

    // ───────────────────────────────────────────────────────────────
    // BALANCE GENERAL
    // ───────────────────────────────────────────────────────────────
    window.grizalumModulos.registrar({
        id: 'balance-sheet',
        nombre: 'Balance General',    
        ruta: 'src/vistas/balance-general/balance-general.html',
        nivel: 0,

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
        nivel: 0,

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
        nivel: 50,

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
        nivel: 50,

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
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const linkActual = document.querySelector(`[data-section="${seccionId}"]`);
    if (linkActual) {
        linkActual.classList.add('active');
    }
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    await window.grizalumModulos.activar(seccionId);
    
    try {
        const empresaId = window.gestorEmpresas?.estado?.empresaActual;
        if (empresaId && empresaId !== 'null' && empresaId !== 'undefined') {
            const key = `grizalum_ultima_vista_${empresaId}`;
            localStorage.setItem(key, seccionId);
            console.log(`✅ Vista "${seccionId}" guardada para empresa: ${empresaId}`);
        }
    } catch (error) {
        console.error('❌ Error guardando última vista:', error);
    }
}

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
    console.log('🚀 Inicializando sistema de navegación v2.3...');
    
    const verificar = () => {
        if (window.grizalumModulos) {
            registrarModulos();
            
            setTimeout(() => {
                let vistaInicial = 'dashboard';
                
                try {
                    const empresaId = window.gestorEmpresas?.estado?.empresaActual;
                    if (empresaId && empresaId !== 'null' && empresaId !== 'undefined') {
                        const key = `grizalum_ultima_vista_${empresaId}`;
                        const ultimaVista = localStorage.getItem(key);
                        
                        if (ultimaVista) {
                            vistaInicial = ultimaVista;
                            console.log(`📍 Cargando última vista de ${empresaId}: ${ultimaVista}`);
                        }
                    }
                } catch (error) {
                    console.error('❌ Error cargando última vista:', error);
                }
                
                cambiarSeccion(vistaInicial);
            }, 500);
        } else {
            setTimeout(verificar, 100);
        }
    };
    
    verificar();
});

console.log('✅ Cargador de vistas v2.3 (ER FIXED) inicializado');

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
