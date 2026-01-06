/**
 * Rutas del módulo de órdenes de verificación.
 */
export const verificationOrderRoutes = [
  {
    path: '',
    name: 'verification-orders-list',
    component: () => import('./views/orders-management.vue'),
    meta: {
      title: 'Órdenes de Verificación',
      requiresAuth: true
    }
  },
  {
    path: 'detail',
    name: 'verification-order-detail',
    component: () => import('./views/order-detail.vue'),
    meta: {
      title: 'Detalle de Orden',
      requiresAuth: true
    }
  }
];
