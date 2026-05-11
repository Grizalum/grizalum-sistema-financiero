/**
 * ═══════════════════════════════════════════════════════════════════
 * INVENTARIO - GRIZALUM Sistema Financiero
 * v20260510b — Con presentación/unidad específica
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    if (window._inventarioCargado) return;
    window._inventarioCargado = true;

    let productos = [];
    let movimientos = [];
    let filtroActual = { busqueda: '', categoria: 'todos', estado: 'todos' };

    function obtenerEmpresa() {
        try { return localStorage.getItem('grizalum_empresa_actual') || 'default'; }
        catch (e) { return 'default'; }
    }

    function cargarDatos() {
        try {
            const empresa = obtenerEmpresa();
            productos   = JSON.parse(localStorage.getItem(`grizalum_inventario_${empresa}`) || '[]');
            movimientos = JSON.parse(localStorage.getItem(`grizalum_inventario_mov_${empresa}`) || '[]');
        } catch (e) { productos = []; movimientos = []; }
    }

    function guardarDatos() {
        try {
            const empresa = obtenerEmpresa();
            localStorage.setItem(`grizalum_inventario_${empresa}`, JSON.stringify(productos));
            localStorage.setItem(`grizalum_inventario_mov_${empresa}`, JSON.stringify(movimientos));
        } catch (e) {}
    }

    function generarId() {
        return 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // ── Presentación legible ──────────────────────────────────────
    function textoPresentacion(p) {
        if (p.cantPresentacion && p.unidadPresentacion && p.nombrePresentacion) {
            return `${p.cantPresentacion} ${p.unidadPresentacion} por ${p.nombrePresentacion}`;
        }
        if (p.cantPresentacion && p.unidadPresentacion) {
            return `${p.cantPresentacion} ${p.unidadPresentacion}`;
        }
        return p.unidad || '—';
    }

    // ── Estado ────────────────────────────────────────────────────
    function calcularEstado(p) {
        if (p.stockActual <= 0) return 'agotado';
        if (p.stockActual <= p.stockMinimo) return 'bajo';
        return 'disponible';
    }

    function calcularKPIs() {
        const totalProductos = productos.length;
        const valorTotal     = productos.reduce((s, p) => s + (p.stockActual * p.costoUnitario), 0);
        const stockBajo      = productos.filter(p => calcularEstado(p) !== 'disponible').length;
        const hoy            = new Date();
        const movMes         = movimientos.filter(m => {
            const f = new Date(m.fecha);
            return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
        }).length;
        return { totalProductos, valorTotal, stockBajo, rotacion: movMes };
    }

    // ── Renderizado ───────────────────────────────────────────────
    function renderizar() {
        actualizarKPIs();
        renderizarTabla();
        renderizarMovimientos();
        toggleEstadoVacio();
    }

    function actualizarKPIs() {
        const kpis = calcularKPIs();
        const fmt  = (v) => 'S/ ' + v.toLocaleString('es-PE', { minimumFractionDigits: 2 });
        setText('invTotalProductos', kpis.totalProductos);
        setText('invTotalSku', kpis.totalProductos + ' referencias');
        setText('invValorTotal', fmt(kpis.valorTotal));
        setText('invStockBajo', kpis.stockBajo);
        setText('invRotacion', kpis.rotacion + 'x');

        const alerta = document.getElementById('invAlertaStock');
        if (alerta) {
            alerta.style.display = kpis.stockBajo > 0 ? 'flex' : 'none';
            setText('invAlertaTexto', `⚠️ ${kpis.stockBajo} producto(s) necesitan reorden`);
        }
    }

    function productosFiltrados() {
        return productos.filter(p => {
            const estado = calcularEstado(p);
            const busq   = filtroActual.busqueda.toLowerCase();
            const matchB = !busq || p.nombre.toLowerCase().includes(busq) || (p.proveedor || '').toLowerCase().includes(busq);
            const matchC = filtroActual.categoria === 'todos'
                ? true
                : filtroActual.categoria === 'alerta'
                    ? estado !== 'disponible'
                    : p.categoria === filtroActual.categoria;
            const matchE = filtroActual.estado === 'todos' || estado === filtroActual.estado;
            return matchB && matchC && matchE;
        });
    }

    function renderizarTabla() {
        const tbody    = document.getElementById('invTablaCuerpo');
        const contador = document.getElementById('invContadorFiltrado');
        if (!tbody) return;

        const lista = productosFiltrados();
        if (contador) contador.textContent = lista.length + ' productos';

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2rem;color:#64748b;">Sin productos que coincidan</td></tr>`;
            return;
        }

        const catLabels = { 'materia-prima': 'Materia Prima', 'producto-terminado': 'Prod. Terminado', 'herramienta': 'Herramienta' };
        const catClases = { 'materia-prima': 'inv-cat-mp', 'producto-terminado': 'inv-cat-pt', 'herramienta': 'inv-cat-ht' };
        const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

        tbody.innerHTML = lista.map(p => {
            const estado = calcularEstado(p);
            const valor  = p.stockActual * p.costoUnitario;
            const presentacion = textoPresentacion(p);
            const estadoBadge = {
                disponible: '<span class="inv-badge inv-badge-disponible">✓ Disponible</span>',
                bajo:       '<span class="inv-badge inv-badge-bajo">⚠ Stock Bajo</span>',
                agotado:    '<span class="inv-badge inv-badge-agotado">✕ Agotado</span>'
            }[estado];

            return `
                <tr>
                    <td>
                        <div style="font-weight:600;color:#f1f5f9;">${p.nombre}</div>
                        ${p.proveedor ? `<div style="font-size:0.72rem;color:#64748b;">${p.proveedor}</div>` : ''}
                    </td>
                    <td><span class="inv-cat ${catClases[p.categoria] || ''}">${catLabels[p.categoria] || p.categoria}</span></td>
                    <td style="font-size:0.82rem;color:#94a3b8;">${presentacion}</td>
                    <td style="font-weight:600;color:${estado === 'disponible' ? '#10b981' : estado === 'bajo' ? '#f59e0b' : '#ef4444'};">
                        ${p.stockActual} ${p.nombrePresentacion || p.unidad || ''}
                    </td>
                    <td style="color:#94a3b8;">${p.stockMinimo} ${p.nombrePresentacion || p.unidad || ''}</td>
                    <td style="font-weight:600;color:#10b981;">${fmt(p.precioVenta)}</td>
                    <td style="font-weight:600;">${fmt(valor)}</td>
                    <td>${estadoBadge}</td>
                    <td>
                        <div class="inv-tabla-acciones">
                            <button class="inv-btn-icono inv-btn-entrada" onclick="window.Inventario.abrirMovimientoRapido('${p.id}','entrada')" title="Entrada"><i class="fas fa-plus"></i></button>
                            <button class="inv-btn-icono inv-btn-salida" onclick="window.Inventario.abrirMovimientoRapido('${p.id}','salida')" title="Salida"><i class="fas fa-minus"></i></button>
                            <button class="inv-btn-icono inv-btn-editar" onclick="window.Inventario.editarProducto('${p.id}')" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="inv-btn-icono inv-btn-eliminar" onclick="window.Inventario.eliminarProducto('${p.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    }

    function renderizarMovimientos() {
        const container = document.getElementById('invMovimientos');
        if (!container) return;

        const ultimos = [...movimientos].reverse().slice(0, 20);
        if (ultimos.length === 0) {
            container.innerHTML = '<div class="inv-mov-vacio">Sin movimientos registrados</div>';
            return;
        }

        const iconos  = { entrada: 'fas fa-arrow-down', salida: 'fas fa-arrow-up', ajuste: 'fas fa-wrench' };
        const clases  = { entrada: 'inv-mov-entrada', salida: 'inv-mov-salida', ajuste: 'inv-mov-ajuste' };
        const colores = { entrada: '#10b981', salida: '#ef4444', ajuste: '#f59e0b' };

        container.innerHTML = ultimos.map(m => {
            const prod  = productos.find(p => p.id === m.productoId);
            const fecha = new Date(m.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
            const signo = m.tipo === 'entrada' ? '+' : m.tipo === 'salida' ? '-' : '~';
            const unidad = prod ? (prod.nombrePresentacion || prod.unidad || '') : '';

            return `
                <div class="inv-mov-item">
                    <div class="inv-mov-icono ${clases[m.tipo]}"><i class="${iconos[m.tipo]}"></i></div>
                    <div class="inv-mov-info">
                        <div class="inv-mov-nombre">${prod ? prod.nombre : 'Producto eliminado'}</div>
                        <div class="inv-mov-detalle">${m.motivo || m.tipo}</div>
                    </div>
                    <div>
                        <div class="inv-mov-cantidad" style="color:${colores[m.tipo]};">${signo}${m.cantidad} ${unidad}</div>
                        <div class="inv-mov-fecha">${fecha}</div>
                    </div>
                </div>`;
        }).join('');
    }

    function toggleEstadoVacio() {
        const vacio = document.getElementById('invEstadoVacio');
        const tabla = document.querySelector('.inv-tabla-section');
        const movs  = document.querySelector('.inv-movimientos-section');
        if (!vacio) return;
        const sinDatos = productos.length === 0;
        vacio.style.display = sinDatos ? 'flex' : 'none';
        if (tabla) tabla.style.display = sinDatos ? 'none' : 'block';
        if (movs)  movs.style.display  = sinDatos ? 'none' : 'block';
    }

    // ── Modal producto ────────────────────────────────────────────
    function abrirModal(id) {
        const modal = document.getElementById('invModalProducto');
        if (!modal) return;

        document.getElementById('invModalId').value = id || '';
        setText('invModalTitulo', id ? '✏️ Editar Producto' : '➕ Nuevo Producto');

        if (id) {
            const p = productos.find(x => x.id === id);
            if (!p) return;
            setVal('invNombre', p.nombre);
            setVal('invCategoria', p.categoria);
            setVal('invCantPresentacion', p.cantPresentacion || '');
            setVal('invUnidadPresentacion', p.unidadPresentacion || 'kg');
            setVal('invNombrePresentacion', p.nombrePresentacion || '');
            setVal('invStockActual', p.stockActual);
            setVal('invStockMinimo', p.stockMinimo);
            setVal('invCostoUnitario', p.costoUnitario);
            setVal('invPrecioVenta', p.precioVenta);
            setVal('invProveedor', p.proveedor || '');
            setVal('invDescripcion', p.descripcion || '');
        } else {
            ['invNombre','invProveedor','invDescripcion','invNombrePresentacion'].forEach(f => setVal(f, ''));
            ['invStockActual','invStockMinimo','invCostoUnitario','invPrecioVenta','invCantPresentacion'].forEach(f => setVal(f, ''));
            setVal('invCategoria', 'materia-prima');
            setVal('invUnidadPresentacion', 'kg');
        }

        modal.style.display = 'flex';
    }

    function cerrarModal() {
        const modal = document.getElementById('invModalProducto');
        if (modal) modal.style.display = 'none';
    }

    function guardarProducto() {
        const id     = document.getElementById('invModalId').value;
        const nombre = getVal('invNombre').trim();
        if (!nombre) { alert('El nombre del producto es obligatorio.'); return; }

        const datos = {
            nombre,
            categoria:          getVal('invCategoria'),
            cantPresentacion:   parseFloat(getVal('invCantPresentacion')) || null,
            unidadPresentacion: getVal('invUnidadPresentacion'),
            nombrePresentacion: getVal('invNombrePresentacion').trim(),
            stockActual:        parseFloat(getVal('invStockActual')) || 0,
            stockMinimo:        parseFloat(getVal('invStockMinimo')) || 0,
            costoUnitario:      parseFloat(getVal('invCostoUnitario')) || 0,
            precioVenta:        parseFloat(getVal('invPrecioVenta')) || 0,
            proveedor:          getVal('invProveedor').trim(),
            descripcion:        getVal('invDescripcion').trim(),
            updatedAt:          new Date().toISOString(),
        };

        if (id) {
            const idx = productos.findIndex(p => p.id === id);
            if (idx !== -1) productos[idx] = { ...productos[idx], ...datos };
        } else {
            productos.push({ id: generarId(), createdAt: new Date().toISOString(), ...datos });
        }

        guardarDatos();
        cerrarModal();
        renderizar();
    }

    function editarProducto(id) { abrirModal(id); }

    function eliminarProducto(id) {
        const p = productos.find(x => x.id === id);
        if (!p || !confirm(`¿Eliminar "${p.nombre}"?`)) return;
        productos = productos.filter(x => x.id !== id);
        guardarDatos();
        renderizar();
    }

    // ── Modal movimiento ──────────────────────────────────────────
    function abrirModalMovimiento(productoId, tipo) {
        const modal = document.getElementById('invModalMovimiento');
        if (!modal) return;

        const select = document.getElementById('invMovProducto');
        if (select) {
            select.innerHTML = productos.map(p =>
                `<option value="${p.id}" ${p.id === productoId ? 'selected' : ''}>${p.nombre} (${p.stockActual} ${p.nombrePresentacion || p.unidad || ''})</option>`
            ).join('');
        }

        setVal('invMovTipo', tipo || 'entrada');
        setVal('invMovCantidad', '');
        setVal('invMovMotivo', '');
        modal.style.display = 'flex';
    }

    function cerrarModalMovimiento() {
        const modal = document.getElementById('invModalMovimiento');
        if (modal) modal.style.display = 'none';
    }

    function guardarMovimiento() {
        const productoId = getVal('invMovProducto');
        const tipo       = getVal('invMovTipo');
        const cantidad   = parseFloat(getVal('invMovCantidad'));
        const motivo     = getVal('invMovMotivo').trim();

        if (!productoId) { alert('Selecciona un producto.'); return; }
        if (!cantidad || cantidad <= 0) { alert('La cantidad debe ser mayor a 0.'); return; }

        const idx = productos.findIndex(p => p.id === productoId);
        if (idx === -1) return;

        if (tipo === 'entrada') {
            productos[idx].stockActual += cantidad;
        } else if (tipo === 'salida') {
            if (productos[idx].stockActual < cantidad) {
                alert(`Stock insuficiente. Disponible: ${productos[idx].stockActual}`);
                return;
            }
            productos[idx].stockActual -= cantidad;
        } else {
            productos[idx].stockActual = cantidad;
        }

        movimientos.push({
            id: generarId(),
            productoId,
            tipo,
            cantidad,
            motivo: motivo || tipo,
            fecha: new Date().toISOString(),
        });

        guardarDatos();
        cerrarModalMovimiento();
        renderizar();
    }

    // ── Filtrar ───────────────────────────────────────────────────
    function filtrar() {
        filtroActual.busqueda  = getVal('invBusqueda') || '';
        filtroActual.categoria = getVal('invFiltroCategoria') || 'todos';
        filtroActual.estado    = getVal('invFiltroEstado') || 'todos';
        renderizarTabla();
    }

    function limpiarMovimientos() {
        if (!confirm('¿Limpiar todo el historial?')) return;
        movimientos = [];
        guardarDatos();
        renderizarMovimientos();
    }

    // ── Exportar ──────────────────────────────────────────────────
    function exportarExcel() {
        if (typeof XLSX === 'undefined') { alert('Módulo de exportación no disponible.'); return; }
        const wb   = XLSX.utils.book_new();
        const fmt  = (v) => parseFloat(v) || 0;
        const datos = [
            ['INVENTARIO GRIZALUM'],
            ['Empresa:', obtenerEmpresa(), 'Fecha:', new Date().toLocaleDateString('es-PE')],
            [''],
            ['Producto', 'Categoría', 'Presentación', 'Stock', 'Stock Mín.', 'Costo Unit.', 'Precio Venta', 'Valor Total', 'Estado', 'Proveedor'],
            ...productos.map(p => [
                p.nombre,
                p.categoria,
                textoPresentacion(p),
                fmt(p.stockActual),
                fmt(p.stockMinimo),
                fmt(p.costoUnitario),
                fmt(p.precioVenta),
                fmt(p.stockActual * p.costoUnitario),
                calcularEstado(p),
                p.proveedor || ''
            ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(datos);
        XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
        XLSX.writeFile(wb, `GRIZALUM_Inventario_${obtenerEmpresa()}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    // ── API pública para Ventas ───────────────────────────────────
    function obtenerProductos() { return productos; }

    // ── Helpers ───────────────────────────────────────────────────
    function setText(id, t) { const el = document.getElementById(id); if (el) el.textContent = t; }
    function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
    function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v; }

    // ── Inicializar ───────────────────────────────────────────────
    function inicializar() {
        cargarDatos();

        const btnAgregar = document.getElementById('btnAgregarProducto');
        if (btnAgregar) btnAgregar.addEventListener('click', () => abrirModal(null));

        const btnMov = document.getElementById('btnRegistrarMovimiento');
        if (btnMov) btnMov.addEventListener('click', () => abrirModalMovimiento(null, 'entrada'));

        const btnExp = document.getElementById('btnExportarInv');
        if (btnExp) btnExp.addEventListener('click', exportarExcel);

        document.addEventListener('grizalumCompanyChanged', () => { cargarDatos(); renderizar(); });

        renderizar();
        console.log('✅ [Inventario] Inicializado con', productos.length, 'productos');
    }

    window.Inventario = {
        filtrar, abrirModal, cerrarModal, guardarProducto,
        editarProducto, eliminarProducto,
        abrirModalMovimiento, abrirMovimientoRapido: abrirModalMovimiento,
        cerrarModalMovimiento, guardarMovimiento,
        limpiarMovimientos, exportarExcel,
        obtenerProductos,
    };

    window.inicializarInventario = function () {
        window._inventarioCargado = false;
        inicializar();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        setTimeout(inicializar, 100);
    }

    console.log('✅ [GRIZALUM] Inventario v20260510b cargado');

})();
