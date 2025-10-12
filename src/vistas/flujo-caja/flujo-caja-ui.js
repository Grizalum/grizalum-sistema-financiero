/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - FLUJO DE CAJA - INTERFAZ DE USUARIO
 * Maneja toda la interacción con el DOM
 * ═══════════════════════════════════════════════════════════════════
 */

class FlujoCajaUI {
    constructor() {
        this.modulo = null;
        this.transaccionEditando = null;
        
        this._inicializar();
    }

    async _inicializar() {
        console.log('🎨 Inicializando interfaz Flujo de Caja...');
        
        // Esperar a que el módulo esté listo
        await this._esperarModulo();
        
        // Configurar fecha actual por defecto
        this._configurarFechaActual();
        
        // Cargar datos iniciales
        this.cargarNivel();
        this.cargarCategorias();
        this.cargarBalance();
        this.cargarTransacciones();
        
        // Configurar eventos
        this.configurarEventos();
        
        console.log('✅ Interfaz Flujo de Caja lista');
    }

    async _esperarModulo() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.flujoCaja) {
                    this.modulo = window.flujoCaja;
                    console.log('✅ Módulo conectado a la UI');
                    resolve();
                } else {
                    setTimeout(verificar, 200);
                }
            };
            verificar();
        });
    }

    _configurarFechaActual() {
        const inputFecha = document.getElementById('inputFecha');
        if (inputFecha) {
            inputFecha.valueAsDate = new Date();
        }
    }

    configurarEventos() {
        // Botón nueva transacción
        const btnNueva = document.getElementById('btnNuevaTransaccion');
        if (btnNueva) {
            btnNueva.addEventListener('click', () => this.abrirModalTransaccion());
        }

        // Form transacción
        const form = document.getElementById('formTransaccion');
        if (form) {
            form.addEventListener('submit', (e) => this.guardarTransaccion(e));
        }

        // Cambio de tipo (ingreso/gasto)
        document.querySelectorAll('input[name="tipo"]').forEach(radio => {
            radio.addEventListener('change', () => this.actualizarCategoriasSegunTipo());
        });

        // Filtros
        const btnAplicar = document.getElementById('btnAplicarFiltros');
        if (btnAplicar) {
            btnAplicar.addEventListener('click', () => this.aplicarFiltros());
        }

        const btnLimpiar = document.getElementById('btnLimpiarFiltros');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarFiltros());
        }

        // Buscador
        const inputBusqueda = document.getElementById('inputBusqueda');
        if (inputBusqueda) {
            let timeoutBusqueda;
            inputBusqueda.addEventListener('input', (e) => {
                clearTimeout(timeoutBusqueda);
                timeoutBusqueda = setTimeout(() => this.buscarTransacciones(e.target.value), 500);
            });
        }

        // Exportar
        const btnExportar = document.getElementById('btnExportar');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => this.exportarDatos());
        }

        // Escuchar eventos del módulo
        document.addEventListener('grizalumTransaccionAgregada', () => {
            this.cargarBalance();
            this.cargarTransacciones();
        });

        document.addEventListener('grizalumTransaccionEditada', () => {
            this.cargarBalance();
            this.cargarTransacciones();
        });

        document.addEventListener('grizalumTransaccionEliminada', () => {
            this.cargarBalance();
            this.cargarTransacciones();
        });

        console.log('✅ Eventos configurados');
    }

    cargarNivel() {
        const info = this.modulo.obtenerInfo();
        
        if (!info.nivel) {
            console.warn('Sin nivel disponible');
            return;
        }

        const banner = document.getElementById('nivelBanner');
        if (!banner) return;

        const icono = banner.querySelector('.nivel-icono');
        const nombre = banner.querySelector('.nivel-nombre');
        const scoreTexto = banner.querySelector('.nivel-score');
        const progreso = document.getElementById('progresoFill');

        if (icono) icono.textContent = info.nivel.nivel.icono;
        if (nombre) nombre.textContent = `Nivel ${info.nivel.nivel.nombre}`;
        if (scoreTexto) scoreTexto.textContent = `Score: ${info.nivel.score}/100`;
        if (progreso) progreso.style.width = `${info.nivel.score}%`;

        // Mostrar/ocultar componentes según score
        this.mostrarComponentesSegunNivel(info.componentesActivos);
    }

    mostrarComponentesSegunNivel(componentes) {
        if (!componentes) return;

        // Filtros
        if (componentes.mejorasBasicas?.filtrosFecha?.activo) {
            document.getElementById('seccionFiltros')?.classList.remove('oculto');
        }

        // Buscador
        if (componentes.mejorasBasicas?.busqueda?.activo) {
            document.getElementById('seccionBuscador')?.classList.remove('oculto');
        }

        // Gráficos
        if (componentes.visualizacionAvanzada?.graficosBasicos?.activo) {
            document.getElementById('seccionGraficos')?.classList.remove('oculto');
        }

        // Exportar
        if (componentes.visualizacionAvanzada?.exportarExcel?.activo) {
            document.getElementById('seccionExportar')?.classList.remove('oculto');
        }
    }

    cargarCategorias() {
        const info = this.modulo.obtenerInfo();
        if (info.categorias?.ingresos) {
            this.actualizarSelectCategorias(info.categorias.ingresos);
        }
    }

    actualizarCategoriasSegunTipo() {
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
        if (!tipo) return;

        const info = this.modulo.obtenerInfo();
        
        const categorias = tipo === 'ingreso' 
            ? info.categorias.ingresos 
            : info.categorias.gastos;
        
        this.actualizarSelectCategorias(categorias);
    }

    actualizarSelectCategorias(categorias) {
        const select = document.getElementById('selectCategoria');
        if (!select) return;

        select.innerHTML = '<option value="">Selecciona una categoría</option>';
        
        if (categorias) {
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.appendChild(option);
            });
        }

        // También actualizar filtro de categorías
        const filtroSelect = document.getElementById('filtroCategoria');
        if (filtroSelect) {
            const valorActual = filtroSelect.value;
            filtroSelect.innerHTML = '<option value="">Todas las categorías</option>';
            
            const info = this.modulo.obtenerInfo();
            const todasCategorias = [...new Set([
                ...(info.categorias.ingresos || []),
                ...(info.categorias.gastos || [])
            ])];
            
            todasCategorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                filtroSelect.appendChild(option);
            });
            
            filtroSelect.value = valorActual;
        }
    }

    cargarBalance() {
        const balance = this.modulo.calcularBalance();
        
        const balanceTotal = document.getElementById('balanceTotal');
        const totalIngresos = document.getElementById('totalIngresos');
        const totalGastos = document.getElementById('totalGastos');
        const cantidadIngresos = document.getElementById('cantidadIngresos');
        const cantidadGastos = document.getElementById('cantidadGastos');

        if (balanceTotal) balanceTotal.textContent = this.formatearMoneda(balance.balance);
        if (totalIngresos) totalIngresos.textContent = this.formatearMoneda(balance.ingresos);
        if (totalGastos) totalGastos.textContent = this.formatearMoneda(balance.gastos);
        
        if (cantidadIngresos) {
            cantidadIngresos.textContent = `${balance.cantidadIngresos} transacción${balance.cantidadIngresos !== 1 ? 'es' : ''}`;
        }
        if (cantidadGastos) {
            cantidadGastos.textContent = `${balance.cantidadGastos} transacción${balance.cantidadGastos !== 1 ? 'es' : ''}`;
        }
    }

    cargarTransacciones(filtros = {}) {
        const transacciones = this.modulo.obtenerTransacciones(filtros);
        const lista = document.getElementById('listaTransacciones');
        const sinDatos = document.getElementById('sinTransacciones');
        const totalBadge = document.getElementById('totalTransacciones');

        if (totalBadge) totalBadge.textContent = transacciones.length;

        if (transacciones.length === 0) {
            if (lista) lista.style.display = 'none';
            if (sinDatos) sinDatos.style.display = 'flex';
            return;
        }

        if (lista) {
            lista.style.display = 'block';
            lista.innerHTML = transacciones.map(t => this.crearTarjetaTransaccion(t)).join('');
        }
        if (sinDatos) sinDatos.style.display = 'none';
    }

    crearTarjetaTransaccion(transaccion) {
        const fecha = new Date(transaccion.fecha);
        const esIngreso = transaccion.tipo === 'ingreso';
        
        return `
            <div class="transaccion-card ${transaccion.tipo}">
                <div class="transaccion-icono ${transaccion.tipo}">
                    <i class="fas fa-arrow-${esIngreso ? 'up' : 'down'}"></i>
                </div>
                <div class="transaccion-info">
                    <div class="transaccion-descripcion">${transaccion.descripcion || transaccion.categoria}</div>
                    <div class="transaccion-detalles">
                        <span class="transaccion-categoria">${transaccion.categoria}</span>
                        <span class="transaccion-fecha">${fecha.toLocaleDateString('es-PE')}</span>
                    </div>
                </div>
                <div class="transaccion-monto ${transaccion.tipo}">
                    ${esIngreso ? '+' : '-'} ${this.formatearMoneda(transaccion.monto)}
                </div>
                <div class="transaccion-acciones">
                    <button class="btn-icono" onclick="flujoCajaUI.editarTransaccion('${transaccion.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icono" onclick="flujoCajaUI.eliminarTransaccion('${transaccion.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    abrirModalTransaccion() {
        this.transaccionEditando = null;
        
        const modalTitulo = document.getElementById('modalTitulo');
        const form = document.getElementById('formTransaccion');
        const modal = document.getElementById('modalTransaccion');

        if (modalTitulo) modalTitulo.textContent = 'Nueva Transacción';
        if (form) {
            form.reset();
            const inputFecha = document.getElementById('inputFecha');
            if (inputFecha) inputFecha.valueAsDate = new Date();
        }
        
        this.actualizarCategoriasSegunTipo();
        
        if (modal) modal.classList.add('show');
        
        console.log('📝 Modal abierto');
    }

    cerrarModalTransaccion() {
        const modal = document.getElementById('modalTransaccion');
        if (modal) modal.classList.remove('show');
        this.transaccionEditando = null;
    }

    guardarTransaccion(e) {
    e.preventDefault();
    
    console.log('💾 Intentando guardar transacción...');
    
    // Obtener valores
    const tipoElement = document.querySelector('input[name="tipo"]:checked');
    const montoElement = document.getElementById('inputMonto');
    const categoriaElement = document.getElementById('selectCategoria');
    const descripcionElement = document.getElementById('inputDescripcion');
    const fechaElement = document.getElementById('inputFecha');
    const metodoElement = document.getElementById('selectMetodo');
    const notasElement = document.getElementById('inputNotas');
    
    // Validaciones
    if (!tipoElement) {
        alert('❌ Selecciona el tipo (Ingreso o Gasto)');
        return;
    }
    
    if (!montoElement || !montoElement.value || parseFloat(montoElement.value) <= 0) {
        alert('❌ Ingresa un monto válido mayor a 0');
        montoElement?.focus();
        return;
    }
    
    if (!categoriaElement || !categoriaElement.value) {
        alert('❌ Selecciona una categoría');
        categoriaElement?.focus();
        return;
    }
    
    if (!fechaElement || !fechaElement.value) {
        alert('❌ Selecciona una fecha');
        fechaElement?.focus();
        return;
    }
    
    // Construir datos
    const datos = {
        tipo: tipoElement.value,
        monto: parseFloat(montoElement.value),
        categoria: categoriaElement.value,
        descripcion: descripcionElement?.value || '',
        fecha: new Date(fechaElement.value).toISOString(),
        metodoPago: metodoElement?.value || 'efectivo',
        notas: notasElement?.value || ''
    };
    
    console.log('📝 Datos a guardar:', datos);
    
    try {
        if (this.transaccionEditando) {
            this.modulo.editarTransaccion(this.transaccionEditando, datos);
            console.log('✅ Transacción editada');
        } else {
            this.modulo.agregarTransaccion(datos);
            console.log('✅ Transacción agregada');
        }
        
        this.cerrarModalTransaccion();
        
        // Mostrar mensaje de éxito
        this.mostrarNotificacion('✅ Transacción guardada correctamente', 'success');
        
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        alert('❌ Error al guardar la transacción. Revisa la consola.');
    }
}

    editarTransaccion(id) {
        const transaccion = this.modulo.obtenerTransaccion(id);
        if (!transaccion) return;

        this.transaccionEditando = id;
        
        const modalTitulo = document.getElementById('modalTitulo');
        if (modalTitulo) modalTitulo.textContent = 'Editar Transacción';
        
        const tipoRadio = document.querySelector(`input[name="tipo"][value="${transaccion.tipo}"]`);
        if (tipoRadio) tipoRadio.checked = true;
        
        const inputMonto = document.getElementById('inputMonto');
        if (inputMonto) inputMonto.value = transaccion.monto;
        
        this.actualizarCategoriasSegunTipo();
        
        const selectCategoria = document.getElementById('selectCategoria');
        if (selectCategoria) selectCategoria.value = transaccion.categoria;
        
        const inputDescripcion = document.getElementById('inputDescripcion');
        if (inputDescripcion) inputDescripcion.value = transaccion.descripcion;
        
        const inputFecha = document.getElementById('inputFecha');
        if (inputFecha) inputFecha.valueAsDate = new Date(transaccion.fecha);
        
        const selectMetodo = document.getElementById('selectMetodo');
        if (selectMetodo) selectMetodo.value = transaccion.metodoPago;
        
        const inputNotas = document.getElementById('inputNotas');
        if (inputNotas) inputNotas.value = transaccion.notas;
        
        const modal = document.getElementById('modalTransaccion');
        if (modal) modal.classList.add('show');
    }

    eliminarTransaccion(id) {
        if (confirm('¿Seguro que quieres eliminar esta transacción?')) {
            this.modulo.eliminarTransaccion(id);
        }
    }

    aplicarFiltros() {
        const filtros = {
            tipo: document.getElementById('filtroTipo')?.value,
            categoria: document.getElementById('filtroCategoria')?.value,
            fechaInicio: document.getElementById('filtroFechaInicio')?.value ? new Date(document.getElementById('filtroFechaInicio').value).toISOString() : null,
            fechaFin: document.getElementById('filtroFechaFin')?.value ? new Date(document.getElementById('filtroFechaFin').value).toISOString() : null
        };

        this.cargarTransacciones(filtros);
    }

    limpiarFiltros() {
        const filtroTipo = document.getElementById('filtroTipo');
        const filtroCategoria = document.getElementById('filtroCategoria');
        const filtroFechaInicio = document.getElementById('filtroFechaInicio');
        const filtroFechaFin = document.getElementById('filtroFechaFin');

        if (filtroTipo) filtroTipo.value = '';
        if (filtroCategoria) filtroCategoria.value = '';
        if (filtroFechaInicio) filtroFechaInicio.value = '';
        if (filtroFechaFin) filtroFechaFin.value = '';
        
        this.cargarTransacciones();
    }

    buscarTransacciones(texto) {
        this.cargarTransacciones({ busqueda: texto });
    }

    exportarDatos() {
        const datos = this.modulo.exportarJSON();
        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flujo-caja-${datos.empresa}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    formatearMoneda(valor) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(valor);
    }
     // ⬇️⬇️⬇️ AGREGAR ESTA FUNCIÓN AQUÍ ⬇️⬇️⬇️
    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear notificación
        const notif = document.createElement('div');
        notif.className = `notificacion notif-${tipo}`;
        notif.textContent = mensaje;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 10px;
            font-weight: 700;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            z-index: 200000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notif);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }
}

// Inicialización global
window.flujoCajaUI = new FlujoCajaUI();

console.log('🎨 UI de Flujo de Caja cargada');
