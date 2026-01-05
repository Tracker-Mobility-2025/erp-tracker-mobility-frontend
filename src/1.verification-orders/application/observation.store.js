import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ObservationApi } from "../infrastructure/observation.api.js";
import { ObservationAssembler } from "../infrastructure/observation.assembler.js";
import { CreateObservationCommand } from "../domain/commands/create-observation.command.js";
import { UpdateObservationStatusCommand } from "../domain/commands/update-observation-status.command.js";
import { useNotification } from "../../shared-v2/composables/use-notification.js";
import { ObservationStatus } from "../domain/constants/observation.constants.js";

/**
 * Store de Pinia para funcionalidad de observaciones.
 * Arquitectura: Presentation → Store → API → Backend
 */
const useObservationStore = defineStore('observation', () => {
    // State
    const observations = ref([]);
    const currentObservation = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Dependencies
    const api = new ObservationApi();
    const { showSuccess, showError, showWarning } = useNotification();

    // Computed
    const pendingObservations = computed(() => {
        return observations.value.filter(obs => obs.isPending);
    });

    const resolvedObservations = computed(() => {
        return observations.value.filter(obs => obs.isResolved);
    });

    const inReviewObservations = computed(() => {
        return observations.value.filter(obs => obs.isInReview);
    });

    // Actions
    /**
     * Obtiene todas las observaciones de una orden
     * @param {number} orderId - ID de la orden
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function fetchByOrder(orderId) {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.getAllByOrder(orderId);
            const data = ObservationAssembler.toEntities(response.data);
            observations.value = data;

            return {
                success: true,
                data,
                message: `${data.length} observación${data.length !== 1 ? 'es' : ''} cargada${data.length !== 1 ? 's' : ''}`,
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = err;
            showError('Error al cargar las observaciones', 'Error');
            return {
                success: false,
                message: err.message || 'Error al cargar las observaciones',
                code: 'ERROR'
            };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Obtiene una observación por ID
     * @param {number} orderId - ID de la orden
     * @param {number} observationId - ID de la observación
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function fetchById(orderId, observationId) {
        loading.value = true;
        error.value = null;

        try {
            const response = await api.getById(orderId, observationId);
            const data = ObservationAssembler.toEntity(response.data);
            currentObservation.value = data;

            return {
                success: true,
                data,
                code: 'SUCCESS'
            };
        } catch (err) {
            error.value = err;
            showError('Error al cargar la observación', 'Error');
            return {
                success: false,
                message: err.message || 'Error al cargar la observación',
                code: 'ERROR'
            };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Crea una nueva observación
     * @param {Object} formData - Datos del formulario
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function create(formData) {
        loading.value = true;
        error.value = null;

        try {
            const command = new CreateObservationCommand(formData);
            const response = await api.create(command.orderId, command);
            const data = ObservationAssembler.toEntity(response.data);
            
            observations.value.push(data);
            showSuccess('Observación creada exitosamente', 'Éxito', 4000);

            return {
                success: true,
                data,
                code: 'CREATED'
            };
        } catch (err) {
            error.value = err;
            showError(err.message || 'Error al crear la observación', 'Error');
            return {
                success: false,
                message: err.message || 'Error al crear la observación',
                code: 'ERROR'
            };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Actualiza el estado de una observación
     * @param {number} orderId - ID de la orden
     * @param {number} observationId - ID de la observación
     * @param {string} newStatus - Nuevo estado
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function updateStatus(orderId, observationId, newStatus) {
        loading.value = true;
        error.value = null;

        try {
            const command = new UpdateObservationStatusCommand({
                id: observationId,
                status: newStatus,
                resolvedDate: newStatus === ObservationStatus.SUBSANADA ? new Date() : null
            });

            const response = await api.updateStatus(orderId, observationId, command);
            const data = ObservationAssembler.toEntity(response.data);

            // Actualizar en el array
            const index = observations.value.findIndex(obs => obs.id === observationId);
            if (index !== -1) {
                observations.value[index] = data;
            }

            showSuccess('Estado actualizado exitosamente', 'Éxito', 4000);

            return {
                success: true,
                data,
                code: 'UPDATED'
            };
        } catch (err) {
            error.value = err;
            showError(err.message || 'Error al actualizar el estado', 'Error');
            return {
                success: false,
                message: err.message || 'Error al actualizar el estado',
                code: 'ERROR'
            };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Subsana una observación (cambia estado a SUBSANADA)
     * @param {number} orderId - ID de la orden
     * @param {number} observationId - ID de la observación
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function resolve(orderId, observationId) {
        return updateStatus(orderId, observationId, ObservationStatus.SUBSANADA);
    }

    /**
     * Rechaza una observación (cambia estado a RECHAZADA)
     * @param {number} orderId - ID de la orden
     * @param {number} observationId - ID de la observación
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function reject(orderId, observationId) {
        return updateStatus(orderId, observationId, ObservationStatus.RECHAZADA);
    }

    /**
     * Reabre una observación (cambia estado a PENDIENTE)
     * @param {number} orderId - ID de la orden
     * @param {number} observationId - ID de la observación
     * @returns {Promise<{success: boolean, data?, message?, code}>}
     */
    async function reopen(orderId, observationId) {
        return updateStatus(orderId, observationId, ObservationStatus.PENDIENTE);
    }

    /**
     * Elimina una observación
     * @param {number} orderId - ID de la orden
     * @param {number} observationId - ID de la observación
     * @returns {Promise<{success: boolean, code}>}
     */
    async function remove(orderId, observationId) {
        loading.value = true;
        error.value = null;

        try {
            await api.delete(orderId, observationId);
            observations.value = observations.value.filter(obs => obs.id !== observationId);
            showSuccess('Observación eliminada exitosamente', 'Éxito', 4000);

            return {
                success: true,
                code: 'DELETED'
            };
        } catch (err) {
            error.value = err;
            showError('Error al eliminar la observación', 'Error');
            return {
                success: false,
                message: err.message || 'Error al eliminar la observación',
                code: 'ERROR'
            };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Limpia el estado
     */
    function clearObservations() {
        observations.value = [];
        currentObservation.value = null;
        error.value = null;
    }

    return {
        // State
        observations,
        currentObservation,
        loading,
        error,

        // Computed
        pendingObservations,
        resolvedObservations,
        inReviewObservations,

        // Actions
        fetchByOrder,
        fetchById,
        create,
        updateStatus,
        resolve,
        reject,
        reopen,
        remove,
        clearObservations
    };
});

export default useObservationStore;
