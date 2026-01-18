import { BusinessRules, EmployeeCollaboratorMessages } from '../constants/customer.constants.js';

/**
 * Value Object para PhoneNumber.
 * Encapsula validación de número telefónico.
 * 
 * @class PhoneNumber
 */
export class PhoneNumber {
  /**
   * Crea una instancia de PhoneNumber.
   * @param {string} value - Número telefónico a validar
   * @throws {Error} Si el número es inválido
   */
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error(EmployeeCollaboratorMessages.PHONE_REQUIRED);
    }

    const cleaned = this.#cleanPhoneNumber(value);
    
    if (!this.#isValid(cleaned)) {
      throw new Error(EmployeeCollaboratorMessages.PHONE_INVALID);
    }

    this.value = cleaned;
  }

  /**
   * Limpia el número telefónico (quita espacios, guiones, etc.)
   * @private
   * @param {string} phone - Número a limpiar
   * @returns {string} Número limpio
   */
  #cleanPhoneNumber(phone) {
    return phone.trim().replace(/[\s\-()]/g, '');
  }

  /**
   * Valida el formato del número telefónico
   * @private
   * @param {string} phone - Número a validar
   * @returns {boolean} True si es válido
   */
  #isValid(phone) {
    // Solo dígitos y opcionalmente + al inicio
    if (!/^\+?\d+$/.test(phone)) {
      return false;
    }

    // Longitud entre MIN y MAX
    const phoneDigits = phone.replace('+', '');
    if (phoneDigits.length < BusinessRules.PHONE_MIN_LENGTH || 
        phoneDigits.length > BusinessRules.PHONE_MAX_LENGTH) {
      return false;
    }

    return true;
  }

  /**
   * Convierte a string
   * @returns {string} Número telefónico
   */
  toString() {
    return this.value;
  }

  /**
   * Obtiene el número formateado para display
   * @returns {string} Número formateado
   */
  getFormatted() {
    // Formato peruano: 999 999 999
    if (this.value.length === 9 && !this.value.startsWith('+')) {
      return `${this.value.substring(0, 3)} ${this.value.substring(3, 6)} ${this.value.substring(6)}`;
    }
    return this.value;
  }

  /**
   * Verifica igualdad con otro PhoneNumber
   * @param {PhoneNumber} other - Otro número
   * @returns {boolean} True si son iguales
   */
  equals(other) {
    if (!(other instanceof PhoneNumber)) {
      return false;
    }
    return this.value === other.value;
  }
}
