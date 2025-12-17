/**
 * ═══════════════════════════════════════════════════════════════════
 * 💰 GRIZALUM - CATEGORÍAS v5.0 DEFINITIVO - SIN BUGS
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('📦 [Categorías v5.0] Módulo cargado');

    // ═══════════════════════════════════════════════════════════════
    // 🎯 INICIALIZAR
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
                    configurarBotonesEditarEliminar();
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

    // ═══════════════════════════════════════════════════════════════
    // 🔄 CARGAR CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════
    function cargarCategoriasSegunTipo(tipo, select) {
        if (!select) {
            select = document.getElementById('selectCategoria');
        }
        
        if (!select || !window.categoriasPersonalizadas) {
            console.error('❌ Select o sistema no disponible');
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
            option.textContent = categoria;
            select.appendChild(option);
        });
        
        console.log(`✅ ${categorias.length} categorías cargadas (${tipo})`);
    }

    // ═══════════════════════════════════════════════════════════════
    // ➕ BOTÓN AGREGAR
    // ═══════════════════════════════════════════════════════════════
    function configurarBotonAgregar() {
        const btnAgregar = document.getElementById('btnAgregarCategoria');
        
        if (!btnAgregar) {
            console.warn('⚠️ Botón agregar no encontrado');
            return;
        }
        
        // Remover listeners anteriores
        const nuevoBtn = btnAgregar.cloneNode(true);
        btnAgregar.parentNode.replaceChild(nuevoBtn, btnAgregar);
        
        nuevoBtn.addEventListener('click', () => {
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
                    
                    alert(`✅ Categoría "${nombre.trim()}" agregada`);
                } catch (error) {
                    alert(`❌ ${error.message}`);
                }
            }
        });
        
        console.log('✅ Botón agregar configurado');
    }

    // ═══════════════════════════════════════════════════════════════
    // ✏️❌ BOTONES EDITAR Y ELIMINAR
    // ═══════════════════════════════════════════════════════════════
    function configurarBotonesEditarEliminar() {
        const btnEditar = document.getElementById('btnEditarCategoria');
        const btnEliminar = document.getElementById('btnEliminarCategoria');
        
        if (!btnEditar || !btnEliminar) {
            console.error('❌ Botones no encontrados');
            return;
        }
        
        // Mostrar botones
        btnEditar.style.display = 'block';
        btnEliminar.style.display = 'block';
        
        // Remover listeners anteriores
        const nuevoEditar = btnEditar.cloneNode(true);
        const nuevoEliminar = btnEliminar.cloneNode(true);
        btnEditar.parentNode.replaceChild(nuevoEditar, btnEditar);
        btnEliminar.parentNode.replaceChild(nuevoEliminar, btnEliminar);
        
        // EDITAR
        nuevoEditar.addEventListener('click', (e) => {
            e.preventDefault();
            
            const select = document.getElementById('selectCategoria');
            const categoriaVieja = select.value;
            const tipo = document.querySelector('#formTransaccion input[name="tipo"]:checked')?.value;
            
            if (!categoriaVieja || !tipo) {
                alert('❌ Selecciona una categoría primero');
                return;
            }
            
            const nuevoNombre = prompt(
                `✏️ Editar categoría:\n\nNombre actual: ${categoriaVieja}\n\nNuevo nombre:`,
                categoriaVieja
            );
            
            if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoNombre.trim() !== categoriaVieja) {
                try {
                    window.categoriasPersonalizadas.eliminarCategoria(tipo, categoriaVieja);
                    window.categoriasPersonalizadas.agregarCategoria(tipo, nuevoNombre.trim());
                    
                    cargarCategoriasSegunTipo(tipo, select);
                    select.value = nuevoNombre.trim();
                    actualizarSelectFiltro();
                    
                    alert(`✅ Categoría actualizada`);
                } catch (error) {
                    alert(`❌ ${error.message}`);
                }
            }
        });
        
        // ELIMINAR
        nuevoEliminar.addEventListener('click', (e) => {
            e.preventDefault();
            
            const select = document.getElementById('selectCategoria');
            const categoria = select.value;
            const tipo = document.querySelector('#formTransaccion input[name="tipo"]:checked')?.value;
            
            if (!categoria || !tipo) {
                alert('❌ Selecciona una categoría primero');
                return;
            }
            
            if (confirm(`¿Eliminar "${categoria}"?`)) {
                try {
                    window.categoriasPersonalizadas.eliminarCategoria(tipo, categoria);
                    
                    cargarCategoriasSegunTipo(tipo, select);
                    actualizarSelectFiltro();
                    select.value = '';
                    
                    alert(`✅ Categoría eliminada`);
                } catch (error) {
                    alert(`❌ ${error.message}`);
                }
            }
        });
        
        console.log('✅ Botones editar/eliminar configurados');
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔍 FILTRO
    // ═══════════════════════════════════════════════════════════════
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
    }

    function actualizarSelectFiltro() {
        const selectFiltro = document.getElementById('filtroCategoria');
        if (selectFiltro) {
            cargarCategoriasEnFiltro(selectFiltro);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // 🎛️ EVENTOS DE TIPO
    // ═══════════════════════════════════════════════════════════════
    function configurarEventosTipo(select) {
        const radiosTipo = document.querySelectorAll('input[name="tipo"]');
        
        radiosTipo.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const tipo = e.target.value;
                cargarCategoriasSegunTipo(tipo, select);
            });
        });
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

    // ═══════════════════════════════════════════════════════════════
    // 🚀 INICIAR
    // ═══════════════════════════════════════════════════════════════
    window.GRIZALUM_inicializarCategorias = inicializarCategorias;
    window.GRIZALUM_cargarCategoriasSegunTipo = cargarCategoriasSegunTipo;
    
    setTimeout(inicializarCategorias, 300);
    
    console.log('✅ [Categorías v5.0] Completamente cargado');

})();
