import { EmployeeCollaboratorMessages } from '../constants/customer.constants.js';

/**
 * Value Object para Email.
 * Encapsula validación básica de email.
 * 
 * @class Email
 */
export class Email {
  /**
   * Crea una instancia de Email.
   * @param {string} value - Email a validar
   * @throws {Error} Si el email es inválido
   */
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error(EmployeeCollaboratorMessages.EMAIL_REQUIRED);
    }

    const trimmed = value.trim().toLowerCase();
    
    if (!this.#isValid(trimmed)) {
      throw new Error(EmployeeCollaboratorMessages.EMAIL_INVALID);
    }

    this.value = trimmed;
  }

  /**
   * Valida el formato del email
   * @private
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  #isValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtiene el dominio del email
   * @returns {string} Dominio (parte después del @)
   */
  get domain() {
    return this.value.split('@')[1];
  }

  /**
   * Obtiene el usuario del email
   * @returns {string} Usuario (parte antes del @)
   */
  get username() {
    return this.value.split('@')[0];
  }

  /**
   * Convierte a string
   * @returns {string} Email
   */
  toString() {
    return this.value;
  }

  /**
   * Verifica igualdad con otro Email
   * @param {Email} other - Otro email
   * @returns {boolean} True si son iguales
   */
  equals(other) {
    if (!(other instanceof Email)) {
      return false;
    }
    return this.value === other.value;
  }
}
