/**
 * Constantes UI para órdenes de verificación.
 * Responsabilidad: Concerns de presentación (colores, traducciones, iconos).
 * NO deben estar en el dominio.
 */

import { OrderStatus } from '../../domain/constants/verification-order.constants.js';

/**
 * Traducciones de estados de orden para UI
 */
export const OrderStatusTranslations = Object.freeze({
  [OrderStatus.PENDIENTE]: 'Pendiente',
  [OrderStatus.ASIGNADO]: 'Asignado',
  [OrderStatus.EN_PROCESO]: 'En Proceso',
  [OrderStatus.COMPLETADA]: 'Completada',
  [OrderStatus.CANCELADA]: 'Cancelada',
  [OrderStatus.OBSERVADO]: 'Observado',
  [OrderStatus.SUBSANADA]: 'Subsanada'
});

/**
 * Colores por estado para componentes PrimeVue
 */
export const OrderStatusColors = Object.freeze({
  [OrderStatus.PENDIENTE]: 'warning',
  [OrderStatus.ASIGNADO]: 'info',
  [OrderStatus.EN_PROCESO]: 'primary',
  [OrderStatus.COMPLETADA]: 'success',
  [OrderStatus.CANCELADA]: 'danger',
  [OrderStatus.OBSERVADO]: 'help',
  [OrderStatus.SUBSANADA]: 'success'
});

/**
 * Iconos por estado (PrimeIcons)
 */
export const OrderStatusIcons = Object.freeze({
  [OrderStatus.PENDIENTE]: 'pi pi-clock',
  [OrderStatus.ASIGNADO]: 'pi pi-user',
  [OrderStatus.EN_PROCESO]: 'pi pi-spinner',
  [OrderStatus.COMPLETADA]: 'pi pi-check-circle',
  [OrderStatus.CANCELADA]: 'pi pi-times-circle',
  [OrderStatus.OBSERVADO]: 'pi pi-exclamation-triangle',
  [OrderStatus.SUBSANADA]: 'pi pi-check'
});

/**
 * Etiquetas UI para el módulo
 */
export const UILabels = Object.freeze({
  MODULE_TITLE: 'Órdenes de Verificación',
  MODULE_DESCRIPTION: 'Gestión y seguimiento de órdenes de verificación',
  title: 'Órdenes de Verificación',
  singular: 'Orden de Verificación',
  createButton: 'Nueva Orden',
  editButton: 'Editar',
  deleteButton: 'Eliminar',
  assignButton: 'Asignar Verificador',
  viewDetails: 'Ver Detalles'
});

/**
 * Columnas para la tabla de órdenes
 */
export const TableColumns = Object.freeze([
  { field: 'orderCode', header: 'Código', sortable: true },
  { field: 'clientName', header: 'Cliente', sortable: true },
  { field: 'status', header: 'Estado', sortable: true, template: 'status' },
  { field: 'companyName', header: 'Empresa', sortable: true },
  { field: 'verifierName', header: 'Verificador', sortable: true },
  { field: 'visitDateShort', header: 'Fecha de Visita', sortable: true }
]);

/**
 * Alias para compatibilidad
 */
export const StatusColors = OrderStatusColors;
export const StatusIcons = OrderStatusIcons;

/**
 * Opciones de filtro por estado
 */
export const StatusFilterOptions = Object.freeze(
  Object.entries(OrderStatusTranslations).map(([value, label]) => ({
    label,
    value
  }))
);

/**
 * Acciones disponibles en el DataManager
 */
export const DataManagerActions = Object.freeze({
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  ASSIGN: 'assign',
  VIEW: 'view'
});

/**
 * Etiquetas UI para el módulo (legacy)
 */
export const VerificationOrderUILabels = UILabels;