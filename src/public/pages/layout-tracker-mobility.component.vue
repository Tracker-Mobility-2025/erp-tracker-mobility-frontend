<script>
import SidebarTrackerMobility from '../components/sidebar-tracker-mobility.component.vue'

export default {
  name: 'layout-tracker-mobility',

  components: {
    SidebarTrackerMobility
  },

  data() {
    return {
      sidebarOpen: true
    };
  },

  methods: {
    handleSidebarToggle(isOpen) {
      this.sidebarOpen = isOpen;
    }
  },

  created() {
    console.log('Layout creado de manera exitosa');
  }
}
</script>

<template>
  <div class="layout-container ">
    <!-- Sidebar fijo a la izquierda con control de toggle -->
    <SidebarTrackerMobility @sidebar-toggle="handleSidebarToggle" />

    <!-- Contenedor principal con contenido -->
    <div class="main-content" :class="{ 'sidebar-closed': !sidebarOpen }">
      <!-- Área de contenido principal donde se renderizarán las rutas -->
      <main class="content-area">
        <router-view />
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
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px; /* Ancho del sidebar */
  height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content.sidebar-closed {
  margin-left: 0;
}

.content-area {
  flex: 1;
  overflow: auto;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease;
}

/* Responsive design para pantallas pequeñas */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important; /* En mobile siempre ocupa todo el ancho */
  }
}
</style>