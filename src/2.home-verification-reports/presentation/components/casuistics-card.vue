<script setup>
/**
 * Componente para mostrar casuística del reporte
 * Presentation Layer - Display Component.
 */

// Props
const props = defineProps({
  casuistics: {
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
  <pv-card v-if="visible && casuistics.length > 0" class="mb-4">
    <template #header>
      <div class="p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-list text-2xl text-white"></i>
          <span class="text-xl font-semibold">Casuística</span>
        </div>
      </div>
    </template>

    <template #content>
      <div class="flex flex-column gap-2">
        <div 
          v-for="(item, index) in casuistics" 
          :key="item.id"
          class="flex align-items-start gap-3 p-3 border-round border-1 border-green-300 bg-green-50">
          <div class="flex align-items-center justify-content-center border-circle bg-green-500 text-white font-bold"
               style="min-width: 28px; height: 28px; font-size: 0.875rem;">
            {{ index + 1 }}
          </div>
          <p class="m-0 text-900 flex-1">{{ item.value }}</p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
</style>
