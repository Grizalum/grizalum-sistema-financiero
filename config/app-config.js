// ===================================================================
// GRIZALUM - Configuración de Aplicación
// Archivo de configuración principal del sistema
// ===================================================================

const GRIZALUM_CONFIG = {
  // ===============================================================
  // INFORMACIÓN DE LA EMPRESA
  // ===============================================================
  company: {
    name: "GRIZALUM",
    fullName: "GRIZALUM - Sistema Financiero Empresarial",
    tagline: "Transformando la gestión financiera empresarial",
    description: "Sistema financiero premium con IA integrada para empresas peruanas",
    
    // Información de contacto
    contact: {
      email: "contacto@grizalum.com",
      phone: "+51 1 234-5678",
      website: "https://grizalum.com",
      address: "Lima, Perú"
    },
    
    // Redes sociales
    social: {
      linkedin: "https://linkedin.com/company/grizalum",
      twitter: "https://twitter.com/grizalum",
      facebook: "https://facebook.com/grizalum",
      youtube: "https://youtube.com/@grizalum"
    }
  },

  // ===============================================================
  // CONFIGURACIÓN REGIONAL
  // ===============================================================
  localization: {
    currency: "S/.",
    currencyCode: "PEN",
    locale: "es-PE",
    timezone: "America/Lima",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm",
    numberFormat: {
      thousands: ",",
      decimal: ".",
      precision: 2
    }
  },

  // ===============================================================
  // CONFIGURACIÓN DE TEMA Y COLORES
  // ===============================================================
  theme: {
    // Colores principales (Paleta Peruana Premium)
    colors: {
      // Colores primarios
      primary: "#d4af37",        // Oro peruano
      primaryDark: "#0f172a",    // Azul corporativo oscuro
      primaryLight: "#334155",   // Azul corporativo claro
      secondary: "#475569",      // Gris corporativo
      
      // Colores financieros
      profit: "#059669",         // Verde ganancias
      loss: "#dc2626",          // Rojo pérdidas
      neutral: "#3b82f6",       // Azul neutral
      warning: "#d97706",       // Naranja advertencia
      info: "#0891b2",          // Azul información
      
      // Colores peruanos adicionales
      peruGold: "#d4af37",      // Oro del Perú
      peruCopper: "#b87333",    // Cobre peruano
      peruBronze: "#8b4513",    // Bronce peruano
      emerald: "#10b981",       // Esmeralda
      ruby: "#dc2626",          // Rubí
      amber: "#f59e0b",         // Ámbar
      indigo: "#6366f1",        // Índigo
      violet: "#7c3aed",        // Violeta
      
      // Escala de grises
      gray50: "#f8fafc",
      gray100: "#f1f5f9",
      gray200: "#e2e8f0",
      gray300: "#cbd5e1",
      gray400: "#94a3b8",
      gray500: "#64748b",
      gray600: "#475569",
      gray700: "#334155",
      gray800: "#1e293b",
      gray900: "#0f172a"
    },
    
    // Gradientes personalizados
    gradients: {
      primary: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      gold: "linear-gradient(135deg, #d4af37 0%, #b87333 50%, #8b4513 100%)",
      profit: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      loss: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      blue: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      emerald: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      violet: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
      amber: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)"
    },
    
    // Sombras premium
    shadows: {
      sm: "0 2px 4px rgba(0, 0, 0, 0.1)",
      default: "0 4px 6px rgba(0, 0, 0, 0.1)",
      md: "0 6px 15px rgba(0, 0, 0, 0.15)",
      lg: "0 10px 25px rgba(0, 0, 0, 0.2)",
      xl: "0 20px 40px rgba(0, 0, 0, 0.25)",
      "2xl": "0 25px 50px rgba(0, 0, 0, 0.35)"
    },
    
    // Tipografía
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
      sizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem"
      }
    }
  },

  // ===============================================================
  // CONFIGURACIÓN DE APLICACIÓN
  // ===============================================================
  app: {
    version: "2.0.0",
    buildDate: "2025-01-17",
    environment: "production", // development | staging | production
    
    // URLs y endpoints
    urls: {
      base: "https://grizalum.github.io/grizalum-sistema-financiero/",
      api: "https://api.grizalum.com/v2",
      docs: "https://docs.grizalum.com",
      support: "https://support.grizalum.com"
    },
    
    // Configuración de características
    features: {
      realTimeUpdates: true,
      offlineMode: true,
      pwaSupport: true,
      darkMode: false,        // Por implementar
      multiLanguage: false,   // Por implementar
      notifications: true,
      analytics: true,
      debugMode: false
    },
    
    // Límites y restricciones
    limits: {
      maxTransactions: 10000,
      maxChartPoints: 365,
      maxFileSize: "5MB",
      sessionTimeout: 3600000, // 1 hora en ms
      autoSaveInterval: 30000   // 30 segundos
    }
  },

  // ===============================================================
  // CONFIGURACIÓN DE DATOS
  // ===============================================================
  data: {
    // Datos iniciales de ejemplo
    defaultValues: {
      initialCashFlow: 25000,
      targetRevenue: 500000,
      targetProfit: 150000,
      fiscalYearStart: "01/01",
      businessDays: [1, 2, 3, 4, 5] // Lunes a Viernes
    },
    
    // Categorías predefinidas
    categories: {
      income: [
        "Venta de productos",
        "Prestación de servicios",
        "Ingresos financieros",
        "Otros ingresos"
      ],
      expenses: [
        "Compra de mercaderías",
        "Gastos operativos",
        "Gastos administrativos",
        "Gastos de ventas",
        "Gastos financieros",
        "Otros gastos"
      ],
      transactionTypes: [
        "Operativo",
        "Inversión",
        "Financiamiento"
      ]
    },
    
    // Configuración de almacenamiento
    storage: {
      type: "indexedDB", // localStorage | indexedDB | firebase
      autoBackup: true,
      backupInterval: 86400000, // 24 horas
      retentionDays: 365,
      compression: true
    }
  },

  // ===============================================================
  // CONFIGURACIÓN DE IA
  // ===============================================================
  ai: {
    // Modelos de predicción
    models: {
      cashFlow: {
        type: "linear_regression",
        accuracy: 0.85,
        horizon: 6, // meses
        updateFrequency: "daily"
      },
      sales: {
        type: "seasonal_arima",
        accuracy: 0.82,
        horizon: 12,
        updateFrequency: "weekly"
      },
      expenses: {
        type: "moving_average",
        accuracy: 0.78,
        horizon: 3,
        updateFrequency: "daily"
      }
    },
    
    // Configuración de alertas
    alerts: {
      enabled: true,
      thresholds: {
        cashFlowCritical: 10000,
        cashFlowWarning: 25000,
        profitMarginCritical: 0.05,
        profitMarginWarning: 0.15,
        growthRateCritical: -0.1,
        growthRateWarning: 0.02
      },
      checkInterval: 300000, // 5 minutos
      maxAlertsPerDay: 20
    },
    
    // Insights automáticos
    insights: {
      enabled: true,
      generateInterval: 600000, // 10 minutos
      minConfidence: 0.7,
      categories: ["trends", "opportunities", "risks", "recommendations"]
    }
  },

  // ===============================================================
  // CONFIGURACIÓN DE GRÁFICOS
  // ===============================================================
  charts: {
    // Configuración global
    global: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      color: "#334155",
      responsive: true,
      maintainAspectRatio: false
    },
    
    // Animaciones
    animations: {
      enabled: true,
      duration: 2000,
      easing: "easeInOutCubic",
      delay: 0
    },
    
    // Colores por tipo de gráfico
    colorSchemes: {
      line: ["#3b82f6", "#dc2626", "#059669", "#f59e0b"],
      bar: ["#6366f1", "#8b5cf6", "#ec4899", "#f97316"],
      pie: ["#059669", "#3b82f6", "#d4af37", "#dc2626", "#f59e0b"],
      area: ["rgba(59, 130, 246, 0.1)", "rgba(220, 38, 38, 0.1)", "rgba(5, 150, 105, 0.1)"]
    },
    
    // Configuración específica por gráfico
    types: {
      cashFlow: {
        type: "line",
        tension: 0.4,
        fill: true,
        pointRadius: 6
      },
      revenue: {
        type: "bar",
        borderRadius: 8,
        borderWidth: 2
      },
      expenses: {
        type: "doughnut",
        cutout: "60%",
        hoverOffset: 15
      }
    }
  },

  // ===============================================================
  // CONFIGURACIÓN DE PERFORMANCE
  // ===============================================================
  performance: {
    // Actualización de datos
    updateIntervals: {
      realTime: 120000,      // 2 minutos
      charts: 300000,        // 5 minutos
      dashboard: 180000,     // 3 minutos
      ai: 600000            // 10 minutos
    },
    
    // Cache
    cache: {
      enabled: true,
      duration: 1800000,     // 30 minutos
      maxSize: 50,           // MB
      strategy: "stale-while-revalidate"
    },
    
    // Lazy loading
    lazyLoad: {
      images: true,
      charts: true,
      modules: true,
