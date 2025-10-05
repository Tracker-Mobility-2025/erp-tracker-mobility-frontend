import {useAuthenticationStore} from "./authentication.store.js";

/**
 * Authentication guard
 * @param to The route we are navigating to
 * @param from The route we are navigating from
 * @param next The callback function to continue the
 * @returns {*}
 */
export const authenticationGuard = (to, from, next) => {

    const store = useAuthenticationStore();

    console.log('[GUARD] Navegando a:', to.fullPath);

    if (!store.isSignedIn && localStorage.getItem('token')) {
        console.log('[GUARD] Restaurando sesión desde localStorage...');
        store.initialize();
    }

    /**
     * Check if the route is public
     * Public routes are those that do not require authentication
     * In this case, the public routes are:
     * - /tracker-mobility/sign-in
     * All other routes are protected
     */
    const isPublic = to.path.startsWith('/tracker-mobility/sign-in');

    /** If the route is not public and the user is not signed in, redirect to sign-in
     * Otherwise, continue to the route
     */
    if (!isPublic && !store.isSignedIn) {
        console.warn('[GUARD] Acceso denegado. Redirigiendo a login');
        return next({ name: 'sign-in' });
    }

    next();
};