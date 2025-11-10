/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL - FIX
 * Soluciona problemas comunes y asegura estabilidad
 * VERSION: 1.0.0
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('🛠️ [PanelFix] Módulo de correcciones cargado');

    /**
     * Fix 1: Asegurar que Chart.js esté disponible
     */
    function verificarChartJS() {
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js no está cargado');
            return false;
        }
        console.log('✅ [Fix] Chart.js disponible');
        return true;
    }

    /**
     * Fix 2: Asegurar que ExcelJS esté disponible
     */
    function verificarExcelJS() {
        if (typeof ExcelJS === 'undefined') {
            console.warn('⚠️ ExcelJS no está cargado (necesario para exportar)');
            return false;
        }
        console.log('✅ [Fix] ExcelJS disponible');
        return true;
    }

    /**
     * Fix 3: Proteger contra errores de gráficos
     */
    function protegerGraficos() {
        const canvasElements = document.querySelectorAll('canvas[id*="Chart"]');
        
        canvasElements.forEach(canvas => {
            if (!canvas.getContext) {
                console.warn('⚠️ Canvas no soportado en este navegador');
                canvas.parentElement.innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">Gráfico no disponible en este navegador</div>';
            }
        });

        console.log('✅ [Fix] Protección de gráficos activada');
    }

    /**
     * Fix 4: Reinicializar si hay errores
     */
    function reinicializarSiError() {
        let errorCount = 0;
        const maxErrors = 3;

        window.addEventListener('error', (event) => {
            if (event.message.includes('panelControl') || 
                event.message.includes('Chart') ||
                event.message.includes('panel-control')) {
                
                errorCount++;
                console.warn(`⚠️ [Fix] Error detectado (${errorCount}/${maxErrors}):`, event.message);

                if (errorCount >= maxErrors) {
                    console.log('🔄 [Fix] Demasiados errores, intentando reinicializar...');
                    setTimeout(() => {
                        if (window.panelControlUI) {
                            window.panelControlUI.cargarDatos();
                        }
                    }, 2000);
                    errorCount = 0; // Reset
                }
            }
        });

        console.log('✅ [Fix] Sistema de reinicio automático activado');
    }

    /**
     * Fix 5: Asegurar que los datos se carguen
     */
    function verificarDatos() {
        let intentos = 0;
        const maxIntentos = 10;

        const verificar = () => {
            intentos++;

            if (window.panelControl && window.panelControl.estaListo()) {
                const datos = window.panelControl.obtenerDatos();
                
                if (datos && typeof datos.ingresos !== 'undefined') {
                    console.log('✅ [Fix] Datos verificados correctamente');
                    return;
                }
            }

            if (intentos < maxIntentos) {
                console.log(`⏳ [Fix] Verificando datos... (${intentos}/${maxIntentos})`);
                setTimeout(verificar, 500);
            } else {
                console.warn('⚠️ [Fix] No se pudieron verificar los datos después de', maxIntentos, 'intentos');
            }
        };

        setTimeout(verificar, 1000);
    }

    /**
     * Fix 6: Sincronización con Flujo de Caja
     */
    function sincronizarConFlujoCaja() {
        // Escuchar cambios en Flujo de Caja
        const eventos = [
            'grizalumTransaccionAgregada',
            'grizalumTransaccionEditada',
            'grizalumTransaccionEliminada',
            'grizalumFlujoCajaActualizado'
        ];

        eventos.forEach(evento => {
            document.addEventListener(evento, () => {
                console.log(`🔄 [Fix] Evento ${evento} detectado, actualizando panel...`);
                
                // Esperar un momento y actualizar
                setTimeout(() => {
                    if (window.panelControl && window.panelControl._actualizarDatos) {
                        window.panelControl._actualizarDatos();
                    }
                }, 500);
            });
        });

        console.log('✅ [Fix] Sincronización con Flujo de Caja activada');
    }

    /**
     * Fix 7: Asegurar que los botones funcionen
     */
    function verificarBotones() {
        setTimeout(() => {
            // Verificar botón de exportar
            const btnExportar = document.querySelector('[onclick*="exportarPanelControl"]');
            if (btnExportar && typeof window.exportarPanelControl !== 'function') {
                console.warn('⚠️ [Fix] Función exportarPanelControl no encontrada');
                
                // Crear función temporal
                window.exportarPanelControl = function() {
                    alert('⚠️ Sistema de exportación aún está cargando. Espera un momento.');
                };
            }

            // Verificar función de personalización
            const btnPersonalizar = document.querySelector('[onclick*="dashboardPersonalizable"]');
            if (btnPersonalizar && typeof window.dashboardPersonalizable === 'undefined') {
                console.warn('⚠️ [Fix] dashboardPersonalizable no encontrado');
                
                // Crear objeto temporal
                window.dashboardPersonalizable = {
                    activarModoEdicion: function() {
                        alert('⚠️ Sistema de personalización aún está cargando.');
                    }
                };
            }

            console.log('✅ [Fix] Verificación de botones completada');
        }, 1000);
    }

    /**
     * Fix 8: Limpiar memoria de gráficos
     */
    function limpiarGraficos() {
        // Limpiar gráficos antiguos al cambiar de vista
        document.addEventListener('sectionChanged', (evento) => {
            if (evento.detail.from === 'panel-control') {
                console.log('🧹 [Fix] Limpiando gráficos del panel...');
                
                if (window.panelControlUI && window.panelControlUI.graficos) {
                    Object.values(window.panelControlUI.graficos).forEach(grafico => {
                        if (grafico && typeof grafico.destroy === 'function') {
                            try {
                                grafico.destroy();
                            } catch (e) {
                                console.warn('⚠️ Error destruyendo gráfico:', e);
                            }
                        }
                    });
                }
            }
        });

        console.log('✅ [Fix] Sistema de limpieza de gráficos activado');
    }

    /**
     * Fix 9: Manejo de errores global
     */
    function manejarErroresGlobales() {
        const erroresIgnorados = [
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications'
        ];

        window.addEventListener('error', (event) => {
            const mensaje = event.message || '';
            
            // Ignorar errores conocidos que no afectan funcionalidad
            if (erroresIgnorados.some(err => mensaje.includes(err))) {
                event.preventDefault();
                return;
            }

            // Log de otros errores
            if (mensaje.includes('panel') || mensaje.includes('Chart')) {
                console.error('❌ [Fix] Error capturado:', {
                    mensaje: evento.message,
                    archivo: event.filename,
                    linea: event.lineno
                });
            }
        });

        console.log('✅ [Fix] Manejo de errores globales activado');
    }

    /**
     * Inicialización de todos los fixes
     */
    function inicializarTodo() {
        console.log('🛠️ [PanelFix] Inicializando correcciones...');

        // Ejecutar fixes inmediatamente
        verificarChartJS();
        verificarExcelJS();
        reinicializarSiError();
        sincronizarConFlujoCaja();
        manejarErroresGlobales();

        // Ejecutar fixes después de carga del DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                protegerGraficos();
                verificarDatos();
                verificarBotones();
                limpiarGraficos();
            });
        } else {
            protegerGraficos();
            verificarDatos();
            verificarBotones();
            limpiarGraficos();
        }

        console.log('✅ [PanelFix] Todas las correcciones activadas');
    }

    // Auto-inicializar
    inicializarTodo();

    // Exportar para uso manual si es necesario
    window.PanelControlFix = {
        verificarChartJS,
        verificarExcelJS,
        protegerGraficos,
        verificarDatos,
        sincronizarConFlujoCaja
    };

})();

console.log('✅ Panel Control Fix v1.0.0 cargado');
