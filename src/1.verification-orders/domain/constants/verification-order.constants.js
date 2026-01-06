/**
 * Constantes del dominio de órdenes de verificación.
 * Define reglas de negocio, enums y mensajes del dominio.
 * Solo conceptos de negocio - sin concerns de UI.
 */

/**
 * Estados de la orden
 */
export const OrderStatus = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  ASIGNADO: 'ASIGNADO',
  EN_PROCESO: 'EN_PROCESO',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA',
  OBSERVADO: 'OBSERVADO',
  SUBSANADA: 'SUBSANADA'
});

/**
 * Tipos de documento
 */
export const DocumentType = Object.freeze({
  DNI: 'DNI',
  CE: 'CE',
  PASSPORT: 'PASSPORT'
});

/**
 * Tipos de tiempo
 */
export const TimeType = Object.freeze({
  DAYS: 'DIAS',
  MONTHS: 'MESES',
  YEARS: 'AÑOS'
});

/**
 * Reglas de negocio
 */
export const BusinessRules = Object.freeze({
  MIN_ORDER_CODE_LENGTH: 3,
  MAX_ORDER_CODE_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_PHONE_LENGTH: 9,
  MAX_PHONE_LENGTH: 15
});

/**
 * Mensajes de error del dominio
 */
export const OrderMessages = Object.freeze({
  ID_REQUIRED: 'ID de orden es requerido',
  ORDER_CODE_REQUIRED: 'Código de orden es requerido',
  STATUS_REQUIRED: 'Estado es requerido',
  INVALID_STATUS: 'Estado inválido',
  CLIENT_REQUIRED: 'Cliente es requerido'
});

/**
 * Estado por defecto
 */
export const DefaultStatus = OrderStatus.PENDIENTE;

