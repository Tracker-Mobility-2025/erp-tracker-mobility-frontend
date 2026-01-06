import http from "../../../shared/services/http-common.js";


export class OrderRequestApi {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAll() {
        return http.get(this.resourceEndpoint);
    }

    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    create(data) {
        return http.post(this.resourceEndpoint, data);
    }

    update(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Asignar un verificador a una orden de servicio
     * PATCH /api/v1/web/orders/{orderId}/assignment
     * @param {number} orderId - ID de la orden
     * @param {Object} data - Datos de asignación {verifierId: number, visitDate: string (YYYY-MM-DD), visitTime: string (HH:mm)}
     * @returns {Promise} Response con la orden actualizada
     */
    assignVerifier(orderId, data) {
        return http.patch(`/web${this.resourceEndpoint}/${orderId}/assignment`, data);
    }

    // Actualizar orden por Id
    updateOrderById(orderId, data) {
        return http.patch(`${this.resourceEndpoint}/${orderId}`, data);
    }


}