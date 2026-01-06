/**
 * ServiceOrderSummary Entity
 * @summary
 * Representa un resumen de orden de servicio con información básica
 * para listados y vistas resumidas
 */
export class ServiceOrderSummary {
    /**
     * Constructor
     * @param {Object} params - Parámetros de la orden resumida
     * @param {number} params.id - ID único de la orden
     * @param {string} params.orderCode - Código de la orden
     * @param {string} params.clientName - Nombre completo del cliente
     * @param {string} params.status - Estado de la orden
     * @param {string} params.companyName - Nombre de la empresa solicitante
     * @param {number} params.verifierId - ID del verificador asignado
     * @param {string} params.verifierName - Nombre del verificador asignado
     * @param {string} params.visitDate - Fecha de visita (formato: YYYY-MM-DD)
     */
    constructor({
        id = 0,
        orderCode = '',
        clientName = '',
        status = '',
        companyName = '',
        verifierId = 0,
        verifierName = '',
        visitDate = null
    } = {}) {
        this.id = id;
        this.orderCode = orderCode;
        this.clientName = clientName;
        this.status = status;
        this.companyName = companyName;
        this.verifierId = verifierId;
        this.verifierName = verifierName;
        this.visitDate = visitDate;
    }

    /**
     * Obtener el nombre del verificador o estado pendiente
     * @returns {string} Nombre del verificador o 'PENDIENTE'
     */
    getVerifierDisplay() {
        return this.verifierName || 'PENDIENTE';
    }

    /**
     * Formatear la fecha de visita
     * @returns {string} Fecha formateada o 'PENDIENTE'
     */
    getVisitDateFormatted() {
        if (!this.visitDate) return 'PENDIENTE';
        
        try {
            const date = new Date(this.visitDate + 'T00:00:00');
            return date.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        } catch (error) {
            return 'PENDIENTE';
        }
    }

    /**
     * Verificar si tiene verificador asignado
     * @returns {boolean} True si tiene verificador asignado
     */
    hasVerifier() {
        return this.verifierId > 0 && this.verifierName !== '';
    }

    /**
     * Verificar si tiene fecha de visita programada
     * @returns {boolean} True si tiene fecha de visita
     */
    hasVisitDate() {
        return this.visitDate !== null && this.visitDate !== '';
    }
}
