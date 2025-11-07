/**
 * ═══════════════════════════════════════════════════════════════════
 * 💰 GRIZALUM - INICIALIZADOR DE CATEGORÍAS FLUJO DE CAJA
 * ═══════════════════════════════════════════════════════════════════
 * VERSIÓN CORREGIDA: Carga AMBOS selects (modal + filtro)
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('📦 [Categorías] Módulo cargado');

    // ═══════════════════════════════════════════════════════════════
    // 📋 CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════
    const CATEGORIAS_FLUJO_CAJA = {
        ingresos: [
            'Ventas',
            'Servicios', 
            'Cobros a clientes',
            'Intereses bancarios',
            'Ingresos por inversión',
            'Préstamo recibido',
            'Subsidios/Donaciones',
            'Otros Ingresos'
        ],
        
        gastos: [
            'Compras de inventario',
            'Sueldos y salarios',
            'Alquiler',
            'Servicios (luz, agua, internet)',
            'Transporte y logística',
            'Marketing y publicidad',
            'Mantenimiento',
            'Impuestos y tasas',
            'Seguros',
            'Pago de préstamo',
            'Gastos Operativos',
            'Otros Gastos'
        ]
    };

    // ═══════════════════════════════════════════════════════════════
    // 🎯 FUNCIÓN PRINCIPAL: INICIALIZAR CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════
    function inicializarCategorias() {
        console.log('🔧 [Categorías] Buscando selects...');
        
        // ✅ CARGAR SELECT DEL MODAL
        const selectModal = document.getElementById('selectCategoria');
        
        if (selectModal) {
            console.log('✅ [Categorías] Select del modal encontrado');
            configurarSelectCategorias(selectModal);
            configurarEventosTipo(selectModal);
            
            const tipoInicial = document.querySelector('input[name="tipo"]:checked');
            const tipo = tipoInicial ? tipoInicial.value : 'ingreso';
            cargarCategoriasSegunTipo(tipo, selectModal);
        }
        
        // ✅ CARGAR SELECT DEL FILTRO
        const selectFiltro = document.getElementById('filtroCategoria');
        
        if (selectFiltro) {
            console.log('✅ [Categorías] Select del filtro encontrado');
            cargarCategoriasEnFiltro(selectFiltro);
        }
        
        // Si alguno no existe, buscar con reintentos
        if (!selectModal || !selectFiltro) {
            buscarSelectsConReintentos();
        }
        
        return (selectModal && selectFiltro);
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔄 BUSCAR SELECTS CON REINTENTOS
    // ═══════════════════════════════════════════════════════════════
    function buscarSelectsConReintentos() {
        let intentos = 0;
        const maxIntentos = 30;
        
        const buscarSelects = setInterval(function() {
            intentos++;
            
            const selectModal = document.getElementById('selectCategoria');
            const selectFiltro = document.getElementById('filtroCategoria');
            
            let modalCargado = false;
            let filtroCargado = false;
            
            // Cargar select del modal si existe y no está cargado
            if (selectModal && selectModal.options.length <= 1) {
                configurarSelectCategorias(selectModal);
                configurarEventosTipo(selectModal);
                
                const tipoInicial = document.querySelector('input[name="tipo"]:checked');
                const tipo = tipoInicial ? tipoInicial.value : 'ingreso';
                cargarCategoriasSegunTipo(tipo, selectModal);
                
                modalCargado = true;
                console.log('✅ [Categorías] Select del modal cargado en intento', intentos);
            }
            
            // Cargar select del filtro si existe y no está cargado
            if (selectFiltro && selectFiltro.options.length <= 1) {
                cargarCategoriasEnFiltro(selectFiltro);
                filtroCargado = true;
                console.log('✅ [Categorías] Select del filtro cargado en intento', intentos);
            }
            
            // Si ambos están cargados, detener
            if ((selectModal && selectModal.options.length > 1) && 
                (selectFiltro && selectFiltro.options.length > 1)) {
                clearInterval(buscarSelects);
                console.log('✅ [Categorías] Ambos selects cargados completamente');
            }
            
            // Si se alcanzó el máximo de intentos
            if (intentos >= maxIntentos) {
                clearInterval(buscarSelects);
                console.warn('⚠️ [Categorías] Máximo de intentos alcanzado');
            }
        }, 100);
    }

    // ═══════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURAR SELECT
    // ═══════════════════════════════════════════════════════════════
    function configurarSelectCategorias(select) {
        console.log('⚙️ [Categorías] Configurando select del modal...');
        
        window.__GRIZALUM_SELECT_CATEGORIA__ = select;
        
        window.actualizarCategoriasFlujoCaja = function(tipo) {
            cargarCategoriasSegunTipo(tipo, select);
        };
        
        console.log('✅ [Categorías] Select configurado');
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔄 CARGAR CATEGORÍAS SEGÚN TIPO (PARA EL MODAL)
    // ═══════════════════════════════════════════════════════════════
    function cargarCategoriasSegunTipo(tipo, select) {
        console.log(`📋 [Categorías] Cargando para tipo: ${tipo}`);
        
        if (!select) {
            select = window.__GRIZALUM_SELECT_CATEGORIA__ || document.getElementById('selectCategoria');
        }
        
        if (!select) {
            console.error('❌ [Categorías] Select del modal no disponible');
            return;
        }
        
        const categorias = tipo === 'ingreso' 
            ? CATEGORIAS_FLUJO_CAJA.ingresos 
            : CATEGORIAS_FLUJO_CAJA.gastos;
        
        select.innerHTML = '';
        
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Selecciona una categoría';
        optionDefault.disabled = true;
        optionDefault.selected = true;
        select.appendChild(optionDefault);
        
        categorias.forEach(function(categoria) {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            select.appendChild(option);
        });
        
        // Forzar re-render (compatibilidad Safari)
        select.blur();
        select.style.display = 'none';
        
        requestAnimationFrame(function() {
            select.style.display = '';
            select.selectedIndex = 0;
        });
        
        console.log(`✅ [Categorías] ${categorias.length} categorías de ${tipo} cargadas en modal`);
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔍 CARGAR CATEGORÍAS EN FILTRO (TODAS)
    // ═══════════════════════════════════════════════════════════════
    function cargarCategoriasEnFiltro(select) {
        console.log('📋 [Categorías] Cargando en filtro...');
        
        if (!select) {
            select = document.getElementById('filtroCategoria');
        }
        
        if (!select) {
            console.error('❌ [Categorías] Select del filtro no disponible');
            return;
        }
        
        // Obtener TODAS las categorías (ingresos + gastos)
        const todasCategorias = [
            ...CATEGORIAS_FLUJO_CAJA.ingresos,
            ...CATEGORIAS_FLUJO_CAJA.gastos
        ];
        
        // Limpiar select
        select.innerHTML = '';
        
        // Opción "Todas"
        const optionTodas = document.createElement('option');
        optionTodas.value = '';
        optionTodas.textContent = 'Todas las categorías';
        select.appendChild(optionTodas);
        
        // Agregar todas las categorías
        todasCategorias.forEach(function(categoria) {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            select.appendChild(option);
        });
        
        // Forzar re-render (compatibilidad Safari)
        select.blur();
        select.style.display = 'none';
        
        requestAnimationFrame(function() {
            select.style.display = '';
        });
        
        console.log(`✅ [Categorías] ${todasCategorias.length} categorías cargadas en filtro`);
    }

    // ═══════════════════════════════════════════════════════════════
    // 🎛️ CONFIGURAR EVENTOS
    // ═══════════════════════════════════════════════════════════════
    function configurarEventosTipo(select) {
        console.log('🎛️ [Categorías] Configurando eventos...');
        
        const radiosTipo = document.querySelectorAll('input[name="tipo"]');
        
        if (radiosTipo.length === 0) {
            console.warn('⚠️ [Categorías] Radio buttons no encontrados');
            return;
        }
        
        radiosTipo.forEach(function(radio) {
            const agregarEvento = window.agregarEventoSeguro || function(elemento, evento, callback) {
                elemento.addEventListener(evento, callback, false);
            };
            
            agregarEvento(radio, 'change', function(e) {
                const tipo = e.target.value;
                console.log(`🔄 [Categorías] Tipo cambiado a: ${tipo}`);
                cargarCategoriasSegunTipo(tipo, select);
            });
        });
        
        console.log('✅ [Categorías] Eventos configurados');
    }

    // ═══════════════════════════════════════════════════════════════
    // 🚀 INICIALIZACIÓN
    // ═══════════════════════════════════════════════════════════════
    
    function iniciar() {
        console.log('🚀 [Categorías] Iniciando módulo...');
        inicializarCategorias();
        console.log('✅ [Categorías] Módulo iniciado');
    }
    
    // Exponer funciones globales PRIMERO
    window.GRIZALUM_inicializarCategorias = inicializarCategorias;
    window.GRIZALUM_CATEGORIAS = CATEGORIAS_FLUJO_CAJA;
    window.GRIZALUM_cargarCategoriasEnFiltro = cargarCategoriasEnFiltro;
    
    // CRÍTICO: Ejecutar MÚLTIPLES veces para asegurar que se cargue
    setTimeout(iniciar, 100);
    setTimeout(iniciar, 500);
    setTimeout(iniciar, 1000);
    
    // Escuchar eventos de vista
    window.addEventListener('flujoCajaVisible', function() {
        console.log('📢 [Categorías] Vista visible, reinicializando...');
        setTimeout(inicializarCategorias, 200);
    });
    
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail && e.detail.to === 'flujo-caja') {
            console.log('📢 [Categorías] Sección cambiada a flujo-caja');
            setTimeout(inicializarCategorias, 200);
        }
    });
    
    console.log('✅ [Categorías] Módulo completamente cargado');

})();
