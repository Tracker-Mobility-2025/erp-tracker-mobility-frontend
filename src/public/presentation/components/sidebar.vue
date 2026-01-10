<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

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

// Methods
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
  emit('sidebar-toggle', isOpen.value)
}

const handleLogout = () => {
  console.log('🚪 [SIDEBAR] Cerrando sesión...')
  // Limpiar datos de sesión si los hay
  localStorage.clear()
  sessionStorage.clear()
  // Redirigir al login
  router.push('/')
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
        class="sidebar-toggle-ribbon fixed flex align-items-center justify-content-center cursor-pointer z-5 shadow-3"
        :class="{ 'hidden': isOpen }"
        @click="toggleSidebar"
    >
      <i class="pi pi-angle-right text-white text-2xl"></i>
    </div>

    <!-- Sidebar deslizante -->
    <div class="sidebar-fixed fixed h-full z-4" :class="{ 'closed': !isOpen }">
      <aside class="w-full h-full flex flex-column shadow-4" style="background: var(--surface-700);">
        <!-- Header del sidebar con título y botón de cerrar -->
        <div class="flex align-items-center justify-content-between gap-3 p-3 border-bottom-1 surface-border">
          <div class="flex-1 flex align-items-center justify-content-center">
            <h2 class="m-0 text-lg font-semibold white-space-nowrap text-white">STORAGEDATA</h2>
          </div>
          <div 
              class="w-2rem h-2rem flex align-items-center justify-content-center cursor-pointer border-circle flex-shrink-0 transition-all transition-duration-300 hover:bg-white-alpha-10" 
              @click="toggleSidebar"
              style="background: var(--surface-600);"
          >
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
                  class="my-2 mx-3"
              >
                <router-link
                    :to="item.to"
                    class="sidebar-link flex align-items-center px-4 py-3 no-underline font-medium border-round-lg text-white transition-all transition-duration-300"
                    @click="emit('menu-selected', item.title)"
                >
                  <i :class="item.icon" class="text-center flex-shrink-0 mr-3 text-xl" style="color: var(--surface-300); width: 24px;"></i>
                  <span class="flex-1 text-sm" style="letter-spacing: 0.025em;">{{ item.label }}</span>
                  <span 
                      v-if="item.badge" 
                      class="text-xs font-bold text-center px-2 py-1 border-round-3xl text-white"
                      style="background: var(--red-500); min-width: 20px;"
                  >
                    {{ item.badge }}
                  </span>
                </router-link>
              </li>
            </ul>
          </nav>

        </div>
        
      </aside>
    </div>

    <!-- Overlay para cerrar el sidebar al hacer click fuera (en mobile) -->
    <div
        class="sidebar-overlay fixed w-full h-full top-0 left-0 z-3"
        :class="{ 'active': isOpen }"
        @click="toggleSidebar"
    ></div>
  </div>
</template>

<style scoped>
/* Estilos mínimos usando variables CSS de theme-variables.css */

/* Cinta deslizante */
.sidebar-toggle-ribbon {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 40px;
  height: 120px;
  background: var(--primary-500);
  border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-toggle-ribbon.hidden {
  opacity: 0;
  visibility: hidden;
  left: -50px;
}

.sidebar-toggle-ribbon:hover {
  width: 50px;
  background: var(--primary-600);
}

/* Sidebar principal */
.sidebar-fixed {
  top: 0;
  left: 0;
  width: 280px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-fixed.closed {
  transform: translateX(-100%);
}

/* Links de navegación */
.sidebar-link:hover {
  background: var(--surface-600);
}

.sidebar-link.router-link-active,
.sidebar-link.router-link-exact-active {
  background: var(--primary-500);
}

.sidebar-link.router-link-active i,
.sidebar-link.router-link-exact-active i {
  color: var(--surface-0) !important;
}

.sidebar-link.router-link-active span:last-child,
.sidebar-link.router-link-exact-active span:last-child {
  background: var(--surface-0) !important;
  color: var(--primary-500) !important;
}

.sidebar-link:hover i {
  color: var(--surface-0);
}

/* Botón de logout */
button:hover {
  background: var(--red-600) !important;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Overlay */
.sidebar-overlay {
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar-fixed {
    width: 260px;
  }
  
  .sidebar-toggle-ribbon {
    width: 35px;
    height: 100px;
  }
}

@media (max-width: 768px) {
  .sidebar-fixed {
    width: 240px;
  }
  
  .sidebar-overlay.active {
    display: block;
    opacity: 1;
    visibility: visible;
  }
  
  .sidebar-toggle-ribbon {
    width: 32px;
    height: 90px;
  }
}

@media (max-width: 480px) {
  .sidebar-fixed {
    width: 220px;
  }
  
  .sidebar-toggle-ribbon {
    width: 30px;
    height: 80px;
  }
}
</style>