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
    state: () => ({ 
        signedIn: false, 
        userId: 0, 
        username: '', 
        roles: [],
        specificRole: '' // Mover desde localStorage al state para reactividad
    }),
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
         * Current roles
         * @returns {string[]} - The current roles array
         */
        currentRoles: (state) => state['roles'],
        
        /**
         * Current role (primary role - first in array)
         * @returns {string} - The primary role
         * @deprecated Use currentRoles instead for multi-role support
         */
        currentRole: (state) => state['roles'][0] || '',

        /**
         * Specific role (GERENTE_VENTAS, VENDEDOR, etc.)
         * For COMPANY_EMPLOYEE users, returns their specific role
         * @returns {string} - The specific role from state (now reactive)
         */
        currentSpecificRole: (state) => state['specificRole'] || state['roles'][0] || '',

        /**
         * Current token
         * @returns {string} - The current token
         */
        currentToken: () => localStorage.getItem('token'),
        
        /**
         * Check if user has a specific role
         * @param state - The state of the store
         * @returns {function(string): boolean} - Function to check if user has role
         */
        hasRole: (state) => (role) => state['roles'].includes(role),
        
        /**
         * Check if user has any of the specified roles
         * @param state - The state of the store
         * @returns {function(string[]): boolean} - Function to check if user has any role
         */
        hasAnyRole: (state) => (roles) => roles.some(role => state['roles'].includes(role)),

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
                // 🧹 LIMPIAR datos residuales ANTES de iniciar nueva sesión
                console.log('🧹 [LOGIN] Limpiando datos residuales antes de nueva sesión...');
                
                // Resetear estado actual completamente
                this.signedIn = false;
                this.userId = 0;
                this.username = '';
                this.roles = [];
                this.specificRole = '';
                
                // Limpiar localStorage de sesión anterior
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                localStorage.removeItem('roles');
                localStorage.removeItem('role');
                localStorage.removeItem('redirectAfterLogin');
                
                // Resetear todos los stores de Pinia ANTES del login
                try {
                    const pinia = this.$pinia;
                    if (pinia && pinia._s) {
                        pinia._s.forEach((store, name) => {
                            if (name !== 'authentication' && typeof store.$reset === 'function') {
                                store.$reset();
                            }
                        });
                    }
                } catch (error) {
                    console.warn('⚠️ [LOGIN] Error al resetear stores:', error);
                }
                
                console.log('✅ [LOGIN] Datos residuales limpiados');
                
                // Proceder con el login
                const response = await authenticationService.signIn(signInRequest);

                const signInResponse = new SignInResponse(
                    response.data.userId,
                    response.data.username,
                    response.data.token,
                    response.data.roles // Array de roles
                );

                this.signedIn = true;
                this.userId = signInResponse.userId;
                this.username = signInResponse.username;
                this.roles = signInResponse.roles;
                
                // Guardar el rol específico (GERENTE_VENTAS, VENDEDOR, etc.)
                // Buscar el rol específico que no sea COMPANY_EMPLOYEE
                const specificRole = signInResponse.roles.find(role => role !== 'COMPANY_EMPLOYEE') || signInResponse.roles[0];
                this.specificRole = specificRole;

                localStorage.setItem('token', signInResponse.token);
                localStorage.setItem('userId', signInResponse.userId);
                localStorage.setItem('username', signInResponse.username);
                localStorage.setItem('roles', JSON.stringify(signInResponse.roles)); // Guardar como JSON
                localStorage.setItem('role', specificRole);

                console.log("✔ Login completo:", signInResponse);

                // Redirección inteligente basada en roles
                const redirectResult = this.redirectAfterLogin(router, signInResponse.roles);
                
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
         * Additionally, it resets ALL Pinia stores to prevent data leakage between sessions.
         * @param router - The router
         */
        async signOut(router) {
            console.log('🔓 [LOGOUT] Cerrando sesión y limpiando todos los datos...');
            
            // Limpiar estado del store de autenticación
            this.signedIn = false;
            this.userId = 0;
            this.username = '';
            this.roles = [];
            this.specificRole = '';
            
            // Limpiar localStorage completamente
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('roles');
            localStorage.removeItem('role');
            localStorage.removeItem('redirectAfterLogin');
            
            // 🔥 CRÍTICO: Resetear TODOS los stores de Pinia para evitar datos residuales
            // Esto previene que datos del usuario anterior persistan en la nueva sesión
            try {
                const pinia = this.$pinia;
                if (pinia && pinia._s) {
                    console.log('🔄 [LOGOUT] Reseteando todos los stores de Pinia...');
                    pinia._s.forEach((store, name) => {
                        // No resetear el store de autenticación (ya lo hicimos manualmente)
                        if (name !== 'authentication' && typeof store.$reset === 'function') {
                            console.log(`  ↳ Reseteando store: ${name}`);
                            store.$reset();
                        }
                    });
                    console.log('✅ [LOGOUT] Todos los stores reseteados');
                }
            } catch (error) {
                console.error('❌ [LOGOUT] Error al resetear stores:', error);
            }
            
            console.log('✅ [LOGOUT] Sesión cerrada completamente');
            router.push({name: 'sign-in'});
        },

        initialize() {
            console.log('[INIT] Restaurando sesión desde localStorage');
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username');
            const rolesStr = localStorage.getItem('roles');
            const specificRole = localStorage.getItem('role');

            if (token && userId && username) {
                this.signedIn = true;
                this.userId = parseInt(userId);
                this.username = username;
                this.specificRole = specificRole || '';
                
                // Parsear roles desde JSON
                try {
                    this.roles = rolesStr ? JSON.parse(rolesStr) : [];
                } catch (error) {
                    console.error('[INIT] Error parseando roles:', error);
                    this.roles = [];
                }
                
                console.log('[INIT] Sesión restaurada:', this.username, 'Roles:', this.roles, 'Rol específico:', this.specificRole);
            } else {
                console.warn('[INIT] No hay datos válidos en localStorage');
            }
        },

        /**
         * Redirection logic based on user roles after successful login
         * @param router - Vue Router instance
         * @param userRoles - User's roles array from authentication response
         * @returns {Object|null} - Error object if role not authorized, null if success
         */
        redirectAfterLogin(router, userRoles) {
            console.log(`🎯 [REDIRECT] Procesando redirección para roles: ${userRoles.join(', ')}`);
            
            // Verificar si hay una ruta guardada de origen
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            
            // Definir rutas por defecto según rol (prioridad: primer rol en el array)
            const defaultRoutesByRole = {
                'ADMIN': '/app/admin/verification-orders',
                'MASTER_ADMIN': '/app/admin/verification-orders',
                'COMPANY_EMPLOYEE': '/app/applicant-company/order-requests',
                'GERENTE_VENTAS': '/app/sales-manager/sales-team',
                'VENDEDOR': '/app/applicant-company/order-requests'
            };
            
            const authorizedRoles = ['ADMIN', 'MASTER_ADMIN', 'COMPANY_EMPLOYEE', 'GERENTE_VENTAS', 'VENDEDOR'];
            
            // ⚠️ Verificar que al menos un rol está autorizado para hacer login
            const hasAuthorizedRole = userRoles.some(role => authorizedRoles.includes(role));
            
            if (!hasAuthorizedRole) {
                console.error(`❌ [REDIRECT] Ningún rol autorizado encontrado: ${userRoles.join(', ')}`);
                
                // Limpiar datos de autenticación
                this.signedIn = false;
                this.userId = 0;
                this.username = '';
                this.roles = [];
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                localStorage.removeItem('roles');
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
                
                // Verificar si la ruta de origen es accesible para los roles actuales
                if (this.isRouteAccessibleForRoles(redirectPath, userRoles)) {
                    console.log(`✅ [REDIRECT] Redirigiendo a ruta de origen: ${redirectPath}`);
                    localStorage.removeItem('redirectAfterLogin');
                    router.push(redirectPath);
                } else {
                    console.warn(`⚠️ [REDIRECT] Ruta de origen no accesible para roles ${userRoles.join(', ')}, usando ruta por defecto`);
                    localStorage.removeItem('redirectAfterLogin');
                    
                    // Usar el primer rol autorizado para determinar la ruta por defecto
                    const primaryRole = userRoles.find(role => authorizedRoles.includes(role));
                    router.push(defaultRoutesByRole[primaryRole]);
                }
            } else {
                // No hay ruta de origen, ir a ruta por defecto
                // Para COMPANY_EMPLOYEE, usar el rol específico (GERENTE_VENTAS o VENDEDOR)
                let targetRole;
                if (userRoles.includes('COMPANY_EMPLOYEE')) {
                    // Buscar el rol específico
                    const specificRole = userRoles.find(role => role !== 'COMPANY_EMPLOYEE');
                    targetRole = specificRole || 'COMPANY_EMPLOYEE';
                } else {
                    // Para otros roles, usar el primer rol autorizado
                    targetRole = userRoles.find(role => authorizedRoles.includes(role));
                }
                
                const defaultRoute = defaultRoutesByRole[targetRole];
                console.log(`🏠 [REDIRECT] Redirigiendo a ruta por defecto para rol ${targetRole}: ${defaultRoute}`);
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
         * @deprecated Use isRouteAccessibleForRoles for multi-role support
         */
        isRouteAccessibleForRole(routePath, userRole) {
            return this.isRouteAccessibleForRoles(routePath, [userRole]);
        },
        
        /**
         * Check if a route is accessible for user's roles
         * @param routePath - The route path to check
         * @param userRoles - The user's roles array
         * @returns {boolean} - True if accessible, false otherwise
         */
        isRouteAccessibleForRoles(routePath, userRoles) {
            // Rutas de ADMIN (requieren rol ADMIN o MASTER_ADMIN)
            if (routePath.startsWith('/app/admin/')) {
                // COMPANY_EMPLOYEE puede ver órdenes (solo lectura)
                const allowedForCompanyEmployee = [
                    '/app/admin/verification-orders',
                    '/app/admin/verification-orders/'
                ];
                
                // Verificar si tiene rol de COMPANY_EMPLOYEE y la ruta está permitida
                const hasCompanyEmployeeAccess = userRoles.includes('COMPANY_EMPLOYEE') && 
                    allowedForCompanyEmployee.some(route => routePath.startsWith(route));
                
                // Verificar si tiene rol de ADMIN o MASTER_ADMIN
                const hasAdminAccess = userRoles.includes('ADMIN') || userRoles.includes('MASTER_ADMIN');
                
                return hasCompanyEmployeeAccess || hasAdminAccess;
            }
            
            // Rutas de solicitud de servicio (requieren rol COMPANY_EMPLOYEE o admin)
            if (routePath.startsWith('/app/applicant-company/')) {
                return userRoles.includes('COMPANY_EMPLOYEE') || 
                       userRoles.includes('VENDEDOR') ||
                       userRoles.includes('ADMIN') || 
                       userRoles.includes('MASTER_ADMIN');
            }
            
            // Rutas de sales-manager (requieren rol GERENTE_VENTAS)
            if (routePath.startsWith('/app/sales-manager/')) {
                return userRoles.includes('GERENTE_VENTAS');
            }
            
            // Rutas públicas
            if (routePath.startsWith('/sign-in')) {
                return true;
            }
            
            // Por defecto, denegar acceso
            return false;
        }
    }
})