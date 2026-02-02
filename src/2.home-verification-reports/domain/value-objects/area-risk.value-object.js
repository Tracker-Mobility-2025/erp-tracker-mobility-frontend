/**
 * Value Object: AreaRisk
 * Representa los niveles de riesgo de una zona
 * Domain Layer - Value Object
 */

export const AreaRiskEnum = {
  NINGUNO: 'NINGUNO',
  TRANSITA_CON_CAUTELA: 'TRANSITA_CON_CAUTELA',
  PRESENCIA_DELINCUENCIAL: 'PRESENCIA_DELINCUENCIAL',
  ZONA_PELIGROSA: 'ZONA_PELIGROSA'
};

export const AreaRiskOptions = [
  { value: AreaRiskEnum.NINGUNO, label: 'Ninguno' },
  { value: AreaRiskEnum.TRANSITA_CON_CAUTELA, label: 'Transita con cautela' },
  { value: AreaRiskEnum.PRESENCIA_DELINCUENCIAL, label: 'Presencia delincuencial' },
  { value: AreaRiskEnum.ZONA_PELIGROSA, label: 'Zona peligrosa' }
];

/**
 * Valida que un valor sea un riesgo de zona válido
 */
export const isValidAreaRisk = (value) => {
  return Object.values(AreaRiskEnum).includes(value);
};

/**
 * Valida un array de riesgos de zona
 */
export const validateAreaRisks = (risks) => {
  if (!Array.isArray(risks)) {
    return { valid: false, error: 'Los riesgos deben ser un array' };
  }
  
  const invalidRisks = risks.filter(risk => !isValidAreaRisk(risk));
  if (invalidRisks.length > 0) {
    return { 
      valid: false, 
      error: `Riesgos inválidos: ${invalidRisks.join(', ')}` 
    };
  }
  
  return { valid: true };
};
