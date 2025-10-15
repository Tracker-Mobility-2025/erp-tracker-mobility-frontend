<script>
import { useAuthenticationStore } from '../../tracker-mobility/security/services/authentication.store.js';
import { NotificationMixin } from '../../shared/utils/notification.utils.js';

export default {

  name: 'Sidebar-tracker-mobility',
  
  // 🔧 Usar el mixin para notificaciones
  mixins: [NotificationMixin],


  data() {
    return {
      drawer: true,
      visible: true,
      isLoggingOut: false
    };
  },


  computed: {

    items() {
      return [
        { label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: `/tracker-mobility/admin/dashboard` },
        { label: 'Ordenes', icon: 'pi pi-fw pi-file-edit', to: `/tracker-mobility/admin/service-orders` },
        { label: 'Verificadores', icon: 'pi pi-fw pi-users', to: `/tracker-mobility/admin/verifiers` },
        { label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', to: `/tracker-mobility/admin/verification-reports` },
        { label: 'Clientes', icon: 'pi pi-fw pi-user', to: `/tracker-mobility/admin/clients` },
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
    // 🚪 MÉTODOS DE CIERRE DE SESIÓN CON NOTIFICACIONES MODULARES
    // ============================================================================
    
    async logout() {
      try {
        console.log('🚪 [LOGOUT] Iniciando proceso de cierre de sesión...');
        
        // Activar estado de carga para el botón
        this.isLoggingOut = true;
        
        // Mostrar toast informativo usando el mixin
        this.showToast({
          severity: 'info',
          summary: 'Cerrando sesión',
          detail: 'Hasta pronto. Redirigiendo al login...',
          life: 2000
        });

        // Obtener el store de autenticación
        const authStore = useAuthenticationStore();
        
        // Esperar un momento para que el usuario vea el mensaje
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Ejecutar el signOut del store que limpia localStorage y redirige
        await authStore.signOut(this.$router);
        
        console.log('✅ [LOGOUT] Cierre de sesión completado exitosamente');
        
      } catch (error) {
        console.error('❌ [LOGOUT] Error durante el cierre de sesión:', error);
        
        // Mostrar toast de error usando el mixin
        this.showToast({
          severity: 'error',
          summary: 'Error al cerrar sesión',
          detail: 'Ocurrió un problema. Intente nuevamente.',
          life: 5000
        });
        
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
        console.log('🔄 [LOGOUT] Ya hay un proceso de logout en curso');
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
          console.log('🔄 [LOGOUT] Cierre de sesión cancelado por el usuario');
        }
      });
    }
  },

  created() {
    console.log('Sidebar creado de manera exitosa');
  }


}

</script>

<template>
  <div class="sidebar-fixed">
    <aside class="sidebar-tracker">
      <!-- Header del sidebar -->
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <i class="pi pi-mobile brand-icon"></i>
          <h3 class="brand-title">Tracker Mobility</h3>
        </div>
      </div>

      <!-- Contenido del sidebar -->
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <ul class="sidebar-menu">
            <li
              v-for="item in items"
              :key="item.label"
              class="sidebar-item"
            >
              <router-link
                :to="item.to"
                class="sidebar-link"
              >
                <i :class="item.icon" class="sidebar-icon"></i>
                <span class="sidebar-label">{{ item.label }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Footer del sidebar -->
      <div class="sidebar-footer">
        <!-- Información del usuario -->
        <div class="user-info" v-if="currentUser.isSignedIn">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="user-details">
            <div class="user-name">{{ currentUser.username }}</div>
            <div class="user-role">{{ currentUser.role }}</div>
          </div>
        </div>
        
        <!-- Botón de cierre de sesión -->
        <button
          class="sidebar-logout-btn"
          @click="confirmLogout"
          :disabled="isLoggingOut"
        >
          <i :class="isLoggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'"></i>
          <span v-if="!isLoggingOut">Cerrar Sesión</span>
          <span v-else>Cerrando...</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
:root {
  --color-primary: #1e40af;
}

.sidebar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  width: 260px;
}

.sidebar-tracker {
  width: 100%;
  height: 100vh;
  background: var(--color-primary);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #ffffff;
  background: var(--color-primary);
  min-height: 70px;
  display: flex;
  align-items: center;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.brand-icon {
  color: #ffffff;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.brand-title {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.sidebar-content {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  margin: 0.375rem 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
  position: relative;
  border-left: 4px solid transparent;
  font-weight: 500;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: #3b82f6;
  padding-left: 1.25rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-link.router-link-active {
  background: rgba(59, 130, 246, 0.2);
  border-left-color: #60a5fa;
  color: #ffffff;
}

.sidebar-icon {
  margin-right: 1rem;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.sidebar-label {
  font-size: 0.95rem;
  letter-spacing: 0.025em;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: var(--color-primary);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Información del usuario */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0; /* Para truncar texto si es necesario */
}

.user-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Botón de cierre de sesión */
.sidebar-logout-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid #ef4444;
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.sidebar-logout-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.15);
  border-color: #f87171;
  color: #f87171;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.sidebar-logout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.sidebar-logout-btn:disabled:hover {
  background: transparent;
  border-color: #ef4444;
  color: #ef4444;
}

/* Animación del spinner */
.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 1024px) {
  .sidebar-fixed {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .sidebar-fixed {
    width: 240px;
  }
  
  .sidebar-link {
    padding: 0.875rem 1rem;
  }
  
  .brand-title {
    font-size: 1.1rem;
  }
  
  .user-info {
    padding: 0.5rem;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .user-name {
    font-size: 0.85rem;
  }
  
  .user-role {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .sidebar-fixed {
    width: 220px;
  }
  
  .brand-title {
    font-size: 1rem;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .user-avatar {
    align-self: center;
  }
  
  .sidebar-logout-btn {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }
}
</style>