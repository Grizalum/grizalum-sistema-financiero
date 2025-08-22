/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    GRIZALUM PANEL ADMIN PREMIUM                             ║
 * ║                    VERSIÓN PROFESIONAL 2.0 - 2025                          ║
 * ║                      COMPLETAMENTE FUNCIONAL                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

class GestorEmpresasAdminPremium {
    constructor(gestorPrincipal) {
        this.gestor = gestorPrincipal;
        this.modalActivo = null;
        this.datosTemporales = {};
        this.notificaciones = this._cargarNotificaciones();
        this.logs = this._cargarLogs();
        this.configuracion = this._cargarConfiguracion();
        
        this._inicializarSistema();
        this._log('info', '👑 PANEL ADMIN PREMIUM inicializado');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODO PRINCIPAL: ABRIR PANEL ADMIN PREMIUM
    // ═══════════════════════════════════════════════════════════════════════════

    abrirPanelAdmin(empresaId = null) {
        this._log('info', '👑 Abriendo Panel Admin Premium');
        this._cerrarModalPrevio();
        this._crearModalAdminPremium(empresaId);
    }

    _crearModalAdminPremium(empresaId) {
        const modal = document.createElement('div');
        modal.id = 'grizalumModalAdminPremium';
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
                    ${this._generarGestionUsuarios()}
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

    // ═══════════════════════════════════════════════════════════════════════════
    // HEADER PREMIUM ULTRA PROFESIONAL
    // ═══════════════════════════════════════════════════════════════════════════

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
                <!-- Efectos de fondo -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"premium-grid\" width=\"15\" height=\"15\" patternUnits=\"userSpaceOnUse\"><path d=\"M 15 0 L 0 0 0 15\" fill=\"none\" stroke=\"rgba(255,255,255,0.08)\" stroke-width=\"0.5\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23premium-grid)\" /></svg>'); opacity: 0.4;"></div>
                
                <!-- Elementos decorativos -->
                <div style="position: absolute; top: -150px; right: -150px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); border-radius: 50%;"></div>
                
                <div style="position: relative; z-index: 3;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="display: flex; align-items: center; gap: 32px;">
                            <!-- Badge SUPER ADMIN -->
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
                            
                            <!-- Logo del sistema -->
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
                            
                            <!-- Información del panel -->
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
                        
                        <!-- Panel de estado en tiempo real -->
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
                            
                            <!-- Botón cerrar premium -->
                            <button 
                                onclick="adminPremium.cerrarModal()" 
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
                </style>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // NAVEGACIÓN PREMIUM
    // ═══════════════════════════════════════════════════════════════════════════

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
                <button class="premium-nav-btn" data-seccion="usuarios" style="
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
                    <span style="font-size: 18px;">👥</span> USUARIOS
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

    // ═══════════════════════════════════════════════════════════════════════════
    // DASHBOARD GLOBAL
    // ═══════════════════════════════════════════════════════════════════════════

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
                    
                    <div style="display: flex; align-items: center; gap: 24px;">
                        <div style="text-align: center;">
                            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">ESTADO</div>
                            <div style="
                                background: ${estadoColor}; 
                                color: white; 
                                padding: 4px 12px; 
                                border-radius: 12px; 
                                font-size: 12px; 
                                font-weight: 600;
                            ">${empresa.estado}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">CAJA</div>
                            <div style="color: ${cajaColor}; font-weight: 700; font-size: 14px;">S/. ${(empresa.finanzas?.caja || 0).toLocaleString()}</div>
                        </div>
                        <button 
                            onclick="adminPremium.abrirControlEmpresa('${empresa.id}')" 
                            style="
                                background: linear-gradient(135deg, #d4af37, #b8941f); 
                                color: white; 
                                border: none; 
                                padding: 8px 16px; 
                                border-radius: 12px; 
                                cursor: pointer; 
                                font-weight: 600;
                                font-size: 12px;
                                transition: all 0.3s ease;
                            "
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'"
                        >🔧 GESTIONAR</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CONTROL DE EMPRESAS
    // ═══════════════════════════════════════════════════════════════════════════

    _generarControlEmpresas() {
        return `
            <div class="premium-seccion" id="seccion-control" style="padding: 32px; display: none;">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    
                    <!-- Panel de Control -->
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🛠️</div>
                            Control de Empresas
                        </h3>
                        
                        <div style="display: grid; gap: 16px;">
                            <button 
                                onclick="adminPremium.suspenderTodasEmpresas()" 
                                style="
                                    background: linear-gradient(135deg, #f59e0b, #d97706); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 14px;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(245, 158, 11, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                            >
                                <span style="font-size: 20px;">⏸️</span> SUSPENDER TODAS LAS EMPRESAS
                            </button>
                            
                            <button 
                                onclick="adminPremium.reactivarTodasEmpresas()" 
                                style="
                                    background: linear-gradient(135deg, #10b981, #059669); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 14px;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                            >
                                <span style="font-size: 20px;">▶️</span> REACTIVAR TODAS LAS EMPRESAS
                            </button>
                            
                            <button 
                                onclick="adminPremium.exportarTodasEmpresas()" 
                                style="
                                    background: linear-gradient(135deg, #3b82f6, #2563eb); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 14px;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                            >
                                <span style="font-size: 20px;">📤</span> EXPORTAR TODAS LAS EMPRESAS
                            </button>
                            
                            <button 
                                onclick="adminPremium.crearBackupGeneral()" 
                                style="
                                    background: linear-gradient(135deg, #8b5cf6, #7c3aed); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 14px;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(139, 92, 246, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                            >
                                <span style="font-size: 20px;">💾</span> CREAR BACKUP GENERAL
                            </button>
                        </div>
                    </div>
                    
                    <!-- Herramientas Avanzadas -->
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37, #b8941f); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🚀</div>
                            Herramientas Premium
                        </h3>
                        
                        <div style="display: grid; gap: 16px;">
                            <button 
                                onclick="adminPremium.limpiarEmpresasInactivas()" 
                                style="
                                    background: linear-gradient(135deg, #ef4444, #dc2626); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 14px;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(239, 68, 68, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                            >
                                <span style="font-size: 20px;">🗑️</span> LIMPIAR EMPRESAS INACTIVAS
                            </button>
                            
                            <button 
                                onclick="adminPremium.resetearSistema()" 
                                style="
                                    background: linear-gradient(135deg, #64748b, #475569); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 14px;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(100, 116, 139, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                            >
                                <span style="font-size: 20px;">🔄</span> RESETEAR SISTEMA
                            </button>
                            
                            <button 
                                onclick="adminPremium.optimizarRendimiento()" 
                                style="
                                    background: linear-gradient(135deg, #10b981, #059669); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 14px;
                                    transition: all 0.3s ease;
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                            >
                                <span style="font-size: 20px;">⚡</span> OPTIMIZAR RENDIMIENTO
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Lista de Control Individual -->
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); margin-top: 32px;">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🎯</div>
                        Control Individual de Empresas
                    </h3>
                    
                    <div style="display: grid; gap: 16px;">
                        ${this._generarControlIndividual()}
                    </div>
                </div>
            </div>
        `;
    }

    _generarControlIndividual() {
        const empresas = Object.values(this.gestor.estado.empresas);
        
        return empresas.map(empresa => `
            <div style="
                display: flex; 
                align-items: center; 
                justify-content: space-between; 
                padding: 20px; 
                background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); 
                border-radius: 16px; 
                border: 1px solid #e2e8f0;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="
                        width: 50px; 
                        height: 50px; 
                        background: linear-gradient(135deg, #d4af37, #b8941f); 
                        border-radius: 12px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 20px;
                        color: white;
                    ">
                        ${empresa.icono || '🏢'}
                    </div>
                    <div>
                        <div style="font-weight: 700; font-size: 16px; color: #1e293b;">${empresa.nombre}</div>
                        <div style="font-size: 12px; color: #64748b;">${empresa.estado} - ${empresa.categoria}</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button 
                        onclick="adminPremium.editarEmpresa('${empresa.id}')" 
                        style="
                            background: linear-gradient(135deg, #3b82f6, #2563eb); 
                            color: white; 
                            border: none; 
                            padding: 8px 12px; 
                            border-radius: 8px; 
                            cursor: pointer; 
                            font-size: 12px;
                            font-weight: 600;
                        "
                    >✏️ EDITAR</button>
                    
                    <button 
                        onclick="adminPremium.suspenderEmpresa('${empresa.id}')" 
                        style="
                            background: linear-gradient(135deg, #f59e0b, #d97706); 
                            color: white; 
                            border: none; 
                            padding: 8px 12px; 
                            border-radius: 8px; 
                            cursor: pointer; 
                            font-size: 12px;
                            font-weight: 600;
                        "
                    >⏸️ SUSPENDER</button>
                    
                    <button 
                        onclick="adminPremium.eliminarEmpresa('${empresa.id}')" 
                        style="
                            background: linear-gradient(135deg, #ef4444, #dc2626); 
                            color: white; 
                            border: none; 
                            padding: 8px 12px; 
                            border-radius: 8px; 
                            cursor: pointer; 
                            font-size: 12px;
                            font-weight: 600;
                        "
                    >🗑️ ELIMINAR</button>
                </div>
            </div>
        `).join('');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE NOTIFICACIONES
    // ═══════════════════════════════════════════════════════════════════════════

    _generarSistemaNotificaciones() {
        return `
            <div class="premium-seccion" id="seccion-notificaciones" style="padding: 32px; display: none;">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    
                    <!-- Enviar Notificaciones -->
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📢</div>
                            Enviar Avisos
                        </h3>
                        
                        <div style="display: grid; gap: 16px;">
                            <div>
                                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Tipo de Aviso</label>
                                <select id="premium-tipo-aviso" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                                    <option value="info">💡 Información</option>
                                    <option value="warning">⚠️ Advertencia</option>
                                    <option value="urgent">🚨 Urgente</option>
                                    <option value="success">✅ Éxito</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Destinatario</label>
                                <select id="premium-destinatario" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                                    <option value="todas">📢 Todas las Empresas</option>
                                    <option value="activas">✅ Solo Empresas Activas</option>
                                    <option value="riesgo">⚠️ Solo Empresas en Riesgo</option>
                                    ${this._generarOpcionesEmpresas()}
                                </select>
                            </div>
                            
                            <div>
                                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Mensaje</label>
                                <textarea 
                                    id="premium-mensaje" 
                                    placeholder="Escriba su mensaje aquí..."
                                    style="width: 100%; height: 120px; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; resize: vertical;"
                                ></textarea>
                            </div>
                            
                            <button 
                                onclick="adminPremium.enviarNotificacion()" 
                                style="
                                    background: linear-gradient(135deg, #f59e0b, #d97706); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 16px;
                                    transition: all 0.3s ease;
                                "
                                onmouseover="this.style.transform='translateY(-2px)'"
                                onmouseout="this.style.transform='translateY(0)'"
                            >📤 ENVIAR AVISO</button>
                        </div>
                    </div>
                    
                    <!-- Historial de Notificaciones -->
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📋</div>
                            Historial de Avisos
                        </h3>
                        
                        <div style="max-height: 400px; overflow-y: auto;">
                            ${this._generarHistorialNotificaciones()}
                        </div>
                    </div>
                </div>
                
                <!-- Configuración de Alertas Automáticas -->
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); margin-top: 32px;">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🤖</div>
                        Alertas Automáticas
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div style="padding: 20px; background: #f8fafc; border-radius: 12px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 12px;">
                                <input type="checkbox" id="alerta-caja-baja" ${this.configuracion.alertas?.cajaBaja ? 'checked' : ''}>
                                🪙 Caja Baja
                            </label>
                            <input 
                                type="number" 
                                id="umbral-caja" 
                                placeholder="Umbral (S/.)"
                                value="${this.configuracion.alertas?.umbralCaja || 1000}"
                                style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;"
                            >
                        </div>
                        
                        <div style="padding: 20px; background: #f8fafc; border-radius: 12px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 12px;">
                                <input type="checkbox" id="alerta-inactividad" ${this.configuracion.alertas?.inactividad ? 'checked' : ''}>
                                😴 Inactividad
                            </label>
                            <input 
                                type="number" 
                                id="dias-inactividad" 
                                placeholder="Días"
                                value="${this.configuracion.alertas?.diasInactividad || 7}"
                                style="width: 100%; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;"
                            >
                        </div>
                        
                        <div style="padding: 20px; background: #f8fafc; border-radius: 12px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 12px;">
                                <input type="checkbox" id="alerta-metricas" ${this.configuracion.alertas?.metricas ? 'checked' : ''}>
                                📊 Métricas Críticas
                            </label>
                            <button 
                                onclick="adminPremium.guardarConfiguracionAlertas()" 
                                style="
                                    width: 100%;
                                    background: #8b5cf6; 
                                    color: white; 
                                    border: none; 
                                    padding: 8px; 
                                    border-radius: 6px; 
                                    cursor: pointer;
                                "
                            >💾 Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _generarOpcionesEmpresas() {
        const empresas = Object.values(this.gestor.estado.empresas);
        return empresas.map(empresa => 
            `<option value="${empresa.id}">🏢 ${empresa.nombre}</option>`
        ).join('');
    }

    _generarHistorialNotificaciones() {
        if (!this.notificaciones.length) {
            return `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📭</div>
                    <div>No hay notificaciones enviadas</div>
                </div>
            `;
        }
        
        return this.notificaciones.slice(-10).reverse().map(notif => {
            const iconoTipo = {
                'info': '💡',
                'warning': '⚠️',
                'urgent': '🚨',
                'success': '✅'
            };
            
            return `
                <div style="
                    padding: 16px; 
                    border-left: 4px solid #d4af37; 
                    background: #f8fafc; 
                    border-radius: 8px; 
                    margin-bottom: 12px;
                ">
                    <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #374151;">
                            ${iconoTipo[notif.tipo]} ${notif.tipo.toUpperCase()}
                        </span>
                        <span style="font-size: 12px; color: #64748b;">${new Date(notif.fecha).toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">${notif.mensaje}</div>
                    <div style="font-size: 12px; color: #9ca3af;">Para: ${notif.destinatario}</div>
                </div>
            `;
        }).join('');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ANALYTICS PREMIUM
    // ═══════════════════════════════════════════════════════════════════════════

    _generarAnalyticsPremium() {
        return `
            <div class="premium-seccion" id="seccion-analytics" style="padding: 32px; display: none;">
                
                <!-- Métricas Comparativas -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; margin-bottom: 32px;">
                    
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📊</div>
                            Ranking por Ingresos
                        </h3>
                        
                        <div style="display: grid; gap: 12px;">
                            ${this._generarRankingIngresos()}
                        </div>
                    </div>
                    
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">⚠️</div>
                            Empresas en Riesgo
                        </h3>
                        
                        <div style="display: grid; gap: 12px;">
                            ${this._generarEmpresasRiesgo()}
                        </div>
                    </div>
                </div>
                
                <!-- Análisis por Categorías -->
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37, #b8941f); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📈</div>
                        Análisis por Categorías
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        ${this._generarAnalisisCategorias()}
                    </div>
                </div>
            </div>
        `;
    }

    _generarRankingIngresos() {
        const empresas = Object.values(this.gestor.estado.empresas)
            .sort((a, b) => (b.finanzas?.ingresos || 0) - (a.finanzas?.ingresos || 0))
            .slice(0, 5);
        
        return empresas.map((empresa, index) => {
            const posicion = index + 1;
            const medalla = posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : posicion === 3 ? '🥉' : `#${posicion}`;
            
            return `
                <div style="
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    padding: 16px; 
                    background: ${posicion <= 3 ? 'linear-gradient(135deg, #fef3c7, #fbbf24)' : '#f8fafc'}; 
                    border-radius: 12px;
                    border: 1px solid ${posicion <= 3 ? '#f59e0b' : '#e2e8f0'};
                ">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 20px; font-weight: 800;">${medalla}</span>
                        <div>
                            <div style="font-weight: 700; color: #1e293b;">${empresa.nombre}</div>
                            <div style="font-size: 12px; color: #64748b;">${empresa.categoria}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 700; color: #10b981;">S/. ${(empresa.finanzas?.ingresos || 0).toLocaleString()}</div>
                        <div style="font-size: 12px; color: #64748b;">anuales</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    _generarEmpresasRiesgo() {
        const empresasRiesgo = Object.values(this.gestor.estado.empresas)
            .filter(e => (e.finanzas?.caja || 0) < 1000 || e.estado !== 'Operativo')
            .slice(0, 5);
        
        if (!empresasRiesgo.length) {
            return `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                    <div>No hay empresas en riesgo</div>
                </div>
            `;
        }
        
        return empresasRiesgo.map(empresa => {
            const nivelRiesgo = (empresa.finanzas?.caja || 0) < 500 ? 'ALTO' : 'MEDIO';
            const colorRiesgo = nivelRiesgo === 'ALTO' ? '#ef4444' : '#f59e0b';
            
            return `
                <div style="
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    padding: 16px; 
                    background: linear-gradient(135deg, #fef2f2, #fecaca); 
                    border-radius: 12px;
                    border: 1px solid #f87171;
                ">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="
                            width: 40px; 
                            height: 40px; 
                            background: ${colorRiesgo}; 
                            border-radius: 10px; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            color: white; 
                            font-size: 16px;
                        ">${empresa.icono || '🏢'}</div>
                        <div>
                            <div style="font-weight: 700; color: #1e293b;">${empresa.nombre}</div>
                            <div style="font-size: 12px; color: #64748b;">Caja: S/. ${(empresa.finanzas?.caja || 0).toLocaleString()}</div>
                        </div>
                    </div>
                    <div style="
                        background: ${colorRiesgo}; 
                        color: white; 
                        padding: 4px 12px; 
                        border-radius: 12px; 
                        font-size: 12px; 
                        font-weight: 700;
                    ">${nivelRiesgo}</div>
                </div>
            `;
        }).join('');
    }

    _generarAnalisisCategorias() {
        const categorias = {};
        Object.values(this.gestor.estado.empresas).forEach(empresa => {
            const cat = empresa.categoria;
            if (!categorias[cat]) {
                categorias[cat] = { count: 0, ingresos: 0, activas: 0 };
            }
            categorias[cat].count++;
            categorias[cat].ingresos += empresa.finanzas?.ingresos || 0;
            if (empresa.estado === 'Operativo') categorias[cat].activas++;
        });
        
        return Object.entries(categorias).map(([categoria, datos]) => `
            <div style="
                padding: 20px; 
                background: linear-gradient(135deg, #f8fafc, #ffffff); 
                border-radius: 16px; 
                border: 1px solid #e2e8f0;
                text-align: center;
            ">
                <div style="font-size: 24px; margin-bottom: 12px;">🏢</div>
                <div style="font-weight: 700; color: #1e293b; margin-bottom: 8px;">${categoria}</div>
                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">${datos.count} empresas</div>
                <div style="font-size: 14px; color: #10b981; margin-bottom: 4px;">${datos.activas} activas</div>
                <div style="font-size: 12px; color: #d4af37;">S/. ${(datos.ingresos/1000).toFixed(0)}K</div>
            </div>
        `).join('');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GESTIÓN DE USUARIOS
    // ═══════════════════════════════════════════════════════════════════════════

    _generarGestionUsuarios() {
        return `
            <div class="premium-seccion" id="seccion-usuarios" style="padding: 32px; display: none;">
                
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">👥</div>
                        Gestión de Usuarios
                    </h3>
                    
                    <div style="text-align: center; padding: 60px; color: #64748b;">
                        <div style="font-size: 64px; margin-bottom: 24px;">👤</div>
                        <div style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">Gestión de Usuarios Premium</div>
                        <div style="margin-bottom: 24px;">Control avanzado de accesos y permisos por empresa</div>
                        <button 
                            onclick="adminPremium.mostrarConfiguracionUsuarios()" 
                            style="
                                background: linear-gradient(135deg, #8b5cf6, #7c3aed); 
                                color: white; 
                                border: none; 
                                padding: 16px 32px; 
                                border-radius: 12px; 
                                cursor: pointer; 
                                font-weight: 700;
                                font-size: 16px;
                                transition: all 0.3s ease;
                            "
                            onmouseover="this.style.transform='translateY(-2px)'"
                            onmouseout="this.style.transform='translateY(0)'"
                        >🔧 CONFIGURAR ACCESOS</button>
                    </div>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // AUDITORÍA
    // ═══════════════════════════════════════════════════════════════════════════

    _generarAuditoria() {
        return `
            <div class="premium-seccion" id="seccion-auditoria" style="padding: 32px; display: none;">
                
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #64748b, #475569); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🛡️</div>
                        Registro de Auditoría
                    </h3>
                    
                    <div style="max-height: 500px; overflow-y: auto;">
                        ${this._generarRegistroLogs()}
                    </div>
                </div>
            </div>
        `;
    }

    _generarRegistroLogs() {
        if (!this.logs.length) {
            return `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
                    <div>No hay registros de auditoría</div>
                </div>
            `;
        }
        
        return this.logs.slice(-20).reverse().map(log => {
            const iconoTipo = {
                'info': '💡',
                'warning': '⚠️',
                'error': '❌',
                'success': '✅'
            };
            
            const colorTipo = {
                'info': '#3b82f6',
                'warning': '#f59e0b',
                'error': '#ef4444',
                'success': '#10b981'
            };
            
            return `
                <div style="
                    padding: 16px; 
                    border-left: 4px solid ${colorTipo[log.nivel] || '#64748b'}; 
                    background: #f8fafc; 
                    border-radius: 8px; 
                    margin-bottom: 12px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #374151;">
                            ${iconoTipo[log.nivel] || '📝'} ${log.nivel.toUpperCase()}
                        </span>
                        <span style="font-size: 12px; color: #64748b;">${new Date(log.fecha).toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; color: #64748b;">${log.mensaje}</div>
                    ${log.datos ? `<div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">Datos: ${JSON.stringify(log.datos)}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CONFIGURACIÓN DEL SISTEMA
    // ═══════════════════════════════════════════════════════════════════════════

    _generarConfiguracionSistema() {
        return `
            <div class="premium-seccion" id="seccion-configuracion" style="padding: 32px; display: none;">
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    
                    <!-- Configuración General -->
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">⚙️</div>
                            Configuración General
                        </h3>
                        
                        <div style="display: grid; gap: 16px;">
                            <div>
                                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Backup Automático</label>
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" id="backup-automatico" ${this.configuracion.backupAutomatico ? 'checked' : ''}>
                                    Crear backup diario automático
                                </label>
                            </div>
                            
                            <div>
                                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Límite de Empresas</label>
                                <input 
                                    type="number" 
                                    id="limite-empresas" 
                                    value="${this.configuracion.limiteEmpresas || 100}"
                                    style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;"
                                >
                            </div>
                            
                            <div>
                                <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Modo de Seguridad</label>
                                <select id="modo-seguridad" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                                    <option value="normal" ${this.configuracion.modoSeguridad === 'normal' ? 'selected' : ''}>Normal</option>
                                    <option value="alto" ${this.configuracion.modoSeguridad === 'alto' ? 'selected' : ''}>Alto</option>
                                    <option value="maximo" ${this.configuracion.modoSeguridad === 'maximo' ? 'selected' : ''}>Máximo</option>
                                </select>
                            </div>
                            
                            <button 
                                onclick="adminPremium.guardarConfiguracionGeneral()" 
                                style="
                                    background: linear-gradient(135deg, #3b82f6, #2563eb); 
                                    color: white; 
                                    border: none; 
                                    padding: 16px; 
                                    border-radius: 12px; 
                                    cursor: pointer; 
                                    font-weight: 700;
                                    font-size: 16px;
                                "
                            >💾 GUARDAR CONFIGURACIÓN</button>
                        </div>
                    </div>
                    
                    <!-- Información del Sistema -->
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135d, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">💻</div>
                            Información del Sistema
                        </h3>
                        
                        <div style="display: grid; gap: 16px;">
                            <div style="padding: 16px; background: #f8fafc; border-radius: 8px;">
                                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">Versión</div>
                                <div style="color: #64748b;">GRIZALUM Premium v2.0</div>
                            </div>
                            
                            <div style="padding: 16px; background: #f8fafc; border-radius: 8px;">
                                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">Total de Empresas</div>
                                <div style="color: #64748b;">${Object.keys(this.gestor.estado.empresas).length}</div>
                            </div>
                            
                            <div style="padding: 16px; background: #f8fafc; border-radius: 8px;">
                                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">Último Backup</div>
                                <div style="color: #64748b;">${this.configuracion.ultimoBackup || 'Nunca'}</div>
                            </div>
                            
                            <div style="padding: 16px; background: #f8fafc; border-radius: 8px;">
                                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">Estado del Sistema</div>
                                <div style="color: #10b981; display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                                    Operativo
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FOOTER PREMIUM
    // ═══════════════════════════════════════════════════════════════════════════

    _generarFooterPremium() {
        return `
            <div style="
                background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); 
                padding: 32px 40px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                border-top: 1px solid rgba(226,232,240,0.5);
                backdrop-filter: blur(20px);
                box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
            ">
                <div style="display: flex; gap: 24px; align-items: center;">
                    <button 
                        onclick="adminPremium.generarReportePremium()" 
                        style="
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                            color: white; 
                            border: none; 
                            padding: 16px 32px; 
                            border-radius: 16px; 
                            cursor: pointer; 
                            display: flex; 
                            align-items: center; 
                            gap: 12px;
                            font-weight: 700;
                            font-size: 15px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            transition: all 0.3s ease;
                            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
                        "
                        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(16, 185, 129, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(16, 185, 129, 0.3)'"
                    >
                        <span style="font-size: 18px;">📊</span> GENERAR REPORTE
                    </button>
                    
                    <button 
                        onclick="adminPremium.exportarConfiguracion()" 
                        style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
                            color: white; 
                            border: none; 
                            padding: 16px 32px; 
                            border-radius: 16px; 
                            cursor: pointer; 
                            display: flex; 
                            align-items: center; 
                            gap: 12px;
                            font-weight: 700;
                            font-size: 15px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            transition: all 0.3s ease;
                            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
                        "
                        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(59, 130, 246, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(59, 130, 246, 0.3)'"
                    >
                        <span style="font-size: 18px;">💾</span> EXPORTAR
                    </button>
                </div>
                
                <div style="text-align: center; flex: 1;">
                    <div style="
                        background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 148, 31, 0.15) 100%);
                        padding: 16px 32px;
                        border-radius: 16px;
                        border: 2px solid rgba(212, 175, 55, 0.3);
                        display: inline-flex;
                        align-items: center;
                        gap: 12px;
                        color: #b8941f;
                        font-weight: 700;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    ">
                        <span style="font-size: 20px;">👑</span>
                        PANEL EXCLUSIVO SUPER ADMIN PREMIUM
                        <span style="font-size: 20px;">👑</span>
                    </div>
                </div>
                
                <div style="display: flex; gap: 20px;">
                    <button 
                        onclick="adminPremium.cerrarModal()" 
                        style="
                            background: linear-gradient(135deg, #64748b 0%, #475569 100%); 
                            color: white; 
                            border: none; 
                            padding: 16px 32px; 
                            border-radius: 16px; 
                            cursor: pointer;
                            font-weight: 700;
                            font-size: 15px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            transition: all 0.3s ease;
                            box-shadow: 0 8px 24px rgba(100, 116, 139, 0.3);
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 32px rgba(100, 116, 139, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(100, 116, 139, 0.3)'"
                    >❌ CERRAR</button>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EVENTOS Y FUNCIONALIDADES
    // ═══════════════════════════════════════════════════════════════════════════

    _configurarEventosPremium() {
        // Navegación entre secciones
        const botones = document.querySelectorAll('.premium-nav-btn');
        botones.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const seccion = btn.dataset.seccion;
                this._cambiarSeccionPremium(seccion);
            });
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalActivo) {
                this.cerrarModal();
            }
        });

        // Configurar estilos de navegación
        const style = document.createElement('style');
        style.textContent = `
            .premium-nav-btn:hover {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 148, 31, 0.2) 100%) !important;
                color: #d4af37 !important;
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
            }
            
            .premium-nav-btn.active {
                background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%) !important;
                color: white !important;
                box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
            }
        `;
        document.head.appendChild(style);
    }

    _cambiarSeccionPremium(seccionTarget) {
        try {
            // Remover active de botones
            document.querySelectorAll('.premium-nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Remover active de secciones
            document.querySelectorAll('.premium-seccion').forEach(sec => {
                sec.classList.remove('active');
                sec.style.display = 'none';
            });
            
            // Activar nueva sección
            const botonActivo = document.querySelector(`[data-seccion="${seccionTarget}"]`);
            const seccionActiva = document.getElementById(`seccion-${seccionTarget}`);
            
            if (botonActivo) {
                botonActivo.classList.add('active');
            }
            
            if (seccionActiva) {
                seccionActiva.classList.add('active');
                seccionActiva.style.display = 'block';
            }
            
            this._log('info', `📂 Sección premium cambiada a: ${seccionTarget}`);
        } catch (error) {
            console.error('Error cambiando sección premium:', error);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FUNCIONALIDADES PREMIUM - CONTROL DE EMPRESAS
    // ═══════════════════════════════════════════════════════════════════════════

    suspenderTodasEmpresas() {
        if (!confirm('¿Está seguro de suspender TODAS las empresas? Esta acción afectará a todos los usuarios.')) return;
        
        let suspendidas = 0;
        Object.values(this.gestor.estado.empresas).forEach(empresa => {
            if (empresa.estado === 'Operativo') {
                empresa.estado = 'Suspendido';
                suspendidas++;
            }
        });
        
        this.gestor._guardarEmpresas();
        this._registrarLog('warning', `${suspendidas} empresas suspendidas por Super Admin`);
        this._mostrarNotificacion(`⏸️ ${suspendidas} empresas suspendidas exitosamente`, 'warning');
        this._actualizarDashboard();
    }

    reactivarTodasEmpresas() {
        if (!confirm('¿Está seguro de reactivar TODAS las empresas?')) return;
        
        let reactivadas = 0;
        Object.values(this.gestor.estado.empresas).forEach(empresa => {
            if (empresa.estado === 'Suspendido') {
                empresa.estado = 'Operativo';
                reactivadas++;
            }
        });
        
        this.gestor._guardarEmpresas();
        this._registrarLog('success', `${reactivadas} empresas reactivadas por Super Admin`);
        this._mostrarNotificacion(`▶️ ${reactivadas} empresas reactivadas exitosamente`, 'success');
        this._actualizarDashboard();
    }

    exportarTodasEmpresas() {
        try {
            const datos = {
                timestamp: new Date().toISOString(),
                version: 'GRIZALUM Premium v2.0',
                totalEmpresas: Object.keys(this.gestor.estado.empresas).length,
                empresas: this.gestor.estado.empresas,
                configuracion: this.configuracion,
                logs: this.logs.slice(-100) // Últimos 100 logs
            };
            
            const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GRIZALUM_Backup_Completo_${new Date().getTime()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this._registrarLog('info', 'Backup completo exportado por Super Admin');
            this._mostrarNotificacion('📤 Backup completo exportado exitosamente', 'success');
        } catch (error) {
            this._mostrarNotificacion('❌ Error al exportar backup', 'error');
        }
    }

    crearBackupGeneral() {
        try {
            const backup = {
                fecha: new Date().toISOString(),
                version: 'GRIZALUM Premium v2.0',
                empresas: this.gestor.estado.empresas,
                configuracion: this.configuracion
            };
            
            localStorage.setItem('grizalum_backup_' + Date.now(), JSON.stringify(backup));
            this.configuracion.ultimoBackup = new Date().toLocaleString();
            this._guardarConfiguracion();
            
            this._registrarLog('success', 'Backup automático creado exitosamente');
            this._mostrarNotificacion('💾 Backup creado y guardado exitosamente', 'success');
        } catch (error) {
            this._mostrarNotificacion('❌ Error al crear backup', 'error');
        }
    }

    limpiarEmpresasInactivas() {
        if (!confirm('¿Está seguro de eliminar todas las empresas inactivas? Esta acción NO se puede deshacer.')) return;
        
        const empresasInactivas = Object.entries(this.gestor.estado.empresas)
            .filter(([id, empresa]) => empresa.estado === 'Inactivo' || empresa.estado === 'Suspendido');
        
        if (empresasInactivas.length === 0) {
            this._mostrarNotificacion('ℹ️ No hay empresas inactivas para eliminar', 'info');
            return;
        }
        
        empresasInactivas.forEach(([id, empresa]) => {
            delete this.gestor.estado.empresas[id];
        });
        
        this.gestor._guardarEmpresas();
        this._registrarLog('warning', `${empresasInactivas.length} empresas inactivas eliminadas`);
        this._mostrarNotificacion(`🗑️ ${empresasInactivas.length} empresas inactivas eliminadas`, 'warning');
        this._actualizarDashboard();
    }

    resetearSistema() {
        if (!confirm('¿ESTÁ SEGURO? Esta acción eliminará TODAS las empresas y configuraciones. NO se puede deshacer.')) return;
        if (!confirm('CONFIRMACIÓN FINAL: ¿Realmente desea resetear todo el sistema?')) return;
        
        // Crear backup de emergencia antes del reseteo
        this.crearBackupGeneral();
        
        // Resetear datos
        this.gestor.estado.empresas = {};
        this.logs = [];
        this.notificaciones = [];
        this.configuracion = this._configuracionPorDefecto();
        
        // Guardar cambios
        this.gestor._guardarEmpresas();
        this._guardarLogs();
        this._guardarNotificaciones();
        this._guardarConfiguracion();
        
        this._registrarLog('error', 'Sistema reseteado completamente por Super Admin');
        this._mostrarNotificacion('🔄 Sistema reseteado completamente', 'warning');
        
        setTimeout(() => {
            this.cerrarModal();
            location.reload();
        }, 2000);
    }

    optimizarRendimiento() {
        try {
            // Limpiar logs antiguos (mantener solo últimos 1000)
            this.logs = this.logs.slice(-1000);
            
            // Limpiar notificaciones antiguas (mantener solo últimas 500)
            this.notificaciones = this.notificaciones.slice(-500);
            
            // Limpiar localStorage de backups antiguos
            const keys = Object.keys(localStorage).filter(key => key.startsWith('grizalum_backup_'));
            const ahora = Date.now();
            keys.forEach(key => {
                const timestamp = parseInt(key.split('_')[2]);
                if (ahora - timestamp > 30 * 24 * 60 * 60 * 1000) { // 30 días
                    localStorage.removeItem(key);
                }
            });
            
            this._guardarLogs();
            this._guardarNotificaciones();
            
            this._registrarLog('success', 'Sistema optimizado por Super Admin');
            this._mostrarNotificacion('⚡ Sistema optimizado exitosamente', 'success');
        } catch (error) {
            this._mostrarNotificacion('❌ Error al optimizar sistema', 'error');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FUNCIONALIDADES PREMIUM - CONTROL INDIVIDUAL
    // ═══════════════════════════════════════════════════════════════════════════

    abrirControlEmpresa(empresaId) {
        const empresa = this.gestor.estado.empresas[empresaId];
        if (!empresa) return;
        
        // Abrir el panel admin original pero con permisos premium
        this.cerrarModal();
        setTimeout(() => {
            if (window.adminEmpresas) {
                window.adminEmpresas.abrirPanelAdmin(empresaId);
            }
        }, 300);
    }

    editarEmpresa(empresaId) {
        this.abrirControlEmpresa(empresaId);
    }

    suspenderEmpresa(empresaId) {
        const empresa = this.gestor.estado.empresas[empresaId];
        if (!empresa) return;
        
        if (!confirm(`¿Está seguro de suspender la empresa "${empresa.nombre}"?`)) return;
        
        empresa.estado = 'Suspendido';
        this.gestor._guardarEmpresas();
        
        this._registrarLog('warning', `Empresa "${empresa.nombre}" suspendida por Super Admin`);
        this._mostrarNotificacion(`⏸️ Empresa "${empresa.nombre}" suspendida`, 'warning');
        this._actualizarDashboard();
    }

    eliminarEmpresa(empresaId) {
        const empresa = this.gestor.estado.empresas[empresaId];
        if (!empresa) return;
        
        if (!confirm(`¿Está seguro de ELIMINAR la empresa "${empresa.nombre}"? Esta acción NO se puede deshacer.`)) return;
        if (!confirm('CONFIRMACIÓN FINAL: ¿Realmente desea eliminar esta empresa?')) return;
        
        delete this.gestor.estado.empresas[empresaId];
        this.gestor._guardarEmpresas();
        
        this._registrarLog('error', `Empresa "${empresa.nombre}" eliminada por Super Admin`);
        this._mostrarNotificacion(`🗑️ Empresa "${empresa.nombre}" eliminada`, 'error');
        this._actualizarDashboard();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FUNCIONALIDADES PREMIUM - NOTIFICACIONES
    // ═══════════════════════════════════════════════════════════════════════════

    enviarNotificacion() {
        const tipo = document.getElementById('premium-tipo-aviso').value;
        const destinatario = document.getElementById('premium-destinatario').value;
        const mensaje = document.getElementById('premium-mensaje').value.trim();
        
        if (!mensaje) {
            this._mostrarNotificacion('❌ El mensaje no puede estar vacío', 'error');
            return;
        }
        
        const notificacion = {
            id: Date.now(),
            tipo: tipo,
            destinatario: destinatario,
            mensaje: mensaje,
            fecha: new Date().toISOString(),
            enviado: true
        };
        
        this.notificaciones.push(notificacion);
        this._guardarNotificaciones();
        
        // Simular envío de notificación
        this._procesarEnvioNotificacion(notificacion);
        
        // Limpiar formulario
        document.getElementById('premium-mensaje').value = '';
        
        this._registrarLog('info', `Notificación ${tipo} enviada a: ${destinatario}`);
        this._mostrarNotificacion('📤 Notificación enviada exitosamente', 'success');
        
        // Actualizar historial
        setTimeout(() => {
            const historialContainer = document.querySelector('#seccion-notificaciones .admin-premium-content > div:nth-child(1) > div:nth-child(2) > div');
            if (historialContainer) {
                historialContainer.innerHTML = this._generarHistorialNotificaciones();
            }
        }, 100);
    }

    _procesarEnvioNotificacion(notificacion) {
        let destinatarios = [];
        
        switch (notificacion.destinatario) {
            case 'todas':
                destinatarios = Object.keys(this.gestor.estado.empresas);
                break;
            case 'activas':
                destinatarios = Object.entries(this.gestor.estado.empresas)
                    .filter(([id, empresa]) => empresa.estado === 'Operativo')
                    .map(([id]) => id);
                break;
            case 'riesgo':
                destinatarios = Object.entries(this.gestor.estado.empresas)
                    .filter(([id, empresa]) => (empresa.finanzas?.caja || 0) < 1000)
                    .map(([id]) => id);
                break;
            default:
                destinatarios = [notificacion.destinatario];
        }
        
        // Crear notificaciones visuales para cada destinatario
        destinatarios.forEach(empresaId => {
            this._crearNotificacionVisual(notificacion, empresaId);
        });
    }

    _crearNotificacionVisual(notificacion, empresaId) {
        const empresa = this.gestor.estado.empresas[empresaId];
        if (!empresa) return;
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this._getColorNotificacion(notificacion.tipo)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 9999999;
            max-width: 350px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        const icono = {
            'info': '💡',
            'warning': '⚠️',
            'urgent': '🚨',
            'success': '✅'
        };
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 20px;">${icono[notificacion.tipo]}</span>
                <strong>Para: ${empresa.nombre}</strong>
            </div>
            <div>${notificacion.mensaje}</div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    _getColorNotificacion(tipo) {
        const colores = {
            'info': '#3b82f6',
            'warning': '#f59e0b',
            'urgent': '#ef4444',
            'success': '#10b981'
        };
        return colores[tipo] || '#64748b';
    }

    guardarConfiguracionAlertas() {
        this.configuracion.alertas = {
            cajaBaja: document.getElementById('alerta-caja-baja').checked,
            umbralCaja: parseInt(document.getElementById('umbral-caja').value) || 1000,
            inactividad: document.getElementById('alerta-inactividad').checked,
            diasInactividad: parseInt(document.getElementById('dias-inactividad').value) || 7,
            metricas: document.getElementById('alerta-metricas').checked
        };
        
        this._guardarConfiguracion();
        this._registrarLog('info', 'Configuración de alertas actualizada');
        this._mostrarNotificacion('💾 Configuración de alertas guardada', 'success');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FUNCIONALIDADES PREMIUM - USUARIOS Y CONFIGURACIÓN
    // ═══════════════════════════════════════════════════════════════════════════

    mostrarConfiguracionUsuarios() {
        this._mostrarNotificacion('👥 Configuración de usuarios disponible en versión Enterprise', 'info');
    }

    guardarConfiguracionGeneral() {
        this.configuracion.backupAutomatico = document.getElementById('backup-automatico').checked;
        this.configuracion.limiteEmpresas = parseInt(document.getElementById('limite-empresas').value) || 100;
        this.configuracion.modoSeguridad = document.getElementById('modo-seguridad').value;
        
        this._guardarConfiguracion();
        this._registrarLog('info', 'Configuración general actualizada');
        this._mostrarNotificacion('💾 Configuración general guardada', 'success');
    }

    generarReportePremium() {
        try {
            const empresas = Object.values(this.gestor.estado.empresas);
            const fecha = new Date().toLocaleDateString();
            
            const reporte = `
REPORTE EJECUTIVO GRIZALUM PREMIUM
Generado el: ${fecha}
========================================

RESUMEN EJECUTIVO:
- Total de Empresas: ${empresas.length}
- Empresas Activas: ${empresas.filter(e => e.estado === 'Operativo').length}
- Empresas en Riesgo: ${empresas.filter(e => (e.finanzas?.caja || 0) < 1000).length}
- Ingresos Totales: S/. ${empresas.reduce((sum, e) => sum + (e.finanzas?.ingresos || 0), 0).toLocaleString()}

RANKING TOP 5 POR INGRESOS:
${empresas
    .sort((a, b) => (b.finanzas?.ingresos || 0) - (a.finanzas?.ingresos || 0))
    .slice(0, 5)
    .map((e, i) => `${i + 1}. ${e.nombre}: S/. ${(e.finanzas?.ingresos || 0).toLocaleString()}`)
    .join('\n')}

ANÁLISIS POR CATEGORÍAS:
${this._generarAnalisisCategoriasReporte()}

EMPRESAS EN RIESGO:
${empresas
    .filter(e => (e.finanzas?.caja || 0) < 1000)
    .map(e => `- ${e.nombre}: S/. ${(e.finanzas?.caja || 0).toLocaleString()} en caja`)
    .join('\n') || 'No hay empresas en riesgo'}

========================================
Reporte generado por GRIZALUM Premium v2.0
            `;
            
            const blob = new Blob([reporte], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Reporte_Ejecutivo_GRIZALUM_${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            
            this._registrarLog('info', 'Reporte ejecutivo generado');
            this._mostrarNotificacion('📊 Reporte ejecutivo generado y descargado', 'success');
        } catch (error) {
            this._mostrarNotificacion('❌ Error al generar reporte', 'error');
        }
    }

    _generarAnalisisCategoriasReporte() {
        const categorias = {};
        Object.values(this.gestor.estado.empresas).forEach(empresa => {
            const cat = empresa.categoria;
            if (!categorias[cat]) {
                categorias[cat] = { count: 0, ingresos: 0 };
            }
            categorias[cat].count++;
            categorias[cat].ingresos += empresa.finanzas?.ingresos || 0;
        });
        
        return Object.entries(categorias)
            .map(([cat, datos]) => `- ${cat}: ${datos.count} empresas, S/. ${datos.ingresos.toLocaleString()} ingresos`)
            .join('\n');
    }

    exportarConfiguracion() {
        try {
            const config = {
                timestamp: new Date().toISOString(),
                configuracion: this.configuracion,
                version: 'GRIZALUM Premium v2.0'
            };
            
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GRIZALUM_Configuracion_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this._mostrarNotificacion('💾 Configuración exportada exitosamente', 'success');
        } catch (error) {
            this._mostrarNotificacion('❌ Error al exportar configuración', 'error');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS AUXILIARES
    // ═══════════════════════════════════════════════════════════════════════════

    _actualizarDashboard() {
        const dashboardSection = document.getElementById('seccion-dashboard');
        if (dashboardSection) {
            dashboardSection.innerHTML = this._generarDashboardGlobal().replace('<div class="premium-seccion active" id="seccion-dashboard" style="padding: 32px;">', '').replace('</div>', '');
        }
        
        const controlSection = document.getElementById('seccion-control');
        if (controlSection) {
            const controlContent = this._generarControlEmpresas().replace('<div class="premium-seccion" id="seccion-control" style="padding: 32px; display: none;">', '').replace('</div>', '');
            controlSection.innerHTML = controlContent;
        }
    }

    _inicializarSistema() {
        // Verificar alertas automáticas
        this._verificarAlertas();
        
        // Configurar backup automático
        if (this.configuracion.backupAutomatico) {
            setInterval(() => {
                this.crearBackupGeneral();
            }, 24 * 60 * 60 * 1000); // Cada 24 horas
        }
    }

    _verificarAlertas() {
        if (!this.configuracion.alertas) return;
        
        const empresas = Object.values(this.gestor.estado.empresas);
        
        // Verificar caja baja
        if (this.configuracion.alertas.cajaBaja) {
            const empresasCajaBaja = empresas.filter(e => 
                (e.finanzas?.caja || 0) < this.configuracion.alertas.umbralCaja
            );
            
            empresasCajaBaja.forEach(empresa => {
                this._enviarAlertaAutomatica('warning', `Empresa "${empresa.nombre}" tiene caja baja: S/. ${(empresa.finanzas?.caja || 0).toLocaleString()}`);
            });
        }
    }

    _enviarAlertaAutomatica(tipo, mensaje) {
        const alerta = {
            id: Date.now() + Math.random(),
            tipo: tipo,
            destinatario: 'Sistema Automático',
            mensaje: mensaje,
            fecha: new Date().toISOString(),
            automatica: true
        };
        
        this.notificaciones.push(alerta);
        this._guardarNotificaciones();
        
        this._registrarLog('warning', `Alerta automática: ${mensaje}`);
    }

    _cargarNotificaciones() {
        try {
            return JSON.parse(localStorage.getItem('grizalum_admin_notificaciones') || '[]');
        } catch {
            return [];
        }
    }

    _guardarNotificaciones() {
        localStorage.setItem('grizalum_admin_notificaciones', JSON.stringify(this.notificaciones));
    }

    _cargarLogs() {
        try {
            return JSON.parse(localStorage.getItem('grizalum_admin_logs') || '[]');
        } catch {
            return [];
        }
    }

    _guardarLogs() {
        localStorage.setItem('grizalum_admin_logs', JSON.stringify(this.logs));
    }

    _cargarConfiguracion() {
        try {
            const config = JSON.parse(localStorage.getItem('grizalum_admin_config') || '{}');
            return { ...this._configuracionPorDefecto(), ...config };
        } catch {
            return this._configuracionPorDefecto();
        }
    }

    _guardarConfiguracion() {
        localStorage.setItem('grizalum_admin_config', JSON.stringify(this.configuracion));
    }

    _configuracionPorDefecto() {
        return {
            backupAutomatico: true,
            limiteEmpresas: 100,
            modoSeguridad: 'normal',
            alertas: {
                cajaBaja: true,
                umbralCaja: 1000,
                inactividad: true,
                diasInactividad: 7,
                metricas: false
            },
            ultimoBackup: null
        };
    }

    _registrarLog(nivel, mensaje, datos = null) {
        const log = {
            id: Date.now(),
            nivel: nivel,
            mensaje: mensaje,
            datos: datos,
            fecha: new Date().toISOString()
        };
        
        this.logs.push(log);
        if (this.logs.length > 2000) {
            this.logs = this.logs.slice(-1000);
        }
        this._guardarLogs();
        
        // También registrar en el gestor principal
        this._log(nivel, mensaje, datos);
    }

    _mostrarNotificacion(mensaje, tipo = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this._getColorNotificacion(tipo)};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 9999999;
            max-width: 400px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        toast.textContent = mensaje;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    _cerrarModalPrevio() {
        const modalPrevio = document.getElementById('grizalumModalAdminPremium');
        if (modalPrevio) modalPrevio.remove();
    }

    cerrarModal() {
        if (this.modalActivo) {
            this.modalActivo.style.opacity = '0';
            const content = this.modalActivo.querySelector('.modal-content-premium');
            if (content) {
                content.style.transform = 'scale(0.8) translateY(40px)';
            }
            
            setTimeout(() => {
                if (this.modalActivo) {
                    this.modalActivo.remove();
                    this.modalActivo = null;
                }
            }, 400);
        }
    }

    _log(nivel, mensaje, datos = null) {
        if (this.gestor && this.gestor._log) {
            this.gestor._log(nivel, `[PREMIUM] ${mensaje}`, datos);
        } else {
            console.log(`[PREMIUM ${nivel.toUpperCase()}] ${mensaje}`, datos);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN DEL SISTEMA PREMIUM
// ═══════════════════════════════════════════════════════════════════════════

let adminPremium = null;

// Inicializar cuando el gestor principal esté listo
document.addEventListener('gestorEmpresasListo', () => {
    if (window.gestorEmpresas && !adminPremium) {
        adminPremium = new GestorEmpresasAdminPremium(window.gestorEmpresas);
        window.adminPremium = adminPremium;
        
        // Sobrescribir el método del gestor principal para usar la versión premium
        window.gestorEmpresas.abrirPanelAdminPremium = function() {
            adminPremium.abrirPanelAdmin();
        };
        
        console.log('👑 PANEL ADMIN PREMIUM inicializado exitosamente');
        console.log('🚀 Sistema completamente funcional con todas las características premium');
    }
});

// Asegurar inicialización tardía
setTimeout(() => {
    if (window.gestorEmpresas && !adminPremium) {
        adminPremium = new GestorEmpresasAdminPremium(window.gestorEmpresas);
        window.adminPremium = adminPremium;
        
        window.gestorEmpresas.abrirPanelAdminPremium = function() {
            adminPremium.abrirPanelAdmin();
        };
        
        console.log('👑 PANEL ADMIN PREMIUM inicializado (modo tardío)');
    }
}, 3000);

// Función global para acceso directo
window.abrirPanelAdminPremium = function() {
    if (adminPremium) {
        adminPremium.abrirPanelAdmin();
    } else {
        console.error('Panel Admin Premium no está inicializado');
    }
};
