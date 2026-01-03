import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useVerificationOrderStore from '../../application/verification-order.store.js';
import { UpdateVerificationOrderCommand } from '../../domain/commands/update-verification-order.command.js';

/**
 * Composable para gestionar operaciones CRUD de órdenes de verificación.
 */
export function useVerificationOrderCrud() {
  const router = useRouter();
  const store = useVerificationOrderStore();

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

  function onEditItem(order) {
    item.value = { ...order };
    isEdit.value = true;
    submitted.value = false;
    createAndEditDialogIsVisible.value = true;
  }

  function onViewItem(order) {
    router.push({
      name: 'verification-order-details', // TODO: Ajustar nombre de ruta
      query: { id: order.id }
    });
  }

  async function onDeleteItem(order) {
    await store.remove(order.id);
  }

  function onCancelRequested() {
    createAndEditDialogIsVisible.value = false;
    submitted.value = false;
    isEdit.value = false;
  }

  async function onSaveRequested(formData) {
    submitted.value = true;

    if (isEdit.value) {
      const updateCommand = new UpdateVerificationOrderCommand({
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
