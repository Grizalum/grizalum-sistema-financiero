# 🔧 Referencia de API - GRIZALUM

> Documentación técnica completa de todas las funciones, métodos y APIs del Sistema Financiero GRIZALUM

## 📋 Tabla de Contenidos

1. [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
2. [⚙️ Configuración Global](#️-configuración-global)
3. [📊 API de Dashboard](#-api-de-dashboard)
4. [💰 API de Flujo de Caja](#-api-de-flujo-de-caja)
5. [📈 API de Gráficos](#-api-de-gráficos)
6. [🤖 API de Inteligencia Artificial](#-api-de-inteligencia-artificial)
7. [🔔 API de Notificaciones](#-api-de-notificaciones)
8. [💾 API de Almacenamiento](#-api-de-almacenamiento)
9. [🎨 API de Temas](#-api-de-temas)
10. [🛠️ Utilidades](#️-utilidades)

---

## 🏗️ Arquitectura del Sistema

### **Estructura de Módulos**

```javascript
window.GRIZALUM = {
  config: GRIZALUM_CONFIG,
  charts: {},
  ai: financialAI,
  utils: utilityFunctions,
  storage: storageAPI,
  notifications: notificationSystem
};
```

### **Espacios de Nombres Globales**

| Namespace | Descripción | Archivo |
|-----------|-------------|---------|
| `window.GRIZALUM_CONFIG` | Configuración del sistema | config/app-config.js |
| `window.charts` | Instancias de gráficos | src/assets/js/charts.js |
| `window.financialAI` | Sistema de IA | src/assets/js/ai.js |
| `window.chartFunctions` | Funciones de gráficos | src/assets/js/charts.js |
| `window.aiUtilities` | Utilidades de IA | src/assets/js/ai.js |

---

## ⚙️ Configuración Global

### **GRIZALUM_CONFIG**

Objeto principal de configuración del sistema.

#### **Métodos Principales**

##### `get(path, defaultValue)`
Obtiene un valor de configuración por ruta.

```javascript
// Sintaxis
GRIZALUM_CONFIG.get(path, defaultValue)

// Ejemplos
const primaryColor = GRIZALUM_CONFIG.get('theme.colors.primary');
const companyName = GRIZALUM_CONFIG.get('company.name', 'GRIZALUM');
const updateInterval = GRIZALUM_CONFIG.get('performance.updateIntervals.realTime', 60000);

// Retorna
// string | number | object | defaultValue
```

##### `set(path, value)`
Establece un valor de configuración por ruta.

```javascript
// Sintaxis
GRIZALUM_CONFIG.set(path, value)

// Ejemplos
GRIZALUM_CONFIG.set('company.name', 'Mi Empresa SAC');
GRIZALUM_CONFIG.set('theme.colors.primary', '#ff6b35');
GRIZALUM_CONFIG.set('app.features.darkMode', true);

// Retorna
// void
```

##### `validate()`
Valida que la configuración tenga todos los campos requeridos.

```javascript
// Sintaxis
GRIZALUM_CONFIG.validate()

// Ejemplo
const isValid = GRIZALUM_CONFIG.validate();
if (!isValid) {
  console.error('Configuración incompleta');
}

// Retorna
// boolean
```

##### `getCurrentTheme()`
Obtiene la configuración del tema actual.

```javascript
// Sintaxis
GRIZALUM_CONFIG.getCurrentTheme()

// Ejemplo
const theme = GRIZALUM_CONFIG.getCurrentTheme();
console.log(theme.colors.primary); // "#d4af37"

// Retorna
// {
//   colors: object,
//   gradients: object,
//   shadows: object,
//   fonts: object
// }
```

---

## 📊 API de Dashboard

### **Funciones Principales**

##### `showSection(sectionId)`
Cambia la sección activa del dashboard.

```javascript
// Sintaxis
showSection(sectionId)

// Ejemplos
showSection('dashboard');     // Muestra dashboard principal
showSection('cash-flow');     // Muestra flujo de caja
showSection('reports');       // Muestra reportes

// Parámetros
// sectionId: string - ID de la sección a mostrar

// Retorna
// void
```

##### `updatePageTitle(sectionId)`
Actualiza el título y subtítulo de la página.

```javascript
// Sintaxis
updatePageTitle(sectionId)

// Ejemplo
updatePageTitle('cash-flow');
// Resultado: Título = "Flujo de Caja", Subtítulo = "Gestión de entradas y salidas"

// Parámetros
// sectionId: string - ID de la sección

// Retorna
// void
```

##### `changePeriod(period, button)`
Cambia el período de tiempo para los datos mostrados.

```javascript
// Sintaxis
changePeriod(period, button)

// Ejemplos
changePeriod('mes', buttonElement);
changePeriod('trimestre', buttonElement);

// Parámetros
// period: 'hoy' | 'semana' | 'mes' | 'trimestre' | 'año'
// button: HTMLElement - Elemento del botón clickeado

// Retorna
// void
```

##### `animateKPIValues()`
Anima los valores de las tarjetas KPI.

```javascript
// Sintaxis
animateKPIValues()

// Ejemplo
animateKPIValues(); // Anima todos los valores KPI

// Retorna
// void
```

---

## 💰 API de Flujo de Caja

### **Gestión de Transacciones**

##### `showCashFlowForm()`
Muestra el formulario para agregar nueva transacción.

```javascript
// Sintaxis
showCashFlowForm()

// Ejemplo
showCashFlowForm(); // Muestra formulario con fecha actual

// Retorna
// void
```

##### `hideCashFlowForm()`
Oculta el formulario de transacciones.

```javascript
// Sintaxis
hideCashFlowForm()

// Ejemplo
hideCashFlowForm(); // Oculta formulario

// Retorna
// void
```

##### `addCashFlowTransaction(event)`
Agrega una nueva transacción al flujo de caja.

```javascript
// Sintaxis
addCashFlowTransaction(event)

// Ejemplo (llamado automáticamente desde el formulario)
// <form onsubmit="addCashFlowTransaction(event)">

// Parámetros
// event: Event - Evento del formulario

// Retorna
// void
```

##### `editTransaction(id)`
Edita una transacción existente.

```javascript
// Sintaxis
editTransaction(id)

// Ejemplo
editTransaction(123); // Edita transacción con ID 123

// Parámetros
// id: number - ID de la transacción

// Retorna
// void
```

##### `exportCashFlow()`
Exporta el reporte de flujo de caja.

```javascript
// Sintaxis
exportCashFlow()

// Ejemplo
exportCashFlow(); // Genera y descarga PDF

// Retorna
// void
```

---

## 📈 API de Gráficos

### **chartFunctions** - Namespace

##### `updateChartData(chartInstance, newData, animationDuration)`
Actualiza los datos de un gráfico con animación.

```javascript
// Sintaxis
chartFunctions.updateChartData(chartInstance, newData, animationDuration)

// Ejemplo
const newData = [[1000, 2000, 3000], [800, 1500, 2200]];
chartFunctions.updateChartData(charts.revenue, newData, 1500);

// Parámetros
// chartInstance: Chart - Instancia de Chart.js
// newData: Array<Array<number>> - Nuevos datos por dataset
// animationDuration?: number - Duración de animación (default: 1000ms)

// Retorna
// void
```

##### `simulateRealTimeData()`
Simula actualización de datos en tiempo real.

```javascript
// Sintaxis
chartFunctions.simulateRealTimeData()

// Ejemplo
chartFunctions.simulateRealTimeData(); // Actualiza todos los gráficos

// Retorna
// void
```

##### `exportChartAsImage(chartInstance, filename)`
Exporta un gráfico como imagen PNG.

```javascript
// Sintaxis
chartFunctions.exportChartAsImage(chartInstance, filename)

// Ejemplo
chartFunctions.exportChartAsImage(charts.revenue, 'ingresos-enero-2025.png');

// Parámetros
// chartInstance: Chart - Instancia de Chart.js
// filename?: string - Nombre del archivo (default: 'chart.png')

// Retorna
// void
```

##### `exportAllCharts()`
Exporta todos los gráficos como imágenes.

```javascript
// Sintaxis
chartFunctions.exportAllCharts()

// Ejemplo
chartFunctions.exportAllCharts(); // Descarga todos los gráficos

// Retorna
// void
```

##### `generateChartInsights()`
Genera insights automáticos basados en los datos de gráficos.

```javascript
// Sintaxis
chartFunctions.generateChartInsights()

// Ejemplo
const insights = chartFunctions.generateChartInsights();
console.log(insights);
/*
[
  {
    type: 'positive',
    message: 'Ingresos creciendo 12.3%',
    priority: 'high'
  }
]
*/

// Retorna
// Array<{
//   type: 'positive' | 'warning' | 'info',
//   message: string,
//   priority: 'high' | 'medium' | 'low'
// }>
```

### **Configuración de Gráficos**

##### `initializeCharts()`
Inicializa todos los gráficos del sistema.

```javascript
// Sintaxis
initializeCharts()

// Ejemplo
initializeCharts(); // Crea todos los gráficos

// Retorna
// void
```

##### `initRevenueChart()`
Inicializa el gráfico de ingresos vs gastos.

```javascript
// Sintaxis
initRevenueChart()

// Ejemplo
initRevenueChart(); // Crea gráfico de líneas

// Retorna
// void
```

---

## 🤖 API de Inteligencia Artificial

### **aiUtilities** - Namespace

##### `quickAnalysis(data)`
Realiza un análisis rápido de datos financieros.

```javascript
// Sintaxis
aiUtilities.quickAnalysis(data)

// Ejemplo
const analysis = aiUtilities.quickAnalysis({
  cashFlow: [15000, 18500, 22000],
  revenue: [35000, 38000, 42000],
  expenses: [28000, 29500, 31000]
});

// Parámetros
// data: {
//   cashFlow?: number[],
//   revenue?: number[],
//   expenses?: number[]
// }

// Retorna
// {
//   trends: object,
//   risks: Array,
//   opportunities: Array,
//   predictions: object,
//   score: object
// }
```

##### `getRecommendations(data)`
Obtiene recomendaciones basadas en datos.

```javascript
// Sintaxis
aiUtilities.getRecommendations(data)

// Ejemplo
const recommendations = aiUtilities.getRecommendations({
  cashFlow: [15000, 20000, 18000],
  revenue: [40000, 45000, 42000]
});

// Retorna
// Array<{
//   id: string,
//   type: string,
//   priority: 'high' | 'medium' | 'low',
//   actions: string[],
//   timestamp: Date
// }>
```

##### `generateReport(data)`
Genera un reporte completo con IA.

```javascript
// Sintaxis
aiUtilities.generateReport(data)

// Ejemplo
const report = aiUtilities.generateReport({
  cashFlow: [15000, 18500, 22000],
  revenue: [35000, 38000, 42000],
  expenses: [28000, 29500, 31000]
});

// Retorna
// {
//   metadata: object,
//   summary: object,
//   analysis: object,
//   recommendations: Array,
//   alerts: Array,
//   actionPlan: object
// }
```

##### `getRealTimeInsights()`
Obtiene insights en tiempo real con datos de ejemplo.

```javascript
// Sintaxis
aiUtilities.getRealTimeInsights()

// Ejemplo
const insights = aiUtilities.getRealTimeInsights();

// Retorna
// {
//   trends: object,
//   risks: Array,
//   opportunities: Array,
//   score: number
// }
```

### **Clases de IA**

##### `FinancialPredictor`
Clase para predicciones financieras.

```javascript
// Sintaxis
const predictor = new FinancialPredictor()

// Métodos disponibles
predictor.predictCashFlow(historicalData, periods)
predictor.predictSales(historicalData, periods)
predictor.calculateCorrelation(dataX, dataY)
predictor.calculateVolatility(data)

// Ejemplo
const predictor = new FinancialPredictor();
const prediction = predictor.predictCashFlow([15000, 18000, 22000], 6);
// Retorna: [25000, 28000, 31000, 34000, 37000, 40000]
```

---

## 🔔 API de Notificaciones

### **Funciones de Notificación**

##### `showSuccessMessage(message)`
Muestra una notificación de éxito.

```javascript
// Sintaxis
showSuccessMessage(message)

// Ejemplo
showSuccessMessage('✅ Transacción guardada exitosamente');

// Parámetros
// message: string - Mensaje a mostrar

// Retorna
// void
```

##### `showNotifications()`
Muestra el centro de notificaciones.

```javascript
// Sintaxis
showNotifications()

// Ejemplo
showNotifications(); // Muestra popup con notificaciones

// Retorna
// void
```

---

## 💾 API de Almacenamiento

### **Gestión de Datos Locales**

##### `saveToLocalStorage(key, data)`
Guarda datos en localStorage.

```javascript
// Sintaxis
saveToLocalStorage(key, data)

// Ejemplo
saveToLocalStorage('transactions', transactionArray);
saveToLocalStorage('userSettings', configObject);

// Parámetros
// key: string - Clave de almacenamiento
// data: any - Datos a guardar (se convierte a JSON)

// Retorna
// boolean - true si se guardó exitosamente
```

##### `loadFromLocalStorage(key, defaultValue)`
Carga datos desde localStorage.

```javascript
// Sintaxis
loadFromLocalStorage(key, defaultValue)

// Ejemplo
const transactions = loadFromLocalStorage('transactions', []);
const settings = loadFromLocalStorage('userSettings', {});

// Parámetros
// key: string - Clave de almacenamiento
// defaultValue: any - Valor por defecto si no existe

// Retorna
// any - Datos almacenados o valor por defecto
```

---

## 🎨 API de Temas

### **Gestión de Apariencia**

##### `applyTheme(themeName)`
Aplica un tema específico al sistema.

```javascript
// Sintaxis
applyTheme(themeName)

// Ejemplo
applyTheme('dark');      // Tema oscuro
applyTheme('default');   // Tema por defecto
applyTheme('corporate'); // Tema corporativo

// Parámetros
// themeName: 'default' | 'dark' | 'corporate'

// Retorna
// void
```

##### `updateCSSVariables(variables)`
Actualiza variables CSS dinámicamente.

```javascript
// Sintaxis
updateCSSVariables(variables)

// Ejemplo
updateCSSVariables({
  '--primary-color': '#ff6b35',
  '--secondary-color': '#1a1a1a'
});

// Parámetros
// variables: { [key: string]: string } - Variables CSS a actualizar

// Retorna
// void
```

---

## 🛠️ Utilidades

### **Funciones de Utilidad General**

##### `formatCurrency(amount, currency, locale)`
Formatea un número como moneda.

```javascript
// Sintaxis
formatCurrency(amount, currency, locale)

// Ejemplos
formatCurrency(12500);                    // "S/. 12,500"
formatCurrency(12500, 'USD', 'en-US');    // "$12,500"
formatCurrency(12500.50, 'PEN', 'es-PE'); // "S/. 12,500.50"

// Parámetros
// amount: number - Cantidad a formatear
// currency?: string - Código de moneda (default: 'PEN')
// locale?: string - Configuración regional (default: 'es-PE')

// Retorna
// string - Cantidad formateada
```

##### `formatDate(date, format, locale)`
Formatea una fecha según el formato especificado.

```javascript
// Sintaxis
formatDate(date, format, locale)

// Ejemplos
formatDate(new Date());                           // "17/01/2025"
formatDate(new Date(), 'YYYY-MM-DD');            // "2025-01-17"
formatDate(new Date(), 'DD de MMMM, YYYY');      // "17 de enero, 2025"

// Parámetros
// date: Date | string - Fecha a formatear
// format?: string - Formato deseado (default: 'DD/MM/YYYY')
// locale?: string - Configuración regional (default: 'es-PE')

// Retorna
// string - Fecha formateada
```

##### `calculatePercentage(value, total)`
Calcula el porcentaje de un valor respecto al total.

```javascript
// Sintaxis
calculatePercentage(value, total)

// Ejemplos
calculatePercentage(25, 100);    // 25
calculatePercentage(150, 500);   // 30
calculatePercentage(33.33, 100); // 33.33

// Parámetros
// value: number - Valor parcial
// total: number - Valor total

// Retorna
// number - Porcentaje calculado
```

##### `debounce(func, wait, immediate)`
Crea una función debounced.

```javascript
// Sintaxis
debounce(func, wait, immediate)

// Ejemplo
const debouncedSave = debounce(() => {
  saveTransaction();
}, 500);

// Uso
input.addEventListener('keyup', debouncedSave);

// Parámetros
// func: Function - Función a ejecutar
// wait: number - Tiempo de espera en ms
// immediate?: boolean - Ejecutar inmediatamente (default: false)

// Retorna
// Function - Función debounced
```

##### `throttle(func, limit)`
Crea una función throttled.

```javascript
// Sintaxis
throttle(func, limit)

// Ejemplo
