/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM — PANEL DE CONTROL: METAS Y VENTAS v1.0
 * Agrega sección de metas, ventas del mes y top productos
 * Sin tocar panel-control.js ni panel-control-ui.js
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ── OBTENER EMPRESA ACTIVA ────────────────────────────────────
    function getEmpresa() {
        return localStorage.getItem('grizalum_empresa_activa') || 'grizalum';
    }

    // ── LEER CONFIG (metas) ───────────────────────────────────────
    function getConfig() {
        try {
            const raw = localStorage.getItem('grizalum_config_' + getEmpresa());
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    // ── LEER VENTAS DEL MES ACTUAL ────────────────────────────────
    function getVentasMes() {
        try {
            const raw = localStorage.getItem('grizalum_ventas_' + getEmpresa());
            const ventas = raw ? JSON.parse(raw) : [];

            const ahora = new Date();
            const mes = ahora.getMonth();
            const año = ahora.getFullYear();

            return ventas.filter(v => {
                const f = new Date(v.fecha);
                return f.getMonth() === mes && f.getFullYear() === año;
            });
        } catch (e) { return []; }
    }

    // ── CALCULAR TOP PRODUCTOS ────────────────────────────────────
    function getTopProductos(ventas, top = 5) {
        const mapa = {};
        ventas.forEach(v => {
            if (!v.items) return;
            v.items.forEach(item => {
                const nombre = item.nombre || item.producto || 'Sin nombre';
                if (!mapa[nombre]) mapa[nombre] = { nombre, cantidad: 0, total: 0 };
                mapa[nombre].cantidad += (item.cantidad || 1);
                mapa[nombre].total += (item.subtotal || item.total || 0);
            });
        });
        return Object.values(mapa)
            .sort((a, b) => b.total - a.total)
            .slice(0, top);
    }

    // ── FORMATEAR NÚMERO ──────────────────────────────────────────
    function fmt(n) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(n || 0);
    }

    // ── BARRA DE PROGRESO ─────────────────────────────────────────
    function barraColor(pct) {
        if (pct >= 100) return '#10b981';
        if (pct >= 60)  return '#f59e0b';
        return '#ef4444';
    }

    function renderBarra(actual, meta, labelActual, labelMeta) {
        const pct = meta > 0 ? Math.min((actual / meta) * 100, 100) : 0;
        const color = barraColor(pct);
        return `
            <div class="pcm-barra-wrap">
                <div class="pcm-barra-labels">
                    <span class="pcm-barra-actual">${labelActual}</span>
                    <span class="pcm-barra-meta">Meta: ${labelMeta}</span>
                </div>
                <div class="pcm-barra-track">
                    <div class="pcm-barra-fill" style="width:${pct.toFixed(1)}%;background:${color};"></div>
                </div>
                <div class="pcm-barra-pct" style="color:${color};">${pct.toFixed(1)}% completado</div>
            </div>
        `;
    }

    // ── RENDER PRINCIPAL ──────────────────────────────────────────
    function renderSeccion() {
        const cfg      = getConfig();
        const ventas   = getVentasMes();
        const productos = getTopProductos(ventas);

        const totalVentas   = ventas.reduce((s, v) => s + (v.total || v.monto || 0), 0);
        const metaVentas    = cfg.metaVentas || 0;
        const limiteGastos  = cfg.limiteGastos || 0;
        const moneda        = cfg.moneda === 'USD' ? '$' : cfg.moneda === 'EUR' ? '€' : 'S/';

        // ── ALERTA DE GASTOS ──────────────────────────────────────
        let alertaGastos = '';
        if (limiteGastos > 0) {
            try {
                const rawFlujo = localStorage.getItem('grizalum_flujo_caja_' + getEmpresa());
                const flujo = rawFlujo ? JSON.parse(rawFlujo) : [];
                const ahora = new Date();
                const gastosDelMes = flujo
                    .filter(t => {
                        const f = new Date(t.fecha);
                        return t.tipo === 'gasto' &&
                               f.getMonth() === ahora.getMonth() &&
                               f.getFullYear() === ahora.getFullYear();
                    })
                    .reduce((s, t) => s + (t.monto || 0), 0);

                const pctGastos = (gastosDelMes / limiteGastos) * 100;
                if (pctGastos >= 80) {
                    const colorAlerta = pctGastos >= 100 ? '#ef4444' : '#f59e0b';
                    const iconoAlerta = pctGastos >= 100 ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';
                    const textoAlerta = pctGastos >= 100
                        ? `⚠️ Límite de gastos superado — ${moneda} ${fmt(gastosDelMes)} de ${moneda} ${fmt(limiteGastos)}`
                        : `Atención — gastos al ${pctGastos.toFixed(0)}% del límite mensual`;
                    alertaGastos = `
                        <div class="pcm-alerta" style="border-color:${colorAlerta};background:${colorAlerta}18;">
                            <i class="fas ${iconoAlerta}" style="color:${colorAlerta};"></i>
                            <span style="color:${colorAlerta};">${textoAlerta}</span>
                        </div>
                    `;
                }
            } catch (e) {}
        }

        // ── TOP PRODUCTOS HTML ────────────────────────────────────
        let topHTML = '';
        if (productos.length === 0) {
            topHTML = '<p class="pcm-empty">Sin ventas registradas este mes.</p>';
        } else {
            const maxTotal = productos[0].total || 1;
            topHTML = productos.map((p, i) => {
                const pct = ((p.total / maxTotal) * 100).toFixed(0);
                return `
                    <div class="pcm-producto-row">
                        <span class="pcm-producto-rank">${i + 1}</span>
                        <div class="pcm-producto-info">
                            <div class="pcm-producto-nombre">${p.nombre}</div>
                            <div class="pcm-producto-barra">
                                <div class="pcm-producto-fill" style="width:${pct}%;"></div>
                            </div>
                        </div>
                        <div class="pcm-producto-datos">
                            <span class="pcm-producto-monto">${moneda} ${fmt(p.total)}</span>
                            <span class="pcm-producto-cant">${p.cantidad} uds</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ── HTML COMPLETO ─────────────────────────────────────────
        const html = `
        <section class="pcm-seccion" id="pcm-seccion-metas">

            ${alertaGastos}

            <div class="pcm-grid">

                <!-- TARJETA: META DE VENTAS -->
                <div class="pcm-card">
                    <div class="pcm-card-header">
                        <i class="fas fa-bullseye"></i>
                        <h3>Meta de Ventas — ${new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}</h3>
                    </div>
                    <div class="pcm-card-body">
                        <div class="pcm-numero-grande">${moneda} ${fmt(totalVentas)}</div>
                        <div class="pcm-numero-sub">${ventas.length} ${ventas.length === 1 ? 'venta' : 'ventas'} este mes</div>
                        ${metaVentas > 0
                            ? renderBarra(totalVentas, metaVentas, `${moneda} ${fmt(totalVentas)}`, `${moneda} ${fmt(metaVentas)}`)
                            : '<p class="pcm-sin-meta">Sin meta configurada — <a href="#" onclick="cambiarSeccion(\'configuracion\', event)" style="color:#d4af37;">configúrala aquí</a></p>'
                        }
                    </div>
                </div>

                <!-- TARJETA: TOP PRODUCTOS -->
                <div class="pcm-card">
                    <div class="pcm-card-header">
                        <i class="fas fa-trophy"></i>
                        <h3>Top Productos del Mes</h3>
                    </div>
                    <div class="pcm-card-body">
                        <div class="pcm-productos-lista">
                            ${topHTML}
                        </div>
                    </div>
                </div>

            </div>
        </section>
        `;

        return html;
    }

    // ── CSS ───────────────────────────────────────────────────────
    function inyectarCSS() {
        if (document.getElementById('pcm-estilos')) return;
        const style = document.createElement('style');
        style.id = 'pcm-estilos';
        style.textContent = `
        .pcm-seccion {
            margin: 24px 0;
        }

        .pcm-alerta {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            border: 1px solid;
            border-radius: 10px;
            margin-bottom: 16px;
            font-size: 14px;
            font-weight: 500;
        }

        .pcm-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .pcm-card {
            background: var(--tarjeta-bg, #1a1a2e);
            border: 1px solid rgba(212,175,55,0.15);
            border-radius: 14px;
            overflow: hidden;
        }

        .pcm-card-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 18px;
            border-bottom: 1px solid rgba(212,175,55,0.1);
            background: rgba(212,175,55,0.05);
        }

        .pcm-card-header i {
            color: #d4af37;
            font-size: 16px;
        }

        .pcm-card-header h3 {
            font-size: 14px;
            font-weight: 600;
            color: var(--texto-primario, #e8d5a3);
            margin: 0;
        }

        .pcm-card-body {
            padding: 18px;
        }

        .pcm-numero-grande {
            font-size: 28px;
            font-weight: 700;
            color: #10b981;
            margin-bottom: 4px;
        }

        .pcm-numero-sub {
            font-size: 13px;
            color: var(--texto-secundario, #a0916b);
            margin-bottom: 16px;
        }

        .pcm-barra-wrap {
            margin-top: 8px;
        }

        .pcm-barra-labels {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin-bottom: 6px;
        }

        .pcm-barra-actual {
            color: var(--texto-primario, #e8d5a3);
            font-weight: 600;
        }

        .pcm-barra-meta {
            color: var(--texto-secundario, #a0916b);
        }

        .pcm-barra-track {
            height: 10px;
            background: rgba(255,255,255,0.08);
            border-radius: 6px;
            overflow: hidden;
        }

        .pcm-barra-fill {
            height: 100%;
            border-radius: 6px;
            transition: width 0.6s ease;
        }

        .pcm-barra-pct {
            font-size: 12px;
            font-weight: 600;
            margin-top: 5px;
            text-align: right;
        }

        .pcm-sin-meta {
            font-size: 13px;
            color: var(--texto-secundario, #a0916b);
            margin-top: 8px;
        }

        .pcm-empty {
            font-size: 13px;
            color: var(--texto-secundario, #a0916b);
            text-align: center;
            padding: 20px 0;
        }

        .pcm-productos-lista {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .pcm-producto-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .pcm-producto-rank {
            width: 24px;
            height: 24px;
            background: rgba(212,175,55,0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            color: #d4af37;
            flex-shrink: 0;
        }

        .pcm-producto-info {
            flex: 1;
            min-width: 0;
        }

        .pcm-producto-nombre {
            font-size: 13px;
            font-weight: 500;
            color: var(--texto-primario, #e8d5a3);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
        }

        .pcm-producto-barra {
            height: 5px;
            background: rgba(255,255,255,0.08);
            border-radius: 3px;
            overflow: hidden;
        }

        .pcm-producto-fill {
            height: 100%;
            background: linear-gradient(90deg, #d4af37, #10b981);
            border-radius: 3px;
        }

        .pcm-producto-datos {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            flex-shrink: 0;
        }

        .pcm-producto-monto {
            font-size: 13px;
            font-weight: 600;
            color: #10b981;
        }

        .pcm-producto-cant {
            font-size: 11px;
            color: var(--texto-secundario, #a0916b);
        }

        @media (max-width: 768px) {
            .pcm-grid {
                grid-template-columns: 1fr;
            }
        }
        `;
        document.head.appendChild(style);
    }

    // ── INYECTAR EN EL DOM ────────────────────────────────────────
    function inyectarSeccion() {
        // Evitar duplicados
        const existente = document.getElementById('pcm-seccion-metas');
        if (existente) {
            existente.outerHTML = renderSeccion();
            return;
        }

        // Insertar después de .panel-acciones (botones)
        const ancla = document.querySelector('.panel-acciones');
        if (ancla) {
            ancla.insertAdjacentHTML('afterend', renderSeccion());
            return;
        }

        // Fallback: al final del contenedor principal
        const contenedor = document.querySelector('.panel-control-contenedor');
        if (contenedor) {
            contenedor.insertAdjacentHTML('beforeend', renderSeccion());
        }
    }

    // ── ACTUALIZAR (llamable desde fuera) ─────────────────────────
    window.pcmActualizar = function () {
        const existente = document.getElementById('pcm-seccion-metas');
        if (existente) {
            existente.outerHTML = renderSeccion();
        }
    };

    // ── INICIALIZAR ───────────────────────────────────────────────
    function inicializar() {
        inyectarCSS();
        inyectarSeccion();
        console.log('[PCM] ✅ Sección de metas y ventas cargada');
    }

    // Escuchar actualizaciones
    document.addEventListener('grizalumConfigGuardada', window.pcmActualizar);
    document.addEventListener('grizalumTransaccionAgregada', window.pcmActualizar);
    document.addEventListener('grizalumCompanyChanged', () => setTimeout(window.pcmActualizar, 300));

    // Arrancar
    setTimeout(inicializar, 600);

})();
