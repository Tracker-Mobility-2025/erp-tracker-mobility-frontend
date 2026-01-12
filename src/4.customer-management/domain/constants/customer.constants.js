/**
 * Customer Constants - Dominio
 * Constantes y reglas de negocio para el módulo de clientes
 */

// Estados de Customer
export const CustomerStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
};

// Mensajes de validación
export const CustomerMessages = {
    RUC_REQUIRED: 'El RUC es obligatorio',
    RUC_INVALID_FORMAT: 'El RUC debe tener 11 dígitos',
    COMPANY_NAME_REQUIRED: 'El nombre de la empresa es obligatorio',
    COMPANY_NAME_MIN_LENGTH: 'El nombre de la empresa debe tener al menos 3 caracteres',
    COMPANY_NAME_MAX_LENGTH: 'El nombre de la empresa no puede exceder 100 caracteres',
    STATUS_REQUIRED: 'El estado es obligatorio',
    STATUS_INVALID: 'El estado debe ser ACTIVE o INACTIVE'
};

// Mensajes de Employee Collaborator
export const EmployeeCollaboratorMessages = {
    EMAIL_REQUIRED: 'El email es obligatorio',
    EMAIL_INVALID: 'El formato del email no es válido',
    NAME_REQUIRED: 'El nombre es obligatorio',
    NAME_MIN_LENGTH: 'El nombre debe tener al menos 2 caracteres',
    LASTNAME_REQUIRED: 'El apellido es obligatorio',
    LASTNAME_MIN_LENGTH: 'El apellido debe tener al menos 2 caracteres',
    PHONE_REQUIRED: 'El teléfono es obligatorio',
    PHONE_INVALID: 'El formato del teléfono no es válido',
    COMPANY_REQUIRED: 'El cliente asociado es obligatorio'
};

// Reglas de negocio
export const BusinessRules = {
    RUC_LENGTH: 11,
    COMPANY_NAME_MIN_LENGTH: 3,
    COMPANY_NAME_MAX_LENGTH: 100,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    PHONE_MIN_LENGTH: 9,
    PHONE_MAX_LENGTH: 15
};

// Opciones para UI
export const CustomerStatusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: CustomerStatus.ACTIVE },
    { label: 'Inactivo', value: CustomerStatus.INACTIVE }
];

