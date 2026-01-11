// http-common.js
import axios from "axios";
import {authenticationInterceptor, authenticationResponseInterceptor, authenticationErrorInterceptor} from "../../tracker-mobility/security/services/authentication.interceptor.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({ baseURL: API_BASE_URL });

// ========== REQUEST INTERCEPTOR ==========
// Agrega token JWT y configura headers
http.interceptors.request.use(config => {
    // Si vamos a enviar FormData, NO configurar Content-Type (axios lo hace automáticamente con boundary)
    if (config.data instanceof FormData) {
        // Remover cualquier Content-Type previo para que el navegador lo configure correctamente
        delete config.headers["Content-Type"];
        if (config.headers.common) {
            delete config.headers.common["Content-Type"];
        }
        if (config.headers.post) {
            delete config.headers.post["Content-Type"];
        }
    } else {
        config.headers["Content-Type"] = "application/json";
    }
    return authenticationInterceptor(config);
});

// ========== RESPONSE INTERCEPTOR ==========
// Maneja respuestas exitosas y errores de autenticación (token expirado)
http.interceptors.response.use(
    authenticationResponseInterceptor,
    authenticationErrorInterceptor
);

export default http;
