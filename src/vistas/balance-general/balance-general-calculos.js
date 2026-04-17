/**
 * ═══════════════════════════════════════════════════════════════════
 * BALANCE GENERAL - CALCULOS
 * Toda la lógica matemática: activos, pasivos, patrimonio y ratios
 * Depende de: balance-general-config.js
 * v20260417
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    window.BalanceGeneralCalculos = {

        // ─── Obtener empresa actual ───────────────────────────────────
        obtenerEmpresa() {
            return localStorage.getItem('grizalum_empresa_actual') || 'avicola';
        },

        // ─── Leer valor manual desde localStorage ────────────────────
        obtenerValorManual(seccionId, cuentaId) {
            try {
                const key = window.BalanceGeneralConfig.storagePrefix + this.obtenerEmpresa();
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                return data[seccionId]?.[cuentaId] || 0;
            } catch (e) { return 0; }
        },

        // ─── Guardar valor manual en localStorage ────────────────────
        guardarValorManual(seccionId, cuentaId, valor) {
            try {
                const key = window.BalanceGeneralConfig.storagePrefix + this.obtenerEmpresa();
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (!data[seccionId]) data[seccionId] = {};
                data[seccionId][cuentaId] = parseFloat(valor) || 0;
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('[BG-Calculos] Error al guardar:', e);
                return false;
            }
        },

        // ─── Obtener transacciones desde FlujoCaja o localStorage ─────
        obtenerTransacciones() {
            const empresa = this.obtenerEmpresa();

            // Prioridad 1: módulo FlujoCaja activo en memoria
            if (window.flujoCaja && window.flujoCaja.obtenerTransacciones) {
                const txs = window.flujoCaja.obtenerTransacciones();
                if (txs && txs.length > 0) return txs;
            }

            // Prioridad 2: localStorage clave principal
            try {
                const data = JSON.parse(localStorage.getItem(`grizalum_flujo_caja_${empresa}`) || '[]');
                if (Array.isArray(data) && data.length > 0) return data;
            } catch (e) {}

            // Prioridad 3: localStorage clave alternativa
            try {
                const data = JSON.parse(localStorage.getItem(`flujoCaja_${empresa}`) || '{}');
                if (data.transacciones && Array.isArray(data.transacciones)) return data.transacciones;
            } catch (e) {}

            return [];
        },

        // ─── Calcular rango de fechas según período ───────────────────
        calcularRango(periodo) {
            const hoy = new Date();
            let inicio, fin;

            switch (periodo) {
                case 'hoy':
                    inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                    fin    = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
                    break;
                case 'semana':
                    inicio = new Date(hoy);
                    inicio.setDate(hoy.getDate() - hoy.getDay());
                    inicio.setHours(0, 0, 0, 0);
                    fin = new Date(inicio);
                    fin.setDate(inicio.getDate() + 6);
                    fin.setHours(23, 59, 59, 999);
                    break;
                case 'trimestre':
                    const trim = Math.floor(hoy.getMonth() / 3);
                    inicio = new Date(hoy.getFullYear(), trim * 3, 1);
                    fin    = new Date(hoy.getFullYear(), (trim + 1) * 3, 0, 23, 59, 59, 999);
                    break;
                case 'año':
                    inicio = new Date(hoy.getFullYear(), 0, 1);
                    fin    = new Date(hoy.getFullYear(), 11, 31, 23, 59, 59, 999);
                    break;
                case 'mes':
                default:
                    inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                    fin    = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);
                    break;
            }
            return { inicio, fin };
        },

        // ─── Calcular una sección (activos, pasivos, patrimonio) ──────
        calcularSeccion(seccionId, valoresCalculados) {
            const cfg = window.BalanceGeneralConfig.clasificacion[seccionId];
            const items = [];
            let total = 0;

            cfg.cuentas.forEach(cuenta => {
                let valor = 0;
                if (cuenta.tipo === 'calculado' && valoresCalculados[cuenta.id] !== undefined) {
                    valor = valoresCalculados[cuenta.id];
                } else if (cuenta.tipo === 'manual') {
                    valor = this.obtenerValorManual(seccionId, cuenta.id);
                }
                items.push({ id: cuenta.id, nombre: cuenta.nombre, valor, tipo: cuenta.tipo });
                total += valor;
            });

            return { items, total };
        },

        // ─── Cálculo principal completo ───────────────────────────────
        calcularTodo(periodo) {
            const transacciones = this.obtenerTransacciones();
            const rango = this.calcularRango(periodo);

            // Filtrar por período
            const txEnPeriodo = transacciones.filter(t => {
                const fecha = new Date(t.fecha);
                return fecha >= rango.inicio && fecha <= rango.fin;
            });

            // Sumar ingresos y gastos
            let totalIngresos = 0, totalGastos = 0, prestamosRecibidos = 0;
            txEnPeriodo.forEach(t => {
                if (t.tipo === 'ingreso') {
                    totalIngresos += t.monto || 0;
                    if (t.categoria && t.categoria.toLowerCase().includes('préstamo')) {
                        prestamosRecibidos += t.monto || 0;
                    }
                } else if (t.tipo === 'gasto') {
                    totalGastos += t.monto || 0;
                }
            });

            const efectivo           = totalIngresos - totalGastos;
            const resultadoEjercicio = totalIngresos - prestamosRecibidos - totalGastos;

            // Calcular cada sección
            const activosCorrientes    = this.calcularSeccion('activosCorrientes',   { efectivo });
            const activosNoCorrientes  = this.calcularSeccion('activosNoCorrientes', {});
            const totalActivos         = activosCorrientes.total + activosNoCorrientes.total;

            const pasivosCorrientes    = this.calcularSeccion('pasivosCorrientes',   { prestamosCorto: prestamosRecibidos });
            const pasivosNoCorrientes  = this.calcularSeccion('pasivosNoCorrientes', {});
            const totalPasivos         = pasivosCorrientes.total + pasivosNoCorrientes.total;

            const patrimonio           = this.calcularSeccion('patrimonio', { resultadoEjercicio });
            const totalPatrimonio      = patrimonio.total;

            // Ratios financieros
            const ratios = {
                liquidez:      pasivosCorrientes.total > 0 ? activosCorrientes.total / pasivosCorrientes.total : (activosCorrientes.total > 0 ? 99 : 0),
                endeudamiento: totalActivos > 0 ? (totalPasivos / totalActivos * 100) : 0,
                solvencia:     totalPasivos > 0 ? totalActivos / totalPasivos : (totalActivos > 0 ? 99 : 0),
                capitalTrabajo: activosCorrientes.total - pasivosCorrientes.total
            };

            return {
                periodo,
                rango,
                activos: {
                    corrientes:    activosCorrientes,
                    noCorrientes:  activosNoCorrientes,
                    total:         totalActivos
                },
                pasivos: {
                    corrientes:    pasivosCorrientes,
                    noCorrientes:  pasivosNoCorrientes,
                    total:         totalPasivos
                },
                patrimonio: {
                    detalle: patrimonio,
                    total:   totalPatrimonio
                },
                ecuacionBalanceada: Math.abs(totalActivos - (totalPasivos + totalPatrimonio)) < 0.01,
                ratios,
                transaccionesEnPeriodo: txEnPeriodo.length
            };
        }
    };

    console.log('✅ [BG-Calculos] Cargado');

})();
