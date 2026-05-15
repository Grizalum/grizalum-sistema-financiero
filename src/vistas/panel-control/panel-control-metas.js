/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM — PANEL DE CONTROL: METAS Y VENTAS v2.0
 * Fase 2 — KPIs, salud financiera, flujo del día
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ── OBTENER EMPRESA ACTIVA ────────────────────────────────────
    function getEmpresa() {
        return localStorage.getItem('grizalum_empresa_activa') || 'grizalum';
    }

    function getConfig() {
        try {
            const raw = localStorage.getItem('grizalum_config_' + getEmpresa());
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    function getVentasMes() {
        try {
            const raw = localStorage.getItem('grizalum_ventas_' + getEmpresa());
            const ventas = raw ? JSON.parse(raw) : [];
            const ahora = new Date();
            return ventas.filter(v => {
                const f = new Date(v.fecha);
                return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
            });
        } catch (e) { return []; }
    }

    function getFlujoMes() {
        try {
            const raw = localStorage.getItem('grizalum_flujo_caja_' + getEmpresa());
            const flujo = raw ? JSON.parse(raw) : [];
            const ahora = new Date();
            return flujo.filter(t => {
                const f = new Date(t.fecha);
                return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
            });
        } catch (e) { return []; }
    }

    function getFlujoDia() {
        try {
            const raw = localStorage.getItem('grizalum_flujo_caja_' + getEmpresa());
            const flujo = raw ? JSON.parse(raw) : [];
            const hoy = new Date();
            return flujo.filter(t => {
                const f = new Date(t.fecha);
                return f.toDateString() === hoy.toDateString();
            });
        } catch (e) { return []; }
    }

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
        return Object.values(mapa).sort((a, b) => b.total - a.total).slice(0, top);
    }

    function fmt(n) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(n || 0);
    }

    function barraColor(pct) {
        if (pct >= 100) return '#10b981';
        if (pct >= 60)  return '#f59e0b';
        return '#ef4444';
    }

    function renderBarra(actual, meta) {
        const pct = meta > 0 ? Math.min((actual / meta) * 100, 100) : 0;
        const color = barraColor(pct);
        return `
            <div class="pcm-barra-track" style="margin-top:10px;">
                <div class="pcm-barra-fill" style="width:${pct.toFixed(1)}%;background:${color};"></div>
            </div>
            <div class="pcm-barra-pct" style="color:${color};">${pct.toFixed(1)}% de la meta</div>
        `;
    }

    // ── SALUD FINANCIERA ──────────────────────────────────────────
    function calcularSalud(ventasTotal, metaVentas, gastosMes, limiteGastos, utilidad, metaUtilidad) {
        let puntos = 0;
        let factores = [];

        // Factor 1: Ventas vs meta
        if (metaVentas > 0) {
            const pctVentas = (ventasTotal / metaVentas) * 100;
            if (pctVentas >= 100) { puntos += 35; factores.push({ ok: true, texto: 'Meta de ventas alcanzada' }); }
            else if (pctVentas >= 60) { puntos += 20; factores.push({ ok: true, texto: `Ventas al ${pctVentas.toFixed(0)}% de la meta` }); }
            else { puntos += 5; factores.push({ ok: false, texto: `Ventas bajas: ${pctVentas.toFixed(0)}% de la meta` }); }
        } else {
            puntos += 20;
            factores.push({ ok: null, texto: 'Sin meta de ventas configurada' });
        }

        // Factor 2: Gastos vs límite
        if (limiteGastos > 0) {
            const pctGastos = (gastosMes / limiteGastos) * 100;
            if (pctGastos <= 70) { puntos += 35; factores.push({ ok: true, texto: 'Gastos bajo control' }); }
            else if (pctGastos <= 90) { puntos += 15; factores.push({ ok: null, texto: `Gastos al ${pctGastos.toFixed(0)}% del límite` }); }
            else { puntos += 0; factores.push({ ok: false, texto: `Gastos críticos: ${pctGastos.toFixed(0)}% del límite` }); }
        } else {
            puntos += 20;
            factores.push({ ok: null, texto: 'Sin límite de gastos configurado' });
        }

        // Factor 3: Utilidad positiva
        if (utilidad > 0) {
            puntos += 30;
            factores.push({ ok: true, texto: 'Flujo de caja positivo' });
        } else if (utilidad === 0) {
            puntos += 10;
            factores.push({ ok: null, texto: 'Sin movimientos registrados' });
        } else {
            factores.push({ ok: false, texto: 'Flujo de caja negativo' });
        }

        // Determinar estado
        let estado, color, icono, label;
        if (puntos >= 80) {
            estado = 'excelente'; color = '#10b981'; icono = 'fa-circle-check'; label = 'Excelente';
        } else if (puntos >= 55) {
            estado = 'bueno'; color = '#f59e0b'; icono = 'fa-circle-exclamation'; label = 'Atención';
        } else {
            estado = 'critico'; color = '#ef4444'; icono = 'fa-circle-xmark'; label = 'Crítico';
        }

        return { puntos, estado, color, icono, label, factores };
    }

    // ── RENDER PRINCIPAL ──────────────────────────────────────────
    function renderSeccion() {
        const cfg       = getConfig();
        const ventas    = getVentasMes();
        const flujoMes  = getFlujoMes();
        const flujoDia  = getFlujoDia();
        const productos = getTopProductos(ventas);

        const moneda       = cfg.moneda === 'USD' ? '$' : cfg.moneda === 'EUR' ? '€' : 'S/';
        const metaVentas   = cfg.metaVentas   || 0;
        const metaUtilidad = cfg.metaUtilidad  || 0;
        const limiteGastos = cfg.limiteGastos  || 0;

        const totalVentas  = ventas.reduce((s, v) => s + (v.total || v.monto || 0), 0);
        const ingresosMes  = flujoMes.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + (t.monto || 0), 0);
        const gastosMes    = flujoMes.filter(t => t.tipo === 'gasto').reduce((s, t) => s + (t.monto || 0), 0);
        const utilidad     = ingresosMes - gastosMes;

        const ingresosDia  = flujoDia.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + (t.monto || 0), 0);
        const gastosDia    = flujoDia.filter(t => t.tipo === 'gasto').reduce((s, t) => s + (t.monto || 0), 0);
        const balanceDia   = ingresosDia - gastosDia;

        const salud = calcularSalud(totalVentas, metaVentas, gastosMes, limiteGastos, utilidad, metaUtilidad);

        const mes = new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
        const hoy = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });

        // ── TOP PRODUCTOS ─────────────────────────────────────────
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

        // ── FACTORES DE SALUD ─────────────────────────────────────
        const factoresHTML = salud.factores.map(f => `
            <div class="pcm-salud-factor">
                <i class="fas ${f.ok === true ? 'fa-check-circle' : f.ok === false ? 'fa-times-circle' : 'fa-minus-circle'}"
                   style="color:${f.ok === true ? '#10b981' : f.ok === false ? '#ef4444' : '#f59e0b'};"></i>
                <span>${f.texto}</span>
            </div>
        `).join('');

        return `
        <section class="pcm-seccion" id="pcm-seccion-metas">

            <!-- ── FILA 1: KPIs PRINCIPALES ── -->
            <div class="pcm-kpis-grid">

                <!-- KPI: Ventas del mes -->
                <div class="pcm-kpi-card">
                    <div class="pcm-kpi-header">
                        <div class="pcm-kpi-icono" style="background:linear-gradient(135deg,#10b981,#059669);">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div>
                            <div class="pcm-kpi-label">Ventas — ${mes}</div>
                            <div class="pcm-kpi-valor">${moneda} ${fmt(totalVentas)}</div>
                            <div class="pcm-kpi-sub">${ventas.length} ${ventas.length === 1 ? 'venta' : 'ventas'}</div>
                        </div>
                    </div>
                    ${metaVentas > 0
                        ? renderBarra(totalVentas, metaVentas) + `<div class="pcm-kpi-meta">Meta: ${moneda} ${fmt(metaVentas)}</div>`
                        : '<div class="pcm-sin-meta">Sin meta — <a href="#" onclick="cambiarSeccion(\'configuracion\',event)" style="color:#d4af37;">configurar</a></div>'
                    }
                </div>

                <!-- KPI: Utilidad neta -->
                <div class="pcm-kpi-card">
                    <div class="pcm-kpi-header">
                        <div class="pcm-kpi-icono" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div>
                            <div class="pcm-kpi-label">Utilidad Neta — ${mes}</div>
                            <div class="pcm-kpi-valor" style="color:${utilidad >= 0 ? '#10b981' : '#ef4444'};">
                                ${utilidad < 0 ? '-' : ''}${moneda} ${fmt(Math.abs(utilidad))}
                            </div>
                            <div class="pcm-kpi-sub">Ingresos: ${moneda} ${fmt(ingresosMes)} · Gastos: ${moneda} ${fmt(gastosMes)}</div>
                        </div>
                    </div>
                    ${metaUtilidad > 0
                        ? renderBarra(Math.max(utilidad, 0), metaUtilidad) + `<div class="pcm-kpi-meta">Meta: ${moneda} ${fmt(metaUtilidad)}</div>`
                        : '<div class="pcm-sin-meta">Sin meta — <a href="#" onclick="cambiarSeccion(\'configuracion\',event)" style="color:#d4af37;">configurar</a></div>'
                    }
                </div>

                <!-- KPI: Flujo del día -->
                <div class="pcm-kpi-card">
                    <div class="pcm-kpi-header">
                        <div class="pcm-kpi-icono" style="background:linear-gradient(135deg,#d4af37,#b8960c);">
                            <i class="fas fa-calendar-day"></i>
                        </div>
                        <div>
                            <div class="pcm-kpi-label">Hoy — ${hoy}</div>
                            <div class="pcm-kpi-valor" style="color:${balanceDia >= 0 ? '#10b981' : '#ef4444'};">
                                ${balanceDia < 0 ? '-' : ''}${moneda} ${fmt(Math.abs(balanceDia))}
                            </div>
                            <div class="pcm-kpi-sub">↑ ${moneda} ${fmt(ingresosDia)} · ↓ ${moneda} ${fmt(gastosDia)}</div>
                        </div>
                    </div>
                    <div class="pcm-flujo-dia-bars">
                        <div class="pcm-flujo-bar ingreso" style="flex:${ingresosDia || 1}">
                            <span>Ingreso</span>
                        </div>
                        <div class="pcm-flujo-bar gasto" style="flex:${gastosDia || 0.1}">
                            <span>Gasto</span>
                        </div>
                    </div>
                </div>

                <!-- KPI: Salud financiera -->
                <div class="pcm-kpi-card">
                    <div class="pcm-kpi-header">
                        <div class="pcm-kpi-icono" style="background:linear-gradient(135deg,${salud.color},${salud.color}cc);">
                            <i class="fas ${salud.icono}"></i>
                        </div>
                        <div>
                            <div class="pcm-kpi-label">Salud Financiera</div>
                            <div class="pcm-kpi-valor" style="color:${salud.color};">${salud.label}</div>
                            <div class="pcm-kpi-sub">${salud.puntos}/100 puntos</div>
                        </div>
                    </div>
                    <div class="pcm-salud-factores">
                        ${factoresHTML}
                    </div>
                </div>

            </div>

            <!-- ── FILA 2: TOP PRODUCTOS + GASTOS ── -->
            <div class="pcm-grid">

                <!-- Top productos -->
                <div class="pcm-card">
                    <div class="pcm-card-header">
                        <i class="fas fa-trophy"></i>
                        <h3>Top Productos del Mes</h3>
                    </div>
                    <div class="pcm-card-body">
                        <div class="pcm-productos-lista">${topHTML}</div>
                    </div>
                </div>

                <!-- Resumen de gastos vs límite -->
                <div class="pcm-card">
                    <div class="pcm-card-header">
                        <i class="fas fa-receipt"></i>
                        <h3>Control de Gastos — ${mes}</h3>
                    </div>
                    <div class="pcm-card-body">
                        <div class="pcm-numero-grande" style="color:${gastosMes > limiteGastos && limiteGastos > 0 ? '#ef4444' : '#e8d5a3'};">
                            ${moneda} ${fmt(gastosMes)}
                        </div>
                        <div class="pcm-numero-sub">Total gastado este mes</div>
                        ${limiteGastos > 0 ? `
                            ${renderBarra(gastosMes, limiteGastos)}
                            <div class="pcm-kpi-meta">Límite: ${moneda} ${fmt(limiteGastos)} · Disponible: ${moneda} ${fmt(Math.max(limiteGastos - gastosMes, 0))}</div>
                        ` : `
                            <div class="pcm-sin-meta">Sin límite configurado — <a href="#" onclick="cambiarSeccion('configuracion',event)" style="color:#d4af37;">configurar</a></div>
                        `}
                    </div>
                </div>

            </div>

        </section>
        `;
    }

    // ── CSS ───────────────────────────────────────────────────────
    function inyectarCSS() {
        if (document.getElementById('pcm-estilos')) return;
        const style = document.createElement('style');
        style.id = 'pcm-estilos';
        style.textContent = `
        .pcm-seccion { margin: 24px 0; }

        /* ── KPIs GRID ── */
        .pcm-kpis-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 20px;
        }

        .pcm-kpi-card {
            background: var(--tarjeta-bg, #1a1a2e);
            border: 1px solid rgba(212,175,55,0.15);
            border-radius: 14px;
            padding: 18px;
            transition: border-color 0.2s;
        }

        .pcm-kpi-card:hover {
            border-color: rgba(212,175,55,0.35);
        }

        .pcm-kpi-header {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            margin-bottom: 12px;
        }

        .pcm-kpi-icono {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 18px;
            flex-shrink: 0;
        }

        .pcm-kpi-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--texto-secundario, #a0916b);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .pcm-kpi-valor {
            font-size: 22px;
            font-weight: 700;
            color: var(--texto-primario, #e8d5a3);
            line-height: 1.2;
        }

        .pcm-kpi-sub {
            font-size: 11px;
            color: var(--texto-secundario, #a0916b);
            margin-top: 3px;
        }

        .pcm-kpi-meta {
            font-size: 11px;
            color: var(--texto-secundario, #a0916b);
            margin-top: 6px;
        }

        /* ── BARRAS ── */
        .pcm-barra-track {
            height: 8px;
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
            font-size: 11px;
            font-weight: 600;
            margin-top: 4px;
            text-align: right;
        }

        /* ── FLUJO DEL DÍA ── */
        .pcm-flujo-dia-bars {
            display: flex;
            height: 8px;
            border-radius: 6px;
            overflow: hidden;
            margin-top: 10px;
            gap: 2px;
        }

        .pcm-flujo-bar {
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 4px;
            transition: flex 0.4s ease;
        }

        .pcm-flujo-bar span { display: none; }

        .pcm-flujo-bar.ingreso { background: #10b981; }
        .pcm-flujo-bar.gasto   { background: #ef4444; }

        /* ── SALUD FINANCIERA ── */
        .pcm-salud-factores {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .pcm-salud-factor {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: var(--texto-secundario, #a0916b);
        }

        .pcm-salud-factor i { font-size: 13px; flex-shrink: 0; }

        /* ── TARJETAS GRID ── */
        .pcm-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
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

        .pcm-card-header i { color: #d4af37; font-size: 16px; }

        .pcm-card-header h3 {
            font-size: 14px;
            font-weight: 600;
            color: var(--texto-primario, #e8d5a3);
            margin: 0;
        }

        .pcm-card-body { padding: 18px; }

        .pcm-numero-grande {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .pcm-numero-sub {
            font-size: 13px;
            color: var(--texto-secundario, #a0916b);
            margin-bottom: 12px;
        }

        .pcm-sin-meta {
            font-size: 12px;
            color: var(--texto-secundario, #a0916b);
            margin-top: 8px;
        }

        .pcm-empty {
            font-size: 13px;
            color: var(--texto-secundario, #a0916b);
            text-align: center;
            padding: 20px 0;
        }

        /* ── TOP PRODUCTOS ── */
        .pcm-productos-lista { display: flex; flex-direction: column; gap: 12px; }

        .pcm-producto-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .pcm-producto-rank {
            width: 24px; height: 24px;
            background: rgba(212,175,55,0.15);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; font-weight: 700; color: #d4af37;
            flex-shrink: 0;
        }

        .pcm-producto-info { flex: 1; min-width: 0; }

        .pcm-producto-nombre {
            font-size: 13px; font-weight: 500;
            color: var(--texto-primario, #e8d5a3);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            margin-bottom: 4px;
        }

        .pcm-producto-barra {
            height: 5px; background: rgba(255,255,255,0.08);
            border-radius: 3px; overflow: hidden;
        }

        .pcm-producto-fill {
            height: 100%;
            background: linear-gradient(90deg, #d4af37, #10b981);
            border-radius: 3px;
        }

        .pcm-producto-datos {
            display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0;
        }

        .pcm-producto-monto { font-size: 13px; font-weight: 600; color: #10b981; }
        .pcm-producto-cant  { font-size: 11px; color: var(--texto-secundario, #a0916b); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
            .pcm-kpis-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
            .pcm-kpis-grid { grid-template-columns: 1fr; }
            .pcm-grid { grid-template-columns: 1fr; }
        }
        `;
        document.head.appendChild(style);
    }

    // ── INYECTAR EN EL DOM ────────────────────────────────────────
    function inyectarSeccion() {
        const existente = document.getElementById('pcm-seccion-metas');
        if (existente) { existente.outerHTML = renderSeccion(); return; }

        const ancla = document.querySelector('.panel-acciones');
        if (ancla) { ancla.insertAdjacentHTML('afterend', renderSeccion()); return; }

        const contenedor = document.querySelector('.panel-control-contenedor');
        if (contenedor) contenedor.insertAdjacentHTML('beforeend', renderSeccion());
    }

    window.pcmActualizar = function () {
        const existente = document.getElementById('pcm-seccion-metas');
        if (existente) existente.outerHTML = renderSeccion();
    };

    function inicializar() {
        inyectarCSS();
        inyectarSeccion();
        console.log('[PCM v2.0] ✅ Panel de Control mejorado cargado');
    }

    // ── OBSERVER ──────────────────────────────────────────────────
    const observer = new MutationObserver(() => {
        const panel = document.querySelector('.panel-acciones');
        const yaExiste = document.getElementById('pcm-seccion-metas');
        if (panel && !yaExiste) setTimeout(inicializar, 200);
    });

    observer.observe(document.getElementById('contenedorVistas') || document.body, {
        childList: true, subtree: true
    });

    document.addEventListener('grizalumConfigGuardada', window.pcmActualizar);
    document.addEventListener('grizalumTransaccionAgregada', window.pcmActualizar);
    document.addEventListener('grizalumCompanyChanged', () => setTimeout(window.pcmActualizar, 300));

    setTimeout(inicializar, 600);

})();
