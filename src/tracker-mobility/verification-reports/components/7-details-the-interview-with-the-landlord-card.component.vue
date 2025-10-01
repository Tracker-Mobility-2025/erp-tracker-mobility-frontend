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
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary">Detalles de la entrevista</h3>
      
      <div class="formgrid grid">
        <!-- Primera fila -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Nombre del inquilino:</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.tenantName || '-' }}
          </p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Casa propia</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.ownHouse || '-' }}
          </p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Servicio que paga el cliente</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.serviceClientPays || '-' }}
          </p>
        </div>
        
        <!-- Segunda fila -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">¿El cliente paga puntual?</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.clientPaysPunctual || '-' }}
          </p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Tiempo de arrendamiento del cliente:</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.clientRentalTime || '-' }}
          </p>
        </div>
        
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Nro de piso en el que habita el cliente:</label>
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
</style>