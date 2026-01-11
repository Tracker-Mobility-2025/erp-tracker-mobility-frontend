// Order Request API Service
// Infrastructure layer - HTTP client for order requests

import { BaseApi } from '../../shared-v2/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared-v2/infrastructure/base-endpoint.js';

/**
 * Servicio API para gestionar solicitudes de órdenes de verificación.
 * Usa BaseApi y BaseEndpoint para consistencia con shared-v2.
 */
export class OrderRequestApi extends BaseApi {
  #endpoint;
  #companyEmployeesEndpoint;

  constructor() {
    super();
    this.#endpoint = new BaseEndpoint(this, '/web/orders');
    this.#companyEmployeesEndpoint = new BaseEndpoint(this, '/company-employees');
  }

  /**
   * Crea una nueva orden de servicio usando FormData para archivos
   * @param {Object} resource - Resource DTO (de CreateOrderRequestCommandAssembler)
   * @param {Array} files - Array de archivos a adjuntar
   * @returns {Promise} - Promise que resuelve con la respuesta de la orden
   */
  create(resource, files = []) {
    const formData = new FormData();

    // Log del recurso para debugging
    console.log('[OrderRequestApi] Resource to send:', JSON.stringify(resource, null, 2));
    console.log('[OrderRequestApi] Files to upload:', files.length, 'archivos');
    files.forEach((file, index) => {
      console.log(`  - Archivo ${index + 1}:`, file.name, `(${(file.size / 1024).toFixed(2)} KB)`, file.type);
    });

    // Añadir datos JSON como blob
    formData.append('order', new Blob([JSON.stringify(resource)], { type: 'application/json' }));
    
    // Añadir archivos al FormData
    files.forEach((file) => {
      if (file?.name) {
        formData.append('files', file);
      }
    });

    // Log de FormData para verificar contenido
    console.log('[OrderRequestApi] FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, value.name, `(${value.type})`);
      } else if (value instanceof Blob) {
        console.log(`  ${key}: Blob (${value.type})`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    // NO configurar Content-Type manualmente - axios lo configura con boundary automáticamente
    return this.http.post('/web/orders', formData)
      .then(response => {
        console.log('[OrderRequestApi] Success response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('[OrderRequestApi] Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        throw error;
      });
  }

  /**
   * Obtiene los datos de la empresa solicitante por username del empleado
   * @param {string} usernameEmployee - Username del empleado
   * @returns {Promise} - Promise que resuelve con los datos de la empresa
   */
  getApplicantCompanyByUsername(usernameEmployee) {
    return this.http.get(`/company-employees/by-username/${usernameEmployee}`);
  }

  /**
   * Obtiene todas las solicitudes de órdenes
   * @returns {Promise}
   */
  getAll() {
    return this.#endpoint.getAll();
  }

  /**
   * Obtiene una solicitud de orden por ID (endpoint de detalle web)
   * @param {number} id - ID de la solicitud
   * @returns {Promise}
   */
  getById(id) {
    return this.http.get(`/web/orders/${id}`);
  }

  /**
   * Obtiene órdenes por corporateEmail del ejecutivo solicitante
   * @param {string} corporateEmail - Email corporativo del ejecutivo
   * @returns {Promise}
   */
  getByCorporateEmail(corporateEmail) {
    return this.http.get(`/web/orders/corporateEmail/${corporateEmail}`);
  }

  /**
   * Actualiza una solicitud de orden existente
   * @param {number} id - ID de la solicitud
   * @param {Object} resource - Datos actualizados
   * @returns {Promise}
   */
  update(id, resource) {
    return this.http.put(`/web/orders/${id}`, resource);
  }

  /**
   * Elimina una solicitud de orden
   * @param {number} id - ID de la solicitud
   * @returns {Promise}
   */
  delete(id) {
    return this.http.delete(`/web/orders/${id}`);
  }
}
