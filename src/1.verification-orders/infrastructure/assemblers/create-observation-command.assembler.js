/**
 * Assembler para transformar CreateObservationCommand a recurso HTTP.
 * Responsabilidad única: mapping Command → Resource HTTP.
 * 
 * @class CreateObservationCommandAssembler
 */
export class CreateObservationCommandAssembler {
  /**
   * Convierte un CreateObservationCommand a recurso HTTP para la API.
   * @param {CreateObservationCommand} command - Comando de creación de observación
   * @returns {Object} Recurso HTTP para enviar al backend
   */
  static toResourceFromCommand(command) {
    if (!command) {
      throw new Error('CreateObservationCommandAssembler: command no puede ser null o undefined');
    }

    return {
      observationType: command.observationType,
      description: command.description
    };
  }
}
