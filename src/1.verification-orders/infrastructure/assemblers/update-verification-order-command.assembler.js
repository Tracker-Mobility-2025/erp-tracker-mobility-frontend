/**
 * Assembler para convertir UpdateVerificationOrderCommand a resource DTO.
 * Infrastructure layer - Data transformation
 * Responsabilidad: Serializar Commands del dominio al formato esperado por la API.
 * 
 * @class UpdateVerificationOrderCommandAssembler
 */
export class UpdateVerificationOrderCommandAssembler {
  /**
   * Convierte un UpdateVerificationOrderCommand a un objeto resource para la API.
   * @param {UpdateVerificationOrderCommand} command - El comando de actualización de orden.
   * @returns {Object} El objeto resource formateado para la API.
   */
  static toResource(command) {
    return {
      status: command.status,
      verifierId: command.verifierId,
      visitDate: command.visitDate,
      visitTime: command.visitTime,
      notes: command.notes,
      reportId: command.reportId
    };
  }

  /**
   * Alias para compatibilidad con código existente.
   * @deprecated Usar toResource() en su lugar
   */
  static toResourceFromCommand(command) {
    return this.toResource(command);
  }
}
