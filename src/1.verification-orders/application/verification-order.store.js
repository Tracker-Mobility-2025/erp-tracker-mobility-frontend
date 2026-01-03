import { defineStore } from "pinia";
import { ref } from "vue";
import { VerificationOrderHttpRepository } from "../infrastructure/repositories/verification-order-http.repository.js";
import { CreateVerificationOrderCommand } from "../domain/commands/create-verification-order.command.js";
import { VerificationOrderErrorHandler } from "./error-handlers/verification-order-error.handler.js";
import { useNotification } from "../../shared-v2/composables/use-notification.js";

/**
 * Store de Pinia para funcionalidad de órdenes de verificación.
 * Arquitectura: Presentation → Store → Repository → API
 */
const useVerificationOrderStore = defineStore('verificationOrder', () => {
    // State
    const verificationOrders = ref([]);

    // Dependencies
    const repository = new VerificationOrderHttpRepository();
    const { showSuccess, showError, showWarning } = useNotification();
    const errorHandler = new VerificationOrderErrorHandler({ showSuccess, showError, showWarning });

    // Actions
    async function fetchAll() {
        try {
            const data = await repository.findAll();
            verificationOrders.value = data;
            return { success: true, data, code: 'SUCCESS' };
        } catch (error) {
            return errorHandler.handle(error, 'cargar las órdenes');
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
            return errorHandler.handle(error, 'cargar la orden');
        }
    }

    async function create(formData) {
        try {
            const command = new CreateVerificationOrderCommand(formData);
            const data = await repository.save(command);
            verificationOrders.value.push(data);
            showSuccess('Orden creada exitosamente', 'Éxito', 4000);
            return { success: true, data, code: 'CREATED' };
        } catch (error) {
            return errorHandler.handle(error, 'crear la orden');
        }
    }

    async function update(command) {
        try {
            const data = await repository.update(command);
            const index = verificationOrders.value.findIndex(o => o.id === data.id);
            if (index !== -1) verificationOrders.value[index] = data;
            showSuccess('Orden actualizada exitosamente', 'Éxito', 4000);
            return { success: true, data, code: 'UPDATED' };
        } catch (error) {
            return errorHandler.handle(error, 'actualizar la orden');
        }
    }

    async function remove(id) {
        try {
            await repository.delete(id);
            verificationOrders.value = verificationOrders.value.filter(o => o.id !== id);
            showSuccess('Orden eliminada exitosamente', 'Éxito', 4000);
            return { success: true, code: 'DELETED' };
        } catch (error) {
            return errorHandler.handle(error, 'eliminar la orden');
        }
    }

    return {
        verificationOrders,
        fetchAll,
        fetchById,
        create,
        update,
        remove
    };
});

export default useVerificationOrderStore;
