<script setup>
import { computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';
import {
  ObservationStatusTranslations,
  ObservationStatusColors,
  ObservationStatusIcons,
  ObservationTypeTranslations,
  ObservationTypeIcons,
  ObservationStatus
} from '../../domain/constants/observation.constants.js';

// Props
const props = defineProps({
  observations: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['resolve', 'reject', 'reopen', 'delete']);

// Composables
const confirm = useConfirm();

// Computed
const sortedObservations = computed(() => {
  return [...props.observations].sort((a, b) => {
    return new Date(b.createdDate) - new Date(a.createdDate);
  });
});

// Métodos
function getStatusLabel(status) {
  return ObservationStatusTranslations[status] || status;
}

function getStatusColor(status) {
  return ObservationStatusColors[status] || 'secondary';
}

function getStatusIcon(status) {
  return ObservationStatusIcons[status] || 'pi pi-circle';
}

function getTypeLabel(type) {
  return ObservationTypeTranslations[type] || type;
}

function getTypeIcon(type) {
  return ObservationTypeIcons[type] || 'pi pi-info-circle';
}

function onResolve(observation) {
  confirm.require({
    message: '¿Está seguro de marcar esta observación como subsanada?',
    header: 'Confirmar Subsanación',
    icon: 'pi pi-check-circle',
    acceptLabel: 'Sí, subsanar',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-success',
    accept: () => {
      emit('resolve', observation);
    }
  });
}

function onReject(observation) {
  confirm.require({
    message: '¿Está seguro de rechazar esta observación?',
    header: 'Confirmar Rechazo',
    icon: 'pi pi-times-circle',
    acceptLabel: 'Sí, rechazar',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: () => {
      emit('reject', observation);
    }
  });
}

function onReopen(observation) {
  confirm.require({
    message: '¿Está seguro de reabrir esta observación?',
    header: 'Confirmar Reapertura',
    icon: 'pi pi-refresh',
    acceptLabel: 'Sí, reabrir',
    rejectLabel: 'Cancelar',
    accept: () => {
      emit('reopen', observation);
    }
  });
}

function onDelete(observation) {
  confirm.require({
    message: `¿Está seguro de eliminar esta observación?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: () => {
      emit('delete', observation);
    }
  });
}
</script>

<template>
  <div class="observations-list">
    <DataTable
      :value="sortedObservations"
      :loading="loading"
      responsiveLayout="scroll"
      :emptyMessage="'No hay observaciones registradas'"
      stripedRows
      class="p-datatable-sm"
    >
      <!-- Tipo -->
      <Column field="observationType" header="Tipo" :sortable="true" style="width: 180px">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <i :class="getTypeIcon(data.observationType)" class="text-primary"></i>
            <span>{{ getTypeLabel(data.observationType) }}</span>
          </div>
        </template>
      </Column>

      <!-- Descripción -->
      <Column field="description" header="Descripción" :sortable="false">
        <template #body="{ data }">
          <div class="observation-description">
            {{ data.description }}
          </div>
        </template>
      </Column>

      <!-- Estado -->
      <Column field="status" header="Estado" :sortable="true" style="width: 150px">
        <template #body="{ data }">
          <Tag
            :value="getStatusLabel(data.status)"
            :severity="getStatusColor(data.status)"
            :icon="getStatusIcon(data.status)"
          />
        </template>
      </Column>

      <!-- Fecha de creación -->
      <Column field="createdDate" header="Creada" :sortable="true" style="width: 120px">
        <template #body="{ data }">
          {{ new Date(data.createdDate).toLocaleDateString('es-PE') }}
        </template>
      </Column>

      <!-- Días transcurridos -->
      <Column header="Días" :sortable="false" style="width: 80px">
        <template #body="{ data }">
          <Tag :value="`${data.daysSinceCreated}d`" severity="info" />
        </template>
      </Column>

      <!-- Acciones -->
      <Column v-if="!readonly" header="Acciones" style="width: 200px">
        <template #body="{ data }">
          <div class="flex gap-1">
            <!-- Subsanar -->
            <Button
              v-if="data.canBeResolved"
              icon="pi pi-check"
              class="p-button-success p-button-sm"
              v-tooltip.top="'Subsanar'"
              @click="onResolve(data)"
            />

            <!-- Rechazar -->
            <Button
              v-if="data.canBeResolved"
              icon="pi pi-times"
              class="p-button-danger p-button-sm"
              v-tooltip.top="'Rechazar'"
              @click="onReject(data)"
            />

            <!-- Reabrir -->
            <Button
              v-if="data.canBeReopened"
              icon="pi pi-refresh"
              class="p-button-warning p-button-sm"
              v-tooltip.top="'Reabrir'"
              @click="onReopen(data)"
            />

            <!-- Eliminar -->
            <Button
              v-if="data.isPending"
              icon="pi pi-trash"
              class="p-button-danger p-button-sm p-button-outlined"
              v-tooltip.top="'Eliminar'"
              @click="onDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.observations-list {
  width: 100%;
}

.observation-description {
  max-width: 400px;
  word-wrap: break-word;
  white-space: normal;
}

:deep(.p-datatable-sm .p-datatable-tbody > tr > td) {
  padding: 0.5rem;
}
</style>
