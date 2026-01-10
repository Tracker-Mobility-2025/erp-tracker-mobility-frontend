<script setup>
/**
 * Componente para mostrar observaciones del reporte
 * Presentation Layer - Display Component.
 */

// Props
const props = defineProps({
  observations: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <pv-card v-if="visible && observations.length > 0" class="mb-4">
    <template #header>
      <div class="p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-exclamation-circle text-2xl text-white"></i>
          <span class="text-xl font-semibold">Observaciones</span>
        </div>
      </div>
    </template>

    <template #content>
      <div class="flex flex-column gap-2">
        <div 
          v-for="(observation, index) in observations" 
          :key="observation.id"
          class="flex align-items-start gap-3 p-3 border-round border-1 border-yellow-300 bg-yellow-50">
          <div class="flex align-items-center justify-content-center border-circle bg-yellow-500 text-white font-bold"
               style="min-width: 28px; height: 28px; font-size: 0.875rem;">
            {{ index + 1 }}
          </div>
          <p class="m-0 text-900 flex-1">{{ observation.value }}</p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
</style>
