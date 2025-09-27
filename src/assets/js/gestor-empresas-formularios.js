// ================================================================
// MODAL DE EDICIÓN PROFESIONAL
// ================================================================

FormularioEmpresas.prototype.editarEmpresa = function(empresaId) {
    console.log('✏️ Editando empresa:', empresaId);
    
    if (!this.gestor) {
        console.error('❌ Gestor no disponible');
        alert('El sistema de empresas no está listo. Recarga la página.');
        return;
    }
    
    const empresa = this.gestor.empresas[empresaId];
    
    if (!empresa) {
        this.mostrarError('Empresa no encontrada');
        return;
    }
    
    this.modoEdicion = true;
    this.empresaEditando = empresaId;
    this.emojiSeleccionado = empresa.icono || '🏢';
    this.logoSubido = empresa.logo || null;
    
    const modal = this.crearModalEdicionProfesional(empresa);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('mostrar');
        this.inicializarEditores(empresa);
    }, 100);
};

FormularioEmpresas.prototype.crearModalEdicionProfesional = function(empresa) {
    const modal = document.createElement('div');
    modal.className = 'modal-formulario';
    modal.id = 'modalEditarEmpresa';
    
    const colores = empresa.coloresPersonalizados || {
        ingresos: '#d4af37',
        gastos: '#ff6b35',
        utilidad: '#2ecc71',
        crecimiento: '#9b59b6'
    };
    
    modal.innerHTML = `
        <div class="contenido-modal modal-edicion-pro">
            <div class="cabecera-modal">
                <h2 class="titulo-modal">
                    <span>✏️</span>
                    <span>Editar Empresa</span>
                </h2>
                <button class="boton-cerrar-modal" onclick="formularioEmpresas.cerrarFormularioEdicion()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="cuerpo-modal">
                <!-- Información Básica -->
                <div class="seccion-edit">
                    <h3 class="titulo-seccion">
                        <i class="fas fa-building"></i>
                        Información Básica
                    </h3>
                    
                    <div class="grupo-campo">
                        <label class="etiqueta-campo">Nombre de la Empresa</label>
                        <input type="text" id="editNombre" class="input-texto" value="${empresa.nombre}">
                    </div>
                    
                    <div class="grupo-campo">
                        <label class="etiqueta-campo">RUC</label>
                        <input type="text" id="editRuc" class="input-texto" value="${empresa.ruc || ''}" maxlength="11">
                    </div>
                </div>
                
                <!-- Selector de Icono/Logo -->
                <div class="seccion-edit">
                    <h3 class="titulo-seccion">
                        <i class="fas fa-image"></i>
                        Identidad Visual
                    </h3>
                    
                    <div class="selector-tipo-icono">
                        <button class="btn-tipo-icono active" data-tipo="emoji" onclick="formularioEmpresas.cambiarTipoIcono('emoji')">
                            <i class="fas fa-smile"></i>
                            Emoji
                        </button>
                        <button class="btn-tipo-icono" data-tipo="logo" onclick="formularioEmpresas.cambiarTipoIcono('logo')">
                            <i class="fas fa-image"></i>
                            Logo Personalizado
                        </button>
                    </div>
                    
                    <!-- Panel Emoji -->
                    <div class="panel-icono active" id="panelEmoji">
                        <input type="text" id="buscarEmoji" class="input-buscar-emoji" placeholder="🔍 Buscar emoji...">
                        <div class="grid-emojis" id="gridEmojis">
                            ${this.generarGridEmojis()}
                        </div>
                        <div class="emoji-seleccionado-preview">
                            <span>Seleccionado:</span>
                            <div class="emoji-grande" id="emojiPreview">${this.emojiSeleccionado}</div>
                        </div>
                    </div>
                    
                    <!-- Panel Logo -->
                    <div class="panel-icono" id="panelLogo">
                        <div class="zona-subida-logo" id="zonaSubidaLogo">
                            <input type="file" id="inputLogo" accept="image/*" style="display:none" onchange="formularioEmpresas.subirLogo(event)">
                            <button class="btn-subir-logo" onclick="document.getElementById('inputLogo').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Subir Logo</span>
                                <small>PNG, JPG (máx 2MB)</small>
                            </button>
                            <div class="logo-preview" id="logoPreview" style="display:none">
                                <img id="logoImg" src="" alt="Logo">
                                <button class="btn-eliminar-logo" onclick="formularioEmpresas.eliminarLogo()">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Personalizador de Colores -->
                <div class="seccion-edit">
                    <h3 class="titulo-seccion">
                        <i class="fas fa-palette"></i>
                        Colores de Métricas
                    </h3>
                    
                    <div class="paletas-preset">
                        <button class="btn-preset" onclick="formularioEmpresas.aplicarPaleta('default')">Por Defecto</button>
                        <button class="btn-preset" onclick="formularioEmpresas.aplicarPaleta('ocean')">Océano</button>
                        <button class="btn-preset" onclick="formularioEmpresas.aplicarPaleta('sunset')">Atardecer</button>
                        <button class="btn-preset" onclick="formularioEmpresas.aplicarPaleta('forest')">Bosque</button>
                    </div>
                    
                    <div class="editores-color">
                        ${this.generarEditorColor('Ingresos', 'ingresos', colores.ingresos, '💰')}
                        ${this.generarEditorColor('Gastos', 'gastos', colores.gastos, '💸')}
                        ${this.generarEditorColor('Utilidad', 'utilidad', colores.utilidad, '📈')}
                        ${this.generarEditorColor('Crecimiento', 'crecimiento', colores.crecimiento, '🚀')}
                    </div>
                </div>
                
                <!-- Vista Previa en Vivo -->
                <div class="seccion-edit">
                    <h3 class="titulo-seccion">
                        <i class="fas fa-eye"></i>
                        Vista Previa en Vivo
                    </h3>
                    <p class="texto-ayuda">Los valores se actualizan mientras escribes</p>
                    
                    <div class="metricas-financieras-edit">
                        <div class="input-metrica">
                            <label>Ingresos (S/.)</label>
                            <input type="number" id="previewIngresos" value="0" min="0" oninput="formularioEmpresas.actualizarPreview()">
                        </div>
                        <div class="input-metrica">
                            <label>Gastos (S/.)</label>
                            <input type="number" id="previewGastos" value="0" min="0" oninput="formularioEmpresas.actualizarPreview()">
                        </div>
                    </div>
                    
                    <div class="preview-metricas-live" id="previewMetricas">
                        <div class="metric-preview" data-tipo="ingresos">
                            <div class="metric-icon-preview">💰</div>
                            <div class="metric-info-preview">
                                <span>Ingresos</span>
                                <strong id="valorIngresos">S/. 0</strong>
                            </div>
                        </div>
                        <div class="metric-preview" data-tipo="gastos">
                            <div class="metric-icon-preview">💸</div>
                            <div class="metric-info-preview">
                                <span>Gastos</span>
                                <strong id="valorGastos">S/. 0</strong>
                            </div>
                        </div>
                        <div class="metric-preview" data-tipo="utilidad">
                            <div class="metric-icon-preview">📈</div>
                            <div class="metric-info-preview">
                                <span>Utilidad</span>
                                <strong id="valorUtilidad">S/. 0</strong>
                            </div>
                        </div>
                        <div class="metric-preview" data-tipo="crecimiento">
                            <div class="metric-icon-preview">🚀</div>
                            <div class="metric-info-preview">
                                <span>Crecimiento</span>
                                <strong id="valorCrecimiento">0%</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="pie-modal">
                <button class="boton-anterior" onclick="formularioEmpresas.cerrarFormularioEdicion()">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button class="boton-crear" onclick="formularioEmpresas.guardarCambiosEmpresa()">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        </div>
    `;
    
    return modal;
};

FormularioEmpresas.prototype.generarGridEmojis = function() {
    const emojis = [
        '🏢', '🏭', '🏪', '🏬', '🏦', '🏥', '🏛️', '🏗️',
        '🚚', '🚢', '✈️', '🚁', '🚂', '🚗', '🏎️', '🚕',
        '🍽️', '🍕', '🍔', '🍜', '🍰', '☕', '🍷', '🥗',
        '💻', '📱', '⌨️', '🖥️', '🖨️', '📷', '📹', '🎮',
        '⚙️', '🔧', '🔨', '🛠️', '⚡', '🔥', '💡', '🔌',
        '🌾', '🌿', '🌱', '🌳', '🌻', '🌺', '🌸', '🌼',
        '🐄', '🐖', '🐔', '🐑', '🐴', '🦃', '🐝', '🦋',
        '🐟', '🐠', '🦐', '🦞', '🦑', '🐙', '🦀', '🐡',
        '⛏️', '💎', '🪨', '⛰️', '🗻', '🏔️', '🌋', '🏞️'
    ];
    
    return emojis.map(emoji => 
        `<div class="emoji-item ${emoji === this.emojiSeleccionado ? 'selected' : ''}" 
              onclick="formularioEmpresas.seleccionarEmojiPro('${emoji}')">${emoji}</div>`
    ).join('');
};

FormularioEmpresas.prototype.generarEditorColor = function(nombre, id, valorInicial, icono) {
    return `
        <div class="editor-color-pro">
            <div class="color-header">
                <span class="color-icono">${icono}</span>
                <span class="color-nombre">${nombre}</span>
            </div>
            <div class="color-controls">
                <input type="color" id="color${id.charAt(0).toUpperCase() + id.slice(1)}" 
                       value="${valorInicial}" class="color-picker-pro" 
                       oninput="formularioEmpresas.cambiarColor('${id}', this.value)">
                <input type="text" id="hex${id.charAt(0).toUpperCase() + id.slice(1)}" 
                       value="${valorInicial}" class="hex-input" 
                       oninput="formularioEmpresas.cambiarColorHex('${id}', this.value)">
            </div>
        </div>
    `;
};

// Funciones de interacción
FormularioEmpresas.prototype.inicializarEditores = function(empresa) {
    // Cargar logo si existe
    if (empresa.logo) {
        this.cambiarTipoIcono('logo');
        document.getElementById('logoImg').src = empresa.logo;
        document.getElementById('logoPreview').style.display = 'flex';
    }
    
    // Inicializar colores
    const colores = empresa.coloresPersonalizados || {};
    if (colores.ingresos) this.cambiarColor('ingresos', colores.ingresos);
    if (colores.gastos) this.cambiarColor('gastos', colores.gastos);
    if (colores.utilidad) this.cambiarColor('utilidad', colores.utilidad);
    if (colores.crecimiento) this.cambiarColor('crecimiento', colores.crecimiento);
};

FormularioEmpresas.prototype.cambiarTipoIcono = function(tipo) {
    document.querySelectorAll('.btn-tipo-icono').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.panel-icono').forEach(panel => panel.classList.remove('active'));
    
    document.querySelector(`[data-tipo="${tipo}"]`).classList.add('active');
    document.getElementById(tipo === 'emoji' ? 'panelEmoji' : 'panelLogo').classList.add('active');
};

FormularioEmpresas.prototype.seleccionarEmojiPro = function(emoji) {
    document.querySelectorAll('.emoji-item').forEach(item => item.classList.remove('selected'));
    event.target.classList.add('selected');
    this.emojiSeleccionado = emoji;
    document.getElementById('emojiPreview').textContent = emoji;
};

FormularioEmpresas.prototype.subirLogo = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
        alert('❌ El logo no puede superar 2MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        this.logoSubido = e.target.result;
        document.getElementById('logoImg').src = e.target.result;
        document.getElementById('logoPreview').style.display = 'flex';
    };
    reader.readAsDataURL(file);
};

FormularioEmpresas.prototype.eliminarLogo = function() {
    this.logoSubido = null;
    document.getElementById('logoPreview').style.display = 'none';
    document.getElementById('inputLogo').value = '';
};

FormularioEmpresas.prototype.cambiarColor = function(tipo, color) {
    document.getElementById(`hex${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).value = color;
    const preview = document.querySelector(`[data-tipo="${tipo}"]`);
    if (preview) {
        preview.style.setProperty('--color-metrica', color);
    }
};

FormularioEmpresas.prototype.cambiarColorHex = function(tipo, hex) {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        document.getElementById(`color${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).value = hex;
        this.cambiarColor(tipo, hex);
    }
};

FormularioEmpresas.prototype.aplicarPaleta = function(nombre) {
    const paletas = {
        default: { ingresos: '#d4af37', gastos: '#ff6b35', utilidad: '#2ecc71', crecimiento: '#9b59b6' },
        ocean: { ingresos: '#3498db', gastos: '#e74c3c', utilidad: '#1abc9c', crecimiento: '#16a085' },
        sunset: { ingresos: '#e67e22', gastos: '#c0392b', utilidad: '#f39c12', crecimiento: '#d35400' },
        forest: { ingresos: '#27ae60', gastos: '#c0392b', utilidad: '#2ecc71', crecimiento: '#16a085' }
    };
    
    const paleta = paletas[nombre];
    Object.keys(paleta).forEach(tipo => {
        this.cambiarColor(tipo, paleta[tipo]);
        document.getElementById(`color${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).value = paleta[tipo];
    });
};

FormularioEmpresas.prototype.actualizarPreview = function() {
    const ingresos = parseFloat(document.getElementById('previewIngresos').value) || 0;
    const gastos = parseFloat(document.getElementById('previewGastos').value) || 0;
    const utilidad = ingresos - gastos;
    const crecimiento = ingresos > 0 ? ((utilidad / ingresos) * 100).toFixed(1) : 0;
    
    document.getElementById('valorIngresos').textContent = `S/. ${ingresos.toLocaleString()}`;
    document.getElementById('valorGastos').textContent = `S/. ${gastos.toLocaleString()}`;
    document.getElementById('valorUtilidad').textContent = `S/. ${utilidad.toLocaleString()}`;
    document.getElementById('valorCrecimiento').textContent = `${crecimiento}%`;
};

FormularioEmpresas.prototype.guardarCambiosEmpresa = function() {
    const empresa = this.gestor.empresas[this.empresaEditando];
    if (!empresa) return;
    
    // Actualizar datos
    empresa.nombre = document.getElementById('editNombre').value.trim();
    empresa.ruc = document.getElementById('editRuc').value.trim();
    
    // Guardar icono o logo
    if (this.logoSubido) {
        empresa.logo = this.logoSubido;
        empresa.icono = null;
    } else {
        empresa.icono = this.emojiSeleccionado;
        empresa.logo = null;
    }
    
    // Guardar colores
    empresa.coloresPersonalizados = {
        ingresos: document.getElementById('colorIngresos').value,
        gastos: document.getElementById('colorGastos').value,
        utilidad: document.getElementById('colorUtilidad').value,
        crecimiento: document.getElementById('colorCrecimiento').value
    };
    
    this.gestor.guardarEmpresas();
    this.gestor.actualizarListaEmpresas();
    this.cerrarFormularioEdicion();
    
    alert('✅ Empresa actualizada correctamente');
};

FormularioEmpresas.prototype.cerrarFormularioEdicion = function() {
    const modal = document.getElementById('modalEditarEmpresa');
    if (modal) {
        modal.classList.remove('mostrar');
        setTimeout(() => modal.remove(), 300);
    }
    this.modoEdicion = false;
    this.empresaEditando = null;
};

// Estilos profesionales
const estilosPro = document.createElement('style');
estilosPro.textContent = `
    .modal-edicion-pro { max-width: 800px !important; }
    .seccion-edit { margin-bottom: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px; }
    .titulo-seccion { display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; font-weight: 700; color: #1f2937; margin-bottom: 1rem; }
    .selector-tipo-icono { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .btn-tipo-icono { flex: 1; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 10px; background: white; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600; }
    .btn-tipo-icono.active { border-color: #dc2626; background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .panel-icono { display: none; }
    .panel-icono.active { display: block; }
    .input-buscar-emoji { width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 1rem; }
    .grid-emojis { display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 0.5rem; max-height: 200px; overflow-y: auto; padding: 0.5rem; background: white; border-radius: 8px; }
    .emoji-item { font-size: 2rem; padding: 0.5rem; text-align: center; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
    .emoji-item:hover, .emoji-item.selected { background: rgba(220, 38, 38, 0.1); transform: scale(1.1); }
    .emoji-seleccionado-preview { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; padding: 1rem; background: white; border-radius: 8px; }
    .emoji-grande { font-size: 3rem; }
    .zona-subida-logo { min-height: 200px; display: flex; align-items: center; justify-content: center; }
    .btn-subir-logo { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 2rem; border: 3px dashed #d1d5db; border-radius: 12px; background: white; cursor: pointer; transition: all 0.3s; }
    .btn-subir-logo:hover { border-color: #dc2626; background: rgba(220, 38, 38, 0.05); }
    .btn-subir-logo i { font-size: 3rem; color: #6b7280; }
    .logo-preview { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 12px; }
    .logo-preview img { max-width: 150px; max-height: 150px; object-fit: contain; }
    .btn-eliminar-logo { padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; }
    .paletas-preset { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.5rem; }
    .btn-preset { padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; transition: all 0.3s; }
    .btn-preset:hover { border-color: #dc2626; background: rgba(220, 38, 38, 0.1); }
    .editores-color { display: grid; gap: 1rem; }
    .editor-color-pro { display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: white; border-radius: 10px; }
    .color-header { display: flex; align-items: center; gap: 0.75rem; }
    .color-icono { font-size: 1.5rem; }
    .color-nombre { font-weight: 600; color: #374151; }
    .color-controls { display: flex; gap: 0.75rem; align-items: center; }
    .color-picker-pro { width: 60px; height: 40px; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; }
    .hex-input { width: 100px; padding: 0.5rem; border: 2px solid #e5e7eb; border-radius: 8px; font-family: monospace; text-transform: uppercase; }
    .metricas-financieras-edit { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .input-metrica label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #374151; }
    .input-metrica input { width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; }
    .preview-metricas-live { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .metric-preview { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 10px; border-left: 4px solid var(--color-metrica, #d4af37); }
    .metric-icon-preview { font-size: 2rem; }
    .metric-info-preview span { display: block; font-size: 0.85rem; color: #6b7280; }
    .metric-info-preview strong { font-size: 1.25rem; color: var(--color-metrica, #1f2937); }
    .texto-ayuda { font-size: 0.9rem; color: #6b7280; margin-bottom: 1rem; }
`;
document.head.appendChild(estilosPro);

console.log('✏️ Editor profesional de empresas cargado');
