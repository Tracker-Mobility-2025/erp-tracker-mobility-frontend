import { BaseApi } from "../../shared-v2/infrastructure/base-api.js";

/**
 * Servicio API para gestionar observaciones de órdenes.
 * Extiende BaseApi para usar funcionalidad común.
 */
export class ObservationApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * Obtiene todas las observaciones de una orden
   * @param {number} orderId - ID de la orden
   */
  getAllByOrder(orderId) {
    return this.get(`/verification-orders/${orderId}/observations`);
  }

  /**
   * Obtiene una observación por ID
   * @param {number} orderId - ID de la orden
   * @param {number} observationId - ID de la observación
   */
  getById(orderId, observationId) {
    return this.get(`/verification-orders/${orderId}/observations/${observationId}`);
  }

  /**
   * Crea una nueva observación
   * @param {number} orderId - ID de la orden
   * @param {Object} command - Comando de creación
   */
  create(orderId, command) {
    return this.post(`/verification-orders/${orderId}/observations`, command);
  }

  /**
   * Actualiza el estado de una observación
   * @param {number} orderId - ID de la orden
   * @param {number} observationId - ID de la observación
   * @param {Object} command - Comando de actualización
   */
  updateStatus(orderId, observationId, command) {
    return this.put(`/verification-orders/${orderId}/observations/${observationId}/status`, command);
  }

  /**
   * Elimina una observación
   * @param {number} orderId - ID de la orden
   * @param {number} observationId - ID de la observación
   */
  delete(orderId, observationId) {
    return super.delete(`/verification-orders/${orderId}/observations/${observationId}`);
  }
}
