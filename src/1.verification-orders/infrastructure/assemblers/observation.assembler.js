import { Observation } from '../../domain/models/observation.entity.js';

/**
 * Assembler para transformar recursos HTTP a entidades de dominio de observaciones.
 * Responsabilidad única: mapping bidireccional (resource ↔ entity).
 */
export class ObservationAssembler {
  /**
   * Convierte un recurso HTTP a entidad de dominio
   * @param {Object} resource - Objeto del backend
   * @returns {Observation}
   */
  static toEntity(resource) {
    if (!resource) {
      throw new Error('Resource no puede ser null o undefined');
    }

    return new Observation({
      id: resource.id,
      orderId: resource.orderId,
      observationType: resource.observationType,
      description: resource.description,
      status: resource.status,
      createdDate: resource.createdDate ? new Date(resource.createdDate) : null,
      resolvedDate: resource.resolvedDate ? new Date(resource.resolvedDate) : null
    });
  }

  /**
   * Convierte un array de recursos a entidades
   * @param {Array<Object>} resources - Array de objetos del backend
   * @returns {Array<Observation>}
   */
  static toEntities(resources) {
    if (!Array.isArray(resources)) {
      throw new Error('ObservationAssembler.toEntities: resources debe ser un array');
    }
    
    return resources
      .map(resource => {
        try {
          return this.toEntity(resource);
        } catch (error) {
          console.warn('[ObservationAssembler] Registro inválido omitido:', error.message);
          return null;
        }
      })
      .filter(item => item !== null);
  }
}
