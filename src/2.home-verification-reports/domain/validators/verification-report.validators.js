import { DateValidator as SharedDateValidator } from '../../../shared-v2/utils/date-validator.js';

/**
 * Validadores del dominio para reportes de verificación.
 * Encapsulan reglas de negocio reutilizables.
 * Reutiliza DateValidator de shared-v2 para consistencia en validaciones de fechas.
 */
export class VerificationReportValidators {
  /**
   * Valida que un ID sea un número válido mayor a 0.
   * @param {*} id - El ID a validar
   * @returns {boolean}
   */
  static isValidId(id) {
    const numericId = parseInt(id, 10);
    return !isNaN(numericId) && numericId > 0;
  }

  /**
   * Valida que un string no esté vacío.
   * @param {string} value - El valor a validar
   * @returns {boolean}
   */
  static isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  /**
   * Valida que el nombre del verificador cumpla con los requisitos.
   * @param {string} verifierName - El nombre del verificador
   * @returns {boolean}
   */
  static isValidVerifierName(verifierName) {
    return this.isNonEmptyString(verifierName) && verifierName.trim().length >= 3;
  }

  /**
   * Valida que el nombre del cliente cumpla con los requisitos.
   * @param {string} clientName - El nombre del cliente
   * @returns {boolean}
   */
  static isValidClientName(clientName) {
    return this.isNonEmptyString(clientName) && clientName.trim().length >= 2;
  }

  /**
   * Valida que una fecha sea válida y no nula.
   * Delega a DateValidator de shared-v2 para consistencia.
   * @param {Date|string} date - La fecha a validar
   * @returns {boolean}
   */
  static isValidDate(date) {
    return SharedDateValidator.isValidDate(date);
  }

  /**
   * Valida que el resultado final sea uno de los valores permitidos.
   * @param {string} finalResult - El resultado final
   * @returns {boolean}
   */
  static isValidFinalResult(finalResult) {
    const allowedResults = [
      'FAVORABLE',
      'NO_FAVORABLE',
      'OBSERVADO',
      'ENTREVISTA_ARRENDADOR_FALTANTE'
    ];
    return allowedResults.includes(finalResult);
  }

  /**
   * Valida que los datos de la entrevista con el arrendador estén completos.
   * @param {Object} interviewData - Los datos de la entrevista
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  static validateLandlordInterview(interviewData) {
    const errors = [];

    if (!interviewData) {
      errors.push('Los datos de la entrevista son requeridos');
      return { isValid: false, errors };
    }

    if (!this.isNonEmptyString(interviewData.tenantName)) {
      errors.push('El nombre del inquilino es requerido');
    }

    if (!this.isNonEmptyString(interviewData.ownHouse)) {
      errors.push('El campo "Casa propia" es requerido');
    }

    if (!this.isNonEmptyString(interviewData.serviceClientPays)) {
      errors.push('El campo "Servicio que paga el cliente" es requerido');
    }

    if (!this.isNonEmptyString(interviewData.clientPaysPunctual)) {
      errors.push('El campo "¿El cliente paga puntual?" es requerido');
    }

    if (!this.isNonEmptyString(interviewData.clientRentalTime)) {
      errors.push('El tiempo de arrendamiento es requerido');
    }

    if (!this.isNonEmptyString(interviewData.clientFloorNumber)) {
      errors.push('El piso ocupado por el cliente es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida los datos mínimos para crear un reporte.
   * @param {Object} reportData - Los datos del reporte
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  static validateCreateReport(reportData) {
    const errors = [];

    if (!reportData) {
      errors.push('Los datos del reporte son requeridos');
      return { isValid: false, errors };
    }

    if (!this.isValidId(reportData.orderId)) {
      errors.push('El ID de la orden es inválido');
    }

    if (!this.isValidVerifierName(reportData.verifierName)) {
      errors.push('El nombre del verificador es inválido o muy corto');
    }

    if (!this.isValidClientName(reportData.clientName)) {
      errors.push('El nombre del cliente es inválido o muy corto');
    }

    if (!this.isValidClientName(reportData.clientLastName)) {
      errors.push('El apellido del cliente es inválido o muy corto');
    }

    if (!this.isValidDate(reportData.visitDate)) {
      errors.push('La fecha de visita es inválida');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
