import { Email } from '../value-objects/email.vo.js';
import { PhoneNumber } from '../value-objects/phone-number.vo.js';
import { EmployeeCollaboratorMessages, BusinessRules } from '../constants/customer.constants.js';

/**
 * EmployeeCollaborator Entity - Dominio
 * Representa un colaborador/empleado de un cliente en el sistema.
 * Rich Domain Model con comportamiento de negocio encapsulado.
 * 
 * @class EmployeeCollaborator
 */
export class EmployeeCollaborator {
    /**
     * Crea una instancia de EmployeeCollaborator con validación obligatoria.
     * @param {Object} params - Parámetros del colaborador
     * @param {number} [params.id] - Identificador único
     * @param {string} params.email - Email del colaborador
     * @param {string} params.name - Nombre del colaborador
     * @param {string} params.lastName - Apellido del colaborador
     * @param {string} params.phoneNumber - Número telefónico
     * @param {number} params.applicantCompanyId - ID del cliente asociado
     * @param {string} [params.applicantCompanyName=''] - Nombre del cliente
     * @param {string} [params.status='ACTIVE'] - Estado del colaborador
     * @param {number} [params.brandId] - ID de la marca asociada
     * @param {string} [params.brandName=''] - Nombre de la marca
     * @param {Array} [params.roles=[]] - Roles del colaborador
     * @param {Date} [params.createdAt] - Fecha de creación
     * @param {Date} [params.updatedAt] - Fecha de actualización
     * @throws {Error} Si los parámetros son inválidos
     */
    constructor({
        id = null,
        email,
        name,
        lastName,
        phoneNumber,
        applicantCompanyId,
        applicantCompanyName = '',
        status = 'ACTIVE',
        brandId = null,
        brandName = '',
        roles = [],
        createdAt = null,
        updatedAt = null
    } = {}) {
        // Validación obligatoria de campos requeridos
        if (!email) {
            throw new Error(EmployeeCollaboratorMessages.EMAIL_REQUIRED);
        }
        if (!name || name.trim().length < BusinessRules.NAME_MIN_LENGTH) {
            throw new Error(EmployeeCollaboratorMessages.NAME_REQUIRED);
        }
        if (!lastName || lastName.trim().length < BusinessRules.NAME_MIN_LENGTH) {
            throw new Error(EmployeeCollaboratorMessages.LASTNAME_REQUIRED);
        }
        if (!phoneNumber) {
            throw new Error(EmployeeCollaboratorMessages.PHONE_REQUIRED);
        }
        if (!applicantCompanyId) {
            throw new Error(EmployeeCollaboratorMessages.COMPANY_REQUIRED);
        }

        this.id = id;
        
        // Usar Value Objects con validación automática
        this.email = new Email(email);
        this.phoneNumber = new PhoneNumber(phoneNumber);
        
        this.name = name.trim();
        this.lastName = lastName.trim();
        this.applicantCompanyId = applicantCompanyId;
        this.applicantCompanyName = applicantCompanyName;
        this.status = status;
        this.brandId = brandId;
        this.brandName = brandName;
        this.roles = Array.isArray(roles) ? roles : [];
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Obtiene el nombre completo del colaborador
     * @returns {string}
     */
    getFullName() {
        return `${this.name} ${this.lastName}`.trim();
    }

    /**
     * Verifica si el colaborador está activo
     * @returns {boolean} True si está activo
     */
    isActive() {
        return this.status === 'ACTIVE';
    }

    /**
     * Obtiene las iniciales del colaborador
     * @returns {string} Iniciales (ej: "JD")
     */
    getInitials() {
        const firstInitial = this.name.charAt(0).toUpperCase();
        const lastInitial = this.lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    }

    /**
     * Valida si la entidad es válida para persistencia
     * @returns {boolean} True si es válida
     */
    isValid() {
        return !!this.email && !!this.name && !!this.lastName && !!this.applicantCompanyId;
    }

    /**
     * Obtiene el email como string
     * @returns {string} Email
     */
    getEmailValue() {
        return this.email.toString();
    }

    /**
     * Obtiene el teléfono como string
     * @returns {string} Número telefónico
     */
    getPhoneValue() {
        return this.phoneNumber.toString();
    }
}