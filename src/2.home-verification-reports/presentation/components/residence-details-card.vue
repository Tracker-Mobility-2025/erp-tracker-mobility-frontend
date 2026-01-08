<script setup>
const props = defineProps({
  residenceType: {
    type: String,
    default: ''
  },
  dwellingType: {
    type: String,
    default: ''
  },
  garageType: {
    type: String,
    default: ''
  },
  residenceTime: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-building text-white"></i>
        Detalles de residencia, vivienda y cochera
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Tipo de residencia -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-home text-primary"></i>
            Tipo de residencia
          </label>
          <p class="font-semibold text-dark m-0">
            {{ residenceType || 'No especificado' }}
          </p>
        </div>

        <!-- Tipo de vivienda -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-building text-primary"></i>
            Tipo de vivienda
          </label>
          <p class="font-semibold text-dark m-0">
            {{ dwellingType || 'No especificado' }}
          </p>
        </div>

        <!-- Tipo de cochera -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-car text-primary"></i>
            Tipo de cochera
          </label>
          <p class="font-semibold text-dark m-0">
            {{ garageType || 'No especificado' }}
          </p>
        </div>

        <!-- Tiempo de residencia -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-clock text-primary"></i>
            Tiempo de residencia
          </label>
          <p class="font-semibold text-dark m-0">
            {{ residenceTime || 'No especificado' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
