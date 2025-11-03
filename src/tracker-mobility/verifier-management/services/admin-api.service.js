import http from "../../../shared/services/http-common.js";

export class AdminApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retornar admin por userID
    getByUserId(userId) {
        return http.get(`${this.resourceEndpoint}/user/${userId}`);
    }


}