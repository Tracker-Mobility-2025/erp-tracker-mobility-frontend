import { IReportRepository } from '../../domain/repositories/report.repository.interface.js';
import { ReportApi } from '../report.api.js';
import { ReportSummaryAssembler } from '../assemblers/report-summary.assembler.js';
import { ReportAssembler } from '../report.assembler.js';

/**
 * Implementación HTTP del repositorio de reportes.
 * Adaptador que conecta el dominio con la API REST (Arquitectura Hexagonal).
 * 
 * @class ReportHttpRepository
 * @extends {IReportRepository}
 */
export class ReportHttpRepository extends IReportRepository {
  #api;

  constructor() {
    super();
    this.#api = new ReportApi();
  }

  /**
   * Obtiene todos los reportes resumidos.
   * @returns {Promise<Array<ReportSummary>>} Lista de reportes resumidos
   */
  async findAllSummaries() {
    const response = await this.#api.getAllSummaries();
    return ReportSummaryAssembler.toEntities(response.data);
  }

  /**
   * Obtiene un reporte completo por ID.
   * @param {number} id - ID del reporte
   * @returns {Promise<Report>} Reporte encontrado
   */
  async findById(id) {
    const response = await this.#api.getById(id);
    return ReportAssembler.toEntity(response.data);
  }
}
