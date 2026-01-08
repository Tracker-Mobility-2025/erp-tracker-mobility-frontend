<script setup>
import { ref, computed, onMounted } from 'vue'
import Toolbar from '../components/toolbar.vue'
import Sidebar from '../components/sidebar.vue'

// Estado reactivo del sidebar
const sidebarOpen = ref(true)

// Estado reactivo para el título de página
const currentPageTitle = ref('Dashboard')

// Opciones del menú de navegación
const menuItems = computed(() => [
  { roles: ['COMPANY_EMPLOYEE'], label: 'Nueva Solicitud', icon: 'pi pi-fw pi-plus-circle', to: `/app/applicant-company/management-request-form` },
  { roles: ['COMPANY_EMPLOYEE'], label: 'Mis Órdenes', icon: 'pi pi-fw pi-file-edit', to: `/app/applicant-company/my-service-orders` },
  //{ roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: `/app/admin/dashboard` },
  { roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Órdenes', icon: 'pi pi-fw pi-file-edit', to: `/app/admin/verification-orders` },
  { roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Verificadores', icon: 'pi pi-fw pi-users', to: `/app/admin/verifiers` },
  { roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', to: `/app/admin/verification-reports` },
  { roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Clientes', icon: 'pi pi-fw pi-user', to: `/app/admin/clients` },
])

// Manejador del evento toggle del sidebar
const handleSidebarToggle = (isOpen) => {
  sidebarOpen.value = isOpen
}

// Manejador del evento de selección de menú
const handleMenuSelected = (title) => {
  currentPageTitle.value = title
}

// Hook de ciclo de vida
onMounted(() => {
  console.log('Layout creado de manera exitosa')
})
</script>

<template>
  <div class="layout-container">
    <!-- Sidebar fijo a la izquierda -->
    <Sidebar
        :items="menuItems"
        @sidebar-toggle="handleSidebarToggle"
        @menu-selected="handleMenuSelected"
    />

    <!-- Contenedor principal -->
    <div class="main-wrapper" :class="{ 'sidebar-closed': !sidebarOpen }">

      <!-- Área de contenido -->
      <main class="content-area">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--surface-subtle);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  max-height: 100vh;
}

.main-wrapper.sidebar-closed {
  margin-left: 0;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--surface-subtle);
  padding: var(--spacing-24);
  min-height: 0;
}

.content-wrapper {
  width: 100%;
  max-width: 100%;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0 !important;
  }

  .content-area {
    padding: var(--spacing-16);
  }
}
</style>