/**
 * Rutas del módulo de solicitudes de orden.
 */
export const orderRequestRoutes = [
  {
    path: '',
    name: 'order-requests-list',
    component: () => import('./views/order-requests-management.vue'),
    meta: {
      title: 'Mis Solicitudes',
      roles: ['COMPANY_EMPLOYEE']
    }
  },
  {
    path: 'new',
    name: 'order-request-form',
    component: () => import('./views/order-request-form.vue'),
    meta: {
      title: 'Nueva Solicitud de Orden',
      roles: ['COMPANY_EMPLOYEE']
    }
  },
  {
    path: ':id',
    name: 'order-request-detail',
    component: () => import('./views/order-request-detail.vue'),
    meta: {
      title: 'Detalle de Solicitud',
      roles: ['COMPANY_EMPLOYEE']
    }
  }
];
