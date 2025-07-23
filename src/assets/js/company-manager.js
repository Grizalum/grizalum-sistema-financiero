/**
 * ================================================
 * GRIZALUM - COMPANY MANAGER MODULE
 * Sistema de gestión de empresas
 * ================================================
 */

// ======= CLASE PRINCIPAL COMPANY MANAGER =======
class CompanyManager {
    constructor() {
        this.companies = this.loadCompaniesData();
        this.currentSelected = 'fundicion-laguna';
        this.currentEditingCompany = null;
        this.init();
    }

    // Inicializar Company Manager
    init() {
        console.log('🏢 Inicializando Company Manager...');
        this.bindEvents();
        this.updateInterface();
        console.log('✅ Company Manager inicializado');
    }

    // ======= DATOS DE EMPRESAS =======

    // Obtener datos por defecto de empresas
    getDefaultCompaniesData() {
        return {
            'fundicion-laguna': {
                name: 'Fundición Laguna',
                icon: '🔥',
                status: 'Operativo',
                theme: { primary: '#dc2626', secondary: '#ea580c', accent: '#f87171' },
                paletteName: 'Rojo Dinámico',
                data: {
                    cashFlow: 24500,
                    revenue: 45200,
                    expenses: 28700,
                    profit: 16500
                }
            },
            'fundicion-joel': {
                name: 'Fundición Joel',
                icon: '🔥',
                status: 'Operativo',
                theme: { primary: '#ea580c', secondary: '#f97316', accent: '#fb923c' },
                paletteName: 'Naranja Energético',
                data: {
                    cashFlow: 18300,
                    revenue: 32100,
                    expenses: 21800,
                    profit: 10300
                }
            },
            'avicola-san-juan': {
                name: 'Avícola San Juan',
                icon: '🐔',
                status: 'Operativo',
                theme: { primary: '#059669', secondary: '#10b981', accent: '#34d399' },
                paletteName: 'Verde Prosperidad',
                data: {
                    cashFlow: 32100,
                    revenue: 58300,
                    expenses: 41200,
                    profit: 17100
                }
            },
            'bodega-central': {
                name: 'Bodega Central',
                icon: '🏪',
                status: 'Regular',
                theme: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' },
                paletteName: 'Azul Corporativo',
                data: {
                    cashFlow: 15800,
                    revenue: 28500,
                    expenses: 19700,
                    profit: 8800
                }
            },
            'importaciones-gz': {
                name: 'Importaciones GZ',
                icon: '📦',
                status: 'Operativo',
                theme: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
                paletteName: 'Púrpura Premium',
                data: {
                    cashFlow: 45200,
                    revenue: 72800,
                    expenses: 48600,
                    profit: 24200
                }
            }
        };
    }

    // Cargar datos de empresas
    loadCompaniesData() {
        try {
            const saved = localStorage.getItem('grizalum_companies');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Error cargando datos de empresas:', e);
        }
        
        // Si no hay datos guardados, usar los por defecto
        const defaultData = this.getDefaultCompaniesData();
        this.saveCompaniesData(defaultData);
        return defaultData;
    }

    // Guardar datos de empresas
    saveCompaniesData(companies = null) {
        const dataToSave = companies || this.companies;
        try {
            localStorage.setItem('grizalum_companies', JSON.stringify(dataToSave));
            console.log('💾 Datos de empresas guardados');
        } catch (e) {
            console.error('Error guardando datos de empresas:', e);
        }
    }

    // ======= GESTIÓN DE EMPRESAS =======

    // Obtener empresa actual seleccionada
    getCurrentSelected() {
        return this.companies[this.currentSelected] || null;
    }

    // Obtener todas las empresas
    getAllCompanies() {
        return this.companies;
    }

    // Seleccionar empresa
    selectCompany(companyId) {
        if (!this.companies[companyId]) {
            console.error('Empresa no encontrada:', companyId);
            return;
        }

        console.log(`🏢 Seleccionando empresa: ${companyId}`);
        
        this.currentSelected = companyId;
        this.updateSelectedCompany(companyId);
        this.updateCompanyData(companyId);
        this.closeDropdown();
        
        // Notificación
        if (window.aiAssistant) {
            window.aiAssistant.showNotification(
                `🏢 Cambiado a ${this.companies[companyId].name}`, 
                'success'
            );
        }
    }

    // Actualizar empresa seleccionada en la UI
    updateSelectedCompany(companyId) {
        const company = this.companies[companyId];
        if (!company) return;

        // Actualizar selector principal
        const elements = {
            currentCompanyIcon: company.icon,
            currentCompanyName: company.name,
            currentCompanyStatus: `🟢 ${company.status}`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Actualizar clase activa en la lista
        document.querySelectorAll('.company-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-company="${companyId}"]`);
        if (activeItem) activeItem.classList.add('active');

        console.log(`✅ UI actualizada para: ${company.name}`);
    }

    // Actualizar datos de la empresa en dashboards
    updateCompanyData(companyId) {
        const company = this.companies[companyId];
        if (!company) return;

        this.updateKPIs(company.data);
        this.updateSidebar(company.data);
        this.updateTheme(company.theme);

        console.log(`📊 Datos actualizados para: ${company.name}`);
    }

    // Actualizar KPIs del dashboard
    updateKPIs(data) {
        const kpiValues = document.querySelectorAll('.kpi-value-animation');
        if (kpiValues.length >= 4) {
            kpiValues[0].textContent = `S/. ${data.cashFlow.toLocaleString()}`;
            kpiValues[1].textContent = `S/. ${data.revenue.toLocaleString()}`;
            kpiValues[2].textContent = `S/. ${data.expenses.toLocaleString()}`;
            kpiValues[3].textContent = `S/. ${data.profit.toLocaleString()}`;
        }
    }

    // Actualizar sidebar
    updateSidebar(data) {
        const elements = {
            'sidebarCashFlow': data.cashFlow,
            'sidebarRevenue': data.revenue,
            'sidebarExpenses': data.expenses,
            'sidebarProfit': data.profit
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `S/. ${value.toLocaleString()}`;
            }
        });
    }

    // Actualizar tema de la empresa
    updateTheme(theme) {
        if (!theme) return;

        // Aplicar colores del tema
        document.documentElement.style.setProperty('--company-primary', theme.primary);
        document.documentElement.style.setProperty('--company-secondary', theme.secondary);
        
        // Actualizar elementos visuales
        const selectedCompany = document.querySelector('.selected-company');
        if (selectedCompany) {
            selectedCompany.style.borderColor = theme.primary + '80';
        }
    }

    // ======= DROPDOWN DE EMPRESAS =======

    // Toggle dropdown
    toggleDropdown() {
        const dropdown = document.getElementById('companyDropdown');
        const arrow = document.getElementById('dropdownArrow');
        
        if (dropdown) dropdown.classList.toggle('show');
        if (arrow) arrow.classList.toggle('rotate');
    }

    // Cerrar dropdown
    closeDropdown() {
        const dropdown = document.getElementById('companyDropdown');
        const arrow = document.getElementById('dropdownArrow');
        
        if (dropdown) dropdown.classList.remove('show');
        if (arrow) arrow.classList.remove('rotate');
    }

    // ======= CREAR/EDITAR EMPRESAS =======

    // Agregar nueva empresa
    addCompany(companyData) {
        const companyId = this.generateCompanyId(companyData.name);
        
        const newCompany = {
            name: companyData.name,
            icon: companyData.icon || '🏢',
            status: companyData.status || 'Operativo',
            theme: companyData.theme || { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' },
            paletteName: companyData.paletteName || 'Azul Corporativo',
            data: {
                cashFlow: companyData.cashFlow || 0,
                revenue: companyData.revenue || 0,
                expenses: companyData.expenses || 0,
                profit: companyData.profit || 0
            }
        };

        this.companies[companyId] = newCompany;
        this.saveCompaniesData();
        this.updateInterface();

        console.log(`✅ Nueva empresa agregada: ${newCompany.name}`);
        
        if (window.aiAssistant) {
            window.aiAssistant.showNotification(
                `✅ Empresa "${newCompany.name}" agregada exitosamente`, 
                'success'
            );
        }

        return companyId;
    }

    // Editar empresa existente
    editCompany(companyId, newData) {
        if (!this.companies[companyId]) {
            console.error('Empresa no encontrada para editar:', companyId);
            return false;
        }

        const company = this.companies[companyId];
        
        // Actualizar datos
        if (newData.name) company.name = newData.name;
        if (newData.icon) company.icon = newData.icon;
        if (newData.status) company.status = newData.status;
        if (newData.theme) company.theme = newData.theme;
        if (newData.paletteName) company.paletteName = newData.paletteName;

        this.saveCompaniesData();
        
        // Si es la empresa actual, actualizar vista
        if (this.currentSelected === companyId) {
            this.updateSelectedCompany(companyId);
            this.updateTheme(company.theme);
        }

        this.updateInterface();

        console.log(`✅ Empresa editada: ${company.name}`);
        
        if (window.aiAssistant) {
            window.aiAssistant.showNotification(
                `✅ Empresa "${company.name}" actualizada exitosamente`, 
                'success'
            );
        }

        return true;
    }

    // Eliminar empresa
    deleteCompany(companyId) {
        if (!this.companies[companyId]) {
            console.error('Empresa no encontrada para eliminar:', companyId);
            return false;
        }

        const companyName = this.companies[companyId].name;
        
        // No permitir eliminar si es la única empresa
        if (Object.keys(this.companies).length <= 1) {
            if (window.aiAssistant) {
                window.aiAssistant.showNotification(
                    '⚠️ No puedes eliminar la última empresa', 
                    'error'
                );
            }
            return false;
        }

        // Si es la empresa actual, seleccionar otra
        if (this.currentSelected === companyId) {
            const otherCompanies = Object.keys(this.companies).filter(id => id !== companyId);
            this.selectCompany(otherCompanies[0]);
        }

        delete this.companies[companyId];
        this.saveCompaniesData();
        this.updateInterface();

        console.log(`🗑️ Empresa eliminada: ${companyName}`);
        
        if (window.aiAssistant) {
            window.aiAssistant.showNotification(
                `🗑️ Empresa "${companyName}" eliminada`, 
                'success'
            );
        }

        return true;
    }

    // ======= UTILIDADES =======

    // Generar ID único para empresa
    generateCompanyId(name) {
        return name.toLowerCase()
                  .replace(/[^a-z0-9]/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '');
    }

    // Actualizar toda la interfaz
    updateInterface() {
        this.updateCompanyList();
        this.updateDropdownFooter();
    }

    // Actualizar lista de empresas en dropdown
    updateCompanyList() {
        const container = document.querySelector('.companies-list');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(this.companies).forEach(([companyId, company]) => {
            const statusIcon = company.status === 'Operativo' ? '🟢' : 
                             company.status === 'Regular' ? '🟡' : 
                             company.status === 'Mantenimiento' ? '🔵' : '🔴';

            const companyItem = document.createElement('div');
            companyItem.className = `company-item ${this.currentSelected === companyId ? 'active' : ''}`;
            companyItem.dataset.company = companyId;
            companyItem.onclick = () => this.selectCompany(companyId);

            companyItem.innerHTML = `
                <div class="company-item-icon">${company.icon}</div>
                <div class="company-item-info">
                    <div class="company-item-name">${company.name}</div>
                    <div class="company-item-stats">Flujo: S/. ${company.data.cashFlow.toLocaleString()}</div>
                </div>
                <div class="company-item-status">${statusIcon}</div>
            `;

            container.appendChild(companyItem);
        });
    }

    // Actualizar footer del dropdown
    updateDropdownFooter() {
        const footer = document.querySelector('.dropdown-footer .total-companies');
        if (!footer) return;

        const totalCashFlow = Object.values(this.companies)
            .reduce((sum, company) => sum + company.data.cashFlow, 0);

        footer.innerHTML = `<strong>📊 Total Holding: S/. ${totalCashFlow.toLocaleString()}</strong>`;
    }

    // ======= EVENTS =======

    // Vincular eventos
    bindEvents() {
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (event) => {
            const selector = document.getElementById('companySelector');
            if (selector && !selector.contains(event.target)) {
                this.closeDropdown();
            }
        });

        console.log('🔗 Eventos de Company Manager vinculados');
    }
}

// ======= MODAL DE EDITAR EMPRESA =======

// Paletas de colores para empresas
const COMPANY_COLOR_PALETTES = {
    gold: {
        name: 'Oro Ejecutivo',
        primary: '#d4af37',
        secondary: '#b87333',
        accent: '#f4d03f'
    },
    green: {
        name: 'Verde Prosperidad',
        primary: '#059669',
        secondary: '#10b981',
        accent: '#34d399'
    },
    blue: {
        name: 'Azul Corporativo',
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#60a5fa'
    },
    purple: {
        name: 'Púrpura Premium',
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        accent: '#a78bfa'
    },
    red: {
        name: 'Rojo Dinámico',
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#f87171'
    },
    orange: {
        name: 'Naranja Energético',
        primary: '#ea580c',
        secondary: '#f97316',
        accent: '#fb923c'
    },
    teal: {
        name: 'Turquesa Moderno',
        primary: '#0891b2',
        secondary: '#06b6d4',
        accent: '#22d3ee'
    },
    pink: {
        name: 'Rosa Elegante',
        primary: '#ec4899',
        secondary: '#f472b6',
        accent: '#f9a8d4'
    }
};

// ======= FUNCIONES DEL MODAL DE EDITAR =======

// Crear modal de editar empresa
function createEditCompanyModal() {
    const existingModal = document.getElementById('editCompanyModal');
    if (existingModal) return existingModal;

    const modalHTML = `
        <div id="editCompanyModal" class="management-modal" style="display: none;">
            <div class="modal-content enhanced-modal">
                <div class="modal-header">
                    <h3>✏️ Editar Empresa</h3>
                    <button class="close-modal" onclick="closeEditModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Nombre de la Empresa</label>
                        <input type="text" id="editCompanyName" class="form-input" placeholder="Ej: Fundición Laguna">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Icono</label>
                        <div class="icon-selector">
                            <div class="icon-option" data-icon="🔥" onclick="selectIcon('🔥')">🔥</div>
                            <div class="icon-option" data-icon="🐔" onclick="selectIcon('🐔')">🐔</div>
                            <div class="icon-option" data-icon="🏪" onclick="selectIcon('🏪')">🏪</div>
                            <div class="icon-option" data-icon="📦" onclick="selectIcon('📦')">📦</div>
                            <div class="icon-option" data-icon="🏭" onclick="selectIcon('🏭')">🏭</div>
                            <div class="icon-option" data-icon="🚛" onclick="selectIcon('🚛')">🚛</div>
                            <div class="icon-option" data-icon="💼" onclick="selectIcon('💼')">💼</div>
                            <div class="icon-option" data-icon="🏢" onclick="selectIcon('🏢')">🏢</div>
                        </div>
                        <input type="hidden" id="editCompanyIcon" value="🔥">
                    </div>

                    <div class="form-group">
                        <label class="form-label">🎨 Paleta de Colores Corporativa</label>
                        <p class="form-help">Elige los colores que representen tu empresa</p>
                        
                        <div class="color-palette-selector" id="colorPaletteSelector">
                            <!-- Se genera dinámicamente -->
                        </div>

                        <div class="selected-palette-preview" id="selectedPalettePreview">
                            <h4>Vista Previa</h4>
                            <div class="preview-company-card">
                                <div class="preview-icon" id="previewIcon">🔥</div>
                                <div class="preview-info">
                                    <div class="preview-name" id="previewName">Fundición Laguna</div>
                                    <div class="preview-status">🟢 Operativo</div>
                                </div>
                            </div>
                        </div>

                        <input type="hidden" id="selectedCompanyPalette" value="gold">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Estado</label>
                        <select id="editCompanyStatus" class="form-input">
                            <option value="Operativo">🟢 Operativo</option>
                            <option value="Regular">🟡 Regular</option>
                            <option value="Mantenimiento">🔵 Mantenimiento</option>
                            <option value="Cerrado">🔴 Cerrado</option>
                        </select>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-success" onclick="saveCompanyChanges()">
                        <i class="fas fa-save"></i>
                        Guardar Cambios
                    </button>
                    <button class="btn btn-neutral" onclick="closeEditModal()">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    generateColorPaletteSelector();
    return document.getElementById('editCompanyModal');
}

// Generar selector de paletas de colores
function generateColorPaletteSelector() {
    const container = document.getElementById('colorPaletteSelector');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(COMPANY_COLOR_PALETTES).forEach(([paletteId, palette]) => {
        const paletteCard = document.createElement('div');
        paletteCard.className = 'palette-card';
        paletteCard.dataset.palette = paletteId;
        paletteCard.onclick = () => selectCompanyPalette(paletteId);

        paletteCard.innerHTML = `
            <div class="palette-preview">
                <div class="color-circle" style="background: ${palette.primary};"></div>
                <div class="color-circle" style="background: ${palette.secondary};"></div>
                <div class="color-circle" style="background: ${palette.accent};"></div>
            </div>
            <div class="palette-info">
                <h4>${palette.name}</h4>
                <p>${getPaletteDescription(paletteId)}</p>
            </div>
            <div class="palette-check">
                <i class="fas fa-check"></i>
            </div>
        `;

        container.appendChild(paletteCard);
    });
}

// Obtener descripción de la paleta
function getPaletteDescription(paletteId) {
    const descriptions = {
        gold: 'Elegancia y prestigio',
        green: 'Crecimiento y éxito',
        blue: 'Confianza y solidez',
        purple: 'Innovación y lujo',
        red: 'Energía y pasión',
        orange: 'Creatividad y vitalidad',
        teal: 'Frescura y modernidad',
        pink: 'Estilo y sofisticación'
    };
    return descriptions[paletteId] || 'Diseño profesional';
}

// ======= FUNCIONES DEL MODAL =======

// Editar empresa
function editCompany(companyId) {
    createEditCompanyModal();
    
    if (!window.companyManager) {
        console.error('CompanyManager no está disponible');
        return;
    }

    const companies = window.companyManager.getAllCompanies();
    const company = companies[companyId];
    
    if (!company) {
        console.error('Empresa no encontrada:', companyId);
        return;
    }

    window.companyManager.currentEditingCompany = companyId;
    
    // Llenar formulario
    document.getElementById('editCompanyName').value = company.name;
    document.getElementById('editCompanyIcon').value = company.icon;
    document.getElementById('editCompanyStatus').value = company.status;
    
    // Marcar icono seleccionado
    document.querySelectorAll('.icon-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.icon === company.icon) {
            option.classList.add('selected');
        }
    });
    
    // Seleccionar paleta actual
    const currentPalette = findPaletteByColors(company.theme) || 'gold';
    selectCompanyPalette(currentPalette);
    
    // Mostrar modal
    const modal = document.getElementById('editCompanyModal');
    modal.style.display = 'block';
    modal.classList.add('show');
}

// Seleccionar icono
function selectIcon(icon) {
    document.querySelectorAll('.icon-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    document.getElementById('editCompanyIcon').value = icon;
    
    // Actualizar vista previa
    document.getElementById('previewIcon').textContent = icon;
}

// Seleccionar paleta de empresa
function selectCompanyPalette(paletteId) {
    console.log(`🎨 Seleccionando paleta: ${paletteId}`);
    
    // Actualizar clases activas
    document.querySelectorAll('.palette-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-palette="${paletteId}"]`).classList.add('selected');
    
    // Guardar selección
    document.getElementById('selectedCompanyPalette').value = paletteId;
    
    // Actualizar vista previa
    updatePalettePreview(paletteId);
}

// Actualizar vista previa de la paleta
function updatePalettePreview(paletteId) {
    const palette = COMPANY_COLOR_PALETTES[paletteId];
    const previewIcon = document.getElementById('previewIcon');
    const previewName = document.getElementById('previewName');
    
    // Actualizar nombre de vista previa
    const companyName = document.getElementById('editCompanyName').value;
    if (companyName) {
        previewName.textContent = companyName;
    }
    
    // Aplicar colores de la paleta
    previewIcon.style.background = `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`;
    
    // Actualizar borde de la tarjeta
    const previewCard = document.querySelector('.preview-company-card');
    previewCard.style.borderColor = palette.primary;
    previewCard.style.background = `linear-gradient(135deg, ${palette.primary}08 0%, ${palette.secondary}08 100%)`;
    
    console.log(`✅ Vista previa actualizada con paleta: ${palette.name}`);
}

// Guardar cambios de la empresa
function saveCompanyChanges() {
    if (!window.companyManager || !window.companyManager.currentEditingCompany) {
        console.error('No hay empresa en edición');
        return;
    }

    const companyId = window.companyManager.currentEditingCompany;
    const newName = document.getElementById('editCompanyName').value.trim();
    const newIcon = document.getElementById('editCompanyIcon').value;
    const newStatus = document.getElementById('editCompanyStatus').value;
    const selectedPalette = document.getElementById('selectedCompanyPalette').value;
    
    if (!newName) {
        alert('❌ El nombre de la empresa es obligatorio');
        return;
    }
    
    // Obtener datos de la paleta seleccionada
    const paletteData = COMPANY_COLOR_PALETTES[selectedPalette];
    
    const newData = {
        name: newName,
        icon: newIcon,
        status: newStatus,
        theme: {
            primary: paletteData.primary,
            secondary: paletteData.secondary,
            accent: paletteData.accent
        },
        paletteName: paletteData.name
    };

    // Guardar cambios
    const success = window.companyManager.editCompany(companyId, newData);
    
    if (success) {
        closeEditModal();
    }
}

// Cerrar modal de edición
function closeEditModal() {
    const modal = document.getElementById('editCompanyModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
    
    if (window.companyManager) {
        window.companyManager.currentEditingCompany = null;
    }
}

// Encontrar paleta por colores
function findPaletteByColors(theme) {
    if (!theme) return null;
    
    for (const [id, palette] of Object.entries(COMPANY_COLOR_PALETTES)) {
        if (palette.primary === theme.primary) {
            return id;
        }
    }
    return null;
}

// ======= INICIALIZACIÓN Y COMPATIBILIDAD =======

// Instancia global del Company Manager
let companyManager = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando módulo Company Manager...');
    
    // Crear instancia global
    companyManager = new CompanyManager();
    
    // Hacer disponible globalmente
    window.companyManager = companyManager;
    
    // Vincular eventos del input de nombre para vista previa
    const nameInput = document.getElementById('editCompanyName');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            const previewName = document.getElementById('previewName');
            if (previewName) {
                previewName.textContent = this.value || 'Nombre de Empresa';
            }
        });
    }
    
    console.log('✅ Company Manager listo para usar');
});

// ======= FUNCIONES GLOBALES PARA COMPATIBILIDAD =======

// Funciones que se pueden llamar desde HTML directamente
function toggleCompanyDropdown() {
    if (companyManager) companyManager.toggleDropdown();
}

function selectCompany(companyId) {
    if (companyManager) companyManager.selectCompany(companyId);
}

function updateSelectedCompany(companyId) {
    if (companyManager) companyManager.updateSelectedCompany(companyId);
}

function updateCompanyData(companyId) {
    if (companyManager) companyManager.updateCompanyData(companyId);
}

function getCurrentSelectedCompany() {
    return companyManager ? companyManager.currentSelected : null;
}

function getCompaniesData() {
    return companyManager ? companyManager.getAllCompanies() : {};
}

function updateKPIs(data) {
    if (companyManager) companyManager.updateKPIs(data);
}

function updateSidebar(data) {
    if (companyManager) companyManager.updateSidebar(data);
}

function getCompanyName(companyId) {
    if (!companyManager) return 'Empresa';
    const companies = companyManager.getAllCompanies();
    return companies[companyId]?.name || 'Empresa';
}

function showAddCompanyWizard() {
    console.log('🏗️ Wizard de nueva empresa - Próximamente');
    if (window.aiAssistant) {
        window.aiAssistant.showNotification(
            '🏗️ Wizard de nueva empresa próximamente', 
            'info'
        );
    }
}

console.log('🏢 Company Manager Module cargado');
console.log('✨ Funciones disponibles:');
console.log('  • Gestión completa de empresas');
console.log('  • Selector de empresas dinámico');
console.log('  • Editor de empresas con paletas de colores');
console.log('  • Persistencia de datos en localStorage');
console.log('  • Integración con AI Assistant');
console.log('🚀 ¡Listo para gestionar empresas!');
