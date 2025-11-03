import http from "../../../shared/services/http-common.js";

export class ObservationApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // crear una nueva observación: Se envía el id de la orden de servicio y los datos de la observación
    create(orderId, data) {
        return http.post(`${this.resourceEndpoint}/${orderId}/observations`, data);
    }




}