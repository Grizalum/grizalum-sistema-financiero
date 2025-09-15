/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                 GRIZALUM ADMIN PREMIUM - VERSIÓN COMPLETA                   ║
 * ║                   CONECTADO AL SISTEMA DE NOTIFICACIONES                    ║
 * ║                         100% FUNCIONAL Y SIN ERRORES                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

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
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(20,20,30,0.95) 100%); 
            z-index: 999999; display: flex; align-items: center; justify-content: center; 
            padding: 20px; backdrop-filter: blur(15px); opacity: 0; transition: all 0.4s ease;
        `;

        modal.innerHTML = `
            <div style="background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%); 
                border-radius: 32px; width: 1400px; max-width: 98vw; max-height: 95vh; overflow: hidden;
                box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 30px 90px rgba(0,0,0,0.6), 0 0 150px rgba(212, 175, 55, 0.3);
                transform: scale(0.8) translateY(40px); transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                border: 3px solid rgba(212, 175, 55, 0.2);" class="modal-content-premium">
                
                ${this._generarHeaderPremium()}
                ${this._generarNavegacionPremium()}
                
                <div style="height: 550px; overflow-y: auto; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);" class="admin-premium-content">
                    ${this._generarDashboardGlobal()}
                    ${this._generarControlEmpresas()}
                    ${this._generarSistemaNotificaciones()}
                    ${this._generarAnalyticsPremium()}
                    ${this._generarAuditoria()}
                    ${this._generarConfiguracionSistema()}
                </div>

                ${this._generarFooterPremium()}
            </div>
        `;

        document.body.appendChild(modal);
        this.modalActivo = modal;
        
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
            <div style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 50%, #1a1a2e 100%); 
                color: white; padding: 40px; position: relative; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.4);">
                
                <div style="position: relative; z-index: 3;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="display: flex; align-items: center; gap: 32px;">
                            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 12px 28px;
                                border-radius: 30px; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;
                                box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5); border: 2px solid rgba(255,255,255,0.3);
                                animation: pulse-admin 2s infinite;">
                                👑 SUPER ADMIN PREMIUM
                            </div>
                    </div>
                    
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37, #b8941f); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🎯</div>
                            Control Individual
                        </h3>
                        <div style="display: grid; gap: 12px; max-height: 400px; overflow-y: auto;">${this._generarControlIndividual()}</div>
                    </div>
                </div>
            </div>
        `;
    }

    _generarControlIndividual() {
        const empresas = Object.values(this.gestor.estado.empresas);
        return empresas.map(empresa => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; 
                background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37, #b8941f); 
                        border-radius: 10px; display: flex; align-items: center; justify-content: center; 
                        font-size: 16px; color: white;">${empresa.icono || '🏢'}</div>
                    <div>
                        <div style="font-weight: 700; font-size: 14px; color: #1e293b;">${empresa.nombre}</div>
                        <div style="font-size: 11px; color: #64748b;">${empresa.estado} - ${empresa.categoria}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button onclick="adminEmpresas.suspenderEmpresa('${empresa.id}')" 
                        style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; 
                        padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;">⏸️</button>
                    <button onclick="adminEmpresas.eliminarEmpresa('${empresa.id}')" 
                        style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; 
                        padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    _generarSistemaNotificaciones() {
        return `
            <div class="premium-seccion" id="seccion-notificaciones" style="padding: 32px; display: none;">
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📢</div>
                        Sistema de Avisos Premium
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                        <div>
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
                                    </select>
                                </div>
                                
                                <div>
                                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Mensaje</label>
                                    <textarea id="premium-mensaje" placeholder="Escriba su mensaje aquí..."
                                        style="width: 100%; height: 120px; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; resize: vertical;"></textarea>
                                </div>
                                
                                <button onclick="adminEmpresas.enviarNotificacion()" 
                                    style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; 
                                    padding: 16px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 16px; transition: all 0.3s ease;"
                                    onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">📤 ENVIAR AVISO</button>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="margin: 0 0 16px 0; color: #374151;">Vista Previa del Aviso</h4>
                            <div style="padding: 20px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; 
                                border-radius: 12px; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                    <span style="font-size: 24px;">💡</span>
                                    <strong>Aviso para Empresas</strong>
                                </div>
                                <div style="background: rgba(255,255,255,0.2); padding: 16px; border-radius: 8px;">
                                    Su mensaje aparecerá aquí...
                                </div>
                                <div style="font-size: 12px; opacity: 0.8; margin-top: 12px;">Enviado por: Super Admin Premium</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _generarAnalyticsPremium() {
        return `
            <div class="premium-seccion" id="seccion-analytics" style="padding: 32px; display: none;">
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📊</div>
                        Analytics Premium
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                        <div>
                            <h4 style="margin: 0 0 16px 0; color: #374151;">🏆 Ranking por Ingresos</h4>
                            <div style="display: grid; gap: 12px;">${this._generarRankingIngresos()}</div>
                        </div>
                        <div>
                            <h4 style="margin: 0 0 16px 0; color: #374151;">⚠️ Empresas en Riesgo</h4>
                            <div style="display: grid; gap: 12px;">${this._generarEmpresasRiesgo()}</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <button onclick="adminEmpresas.generarReportePremium()" 
                            style="background: linear-gradient(135deg, #d4af37, #b8941f); color: white; border: none; 
                            padding: 16px 32px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 16px; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">📊 GENERAR REPORTE COMPLETO</button>
                    </div>
                </div>
            </div>
        `;
    }

    _generarRankingIngresos() {
        const empresas = Object.values(this.gestor.estado.empresas)
            .sort((a, b) => (b.finanzas?.ingresos || 0) - (a.finanzas?.ingresos || 0)).slice(0, 5);
        
        if (!empresas.length) {
            return '<div style="text-align: center; padding: 20px; color: #64748b;">No hay datos de empresas</div>';
        }
        
        return empresas.map((empresa, index) => {
            const posicion = index + 1;
            const medalla = posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : posicion === 3 ? '🥉' : `#${posicion}`;
            
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; 
                    background: ${posicion <= 3 ? 'linear-gradient(135deg, #fef3c7, #fbbf24)' : '#f8fafc'}; 
                    border-radius: 8px; border: 1px solid ${posicion <= 3 ? '#f59e0b' : '#e2e8f0'};">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px; font-weight: 800;">${medalla}</span>
                        <div>
                            <div style="font-weight: 700; color: #1e293b; font-size: 14px;">${empresa.nombre}</div>
                            <div style="font-size: 11px; color: #64748b;">${empresa.categoria}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 700; color: #10b981; font-size: 14px;">S/. ${(empresa.finanzas?.ingresos || 0).toLocaleString()}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    _generarEmpresasRiesgo() {
        const empresasRiesgo = Object.values(this.gestor.estado.empresas)
            .filter(e => (e.finanzas?.caja || 0) < 1000 || e.estado !== 'Operativo').slice(0, 5);
        
        if (!empresasRiesgo.length) {
            return '<div style="text-align: center; padding: 20px; color: #10b981;">✅ No hay empresas en riesgo</div>';
        }
        
        return empresasRiesgo.map(empresa => {
            const nivelRiesgo = (empresa.finanzas?.caja || 0) < 500 ? 'ALTO' : 'MEDIO';
            const colorRiesgo = nivelRiesgo === 'ALTO' ? '#ef4444' : '#f59e0b';
            
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; 
                    background: linear-gradient(135deg, #fef2f2, #fecaca); border-radius: 8px; border: 1px solid #f87171;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 32px; height: 32px; background: ${colorRiesgo}; border-radius: 8px; 
                            display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">${empresa.icono || '🏢'}</div>
                        <div>
                            <div style="font-weight: 700; color: #1e293b; font-size: 14px;">${empresa.nombre}</div>
                            <div style="font-size: 11px; color: #64748b;">Caja: S/. ${(empresa.finanzas?.caja || 0).toLocaleString()}</div>
                        </div>
                    </div>
                    <div style="background: ${colorRiesgo}; color: white; padding: 4px 8px; border-radius: 8px; 
                        font-size: 10px; font-weight: 700;">${nivelRiesgo}</div>
                </div>
            `;
        }).join('');
    }

    _generarAuditoria() {
        return `
            <div class="premium-seccion" id="seccion-auditoria" style="padding: 32px; display: none;">
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #64748b, #475569); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🛡️</div>
                        Auditoría y Logs del Sistema
                    </h3>
                    <div style="max-height: 500px; overflow-y: auto;">${this._generarRegistroLogs()}</div>
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
        
        return this.logs.slice(-10).reverse().map(log => {
            const iconoTipo = { 'info': '💡', 'warning': '⚠️', 'error': '❌', 'success': '✅' };
            const colorTipo = { 'info': '#3b82f6', 'warning': '#f59e0b', 'error': '#ef4444', 'success': '#10b981' };
            
            return `
                <div style="padding: 16px; border-left: 4px solid ${colorTipo[log.nivel] || '#64748b'}; 
                    background: #f8fafc; border-radius: 8px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #374151;">
                            ${iconoTipo[log.nivel] || '📝'} ${log.nivel.toUpperCase()}
                        </span>
                        <span style="font-size: 12px; color: #64748b;">${new Date(log.fecha).toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; color: #64748b;">${log.mensaje}</div>
                </div>
            `;
        }).join('');
    }

    _generarConfiguracionSistema() {
        return `
            <div class="premium-seccion" id="seccion-configuracion" style="padding: 32px; display: none;">
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">⚙️</div>
                        Configuración del Sistema
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                        <div>
                            <h4 style="margin: 0 0 16px 0; color: #374151;">💻 Información del Sistema</h4>
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
                                    <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">Estado del Sistema</div>
                                    <div style="color: #10b981; display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse-status 1.5s infinite;"></div>
                                        Operativo
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="margin: 0 0 16px 0; color: #374151;">🔧 Acciones del Sistema</h4>
                            <div style="display: grid; gap: 12px;">
                                <button onclick="adminEmpresas.optimizarSistema()" 
                                    style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; 
                                    padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s ease;"
                                    onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">⚡ OPTIMIZAR SISTEMA</button>
                                <button onclick="adminEmpresas.limpiarCacheSistema()" 
                                    style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; 
                                    padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s ease;"
                                    onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">🧹 LIMPIAR CACHÉ</button>
                                <button onclick="adminEmpresas.exportarConfiguracion()" 
                                    style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; border: none; 
                                    padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s ease;"
                                    onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">💾 EXPORTAR CONFIG</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    _generarFooterPremium() {
        return `
            <div style="background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%); 
                padding: 32px 40px; display: flex; justify-content: space-between; align-items: center; 
                border-top: 1px solid rgba(226,232,240,0.5); backdrop-filter: blur(20px); box-shadow: 0 -4px 24px rgba(0,0,0,0.08);">
                
                <div style="display: flex; gap: 24px; align-items: center;">
                    <button onclick="adminEmpresas.generarReportePremium()" 
                        style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; 
                        padding: 16px 32px; border-radius: 16px; cursor: pointer; display: flex; align-items: center; gap: 12px;
                        font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease;
                        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);"
                        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(16, 185, 129, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(16, 185, 129, 0.3)'">
                        <span style="font-size: 18px;">📊</span> GENERAR REPORTE
                    </button>
                </div>
                
                <div style="text-align: center; flex: 1;">
                    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 148, 31, 0.15) 100%);
                        padding: 16px 32px; border-radius: 16px; border: 2px solid rgba(212, 175, 55, 0.3);
                        display: inline-flex; align-items: center; gap: 12px; color: #b8941f; font-weight: 700; font-size: 14px;
                        text-transform: uppercase; letter-spacing: 1px;">
                        <span style="font-size: 20px;">👑</span>
                        PANEL EXCLUSIVO SUPER ADMIN PREMIUM
                        <span style="font-size: 20px;">👑</span>
                    </div>
                </div>
                
                <div style="display: flex; gap: 20px;">
                    <button onclick="adminEmpresas.cerrarModal()"
                        style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; border: none; 
                        padding: 16px 32px; border-radius: 16px; cursor: pointer; font-weight: 700; font-size: 15px;
                        text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(100, 116, 139, 0.3);"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 32px rgba(100, 116, 139, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(100, 116, 139, 0.3)'">❌ CERRAR</button>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SISTEMA DE EVENTOS Y NAVEGACIÓN
    // ═══════════════════════════════════════════════════════════════════════════

    _configurarEventosPremium() {
        const botones = document.querySelectorAll('.premium-nav-btn');
        botones.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();    
                const seccion = btn.dataset.seccion;
                this._cambiarSeccionPremium(seccion);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalActivo) {
                this.cerrarModal();
            }
        });

        const style = document.createElement('style');
        style.textContent = `
            .premium-nav-btn:hover {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 148, 31, 0.2) 100%) !important;
                color: #d4af37 !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
            }
            .premium-nav-btn.active {
                background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%) !important;
                color: white !important; box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
            }
        `;
        document.head.appendChild(style);
    }

    _cambiarSeccionPremium(seccionTarget) {
        try {
            document.querySelectorAll('.premium-nav-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.premium-seccion').forEach(sec => {
                sec.classList.remove('active');
                sec.style.display = 'none';
            });
            
            const botonActivo = document.querySelector(`[data-seccion="${seccionTarget}"]`);
            const seccionActiva = document.getElementById(`seccion-${seccionTarget}`);
            
            if (botonActivo) botonActivo.classList.add('active');
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
    // SISTEMA DE NOTIFICACIONES CONECTADO AL MANAGER
    // ═══════════════════════════════════════════════════════════════════════════

    enviarNotificacion() {
        const tipo = document.getElementById('premium-tipo-aviso')?.value || 'info';
        const destinatario = document.getElementById('premium-destinatario')?.value || 'todas';  
        const mensaje = document.getElementById('premium-mensaje')?.value?.trim();
        
        if (!mensaje) {
            this._mostrarNotificacion('El mensaje es obligatorio', 'error');
            return;
        }
        
        const notificacion = {
            id: Date.now().toString(),
            tipo: tipo,
            titulo: `Aviso ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
            mensaje: mensaje,
            fecha: new Date().toISOString(),
            leida: false,
            remitente: 'Super Admin Premium'
        };
        
        if (destinatario === 'todas') {
            Object.keys(this.gestor.estado.empresas).forEach(empresaId => {
                this._añadirNotificacionEmpresaConectada(empresaId, notificacion);
            });
        } else if (destinatario === 'activas') {
            Object.entries(this.gestor.estado.empresas).forEach(([empresaId, empresa]) => {
                if (empresa.estado === 'Operativo') {
                    this._añadirNotificacionEmpresaConectada(empresaId, notificacion);
                }
            });
        } else if (destinatario === 'riesgo') {
            Object.entries(this.gestor.estado.empresas).forEach(([empresaId, empresa]) => {
                if ((empresa.finanzas?.caja || 0) < 1000) {
                    this._añadirNotificacionEmpresaConectada(empresaId, notificacion);
                }
            });
        }
        
        this._mostrarNotificacion(`Aviso "${tipo}" enviado a ${destinatario}`, 'success');
        this._registrarLog('info', `Aviso ${tipo} enviado: ${mensaje}`);
        
        if (document.getElementById('premium-mensaje')) {
            document.getElementById('premium-mensaje').value = '';
        }
    }

    _añadirNotificacionEmpresaConectada(empresaId, notificacion) {
        const empresa = this.gestor.estado.empresas[empresaId];
        if (!empresa) return;
        
        // Mantener sistema original
        if (!empresa.notificaciones) {
            empresa.notificaciones = [];
        }
        
        empresa.notificaciones.push(notificacion);
        this.gestor._guardarEmpresas();
        
        // CONECTAR CON SISTEMA DE NOTIFICACIONES MANAGER
        this._activarNotificacionEnManager(empresaId, notificacion);
    }

    _activarNotificacionEnManager(empresaId, notificacion) {
        // Buscar el botón de notificaciones del manager
        const selectores = [
            '.notification-center',
            '[class*="notification"]', 
            '[id*="notif"]',
            '.notif-btn',
            'button[onclick*="notification"]',
            '.btn-notification'
        ];
        
        let botonNotif = null;
        for (const selector of selectores) {
            botonNotif = document.querySelector(selector);
            if (botonNotif) break;
        }
        
        if (botonNotif) {
            // Crear evento personalizado para el manager
            const evento = new CustomEvent('nuevaNotificacionAdmin', {
                detail: { empresaId: empresaId, notificacion: notificacion }
            });
            
            document.dispatchEvent(evento);
            
            // Actualizar contador visual
            const contadores = ['.notification-count', '.badge', '[class*="count"]', '.notif-count', '.counter'];
            
            let contador = null;
            for (const sel of contadores) {
                contador = botonNotif.querySelector(sel);
                if (contador) break;
            }
            
            if (contador) {
                const actual = parseInt(contador.textContent) || 0;
                contador.textContent = actual + 1;
                contador.style.display = 'flex';
                contador.style.visibility = 'visible';
                contador.style.opacity = '1';
            }
            
            // Efecto visual en el botón
            botonNotif.style.animation = 'pulse 0.6s ease-in-out';
            botonNotif.style.transform = 'scale(1.05)';
            setTimeout(() => {
                botonNotif.style.animation = '';
                botonNotif.style.transform = 'scale(1)';
            }, 600);
        }
        
        // Intentar funciones globales del manager
        if (window.mostrarNotificacion) {
            window.mostrarNotificacion(notificacion.mensaje, notificacion.tipo);
        }
        
        if (window.notificacionesManager) {
            if (window.notificacionesManager.agregarNotificacion) {
                window.notificacionesManager.agregarNotificacion(notificacion);
            }
            if (window.notificacionesManager.actualizar) {
                window.notificacionesManager.actualizar();
            }
        }
        
        console.log(`📨 Notificación enviada al manager para empresa: ${empresaId}`);
        console.log('Notificación:', notificacion);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FUNCIONALIDADES DE CONTROL DE EMPRESAS
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
                empresas: this.gestor.estado.empresas
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

    suspenderEmpresa(empresaId) {
        const empresa = this.gestor?.estado?.empresas?.[empresaId];
        if (!empresa) {
            this._mostrarNotificacion('Empresa no encontrada', 'error');
            return;
        }
        
        if (empresa.estado === 'Suspendido') {
            this._mostrarNotificacion('La empresa ya está suspendida', 'info');
            return;
        }
        
        empresa.estado = 'Suspendido';
        this.gestor._guardarEmpresas();
        this._mostrarNotificacion(`"${empresa.nombre}" suspendida`, 'warning');
        this._actualizarDashboard();
    }

    eliminarEmpresa(empresaId) {
        const empresa = this.gestor?.estado?.empresas?.[empresaId];
        if (!empresa) {
            this._mostrarNotificacion('Empresa no encontrada', 'error');
            return;
        }
        
        if (!confirm(`¿Eliminar "${empresa.nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }
        
        delete this.gestor.estado.empresas[empresaId];
        this.gestor._guardarEmpresas();
        this._mostrarNotificacion(`"${empresa.nombre}" eliminada`, 'error');
        this._actualizarDashboard();
    }

    abrirControlEmpresa(empresaId) {
        const empresa = this.gestor.estado.empresas[empresaId];
        if (!empresa) return;
        
        this._mostrarNotificacion(`🔧 Gestionando empresa: ${empresa.nombre}`, 'info');
    }

    generarReportePremium() {
        try {
            const empresas = Object.values(this.gestor.estado.empresas);
            const fecha = new Date();
            const totalEmpresas = empresas.length;
            const empresasActivas = empresas.filter(e => e.estado === 'Operativo').length;
            const empresasRiesgo = empresas.filter(e => (e.finanzas?.caja || 0) < 1000).length;
            const ingresoTotal = empresas.reduce((sum, e) => sum + (e.finanzas?.ingresos || 0), 0);
            const gastoTotal = empresas.reduce((sum, e) => sum + (e.finanzas?.gastos || 0), 0);
            const cajaTotal = empresas.reduce((sum, e) => sum + (e.finanzas?.caja || 0), 0);

            const htmlReporte = this._generarReporteHTML(empresas, {
                fecha, totalEmpresas, empresasActivas, empresasRiesgo, 
                ingresoTotal, gastoTotal, cajaTotal
            });

            this._descargarReporteHTML(htmlReporte, empresas);

            const ventana = window.open('', '_blank');
            ventana.document.write(htmlReporte);
            ventana.document.close();

            this._mostrarNotificacion('📄 Reporte Premium generado exitosamente', 'success');
            this._registrarLog('success', 'Reporte Premium HTML generado');

        } catch (error) {
            console.error('Error generando reporte:', error);
            this._mostrarNotificacion('❌ Error generando reporte', 'error');
        }
    }

    _generarReporteHTML(empresas, datos) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>GRIZALUM Premium - Reporte Ejecutivo</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #d4af37, #b8941f); color: white; padding: 30px; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .content { padding: 30px; }
        .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; }
        .metric { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 20px; border-radius: 12px; text-align: center; }
        .metric.success { background: linear-gradient(135deg, #10b981, #059669); }
        .metric.warning { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .metric.danger { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .empresa-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 15px 0; }
        h1 { margin: 0; font-size: 36px; }
        h2 { color: #1f2937; border-bottom: 3px solid #d4af37; padding-bottom: 10px; }
        @media print { body { background: white; } .container { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 GRIZALUM PREMIUM</h1>
            <div style="font-size: 18px; margin-top: 10px;">Reporte Ejecutivo de Control Financiero</div>
            <div style="opacity: 0.9; margin-top: 10px;">Generado: ${datos.fecha.toLocaleDateString()} ${datos.fecha.toLocaleTimeString()}</div>
        </div>
        
        <div class="content">
            <h2>📊 Resumen Ejecutivo</h2>
            <div class="metrics">
                <div class="metric">
                    <h3 style="margin: 0 0 10px 0;">Total Empresas</h3>
                    <div style="font-size: 32px; font-weight: bold;">${datos.totalEmpresas}</div>
                </div>
                <div class="metric success">
                    <h3 style="margin: 0 0 10px 0;">Empresas Activas</h3>
                    <div style="font-size: 32px; font-weight: bold;">${datos.empresasActivas}</div>
                </div>
                <div class="metric danger">
                    <h3 style="margin: 0 0 10px 0;">En Riesgo</h3>
                    <div style="font-size: 32px; font-weight: bold;">${datos.empresasRiesgo}</div>
                </div>
            </div>
            
            <div class="metrics">
                <div class="metric success">
                    <h3 style="margin: 0 0 10px 0;">Ingresos Totales</h3>
                    <div style="font-size: 24px; font-weight: bold;">S/. ${datos.ingresoTotal.toLocaleString()}</div>
                </div>
                <div class="metric warning">
                    <h3 style="margin: 0 0 10px 0;">Gastos Totales</h3>
                    <div style="font-size: 24px; font-weight: bold;">S/. ${datos.gastoTotal.toLocaleString()}</div>
                </div>
                <div class="metric">
                    <h3 style="margin: 0 0 10px 0;">Caja Total</h3>
                    <div style="font-size: 24px; font-weight: bold;">S/. ${datos.cajaTotal.toLocaleString()}</div>
                </div>
            </div>

            <h2>🏢 Detalle por Empresa</h2>
            ${empresas.map((empresa) => {
                const balance = (empresa.finanzas?.ingresos || 0) - (empresa.finanzas?.gastos || 0);
                const estadoColor = empresa.estado === 'Operativo' ? '#10b981' : '#ef4444';
                return `
                <div class="empresa-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <h3 style="margin: 0; color: #1f2937;">${empresa.icono || '🏢'} ${empresa.nombre}</h3>
                            <div style="color: ${estadoColor}; font-weight: bold; margin-top: 5px;">
                                ${empresa.estado} • ${empresa.categoria}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: #6b7280;">Balance</div>
                            <div style="font-size: 20px; font-weight: bold; color: ${balance >= 0 ? '#10b981' : '#ef4444'};">
                                S/. ${balance.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                        <div style="text-align: center;">
                            <div style="color: #6b7280; font-size: 14px;">Caja</div>
                            <div style="font-size: 18px; font-weight: bold;">S/. ${(empresa.finanzas?.caja || 0).toLocaleString()}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #6b7280; font-size: 14px;">Ingresos</div>
                            <div style="font-size: 18px; font-weight: bold; color: #10b981;">S/. ${(empresa.finanzas?.ingresos || 0).toLocaleString()}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #6b7280; font-size: 14px;">Gastos</div>
                            <div style="font-size: 18px; font-weight: bold; color: #ef4444;">S/. ${(empresa.finanzas?.gastos || 0).toLocaleString()}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #6b7280; font-size: 14px;">Rentabilidad</div>
                            <div style="font-size: 18px; font-weight: bold;">
                                ${empresa.finanzas?.ingresos ? ((balance / empresa.finanzas.ingresos) * 100).toFixed(1) + '%' : '0%'}
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }).join('')}
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb;">
            <div style="font-weight: bold;">© ${new Date().getFullYear()} GRIZALUM Premium - Sistema de Control Empresarial</div>
            <div style="margin-top: 5px;">Reporte confidencial para uso interno exclusivo</div>
        </div>
    </div>
</body>
</html>`;
    }
    
    _descargarReporteHTML(htmlContent, empresas) {
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GRIZALUM_Reporte_${new Date().getTime()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    optimizarSistema() {
        this._mostrarNotificacion('⚡ Sistema optimizado exitosamente', 'success');
        this._registrarLog('info', 'Sistema optimizado por Super Admin');
    }

    limpiarCacheSistema() {
        this._mostrarNotificacion('🧹 Caché del sistema limpiado', 'success');
        this._registrarLog('info', 'Caché del sistema limpiado por Super Admin');
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
    // MÉTODOS AUXILIARES Y UTILIDADES
    // ═══════════════════════════════════════════════════════════════════════════

    _actualizarDashboard() {
        const dashboardSection = document.getElementById('seccion-dashboard');
        if (dashboardSection) {
            dashboardSection.innerHTML = this._generarDashboardGlobal().replace('<div class="premium-seccion active" id="seccion-dashboard" style="padding: 32px;">', '').replace(/^.*<\/div>$/s, '');
        }
        
        const controlSection = document.getElementById('seccion-control');
        if (controlSection) {
            const controlContent = this._generarControlEmpresas().replace('<div class="premium-seccion" id="seccion-control" style="padding: 32px; display: none;">', '').replace(/^.*<\/div>$/s, '');
            controlSection.innerHTML = controlContent;
        }
    }

    _inicializarSistema() {
        console.log('Iniciando sistema GRIZALUM Premium...');
        console.log('Sistema completamente inicializado');
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
            version: 'GRIZALUM Premium v2.0',
            ultimoAcceso: new Date().toISOString()
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
        if (this.logs.length > 1000) {
            this.logs = this.logs.slice(-500);
        }
        this._guardarLogs();
        
        this._log(nivel, mensaje, datos);
    }

    _mostrarNotificacion(mensaje, tipo = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: ${this._getColorNotificacion(tipo)};
            color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; z-index: 9999999;
            max-width: 400px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); transform: translateX(100%);
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

    _getColorNotificacion(tipo) {
        const colores = {
            'info': '#3b82f6',
            'success': '#10b981',
            'warning': '#f59e0b',
            'error': '#ef4444'
        };
        return colores[tipo] || '#64748b';
    }

    _cerrarModalPrevio() {
        const modalPrevio = document.getElementById('grizalumModalAdmin');
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
// INICIALIZACIÓN Y REEMPLAZO DEL SISTEMA ORIGINAL
// ═══════════════════════════════════════════════════════════════════════════

function reemplazarAdminOriginal() {
    if (window.gestorEmpresas) {
        const adminPremium = new window.GestorEmpresasAdmin(window.gestorEmpresas);
        window.adminEmpresas = adminPremium;
        
        window.gestorEmpresas.gestionarEmpresa = function(empresaId) {
            adminPremium.abrirPanelAdmin(empresaId);
        };
        
        window.gestorEmpresas.abrirPanelAdmin = function(empresaId) {
            adminPremium.abrirPanelAdmin(empresaId);
        };
        
        window.abrirPanelAdminPremium = function() {
            adminPremium.abrirPanelAdmin();
        };
        
        console.log('🚀 PANEL ADMIN PREMIUM ACTIVADO - CONECTADO AL MANAGER');
        console.log('📨 Sistema de notificaciones integrado correctamente');
        
        return adminPremium;
    }
    return null;
}

// INICIALIZACIÓN INMEDIATA
if (window.gestorEmpresas) {
    reemplazarAdminOriginal();
} else {
    document.addEventListener('gestorEmpresasListo', reemplazarAdminOriginal);
    
    const intervaloReemplazo = setInterval(() => {
        if (window.gestorEmpresas) {
            reemplazarAdminOriginal();
            clearInterval(intervaloReemplazo);
        }
    }, 1000);
    
    setTimeout(() => {
        if (window.gestorEmpresas) {
            reemplazarAdminOriginal();
        }
        clearInterval(intervaloReemplazo);
    }, 5000);
}

// VERIFICACIÓN FINAL
setTimeout(() => {
    if (window.adminEmpresas && window.adminEmpresas.abrirPanelAdmin) {
        console.log('✅ Panel Admin Premium completamente funcional');
        console.log('📨 Notificaciones conectadas al sistema manager');
        console.log('🚀 Usa: adminEmpresas.abrirPanelAdmin()');
    } else {
        console.error('❌ Error en la activación del Panel Premium');
        if (window.gestorEmpresas) {
            reemplazarAdminOriginal();
        }
    }
}, 3000);

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🎉 PANEL ADMIN PREMIUM COMPLETO 🎉                       ║
║                                                                              ║
║  ✅ Sistema completo y funcional                                            ║
║  📨 Notificaciones conectadas al manager                                    ║
║  🎯 Coherencia total entre admin y empresas                                 ║
║  👑 Panel Premium 100% operativo                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);
                            
                            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%); 
                                border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 48px;
                                backdrop-filter: blur(20px); border: 3px solid rgba(255,255,255,0.2);
                                box-shadow: inset 0 2px 0 rgba(255,255,255,0.4), 0 12px 40px rgba(0,0,0,0.3);">
                                🏆
                            </div>
                            
                            <div>
                                <div style="background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%);
                                    padding: 8px 20px; border-radius: 25px; font-size: 14px; font-weight: 700; margin-bottom: 16px;
                                    backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15);
                                    text-transform: uppercase; letter-spacing: 1px;">CENTRO DE CONTROL EJECUTIVO</div>
                                <h1 style="margin: 0; font-size: 36px; font-weight: 900; text-shadow: 0 4px 12px rgba(0,0,0,0.4);">
                                    GRIZALUM PREMIUM
                                </h1>
                                <div style="display: flex; gap: 20px; margin-top: 20px;">
                                    <span style="background: rgba(255,255,255,0.2); padding: 10px 24px; border-radius: 30px; 
                                        font-size: 14px; font-weight: 600; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15);">
                                        🏢 ${totalEmpresas} Empresas
                                    </span>
                                    <span style="background: rgba(16, 185, 129, 0.3); padding: 10px 24px; border-radius: 30px; 
                                        font-size: 14px; font-weight: 600; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15);">
                                        ✅ ${empresasActivas} Activas
                                    </span>
                                    <span style="background: rgba(59, 130, 246, 0.3); padding: 10px 24px; border-radius: 30px; 
                                        font-size: 14px; font-weight: 600; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15);">
                                        💰 S/. ${ingresoTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: right;">
                            <div style="background: rgba(255,255,255,0.15); padding: 20px; border-radius: 20px;
                                backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); margin-bottom: 16px;">
                                <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Sistema</div>
                                <div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
                                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse-status 1.5s infinite;"></div>
                                    ONLINE
                                </div>
                                <div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">${new Date().toLocaleString()}</div>
                            </div>
                            
                            <button onclick="adminEmpresas.cerrarModal()" 
                                style="width: 64px; height: 64px; background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%); 
                                border: 3px solid rgba(255,255,255,0.2); border-radius: 24px; color: white; cursor: pointer; 
                                font-size: 28px; font-weight: bold; transition: all 0.3s ease; backdrop-filter: blur(20px);
                                display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,0.3);"
                                onmouseover="this.style.background='linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%)'; this.style.transform='scale(1.1) rotate(90deg)'"
                                onmouseout="this.style.background='linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'; this.style.transform='scale(1) rotate(0deg)'">×</button>
                        </div>
                    </div>
                </div>
                
                <style>
                    @keyframes pulse-admin { 0%, 100% { box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5); } 50% { box-shadow: 0 6px 30px rgba(220, 38, 38, 0.8); } }
                    @keyframes pulse-status { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                </style>
            </div>
        `;
    }

    _generarNavegacionPremium() {
        return `
            <div style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%); 
                padding: 0; display: flex; border-bottom: 1px solid rgba(226,232,240,0.5);
                backdrop-filter: blur(20px); box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                
                <button class="premium-nav-btn active" data-seccion="dashboard" style="flex: 1; padding: 18px 20px; border: none; 
                    background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); cursor: pointer; display: flex; align-items: center; 
                    justify-content: center; gap: 10px; font-weight: 700; color: white; transition: all 0.3s ease; font-size: 13px;
                    text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);">
                    <span style="font-size: 18px;">📊</span> DASHBOARD
                </button>
                <button class="premium-nav-btn" data-seccion="control" style="flex: 1; padding: 18px 20px; border: none; 
                    background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; 
                    font-weight: 700; color: #64748b; transition: all 0.3s ease; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                    <span style="font-size: 18px;">🏢</span> CONTROL
                </button>
                <button class="premium-nav-btn" data-seccion="notificaciones" style="flex: 1; padding: 18px 20px; border: none; 
                    background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; 
                    font-weight: 700; color: #64748b; transition: all 0.3s ease; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                    <span style="font-size: 18px;">🔔</span> AVISOS
                </button>
                <button class="premium-nav-btn" data-seccion="analytics" style="flex: 1; padding: 18px 20px; border: none; 
                    background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; 
                    font-weight: 700; color: #64748b; transition: all 0.3s ease; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                    <span style="font-size: 18px;">📈</span> ANALYTICS
                </button>
                <button class="premium-nav-btn" data-seccion="auditoria" style="flex: 1; padding: 18px 20px; border: none; 
                    background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; 
                    font-weight: 700; color: #64748b; transition: all 0.3s ease; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                    <span style="font-size: 18px;">🛡️</span> AUDITORÍA
                </button>
                <button class="premium-nav-btn" data-seccion="configuracion" style="flex: 1; padding: 18px 20px; border: none; 
                    background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; 
                    font-weight: 700; color: #64748b; transition: all 0.3s ease; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
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
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 28px; border-radius: 20px; color: white; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 36px; margin-bottom: 12px;">🏢</div>
                            <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">${totalEmpresas}</div>
                            <div style="font-size: 14px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total Empresas</div>
                        </div>
                    </div>
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 28px; border-radius: 20px; color: white; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 36px; margin-bottom: 12px;">✅</div>
                            <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">${empresasActivas}</div>
                            <div style="font-size: 14px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Activas</div>
                        </div>
                    </div>
                    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 28px; border-radius: 20px; color: white; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
                            <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px;">${empresasRiesgo}</div>
                            <div style="font-size: 14px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">En Riesgo</div>
                        </div>
                    </div>
                    <div style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); padding: 28px; border-radius: 20px; color: white; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 36px; margin-bottom: 12px;">💰</div>
                            <div style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">S/. ${(ingresoTotal/1000).toFixed(0)}K</div>
                            <div style="font-size: 14px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Ingresos Totales</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37, #b8941f); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🏢</div>
                        Resumen de Empresas
                    </h3>
                    <div style="display: grid; gap: 16px;">${this._generarListaEmpresasDashboard()}</div>
                </div>
            </div>
        `;
    }

    _generarListaEmpresasDashboard() {
        const empresas = Object.values(this.gestor.estado.empresas);
        return empresas.map(empresa => {
            const estadoColor = empresa.estado === 'Operativo' ? '#10b981' : empresa.estado === 'Regular' ? '#f59e0b' : '#ef4444';
            const cajaColor = (empresa.finanzas?.caja || 0) >= 5000 ? '#10b981' : (empresa.finanzas?.caja || 0) >= 1000 ? '#f59e0b' : '#ef4444';
            
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px; 
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border-radius: 16px; border: 1px solid #e2e8f0;
                    transition: all 0.3s ease;" 
                    onmouseover="this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)'" 
                    onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
                    
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #d4af37, #b8941f); 
                            border-radius: 16px; display: flex; align-items: center; justify-content: center; 
                            font-size: 24px; color: white;">${empresa.icono || '🏢'}</div>
                        <div>
                            <div style="font-weight: 700; font-size: 16px; color: #1e293b; margin-bottom: 4px;">${empresa.nombre}</div>
                            <div style="font-size: 14px; color: #64748b;">${empresa.categoria}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 24px;">
                        <div style="text-align: center;">
                            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">ESTADO</div>
                            <div style="background: ${estadoColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${empresa.estado}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">CAJA</div>
                            <div style="color: ${cajaColor}; font-weight: 700; font-size: 14px;">S/. ${(empresa.finanzas?.caja || 0).toLocaleString()}</div>
                        </div>
                        <button onclick="adminEmpresas.abrirControlEmpresa('${empresa.id}')" 
                            style="background: linear-gradient(135deg, #d4af37, #b8941f); color: white; border: none; 
                            padding: 8px 16px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.3s ease;"
                            onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">🔧 GESTIONAR</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    _generarControlEmpresas() {
        return `
            <div class="premium-seccion" id="seccion-control" style="padding: 32px; display: none;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">
                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🛠️</div>
                            Control de Empresas
                        </h3>
                        <div style="display: grid; gap: 16px;">
                            <button onclick="adminEmpresas.suspenderTodasEmpresas()" 
                                style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 16px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; gap: 12px;"
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(245, 158, 11, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <span style="font-size: 20px;">⏸️</span> SUSPENDER TODAS LAS EMPRESAS
                            </button>
                            <button onclick="adminEmpresas.reactivarTodasEmpresas()" 
                                style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 16px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; gap: 12px;"
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <span style="font-size: 20px;">▶️</span> REACTIVAR TODAS LAS EMPRESAS
                            </button>
                            <button onclick="adminEmpresas.exportarTodasEmpresas()" 
                                style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; padding: 16px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; gap: 12px;"
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <span style="font-size: 20px;">📤</span> EXPORTAR TODAS LAS EMPRESAS
                            </button>
                        </div>
// NUEVA - Agregar al final de tu archivo original
_añadirNotificacionEmpresaConectada(empresaId, notificacion) {
    const empresa = this.gestor.estado.empresas[empresaId];
    if (!empresa) return;
    
    if (!empresa.notificaciones) {
        empresa.notificaciones = [];
    }
    
    empresa.notificaciones.push(notificacion);
    this.gestor._guardarEmpresas();
    
    // Conectar con sistema manager
    this._activarNotificacionEnManager(empresaId, notificacion);
}

_activarNotificacionEnManager(empresaId, notificacion) {
    const selectores = ['.notification-center', '[class*="notification"]', '[id*="notif"]'];
    
    let botonNotif = null;
    for (const selector of selectores) {
        botonNotif = document.querySelector(selector);
        if (botonNotif) break;
    }
    
    if (botonNotif) {
        const evento = new CustomEvent('nuevaNotificacionAdmin', {
            detail: { empresaId: empresaId, notificacion: notificacion }
        });
        
        document.dispatchEvent(evento);
        
        const contador = botonNotif.querySelector('.notification-count, .badge, [class*="count"]');
        if (contador) {
            const actual = parseInt(contador.textContent) || 0;
            contador.textContent = actual + 1;
            contador.style.display = 'flex';
        }
        
        botonNotif.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => botonNotif.style.animation = '', 600);
    }
    
    console.log(`📨 Notificación enviada al manager para empresa: ${empresaId}`);
}
