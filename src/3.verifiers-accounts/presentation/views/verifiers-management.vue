<script setup>
import { ref, onMounted } from 'vue';
import DataManager from '../../../shared-v2/presentation/components/data-manager.vue';
import VerifierCreateAndEdit from "../components/verifier-create-and-edit.vue";
import useVerifierStore from "../../application/verifier.store.js";
import { useVerifierCrud } from "../composables/use-verifier-crud.js";
import { useVerifierFilters } from "../composables/use-verifier-filters.js";
import { VerifierStatus } from "../../domain/constants/verifier.constants.js";
import {
  StatusTranslations,
  StatusFilterOptions,
  StatusClassMap,
  VerifierUILabels
} from "../constants/verifier-ui.constants.js";

// Store
const verifierStore = useVerifierStore();

// Composables
const {
  createAndEditDialogIsVisible,
  isEdit,
  submitted,
  currentItem,
  onCreateItem,
  onEditItem,
  onViewItem,
  onDeleteItem,
  onDeleteSelectedItems,
  onCancelRequested,
  onSaveRequested
} = useVerifierCrud();

const {
  globalFilterValue,
  selectedStatus,
  filteredVerifiers,
  clearFilters,
  updateGlobalFilter,
  updateStatusFilter,
  getCountByStatus
} = useVerifierFilters(() => verifierStore.verifiers);

// Local state
const loading = ref(false);
const selectedItems = ref([]);

// Configuración
const statusOptions = StatusFilterOptions;
const title = VerifierUILabels.title;

// Columnas de la tabla
const columns = [
  { field: 'name', header: 'Nombres', sortable: true, style: 'width: 160px;' },
  { field: 'lastName', header: 'Apellidos', sortable: true, style: 'width: 160px;' },
  { field: 'emailValue', header: 'Email', sortable: true, style: 'width: 200px;' },
  { field: 'phoneValue', header: 'Teléfono', sortable: true, style: 'width: 140px;' },
  { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
];

// Métodos
function onGlobalFilterChange(value) {
  updateGlobalFilter(value);
}

function onClearFilters() {
  clearFilters();
}

function getStatusClass(status) {
  return StatusClassMap[status] || 'status-default';
}

function getStatusItemsArray(status) {
  switch (status) {
    case VerifierStatus.ACTIVE:
      return 'success';
    case VerifierStatus.INACTIVE:
      return 'danger';
    default:
      return 'info';
  }
}

async function getAllVerifiers() {
  loading.value = true;
  try {
    await verifierStore.fetchAll();
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(async () => {
  await getAllVerifiers();
});
</script>

<template>
  <div class="h-full flex flex-column gap-3">
    <data-manager
      :items="verifierStore.verifiers"
      :filtered-items="filteredVerifiers"
      :global-filter-value="globalFilterValue"
      :columns="columns"
      :title="title"
      :loading="loading"
      :dynamic="true"
      :show-new="true"
      :show-delete="true"
      :show-export="true"
      :show-selection="true"
      :show-actions="true"
      :show-action-buttons="true"
      :show-view-action="true"
      :show-edit-action="true"
      :show-delete-action="true"
      :view-action-icon-only="true"
      :rows="10"
      :rows-per-page-options="[10, 20, 30, 50]"
      new-button-label="Nuevo Verificador"
      delete-button-label="Eliminar"
      export-button-label="Exportar"
      search-placeholder="Busca por nombre, apellido, email o teléfono..."
      @new-item-requested-manager="onCreateItem"
      @delete-selected-items-requested-manager="onDeleteSelectedItems"
      @delete-item-requested-manager="onDeleteItem"
      @view-item-requested-manager="onViewItem"
      @edit-item-requested-manager="onEditItem"
      @global-filter-change="onGlobalFilterChange"
      @clear-filters="onClearFilters"
    >
      <template #status="slotProps">
        <pv-tag
          :value="StatusTranslations[slotProps.data.status]"
          :severity="getStatusItemsArray(slotProps.data.status)"
          :class="getStatusClass(slotProps.data.status)"
        />
      </template>
    </data-manager>

    <!-- Diálogo de Crear/Editar -->
    <verifier-create-and-edit
      v-model:visible="createAndEditDialogIsVisible"
      :verifier="currentItem"
      :is-edit="isEdit"
      @save="onSaveRequested"
      @cancel="onCancelRequested"
    />
  </div>
</template>

<style scoped>
.status-activo {
  background-color: var(--green-100);
  color: var(--green-800);
}

.status-inactivo {
  background-color: var(--red-100);
  color: var(--red-800);
}
</style>
