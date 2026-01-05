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

    /**
     * Asigna un verificador a una orden
     * @param {number} orderId - ID de la orden
     * @param {number} verifierId - ID del verificador
     * @param {Date} visitDate - Fecha de visita
     * @param {string} visitTime - Hora de visita
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function assignVerifier(orderId, verifierId, visitDate, visitTime) {
        try {
            const data = await repository.assignVerifier(orderId, verifierId, visitDate, visitTime);
            const index = verificationOrders.value.findIndex(o => o.id === orderId);
            if (index !== -1) verificationOrders.value[index] = data;
            showSuccess('Verificador asignado exitosamente', 'Éxito', 4000);
            return { success: true, data, code: 'VERIFIER_ASSIGNED' };
        } catch (error) {
            return errorHandler.handle(error, 'asignar verificador');
        }
    }

    /**
     * Actualiza el estado de una orden
     * @param {number} orderId - ID de la orden
     * @param {string} newStatus - Nuevo estado
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function updateStatus(orderId, newStatus) {
        try {
            const data = await repository.updateStatus(orderId, newStatus);
            const index = verificationOrders.value.findIndex(o => o.id === orderId);
            if (index !== -1) verificationOrders.value[index] = data;
            showSuccess('Estado actualizado exitosamente', 'Éxito', 4000);
            return { success: true, data, code: 'STATUS_UPDATED' };
        } catch (error) {
            return errorHandler.handle(error, 'actualizar estado');
        }
    }

    /**
     * Actualiza la información de la vivienda
     * @param {number} orderId - ID de la orden
     * @param {Object} dwellingData - Datos de la vivienda
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function updateDwelling(orderId, dwellingData) {
        try {
            const data = await repository.updateDwelling(orderId, dwellingData);
            const index = verificationOrders.value.findIndex(o => o.id === orderId);
            if (index !== -1 && verificationOrders.value[index].dwelling) {
                verificationOrders.value[index].dwelling = data;
            }
            showSuccess('Información de vivienda actualizada', 'Éxito', 4000);
            return { success: true, data, code: 'DWELLING_UPDATED' };
        } catch (error) {
            return errorHandler.handle(error, 'actualizar información de vivienda');
        }
    }

    /**
     * Actualiza la información de la zona
     * @param {number} orderId - ID de la orden
     * @param {Object} zoneData - Datos de la zona
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function updateZone(orderId, zoneData) {
        try {
            const data = await repository.updateZone(orderId, zoneData);
            const index = verificationOrders.value.findIndex(o => o.id === orderId);
            if (index !== -1 && verificationOrders.value[index].zone) {
                verificationOrders.value[index].zone = data;
            }
            showSuccess('Información de zona actualizada', 'Éxito', 4000);
            return { success: true, data, code: 'ZONE_UPDATED' };
        } catch (error) {
            return errorHandler.handle(error, 'actualizar información de zona');
        }
    }

    /**
     * Actualiza la información de ubicación
     * @param {number} orderId - ID de la orden
     * @param {Object} locationData - Datos de ubicación
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function updateLocation(orderId, locationData) {
        try {
            const data = await repository.updateLocation(orderId, locationData);
            const index = verificationOrders.value.findIndex(o => o.id === orderId);
            if (index !== -1 && verificationOrders.value[index].location) {
                verificationOrders.value[index].location = data;
            }
            showSuccess('Información de ubicación actualizada', 'Éxito', 4000);
            return { success: true, data, code: 'LOCATION_UPDATED' };
        } catch (error) {
            return errorHandler.handle(error, 'actualizar información de ubicación');
        }
    }

    return {
        verificationOrders,
        fetchAll,
        fetchById,
        create,
        update,
        remove,
        assignVerifier,
        updateStatus,
        updateDwelling,
        updateZone,
        updateLocation
    };
});

export default useVerificationOrderStore;
