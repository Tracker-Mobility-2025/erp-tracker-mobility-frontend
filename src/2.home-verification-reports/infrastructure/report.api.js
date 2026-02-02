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

  /**
   * Actualiza un reporte de verificación (resultado, resumen, observaciones, etc.).
   * PATCH /api/v1/web/reports/{reportId}
   * @param {string|number} reportId - El ID del reporte.
   * @param {Object} data - Los datos actualizados del reporte.
   * @returns {Promise} Una promesa que se resuelve con la respuesta de la actualización.
   */
  updateReport(reportId, data) {
    const reportIdParsed = parseInt(reportId, 10);
    if (isNaN(reportIdParsed) || reportIdParsed <= 0) {
      throw new Error('El ID del reporte debe ser un número válido mayor a 0');
    }
    
    console.log('[ReportApi] DEBUG - updateReport:', {
      reportId: reportIdParsed,
      data
    });
    
    return this.http.patch(`${reportEndpointPath}/${reportIdParsed}`, data);
  }

  /**
   * Obtiene la URL de descarga del reporte de verificación domiciliaria (PDF).
   * GET /api/v1/web/reports/{reportId}/download-url
   * @param {string|number} reportId - El ID del reporte.
   * @returns {Promise} Una promesa que se resuelve con la URL de descarga.
   */
  async getReportDownloadUrl(reportId) {
    const reportIdParsed = parseInt(reportId, 10);
    if (isNaN(reportIdParsed) || reportIdParsed <= 0) {
      throw new Error('El ID del reporte debe ser un número válido mayor a 0');
    }
    try {
      const response = await this.http.get(`${reportEndpointPath}/${reportIdParsed}/download-url`);
      return response;
    } catch (error) {
      console.error('[ReportApi] Error getting report download URL:', error);
      throw error;
    }
  }

  /**
   * Actualiza un attachment (anexo) del reporte.
   * PATCH /api/v1/web/reports/{reportId}/attachment/{attachmentId}
   * @param {string|number} reportId - El ID del reporte.
   * @param {string|number} attachmentId - El ID del attachment.
   * @param {File} file - El archivo de imagen.
   * @param {string} type - El tipo de archivo.
   * @returns {Promise} Una promesa que se resuelve con la respuesta de la actualización.
   */
  async updateAttachment(reportId, attachmentId, file, type) {
    const reportIdParsed = parseInt(reportId, 10);
    const attachmentIdParsed = parseInt(attachmentId, 10);
    
    if (isNaN(reportIdParsed) || reportIdParsed <= 0) {
      throw new Error('El ID del reporte debe ser un número válido mayor a 0');
    }
    if (isNaN(attachmentIdParsed) || attachmentIdParsed <= 0) {
      throw new Error('El ID del attachment debe ser un número válido mayor a 0');
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log('[ReportApi] updateAttachment - Detalles:', {
      reportId: reportIdParsed,
      attachmentId: attachmentIdParsed,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    try {
      const response = await this.http.patch(
        `${reportEndpointPath}/${reportIdParsed}/attachment/${attachmentIdParsed}`,
        formData
      );
      console.log('[ReportApi] updateAttachment - Éxito:', response);
      return response;
    } catch (error) {
      console.error('[ReportApi] Error updating attachment:', error);
      throw error;
    }
  }

  /**
   * Actualiza la verificación domiciliaria completa.
   * PATCH /api/v1/mobile/reports/order/{orderId}/home-verification
   * @param {string|number} orderId - El ID de la orden.
   * @param {Object} data - Los datos de la verificación domiciliaria.
   * @returns {Promise} Una promesa que se resuelve con la respuesta de la actualización.
   */
  async updateHomeVerification(orderId, data) {
    const orderIdParsed = parseInt(orderId, 10);
    
    if (isNaN(orderIdParsed) || orderIdParsed <= 0) {
      throw new Error('El ID de la orden debe ser un número válido mayor a 0');
    }

    try {
      const response = await this.http.patch(
        `/mobile/reports/order/${orderIdParsed}/home-verification`,
        data
      );
      return response;
    } catch (error) {
      console.error('[ReportApi] Error updating home verification:', error);
      throw error;
    }
  }
}
