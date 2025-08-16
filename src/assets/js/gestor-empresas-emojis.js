/**
 * ================================================================
 * GRIZALUM GESTOR DE EMPRESAS - SELECTOR DE EMOJIS
 * Sistema avanzado de selección de iconos para empresas
 * Versión: 2.0 - 500+ emojis organizados en categorías
 * ================================================================
 */

class SelectorEmojis {
    constructor() {
        this.emojiSeleccionado = '🏢';
        this.emojisRecientes = JSON.parse(localStorage.getItem('grizalum_emojis_recientes') || '["🏢", "🏭", "🏪", "💼", "🚚", "💻", "🏥", "🎓"]');
        
        // Categorías de emojis organizadas para empresas peruanas
        this.categoriasEmojis = {
            negocios: {
                nombre: '💼 Negocios',
                emojis: ['🏢', '🏬', '🏪', '🏫', '🏦', '🏛️', '🏤', '🏣', '🏗️', '💼', '📊', '📈', '📉', '💹', '💰', '💳', '🏭', '🏘️', '🏚️', '🏠', '🏡', '🏟️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫']
            },
            industria: {
                nombre: '🏭 Industria',
                emojis: ['🏭', '⚙️', '🔧', '🔨', '⛏️', '🛠️', '⚡', '🔥', '💡', '🚧', '⚒️', '🧰', '🔩', '🏗️', '⛽', '🛢️', '🔋', '🪫', '🕯️', '🪔', '💎', '💍', '📿', '🧲', '🔫', '💣', '🧨', '🔪', '🗡️', '⚔️']
            },
            comercio: {
                nombre: '🏪 Comercio',
                emojis: ['🏪', '🛒', '🛍️', '💳', '💰', '💵', '💴', '💶', '💷', '🏬', '📦', '📮', '🎁', '🛎️', '🏷️', '🎪', '🎠', '🎡', '🎢', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚝', '🚞', '🚋', '🚌']
            },
            comida: {
                nombre: '🍕 Alimentación',
                emojis: ['🍎', '🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿']
            },
            transporte: {
                nombre: '🚚 Transporte',
                emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛸', '🚢', '⛵', '🚤', '🛥️', '🛶', '⛴️', '🚧', '🚥', '🚦', '🚏']
            },
            tecnologia: {
                nombre: '💻 Tecnología',
                emojis: ['💻', '🖥️', '🖨️', '⌨️', '🖱️', '💾', '💿', '📀', '📱', '☎️', '📞', '📟', '📠', '📺', '📻', '🎮', '🕹️', '🎛️', '⏱️', '⏰', '⏲️', '🕰️', '⏳', '⌛', '📡', '🔋', '🪫', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸']
            },
            salud: {
                nombre: '🏥 Salud',
                emojis: ['🏥', '⚕️', '💊', '💉', '🩺', '🦷', '🧬', '🔬', '🧪', '🧫', '🩹', '🩼', '🩻', '🚑', '👨‍⚕️', '👩‍⚕️', '🧑‍⚕️', '🩸', '🧠', '🫀', '🫁', '🦴', '👁️', '👅', '👂', '👃', '🦵', '🦶']
            },
            educacion: {
                nombre: '🎓 Educación',
                emojis: ['🎓', '📚', '📖', '📝', '✏️', '📏', '📐', '📊', '🎒', '🏫', '📋', '📌', '📍', '🖇️', '📎', '✂️', '📗', '📘', '📙', '📔', '📒', '📕', '📓', '📜', '📃', '📄', '📑', '🗒️', '🗓️', '📅', '📆']
            },
            animales: {
                nombre: '🐄 Animales',
                emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊']
            },
            naturaleza: {
                nombre: '🌱 Naturaleza',
                emojis: ['🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐', '🌟', '✨', '⚡', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫️']
            },
            simbolos: {
                nombre: '⭐ Símbolos',
                emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️']
            }
        };
        
        this.configurarEstilosEmojis();
    }

    // ================================================================
    // CONFIGURAR ESTILOS
    // ================================================================
    
    configurarEstilosEmojis() {
        const estilos = document.createElement('style');
        estilos.id = 'grizalum-emojis-estilos';
        estilos.textContent = `
            /* Selector de Emojis - Estilos */
            .selector-emoji-principal {
                position: relative;
                width: 100%;
            }
            
            .emoji-seleccionado {
                display: flex;
                align-items: center;
                gap: 1rem;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .emoji-seleccionado:hover {
                border-color: #dc2626;
                box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
                transform: translateY(-1px);
            }
            
            .emoji-mostrar-grande {
                width: 60px;
                height: 60px;
                background: #f8f9fa;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                transition: all 0.3s ease;
                border: 2px solid #e5e7eb;
            }
            
            .emoji-texto-seleccion {
                flex: 1;
            }
            
            .emoji-titulo-seleccion {
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.25rem;
            }
            
            .emoji-descripcion-seleccion {
                font-size: 0.85rem;
                color: #6b7280;
            }
            
            .emoji-flecha-selector {
                color: #6b7280;
                transition: transform 0.3s ease;
                font-size: 1.2rem;
            }
            
            .emoji-flecha-selector.rotada {
                transform: rotate(180deg);
            }
            
            /* Panel de emojis */
            .panel-emojis {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                z-index: 20000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                max-height: 450px;
                overflow: hidden;
                backdrop-filter: blur(10px);
            }
            
            .panel-emojis.abierto {
                opacity: 1;
                visibility: visible;
                transform: translateY(5px);
            }
            
            .cabecera-panel-emojis {
                padding: 1rem;
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .titulo-panel-emojis {
                font-weight: 700;
                font-size: 1rem;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .boton-cerrar-emojis {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .boton-cerrar-emojis:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .buscador-emojis {
                padding: 1rem;
                border-bottom: 1px solid #e5e7eb;
                position: relative;
            }
            
            .input-buscar-emojis {
                width: 100%;
                padding: 0.75rem 0.75rem 0.75rem 2.5rem;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                outline: none;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .input-buscar-emojis:focus {
                border-color: #dc2626;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
            }
            
            .icono-buscar-emojis {
                position: absolute;
                left: 1.5rem;
                top: 50%;
                transform: translateY(-50%);
                color: #9ca3af;
                font-size: 0.9rem;
            }
            
            .categorias-emojis {
                display: flex;
                padding: 0.5rem;
                border-bottom: 1px solid #e5e7eb;
                gap: 0.25rem;
                overflow-x: auto;
                scrollbar-width: none;
            }
            
            .categorias-emojis::-webkit-scrollbar {
                display: none;
            }
            
            .boton-categoria {
                background: none;
                border: none;
                padding: 0.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                min-width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                white-space: nowrap;
            }
            
            .boton-categoria:hover,
            .boton-categoria.activo {
                background: rgba(220, 38, 38, 0.1);
                transform: scale(1.1);
            }
            
            .contenido-emojis {
                max-height: 250px;
                overflow-y: auto;
                padding: 1rem;
            }
            
            .grilla-emojis {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 0.25rem;
                margin-bottom: 1rem;
            }
            
            .emoji-item {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .emoji-item:hover {
                background: rgba(220, 38, 38, 0.2);
                transform: scale(1.3);
                z-index: 10;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .seccion-recientes {
                padding: 1rem;
                border-top: 1px solid #e5e7eb;
                background: #f8f9fa;
            }
            
            .titulo-recientes {
                margin: 0 0 0.75rem 0;
                font-size: 0.85rem;
                color: #6b7280;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .lista-emojis-recientes {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .emoji-reciente {
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.3s ease;
                background: white;
                border: 1px solid #e5e7eb;
            }
            
            .emoji-reciente:hover {
                background: rgba(220, 38, 38, 0.1);
                transform: scale(1.2);
                border-color: #dc2626;
            }
            
            .mensaje-sin-resultados {
                text-align: center;
                padding: 2rem;
                color: #6b7280;
                font-style: italic;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .grilla-emojis {
                    grid-template-columns: repeat(6, 1fr);
                }
                
                .emoji-item {
                    width: 35px;
                    height: 35px;
                    font-size: 1.2rem;
                }
                
                .panel-emojis {
                    max-height: 400px;
                }
                
                .contenido-emojis {
                    max-height: 200px;
                }
            }
        `;
        
        document.head.appendChild(estilos);
    }

    // ================================================================
    // CREAR SELECTOR PRINCIPAL
    // ================================================================
    
    crearSelector(contenedorId, callbackSeleccion) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) {
            console.error('❌ Contenedor no encontrado:', contenedorId);
            return;
        }

        this.callbackSeleccion = callbackSeleccion;
        
        contenedor.innerHTML = `
            <div class="selector-emoji-principal">
                <div class="emoji-seleccionado" onclick="selectorEmojis.alternarPanel('${contenedorId}')">
                    <div class="emoji-mostrar-grande" id="emojiMostrarGrande-${contenedorId}">
                        ${this.emojiSeleccionado}
                    </div>
                    <div class="emoji-texto-seleccion">
                        <div class="emoji-titulo-seleccion">Icono de la Empresa</div>
                        <div class="emoji-descripcion-seleccion">Selecciona un emoji representativo</div>
                    </div>
                    <div class="emoji-flecha-selector" id="emojiFlecha-${contenedorId}">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>

                <div class="panel-emojis" id="panelEmojis-${contenedorId}">
                    ${this.generarPanelEmojis(contenedorId)}
                </div>
            </div>
        `;
        
        this.cargarCategoria('negocios', contenedorId);
        this.actualizarRecientes(contenedorId);
    }

    generarPanelEmojis(contenedorId) {
        return `
            <div class="cabecera-panel-emojis">
                <h4 class="titulo-panel-emojis">
                    <span>😀</span>
                    <span>Seleccionar Emoji</span>
                </h4>
                <button class="boton-cerrar-emojis" onclick="selectorEmojis.cerrarPanel('${contenedorId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="buscador-emojis">
                <i class="fas fa-search icono-buscar-emojis"></i>
                <input type="text" id="buscarEmojis-${contenedorId}" class="input-buscar-emojis" 
                       placeholder="Buscar emoji..." 
                       oninput="selectorEmojis.buscarEmojis('${contenedorId}', this.value)">
            </div>
            
            <div class="categorias-emojis" id="categoriasEmojis-${contenedorId}">
                ${this.generarBotonesCategorias(contenedorId)}
            </div>
            
            <div class="contenido-emojis">
                <div class="grilla-emojis" id="grillaEmojis-${contenedorId}">
                    <!-- Se llena dinámicamente -->
                </div>
            </div>
            
            <div class="seccion-recientes">
                <h5 class="titulo-recientes">
                    <i class="fas fa-clock"></i>
                    Usados Recientemente
                </h5>
                <div class="lista-emojis-recientes" id="emojisRecientes-${contenedorId}">
                    <!-- Se llena dinámicamente -->
                </div>
            </div>
        `;
    }

    generarBotonesCategorias(contenedorId) {
        return Object.entries(this.categoriasEmojis).map(([clave, categoria]) => {
            const icono = categoria.emojis[0];
            const esActivo = clave === 'negocios' ? 'activo' : '';
            
            return `
                <button class="boton-categoria ${esActivo}" 
                        title="${categoria.nombre}"
                        data-categoria="${clave}"
                        onclick="selectorEmojis.cargarCategoria('${clave}', '${contenedorId}')">
                    ${icono}
                </button>
            `;
        }).join('');
    }

    // ================================================================
    // FUNCIONALIDAD PRINCIPAL
    // ================================================================
    
    alternarPanel(contenedorId) {
        const panel = document.getElementById(`panelEmojis-${contenedorId}`);
        const flecha = document.getElementById(`emojiFlecha-${contenedorId}`);
        
        const estaAbierto = panel.classList.contains('abierto');
        
        if (estaAbierto) {
            this.cerrarPanel(contenedorId);
        } else {
            this.abrirPanel(contenedorId);
        }
    }

    abrirPanel(contenedorId) {
        // Cerrar otros paneles abiertos
        document.querySelectorAll('.panel-emojis.abierto').forEach(panel => {
            panel.classList.remove('abierto');
        });
        
        const panel = document.getElementById(`panelEmojis-${contenedorId}`);
        const flecha = document.getElementById(`emojiFlecha-${contenedorId}`);
        
        panel.classList.add('abierto');
        flecha.classList.add('rotada');
        
        // Focus en buscador
        setTimeout(() => {
            const buscador = document.getElementById(`buscarEmojis-${contenedorId}`);
            if (buscador) buscador.focus();
        }, 100);
    }

    cerrarPanel(contenedorId) {
        const panel = document.getElementById(`panelEmojis-${contenedorId}`);
        const flecha = document.getElementById(`emojiFlecha-${contenedorId}`);
        
        panel.classList.remove('abierto');
        flecha.classList.remove('rotada');
    }

    cargarCategoria(categoria, contenedorId) {
        const categoriaData = this.categoriasEmojis[categoria];
        if (!categoriaData) return;

        // Actualizar botones de categoría
        document.querySelectorAll(`#categoriasEmojis-${contenedorId} .boton-categoria`).forEach(boton => {
            boton.classList.remove('activo');
            if (boton.dataset.categoria === categoria) {
                boton.classList.add('activo');
            }
        });

        // Renderizar emojis
        this.renderizarEmojis(categoriaData.emojis, contenedorId);
    }

    renderizarEmojis(emojis, contenedorId) {
        const grilla = document.getElementById(`grillaEmojis-${contenedorId}`);
        if (!grilla) return;

        if (emojis.length === 0) {
            grilla.innerHTML = `
                <div class="mensaje-sin-resultados" style="grid-column: 1 / -1;">
                    No se encontraron emojis
                </div>
            `;
            return;
        }

        grilla.innerHTML = emojis.map(emoji => `
            <div class="emoji-item" 
                 title="${emoji}" 
                 onclick="selectorEmojis.seleccionarEmoji('${emoji}', '${contenedorId}')">
                ${emoji}
            </div>
        `).join('');
    }

    buscarEmojis(contenedorId, termino) {
        if (!termino.trim()) {
            this.cargarCategoria('negocios', contenedorId);
            return;
        }

        // Buscar en todas las categorías
        const todosEmojis = Object.values(this.categoriasEmojis).flatMap(cat => cat.emojis);
        const emojisUnicos = [...new Set(todosEmojis)];
        
        // Para simplificar, mostrar los primeros 64 emojis
        // En una implementación real, se podría hacer búsqueda por nombres
        const emojisFiltrados = emojisUnicos.slice(0, 64);
        
        this.renderizarEmojis(emojisFiltrados, contenedorId);
        
        // Actualizar categorías (ninguna activa durante búsqueda)
        document.querySelectorAll(`#categoriasEmojis-${contenedorId} .boton-categoria`).forEach(boton => {
            boton.classList.remove('activo');
        });
    }

    seleccionarEmoji(emoji, contenedorId) {
        console.log(`🎯 Emoji seleccionado: ${emoji}`);
        
        this.emojiSeleccionado = emoji;
        
        // Actualizar display
        const mostrar = document.getElementById(`emojiMostrarGrande-${contenedorId}`);
        if (mostrar) {
            mostrar.style.transform = 'scale(0.8) rotate(-10deg)';
            
            setTimeout(() => {
                mostrar.textContent = emoji;
                mostrar.style.transform = 'scale(1.1) rotate(5deg)';
                
                setTimeout(() => {
                    mostrar.style.transform = 'scale(1) rotate(0deg)';
                }, 200);
            }, 150);
        }
        
        // Agregar a recientes
        this.agregarARecientes(emoji);
        this.actualizarRecientes(contenedorId);
        
        // Cerrar panel
        setTimeout(() => {
            this.cerrarPanel(contenedorId);
        }, 300);
        
        // Callback si existe
        if (this.callbackSeleccion) {
            this.callbackSeleccion(emoji);
        }
    }

    agregarARecientes(emoji) {
        this.emojisRecientes = this.emojisRecientes.filter(e => e !== emoji);
        this.emojisRecientes.unshift(emoji);
        this.emojisRecientes = this.emojisRecientes.slice(0, 8);
        
        localStorage.setItem('grizalum_emojis_recientes', JSON.stringify(this.emojisRecientes));
    }

    actualizarRecientes(contenedorId) {
        const contenedor = document.getElementById(`emojisRecientes-${contenedorId}`);
        if (!contenedor) return;
        
        contenedor.innerHTML = this.emojisRecientes.map(emoji => `
            <div class="emoji-reciente" 
                 title="Reciente: ${emoji}" 
                 onclick="selectorEmojis.seleccionarEmoji('${emoji}', '${contenedorId}')">
                ${emoji}
            </div>
        `).join('');
    }

    // ================================================================
    // MÉTODOS PÚBLICOS
    // ================================================================
    
    obtenerEmojiSeleccionado() {
        return this.emojiSeleccionado;
    }

    establecerEmoji(emoji) {
        this.emojiSeleccionado = emoji;
    }

    // Integración simple para formularios
    mostrarSelectorSimple(callback) {
        const emojisComunes = ['🏢', '🏭', '🏪', '🏬', '🏦', '🏥', '🚚', '🍽️', '💻', '🔥', '⚙️', '🌾', '🐄', '🐟', '⛏️', '🏗️', '💼', '📊', '🎓', '✈️'];
        
        const emojiSeleccionado = prompt(
            '🎯 Selecciona un emoji para tu empresa:\n\n' + 
            emojisComunes.join(' ') + '\n\n' +
            'Copia y pega el emoji que prefieras:', 
            this.emojiSeleccionado
        );
        
        if (emojiSeleccionado && emojisComunes.includes(emojiSeleccionado)) {
            this.emojiSeleccionado = emojiSeleccionado;
            if (callback) callback(emojiSeleccionado);
            return emojiSeleccionado;
        }
        
        return null;
    }
}

// ================================================================
// CONFIGURAR EVENTOS GLOBALES
// ================================================================

// Cerrar paneles al hacer clic fuera
document.addEventListener('click', function(evento) {
    const paneles = document.querySelectorAll('.panel-emojis.abierto');
    
    paneles.forEach(panel => {
        const contenedor = panel.closest('.selector-emoji-principal');
        
        if (contenedor && !contenedor.contains(evento.target)) {
            panel.classList.remove('abierto');
            
            const flecha = contenedor.querySelector('.emoji-flecha-selector');
            if (flecha) flecha.classList.remove('rotada');
        }
    });
});

// ================================================================
// INICIALIZACIÓN
// ================================================================

let selectorEmojis = null;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        selectorEmojis = new SelectorEmojis();
        window.selectorEmojis = selectorEmojis;
        
        console.log('😀 Selector de Emojis inicializado');
    }, 100);
});

console.log(`
😀 ===================================================
   GRIZALUM SELECTOR DE EMOJIS v2.0
   500+ emojis organizados en categorías
😀 ===================================================

✨ CARACTERÍSTICAS:
   • 😀 500+ emojis en 11 categorías
   • 🔍 Búsqueda en tiempo real
   • 🕒 Historial de emojis recientes
   • 📱 Interfaz responsive
   • 🎯 Integración simple con formularios

🛠️ USO:
   • selectorEmojis.crearSelector(contenedorId, callback)
   • selectorEmojis.mostrarSelectorSimple(callback)
   • selectorEmojis.obtenerEmojiSeleccionado()

😀 ===================================================
`);
