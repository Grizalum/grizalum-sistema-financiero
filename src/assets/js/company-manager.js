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
    this.companyThemes = {}; // ← AGREGA ESTA LÍNEA
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
            /* =============== MODAL PROFESIONAL =============== */
.advanced-management-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 50000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.management-modal-content {
    background: white;
    border-radius: 20px;
    width: 95%;
    max-width: 1400px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
    from { opacity: 0; transform: scale(0.9) translateY(-20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

.management-header {
    background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
    color: white;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-modal {
    background: none; border: none;
    color: white; font-size: 2rem;
    cursor: pointer; padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-modal:hover {
    background: rgba(255,255,255,0.2);
    transform: rotate(90deg);
}

.management-tabs {
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.tab-btn {
    flex: 1; padding: 1.5rem;
    border: none; background: none;
    cursor: pointer; font-weight: 600;
    transition: all 0.3s ease;
    font-size: 1rem;
}

.tab-btn.active {
    background: white;
    border-bottom: 4px solid #d4af37;
    color: #d4af37;
}

.management-content {
    padding: 2rem;
    max-height: 75vh;
    overflow-y: auto;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}
/* =============== ESTILOS PREMIUM FUTURISTAS =============== */
.edit-companies-container-premium {
    padding: 0;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    overflow: hidden;
}

.section-header-premium {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(184, 115, 51, 0.05) 100%);
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.section-title {
    font-size: 1.75rem;
    font-weight: 900;
    background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.section-subtitle {
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
}

.section-actions {
    display: flex;
    gap: 1rem;
}

.action-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.action-btn.primary {
    background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.action-btn.secondary {
    background: white;
    color: #64748b;
    border: 2px solid #e2e8f0;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
}

.companies-grid-premium {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.company-edit-card-premium {
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(212, 175, 55, 0.1);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.company-edit-card-premium::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #d4af37 0%, #b87333 50%, #d4af37 100%);
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.company-edit-card-premium:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(212, 175, 55, 0.2);
    border-color: rgba(212, 175, 55, 0.3);
}

.company-card-header {
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
}

.company-avatar-container {
    position: relative;
}

.company-avatar {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    box-shadow: 0 12px 30px rgba(212, 175, 55, 0.3);
    position: relative;
    overflow: hidden;
}

.company-avatar::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    animation: avatarShine 2s infinite;
}

@keyframes avatarShine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.company-status-indicator {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.company-main-info {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.company-name-group, .company-status-group {
    display: flex;
    flex-direction: column;
}

.input-label {
    font-size: 0.875rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.company-input-premium {
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    background: white;
    transition: all 0.3s ease;
    outline: none;
}

.company-input-premium:focus {
    border-color: #d4af37;
    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
    transform: translateY(-1px);
}

.custom-select-wrapper {
    position: relative;
}

.company-select-premium {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    background: white;
    cursor: pointer;
    appearance: none;
    transition: all 0.3s ease;
    outline: none;
}

.company-select-premium:focus {
    border-color: #d4af37;
    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
}

.select-arrow {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
}

.company-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
}

.company-metrics-preview {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.metric-mini {
    text-align: right;
}

.metric-mini-label {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
}

.metric-mini-value {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    color: #1f2937;
}

.save-company-btn-premium {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.875rem 1.75rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.save-company-btn-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.btn-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    animation: btnShine 2s infinite;
}

@keyframes btnShine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.company-card-footer {
    padding: 1.5rem 2rem;
    background: rgba(248, 250, 252, 0.8);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.last-updated {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
}

.quick-actions {
    display: flex;
    gap: 0.5rem;
}

.quick-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: white;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.quick-btn:hover {
    background: #f3f4f6;
    color: #374151;
    transform: scale(1.1);
}

.quick-btn.danger:hover {
    background: #fee2e2;
    color: #dc2626;
}

.bulk-actions-bar {
    background: rgba(212, 175, 55, 0.05);
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.bulk-info {
    color: #6b7280;
    font-weight: 500;
}

.bulk-controls {
    display: flex;
    gap: 1rem;
}

.bulk-btn {
    padding: 0.75rem 1.25rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.bulk-btn:hover {
    border-color: #d4af37;
    color: #d4af37;
    transform: translateY(-1px);
}
/* =============== MÉTRICAS PREMIUM FUTURISTAS =============== */
.metrics-container-premium {
    padding: 0;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    overflow: hidden;
}

.metrics-header-premium {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%);
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.metrics-title {
    font-size: 1.75rem;
    font-weight: 900;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.metrics-subtitle {
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
}

.metrics-tools {
    display: flex;
    gap: 1rem;
}

.tool-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    color: #374151;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.tool-btn:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.metrics-overview {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.5);
}

.overview-stat {
    background: white;
    padding: 1.5rem;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(59, 130, 246, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.overview-stat::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
}

.overview-stat:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(59, 130, 246, 0.15);
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: white;
    position: relative;
}

.stat-icon.total-revenue {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.total-profit {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-icon.avg-margin {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon.companies-count {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-content {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 900;
    color: #1f2937;
    line-height: 1;
}

.stat-desc {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
}

.metrics-companies {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.metrics-card-premium {
    background: white;
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(59, 130, 246, 0.1);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.metrics-card-premium::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%);
    background-size: 300% 100%;
    animation: gradientFlow 4s infinite;
}

@keyframes gradientFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.metrics-card-premium:hover {
    transform: translateY(-6px);
    box-shadow: 0 25px 60px rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
}

.metrics-card-header {
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%);
}

.company-identity {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.company-avatar-metrics {
    width: 70px;
    height: 70px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
}

.company-avatar-metrics::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
    animation: avatarGlow 3s infinite;
}

@keyframes avatarGlow {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
}

.company-name-metrics {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
}

.company-status-badge {
    padding: 0.375rem 0.875rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-operativo {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-regular {
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-crítico {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.metrics-summary {
    display: flex;
    gap: 2rem;
}

.summary-stat {
    text-align: right;
}

.stat-value {
    display: block;
    font-size: 1.25rem;
    font-weight: 900;
    color: #1f2937;
    line-height: 1;
}

.stat-label {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    margin-top: 0.25rem;
}

.metrics-grid {
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
}

.metric-input-group-premium {
    background: rgba(248, 250, 252, 0.8);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.metric-input-group-premium::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.metric-input-group-premium:hover::before {
    opacity: 1;
}

.metric-input-group-premium:hover {
    background: white;
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1);
}

.metric-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.metric-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: white;
}

.revenue-icon {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.expenses-icon {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.profit-icon {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.cashflow-icon {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.metric-info {
    flex: 1;
}

.metric-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.25rem;
}

.metric-description {
    font-size: 0.75rem;
    color: #6b7280;
}

.metric-input-container {
    position: relative;
    margin-bottom: 0.75rem;
}

.currency-symbol {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 700;
    color: #6b7280;
    z-index: 2;
}

.metric-input-premium {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1.125rem;
    font-weight: 700;
    background: white;
    transition: all 0.3s ease;
    outline: none;
}

.metric-input-premium:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
}

.input-decoration {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
    width: 0%;
    transition: width 0.3s ease;
}

.metric-input-premium:focus + .input-decoration {
    width: 100%;
}

.metric-trend {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
}

.trend-positive {
    color: #10b981;
}

.trend-negative {
    color: #ef4444;
}

.trend-text {
    color: #6b7280;
}

.metrics-actions {
    padding: 2rem;
    background: rgba(248, 250, 252, 0.5);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.validation-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #10b981;
    font-size: 0.875rem;
    font-weight: 600;
}

.action-buttons {
    display: flex;
    gap: 1rem;
}

.metrics-btn {
    padding: 0.875rem 1.75rem;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.metrics-btn.secondary {
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
}

.metrics-btn.secondary:hover {
    border-color: #d1d5db;
    color: #374151;
    transform: translateY(-2px);
}

.metrics-btn.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.metrics-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.btn-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    animation: btnGlow 2.5s infinite;
}

@keyframes btnGlow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.metrics-insights {
    padding: 1.5rem 2rem 2rem 2rem;
}

.insight-card {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 12px;
    padding: 1.25rem;
}

.insight-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    color: #8b5cf6;
    font-weight: 700;
    font-size: 0.875rem;
}

.insight-text {
    color: #4b5563;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
}

/* RESPONSIVE PARA MÉTRICAS */
@media (max-width: 1024px) {
    .metrics-overview {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .metrics-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .metrics-overview {
        grid-template-columns: 1fr;
    }
    
    .metrics-header-premium {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .metrics-tools {
        justify-content: center;
    }
}
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
                    <button class="grizalum-btn-add-company" onclick="window.grizalumCompanySelector.showAddCompanyWizard()">
                        <i class="fas fa-plus"></i>
                        Agregar Nueva
                    </button>
                </div>
                
                <div class="grizalum-companies-list" id="grizalumCompaniesList">
                    <!-- Se llena dinámicamente -->
                </div>
                
                <div class="grizalum-dropdown-footer">
                    <button class="grizalum-manage-companies-btn" onclick="window.grizalumCompanySelector.openCompanyManagement()">
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
    const companies = this.companies;
    let companiesHTML = '';
    
    Object.entries(companies).forEach(([id, company]) => {
        const statusColor = {
            'Operativo': '#10b981',
            'Regular': '#f59e0b', 
            'Crítico': '#ef4444'
        }[company.status] || '#6b7280';
        
        companiesHTML += `
            <div class="company-edit-card-premium" data-company="${id}">
                <div class="company-card-header">
                    <div class="company-avatar-container">
                        <div class="company-avatar" style="background: linear-gradient(135deg, ${company.theme?.primary || '#d4af37'} 0%, ${company.theme?.secondary || '#b87333'} 100%);">
                            ${company.icon}
                        </div>
                        <div class="company-status-indicator" style="background: ${statusColor};"></div>
                    </div>
                    
                    <div class="company-main-info">
                        <div class="company-name-group">
                            <label class="input-label">Nombre de la Empresa</label>
                            <input type="text" value="${company.name}" id="name_${id}" class="company-input-premium" placeholder="Ingresa el nombre...">
                        </div>
                        
                        <div class="company-status-group">
                            <label class="input-label">Estado Operativo</label>
                            <div class="custom-select-wrapper">
                                <select id="status_${id}" class="company-select-premium">
                                    <option value="Operativo" ${company.status === 'Operativo' ? 'selected' : ''}>🟢 Totalmente Operativo</option>
                                    <option value="Regular" ${company.status === 'Regular' ? 'selected' : ''}>🟡 Funcionamiento Regular</option>
                                    <option value="Crítico" ${company.status === 'Crítico' ? 'selected' : ''}>🔴 Estado Crítico</option>
                                    <option value="Mantenimiento">🔧 En Mantenimiento</option>
                                    <option value="Expansión">🚀 En Expansión</option>
                                </select>
                                <i class="fas fa-chevron-down select-arrow"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div class="company-actions">
                        <div class="company-metrics-preview">
                            <div class="metric-mini">
                                <span class="metric-mini-label">Flujo</span>
                                <span class="metric-mini-value">S/. ${company.data.cashFlow.toLocaleString()}</span>
                            </div>
                            <div class="metric-mini">
                                <span class="metric-mini-label">Ingresos</span>
                                <span class="metric-mini-value">S/. ${(company.data.revenue/1000000).toFixed(1)}M</span>
                            </div>
                        </div>
                        
                        <button class="save-company-btn-premium" onclick="grizalumCompanySelector.saveCompanyEdit('${id}')">
                            <i class="fas fa-save"></i>
                            <span>Guardar Cambios</span>
                            <div class="btn-shine"></div>
                        </button>
                    </div>
                </div>
                
                <div class="company-card-footer">
                    <div class="last-updated">
                        <i class="fas fa-clock"></i>
                        <span>Última actualización: Hace 2 horas</span>
                    </div>
                    <div class="quick-actions">
                        <button class="quick-btn" onclick="grizalumCompanySelector.duplicateCompany('${id}')" title="Duplicar empresa">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="quick-btn" onclick="grizalumCompanySelector.exportCompanyData('${id}')" title="Exportar datos">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="quick-btn danger" onclick="grizalumCompanySelector.archiveCompany('${id}')" title="Archivar">
                            <i class="fas fa-archive"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="edit-companies-container-premium">
            <div class="section-header-premium">
                <div class="section-title-group">
                    <h3 class="section-title">✏️ Gestión de Empresas</h3>
                    <p class="section-subtitle">Administra la información y configuración de tus empresas</p>
                </div>
                <div class="section-actions">
                    <button class="action-btn secondary" onclick="grizalumCompanySelector.bulkEdit()">
                        <i class="fas fa-edit"></i>
                        Edición Masiva
                    </button>
                    <button class="action-btn primary" onclick="grizalumCompanySelector.addNewCompany()">
                        <i class="fas fa-plus"></i>
                        Nueva Empresa
                    </button>
                </div>
            </div>
            
            <div class="companies-grid-premium">
                ${companiesHTML}
            </div>
            
            <div class="bulk-actions-bar">
                <div class="bulk-info">
                    <span>${Object.keys(companies).length} empresas registradas</span>
                </div>
                <div class="bulk-controls">
                    <button class="bulk-btn" onclick="grizalumCompanySelector.exportAllData()">
                        <i class="fas fa-file-export"></i>
                        Exportar Todo
                    </button>
                    <button class="bulk-btn" onclick="grizalumCompanySelector.backupAll()">
                        <i class="fas fa-shield-alt"></i>
                        Crear Backup
                    </button>
                </div>
            </div>
        </div>
    `;
}

generateMetricsTab() {
    const companies = this.companies;
    let metricsHTML = '';
    
    Object.entries(companies).forEach(([id, company]) => {
        const data = company.data;
        const profitMargin = ((data.profit / data.revenue) * 100).toFixed(1);
        const expenseRatio = ((data.expenses / data.revenue) * 100).toFixed(1);
        
        metricsHTML += `
            <div class="metrics-card-premium" data-company="${id}">
                <div class="metrics-card-header">
                    <div class="company-identity">
                        <div class="company-avatar-metrics" style="background: linear-gradient(135deg, ${company.theme?.primary || '#d4af37'} 0%, ${company.theme?.secondary || '#b87333'} 100%);">
                            ${company.icon}
                        </div>
                        <div class="company-name-info">
                            <h4 class="company-name-metrics">${company.name}</h4>
                            <span class="company-status-badge status-${company.status.toLowerCase()}">${company.status}</span>
                        </div>
                    </div>
                    
                    <div class="metrics-summary">
                        <div class="summary-stat">
                            <span class="stat-value">S/. ${(data.revenue/1000000).toFixed(1)}M</span>
                            <span class="stat-label">Ingresos</span>
                        </div>
                        <div class="summary-stat">
                            <span class="stat-value">${profitMargin}%</span>
                            <span class="stat-label">Margen</span>
                        </div>
                    </div>
                </div>
                
                <div class="metrics-grid">
                    <div class="metric-input-group-premium">
                        <div class="metric-header">
                            <div class="metric-icon revenue-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="metric-info">
                                <label class="metric-label">Ingresos Totales</label>
                                <span class="metric-description">Facturación bruta del período</span>
                            </div>
                        </div>
                        <div class="metric-input-container">
                            <span class="currency-symbol">S/.</span>
                            <input type="number" value="${data.revenue}" id="revenue_${id}" class="metric-input-premium" step="1000" min="0">
                            <div class="input-decoration"></div>
                        </div>
                        <div class="metric-trend">
                            <i class="fas fa-arrow-up trend-positive"></i>
                            <span class="trend-text">+12.5% vs anterior</span>
                        </div>
                    </div>
                    
                    <div class="metric-input-group-premium">
                        <div class="metric-header">
                            <div class="metric-icon expenses-icon">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div class="metric-info">
                                <label class="metric-label">Gastos Operativos</label>
                                <span class="metric-description">Costos y gastos del período</span>
                            </div>
                        </div>
                        <div class="metric-input-container">
                            <span class="currency-symbol">S/.</span>
                            <input type="number" value="${data.expenses}" id="expenses_${id}" class="metric-input-premium" step="1000" min="0">
                            <div class="input-decoration"></div>
                        </div>
                        <div class="metric-trend">
                            <i class="fas fa-arrow-up trend-negative"></i>
                            <span class="trend-text">+3.2% vs anterior</span>
                        </div>
                    </div>
                    
                    <div class="metric-input-group-premium">
                        <div class="metric-header">
                            <div class="metric-icon profit-icon">
                                <i class="fas fa-coins"></i>
                            </div>
                            <div class="metric-info">
                                <label class="metric-label">Utilidad Neta</label>
                                <span class="metric-description">Beneficio después de gastos</span>
                            </div>
                        </div>
                        <div class="metric-input-container">
                            <span class="currency-symbol">S/.</span>
                            <input type="number" value="${data.profit}" id="profit_${id}" class="metric-input-premium" step="1000" min="0">
                            <div class="input-decoration"></div>
                        </div>
                        <div class="metric-trend">
                            <i class="fas fa-arrow-up trend-positive"></i>
                            <span class="trend-text">+18.7% vs anterior</span>
                        </div>
                    </div>
                    
                    <div class="metric-input-group-premium">
                        <div class="metric-header">
                            <div class="metric-icon cashflow-icon">
                                <i class="fas fa-water"></i>
                            </div>
                            <div class="metric-info">
                                <label class="metric-label">Flujo de Caja</label>
                                <span class="metric-description">Liquidez disponible</span>
                            </div>
                        </div>
                        <div class="metric-input-container">
                            <span class="currency-symbol">S/.</span>
                            <input type="number" value="${data.cashFlow}" id="cashFlow_${id}" class="metric-input-premium" step="100" min="0">
                            <div class="input-decoration"></div>
                        </div>
                        <div class="metric-trend">
                            <i class="fas fa-arrow-up trend-positive"></i>
                            <span class="trend-text">+24.8% vs anterior</span>
                        </div>
                    </div>
                </div>
                
                <div class="metrics-actions">
                    <div class="validation-info">
                        <i class="fas fa-shield-check"></i>
                        <span>Datos validados automáticamente</span>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="metrics-btn secondary" onclick="grizalumCompanySelector.resetMetrics('${id}')">
                            <i class="fas fa-undo"></i>
                            Restaurar
                        </button>
                        <button class="metrics-btn primary" onclick="grizalumCompanySelector.saveMetrics('${id}')">
                            <i class="fas fa-save"></i>
                            Actualizar Métricas
                            <div class="btn-glow"></div>
                        </button>
                    </div>
                </div>
                
                <div class="metrics-insights">
                    <div class="insight-card">
                        <div class="insight-header">
                            <i class="fas fa-lightbulb"></i>
                            <span>Análisis IA</span>
                        </div>
                        <p class="insight-text">Rendimiento ${profitMargin > 15 ? 'excelente' : profitMargin > 10 ? 'bueno' : 'mejorable'}. ${expenseRatio < 70 ? 'Gastos controlados.' : 'Revisar estructura de costos.'}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="metrics-container-premium">
            <div class="metrics-header-premium">
                <div class="header-content">
                    <h3 class="metrics-title">📊 Centro de Métricas Financieras</h3>
                    <p class="metrics-subtitle">Gestiona y monitorea el rendimiento financiero de todas tus empresas</p>
                </div>
                <div class="metrics-tools">
                    <button class="tool-btn" onclick="grizalumCompanySelector.generateReport()">
                        <i class="fas fa-chart-bar"></i>
                        Generar Reporte
                    </button>
                    <button class="tool-btn" onclick="grizalumCompanySelector.exportMetrics()">
                        <i class="fas fa-file-excel"></i>
                        Exportar Excel
                    </button>
                    <button class="tool-btn" onclick="grizalumCompanySelector.compareMetrics()">
                        <i class="fas fa-balance-scale"></i>
                        Comparar
                    </button>
                </div>
            </div>
            
            <div class="metrics-overview">
                <div class="overview-stat">
                    <div class="stat-icon total-revenue">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-number">S/. ${(Object.values(companies).reduce((sum, c) => sum + c.data.revenue, 0)/1000000).toFixed(1)}M</span>
                        <span class="stat-desc">Ingresos Totales</span>
                    </div>
                </div>
                <div class="overview-stat">
                    <div class="stat-icon total-profit">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-number">S/. ${(Object.values(companies).reduce((sum, c) => sum + c.data.profit, 0)/1000000).toFixed(1)}M</span>
                        <span class="stat-desc">Utilidad Total</span>
                    </div>
                </div>
                <div class="overview-stat">
                    <div class="stat-icon avg-margin">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-number">${(Object.values(companies).reduce((sum, c) => sum + (c.data.profit/c.data.revenue)*100, 0)/Object.keys(companies).length).toFixed(1)}%</span>
                        <span class="stat-desc">Margen Promedio</span>
                    </div>
                </div>
                <div class="overview-stat">
                    <div class="stat-icon companies-count">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-number">${Object.keys(companies).length}</span>
                        <span class="stat-desc">Empresas Activas</span>
                    </div>
                </div>
            </div>
            
            <div class="metrics-companies">
                ${metricsHTML}
            </div>
        </div>
    `;
}
    generateThemesTab() {
    const companies = this.companies;
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
            const isSelected = '';
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
    const companies = this.companies;
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
