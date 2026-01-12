/**
 * Configuración de rutas para el módulo de clientes
 * Bounded Context: 4.customer-management
 */
import CustomersManagement from './views/customers-management.vue';
import CustomerDetail from './views/customer-detail.vue';

export const customerRoutes = [
    {
        path: '',
        name: 'customers',
        component: CustomersManagement,
        meta: {
            title: 'Clientes',
            roles: ['ADMIN', 'MASTER_ADMIN']
        }
    },
    {
        path: 'details',
        name: 'customer-detail',
        component: CustomerDetail,
        meta: {
            title: 'Detalle del cliente',
            roles: ['ADMIN', 'MASTER_ADMIN']
        }
    }
];

export default customerRoutes;

