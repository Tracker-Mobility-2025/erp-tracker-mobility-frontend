/**
 * Value Object para PhoneNumber
 * Encapsula validación básica de número telefónico.
 * 
 * @class PhoneNumber
 */
export class PhoneNumber {
  /**
   * Crea una instancia de PhoneNumber.
   * @param {string|number} value - Número telefónico a validar
   * @throws {Error} Si el número es inválido
   */
  constructor(value) {
    if (!value) {
      throw new Error('El número telefónico es requerido');
    }

    const normalized = this.#normalize(value);
    
    if (!this.#isValid(normalized)) {
      throw new Error(`Número telefónico inválido: ${value}`);
    }

    this.value = normalized;
  }

  /**
   * Normaliza el número (remueve espacios, guiones, paréntesis)
   * @private
   * @param {string|number} phone - Número a normalizar
   * @returns {string} Número normalizado
   */
  #normalize(phone) {
    return phone.toString().replace(/[\s\-()]/g, '');
  }

  /**
   * Valida el formato del número
   * @private
   * @param {string} phone - Número a validar
   * @returns {boolean} True si es válido
   */
  #isValid(phone) {
    // Acepta números con 8-15 dígitos, opcionalmente precedidos por +
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Verifica si es número internacional
   * @returns {boolean} True si comienza con +
   */
  get isInternational() {
    return this.value.startsWith('+');
  }

  /**
   * Formatea el número para visualización
   * @returns {string} Número formateado
   */
  get formatted() {
    if (this.isInternational) {
      return this.value;
    }
    return this.value;
  }

  /**
   * Convierte a string
   * @returns {string} Número telefónico
   */
  toString() {
    return this.value;
  }
}
