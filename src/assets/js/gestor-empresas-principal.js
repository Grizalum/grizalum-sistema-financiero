/**
 * ================================================================
 * GRIZALUM GESTOR DE EMPRESAS - ARCHIVO PRINCIPAL
 * Sistema de gestión empresarial para el mercado peruano
 * Versión: 2.0 - Modular y Optimizado
 * ================================================================
 */

class GestorEmpresas {
    constructor() {
        console.log('🏢 Iniciando Gestor de Empresas GRIZALUM v2.0');
        
        // Variables principales
        this.empresas = {};
        this.empresaActual = null;
        this.sistemaIniciado = false;
        this.registroActividades = [];
        
        // Configuración para Perú
        this.config = {
            moneda: 'S/.',
            pais: 'Perú',
            zona: 'America/Lima'
        };
        
        this.inicializar();
    }

    // ================================================================
    // INICIALIZACIÓN
    // ================================================================
    
    inicializar() {
        try {
            console.log('🚀 Iniciando sistema...');
            
            this.cargarEmpresas();
            this.crearEstilosBase();
            this.mostrarSelectorEmpresas();
            this.configurarEventos();
            this.seleccionarPrimeraEmpresa();
            
            this.sistemaIniciado = true;
            console.log('✅ Sistema listo para usar');
            
        } catch (error) {
            console.error('❌ Error al iniciar:', error);
        }
    }

    // ================================================================
    // CARGAR Y GUARDAR DATOS
    // ================================================================
    
    cargarEmpresas() {
        const datosGuardados = localStorage.getItem('grizalum_empresas');
        
        if (datosGuardados) {
            this.empresas = JSON.parse(datosGuardados);
        } else {
            // Empresas por defecto para Perú
            this.empresas = {
                'fundicion-laguna': {
                    nombre: 'Fundición Laguna',
                    icono: '🔥',
                    estado: 'Operativo',
                    ruc: '20123456789',
                    ubicacion: 'Lima, Lima',
                    telefono: '+51 1 234-5678',
                    tipo: 'Manufactura',
                    dinero: {
                        caja: 124500,
                        ingresos: 2847293,
                        gastos: 1892847,
                        ganancia: 954446
                    },
                    fechaCreacion: new Date().toISOString()
                },
                'avicola-san-juan': {
                    nombre: 'Avícola San Juan',
                    icono: '🐔',
                    estado: 'Operativo',
                    ruc: '20987654321',
                    ubicacion: 'Arequipa, Arequipa',
                    telefono: '+51 54 456-7890',
                    tipo: 'Agropecuario',
                    dinero: {
                        caja: 89300,
                        ingresos: 1850000,
                        gastos: 1200000,
                        ganancia: 650000
                    },
                    fechaCreacion: new Date().toISOString()
                },
                'comercial-lima': {
                    nombre: 'Comercial Lima',
                    icono: '🏪',
                    estado: 'Regular',
                    ruc: '20555666777',
                    ubicacion: 'Lima, Lima',
                    telefono: '+51 1 567-8901',
                    tipo: 'Comercio',
                    dinero: {
                        caja: 45200,
                        ingresos: 950000,
                        gastos: 780000,
                        ganancia: 170000
                    },
                    fechaCreacion: new Date().toISOString()
                }
            };
            this.guardarEmpresas();
        }
    }

    guardarEmpresas() {
        localStorage.setItem('grizalum_empresas', JSON.stringify(this.empresas));
        this.registrarActividad('DATOS_GUARDADOS', 'Datos empresariales guardados');
    }

    // ================================================================
    // ESTILOS BASE
    // ================================================================
    
    crearEstilosBase() {
        const estilos = document.createElement('style');
        estilos.id = 'grizalum-gestor-estilos';
        estilos.textContent = `
            /* Gestor de Empresas - Estilos Base */
            .gestor-empresas-contenedor {
                position: relative;
                min-width: 280px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .selector-empresa-actual {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: white;
                border: 2px solid #dc2626;
                border-radius: 12px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
            }
            
            .selector-empresa-actual:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
                border-color: #b91c1c;
            }
            
            .info-empresa-actual {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .icono-empresa-actual {
                width: 45px;
                height: 45px;
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                box-shadow: 0 3px 10px rgba(220, 38, 38, 0.4);
            }
            
            .detalles-empresa-actual {
                display: flex;
                flex-direction: column;
            }
            
            .nombre-empresa-actual {
                font-size: 1rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.25rem;
            }
            
            .estado-empresa-actual {
                font-size: 0.85rem;
                font-weight: 500;
                color: #6b7280;
            }
            
            .flecha-dropdown {
                color: #6b7280;
                transition: transform 0.3s ease;
                font-size: 1.2rem;
            }
            
            .flecha-dropdown.rotada {
                transform: rotate(180deg);
            }
            
            /* Lista de empresas */
            .lista-empresas {
                position: absolute;
                top: 100%;
                right: 0;
                width: 380px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(220, 38, 38, 0.2);
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .lista-empresas.mostrar {
                opacity: 1;
                visibility: visible;
                transform: translateY(5px);
            }
            
            .cabecera-lista {
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%);
                border-bottom: 1px solid rgba(220, 38, 38, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .titulo-lista {
                margin: 0;
                color: #1f2937;
                font-size: 1.1rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .boton-nueva-empresa {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .boton-nueva-empresa:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
            }
            
            .contenedor-empresas {
                max-height: 320px;
                overflow-y: auto;
                padding: 0.5rem;
            }
            
            .tarjeta-empresa {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 0.25rem;
                border: 1px solid transparent;
            }
            
            .tarjeta-empresa:hover {
                background: linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(185, 28, 28, 0.04) 100%);
                transform: translateX(5px);
                border-color: rgba(220, 38, 38, 0.2);
            }
            
            .tarjeta-empresa.activa {
                background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.08) 100%);
                border-color: rgba(220, 38, 38, 0.3);
                box-shadow: 0 3px 10px rgba(220, 38, 38, 0.2);
            }
            
            .icono-tarjeta-empresa {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .tarjeta-empresa:hover .icono-tarjeta-empresa {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                transform: scale(1.1);
            }
            
            .info-tarjeta-empresa {
                flex: 1;
            }
            
            .nombre-tarjeta-empresa {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
            }
            
            .datos-tarjeta-empresa {
                font-size: 0.8rem;
                color: #6b7280;
            }
            
            .estado-tarjeta-empresa {
                font-size: 1.1rem;
                opacity: 0.8;
            }
            
            .pie-lista {
                padding: 1rem;
                background: linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.6) 100%);
                border-top: 1px solid rgba(220, 38, 38, 0.1);
                text-align: center;
            }
            
            .total-empresas {
                font-weight: 700;
                color: #1f2937;
                font-size: 0.9rem;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .lista-empresas {
                    width: 320px;
                    right: -20px;
                }
                
                .gestor-empresas-contenedor {
                    min-width: 250px;
                }
            }
        `;
        
        document.head.appendChild(estilos);
        console.log('🎨 Estilos base aplicados');
    }

    // ================================================================
    // RENDERIZAR SELECTOR
    // ================================================================
    
    mostrarSelectorEmpresas() {
        const contenedor = document.getElementById('companySelector');
        if (!contenedor) {
            console.error('❌ No se encontró el contenedor #companySelector');
            return;
        }

        contenedor.innerHTML = `
            <div class="gestor-empresas-contenedor">
                <div class="selector-empresa-actual" onclick="gestorEmpresas.alternarLista()">
                    <div class="info-empresa-actual">
                        <div class="icono-empresa-actual" id="iconoEmpresaActual">🔥</div>
                        <div class="detalles-empresa-actual">
                            <div class="nombre-empresa-actual" id="nombreEmpresaActual">Fundición Laguna</div>
                            <div class="estado-empresa-actual" id="estadoEmpresaActual">🟢 Operativo</div>
                        </div>
                    </div>
                    <div class="flecha-dropdown" id="flechaDropdown">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>

                <div class="lista-empresas" id="listaEmpresas">
                    <div class="cabecera-lista">
                        <h4 class="titulo-lista">🏢 Mis Empresas</h4>
                        <button class="boton-nueva-empresa" onclick="gestorEmpresas.mostrarFormularioNuevaEmpresa()">
                            <i class="fas fa-plus"></i>
                            Nueva
                        </button>
                    </div>
                    
                    <div class="contenedor-empresas" id="contenedorEmpresas">
                        <!-- Se llena dinámicamente -->
                    </div>
                    
                    <div class="pie-lista">
                        <div class="total-empresas">
                            💰 Total en Caja: S/. ${this.calcularTotalCaja().toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.actualizarListaEmpresas();
    }

    actualizarListaEmpresas() {
        const contenedor = document.getElementById('contenedorEmpresas');
        if (!contenedor) return;

        contenedor.innerHTML = '';
        
        Object.entries(this.empresas).forEach(([id, empresa]) => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-empresa';
            tarjeta.dataset.empresa = id;
            tarjeta.onclick = () => this.seleccionarEmpresa(id);
            
            tarjeta.innerHTML = `
                <div class="icono-tarjeta-empresa">${empresa.icono}</div>
                <div class="info-tarjeta-empresa">
                    <div class="nombre-tarjeta-empresa">${empresa.nombre}</div>
                    <div class="datos-tarjeta-empresa">
                        📍 ${empresa.ubicacion} • 💰 S/. ${empresa.dinero.caja.toLocaleString()}
                    </div>
                </div>
                <div class="estado-tarjeta-empresa">${this.obtenerEmojiEstado(empresa.estado)}</div>
            `;
            
            contenedor.appendChild(tarjeta);
        });
    }

    // ================================================================
    // FUNCIONES PRINCIPALES
    // ================================================================
    
    seleccionarEmpresa(empresaId) {
        if (!this.empresas[empresaId]) {
            console.error('❌ Empresa no encontrada:', empresaId);
            return;
        }

        this.empresaActual = empresaId;
        this.actualizarEmpresaActual(empresaId);
        this.cerrarLista();
        this.registrarActividad('EMPRESA_SELECCIONADA', `Empresa seleccionada: ${this.empresas[empresaId].nombre}`);
        
        // Disparar evento para otros módulos
        this.notificarCambioEmpresa(empresaId);
        
        console.log(`🏢 Empresa seleccionada: ${this.empresas[empresaId].nombre}`);
    }

    actualizarEmpresaActual(empresaId) {
        const empresa = this.empresas[empresaId];
        if (!empresa) return;

        document.getElementById('iconoEmpresaActual').textContent = empresa.icono;
        document.getElementById('nombreEmpresaActual').textContent = empresa.nombre;
        document.getElementById('estadoEmpresaActual').textContent = `${this.obtenerEmojiEstado(empresa.estado)} ${empresa.estado}`;
        
        // Actualizar tarjetas activas
        document.querySelectorAll('.tarjeta-empresa').forEach(tarjeta => {
            tarjeta.classList.remove('activa');
        });
        const tarjetaActiva = document.querySelector(`[data-empresa="${empresaId}"]`);
        if (tarjetaActiva) {
            tarjetaActiva.classList.add('activa');
        }
    }

    alternarLista() {
        const lista = document.getElementById('listaEmpresas');
        const flecha = document.getElementById('flechaDropdown');
        
        lista.classList.toggle('mostrar');
        flecha.classList.toggle('rotada');
    }

    cerrarLista() {
        const lista = document.getElementById('listaEmpresas');
        const flecha = document.getElementById('flechaDropdown');
        
        lista.classList.remove('mostrar');
        flecha.classList.remove('rotada');
    }

    seleccionarPrimeraEmpresa() {
        const primeraEmpresaId = Object.keys(this.empresas)[0];
        if (primeraEmpresaId) {
            this.seleccionarEmpresa(primeraEmpresaId);
        }
    }

    // ================================================================
    // UTILIDADES
    // ================================================================
    
    obtenerEmojiEstado(estado) {
        const mapaEstados = {
            'Operativo': '🟢',
            'Regular': '🟡',
            'Crítico': '🔴',
            'En Preparación': '🔵',
            'Mantenimiento': '🔧',
            'Suspendido': '⏸️'
        };
        return mapaEstados[estado] || '🔘';
    }

    calcularTotalCaja() {
        return Object.values(this.empresas).reduce((total, empresa) => {
            return total + (empresa.dinero.caja || 0);
        }, 0);
    }

    notificarCambioEmpresa(empresaId) {
        const evento = new CustomEvent('empresaCambiada', {
            detail: { 
                empresaId: empresaId, 
                empresa: this.empresas[empresaId],
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(evento);
    }

    registrarActividad(accion, descripcion) {
        const registro = {
            id: Date.now(),
            accion: accion,
            descripcion: descripcion,
            fecha: new Date().toISOString(),
            usuario: 'Sistema'
        };
        
        this.registroActividades.unshift(registro);
        
        // Mantener solo los últimos 100 registros
        if (this.registroActividades.length > 100) {
            this.registroActividades = this.registroActividades.slice(0, 100);
        }
        
        localStorage.setItem('grizalum_registro_actividades', JSON.stringify(this.registroActividades));
    }

    // ================================================================
    // CONFIGURAR EVENTOS
    // ================================================================
    
    configurarEventos() {
        // Cerrar lista al hacer clic fuera
        document.addEventListener('click', (evento) => {
            const gestorContenedor = document.querySelector('.gestor-empresas-contenedor');
            
            if (gestorContenedor && !gestorContenedor.contains(evento.target)) {
                this.cerrarLista();
            }
        });
        
        console.log('🎯 Eventos configurados');
    }

    // ================================================================
    // MÉTODOS PÚBLICOS PARA OTROS MÓDULOS
    // ================================================================
    
    obtenerEmpresaActual() {
        return {
            id: this.empresaActual,
            datos: this.empresas[this.empresaActual]
        };
    }

    obtenerTodasLasEmpresas() {
        return this.empresas;
    }

    mostrarFormularioNuevaEmpresa() {
        console.log('📝 Función para nueva empresa - próximamente');
        // Esta función se implementará en el siguiente archivo
    }
}

// ================================================================
// INICIALIZACIÓN GLOBAL
// ================================================================

let gestorEmpresas = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        gestorEmpresas = new GestorEmpresas();
        window.gestorEmpresas = gestorEmpresas;
        
        console.log('🇵🇪 Gestor de Empresas GRIZALUM listo para usar');
    }, 200);
});

// Función global para compatibilidad
function seleccionarEmpresa(empresaId) {
    if (window.gestorEmpresas) {
        window.gestorEmpresas.seleccionarEmpresa(empresaId);
    }
}

console.log(`
🏢 ===================================================
   GRIZALUM GESTOR DE EMPRESAS v2.0
   Sistema Empresarial para el Mercado Peruano
🏢 ===================================================

✨ CARACTERÍSTICAS:
   • 🏗️ Arquitectura modular y limpia
   • 🇵🇪 Adaptado para empresas peruanas
   • 💰 Manejo de moneda en Soles (S/.)
   • 📱 Interfaz responsive y moderna
   • 🔒 Almacenamiento local seguro

🛠️ API PRINCIPAL:
   • gestorEmpresas.seleccionarEmpresa(id)
   • gestorEmpresas.obtenerEmpresaActual()
   • gestorEmpresas.obtenerTodasLasEmpresas()

🏢 ===================================================
`);
