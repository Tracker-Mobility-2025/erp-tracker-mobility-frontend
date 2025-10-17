import { OrderResponse } from "../models/order-response.entity.js";

import http from "../../../shared/services/http-common.js";

export class OrderServiceRequest {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    /**
     * Crea una nueva orden de servicio
     * @param {Object} applicantCompanyData - Datos de la empresa solicitante
     * @param {Object} clientData - Datos del cliente
     * @returns {Promise} - Promise que resuelve con OrderResponse
     */

    create(applicantCompanyData, clientData) {
        // Crear FormData para envío de archivos y datos
        const formData = new FormData();
        
        // Limpiar y validar datos antes de enviar
        const cleanedClientData = {
            ...clientData,
            // Limpiar números de teléfono (quitar espacios y guiones)
            phoneNumber: clientData.phoneNumber?.toString().replace(/[\s-]/g, '') || null,
            landlordPhoneNumber: clientData.landlordPhoneNumber?.toString().replace(/[\s-]/g, '') || null,
            // Truncar dirección a máximo 300 caracteres
            homeAddress: clientData.homeAddress?.substring(0, 300) || null,
            documents: clientData.documents.map(doc => ({
                type: doc.type
                // Archivo se envía por separado en FormData
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
        clientData.documents.forEach((doc, index) => {
            if (doc.file?.name) {
                formData.append('files', doc.file);
            } else {
                console.warn(`⚠️ [SERVICE] Documento ${index + 1} (${doc.type}) sin archivo válido:`, doc);
            }
        });
        
        // Enviar FormData - http-common.js maneja automáticamente el Content-Type
        return http.post(this.resourceEndpoint, formData)
            .then(response => {
                // Transformar respuesta usando el modelo
                response.data = new OrderResponse(response.data);
                return response;
            })
            .catch(error => {
                console.error('❌ [SERVICE] Error al crear orden de servicio:', error);
                throw error; // Re-lanzar para manejo en componente
            });
    }


}