<script>
export default {
  name: 'request-location-details',

  props: {
    location: {
      type: Object,
      required: false,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    },
    observationType: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      localLocation: null
    }
  },

  computed: {
    // Verificar si el campo de ubicación es editable
    isMapLocationEditable() {
      if (!this.editMode) return false;
      if (!this.observationType) return false;
      // Solo editable si la observación es sobre ubicación incorrecta
      return this.observationType === 'UBICACION_INCORRECTA';
    }
  },

  watch: {
    location: {
      handler(newValue) {
        if (newValue) {
          this.localLocation = { ...newValue };
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2" :style="isMapLocationEditable ? 'background-color: #d97706; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;' : 'background-color: #4A60D0; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;'">
        <i class="pi pi-map-marker" style="color: white;"></i>
        <span class="text-lg font-bold">Datos de domicilio</span>
        <pv-badge v-if="isMapLocationEditable" value="EDITABLE" severity="warning" class="ml-auto" style="opacity: 0.85;" />
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
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map-marker text-primary"></i>
            Ubicación en Google Maps
          </label>

          <!-- Modo edición - Solo si la observación es UBICACION_INCORRECTA -->
          <div v-if="editMode && isMapLocationEditable">
            <pv-input-text
              v-model="localLocation.mapLocation"
              class="w-full"
              placeholder="Ingrese el enlace de Google Maps"
            />
            <small class="text-color-secondary">Pegue aquí el enlace completo de Google Maps</small>
          </div>

          <!-- Modo solo lectura -->
          <div v-else-if="location?.mapLocation">
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
          <p v-else class="font-semibold text-dark m-0">No disponible</p>
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

