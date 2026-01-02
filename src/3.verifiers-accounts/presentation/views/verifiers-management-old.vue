<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '../../../shared-v2/composables/use-notification.js';
import { useConfirmDialog } from '../../../shared-v2/composables/use-confirm-dialog.js';
import VerifierCreateAndEdit from "../components/verifier-create-and-edit.vue";
import DataManager from '../../../shared-v2/presentation/components/data-manager.vue'
import useVerifierStore from "../../application/verifier.store.js";
import { CreateVerifierCommand } from "../../domain/commands/create-verifier.command.js";
import { UpdateVerifierCommand } from "../../domain/commands/update-verifier.command.js";
import { useAuthenticationStore } from "../../../tracker-mobility/security/services/authentication.store.js";
import { VerifierStatus, DefaultRole, DefaultStatus } from "../../domain/constants/verifier.constants.js";
import {
  StatusTranslations,
  StatusFilterOptions,
  StatusClassMap,
  VerifierUILabels
} from "../constants/verifier-ui.constants.js";

// Composables
const router = useRouter();
const { showSuccess, showError } = useNotification();
const { confirmDelete, confirmDeleteMultiple } = useConfirmDialog();
const verifierStore = useVerifierStore();
const authStore = useAuthenticationStore();

// State
const createItem = ref({});
const item = ref(null);
const loading = ref(false);
const createAndEditDialogIsVisible = ref(false);
const isEdit = ref(false);
const submitted = ref(false);
const globalFilterValue = ref('');
const selectedStatus = ref(null);
const selectedItems = ref([]);

// User data
const userId = computed(() => authStore.currentUserId);
const adminId = ref(null);

// Table columns configuration
const columns = [
  { field: 'name', header: 'Nombres', sortable: true, style: 'width: 160px;' },
  { field: 'lastName', header: 'Apellidos', sortable: true, style: 'width: 160px;' },
  { field: 'email', header: 'Email', sortable: true, style: 'width: 200px;' },
  { field: 'phoneNumber', header: 'Teléfono', sortable: true, style: 'width: 140px;' },
  { field: 'status', header: 'Estado', sortable: true, template: 'status', style: 'width: 120px;' },
];

// Usar constantes centralizadas
const statusOptions = StatusFilterOptions;
const title = VerifierUILabels.title;

// Computed properties
const itemsArray = computed(() => verifierStore.verifiers);

const filteredItemsArray = computed(() => {
  let filtered = [...itemsArray.value];

  // Filtro por búsqueda global
  if (globalFilterValue.value && globalFilterValue.value.trim().length > 0) {
    const searchTerm = globalFilterValue.value.toLowerCase().trim().replace(/\s+/g, ' ');
    filtered = filtered.filter(verifier =>
      (verifier.name && verifier.name.toLowerCase().includes(searchTerm)) ||
      (verifier.lastName && verifier.lastName.toLowerCase().includes(searchTerm)) ||
      (verifier.email && verifier.email.toLowerCase().includes(searchTerm)) ||
      (verifier.phoneNumber && verifier.phoneNumber.toLowerCase().includes(searchTerm))
    );
  }

  // Filtro por estado
  if (selectedStatus.value) {
    filtered = filtered.filter(verifier => verifier.status === selectedStatus.value);
  }

  return filtered;
});

const currentItem = computed(() => {
  return isEdit.value ? item.value : createItem.value;
});

// Methods
function onCreateItem() {
  createItem.value = new CreateVerifierCommand({});
  isEdit.value = false;
  submitted.value = false;
  createAndEditDialogIsVisible.value = true;
}

function onDeleteSelectedItems(selectedItemsArray) {
  selectedItems.value = selectedItemsArray;
  const count = selectedItemsArray.length;
  
  confirmDeleteMultiple(
    'verificador',
    'verificadores',
    count,
    deleteSelectedItems
  );
}

function onDeleteItem(verifier) {
  confirmDelete(
    'el verificador',
    `${verifier.name} ${verifier.lastName}`,
    async () => {
      try {
        await verifierStore.remove(verifier.id);
        showSuccess(`El verificador ${verifier.name} ${verifier.lastName} ha sido eliminado exitosamente`, 'Verificador eliminado', 4000);
      } catch (error) {
        showError('No se pudo eliminar el verificador. Intente nuevamente.');
      }
    }
  );
}

function onEditItem(verifier) {
  item.value = { ...verifier };
  isEdit.value = true;
  submitted.value = false;
  createAndEditDialogIsVisible.value = true;
}

function onViewItem(verifier) {
  router.push({
    name: 'verifier-details',
    query: { id: verifier.id }
  });
}

function onClearFilters() {
  globalFilterValue.value = '';
  selectedStatus.value = null;
}

function onGlobalFilterChange(value) {
  globalFilterValue.value = value || '';
}

function getCountByStatus(status) {
  return itemsArray.value.filter(v => v.status === status).length;
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

function onCancelRequested() {
  createAndEditDialogIsVisible.value = false;
  submitted.value = false;
  isEdit.value = false;
}

function onSaveRequested(formData) {
  submitted.value = true;

  if (isEdit.value) {
    // Actualizar verificador existente
    const updateCommand = new UpdateVerifierCommand({
      id: item.value.id,
      ...formData
    });
    update(updateCommand);
  } else {
    // Crear nuevo verificador
    const createCommand = new CreateVerifierCommand({
      ...formData,
      adminId: adminId.value,
      role: DefaultRole,
      status: DefaultStatus
    });
    create(createCommand);
  }

  createAndEditDialogIsVisible.value = false;
  isEdit.value = false;
}

function update(updateCommand) {
  verifierStore.update(updateCommand);
  showSuccess('El verificador ha sido actualizado exitosamente', 'Verificador actualizado', 4000);
}

function create(createCommand) {
  verifierStore.create(createCommand);
  showSuccess('El verificador ha sido creado exitosamente', 'Verificador creado', 4000);
}

function deleteSelectedItems() {
  const totalItems = selectedItems.value.length;
  
  selectedItems.value.forEach((verifier) => {
    verifierStore.remove(verifier.id);
  });

  showSuccess(
    `${totalItems} verificador${totalItems > 1 ? 'es' : ''} eliminado${totalItems > 1 ? 's' : ''} exitosamente`,
    'Verificadores eliminados',
    4000
  );
}

async function getAllVerifiers() {
  loading.value = true;

  try {
    await verifierStore.fetchAll();
  } catch (error) {
    handleServerError(error, 'los verificadores');
  } finally {
    loading.value = false;
  }
}

function handleServerError(error, context = 'datos') {
  console.error(`Error al cargar ${context}:`, error);

  let errorMessage = '';
  let showToast = false;

  if (error.response) {
    const status = error.response.status;
    showToast = true;
    
    if (status >= 500) {
      errorMessage = `Error interno del servidor al cargar ${context}. Por favor, contacte al administrador.`;
    } else if (status >= 400) {
      errorMessage = `Error en la solicitud de ${context}. Verifique los permisos de acceso.`;
    } else {
      errorMessage = `Error del servidor (${status}) al cargar ${context}.`;
    }
  } else if (error.request) {
    showToast = true;
    errorMessage = `No se pudo conectar con el servidor para cargar ${context}. Verifique su conexión a internet.`;
  } else if (error.message && (error.message.includes('inválido') || error.message.includes('formato'))) {
    showToast = true;
    errorMessage = `Error en el formato de datos del servidor: ${error.message}`;
  }
  
  if (showToast) {
    showError(errorMessage, 'Error del servidor', 7000);
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🎬 [VerifiersManagement] Component mounted');
  console.log('🎬 [VerifiersManagement] Current userId:', userId.value);
  
  // TODO: Obtener adminId desde el userId
  // Por ahora usar valor temporal
  adminId.value = 1;
  
  console.log('🎬 [VerifiersManagement] Starting getAllVerifiers with adminId:', adminId.value);
  await getAllVerifiers();
  console.log('🎬 [VerifiersManagement] getAllVerifiers completed');
  console.log('🎬 [VerifiersManagement] Verifiers in store:', verifierStore.verifiers);
  console.log('🎬 [VerifiersManagement] Filtered items:', filteredItemsArray.value);
});
</script>

<template>
  <div class="p-4 h-full w-full overflow-auto flex flex-column">

    <data-manager
      :items="verifierStore.verifiers"
      :filtered-items="filteredItemsArray"
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
      :show-edit-action="false"
      :show-delete-action="false"
      :view-action-icon-only="false"
      :rows="5"
      :rows-per-page-options="[5, 10, 15, 20]"
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
      <!-- Status badge template -->
      <template #status="{ data }">
        <span class="badge-custom" :class="getStatusClass(data.status)">
          {{ StatusTranslations[data.status] || data.status }}
        </span>
      </template>
    </data-manager>

    <!-- Dialog de creación/edición -->
    <VerifierCreateAndEdit
      v-model:visible="createAndEditDialogIsVisible"
      :verifier="currentItem"
      :is-edit="isEdit"
      @save="onSaveRequested"
      @cancel="onCancelRequested"
    />
  </div>
</template>

<style scoped>
</style>