<script setup>
const props = defineProps({
  fullName: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  relationship: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-user-plus text-white"></i>
        Datos del arrendador/propietario
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

        <!-- Teléfono -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-phone text-primary"></i>
            Teléfono
          </label>
          <p class="font-semibold text-dark m-0">
            {{ phoneNumber || 'No especificado' }}
          </p>
        </div>

        <!-- Relación con el candidato -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-users text-primary"></i>
            Relación con candidato
          </label>
          <p class="font-semibold text-dark m-0">
            {{ relationship || 'No especificado' }}
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>
