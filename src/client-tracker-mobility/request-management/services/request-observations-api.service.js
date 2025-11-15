
import http from "../../../shared/services/http-common.js";

export class RequestObservationsApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Actualizar parcial de detalles de la solicitud (/api/v1/orders/{orderId}/order-details)
    updateOrderDetails(orderId, data) {
        return http.patch(`${this.resourceEndpoint}/${orderId}/order-details`, data);
    }

    // Actualizar documentos asociados a la solicitud (/api/v1/orders/{orderId}/client/documents/{documentId})
    // Recibe FormData con:
    //   - file: archivo binario (puede estar vacío)
    //   - type: tipo de documento (FOTO_FACHADA_VIVIENDA, RECIBO_SERVICIO, DOCUMENTO_IDENTIDAD)
    updateDocument(orderId, documentId, formData) {
        return http.patch(`${this.resourceEndpoint}/${orderId}/client/documents/${documentId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    // /api/v1/orders/{orderId}/observations/{observationId} Actualizar observación de una orden
    updateObservation(orderId, observationId, data) {
        return http.patch(`${this.resourceEndpoint}/${orderId}/observations/${observationId}`, data);
    }


}