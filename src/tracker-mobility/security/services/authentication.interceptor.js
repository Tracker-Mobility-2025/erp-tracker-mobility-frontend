import {useAuthenticationStore} from "./authentication.store.js";

/**
 * REQUEST INTERCEPTOR
 * Interceptor to add authentication token to the request header
 * @summary
 * This interceptor is used to add the authentication token to the request header.
 * @param config - Axios request configuration
 * @returns {*}
 */
export const authenticationInterceptor = (config) => {
    const authenticationStore = useAuthenticationStore();
    const isSignedIn = authenticationStore.isSignedIn;
    if (isSignedIn) {
        config.headers.Authorization = `Bearer ${authenticationStore.currentToken}`;
        console.log('[INTERCEPTOR REQUEST]', config);
    }
    return config;
}

/**
 * RESPONSE INTERCEPTOR (Success)
 * Pasa las respuestas exitosas sin modificación
 * @param response - Axios response
 * @returns {*}
 */
export const authenticationResponseInterceptor = (response) => {
    return response;
}

/**
 * RESPONSE INTERCEPTOR (Error)
 * Maneja errores de autenticación (401/403) cerrando sesión automáticamente
 * @param error - Axios error
 * @returns {Promise<never>}
 */
export const authenticationErrorInterceptor = (error) => {
    console.error('[INTERCEPTOR ERROR]', error);

    // Verificar si es un error de respuesta del servidor
    if (error.response) {
        const status = error.response.status;
        const authenticationStore = useAuthenticationStore();

        // ⚠️ MANEJO DE TOKEN EXPIRADO O INVÁLIDO (401/403)
        if (status === 401 || status === 403) {
            console.warn('🔒 [INTERCEPTOR] Token expirado o inválido - Cerrando sesión automáticamente');
            
            // Solo cerrar sesión si el usuario estaba autenticado
            if (authenticationStore.isSignedIn) {
                // Limpiar estado y localStorage
                authenticationStore.signedIn = false;
                authenticationStore.userId = 0;
                authenticationStore.username = '';
                authenticationStore.roles = [];
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                localStorage.removeItem('roles');
                localStorage.removeItem('redirectAfterLogin');

                // Obtener router dinámicamente para evitar dependencia circular
                // Usar window.location para redirección si router no está disponible
                const currentPath = window.location.pathname;
                if (currentPath !== '/sign-in') {
                    // Construir URL con query params
                    const signInUrl = `/sign-in?error=session-expired&message=${encodeURIComponent('Su sesión ha expirado. Por favor, inicie sesión nuevamente.')}`;
                    window.location.href = signInUrl;
                }
            }
        }

        // MANEJO DE ERRORES DE SERVIDOR (500, 502, 503, 504)
        if (status >= 500) {
            console.error('[INTERCEPTOR] Error del servidor:', status);
        }
    } else if (error.request) {
        // Error de red - no hubo respuesta del servidor
        console.error(' [INTERCEPTOR] Error de red - Sin respuesta del servidor');
    } else {
        // Error en la configuración de la petición
        console.error(' [INTERCEPTOR] Error en configuración de petición:', error.message);
    }

    // Propagar el error para que pueda ser manejado en catch()
    return Promise.reject(error);
}