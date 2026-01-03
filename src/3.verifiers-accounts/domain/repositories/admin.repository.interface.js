/**
 * Interface del repositorio de administradores.
 * Define el contrato sin implementación (Puerto en Arquitectura Hexagonal).
 * La capa de dominio define WHAT, la infraestructura implementa HOW.
 * 
 * @interface IAdminRepository
 */
export class IAdminRepository {
  /**
   * Busca un administrador por ID de usuario.
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object|null>} Administrador encontrado o null
   * @throws {Error} Method not implemented
   */
  async findByUserId(userId) {
    throw new Error('Method not implemented: findByUserId');
  }

  /**
   * Obtiene todos los administradores.
   * @returns {Promise<Array<Object>>} Lista de administradores
   * @throws {Error} Method not implemented
   */
  async findAll() {
    throw new Error('Method not implemented: findAll');
  }

  /**
   * Busca un administrador por su ID.
   * @param {number} id - ID del administrador
   * @returns {Promise<Object|null>} Administrador encontrado o null
   * @throws {Error} Method not implemented
   */
  async findById(id) {
    throw new Error('Method not implemented: findById');
  }
}
