/**
 * Value Object para números de documento (DNI, Carnet de Extranjería, PTP).
 * Encapsula la lógica de validación específica según el tipo de documento.
 * 
 * @class DocumentNumber
 */
export class DocumentNumber {
  #value;
  #type;

  constructor(documentNumber, documentType) {
    if (!documentNumber) {
      throw new Error('Número de documento es obligatorio');
    }

    if (!documentType) {
      throw new Error('Tipo de documento es obligatorio');
    }

    this.#validateType(documentType);
    const normalized = this.#normalize(documentNumber);
    this.#validate(normalized, documentType);
    
    this.#value = normalized;
    this.#type = documentType;
  }

  /**
   * Valida que el tipo de documento sea válido
   * @param {string} type 
   */
  #validateType(type) {
    const validTypes = ['DNI', 'CARNET_EXTRANJERIA', 'PTP'];
    if (!validTypes.includes(type)) {
      throw new Error('Tipo de documento inválido. Debe ser DNI, CARNET_EXTRANJERIA o PTP');
    }
  }

  /**
   * Normaliza el número de documento eliminando espacios
   * @param {string|number} documentNumber 
   * @returns {string}
   */
  #normalize(documentNumber) {
    return documentNumber.toString().replace(/\s/g, '');
  }

  /**
   * Valida el número de documento según su tipo
   * @param {string} documentNumber 
   * @param {string} documentType 
   */
  #validate(documentNumber, documentType) {
    switch (documentType) {
      case 'DNI':
        if (!/^\d{8}$/.test(documentNumber)) {
          throw new Error('DNI debe tener exactamente 8 dígitos');
        }
        break;
      
      case 'CARNET_EXTRANJERIA':
      case 'PTP':
        if (!/^\d{9,12}$/.test(documentNumber)) {
          throw new Error('Carnet de extranjería/PTP debe tener entre 9 y 12 dígitos');
        }
        break;
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
   * Retorna el tipo de documento
   * @returns {string}
   */
  getType() {
    return this.#type;
  }

  /**
   * Retorna el valor formateado para visualización
   * @returns {string}
   */
  getFormattedValue() {
    if (this.#type === 'DNI') {
      // Formato: 12345678 -> 12 345 678
      return this.#value.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return this.#value;
  }

  /**
   * Compara dos DocumentNumber
   * @param {DocumentNumber} other 
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof DocumentNumber)) return false;
    return this.#value === other.#value && this.#type === other.#type;
  }

  toString() {
    return this.#value;
  }
}
