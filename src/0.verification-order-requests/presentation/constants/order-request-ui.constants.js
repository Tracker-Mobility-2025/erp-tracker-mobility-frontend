import { OrderRequestStatus, DocumentType } from '../../domain/constants/order-request.constants.js';
import { DateFormatter } from '../../../shared-v2/utils/date-formatter.js';

/**
 * Constantes de presentación para solicitudes de orden.
 */

/**
 * Traducciones de estados a español
 */
export const StatusTranslations = {
  [OrderRequestStatus.PENDING]: 'Pendiente',
  [OrderRequestStatus.IN_PROGRESS]: 'En Progreso',
  [OrderRequestStatus.COMPLETED]: 'Completada',
  [OrderRequestStatus.CANCELLED]: 'Cancelada',
  [OrderRequestStatus.REJECTED]: 'Rechazada'
};

/**
 * Clases CSS para estados
 */
export const StatusCssClasses = {
  [OrderRequestStatus.PENDING]: 'status-warning',
  [OrderRequestStatus.IN_PROGRESS]: 'status-info',
  [OrderRequestStatus.COMPLETED]: 'status-success',
  [OrderRequestStatus.CANCELLED]: 'status-danger',
  [OrderRequestStatus.REJECTED]: 'status-danger'
};

/**
 * Etiquetas de tipos de documento
 */
export const DocumentTypeLabels = {
  [DocumentType.DNI]: 'DNI',
  [DocumentType.CARNET_EXTRANJERIA]: 'Carnet de Extranjería',
  [DocumentType.PTP]: 'PTP'
};

/**
 * Etiquetas de UI
 */
export const OrderRequestUILabels = {
  title: {
    singular: 'solicitud de orden',
    plural: 'solicitudes de orden'
  },
  actions: {
    create: 'Nueva Solicitud',
    edit: 'Editar Solicitud',
    view: 'Ver Detalle',
    delete: 'Eliminar Solicitud',
    cancel: 'Cancelar Solicitud'
  },
  fields: {
    orderCode: 'Código de Orden',
    requestDate: 'Fecha de Solicitud',
    visitDate: 'Fecha de Visita',
    status: 'Estado',
    clientName: 'Cliente',
    observations: 'Observaciones'
  }
};

/**
 * Helper para formatear fechas (usa DateFormatter de shared-v2)
 * @param {string} dateString - Fecha en formato backend (yyyy-MM-dd)
 * @returns {string} Fecha formateada (dd/mm/yyyy)
 */
export const formatDate = (dateString) => {
  return DateFormatter.fromBackend(dateString);
};

/**
 * Helper para formatear fecha en formato legible
 * @param {string} dateString - Fecha en formato backend (yyyy-MM-dd)
 * @returns {string} Fecha en formato legible (ej: "15 de enero de 2024")
 */
export const formatDateReadable = (dateString) => {
  if (!dateString) return '';
  const formatted = DateFormatter.fromBackend(dateString);
  return DateFormatter.toReadableFormat(DateFormatter.toDateObject(formatted));
};
