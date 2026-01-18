<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '../../../tracker-mobility/security/services/authentication.store.js'

// Router
const router = useRouter()

// Store
const authStore = useAuthenticationStore()

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

// Estado reactivo
const isOpen = ref(true)

// Emits
const emit = defineEmits(['sidebar-toggle', 'menu-selected'])

// Computed
const currentUser = computed(() => {
  // Obtener el rol específico (GERENTE_VENTAS, VENDEDOR) o el rol genérico
  const specificRole = authStore.specificRole;
  const displayRole = specificRole || authStore.currentRole || 'Sin rol';
  
  // Formatear el nombre del rol para mostrar
  const roleNames = {
    'ADMIN': 'Administrador',
    'MASTER_ADMIN': 'Super Administrador',
    'COMPANY_EMPLOYEE': 'Empleado',
    'GERENTE_VENTAS': 'Gerente de Ventas',
    'VENDEDOR': 'Vendedor'
  };
  
  return {
    username: authStore.currentUsername || 'Usuario',
    role: roleNames[displayRole] || displayRole
  };
});

// Methods
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
  emit('sidebar-toggle', isOpen.value)
}

const handleLogout = () => {
  console.log('🚪 [SIDEBAR] Cerrando sesión...')
  authStore.signOut(router)
}

// Lifecycle hooks
onMounted(() => {
  console.log('Sidebar creado de manera exitosa')
})
</script>

<template>
  <div>
    <!-- Cinta deslizante (visible cuando el sidebar está cerrado) -->
    <div
        class="sidebar-ribbon fixed flex align-items-center justify-content-center cursor-pointer z-5 shadow-3"
        :class="{ 'ribbon-hidden': isOpen }"
        @click="toggleSidebar"
    >
      <i class="pi pi-angle-right text-white text-xl ribbon-pulse"></i>
    </div>

    <!-- Sidebar deslizante -->
    <div class="sidebar-container fixed h-full z-4 shadow-4" :class="{ 'sidebar-closed': !isOpen }">
      <aside class="w-full h-full flex flex-column bg-dark text-white">
        <!-- Header del sidebar con título y botón de cerrar -->
        <div class="flex align-items-center justify-content-between gap-3 p-3 sidebar-header">
          <div class="flex-1 flex align-items-center justify-content-center">
            <h2 class="m-0 text-lg font-semibold white-space-nowrap text-white">TRACKER MOBILITY</h2>
          </div>
          <div class="sidebar-close-btn" @click="toggleSidebar">
            <i class="pi pi-angle-left text-white"></i>
          </div>
        </div>

        <!-- Contenido del sidebar -->
        <div class="flex-1 py-4 overflow-y-auto">
          <nav>
            <ul class="list-none p-0 m-0">
              <li
                  v-for="item in props.items"
                  :key="item.label"
                  class="my-2 px-3"
              >
                <router-link
                    :to="item.to"
                    class="sidebar-link flex align-items-center gap-3 px-3 py-3 no-underline border-round transition-all transition-duration-300"
                    @click="emit('menu-selected', item.title)"
                >
                  <i :class="item.icon" class="sidebar-icon"></i>
                  <span class="flex-1 font-medium">{{ item.label }}</span>
                  <span v-if="item.badge" class="badge badge-danger">{{ item.badge }}</span>
                </router-link>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Información del usuario -->
        <div class="border-top-1 surface-border p-3 flex-shrink-0">
          <div class="flex align-items-center gap-3 p-2 border-round" style="background: var(--surface-600);">
            <div class="flex align-items-center justify-content-center border-circle bg-primary text-white flex-shrink-0" style="width: 40px; height: 40px;">
              <i class="pi pi-user text-lg"></i>
            </div>
            <div class="flex-1 overflow-hidden">
              <div class="font-semibold text-white text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {{ currentUser.username }}
              </div>
              <div class="text-xs text-white-alpha-70 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {{ currentUser.role }}
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de cerrar sesión -->
        <div class="p-3 pt-0 flex-shrink-0">
          <button
              @click="handleLogout"
              class="logout-btn w-full flex align-items-center justify-content-center gap-2 px-4 py-3 border-none cursor-pointer font-medium border-round-lg text-white transition-all transition-duration-300"
              style="background: var(--red-500);"
          >
            <i class="pi pi-sign-out text-lg"></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </div>

    <!-- Overlay para cerrar el sidebar al hacer click fuera (en mobile) -->
    <div
        class="sidebar-overlay fixed w-full h-full top-0 left-0 z-3"
        :class="{ 'overlay-active': isOpen }"
        @click="toggleSidebar"
    ></div>
  </div>
</template>

<style scoped>
/* Botón de logout */
.logout-btn:hover {
  background: var(--red-600) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.logout-btn:active {
  transform: translateY(0);
}

/* Todos los demás estilos del sidebar se movieron a src/styles/ui-components.css */
/* Esto permite reutilización y mantiene consistencia con el sistema de diseño corporativo */
</style>