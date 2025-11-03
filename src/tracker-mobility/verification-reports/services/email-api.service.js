import http from "../../../shared/services/http-common.js";

export class EmailApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    sendEmail(data) {
        return http.post(this.resourceEndpoint, data);
    }

}