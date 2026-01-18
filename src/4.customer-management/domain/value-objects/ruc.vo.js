import { BusinessRules, CustomerMessages } from '../constants/customer.constants.js';

/**
 * Value Object para RUC (Registro Único de Contribuyentes).
 * Encapsula validación específica del RUC peruano.
 * 
 * @class Ruc
 */
export class Ruc {
  /**
   * Crea una instancia de Ruc.
   * @param {string|number} value - RUC a validar
   * @throws {Error} Si el RUC es inválido
   */
  constructor(value) {
    if (value === null || value === undefined) {
      throw new Error(CustomerMessages.RUC_REQUIRED);
    }

    const rucString = value.toString().trim();
    
    if (!this.#isValid(rucString)) {
      throw new Error(CustomerMessages.RUC_INVALID_FORMAT);
    }

    this.value = rucString;
  }

  /**
   * Valida el formato del RUC
   * @private
   * @param {string} ruc - RUC a validar
   * @returns {boolean} True si es válido
   */
  #isValid(ruc) {
    // Debe tener exactamente 11 dígitos
    if (ruc.length !== BusinessRules.RUC_LENGTH) {
      return false;
    }

    // Solo debe contener números
    if (!/^\d+$/.test(ruc)) {
      return false;
    }

    return true;
  }

  /**
   * Convierte a string
   * @returns {string} RUC
   */
  toString() {
    return this.value;
  }

  /**
   * Obtiene el RUC formateado (para display)
   * @returns {string} RUC formateado
   */
  getFormatted() {
    // Formato: 20-12345678-9
    if (this.value.length === 11) {
      return `${this.value.substring(0, 2)}-${this.value.substring(2, 10)}-${this.value.substring(10)}`;
    }
    return this.value;
  }

  /**
   * Verifica igualdad con otro Ruc
   * @param {Ruc} other - Otro RUC
   * @returns {boolean} True si son iguales
   */
  equals(other) {
    if (!(other instanceof Ruc)) {
      return false;
    }
    return this.value === other.value;
  }
}
