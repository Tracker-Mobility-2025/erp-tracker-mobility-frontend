import axios from "axios";
import { OrderResponse } from "../models/order-response.entity.js";

const http = axios.create({
    baseURL: "https://web-service-tracker-mobility-production.up.railway.app/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

// 🔓 NOTA: API sin autenticación por el momento
// 🔧 Para reactivar autenticación cuando la API esté lista, descomenta esto:
/*
http.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
*/

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
        // 🔧 Crear FormData como lo hace el HTML que funciona
        const formData = new FormData();
        
        // 🧹 Limpiar datos antes de enviar
        const cleanedClientData = {
            ...clientData,
            // Limpiar número de teléfono (quitar espacios y guiones)
            phoneNumber: clientData.phoneNumber ? clientData.phoneNumber.toString().replace(/[\s-]/g, '') : null,
            // Limpiar teléfono del arrendador si existe
            landlordPhoneNumber: clientData.landlordPhoneNumber ? clientData.landlordPhoneNumber.toString().replace(/[\s-]/g, '') : null,
            // Truncar dirección a máximo 300 caracteres
            homeAddress: clientData.homeAddress ? clientData.homeAddress.substring(0, 300) : null,
            documents: clientData.documents.map(doc => ({
                type: doc.type
                // No incluir el archivo aquí, se envía por separado
            }))
        };
        
        // Preparar los datos de la orden (sin archivos)
        const orderData = {
            applicantCompany: applicantCompanyData,
            client: cleanedClientData
        };
        
        // Añadir datos JSON como blob
        formData.append('order', new Blob([JSON.stringify(orderData)], { type: 'application/json' }));
        
        // Añadir archivos
        clientData.documents.forEach((doc, index) => {
            if (doc.file && doc.file.name) {
                formData.append('files', doc.file);
            } else {
                console.warn(`⚠️ [SERVICE] Documento ${index + 1} (${doc.type}) sin archivo válido:`, doc);
            }
        });
        
        // Enviar FormData (el Content-Type se establece automáticamente)
        return http.post(this.resourceEndpoint, formData, {
            headers: {
                // No establecer Content-Type, axios lo hará automáticamente para FormData
                'Content-Type': undefined
            }
        }).then(response => {
            // Transformar la respuesta usando el modelo
            response.data = new OrderResponse(response.data);
            return response;
        });
    }


}