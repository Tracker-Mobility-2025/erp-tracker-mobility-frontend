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
    // Mostrar mensaje si viene de acceso denegado
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
    
    // Mostrar mensaje si el rol no está autorizado
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

    // Mostrar mensaje si la sesión expiró (token JWT expirado)
    if (this.$route.query.error === 'session-expired') {
      this.showToast({
        severity: 'warn',
        summary: 'Sesión Expirada',
        detail: this.$route.query.message || 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
        life: 6000
      });
      
      // Limpiar query parameters
      this.$router.replace({ name: 'sign-in' });
    }
  }
}

</script>

<template>

  <div class="flex h-screen w-screen flex-column align-items-center justify-content-center" 
       style="background: var(--color-background);">

    <div class="card flex flex-column w-30rem shadow-6 p-6 border-round-lg">

      <h1 class="font-bold text-center text-primary-dark mb-4">Tracker Mobility</h1>

      <h3 class="text-center font-semibold text-primary-dark mb-2">Acceso al sistema</h3>
      <p class="text-center text-muted mb-4">Optimice la verificación domiciliaria con nuestra solución
        integrada</p>


      <form @submit.prevent="onSignIn">
        <div class="p-fluid">

          <!-- Campo de entrada para el nombre de usuario -->
          <div class="input-group">
            <label for="username" class="form-label form-label-required">Nombre de usuario</label>
            <pv-icon-field>
              <pv-input-icon class="pi pi-user" />
              <pv-input-text
                  id="username"
                  v-model="username"
                  class="w-full"
                  autocomplete="username"
                  placeholder="Ingrese su nombre de usuario"
                  :disabled="isLoading"
              />
            </pv-icon-field>
          </div>

          <!-- Campo de entrada para la contraseña -->
          <div class="input-group">
            <label for="password" class="form-label form-label-required">Contraseña</label>
            <pv-icon-field>
              <pv-input-icon class="pi pi-lock" />
              <pv-password
                  id="password"
                  v-model="password"
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
          <div class="flex justify-content-between align-items-center mb-4">
            <label for="rememberSession" class="flex align-items-center cursor-pointer">
              <pv-checkbox
                  inputId="rememberSession"
                  v-model="rememberSession"
                  binary
                  class="mr-2"
              />
              <span class="text-sm text-dark">Recordar sesión</span>
            </label>

            <span class="text-sm text-primary-local font-semibold cursor-pointer hover-primary" 
                  @click="onForgotPassword">
              ¿Olvidó su contraseña?
            </span>
          </div>


          <!-- Botón de inicio de sesión -->
          <div class="form-actions form-actions-center">
            <pv-button 
              type="submit"
              label="Iniciar sesión"
              class="w-full font-semibold btn-primary-dark"
              severity="primary"
              :loading="isLoading"
              :disabled="isLoading"
              icon="pi pi-sign-in"
              iconPos="left" />
          </div>


          <!-- Mensaje de Acceso seguro y encriptado -->
          <div class="text-center mt-4 pt-3" style="border-top: 1px solid var(--surface-100);">
            <span class="text-muted helper-text">
              <i class="pi pi-lock mr-1" style="font-size: 0.875rem;"></i>
              Acceso seguro y encriptado
            </span>
          </div>

        </div>
      </form>

    </div>

  </div>



</template>

<style>


</style>