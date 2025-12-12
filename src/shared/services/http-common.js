// http-common.js
import axios from "axios";
import {authenticationInterceptor, authenticationResponseInterceptor, authenticationErrorInterceptor} from "../../tracker-mobility/security/services/authentication.interceptor.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({ baseURL: API_BASE_URL });

// ========== REQUEST INTERCEPTOR ==========
// Agrega token JWT y configura headers
http.interceptors.request.use(config => {
    // Si vamos a enviar FormData, borramos el Content-Type
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
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
