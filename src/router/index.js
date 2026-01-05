import {createRouter, createWebHistory} from "vue-router";
import LayoutTrackerMobilityComponent from "../public/pages/layout-tracker-mobility.component.vue";
import SignInComponent from "../tracker-mobility/security/pages/sign-in.component.vue";
import DashboardManagementComponent from "../tracker-mobility/dashboard/pages/dashboard-management.component.vue";
import {authenticationGuard} from "../tracker-mobility/security/services/authentication.guard.js";
import ManagementRequestFormComponent
    from "../client-tracker-mobility/order-request/pages/management-request-form.component.vue";
import VerificationRequestsManagementComponent
    from "../client-tracker-mobility/request-management/pages/verification-requests-management.component.vue";
import VerificationRequestDetailsComponent
    from "../client-tracker-mobility/request-management/pages/verification-request-details.component.vue";
import VerificationReportsManagementComponent
    from "../tracker-mobility/verification-reports/pages/verification-reports-management.component.vue";

// Importar rutas de módulos con nueva arquitectura (Bounded Contexts)
import { verifierRoutes } from "../3.verifiers-accounts/presentation/verifier.routes.js";
import { customerRoutes } from "../4.customer-management/presentation/customer.routes.js";
import { verificationOrderRoutes } from "../1.verification-orders/presentation/verification-order.routes.js";



const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Ruta de inicio de sesión como primera ruta
        {path: '/sign-in' , name: 'sign-in', component: SignInComponent, meta: { title:'Login'}},

        // Redirección de la raíz al sign-in
        {
            path: '/',
            redirect: '/sign-in'
        },

        // =====================================================================================

        {
            path: '/app',
            component: LayoutTrackerMobilityComponent,
            meta: {
                title: 'Tracker Mobility',
                roles: ['ADMIN', 'MASTER_ADMIN', 'COMPANY_EMPLOYEE'] // Todos los roles autorizados
            },
            children: [

                // Ruta por defecto al entrar en /app (redirige según el rol del usuario)
                {
                    path: '',
                    name: 'home',
                    redirect: (to) => {
                        // Obtener el rol del usuario desde localStorage
                        const userRole = localStorage.getItem('role');
                        
                        // Redirigir según el rol
                        if (userRole === 'COMPANY_EMPLOYEE') {
                            return { name: 'management-requests-form' };
                        }
                        
                        // ADMIN y otros roles van a verification-orders
                        return { name: 'verification-orders-list' };
                    }
                },

                // ============== Rutas de ADMIN ==============
                //========================================================

                // Dashboard
                {
                    path: 'admin/dashboard',
                    name: 'dashboard',
                    component: DashboardManagementComponent,
                    meta: {
                        title: 'Dashboard',
                        roles: ['ADMIN', 'MASTER_ADMIN']
                    }
                },

                // Órdenes de Verificación (nueva arquitectura - Bounded Context: 1.verification-orders)
                {
                    path: 'admin/verification-orders',
                    name: 'verification-orders-module',
                    children: verificationOrderRoutes,
                    meta: {
                        title: 'Órdenes de Verificación',
                        roles: ['ADMIN', 'MASTER_ADMIN']
                    }
                },

                // Verificadores (nueva arquitectura - Bounded Context: 3.verifiers-accounts)
                {
                    path: 'admin/verifiers',
                    name: 'verifiers-module',
                    children: verifierRoutes,
                    meta: {
                        title: 'Gestión de Verificadores',
                        roles: ['ADMIN', 'MASTER_ADMIN']
                    }
                },

                // Clientes (nueva arquitectura - Bounded Context: 4.customer-management)
                {
                    path: 'admin/clients',
                    name: 'clients-module',
                    children: customerRoutes,
                    meta: {
                        title: 'Gestión de Clientes',
                        roles: ['ADMIN', 'MASTER_ADMIN']
                    }
                },

                // Reportes de verificación
                {
                    path: 'admin/verification-reports',
                    name: 'verification-reports',
                    component: VerificationReportsManagementComponent,
                    meta: {
                        title: 'Reportes de verificación',
                        roles: ['ADMIN', 'MASTER_ADMIN']
                    }
                },

                //========================================================


                // ============== Rutas de COMPANY_EMPLOYEE ==============
                //========================================================

                // Solicitar nueva orden de visita domiciliaria
                {
                    path: 'applicant-company/management-request-form',
                    name: 'management-requests-form',
                    component: ManagementRequestFormComponent,
                    meta: {
                        title: 'Solicitud de visita domiciliaria',
                        roles: ['COMPANY_EMPLOYEE']
                    }
                },

                // Mis órdenes
                {
                    path: 'applicant-company/my-service-orders',
                    name: 'my-service-orders',
                    component: VerificationRequestsManagementComponent,
                    meta: {
                        title: 'Mis Solicitudes',
                        roles: ['COMPANY_EMPLOYEE']
                    }
                },

                // Detalle de solicitud de verificación
                {
                    path: 'applicant-company/verification-request-details',
                    name: 'verification-request-details',
                    component: VerificationRequestDetailsComponent,
                    meta: {
                        title: 'Detalle de Solicitud',
                        roles: ['COMPANY_EMPLOYEE']
                    }
                }

                //========================================================

            ]

        },



        // Ruta catch-all DEBE estar al final para no interceptar otras rutas
        {path: '/:pathMatch(.*)*', redirect: '/sign-in'}

    ]
});


// Añadir el guardia de autenticación a las rutas protegidas del enrutador Vue Router
router.beforeEach(authenticationGuard);

// Cambiar el título del documento según la meta-etiqueta 'title' de la ruta
router.beforeEach((to, from, next) => {
    let baseTitle = 'Tracker Mobility';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})




export default router;