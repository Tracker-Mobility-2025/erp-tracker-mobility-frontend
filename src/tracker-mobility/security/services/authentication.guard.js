import {useAuthenticationStore} from "./authentication.store.js";

/**
 * Authentication guard
 * @param to The route we are navigating to
 * @param from The route we are navigating from
 * @param next The callback function to continue the
 * @returns {*}
 */
export const authenticationGuard = (to, from, next) => {
    console.log('[GUARD] Navegando a:', to.fullPath);

    /**
     * Check if the route is public
     * Public routes are those that do not require authentication
     * In this case, the public routes are:
     * - /sign-in
     * All other routes are protected
     */
    const isPublic = to.path.startsWith('/sign-in');

    // If it's a public route, allow access immediately
    if (isPublic) {
        console.log('[GUARD] Ruta pública, permitiendo acceso');
        return next();
    }

    try {
        const store = useAuthenticationStore();
        
        // Try to restore session from localStorage if not signed in
        if (!store.isSignedIn && localStorage.getItem('token')) {
            console.log('[GUARD] Restaurando sesión desde localStorage...');
            store.initialize();
        }

        // Verificar que solo usuarios con roles autorizados puedan acceder al sistema
        if (store.isSignedIn) {
            const authorizedRoles = ['ADMIN', 'MASTER_ADMIN', 'COMPANY_EMPLOYEE'];
            const hasAuthorizedRole = store.currentRoles.some(role => authorizedRoles.includes(role));
            
            if (!hasAuthorizedRole) {
                console.error(`[GUARD] Ningún rol autorizado detectado: ${store.currentRoles.join(', ')}`);
                // Cerrar sesión y redirigir
                store.signOut({ push: () => {} }); // Mock router para signOut
                return next({ 
                    name: 'sign-in', 
                    query: { 
                        error: 'unauthorized-role',
                        message: 'Usted no tiene permisos para acceder al sistema'
                    }
                });
            }
        }

        /** If the route is not public and the user is not signed in, redirect to sign-in
         * Otherwise, continue to the route
         */
        if (!store.isSignedIn) {
            console.warn('[GUARD] Acceso denegado. Redirigiendo a login');
            // Guardar la ruta de origen para redirección posterior
            localStorage.setItem('redirectAfterLogin', to.fullPath);
            return next({ name: 'sign-in' });
        }

        // ⭐ VERIFICACIÓN DE ROLES - Incluyendo rutas padre
        const hasRequiredRole = () => {
            const userRoles = store.currentRoles;
            console.log('[GUARD] Verificando roles para usuario:', userRoles.join(', '));
            
            // Verificar todas las rutas coincidentes (incluyendo rutas padre)
            for (let matchedRoute of to.matched) {
                if (matchedRoute.meta?.roles && matchedRoute.meta.roles.length > 0) {
                    console.log('[GUARD] Ruta requiere roles:', matchedRoute.meta.roles);
                    
                    // Verificar si el usuario tiene al menos uno de los roles requeridos
                    const hasRole = matchedRoute.meta.roles.some(requiredRole => 
                        userRoles.includes(requiredRole)
                    );
                    
                    if (!hasRole) {
                        console.warn('[GUARD] Acceso denegado - Rol insuficiente');
                        return false;
                    }
                }
            }
            
            return true;
        };

        if (!hasRequiredRole()) {
            // Crear mensaje de error genérico
            const errorMessage = 'No tienes permisos suficientes para acceder a esta sección';
            
            // Redirigir al login con mensaje de error
            return next({ 
                name: 'sign-in', 
                query: { 
                    error: 'access-denied',
                    message: errorMessage
                }
            });
        }

        // ⭐ REDIRECCIÓN SEGÚN ROL DESPUÉS DEL LOGIN
        // Si el usuario es COMPANY_EMPLOYEE (y no tiene otros roles admin) y está tratando de acceder a rutas restringidas de ADMIN
        const hasOnlyCompanyEmployeeRole = store.currentRoles.includes('COMPANY_EMPLOYEE') && 
            !store.currentRoles.includes('ADMIN') && 
            !store.currentRoles.includes('MASTER_ADMIN');
            
        if (hasOnlyCompanyEmployeeRole) {
            // Si intenta acceder a rutas de admin, redirigir a sus solicitudes
            if (to.path.startsWith('/app/admin')) {
                console.log('[GUARD] COMPANY_EMPLOYEE intentó acceder a ruta admin restringida, redirigiendo');
                return next({ name: 'order-requests-list' });
            }
        }

        // Si el usuario es ADMIN o MASTER_ADMIN, tienen acceso completo a todas las rutas
        // (Ambos roles tienen permisos totales en el sistema)

        console.log('[GUARD] Acceso permitido');
        next();
    } catch (error) {
        console.error('[GUARD] Error accessing authentication store:', error);
        // If there's an error with the store, redirect to login as fallback
        return next({ name: 'sign-in' });
    }
};