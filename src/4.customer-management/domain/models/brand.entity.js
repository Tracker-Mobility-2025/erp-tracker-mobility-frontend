/**
 * Brand Entity - Dominio
 * Representa una marca asociada a un cliente (applicant company)
 */
export class Brand {
    constructor({
        id = null,
        value = ''
    } = {}) {
        this.id = id;
        this.value = value;
    }

    /**
     * Verifica si la marca es válida
     * @returns {boolean}
     */
    isValid() {
        return this.id !== null && !!this.value;
    }

    /**
     * Obtiene el display name de la marca
     * @returns {string}
     */
    getDisplayName() {
        return this.value;
    }
}
