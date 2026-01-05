import { IVerifierRepository } from '../../domain/repositories/verifier.repository.interface.js';
import { VerifierApi } from '../verifier.api.js';
import { VerifierAssembler } from '../assemblers/verifier.assembler.js';

/**
 * Implementación HTTP del repositorio de verificadores.
 * Adaptador que conecta el dominio con la API REST (Arquitectura Hexagonal).
 * 
 * @class VerifierHttpRepository
 * @extends {IVerifierRepository}
 */
export class VerifierHttpRepository extends IVerifierRepository {
  #api;

  constructor() {
    super();
    this.#api = new VerifierApi();
  }

  /**
   * Obtiene todos los verificadores desde la API.
   * @returns {Promise<Array<Verifier>>} Lista de verificadores
   */
  async findAll() {
    const response = await this.#api.getVerifiers();
    return VerifierAssembler.toEntities(response.data);
  }

  /**
   * Busca un verificador por su ID.
   * @param {number} id - ID del verificador
   * @returns {Promise<Verifier>} Verificador encontrado
   */
  async findById(id) {
    const response = await this.#api.getVerifierById(id);
    return VerifierAssembler.toEntity(response.data);
  }

  /**
   * Busca verificadores por ID del administrador.
   * @param {number} adminId - ID del administrador
   * @returns {Promise<Array<Verifier>>} Lista de verificadores del admin
   */
  async findByAdminId(adminId) {
    const response = await this.#api.getVerifiersByAdminId(adminId);
    return VerifierAssembler.toEntities(response.data);
  }

  /**
   * Guarda un nuevo verificador.
   * @param {CreateVerifierCommand} command - Command con datos del verificador
   * @returns {Promise<Verifier>} Verificador creado
   */
  async save(command) {
    const response = await this.#api.createVerifier(command);
    return VerifierAssembler.toEntity(response.data);
  }

  /**
   * Actualiza un verificador existente.
   * @param {UpdateVerifierCommand} command - Command con datos a actualizar
   * @returns {Promise<Verifier>} Verificador actualizado
   */
  async update(command) {
    const response = await this.#api.updateVerifier(command);
    return VerifierAssembler.toEntity(response.data);
  }

  /**
   * Elimina un verificador por su ID.
   * @param {number} id - ID del verificador
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.#api.deleteVerifier(id);
  }

  /**
   * Obtiene las órdenes asignadas a un verificador.
   * @param {number} verifierId - ID del verificador
   * @returns {Promise<Array>} Lista de órdenes asignadas
   */
  async findAssignedOrders(verifierId) {
    const response = await this.#api.getAssignedOrders(verifierId);
    return response.data; // TODO: OrderAssembler cuando se implemente
  }
}
