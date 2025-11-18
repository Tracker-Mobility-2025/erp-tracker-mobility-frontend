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
            const authorizedRoles = ['ADMIN', 'COMPANY_EMPLOYEE'];
            if (!authorizedRoles.includes(store.currentRole)) {
                console.error(`[GUARD] Rol no autorizado detectado: ${store.currentRole}`);
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
            const userRole = store.currentRole;
            console.log('[GUARD] Verificando roles para usuario:', userRole);
            
            // Verificar todas las rutas coincidentes (incluyendo rutas padre)
            for (let matchedRoute of to.matched) {
                if (matchedRoute.meta?.roles && matchedRoute.meta.roles.length > 0) {
                    console.log('[GUARD] Ruta requiere roles:', matchedRoute.meta.roles);
                    if (!matchedRoute.meta.roles.includes(userRole)) {
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
        // Si el usuario es COMPANY_EMPLOYEE y está tratando de acceder a rutas restringidas de ADMIN
        if (store.currentRole === 'COMPANY_EMPLOYEE') {
            // Rutas de admin permitidas para COMPANY_EMPLOYEE
            const allowedAdminRoutes = ['/admin/service-orders', '/admin/order-details'];

            // Si intenta acceder a rutas de admin no permitidas, redirigir
            if (to.path.startsWith('/admin') && !allowedAdminRoutes.some(route => to.path.startsWith(route))) {
                console.log('[GUARD] COMPANY_EMPLOYEE intentó acceder a ruta admin restringida, redirigiendo');
                return next({ name: 'service-orders' });
            }
        }

        // Si el usuario es ADMIN y está tratando de acceder a rutas de COMPANY_EMPLOYEE, permitir
        // (Eliminamos la restricción anterior que impedía a ADMIN acceder a estas rutas)

        console.log('[GUARD] Acceso permitido');
        next();
    } catch (error) {
        console.error('[GUARD] Error accessing authentication store:', error);
        // If there's an error with the store, redirect to login as fallback
        return next({ name: 'sign-in' });
    }
};