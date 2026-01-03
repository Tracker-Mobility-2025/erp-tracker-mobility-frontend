/**
 * Interface del repositorio de solicitudes de orden.
 * Define el contrato sin implementación (Puerto en Arquitectura Hexagonal).
 * 
 * @interface IOrderRequestRepository
 */
export class IOrderRequestRepository {
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
