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
     * - /tracker-mobility/sign-in
     * All other routes are protected
     */
    const isPublic = to.path.startsWith('/tracker-mobility/sign-in');

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

        /** If the route is not public and the user is not signed in, redirect to sign-in
         * Otherwise, continue to the route
         */
        if (!store.isSignedIn) {
            console.warn('[GUARD] Acceso denegado. Redirigiendo a login');
            return next({ name: 'sign-in' });
        }

        // ⭐ VERIFICACIÓN DE ROLES - NUEVA FUNCIONALIDAD
        if (to.meta && to.meta.roles && to.meta.roles.length > 0) {
            const userRole = store.currentRole;
            console.log('[GUARD] Verificando roles. Usuario:', userRole, 'Requeridos:', to.meta.roles);
            
            if (!to.meta.roles.includes(userRole)) {
                console.warn('[GUARD] Acceso denegado por rol insuficiente');
                
                // Crear mensaje de error personalizado
                const errorMessage = `Necesitas ser ${to.meta.roles.join(' o ')} para acceder a esta sección`;
                
                // Redirigir al dashboard con mensaje de error
                return next({ 
                    name: 'dashboard', 
                    query: { 
                        error: 'access-denied',
                        message: errorMessage
                    }
                });
            }
        }

        console.log('[GUARD] Acceso permitido');
        next();
    } catch (error) {
        console.error('[GUARD] Error accessing authentication store:', error);
        // If there's an error with the store, redirect to login as fallback
        return next({ name: 'sign-in' });
    }
};