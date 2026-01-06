/**
 * Entidad de dominio: ServiceOrderSummary
 * Representa un resumen de orden de servicio para listados.
 * Rich Domain Model con comportamiento de negocio encapsulado.
 */
export class ServiceOrderSummary {
  /**
   * Crea una instancia de ServiceOrderSummary con validación obligatoria.
   * @param {Object} params - Parámetros del resumen de orden
   * @param {number} params.id - ID de la orden
   * @param {string} params.orderCode - Código de la orden
   * @param {string} params.clientName - Nombre del cliente
   * @param {string} params.status - Estado de la orden
   * @param {string} params.companyName - Nombre de la empresa solicitante
   * @param {number} [params.verifierId] - ID del verificador asignado
   * @param {string} [params.verifierName] - Nombre del verificador
   * @param {Date|string} [params.visitDate] - Fecha de visita programada
   * @throws {Error} Si los parámetros obligatorios son inválidos
   */
  constructor({
    id,
    orderCode,
    clientName,
    status,
    companyName,
    verifierId = null,
    verifierName = null,
    visitDate = null
  }) {
    // Validaciones obligatorias
    if (!id) throw new Error('ID es requerido');
    if (!orderCode) throw new Error('Código de orden es requerido');
    if (!clientName) throw new Error('Nombre de cliente es requerido');
    if (!status) throw new Error('Estado es requerido');
    if (!companyName) throw new Error('Nombre de empresa es requerido');

    this.id = id;
    this.orderCode = orderCode;
    this.clientName = clientName;
    this.status = status;
    this.companyName = companyName;
    this.verifierId = verifierId;
    this.verifierName = verifierName;
    this.visitDate = visitDate ? new Date(visitDate) : null;
  }

  /**
   * Verifica si la orden tiene verificador asignado
   * @returns {boolean} True si tiene verificador
   */
  get hasVerifier() {
    return Boolean(this.verifierId);
  }

  /**
   * Verifica si la orden tiene visita programada
   * @returns {boolean} True si tiene fecha de visita
   */
  get hasScheduledVisit() {
    return Boolean(this.visitDate);
  }

  /**
   * Obtiene la fecha de visita formateada
   * @returns {string|null} Fecha formateada o null
   */
  get visitDateFormatted() {
    if (!this.visitDate) return null;
    return this.visitDate.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Obtiene la fecha de visita en formato corto (dd/mm/aaaa)
   * @returns {string|null} Fecha en formato corto o null
   */
  get visitDateShort() {
    if (!this.visitDate) return null;
    const day = String(this.visitDate.getDate()).padStart(2, '0');
    const month = String(this.visitDate.getMonth() + 1).padStart(2, '0');
    const year = this.visitDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Verifica si la visita es hoy
   * @returns {boolean} True si la visita es hoy
   */
  get isVisitToday() {
    if (!this.visitDate) return false;
    const today = new Date();
    return this.visitDate.toDateString() === today.toDateString();
  }

  /**
   * Verifica si la visita está vencida
   * @returns {boolean} True si la visita está vencida
   */
  get isVisitOverdue() {
    if (!this.visitDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.visitDate < today;
  }

  /**
   * Obtiene información del verificador
   * @returns {Object|null} Objeto con info del verificador o null
   */
  get verifierInfo() {
    if (!this.hasVerifier) return null;
    return {
      id: this.verifierId,
      name: this.verifierName || 'Sin nombre'
    };
  }

  /**
   * Convierte la entidad a objeto plano para serialización
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      orderCode: this.orderCode,
      clientName: this.clientName,
      status: this.status,
      companyName: this.companyName,
      verifierId: this.verifierId,
      verifierName: this.verifierName,
      visitDate: this.visitDate
    };
  }
}
