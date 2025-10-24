/**
 * ═══════════════════════════════════════════════════════════════════
 * FLUJO DE CAJA - INICIALIZADOR CENTRALIZADO
 * Resuelve race conditions y controla la carga única del módulo
 * VERSION: 2.0.0 - OPTIMIZADA
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    // ═══════════════════════════════════════════════════════════════
    // CONTROL DE ESTADO
    // ═══════════════════════════════════════════════════════════════
    const estado = {
        inicializado: false,
        cargando: false,
        intentos: 0,
        maxIntentos: 20,
        tiempoEspera: 500,
        dependenciasListas: false
    };

    // ═══════════════════════════════════════════════════════════════
    // VERIFICACIÓN DE DEPENDENCIAS
    // ═══════════════════════════════════════════════════════════════
    function verificarDependencias() {
        const dependencias = {
            config: window.FlujoCajaConfig,
            modulo: window.flujoCaja,
            validador: window.FlujoCajaValidador,
            ui: window.FlujoCajaUI,
            gestor: window.gestorEmpresas,
            sistemaNiveles: window.sistemaNiveles
        };

        const faltantes = [];
        for (const [nombre, dependencia] of Object.entries(dependencias)) {
            if (!dependencia) {
                faltantes.push(nombre);
            }
        }

        if (faltantes.length > 0) {
            console.log(`⏳ Esperando dependencias: ${faltantes.join(', ')}`);
            return false;
        }

        console.log('✅ Todas las dependencias listas');
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // INICIALIZACIÓN DEL MÓDULO
    // ═══════════════════════════════════════════════════════════════
    async function inicializarModulo() {
        // Prevenir múltiples inicializaciones
        if (estado.inicializado || estado.cargando) {
            console.log('⚠️ Módulo ya inicializado o en proceso de carga');
            return;
        }

        estado.cargando = true;
        console.log('🚀 [FlujoCaja] Iniciando carga del módulo...');

        try {
            // ──────────────────────────────────────────────────────────
            // PASO 1: Verificar dependencias
            // ──────────────────────────────────────────────────────────
            if (!verificarDependencias()) {
                estado.intentos++;
                
                if (estado.intentos >= estado.maxIntentos) {
                    throw new Error('Timeout: Dependencias no disponibles después de ' + estado.maxIntentos + ' intentos');
                }
                
                // Reintentar después de un tiempo
                setTimeout(inicializarModulo, estado.tiempoEspera);
                estado.cargando = false;
                return;
            }

            // ──────────────────────────────────────────────────────────
            // PASO 2: Esperar a que el módulo core esté listo
            // ──────────────────────────────────────────────────────────
            if (!window.flujoCaja.estaListo()) {
                console.log('⏳ Esperando inicialización del módulo core...');
                await window.flujoCaja.esperarInicializacion();
            }

            // ──────────────────────────────────────────────────────────
            // PASO 3: Inicializar UI (una sola vez)
            // ──────────────────────────────────────────────────────────
            console.log('🎨 Inicializando interfaz de usuario...');
            
            if (!window.flujoCajaUI) {
                window.flujoCajaUI = new FlujoCajaUI();
            }

            // Esperar a que la UI esté lista
            await esperarUI();

            // ──────────────────────────────────────────────────────────
            // PASO 4: Cargar gráficos si el score lo permite
            // ──────────────────────────────────────────────────────────
            const info = window.flujoCaja.obtenerInfo();
            const scoreMinimo = 30;
            
            if (info.nivel?.score >= scoreMinimo) {
                console.log('📊 Score suficiente, cargando gráficos...');
                cargarGraficos();
            } else {
                console.log(`📊 Gráficos disponibles en score ${scoreMinimo}+ (actual: ${info.nivel?.score || 0})`);
            }

            // ──────────────────────────────────────────────────────────
            // PASO 5: Marcar como inicializado
            // ──────────────────────────────────────────────────────────
            estado.inicializado = true;
            estado.cargando = false;

            console.log('✅ [FlujoCaja] Módulo completamente inicializado');

            // Disparar evento de módulo listo
            dispararEvento('flujoCajaModuloListo', {
                timestamp: new Date().toISOString(),
                transacciones: info.totalTransacciones,
                balance: info.balance
            });

        } catch (error) {
            estado.cargando = false;
            console.error('❌ Error inicializando módulo:', error);
            
            // Mostrar error al usuario
            mostrarErrorCritico(error.message);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ESPERAR A QUE LA UI ESTÉ LISTA
    // ═══════════════════════════════════════════════════════════════
    function esperarUI() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (window.flujoCajaUI?.modulo) {
                    console.log('✅ UI conectada al módulo');
                    resolve();
                } else {
                    setTimeout(verificar, 100);
                }
            };
            verificar();
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // CARGAR GRÁFICOS (LAZY LOADING)
    // ═══════════════════════════════════════════════════════════════
    function cargarGraficos() {
        if (window.FlujoCajaGraficos) {
            console.log('📊 Gráficos ya cargados');
            return;
        }

        // Los gráficos se cargan con defer en el HTML
        // Aquí solo verificamos que estén disponibles
        const verificarGraficos = setInterval(() => {
            if (window.FlujoCajaGraficos) {
                clearInterval(verificarGraficos);
                console.log('✅ Módulo de gráficos listo');
                
                // Inicializar gráficos si hay transacciones
                if (window.flujoCajaUI) {
                    window.flujoCajaUI.inicializarGraficos();
                }
            }
        }, 200);

        // Timeout después de 5 segundos
        setTimeout(() => {
            clearInterval(verificarGraficos);
            if (!window.FlujoCajaGraficos) {
                console.warn('⚠️ Gráficos no se cargaron en el tiempo esperado');
            }
        }, 5000);
    }

    // ═══════════════════════════════════════════════════════════════
    // RECARGAR MÓDULO (Cuando cambia la empresa)
    // ═══════════════════════════════════════════════════════════════
    function recargarModulo() {
        console.log('🔄 Recargando módulo Flujo de Caja...');
        
        if (!estado.inicializado) {
            console.warn('⚠️ Módulo no inicializado aún');
            return;
        }

        try {
            // Recargar datos en el módulo
            if (window.flujoCajaUI) {
                window.flujoCajaUI.cargarNivel();
                window.flujoCajaUI.cargarCategorias();
                window.flujoCajaUI.cargarBalance();
                window.flujoCajaUI.cargarTransacciones();
            }

            console.log('✅ Módulo recargado exitosamente');
        } catch (error) {
            console.error('❌ Error recargando módulo:', error);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // MOSTRAR ERROR CRÍTICO
    // ═══════════════════════════════════════════════════════════════
    function mostrarErrorCritico(mensaje) {
        const contenedor = document.getElementById('flujoCajaApp');
        if (!contenedor) return;

        contenedor.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                text-align: center;
                padding: 2rem;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h2 style="margin: 0 0 1rem 0; color: var(--danger);">Error al cargar el módulo</h2>
                <p style="color: var(--texto-secundario); max-width: 500px;">
                    ${mensaje}
                </p>
                <button 
                    onclick="location.reload()" 
                    class="btn-primary" 
                    style="margin-top: 2rem;"
                >
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════
    // DISPARAR EVENTOS PERSONALIZADOS
    // ═══════════════════════════════════════════════════════════════
    function dispararEvento(nombre, datos) {
        const evento = new CustomEvent(nombre, {
            detail: datos,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(evento);
    }

    // ═══════════════════════════════════════════════════════════════
    // LISTENERS DE EVENTOS GLOBALES
    // ═══════════════════════════════════════════════════════════════
    
    // Escuchar cambio de empresa
    document.addEventListener('grizalumCompanyChanged', function(e) {
        console.log('🏢 Empresa cambiada, recargando módulo...');
        setTimeout(recargarModulo, 300);
    });

    // Escuchar cuando la vista se hace visible
    window.addEventListener('flujoCajaVisible', function() {
        console.log('👁️ Vista Flujo de Caja visible');
        
        if (!estado.inicializado) {
            console.log('📦 Inicializando por primera vez...');
            inicializarModulo();
        } else {
            console.log('🔄 Recargando datos...');
            recargarModulo();
        }
    });

    // Escuchar cambio de nivel (puede desbloquear componentes)
    document.addEventListener('grizalumCambioNivel', function(e) {
        console.log('⬆️ Nivel actualizado, verificando nuevos componentes...');
        if (estado.inicializado) {
            recargarModulo();
        }
    });

    // ═══════════════════════════════════════════════════════════════
    // EXPORTAR FUNCIONES GLOBALES
    // ═══════════════════════════════════════════════════════════════
    window.FlujoCajaInit = {
        inicializar: inicializarModulo,
        recargar: recargarModulo,
        estaInicializado: () => estado.inicializado,
        estaCargando: () => estado.cargando
    };

    // ═══════════════════════════════════════════════════════════════
    // AUTO-INICIALIZACIÓN
    // ═══════════════════════════════════════════════════════════════
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarModulo);
    } else {
        // DOM ya está listo, inicializar inmediatamente
        inicializarModulo();
    }

    console.log('✅ Inicializador de Flujo de Caja cargado');

})();
