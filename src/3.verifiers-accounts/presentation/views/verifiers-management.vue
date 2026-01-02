<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import DataManager from "../../../shared/components/data-manager.component.vue";
import VerifierCreateAndEdit from "../components/verifier-create-and-edit.component.vue";
import useVerifierStore from "../../application/verifier.store.js";
import { CreateVerifierCommand } from "../../domain/commands/create-verifier.command.js";
import { UpdateVerifierCommand } from "../../domain/commands/update-verifier.command.js";
import { useAuthenticationStore } from "../../../tracker-mobility/security/services/authentication.store.js";

// Composables
const router = useRouter();
const toast = useToast();
const verifierStore = useVerifierStore();
const authStore = useAuthenticationStore();

// State
const createItem = ref(new CreateVerifierCommand({}));
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

const statusOptions = [
  { label: 'Todos', value: null },
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Inactivo', value: 'INACTIVE' },
];

const title = {
  singular: 'verificador',
  plural: 'verificadores',
};

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
  deleteSelectedItems();
}

function onDeleteItem(verifier) {
  console.log('Eliminar verificador:', verifier);
  
  verifierStore.deleteVerifier(verifier.id);
  
  toast.add({
    severity: 'success',
    summary: 'Verificador eliminado',
    detail: `El verificador ${verifier.name} ${verifier.lastName} ha sido eliminado exitosamente`,
    life: 4000
  });
}

function onEditItem(verifier) {
  console.log('Editar verificador:', verifier);
  item.value = { ...verifier };
  isEdit.value = true;
  submitted.value = false;
  createAndEditDialogIsVisible.value = true;
}

function onViewItem(verifier) {
  console.log('Ver detalles de verificador:', verifier);
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
  const statusMap = {
    'ACTIVE': 'status-activo',
    'INACTIVE': 'status-inactivo'
  };
  return statusMap[status] || 'status-default';
}

function getStatusItemsArray(status) {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'INACTIVE':
      return 'danger';
    default:
      return 'info';
  }
}

function onCancelRequested() {
  console.log('Cancelado creación/edición de verificador');
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
    console.log('Actualizar verificador:', updateCommand);
    update(updateCommand);
  } else {
    // Crear nuevo verificador
    const createCommand = new CreateVerifierCommand({
      ...formData,
      adminId: adminId.value,
      role: 'FIELD_VERIFIER',
      status: 'INACTIVE'
    });
    console.log('Guardar verificador creado:', createCommand);
    create(createCommand);
  }

  createAndEditDialogIsVisible.value = false;
  isEdit.value = false;
}

function update(updateCommand) {
  console.log('Actualizando verificador:', updateCommand);

  verifierStore.updateVerifier(updateCommand);

  toast.add({
    severity: 'success',
    summary: 'Verificador actualizado',
    detail: `El verificador ha sido actualizado exitosamente`,
    life: 4000
  });
}

function create(createCommand) {
  console.log('Creando verificador:', createCommand);

  verifierStore.addVerifier(createCommand);

  toast.add({
    severity: 'success',
    summary: 'Verificador creado',
    detail: `El verificador ha sido creado exitosamente`,
    life: 4000
  });
}

function deleteSelectedItems() {
  const totalItems = selectedItems.value.length;
  let deletedCount = 0;

  selectedItems.value.forEach((verifier) => {
    verifierStore.deleteVerifier(verifier.id);
    deletedCount++;
  });

  if (deletedCount === totalItems) {
    toast.add({
      severity: 'success',
      summary: 'Verificadores eliminados',
      detail: `${deletedCount} verificador${deletedCount > 1 ? 'es' : ''} eliminado${deletedCount > 1 ? 's' : ''} exitosamente`,
      life: 4000
    });
  }
}

async function getAllVerifiers() {
  loading.value = true;
  console.log('Obteniendo todos los verificadores');

  try {
    await verifierStore.fetchVerifiers();
    console.log('Verificadores cargados:', verifierStore.verifiers);
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
    toast.add({
      severity: 'error',
      summary: 'Error del servidor',
      detail: errorMessage,
      life: 7000
    });
  }
}

// Lifecycle
onMounted(async () => {
  console.log('====== USER ID ======', userId.value);
  
  // TODO: Obtener adminId desde el userId
  // Por ahora usar valor temporal
  adminId.value = 1;
  
  await getAllVerifiers();
});
</script>

<template>
  <DataManager
    :items="filteredItemsArray"
    :columns="columns"
    :title="title"
    :loading="loading"
    :global-filter-value="globalFilterValue"
    :selected-status="selectedStatus"
    :status-options="statusOptions"
    @create-item="onCreateItem"
    @edit-item="onEditItem"
    @delete-item="onDeleteItem"
    @delete-selected-items="onDeleteSelectedItems"
    @view-item="onViewItem"
    @clear-filters="onClearFilters"
    @global-filter-change="onGlobalFilterChange"
    @update:selected-status="selectedStatus = $event"
  >
    <!-- Status badge template -->
    <template #status="{ data }">
      <span :class="['badge', getStatusClass(data.status)]">
        {{ data.status === 'ACTIVE' ? 'Activo' : 'Inactivo' }}
      </span>
    </template>
  </DataManager>

  <!-- Dialog de creación/edición -->
  <VerifierCreateAndEdit
    v-model:visible="createAndEditDialogIsVisible"
    :verifier="currentItem"
    :is-edit="isEdit"
    @save="onSaveRequested"
    @cancel="onCancelRequested"
  />
</template>

<style scoped>
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-activo {
  background-color: #d4edda;
  color: #155724;
}

.status-inactivo {
  background-color: #f8d7da;
  color: #721c24;
}

.status-default {
  background-color: #d1ecf1;
  color: #0c5460;
}
</style>