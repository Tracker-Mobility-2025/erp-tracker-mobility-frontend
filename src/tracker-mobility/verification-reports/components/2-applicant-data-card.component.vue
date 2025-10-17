<script>
export default {

  name: 'applicant-data-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        businessName: 'MOTOS MILLENNIUM SAC',
        ruc: '20605680446',
        requestDate: '20/08/2025'
      })
    },
  }

};

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
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-building text-primary"></i>
            Razón social
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.businessName || 'No especificado' }}
          </p>
        </div>
        
        <!-- RUC -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-id-card text-primary"></i>
            RUC
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.ruc || 'No especificado' }}
          </p>
        </div>
        <!-- Nombre del ejecutivo -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Nombre del ejecutivo
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.executiveName || 'No especificado' }}
          </p>
        </div>
        
        <!-- Fecha de solicitud -->
        <div class="field col-12 md:col-3">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar text-primary"></i>
            Fecha de solicitud
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.requestDate || 'No especificado' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

:deep(.p-card-header) {
  background-color: #4A60D0;
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

:deep(.p-card) {
  overflow: hidden;
  border-radius: 0.375rem;
}
</style>