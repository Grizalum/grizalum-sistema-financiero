/**
 * ═══════════════════════════════════════════════════════════════════
 * 💰 GRIZALUM - INICIALIZADOR DE CATEGORÍAS FLUJO DE CAJA v3.0
 * CON BOTONES EDITAR/ELIMINAR FUNCIONALES
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('📦 [Categorías] Módulo v3.0 cargado');

    // ═══════════════════════════════════════════════════════════════
    // 🎯 FUNCIÓN PRINCIPAL: INICIALIZAR CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════
    function inicializarCategorias() {
        console.log('🔧 [Categorías] Inicializando...');
        
        const esperarSistema = setInterval(() => {
            if (window.categoriasPersonalizadas) {
                clearInterval(esperarSistema);
                
                const selectModal = document.getElementById('selectCategoria');
                if (selectModal) {
                    configurarSelectModal(selectModal);
                    configurarEventosTipo(selectModal);
                    configurarBotonAgregar();
                    // ✅ CONFIGURAR BOTONES INMEDIATAMENTE
                    configurarBotonesCategoria();
                }
                
                const selectFiltro = document.getElementById('filtroCategoria');
                if (selectFiltro) {
                    cargarCategoriasEnFiltro(selectFiltro);
                }
                
                console.log('✅ [Categorías] Sistema inicializado');
            }
        }, 100);
    }

    function configurarSelectModal(select) {
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value || 'ingreso';
        cargarCategoriasSegunTipo(tipo, select);
    }

    function cargarCategoriasSegunTipo(tipo, select) {
        if (!select) {
            select = document.getElementById('selectCategoria');
        }
        
        if (!select || !window.categoriasPersonalizadas) {
            console.error('❌ [Categorías] Select o sistema no disponible');
            return;
        }
        
        const categorias = window.categoriasPersonalizadas.obtenerCategorias(tipo);
        
        select.innerHTML = '';
        
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Selecciona una categoría';
        optionDefault.disabled = true;
        optionDefault.selected = true;
        select.appendChild(optionDefault);
        
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            
            const esPersonalizada = window.categoriasPersonalizadas.esPersonalizada(tipo, categoria);
            option.textContent = categoria;
            option.dataset.personalizada = esPersonalizada;
            option.dataset.categoria = categoria;
            
            select.appendChild(option);
        });
        
        console.log(`✅ [Categorías] ${categorias.length} categorías cargadas (${tipo})`);
    }

    function configurarEliminacionCategorias(select) {
        select.addEventListener('dblclick', (e) => {
            const option = e.target;
            
            if (option.tagName === 'OPTION' && option.dataset.personalizada === 'true') {
                const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
                const categoria = option.dataset.categoria;
                
                if (confirm(`¿Eliminar la categoría "${categoria}"?`)) {
                    try {
                        window.categoriasPersonalizadas.eliminarCategoria(tipo, categoria);
                        cargarCategoriasSegunTipo(tipo, select);
                        actualizarSelectFiltro();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            }
        });
    }

    function configurarBotonAgregar() {
        const btnAgregar = document.getElementById('btnAgregarCategoria');
        
        if (!btnAgregar) {
            console.warn('⚠️ [Categorías] Botón agregar no encontrado');
            return;
        }
        
        btnAgregar.addEventListener('click', () => {
            const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
            const tipoTexto = tipo === 'ingreso' ? 'ingreso' : 'gasto';
            
            const nombre = prompt(`Nueva categoría de ${tipoTexto}:`);
            
            if (nombre && nombre.trim() !== '') {
                try {
                    window.categoriasPersonalizadas.agregarCategoria(tipo, nombre);
                    
                    const select = document.getElementById('selectCategoria');
                    cargarCategoriasSegunTipo(tipo, select);
                    
                    actualizarSelectFiltro();
                    
                    select.value = nombre.trim();
                    
                    // ✅ MOSTRAR BOTONES DESPUÉS DE AGREGAR
                    const btnEditar = document.getElementById('btnEditarCategoria');
                    const btnEliminar = document.getElementById('btnEliminarCategoria');
                    if (btnEditar && btnEliminar) {
                        btnEditar.style.display = 'block';
                        btnEliminar.style.display = 'block';
                    }
                    
                    alert(`✅ Categoría "${nombre.trim()}" agregada`);
                } catch (error) {
                    alert(`❌ ${error.message}`);
                }
            }
        });
        
        console.log('✅ [Categorías] Botón agregar configurado');
    }

    function cargarCategoriasEnFiltro(select) {
        if (!select || !window.categoriasPersonalizadas) return;
        
        const categoriasIngresos = window.categoriasPersonalizadas.obtenerCategorias('ingreso');
        const categoriasGastos = window.categoriasPersonalizadas.obtenerCategorias('gasto');
        const todasCategorias = [...new Set([...categoriasIngresos, ...categoriasGastos])];
        
        select.innerHTML = '';
        
        const optionTodas = document.createElement('option');
        optionTodas.value = '';
        optionTodas.textContent = 'Todas las categorías';
        select.appendChild(optionTodas);
        
        todasCategorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            select.appendChild(option);
        });
        
        console.log(`✅ [Categorías] ${todasCategorias.length} categorías en filtro`);
    }

    function actualizarSelectFiltro() {
        const selectFiltro = document.getElementById('filtroCategoria');
        if (selectFiltro) {
            cargarCategoriasEnFiltro(selectFiltro);
        }
    }

    function configurarEventosTipo(select) {
        const radiosTipo = document.querySelectorAll('input[name="tipo"]');
        
        radiosTipo.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const tipo = e.target.value;
                cargarCategoriasSegunTipo(tipo, select);
                configurarEliminacionCategorias(select);
            });
        });
        
        configurarEliminacionCategorias(select);
    }

    // ═══════════════════════════════════════════════════════════════
    // 🎨 CONFIGURAR BOTONES EDITAR/ELIMINAR - SIEMPRE VISIBLES
    // ═══════════════════════════════════════════════════════════════
    function configurarBotonesCategoria() {
        const select = document.getElementById('selectCategoria');
        const btnEditar = document.getElementById('btnEditarCategoria');
        const btnEliminar = document.getElementById('btnEliminarCategoria');
        
        if (!select || !btnEditar || !btnEliminar) {
            console.error('❌ [Botones] Elementos no encontrados');
            return;
        }
        
        console.log('🔧 [Botones] Configurando...');
        
        // ✅ MOSTRAR BOTONES SIEMPRE
        btnEditar.style.display = 'block';
        btnEliminar.style.display = 'block';
        
        // ✅ BOTÓN EDITAR
        btnEditar.addEventListener('click', function(e) {
            e.preventDefault();
            const categoriaVieja = select.value;
            const tipo = document.querySelector('#formTransaccion input[name="tipo"]:checked')?.value;
            
            if (!categoriaVieja || !tipo) {
                alert('❌ Selecciona una categoría primero');
                return;
            }
            
            const nuevoNombre = prompt(`✏️ Editar categoría:\n\nNombre actual: ${categoriaVieja}\n\nNuevo nombre:`, categoriaVieja);
            
            if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoNombre.trim() !== categoriaVieja) {
                try {
                    window.categoriasPersonalizadas.eliminarCategoria(tipo, categoriaVieja);
                    window.categoriasPersonalizadas.agregarCategoria(tipo, nuevoNombre.trim());
                    
                    cargarCategoriasSegunTipo(tipo, select);
                    select.value = nuevoNombre.trim();
                    actualizarSelectFiltro();
                    
                    btnEditar.style.display = 'block';
                    btnEliminar.style.display = 'block';
                    
                    alert(`✅ Categoría actualizada: "${categoriaVieja}" → "${nuevoNombre.trim()}"`);
                } catch (error) {
                    alert(`❌ ${error.message}`);
                }
            }
        });
        
        // ✅ BOTÓN ELIMINAR
        btnEliminar.addEventListener('click', function(e) {
            e.preventDefault();
            const categoria = select.value;
            const tipo = document.querySelector('#formTransaccion input[name="tipo"]:checked')?.value;
            
            if (!categoria || !tipo) {
                alert('❌ Selecciona una categoría primero');
                return;
            }
            
            if (confirm(`¿Eliminar la categoría "${categoria}"?\n\nEsta acción no se puede deshacer.`)) {
                try {
                    window.categoriasPersonalizadas.eliminarCategoria(tipo, categoria);
                    
                    cargarCategoriasSegunTipo(tipo, select);
                    actualizarSelectFiltro();
                    
                    btnEditar.style.display = 'none';
                    btnEliminar.style.display = 'none';
                    
                    alert(`✅ Categoría "${categoria}" eliminada`);
                } catch (error) {
                    alert(`❌ ${error.message}`);
                }
            }
        });
        
        console.log('✅ [Botones] Configuración completa');
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔄 EVENTOS GLOBALES
    // ═══════════════════════════════════════════════════════════════
    
    document.addEventListener('grizalumCategoriaAgregada', () => {
        const select = document.getElementById('selectCategoria');
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
        if (select && tipo) {
            cargarCategoriasSegunTipo(tipo, select);
        }
        actualizarSelectFiltro();
    });
    
    document.addEventListener('grizalumCategoriaEliminada', () => {
        const select = document.getElementById('selectCategoria');
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
        if (select && tipo) {
            cargarCategoriasSegunTipo(tipo, select);
        }
        actualizarSelectFiltro();
    });
    
    document.addEventListener('grizalumCompanyChanged', () => {
        setTimeout(() => {
            inicializarCategorias();
        }, 300);
    });

    // ═══════════════════════════════════════════════════════════════
    // 🚀 INICIALIZACIÓN
    // ═══════════════════════════════════════════════════════════════
    function iniciar() {
        console.log('🚀 [Categorías] Iniciando módulo v3.0...');
        setTimeout(inicializarCategorias, 100);
        setTimeout(inicializarCategorias, 500);
        setTimeout(inicializarCategorias, 1000);
    }
    
    window.GRIZALUM_inicializarCategorias = inicializarCategorias;
    window.GRIZALUM_cargarCategoriasSegunTipo = cargarCategoriasSegunTipo;
    window.configurarBotonesCategoria = configurarBotonesCategoria;
    
    iniciar();
    
    console.log('✅ [Categorías] Módulo v3.0 completamente cargado');

})();
