<script setup>
import { ref, computed } from 'vue';
import SidebarTrackerMobility from '../components/sidebar-tracker-mobility.component.vue';
import { useAuthenticationStore } from '../../../tracker-mobility/security/services/authentication.store.js';

// Store
const authStore = useAuthenticationStore();

// Estado reactivo del sidebar
const sidebarOpen = ref(true);

// Opciones del menú de navegación
const allMenuItems = [
  // Opciones para VENDEDOR (COMPANY_EMPLOYEE con rol VENDEDOR)
  { roles: ['COMPANY_EMPLOYEE', 'VENDEDOR'], label: 'Mis Solicitudes', icon: 'pi pi-fw pi-list', to: `/app/applicant-company/order-requests` },
  
  // Opciones para GERENTE_VENTAS (COMPANY_EMPLOYEE con rol GERENTE_VENTAS)
  { roles: ['GERENTE_VENTAS'], label: 'Equipo de Ventas', icon: 'pi pi-fw pi-users', to: `/app/sales-manager/sales-team` },
  
  // Opciones para ADMIN y MASTER_ADMIN
  { roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Órdenes', icon: 'pi pi-fw pi-file-edit', to: `/app/admin/verification-orders` },
  { roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', to: `/app/admin/verification-reports` },
  { roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Verificadores', icon: 'pi pi-fw pi-users', to: `/app/admin/verifiers` },
  { roles: ['ADMIN', 'MASTER_ADMIN'], label: 'Clientes', icon: 'pi pi-fw pi-user', to: `/app/admin/clients` },
];

// Filtrar menú según el rol específico del usuario
const menuItems = computed(() => {
  // Obtener el rol específico (GERENTE_VENTAS, VENDEDOR, ADMIN, etc.)
  const specificRole = authStore.specificRole;
  
  // Si no hay rol específico, usar roles array
  if (!specificRole) {
    const userRoles = authStore.currentRoles;
    return allMenuItems.filter(item => 
      item.roles.some(role => userRoles.includes(role))
    );
  }
  
  // Filtrar items que incluyen el rol específico
  return allMenuItems.filter(item => item.roles.includes(specificRole));
});

// Manejadores de eventos
const handleSidebarToggle = (isOpen) => {
  sidebarOpen.value = isOpen;
};
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden" style="background-color: var(--color-background);">
    <!-- Sidebar fijo a la izquierda -->
    <SidebarTrackerMobility
      :items="menuItems"
      @sidebar-toggle="handleSidebarToggle"
    />

    <!-- Contenedor principal -->
    <main class="flex-1 overflow-hidden main-content" :class="{ 'content-expanded': !sidebarOpen }" style="background-color: var(--color-background);">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.main-content {
  margin-left: 260px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content.content-expanded {
  margin-left: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0 !important;
  }
}
</style>