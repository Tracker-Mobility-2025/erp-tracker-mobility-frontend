import http from "../../../shared/services/http-common.js";


export class LandlordInterviewApiService {
    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    sendLandlordInterview(orderId, data) {
        return http.patch(`${this.resourceEndpoint}/${orderId}/landlord-interview`, data);
    }

}