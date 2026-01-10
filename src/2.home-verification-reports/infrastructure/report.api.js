import { BaseApi } from '../../shared-v2/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared-v2/infrastructure/base-endpoint.js';

const reportEndpointPath = '/web/reports';

/**
 * Servicio API para gestionar reportes de verificación.
 * Extiende BaseApi para proporcionar operaciones de consulta de reportes.
 * 
 * @class ReportApi
 * @extends {BaseApi}
 */
export class ReportApi extends BaseApi {
  #endpoint;

  constructor() {
    super();
    this.#endpoint = new BaseEndpoint(this, reportEndpointPath);
  }

  /**
   * Obtiene todos los reportes resumidos.
   * GET /api/v1/web/reports
   * @returns {Promise} Una promesa que se resuelve con la respuesta de reportes resumidos.
   */
  getAllSummaries() {
    return this.http.get(reportEndpointPath);
  }

  /**
   * Obtiene un reporte completo por ID.
   * GET /api/v1/web/reports/{id}
   * @param {string|number} id - El ID del reporte.
   * @returns {Promise} Una promesa que se resuelve con la respuesta del reporte.
   */
  getById(id) {
    const reportId = parseInt(id, 10);
    if (isNaN(reportId) || reportId <= 0) {
      throw new Error('El ID del reporte debe ser un número válido mayor a 0');
    }
    return this.http.get(`${reportEndpointPath}/${reportId}`);
  }

  /**
   * Actualiza la entrevista con el arrendador.
   * PATCH /api/v1/web/reports/order/{orderId}/landlord-interview
   * @param {string|number} orderId - El ID de la orden.
   * @param {Object} data - Los datos de la entrevista con el arrendador.
   * @returns {Promise} Una promesa que se resuelve con la respuesta de la actualización.
   */
  updateLandlordInterview(orderId, data) {
    const orderIdParsed = parseInt(orderId, 10);
    if (isNaN(orderIdParsed) || orderIdParsed <= 0) {
      throw new Error('El ID de la orden debe ser un número válido mayor a 0');
    }
    return this.http.patch(`${reportEndpointPath}/order/${orderIdParsed}/landlord-interview`, data);
  }
}
