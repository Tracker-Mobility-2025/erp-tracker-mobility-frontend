/**
 * Assembler para transformar AssignVerifierCommand a recurso HTTP.
 * Responsabilidad única: mapping Command → Resource HTTP.
 * 
 * @class AssignVerifierCommandAssembler
 */
export class AssignVerifierCommandAssembler {
  /**
   * Convierte un AssignVerifierCommand a recurso HTTP para la API.
   * @param {AssignVerifierCommand} command - Comando de asignación de verificador
   * @returns {Object} Recurso HTTP para enviar al backend
   */
  static toResourceFromCommand(command) {
    if (!command) {
      throw new Error('AssignVerifierCommandAssembler: command no puede ser null o undefined');
    }

    // Convertir visitDate a formato backend (yyyy-MM-dd) si es un objeto Date
    let visitDateFormatted = command.visitDate;
    if (command.visitDate instanceof Date) {
      const year = command.visitDate.getFullYear();
      const month = String(command.visitDate.getMonth() + 1).padStart(2, '0');
      const day = String(command.visitDate.getDate()).padStart(2, '0');
      visitDateFormatted = `${year}-${month}-${day}`;
    }

    return {
      verifierId: command.verifierId,
      visitDate: visitDateFormatted,
      visitTime: command.visitTime
    };
  }
}
