import { defineStore } from "pinia";
import { ref } from "vue";
import { ReportHttpRepository } from "../infrastructure/repositories/report-http.repository.js";
import { ReportErrorHandler } from "./error-handlers/report-error.handler.js";
import { useNotification } from "../../shared-v2/composables/use-notification.js";

/**
 * Store de Pinia para funcionalidad de reportes de verificación.
 * Arquitectura: Presentation → Store → Repository → API
 * El Store contiene la lógica de negocio y gestiona estado reactivo.
 */
const useVerificationReportStore = defineStore('verificationReport', () => {
    // State
    const verificationReports = ref([]);

    // Dependencies
    const repository = new ReportHttpRepository();
    const { showSuccess, showError, showWarning } = useNotification();
    const errorHandler = new ReportErrorHandler({ showSuccess, showError, showWarning });

    /**
     * Obtiene todos los reportes resumidos.
     * @returns {Promise<Object>} Resultado { success, data?, message, code }
     */
    async function fetchAll() {
        // Limpiar datos SÍNCRONAMENTE antes de cargar
        verificationReports.value = [];
        
        try {
            const data = await repository.findAllSummaries();
            verificationReports.value = data;
            return {
                success: true,
                data,
                message: `${data.length} reporte${data.length !== 1 ? 's' : ''} cargado${data.length !== 1 ? 's' : ''}`,
                code: 'SUCCESS'
            };
        } catch (error) {
            return errorHandler.handle(error, 'cargar los reportes');
        }
    }

    /**
     * Obtiene un reporte por su ID.
     * @param {string|number} id - El ID del reporte.
     * @returns {Promise<Object>} Resultado { success, data?, message, code }
     */
    async function fetchById(id) {
        try {
            const reportId = parseInt(id);
            
            if (!reportId) {
                return {
                    success: false,
                    message: 'ID de reporte requerido',
                    code: 'INVALID_PARAMS'
                };
            }

            const data = await repository.findById(reportId);

            if (!data) {
                showWarning('Reporte no encontrado', 'No encontrado', 3000);
                return {
                    success: false,
                    message: 'Reporte no encontrado',
                    code: 'NOT_FOUND'
                };
            }

            return {
                success: true,
                data,
                message: 'Reporte cargado correctamente',
                code: 'SUCCESS'
            };
        } catch (error) {
            return errorHandler.handle(error, 'cargar el reporte');
        }
    }

    /**
     * Elimina un reporte por su ID.
     * @param {number} id - El ID del reporte a eliminar.
     * @returns {Promise<Object>} Resultado { success, message, code }
     */
    async function remove(id) {
        try {
            // TODO: Implementar eliminación cuando el API lo soporte
            verificationReports.value = verificationReports.value.filter(r => r.reportId !== id);
            showSuccess('Reporte eliminado exitosamente', 'Éxito', 3000);
            return {
                success: true,
                message: 'Reporte eliminado correctamente',
                code: 'DELETED'
            };
        } catch (error) {
            return errorHandler.handle(error, 'eliminar el reporte');
        }
    }

    return {
        verificationReports,
        fetchAll,
        fetchById,
        remove
    };
});

export default useVerificationReportStore;

