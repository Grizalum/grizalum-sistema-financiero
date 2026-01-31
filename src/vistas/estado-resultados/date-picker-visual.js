/**
 * ═══════════════════════════════════════════════════════════════════
 * DATE PICKER VISUAL - Para Modal Período Personalizado
 * Calendario visual sin dependencias, compatible con todos los navegadores
 * VERSIÓN CORREGIDA - Sin errores de duplicación
 * ═══════════════════════════════════════════════════════════════════
 */

if (!window.DatePickerVisual) {
    class DatePickerVisual {
        
    constructor(inputId, options = {}) {
        this.inputId = inputId;
        this.input = document.getElementById(inputId);
        this.selectedDate = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.minDate = options.minDate || null;
        this.maxDate = options.maxDate || new Date();
        this.onChange = options.onChange || (() => {});
        
        this._init();
    }
    
    _init() {
        // Inyectar estilos solo una vez
        DatePickerVisual._ensureStyles();
        
        // Hacer el input readonly para prevenir teclado
        this.input.readOnly = true;
        this.input.style.cursor = 'pointer';
        
        // Event listener para abrir calendario
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this._openCalendar();
        });
    }
    
    _openCalendar() {
        // Cerrar otros calendarios abiertos
        document.querySelectorAll('.custom-datepicker').forEach(dp => dp.remove());
        
        // Crear calendario
        const calendar = this._createCalendar();
        document.body.appendChild(calendar);
        
        // Posicionar cerca del input
        this._positionCalendar(calendar);
        
        // Click fuera para cerrar
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!calendar.contains(e.target) && e.target !== this.input) {
                    calendar.remove();
                }
            }, { once: true });
        }, 100);
    }
    
    _createCalendar() {
        const calendar = document.createElement('div');
        calendar.className = 'custom-datepicker';
        calendar.innerHTML = `
            <div class="datepicker-header">
                <button class="datepicker-nav" data-action="prev-month">◀</button>
                <div class="datepicker-title">
                    <select class="datepicker-month"></select>
                    <select class="datepicker-year"></select>
                </div>
                <button class="datepicker-nav" data-action="next-month">▶</button>
            </div>
            <div class="datepicker-weekdays">
                <div>Dom</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sáb</div>
            </div>
            <div class="datepicker-days"></div>
        `;
        
        // Llenar selects
        this._populateSelects(calendar);
        
        // Renderizar días
        this._renderDays(calendar);
        
        // Event listeners
        this._attachCalendarEvents(calendar);
        
        return calendar;
    }
    
    _populateSelects(calendar) {
        const monthSelect = calendar.querySelector('.datepicker-month');
        const yearSelect = calendar.querySelector('.datepicker-year');
        
        // Meses
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        meses.forEach((mes, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = mes;
            option.selected = i === this.currentMonth;
            monthSelect.appendChild(option);
        });
        
        // Años (últimos 10 años)
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= currentYear - 10; y--) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            option.selected = y === this.currentYear;
            yearSelect.appendChild(option);
        }
    }
    
    _renderDays(calendar) {
        const daysContainer = calendar.querySelector('.datepicker-days');
        daysContainer.innerHTML = '';
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        // Espacios vacíos al inicio
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'datepicker-day empty';
            daysContainer.appendChild(empty);
        }
        
        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'datepicker-day';
            dayEl.textContent = day;
            dayEl.dataset.day = day;
            
            const date = new Date(this.currentYear, this.currentMonth, day);
            
            // Deshabilitar si está fuera del rango
            if ((this.minDate && date < this.minDate) || 
                (this.maxDate && date > this.maxDate)) {
                dayEl.classList.add('disabled');
            }
            
            // Marcar si es hoy
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            
            // Marcar si está seleccionado
            if (this.selectedDate && date.toDateString() === this.selectedDate.toDateString()) {
                dayEl.classList.add('selected');
            }
            
            // Click en día
            dayEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!dayEl.classList.contains('disabled')) {
                    this._selectDate(date, calendar);
                }
            });
            
            daysContainer.appendChild(dayEl);
        }
    }
    
    _attachCalendarEvents(calendar) {
        // Navegación
        calendar.querySelector('[data-action="prev-month"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this._renderDays(calendar);
            this._updateSelects(calendar);
        });
        
        calendar.querySelector('[data-action="next-month"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this._renderDays(calendar);
            this._updateSelects(calendar);
        });
        
        // Cambios en selects
        calendar.querySelector('.datepicker-month').addEventListener('change', (e) => {
            this.currentMonth = parseInt(e.target.value);
            this._renderDays(calendar);
        });
        
        calendar.querySelector('.datepicker-year').addEventListener('change', (e) => {
            this.currentYear = parseInt(e.target.value);
            this._renderDays(calendar);
        });
    }
    
    _updateSelects(calendar) {
        calendar.querySelector('.datepicker-month').value = this.currentMonth;
        calendar.querySelector('.datepicker-year').value = this.currentYear;
    }
    
    _selectDate(date, calendar) {
        this.selectedDate = date;
        
        // Formatear fecha para input (YYYY-MM-DD)
        const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        this.input.value = formatted;
        
        // Disparar evento change
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        this.onChange(formatted);
        
        // Cerrar calendario
        calendar.remove();
    }
    
    _positionCalendar(calendar) {
        const rect = this.input.getBoundingClientRect();
        calendar.style.position = 'fixed';
        calendar.style.top = `${rect.bottom + 5}px`;
        calendar.style.left = `${rect.left}px`;
        calendar.style.zIndex = '9999999';
    }
    
    getValue() {
        return this.input.value;
    }
    
    setValue(dateString) {
        this.input.value = dateString;
        this.selectedDate = new Date(dateString);
    }
    
    // ✅ MÉTODO ESTÁTICO para inyectar estilos UNA SOLA VEZ
    static _ensureStyles() {
        // Solo inyectar si no existe
        if (document.getElementById('datePickerStyles')) {
            return;
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'datePickerStyles';
        styleElement.textContent = `
.custom-datepicker {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 16px;
    width: 320px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    user-select: none;
}

.datepicker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.datepicker-nav {
    background: #f3f4f6;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.datepicker-nav:hover {
    background: #667eea;
    color: white;
}

.datepicker-title {
    display: flex;
    gap: 8px;
}

.datepicker-month,
.datepicker-year {
    padding: 6px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background: white;
}

.datepicker-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
}

.datepicker-weekdays div {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    padding: 8px 0;
}

.datepicker-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}

.datepicker-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
}

.datepicker-day:not(.empty):not(.disabled):hover {
    background: #f3f4f6;
}

.datepicker-day.today {
    border: 2px solid #667eea;
    font-weight: 700;
}

.datepicker-day.selected {
    background: #667eea;
    color: white;
    font-weight: 700;
}

.datepicker-day.disabled {
    color: #d1d5db;
    cursor: not-allowed;
}

.datepicker-day.empty {
    cursor: default;
}
        `;
        
        document.head.appendChild(styleElement);
    }
}

}; // ← Cierra la clase
    
    // ✅ EXPONER GLOBALMENTE
    window.DatePickerVisual = DatePickerVisual;
    
    // Inyectar estilos inmediatamente
    DatePickerVisual._ensureStyles();
    
    console.log('✅ DatePickerVisual creado por consola');
} else {
    console.log('ℹ️ DatePickerVisual ya existe');
}
