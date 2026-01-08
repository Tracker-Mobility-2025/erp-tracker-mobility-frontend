<script setup>
const props = defineProps({
  interviewDate: {
    type: String,
    default: ''
  },
  interviewTime: {
    type: String,
    default: ''
  },
  observations: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-comments text-white"></i>
        Detalles de la entrevista con el arrendador
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Fecha de entrevista -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar text-primary"></i>
            Fecha
          </label>
          <p class="font-semibold text-dark m-0">
            {{ interviewDate || 'No especificado' }}
          </p>
        </div>

        <!-- Hora de entrevista -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-clock text-primary"></i>
            Hora
          </label>
          <p class="font-semibold text-dark m-0">
            {{ interviewTime || 'No especificado' }}
          </p>
        </div>

        <!-- Estado -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-check-circle text-primary"></i>
            Estado
          </label>
          <p class="font-semibold text-dark m-0">
            {{ status || 'No especificado' }}
          </p>
        </div>

        <!-- Observaciones -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-info-circle text-primary"></i>
            Observaciones
          </label>
          <p class="font-semibold text-dark m-0">
            {{ observations || 'No especificado' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
