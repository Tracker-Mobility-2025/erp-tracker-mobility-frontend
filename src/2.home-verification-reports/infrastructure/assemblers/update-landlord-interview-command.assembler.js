/**
 * Assembler para convertir UpdateLandlordInterviewCommand a resource DTO.
 * Responsabilidad: transformar Command del dominio a formato esperado por la API.
 */
export class UpdateLandlordInterviewCommandAssembler {
  /**
   * Convierte un Command a recurso para la API.
   * @param {UpdateLandlordInterviewCommand} command - El comando a transformar
   * @returns {Object} Recurso en formato API
   */
  static toResource(command) {
    if (!command) {
      throw new Error('Command es requerido');
    }

    // Mapeo de nombres del Command a nombres del API
    return {
      clientNameAccordingToLandlord: command.tenantName,
      ownHome: command.ownHouse,
      servicesPaidByClient: command.serviceClientPays,
      isTheClientPunctualWithPayments: command.clientPaysPunctual,
      timeLivingAccordingToLandlord: command.clientRentalTime,
      floorOccupiedByClient: command.clientFloorNumber,
      interviewObservation: command.interviewObservation
    };
  }
}
