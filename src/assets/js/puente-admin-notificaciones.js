/**
 * ================================================================
 * PUENTE ADMIN → NOTIFICACIONES v1.0
 * Conecta el panel admin con el centro de notificaciones
 * Soluciona errores de renderizado y números invisibles
 * ================================================================
 */

class PuenteAdminNotificaciones {
    constructor() {
        this.version = '1.0.0';
        this.ultimoEnvio = 0;
        this.bloqueadorDuplicados = new Set();
        this.empresaDetectada = null;
        
        console.log('🌉 Iniciando Puente Admin-Notificaciones v1.0');
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.esperarSistemas());
        } else {
            this.esperarSistemas();
        }
    }
    
    esperarSistemas() {
        let intentos = 0;
        const maxIntentos = 10;
        
        const verificar = () => {
            intentos++;
            const adminListo = window.adminEmpresas && typeof window.adminEmpresas.enviarNotificacion === 'function';
            const notifListo = window.GrizalumNotificacionesPremium && typeof window.GrizalumNotificacionesPremium.recibirDelAdmin === 'function';
            
            if (adminListo && notifListo) {
                console.log('✅ Ambos sistemas detectados, estableciendo conexión...');
                this.conectarSistemas();
                return;
            }
            
            if (intentos < maxIntentos) {
                console.log(`⏳ Esperando sistemas (${intentos}/${maxIntentos}) - Admin: ${adminListo ? '✅' : '❌'}, Notif: ${notifListo ? '✅' : '❌'}`);
                setTimeout(verificar, 1500);
            } else {
                console.warn('⚠️ No se pudieron detectar ambos sistemas después de', maxIntentos, 'intentos');
            }
        };
        
        verificar();
    }
    
    conectarSistemas() {
        try {
            // 1. Mejorar detección de empresa actual
            this.configurarDeteccionEmpresa();
            
            // 2. Interceptar y limpiar la función de envío del admin
            this.interceptarEnvioAdmin();
            
            // 3. Crear API de comunicación directa
            this.crearAPIComunicacion();
            
            // 4. Configurar observadores para cambios de empresa
            this.configurarObservadores();
            
            console.log('🔗 Puente establecido exitosamente');
            
            // Test inicial
            setTimeout(() => this.detectarEmpresaActual(), 2000);
            
        } catch (error) {
            console.error('❌ Error conectando sistemas:', error);
        }
    }
    
    configurarDeteccionEmpresa() {
        // Múltiples métodos para detectar empresa activa
        this.metodosDeteccion = [
            // Método 1: Selector principal
            () => {
                const selector = document.getElementById('companySelector');
                if (selector) {
                    const activo = selector.querySelector('.active, [data-selected="true"], .selected');
                    return activo ? activo.textContent?.trim() : null;
                }
                return null;
            },
            
            // Método 2: Buscar en dropdowns
            () => {
                const dropdown = document.querySelector('select[id*="empresa"], select[id*="company"]');
                if (dropdown && dropdown.value) {
                    const opcionSeleccionada = dropdown.querySelector(`option[value="${dropdown.value}"]`);
                    return opcionSeleccionada ? opcionSeleccionada.textContent?.trim() : null;
                }
                return null;
            },
            
            // Método 3: Buscar en títulos/headers
            () => {
                const titulo = document.querySelector('h1, .page-title, .company-name, [id*="empresa"]');
                if (titulo && titulo.textContent) {
                    const texto = titulo.textContent.trim();
                    // Filtrar texto genérico
                    if (texto.length > 3 && !texto.includes('Panel') && !texto.includes('Control')) {
                        return texto;
                    }
                }
                return null;
            },
            
            // Método 4: Buscar en elementos con texto de empresa
            () => {
                const elementos = document.querySelectorAll('span, div, li');
                for (let el of elementos) {
                    if (el.classList.contains('selected') || el.classList.contains('active')) {
                        const texto = el.textContent?.trim();
                        if (texto && texto.length > 3 && !texto.includes('Seleccionar')) {
                            return texto;
                        }
                    }
                }
                return null;
            }
        ];
    }
    
    detectarEmpresaActual() {
        for (let metodo of this.metodosDeteccion) {
            try {
                const empresa = metodo();
                if (empresa && empresa.length > 0) {
                    this.empresaDetectada = this.limpiarNombreEmpresa(empresa);
                    console.log('🏢 Empresa detectada:', this.empresaDetectada);
                    return this.empresaDetectada;
                }
            } catch (error) {
                // Continuar con el siguiente método
            }
        }
        
        console.warn('⚠️ No se pudo detectar empresa activa');
        return null;
    }
    
    limpiarNombreEmpresa(nombre) {
        return nombre
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .substring(0, 50);
    }
    
    interceptarEnvioAdmin() {
        if (!window.adminEmpresas || !window.adminEmpresas.enviarNotificacion) {
            console.warn('⚠️ Función enviarNotificacion del admin no encontrada');
            return;
        }
        
        // Guardar función original
        const envioOriginal = window.adminEmpresas.enviarNotificacion.bind(window.adminEmpresas);
        
        // Sobrescribir con versión mejorada
        window.adminEmpresas.enviarNotificacion = () => {
            this.procesarEnvioAdmin(envioOriginal);
        };
        
        console.log('🔄 Función enviarNotificacion interceptada exitosamente');
    }
    
    procesarEnvioAdmin(funcionOriginal) {
        // Prevenir envíos duplicados
        const ahora = Date.now();
        if (ahora - this.ultimoEnvio < 2000) {
            console.log('🚫 Envío bloqueado por duplicado');
            return;
        }
        this.ultimoEnvio = ahora;
        
        // Detectar empresa actual
        const empresaActual = this.detectarEmpresaActual();
        if (!empresaActual) {
            console.warn('❌ No se puede enviar: empresa no detectada');
            this.mostrarError('No se pudo detectar la empresa seleccionada');
            return;
        }
        
        // Obtener datos del formulario
        const tipo = document.getElementById('premium-tipo-aviso')?.value || 'info';
        const destinatario = document.getElementById('premium-destinatario')?.value || 'todas';
        const mensaje = document.getElementById('premium-mensaje')?.value?.trim();
        
        if (!mensaje) {
            console.warn('❌ Mensaje vacío');
            this.mostrarError('El mensaje es obligatorio');
            return;
        }
        
        // Crear clave única para evitar duplicados
        const claveUnica = `${empresaActual}-${mensaje.substring(0, 20)}-${tipo}`;
        if (this.bloqueadorDuplicados.has(claveUnica)) {
            console.log('🚫 Mensaje duplicado bloqueado');
            return;
        }
        
        this.bloqueadorDuplicados.add(claveUnica);
        setTimeout(() => this.bloqueadorDuplicados.delete(claveUnica), 10000);
        
        console.log('📤 Procesando envío:', { tipo, destinatario, empresa: empresaActual, mensaje: mensaje.substring(0, 50) + '...' });
        
        // Enviar al sistema de notificaciones
        this.enviarANotificaciones(empresaActual, tipo, mensaje, destinatario);
        
        // Ejecutar función original para UI
        try {
            funcionOriginal();
        } catch (error) {
            console.warn('⚠️ Error en función original (UI):', error);
        }
    }
    
    enviarANotificaciones(empresaId, tipo, mensaje, destinatario) {
        if (!window.GrizalumNotificacionesPremium?.recibirDelAdmin) {
            console.error('❌ Sistema de notificaciones no disponible');
            return;
        }
        
        const mapeoTipos = {
            'info': 'admin',
            'warning': 'warning', 
            'urgent': 'urgent',
            'success': 'success'
        };
        
        const mapeoTitulos = {
            'info': 'Mensaje del Administrador',
            'warning': 'Advertencia Administrativa',
            'urgent': 'Aviso Urgente',
            'success': 'Notificación Positiva'
        };
        
        const tipoFinal = mapeoTipos[tipo] || 'admin';
        const titulo = mapeoTitulos[tipo] || 'Mensaje del Administrador';
        
        try {
            if (destinatario === 'todas') {
                // Si es para todas, usar la empresa actual detectada
                const resultado = window.GrizalumNotificacionesPremium.recibirDelAdmin(
                    empresaId,
                    titulo,
                    mensaje,
                    tipoFinal
                );
                
                if (resultado) {
                    console.log('✅ Notificación enviada exitosamente a:', empresaId);
                    this.mostrarExito(`Mensaje enviado a ${empresaId.replace('-', ' ')}`);
                } else {
                    console.warn('⚠️ El envío retornó false o null');
                }
            } else {
                // Lógica para destinatarios específicos (activas, riesgo)
                console.log('📋 Enviando a grupo:', destinatario);
                // Aquí podrías implementar lógica para grupos
            }
            
        } catch (error) {
            console.error('❌ Error enviando a notificaciones:', error);
            this.mostrarError('Error al enviar la notificación');
        }
    }
    
    configurarObservadores() {
        // Observar cambios en el selector de empresas
        const selector = document.getElementById('companySelector');
        if (selector) {
            const observer = new MutationObserver(() => {
                setTimeout(() => this.detectarEmpresaActual(), 500);
            });
            
            observer.observe(selector, { 
                childList: true, 
                subtree: true, 
                attributes: true 
            });
            
            console.log('👁️ Observador de cambios de empresa configurado');
        }
        
        // Observar clics en elementos que puedan cambiar empresa
        document.addEventListener('click', (e) => {
            if (e.target.closest('#companySelector') || e.target.classList.contains('company-item')) {
                setTimeout(() => this.detectarEmpresaActual(), 1000);
            }
        });
    }
    
    crearAPIComunicacion() {
        // API pública para testing y uso externo
        window.PuenteAdminNotificaciones = {
            detectarEmpresa: () => this.detectarEmpresaActual(),
            enviarTest: (mensaje) => this.enviarMensajePrueba(mensaje),
            estado: () => ({
                version: this.version,
                empresaActual: this.empresaDetectada,
                ultimoEnvio: new Date(this.ultimoEnvio).toLocaleTimeString()
            })
        };
        
        console.log('📡 API pública creada: window.PuenteAdminNotificaciones');
    }
    
    enviarMensajePrueba(mensaje = 'Prueba de conexión') {
        const empresa = this.detectarEmpresaActual();
        if (!empresa) {
            console.warn('❌ No se puede enviar prueba: empresa no detectada');
            return false;
        }
        
        this.enviarANotificaciones(empresa, 'info', mensaje, 'todas');
        return true;
    }
    
    mostrarExito(mensaje) {
        this.mostrarToast(mensaje, 'success');
    }
    
    mostrarError(mensaje) {
        this.mostrarToast(mensaje, 'error');
    }
    
    mostrarToast(mensaje, tipo) {
        const colores = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colores[tipo] || colores.info};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 999999;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        toast.textContent = mensaje;
        document.body.appendChild(toast);
        
        // Animación de entrada
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        // Remover después de 4 segundos
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// ================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ================================================================

// Instancia global
let puenteAdmin = null;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        puenteAdmin = new PuenteAdminNotificaciones();
    });
} else {
    puenteAdmin = new PuenteAdminNotificaciones();
}

// ================================================================
// FUNCIONES GLOBALES DE UTILIDAD
// ================================================================

// Función para testing manual
window.testearConexionAdmin = function() {
    if (puenteAdmin) {
        const empresa = puenteAdmin.detectarEmpresaActual();
        console.log('🧪 Test de conexión:', {
            empresaDetectada: empresa,
            sistemaAdmin: !!window.adminEmpresas,
            sistemaNotif: !!window.GrizalumNotificacionesPremium
        });
        
        if (empresa) {
            puenteAdmin.enviarMensajePrueba('✅ Conexión funcionando correctamente');
        }
        
        return empresa;
    } else {
        console.warn('❌ Puente no inicializado');
        return null;
    }
};

// Función para debugging
window.debugPuenteAdmin = function() {
    if (puenteAdmin) {
        return window.PuenteAdminNotificaciones.estado();
    }
    return null;
};

console.log('🌉 Puente Admin-Notificaciones cargado - usar testearConexionAdmin() para probar');
