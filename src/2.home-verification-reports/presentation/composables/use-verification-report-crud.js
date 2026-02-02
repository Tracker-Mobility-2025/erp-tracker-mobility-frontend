import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useVerificationReportStore from '../../application/verification-report.store.js';

/**
 * Composable para gestionar operaciones CRUD de reportes de verificación.
 * Limpiado: eliminado código muerto y funcionalidad no soportada por el API.
 * 
 * NOTA: El módulo solo soporta:
 * - Lectura de reportes (fetchAll, fetchById)
 * - Actualización de entrevista con arrendador
 * - Actualización de resultado del reporte
 * - Eliminación (sin implementación en API aún)
 */
export function useVerificationReportCrud() {
  const router = useRouter();
  const store = useVerificationReportStore();

  /**
   * Navega a la vista de detalle del reporte
   * @param {Object} report - Reporte a visualizar
   */
  function onViewItem(report) {
    router.push({
      name: 'verification-report-detail',
      params: { reportId: report.reportId }
    });
  }

  /**
   * Elimina un reporte
   * @param {Object} report - Reporte a eliminar
   */
  async function onDeleteItem(report) {
    await store.remove(report.reportId);
  }

  return {
    onViewItem,
    onDeleteItem
  };
}
