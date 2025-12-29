<script setup>
import { ref, onMounted } from 'vue'

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
      <aside class="w-full h-full flex flex-column bg-slate text-white">
        <!-- Header del sidebar con título y botón de cerrar -->
        <div class="flex align-items-center justify-content-between gap-3 p-3 border-bottom-1 border-600">
          <div class="flex-1 flex align-items-center justify-content-center">
            <h2 class="m-0 text-lg font-semibold white-space-nowrap text-white">TRACKER MOBILITY</h2>
          </div>
          <div class="sidebar-close-btn flex align-items-center justify-content-center cursor-pointer border-circle flex-shrink-0 bg-gray-700 hover:bg-gray-600 transition-duration-300" @click="toggleSidebar">
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
                  <i :class="item.icon" class="sidebar-icon flex-shrink-0"></i>
                  <span class="flex-1 font-medium">{{ item.label }}</span>
                  <span v-if="item.badge" class="sidebar-badge px-2 border-round-2xl text-xs font-bold">{{ item.badge }}</span>
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
        :class="{ 'overlay-active': isOpen }"
        @click="toggleSidebar"
    ></div>
  </div>
</template>

<style scoped>
/* ========== CINTA DESLIZANTE (RIBBON) ========== */

.sidebar-ribbon {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 40px;
  height: 120px;
  background: var(--color-primary);
  border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  visibility: visible;
}

.ribbon-hidden {
  opacity: 0;
  visibility: hidden;
  left: -50px;
}

.sidebar-ribbon:hover {
  width: 50px;
  background: var(--color-primary-hover);
}

.ribbon-pulse {
  animation: pulseArrow 2s ease-in-out infinite;
}

@keyframes pulseArrow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

/* ========== SIDEBAR CONTAINER ========== */

.sidebar-container {
  top: 0;
  left: 0;
  width: 260px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-closed {
  transform: translateX(-100%);
}

.bg-slate {
  background: var(--color-dark);
}

/* ========== BOTÓN CERRAR ========== */

.sidebar-close-btn {
  width: 32px;
  height: 32px;
}

.sidebar-close-btn:hover {
  transform: scale(1.1);
}

/* ========== OVERLAY ========== */

.sidebar-overlay {
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: none;
}

/* ========== NAVEGACIÓN ========== */

.sidebar-link {
  color: var(--surface-100);
}

.sidebar-link:hover {
  background: var(--surface-600);
  color: var(--color-white);
}

.sidebar-link:hover .sidebar-icon {
  color: var(--color-white);
}

.sidebar-link.router-link-active,
.sidebar-link.router-link-exact-active {
  background: var(--color-primary);
  color: var(--color-white);
}

.sidebar-link.router-link-active .sidebar-icon,
.sidebar-link.router-link-exact-active .sidebar-icon {
  color: var(--color-white);
}

.sidebar-link.router-link-active .sidebar-badge,
.sidebar-link.router-link-exact-active .sidebar-badge {
  background: var(--color-white);
  color: var(--color-primary);
}

.sidebar-icon {
  font-size: 1.2rem;
  width: 24px;
  color: var(--surface-300);
}

.sidebar-badge {
  background: var(--color-danger);
  color: var(--color-white);
  min-width: 20px;
}

/* ========== RESPONSIVE ========== */

@media (max-width: 1024px) {
  .sidebar-container { width: 260px; }
  .sidebar-ribbon { width: 35px; height: 100px; }
}

@media (max-width: 768px) {
  .sidebar-container { width: 240px; }
  .sidebar-ribbon { width: 32px; height: 90px; }
  .overlay-active {
    display: block;
    opacity: 1;
    visibility: visible;
  }
}

@media (max-width: 480px) {
  .sidebar-container { width: 220px; }
  .sidebar-ribbon { width: 30px; height: 80px; }
}
</style>