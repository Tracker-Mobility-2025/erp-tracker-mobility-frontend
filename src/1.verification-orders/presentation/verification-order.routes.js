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
  }
];
