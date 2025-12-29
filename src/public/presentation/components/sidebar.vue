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
        class="sidebar-toggle-ribbon fixed flex align-items-center justify-content-center cursor-pointer z-5"
        :class="{ 'hidden': isOpen }"
        @click="toggleSidebar"
    >
      <i class="pi pi-angle-right ribbon-icon"></i>
    </div>

    <!-- Sidebar deslizante -->
    <div class="sidebar-fixed fixed h-full z-4" :class="{ 'closed': !isOpen }">
      <aside class="sidebar-tracker w-full h-full flex flex-column">
        <!-- Header del sidebar con título y botón de cerrar -->
        <div class="flex align-items-center justify-content-between gap-3 p-3 border-bottom-1 border-300">
          <div class="flex-1 flex align-items-center justify-content-center">
            <h2 class="m-0 text-lg font-semibold white-space-nowrap">STORAGEDATA</h2>
          </div>
          <div class="sidebar-close-btn flex align-items-center justify-content-center cursor-pointer border-circle flex-shrink-0" @click="toggleSidebar">
            <i class="pi pi-angle-left"></i>
          </div>
        </div>

        <!-- Contenido del sidebar -->
        <div class="flex-1 py-4 overflow-y-auto">
          <nav>
            <ul class="list-none p-0 m-0">
              <li
                  v-for="item in props.items"
                  :key="item.label"
                  class="my-2"
              >
                <router-link
                    :to="item.to"
                    class="sidebar-link flex align-items-center px-4 py-3 no-underline font-medium"
                    @click="emit('menu-selected', item.title)"
                >
                  <i :class="item.icon" class="sidebar-icon text-center flex-shrink-0"></i>
                  <span class="sidebar-label flex-1">{{ item.label }}</span>
                  <span v-if="item.badge" class="sidebar-badge text-xs font-bold text-center">{{ item.badge }}</span>
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
/* ============================================================================
   CINTA DESLIZANTE (TOGGLE RIBBON)
   ============================================================================ */

.sidebar-toggle-ribbon {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 40px;
  height: 120px;
  background: var(--action-primary);
  border-radius: 0 12px 12px 0;
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
  background: var(--action-primary-hover);
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
  top: 0;
  left: 0;
  width: 260px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
}

.sidebar-fixed.closed {
  transform: translateX(-100%);
}

.sidebar-tracker {
  background: var(--surface-default);
  color: var(--text-primary);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
}

/* ============================================================================
   BOTÓN DE CERRAR
   ============================================================================ */

.sidebar-close-btn {
  width: 32px;
  height: 32px;
  background: var(--surface-subtle);
  transition: all 0.3s ease;
}

.sidebar-close-btn:hover {
  background: var(--border-default);
  transform: scale(1.1);
}

.sidebar-close-btn i {
  color: var(--text-primary);
  font-size: 1rem;
}

/* ============================================================================
   OVERLAY (PARA MOBILE)
   ============================================================================ */

.sidebar-overlay {
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: none;
}

/* ============================================================================
   NAVEGACIÓN
   ============================================================================ */

.sidebar-link {
  color: var(--text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--radius-lg);
  margin: 0 var(--spacing-12);
}

.sidebar-link:hover {
  background: var(--surface-subtle);
}

.sidebar-link.router-link-active,
.sidebar-link.router-link-exact-active {
  background: var(--action-primary);
  color: var(--text-inverse);
}

.sidebar-link.router-link-active .sidebar-icon,
.sidebar-link.router-link-exact-active .sidebar-icon {
  color: var(--text-inverse);
}

.sidebar-link.router-link-active .sidebar-badge,
.sidebar-link.router-link-exact-active .sidebar-badge {
  background-color: var(--text-inverse);
  color: var(--action-primary);
}

.sidebar-icon {
  margin-right: 1rem;
  font-size: 1.2rem;
  width: 24px;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.sidebar-link:hover .sidebar-icon {
  color: var(--text-primary);
}

.sidebar-label {
  font-size: 0.95rem;
  letter-spacing: 0.025em;
}

.sidebar-badge {
  background-color: var(--error-base);
  color: var(--text-inverse);
  padding: 2px 8px;
  border-radius: var(--radius-xl);
  min-width: 20px;
}

/* ============================================================================
   RESPONSIVE DESIGN
   ============================================================================ */

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

  .sidebar-link {
    padding: 0.875rem 1rem;
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

  .ribbon-icon {
    font-size: 1.3rem;
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

  .ribbon-icon {
    font-size: 1.2rem;
  }
}
</style>