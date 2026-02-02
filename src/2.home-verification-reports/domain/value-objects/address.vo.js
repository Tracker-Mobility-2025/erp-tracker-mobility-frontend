/**
 * Value Object para dirección completa.
 * Encapsula la lógica de composición y validación de direcciones.
 * Inmutable por diseño.
 */
export class Address {
  #department;
  #province;
  #district;
  #street;

  constructor({ department, province, district, street }) {
    // Validaciones básicas
    if (!district || district.trim() === '') {
      throw new Error('El distrito es requerido para una dirección');
    }

    this.#department = department?.trim() || '';
    this.#province = province?.trim() || '';
    this.#district = district.trim();
    this.#street = street?.trim() || '';

    Object.freeze(this);
  }

  /**
   * Obtiene el departamento
   * @returns {string}
   */
  get department() {
    return this.#department;
  }

  /**
   * Obtiene la provincia
   * @returns {string}
   */
  get province() {
    return this.#province;
  }

  /**
   * Obtiene el distrito
   * @returns {string}
   */
  get district() {
    return this.#district;
  }

  /**
   * Obtiene la calle
   * @returns {string}
   */
  get street() {
    return this.#street;
  }

  /**
   * Verifica si la dirección está completa
   * @returns {boolean}
   */
  isComplete() {
    return !!(
      this.#department &&
      this.#province &&
      this.#district &&
      this.#street
    );
  }

  /**
   * Obtiene la dirección formateada completa
   * @returns {string}
   */
  fullAddress() {
    const parts = [
      this.#street,
      this.#district,
      this.#province,
      this.#department
    ].filter(part => part && part.trim() !== '');

    return parts.join(', ');
  }

  /**
   * Obtiene la ubicación geográfica (departamento, provincia, distrito)
   * @returns {string}
   */
  location() {
    const parts = [
      this.#district,
      this.#province,
      this.#department
    ].filter(part => part && part.trim() !== '');

    return parts.join(', ');
  }

  /**
   * Obtiene una dirección corta (calle, distrito)
   * @returns {string}
   */
  shortAddress() {
    const parts = [
      this.#street,
      this.#district
    ].filter(part => part && part.trim() !== '');

    return parts.join(', ');
  }

  /**
   * Verifica si está en Lima
   * @returns {boolean}
   */
  isInLima() {
    return this.#department.toLowerCase().includes('lima');
  }

  /**
   * Compara con otra dirección
   * @param {Address} other
   * @returns {boolean}
   */
  equals(other) {
    if (!(other instanceof Address)) {
      return false;
    }
    return (
      this.#department === other.#department &&
      this.#province === other.#province &&
      this.#district === other.#district &&
      this.#street === other.#street
    );
  }

  /**
   * Representación en string
   * @returns {string}
   */
  toString() {
    return this.fullAddress();
  }

  /**
   * Serialización para JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      department: this.#department,
      province: this.#province,
      district: this.#district,
      street: this.#street
    };
  }

  /**
   * Crea una instancia desde objeto plano
   * @param {Object} obj
   * @returns {Address}
   */
  static fromObject(obj) {
    return new Address({
      department: obj.department || obj.addressDepartment,
      province: obj.province || obj.addressProvince,
      district: obj.district || obj.addressDistrict,
      street: obj.street || obj.addressStreet
    });
  }

  /**
   * Crea una instancia con valores por defecto
   * @param {string} district - Mínimo requerido
   * @returns {Address}
   */
  static minimal(district) {
    return new Address({
      department: '',
      province: '',
      district,
      street: ''
    });
  }

  /**
   * Crea una copia con modificaciones
   * @param {Object} changes
   * @returns {Address}
   */
  withChanges(changes) {
    return new Address({
      department: changes.department ?? this.#department,
      province: changes.province ?? this.#province,
      district: changes.district ?? this.#district,
      street: changes.street ?? this.#street
    });
  }
}
