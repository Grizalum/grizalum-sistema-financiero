/**
 * ═══════════════════════════════════════════════════════════════════
 * INVENTARIO - GRIZALUM Sistema Financiero
 * Control inteligente de stock para empresarios
 * v20260510
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    if (window._inventarioCargado) {
        console.log('⚠️ [Inventario] Ya cargado, omitiendo...');
        return;
    }
    window._inventarioCargado = true;

    // ═══════════════════════════════════════════════════════════════
    // DATOS Y ESTADO
    // ═══════════════════════════════════════════════════════════════

    let productos = [];
    let movimientos = [];
    let filtroActual = { busqueda: '', categoria: 'todos', estado: 'todos' };

    function obtenerEmpresa() {
        try {
            if (window.gestorEmpresas && window.gestorEmpresas.obtenerEmpresaActual) {
                const emp = window.gestorEmpresas.obtenerEmpresaActual();
                return emp ? emp.id || 'default' : 'default';
            }
            return localStorage.getItem('grizalum_empresa_actual') || 'default';
        } catch (e) { return 'default'; }
    }

    function cargarDatos() {
        try {
            const empresa = obtenerEmpresa();
            const dataP = localStorage.getItem(`grizalum_inventario_${empresa}`);
            const dataM = localStorage.getItem(`grizalum_inventario_mov_${empresa}`);
            productos    = dataP ? JSON.parse(dataP) : [];
            movimientos  = dataM ? JSON.parse(dataM) : [];
        } catch (e) {
            productos = []; movimientos = [];
        }
    }

    function guardarDatos() {
        try {
            const empresa = obtenerEmpresa();
            localStorage.setItem(`grizalum_inventario_${empresa}`, JSON.stringify(productos));
            localStorage.setItem(`grizalum_inventario_mov_${empresa}`, JSON.stringify(movimientos));
        } catch (e) { console.warn('[Inventario] Error al guardar:', e); }
    }

    function generarId() {
        return 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // ═══════════════════════════════════════════════════════════════
    // CÁLCULOS
    // ═══════════════════════════════════════════════════════════════

    function calcularEstado(producto) {
        if (producto.stockActual <= 0) return 'agotado';
        if (producto.stockActual <= producto.stockMinimo) return 'bajo';
        return 'disponible';
    }

    function calcularKPIs() {
        const totalProductos  = productos.length;
        const valorTotal      = productos.reduce((s, p) => s + (p.stockActual * p.costoUnitario), 0);
        const stockBajo       = productos.filter(p => calcularEstado(p) !== 'disponible').length;
        const movMes          = movimientos.filter(m => {
            const fecha = new Date(m.fecha);
            const hoy   = new Date();
            return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
        }).length;

        return { totalProductos, valorTotal, stockBajo, rotacion: movMes };
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDERIZADO
    // ═══════════════════════════════════════════════════════════════

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

        // Alerta stock bajo
        const alerta = document.getElementById('invAlertaStock');
        if (alerta) {
            alerta.style.display = kpis.stockBajo > 0 ? 'flex' : 'none';
            setText('invAlertaTexto', `⚠️ ${kpis.stockBajo} producto(s) necesitan reorden urgente`);
        }
    }

    function productosFiltrados() {
        return productos.filter(p => {
            const estado = calcularEstado(p);
            const busq   = filtroActual.busqueda.toLowerCase();

            const matchBusqueda  = !busq || p.nombre.toLowerCase().includes(busq) || (p.proveedor || '').toLowerCase().includes(busq);
            const matchCategoria = filtroActual.categoria === 'todos' || filtroActual.categoria === 'alerta'
                ? (filtroActual.categoria === 'alerta' ? estado !== 'disponible' : true)
                : p.categoria === filtroActual.categoria;
            const matchEstado    = filtroActual.estado === 'todos' || estado === filtroActual.estado;

            return matchBusqueda && matchCategoria && matchEstado;
        });
    }

    function renderizarTabla() {
        const tbody    = document.getElementById('invTablaCuerpo');
        const contador = document.getElementById('invContadorFiltrado');
        if (!tbody) return;

        const lista = productosFiltrados();
        if (contador) contador.textContent = lista.length + ' productos';

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#64748b;">Sin productos que coincidan</td></tr>`;
            return;
        }

        const catLabels = { 'materia-prima': 'Materia Prima', 'producto-terminado': 'Prod. Terminado', 'herramienta': 'Herramienta' };
        const catClases = { 'materia-prima': 'inv-cat-mp', 'producto-terminado': 'inv-cat-pt', 'herramienta': 'inv-cat-ht' };
        const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

        tbody.innerHTML = lista.map(p => {
            const estado   = calcularEstado(p);
            const valor    = p.stockActual * p.costoUnitario;
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
                    <td style="font-weight:600;color:${estado === 'disponible' ? '#10b981' : estado === 'bajo' ? '#f59e0b' : '#ef4444'};">
                        ${p.stockActual} ${p.unidad}
                    </td>
                    <td style="color:#94a3b8;">${p.stockMinimo} ${p.unidad}</td>
                    <td>${fmt(p.costoUnitario)}</td>
                    <td style="font-weight:600;">${fmt(valor)}</td>
                    <td>${estadoBadge}</td>
                    <td>
                        <div class="inv-tabla-acciones">
                            <button class="inv-btn-icono inv-btn-entrada" onclick="window.Inventario.abrirMovimientoRapido('${p.id}','entrada')" title="Entrada">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="inv-btn-icono inv-btn-salida" onclick="window.Inventario.abrirMovimientoRapido('${p.id}','salida')" title="Salida">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="inv-btn-icono inv-btn-editar" onclick="window.Inventario.editarProducto('${p.id}')" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="inv-btn-icono inv-btn-eliminar" onclick="window.Inventario.eliminarProducto('${p.id}')" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
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

        const iconos = { entrada: 'fas fa-arrow-down', salida: 'fas fa-arrow-up', ajuste: 'fas fa-wrench' };
        const clases = { entrada: 'inv-mov-entrada', salida: 'inv-mov-salida', ajuste: 'inv-mov-ajuste' };
        const colores = { entrada: '#10b981', salida: '#ef4444', ajuste: '#f59e0b' };

        container.innerHTML = ultimos.map(m => {
            const prod  = productos.find(p => p.id === m.productoId);
            const fecha = new Date(m.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
            const signo = m.tipo === 'entrada' ? '+' : m.tipo === 'salida' ? '-' : '~';

            return `
                <div class="inv-mov-item">
                    <div class="inv-mov-icono ${clases[m.tipo]}">
                        <i class="${iconos[m.tipo]}"></i>
                    </div>
                    <div class="inv-mov-info">
                        <div class="inv-mov-nombre">${prod ? prod.nombre : 'Producto eliminado'}</div>
                        <div class="inv-mov-detalle">${m.motivo || m.tipo}</div>
                    </div>
                    <div>
                        <div class="inv-mov-cantidad" style="color:${colores[m.tipo]};">${signo}${m.cantidad} ${prod ? prod.unidad : ''}</div>
                        <div class="inv-mov-fecha">${fecha}</div>
                    </div>
                </div>`;
        }).join('');
    }

    function toggleEstadoVacio() {
        const vacio   = document.getElementById('invEstadoVacio');
        const tabla   = document.querySelector('.inv-tabla-section');
        const movs    = document.querySelector('.inv-movimientos-section');
        if (!vacio) return;

        const sinDatos = productos.length === 0;
        vacio.style.display  = sinDatos ? 'flex' : 'none';
        if (tabla) tabla.style.display  = sinDatos ? 'none' : 'block';
        if (movs)  movs.style.display   = sinDatos ? 'none' : 'block';
    }

    // ═══════════════════════════════════════════════════════════════
    // MODAL PRODUCTO
    // ═══════════════════════════════════════════════════════════════

    function abrirModal(id) {
        const modal = document.getElementById('invModalProducto');
        if (!modal) return;

        const es_edicion = !!id;
        setText('invModalTitulo', es_edicion ? '✏️ Editar Producto' : '➕ Nuevo Producto');
        document.getElementById('invModalId').value = id || '';

        if (es_edicion) {
            const p = productos.find(x => x.id === id);
            if (!p) return;
            setVal('invNombre', p.nombre);
            setVal('invCategoria', p.categoria);
            setVal('invUnidad', p.unidad);
            setVal('invStockActual', p.stockActual);
            setVal('invStockMinimo', p.stockMinimo);
            setVal('invCostoUnitario', p.costoUnitario);
            setVal('invPrecioVenta', p.precioVenta);
            setVal('invProveedor', p.proveedor || '');
            setVal('invDescripcion', p.descripcion || '');
        } else {
            ['invNombre','invProveedor','invDescripcion'].forEach(id => setVal(id, ''));
            ['invStockActual','invStockMinimo','invCostoUnitario','invPrecioVenta'].forEach(id => setVal(id, 0));
            setVal('invCategoria', 'materia-prima');
            setVal('invUnidad', 'kg');
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
            categoria:     getVal('invCategoria'),
            unidad:        getVal('invUnidad'),
            stockActual:   parseFloat(getVal('invStockActual')) || 0,
            stockMinimo:   parseFloat(getVal('invStockMinimo')) || 0,
            costoUnitario: parseFloat(getVal('invCostoUnitario')) || 0,
            precioVenta:   parseFloat(getVal('invPrecioVenta')) || 0,
            proveedor:     getVal('invProveedor').trim(),
            descripcion:   getVal('invDescripcion').trim(),
            updatedAt:     new Date().toISOString(),
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
        if (!p) return;
        if (!confirm(`¿Eliminar "${p.nombre}" del inventario?`)) return;
        productos = productos.filter(x => x.id !== id);
        guardarDatos();
        renderizar();
    }

    // ═══════════════════════════════════════════════════════════════
    // MODAL MOVIMIENTO
    // ═══════════════════════════════════════════════════════════════

    function abrirModalMovimiento(productoId, tipo) {
        const modal = document.getElementById('invModalMovimiento');
        if (!modal) return;

        const select = document.getElementById('invMovProducto');
        if (select) {
            select.innerHTML = productos.map(p =>
                `<option value="${p.id}" ${p.id === productoId ? 'selected' : ''}>${p.nombre} (${p.stockActual} ${p.unidad})</option>`
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
                alert(`Stock insuficiente. Disponible: ${productos[idx].stockActual} ${productos[idx].unidad}`);
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

    // ═══════════════════════════════════════════════════════════════
    // FILTROS
    // ═══════════════════════════════════════════════════════════════

    function filtrar() {
        filtroActual.busqueda  = getVal('invBusqueda') || '';
        filtroActual.categoria = getVal('invFiltroCategoria') || 'todos';
        filtroActual.estado    = getVal('invFiltroEstado') || 'todos';
        renderizarTabla();
    }

    function limpiarMovimientos() {
        if (!confirm('¿Limpiar todo el historial de movimientos?')) return;
        movimientos = [];
        guardarDatos();
        renderizarMovimientos();
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORTAR EXCEL
    // ═══════════════════════════════════════════════════════════════

    function exportarExcel() {
        if (typeof XLSX === 'undefined') { alert('Módulo de exportación no disponible.'); return; }

        const wb   = XLSX.utils.book_new();
        const fmt  = (v) => parseFloat(v) || 0;
        const catLabels = { 'materia-prima': 'Materia Prima', 'producto-terminado': 'Prod. Terminado', 'herramienta': 'Herramienta' };

        // Hoja 1: Inventario
        const datos = [
            ['INVENTARIO GRIZALUM', '', '', '', '', '', '', ''],
            ['Empresa:', obtenerEmpresa(), '', 'Fecha:', new Date().toLocaleDateString('es-PE'), '', '', ''],
            [''],
            ['Producto', 'Categoría', 'Unidad', 'Stock Actual', 'Stock Mínimo', 'Costo Unit.', 'Precio Venta', 'Valor Total', 'Estado', 'Proveedor'],
            ...productos.map(p => [
                p.nombre,
                catLabels[p.categoria] || p.categoria,
                p.unidad,
                fmt(p.stockActual),
                fmt(p.stockMinimo),
                fmt(p.costoUnitario),
                fmt(p.precioVenta),
                fmt(p.stockActual * p.costoUnitario),
                calcularEstado(p),
                p.proveedor || ''
            ]),
            [''],
            ['TOTALES', '', '', productos.reduce((s,p) => s+fmt(p.stockActual), 0), '', '', '', productos.reduce((s,p) => s+fmt(p.stockActual*p.costoUnitario), 0)]
        ];

        const ws = XLSX.utils.aoa_to_sheet(datos);
        XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

        // Hoja 2: Movimientos
        const datosM = [
            ['HISTORIAL DE MOVIMIENTOS'],
            ['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Motivo'],
            ...movimientos.map(m => {
                const p = productos.find(x => x.id === m.productoId);
                return [new Date(m.fecha).toLocaleDateString('es-PE'), p ? p.nombre : 'N/A', m.tipo, m.cantidad, m.motivo];
            })
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(datosM);
        XLSX.utils.book_append_sheet(wb, ws2, 'Movimientos');

        XLSX.writeFile(wb, `GRIZALUM_Inventario_${obtenerEmpresa()}_${new Date().toISOString().split('T')[0]}.xlsx`);
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

        // Eventos botones principales
        const btnAgregar = document.getElementById('btnAgregarProducto');
        if (btnAgregar) btnAgregar.addEventListener('click', () => abrirModal(null));

        const btnMovimiento = document.getElementById('btnRegistrarMovimiento');
        if (btnMovimiento) btnMovimiento.addEventListener('click', () => abrirModalMovimiento(null, 'entrada'));

        const btnExportar = document.getElementById('btnExportarInv');
        if (btnExportar) btnExportar.addEventListener('click', exportarExcel);

        // Cambio de empresa
        document.addEventListener('grizalumCompanyChanged', () => {
            cargarDatos();
            renderizar();
        });

        renderizar();
        console.log('✅ [Inventario] Inicializado con', productos.length, 'productos');
    }

    // ═══════════════════════════════════════════════════════════════
    // API PÚBLICA
    // ═══════════════════════════════════════════════════════════════

    window.Inventario = {
        filtrar,
        abrirModal,
        cerrarModal,
        guardarProducto,
        editarProducto,
        eliminarProducto,
        abrirModalMovimiento,
        abrirMovimientoRapido: abrirModalMovimiento,
        cerrarModalMovimiento,
        guardarMovimiento,
        limpiarMovimientos,
        exportarExcel,
    };

    window.inicializarInventario = function () {
        window._inventarioCargado = false;
        inicializar();
    };

    // Auto-inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        setTimeout(inicializar, 100);
    }

    console.log('✅ [GRIZALUM] Inventario v20260510 cargado');

})();
