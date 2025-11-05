/**
 * GRIZALUM - Cargador de Nivel con Sistema de Planes
 * Muestra el plan actual en lugar del score
 */

(function() {
    'use strict';
    
    console.log('🎯 [PlanLoader] Módulo cargado v2.0');
    
    // Función para mostrar el plan actual
    function mostrarPlan() {
        const banner = document.getElementById('nivelBanner');
        
        if (!banner) {
            return false;
        }
        
        // ✅ PRIORIDAD 1: Leer plan de localStorage
        const planGuardado = localStorage.getItem('grizalum_planActual');
        
        let plan;
        if (planGuardado && window.FlujoCajaPlanes && window.FlujoCajaPlanes.PLANES[planGuardado]) {
            plan = window.FlujoCajaPlanes.PLANES[planGuardado];
        } 
        else if (window.FlujoCajaPlanes) {
            plan = window.FlujoCajaPlanes.obtenerPlanActual();
        } 
        else {
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
        `;
        
        return true;
    }
    
    // ✅ NUEVO: MutationObserver para proteger el banner
    function iniciarProteccion() {
        const banner = document.getElementById('nivelBanner');
        if (!banner) {
            setTimeout(iniciarProteccion, 500);
            return;
        }
        
        console.log('🛡️ [PlanLoader] Protección activada con MutationObserver');
        
        const planGuardado = localStorage.getItem('grizalum_planActual');
        
        // Crear observador
        const observer = new MutationObserver((mutations) => {
            const nombreActual = banner.querySelector('.nivel-nombre')?.textContent || '';
            
            // Si cambió y NO es corporativo, restaurar
            if (planGuardado === 'corporativo' && !nombreActual.includes('Corporativo')) {
                console.log('🚨 [PlanLoader] Banner modificado! Restaurando...', nombreActual);
                mostrarPlan();
            }
        });
        
        // Observar cambios en el banner
        observer.observe(banner, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // También verificar cada 300ms por si acaso
        setInterval(() => {
            const nombreActual = banner.querySelector('.nivel-nombre')?.textContent || '';
            if (planGuardado === 'corporativo' && !nombreActual.includes('Corporativo')) {
                console.log('⏱️ [PlanLoader] Verificación periódica - Restaurando banner');
                mostrarPlan();
            }
        }, 300);
    }
    
    // Detección inicial
    setTimeout(() => {
        console.log('⚡ [PlanLoader] Iniciando carga...');
        
        let intentos = 0;
        const retry = () => {
            intentos++;
            if (mostrarPlan()) {
                console.log('✅ [PlanLoader] Plan cargado en intento', intentos);
                iniciarProteccion();
            } else if (intentos < 20) {
                setTimeout(retry, 100);
            }
        };
        
        retry();
    }, 100);
    
})();
