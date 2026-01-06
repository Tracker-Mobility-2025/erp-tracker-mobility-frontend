import { OrderCode } from '../value-objects/order-code.vo.js';
import { OrderStatus, OrderMessages, BusinessRules } from '../constants/verification-order.constants.js';

/**
 * Command para crear una nueva orden de verificación.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 * 
 * @class CreateVerificationOrderCommand
 */
export class CreateVerificationOrderCommand {
  /**
   * Crea una instancia de CreateVerificationOrderCommand con validación obligatoria.
   * @param {Object} params - Parámetros del comando
   * @param {string} params.orderCode - Código de la orden
   * @param {string} [params.status] - Estado de la orden
   * @param {Date|string} [params.requestDate] - Fecha de solicitud
   * @param {number} params.clientId - ID del cliente
   * @param {number} params.applicantCompanyId - ID de la empresa solicitante
   * @param {number} [params.verifierId] - ID del verificador asignado
   * @param {Date|string} [params.visitDate] - Fecha de visita
   * @param {string} [params.visitTime] - Hora de visita
   * @param {string} [params.notes] - Notas adicionales
   * @throws {Error} Si los parámetros son inválidos
   */
  constructor({
    orderCode,
    status = OrderStatus.PENDIENTE,
    requestDate = new Date(),
    clientId,
    applicantCompanyId,
    verifierId = null,
    visitDate = null,
    visitTime = null,
    notes = null
  }) {
    // Validación obligatoria
    if (!orderCode) throw new Error(OrderMessages.ORDER_CODE_REQUIRED);
    if (!clientId) throw new Error(OrderMessages.CLIENT_REQUIRED);
    if (!applicantCompanyId) throw new Error('Empresa solicitante es requerida');
    
    // Validación de status
    if (status && !Object.values(OrderStatus).includes(status)) {
      throw new Error(OrderMessages.INVALID_STATUS);
    }

    // Usar Value Objects con validación automática
    this.orderCode = new OrderCode(orderCode);
    this.status = status;
    this.requestDate = requestDate instanceof Date ? requestDate : new Date(requestDate);
    this.clientId = clientId;
    this.applicantCompanyId = applicantCompanyId;
    this.verifierId = verifierId;
    this.visitDate = visitDate;
    this.visitTime = visitTime;
    this.notes = notes;
  }
}
