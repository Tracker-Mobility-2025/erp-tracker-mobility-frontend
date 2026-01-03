import { IAdminRepository } from '../../domain/repositories/admin.repository.interface.js';
import { AdminApi } from '../admin.api.js';

/**
 * Implementación HTTP del repositorio de administradores.
 * Adaptador que conecta el dominio con la API REST (Arquitectura Hexagonal).
 * 
 * @class AdminHttpRepository
 * @extends {IAdminRepository}
 */
export class AdminHttpRepository extends IAdminRepository {
  #api;

  constructor() {
    super();
    this.#api = new AdminApi();
  }

  /**
   * Busca un administrador por ID de usuario.
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object|null>} Administrador encontrado o null
   */
  async findByUserId(userId) {
    const response = await this.#api.getAdminByUserId(userId);
    return response.data || null;
  }

  /**
   * Obtiene todos los administradores.
   * @returns {Promise<Array<Object>>} Lista de administradores
   */
  async findAll() {
    const response = await this.#api.getAllAdmins();
    return response.data || [];
  }

  /**
   * Busca un administrador por su ID.
   * @param {number} id - ID del administrador
   * @returns {Promise<Object|null>} Administrador encontrado o null
   */
  async findById(id) {
    const response = await this.#api.getAdminById(id);
    return response.data || null;
  }
}
