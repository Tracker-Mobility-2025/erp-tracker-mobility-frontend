/**
 * Value Object para números de teléfono peruanos.
 * Encapsula la lógica de validación y normalización de teléfonos.
 * 
 * @class PhoneNumber
 */
export class PhoneNumber {
  #value;

  constructor(phoneNumber) {
    if (!phoneNumber) {
      throw new Error('Número de teléfono es obligatorio');
    }

    const normalized = this.#normalize(phoneNumber);
    this.#validate(normalized);
    this.#value = normalized;
  }

  /**
   * Normaliza el número de teléfono eliminando espacios y guiones
   * @param {string|number} phoneNumber 
   * @returns {string}
   */
  #normalize(phoneNumber) {
    return phoneNumber.toString().replace(/[\s-]/g, '');
  }

  /**
   * Valida que sea un número peruano válido (9 dígitos, inicia con 9)
   * @param {string} phoneNumber 
   */
  #validate(phoneNumber) {
    if (!/^9\d{8}$/.test(phoneNumber)) {
      throw new Error('Número de teléfono debe ser un número peruano válido (9 dígitos, inicia con 9)');
    }
  }

  /**
   * Retorna el valor normalizado
   * @returns {string}
   */
  getValue() {
    return this.#value;
  }

  /**
   * Retorna el valor formateado para visualización
   * @returns {string} Formato: 999 999 999
   */
  getFormattedValue() {
    return this.#value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  /**
   * Compara dos PhoneNumber
   * @param {PhoneNumber} other 
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof PhoneNumber)) return false;
    return this.#value === other.#value;
  }

  toString() {
    return this.#value;
  }
}
