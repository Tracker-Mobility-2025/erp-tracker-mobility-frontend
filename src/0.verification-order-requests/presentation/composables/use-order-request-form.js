// Composable para el formulario de solicitud de órdenes
// Presentation layer

import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderRequestStore } from '../../application/order-request.store.js';
import { useToast } from 'primevue/usetoast';

/**
 * Composable que encapsula la lógica del formulario de solicitud de órdenes
 */
export function useOrderRequestForm() {
  const store = useOrderRequestStore();
  const router = useRouter();
  const toast = useToast();

  /**
   * Inicializa el formulario cargando datos de la empresa
   */
  const initForm = async () => {
    const username = localStorage.getItem('username');
    
    if (!username) {
      toast.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se pudo identificar el usuario',
        life: 3000
      });
      return;
    }

    const result = await store.fetchApplicantCompanyData(username, true);
    
    if (!result.success) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los datos de la empresa',
        life: 3000
      });
    }
  };

  /**
   * Maneja el avance al siguiente paso con scroll suave
   */
  const handleNext = () => {
    store.goToNextStep();
    scrollToTop();
  };

  /**
   * Maneja el retroceso al paso anterior con scroll suave
   */
  const handleBack = () => {
    store.goToPreviousStep();
    scrollToTop();
  };

  /**
   * Maneja la cancelación del formulario
   */
  const handleCancel = () => {
    store.resetForm();
    scrollToTop();
    
    toast.add({
      severity: 'info',
      summary: 'Formulario reiniciado',
      detail: 'Se han limpiado todos los datos ingresados',
      life: 3000
    });
  };

  /**
   * Maneja la finalización y creación de la orden
   */
  const handleComplete = async (orderResponse) => {
    // Si ya recibimos orderResponse del componente hijo, solo avanzar al resumen
    if (orderResponse) {
      store.goToStep(4);
      scrollToTop();
    }
  };

  /**
   * Maneja el botón de finalizar desde el resumen
   */
  const handleFinish = () => {
    handleCancel();
    
    toast.add({
      severity: 'success',
      summary: 'Proceso completado',
      detail: 'Puedes crear una nueva solicitud',
      life: 3000
    });
  };

  /**
   * Scroll suave al inicio del contenedor
   */
  const scrollToTop = () => {
    setTimeout(() => {
      const container = document.querySelector('.form-content-container');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Inicializar al montar
  onMounted(() => {
    initForm();
  });

  return {
    // Store state
    store,
    
    // Handlers
    handleNext,
    handleBack,
    handleCancel,
    handleComplete,
    handleFinish,
    initForm
  };
}
