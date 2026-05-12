/**
 * ═══════════════════════════════════════════════════════════════════
 * REPORTES - GRIZALUM Sistema Financiero
 * Dashboard ejecutivo con datos cruzados
 * v20260512
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    if (window._reportesCargado) return;
    window._reportesCargado = true;

    // ═══════════════════════════════════════════════════════════════
    // DATOS
    // ═══════════════════════════════════════════════════════════════

    function obtenerEmpresa() {
        try { return localStorage.getItem('grizalum_empresa_actual') || 'default'; }
        catch (e) { return 'default'; }
    }

    function obtenerDatos() {
        const empresa = obtenerEmpresa();
        try {
            return {
                ventas:      JSON.parse(localStorage.getItem(`grizalum_ventas_${empresa}`) || '[]'),
                flujoCaja:   JSON.parse(localStorage.getItem(`grizalum_flujo_caja_${empresa}`) || '[]'),
                inventario:  JSON.parse(localStorage.getItem(`grizalum_inventario_${empresa}`) || '[]'),
            };
        } catch (e) { return { ventas: [], flujoCaja: [], inventario: [] }; }
    }

    // ═══════════════════════════════════════════════════════════════
    // FILTRO DE PERÍODO
    // ═══════════════════════════════════════════════════════════════

    function filtrarPorPeriodo(lista, campoFecha) {
        const periodo = getVal('rpPeriodo') || 'mes';
        const hoy = new Date();

        return lista.filter(item => {
            const fecha = new Date(item[campoFecha] || item.fecha || item.createdAt);
            if (periodo === 'hoy') return fecha.toDateString() === hoy.toDateString();
            if (periodo === 'semana') {
                const ini = new Date(hoy); ini.setDate(hoy.getDate() - hoy.getDay());
                return fecha >= ini;
            }
            if (periodo === 'mes') {
                return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
            }
            return true; // todos
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDERIZADO PRINCIPAL
    // ═══════════════════════════════════════════════════════════════

    function actualizar() {
        const { ventas, flujoCaja, inventario } = obtenerDatos();

        const ventasPeriodo = filtrarPorPeriodo(ventas, 'fecha');
        const fcPeriodo     = filtrarPorPeriodo(flujoCaja, 'fecha');

        renderizarKPIs(ventasPeriodo, fcPeriodo, inventario);
        renderizarTopProductos(ventasPeriodo);
        renderizarTopClientes(ventasPeriodo);
        renderizarTransacciones(fcPeriodo);
        renderizarAlertasStock(inventario);
        renderizarTablaVentas(ventasPeriodo);
    }

    // ═══════════════════════════════════════════════════════════════
    // KPIs
    // ═══════════════════════════════════════════════════════════════

    function renderizarKPIs(ventas, fc, inventario) {
        const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

        // Ventas
        const totalVentas = ventas.reduce((s, v) => s + (v.total || 0), 0);
        setText('rpTotalVentas', fmt(totalVentas));
        setText('rpCantVentas', ventas.length + ' ventas');

        // Gastos del FC
        const gastos = fc.filter(t => t.tipo === 'gasto' || t.tipo === 'egreso');
        const totalGastos = gastos.reduce((s, t) => s + (t.monto || 0), 0);
        setText('rpTotalGastos', fmt(totalGastos));
        setText('rpCantGastos', gastos.length + ' gastos');

        // Utilidad
        const utilidad = totalVentas - totalGastos;
        const margen = totalVentas > 0 ? ((utilidad / totalVentas) * 100).toFixed(1) : 0;
        const elUtilidad = document.getElementById('rpUtilidad');
        if (elUtilidad) {
            elUtilidad.textContent = fmt(utilidad);
            elUtilidad.style.color = utilidad >= 0 ? '#10b981' : '#ef4444';
        }
        setText('rpMargen', margen + '% margen');

        // Inventario
        const valorInv = inventario.reduce((s, p) => s + ((p.stockActual || 0) * (p.costoUnitario || 0)), 0);
        setText('rpValorInventario', fmt(valorInv));
        setText('rpProductosInv', inventario.length + ' productos');
    }

    // ═══════════════════════════════════════════════════════════════
    // TOP PRODUCTOS
    // ═══════════════════════════════════════════════════════════════

    function renderizarTopProductos(ventas) {
        const container = document.getElementById('rpTopProductos');
        if (!container) return;

        const mapa = {};
        ventas.forEach(v => {
            const key = v.producto?.toLowerCase() || 'sin nombre';
            if (!mapa[key]) mapa[key] = { nombre: v.producto, total: 0, cant: 0, unidades: 0 };
            mapa[key].total += v.total || 0;
            mapa[key].cant++;
            mapa[key].unidades += v.cantidad || 0;
        });

        const top = Object.values(mapa).sort((a, b) => b.total - a.total).slice(0, 5);
        const fmt = (v) => 'S/ ' + v.toLocaleString('es-PE', { minimumFractionDigits: 2 });
        const rankClase = (i) => ['rp-rank-1','rp-rank-2','rp-rank-3'][i] || 'rp-rank-other';

        if (top.length === 0) {
            container.innerHTML = '<div class="rp-vacio">Sin ventas en este período</div>';
            return;
        }

        container.innerHTML = top.map((p, i) => `
            <div class="rp-item">
                <div class="rp-item-rank ${rankClase(i)}">${i + 1}</div>
                <div class="rp-item-info">
                    <div class="rp-item-nombre">${p.nombre}</div>
                    <div class="rp-item-detalle">${p.cant} venta${p.cant !== 1 ? 's' : ''} — ${p.unidades} unidades</div>
                </div>
                <div class="rp-item-valor" style="color:#10b981;">${fmt(p.total)}</div>
            </div>
        `).join('');
    }

    // ═══════════════════════════════════════════════════════════════
    // TOP CLIENTES
    // ═══════════════════════════════════════════════════════════════

    function renderizarTopClientes(ventas) {
        const container = document.getElementById('rpTopClientes');
        if (!container) return;

        const mapa = {};
        ventas.forEach(v => {
            const key = v.cliente?.toLowerCase() || 'sin nombre';
            if (!mapa[key]) mapa[key] = { nombre: v.cliente, total: 0, cant: 0 };
            mapa[key].total += v.total || 0;
            mapa[key].cant++;
        });

        const top = Object.values(mapa).sort((a, b) => b.total - a.total).slice(0, 5);
        const fmt = (v) => 'S/ ' + v.toLocaleString('es-PE', { minimumFractionDigits: 2 });
        const rankClase = (i) => ['rp-rank-1','rp-rank-2','rp-rank-3'][i] || 'rp-rank-other';

        if (top.length === 0) {
            container.innerHTML = '<div class="rp-vacio">Sin clientes en este período</div>';
            return;
        }

        container.innerHTML = top.map((c, i) => `
            <div class="rp-item">
                <div class="rp-item-rank ${rankClase(i)}">${i + 1}</div>
                <div class="rp-item-info">
                    <div class="rp-item-nombre">${c.nombre}</div>
                    <div class="rp-item-detalle">${c.cant} compra${c.cant !== 1 ? 's' : ''}</div>
                </div>
                <div class="rp-item-valor" style="color:#3b82f6;">${fmt(c.total)}</div>
            </div>
        `).join('');
    }

    // ═══════════════════════════════════════════════════════════════
    // TRANSACCIONES
    // ═══════════════════════════════════════════════════════════════

    function renderizarTransacciones(fc) {
        const container = document.getElementById('rpTransacciones');
        if (!container) return;

        const ultimas = [...fc].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 8);
        const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

        if (ultimas.length === 0) {
            container.innerHTML = '<div class="rp-vacio">Sin transacciones en este período</div>';
            return;
        }

        container.innerHTML = ultimas.map(t => {
            const esIngreso = t.tipo === 'ingreso';
            const fecha = new Date(t.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
            return `
                <div class="rp-item">
                    <div class="rp-tx-icono ${esIngreso ? 'rp-tx-ingreso' : 'rp-tx-gasto'}">
                        <i class="fas fa-arrow-${esIngreso ? 'up' : 'down'}"></i>
                    </div>
                    <div class="rp-item-info">
                        <div class="rp-item-nombre">${t.descripcion || t.categoria || t.tipo}</div>
                        <div class="rp-item-detalle">${fecha}</div>
                    </div>
                    <div class="rp-item-valor" style="color:${esIngreso ? '#10b981' : '#ef4444'};">
                        ${esIngreso ? '+' : '-'}${fmt(t.monto)}
                    </div>
                </div>
            `;
        }).join('');
    }

    // ═══════════════════════════════════════════════════════════════
    // ALERTAS DE STOCK
    // ═══════════════════════════════════════════════════════════════

    function renderizarAlertasStock(inventario) {
        const container = document.getElementById('rpAlertasStock');
        if (!container) return;

        const alertas = inventario.filter(p => {
            if (p.stockActual <= 0) return true;
            if (p.stockMinimo > 0 && p.stockActual <= p.stockMinimo) return true;
            return false;
        });

        if (alertas.length === 0) {
            container.innerHTML = '<div class="rp-vacio" style="color:#10b981;">✅ Todo el stock está en niveles correctos</div>';
            return;
        }

        container.innerHTML = alertas.map(p => {
            const agotado = p.stockActual <= 0;
            const unidad = p.nombrePresentacion || p.unidad || '';
            return `
                <div class="rp-item rp-item-alerta">
                    <div class="rp-tx-icono" style="background:rgba(245,158,11,0.15);color:#f59e0b;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="rp-item-info">
                        <div class="rp-item-nombre">${p.nombre}</div>
                        <div class="rp-item-detalle">
                            ${agotado ? '❌ Agotado' : `⚠️ Stock bajo: ${p.stockActual} ${unidad} (mín: ${p.stockMinimo})`}
                        </div>
                    </div>
                    <div class="rp-item-valor" style="color:${agotado ? '#ef4444' : '#f59e0b'};">
                        ${agotado ? 'AGOTADO' : 'BAJO'}
                    </div>
                </div>
            `;
        }).join('');
    }

    // ═══════════════════════════════════════════════════════════════
    // TABLA DE VENTAS
    // ═══════════════════════════════════════════════════════════════

    function renderizarTablaVentas(ventas) {
        const tbody    = document.getElementById('rpTablaVentas');
        const contador = document.getElementById('rpContadorVentas');
        if (!tbody) return;

        const lista = [...ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        if (contador) contador.textContent = lista.length + ' ventas';

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#64748b;">Sin ventas en este período</td></tr>`;
            return;
        }

        const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });
        const pagoLabels = { efectivo: '💵 Efectivo', transferencia: '🏦 Transf.', yape: '📱 Yape', tarjeta: '💳 Tarjeta', credito: '📋 Crédito' };
        const estadoBadge = {
            pagado:    '<span class="rp-badge rp-badge-pagado">✅ Pagado</span>',
            pendiente: '<span class="rp-badge rp-badge-pendiente">⏳ Pendiente</span>',
            parcial:   '<span class="rp-badge rp-badge-parcial">⚠️ Parcial</span>',
        };

        tbody.innerHTML = lista.map(v => {
            const fecha = new Date(v.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
            const descTexto = v.montoDescuento > 0 ? fmt(v.montoDescuento) : '—';
            return `
                <tr>
                    <td style="color:#94a3b8;font-size:0.82rem;">${fecha}</td>
                    <td style="font-weight:600;color:#f1f5f9;">${v.cliente}</td>
                    <td>${v.producto}</td>
                    <td style="text-align:center;">${v.cantidad}</td>
                    <td style="color:#f59e0b;">${descTexto}</td>
                    <td style="font-weight:700;color:#10b981;">${fmt(v.total)}</td>
                    <td style="font-size:0.82rem;">${pagoLabels[v.metodoPago] || v.metodoPago}</td>
                    <td>${estadoBadge[v.estado] || v.estado}</td>
                </tr>
            `;
        }).join('');
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORTAR EXCEL
    // ═══════════════════════════════════════════════════════════════

    function exportarExcel() {
        if (typeof XLSX === 'undefined') { alert('Módulo de exportación no disponible.'); return; }

        const { ventas, flujoCaja, inventario } = obtenerDatos();
        const ventasPeriodo = filtrarPorPeriodo(ventas, 'fecha');
        const fcPeriodo     = filtrarPorPeriodo(flujoCaja, 'fecha');
        const fmt = (v) => parseFloat(v) || 0;
        const wb  = XLSX.utils.book_new();
        const periodo = getVal('rpPeriodo') || 'mes';

        // Hoja 1: Resumen
        const totalVentas = ventasPeriodo.reduce((s, v) => s + fmt(v.total), 0);
        const totalGastos = fcPeriodo.filter(t => t.tipo === 'gasto' || t.tipo === 'egreso').reduce((s, t) => s + fmt(t.monto), 0);
        const valorInv    = inventario.reduce((s, p) => s + (fmt(p.stockActual) * fmt(p.costoUnitario)), 0);

        const resumen = [
            ['REPORTE EJECUTIVO - GRIZALUM'],
            ['Empresa:', obtenerEmpresa(), 'Período:', periodo, 'Fecha:', new Date().toLocaleDateString('es-PE')],
            [''],
            ['RESUMEN FINANCIERO'],
            ['Total Ventas', totalVentas],
            ['Total Gastos', totalGastos],
            ['Utilidad Neta', totalVentas - totalGastos],
            ['Margen %', totalVentas > 0 ? (((totalVentas - totalGastos) / totalVentas) * 100).toFixed(1) + '%' : '0%'],
            ['Valor Inventario', valorInv],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumen), 'Resumen');

        // Hoja 2: Ventas
        const datosVentas = [
            ['Fecha', 'Cliente', 'Producto', 'Cantidad', 'Precio Unit.', 'Descuento', 'Total', 'Método', 'Estado'],
            ...ventasPeriodo.map(v => [
                new Date(v.fecha).toLocaleDateString('es-PE'),
                v.cliente, v.producto, fmt(v.cantidad),
                fmt(v.precioUnitario), fmt(v.montoDescuento), fmt(v.total),
                v.metodoPago, v.estado
            ])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosVentas), 'Ventas');

        // Hoja 3: Inventario
        const datosInv = [
            ['Producto', 'Categoría', 'Stock', 'Mínimo', 'Costo Unit.', 'Precio Venta', 'Valor Total', 'Estado'],
            ...inventario.map(p => [
                p.nombre, p.categoria, fmt(p.stockActual), fmt(p.stockMinimo),
                fmt(p.costoUnitario), fmt(p.precioVenta),
                fmt(p.stockActual * p.costoUnitario),
                p.stockActual <= 0 ? 'Agotado' : p.stockActual <= p.stockMinimo ? 'Stock Bajo' : 'Disponible'
            ])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosInv), 'Inventario');

        XLSX.writeFile(wb, `GRIZALUM_Reporte_${obtenerEmpresa()}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    // ═══════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════

    function setText(id, t) { const el = document.getElementById(id); if (el) el.textContent = t; }
    function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }

    // ═══════════════════════════════════════════════════════════════
    // INICIALIZACIÓN
    // ═══════════════════════════════════════════════════════════════

    function inicializar() {
        const btnExp = document.getElementById('btnExportarReporte');
        if (btnExp) btnExp.addEventListener('click', exportarExcel);

        document.addEventListener('grizalumCompanyChanged', () => actualizar());

        actualizar();
        console.log('✅ [Reportes] Inicializado');
    }

    window.Reportes = { actualizar, exportarExcel };

    window.inicializarReportes = function () {
        window._reportesCargado = false;
        inicializar();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        setTimeout(inicializar, 100);
    }

    console.log('✅ [GRIZALUM] Reportes v20260512b cargado');

})();
