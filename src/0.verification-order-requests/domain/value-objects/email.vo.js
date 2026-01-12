/**
 * Value Object para Email
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
      throw new Error('El email es requerido');
    }

    const trimmed = value.trim().toLowerCase();
    
    if (!this.#isValid(trimmed)) {
      throw new Error(`Email inválido: ${value}`);
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
   * Convierte a string
   * @returns {string} Email
   */
  toString() {
    return this.value;
  }
}
