import http from "../../../shared/services/http-common.js";

export class AdminApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retornar admin por userID
    getByUserId(id) {
        return http.get(`${this.resourceEndpoint}/user/${id}`);
    }
}