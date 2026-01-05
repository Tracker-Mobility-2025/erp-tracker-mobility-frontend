/**
 * Constantes relacionadas con la entidad Zone (Zona)
 */

export const ZoneType = {
  URBANA: 'URBANA',
  RURAL: 'RURAL',
  URBANIZACION: 'URBANIZACION',
  ASENTAMIENTO_HUMANO: 'ASENTAMIENTO_HUMANO',
  PUEBLO_JOVEN: 'PUEBLO_JOVEN'
};

export const ZoneCharacteristic = {
  COMERCIAL: 'COMERCIAL',
  RESIDENCIAL: 'RESIDENCIAL',
  INDUSTRIAL: 'INDUSTRIAL',
  MIXTA: 'MIXTA',
  CENTRAL: 'CENTRAL',
  PERIFERICA: 'PERIFERICA'
};

export const AccessType = {
  PISTA_ASFALTADA: 'PISTA_ASFALTADA',
  PISTA_AFIRMADA: 'PISTA_AFIRMADA',
  TROCHA: 'TROCHA',
  CAMINO_TIERRA: 'CAMINO_TIERRA',
  ESCALERAS: 'ESCALERAS'
};

export const RiskLevel = {
  BAJO: 'BAJO',
  MEDIO: 'MEDIO',
  ALTO: 'ALTO',
  MUY_ALTO: 'MUY_ALTO'
};

export const NearbyService = {
  TRANSPORTE_PUBLICO: 'TRANSPORTE_PUBLICO',
  MERCADO: 'MERCADO',
  HOSPITAL: 'HOSPITAL',
  COLEGIO: 'COLEGIO',
  COMISARIA: 'COMISARIA',
  FARMACIA: 'FARMACIA',
  BANCO: 'BANCO',
  PARQUE: 'PARQUE'
};

export const ZoneTranslations = {
  [ZoneType.URBANA]: 'Urbana',
  [ZoneType.RURAL]: 'Rural',
  [ZoneType.URBANIZACION]: 'Urbanización',
  [ZoneType.ASENTAMIENTO_HUMANO]: 'Asentamiento Humano',
  [ZoneType.PUEBLO_JOVEN]: 'Pueblo Joven',
  
  [ZoneCharacteristic.COMERCIAL]: 'Comercial',
  [ZoneCharacteristic.RESIDENCIAL]: 'Residencial',
  [ZoneCharacteristic.INDUSTRIAL]: 'Industrial',
  [ZoneCharacteristic.MIXTA]: 'Mixta',
  [ZoneCharacteristic.CENTRAL]: 'Central',
  [ZoneCharacteristic.PERIFERICA]: 'Periférica',
  
  [AccessType.PISTA_ASFALTADA]: 'Pista Asfaltada',
  [AccessType.PISTA_AFIRMADA]: 'Pista Afirmada',
  [AccessType.TROCHA]: 'Trocha',
  [AccessType.CAMINO_TIERRA]: 'Camino de Tierra',
  [AccessType.ESCALERAS]: 'Escaleras',
  
  [RiskLevel.BAJO]: 'Bajo',
  [RiskLevel.MEDIO]: 'Medio',
  [RiskLevel.ALTO]: 'Alto',
  [RiskLevel.MUY_ALTO]: 'Muy Alto',
  
  [NearbyService.TRANSPORTE_PUBLICO]: 'Transporte Público',
  [NearbyService.MERCADO]: 'Mercado',
  [NearbyService.HOSPITAL]: 'Hospital',
  [NearbyService.COLEGIO]: 'Colegio',
  [NearbyService.COMISARIA]: 'Comisaría',
  [NearbyService.FARMACIA]: 'Farmacia',
  [NearbyService.BANCO]: 'Banco',
  [NearbyService.PARQUE]: 'Parque'
};

export const ZoneColors = {
  [RiskLevel.BAJO]: 'success',
  [RiskLevel.MEDIO]: 'warning',
  [RiskLevel.ALTO]: 'danger',
  [RiskLevel.MUY_ALTO]: 'danger'
};
