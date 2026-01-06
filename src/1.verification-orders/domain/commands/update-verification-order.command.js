import { OrderStatus, OrderMessages } from '../constants/verification-order.constants.js';

/**
 * Command para actualizar una orden de verificación existente.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 * 
 * @class UpdateVerificationOrderCommand
 */
export class UpdateVerificationOrderCommand {
  /**
   * Crea una instancia de UpdateVerificationOrderCommand con validación obligatoria.
   * @param {Object} params - Parámetros del comando
   * @param {number} params.id - ID de la orden a actualizar
   * @param {string} [params.status] - Nuevo estado de la orden
   * @param {number} [params.verifierId] - ID del verificador
   * @param {Date|string} [params.visitDate] - Fecha de visita
   * @param {string} [params.visitTime] - Hora de visita
   * @param {string} [params.notes] - Notas adicionales
   * @param {number} [params.reportId] - ID del reporte asociado
   * @throws {Error} Si los parámetros son inválidos
   */
  constructor({
    id,
    status = null,
    verifierId = null,
    visitDate = null,
    visitTime = null,
    notes = null,
    reportId = null
  }) {
    // Validación obligatoria
    if (!id) throw new Error(OrderMessages.ID_REQUIRED);
    
    // Validación de status si se proporciona
    if (status && !Object.values(OrderStatus).includes(status)) {
      throw new Error(OrderMessages.INVALID_STATUS);
    }

    this.id = id;
    this.status = status;
    this.verifierId = verifierId;
    this.visitDate = visitDate;
    this.visitTime = visitTime;
    this.notes = notes;
    this.reportId = reportId;
  }
}
