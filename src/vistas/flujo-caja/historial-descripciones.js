/**
 * ═══════════════════════════════════════════════════════════════════
 * HISTORIAL INTELIGENTE DE DESCRIPCIONES
 * Guarda y sugiere descripciones por empresa y tipo
 * ═══════════════════════════════════════════════════════════════════
 */

class HistorialDescripciones {
    constructor() {
        this.empresaActual = null;
    }

    /**
     * Establecer empresa actual
     */
    setEmpresa(empresaId) {
        this.empresaActual = empresaId;
        console.log('📝 Historial configurado para empresa:', empresaId);
    }

    /**
     * Obtener clave de localStorage para la empresa actual
     */
    _getKey() {
        if (!this.empresaActual) {
            console.warn('⚠️ No hay empresa actual configurada');
            return null;
        }
        return `grizalum_descripciones_${this.empresaActual}`;
    }

    /**
     * Obtener historial completo de la empresa
     */
    _getHistorial() {
        const key = this._getKey();
        if (!key) return { ingresos: [], gastos: [] };

        const data = localStorage.getItem(key);
        if (!data) {
            return { ingresos: [], gastos: [] };
        }

        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('❌ Error leyendo historial:', e);
            return { ingresos: [], gastos: [] };
        }
    }

    /**
     * Guardar historial completo
     */
    _saveHistorial(historial) {
        const key = this._getKey();
        if (!key) return;

        localStorage.setItem(key, JSON.stringify(historial));
    }

    /**
     * Agregar descripción al historial
     */
    agregar(descripcion, tipo) {
        if (!descripcion || !descripcion.trim()) return;

        descripcion = descripcion.trim();
        const historial = this._getHistorial();

        // Verificar que el tipo sea válido
        if (tipo !== 'ingreso' && tipo !== 'gasto') {
            console.warn('⚠️ Tipo inválido:', tipo);
            return;
        }

        // Usar la clave correcta según el tipo
        const lista = tipo === 'ingreso' ? 'ingresos' : 'gastos';

        // No agregar si ya existe (evitar duplicados)
        if (!historial[lista].includes(descripcion)) {
            historial[lista].push(descripcion);
            this._saveHistorial(historial);
            console.log(`✅ Agregada descripción "${descripcion}" a ${lista}`);
        }
    }

    /**
     * Obtener sugerencias según tipo
     */
    obtener(tipo) {
        const historial = this._getHistorial();
        const lista = tipo === 'ingreso' ? 'ingresos' : 'gastos';
        
        // Ordenar alfabéticamente y devolver
        return historial[lista].sort();
    }

    /**
     * Eliminar una descripción del historial
     */
    eliminar(descripcion, tipo) {
        const historial = this._getHistorial();
        const lista = tipo === 'ingreso' ? 'ingresos' : 'gastos';

        const index = historial[lista].indexOf(descripcion);
        if (index > -1) {
            historial[lista].splice(index, 1);
            this._saveHistorial(historial);
            console.log(`🗑️ Eliminada descripción "${descripcion}" de ${lista}`);
            return true;
        }
        return false;
    }

    /**
     * Limpiar todo el historial de la empresa
     */
    limpiarTodo() {
        const key = this._getKey();
        if (key) {
            localStorage.removeItem(key);
            console.log('🧹 Historial limpiado');
        }
    }

    /**
     * Buscar sugerencias que coincidan con el texto
     */
    buscar(texto, tipo) {
        if (!texto) return this.obtener(tipo);

        const todas = this.obtener(tipo);
        const textoLower = texto.toLowerCase();

        return todas.filter(desc => 
            desc.toLowerCase().includes(textoLower)
        );
    }
}

// Exportar globalmente
window.HistorialDescripciones = HistorialDescripciones;
console.log('✅ HistorialDescripciones cargado');
