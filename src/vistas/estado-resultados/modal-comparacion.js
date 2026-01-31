/**
 * ═══════════════════════════════════════════════════════════════════
 * MODAL COMPARACIÓN - Estado de Resultados
 * Comparación avanzada de períodos con análisis automático
 * v1.0.0 - GRIZALUM Sistema Financiero
 * ═══════════════════════════════════════════════════════════════════
 */

class ModalComparacion {
    constructor() {
        this.version = '1.0.0';
        this.modal = null;
        this.callback = null;
        this.periodoA = null;
        this.periodoB = null;
        this.resultadosA = null;
        this.resultadosB = null;
        
        this._inicializar();
    }
    
    _inicializar() {
        this._crearModal();
        this._inyectarEstilos();
        this._configurarEventos();
    }
    
    _crearModal() {
        const htmlModal = `
            <div id="modalComparacion" class="modal-comparacion-overlay" style="display: none;">
                <div class="modal-comparacion-contenedor">
                    <div class="modal-comparacion-encabezado">
                        <h3>📊 Comparación de Períodos</h3>
                        <button class="modal-comparacion-cerrar" id="btnCerrarComparacion">&times;</button>
                    </div>
                    
                    <div class="modal-comparacion-cuerpo">
                        <!-- Paso 1: Selector de períodos -->
                        <div id="selectorPeriodos" class="seccion-selector-periodos">
                            <div class="titulo-selector">
                                <span class="numero-paso">1</span>
                                <h4>Selecciona los períodos a comparar</h4>
                            </div>
                            
                            <div class="grilla-periodos">
                                <div class="selector-periodo">
                                    <label class="etiqueta-periodo">📅 Período A (Base):</label>
                                    <select id="selectPeriodoA" class="select-periodo">
                                        <option value="">Seleccionar...</option>
                                        <option value="mes-actual">Mes Actual</option>
                                        <option value="mes-anterior">Mes Anterior</option>
                                        <option value="trimestre-actual">Trimestre Actual</option>
                                        <option value="trimestre-anterior">Trimestre Anterior</option>
                                        <option value="año-actual">Año Actual</option>
                                        <option value="año-anterior">Año Anterior</option>
                                    </select>
                                </div>
                                
                                <div class="comparacion-vs">VS</div>
                                
                                <div class="selector-periodo">
                                    <label class="etiqueta-periodo">📅 Período B (Comparar):</label>
                                    <select id="selectPeriodoB" class="select-periodo">
                                        <option value="">Seleccionar...</option>
                                        <option value="mes-actual">Mes Actual</option>
                                        <option value="mes-anterior">Mes Anterior</option>
                                        <option value="trimestre-actual">Trimestre Actual</option>
                                        <option value="trimestre-anterior">Trimestre Anterior</option>
                                        <option value="año-actual">Año Actual</option>
                                        <option value="año-anterior">Año Anterior</option>
                                    </select>
                                </div>
                            </div>
                            
                            <button id="btnCompararPeriodos" class="boton-comparar-periodos" disabled>
                                🔍 Comparar Períodos
                            </button>
                        </div>
                        
                        <!-- Paso 2: Resultados de comparación -->
                        <div id="resultadosComparacion" class="seccion-resultados-comparacion" style="display: none;">
                            <div class="titulo-selector">
                                <span class="numero-paso">2</span>
                                <h4>Resultados de la Comparación</h4>
                            </div>
                            
                            <!-- Resumen comparativo -->
                            <div class="resumen-comparativo">
                                <div class="tarjeta-comparativa tarjeta-periodo-a">
                                    <div class="encabezado-tarjeta">
                                        <span class="etiqueta-periodo-tarjeta">Período A</span>
                                        <h5 id="nombrePeriodoA">-</h5>
                                    </div>
                                    <div class="metricas-tarjeta">
                                        <div class="metrica">
                                            <span class="etiqueta-metrica">Ingresos</span>
                                            <span class="valor-metrica" id="ingresosA">S/. 0.00</span>
                                        </div>
                                        <div class="metrica">
                                            <span class="etiqueta-metrica">Gastos</span>
                                            <span class="valor-metrica" id="gastosA">S/. 0.00</span>
                                        </div>
                                        <div class="metrica metrica-destacada">
                                            <span class="etiqueta-metrica">Utilidad</span>
                                            <span class="valor-metrica" id="utilidadA">S/. 0.00</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="columna-diferencias">
                                    <div class="diferencia-item">
                                        <span class="icono-diferencia" id="iconoIngreso">-</span>
                                        <span class="porcentaje-diferencia" id="porcIngreso">0%</span>
                                    </div>
                                    <div class="diferencia-item">
                                        <span class="icono-diferencia" id="iconoGasto">-</span>
                                        <span class="porcentaje-diferencia" id="porcGasto">0%</span>
                                    </div>
                                    <div class="diferencia-item diferencia-destacada">
                                        <span class="icono-diferencia" id="iconoUtilidad">-</span>
                                        <span class="porcentaje-diferencia" id="porcUtilidad">0%</span>
                                    </div>
                                </div>
                                
                                <div class="tarjeta-comparativa tarjeta-periodo-b">
                                    <div class="encabezado-tarjeta">
                                        <span class="etiqueta-periodo-tarjeta">Período B</span>
                                        <h5 id="nombrePeriodoB">-</h5>
                                    </div>
                                    <div class="metricas-tarjeta">
                                        <div class="metrica">
                                            <span class="etiqueta-metrica">Ingresos</span>
                                            <span class="valor-metrica" id="ingresosB">S/. 0.00</span>
                                        </div>
                                        <div class="metrica">
                                            <span class="etiqueta-metrica">Gastos</span>
                                            <span class="valor-metrica" id="gastosB">S/. 0.00</span>
                                        </div>
                                        <div class="metrica metrica-destacada">
                                            <span class="etiqueta-metrica">Utilidad</span>
                                            <span class="valor-metrica" id="utilidadB">S/. 0.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Gráfico comparativo -->
                            <div class="contenedor-grafico-comparativo">
                                <h5 class="titulo-grafico">📊 Comparación Visual</h5>
                                <canvas id="graficoComparativo" width="600" height="300"></canvas>
                            </div>
                            
                            <!-- Insights automáticos -->
                            <div class="contenedor-insights">
                                <h5 class="titulo-insights">💡 Análisis Automático</h5>
                                <div id="listaInsights" class="lista-insights">
                                    <!-- Se llena dinámicamente -->
                                </div>
                            </div>
                            
                            <!-- Desglose por categorías -->
                            <div class="contenedor-desglose">
                                <h5 class="titulo-desglose">📋 Desglose por Categorías</h5>
                                <div id="tablaDesglose" class="tabla-desglose">
                                    <!-- Se llena dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-comparacion-pie">
                        <button class="boton-modal boton-volver" id="btnVolver" style="display: none;">
                            ← Volver
                        </button>
                        <button class="boton-modal boton-exportar" id="btnExportarPDF" style="display: none;">
                            📄 Exportar PDF
                        </button>
                        <button class="boton-modal boton-cerrar-modal" id="btnCerrarModalComparacion">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', htmlModal);
        this.modal = document.getElementById('modalComparacion');
    }
    
    _inyectarEstilos() {
        if (document.getElementById('estilosModalComparacion')) return;
        
        const estilos = `
            <style id="estilosModalComparacion">
                .modal-comparacion-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    animation: fadeIn 0.2s ease;
                    pointer-events: auto !important;
                }
                
                .modal-comparacion-overlay * {
                    pointer-events: auto !important;
                }
                
                .modal-comparacion-contenedor {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    width: 95%;
                    max-width: 1000px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    z-index: 999999;
                    animation: slideUp 0.3s ease;
                }
                
                .modal-comparacion-encabezado {
                    padding: 24px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 16px 16px 0 0;
                }
                
                .modal-comparacion-encabezado h3 {
                    margin: 0;
                    font-size: 22px;
                    font-weight: 600;
                }
                
                .modal-comparacion-cerrar {
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
                
                .modal-comparacion-cerrar:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }
                
                .modal-comparacion-cuerpo {
                    padding: 24px;
                }
                
                .titulo-selector {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                
                .numero-paso {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                }
                
                .titulo-selector h4 {
                    margin: 0;
                    font-size: 18px;
                    color: #374151;
                }
                
                .grilla-periodos {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: 24px;
                    align-items: end;
                    margin-bottom: 24px;
                }
                
                .selector-periodo {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .etiqueta-periodo {
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }
                
                .select-periodo {
                    padding: 12px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: white;
                }
                
                .select-periodo:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .comparacion-vs {
                    font-size: 24px;
                    font-weight: 900;
                    color: #667eea;
                    text-align: center;
                    padding: 12px;
                }
                
                .boton-comparar-periodos {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .boton-comparar-periodos:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                }
                
                .boton-comparar-periodos:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .seccion-resultados-comparacion {
                    animation: fadeIn 0.3s ease;
                }
                
                .resumen-comparativo {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .tarjeta-comparativa {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 20px;
                    border: 2px solid #e5e7eb;
                }
                
                .tarjeta-periodo-a {
                    border-color: #667eea;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
                }
                
                .tarjeta-periodo-b {
                    border-color: #10b981;
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
                }
                
                .encabezado-tarjeta {
                    margin-bottom: 16px;
                }
                
                .etiqueta-periodo-tarjeta {
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: #6b7280;
                }
                
                .encabezado-tarjeta h5 {
                    margin: 4px 0 0 0;
                    font-size: 16px;
                    color: #111827;
                }
                
                .metricas-tarjeta {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .metrica {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .metrica-destacada {
                    border-bottom: 2px solid #667eea;
                    padding-top: 12px;
                }
                
                .etiqueta-metrica {
                    font-size: 14px;
                    color: #6b7280;
                }
                
                .valor-metrica {
                    font-size: 18px;
                    font-weight: 700;
                    color: #111827;
                }
                
                .columna-diferencias {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 28px;
                    padding: 20px 0;
                }
                
                .diferencia-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                
                .icono-diferencia {
                    font-size: 24px;
                }
                
                .porcentaje-diferencia {
                    font-size: 14px;
                    font-weight: 700;
                }
                
                .contenedor-grafico-comparativo,
                .contenedor-insights,
                .contenedor-desglose {
                    margin-top: 24px;
                    padding: 20px;
                    background: #f9fafb;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                }
                
                .titulo-grafico,
                .titulo-insights,
                .titulo-desglose {
                    margin: 0 0 16px 0;
                    font-size: 16px;
                    color: #374151;
                    font-weight: 600;
                }
                
                #graficoComparativo {
                    width: 100% !important;
                    height: auto !important;
                    max-height: 300px;
                }
                
                .lista-insights {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .insight-item {
                    display: flex;
                    align-items: start;
                    gap: 12px;
                    padding: 12px;
                    background: white;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                }
                
                .insight-icono {
                    font-size: 24px;
                    flex-shrink: 0;
                }
                
                .insight-texto {
                    font-size: 14px;
                    color: #374151;
                    line-height: 1.5;
                }
                
                .tabla-desglose {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .fila-desglose {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 16px;
                    padding: 12px 16px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .fila-desglose:first-child {
                    background: #f3f4f6;
                    font-weight: 600;
                    color: #374151;
                }
                
                .celda-desglose {
                    font-size: 14px;
                    color: #6b7280;
                }
                
                .modal-comparacion-pie {
                    padding: 20px 24px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    background: #f9fafb;
                    border-radius: 0 0 16px 16px;
                }
                
                .boton-modal {
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                
                .boton-volver {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .boton-volver:hover {
                    background: #e5e7eb;
                }
                
                .boton-exportar {
                    background: #10b981;
                    color: white;
                }
                
                .boton-exportar:hover {
                    background: #059669;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
                
                .boton-cerrar-modal {
                    background: #6b7280;
                    color: white;
                }
                
                .boton-cerrar-modal:hover {
                    background: #4b5563;
                }
                
                @media (max-width: 768px) {
                    .grilla-periodos {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .comparacion-vs {
                        transform: rotate(90deg);
                    }
                    
                    .resumen-comparativo {
                        grid-template-columns: 1fr;
                    }
                    
                    .columna-diferencias {
                        flex-direction: row;
                        justify-content: space-around;
                    }
                    
                    .fila-desglose {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', estilos);
    }
    
    _configurarEventos() {
        // Cerrar modal
        document.getElementById('btnCerrarComparacion').addEventListener('click', () => this.cerrar());
        document.getElementById('btnCerrarModalComparacion').addEventListener('click', () => this.cerrar());
        
        // Selects de períodos
        const selectA = document.getElementById('selectPeriodoA');
        const selectB = document.getElementById('selectPeriodoB');
        const btnComparar = document.getElementById('btnCompararPeriodos');
        
        selectA.addEventListener('change', () => {
            btnComparar.disabled = !(selectA.value && selectB.value);
        });
        
        selectB.addEventListener('change', () => {
            btnComparar.disabled = !(selectA.value && selectB.value);
        });
        
        // Botón comparar
        btnComparar.addEventListener('click', () => this._compararPeriodos());
        
        // Botón volver
        document.getElementById('btnVolver').addEventListener('click', () => this._volverASelector());
        
        // Botón exportar PDF
        document.getElementById('btnExportarPDF').addEventListener('click', () => this._exportarPDF());
    }
    
    _compararPeriodos() {
        const selectA = document.getElementById('selectPeriodoA').value;
        const selectB = document.getElementById('selectPeriodoB').value;
        
        console.log('🔍 Comparando períodos:', selectA, 'vs', selectB);
        
        // Obtener resultados de ambos períodos
        this._obtenerResultados(selectA, selectB);
        
        // Mostrar resultados
        this._mostrarResultados();
    }
    
    _obtenerResultados(periodoAId, periodoBId) {
        // Usar el módulo de Estado de Resultados para calcular
        const estadoResultados = window.estadoResultados;
        
        if (!estadoResultados) {
            console.error('❌ Módulo Estado de Resultados no disponible');
            return;
        }
        
        // Mapear IDs a períodos del config
        const mapaPeriodos = {
            'mes-actual': 'mes',
            'mes-anterior': 'mes-anterior',
            'trimestre-actual': 'trimestre',
            'trimestre-anterior': 'trimestre-anterior',
            'año-actual': 'año',
            'año-anterior': 'año-anterior'
        };
        
        // Calcular resultados para período A
        const periodoA = mapaPeriodos[periodoAId] || periodoAId;
        estadoResultados.calcularResultados(periodoA);
        this.resultadosA = { ...estadoResultados.resultados };
        this.periodoA = periodoAId;
        
        // Calcular resultados para período B
        const periodoB = mapaPeriodos[periodoBId] || periodoBId;
        estadoResultados.calcularResultados(periodoB);
        this.resultadosB = { ...estadoResultados.resultados };
        this.periodoB = periodoBId;
        
        console.log('✅ Resultados obtenidos:', this.resultadosA, this.resultadosB);
    }
    
    _mostrarResultados() {
        // Ocultar selector, mostrar resultados
        document.getElementById('selectorPeriodos').style.display = 'none';
        document.getElementById('resultadosComparacion').style.display = 'block';
        document.getElementById('btnVolver').style.display = 'block';
        document.getElementById('btnExportarPDF').style.display = 'block';
        
        // Llenar nombres de períodos
        document.getElementById('nombrePeriodoA').textContent = this._nombrePeriodo(this.periodoA);
        document.getElementById('nombrePeriodoB').textContent = this._nombrePeriodo(this.periodoB);
        
        // Llenar métricas
        this._llenarMetricas();
        
        // Calcular diferencias
        this._calcularDiferencias();
        
        // Crear gráfico
        this._crearGrafico();
        
        // Generar insights
        this._generarInsights();
        
        // Llenar desglose
        this._llenarDesglose();
    }
    
    _nombrePeriodo(periodoId) {
        const nombres = {
            'mes-actual': 'Mes Actual',
            'mes-anterior': 'Mes Anterior',
            'trimestre-actual': 'Trimestre Actual',
            'trimestre-anterior': 'Trimestre Anterior',
            'año-actual': 'Año Actual',
            'año-anterior': 'Año Anterior'
        };
        return nombres[periodoId] || periodoId;
    }
    
    _llenarMetricas() {
        // Período A
        document.getElementById('ingresosA').textContent = this._formatearMoneda(this.resultadosA.ingresosTotales);
        document.getElementById('gastosA').textContent = this._formatearMoneda(this.resultadosA.gastosTotales);
        document.getElementById('utilidadA').textContent = this._formatearMoneda(this.resultadosA.utilidadNeta);
        
        // Período B
        document.getElementById('ingresosB').textContent = this._formatearMoneda(this.resultadosB.ingresosTotales);
        document.getElementById('gastosB').textContent = this._formatearMoneda(this.resultadosB.gastosTotales);
        document.getElementById('utilidadB').textContent = this._formatearMoneda(this.resultadosB.utilidadNeta);
    }
    
    _calcularDiferencias() {
        // Ingresos
        const difIngresos = this._calcularPorcentajeCambio(
            this.resultadosA.ingresosTotales,
            this.resultadosB.ingresosTotales
        );
        document.getElementById('iconoIngreso').textContent = difIngresos >= 0 ? '↗' : '↘';
        document.getElementById('porcIngreso').textContent = Math.abs(difIngresos).toFixed(1) + '%';
        document.getElementById('porcIngreso').style.color = difIngresos >= 0 ? '#10b981' : '#ef4444';
        
        // Gastos
        const difGastos = this._calcularPorcentajeCambio(
            this.resultadosA.gastosTotales,
            this.resultadosB.gastosTotales
        );
        document.getElementById('iconoGasto').textContent = difGastos >= 0 ? '↗' : '↘';
        document.getElementById('porcGasto').textContent = Math.abs(difGastos).toFixed(1) + '%';
        document.getElementById('porcGasto').style.color = difGastos >= 0 ? '#ef4444' : '#10b981'; // Invertido porque más gasto es malo
        
        // Utilidad
        const difUtilidad = this._calcularPorcentajeCambio(
            this.resultadosA.utilidadNeta,
            this.resultadosB.utilidadNeta
        );
        document.getElementById('iconoUtilidad').textContent = difUtilidad >= 0 ? '↗' : '↘';
        document.getElementById('porcUtilidad').textContent = Math.abs(difUtilidad).toFixed(1) + '%';
        document.getElementById('porcUtilidad').style.color = difUtilidad >= 0 ? '#10b981' : '#ef4444';
    }
    
    _calcularPorcentajeCambio(valorNuevo, valorAnterior) {
        if (valorAnterior === 0) return 0;
        return ((valorNuevo - valorAnterior) / Math.abs(valorAnterior)) * 100;
    }
    
    _crearGrafico() {
        const canvas = document.getElementById('graficoComparativo');
        const ctx = canvas.getContext('2d');
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Datos
        const datos = {
            labels: ['Ingresos', 'Gastos', 'Utilidad'],
            periodoA: [
                this.resultadosA.ingresosTotales,
                this.resultadosA.gastosTotales,
                this.resultadosA.utilidadNeta
            ],
            periodoB: [
                this.resultadosB.ingresosTotales,
                this.resultadosB.gastosTotales,
                this.resultadosB.utilidadNeta
            ]
        };
        
        // Dibujar gráfico de barras simple
        const barWidth = 60;
        const gap = 40;
        const startX = 80;
        const maxValor = Math.max(...datos.periodoA, ...datos.periodoB);
        const escala = (canvas.height - 80) / maxValor;
        
        datos.labels.forEach((label, i) => {
            const x = startX + i * (barWidth * 2 + gap);
            const y = canvas.height - 40;
            
            // Barra Período A
            const alturaA = datos.periodoA[i] * escala;
            ctx.fillStyle = '#667eea';
            ctx.fillRect(x, y - alturaA, barWidth, alturaA);
            
            // Barra Período B
            const alturaB = datos.periodoB[i] * escala;
            ctx.fillStyle = '#10b981';
            ctx.fillRect(x + barWidth, y - alturaB, barWidth, alturaB);
            
            // Etiqueta
            ctx.fillStyle = '#374151';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + barWidth, y + 20);
        });
        
        // Leyenda
        ctx.fillStyle = '#667eea';
        ctx.fillRect(20, 20, 20, 20);
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(this._nombrePeriodo(this.periodoA), 50, 35);
        
        ctx.fillStyle = '#10b981';
        ctx.fillRect(20, 50, 20, 20);
        ctx.fillStyle = '#374151';
        ctx.fillText(this._nombrePeriodo(this.periodoB), 50, 65);
    }
    
    _generarInsights() {
        const contenedor = document.getElementById('listaInsights');
        contenedor.innerHTML = '';
        
        const insights = [];
        
        // Insight sobre ingresos
        const difIngresos = this._calcularPorcentajeCambio(
            this.resultadosA.ingresosTotales,
            this.resultadosB.ingresosTotales
        );
        
        if (Math.abs(difIngresos) > 5) {
            const tendencia = difIngresos > 0 ? 'aumentaron' : 'disminuyeron';
            const icono = difIngresos > 0 ? '📈' : '📉';
            insights.push({
                icono: icono,
                texto: `Los ingresos ${tendencia} un ${Math.abs(difIngresos).toFixed(1)}% comparado con ${this._nombrePeriodo(this.periodoB)}.`
            });
        }
        
        // Insight sobre gastos
        const difGastos = this._calcularPorcentajeCambio(
            this.resultadosA.gastosTotales,
            this.resultadosB.gastosTotales
        );
        
        if (Math.abs(difGastos) > 5) {
            const tendencia = difGastos > 0 ? 'aumentaron' : 'disminuyeron';
            const icono = difGastos > 0 ? '⚠️' : '✅';
            insights.push({
                icono: icono,
                texto: `Los gastos ${tendencia} un ${Math.abs(difGastos).toFixed(1)}%. ${difGastos > 10 ? 'Considera revisar tu presupuesto.' : ''}`
            });
        }
        
        // Insight sobre utilidad
        const difUtilidad = this._calcularPorcentajeCambio(
            this.resultadosA.utilidadNeta,
            this.resultadosB.utilidadNeta
        );
        
        if (Math.abs(difUtilidad) > 5) {
            const tendencia = difUtilidad > 0 ? 'mejoró' : 'empeoró';
            const icono = difUtilidad > 0 ? '🎉' : '😟';
            insights.push({
                icono: icono,
                texto: `La utilidad neta ${tendencia} un ${Math.abs(difUtilidad).toFixed(1)}%.`
            });
        }
        
        // Recomendaciones
        if (difIngresos > 0 && difGastos > difIngresos) {
            insights.push({
                icono: '💡',
                texto: 'Aunque tus ingresos crecieron, tus gastos aumentaron más rápido. Considera optimizar costos.'
            });
        }
        
        if (difIngresos < 0 && difGastos < 0 && Math.abs(difGastos) > Math.abs(difIngresos)) {
            insights.push({
                icono: '👍',
                texto: 'Redujiste gastos más de lo que bajaron los ingresos. ¡Buena gestión financiera!'
            });
        }
        
        // Mostrar insights
        insights.forEach(insight => {
            const div = document.createElement('div');
            div.className = 'insight-item';
            div.innerHTML = `
                <span class="insight-icono">${insight.icono}</span>
                <span class="insight-texto">${insight.texto}</span>
            `;
            contenedor.appendChild(div);
        });
        
        if (insights.length === 0) {
            contenedor.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No hay cambios significativos entre ambos períodos.</p>';
        }
    }
    
    _llenarDesglose() {
        const contenedor = document.getElementById('tablaDesglose');
        contenedor.innerHTML = '';
        
        // Encabezado
        const encabezado = document.createElement('div');
        encabezado.className = 'fila-desglose';
        encabezado.innerHTML = `
            <div class="celda-desglose">Categoría</div>
            <div class="celda-desglose">${this._nombrePeriodo(this.periodoA)}</div>
            <div class="celda-desglose">${this._nombrePeriodo(this.periodoB)}</div>
            <div class="celda-desglose">Cambio</div>
        `;
        contenedor.appendChild(encabezado);
        
        // Filas de datos
        const categorias = [
            { nombre: 'Ingresos Totales', a: this.resultadosA.ingresosTotales, b: this.resultadosB.ingresosTotales },
            { nombre: 'Costos de Venta', a: this.resultadosA.costosTotales, b: this.resultadosB.costosTotales },
            { nombre: 'Gastos Operativos', a: this.resultadosA.gastosOperativos?.total || 0, b: this.resultadosB.gastosOperativos?.total || 0 },
            { nombre: 'Utilidad Neta', a: this.resultadosA.utilidadNeta, b: this.resultadosB.utilidadNeta }
        ];
        
        categorias.forEach(cat => {
            const cambio = this._calcularPorcentajeCambio(cat.a, cat.b);
            const icono = cambio >= 0 ? '↗' : '↘';
            const color = cambio >= 0 ? '#10b981' : '#ef4444';
            
            const fila = document.createElement('div');
            fila.className = 'fila-desglose';
            fila.innerHTML = `
                <div class="celda-desglose"><strong>${cat.nombre}</strong></div>
                <div class="celda-desglose">${this._formatearMoneda(cat.a)}</div>
                <div class="celda-desglose">${this._formatearMoneda(cat.b)}</div>
                <div class="celda-desglose" style="color: ${color}; font-weight: 600;">
                    ${icono} ${Math.abs(cambio).toFixed(1)}%
                </div>
            `;
            contenedor.appendChild(fila);
        });
    }
    
    _volverASelector() {
        document.getElementById('resultadosComparacion').style.display = 'none';
        document.getElementById('selectorPeriodos').style.display = 'block';
        document.getElementById('btnVolver').style.display = 'none';
        document.getElementById('btnExportarPDF').style.display = 'none';
    }
    
    _exportarPDF() {
        console.log('📄 Exportando comparación a PDF...');
        
        if (window.exportarComparacionPDF) {
            window.exportarComparacionPDF(this.resultadosA, this.resultadosB, this.periodoA, this.periodoB);
        } else {
            alert('La funcionalidad de exportar PDF estará disponible próximamente.');
        }
    }
    
    _formatearMoneda(valor) {
        if (typeof valor !== 'number') {
            valor = parseFloat(valor) || 0;
        }
        return `S/. ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    abrir() {
        this.modal.style.display = 'flex';
        
        // Reset
        document.getElementById('selectorPeriodos').style.display = 'block';
        document.getElementById('resultadosComparacion').style.display = 'none';
        document.getElementById('selectPeriodoA').value = '';
        document.getElementById('selectPeriodoB').value = '';
        document.getElementById('btnCompararPeriodos').disabled = true;
    }
    
    cerrar() {
        this.modal.style.display = 'none';
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    window.modalComparacion = new ModalComparacion();
    console.log('✅ Modal Comparación inicializado');
});
