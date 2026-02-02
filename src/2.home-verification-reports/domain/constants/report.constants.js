// Report Constants
// Domain layer - Business constants

/**
 * Estados válidos del resultado final del reporte
 */
export const FINAL_RESULT_VALUES = Object.freeze({
  CONFORME: 'CONFORME',
  OBSERVADO: 'OBSERVADO',
  RECHAZADO: 'RECHAZADO',
  ENTREVISTA_ARRENDADOR_FALTANTE: 'ENTREVISTA_ARRENDADOR_FALTANTE'
});

/**
 * Tipos de documento válidos
 */
export const DOCUMENT_TYPES = Object.freeze({
  DNI: 'DNI',
  CARNET_EXTRANJERIA: 'CARNET_EXTRANJERIA',
  PTP: 'PTP'
});

/**
 * Tipos de residencia
 */
export const RESIDENCE_TYPES = Object.freeze({
  PROPIA: 'PROPIA',
  ALQUILADA: 'ALQUILADA',
  FAMILIAR: 'FAMILIAR'
});

/**
 * Condiciones de vivienda
 */
export const DWELLING_CONDITIONS = Object.freeze({
  BUENO: 'BUENO',
  REGULAR: 'REGULAR',
  EN_CONSTRUCCION: 'EN_CONSTRUCCION',
  MODESTO: 'MODESTO',
  PRECARIA: 'PRECARIA'
});

/**
 * Materiales de vivienda
 */
export const DWELLING_MATERIALS = Object.freeze({
  NOBLE: 'NOBLE',
  MADERA: 'MADERA',
  PREFABRICADO: 'PREFABRICADO',
  ADOBE: 'ADOBE',
  ESTERA: 'ESTERA',
  QUINCHA: 'QUINCHA'
});

/**
 * Tipos de zona
 */
export const ZONE_TYPES = Object.freeze({
  URBANA: 'URBANA',
  COMERCIAL: 'COMERCIAL',
  INDUSTRIAL: 'INDUSTRIAL',
  POPULAR: 'POPULAR',
  PUEBLO_JOVEN: 'PUEBLO_JOVEN',
  AAHH: 'AAHH'
});

/**
 * Niveles de riesgo de área
 */
export const AREA_RISK_LEVELS = Object.freeze({
  NINGUNO: 'NINGUNO',
  TRANSITA_CON_CAUTELA: 'TRANSITA_CON_CAUTELA',
  PRESENCIA_DELINCUENCIAL: 'PRESENCIA_DELINCUENCIAL',
  ZONA_PELIGROSA: 'ZONA_PELIGROSA'
});

/**
 * Tipos de acceso a la zona
 */
export const ACCESS_TYPES = Object.freeze({
  FACIL: 'FACIL',
  REGULAR: 'REGULAR',
  DIFICIL: 'DIFICIL',
  INACCESIBLE: 'INACCESIBLE'
});

/**
 * Tipos de garaje
 */
export const GARAGE_TYPES = Object.freeze({
  PROPIA: 'PROPIA',
  ALQUILADA: 'ALQUILADA',
  NO_TIENE: 'NO_TIENE',
  NO_INDICA: 'NO_INDICA'
});

/**
 * Tipos de anexos fotográficos
 */
export const ANNEX_TYPES = Object.freeze({
  ANEXO_1: 'ANEXO_1', // Candidato
  ANEXO_2: 'ANEXO_2', // Domicilio
  ANEXO_3: 'ANEXO_3', // Cochera
  ANEXO_4: 'ANEXO_4', // Habitaciones
  ANEXO_5: 'ANEXO_5', // Alrededores
  ANEXO_6: 'ANEXO_6'  // Datacrim
});

/**
 * Límites de validación
 */
export const VALIDATION_LIMITS = Object.freeze({
  MIN_REPORT_CODE_LENGTH: 3,
  MAX_REPORT_CODE_LENGTH: 50,
  MIN_CLIENT_NAME_LENGTH: 2,
  MAX_CLIENT_NAME_LENGTH: 100,
  MIN_VERIFIER_NAME_LENGTH: 3,
  MAX_VERIFIER_NAME_LENGTH: 100,
  MIN_SUMMARY_LENGTH: 10,
  MAX_SUMMARY_LENGTH: 5000,
  MAX_OBSERVATION_LENGTH: 1000,
  DNI_LENGTH: 8,
  CARNET_EXTRANJERIA_MIN_LENGTH: 9,
  CARNET_EXTRANJERIA_MAX_LENGTH: 12,
  PTP_MIN_LENGTH: 6,
  PTP_MAX_LENGTH: 15
});
