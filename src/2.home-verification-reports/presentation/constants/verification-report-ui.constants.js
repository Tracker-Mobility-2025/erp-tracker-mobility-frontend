/**
 * Constantes de presentación para reportes de verificación.
 */

// Traducciones de estados
export const StatusTranslations = {
  'CONFORME': 'Conforme',
  'OBSERVADO': 'Observado',
  'RECHAZADO': 'Rechazado',
  'PENDIENTE': 'Pendiente'
};

// Opciones de filtro de estado
export const StatusFilterOptions = [
  { label: 'Todos', value: '' },
  { label: 'Conforme', value: 'CONFORME' },
  { label: 'Observado', value: 'OBSERVADO' },
  { label: 'Rechazado', value: 'RECHAZADO' },
  { label: 'Pendiente', value: 'PENDIENTE' }
];

// Mapeo de clases CSS para estados
export const StatusClassMap = {
  'CONFORME': 'status-conforme',
  'OBSERVADO': 'status-observado',
  'RECHAZADO': 'status-rechazado',
  'PENDIENTE': 'status-pendiente'
};

// Etiquetas UI
export const VerificationReportUILabels = {
  title: {
    singular: 'reporte de verificación',
    plural: 'reportes de verificación'
  }
};

