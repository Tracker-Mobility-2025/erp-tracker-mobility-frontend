
import http from "../../../shared/services/http-common.js";

export class RequestObservationsApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Actualizar parcial de detalles de la solicitud (/api/v1/orders/{orderId}/order-details)
    /*
    Este endpoint recibe lo siguiente:
        {
          "applicantCompany": {
            "id": 0,
            "ruc": "string",
            "companyName": "string",
            "status": "ACTIVE"
          },
          "client": {
            "name": "string",
            "lastName": "string",
            "phoneNumber": "string",
            "isTenant": true,
            "landlord": {
              "fullName": "Luis García",
              "phoneNumber": "912345678"
            },
            "location": {
              "department": "string",
              "province": "string",
              "district": "string",
              "homeAddress": "string",
              "mapLocation": "https://maps.google.com/?q=-16.3998,-71.5369"
            }
          }
        }
     */
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
    /*
    Este endpoint recibe lo siguiente:

     */
    updateObservation(orderId, observationId, data) {
        return http.patch(`${this.resourceEndpoint}/${orderId}/observations/${observationId}`, data);
    }


}