<script>

export default {
  name: 'sign-in',
  data() {
    return {
      username: '',
      password: '',
      rememberSession: false,
      isAuthenticated: false

    };
  },

  methods: {
    onSignIn() {
      // Validación básica
      if (!this.username || !this.password) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Campos requeridos',
          detail: 'Por favor, complete todos los campos.',
          life: 3000
        });
        return;
      }

      /* Importaciones necesarias
      let authenticationStore = useAuthenticationStore();
      let signInRequest = new SignInRequest(this.username, this.password);

      authenticationStore.signIn(signInRequest, this.$router);

      if(!authenticationStore.signedIn) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error de inicio de sesión',
          detail: 'Por favor, verifique sus credenciales.',
          life: 3000
        });
      } else {
        this.$toast.add({
          severity: 'success',
          summary: 'Inicio de sesión exitoso',
          detail: 'Bienvenido de nuevo!',
          life: 3000
        });
      }

      console.log("Respuesta de Inicio de sesión: ",signInRequest);
      */

      /* enrutar a order*/
      this.$router.push({ name: 'service-orders' });

    },

    onForgotPassword() {
      // Lógica para manejar el olvido de la contraseña
      this.$toast.add({
        severity: 'info',
        summary: 'Recuperación de contraseña',
        detail: 'Funcionalidad en desarrollo.',
        life: 3000
      });
    }

  }
}

</script>

<template>

  <div class="flex h-screen w-screen flex-1 flex-column align-items-center justify-content-center">

    <div class="flex flex-column w-30rem shadow-3 p-5 border-round-lg bg-white ">

      <!--  Formulario de inicio de sesión -->
      <div class="form-sign-in">

        <h1 class="font-bold text-center">Tracker Mobility</h1>

        <h3 class="flex justify-content-center font-bold ">Acceso al sistema</h3>
        <p class="text-center mb-3">Optimice la verificación domiciliaria con nuestra solución
          integrada</p>


        <form @submit.prevent="onSignIn" class="content-form">
          <div class="p-fluid">

            <!-- Campo de entrada para el correo electrónico -->
            <div class="field mb-4">
              <label for="username" class="">Correo electrónico</label>
              <pv-icon-field>
                <pv-input-icon class="pi pi-user"></pv-input-icon>
                <pv-input-text
                    id="username"
                    v-model="username"
                    :class="{'p-invalid': !username}"
                    class="w-full"
                    autocomplete="email"
                    placeholder="Ingrese su correo electrónico"
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
                           class="w-full text-black font-bold border border-red-900" >
                  Iniciar sesión</pv-button>
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

<style scoped>

</style>