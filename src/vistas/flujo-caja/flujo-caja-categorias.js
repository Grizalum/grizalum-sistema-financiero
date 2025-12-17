/**
 * ═══════════════════════════════════════════════════════════════════
 * 💰 GRIZALUM - INICIALIZADOR DE CATEGORÍAS FLUJO DE CAJA v2.0
 * CON SISTEMA DE CATEGORÍAS PERSONALIZADAS
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('📦 [Categorías] Módulo v2.0 cargado');

    // ═══════════════════════════════════════════════════════════════
    // 🎯 FUNCIÓN PRINCIPAL: INICIALIZAR CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════
    function inicializarCategorias() {
        console.log('🔧 [Categorías] Inicializando...');
        
        // Esperar a que categoriasPersonalizadas esté listo
        const esperarSistema = setInterval(() => {
            if (window.categoriasPersonalizadas) {
                clearInterval(esperarSistema);
                
                // Configurar select del modal
                const selectModal = document.getElementById('selectCategoria');
                if (selectModal) {
                    configurarSelectModal(selectModal);
                    configurarEventosTipo(selectModal);
                    configurarBotonAgregar();
                }
                
                // Configurar select del filtro
                const selectFiltro = document.getElementById('filtroCategoria');
                if (selectFiltro) {
                    cargarCategoriasEnFiltro(selectFiltro);
                }
                
                console.log('✅ [Categorías] Sistema inicializado');
            }
        }, 100);
    }

    // ═══════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURAR SELECT DEL MODAL
    // ═══════════════════════════════════════════════════════════════
    function configurarSelectModal(select) {
        // Cargar categorías iniciales (ingresos por default)
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value || 'ingreso';
        cargarCategoriasSegunTipo(tipo, select);
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔄 CARGAR CATEGORÍAS SEGÚN TIPO
    // ═══════════════════════════════════════════════════════════════
    function cargarCategoriasSegunTipo(tipo, select) {
        if (!select) {
            select = document.getElementById('selectCategoria');
        }
        
        if (!select || !window.categoriasPersonalizadas) {
            console.error('❌ [Categorías] Select o sistema no disponible');
            return;
        }
        
        // Obtener categorías (default + personalizadas)
        const categorias = window.categoriasPersonalizadas.obtenerCategorias(tipo);
        
        // Limpiar select
        select.innerHTML = '';
        
        // Opción por defecto
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Selecciona una categoría';
        optionDefault.disabled = true;
        optionDefault.selected = true;
        select.appendChild(optionDefault);
        
        // Agregar categorías
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            
            // Marcar si es personalizada
            const esPersonalizada = window.categoriasPersonalizadas.esPersonalizada(tipo, categoria);
            option.textContent = categoria;
            option.dataset.personalizada = esPersonalizada;
            option.dataset.categoria = categoria;
            
            select.appendChild(option);
        });
        
        console.log(`✅ [Categorías] ${categorias.length} categorías cargadas (${tipo})`);
    }

    // ═══════════════════════════════════════════════════════════════
    // 🗑️ CONFIGURAR ELIMINACIÓN DE CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════════
    // ➕ CONFIGURAR BOTÓN AGREGAR
    // ═══════════════════════════════════════════════════════════════
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
                    
                    // Recargar select
                    const select = document.getElementById('selectCategoria');
                    cargarCategoriasSegunTipo(tipo, select);
                    
                    // Actualizar filtro
                    actualizarSelectFiltro();
                    
                    // Seleccionar la nueva categoría
                    select.value = nombre.trim();
                    
                    alert(`✅ Categoría "${nombre.trim()}" agregada`);
                } catch (error) {
                    alert(`❌ ${error.message}`);
                }
            }
        });
        
        console.log('✅ [Categorías] Botón agregar configurado');
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔍 CARGAR CATEGORÍAS EN FILTRO
    // ═══════════════════════════════════════════════════════════════
    function cargarCategoriasEnFiltro(select) {
        if (!select || !window.categoriasPersonalizadas) return;
        
        // Obtener TODAS las categorías (ingresos + gastos)
        const categoriasIngresos = window.categoriasPersonalizadas.obtenerCategorias('ingreso');
        const categoriasGastos = window.categoriasPersonalizadas.obtenerCategorias('gasto');
        const todasCategorias = [...new Set([...categoriasIngresos, ...categoriasGastos])];
        
        // Limpiar select
        select.innerHTML = '';
        
        // Opción "Todas"
        const optionTodas = document.createElement('option');
        optionTodas.value = '';
        optionTodas.textContent = 'Todas las categorías';
        select.appendChild(optionTodas);
        
        // Agregar todas las categorías
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

    // ═══════════════════════════════════════════════════════════════
    // 🎛️ CONFIGURAR EVENTOS DE TIPO
    // ═══════════════════════════════════════════════════════════════
    function configurarEventosTipo(select) {
        const radiosTipo = document.querySelectorAll('input[name="tipo"]');
        
        radiosTipo.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const tipo = e.target.value;
                cargarCategoriasSegunTipo(tipo, select);
                configurarEliminacionCategorias(select);
            });
        });
        
        // Configurar eliminación inicial
        configurarEliminacionCategorias(select);
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔄 ESCUCHAR EVENTOS GLOBALES
    // ═══════════════════════════════════════════════════════════════
    
    // Evento: Categoría agregada
    document.addEventListener('grizalumCategoriaAgregada', () => {
        const select = document.getElementById('selectCategoria');
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
        if (select && tipo) {
            cargarCategoriasSegunTipo(tipo, select);
        }
        actualizarSelectFiltro();
    });
    
    // Evento: Categoría eliminada
    document.addEventListener('grizalumCategoriaEliminada', () => {
        const select = document.getElementById('selectCategoria');
        const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
        if (select && tipo) {
            cargarCategoriasSegunTipo(tipo, select);
        }
        actualizarSelectFiltro();
    });
    
    // Evento: Cambio de empresa
    document.addEventListener('grizalumCompanyChanged', () => {
        setTimeout(() => {
            inicializarCategorias();
        }, 300);
    });

    // ═══════════════════════════════════════════════════════════════
    // 🚀 INICIALIZACIÓN
    // ═══════════════════════════════════════════════════════════════
    function iniciar() {
        console.log('🚀 [Categorías] Iniciando módulo v2.0...');
        setTimeout(inicializarCategorias, 100);
        setTimeout(inicializarCategorias, 500);
        setTimeout(inicializarCategorias, 1000);
    }
    
    // Exponer funciones globales
    window.GRIZALUM_inicializarCategorias = inicializarCategorias;
    window.GRIZALUM_cargarCategoriasSegunTipo = cargarCategoriasSegunTipo;
    
    // Iniciar
    iniciar();
    
    console.log('✅ [Categorías] Módulo v2.0 completamente cargado');


    // Actualizar gestión cuando se agregan/eliminan categorías
    document.addEventListener('grizalumCategoriaAgregada', mostrarGestionCategorias);
    document.addEventListener('grizalumCategoriaEliminada', mostrarGestionCategorias);
    
    // Exponer funciones globalmente
    window.mostrarGestionCategorias = mostrarGestionCategorias;
    window.configurarBotonesGestion = configurarBotonesGestion;

    // ═══════════════════════════════════════════════════════════════
// 🎨 MOSTRAR BOTONES EDITAR/ELIMINAR AL SELECCIONAR CATEGORÍA
// ═══════════════════════════════════════════════════════════════

function configurarBotonesCategoria() {
    const select = document.getElementById('selectCategoria');
    const btnEditar = document.getElementById('btnEditarCategoria');
    const btnEliminar = document.getElementById('btnEliminarCategoria');
    
    if (!select || !btnEditar || !btnEliminar) return;
    
    // Mostrar botones cuando se selecciona una categoría
    select.addEventListener('change', function() {
        if (this.value) {
            btnEditar.style.display = 'block';
            btnEliminar.style.display = 'block';
        } else {
            btnEditar.style.display = 'none';
            btnEliminar.style.display = 'none';
        }
    });
    
    // BOTÓN EDITAR
    btnEditar.addEventListener('click', function() {
        const categoriaVieja = select.value;
        const tipo = document.querySelector('#formTransaccion input[name="tipo"]:checked')?.value;
        
        if (!categoriaVieja || !tipo) {
            alert('❌ Selecciona una categoría primero');
            return;
        }
        
        const nuevoNombre = prompt(`✏️ Editar categoría:\n\nNombre actual: ${categoriaVieja}\n\nNuevo nombre:`, categoriaVieja);
        
        if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoNombre.trim() !== categoriaVieja) {
            try {
                // Eliminar la vieja y agregar la nueva
                window.categoriasPersonalizadas.eliminarCategoria(tipo, categoriaVieja);
                window.categoriasPersonalizadas.agregarCategoria(tipo, nuevoNombre.trim());
                
                // Recargar
                cargarCategoriasSegunTipo(tipo, select);
                select.value = nuevoNombre.trim();
                actualizarSelectFiltro();
                
                alert(`✅ Categoría actualizada: "${categoriaVieja}" → "${nuevoNombre.trim()}"`);
            } catch (error) {
                alert(`❌ ${error.message}`);
            }
        }
    });
    
    // BOTÓN ELIMINAR
    btnEliminar.addEventListener('click', function() {
        const categoria = select.value;
        const tipo = document.querySelector('#formTransaccion input[name="tipo"]:checked')?.value;
        
        if (!categoria || !tipo) {
            alert('❌ Selecciona una categoría primero');
            return;
        }
        
        if (confirm(`¿Eliminar la categoría "${categoria}"?\n\nEsta acción no se puede deshacer.`)) {
            try {
                window.categoriasPersonalizadas.eliminarCategoria(tipo, categoria);
                
                // Recargar
                cargarCategoriasSegunTipo(tipo, select);
                actualizarSelectFiltro();
                
                // Ocultar botones
                btnEditar.style.display = 'none';
                btnEliminar.style.display = 'none';
                
                alert(`✅ Categoría "${categoria}" eliminada`);
            } catch (error) {
                alert(`❌ ${error.message}`);
            }
        }
    });
    
    console.log('✅ Botones editar/eliminar configurados');
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(configurarBotonesCategoria, 500);
});

window.configurarBotonesCategoria = configurarBotonesCategoria;
        
})();
