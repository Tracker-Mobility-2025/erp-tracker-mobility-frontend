/**
 * Rutas del módulo de solicitudes de orden.
 */
export const orderRequestRoutes = [
  {
    path: '/order-requests',
    name: 'order-requests',
    component: () => import('./views/order-requests-management.vue'),
    meta: {
      title: 'Solicitudes de Orden',
      requiresAuth: true
    }
  },
  {
    path: '/order-requests/:id',
    name: 'order-request-details',
    component: () => import('./views/order-request-detail.vue'),
    meta: {
      title: 'Detalle de Solicitud',
      requiresAuth: true
    }
  }
];
