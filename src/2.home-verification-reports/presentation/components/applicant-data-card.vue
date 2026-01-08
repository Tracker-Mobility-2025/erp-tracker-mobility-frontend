<script setup>
const props = defineProps({
  businessName: {
    type: String,
    default: ''
  },
  ruc: {
    type: String,
    default: ''
  },
  requestDate: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-briefcase text-white"></i>
        Datos del solicitante
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Razón social -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-building text-primary"></i>
            Razón social
          </label>
          <p class="font-semibold text-dark m-0">
            {{ businessName || 'No especificado' }}
          </p>
        </div>

        <!-- RUC -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-id-card text-primary"></i>
            RUC
          </label>
          <p class="font-semibold text-dark m-0">
            {{ ruc || 'No especificado' }}
          </p>
        </div>

        <!-- Fecha de solicitud -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar text-primary"></i>
            Fecha de solicitud
          </label>
          <p class="font-semibold text-dark m-0">
            {{ requestDate || 'No especificado' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
