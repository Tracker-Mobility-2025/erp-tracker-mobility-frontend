<script>
export default {
  name: 'request-landlord-details',

  props: {
    landlord: {
      type: Object,
      default: null
    },
    isTenant: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <pv-card class="w-full" v-if="isTenant">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2 card-header">
        <i class="pi pi-home"></i>
        <span class="text-lg font-bold">Datos del arrendador</span>
      </div>
    </template>
    <template #content>
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Nombre completo
          </label>
          <p class="font-semibold text-dark m-0">{{ landlord?.fullName || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-phone text-primary"></i>
            Teléfono de contacto
          </label>
          <p class="font-semibold text-dark m-0">{{ landlord?.phoneNumber || 'No disponible' }}</p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

.card-header {
  background-color: #4A60D0 !important;
  color: white !important;
}

:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: var(--border-radius) !important;
  border-top-right-radius: var(--border-radius) !important;
  padding: 0 !important;
  border-bottom: none !important;
}

:deep(.p-card) {
  border-radius: var(--border-radius) !important;
  overflow: hidden !important;
}
</style>
