/**
 * ================================================================
 * UI CUENTAS BANCARIAS - GRIZALUM
 * Interfaz de usuario para el módulo de cuentas bancarias
 * ================================================================
 */

class UICuentasBancarias {
    constructor() {
        this.gestor = null;
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
        // Esperar a que el gestor esté disponible
        const esperarGestor = setInterval(() => {
            if (window.GestorCuentasBancarias) {
                this.gestor = window.GestorCuentasBancarias;
                clearInterval(esperarGestor);
                this.configurarNavegacion();
                console.log('✅ UI Cuentas Bancarias inicializada');
            }
        }, 100);
    }

    configurarNavegacion() {
    const navLink = document.querySelector('.nav-cuentas-bancarias');
    if (navLink) {
        navLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🏦 CLICK DETECTADO en Cuentas Bancarias'); // ← NUEVA LÍNEA
            this.mostrarSeccion();
        });
        console.log('✅ Navegación de Cuentas Bancarias configurada');
    } else {
        console.error('❌ No se encontró el botón de Cuentas Bancarias');
    }
}

    mostrarSeccion() {
    console.log('🏦 Mostrando Cuentas Bancarias');
    
    // Ocultar todas las secciones
    document.querySelectorAll('.dashboard-content').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // Mostrar sección de cuentas bancarias
    const seccion = document.getElementById('cuentasBancariasContent');
    if (seccion) {
        seccion.style.display = 'flex';
        seccion.classList.add('active');
    }

    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const navLink = document.querySelector('.nav-cuentas-bancarias');
    if (navLink) {
        navLink.classList.add('active');
    }

    // Actualizar header
    document.getElementById('pageTitle').textContent = 'Gestión de Cuentas Bancarias';
    document.getElementById('pageSubtitle').textContent = 'Administra tus cuentas, cajas y movimientos';

    // Renderizar contenido
    this.renderizarContenido();
}

    renderizarContenido() {
        const seccion = document.getElementById('cuentasBancariasContent');
        if (!seccion) return;

        const cuentas = this.gestor.cuentas.listar({ soloActivas: true });
        const saldos = this.gestor.reportes.saldoTotal();
        const liquidez = this.gestor.reportes.liquidez();

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

        seccion.innerHTML = `
            <style>
                .bank-header {
                    width: 100%;
                    max-width: 1200px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .bank-title-section h2 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0;
                }
                .bank-title-section p {
                    font-size: 14px;
                    color: #7f8c8d;
                    margin: 5px 0 0 0;
                }
                .btn-new-account {
                    background: linear-gradient(135deg, #d4af37, #f1c40f);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s;
                }
                .btn-new-account:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
                }
                .summary-cards {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    width: 100%;
                    max-width: 1200px;
                    margin-bottom: 30px;
                }
                .summary-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                }
                .summary-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    color: white;
                }
                .summary-card.total .summary-icon {
                    background: linear-gradient(135deg, #3498db, #2980b9);
                }
                .summary-card.banks .summary-icon {
                    background: linear-gradient(135deg, #d4af37, #f1c40f);
                }
                .summary-card.cash .summary-icon {
                    background: linear-gradient(135deg, #27ae60, #2ecc71);
                }
                .summary-card.count .summary-icon {
                    background: linear-gradient(135deg, #9b59b6, #8e44ad);
                }
                .summary-data {
                    display: flex;
                    flex-direction: column;
                }
                .summary-label {
                    font-size: 12px;
                    color: #7f8c8d;
                    margin-bottom: 4px;
                }
                .summary-amount {
                    font-size: 22px;
                    font-weight: 700;
                    color: #2c3e50;
                }
                .accounts-section {
                    width: 100%;
                    max-width: 1200px;
                }
                .section-subtitle {
                    font-size: 20px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                .accounts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 20px;
                }
                .account-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s;
                    border-left: 4px solid #d4af37;
                }
                .account-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                }
                .account-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }
                .account-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #d4af37, #f1c40f);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }
                .account-info h4 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin: 0 0 4px 0;
                }
                .account-type {
                    font-size: 12px;
                    color: #7f8c8d;
                }
                .account-balance {
                    font-size: 28px;
                    font-weight: 700;
                    color: #27ae60;
                    margin-bottom: 12px;
                }
                .account-details {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding-top: 12px;
                    border-top: 1px solid #ecf0f1;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                }
                .detail-label {
                    color: #7f8c8d;
                }
                .detail-value {
                    color: #2c3e50;
                    font-weight: 500;
                }
                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    color: #95a5a6;
                }
                .empty-state i {
                    font-size: 64px;
                    color: #d4af37;
                    margin-bottom: 20px;
                }
                @media (max-width: 1200px) {
                    .summary-cards {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 768px) {
                    .summary-cards, .accounts-grid {
                        grid-template-columns: 1fr;
                    }
                    .bank-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 16px;
                    }
                }
            </style>

            <div class="bank-header">
                <div class="bank-title-section">
                    <h2>Gestión de Cuentas Bancarias</h2>
                    <p>Administra tus cuentas, cajas y movimientos financieros</p>
                </div>
                <button class="btn-new-account" onclick="alert('Próximamente: Modal para crear nueva cuenta')">
                    <i class="fas fa-plus"></i> Nueva Cuenta
                </button>
            </div>

            <div class="summary-cards">
                <div class="summary-card total">
                    <div class="summary-icon">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="summary-data">
                        <span class="summary-label">Saldo Total</span>
                        <span class="summary-amount">S/. ${totalGeneral.toFixed(2)}</span>
                    </div>
                </div>

                <div class="summary-card banks">
                    <div class="summary-icon">
                        <i class="fas fa-landmark"></i>
                    </div>
                    <div class="summary-data">
                        <span class="summary-label">En Bancos</span>
                        <span class="summary-amount">S/. ${totalBancos.toFixed(2)}</span>
                    </div>
                </div>

                <div class="summary-card cash">
                    <div class="summary-icon">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="summary-data">
                        <span class="summary-label">En Cajas</span>
                        <span class="summary-amount">S/. ${totalCajas.toFixed(2)}</span>
                    </div>
                </div>

                <div class="summary-card count">
                    <div class="summary-icon">
                        <i class="fas fa-list"></i>
                    </div>
                    <div class="summary-data">
                        <span class="summary-label">Total Cuentas</span>
                        <span class="summary-amount">${cuentas.length}</span>
                    </div>
                </div>
            </div>

            <div class="accounts-section">
                <h3 class="section-subtitle">Tus Cuentas y Cajas</h3>
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
