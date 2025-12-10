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
      localLandlord: null
    }
  },

  computed: {
    // Verificar si los campos del arrendador son editables
    isLandlordEditable() {
      if (!this.editMode) return false;
      if (!this.observationType) return false;
      // Solo editable si la observación es sobre datos del arrendador incompletos
      return this.observationType === 'DATOS_ARRENDADOR_INCOMPLETOS';
    }
  },

  watch: {
    landlord: {
      handler(newValue) {
        if (newValue) {
          this.localLandlord = { ...newValue };
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<template>
  <pv-card class="w-full" v-if="isTenant">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2" :style="isLandlordEditable ? 'background-color: #d97706; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;' : 'background-color: #4A60D0; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;'">
        <i class="pi pi-home" style="color: white;"></i>
        <span class="text-lg font-bold">Datos del arrendador</span>
        <pv-badge v-if="isLandlordEditable" value="EDITABLE" severity="warning" class="ml-auto" style="opacity: 0.85;" />
      </div>
    </template>
    <template #content>
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Nombre completo
          </label>
          <pv-input-text
            v-if="isLandlordEditable"
            v-model="localLandlord.fullName"
            class="w-full"
            placeholder="Ingrese nombre completo"
          />
          <p v-else class="font-semibold text-dark m-0">{{ landlord?.fullName || 'No disponible' }}</p>
        </div>
        <div class="field col-12 md:col-6">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-phone text-primary"></i>
            Teléfono de contacto
          </label>
          <pv-input-text
            v-if="isLandlordEditable"
            v-model="localLandlord.phoneNumber"
            class="w-full"
            placeholder="Ingrese teléfono"
          />
          <p v-else class="font-semibold text-dark m-0">{{ landlord?.phoneNumber || 'No disponible' }}</p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

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

.card-header {
  background-color: #4A60D0 !important;
  color: white !important;
}
</style>
