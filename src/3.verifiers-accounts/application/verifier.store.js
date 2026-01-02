import { defineStore } from "pinia";
import { ref } from "vue";
import { VerifierHttpRepository } from "../infrastructure/repositories/verifier-http.repository.js";
import { CreateVerifierUseCase } from "./use-cases/create-verifier.use-case.js";
import { UpdateVerifierUseCase } from "./use-cases/update-verifier.use-case.js";
import { DeleteVerifierUseCase } from "./use-cases/delete-verifier.use-case.js";
import { ListVerifiersUseCase } from "./use-cases/list-verifiers.use-case.js";
import { useNotification } from "../../shared-v2/composables/use-notification.js";
import { useAuthenticationStore } from "../../tracker-mobility/security/services/authentication.store.js";

/**
 * Store de Pinia para funcionalidad de verificadores.
 * Arquitectura refactorizada: Presentation → Store → Use Cases → Repository → API
 * El Store ahora delega la lógica de negocio a Use Cases y solo gestiona estado reactivo.
 */
const useVerifierStore = defineStore('verifier', () => {
    // State (solo para UI reactivity)
    const verifiers = ref([]);

    // Dependencies (inyección de dependencias)
    const repository = new VerifierHttpRepository();
    const { showSuccess, showError, showWarning } = useNotification();
    const authStore = useAuthenticationStore();

    // Use Cases (orquestadores de lógica de negocio)
    const createUseCase = new CreateVerifierUseCase(repository, { showSuccess, showError, showWarning }, authStore);
    const updateUseCase = new UpdateVerifierUseCase(repository, { showSuccess, showError, showWarning });
    const deleteUseCase = new DeleteVerifierUseCase(repository, { showSuccess, showError, showWarning });
    const listUseCase = new ListVerifiersUseCase(repository, { showSuccess, showError, showWarning });

    // Actions (delegación a Use Cases)
    /**
     * Obtiene todos los verificadores.
     * @returns {Promise<Object>} Resultado { success, data?, message, code }
     */
    async function fetchAll() {
        const result = await listUseCase.execute();
        
        if (result.success) {
            verifiers.value = result.data;
        }
        
        return result;
    }

    /**
     * Obtiene los verificadores de un administrador específico.
     * @param {number} adminId - El ID del administrador.
     * @returns {Promise<Object>} Resultado { success, data?, message, code }
     */
    async function fetchByAdminId(adminId) {
        const result = await listUseCase.executeByAdminId(adminId);
        
        if (result.success) {
            verifiers.value = result.data;
        }
        
        return result;
    }

    /**
     * Obtiene un verificador por su ID.
     * @param {string|number} id - El ID del verificador.
     * @returns {Promise<Object>} Resultado { success, data?, message, code }
     */
    async function fetchById(id) {
        const idInt = parseInt(id);
        
        // Primero buscar en estado local
        const cached = verifiers.value.find(v => v.id === idInt);
        if (cached) {
            return {
                success: true,
                data: cached,
                message: 'Verificador en caché',
                code: 'CACHED'
            };
        }
        
        // Si no está en cache, buscar en repositorio
        return await listUseCase.executeById(idInt);
    }

    /**
     * Crea un nuevo verificador.
     * @param {CreateVerifierCommand} command - El comando para crear el verificador.
     * @returns {Promise<Object>} Resultado { success, data?, message, code }
     */
    async function create(command) {
        const result = await createUseCase.execute(command);
        
        if (result.success) {
            verifiers.value.push(result.data);
        }
        
        return result;
    }

    /**
     * Actualiza un verificador existente.
     * @param {UpdateVerifierCommand} command - El comando para actualizar el verificador.
     * @returns {Promise<Object>} Resultado { success, data?, message, code }
     */
    async function update(command) {
        const result = await updateUseCase.execute(command);
        
        if (result.success) {
            const index = verifiers.value.findIndex(v => v.id === result.data.id);
            if (index !== -1) {
                verifiers.value[index] = result.data;
            }
        }
        
        return result;
    }

    /**
     * Elimina un verificador.
     * @param {number} verifierId - El ID del verificador a eliminar.
     * @param {string} verifierName - Nombre del verificador (opcional, para notificación)
     * @returns {Promise<Object>} Resultado { success, message, code }
     */
    async function remove(verifierId, verifierName = '') {
        const result = await deleteUseCase.execute(verifierId, verifierName);
        
        if (result.success) {
            verifiers.value = verifiers.value.filter(v => v.id !== verifierId);
        }
        
        return result;
    }

    /**
     * Elimina múltiples verificadores.
     * @param {Array<Object>} selectedVerifiers - Array de verificadores a eliminar
     * @returns {Promise<Object>} Resultado con conteo de éxitos/fallos
     */
    async function removeMultiple(selectedVerifiers) {
        const verifiersToDelete = selectedVerifiers.map(v => ({
            id: v.id,
            name: v.fullName || `${v.name} ${v.lastName}`
        }));
        
        const result = await deleteUseCase.executeMultiple(verifiersToDelete);
        
        if (result.success) {
            // Eliminar todos los verificadores que fueron eliminados exitosamente
            const deletedIds = result.results
                .filter(r => r.result.success)
                .map(r => r.verifier.id);
            
            verifiers.value = verifiers.value.filter(v => !deletedIds.includes(v.id));
        }
        
        return result;
    }

    /**
     * Obtiene las órdenes asignadas a un verificador.
     * @param {number} verifierId - El ID del verificador.
     * @returns {Promise<Array>} Las órdenes asignadas
     */
    async function fetchAssignedOrders(verifierId) {
        try {
            return await repository.findAssignedOrders(verifierId);
        } catch (err) {
            showError('Error al obtener órdenes asignadas', 'Error', 3000);
            return [];
        }
    }

    return {
        // State
        verifiers,
        // Actions
        fetchAll,
        fetchByAdminId,
        fetchById,
        create,
        update,
        remove,
        removeMultiple,
        fetchAssignedOrders
    };
});

export default useVerifierStore;
