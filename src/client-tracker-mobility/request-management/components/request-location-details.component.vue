<script>
export default {
  name: 'request-location-details',

  props: {
    location: {
      type: Object,
      required: false,
      default: null
    }
  }
}
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2" style="background-color: #4A60D0; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;">
        <i class="pi pi-map-marker" style="color: white;"></i>
        <span class="text-lg font-bold">Datos de domicilio</span>
      </div>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Fila 1: Departamento, Provincia y Distrito -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Departamento
          </label>
          <p class="font-semibold text-dark m-0">{{ location?.department || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Provincia
          </label>
          <p class="font-semibold text-dark m-0">{{ location?.province || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Distrito
          </label>
          <p class="font-semibold text-dark m-0">{{ location?.district || 'No disponible' }}</p>
        </div>

        <!-- Fila 2: Dirección de domicilio -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-home text-primary"></i>
            Dirección de domicilio
          </label>
          <p class="font-semibold text-dark m-0">{{ location?.homeAddress || 'No disponible' }}</p>
        </div>

        <!-- Fila 3: Ubicación en Google Maps -->
        <div class="field col-12" v-if="location?.mapLocation">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map-marker text-primary"></i>
            Ubicación en Google Maps
          </label>
          <p class="text-color m-0">
            <a
                :href="location.mapLocation"
                target="_blank"
                class="text-primary no-underline hover:underline flex align-items-center gap-2"
            >
              <i class="pi pi-external-link text-sm"></i>
              {{ location.mapLocation }}
            </a>
          </p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card) {
  border-radius: 6px !important;
  overflow: hidden !important;
}

:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  padding: 0 !important;
  border-bottom: none !important;
}

:deep(.p-card-content) {
  padding: 0.5rem;
}

.card-header {
  background-color: #4A60D0 !important;
  color: white !important;
}
</style>

