import { ref } from 'vue';
import useVerificationOrderStore from '../../application/verification-order.store.js';
import { useNotification } from '../../../shared-v2/composables/use-notification.js';

/**
 * Composable para gestionar asignación de verificadores.
 * Maneja la lógica de asignación con validaciones y notificaciones.
 */
export function useVerifierAssignment() {
  const store = useVerificationOrderStore();
  const { showSuccess, showError, showWarning } = useNotification();

  const isAssigning = ref(false);
  const assignDialogVisible = ref(false);
  const selectedOrder = ref(null);

  /**
   * Abre el diálogo de asignación para una orden
   * @param {Object} order - La orden a la que se asignará un verificador
   */
  function openAssignDialog(order) {
    if (!order) {
      showWarning('No se ha seleccionado ninguna orden', 'Advertencia');
      return;
    }

    if (order.status !== 'PENDIENTE') {
      showWarning(
        'Solo se pueden asignar verificadores a órdenes pendientes',
        'Acción no permitida'
      );
      return;
    }

    selectedOrder.value = order;
    assignDialogVisible.value = true;
  }

  /**
   * Cierra el diálogo de asignación
   */
  function closeAssignDialog() {
    assignDialogVisible.value = false;
    selectedOrder.value = null;
  }

  /**
   * Asigna un verificador a una orden
   * @param {Object} assignmentData - Datos de asignación
   * @param {number} assignmentData.orderId - ID de la orden
   * @param {number} assignmentData.verifierId - ID del verificador
   * @param {Date} assignmentData.visitDate - Fecha de visita
   * @param {string} assignmentData.visitTime - Hora de visita
   * @returns {Promise<boolean>} True si fue exitoso
   */
  async function assignVerifier(assignmentData) {
    if (isAssigning.value) return false;

    isAssigning.value = true;

    try {
      const result = await store.assignVerifier(
        assignmentData.orderId,
        assignmentData.verifierId,
        assignmentData.visitDate,
        assignmentData.visitTime
      );

      if (result.success) {
        closeAssignDialog();
        return true;
      } else {
        showError(
          result.message || 'Error al asignar verificador',
          'Error de Asignación'
        );
        return false;
      }
    } catch (error) {
      showError(
        'Ocurrió un error inesperado al asignar el verificador',
        'Error'
      );
      console.error('Error en assignVerifier:', error);
      return false;
    } finally {
      isAssigning.value = false;
    }
  }

  /**
   * Valida si una orden puede tener un verificador asignado
   * @param {Object} order - La orden a validar
   * @returns {boolean} True si puede asignarse
   */
  function canAssignVerifier(order) {
    if (!order) return false;
    return order.status === 'PENDIENTE' || order.status === 'ASIGNADO';
  }

  return {
    isAssigning,
    assignDialogVisible,
    selectedOrder,
    openAssignDialog,
    closeAssignDialog,
    assignVerifier,
    canAssignVerifier
  };
}
