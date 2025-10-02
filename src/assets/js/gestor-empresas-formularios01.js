/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM - EDITOR PROFESIONAL DE EMPRESAS v2.0
 * Sistema de edición avanzado con diseño futurista
 * ═══════════════════════════════════════════════════════════════════
 */

class EditorEmpresasProfesional {
    constructor() {
        this.gestor = null;
        this.empresaEditando = null;
        this.logoTemporal = null;
        this.emojiSeleccionado = null;
        this.coloresTemp = {
        ingresos: '#d4af37',
        gastos: '#ff6b35',
        utilidad: '#2ecc71',
        crecimiento: '#9b59b6',
        tematica: '#d4af37'
    };
        
        
        console.log('🎨 Editor de Empresas Profesional inicializando...');
        this._esperarGestor();
    }

    _esperarGestor() {
        const intentarConexion = () => {
            if (window.gestorEmpresas) {
                this.gestor = window.gestorEmpresas;
                console.log('✅ Editor conectado con Gestor de Empresas');
                this._inyectarEstilos();
                return true;
            }
            return false;
        };

        if (!intentarConexion()) {
            setTimeout(() => {
                if (!intentarConexion()) {
                    setTimeout(() => {
                        if (!intentarConexion()) {
                            setTimeout(intentarConexion, 2000);
                        }
                    }, 1000);
                }
            }, 500);
        }
    }

    _inyectarEstilos() {
        if (document.getElementById('grizalum-editor-styles')) return;

        const estilos = document.createElement('style');
        estilos.id = 'grizalum-editor-styles';
        estilos.textContent = `
            .grizalum-modal-editor {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .grizalum-modal-editor.show {
                opacity: 1;
                visibility: visible;
            }

            .grizalum-modal-contenido {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 24px;
                width: 900px;
                max-width: 95vw;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
                transform: scale(0.9) translateY(20px);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .grizalum-modal-editor.show .grizalum-modal-contenido {
                transform: scale(1) translateY(0);
            }

            .grizalum-modal-header {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                padding: 28px 32px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }

            .grizalum-modal-header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -10%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: pulse 4s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }

            .grizalum-modal-titulo {
                display: flex;
                align-items: center;
                gap: 16px;
                z-index: 1;
            }

            .grizalum-modal-icono {
                width: 56px;
                height: 56px;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
            }

            .grizalum-modal-titulo h2 {
                margin: 0;
                font-size: 28px;
                font-weight: 800;
                color: white;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }

            .grizalum-modal-titulo p {
                margin: 4px 0 0 0;
                font-size: 14px;
                opacity: 0.9;
            }

            .grizalum-btn-cerrar {
                width: 48px;
                height: 48px;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 1;
            }

            .grizalum-btn-cerrar:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: rotate(90deg) scale(1.1);
            }

            .grizalum-modal-body {
                padding: 32px;
                max-height: calc(90vh - 200px);
                overflow-y: auto;
                background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
            }

            .grizalum-modal-body::-webkit-scrollbar {
                width: 8px;
            }

            .grizalum-modal-body::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            .grizalum-modal-body::-webkit-scrollbar-thumb {
                background: rgba(220, 38, 38, 0.6);
                border-radius: 10px;
            }

            .grizalum-seccion {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 24px;
                transition: all 0.3s ease;
            }

            .grizalum-seccion:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(220, 38, 38, 0.3);
            }

            .grizalum-seccion-titulo {
                font-size: 18px;
                font-weight: 700;
                color: white;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .grizalum-seccion-titulo::before {
                content: '';
                width: 4px;
                height: 24px;
                background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
                border-radius: 2px;
            }

            .grizalum-campo {
                margin-bottom: 20px;
            }

            .grizalum-label {
                display: block;
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .grizalum-input {
                width: 100%;
                padding: 14px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: white;
                font-size: 16px;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            .grizalum-input:focus {
                outline: none;
                background: rgba(255, 255, 255, 0.08);
                border-color: #dc2626;
                box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2);
            }

            .grizalum-tabs {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
            }

            .grizalum-tab {
                flex: 1;
                padding: 14px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.6);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .grizalum-tab.active {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                border-color: #dc2626;
                color: white;
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
            }

            .grizalum-tab-content {
                display: none;
            }

            .grizalum-tab-content.active {
                display: block;
            }

            .grizalum-emoji-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
                gap: 8px;
                padding: 16px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                max-height: 300px;
                overflow-y: auto;
            }

            .grizalum-emoji-item {
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid transparent;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .grizalum-emoji-item:hover {
                background: rgba(220, 38, 38, 0.2);
                border-color: #dc2626;
                transform: scale(1.15);
            }

            .grizalum-emoji-item.selected {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                border-color: #dc2626;
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.5);
            }

            .grizalum-upload-zona {
                border: 3px dashed rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(0, 0, 0, 0.2);
            }

            .grizalum-upload-zona:hover {
                border-color: #dc2626;
                background: rgba(220, 38, 38, 0.1);
            }

            .grizalum-upload-zona i {
                font-size: 48px;
                color: rgba(255, 255, 255, 0.4);
                margin-bottom: 16px;
            }

            .grizalum-upload-texto {
                color: rgba(255, 255, 255, 0.7);
                font-size: 16px;
                font-weight: 600;
            }

            .grizalum-logo-preview {
                display: none;
                align-items: center;
                gap: 16px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                margin-top: 16px;
            }

            .grizalum-logo-preview.show {
                display: flex;
            }

            .grizalum-logo-preview img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 12px;
                border: 2px solid rgba(255, 255, 255, 0.2);
            }

            .grizalum-color-picker {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                margin-bottom: 12px;
            }

            .grizalum-color-preview {
                width: 60px;
                height: 60px;
                border-radius: 12px;
                border: 3px solid rgba(255, 255, 255, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .grizalum-color-preview:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .grizalum-color-info {
                flex: 1;
            }

            .grizalum-color-nombre {
                font-size: 16px;
                font-weight: 700;
                color: white;
                margin-bottom: 4px;
            }

            .grizalum-color-hex {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);
            }

            .grizalum-preview-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }

            .grizalum-preview-card {
                padding: 20px;
                border-radius: 12px;
                background: rgba(0, 0, 0, 0.3);
                border-left: 4px solid var(--preview-color, #dc2626);
                transition: all 0.3s ease;
            }

            .grizalum-preview-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
            }

            .grizalum-preview-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .grizalum-preview-valor {
                font-size: 24px;
                font-weight: 800;
                color: white;
            }

            .grizalum-modal-footer {
                padding: 24px 32px;
                background: rgba(0, 0, 0, 0.4);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .grizalum-btn {
                padding: 14px 28px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                border: none;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .grizalum-btn-cancelar {
                background: rgba(107, 114, 128, 0.3);
                color: white;
            }

            .grizalum-btn-cancelar:hover {
                background: rgba(107, 114, 128, 0.5);
                transform: translateY(-2px);
            }

            .grizalum-btn-guardar {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            }

            .grizalum-btn-guardar:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
            }

            @media (max-width: 768px) {
                .grizalum-modal-contenido {
                    width: 100%;
                    margin: 10px;
                }

                .grizalum-preview-grid {
                    grid-template-columns: 1fr;
                }

                .grizalum-modal-header {
                    padding: 20px;
                }

                .grizalum-modal-body {
                    padding: 20px;
                }
            }
        `;

        document.head.appendChild(estilos);
        console.log('🎨 Estilos del editor inyectados');
    }

    editarEmpresa(empresaId) {
        if (!this.gestor) {
            alert('⚠️ El gestor de empresas no está listo. Recarga la página.');
            return;
        }

        const empresa = this.gestor.estado.empresas[empresaId];
        if (!empresa) {
            alert('❌ Empresa no encontrada');
            return;
        }

        this.empresaEditando = empresaId;
        this.logoTemporal = empresa.logo || null;
        this.emojiSeleccionado = empresa.icono || '🏢';
        this.coloresTemp = empresa.coloresPersonalizados || {
          ingresos: '#d4af37',
          gastos: '#ff6b35',
          utilidad: '#2ecc71',
          crecimiento: '#9b59b6',
          tematica: '#d4af37'
      };
        

        this._mostrarModal(empresa);
    }

    _mostrarModal(empresa) {
        const modal = document.createElement('div');
        modal.className = 'grizalum-modal-editor';
        modal.id = 'grizalumModalEditor';

        modal.innerHTML = `
            <div class="grizalum-modal-contenido">
                ${this._generarHeader(empresa)}
                ${this._generarBody(empresa)}
                ${this._generarFooter()}
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        this._configurarEventos();
    }

    _generarHeader(empresa) {
        return `
            <div class="grizalum-modal-header">
                <div class="grizalum-modal-titulo">
                    <div class="grizalum-modal-icono">${empresa.icono || '🏢'}</div>
                    <div>
                        <h2>Editar Empresa</h2>
                        <p>${empresa.nombre}</p>
                    </div>
                </div>
                <button class="grizalum-btn-cerrar" onclick="editorEmpresas.cerrar()">✕</button>
            </div>
        `;
    }

    _generarBody(empresa) {
    const emojis = ['🏢', '🏭', '🏪', '🏬', '🏦', '🏥', '🚚', '🍽️', '💻', '🔥', '⚙️', '🌾', '🐄', '🐟', '⛏️', '🏗️', '💎', '⚡', '🚀', '💡', '🎯', '💰', '🍕', '☕', '🚗', '✈️', '🏀', '🎮', '📱', '🔧'];

    return `
        <div class="grizalum-modal-body">
            <div class="grizalum-seccion">
                <div class="grizalum-seccion-titulo">Información Básica</div>
                
                <div class="grizalum-campo">
                    <label class="grizalum-label">Nombre de la Empresa</label>
                    <input type="text" id="empresaNombre" class="grizalum-input" value="${empresa.nombre}" maxlength="80">
                </div>

                <div class="grizalum-campo">
                    <label class="grizalum-label">RUC (Opcional)</label>
                    <input type="text" id="empresaRuc" class="grizalum-input" value="${empresa.legal?.ruc || ''}" maxlength="11">
                </div>
            </div>
           <div class="grizalum-seccion">
    <div class="grizalum-seccion-titulo">🎨 Paletas Predefinidas</div>
    <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 16px;">
        Selecciona una paleta rápida o personaliza cada color manualmente
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        <button class="grizalum-paleta-btn" onclick="editorEmpresas.aplicarPaleta('dorado-clasico')" 
                style="background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);">
            <span>✨ Dorado Clásico</span>
        </button>
        <button class="grizalum-paleta-btn" onclick="editorEmpresas.aplicarPaleta('azul-corporativo')"
                style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);">
            <span>💼 Azul Corporativo</span>
        </button>
        <button class="grizalum-paleta-btn" onclick="editorEmpresas.aplicarPaleta('verde-fresco')"
                style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            <span>🌿 Verde Fresco</span>
        </button>
        <button class="grizalum-paleta-btn" onclick="editorEmpresas.aplicarPaleta('morado-innovacion')"
                style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
            <span>🚀 Morado Innovación</span>
        </button>
        <button class="grizalum-paleta-btn" onclick="editorEmpresas.aplicarPaleta('rojo-energia')"
                style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
            <span>🔥 Rojo Energía</span>
        </button>
        <button class="grizalum-paleta-btn" onclick="editorEmpresas.aplicarPaleta('gris-minimalista')"
                style="background: linear-gradient(135deg, #64748b 0%, #475569 100%);">
            <span>⚫ Gris Minimalista</span>
        </button>
    </div>
</div>
            <div class="grizalum-seccion">
                <div class="grizalum-seccion-titulo">Identidad Visual</div>
                
                <div class="grizalum-tabs">
                    <div class="grizalum-tab active" data-tab="emoji" onclick="editorEmpresas.cambiarTab('emoji')">
                        😀 Emoji
                    </div>
                    <div class="grizalum-tab" data-tab="logo" onclick="editorEmpresas.cambiarTab('logo')">
                        🖼️ Logo
                    </div>
                </div>

                <div class="grizalum-tab-content active" id="tabEmoji">
                    <div class="grizalum-emoji-grid">
                        ${emojis.map(emoji => `
                            <div class="grizalum-emoji-item ${emoji === empresa.icono ? 'selected' : ''}" 
                                 onclick="editorEmpresas.seleccionarEmoji('${emoji}')">${emoji}</div>
                        `).join('')}
                    </div>
                </div>

                <div class="grizalum-tab-content" id="tabLogo">
                    <input type="file" id="logoInput" accept="image/*" style="display:none" onchange="editorEmpresas.subirLogo(event)">
                    <div class="grizalum-upload-zona" onclick="document.getElementById('logoInput').click()">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <div class="grizalum-upload-texto">Haz clic para subir tu logo</div>
                        <small style="color: rgba(255,255,255,0.5)">PNG, JPG (máx 2MB)</small>
                    </div>
                    <div class="grizalum-logo-preview ${this.logoTemporal ? 'show' : ''}" id="logoPreview">
                        <img src="${this.logoTemporal || ''}" id="logoImg">
                        <div style="flex: 1; color: white;">
                            <div style="font-weight: 700;">Logo cargado</div>
                            <small style="color: rgba(255,255,255,0.6)">Se guardará al confirmar</small>
                        </div>
                        <button class="grizalum-btn grizalum-btn-cancelar" onclick="editorEmpresas.eliminarLogo()" style="padding: 8px 16px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="grizalum-seccion">
                <div class="grizalum-seccion-titulo">Colores de Métricas</div>
                
                ${this._generarColorPicker('Ingresos', 'ingresos', this.coloresTemp.ingresos, '💰')}
                ${this._generarColorPicker('Gastos', 'gastos', this.coloresTemp.gastos, '💸')}
                ${this._generarColorPicker('Utilidad', 'utilidad', this.coloresTemp.utilidad, '📈')}
                ${this._generarColorPicker('Crecimiento', 'crecimiento', this.coloresTemp.crecimiento, '🚀')}
                ${this._generarColorPicker('Temática Principal', 'tematica', this.coloresTemp.tematica, '🎨')}
            </div>

            <div class="grizalum-seccion">
                <div class="grizalum-seccion-titulo">Datos Reales de la Empresa</div>
                <div class="grizalum-preview-grid">
                    <div class="grizalum-preview-card" style="--preview-color: ${this.coloresTemp.ingresos}">
                        <div class="grizalum-preview-label">💰 Ingresos</div>
                        <div class="grizalum-preview-valor" style="color: ${this.coloresTemp.ingresos}">
                            S/. ${(empresa.finanzas?.ingresos || 0).toLocaleString()}
                        </div>
                    </div>
                    <div class="grizalum-preview-card" style="--preview-color: ${this.coloresTemp.gastos}">
                        <div class="grizalum-preview-label">💸 Gastos</div>
                        <div class="grizalum-preview-valor" style="color: ${this.coloresTemp.gastos}">
                            S/. ${(empresa.finanzas?.gastos || 0).toLocaleString()}
                        </div>
                    </div>
                    <div class="grizalum-preview-card" style="--preview-color: ${this.coloresTemp.utilidad}">
                        <div class="grizalum-preview-label">📈 Utilidad</div>
                        <div class="grizalum-preview-valor" style="color: ${this.coloresTemp.utilidad}">
                            S/. ${(empresa.finanzas?.utilidadNeta || 0).toLocaleString()}
                        </div>
                    </div>
                    <div class="grizalum-preview-card" style="--preview-color: ${this.coloresTemp.crecimiento}">
                        <div class="grizalum-preview-label">🚀 Margen</div>
                        <div class="grizalum-preview-valor" style="color: ${this.coloresTemp.crecimiento}">
                            ${(empresa.finanzas?.margenNeto || 0).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            <div class="grizalum-seccion">
                <div class="grizalum-seccion-titulo">Notas y Comentarios</div>
                
                <div class="grizalum-campo">
                    <label class="grizalum-label">Observaciones sobre la empresa</label>
                    <textarea id="empresaNotas" class="grizalum-input" rows="4" 
                              placeholder="Añade notas importantes, cambios recientes, observaciones...">${empresa.notas || ''}</textarea>
                    <small style="color: rgba(255,255,255,0.5); font-size: 12px; display: block; margin-top: 8px;">
                        Las notas se guardan automáticamente con la fecha de modificación
                    </small>
                </div>

                ${empresa.historial && empresa.historial.length > 0 ? `
                    <div style="margin-top: 20px;">
                        <label class="grizalum-label">Historial de Cambios</label>
                        <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 16px; max-height: 200px; overflow-y: auto;">
                            ${empresa.historial.slice(0, 5).map(cambio => `
                                <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); font-size: 13px;">
                                    <strong style="color: white;">${new Date(cambio.fecha).toLocaleString('es-PE')}</strong>
                                    <br>${cambio.descripcion}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

    _generarColorPicker(nombre, id, color, emoji) {
        return `
            <div class="grizalum-color-picker">
                <div class="grizalum-color-preview" style="background: ${color}" 
                     onclick="document.getElementById('color${id}').click()"></div>
                <div class="grizalum-color-info">
                    <div class="grizalum-color-nombre">${emoji} ${nombre}</div>
                    <div class="grizalum-color-hex" id="hex${id}">${color}</div>
                </div>
                <input type="color" id="color${id}" value="${color}" style="display:none" 
                       onchange="editorEmpresas.cambiarColor('${id}', this.value)">
            </div>
        `;
    }

    _generarFooter() {
        return `
            <div class="grizalum-modal-footer">
                <button class="grizalum-btn grizalum-btn-cancelar" onclick="editorEmpresas.cerrar()">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button class="grizalum-btn grizalum-btn-guardar" onclick="editorEmpresas.guardar()">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        `;
    }

    _configurarEventos() {
        const modal = document.getElementById('grizalumModalEditor');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.cerrar();
        });
    }

    cambiarTab(tab) {
        document.querySelectorAll('.grizalum-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.grizalum-tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
    }

    seleccionarEmoji(emoji) {
        document.querySelectorAll('.grizalum-emoji-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.target.classList.add('selected');
        this.logoTemporal = null;
        this.emojiSeleccionado = emoji;
    }

    subirLogo(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('❌ El logo no puede superar 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.logoTemporal = e.target.result;
            const preview = document.getElementById('logoPreview');
            const img = document.getElementById('logoImg');
            img.src = e.target.result;
            preview.classList.add('show');
        };
        reader.readAsDataURL(file);
    }

    eliminarLogo() {
        this.logoTemporal = null;
        document.getElementById('logoPreview').classList.remove('show');
        document.getElementById('logoInput').value = '';
    }

    cambiarColor(tipo, color) {
        this.coloresTemp[tipo] = color;
        document.getElementById(`hex${tipo}`).textContent = color;
        
        const preview = document.querySelector(`.grizalum-color-picker input#color${tipo}`).parentElement.querySelector('.grizalum-color-preview');
        if (preview) preview.style.background = color;
        
        const cards = document.querySelectorAll('.grizalum-preview-card');
        cards.forEach(card => {
            const label = card.querySelector('.grizalum-preview-label').textContent;
            if (label.includes('Ingresos')) {
                card.style.setProperty('--preview-color', this.coloresTemp.ingresos);
                card.querySelector('.grizalum-preview-valor').style.color = this.coloresTemp.ingresos;
            }
    if (label.includes('Gastos')) {
                card.style.setProperty('--preview-color', this.coloresTemp.gastos);
                card.querySelector('.grizalum-preview-valor').style.color = this.coloresTemp.gastos;
            }
            if (label.includes('Utilidad')) {
                card.style.setProperty('--preview-color', this.coloresTemp.utilidad);
                card.querySelector('.grizalum-preview-valor').style.color = this.coloresTemp.utilidad;
            }
            if (label.includes('Crecimiento')) {
                card.style.setProperty('--preview-color', this.coloresTemp.crecimiento);
                card.querySelector('.grizalum-preview-valor').style.color = this.coloresTemp.crecimiento;
            }
        });
    }

guardar() {
    const nombre = document.getElementById('empresaNombre').value.trim();
    const ruc = document.getElementById('empresaRuc').value.trim();
    const notas = document.getElementById('empresaNotas').value.trim();

    if (!nombre || nombre.length < 3) {
        alert('❌ El nombre debe tener al menos 3 caracteres');
        return;
    }

    const empresa = this.gestor.estado.empresas[this.empresaEditando];
    const nombreAnterior = empresa.nombre;
    
    // Construir descripción de cambios
    let cambios = [];
    if (empresa.nombre !== nombre) cambios.push(`Nombre cambiado a "${nombre}"`);
    if (this.logoTemporal && !empresa.logo) cambios.push('Logo personalizado agregado');
    if (!this.logoTemporal && this.emojiSeleccionado !== empresa.icono) cambios.push(`Icono cambiado a ${this.emojiSeleccionado}`);
    if (JSON.stringify(empresa.coloresPersonalizados) !== JSON.stringify(this.coloresTemp)) cambios.push('Colores personalizados actualizados');
    if (notas !== (empresa.notas || '')) cambios.push('Notas actualizadas');
    
    // Actualizar datos
    empresa.nombre = nombre;
    
    if (empresa.legal) {
        empresa.legal.ruc = ruc;
    }

    if (this.logoTemporal) {
        empresa.logo = this.logoTemporal;
        empresa.icono = null;
    } else if (this.emojiSeleccionado) {
        empresa.icono = this.emojiSeleccionado;
        empresa.logo = null;
    }

    // NUEVO: Guardar y aplicar colores personalizados
    empresa.coloresPersonalizados = { ...this.coloresTemp };
    
    // Aplicar colores inmediatamente al sistema
    const root = document.documentElement;
    root.style.setProperty('--color-ingresos', this.coloresTemp.ingresos);
    root.style.setProperty('--color-gastos', this.coloresTemp.gastos);
    root.style.setProperty('--color-utilidad', this.coloresTemp.utilidad);
    root.style.setProperty('--color-crecimiento', this.coloresTemp.crecimiento);
    root.style.setProperty('--color-primario', this.coloresTemp.tematica);
    root.style.setProperty('--color-secundario', this.coloresTemp.tematica);

    // Notificar al sistema de paletas sobre el cambio
    document.dispatchEvent(new CustomEvent('empresaColoresActualizados', {
        detail: { colores: this.coloresTemp }
    }));

    empresa.notas = notas;
    
    // Agregar al historial
    if (!empresa.historial) empresa.historial = [];
    
    if (cambios.length > 0) {
        empresa.historial.unshift({
            fecha: new Date().toISOString(),
            descripcion: cambios.join(', '),
            usuario: 'Admin'
        });
        
        // Mantener solo los últimos 20 cambios
        if (empresa.historial.length > 20) {
            empresa.historial = empresa.historial.slice(0, 20);
        }
    }
    
    if (empresa.meta) {
        empresa.meta.fechaActualizacion = new Date().toISOString();
    }

    this.gestor._guardarEmpresas();
    this.gestor._actualizarListaEmpresas();
    this.gestor._actualizarSelectorPrincipal();
    this.gestor._calcularMetricas();

    this.cerrar();
    
    setTimeout(() => {
        alert(`✅ Empresa actualizada correctamente\n\nCambios: ${cambios.join(', ') || 'Sin cambios'}`);
    }, 300);

    console.log('✅ Empresa guardada:', nombre);
    console.log('🎨 Colores personalizados aplicados al sistema');
}

   aplicarPaleta(nombrePaleta) {
    const paletas = {
        'dorado-clasico': {
            ingresos: '#d4af37',
            gastos: '#ff6b35',
            utilidad: '#10b981',
            crecimiento: '#3b82f6',
            tematica: '#d4af37'
        },
        'azul-corporativo': {
            ingresos: '#2563eb',
            gastos: '#f59e0b',
            utilidad: '#10b981',
            crecimiento: '#8b5cf6',
            tematica: '#2563eb'
        },
        'verde-fresco': {
            ingresos: '#10b981',
            gastos: '#ef4444',
            utilidad: '#22c55e',
            crecimiento: '#06b6d4',
            tematica: '#10b981'
        },
        'morado-innovacion': {
            ingresos: '#8b5cf6',
            gastos: '#f97316',
            utilidad: '#10b981',
            crecimiento: '#3b82f6',
            tematica: '#8b5cf6'
        },
        'rojo-energia': {
            ingresos: '#ef4444',
            gastos: '#f59e0b',
            utilidad: '#10b981',
            crecimiento: '#06b6d4',
            tematica: '#ef4444'
        },
        'gris-minimalista': {
            ingresos: '#64748b',
            gastos: '#f97316',
            utilidad: '#10b981',
            crecimiento: '#3b82f6',
            tematica: '#64748b'
        }
    };

    const colores = paletas[nombrePaleta];
    if (!colores) return;

    this.paletaActiva = nombrePaleta;
    this.coloresTemp = { ...colores };

    Object.keys(colores).forEach(tipo => {
        const input = document.getElementById(`color${tipo}`);
        const hex = document.getElementById(`hex${tipo}`);
        const preview = input?.parentElement.querySelector('.grizalum-color-preview');
        
        if (input) input.value = colores[tipo];
        if (hex) hex.textContent = colores[tipo];
        if (preview) preview.style.background = colores[tipo];
    });

    const cards = document.querySelectorAll('.grizalum-preview-card');
    cards.forEach(card => {
        const label = card.querySelector('.grizalum-preview-label').textContent;
        if (label.includes('Ingresos')) {
            card.style.setProperty('--preview-color', colores.ingresos);
            card.querySelector('.grizalum-preview-valor').style.color = colores.ingresos;
        }
        if (label.includes('Gastos')) {
            card.style.setProperty('--preview-color', colores.gastos);
            card.querySelector('.grizalum-preview-valor').style.color = colores.gastos;
        }
        if (label.includes('Utilidad')) {
            card.style.setProperty('--preview-color', colores.utilidad);
            card.querySelector('.grizalum-preview-valor').style.color = colores.utilidad;
        }
        if (label.includes('Margen')) {
            card.style.setProperty('--preview-color', colores.crecimiento);
            card.querySelector('.grizalum-preview-valor').style.color = colores.crecimiento;
        }
    });

    console.log(`Paleta "${nombrePaleta}" aplicada`);
} 
    cerrar() {
        const modal = document.getElementById('grizalumModalEditor');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
        
        this.empresaEditando = null;
        this.logoTemporal = null;
        this.emojiSeleccionado = null;
    }
}

// INICIALIZACIÓN AUTOMÁTICA
console.log('🎨 Inicializando Editor de Empresas Profesional...');

window.editorEmpresas = new EditorEmpresasProfesional();

// Función global para compatibilidad
window.editarEmpresaActual = function(empresaId) {
    if (window.editorEmpresas) {
        window.editorEmpresas.editarEmpresa(empresaId);
    }
};

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🎨 EDITOR DE EMPRESAS PROFESIONAL v2.0                       ║
║  Sistema futurista de edición con diseño premium              ║
╠═══════════════════════════════════════════════════════════════╣
║  ✅ Selector de emoji/logo profesional                        ║
║  ✅ Customizador de colores avanzado                          ║
║  ✅ Vista previa en tiempo real                               ║
║  ✅ Diseño futurista con glassmorphism                        ║
║  ✅ Integración perfecta con tu sistema                       ║
╚═══════════════════════════════════════════════════════════════╝
`);
