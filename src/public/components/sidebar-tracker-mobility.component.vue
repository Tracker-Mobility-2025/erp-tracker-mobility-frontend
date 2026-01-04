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
/* Todos los estilos del sidebar se movieron a src/styles/ui-components.css */
/* Esto permite reutilización y mantiene consistencia con el sistema de diseño corporativo */
</style>