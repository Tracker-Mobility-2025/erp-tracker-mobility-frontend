<script>
import { useAuthenticationStore } from '../../tracker-mobility/security/services/authentication.store.js';
import { NotificationMixin } from '../../shared/utils/notification.utils.js';

export default {
  name: "toolbar-tracker-mobility",
  
  // 🔧 Usar el mixin para notificaciones
  mixins: [NotificationMixin],

  data() {
    return {
      title: 'Tracker Mobility',
      isLoggingOut: false,
      userMenuVisible: false
    }
  },

  computed: {
    userMenuItems() {
      return [
        {
          label: this.isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión',
          icon: this.isLoggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out',
          command: () => this.confirmLogout(),
          disabled: this.isLoggingOut,
          severity: 'danger',
          outlined: true,
          class: 'dropdown-logout-btn p-2 px-3 border-2 border-red-500 text-red-500 bg-transparent border-round-lg transition-all-300 hover:bg-red-50 hover:border-red-400 hover:text-red-400 hover:shadow-2 disabled:opacity-70 disabled:cursor-not-allowed'
        }
      ];
    },

    currentUser() {
      const authStore = useAuthenticationStore();
      return {
        username: authStore.currentUsername,
        role: authStore.currentRole,
        isSignedIn: authStore.isSignedIn
      };
    }
  },

  methods: {
    // ============================================================================  
    // MÉTODOS DE MENÚ DE USUARIO
    // ============================================================================
    
    toggleUserMenu(event) {
      console.log('[USER MENU] Toggling menu via PrimeVue Menu component');
      
      // Debug: verificar servicios PrimeVue
      console.log('[USER MENU] Servicios disponibles:', {
        toast: !!this.$toast,
        confirm: !!this.$confirm
      });
      
      // Actualizar el estado visual de la flecha
      this.userMenuVisible = !this.userMenuVisible;
      
      // Usar el método toggle del componente Menu de PrimeVue
      this.$refs.userMenu.toggle(event);
      
      // Escuchar cuando el menú se oculte para actualizar el estado
      this.$nextTick(() => {
        if (this.$refs.userMenu.$el) {
          const overlay = document.querySelector('.p-menu-overlay');
          if (overlay) {
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                  const target = mutation.target;
                  if (target.style.display === 'none' || !target.style.display) {
                    this.userMenuVisible = false;
                    observer.disconnect();
                  }
                }
              });
            });
            observer.observe(overlay, { attributes: true });
          }
        }
      });
    },

    closeUserMenu() {
      console.log('[USER MENU] Cerrando menú de usuario');
      // Actualizar el estado visual
      this.userMenuVisible = false;
      // Usar el método hide del componente Menu de PrimeVue
      if (this.$refs.userMenu) {
        this.$refs.userMenu.hide();
      }
    },

    // ============================================================================
    // MÉTODOS DE CIERRE DE SESIÓN CON NOTIFICACIONES MODULARES
    // ============================================================================
    
    async logout() {
      try {
        console.log('[LOGOUT] Iniciando proceso de cierre de sesión...');
        
        // Activar estado de carga para el botón
        this.isLoggingOut = true;
        
        // Cerrar el menú desplegable
        this.closeUserMenu();
        
        // Validar y mostrar toast informativo usando el mixin
        if (this.$toast) {
          this.showToast({
            severity: 'info',
            summary: 'Cerrando sesión',
            detail: 'Hasta pronto. Redirigiendo al login...',
            life: 2000
          });
        } else {
          console.warn('[LOGOUT] Toast service no disponible');
        }

        // Obtener el store de autenticación
        const authStore = useAuthenticationStore();
        
        // Esperar un momento para que el usuario vea el mensaje
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Ejecutar el signOut del store que limpia localStorage y redirige
        await authStore.signOut(this.$router);
        
        console.log('[LOGOUT] Cierre de sesión completado exitosamente');
        
      } catch (error) {
        console.error('[LOGOUT] Error durante el cierre de sesión:', error);
        
        // Validar y mostrar toast de error usando el mixin
        if (this.$toast) {
          this.showToast({
            severity: 'error',
            summary: 'Error al cerrar sesión',
            detail: 'Ocurrió un problema. Intente nuevamente.',
            life: 5000
          });
        } else {
          console.error('[LOGOUT] No se pudo mostrar notificación de error - Toast service no disponible');
        }
        
        // Como fallback, limpiar manualmente y redirigir
        localStorage.clear();
        this.$router.push({ name: 'sign-in' });
        
      } finally {
        // Desactivar estado de carga
        this.isLoggingOut = false;
      }
    },

    /**
     * Método para confirmar el cierre de sesión usando el mixin de confirmación
     */
    confirmLogout() {
      // Evitar múltiples confirmaciones si ya está en proceso
      if (this.isLoggingOut) {
        console.log('[LOGOUT] Ya hay un proceso de logout en curso');
        return;
      }

      // Validar que el servicio de confirmación esté disponible
      if (!this.$confirm) {
        console.error('[LOGOUT] Confirm service no disponible, ejecutando logout directo');
        this.logout();
        return;
      }

      this.showConfirm({
        message: '¿Está seguro que desea cerrar sesión?',
        header: 'Confirmar cierre de sesión',
        icon: 'pi pi-sign-out',
        acceptLabel: 'Sí, cerrar sesión',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger p-button-text',
        accept: () => {
          this.logout();
        },
        reject: () => {
          console.log('[LOGOUT] Cierre de sesión cancelado por el usuario');
        }
      });
    }
  },

  created() {
    console.log('Toolbar creado de manera exitosa');
  },

 

}

</script>

<template>


  <header class="bg-primary-custom sticky top-0 z-5 w-full h-4rem flex align-items-center shadow-2">
    <div class="px-3 flex align-items-center justify-content-between w-full">
    
      <!-- Menú de usuario -->
      <div class="w-full relative flex align-items-end justify-content-end " v-if="currentUser.isSignedIn" ref="userMenuContainer">
        <div
          class="flex align-items-center gap-3 p-2 px-3 cursor-pointer border-round-lg transition-all-300 hover:shadow-3 user-menu-trigger"
          @click.stop="toggleUserMenu($event)"
        >
          <div class="w-2rem h-2rem bg-white-alpha-20 border-circle flex align-items-center justify-content-center">
            <i class="pi pi-user text-white text-sm"></i>
          </div>
          <div class="flex flex-column align-items-start user-info">
            <span class="text-white font-semibold text-sm line-height-1 white-space-nowrap overflow-hidden text-overflow-ellipsis" style="max-width: 120px;">
              {{ currentUser.username }}
            </span>
            <span class="text-white-alpha-80 text-xs font-normal uppercase letter-spacing-1 line-height-1 white-space-nowrap overflow-hidden text-overflow-ellipsis" style="max-width: 120px;">
              {{ currentUser.role }}
            </span>
          </div>
          <i class="pi pi-chevron-down text-xs transition-transform dropdown-arrow" :class="{ 'rotated': userMenuVisible }"></i>
        </div>

        <!-- Dropdown del menú de usuario usando PrimeVue Menu -->
        <pv-menu 
          ref="userMenu"
          :model="userMenuItems" 
          :popup="true"
          class="user-dropdown-menu"
          :pt="{
            root: { class: 'user-dropdown-root' },
            list: { class: 'user-dropdown-list' },
            item: { class: 'user-dropdown-item' }
          }"
        >
          <template #start>
            <!-- Información del usuario -->
            <div class="flex align-items-center gap-3 px-3 pb-3 pt-3 user-info-section">
              <div class="w-2rem-5 h-2rem-5 bg-primary-custom border-circle flex align-items-center justify-content-center">
                <i class="pi pi-user text-white text-lg"></i>
              </div>
              <div class="flex-1 overflow-hidden">
                <div class="text-gray-900 font-semibold text-sm line-height-2 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                  {{ currentUser.username }}
                </div>
                <div class="text-gray-600 text-xs font-normal uppercase letter-spacing-1 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                  {{ currentUser.role }}
                </div>
              </div>
            </div>
            <pv-divider class="my-2" />
          </template>
          

        </pv-menu>
      </div>
    </div>
  </header>

</template>

<style scoped>
/* ============================================================================
   ESTILOS COMPLEMENTARIOS PARA FUNCIONALIDADES NO CUBIERTAS POR PRIMEFLEX
   ============================================================================ */

/* Color corporativo personalizado para el background */
.bg-primary-custom {
  background-color: var(--color-primary) !important;
}

/* Hover effect personalizado para el trigger del menú */
.user-menu-trigger {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.user-menu-trigger:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-1px);
}

/* Rotación del arrow del dropdown */
.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* Estilos para el componente Menu de PrimeVue */
.user-dropdown-menu {
  min-width: 280px !important;
}

.user-dropdown-root {
  z-index: 9999 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  border-radius: 12px !important;
  overflow: hidden !important;
}

.user-dropdown-list {
  padding: 0 !important;
}

.user-dropdown-item {
  padding: 0 !important;
}

.user-info-section {
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

/* Animación de entrada usando transición de PrimeVue */
:deep(.p-menu-overlay) {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animación del spinner */
.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Hover personalizado para el botón de logout dentro del menú */
:deep(.p-menuitem-content .dropdown-logout-btn:hover:not(:disabled)) {
  transform: translateY(-1px);
  background-color: #fef2f2 !important;
  border-color: #f87171 !important;
  color: #dc2626 !important;
}

:deep(.p-menuitem-content) {
  padding: 12px !important;
}

:deep(.p-menuitem-content .p-button) {
  width: 100% !important;
}

/* ============================================================================
   RESPONSIVE DESIGN CON PRIMEFLEX
   ============================================================================ */

/* Responsive design para el Menu de PrimeVue */
@media (max-width: 768px) {
  .user-info {
    max-width: 100px;
  }
  
  .user-dropdown-menu {
    min-width: 260px !important;
    max-width: calc(100vw - 20px) !important;
  }
}

@media (max-width: 480px) {
  .user-info {
    display: none !important; /* Ocultar texto en pantallas muy pequeñas */
  }
  
  .user-dropdown-menu {
    min-width: 240px !important;
    max-width: calc(100vw - 10px) !important;
  }
  
  :deep(.p-menu-overlay) {
    /* Ajustar posición en pantallas pequeñas */
    transform: translateX(-10px) !important;
  }
}

/* Fix para evitar que el dropdown se corte - PrimeVue maneja esto automáticamente */
header {
  overflow: visible !important;
}

.layout-container header {
  overflow: visible !important;
}
</style>