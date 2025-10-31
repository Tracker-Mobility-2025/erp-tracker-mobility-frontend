import http from "../../../shared/services/http-common.js";


export class VerificationRequestsApi {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retornar solicitudes de verificación por correo corporativo de empleado de empresa
    getVerificationRequestsByEmployeeEmail(employeeEmail) {
        return http.get(`${this.resourceEndpoint}/corporateEmail/${employeeEmail}`);
    }


}