import { CustomerStatus } from '../../domain/constants/customer.constants.js';

/**
 * Constantes de presentación para clientes.
 * Concerns de UI - NO pertenecen al dominio.
 */

/**
 * Traducción de estados (del backend a UI)
 */
export const StatusTranslations = {
  [CustomerStatus.ACTIVE]: 'Activo',
  [CustomerStatus.INACTIVE]: 'Inactivo'
};

/**
 * Opciones para filtro de estado en componentes
 */
export const StatusFilterOptions = [
  { label: 'Todos', value: '' },
  { label: 'Activo', value: CustomerStatus.ACTIVE },
  { label: 'Inactivo', value: CustomerStatus.INACTIVE }
];

/**
 * Mapeo de estado a clase CSS
 */
export const StatusClassMap = {
  [CustomerStatus.ACTIVE]: 'status-activo',
  [CustomerStatus.INACTIVE]: 'status-inactivo'
};

/**
 * Etiquetas de UI para componentes
 */
export const CustomerUILabels = {
  title: {
    singular: 'cliente',
    plural: 'clientes'
  },
  placeholders: {
    search: 'Buscar por RUC, nombre de empresa o estado...',
    ruc: 'Ingrese el RUC (11 dígitos)',
    companyName: 'Ingrese el nombre de la empresa'
  },
  buttons: {
    new: 'Agregar Cliente',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    clearFilters: 'Limpiar filtros'
  },
  messages: {
    noCustomers: 'No hay clientes registrados',
    noResults: 'No se encontraron clientes',
    addFirstCustomer: 'Comienza agregando tu primer cliente'
  }
};

/**
 * Etiquetas de UI para colaboradores
 */
export const EmployeeUILabels = {
  title: {
    singular: 'colaborador',
    plural: 'colaboradores'
  },
  placeholders: {
    search: 'Buscar por nombre, apellido, email, teléfono...',
    name: 'Ingrese los nombres',
    lastName: 'Ingrese los apellidos',
    email: 'ejemplo@correo.com',
    phoneNumber: '999 999 999'
  },
  buttons: {
    new: 'Nuevo Colaborador',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar'
  },
  messages: {
    noEmployees: 'No hay colaboradores registrados',
    addFirstEmployee: 'Comienza agregando el primer colaborador'
  }
};
