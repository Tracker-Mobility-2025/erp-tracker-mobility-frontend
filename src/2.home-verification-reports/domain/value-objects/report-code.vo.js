/**
 * Value Object para código de reporte.
 * Encapsula validaciones y formato del código de reporte.
 * Inmutable por diseño.
 */
export class ReportCode {
  #value;

  constructor(value) {
    if (!value) {
      throw new Error('El código de reporte es requerido');
    }

    const normalizedValue = value.trim();

    if (normalizedValue === '') {
      throw new Error('El código de reporte no puede estar vacío');
    }

    if (!ReportCode.isValid(normalizedValue)) {
      throw new Error(`Código de reporte inválido: ${value}`);
    }

    this.#value = normalizedValue;
    Object.freeze(this);
  }

  /**
   * Obtiene el valor del código
   * @returns {string}
   */
  get value() {
    return this.#value;
  }

  /**
   * Compara con otro ReportCode
   * @param {ReportCode} other
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof ReportCode)) {
      return false;
    }
    return this.#value === other.#value;
  }

  /**
   * Representación en string
   * @returns {string}
   */
  toString() {
    return this.#value;
  }

  /**
   * Serialización para JSON
   * @returns {string}
   */
  toJSON() {
    return this.#value;
  }

  /**
   * Verifica si un código es válido
   * @param {string} value
   * @returns {boolean}
   */
  static isValid(value) {
    if (!value || value.trim() === '') {
      return false;
    }
    // Código de reporte debe tener al menos 3 caracteres
    // y puede contener letras, números y guiones
    return /^[A-Z0-9\-]{3,}$/i.test(value.trim());
  }

  /**
   * Crea una instancia desde string
   * @param {string} value
   * @returns {ReportCode}
   */
  static fromString(value) {
    return new ReportCode(value);
  }
}
