/**
 * Brand Entity - Dominio
 * Representa una marca asociada a un cliente (applicant company).
 * 
 * @class Brand
 */
export class Brand {
    /**
     * Crea una instancia de Brand con validación.
     * @param {Object} params - Parámetros de la marca
     * @param {number} [params.id] - Identificador único de la marca
     * @param {string} params.value - Nombre/valor de la marca
     * @throws {Error} Si los parámetros son inválidos
     */
    constructor({
        id = null,
        value = ''
    } = {}) {
        // Validación obligatoria
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
            throw new Error('El valor de la marca es requerido');
        }

        this.id = id;
        this.value = value.trim();
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
