/**
 * Constantes relacionadas con la entidad Dwelling (Vivienda)
 */

export const DwellingType = {
  CASA: 'CASA',
  DEPARTAMENTO: 'DEPARTAMENTO',
  CUARTO: 'CUARTO',
  OTROS: 'OTROS'
};

export const DwellingMaterial = {
  LADRILLO: 'LADRILLO',
  ADOBE: 'ADOBE',
  MADERA: 'MADERA',
  MATERIAL_NOBLE: 'MATERIAL_NOBLE',
  PREFABRICADO: 'PREFABRICADO',
  OTROS: 'OTROS'
};

export const DwellingCondition = {
  EXCELENTE: 'EXCELENTE',
  BUENO: 'BUENO',
  REGULAR: 'REGULAR',
  MALO: 'MALO',
  MUY_MALO: 'MUY_MALO'
};

export const TypeFurnished = {
  AMOBLADO: 'AMOBLADO',
  SEMI_AMOBLADO: 'SEMI_AMOBLADO',
  SIN_AMOBLAR: 'SIN_AMOBLAR'
};

export const RoofType = {
  CONCRETO: 'CONCRETO',
  CALAMINA: 'CALAMINA',
  TEJA: 'TEJA',
  ETERNIT: 'ETERNIT',
  OTROS: 'OTROS'
};

export const GarageType = {
  PROPIO: 'PROPIO',
  COMPARTIDO: 'COMPARTIDO',
  ALQUILADO: 'ALQUILADO',
  NO_TIENE: 'NO_TIENE'
};

export const DwellingTranslations = {
  [DwellingType.CASA]: 'Casa',
  [DwellingType.DEPARTAMENTO]: 'Departamento',
  [DwellingType.CUARTO]: 'Cuarto',
  [DwellingType.OTROS]: 'Otros',
  
  [DwellingMaterial.LADRILLO]: 'Ladrillo',
  [DwellingMaterial.ADOBE]: 'Adobe',
  [DwellingMaterial.MADERA]: 'Madera',
  [DwellingMaterial.MATERIAL_NOBLE]: 'Material Noble',
  [DwellingMaterial.PREFABRICADO]: 'Prefabricado',
  [DwellingMaterial.OTROS]: 'Otros',
  
  [DwellingCondition.EXCELENTE]: 'Excelente',
  [DwellingCondition.BUENO]: 'Bueno',
  [DwellingCondition.REGULAR]: 'Regular',
  [DwellingCondition.MALO]: 'Malo',
  [DwellingCondition.MUY_MALO]: 'Muy Malo',
  
  [TypeFurnished.AMOBLADO]: 'Amoblado',
  [TypeFurnished.SEMI_AMOBLADO]: 'Semi Amoblado',
  [TypeFurnished.SIN_AMOBLAR]: 'Sin Amoblar',
  
  [RoofType.CONCRETO]: 'Concreto',
  [RoofType.CALAMINA]: 'Calamina',
  [RoofType.TEJA]: 'Teja',
  [RoofType.ETERNIT]: 'Eternit',
  [RoofType.OTROS]: 'Otros',
  
  [GarageType.PROPIO]: 'Propio',
  [GarageType.COMPARTIDO]: 'Compartido',
  [GarageType.ALQUILADO]: 'Alquilado',
  [GarageType.NO_TIENE]: 'No Tiene'
};
