<script>

export default {
  name: 'customer-address-card',

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        department: 'Lima',
        province: 'Lima',
        district: 'Santa Anita',
        fullAddress: 'Asociación la pradera de Santa Anita - ref. Reparto mz k lt 46 - Santa Anita'
      })
    },
  },
}

</script>

<template>
  <pv-card class="w-full">
    <template #content>
      <h3 class="text-lg font-bold mb-4 text-primary">Domicilio del cliente:</h3>
      
      <div class="formgrid grid">
        <!-- Departamento -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Departamento:</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.department || 'No especificado' }}
          </p>
        </div>
        
        <!-- Provincia -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Provincia:</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.province || 'No especificado' }}
          </p>
        </div>
        
        <!-- Distrito -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary">Distrito:</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.district || 'No especificado' }}
          </p>
        </div>
        
        <!-- Dirección completa -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary">Dirección completa:</label>
          <p class="font-semibold text-dark m-0">
            {{ item?.fullAddress || 'No especificado' }}
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