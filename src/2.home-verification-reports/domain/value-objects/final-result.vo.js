/**
 * Value Object para el resultado final del reporte.
 * Encapsula validaciones y comportamiento relacionado con el resultado.
 * Inmutable por diseño.
 */
export class FinalResult {
  static CONFORME = 'CONFORME';
  static OBSERVADO = 'OBSERVADO';
  static RECHAZADO = 'RECHAZADO';
  static ENTREVISTA_ARRENDADOR_FALTANTE = 'ENTREVISTA_ARRENDADOR_FALTANTE';

  #value;

  constructor(value) {
    if (!value) {
      throw new Error('El resultado final es requerido');
    }

    const normalizedValue = value.trim().toUpperCase();
    
    if (!FinalResult.isValid(normalizedValue)) {
      throw new Error(
        `Resultado final inválido: ${value}. Debe ser uno de: ${FinalResult.getAllValues().join(', ')}`
      );
    }

    this.#value = normalizedValue;
    Object.freeze(this);
  }

  /**
   * Obtiene el valor del resultado
   * @returns {string}
   */
  get value() {
    return this.#value;
  }

  /**
   * Verifica si el resultado es CONFORME
   * @returns {boolean}
   */
  isConforme() {
    return this.#value === FinalResult.CONFORME;
  }

  /**
   * Verifica si el resultado es OBSERVADO
   * @returns {boolean}
   */
  isObservado() {
    return this.#value === FinalResult.OBSERVADO;
  }

  /**
   * Verifica si el resultado es RECHAZADO
   * @returns {boolean}
   */
  isRechazado() {
    return this.#value === FinalResult.RECHAZADO;
  }

  /**
   * Verifica si falta la entrevista con el arrendador
   * @returns {boolean}
   */
  requiresLandlordInterview() {
    return this.#value === FinalResult.ENTREVISTA_ARRENDADOR_FALTANTE;
  }

  /**
   * Verifica si el resultado permite exportar el reporte
   * @returns {boolean}
   */
  canExportReport() {
    return !this.requiresLandlordInterview();
  }

  /**
   * Verifica si el resultado necesita observaciones
   * @returns {boolean}
   */
  requiresObservations() {
    return this.isObservado() || this.isRechazado();
  }

  /**
   * Compara con otro FinalResult
   * @param {FinalResult} other
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof FinalResult)) {
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
   * Verifica si un valor es válido
   * @param {string} value
   * @returns {boolean}
   */
  static isValid(value) {
    return FinalResult.getAllValues().includes(value);
  }

  /**
   * Obtiene todos los valores válidos
   * @returns {string[]}
   */
  static getAllValues() {
    return [
      FinalResult.CONFORME,
      FinalResult.OBSERVADO,
      FinalResult.RECHAZADO,
      FinalResult.ENTREVISTA_ARRENDADOR_FALTANTE
    ];
  }

  /**
   * Crea una instancia desde un string (factory method)
   * @param {string} value
   * @returns {FinalResult}
   */
  static fromString(value) {
    return new FinalResult(value);
  }

  /**
   * Crea una instancia para resultado conforme
   * @returns {FinalResult}
   */
  static conforme() {
    return new FinalResult(FinalResult.CONFORME);
  }

  /**
   * Crea una instancia para resultado observado
   * @returns {FinalResult}
   */
  static observado() {
    return new FinalResult(FinalResult.OBSERVADO);
  }

  /**
   * Crea una instancia para resultado rechazado
   * @returns {FinalResult}
   */
  static rechazado() {
    return new FinalResult(FinalResult.RECHAZADO);
  }

  /**
   * Crea una instancia para entrevista faltante
   * @returns {FinalResult}
   */
  static entrevistaFaltante() {
    return new FinalResult(FinalResult.ENTREVISTA_ARRENDADOR_FALTANTE);
  }
}
