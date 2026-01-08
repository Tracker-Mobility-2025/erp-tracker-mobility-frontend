<script setup>
const props = defineProps({
  address: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  province: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  reference: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-home text-white"></i>
        Dirección del candidato
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Dirección -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map-marker text-primary"></i>
            Dirección
          </label>
          <p class="font-semibold text-dark m-0">
            {{ address || 'No especificado' }}
          </p>
        </div>

        <!-- Distrito -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Distrito
          </label>
          <p class="font-semibold text-dark m-0">
            {{ district || 'No especificado' }}
          </p>
        </div>

        <!-- Provincia -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Provincia
          </label>
          <p class="font-semibold text-dark m-0">
            {{ province || 'No especificado' }}
          </p>
        </div>

        <!-- Departamento -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Departamento
          </label>
          <p class="font-semibold text-dark m-0">
            {{ department || 'No especificado' }}
          </p>
        </div>

        <!-- Referencia -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-info-circle text-primary"></i>
            Referencia
          </label>
          <p class="font-semibold text-dark m-0">
            {{ reference || 'No especificado' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
