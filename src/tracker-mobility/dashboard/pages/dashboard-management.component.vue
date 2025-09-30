<script>

import ModuleUnderDevelopment from "../../../public/components/module-under-development.component.vue";

export default {
  name: 'dashboard-management',
  components: {ModuleUnderDevelopment},





};

</script>

<template>

  <div class="h-full overflow-hidden flex flex-column ">
    <!-- Uso personalizado -->
    <module-under-development
        module-name="Dashboard de Tracker Mobility"
        estimated-date="15/11/2025"
        :progress-percentage="50"
        :show-progress="true"
    />
  </div>


</template>

<style scoped>

</style>