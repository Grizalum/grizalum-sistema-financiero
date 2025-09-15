/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                 GRIZALUM ADMIN PREMIUM - VERSIÓN LIMPIA                     ║
 * ║                   CONEXIÓN CON NOTIFICACIONES MANAGER                       ║
 * ║                         100% FUNCIONAL                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// PASO 1: SOBRESCRIBIR COMPLETAMENTE LA CLASE ORIGINAL
window.GestorEmpresasAdmin = class GestorEmpresasAdminPremium {
    constructor(gestorPrincipal) {
        this.gestor = gestorPrincipal;
        this.modalActivo = null;
        this.datosTemporales = {};
        this.notificaciones = this._cargarNotificaciones();
        this.logs = this._cargarLogs();
        this.configuracion = this._cargarConfiguracion();
        
        this._inicializarSistema();
        console.log('👑 PANEL ADMIN PREMIUM ACTIVADO - REEMPLAZANDO ORIGINAL');
    }

    // MÉTODO PRINCIPAL QUE REEMPLAZA AL ORIGINAL
    abrirPanelAdmin(empresaId = null) {
        console.log('🚀 Abriendo Panel Admin Premium (reemplazo total)');
        this._cerrarModalPrevio();
        this._crearModalAdminPremium(empresaId);
    }

    _crearModalAdminPremium(empresaId) {
        const modal = document.createElement('div');
        modal.id = 'grizalumModalAdmin';
        modal.style.cssText = `
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(20,20,30,0.95) 100%); 
            z-index: 999999; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 20px;
            backdrop-filter: blur(15px);
            opacity: 0;
            transition: all 0.4s ease;
        `;

        modal.innerHTML = `
            <div style="
                background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%); 
                border-radius: 32px; 
                width: 1400px; 
                max-width: 98vw; 
                max-height: 95vh; 
                overflow: hidden;
                box-shadow: 
                    0 0 0 1px rgba(255,255,255,0.1),
                    0 30px 90px rgba(0,0,0,0.6),
                    0 0 150px rgba(212, 175, 55, 0.3);
                transform: scale(0.8) translateY(40px);
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                border: 3px solid rgba(212, 175, 55, 0.2);
            " class="modal-content-premium">
                
                <!-- HEADER PREMIUM ULTRA -->
                ${this._generarHeaderPremium()}
                
                <!-- NAVEGACIÓN PREMIUM -->
                ${this._generarNavegacionPremium()}
                
                <!-- CONTENIDO PRINCIPAL -->
                <div style="
                    height: 550px; 
                    overflow-y: auto;
                    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
                " class="admin-premium-content">
                    ${this._generarDashboardGlobal()}
                    ${this._generarControlEmpresas()}
                    ${this._generarSistemaNotificaciones()}
                    ${this._generarAnalyticsPremium()}
                    ${this._generarAuditoria()}
                    ${this._generarConfiguracionSistema()}
                </div>

                <!-- FOOTER PREMIUM -->
                ${this._generarFooterPremium()}
            </div>
        `;

        document.body.appendChild(modal);
        this.modalActivo = modal;
        
        // Animación de entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-content-premium');
            content.style.transform = 'scale(1) translateY(0)';
        }, 50);
        
        this._configurarEventosPremium();
        this._actualizarDashboard();
    }

    _generarHeaderPremium() {
        const totalEmpresas = Object.keys(this.gestor.estado.empresas).length;
        const empresasActivas = Object.values(this.gestor.estado.empresas).filter(e => e.estado === 'Operativo').length;
        const ingresoTotal = Object.values(this.gestor.estado.empresas).reduce((sum, e) => sum + (e.finanzas?.ingresos || 0), 0);

        return `
            <div style="
                background: linear-gradient(135deg, #d4af37 0%, #b8941f 50%, #1a1a2e 100%); 
                color: white; 
                padding: 40px; 
                position: relative;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            ">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"premium-grid\" width=\"15\" height=\"15\" patternUnits=\"userSpaceOnUse\"><path d=\"M 15 0 L 0 0 0 15\" fill=\"none\" stroke=\"rgba(255,255,255,0.08)\" stroke-width=\"0.5\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23premium-grid)\" /></svg>'); opacity: 0.4;"></div>
                
                <div style="position: absolute; top: -150px; right: -150px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); border-radius: 50%;"></div>
                
                <div style="position: relative; z-index: 3;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="display: flex; align-items: center; gap: 32px;">
                            <div style="
                                background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                                padding: 12px 28px;
                                border-radius: 30px;
                                font-size: 14px;
                                font-weight: 900;
                                text-transform: uppercase;
                                letter-spacing: 2px;
                                box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
                                border: 2px solid rgba(255,255,255,0.3);
                                animation: pulse-admin 2s infinite;
                            ">
                                👑 SUPER ADMIN PREMIUM
                            </div>
                            
                            <div style="
                                width: 100px; 
                                height: 100px; 
                                background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%); 
                                border-radius: 28px; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: 48px;
                                backdrop-filter: blur(20px);
                                border: 3px solid rgba(255,255,255,0.2);
                                box-shadow: 
                                    inset 0 2px 0 rgba(255,255,255,0.4),
                                    0 12px 40px rgba(0,0,0,0.3);
                                position: relative;
                                overflow: hidden;
                            ">
                                <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 200%; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%); transform: rotate(45deg); animation: shimmer 3s infinite;"></div>
                                🏆
                            </div>
                            
                            <div>
                                <div style="
                                    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%);
                                    padding: 8px 20px;
                                    border-radius: 25px;
                                    font-size: 14px;
                                    font-weight: 700;
                                    margin-bottom: 16px;
                                    backdrop-filter: blur(10px);
                                    border: 1px solid rgba(255,255,255,0.15);
                                    text-transform: uppercase;
                                    letter-spacing: 1px;
                                ">CENTRO DE CONTROL EJECUTIVO</div>
                                <h1 style="margin: 0; font-size: 36px; font-weight: 900; text-shadow: 0 4px 12px rgba(0,0,0,0.4); background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.9) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                    GRIZALUM PREMIUM
                                </h1>
                                <div style="display: flex; gap: 20px; margin-top: 20px;">
                                    <span style="background: rgba(255,255,255,0.2); padding: 10px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15);">
                                        🏢 ${totalEmpresas} Empresas
                                    </span>
                                    <span style="background: rgba(16, 185, 129, 0.3); padding: 10px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15);">
                                        ✅ ${empresasActivas} Activas
                                    </span>
                                    <span style="background: rgba(59, 130, 246, 0.3); padding: 10px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15);">
                                        💰 S/. ${ingresoTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: right;">
                            <div style="
                                background: rgba(255,255,255,0.15);
                                padding: 20px;
                                border-radius: 20px;
                                backdrop-filter: blur(20px);
                                border: 1px solid rgba(255,255,255,0.2);
                                margin-bottom: 16px;
                            ">
                                <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Sistema</div>
                                <div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
                                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse-status 1.5s infinite;"></div>
                                    ONLINE
                                </div>
                                <div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">${new Date().toLocaleString()}</div>
                            </div>
                            
                            <button 
                                onclick="adminEmpresas.cerrarModal()" 
                                style="
                                    width: 64px; 
                                    height: 64px; 
                                    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%); 
                                    border: 3px solid rgba(255,255,255,0.2); 
                                    border-radius: 24px; 
                                    color: white; 
                                    cursor: pointer; 
                                    font-size: 28px;
                                    font-weight: bold;
                                    transition: all 0.3s ease;
                                    backdrop-filter: blur(20px);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                                "
                                onmouseover="this.style.background='linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)'; this.style.transform='scale(1.1) rotate(90deg)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'"
                                onmouseout="this.style.background='linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'; this.style.transform='scale(1) rotate(0deg)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)'"
                            >×</button>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes pulse-admin {
                        0%, 100% { box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5); }
                        50% { box-shadow: 0 6px 30px rgba(220, 38, 38, 0.8); }
                    }
                    @keyframes pulse-status {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    @keyframes shimmer {
                        0% { transform: translateX(-100%) rotate(45deg); }
                        100% { transform: translateX(200%) rotate(45deg); }
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                </style>
            </div>
        `;
    }

    _generarNavegacionPremium() {
        return `
            <div style="
                background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%); 
                padding: 0; 
                display: flex; 
                border-bottom: 1px solid rgba(226,232,240,0.5);
                backdrop-filter: blur(20px);
                box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            ">
                <button class="premium-nav-btn active" data-seccion="dashboard" style="
                    flex: 1; 
                    padding: 18px 20px; 
                    border: none; 
                    background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    font-weight: 700; 
                    color: white; 
                    transition: all 0.3s ease;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
                ">
                    <span style="font-size: 18px;">📊</span> DASHBOARD
                </button>
                <button class="premium-nav-btn" data-seccion="control" style="
                    flex: 1; 
                    padding: 18px 20px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    font-weight: 700; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">
                    <span style="font-size: 18px;">🏢</span> CONTROL
                </button>
                <button class="premium-nav-btn" data-seccion="notificaciones" style="
                    flex: 1; 
                    padding: 18px 20px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    font-weight: 700; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">
                    <span style="font-size: 18px;">🔔</span> AVISOS
                </button>
                <button class="premium-nav-btn" data-seccion="analytics" style="
                    flex: 1; 
                    padding: 18px 20px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    font-weight: 700; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">
                    <span style="font-size: 18px;">📈</span> ANALYTICS
                </button>
                <button class="premium-nav-btn" data-seccion="auditoria" style="
                    flex: 1; 
                    padding: 18px 20px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    font-weight: 700; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">
                    <span style="font-size: 18px;">🛡️</span> AUDITORÍA
                </button>
                <button class="premium-nav-btn" data-seccion="configuracion" style="
                    flex: 1; 
                    padding: 18px 20px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    font-weight: 700; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">
                    <span style="font-size: 18px;">⚙️</span> CONFIG
                </button>
            </div>
        `;
    }

    _generarDashboardGlobal() {
        const empresas = Object.values(this.gestor.estado.empresas);
        const totalEmpresas = empresas.length;
        const empresasActivas = empresas.filter(e => e.estado === 'Operativo').length;
        const empresasRiesgo = empresas.filter(e => (e.finanzas?.caja || 0) < 1000).length;
        const ingresoTotal = empresas.reduce((sum, e) => sum + (e.finanzas?.ingresos || 0), 0);

        return `
            <div class="premium-seccion active" id="seccion-dashboard" style="padding: 32px;">
                
                <!-- Métricas Globales -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px;">
                    
                    <div style="
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        padding: 28px;
                        border-radius: 20px;
                        color: white;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
                    ">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 36px; margin-bottom: 12px;">🏢</div>
                            <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">${totalEmpresas}</div>
                            <div style="font-size: 14px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total Empresas</div>
                        </div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                        padding: 28px;
                        border-radius: 20px;
                        color: white;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
                    ">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 36px; margin-bottom: 12px;">✅</div>
                            <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">${empresasActivas}</div>
                            <div style="font-size: 14px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Activas</div>
                        </div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                        padding: 28px;
                        border-radius: 20px;
                        color: white;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
                    ">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
                            <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">${empresasRiesgo}</div>
                            <div style="font-size: 14px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">En Riesgo</div>
                        </div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
                        padding: 28px;
                        border-radius: 20px;
                        color: white;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 8px 32px rgba(212, 175, 55, 0.3);
                    ">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 36px; margin-bottom: 12px;">💰</div>
                            <div style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">S/. ${(ingresoTotal/1000).toFixed(0)}K</div>
                            <div style="font-size: 14px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Ingresos Totales</div>
                        </div>
                    </div>
                </div>
                
                <!-- Lista de Empresas -->
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37, #b8941f); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🏢</div>
                        Resumen de Empresas
                    </h3>
                    
                    <div style="display: grid; gap: 16px;">
                        ${this._generarListaEmpresasDashboard()}
                    </div>
                </div>
            </div>
        `;
    }

    _generarListaEmpresasDashboard() {
        const empresas = Object.values(this.gestor.estado.empresas);
        
        return empresas.map(empresa => {
            const estadoColor = empresa.estado === 'Operativo' ? '#10b981' : 
                             empresa.estado === 'Regular' ? '#f59e0b' : '#ef4444';
            const cajaColor = (empresa.finanzas?.caja || 0) >= 5000 ? '#10b981' : 
                            (empresa.finanzas?.caja || 0) >= 1000 ? '#f59e0b' : '#ef4444';
            
            return `
                <div style="
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); 
                    border-radius: 16px; 
                    border: 1px solid #e2e8f0;
                    transition: all 0.3s ease;
                " onmouseover="this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
                    
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="
                            width: 60px; 
                            height: 60px; 
                            background: linear-gradient(135deg, #d4af37, #b8941f); 
                            border-radius: 16px; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-size: 24px;
                            color: white;
                        ">
                            ${empresa.icono || '🏢'}
                        </div>
                        <div>
                            <div style="font-weight: 700; font-size: 16px; color: #1e293b; margin-bottom: 4px;">${empresa.nombre}</div>
                            <div style="font-size: 14px; color: #64748b;">${empresa.categoria}</div>
                        </div>
                    </div>
