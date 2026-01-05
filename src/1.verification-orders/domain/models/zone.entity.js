/**
 * Entidad de dominio: Zone (Zona)
 * Representa las características de la zona donde se ubica la vivienda.
 */
export class Zone {
  constructor({
    zoneType = null,
    zoneCharacteristics = [],
    accessType = null,
    riskLevel = null,
    hasPublicTransport = false,
    nearbyServices = []
  } = {}) {
    this.zoneType = zoneType;
    this.zoneCharacteristics = Array.isArray(zoneCharacteristics) ? zoneCharacteristics : [];
    this.accessType = accessType;
    this.riskLevel = riskLevel;
    this.hasPublicTransport = hasPublicTransport;
    this.nearbyServices = Array.isArray(nearbyServices) ? nearbyServices : [];

    Object.freeze(this);
  }

  get isUrban() {
    return this.zoneType === 'URBANA' || this.zoneType === 'URBAN';
  }

  get isRural() {
    return this.zoneType === 'RURAL';
  }

  get isHighRisk() {
    return this.riskLevel === 'ALTO' || this.riskLevel === 'HIGH';
  }

  get isMediumRisk() {
    return this.riskLevel === 'MEDIO' || this.riskLevel === 'MEDIUM';
  }

  get isLowRisk() {
    return this.riskLevel === 'BAJO' || this.riskLevel === 'LOW';
  }

  get characteristicsCount() {
    return this.zoneCharacteristics.length;
  }

  toJSON() {
    return {
      zoneType: this.zoneType,
      zoneCharacteristics: this.zoneCharacteristics,
      accessType: this.accessType,
      riskLevel: this.riskLevel,
      hasPublicTransport: this.hasPublicTransport,
      nearbyServices: this.nearbyServices
    };
  }
}
