import axios from "axios";

const http = axios.create({baseURL: "https://web-service-tracker-mobility-production.up.railway.app/api/v1"});


export class VerifierApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retornar todos los verificadores por ID de admin -> /api/v1/verifiers/admin/{adminId}
    getAllByAdminId(adminId) {
        return http.get(`${this.resourceEndpoint}/admin/${adminId}`);
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


