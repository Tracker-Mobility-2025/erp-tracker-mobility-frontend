<script setup>
const props = defineProps({
  casuistryType: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  recommendations: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-exclamation-triangle text-white"></i>
        Casuística del reporte
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Tipo de casuística -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-tag text-primary"></i>
            Tipo
          </label>
          <p class="font-semibold text-dark m-0">
            {{ casuistryType || 'No especificado' }}
          </p>
        </div>

        <!-- Descripción -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-info-circle text-primary"></i>
            Descripción
          </label>
          <p class="font-semibold text-dark m-0 white-space-pre-wrap">
            {{ description || 'No especificado' }}
          </p>
        </div>

        <!-- Recomendaciones -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-lightbulb text-primary"></i>
            Recomendaciones
          </label>
          <p class="font-semibold text-dark m-0 white-space-pre-wrap">
            {{ recommendations || 'Sin recomendaciones' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
