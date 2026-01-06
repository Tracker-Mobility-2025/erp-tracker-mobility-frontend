/**
 * Assembler para convertir CreateVerificationOrderCommand a resource DTO.
 * Infrastructure layer - Data transformation
 * Responsabilidad: Serializar Commands del dominio al formato esperado por la API.
 * 
 * @class CreateVerificationOrderCommandAssembler
 */
export class CreateVerificationOrderCommandAssembler {
  /**
   * Convierte un CreateVerificationOrderCommand a un objeto resource para la API.
   * @param {CreateVerificationOrderCommand} command - El comando de creación de orden.
   * @returns {Object} El objeto resource formateado para la API.
   */
  static toResource(command) {
    return {
      orderCode: command.orderCode?.value || command.orderCode,
      status: command.status,
      requestDate: command.requestDate,
      clientId: command.clientId,
      applicantCompanyId: command.applicantCompanyId,
      verifierId: command.verifierId,
      visitDate: command.visitDate,
      visitTime: command.visitTime,
      notes: command.notes
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
