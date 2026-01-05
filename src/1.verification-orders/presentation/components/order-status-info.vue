<script setup>
import { computed } from 'vue';
import Tag from 'primevue/tag';
import { StatusColors, StatusIcons } from '../verification-order-ui.constants.js';
import { OrderStatusTranslations } from '../../domain/constants/verification-order.constants.js';

// Props
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

// Computed
const statusColor = computed(() => {
  return StatusColors[props.order.status] || 'secondary';
});

const statusLabel = computed(() => {
  return OrderStatusTranslations[props.order.status] || props.order.status;
});

const statusIcon = computed(() => {
  return StatusIcons[props.order.status] || 'pi pi-circle';
});

const hasVerifier = computed(() => {
  return props.order.verifierId !== null && props.order.verifierId !== undefined;
});

const verifierInfo = computed(() => {
  if (!hasVerifier.value) return null;
  
  return {
    name: props.order.homeVisitDetails?.verifierName || 'Verificador asignado',
    date: props.order.visitDate ? new Date(props.order.visitDate).toLocaleDateString('es-PE') : null,
    time: props.order.homeVisitDetails?.visitTime || null
  };
});
</script>

<template>
  <div class="order-status-info">
    <!-- Estado principal -->
    <div class="status-badge mb-2">
      <Tag 
        :value="statusLabel" 
        :severity="statusColor"
        :icon="statusIcon"
      />
    </div>

    <!-- Información de verificador (si está asignado) -->
    <div v-if="hasVerifier && verifierInfo" class="verifier-info text-sm">
      <div class="flex align-items-center gap-2 text-color-secondary">
        <i class="pi pi-user text-xs"></i>
        <span>{{ verifierInfo.name }}</span>
      </div>
      
      <div v-if="verifierInfo.date" class="flex align-items-center gap-2 text-color-secondary mt-1">
        <i class="pi pi-calendar text-xs"></i>
        <span>{{ verifierInfo.date }}</span>
        <span v-if="verifierInfo.time" class="ml-1">{{ verifierInfo.time }}</span>
      </div>
    </div>

    <!-- Indicador de pendiente -->
    <div v-else-if="order.isPending" class="pending-info text-sm">
      <div class="flex align-items-center gap-2 text-color-secondary">
        <i class="pi pi-clock text-xs"></i>
        <span>Sin asignar</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-status-info {
  display: flex;
  flex-direction: column;
}

.status-badge {
  display: inline-block;
}

.verifier-info,
.pending-info {
  margin-top: 0.5rem;
}

.text-xs {
  font-size: 0.75rem;
}
</style>
