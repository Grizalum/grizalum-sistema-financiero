/**
 * ═══════════════════════════════════════════════════════════════════
 * CARGADOR DE VISTAS DINÁMICO - GRIZALUM
 * Sistema para cargar módulos completos desde archivos externos
 * ═══════════════════════════════════════════════════════════════════
 */

window.CargadorVistas = {
    vistas: {
        'dashboard': {
            nombre: 'Panel de Control',
            contenedorPropio: 'dashboardContent', // Ya existe en el DOM
            cargarDinamico: false
        },
        'cash-flow': {
            nombre: 'Flujo de Caja',
            contenedorPropio: 'cash-flowContent', // Ya existe en el DOM
            cargarDinamico: false
        },
        'income-statement': {
            nombre: 'Estado de Resultados',
            rutaHTML: './src/vistas/estado-resultados/estado-resultados.html',
            rutaCSS: './src/vistas/estado-resultados/estado-resultados.css',
            scripts: [
                './src/vistas/estado-resultados/estado-resultados-config.js',
                './src/vistas/estado-resultados/estado-resultados.js',
                './src/vistas/estado-resultados/estado-resultados-ui.js',
                './src/vistas/estado-resultados/estado-resultados-exportador.js',
                './src/vistas/estado-resultados/estado-resultados-graficos.js'
            ],
            cargarDinamico: true,
            eventoInicio: 'estadoResultadosVisible'
        },
        'balance-sheet': {
            nombre: 'Balance General',
            contenedorPropio: 'balance-sheetContent',
            cargarDinamico: false
        },
        'cuentas-bancarias': {
            nombre: 'Cuentas Bancarias',
            contenedorPropio: 'cuentasBancariasContent',
            cargarDinamico: false
        },
        'inventory': {
            nombre: 'Inventario',
            contenedorPropio: 'inventoryContent',
            cargarDinamico: false
        },
        'sales': {
            nombre: 'Ventas',
            contenedorPropio: 'salesContent',
            cargarDinamico: false
        }
    },

    vistaActual: null,
    csssCargados: new Set(),
    scriptsCargados: new Set(),
    vistasHTML: new Map(),

    /**
     * Inicializar el sistema
     */
    init() {
        console.log('🎯 Cargador de Vistas inicializado');
        
        // Asegurar que contenedorVistas existe
        if (!document.getElementById('contenedorVistas')) {
            console.warn('⚠️ contenedorVistas no encontrado, creándolo...');
            const main = document.querySelector('.main-content');
            if (main) {
                const div = document.createElement('div');
                div.id = 'contenedorVistas';
                div.className = 'contenedor-vistas';
                main.appendChild(div);
            }
        }
    },

    /**
     * Cargar una vista
     */
    async cargarVista(vistaId) {
        console.log(`🔄 Cargando vista: ${vistaId}`);
        
        const configuracion = this.vistas[vistaId];
        
        if (!configuracion) {
            console.error(`❌ Vista no registrada: ${vistaId}`);
            return false;
        }

        try {
            // Si la vista se carga dinámicamente desde HTML externo
            if (configuracion.cargarDinamico) {
                await this._cargarVistaDinamica(vistaId, configuracion);
            } else {
                // Vista estática que ya está en el DOM
                this._mostrarVistaEstatica(vistaId, configuracion);
            }

            this.vistaActual = vistaId;
            
            // Actualizar navegación
            this._actualizarNavegacion(vistaId);
            
            // Actualizar título de página
            this._actualizarTitulo(configuracion.nombre);
            
            console.log(`✅ Vista cargada: ${vistaId}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error cargando vista ${vistaId}:`, error);
            return false;
        }
    },

    /**
     * Cargar vista dinámica desde archivo HTML
     */
    async _cargarVistaDinamica(vistaId, config) {
        console.log(`📦 Cargando vista dinámica: ${vistaId}`);
        
        // Ocultar todas las vistas
        this._ocultarTodasLasVistas();
        
        const contenedor = document.getElementById('contenedorVistas');
        if (!contenedor) {
            throw new Error('Contenedor de vistas no encontrado');
        }

        // Cargar CSS si no está cargado
        if (config.rutaCSS && !this.csssCargados.has(config.rutaCSS)) {
            await this._cargarCSS(config.rutaCSS);
            this.csssCargados.add(config.rutaCSS);
        }

        // Cargar HTML si no está en caché
        if (!this.vistasHTML.has(vistaId)) {
            const html = await this._fetchHTML(config.rutaHTML);
            this.vistasHTML.set(vistaId, html);
        }

        // Insertar HTML en el contenedor
        contenedor.innerHTML = this.vistasHTML.get(vistaId);
        contenedor.style.display = 'block';
        contenedor.classList.add('active');

        // Cargar scripts si hay
        if (config.scripts) {
            for (const script of config.scripts) {
                if (!this.scriptsCargados.has(script)) {
                    await this._cargarScript(script);
                    this.scriptsCargados.add(script);
                }
            }
        }

        // Disparar evento de vista visible
        if (config.eventoInicio) {
            window.dispatchEvent(new CustomEvent(config.eventoInicio));
        }

        console.log(`✅ Vista dinámica cargada: ${vistaId}`);
    },

    /**
     * Mostrar vista estática (ya está en el DOM)
     */
    _mostrarVistaEstatica(vistaId, config) {
        console.log(`📄 Mostrando vista estática: ${vistaId}`);
        
        // Ocultar todas las vistas
        this._ocultarTodasLasVistas();
        
        // Buscar contenedor de la vista
        const contenedorId = config.contenedorPropio;
        const contenedor = document.getElementById(contenedorId);
        
        if (contenedor) {
            contenedor.style.display = 'block';
            contenedor.classList.add('active');
            
            // Si es cuentas bancarias, ejecutar su función
            if (vistaId === 'cuentas-bancarias' && window.mostrarSeccionCuentasBancarias) {
                window.mostrarSeccionCuentasBancarias();
            }
        } else {
            console.error(`❌ Contenedor no encontrado: ${contenedorId}`);
        }
    },

    /**
     * Ocultar todas las vistas
     */
    _ocultarTodasLasVistas() {
        // Ocultar contenedor dinámico
        const contenedorVistas = document.getElementById('contenedorVistas');
        if (contenedorVistas) {
            contenedorVistas.style.display = 'none';
            contenedorVistas.classList.remove('active');
        }

        // Ocultar contenedores estáticos
        document.querySelectorAll('.dashboard-content').forEach(sec => {
            sec.style.display = 'none';
            sec.classList.remove('active');
        });
    },

    /**
     * Actualizar navegación activa
     */
    _actualizarNavegacion(vistaId) {
        // Remover active de todos los links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar active al link actual
        const linkActivo = document.querySelector(`.nav-link[data-section="${vistaId}"]`);
        if (linkActivo) {
            linkActivo.classList.add('active');
        }
    },

    /**
     * Actualizar título de página
     */
    _actualizarTitulo(titulo) {
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = titulo;
        }
    },

    /**
     * Cargar CSS dinámicamente
     */
    async _cargarCSS(url) {
        return new Promise((resolve, reject) => {
            // Verificar si ya existe
            if (document.querySelector(`link[href="${url}"]`)) {
                resolve();
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => {
                console.log(`✅ CSS cargado: ${url}`);
                resolve();
            };
            link.onerror = (error) => {
                console.error(`❌ Error cargando CSS: ${url}`, error);
                reject(error);
            };
            document.head.appendChild(link);
        });
    },

    /**
     * Cargar script dinámicamente
     */
    async _cargarScript(url) {
        return new Promise((resolve, reject) => {
            // Verificar si ya existe
            if (document.querySelector(`script[src="${url}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                console.log(`✅ Script cargado: ${url}`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`❌ Error cargando script: ${url}`, error);
                reject(error);
            };
            document.body.appendChild(script);
        });
    },

    /**
     * Fetch HTML content
     */
    async _fetchHTML(url) {
        console.log(`📥 Descargando HTML: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${url}`);
        }
        
        const html = await response.text();
        
        // Extraer solo el contenido del body si es un HTML completo
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.body;
        
        // Si tiene un contenedor principal, usarlo
        const contenedorPrincipal = body.querySelector('#estadoResultadosApp, .estado-resultados-container');
        
        if (contenedorPrincipal) {
            return contenedorPrincipal.outerHTML;
        }
        
        // Si no, devolver todo el body
        return body.innerHTML;
    }
};

/**
 * Función global para cambiar sección (reemplaza la anterior)
 */
function cambiarSeccion(seccionId, event) {
    if (event) {
        event.preventDefault();
    }
    
    console.log('🎯 Cambiando a sección:', seccionId);
    
    // Usar el cargador de vistas
    window.CargadorVistas.cargarVista(seccionId);
}

// Hacer la función global
window.cambiarSeccion = cambiarSeccion;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.CargadorVistas.init();
    });
} else {
    window.CargadorVistas.init();
}

console.log('🚀 Cargador de Vistas GRIZALUM v1.0 registrado');
