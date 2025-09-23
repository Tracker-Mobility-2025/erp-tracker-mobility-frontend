import {createRouter, createWebHistory} from "vue-router";
import ServiceOrderManagementComponent
    from "../tracker-mobility/service-orders/pages/service-order-management.component.vue";
import VerifiersManagementComponent
    from "../tracker-mobility/verifier-management/pages/verifiers.management.component.vue";
import VerificationReportsManagementComponent
    from "../tracker-mobility/verification-reports/pages/verification-reports-management.component.vue";
import OrderDetailComponent from "../tracker-mobility/service-orders/components/order-detail.component.vue";



const router = createRouter({
    history: createWebHistory(),
    routes: [

        //ruta por defecto para redirigir a la página de inicio home-elixir line
        //{path: '/:pathMatch(.*)*', redirect: '/tracker-mobility/sign-in'},

        //{path: '/tracker-mobility/sign-in' , name: 'sign-in', component: SignInComponent, meta: { title:'Login'}},

        {
            path: '/admin/service-orders',
            name: 'service-orders',
            component: ServiceOrderManagementComponent,
            meta: {title: 'Ordenes de servicio'}
        },

        {
            path: '/admin/verifiers',
            name: 'verifiers',
            component: VerifiersManagementComponent,
            meta: {title: 'Verificadores'}
        },

        {
            path: '/admin/verification-reports',
            name: 'verification-reports',
            component: VerificationReportsManagementComponent
            , meta: {title: 'Reportes de verificación'}
        },

        {
            path: '/admin/order-details',
            name: 'order-details',
            component: OrderDetailComponent,
            meta: {title: 'Detalles de la orden'}
        }



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

    ]
});


//router.beforeEach(authenticationGuard); //Descomentar esta línea para activar el guard de autenticación global

//Se implementó un guard global para cambiar el título de la página según la meta-etiqueta 'title' definida en cada ruta


router.beforeEach((to, from, next) => {
    let baseTitle = 'Tracker Mobility';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
})




export default router;