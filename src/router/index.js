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
import ManagementRequestsHomeVisitOrdersComponent
    from "../client-tracker-mobility/order-request/pages/management-requests-home-visit-orders.component.vue";
import RequestServiceBusinessFormComponent
    from "../client-tracker-mobility/order-request/components/1-request-service-business-form.component.vue";
import CustomerDataFormComponent
    from "../client-tracker-mobility/order-request/components/2-customer-data-form.component.vue";
import SupportDocsAndLandlordFormComponent
    from "../client-tracker-mobility/order-request/components/3-support-docs-and-landlord-form.component.vue";
import ResumenServiceOrderComponent
    from "../client-tracker-mobility/order-request/components/4-resumen-service-order.component.vue";
import DetailsHomeVerificationReportComponent
    from "../tracker-mobility/verification-reports/pages/details-home-verification-report.component.vue";
import DashboardManagementComponent from "../tracker-mobility/dashboard/pages/dashboard-management.component.vue";
import ClientManagementComponent from "../tracker-mobility/client-management/pages/client-management.component.vue";
import ClientDetailsManagementComponent
    from "../tracker-mobility/client-management/pages/client-details-management.component.vue";
import {authenticationGuard} from "../tracker-mobility/security/services/authentication.guard.js";





const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/tracker-mobility/sign-in' , name: 'sign-in', component: SignInComponent, meta: { title:'Login'}},

        // =====================================================================================

        {
            path: '/tracker-mobility', name: 'tracker-mobility', component: LayoutTrackerMobilityComponent, meta: {title: 'Tracker Mobility'},
            children: [

                // Rutas de administración de órdenes de servicio
                //========================================================
                {
                    path: 'admin/service-orders',
                    name: 'service-orders',
                    component: ServiceOrderManagementComponent,
                    meta: {title: 'Ordenes de servicio'}
                },
                {
                    path: 'admin/order-details',
                    name: 'order-details',
                    component: OrderDetailManagementComponent,
                    meta: {title: 'Detalles de la orden'}
                },
                //========================================================


                // Rutas de administración de verificadores
                //========================================================
                {
                    path: 'admin/verifiers',
                    name: 'verifiers',
                    component: VerifiersManagementComponent,
                    meta: {title: 'Verificadores'}
                },
                {
                    path: 'admin/verifier-details',
                    name: 'verifier-details',
                    component: VerifiersDetailsManagementComponent,
                    meta: {title: 'Detalles del verificador'}
                },
                //========================================================


                // Rutas de administración de reportes de verificación
                //========================================================
                {
                    path: 'admin/verification-reports',
                    name: 'verification-reports',
                    component: VerificationReportsManagementComponent
                    , meta: {title: 'Reportes de verificación'}
                },
                {
                    path: 'admin/verification-reports-details',
                    name: 'verification-reports-details',
                    component: DetailsHomeVerificationReportComponent,
                    meta: {title: 'Detalles del reporte de verificación'}
                },
                //========================================================


                // Rutas de dashboard (por implementar)
                //========================================================
                {
                    path: 'admin/dashboard',
                    name: 'dashboard',
                    component: DashboardManagementComponent,
                    meta: {title: 'Dashboard'}
                },


                //========================================================



                // Rutas de administración de clientes (por implementar)
                //========================================================
                {
                    path: 'admin/clients',
                    name: 'clients',
                    component: ClientManagementComponent,
                    meta: {title: 'Clientes'}
                },
                {
                    path: 'admin/client-detail',
                    name: 'client-detail',
                    component: ClientDetailsManagementComponent,
                    meta: {title: 'Detalle del cliente'}
                }

                //========================================================


            ]

        },




        // ============== Rutas del formulario de solicitud de visita domiciliaria ==============
        {path: '/tracker-mobility/service-request', name: 'service-request', component: ManagementRequestsHomeVisitOrdersComponent, meta: {title: 'Solicitar visita domiciliaria'},

            children: [
                {path: 'petitioner-data', name: 'petitioner-data', component: RequestServiceBusinessFormComponent, meta: {title: 'Solicitante'}},
                {path: 'customer-data', name: 'customer-data', component: CustomerDataFormComponent, meta: {title: 'Cliente'}},
                {path: 'documentation-upload', name: 'documentation-upload', component: SupportDocsAndLandlordFormComponent, meta: {title: 'Documentación'}},
                {path: 'visit-request/confirmation', name: 'confirmation', component: ResumenServiceOrderComponent, meta: {title: 'Confirmación'}},
            ]
        },

















        /*
        {path: '/elixir-line/sign-up', name: 'sign-up', component: SignUpComponent, meta: { title: 'Sign Up'}},


        //ruta para la página de inicio home-elixir line
        {
            path: '/elixir-line/:id', name: 'ElixirLineHome', component: LayoutElixirLineComponent,
            children:[
                {path: 'vinicultor/winemaking', name: 'WinemakingProcess', component: TabsWinemakingViewComponent,     meta: { title: 'Winemaking' }},
                {path:'vinicultor/supplies', name: 'SuppliesManagement', component: SupplyManagement, meta: { title: 'Supplies' }},
                {path: 'vinicultor/profile/settings', name: 'ProfileSettings', component: ProfileViewsConfigurationComponent, meta: { title: 'Profile Settings'}},

            ], meta: { title: 'Wine Batches' },

        },
        */

        // Ruta catch-all DEBE estar al final para no interceptar otras rutas
        {path: '/:pathMatch(.*)*', redirect: '/tracker-mobility/sign-in'}

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