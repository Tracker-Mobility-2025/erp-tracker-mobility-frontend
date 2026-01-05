/**
 * Entidad de dominio: Dwelling (Vivienda)
 * Representa la información detallada de la vivienda visitada.
 */
export class Dwelling {
  constructor({
    dwellingType = null,
    numberFloors = null,
    floorOccupied = null,
    facadeColor = null,
    dwellingMaterial = null,
    dwellingCondition = null,
    typeFurnished = null,
    roofType = null,
    hasGarage = false,
    garageType = null,
    garageDistance = null
  } = {}) {
    this.dwellingType = dwellingType;
    this.numberFloors = numberFloors;
    this.floorOccupied = floorOccupied;
    this.facadeColor = facadeColor;
    this.dwellingMaterial = dwellingMaterial;
    this.dwellingCondition = dwellingCondition;
    this.typeFurnished = typeFurnished;
    this.roofType = roofType;
    this.hasGarage = hasGarage;
    this.garageType = garageType;
    this.garageDistance = garageDistance;

    Object.freeze(this);
  }

  get isApartment() {
    return this.dwellingType === 'DEPARTAMENTO' || this.dwellingType === 'APARTMENT';
  }

  get isHouse() {
    return this.dwellingType === 'CASA' || this.dwellingType === 'HOUSE';
  }

  get hasMultipleFloors() {
    return this.numberFloors && this.numberFloors > 1;
  }

  toJSON() {
    return {
      dwellingType: this.dwellingType,
      numberFloors: this.numberFloors,
      floorOccupied: this.floorOccupied,
      facadeColor: this.facadeColor,
      dwellingMaterial: this.dwellingMaterial,
      dwellingCondition: this.dwellingCondition,
      typeFurnished: this.typeFurnished,
      roofType: this.roofType,
      hasGarage: this.hasGarage,
      garageType: this.garageType,
      garageDistance: this.garageDistance
    };
  }
}
