/**
 * ═══════════════════════════════════════════════════════════════════
 * VENTAS - GRIZALUM Sistema Financiero
 * v20260510b — Selector inventario + descuento + conexión FC
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    if (window._ventasCargado) return;
    window._ventasCargado = true;

    let ventas = [];
    let filtroActual = { busqueda: '', estado: 'todos', periodo: 'mes' };

    function obtenerEmpresa() {
        try { return localStorage.getItem('grizalum_empresa_actual') || 'default'; }
        catch (e) { return 'default'; }
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
        } catch (e) {}
    }

    function generarId() {
        return 'vt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // ═══════════════════════════════════════════════════════════════
    // SELECTOR DE INVENTARIO
    // ═══════════════════════════════════════════════════════════════

    function cargarProductosInventario() {
        const select = document.getElementById('vtProductoSelector');
        if (!select) return;

        try {
            const empresa  = obtenerEmpresa();
            const productos = JSON.parse(localStorage.getItem(`grizalum_inventario_${empresa}`) || '[]');

            select.innerHTML = '<option value="">-- Seleccionar del inventario --</option>';
            productos.forEach(p => {
                const presentacion = p.cantPresentacion && p.unidadPresentacion
                    ? ` (${p.cantPresentacion} ${p.unidadPresentacion} por ${p.nombrePresentacion || 'unidad'})`
                    : '';
                const stock = `Stock: ${p.stockActual} ${p.nombrePresentacion || ''}`;
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = `${p.nombre}${presentacion} — ${stock} — S/ ${p.precioVenta}`;
                option.dataset.nombre   = p.nombre;
                option.dataset.precio   = p.precioVenta;
                option.dataset.stock    = p.stockActual;
                option.dataset.unidad   = p.nombrePresentacion || p.unidadPresentacion || '';
                select.appendChild(option);
            });
        } catch (e) {
            console.warn('[Ventas] No se pudo cargar inventario:', e);
        }
    }

    function seleccionarProducto(productoId) {
        if (!productoId) return;
        const select  = document.getElementById('vtProductoSelector');
        const option  = select?.querySelector(`option[value="${productoId}"]`);
        if (!option) return;

        setVal('vtProducto', option.dataset.nombre || '');
        setVal('vtPrecioUnitario', option.dataset.precio || '');
        actualizarTotal();
    }

    // ═══════════════════════════════════════════════════════════════
    // CÁLCULO DE TOTAL CON DESCUENTO
    // ═══════════════════════════════════════════════════════════════

    function calcularTotales() {
        const cantidad    = parseFloat(getVal('vtCantidad')) || 0;
        const precio      = parseFloat(getVal('vtPrecioUnitario')) || 0;
        const descuento   = parseFloat(getVal('vtDescuento')) || 0;
        const tipoDesc    = getVal('vtTipoDescuento') || 'porcentaje';
        const subtotal    = cantidad * precio;

        let montoDescuento = 0;
        if (tipoDesc === 'porcentaje') {
            montoDescuento = subtotal * (descuento / 100);
        } else {
            montoDescuento = descuento;
        }

        montoDescuento = Math.min(montoDescuento, subtotal);
        const total = subtotal - montoDescuento;

        return { subtotal, montoDescuento, total };
    }

    function actualizarTotal() {
        const { subtotal, montoDescuento, total } = calcularTotales();
        const fmt = (v) => 'S/ ' + v.toLocaleString('es-PE', { minimumFractionDigits: 2 });
        setText('vtSubtotalPreview', fmt(subtotal));
        setText('vtDescuentoPreview', fmt(montoDescuento));
        setText('vtTotalPreview', fmt(total));
    }

    // ═══════════════════════════════════════════════════════════════
    // CONEXIÓN CON INVENTARIO
    // ═══════════════════════════════════════════════════════════════

    function descontarInventario(nombreProducto, productoId, cantidad) {
        try {
            const empresa = obtenerEmpresa();
            const keyInv  = `grizalum_inventario_${empresa}`;
            const keyMov  = `grizalum_inventario_mov_${empresa}`;

            const productos   = JSON.parse(localStorage.getItem(keyInv) || '[]');
            const movimientos = JSON.parse(localStorage.getItem(keyMov) || '[]');

            // Buscar por ID primero, luego por nombre
            let idx = productoId ? productos.findIndex(p => p.id === productoId) : -1;
            if (idx === -1) {
                const nombre = nombreProducto.toLowerCase().trim();
                idx = productos.findIndex(p => p.nombre.toLowerCase().includes(nombre) || nombre.includes(p.nombre.toLowerCase()));
            }

            if (idx !== -1) {
                const producto = productos[idx];
                if (producto.stockActual >= cantidad) {
                    productos[idx].stockActual -= cantidad;
                    movimientos.push({
                        id: 'mov_' + Date.now(),
                        productoId: producto.id,
                        tipo: 'salida',
                        cantidad,
                        motivo: 'Venta registrada',
                        fecha: new Date().toISOString()
                    });
                    localStorage.setItem(keyInv, JSON.stringify(productos));
                    localStorage.setItem(keyMov, JSON.stringify(movimientos));
                    console.log(`✅ [Ventas→Inv] Descontado ${cantidad} de "${producto.nombre}". Restante: ${productos[idx].stockActual}`);
                    return { exito: true, producto: producto.nombre, stockRestante: productos[idx].stockActual };
                } else {
                    console.warn(`⚠️ Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stockActual}`);
                    return { exito: false, razon: 'stock_insuficiente', disponible: producto.stockActual };
                }
            }
            console.log(`ℹ️ Producto "${nombreProducto}" no en inventario — venta registrada sin descontar`);
            return { exito: false, razon: 'no_encontrado' };
        } catch (e) {
            return { exito: false, razon: 'error' };
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CONEXIÓN CON FLUJO DE CAJA
    // ═══════════════════════════════════════════════════════════════

    function registrarEnFlujoCaja(venta) {
        try {
            const empresa = obtenerEmpresa();
            const key     = `grizalum_flujo_caja_${empresa}`;
            const trans   = JSON.parse(localStorage.getItem(key) || '[]');

            trans.push({
                id:          'fc_' + Date.now(),
                tipo:        'ingreso',
                monto:       venta.total,
                descripcion: `Venta: ${venta.producto} — ${venta.cliente}`,
                categoria:   'Ventas',
                fecha:       venta.fecha,
                metodoPago:  venta.metodoPago,
                referencia:  venta.id,
                origen:      'ventas',
                createdAt:   new Date().toISOString()
            });

            localStorage.setItem(key, JSON.stringify(trans));
            console.log(`✅ [Ventas→FC] Ingreso S/ ${venta.total} registrado`);

            if (window.flujoCajaUI) {
                setTimeout(() => {
                    window.flujoCajaUI.cargarBalance?.();
                    window.flujoCajaUI.cargarTransacciones?.();
                }, 400);
            }
            return true;
        } catch (e) { return false; }
    }

    // ═══════════════════════════════════════════════════════════════
    // KPIs Y FILTROS
    // ═══════════════════════════════════════════════════════════════

    function ventasFiltradas() {
        const hoy = new Date();
        return ventas.filter(v => {
            const fecha = new Date(v.fecha);
            const busq  = filtroActual.busqueda.toLowerCase();
            const matchB = !busq || v.cliente.toLowerCase().includes(busq) || v.producto.toLowerCase().includes(busq);
            const matchE = filtroActual.estado === 'todos' || v.estado === filtroActual.estado;
            let matchP = true;
            if (filtroActual.periodo === 'hoy') {
                matchP = fecha.toDateString() === hoy.toDateString();
            } else if (filtroActual.periodo === 'semana') {
                const ini = new Date(hoy); ini.setDate(hoy.getDate() - hoy.getDay());
                matchP = fecha >= ini;
            } else if (filtroActual.periodo === 'mes') {
                matchP = fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
            }
            return matchB && matchE && matchP;
        });
    }

    function calcularKPIs() {
        const hoy = new Date();
        const mes = ventas.filter(v => {
            const f = new Date(v.fecha);
            return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
        });
        const totalMes   = mes.reduce((s, v) => s + v.total, 0);
        const cantVentas = mes.length;
        const ticketProm = cantVentas > 0 ? totalMes / cantVentas : 0;
        const pendientes = ventas.filter(v => v.estado !== 'pagado');
        const porCobrar  = pendientes.reduce((s, v) => s + v.total, 0);
        const clientes   = [...new Set(ventas.map(v => v.cliente.toLowerCase()))].length;
        return { totalMes, cantVentas, ticketProm, porCobrar, cantPendientes: pendientes.length, clientes };
    }

    function topClientes() {
        const hoy = new Date();
        const mes = ventas.filter(v => {
            const f = new Date(v.fecha);
            return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
        });
        const mapa = {};
        mes.forEach(v => {
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
        const k   = calcularKPIs();
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
            tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2rem;color:#64748b;">Sin ventas que coincidan</td></tr>`;
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
            const descTexto = v.montoDescuento > 0
                ? `<span style="color:#f59e0b;font-size:0.8rem;">-${fmt(v.montoDescuento)}</span>`
                : '<span style="color:#64748b;font-size:0.8rem;">—</span>';

            return `
                <tr>
                    <td style="color:#94a3b8;font-size:0.82rem;">${fecha}</td>
                    <td style="font-weight:600;color:#f1f5f9;">${v.cliente}</td>
                    <td>${v.producto}</td>
                    <td style="text-align:center;">${v.cantidad}</td>
                    <td>${fmt(v.precioUnitario)}</td>
                    <td>${descTexto}</td>
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
        if (top.length === 0) { container.innerHTML = '<div class="vt-clientes-vacio">Sin ventas este mes</div>'; return; }
        const rankClase = (i) => ['vt-rank-1','vt-rank-2','vt-rank-3'][i] || 'vt-rank-other';
        container.innerHTML = top.map((c, i) => `
            <div class="vt-cliente-item">
                <div class="vt-cliente-rank ${rankClase(i)}">${i + 1}</div>
                <div class="vt-cliente-info">
                    <div class="vt-cliente-nombre">${c.nombre}</div>
                    <div class="vt-cliente-ventas">${c.cant} venta${c.cant !== 1 ? 's' : ''}</div>
                </div>
                <div class="vt-cliente-total">${fmt(c.total)}</div>
            </div>`).join('');
    }

    function toggleEstadoVacio() {
        const vacio    = document.getElementById('vtEstadoVacio');
        const tabla    = document.querySelector('.vt-tabla-section');
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

        cargarProductosInventario();

        if (id) {
            const v = ventas.find(x => x.id === id);
            if (!v) return;
            setVal('vtFecha', v.fecha);
            setVal('vtCliente', v.cliente);
            setVal('vtProducto', v.producto);
            setVal('vtCantidad', v.cantidad);
            setVal('vtPrecioUnitario', v.precioUnitario);
            setVal('vtDescuento', v.descuento || 0);
            setVal('vtTipoDescuento', v.tipoDescuento || 'porcentaje');
            setVal('vtMetodoPago', v.metodoPago);
            setVal('vtEstado', v.estado);
            setVal('vtNotas', v.notas || '');
        } else {
            setVal('vtFecha', new Date().toISOString().split('T')[0]);
            setVal('vtCliente', '');
            setVal('vtProducto', '');
            setVal('vtCantidad', 1);
            setVal('vtPrecioUnitario', '');
            setVal('vtDescuento', 0);
            setVal('vtTipoDescuento', 'porcentaje');
            setVal('vtMetodoPago', 'efectivo');
            setVal('vtEstado', 'pagado');
            setVal('vtNotas', '');
            const sel = document.getElementById('vtProductoSelector');
            if (sel) sel.value = '';
        }

        actualizarTotal();
        modal.style.display = 'flex';
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

        if (!cliente)  { alert('El nombre del cliente es obligatorio.'); return; }
        if (!producto) { alert('El producto o servicio es obligatorio.'); return; }
        if (precio <= 0) { alert('El precio debe ser mayor a 0.'); return; }

        const { subtotal, montoDescuento, total } = calcularTotales();

        // Obtener ID del producto seleccionado del inventario
        const selector    = document.getElementById('vtProductoSelector');
        const productoId  = selector?.value || null;

        const datos = {
            cliente, producto, productoId,
            fecha:          getVal('vtFecha') || new Date().toISOString().split('T')[0],
            cantidad,
            precioUnitario: precio,
            descuento:      parseFloat(getVal('vtDescuento')) || 0,
            tipoDescuento:  getVal('vtTipoDescuento'),
            montoDescuento,
            subtotal,
            total,
            metodoPago:     getVal('vtMetodoPago'),
            estado:         getVal('vtEstado'),
            notas:          getVal('vtNotas').trim(),
            updatedAt:      new Date().toISOString(),
        };

        const esNueva = !id;

        if (id) {
            const idx = ventas.findIndex(v => v.id === id);
            if (idx !== -1) ventas[idx] = { ...ventas[idx], ...datos };
        } else {
            const nuevaVenta = { id: generarId(), createdAt: new Date().toISOString(), ...datos };
            ventas.push(nuevaVenta);

            if (esNueva) {
                // 1. Descontar inventario
                descontarInventario(producto, productoId, cantidad);

                // 2. Registrar en Flujo de Caja si pagado
                if (datos.estado === 'pagado') {
                    registrarEnFlujoCaja(nuevaVenta);
                }
            }
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
            registrarEnFlujoCaja(ventas[idx]);
            guardarDatos();
            renderizar();
        }
    }

    function filtrar() {
        filtroActual.busqueda = getVal('vtBusqueda') || '';
        filtroActual.estado   = getVal('vtFiltroEstado') || 'todos';
        filtroActual.periodo  = getVal('vtFiltroPeriodo') || 'mes';
        renderizarTabla();
    }

    function exportarExcel() {
        if (typeof XLSX === 'undefined') { alert('Módulo de exportación no disponible.'); return; }
        const fmt = (v) => parseFloat(v) || 0;
        const wb  = XLSX.utils.book_new();
        const datos = [
            ['REPORTE DE VENTAS - GRIZALUM'],
            ['Empresa:', obtenerEmpresa(), 'Fecha:', new Date().toLocaleDateString('es-PE')],
            [''],
            ['Fecha', 'Cliente', 'Producto', 'Cant.', 'Precio Unit.', 'Descuento', 'Total', 'Método Pago', 'Estado', 'Notas'],
            ...ventas.map(v => [
                new Date(v.fecha).toLocaleDateString('es-PE'),
                v.cliente, v.producto, fmt(v.cantidad),
                fmt(v.precioUnitario), fmt(v.montoDescuento), fmt(v.total),
                v.metodoPago, v.estado, v.notas || ''
            ]),
            [''],
            ['TOTAL', '', '', '', '', '', ventas.reduce((s, v) => s + fmt(v.total), 0)]
        ];
        const ws = XLSX.utils.aoa_to_sheet(datos);
        XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
        XLSX.writeFile(wb, `GRIZALUM_Ventas_${obtenerEmpresa()}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    function setText(id, t) { const el = document.getElementById(id); if (el) el.textContent = t; }
    function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
    function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v; }

    function inicializar() {
        cargarDatos();

        const btnNueva = document.getElementById('btnNuevaVenta');
        if (btnNueva) btnNueva.addEventListener('click', () => abrirModal(null));

        const btnExp = document.getElementById('btnExportarVentas');
        if (btnExp) btnExp.addEventListener('click', exportarExcel);

        document.addEventListener('grizalumCompanyChanged', () => { cargarDatos(); renderizar(); });

        renderizar();
        console.log('✅ [Ventas] Inicializado con', ventas.length, 'ventas');
    }

    window.Ventas = {
        filtrar, abrirModal, cerrarModal, guardarVenta,
        editarVenta, eliminarVenta, marcarPagado, exportarExcel,
        seleccionarProducto, actualizarTotal,
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

    console.log('✅ [GRIZALUM] Ventas v20260510b — Selector inventario + Descuento');

})();
