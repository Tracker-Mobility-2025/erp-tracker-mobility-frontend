<script setup>
import { computed, watchEffect } from 'vue';

// Props
const props = defineProps({
  verifier: {
    type: String,
    default: ''
  },
  addressLocation: {
    type: String,
    default: ''
  },
  visitDate: {
    type: String,
    default: ''
  },
  result: {
    type: String,
    default: ''
  }
});

// Computed
const isValidMapLink = computed(() => {
  return props.addressLocation && props.addressLocation.trim().length > 0;
});

const displayAddress = computed(() => {
  return props.addressLocation || 'Sin ubicación';
});

// Debug: ver qué valor llega
watchEffect(() => {
  console.log('addressLocation value:', props.addressLocation);
  console.log('isValidMapLink:', isValidMapLink.value);
});

const formattedResult = computed(() => {
  const resultMap = {
    'CONFORME': 'Conforme',
    'OBSERVADO': 'Observado',
    'RECHAZADO': 'Rechazado',
    'ENTREVISTA_ARRENDADOR_FALTANTE': 'Entrevista Arrendador',
    'PENDIENTE': 'Pendiente'
  };
  return resultMap[props.result?.toUpperCase()] || props.result || 'Sin resultado';
});

const resultClass = computed(() => {
  const result = props.result?.toUpperCase();
  const classMap = {
    'CONFORME': 'status-conforme',
    'OBSERVADO': 'status-observado',
    'RECHAZADO': 'status-rechazado',
    'ENTREVISTA_ARRENDADOR_FALTANTE': 'status-entrevista-arrendador-faltante',
    'PENDIENTE': 'status-pendiente'
  };
  return classMap[result] || 'status-default';
});
</script>

<template>
  <pv-card class="w-full verification-info-card">
    <template #header>
      <h3 class="card-header-verification flex align-items-center gap-2 text-white p-3 m-0 font-bold text-lg">
        <i class="pi pi-check-circle"></i>
        Información de Verificación
      </h3>
    </template>
    
    <template #content>
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <div class="h-full flex flex-column p-3 border-round border-2 border-purple-300 bg-purple-50" style="min-height: 90px;">
            <p class="text-xs text-600 font-semibold m-0 mb-1">
              <i class="pi pi-user mr-1"></i>
              Verificador
            </p>
            <p class="text-base font-bold text-900 m-0">
              {{ verifier || 'Sin asignar' }}
            </p>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="h-full flex flex-column p-3 border-round border-2 border-blue-300 bg-blue-50" style="min-height: 90px;">
            <p class="text-xs text-600 font-semibold m-0 mb-1">
              <i class="pi pi-map-marker mr-1"></i>
              Ubicación: Enlace Google Maps
            </p>
            <a v-if="isValidMapLink" 
               :href="addressLocation" 
               target="_blank" 
               rel="noopener noreferrer"
               class="inline-flex align-items-center gap-2 text-base font-bold text-blue-600 hover:text-blue-800"
               style="cursor: pointer; text-decoration: none;">
              <i class="pi pi-external-link"></i>
              <span>Ver Ubicación</span>
            </a>
            <p v-else class="text-base font-bold text-900 m-0">
              Sin ubicación
            </p>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="h-full flex flex-column p-3 border-round border-2 border-green-300 bg-green-50" style="min-height: 90px;">
            <p class="text-xs text-600 font-semibold m-0 mb-1">
              <i class="pi pi-calendar mr-1"></i>
              Fecha de Visita
            </p>
            <p class="text-base font-bold text-900 m-0">
              {{ visitDate || 'Sin fecha' }}
            </p>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="p-3 border-round border-2 border-orange-300 bg-orange-50">
            <p class="text-xs text-600 font-semibold m-0 mb-1">
              <i class="pi pi-flag mr-1"></i>
              Resultado
            </p>
            <span :class="['status-tag', resultClass]">
              {{ formattedResult }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
</style>
