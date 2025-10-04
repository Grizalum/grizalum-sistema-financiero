/**
 * ================================================================
 * UI CUENTAS BANCARIAS - GRIZALUM v3.0
 * Interfaz de usuario para el módulo de cuentas bancarias
 * Conectado con navegacion.js
 * ================================================================
 */

class UICuentasBancarias {
    constructor() {
        this.gestor = null;
        this.inicializado = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.inicializar());
        } else {
            this.inicializar();
        }
    }

    inicializar() {
        console.log('🏦 Iniciando UI Cuentas Bancarias...');
        
        // Esperar a que el gestor esté disponible
        const esperarGestor = setInterval(() => {
            if (window.GestorCuentasBancarias) {
                this.gestor = window.GestorCuentasBancarias;
                clearInterval(esperarGestor);
                this.inicializado = true;
                console.log('✅ UI Cuentas Bancarias inicializada con gestor');
            }
        }, 100);
        
        // Timeout de seguridad
        setTimeout(() => {
            if (!this.inicializado) {
                clearInterval(esperarGestor);
                console.error('❌ Timeout: Gestor no disponible después de 5s');
            }
        }, 5000);
    }

    mostrarSeccion() {
        console.log('🏦 mostrarSeccion() llamada');
        
        if (!this.gestor) {
            console.error('❌ Gestor no disponible');
            return;
        }
        
        // Renderizar contenido
        this.renderizarContenido();
    }

   renderizarContenido() {
    console.log('🎨 Renderizando contenido de Cuentas Bancarias...');
    
    const seccion = document.getElementById('cuentasBancariasContent');
    if (!seccion) {
        console.error('❌ No se encontró el contenedor cuentasBancariasContent');
        return;
    }

    // CRÍTICO: Marcar que estamos renderizando
    seccion.setAttribute('data-rendering', 'true');

    const cuentas = this.gestor.cuentas.listar({ soloActivas: true });

    // Calcular totales
    let totalGeneral = 0;
    let totalBancos = 0;
    let totalCajas = 0;

    cuentas.forEach(cuenta => {
        totalGeneral += cuenta.saldoActual;
        if (cuenta.tipoCuenta === 'Caja') {
            totalCajas += cuenta.saldoActual;
        } else {
            totalBancos += cuenta.saldoActual;
        }
    });

    const htmlContent = `
        <style>
            #cuentasBancariasContent {
                display: flex !important;
                flex-direction: column;
                align-items: center;
                padding: 30px;
                width: 100%;
            }
            /* [TODO EL CSS IGUAL QUE ANTES] */
        </style>

        <div class="bank-header">
            <div class="bank-title-section">
                <h2>🏦 Gestión de Cuentas Bancarias</h2>
                <p>Administra tus cuentas, cajas y movimientos financieros</p>
            </div>
            <button class="btn-new-account" onclick="alert('Próximamente: Modal para crear nueva cuenta')">
                <i class="fas fa-plus"></i> Nueva Cuenta
            </button>
        </div>

        <!-- [RESTO DEL HTML IGUAL] -->
        
        <div class="accounts-section">
            <h3 class="section-subtitle">Tus Cuentas y Cajas (${cuentas.length})</h3>
            <div class="accounts-grid">
                ${cuentas.length === 0 ? `
                    <div class="empty-state">
                        <i class="fas fa-university"></i>
                        <p style="font-size: 18px; margin: 0 0 8px 0;">No tienes cuentas registradas</p>
                        <p style="font-size: 14px;">Haz clic en "Nueva Cuenta" para comenzar</p>
                    </div>
                ` : cuentas.map(cuenta => this.renderizarTarjetaCuenta(cuenta)).join('')}
            </div>
        </div>
    `;

    // Inyectar contenido
    seccion.innerHTML = htmlContent;
    
    // Forzar visibilidad
    seccion.style.display = 'flex';
    seccion.style.flexDirection = 'column';
    seccion.classList.add('active');
    
    // Marcar como completado
    seccion.setAttribute('data-rendered', 'true');
    seccion.removeAttribute('data-rendering');
    
    console.log('✅ Contenido renderizado y protegido');
    console.log('📊 Cuentas mostradas:', cuentas.length);
}

    renderizarTarjetaCuenta(cuenta) {
        const banco = this.gestor.catalogos.bancos[cuenta.banco];
        const tipoCaja = cuenta.tipoCaja ? this.gestor.catalogos.tiposCaja[cuenta.tipoCaja] : null;
        const icono = tipoCaja ? tipoCaja.icono : (banco ? banco.icono : 'fas fa-university');
        
        return `
            <div class="account-card">
                <div class="account-header">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div class="account-icon-wrapper">
                            <i class="${icono}"></i>
                        </div>
                        <div class="account-info">
                            <h4>${cuenta.alias}</h4>
                            <span class="account-type">${cuenta.tipoCuenta} - ${cuenta.moneda}</span>
                        </div>
                    </div>
                </div>
                <div class="account-balance">S/. ${cuenta.saldoActual.toFixed(2)}</div>
                <div class="account-details">
                    ${cuenta.numeroCuenta ? `
                        <div class="detail-row">
                            <span class="detail-label">Número de cuenta</span>
                            <span class="detail-value">${cuenta.numeroCuenta}</span>
                        </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="detail-label">Banco</span>
                        <span class="detail-value">${banco ? banco.nombre : (tipoCaja ? tipoCaja.nombre : 'N/A')}</span>
                    </div>
                    ${cuenta.proposito ? `
                        <div class="detail-row">
                            <span class="detail-label">Propósito</span>
                            <span class="detail-value">${cuenta.proposito}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Inicializar automáticamente
const uiCuentas = new UICuentasBancarias();
window.uiCuentas = uiCuentas;

// CRÍTICO: Exponer función para que navegacion.js la llame
window.mostrarSeccionCuentasBancarias = function() {
    console.log('🏦 mostrarSeccionCuentasBancarias() llamada desde navegacion.js');
    uiCuentas.mostrarSeccion();
};

console.log('✅ UI Cuentas Bancarias v3.0 cargado');
