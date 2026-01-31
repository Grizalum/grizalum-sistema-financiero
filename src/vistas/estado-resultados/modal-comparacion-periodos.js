/**
 * ═══════════════════════════════════════════════════════════════════
 * MODAL COMPARACIÓN DE PERÍODOS - Estado de Resultados
 * Comparación avanzada entre dos períodos con análisis automático
 * Versión: 1.0.0 - Todo en español
 * ═══════════════════════════════════════════════════════════════════
 */

class ModalComparacionPeriodos {
    constructor() {
        this.version = '1.0.0';
        this.modal = null;
        this.periodoA = null;
        this.periodoB = null;
        this.resultadosA = null;
        this.resultadosB = null;
        this.estadoResultados = null;
        
        this._inicializar();
    }
    
    _inicializar() {
        this._crearModal();
        this._inyectarEstilos();
        this._configurarEventos();
    }
    
    _crearModal() {
        const htmlModal = `
            <div id="modalComparacionPeriodos" class="modal-comparacion-overlay" style="display: none;">
                <div class="modal-comparacion-contenedor">
                    <!-- ENCABEZADO -->
                    <div class="modal-comparacion-encabezado">
                        <h3>📊 Comparación de Períodos</h3>
                        <button class="modal-comparacion-cerrar" id="btnCerrarComparacion">&times;</button>
                    </div>
                    
                    <!-- CUERPO -->
                    <div class="modal-comparacion-cuerpo">
                        <!-- PASO 1: Seleccionar Períodos -->
                        <div id="seccionSelectorPeriodos" class="seccion-selector-periodos">
                            <div class="titulo-seccion">
                                <span class="numero-paso">1</span>
                                <h4>Selecciona los períodos a comparar</h4>
                            </div>
                            
                            <div class="grilla-periodos">
                                <!-- Período A -->
                                <div class="selector-periodo">
                                    <label class="etiqueta-periodo">📅 Período A (Base):</label>
                                    <select id="selectPeriodoA" class="select-periodo">
                                        <option value="">Seleccionar...</option>
                                        <option value="mes-actual">Mes Actual (Enero 2026)</option>
                                        <option value="mes-anterior">Mes Anterior (Diciembre 2025)</option>
                                        <option value="trimestre-actual">Trimestre Actual</option>
                                        <option value="trimestre-anterior">Trimestre Anterior</option>
                                        <option value="año-actual">Año Actual (2026)</option>
                                        <option value="año-anterior">Año Anterior (2025)</option>
                                    </select>
                                    <div id="infoRangoA" class="info-rango"></div>
                                </div>
                                
                                <!-- VS -->
                                <div class="comparacion-vs">
                                    <span>VS</span>
                                </div>
                                
                                <!-- Período B -->
                                <div class="selector-periodo">
                                    <label class="etiqueta-periodo">📅 Período B (Comparar):</label>
                                    <select id="selectPeriodoB" class="select-periodo">
                                        <option value="">Seleccionar...</option>
                                        <option value="mes-actual">Mes Actual (Enero 2026)</option>
                                        <option value="mes-anterior">Mes Anterior (Diciembre 2025)</option>
                                        <option value="trimestre-actual">Trimestre Actual</option>
                                        <option value="trimestre-anterior">Trimestre Anterior</option>
                                        <option value="año-actual">Año Actual (2026)</option>
                                        <option value="año-anterior">Año Anterior (2025)</option>
                                    </select>
                                    <div id="infoRangoB" class="info-rango"></div>
                                </div>
                            </div>
                            
                            <button id="btnCompararAhora" class="boton-comparar-ahora" disabled>
                                🔍 Comparar Períodos
                            </button>
                        </div>
                        
                        <!-- PASO 2: Resultados -->
                        <div id="seccionResultados" class="seccion-resultados" style="display: none;">
                            <!-- Spinner de carga -->
                            <div id="spinnerCarga" class="spinner-carga">
                                <div class="spinner"></div>
                                <p>Calculando comparación...</p>
                            </div>
                            
                            <!-- Resultados -->
                            <div id="contenedorResultados" class="contenedor-resultados" style="display: none;">
                                <div class="titulo-seccion">
                                    <span class="numero-paso">2</span>
                                    <h4>Resultados de la Comparación</h4>
                                </div>
                                
                                <!-- Resumen ejecutivo -->
                                <div id="resumenEjecutivo" class="resumen-ejecutivo"></div>
                                
                                <!-- Tarjetas comparativas -->
                                <div id="tarjetasComparativas" class="tarjetas-comparativas"></div>
                                
                                <!-- Gráfico comparativo -->
                                <div id="graficoComparativo" class="grafico-comparativo"></div>
                                
                                <!-- Insights automáticos -->
                                <div id="insightsAutomaticos" class="insights-automaticos"></div>
                                
                                <!-- Desglose por categorías -->
                                <div id="desgloseCategorias" class="desglose-categorias"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- PIE -->
                    <div class="modal-comparacion-pie">
                        <button class="boton-secundario" id="btnVolverSelector" style="display: none;">
                            ← Volver a Selector
                        </button>
                        <button class="boton-primario" id="btnExportarPDF" style="display: none;">
                            📄 Exportar a PDF
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', htmlModal);
        this.modal = document.getElementById('modalComparacionPeriodos');
    }
    
    _inyectarEstilos() {
        if (document.getElementById('estilosModalComparacion')) return;
        
        const estilos = `
            <style id="estilosModalComparacion">
                /* Overlay */
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
                    backdrop-filter: blur(4px);
                }
                
                /* Contenedor principal */
                .modal-comparacion-contenedor {
                    background: white;
                    border-radius: 16px;
                    width: 95%;
                    max-width: 1200px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease;
                    pointer-events: auto !important;
                }
                
                .modal-comparacion-contenedor * {
                    pointer-events: auto !important;
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Encabezado */
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
                    font-weight: 700;
                }
                
                .modal-comparacion-cerrar {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 32px;
                    width: 40px;
                    height: 40px;
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
                
                /* Cuerpo */
                .modal-comparacion-cuerpo {
                    padding: 32px;
                    overflow-y: auto;
                    flex: 1;
                }
                
                /* Título de sección */
                .titulo-seccion {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                
                .numero-paso {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                }
                
                .titulo-seccion h4 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                /* Grilla de períodos */
                .grilla-periodos {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: 24px;
                    align-items: start;
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
                    font-weight: 500;
                    color: #1f2937;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .select-periodo:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .info-rango {
                    font-size: 12px;
                    color: #6b7280;
                    padding: 8px 12px;
                    background: #f3f4f6;
                    border-radius: 6px;
                    margin-top: 4px;
                }
                
                /* VS */
                .comparacion-vs {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 32px;
                }
                
                .comparacion-vs span {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                /* Botón comparar */
                .boton-comparar-ahora {
                    width: 100%;
                    padding: 16px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                .boton-comparar-ahora:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                }
                
                .boton-comparar-ahora:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                
                /* Spinner */
                .spinner-carga {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                }
                
                .spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid #e5e7eb;
                    border-top-color: #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .spinner-carga p {
                    margin-top: 16px;
                    color: #6b7280;
                    font-size: 14px;
                }
                
                /* Resultados */
                .resumen-ejecutivo {
                    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
                    border: 2px solid #667eea40;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                }
                
                .tarjetas-comparativas {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 24px;
                }
                
                .tarjeta-comparativa {
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.2s;
                }
                
                .tarjeta-comparativa:hover {
                    border-color: #667eea;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
                }
                
                /* Pie */
                .modal-comparacion-pie {
                    padding: 20px 32px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
                
                .boton-secundario,
                .boton-primario {
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                
                .boton-secundario {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .boton-secundario:hover {
                    background: #e5e7eb;
                }
                
                .boton-primario {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .boton-primario:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .grilla-periodos {
                        grid-template-columns: 1fr;
                    }
                    
                    .comparacion-vs {
                        padding: 12px 0;
                    }
                    
                    .tarjetas-comparativas {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', estilos);
    }
    
    _configurarEventos() {
        // Cerrar modal
        document.getElementById('btnCerrarComparacion').addEventListener('click', () => {
            this.cerrar();
        });
        
        // Cambios en selectores
        document.getElementById('selectPeriodoA').addEventListener('change', () => {
            this._actualizarInfoRango('A');
            this._validarSeleccion();
        });
        
        document.getElementById('selectPeriodoB').addEventListener('change', () => {
            this._actualizarInfoRango('B');
            this._validarSeleccion();
        });
        
        // Botón comparar
        document.getElementById('btnCompararAhora').addEventListener('click', () => {
            this._ejecutarComparacion();
        });
        
        // Volver
        document.getElementById('btnVolverSelector').addEventListener('click', () => {
            this._volverASelector();
        });
        
        // Exportar PDF
        document.getElementById('btnExportarPDF').addEventListener('click', () => {
            this._exportarAPDF();
        });
    }
    
    _actualizarInfoRango(letra) {
        const select = document.getElementById(`selectPeriodo${letra}`);
        const info = document.getElementById(`infoRango${letra}`);
        const valor = select.value;
        
        if (!valor) {
            info.textContent = '';
            return;
        }
        
        // Obtener rango del período
        const mapaPeriodos = {
            'mes-actual': 'mes',
            'mes-anterior': 'mes',
            'trimestre-actual': 'trimestre',
            'trimestre-anterior': 'trimestre',
            'año-actual': 'año',
            'año-anterior': 'año'
        };
        
        const periodoId = mapaPeriodos[valor];
        let rango;
        
        if (valor.includes('anterior')) {
            rango = window.EstadoResultadosConfig.calcularPeriodoAnterior(periodoId);
        } else {
            rango = window.EstadoResultadosConfig.obtenerRangoPeriodo(periodoId);
        }
        
        const fechaInicio = rango.inicio.toLocaleDateString('es-PE');
        const fechaFin = rango.fin.toLocaleDateString('es-PE');
        
        info.textContent = `📅 ${fechaInicio} - ${fechaFin}`;
    }
    
    _validarSeleccion() {
        const periodoA = document.getElementById('selectPeriodoA').value;
        const periodoB = document.getElementById('selectPeriodoB').value;
        const boton = document.getElementById('btnCompararAhora');
        
        if (periodoA && periodoB && periodoA !== periodoB) {
            boton.disabled = false;
        } else {
            boton.disabled = true;
        }
    }
    
    async _ejecutarComparacion() {
        // Ocultar selector
        document.getElementById('seccionSelectorPeriodos').style.display = 'none';
        
        // Mostrar resultados con spinner
        const seccionResultados = document.getElementById('seccionResultados');
        seccionResultados.style.display = 'block';
        document.getElementById('spinnerCarga').style.display = 'flex';
        document.getElementById('contenedorResultados').style.display = 'none';
        
        // Simular cálculo (esperar un poco para efecto visual)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Obtener períodos
        this.periodoA = document.getElementById('selectPeriodoA').value;
        this.periodoB = document.getElementById('selectPeriodoB').value;
        
        // Calcular resultados
        this.resultadosA = await this._calcularResultadosPeriodo(this.periodoA);
        this.resultadosB = await this._calcularResultadosPeriodo(this.periodoB);
        
        // Generar comparación
        this._generarComparacion();
        
        // Ocultar spinner y mostrar resultados
        document.getElementById('spinnerCarga').style.display = 'none';
        document.getElementById('contenedorResultados').style.display = 'block';
        
        // Mostrar botones del pie
        document.getElementById('btnVolverSelector').style.display = 'block';
        document.getElementById('btnExportarPDF').style.display = 'block';
    }
    
    async _calcularResultadosPeriodo(periodoValor) {
        // Mapear valor del select al período real
        const mapaPeriodos = {
            'mes-actual': 'mes',
            'mes-anterior': 'mes',
            'trimestre-actual': 'trimestre',
            'trimestre-anterior': 'trimestre',
            'año-actual': 'año',
            'año-anterior': 'año'
        };
        
        const periodoId = mapaPeriodos[periodoValor];
        let rango;
        
        if (periodoValor.includes('anterior')) {
            rango = window.EstadoResultadosConfig.calcularPeriodoAnterior(periodoId);
        } else {
            rango = window.EstadoResultadosConfig.obtenerRangoPeriodo(periodoId);
        }
        
        // Usar el módulo de Estado de Resultados para calcular
        if (window.estadoResultados) {
            // Obtener transacciones del rango
            const transacciones = window.estadoResultados._obtenerTransaccionesDeFlujoCaja(rango.inicio, rango.fin);
            
            // Clasificar
            const clasificadas = window.estadoResultados._clasificarTransacciones(transacciones);
            
            // Calcular totales
            const ingresos = window.estadoResultados._calcularTotales(clasificadas.ingresos);
            const costos = window.estadoResultados._calcularTotales(clasificadas.costos);
            const gastosOperativos = window.estadoResultados._calcularTotales(clasificadas.gastosOperativos);
            const gastosFinancieros = window.estadoResultados._calcularTotales(clasificadas.gastosFinancieros);
            
            const utilidadBruta = ingresos.total - costos.total;
            const utilidadOperativa = utilidadBruta - gastosOperativos.total;
            const utilidadNeta = utilidadOperativa - gastosFinancieros.total;
            
            return {
                periodo: periodoValor,
                rango: rango,
                ingresos: ingresos.total,
                costos: costos.total,
                gastosOperativos: gastosOperativos.total,
                gastosFinancieros: gastosFinancieros.total,
                utilidadBruta: utilidadBruta,
                utilidadOperativa: utilidadOperativa,
                utilidadNeta: utilidadNeta,
                transacciones: transacciones.length
            };
        }
        
        // Fallback
        return {
            periodo: periodoValor,
            rango: rango,
            ingresos: 0,
            costos: 0,
            gastosOperativos: 0,
            gastosFinancieros: 0,
            utilidadBruta: 0,
            utilidadOperativa: 0,
            utilidadNeta: 0,
            transacciones: 0
        };
    }
    
    _generarComparacion() {
        // Generar cada sección
        this._generarResumenEjecutivo();
        this._generarTarjetasComparativas();
        this._generarGraficoComparativo();
        this._generarInsights();
        this._generarDesgloseCategorias();
    }
    
    _generarResumenEjecutivo() {
        const contenedor = document.getElementById('resumenEjecutivo');
        
        const nombreA = this._obtenerNombrePeriodo(this.periodoA);
        const nombreB = this._obtenerNombrePeriodo(this.periodoB);
        
        const cambioIngresos = this._calcularCambio(this.resultadosA.ingresos, this.resultadosB.ingresos);
        const cambioGastos = this._calcularCambio(this.resultadosA.gastosOperativos, this.resultadosB.gastosOperativos);
        const cambioUtilidad = this._calcularCambio(this.resultadosA.utilidadNeta, this.resultadosB.utilidadNeta);
        
        let tendenciaGeneral = 'neutral';
        if (cambioUtilidad.porcentaje > 10) tendenciaGeneral = 'positiva';
        else if (cambioUtilidad.porcentaje < -10) tendenciaGeneral = 'negativa';
        
        const emojiTendencia = tendenciaGeneral === 'positiva' ? '📈' : tendenciaGeneral === 'negativa' ? '📉' : '➡️';
        
        contenedor.innerHTML = `
            <h5 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #1f2937;">
                ${emojiTendencia} Resumen Ejecutivo
            </h5>
            <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                Comparación entre <strong>${nombreA}</strong> y <strong>${nombreB}</strong>. 
                Los ingresos ${cambioIngresos.texto}, los gastos ${cambioGastos.texto} y 
                la utilidad neta ${cambioUtilidad.texto}.
            </p>
        `;
    }
    
    _generarTarjetasComparativas() {
        const contenedor = document.getElementById('tarjetasComparativas');
        
        const metricas = [
            { titulo: 'Ingresos Totales', a: this.resultadosA.ingresos, b: this.resultadosB.ingresos, icono: '💰', tipo: 'ingresos' },
            { titulo: 'Gastos Operativos', a: this.resultadosA.gastosOperativos, b: this.resultadosB.gastosOperativos, icono: '💸', tipo: 'gastos' },
            { titulo: 'Utilidad Neta', a: this.resultadosA.utilidadNeta, b: this.resultadosB.utilidadNeta, icono: '🏆', tipo: 'utilidad' }
        ];
        
        contenedor.innerHTML = metricas.map(m => {
            const cambio = this._calcularCambio(m.a, m.b);
            const colorCambio = cambio.esPositivo ? '#10b981' : '#ef4444';
            const iconoFlecha = cambio.esPositivo ? '↗' : '↘';
            
            return `
                <div class="tarjeta-comparativa">
                    <div style="font-size: 32px; margin-bottom: 8px;">${m.icono}</div>
                    <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 12px;">
                        ${m.titulo}
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center;">
                        <div>
                            <div style="font-size: 11px; color: #9ca3af; margin-bottom: 4px;">Período A</div>
                            <div style="font-size: 18px; font-weight: 700; color: #1f2937;">
                                ${this._formatearMoneda(m.a)}
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 900; color: ${colorCambio};">
                                ${iconoFlecha}
                            </div>
                            <div style="font-size: 12px; font-weight: 700; color: ${colorCambio};">
                                ${cambio.porcentaje > 0 ? '+' : ''}${cambio.porcentaje.toFixed(1)}%
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: #9ca3af; margin-bottom: 4px;">Período B</div>
                            <div style="font-size: 18px; font-weight: 700; color: #1f2937;">
                                ${this._formatearMoneda(m.b)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    _generarGraficoComparativo() {
        const contenedor = document.getElementById('graficoComparativo');
        
        contenedor.innerHTML = `
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                <h5 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1f2937;">
                    📊 Gráfico Comparativo
                </h5>
                <canvas id="canvasGraficoComparacion" style="max-height: 300px;"></canvas>
            </div>
        `;
        
        // Dibujar gráfico
        setTimeout(() => this._dibujarGrafico(), 100);
    }
    
    _dibujarGrafico() {
        const canvas = document.getElementById('canvasGraficoComparacion');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const ancho = canvas.parentElement.clientWidth;
        const alto = 300;
        
        canvas.width = ancho;
        canvas.height = alto;
        
        const nombreA = this._obtenerNombrePeriodo(this.periodoA);
        const nombreB = this._obtenerNombrePeriodo(this.periodoB);
        
        const datos = [
            { label: 'Ingresos', a: this.resultadosA.ingresos, b: this.resultadosB.ingresos, color: '#10b981' },
            { label: 'Gastos', a: this.resultadosA.gastosOperativos, b: this.resultadosB.gastosOperativos, color: '#ef4444' },
            { label: 'Utilidad', a: this.resultadosA.utilidadNeta, b: this.resultadosB.utilidadNeta, color: '#667eea' }
        ];
        
        const maxValor = Math.max(...datos.flatMap(d => [Math.abs(d.a), Math.abs(d.b)]));
        const padding = 60;
        const barHeight = 40;
        const groupSpacing = 80;
        
        datos.forEach((dato, i) => {
            const y = padding + i * groupSpacing;
            
            // Label
            ctx.fillStyle = '#374151';
            ctx.font = '14px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(dato.label, padding - 10, y + barHeight);
            
            // Barra A
            const anchoA = (Math.abs(dato.a) / maxValor) * (ancho - padding * 2 - 100);
            ctx.fillStyle = dato.color;
            ctx.fillRect(padding, y, anchoA, barHeight);
            
            // Valor A
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 12px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText(this._formatearMoneda(dato.a), padding + anchoA + 5, y + barHeight / 2 + 4);
            
            // Barra B
            const anchoB = (Math.abs(dato.b) / maxValor) * (ancho - padding * 2 - 100);
            ctx.fillStyle = dato.color + '80';
            ctx.fillRect(padding, y + barHeight + 8, anchoB, barHeight);
            
            // Valor B
            ctx.fillText(this._formatearMoneda(dato.b), padding + anchoB + 5, y + barHeight + 8 + barHeight / 2 + 4);
        });
        
        // Leyenda
        ctx.fillStyle = '#667eea';
        ctx.fillRect(padding, alto - 40, 15, 15);
        ctx.fillStyle = '#374151';
        ctx.font = '12px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText(nombreA, padding + 20, alto - 28);
        
        ctx.fillStyle = '#667eea80';
        ctx.fillRect(padding + 150, alto - 40, 15, 15);
        ctx.fillStyle = '#374151';
        ctx.fillText(nombreB, padding + 170, alto - 28);
    }
    
    _generarInsights() {
        const contenedor = document.getElementById('insightsAutomaticos');
        
        const insights = [];
        
        // Insight de ingresos
        const cambioIngresos = this._calcularCambio(this.resultadosA.ingresos, this.resultadosB.ingresos);
        if (Math.abs(cambioIngresos.porcentaje) > 5) {
            const icono = cambioIngresos.esPositivo ? '✅' : '⚠️';
            const mensaje = cambioIngresos.esPositivo 
                ? `Excelente crecimiento en ingresos de ${cambioIngresos.porcentaje.toFixed(1)}%`
                : `Disminución de ingresos de ${Math.abs(cambioIngresos.porcentaje).toFixed(1)}% - Requiere atención`;
            insights.push({ icono, mensaje, tipo: cambioIngresos.esPositivo ? 'positivo' : 'alerta' });
        }
        
        // Insight de gastos
        const cambioGastos = this._calcularCambio(this.resultadosA.gastosOperativos, this.resultadosB.gastosOperativos);
        if (Math.abs(cambioGastos.porcentaje) > 5) {
            const icono = cambioGastos.esPositivo ? '⚠️' : '✅';
            const mensaje = cambioGastos.esPositivo 
                ? `Los gastos aumentaron ${cambioGastos.porcentaje.toFixed(1)}% - Revisar control de costos`
                : `Reducción eficiente de gastos en ${Math.abs(cambioGastos.porcentaje).toFixed(1)}%`;
            insights.push({ icono, mensaje, tipo: cambioGastos.esPositivo ? 'alerta' : 'positivo' });
        }
        
        // Insight de utilidad
        const cambioUtilidad = this._calcularCambio(this.resultadosA.utilidadNeta, this.resultadosB.utilidadNeta);
        if (Math.abs(cambioUtilidad.porcentaje) > 10) {
            const icono = cambioUtilidad.esPositivo ? '🎉' : '🚨';
            const mensaje = cambioUtilidad.esPositivo 
                ? `Rentabilidad mejoró significativamente en ${cambioUtilidad.porcentaje.toFixed(1)}%`
                : `Utilidad neta disminuyó ${Math.abs(cambioUtilidad.porcentaje).toFixed(1)}% - Acción urgente requerida`;
            insights.push({ icono, mensaje, tipo: cambioUtilidad.esPositivo ? 'positivo' : 'critico' });
        }
        
        if (insights.length === 0) {
            insights.push({ icono: 'ℹ️', mensaje: 'Ambos períodos muestran resultados similares', tipo: 'neutro' });
        }
        
        const coloresTipo = {
            'positivo': '#10b981',
            'alerta': '#f59e0b',
            'critico': '#ef4444',
            'neutro': '#6b7280'
        };
        
        contenedor.innerHTML = `
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h5 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1f2937;">
                    💡 Insights Automáticos
                </h5>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${insights.map(insight => `
                        <div style="display: flex; align-items: start; gap: 12px; padding: 12px; background: ${coloresTipo[insight.tipo]}15; border-left: 4px solid ${coloresTipo[insight.tipo]}; border-radius: 8px;">
                            <span style="font-size: 20px;">${insight.icono}</span>
                            <span style="font-size: 14px; color: #1f2937; line-height: 1.5;">${insight.mensaje}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    _generarDesgloseCategorias() {
        const contenedor = document.getElementById('desgloseCategorias');
        
        contenedor.innerHTML = `
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                <h5 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1f2937;">
                    📋 Desglose Detallado
                </h5>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                    ${this._generarDetalleMetrica('Ingresos', this.resultadosA.ingresos, this.resultadosB.ingresos)}
                    ${this._generarDetalleMetrica('Costos', this.resultadosA.costos, this.resultadosB.costos)}
                    ${this._generarDetalleMetrica('Gastos Operativos', this.resultadosA.gastosOperativos, this.resultadosB.gastosOperativos)}
                    ${this._generarDetalleMetrica('Gastos Financieros', this.resultadosA.gastosFinancieros, this.resultadosB.gastosFinancieros)}
                    ${this._generarDetalleMetrica('Utilidad Bruta', this.resultadosA.utilidadBruta, this.resultadosB.utilidadBruta)}
                    ${this._generarDetalleMetrica('Utilidad Operativa', this.resultadosA.utilidadOperativa, this.resultadosB.utilidadOperativa)}
                </div>
            </div>
        `;
    }
    
    _generarDetalleMetrica(nombre, valorA, valorB) {
        const cambio = this._calcularCambio(valorA, valorB);
        const colorCambio = cambio.esPositivo ? '#10b981' : '#ef4444';
        
        return `
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px; font-weight: 600;">
                    ${nombre}
                </div>
                <div style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">
                    ${this._formatearMoneda(valorA)}
                </div>
                <div style="font-size: 12px; color: #6b7280;">
                    vs ${this._formatearMoneda(valorB)}
                </div>
                <div style="font-size: 13px; font-weight: 700; color: ${colorCambio}; margin-top: 4px;">
                    ${cambio.porcentaje > 0 ? '+' : ''}${cambio.porcentaje.toFixed(1)}%
                </div>
            </div>
        `;
    }
    
    _volverASelector() {
        document.getElementById('seccionResultados').style.display = 'none';
        document.getElementById('seccionSelectorPeriodos').style.display = 'block';
        document.getElementById('btnVolverSelector').style.display = 'none';
        document.getElementById('btnExportarPDF').style.display = 'none';
    }
    
    _exportarAPDF() {
        alert('Función de exportar a PDF en desarrollo');
        // TODO: Implementar exportación a PDF
    }
    
    _calcularCambio(valorA, valorB) {
        if (valorB === 0) {
            return {
                absoluto: valorA,
                porcentaje: 0,
                esPositivo: valorA > 0,
                texto: valorA > 0 ? 'aumentaron' : 'disminuyeron'
            };
        }
        
        const diferencia = valorA - valorB;
        const porcentaje = (diferencia / Math.abs(valorB)) * 100;
        
        return {
            absoluto: diferencia,
            porcentaje: porcentaje,
            esPositivo: diferencia > 0,
            texto: diferencia > 0 ? `aumentaron ${porcentaje.toFixed(1)}%` : `disminuyeron ${Math.abs(porcentaje).toFixed(1)}%`
        };
    }
    
    _obtenerNombrePeriodo(periodoValor) {
        const mapa = {
            'mes-actual': 'Mes Actual',
            'mes-anterior': 'Mes Anterior',
            'trimestre-actual': 'Trimestre Actual',
            'trimestre-anterior': 'Trimestre Anterior',
            'año-actual': 'Año Actual',
            'año-anterior': 'Año Anterior'
        };
        return mapa[periodoValor] || periodoValor;
    }
    
    _formatearMoneda(valor) {
        if (typeof valor !== 'number') valor = parseFloat(valor) || 0;
        return `S/. ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    // API Pública
    abrir() {
        this.modal.style.display = 'flex';
        
        // Reset
        document.getElementById('selectPeriodoA').value = '';
        document.getElementById('selectPeriodoB').value = '';
        document.getElementById('seccionSelectorPeriodos').style.display = 'block';
        document.getElementById('seccionResultados').style.display = 'none';
        document.getElementById('btnVolverSelector').style.display = 'none';
        document.getElementById('btnExportarPDF').style.display = 'none';
        this._validarSeleccion();
    }
    
    cerrar() {
        this.modal.style.display = 'none';
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.modalComparacionPeriodos = new ModalComparacionPeriodos();
    });
} else {
    window.modalComparacionPeriodos = new ModalComparacionPeriodos();
}

console.log('📊 Modal Comparación de Períodos v1.0.0 cargado');
