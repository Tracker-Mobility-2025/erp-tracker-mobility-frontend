<script>
import {useRouter} from "vue-router";
import {useAuthenticationStore} from "../services/authentication.store.js";

export default {
  name: "authentication-section",
  data() {
    return {
      router: useRouter(),
      authenticationStore: useAuthenticationStore()
    };
  },
  computed: {
    isSignedIn() {
      return this.authenticationStore.isSignedIn;
    },
    currentUsername() {
      return this.authenticationStore.currentUsername;
    }
  },
  methods: {
    onSignIn() {
      this.router.push({name: "sign-in"});
    },
    onSignOut() {
      this.authenticationStore.signOut(this.router);
    }
  }
}
</script>

<template>
  <div class="flex align-items-center gap-3">
    <div v-if="isSignedIn" class="flex align-items-center gap-3">
      <span class="text-sm text-dark font-medium">Bienvenido, {{ currentUsername }}</span>
      <pv-button 
        text 
        severity="secondary"
        icon="pi pi-sign-out" 
        label="Cerrar Sesión"
        @click="onSignOut" />
    </div>
    <div v-else>
      <pv-button 
        text 
        severity="primary"
        class="btn-primary-dark"
        icon="pi pi-sign-in" 
        label="Iniciar Sesión"
        @click="onSignIn" />
    </div>
  </div>
</template>

<style scoped>
/* Estilos corporativos aplicados mediante clases de base-styles.css y PrimeFlex */
</style>