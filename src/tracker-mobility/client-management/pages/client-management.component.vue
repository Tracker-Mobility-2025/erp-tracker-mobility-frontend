<script>

import ModuleUnderDevelopment from "../../../public/components/module-under-development.component.vue";

export default {
  name:'client-management',
  components: {ModuleUnderDevelopment},
}

</script>

<template>

  <!--
  <div class="h-full overflow-hidden flex flex-column p-4">


    <h2 class="text-2xl font-bold mb-2">Gestión de Clientes</h2>
    <p class="text-gray-600 mb-4"> Gestiona tus clientes y genera accesos personalizados para solicitar verificaciones.</p>

  </div>
  -->



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