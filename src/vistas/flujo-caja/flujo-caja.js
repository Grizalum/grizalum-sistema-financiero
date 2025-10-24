/**
 * ═══════════════════════════════════════════════════════════════════
 * FLUJO DE CAJA - SISTEMA DE VALIDACIONES
 * Validación robusta de datos antes de guardar transacciones
 * VERSION: 1.0.0
 * ═══════════════════════════════════════════════════════════════════
 */

class FlujoCajaValidador {
    constructor() {
        this.config = {
            montoMinimo: 0.01,
            montoMaximo: 999999999,
            descripcionMaxLength: 200,
            diasMaximosFuturo: 0, // No permitir fechas futuras
            diasMaximosPasado: 3650 // Máximo 10 años atrás
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * VALIDACIÓN COMPLETA DE TRANSACCIÓN
     * ═══════════════════════════════════════════════════════════════
     */
    validarTransaccion(datos) {
        const errores = [];

        // Validar cada campo
        errores.push(...this.validarTipo(datos.tipo));
        errores.push(...this.validarMonto(datos.monto));
        errores.push(...this.validarCategoria(datos.categoria));
        errores.push(...this.validarFecha(datos.fecha));
        
        // Validaciones opcionales
        if (datos.descripcion) {
            errores.push(...this.validarDescripcion(datos.descripcion));
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            datos: this.limpiarDatos(datos)
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * VALIDACIONES INDIVIDUALES
     * ═══════════════════════════════════════════════════════════════
     */

    validarTipo(tipo) {
        const errores = [];

        if (!tipo) {
            errores.push({
                campo: 'tipo',
                mensaje: 'El tipo de transacción es obligatorio',
                codigo: 'TIPO_REQUERIDO'
            });
            return errores;
        }

        if (!['ingreso', 'gasto'].includes(tipo)) {
            errores.push({
                campo: 'tipo',
                mensaje: 'El tipo debe ser "ingreso" o "gasto"',
                codigo: 'TIPO_INVALIDO'
            });
        }

        return errores;
    }

    validarMonto(monto) {
        const errores = [];

        // Verificar que existe
        if (monto === null || monto === undefined || monto === '') {
            errores.push({
                campo: 'monto',
                mensaje: 'El monto es obligatorio',
                codigo: 'MONTO_REQUERIDO'
            });
            return errores;
        }

        // Convertir a número
        const montoNum = parseFloat(monto);

        // Verificar que es un número válido
        if (isNaN(montoNum)) {
            errores.push({
                campo: 'monto',
                mensaje: 'El monto debe ser un número válido',
                codigo: 'MONTO_NO_NUMERICO'
            });
            return errores;
        }

        // Verificar monto mínimo
        if (montoNum < this.config.montoMinimo) {
            errores.push({
                campo: 'monto',
                mensaje: `El monto debe ser mayor a S/. ${this.config.montoMinimo}`,
                codigo: 'MONTO_MUY_PEQUENO'
            });
        }

        // Verificar monto máximo
        if (montoNum > this.config.montoMaximo) {
            errores.push({
                campo: 'monto',
                mensaje: `El monto no puede superar S/. ${this.config.montoMaximo.toLocaleString()}`,
                codigo: 'MONTO_MUY_GRANDE'
            });
        }

        // Verificar decimales (máximo 2)
        if (!/^\d+(\.\d{1,2})?$/.test(monto.toString())) {
            errores.push({
                campo: 'monto',
                mensaje: 'El monto solo puede tener hasta 2 decimales',
                codigo: 'MONTO_DECIMALES_INVALIDOS'
            });
        }

        return errores;
    }

    validarCategoria(categoria) {
        const errores = [];

        if (!categoria || categoria.trim() === '') {
            errores.push({
                campo: 'categoria',
                mensaje: 'Debe seleccionar una categoría',
                codigo: 'CATEGORIA_REQUERIDA'
            });
            return errores;
        }

        // Validar longitud
        if (categoria.length > 100) {
            errores.push({
                campo: 'categoria',
                mensaje: 'La categoría es demasiado larga (máximo 100 caracteres)',
                codigo: 'CATEGORIA_MUY_LARGA'
            });
        }

        return errores;
    }

    validarFecha(fecha) {
        const errores = [];

        if (!fecha) {
            errores.push({
                campo: 'fecha',
                mensaje: 'La fecha es obligatoria',
                codigo: 'FECHA_REQUERIDA'
            });
            return errores;
        }

        // Convertir a fecha
        const fechaObj = new Date(fecha);
        
        // Verificar que es una fecha válida
        if (isNaN(fechaObj.getTime())) {
            errores.push({
                campo: 'fecha',
                mensaje: 'La fecha no es válida',
                codigo: 'FECHA_INVALIDA'
            });
            return errores;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const fechaInput = new Date(fechaObj);
        fechaInput.setHours(0, 0, 0, 0);

        // Verificar que no es fecha futura
        if (fechaInput > hoy) {
            errores.push({
                campo: 'fecha',
                mensaje: 'No se permiten fechas futuras',
                codigo: 'FECHA_FUTURA'
            });
        }

        // Verificar que no es muy antigua
        const diasDiferencia = Math.floor((hoy - fechaInput) / (1000 * 60 * 60 * 24));
        if (diasDiferencia > this.config.diasMaximosPasado) {
            errores.push({
                campo: 'fecha',
                mensaje: `La fecha no puede ser mayor a ${Math.floor(this.config.diasMaximosPasado / 365)} años atrás`,
                codigo: 'FECHA_MUY_ANTIGUA'
            });
        }

        return errores;
    }

    validarDescripcion(descripcion) {
        const errores = [];

        if (descripcion && descripcion.length > this.config.descripcionMaxLength) {
            errores.push({
                campo: 'descripcion',
                mensaje: `La descripción no puede superar ${this.config.descripcionMaxLength} caracteres`,
                codigo: 'DESCRIPCION_MUY_LARGA'
            });
        }

        return errores;
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * LIMPIEZA DE DATOS
     * ═══════════════════════════════════════════════════════════════
     */
    limpiarDatos(datos) {
        return {
            tipo: datos.tipo?.trim().toLowerCase(),
            monto: parseFloat(parseFloat(datos.monto).toFixed(2)),
            categoria: datos.categoria?.trim(),
            descripcion: datos.descripcion?.trim() || '',
            fecha: datos.fecha,
            metodoPago: datos.metodoPago?.trim() || 'efectivo',
            comprobante: datos.comprobante || null,
            notas: datos.notas?.trim() || ''
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * FORMATEAR MENSAJES DE ERROR PARA UI
     * ═══════════════════════════════════════════════════════════════
     */
    formatearErroresParaUI(errores) {
        if (errores.length === 0) {
            return '';
        }

        if (errores.length === 1) {
            return errores[0].mensaje;
        }

        return '• ' + errores.map(e => e.mensaje).join('\n• ');
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * VALIDACIONES RÁPIDAS (para uso en formularios)
     * ═══════════════════════════════════════════════════════════════
     */
    
    esMontoDec(valor) {
        return /^\d+(\.\d{1,2})?$/.test(valor.toString());
    }

    esMontoPositivo(valor) {
        return parseFloat(valor) > 0;
    }

    esFechaValida(fecha) {
        const fechaObj = new Date(fecha);
        return !isNaN(fechaObj.getTime());
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * VALIDACIÓN EN TIEMPO REAL (para inputs)
     * ═══════════════════════════════════════════════════════════════
     */
    validarCampoEnTiempoReal(campo, valor) {
        switch (campo) {
            case 'monto':
                return this.validarMonto(valor);
            case 'categoria':
                return this.validarCategoria(valor);
            case 'fecha':
                return this.validarFecha(valor);
            case 'descripcion':
                return this.validarDescripcion(valor);
            default:
                return [];
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * VALIDAR MÚLTIPLES TRANSACCIONES (para importación)
     * ═══════════════════════════════════════════════════════════════
     */
    validarLote(transacciones) {
        const resultados = [];
        
        transacciones.forEach((transaccion, index) => {
            const validacion = this.validarTransaccion(transaccion);
            resultados.push({
                indice: index,
                ...validacion
            });
        });

        const validas = resultados.filter(r => r.valido).length;
        const invalidas = resultados.filter(r => !r.valido).length;

        return {
            total: transacciones.length,
            validas,
            invalidas,
            resultados
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════════
     * CONFIGURACIÓN PERSONALIZADA
     * ═══════════════════════════════════════════════════════════════
     */
    configurar(opciones) {
        this.config = {
            ...this.config,
            ...opciones
        };
    }

    obtenerConfiguracion() {
        return { ...this.config };
    }
}

// ═══════════════════════════════════════════════════════════════════
// EXPORTAR CLASE GLOBALMENTE
// ═══════════════════════════════════════════════════════════════════
window.FlujoCajaValidador = FlujoCajaValidador;

// Crear instancia global
window.flujoCajaValidador = new FlujoCajaValidador();

console.log('✅ Sistema de validaciones de Flujo de Caja cargado');
