/**
 * Entidad de dominio: ContactReference (Referencia de Contacto)
 * Representa una persona de referencia del cliente.
 */
export class ContactReference {
  constructor({
    id = null,
    fullName = null,
    relationship = null,
    phoneNumber = null,
    address = null,
    isPrimary = false,
    isVerified = false
  } = {}) {
    this.id = id;
    this.fullName = fullName;
    this.relationship = relationship;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.isPrimary = isPrimary;
    this.isVerified = isVerified;

    Object.freeze(this);
  }

  get hasValidPhone() {
    return this.phoneNumber && this.phoneNumber.length >= 9;
  }

  get contactInfo() {
    const parts = [];
    if (this.fullName) parts.push(this.fullName);
    if (this.relationship) parts.push(`(${this.relationship})`);
    return parts.join(' ');
  }

  toJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      relationship: this.relationship,
      phoneNumber: this.phoneNumber,
      address: this.address,
      isPrimary: this.isPrimary,
      isVerified: this.isVerified
    };
  }
}
