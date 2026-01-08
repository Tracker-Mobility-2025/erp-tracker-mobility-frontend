<script setup>
const props = defineProps({
  fullName: {
    type: String,
    default: ''
  },
  documentType: {
    type: String,
    default: ''
  },
  documentNumber: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-user text-white"></i>
        Datos del candidato
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Nombre completo -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Nombre completo
          </label>
          <p class="font-semibold text-dark m-0">
            {{ fullName || 'No especificado' }}
          </p>
        </div>

        <!-- Tipo de documento -->
        <div class="field col-12 md:col-2">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-file text-primary"></i>
            Tipo documento
          </label>
          <p class="font-semibold text-dark m-0">
            {{ documentType || 'No especificado' }}
          </p>
        </div>

        <!-- Número de documento -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-id-card text-primary"></i>
            Número documento
          </label>
          <p class="font-semibold text-dark m-0">
            {{ documentNumber || 'No especificado' }}
          </p>
        </div>

        <!-- Teléfono -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-phone text-primary"></i>
            Teléfono
          </label>
          <p class="font-semibold text-dark m-0">
            {{ phoneNumber || 'No especificado' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
