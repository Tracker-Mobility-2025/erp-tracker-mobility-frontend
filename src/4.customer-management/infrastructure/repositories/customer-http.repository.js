import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface.js';
import { CustomerApi } from '../customer.api.js';
import { CustomerAssembler } from '../customer.assembler.js';

/**
 * Implementación HTTP del repositorio de clientes.
 * Adaptador que conecta el dominio con la API REST.
 * 
 * @class CustomerHttpRepository
 * @extends {ICustomerRepository}
 */
export class CustomerHttpRepository extends ICustomerRepository {
  #api;

  constructor() {
    super();
    this.#api = new CustomerApi();
  }

  async findAll() {
    const response = await this.#api.getAll();
    return CustomerAssembler.toEntities(response.data);
  }

  async findById(id) {
    const response = await this.#api.getById(id);
    return CustomerAssembler.toEntity(response.data);
  }

  async save(command) {
    const response = await this.#api.create(command);
    return CustomerAssembler.toEntity(response.data);
  }

  async update(command) {
    const response = await this.#api.update(command);
    return CustomerAssembler.toEntity(response.data);
  }

  async delete(id) {
    await this.#api.delete(id);
  }
}
