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

        next();
    } catch (error) {
        console.error('[GUARD] Error accessing authentication store:', error);
        // If there's an error with the store, redirect to login as fallback
        return next({ name: 'sign-in' });
    }
};