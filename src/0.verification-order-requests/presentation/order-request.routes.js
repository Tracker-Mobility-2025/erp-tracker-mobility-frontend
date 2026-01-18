/**
 * Rutas del módulo de solicitudes de orden.
 * Bounded Context: 0.verification-order-requests
 */
import OrderRequestsManagement from './views/order-requests-management.vue';
import OrderRequestForm from './views/order-request-form.vue';
import OrderRequestDetail from './views/order-request-detail.vue';

export const orderRequestRoutes = [
  {
    path: '',
    name: 'order-requests-list',
    component: OrderRequestsManagement,
    meta: {
      title: 'Mis Solicitudes',
      roles: ['COMPANY_EMPLOYEE', 'GERENTE_VENTAS', 'VENDEDOR']
    }
  },
  {
    path: 'new',
    name: 'order-request-form',
    component: OrderRequestForm,
    meta: {
      title: 'Nueva Solicitud de Orden',
      roles: ['COMPANY_EMPLOYEE', 'GERENTE_VENTAS', 'VENDEDOR']
    }
  },
  {
    path: ':id',
    name: 'order-request-detail',
    component: OrderRequestDetail,
    meta: {
      title: 'Detalle de Solicitud',
      roles: ['COMPANY_EMPLOYEE', 'GERENTE_VENTAS', 'VENDEDOR']
    }
  }
];

export default orderRequestRoutes;
