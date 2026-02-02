/**
 * Value Object para número de documento.
 * Encapsula validaciones específicas según el tipo de documento.
 * Inmutable por diseño.
 */
export class DocumentNumber {
  static TYPE_DNI = 'DNI';
  static TYPE_CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA';
  static TYPE_PTP = 'PTP';

  #type;
  #number;

  constructor(type, number) {
    if (!type || !number) {
      throw new Error('El tipo y número de documento son requeridos');
    }

    const normalizedType = type.trim().toUpperCase();
    const normalizedNumber = number.trim();

    if (!DocumentNumber.isValidType(normalizedType)) {
      throw new Error(
        `Tipo de documento inválido: ${type}. Debe ser uno de: ${DocumentNumber.getAllTypes().join(', ')}`
      );
    }

    if (!DocumentNumber.isValidNumber(normalizedType, normalizedNumber)) {
      throw new Error(`Número de documento inválido para tipo ${type}: ${number}`);
    }

    this.#type = normalizedType;
    this.#number = normalizedNumber;
    Object.freeze(this);
  }

  /**
   * Obtiene el tipo de documento
   * @returns {string}
   */
  get type() {
    return this.#type;
  }

  /**
   * Obtiene el número de documento
   * @returns {string}
   */
  get number() {
    return this.#number;
  }

  /**
   * Verifica si es DNI
   * @returns {boolean}
   */
  isDNI() {
    return this.#type === DocumentNumber.TYPE_DNI;
  }

  /**
   * Verifica si es Carnet de Extranjería
   * @returns {boolean}
   */
  isCarnetExtranjeria() {
    return this.#type === DocumentNumber.TYPE_CARNET_EXTRANJERIA;
  }

  /**
   * Verifica si es PTP
   * @returns {boolean}
   */
  isPTP() {
    return this.#type === DocumentNumber.TYPE_PTP;
  }

  /**
   * Obtiene representación formateada
   * @returns {string}
   */
  formatted() {
    if (this.isDNI() && this.#number.length === 8) {
      // Formato DNI: 12345678
      return this.#number;
    }
    return this.#number;
  }

  /**
   * Compara con otro DocumentNumber
   * @param {DocumentNumber} other
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof DocumentNumber)) {
      return false;
    }
    return this.#type === other.#type && this.#number === other.#number;
  }

  /**
   * Representación en string
   * @returns {string}
   */
  toString() {
    return `${this.#type}: ${this.#number}`;
  }

  /**
   * Serialización para JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      type: this.#type,
      number: this.#number
    };
  }

  /**
   * Verifica si un tipo es válido
   * @param {string} type
   * @returns {boolean}
   */
  static isValidType(type) {
    return DocumentNumber.getAllTypes().includes(type);
  }

  /**
   * Verifica si un número es válido según el tipo
   * @param {string} type
   * @param {string} number
   * @returns {boolean}
   */
  static isValidNumber(type, number) {
    if (!number || number.trim() === '') {
      return false;
    }

    const cleanNumber = number.trim();

    switch (type) {
      case DocumentNumber.TYPE_DNI:
        // DNI peruano: 8 dígitos numéricos
        return /^\d{8}$/.test(cleanNumber);
      
      case DocumentNumber.TYPE_CARNET_EXTRANJERIA:
        // Carnet de Extranjería: alfanumérico, 9-12 caracteres
        return /^[A-Z0-9]{9,12}$/.test(cleanNumber);
      
      case DocumentNumber.TYPE_PTP:
        // PTP: alfanumérico, variable
        return /^[A-Z0-9]{6,15}$/.test(cleanNumber);
      
      default:
        return false;
    }
  }

  /**
   * Obtiene todos los tipos válidos
   * @returns {string[]}
   */
  static getAllTypes() {
    return [
      DocumentNumber.TYPE_DNI,
      DocumentNumber.TYPE_CARNET_EXTRANJERIA,
      DocumentNumber.TYPE_PTP
    ];
  }

  /**
   * Crea una instancia desde objeto plano
   * @param {Object} obj
   * @returns {DocumentNumber}
   */
  static fromObject(obj) {
    if (!obj || !obj.type || !obj.number) {
      throw new Error('Objeto inválido para crear DocumentNumber');
    }
    return new DocumentNumber(obj.type, obj.number);
  }

  /**
   * Crea una instancia de DNI
   * @param {string} number
   * @returns {DocumentNumber}
   */
  static dni(number) {
    return new DocumentNumber(DocumentNumber.TYPE_DNI, number);
  }

  /**
   * Crea una instancia de Carnet de Extranjería
   * @param {string} number
   * @returns {DocumentNumber}
   */
  static carnetExtranjeria(number) {
    return new DocumentNumber(DocumentNumber.TYPE_CARNET_EXTRANJERIA, number);
  }

  /**
   * Crea una instancia de PTP
   * @param {string} number
   * @returns {DocumentNumber}
   */
  static ptp(number) {
    return new DocumentNumber(DocumentNumber.TYPE_PTP, number);
  }
}
