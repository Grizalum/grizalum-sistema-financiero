/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - FLUJO DE CAJA - INTERFAZ DE USUARIO
 * Maneja toda la interacción con el DOM
 * VERSION CORREGIDA - Con Excel Profesional
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
        
        // Esperar a que el DOM esté completamente listo
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('✅ DOM listo, cargando datos...');
        
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

        // ✅ NUEVO: Botón exportar
        const btnExportar = document.getElementById('btnExportarRapido');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => this.exportarDatos());
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

        // Exportar (botón secundario si existe)
        const btnExportarOld = document.getElementById('btnExportar');
        if (btnExportarOld) {
            btnExportarOld.addEventListener('click', () => this.exportarDatos());
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

        if (!lista) return;

        if (totalBadge) totalBadge.textContent = transacciones.length;

        if (transacciones.length === 0) {
            lista.style.display = 'none';
            if (sinDatos) sinDatos.style.display = 'flex';
            return;
        }

        lista.style.display = 'block';
        if (sinDatos) sinDatos.style.display = 'none';

        lista.innerHTML = transacciones.map(t => {
            const fecha = new Date(t.fecha);
            const esIngreso = t.tipo === 'ingreso';
            
            return `
                <div class="transaccion-card ${t.tipo}">
                    <div class="transaccion-icono ${t.tipo}">
                        <i class="fas fa-arrow-${esIngreso ? 'up' : 'down'}"></i>
                    </div>
                    <div class="transaccion-info">
                        <div class="transaccion-descripcion">${t.descripcion || t.categoria}</div>
                        <div class="transaccion-detalles">
                            <span class="transaccion-categoria">${t.categoria}</span>
                            <span class="transaccion-fecha">${fecha.toLocaleDateString('es-PE')}</span>
                        </div>
                    </div>
                    <div class="transaccion-monto ${t.tipo}">
                        ${esIngreso ? '+' : '-'} ${this.formatearMoneda(t.monto)}
                    </div>
                    <div class="transaccion-acciones">
                        <button class="btn-icono" onclick="window.flujoCajaUI.editarTransaccion('${t.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icono" onclick="window.flujoCajaUI.eliminarTransaccion('${t.id}')">    
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    abrirModalTransaccion() {
        this.transaccionEditando = null;
        
        // Limpiar formulario
        const form = document.getElementById('formTransaccion');
        if (form) form.reset();
        
        // Fecha actual por defecto
        const inputFecha = document.getElementById('inputFecha');
        if (inputFecha) inputFecha.valueAsDate = new Date();
        
        // Tipo ingreso por defecto
        const radioIngreso = document.querySelector('input[name="tipo"][value="ingreso"]');
        if (radioIngreso) {
            radioIngreso.checked = true;
            this.actualizarCategoriasSegunTipo();
        }
        
        // Mostrar modal
        const modal = document.getElementById('modalTransaccion');
        if (modal) modal.classList.add('show');
    }

    cerrarModalTransaccion() {
        const modal = document.getElementById('modalTransaccion');
        if (modal) modal.classList.remove('show');
        this.transaccionEditando = null;
    }

    guardarTransaccion(event) {
        event.preventDefault();
        
        const form = event.target;
        const datos = {
            tipo: form.tipo.value,
            monto: parseFloat(form.monto.value),
            categoria: form.categoria.value,
            descripcion: form.descripcion.value,
            fecha: form.fecha.value ? new Date(form.fecha.value).toISOString() : new Date().toISOString(),
            metodoPago: form.metodoPago?.value || 'efectivo',
            notas: form.notas?.value || ''
        };

        if (this.transaccionEditando) {
            this.modulo.editarTransaccion(this.transaccionEditando, datos);
        } else {
            this.modulo.agregarTransaccion(datos);
        }

        this.cerrarModalTransaccion();
    }

    editarTransaccion(id) {
        const transaccion = this.modulo.obtenerTransacciones().find(t => t.id === id);
        if (!transaccion) return;

        this.transaccionEditando = id;

        // Rellenar formulario
        const radioTipo = document.querySelector(`input[name="tipo"][value="${transaccion.tipo}"]`);
        if (radioTipo) {
            radioTipo.checked = true;
            this.actualizarCategoriasSegunTipo();
        }

        const inputMonto = document.getElementById('inputMonto');
        const selectCategoria = document.getElementById('selectCategoria');
        const inputDescripcion = document.getElementById('inputDescripcion');
        const inputFecha = document.getElementById('inputFecha');
        const selectMetodoPago = document.getElementById('selectMetodoPago');
        const inputNotas = document.getElementById('inputNotas');

        if (inputMonto) inputMonto.value = transaccion.monto;
        if (selectCategoria) selectCategoria.value = transaccion.categoria;
        if (inputDescripcion) inputDescripcion.value = transaccion.descripcion;
        if (inputFecha) inputFecha.value = transaccion.fecha.split('T')[0];
        if (selectMetodoPago) selectMetodoPago.value = transaccion.metodoPago;
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

   async exportarDatos() {
    console.log('📊 Exportando datos con formato profesional...');
    
    try {
        if (typeof XLSX === 'undefined') {
            alert('❌ Error: Librería XLSX no disponible');
            return;
        }

        if (typeof ExportadorExcelProfesional === 'undefined') {
            console.warn('⚠️ Exportador profesional no disponible, usando método básico');
            this._exportarBasico();
            return;
        }

        const info = this.modulo.obtenerInfo();
        const transacciones = this.modulo.obtenerTransacciones();
        const balance = this.modulo.calcularBalance();
        const porCategoria = this.modulo.calcularPorCategoria();

        const datosExport = {
            empresa: info.empresaActual || 'Sin Nombre',
            balance: balance,
            transacciones: transacciones,
            porCategoria: porCategoria,
            nivel: info.nivel?.nivel?.nombre || 'N/A',
            score: info.nivel?.score || 0
        };

        const exportador = new ExportadorExcelProfesional();
        
        const btnExportar = document.getElementById('btnExportarRapido');
        if (btnExportar) {
            btnExportar.disabled = true;
            btnExportar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando Excel...';
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        await exportador.exportar(datosExport);

        if (btnExportar) {
            btnExportar.disabled = false;
            btnExportar.innerHTML = '<i class="fas fa-download"></i> Exportar a Excel';
        }

        this.mostrarNotificacion('✅ Excel exportado exitosamente', 'success');

    } catch (error) {
        console.error('❌ Error exportando:', error);
        
        const btnExportar = document.getElementById('btnExportarRapido');
        if (btnExportar) {
            btnExportar.disabled = false;
            btnExportar.innerHTML = '<i class="fas fa-download"></i> Exportar a Excel';
        }
        
        alert('❌ Error al exportar');
    }
}

_exportarBasico() {
    console.log('📊 Usando exportador básico...');
    
    try {
        const transacciones = this.modulo.obtenerTransacciones();
        const balance = this.modulo.calcularBalance();
        const info = this.modulo.obtenerInfo();

        const wb = XLSX.utils.book_new();

        const resumenData = [
            ['FLUJO DE CAJA - RESUMEN EJECUTIVO'],
            [],
            ['Empresa:', info.empresaActual || 'N/A'],
            ['Fecha:', new Date().toLocaleString('es-PE')],
            [],
            ['BALANCE GENERAL'],
            [],
            ['Concepto', 'Monto', 'Cantidad'],
            ['Ingresos', balance.ingresos, balance.cantidadIngresos],
            ['Gastos', balance.gastos, balance.cantidadGastos],
            [],
            ['BALANCE', balance.balance, balance.total]
        ];

        const ws1 = XLSX.utils.aoa_to_sheet(resumenData);
        
        const transaccionesData = [
            ['TRANSACCIONES'],
            [],
            ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto'],
            ...transacciones.map(t => [
                new Date(t.fecha).toLocaleDateString('es-PE'),
                t.tipo,
                t.categoria,
                t.descripcion || '',
                t.monto
            ])
        ];

        const ws2 = XLSX.utils.aoa_to_sheet(transaccionesData);

        XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');
        XLSX.utils.book_append_sheet(wb, ws2, 'Transacciones');

        const nombreArchivo = `FlujoCaja_${info.empresaActual}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);

        this.mostrarNotificacion('✅ Excel exportado', 'success');
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error al exportar');
    }
}
    formatearMoneda(valor) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(valor);
    }

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

// ✅ EXPORTAR CLASE GLOBALMENTE
window.FlujoCajaUI = FlujoCajaUI;

// ═══════════════════════════════════════════════════════════════
// INICIALIZACIÓN INTELIGENTE
// ═══════════════════════════════════════════════════════════════

// NO inicializar inmediatamente, esperar a que la vista esté visible
let flujoCajaUIInstancia = null;

function inicializarFlujoCajaUI() {
    console.log('🚀 Inicializando Flujo de Caja UI...');
    
    if (!flujoCajaUIInstancia) {
        flujoCajaUIInstancia = new FlujoCajaUI();
        window.flujoCajaUI = flujoCajaUIInstancia;
    }
    
    // Esperar 500ms para asegurar que el DOM está listo
    setTimeout(() => {
        if (window.flujoCajaUI?.modulo) {
            console.log('📊 Cargando datos iniciales...');
            window.flujoCajaUI.cargarBalance();
            window.flujoCajaUI.cargarTransacciones();
        }
    }, 500);
}

// Escuchar cuando la vista se hace visible
window.addEventListener('flujoCajaVisible', inicializarFlujoCajaUI);

// También intentar inicializar al cargar
if (document.readyState === 'complete') {
    inicializarFlujoCajaUI();
} else {
    window.addEventListener('load', inicializarFlujoCajaUI);
}

console.log('🎨 UI de Flujo de Caja lista para inicializar');

// ═══════════════════════════════════════════════════════════════
// EXPORTAR FUNCIONES COMO GLOBALES (para compatibilidad con HTML)
// ═══════════════════════════════════════════════════════════════

window.cargarBalance = function() {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.cargarBalance();
    }
};

window.cargarTransacciones = function(filtros = {}) {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.cargarTransacciones(filtros);
    }
};

window.cargarNivel = function() {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.cargarNivel();
    }
};

window.cargarCategorias = function() {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.cargarCategorias();
    }
};

window.abrirModalTransaccion = function() {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.abrirModalTransaccion();
    }
};

window.editarTransaccion = function(id) {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.editarTransaccion(id);
    }
};

window.eliminarTransaccion = function(id) {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.eliminarTransaccion(id);
    }
};

console.log('✅ Funciones globales exportadas');

// ═══════════════════════════════════════════════════════════════
// ESCUCHAR EVENTO DE VISTA VISIBLE
// ═══════════════════════════════════════════════════════════════

window.addEventListener('flujoCajaVisible', function() {
    console.log('👁️ Vista Flujo de Caja visible');
    setTimeout(() => {
        if (window.flujoCajaUI?.modulo) {
            console.log('🔄 Recargando datos...');
            window.flujoCajaUI.cargarBalance();
            window.flujoCajaUI.cargarTransacciones();
        }
    }, 500);
});

// También escuchar cuando se carga cualquier transacción
document.addEventListener('grizalumTransaccionAgregada', () => {
    console.log('📝 Nueva transacción detectada, actualizando...');
    if (window.flujoCajaUI?.modulo) {
        window.flujoCajaUI.cargarBalance();
        window.flujoCajaUI.cargarTransacciones();
    }
});

console.log('✅ Listeners de recarga configurados');

// ═══════════════════════════════════════════════════════════════
// FUNCIÓN DE RECARGA COMPLETA
// ═══════════════════════════════════════════════════════════════

window.recargarFlujoCaja = function() {
    console.log('🔄 [recargarFlujoCaja] Iniciando recarga completa...');
    
    if (!window.flujoCajaUI) {
        console.error('❌ [recargarFlujoCaja] flujoCajaUI no existe');
        return;
    }
    
    if (!window.flujoCajaUI.modulo) {
        console.error('❌ [recargarFlujoCaja] Módulo no conectado');
        return;
    }
    
    try {
        console.log('📊 [recargarFlujoCaja] Cargando balance...');
        window.flujoCajaUI.cargarBalance();
        
        console.log('📋 [recargarFlujoCaja] Cargando transacciones...');
        window.flujoCajaUI.cargarTransacciones();
        
        console.log('✅ [recargarFlujoCaja] Recarga completada');
    } catch (error) {
        console.error('❌ [recargarFlujoCaja] Error:', error);
    }
};

console.log('✅ Función recargarFlujoCaja registrada');
console.log('✅ [flujo-caja-ui.js CORREGIDO v2.0] Módulo cargado - ' + new Date().toISOString());

// ═══════════════════════════════════════════════════════════════
// FUNCIONES GLOBALES PARA EVENTOS ONCLICK
// ═══════════════════════════════════════════════════════════════
window.editarTransaccion = (id) => {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.editarTransaccion(id);
    }
};

window.eliminarTransaccion = (id) => {
    if (window.flujoCajaUI) {
        window.flujoCajaUI.eliminarTransaccion(id);
    }
};

console.log('✅ Funciones globales editarTransaccion y eliminarTransaccion creadas');
