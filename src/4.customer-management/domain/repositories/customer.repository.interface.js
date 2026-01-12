/**
 * Interface del repositorio de clientes.
 * Define el contrato sin implementación (Puerto en Arquitectura Hexagonal).
 */
export class ICustomerRepository {
  async findAll() {
    throw new Error('Method not implemented: findAll');
  }

  async findAllByAdminId(adminId) {
    throw new Error('Method not implemented: findAllByAdminId');
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

  async findEmployeesByCustomerId(customerId) {
    throw new Error('Method not implemented: findEmployeesByCustomerId');
  }

  async createEmployee(employeeData) {
    throw new Error('Method not implemented: createEmployee');
  }

  async updateEmployee(employeeId, employeeData) {
    throw new Error('Method not implemented: updateEmployee');
  }

  async deleteEmployee(employeeId) {
    throw new Error('Method not implemented: deleteEmployee');
  }
}
