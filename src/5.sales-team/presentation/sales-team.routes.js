/**
 * Configuración de rutas para el módulo de equipo de ventas
 * Bounded Context: 5.sales-team
 * Solo accesible para usuarios con rol GERENTE_VENTAS
 */
import SalesTeamList from './views/sales-team-list.vue';
import EmployeeOrders from './views/employee-orders.vue';
import OrderDetail from './views/order-detail.vue';

export const salesTeamRoutes = [
    {
        path: '',
        name: 'sales-team-list',
        component: SalesTeamList,
        meta: {
            title: 'Equipo de Ventas'
        }
    },
    {
        path: 'employee/:employeeId/orders',
        name: 'employee-orders',
        component: EmployeeOrders,
        meta: {
            title: 'Órdenes del Vendedor'
        }
    },
    {
        path: 'order/:orderId',
        name: 'order-detail',
        component: OrderDetail,
        meta: {
            title: 'Detalle de Orden'
        }
    }
];

export default salesTeamRoutes;
