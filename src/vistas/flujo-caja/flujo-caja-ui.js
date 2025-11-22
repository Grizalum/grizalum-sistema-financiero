/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - FLUJO DE CAJA - INTERFAZ DE USUARIO
 * Maneja toda la interacción con el DOM
 * VERSION 5.0 - Multi-empresa mejorado
 * ═══════════════════════════════════════════════════════════════════
 */

class FlujoCajaUI {
    constructor() {
        this.modulo = null;
        this.transaccionEditando = null; 
        this.historial = new HistorialDescripciones();
        this.empresaActual = null;
        
        this._inicializar();
    }

    async _inicializar() {
        console.log('🎨 Inicializando interfaz Flujo de Caja...');
        
        // ✅ OBTENER EMPRESA ACTUAL PRIMERO
        this.empresaActual = this._obtenerEmpresaActual();
        console.log('🏢 Empresa actual detectada:', this.empresaActual);
        
        // Esperar a que el módulo esté listo
        await this._esperarModulo();

        // ✅ Configurar historial con empresa actual
        this.historial.setEmpresa(this.empresaActual);
        console.log('✅ Historial configurado para empresa:', this.empresaActual);
        
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

    _obtenerEmpresaActual() {
        // Intentar múltiples fuentes para obtener empresa actual
        let empresaId = null;
        
        // 1. Desde gestorEmpresas (PRIORIDAD)
        if (window.gestorEmpresas?.estado?.empresaActual) {
            empresaId = window.gestorEmpresas.estado.empresaActual;
            console.log('✅ Empresa desde gestorEmpresas:', empresaId);
        }
        // 2. Desde localStorage
        else if (localStorage.getItem('empresaActual')) {
            empresaId = localStorage.getItem('empresaActual');
            console.log('✅ Empresa desde localStorage:', empresaId);
        }
        // 3. Desde gestorDatos (fallback)
        else if (typeof gestorDatos !== 'undefined' && gestorDatos.obtenerEmpresaActual) {
            empresaId = gestorDatos.obtenerEmpresaActual();
            console.log('✅ Empresa desde gestorDatos:', empresaId);
        }
        // 4. Default
        else {
            empresaId = 'default';
            console.warn('⚠️ No se detectó empresa, usando default');
        }
        
        return empresaId;
    }

    async _esperarModulo() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.flujoCaja) {
                    this.modulo = window.flujoCaja;
                    
                    // ✅ VERIFICAR que el módulo tenga la empresa correcta
                    const infoModulo = this.modulo.obtenerInfo();
                    if (infoModulo.empresaActual !== this.empresaActual) {
                        console.warn('⚠️ Módulo tiene empresa diferente. Esperando sincronización...');
                        setTimeout(verificar, 200);
                        return;
                    }
                    
                    console.log('✅ Módulo conectado a la UI con empresa:', infoModulo.empresaActual);
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

        // ⭐ CRÍTICO: Form transacción con preventDefault TRIPLE
        const form = document.getElementById('formTransaccion');
        if (form) {
            // ✅ Remover listeners duplicados
            const formLimpio = form.cloneNode(true);
            form.parentNode.replaceChild(formLimpio, form);
            
            // ✅ Agregar listener ÚNICO
            formLimpio.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                console.log('📝 [SUBMIT] Evento capturado');
                this.guardarTransaccion(e);
                
                return false;
            }, true);
            
            console.log('✅ Evento submit configurado');
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

        // ✅ MEJORADO: Listener para cambio de empresa
        document.addEventListener('grizalumCompanyChanged', (e) => {
            console.log('\n🔄 ═══════════════════════════════════════');
            console.log('🔄 CAMBIO DE EMPRESA DETECTADO');
            console.log('🔄 ═══════════════════════════════════════');
            
            const nuevaEmpresa = e.detail?.empresaId 
                || e.detail?.empresa 
                || this._obtenerEmpresaActual();
            
            console.log('📋 Empresa anterior:', this.empresaActual);
            console.log('📋 Empresa nueva:', nuevaEmpresa);
            
            if (nuevaEmpresa === this.empresaActual) {
                console.log('⚠️ Es la misma empresa, ignorando...');
                return;
            }
            
            // Actualizar empresa actual
            this.empresaActual = nuevaEmpresa;
            
            // Actualizar historial
            this.historial.setEmpresa(nuevaEmpresa);
            console.log('✅ Historial actualizado a:', nuevaEmpresa);
            
            // Limpiar UI inmediatamente
            const listaTransacciones = document.getElementById('listaTransacciones');
            if (listaTransacciones) {
                listaTransacciones.innerHTML = '<div class="cargando" style="text-align: center; padding: 2rem; color: var(--texto-terciario);">🔄 Cargando datos de ' + nuevaEmpresa + '...</div>';
            }
            
            // ✅ Limpiar balance
            const balanceTotal = document.getElementById('balanceTotal');
            const totalIngresos = document.getElementById('totalIngresos');
            const totalGastos = document.getElementById('totalGastos');
            
            if (balanceTotal) balanceTotal.textContent = 'S/. 0.00';
            if (totalIngresos) totalIngresos.textContent = 'S/. 0.00';
            if (totalGastos) totalGastos.textContent = 'S/. 0.00';
            
            // ✅ Esperar a que el módulo se actualice ANTES de recargar
            let intentos = 0;
            const esperarModulo = setInterval(() => {
                intentos++;
                
                const infoModulo = this.modulo?.obtenerInfo();
                const empresaModulo = infoModulo?.empresaActual;
                
                console.log(`🔍 Intento ${intentos}: Módulo empresa = ${empresaModulo}, Esperando = ${nuevaEmpresa}`);
                
                if (empresaModulo === nuevaEmpresa) {
                    clearInterval(esperarModulo);
                    console.log('✅ Módulo sincronizado, recargando UI...');
                    
                    setTimeout(() => {
                        this.cargarBalance();
                        this.cargarTransacciones();
                        this.cargarNivel();
                        this.cargarCategorias();
                        console.log('✅ UI actualizada para empresa:', nuevaEmpresa);
                    }, 100);
                    
                } else if (intentos > 20) {
                    clearInterval(esperarModulo);
                    console.error('❌ Timeout esperando sincronización del módulo');
                    
                    // Forzar recarga de todos modos
                    setTimeout(() => {
                        this.cargarBalance();
                        this.cargarTransacciones();
                        this.cargarNivel();
                        this.cargarCategorias();
                    }, 100);
                }
            }, 150);
            
            console.log('🔄 ═══════════════════════════════════════\n');
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
        // ✅ VERIFICAR empresa antes de cargar
        const infoModulo = this.modulo.obtenerInfo();
        if (infoModulo.empresaActual !== this.empresaActual) {
            console.warn('⚠️ cargarBalance: Empresa desincronizada, esperando...');
            return;
        }
        
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
        // ✅ VERIFICAR empresa antes de cargar
        const infoModulo = this.modulo.obtenerInfo();
        if (infoModulo.empresaActual !== this.empresaActual) {
            console.warn('⚠️ cargarTransacciones: Empresa desincronizada, esperando...');
            return;
        }
        
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
        
        console.log(`✅ ${transacciones.length} transacciones cargadas para ${this.empresaActual}`);
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
            
            console.log('📋 Modal abierto - Modo:', modoEdicion ? 'EDICIÓN' : 'NUEVA');
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
    
    guardarTransaccion(event) {
        console.log('\n🎯 ═══════════════════════════════════════');
        console.log('🎯 GUARDANDO TRANSACCIÓN');
        console.log('🎯 Empresa actual:', this.empresaActual);
        console.log('🎯 ═══════════════════════════════════════\n');
        
        // ⭐ PREVENIR RECARGA (TRIPLE SEGURO)
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        
        try {
            // Obtener datos del formulario
            const form = document.getElementById('formTransaccion');
            const tipo = form.querySelector('input[name="tipo"]:checked')?.value;
            const monto = parseFloat(document.getElementById('inputMonto').value);
            const categoria = document.getElementById('selectCategoria').value;
            const descripcion = document.getElementById('inputDescripcion').value;
            const fecha = document.getElementById('inputFecha').value;
            
            console.log('📦 Datos:', {tipo, monto, categoria, descripcion, fecha});
            
            // Validaciones
            if (!tipo || !monto || !categoria || !fecha) {
                alert('⚠️ Por favor completa todos los campos obligatorios');
                return false;
            }
            
            if (isNaN(monto) || monto <= 0) {
                alert('⚠️ El monto debe ser un número mayor a 0');
                return false;
            }
            
            // ✅ VERIFICAR empresa ANTES de guardar
            const infoModulo = this.modulo.obtenerInfo();
            if (infoModulo.empresaActual !== this.empresaActual) {
                console.error('❌ ERROR: Empresa desincronizada');
                alert('❌ Error: La empresa cambió durante la operación. Recarga la página.');
                return false;
            }
            
            // Crear objeto de transacción
            const transaccion = {
                tipo: tipo,
                monto: monto,
                categoria: categoria,
                descripcion: descripcion || categoria,
                fecha: new Date(fecha).toISOString(),
                metodoPago: document.getElementById('selectMetodo')?.value || 'efectivo',
                notas: document.getElementById('inputNotas')?.value || ''
            };
            
            console.log('💾 Guardando para empresa:', this.empresaActual);
            
            // Guardar en el módulo
            const resultado = this.modulo.agregarTransaccion(transaccion);
            
            console.log('✅ GUARDADO EXITOSO');
            console.log('📋 ID:', resultado.id);
            console.log('🏢 EmpresaId:', resultado.empresaId);
            
            // ✅ Guardar descripción en historial
            if (descripcion.trim()) {
                this.historial.agregar(descripcion, tipo);
            }
            
            // Cerrar modal
            this.cerrarModalTransaccion();
            
            // Limpiar formulario
            form.reset();
            document.getElementById('inputFecha').valueAsDate = new Date();
            
            // Recargar datos
            setTimeout(() => {
                this.cargarBalance();
                this.cargarTransacciones();
            }, 100);
            
            // Notificación
            this.mostrarNotificacion('✅ Transacción guardada en ' + this.empresaActual, 'success');
            
            console.log('🎉 ═══════════════════════════════════════\n');
            
        } catch (error) {
            console.error('❌ ERROR:', error);
            alert('❌ Error al guardar: ' + error.message);
        }
        
        return false;
    }

    editarTransaccion(id) {
        console.log('✏️ editarTransaccion:', id);
        
        const transaccion = this.modulo.obtenerTransacciones().find(t => t.id === id);
        if (!transaccion) {
            console.error('❌ Transacción no encontrada');
            return;
        }

        this.transaccionEditando = id;

        // Rellenar formulario
        const radioTipo = document.querySelector(`input[name="tipo"][value="${transaccion.tipo}"]`);
        if (radioTipo) {
            radioTipo.checked = true;
            this.actualizarCategoriasSegunTipo();
        }

        document.getElementById('inputMonto').value = transaccion.monto;
        document.getElementById('selectCategoria').value = transaccion.categoria;
        document.getElementById('inputDescripcion').value = transaccion.descripcion;
        document.getElementById('inputFecha').value = transaccion.fecha.split('T')[0];
        document.getElementById('selectMetodo').value = transaccion.metodoPago || 'efectivo';
        document.getElementById('inputNotas').value = transaccion.notas || '';
        
        this.abrirModalTransaccion(true);
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
        console.log('📊 Exportando datos de', this.empresaActual);
        
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

            const datosExportar = {
                empresa: this.empresaActual,
                balance: balance,
                transacciones: transacciones,
                nivel: 0
            };

            const exportador = new ExportadorExcelProfesional();
            await exportador.exportar(datosExportar);
            
            this.mostrarNotificacion('✅ Excel exportado', 'success');
            
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
            contenedor.innerHTML = '<div class="sugerencias-vacio">Sin historial aún.</div>';
        } else {
            contenedor.innerHTML = sugerencias.map(desc => `
                <div class="sugerencia-item" data-descripcion="${desc}">
                    <span class="sugerencia-texto">${desc}</span>
                    <button class="sugerencia-eliminar" data-descripcion="${desc}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            contenedor.querySelectorAll('.sugerencia-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.sugerencia-eliminar')) {
                        inputDescripcion.value = item.dataset.descripcion;
                        this.ocultarSugerencias();
                    }
                });
            });

            contenedor.querySelectorAll('.sugerencia-eliminar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.eliminarSugerencia(btn.dataset.descripcion, tipo);
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
                    <button class="sugerencia-eliminar" data-descripcion="${desc}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            contenedor.querySelectorAll('.sugerencia-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('.sugerencia-eliminar')) {
                        document.getElementById('inputDescripcion').value = item.dataset.descripcion;
                        this.ocultarSugerencias();
                    }
                });
            });

            contenedor.querySelectorAll('.sugerencia-eliminar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.eliminarSugerencia(btn.dataset.descripcion, tipo);
                });
            });
        }

        contenedor.style.display = 'block';
    }

    ocultarSugerencias() {
        const contenedor = document.getElementById('sugerenciasDescripcion');
        if (contenedor) contenedor.style.display = 'none';
    }

    eliminarSugerencia(descripcion, tipo) {
        if (confirm(`¿Eliminar "${descripcion}" del historial?`)) {
            this.historial.eliminar(descripcion, tipo);
            this.mostrarSugerencias();
            this.mostrarNotificacion('🗑️ Eliminado', 'success');
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTAR E INICIALIZAR
// ═══════════════════════════════════════════════════════════════

window.FlujoCajaUI = FlujoCajaUI;

let flujoCajaUIInstancia = null;

function inicializarFlujoCajaUI() {
    console.log('🚀 Inicializando Flujo de Caja UI...');
    
    if (!flujoCajaUIInstancia) {
        flujoCajaUIInstancia = new FlujoCajaUI();
        window.flujoCajaUI = flujoCajaUIInstancia;
    }
}

window.addEventListener('flujoCajaVisible', inicializarFlujoCajaUI);

if (document.readyState === 'complete') {
    inicializarFlujoCajaUI();
} else {
    window.addEventListener('load', inicializarFlujoCajaUI);
}

// Funciones globales
window.abrirModalTransaccion = function() {
    if (window.flujoCajaUI) window.flujoCajaUI.abrirModalTransaccion();
};

window.editarTransaccion = function(id) {
    if (window.flujoCajaUI) window.flujoCajaUI.editarTransaccion(id);
};

window.eliminarTransaccion = function(id) {
    if (window.flujoCajaUI) window.flujoCajaUI.eliminarTransaccion(id);
};

console.log('✅ [flujo-caja-ui.js v5.0 MULTI-EMPRESA] Módulo cargado');
