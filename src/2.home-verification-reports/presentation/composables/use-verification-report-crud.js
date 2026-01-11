import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useVerificationReportStore from '../../application/verification-report.store.js';

/**
 * Composable para gestionar operaciones CRUD de reportes de verificación.
 * Nota: El módulo solo soporta lectura y actualización de entrevista con arrendador.
 * No hay endpoints para crear/actualizar/eliminar reportes completos.
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
    // No hay endpoint para crear reportes, esta función no se usa
    console.warn('[useVerificationReportCrud] Crear reporte no está disponible');
  }

  function onEditItem(report) {
    // No hay endpoint para editar reportes completos
    console.warn('[useVerificationReportCrud] Editar reporte no está disponible');
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
    // Esta función no se usa porque no hay endpoints para crear/actualizar reportes
    console.warn('[useVerificationReportCrud] Guardar reporte no está disponible');
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
