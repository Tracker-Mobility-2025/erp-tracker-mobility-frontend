import { OrderMessages } from '../constants/verification-order.constants.js';

/**
 * Command para crear una observación en una orden.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 * 
 * @class CreateObservationCommand
 */
export class CreateObservationCommand {
  /**
   * Crea una instancia de CreateObservationCommand con validación obligatoria.
   * @param {Object} params - Parámetros del comando
   * @param {number} params.orderId - ID de la orden
   * @param {string} params.observationType - Tipo de observación
   * @param {string} params.description - Descripción de la observación
   * @throws {Error} Si los parámetros son inválidos
   */
  constructor({
    orderId,
    observationType,
    description
  }) {
    // Validación obligatoria
    if (!orderId || orderId <= 0) {
      throw new Error(OrderMessages.ID_REQUIRED);
    }
    if (!observationType || observationType.trim() === '') {
      throw new Error('Tipo de observación es requerido');
    }
    if (!description || description.trim() === '') {
      throw new Error('Descripción es requerida');
    }
    if (description.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }
    if (description.trim().length > 500) {
      throw new Error('La descripción no puede exceder 500 caracteres');
    }

    this.orderId = orderId;
    this.observationType = observationType.trim();
    this.description = description.trim();
  }
}
