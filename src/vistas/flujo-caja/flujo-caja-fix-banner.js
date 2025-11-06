/**
 * GRIZALUM - Fix de banner corporativo
 * Protege el banner para que siempre muestre el plan correcto
 */

(function() {
    'use strict';
    
    console.log('🛡️ Fix banner cargado');
    
    function forzarPlanCorporativo() {
        const banner = document.getElementById('nivelBanner');
        const planGuardado = localStorage.getItem('grizalum_planActual');
        
        if (!banner || planGuardado !== 'corporativo') return false;
        
        const plan = window.FlujoCajaPlanes?.PLANES?.corporativo;
        if (!plan) return false;
        
        const nombreActual = banner.querySelector('.nivel-nombre')?.textContent || '';
        const visible = banner.offsetParent !== null;
        
        if (!visible || !nombreActual.includes('Corporativo')) {
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
        return false;
    }
    
    setInterval(forzarPlanCorporativo, 150);
    
    setTimeout(forzarPlanCorporativo, 100);
    setTimeout(forzarPlanCorporativo, 500);
    setTimeout(forzarPlanCorporativo, 1000);
    
    const observer = new MutationObserver(() => {
        const banner = document.getElementById('nivelBanner');
        const flujoCajaVisible = document.getElementById('flujoCajaApp')?.offsetParent !== null;
        
        if (flujoCajaVisible && banner) {
            forzarPlanCorporativo();
        }
    });
    
    const observarContenedor = () => {
        const contenedor = document.getElementById('main-content') || document.body;
        observer.observe(contenedor, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    };
    
    setTimeout(observarContenedor, 500);
    
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a, button');
        if (target && target.textContent.includes('Flujo de Caja')) {
            setTimeout(forzarPlanCorporativo, 100);
            setTimeout(forzarPlanCorporativo, 300);
            setTimeout(forzarPlanCorporativo, 600);
            setTimeout(forzarPlanCorporativo, 1000);
        }
    });
})();
