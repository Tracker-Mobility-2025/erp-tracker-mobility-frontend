import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useVerificationReportStore from '../../application/verification-report.store.js';
import { UpdateVerificationReportCommand } from '../../domain/commands/update-verification-report.command.js';

/**
 * Composable para gestionar operaciones CRUD de reportes de verificación.
 */
export function useVerificationReportCrud() {
  const router = useRouter();
  const store = useVerificationReportStore();

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

  function onEditItem(report) {
    item.value = { ...report };
    isEdit.value = true;
    submitted.value = false;
    createAndEditDialogIsVisible.value = true;
  }

  function onViewItem(report) {
    router.push({
      name: 'verification-report-detail',
      params: { reportId: report.reportId }
    });
  }

  async function onDeleteItem(report) {
    await store.remove(report.reportId);
  }

  function onCancelRequested() {
    createAndEditDialogIsVisible.value = false;
    submitted.value = false;
    isEdit.value = false;
  }

  async function onSaveRequested(formData) {
    submitted.value = true;

    if (isEdit.value) {
      const updateCommand = new UpdateVerificationReportCommand({
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
