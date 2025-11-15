<script>

import {useAuthenticationStore} from "../../tracker-mobility/security/services/authentication.store.js";

export default {

  name: 'Sidebar-tracker-mobility',

  data() {
    return {
      drawer: true,
      visible: true,
      isOpen: true // Control del estado del sidebar
    };
  },

  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
      // Emitir evento para que el layout ajuste el margen
      this.$emit('sidebar-toggle', this.isOpen);
    }
  },

  computed: {
    items() {
      return [
        { role: 'COMPANY_EMPLOYEE', label: 'Nueva Solicitud', icon: 'pi pi-fw pi-plus-circle', to:
              `/tracker-mobility/applicant-company/management-request-form` },
        { role: 'COMPANY_EMPLOYEE', label: 'Mis Órdenes', icon: 'pi pi-fw pi-file-edit', to: `/tracker-mobility/applicant-company/my-service-orders` },
        //{ role: 'ADMIN', label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: `/tracker-mobility/admin/dashboard` },
        { role: 'ADMIN', label: 'Órdenes', icon: 'pi pi-fw pi-file-edit', to: `/tracker-mobility/admin/service-orders` },
        { role: 'ADMIN', label: 'Verificadores', icon: 'pi pi-fw pi-users', to: `/tracker-mobility/admin/verifiers` },
        { role: 'ADMIN', label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', to: `/tracker-mobility/admin/verification-reports` },
        { role: 'ADMIN', label: 'Clientes', icon: 'pi pi-fw pi-user', to: `/tracker-mobility/admin/clients` },
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
        <!-- Botón de cerrar dentro del sidebar -->
        <div class="sidebar-close-btn" @click="toggleSidebar">
          <i class="pi pi-angle-left"></i>
        </div>

        <!-- Header del sidebar -->
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <img
              src="../../assets/img/logo-toolbar-tracker-mobility.png"
              alt="Tracker Mobility Logo"
              class="brand-logo"
            />
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
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
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
  padding: 1.5rem 1rem;
  padding-top: 3.5rem; /* Espacio para el botón de cerrar */
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: var(--color-primary);
  min-height: 100px;
  display: flex;
  align-items: center;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
}

.brand-logo {
  max-width: 100%;
  height: auto;
  max-height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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