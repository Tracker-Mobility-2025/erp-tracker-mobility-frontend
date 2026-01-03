import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useCustomerStore from '../../application/customer.store.js';
import { UpdateCustomerCommand } from '../../domain/commands/update-customer.command.js';

/**
 * Composable para gestionar operaciones CRUD de clientes.
 */
export function useCustomerCrud() {
  const router = useRouter();
  const store = useCustomerStore();

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

  function onEditItem(customer) {
    item.value = { ...customer };
    isEdit.value = true;
    submitted.value = false;
    createAndEditDialogIsVisible.value = true;
  }

  function onViewItem(customer) {
    router.push({
      name: 'customer-details', // TODO: Ajustar nombre de ruta
      query: { id: customer.id }
    });
  }

  async function onDeleteItem(customer) {
    await store.remove(customer.id);
  }

  function onCancelRequested() {
    createAndEditDialogIsVisible.value = false;
    submitted.value = false;
    isEdit.value = false;
  }

  async function onSaveRequested(formData) {
    submitted.value = true;

    if (isEdit.value) {
      const updateCommand = new UpdateCustomerCommand({
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
