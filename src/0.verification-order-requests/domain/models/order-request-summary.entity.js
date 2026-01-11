import { OrderRequestStatus, OrderRequestMessages } from '../constants/order-request.constants.js';

/**
 * Entidad de resumen de solicitud de orden (para listados).
 * Rich Domain Model con comportamiento de negocio encapsulado.
 * Versión ligera para operaciones de listado y filtrado.
 * 
 * @class OrderRequestSummary
 */
export class OrderRequestSummary {
  /**
   * Crea una instancia de OrderRequestSummary con validación obligatoria.
   * @param {Object} params - Parámetros de la solicitud
   * @param {number} params.id - Identificador único
   * @param {string} params.orderCode - Código de la orden
   * @param {string} params.requestDate - Fecha de solicitud
   * @param {string} params.status - Estado de la solicitud
   * @param {number} [params.obsPendientes=0] - Número de observaciones pendientes
   * @param {string} [params.visitDate] - Fecha de visita programada
   * @param {string} params.clientName - Nombre completo del cliente
   * @param {string} params.clientPhoneNumber - Teléfono del cliente
   * @throws {Error} Si los parámetros son inválidos
   */
  constructor({
    id,
    orderCode,
    requestDate,
    status,
    obsPendientes = 0,
    visitDate = null,
    clientName,
    clientPhoneNumber
  }) {
    // Validación obligatoria de campos requeridos
    if (!id) throw new Error(OrderRequestMessages.ID_REQUIRED);
    if (!orderCode) throw new Error(OrderRequestMessages.ORDER_CODE_REQUIRED);
    if (!status) throw new Error(OrderRequestMessages.STATUS_REQUIRED);
    if (!clientName) throw new Error(OrderRequestMessages.CLIENT_NAME_REQUIRED);

    this.id = id;
    this.orderCode = orderCode;
    this.requestDate = requestDate;
    this.status = status;
    this.obsPendientes = obsPendientes || 0;
    this.visitDate = visitDate;
    this.clientName = clientName;
    this.clientPhoneNumber = clientPhoneNumber;
  }

  /**
   * Verifica si la solicitud está pendiente.
   * @returns {boolean} True si el estado es PENDING
   */
  get isPending() {
    return this.status === OrderRequestStatus.PENDING;
  }

  /**
   * Verifica si la solicitud está en progreso.
   * @returns {boolean} True si el estado es IN_PROGRESS
   */
  get isInProgress() {
    return this.status === OrderRequestStatus.IN_PROGRESS;
  }

  /**
   * Verifica si la solicitud está completada.
   * @returns {boolean} True si el estado es COMPLETED
   */
  get isCompleted() {
    return this.status === OrderRequestStatus.COMPLETED;
  }

  /**
   * Verifica si la solicitud está cancelada.
   * @returns {boolean} True si el estado es CANCELLED
   */
  get isCancelled() {
    return this.status === OrderRequestStatus.CANCELLED;
  }

  /**
   * Verifica si hay observaciones pendientes.
   * @returns {boolean} True si hay al menos una observación pendiente
   */
  get hasPendingObservations() {
    return this.obsPendientes > 0;
  }

  /**
   * Verifica si tiene fecha de visita programada.
   * @returns {boolean} True si tiene visitDate
   */
  get hasScheduledVisit() {
    return !!this.visitDate;
  }

  /**
   * Obtiene una representación corta del código de orden.
   * @returns {string} Código abreviado
   */
  get shortOrderCode() {
    if (!this.orderCode) return '';
    return this.orderCode.length > 10 
      ? `${this.orderCode.substring(0, 10)}...` 
      : this.orderCode;
  }

  /**
   * Verifica si la solicitud requiere atención urgente.
   * (Tiene observaciones pendientes y no está completada)
   * @returns {boolean} True si requiere atención
   */
  get requiresAttention() {
    return this.hasPendingObservations && !this.isCompleted && !this.isCancelled;
  }
}
