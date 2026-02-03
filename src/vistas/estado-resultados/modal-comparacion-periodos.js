/**
 * MODAL COMPARACIÓN DE PERÍODOS - VERSIÓN COMPLETA CON CÁLCULOS REALES
 * Integrado con Estado de Resultados de GRIZALUM
 * v2.0.0 - GRIZALUM
 */

// Protección absoluta contra doble carga
if (typeof window.GRIZ_MODAL_COMPARACION_LOADED !== 'undefined') {
    console.log('⏭️ Modal Comparación ya existe, omitiendo recarga...');
} else {
    window.GRIZ_MODAL_COMPARACION_LOADED = true;

    class ModalComparacionPeriodos {
        constructor() {
            this.version = '2.0.0';
            this.modal = null;
            this.periodoA = null;
            this.periodoB = null;
            this.datosA = null;
            this.datosB = null;
            
            this._crearModal();
            this._configurarEventos();
            console.log('✅ Modal Comparación v2.0.0 con cálculos reales inicializado');
        }
        
        _crearModal() {
            // Eliminar modal existente si hay
            const existente = document.getElementById('modalComparacionPeriodos');
            if (existente) {
                existente.remove();
            }
            
            const htmlModal = `
                <div id="modalComparacionPeriodos" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; z-index: 9999999999; align-items: center; justify-content: center;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 1;"></div>
                    <div style="position: relative; z-index: 2; background: white; border-radius: 16px; width: 1200px; max-width: 95%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                        <!-- Encabezado -->
                        <div style="padding: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 16px 16px 0 0; display: flex; align-items: center; justify-content: space-between;">
                            <h3 style="margin: 0; font-size: 22px; font-weight: 700;">📊 Comparación de Períodos</h3>
                            <button id="btnCerrarComparacion" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 40px; height: 40px; border-radius: 8px; font-size: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;">&times;</button>
                        </div>
                        
                        <!-- Cuerpo -->
                        <div style="padding: 32px; overflow-y: auto; flex: 1;">
                            <!-- Selector -->
                            <div id="seccionSelector">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                                    <span style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">1</span>
                                    <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">Selecciona los períodos a comparar</h4>
                                </div>
                                
                                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 24px; margin-bottom: 24px;">
                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                        <label style="font-weight: 600; color: #374151; font-size: 14px;">📅 Período A (Base):</label>
                                        <select id="selectPeriodoA" style="padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #1f2937; background: white; cursor: pointer;">
                                            <option value="">Seleccionar...</option>
                                            <option value="mes-actual">Mes Actual</option>
                                            <option value="mes-anterior">Mes Anterior</option>
                                            <option value="trimestre-actual">Trimestre Actual</option>
                                            <option value="trimestre-anterior">Trimestre Anterior</option>
                                            <option value="año-actual">Año Actual</option>
                                            <option value="año-anterior">Año Anterior</option>
                                        </select>
                                        <div id="infoA" style="font-size: 12px; color: #6b7280; padding: 8px 12px; background: #f3f4f6; border-radius: 6px; min-height: 34px;"></div>
                                    </div>
                                    
                                    <div style="display: flex; align-items: center; justify-content: center; padding-top: 32px; font-size: 24px; font-weight: 900; color: #667eea;">VS</div>
                                    
                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                        <label style="font-weight: 600; color: #374151; font-size: 14px;">📅 Período B (Comparar):</label>
                                        <select id="selectPeriodoB" style="padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #1f2937; background: white; cursor: pointer;">
                                            <option value="">Seleccionar...</option>
                                            <option value="mes-actual">Mes Actual</option>
                                            <option value="mes-anterior">Mes Anterior</option>
                                            <option value="trimestre-actual">Trimestre Actual</option>
                                            <option value="trimestre-anterior">Trimestre Anterior</option>
                                            <option value="año-actual">Año Actual</option>
                                            <option value="año-anterior">Año Anterior</option>
                                        </select>
                                        <div id="infoB" style="font-size: 12px; color: #6b7280; padding: 8px 12px; background: #f3f4f6; border-radius: 6px; min-height: 34px;"></div>
                                    </div>
                                </div>
                                
                                <button id="btnCompararPeriodos" disabled style="width: 100%; padding: 16px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; opacity: 0.5;">
                                    🔍 Comparar Períodos
                                </button>
                            </div>
                            
                            <!-- Resultados -->
                            <div id="seccionResultados" style="display: none;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">2</span>
                                        <h4 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">Resultados de la Comparación</h4>
                                    </div>
                                    <div id="resumenPeriodos" style="font-size: 13px; color: #6b7280;"></div>
                                </div>
                                
                                <div id="contenidoResultados"></div>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="padding: 20px 32px; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; justify-content: flex-end; background: #f9fafb; border-radius: 0 0 16px 16px;">
                            <button id="btnVolver" style="display: none; padding: 12px 24px; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">← Volver</button>
                            <button id="btnCerrarFooter" style="padding: 12px 24px; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Cerrar</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', htmlModal);
            this.modal = document.getElementById('modalComparacionPeriodos');
        }
        
        _configurarEventos() {
            // Cerrar
            const btnCerrar1 = document.getElementById('btnCerrarComparacion');
            const btnCerrar2 = document.getElementById('btnCerrarFooter');
            
            if (btnCerrar1) btnCerrar1.onclick = () => this.cerrar();
            if (btnCerrar2) btnCerrar2.onclick = () => this.cerrar();
            
            // Selects
            const selectA = document.getElementById('selectPeriodoA');
            const selectB = document.getElementById('selectPeriodoB');
            
            if (selectA) selectA.onchange = () => { this._actualizarInfo('A'); this._validar(); };
            if (selectB) selectB.onchange = () => { this._actualizarInfo('B'); this._validar(); };
            
            // Comparar
            const btnComparar = document.getElementById('btnCompararPeriodos');
            if (btnComparar) {
                btnComparar.onclick = () => {
                    if (!btnComparar.disabled) this._comparar();
                };
            }
            
            // Volver
            const btnVolver = document.getElementById('btnVolver');
            if (btnVolver) btnVolver.onclick = () => this._volver();
        }
        
        _actualizarInfo(letra) {
            const select = document.getElementById(`selectPeriodo${letra}`);
            const info = document.getElementById(`info${letra}`);
            const valor = select ? select.value : '';
            
            if (!valor || !info) {
                if (info) info.textContent = '';
                return;
            }
            
            const rango = this._obtenerRangoPeriodo(valor);
            info.textContent = `${this._formatearFecha(rango.inicio)} - ${this._formatearFecha(rango.fin)}`;
        }
        
        _validar() {
            const selectA = document.getElementById('selectPeriodoA');
            const selectB = document.getElementById('selectPeriodoB');
            const btn = document.getElementById('btnCompararPeriodos');
            
            if (!selectA || !selectB || !btn) return;
            
            const a = selectA.value;
            const b = selectB.value;
            
            if (a && b && a !== b) {
                btn.disabled = false;
                btn.style.opacity = '1';
            } else {
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }
        }
        
        async _comparar() {
            const selectA = document.getElementById('selectPeriodoA');
            const selectB = document.getElementById('selectPeriodoB');
            
            if (!selectA || !selectB) return;
            
            this.periodoA = selectA.value;
            this.periodoB = selectB.value;
            
            console.log('🔍 Comparando:', this.periodoA, 'vs', this.periodoB);
            
            // Obtener datos de ambos períodos
            this.datosA = await this._obtenerDatosEstadoResultados(this.periodoA);
            this.datosB = await this._obtenerDatosEstadoResultados(this.periodoB);
            
            // Ocultar selector
            const selector = document.getElementById('seccionSelector');
            const resultados = document.getElementById('seccionResultados');
            const btnVolver = document.getElementById('btnVolver');
            
            if (selector) selector.style.display = 'none';
            if (resultados) resultados.style.display = 'block';
            if (btnVolver) btnVolver.style.display = 'block';
            
            // Generar resultados
            this._generarResultados();
        }
        
        async _obtenerDatosEstadoResultados(periodo) {
            // Verificar si EstadoResultados está disponible
            if (!window.estadoResultados) {
                console.error('❌ EstadoResultados no disponible');
                return this._datosVacios();
            }
            
            const rango = this._obtenerRangoPeriodo(periodo);
            
            try {
                // Calcular resultados para el período
                const resultados = await window.estadoResultados.calcularResultados(rango.inicio, rango.fin);
                return resultados || this._datosVacios();
            } catch (error) {
                console.error('Error calculando resultados:', error);
                return this._datosVacios();
            }
        }
        
        _obtenerRangoPeriodo(periodo) {
            const ahora = new Date();
            const año = ahora.getFullYear();
            const mes = ahora.getMonth();
            
            switch(periodo) {
                case 'mes-actual':
                    return {
                        inicio: new Date(año, mes, 1),
                        fin: new Date(año, mes + 1, 0, 23, 59, 59, 999)
                    };
                    
                case 'mes-anterior':
                    return {
                        inicio: new Date(año, mes - 1, 1),
                        fin: new Date(año, mes, 0, 23, 59, 59, 999)
                    };
                    
                case 'trimestre-actual':
                    const inicioTrimestre = Math.floor(mes / 3) * 3;
                    return {
                        inicio: new Date(año, inicioTrimestre, 1),
                        fin: new Date(año, inicioTrimestre + 3, 0, 23, 59, 59, 999)
                    };
                    
                case 'trimestre-anterior':
                    const inicioTrimestreAnt = Math.floor(mes / 3) * 3 - 3;
                    return {
                        inicio: new Date(año, inicioTrimestreAnt, 1),
                        fin: new Date(año, inicioTrimestreAnt + 3, 0, 23, 59, 59, 999)
                    };
                    
                case 'año-actual':
                    return {
                        inicio: new Date(año, 0, 1),
                        fin: new Date(año, 11, 31, 23, 59, 59, 999)
                    };
                    
                case 'año-anterior':
                    return {
                        inicio: new Date(año - 1, 0, 1),
                        fin: new Date(año - 1, 11, 31, 23, 59, 59, 999)
                    };
                    
                default:
                    return {
                        inicio: new Date(año, mes, 1),
                        fin: new Date(año, mes + 1, 0, 23, 59, 59, 999)
                    };
            }
        }
        
        _datosVacios() {
            return {
                ingresos: { total: 0, porCategoria: [], cantidad: 0 },
                costos: { total: 0, porCategoria: [], cantidad: 0 },
                gastosOperativos: { total: 0, porCategoria: [], cantidad: 0 },
                gastosFinancieros: { total: 0, porCategoria: [], cantidad: 0 },
                utilidadBruta: 0,
                utilidadOperativa: 0,
                utilidadNeta: 0,
                margenBruto: 0,
                margenOperativo: 0,
                margenNeto: 0
            };
        }
        
        _generarResultados() {
            const contenedor = document.getElementById('contenidoResultados');
            const resumen = document.getElementById('resumenPeriodos');
            
            if (!contenedor) return;
            
            // Resumen de períodos
            if (resumen) {
                resumen.innerHTML = `<strong>${this._nombrePeriodo(this.periodoA)}</strong> vs <strong>${this._nombrePeriodo(this.periodoB)}</strong>`;
            }
            
            // Calcular variaciones
            const variaciones = this._calcularVariaciones();
            
            contenedor.innerHTML = `
                <!-- Métricas principales -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
                    ${this._crearCardMetrica('Ingresos Totales', this.datosA.ingresos.total, this.datosB.ingresos.total, variaciones.ingresos, '#10b981')}
                    ${this._crearCardMetrica('Gastos Totales', this.datosA.costos.total + this.datosA.gastosOperativos.total, this.datosB.costos.total + this.datosB.gastosOperativos.total, variaciones.gastos, '#ef4444')}
                    ${this._crearCardMetrica('Utilidad Neta', this.datosA.utilidadNeta, this.datosB.utilidadNeta, variaciones.utilidadNeta, '#667eea')}
                </div>
                
                <!-- Tabla comparativa detallada -->
                <div style="background: white; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f9fafb;">
                                <th style="padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 700; color: #374151; border-bottom: 1px solid #e5e7eb;">Concepto</th>
                                <th style="padding: 12px 16px; text-align: right; font-size: 13px; font-weight: 700; color: #374151; border-bottom: 1px solid #e5e7eb;">${this._nombrePeriodo(this.periodoA)}</th>
                                <th style="padding: 12px 16px; text-align: right; font-size: 13px; font-weight: 700; color: #374151; border-bottom: 1px solid #e5e7eb;">${this._nombrePeriodo(this.periodoB)}</th>
                                <th style="padding: 12px 16px; text-align: right; font-size: 13px; font-weight: 700; color: #374151; border-bottom: 1px solid #e5e7eb;">Variación</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._crearFilaTabla('Ingresos Totales', this.datosA.ingresos.total, this.datosB.ingresos.total, variaciones.ingresos, '#10b981')}
                            ${this._crearFilaTabla('Costos de Venta', this.datosA.costos.total, this.datosB.costos.total, variaciones.costos, '#f59e0b')}
                            ${this._crearFilaTabla('Utilidad Bruta', this.datosA.utilidadBruta, this.datosB.utilidadBruta, variaciones.utilidadBruta, '#10b981', true)}
                            ${this._crearFilaTabla('Gastos Operativos', this.datosA.gastosOperativos.total, this.datosB.gastosOperativos.total, variaciones.gastosOp, '#ef4444')}
                            ${this._crearFilaTabla('Utilidad Operativa', this.datosA.utilidadOperativa, this.datosB.utilidadOperativa, variaciones.utilidadOp, '#10b981', true)}
                            ${this._crearFilaTabla('Gastos Financieros', this.datosA.gastosFinancieros.total, this.datosB.gastosFinancieros.total, variaciones.gastosFin, '#8b5cf6')}
                            ${this._crearFilaTabla('Utilidad Neta', this.datosA.utilidadNeta, this.datosB.utilidadNeta, variaciones.utilidadNeta, '#667eea', true)}
                        </tbody>
                    </table>
                </div>
                
                <!-- Márgenes -->
                <div style="margin-top: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                    ${this._crearCardMargen('Margen Bruto', this.datosA.margenBruto, this.datosB.margenBruto)}
                    ${this._crearCardMargen('Margen Operativo', this.datosA.margenOperativo, this.datosB.margenOperativo)}
                    ${this._crearCardMargen('Margen Neto', this.datosA.margenNeto, this.datosB.margenNeto)}
                </div>
            `;
        }
        
        _calcularVariaciones() {
            return {
                ingresos: this._calcularVariacion(this.datosA.ingresos.total, this.datosB.ingresos.total),
                costos: this._calcularVariacion(this.datosA.costos.total, this.datosB.costos.total),
                gastos: this._calcularVariacion(
                    this.datosA.costos.total + this.datosA.gastosOperativos.total,
                    this.datosB.costos.total + this.datosB.gastosOperativos.total
                ),
                gastosOp: this._calcularVariacion(this.datosA.gastosOperativos.total, this.datosB.gastosOperativos.total),
                gastosFin: this._calcularVariacion(this.datosA.gastosFinancieros.total, this.datosB.gastosFinancieros.total),
                utilidadBruta: this._calcularVariacion(this.datosA.utilidadBruta, this.datosB.utilidadBruta),
                utilidadOp: this._calcularVariacion(this.datosA.utilidadOperativa, this.datosB.utilidadOperativa),
                utilidadNeta: this._calcularVariacion(this.datosA.utilidadNeta, this.datosB.utilidadNeta)
            };
        }
        
        _calcularVariacion(valorA, valorB) {
            if (valorA === 0) return valorB > 0 ? 100 : 0;
            return ((valorB - valorA) / valorA) * 100;
        }
        
        _crearCardMetrica(titulo, valorA, valorB, variacion, color) {
            const diferencia = valorB - valorA;
            const signo = diferencia >= 0 ? '+' : '';
            const colorVariacion = diferencia >= 0 ? '#10b981' : '#ef4444';
            
            return `
                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px;">
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px; font-weight: 600;">${titulo}</div>
                    <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px;">
                        <div style="font-size: 24px; font-weight: 700; color: ${color};">${this._formatearMoneda(valorB)}</div>
                        <div style="font-size: 14px; color: #9ca3af;">${this._formatearMoneda(valorA)}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 18px;">${diferencia >= 0 ? '📈' : '📉'}</span>
                        <span style="font-size: 14px; font-weight: 700; color: ${colorVariacion};">
                            ${signo}${variacion.toFixed(1)}%
                        </span>
                        <span style="font-size: 12px; color: #6b7280;">
                            (${signo}${this._formatearMoneda(diferencia)})
                        </span>
                    </div>
                </div>
            `;
        }
        
        _crearFilaTabla(concepto, valorA, valorB, variacion, color, negrita = false) {
            const diferencia = valorB - valorA;
            const signo = diferencia >= 0 ? '+' : '';
            const colorVariacion = diferencia >= 0 ? '#10b981' : '#ef4444';
            const peso = negrita ? '700' : '400';
            
            return `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 16px; font-weight: ${peso}; color: #1f2937; font-size: 14px;">${concepto}</td>
                    <td style="padding: 12px 16px; text-align: right; font-weight: ${peso}; color: ${color}; font-size: 14px;">${this._formatearMoneda(valorA)}</td>
                    <td style="padding: 12px 16px; text-align: right; font-weight: ${peso}; color: ${color}; font-size: 14px;">${this._formatearMoneda(valorB)}</td>
                    <td style="padding: 12px 16px; text-align: right; font-weight: 700; color: ${colorVariacion}; font-size: 14px;">
                        ${signo}${variacion.toFixed(1)}%
                    </td>
                </tr>
            `;
        }
        
        _crearCardMargen(titulo, valorA, valorB) {
            // ✅ Protección contra undefined
            valorA = valorA || 0;
            valorB = valorB || 0;
            
            const diferencia = valorB - valorA;
            const signo = diferencia >= 0 ? '+' : '';
            const color = diferencia >= 0 ? '#10b981' : '#ef4444';
            
            return `
                <div style="background: #f9fafb; border-radius: 12px; padding: 16px;">
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px; font-weight: 600;">${titulo}</div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 20px; font-weight: 700; color: #1f2937;">${valorB.toFixed(1)}%</div>
                        <div style="font-size: 13px; color: #9ca3af;">(vs ${valorA.toFixed(1)}%)</div>
                        <div style="font-size: 13px; font-weight: 700; color: ${color}; margin-left: auto;">
                            ${signo}${diferencia.toFixed(1)}pp
                        </div>
                    </div>
                </div>
            `;
        }
        
        _volver() {
            const selector = document.getElementById('seccionSelector');
            const resultados = document.getElementById('seccionResultados');
            const btnVolver = document.getElementById('btnVolver');
            
            if (selector) selector.style.display = 'block';
            if (resultados) resultados.style.display = 'none';
            if (btnVolver) btnVolver.style.display = 'none';
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
        
       _formatearMoneda(valor) {
            try {
                // Fallback para Safari que no soporta Intl correctamente
                const formatted = Math.abs(valor).toFixed(0);
                const parts = formatted.toString().split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return 'S/. ' + (valor < 0 ? '-' : '') + parts.join('.');
            } catch (e) {
                return 'S/. ' + valor.toFixed(0);
            }
        }
        
       _formatearFecha(fecha) {
            try {
                const d = new Date(fecha);
                const dia = String(d.getDate()).padStart(2, '0');
                const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                const mes = meses[d.getMonth()];
                const año = d.getFullYear();
                return `${dia} ${mes} ${año}`;
            } catch (e) {
                return fecha.toString();
            }
        }
        
        abrir() {
            if (!this.modal) return;
            
            this.modal.style.display = 'flex';
            
            // Reset
            const selectA = document.getElementById('selectPeriodoA');
            const selectB = document.getElementById('selectPeriodoB');
            const infoA = document.getElementById('infoA');
            const infoB = document.getElementById('infoB');
            const selector = document.getElementById('seccionSelector');
            const resultados = document.getElementById('seccionResultados');
            const btnVolver = document.getElementById('btnVolver');
            
            if (selectA) selectA.value = '';
            if (selectB) selectB.value = '';
            if (infoA) infoA.textContent = '';
            if (infoB) infoB.textContent = '';
            if (selector) selector.style.display = 'block';
            if (resultados) resultados.style.display = 'none';
            if (btnVolver) btnVolver.style.display = 'none';
            
            this._validar();
            
            console.log('✅ Modal abierto v' + this.version);
        }
        
        cerrar() {
            if (this.modal) {
                this.modal.style.display = 'none';
                console.log('✅ Modal cerrado');
            }
        }
    }

    // Crear instancia única
    if (!window.modalComparacionPeriodos) {
        window.modalComparacionPeriodos = new ModalComparacionPeriodos();
    }
    
    console.log('📊 Modal Comparación v2.0.0 - Completo con cálculos reales');
}
