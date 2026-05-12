/**
 * ═══════════════════════════════════════════════════════════════════
 * GRIZALUM — CONFIGURACIÓN v1.0
 * Perfil de empresa, metas, categorías y datos de facturación
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ── CLAVE DE STORAGE ──────────────────────────────────────────
    function keyConfig() {
        const emp = localStorage.getItem('grizalum_empresa_activa') || 'grizalum';
        return 'grizalum_config_' + emp;
    }

    function keyCategoriasIngreso() {
        const emp = localStorage.getItem('grizalum_empresa_activa') || 'grizalum';
        return 'grizalum_categorias_ingreso_' + emp;
    }

    function keyCategoriasGasto() {
        const emp = localStorage.getItem('grizalum_empresa_activa') || 'grizalum';
        return 'grizalum_categorias_gasto_' + emp;
    }

    // ── CATEGORÍAS POR DEFECTO ────────────────────────────────────
    const CATEGORIAS_DEFAULT = {
        ingreso: [
            'Ventas',
            'Servicios',
            'Cobros a clientes',
            'Intereses bancarios',
            'Ingresos por inversión',
            'Préstamo recibido',
            'Subsidios/Donaciones',
            'Otros Ingresos'
        ],
        gasto: [
            'Compras de inventario',
            'Sueldos y salarios',
            'Alquiler',
            'Servicios (luz, agua, internet)',
            'Transporte y logística',
            'Marketing y publicidad',
            'Mantenimiento',
            'Impuestos y tasas',
            'Seguros',
            'Pago de préstamo',
            'Gastos Operativos',
            'Otros Gastos'
        ]
    };

    // ── CARGAR CATEGORÍAS ─────────────────────────────────────────
    function obtenerCategorias(tipo) {
        const key = tipo === 'ingreso' ? keyCategoriasIngreso() : keyCategoriasGasto();
        try {
            const raw = localStorage.getItem(key);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return [...CATEGORIAS_DEFAULT[tipo]];
    }

    function guardarCategorias(tipo, lista) {
        const key = tipo === 'ingreso' ? keyCategoriasIngreso() : keyCategoriasGasto();
        localStorage.setItem(key, JSON.stringify(lista));

        // Notificar a Flujo de Caja que las categorías cambiaron
        document.dispatchEvent(new CustomEvent('grizalumCategoriasActualizadas', { detail: { tipo } }));

        // Actualizar categoriasPersonalizadas si existe
        if (window.categoriasPersonalizadas) {
            window.categoriasPersonalizadas._cache = null;
        }
    }

    // ── RENDERIZAR CATEGORÍAS ─────────────────────────────────────
    function renderizarCategorias(tipo) {
        const contenedor = document.getElementById('lista-categorias-' + tipo);
        if (!contenedor) return;

        const lista = obtenerCategorias(tipo);
        contenedor.innerHTML = '';

        if (lista.length === 0) {
            contenedor.innerHTML = '<span style="color:rgba(160,145,107,0.5);font-size:13px;">Sin categorías. Agrega una con el botón.</span>';
            return;
        }

        lista.forEach((cat, idx) => {
            const tag = document.createElement('div');
            tag.className = 'config-categoria-tag ' + tipo;
            tag.innerHTML = `
                <span>${cat}</span>
                <button class="config-categoria-btn-eliminar" 
                        onclick="eliminarCategoria('${tipo}', ${idx})" 
                        title="Eliminar categoría">
                    <i class="fas fa-times"></i>
                </button>
            `;
            contenedor.appendChild(tag);
        });
    }

    // ── AGREGAR CATEGORÍA ─────────────────────────────────────────
    window.agregarCategoria = function (tipo) {
        const tipoTexto = tipo === 'ingreso' ? 'ingreso' : 'gasto';
        const nombre = prompt('Nueva categoría de ' + tipoTexto + ':');
        if (!nombre || nombre.trim() === '') return;

        const lista = obtenerCategorias(tipo);
        const nombreLimpio = nombre.trim();

        if (lista.some(c => c.toLowerCase() === nombreLimpio.toLowerCase())) {
            mostrarToast('Esa categoría ya existe', 'warning');
            return;
        }

        lista.push(nombreLimpio);
        guardarCategorias(tipo, lista);
        renderizarCategorias(tipo);
        mostrarToast('Categoría "' + nombreLimpio + '" agregada');
    };

    // ── ELIMINAR CATEGORÍA ────────────────────────────────────────
    window.eliminarCategoria = function (tipo, idx) {
        const lista = obtenerCategorias(tipo);
        const nombre = lista[idx];
        if (!confirm('¿Eliminar "' + nombre + '"?')) return;

        lista.splice(idx, 1);
        guardarCategorias(tipo, lista);
        renderizarCategorias(tipo);
        mostrarToast('Categoría eliminada');
    };

    // ── CARGAR CONFIGURACIÓN EN FORMULARIO ─────────────────────────
    function cargarFormulario() {
        try {
            const raw = localStorage.getItem(keyConfig());
            const cfg = raw ? JSON.parse(raw) : {};

            setValue('cfg-nombre-empresa', cfg.nombreEmpresa || '');
            setValue('cfg-rubro', cfg.rubro || '');
            setValue('cfg-ruc', cfg.ruc || '');
            setValue('cfg-moneda', cfg.moneda || 'PEN');
            setValue('cfg-pais', cfg.pais || 'PE');
            setValue('cfg-direccion', cfg.direccion || '');
            setValue('cfg-telefono', cfg.telefono || '');
            setValue('cfg-meta-ventas', cfg.metaVentas || '');
            setValue('cfg-meta-utilidad', cfg.metaUtilidad || '');
            setValue('cfg-limite-gastos', cfg.limiteGastos || '');
            setValue('cfg-alerta-stock', cfg.alertaStock || '');
            setValue('cfg-razon-social', cfg.razonSocial || '');
            setValue('cfg-regimen', cfg.regimen || '');
            setValue('cfg-email', cfg.email || '');
            setValue('cfg-web', cfg.web || '');

            actualizarPrefijosMoneda(cfg.moneda || 'PEN');

        } catch (e) {
            console.error('[Config] Error al cargar formulario:', e);
        }
    }

    function setValue(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }

    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    // ── ACTUALIZAR PREFIJOS DE MONEDA ─────────────────────────────
    function actualizarPrefijosMoneda(moneda) {
        const simbolos = { PEN: 'S/', USD: '$', EUR: '€', MXN: '$', COP: '$', CLP: '$' };
        const s = simbolos[moneda] || 'S/';
        ['cfg-prefix-ventas', 'cfg-prefix-utilidad', 'cfg-prefix-gastos'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = s;
        });
    }

    // ── GUARDAR CONFIGURACIÓN ─────────────────────────────────────
    window.guardarConfiguracion = function () {
        const cfg = {
            nombreEmpresa: getValue('cfg-nombre-empresa'),
            rubro:         getValue('cfg-rubro'),
            ruc:           getValue('cfg-ruc'),
            moneda:        getValue('cfg-moneda'),
            pais:          getValue('cfg-pais'),
            direccion:     getValue('cfg-direccion'),
            telefono:      getValue('cfg-telefono'),
            metaVentas:    parseFloat(getValue('cfg-meta-ventas')) || 0,
            metaUtilidad:  parseFloat(getValue('cfg-meta-utilidad')) || 0,
            limiteGastos:  parseFloat(getValue('cfg-limite-gastos')) || 0,
            alertaStock:   parseInt(getValue('cfg-alerta-stock')) || 0,
            razonSocial:   getValue('cfg-razon-social'),
            regimen:       getValue('cfg-regimen'),
            email:         getValue('cfg-email'),
            web:           getValue('cfg-web'),
            updatedAt:     new Date().toISOString()
        };

        localStorage.setItem(keyConfig(), JSON.stringify(cfg));

        // Actualizar símbolo de moneda en todo el sistema
        actualizarPrefijosMoneda(cfg.moneda);

        // Exponer config globalmente para otros módulos
        window.grizalumConfig = cfg;

        // Disparar evento para que otros módulos se actualicen
        document.dispatchEvent(new CustomEvent('grizalumConfigGuardada', { detail: cfg }));
        window.dispatchEvent(new CustomEvent('grizalumConfigGuardada', { detail: cfg }));

        mostrarToast('✓ Configuración guardada correctamente');
        console.log('[Config] Guardado:', cfg);
    };

    // ── RESTABLECER ───────────────────────────────────────────────
    window.resetearConfiguracion = function () {
        if (!confirm('¿Restablecer configuración? Se borrarán los datos del formulario pero NO tus transacciones ni inventario.')) return;

        localStorage.removeItem(keyConfig());
        cargarFormulario();
        mostrarToast('Configuración restablecida', 'warning');
    };

    // ── TOAST ─────────────────────────────────────────────────────
    function mostrarToast(msg, tipo) {
        const toast = document.getElementById('config-toast');
        const msgEl = document.getElementById('config-toast-msg');
        if (!toast || !msgEl) return;

        msgEl.textContent = msg;
        toast.style.background = tipo === 'warning' ? '#f59e0b' : '#10b981';
        toast.style.display = 'flex';

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.display = 'none';
        }, 2800);
    }

    // ── EVENTO: CAMBIO DE MONEDA ──────────────────────────────────
    function escucharMoneda() {
        const select = document.getElementById('cfg-moneda');
        if (select) {
            select.addEventListener('change', () => {
                actualizarPrefijosMoneda(select.value);
            });
        }
    }

    // ── EXPONER GETTER GLOBAL (para otros módulos) ────────────────
    window.obtenerConfigEmpresa = function () {
        try {
            const raw = localStorage.getItem(keyConfig());
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    };

    // ── INICIALIZAR ───────────────────────────────────────────────
    window.inicializarConfiguracion = function () {
        console.log('[Config] Inicializando...');
        cargarFormulario();
        renderizarCategorias('ingreso');
        renderizarCategorias('gasto');
        escucharMoneda();

        // Exponer config actual globalmente desde el inicio
        window.grizalumConfig = window.obtenerConfigEmpresa();

        console.log('[Config] ✅ Listo');
    };

    // Autoarranque con pequeño delay para que el DOM esté montado
    setTimeout(window.inicializarConfiguracion, 150);

})();
