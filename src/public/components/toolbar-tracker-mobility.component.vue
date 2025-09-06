<script>

export default {
  name: "toolbar-tracker-mobility",
  data() {
    return {
      title: 'Tracker Mobility'
    }
  },

  created() {
    console.log('Toolbar creado de manera exitosa');
  }

}

</script>

<template>

  <header class="toolbar-tracker">
    <div class="toolbar-content">
      <!-- Título o logo de la aplicación -->
    </div>
  </header>

</template>

<style scoped>
.toolbar-tracker {
  background-color: var(--color-primary);
  position: sticky;
  border-left: 1px solid #ffffff;
  top: 0;
  z-index: 50;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
}

.toolbar-content {
  padding: 0 20px;
  display: flex;
  align-items: center;
  width: 100%;
}

.toolbar-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}
</style>