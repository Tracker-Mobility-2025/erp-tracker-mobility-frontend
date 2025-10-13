<script>

import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignInRequest} from "../models/sign-in.request.js";

export default {
  name: 'sign-in',
  data() {
    return {
      username: '',
      password: '',
      rememberSession: false,
      isAuthenticated: false,
      isLoading: false,

      // Toast messages constants
      toastMessages: {
        requiredFields: {
          severity: 'warn',
          summary: 'Campos requeridos',
          detail: 'Por favor, complete todos los campos.'
        },
        loginSuccess: {
          severity: 'success',
          summary: 'Inicio de sesión exitoso',
          detail: (username) => `Bienvenido de nuevo, ${username}!`
        },
        loginError: {
          severity: 'error',
          summary: 'Error de inicio de sesión',
          detail: 'Credenciales incorrectas. Por favor, verifique su usuario y contraseña.',
          life: 5000
        },
        forgotPassword: {
          severity: 'info',
          summary: 'Recuperación de contraseña',
          detail: 'Funcionalidad en desarrollo.'
        }
      }
    };
  },

  methods: {
    /**
     * Generic toast method
     * @param {string} severity - Toast type: 'success', 'error', 'warn', 'info'
     * @param {string} summary - Toast title
     * @param {string} detail - Toast message
     * @param {number} life - Duration in milliseconds (default: 3000)
     */
    showToast(severity, summary, detail, life = 3000) {
      this.$toast.add({
        severity,
        summary,
        detail,
        life
      });
    },

    /**
     * Show toast using predefined message object
     * @param {Object} messageObj - Message object with severity, summary, detail, life
     * @param {*} dynamicData - Data to pass to detail function if it's a function
     */
    showToastFromMessage(messageObj, dynamicData = null) {
      const detail = typeof messageObj.detail === 'function' 
        ? messageObj.detail(dynamicData) 
        : messageObj.detail;
      
      this.showToast(
        messageObj.severity,
        messageObj.summary,
        detail,
        messageObj.life
      );
    },

    async onSignIn() {
      try {
        console.log('🔐 [LOGIN] Iniciando proceso de login...');
        
        // Validación básica
        if (!this.username || !this.password) {
          console.warn('⚠️ [LOGIN] Campos requeridos faltantes');
          this.showToastFromMessage(this.toastMessages.requiredFields);
          return;
        }

        // Activar estado de carga
        this.isLoading = true;
        console.log('⏳ [LOGIN] Estado de carga activado');

        const signInRequest = new SignInRequest(this.username, this.password);
        console.log('📝 [LOGIN] Request creado:', { username: this.username });

        console.log('🏪 [LOGIN] Ejecutando signIn...');
        const authStore = useAuthenticationStore();
        await authStore.signIn(signInRequest, this.$router);
        
        console.log('✅ [LOGIN] Login exitoso');
        // Mostrar toast de éxito
        this.showToastFromMessage(this.toastMessages.loginSuccess, this.username);
        
      } catch (error) {
        console.error('Error durante el login:', error);
        
        // ⚠️ Verificar si es un error de rol no autorizado
        if (error.message && error.message.includes('rol') && error.message.includes('no tiene permisos')) {
          this.showToast(
            'error',
            'Rol No Autorizado',
            error.message,
            7000 // Mensaje más largo, más tiempo de visualización
          );
        } else {
          // Error genérico de login (credenciales incorrectas, etc.)
          this.showToastFromMessage(this.toastMessages.loginError);
        }
      } finally {
        // Desactivar estado de carga
        this.isLoading = false;
      }
    },



    onForgotPassword() {
      // Lógica para manejar el olvido de la contraseña
      this.showToastFromMessage(this.toastMessages.forgotPassword);
    }

  },

  mounted() {
    // 🔒 Mostrar mensaje si viene de acceso denegado
    if (this.$route.query.error === 'access-denied') {
      this.showToast(
        'warn',
        'Acceso Denegado',
        this.$route.query.message || 'No tienes permisos para acceder a esa sección',
        5000
      );
      
      // Limpiar query parameters para no mostrar el mensaje repetidamente
      this.$router.replace({ name: 'sign-in' });
    }
    
    // ⚠️ Mostrar mensaje si el rol no está autorizado
    if (this.$route.query.error === 'unauthorized-role') {
      this.showToast(
        'error',
        'Rol No Autorizado',
        this.$route.query.message || 'Su rol no tiene permisos para acceder al sistema',
        6000
      );
      
      // Limpiar query parameters
      this.$router.replace({ name: 'sign-in' });
    }
  }
}

</script>

<template>

  <div class="flex h-screen w-screen flex-1 flex-column align-items-center justify-content-center ">

    <div class="flex flex-column w-30rem shadow-6 p-6 border-round-lg bg-white">

      <!--  Formulario de inicio de sesión -->
      <div class="form-sign-in">

        <h1 class="font-bold text-center">Tracker Mobility</h1>

        <h3 class="flex justify-content-center font-bold ">Acceso al sistema</h3>
        <p class="text-center  mb-3">Optimice la verificación domiciliaria con nuestra solución
          integrada</p>


        <form @submit.prevent="onSignIn" class="content-form">
          <div class="p-fluid">

            <!-- Campo de entrada para el nombre de usuario -->
            <div class="field mb-4">
              <label for="username" class="">Nombre de usuario</label>
              <pv-icon-field>
                <pv-input-icon class="pi pi-user"></pv-input-icon>
                <pv-input-text
                    id="username"
                    v-model="username"
                    :class="['w-full', 'input-color-custom', {'p-invalid': !username}]"
                    autocomplete="username"
                    placeholder="Ingrese su nombre de usuario"
                    :disabled="isLoading"
                />
              </pv-icon-field>
            </div>

            <!-- Campo de entrada para la contraseña -->
            <div class="field mb-4">

              <label for="password" class="">Contraseña</label>
              <pv-icon-field>
                <pv-input-icon class="pi pi-lock"></pv-input-icon>
                <pv-password
                    id="password"
                    v-model="password"
                    :class="{'p-invalid': !password}"
                    class="w-full"
                    input-class="w-full"
                    autocomplete="current-password"
                    :feedback="false"
                    toggle-mask
                    placeholder="Ingrese su contraseña"
                    :disabled="isLoading"
                />
              </pv-icon-field>
            </div>

            <!-- Opción de "Recordar sesión y ¿Necesita ayuda?" -->
            <div class="flex justify-content-between mb-4 text-sm">
              <!-- Checkbox + label alineados -->
              <label for="rememberSession" class="flex items-center cursor-pointer align-items-center justify-content-center ">
                <pv-checkbox
                    inputId="rememberSession"
                    v-model="rememberSession"
                    binary
                    class="mr-2"
                />
                <span class="text-black">Recordar sesión</span>
              </label>

              <!-- Enlace estilo texto -->
              <span class="text-blue-600 hover:underline font-bold cursor-pointer" @click="onForgotPassword">
                ¿Olvidó su contraseña?
              </span>
            </div>


            <!-- Botón de inicio de sesión -->
            <div class="flex flex-column p-field" >
              <div class="justify-center">

                <pv-button type="submit"
                           class="w-full text-black font-bold border border-red-900 p-button-primary"
                           :loading="isLoading"
                           :disabled="isLoading" >
                  <span v-if="!isLoading">Iniciar sesión</span>
                  <span v-else>Iniciando sesión...</span>
                </pv-button>
              </div>
            </div>


            <!-- Mensaje de Acceso seguro y encriptado -->
            <div class="text-center text-sm text-gray-500 mt-4 border-top">
              <i class="pi pi-lock" style="font-size: 1rem;"></i>
              Acceso seguro y encriptado
            </div>

          </div>
        </form>
      </div>

    </div>

  </div>



</template>

<style>


</style>