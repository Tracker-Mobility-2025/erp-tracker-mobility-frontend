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
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-home text-white"></i>
        Domicilio del cliente
      </h3>
    </template>
    <template #content>
      
      <div class="formgrid grid">
        <!-- Fila 1: Departamento, Provincia, Distrito y un campo adicional (si se agrega en el futuro) -->
        <!-- Departamento -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Departamento:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.department || 'No especificado' }}
          </p>
        </div>
        
        <!-- Provincia -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Provincia:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.province || 'No especificado' }}
          </p>
        </div>
        
        <!-- Distrito -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Distrito:
          </label>
          <p class="font-semibold text-dark m-0">
            {{ item?.district || 'No especificado' }}
          </p>
        </div>
        
        <!-- Cuarta columna: Dirección completa -->
        <div class="field col-12 md:col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map-marker text-primary"></i>
            Dirección completa:
          </label>
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