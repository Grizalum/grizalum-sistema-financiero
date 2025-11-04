/**
 * GRIZALUM - Cargador de Nivel para Flujo de Caja
 * Se ejecuta DESPUÉS de todos los demás módulos
 */

(function() {
    'use strict';
    
    console.log('🎯 [NivelLoader] Módulo cargado');
    
    // Función para mostrar el nivel
    function mostrarNivel() {
        const banner = document.getElementById('nivelBanner');
        const info = window.flujoCaja?.obtenerInfo();
        
        if (banner && info?.nivel) {
            console.log('✅ [NivelLoader] Mostrando nivel:', info.nivel.nivel.nombre);
            banner.style.display = 'flex';
            banner.innerHTML = `
                <div class="nivel-info">
                    <span class="nivel-icono" style="font-size: 2.5rem;">${info.nivel.nivel.icono}</span>
                    <div class="nivel-textos">
                        <div class="nivel-nombre" style="font-size: 1.25rem; font-weight: 700;">
                            Nivel ${info.nivel.nivel.nombre}
                        </div>
                        <div class="nivel-score" style="font-size: 0.875rem;">
                            Score: ${info.nivel.score}/100
                        </div>
                    </div>
                </div>
            `;
            return true;
        }
        return false;
    }
    
    // Listener con retry automático
    document.addEventListener('sectionChanged', function(evento) {
        if (evento.detail.to === 'flujo-caja') {
            console.log('🚀 [NivelLoader] Entrando a flujo-caja');
            
            let intentos = 0;
            const retry = () => {
                intentos++;
                if (mostrarNivel()) {
                    console.log('✅ [NivelLoader] Nivel cargado en intento', intentos);
                } else if (intentos < 15) {
                    setTimeout(retry, 100);
                }
            };
            
            setTimeout(retry, 50);
        }
    });
    
    console.log('✅ [NivelLoader] Listener registrado');
    
    // ✅ DETECCIÓN INICIAL - Si ya estamos en flujo-caja al cargar
    setTimeout(() => {
        const estaEnFlujoCaja = document.getElementById('flujoCajaApp')?.offsetParent !== null;
        
        if (estaEnFlujoCaja) {
            console.log('⚡ [NivelLoader] Ya estamos en flujo-caja, cargando nivel inmediatamente');
            
            let intentos = 0;
            const retry = () => {
                intentos++;
                if (mostrarNivel()) {
                    console.log('✅ [NivelLoader] Nivel cargado (detección inicial) en intento', intentos);
                } else if (intentos < 15) {
                    setTimeout(retry, 100);
                }
            };
            
            retry();
        }
    }, 200);
    
})();
