import { VerificationOrder } from '../domain/models/verification-order.entity.js';

/**
 * Assembler para transformar recursos HTTP a entidades de dominio.
 */
export class VerificationOrderAssembler {
  static toEntity(resource) {
    return new VerificationOrder({
      id: resource.id,
      // TODO: Mapear propiedades del resource a la entidad
    });
  }

  static toEntities(resources) {
    if (!Array.isArray(resources)) {
      throw new Error('VerificationOrderAssembler.toEntities: resources debe ser un array');
    }
    
    return resources
      .map(resource => {
        try {
          return this.toEntity(resource);
        } catch (error) {
          console.warn('[VerificationOrderAssembler] Registro inválido omitido:', error.message);
          return null;
        }
      })
      .filter(item => item !== null);
  }
}
