import { VerifierStatus } from '../../domain/constants/verifier.constants.js';

/**
 * Constantes de presentación para verificadores.
 * Concerns de UI - NO pertenecen al dominio.
 */

/**
 * Traducción de estados (del backend a UI)
 */
export const StatusTranslations = {
  [VerifierStatus.ACTIVE]: 'Activo',
  [VerifierStatus.INACTIVE]: 'Inactivo'
};

/**
 * Opciones para filtro de estado en componentes
 */
export const StatusFilterOptions = [
  { label: 'Todos', value: null },
  { label: 'Activo', value: VerifierStatus.ACTIVE },
  { label: 'Inactivo', value: VerifierStatus.INACTIVE }
];

/**
 * Mapeo de estado a clase CSS
 */
export const StatusClassMap = {
  [VerifierStatus.ACTIVE]: 'status-activo',
  [VerifierStatus.INACTIVE]: 'status-inactivo'
};

/**
 * Traducción de roles (del backend a UI)
 */
export const RoleTranslations = {
  VERIFIER: 'VERIFICADOR',
  ADMIN: 'ADMINISTRADOR',
  MASTER_ADMIN: 'ADMINISTRADOR MASTER'
};

/**
 * Etiquetas de UI para componentes
 */
export const VerifierUILabels = {
  title: {
    singular: 'verificador',
    plural: 'verificadores'
  },
  placeholders: {
    email: 'correo@ejemplo.com',
    phone: '987654321',
    name: 'Ingrese nombre',
    lastName: 'Ingrese apellido',
    password: 'Mínimo 8 caracteres'
  },
  messages: {
    noName: 'Sin nombre',
    noEmail: 'Sin email',
    noPhone: 'Sin teléfono',
    noSchedule: 'Sin horario definido'
  }
};
