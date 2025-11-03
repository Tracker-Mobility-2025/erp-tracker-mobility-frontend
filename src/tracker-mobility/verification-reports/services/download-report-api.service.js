import http from "../../../shared/services/http-common.js";


export class DownloadReportApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // Método para obtener el enlace de descarga del reporte PDF
    downloadReport(reportId) {
        return http.post(`${this.resourceEndpoint}/${reportId}/generate-report`);
    }

}