import { Verifier } from '../domain/models/verifier.entity.js';

/**
 * Assembler para transformar recursos HTTP a entidades de dominio.
 * Responsabilidad única: mapping bidireccional (resource ↔ entity).
 * NO maneja errores HTTP, NO toma decisiones de negocio.
 */
export class VerifierAssembler {
  /**
   * Convierte un recurso de verificador a una entidad Verifier.
   * @param {Object} resource - Los datos del recurso de verificador.
   * @returns {Verifier} La entidad Verifier ensamblada.
   * @throws {Error} Si la entidad no puede ser construida (validación de VOs)
   */
  static toEntity(resource) {
    const entity = new Verifier({
      id: resource.id,
      email: resource.email,
      phoneNumber: resource.phoneNumber,
      agenda: resource.agenda,
      role: resource.role,
      status: resource.status,
      name: resource.name,
      lastName: resource.lastName,
      adminId: resource.adminId
    });
    
    return entity;
  }

  /**
   * Convierte múltiples recursos a entidades Verifier.
   * @param {Array<Object>} resources - Array de recursos de verificadores.
   * @returns {Array<Verifier>} Array de entidades Verifier.
   * @throws {Error} Si resources no es un array
   */
  static toEntities(resources) {
    if (!Array.isArray(resources)) {
      throw new Error('VerifierAssembler.toEntities: resources debe ser un array');
    }
    
    const entities = resources
      .map(resource => {
        try {
          return this.toEntity(resource);
        } catch (error) {
          console.warn('Verificador inválido omitido:', error.message, resource);
          return null;
        }
      })
      .filter(verifier => verifier !== null);
    
    console.log('🔧 [VerifierAssembler.toEntities] Output entities count:', entities.length);
    console.log('🔧 [VerifierAssembler.toEntities] Output entities:', entities);
    return entities;
  }
}
