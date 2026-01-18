/**
 * Rutas del módulo de órdenes de verificación.
 * Bounded Context: 1.verification-orders
 */
import OrdersManagement from './views/orders-management.vue';
import OrderDetail from './views/order-detail.vue';

export const verificationOrderRoutes = [
  {
    path: '',
    name: 'verification-orders-list',
    component: OrdersManagement,
    meta: {
      title: 'Órdenes de Verificación',
      requiresAuth: true
    }
  },
  {
    path: 'detail',
    name: 'verification-order-detail',
    component: OrderDetail,
    meta: {
      title: 'Detalle de Orden',
      requiresAuth: true
    }
  }
];

export default verificationOrderRoutes;
