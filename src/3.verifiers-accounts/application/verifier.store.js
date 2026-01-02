import { VerifierApi } from "../infrastructure/verifier.api.js";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { VerifierAssembler } from "../infrastructure/verifier.assembler.js";

const verifierApi = new VerifierApi();

/**
 * Store de Pinia para funcionalidad de verificadores.
 * Gestiona los datos de verificadores, incluyendo operaciones CRUD.
 */
const useVerifierStore = defineStore('verifier', () => {
    // State
    const verifiers = ref([]);
    const errors = ref([]);
    const verifiersLoaded = ref(false);

    // Properties
    const verifiersCount = computed(() => {
        return verifiersLoaded.value ? verifiers.value.length : 0;
    });

    const activeVerifiers = computed(() => {
        return verifiers.value.filter(verifier => verifier.isActive);
    });

    const activeVerifiersCount = computed(() => {
        return activeVerifiers.value.length;
    });

    // Actions
    /**
     * Obtiene todos los verificadores desde el API.
     * @returns {Promise} Una promesa que se resuelve cuando se obtienen los verificadores.
     */
    function fetchVerifiers() {
        return verifierApi.getVerifiers().then(response => {
            verifiers.value = VerifierAssembler.toEntitiesFromResponse(response);
            verifiersLoaded.value = true;
            console.log('verifiersLoaded', verifiersLoaded.value);
            console.log(verifiers.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Obtiene los verificadores de un administrador específico.
     * @param {number} adminId - El ID del administrador.
     * @returns {Promise} Una promesa que se resuelve cuando se obtienen los verificadores.
     */
    function fetchVerifiersByAdminId(adminId) {
        return verifierApi.getVerifiersByAdminId(adminId).then(response => {
            verifiers.value = VerifierAssembler.toEntitiesFromResponse(response);
            verifiersLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Obtiene un verificador por su ID.
     * @param {string|number} id - El ID del verificador.
     * @returns {Verifier|null} La entidad verificador o null si no se encuentra.
     */
    function getVerifierById(id) {
        let idInt = parseInt(id);
        return verifiers.value.find(verifier => verifier["id"] === idInt);
    }

    /**
     * Agrega un nuevo verificador.
     * @param {Object} verifierCommand - El comando para crear el verificador.
     */
    function addVerifier(verifierCommand) {
        verifierApi.createVerifier(verifierCommand).then(response => {
            const resource = response.data;
            const newVerifier = VerifierAssembler.toEntityFromResource(resource);
            verifiers.value.push(newVerifier);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Actualiza un verificador existente.
     * @param {Object} verifierCommand - El comando para actualizar el verificador.
     */
    function updateVerifier(verifierCommand) {
        verifierApi.updateVerifier(verifierCommand).then(response => {
            const resource = response.data;
            const updatedVerifier = VerifierAssembler.toEntityFromResource(resource);
            const index = verifiers.value.findIndex(v => v["id"] === updatedVerifier.id);
            if (index !== -1) verifiers.value[index] = updatedVerifier;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Elimina un verificador.
     * @param {number} verifierId - El ID del verificador a eliminar.
     */
    function deleteVerifier(verifierId) {
        verifierApi.deleteVerifier(verifierId).then(response => {
            const index = verifiers.value.findIndex(v => v["id"] === verifierId);
            if (index !== -1) verifiers.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Obtiene las órdenes asignadas a un verificador.
     * @param {number} verifierId - El ID del verificador.
     * @returns {Promise} Una promesa con las órdenes asignadas.
     */
    function fetchAssignedOrders(verifierId) {
        return verifierApi.getAssignedOrders(verifierId).then(response => {
            return response.data;
        }).catch(error => {
            errors.value.push(error);
            return [];
        });
    }

    return {
        verifiers,
        errors,
        verifiersLoaded,
        verifiersCount,
        activeVerifiers,
        activeVerifiersCount,
        fetchVerifiers,
        fetchVerifiersByAdminId,
        getVerifierById,
        addVerifier,
        updateVerifier,
        deleteVerifier,
        fetchAssignedOrders
    }
});

export default useVerifierStore;
