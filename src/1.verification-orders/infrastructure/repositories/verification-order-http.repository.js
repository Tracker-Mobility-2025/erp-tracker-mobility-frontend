import { IVerificationOrderRepository } from '../../domain/repositories/verification-order.repository.interface.js';
import { VerificationOrderApi } from '../verification-order.api.js';
import { VerificationOrderAssembler } from '../verification-order.assembler.js';

/**
 * Implementación HTTP del repositorio de órdenes de verificación.
 * Adaptador que conecta el dominio con la API REST.
 * 
 * @class VerificationOrderHttpRepository
 * @extends {IVerificationOrderRepository}
 */
export class VerificationOrderHttpRepository extends IVerificationOrderRepository {
  #api;

  constructor() {
    super();
    this.#api = new VerificationOrderApi();
  }

  async findAll() {
    const response = await this.#api.getAll();
    return VerificationOrderAssembler.toEntities(response.data);
  }

  async findById(id) {
    const response = await this.#api.getById(id);
    return VerificationOrderAssembler.toEntity(response.data);
  }

  async save(command) {
    const response = await this.#api.create(command);
    return VerificationOrderAssembler.toEntity(response.data);
  }

  async update(command) {
    const response = await this.#api.update(command);
    return VerificationOrderAssembler.toEntity(response.data);
  }

  async delete(id) {
    await this.#api.delete(id);
  }

  /**
   * Asigna un verificador a una orden
   * @param {number} orderId - ID de la orden
   * @param {number} verifierId - ID del verificador
   * @param {Date} visitDate - Fecha de visita
   * @param {string} visitTime - Hora de visita
   * @returns {Promise<VerificationOrder>}
   */
  async assignVerifier(orderId, verifierId, visitDate, visitTime) {
    const response = await this.#api.assignVerifier(orderId, verifierId, visitDate, visitTime);
    return VerificationOrderAssembler.toEntity(response.data);
  }

  /**
   * Actualiza el estado de una orden
   * @param {number} orderId - ID de la orden
   * @param {string} newStatus - Nuevo estado
   * @returns {Promise<VerificationOrder>}
   */
  async updateStatus(orderId, newStatus) {
    const response = await this.#api.updateStatus(orderId, newStatus);
    return VerificationOrderAssembler.toEntity(response.data);
  }

  /**
   * Actualiza la información de la vivienda
   * @param {number} orderId - ID de la orden
   * @param {Object} dwellingData - Datos de la vivienda
   * @returns {Promise<Dwelling>}
   */
  async updateDwelling(orderId, dwellingData) {
    const response = await this.#api.updateDwelling(orderId, dwellingData);
    return response.data;
  }

  /**
   * Actualiza la información de la zona
   * @param {number} orderId - ID de la orden
   * @param {Object} zoneData - Datos de la zona
   * @returns {Promise<Zone>}
   */
  async updateZone(orderId, zoneData) {
    const response = await this.#api.updateZone(orderId, zoneData);
    return response.data;
  }

  /**
   * Actualiza la información de ubicación
   * @param {number} orderId - ID de la orden
   * @param {Object} locationData - Datos de ubicación
   * @returns {Promise<Location>}
   */
  async updateLocation(orderId, locationData) {
    const response = await this.#api.updateLocation(orderId, locationData);
    return response.data;
  }
}
