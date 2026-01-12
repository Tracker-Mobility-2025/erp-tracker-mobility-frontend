<script setup>
/**
 * Componente para mostrar resumen del reporte
 * Presentation Layer - Display Component.
 */

// Props
const props = defineProps({
  summary: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <pv-card v-if="visible && summary" class="mb-4">
    <template #header>
      <div class="p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-file-edit text-2xl text-white"></i>
          <span class="text-xl font-semibold">Resumen</span>
        </div>
      </div>
    </template>

    <template #content>
      <div class="p-3 border-round border-1 surface-border bg-surface-50">
        <p class="m-0 text-900 line-height-3 white-space-pre-wrap">{{ summary }}</p>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
</style>
