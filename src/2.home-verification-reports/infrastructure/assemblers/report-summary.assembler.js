import { ReportSummary } from '../../domain/models/report.entity.js';

/**
 * Assembler para transformar DTOs de resumen de reportes a entidades de dominio.
 */
export class ReportSummaryAssembler {
  /**
   * Convierte un DTO del API a una entidad ReportSummary.
   */
  static toEntity(dto) {
    if (!dto) return null;

    return new ReportSummary({
      reportId: dto.reportId,
      reportCode: dto.reportCode,
      finalResult: dto.finalResult,
      orderCode: dto.orderCode,
      requestDate: dto.requestDate,
      clientName: dto.clientName,
      companyName: dto.companyName
    });
  }

  /**
   * Convierte un array de DTOs a un array de entidades.
   */
  static toEntities(dtos) {
    if (!Array.isArray(dtos)) return [];
    return dtos.map(dto => this.toEntity(dto)).filter(entity => entity !== null);
  }

  /**
   * Convierte una entidad a un DTO (si es necesario para actualizaciones).
   */
  static toDto(entity) {
    if (!entity) return null;

    return {
      reportId: entity.reportId,
      reportCode: entity.reportCode,
      finalResult: entity.finalResult,
      orderCode: entity.orderCode,
      requestDate: entity.requestDate,
      clientName: entity.clientName,
      companyName: entity.companyName
    };
  }
}
