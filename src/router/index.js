import {createRouter, createWebHistory} from "vue-router";
import ServiceOrderManagementComponent
    from "../tracker-mobility/service-orders/pages/service-order-management.component.vue";
import VerifiersManagementComponent
    from "../tracker-mobility/verifier-management/pages/verifiers-management.component.vue";
import VerificationReportsManagementComponent
    from "../tracker-mobility/verification-reports/pages/verification-reports-management.component.vue";
import OrderDetailManagementComponent from "../tracker-mobility/service-orders/pages/order-detail-management.component.vue";
import SignInComponent from "../tracker-mobility/security/pages/sign-in.component.vue";
import LayoutTrackerMobilityComponent from "../public/pages/layout-tracker-mobility.component.vue";
import VerifiersDetailsManagementComponent
    from "../tracker-mobility/verifier-management/pages/verifiers-details.management.component.vue";
import DetailsHomeVerificationReportComponent
    from "../tracker-mobility/verification-reports/pages/details-home-verification-report.component.vue";
import DashboardManagementComponent from "../tracker-mobility/dashboard/pages/dashboard-management.component.vue";
import ClientManagementComponent from "../tracker-mobility/client-management/pages/client-management.component.vue";
import ClientDetailsManagementComponent
    from "../tracker-mobility/client-management/pages/client-details-management.component.vue";
import {authenticationGuard} from "../tracker-mobility/security/services/authentication.guard.js";
import ManagementRequestFormComponent
    from "../client-tracker-mobility/order-request/pages/management-request-form.component.vue";
import VerificationRequestsManagementComponent
    from "../client-tracker-mobility/request-management/pages/verification-requests-management.component.vue";
import VerificationRequestDetailsComponent
    from "../client-tracker-mobility/request-management/pages/verification-request-details.component.vue";



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/sign-in' , name: 'sign-in', component: SignInComponent, meta: { title:'Login'}},

        // =====================================================================================

        {
            path: '/',
            component: LayoutTrackerMobilityComponent,
            meta: {
                title: 'Tracker Mobility',
                roles: ['ADMIN', 'COMPANY_EMPLOYEE'] // Ambos roles pueden acceder al layout
            },
            children: [

                // Ruta por defecto al entrar en / (redirige según el rol)
                {
                    path: '',
                    name: 'home',
                    redirect: () => {
                        // Esta redirección se maneja en el guard de autenticación
                        return { name: 'dashboard' };
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
                        roles: ['ADMIN']
                    }
                },

                // Órdenes de servicio
                {
                    path: 'admin/service-orders',
                    name: 'service-orders',
                    component: ServiceOrderManagementComponent,
                    meta: {
                        title: 'Ordenes de servicio',
                        roles: ['ADMIN']
                    }
                },
                {
                    path: 'admin/order-details',
                    name: 'order-details',
                    component: OrderDetailManagementComponent,
                    meta: {
                        title: 'Detalles de la orden',
                        roles: ['ADMIN']
                    }
                },

                // Verificadores
                {
                    path: 'admin/verifiers',
                    name: 'verifiers',
                    component: VerifiersManagementComponent,
                    meta: {
                        title: 'Verificadores',
                        roles: ['ADMIN']
                    }
                },
                {
                    path: 'admin/verifier-details',
                    name: 'verifier-details',
                    component: VerifiersDetailsManagementComponent,
                    meta: {
                        title: 'Detalles del verificador',
                        roles: ['ADMIN']
                    }
                },

                // Reportes de verificación
                {
                    path: 'admin/verification-reports',
                    name: 'verification-reports',
                    component: VerificationReportsManagementComponent,
                    meta: {
                        title: 'Reportes de verificación',
                        roles: ['ADMIN']
                    }
                },
                {
                    path: 'admin/verification-reports-details',
                    name: 'verification-reports-details',
                    component: DetailsHomeVerificationReportComponent,
                    meta: {
                        title: 'Detalles del reporte de verificación',
                        roles: ['ADMIN']
                    }
                },

                // Clientes
                {
                    path: 'admin/clients',
                    name: 'clients',
                    component: ClientManagementComponent,
                    meta: {
                        title: 'Clientes',
                        roles: ['ADMIN']
                    }
                },
                {
                    path: 'admin/client-detail',
                    name: 'client-detail',
                    component: ClientDetailsManagementComponent,
                    meta: {
                        title: 'Detalle del cliente',
                        roles: ['ADMIN']
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