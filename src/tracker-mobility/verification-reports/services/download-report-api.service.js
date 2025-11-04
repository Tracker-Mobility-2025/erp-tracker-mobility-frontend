import http from "../../../shared/services/http-common.js";

/**
 * Servicio para gestionar la descarga y generación de reportes de verificación en formato PDF
 * @class DownloadReportApiService
 */
export class DownloadReportApiService {

    constructor(_resourceEndpoint) {
        this.resourceEndpoint = _resourceEndpoint;
    }

    /**
     * Genera un reporte de verificación en formato PDF y obtiene el enlace de descarga
     * @param {number|string} reportId - ID del reporte a generar
     * @returns {Promise<{reportId: number, reportUrl: string}>} Promesa con el objeto que contiene el ID del reporte y la URL de descarga
     * @example
     * const service = new DownloadReportApiService('/reports');
     * service.downloadReport(123)
     *   .then(response => {
     *     console.log(response.data.reportUrl); // URL del PDF generado
     *   });
     */
    downloadReport(reportId) {
        return http.post(`${this.resourceEndpoint}/${reportId}/generate-report`);
    }

}