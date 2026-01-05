/**
 * Entidad de dominio: Landlord (Propietario/Arrendador)
 * Representa información del propietario de la vivienda cuando es alquilada.
 */
export class Landlord {
  constructor({
    id = null,
    fullName = null,
    phoneNumber = null,
    ownHome = null,
    wasInterviewed = false,
    interviewDate = null,
    interviewNotes = null,
    relationshipWithTenant = null
  } = {}) {
    this.id = id;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.ownHome = ownHome;
    this.wasInterviewed = wasInterviewed;
    this.interviewDate = interviewDate ? new Date(interviewDate) : null;
    this.interviewNotes = interviewNotes;
    this.relationshipWithTenant = relationshipWithTenant;

    Object.freeze(this);
  }

  get hasValidPhone() {
    return this.phoneNumber && this.phoneNumber.length >= 9;
  }

  get interviewDateFormatted() {
    if (!this.interviewDate) return null;
    return this.interviewDate.toLocaleDateString('es-PE');
  }

  get canBeContacted() {
    return this.hasValidPhone;
  }

  toJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      ownHome: this.ownHome,
      wasInterviewed: this.wasInterviewed,
      interviewDate: this.interviewDate,
      interviewNotes: this.interviewNotes,
      relationshipWithTenant: this.relationshipWithTenant
    };
  }
}
