/**
 * ═══════════════════════════════════════════════════════════════════
 * BALANCE GENERAL - CONFIG
 * Configuración central: cuentas, categorías y ajustes globales
 * v20260417
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    window.BalanceGeneralConfig = {

        version: '20260417',
        moneda: 'S/',
        storagePrefix: 'grizalum_balance_',

        // Clasificación de cuentas del balance
        clasificacion: {
            activosCorrientes: {
                nombre: 'Activos Corrientes',
                cuentas: [
                    { id: 'efectivo',      nombre: 'Efectivo y Equivalentes',  tipo: 'calculado' },
                    { id: 'cuentasCobrar', nombre: 'Cuentas por Cobrar',        tipo: 'manual', valor: 0 },
                    { id: 'inventario',    nombre: 'Inventario',                tipo: 'manual', valor: 0 }
                ]
            },
            activosNoCorrientes: {
                nombre: 'Activos No Corrientes',
                cuentas: [
                    { id: 'equipos',      nombre: 'Equipos y Maquinaria',         tipo: 'manual', valor: 0 },
                    { id: 'muebles',      nombre: 'Muebles y Enseres',            tipo: 'manual', valor: 0 },
                    { id: 'vehiculos',    nombre: 'Vehículos',                    tipo: 'manual', valor: 0 },
                    { id: 'depreciacion', nombre: '(-) Depreciación Acumulada',   tipo: 'manual', valor: 0 }
                ]
            },
            pasivosCorrientes: {
                nombre: 'Pasivos Corrientes',
                cuentas: [
                    { id: 'cuentasPagar',    nombre: 'Cuentas por Pagar',          tipo: 'manual',    valor: 0 },
                    { id: 'prestamosCorto',  nombre: 'Préstamos a Corto Plazo',    tipo: 'calculado' },
                    { id: 'impuestos',       nombre: 'Impuestos por Pagar',        tipo: 'manual',    valor: 0 }
                ]
            },
            pasivosNoCorrientes: {
                nombre: 'Pasivos No Corrientes',
                cuentas: [
                    { id: 'prestamosLargo', nombre: 'Préstamos a Largo Plazo', tipo: 'manual', valor: 0 },
                    { id: 'hipotecas',      nombre: 'Hipotecas',               tipo: 'manual', valor: 0 }
                ]
            },
            patrimonio: {
                nombre: 'Patrimonio',
                cuentas: [
                    { id: 'capital',               nombre: 'Capital Social',           tipo: 'manual',    valor: 0 },
                    { id: 'reservas',              nombre: 'Reservas',                 tipo: 'manual',    valor: 0 },
                    { id: 'resultadoEjercicio',    nombre: 'Resultado del Ejercicio',  tipo: 'calculado' },
                    { id: 'resultadosAcumulados',  nombre: 'Resultados Acumulados',    tipo: 'manual',    valor: 0 }
                ]
            }
        },

        // Nombres de los períodos para mostrar en pantalla
        nombresPeriodos: {
            hoy:       'Hoy',
            semana:    'Esta semana',
            mes:       'Mes actual',
            trimestre: 'Este trimestre',
            'año':     'Este año'
        },

        // Colores de cada sección (para gráficos y estilos)
        colores: {
            activosCorrientes:    { fondo: 'rgba(16,185,129,0.85)',  borde: '#10b981' },
            activosNoCorrientes:  { fondo: 'rgba(5,150,105,0.85)',   borde: '#059669' },
            pasivosCorrientes:    { fondo: 'rgba(239,68,68,0.85)',   borde: '#ef4444' },
            pasivosNoCorrientes:  { fondo: 'rgba(185,28,28,0.85)',   borde: '#b91c1c' },
            patrimonio:           { fondo: 'rgba(139,92,246,0.85)',  borde: '#8b5cf6' }
        }
    };

    console.log('✅ [BG-Config] Cargado v' + window.BalanceGeneralConfig.version);

})();
