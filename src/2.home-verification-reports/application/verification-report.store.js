import { defineStore } from "pinia";
import { ref } from "vue";
import { VerificationReportHttpRepository } from "../infrastructure/repositories/verification-report-http.repository.js";
import { CreateVerificationReportCommand } from "../domain/commands/create-verification-report.command.js";
import { VerificationReportErrorHandler } from "./error-handlers/verification-report-error.handler.js";
import { useNotification } from "../../shared-v2/composables/use-notification.js";

/**
 * Store de Pinia para funcionalidad de reportes de verificación.
 * Arquitectura: Presentation → Store → Repository → API
 */
const useVerificationReportStore = defineStore('verificationReport', () => {
    // State
    const verificationReports = ref([]);

    // Dependencies
    const repository = new VerificationReportHttpRepository();
    const { showSuccess, showError, showWarning } = useNotification();
    const errorHandler = new VerificationReportErrorHandler({ showSuccess, showError, showWarning });

    // Actions
    async function fetchAll() {
        try {
            const data = await repository.findAll();
            verificationReports.value = data;
            return { success: true, data, code: 'SUCCESS' };
        } catch (error) {
            return errorHandler.handle(error, 'cargar los reportes');
        }
    }

    async function fetchById(id) {
        try {
            const data = await repository.findById(parseInt(id));
            if (!data) {
                return { success: false, message: 'No encontrado', code: 'NOT_FOUND' };
            }
            return { success: true, data, code: 'SUCCESS' };
        } catch (error) {
            return errorHandler.handle(error, 'cargar el reporte');
        }
    }

    async function create(formData) {
        try {
            const command = new CreateVerificationReportCommand(formData);
            const data = await repository.save(command);
            verificationReports.value.push(data);
            showSuccess('Reporte creado exitosamente', 'Éxito', 4000);
            return { success: true, data, code: 'CREATED' };
        } catch (error) {
            return errorHandler.handle(error, 'crear el reporte');
        }
    }

    async function update(command) {
        try {
            const data = await repository.update(command);
            const index = verificationReports.value.findIndex(r => r.id === data.id);
            if (index !== -1) verificationReports.value[index] = data;
            showSuccess('Reporte actualizado exitosamente', 'Éxito', 4000);
            return { success: true, data, code: 'UPDATED' };
        } catch (error) {
            return errorHandler.handle(error, 'actualizar el reporte');
        }
    }

    async function remove(id) {
        try {
            await repository.delete(id);
            verificationReports.value = verificationReports.value.filter(r => r.id !== id);
            showSuccess('Reporte eliminado exitosamente', 'Éxito', 4000);
            return { success: true, code: 'DELETED' };
        } catch (error) {
            return errorHandler.handle(error, 'eliminar el reporte');
        }
    }

    return {
        verificationReports,
        fetchAll,
        fetchById,
        create,
        update,
        remove
    };
});

export default useVerificationReportStore;
