<script>

import ModuleUnderDevelopment from "../../../public/components/module-under-development.component.vue";

export default {
  name:'client-management',
  components: {ModuleUnderDevelopment},
}

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column">
    <!-- Uso personalizado -->
    <module-under-development
        module-name="Gestión de Clientes de Tracker Mobility"
        estimated-date="Q1 2025"
        :progress-percentage="50"
        :show-progress="true"
    />

  </div>

</template>

<style scoped>

</style>