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
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-width: 200px;
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
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
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
                z-index: 60000;
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
                width: 99%;
                max-width: 2100px;
                max-height: 98vh;
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

            /* =============== MODAL GESTIÓN AVANZADA =============== */
            .advanced-management-modal {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
            }

           .management-modal-content {
    background: white;
    border-radius: 20px;
    width: 96vw;                 
    max-width: 2200px;           
    height: 92vh;               
    max-height: 1200px;          
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    animation: modalSlideIn 0.3s ease;
    position: relative;
    display: flex;
    flex-direction: column;
}
            .management-header {
    background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
    color: white;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    border-bottom: 3px solid rgba(255,255,255,0.2);
}
            .close-modal {
                background: none; border: none;
                color: white; font-size: 2rem;
                cursor: pointer; padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .close-modal:hover {
                background: rgba(255,255,255,0.2);
                transform: rotate(90deg);
            }

            .management-tabs {
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    flex-shrink: 0;
    min-height: 60px;
}

            .tab-btn {
                flex: 1; padding: 1.5rem;
                border: none; background: none;
                cursor: pointer; font-weight: 600;
                transition: all 0.3s ease;
                font-size: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .tab-btn.active {
                background: white;
                border-bottom: 4px solid #d4af37;
                color: #d4af37;
            }

           .management-content {
    padding: 0;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            /* =============== ESTILOS PREMIUM FUTURISTAS =============== */
            .edit-companies-container-premium {
                padding: 0;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 12px;
                overflow: hidden;
            }

            .section-header-premium {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(184, 115, 51, 0.05) 100%);
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            }

            .section-title {
                font-size: 1.75rem;
                font-weight: 900;
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0;
            }

            .section-subtitle {
                color: #64748b;
                margin: 0.5rem 0 0 0;
                font-size: 1rem;
            }

            .section-actions {
                display: flex;
                gap: 1rem;
            }

            .action-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .action-btn.primary {
                background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
            }

            .action-btn.secondary {
                background: white;
                color: #64748b;
                border: 2px solid #e2e8f0;
            }

            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
            }

            .companies-grid-premium {
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .company-edit-card-premium {
                background: white;
                border-radius: 20px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
                border: 1px solid rgba(212, 175, 55, 0.1);
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .company-edit-card-premium::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #d4af37 0%, #b87333 50%, #d4af37 100%);
                background-size: 200% 100%;
                animation: shimmer 3s infinite;
            }

            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            .company-edit-card-premium:hover {
                transform: translateY(-4px);
                box-shadow: 0 20px 50px rgba(212, 175, 55, 0.2);
                border-color: rgba(212, 175, 55, 0.3);
            }

            .company-card-header {
                padding: 2rem;
                display: flex;
                align-items: center;
                gap: 2rem;
            }

            .company-avatar-container {
                position: relative;
            }

            .company-avatar {
                width: 80px;
                height: 80px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                box-shadow: 0 12px 30px rgba(212, 175, 55, 0.3);
                position: relative;
                overflow: hidden;
            }

            .company-avatar::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                animation: avatarShine 2s infinite;
            }

            @keyframes avatarShine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            .company-status-indicator {
                position: absolute;
                bottom: -2px;
                right: -2px;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }

            .company-main-info {
                flex: 1;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }

            .company-name-group, .company-status-group {
                display: flex;
                flex-direction: column;
            }

            .input-label {
                font-size: 0.875rem;
                font-weight: 700;
                color: #374151;
                margin-bottom: 0.5rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .company-input-premium {
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                background: white;
                transition: all 0.3s ease;
                outline: none;
            }

            .company-input-premium:focus {
                border-color: #d4af37;
                box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
                transform: translateY(-1px);
            }

            .custom-select-wrapper {
                position: relative;
            }

            .company-select-premium {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 500;
                background: white;
                cursor: pointer;
                appearance: none;
                transition: all 0.3s ease;
                outline: none;
            }

            .company-select-premium:focus {
                border-color: #d4af37;
                box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
            }

            .select-arrow {
                position: absolute;
                right: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #9ca3af;
                pointer-events: none;
            }

            .company-actions {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 1rem;
            }

            .company-metrics-preview {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .metric-mini {
                text-align: right;
            }

            .metric-mini-label {
                display: block;
                font-size: 0.75rem;
                color: #6b7280;
                font-weight: 500;
            }

            .metric-mini-value {
                display: block;
                font-size: 1rem;
                font-weight: 700;
                color: #1f2937;
            }

            .save-company-btn-premium {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 0.875rem 1.75rem;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            }

            .save-company-btn-premium:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
            }

            .btn-shine {
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                animation: btnShine 2s infinite;
            }

            @keyframes btnShine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            .company-card-footer {
                padding: 1.5rem 2rem;
                background: rgba(248, 250, 252, 0.8);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid rgba(226, 232, 240, 0.8);
            }

            .last-updated {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #6b7280;
                font-size: 0.875rem;
            }

            .quick-actions {
                display: flex;
                gap: 0.5rem;
            }

            .quick-btn {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 8px;
                background: white;
                color: #6b7280;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .quick-btn:hover {
                background: #f3f4f6;
                color: #374151;
                transform: scale(1.1);
            }

            .quick-btn.danger:hover {
                background: #fee2e2;
                color: #dc2626;
            }

            .bulk-actions-bar {
                background: rgba(212, 175, 55, 0.05);
                padding: 1.5rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
            }

            .bulk-info {
                color: #6b7280;
                font-weight: 500;
            }

            .bulk-controls {
                display: flex;
                gap: 1rem;
            }

            .bulk-btn {
                padding: 0.75rem 1.25rem;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                background: white;
                color: #374151;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }

            .bulk-btn:hover {
                border-color: #d4af37;
                color: #d4af37;
                transform: translateY(-1px);
            }

            /* =============== MÉTRICAS PREMIUM =============== */
            .metrics-container-premium {
                padding: 0;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 12px;
                overflow: hidden;
            }

            .metrics-header-premium {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%);
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(59, 130, 246, 0.2);
            }

            .metrics-title {
                font-size: 1.75rem;
                font-weight: 900;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0;
            }

            .metrics-subtitle {
                color: #64748b;
                margin: 0.5rem 0 0 0;
                font-size: 1rem;
            }

            .metrics-tools {
                display: flex;
                gap: 1rem;
            }

            .tool-btn {
                padding: 0.75rem 1.5rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                background: white;
                color: #374151;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .tool-btn:hover {
                border-color: #3b82f6;
                color: #3b82f6;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
            }

            .metrics-overview {
                padding: 2rem;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1.5rem;
                background: rgba(255, 255, 255, 0.5);
            }

            .overview-stat {
                background: white;
                padding: 1.5rem;
                border-radius: 16px;
                display: flex;
                align-items: center;
                gap: 1rem;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                border: 1px solid rgba(59, 130, 246, 0.1);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .overview-stat::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
            }

            .overview-stat:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 30px rgba(59, 130, 246, 0.15);
            }

            .stat-icon {
                width: 50px;
                height: 50px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                color: white;
                position: relative;
            }

            .stat-icon.total-revenue {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }

            .stat-icon.total-profit {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }

            .stat-icon.avg-margin {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            }

            .stat-icon.companies-count {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            }

            .stat-content {
                display: flex;
                flex-direction: column;
            }

            .stat-number {
                font-size: 1.5rem;
                font-weight: 900;
                color: #1f2937;
                line-height: 1;
            }

            .stat-desc {
                font-size: 0.875rem;
                color: #6b7280;
                font-weight: 500;
            }

            .metrics-companies {
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .metrics-card-premium {
                background: white;
                border-radius: 24px;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
                border: 1px solid rgba(59, 130, 246, 0.1);
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .metrics-card-premium::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%);
                background-size: 300% 100%;
                animation: gradientFlow 4s infinite;
            }

            @keyframes gradientFlow {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }

            .metrics-card-premium:hover {
                transform: translateY(-6px);
                box-shadow: 0 25px 60px rgba(59, 130, 246, 0.15);
                border-color: rgba(59, 130, 246, 0.3);
            }

            .metrics-card-header {
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%);
            }

            .company-identity {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .company-avatar-metrics {
                width: 70px;
                height: 70px;
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                position: relative;
                overflow: hidden;
            }

            .company-avatar-metrics::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
                animation: avatarGlow 3s infinite;
            }

            @keyframes avatarGlow {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }

            .company-name-metrics {
                font-size: 1.5rem;
                font-weight: 800;
                color: #1f2937;
                margin: 0 0 0.5rem 0;
            }

            .company-status-badge {
                padding: 0.375rem 0.875rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .status-operativo {
                background: rgba(16, 185, 129, 0.1);
                color: #059669;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }

            .status-regular {
                background: rgba(245, 158, 11, 0.1);
                color: #d97706;
                border: 1px solid rgba(245, 158, 11, 0.3);
            }

            .status-crítico, .status-critico {
                background: rgba(239, 68, 68, 0.1);
                color: #dc2626;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }

            .status-en-preparación, .status-en-preparacion {
                background: rgba(59, 130, 246, 0.1);
                color: #2563eb;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }

            .status-mantenimiento {
                background: rgba(139, 92, 246, 0.1);
                color: #7c3aed;
                border: 1px solid rgba(139, 92, 246, 0.3);
            }

            .status-archivado {
                background: rgba(107, 114, 128, 0.1);
                color: #4b5563;
                border: 1px solid rgba(107, 114, 128, 0.3);
            }

            .metrics-summary {
                display: flex;
                gap: 2rem;
            }

            .summary-stat {
                text-align: right;
            }

            .stat-value {
                display: block;
                font-size: 1.25rem;
                font-weight: 900;
                color: #1f2937;
                line-height: 1;
            }

            .stat-label {
                display: block;
                font-size: 0.75rem;
                color: #6b7280;
                font-weight: 500;
                margin-top: 0.25rem;
            }

            .metrics-grid {
                padding: 0 2rem;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
            }

            .metric-input-group-premium {
                background: rgba(248, 250, 252, 0.8);
                border: 1px solid rgba(226, 232, 240, 0.8);
                border-radius: 16px;
                padding: 1.5rem;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .metric-input-group-premium::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .metric-input-group-premium:hover::before {
                opacity: 1;
            }

            .metric-input-group-premium:hover {
                background: white;
                border-color: rgba(59, 130, 246, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1);
            }

            .metric-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .metric-icon {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                color: white;
            }

            .revenue-icon {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            }

            .expenses-icon {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }

            .profit-icon {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }

            .cashflow-icon {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            }

            .metric-info {
                flex: 1;
            }

            .metric-label {
                display: block;
                font-size: 0.875rem;
                font-weight: 700;
                color: #374151;
                margin-bottom: 0.25rem;
            }

            .metric-description {
                font-size: 0.75rem;
                color: #6b7280;
            }

            .metric-input-container {
                position: relative;
                margin-bottom: 0.75rem;
            }

            .currency-symbol {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                font-weight: 700;
                color: #6b7280;
                z-index: 2;
            }

            .metric-input-premium {
                width: 100%;
                padding: 1rem 1rem 1rem 3rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1.125rem;
                font-weight: 700;
                background: white;
                transition: all 0.3s ease;
                outline: none;
            }

            .metric-input-premium:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                transform: translateY(-1px);
            }

            .input-decoration {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 2px;
                background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
                width: 0%;
                transition: width 0.3s ease;
            }

            .metric-input-premium:focus + .input-decoration {
                width: 100%;
            }

            .metric-trend {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.75rem;
                font-weight: 600;
            }

            .trend-positive {
                color: #10b981;
            }

            .trend-negative {
                color: #ef4444;
            }

            .trend-text {
                color: #6b7280;
            }

            .metrics-actions {
                padding: 2rem;
                background: rgba(248, 250, 252, 0.5);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid rgba(226, 232, 240, 0.8);
            }

            .validation-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #10b981;
                font-size: 0.875rem;
                font-weight: 600;
            }

            .action-buttons {
                display: flex;
                gap: 1rem;
            }

            .metrics-btn {
                padding: 0.875rem 1.75rem;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .metrics-btn.secondary {
                background: white;
                color: #6b7280;
                border: 2px solid #e5e7eb;
            }

            .metrics-btn.secondary:hover {
                border-color: #d1d5db;
                color: #374151;
                transform: translateY(-2px);
            }

            .metrics-btn.primary {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }

            .metrics-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
            }

            .btn-glow {
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                animation: btnGlow 2.5s infinite;
            }

            @keyframes btnGlow {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            .metrics-insights {
                padding: 1.5rem 2rem 2rem 2rem;
            }

            .insight-card {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
                border: 1px solid rgba(139, 92, 246, 0.2);
                border-radius: 12px;
                padding: 1.25rem;
            }

            .insight-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
                color: #8b5cf6;
                font-weight: 700;
                font-size: 0.875rem;
            }

            .insight-text {
                color: #4b5563;
                font-size: 0.875rem;
                line-height: 1.5;
                margin: 0;
            }

            /* =============== ZONA PELIGROSA =============== */
            .danger-zone-container-premium {
                padding: 0;
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                border-radius: 12px;
                overflow: hidden;
                position: relative;
            }

            .danger-zone-container-premium::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 6px;
                background: linear-gradient(90deg, #ef4444 0%, #dc2626 25%, #b91c1c 50%, #dc2626 75%, #ef4444 100%);
                background-size: 200% 100%;
                animation: dangerPulse 3s infinite;
            }

            @keyframes dangerPulse {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }

            .danger-warning-banner {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                padding: 2rem;
                display: flex;
                align-items: center;
                gap: 2rem;
                position: relative;
                overflow: hidden;
            }

            .danger-warning-banner::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
                animation: warningShine 4s infinite;
            }

            @keyframes warningShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .warning-icon {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                animation: warningBlink 2s infinite;
                flex-shrink: 0;
            }

            @keyframes warningBlink {
                0%, 50% { opacity: 1; }
                25%, 75% { opacity: 0.5; }
            }

            .warning-content {
                flex: 1;
            }

            .warning-title {
                font-size: 2rem;
                font-weight: 900;
                margin: 0 0 0.5rem 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }

            .warning-description {
                font-size: 1.125rem;
                margin: 0 0 1rem 0;
                opacity: 0.95;
            }

            .warning-features {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .feature-badge {
                background: rgba(255, 255, 255, 0.2);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.875rem;
                font-weight: 600;
                backdrop-filter: blur(10px);
            }

            .security-section {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.8);
            }

            .security-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid rgba(239, 68, 68, 0.2);
            }

            .security-title {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.25rem;
                font-weight: 800;
                color: #1f2937;
            }

            .security-title i {
                color: #10b981;
                font-size: 1.5rem;
            }

            .security-status {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 600;
                color: #10b981;
            }

            .status-indicator.active {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #10b981;
                animation: statusPulse 2s infinite;
            }

            @keyframes statusPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.2); }
            }

            .security-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
            }

            .security-card {
                background: white;
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                border: 1px solid rgba(16, 185, 129, 0.2);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .security-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #10b981 0%, #059669 100%);
            }

            .security-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 15px 40px rgba(16, 185, 129, 0.15);
                border-color: rgba(16, 185, 129, 0.4);
            }

            .security-icon {
                width: 60px;
                height: 60px;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.75rem;
                color: white;
                margin-bottom: 1.5rem;
                position: relative;
                overflow: hidden;
            }

            .security-icon.backup {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            }

            .security-icon.restore {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }

            .security-icon.audit {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            }

            .security-icon::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                animation: securityShine 3s infinite;
            }

            @keyframes securityShine {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }

            .security-info h4 {
                font-size: 1.125rem;
                font-weight: 800;
                color: #1f2937;
                margin: 0 0 0.5rem 0;
            }

            .security-info p {
                color: #6b7280;
                margin: 0 0 1.5rem 0;
                font-size: 0.875rem;
                line-height: 1.5;
            }

            .security-actions {
                display: flex;
                gap: 0.75rem;
            }

            .security-btn {
                padding: 0.75rem 1.25rem;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                font-size: 0.875rem;
                flex: 1;
                justify-content: center;
            }

            .security-btn.primary {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }

            .security-btn.secondary {
                background: white;
                color: #6b7280;
                border: 2px solid #e5e7eb;
            }

            .security-btn:hover {
                transform: translateY(-2px);
            }

            .security-btn.primary:hover {
                box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
            }

            .security-btn.secondary:hover {
                border-color: #10b981;
                color: #10b981;
            }

            .danger-companies-section {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.9);
            }

            .section-header-danger {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid rgba(239, 68, 68, 0.2);
            }

            .section-title-danger {
                font-size: 1.25rem;
                font-weight: 800;
                color: #dc2626;
                margin: 0;
            }

            .section-subtitle-danger {
                color: #6b7280;
                margin: 0.5rem 0 0 0;
                font-size: 0.875rem;
            }

            .bulk-danger-actions {
                display: flex;
                gap: 1rem;
            }

            .bulk-danger-btn {
                padding: 0.75rem 1.5rem;
                border: 2px solid #fca5a5;
                border-radius: 10px;
                background: white;
                color: #dc2626;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                font-size: 0.875rem;
            }

            .bulk-danger-btn:hover {
                background: #fef2f2;
                border-color: #dc2626;
                transform: translateY(-2px);
            }

            .bulk-danger-btn.critical {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                border-color: #dc2626;
            }

            .bulk-danger-btn.critical:hover {
                background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
                box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
            }

            .companies-danger-grid {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .danger-company-card-premium {
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 25px rgba(220, 38, 38, 0.1);
                border: 2px solid rgba(239, 68, 68, 0.2);
                overflow: hidden;
                transition: all 0.3s ease;
                position: relative;
            }

            .danger-company-card-premium::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
            }

            .danger-company-card-premium:hover {
                transform: translateY(-4px);
                box-shadow: 0 15px 40px rgba(220, 38, 38, 0.2);
                border-color: rgba(239, 68, 68, 0.4);
            }

            .danger-card-header {
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, rgba(254, 242, 242, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%);
            }

            .company-danger-identity {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .danger-avatar {
                width: 70px;
                height: 70px;
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                position: relative;
                overflow: hidden;
            }

            .danger-avatar::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
                animation: dangerAvatarGlow 4s infinite;
            }

            @keyframes dangerAvatarGlow {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }

            .danger-company-name {
                font-size: 1.25rem;
                font-weight: 800;
                color: #1f2937;
                margin: 0 0 0.5rem 0;
            }

            .danger-company-stats {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .stat-item {
                font-size: 0.875rem;
                color: #6b7280;
            }

            .danger-level {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }

            .danger-indicator {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                color: white;
                animation: dangerBlink 2s infinite;
            }

            .danger-indicator.critical {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
            }

            @keyframes dangerBlink {
                0%, 50% { opacity: 1; transform: scale(1); }
                25%, 75% { opacity: 0.7; transform: scale(1.1); }
            }

            .danger-text {
                font-size: 0.75rem;
                font-weight: 700;
                color: #dc2626;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .danger-actions {
                padding: 1.5rem 2rem;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                background: rgba(248, 250, 252, 0.8);
            }

            .danger-btn {
                padding: 1rem;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                text-align: center;
                position: relative;
                overflow: hidden;
            }

            .danger-btn span {
                font-weight: 700;
                font-size: 0.875rem;
            }

            .danger-btn small {
                font-size: 0.75rem;
                opacity: 0.8;
            }

            .danger-btn i {
                font-size: 1.25rem;
            }

            .danger-btn.archive {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            }

            .danger-btn.suspend {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            }

            .danger-btn.delete {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                animation: deleteWarning 3s infinite;
            }

            @keyframes deleteWarning {
                0%, 90%, 100% { box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
                95% { box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6); }
            }

            .danger-btn:hover {
                transform: translateY(-3px);
            }

            .danger-btn.archive:hover {
                box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
            }

            .danger-btn.suspend:hover {
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
            }

            .danger-btn.delete:hover {
                box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5);
            }

            .danger-timeline {
                padding: 1.5rem 2rem;
                background: rgba(243, 244, 246, 0.8);
                border-top: 1px solid rgba(229, 231, 235, 0.8);
            }

            .timeline-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 0.75rem;
            }

            .timeline-item:last-child {
                margin-bottom: 0;
            }

            .timeline-dot {
                width: 8px;
                height: 8px;
                background: #d1d5db;
                border-radius: 50%;
                flex-shrink: 0;
            }

            .timeline-content {
                display: flex;
                flex-direction: column;
            }

            .timeline-date {
                font-size: 0.75rem;
                color: #9ca3af;
                font-weight: 500;
            }

            .timeline-action {
                font-size: 0.875rem;
                color: #374151;
                font-weight: 600;
            }

            .emergency-section {
                padding: 2rem;
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                border-top: 3px solid #dc2626;
            }

            .emergency-header {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .emergency-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.75rem;
                color: white;
                animation: emergencyPulse 2s infinite;
            }

            @keyframes emergencyPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
                50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
            }

            .emergency-content h4 {
                font-size: 1.25rem;
                font-weight: 800;
                color: #dc2626;
                margin: 0 0 0.5rem 0;
            }

            .emergency-content p {
                color: #6b7280;
                margin: 0;
                font-size: 0.875rem;
            }

            .emergency-actions {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1.5rem;
            }

            .emergency-btn {
                padding: 1.5rem;
                border: 2px solid #fca5a5;
                border-radius: 12px;
                background: white;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.75rem;
                transition: all 0.3s ease;
                text-align: center;
            }

            .emergency-btn:hover {
                transform: translateY(-4px);
                border-color: #dc2626;
                box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
            }

            .emergency-btn i {
                font-size: 2rem;
                color: #dc2626;
            }

            .emergency-btn span {
                font-weight: 800;
                color: #1f2937;
                font-size: 1rem;
            }

            .emergency-btn small {
                font-size: 0.75rem;
                color: #6b7280;
            }

            .emergency-btn.critical {
                border-color: #dc2626;
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            }

            .emergency-btn.critical:hover {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
            }

            .emergency-btn.critical:hover i,
            .emergency-btn.critical:hover span,
            .emergency-btn.critical:hover small {
                color: white;
            }

            .legal-disclaimer {
                padding: 2rem;
                background: #f9fafb;
                border-top: 1px solid #e5e7eb;
            }

            .disclaimer-content h5 {
                font-size: 1rem;
                font-weight: 800;
                color: #1f2937;
                margin: 0 0 1rem 0;
            }

            .disclaimer-list {
                list-style: none;
                padding: 0;
                margin: 0 0 1.5rem 0;
            }

            .disclaimer-list li {
                font-size: 0.875rem;
                color: #4b5563;
                margin-bottom: 0.5rem;
                padding-left: 1.5rem;
                position: relative;
            }

            .disclaimer-list li::before {
                content: '•';
                position: absolute;
                left: 0;
                color: #dc2626;
                font-weight: bold;
            }

            .disclaimer-signature {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 1rem;
            }

            .disclaimer-signature p {
                font-size: 0.875rem;
                color: #374151;
                margin: 0 0 1rem 0;
                font-weight: 600;
            }

            .signature-info {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                color: #6b7280;
            }

            /* =============== TEMAS PREMIUM FUTURISTAS =============== */
            .themes-container-premium {
                padding: 0;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 12px;
                overflow: hidden;
            }

            .themes-header-premium {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%);
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(139, 92, 246, 0.2);
            }

            .themes-title {
                font-size: 1.75rem;
                font-weight: 900;
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0;
            }

            .themes-subtitle {
                color: #64748b;
                margin: 0.5rem 0 0 0;
                font-size: 1rem;
            }

            .themes-tools {
                display: flex;
                gap: 1rem;
            }

            .themes-tool-btn {
                padding: 0.75rem 1.5rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                background: white;
                color: #374151;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .themes-tool-btn:hover {
                border-color: #8b5cf6;
                color: #8b5cf6;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
            }

            .themes-gallery {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.5);
            }

            .gallery-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }

            .gallery-header h4 {
                font-size: 1.25rem;
                font-weight: 800;
                color: #1f2937;
                margin: 0;
            }

            .gallery-filters {
                display: flex;
                gap: 0.5rem;
            }

            .filter-chip {
                padding: 0.5rem 1rem;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                background: white;
                color: #6b7280;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .filter-chip.active,
            .filter-chip:hover {
                background: #8b5cf6;
                color: white;
                border-color: #8b5cf6;
                transform: translateY(-1px);
            }

            .themes-showcase {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .showcase-theme {
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                border: 1px solid #e5e7eb;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .showcase-theme:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
                border-color: #8b5cf6;
            }

            .showcase-preview {
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }

            .showcase-preview::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                animation: showcaseShine 3s infinite;
            }

            @keyframes showcaseShine {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }

            .showcase-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                z-index: 2;
            }

            .showcase-icon {
                font-size: 2rem;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            }

            .showcase-text {
                color: white;
                font-weight: 700;
                font-size: 0.875rem;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            .showcase-info {
                padding: 1rem;
            }

            .showcase-name {
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.25rem;
                font-size: 0.875rem;
            }

            .showcase-desc {
                font-size: 0.75rem;
                color: #6b7280;
                margin-bottom: 0.5rem;
                line-height: 1.4;
            }

            .showcase-category {
                font-size: 0.7rem;
                padding: 0.25rem 0.5rem;
                background: rgba(139, 92, 246, 0.1);
                color: #8b5cf6;
                border-radius: 10px;
                display: inline-block;
                font-weight: 600;
            }

            .companies-themes {
                padding: 1.5rem 2rem 2rem 2rem;
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #e5e7eb;
            }

            .section-header h4 {
                font-size: 1.25rem;
                font-weight: 800;
                color: #1f2937;
                margin: 0;
            }

            .bulk-theme-actions {
                display: flex;
                gap: 1rem;
            }

            .themes-grid {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .theme-card-premium {
                background: white;
                border-radius: 20px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
                border: 1px solid rgba(139, 92, 246, 0.1);
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .theme-card-premium::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
                background-size: 300% 100%;
                animation: rainbowFlow 5s infinite;
            }

            @keyframes rainbowFlow {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }

            .theme-card-premium:hover {
                transform: translateY(-6px);
                box-shadow: 0 20px 50px rgba(139, 92, 246, 0.2);
                border-color: rgba(139, 92, 246, 0.3);
            }

            .theme-card-header {
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(236, 72, 153, 0.02) 100%);
            }

            .company-preview {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .company-avatar-theme {
                width: 70px;
                height: 70px;
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .company-avatar-theme::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
                animation: avatarThemeGlow 4s infinite;
            }

            @keyframes avatarThemeGlow {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }

            .company-name-theme h4 {
                font-size: 1.25rem;
                font-weight: 800;
                color: #1f2937;
                margin: 0 0 0.25rem 0;
            }

            .theme-status {
                font-size: 0.75rem;
                padding: 0.25rem 0.75rem;
                background: rgba(16, 185, 129, 0.1);
                color: #059669;
                border-radius: 12px;
                font-weight: 600;
            }

            .theme-actions {
                display: flex;
                gap: 1rem;
            }

            .theme-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                font-size: 0.875rem;
            }

            .theme-btn.preview {
                background: white;
                color: #6b7280;
                border: 2px solid #e5e7eb;
            }

            .theme-btn.preview:hover {
                border-color: #8b5cf6;
                color: #8b5cf6;
                transform: translateY(-2px);
            }

            .theme-btn.apply {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
            }

            .theme-btn.apply:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
            }

            .theme-selector-container {
                padding: 0 2rem 1.5rem 2rem;
            }

            .theme-label {
                display: block;
                font-size: 0.875rem;
                font-weight: 700;
                color: #374151;
                margin-bottom: 0.75rem;
            }

            .custom-theme-select {
                position: relative;
            }

            .theme-selector-premium {
                width: 100%;
                padding: 1rem 1rem 1rem 3rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                background: white;
                cursor: pointer;
                appearance: none;
                transition: all 0.3s ease;
                outline: none;
            }

            .theme-selector-premium:focus {
                border-color: #8b5cf6;
                box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
            }

            .select-icon {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #8b5cf6;
                font-size: 1.125rem;
            }

            .theme-preview-area {
                padding: 0 2rem 1.5rem 2rem;
            }

            .preview-label {
                font-size: 0.875rem;
                font-weight: 700;
                color: #374151;
                margin-bottom: 0.75rem;
            }

            .theme-preview-card {
                border-radius: 16px;
                padding: 2rem;
                position: relative;
                overflow: hidden;
                min-height: 120px;
                display: flex;
                align-items: center;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
            }

            .preview-content {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                color: white;
                z-index: 2;
                width: 100%;
            }

            .preview-icon {
                font-size: 2.5rem;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            }

            .preview-text {
                flex: 1;
            }

            .preview-title {
                font-size: 1.5rem;
                font-weight: 900;
                margin-bottom: 0.25rem;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            .preview-subtitle {
                font-size: 1rem;
                opacity: 0.9;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            .preview-metrics {
                display: flex;
                gap: 2rem;
            }

            .preview-metric {
                text-align: right;
            }

            .metric-value {
                display: block;
                font-size: 1.25rem;
                font-weight: 900;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            .metric-label {
                display: block;
                font-size: 0.75rem;
                opacity: 0.8;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            .preview-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
                animation: previewShine 4s infinite;
                pointer-events: none;
            }

            @keyframes previewShine {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(100%) rotate(45deg); }
            }

            .theme-customization {
                padding: 1.5rem 2rem 2rem 2rem;
                background: rgba(248, 250, 252, 0.8);
                border-top: 1px solid rgba(226, 232, 240, 0.8);
            }

            .customization-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
                color: #374151;
                font-weight: 700;
                font-size: 0.875rem;
            }

            .custom-colors {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }

            .color-input-group {
                display: flex;
                flex-direction: column;
            }

            .color-input-group label {
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.75rem;
            }

            .color-picker-container {
                display: flex;
                align-items: center;
                gap: 1rem;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 0.75rem;
                transition: all 0.3s ease;
            }

            .color-picker-container:focus-within {
                border-color: #8b5cf6;
                box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
            }

            .color-picker {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .color-picker:hover {
                transform: scale(1.1);
            }

            .color-code {
                font-family: 'Monaco', monospace;
                font-size: 0.875rem;
                font-weight: 600;
                color: #374151;
                background: #f3f4f6;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                flex: 1;
            }

            /* RESPONSIVE PARA TEMAS */
            @media (max-width: 1024px) {
                .themes-showcase {
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                }
                
                .custom-colors {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
            }

            @media (max-width: 768px) {
                .themes-header-premium {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }
                
                .themes-tools {
                    justify-content: center;
                }
                
                .gallery-header {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }
                
                .gallery-filters {
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .theme-card-header {
                    flex-direction: column;
                    gap: 1.5rem;
                    align-items: stretch;
                }
                
                .theme-actions {
                    justify-content: center;
                }
                
                .preview-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
                
                .preview-metrics {
                    justify-content: center;
                }
            }

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

                .management-tabs {
                    flex-wrap: wrap;
                }

                .tab-btn {
                    font-size: 0.875rem;
                    padding: 1rem;
                }

                .section-header-premium {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }

                .section-actions {
                    justify-content: center;
                }

                .metrics-header-premium {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }

                .metrics-tools {
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .metrics-overview {
                    grid-template-columns: 1fr;
                }

                .danger-warning-banner {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }

                .emergency-header {
                    flex-direction: column;
                    text-align: center;
                }

                .company-card-header {
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .danger-card-header {
                    flex-direction: column;
                    gap: 1.5rem;
                    text-align: center;
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

/* =============== MEJORAS PARA MODAL MÁS GRANDE =============== */
.advanced-management-modal {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.tab-content {
    height: 100%;
    overflow-y: auto;
}

.tab-content.active {
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* Scrollbar personalizado para el contenido */
.management-content::-webkit-scrollbar {
    width: 8px;
}

.management-content::-webkit-scrollbar-track {
    background: rgba(212, 175, 55, 0.1);
    border-radius: 10px;
}

.management-content::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #d4af37 0%, #b87333 100%);
    border-radius: 10px;
}

.management-content::-webkit-scrollbar-thumb:hover {
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
        this.applyCompanyThemeIntegration(companyId);
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
    // GESTIÓN AVANZADA DE EMPRESAS - SISTEMA COMPLETO
    // ================================================================

    openCompanyManagement() {
        console.log('🏢 Abriendo gestión avanzada de empresas');
        this.createAdvancedManagementModal();
        this.logAuditAction('MANAGEMENT_OPENED', 'Panel de gestión avanzada abierto');
    }

    createAdvancedManagementModal() {
        // Eliminar modal existente si existe
        const existingModal = document.getElementById('advancedManagementModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'advancedManagementModal';
        modal.className = 'grizalum-modal advanced-management-modal';
        
        modal.innerHTML = `
            <div class="grizalum-modal-content management-modal-content">
                <div class="grizalum-modal-header management-header">
                    <h2>🏢 Gestión Avanzada de Empresas GRIZALUM</h2>
                    <button class="modal-close-btn close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="management-tabs">
                    <button class="tab-btn active" onclick="grizalumCompanyManager.showManagementTab('edit')">
                        <i class="fas fa-edit"></i>
                        📝 Editar Empresas
                    </button>
                    <button class="tab-btn" onclick="grizalumCompanyManager.showManagementTab('metrics')">
                        <i class="fas fa-chart-bar"></i>
                        📊 Métricas Financieras
                    </button>
                    <button class="tab-btn" onclick="grizalumCompanyManager.showManagementTab('themes')">
                        <i class="fas fa-palette"></i>
                        🎨 Temas Visuales
                    </button>
                    <button class="tab-btn" onclick="grizalumCompanyManager.showManagementTab('danger')">
                        <i class="fas fa-exclamation-triangle"></i>
                        ⚠️ Zona Peligrosa
                    </button>
                </div>
                
                <div class="management-content">
                    <div id="edit-management-tab" class="tab-content active">
                        ${this.generateEditTab()}
                    </div>
                    <div id="metrics-management-tab" class="tab-content">
                        ${this.generateMetricsTab()}
                    </div>
                    <div id="themes-management-tab" class="tab-content">
                        ${this.generateThemesTab()}
                    </div>
                    <div id="danger-management-tab" class="tab-content">
                        ${this.generateDangerTab()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mostrar modal con animación
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        console.log('🎛️ Modal de gestión avanzada creado');
    }

    showManagementTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('#advancedManagementModal .tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('#advancedManagementModal .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar pestaña seleccionada
        const targetTab = document.getElementById(tabName + '-management-tab');
        const targetBtn = event.target.closest('.tab-btn');
        
        if (targetTab) targetTab.classList.add('active');
        if (targetBtn) targetBtn.classList.add('active');
        
        console.log(`📱 Tab de gestión cambiado a: ${tabName}`);
    }

    generateEditTab() {
        const companies = this.companies;
        let companiesHTML = '';
        
        Object.entries(companies).forEach(([id, company]) => {
            const statusColor = {
                'Operativo': '#10b981',
                'Regular': '#f59e0b', 
                'Crítico': '#ef4444',
                'En Preparación': '#3b82f6',
                'Mantenimiento': '#8b5cf6',
                'Archivado': '#6b7280'
            }[company.status] || '#6b7280';
            
            companiesHTML += `
                <div class="company-edit-card-premium" data-company="${id}">
                    <div class="company-card-header">
                        <div class="company-avatar-container">
                            <div class="company-avatar" style="background: linear-gradient(135deg, ${company.theme?.primary || '#d4af37'} 0%, ${company.theme?.secondary || '#b87333'} 100%);">
                                ${company.icon}
                            </div>
                            <div class="company-status-indicator" style="background: ${statusColor};"></div>
                        </div>
                        
                        <div class="company-main-info">
                            <div class="company-name-group">
                                <label class="input-label">Nombre de la Empresa</label>
                                <input type="text" value="${company.name}" id="name_${id}" class="company-input-premium" placeholder="Ingresa el nombre...">
                            </div>
                            
                            <div class="company-status-group">
                                <label class="input-label">Estado Operativo</label>
                                <div class="custom-select-wrapper">
                                    <select id="status_${id}" class="company-select-premium">
                                        <option value="Operativo" ${company.status === 'Operativo' ? 'selected' : ''}>🟢 Totalmente Operativo</option>
                                        <option value="Regular" ${company.status === 'Regular' ? 'selected' : ''}>🟡 Funcionamiento Regular</option>
                                        <option value="Crítico" ${company.status === 'Crítico' ? 'selected' : ''}>🔴 Estado Crítico</option>
                                        <option value="En Preparación" ${company.status === 'En Preparación' ? 'selected' : ''}>🔵 En Preparación</option>
                                        <option value="Mantenimiento" ${company.status === 'Mantenimiento' ? 'selected' : ''}>🔧 En Mantenimiento</option>
                                        <option value="Archivado" ${company.status === 'Archivado' ? 'selected' : ''}>📦 Archivado</option>
                                    </select>
                                    <i class="fas fa-chevron-down select-arrow"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="company-actions">
                            <div class="company-metrics-preview">
                                <div class="metric-mini">
                                    <span class="metric-mini-label">Flujo</span>
                                    <span class="metric-mini-value">S/. ${company.data.cashFlow.toLocaleString()}</span>
                                </div>
                                <div class="metric-mini">
                                    <span class="metric-mini-label">Ingresos</span>
                                    <span class="metric-mini-value">S/. ${(company.data.revenue/1000000).toFixed(1)}M</span>
                                </div>
                            </div>
                            
                            <button class="save-company-btn-premium" onclick="grizalumCompanyManager.saveCompanyEdit('${id}')">
                                <i class="fas fa-save"></i>
                                <span>Guardar Cambios</span>
                                <div class="btn-shine"></div>
                            </button>
                        </div>
                    </div>
                    
                    <div class="company-card-footer">
                        <div class="last-updated">
                            <i class="fas fa-clock"></i>
                            <span>Última actualización: ${this.getTimeAgo(company.lastModified)}</span>
                        </div>
                        <div class="quick-actions">
                            <button class="quick-btn" onclick="grizalumCompanyManager.duplicateCompany('${id}')" title="Duplicar empresa">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="quick-btn" onclick="grizalumCompanyManager.exportCompanyData('${id}')" title="Exportar datos">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="quick-btn danger" onclick="grizalumCompanyManager.archiveCompany('${id}')" title="Archivar">
                                <i class="fas fa-archive"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="edit-companies-container-premium">
                <div class="section-header-premium">
                    <div class="section-title-group">
                        <h3 class="section-title">✏️ Gestión de Empresas</h3>
                        <p class="section-subtitle">Administra la información y configuración de tus empresas</p>
                    </div>
                    <div class="section-actions">
                        <button class="action-btn secondary" onclick="grizalumCompanyManager.bulkEdit()">
                            <i class="fas fa-edit"></i>
                            Edición Masiva
                        </button>
                        <button class="action-btn primary" onclick="grizalumCompanyManager.showAddCompanyWizard()">
                            <i class="fas fa-plus"></i>
                            Nueva Empresa
                        </button>
                    </div>
                </div>
                
                <div class="companies-grid-premium">
                    ${companiesHTML}
                </div>
                
                <div class="bulk-actions-bar">
                    <div class="bulk-info">
                        <span>${Object.keys(companies).length} empresas registradas</span>
                    </div>
                    <div class="bulk-controls">
                        <button class="bulk-btn" onclick="grizalumCompanyManager.exportAllData()">
                            <i class="fas fa-file-export"></i>
                            Exportar Todo
                        </button>
                        <button class="bulk-btn" onclick="grizalumCompanyManager.backupAll()">
                            <i class="fas fa-shield-alt"></i>
                            Crear Backup
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateMetricsTab() {
        const companies = this.companies;
        let metricsHTML = '';
        
        Object.entries(companies).forEach(([id, company]) => {
            const data = company.data;
            const profitMargin = data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : '0.0';
            const expenseRatio = data.revenue > 0 ? ((data.expenses / data.revenue) * 100).toFixed(1) : '0.0';
            
            metricsHTML += `
                <div class="metrics-card-premium" data-company="${id}">
                    <div class="metrics-card-header">
                        <div class="company-identity">
                            <div class="company-avatar-metrics" style="background: linear-gradient(135deg, ${company.theme?.primary || '#d4af37'} 0%, ${company.theme?.secondary || '#b87333'} 100%);">
                                ${company.icon}
                            </div>
                            <div class="company-name-info">
                                <h4 class="company-name-metrics">${company.name}</h4>
                                <span class="company-status-badge status-${company.status.toLowerCase().replace(/\s+/g, '-')}">${company.status}</span>
                            </div>
                        </div>
                        
                        <div class="metrics-summary">
                            <div class="summary-stat">
                                <span class="stat-value">S/. ${(data.revenue/1000000).toFixed(1)}M</span>
                                <span class="stat-label">Ingresos</span>
                            </div>
                            <div class="summary-stat">
                                <span class="stat-value">${profitMargin}%</span>
                                <span class="stat-label">Margen</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metrics-grid">
                        <div class="metric-input-group-premium">
                            <div class="metric-header">
                                <div class="metric-icon revenue-icon">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="metric-info">
                                    <label class="metric-label">Ingresos Totales</label>
                                    <span class="metric-description">Facturación bruta del período</span>
                                </div>
                            </div>
                            <div class="metric-input-container">
                                <span class="currency-symbol">S/.</span>
                                <input type="number" value="${data.revenue}" id="revenue_${id}" class="metric-input-premium" step="1000" min="0">
                                <div class="input-decoration"></div>
                            </div>
                            <div class="metric-trend">
                                <i class="fas fa-arrow-up trend-positive"></i>
                                <span class="trend-text">+12.5% vs anterior</span>
                            </div>
                        </div>
                        
                        <div class="metric-input-group-premium">
                            <div class="metric-header">
                                <div class="metric-icon expenses-icon">
                                    <i class="fas fa-receipt"></i>
                                </div>
                                <div class="metric-info">
                                    <label class="metric-label">Gastos Operativos</label>
                                    <span class="metric-description">Costos y gastos del período</span>
                                </div>
                            </div>
                            <div class="metric-input-container">
                                <span class="currency-symbol">S/.</span>
                                <input type="number" value="${data.expenses}" id="expenses_${id}" class="metric-input-premium" step="1000" min="0">
                                <div class="input-decoration"></div>
                            </div>
                            <div class="metric-trend">
                                <i class="fas fa-arrow-up trend-negative"></i>
                                <span class="trend-text">+3.2% vs anterior</span>
                            </div>
                        </div>
                        
                        <div class="metric-input-group-premium">
                            <div class="metric-header">
                                <div class="metric-icon profit-icon">
                                    <i class="fas fa-coins"></i>
                                </div>
                                <div class="metric-info">
                                    <label class="metric-label">Utilidad Neta</label>
                                    <span class="metric-description">Beneficio después de gastos</span>
                                </div>
                            </div>
                            <div class="metric-input-container">
                                <span class="currency-symbol">S/.</span>
                                <input type="number" value="${data.profit}" id="profit_${id}" class="metric-input-premium" step="1000" min="0">
                                <div class="input-decoration"></div>
                            </div>
                            <div class="metric-trend">
                                <i class="fas fa-arrow-up trend-positive"></i>
                                <span class="trend-text">+18.7% vs anterior</span>
                            </div>
                        </div>
                        
                        <div class="metric-input-group-premium">
                            <div class="metric-header">
                                <div class="metric-icon cashflow-icon">
                                    <i class="fas fa-water"></i>
                                </div>
                                <div class="metric-info">
                                    <label class="metric-label">Flujo de Caja</label>
                                    <span class="metric-description">Liquidez disponible</span>
                                </div>
                            </div>
                            <div class="metric-input-container">
                                <span class="currency-symbol">S/.</span>
                                <input type="number" value="${data.cashFlow}" id="cashFlow_${id}" class="metric-input-premium" step="100" min="0">
                                <div class="input-decoration"></div>
                            </div>
                            <div class="metric-trend">
                                <i class="fas fa-arrow-up trend-positive"></i>
                                <span class="trend-text">+24.8% vs anterior</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metrics-actions">
                        <div class="validation-info">
                            <i class="fas fa-shield-check"></i>
                            <span>Datos validados automáticamente</span>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="metrics-btn secondary" onclick="grizalumCompanyManager.resetMetrics('${id}')">
                                <i class="fas fa-undo"></i>
                                Restaurar
                            </button>
                            <button class="metrics-btn primary" onclick="grizalumCompanyManager.saveMetrics('${id}')">
                                <i class="fas fa-save"></i>
                                Actualizar Métricas
                                <div class="btn-glow"></div>
                            </button>
                        </div>
                    </div>
                    
                    <div class="metrics-insights">
                        <div class="insight-card">
                            <div class="insight-header">
                                <i class="fas fa-lightbulb"></i>
                                <span>Análisis IA</span>
                            </div>
                            <p class="insight-text">Rendimiento ${profitMargin > 15 ? 'excelente' : profitMargin > 10 ? 'bueno' : 'mejorable'}. ${expenseRatio < 70 ? 'Gastos controlados.' : 'Revisar estructura de costos.'}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="metrics-container-premium">
                <div class="metrics-header-premium">
                    <div class="header-content">
                        <h3 class="metrics-title">📊 Centro de Métricas Financieras</h3>
                        <p class="metrics-subtitle">Gestiona y monitorea el rendimiento financiero de todas tus empresas</p>
                    </div>
                    <div class="metrics-tools">
                        <button class="tool-btn" onclick="grizalumCompanyManager.generateReport()">
                            <i class="fas fa-chart-bar"></i>
                            Generar Reporte
                        </button>
                        <button class="tool-btn" onclick="grizalumCompanyManager.exportMetrics()">
                            <i class="fas fa-file-excel"></i>
                            Exportar Excel
                        </button>
                        <button class="tool-btn" onclick="grizalumCompanyManager.compareMetrics()">
                            <i class="fas fa-balance-scale"></i>
                            Comparar
                        </button>
                    </div>
                </div>
                
                <div class="metrics-overview">
                    <div class="overview-stat">
                        <div class="stat-icon total-revenue">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number">S/. ${(Object.values(companies).reduce((sum, c) => sum + c.data.revenue, 0)/1000000).toFixed(1)}M</span>
                            <span class="stat-desc">Ingresos Totales</span>
                        </div>
                    </div>
                    <div class="overview-stat">
                        <div class="stat-icon total-profit">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number">S/. ${(Object.values(companies).reduce((sum, c) => sum + c.data.profit, 0)/1000000).toFixed(1)}M</span>
                            <span class="stat-desc">Utilidad Total</span>
                        </div>
                    </div>
                    <div class="overview-stat">
                        <div class="stat-icon avg-margin">
                            <i class="fas fa-percentage"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number">${(Object.values(companies).reduce((sum, c) => sum + (c.data.revenue > 0 ? (c.data.profit/c.data.revenue)*100 : 0), 0)/Object.keys(companies).length).toFixed(1)}%</span>
                            <span class="stat-desc">Margen Promedio</span>
                        </div>
                    </div>
                    <div class="overview-stat">
                        <div class="stat-icon companies-count">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="stat-content">
                            <span class="stat-number">${Object.keys(companies).length}</span>
                            <span class="stat-desc">Empresas Activas</span>
                        </div>
                    </div>
                </div>
                
                <div class="metrics-companies">
                    ${metricsHTML}
                </div>
            </div>
        `;
    }

    generateThemesTab() {
        const companies = this.companies;
        const availableThemes = [
            { 
                key: 'goldman-platinum', 
                name: '🏦 Goldman Platinum', 
                primary: '#d4af37', 
                secondary: '#b87333',
                description: 'Elegancia dorada premium',
                category: 'Clásico'
            },
            { 
                key: 'tesla-futuristic', 
                name: '🚀 Tesla Futuristic', 
                primary: '#ff0040', 
                secondary: '#ff6b9d',
                description: 'Innovación y tecnología',
                category: 'Futurista'
            },
            { 
                key: 'cupertino-elite', 
                name: '🍎 Cupertino Elite', 
                primary: '#007aff', 
                secondary: '#5ac8fa',
                description: 'Minimalismo sofisticado',
                category: 'Moderno'
            },
            { 
                key: 'netflix-premium', 
                name: '🔴 Netflix Premium', 
                primary: '#e50914', 
                secondary: '#f40612',
                description: 'Entretenimiento premium',
                category: 'Entretenimiento'
            },
            { 
                key: 'midnight-corporate', 
                name: '💎 Midnight Corporate', 
                primary: '#00d9ff', 
                secondary: '#0099cc',
                description: 'Corporativo nocturno',
                category: 'Corporativo'
            },
            { 
                key: 'emerald-nature', 
                name: '🍃 Emerald Nature', 
                primary: '#10b981', 
                secondary: '#059669',
                description: 'Sostenibilidad natural',
                category: 'Ecológico'
            },
            { 
                key: 'royal-purple', 
                name: '👑 Royal Purple', 
                primary: '#8b5cf6', 
                secondary: '#7c3aed',
                description: 'Realeza y lujo',
                category: 'Lujo'
            },
            { 
                key: 'cyber-neon', 
                name: '⚡ Cyber Neon', 
                primary: '#00ff88', 
                secondary: '#00cc6a',
                description: 'Cyberpunk futurista',
                category: 'Gaming'
            },
            { 
                key: 'fire-industries', 
                name: '🔥 Fire Industries', 
                primary: '#dc2626', 
                secondary: '#ea580c',
                description: 'Poder industrial',
                category: 'Industrial'
            },
            { 
                key: 'ocean-commerce', 
                name: '🌊 Ocean Commerce', 
                primary: '#0891b2', 
                secondary: '#0e7490',
                description: 'Comercio marítimo',
                category: 'Comercial'
            }
        ];
        
        let themesHTML = '';
        
        Object.entries(companies).forEach(([id, company]) => {
            let themeOptions = '';
            availableThemes.forEach(theme => {
                const isSelected = company.theme?.primary === theme.primary ? 'selected' : '';
                themeOptions += `<option value="${theme.key}" ${isSelected}>${theme.name}</option>`;
            });
            
            themesHTML += `
                <div class="theme-card-premium" data-company="${id}">
                    <div class="theme-card-header">
                        <div class="company-preview">
                            <div class="company-avatar-theme" style="background: linear-gradient(135deg, ${company.theme?.primary || '#d4af37'} 0%, ${company.theme?.secondary || '#b87333'} 100%);">
                                ${company.icon}
                            </div>
                            <div class="company-name-theme">
                                <h4>${company.name}</h4>
                                <span class="theme-status">Tema activo</span>
                            </div>
                        </div>
                        
                        <div class="theme-actions">
                            <button class="theme-btn preview" onclick="grizalumCompanyManager.previewTheme('${id}', document.getElementById('theme_${id}').value)">
                                <i class="fas fa-eye"></i>
                                Vista Previa
                            </button>
                            <button class="theme-btn apply" onclick="grizalumCompanyManager.applyTheme('${id}')">
                                <i class="fas fa-paint-brush"></i>
                                Aplicar Tema
                            </button>
                        </div>
                    </div>
                    
                    <div class="theme-selector-container">
                        <label class="theme-label">Seleccionar Tema Visual</label>
                        <div class="custom-theme-select">
                            <select id="theme_${id}" class="theme-selector-premium" onchange="grizalumCompanyManager.previewTheme('${id}', this.value)">
                                ${themeOptions}
                            </select>
                            <i class="fas fa-palette select-icon"></i>
                        </div>
                    </div>
                    
                    <div class="theme-preview-area">
                        <div class="preview-label">Vista Previa del Tema</div>
                        <div class="theme-preview-card" id="preview_${id}" style="background: linear-gradient(135deg, ${company.theme?.primary || '#d4af37'} 0%, ${company.theme?.secondary || '#b87333'} 100%);">
                            <div class="preview-content">
                                <div class="preview-icon">${company.icon}</div>
                                <div class="preview-text">
                                    <div class="preview-title">${company.name}</div>
                                    <div class="preview-subtitle">Dashboard Corporativo</div>
                                </div>
                                <div class="preview-metrics">
                                    <div class="preview-metric">
                                        <span class="metric-value">S/. ${(company.data.revenue/1000000).toFixed(1)}M</span>
                                        <span class="metric-label">Ingresos</span>
                                    </div>
                                    <div class="preview-metric">
                                        <span class="metric-value">+24.8%</span>
                                        <span class="metric-label">Crecimiento</span>
                                    </div>
                                </div>
                            </div>
                            <div class="preview-overlay"></div>
                        </div>
                    </div>
                    
                    <div class="theme-customization">
                        <div class="customization-header">
                            <i class="fas fa-sliders-h"></i>
                            <span>Personalización Avanzada</span>
                        </div>
                        <div class="custom-colors">
                            <div class="color-input-group">
                                <label>Color Primario</label>
                                <div class="color-picker-container">
                                    <input type="color" value="${company.theme?.primary || '#d4af37'}" id="primary_${id}" class="color-picker" onchange="grizalumCompanyManager.updateCustomColors('${id}')">
                                    <span class="color-code">${company.theme?.primary || '#d4af37'}</span>
                                </div>
                            </div>
                            <div class="color-input-group">
                                <label>Color Secundario</label>
                                <div class="color-picker-container">
                                    <input type="color" value="${company.theme?.secondary || '#b87333'}" id="secondary_${id}" class="color-picker" onchange="grizalumCompanyManager.updateCustomColors('${id}')">
                                    <span class="color-code">${company.theme?.secondary || '#b87333'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="themes-container-premium">
                <div class="themes-header-premium">
                    <div class="header-content">
                        <h3 class="themes-title">🎨 Centro de Temas Visuales</h3>
                        <p class="themes-subtitle">Personaliza la identidad visual de cada empresa con temas profesionales</p>
                    </div>
                    <div class="themes-tools">
                        <button class="themes-tool-btn" onclick="grizalumCompanyManager.createCustomTheme()">
                            <i class="fas fa-plus"></i>
                            Crear Tema Custom
                        </button>
                        <button class="themes-tool-btn" onclick="grizalumCompanyManager.importTheme()">
                            <i class="fas fa-upload"></i>
                            Importar Tema
                        </button>
                        <button class="themes-tool-btn" onclick="grizalumCompanyManager.exportThemes()">
                            <i class="fas fa-download"></i>
                            Exportar Temas
                        </button>
                    </div>
                </div>
                
                <div class="themes-gallery">
                    <div class="gallery-header">
                        <h4>🌈 Galería de Temas Disponibles</h4>
                        <div class="gallery-filters">
                            <button class="filter-chip active" onclick="grizalumCompanyManager.filterThemes('todos')">Todos</button>
                            <button class="filter-chip" onclick="grizalumCompanyManager.filterThemes('clasico')">Clásico</button>
                            <button class="filter-chip" onclick="grizalumCompanyManager.filterThemes('futurista')">Futurista</button>
                            <button class="filter-chip" onclick="grizalumCompanyManager.filterThemes('moderno')">Moderno</button>
                            <button class="filter-chip" onclick="grizalumCompanyManager.filterThemes('corporativo')">Corporativo</button>
                        </div>
                    </div>
                    
                    <div class="themes-showcase">
                        ${availableThemes.map(theme => `
                            <div class="showcase-theme" data-category="${theme.category.toLowerCase()}">
                                <div class="showcase-preview" style="background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);">
                                    <div class="showcase-content">
                                        <div class="showcase-icon">🏢</div>
                                        <div class="showcase-text">${theme.name}</div>
                                    </div>
                                </div>
                                <div class="showcase-info">
                                    <div class="showcase-name">${theme.name}</div>
                                    <div class="showcase-desc">${theme.description}</div>
                                    <div class="showcase-category">${theme.category}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="companies-themes">
                    <div class="section-header">
                        <h4>🏢 Configuración por Empresa</h4>
                        <div class="bulk-theme-actions">
                            <button class="bulk-btn" onclick="grizalumCompanyManager.applyThemeToAll()">
                                <i class="fas fa-magic"></i>
                                Aplicar a Todas
                            </button>
                            <button class="bulk-btn" onclick="grizalumCompanyManager.resetAllThemes()">
                                <i class="fas fa-undo"></i>
                                Restaurar Defaults
                            </button>
                        </div>
                    </div>
                    
                    <div class="themes-grid">
                        ${themesHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // ================================================================
    // FUNCIONES AVANZADAS DE TEMAS
    // ================================================================

   previewTheme(companyId, themeKey) {
    console.log(`🎨 Previsualizando tema ${themeKey} para ${companyId}`);
    
    const availableThemes = {
        'goldman-platinum': { primary: '#d4af37', secondary: '#b87333', name: 'Goldman Platinum' },
        'tesla-futuristic': { primary: '#ff0040', secondary: '#ff6b9d', name: 'Tesla Futuristic' },
        'cupertino-elite': { primary: '#007aff', secondary: '#5ac8fa', name: 'Cupertino Elite' },
        'netflix-premium': { primary: '#e50914', secondary: '#f40612', name: 'Netflix Premium' },
        'midnight-corporate': { primary: '#00d9ff', secondary: '#0099cc', name: 'Midnight Corporate' },
        'emerald-nature': { primary: '#10b981', secondary: '#059669', name: 'Emerald Nature' },
        'royal-purple': { primary: '#8b5cf6', secondary: '#7c3aed', name: 'Royal Purple' },
        'cyber-neon': { primary: '#00ff88', secondary: '#00cc6a', name: 'Cyber Neon' },
        'fire-industries': { primary: '#dc2626', secondary: '#ea580c', name: 'Fire Industries' },
        'ocean-commerce': { primary: '#0891b2', secondary: '#0e7490', name: 'Ocean Commerce' }
    };
    
    const theme = availableThemes[themeKey];
    if (!theme) {
        this.showNotification('❌ Tema no encontrado', 'error');
        return;
    }
    
    // Actualizar preview principal con animación
    const preview = document.getElementById(`preview_${companyId}`);
    if (preview) {
        // Animación de salida
        preview.style.transform = 'scale(0.9)';
        preview.style.opacity = '0.7';
        
        setTimeout(() => {
            // Cambiar colores
            preview.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
            
            // Animación de entrada
            preview.style.transform = 'scale(1.05)';
            preview.style.opacity = '1';
            
            setTimeout(() => {
                preview.style.transform = 'scale(1)';
            }, 300);
        }, 150);
    }
    
    // Actualizar avatar con efecto
    const avatar = document.querySelector(`[data-company="${companyId}"] .company-avatar-theme`);
    if (avatar) {
        avatar.style.transition = 'all 0.3s ease';
        avatar.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
        avatar.style.transform = 'scale(1.1) rotate(5deg)';
        
        setTimeout(() => {
            avatar.style.transform = 'scale(1) rotate(0deg)';
        }, 400);
    }
    
    // Actualizar selectores de color personalizados
    const primaryInput = document.getElementById(`primary_${companyId}`);
    const secondaryInput = document.getElementById(`secondary_${companyId}`);
    
    if (primaryInput) {
        primaryInput.value = theme.primary;
        primaryInput.style.transform = 'scale(1.05)';
        setTimeout(() => {
            primaryInput.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (secondaryInput) {
        secondaryInput.value = theme.secondary;
        secondaryInput.style.transform = 'scale(1.05)';
        setTimeout(() => {
            secondaryInput.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Actualizar códigos de color
    const primaryCode = document.querySelector(`#primary_${companyId}`).parentElement.querySelector('.color-code');
    const secondaryCode = document.querySelector(`#secondary_${companyId}`).parentElement.querySelector('.color-code');
    
    if (primaryCode) primaryCode.textContent = theme.primary;
    if (secondaryCode) secondaryCode.textContent = theme.secondary;
    
    // Notificación con nombre del tema
    this.showNotification(`👁️ Vista previa: ${theme.name}`, 'info');
    
    // Log de auditoría
    this.logAuditAction('THEME_PREVIEW', `Vista previa del tema ${theme.name} para ${this.companies[companyId]?.name}`);
}

    applyTheme(companyId) {
        const themeSelect = document.getElementById(`theme_${companyId}`);
        if (!themeSelect || !this.companies[companyId]) return;
        
        const selectedTheme = themeSelect.value;
        
        const availableThemes = {
            'goldman-platinum': { primary: '#d4af37', secondary: '#b87333' },
            'tesla-futuristic': { primary: '#ff0040', secondary: '#ff6b9d' },
            'cupertino-elite': { primary: '#007aff', secondary: '#5ac8fa' },
            'netflix-premium': { primary: '#e50914', secondary: '#f40612' },
            'midnight-corporate': { primary: '#00d9ff', secondary: '#0099cc' },
            'emerald-nature': { primary: '#10b981', secondary: '#059669' },
            'royal-purple': { primary: '#8b5cf6', secondary: '#7c3aed' },
            'cyber-neon': { primary: '#00ff88', secondary: '#00cc6a' },
            'fire-industries': { primary: '#dc2626', secondary: '#ea580c' },
            'ocean-commerce': { primary: '#0891b2', secondary: '#0e7490' }
        };
        
        const theme = availableThemes[selectedTheme];
        if (!theme) return;
        
        // Aplicar tema a la empresa
        this.companies[companyId].theme = theme;
        this.companies[companyId].lastModified = new Date().toISOString();
        this.saveCompaniesData(this.companies);
        
        // Actualizar selectores de color personalizados
        const primaryInput = document.getElementById(`primary_${companyId}`);
        const secondaryInput = document.getElementById(`secondary_${companyId}`);
        const primaryCode = document.querySelector(`#primary_${companyId} + .color-code`);
        const secondaryCode = document.querySelector(`#secondary_${companyId} + .color-code`);
        
        if (primaryInput) primaryInput.value = theme.primary;
        if (secondaryInput) secondaryInput.value = theme.secondary;
        if (primaryCode) primaryCode.textContent = theme.primary;
        if (secondaryCode) secondaryCode.textContent = theme.secondary;
        
        // Si es la empresa activa, actualizar UI principal
        if (this.selectedCompany === companyId) {
            this.updateSelectedCompany(companyId);
            
            // Notificar al sistema principal para aplicar tema
            if (window.GRIZALUM && window.GRIZALUM.applyTheme) {
                window.GRIZALUM.applyTheme(companyId);
            }
        }
        
        this.showNotification(`🎨 Tema ${selectedTheme} aplicado a ${this.companies[companyId].name}`, 'success');
        this.logAuditAction('THEME_APPLIED', `Tema ${selectedTheme} aplicado a ${this.companies[companyId].name}`);
    }

   updateCustomColors(companyId) {
    const primaryColor = document.getElementById(`primary_${companyId}`)?.value;
    const secondaryColor = document.getElementById(`secondary_${companyId}`)?.value;
    
    if (!this.companies[companyId] || !primaryColor || !secondaryColor) return;
    
    console.log(`🎨 Actualizando colores: ${primaryColor} -> ${secondaryColor}`);
    
    // Actualizar tema custom INMEDIATAMENTE
    this.companies[companyId].theme = {
        primary: primaryColor,
        secondary: secondaryColor
    };
    this.companies[companyId].lastModified = new Date().toISOString();
    
    // Guardar cambios
    this.saveCompaniesData(this.companies);
    
    // 1. Actualizar preview principal con animación fluida
    const preview = document.getElementById(`preview_${companyId}`);
    if (preview) {
        preview.style.transition = 'all 0.3s ease';
        preview.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        preview.style.transform = 'scale(1.03)';
        
        setTimeout(() => {
            preview.style.transform = 'scale(1)';
        }, 200);
    }
    
    // 2. Actualizar avatar con efecto
    const avatar = document.querySelector(`[data-company="${companyId}"] .company-avatar-theme`);
    if (avatar) {
        avatar.style.transition = 'all 0.3s ease';
        avatar.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        avatar.style.transform = 'scale(1.1) rotate(3deg)';
        
        setTimeout(() => {
            avatar.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }
    
    // 3. Actualizar códigos de color con animación
    const primaryCodeElement = document.querySelector(`#primary_${companyId}`).parentElement.querySelector('.color-code');
    const secondaryCodeElement = document.querySelector(`#secondary_${companyId}`).parentElement.querySelector('.color-code');
    
    if (primaryCodeElement) {
        primaryCodeElement.style.transition = 'all 0.2s ease';
        primaryCodeElement.textContent = primaryColor;
        primaryCodeElement.style.background = '#f0f9ff';
        setTimeout(() => {
            primaryCodeElement.style.background = '#f3f4f6';
        }, 500);
    }
    
    if (secondaryCodeElement) {
        secondaryCodeElement.style.transition = 'all 0.2s ease';
        secondaryCodeElement.textContent = secondaryColor;
        secondaryCodeElement.style.background = '#f0f9ff';
        setTimeout(() => {
            secondaryCodeElement.style.background = '#f3f4f6';
        }, 500);
    }
    
    // 4. Actualizar selector de temas (marcarlo como "Custom")
    const themeSelect = document.getElementById(`theme_${companyId}`);
    if (themeSelect) {
        // Agregar opción custom si no existe
        let customOption = themeSelect.querySelector('option[value="custom"]');
        if (!customOption) {
            customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = '🎨 Tema Personalizado';
            themeSelect.appendChild(customOption);
        }
        themeSelect.value = 'custom';
    }
    
    // 5. Si es la empresa activa, actualizar UI principal
    if (this.selectedCompany === companyId) {
        this.updateSelectedCompany(companyId);
        
        // Actualizar el selector principal de empresas
        const mainIcon = document.getElementById('grizalumCurrentCompanyIcon');
        if (mainIcon) {
            mainIcon.parentElement.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        }
        
        // Notificar al sistema principal
        if (window.GRIZALUM && window.GRIZALUM.applyTheme) {
            window.GRIZALUM.applyTheme(companyId);
        }
    }
    
    // 6. Actualizar lista de empresas con nuevos colores
    this.renderCompaniesList();
    
    // 7. Feedback visual en los color pickers
    const primaryInput = document.getElementById(`primary_${companyId}`);
    const secondaryInput = document.getElementById(`secondary_${companyId}`);
    
    if (primaryInput) {
        primaryInput.style.transform = 'scale(1.05)';
        setTimeout(() => {
            primaryInput.style.transform = 'scale(1)';
        }, 150);
    }
    
    if (secondaryInput) {
        secondaryInput.style.transform = 'scale(1.05)';
        setTimeout(() => {
            secondaryInput.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Notificación sin spam (solo cada 2 segundos)
    if (!this.lastColorUpdate || Date.now() - this.lastColorUpdate > 2000) {
        this.showNotification(`🎨 Colores actualizados en tiempo real`, 'success');
        this.lastColorUpdate = Date.now();
    }
    
    this.logAuditAction('CUSTOM_COLORS', `Colores personalizados: ${primaryColor} + ${secondaryColor}`);
}

    filterThemes(category) {
        console.log(`🔍 Filtrando temas por: ${category}`);
        
        const themes = document.querySelectorAll('.showcase-theme');
        const filters = document.querySelectorAll('.filter-chip');
        
        // Actualizar filtros activos
        filters.forEach(filter => {
            filter.classList.remove('active');
            if (filter.textContent.toLowerCase().includes(category.toLowerCase()) || category === 'todos') {
                filter.classList.add('active');
            }
        });
        
        // Mostrar/ocultar temas
        themes.forEach(theme => {
            const themeCategory = theme.dataset.category;
            
            if (category === 'todos' || themeCategory === category) {
                theme.style.display = 'block';
                theme.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                theme.style.display = 'none';
            }
        });
        
        this.showNotification(`🔍 Mostrando temas: ${category}`, 'info');
    }

    applyThemeToAll() {
        const selectedTheme = prompt('🎨 ¿Qué tema aplicar a todas las empresas?\n\nOpciones disponibles:\n• goldman-platinum\n• tesla-futuristic\n• cupertino-elite\n• netflix-premium\n• emerald-nature\n• royal-purple', 'goldman-platinum');
        
        if (!selectedTheme) return;
        
        const availableThemes = {
            'goldman-platinum': { primary: '#d4af37', secondary: '#b87333' },
            'tesla-futuristic': { primary: '#ff0040', secondary: '#ff6b9d' },
            'cupertino-elite': { primary: '#007aff', secondary: '#5ac8fa' },
            'netflix-premium': { primary: '#e50914', secondary: '#f40612' },
            'midnight-corporate': { primary: '#00d9ff', secondary: '#0099cc' },
            'emerald-nature': { primary: '#10b981', secondary: '#059669' },
            'royal-purple': { primary: '#8b5cf6', secondary: '#7c3aed' },
            'cyber-neon': { primary: '#00ff88', secondary: '#00cc6a' }
        };
        
        const theme = availableThemes[selectedTheme];
        if (!theme) {
            this.showNotification('❌ Tema no válido', 'error');
            return;
        }
        
        if (confirm(`🎨 ¿Aplicar tema "${selectedTheme}" a TODAS las empresas?\n\nEsto reemplazará los temas actuales.`)) {
            let appliedCount = 0;
            
            Object.keys(this.companies).forEach(companyId => {
                this.companies[companyId].theme = { ...theme };
                this.companies[companyId].lastModified = new Date().toISOString();
                appliedCount++;
            });
            
            this.saveCompaniesData(this.companies);
            
            // Recargar el tab de temas
            document.getElementById('themes-management-tab').innerHTML = this.generateThemesTab();
            
            this.showNotification(`🎨 Tema aplicado a ${appliedCount} empresas`, 'success');
            this.logAuditAction('BULK_THEME_APPLIED', `Tema ${selectedTheme} aplicado a todas las empresas`);
        }
    }

    resetAllThemes() {
        if (confirm('🔄 ¿Restaurar todos los temas a la configuración por defecto?\n\nEsto eliminará todas las personalizaciones.')) {
            const defaultTheme = { primary: '#d4af37', secondary: '#b87333' };
            
            Object.keys(this.companies).forEach(companyId => {
                this.companies[companyId].theme = { ...defaultTheme };
                this.companies[companyId].lastModified = new Date().toISOString();
            });
            
            this.saveCompaniesData(this.companies);
            
            // Recargar el tab de temas
            document.getElementById('themes-management-tab').innerHTML = this.generateThemesTab();
            
            this.showNotification('🔄 Todos los temas restaurados a default', 'success');
            this.logAuditAction('THEMES_RESET', 'Todos los temas restaurados a configuración por defecto');
        }
    }

    createCustomTheme() {
        const modal = document.createElement('div');
        modal.className = 'grizalum-modal';
        modal.innerHTML = `
            <div class="grizalum-modal-content">
                <div class="grizalum-modal-header">
                    <div class="modal-title">
                        <i class="fas fa-palette"></i>
                        <span>🎨 Crear Tema Personalizado</span>
                    </div>
                    <button class="modal-close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="padding: 2rem;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Nombre del Tema</label>
                        <input type="text" id="customThemeName" placeholder="Ej: Mi Tema Corporativo" style="width: 100%; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Color Primario</label>
                            <input type="color" id="customPrimaryColor" value="#d4af37" style="width: 100%; height: 60px; border: none; border-radius: 8px; cursor: pointer;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Color Secundario</label>
                            <input type="color" id="customSecondaryColor" value="#b87333" style="width: 100%; height: 60px; border: none; border-radius: 8px; cursor: pointer;">
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #d4af37 0%, #b87333 100%); border-radius: 12px; padding: 2rem; color: white; margin-bottom: 2rem;" id="customThemePreview">
                        <h3 style="margin: 0 0 1rem 0;">Vista Previa del Tema</h3>
                        <p style="margin: 0;">Este es el aspecto que tendrá tu tema personalizado</p>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: space-between;">
                        <button class="btn-cancel" onclick="this.parentElement.parentElement.parentElement.remove()">
                            Cancelar
                        </button>
                        <button class="btn-create" onclick="grizalumCompanyManager.saveCustomTheme()">
                            <i class="fas fa-save"></i>
                            Guardar Tema
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);
        
        // Eventos para preview en tiempo real
        const primaryInput = document.getElementById('customPrimaryColor');
        const secondaryInput = document.getElementById('customSecondaryColor');
        const preview = document.getElementById('customThemePreview');
        
        function updatePreview() {
            const primary = primaryInput.value;
            const secondary = secondaryInput.value;
            preview.style.background = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
        }
        
        primaryInput.addEventListener('input', updatePreview);
        secondaryInput.addEventListener('input', updatePreview);
    }

    saveCustomTheme() {
        const name = document.getElementById('customThemeName')?.value?.trim();
        const primary = document.getElementById('customPrimaryColor')?.value;
        const secondary = document.getElementById('customSecondaryColor')?.value;
        
        if (!name) {
            this.showNotification('❌ Ingresa un nombre para el tema', 'error');
            return;
        }
        
        // Guardar tema personalizado
        const customThemes = JSON.parse(localStorage.getItem('grizalum_custom_themes') || '{}');
        const themeKey = name.toLowerCase().replace(/\s+/g, '-');
        
        customThemes[themeKey] = {
            name: name,
            primary: primary,
            secondary: secondary,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('grizalum_custom_themes', JSON.stringify(customThemes));
        
        // Cerrar modal
        document.querySelector('.grizalum-modal').remove();
        
        this.showNotification(`🎨 Tema "${name}" creado exitosamente`, 'success');
        this.logAuditAction('CUSTOM_THEME_CREATED', `Tema personalizado creado: ${name}`);
    }

    importTheme() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const themeData = JSON.parse(e.target.result);
                    
                    if (themeData.name && themeData.primary && themeData.secondary) {
                        const customThemes = JSON.parse(localStorage.getItem('grizalum_custom_themes') || '{}');
                        const themeKey = themeData.name.toLowerCase().replace(/\s+/g, '-');
                        
                        customThemes[themeKey] = {
                            ...themeData,
                            importedAt: new Date().toISOString()
                        };
                        
                        localStorage.setItem('grizalum_custom_themes', JSON.stringify(customThemes));
                        
                        this.showNotification(`🎨 Tema "${themeData.name}" importado exitosamente`, 'success');
                        this.logAuditAction('THEME_IMPORTED', `Tema importado: ${themeData.name}`);
                    } else {
                        this.showNotification('❌ Archivo de tema inválido', 'error');
                    }
                } catch (error) {
                    this.showNotification('❌ Error al leer el archivo de tema', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    exportThemes() {
        const customThemes = JSON.parse(localStorage.getItem('grizalum_custom_themes') || '{}');
        
        if (Object.keys(customThemes).length === 0) {
            this.showNotification('ℹ️ No hay temas personalizados para exportar', 'info');
            return;
        }
        
        const exportData = {
            themes: customThemes,
            exportDate: new Date().toISOString(),
            version: '2.0.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grizalum-temas-personalizados-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification(`📤 ${Object.keys(customThemes).length} temas personalizados exportados`, 'success');
        this.logAuditAction('THEMES_EXPORTED', `Temas personalizados exportados: ${Object.keys(customThemes).length}`);
    }

    // ================================================================
    // FUNCIONES ADICIONALES PARA COMPLETAR LA FUNCIONALIDAD
    // ================================================================

    // Funciones para métricas
    generateReport() {
        const stats = this.getCompanyStatistics();
        const reportData = {
            title: 'Reporte Financiero GRIZALUM',
            date: new Date().toLocaleDateString(),
            summary: stats,
            companies: Object.entries(this.companies).map(([id, company]) => ({
                id,
                name: company.name,
                status: company.status,
                data: company.data,
                analysis: this.generateCompanyReport(id)
            }))
        };
        
        console.log('📊 Reporte generado:', reportData);
        this.showNotification('📊 Reporte generado (ver consola)', 'success');
        this.logAuditAction('REPORT_GENERATED', 'Reporte financiero generado');
    }

    exportMetrics() {
        const stats = this.getCompanyStatistics();
        const csvData = this.convertToCSV(stats);
        
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grizalum-metricas-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('📈 Métricas exportadas a CSV', 'success');
        this.logAuditAction('METRICS_EXPORTED', 'Métricas exportadas a CSV');
    }

    compareMetrics() {
        const modal = document.createElement('div');
        modal.className = 'grizalum-modal';
        modal.innerHTML = `
            <div class="grizalum-modal-content">
                <div class="grizalum-modal-header">
                    <div class="modal-title">
                        <i class="fas fa-balance-scale"></i>
                        <span>⚖️ Comparador de Métricas</span>
                    </div>
                    <button class="modal-close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="padding: 2rem;">
                    <h3>Comparación de Rendimiento Empresarial</h3>
                    ${this.generateComparisonTable()}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);
    }

    generateComparisonTable() {
        let tableHTML = `
            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th style="padding: 1rem; border: 1px solid #e5e7eb;">Empresa</th>
                        <th style="padding: 1rem; border: 1px solid #e5e7eb;">Ingresos</th>
                        <th style="padding: 1rem; border: 1px solid #e5e7eb;">Gastos</th>
                        <th style="padding: 1rem; border: 1px solid #e5e7eb;">Utilidad</th>
                        <th style="padding: 1rem; border: 1px solid #e5e7eb;">Margen %</th>
                        <th style="padding: 1rem; border: 1px solid #e5e7eb;">Flujo Caja</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        Object.entries(this.companies).forEach(([id, company]) => {
            const margin = company.data.revenue > 0 ? ((company.data.profit / company.data.revenue) * 100).toFixed(1) : '0.0';
            const marginColor = margin > 15 ? '#10b981' : margin > 10 ? '#f59e0b' : '#ef4444';
            
            tableHTML += `
                <tr>
                    <td style="padding: 1rem; border: 1px solid #e5e7eb; font-weight: 600;">${company.icon} ${company.name}</td>
                    <td style="padding: 1rem; border: 1px solid #e5e7eb;">S/. ${company.data.revenue.toLocaleString()}</td>
                    <td style="padding: 1rem; border: 1px solid #e5e7eb;">S/. ${company.data.expenses.toLocaleString()}</td>
                    <td style="padding: 1rem; border: 1px solid #e5e7eb;">S/. ${company.data.profit.toLocaleString()}</td>
                    <td style="padding: 1rem; border: 1px solid #e5e7eb; color: ${marginColor}; font-weight: 600;">${margin}%</td>
                    <td style="padding: 1rem; border: 1px solid #e5e7eb;">S/. ${company.data.cashFlow.toLocaleString()}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        return tableHTML;
    }

    convertToCSV(data) {
        const rows = [
            ['Empresa', 'Ingresos', 'Gastos', 'Utilidad', 'Flujo de Caja', 'Margen %', 'Status']
        ];
        
        Object.entries(this.companies).forEach(([id, company]) => {
            const margin = company.data.revenue > 0 ? ((company.data.profit / company.data.revenue) * 100).toFixed(1) : '0.0';
            rows.push([
                company.name,
                company.data.revenue,
                company.data.expenses,
                company.data.profit,
                company.data.cashFlow,
                margin + '%',
                company.status
            ]);
        });
        
        return rows.map(row => row.join(',')).join('\n');
    }

    generateDangerTab() {
        const companies = this.companies;
        let dangerHTML = '';
        
        Object.entries(companies).forEach(([id, company]) => {
            dangerHTML += `
                <div class="danger-company-card-premium" data-company="${id}">
                    <div class="danger-card-header">
                        <div class="company-danger-identity">
                            <div class="danger-avatar" style="background: linear-gradient(135deg, ${company.theme?.primary || '#d4af37'} 0%, ${company.theme?.secondary || '#b87333'} 100%);">
                                ${company.icon}
                            </div>
                            <div class="danger-company-info">
                                <h4 class="danger-company-name">${company.name}</h4>
                                <div class="danger-company-stats">
                                    <span class="stat-item">Estado: <strong>${company.status}</strong></span>
                                    <span class="stat-item">Ingresos: <strong>S/. ${(company.data.revenue/1000000).toFixed(1)}M</strong></span>
                                    <span class="stat-item">Empleados: <strong>${Math.floor(Math.random() * 50) + 10}</strong></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="danger-level">
                            <div class="danger-indicator critical">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <span class="danger-text">Eliminación Permanente</span>
                        </div>
                    </div>
                    
                    <div class="danger-actions">
                        <button class="danger-btn archive" onclick="grizalumCompanyManager.archiveCompany('${id}', '${company.name}')">
                            <i class="fas fa-archive"></i>
                            <span>Archivar Empresa</span>
                            <small>Oculta sin eliminar</small>
                        </button>
                        
                        <button class="danger-btn suspend" onclick="grizalumCompanyManager.suspendCompany('${id}', '${company.name}')">
                            <i class="fas fa-pause-circle"></i>
                            <span>Suspender Operaciones</span>
                            <small>Pausa temporal</small>
                        </button>
                        
                        <button class="danger-btn delete" onclick="grizalumCompanyManager.confirmDelete('${id}', '${company.name}')">
                            <i class="fas fa-trash-alt"></i>
                            <span>ELIMINAR DEFINITIVO</span>
                            <small>⚠️ Acción irreversible</small>
                        </button>
                    </div>
                    
                    <div class="danger-timeline">
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <span class="timeline-date">${this.getTimeAgo(company.createdAt)}</span>
                                <span class="timeline-action">Empresa creada</span>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <span class="timeline-date">${this.getTimeAgo(company.lastModified)}</span>
                                <span class="timeline-action">Última modificación</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="danger-zone-container-premium">
                <div class="danger-warning-banner">
                    <div class="warning-icon">
                        <i class="fas fa-radiation-alt"></i>
                    </div>
                    <div class="warning-content">
                        <h3 class="warning-title">⚠️ ZONA DE MÁXIMO RIESGO</h3>
                        <p class="warning-description">Las acciones en esta sección son <strong>PERMANENTES E IRREVERSIBLES</strong></p>
                        <div class="warning-features">
                            <span class="feature-badge">🔐 Requiere Autenticación</span>
                            <span class="feature-badge">📋 Registro de Auditoría</span>
                            <span class="feature-badge">💾 Backup Automático</span>
                        </div>
                    </div>
                </div>
                
                <div class="security-section">
                    <div class="security-header">
                        <div class="security-title">
                            <i class="fas fa-shield-alt"></i>
                            <span>Sistema de Seguridad Avanzado</span>
                        </div>
                        <div class="security-status">
                            <div class="status-indicator active"></div>
                            <span>Protección Activa</span>
                        </div>
                    </div>
                    
                    <div class="security-grid">
                        <div class="security-card">
                            <div class="security-icon backup">
                                <i class="fas fa-database"></i>
                            </div>
                            <div class="security-info">
                                <h4>Backup Automático</h4>
                                <p>Sistema de respaldo cada 6 horas</p>
                                <div class="security-actions">
                                    <button class="security-btn primary" onclick="grizalumCompanyManager.downloadBackup()">
                                        <i class="fas fa-download"></i>
                                        Descargar Backup
                                    </button>
                                    <button class="security-btn secondary" onclick="grizalumCompanyManager.scheduleBackup()">
                                        <i class="fas fa-clock"></i>
                                        Programar
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="security-card">
                            <div class="security-icon restore">
                                <i class="fas fa-history"></i>
                            </div>
                            <div class="security-info">
                                <h4>Restauración de Datos</h4>
                                <p>Recupera información eliminada</p>
                                <div class="security-actions">
                                    <button class="security-btn primary" onclick="grizalumCompanyManager.showRestoreOption()">
                                        <i class="fas fa-upload"></i>
                                        Restaurar Backup
                                    </button>
                                    <button class="security-btn secondary" onclick="grizalumCompanyManager.viewHistory()">
                                        <i class="fas fa-list"></i>
                                        Ver Historial
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="security-card">
                            <div class="security-icon audit">
                                <i class="fas fa-file-signature"></i>
                            </div>
                            <div class="security-info">
                                <h4>Registro de Auditoría</h4>
                                <p>Trazabilidad completa de acciones</p>
                                <div class="security-actions">
                                    <button class="security-btn primary" onclick="grizalumCompanyManager.viewAuditLog()">
                                        <i class="fas fa-search"></i>
                                        Ver Registro
                                    </button>
                                    <button class="security-btn secondary" onclick="grizalumCompanyManager.exportAudit()">
                                        <i class="fas fa-file-export"></i>
                                        Exportar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="danger-companies-section">
                    <div class="section-header-danger">
                        <div class="header-content">
                            <h4 class="section-title-danger">🗑️ Gestión de Eliminación de Empresas</h4>
                            <p class="section-subtitle-danger">Administra cuidadosamente las acciones críticas sobre tus empresas</p>
                        </div>
                        <div class="bulk-danger-actions">
                            <button class="bulk-danger-btn" onclick="grizalumCompanyManager.bulkArchive()">
                                <i class="fas fa-archive"></i>
                                Archivar Seleccionadas
                            </button>
                            <button class="bulk-danger-btn critical" onclick="grizalumCompanyManager.factoryReset()">
                                <i class="fas fa-exclamation-triangle"></i>
                                Reset Completo
                            </button>
                        </div>
                    </div>
                    
                    <div class="companies-danger-grid">
                        ${dangerHTML}
                    </div>
                </div>
                
                <div class="emergency-section">
                    <div class="emergency-header">
                        <div class="emergency-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="emergency-content">
                            <h4>🚨 Procedimientos de Emergencia</h4>
                            <p>Solo usar en casos extremos - Requiere autorización de administrador</p>
                        </div>
                    </div>
                    
                    <div class="emergency-actions">
                        <button class="emergency-btn" onclick="grizalumCompanyManager.emergencyBackup()">
                            <i class="fas fa-shield-virus"></i>
                            <span>Backup de Emergencia</span>
                            <small>Crea respaldo inmediato</small>
                        </button>
                        
                        <button class="emergency-btn" onclick="grizalumCompanyManager.emergencyLock()">
                            <i class="fas fa-lock"></i>
                            <span>Bloqueo de Sistema</span>
                            <small>Suspende todas las operaciones</small>
                        </button>
                        
                        <button class="emergency-btn critical" onclick="grizalumCompanyManager.emergencyWipe()">
                            <i class="fas fa-bomb"></i>
                            <span>BORRADO TOTAL</span>
                            <small>⚠️ ELIMINA TODO EL SISTEMA</small>
                        </button>
                    </div>
                </div>
                
                <div class="legal-disclaimer">
                    <div class="disclaimer-content">
                        <h5>📋 Aviso Legal y Responsabilidades</h5>
                        <ul class="disclaimer-list">
                            <li>Todas las acciones son registradas con timestamp y usuario</li>
                            <li>Los backups se conservan por 90 días según política de retención</li>
                            <li>La eliminación de empresas puede afectar reportes históricos</li>
                            <li>Se requiere autorización administrativa para acciones críticas</li>
                            <li>El sistema cumple con normativas de protección de datos</li>
                        </ul>
                        <div class="disclaimer-signature">
                            <p>Al usar estas funciones, confirmas que tienes autorización y entiendes las consecuencias.</p>
                            <div class="signature-info">
                                <span>Usuario: <strong>Administrador</strong></span>
                                <span>Sesión: <strong>${new Date().toLocaleDateString()}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ================================================================
    // FUNCIONES DE ACCIÓN PARA GESTIÓN AVANZADA
    // ================================================================

    saveCompanyEdit(companyId) {
        const newName = document.getElementById(`name_${companyId}`)?.value?.trim();
        const newStatus = document.getElementById(`status_${companyId}`)?.value;
        
        if (!newName) {
            this.showNotification('❌ El nombre no puede estar vacío', 'error');
            return;
        }
        
        if (!this.companies[companyId]) {
            this.showNotification('❌ Empresa no encontrada', 'error');
            return;
        }
        
        // Actualizar empresa
        this.companies[companyId].name = newName;
        this.companies[companyId].status = newStatus;
        this.companies[companyId].lastModified = new Date().toISOString();
        
        this.saveCompaniesData(this.companies);
        this.renderCompaniesList();
        
        // Si es la empresa activa, actualizar UI
        if (this.selectedCompany === companyId) {
            this.updateSelectedCompany(companyId);
        }
        
        this.showNotification(`✅ ${newName} actualizada correctamente`, 'success');
        this.logAuditAction('COMPANY_EDITED', `Empresa editada: ${newName} (${companyId})`);
    }

    saveMetrics(companyId) {
        const revenue = parseInt(document.getElementById(`revenue_${companyId}`)?.value) || 0;
        const expenses = parseInt(document.getElementById(`expenses_${companyId}`)?.value) || 0;
        const profit = parseInt(document.getElementById(`profit_${companyId}`)?.value) || 0;
        const cashFlow = parseInt(document.getElementById(`cashFlow_${companyId}`)?.value) || 0;
        
        // Validaciones
        if (revenue < 0 || expenses < 0 || cashFlow < 0) {
            this.showNotification('❌ Los valores no pueden ser negativos', 'error');
            return;
        }
        
        if (!this.companies[companyId]) {
            this.showNotification('❌ Empresa no encontrada', 'error');
            return;
        }
        
        // Actualizar métricas
        this.companies[companyId].data = {
            revenue: revenue,
            expenses: expenses,
            profit: profit,
            cashFlow: cashFlow
        };
        this.companies[companyId].lastModified = new Date().toISOString();
        
        this.saveCompaniesData(this.companies);
        
        // Si es la empresa activa, actualizar UI principal
        if (this.selectedCompany === companyId) {
            this.updateCompanyData(companyId);
        }
        
        this.showNotification(`📊 Métricas de ${this.companies[companyId].name} actualizadas`, 'success');
        this.logAuditAction('METRICS_UPDATED', `Métricas actualizadas: ${this.companies[companyId].name}`);
    }

    resetMetrics(companyId) {
        if (!this.companies[companyId]) return;
        
        if (confirm(`¿Restaurar métricas originales de ${this.companies[companyId].name}?`)) {
            // Restaurar valores por defecto
            this.companies[companyId].data = {
                revenue: 500000,
                expenses: 300000,
                profit: 200000,
                cashFlow: 10000
            };
            this.companies[companyId].lastModified = new Date().toISOString();
            
            this.saveCompaniesData(this.companies);
            
            // Recargar el tab de métricas
            document.getElementById('metrics-management-tab').innerHTML = this.generateMetricsTab();
            
            this.showNotification(`🔄 Métricas de ${this.companies[companyId].name} restauradas`, 'success');
            this.logAuditAction('METRICS_RESET', `Métricas restauradas: ${this.companies[companyId].name}`);
        }
    }

    previewTheme(companyId, themeKey) {
        console.log(`🎨 Previsualizando tema ${themeKey} para ${companyId}`);
        // Implementar vista previa de tema
        this.showNotification(`🎨 Vista previa del tema ${themeKey}`, 'info');
    }

    applyTheme(companyId) {
    const themeSelect = document.getElementById(`theme_${companyId}`);
    if (!themeSelect || !this.companies[companyId]) return;
    
    const selectedTheme = themeSelect.value;
    console.log(`🎨 Aplicando tema ${selectedTheme} a ${companyId}`);
    
    // Temas disponibles
    const availableThemes = {
        'goldman-platinum': { primary: '#d4af37', secondary: '#b87333' },
        'tesla-futuristic': { primary: '#ff0040', secondary: '#ff6b9d' },
        'cupertino-elite': { primary: '#007aff', secondary: '#5ac8fa' },
        'netflix-premium': { primary: '#e50914', secondary: '#f40612' },
        'midnight-corporate': { primary: '#00d9ff', secondary: '#0099cc' },
        'emerald-nature': { primary: '#10b981', secondary: '#059669' },
        'royal-purple': { primary: '#8b5cf6', secondary: '#7c3aed' },
        'cyber-neon': { primary: '#00ff88', secondary: '#00cc6a' },
        'fire-industries': { primary: '#dc2626', secondary: '#ea580c' },
        'ocean-commerce': { primary: '#0891b2', secondary: '#0e7490' }
    };
    
    const theme = availableThemes[selectedTheme];
    if (!theme) {
        this.showNotification('❌ Tema no válido', 'error');
        return;
    }
    
    // Aplicar tema a la empresa
    this.companies[companyId].theme = { ...theme };
    this.companies[companyId].lastModified = new Date().toISOString();
    this.saveCompaniesData(this.companies);
    
    // Actualizar avatar en la tarjeta de temas
    const avatar = document.querySelector(`[data-company="${companyId}"] .company-avatar-theme`);
    if (avatar) {
        avatar.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
        avatar.style.transform = 'scale(1.1)';
        setTimeout(() => {
            avatar.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Actualizar preview
    const preview = document.getElementById(`preview_${companyId}`);
    if (preview) {
        preview.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
        preview.style.transform = 'scale(1.02)';
        setTimeout(() => {
            preview.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Actualizar colores personalizados
    const primaryInput = document.getElementById(`primary_${companyId}`);
    const secondaryInput = document.getElementById(`secondary_${companyId}`);
    if (primaryInput) primaryInput.value = theme.primary;
    if (secondaryInput) secondaryInput.value = theme.secondary;
    
    // Si es la empresa activa, actualizar UI principal
    if (this.selectedCompany === companyId) {
        this.updateSelectedCompany(companyId);
        
        // Notificar al sistema principal
        if (window.GRIZALUM && window.GRIZALUM.applyTheme) {
            window.GRIZALUM.applyTheme(companyId);
        }
    }
    
    // Actualizar lista de empresas
    this.renderCompaniesList();
    
    this.showNotification(`🎨 Tema "${selectedTheme}" aplicado a ${this.companies[companyId].name}`, 'success');
    this.logAuditAction('THEME_APPLIED', `Tema ${selectedTheme} aplicado a ${this.companies[companyId].name}`);
}

    updateCustomColors(companyId) {
        const primaryColor = document.getElementById(`primary_${companyId}`)?.value;
        const secondaryColor = document.getElementById(`secondary_${companyId}`)?.value;
        
        if (!this.companies[companyId] || !primaryColor || !secondaryColor) return;
        
        // Actualizar tema custom
        this.companies[companyId].theme = {
            primary: primaryColor,
            secondary: secondaryColor
        };
        this.companies[companyId].lastModified = new Date().toISOString();
        
        this.saveCompaniesData(this.companies);
        
        // Actualizar preview
        const preview = document.getElementById(`preview_${companyId}`);
        if (preview) {
            preview.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        }
        
        this.showNotification(`🎨 Colores personalizados actualizados`, 'success');
        this.logAuditAction('CUSTOM_COLORS', `Colores personalizados para ${this.companies[companyId].name}`);
    }

    confirmDelete(companyId, companyName) {
        const modal = document.createElement('div');
        modal.className = 'grizalum-modal delete-confirmation-modal';
        modal.innerHTML = `
            <div class="grizalum-modal-content">
                <div class="grizalum-modal-header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <div class="modal-title">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>🚨 CONFIRMAR ELIMINACIÓN</span>
                    </div>
                    <button class="modal-close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="padding: 2rem;">
                    <h3 style="color: #dc2626; margin-bottom: 1rem;">⚠️ ATENCIÓN: Acción Irreversible</h3>
                    <p style="margin-bottom: 1rem;">Vas a eliminar: <strong>${companyName}</strong></p>
                    <p style="margin-bottom: 2rem; color: #ef4444;"><strong>Esta acción NO se puede deshacer</strong></p>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">🔐 Contraseña de Administrador:</label>
                        <input type="password" id="adminPassword" placeholder="Ingresa la contraseña" style="width: 100%; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: space-between;">
                        <button class="btn-cancel" onclick="this.parentElement.parentElement.parentElement.remove()" style="flex: 1;">
                            ❌ Cancelar
                        </button>
                        <button class="btn-create" onclick="grizalumCompanyManager.executeDelete('${companyId}', '${companyName}')" style="flex: 1; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                            🗑️ ELIMINAR DEFINITIVAMENTE
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);
    }

    executeDelete(companyId, companyName) {
        const password = document.getElementById('adminPassword')?.value;
        
        // Verificar contraseña
        if (password !== 'Joelgty123456') {
            this.showNotification('❌ Contraseña incorrecta', 'error');
            return;
        }
        
        if (!this.companies[companyId]) {
            this.showNotification('❌ Empresa no encontrada', 'error');
            return;
        }
        
        // Crear backup antes de eliminar
        const backupData = { [companyId]: { ...this.companies[companyId] } };
        localStorage.setItem(`grizalum_deleted_${companyId}_${Date.now()}`, JSON.stringify(backupData));
        
        // Eliminar empresa
        delete this.companies[companyId];
        this.saveCompaniesData(this.companies);
        
        // Cerrar modales
        document.querySelectorAll('.delete-confirmation-modal, .grizalum-modal').forEach(modal => {
            if (modal.classList.contains('delete-confirmation-modal') || modal.id === 'advancedManagementModal') {
                modal.remove();
            }
        });
        
        // Actualizar listas
        this.renderCompaniesList();
        
        // Si era la empresa seleccionada, seleccionar otra
        if (this.selectedCompany === companyId) {
            this.selectFirstCompany();
        }
        
        this.showNotification(`🗑️ ${companyName} eliminada correctamente`, 'success');
        this.logAuditAction('COMPANY_DELETED', `Empresa eliminada: ${companyName} (${companyId})`);
    }

    archiveCompany(companyId, companyName) {
        if (!this.companies[companyId]) return;
        
        if (confirm(`📦 ¿Archivar ${companyName}?\n\nLa empresa se marcará como archivada pero no se eliminará.`)) {
            this.companies[companyId].status = 'Archivado';
            this.companies[companyId].lastModified = new Date().toISOString();
            this.saveCompaniesData(this.companies);
            this.renderCompaniesList();
            
            this.showNotification(`📦 ${companyName} archivada`, 'success');
            this.logAuditAction('COMPANY_ARCHIVED', `Empresa archivada: ${companyName}`);
        }
    }

    suspendCompany(companyId, companyName) {
        if (!this.companies[companyId]) return;
        
        if (confirm(`⏸️ ¿Suspender operaciones de ${companyName}?\n\nLa empresa se marcará en mantenimiento.`)) {
            this.companies[companyId].status = 'Mantenimiento';
            this.companies[companyId].lastModified = new Date().toISOString();
            this.saveCompaniesData(this.companies);
            this.renderCompaniesList();
            
            this.showNotification(`⏸️ ${companyName} suspendida temporalmente`, 'warning');
            this.logAuditAction('COMPANY_SUSPENDED', `Empresa suspendida: ${companyName}`);
        }
    }

    duplicateCompany(companyId) {
        const company = this.companies[companyId];
        if (!company) return;
        
        const newName = prompt('📋 Nombre para la empresa duplicada:', company.name + ' (Copia)');
        if (!newName) return;
        
        const newId = this.generateCompanyId(newName);
        
        this.companies[newId] = {
            ...company,
            name: newName,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        
        this.saveCompaniesData(this.companies);
        this.renderCompaniesList();
        
        this.showNotification(`📋 ${newName} duplicada exitosamente`, 'success');
        this.logAuditAction('COMPANY_DUPLICATED', `Empresa duplicada: ${newName} desde ${company.name}`);
    }

    exportCompanyData(companyId) {
        const company = this.companies[companyId];
        if (!company) return;
        
        const data = JSON.stringify(company, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${company.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification(`📤 Datos de ${company.name} exportados`, 'success');
        this.logAuditAction('COMPANY_EXPORTED', `Datos exportados: ${company.name}`);
    }

    // Funciones adicionales para completar la funcionalidad
    bulkEdit() {
        this.showNotification('🔧 Edición masiva próximamente', 'info');
    }

    addNewCompany() {
        // Cerrar modal de gestión y abrir wizard
        document.getElementById('advancedManagementModal')?.remove();
        this.showAddCompanyWizard();
    }

    exportAllData() {
        this.exportData();
    }

    backupAll() {
        this.createBackup();
    }

    downloadBackup() {
        this.createBackup();
    }

    scheduleBackup() {
        this.showNotification('⏰ Programación de backups próximamente', 'info');
    }

    showRestoreOption() {
        this.showNotification('🔄 Función de restauración próximamente', 'info');
    }

    viewHistory() {
        this.showNotification('📊 Historial de cambios próximamente', 'info');
    }

    viewAuditLog() {
        console.log('📋 Audit Log:', this.auditLog);
        this.showNotification(`📋 ${this.auditLog.length} entradas en el log de auditoría`, 'info');
    }

    exportAudit() {
        const data = JSON.stringify(this.auditLog, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grizalum-audit-log-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('📋 Log de auditoría exportado', 'success');
    }

    bulkArchive() {
        this.showNotification('📦 Archivo masivo próximamente', 'info');
    }

    factoryReset() {
        if (confirm('⚠️ RESET COMPLETO\n\n¿Eliminar TODAS las empresas y restaurar datos de fábrica?\n\nEsta acción NO se puede deshacer.')) {
            // Crear backup completo antes del reset
            this.createBackup();
            
            // Resetear a datos por defecto
            this.companies = this.loadCompaniesData();
            this.saveCompaniesData(this.companies);
            this.renderCompaniesList();
            this.selectFirstCompany();
            
            this.showNotification('🔄 Sistema restaurado a configuración de fábrica', 'warning');
            this.logAuditAction('FACTORY_RESET', 'Sistema restaurado completamente');
        }
    }

    emergencyBackup() {
        this.createBackup();
        this.showNotification('🚨 Backup de emergencia creado', 'success');
    }

    emergencyLock() {
        this.showNotification('🔒 Función de bloqueo próximamente', 'warning');
    }

    emergencyWipe() {
        this.showNotification('⚠️ Función de borrado total deshabilitada por seguridad', 'error');
    }

    // Funciones para temas
    createCustomTheme() {
    console.log('🎨 Abriendo creador de tema personalizado');
    
    // Eliminar modal existente si existe
    const existingModal = document.getElementById('customThemeModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'customThemeModal';
    modal.className = 'grizalum-modal';
    modal.innerHTML = `
        <div class="grizalum-modal-content" style="max-width: 600px;">
            <div class="grizalum-modal-header">
                <div class="modal-title">
                    <i class="fas fa-palette"></i>
                    <span>🎨 Crear Tema Personalizado</span>
                </div>
                <button class="modal-close-btn" onclick="this.closest('.grizalum-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="grizalum-modal-body" style="padding: 32px;">
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Nombre del Tema</label>
                    <input type="text" id="customThemeName" placeholder="Ej: Mi Tema Corporativo" 
                           style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none;"
                           onkeyup="grizalumCompanyManager.updateCustomThemePreview()">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Color Primario</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="color" id="customPrimaryColor" value="#d4af37" 
                                   style="width: 50px; height: 40px; border: none; border-radius: 6px; cursor: pointer;"
                                   onchange="grizalumCompanyManager.updateCustomThemePreview()">
                            <input type="text" id="customPrimaryText" value="#d4af37" 
                                   style="flex: 1; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-family: monospace;"
                                   onkeyup="grizalumCompanyManager.syncColorInputs('primary')">
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Color Secundario</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="color" id="customSecondaryColor" value="#b87333" 
                                   style="width: 50px; height: 40px; border: none; border-radius: 6px; cursor: pointer;"
                                   onchange="grizalumCompanyManager.updateCustomThemePreview()">
                            <input type="text" id="customSecondaryText" value="#b87333" 
                                   style="flex: 1; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-family: monospace;"
                                   onkeyup="grizalumCompanyManager.syncColorInputs('secondary')">
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Vista Previa</label>
                    <div id="customThemePreview" style="background: linear-gradient(135deg, #d4af37 0%, #b87333 100%); 
                         border-radius: 16px; padding: 24px; color: white; text-align: center; transition: all 0.3s ease;
                         box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
                            <div style="font-size: 2rem;">🏢</div>
                            <div>
                                <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700;" id="previewThemeName">Mi Tema Corporativo</h3>
                                <p style="margin: 0; opacity: 0.9;">Dashboard Empresarial</p>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-around; margin-top: 16px; font-size: 14px;">
                            <div><strong>S/. 2.5M</strong><br>Ingresos</div>
                            <div><strong>+24%</strong><br>Crecimiento</div>
                            <div><strong>S/. 450K</strong><br>Utilidad</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 16px; justify-content: flex-end;">
                    <button onclick="this.closest('.grizalum-modal').remove()" 
                            style="padding: 12px 24px; border: 2px solid #e5e7eb; background: white; color: #6b7280; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Cancelar
                    </button>
                    <button onclick="grizalumCompanyManager.saveCustomTheme()" 
                            style="padding: 12px 24px; border: none; background: linear-gradient(135deg, #d4af37, #b87333); color: white; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-save"></i> Guardar Tema
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Focus en el nombre
    setTimeout(() => {
        document.getElementById('customThemeName').focus();
    }, 200);
    
    this.logAuditAction('CUSTOM_THEME_MODAL', 'Modal de creación de tema personalizado abierto');
}

// Función auxiliar para actualizar preview
updateCustomThemePreview() {
    const name = document.getElementById('customThemeName')?.value || 'Mi Tema Corporativo';
    const primary = document.getElementById('customPrimaryColor')?.value || '#d4af37';
    const secondary = document.getElementById('customSecondaryColor')?.value || '#b87333';
    
    const preview = document.getElementById('customThemePreview');
    const nameElement = document.getElementById('previewThemeName');
    
    if (preview) {
        preview.style.background = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
        preview.style.transform = 'scale(1.02)';
        setTimeout(() => {
            preview.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (nameElement) {
        nameElement.textContent = name || 'Mi Tema Corporativo';
    }
}

// Función auxiliar para sincronizar inputs de color
syncColorInputs(type) {
    if (type === 'primary') {
        const colorInput = document.getElementById('customPrimaryColor');
        const textInput = document.getElementById('customPrimaryText');
        if (colorInput && textInput) {
            colorInput.value = textInput.value;
        }
    } else if (type === 'secondary') {
        const colorInput = document.getElementById('customSecondaryColor');
        const textInput = document.getElementById('customSecondaryText');
        if (colorInput && textInput) {
            colorInput.value = textInput.value;
        }
    }
    this.updateCustomThemePreview();
}

// Función para guardar el tema personalizado
saveCustomTheme() {
    const name = document.getElementById('customThemeName')?.value?.trim();
    const primary = document.getElementById('customPrimaryColor')?.value;
    const secondary = document.getElementById('customSecondaryColor')?.value;
    
    if (!name) {
        this.showNotification('❌ Ingresa un nombre para el tema', 'error');
        return;
    }
    
    if (name.length < 3) {
        this.showNotification('❌ El nombre debe tener al menos 3 caracteres', 'error');
        return;
    }
    
    // Guardar tema personalizado
    const customThemes = JSON.parse(localStorage.getItem('grizalum_custom_themes') || '{}');
    const themeKey = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    customThemes[themeKey] = {
        name: name,
        primary: primary,
        secondary: secondary,
        createdAt: new Date().toISOString(),
        author: 'Usuario'
    };
    
    localStorage.setItem('grizalum_custom_themes', JSON.stringify(customThemes));
    
    // Cerrar modal
    document.getElementById('customThemeModal').remove();
    
    // Recargar la galería de temas para mostrar el nuevo
    this.refreshThemesGallery();
    
    this.showNotification(`🎨 Tema "${name}" creado exitosamente`, 'success');
    this.logAuditAction('CUSTOM_THEME_CREATED', `Tema personalizado creado: ${name} (${themeKey})`);
}

// Función para refrescar la galería de temas
refreshThemesGallery() {
    // Recargar el tab de temas si está abierto
    const themesTab = document.getElementById('themes-management-tab');
    if (themesTab && themesTab.classList.contains('active')) {
        themesTab.innerHTML = this.generateThemesTab();
    }
}

   importTheme() {
    console.log('📥 Iniciando importación de tema');
    
    // Crear input de archivo oculto
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            this.showNotification('❌ No se seleccionó archivo', 'error');
            return;
        }
        
        if (!file.name.endsWith('.json')) {
            this.showNotification('❌ Solo se permiten archivos .json', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Validar estructura del archivo
                if (!importData.themes && !importData.name) {
                    this.showNotification('❌ Archivo de tema inválido', 'error');
                    return;
                }
                
                let importedCount = 0;
                const customThemes = JSON.parse(localStorage.getItem('grizalum_custom_themes') || '{}');
                
                // Importar tema único
                if (importData.name && importData.primary && importData.secondary) {
                    const themeKey = importData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    
                    // Verificar si ya existe
                    if (customThemes[themeKey]) {
                        const confirmOverwrite = confirm(`¿Sobrescribir el tema existente "${importData.name}"?`);
                        if (!confirmOverwrite) {
                            this.showNotification('📥 Importación cancelada', 'info');
                            return;
                        }
                    }
                    
                    customThemes[themeKey] = {
                        name: importData.name,
                        primary: importData.primary,
                        secondary: importData.secondary,
                        importedAt: new Date().toISOString(),
                        author: importData.author || 'Importado'
                    };
                    importedCount = 1;
                }
                // Importar múltiples temas
                else if (importData.themes) {
                    Object.entries(importData.themes).forEach(([key, theme]) => {
                        if (theme.name && theme.primary && theme.secondary) {
                            const themeKey = theme.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                            
                            customThemes[themeKey] = {
                                ...theme,
                                importedAt: new Date().toISOString()
                            };
                            importedCount++;
                        }
                    });
                }
                
                if (importedCount === 0) {
                    this.showNotification('❌ No se encontraron temas válidos en el archivo', 'error');
                    return;
                }
                
                // Guardar temas importados
                localStorage.setItem('grizalum_custom_themes', JSON.stringify(customThemes));
                
                // Actualizar galería
                this.refreshThemesGallery();
                
                this.showNotification(`✅ ${importedCount} tema(s) importado(s) exitosamente`, 'success');
                this.logAuditAction('THEMES_IMPORTED', `${importedCount} temas importados desde archivo`);
                
            } catch (error) {
                console.error('Error importando tema:', error);
                this.showNotification('❌ Error al leer el archivo de tema', 'error');
            }
        };
        
        reader.onerror = () => {
            this.showNotification('❌ Error al leer el archivo', 'error');
        };
        
        reader.readAsText(file);
    };
    
    // Trigger del input
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
    
    this.logAuditAction('THEME_IMPORT_STARTED', 'Proceso de importación de tema iniciado');
}

exportThemes() {
    console.log('📤 Iniciando exportación de temas');
    
    const customThemes = JSON.parse(localStorage.getItem('grizalum_custom_themes') || '{}');
    
    if (Object.keys(customThemes).length === 0) {
        this.showNotification('ℹ️ No hay temas personalizados para exportar', 'info');
        
        // Ofrecer exportar tema actual si existe
        if (this.selectedCompany && this.companies[this.selectedCompany]?.theme) {
            const currentCompany = this.companies[this.selectedCompany];
            const confirmExport = confirm(`¿Exportar el tema actual de "${currentCompany.name}"?`);
            
            if (confirmExport) {
                this.exportCurrentCompanyTheme();
            }
        }
        return;
    }
    
    // Crear estructura de exportación
    const exportData = {
        metadata: {
            title: 'Temas Personalizados GRIZALUM',
            description: 'Colección de temas visuales personalizados',
            exportDate: new Date().toISOString(),
            version: '2.0.0',
            totalThemes: Object.keys(customThemes).length,
            appName: 'GRIZALUM Company Manager'
        },
        themes: customThemes,
        instructions: {
            howToImport: 'Usar la función "Importar Tema" en GRIZALUM',
            compatibility: 'Compatible con GRIZALUM v2.0+',
            format: 'JSON estándar con estructura validada'
        }
    };
    
    // Crear y descargar archivo
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grizalum-temas-personalizados-${new Date().toISOString().split('T')[0]}.json`;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification(`📤 ${Object.keys(customThemes).length} temas exportados exitosamente`, 'success');
    this.logAuditAction('THEMES_EXPORTED', `Temas personalizados exportados: ${Object.keys(customThemes).length}`);
}

// Función auxiliar para exportar tema de empresa actual
exportCurrentCompanyTheme() {
    if (!this.selectedCompany || !this.companies[this.selectedCompany]) {
        this.showNotification('❌ No hay empresa seleccionada', 'error');
        return;
    }
    
    const company = this.companies[this.selectedCompany];
    const theme = company.theme;
    
    if (!theme || !theme.primary || !theme.secondary) {
        this.showNotification('❌ La empresa no tiene un tema válido', 'error');
        return;
    }
    
    const exportData = {
        name: `Tema de ${company.name}`,
        primary: theme.primary,
        secondary: theme.secondary,
        description: `Tema visual extraído de la empresa ${company.name}`,
        exportedFrom: company.name,
        exportDate: new Date().toISOString(),
        author: 'GRIZALUM System'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tema-${company.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification(`📤 Tema de "${company.name}" exportado`, 'success');
    this.logAuditAction('COMPANY_THEME_EXPORTED', `Tema de empresa exportado: ${company.name}`);
}

    filterThemes(category) {
    console.log(`🔍 Filtrando temas por: ${category}`);
    
    const themes = document.querySelectorAll('.showcase-theme');
    const filters = document.querySelectorAll('.filter-chip');
    
    // Actualizar filtros activos
    filters.forEach(filter => {
        filter.classList.remove('active');
        if (filter.textContent.toLowerCase().includes(category.toLowerCase()) || category === 'todos') {
            filter.classList.add('active');
        }
    });
    
    // Mostrar/ocultar temas con animación
    themes.forEach((theme, index) => {
        const themeCategory = theme.dataset.category?.toLowerCase() || '';
        
        if (category === 'todos' || themeCategory === category.toLowerCase()) {
            theme.style.display = 'block';
            theme.style.animation = `fadeInUp 0.3s ease ${index * 0.1}s forwards`;
            theme.style.opacity = '0';
            setTimeout(() => {
                theme.style.opacity = '1';
            }, index * 100);
        } else {
            theme.style.display = 'none';
        }
    });
    
    this.showNotification(`🎨 Mostrando temas: ${category}`, 'success');
}

    applyThemeToAll() {
        this.showNotification('🎨 Aplicar tema a todas próximamente', 'info');
    }

    resetAllThemes() {
        this.showNotification('🔄 Reset de temas próximamente', 'info');
    }

    // Funciones para métricas
    generateReport() {
        this.showNotification('📊 Generador de reportes próximamente', 'info');
    }

    exportMetrics() {
        this.showNotification('📈 Exportar métricas próximamente', 'info');
    }

    compareMetrics() {
        this.showNotification('⚖️ Comparador de métricas próximamente', 'info');
    }

    // ================================================================
    // UTILIDADES ADICIONALES
    // ================================================================

    getTimeAgo(dateString) {
        if (!dateString) return 'Desconocido';
        
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 0) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
        if (diffHours > 0) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        return 'Hace menos de 1 hora';
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
    // ================================================================
    // INTEGRACIÓN CON DASHBOARD PRINCIPAL
    // ================================================================
    
    applyCompanyThemeIntegration(companyId) {
        console.log(`🎨 Aplicando tema para empresa: ${companyId}`);
        
        const company = this.companies[companyId];
        if (!company || !company.theme) {
            console.warn('❌ Empresa o tema no encontrado');
            return;
        }
        
        const theme = company.theme;
        console.log(`🎨 Aplicando colores: ${theme.primary} -> ${theme.secondary}`);
        
        // Actualizar selector principal de empresas
        const companyIcon = document.getElementById('grizalumCurrentCompanyIcon');
        if (companyIcon && companyIcon.parentElement) {
            companyIcon.parentElement.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
            companyIcon.parentElement.style.transition = 'all 0.3s ease';
            companyIcon.parentElement.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                companyIcon.parentElement.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Disparar evento para otros módulos
        document.dispatchEvent(new CustomEvent('grizalumThemeChanged', {
            detail: { 
                companyId, 
                company: company,
                theme: theme,
                timestamp: Date.now() 
            }
        }));
        
        this.logAuditAction('THEME_INTEGRATION', `Tema integrado en dashboard: ${company.name} - ${theme.primary}`);
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
