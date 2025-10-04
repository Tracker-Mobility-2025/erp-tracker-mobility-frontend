<script>

export default {
  name: 'details-the-interview-with-the-landlord-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        tenantName: 'Alfonso Eloy Sanchez Vela',
        ownHouse: '-',
        serviceClientPays: '-',
        clientPaysPunctual: '-',
        clientRentalTime: '-',
        clientFloorNumber: '-'
      })
    },
  },

};

</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-comments text-white"></i>
        Detalles de la entrevista
      </h3>
    </template>
    <template #content>
      
      <div class="formgrid grid">
        <!-- Primera fila -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user"></i>
            Nombre del inquilino:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.tenantName || '-' }}
          </p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-home"></i>
            Casa propia
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.ownHouse || '-' }}
          </p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-dollar"></i>
            Servicio que paga el cliente
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.serviceClientPays || '-' }}
          </p>
        </div>
        
        <!-- Segunda fila -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-check-circle"></i>
            ¿El cliente paga puntual?
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.clientPaysPunctual || '-' }}
          </p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-clock"></i>
            Tiempo de arrendamiento del cliente:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.clientRentalTime || '-' }}
          </p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-building"></i>
            Nro de piso en el que habita el cliente:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.clientFloorNumber || '-' }}
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