<script setup>
import { computed } from 'vue';
import { ObservationStatusTranslations, ObservationStatusCssClasses, ObservationTypeTranslations, ObservationTypeIcons } from '../constants/order-request-ui.constants.js';

const props = defineProps({
  observations: {
    type: Array,
    default: () => []
  },
  canResolve: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['resolve-observation']);

const pendingObservations = computed(() => {
  return props.observations.filter(obs => obs.isPending);
});

const resolvedObservations = computed(() => {
  return props.observations.filter(obs => obs.isResolved);
});

const hasPendingObservations = computed(() => {
  return pendingObservations.value.length > 0;
});

const handleResolve = (observation) => {
  emit('resolve-observation', observation);
};
</script>

<template>
  <pv-card v-if="observations.length > 0" class="shadow-2">
    <template #header>
      <div class="flex align-items-center justify-content-between px-3 py-2">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-exclamation-circle text-orange-600"></i>
          <span class="text-lg font-bold">Observaciones</span>
          <pv-badge 
            v-if="hasPendingObservations" 
            :value="pendingObservations.length" 
            severity="warning"
          />
        </div>
      </div>
    </template>
    
    <template #content>
      <!-- Alert si hay observaciones pendientes -->
      <pv-message v-if="hasPendingObservations" severity="warn" :closable="false" class="mb-3">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-info-circle text-lg"></i>
          <span class="font-semibold">Esta orden tiene {{ pendingObservations.length }} observación(es) pendiente(s) que debe(n) ser resuelta(s).</span>
        </div>
      </pv-message>

      <div class="flex flex-column gap-3">
        <!-- Observaciones Pendientes -->
        <div v-if="pendingObservations.length > 0">
          <h3 class="text-base font-semibold text-900 mb-2 flex align-items-center gap-2">
            <i class="pi pi-clock text-orange-600"></i>
            Pendientes
          </h3>
          <div class="flex flex-column gap-2">
            <div 
              v-for="obs in pendingObservations" 
              :key="obs.id"
              class="p-3 border-round border-2 border-orange-200 bg-orange-50"
            >
              <div class="flex align-items-start justify-content-between gap-3">
                <div class="flex-1">
                  <div class="flex align-items-center gap-2 mb-2">
                    <i :class="['pi', ObservationTypeIcons[obs.observationType], 'text-orange-600']"></i>
                    <span class="font-bold text-900">{{ ObservationTypeTranslations[obs.observationType] || obs.observationType }}</span>
                    <span :class="['observation-status-tag ml-auto', ObservationStatusCssClasses[obs.status]]">
                      {{ ObservationStatusTranslations[obs.status] }}
                    </span>
                  </div>
                  
                  <p class="text-sm text-700 m-0 mb-2">{{ obs.description || 'Sin descripción' }}</p>
                  
                  <div class="flex align-items-center gap-3 text-xs text-600">
                    <span class="flex align-items-center gap-1">
                      <i class="pi pi-calendar"></i>
                      {{ obs.formattedCreatedDate || obs.createdDate }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Observaciones Resueltas -->
        <div v-if="resolvedObservations.length > 0">
          <h3 class="text-base font-semibold text-900 mb-2 flex align-items-center gap-2">
            <i class="pi pi-check-circle text-green-600"></i>
            Resueltas ({{ resolvedObservations.length }})
          </h3>
          <div class="flex flex-column gap-2">
            <div 
              v-for="obs in resolvedObservations" 
              :key="obs.id"
              class="p-3 border-round border-2 border-green-200 bg-green-50"
            >
              <div class="flex align-items-start justify-content-between gap-3">
                <div class="flex-1">
                  <div class="flex align-items-center gap-2 mb-2">
                    <i :class="['pi', ObservationTypeIcons[obs.observationType], 'text-green-600']"></i>
                    <span class="font-bold text-900">{{ ObservationTypeTranslations[obs.observationType] || obs.observationType }}</span>
                    <span :class="['observation-status-tag ml-auto', ObservationStatusCssClasses[obs.status]]">
                      {{ ObservationStatusTranslations[obs.status] }}
                    </span>
                  </div>
                  
                  <p class="text-sm text-700 m-0 mb-2">{{ obs.description || 'Sin descripción' }}</p>
                  
                  <div class="flex align-items-center gap-3 text-xs text-600">
                    <span class="flex align-items-center gap-1">
                      <i class="pi pi-calendar"></i>
                      Creada: {{ obs.formattedCreatedDate || obs.createdDate }}
                    </span>
                    <span v-if="obs.resolvedDate" class="flex align-items-center gap-1">
                      <i class="pi pi-check"></i>
                      Resuelta: {{ obs.formattedResolvedDate || obs.resolvedDate }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.observation-status-tag {
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}
</style>
