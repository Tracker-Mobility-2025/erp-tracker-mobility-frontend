/**
 * Assembler para convertir CreateOrderRequestCommand a resource DTO.
 * Infrastructure layer - transforma Command de dominio a formato API.
 */
export class CreateOrderRequestCommandAssembler {
  /**
   * Convierte CreateOrderRequestCommand a formato API resource (estructura plana esperada por backend)
   * @param {CreateOrderRequestCommand} command - Command a convertir
   * @returns {Object} Resource DTO para enviar a la API
   */
  static toResource(command) {
    const resource = {
      // Applicant Company (estructura plana)
      companyName: command.applicantCompanyName,
      companyExecutiveName: command.applicantCompanyExecutiveName,
      companyRuc: command.applicantCompanyRuc,
      companyEmail: command.applicantCompanyEmail,
      companyPhoneNumber: command.applicantCompanyPhone,
      brandName: command.applicantCompanyBrandName,
      
      // Client Personal Data (estructura plana)
      clientName: command.clientName,
      clientLastName: command.clientLastName,
      clientPhoneNumber: command.clientPhoneNumber,
      clientDocumentType: command.clientDocumentType,
      clientDocumentNumber: command.clientDocumentNumber,
      isTenant: command.clientIsTenant,
      
      // Landlord (null si no es inquilino)
      landlordName: command.clientLandlordName,
      landlordPhoneNumber: command.clientLandlordPhoneNumber,
      
      // Address (estructura plana)
      addressDepartment: command.clientDepartment,
      addressProvince: command.clientProvince,
      addressDistrict: command.clientDistrict,
      addressStreet: command.clientHomeAddress,
      addressLocation: command.clientMapLocation,
      
      // Document Types (array plano de strings)
      documentTypes: command.clientDocuments.map(doc => doc.type)
    };
    
    return resource;
  }
}
