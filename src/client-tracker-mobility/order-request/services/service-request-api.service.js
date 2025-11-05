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
        console.log('Creando orden de servicio:', {
            empresa: applicantCompanyData.companyName,
            cliente: `${clientData.name} ${clientData.lastName}`,
            documentos: clientData.documents.length
        });

        // Crear FormData para envío de archivos y datos
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
            } else {
                console.warn('Documento sin archivo válido:', doc.type);
            }
        });

        console.log(`Enviando solicitud a ${this.resourceEndpoint}`);

        // Enviar FormData
        return http.post(this.resourceEndpoint, formData)
            .then(response => {
                console.log('Respuesta recibida:', {
                    status: response.status,
                    orderCode: response.data.orderCode
                });

                response.data = new OrderResponse(response.data);
                return response;
            })
            .catch(error => {
                console.error('Error al crear orden:', {
                    status: error.response?.status,
                    message: error.response?.data?.message || error.message
                });
                throw error;
            });
    }


}