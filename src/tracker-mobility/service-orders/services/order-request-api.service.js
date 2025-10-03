import axios from 'axios';

const http = axios.create({baseURL: "https://web-service-tracker-mobility-production.up.railway.app/api/v1"});

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

    // Asignar un verificador a una orden de servicio
    assignVerifier(orderId, data) {
        return http.post(`${this.resourceEndpoint}/${orderId}/assign-verifier`, data);
    }

    // Actualizar orden por Id
    updateOrderById(orderId, data) {
        return http.patch(`${this.resourceEndpoint}/${orderId}`, data);
    }


}