import { BaseApi } from '../../shared-v2/infrastructure/base-api.js';

/**
 * API para gestión de documentos de órdenes de verificación
 */
export class DocumentApi extends BaseApi {
  constructor() {
    super();
    this.baseEndpoint = '/verification-orders';
  }

  /**
   * Obtiene todos los documentos de una orden
   */
  async getAllByOrder(orderId) {
    return await this.get(`${this.baseEndpoint}/${orderId}/documents`);
  }

  /**
   * Obtiene un documento específico
   */
  async getById(orderId, documentId) {
    return await this.get(`${this.baseEndpoint}/${orderId}/documents/${documentId}`);
  }

  /**
   * Sube un nuevo documento
   */
  async upload(orderId, formData) {
    return await this.post(`${this.baseEndpoint}/${orderId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Actualiza un documento existente
   */
  async update(orderId, documentId, data) {
    return await this.put(`${this.baseEndpoint}/${orderId}/documents/${documentId}`, data);
  }

  /**
   * Elimina un documento
   */
  async delete(orderId, documentId) {
    return await this.remove(`${this.baseEndpoint}/${orderId}/documents/${documentId}`);
  }

  /**
   * Descarga un documento
   */
  async download(orderId, documentId) {
    return await this.get(`${this.baseEndpoint}/${orderId}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
  }
}
