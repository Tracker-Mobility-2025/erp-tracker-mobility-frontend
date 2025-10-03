
import axios from "axios";

const http = axios.create({baseURL: "https://web-service-tracker-mobility-production.up.railway.app/api/v1"});

export class ClientTrackerApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    getAll() {
        return http.get(this.resourceEndpoint);
    }

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




}