/**
 * ═══════════════════════════════════════════════════════════════════
 * MEJORA PARA panel-control-ui.js
 * Reemplazar el método destruirGraficos() existente con esta versión
 * ═══════════════════════════════════════════════════════════════════
 */

// UBICACIÓN: Al final de la clase PanelControlUI, justo antes del cierre }
// REEMPLAZAR el método destruirGraficos() existente con este:

destruirGraficos() {
    this._log('info', '🧹 Destruyendo gráficos...');
    
    // Método 1: Destruir usando referencias guardadas
    Object.entries(this.graficos).forEach(([nombre, grafico]) => {
        if (grafico) {
            try {
                grafico.destroy();
                this._log('info', `   ✅ ${nombre} destruido`);
            } catch (e) {
                this._log('warn', `   ⚠️ Error destruyendo ${nombre}:`, e);
            }
        }
    });
    
    // Método 2: Destruir usando Chart.getChart() para limpiar huérfanos
    const canvasIds = [
        'graficoFlujoCajaPrincipal',
        'graficoDistribucionGastos',
        'graficoIngresosVsGastos',
        'graficoTendenciaMensual'
    ];
    
    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            const chartInstance = Chart.getChart(canvas);
            if (chartInstance) {
                try {
                    chartInstance.destroy();
                    this._log('info', `   ✅ Canvas ${id} limpiado`);
                } catch (e) {
                    this._log('warn', `   ⚠️ Error limpiando canvas ${id}:`, e);
                }
            }
        }
    });
    
    // Resetear referencias
    this.graficos = {
        principal: null,
        distribucion: null,
        comparativa: null,
        tendencia: null
    };
    
    this._log('success', '✅ Todos los gráficos destruidos correctamente');
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * NUEVO MÉTODO: Limpiar y reinicializar todo
 * Agregar este método DESPUÉS de destruirGraficos()
 * ═══════════════════════════════════════════════════════════════════
 */

limpiarYReinicializar() {
    this._log('info', '🔄 Limpieza y reinicialización completa...');
    
    // 1. Destruir gráficos existentes
    this.destruirGraficos();
    
    // 2. Pequeña pausa para liberar recursos
    setTimeout(() => {
        // 3. Recargar datos
        this.cargarDatos();
        
        // 4. Recrear gráficos
        setTimeout(() => {
            this.inicializarGraficos();
            this._log('success', '✅ Reinicialización completada');
        }, 200);
    }, 100);
}
