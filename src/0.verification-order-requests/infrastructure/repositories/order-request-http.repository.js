import { IOrderRequestRepository } from '../../domain/repositories/order-request.repository.interface.js';
import { OrderRequestApi } from '../order-request.api.js';
import { OrderRequestAssembler } from '../order-request.assembler.js';

/**
 * Implementación HTTP del repositorio de solicitudes de orden.
 * Adaptador que conecta el dominio con la API REST.
 * 
 * @class OrderRequestHttpRepository
 * @extends {IOrderRequestRepository}
 */
export class OrderRequestHttpRepository extends IOrderRequestRepository {
  #api;

  constructor() {
    super();
    this.#api = new OrderRequestApi();
  }

  async findAll() {
    const response = await this.#api.getAll();
    return OrderRequestAssembler.toEntities(response.data);
  }

  async findById(id) {
    const response = await this.#api.getById(id);
    return OrderRequestAssembler.toEntity(response.data);
  }

  async save(command) {
    const response = await this.#api.create(command);
    return OrderRequestAssembler.toEntity(response.data);
  }

  async update(command) {
    const response = await this.#api.update(command);
    return OrderRequestAssembler.toEntity(response.data);
  }

  async delete(id) {
    await this.#api.delete(id);
  }
}
