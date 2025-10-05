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
        // Verificar si el CSS ya está cargado
        if (document.getElementById('grizalum-modal-css')) return;
        
        // Cargar CSS externo
        const link = document.createElement('link');
        link.id = 'grizalum-modal-css';
        link.rel = 'stylesheet';
        link.href = 'src/assets/css/gestor-empresas-modal.css';
        document.head.appendChild(link);
        
        console.log('✅ CSS del modal cargado desde archivo externo');
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
        
        this.modoVisual = empresa.modoVisual || 'oscuro';

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
        // Aplicar modo visual guardado
     if (this.modoVisual) {
      setTimeout(() => {
          document.body.classList.remove('modo-oscuro', 'modo-claro', 'modo-neutro');
          if (this.modoVisual === 'claro') {
              document.body.classList.add('modo-claro');
           } else if (this.modoVisual === 'neutro') {
              document.body.classList.add('modo-neutro');
          }
       }, 100);
    }
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
    <p style="color: var(--modal-texto-terciario); font-size: 14px; margin-bottom: 16px;">
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
    <div class="grizalum-seccion-titulo">🌓 Modo de Visualización</div>
    <p style="color: var(--modal-texto-terciario); font-size: 14px; margin-bottom: 16px;">
        Elige el modo visual según tu preferencia o condiciones de luz
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        <button class="grizalum-modo-btn" onclick="editorEmpresas.aplicarModoVisual('oscuro')" 
                style="background: linear-gradient(135deg, #1a1b23 0%, #16213e 100%); color: white;">
            <span>🌙 Modo Oscuro</span>
            <small style="opacity: 0.7; font-size: 11px;">Para ambientes con poca luz</small>
        </button>
        <button class="grizalum-modo-btn" onclick="editorEmpresas.aplicarModoVisual('claro')"
                style="background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%); color: #1f2937;">
            <span>☀️ Modo Claro</span>
            <small style="opacity: 0.7; font-size: 11px;">Para ambientes con mucha luz</small>
        </button>
        <button class="grizalum-modo-btn" onclick="editorEmpresas.aplicarModoVisual('neutro')"
                style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white;">
            <span>⚖️ Modo Neutro</span>
            <small style="opacity: 0.7; font-size: 11px;">Equilibrado y cómodo</small>
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
                        <small style="color: var(--modal-texto-terciario)">PNG, JPG (máx 2MB)</small>
                    </div>
                    <div class="grizalum-logo-preview ${this.logoTemporal ? 'show' : ''}" id="logoPreview">
                        <img src="${this.logoTemporal || ''}" id="logoImg">
                        <div style="flex: 1; color: var(--modal-texto-principal);">
                            <div style="font-weight: 700;">Logo cargado</div>
                            <small style="color: var(--modal-texto-terciario)">Se guardará al confirmar</small>
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
                    <small style="color: var(--modal-texto-terciario); font-size: 12px; display: block; margin-top: 8px;">
                        Las notas se guardan automáticamente con la fecha de modificación
                    </small>
                </div>

                ${empresa.historial && empresa.historial.length > 0 ? `
                    <div style="margin-top: 20px;">
                        <label class="grizalum-label">Historial de Cambios</label>
                        <div style="background: var(--modal-fondo-input); border-radius: 12px; padding: 16px; max-height: 200px; overflow-y: auto;">
                            ${empresa.historial.slice(0, 5).map(cambio => `
                                <div style="padding: 8px 0; border-bottom: 1px solid var(--modal-borde); color: var(--modal-texto-secundario); font-size: 13px;">
                                    <strong style="color: var(--modal-texto-principal);">${new Date(cambio.fecha).toLocaleString('es-PE')}</strong>
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
    empresa.paletaActiva = this.paletaActiva;
    empresa.modoVisual = this.modoVisual || 'oscuro';
    
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
            card.

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

    aplicarModoVisual(modo) {
    this.modoVisual = modo;
    
    document.body.classList.remove('modo-oscuro', 'modo-claro', 'modo-neutro');
    
    if (modo === 'claro') {
        document.body.classList.add('modo-claro');
    } else if (modo === 'neutro') {
        document.body.classList.add('modo-neutro');
    }
    
    document.querySelectorAll('.grizalum-modo-btn').forEach(btn => {
        btn.classList.remove('activo');
    });
    event.target.closest('.grizalum-modo-btn').classList.add('activo');
    
    console.log(`🌓 Modo visual "${modo}" aplicado al sistema`);
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
