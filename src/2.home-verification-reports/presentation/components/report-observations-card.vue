<script setup>
const props = defineProps({
  observations: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-file-edit text-white"></i>
        Observaciones del reporte
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-comment text-primary"></i>
            Observaciones generales
          </label>
          <p class="font-semibold text-dark m-0 white-space-pre-wrap">
            {{ observations || 'Sin observaciones' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
