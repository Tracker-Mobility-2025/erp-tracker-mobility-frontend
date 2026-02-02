/**
 * Enum para el resultado final del reporte.
 * @deprecated Usar FinalResult Value Object en su lugar
 */
export const FinalResultEnum = Object.freeze({
  CONFORME: 'CONFORME',
  OBSERVADO: 'OBSERVADO',
  RECHAZADO: 'RECHAZADO',
  ENTREVISTA_ARRENDADOR_FALTANTE: 'ENTREVISTA_ARRENDADOR_FALTANTE'
});

/**
 * Entidad de dominio para resumen de reporte de verificación.
 * Representa un reporte en formato resumido para listados.
 */
export class ReportSummary {
  constructor({
    reportId,
    reportCode,
    finalResult,
    isResultValid,
    orderCode,
    requestDate,
    clientName,
    companyName
  }) {
    // Validaciones
    if (!reportId) {
      throw new Error('El ID del reporte es requerido');
    }
    if (!reportCode || reportCode.trim() === '') {
      throw new Error('El código del reporte es requerido');
    }

    this.reportId = reportId;
    this.reportCode = reportCode;
    this.finalResult = finalResult; // Estado: FinalResultEnum o string
    this.isResultValid = isResultValid === true; // Boolean: indica si el resultado está validado
    this.orderCode = orderCode;
    this.requestDate = requestDate;
    this.clientName = clientName;
    this.companyName = companyName;
  }

  /**
   * Valida si la entidad es válida
   */
  isValid() {
    return this.reportId && this.reportCode;
  }

  /**
   * Obtiene el estado formateado
   */
  getStatus() {
    return this.finalResult || FinalResultEnum.ENTREVISTA_ARRENDADOR_FALTANTE;
  }

  /**
   * Verifica si el resultado requiere completar la entrevista con el arrendador
   * @returns {boolean}
   */
  requiresLandlordInterview() {
    return this.finalResult === FinalResultEnum.ENTREVISTA_ARRENDADOR_FALTANTE;
  }

  /**
   * Verifica si el reporte puede ser exportado
   * @returns {boolean}
   */
  canBeExported() {
    return this.isResultValid && !this.requiresLandlordInterview();
  }

  /**
   * Verifica si está conforme
   * @returns {boolean}
   */
  isConforme() {
    return this.finalResult === FinalResultEnum.CONFORME;
  }

  /**
   * Verifica si está observado
   * @returns {boolean}
   */
  isObservado() {
    return this.finalResult === FinalResultEnum.OBSERVADO;
  }

  /**
   * Verifica si está rechazado
   * @returns {boolean}
   */
  isRechazado() {
    return this.finalResult === FinalResultEnum.RECHAZADO;
  }
}
