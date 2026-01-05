import { OrderStatus, OrderStatusTranslations } from '../domain/constants/verification-order.constants.js';

/**
 * Constantes de UI para el módulo de órdenes de verificación.
 * Define etiquetas, columnas, colores de estado y traducciones para la interfaz.
 */

/**
 * Etiquetas de la interfaz de usuario
 */
export const UILabels = {
  MODULE_TITLE: 'Órdenes de Verificación',
  MODULE_DESCRIPTION: 'Gestione las órdenes de verificación de viviendas y clientes.',
  
  // Vistas
  LIST_TITLE: 'Listado de Órdenes',
  DETAIL_TITLE: 'Detalle de Orden',
  CREATE_TITLE: 'Nueva Orden',
  EDIT_TITLE: 'Editar Orden',
  DELETE_CONFIRMATION: '¿Está seguro de eliminar esta orden?',
  NO_RECORDS: 'No se encontraron órdenes',
  LOADING: 'Cargando órdenes...',
  
  // Campos
  ORDER_CODE: 'Código de Orden',
  STATUS: 'Estado',
  CLIENT: 'Cliente',
  COMPANY: 'Empresa',
  VERIFIER: 'Verificador',
  VISIT_DATE: 'Fecha de Visita',
  REQUEST_DATE: 'Fecha de Solicitud',
  ACTIONS: 'Acciones',
  
  // Botones
  BTN_NEW: 'Nueva Orden',
  BTN_EDIT: 'Editar',
  BTN_DELETE: 'Eliminar',
  BTN_VIEW: 'Ver Detalle',
  BTN_ASSIGN_VERIFIER: 'Asignar Verificador',
  BTN_CHANGE_STATUS: 'Cambiar Estado',
  BTN_SAVE: 'Guardar',
  BTN_CANCEL: 'Cancelar',
  BTN_SEARCH: 'Buscar',
  BTN_FILTER: 'Filtrar',
  BTN_EXPORT: 'Exportar',
  
  // Filtros
  FILTER_ALL: 'Todos',
  FILTER_BY_STATUS: 'Filtrar por Estado',
  FILTER_BY_DATE: 'Filtrar por Fecha',
  FILTER_BY_VERIFIER: 'Filtrar por Verificador',
  SEARCH_PLACEHOLDER: 'Buscar por código, cliente o empresa...'
};

/**
 * Configuración de columnas para DataManager
 */
export const TableColumns = [
  {
    field: 'orderCodeValue',
    header: 'Código',
    sortable: true,
    width: '150px'
  },
  {
    field: 'status',
    header: 'Estado',
    sortable: true,
    width: '140px'
  },
  {
    field: 'clientFullName',
    header: 'Cliente',
    sortable: true,
    width: '200px'
  },
  {
    field: 'companyName',
    header: 'Empresa',
    sortable: true,
    width: '180px'
  },
  {
    field: 'visitDate',
    header: 'Fecha de Visita',
    sortable: true,
    width: '150px'
  },
  {
    field: 'requestDate',
    header: 'Fecha de Solicitud',
    sortable: true,
    width: '150px'
  }
];

/**
 * Colores de estado para badges
 */
export const StatusColors = {
  [OrderStatus.PENDIENTE]: 'warning',      // Amarillo
  [OrderStatus.ASIGNADO]: 'info',          // Azul
  [OrderStatus.EN_PROCESO]: 'primary',     // Azul oscuro
  [OrderStatus.COMPLETADA]: 'success',     // Verde
  [OrderStatus.CANCELADA]: 'danger',       // Rojo
  [OrderStatus.OBSERVADO]: 'warning',      // Amarillo/Naranja
  [OrderStatus.SUBSANADA]: 'success'       // Verde
};

/**
 * Iconos de estado
 */
export const StatusIcons = {
  [OrderStatus.PENDIENTE]: 'pi pi-clock',
  [OrderStatus.ASIGNADO]: 'pi pi-user-plus',
  [OrderStatus.EN_PROCESO]: 'pi pi-spin pi-spinner',
  [OrderStatus.COMPLETADA]: 'pi pi-check-circle',
  [OrderStatus.CANCELADA]: 'pi pi-times-circle',
  [OrderStatus.OBSERVADO]: 'pi pi-exclamation-triangle',
  [OrderStatus.SUBSANADA]: 'pi pi-check'
};

/**
 * Opciones para filtro de estado
 */
export const StatusFilterOptions = Object.entries(OrderStatusTranslations).map(([value, label]) => ({
  value,
  label
}));

// Agregar opción "Todos" al inicio
StatusFilterOptions.unshift({ label: 'Todos', value: null });

/**
 * Breadcrumbs para navegación
 */
export const Breadcrumbs = {
  LIST: [
    { label: 'Inicio', to: '/tracker-mobility' },
    { label: 'Órdenes de Verificación', to: '/tracker-mobility/verification-orders' }
  ],
  DETAIL: (orderCode) => [
    { label: 'Inicio', to: '/tracker-mobility' },
    { label: 'Órdenes de Verificación', to: '/tracker-mobility/verification-orders' },
    { label: orderCode, to: null }
  ]
};

/**
 * Configuración de acciones del DataManager
 */
export const DataManagerActions = {
  view: {
    icon: 'pi pi-eye',
    label: 'Ver',
    class: 'p-button-info p-button-sm'
  },
  assignVerifier: {
    icon: 'pi pi-user-plus',
    label: 'Asignar',
    class: 'p-button-primary p-button-sm'
  },
  edit: {
    icon: 'pi pi-pencil',
    label: 'Editar',
    class: 'p-button-warning p-button-sm'
  },
  delete: {
    icon: 'pi pi-trash',
    label: 'Eliminar',
    class: 'p-button-danger p-button-sm'
  }
};
