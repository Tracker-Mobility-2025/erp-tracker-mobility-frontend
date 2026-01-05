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

  /**
   * Asigna un verificador a una orden
   * @param {number} orderId - ID de la orden
   * @param {number} verifierId - ID del verificador
   * @param {Date} visitDate - Fecha de visita
   * @param {string} visitTime - Hora de visita
   */
  assignVerifier(orderId, verifierId, visitDate, visitTime) {
    return this.put(`/verification-orders/${orderId}/assign-verifier`, {
      verifierId,
      visitDate,
      visitTime
    });
  }

  /**
   * Actualiza el estado de una orden
   * @param {number} orderId - ID de la orden
   * @param {string} newStatus - Nuevo estado
   */
  updateStatus(orderId, newStatus) {
    return this.put(`/verification-orders/${orderId}/status`, { status: newStatus });
  }

  /**
   * Actualiza la información de la vivienda
   * @param {number} orderId - ID de la orden
   * @param {Object} dwellingData - Datos de la vivienda
   */
  updateDwelling(orderId, dwellingData) {
    return this.put(`/verification-orders/${orderId}/dwelling`, dwellingData);
  }

  /**
   * Actualiza la información de la zona
   * @param {number} orderId - ID de la orden
   * @param {Object} zoneData - Datos de la zona
   */
  updateZone(orderId, zoneData) {
    return this.put(`/verification-orders/${orderId}/zone`, zoneData);
  }

  /**
   * Actualiza la información de ubicación
   * @param {number} orderId - ID de la orden
   * @param {Object} locationData - Datos de ubicación
   */
  updateLocation(orderId, locationData) {
    return this.put(`/verification-orders/${orderId}/location`, locationData);
  }
}
