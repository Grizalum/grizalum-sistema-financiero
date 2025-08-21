/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    GRIZALUM PANEL DE GESTIÓN ADMIN                          ║
 * ║                INTEGRADO CON SISTEMA DE TEMAS EXISTENTE                     ║
 * ║                          Versión 1.0 - 2025                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

class GestorEmpresasAdmin {
    constructor(gestorPrincipal) {
        this.gestor = gestorPrincipal;
        this.modalActivo = null;
        this.datosTemporales = {};
        
        this._log('info', '👑 Panel Admin inicializado con temas integrados');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODO PRINCIPAL: ABRIR PANEL ADMIN
    // ═══════════════════════════════════════════════════════════════════════════

    abrirPanelAdmin(empresaId) {
        const empresa = this.gestor.estado.empresas[empresaId];
        if (!empresa) {
            this._mostrarError('Empresa no encontrada');
            return;
        }

        this._log('info', `👑 Abriendo panel admin para: ${empresa.nombre}`);
        this._cerrarModalPrevio();
        this._crearModalAdmin(empresaId, empresa);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CREACIÓN DEL MODAL ADMIN ULTRA PROFESIONAL
    // ═══════════════════════════════════════════════════════════════════════════

    _crearModalAdmin(empresaId, empresa) {
    const modal = document.createElement('div');
    modal.id = 'grizalumModalAdmin';
    modal.style.cssText = `
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0,0,0,0.75); 
        z-index: 999999; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        padding: 20px;
        backdrop-filter: blur(8px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    // Aplicar tema de la empresa
    const mapaTemaCss = {
        'rojo': 'red', 'azul': 'blue', 'verde': 'green',
        'morado': 'purple', 'dorado': 'gold'
    };
    const temaCss = mapaTemaCss[empresa.tema] || 'gold';
    modal.setAttribute('data-theme', temaCss);
    
    const temaConfig = this.gestor.config.temas[empresa.tema] || this.gestor.config.temas.dorado;
    
    modal.innerHTML = `
        <div style="
            background: #ffffff; 
            border-radius: 24px; 
            width: 1000px; 
            max-width: 95vw; 
            max-height: 90vh; 
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(0,0,0,0.4);
            transform: scale(0.9) translateY(30px);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        " class="modal-content">
            
            <!-- Header Premium con Gradiente -->
            <div style="
                background: linear-gradient(135deg, ${temaConfig.primary} 0%, ${temaConfig.secondary} 100%); 
                color: white; 
                padding: 32px; 
                position: relative;
                overflow: hidden;
            ">
                <!-- Efectos visuales de fondo -->
                <div style="position: absolute; top: -50%; right: -20%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; transform: scale(1.5);"></div>
                <div style="position: absolute; bottom: -30%; left: -10%; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
                
                <div style="position: relative; z-index: 2;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="
                                width: 80px; 
                                height: 80px; 
                                background: rgba(255,255,255,0.2); 
                                border-radius: 20px; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: 32px;
                                backdrop-filter: blur(20px);
                                border: 2px solid rgba(255,255,255,0.3);
                                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                            ">
                                ${empresa.logo ? `<img src="${empresa.logo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 18px;">` : empresa.icono}
                            </div>
                            <div>
                                <h1 style="margin: 0; font-size: 28px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                    👑 Panel Administrativo
                                </h1>
                                <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 600; opacity: 0.95;">
                                    ${empresa.nombre}
                                </h2>
                                <div style="display: flex; gap: 12px; margin-top: 12px;">
                                    <span style="background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; backdrop-filter: blur(10px);">${empresa.categoria}</span>
                                    <span style="background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; backdrop-filter: blur(10px);">${empresa.estado}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onclick="adminEmpresas.cerrarModal()" 
                            style="
                                width: 48px; 
                                height: 48px; 
                                background: rgba(255,255,255,0.15); 
                                border: 2px solid rgba(255,255,255,0.3); 
                                border-radius: 16px; 
                                color: white; 
                                cursor: pointer; 
                                font-size: 20px;
                                transition: all 0.3s ease;
                                backdrop-filter: blur(20px);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                            "
                            onmouseover="this.style.background='rgba(255,255,255,0.25)'; this.style.transform='scale(1.05)'"
                            onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='scale(1)'"
                        >✕</button>
                    </div>
                </div>
            </div>

            <!-- Navegación con Estilo Premium -->
            <div style="
                background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); 
                padding: 0; 
                display: flex; 
                border-bottom: 1px solid #e2e8f0;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            ">
                <button class="admin-nav-btn active" data-seccion="general" style="
                    flex: 1; 
                    padding: 20px 24px; 
                    border: none; 
                    background: white; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    font-weight: 700; 
                    color: ${temaConfig.primary}; 
                    transition: all 0.3s ease;
                    border-bottom: 4px solid ${temaConfig.primary};
                    font-size: 15px;
                ">
                    <span style="font-size: 18px;">📊</span> General
                </button>
                <button class="admin-nav-btn" data-seccion="legal" style="
                    flex: 1; 
                    padding: 20px 24px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    font-weight: 600; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    border-bottom: 4px solid transparent;
                    font-size: 15px;
                ">
                    <span style="font-size: 18px;">⚖️</span> Legal
                </button>
                <button class="admin-nav-btn" data-seccion="financiero" style="
                    flex: 1; 
                    padding: 20px 24px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    font-weight: 600; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    border-bottom: 4px solid transparent;
                    font-size: 15px;
                ">
                    <span style="font-size: 18px;">💰</span> Finanzas
                </button>
                <button class="admin-nav-btn" data-seccion="contacto" style="
                    flex: 1; 
                    padding: 20px 24px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    font-weight: 600; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    border-bottom: 4px solid transparent;
                    font-size: 15px;
                ">
                    <span style="font-size: 18px;">📞</span> Contacto
                </button>
                <button class="admin-nav-btn" data-seccion="temas" style="
                    flex: 1; 
                    padding: 20px 24px; 
                    border: none; 
                    background: transparent; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    font-weight: 600; 
                    color: #64748b; 
                    transition: all 0.3s ease;
                    border-bottom: 4px solid transparent;
                    font-size: 15px;
                ">
                    <span style="font-size: 18px;">🎨</span> Temas
                </button>
            </div>

            <!-- Contenido Principal -->
            <div style="
                padding: 0; 
                max-height: 400px; 
                overflow-y: auto;
                background: #ffffff;
            " class="grizalum-admin-content">
                ${this._generarContenidoGeneral(empresa)}
            </div>

            <!-- Footer Premium -->
            <div style="
                background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); 
                padding: 24px 32px; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                border-top: 1px solid #e2e8f0;
                box-shadow: 0 -4px 6px rgba(0,0,0,0.05);
            ">
                <div style="display: flex; gap: 16px;">
                    <button 
                        onclick="adminEmpresas.exportarDatos('${empresaId}')" 
                        style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
                            color: white; 
                            border: none; 
                            padding: 12px 24px; 
                            border-radius: 12px; 
                            cursor: pointer; 
                            display: flex; 
                            align-items: center; 
                            gap: 8px;
                            font-weight: 600;
                            font-size: 14px;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'"
                    >
                        📤 Exportar Datos
                    </button>
                    <button 
                        onclick="this.style.background='#10b981'; this.textContent='✅ Copiado'; setTimeout(() => { this.style.background='linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'; this.innerHTML='📋 Duplicar'; }, 1000);" 
                        style="
                            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); 
                            color: white; 
                            border: none; 
                            padding: 12px 24px; 
                            border-radius: 12px; 
                            cursor: pointer; 
                            display: flex; 
                            align-items: center; 
                            gap: 8px;
                            font-weight: 600;
                            font-size: 14px;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(139, 92, 246, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.3)'"
                    >
                        📋 Duplicar
                    </button>
                </div>
                <div style="display: flex; gap: 16px;">
                    <button 
                        onclick="adminEmpresas.cerrarModal()" 
                        style="
                            background: #64748b; 
                            color: white; 
                            border: none; 
                            padding: 12px 24px; 
                            border-radius: 12px; 
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 14px;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.background='#475569'; this.style.transform='translateY(-1px)'"
                        onmouseout="this.style.background='#64748b'; this.style.transform='translateY(0)'"
                    >❌ Cancelar</button>
                    <button 
                        onclick="adminEmpresas.guardarCambios('${empresaId}')" 
                        style="
                            background: linear-gradient(135deg, ${temaConfig.primary} 0%, ${temaConfig.secondary} 100%); 
                            color: white; 
                            border: none; 
                            padding: 12px 32px; 
                            border-radius: 12px; 
                            cursor: pointer;
                            font-weight: 700;
                            font-size: 14px;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 12px ${temaConfig.primary}40;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px ${temaConfig.primary}50'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px ${temaConfig.primary}40'"
                    >💾 Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    this.modalActivo = modal;
    
    // Animación de entrada suave
    setTimeout(() => {
        modal.style.opacity = '1';
        const content = modal.querySelector('.modal-content');
        content.style.transform = 'scale(1) translateY(0)';
    }, 50);
    
    // Configurar eventos
    this._configurarEventosAdmin(empresaId);
    this._aplicarEstilosResponsivos();
}
    _generarHeaderAdmin(empresa) {
        return `
            <div class="grizalum-admin-header">
                <div class="admin-header-info">
                    <div class="admin-empresa-avatar">
                        ${empresa.logo ? `<img src="${empresa.logo}" alt="${empresa.nombre}">` : empresa.icono}
                    </div>
                    <div class="admin-empresa-datos">
                        <h2>${empresa.nombre}</h2>
                        <p>Panel de Administración Empresarial</p>
                        <span class="admin-categoria">${empresa.categoria}</span>
                    </div>
                </div>
                <div class="admin-header-actions">
                    <button class="admin-btn admin-btn-exportar" onclick="adminEmpresas.exportarDatos('${empresa.id}')">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                    <button class="admin-btn admin-btn-cerrar" onclick="adminEmpresas.cerrarModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }

    _generarNavegacionAdmin() {
        return `
            <div class="grizalum-admin-nav">
                <button class="admin-nav-btn active" data-seccion="general">
                    <i class="fas fa-building"></i> General
                </button>
                <button class="admin-nav-btn" data-seccion="legal">
                    <i class="fas fa-gavel"></i> Legal
                </button>
                <button class="admin-nav-btn" data-seccion="financiero">
                    <i class="fas fa-chart-line"></i> Financiero
                </button>
                <button class="admin-nav-btn" data-seccion="contacto">
                    <i class="fas fa-address-book"></i> Contacto
                </button>
                <button class="admin-nav-btn" data-seccion="temas">
                    <i class="fas fa-palette"></i> Temas
                </button>
            </div>
        `;
    }

   _generarContenidoGeneral(empresa) {
    return `
        <!-- SECCIÓN GENERAL -->
        <div class="admin-seccion active" id="seccion-general" style="padding: 32px;">
            
            <!-- Grid de Información Principal -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 32px;">
                
                <!-- Panel Izquierdo: Datos de la Empresa -->
                <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🏢</div>
                        Información Empresarial
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        
                        <div class="campo-moderno" style="grid-column: 1 / -1;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                📝 Nombre de la Empresa
                            </label>
                            <input 
                                type="text" 
                                id="admin-nombre" 
                                value="${empresa.nombre}" 
                                style="
                                    width: 100%; 
                                    padding: 16px 20px; 
                                    border: 2px solid #e2e8f0; 
                                    border-radius: 12px; 
                                    font-size: 16px;
                                    font-weight: 500;
                                    background: #ffffff;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                "
                                onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                            >
                        </div>
                        
                        <div class="campo-moderno">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                📋 Categoría
                            </label>
                            <div style="position: relative;">
                                <select 
                                    id="admin-categoria" 
                                    style="
                                        width: 100%; 
                                        padding: 16px 20px; 
                                        border: 2px solid #e2e8f0; 
                                        border-radius: 12px; 
                                        font-size: 16px;
                                        font-weight: 500;
                                        background: #ffffff;
                                        cursor: pointer;
                                        appearance: none;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                    "
                                    onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                                    onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                                >
                                    ${this._generarOpcionesCategorias(empresa.categoria)}
                                </select>
                                <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; font-size: 12px;">▼</div>
                            </div>
                        </div>
                        
                        <div class="campo-moderno">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                ⚡ Estado Operativo
                            </label>
                            <div style="position: relative;">
                                <select 
                                    id="admin-estado" 
                                    style="
                                        width: 100%; 
                                        padding: 16px 20px; 
                                        border: 2px solid #e2e8f0; 
                                        border-radius: 12px; 
                                        font-size: 16px;
                                        font-weight: 500;
                                        background: #ffffff;
                                        cursor: pointer;
                                        appearance: none;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                    "
                                    onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                                    onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                                >
                                    ${this._generarOpcionesEstado(empresa.estado)}
                                </select>
                                <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; font-size: 12px;">▼</div>
                            </div>
                        </div>
                        
                        <div class="campo-moderno" style="grid-column: 1 / -1;">
                            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                🎨 Icono de la Empresa
                            </label>
                            <div style="display: flex; gap: 16px; align-items: center;">
                                <input 
                                    type="text" 
                                    id="admin-icono" 
                                    value="${empresa.icono || '🏢'}" 
                                    readonly
                                    style="
                                        flex: 1;
                                        padding: 16px 20px; 
                                        border: 2px solid #e2e8f0; 
                                        border-radius: 12px; 
                                        font-size: 16px;
                                        font-weight: 500;
                                        background: #f8fafc;
                                        color: #64748b;
                                        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                    "
                                >
                                <button 
                                    onclick="adminEmpresas.cambiarIcono()" 
                                    style="
                                        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); 
                                        color: white; 
                                        border: none; 
                                        padding: 16px 24px; 
                                        border-radius: 12px; 
                                        cursor: pointer;
                                        font-weight: 600;
                                        font-size: 14px;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                                    "
                                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(139, 92, 246, 0.4)'"
                                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.3)'"
                                >
                                    🎨 Cambiar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Panel Derecho: Métricas y Status -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    
                    <!-- Card de Estado -->
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; padding: 24px; color: white; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Estado Actual</div>
                            <div style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${empresa.estado}</div>
                            <div style="font-size: 12px; opacity: 0.8;">Empresa ${empresa.estado.toLowerCase()}</div>
                        </div>
                    </div>
                    
                    <!-- Card de Finanzas -->
                    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 20px; padding: 24px; color: white; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Caja Actual</div>
                            <div style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">S/. ${(empresa.finanzas?.caja || 0).toLocaleString()}</div>
                            <div style="font-size: 12px; opacity: 0.8;">Liquidez disponible</div>
                        </div>
                    </div>
                    
                    <!-- Card de Métricas -->
                    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 20px; padding: 24px; color: white; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(245, 158, 11, 0.3);">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">ROI</div>
                            <div style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${empresa.finanzas?.roi || 0}%</div>
                            <div style="font-size: 12px; opacity: 0.8;">Retorno de inversión</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Sección de Ubicación -->
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📍</div>
                    Ubicación y Contacto
                </h3>
                
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px;">
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            🏠 Dirección Completa
                        </label>
                        <input 
                            type="text" 
                            id="admin-direccion" 
                            value="${empresa.ubicacion?.direccion || ''}" 
                            placeholder="Av. Principal 123, Urbanización"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#ef4444'; this.style.boxShadow='0 0 0 4px rgba(239, 68, 68, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            🏘️ Distrito
                        </label>
                        <input 
                            type="text" 
                            id="admin-distrito" 
                            value="${empresa.ubicacion?.distrito || ''}" 
                            placeholder="Lima"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#ef4444'; this.style.boxShadow='0 0 0 4px rgba(239, 68, 68, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            🏛️ Departamento
                        </label>
                        <div style="position: relative;">
                            <select 
                                id="admin-departamento" 
                                style="
                                    width: 100%; 
                                    padding: 16px 20px; 
                                    border: 2px solid #e2e8f0; 
                                    border-radius: 12px; 
                                    font-size: 16px;
                                    font-weight: 500;
                                    background: #ffffff;
                                    cursor: pointer;
                                    appearance: none;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                "
                                onfocus="this.style.borderColor='#ef4444'; this.style.boxShadow='0 0 0 4px rgba(239, 68, 68, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                            >
                                ${this._generarOpcionesDepartamentos(empresa.ubicacion?.departamento)}
                            </select>
                            <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; font-size: 12px;">▼</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECCIÓN LEGAL -->
        <div class="admin-seccion" id="seccion-legal" style="padding: 32px; display: none;">
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #7c3aed, #6d28d9); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">⚖️</div>
                    Información Legal
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            🆔 RUC
                        </label>
                        <input 
                            type="text" 
                            id="admin-ruc" 
                            value="${empresa.legal?.ruc || ''}" 
                            maxlength="11" 
                            placeholder="20123456789"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#7c3aed'; this.style.boxShadow='0 0 0 4px rgba(124, 58, 237, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            🏢 Razón Social
                        </label>
                        <input 
                            type="text" 
                            id="admin-razon-social" 
                            value="${empresa.legal?.razonSocial || ''}" 
                            placeholder="Mi Empresa S.A.C."
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#7c3aed'; this.style.boxShadow='0 0 0 4px rgba(124, 58, 237, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            📋 Tipo de Empresa
                        </label>
                        <div style="position: relative;">
                            <select 
                                id="admin-tipo-empresa" 
                                style="
                                    width: 100%; 
                                    padding: 16px 20px; 
                                    border: 2px solid #e2e8f0; 
                                    border-radius: 12px; 
                                    font-size: 16px;
                                    font-weight: 500;
                                    background: #ffffff;
                                    cursor: pointer;
                                    appearance: none;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                "
                                onfocus="this.style.borderColor='#7c3aed'; this.style.boxShadow='0 0 0 4px rgba(124, 58, 237, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                            >
                                ${this._generarOpcionesTipoEmpresa(empresa.legal?.tipoEmpresa)}
                            </select>
                            <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; font-size: 12px;">▼</div>
                        </div>
                    </div>
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            💼 Régimen Tributario
                        </label>
                        <div style="position: relative;">
                            <select 
                                id="admin-regimen" 
                                style="
                                    width: 100%; 
                                    padding: 16px 20px; 
                                    border: 2px solid #e2e8f0; 
                                    border-radius: 12px; 
                                    font-size: 16px;
                                    font-weight: 500;
                                    background: #ffffff;
                                    cursor: pointer;
                                    appearance: none;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                                "
                                onfocus="this.style.borderColor='#7c3aed'; this.style.boxShadow='0 0 0 4px rgba(124, 58, 237, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                                onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                            >
                                ${this._generarOpcionesRegimen(empresa.legal?.regimen)}
                            </select>
                            <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; font-size: 12px;">▼</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SECCIÓN FINANCIERO -->
        <div class="admin-seccion" id="seccion-financiero" style="padding: 32px; display: none;">
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">💰</div>
                    Datos Financieros
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            💰 Caja Actual (S/.)
                        </label>
                        <input 
                            type="number" 
                            id="admin-caja" 
                            value="${empresa.finanzas?.caja || 0}" 
                            step="0.01"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            📈 Ingresos Anuales (S/.)
                        </label>
                        <input 
                            type="number" 
                            id="admin-ingresos" 
                            value="${empresa.finanzas?.ingresos || 0}" 
                            step="0.01"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            📉 Gastos Anuales (S/.)
                        </label>
                        <input 
                            type="number" 
                            id="admin-gastos" 
                            value="${empresa.finanzas?.gastos || 0}" 
                            step="0.01"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#10b981'; this.style.boxShadow='0 0 0 4px rgba(16, 185, 129, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                </div>
                
                <button 
                    onclick="adminEmpresas.calcularMetricas()" 
                    style="
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; 
                        border: none; 
                        padding: 16px 32px; 
                        border-radius: 12px; 
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 16px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)'"
                >
                    🧮 Recalcular Métricas
                </button>
            </div>
        </div>

        <!-- SECCIÓN CONTACTO -->
        <div class="admin-seccion" id="seccion-contacto" style="padding: 32px; display: none;">
            <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">📞</div>
                    Información de Contacto
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            📞 Teléfono
                        </label>
                        <input 
                            type="tel" 
                            id="admin-telefono" 
                            value="${empresa.contacto?.telefono || ''}" 
                            placeholder="+51 1 234-5678"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 4px rgba(245, 158, 11, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                    
                    <div class="campo-moderno">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            📧 Email
                        </label>
                        <input 
                            type="email" 
                            id="admin-email" 
                            value="${empresa.contacto?.email || ''}" 
                            placeholder="contacto@empresa.pe"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 4px rgba(245, 158, 11, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                    
                    <div class="campo-moderno" style="grid-column: 1 / -1;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                            🌐 Sitio Web
                        </label>
                        <input 
                            type="url" 
                            id="admin-web" 
                            value="${empresa.contacto?.web || ''}" 
                            placeholder="www.empresa.pe"
                            style="
                                width: 100%; 
                                padding: 16px 20px; 
                                border: 2px solid #e2e8f0; 
                                border-radius: 12px; 
                                font-size: 16px;
                                font-weight: 500;
                                background: #ffffff;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                            "
                            onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 4px rgba(245, 158, 11, 0.1), 0 4px 12px rgba(0,0,0,0.1)'"
                            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'"
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- SECCIÓN TEMAS -->
        <div class="admin-seccion" id="seccion-temas" style="padding: 32px; display: none;">
            ${this._generarSeccionTemas(empresa)}
        </div>
    `;
}

    _generarSeccionTemas(empresa) {
    return `
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🎨</div>
                Configuración de Temas
            </h3>
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <div style="font-size: 48px; margin-bottom: 16px;">🎨</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Sección de Temas</div>
                <div>Próximamente: Personalización avanzada de colores</div>
            </div>
        </div>
    `;
}
    
    _generarFooterAdmin(empresaId) {
        return `
            <div class="grizalum-admin-footer">
                <div class="admin-footer-info">
                    <span>📅 Última actualización: ${new Date().toLocaleDateString()}</span>
                </div>
                <div class="admin-footer-actions">
                    <button class="admin-btn admin-btn-cancelar" onclick="adminEmpresas.cerrarModal()">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button class="admin-btn admin-btn-guardar" onclick="adminEmpresas.guardarCambios('${empresaId}')">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GENERADORES ESPECÍFICOS PARA TEMAS
    // ═══════════════════════════════════════════════════════════════════════════

    _generarSelectorTemasAdmin(temaActual) {
        const temas = [
            { key: 'rojo', name: 'Rojo Ejecutivo', css: 'red', color: '#dc2626' },
            { key: 'azul', name: 'Azul Corporativo', css: 'blue', color: '#2563eb' },
            { key: 'verde', name: 'Verde Naturaleza', css: 'green', color: '#059669' },
            { key: 'morado', name: 'Púrpura Premium', css: 'purple', color: '#7c3aed' },
            { key: 'dorado', name: 'Dorado Perú', css: 'gold', color: '#d4af37' }
        ];

        return temas.map(tema => `
            <div class="admin-tema-option ${tema.key === temaActual ? 'selected' : ''}" 
                 data-tema="${tema.key}" 
                 onclick="adminEmpresas.cambiarTemaEmpresa('${tema.key}')">
                <div class="tema-color" style="background: linear-gradient(135deg, ${tema.color}, ${tema.color}dd);"></div>
                <div class="tema-info">
                    <div class="tema-name">${tema.name}</div>
                    <div class="tema-key">${tema.key.toUpperCase()}</div>
                </div>
                <div class="tema-check">
                    <i class="fas fa-check"></i>
                </div>
            </div>
        `).join('');
    }

    _generarTemasGlobales() {
        const temasGlobales = [
            { css: 'gold', name: 'Dorado Perú', color: '#d4af37' },
            { css: 'blue', name: 'Azul Corporativo', color: '#2563eb' },
            { css: 'green', name: 'Verde Naturaleza', color: '#059669' },
            { css: 'purple', name: 'Púrpura Premium', color: '#7c3aed' },
            { css: 'red', name: 'Rojo Ejecutivo', color: '#dc2626' },
            { css: 'dark', name: 'Modo Oscuro', color: '#1e293b' }
        ];

        return temasGlobales.map(tema => `
            <button class="admin-tema-global" 
                    data-theme="${tema.css}" 
                    onclick="adminEmpresas.cambiarTemaGlobal('${tema.css}')"
                    style="background: ${tema.color};">
                ${tema.name}
            </button>
        `).join('');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS DE FUNCIONALIDAD DE TEMAS
    // ═══════════════════════════════════════════════════════════════════════════

    cambiarTemaEmpresa(tema) {
        // Actualizar visualización en el modal
        document.querySelectorAll('.admin-tema-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-tema="${tema}"]`).classList.add('selected');

        // Actualizar vista previa
        const preview = document.getElementById('admin-preview');
        if (preview) {
            const mapaTemaCss = {
                'rojo': 'red', 'azul': 'blue', 'verde': 'green',
                'morado': 'purple', 'dorado': 'gold'
            };
            preview.setAttribute('data-theme', mapaTemaCss[tema]);
        }

        this._mostrarNotificacion(`🎨 Tema ${tema} seleccionado para la empresa`);
    }

    cambiarTemaGlobal(temaCss) {
        // Aplicar tema global inmediatamente usando tu sistema
        document.documentElement.setAttribute('data-theme', temaCss);
        
        // Guardar preferencia
        localStorage.setItem('grizalum_tema_global', temaCss);
        
        this._mostrarNotificacion(`🌐 Tema global cambiado a ${temaCss}`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS DE NAVEGACIÓN Y EVENTOS
    // ═══════════════════════════════════════════════════════════════════════════

    _configurarEventosAdmin(empresaId) {
        // Navegación entre secciones
        const botones = document.querySelectorAll('.admin-nav-btn');
        botones.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seccion = e.target.dataset.seccion;
                this._cambiarSeccion(seccion);
            });
        });

        // Auto-cálculo de métricas financieras
        const inputsFinancieros = ['admin-ingresos', 'admin-gastos'];
        inputsFinancieros.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this._autoCalcularMetricas());
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalActivo) {
                this.cerrarModal();
            }
        });
    }

    _cambiarSeccion(seccionTarget) {
        // Remover active de botones y secciones
        document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.admin-seccion').forEach(sec => sec.classList.remove('active'));
        
        // Activar nueva sección
        document.querySelector(`[data-seccion="${seccionTarget}"]`).classList.add('active');
        document.getElementById(`seccion-${seccionTarget}`).classList.add('active');
        
        this._log('info', `📂 Sección cambiada a: ${seccionTarget}`);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS PÚBLICOS DE FUNCIONALIDAD
    // ═══════════════════════════════════════════════════════════════════════════

    guardarCambios(empresaId) {
        try {
            const empresa = this.gestor.estado.empresas[empresaId];
            if (!empresa) throw new Error('Empresa no encontrada');

            // Recopilar datos del formulario
            const datosActualizados = this._recopilarDatosFormulario();
            
            // Validar datos
            const validacion = this._validarDatos(datosActualizados);
            if (!validacion.valido) {
                this._mostrarError(`Error de validación: ${validacion.errores.join(', ')}`);
                return;
            }

            // Actualizar empresa
            Object.assign(empresa, datosActualizados);
            empresa.meta.fechaActualizacion = new Date().toISOString();

            // Guardar en gestor principal
            this.gestor._guardarEmpresas();
            this.gestor._actualizarListaEmpresas();
            this.gestor._actualizarSelectorPrincipal();
            this.gestor._calcularMetricas();

            // Registrar actividad
            this.gestor._registrarActividad('EMPRESA_ADMIN_EDITADA', `Admin editó empresa: ${empresa.nombre}`);

            this._mostrarExito('✅ Empresa actualizada exitosamente');
            
            setTimeout(() => this.cerrarModal(), 1000);

        } catch (error) {
            this._log('error', 'Error guardando cambios admin:', error);
            this._mostrarError('Error al guardar cambios');
        }
    }

    calcularMetricas() {
        const ingresos = parseFloat(document.getElementById('admin-ingresos').value) || 0;
        const gastos = parseFloat(document.getElementById('admin-gastos').value) || 0;
        
        const utilidad = ingresos - gastos;
        const margen = ingresos > 0 ? (utilidad / ingresos) * 100 : 0;
        
        document.getElementById('admin-utilidad').value = utilidad.toFixed(2);
        document.getElementById('admin-margen').value = margen.toFixed(2);
        
        this._mostrarNotificacion('📊 Métricas recalculadas');
    }

    _autoCalcularMetricas() {
        setTimeout(() => this.calcularMetricas(), 100);
    }

    cerrarModal() {
        if (this.modalActivo) {
            this.modalActivo.classList.remove('show');
            setTimeout(() => {
                if (this.modalActivo) {
                    this.modalActivo.remove();
                    this.modalActivo = null;
                }
            }, 300);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS AUXILIARES
    // ═══════════════════════════════════════════════════════════════════════════

    _recopilarDatosFormulario() {
        // Recopilar tema seleccionado
        const temaSeleccionado = document.querySelector('.admin-tema-option.selected');
        const tema = temaSeleccionado ? temaSeleccionado.dataset.tema : 'dorado';

        return {
            nombre: document.getElementById('admin-nombre').value.trim(),
            categoria: document.getElementById('admin-categoria').value,
            estado: document.getElementById('admin-estado').value,
            icono: document.getElementById('admin-icono').value,
            tema: tema, // ← IMPORTANTE: Guardar tema seleccionado
            
            ubicacion: {
                direccion: document.getElementById('admin-direccion').value.trim(),
                distrito: document.getElementById('admin-distrito').value.trim(),
                departamento: document.getElementById('admin-departamento').value,
                provincia: document.getElementById('admin-distrito').value.trim(),
                codigoPostal: '00000'
            },
            
            legal: {
                ruc: document.getElementById('admin-ruc').value.trim(),
                razonSocial: document.getElementById('admin-razon-social').value.trim(),
                tipoEmpresa: document.getElementById('admin-tipo-empresa').value,
                regimen: document.getElementById('admin-regimen').value
            },
            
            contacto: {
                telefono: document.getElementById('admin-telefono').value.trim(),
                email: document.getElementById('admin-email').value.trim(),
                web: document.getElementById('admin-web').value.trim()
            },
            
            finanzas: {
                caja: parseFloat(document.getElementById('admin-caja').value) || 0,
                ingresos: parseFloat(document.getElementById('admin-ingresos').value) || 0,
                gastos: parseFloat(document.getElementById('admin-gastos').value) || 0,
                utilidadNeta: parseFloat(document.getElementById('admin-utilidad').value) || 0,
                margenNeto: parseFloat(document.getElementById('admin-margen').value) || 0,
                roi: parseFloat(document.getElementById('admin-roi').value) || 0
            }
        };
    }

    _validarDatos(datos) {
        const errores = [];
        
        if (!datos.nombre) errores.push('Nombre es obligatorio');
        if (datos.nombre.length < 3) errores.push('Nombre debe tener al menos 3 caracteres');
        if (datos.legal.ruc && datos.legal.ruc.length !== 11) errores.push('RUC debe tener 11 dígitos');
        if (datos.contacto.email && !this._validarEmail(datos.contacto.email)) errores.push('Email inválido');
        
        return {
            valido: errores.length === 0,
            errores
        };
    }

    _validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GENERADORES DE OPTIONS Y SELECTORES
    // ═══════════════════════════════════════════════════════════════════════════

    _generarOpcionesCategorias(seleccionada) {
        const categorias = ['Manufactura', 'Comercio', 'Servicios', 'Agropecuario', 'Tecnología', 'Salud', 'Educación', 'Restaurante', 'Transporte', 'Construcción'];
        return categorias.map(cat => 
            `<option value="${cat}" ${cat === seleccionada ? 'selected' : ''}>${cat}</option>`
        ).join('');
    }

    _generarOpcionesEstado(seleccionado) {
        const estados = ['Operativo', 'Regular', 'Crítico', 'En Preparación', 'Mantenimiento', 'Suspendido', 'Inactivo'];
        return estados.map(estado => 
            `<option value="${estado}" ${estado === seleccionado ? 'selected' : ''}>${estado}</option>`
        ).join('');
    }

    _generarOpcionesDepartamentos(seleccionado) {
        const departamentos = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Huancayo', 'Tacna'];
        return departamentos.map(dep => 
            `<option value="${dep}" ${dep === seleccionado ? 'selected' : ''}>${dep}</option>`
        ).join('');
    }

    _generarOpcionesTipoEmpresa(seleccionado) {
        const tipos = ['S.A.C.', 'S.R.L.', 'E.I.R.L.', 'S.A.', 'Persona Natural'];
        return tipos.map(tipo => 
            `<option value="${tipo}" ${tipo === seleccionado ? 'selected' : ''}>${tipo}</option>`
        ).join('');
    }

    _generarOpcionesRegimen(seleccionado) {
        const regimenes = ['General', 'MYPE', 'RUS', 'RER'];
        return regimenes.map(reg => 
            `<option value="${reg}" ${reg === seleccionado ? 'selected' : ''}>${reg}</option>`
        ).join('');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MÉTODOS DE UTILIDAD Y NOTIFICACIONES
    // ═══════════════════════════════════════════════════════════════════════════

    _mostrarExito(mensaje) {
        this._mostrarNotificacion(mensaje, 'success');
    }

    _mostrarError(mensaje) {
        this._mostrarNotificacion(mensaje, 'error');
    }

    _mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear notificación toast
        const toast = document.createElement('div');
        toast.className = `admin-toast admin-toast-${tipo}`;
        toast.textContent = mensaje;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    _cerrarModalPrevio() {
        const modalPrevio = document.getElementById('grizalumModalAdmin');
        if (modalPrevio) modalPrevio.remove();
    }

    _log(nivel, mensaje, datos = null) {
        this.gestor._log(nivel, `[ADMIN] ${mensaje}`, datos);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ESTILOS CSS PARA EL MODAL ADMIN INTEGRADO
    // ═══════════════════════════════════════════════════════════════════════════

    _crearEstilosAdmin() {
        const estilosId = 'grizalum-admin-styles';
        if (document.getElementById(estilosId)) return;

        const estilos = document.createElement('style');
        estilos.id = estilosId;
        estilos.textContent = `
            /* MODAL ADMIN STYLES - INTEGRADO CON TU SISTEMA DE TEMAS */
            .grizalum-modal-admin {
                background: white;
                border-radius: 20px;
                width: 1000px;
                max-width: 95vw;
                max-height: 90vh;
                overflow: hidden;
                transform: scale(0.9) translateY(20px);
                transition: all 0.3s ease;
                box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            }

            .grizalum-modal-overlay.show .grizalum-modal-admin {
                transform: scale(1) translateY(0);
            }

            .grizalum-admin-header {
                background: var(--theme-gradient);
                color: white;
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .admin-header-info {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .admin-empresa-avatar {
                width: 70px;
                height: 70px;
                background: rgba(255,255,255,0.2);
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }

            .admin-empresa-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 15px;
            }

            .admin-empresa-datos h2 {
                margin: 0 0 0.5rem 0;
                font-size: 1.5rem;
            }

            .admin-categoria {
                background: rgba(255,255,255,0.2);
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
            }

            .grizalum-admin-nav {
                background: #f8fafc;
                padding: 0;
                display: flex;
                border-bottom: 1px solid #e5e7eb;
            }

            .admin-nav-btn {
                flex: 1;
                padding: 1rem;
                border: none;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                font-weight: 600;
                color: #6b7280;
                transition: all 0.3s ease;
                border-bottom: 3px solid transparent;
            }

            .admin-nav-btn:hover {
                background: #e5e7eb;
                color: #374151;
            }

            .admin-nav-btn.active {
                color: var(--theme-primary);
                border-bottom-color: var(--theme-primary);
                background: white;
            }

            .grizalum-admin-content {
                padding: 2rem;
                max-height: 500px;
                overflow-y: auto;
            }

            .admin-seccion {
                display: none;
            }

            .admin-seccion.active {
                display: block;
            }

            .admin-seccion h3 {
                margin: 0 0 1.5rem 0;
                color: #374151;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .admin-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .admin-campo-full {
                grid-column: 1 / -1;
            }

            .admin-campo label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }

            .admin-campo input,
            .admin-campo select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .admin-campo input:focus,
            .admin-campo select:focus {
                outline: none;
                border-color: var(--theme-primary);
                box-shadow: 0 0 0 3px var(--theme-primary-alpha);
            }

            .admin-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }

            .admin-btn-guardar {
                background: var(--theme-gradient);
                color: white;
                box-shadow: var(--theme-shadow-light);
            }

            .admin-btn-cancelar {
                background: #6b7280;
                color: white;
            }

            .admin-btn-calcular {
                background: var(--theme-gradient);
                color: white;
                margin-top: 1rem;
            }

            /* ESTILOS ESPECÍFICOS PARA TEMAS */
            .admin-temas-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 2rem;
            }

            .admin-config-card {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 12px;
                border: 1px solid #e5e7eb;
            }

            .admin-config-card h4 {
                margin: 0 0 1rem 0;
                color: #374151;
            }

            .admin-temas-selector {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .admin-tema-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                background: white;
            }

            .admin-tema-option:hover {
                border-color: var(--theme-primary);
                transform: translateX(5px);
            }

            .admin-tema-option.selected {
                border-color: var(--theme-primary);
                background: var(--theme-primary-alpha);
                box-shadow: 0 4px 12px var(--theme-primary-alpha);
            }

            .tema-color {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }

            .tema-info {
                flex: 1;
            }

            .tema-name {
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.25rem;
            }

            .tema-key {
                font-size: 0.8rem;
                color: #6b7280;
            }

            .tema-check {
                color: var(--theme-primary);
                font-size: 1.2rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .admin-tema-option.selected .tema-check {
                opacity: 1;
            }

            .admin-preview {
                padding: 1rem;
                background: white;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .preview-card {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: var(--theme-gradient);
                color: white;
                border-radius: 8px;
            }

            .preview-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }

            .preview-name {
                font-weight: 600;
                font-size: 1.1rem;
            }

            .preview-status {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .admin-temas-globales {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
            }

            .admin-tema-global {
                padding: 0.75rem;
                border: none;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .admin-tema-global:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            .grizalum-admin-footer {
                background: #f8fafc;
                padding: 1.5rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #e5e7eb;
            }

            .admin-footer-actions {
                display: flex;
                gap: 1rem;
            }

            .admin-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 99999;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }

            .admin-toast.show {
                transform: translateX(0);
            }

            .admin-toast-success { background: #059669; }
            .admin-toast-error { background: #dc2626; }
            .admin-toast-info { background: #2563eb; }

            @media (max-width: 768px) {
                .grizalum-modal-admin {
                    width: 95vw;
                    height: 95vh;
                }
                
                .admin-grid {
                    grid-template-columns: 1fr;
                }
                
                .admin-temas-grid {
                    grid-template-columns: 1fr;
                }
                
                .grizalum-admin-nav {
                    flex-wrap: wrap;
                }
                
                .admin-nav-btn {
                    flex: none;
                    min-width: 80px;
                    font-size: 0.8rem;
                }
            }
        `;

        document.head.appendChild(estilos);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN Y CONEXIÓN CON GESTOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

let adminEmpresas = null;

// Inicializar cuando el gestor principal esté listo
document.addEventListener('gestorEmpresasListo', () => {
    if (window.gestorEmpresas && !adminEmpresas) {
        adminEmpresas = new GestorEmpresasAdmin(window.gestorEmpresas);
        window.adminEmpresas = adminEmpresas;
        
        // Conectar con el método del gestor principal
        window.gestorEmpresas.gestionarEmpresa = function(empresaId) {
            adminEmpresas.abrirPanelAdmin(empresaId);
        };
        
        console.log('👑 Admin Panel inicializado y conectado con sistema de temas');
    }
});

// Asegurar inicialización tardía
setTimeout(() => {
    if (window.gestorEmpresas && !adminEmpresas) {
        adminEmpresas = new GestorEmpresasAdmin(window.gestorEmpresas);
        window.adminEmpresas = adminEmpresas;
        
        window.gestorEmpresas.gestionarEmpresa = function(empresaId) {
            adminEmpresas.abrirPanelAdmin(empresaId);
        };
    }
}, 2000);
