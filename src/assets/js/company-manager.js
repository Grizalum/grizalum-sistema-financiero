/**
 * ================================================================
 * GRIZALUM COMPANY SELECTOR - SISTEMA MODULAR
 * Selector de empresas con dropdown premium y z-index corregido
 * ================================================================
 */

class GrizalumCompanySelector {
    constructor() {
        this.companies = this.loadCompaniesData();
        this.selectedCompany = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        try {
            this.createCompanySelectorStyles();
            this.renderCompanySelector();
            this.setupEventListeners();
            this.selectFirstCompany();
            this.isInitialized = true;
            
            console.log('🏢 GRIZALUM Company Selector inicializado');
            console.log(`📊 ${Object.keys(this.companies).length} empresas cargadas`);
        } catch (error) {
            console.error('❌ Error inicializando Company Selector:', error);
        }
    }

    // ======= ESTILOS PREMIUM CON Z-INDEX CORREGIDO =======
    createCompanySelectorStyles() {
        const styleId = 'grizalum-company-selector-styles';
        let existingStyle = document.getElementById(styleId);
        
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* =============================================== */
            /* GRIZALUM COMPANY SELECTOR - ESTILOS PREMIUM   */
            /* =============================================== */
            
            .grizalum-company-selector {
                position: relative;
                min-width: 280px;
                z-index: 1000;
            }

            .grizalum-selected-company {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(184, 115, 51, 0.1) 100%);
                border: 2px solid rgba(212, 175, 55, 0.3);
                border-radius: 16px;
                padding: 1rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                position: relative;
                z-index: 1001;
            }

            .grizalum-selected-company:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
                border-color: rgba(212, 175, 55, 0.5);
            }

            .grizalum-company-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .grizalum-company-icon {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
                transition: all 0.3s ease;
            }

            .grizalum-company-details {
                display: flex;
                flex-direction: column;
            }

            .grizalum-company-name {
                font-size: 1rem;
                font-weight: 700;
                color: var(--gray-800, #1f2937);
                margin-bottom: 0.25rem;
            }

            .grizalum-company-status {
                font-size: 0.8rem;
                font-weight: 500;
                color: var(--gray-600, #4b5563);
            }

            .grizalum-dropdown-arrow {
                color: var(--gray-600, #4b5563);
                transition: transform 0.3s ease;
                font-size: 1.2rem;
            }

            .grizalum-dropdown-arrow.rotate {
                transform: rotate(180deg);
            }

            /* =============== DROPDOWN CON Z-INDEX CORREGIDO =============== */
            .grizalum-company-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                width: 350px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                border: 1px solid rgba(212, 175, 55, 0.2);
                z-index: 10000;
                will-change: transform, opacity;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-15px);
                transition: all 0.15s ease-in-out;
                backdrop-filter: blur(30px);
                overflow: hidden;
            }

            .grizalum-company-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(5px);
            }

            .grizalum-dropdown-header {
                padding: 1.5rem;
                border-bottom: 1px solid rgba(212, 175, 55, 0.1);
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(184, 115, 51, 0.02) 100%);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .grizalum-dropdown-header h4 {
                margin: 0;
                color: var(--gray-800, #1f2937);
                font-size: 1.1rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .grizalum-btn-add-company {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }

            .grizalum-btn-add-company:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
            }

            .grizalum-companies-list {
                max-height: 320px;
                overflow-y: auto;
                padding: 0.5rem;
            }

            .grizalum-company-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 0.25rem;
                position: relative;
            }

            .grizalum-company-item:hover {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(184, 115, 51, 0.04) 100%);
                transform: translateX(8px);
                border-left: 3px solid #d4af37;
            }

            .grizalum-company-item.active {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 115, 51, 0.08) 100%);
                border: 1px solid rgba(212, 175, 55, 0.3);
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
                border-left: 4px solid #d4af37;
            }

            .grizalum-company-item-icon {
                width: 42px;
                height: 42px;
                background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .grizalum-company-item:hover .grizalum-company-item-icon {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
                transform: scale(1.1);
            }

            .grizalum-company-item-info {
                flex: 1;
            }

            .grizalum-company-item-name {
                font-weight: 600;
                color: var(--gray-800, #1f2937);
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
            }

            .grizalum-company-item-stats {
                font-size: 0.8rem;
                color: var(--gray-600, #4b5563);
            }

            .grizalum-company-item-status {
                font-size: 1.2rem;
                opacity: 0.8;
                transition: all 0.3s ease;
            }

            .grizalum-company-item:hover .grizalum-company-item-status {
                opacity: 1;
                transform: scale(1.1);
            }

            .grizalum-dropdown-footer {
                padding: 1.5rem;
                border-top: 1px solid rgba(212, 175, 55, 0.1);
                background: linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.6) 100%);
                text-align: center;
            }

            .grizalum-manage-companies-btn {
                background: linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.05) 100%);
                color: var(--gray-700, #374151);
                border: 1px solid rgba(212, 175, 55, 0.2);
                padding: 0.75rem 1.5rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .grizalum-manage-companies-btn:hover {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
            }

            .grizalum-total-companies {
                font-weight: 700;
                color: var(--gray-800, #1f2937);
                font-size: 0.9rem;
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            /* =============== SCROLLBAR PREMIUM =============== */
            .grizalum-companies-list::-webkit-scrollbar {
                width: 6px;
            }

            .grizalum-companies-list::-webkit-scrollbar-track {
                background: rgba(212, 175, 55, 0.1);
                border-radius: 10px;
            }

            .grizalum-companies-list::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                border-radius: 10px;
            }

            .grizalum-companies-list::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #b87333 0%, #a0691f 100%);
            }

            /* =============== RESPONSIVE =============== */
            @media (max-width: 768px) {
                .grizalum-company-selector {
                    min-width: 250px;
                }
                
                .grizalum-company-dropdown {
                    width: 300px;
                    right: -25px;
                }
            }

            /* =============== ANIMACIONES PREMIUM =============== */
            @keyframes companyItemSlide {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .grizalum-company-item {
                animation: companyItemSlide 0.3s ease forwards;
            }

            .grizalum-company-item:nth-child(1) { animation-delay: 0.1s; }
            .grizalum-company-item:nth-child(2) { animation-delay: 0.2s; }
            .grizalum-company-item:nth-child(3) { animation-delay: 0.3s; }
            .grizalum-company-item:nth-child(4) { animation-delay: 0.4s; }
            .grizalum-company-item:nth-child(5) { animation-delay: 0.5s; }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 Estilos del Company Selector creados');
    }
    // ======= DATOS DE EMPRESAS =======
    loadCompaniesData() {
        const saved = localStorage.getItem('grizalum_companies');
        if (saved) {
            return JSON.parse(saved);
        }
        
        const defaultCompanies = {
            'fundicion-laguna': {
                name: 'Fundición Laguna',
                icon: '🔥',
                status: 'Operativo',
                theme: { primary: '#dc2626', secondary: '#ea580c' },
                data: { cashFlow: 24500, revenue: 2847293, expenses: 1892847, profit: 954446 }
            },
            'fundicion-joel': {
                name: 'Fundición Joel',
                icon: '🔥',
                status: 'Operativo',
                theme: { primary: '#ea580c', secondary: '#f97316' },
                data: { cashFlow: 18300, revenue: 2100000, expenses: 1400000, profit: 700000 }
            },
            'avicola-san-juan': {
                name: 'Avícola San Juan',
                icon: '🐔',
                status: 'Operativo',
                theme: { primary: '#059669', secondary: '#10b981' },
                data: { cashFlow: 32100, revenue: 3200000, expenses: 2100000, profit: 1100000 }
            },
            'import-lm': {
                name: 'Import LM',
                icon: '📦',
                status: 'Operativo',
                theme: { primary: '#8b5cf6', secondary: '#a78bfa' },
                data: { cashFlow: 45200, revenue: 4500000, expenses: 2800000, profit: 1700000 }
            },
            'bodega-central': {
                name: 'Bodega Central',
                icon: '🏪',
                status: 'Regular',
                theme: { primary: '#3b82f6', secondary: '#60a5fa' },
                data: { cashFlow: 15800, revenue: 1800000, expenses: 1200000, profit: 600000 }
            }
        };
        
        this.saveCompaniesData(defaultCompanies);
        return defaultCompanies;
    }

    saveCompaniesData(companies) {
        localStorage.setItem('grizalum_companies', JSON.stringify(companies));
    }

    // ======= RENDERIZAR SELECTOR =======
    renderCompanySelector() {
        const container = document.getElementById('companySelector');
        if (!container) {
            console.error('❌ Contenedor #companySelector no encontrado');
            return;
        }

        container.innerHTML = `
            <div class="grizalum-selected-company" onclick="grizalumCompanySelector.toggleDropdown()">
                <div class="grizalum-company-info">
                    <div class="grizalum-company-icon" id="grizalumCurrentCompanyIcon">🔥</div>
                    <div class="grizalum-company-details">
                        <div class="grizalum-company-name" id="grizalumCurrentCompanyName">Fundición Laguna</div>
                        <div class="grizalum-company-status" id="grizalumCurrentCompanyStatus">🟢 Operativo</div>
                    </div>
                </div>
                <div class="grizalum-dropdown-arrow" id="grizalumDropdownArrow">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>

            <div class="grizalum-company-dropdown" id="grizalumCompanyDropdown">
                <div class="grizalum-dropdown-header">
                    <h4>🏢 Empresas GRIZALUM</h4>
                    <button class="grizalum-btn-add-company" onclick="grizalumCompanySelector.showAddCompanyWizard()">
                        <i class="fas fa-plus"></i>
                        Agregar Nueva
                    </button>
                </div>
                
                <div class="grizalum-companies-list" id="grizalumCompaniesList">
                    <!-- Se llena dinámicamente -->
                </div>
                
                <div class="grizalum-dropdown-footer">
                    <button class="grizalum-manage-companies-btn" onclick="grizalumCompanySelector.openCompanyManagement()">
                        <i class="fas fa-cog"></i>
                        Gestionar Empresas
                    </button>
                    <div class="grizalum-total-companies">
                        📊 Total Holding: S/. 135,900
                    </div>
                </div>
            </div>
        `;

        this.renderCompaniesList();
    }

    renderCompaniesList() {
        const companiesList = document.getElementById('grizalumCompaniesList');
        if (!companiesList) return;

        companiesList.innerHTML = '';
        
        Object.entries(this.companies).forEach(([id, company]) => {
            const item = document.createElement('div');
            item.className = 'grizalum-company-item';
            item.dataset.company = id;
            item.onclick = () => this.selectCompany(id);
            
            item.innerHTML = `
                <div class="grizalum-company-item-icon">${company.icon}</div>
                <div class="grizalum-company-item-info">
                    <div class="grizalum-company-item-name">${company.name}</div>
                    <div class="grizalum-company-item-stats">Flujo: S/. ${company.data.cashFlow.toLocaleString()}</div>
                </div>
                <div class="grizalum-company-item-status">${company.status === 'Operativo' ? '🟢' : company.status === 'Regular' ? '🟡' : '🔴'}</div>
            `;
            
            companiesList.appendChild(item);
        });
    }

    // ======= FUNCIONALIDAD =======
    toggleDropdown() {
        const dropdown = document.getElementById('grizalumCompanyDropdown');
        const arrow = document.getElementById('grizalumDropdownArrow');
        
        dropdown.classList.toggle('show');
        arrow.classList.toggle('rotate');
    }

    selectCompany(companyId) {
        this.selectedCompany = companyId;
        this.updateSelectedCompany(companyId);
        this.updateCompanyData(companyId);
        this.toggleDropdown();
        
        // Integración con theme manager
        if (window.applyCompanyThemeIntegration) {
            window.applyCompanyThemeIntegration(companyId);
        }
        
        this.showNotification(`🏢 Cambiado a ${this.companies[companyId].name}`, 'success');
        
        // Disparar evento personalizado
        this.dispatchCompanyChangeEvent(companyId);
    }

    updateSelectedCompany(companyId) {
        const company = this.companies[companyId];
        if (!company) return;

        document.getElementById('grizalumCurrentCompanyIcon').textContent = company.icon;
        document.getElementById('grizalumCurrentCompanyName').textContent = company.name;
        document.getElementById('grizalumCurrentCompanyStatus').textContent = `🟢 ${company.status}`;
        
        // Actualizar estados activos
        document.querySelectorAll('.grizalum-company-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-company="${companyId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    updateCompanyData(companyId) {
        const company = this.companies[companyId];
        if (!company) return;

        // Actualizar KPIs si las funciones existen
        if (window.updateKPIs) {
            window.updateKPIs(company.data);
        }
        if (window.updateSidebar) {
            window.updateSidebar(company.data);
        }
        
        console.log(`📊 Datos actualizados para: ${company.name}`);
    }

    selectFirstCompany() {
        const firstCompanyId = Object.keys(this.companies)[0];
        if (firstCompanyId) {
            this.selectCompany(firstCompanyId);
        }
    }

    // ======= EVENT LISTENERS =======
    setupEventListeners() {
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (event) => {
            const selector = document.getElementById('companySelector');
            const dropdown = document.getElementById('grizalumCompanyDropdown');
            
            if (selector && !selector.contains(event.target)) {
                dropdown.classList.remove('show');
                document.getElementById('grizalumDropdownArrow').classList.remove('rotate');
            }
        });
    }

    // ======= UTILIDADES =======
    showNotification(message, type = 'info') {
        console.log(`${type === 'success' ? '✅' : '📢'} ${message}`);
        // Aquí puedes integrar con un sistema de notificaciones
    }

    dispatchCompanyChangeEvent(companyId) {
        const event = new CustomEvent('grizalumCompanyChanged', {
            detail: { 
                companyId, 
                company: this.companies[companyId],
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    // ======= FUNCIONES PLACEHOLDER =======
    showAddCompanyWizard() {
        console.log('🚀 Abrir wizard para agregar empresa');
        this.showNotification('🚀 Wizard para agregar empresa próximamente', 'info');
    }

   openCompanyManagement() {
    this.createAdvancedManagementModal();
}

createAdvancedManagementModal() {
    // Crear modal profesional
    const modal = document.createElement('div');
    modal.id = 'advancedManagementModal';
    modal.className = 'advanced-management-modal';
    
    modal.innerHTML = `
        <div class="management-modal-content">
            <div class="management-header">
                <h2>🏢 Gestión Avanzada de Empresas</h2>
                <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            
            <div class="management-tabs">
                <button class="tab-btn active" onclick="grizalumCompanySelector.showTab('edit')">📝 Editar</button>
                <button class="tab-btn" onclick="grizalumCompanySelector.showTab('metrics')">📊 Métricas</button>
                <button class="tab-btn" onclick="grizalumCompanySelector.showTab('themes')">🎨 Temas</button>
                <button class="tab-btn" onclick="grizalumCompanySelector.showTab('danger')">⚠️ Zona Peligrosa</button>
            </div>
            
            <div class="management-content">
                <div id="edit-tab" class="tab-content active">
                    ${this.generateEditTab()}
                </div>
                <div id="metrics-tab" class="tab-content">
                    ${this.generateMetricsTab()}
                </div>
                <div id="themes-tab" class="tab-content">
                    ${this.generateThemesTab()}
                </div>
                <div id="danger-tab" class="tab-content">
                    ${this.generateDangerTab()}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}
    generateEditTab() {
    const companies = this.getAllCompanies();
    let companiesHTML = '';
    
    Object.entries(companies).forEach(([id, company]) => {
        companiesHTML += `
            <div class="company-edit-card">
                <div class="company-edit-header">
                    <span class="company-icon">${company.icon}</span>
                    <div class="company-info">
                        <input type="text" value="${company.name}" id="name_${id}" class="company-name-input">
                        <select id="status_${id}" class="company-status-select">
                            <option value="Operativo" ${company.status === 'Operativo' ? 'selected' : ''}>🟢 Operativo</option>
                            <option value="Regular" ${company.status === 'Regular' ? 'selected' : ''}>🟡 Regular</option>
                            <option value="Crítico" ${company.status === 'Crítico' ? 'selected' : ''}>🔴 Crítico</option>
                        </select>
                    </div>
                    <button class="save-company-btn" onclick="grizalumCompanySelector.saveCompanyEdit('${id}')">
                        💾 Guardar
                    </button>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="edit-companies-container">
            <h3>📝 Editar Información de Empresas</h3>
            <p class="edit-description">Modifica los nombres y estados de tus empresas</p>
            ${companiesHTML}
        </div>
    `;
}

generateMetricsTab() {
    const companies = this.getAllCompanies();
    let metricsHTML = '';
    
    Object.entries(companies).forEach(([id, company]) => {
        const data = company.data;
        metricsHTML += `
            <div class="metrics-edit-card">
                <h4>${company.icon} ${company.name}</h4>
                <div class="metrics-grid-edit">
                    <div class="metric-input-group">
                        <label>💰 Flujo de Caja</label>
                        <input type="number" value="${data.cashFlow}" id="cashFlow_${id}" class="metric-input">
                    </div>
                    <div class="metric-input-group">
                        <label>📈 Ingresos</label>
                        <input type="number" value="${data.revenue}" id="revenue_${id}" class="metric-input">
                    </div>
                    <div class="metric-input-group">
                        <label>📉 Gastos</label>
                        <input type="number" value="${data.expenses}" id="expenses_${id}" class="metric-input">
                    </div>
                    <div class="metric-input-group">
                        <label>💎 Utilidad</label>
                        <input type="number" value="${data.profit}" id="profit_${id}" class="metric-input">
                    </div>
                </div>
                <button class="save-metrics-btn" onclick="grizalumCompanySelector.saveMetrics('${id}')">
                    📊 Actualizar Métricas
                </button>
            </div>
        `;
    });
    
    return `
        <div class="metrics-companies-container">
            <h3>📊 Gestión de Métricas Financieras</h3>
            <p class="metrics-description">Actualiza los datos financieros de cada empresa</p>
            ${metricsHTML}
        </div>
    `;
}
    generateThemesTab() {
    const companies = this.getAllCompanies();
    const availableThemes = [
        { key: 'goldman-platinum', name: '🏦 Goldman Platinum', color: '#d4af37' },
        { key: 'tesla-futuristic', name: '🚀 Tesla Futuristic', color: '#ff0040' },
        { key: 'cupertino-elite', name: '🍎 Cupertino Elite', color: '#007aff' },
        { key: 'netflix-premium', name: '🔴 Netflix Premium', color: '#e50914' },
        { key: 'midnight-corporate', name: '💎 Midnight Corporate', color: '#00d9ff' },
        { key: 'executive-dark', name: '🖤 Executive Dark', color: '#6b7280' }
    ];
    
    let themesHTML = '';
    
    Object.entries(companies).forEach(([id, company]) => {
        let themeOptions = '';
        availableThemes.forEach(theme => {
            const isSelected = this.companyThemes[id] === theme.key ? 'selected' : '';
            themeOptions += `<option value="${theme.key}" ${isSelected}>${theme.name}</option>`;
        });
        
        themesHTML += `
            <div class="theme-edit-card">
                <div class="theme-preview" style="background: linear-gradient(135deg, ${company.theme?.primary || '#d4af37'} 0%, ${company.theme?.secondary || '#b87333'} 100%);">
                    <span class="company-icon-large">${company.icon}</span>
                </div>
                <div class="theme-controls">
                    <h4>${company.name}</h4>
                    <select id="theme_${id}" class="theme-selector" onchange="grizalumCompanySelector.previewTheme('${id}', this.value)">
                        ${themeOptions}
                    </select>
                    <button class="apply-theme-btn" onclick="grizalumCompanySelector.applyTheme('${id}')">
                        🎨 Aplicar Tema
                    </button>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="themes-companies-container">
            <h3>🎨 Gestión de Temas Visuales</h3>
            <p class="themes-description">Personaliza la apariencia visual de cada empresa</p>
            <div class="themes-grid">
                ${themesHTML}
            </div>
        </div>
    `;
}

generateDangerTab() {
    const companies = this.getAllCompanies();
    let dangerHTML = '';
    
    Object.entries(companies).forEach(([id, company]) => {
        dangerHTML += `
            <div class="danger-company-card">
                <div class="company-danger-info">
                    <span class="company-icon">${company.icon}</span>
                    <div>
                        <h4>${company.name}</h4>
                        <p>Status: ${company.status}</p>
                    </div>
                </div>
                <button class="delete-company-btn" onclick="grizalumCompanySelector.confirmDelete('${id}', '${company.name}')">
                    🗑️ ELIMINAR
                </button>
            </div>
        `;
    });
    
    return `
        <div class="danger-zone-container">
            <div class="danger-warning">
                <h3>⚠️ ZONA PELIGROSA</h3>
                <p>⚠️ Las acciones aquí son <strong>IRREVERSIBLES</strong></p>
                <p>🔐 Se requiere contraseña de administrador para eliminar empresas</p>
            </div>
            
            <div class="backup-section">
                <h4>💾 Backup de Seguridad</h4>
                <button class="backup-btn" onclick="grizalumCompanySelector.downloadBackup()">
                    📦 Descargar Backup Completo
                </button>
                <button class="restore-btn" onclick="grizalumCompanySelector.showRestoreOption()">
                    🔄 Restaurar desde Backup
                </button>
            </div>
            
            <div class="delete-section">
                <h4>🗑️ Eliminar Empresas</h4>
                ${dangerHTML}
            </div>
        </div>
    `;
}
    // ======= FUNCIONES DE ACCIÓN =======

showTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar pestaña seleccionada
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

saveCompanyEdit(companyId) {
    const newName = document.getElementById(`name_${companyId}`).value;
    const newStatus = document.getElementById(`status_${companyId}`).value;
    
    if (!newName.trim()) {
        this.showNotification('❌ El nombre no puede estar vacío', 'error');
        return;
    }
    
    // Actualizar empresa
    this.companies[companyId].name = newName.trim();
    this.companies[companyId].status = newStatus;
    
    this.saveCompaniesData(this.companies);
    this.renderCompaniesList();
    
    this.showNotification(`✅ ${newName} actualizada correctamente`, 'success');
}

saveMetrics(companyId) {
    const cashFlow = parseInt(document.getElementById(`cashFlow_${companyId}`).value) || 0;
    const revenue = parseInt(document.getElementById(`revenue_${companyId}`).value) || 0;
    const expenses = parseInt(document.getElementById(`expenses_${companyId}`).value) || 0;
    const profit = parseInt(document.getElementById(`profit_${companyId}`).value) || 0;
    
    // Validaciones
    if (cashFlow < 0 || revenue < 0 || expenses < 0) {
        this.showNotification('❌ Los valores no pueden ser negativos', 'error');
        return;
    }
    
    // Actualizar métricas
    this.companies[companyId].data = {
        cashFlow: cashFlow,
        revenue: revenue,
        expenses: expenses,
        profit: profit
    };
    
    this.saveCompaniesData(this.companies);
    this.updateSidebar(this.companies[companyId].data);
    
    this.showNotification(`📊 Métricas de ${this.companies[companyId].name} actualizadas`, 'success');
}

confirmDelete(companyId, companyName) {
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    modal.innerHTML = `
        <div class="delete-modal-content">
            <h3>🚨 CONFIRMAR ELIMINACIÓN</h3>
            <p>Vas a eliminar: <strong>${companyName}</strong></p>
            <p>⚠️ Esta acción es <strong>IRREVERSIBLE</strong></p>
            
            <div class="password-section">
                <label>🔐 Contraseña de Administrador:</label>
                <input type="password" id="adminPassword" placeholder="Ingresa la contraseña">
            </div>
            
            <div class="delete-actions">
                <button class="cancel-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                    ❌ Cancelar
                </button>
                <button class="confirm-delete-btn" onclick="grizalumCompanySelector.executeDelete('${companyId}', '${companyName}')">
                    🗑️ ELIMINAR DEFINITIVAMENTE
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}
    executeDelete(companyId, companyName) {
    const password = document.getElementById('adminPassword').value;
    
    // Verificar contraseña
    if (password !== 'Joelgty123456') {
        this.showNotification('❌ Contraseña incorrecta', 'error');
        return;
    }
    
    // Eliminar empresa
    delete this.companies[companyId];
    this.saveCompaniesData(this.companies);
    
    // Cerrar modales
    document.querySelectorAll('.delete-confirmation-modal, .advanced-management-modal').forEach(modal => {
        modal.remove();
    });
    
    // Actualizar lista
    this.renderCompaniesList();
    this.selectFirstCompany();
    
    this.showNotification(`🗑️ ${companyName} eliminada correctamente`, 'success');
}

downloadBackup() {
    const backup = {
        companies: this.companies,
        companyThemes: this.companyThemes,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grizalum-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showNotification('💾 Backup descargado correctamente', 'success');
}

    // ======= API PÚBLICA =======
    getSelectedCompany() {
        return {
            id: this.selectedCompany,
            data: this.companies[this.selectedCompany]
        };
    }

    getAllCompanies() {
        return this.companies;
    }

    addCompany(id, companyData) {
        this.companies[id] = companyData;
        this.saveCompaniesData(this.companies);
        this.renderCompaniesList();
        console.log(`✅ Empresa agregada: ${companyData.name}`);
    }

    removeCompany(id) {
        if (this.companies[id]) {
            delete this.companies[id];
            this.saveCompaniesData(this.companies);
            this.renderCompaniesList();
            console.log(`❌ Empresa eliminada: ${id}`);
        }
    }
}

// ======= INICIALIZACIÓN GLOBAL =======
let grizalumCompanySelector = null;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {      
    console.log('🏢 Inicializando GRIZALUM Company Selector...');
    
    try {
        grizalumCompanySelector = new GrizalumCompanySelector();
        window.grizalumCompanySelector = grizalumCompanySelector;
        
        // Listener para eventos de cambio de empresa
        document.addEventListener('grizalumCompanyChanged', function(event) {
            console.log('🏢 Empresa cambiada:', event.detail);
        });
        
        console.log('✅ GRIZALUM Company Selector cargado exitosamente');
        
    } catch (error) {
        console.error('❌ Error inicializando Company Selector:', error);
    }
    }, 100);  // ← CAMBIA ESTA LÍNEA
});

// ======= FUNCIONES GLOBALES PARA COMPATIBILIDAD =======
function toggleCompanyDropdown() {
    if (window.grizalumCompanySelector) {
        window.grizalumCompanySelector.toggleDropdown();
    }
}

function selectCompany(companyId) {
    if (window.grizalumCompanySelector) {
        window.grizalumCompanySelector.selectCompany(companyId);
    }
}

// ======= EXPORTAR PARA USO AVANZADO =======
window.GrizalumCompanySelector = GrizalumCompanySelector;

console.log(`
🏢 ===================================================
   GRIZALUM COMPANY SELECTOR - SISTEMA MODULAR
🏢 ===================================================

✨ CARACTERÍSTICAS:
   • Z-Index corregido (10000) - siempre visible
   • Estilos premium con gradientes dorados
   • Animaciones suaves y profesionales
   • Sistema modular independiente
   • API completa para gestión de empresas
   • Integración automática con Theme Manager
   • Responsive y optimizado

🛠️ USO:
   • Cambio: grizalumCompanySelector.selectCompany('id')
   • Agregar: grizalumCompanySelector.addCompany(id, data)
   • Obtener: grizalumCompanySelector.getSelectedCompany()

🏢 ===================================================
`);
