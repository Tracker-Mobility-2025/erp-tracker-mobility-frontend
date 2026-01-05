/**
 * Entidad de dominio: Residence (Residencia)
 * Representa información sobre la residencia del cliente en la vivienda.
 */
export class Residence {
  constructor({
    livesWith = null,
    isResident = true,
    timeAtResidence = null,
    timeType = null,
    residenceType = null,
    isPermanent = true
  } = {}) {
    this.livesWith = livesWith;
    this.isResident = isResident;
    this.timeAtResidence = timeAtResidence;
    this.timeType = timeType; // DIAS, MESES, AÑOS
    this.residenceType = residenceType; // PROPIA, ALQUILADA, FAMILIAR
    this.isPermanent = isPermanent;

    Object.freeze(this);
  }

  get residenceTimeDescription() {
    if (!this.timeAtResidence || !this.timeType) return null;
    return `${this.timeAtResidence} ${this.timeType.toLowerCase()}`;
  }

  get isOwner() {
    return this.residenceType === 'PROPIA';
  }

  get isRenting() {
    return this.residenceType === 'ALQUILADA';
  }

  get isFamilyProperty() {
    return this.residenceType === 'FAMILIAR';
  }

  toJSON() {
    return {
      livesWith: this.livesWith,
      isResident: this.isResident,
      timeAtResidence: this.timeAtResidence,
      timeType: this.timeType,
      residenceType: this.residenceType,
      isPermanent: this.isPermanent
    };
  }
}
