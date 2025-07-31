/**
 * ================================================================
 * GRIZALUM COMPANY MANAGER - SISTEMA COMPLETO Y PROFESIONAL
 * Gestión integral de empresas con todas las funcionalidades
 * ================================================================
 */

class GrizalumCompanyManager {
    constructor() {
        this.companies = this.loadCompaniesData();
        this.selectedCompany = null;
        this.isInitialized = false;
        this.companyThemes = {};
        this.emojiCategories = this.initializeEmojiCategories();
        this.selectedEmojiValue = '🏢';
        this.recentEmojis = JSON.parse(localStorage.getItem('grizalum_recent_emojis') || '["🏢", "🏭", "🏪", "💼", "🚚", "💻", "🏥", "🎓"]');
        this.auditLog = JSON.parse(localStorage.getItem('grizalum_audit_log') || '[]');
        
        this.init();
    }

    // ================================================================
    // INICIALIZACIÓN DEL SISTEMA
    // ================================================================
    
    init() {
        try {
            this.createCompanySelectorStyles();
            this.renderCompanySelector();
            this.setupEventListeners();
            this.selectFirstCompany();
            this.isInitialized = true;
            this.createEmojiPickerModals();
            
            console.log('🏢 GRIZALUM Company Manager inicializado');
            console.log(`📊 ${Object.keys(this.companies).length} empresas cargadas`);
            
            // Registrar en audit log
            this.logAuditAction('SYSTEM_INIT', 'Sistema inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando Company Manager:', error);
            this.logAuditAction('SYSTEM_ERROR', `Error de inicialización: ${error.message}`);
        }
    }

    // ================================================================
    // CATEGORÍAS DE EMOJIS COMPLETAS
    // ================================================================
    
    initializeEmojiCategories() {
        return {
            business: ['🏢', '🏬', '🏪', '🏫', '🏦', '🏛️', '🏤', '🏣', '🏗️', '💼', '📊', '📈', '📉', '💹', '💰', '💳', '🏭', '🏘️', '🏚️', '🏠', '🏡', '🏟️', '🏞️', '🏜️', '🏝️', '🏖️', '🏕️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻'],
            industry: ['🏭', '⚙️', '🔧', '🔨', '⛏️', '🛠️', '⚡', '🔥', '💡', '🚧', '⚒️', '🧰', '🔩', '🏗️', '⛽', '🛢️', '🔋', '🪫', '🕯️', '🪔', '💎', '💍', '📿', '💄', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '📢', '📣', '📯', '🔔', '🔕', '💱', '💲', '💸', '💴', '💵', '💶', '💷', '🪙', '🧾', '⚖️', '🔗', '⛓️', '🧲', '🔫', '💣', '🧨', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚱️'],
            commerce: ['🏪', '🛒', '🛍️', '💳', '💰', '💵', '💴', '💶', '💷', '🏬', '📦', '📮', '🎁', '🛎️', '🏷️', '🎪', '🎠', '🎡', '🎢', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛴', '🚲', '🛹', '🛼', '🚁', '🛸', '✈️', '🛩️', '🪂', '💺', '🚀', '🛰️', '🚢', '⛵', '🚤', '🛥️', '🛶', '⛴️', '🚧'],
            food: ['🍎', '🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡'],
            transport: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛸', '🚢', '⛵', '🚤', '🛥️', '🛶', '⛴️', '🚧', '🚥', '🚦', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋'],
            tech: ['💻', '🖥️', '🖨️', '⌨️', '🖱️', '💾', '💿', '📀', '📱', '☎️', '📞', '📟', '📠', '📺', '📻', '🎮', '🕹️', '🎛️', '⏱️', '⏰', '⏲️', '🕰️', '⏳', '⌛', '📡', '🔋', '🪫', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💴', '💵', '💶', '💷', '🪙', '💰', '💳', '🧾', '💎', '⚖️', '🦯', '🔗', '⛓️', '🧲', '🔫', '💣', '🧨', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧴', '🧽', '🧯'],
            medical: ['🏥', '⚕️', '💊', '💉', '🩺', '🦷', '🧬', '🔬', '🧪', '🧫', '🩹', '🩼', '🩻', '🚑', '👨‍⚕️', '👩‍⚕️', '🧑‍⚕️', '🩸', '🧠', '🫀', '🫁', '🦴', '👁️', '👅', '👂', '👃', '🦵', '🦶', '🤏', '👌', '🤌', '✋', '🖐️', '🖖', '👋', '🤙', '💪', '🦾', '🖕', '✍️', '🙏', '🦿', '👣', '👥', '👤', '🗣️', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '💀', '☠️', '👻', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
            education: ['🎓', '📚', '📖', '📝', '✏️', '📏', '📐', '📊', '🎒', '🏫', '📋', '📌', '📍', '🖇️', '📎', '✂️', '📖', '📗', '📘', '📙', '📔', '📒', '📕', '📓', '📜', '📃', '📄', '📑', '🗒️', '🗓️', '📅', '📆', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📂', '📁', '💼', '📊', '📈', '📉', '📋', '📌', '📍', '📎', '🖇️', '📐', '📏', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🏹', '🛡️', '🔧', '🔩'],
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛'],
            nature: ['🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐', '🌟', '✨', '⚡', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫️', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝'],
            faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
            people: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '👩', '👩‍🦰', '🧑‍🦰', '👩‍🦱', '🧑‍🦱', '👩‍🦳', '🧑‍🦳', '👩‍🦲', '🧑‍🦲', '👱‍♀️', '👱‍♂️', '🧓', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🧏', '🧏‍♂️', '🧏‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️'],
            hands: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸'],
            objects: ['📱', '📲', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞️', '📹', '📷', '📸', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🪫', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🪚', '🔩', '⚙️', '🪤', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪣', '🧴', '🧽', '🧯', '🛒', '🚁', '🛸', '🚀', '🛰️', '💺', '🪂', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '🪝', '⛽', '🚧', '🚨', '🚥', '🚦', '🛑', '🚏'],
            symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
        };
    }

    // ================================================================
    // ESTILOS CSS COMPLETOS
    // ================================================================

    createCompanySelectorStyles() {
        const styleId = 'grizalum-company-manager-styles';
        let existingStyle = document.getElementById(styleId);
        
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* =============================================== */
            /* GRIZALUM COMPANY MANAGER - ESTILOS COMPLETOS */
            /* =============================================== */
            
            .grizalum-company-selector {
                position: relative;
                min-width: 280px;
                z-index: 1000;
            }

            .grizalum-selected-company {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(184, 115, 51, 0.1) 100%);
                border: 2px solid rgba(212, 175, 55, 0.3);
                border-radius: 16px;
                padding: 1rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                position: relative;
                z-index: 1001;
            }

            .grizalum-selected-company:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
                border-color: rgba(212, 175, 55, 0.5);
            }

            .grizalum-company-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .grizalum-company-icon {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
                transition: all 0.3s ease;
            }

            .grizalum-company-details {
                display: flex;
                flex-direction: column;
            }

            .grizalum-company-name {
                font-size: 1rem;
                font-weight: 700;
                color: var(--gray-800, #1f2937);
                margin-bottom: 0.25rem;
            }

            .grizalum-company-status {
                font-size: 0.8rem;
                font-weight: 500;
                color: var(--gray-600, #4b5563);
            }

            .grizalum-dropdown-arrow {
                color: var(--gray-600, #4b5563);
                transition: transform 0.3s ease;
                font-size: 1.2rem;
            }

            .grizalum-dropdown-arrow.rotate {
                transform: rotate(180deg);
            }

            /* =============== DROPDOWN PROFESIONAL =============== */
            .grizalum-company-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                width: 350px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                border: 1px solid rgba(212, 175, 55, 0.2);
                z-index: 10000;
                will-change: transform, opacity;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-15px);
                transition: all 0.15s ease-in-out;
                backdrop-filter: blur(30px);
                overflow: hidden;
            }

            .grizalum-company-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(5px);
            }

            .grizalum-dropdown-header {
                padding: 1.5rem;
                border-bottom: 1px solid rgba(212, 175, 55, 0.1);
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(184, 115, 51, 0.02) 100%);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .grizalum-dropdown-header h4 {
                margin: 0;
                color: var(--gray-800, #1f2937);
                font-size: 1.1rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .grizalum-btn-add-company {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }

            .grizalum-btn-add-company:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
            }

            .grizalum-companies-list {
                max-height: 320px;
                overflow-y: auto;
                padding: 0.5rem;
            }

            .grizalum-company-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 0.25rem;
                position: relative;
            }

            .grizalum-company-item:hover {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(184, 115, 51, 0.04) 100%);
                transform: translateX(8px);
                border-left: 3px solid #d4af37;
            }

            .grizalum-company-item.active {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 115, 51, 0.08) 100%);
                border: 1px solid rgba(212, 175, 55, 0.3);
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
                border-left: 4px solid #d4af37;
            }

            .grizalum-company-item-icon {
                width: 42px;
                height: 42px;
                background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .grizalum-company-item:hover .grizalum-company-item-icon {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
                transform: scale(1.1);
            }

            .grizalum-company-item-info {
                flex: 1;
            }

            .grizalum-company-item-name {
                font-weight: 600;
                color: var(--gray-800, #1f2937);
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
            }

            .grizalum-company-item-stats {
                font-size: 0.8rem;
                color: var(--gray-600, #4b5563);
            }

            .grizalum-company-item-status {
                font-size: 1.2rem;
                opacity: 0.8;
                transition: all 0.3s ease;
            }

            .grizalum-company-item:hover .grizalum-company-item-status {
                opacity: 1;
                transform: scale(1.1);
            }

            .grizalum-dropdown-footer {
                padding: 1.5rem;
                border-top: 1px solid rgba(212, 175, 55, 0.1);
                background: linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(243, 244, 246, 0.6) 100%);
                text-align: center;
            }

            .grizalum-manage-companies-btn {
                background: linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.05) 100%);
                color: var(--gray-700, #374151);
                border: 1px solid rgba(212, 175, 55, 0.2);
                padding: 0.75rem 1.5rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .grizalum-manage-companies-btn:hover {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
            }

            .grizalum-total-companies {
                font-weight: 700;
                color: var(--gray-800, #1f2937);
                font-size: 0.9rem;
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            /* =============== MODAL PROFESIONAL =============== */
            .grizalum-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 50000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .grizalum-modal.show {
                opacity: 1;
                visibility: visible;
            }

            .grizalum-modal-content {
                background: white;
                border-radius: 20px;
                width: 95%;
                max-width: 1400px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                animation: modalSlideIn 0.3s ease;
                position: relative;
            }

            @keyframes modalSlideIn {
                from { opacity: 0; transform: scale(0.9) translateY(-20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }

            .grizalum-modal-header {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                color: white;
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-title {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.5rem;
                font-weight: 800;
            }

            .modal-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg) scale(1.1);
            }

            /* =============== EMOJI PICKER COMPLETO =============== */
            .emoji-selector-container {
                position: relative;
                width: 100%;
            }

            .selected-emoji {
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

            .selected-emoji:hover,
            .selected-emoji:focus {
                border-color: #d4af37;
                box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
            }

            .emoji-display {
                font-size: 2rem;
                transition: all 0.3s ease;
            }

            .emoji-label {
                flex: 1;
                font-weight: 600;
                color: #374151;
            }

            .emoji-picker {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 16px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                z-index: 60000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                max-height: 400px;
                overflow: hidden;
                backdrop-filter: blur(20px);
            }

            .emoji-picker.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(5px);
            }

            .emoji-search {
                padding: 1rem;
                border-bottom: 1px solid #e5e7eb;
                position: relative;
            }

            .emoji-search i {
                position: absolute;
                left: 1.5rem;
                top: 50%;
                transform: translateY(-50%);
                color: #9ca3af;
            }

            .emoji-search input {
                width: 100%;
                padding: 0.75rem 0.75rem 0.75rem 2.5rem;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                outline: none;
                transition: all 0.3s ease;
            }

            .emoji-search input:focus {
                border-color: #d4af37;
                box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
            }

            .emoji-categories {
                display: flex;
                padding: 0.5rem;
                border-bottom: 1px solid #e5e7eb;
                gap: 0.25rem;
                overflow-x: auto;
            }

            .emoji-cat {
                background: none;
                border: none;
                padding: 0.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
                min-width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .emoji-cat:hover,
            .emoji-cat.active {
                background: rgba(212, 175, 55, 0.1);
                transform: scale(1.1);
            }

            .emoji-grid {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 0.25rem;
                padding: 1rem;
                max-height: 200px;
                overflow-y: auto;
            }

            .emoji-item {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s ease;
            }

            .emoji-item:hover {
                background: rgba(212, 175, 55, 0.2);
                transform: scale(1.2);
            }

            .emoji-recents {
                padding: 1rem;
                border-top: 1px solid #e5e7eb;
            }

            .emoji-recents h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.875rem;
                color: #6b7280;
                font-weight: 600;
            }

            .emoji-recent-list {
                display: flex;
                gap: 0.25rem;
                flex-wrap: wrap;
            }

            /* =============== FORMULARIOS PROFESIONALES =============== */
            .company-form {
                padding: 2rem;
            }

            .form-step {
                display: none;
            }

            .form-step.active {
                display: block;
                animation: fadeInUp 0.5s ease;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .form-field {
                margin-bottom: 1.5rem;
            }

            .form-field label {
                display: block;
                font-weight: 700;
                color: #374151;
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .grizalum-input {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1rem;
                transition: all 0.3s ease;
                outline: none;
            }

            .grizalum-input:focus {
                border-color: #d4af37;
                box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
                transform: translateY(-1px);
            }

            .grizalum-select {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1rem;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
                outline: none;
                appearance: none;
            }

            .grizalum-select:focus {
                border-color: #d4af37;
                box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
            }

            .status-selector {
                display: flex;
                gap: 1rem;
            }

            .status-option {
                flex: 1;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 600;
            }

            .status-option:hover,
            .status-option.active {
                border-color: #d4af37;
                background: rgba(212, 175, 55, 0.1);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
            }

            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            .status-indicator.green {
                background: #10b981;
            }

            .status-indicator.yellow {
                background: #f59e0b;
            }

            .grizalum-modal-footer {
                padding: 2rem;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f9fafb;
            }

            .btn-cancel,
            .btn-create {
                padding: 0.875rem 1.75rem;
                border-radius: 12px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                font-size: 0.875rem;
            }

            .btn-cancel {
                background: white;
                color: #6b7280;
                border: 2px solid #e5e7eb;
            }

            .btn-cancel:hover {
                border-color: #d1d5db;
                color: #374151;
                transform: translateY(-2px);
            }

            .btn-create {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                color: white;
                border: none;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            }

            .btn-create:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
            }

            /* =============== SISTEMA DE NOTIFICACIONES =============== */
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 70000;
                max-width: 400px;
            }

            .grizalum-notification {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                border-left: 4px solid #d4af37;
                margin-bottom: 1rem;
                overflow: hidden;
                animation: slideInRight 0.3s ease;
                position: relative;
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .grizalum-notification.success {
                border-left-color: #10b981;
            }

            .grizalum-notification.error {
                border-left-color: #ef4444;
            }

            .grizalum-notification.warning {
                border-left-color: #f59e0b;
            }

            .grizalum-notification.info {
                border-left-color: #3b82f6;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 1.5rem;
            }

            .notification-content i {
                font-size: 1.25rem;
            }

            .notification-content span {
                flex: 1;
                font-weight: 600;
                color: #374151;
            }

            .notification-close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .notification-close:hover {
                color: #6b7280;
                background: #f3f4f6;
            }

            /* =============== RESPONSIVE =============== */
            @media (max-width: 768px) {
                .grizalum-company-selector {
                    min-width: 250px;
                }
                
                .grizalum-company-dropdown {
                    width: 300px;
                    right: -25px;
                }

                .emoji-grid {
                    grid-template-columns: repeat(6, 1fr);
                }

                .status-selector {
                    flex-direction: column;
                }

                .notification-container {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }

            /* =============== SCROLLBAR PREMIUM =============== */
            .grizalum-companies-list::-webkit-scrollbar,
            .emoji-grid::-webkit-scrollbar {
                width: 6px;
            }

            .grizalum-companies-list::-webkit-scrollbar-track,
            .emoji-grid::-webkit-scrollbar-track {
                background: rgba(212, 175, 55, 0.1);
                border-radius: 10px;
            }

            .grizalum-companies-list::-webkit-scrollbar-thumb,
            .emoji-grid::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                border-radius: 10px;
            }

            .grizalum-companies-list::-webkit-scrollbar-thumb:hover,
            .emoji-grid::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #b87333 0%, #a0691f 100%);
            }

            /* =============== ANIMACIONES AVANZADAS =============== */
            @keyframes companyItemSlide {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .grizalum-company-item {
                animation: companyItemSlide 0.3s ease forwards;
            }

            .grizalum-company-item:nth-child(1) { animation-delay: 0.1s; }
            .grizalum-company-item:nth-child(2) { animation-delay: 0.2s; }
            .grizalum-company-item:nth-child(3) { animation-delay: 0.3s; }
            .grizalum-company-item:nth-child(4) { animation-delay: 0.4s; }
            .grizalum-company-item:nth-child(5) { animation-delay: 0.5s; }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 Estilos del Company Manager creados');
    }

    // ================================================================
    // GESTIÓN DE DATOS DE EMPRESAS
    // ================================================================

    loadCompaniesData() {
        const saved = localStorage.getItem('grizalum_companies');
        if (saved) {
            return JSON.parse(saved);
        }
        
        const defaultCompanies = {
            'fundicion-laguna': {
                name: 'Fundición Laguna',
                icon: '🔥',
                status: 'Operativo',
                theme: { primary: '#dc2626', secondary: '#ea580c' },
                data: { cashFlow: 24500, revenue: 2847293, expenses: 1892847, profit: 954446 },
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            'fundicion-joel': {
                name: 'Fundición Joel',
                icon: '🔥',
                status: 'Operativo',
                theme: { primary: '#ea580c', secondary: '#f97316' },
                data: { cashFlow: 18300, revenue: 2100000, expenses: 1400000, profit: 700000 },
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            'avicola-san-juan': {
                name: 'Avícola San Juan',
                icon: '🐔',
                status: 'Operativo',
                theme: { primary: '#059669', secondary: '#10b981' },
                data: { cashFlow: 32100, revenue: 3200000, expenses: 2100000, profit: 1100000 },
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            'import-lm': {
                name: 'Import LM',
                icon: '📦',
                status: 'Operativo',
                theme: { primary: '#8b5cf6', secondary: '#a78bfa' },
                data: { cashFlow: 45200, revenue: 4500000, expenses: 2800000, profit: 1700000 },
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            'bodega-central': {
                name: 'Bodega Central',
                icon: '🏪',
                status: 'Regular',
                theme: { primary: '#3b82f6', secondary: '#60a5fa' },
                data: { cashFlow: 15800, revenue: 1800000, expenses: 1200000, profit: 600000 },
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            }
        };
        
        this.saveCompaniesData(defaultCompanies);
        return defaultCompanies;
    }

    saveCompaniesData(companies) {
        localStorage.setItem('grizalum_companies', JSON.stringify(companies));
        this.logAuditAction('DATA_SAVE', 'Datos de empresas guardados');
    }

    // ================================================================
    // RENDERIZADO DEL SELECTOR
    // ================================================================

    renderCompanySelector() {
        const container = document.getElementById('companySelector');
        if (!container) {
            console.error('❌ Contenedor #companySelector no encontrado');
            return;
        }

        container.innerHTML = `
            <div class="grizalum-selected-company" onclick="grizalumCompanyManager.toggleDropdown()">
                <div class="grizalum-company-info">
                    <div class="grizalum-company-icon" id="grizalumCurrentCompanyIcon">🔥</div>
                    <div class="grizalum-company-details">
                        <div class="grizalum-company-name" id="grizalumCurrentCompanyName">Fundición Laguna</div>
                        <div class="grizalum-company-status" id="grizalumCurrentCompanyStatus">🟢 Operativo</div>
                    </div>
                </div>
                <div class="grizalum-dropdown-arrow" id="grizalumDropdownArrow">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>

            <div class="grizalum-company-dropdown" id="grizalumCompanyDropdown">
                <div class="grizalum-dropdown-header">
                    <h4>🏢 Empresas GRIZALUM</h4>
                    <button class="grizalum-btn-add-company" onclick="grizalumCompanyManager.showAddCompanyWizard()">
                        <i class="fas fa-plus"></i>
                        Agregar Nueva
                    </button>
                </div>
                
                <div class="grizalum-companies-list" id="grizalumCompaniesList">
                    <!-- Se llena dinámicamente -->
                </div>
                
                <div class="grizalum-dropdown-footer">
                    <button class="grizalum-manage-companies-btn" onclick="grizalumCompanyManager.openCompanyManagement()">
                        <i class="fas fa-cog"></i>
                        Gestionar Empresas
                    </button>
                    <div class="grizalum-total-companies">
                        📊 Total Holding: S/. ${this.calculateTotalHolding().toLocaleString()}
                    </div>
                </div>
            </div>
        `;

        this.renderCompaniesList();
    }

    renderCompaniesList() {
        const companiesList = document.getElementById('grizalumCompaniesList');
        if (!companiesList) return;

        companiesList.innerHTML = '';
        
        Object.entries(this.companies).forEach(([id, company]) => {
            const item = document.createElement('div');
            item.className = 'grizalum-company-item';
            item.dataset.company = id;
            item.onclick = () => this.selectCompany(id);
            
            item.innerHTML = `
                <div class="grizalum-company-item-icon" style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif; white-space: nowrap;">${company.icon}</div>
                <div class="grizalum-company-item-info">
                    <div class="grizalum-company-item-name">${company.name}</div>
                    <div class="grizalum-company-item-stats">Flujo: S/. ${company.data.cashFlow.toLocaleString()}</div>
                </div>
                <div class="grizalum-company-item-status">${this.getStatusEmoji(company.status)}</div>
            `;
            
            companiesList.appendChild(item);
        });
    }

    // ================================================================
    // FUNCIONALIDAD PRINCIPAL
    // ================================================================

    toggleDropdown() {
        const dropdown = document.getElementById('grizalumCompanyDropdown');
        const arrow = document.getElementById('grizalumDropdownArrow');
        
        dropdown.classList.toggle('show');
        arrow.classList.toggle('rotate');
    }

    selectCompany(companyId) {
        this.selectedCompany = companyId;
        this.updateSelectedCompany(companyId);
        this.updateCompanyData(companyId);
        this.toggleDropdown();
        
        // Integración con theme manager
        if (window.GRIZALUM && window.GRIZALUM.applyTheme) {
            window.GRIZALUM.applyTheme(companyId);
        }
        
        this.showNotification(`🏢 Cambiado a ${this.companies[companyId].name}`, 'success');
        
        // Disparar evento personalizado
        this.dispatchCompanyChangeEvent(companyId);
        
        // Log de auditoría
        this.logAuditAction('COMPANY_SELECTED', `Empresa seleccionada: ${this.companies[companyId].name}`);
    }

    updateSelectedCompany(companyId) {
        const company = this.companies[companyId];
        if (!company) return;

        document.getElementById('grizalumCurrentCompanyIcon').textContent = company.icon;
        document.getElementById('grizalumCurrentCompanyName').textContent = company.name;
        document.getElementById('grizalumCurrentCompanyStatus').textContent = `${this.getStatusEmoji(company.status)} ${company.status}`;
        
        // Actualizar estados activos
        document.querySelectorAll('.grizalum-company-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-company="${companyId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    updateCompanyData(companyId) {
        const company = this.companies[companyId];
        if (!company) return;

        // Actualizar KPIs si las funciones existen globalmente
        if (window.GRIZALUM) {
            if (window.GRIZALUM.updateKPIs) {
                window.GRIZALUM.updateKPIs(company.data);
            }
            if (window.GRIZALUM.updateSidebar) {
                window.GRIZALUM.updateSidebar(company.data);
            }
        }
        
        console.log(`📊 Datos actualizados para: ${company.name}`);
    }

    selectFirstCompany() {
        const firstCompanyId = Object.keys(this.companies)[0];
        if (firstCompanyId) {
            this.selectCompany(firstCompanyId);
        }
    }

    // ================================================================
    // GESTIÓN DE EMPRESAS NUEVAS
    // ================================================================

    showAddCompanyWizard() {
        this.createAddCompanyModal();
        const modal = document.getElementById('addCompanyModal');
        modal.classList.add('show');
        document.getElementById('newCompanyName').value = '';
        document.getElementById('newCompanyType').value = '';
        document.querySelectorAll('.status-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.status-option[data-status="operativo"]').classList.add('active');
        
        // Resetear emoji picker
        this.selectedEmojiValue = '🏢';
        this.updateSelectedEmojiDisplay();
        
        console.log('🚀 Wizard de nueva empresa abierto');
        this.logAuditAction('WIZARD_OPENED', 'Wizard de nueva empresa abierto');
    }

    createAddCompanyModal() {
        // Eliminar modal existente si existe
        const existingModal = document.getElementById('addCompanyModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'addCompanyModal';
        modal.className = 'grizalum-modal';
        
        modal.innerHTML = `
            <div class="grizalum-modal-content">
                <div class="grizalum-modal-header">
                    <div class="modal-title">
                        <i class="fas fa-plus-circle"></i>
                        <span>Nueva Empresa GRIZALUM</span>
                    </div>
                    <button class="modal-close-btn" onclick="grizalumCompanyManager.closeAddCompanyModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="grizalum-modal-body">
                    <div class="company-form">
                        <div class="form-step active" id="step1">
                            <h3>Información Básica</h3>
                            
                            <div class="form-field">
                                <label>Nombre de la empresa</label>
                                <input type="text" id="newCompanyName" placeholder="Ej: Mi Nueva Empresa S.A.C." class="grizalum-input">
                            </div>
                            
                            <div class="form-field">
                                <label>Icono de la empresa</label>
                                <div class="emoji-selector-container">
                                    <div class="selected-emoji" id="selectedEmoji" onclick="grizalumCompanyManager.toggleEmojiPicker()">
                                        <span class="emoji-display" id="emojiDisplay">🏢</span>
                                        <span class="emoji-label" id="emojiLabel">Seleccionar icono</span>
                                        <i class="fas fa-chevron-down"></i>
                                    </div>
                                    
                                    <div id="emojiPicker" class="emoji-picker">
                                        <div class="emoji-search">
                                            <i class="fas fa-search"></i>
                                            <input type="text" placeholder="Buscar emoji..." id="emojiSearch">
                                        </div>
                                        
                                        <div class="emoji-categories" id="emojiCategories">
                                            <!-- Se llena dinámicamente -->
                                        </div>
                                        
                                        <div class="emoji-grid" id="emojiGrid">
                                            <!-- Se llena dinámicamente -->
                                        </div>
                                        
                                        <div class="emoji-recents">
                                            <h4>🕒 Recientes</h4>
                                            <div class="emoji-recent-list" id="recentEmojis">
                                                <!-- Emojis recientes -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-field">
                                <label>Tipo de negocio</label>
                                <select id="newCompanyType" class="grizalum-select">
                                    <option value="">Selecciona el tipo</option>
                                    <option value="industria">🏭 Industria</option>
                                    <option value="comercio">🏪 Comercio</option>
                                    <option value="servicios">⚙️ Servicios</option>
                                    <option value="agropecuario">🐔 Agropecuario</option>
                                    <option value="tecnologia">💻 Tecnología</option>
                                    <option value="construccion">🏗️ Construcción</option>
                                    <option value="salud">🏥 Salud</option>
                                    <option value="educacion">🎓 Educación</option>
                                    <option value="transporte">🚚 Transporte</option>
                                    <option value="alimentacion">🍕 Alimentación</option>
                                </select>
                            </div>
                            
                            <div class="form-field">
                                <label>Estado inicial</label>
                                <div class="status-selector">
                                    <div class="status-option active" data-status="operativo">
                                        <div class="status-indicator green"></div>
                                        <span>Operativo</span>
                                    </div>
                                    <div class="status-option" data-status="preparacion">
                                        <div class="status-indicator yellow"></div>
                                        <span>En Preparación</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grizalum-modal-footer">
                    <button class="btn-cancel" onclick="grizalumCompanyManager.closeAddCompanyModal()">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                    <button class="btn-create" onclick="grizalumCompanyManager.createNewCompany()">
                        <i class="fas fa-plus"></i>
                        Crear Empresa
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Configurar emoji picker después de crear el modal
        setTimeout(() => {
            this.setupEmojiPicker();
        }, 100);
    }

    createNewCompany() {
        const name = document.getElementById('newCompanyName')?.value?.trim();
        const type = document.getElementById('newCompanyType')?.value;
        const statusElement = document.querySelector('.status-option.active');
        const status = statusElement ? statusElement.dataset.status : 'operativo';
        
        // Validaciones
        if (!name) {
            this.showNotification('❌ El nombre de la empresa es requerido', 'error');
            return;
        }
        
        if (name.length < 3) {
            this.showNotification('❌ El nombre debe tener al menos 3 caracteres', 'error');
            return;
        }
        
        if (!type) {
            this.showNotification('❌ Selecciona un tipo de negocio', 'error');
            return;
        }
        
        // Verificar si ya existe una empresa con el mismo nombre
        const existingCompany = Object.values(this.companies).find(
            company => company.name.toLowerCase() === name.toLowerCase()
        );
        
        if (existingCompany) {
            this.showNotification('❌ Ya existe una empresa con ese nombre', 'error');
            return;
        }
        
        // Generar ID único
        const companyId = this.generateCompanyId(name);
        
        // Crear empresa
        const newCompany = {
            name: name,
            icon: this.selectedEmojiValue,
            status: status === 'operativo' ? 'Operativo' : 'En Preparación',
            theme: this.getThemeForType(type),
            data: { 
                cashFlow: 10000, 
                revenue: 500000, 
                expenses: 300000, 
                profit: 200000 
            },
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        // Agregar a empresas
        this.companies[companyId] = newCompany;
        this.saveCompaniesData(this.companies);
        
        // Cerrar modal
        this.closeAddCompanyModal();
        
        // Actualizar UI
        this.renderCompaniesList();
        
        // Seleccionar nueva empresa
        this.selectCompany(companyId);
        
        // Notificación de éxito
        this.showNotification(`✅ Empresa "${name}" creada exitosamente`, 'success');
        
        // Log de auditoría
        this.logAuditAction('COMPANY_CREATED', `Nueva empresa creada: ${name} (${companyId})`);
        
        console.log(`🏢 Nueva empresa creada: ${name} (${companyId})`);
    }

    generateCompanyId(name) {
        // Generar ID basado en el nombre
        let baseId = name.toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        // Verificar unicidad
        let counter = 1;
        let finalId = baseId;
        
        while (this.companies[finalId]) {
            finalId = `${baseId}-${counter}`;
            counter++;
        }
        
        return finalId;
    }

    closeAddCompanyModal() {
        const modal = document.getElementById('addCompanyModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    // ================================================================
    // EMOJI PICKER COMPLETO
    // ================================================================

    createEmojiPickerModals() {
        // Esta función se asegura de que los modales estén disponibles
        console.log('🎨 Emoji picker modals preparados');
    }

    setupEmojiPicker() {
        this.renderEmojiCategories();
        this.loadEmojiCategory('business');
        this.updateRecentEmojis();
        this.setupEmojiEvents();
    }

    renderEmojiCategories() {
        const container = document.getElementById('emojiCategories');
        if (!container) return;
        
        const categories = [
            { key: 'business', emoji: '💼', title: 'Negocios' },
            { key: 'industry', emoji: '🏭', title: 'Industria' },
            { key: 'commerce', emoji: '🏪', title: 'Comercio' },
            { key: 'food', emoji: '🍕', title: 'Comida' },
            { key: 'transport', emoji: '🚚', title: 'Transporte' },
            { key: 'tech', emoji: '💻', title: 'Tecnología' },
            { key: 'medical', emoji: '🏥', title: 'Salud' },
            { key: 'education', emoji: '🎓', title: 'Educación' },
            { key: 'animals', emoji: '🐶', title: 'Animales' },
            { key: 'nature', emoji: '🌱', title: 'Naturaleza' },
            { key: 'faces', emoji: '😀', title: 'Caritas' },
            { key: 'people', emoji: '👤', title: 'Personas' },
            { key: 'hands', emoji: '👋', title: 'Manos' },
            { key: 'objects', emoji: '📱', title: 'Objetos' },
            { key: 'symbols', emoji: '❤️', title: 'Símbolos' }
        ];
        
        container.innerHTML = categories.map(cat => `
            <button class="emoji-cat ${cat.key === 'business' ? 'active' : ''}" 
                    data-category="${cat.key}" 
                    title="${cat.title}"
                    onclick="grizalumCompanyManager.loadEmojiCategory('${cat.key}')">
                ${cat.emoji}
            </button>
        `).join('');
    }

    loadEmojiCategory(category) {
        console.log('📱 Cargando categoría:', category);
        
        const grid = document.getElementById('emojiGrid');
        if (!grid) return;
        
        const emojis = this.emojiCategories[category] || this.emojiCategories.business;
        
        // Renderizado optimizado
        grid.innerHTML = emojis.map(emoji => `
            <div class="emoji-item" 
                 title="${emoji}" 
                 onclick="grizalumCompanyManager.selectEmoji('${emoji}')">
                ${emoji}
            </div>
        `).join('');
        
        // Actualizar categorías activas
        document.querySelectorAll('.emoji-cat').forEach(cat => {
            cat.classList.remove('active');
            if (cat.dataset.category === category) {
                cat.classList.add('active');
            }
        });
    }

    selectEmoji(emoji) {
        console.log('🎯 Emoji seleccionado:', emoji);
        
        this.selectedEmojiValue = emoji;
        this.updateSelectedEmojiDisplay();
        this.addToRecentEmojis(emoji);
        
        // Cerrar picker
        setTimeout(() => {
            const picker = document.getElementById('emojiPicker');
            if (picker) picker.classList.remove('show');
        }, 300);
        
        this.showNotification(`Icono ${emoji} seleccionado`, 'success');
    }

    updateSelectedEmojiDisplay() {
        const display = document.getElementById('emojiDisplay');
        const label = document.getElementById('emojiLabel');
        
        if (display && label) {
            display.style.transform = 'scale(0.8) rotate(-10deg)';
            
            setTimeout(() => {
                display.textContent = this.selectedEmojiValue;
                label.textContent = 'Icono seleccionado';
                display.style.transform = 'scale(1.1) rotate(5deg)';
                
                setTimeout(() => {
                    display.style.transform = 'scale(1) rotate(0deg)';
                }, 200);
            }, 150);
        }
    }

    addToRecentEmojis(emoji) {
        this.recentEmojis = this.recentEmojis.filter(e => e !== emoji);
        this.recentEmojis.unshift(emoji);
        this.recentEmojis = this.recentEmojis.slice(0, 8);
        
        localStorage.setItem('grizalum_recent_emojis', JSON.stringify(this.recentEmojis));
        this.updateRecentEmojis();
    }

    updateRecentEmojis() {
        const container = document.getElementById('recentEmojis');
        if (!container) return;
        
        container.innerHTML = this.recentEmojis.map(emoji => `
            <div class="emoji-item" 
                 title="Reciente: ${emoji}" 
                 onclick="grizalumCompanyManager.selectEmoji('${emoji}')">
                ${emoji}
            </div>
        `).join('');
    }

    toggleEmojiPicker() {
        const picker = document.getElementById('emojiPicker');
        if (!picker) return;
        
        const isVisible = picker.classList.contains('show');
        
        if (isVisible) {
            picker.classList.remove('show');
        } else {
            picker.classList.add('show');
            this.loadEmojiCategory('business');
            this.updateRecentEmojis();
            
            setTimeout(() => {
                const searchInput = document.getElementById('emojiSearch');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    }

    setupEmojiEvents() {
        // Búsqueda de emojis
        const searchInput = document.getElementById('emojiSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchEmojis(e.target.value.toLowerCase());
                }, 300);
            });
        }
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            const picker = document.getElementById('emojiPicker');
            const container = document.querySelector('.emoji-selector-container');
            
            if (container && !container.contains(e.target) && picker) {
                picker.classList.remove('show');
            }
        });
        
        // Status selector
        document.querySelectorAll('.status-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.status-option').forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    searchEmojis(query) {
        if (!query.trim()) {
            this.loadEmojiCategory('business');
            return;
        }
        
        const grid = document.getElementById('emojiGrid');
        if (!grid) return;
        
        const allEmojis = Object.values(this.emojiCategories).flat();
        const uniqueEmojis = [...new Set(allEmojis)];
        const filtered = uniqueEmojis.slice(0, 64);
        
        grid.innerHTML = filtered.map(emoji => `
            <div class="emoji-item" 
                 title="Búsqueda: ${emoji}" 
                 onclick="grizalumCompanyManager.selectEmoji('${emoji}')">
                ${emoji}
            </div>
        `).join('');
        
        document.querySelectorAll('.emoji-cat').forEach(cat => cat.classList.remove('active'));
    }

    // ================================================================
    // GESTIÓN AVANZADA DE EMPRESAS
    // ================================================================

    openCompanyManagement() {
        console.log('🏢 Abriendo gestión avanzada de empresas');
        this.showNotification('🚧 Gestión avanzada de empresas próximamente', 'info');
        this.logAuditAction('MANAGEMENT_OPENED', 'Panel de gestión avanzada abierto');
    }

    // ================================================================
    // UTILIDADES Y HELPERS
    // ================================================================

    getStatusEmoji(status) {
        const statusMap = {
            'Operativo': '🟢',
            'Regular': '🟡',
            'Crítico': '🔴',
            'En Preparación': '🟡',
            'Mantenimiento': '🔧',
            'Archivado': '📦'
        };
        return statusMap[status] || '🔘';
    }

    getThemeForType(type) {
        const themes = {
            'industria': { primary: '#dc2626', secondary: '#ea580c' },
            'comercio': { primary: '#3b82f6', secondary: '#60a5fa' },
            'servicios': { primary: '#8b5cf6', secondary: '#a78bfa' },
            'agropecuario': { primary: '#059669', secondary: '#10b981' },
            'tecnologia': { primary: '#6366f1', secondary: '#818cf8' },
            'construccion': { primary: '#f59e0b', secondary: '#fbbf24' },
            'salud': { primary: '#ef4444', secondary: '#f87171' },
            'educacion': { primary: '#8b5cf6', secondary: '#a78bfa' },
            'transporte': { primary: '#6b7280', secondary: '#9ca3af' },
            'alimentacion': { primary: '#f59e0b', secondary: '#fbbf24' }
        };
        return themes[type] || { primary: '#d4af37', secondary: '#b87333' };
    }

    calculateTotalHolding() {
        return Object.values(this.companies).reduce((total, company) => {
            return total + (company.data.cashFlow || 0);
        }, 0);
    }

    // ================================================================
    // EVENTOS Y LISTENERS
    // ================================================================

    setupEventListeners() {
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (event) => {
            const selector = document.getElementById('companySelector');
            const dropdown = document.getElementById('grizalumCompanyDropdown');
            
            if (selector && !selector.contains(event.target)) {
                dropdown?.classList.remove('show');
                document.getElementById('grizalumDropdownArrow')?.classList.remove('rotate');
            }
        });
        
        console.log('🎯 Event listeners del Company Manager configurados');
    }

    dispatchCompanyChangeEvent(companyId) {
        const event = new CustomEvent('grizalumCompanyChanged', {
            detail: { 
                companyId, 
                company: this.companies[companyId],
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    // ================================================================
    // SISTEMA DE NOTIFICACIONES
    // ================================================================

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `grizalum-notification ${type}`;
        
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle', 
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icons[type] || icons.info}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        console.log(`${type === 'success' ? '✅' : type === 'error' ? '❌' : '📢'} ${message}`);
    }

    // ================================================================
    // SISTEMA DE AUDITORÍA
    // ================================================================

    logAuditAction(action, description) {
        const logEntry = {
            id: Date.now(),
            action: action,
            description: description,
            timestamp: new Date().toISOString(),
            user: 'Sistema',
            ip: 'Local'
        };
        
        this.auditLog.unshift(logEntry);
        
        // Mantener solo los últimos 1000 registros
        if (this.auditLog.length > 1000) {
            this.auditLog = this.auditLog.slice(0, 1000);
        }
        
        localStorage.setItem('grizalum_audit_log', JSON.stringify(this.auditLog));
    }

    // ================================================================
    // API PÚBLICA
    // ================================================================

    getSelectedCompany() {
        return {
            id: this.selectedCompany,
            data: this.companies[this.selectedCompany]
        };
    }

    getAllCompanies() {
        return this.companies;
    }

    addCompany(id, companyData) {
        companyData.createdAt = new Date().toISOString();
        companyData.lastModified = new Date().toISOString();
        
        this.companies[id] = companyData;
        this.saveCompaniesData(this.companies);
        this.renderCompaniesList();
        
        this.logAuditAction('COMPANY_ADDED_API', `Empresa agregada vía API: ${companyData.name}`);
        console.log(`✅ Empresa agregada vía API: ${companyData.name}`);
    }

    removeCompany(id) {
        if (this.companies[id]) {
            const companyName = this.companies[id].name;
            delete this.companies[id];
            this.saveCompaniesData(this.companies);
            this.renderCompaniesList();
            
            this.logAuditAction('COMPANY_REMOVED_API', `Empresa eliminada vía API: ${companyName}`);
            console.log(`❌ Empresa eliminada vía API: ${companyName}`);
        }
    }

    updateCompany(id, updateData) {
        if (this.companies[id]) {
            updateData.lastModified = new Date().toISOString();
            this.companies[id] = { ...this.companies[id], ...updateData };
            this.saveCompaniesData(this.companies);
            this.renderCompaniesList();
            
            this.logAuditAction('COMPANY_UPDATED_API', `Empresa actualizada vía API: ${this.companies[id].name}`);
            console.log(`📝 Empresa actualizada vía API: ${this.companies[id].name}`);
        }
    }

    exportData() {
        const exportData = {
            companies: this.companies,
            auditLog: this.auditLog,
            exportDate: new Date().toISOString(),
            version: '2.0.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grizalum-empresas-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('📦 Datos exportados exitosamente', 'success');
        this.logAuditAction('DATA_EXPORTED', 'Datos exportados exitosamente');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (importData.companies) {
                    // Validar estructura de datos
                    const isValidData = Object.values(importData.companies).every(company => 
                        company.name && company.icon && company.status && company.data
                    );
                    
                    if (isValidData) {
                        this.companies = { ...this.companies, ...importData.companies };
                        this.saveCompaniesData(this.companies);
                        this.renderCompaniesList();
                        
                        this.showNotification('✅ Datos importados exitosamente', 'success');
                        this.logAuditAction('DATA_IMPORTED', `Datos importados: ${Object.keys(importData.companies).length} empresas`);
                    } else {
                        this.showNotification('❌ Archivo con formato inválido', 'error');
                    }
                } else {
                    this.showNotification('❌ No se encontraron datos de empresas', 'error');
                }
            } catch (error) {
                this.showNotification('❌ Error al leer el archivo', 'error');
                console.error('Error importando datos:', error);
            }
        };
        reader.readAsText(file);
    }

    // ================================================================
    // FUNCIONES DE BACKUP Y RESTAURACIÓN
    // ================================================================

    createBackup() {
        const backupData = {
            companies: this.companies,
            auditLog: this.auditLog,
            settings: {
                selectedCompany: this.selectedCompany,
                recentEmojis: this.recentEmojis
            },
            metadata: {
                version: '2.0.0',
                backupDate: new Date().toISOString(),
                totalCompanies: Object.keys(this.companies).length,
                appName: 'GRIZALUM Company Manager'
            }
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grizalum-backup-completo-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('💾 Backup completo creado exitosamente', 'success');
        this.logAuditAction('BACKUP_CREATED', 'Backup completo del sistema creado');
        
        return backupData;
    }

    restoreBackup(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                
                // Validar que es un backup válido
                if (!backupData.metadata || !backupData.companies) {
                    this.showNotification('❌ Archivo de backup inválido', 'error');
                    return;
                }
                
                // Confirmar restauración
                const confirmRestore = confirm(
                    `🔄 RESTAURAR BACKUP\n\n` +
                    `Fecha: ${new Date(backupData.metadata.backupDate).toLocaleDateString()}\n` +
                    `Empresas: ${backupData.metadata.totalCompanies}\n` +
                    `Versión: ${backupData.metadata.version}\n\n` +
                    `⚠️ Esto reemplazará todos los datos actuales.\n` +
                    `¿Continuar con la restauración?`
                );
                
                if (!confirmRestore) return;
                
                // Restaurar datos
                this.companies = backupData.companies;
                this.auditLog = backupData.auditLog || [];
                this.recentEmojis = backupData.settings?.recentEmojis || this.recentEmojis;
                
                // Guardar datos restaurados
                this.saveCompaniesData(this.companies);
                localStorage.setItem('grizalum_audit_log', JSON.stringify(this.auditLog));
                localStorage.setItem('grizalum_recent_emojis', JSON.stringify(this.recentEmojis));
                
                // Actualizar UI
                this.renderCompaniesList();
                
                // Seleccionar primera empresa
                if (backupData.settings?.selectedCompany && this.companies[backupData.settings.selectedCompany]) {
                    this.selectCompany(backupData.settings.selectedCompany);
                } else {
                    this.selectFirstCompany();
                }
                
                this.showNotification('✅ Backup restaurado exitosamente', 'success');
                this.logAuditAction('BACKUP_RESTORED', `Backup restaurado: ${backupData.metadata.totalCompanies} empresas`);
                
            } catch (error) {
                this.showNotification('❌ Error al restaurar backup', 'error');
                console.error('Error restaurando backup:', error);
            }
        };
        reader.readAsText(file);
    }

    // ================================================================
    // FUNCIONES DE VALIDACIÓN Y SEGURIDAD
    // ================================================================

    validateCompanyData(companyData) {
        const requiredFields = ['name', 'icon', 'status', 'data'];
        const requiredDataFields = ['cashFlow', 'revenue', 'expenses', 'profit'];
        
        // Validar campos requeridos
        for (const field of requiredFields) {
            if (!companyData[field]) {
                return { valid: false, error: `Campo requerido: ${field}` };
            }
        }
        
        // Validar datos financieros
        for (const field of requiredDataFields) {
            if (typeof companyData.data[field] !== 'number' || companyData.data[field] < 0) {
                return { valid: false, error: `Dato financiero inválido: ${field}` };
            }
        }
        
        // Validar nombre
        if (companyData.name.length < 3 || companyData.name.length > 100) {
            return { valid: false, error: 'El nombre debe tener entre 3 y 100 caracteres' };
        }
        
        // Validar status
        const validStatuses = ['Operativo', 'Regular', 'Crítico', 'En Preparación', 'Mantenimiento', 'Archivado'];
        if (!validStatuses.includes(companyData.status)) {
            return { valid: false, error: 'Status inválido' };
        }
        
        return { valid: true };
    }

    sanitizeCompanyData(companyData) {
        return {
            name: companyData.name.trim(),
            icon: companyData.icon,
            status: companyData.status,
            theme: companyData.theme || { primary: '#d4af37', secondary: '#b87333' },
            data: {
                cashFlow: Math.max(0, Number(companyData.data.cashFlow) || 0),
                revenue: Math.max(0, Number(companyData.data.revenue) || 0),
                expenses: Math.max(0, Number(companyData.data.expenses) || 0),
                profit: Math.max(0, Number(companyData.data.profit) || 0)
            },
            createdAt: companyData.createdAt || new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
    }

    // ================================================================
    // FUNCIONES DE ESTADÍSTICAS Y REPORTES
    // ================================================================

    getCompanyStatistics() {
        const companies = Object.values(this.companies);
        const totalCompanies = companies.length;
        
        if (totalCompanies === 0) {
            return {
                totalCompanies: 0,
                totalRevenue: 0,
                totalProfit: 0,
                totalCashFlow: 0,
                averageMargin: 0,
                operativeCompanies: 0,
                statusDistribution: {},
                topPerformers: [],
                riskCompanies: []
            };
        }
        
        const totalRevenue = companies.reduce((sum, c) => sum + c.data.revenue, 0);
        const totalProfit = companies.reduce((sum, c) => sum + c.data.profit, 0);
        const totalCashFlow = companies.reduce((sum, c) => sum + c.data.cashFlow, 0);
        const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
        
        // Distribución por status
        const statusDistribution = companies.reduce((acc, company) => {
            acc[company.status] = (acc[company.status] || 0) + 1;
            return acc;
        }, {});
        
        // Top performers (por margen de utilidad)
        const topPerformers = companies
            .map(c => ({
                name: c.name,
                margin: c.data.revenue > 0 ? (c.data.profit / c.data.revenue) * 100 : 0,
                profit: c.data.profit
            }))
            .sort((a, b) => b.margin - a.margin)
            .slice(0, 5);
        
        // Empresas de riesgo (margen bajo o cashflow negativo)
        const riskCompanies = companies.filter(c => {
            const margin = c.data.revenue > 0 ? (c.data.profit / c.data.revenue) * 100 : 0;
            return margin < 5 || c.data.cashFlow < 0 || c.status === 'Crítico';
        });
        
        return {
            totalCompanies,
            totalRevenue,
            totalProfit,
            totalCashFlow,
            averageMargin: Math.round(averageMargin * 100) / 100,
            operativeCompanies: statusDistribution['Operativo'] || 0,
            statusDistribution,
            topPerformers,
            riskCompanies: riskCompanies.map(c => ({
                name: c.name,
                status: c.status,
                cashFlow: c.data.cashFlow,
                margin: c.data.revenue > 0 ? Math.round((c.data.profit / c.data.revenue) * 100 * 100) / 100 : 0
            }))
        };
    }

    generateCompanyReport(companyId) {
        const company = this.companies[companyId];
        if (!company) return null;
        
        const data = company.data;
        const margin = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
        const expenseRatio = data.revenue > 0 ? (data.expenses / data.revenue) * 100 : 0;
        
        return {
            company: {
                name: company.name,
                icon: company.icon,
                status: company.status,
                createdAt: company.createdAt,
                lastModified: company.lastModified
            },
            financials: {
                revenue: data.revenue,
                expenses: data.expenses,
                profit: data.profit,
                cashFlow: data.cashFlow,
                margin: Math.round(margin * 100) / 100,
                expenseRatio: Math.round(expenseRatio * 100) / 100
            },
            analysis: {
                profitability: margin > 15 ? 'Excelente' : margin > 10 ? 'Buena' : margin > 5 ? 'Regular' : 'Baja',
                liquidity: data.cashFlow > data.expenses * 0.5 ? 'Saludable' : 'Ajustada',
                efficiency: expenseRatio < 70 ? 'Eficiente' : expenseRatio < 85 ? 'Regular' : 'Mejorable',
                riskLevel: this.calculateRiskLevel(company)
            },
            recommendations: this.generateRecommendations(company)
        };
    }

    calculateRiskLevel(company) {
        const data = company.data;
        const margin = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
        let riskScore = 0;
        
        // Factores de riesgo
        if (margin < 5) riskScore += 3;
        else if (margin < 10) riskScore += 1;
        
        if (data.cashFlow < 0) riskScore += 3;
        else if (data.cashFlow < data.expenses * 0.25) riskScore += 2;
        
        if (company.status === 'Crítico') riskScore += 3;
        else if (company.status === 'Regular') riskScore += 1;
        
        if (data.expenses > data.revenue) riskScore += 2;
        
        // Clasificación de riesgo
        if (riskScore >= 7) return 'Alto';
        if (riskScore >= 4) return 'Medio';
        if (riskScore >= 2) return 'Bajo';
        return 'Mínimo';
    }

    generateRecommendations(company) {
        const data = company.data;
        const margin = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
        const expenseRatio = data.revenue > 0 ? (data.expenses / data.revenue) * 100 : 0;
        const recommendations = [];
        
        // Recomendaciones basadas en márgenes
        if (margin < 5) {
            recommendations.push('🔴 Urgente: Revisar estructura de costos y estrategia de precios');
        } else if (margin < 10) {
            recommendations.push('🟡 Optimizar procesos para mejorar rentabilidad');
        } else if (margin > 20) {
            recommendations.push('🟢 Excelente rentabilidad, considerar expansión');
        }
        
        // Recomendaciones de flujo de caja
        if (data.cashFlow < 0) {
            recommendations.push('🔴 Crítico: Problema de liquidez, revisar cobros y pagos');
        } else if (data.cashFlow < data.expenses * 0.25) {
            recommendations.push('🟡 Mejorar gestión de flujo de caja');
        }
        
        // Recomendaciones de gastos
        if (expenseRatio > 85) {
            recommendations.push('🔴 Gastos excesivos, implementar medidas de control');
        } else if (expenseRatio > 75) {
            recommendations.push('🟡 Revisar y optimizar gastos operativos');
        }
        
        // Recomendaciones por status
        if (company.status === 'Crítico') {
            recommendations.push('🚨 Implementar plan de contingencia inmediato');
        } else if (company.status === 'Regular') {
            recommendations.push('⚠️ Monitorear de cerca y desarrollar plan de mejora');
        }
        
        return recommendations.length > 0 ? recommendations : ['✅ La empresa muestra indicadores saludables'];
    }

    // ================================================================
    // FUNCIONES DE MANTENIMIENTO DEL SISTEMA
    // ================================================================

    performSystemMaintenance() {
        console.log('🔧 Realizando mantenimiento del sistema...');
        
        let maintenanceReport = {
            timestamp: new Date().toISOString(),
            actions: [],
            errors: []
        };
        
        try {
            // 1. Limpiar audit log antiguo (más de 6 meses)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            
            const initialLogLength = this.auditLog.length;
            this.auditLog = this.auditLog.filter(entry => new Date(entry.timestamp) > sixMonthsAgo);
            
            if (this.auditLog.length < initialLogLength) {
                const cleaned = initialLogLength - this.auditLog.length;
                maintenanceReport.actions.push(`Limpiados ${cleaned} registros de auditoría antiguos`);
                localStorage.setItem('grizalum_audit_log', JSON.stringify(this.auditLog));
            }
            
            // 2. Validar integridad de datos de empresas
            let corruptedCompanies = 0;
            Object.entries(this.companies).forEach(([id, company]) => {
                const validation = this.validateCompanyData(company);
                if (!validation.valid) {
                    console.warn(`Empresa corrupta detectada: ${id} - ${validation.error}`);
                    // Intentar reparar datos básicos
                    this.companies[id] = this.sanitizeCompanyData(company);
                    corruptedCompanies++;
                }
            });
            
            if (corruptedCompanies > 0) {
                maintenanceReport.actions.push(`Reparados ${corruptedCompanies} registros de empresas`);
                this.saveCompaniesData(this.companies);
            }
            
            // 3. Optimizar localStorage
            const beforeSize = JSON.stringify(this.companies).length;
            
            // Eliminar propiedades innecesarias o duplicadas
            Object.values(this.companies).forEach(company => {
                delete company._temp;
                delete company._cache;
            });
            
            const afterSize = JSON.stringify(this.companies).length;
            if (beforeSize !== afterSize) {
                maintenanceReport.actions.push(`Optimizado storage: ${beforeSize - afterSize} bytes liberados`);
                this.saveCompaniesData(this.companies);
            }
            
            // 4. Actualizar timestamps de última modificación si están desactualizados
            let updatedTimestamps = 0;
            Object.values(this.companies).forEach(company => {
                if (!company.lastModified) {
                    company.lastModified = new Date().toISOString();
                    updatedTimestamps++;
                }
            });
            
            if (updatedTimestamps > 0) {
                maintenanceReport.actions.push(`Actualizados ${updatedTimestamps} timestamps`);
                this.saveCompaniesData(this.companies);
            }
            
            // Log del mantenimiento
            this.logAuditAction('SYSTEM_MAINTENANCE', `Mantenimiento completado: ${maintenanceReport.actions.length} acciones realizadas`);
            
            console.log('✅ Mantenimiento completado:', maintenanceReport);
            return maintenanceReport;
            
        } catch (error) {
            maintenanceReport.errors.push(error.message);
            console.error('❌ Error durante mantenimiento:', error);
            this.logAuditAction('MAINTENANCE_ERROR', `Error en mantenimiento: ${error.message}`);
            return maintenanceReport;
        }
    }

    // ================================================================
    // INTEGRACIÓN Y COMPATIBILIDAD
    // ================================================================

    // Función para mantener compatibilidad con versiones anteriores
    migrateFromOldVersion() {
        const oldData = localStorage.getItem('companies_data');
        if (oldData && !localStorage.getItem('grizalum_companies')) {
            try {
                const parsed = JSON.parse(oldData);
                
                // Migrar formato antiguo al nuevo
                const migratedCompanies = {};
                Object.entries(parsed).forEach(([id, company]) => {
                    migratedCompanies[id] = {
                        name: company.name || 'Empresa Sin Nombre',
                        icon: company.icon || '🏢',
                        status: company.status || 'Operativo',
                        theme: company.theme || { primary: '#d4af37', secondary: '#b87333' },
                        data: {
                            cashFlow: company.cashFlow || company.data?.cashFlow || 0,
                            revenue: company.revenue || company.data?.revenue || 0,
                            expenses: company.expenses || company.data?.expenses || 0,
                            profit: company.profit || company.data?.profit || 0
                        },
                        createdAt: company.createdAt || new Date().toISOString(),
                        lastModified: new Date().toISOString()
                    };
                });
                
                this.companies = migratedCompanies;
                this.saveCompaniesData(this.companies);
                
                console.log('📦 Datos migrados desde versión anterior');
                this.showNotification('📦 Datos migrados exitosamente', 'success');
                this.logAuditAction('DATA_MIGRATION', `Migrados ${Object.keys(migratedCompanies).length} empresas desde versión anterior`);
                
                // Eliminar datos antiguos
                localStorage.removeItem('companies_data');
                
                return true;
            } catch (error) {
                console.error('❌ Error migrando datos:', error);
                return false;
            }
        }
        return false;
    }

    // ================================================================
    // INICIALIZACIÓN Y DESTRUCTOR
    // ================================================================

    destroy() {
        // Limpiar event listeners
        document.removeEventListener('click', this.outsideClickHandler);
        
        // Limpiar referencias
        this.companies = null;
        this.selectedCompany = null;
        this.emojiCategories = null;
        this.recentEmojis = null;
        this.auditLog = null;
        
        // Marcar como no inicializado
        this.isInitialized = false;
        
        console.log('🧹 Company Manager destruido');
    }

    reinitialize() {
        this.destroy();
        setTimeout(() => {
            this.init();
        }, 100);
    }

    // ================================================================
    // INFORMACIÓN DEL SISTEMA
    // ================================================================

    getSystemInfo() {
        return {
            version: '2.0.0',
            isInitialized: this.isInitialized,
            totalCompanies: Object.keys(this.companies).length,
            selectedCompany: this.selectedCompany,
            auditLogEntries: this.auditLog.length,
            storageUsage: {
                companies: JSON.stringify(this.companies).length,
                auditLog: JSON.stringify(this.auditLog).length,
                recentEmojis: JSON.stringify(this.recentEmojis).length
            },
            lastMaintenance: localStorage.getItem('grizalum_last_maintenance'),
            buildDate: '2024-12-19',
            features: [
                'Gestión completa de empresas',
                'Sistema de auditoría',
                'Backup y restauración',
                'Validación de datos',
                'Reportes y estadísticas',
                'Emoji picker avanzado',
                'Migración automática',
                'Mantenimiento automático'
            ]
        };
    }
}

// ================================================================
// INICIALIZACIÓN GLOBAL
// ================================================================

let grizalumCompanyManager = null;

// Función de inicialización diferida para evitar conflictos
function initializeCompanyManager() {
    console.log('🏢 Inicializando GRIZALUM Company Manager...');
    
    try {
        grizalumCompanyManager = new GrizalumCompanyManager();
        window.grizalumCompanyManager = grizalumCompanyManager;
        
        // Listener para eventos de cambio de empresa
        document.addEventListener('grizalumCompanyChanged', function(event) {
            console.log('🏢 Empresa cambiada:', event.detail);
        });
        
        // Realizar mantenimiento automático cada 24 horas
        const lastMaintenance = localStorage.getItem('grizalum_last_maintenance');
        const now = new Date().getTime();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (!lastMaintenance || (now - parseInt(lastMaintenance)) > dayInMs) {
            setTimeout(() => {
                grizalumCompanyManager.performSystemMaintenance();
                localStorage.setItem('grizalum_last_maintenance', now.toString());
            }, 5000); // Esperar 5 segundos después de la inicialización
        }
        
        console.log('✅ GRIZALUM Company Manager cargado exitosamente');
        
    } catch (error) {
        console.error('❌ Error inicializando Company Manager:', error);
    }
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para asegurar que otros scripts estén cargados
    setTimeout(initializeCompanyManager, 200);
});

// ================================================================
// FUNCIONES GLOBALES PARA COMPATIBILIDAD
// ================================================================

function toggleCompanyDropdown() {
    if (window.grizalumCompanyManager) {
        window.grizalumCompanyManager.toggleDropdown();
    }
}

function selectCompany(companyId) {
    if (window.grizalumCompanyManager) {
        window.grizalumCompanyManager.selectCompany(companyId);
    }
}

// Función global para mostrar el wizard desde cualquier parte
function showAddCompanyWizard() {
    if (window.grizalumCompanyManager) {
        window.grizalumCompanyManager.showAddCompanyWizard();
    } else {
        console.warn('⚠️ Company Manager no está inicializado');
    }
}

// ================================================================
// EXPORTAR PARA USO AVANZADO
// ================================================================

window.GrizalumCompanyManager = GrizalumCompanyManager;

// ================================================================
// BLOQUEAR PROMPTS NATIVOS PARA EVITAR INTERFERENCIAS
// ================================================================

window.prompt = function(message) {
    console.log('🚫 Prompt nativo bloqueado:', message);
    if (message && message.includes('emoji')) {
        setTimeout(() => showAddCompanyWizard(), 100);
        return '🏢';
    }
    return null;
};

console.log(`
🏢 ===================================================
   GRIZALUM COMPANY MANAGER - SISTEMA COMPLETO v2.0
🏢 ===================================================

✨ CARACTERÍSTICAS PRINCIPALES:
   • 🏗️ Arquitectura modular y profesional
   • 📊 Gestión completa de empresas
   • 🎨 Emoji picker con 500+ emojis en 15 categorías
   • 💾 Sistema de backup y restauración
   • 🔍 Validación y sanitización de datos
   • 📈 Reportes y estadísticas avanzadas
   • 🔒 Sistema de auditoría completo
   • 🔧 Mantenimiento automático
   • 📱 Interfaz responsive y moderna
   • 🎯 Integración perfecta con el sistema principal

🛠️ API COMPLETA:
   • grizalumCompanyManager.selectCompany(id)
   • grizalumCompanyManager.addCompany(id, data)
   • grizalumCompanyManager.updateCompany(id, data)
   • grizalumCompanyManager.removeCompany(id)
   • grizalumCompanyManager.exportData()
   • grizalumCompanyManager.createBackup()
   • grizalumCompanyManager.getCompanyStatistics()
   • grizalumCompanyManager.generateCompanyReport(id)

🚀 FUNCIONES AVANZADAS:
   • Migración automática desde versiones anteriores
   • Registro de auditoría con timestamps
   • Sistema de notificaciones profesional
   • Validación de integridad de datos
   • Optimización automática de storage
   • Reportes de riesgo y recomendaciones
   • Mantenimiento preventivo automático

🏢 ===================================================
`);
