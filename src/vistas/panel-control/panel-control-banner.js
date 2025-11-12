/**
 * ═══════════════════════════════════════════════════════════════════
 * PANEL DE CONTROL - Banner del Plan
 * Compatible con el sistema de Flujo de Caja
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';
    
    console.log('🎯 [Panel Control] Banner inicializando...');
    
    // Frases motivacionales por plan (usa los MISMOS nombres que Flujo de Caja)
    const FRASES_POR_PLAN = {
        'individual': [
            '¡Comienza tu viaje financiero hoy!',
            'Cada gran empresa empezó siendo pequeña',
            'Tu primer paso hacia el éxito profesional',
            'Construye bases sólidas para tu futuro'
        ],
        'profesional': [
            '¡Excelente trabajo! Sigue así',
            'Tu dedicación marca la diferencia',
            'Cada día mejoras tu negocio',
            'Profesionalismo que inspira confianza'
        ],
        'empresarial': [
            '¡Tu empresa crece con cada decisión!',
            'Liderando con visión y estrategia',
            'Construyendo un imperio sólido',
            'Tu esfuerzo transforma vidas'
        ],
        'corporativo': [
            '¡Excelencia corporativa en acción!',
            'Tus logros inspiran a todo el equipo',
            'Innovación y éxito van de la mano',
            'Liderazgo que marca la diferencia'
        ]
    };
    
    let fraseActualIndex = 0;
    let intervaloFrases = null;
    
    function actualizarBanner() {
        const planGuardado = localStorage.getItem('grizalum_planActual') || 'corporativo';
        const plan = window.FlujoCajaPlanes?.PLANES?.[planGuardado];
        
        if (!plan) {
            console.warn('⚠️ Plan no encontrado:', planGuardado);
            return;
        }
        
        const banner = document.getElementById('nivelBanner');
        if (!banner) return;
        
        // Actualizar fondo según plan (mismo que Flujo de Caja)
        const colores = {
            'individual': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'profesional': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'empresarial': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'corporativo': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
        
        banner.style.background = colores[planGuardado] || colores.corporativo;
        
        // Actualizar icono (MISMO que Flujo de Caja)
        const iconoElement = banner.querySelector('.nivel-icono');
        if (iconoElement) {
            iconoElement.textContent = plan.icono;
        }
        
        // Actualizar nombre (MISMO que Flujo de Caja)
        const nombreElement = banner.querySelector('.nivel-nombre');
        if (nombreElement) {
            nombreElement.textContent = `Plan ${plan.nombre}`;
        }
        
        // Iniciar rotación de frases
        iniciarRotacionFrases(planGuardado);
        
        console.log(`✅ Banner actualizado: Plan ${plan.nombre} ${plan.icono}`);
    }
    
    function iniciarRotacionFrases(planId) {
        // Detener rotación anterior
        if (intervaloFrases) {
            clearInterval(intervaloFrases);
        }
        
        const frases = FRASES_POR_PLAN[planId] || FRASES_POR_PLAN.corporativo;
        fraseActualIndex = 0;
        
        // Cambiar frase cada 8 segundos
        intervaloFrases = setInterval(() => {
            const fraseElement = document.getElementById('fraseMotivacional');
            if (!fraseElement) return;
            
            // Siguiente frase
            fraseActualIndex = (fraseActualIndex + 1) % frases.length;
            
            // Animación de cambio
            fraseElement.style.opacity = '0';
            
            setTimeout(() => {
                fraseElement.textContent = frases[fraseActualIndex];
                fraseElement.style.opacity = '1';
            }, 300);
        }, 8000);
        
        console.log(`🔄 Rotación de frases iniciada (${frases.length} frases)`);
    }
    
    // Actualizar cuando cargue el panel
    setTimeout(actualizarBanner, 500);
    setTimeout(actualizarBanner, 1000);
    
    // Actualizar cuando cambie el plan
    document.addEventListener('grizalumPlanCambiado', actualizarBanner);
    
    // Observer para mantener sincronizado
    const observer = new MutationObserver(() => {
        const banner = document.getElementById('nivelBanner');
        const panelVisible = document.querySelector('.panel-control-contenedor')?.offsetParent !== null;
        
        if (panelVisible && banner) {
            const iconoActual = banner.querySelector('.nivel-icono')?.textContent || '';
            const planGuardado = localStorage.getItem('grizalum_planActual') || 'corporativo';
            const plan = window.FlujoCajaPlanes?.PLANES?.[planGuardado];
            
            // Si el icono no coincide, actualizar
            if (plan && iconoActual !== plan.icono) {
                console.log('🔄 Banner desincronizado, actualizando...');
                actualizarBanner();
            }
        }
    });
    
    setTimeout(() => {
        const contenedor = document.querySelector('.panel-control-contenedor') || document.body;
        observer.observe(contenedor, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }, 500);
    
    console.log('✅ [Panel Control] Banner listo y sincronizado con Flujo de Caja');
    
})();
