import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useOrderRequestStore from '../../application/order-request.store.js';
import { UpdateOrderRequestCommand } from '../../domain/commands/update-order-request.command.js';

/**
 * Composable para gestionar operaciones CRUD de solicitudes de orden.
 */
export function useOrderRequestCrud() {
  const router = useRouter();
  const store = useOrderRequestStore();

  const createAndEditDialogIsVisible = ref(false);
  const isEdit = ref(false);
  const submitted = ref(false);
  const createItem = ref({});
  const item = ref(null);

  const currentItem = computed(() => {
    return isEdit.value ? item.value : createItem.value;
  });

  function onCreateItem() {
    createItem.value = {};
    isEdit.value = false;
    submitted.value = false;
    createAndEditDialogIsVisible.value = true;
  }

  function onEditItem(orderRequest) {
    item.value = { ...orderRequest };
    isEdit.value = true;
    submitted.value = false;
    createAndEditDialogIsVisible.value = true;
  }

  function onViewItem(orderRequest) {
    router.push({
      name: 'order-request-details', // TODO: Ajustar nombre de ruta
      query: { id: orderRequest.id }
    });
  }

  async function onDeleteItem(orderRequest) {
    await store.remove(orderRequest.id);
  }

  function onCancelRequested() {
    createAndEditDialogIsVisible.value = false;
    submitted.value = false;
    isEdit.value = false;
  }

  async function onSaveRequested(formData) {
    submitted.value = true;

    if (isEdit.value) {
      const updateCommand = new UpdateOrderRequestCommand({
        id: item.value.id,
        ...formData
      });
      await store.update(updateCommand);
    } else {
      await store.create(formData);
    }

    createAndEditDialogIsVisible.value = false;
    isEdit.value = false;
  }

  return {
    createAndEditDialogIsVisible,
    isEdit,
    submitted,
    createItem,
    item,
    currentItem,
    onCreateItem,
    onEditItem,
    onViewItem,
    onDeleteItem,
    onCancelRequested,
    onSaveRequested
  };
}
