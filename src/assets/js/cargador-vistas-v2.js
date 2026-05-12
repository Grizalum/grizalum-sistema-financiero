/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - CARGADOR DE VISTAS v3.0
 * Navegación instantánea — Sin overlays — Precarga en segundo plano
 * ═══════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════
// CACHÉ GLOBAL
// ═══════════════════════════════════════════════════════════════════

const GrizalumCache = {
    html:      {},
    css:       {},
    cargado:   {},

    async precargarHTML(modulos) {
        await Promise.all(modulos.map(async (mod) => {
            if (this.html[mod.id]) return;
            try {
                const r = await fetch(mod.ruta);
                if (r.ok) {
                    this.html[mod.id] = await r.text();
                    console.log(`📥 [Cache] ${mod.id}`);
                }
            } catch (e) {}
        }));
    }
};

// ═══════════════════════════════════════════════════════════════════
// MÓDULOS — Definición completa
// ═══════════════════════════════════════════════════════════════════

const MODULOS = [
    {
        id: 'dashboard',
        nombre: 'Panel de Control',
        ruta: 'src/vistas/panel-control/panel-control.html',
        css: 'src/vistas/panel-control/panel-control.css',
        scripts: [
            'src/vistas/flujo-caja/flujo-caja-categorias.js',
            'src/vistas/flujo-caja/flujo-caja-config.js',
            'src/vistas/flujo-caja/flujo-caja.js',
            'src/vistas/flujo-caja/historial-descripciones.js',
            'src/vistas/flujo-caja/flujo-caja-ui.js',
            'src/vistas/flujo-caja/flujo-caja-planes.js',
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
            'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js',
            'src/vistas/panel-control/panel-control.js',
            'src/vistas/panel-control/panel-control-planes.js',
            'src/vistas/panel-control/panel-control-exportador.js',
            'src/vistas/panel-control/panel-control-ui.js?v=1763827100',
            'src/vistas/panel-control/panel-control-fix.js?v=1763827100',
            'src/vistas/panel-control/panel-control-banner.js?v=1763827100',
        ],
        inicializar: () => {
            setTimeout(() => {
                if (window.panelControlUI) {
                    window.panelControlUI.cargarDatos?.();
                    window.panelControlUI.inicializarGraficos?.();
                }
                window.PanelControlPlanes?.aplicarRestricciones?.();
                window.dispatchEvent(new Event('vistaPanelControlCargada'));
            }, 300);
        }
    },
    {
        id: 'cash-flow',
        nombre: 'Flujo de Caja',
        ruta: 'src/vistas/flujo-caja/flujo-caja.html',
        css: 'src/vistas/flujo-caja/flujo-caja.css',
        scripts: [
            'src/vistas/flujo-caja/flujo-caja-categorias.js',
            'src/vistas/flujo-caja/flujo-caja-config.js',
            'src/vistas/flujo-caja/flujo-caja.js',
            'src/vistas/flujo-caja/historial-descripciones.js',
            'src/vistas/flujo-caja/flujo-caja-ui.js',
            'src/vistas/flujo-caja/flujo-caja-planes.js',
        ],
        inicializar: () => {
            window.dispatchEvent(new Event('flujoCajaVisible'));
            setTimeout(() => {
                if (window.flujoCajaUI?.modulo) {
                    window.flujoCajaUI.cargarBalance?.();
                    window.flujoCajaUI.cargarTransacciones?.();
                }
            }, 300);
        }
    },
    {
        id: 'income-statement',
        nombre: 'Estado de Resultados',
        ruta: 'src/vistas/estado-resultados/estado-resultados.html',
        css: 'src/vistas/estado-resultados/estado-resultados.css',
        scripts: [
            'src/vistas/flujo-caja/flujo-caja-categorias.js',
            'src/vistas/flujo-caja/flujo-caja-config.js',
            'src/vistas/flujo-caja/flujo-caja.js',
            'src/vistas/estado-resultados/estado-resultados-config.js',
            'src/vistas/estado-resultados/estado-resultados.js',
            'src/vistas/estado-resultados/estado-resultados-ui.js',
            'src/vistas/estado-resultados/estado-resultados-exportador.js',
            'src/vistas/estado-resultados/estado-resultados-graficos.js',
            'src/vistas/estado-resultados/estado-resultados-inicializador.js',
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
            'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js',
        ],
        inicializar: () => {
            setTimeout(() => {
                if (window.estadoResultados) {
                    window.estadoResultados.empresaActual = localStorage.getItem('grizalum_empresa_actual') || 'avicola';
                    window.estadoResultados.configuracion = window.EstadoResultadosConfig;
                    window.estadoResultados.calcularResultados?.();
                    if (!window.estadoResultadosUI && window.EstadoResultadosUI) {
                        window.estadoResultadosUI = new window.EstadoResultadosUI();
                    }
                }
                window.dispatchEvent(new Event('vistaEstadoResultadosCargada'));
            }, 500);
        }
    },
    {
        id: 'balance-sheet',
        nombre: 'Balance General',
        ruta: 'src/vistas/balance-general/balance-general.html',
        css: 'src/vistas/balance-general/balance-general.css',
        scripts: [
            'src/vistas/flujo-caja/flujo-caja-categorias.js',
            'src/vistas/flujo-caja/flujo-caja-config.js',
            'src/vistas/flujo-caja/flujo-caja.js',
            'src/vistas/balance-general/balance-general-config.js?v=20260417',
            'src/vistas/balance-general/balance-general-calculos.js?v=20260417',
            'src/vistas/balance-general/balance-general-ui.js?v=20260417',
            'src/vistas/balance-general/balance-general-graficos.js?v=20260417',
            'src/vistas/balance-general/balance-general-exportador.js?v=20260417',
            'src/vistas/balance-general/balance-general.js?v=20260417',
        ],
        inicializar: () => {
            setTimeout(() => {
                window._balanceGeneralCargado = false;
                window.inicializarBalanceGeneral?.();
            }, 200);
        }
    },
    {
        id: 'cuentas-bancarias',
        nombre: 'Cuentas Bancarias',
        ruta: 'src/vistas/cuentas-bancarias/cuentas-bancarias.html',
        css: 'src/vistas/cuentas-bancarias/cuentas-bancarias.css',
        scripts: [
            'src/assets/js/gestor-cuentas-bancarias.js',
            'src/assets/js/ui-cuentas-bancarias.js',
            'src/vistas/cuentas-bancarias/cuentas-bancarias.js?v=20260510',
        ],
        inicializar: () => {
            setTimeout(() => {
                window._cuentasBancariasCargado = false;
                window.inicializarCuentasBancarias?.();
            }, 200);
        }
    },
    {
        id: 'inventory',
        nombre: 'Inventario',
        ruta: 'src/vistas/inventario/inventario.html',
        css: 'src/vistas/inventario/inventario.css?v=20260510',
        scripts: [
            'src/vistas/inventario/inventario.js?v=20260510b',
        ],
        inicializar: () => {
            setTimeout(() => {
                window._inventarioCargado = false;
                window.inicializarInventario?.();
            }, 200);
        }
    },
    {
        id: 'sales',
        nombre: 'Ventas',
        ruta: 'src/vistas/ventas/ventas.html',
        css: 'src/vistas/ventas/ventas.css?v=20260510',
        scripts: [
            'src/vistas/ventas/ventas.js?v=20260510b',
        ],
        inicializar: () => {
            setTimeout(() => {
                window._ventasCargado = false;
                window.inicializarVentas?.();
            }, 200);
        }
    },
    {
        id: 'reports',
        nombre: 'Reportes',
        ruta: 'src/vistas/reportes/reportes.html',
        css: 'src/vistas/reportes/reportes.css?v=20260512',
        scripts: [
            'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js',
            'src/vistas/reportes/reportes.js?v=20260512',
        ],
        inicializar: () => {
            setTimeout(() => {
                window._reportesCargado = false;
                window.inicializarReportes?.();
            }, 200);
        }
    },
];

// ═══════════════════════════════════════════════════════════════════
// CARGADOR DE SCRIPTS — Una sola vez por script
// ═══════════════════════════════════════════════════════════════════

const scriptsYaCargados = new Set();

async function cargarScript(url) {
    const urlBase = url.split('?')[0];
    const nombreArchivo = urlBase.split('/').pop();

    if (scriptsYaCargados.has(urlBase)) return;

    const yaExiste = Array.from(document.querySelectorAll('script[src]'))
        .some(s => s.src.split('?')[0].endsWith(nombreArchivo));

    if (yaExiste) {
        scriptsYaCargados.add(urlBase);
        return;
    }

    scriptsYaCargados.add(urlBase);

    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = false;
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);
    });
}

function aplicarCSS(cssText) {
    let style = document.getElementById('vista-css-dinamico');
    if (!style) {
        style = document.createElement('style');
        style.id = 'vista-css-dinamico';
        document.head.appendChild(style);
    }
    style.textContent = cssText;
}

async function cargarEstilos(url) {
    if (GrizalumCache.css[url]) {
        aplicarCSS(GrizalumCache.css[url]);
        return;
    }
    try {
        const r = await fetch(url);
        if (r.ok) {
            const css = await r.text();
            GrizalumCache.css[url] = css;
            aplicarCSS(css);
        }
    } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════
// BARRA DE PROGRESO DISCRETA
// ═══════════════════════════════════════════════════════════════════

function mostrarBarraProgreso() {
    let barra = document.getElementById('gz-progress');
    if (!barra) {
        const style = document.createElement('style');
        style.textContent = `
            #gz-progress {
                position:fixed;top:0;left:0;height:2px;width:0%;
                background:linear-gradient(90deg,#10b981,#3b82f6,#8b5cf6);
                z-index:99999;transition:width 0.4s ease,opacity 0.3s ease;
                border-radius:0 2px 2px 0;
            }
        `;
        document.head.appendChild(style);
        barra = document.createElement('div');
        barra.id = 'gz-progress';
        document.body.appendChild(barra);
    }
    barra.style.opacity = '1';
    barra.style.width = '0%';
    setTimeout(() => { barra.style.width = '60%'; }, 10);
    setTimeout(() => { barra.style.width = '85%'; }, 300);
}

function ocultarBarraProgreso() {
    const barra = document.getElementById('gz-progress');
    if (barra) {
        barra.style.width = '100%';
        setTimeout(() => { barra.style.opacity = '0'; barra.style.width = '0%'; }, 300);
    }
}

// ═══════════════════════════════════════════════════════════════════
// NAVEGACIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

let moduloActual = null;
let cargandoModulo = false;

async function cambiarSeccion(seccionId, event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    if (seccionId === moduloActual && GrizalumCache.cargado[seccionId]) return;
    if (cargandoModulo) return;

    cargandoModulo = true;

    // Actualizar sidebar inmediatamente
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const linkActual = document.querySelector(`[data-section="${seccionId}"]`);
    if (linkActual) linkActual.classList.add('active');
    if (event?.currentTarget) event.currentTarget.classList.add('active');

    const modulo = MODULOS.find(m => m.id === seccionId);
    if (!modulo) { cargandoModulo = false; return; }

    const contenedor = document.getElementById('contenedorVistas');
    if (!contenedor) { cargandoModulo = false; return; }

    const esPrimeraCarga = !GrizalumCache.cargado[seccionId];
    if (esPrimeraCarga) mostrarBarraProgreso();

    try {
        // 1. CSS
        if (modulo.css) await cargarEstilos(modulo.css);

        // 2. HTML — del caché si ya se precargó
        let html = GrizalumCache.html[seccionId];
        if (!html) {
            const r = await fetch(modulo.ruta);
            if (r.ok) {
                html = await r.text();
                GrizalumCache.html[seccionId] = html;
            }
        }

        if (html) {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            temp.querySelectorAll('script').forEach(s => s.remove());
            temp.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove());
            contenedor.innerHTML = temp.innerHTML;
        }

        // 3. Scripts — solo primera vez
        if (esPrimeraCarga) {
            for (const scriptUrl of (modulo.scripts || [])) {
                await cargarScript(scriptUrl);
            }
        }

        // 4. Inicializar
        modulo.inicializar?.();

        GrizalumCache.cargado[seccionId] = true;
        moduloActual = seccionId;

        contenedor.scrollTo({ top: 0, behavior: 'instant' });

        // Guardar última vista
        try {
            const empresa = window.gestorEmpresas?.estado?.empresaActual;
            if (empresa && empresa !== 'null' && empresa !== 'undefined') {
                localStorage.setItem(`grizalum_ultima_vista_${empresa}`, seccionId);
            }
        } catch (e) {}

    } catch (e) {
        console.error(`❌ [v3.0] Error en ${seccionId}:`, e);
    }

    ocultarBarraProgreso();
    cargandoModulo = false;

    console.log(`✅ [v3.0] ${seccionId} — ${esPrimeraCarga ? 'primera carga' : 'desde caché'}`);
}

// ═══════════════════════════════════════════════════════════════════
// COMPATIBILIDAD CON grizalumModulos
// ═══════════════════════════════════════════════════════════════════

function registrarModulos() {
    if (!window.grizalumModulos) return;
    MODULOS.forEach(mod => {
        window.grizalumModulos.registrar({
            id:       mod.id,
            nombre:   mod.nombre,
            ruta:     mod.ruta,
            nivel:    0,
            onCargar: async () => {},
            onMostrar: async () => { await cambiarSeccion(mod.id); }
        });
    });
    console.log(`✅ [v3.0] ${MODULOS.length} módulos registrados`);
}

// ═══════════════════════════════════════════════════════════════════
// PRECARGA EN SEGUNDO PLANO
// ═══════════════════════════════════════════════════════════════════

async function precargarEnSegundoPlano() {
    console.log('🔄 [v3.0] Precargando HTMLs en segundo plano...');
    await GrizalumCache.precargarHTML(MODULOS);
    console.log('✅ [v3.0] Precarga lista — navegación instantánea activada');
}

// ═══════════════════════════════════════════════════════════════════
// FUNCIONES GLOBALES DE COMPATIBILIDAD
// ═══════════════════════════════════════════════════════════════════

window.recargarFlujoCaja = function() {
    if (window.flujoCajaUI?.modulo) {
        window.flujoCajaUI.cargarBalance?.();
        window.flujoCajaUI.cargarTransacciones?.();
    }
};

// ═══════════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 [GRIZALUM v3.0] Sistema de navegación instantánea iniciando...');

    const verificar = () => {
        if (window.grizalumModulos) {
            registrarModulos();

            setTimeout(async () => {
                let vistaInicial = 'dashboard';
                try {
                    const empresa = window.gestorEmpresas?.estado?.empresaActual;
                    if (empresa && empresa !== 'null' && empresa !== 'undefined') {
                        const ultima = localStorage.getItem(`grizalum_ultima_vista_${empresa}`);
                        if (ultima) vistaInicial = ultima;
                    }
                } catch (e) {}

                await cambiarSeccion(vistaInicial);

                // Precargar resto en segundo plano después de 1.5s
                setTimeout(precargarEnSegundoPlano, 1500);

            }, 500);
        } else {
            setTimeout(verificar, 100);
        }
    };

    verificar();
});

if (window.location.hostname.includes('vercel.app') || window.location.hostname === 'localhost') {
    console.log('🔧 [v3.0] Modo desarrollo');
}

console.log('✅ [GRIZALUM] Cargador de Vistas v3.0 cargado');
