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
}
