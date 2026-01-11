/**
 * Assembler para convertir UpdateOrderRequestCommand a resource DTO.
 * Infrastructure layer - transforma Command de dominio a formato API.
 */
export class UpdateOrderRequestCommandAssembler {
  /**
   * Convierte UpdateOrderRequestCommand a formato API resource
   * @param {UpdateOrderRequestCommand} command - Command a convertir
   * @returns {Object} Resource DTO para enviar a la API
   */
  static toResource(command) {
    const resource = {
      id: command.id
    };
    
    // Solo incluir campos que fueron actualizados
    if (command.clientName !== undefined) resource.clientName = command.clientName;
    if (command.clientLastName !== undefined) resource.clientLastName = command.clientLastName;
    if (command.clientDocumentType !== undefined) resource.clientDocumentType = command.clientDocumentType;
    if (command.clientDocumentNumber !== undefined) resource.clientDocumentNumber = command.clientDocumentNumber;
    if (command.clientPhoneNumber !== undefined) resource.clientPhoneNumber = command.clientPhoneNumber;
    if (command.clientHomeAddress !== undefined) resource.clientHomeAddress = command.clientHomeAddress;
    if (command.clientDepartment !== undefined) resource.clientDepartment = command.clientDepartment;
    if (command.clientProvince !== undefined) resource.clientProvince = command.clientProvince;
    if (command.clientDistrict !== undefined) resource.clientDistrict = command.clientDistrict;
    if (command.clientMapLocation !== undefined) resource.clientMapLocation = command.clientMapLocation;
    if (command.clientIsTenant !== undefined) resource.clientIsTenant = command.clientIsTenant;
    if (command.clientLandlordName !== undefined) resource.clientLandlordName = command.clientLandlordName;
    if (command.clientLandlordPhoneNumber !== undefined) resource.clientLandlordPhoneNumber = command.clientLandlordPhoneNumber;
    if (command.status !== undefined) resource.status = command.status;
    
    return resource;
  }
}
