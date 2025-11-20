<script>

import {useAuthenticationStore} from "../../tracker-mobility/security/services/authentication.store.js";
import { NotificationMixin } from '../../shared/utils/notification.utils.js';

export default {

  name: 'Sidebar-tracker-mobility',
  
  // 🔧 Usar el mixin para notificaciones
  mixins: [NotificationMixin],

  data() {
    return {
      drawer: true,
      visible: true,
      isOpen: true, // Control del estado del sidebar
      isLoggingOut: false // Estado de carga para el logout
    };
  },

  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
      // Emitir evento para que el layout ajuste el margen
      this.$emit('sidebar-toggle', this.isOpen);
    },

    // ============================================================================
    // MÉTODOS DE CIERRE DE SESIÓN CON NOTIFICACIONES MODULARES
    // ============================================================================
    
    async logout() {
      try {
        console.log('[LOGOUT] Iniciando proceso de cierre de sesión...');
        
        // Activar estado de carga para el botón
        this.isLoggingOut = true;
        
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

  computed: {
    items() {
      return [
        { role: 'COMPANY_EMPLOYEE', label: 'Nueva Solicitud', icon: 'pi pi-fw pi-plus-circle', to:
              `/app/applicant-company/management-request-form` },
        { role: 'COMPANY_EMPLOYEE', label: 'Mis Órdenes', icon: 'pi pi-fw pi-file-edit', to: `/app/applicant-company/my-service-orders` },
        //{ role: 'ADMIN', label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: `/app/admin/dashboard` },
        { role: 'ADMIN', label: 'Órdenes', icon: 'pi pi-fw pi-file-edit', to: `/app/admin/service-orders` },
        { role: 'ADMIN', label: 'Verificadores', icon: 'pi pi-fw pi-users', to: `/app/admin/verifiers` },
        { role: 'ADMIN', label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', to: `/app/admin/verification-reports` },
        { role: 'ADMIN', label: 'Clientes', icon: 'pi pi-fw pi-user', to: `/app/admin/clients` },
      ];
    },

    currentUser() {
      const authStore = useAuthenticationStore();
      return {
        username: authStore.currentUsername,
        role: authStore.currentRole,
        isSignedIn: authStore.isSignedIn
      };
    },

    filteredItems() {
      if (!this.currentUser.isSignedIn) return [];
      return this.items.filter(i => i.role === this.currentUser.role);
    }
  },

  created() {
    console.log('Sidebar creado de manera exitosa');
  }


}

</script>

<template>
  <div>
    <!-- Cinta deslizante (visible cuando el sidebar está cerrado) -->
    <div 
      class="sidebar-toggle-ribbon" 
      :class="{ 'hidden': isOpen }"
      @click="toggleSidebar"
    >
      <i class="pi pi-angle-right ribbon-icon"></i>
    </div>

    <!-- Sidebar deslizante -->
    <div class="sidebar-fixed" :class="{ 'closed': !isOpen }">
      <aside class="sidebar-tracker">
        <!-- Header del sidebar con título y botón de cerrar -->
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <img
              src="../../assets/img/logo-sidebar-tracker-mobility.png"
              alt="Tracker Mobility Logo"
              class="brand-logo"
            />
            <h2>Tracker Mobility</h2>
          </div>
          <div class="sidebar-close-btn" @click="toggleSidebar">
            <i class="pi pi-angle-left"></i>
          </div>
        </div>

        <!-- Contenido del sidebar -->
        <div class="sidebar-content">
          <nav class="sidebar-nav">
            <ul class="sidebar-menu">
              <li
                v-for="item in filteredItems"
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

        <!-- Footer del sidebar con información de usuario y botón de cerrar sesión -->
        <div class="sidebar-footer" v-if="currentUser.isSignedIn">
          <div class="user-info-card">
            <div class="user-avatar">
              <i class="pi pi-user"></i>
            </div>
            <div class="user-details">
              <div class="user-name">{{ currentUser.username }}</div>
              <div class="user-role">{{ currentUser.role }}</div>
            </div>
          </div>
          
          <button 
            class="logout-button"
            @click="confirmLogout"
            :disabled="isLoggingOut"
          >
            <i :class="isLoggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-sign-out'"></i>
            <span>{{ isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}</span>
          </button>
        </div>
      </aside>
    </div>

    <!-- Overlay para cerrar el sidebar al hacer click fuera (en mobile) -->
    <div 
      class="sidebar-overlay" 
      :class="{ 'active': isOpen }"
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<style scoped>
/* Usar colores corporativos desde style.css global */

/* ============================================================================
   CINTA DESLIZANTE (TOGGLE RIBBON)
   ============================================================================ */

.sidebar-toggle-ribbon {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 40px;
  height: 120px;
  background: var(--color-primary);
  border-radius: 0 12px 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 150;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  visibility: visible;
}

.sidebar-toggle-ribbon.hidden {
  opacity: 0;
  visibility: hidden;
  left: -50px;
}

.sidebar-toggle-ribbon:hover {
  width: 50px;
  background: var(--color-primary-dark);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
}

.ribbon-icon {
  color: #ffffff;
  font-size: 1.5rem;
  animation: pulseArrow 2s ease-in-out infinite;
}

@keyframes pulseArrow {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

/* ============================================================================
   SIDEBAR PRINCIPAL
   ============================================================================ */

.sidebar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  width: 260px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
}

.sidebar-fixed.closed {
  transform: translateX(-100%);
}

.sidebar-tracker {
  width: 100%;
  height: 100vh;
  background: var(--color-primary);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
  position: relative;
}

/* ============================================================================
   BOTÓN DE CERRAR
   ============================================================================ */

.sidebar-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.sidebar-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.sidebar-close-btn i {
  color: #ffffff;
  font-size: 1rem;
}

/* ============================================================================
   OVERLAY (PARA MOBILE)
   ============================================================================ */

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: none; /* Oculto por defecto en desktop */
}

/* ============================================================================
   HEADER Y BRAND
   ============================================================================ */

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 60px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  flex-shrink: 0;
}

.sidebar-brand h2 {
  margin: 0;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
}

/* ============================================================================
   CONTENIDO Y NAVEGACIÓN
   ============================================================================ */

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

/* ============================================================================
   FOOTER DEL SIDEBAR (USUARIO Y LOGOUT)
   ============================================================================ */

.sidebar-footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.1);
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar i {
  color: #ffffff;
  font-size: 1.2rem;
}

.user-details {
  flex: 1;
  overflow: hidden;
}

.user-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.9);
  color: #ffffff;
  border: 2px solid rgba(220, 38, 38, 0.8);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.logout-button:hover:not(:disabled) {
  background: rgba(220, 38, 38, 1);
  border-color: rgba(185, 28, 28, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.logout-button:active:not(:disabled) {
  transform: translateY(0);
}

.logout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.logout-button i {
  font-size: 1rem;
}

/* Animación del spinner */
.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ============================================================================
   RESPONSIVE DESIGN
   ============================================================================ */

/* Tablets */
@media (max-width: 1024px) {
  .sidebar-fixed {
    width: 260px;
  }
  
  .sidebar-toggle-ribbon {
    width: 35px;
    height: 100px;
  }
}

/* Móviles grandes */
@media (max-width: 768px) {
  .sidebar-fixed {
    width: 240px;
  }
  
  .sidebar-link {
    padding: 0.875rem 1rem;
  }
  
  /* Mostrar overlay en mobile cuando el sidebar está abierto */
  .sidebar-overlay.active {
    display: block;
    opacity: 1;
    visibility: visible;
  }
  
  .sidebar-toggle-ribbon {
    width: 32px;
    height: 90px;
  }
  
  .ribbon-icon {
    font-size: 1.3rem;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {
  .sidebar-fixed {
    width: 220px;
  }
  

  .sidebar-toggle-ribbon {
    width: 30px;
    height: 80px;
  }
  
  .ribbon-icon {
    font-size: 1.2rem;
  }
}
</style>