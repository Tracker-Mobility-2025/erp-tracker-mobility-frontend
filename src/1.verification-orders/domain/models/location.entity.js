/**
 * Entidad de dominio: Location (Ubicación)
 * Representa la ubicación geográfica de la vivienda.
 */
export class Location {
  constructor({
    department = null,
    province = null,
    district = null,
    homeAddress = null,
    reference = null,
    mapLocation = null,
    latitude = null,
    longitude = null
  } = {}) {
    this.department = department;
    this.province = province;
    this.district = district;
    this.homeAddress = homeAddress;
    this.reference = reference;
    this.mapLocation = mapLocation;
    this.latitude = latitude;
    this.longitude = longitude;

    Object.freeze(this);
  }

  get fullAddress() {
    const parts = [
      this.homeAddress,
      this.district,
      this.province,
      this.department
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  get hasCoordinates() {
    return this.latitude !== null && this.longitude !== null;
  }

  get coordinatesString() {
    if (!this.hasCoordinates) return null;
    return `${this.latitude}, ${this.longitude}`;
  }

  toJSON() {
    return {
      department: this.department,
      province: this.province,
      district: this.district,
      homeAddress: this.homeAddress,
      reference: this.reference,
      mapLocation: this.mapLocation,
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
}
