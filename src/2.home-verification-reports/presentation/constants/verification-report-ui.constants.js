/**
 * Constantes de presentación para reportes de verificación.
 */

// Traducciones de estados
export const StatusTranslations = {
  'CONFORME': 'Conforme',
  'OBSERVADO': 'Observado',
  'RECHAZADO': 'Rechazado',
  'ENTREVISTA_ARRENDADOR_FALTANTE': 'Entrevista Arrendador Faltante'
};

// Opciones de filtro de estado
export const StatusFilterOptions = [
  { label: 'Todos', value: '' },
  { label: 'Conforme', value: 'CONFORME' },
  { label: 'Observado', value: 'OBSERVADO' },
  { label: 'Rechazado', value: 'RECHAZADO' },
  { label: 'Entrevista Arrendador Faltante', value: 'ENTREVISTA_ARRENDADOR_FALTANTE' }
];

// Mapeo de clases CSS para estados
export const StatusClassMap = {
  'CONFORME': 'status-conforme',
  'OBSERVADO': 'status-observado',
  'RECHAZADO': 'status-rechazado',
  'ENTREVISTA_ARRENDADOR_FALTANTE': 'status-entrevista-arrendador-faltante'
};

// Etiquetas UI
export const VerificationReportUILabels = {
  title: {
    singular: 'reporte de verificación',
    plural: 'reportes de verificación'
  }
};

