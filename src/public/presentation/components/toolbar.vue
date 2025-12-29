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
  <header class="toolbar flex align-items-center sticky top-0 z-5">
    <div class="w-full flex align-items-center justify-content-between">
      <!-- Título de la página -->
      <div class="flex-1">
        <h1 class="m-0 page-title">{{ props.title }}</h1>
      </div>
      
      <!-- Sección derecha con acciones -->
      <div class="flex align-items-center gap-3">
        
        <!-- Usuario -->
        <div class="relative">
          <div
            class="user-trigger flex align-items-center gap-2 cursor-pointer"
            @click.stop="toggleUserMenu($event)"
          >
            <div class="user-avatar flex align-items-center justify-content-center border-circle">
              <i class="pi pi-user"></i>
            </div>
            <span class="user-name font-medium">{{ currentUser.username }}</span>
            <i class="pi pi-chevron-down dropdown-arrow" :class="{ 'rotated': userMenuVisible }"></i>
          </div>

          <!-- Dropdown del menú de usuario -->
          <pv-menu 
            ref="userMenu"
            :model="userMenuItems" 
            :popup="true"
            class="user-dropdown-menu"
          >
            <template #start>
              <div class="user-info-section flex align-items-center gap-3 p-3">
                <div class="user-avatar-large flex align-items-center justify-content-center border-circle">
                  <i class="pi pi-user"></i>
                </div>
                <div class="flex-1 overflow-hidden">
                  <div class="user-name-large font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ currentUser.username }}</div>
                  <div class="user-role text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ currentUser.role }}</div>
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
.toolbar {
  background-color: var(--surface-default);
  border-bottom: 1px solid var(--border-default);
  height: 64px;
  padding: 0 var(--spacing-24);
  box-shadow: var(--shadow-sm);
}

.page-title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

/* Botones */
.btn-link {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: var(--font-size-body-small);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  padding: var(--spacing-8) var(--spacing-12);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.btn-link:hover {
  background-color: var(--surface-subtle);
}

.btn-icon {
  position: relative;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: var(--spacing-8);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: var(--surface-subtle);
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: var(--error-base);
  color: var(--text-inverse);
  font-size: 0.65rem;
  font-weight: var(--font-weight-bold);
  padding: 2px 5px;
  border-radius: var(--radius-xl);
  min-width: 16px;
}

/* Usuario */
.user-trigger {
  padding: var(--spacing-8) var(--spacing-12);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  background-color: var(--surface-subtle);
}

.user-trigger:hover {
  background-color: var(--border-default);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: var(--action-primary);
  color: var(--text-inverse);
  font-size: 0.875rem;
}

.user-name {
  font-size: var(--font-size-body-small);
  color: var(--text-primary);
}

.dropdown-arrow {
  font-size: 0.75rem;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.user-dropdown-menu {
  min-width: 280px !important;
}

.user-info-section {
  background-color: var(--surface-default);
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  background-color: var(--action-primary);
  color: var(--text-inverse);
  font-size: 1.25rem;
}

.user-name-large {
  font-size: var(--font-size-body);
  color: var(--text-primary);
}

.user-role {
  font-size: var(--font-size-body-small);
  color: var(--text-secondary);
}

/* Animaciones */
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

.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .toolbar {
    padding: 0 var(--spacing-16);
  }
  
  .btn-link {
    display: none;
  }
  
  .user-name {
    display: none;
  }
}
</style>