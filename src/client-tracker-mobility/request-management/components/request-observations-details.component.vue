<script>
export default {
  name: 'request-observations-details',

  props: {
    observations: {
      type: String,
      default: null
    }
  }
}
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2 card-header">
        <i class="pi pi-comment"></i>
        <span class="text-lg font-bold">Observaciones</span>
      </div>
    </template>
    <template #content>
      <div v-if="observations" class="p-3 surface-ground border-round">
        <p class="m-0 text-color line-height-3 white-space-pre-wrap">{{ observations }}</p>
      </div>
      <div v-else class="text-center py-4">
        <i class="pi pi-comment text-4xl text-color-secondary mb-2"></i>
        <p class="text-color-secondary m-0">No hay observaciones registradas</p>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

.card-header {
  background-color: #4A60D0 !important;
  color: white !important;
}

:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: var(--border-radius) !important;
  border-top-right-radius: var(--border-radius) !important;
  padding: 0 !important;
  border-bottom: none !important;
}

:deep(.p-card) {
  border-radius: var(--border-radius) !important;
  overflow: hidden !important;
}

.white-space-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
