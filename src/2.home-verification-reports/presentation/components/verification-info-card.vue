<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  verifier: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  province: {
    type: String,
    default: ''
  },
  department: {
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
const formattedAddress = computed(() => {
  const parts = [
    props.address,
    props.district,
    props.province,
    props.department
  ].filter(Boolean);
  return parts.join(', ') || 'Sin dirección';
});

const formattedResult = computed(() => {
  const resultMap = {
    'CONFORME': 'Conforme',
    'OBSERVADO': 'Observado',
    'RECHAZADO': 'Rechazado',
    'ENTREVISTA_ARRENDADOR_FALTANTE': 'Ent. Arrendador Faltante',
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
          <div class="p-3 border-round border-2 border-purple-300 bg-purple-50">
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
          <div class="p-3 border-round border-2 border-blue-300 bg-blue-50">
            <p class="text-xs text-600 font-semibold m-0 mb-1">
              <i class="pi pi-map-marker mr-1"></i>
              Ubicación
            </p>
            <p class="text-base font-bold text-900 m-0">
              {{ formattedAddress }}
            </p>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="p-3 border-round border-2 border-green-300 bg-green-50">
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
