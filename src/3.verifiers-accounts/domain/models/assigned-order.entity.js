/**
 * Entidad de dominio para una orden asignada a un verificador
 * Representa la información resumida de una orden de verificación
 */
export class AssignedOrder {
    /**
     * @param {number} id - ID de la orden
     * @param {string} orderCode - Código de la orden
     * @param {string} addressStreet - Dirección de la orden
     * @param {string} visitDate - Fecha de visita (formato YYYY-MM-DD)
     * @param {string} status - Estado de la orden
     * @param {string} addressLocation - Ubicación de la dirección
     */
    constructor(id, orderCode, addressStreet, visitDate, status, addressLocation) {
        this.id = id;
        this.orderCode = orderCode;
        this.addressStreet = addressStreet;
        this.visitDate = visitDate;
        this.status = status;
        this.addressLocation = addressLocation;
    }

    /**
     * Valida si la entidad tiene datos válidos
     * @returns {boolean}
     */
    isValid() {
        return this.id > 0 && 
               this.orderCode && 
               this.orderCode.trim().length > 0;
    }

    /**
     * Obtiene la fecha de visita formateada
     * @returns {string} Fecha formateada (DD/MM/YYYY)
     */
    getFormattedVisitDate() {
        if (!this.visitDate) return 'No asignada';
        
        try {
            const [year, month, day] = this.visitDate.split('-');
            return `${day}/${month}/${year}`;
        } catch {
            return this.visitDate;
        }
    }

    /**
     * Obtiene el estado traducido
     * @returns {string}
     */
    getStatusLabel() {
        const statusMap = {
            'PENDIENTE': 'Pendiente',
            'ASIGNADO': 'Asignado',
            'EN_PROCESO': 'En Proceso',
            'COMPLETADA': 'Completada',
            'CANCELADA': 'Cancelada',
            'OBSERVADO': 'Observado',
            'SUBSANADA': 'Subsanada'
        };
        return statusMap[this.status] || this.status;
    }

    /**
     * Clona la entidad
     * @returns {AssignedOrder}
     */
    clone() {
        return new AssignedOrder(
            this.id,
            this.orderCode,
            this.addressStreet,
            this.visitDate,
            this.status,
            this.addressLocation
        );
    }
}
