/**
 * Assembler para convertir UpdateVerificationReportCommand a resource DTO.
 * Responsabilidad: transformar Command del dominio a formato esperado por la API.
 */
export class UpdateVerificationReportCommandAssembler {
  /**
   * Convierte un Command a recurso para la API.
   * @param {UpdateVerificationReportCommand} command - El comando a transformar
   * @returns {Object} Recurso en formato API
   */
  static toResource(command) {
    if (!command) {
      throw new Error('Command es requerido');
    }

    const resource = {};

    // Solo incluir campos que no sean null
    if (command.verifierName !== null) {
      resource.verifierName = command.verifierName;
    }
    if (command.addressLocation !== null) {
      resource.addressLocation = command.addressLocation;
    }
    if (command.visitDate !== null) {
      resource.visitDate = command.visitDate instanceof Date 
        ? command.visitDate.toISOString() 
        : command.visitDate;
    }
    if (command.finalResult !== null) {
      resource.finalResult = command.finalResult;
    }
    if (command.summary !== null) {
      resource.summary = command.summary;
    }
    if (command.observations !== null) {
      resource.observations = command.observations;
    }

    return resource;
  }
}
