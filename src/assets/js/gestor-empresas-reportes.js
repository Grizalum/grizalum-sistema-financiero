/**
 * ================================================================
 * GRIZALUM GESTOR DE EMPRESAS - REPORTES Y ESTADÍSTICAS
 * Sistema completo de análisis y reportes empresariales
 * Versión: 2.0 - Adaptado para empresas peruanas
 * ================================================================
 */

class ReportesEmpresas {
    constructor(gestorPrincipal) {
        this.gestor = gestorPrincipal;
        this.tiposReporte = {
            'resumen-financiero': 'Resumen Financiero',
            'comparativo-empresas': 'Comparativo entre Empresas',
            'analisis-rentabilidad': 'Análisis de Rentabilidad',
            'reporte-flujo-caja': 'Reporte de Flujo de Caja',
            'ranking-empresas': 'Ranking de Empresas',
            'proyecciones': 'Proyecciones Financieras'
        };
        
        this.configurarEstilosReportes();
    }

    // ================================================================
    // CONFIGURACIÓN DE ESTILOS
    // ================================================================
    
    configurarEstilosReportes() {
        const estilos = document.createElement('style');
        estilos.id = 'grizalum-reportes-estilos';
        estilos.textContent = `
            /* Reportes - Estilos */
            .panel-reportes {
                position: fixed;
                top: 0; left: -450px;
                width: 420px;
                height: 100vh;
                background: white;
                box-shadow: 5px 0 20px rgba(0, 0, 0, 0.2);
                z-index: 15000;
                transition: left 0.3s ease;
                overflow-y: auto;
            }
            
            .panel-reportes.abierto {
                left: 0;
            }
            
            .cabecera-reportes {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                padding: 2rem;
                position: sticky;
                top: 0;
                z-index: 1;
            }
            
            .titulo-reportes {
                font-size: 1.3rem;
                font-weight: 700;
                margin: 0 0 0.5rem 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .subtitulo-reportes {
                font-size: 0.9rem;
                opacity: 0.9;
                margin: 0;
            }
            
            .boton-cerrar-reportes {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .boton-cerrar-reportes:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }
            
            .contenido-reportes {
                padding: 1.5rem;
            }
            
            .seccion-reporte {
                margin-bottom: 2rem;
            }
            
            .titulo-seccion-reporte {
                font-size: 1rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e5e7eb;
            }
            
            .tipos-reporte {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .tipo-reporte {
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .tipo-reporte:hover {
                border-color: #059669;
                background: rgba(5, 150, 105, 0.05);
                transform: translateX(5px);
            }
            
            .icono-tipo-reporte {
                width: 45px;
                height: 45px;
                background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .tipo-reporte:hover .icono-tipo-reporte {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                transform: scale(1.1);
            }
            
            .info-tipo-reporte {
                flex: 1;
            }
            
            .nombre-tipo-reporte {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 0.25rem;
            }
            
            .descripcion-tipo-reporte {
                font-size: 0.85rem;
                color: #6b7280;
                line-height: 1.4;
            }
            
            /* Modal de reporte */
            .modal-reporte {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 25000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .modal-reporte.mostrar {
                opacity: 1;
                visibility: visible;
            }
            
            .contenido-modal-reporte {
                background: white;
                border-radius: 20px;
                width: 95%;
                max-width: 1000px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                animation: modalReporteEntrada 0.3s ease;
            }
            
            @keyframes modalReporteEntrada {
                from { opacity: 0; transform: scale(0.9) translateY(-20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            
            .cabecera-modal-reporte {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .titulo-modal-reporte {
                font-size: 1.5rem;
                font-weight: 800;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .acciones-reporte {
                display: flex;
                gap: 1rem;
            }
            
            .boton-accion-reporte {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                padding: 0.75rem 1.25rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
            }
            
            .boton-accion-reporte:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
            
            .cuerpo-modal-reporte {
                padding: 2rem;
                max-height: 70vh;
                overflow-y: auto;
            }
            
            /* Estadísticas generales */
            .estadisticas-generales {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .estadistica-card {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 12px;
                padding: 1.5rem;
                text-align: center;
                border: 1px solid #e5e7eb;
                transition: all 0.3s ease;
            }
            
            .estadistica-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            }
            
            .estadistica-valor {
                font-size: 2rem;
                font-weight: 900;
                color: #059669;
                margin-bottom: 0.5rem;
                display: block;
            }
            
            .estadistica-label {
                font-size: 0.9rem;
                color: #6b7280;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .estadistica-descripcion {
                font-size: 0.8rem;
                color: #9ca3af;
                margin-top: 0.25rem;
            }
            
            /* Tabla de empresas */
            .tabla-empresas {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            
            .tabla-empresas th {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                padding: 1rem;
                text-align: left;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .tabla-empresas td {
                padding: 1rem;
                border-bottom: 1px solid #f1f5f9;
                color: #374151;
            }
            
            .tabla-empresas tr:hover {
                background: #f8fafc;
            }
            
            .empresa-nombre-tabla {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 600;
            }
            
            .empresa-icono-tabla {
                font-size: 1.2rem;
            }
            
            .valor-positivo {
                color: #059669;
                font-weight: 600;
            }
            
            .valor-negativo {
                color: #dc2626;
                font-weight: 600;
            }
            
            .valor-neutro {
                color: #6b7280;
                font-weight: 600;
            }
            
            /* Gráficos simples */
            .grafico-simple {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                border: 1px solid #e5e7eb;
            }
            
            .titulo-grafico {
                font-size: 1.1rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .barras-grafico {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .barra-empresa {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .barra-nombre {
                min-width: 120px;
                font-weight: 600;
                color: #374151;
                font-size: 0.9rem;
            }
            
            .barra-visual {
                flex: 1;
                height: 25px;
                background: #f1f5f9;
                border-radius: 12px;
                overflow: hidden;
                position: relative;
            }
            
            .barra-relleno {
                height: 100%;
                background: linear-gradient(90deg, #059669 0%, #10b981 100%);
                border-radius: 12px;
                transition: width 1s ease;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 0.5rem;
            }
            
            .barra-valor {
                color: white;
                font-weight: 600;
                font-size: 0.8rem;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }
            
            /* Botón flotante para reportes */
            .boton-reportes-flotante {
                position: fixed;
                bottom: 8rem;
                right: 2rem;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }
            
            .boton-reportes-flotante:hover {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 12px 35px rgba(5, 150, 105, 0.5);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .panel-reportes {
                    width: 100vw;
                    left: -100vw;
                }
                
                .contenido-modal-reporte {
                    width: 98%;
                    margin: 1rem;
                }
                
                .estadisticas-generales {
                    grid-template-columns: 1fr;
                }
                
                .tabla-empresas {
                    font-size: 0.8rem;
                }
                
                .tabla-empresas th,
                .tabla-empresas td {
                    padding: 0.75rem 0.5rem;
                }
                
                .barra-empresa {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0.5rem;
                }
                
                .barra-nombre {
                    min-width: auto;
                    text-align: center;
                }
            }
        `;
        
        document.head.appendChild(estilos);
    }

    // ================================================================
    // CREAR PANEL DE REPORTES
    // ================================================================
    
    crearPanelReportes() {
        const panelExistente = document.getElementById('panelReportes');
        if (panelExistente) {
            panelExistente.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'panelReportes';
        panel.className = 'panel-reportes';
        
        panel.innerHTML = `
            <div class="cabecera-reportes">
                <div>
                    <h3 class="titulo-reportes">
                        <i class="fas fa-chart-bar"></i>
                        Reportes Empresariales
                    </h3>
                    <p class="subtitulo-reportes">Análisis y estadísticas de tus empresas</p>
                </div>
                <button class="boton-cerrar-reportes" onclick="reportesEmpresas.cerrarPanel()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="contenido-reportes">
                ${this.generarSeccionReportes()}
                ${this.generarEstadisticasRapidas()}
            </div>
        `;
        
        document.body.appendChild(panel);
        this.crearBotonFlotante();
    }

    generarSeccionReportes() {
        const reportes = [
            {
                id: 'resumen-financiero',
                icono: '📊',
                nombre: 'Resumen Financiero',
                descripcion: 'Vista general de todas las empresas'
            },
            {
                id: 'comparativo-empresas',
                icono: '⚖️',
                nombre: 'Comparativo',
                descripcion: 'Comparar rendimiento entre empresas'
            },
            {
                id: 'analisis-rentabilidad',
                icono: '💹',
                nombre: 'Análisis de Rentabilidad',
                descripcion: 'Márgenes y eficiencia operativa'
            },
            {
                id: 'ranking-empresas',
                icono: '🏆',
                nombre: 'Ranking de Empresas',
                descripcion: 'Las empresas más exitosas'
            },
            {
                id: 'reporte-flujo-caja',
                icono: '💰',
                nombre: 'Flujo de Caja',
                descripcion: 'Liquidez y solvencia empresarial'
            },
            {
                id: 'proyecciones',
                icono: '🔮',
                nombre: 'Proyecciones',
                descripcion: 'Estimaciones futuras de crecimiento'
            }
        ];

        let html = `
            <div class="seccion-reporte">
                <h4 class="titulo-seccion-reporte">
                    <i class="fas fa-file-chart-pie"></i>
                    Tipos de Reporte
                </h4>
                <div class="tipos-reporte">
        `;

        reportes.forEach(reporte => {
            html += `
                <div class="tipo-reporte" onclick="reportesEmpresas.generarReporte('${reporte.id}')">
                    <div class="icono-tipo-reporte">${reporte.icono}</div>
                    <div class="info-tipo-reporte">
                        <div class="nombre-tipo-reporte">${reporte.nombre}</div>
                        <div class="descripcion-tipo-reporte">${reporte.descripcion}</div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    generarEstadisticasRapidas() {
        const empresas = Object.values(this.gestor.empresas);
        const totalEmpresas = empresas.length;
        const ingresoTotal = empresas.reduce((sum, emp) => sum + emp.dinero.ingresos, 0);
        const cajaTotal = empresas.reduce((sum, emp) => sum + emp.dinero.caja, 0);
        const empresasOperativas = empresas.filter(emp => emp.estado === 'Operativo').length;

        return `
            <div class="seccion-reporte">
                <h4 class="titulo-seccion-reporte">
                    <i class="fas fa-tachometer-alt"></i>
                    Estadísticas Rápidas
                </h4>
                <div class="estadisticas-generales">
                    <div class="estadistica-card">
                        <span class="estadistica-valor">${totalEmpresas}</span>
                        <div class="estadistica-label">Empresas</div>
                        <div class="estadistica-descripcion">Total registradas</div>
                    </div>
                    <div class="estadistica-card">
                        <span class="estadistica-valor">S/. ${(ingresoTotal/1000000).toFixed(1)}M</span>
                        <div class="estadistica-label">Ingresos</div>
                        <div class="estadistica-descripcion">Facturación total</div>
                    </div>
                    <div class="estadistica-card">
                        <span class="estadistica-valor">S/. ${cajaTotal.toLocaleString()}</span>
                        <div class="estadistica-label">Caja Total</div>
                        <div class="estadistica-descripcion">Liquidez disponible</div>
                    </div>
                    <div class="estadistica-card">
                        <span class="estadistica-valor">${empresasOperativas}</span>
                        <div class="estadistica-label">Operativas</div>
                        <div class="estadistica-descripcion">Funcionando normal</div>
                    </div>
                </div>
            </div>
        `;
    }

    crearBotonFlotante() {
        const botonExistente = document.getElementById('botonReportesFlotante');
        if (botonExistente) {
            botonExistente.remove();
        }

        const boton = document.createElement('button');
        boton.id = 'botonReportesFlotante';
        boton.className = 'boton-reportes-flotante';
        boton.innerHTML = '<i class="fas fa-chart-bar"></i>';
        boton.onclick = () => this.abrirPanel();
        boton.title = 'Ver Reportes';
        
        document.body.appendChild(boton);
    }

    // ================================================================
    // GESTIÓN DEL PANEL
    // ================================================================
    
    abrirPanel() {
        this.crearPanelReportes();
        
        setTimeout(() => {
            document.getElementById('panelReportes').classList.add('abierto');
        }, 100);
    }

    cerrarPanel() {
        const panel = document.getElementById('panelReportes');
        if (panel) {
            panel.classList.remove('abierto');
            setTimeout(() => {
                panel.remove();
            }, 300);
        }
    }

    // ================================================================
    // GENERACIÓN DE REPORTES
    // ================================================================
    
    generarReporte(tipoReporte) {
        console.log(`📊 Generando reporte: ${tipoReporte}`);
        
        switch (tipoReporte) {
            case 'resumen-financiero':
                this.mostrarResumenFinanciero();
                break;
            case 'comparativo-empresas':
                this.mostrarComparativoEmpresas();
                break;
            case 'analisis-rentabilidad':
                this.mostrarAnalisisRentabilidad();
                break;
            case 'ranking-empresas':
                this.mostrarRankingEmpresas();
                break;
            case 'reporte-flujo-caja':
                this.mostrarReporteFlujo();
                break;
            case 'proyecciones':
                this.mostrarProyecciones();
                break;
            default:
                console.error('Tipo de reporte no reconocido:', tipoReporte);
        }
    }

    mostrarResumenFinanciero() {
        const empresas = Object.values(this.gestor.empresas);
        const datosResumen = this.calcularResumenFinanciero(empresas);
        
        const contenidoModal = `
            <div class="estadisticas-generales">
                <div class="estadistica-card">
                    <span class="estadistica-valor">S/. ${(datosResumen.ingresoTotal/1000000).toFixed(1)}M</span>
                    <div class="estadistica-label">Ingresos Totales</div>
                    <div class="estadistica-descripcion">Facturación consolidada</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">S/. ${(datosResumen.gastoTotal/1000000).toFixed(1)}M</span>
                    <div class="estadistica-label">Gastos Totales</div>
                    <div class="estadistica-descripcion">Costos operativos</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">S/. ${(datosResumen.gananciTotal/1000000).toFixed(1)}M</span>
                    <div class="estadistica-label">Utilidad Total</div>
                    <div class="estadistica-descripcion">Beneficio neto</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${datosResumen.margenPromedio.toFixed(1)}%</span>
                    <div class="estadistica-label">Margen Promedio</div>
                    <div class="estadistica-descripcion">Rentabilidad general</div>
                </div>
            </div>
            
            <table class="tabla-empresas">
                <thead>
                    <tr>
                        <th>Empresa</th>
                        <th>Ingresos</th>
                        <th>Gastos</th>
                        <th>Utilidad</th>
                        <th>Margen %</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${empresas.map(empresa => {
                        const margen = empresa.dinero.ingresos > 0 ? 
                            ((empresa.dinero.ganancia / empresa.dinero.ingresos) * 100).toFixed(1) : '0.0';
                        const claseMargen = margen > 15 ? 'valor-positivo' : margen > 5 ? 'valor-neutro' : 'valor-negativo';
                        
                        return `
                            <tr>
                                <td class="empresa-nombre-tabla">
                                    <span class="empresa-icono-tabla">${empresa.icono}</span>
                                    ${empresa.nombre}
                                </td>
                                <td>S/. ${empresa.dinero.ingresos.toLocaleString()}</td>
                                <td>S/. ${empresa.dinero.gastos.toLocaleString()}</td>
                                <td class="${empresa.dinero.ganancia > 0 ? 'valor-positivo' : 'valor-negativo'}">
                                    S/. ${empresa.dinero.ganancia.toLocaleString()}
                                </td>
                                <td class="${claseMargen}">${margen}%</td>
                                <td>${empresa.estado}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        
        this.mostrarModalReporte('📊 Resumen Financiero Consolidado', contenidoModal);
    }

    mostrarComparativoEmpresas() {
        const empresas = Object.values(this.gestor.empresas);
        
        if (empresas.length < 2) {
            alert('📊 Necesitas al menos 2 empresas para hacer un comparativo');
            return;
        }

        // Ordenar por ingresos
        const empresasOrdenadas = [...empresas].sort((a, b) => b.dinero.ingresos - a.dinero.ingresos);
        
        const contenidoModal = `
            <div class="grafico-simple">
                <div class="titulo-grafico">Comparativo de Ingresos por Empresa</div>
                <div class="barras-grafico">
                    ${empresasOrdenadas.map(empresa => {
                        const maxIngresos = empresasOrdenadas[0].dinero.ingresos;
                        const porcentaje = (empresa.dinero.ingresos / maxIngresos) * 100;
                        
                        return `
                            <div class="barra-empresa">
                                <div class="barra-nombre">${empresa.icono} ${empresa.nombre}</div>
                                <div class="barra-visual">
                                    <div class="barra-relleno" style="width: ${porcentaje}%">
                                        <span class="barra-valor">S/. ${(empresa.dinero.ingresos/1000000).toFixed(1)}M</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <div class="grafico-simple">
                <div class="titulo-grafico">Comparativo de Rentabilidad</div>
                <div class="barras-grafico">
                    ${empresasOrdenadas.map(empresa => {
                        const margen = empresa.dinero.ingresos > 0 ? 
                            (empresa.dinero.ganancia / empresa.dinero.ingresos) * 100 : 0;
                        const porcentaje = Math.max(margen, 0);
                        
                        return `
                            <div class="barra-empresa">
                                <div class="barra-nombre">${empresa.icono} ${empresa.nombre}</div>
                                <div class="barra-visual">
                                    <div class="barra-relleno" style="width: ${Math.min(porcentaje * 3, 100)}%">
                                        <span class="barra-valor">${margen.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        this.mostrarModalReporte('⚖️ Comparativo entre Empresas', contenidoModal);
    }

    mostrarAnalisisRentabilidad() {
        const empresas = Object.values(this.gestor.empresas);
        const analisis = this.analizarRentabilidad(empresas);
        
        const contenidoModal = `
            <div class="estadisticas-generales">
                <div class="estadistica-card">
                    <span class="estadistica-valor">${analisis.empresasRentables}</span>
                    <div class="estadistica-label">Empresas Rentables</div>
                    <div class="estadistica-descripcion">Con margen > 5%</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${analisis.empresasExcelentes}</span>
                    <div class="estadistica-label">Excelentes</div>
                    <div class="estadistica-descripcion">Con margen > 15%</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${analisis.empresasRiesgo}</span>
                    <div class="estadistica-label">En Riesgo</div>
                    <div class="estadistica-descripcion">Con margen < 5%</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${analisis.eficienciaPromedio.toFixed(1)}%</span>
                    <div class="estadistica-label">Eficiencia</div>
                    <div class="estadistica-descripcion">Promedio general</div>
                </div>
            </div>
            
            <table class="tabla-empresas">
                <thead>
                    <tr>
                        <th>Empresa</th>
                        <th>Margen %</th>
                        <th>Eficiencia</th>
                        <th>ROI Estimado</th>
                        <th>Clasificación</th>
                    </tr>
                </thead>
                <tbody>
                    ${analisis.empresasDetalle.map(empresa => `
                        <tr>
                            <td class="empresa-nombre-tabla">
                                <span class="empresa-icono-tabla">${empresa.icono}</span>
                                ${empresa.nombre}
                            </td>
                            <td class="${empresa.margen > 15 ? 'valor-positivo' : empresa.margen > 5 ? 'valor-neutro' : 'valor-negativo'}">
                                ${empresa.margen.toFixed(1)}%
                            </td>
                            <td class="${empresa.eficiencia > 70 ? 'valor-positivo' : empresa.eficiencia > 50 ? 'valor-neutro' : 'valor-negativo'}">
                                ${empresa.eficiencia.toFixed(1)}%
                            </td>
                            <td class="${empresa.roi > 20 ? 'valor-positivo' : empresa.roi > 10 ? 'valor-neutro' : 'valor-negativo'}">
                                ${empresa.roi.toFixed(1)}%
                            </td>
                            <td>${empresa.clasificacion}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        this.mostrarModalReporte('💹 Análisis de Rentabilidad', contenidoModal);
    }

    mostrarRankingEmpresas() {
        const empresas = Object.values(this.gestor.empresas);
        const ranking = this.calcularRanking(empresas);
        
        const contenidoModal = `
            <div class="grafico-simple">
                <div class="titulo-grafico">🏆 Top 5 Empresas por Rendimiento</div>
                <div class="barras-grafico">
                    ${ranking.slice(0, 5).map((empresa, index) => {
                        const medallas = ['🥇', '🥈', '🥉', '🏅', '🏅'];
                        const porcentaje = ((empresa.puntuacion / ranking[0].puntuacion) * 100);
                        
                        return `
                            <div class="barra-empresa">
                                <div class="barra-nombre">${medallas[index]} ${empresa.icono} ${empresa.nombre}</div>
                                <div class="barra-visual">
                                    <div class="barra-relleno" style="width: ${porcentaje}%">
                                        <span class="barra-valor">${empresa.puntuacion.toFixed(0)} pts</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <table class="tabla-empresas">
                <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Empresa</th>
                        <th>Puntuación</th>
                        <th>Ingresos</th>
                        <th>Margen</th>
                        <th>Caja</th>
                    </tr>
                </thead>
                <tbody>
                    ${ranking.map((empresa, index) => `
                        <tr>
                            <td style="font-weight: 700; color: #059669;">#${index + 1}</td>
                            <td class="empresa-nombre-tabla">
                                <span class="empresa-icono-tabla">${empresa.icono}</span>
                                ${empresa.nombre}
                            </td>
                            <td class="valor-positivo">${empresa.puntuacion.toFixed(0)} pts</td>
                            <td>S/. ${(empresa.ingresos/1000000).toFixed(1)}M</td>
                            <td class="${empresa.margen > 15 ? 'valor-positivo' : 'valor-neutro'}">${empresa.margen.toFixed(1)}%</td>
                            <td>S/. ${empresa.caja.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        this.mostrarModalReporte('🏆 Ranking de Empresas', contenidoModal);
    }

    mostrarReporteFlujo() {
        const empresas = Object.values(this.gestor.empresas);
        const analisisFlujo = this.analizarFlujoCaja(empresas);
        
        const contenidoModal = `
            <div class="estadisticas-generales">
                <div class="estadistica-card">
                    <span class="estadistica-valor">S/. ${analisisFlujo.cajaTotal.toLocaleString()}</span>
                    <div class="estadistica-label">Caja Total</div>
                    <div class="estadistica-descripcion">Liquidez consolidada</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${analisisFlujo.empresasSaludables}</span>
                    <div class="estadistica-label">Saludables</div>
                    <div class="estadistica-descripcion">Buena liquidez</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${analisisFlujo.empresasRiesgo}</span>
                    <div class="estadistica-label">En Riesgo</div>
                    <div class="estadistica-descripcion">Baja liquidez</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${analisisFlujo.diasOperacion.toFixed(0)}</span>
                    <div class="estadistica-label">Días Operación</div>
                    <div class="estadistica-descripcion">Promedio sin ingresos</div>
                </div>
            </div>
            
            <table class="tabla-empresas">
                <thead>
                    <tr>
                        <th>Empresa</th>
                        <th>Caja Actual</th>
                        <th>Gastos Mensuales</th>
                        <th>Días de Operación</th>
                        <th>Estado Liquidez</th>
                    </tr>
                </thead>
                <tbody>
                    ${analisisFlujo.detalleEmpresas.map(empresa => `
                        <tr>
                            <td class="empresa-nombre-tabla">
                                <span class="empresa-icono-tabla">${empresa.icono}</span>
                                ${empresa.nombre}
                            </td>
                            <td class="${empresa.caja > 50000 ? 'valor-positivo' : empresa.caja > 10000 ? 'valor-neutro' : 'valor-negativo'}">
                                S/. ${empresa.caja.toLocaleString()}
                            </td>
                            <td>S/. ${empresa.gastosMensuales.toLocaleString()}</td>
                            <td class="${empresa.diasOperacion > 90 ? 'valor-positivo' : empresa.diasOperacion > 30 ? 'valor-neutro' : 'valor-negativo'}">
                                ${empresa.diasOperacion} días
                            </td>
                            <td>${empresa.estadoLiquidez}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        this.mostrarModalReporte('💰 Reporte de Flujo de Caja', contenidoModal);
    }

    mostrarProyecciones() {
        const empresas = Object.values(this.gestor.empresas);
        const proyecciones = this.calcularProyecciones(empresas);
        
        const contenidoModal = `
            <div class="estadisticas-generales">
                <div class="estadistica-card">
                    <span class="estadistica-valor">S/. ${(proyecciones.ingresoProyectado/1000000).toFixed(1)}M</span>
                    <div class="estadistica-label">Ingresos Proyectados</div>
                    <div class="estadistica-descripcion">Próximo año</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${proyecciones.crecimientoPromedio.toFixed(1)}%</span>
                    <div class="estadistica-label">Crecimiento</div>
                    <div class="estadistica-descripcion">Estimado anual</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">S/. ${(proyecciones.utilidadProyectada/1000000).toFixed(1)}M</span>
                    <div class="estadistica-label">Utilidad Proyectada</div>
                    <div class="estadistica-descripcion">Próximo año</div>
                </div>
                <div class="estadistica-card">
                    <span class="estadistica-valor">${proyecciones.riesgoPromedio.toFixed(1)}%</span>
                    <div class="estadistica-label">Riesgo</div>
                    <div class="estadistica-descripcion">Nivel de incertidumbre</div>
                </div>
            </div>
            
            <table class="tabla-empresas">
                <thead>
                    <tr>
                        <th>Empresa</th>
                        <th>Ingresos Actuales</th>
                        <th>Proyección</th>
                        <th>Crecimiento %</th>
                        <th>Riesgo</th>
                    </tr>
                </thead>
                <tbody>
                    ${proyecciones.detalleEmpresas.map(empresa => `
                        <tr>
                            <td class="empresa-nombre-tabla">
                                <span class="empresa-icono-tabla">${empresa.icono}</span>
                                ${empresa.nombre}
                            </td>
                            <td>S/. ${(empresa.ingresosActuales/1000000).toFixed(1)}M</td>
                            <td class="valor-positivo">S/. ${(empresa.proyeccion/1000000).toFixed(1)}M</td>
                            <td class="${empresa.crecimiento > 10 ? 'valor-positivo' : empresa.crecimiento > 0 ? 'valor-neutro' : 'valor-negativo'}">
                                ${empresa.crecimiento.toFixed(1)}%
                            </td>
                            <td class="${empresa.riesgo < 20 ? 'valor-positivo' : empresa.riesgo < 40 ? 'valor-neutro' : 'valor-negativo'}">
                                ${empresa.riesgo.toFixed(1)}%
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="margin-top: 1.5rem; padding: 1rem; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <strong>⚠️ Nota Importante:</strong> Las proyecciones están basadas en el rendimiento histórico y tendencias actuales. 
                Los resultados reales pueden variar debido a factores del mercado, cambios económicos y decisiones empresariales.
            </div>
        `;
        
        this.mostrarModalReporte('🔮 Proyecciones Financieras', contenidoModal);
    }

    // ================================================================
    // FUNCIONES DE CÁLCULO
    // ================================================================
    
    calcularResumenFinanciero(empresas) {
        const ingresoTotal = empresas.reduce((sum, emp) => sum + emp.dinero.ingresos, 0);
        const gastoTotal = empresas.reduce((sum, emp) => sum + emp.dinero.gastos, 0);
        const gananciTotal = empresas.reduce((sum, emp) => sum + emp.dinero.ganancia, 0);
        const margenPromedio = ingresoTotal > 0 ? (gananciTotal / ingresoTotal) * 100 : 0;
        
        return {
            ingresoTotal,
            gastoTotal,
            gananciTotal,
            margenPromedio
        };
    }

    analizarRentabilidad(empresas) {
        const empresasDetalle = empresas.map(empresa => {
            const margen = empresa.dinero.ingresos > 0 ? 
                (empresa.dinero.ganancia / empresa.dinero.ingresos) * 100 : 0;
            const eficiencia = empresa.dinero.ingresos > 0 ? 
                ((empresa.dinero.ingresos - empresa.dinero.gastos) / empresa.dinero.ingresos) * 100 : 0;
            const roi = empresa.dinero.caja > 0 ? 
                (empresa.dinero.ganancia / empresa.dinero.caja) * 100 : 0;
            
            let clasificacion = 'Excelente';
            if (margen < 5) clasificacion = 'Deficiente';
            else if (margen < 10) clasificacion = 'Regular';
            else if (margen < 15) clasificacion = 'Buena';
            
            return {
                ...empresa,
                margen,
                eficiencia,
                roi,
                clasificacion
            };
        });
        
        return {
            empresasDetalle,
            empresasRentables: empresasDetalle.filter(emp => emp.margen > 5).length,
            empresasExcelentes: empresasDetalle.filter(emp => emp.margen > 15).length,
            empresasRiesgo: empresasDetalle.filter(emp => emp.margen < 5).length,
            eficienciaPromedio: empresasDetalle.reduce((sum, emp) => sum + emp.eficiencia, 0) / empresasDetalle.length
        };
    }

    calcularRanking(empresas) {
        return empresas.map(empresa => {
            const margen = empresa.dinero.ingresos > 0 ? 
                (empresa.dinero.ganancia / empresa.dinero.ingresos) * 100 : 0;
            
            // Fórmula de puntuación considerando múltiples factores
            const puntuacion = 
                (empresa.dinero.ingresos / 1000000) * 0.3 + // 30% ingresos
                margen * 0.25 + // 25% margen
                (empresa.dinero.caja / 100000) * 0.2 + // 20% liquidez
                (empresa.estado === 'Operativo' ? 25 : 0) + // 25% estado
                (empresa.dinero.ganancia / 100000) * 0.25; // 25% ganancia absoluta
            
            return {
                ...empresa,
                puntuacion,
                margen,
                ingresos: empresa.dinero.ingresos,
                caja: empresa.dinero.caja
            };
        }).sort((a, b) => b.puntuacion - a.puntuacion);
    }

    analizarFlujoCaja(empresas) {
        const cajaTotal = empresas.reduce((sum, emp) => sum + emp.dinero.caja, 0);
        
        const detalleEmpresas = empresas.map(empresa => {
            const gastosMensuales = empresa.dinero.gastos / 12;
            const diasOperacion = gastosMensuales > 0 ? 
                Math.floor((empresa.dinero.caja / gastosMensuales) * 30) : 999;
            
            let estadoLiquidez = 'Excelente';
            if (diasOperacion < 30) estadoLiquidez = 'Crítico';
            else if (diasOperacion < 90) estadoLiquidez = 'Regular';
            else if (diasOperacion < 180) estadoLiquidez = 'Bueno';
            
            return {
                ...empresa,
                gastosMensuales,
                diasOperacion,
                estadoLiquidez
            };
        });
        
        return {
            cajaTotal,
            empresasSaludables: detalleEmpresas.filter(emp => emp.diasOperacion > 90).length,
            empresasRiesgo: detalleEmpresas.filter(emp => emp.diasOperacion < 30).length,
            diasOperacion: detalleEmpresas.reduce((sum, emp) => sum + emp.diasOperacion, 0) / detalleEmpresas.length,
            detalleEmpresas
        };
    }

    calcularProyecciones(empresas) {
        const detalleEmpresas = empresas.map(empresa => {
            // Factores de crecimiento basados en el estado y tipo
            const factoresCrecimiento = {
                'Operativo': 1.15,
                'En Preparación': 1.25,
                'Regular': 1.08,
                'Crítico': 0.95
            };
            
            const factorCrecimiento = factoresCrecimiento[empresa.estado] || 1.1;
            const proyeccion = empresa.dinero.ingresos * factorCrecimiento;
            const crecimiento = (factorCrecimiento - 1) * 100;
            
            // Calcular riesgo basado en varios factores
            const margen = empresa.dinero.ingresos > 0 ? 
                (empresa.dinero.ganancia / empresa.dinero.ingresos) * 100 : 0;
            const riesgo = Math.max(0, 50 - margen * 2 - (empresa.dinero.caja / 10000));
            
            return {
                ...empresa,
                ingresosActuales: empresa.dinero.ingresos,
                proyeccion,
                crecimiento,
                riesgo: Math.min(riesgo, 100)
            };
        });
        
        const ingresoProyectado = detalleEmpresas.reduce((sum, emp) => sum + emp.proyeccion, 0);
        const utilidadProyectada = ingresoProyectado * 0.15; // Asumiendo 15% de margen promedio
        const crecimientoPromedio = detalleEmpresas.reduce((sum, emp) => sum + emp.crecimiento, 0) / detalleEmpresas.length;
        const riesgoPromedio = detalleEmpresas.reduce((sum, emp) => sum + emp.riesgo, 0) / detalleEmpresas.length;
        
        return {
            detalleEmpresas,
            ingresoProyectado,
            utilidadProyectada,
            crecimientoPromedio,
            riesgoPromedio
        };
    }

    // ================================================================
    // MOSTRAR MODAL DE REPORTE
    // ================================================================
    
    mostrarModalReporte(titulo, contenido) {
        const modalExistente = document.getElementById('modalReporte');
        if (modalExistente) {
            modalExistente.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'modalReporte';
        modal.className = 'modal-reporte';
        
        modal.innerHTML = `
            <div class="contenido-modal-reporte">
                <div class="cabecera-modal-reporte">
                    <h2 class="titulo-modal-reporte">${titulo}</h2>
                    <div class="acciones-reporte">
                        <button class="boton-accion-reporte" onclick="reportesEmpresas.exportarReporte()">
                            <i class="fas fa-download"></i>
                            Exportar
                        </button>
                        <button class="boton-accion-reporte" onclick="reportesEmpresas.imprimirReporte()">
                            <i class="fas fa-print"></i>
                            Imprimir
                        </button>
                        <button class="boton-accion-reporte" onclick="reportesEmpresas.cerrarModalReporte()">
                            <i class="fas fa-times"></i>
                            Cerrar
                        </button>
                    </div>
                </div>
                
                <div class="cuerpo-modal-reporte">
                    ${contenido}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('mostrar');
        }, 100);
    }

    cerrarModalReporte() {
        const modal = document.getElementById('modalReporte');
        if (modal) {
            modal.classList.remove('mostrar');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    exportarReporte() {
        console.log('📤 Exportando reporte...');
        alert('📊 Función de exportación próximamente disponible');
    }

    imprimirReporte() {
        console.log('🖨️ Imprimiendo reporte...');
        window.print();
    }
}

// ================================================================
// INICIALIZACIÓN
// ================================================================

let reportesEmpresas = null;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.gestorEmpresas) {
            reportesEmpresas = new ReportesEmpresas(window.gestorEmpresas);
            window.reportesEmpresas = reportesEmpresas;
            
            console.log('📊 Sistema de Reportes inicializado');
        }
    }, 800);
});

console.log(`
📊 ===================================================
   GRIZALUM REPORTES EMPRESARIALES v2.0
   Análisis completo y estadísticas avanzadas
📊 ===================================================

✨ CARACTERÍSTICAS:
   • 📊 6 tipos de reportes especializados
   • 📈 Análisis de rentabilidad avanzado
   • 🏆 Rankings y comparativos
   • 💰 Análisis de flujo de caja
   • 🔮 Proyecciones financieras
   • 📱 Interfaz visual moderna

📊 ===================================================
`);
