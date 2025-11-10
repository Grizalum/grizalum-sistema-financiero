/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL - PLAN LOADER
 * Carga y muestra el banner del plan actual
 * VERSION: 1.0.0
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    console.log('🎯 [PanelPlanLoader] Módulo cargado v1.0');

    /**
     * Cargar y mostrar el banner del plan
     */
    function cargarBannerPlan() {
        console.log('⚡ [PanelPlanLoader] Iniciando carga...');

        // Intentar cargar con reintentos
        let intentos = 0;
        const maxIntentos = 10;

        const intentarCargar = () => {
            intentos++;

            // Verificar dependencias
            if (!window.FlujoCajaPlanes || !window.panelControl) {
                if (intentos < maxIntentos) {
                    console.log(`⏳ [PanelPlanLoader] Esperando dependencias... (${intentos}/${maxIntentos})`);
                    setTimeout(intentarCargar, 150);
                    return;
                } else {
                    console.error('❌ [PanelPlanLoader] Timeout esperando dependencias');
                    return;
                }
            }

            // Obtener información del plan
            const planActual = window.FlujoCajaPlanes.obtenerPlanActual();
            const info = window.panelControl.obtenerInfo();

            if (!planActual) {
                console.warn('⚠️ [PanelPlanLoader] No se pudo obtener el plan actual');
                return;
            }

            // Crear o actualizar banner
            crearBanner(planActual, info);

            console.log(`✅ [PanelPlanLoader] Plan cargado en intento ${intentos}`);
        };

        // Iniciar carga
        intentarCargar();
    }

    /**
     * Crear el HTML del banner
     */
    function crearBanner(plan, info) {
        // Buscar contenedor o crearlo
        let banner = document.getElementById('panelPlanBanner');
        
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'panelPlanBanner';
            banner.className = 'nivel-banner';
            
            // Insertar después del header
            const contenedor = document.querySelector('.panel-control-contenedor');
            if (contenedor) {
                contenedor.insertBefore(banner, contenedor.firstChild);
            } else {
                console.warn('⚠️ No se encontró el contenedor del panel');
                return;
            }
        }

        // Determinar nivel numérico
        const nivel = info?.nivel?.score || 0;
        
        // Calcular progreso hacia el siguiente nivel
        let progreso = 0;
        let siguienteNivel = 'Profesional';
        let puntosNecesarios = 30;

        if (nivel < 30) {
            progreso = (nivel / 30) * 100;
            siguienteNivel = 'Profesional';
            puntosNecesarios = 30 - nivel;
        } else if (nivel < 50) {
            progreso = ((nivel - 30) / 20) * 100;
            siguienteNivel = 'Empresarial';
            puntosNecesarios = 50 - nivel;
        } else if (nivel < 70) {
            progreso = ((nivel - 50) / 20) * 100;
            siguienteNivel = 'Corporativo';
            puntosNecesarios = 70 - nivel;
        } else {
            progreso = 100;
            siguienteNivel = 'Máximo alcanzado';
            puntosNecesarios = 0;
        }

        // HTML del banner
        banner.innerHTML = `
            <div class="nivel-info">
                <div class="nivel-icono" style="font-size: 2.5rem;">${plan.icono}</div>
                <div class="nivel-textos">
                    <div class="nivel-nombre" style="font-size: 1.25rem; font-weight: 700;">
                        Plan ${plan.nombre}
                    </div>
                    <div class="nivel-score" style="font-size: 0.875rem; color: rgba(255,255,255,0.8);">
                        ${nivel >= 70 ? '🏆 Nivel Máximo' : `${puntosNecesarios} puntos para ${siguienteNivel}`}
                    </div>
                </div>
            </div>
            ${nivel < 70 ? `
                <div class="nivel-progreso">
                    <div class="progreso-bar">
                        <div class="progreso-fill" style="width: ${progreso}%; background: ${plan.color};"></div>
                    </div>
                </div>
            ` : ''}
        `;

        // Aplicar estilos inline si no están en CSS
        banner.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 20px 24px;
            background: linear-gradient(135deg, ${plan.color}15, ${plan.color}05);
            border: 2px solid ${plan.color}40;
            border-radius: 16px;
            margin-bottom: 24px;
            animation: fadeInUp 0.6s ease-out;
        `;

        console.log('✅ [PanelPlanLoader] Banner creado exitosamente');
    }

    /**
     * Proteger el banner de ser eliminado
     */
    function protegerBanner() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node.id === 'panelPlanBanner') {
                        console.warn('⚠️ [PanelPlanLoader] Banner eliminado, recreando...');
                        setTimeout(() => cargarBannerPlan(), 100);
                    }
                });
            });
        });

        const contenedor = document.querySelector('.panel-control-contenedor');
        if (contenedor) {
            observer.observe(contenedor, {
                childList: true,
                subtree: true
            });
            console.log('🛡️ [PanelPlanLoader] Protección activada con MutationObserver');
        }
    }

    /**
     * Inicialización
     */
    function inicializar() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    cargarBannerPlan();
                    protegerBanner();
                }, 300);
            });
        } else {
            setTimeout(() => {
                cargarBannerPlan();
                protegerBanner();
            }, 300);
        }

        // Recargar banner cuando cambie el plan
        document.addEventListener('grizalumPlanCambiado', () => {
            console.log('🔄 [PanelPlanLoader] Plan cambiado, recargando banner...');
            setTimeout(cargarBannerPlan, 200);
        });

        // Recargar cuando se inicialice el panel
        document.addEventListener('grizalumPanelControlInicializado', () => {
            console.log('📊 [PanelPlanLoader] Panel inicializado, cargando banner...');
            setTimeout(cargarBannerPlan, 200);
        });
    }

    // Auto-inicializar
    inicializar();

    // Exportar funciones
    window.PanelPlanLoader = {
        cargarBannerPlan,
        protegerBanner
    };

    console.log('✅ [PanelPlanLoader] Sistema de banner del plan listo');
})();
