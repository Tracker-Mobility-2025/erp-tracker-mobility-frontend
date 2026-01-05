/**
 * Constantes del dominio de órdenes de verificación.
 * Define reglas de negocio, enums y mensajes del dominio.
 */

// Estados de la orden
export const OrderStatus = {
    PENDIENTE: 'PENDIENTE',
    ASIGNADO: 'ASIGNADO',
    EN_PROCESO: 'EN_PROCESO',
    COMPLETADA: 'COMPLETADA',
    CANCELADA: 'CANCELADA',
    OBSERVADO: 'OBSERVADO',
    SUBSANADA: 'SUBSANADA'
};

// Tipos de documento
export const DocumentType = {
    DNI: 'DNI',
    CE: 'CE',
    PASSPORT: 'PASSPORT'
};

// Tipos de tiempo
export const TimeType = {
    DAYS: 'DIAS',
    MONTHS: 'MESES',
    YEARS: 'AÑOS'
};

// Reglas de negocio
export const BusinessRules = {
    MIN_ORDER_CODE_LENGTH: 3,
    MAX_ORDER_CODE_LENGTH: 50,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    MIN_PHONE_LENGTH: 9,
    MAX_PHONE_LENGTH: 15
};

// Mensajes de error del dominio
export const OrderMessages = {
    ID_REQUIRED: 'ID de orden es requerido',
    ORDER_CODE_REQUIRED: 'Código de orden es requerido',
    STATUS_REQUIRED: 'Estado es requerido',
    INVALID_STATUS: 'Estado inválido',
    CLIENT_REQUIRED: 'Cliente es requerido'
};

// Estado por defecto
export const DefaultStatus = OrderStatus.PENDIENTE;

// Traducciones de estado
export const OrderStatusTranslations = {
    [OrderStatus.PENDIENTE]: 'Pendiente',
    [OrderStatus.ASIGNADO]: 'Asignado',
    [OrderStatus.EN_PROCESO]: 'En Proceso',
    [OrderStatus.COMPLETADA]: 'Completada',
    [OrderStatus.CANCELADA]: 'Cancelada',
    [OrderStatus.OBSERVADO]: 'Observado',
    [OrderStatus.SUBSANADA]: 'Subsanada'
};

// Colores por estado
export const OrderStatusColors = {
    [OrderStatus.PENDIENTE]: 'warning',
    [OrderStatus.ASIGNADO]: 'info',
    [OrderStatus.EN_PROCESO]: 'primary',
    [OrderStatus.COMPLETADA]: 'success',
    [OrderStatus.CANCELADA]: 'danger',
    [OrderStatus.OBSERVADO]: 'help',
    [OrderStatus.SUBSANADA]: 'success'
};
