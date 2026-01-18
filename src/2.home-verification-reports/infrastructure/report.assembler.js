import { Report } from '../domain/models/report-detail.entity.js';

/**
 * Assembler para transformar recursos HTTP de reportes completos a entidades de dominio.
 * Responsabilidad única: mapping bidireccional (resource ↔ entity).
 * NO maneja errores HTTP, NO toma decisiones de negocio.
 */
export class ReportAssembler {
  /**
   * Convierte un recurso de reporte completo a una entidad Report.
   * @param {Object} resource - Los datos del recurso del reporte.
   * @returns {Report} La entidad Report ensamblada.
   * @throws {Error} Si la entidad no puede ser construida
   */
  static toEntity(resource) {
    if (!resource) return null;

    return new Report({
      reportId: resource.reportId,
      reportCode: resource.reportCode,
      orderId: resource.orderId,
      verifierName: resource.verifierName,
      addressLocation: resource.addressLocation,
      visitDate: resource.visitDate,
      finalResult: resource.finalResult,
      isResultValid: resource.isResultValid,
      companyName: resource.companyName,
      companyRuc: resource.companyRuc,
      companyExecutiveName: resource.companyExecutiveName,
      requestDate: resource.requestDate,
      clientName: resource.clientName,
      clientLastName: resource.clientLastName,
      clientDocumentType: resource.clientDocumentType,
      clientDocumentNumber: resource.clientDocumentNumber,
      addressDepartment: resource.addressDepartment,
      addressProvince: resource.addressProvince,
      addressDistrict: resource.addressDistrict,
      addressStreet: resource.addressStreet,
      residence: resource.residence,
      dwelling: resource.dwelling,
      zone: resource.zone,
      garage: resource.garage,
      clientFullName: resource.clientFullName,
      exactClientAddress: resource.exactClientAddress,
      contactReferences: resource.contactReferences,
      landlordName: resource.landlordName,
      landlordPhoneNumber: resource.landlordPhoneNumber,
      interviewDetails: resource.interviewDetails,
      summary: resource.summary,
      observations: resource.observations,
      glossary: resource.glossary,
      casuistics: resource.casuistics,
      attachments: resource.attachments
    });
  }

  /**
   * Convierte múltiples recursos a entidades Report.
   * @param {Array<Object>} resources - Array de recursos de reportes.
   * @returns {Array<Report>} Array de entidades Report.
   * @throws {Error} Si resources no es un array
   */
  static toEntities(resources) {
    if (!Array.isArray(resources)) {
      throw new Error('ReportAssembler.toEntities: resources debe ser un array');
    }
    
    return resources
      .map(resource => {
        try {
          return this.toEntity(resource);
        } catch (error) {
          console.warn('[ReportAssembler] Reporte inválido omitido:', error.message);
          return null;
        }
      })
      .filter(report => report !== null);
  }

  /**
   * Convierte una entidad Report a un DTO para envío a la API.
   * @param {Report} entity - La entidad Report.
   * @returns {Object} DTO para la API
   */
  static toDTO(entity) {
    if (!entity) return null;

    return {
      reportId: entity.reportId,
      reportCode: entity.reportCode,
      orderId: entity.orderId,
      verifierName: entity.verifierName,
      addressLocation: entity.addressLocation,
      visitDate: entity.visitDate,
      finalResult: entity.finalResult,
      companyName: entity.companyName,
      companyRuc: entity.companyRuc,
      companyExecutiveName: entity.companyExecutiveName,
      requestDate: entity.requestDate,
      clientName: entity.clientName,
      clientLastName: entity.clientLastName,
      clientDocumentType: entity.clientDocumentType,
      clientDocumentNumber: entity.clientDocumentNumber,
      addressDepartment: entity.addressDepartment,
      addressProvince: entity.addressProvince,
      addressDistrict: entity.addressDistrict,
      addressStreet: entity.addressStreet,
      clientFullName: entity.clientFullName,
      exactClientAddress: entity.exactClientAddress,
      landlordName: entity.landlordName,
      landlordPhoneNumber: entity.landlordPhoneNumber,
      summary: entity.summary
    };
  }
}


