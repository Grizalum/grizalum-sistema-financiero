/**
 * ═══════════════════════════════════════════════════════════════════
 * 💰 GRIZALUM - INICIALIZADOR DE CATEGORÍAS FLUJO DE CAJA
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
        console.log('🔧 [Categorías] Buscando select...');
        
        // ✅ NUEVO: Intentar INMEDIATAMENTE primero
        const selectInmediato = document.getElementById('selectCategoria');
        
        if (selectInmediato) {
            console.log('✅ [Categorías] Select encontrado inmediatamente');
            configurarSelectCategorias(selectInmediato);
            configurarEventosTipo(selectInmediato);
            
            const tipoInicial = document.querySelector('input[name="tipo"]:checked');
            const tipo = tipoInicial ? tipoInicial.value : 'ingreso';
            cargarCategoriasSegunTipo(tipo, selectInmediato);
            
            return true;
        }
        
        // Si no existe, buscar con reintentos
        let intentos = 0;
        const maxIntentos = 30;
        
        const buscarSelect = setInterval(function() {
            intentos++;
            
            const selectCategoria = document.getElementById('selectCategoria');
            
            if (selectCategoria) {
                clearInterval(buscarSelect);
                console.log('✅ [Categorías] Select encontrado en intento', intentos);
                
                configurarSelectCategorias(selectCategoria);
                configurarEventosTipo(selectCategoria);
                
                const tipoInicial = document.querySelector('input[name="tipo"]:checked');
                if (tipoInicial) {
                    cargarCategoriasSegunTipo(tipoInicial.value, selectCategoria);
                } else {
                    cargarCategoriasSegunTipo('ingreso', selectCategoria);
                }
                
            } else if (intentos >= maxIntentos) {
                clearInterval(buscarSelect);
                console.warn('⚠️ [Categorías] Select no encontrado después de', maxIntentos, 'intentos');
            }
        }, 100);
        
        return false;
    }

    // ═══════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURAR SELECT
    // ═══════════════════════════════════════════════════════════════
    function configurarSelectCategorias(select) {
        console.log('⚙️ [Categorías] Configurando select...');
        
        window.__GRIZALUM_SELECT_CATEGORIA__ = select;
        
        window.actualizarCategoriasFlujoCaja = function(tipo) {
            cargarCategoriasSegunTipo(tipo, select);
        };
        
        console.log('✅ [Categorías] Select configurado');
    }

    // ═══════════════════════════════════════════════════════════════
    // 🔄 CARGAR CATEGORÍAS SEGÚN TIPO
    // ═══════════════════════════════════════════════════════════════
    function cargarCategoriasSegunTipo(tipo, select) {
        console.log(`📋 [Categorías] Cargando para tipo: ${tipo}`);
        
        if (!select) {
            select = window.__GRIZALUM_SELECT_CATEGORIA__ || document.getElementById('selectCategoria');
        }
        
        if (!select) {
            console.error('❌ [Categorías] Select no disponible');
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
        
        console.log(`✅ [Categorías] ${categorias.length} categorías de ${tipo} cargadas`);
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
