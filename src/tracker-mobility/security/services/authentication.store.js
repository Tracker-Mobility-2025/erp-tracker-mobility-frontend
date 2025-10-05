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

                // Redirigir al dashboard directamente tras login exitoso
                router.push(`/tracker-mobility/admin/service-orders`);
                console.log("Redirigiendo al DashBoard");
                
                return signInResponse;
            } catch (error) {
                this.signedIn = false;
                console.error("❌ Error durante el login:", error);
                
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
        }
    }
})