import {BaseApi} from "../../shared-v2/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared-v2/infrastructure/base-endpoint.js";
import {CreateVerifierCommandAssembler} from "./create-verifier-command.assembler.js";
import {UpdateVerifierCommandAssembler} from "./update-verifier-command.assembler.js";

const verifierEndpointPath = '/verifiers';

/**
 * Servicio API para gestionar recursos de Verifier.
 * Extiende BaseApi para proporcionar operaciones CRUD para verificadores.
 * 
 * @class VerifierApi
 * @extends {BaseApi}
 */
export class VerifierApi extends BaseApi {

    #verifierEndpoint;

    constructor() {
        super();
        this.#verifierEndpoint = new BaseEndpoint(this, verifierEndpointPath);
    }

    /**
     * Obtiene todos los verificadores desde la API.
     * @returns {Promise} Una promesa que se resuelve con la respuesta de verificadores.
     */
    getVerifiers() {
        return this.#verifierEndpoint.getAll();
    }

    /**
     * Obtiene un verificador por ID.
     * @param {string|number} id - El ID del verificador.
     * @returns {Promise} Una promesa que se resuelve con la respuesta del verificador.
     */
    getVerifierById(id) {
        return this.#verifierEndpoint.getById(id);
    }

    /**
     * Obtiene todos los verificadores asociados a un administrador específico.
     * @param {string|number} adminId - El ID del administrador.
     * @returns {Promise} Una promesa que se resuelve con la respuesta de verificadores del admin.
     */
    getVerifiersByAdminId(adminId) {
        return this.http.get(`${verifierEndpointPath}/admin/${adminId}`);
    }

    /**
     * Crea un nuevo verificador usando un CreateVerifierCommand.
     * @param {CreateVerifierCommand} command - El comando de creación de verificador.
     * @returns {Promise} Una promesa que se resuelve con la respuesta del verificador creado.
     */
    createVerifier(command) {
        const resource = CreateVerifierCommandAssembler.toResourceFromCommand(command);
        return this.#verifierEndpoint.create(resource);
    }

    /**
     * Actualiza un verificador existente usando un UpdateVerifierCommand.
     * @param {UpdateVerifierCommand} command - El comando de actualización de verificador.
     * @returns {Promise} Una promesa que se resuelve con la respuesta del verificador actualizado.
     */
    updateVerifier(command) {
        const resource = UpdateVerifierCommandAssembler.toResourceFromCommand(command);
        return this.#verifierEndpoint.update(command.id, resource);
    }

    /**
     * Elimina un verificador por ID.
     * @param {string|number} id - El ID del verificador a eliminar.
     * @returns {Promise} Una promesa que se resuelve cuando el verificador es eliminado.
     */
    deleteVerifier(id) {
        return this.#verifierEndpoint.delete(id);
    }

    /**
     * Obtiene las órdenes asignadas a un verificador específico.
     * @param {string|number} verifierId - El ID del verificador.
     * @returns {Promise} Una promesa que se resuelve con las órdenes asignadas al verificador.
     */
    getAssignedOrders(verifierId) {
        return this.http.get(`${verifierEndpointPath}/${verifierId}/orders`);
    }
}
