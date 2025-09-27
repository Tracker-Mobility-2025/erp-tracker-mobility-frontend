<script>

export default {

  name: 'Sidebar-tracker-mobility',


  data() {
    return {
      drawer: true,
      visible: true
    };
  },


  computed: {

    items() {
      return [
        { label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: `/tracker-mobility/dashboard` },
        { label: 'Ordenes', icon: 'pi pi-fw pi-file-edit', to: `/tracker-mobility/admin/service-orders` },
        { label: 'Verificadores', icon: 'pi pi-fw pi-users', to: `/tracker-mobility/admin/verifiers` },
        { label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', to: `/tracker-mobility/admin/verification-reports` },
        { label: 'Clientes', icon: 'pi pi-fw pi-user', to: `/tracker-mobility/admin/clients` },
      ];
    }
  },

  methods: {
    logout() {
      // Implementar lógica de cierre de sesión
      this.$router.push('/login');
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
        <button
          class="sidebar-logout-btn"
          @click="logout"
        >
          <i class="pi pi-sign-out"></i>
          <span>Cerrar Sesión</span>
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
  padding: 1.5rem 1rem;
  border-top: 1px solid #ffffff;
  background: var(--color-primary);
}

.sidebar-logout-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid #ef4444;
  color: #ef4444;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #f87171;
  color: #f87171;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
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
}

@media (max-width: 480px) {
  .sidebar-fixed {
    width: 220px;
  }
  
  .brand-title {
    font-size: 1rem;
  }
}
</style>