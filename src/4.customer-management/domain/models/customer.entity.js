/**
 * Customer Entity - Dominio
 * Representa un cliente (empresa solicitante) en el sistema
 */
export class Customer {
    constructor({
        id = null,
        ruc = '',
        companyName = '',
        status = 'ACTIVE',
        brands = [],
        createdAt = null,
        updatedAt = null
    } = {}) {
        this.id = id;
        this.ruc = ruc;
        this.companyName = companyName;
        this.status = status;
        this.brands = brands;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Verifica si el cliente está activo
     * @returns {boolean}
     */
    isActive() {
        return this.status === 'ACTIVE';
    }

    /**
     * Obtiene el nombre completo del cliente con RUC
     * @returns {string}
     */
    getFullDisplayName() {
        return `${this.companyName} (RUC: ${this.ruc})`;
    }

    /**
     * Valida si la entidad es válida para persistencia
     * @returns {boolean}
     */
    isValid() {
        return !!this.ruc && !!this.companyName;
    }
}

