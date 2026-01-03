import { BaseApi } from "../../shared-v2/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared-v2/infrastructure/base-endpoint.js";
import { CreateVerificationReportCommandAssembler } from "./create-verification-report-command.assembler.js";
import { UpdateVerificationReportCommandAssembler } from "./update-verification-report-command.assembler.js";

/**
 * Servicio API para gestionar recursos de Verification Report.
 * 
 * @class VerificationReportApi
 * @extends {BaseApi}
 */
export class VerificationReportApi extends BaseApi {
  #endpoint;

  constructor() {
    super();
    this.#endpoint = new BaseEndpoint(this, '/verification-reports'); // TODO: Ajustar ruta API
  }

  getAll() {
    return this.#endpoint.getAll();
  }

  getById(id) {
    return this.#endpoint.getById(id);
  }

  create(command) {
    const resource = CreateVerificationReportCommandAssembler.toResource(command);
    return this.#endpoint.create(resource);
  }

  update(command) {
    const resource = UpdateVerificationReportCommandAssembler.toResource(command);
    return this.#endpoint.update(command.id, resource);
  }

  delete(id) {
    return this.#endpoint.delete(id);
  }
}
