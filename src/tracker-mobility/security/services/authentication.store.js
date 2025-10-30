import {AuthenticationService} from "./authentication.service.js";
import {SignInResponse} from "../models/sign-in.response.js";
import {defineStore} from "pinia";

const authenticationService = new AuthenticationService();
/**
 * Authentication Store
 * @summary
 * Represents the authentication store
 */
export const useAuthenticationStore = defineStore('authentication', {
    state: () => ({ signedIn: false, userId: 0, username: '', role: '' }),
    getters: {
        /**
         * Is signed in
         * @param state - The state of the store
         * @returns {boolean} - True if signed in, false otherwise
         */
        isSignedIn: (state) => state['signedIn'],
        /**
         * Current user id
         * @param state - The state of the store
         * @returns {string} - The current user id
         */
        currentUserId: (state) => state['userId'],
        /**
         * Current username
         * @param state - The state of the store
         * @returns {string} - The current username
         */
        currentUsername: (state) => state['username'],
        /**
         * Current role
         * @returns {string} - The current role
         */
        currentRole: (state) => state['role'],

        /**
         * Current token
         * @returns {string} - The current token
         */
        currentToken: () => localStorage.getItem('token'),

    },
    actions: {
        /**
         * Sign in
         * @summary
         * This method calls the sign-in API.
         * @param signInRequest {SignInRequest} - The sign-in request
         * @param router - The router
         * @returns {Promise} - Promise that resolves on success or rejects on error
         */
        async signIn(signInRequest, router) {
            try {
                const response = await authenticationService.signIn(signInRequest);

                const signInResponse = new SignInResponse(
                    response.data.userId,
                    response.data.username,
                    response.data.token,
                    response.data.role
                );

                this.signedIn = true;
                this.userId = signInResponse.userId;
                this.username = signInResponse.username;
                this.role = signInResponse.role;

                localStorage.setItem('token', signInResponse.token);
                localStorage.setItem('userId', signInResponse.userId);
                localStorage.setItem('username', signInResponse.username);
                localStorage.setItem('role', signInResponse.role);

                console.log("✔ Login completo:", signInResponse);

                // Redirección inteligente basada en rol
                const redirectResult = this.redirectAfterLogin(router, signInResponse.role);
                
                // Si hubo error de rol no autorizado, propagar el error
                if (redirectResult && redirectResult.error) {
                    throw new Error(redirectResult.message);
                }
                
                return signInResponse;
            } catch (error) {
                this.signedIn = false;
                console.error("Error durante el login:", error);
                
                // Propagar el error al componente
                throw error;
            }
        },
        /*
         * Sign up
         * @summary
         * This method calls the sign-up API.
         * @param signUpRequest {SignUpRequest} - The sign-up request
         * @param router - The router
         */
        /*
        async signUp(signUpRequest, router) {
            authenticationService.signUp(signUpRequest)
                .then(response => {
                    let signUpResponse = new SignUpResponse(response.data.message);
                    console.log("✔ Registro completo:", signUpResponse.message);
                    router.push({name: 'sign-in'});
                })
                .catch(error => {
                    console.log(error);
                    router.push({name: 'sign-up'});
                });
        },
        */

        /**
         * Sign out
         * @summary
         * This method signs out the user.
         * It clears the token and redirects to the sign-in page.
         * It also sets the signedIn flag to false.
         * @param router - The router
         */
        async signOut(router) {
            this.signedIn = false;
            this.userId = 0;
            this.username = '';
            this.role = '';
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            router.push({name: 'sign-in'});
        },

        initialize() {
            console.log('[INIT] Restaurando sesión desde localStorage');
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('role');

            if (token && userId && username) {
                this.signedIn = true;
                this.userId = parseInt(userId);
                this.username = username;
                this.role = role || '';
                console.log('[INIT] Sesión restaurada:', this.username);
            } else {
                console.warn('[INIT] No hay datos válidos en localStorage');
            }
        },

        /**
         * Redirection logic based on user role after successful login
         * @param router - Vue Router instance
         * @param userRole - User's role from authentication response
         * @returns {Object|null} - Error object if role not authorized, null if success
         */
        redirectAfterLogin(router, userRole) {
            console.log(`🎯 [REDIRECT] Procesando redirección para rol: ${userRole}`);
            
            // Verificar si hay una ruta guardada de origen
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            
            // Definir rutas por defecto según rol
            const defaultRoutesByRole = {
                'ADMIN': '/tracker-mobility/admin/dashboard',
                'COMPANY_EMPLOYEE': '/tracker-mobility/applicant-company/management-request-form'
            };
            
            // ⚠️ Verificar que el rol está autorizado para hacer login
            if (!['ADMIN', 'COMPANY_EMPLOYEE'].includes(userRole)) {
                console.error(`❌ [REDIRECT] Rol no autorizado: ${userRole}`);
                
                // Limpiar datos de autenticación
                this.signedIn = false;
                this.userId = 0;
                this.username = '';
                this.role = '';
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                localStorage.removeItem('redirectAfterLogin');
                
                // Retornar error para que sea manejado en el componente
                return {
                    error: true,
                    type: 'unauthorized-role',
                    message: `Su rol no tiene permisos para acceder al sistema.`
                };
            }
            
            if (redirectPath) {
                console.log(`🔄 [REDIRECT] Ruta de origen encontrada: ${redirectPath}`);
                
                // Verificar si la ruta de origen es accesible para el rol actual
                if (this.isRouteAccessibleForRole(redirectPath, userRole)) {
                    console.log(`✅ [REDIRECT] Redirigiendo a ruta de origen: ${redirectPath}`);
                    localStorage.removeItem('redirectAfterLogin');
                    router.push(redirectPath);
                } else {
                    console.warn(`⚠️ [REDIRECT] Ruta de origen no accesible para rol ${userRole}, usando ruta por defecto`);
                    localStorage.removeItem('redirectAfterLogin');
                    router.push(defaultRoutesByRole[userRole]);
                }
            } else {
                // No hay ruta de origen, ir a ruta por defecto
                const defaultRoute = defaultRoutesByRole[userRole];
                console.log(`🏠 [REDIRECT] Redirigiendo a ruta por defecto: ${defaultRoute}`);
                router.push(defaultRoute);
            }
            
            // Retornar null indica éxito
            return null;
        },

        /**
         * Check if a route is accessible for a specific role
         * @param routePath - The route path to check
         * @param userRole - The user's role
         * @returns {boolean} - True if accessible, false otherwise
         */
        isRouteAccessibleForRole(routePath, userRole) {
            // Rutas de ADMIN (requieren rol ADMIN)
            if (routePath.startsWith('/tracker-mobility/admin/')) {
                return userRole === 'ADMIN';
            }
            
            // Rutas de solicitud de servicio (requieren rol COMPANY_EMPLOYEE)
            if (routePath.startsWith('/tracker-mobility/service-request/')) {
                return userRole === 'COMPANY_EMPLOYEE';
            }
            
            // Rutas públicas
            if (routePath.startsWith('/tracker-mobility/sign-in')) {
                return true;
            }
            
            // Por defecto, denegar acceso
            return false;
        }
    }
})