import { BaseApi } from '../../shared-v2/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared-v2/infrastructure/base-endpoint.js';

/**
 * Servicio API para gestionar recursos de órdenes (summary).
 * Extiende BaseApi para proporcionar operaciones de consulta de resúmenes.
 * 
 * @class OrderApi
 * @extends {BaseApi}
 */
export class OrderApi extends BaseApi {
  #endpoint;

  constructor() {
    super();
    this.#endpoint = new BaseEndpoint(this, '/orders');
  }

  /**
   * Obtiene todas las órdenes en formato resumido desde /api/v1/web/orders
   * @returns {Promise} Una promesa que se resuelve con la respuesta de órdenes resumidas.
   */
  getAllSummary() {
    return this.http.get(`/web${this.#endpoint.endpointPath}`);
  }

  /**
   * Obtiene una orden resumida por ID
   * @param {string|number} id - El ID de la orden.
   * @returns {Promise} Una promesa que se resuelve con la respuesta de la orden.
   */
  getSummaryById(id) {
    return this.#endpoint.http.get(`${this.#endpoint.endpointPath}/summary/${id}`);
  }

  /**
   * Obtiene una orden completa por ID desde /api/v1/web/orders/{orderId}
   * @param {string|number} id - El ID de la orden.
   * @returns {Promise} Una promesa que se resuelve con la respuesta de la orden completa.
   */
  getById(id) {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId) || orderId <= 0) {
      throw new Error('El ID de la orden debe ser un número válido mayor a 0');
    }
    return this.http.get(`/web${this.#endpoint.endpointPath}/${orderId}`);
  }
}
