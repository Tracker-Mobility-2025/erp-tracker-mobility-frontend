<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '../../../shared/composables/use-notification.js'

// Router
const router = useRouter()

// Composables
const { showInfo } = useNotification()

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Toolbar'
  }
})

// Estado reactivo
const userMenuVisible = ref(false)
const userMenu = ref(null)

// Data mock (temporal hasta implementar autenticación)
const currentUser = computed(() => ({
  username: 'Admin',
  role: 'Administrador',
  email: 'admin@storagedata.com'
}))

const userMenuItems = computed(() => [
  {
    label: 'Mi Perfil',
    icon: 'pi pi-user',
    command: () => {
      console.log('Ir a perfil')
      showInfo('Funcionalidad en desarrollo', 'Mi Perfil', 3000)
    }
  },
  {
    label: 'Configuración',
    icon: 'pi pi-cog',
    command: () => {
      console.log('Ir a configuración')
      showInfo('Funcionalidad en desarrollo', 'Configuración', 3000)
    }
  },
  {
    separator: true
  },
  {
    label: 'Cerrar Sesión',
    icon: 'pi pi-sign-out',
    command: () => {
      handleSignOut()
    }
  }
])

// Methods
const toggleUserMenu = (event) => {
  userMenuVisible.value = !userMenuVisible.value
  
  if (userMenu.value) {
    userMenu.value.toggle(event)
  }
}

/**
 * Maneja el cierre de sesión
 */
const handleSignOut = () => {
  console.log('🚪 [TOOLBAR] Redirigiendo al login...')
  router.push('/')
}

// Lifecycle hooks
onMounted(() => {
  console.log('Toolbar creado de manera exitosa')
})
</script>

<template>
  <header class="toolbar-header flex align-items-center sticky top-0 z-5 px-4 md:px-6 shadow-2 bg-white border-bottom-1 border-200">
    <div class="w-full flex align-items-center justify-content-between">
      <!-- Título de la página -->
      <div class="flex-1">
        <h1 class="m-0 text-2xl md:text-3xl font-semibold text-primary">{{ props.title }}</h1>
      </div>
      
      <!-- Sección derecha con acciones -->
      <div class="flex align-items-center gap-3">
        
        <!-- Usuario -->
        <div class="relative">
          <div
            class="user-trigger flex align-items-center gap-2 cursor-pointer px-3 py-2 border-round hover:bg-gray-100 transition-all transition-duration-200 bg-gray-50"
            @click.stop="toggleUserMenu($event)"
          >
            <div class="user-avatar flex align-items-center justify-content-center border-circle bg-primary">
              <i class="pi pi-user text-white text-sm"></i>
            </div>
            <span class="user-name font-medium text-sm text-color">{{ currentUser.username }}</span>
            <i class="pi pi-chevron-down text-xs text-600 transition-transform transition-duration-200" :class="{ 'rotate-180': userMenuVisible }"></i>
          </div>

          <!-- Dropdown del menú de usuario -->
          <pv-menu 
            ref="userMenu"
            :model="userMenuItems" 
            :popup="true"
            class="user-dropdown-menu"
          >
            <template #start>
              <div class="flex align-items-center gap-3 p-3 bg-gray-50">
                <div class="flex align-items-center justify-content-center border-circle bg-primary" style="width: 48px; height: 48px;">
                  <i class="pi pi-user text-white text-xl"></i>
                </div>
                <div class="flex-1 overflow-hidden">
                  <div class="font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis text-color">{{ currentUser.username }}</div>
                  <div class="text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis text-600">{{ currentUser.role }}</div>
                </div>
              </div>
              <pv-divider class="my-2" />
            </template>
          </pv-menu>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ========== TOOLBAR HEADER ========== */

.toolbar-header {
  height: 64px;
}

/* ========== AVATAR ========== */

.user-avatar {
  width: 32px;
  height: 32px;
}

/* ========== DROPDOWN MENU ========== */

.user-dropdown-menu {
  min-width: 280px !important;
}

/* ========== ANIMACIONES ========== */

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

/* ========== RESPONSIVE ========== */

@media (max-width: 768px) {
  .user-name {
    display: none;
  }
}
</style>