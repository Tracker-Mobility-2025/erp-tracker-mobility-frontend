import { IVerificationReportRepository } from '../../domain/repositories/verification-report.repository.interface.js';
import { VerificationReportApi } from '../verification-report.api.js';
import { VerificationReportAssembler } from '../verification-report.assembler.js';

/**
 * Implementación HTTP del repositorio de reportes de verificación.
 * Adaptador que conecta el dominio con la API REST.
 * 
 * @class VerificationReportHttpRepository
 * @extends {IVerificationReportRepository}
 */
export class VerificationReportHttpRepository extends IVerificationReportRepository {
  #api;

  constructor() {
    super();
    this.#api = new VerificationReportApi();
  }

  async findAll() {
    const response = await this.#api.getAll();
    return VerificationReportAssembler.toEntities(response.data);
  }

  async findById(id) {
    const response = await this.#api.getById(id);
    return VerificationReportAssembler.toEntity(response.data);
  }

  async save(command) {
    const response = await this.#api.create(command);
    return VerificationReportAssembler.toEntity(response.data);
  }

  async update(command) {
    const response = await this.#api.update(command);
    return VerificationReportAssembler.toEntity(response.data);
  }

  async delete(id) {
    await this.#api.delete(id);
  }
}
