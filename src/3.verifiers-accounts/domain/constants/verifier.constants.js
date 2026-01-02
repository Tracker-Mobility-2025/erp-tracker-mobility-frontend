/**
 * Constantes del dominio de verificadores.
 * Solo conceptos de negocio - sin concerns de UI.
 */

/**
 * Estados del verificador
 */
export const VerifierStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
});

/**
 * Roles del verificador
 */
export const VerifierRoles = Object.freeze({
  FIELD_VERIFIER: 'FIELD_VERIFIER',
  SENIOR_VERIFIER: 'SENIOR_VERIFIER',
  SUPERVISOR: 'SUPERVISOR'
});

/**
 * Roles por defecto
 */
export const DefaultRole = VerifierRoles.FIELD_VERIFIER;

/**
 * Estado por defecto para nuevos verificadores
 */
export const DefaultStatus = VerifierStatus.INACTIVE;

/**
 * Reglas de negocio del dominio
 */
export const BusinessRules = Object.freeze({
  MIN_PASSWORD_LENGTH: 8,
  MAX_DAILY_ORDERS: 10,
  MIN_PHONE_LENGTH: 9,
  MAX_PHONE_LENGTH: 15,
  MIN_NAME_LENGTH: 2
});

/**
 * Mensajes de error del dominio
 */
export const VerifierMessages = Object.freeze({
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_STATUS: 'Estado no válido',
  INVALID_PASSWORD: 'Password debe tener al menos 8 caracteres',
  INVALID_NAME: 'Nombre debe tener al menos 2 caracteres',
  MAX_ORDERS_EXCEEDED: 'Verificador ha alcanzado el máximo de órdenes diarias',
  ALREADY_ACTIVE: 'Verificador ya está activo',
  ALREADY_INACTIVE: 'Verificador ya está inactivo',
  ID_REQUIRED: 'ID es requerido',
  EMAIL_REQUIRED: 'Email es requerido',
  PHONE_REQUIRED: 'Teléfono es requerido',
  NAME_REQUIRED: 'Nombre es requerido',
  ADMIN_ID_REQUIRED: 'Admin ID es requerido'
});
