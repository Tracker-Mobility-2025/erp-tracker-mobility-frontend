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
        requestDate: '20/08/2025',
        result: 'OBSERVADO'
      })
    },
  },

  computed: {
    resultClass() {
      const result = this.item?.result?.toLowerCase();
      return {
        'text-green-700 bg-green-100': result === 'conforme',
        'text-yellow-700 bg-yellow-100': result === 'observado',
        'text-red-700 bg-red-100': result === 'rechazado',
        'text-blue-700 bg-blue-100': result === 'pendiente'
      };
    }
  }

};

</script>

<template>
  <pv-card class="w-full">
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary flex align-items-center gap-2">
        <i class="pi pi-briefcase"></i>
        Datos del solicitante
      </h3>
      
      <div class="formgrid grid">
        <!-- Razón social -->
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-building text-primary"></i>
            Razón social
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.businessName || 'No especificado' }}
          </p>
        </div>
        
        <!-- RUC -->
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-id-card text-primary"></i>
            RUC
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.ruc || 'No especificado' }}
          </p>
        </div>
        
        <!-- Fecha de solicitud -->
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar text-primary"></i>
            Fecha de solicitud
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.requestDate || 'No especificado' }}
          </p>
        </div>
        
        <!-- Resultado -->
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-check-circle text-primary"></i>
            Resultado
          </label>
          <p class="font-semibold text-dark m-0">
            <span 
              :class="[resultClass, 'px-2 py-1 border-round text-sm font-semibold']"
            >
              {{ item?.result || 'No especificado' }}
            </span>
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
</style>