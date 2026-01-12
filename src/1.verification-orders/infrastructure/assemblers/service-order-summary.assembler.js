import { ServiceOrderSummary } from '../../domain/models/service-order-summary.entity.js';

/**
 * Assembler para transformar recursos HTTP a entidades ServiceOrderSummary.
 * Responsabilidad única: mapping bidireccional (resource ↔ entity).
 */
export class ServiceOrderSummaryAssembler {
  /**
   * Convierte un recurso HTTP a entidad ServiceOrderSummary
   * @param {Object} resource - Recurso del backend
   * @returns {ServiceOrderSummary}
   */
  static toEntity(resource) {
    if (!resource) {
      throw new Error('Resource no puede ser null o undefined');
    }

    return new ServiceOrderSummary({
      id: resource.id,
      orderCode: resource.orderCode,
      clientName: resource.clientName,
      status: resource.status,
      companyName: resource.companyName,
      verifierId: resource.verifierId,
      verifierName: resource.verifierName,
      visitDate: resource.visitDate ? new Date(resource.visitDate) : null
    });
  }

  /**
   * Convierte un array de recursos a entidades
   * @param {Array<Object>} resources - Array de recursos del backend
   * @returns {Array<ServiceOrderSummary>}
   */
  static toEntities(resources) {
    if (!Array.isArray(resources)) {
      throw new Error('ServiceOrderSummaryAssembler.toEntities: resources debe ser un array');
    }

    return resources
      .map(resource => {
        try {
          return this.toEntity(resource);
        } catch (error) {
          console.warn('[ServiceOrderSummaryAssembler] Registro inválido omitido:', error.message);
          return null;
        }
      })
      .filter(item => item !== null);
  }
}
