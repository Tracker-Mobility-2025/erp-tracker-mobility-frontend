<script>
import SidebarTrackerMobility from '../components/sidebar-tracker-mobility.component.vue'
import ToolbarTrackerMobility from '../components/toolbar-tracker-mobility.component.vue'

export default {
  name: 'layout-tracker-mobility',

  components: {
    SidebarTrackerMobility,
    ToolbarTrackerMobility
  },

  created() {
    console.log('Layout creado de manera exitosa');
  }
}
</script>

<template>
  <div class="layout-container">
    <!-- Sidebar fijo a la izquierda -->
    <SidebarTrackerMobility />

    <!-- Contenedor principal que incluye toolbar y contenido -->
    <div class="main-content">
      <!-- Toolbar fijo en la parte superior -->
      <ToolbarTrackerMobility />

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
}

.content-area {
  flex: 1;
  overflow: hidden;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease;
}

/* Responsive design para pantallas pequeñas */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>