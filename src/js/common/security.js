// ==================== UTILIDADES DE SEGURIDAD (XSS PREVENTION) ====================

/**
 * Escapa caracteres HTML peligrosos para prevenir ataques XSS
 * al insertar contenido dinamico con innerHTML.
 *
 * @param {string} str - Texto a escapar
 * @returns {string} Texto escapado seguro para innerHTML
 */
export function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') {
        str = String(str);
    }
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Escapa un valor para usarlo de forma segura dentro de un atributo HTML.
 * @param {string} str
 * @returns {string}
 */
export function escapeAttr(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') {
        str = String(str);
    }
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Exponer globalmente para modulos no-ESM
if (typeof window !== 'undefined') {
    window.escapeHtml = escapeHtml;
    window.escapeAttr = escapeAttr;
}
