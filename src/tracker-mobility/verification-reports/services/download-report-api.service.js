import http from "../../../shared/services/http-common.js";

/**
 * Servicio para gestionar la descarga y generación de reportes de verificación en formato PDF
 * @class DownloadReportApiService
 */
export class DownloadReportApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    // /api/v1/reports/{reportId}/download-url Obtener URL de descarga del reporte
    getReportDownloadUrl(reportId) {
        return http.get(`${this.resourceEndpoint}/${reportId}/download-url`);
    }

}