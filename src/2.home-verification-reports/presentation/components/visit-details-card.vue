<script setup>
import { computed } from 'vue';

const props = defineProps({
  verifier: {
    type: String,
    default: ''
  },
  googleMapsLink: {
    type: String,
    default: ''
  },
  verificationDate: {
    type: String,
    default: ''
  },
  result: {
    type: String,
    default: 'Pendiente'
  }
});

// Computed
const resultClass = computed(() => {
  const result = props.result?.toLowerCase();
  return {
    'text-green-700 bg-green-100': result === 'conforme',
    'text-yellow-700 bg-yellow-100': result === 'observado',
    'text-red-700 bg-red-100': result === 'rechazado',
    'text-blue-700 bg-blue-100': result === 'pendiente',
    'text-purple-700 bg-purple-100': result === 'ent faltante'
  };
});

const formattedResult = computed(() => {
  if (props.result === 'ENTREVISTA_ARRENDADOR_FALTANTE') {
    return 'ENT FALTANTE';
  }
  return props.result;
});

// Methods
const openGoogleMaps = () => {
  if (props.googleMapsLink) {
    window.open(props.googleMapsLink, '_blank');
  }
};
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-map-marker text-white"></i>
        Detalles de la visita
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Verificador -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            Verificador
          </label>
          <p class="font-semibold text-dark m-0">
            {{ verifier || 'No especificado' }}
          </p>
        </div>

        <!-- Ubicación Google Maps -->
        <div class="field col-12 md:col-4">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-map text-primary"></i>
            Ubicación
          </label>
          <pv-button 
            v-if="googleMapsLink"
            label="Ver en Google Maps"
            icon="pi pi-external-link"
            class="p-button-sm p-button-outlined"
            @click="openGoogleMaps"
          />
          <p v-else class="font-semibold text-dark m-0">No disponible</p>
        </div>

        <!-- Fecha de verificación -->
        <div class="field col-12 md:col-2">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-calendar text-primary"></i>
            Fecha
          </label>
          <p class="font-semibold text-dark m-0">
            {{ verificationDate || 'No especificado' }}
          </p>
        </div>

        <!-- Resultado -->
        <div class="field col-12 md:col-2">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-check-circle text-primary"></i>
            Resultado
          </label>
          <pv-tag 
            :class="resultClass"
            :value="formattedResult"
            class="font-bold"
          />
        </div>
      </div>
    </template>
  </pv-card>
</template>
