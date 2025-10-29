/**
 * ═══════════════════════════════════════════════════════════════════
 * 💰 GRIZALUM - INICIALIZADOR DE CATEGORÍAS FLUJO DE CAJA
 * ═══════════════════════════════════════════════════════════════════
 * Compatible con Safari, Chrome, Edge, Firefox
 * Se integra con el sistema de carga dinámica de vistas
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('🔧 [Categorías] Inicializando módulo...');

    // ═══════════════════════════════════════════════════════════════
    // 📋 CATEGORÍAS MEJORADAS (conservando las existentes + nuevas)
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
        
        let intentos = 0;
        const maxIntentos = 30;
        
        const buscarSelect = setInterval(function() {
            intentos++;
            
            // Buscar el select
            const selectCategoria = document.getElementById('selectCategoria');
            
            if (selectCategoria) {
                clearInterval(buscarSelect);
                console.log('✅ [Categorías] Select encontrado');
                
                // Configurar select
                configurarSelectCategorias(selectCategoria);
                
                // Configurar eventos de cambio de tipo
                configurarEventosTipo(selectCategoria);
                
                // Cargar categorías iniciales
                const tipoInicial = document.querySelector('input[name="tipo"]:checked');
                if (tipoInicial) {
                    cargarCategoriasSegunTipo(tipoInicial.value, selectCategoria);
                }
                
            } else if (intentos >= maxIntentos) {
                clearInterval(buscarSelect);
                console.warn('⚠️ [Categorías] Select no encontrado después de', intentos, 'intentos');
            }
        }, 100);
    }

    // ═══════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURAR SELECT DE CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════
    function configurarSelectCategorias(select) {
        console.log('⚙️ [Categorías] Configurando select...');
        
        // Guardar referencia global para uso posterior
        window.__GRIZALUM_SELECT_CATEGORIA__ = select;
        
        // Función global para actualizar categorías
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
        
        // Obtener categorías según el tipo
        const categorias = tipo === 'ingreso' 
            ? CATEGORIAS_FLUJO_CAJA.ingresos 
            : CATEGORIAS_FLUJO_CAJA.gastos;
        
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
        categorias.forEach(function(categoria) {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            select.appendChild(option);
        });
        
        // CRÍTICO PARA SAFARI: Forzar re-render
        select.blur();
        select.style.display = 'none';
        
        // Usar requestAnimationFrame para el timing correcto
        requestAnimationFrame(function() {
            select.style.display = '';
            select.selectedIndex = 0;
        });
        
        console.log(`✅ [Categorías] ${categorias.length} categorías de ${tipo} cargadas`);
    }

    // ═══════════════════════════════════════════════════════════════
    // 🎛️ CONFIGURAR EVENTOS DE CAMBIO DE TIPO
    // ═══════════════════════════════════════════════════════════════
    function configurarEventosTipo(select) {
        console.log('🎛️ [Categorías] Configurando eventos de tipo...');
        
        // Buscar los radio buttons de tipo
        const radiosTipo = document.querySelectorAll('input[name="tipo"]');
        
        if (radiosTipo.length === 0) {
            console.warn('⚠️ [Categorías] Radio buttons de tipo no encontrados');
            return;
        }
        
        // Agregar evento a cada radio button
        radiosTipo.forEach(function(radio) {
            // Usar la función segura si está disponible
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
    // 🎬 REINICIALIZAR CUANDO SE ABRE EL MODAL
    // ═══════════════════════════════════════════════════════════════
    function observarModal() {
        // Observar cuando se abre el modal
        const modal = document.getElementById('modalTransaccion');
        
        if (!modal) {
            console.warn('⚠️ [Categorías] Modal no encontrado');
            return;
        }
        
        // Usar MutationObserver para detectar cuando se muestra el modal
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const modalVisible = modal.classList.contains('show');
                    
                    if (modalVisible) {
                        console.log('🎯 [Categorías] Modal abierto, reinicializando...');
                        
                        setTimeout(function() {
                            const select = document.getElementById('selectCategoria');
                            const tipoActual = document.querySelector('input[name="tipo"]:checked');
                            
                            if (select && tipoActual) {
                                cargarCategoriasSegunTipo(tipoActual.value, select);
                            }
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('✅ [Categorías] Observer del modal configurado');
    }

    // ═══════════════════════════════════════════════════════════════
    // 🚀 INICIALIZACIÓN AUTOMÁTICA
    // ═══════════════════════════════════════════════════════════════
    
    // Inicializar cuando el DOM esté listo
    function iniciar() {
        console.log('🚀 [Categorías] Iniciando módulo...');
        
        // Inicializar categorías
        inicializarCategorias();
        
        // Observar modal
        setTimeout(observarModal, 500);
        
        // Escuchar el evento de vista cargada
        window.addEventListener('flujoCajaVisible', function() {
            console.log('📢 [Categorías] Vista visible, reinicializando...');
            setTimeout(inicializarCategorias, 200);
        });
        
        console.log('✅ [Categorías] Módulo iniciado');
    }
    
    // Ejecutar según el estado del DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        // Si el DOM ya está listo, iniciar inmediatamente
        iniciar();
    }
    
    // Exponer funciones globales
    window.GRIZALUM_inicializarCategorias = inicializarCategorias;
    window.GRIZALUM_CATEGORIAS = CATEGORIAS_FLUJO_CAJA;
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ Módulo de categorías de Flujo de Caja cargado');
    console.log('   Funciones disponibles:');
    console.log('   - window.GRIZALUM_inicializarCategorias()');
    console.log('   - window.actualizarCategoriasFlujoCaja(tipo)');
    console.log('═══════════════════════════════════════════════════════════════');

})();
