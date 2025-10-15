<script>

import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignInRequest} from "../models/sign-in.request.js";
import { NotificationMixin } from "../../../shared/utils/notification.utils.js";

export default {
  name: 'sign-in',
  
  // 🔧 Usar el mixin para notificaciones modulares
  mixins: [NotificationMixin],
  data() {
    return {
      username: '',
      password: '',
      rememberSession: false,
      isAuthenticated: false,
      isLoading: false
    };
  },

  methods: {
    async onSignIn() {
      try {
        console.log('🔐 [LOGIN] Iniciando proceso de login...');
        
        // Validación básica usando el mixin modular
        if (!this.username || !this.password) {
          console.warn('⚠️ [LOGIN] Campos requeridos faltantes');
          this.showToast({
            severity: 'warn',
            summary: 'Campos requeridos',
            detail: 'Por favor, complete todos los campos.',
            life: 4000
          });
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
        
        // Mostrar toast de éxito usando el mixin modular
        this.showToast({
          severity: 'success',
          summary: 'Inicio de sesión exitoso',
          detail: `¡Bienvenido de nuevo, ${this.username}!`,
          life: 3000
        });
        
      } catch (error) {
        console.error('Error durante el login:', error);
        
        // ⚠️ Verificar si es un error de rol no autorizado
        if (error.message && error.message.includes('rol') && error.message.includes('no tiene permisos')) {
          this.showToast({
            severity: 'error',
            summary: 'Rol No Autorizado',
            detail: error.message,
            life: 7000
          });
        } else {
          // Error genérico de login usando el mixin modular
          this.showToast({
            severity: 'error',
            summary: 'Error de inicio de sesión',
            detail: 'Credenciales incorrectas. Por favor, verifique su usuario y contraseña.',
            life: 5000
          });
        }
      } finally {
        // Desactivar estado de carga
        this.isLoading = false;
      }
    },

    onForgotPassword() {
      // Mostrar toast informativo usando el mixin modular
      this.showToast({
        severity: 'info',
        summary: 'Recuperación de contraseña',
        detail: 'Funcionalidad en desarrollo.',
        life: 3000
      });
    }

  },

  mounted() {
    // 🔒 Mostrar mensaje si viene de acceso denegado
    if (this.$route.query.error === 'access-denied') {
      this.showToast({
        severity: 'warn',
        summary: 'Acceso Denegado',
        detail: this.$route.query.message || 'No tienes permisos para acceder a esa sección',
        life: 5000
      });
      
      // Limpiar query parameters para no mostrar el mensaje repetidamente
      this.$router.replace({ name: 'sign-in' });
    }
    
    // ⚠️ Mostrar mensaje si el rol no está autorizado
    if (this.$route.query.error === 'unauthorized-role') {
      this.showToast({
        severity: 'error',
        summary: 'Rol No Autorizado',
        detail: this.$route.query.message || 'Su rol no tiene permisos para acceder al sistema',
        life: 6000
      });
      
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