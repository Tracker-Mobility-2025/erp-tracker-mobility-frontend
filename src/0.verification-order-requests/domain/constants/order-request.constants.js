/**
 * Constantes del dominio de solicitudes de orden.
 * Solo conceptos de negocio - sin concerns de UI.
 */

/**
 * Estados de la solicitud de orden
 */
export const OrderRequestStatus = Object.freeze({
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED'
});

/**
 * Tipos de documento
 */
export const DocumentType = Object.freeze({
  DNI: 'DNI',
  CARNET_EXTRANJERIA: 'CARNET_EXTRANJERIA',
  PTP: 'PTP'
});

/**
 * Tipos de observación
 */
export const ObservationType = Object.freeze({
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  IN_REVIEW: 'IN_REVIEW'
});

/**
 * Estados de observación
 */
export const ObservationStatus = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
});

/**
 * Reglas de negocio del dominio
 */
export const BusinessRules = Object.freeze({
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  DNI_LENGTH: 8,
  CARNET_MIN_LENGTH: 9,
  CARNET_MAX_LENGTH: 12,
  MIN_PHONE_LENGTH: 9,
  MAX_PHONE_LENGTH: 15,
  MAX_ADDRESS_LENGTH: 300,
  RUC_LENGTH: 11
});

/**
 * Mensajes de error del dominio
 */
export const OrderRequestMessages = Object.freeze({
  ID_REQUIRED: 'ID es requerido',
  ORDER_CODE_REQUIRED: 'Código de orden es requerido',
  STATUS_REQUIRED: 'Estado es requerido',
  CLIENT_NAME_REQUIRED: 'Nombre del cliente es requerido',
  INVALID_STATUS: 'Estado no válido',
  INVALID_DOCUMENT_TYPE: 'Tipo de documento inválido',
  INVALID_OBSERVATION_STATUS: 'Estado de observación no válido'
});

