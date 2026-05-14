/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM — ALERTAS INTELIGENTES v1.0
 * Detecta automáticamente situaciones críticas del negocio
 * Conectado al Centro de Notificaciones Premium
 * 
 * Inspirado en los principios de control financiero de Warren Buffett:
 * — Conoce tus números antes que nadie
 * — Una alerta a tiempo vale más que mil reportes tarde
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ── CONTROL DE ALERTAS YA ENVIADAS (evitar spam) ──────────────
    const alertasEnviadas = new Set();

    // ── OBTENER EMPRESA ACTIVA ────────────────────────────────────
    function getEmpresa() {
        return localStorage.getItem('grizalum_empresa_activa') || 'grizalum';
    }

    // ── LEER CONFIG ───────────────────────────────────────────────
    function getConfig() {
        try {
            const raw = localStorage.getItem('grizalum_config_' + getEmpresa());
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    // ── FORMATEAR NÚMERO ──────────────────────────────────────────
    function fmt(n) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(n || 0);
    }

    // ── ENVIAR NOTIFICACIÓN ───────────────────────────────────────
    function enviarAlerta(id, config) {
        // Evitar duplicados en la misma sesión
        const key = id + '_' + new Date().toDateString();
        if (alertasEnviadas.has(key)) return;

        if (!window.instanciaNotificaciones) return;

        window.instanciaNotificaciones.crearNotificacion(config);
        alertasEnviadas.add(key);
        console.log('[Alertas] ✅ Enviada:', config.titulo);
    }

    // ══════════════════════════════════════════════════════════════
    // 1. ALERTA: STOCK BAJO
    // ══════════════════════════════════════════════════════════════
    function verificarStockBajo() {
        try {
            const raw = localStorage.getItem('grizalum_inventario_' + getEmpresa());
            const inventario = raw ? JSON.parse(raw) : [];
            const cfg = getConfig();
            const limiteGlobal = cfg.alertaStock || 5;

            inventario.forEach(producto => {
                const stockActual = producto.stock || producto.cantidad || 0;
                const stockMinimo = producto.stockMinimo || producto.puntoReorden || limiteGlobal;
                const nombre = producto.nombre || producto.descripcion || 'Producto';

                if (stockActual <= 0) {
                    enviarAlerta('stock_agotado_' + producto.id, {
                        categoria: 'VENCIMIENTO',
                        prioridad: 'critica',
                        titulo: `🚨 SIN STOCK: ${nombre}`,
                        mensaje: `El producto "${nombre}" está completamente agotado. Stock actual: 0 unidades. Requiere reposición inmediata para no perder ventas.`
                    });
                } else if (stockActual <= stockMinimo) {
                    enviarAlerta('stock_bajo_' + producto.id, {
                        categoria: 'VENCIMIENTO',
                        prioridad: 'alta',
                        titulo: `⚠️ Stock bajo: ${nombre}`,
                        mensaje: `Quedan solo ${stockActual} unidades de "${nombre}" (mínimo: ${stockMinimo}). Considera hacer un pedido pronto.`
                    });
                }
            });
        } catch (e) {
            console.error('[Alertas] Error verificando stock:', e);
        }
    }

    // ══════════════════════════════════════════════════════════════
    // 2. ALERTA: META DE VENTAS
    // ══════════════════════════════════════════════════════════════
    function verificarMetaVentas() {
        try {
            const cfg = getConfig();
            const metaVentas = cfg.metaVentas || 0;
            if (metaVentas <= 0) return;

            const raw = localStorage.getItem('grizalum_ventas_' + getEmpresa());
            const ventas = raw ? JSON.parse(raw) : [];

            const ahora = new Date();
            const ventasMes = ventas
                .filter(v => {
                    const f = new Date(v.fecha);
                    return f.getMonth() === ahora.getMonth() &&
                           f.getFullYear() === ahora.getFullYear();
                })
                .reduce((s, v) => s + (v.total || v.monto || 0), 0);

            const pct = (ventasMes / metaVentas) * 100;
            const moneda = cfg.moneda === 'USD' ? '$' : cfg.moneda === 'EUR' ? '€' : 'S/';
            const mesNombre = ahora.toLocaleDateString('es-PE', { month: 'long' });

            if (pct >= 100) {
                enviarAlerta('meta_superada', {
                    categoria: 'OPORTUNIDAD',
                    prioridad: 'alta',
                    titulo: `🏆 ¡Meta de ventas superada!`,
                    mensaje: `Excelente trabajo. Llevas ${moneda} ${fmt(ventasMes)} en ventas este mes, superando tu meta de ${moneda} ${fmt(metaVentas)} (${pct.toFixed(1)}%). Considera aumentar la meta para el próximo mes.`
                });
            } else if (pct >= 80) {
                enviarAlerta('meta_cerca', {
                    categoria: 'OPORTUNIDAD',
                    prioridad: 'media',
                    titulo: `📈 Cerca de la meta — ${pct.toFixed(0)}%`,
                    mensaje: `En ${mesNombre} llevas ${moneda} ${fmt(ventasMes)} de tu meta de ${moneda} ${fmt(metaVentas)}. Te faltan solo ${moneda} ${fmt(metaVentas - ventasMes)} para alcanzarla.`
                });
            } else if (pct < 30 && ahora.getDate() > 15) {
                // Segunda quincena y menos del 30% — alerta de rezago
                enviarAlerta('meta_rezagada', {
                    categoria: 'FINANCIERO',
                    prioridad: 'critica',
                    titulo: `🔴 Ventas rezagadas — ${pct.toFixed(0)}% de la meta`,
                    mensaje: `Estamos en la segunda quincena de ${mesNombre} y solo llevas el ${pct.toFixed(0)}% de tu meta. Revisa tu estrategia de ventas para este mes.`
                });
            }
        } catch (e) {
            console.error('[Alertas] Error verificando meta ventas:', e);
        }
    }

    // ══════════════════════════════════════════════════════════════
    // 3. ALERTA: LÍMITE DE GASTOS
    // ══════════════════════════════════════════════════════════════
    function verificarLimiteGastos() {
        try {
            const cfg = getConfig();
            const limiteGastos = cfg.limiteGastos || 0;
            if (limiteGastos <= 0) return;

            const raw = localStorage.getItem('grizalum_flujo_caja_' + getEmpresa());
            const flujo = raw ? JSON.parse(raw) : [];

            const ahora = new Date();
            const gastosDelMes = flujo
                .filter(t => {
                    const f = new Date(t.fecha);
                    return t.tipo === 'gasto' &&
                           f.getMonth() === ahora.getMonth() &&
                           f.getFullYear() === ahora.getFullYear();
                })
                .reduce((s, t) => s + (t.monto || 0), 0);

            const pct = (gastosDelMes / limiteGastos) * 100;
            const moneda = cfg.moneda === 'USD' ? '$' : cfg.moneda === 'EUR' ? '€' : 'S/';

            if (pct >= 100) {
                enviarAlerta('gastos_superados', {
                    categoria: 'FINANCIERO',
                    prioridad: 'critica',
                    titulo: `🚨 Límite de gastos superado`,
                    mensaje: `Los gastos del mes llegaron a ${moneda} ${fmt(gastosDelMes)}, superando tu límite de ${moneda} ${fmt(limiteGastos)} (${pct.toFixed(0)}%). Revisa tus egresos inmediatamente.`
                });
            } else if (pct >= 80) {
                enviarAlerta('gastos_alto', {
                    categoria: 'FINANCIERO',
                    prioridad: 'alta',
                    titulo: `⚠️ Gastos al ${pct.toFixed(0)}% del límite`,
                    mensaje: `Llevas ${moneda} ${fmt(gastosDelMes)} en gastos este mes. Tu límite es ${moneda} ${fmt(limiteGastos)}. Solo te quedan ${moneda} ${fmt(limiteGastos - gastosDelMes)} de margen.`
                });
            }
        } catch (e) {
            console.error('[Alertas] Error verificando gastos:', e);
        }
    }

    // ══════════════════════════════════════════════════════════════
    // 4. ALERTA: FLUJO DE CAJA NEGATIVO
    // ══════════════════════════════════════════════════════════════
    function verificarFlujoCaja() {
        try {
            const raw = localStorage.getItem('grizalum_flujo_caja_' + getEmpresa());
            const flujo = raw ? JSON.parse(raw) : [];
            const cfg = getConfig();
            const moneda = cfg.moneda === 'USD' ? '$' : cfg.moneda === 'EUR' ? '€' : 'S/';

            const ahora = new Date();
            let ingresos = 0, gastos = 0;

            flujo.forEach(t => {
                const f = new Date(t.fecha);
                if (f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear()) {
                    if (t.tipo === 'ingreso') ingresos += (t.monto || 0);
                    else gastos += (t.monto || 0);
                }
            });

            const balance = ingresos - gastos;

            if (balance < 0) {
                enviarAlerta('flujo_negativo', {
                    categoria: 'FINANCIERO',
                    prioridad: 'critica',
                    titulo: `🔴 Flujo de caja negativo`,
                    mensaje: `Este mes tus gastos (${moneda} ${fmt(gastos)}) superan tus ingresos (${moneda} ${fmt(ingresos)}). Balance: -${moneda} ${fmt(Math.abs(balance))}. Acción inmediata recomendada.`
                });
            }
        } catch (e) {
            console.error('[Alertas] Error verificando flujo:', e);
        }
    }

    // ══════════════════════════════════════════════════════════════
    // 5. ALERTA: SIN VENTAS EN 7 DÍAS
    // ══════════════════════════════════════════════════════════════
    function verificarVentasRecientes() {
        try {
            const raw = localStorage.getItem('grizalum_ventas_' + getEmpresa());
            const ventas = raw ? JSON.parse(raw) : [];
            if (ventas.length === 0) return;

            const ahora = new Date();
            const hace7dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);

            const ventasRecientes = ventas.filter(v => new Date(v.fecha) >= hace7dias);

            if (ventasRecientes.length === 0) {
                enviarAlerta('sin_ventas_7dias', {
                    categoria: 'RECORDATORIO',
                    prioridad: 'alta',
                    titulo: `📊 Sin ventas en los últimos 7 días`,
                    mensaje: `No se han registrado ventas en los últimos 7 días. Revisa tu estrategia comercial o verifica si hay ventas pendientes de registrar.`
                });
            }
        } catch (e) {
            console.error('[Alertas] Error verificando ventas recientes:', e);
        }
    }

    // ══════════════════════════════════════════════════════════════
    // EJECUTAR TODAS LAS VERIFICACIONES
    // ══════════════════════════════════════════════════════════════
    function ejecutarAlertas() {
        if (!window.instanciaNotificaciones) {
            console.warn('[Alertas] Sistema de notificaciones no disponible');
            return;
        }

        console.log('[Alertas] 🔍 Verificando alertas...');
        verificarStockBajo();
        verificarMetaVentas();
        verificarLimiteGastos();
        verificarFlujoCaja();
        verificarVentasRecientes();
        console.log('[Alertas] ✅ Verificación completa');
    }

    // ── EXPONER GLOBALMENTE ───────────────────────────────────────
    window.grizalumAlertas = {
        ejecutar: ejecutarAlertas,
        verificarStock: verificarStockBajo,
        verificarVentas: verificarMetaVentas,
        verificarGastos: verificarLimiteGastos
    };

    // ── ESCUCHAR EVENTOS ──────────────────────────────────────────
    // Re-verificar cuando cambian datos
    document.addEventListener('grizalumTransaccionAgregada', () => setTimeout(ejecutarAlertas, 500));
    document.addEventListener('grizalumVentaRegistrada', () => setTimeout(ejecutarAlertas, 500));
    document.addEventListener('grizalumInventarioActualizado', () => setTimeout(ejecutarAlertas, 500));
    document.addEventListener('grizalumConfigGuardada', () => setTimeout(ejecutarAlertas, 500));
    document.addEventListener('grizalumCompanyChanged', () => {
        alertasEnviadas.clear();
        setTimeout(ejecutarAlertas, 1000);
    });

    // ── INICIALIZAR ───────────────────────────────────────────────
    function inicializar() {
        // Esperar que el sistema de notificaciones esté listo
        const esperar = setInterval(() => {
            if (window.instanciaNotificaciones) {
                clearInterval(esperar);
                setTimeout(ejecutarAlertas, 1500);
                console.log('[Alertas] ✅ Sistema de alertas inteligentes activo');
            }
        }, 300);

        // Timeout de seguridad
        setTimeout(() => clearInterval(esperar), 10000);
    }

    inicializar();

})();
