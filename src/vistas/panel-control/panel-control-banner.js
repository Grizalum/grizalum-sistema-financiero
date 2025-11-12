/**
 * ═══════════════════════════════════════════════════════════════════
 * SISTEMA DE BANNER DEL PLAN - Con frases motivacionales
 * ═══════════════════════════════════════════════════════════════════
 */

const PlanBanner = {
    // Configuración de cada plan
    planes: {
        'Individual': {
            icono: '👤',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            frases: [
                '¡Comienza tu viaje financiero hoy!',
                'Cada gran empresa empezó siendo pequeña',
                'Tu primer paso hacia el éxito profesional',
                'Construye bases sólidas para tu futuro',
                '¡El éxito comienza con organización!'
            ]
        },
        'Profesional': {
            icono: '💎',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            frases: [
                '¡Excelente trabajo! Sigue así',
                'Tu dedicación marca la diferencia',
                'Cada día mejoras tu negocio',
                '¡Estás en el camino correcto!',
                'Profesionalismo que inspira confianza'
            ]
        },
        'Empresarial': {
            icono: '🏢',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            frases: [
                '¡Tu empresa crece con cada decisión!',
                'Liderando con visión y estrategia',
                'Construyendo un imperio sólido',
                '¡El éxito empresarial te espera!',
                'Tu esfuerzo transforma vidas'
            ]
        },
        'Corporativo': {
            icono: '🌟',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            frases: [
                '¡Excelencia corporativa en acción!',
                'Tus logros inspiran a todo el equipo',
                'Innovación y éxito van de la mano',
                '¡Alcanzando nuevas cimas cada día!',
                'Liderazgo que marca la diferencia'
            ]
        }
    },

    fraseActualIndex: 0,
    intervalo: null,

    inicializar() {
        console.log('🎯 Banner del Plan inicializando...');
        
        // Cargar plan actual
        this.actualizarBanner();
        
        // Cambiar frase cada 8 segundos
        this.intervalo = setInterval(() => {
            this.rotarFrase();
        }, 8000);
        
        console.log('✅ Banner del Plan listo');
    },

    actualizarBanner() {
        // Obtener plan actual
        const planActual = this.obtenerPlanActual();
        const configPlan = this.planes[planActual] || this.planes['Corporativo'];
        
        // Actualizar elementos del DOM
        const bannerElement = document.getElementById('planBanner');
        const iconoElement = document.getElementById('planIcon');
        const nombreElement = document.getElementById('planNombre');
        const fraseElement = document.getElementById('planFrase');
        
        if (bannerElement) {
            bannerElement.style.background = configPlan.color;
        }
        
        if (iconoElement) {
            iconoElement.textContent = configPlan.icono;
        }
        
        if (nombreElement) {
            nombreElement.textContent = `Plan ${planActual}`;
        }
        
        if (fraseElement) {
            // Mostrar primera frase
            this.fraseActualIndex = 0;
            fraseElement.textContent = configPlan.frases[0];
        }
        
        console.log(`📋 Banner actualizado: ${planActual}`);
    },

    rotarFrase() {
        const planActual = this.obtenerPlanActual();
        const configPlan = this.planes[planActual] || this.planes['Corporativo'];
        const fraseElement = document.getElementById('planFrase');
        
        if (!fraseElement) return;
        
        // Siguiente frase
        this.fraseActualIndex = (this.fraseActualIndex + 1) % configPlan.frases.length;
        
        // Animación de salida
        fraseElement.style.opacity = '0';
        fraseElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            fraseElement.textContent = configPlan.frases[this.fraseActualIndex];
            fraseElement.style.opacity = '1';
            fraseElement.style.transform = 'translateY(0)';
        }, 300);
    },

    obtenerPlanActual() {
        // Intentar obtener plan desde el sistema
        if (window.panelControl && window.panelControl.planActual) {
            return window.panelControl.planActual.nombre;
        }
        
        if (window.FlujoCajaPlanes && window.FlujoCajaPlanes.obtenerPlanActual) {
            const plan = window.FlujoCajaPlanes.obtenerPlanActual();
            return plan.nombre;
        }
        
        // Fallback
        return 'Corporativo';
    },

    detener() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
        }
    }
};

// Inicializar cuando el panel esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => PlanBanner.inicializar(), 500);
    });
} else {
    setTimeout(() => PlanBanner.inicializar(), 500);
}

// Actualizar cuando cambie el plan
document.addEventListener('grizalumPlanCambiado', () => {
    PlanBanner.actualizarBanner();
});

console.log('✅ Sistema de Banner del Plan cargado');
