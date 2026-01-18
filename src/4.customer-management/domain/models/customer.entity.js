import { Ruc } from '../value-objects/ruc.vo.js';
import { CustomerStatus, CustomerMessages, BusinessRules } from '../constants/customer.constants.js';

/**
 * Customer Entity - Dominio
 * Representa un cliente (empresa solicitante) en el sistema.
 * Rich Domain Model con comportamiento de negocio encapsulado.
 * 
 * @class Customer
 */
export class Customer {
    /**
     * Crea una instancia de Customer con validación obligatoria.
     * @param {Object} params - Parámetros del cliente
     * @param {number} [params.id] - Identificador único del cliente
     * @param {string} params.ruc - RUC del cliente
     * @param {string} params.companyName - Nombre de la empresa
     * @param {string} [params.status='ACTIVE'] - Estado del cliente
     * @param {Array} [params.brands=[]] - Marcas asociadas al cliente
     * @param {Date} [params.createdAt] - Fecha de creación
     * @param {Date} [params.updatedAt] - Fecha de actualización
     * @throws {Error} Si los parámetros son inválidos
     */
    constructor({
        id = null,
        ruc,
        companyName,
        status = CustomerStatus.ACTIVE,
        brands = [],
        createdAt = null,
        updatedAt = null
    } = {}) {
        // Validación obligatoria de campos requeridos
        if (!ruc) {
            throw new Error(CustomerMessages.RUC_REQUIRED);
        }
        if (!companyName || companyName.trim().length < BusinessRules.COMPANY_NAME_MIN_LENGTH) {
            throw new Error(CustomerMessages.COMPANY_NAME_REQUIRED);
        }

        this.id = id;
        
        // Usar Value Object con validación automática
        this.ruc = new Ruc(ruc);
        
        this.companyName = companyName.trim();
        this.status = status || CustomerStatus.ACTIVE;
        this.brands = Array.isArray(brands) ? brands : [];
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
     * @returns {string} Nombre completo con RUC
     */
    getFullDisplayName() {
        return `${this.companyName} (RUC: ${this.ruc.toString()})`;
    }

    /**
     * Valida si la entidad es válida para persistencia
     * @returns {boolean} True si es válida
     */
    isValid() {
        return !!this.ruc && !!this.companyName;
    }

    /**
     * Obtiene el valor del RUC como string
     * @returns {string} RUC
     */
    getRucValue() {
        return this.ruc.toString();
    }
}

