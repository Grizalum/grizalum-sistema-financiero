/**
 * GRIZALUM - Cargador de Nivel con Sistema de Planes
 * Muestra el plan actual en lugar del score
 */

(function() {
    'use strict';
    
    console.log('🎯 [PlanLoader] Módulo cargado');
    
    // Función para mostrar el plan actual
function mostrarPlan() {
        const banner = document.getElementById('nivelBanner');
        
        if (!banner) {
            console.warn('⚠️ [PlanLoader] Banner no encontrado');
            return false;
        }
        
        // ✅ PRIORIDAD 1: Leer plan de localStorage
        const planGuardado = localStorage.getItem('grizalum_planActual');
        
        let plan;
        if (planGuardado && window.FlujoCajaPlanes && window.FlujoCajaPlanes.PLANES[planGuardado]) {
            plan = window.FlujoCajaPlanes.PLANES[planGuardado];
            console.log('✅ [PlanLoader] Plan desde localStorage:', plan.nombre);
        } 
        // ✅ PRIORIDAD 2: Usar FlujoCajaPlanes
        else if (window.FlujoCajaPlanes) {
            plan = window.FlujoCajaPlanes.obtenerPlanActual();
            console.log('✅ [PlanLoader] Plan desde FlujoCajaPlanes:', plan.nombre);
        } 
        // ✅ PRIORIDAD 3: No mostrar nada si no hay plan
        else {
            console.warn('⚠️ [PlanLoader] No se pudo obtener el plan');
            return false;
        }
        
        banner.style.display = 'flex';
        banner.innerHTML = `
            <div class="nivel-info">
                <span class="nivel-icono" style="font-size: 2.5rem;">${plan.icono}</span>
                <div class="nivel-textos">
                    <div class="nivel-nombre" style="font-size: 1.25rem; font-weight: 700; color: var(--texto-principal);">
                        Plan ${plan.nombre}
                    </div>
                    <div class="nivel-score" style="font-size: 0.875rem; color: var(--texto-terciario);">
                        $${plan.precio}/mes
                    </div>
                </div>
            </div>
            <button onclick="window.FlujoCajaPlanes.mostrarModalUpgrade('upgrade', 'profesional')" style="
                background: ${plan.color};
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.3s;
            " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                Mejorar Plan
            </button>
        `;
        
        return true;
    }
    
    // Listener para cuando se cambia de vista
    document.addEventListener('sectionChanged', function(e) {
        if (e.detail.to === 'flujo-caja') {
            console.log('🚀 [PlanLoader] Entrando a flujo-caja');
            
            let intentos = 0;
            const retry = () => {
                intentos++;
                if (mostrarPlan()) {
                    console.log('✅ [PlanLoader] Plan cargado en intento', intentos);
                } else if (intentos < 15) {
                    setTimeout(retry, 100);
                } else {
                    console.error('❌ [PlanLoader] Timeout después de 15 intentos');
                }
            };
            
            setTimeout(retry, 50);
        }
    });
    
    // Listener para cuando cambia el plan
    document.addEventListener('grizalumPlanCambiado', function(e) {
        console.log('🔄 [PlanLoader] Plan cambiado, actualizando banner');
        setTimeout(mostrarPlan, 100);
    });
    
    console.log('✅ [PlanLoader] Listeners registrados');
    
    // Detección inicial - Si ya estamos en flujo-caja al cargar
    setTimeout(() => {
        const estaEnFlujoCaja = document.getElementById('flujoCajaApp')?.offsetParent !== null;
        
        if (estaEnFlujoCaja) {
            console.log('⚡ [PlanLoader] Ya estamos en flujo-caja, cargando plan inmediatamente');
            
            let intentos = 0;
            const retry = () => {
                intentos++;
                if (mostrarPlan()) {
                    console.log('✅ [PlanLoader] Plan cargado (detección inicial) en intento', intentos);
                } else if (intentos < 15) {
                    setTimeout(retry, 100);
                }
            };
            
            retry();
        }
    }, 200);
    
})();
