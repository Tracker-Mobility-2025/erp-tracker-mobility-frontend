<script setup>
const props = defineProps({
  // Ubicación
  department: {
    type: String,
    default: ''
  },
  province: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  // Direcciones
  fullAddress: {
    type: String,
    default: ''
  },
  verifiedAddress: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="address-info-card w-full">
    <template #header>
      <h3 class="card-header-address flex align-items-center gap-2 text-white p-3 m-0 font-bold text-lg">
        <i class="pi pi-map-marker"></i>
        Domicilio del Cliente
      </h3>
    </template>
    
    <template #content>
      <!-- Departamento, Provincia, Distrito -->
      <div class="grid mb-4">
        <div class="col-12 md:col-4">
          <div class="p-3 border-round border-2 border-pink-300 bg-pink-50">
            <p class="text-xs text-600 font-semibold m-0 mb-1">Departamento</p>
            <p class="text-base font-bold text-900 m-0">{{ department || 'No especificado' }}</p>
          </div>
        </div>
        <div class="col-12 md:col-4">
          <div class="p-3 border-round border-2 border-orange-300 bg-orange-50">
            <p class="text-xs text-600 font-semibold m-0 mb-1">Provincia</p>
            <p class="text-base font-bold text-900 m-0">{{ province || 'No especificado' }}</p>
          </div>
        </div>
        <div class="col-12 md:col-4">
          <div class="p-3 border-round border-2 border-yellow-300 bg-yellow-50">
            <p class="text-xs text-600 font-semibold m-0 mb-1">Distrito</p>
            <p class="text-base font-bold text-900 m-0">{{ district || 'No especificado' }}</p>
          </div>
        </div>
      </div>

      <!-- Dirección Completa -->
      <div class="p-3 mb-3 border-round border-1 surface-border bg-surface-50">
        <div class="flex align-items-center gap-2 mb-2">
          <i class="pi pi-home text-600"></i>
          <span class="text-sm font-semibold text-600">Dirección Completa</span>
        </div>
        <p class="text-base font-bold text-900 m-0">
          {{ fullAddress || 'No especificada' }}
        </p>
      </div>

      <!-- Dirección Real Verificada -->
      <div class="p-3 border-round border-1 border-primary bg-blue-50">
        <div class="flex align-items-center gap-2 mb-2">
          <i class="pi pi-map-marker text-primary"></i>
          <span class="text-sm font-semibold text-primary">Dirección Real Verificada</span>
        </div>
        <p class="text-base font-bold text-primary m-0">
          {{ verifiedAddress || 'No especificada' }}
        </p>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>

</style>
