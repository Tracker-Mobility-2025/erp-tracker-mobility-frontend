/**
 * Rutas del módulo de órdenes de verificación.
 */
export const verificationOrderRoutes = [
  {
    path: '/verification-orders',
    name: 'verification-orders',
    component: () => import('./views/verification-orders-management.vue'),
    meta: {
      title: 'Órdenes de Verificación',
      requiresAuth: true
    }
  },
  {
    path: '/verification-orders/:id',
    name: 'verification-order-details',
    component: () => import('./views/verification-order-detail.vue'),
    meta: {
      title: 'Detalle de Orden',
      requiresAuth: true
    }
  }
];
