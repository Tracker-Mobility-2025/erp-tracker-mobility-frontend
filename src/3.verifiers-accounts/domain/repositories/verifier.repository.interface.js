/**
 * Interface del repositorio de verificadores.
 * Define el contrato sin implementación (Puerto en Arquitectura Hexagonal).
 * La capa de dominio define WHAT, la infraestructura implementa HOW.
 * 
 * @interface IVerifierRepository
 */
export class IVerifierRepository {
  /**
   * Obtiene todos los verificadores.
   * @returns {Promise<Array<Verifier>>} Lista de verificadores
   * @throws {Error} Method not implemented
   */
  async findAll() {
    throw new Error('Method not implemented: findAll');
  }

  /**
   * Busca un verificador por su ID.
   * @param {number} id - ID del verificador
   * @returns {Promise<Verifier|null>} Verificador encontrado o null
   * @throws {Error} Method not implemented
   */
  async findById(id) {
    throw new Error('Method not implemented: findById');
  }

  /**
   * Busca verificadores por ID del administrador.
   * @param {number} adminId - ID del administrador
   * @returns {Promise<Array<Verifier>>} Lista de verificadores del admin
   * @throws {Error} Method not implemented
   */
  async findByAdminId(adminId) {
    throw new Error('Method not implemented: findByAdminId');
  }

  /**
   * Guarda un nuevo verificador.
   * @param {CreateVerifierCommand} command - Command con datos del verificador
   * @returns {Promise<Verifier>} Verificador creado
   * @throws {Error} Method not implemented
   */
  async save(command) {
    throw new Error('Method not implemented: save');
  }

  /**
   * Actualiza un verificador existente.
   * @param {UpdateVerifierCommand} command - Command con datos a actualizar
   * @returns {Promise<Verifier>} Verificador actualizado
   * @throws {Error} Method not implemented
   */
  async update(command) {
    throw new Error('Method not implemented: update');
  }

  /**
   * Elimina un verificador por su ID.
   * @param {number} id - ID del verificador
   * @returns {Promise<void>}
   * @throws {Error} Method not implemented
   */
  async delete(id) {
    throw new Error('Method not implemented: delete');
  }

  /**
   * Obtiene las órdenes asignadas a un verificador.
   * @param {number} verifierId - ID del verificador
   * @returns {Promise<Array>} Lista de órdenes asignadas
   * @throws {Error} Method not implemented
   */
  async findAssignedOrders(verifierId) {
    throw new Error('Method not implemented: findAssignedOrders');
  }
}
