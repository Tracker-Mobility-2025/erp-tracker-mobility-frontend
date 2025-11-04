/**
 * Entidad que representa la respuesta del backend al generar un reporte de verificación en PDF
 * @class DownloadReport
 */
export class DownloadReport {
    /**
     * Crea una instancia de DownloadReport
     * @param {Object} params - Parámetros del reporte
     * @param {number|null} params.reportId - ID del reporte generado
     * @param {string|null} params.reportUrl - URL de descarga del PDF generado por el backend
     * @example
     * const report = new DownloadReport({
     *   reportId: 123,
     *   reportUrl: 'https://example.com/reports/123.pdf'
     * });
     */
    constructor({ reportId = null, reportUrl = null} = {}) {
        this.reportId = reportId;
        this.reportUrl = reportUrl;
    }

}