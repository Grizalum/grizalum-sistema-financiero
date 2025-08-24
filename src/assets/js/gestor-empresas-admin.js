/**
 * GRIZALUM ADMIN PREMIUM - PASO 1 CORREGIDO
 * Versión corregida para eliminar errores de undefined
 */

// Verificación inicial del sistema
function verificarSistema() {
    if (!window.gestorEmpresas) {
        console.warn('⚠️ gestorEmpresas no disponible - Creando estructura base');
        window.gestorEmpresas = {
            estado: { empresas: {} },
            _guardarEmpresas: function() {
                try {
                    localStorage.setItem('grizalum_empresas', JSON.stringify(this.estado.empresas));
                } catch (error) {
                    console.error('Error guardando empresas:', error);
                }
            },
            _log: function(nivel, mensaje) {
                console.log(`[${nivel}] ${mensaje}`);
            }
        };
    }
    
    if (!window.gestorEmpresas.estado) {
        window.gestorEmpresas.estado = { empresas: {} };
    }
    
    if (!window.gestorEmpresas.estado.empresas) {
        window.gestorEmpresas.estado.empresas = {};
    }
}

// Clase Admin Premium Corregida
window.GestorEmpresasAdmin = class GestorEmpresasAdminPremium {
    constructor(gestorPrincipal = null) {
        // Verificar sistema antes de inicializar
        verificarSistema();
        
        this.gestor = gestorPrincipal || window.gestorEmpresas;
        this.modalActivo = null;
        
        // Verificar que el gestor tenga la estructura correcta
        this.verificarEstructura();
        
        console.log('👑 PANEL ADMIN PREMIUM ACTIVADO - PASO 1');
    }

    verificarEstructura() {
        if (!this.gestor.estado) {
            this.gestor.estado = { empresas: {} };
        }
        
        if (!this.gestor.estado.empresas) {
            this.gestor.estado.empresas = {};
        }
        
        // Si no hay empresas, crear algunas de ejemplo
        if (Object.keys(this.gestor.estado.empresas).length === 0) {
            this.crearEmpresasEjemplo();
        }
    }

    crearEmpresasEjemplo() {
        console.log('📝 Creando empresas de ejemplo...');
        
        this.gestor.estado.empresas = {
            'fundicion-laguna': {
                id: 'fundicion-laguna',
                nombre: 'Fundición Laguna',
                categoria: 'Metalurgia',
                estado: 'Operativo',
                icono: '🔥',
                finanzas: {
                    caja: 2500,
                    ingresos: 8000,
                    gastos: 5500
                }
            },
            'avicola-san-juan': {
                id: 'avicola-san-juan',
                nombre: 'Avícola San Juan',
                categoria: 'Agropecuario',
                estado: 'Operativo',
                icono: '🐔',
                finanzas: {
                    caja: 3200,
                    ingresos: 6500,
                    gastos: 4200
                }
            },
            'constructora-alfa': {
                id: 'constructora-alfa',
                nombre: 'Constructora Alfa',
                categoria: 'Construcción',
                estado: 'Regular',
                icono: '🏗️',
                finanzas: {
                    caja: 800,
                    ingresos: 12000,
                    gastos: 11500
                }
            }
        };
        
        // Guardar las empresas
        if (this.gestor._guardarEmpresas) {
            this.gestor._guardarEmpresas();
        }
        
        console.log('✅ Empresas de ejemplo creadas');
    }

    // MÉTODO PRINCIPAL - Abrir Panel Admin
    abrirPanelAdmin(empresaId = null) {
        try {
            console.log('🚀 Abriendo Panel Admin Premium');
            
            // Verificar sistema nuevamente
            verificarSistema();
            
            this.cerrarModalPrevio();
            this.crearModal();
        } catch (error) {
            console.error('❌ Error abriendo panel:', error);
            alert('Error abriendo panel admin. Revisa la consola.');
        }
    }

    crearModal() {
        const modal = document.createElement('div');
        modal.id = 'grizalumModalAdmin';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const empresas = Object.values(this.gestor.estado.empresas || {});
        const totalEmpresas = empresas.length;
        const empresasActivas = empresas.filter(e => e.estado === 'Operativo').length;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                width: 1200px;
                max-width: 95vw;
                max-height: 95vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            ">
                <!-- Header -->
                <div style="
                    background: linear-gradient(135deg, #d4af37, #b8941f);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    position: relative;
                ">
                    <button onclick="adminEmpresas.cerrarModal()" style="
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 20px;
                        font-weight: bold;
                    ">×</button>
                    
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                        <div style="font-size: 60px;">👑</div>
                        <div>
                            <h1 style="margin: 0; font-size: 28px;">GRIZALUM PREMIUM</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">Panel de Control Ejecutivo</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">${totalEmpresas}</div>
                            <div style="font-size: 12px; opacity: 0.8;">TOTAL EMPRESAS</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">${empresasActivas}</div>
                            <div style="font-size: 12px; opacity: 0.8;">ACTIVAS</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">ONLINE</div>
                            <div style="font-size: 12px; opacity: 0.8;">SISTEMA</div>
                        </div>
                    </div>
                </div>

                <!-- Contenido -->
                <div style="padding: 40px;">
                    <h2 style="margin: 0 0 30px 0; color: #1e293b; display: flex; align-items: center; gap: 15px;">
                        <span style="font-size: 32px;">🏢</span>
                        Dashboard de Empresas
                    </h2>
                    
                    ${this.generarListaEmpresas()}
                    
                    <!-- Acciones Principales -->
                    <div style="margin-top: 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <button onclick="adminEmpresas.suspenderTodas()" style="
                            background: #f59e0b;
                            color: white;
                            border: none;
                            padding: 20px;
                            border-radius: 12px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 16px;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            ⏸️ SUSPENDER TODAS
                        </button>
                        
                        <button onclick="adminEmpresas.reactivarTodas()" style="
                            background: #10b981;
                            color: white;
                            border: none;
                            padding: 20px;
                            border-radius: 12px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 16px;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            ▶️ REACTIVAR TODAS
                        </button>
                        
                        <button onclick="adminEmpresas.generarReporte()" style="
                            background: #3b82f6;
                            color: white;
                            border: none;
                            padding: 20px;
                            border-radius: 12px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 16px;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            📊 GENERAR REPORTE
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modalActivo = modal;

        console.log('✅ Modal creado exitosamente');
    }

    generarListaEmpresas() {
        const empresas = Object.values(this.gestor.estado.empresas || {});
        
        if (empresas.length === 0) {
            return `
                <div style="
                    text-align: center;
                    padding: 60px;
                    color: #64748b;
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 2px dashed #e2e8f0;
                ">
                    <div style="font-size: 64px; margin-bottom: 20px;">📋</div>
                    <h3 style="margin: 0 0 10px 0;">No hay empresas registradas</h3>
                    <p style="margin: 0;">Las empresas aparecerán aquí cuando se registren en el sistema</p>
                </div>
            `;
        }

        return `
            <div style="display: grid; gap: 15px;">
                ${empresas.map(empresa => `
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 20px;
                        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                        border: 1px solid #e2e8f0;
                        border-radius: 12px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                        
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="
                                width: 60px;
                                height: 60px;
                                background: linear-gradient(135deg, #d4af37, #b8941f);
                                border-radius: 12px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 24px;
                                color: white;
                            ">${empresa.icono || '🏢'}</div>
                            
                            <div>
                                <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 18px;">${empresa.nombre || 'Sin nombre'}</h3>
                                <div style="display: flex; gap: 15px; font-size: 14px; color: #64748b;">
                                    <span>📂 ${empresa.categoria || 'General'}</span>
                                    <span>💰 S/. ${(empresa.finanzas?.caja || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="
                                background: ${empresa.estado === 'Operativo' ? '#10b981' : empresa.estado === 'Regular' ? '#f59e0b' : '#ef4444'};
                                color: white;
                                padding: 6px 12px;
                                border-radius: 20px;
                                font-size: 12px;
                                font-weight: bold;
                            ">${empresa.estado || 'Desconocido'}</div>
                            
                            <button onclick="adminEmpresas.gestionarEmpresa('${empresa.id}')" style="
                                background: linear-gradient(135deg, #d4af37, #b8941f);
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 14px;
                                transition: transform 0.2s;
                            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                🔧 GESTIONAR
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Funciones de control
    suspenderTodas() {
        if (!confirm('¿Estás seguro de suspender TODAS las empresas?')) return;
        
        let suspendidas = 0;
        Object.values(this.gestor.estado.empresas).forEach(empresa => {
            if (empresa.estado === 'Operativo') {
                empresa.estado = 'Suspendido';
                suspendidas++;
            }
        });
        
        this.gestor._guardarEmpresas();
        alert(`✅ ${suspendidas} empresas suspendidas`);
        this.actualizarModal();
    }

    reactivarTodas() {
        if (!confirm('¿Estás seguro de reactivar TODAS las empresas?')) return;
        
        let reactivadas = 0;
        Object.values(this.gestor.estado.empresas).forEach(empresa => {
            if (empresa.estado === 'Suspendido') {
                empresa.estado = 'Operativo';
                reactivadas++;
            }
        });
        
        this.gestor._guardarEmpresas();
        alert(`✅ ${reactivadas} empresas reactivadas`);
        this.actualizarModal();
    }

    generarReporte() {
        const empresas = Object.values(this.gestor.estado.empresas);
        const fecha = new Date().toLocaleString();
        
        const reporte = `
REPORTE GRIZALUM PREMIUM
Fecha: ${fecha}
========================

Total Empresas: ${empresas.length}
Empresas Activas: ${empresas.filter(e => e.estado === 'Operativo').length}
Empresas Suspendidas: ${empresas.filter(e => e.estado === 'Suspendido').length}

LISTADO:
${empresas.map(e => `- ${e.nombre} (${e.estado}) - Caja: S/. ${(e.finanzas?.caja || 0).toLocaleString()}`).join('\n')}

========================
Generado por GRIZALUM Premium
        `;
        
        console.log(reporte);
        alert('📊 Reporte generado en la consola');
    }

    gestionarEmpresa(empresaId) {
        const empresa = this.gestor.estado.empresas[empresaId];
        if (empresa) {
            alert(`🔧 Gestionando: ${empresa.nombre}\n\nEsta función se expandirá en los siguientes pasos.`);
        }
    }

    actualizarModal() {
        if (this.modalActivo) {
            this.cerrarModal();
            setTimeout(() => this.abrirPanelAdmin(), 100);
        }
    }

    cerrarModalPrevio() {
        const modalPrevio = document.getElementById('grizalumModalAdmin');
        if (modalPrevio) modalPrevio.remove();
    }

    cerrarModal() {
        if (this.modalActivo) {
            this.modalActivo.remove();
            this.modalActivo = null;
        }
    }
}

// INICIALIZACIÓN AUTOMÁTICA
function inicializarAdminPremium() {
    try {
        verificarSistema();
        
        const adminPremium = new window.GestorEmpresasAdmin();
        window.adminEmpresas = adminPremium;
        
        // Función global de acceso
        window.abrirPanelAdminPremium = () => adminPremium.abrirPanelAdmin();
        
        console.log('🚀 ADMIN PREMIUM INICIALIZADO');
        console.log('✅ Usa: adminEmpresas.abrirPanelAdmin()');
        
    } catch (error) {
        console.error('❌ Error inicializando admin:', error);
    }
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAdminPremium);
} else {
    inicializarAdminPremium();
}

// También intentar inicializar cada segundo hasta que funcione
let intentos = 0;
const intervalo = setInterval(() => {
    if (window.gestorEmpresas || intentos >= 10) {
        inicializarAdminPremium();
        clearInterval(intervalo);
    }
    intentos++;
}, 1000);
