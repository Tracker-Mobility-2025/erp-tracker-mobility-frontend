import http from "../../../shared/services/http-common.js";


export class VerificationRequestsApi {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Retornar solicitudes de verificación por correo corporativo de empleado de empresa
    getVerificationRequestsByEmployeeEmail(employeeEmail) {
        return http.get(`${this.resourceEndpoint}/corporateEmail/${employeeEmail}`);
    }

    // Obtener solicitud de verificación por ID
    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    // Actualizar solicitud de verificación
    update(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }


}