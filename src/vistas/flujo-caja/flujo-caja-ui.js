/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - FLUJO DE CAJA - INTERFAZ DE USUARIO
 * Maneja toda la interacción con el DOM
 * VERSION CORREGIDA - Problema de submit duplicado solucionado
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
        console.log('⚙️ Configurando eventos del formulario...');
        
        // Botón nueva transacción
        const btnNueva = document.getElementById('btnNuevaTransaccion');
        if (btnNueva) {
            btnNueva.addEventListener('click', () => this.abrirModalTransaccion());
        }

        // ✅ Botón exportar
        const btnExportar = document.getElementById('btnExportarRapido');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => this.exportarDatos());
        }

        // ⭐ CRÍTICO: Form transacción - SIN DUPLICADOS
        const form = document.getElementById('formTransaccion');
        if (form) {
            // ✅ Limpiar eventos previos
            const formLimpio = form.cloneNode(true);
            form.parentNode.replaceChild(formLimpio, form);
            
            // ✅ Agregar listener ÚNICO
            formLimpio.addEventListener('submit', (e) => {
                console.log('📝 [SUBMIT] Evento capturado por FlujoCajaUI');
                this.guardarTransaccion(e);
            });
            
            console.log('✅ Evento submit configurado correctamente');
        }

        // Cambio de tipo (ingreso/gasto)
        document.querySelectorAll('input[name="tipo"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.actualizarCategoriasSegunTipo();
                this.ocultarSugerencias();
            });
        });

        // ✅ Eventos para sugerencias de descripción
        const inputDescripcion = document.getElementById('inputDescripcion');
        if (inputDescripcion) {
            inputDescripcion.addEventListener('focus', () => {
                this.mostrarSugerencias();
            });

            inputDescripcion.addEventListener('input', (e) => {
                this.filtrarSugerencias(e.target.value);
            });

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
            console.log('🎉 [EVENTO] Nueva transacción agregada');
            this.cargarBalance();
            this.cargarTransacciones();
        });

        document.addEventListener('grizalumTransaccionEditada', () => {
            console.log('✏️ [EVENTO] Transacción editada');
            this.cargarBalance();
            this.cargarTransacciones();
        });

        document.addEventListener('grizalumTransaccionEliminada', () => {
            console.log('🗑️ [EVENTO] Transacción eliminada');
            this.cargarBalance();
            this.cargarTransacciones();
        });

        // ✅ Listener para cambio de empresa
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

        // ✅ Listener para actualización del flujo de caja
        document.addEventListener('grizalumFlujoCajaActualizado', (e) => {
            console.log('📊 [UI] Actualización del flujo detectada:', e.detail);
            this.cargarBalance();
            this.cargarTransacciones();
        });

        console.log('✅ Todos los eventos configurados');
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

    abrirModalTransaccion(modoEdicion = false) {
        // ✅ Solo resetear si NO estamos editando
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
        
        // Abrir modal
        const modalElement = document.getElementById('modalTransaccion');
        if (modalElement) {
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
            
            document.body.classList.add('modal-open');
            
            // Escuchar tecla ESC
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
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.removeAttribute('aria-modal');
            
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            console.log('✅ Modal cerrado');
        }
    }
    
    // ⭐ MÉTODO PRINCIPAL DE GUARDADO - CORREGIDO
    guardarTransaccion(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('💾 [GUARDAR] Iniciando guardado de transacción');
        console.log('🔍 [GUARDAR] Modo:', this.transaccionEditando ? 'EDICIÓN' : 'NUEVA');
        
        try {
            // Obtener datos del formulario
            const form = document.getElementById('formTransaccion');
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

            console.log('📦 [GUARDAR] Datos:', datos);

            // Validaciones
            if (!datos.tipo || !datos.categoria) {
                alert('⚠️ Por favor selecciona un tipo y una categoría');
                return;
            }

            if (isNaN(datos.monto) || datos.monto <= 0) {
                alert('⚠️ El monto debe ser un número mayor a 0');
                return;
            }

            // ✅ Guardar descripción en historial
            if (datos.descripcion.trim()) {
                this.historial.agregar(datos.descripcion, datos.tipo);
            }

            // ⭐ GUARDAR O EDITAR
            if (this.transaccionEditando) {
                console.log('✏️ [GUARDAR] Editando transacción ID:', this.transaccionEditando);
                this.modulo.editarTransaccion(this.transaccionEditando, datos);
                this.mostrarNotificacion('✅ Transacción actualizada', 'success');
            } else {
                console.log('➕ [GUARDAR] Creando nueva transacción');
                this.modulo.agregarTransaccion(datos);
                this.mostrarNotificacion('✅ Transacción guardada', 'success');
            }

            // ✅ Cerrar modal y actualizar UI
            this.cerrarModalTransaccion();
            
            // ✅ IMPORTANTE: Esperar un poco antes de recargar
            setTimeout(() => {
                console.log('🔄 [GUARDAR] Recargando interfaz...');
                this.cargarBalance();
                this.cargarTransacciones();
                console.log('✅ [GUARDAR] Proceso completado');
            }, 100);
            
        } catch (error) {
            console.error('❌ [GUARDAR] Error:', error);
            alert('❌ Error al guardar: ' + error.message);
        }
    }

    editarTransaccion(id) {
        console.log('✏️ editarTransaccion llamado con ID:', id);
        
        const transaccion = this.modulo.obtenerTransacciones().find(t => t.id === id);
        if (!transaccion) {
            console.error('❌ Transacción no encontrada:', id);
            return;
        }

        console.log('📄 Transacción encontrada:', transaccion);

        // ✅ Establecer el ID ANTES de rellenar el formulario
        this.transaccionEditando = id;
        console.log('✅ transaccionEditando establecido:', this.transaccionEditando);

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
        const selectMetodo = document.getElementById('selectMetodo');
        const inputNotas = document.getElementById('inputNotas');

        if (inputMonto) inputMonto.value = transaccion.monto;
        if (selectCategoria) selectCategoria.value = transaccion.categoria;
        if (inputDescripcion) inputDescripcion.value = transaccion.descripcion;
        if (inputFecha) inputFecha.value = transaccion.fecha.split('T')[0];
        if (selectMetodo) selectMetodo.value = transaccion.metodoPago || 'efectivo';
        if (inputNotas) inputNotas.value = transaccion.notas || '';
        
        // ✅ Abrir en modo edición
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
                
                if (window.FlujoCajaPlanes) {
                    const planActual = window.FlujoCajaPlanes.obtenerPlanActual();
                    planNombre = planActual.nombre;
                    
                    const mapaPlanNivel = {
                        'individual': 0,
                        'profesional': 30,
                        'empresarial': 50,
                        'corporativo': 70
                    };
                    
                    nivel = mapaPlanNivel[planActual.id] || 0;
                } else if (info?.nivel?.score !== undefined) {
                    nivel = parseInt(info.nivel.score) || 0;
                    
                    if (nivel >= 70) planNombre = 'Corporativo';
                    else if (nivel >= 50) planNombre = 'Empresarial';
                    else if (nivel >= 30) planNombre = 'Profesional';
                }
                
            } catch (e) {
                console.error('❌ Error leyendo nivel:', e);
            }

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

    formatearMoneda(valor) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(valor);
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
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
        
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

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

            contenedor.querySelectorAll('.sugerencia-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.sugerencia-eliminar')) {
                        const descripcion = item.dataset.descripcion;
                        inputDescripcion.value = descripcion;
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

    ocultarSugerencias() {
        const contenedor = document.getElementById('sugerenciasDescripcion');
        if (contenedor) {
            contenedor.style.display = 'none';
        }
    }

    eliminarSugerencia(descripcion, tipo) {
        if (confirm(`¿Eliminar "${descripcion}" del historial?`)) {
            this.historial.eliminar(descripcion, tipo);
            this.mostrarSugerencias();
            this.mostrarNotificacion(`🗑️ "${descripcion}" eliminado`, 'success');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTAR CLASE Y FUNCIONES GLOBALES
// ═══════════════════════════════════════════════════════════════

window.FlujoCajaUI = FlujoCajaUI;

let flujoCajaUIInstancia = null;

function inicializarFlujoCajaUI() {
    console.log('🚀 Inicializando Flujo de Caja UI...');
    
    if (!flujoCajaUIInstancia) {
        flujoCajaUIInstancia = new FlujoCajaUI();
        window.flujoCajaUI = flujoCajaUIInstancia;
    }
    
    setTimeout(() => {
        if (window.flujoCajaUI?.modulo) {
            console.log('📊 Cargando datos iniciales...');
            window.flujoCajaUI.cargarBalance();
            window.flujoCajaUI.cargarTransacciones();
        }
    }, 500);
}

// Listeners de inicialización
window.addEventListener('flujoCajaVisible', inicializarFlujoCajaUI);

if (document.readyState === 'complete') {
    inicializarFlujoCajaUI();
} else {
    window.addEventListener('load', inicializarFlujoCajaUI);
}

// Funciones globales para compatibilidad con HTML
window.cargarBalance = function() {
    if (window.flujoCajaUI) window.flujoCajaUI.cargarBalance();
};

window.cargarTransacciones = function(filtros = {}) {
    if (window.flujoCajaUI) window.flujoCajaUI.cargarTransacciones(filtros);
};

window.cargarNivel = function() {
    if (window.flujoCajaUI) window.flujoCajaUI.cargarNivel();
};

window.cargarCategorias = function() {
    if (window.flujoCajaUI) window.flujoCajaUI.cargarCategorias();
};

window.abrirModalTransaccion = function() {
    if (window.flujoCajaUI) window.flujoCajaUI.abrirModalTransaccion();
};

window.editarTransaccion = function(id) {
    if (window.flujoCajaUI) window.flujoCajaUI.editarTransaccion(id);
};

window.eliminarTransaccion = function(id) {
    if (window.flujoCajaUI) window.flujoCajaUI.eliminarTransaccion(id);
};

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

// Listener para actualización automática
document.addEventListener('grizalumTransaccionAgregada', () => {
    console.log('📝 Nueva transacción detectada, actualizando...');
    if (window.flujoCajaUI?.modulo) {
        window.flujoCajaUI.cargarBalance();
        window.flujoCajaUI.cargarTransacciones();
    }
});

// Monitor de recarga automática
setInterval(() => {
    const app = document.getElementById('flujoCajaApp');
    if (app && window.getComputedStyle(app).display !== 'none') {
        if (window.flujoCajaUI && window.flujoCajaUI.modulo) {
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

console.log('✅ [flujo-caja-ui.js CORREGIDO v4.0 - SIN DUPLICADOS] Módulo cargado');
console.log('🎨 UI de Flujo de Caja lista para inicializar');
