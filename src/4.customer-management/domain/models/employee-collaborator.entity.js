/**
 * EmployeeCollaborator Entity - Dominio
 * Representa un colaborador/empleado de un cliente en el sistema
 */
export class EmployeeCollaborator {
    constructor({
        id = null,
        email = '',
        name = '',
        lastName = '',
        phoneNumber = '',
        applicantCompanyId = null,
        status = 'ACTIVE',
        createdAt = null,
        updatedAt = null
    } = {}) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.applicantCompanyId = applicantCompanyId;
        this.status = status;
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
     * @returns {boolean}
     */
    isActive() {
        return this.status === 'ACTIVE';
    }

    /**
     * Obtiene las iniciales del colaborador
     * @returns {string}
     */
    getInitials() {
        const firstInitial = this.name.charAt(0).toUpperCase();
        const lastInitial = this.lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    }

    /**
     * Valida si la entidad es válida para persistencia
     * @returns {boolean}
     */
    isValid() {
        return !!this.email && !!this.name && !!this.lastName && !!this.applicantCompanyId;
    }
}