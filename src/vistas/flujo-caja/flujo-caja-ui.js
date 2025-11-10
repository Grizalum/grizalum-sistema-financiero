/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - FLUJO DE CAJA - INTERFAZ DE USUARIO
 * Maneja toda la interacción con el DOM
 * VERSION CORREGIDA - Problema de edición solucionado
 * ═══════════════════════════════════════════════════════════════════
 */

class FlujoCajaUI {
    constructor() {
        this.modulo = null;
        this.transaccionEditando = null; 
        this.historial = new HistorialDescripciones();
        
        this._inicializar();
    }

    async _inicializar() {
        console.log('🎨 Inicializando interfaz Flujo de Caja...');
        
        // Esperar a que el módulo esté listo
        await this._esperarModulo();

       // ✅ CORREGIDO: Configurar historial con empresa actual
const info = this.modulo.obtenerInfo();

// Intentar obtener el ID de empresa de múltiples fuentes
let empresaId = info.empresaActual 
    || (typeof gestorDatos !== 'undefined' && gestorDatos.obtenerEmpresaActual?.())
    || (typeof window.empresaActual !== 'undefined' && window.empresaActual)
    || 'default';

console.log('🏢 Configurando historial para empresa:', empresaId);
this.historial.setEmpresa(empresaId);
        
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
    radio.addEventListener('change', () => {
        this.actualizarCategoriasSegunTipo();
        this.ocultarSugerencias(); // ✅ NUEVO: Ocultar sugerencias al cambiar tipo
    });
});

// ✅ NUEVO: Eventos para sugerencias de descripción
const inputDescripcion = document.getElementById('inputDescripcion');
if (inputDescripcion) {
    // Mostrar sugerencias al hacer focus
    inputDescripcion.addEventListener('focus', () => {
        this.mostrarSugerencias();
    });

    // Filtrar sugerencias mientras escribe
    inputDescripcion.addEventListener('input', (e) => {
        this.filtrarSugerencias(e.target.value);
    });

    // Ocultar sugerencias al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#inputDescripcion') && !e.target.closest('#sugerenciasDescripcion')) {
            this.ocultarSugerencias();
        }
    });
}

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

        // ✅ NUEVO: Listener para cambio de empresa
        document.addEventListener('grizalumCompanyChanged', (e) => {
            console.log('🔄 [UI] Empresa cambiada detectada:', e.detail);
             // ✅ CORREGIDO: Actualizar historial a nueva empresa
      const nuevaEmpresaId = e.detail?.empresaId 
         || e.detail?.empresa 
         || (typeof gestorDatos !== 'undefined' && gestorDatos.obtenerEmpresaActual?.())
         || 'default';

      console.log('🔄 Historial cambiando a empresa:', nuevaEmpresaId);
      this.historial.setEmpresa(nuevaEmpresaId);
            
            // Limpiar UI inmediatamente
            const listaTransacciones = document.getElementById('listaTransacciones');
            if (listaTransacciones) {
                listaTransacciones.innerHTML = '<div class="cargando" style="text-align: center; padding: 2rem; color: var(--texto-terciario);">🔄 Cargando datos de la nueva empresa...</div>';
            }
            
            // Esperar a que el módulo cargue los datos
            setTimeout(() => {
                if (this.modulo && this.modulo.inicializado) {
                    console.log('🎨 [UI] Actualizando interfaz...');
                    this.cargarBalance();
                    this.cargarTransacciones();
                    this.cargarNivel();
                    this.cargarCategorias();
                    console.log('✅ [UI] Interfaz actualizada');
                } else {
                    console.warn('⚠️ [UI] Módulo no inicializado, reintentando...');
                    setTimeout(() => {
                        if (this.modulo) {
                            this.cargarBalance();
                            this.cargarTransacciones();
                            this.cargarNivel();
                            this.cargarCategorias();
                        }
                    }, 300);
                }
            }, 200);
        });

        // ✅ NUEVO: Listener para actualización del flujo de caja
        document.addEventListener('grizalumFlujoCajaActualizado', (e) => {
            console.log('📊 [UI] Actualización del flujo detectada:', e.detail);
            this.cargarBalance();
            this.cargarTransacciones();
        });

        console.log('✅ Eventos configurados');
    }

    cargarNivel() {
        // ✅ DESACTIVADO: Ahora usa flujo-caja-plan-loader.js
        console.log('⚠️ [UI] cargarNivel() DESACTIVADA - Usando plan-loader');
        
        // Solo mostrar componentes, NO tocar el banner
        const info = this.modulo?.obtenerInfo();
        if (info?.componentesActivos) {
            this.mostrarComponentesSegunNivel(info.componentesActivos);
        }
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

    // ✅ CORREGIDO: abrirModalTransaccion ahora respeta el modo de edición
   abrirModalTransaccion(modoEdicion = false) {
        // ✅ IMPORTANTE: Solo resetear si NO estamos editando
        if (!modoEdicion) {
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
        }
        
        // ✅ CORREGIDO: Abrir modal sin Bootstrap API
        const modalElement = document.getElementById('modalTransaccion');
        if (modalElement) {
            // Mostrar modal
            modalElement.classList.add('show');
            modalElement.style.display = 'block';
            modalElement.setAttribute('aria-modal', 'true');
            modalElement.removeAttribute('aria-hidden');
            
            // Agregar backdrop
            let backdrop = document.querySelector('.modal-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show';
                document.body.appendChild(backdrop);
            }
            
            // Agregar clase al body
            document.body.classList.add('modal-open');
            
            // ✅ CRÍTICO: Escuchar tecla ESC para cerrar
            const cerrarConESC = (e) => {
                if (e.key === 'Escape') {
                    this.cerrarModalTransaccion();
                    document.removeEventListener('keydown', cerrarConESC);
                }
            };
            document.addEventListener('keydown', cerrarConESC);
            
            console.log('📋 Modal abierto - Modo:', modoEdicion ? 'EDICIÓN' : 'NUEVA', 'ID:', this.transaccionEditando);
        }
    }
    cerrarModalTransaccion() {
        const modalElement = document.getElementById('modalTransaccion');
        if (modalElement) {
            // Ocultar modal
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.removeAttribute('aria-modal');
            
            // Remover backdrop
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            
            // Remover clase del body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            console.log('✅ Modal cerrado y limpiado');
        }
    }
    
    // ✅ CORREGIDO: guardarTransaccion con acceso correcto a campos
    guardarTransaccion(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('💾 guardarTransaccion iniciado');
    console.log('🔍 Estado transaccionEditando:', this.transaccionEditando);
    
    const form = event.target;
    const tipoSeleccionado = form.querySelector('input[name="tipo"]:checked');
    
    const datos = {
        tipo: tipoSeleccionado ? tipoSeleccionado.value : 'ingreso',
        monto: parseFloat(document.getElementById('inputMonto').value),
        categoria: document.getElementById('selectCategoria').value,
        descripcion: document.getElementById('inputDescripcion').value || '',
        fecha: document.getElementById('inputFecha').value ? new Date(document.getElementById('inputFecha').value).toISOString() : new Date().toISOString(),
        metodoPago: document.getElementById('selectMetodo')?.value || 'efectivo',
        notas: document.getElementById('inputNotas')?.value || ''
    };

    console.log('📦 Datos del formulario:', datos);

    // ✅ NUEVO: Guardar descripción en historial
    if (datos.descripcion.trim()) {
        this.historial.agregar(datos.descripcion, datos.tipo);
    }

    if (this.transaccionEditando) {
        console.log('✏️ MODO EDICIÓN - ID:', this.transaccionEditando);
        this.modulo.editarTransaccion(this.transaccionEditando, datos);
        this.mostrarNotificacion('✅ Transacción actualizada', 'success');
    } else {
        console.log('➕ MODO NUEVA TRANSACCIÓN');
        this.modulo.agregarTransaccion(datos);
        this.mostrarNotificacion('✅ Transacción agregada', 'success');
    }

    this.cerrarModalTransaccion();
}

    // ✅ CORREGIDO: editarTransaccion con IDs correctos del formulario
    editarTransaccion(id) {
        console.log('✏️ editarTransaccion llamado con ID:', id);
        
        const transaccion = this.modulo.obtenerTransacciones().find(t => t.id === id);
        if (!transaccion) {
            console.error('❌ Transacción no encontrada:', id);
            return;
        }

        console.log('📄 Transacción encontrada:', transaccion);

        // ✅ IMPORTANTE: Establecer el ID ANTES de rellenar el formulario
        this.transaccionEditando = id;
        console.log('✅ transaccionEditando establecido:', this.transaccionEditando);

        // Rellenar formulario con IDs correctos
        const radioTipo = document.querySelector(`input[name="tipo"][value="${transaccion.tipo}"]`);
        if (radioTipo) {
            radioTipo.checked = true;
            this.actualizarCategoriasSegunTipo();
        }

        // ✅ Usar los IDs correctos del HTML
        const inputMonto = document.getElementById('inputMonto');
        const selectCategoria = document.getElementById('selectCategoria');
        const inputDescripcion = document.getElementById('inputDescripcion');
        const inputFecha = document.getElementById('inputFecha');
        const selectMetodo = document.getElementById('selectMetodo');
        const inputNotas = document.getElementById('inputNotas');

        if (inputMonto) inputMonto.value = transaccion.monto;
        if (selectCategoria) selectCategoria.value = transaccion.categoria;
        if (inputDescripcion) inputDescripcion.value = transaccion.descripcion;
        if (inputFecha) inputFecha.value = transaccion.fecha.split('T')[0];
        if (selectMetodo) selectMetodo.value = transaccion.metodoPago || 'efectivo';
        if (inputNotas) inputNotas.value = transaccion.notas || '';
        
        // ✅ IMPORTANTE: Abrir en modo edición (sin resetear)
        this.abrirModalTransaccion(true);
        
        console.log('✅ Modal abierto para edición - ID guardado:', this.transaccionEditando);
    }

    eliminarTransaccion(id) {
        if (confirm('¿Seguro que quieres eliminar esta transacción?')) {
            this.modulo.eliminarTransaccion(id);
            this.mostrarNotificacion('✅ Transacción eliminada', 'success');
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
    console.log('📊 Exportando datos...');
    
    try {
        if (typeof ExcelJS === 'undefined') {
            alert('❌ ExcelJS no disponible.');
            return;
        }

        if (typeof ExportadorExcelProfesional === 'undefined') {
            alert('❌ Exportador no disponible.');
            return;
        }

        const transacciones = this.modulo.obtenerTransacciones();
        const balance = this.modulo.calcularBalance();

        let nivel = 0;
        let empresaId = 'default';
        let planNombre = 'Individual';

        try {
            const info = this.modulo.obtenerInfo();
            empresaId = info?.empresaActual || 'default';
            
            // ✅ PRIORIDAD 1: Usar FlujoCajaPlanes (sistema de planes de pago)
            if (window.FlujoCajaPlanes) {
                const planActual = window.FlujoCajaPlanes.obtenerPlanActual();
                planNombre = planActual.nombre;
                
                console.log('✅ Plan desde FlujoCajaPlanes:', planNombre);
                
                // Convertir plan a nivel numérico para el exportador
                const mapaPlanNivel = {
                    'individual': 0,
                    'profesional': 30,
                    'empresarial': 50,
                    'corporativo': 70
                };
                
                nivel = mapaPlanNivel[planActual.id] || 0;
                console.log('📊 Nivel calculado desde plan:', nivel);
            }
            // ✅ PRIORIDAD 2: Fallback al sistema de score
            else if (info?.nivel?.score !== undefined) {
                nivel = parseInt(info.nivel.score) || 0;
                console.log('✅ Nivel obtenido del score:', nivel);
                
                // Determinar nombre del plan desde el nivel
                if (nivel >= 70) planNombre = 'Corporativo';
                else if (nivel >= 50) planNombre = 'Empresarial';
                else if (nivel >= 30) planNombre = 'Profesional';
            }
            
        } catch (e) {
            console.error('❌ Error leyendo nivel:', e);
        }

        console.log('📊 EXPORTANDO - Empresa:', empresaId, 'Nivel:', nivel, 'Plan:', planNombre);

        const datosExportar = {
            empresa: empresaId,
            balance: balance,
            transacciones: transacciones,
            nivel: nivel
        };

        const exportador = new ExportadorExcelProfesional();
        await exportador.exportar(datosExportar);
        
        this.mostrarNotificacion(`✅ Excel exportado (${planNombre})`, 'success');
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error: ' + error.message);
    }
}
    _exportarBasico() {
        // Método de respaldo si no hay exportador profesional
        const wb = XLSX.utils.book_new();
        const info = this.modulo.obtenerInfo();
        
        // Hoja 1: Resumen
        const resumen = [
            ['FLUJO DE CAJA - RESUMEN'],
            ['Empresa', info.empresaActual],
            ['Fecha', new Date().toLocaleDateString('es-PE')],
            [],
            ['BALANCE'],
            ['Ingresos', info.balance.ingresos],
            ['Gastos', info.balance.gastos],
            ['Balance', info.balance.balance]
        ];
        
        const ws1 = XLSX.utils.aoa_to_sheet(resumen);

        // Hoja 2: Transacciones
        const transacciones = this.modulo.obtenerTransacciones().map(t => ({
            Tipo: t.tipo,
            Monto: t.monto,
            Categoría: t.categoria,
            Descripción: t.descripcion,
            Fecha: new Date(t.fecha).toLocaleDateString('es-PE'),
            'Método de Pago': t.metodoPago
        }));
        
        const ws2 = XLSX.utils.json_to_sheet(transacciones);

        XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');
        XLSX.utils.book_append_sheet(wb, ws2, 'Transacciones');

        const nombreArchivo = `FlujoCaja_${info.empresaActual}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);

        this.mostrarNotificacion('✅ Excel exportado', 'success');
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
    /**
     * Mostrar sugerencias de descripción
     */
    mostrarSugerencias() {
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value || 'ingreso';
        const inputDescripcion = document.getElementById('inputDescripcion');
        const contenedor = document.getElementById('sugerenciasDescripcion');
        
        if (!contenedor) return;

        const sugerencias = this.historial.obtener(tipo);
        
        if (sugerencias.length === 0) {
            contenedor.innerHTML = '<div class="sugerencias-vacio">Sin historial aún. Las descripciones que agregues aparecerán aquí.</div>';
        } else {
            contenedor.innerHTML = sugerencias.map(desc => `
                <div class="sugerencia-item" data-descripcion="${desc}">
                    <span class="sugerencia-texto">${desc}</span>
                    <button class="sugerencia-eliminar" data-descripcion="${desc}" title="Eliminar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Eventos: Click en sugerencia
            contenedor.querySelectorAll('.sugerencia-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.sugerencia-eliminar')) {
                        const descripcion = item.dataset.descripcion;
                        inputDescripcion.value = descripcion;
                        this.ocultarSugerencias();
                    }
                });
            });

            // Eventos: Click en eliminar
            contenedor.querySelectorAll('.sugerencia-eliminar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const descripcion = btn.dataset.descripcion;
                    this.eliminarSugerencia(descripcion, tipo);
                });
            });
        }

        contenedor.style.display = 'block';
    }

    /**
     * Filtrar sugerencias mientras escribe
     */
    filtrarSugerencias(texto) {
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value || 'ingreso';
        const contenedor = document.getElementById('sugerenciasDescripcion');
        
        if (!contenedor) return;

        const sugerencias = this.historial.buscar(texto, tipo);
        
        if (sugerencias.length === 0) {
            contenedor.innerHTML = '<div class="sugerencias-vacio">No hay coincidencias</div>';
        } else {
            contenedor.innerHTML = sugerencias.map(desc => `
                <div class="sugerencia-item" data-descripcion="${desc}">
                    <span class="sugerencia-texto">${desc}</span>
                    <button class="sugerencia-eliminar" data-descripcion="${desc}" title="Eliminar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Re-agregar eventos
            contenedor.querySelectorAll('.sugerencia-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.sugerencia-eliminar')) {
                        const descripcion = item.dataset.descripcion;
                        document.getElementById('inputDescripcion').value = descripcion;
                        this.ocultarSugerencias();
                    }
                });
            });

            contenedor.querySelectorAll('.sugerencia-eliminar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const descripcion = btn.dataset.descripcion;
                    this.eliminarSugerencia(descripcion, tipo);
                });
            });
        }

        contenedor.style.display = 'block';
    }

    /**
     * Ocultar sugerencias
     */
    ocultarSugerencias() {
        const contenedor = document.getElementById('sugerenciasDescripcion');
        if (contenedor) {
            contenedor.style.display = 'none';
        }
    }

    /**
     * Eliminar una sugerencia del historial
     */
    eliminarSugerencia(descripcion, tipo) {
        if (confirm(`¿Eliminar "${descripcion}" del historial?`)) {
            this.historial.eliminar(descripcion, tipo);
            this.mostrarSugerencias(); // Recargar lista
            this.mostrarNotificacion(`🗑️ "${descripcion}" eliminado`, 'success');
        }
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
console.log('✅ [flujo-caja-ui.js CORREGIDO v3.0] Módulo cargado - ' + new Date().toISOString());

setInterval(() => {
    const app = document.getElementById('flujoCajaApp');
    if (app && window.getComputedStyle(app).display !== 'none') {
        if (window.flujoCajaUI && window.flujoCajaUI.modulo) {
            // Verificar si hay transacciones en módulo pero NO en DOM
            const transaccionesModulo = window.flujoCajaUI.modulo.obtenerTransacciones();
            const transaccionesDOM = document.querySelectorAll('.transaccion-card');
            
            if (transaccionesModulo.length > 0 && transaccionesDOM.length === 0) {
                console.log('🔄 Recargando Flujo de Caja (DOM vacío)...');
                window.flujoCajaUI.cargarBalance();
                window.flujoCajaUI.cargarTransacciones();
            }
        }
    }
}, 1000);

console.log('✅ Recarga automática de Flujo de Caja activada');
