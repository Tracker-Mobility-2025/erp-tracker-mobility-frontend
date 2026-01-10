// Order Request API Service
// Infrastructure layer - HTTP client for order requests

import http from '../../shared/services/http-common.js';

/**
 * Servicio API para gestionar solicitudes de órdenes de verificación
 */
export class OrderRequestApi {
  constructor() {
    this.resourceEndpoint = '/order-request';
    this.companyEmployeesEndpoint = '/company-employees';
  }

  /**
   * Crea una nueva orden de servicio
   * @param {Object} applicantCompanyData - Datos de la empresa solicitante
   * @param {Object} clientData - Datos del cliente
   * @returns {Promise} - Promise que resuelve con la respuesta de la orden
   */
  create(applicantCompanyData, clientData) {
    const formData = new FormData();
    
    // Limpiar y validar datos antes de enviar
    const cleanedClientData = {
      ...clientData,
      phoneNumber: clientData.phoneNumber?.toString().replace(/[\s-]/g, '') || null,
      landlordPhoneNumber: clientData.landlordPhoneNumber?.toString().replace(/[\s-]/g, '') || null,
      homeAddress: clientData.homeAddress?.substring(0, 300) || null,
      documents: clientData.documents.map(doc => ({
        type: doc.type
      }))
    };
    
    // Preparar datos de la orden
    const orderData = {
      applicantCompany: applicantCompanyData,
      client: cleanedClientData
    };

    // Añadir datos JSON como blob
    formData.append('order', new Blob([JSON.stringify(orderData)], { type: 'application/json' }));
    
    // Añadir archivos al FormData
    clientData.documents.forEach((doc) => {
      if (doc.file?.name) {
        formData.append('files', doc.file);
      }
    });

    return http.post(this.resourceEndpoint, formData);
  }

  /**
   * Obtiene los datos de la empresa solicitante por username del empleado
   * @param {string} usernameEmployee - Username del empleado
   * @returns {Promise} - Promise que resuelve con los datos de la empresa
   */
  getApplicantCompanyByUsername(usernameEmployee) {
    return http.get(`${this.companyEmployeesEndpoint}/by-username/${usernameEmployee}`);
  }

  /**
   * Obtiene todas las solicitudes de órdenes
   * @returns {Promise}
   */
  getAll() {
    return http.get(this.resourceEndpoint);
  }

  /**
   * Obtiene una solicitud de orden por ID
   * @param {number} id - ID de la solicitud
   * @returns {Promise}
   */
  getById(id) {
    return http.get(`${this.resourceEndpoint}/${id}`);
  }

  /**
   * Obtiene órdenes por corporateEmail del ejecutivo solicitante
   * @param {string} corporateEmail - Email corporativo del ejecutivo
   * @returns {Promise}
   */
  getByCorporateEmail(corporateEmail) {
    return http.get(`/orders/corporateEmail/${corporateEmail}`);
  }
}
