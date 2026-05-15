/**
 * ═══════════════════════════════════════════════════════════════════
 * PROVEEDORES - GRIZALUM Sistema Financiero
 * v20260515 — Registro, historial, créditos, exportación
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    if (window._proveedoresCargado) return;
    window._proveedoresCargado = true;

    let proveedores = [];
    let compras = [];
    let filtroActual = { busqueda: '', estado: 'todos', periodo: 'mes' };

    function obtenerEmpresa() {
        try { return localStorage.getItem('grizalum_empresa_actual') || 'default'; }
        catch (e) { return 'default'; }
    }

    function cargarDatos() {
        try {
            const dp = localStorage.getItem(`grizalum_proveedores_${obtenerEmpresa()}`);
            const dc = localStorage.getItem(`grizalum_compras_${obtenerEmpresa()}`);
            proveedores = dp ? JSON.parse(dp) : [];
            compras     = dc ? JSON.parse(dc) : [];
        } catch (e) { proveedores = []; compras = []; }
    }

    function guardarDatos() {
        try {
            localStorage.setItem(`grizalum_proveedores_${obtenerEmpresa()}`, JSON.stringify(proveedores));
            localStorage.setItem(`grizalum_compras_${obtenerEmpresa()}`, JSON.stringify(compras));
        } catch (e) {}
    }

    function generarId(prefix) {
        return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // ═══════════════════════════════════════════════════════════════
    // KPIs
    // ═══════════════════════════════════════════════════════════════

    function calcularKPIs() {
        const hoy = new Date();
        const comprasMes = compras.filter(c => {
            const f = new Date(c.fecha);
            return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
        });

        const totalComprasMes = comprasMes.reduce((s, c) => s + (c.monto || 0), 0);
        const creditosPendientes = compras
            .filter(c => c.estado === 'pendiente' || c.estado === 'credito')
            .reduce((s, c) => s + (c.monto || 0), 0);
        const comprasVencidas = compras.filter(c => {
            if (c.estado !== 'pendiente' && c.estado !== 'credito') return false;
            if (!c.fechaVencimiento) return false;
            return new Date(c.fechaVencimiento) < hoy;
        }).length;

        return {
            totalProveedores: proveedores.length,
            totalComprasMes,
            creditosPendientes,
            comprasVencidas
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDERIZADO PRINCIPAL
    // ═══════════════════════════════════════════════════════════════

    function renderizar() {
        actualizarKPIs();
        renderizarTablaProveedores();
        renderizarTablaCompras();
        toggleEstadoVacio();
    }

    function actualizarKPIs() {
        const k   = calcularKPIs();
        const fmt = (v) => 'S/ ' + v.toLocaleString('es-PE', { minimumFractionDigits: 2 });
        setText('pvTotalProveedores', k.totalProveedores);
        setText('pvComprasMes', fmt(k.totalComprasMes));
        setText('pvCreditosPendientes', fmt(k.creditosPendientes));
        setText('pvComprasVencidas', k.comprasVencidas);
    }

    function renderizarTablaProveedores() {
        const tbody = document.getElementById('pvTablaProveedores');
        if (!tbody) return;

        const busqueda = filtroActual.busqueda.toLowerCase();
        const lista = proveedores.filter(p =>
            !busqueda ||
            p.nombre.toLowerCase().includes(busqueda) ||
            (p.ruc || '').includes(busqueda) ||
            (p.rubro || '').toLowerCase().includes(busqueda)
        );

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#64748b;">Sin proveedores registrados</td></tr>`;
            return;
        }

        const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

        tbody.innerHTML = lista.map(p => {
            // Calcular deuda total del proveedor
            const deuda = compras
                .filter(c => c.proveedorId === p.id && (c.estado === 'pendiente' || c.estado === 'credito'))
                .reduce((s, c) => s + (c.monto || 0), 0);

            const estadoBadge = deuda > 0
                ? `<span class="pv-badge pv-badge-deuda">💳 ${fmt(deuda)}</span>`
                : `<span class="pv-badge pv-badge-ok">✅ Al día</span>`;

            return `
                <tr>
                    <td style="font-weight:600;color:#f1f5f9;">${p.nombre}</td>
                    <td style="color:#94a3b8;font-size:0.82rem;">${p.ruc || '—'}</td>
                    <td>${p.rubro || '—'}</td>
                    <td style="color:#94a3b8;font-size:0.82rem;">${p.telefono || '—'}</td>
                    <td style="color:#94a3b8;font-size:0.82rem;">${p.condicionPago || '—'}</td>
                    <td>${estadoBadge}</td>
                    <td style="color:#94a3b8;font-size:0.82rem;">${p.notas || '—'}</td>
                    <td>
                        <div class="pv-tabla-acciones">
                            <button class="pv-btn-icono pv-btn-compra" onclick="window.Proveedores.abrirModalCompra('${p.id}')" title="Nueva compra">
                                <i class="fas fa-shopping-bag"></i>
                            </button>
                            <button class="pv-btn-icono pv-btn-editar" onclick="window.Proveedores.abrirModalProveedor('${p.id}')" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="pv-btn-icono pv-btn-eliminar" onclick="window.Proveedores.eliminarProveedor('${p.id}')" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    }

    function comprasFiltradas() {
        const hoy = new Date();
        const busqueda = filtroActual.busqueda.toLowerCase();
        return compras.filter(c => {
            const fecha = new Date(c.fecha);
            const proveedor = proveedores.find(p => p.id === c.proveedorId);
            const nombreProv = proveedor?.nombre?.toLowerCase() || '';
            const matchB = !busqueda || nombreProv.includes(busqueda) || (c.descripcion || '').toLowerCase().includes(busqueda);
            const matchE = filtroActual.estado === 'todos' || c.estado === filtroActual.estado;
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

    function renderizarTablaCompras() {
        const tbody    = document.getElementById('pvTablaCompras');
        const contador = document.getElementById('pvContadorCompras');
        if (!tbody) return;

        const lista = comprasFiltradas().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        if (contador) contador.textContent = lista.length + ' compras';

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#64748b;">Sin compras registradas</td></tr>`;
            return;
        }

        const fmt = (v) => 'S/ ' + (v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });
        const estadoBadge = {
            pagado:   '<span class="pv-badge pv-badge-ok">✅ Pagado</span>',
            pendiente:'<span class="pv-badge pv-badge-deuda">⏳ Pendiente</span>',
            credito:  '<span class="pv-badge pv-badge-credito">💳 Crédito</span>',
            vencido:  '<span class="pv-badge pv-badge-vencido">🚨 Vencido</span>',
        };

        tbody.innerHTML = lista.map(c => {
            const proveedor = proveedores.find(p => p.id === c.proveedorId);
            const fecha = new Date(c.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
            const vencimiento = c.fechaVencimiento
                ? new Date(c.fechaVencimiento).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
                : '—';

            // Detectar vencido
            let estadoReal = c.estado;
            if ((c.estado === 'pendiente' || c.estado === 'credito') && c.fechaVencimiento) {
                if (new Date(c.fechaVencimiento) < new Date()) estadoReal = 'vencido';
            }

            return `
                <tr>
                    <td style="color:#94a3b8;font-size:0.82rem;">${fecha}</td>
                    <td style="font-weight:600;color:#f1f5f9;">${proveedor?.nombre || '—'}</td>
                    <td>${c.descripcion || '—'}</td>
                    <td>${c.categoria || '—'}</td>
                    <td style="font-weight:700;color:#ef4444;">${fmt(c.monto)}</td>
                    <td>${estadoBadge[estadoReal] || estadoReal}</td>
                    <td style="color:#94a3b8;font-size:0.82rem;">${vencimiento}</td>
                    <td>
                        <div class="pv-tabla-acciones">
                            ${estadoReal !== 'pagado' ? `
                                <button class="pv-btn-icono pv-btn-pagar" onclick="window.Proveedores.marcarPagado('${c.id}')" title="Marcar pagado">
                                    <i class="fas fa-check"></i>
                                </button>` : ''}
                            <button class="pv-btn-icono pv-btn-eliminar" onclick="window.Proveedores.eliminarCompra('${c.id}')" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    }

    function toggleEstadoVacio() {
        const vacio = document.getElementById('pvEstadoVacio');
        if (!vacio) return;
        vacio.style.display = proveedores.length === 0 ? 'flex' : 'none';
        const contenido = document.getElementById('pvContenidoPrincipal');
        if (contenido) contenido.style.display = proveedores.length === 0 ? 'none' : 'block';
    }

    // ═══════════════════════════════════════════════════════════════
    // MODAL PROVEEDOR
    // ═══════════════════════════════════════════════════════════════

    function abrirModalProveedor(id) {
        const modal = document.getElementById('pvModalProveedor');
        if (!modal) return;

        document.getElementById('pvModalProvId').value = id || '';
        setText('pvModalProvTitulo', id ? '✏️ Editar Proveedor' : '➕ Nuevo Proveedor');

        if (id) {
            const p = proveedores.find(x => x.id === id);
            if (!p) return;
            setVal('pvNombre', p.nombre);
            setVal('pvRuc', p.ruc || '');
            setVal('pvRubro', p.rubro || '');
            setVal('pvTelefono', p.telefono || '');
            setVal('pvEmail', p.email || '');
            setVal('pvDireccion', p.direccion || '');
            setVal('pvCondicionPago', p.condicionPago || '');
            setVal('pvBanco', p.banco || '');
            setVal('pvCuentaBancaria', p.cuentaBancaria || '');
            setVal('pvNotas', p.notas || '');
        } else {
            ['pvNombre','pvRuc','pvRubro','pvTelefono','pvEmail','pvDireccion','pvBanco','pvCuentaBancaria','pvNotas'].forEach(id => setVal(id, ''));
            setVal('pvCondicionPago', 'contado');
        }

        modal.style.display = 'flex';
    }

    function cerrarModalProveedor() {
        const modal = document.getElementById('pvModalProveedor');
        if (modal) modal.style.display = 'none';
    }

    function guardarProveedor() {
        const id     = getVal('pvModalProvId');
        const nombre = getVal('pvNombre').trim();

        if (!nombre) { alert('El nombre del proveedor es obligatorio.'); return; }

        const datos = {
            nombre,
            ruc:            getVal('pvRuc').trim(),
            rubro:          getVal('pvRubro').trim(),
            telefono:       getVal('pvTelefono').trim(),
            email:          getVal('pvEmail').trim(),
            direccion:      getVal('pvDireccion').trim(),
            condicionPago:  getVal('pvCondicionPago'),
            banco:          getVal('pvBanco').trim(),
            cuentaBancaria: getVal('pvCuentaBancaria').trim(),
            notas:          getVal('pvNotas').trim(),
            updatedAt:      new Date().toISOString(),
        };

        if (id) {
            const idx = proveedores.findIndex(p => p.id === id);
            if (idx !== -1) proveedores[idx] = { ...proveedores[idx], ...datos };
        } else {
            proveedores.push({ id: generarId('pv'), createdAt: new Date().toISOString(), ...datos });
        }

        guardarDatos();
        cerrarModalProveedor();
        renderizar();
    }

    function eliminarProveedor(id) {
        const p = proveedores.find(x => x.id === id);
        if (!p || !confirm(`¿Eliminar proveedor "${p.nombre}"? También se eliminará su historial de compras.`)) return;
        proveedores = proveedores.filter(x => x.id !== id);
        compras     = compras.filter(c => c.proveedorId !== id);
        guardarDatos();
        renderizar();
    }

    // ═══════════════════════════════════════════════════════════════
    // MODAL COMPRA
    // ═══════════════════════════════════════════════════════════════

    function abrirModalCompra(proveedorIdPreseleccionado) {
        const modal = document.getElementById('pvModalCompra');
        if (!modal) return;

        // Llenar selector de proveedores
        const select = document.getElementById('pvCompraProveedor');
        if (select) {
            select.innerHTML = '<option value="">-- Seleccionar proveedor --</option>';
            proveedores.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.nombre;
                select.appendChild(option);
            });
            if (proveedorIdPreseleccionado) select.value = proveedorIdPreseleccionado;
        }

        setVal('pvCompraFecha', new Date().toISOString().split('T')[0]);
        setVal('pvCompraDescripcion', '');
        setVal('pvCompraCategoria', 'Materias primas');
        setVal('pvCompraMonto', '');
        setVal('pvCompraEstado', 'pagado');
        setVal('pvCompraFechaVencimiento', '');
        setVal('pvCompraNotas', '');

        actualizarVencimiento();
        modal.style.display = 'flex';
    }

    function cerrarModalCompra() {
        const modal = document.getElementById('pvModalCompra');
        if (modal) modal.style.display = 'none';
    }

    function actualizarVencimiento() {
        const estado = getVal('pvCompraEstado');
        const campo  = document.getElementById('pvGrupoVencimiento');
        if (campo) campo.style.display = (estado === 'credito' || estado === 'pendiente') ? 'block' : 'none';
    }

    function guardarCompra() {
        const proveedorId   = getVal('pvCompraProveedor');
        const descripcion   = getVal('pvCompraDescripcion').trim();
        const monto         = parseFloat(getVal('pvCompraMonto')) || 0;

        if (!proveedorId)  { alert('Selecciona un proveedor.'); return; }
        if (!descripcion)  { alert('La descripción es obligatoria.'); return; }
        if (monto <= 0)    { alert('El monto debe ser mayor a 0.'); return; }

        const proveedor = proveedores.find(p => p.id === proveedorId);
        const estado    = getVal('pvCompraEstado');

        const nuevaCompra = {
            id:                generarId('cp'),
            proveedorId,
            descripcion,
            categoria:         getVal('pvCompraCategoria'),
            monto,
            estado,
            fecha:             getVal('pvCompraFecha') || new Date().toISOString().split('T')[0],
            fechaVencimiento:  getVal('pvCompraFechaVencimiento') || null,
            notas:             getVal('pvCompraNotas').trim(),
            createdAt:         new Date().toISOString(),
        };

        compras.push(nuevaCompra);

        // Registrar en Flujo de Caja si está pagado
        if (estado === 'pagado') {
            registrarEnFlujoCaja(nuevaCompra, proveedor);
        }

        guardarDatos();
        cerrarModalCompra();
        renderizar();

        document.dispatchEvent(new CustomEvent('grizalumCompraRegistrada', { detail: nuevaCompra }));
    }

    function marcarPagado(id) {
        const idx = compras.findIndex(c => c.id === id);
        if (idx === -1) return;
        compras[idx].estado     = 'pagado';
        compras[idx].updatedAt  = new Date().toISOString();
        const proveedor = proveedores.find(p => p.id === compras[idx].proveedorId);
        registrarEnFlujoCaja(compras[idx], proveedor);
        guardarDatos();
        renderizar();
    }

    function eliminarCompra(id) {
        if (!confirm('¿Eliminar esta compra?')) return;
        compras = compras.filter(c => c.id !== id);
        guardarDatos();
        renderizar();
    }

    // ═══════════════════════════════════════════════════════════════
    // CONEXIÓN CON FLUJO DE CAJA
    // ═══════════════════════════════════════════════════════════════

    function registrarEnFlujoCaja(compra, proveedor) {
        try {
            const empresa = obtenerEmpresa();
            const key     = `grizalum_flujo_caja_${empresa}`;
            const trans   = JSON.parse(localStorage.getItem(key) || '[]');

            trans.push({
                id:          'fc_' + Date.now(),
                tipo:        'gasto',
                monto:       compra.monto,
                descripcion: `Compra: ${compra.descripcion} — ${proveedor?.nombre || 'Proveedor'}`,
                categoria:   compra.categoria || 'Compras de inventario',
                fecha:       compra.fecha,
                referencia:  compra.id,
                origen:      'proveedores',
                createdAt:   new Date().toISOString()
            });

            localStorage.setItem(key, JSON.stringify(trans));
            console.log(`✅ [Proveedores→FC] Gasto S/ ${compra.monto} registrado`);
            return true;
        } catch (e) { return false; }
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORTAR EXCEL
    // ═══════════════════════════════════════════════════════════════

    function exportarExcel() {
        if (typeof XLSX === 'undefined') { alert('Módulo de exportación no disponible.'); return; }
        const fmt = (v) => parseFloat(v) || 0;
        const wb  = XLSX.utils.book_new();

        // Hoja 1: Proveedores
        const datosProveedores = [
            ['PROVEEDORES - GRIZALUM'],
            ['Empresa:', obtenerEmpresa(), 'Fecha:', new Date().toLocaleDateString('es-PE')],
            [''],
            ['Nombre', 'RUC', 'Rubro', 'Teléfono', 'Email', 'Condición de Pago', 'Notas'],
            ...proveedores.map(p => [p.nombre, p.ruc||'', p.rubro||'', p.telefono||'', p.email||'', p.condicionPago||'', p.notas||''])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosProveedores), 'Proveedores');

        // Hoja 2: Historial de compras
        const datosCompras = [
            ['HISTORIAL DE COMPRAS - GRIZALUM'],
            [''],
            ['Fecha', 'Proveedor', 'Descripción', 'Categoría', 'Monto', 'Estado', 'Vencimiento'],
            ...compras.map(c => {
                const prov = proveedores.find(p => p.id === c.proveedorId);
                return [
                    new Date(c.fecha).toLocaleDateString('es-PE'),
                    prov?.nombre || '—',
                    c.descripcion, c.categoria,
                    fmt(c.monto), c.estado,
                    c.fechaVencimiento ? new Date(c.fechaVencimiento).toLocaleDateString('es-PE') : '—'
                ];
            }),
            [''],
            ['TOTAL COMPRAS', '', '', '', compras.reduce((s, c) => s + fmt(c.monto), 0)]
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosCompras), 'Historial Compras');

        // Hoja 3: Créditos pendientes
        const pendientes = compras.filter(c => c.estado === 'pendiente' || c.estado === 'credito');
        const datosPendientes = [
            ['CRÉDITOS PENDIENTES - GRIZALUM'],
            [''],
            ['Proveedor', 'Descripción', 'Monto', 'Vencimiento'],
            ...pendientes.map(c => {
                const prov = proveedores.find(p => p.id === c.proveedorId);
                return [prov?.nombre||'—', c.descripcion, fmt(c.monto), c.fechaVencimiento ? new Date(c.fechaVencimiento).toLocaleDateString('es-PE') : '—'];
            }),
            [''],
            ['TOTAL PENDIENTE', '', pendientes.reduce((s, c) => s + fmt(c.monto), 0)]
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosPendientes), 'Créditos Pendientes');

        XLSX.writeFile(wb, `GRIZALUM_Proveedores_${obtenerEmpresa()}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILIDADES
    // ═══════════════════════════════════════════════════════════════

    function filtrar() {
        filtroActual.busqueda = getVal('pvBusqueda') || '';
        filtroActual.estado   = getVal('pvFiltroEstado') || 'todos';
        filtroActual.periodo  = getVal('pvFiltroPeriodo') || 'mes';
        renderizarTablaProveedores();
        renderizarTablaCompras();
    }

    function setText(id, t) { const el = document.getElementById(id); if (el) el.textContent = t; }
    function getVal(id)     { const el = document.getElementById(id); return el ? el.value : ''; }
    function setVal(id, v)  { const el = document.getElementById(id); if (el) el.value = v; }

    // ═══════════════════════════════════════════════════════════════
    // INICIALIZAR
    // ═══════════════════════════════════════════════════════════════

    function inicializar() {
        cargarDatos();

        const btnNuevo = document.getElementById('btnNuevoProveedor');
        if (btnNuevo) btnNuevo.addEventListener('click', () => abrirModalProveedor(null));

        const btnExp = document.getElementById('btnExportarProveedores');
        if (btnExp) btnExp.addEventListener('click', exportarExcel);

        document.addEventListener('grizalumCompanyChanged', () => { cargarDatos(); renderizar(); });

        renderizar();
        console.log('✅ [Proveedores] Inicializado con', proveedores.length, 'proveedores');
    }

    window.Proveedores = {
        filtrar,
        abrirModalProveedor, cerrarModalProveedor, guardarProveedor, eliminarProveedor,
        abrirModalCompra, cerrarModalCompra, guardarCompra, marcarPagado, eliminarCompra,
        actualizarVencimiento, exportarExcel,
    };

    window.inicializarProveedores = function () {
        window._proveedoresCargado = false;
        inicializar();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        setTimeout(inicializar, 100);
    }

    console.log('✅ [GRIZALUM] Proveedores v20260515');

})();
