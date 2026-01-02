import { Verifier } from '../domain/models/verifier.entity.js';

/**
 * Clase assembler para convertir recursos de verificadores a entidades.
 */
export class VerifierAssembler {
  /**
   * Convierte un recurso de verificador a una entidad Verifier.
   * @param {Object} resource - Los datos del recurso de verificador.
   * @returns {Verifier} La entidad Verifier ensamblada.
   */
  static toEntityFromResource(resource) {
    return new Verifier({ ...resource });
  }

  /**
   * Convierte una respuesta del API a un array de entidades Verifier.
   * @param {Object} response - El objeto de respuesta del API.
   * @param {number} response.status - El código de estado HTTP.
   * @param {string} response.statusText - El texto de estado HTTP.
   * @param {Object|Array} response.data - Los datos de respuesta conteniendo verificadores.
   * @returns {Verifier[]} Un array de entidades Verifier.
   */
  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`);
      return [];
    }
    let resources = response.data instanceof Array ? response.data : response.data["verifiers"];

    return resources.map(resource => this.toEntityFromResource(resource));
  }
}
