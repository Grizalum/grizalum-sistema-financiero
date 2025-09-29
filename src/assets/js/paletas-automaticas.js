/**
 * GRIZALUM - Sistema de Paletas Automáticas v1.0
 * Paletas profesionales con garantía de contraste y legibilidad
 */

const PALETAS_PREMIUM = {
    'dorado-clasico': {
        nombre: 'Dorado Clásico',
        descripcion: 'Elegancia tradicional',
        colores: {
            ingresos: '#d4af37',
            gastos: '#ff6b35',
            utilidad: '#2ecc71',
            crecimiento: '#9b59b6'
        },
        tema: {
            primario: '#d4af37',
            secundario: '#b8941f',
            fondo: '#0a0a0b',
            superficie: '#1a1b23',
            texto: '#ffffff',
            textoSecundario: '#e0e0e0'
        }
    },
    
    'azul-corporativo': {
        nombre: 'Azul Corporativo',
        descripcion: 'Confianza profesional',
        colores: {
            ingresos: '#3b82f6',
            gastos: '#ef4444',
            utilidad: '#10b981',
            crecimiento: '#f59e0b'
        },
        tema: {
            primario: '#3b82f6',
            secundario: '#2563eb',
            fondo: '#0f172a',
            superficie: '#1e293b',
            texto: '#ffffff',
            textoSecundario: '#e2e8f0'
        }
    },
    
    'verde-fresco': {
        nombre: 'Verde Fresco',
        descripcion: 'Naturaleza y crecimiento',
        colores: {
            ingresos: '#10b981',
            gastos: '#f97316',
            utilidad: '#06b6d4',
            crecimiento: '#8b5cf6'
        },
        tema: {
            primario: '#10b981',
            secundario: '#059669',
            fondo: '#0a0f0a',
            superficie: '#14211a',
            texto: '#ffffff',
            textoSecundario: '#d1fae5'
        }
    },
    
    'morado-innovacion': {
        nombre: 'Morado Innovación',
        descripcion: 'Tecnología futurista',
        colores: {
            ingresos: '#8b5cf6',
            gastos: '#ef4444',
            utilidad: '#06b6d4',
            crecimiento: '#f59e0b'
        },
        tema: {
            primario: '#8b5cf6',
            secundario: '#7c3aed',
            fondo: '#1a0a2e',
            superficie: '#2d1b4e',
            texto: '#ffffff',
            textoSecundario: '#e9d5ff'
        }
    },
    
    'rojo-energia': {
        nombre: 'Rojo Energía',
        descripcion: 'Dinamismo y acción',
        colores: {
            ingresos: '#dc2626',
            gastos: '#f97316',
            utilidad: '#10b981',
            crecimiento: '#3b82f6'
        },
        tema: {
            primario: '#dc2626',
            secundario: '#b91c1c',
            fondo: '#1a0a0a',
            superficie: '#2d1515',
            texto: '#ffffff',
            textoSecundario: '#fecaca'
        }
    },
    
    'gris-minimalista': {
        nombre: 'Gris Minimalista',
        descripcion: 'Elegancia sobria',
        colores: {
            ingresos: '#6b7280',
            gastos: '#f87171',
            utilidad: '#4ade80',
            crecimiento: '#60a5fa'
        },
        tema: {
            primario: '#6b7280',
            secundario: '#4b5563',
            fondo: '#000000',
            superficie: '#111827',
            texto: '#ffffff',
            textoSecundario: '#d1d5db'
        }
    }
};

class GestorPaletas {
    constructor() {
        this.paletaActiva = null;
        this.inicializar();
    }

    inicializar() {
        this.cargarPaletaGuardada();
        this.configurarEventos();
        console.log('Sistema de Paletas Automáticas inicializado');
    }

    aplicarPaleta(nombrePaleta) {
        const paleta = PALETAS_PREMIUM[nombrePaleta];
        if (!paleta) {
            console.error('Paleta no encontrada:', nombrePaleta);
            return false;
        }

        const root = document.documentElement;

        // Aplicar colores de métricas
        root.style.setProperty('--color-ingresos', paleta.colores.ingresos);
        root.style.setProperty('--color-gastos', paleta.colores.gastos);
        root.style.setProperty('--color-utilidad', paleta.colores.utilidad);
        root.style.setProperty('--color-crecimiento', paleta.colores.crecimiento);

        // Aplicar tema global
        root.style.setProperty('--color-primario', paleta.tema.primario);
        root.style.setProperty('--color-secundario', paleta.tema.secundario);
        root.style.setProperty('--fondo-principal', paleta.tema.fondo);
        root.style.setProperty('--fondo-superficie', paleta.tema.superficie);
        root.style.setProperty('--texto-principal', paleta.tema.texto);
        root.style.setProperty('--texto-secundario', paleta.tema.textoSecundario);

        // Actualizar selector visual
        this.actualizarSelectorActivo(nombrePaleta);

        // Guardar paleta activa
        this.paletaActiva = nombrePaleta;
        localStorage.setItem('grizalum_paleta_activa', nombrePaleta);

        // Sincronizar con el editor de empresa si existe
        this.sincronizarConEditor(paleta.colores);

        console.log(`Paleta aplicada: ${paleta.nombre}`);
        return true;
    }

    sincronizarConEditor(colores) {
        // Si existe el editor de empresas y una empresa seleccionada
        if (window.gestorEmpresas && window.gestorEmpresas.estado?.empresaActual) {
            const empresaId = window.gestorEmpresas.estado.empresaActual;
            const empresa = window.gestorEmpresas.estado.empresas[empresaId];
            
            if (empresa) {
                // Actualizar colores personalizados de la empresa
                empresa.coloresPersonalizados = { ...colores };
                
                // Guardar cambios
                if (window.gestorEmpresas._guardarEmpresas) {
                    window.gestorEmpresas._guardarEmpresas();
                }
                
                console.log('Colores sincronizados con la empresa:', empresa.nombre);
            }
        }
    }

    actualizarSelectorActivo(nombrePaleta) {
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.remove('active');
        });

        const btnActivo = document.querySelector(`[data-theme="${nombrePaleta}"]`);
        if (btnActivo) {
            btnActivo.classList.add('active');
        }
    }

    cargarPaletaGuardada() {
        const paletaGuardada = localStorage.getItem('grizalum_paleta_activa');
        
        if (paletaGuardada && PALETAS_PREMIUM[paletaGuardada]) {
            this.aplicarPaleta(paletaGuardada);
        } else {
            this.aplicarPaleta('dorado-clasico');
        }
    }

    configurarEventos() {
        // Escuchar cambios desde el editor de empresas
        document.addEventListener('empresaColoresActualizados', (event) => {
            if (event.detail?.colores) {
                this.aplicarColoresPersonalizados(event.detail.colores);
            }
        });
    }

    aplicarColoresPersonalizados(colores) {
        const root = document.documentElement;
        
        root.style.setProperty('--color-ingresos', colores.ingresos);
        root.style.setProperty('--color-gastos', colores.gastos);
        root.style.setProperty('--color-utilidad', colores.utilidad);
        root.style.setProperty('--color-crecimiento', colores.crecimiento);

        console.log('Colores personalizados aplicados desde el editor');
    }

    obtenerPaletaActual() {
        return {
            nombre: this.paletaActiva,
            paleta: PALETAS_PREMIUM[this.paletaActiva]
        };
    }

    listarPaletas() {
        return Object.entries(PALETAS_PREMIUM).map(([key, paleta]) => ({
            id: key,
            nombre: paleta.nombre,
            descripcion: paleta.descripcion
        }));
    }
}

// Inicializar sistema
const gestorPaletas = new GestorPaletas();

// Función global para el selector flotante
window.aplicarPaletaAutomatica = (nombrePaleta) => {
    return gestorPaletas.aplicarPaleta(nombrePaleta);
};

// Exponer instancia global
window.gestorPaletas = gestorPaletas;

console.log('Sistema de Paletas Automáticas cargado');
