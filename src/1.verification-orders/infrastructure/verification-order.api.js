import { BaseApi } from "../../shared-v2/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared-v2/infrastructure/base-endpoint.js";
import { CreateVerificationOrderCommandAssembler } from "./create-verification-order-command.assembler.js";
import { UpdateVerificationOrderCommandAssembler } from "./update-verification-order-command.assembler.js";

/**
 * Servicio API para gestionar recursos de Verification Order.
 * 
 * @class VerificationOrderApi
 * @extends {BaseApi}
 */
export class VerificationOrderApi extends BaseApi {
  #endpoint;

  constructor() {
    super();
    this.#endpoint = new BaseEndpoint(this, '/verification-orders'); // TODO: Ajustar ruta API
  }

  getAll() {
    return this.#endpoint.getAll();
  }

  getById(id) {
    return this.#endpoint.getById(id);
  }

  create(command) {
    const resource = CreateVerificationOrderCommandAssembler.toResource(command);
    return this.#endpoint.create(resource);
  }

  update(command) {
    const resource = UpdateVerificationOrderCommandAssembler.toResource(command);
    return this.#endpoint.update(command.id, resource);
  }

  delete(id) {
    return this.#endpoint.delete(id);
  }
}
