/**
 * Interface del repositorio de clientes.
 * Define el contrato sin implementación (Puerto en Arquitectura Hexagonal).
 * 
 * @interface ICustomerRepository
 */
export class ICustomerRepository {
  async findAll() {
    throw new Error('Method not implemented: findAll');
  }

  async findById(id) {
    throw new Error('Method not implemented: findById');
  }

  async save(command) {
    throw new Error('Method not implemented: save');
  }

  async update(command) {
    throw new Error('Method not implemented: update');
  }

  async delete(id) {
    throw new Error('Method not implemented: delete');
  }
}
