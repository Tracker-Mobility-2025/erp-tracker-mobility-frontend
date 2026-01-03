/**
 * Rutas del módulo de clientes.
 */
export const customerRoutes = [
  {
    path: '/customers',
    name: 'customers',
    component: () => import('./views/customers-management.vue'),
    meta: {
      title: 'Clientes',
      requiresAuth: true
    }
  },
  {
    path: '/customers/:id',
    name: 'customer-details',
    component: () => import('./views/customer-detail.vue'),
    meta: {
      title: 'Detalle de Cliente',
      requiresAuth: true
    }
  }
];
