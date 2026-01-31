/**
 * ═══════════════════════════════════════════════════════════════════
 * MODAL COMPARACIÓN DE PERÍODOS - VERSIÓN CORREGIDA
 * Sin conflictos de CSS - Funciona de inmediato
 * v1.1.0 - GRIZALUM
 * ═══════════════════════════════════════════════════════════════════
 */

class ModalComparacionPeriodos {
    constructor() {
        this.version = '1.1.0';
        this.modal = null;
        this.periodoA = null;
        this.periodoB = null;
        this.resultadosA = null;
        this.resultadosB = null;
        
        this._inicializar();
    }
    
    _inicializar() {
        this._crearModal();
        this._inyectarEstilosCorregidos();
        this._configurarEventos();
        console.log('✅ Modal Comparación v1.1.0 inicializado');
    }
    
    _crearModal() {
        const htmlModal = `
            <div id="modalComparacionPeriodos" class="griz-modal-comparacion" style="display: none;">
                <div class="griz-modal-overlay"></div>
                <div class="griz-modal-contenedor">
                    <!-- Encabezado -->
                    <div class="griz-modal-header">
                        <h3>📊 Comparación de Períodos</h3>
                        <button class="griz-modal-close" id="btnCerrarComparacion">&times;</button>
                    </div>
                    
                    <!-- Cuerpo -->
                    <div class="griz-modal-body">
                        <!-- Selector -->
                        <div id="seccionSelector" class="griz-selector-section">
                            <div class="griz-section-title">
                                <span class="griz-step-number">1</span>
                                <h4>Selecciona los períodos a comparar</h4>
                            </div>
                            
                            <div class="griz-period-grid">
                                <div class="griz-period-col">
                                    <label>📅 Período A (Base):</label>
                                    <select id="selectPeriodoA" class="griz-select">
                                        <option value="">Seleccionar...</option>
                                        <option value="mes-actual">Mes Actual</option>
                                        <option value="mes-anterior">Mes Anterior</option>
                                        <option value="trimestre-actual">Trimestre Actual</option>
                                        <option value="trimestre-anterior">Trimestre Anterior</option>
                                        <option value="año-actual">Año Actual</option>
                                        <option value="año-anterior">Año Anterior</option>
                                    </select>
                                    <div id="infoA" class="griz-info"></div>
                                </div>
                                
                                <div class="griz-vs">VS</div>
                                
                                <div class="griz-period-col">
                                    <label>📅 Período B (Comparar):</label>
                                    <select id="selectPeriodoB" class="griz-select">
                                        <option value="">Seleccionar...</option>
                                        <option value="mes-actual">Mes Actual</option>
                                        <option value="mes-anterior">Mes Anterior</option>
                                        <option value="trimestre-actual">Trimestre Actual</option>
                                        <option value="trimestre-anterior">Trimestre Anterior</option>
                                        <option value="año-actual">Año Actual</option>
                                        <option value="año-anterior">Año Anterior</option>
                                    </select>
                                    <div id="infoB" class="griz-info"></div>
                                </div>
                            </div>
                            
                            <button id="btnComparar" class="griz-btn-primary" disabled>
                                🔍 Comparar Períodos
                            </button>
                        </div>
                        
                        <!-- Resultados -->
                        <div id="seccionResultados" class="griz-results-section" style="display: none;">
                            <div class="griz-section-title">
                                <span class="griz-step-number">2</span>
                                <h4>Resultados</h4>
                            </div>
                            
                            <div id="contenidoResultados"></div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="griz-modal-footer">
                        <button id="btnVolver" class="griz-btn-secondary" style="display: none;">← Volver</button>
                        <button id="btnCerrar" class="griz-btn-secondary">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', htmlModal);
        this.modal = document.getElementById('modalComparacionPeriodos');
    }
    
    _inyectarEstilosCorregidos() {
        if (document.getElementById('grizModalComparacionEstilos')) return;
        
        const style = document.createElement('style');
        style.id = 'grizModalComparacionEstilos';
        style.textContent = `
            /* Modal Principal */
            .griz-modal-comparacion {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 999999999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .griz-modal-overlay {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: rgba(0, 0, 0, 0.7) !important;
                z-index: 1 !important;
            }
            
            .griz-modal-contenedor {
                position: relative !important;
                z-index: 2 !important;
                background: white !important;
                border-radius: 16px !important;
                width: 1000px !important;
                max-width: 95% !important;
                max-height: 90vh !important;
                display: flex !important;
                flex-direction: column !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
                animation: slideIn 0.3s ease !important;
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            
            /* Header */
            .griz-modal-header {
                padding: 24px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                border-radius: 16px 16px 0 0 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
            }
            
            .griz-modal-header h3 {
                margin: 0 !important;
                font-size: 22px !important;
                font-weight: 700 !important;
            }
            
            .griz-modal-close {
                background: rgba(255,255,255,0.2) !important;
                border: none !important;
                color: white !important;
                width: 40px !important;
                height: 40px !important;
                border-radius: 8px !important;
                font-size: 32px !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                line-height: 1 !important;
                transition: all 0.2s !important;
            }
            
            .griz-modal-close:hover {
                background: rgba(255,255,255,0.3) !important;
                transform: rotate(90deg) !important;
            }
            
            /* Body */
            .griz-modal-body {
                padding: 32px !important;
                overflow-y: auto !important;
                flex: 1 !important;
            }
            
            .griz-section-title {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                margin-bottom: 24px !important;
            }
            
            .griz-step-number {
                width: 32px !important;
                height: 32px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: 700 !important;
                font-size: 16px !important;
            }
            
            .griz-section-title h4 {
                margin: 0 !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                color: #1f2937 !important;
            }
            
            /* Selector de períodos */
            .griz-period-grid {
                display: grid !important;
                grid-template-columns: 1fr auto 1fr !important;
                gap: 24px !important;
                margin-bottom: 24px !important;
            }
            
            .griz-period-col {
                display: flex !important;
                flex-direction: column !important;
                gap: 8px !important;
            }
            
            .griz-period-col label {
                font-weight: 600 !important;
                color: #374151 !important;
                font-size: 14px !important;
            }
            
            .griz-select {
                padding: 12px 16px !important;
                border: 2px solid #e5e7eb !important;
                border-radius: 8px !important;
                font-size: 14px !important;
                color: #1f2937 !important;
                background: white !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            
            .griz-select:focus {
                outline: none !important;
                border-color: #667eea !important;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            }
            
            .griz-info {
                font-size: 12px !important;
                color: #6b7280 !important;
                padding: 8px 12px !important;
                background: #f3f4f6 !important;
                border-radius: 6px !important;
                min-height: 34px !important;
            }
            
            .griz-vs {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding-top: 32px !important;
                font-size: 24px !important;
                font-weight: 900 !important;
                color: #667eea !important;
            }
            
            .griz-btn-primary {
                width: 100% !important;
                padding: 16px 24px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                border: none !important;
                border-radius: 12px !important;
                font-size: 16px !important;
                font-weight: 700 !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            
            .griz-btn-primary:hover:not(:disabled) {
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4) !important;
            }
            
            .griz-btn-primary:disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
            }
            
            /* Footer */
            .griz-modal-footer {
                padding: 20px 32px !important;
                border-top: 1px solid #e5e7eb !important;
                display: flex !important;
                gap: 12px !important;
                justify-content: flex-end !important;
                background: #f9fafb !important;
                border-radius: 0 0 16px 16px !important;
            }
            
            .griz-btn-secondary {
                padding: 12px 24px !important;
                background: #f3f4f6 !important;
                color: #374151 !important;
                border: none !important;
                border-radius: 8px !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            
            .griz-btn-secondary:hover {
                background: #e5e7eb !important;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .griz-period-grid {
                    grid-template-columns: 1fr !important;
                }
                .griz-vs {
                    padding: 12px 0 !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    _configurarEventos() {
        // Cerrar
        document.getElementById('btnCerrarComparacion').addEventListener('click', () => this.cerrar());
        document.getElementById('btnCerrar').addEventListener('click', () => this.cerrar());
        
        // Selects
        const selectA = document.getElementById('selectPeriodoA');
        const selectB = document.getElementById('selectPeriodoB');
        const btnComparar = document.getElementById('btnComparar');
        
        selectA.addEventListener('change', () => {
            this._actualizarInfo('A');
            this._validar();
        });
        
        selectB.addEventListener('change', () => {
            this._actualizarInfo('B');
            this._validar();
        });
        
        // Comparar
        btnComparar.addEventListener('click', () => this._comparar());
        
        // Volver
        document.getElementById('btnVolver').addEventListener('click', () => this._volver());
    }
    
    _actualizarInfo(letra) {
        const select = document.getElementById(`selectPeriodo${letra}`);
        const info = document.getElementById(`info${letra}`);
        const valor = select.value;
        
        if (!valor) {
            info.textContent = '';
            return;
        }
        
        info.textContent = `Período: ${this._nombrePeriodo(valor)}`;
    }
    
    _validar() {
        const a = document.getElementById('selectPeriodoA').value;
        const b = document.getElementById('selectPeriodoB').value;
        const btn = document.getElementById('btnComparar');
        
        btn.disabled = !(a && b && a !== b);
    }
    
    _comparar() {
        console.log('🔍 Iniciando comparación...');
        
        this.periodoA = document.getElementById('selectPeriodoA').value;
        this.periodoB = document.getElementById('selectPeriodoB').value;
        
        // Ocultar selector
        document.getElementById('seccionSelector').style.display = 'none';
        document.getElementById('seccionResultados').style.display = 'block';
        document.getElementById('btnVolver').style.display = 'block';
        
        // Generar resultados
        this._generarResultados();
    }
    
    _generarResultados() {
        const contenedor = document.getElementById('contenidoResultados');
        
        contenedor.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
                <h3 style="margin: 0 0 12px 0; color: #1f2937;">¡Comparación Lista!</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    Comparando <strong>${this._nombrePeriodo(this.periodoA)}</strong> 
                    vs <strong>${this._nombrePeriodo(this.periodoB)}</strong>
                </p>
                <p style="margin: 24px 0 0 0; color: #667eea; font-size: 14px;">
                    Los cálculos completos estarán disponibles en la próxima versión.
                </p>
            </div>
        `;
    }
    
    _volver() {
        document.getElementById('seccionResultados').style.display = 'none';
        document.getElementById('seccionSelector').style.display = 'block';
        document.getElementById('btnVolver').style.display = 'none';
    }
    
    _nombrePeriodo(valor) {
        const nombres = {
            'mes-actual': 'Mes Actual',
            'mes-anterior': 'Mes Anterior',
            'trimestre-actual': 'Trimestre Actual',
            'trimestre-anterior': 'Trimestre Anterior',
            'año-actual': 'Año Actual',
            'año-anterior': 'Año Anterior'
        };
        return nombres[valor] || valor;
    }
    
    abrir() {
        this.modal.style.display = 'flex';
        
        // Reset
        document.getElementById('selectPeriodoA').value = '';
        document.getElementById('selectPeriodoB').value = '';
        document.getElementById('infoA').textContent = '';
        document.getElementById('infoB').textContent = '';
        document.getElementById('seccionSelector').style.display = 'block';
        document.getElementById('seccionResultados').style.display = 'none';
        document.getElementById('btnVolver').style.display = 'none';
        this._validar();
        
        console.log('✅ Modal abierto');
    }
    
    cerrar() {
        this.modal.style.display = 'none';
        console.log('✅ Modal cerrado');
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.modalComparacionPeriodos = new ModalComparacionPeriodos();
        window.ModalComparacionPeriodos = ModalComparacionPeriodos;
    });
} else {
    window.modalComparacionPeriodos = new ModalComparacionPeriodos();
    window.ModalComparacionPeriodos = ModalComparacionPeriodos;
}
