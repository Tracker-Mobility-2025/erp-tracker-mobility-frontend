/**
 * Constantes del dominio de observaciones.
 * Define reglas de negocio, enums y mensajes del dominio.
 */

// Estados de la observación
export const ObservationStatus = {
    PENDIENTE: 'PENDIENTE',
    EN_REVISION: 'EN_REVISION',
    SUBSANADA: 'SUBSANADA',
    RECHAZADA: 'RECHAZADA'
};

// Tipos de observación
export const ObservationType = {
    DOCUMENTACION: 'DOCUMENTACION',
    VIVIENDA: 'VIVIENDA',
    UBICACION: 'UBICACION',
    CLIENTE: 'CLIENTE',
    REFERENCIAS: 'REFERENCIAS',
    ZONA: 'ZONA',
    OTROS: 'OTROS'
};

// Reglas de negocio para observaciones
export const ObservationBusinessRules = {
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 500,
    REQUIRED_FIELDS: ['observationType', 'description']
};

// Mensajes de error del dominio
export const ObservationMessages = {
    ID_REQUIRED: 'ID de observación es requerido',
    ORDER_ID_REQUIRED: 'ID de orden es requerido',
    TYPE_REQUIRED: 'Tipo de observación es requerido',
    DESCRIPTION_REQUIRED: 'Descripción es requerida',
    DESCRIPTION_TOO_SHORT: 'La descripción debe tener al menos 10 caracteres',
    DESCRIPTION_TOO_LONG: 'La descripción no debe exceder 500 caracteres',
    STATUS_REQUIRED: 'Estado es requerido',
    INVALID_STATUS: 'Estado inválido',
    INVALID_TYPE: 'Tipo de observación inválido'
};

// Estado por defecto
export const DefaultObservationStatus = ObservationStatus.PENDIENTE;

// Traducciones de estado
export const ObservationStatusTranslations = {
    [ObservationStatus.PENDIENTE]: 'Pendiente',
    [ObservationStatus.EN_REVISION]: 'En Revisión',
    [ObservationStatus.SUBSANADA]: 'Subsanada',
    [ObservationStatus.RECHAZADA]: 'Rechazada'
};

// Traducciones de tipo
export const ObservationTypeTranslations = {
    [ObservationType.DOCUMENTACION]: 'Documentación',
    [ObservationType.VIVIENDA]: 'Vivienda',
    [ObservationType.UBICACION]: 'Ubicación',
    [ObservationType.CLIENTE]: 'Cliente',
    [ObservationType.REFERENCIAS]: 'Referencias',
    [ObservationType.ZONA]: 'Zona',
    [ObservationType.OTROS]: 'Otros'
};

// Colores de estado para UI
export const ObservationStatusColors = {
    [ObservationStatus.PENDIENTE]: 'warning',
    [ObservationStatus.EN_REVISION]: 'info',
    [ObservationStatus.SUBSANADA]: 'success',
    [ObservationStatus.RECHAZADA]: 'danger'
};

// Iconos de estado
export const ObservationStatusIcons = {
    [ObservationStatus.PENDIENTE]: 'pi pi-clock',
    [ObservationStatus.EN_REVISION]: 'pi pi-search',
    [ObservationStatus.SUBSANADA]: 'pi pi-check-circle',
    [ObservationStatus.RECHAZADA]: 'pi pi-times-circle'
};

// Iconos de tipo
export const ObservationTypeIcons = {
    [ObservationType.DOCUMENTACION]: 'pi pi-file',
    [ObservationType.VIVIENDA]: 'pi pi-home',
    [ObservationType.UBICACION]: 'pi pi-map-marker',
    [ObservationType.CLIENTE]: 'pi pi-user',
    [ObservationType.REFERENCIAS]: 'pi pi-users',
    [ObservationType.ZONA]: 'pi pi-map',
    [ObservationType.OTROS]: 'pi pi-info-circle'
};
