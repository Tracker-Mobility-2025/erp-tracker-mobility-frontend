import http from "../../../shared/services/http-common.js";



export class VerifierApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retornar todos los verificadores por ID de admin -> /api/v1/verifiers/admin/{adminId}
    getAllByAdminId(adminId) {
        return http.get(`${this.resourceEndpoint}/admin/${adminId}`);
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


    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    update(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    //Recuperar órdenes asignadas por ID
    getAssignedOrders(verifierId) {
        return http.get(`${this.resourceEndpoint}/${verifierId}`);
    }

}


