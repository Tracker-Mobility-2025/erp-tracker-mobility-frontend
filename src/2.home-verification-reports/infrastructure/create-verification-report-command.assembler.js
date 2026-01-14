import { DateFormatter } from '../../shared-v2/utils/date-formatter.js';

/**
 * Assembler para convertir CreateVerificationReportCommand a resource DTO.
 * Responsabilidad: transformar Command del dominio a formato esperado por la API.
 */
export class CreateVerificationReportCommandAssembler {
  /**
   * Convierte un Command a recurso para la API.
   * @param {CreateVerificationReportCommand} command - El comando a transformar
   * @returns {Object} Recurso en formato API
   */
  static toResource(command) {
    if (!command) {
      throw new Error('Command es requerido');
    }

    return {
      orderId: command.orderId,
      verifierName: command.verifierName,
      addressLocation: command.addressLocation,
      visitDate: command.visitDate instanceof Date 
        ? DateFormatter.dateObjectToBackend(command.visitDate)
        : command.visitDate,
      clientName: command.clientName,
      clientLastName: command.clientLastName,
      clientDocumentType: command.clientDocumentType,
      clientDocumentNumber: command.clientDocumentNumber,
      addressDepartment: command.addressDepartment,
      addressProvince: command.addressProvince,
      addressDistrict: command.addressDistrict,
      addressStreet: command.addressStreet
    };
  }
}
