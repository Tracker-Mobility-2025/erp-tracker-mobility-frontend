import http from "../../../shared/services/http-common.js";


export class ReportApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }


    // Retornar todos los reportes -> /api/v1/verification-reports
    getAll() {
        return http.get(this.resourceEndpoint);
    }

    // Retornar todos los reportes por ID de verificador -> /api/v1/verification-reports/verifier/{verifierId}
    getById(id) {
        return http.get(`${this.resourceEndpoint}/${id}`);
    }

    // Retornar todos los reportes por ID de verificador -> /api/v1/verification-reports/verifier/{verifierId}
    create(data) {
        return http.post(this.resourceEndpoint, data);
    }

    // Eliminar un reporte por ID -> /api/v1/verification-reports/{reportId}
    delete(id) {
        return http.delete(`${this.resourceEndpoint}/${id}`);
    }

    // Actualizar un reporte por ID -> /api/v1/verification-reports/{reportId}
    update(id, data) {
        return http.put(`${this.resourceEndpoint}/${id}`, data);
    }

    // Obtener todos los reportes en formato resumido -> /api/v1/reports/summary
    getAllSummary() {
        return http.get(`${this.resourceEndpoint}/summary`);
    }

}