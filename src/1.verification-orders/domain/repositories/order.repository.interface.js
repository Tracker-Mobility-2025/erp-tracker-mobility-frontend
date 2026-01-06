/**
 * Interface del repositorio de órdenes de verificación.
 * Define el contrato sin implementación (Puerto en Arquitectura Hexagonal).
 * La capa de dominio define WHAT, la infraestructura implementa HOW.
 * 
 * @interface IOrderRepository
 */
export class IOrderRepository {
  /**
   * Obtiene todas las órdenes en formato resumido.
   * @returns {Promise<Array<ServiceOrderSummary>>} Lista de resúmenes de órdenes
   * @throws {Error} Method not implemented
   */
  async findAllSummaries() {
    throw new Error('Method not implemented: findAllSummaries');
  }

  /**
   * Busca una orden completa por su ID.
   * @param {number} orderId - ID de la orden
   * @returns {Promise<OrderDetail|null>} Orden completa o null
   * @throws {Error} Method not implemented
   */
  async findById(orderId) {
    throw new Error('Method not implemented: findById');
  }

  /**
   * Asigna un verificador a una orden.
   * @param {number} orderId - ID de la orden
   * @param {Object} assignmentData - Datos de asignación {verifierId, visitDate, visitTime}
   * @returns {Promise<void>}
   * @throws {Error} Method not implemented
   */
  async assignVerifier(orderId, assignmentData) {
    throw new Error('Method not implemented: assignVerifier');
  }

  /**
   * Crea una observación para una orden.
   * @param {number} orderId - ID de la orden
   * @param {Object} observationData - Datos de observación {observationType, description}
   * @returns {Promise<Observation>} Observación creada
   * @throws {Error} Method not implemented
   */
  async createObservation(orderId, observationData) {
    throw new Error('Method not implemented: createObservation');
  }
}
