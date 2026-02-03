/**
 * ═══════════════════════════════════════════════════════════════════
 * MODAL PERÍODO PERSONALIZADO - ESTADO DE RESULTADOS
 * Modal profesional para seleccionar fechas custom y comparar períodos
 * ═══════════════════════════════════════════════════════════════════
 */

if (!window.ModalPeriodoPersonalizado) {
    class ModalPeriodoPersonalizado {
        constructor() {
            this.modal = null;
            this.fechaInicio = null;
            this.fechaFin = null;
            this.callback = null;
            this._inicializar();
        }

        _inicializar() {
            this._crearModal();
            this._configurarEventos();
        }

        _crearModal() {
            // Crear estructura del modal
            const modalHTML = `
                <div id="modalPeriodoPersonalizado" class="modal-periodo-overlay" style="display: none;">
                    <div class="modal-periodo-container">
                        <div class="modal-periodo-header">
                            <h3>📅 Período Personalizado</h3>
                            <button class="modal-periodo-close" id="btnCerrarModal">&times;</button>
                        </div>
                        
                        <div class="modal-periodo-body">
                            <!-- Selector de período rápido -->
                            <div class="periodo-rapido-section">
                                <label class="modal-label">⚡ Períodos Rápidos:</label>
                                <div class="periodo-rapido-grid">
                                    <button class="btn-periodo-rapido" data-periodo="año-actual">
                                        📅 Año Actual (2026)
                                    </button>
                                    <button class="btn-periodo-rapido" data-periodo="año-anterior">
                                        📅 Año Anterior (2025)
                                    </button>
                                    <button class="btn-periodo-rapido" data-periodo="ultimos-12-meses">
                                        📊 Últimos 12 Meses
                                    </button>
                                    <button class="btn-periodo-rapido" data-periodo="trimestre-actual">
                                        📈 Trimestre Actual
                                    </button>
                                    <button class="btn-periodo-rapido" data-periodo="trimestre-anterior">
                                        📈 Trimestre Anterior
                                    </button>
                                </div>
                            </div>

                            <div class="separador-o">
                                <span>O SELECCIONA FECHAS CUSTOM</span>
                            </div>

                            <!-- Selector de fechas manual con date picker visual -->
                            <div class="fechas-custom-section">
                                <div class="fecha-input-group">
                                    <label for="fechaInicio" class="modal-label">📆 Fecha Inicio:</label>
                                    <input 
                                        type="text" 
                                        id="fechaInicio" 
                                        class="modal-date-input"
                                        placeholder="Selecciona fecha..."
                                        readonly
                                    />
                                </div>

                                <div class="fecha-input-group">
                                    <label for="fechaFin" class="modal-label">📆 Fecha Fin:</label>
                                    <input 
                                        type="text" 
                                        id="fechaFin" 
                                        class="modal-date-input"
                                        placeholder="Selecciona fecha..."
                                        readonly
                                    />
                                </div>
                            </div>

                            <!-- Información del rango -->
                            <div id="infoRango" class="info-rango" style="display: none;">
                                <div class="info-rango-content">
                                    <span id="infoRangoTexto"></span>
                                </div>
                            </div>

                            <!-- Mensaje de error -->
                            <div id="errorMensaje" class="error-mensaje" style="display: none;"></div>
                        </div>

                        <div class="modal-periodo-footer">
                            <button class="btn-modal btn-cancelar" id="btnCancelar">
                                Cancelar
                            </button>
                            <button class="btn-modal btn-aplicar" id="btnAplicar">
                                ✓ Aplicar Período
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Agregar al DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.modal = document.getElementById('modalPeriodoPersonalizado');

            // Agregar estilos
            this._inyectarEstilos();
        }

        _inyectarEstilos() {
            if (document.getElementById('estilosModalPeriodo')) return;

            const styles = `
                <style id="estilosModalPeriodo">
                    .modal-periodo-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 999999;
                        animation: fadeIn 0.2s ease;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    .modal-periodo-container {
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        width: 90%;
                        max-width: 600px;
                        min-height: 400px;
                        max-height: 90vh;
                        overflow: auto;
                        position: relative;
                        z-index: 999999;
                        animation: slideUp 0.3s ease;
                        pointer-events: auto !important;
                    }

                    @keyframes slideUp {
                        from { 
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .modal-periodo-header {
                        padding: 24px;
                        border-bottom: 1px solid #e5e7eb;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }

                    .modal-periodo-header h3 {
                        margin: 0;
                        font-size: 20px;
                        font-weight: 600;
                    }

                    .modal-periodo-close {
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        font-size: 28px;
                        width: 36px;
                        height: 36px;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                        line-height: 1;
                    }

                    .modal-periodo-close:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: rotate(90deg);
                    }

                    .modal-periodo-body {
                        padding: 24px;
                        overflow-y: auto;
                        flex: 1;
                        pointer-events: auto !important;
                    }

                    .modal-label {
                        display: block;
                        font-weight: 600;
                        color: #374151;
                        margin-bottom: 12px;
                        font-size: 14px;
                    }

                    .periodo-rapido-section {
                        margin-bottom: 24px;
                    }

                    .periodo-rapido-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                        gap: 12px;
                        margin-top: 12px;
                    }

                    .btn-periodo-rapido {
                        padding: 12px 16px;
                        border: 2px solid #e5e7eb;
                        background: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 500;
                        color: #374151;
                        transition: all 0.2s;
                        text-align: left;
                    }

                    .btn-periodo-rapido:hover {
                        border-color: #667eea;
                        background: #f0f4ff;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
                    }

                    .btn-periodo-rapido.active {
                        border-color: #667eea;
                        background: #667eea;
                        color: white;
                    }

                    .separador-o {
                        text-align: center;
                        margin: 24px 0;
                        position: relative;
                    }

                    .separador-o::before,
                    .separador-o::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        width: 40%;
                        height: 1px;
                        background: #e5e7eb;
                    }

                    .separador-o::before { left: 0; }
                    .separador-o::after { right: 0; }

                    .separador-o span {
                        background: white;
                        padding: 0 16px;
                        color: #9ca3af;
                        font-size: 12px;
                        font-weight: 600;
                        position: relative;
                    }

                    .fechas-custom-section {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                        pointer-events: auto !important;
                    }

                    .fecha-input-group {
                        display: flex;
                        flex-direction: column;
                        pointer-events: auto !important;
                    }

                    .modal-date-input {
                        padding: 12px;
                        border: 2px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 14px;
                        color: #374151;
                        transition: all 0.2s;
                        pointer-events: auto !important;
                        position: relative;
                        z-index: 10;
                    }

                    .modal-date-input:focus {
                        outline: none;
                        border-color: #667eea;
                        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    }

                    .info-rango {
                        margin-top: 20px;
                        padding: 16px;
                        background: #f0f9ff;
                        border: 1px solid #bae6fd;
                        border-radius: 8px;
                    }

                    .info-rango-content {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #0369a1;
                        font-size: 14px;
                    }

                    .error-mensaje {
                        margin-top: 16px;
                        padding: 12px 16px;
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        border-radius: 8px;
                        color: #dc2626;
                        font-size: 14px;
                    }

                    .modal-periodo-footer {
                        padding: 20px 24px;
                        border-top: 1px solid #e5e7eb;
                        display: flex;
                        gap: 12px;
                        justify-content: flex-end;
                    }

                    .btn-modal {
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        border: none;
                    }

                    .btn-cancelar {
                        background: #f3f4f6;
                        color: #374151;
                    }

                    .btn-cancelar:hover {
                        background: #e5e7eb;
                    }

                    .btn-aplicar {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }

                    .btn-aplicar:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                    }

                    .btn-aplicar:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                        transform: none;
                    }

                    @media (max-width: 640px) {
                        .fechas-custom-section {
                            grid-template-columns: 1fr;
                        }

                        .periodo-rapido-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            `;

            document.head.insertAdjacentHTML('beforeend', styles);
        }

        _configurarEventos() {
            // Cerrar modal
            document.getElementById('btnCerrarModal').addEventListener('click', () => this.cerrar());
            document.getElementById('btnCancelar').addEventListener('click', () => this.cerrar());

            // Click fuera del modal
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.cerrar();
            });

            // Períodos rápidos
            document.querySelectorAll('.btn-periodo-rapido').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const periodo = e.currentTarget.dataset.periodo;
                    this._aplicarPeriodoRapido(periodo);
                });
            });

            // Cambio en fechas
            const inputInicio = document.getElementById('fechaInicio');
            const inputFin = document.getElementById('fechaFin');

            inputInicio.addEventListener('change', () => this._validarFechas());
            inputFin.addEventListener('change', () => this._validarFechas());

            // Aplicar
            document.getElementById('btnAplicar').addEventListener('click', () => this._aplicar());

            // ESC para cerrar
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                    this.cerrar();
                }
            });
        }

        _aplicarPeriodoRapido(periodoId) {
            // Limpiar selección anterior
            document.querySelectorAll('.btn-periodo-rapido').forEach(btn => {
                btn.classList.remove('active');
            });

            // Marcar como activo - usar el botón del evento
            const botonClickeado = Array.from(document.querySelectorAll('.btn-periodo-rapido'))
                .find(btn => btn.getAttribute('data-periodo') === periodoId);
            
            if (botonClickeado) {
                botonClickeado.classList.add('active');
            }

            // Obtener rango del período
            const periodoConfig = window.EstadoResultadosConfig.periodosComparacion[periodoId];
            
            if (!periodoConfig) {
                console.error('Período no encontrado:', periodoId);
                return;
            }

            const rango = periodoConfig.calcular();

            // Setear en inputs
            const inputInicio = document.getElementById('fechaInicio');
            const inputFin = document.getElementById('fechaFin');

            inputInicio.value = window.EstadoResultadosConfig.formatearFechaInput(rango.inicio);
            inputFin.value = window.EstadoResultadosConfig.formatearFechaInput(rango.fin);

            // Disparar eventos change para que la validación detecte los cambios
            inputInicio.dispatchEvent(new Event('change', { bubbles: true }));
            inputFin.dispatchEvent(new Event('change', { bubbles: true }));

            this._validarFechas();
        }

        _validarFechas() {
            const inputInicio = document.getElementById('fechaInicio');
            const inputFin = document.getElementById('fechaFin');
            const errorDiv = document.getElementById('errorMensaje');
            const infoDiv = document.getElementById('infoRango');
            const infoTexto = document.getElementById('infoRangoTexto');
            const btnAplicar = document.getElementById('btnAplicar');

            const fechaInicio = inputInicio.value;
            const fechaFin = inputFin.value;

            // Limpiar errores
            errorDiv.style.display = 'none';
            infoDiv.style.display = 'none';

            // Si ambas están vacías, deshabilitar sin mostrar error
            if (!fechaInicio && !fechaFin) {
                btnAplicar.disabled = true;
                return;
            }

            // Si solo falta una, no deshabilitar aún (usuario puede estar escribiendo)
            if (!fechaInicio || !fechaFin) {
                // Permitir que el usuario continúe
                btnAplicar.disabled = false;
                return;
            }

            // Validar con la función del config
            const validacion = window.EstadoResultadosConfig.validarRangoFechas(fechaInicio, fechaFin);

            if (!validacion.valido) {
                errorDiv.textContent = '⚠️ ' + validacion.error;
                errorDiv.style.display = 'block';
                btnAplicar.disabled = true;
                return;
            }

            // Mostrar info del rango
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            
            infoTexto.textContent = `📊 Período: ${validacion.dias + 1} días (${
                window.EstadoResultadosConfig.formatearFechaDisplay(inicio)
            } - ${
                window.EstadoResultadosConfig.formatearFechaDisplay(fin)
            })`;
            
            infoDiv.style.display = 'block';
            btnAplicar.disabled = false;

            this.fechaInicio = fechaInicio;
            this.fechaFin = fechaFin;
        }

        _aplicar() {
            if (!this.fechaInicio || !this.fechaFin) {
                return;
            }

            // Llamar la función global
            if (window.aplicarPeriodoPersonalizado) {
                window.aplicarPeriodoPersonalizado(this.fechaInicio, this.fechaFin);
            }

            // Callback legacy por si existe
            if (this.callback) {
                this.callback(this.fechaInicio, this.fechaFin);
            }

            this.cerrar();
        }

        _getFechaHoy() {
            return window.EstadoResultadosConfig.formatearFechaInput(new Date());
        }

        // ═══════════════════════════════════════════════════════════
        // API PÚBLICA
        // ═══════════════════════════════════════════════════════════

        abrir(callback) {
            this.callback = callback;
            this.modal.style.display = 'flex';

            // Inicializar date pickers visuales si no existen
            if (!this.datePickerInicio) {
                this.datePickerInicio = new window.DatePickerVisual('fechaInicio', {
                    maxDate: new Date(),
                    onChange: () => this._validarFechas()
                });
            }
            
            if (!this.datePickerFin) {
                this.datePickerFin = new window.DatePickerVisual('fechaFin', {
                    maxDate: new Date(),
                    onChange: () => this._validarFechas()
                });
            }

            // Setear fecha de hoy por defecto en fin
            const inputFin = document.getElementById('fechaFin');
            if (!inputFin.value) {
                const hoy = this._getFechaHoy();
                this.datePickerFin.setValue(hoy);
            }

            this._validarFechas();
        }

        cerrar() {
            this.modal.style.display = 'none';
            this.fechaInicio = null;
            this.fechaFin = null;
            this.callback = null;

            // Limpiar inputs
            document.getElementById('fechaInicio').value = '';
            document.getElementById('fechaFin').value = '';
            document.getElementById('errorMensaje').style.display = 'none';
            document.getElementById('infoRango').style.display = 'none';
            document.getElementById('btnAplicar').disabled = true;

            // Limpiar selección de períodos rápidos
            document.querySelectorAll('.btn-periodo-rapido').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    }
    // ═══════════════════════════════════════════════════════════════
// FUNCIÓN GLOBAL: aplicarPeriodoPersonalizado
// ═══════════════════════════════════════════════════════════════
window.aplicarPeriodoPersonalizado = function(fechaInicio, fechaFin) {
    console.log('📅 Aplicando período personalizado:', fechaInicio, 'hasta', fechaFin);
    
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const fin = new Date(fechaFin + 'T23:59:59');
    
    if (!window.estadoResultados.flujoCaja && window.flujoCaja) {
        window.estadoResultados.flujoCaja = window.flujoCaja;
    }
    
    const resultados = window.estadoResultados.calcularResultados(inicio, fin);
    
    if (window.estadoResultadosUI && window.estadoResultadosUI.mostrarResultados) {
        window.estadoResultadosUI.mostrarResultados(resultados);
    }
    
    console.log('✅ Período aplicado correctamente');
};


    // Instancia global
    window.ModalPeriodoPersonalizado = ModalPeriodoPersonalizado;
    window.modalPeriodoPersonalizado = new ModalPeriodoPersonalizado();
}

console.log('📅 [Modal Período Personalizado] Inicializado correctamente');
