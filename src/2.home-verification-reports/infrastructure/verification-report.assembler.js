import { VerificationReport } from '../domain/models/verification-report.entity.js';

/**
 * Assembler para transformar recursos HTTP a entidades de dominio.
 */
export class VerificationReportAssembler {
  static toEntity(resource) {
    return new VerificationReport({
      id: resource.id,
      // TODO: Mapear propiedades del resource a la entidad
    });
  }

  static toEntities(resources) {
    if (!Array.isArray(resources)) {
      throw new Error('VerificationReportAssembler.toEntities: resources debe ser un array');
    }
    
    return resources
      .map(resource => {
        try {
          return this.toEntity(resource);
        } catch (error) {
          console.warn('[VerificationReportAssembler] Registro inválido omitido:', error.message);
          return null;
        }
      })
      .filter(item => item !== null);
  }
}
