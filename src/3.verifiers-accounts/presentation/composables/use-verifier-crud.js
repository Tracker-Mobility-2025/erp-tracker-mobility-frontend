import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirmDialog } from '../../../shared-v2/composables/use-confirm-dialog.js';
import useVerifierStore from '../../application/verifier.store.js';
import { CreateVerifierCommand } from '../../domain/commands/create-verifier.command.js';
import { UpdateVerifierCommand } from '../../domain/commands/update-verifier.command.js';
import { DefaultRole, DefaultStatus } from '../../domain/constants/verifier.constants.js';
import { useAuthenticationStore } from '../../../tracker-mobility/security/services/authentication.store.js';

/**
 * Composable para gestionar operaciones CRUD de verificadores.
 * Encapsula lógica de creación, edición, eliminación y navegación.
 * Presentation Layer - Composable.
 * 
 * @returns {Object} Propiedades y métodos de CRUD
 */
export function useVerifierCrud() {
  const router = useRouter();
  const verifierStore = useVerifierStore();
  const authStore = useAuthenticationStore();
  const { confirmDelete, confirmDeleteMultiple } = useConfirmDialog();

  // State para diálogos
  const createAndEditDialogIsVisible = ref(false);
  const isEdit = ref(false);
  const submitted = ref(false);
  const createItem = ref({});
  const item = ref(null);

  // Computed
  const adminId = computed(() => authStore.currentUserId);
  const currentItem = computed(() => {
    return isEdit.value ? item.value : createItem.value;
  });

  /**
   * Abre el diálogo para crear un nuevo verificador.
   */
  function onCreateItem() {
    createItem.value = {};
    isEdit.value = false;
    submitted.value = false;
    createAndEditDialogIsVisible.value = true;
  }

  /**
   * Abre el diálogo para editar un verificador existente.
   * @param {Object} verifier - Verificador a editar
   */
  function onEditItem(verifier) {
    item.value = { ...verifier };
    isEdit.value = true;
    submitted.value = false;
    createAndEditDialogIsVisible.value = true;
  }

  /**
   * Navega a la vista de detalle del verificador.
   * @param {Object} verifier - Verificador a visualizar
   */
  function onViewItem(verifier) {
    router.push({
      name: 'verifier-details',
      query: { id: verifier.id }
    });
  }

  /**
   * Maneja la solicitud de eliminación de un verificador.
   * @param {Object} verifier - Verificador a eliminar
   */
  function onDeleteItem(verifier) {
    confirmDelete(
      'el verificador',
      verifier.fullName || `${verifier.name} ${verifier.lastName}`,
      async () => {
        await verifierStore.remove(verifier.id, verifier.fullName);
      }
    );
  }

  /**
   * Maneja la solicitud de eliminación de múltiples verificadores.
   * @param {Array} selectedItemsArray - Array de verificadores seleccionados
   */
  function onDeleteSelectedItems(selectedItemsArray) {
    const count = selectedItemsArray.length;
    
    confirmDeleteMultiple(
      'verificador',
      'verificadores',
      count,
      async () => {
        await verifierStore.removeMultiple(selectedItemsArray);
      }
    );
  }

  /**
   * Cancela la operación de creación/edición.
   */
  function onCancelRequested() {
    createAndEditDialogIsVisible.value = false;
    submitted.value = false;
    isEdit.value = false;
  }

  /**
   * Guarda un verificador (crear o actualizar).
   * @param {Object} formData - Datos del formulario
   */
  async function onSaveRequested(formData) {
    submitted.value = true;

    if (isEdit.value) {
      // Actualizar verificador existente
      const updateCommand = new UpdateVerifierCommand({
        id: item.value.id,
        ...formData
      });
      await verifierStore.update(updateCommand);
    } else {
      // Crear nuevo verificador
      const createCommand = new CreateVerifierCommand({
        ...formData,
        adminId: adminId.value,
        role: DefaultRole,
        status: DefaultStatus
      });
      await verifierStore.create(createCommand);
    }

    createAndEditDialogIsVisible.value = false;
    isEdit.value = false;
  }

  return {
    // State
    createAndEditDialogIsVisible,
    isEdit,
    submitted,
    createItem,
    item,
    currentItem,
    
    // Methods
    onCreateItem,
    onEditItem,
    onViewItem,
    onDeleteItem,
    onDeleteSelectedItems,
    onCancelRequested,
    onSaveRequested
  };
}
