import http from "../../../shared/services/http-common.js";

export class ObservationApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    /**
     * Crear una nueva observación para una orden
     * POST /api/v1/web/orders/{orderId}/observations
     * @param {number} orderId - ID de la orden
     * @param {Object} data - Datos de la observación {observationType: string, description: string}
     * @returns {Promise} Response con la observación creada
     */
    create(orderId, data) {
        return http.post(`/web${this.resourceEndpoint}/${orderId}/observations`, data);
    }

}