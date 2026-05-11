/**
 * ═══════════════════════════════════════════════════════════════════
 * VENTAS - GRIZALUM Sistema Financiero
 * Control profesional de ventas para empresarios
 * v20260510
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    if (window._ventasCargado) {
        console.log('⚠️ [Ventas] Ya cargado, omitiendo...');
        return;
    }
    window._ventasCargado = true;

    // ═══════════════════════════════════════════════════════════════
    // DATOS
    // ═══════════════════════════════════════════════════════════════

    let ventas = [];
    let filtroActual = { busqueda: '', estado: 'todos', periodo: 'mes' };

    function obtenerEmpresa() {
        try {
            return localStorage.getItem('grizalum_empresa_actual') || 'default';
        } catch (e) { return 'default'; }
    }

    function cargarDatos() {
        try {
            const data = localStorage.getItem(`grizalum_ventas_${obtenerEmpresa()}`);
            ventas = data ? JSON.parse(data) : [];
        } catch (e) { ventas = []; }
    }

    function guardarDatos() {
        try {
            localStorage.setItem(`grizalum_ventas_${obtenerEmpresa()}`, JSON.stringify(ventas));
        } catch (e) { console.warn('[Ventas] Error al guardar:', e); }
    }

    function generarId() {
        return 'vt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // ═══════════════════════════════════════════════════════════════
    // FILTROS Y CÁLCULOS
    // ═══════════════════════════════════════════════════════════════

    function ventasFiltradas() {
        const hoy = new Date();
        return ventas.filter(v => {
            const fecha = new Date(v.fecha);
            const busq  = filtroActual.busqueda.toLowerCase();

            const matchBusqueda = !busq ||
                v.cliente.toLowerCase().includes(busq) ||
                v.producto.toLowerCase().includes(busq);

            const matchEstado = filtroActual.estado === 'todos' || v.estado === filtroActual.estado;

            let matchPeriodo = true;
            if (filtroActual.periodo === 'hoy') {
                matchPeriodo = fecha.toDateString() === hoy.toDateString();
            } else if (filtroActual.periodo === 'semana') {
                const inicio = new Date(hoy); inicio.setDate(hoy.getDate() - hoy.getDay());
                matchPeriodo = fecha >= inicio;
            } else if (filtroActual.periodo === 'mes') {
                matchPeriodo = fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
            }

            return matchBusqueda && matchEstado && matchPeriodo;
        });
    }

    function calcularKPIs() {
        const hoy  = new Date();
        const mes  = ventas.filter(v => {
            const f = new Date(v.fecha);
            return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
        });

        const totalMes     = mes.reduce((s, v) => s + v.total, 0);
        const cantVentas   = mes.length;
        const ticketProm   = cantVentas > 0 ? totalMes / cantVentas : 0;
        const pendientes   = ventas.filter(v => v.estado !== 'pagado');
        const porCobrar    = pendientes.reduce((s, v) => s + v.total, 0);
        const clientes     = [...new Set(ventas.map(v => v.cliente.toLowerCase()))].length;

        return { totalMes, cantVentas, ticketProm, porCobrar, cantPendientes: pendientes.length, clientes };
    }

    function topClientes() {
        const hoy = new Date();
        const mesVentas = ventas.filter(v => {
            const f = new Date(v.fecha);
            return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
        });

        const mapa = {};
        mesVentas.forEach(v => {
            const key = v.cliente.toLowerCase();
            if (!mapa[key]) mapa[key] = { nombre: v.cliente, total: 0, cant: 0 };
            mapa[key].total += v.total;
            mapa[key].cant++;
        });

        return Object.values(mapa).sort((a, b) => b.total - a.total).slice(0, 5);
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDERIZADO
    // ═══════════════════════════════════════════════════════════════

    function renderizar() {
        actualizarKPIs();
        renderizarTabla();
        renderizarTopClientes();
        toggleEstadoVacio();
    }

    function actualizarKPIs() {
        const k = calcularKPIs();
        const fmt = (v) => 'S/ ' + v.toLocaleString('es-PE', { minimumFractionDigits: 2 });

        setText('vtVentasMes', fmt(k.totalMes));
        setText('vtCantVentas', k.cantVentas + ' ventas registradas');
        setText('vtTicketPromedio', fmt(k.ticketProm));
        setText('vtPorCobrar', fmt(k.porCobrar));
        setText('vtCantPendientes', k.cantPendientes + ' pendientes');
        setText('vtTotalClientes', k.clientes);
    }

    function renderizarTabla() {
        const tbody    = document.getElementById('vtTablaCuerpo');
        const contador = document.getElementById('vtContador');
        if (!tbody) return;

        const lista = ventasFiltradas().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        if (contador) contador.textContent = lista.length + ' ventas';

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2rem;color:#64748b;">Sin ventas que coincidan</td></tr>`;
            return;
        }

        const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });
        const pagoLabels = { efectivo: '💵 Efectivo', transferencia: '🏦 Transferencia', yape: '📱 Yape', tarjeta: '💳 Tarjeta', credito: '📋 Crédito' };
        const estadoBadge = {
            pagado:    '<span class="vt-badge vt-badge-pagado">✅ Pagado</span>',
            pendiente: '<span class="vt-badge vt-badge-pendiente">⏳ Pendiente</span>',
            parcial:   '<span class="vt-badge vt-badge-parcial">⚠️ Parcial</span>',
        };

        tbody.innerHTML = lista.map(v => {
            const fecha = new Date(v.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
            return `
                <tr>
                    <td style="color:#94a3b8;font-size:0.82rem;">${fecha}</td>
                    <td style="font-weight:600;color:#f1f5f9;">${v.cliente}</td>
                    <td>${v.producto}</td>
                    <td style="text-align:center;">${v.cantidad}</td>
                    <td>${fmt(v.precioUnitario)}</td>
                    <td style="font-weight:700;color:#10b981;">${fmt(v.total)}</td>
                    <td style="font-size:0.82rem;">${pagoLabels[v.metodoPago] || v.metodoPago}</td>
                    <td>${estadoBadge[v.estado] || v.estado}</td>
                    <td>
                        <div class="vt-tabla-acciones">
                            ${v.estado !== 'pagado' ? `<button class="vt-btn-icono vt-btn-pagar" onclick="window.Ventas.marcarPagado('${v.id}')" title="Marcar pagado"><i class="fas fa-check"></i></button>` : ''}
                            <button class="vt-btn-icono vt-btn-editar" onclick="window.Ventas.editarVenta('${v.id}')" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="vt-btn-icono vt-btn-eliminar" onclick="window.Ventas.eliminarVenta('${v.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    }

    function renderizarTopClientes() {
        const container = document.getElementById('vtTopClientes');
        if (!container) return;

        const top = topClientes();
        const fmt = (v) => 'S/ ' + v.toLocaleString('es-PE', { minimumFractionDigits: 2 });

        if (top.length === 0) {
            container.innerHTML = '<div class="vt-clientes-vacio">Sin ventas este mes</div>';
            return;
        }

        const rankClase = (i) => ['vt-rank-1','vt-rank-2','vt-rank-3'][i] || 'vt-rank-other';

        container.innerHTML = top.map((c, i) => `
            <div class="vt-cliente-item">
                <div class="vt-cliente-rank ${rankClase(i)}">${i + 1}</div>
                <div class="vt-cliente-info">
                    <div class="vt-cliente-nombre">${c.nombre}</div>
                    <div class="vt-cliente-ventas">${c.cant} venta${c.cant !== 1 ? 's' : ''}</div>
                </div>
                <div class="vt-cliente-total">${fmt(c.total)}</div>
            </div>
        `).join('');
    }

    function toggleEstadoVacio() {
        const vacio = document.getElementById('vtEstadoVacio');
        const tabla = document.querySelector('.vt-tabla-section');
        const clientes = document.querySelector('.vt-clientes-section');
        if (!vacio) return;

        const sinDatos = ventas.length === 0;
        vacio.style.display    = sinDatos ? 'flex' : 'none';
        if (tabla)    tabla.style.display    = sinDatos ? 'none' : 'block';
        if (clientes) clientes.style.display = sinDatos ? 'none' : 'block';
    }

    // ═══════════════════════════════════════════════════════════════
    // MODAL
    // ═══════════════════════════════════════════════════════════════

    function abrirModal(id) {
        const modal = document.getElementById('vtModal');
        if (!modal) return;

        document.getElementById('vtModalId').value = id || '';
        setText('vtModalTitulo', id ? '✏️ Editar Venta' : '➕ Nueva Venta');

        if (id) {
            const v = ventas.find(x => x.id === id);
            if (!v) return;
            setVal('vtFecha', v.fecha);
            setVal('vtCliente', v.cliente);
            setVal('vtProducto', v.producto);
            setVal('vtCantidad', v.cantidad);
            setVal('vtPrecioUnitario', v.precioUnitario);
            setVal('vtMetodoPago', v.metodoPago);
            setVal('vtEstado', v.estado);
            setVal('vtNotas', v.notas || '');
        } else {
            setVal('vtFecha', new Date().toISOString().split('T')[0]);
            setVal('vtCliente', '');
            setVal('vtProducto', '');
            setVal('vtCantidad', 1);
            setVal('vtPrecioUnitario', '');
            setVal('vtMetodoPago', 'efectivo');
            setVal('vtEstado', 'pagado');
            setVal('vtNotas', '');
        }

        actualizarTotalPreview();
        modal.style.display = 'flex';

        // Actualizar total al cambiar cantidad o precio
        ['vtCantidad', 'vtPrecioUnitario'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.oninput = actualizarTotalPreview;
        });
    }

    function actualizarTotalPreview() {
        const cant   = parseFloat(getVal('vtCantidad')) || 0;
        const precio = parseFloat(getVal('vtPrecioUnitario')) || 0;
        const total  = cant * precio;
        setText('vtTotalPreview', 'S/ ' + total.toLocaleString('es-PE', { minimumFractionDigits: 2 }));
    }

    function cerrarModal() {
        const modal = document.getElementById('vtModal');
        if (modal) modal.style.display = 'none';
    }

    function guardarVenta() {
        const id       = getVal('vtModalId');
        const cliente  = getVal('vtCliente').trim();
        const producto = getVal('vtProducto').trim();
        const precio   = parseFloat(getVal('vtPrecioUnitario')) || 0;
        const cantidad = parseFloat(getVal('vtCantidad')) || 1;

        if (!cliente) { alert('El nombre del cliente es obligatorio.'); return; }
        if (!producto) { alert('El producto o servicio es obligatorio.'); return; }
        if (precio <= 0) { alert('El precio debe ser mayor a 0.'); return; }

        const datos = {
            cliente, producto,
            fecha:         getVal('vtFecha') || new Date().toISOString().split('T')[0],
            cantidad,
            precioUnitario: precio,
            total:         cantidad * precio,
            metodoPago:    getVal('vtMetodoPago'),
            estado:        getVal('vtEstado'),
            notas:         getVal('vtNotas').trim(),
            updatedAt:     new Date().toISOString(),
        };

        if (id) {
            const idx = ventas.findIndex(v => v.id === id);
            if (idx !== -1) ventas[idx] = { ...ventas[idx], ...datos };
        } else {
            ventas.push({ id: generarId(), createdAt: new Date().toISOString(), ...datos });
        }

        guardarDatos();
        cerrarModal();
        renderizar();
    }

    function editarVenta(id) { abrirModal(id); }

    function eliminarVenta(id) {
        const v = ventas.find(x => x.id === id);
        if (!v || !confirm(`¿Eliminar venta a "${v.cliente}"?`)) return;
        ventas = ventas.filter(x => x.id !== id);
        guardarDatos();
        renderizar();
    }

    function marcarPagado(id) {
        const idx = ventas.findIndex(v => v.id === id);
        if (idx !== -1) {
            ventas[idx].estado = 'pagado';
            guardarDatos();
            renderizar();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // FILTRAR
    // ═══════════════════════════════════════════════════════════════

    function filtrar() {
        filtroActual.busqueda = getVal('vtBusqueda') || '';
        filtroActual.estado   = getVal('vtFiltroEstado') || 'todos';
        filtroActual.periodo  = getVal('vtFiltroPeriodo') || 'mes';
        renderizarTabla();
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORTAR
    // ═══════════════════════════════════════════════════════════════

    function exportarExcel() {
        if (typeof XLSX === 'undefined') { alert('Módulo de exportación no disponible.'); return; }

        const fmt = (v) => parseFloat(v) || 0;
        const wb  = XLSX.utils.book_new();

        const datos = [
            ['REPORTE DE VENTAS - GRIZALUM', '', '', '', '', '', '', '', ''],
            ['Empresa:', obtenerEmpresa(), '', 'Fecha:', new Date().toLocaleDateString('es-PE'), '', '', '', ''],
            [''],
            ['Fecha', 'Cliente', 'Producto/Servicio', 'Cantidad', 'Precio Unit.', 'Total', 'Método Pago', 'Estado', 'Notas'],
            ...ventas.map(v => [
                new Date(v.fecha).toLocaleDateString('es-PE'),
                v.cliente, v.producto,
                fmt(v.cantidad), fmt(v.precioUnitario), fmt(v.total),
                v.metodoPago, v.estado, v.notas || ''
            ]),
            [''],
            ['TOTAL VENTAS', '', '', '', '', ventas.reduce((s, v) => s + fmt(v.total), 0)]
        ];

        const ws = XLSX.utils.aoa_to_sheet(datos);
        XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
        XLSX.writeFile(wb, `GRIZALUM_Ventas_${obtenerEmpresa()}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    // ═══════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════

    function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
    function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
    function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }

    // ═══════════════════════════════════════════════════════════════
    // INICIALIZACIÓN
    // ═══════════════════════════════════════════════════════════════

    function inicializar() {
        cargarDatos();

        const btnNueva = document.getElementById('btnNuevaVenta');
        if (btnNueva) btnNueva.addEventListener('click', () => abrirModal(null));

        const btnExportar = document.getElementById('btnExportarVentas');
        if (btnExportar) btnExportar.addEventListener('click', exportarExcel);

        document.addEventListener('grizalumCompanyChanged', () => {
            cargarDatos();
            renderizar();
        });

        renderizar();
        console.log('✅ [Ventas] Inicializado con', ventas.length, 'ventas');
    }

    // ═══════════════════════════════════════════════════════════════
    // API PÚBLICA
    // ═══════════════════════════════════════════════════════════════

    window.Ventas = {
        filtrar, abrirModal, cerrarModal,
        guardarVenta, editarVenta, eliminarVenta,
        marcarPagado, exportarExcel,
    };

    window.inicializarVentas = function () {
        window._ventasCargado = false;
        inicializar();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        setTimeout(inicializar, 100);
    }

    console.log('✅ [GRIZALUM] Ventas v20260510 cargado');

})();
