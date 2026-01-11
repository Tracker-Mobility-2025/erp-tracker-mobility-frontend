import { OrderStatus, BusinessRules } from '../constants/verification-order.constants.js';
import { DateValidator } from '../../../shared-v2/utils/date-validator.js';

/**
 * Validadores del dominio de órdenes de verificación.
 * Funciones de validación reutilizables sin dependencias de UI.
 * Domain Layer - Validation logic.
 * 
 * @class OrderValidators
 */
export class OrderValidators {
  /**
   * Valida si un código de orden tiene formato válido.
   * @param {string} orderCode - Código de orden a validar
   * @returns {boolean} True si es válido
   */
  static isValidOrderCode(orderCode) {
    if (!orderCode || typeof orderCode !== 'string') {
      return false;
    }
    const trimmed = orderCode.trim();
    return trimmed.length >= BusinessRules.MIN_ORDER_CODE_LENGTH && 
           trimmed.length <= BusinessRules.MAX_ORDER_CODE_LENGTH;
  }

  /**
   * Valida si un estado es válido según el dominio.
   * @param {string} status - Estado a validar
   * @returns {boolean} True si es un estado válido
   */
  static isValidStatus(status) {
    return Object.values(OrderStatus).includes(status);
  }

  /**
   * Valida si una fecha de visita es válida (debe ser futura o hoy).
   * Usa utilidad de shared-v2 para validación consistente en todo el proyecto.
   * @param {Date|string} visitDate - Fecha a validar
   * @returns {boolean} True si es válida
   */
  static isValidVisitDate(visitDate) {
    if (!visitDate) {
      return false;
    }
    
    return DateValidator.isTodayOrFuture(visitDate);
  }

  /**
   * Valida si un nombre tiene longitud válida.
   * @param {string} name - Nombre a validar
   * @returns {boolean} True si es válido
   */
  static isValidName(name) {
    if (!name || typeof name !== 'string') {
      return false;
    }
    const trimmed = name.trim();
    return trimmed.length >= BusinessRules.MIN_NAME_LENGTH && 
           trimmed.length <= BusinessRules.MAX_NAME_LENGTH;
  }

  /**
   * Valida si un número telefónico tiene longitud válida.
   * @param {string} phoneNumber - Número telefónico a validar
   * @returns {boolean} True si es válido
   */
  static isValidPhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return false;
    }
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= BusinessRules.MIN_PHONE_LENGTH && 
           cleaned.length <= BusinessRules.MAX_PHONE_LENGTH;
  }

  /**
   * Valida si un ID es válido (número positivo).
   * @param {number} id - ID a validar
   * @returns {boolean} True si es válido
   */
  static isValidId(id) {
    return typeof id === 'number' && id > 0 && Number.isInteger(id);
  }

  /**
   * Valida transición de estado permitida.
   * @param {string} currentStatus - Estado actual
   * @param {string} newStatus - Nuevo estado
   * @returns {boolean} True si la transición es permitida
   */
  static isValidStatusTransition(currentStatus, newStatus) {
    // Definir las transiciones permitidas
    const allowedTransitions = {
      [OrderStatus.PENDIENTE]: [OrderStatus.ASIGNADO, OrderStatus.CANCELADA, OrderStatus.OBSERVADO],
      [OrderStatus.ASIGNADO]: [OrderStatus.EN_PROCESO, OrderStatus.CANCELADA, OrderStatus.OBSERVADO],
      [OrderStatus.EN_PROCESO]: [OrderStatus.COMPLETADA, OrderStatus.CANCELADA, OrderStatus.OBSERVADO],
      [OrderStatus.COMPLETADA]: [],
      [OrderStatus.CANCELADA]: [],
      [OrderStatus.OBSERVADO]: [OrderStatus.SUBSANADA, OrderStatus.CANCELADA],
      [OrderStatus.SUBSANADA]: [OrderStatus.ASIGNADO, OrderStatus.EN_PROCESO]
    };

    if (!this.isValidStatus(currentStatus) || !this.isValidStatus(newStatus)) {
      return false;
    }

    const allowedNextStates = allowedTransitions[currentStatus] || [];
    return allowedNextStates.includes(newStatus);
  }
}
