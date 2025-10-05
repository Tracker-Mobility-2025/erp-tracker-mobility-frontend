import {AuthenticationService} from "./authentication.service.js";
import {defineStore} from "pinia";
import {SignInResponse} from "../models/sign-in.response.js";

const authenticationService = new AuthenticationService();
/**
 * Authentication Store
 * @summary
 * Represents the authentication store
 */
export const useAuthenticationStore = defineStore({

    id: 'authentication',

    state: () => ({ signedIn: false, id: 0, username: '', role: '' }),

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
         * @returns {number} - The current user id
         */
        currentUserId: (state) => state['id'],
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
         */
        async signIn(signInRequest, router) {

            authenticationService.signIn(signInRequest)
                .then(response => {
                    let signInResponse = new SignInResponse(
                        response.data.id,
                        response.data.username, 
                        response.data.token, 
                        response.data.role
                    );

                    this.signedIn = true;
                    this.id = signInResponse.id;
                    this.username = signInResponse.username;
                    this.role = signInResponse.role;

                    localStorage.setItem('token', signInResponse.token);
                    localStorage.setItem('userId', signInResponse.id);
                    localStorage.setItem('username', signInResponse.username);
                    localStorage.setItem('role', signInResponse.role);

                    console.log("✔ Login completo:", signInResponse);

                    // Redirigir al dashboard directamente tras login exitoso
                    router.push(`/tracker-mobility/${signInResponse.id}/dashboard`);
                    console.log("Redirigiendo al DashBoard");
                })
                .catch(error => {
                    this.signedIn = false;

                    console.log(error);
                    router.push({name: 'sign-in'});
                });
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
            this.id = 0;
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
                this.id = parseInt(userId);
                this.username = username;
                this.role = role || '';
                console.log('[INIT] Sesión restaurada:', this.username);
            } else {
                console.warn('[INIT] No hay datos válidos en localStorage');
            }
        }



    }
})