<script setup>
const props = defineProps({
  totalPhotos: {
    type: Number,
    default: 0
  },
  totalAnnexes: {
    type: Number,
    default: 0
  },
  reportStatus: {
    type: String,
    default: ''
  },
  createdAt: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-list text-white"></i>
        Resumen del reporte
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Total de fotos -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-image text-primary"></i>
            Total de fotos
          </label>
          <p class="font-semibold text-dark m-0">
            {{ totalPhotos }}
          </p>
        </div>

        <!-- Total de anexos -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-paperclip text-primary"></i>
            Total de anexos
          </label>
          <p class="font-semibold text-dark m-0">
            {{ totalAnnexes }}
          </p>
        </div>

        <!-- Estado del reporte -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-check-circle text-primary"></i>
            Estado
          </label>
          <p class="font-semibold text-dark m-0">
            {{ reportStatus || 'No especificado' }}
          </p>
        </div>

        <!-- Fecha de creación -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar text-primary"></i>
            Creado
          </label>
          <p class="font-semibold text-dark m-0">
            {{ createdAt || 'No especificado' }}
          </p>
        </div>

        <!-- Última actualización -->
        <div class="field col-12 md:col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar-plus text-primary"></i>
            Última actualización
          </label>
          <p class="font-semibold text-dark m-0">
            {{ updatedAt || 'No especificado' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
