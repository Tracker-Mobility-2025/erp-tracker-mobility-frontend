/**
 * Constantes de presentación para reportes de verificación.
 */

// Traducciones de estados
export const StatusTranslations = {
  'CONFORME': 'Conforme',
  'OBSERVADO': 'Observado',
  'RECHAZADO': 'Rechazado',
  'ENTREVISTA_ARRENDADOR_FALTANTE': 'Entrevista Arrendador'
};

// Opciones de filtro de estado
export const StatusFilterOptions = [
  { label: 'Todos', value: '' },
  { label: 'Conforme', value: 'CONFORME' },
  { label: 'Observado', value: 'OBSERVADO' },
  { label: 'Rechazado', value: 'RECHAZADO' },
  { label: 'Entrevista Arrendador', value: 'ENTREVISTA_ARRENDADOR_FALTANTE' }
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

// ========== ENUMS DEL BACKEND - VISITA DOMICILIARIA ==========

// DwellingTypeEnum (tipo de vivienda)
export const DwellingTypeTranslations = {
  'CASA': 'Casa',
  'DEPARTAMENTO': 'Departamento',
  'CUARTO': 'Cuarto',
  'CONDOMINIO': 'Condominio',
  'QUINTA': 'Quinta',
  'NO_INDICO': 'No indicó'
};

// ResidenceTypeEnum (Tipo de residencia)
export const ResidenceTypeTranslations = {
  'PROPIA': 'Propia',
  'ALQUILADA': 'Alquilada',
  'FAMILIAR': 'Familiar'
};

// MaterialEnum (tipo de material de la vivienda)
export const DwellingMaterialTranslations = {
  'NOBLE': 'Noble',
  'MADERA': 'Madera',
  'PREFABRICADO': 'Prefabricado',
  'ADOBE': 'Adobe',
  'ESTERA': 'Estera',
  'QUINCHA': 'Quincha'
};

// ConditionEnum (Condición de la vivienda)
export const DwellingConditionTranslations = {
  'BUENO': 'Bueno',
  'REGULAR': 'Regular',
  'EN_CONSTRUCCION': 'En construcción',
  'MODESTO': 'Modesto',
  'PRECARIA': 'Precaria'
};

// RoofTypeEnum (tipo de techo)
export const RoofTypeTranslations = {
  'CASA_TECHADA': 'Casa techada',
  'CASA_NO_TECHADA': 'Casa no techada'
};

// TypeFurnishedEnum (Tipo de Amueblado)
export const TypeFurnishedTranslations = {
  'AMOBLADA': 'Amoblada',
  'NO_AMOBLADA': 'No amoblada',
  'SEMIAMOBLADA': 'Semi amoblada'
};

// ZoneTypeEnum (Tipo de zona)
export const ZoneTypeTranslations = {
  'URBANA': 'Urbana',
  'COMERCIAL': 'Comercial',
  'INDUSTRIAL': 'Industrial',
  'POPULAR': 'Popular',
  'PUEBLO_JOVEN': 'Pueblo joven',
  'AAHH': 'AAHH'
};

// ZoneCharacteristicsEnum (Características de la zona)
export const ZoneCharacteristicsTranslations = {
  'VIGILADA': 'Vigilada',
  'TRANQUERAS': 'Tranqueras',
  'SIN_PISTAS': 'Sin pistas',
  'SIN_VEREDAS': 'Sin veredas'
};

// AreaRiskEnum (Riesgo del área)
export const AreaRiskTranslations = {
  'NINGUNO': 'Ninguno',
  'TRANSITA_CON_CAUTELA': 'Transita con cautela',
  'PRESENCIA_DELINCUENCIAL': 'Presencia delincuencial',
  'ZONA_PELIGROSA': 'Zona peligrosa'
};

// ZoneAccessTypeEnum (Tipo de acceso a la zona)
export const AccessTypeTranslations = {
  'FACIL': 'Fácil',
  'REGULAR': 'Regular',
  'DIFICIL': 'Difícil',
  'INACCESIBLE': 'Inaccesible'
};

// GarageTypeEnum (tipo de cochera)
export const GarageTypeTranslations = {
  'PROPIA': 'Propia',
  'ALQUILADA': 'Alquilada',
  'NO_TIENE': 'No tiene',
  'NO_INDICA': 'No indica'
};

// DistanceToDwelling (no hay enum específico, manteniendo valores personalizados)
export const DistanceToDwellingTranslations = {
  'INSIDE_DWELLING': 'Ubicada dentro de la vivienda',
  'SAME_BUILDING': 'En el mismo edificio',
  'NEARBY': 'Cerca de la vivienda',
  'FAR': 'Lejos de la vivienda'
};

// DocumentTypeEnum (Tipo de documento cliente)
export const DocumentTypeTranslations = {
  'DNI': 'DNI',
  'CARNET_EXTRANJERIA': 'Carnet de Extranjería',
  'PTP': 'PTP'
};

// ========== ENUMS ADICIONALES ÚTILES ==========

// ServiceStatusEnum (Estado de la orden)
export const ServiceStatusTranslations = {
  'PENDIENTE': 'Pendiente',
  'ASIGNADO': 'Asignado',
  'EN_PROCESO': 'En proceso',
  'COMPLETADA': 'Completada',
  'CANCELADA': 'Cancelada',
  'OBSERVADO': 'Observado',
  'SUBSANADA': 'Subsanada',
  'ENTREVISTA_FALTANTE': 'Entrevista faltante'
};

// ObservationTypeEnum (Tipo de observación)
export const ObservationTypeTranslations = {
  'DOCUMENTO_IDENTIDAD': 'Documento de identidad',
  'RECIBO_SERVICIO': 'Recibo de servicio',
  'DATOS_DEL_CLIENTE_NO_COINCIDEN': 'Datos del cliente no coinciden',
  'DOCUMENTO_IDENTIDAD_BORROSO': 'Documento de identidad borroso',
  'RECIBO_SERVICIO_BORROSO': 'Recibo de servicio borroso',
  'FOTO_FACHADA_BORROSA': 'Foto de fachada borrosa',
  'UBICACION_INCORRECTA': 'Ubicación incorrecta',
  'DATOS_CLIENTE_INCOMPLETOS': 'Datos del cliente incompletos',
  'DATOS_ARRENDADOR_INCOMPLETOS': 'Datos del arrendador incompletos',
  'OTROS': 'Otros'
};

// ObservationStatusEnum (Estatus de la observación)
export const ObservationStatusTranslations = {
  'RESUELTA': 'Resuelta',
  'PENDIENTE': 'Pendiente'
};


