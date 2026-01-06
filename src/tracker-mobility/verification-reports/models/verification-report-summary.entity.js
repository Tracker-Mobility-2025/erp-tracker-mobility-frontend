/**
 * VerificationReportSummary Entity
 * @summary
 * Representa un resumen de reporte de verificación con información básica
 * para listados y vistas resumidas
 */
export class VerificationReportSummary {
    /**
     * Constructor
     * @param {Object} params - Parámetros del reporte resumido
     * @param {number} params.reportId - ID único del reporte
     * @param {string} params.reportCode - Código del reporte
     * @param {string} params.orderCode - Código de la orden asociada
     * @param {string} params.clientName - Nombre completo del cliente
     * @param {string} params.companyName - Nombre de la empresa solicitante
     * @param {string} params.requestDate - Fecha de solicitud (formato: YYYY-MM-DD)
     * @param {string} params.finalResult - Resultado final del reporte
     */
    constructor({
        reportId = 0,
        reportCode = '',
        orderCode = '',
        clientName = '',
        companyName = '',
        requestDate = null,
        finalResult = ''
    } = {}) {
        this.reportId = reportId;
        this.reportCode = reportCode;
        this.orderCode = orderCode;
        this.clientName = clientName;
        this.companyName = companyName;
        this.requestDate = requestDate;
        this.finalResult = finalResult;
    }

    /**
     * Formatear la fecha de solicitud
     * @returns {string} Fecha formateada o 'No disponible'
     */
    getRequestDateFormatted() {
        if (!this.requestDate) return 'No disponible';
        
        try {
            const date = new Date(this.requestDate + 'T00:00:00');
            return date.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        } catch (error) {
            return 'No disponible';
        }
    }

    /**
     * Obtener el texto del resultado para visualización
     * @returns {string} Resultado formateado
     */
    getFinalResultDisplay() {
        const resultMap = {
            'CONFORME': 'Conforme',
            'OBSERVADO': 'Observado',
            'RECHAZADO': 'Rechazado',
            'ENTREVISTA_ARRENDADOR_FALTANTE': 'Ent Faltante'
        };
        return resultMap[this.finalResult] || this.finalResult;
    }

    /**
     * Verificar si el reporte está conforme
     * @returns {boolean} True si está conforme
     */
    isConforme() {
        return this.finalResult === 'CONFORME';
    }

    /**
     * Verificar si el reporte está observado
     * @returns {boolean} True si está observado
     */
    isObservado() {
        return this.finalResult === 'OBSERVADO';
    }

    /**
     * Verificar si el reporte está rechazado
     * @returns {boolean} True si está rechazado
     */
    isRechazado() {
        return this.finalResult === 'RECHAZADO';
    }
}
