/**
 * Value Object para número telefónico.
 * Encapsula validaciones de formato telefónico peruano.
 * Inmutable por diseño.
 */
export class PhoneNumber {
  #value;
  #countryCode;

  constructor(value, countryCode = '+51') {
    if (!value) {
      throw new Error('El número telefónico es requerido');
    }

    const cleanedNumber = PhoneNumber.cleanNumber(value);

    if (!PhoneNumber.isValid(cleanedNumber)) {
      throw new Error(`Número telefónico inválido: ${value}`);
    }

    this.#value = cleanedNumber;
    this.#countryCode = countryCode;
    Object.freeze(this);
  }

  /**
   * Obtiene el número limpio
   * @returns {string}
   */
  get value() {
    return this.#value;
  }

  /**
   * Obtiene el código de país
   * @returns {string}
   */
  get countryCode() {
    return this.#countryCode;
  }

  /**
   * Verifica si es un celular
   * @returns {boolean}
   */
  isCellphone() {
    // Celulares en Perú empiezan con 9
    return this.#value.startsWith('9') && this.#value.length === 9;
  }

  /**
   * Verifica si es un teléfono fijo
   * @returns {boolean}
   */
  isLandline() {
    // Fijos en Perú típicamente empiezan con 01 (Lima) o códigos de área
    return !this.isCellphone() && (this.#value.length === 7 || this.#value.length === 9);
  }

  /**
   * Obtiene el número formateado
   * @returns {string}
   */
  formatted() {
    if (this.isCellphone()) {
      // Formato celular: 987 654 321
      return this.#value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    } else if (this.#value.length === 9) {
      // Formato fijo Lima: 01 234 5678
      return this.#value.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
    } else {
      // Formato fijo provincia: 234 5678
      return this.#value.replace(/(\d{3})(\d{4})/, '$1 $2');
    }
  }

  /**
   * Obtiene el número con código de país
   * @returns {string}
   */
  withCountryCode() {
    return `${this.#countryCode} ${this.formatted()}`;
  }

  /**
   * Compara con otro PhoneNumber
   * @param {PhoneNumber} other
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof PhoneNumber)) {
      return false;
    }
    return this.#value === other.#value;
  }

  /**
   * Representación en string
   * @returns {string}
   */
  toString() {
    return this.formatted();
  }

  /**
   * Serialización para JSON
   * @returns {string}
   */
  toJSON() {
    return this.#value;
  }

  /**
   * Limpia un número telefónico removiendo espacios, guiones, paréntesis
   * @param {string} value
   * @returns {string}
   */
  static cleanNumber(value) {
    if (!value) return '';
    // Remover todo excepto dígitos
    return value.toString().replace(/[^\d]/g, '');
  }

  /**
   * Verifica si un número es válido
   * @param {string} value
   * @returns {boolean}
   */
  static isValid(value) {
    const cleaned = PhoneNumber.cleanNumber(value);
    
    // Celular: 9 dígitos comenzando con 9
    // Fijo Lima: 9 dígitos comenzando con 01
    // Fijo provincia: 7 dígitos
    const cellphonePattern = /^9\d{8}$/;
    const landlineLimaPattern = /^01\d{7}$/;
    const landlineProvincePattern = /^\d{7}$/;

    return cellphonePattern.test(cleaned) ||
           landlineLimaPattern.test(cleaned) ||
           landlineProvincePattern.test(cleaned);
  }

  /**
   * Crea una instancia desde string
   * @param {string} value
   * @returns {PhoneNumber}
   */
  static fromString(value) {
    return new PhoneNumber(value);
  }

  /**
   * Crea una instancia de celular
   * @param {string} value
   * @returns {PhoneNumber}
   */
  static cellphone(value) {
    const phone = new PhoneNumber(value);
    if (!phone.isCellphone()) {
      throw new Error(`El número ${value} no es un celular válido`);
    }
    return phone;
  }
}
