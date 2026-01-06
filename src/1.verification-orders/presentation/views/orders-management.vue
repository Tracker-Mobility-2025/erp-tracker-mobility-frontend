<script setup>
import { ref, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toolbar from '../../../shared-v2/presentation/components/toolbar.vue';
import DataManager from '../../../shared-v2/presentation/components/data-manager.vue';
import AssignVerifierDialog from '../components/assign-verifier-dialog.vue';
import useVerificationOrderStore from '../../application/verification-order.store.js';
import { useVerificationOrderCrud } from '../composables/use-verification-order-crud.js';
import { useVerifierAssignment } from '../composables/use-verifier-assignment.js';
import { useVerificationOrderFilters } from '../composables/use-verification-order-filters.js';
import { 
  UILabels, 
  TableColumns, 
  StatusColors,
  StatusIcons,
  StatusFilterOptions,
  DataManagerActions,
  OrderStatusTranslations
} from '../constants/verification-order-ui.constants.js';

// Store y composables
const store = useVerificationOrderStore();
const confirm = useConfirm();
const crud = useVerificationOrderCrud();
const verifierAssignment = useVerifierAssignment();

const {
  globalFilterValue,
  selectedStatus,
  dateRange,
  filteredOrders,
  clearFilters,
  updateGlobalFilter,
  updateStatusFilter,
  updateDateRangeFilter,
  getCountByStatus
} = useVerificationOrderFilters(() => store.orderSummaries);

// Estados locales
const loading = ref(false);
const assignDialogVisible = ref(false);
const selectedOrderForAssign = ref(null);

// Configuración
const statusOptions = StatusFilterOptions;
const title = { singular: UILabels.singular, plural: UILabels.title };

// Métodos
function onGlobalFilterChange(value) {
  updateGlobalFilter(value);
}

function onClearFilters() {
  clearFilters();
}

function getStatusClass(status) {
  return StatusColors[status] || 'secondary';
}

function getStatusSeverity(status) {
  return StatusColors[status] || 'secondary';
}

function getStatusLabel(status) {
  return OrderStatusTranslations[status] || status;
}

function onView(order) {
  crud.onViewItem(order);
}

function onAssignVerifier(order) {
  verifierAssignment.openAssignDialog(order);
}

async function onVerifierAssigned(assignmentData) {
  const success = await verifierAssignment.assignVerifier(assignmentData);
  if (success) {
    await getAllOrders();
  }
}

function onDelete(order) {
  confirm.require({
    message: `¿Está seguro de eliminar la orden ${order.orderCode}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'Cancelar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await crud.onDeleteItem(order);
      await getAllOrders();
    }
  });
}

async function getAllOrders() {
  loading.value = true;
  try {
    await store.fetchAllSummaries();
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(async () => {
  await getAllOrders();
});
</script>

<template>
  <div class="h-full w-full flex flex-column">
    
    <toolbar 
      :title="UILabels.MODULE_TITLE" 
      :description="'Gestión y seguimiento de órdenes de verificación'" 
      :show-back-button="false"
    />

    <div class="flex-1 p-4 overflow-auto">
      <div>
        <data-manager
          :items="store.orderSummaries"
          :filtered-items="filteredOrders"
          :global-filter-value="globalFilterValue"
          :columns="TableColumns"
          :title="title"
          :loading="loading"
          :dynamic="true"
          :show-new="false"
          :show-delete="false"
          :show-export="false"
          :show-selection="false"
          :show-actions="true"
          :show-action-buttons="true"
          :show-view-action="true"
          :show-edit-action="false"
          :show-delete-action="false"
          :view-action-icon-only="true"
          :rows="10"
          :rows-per-page-options="[5, 10, 20, 50]"
          search-placeholder="Buscar por código, cliente, empresa o verificador..."
          @view-item-requested-manager="onView"
          @global-filter-change="onGlobalFilterChange"
          @clear-filters="onClearFilters"
        >
          <!-- Filtros personalizados -->
          <template #filters="{ clearFilters }">
            <pv-dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="Filtrar por estado"
              class="w-full md:w-auto"
              @change="updateStatusFilter(selectedStatus)"
            />
            
            <pv-calendar
              v-model="dateRange"
              selection-mode="range"
              :manual-input="false"
              date-format="dd/mm/yy"
              placeholder="Filtrar por fecha"
              class="w-full md:w-auto"
              show-icon
              @update:model-value="updateDateRangeFilter(dateRange)"
            />
            
            <pv-button
              label="Limpiar filtros"
              icon="pi pi-filter-slash"
              class="p-button-secondary p-button-outlined w-full md:w-auto"
              @click="onClearFilters"
            />
          </template>

          <!-- Status Column Template -->
          <template #status="slotProps">
            <pv-tag 
              :value="getStatusLabel(slotProps.data.status)" 
              :severity="getStatusSeverity(slotProps.data.status)"
              :icon="StatusIcons[slotProps.data.status]"
              :class="getStatusClass(slotProps.data.status)"
            />
          </template>

          <!-- Visit Date Column Template -->
          <template #visitDate="slotProps">
            <span v-if="slotProps.data.visitDate">
              {{ new Date(slotProps.data.visitDate).toLocaleDateString('es-PE') }}
            </span>
            <span v-else class="text-color-secondary">Sin asignar</span>
          </template>

          <!-- Request Date Column Template -->
          <template #requestDate="slotProps">
            {{ new Date(slotProps.data.requestDate).toLocaleDateString('es-PE') }}
          </template>

          <!-- Actions Column -->
          <template #actions="slotProps">
            <div class="flex gap-2">
              <pv-button
                :icon="DataManagerActions.view.icon"
                :class="DataManagerActions.view.class"
                v-tooltip.top="DataManagerActions.view.label"
                @click="onView(slotProps.data)"
              />
              
              <pv-button
                v-if="slotProps.data.isPending"
                :icon="DataManagerActions.assignVerifier.icon"
                :class="DataManagerActions.assignVerifier.class"
                v-tooltip.top="DataManagerActions.assignVerifier.label"
                @click="onAssignVerifier(slotProps.data)"
              />
              
              <pv-button
                :icon="DataManagerActions.delete.icon"
                :class="DataManagerActions.delete.class"
                v-tooltip.top="DataManagerActions.delete.label"
                @click="onDelete(slotProps.data)"
              />
            </div>
          </template>
        </data-manager>
      </div>
    </div>

    <!-- Assign Verifier Dialog -->
    <AssignVerifierDialog
      v-model:visible="assignDialogVisible"
      :order="selectedOrderForAssign"
      @assigned="onVerifierAssigned"
    />

    <!-- Confirm Dialog -->
    <pv-confirm-dialog />
  </div>
</template>

<style scoped>
.verification-orders-management {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .verification-orders-management {
    padding: 1rem;
  }
}
</style>
