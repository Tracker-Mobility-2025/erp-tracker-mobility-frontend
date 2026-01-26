import { OrderRequestValidators } from '../validators/order-request.validators.js';

/**
 * Command para crear una nueva solicitud de orden.
 * Self-validating: garantiza que los datos sean válidos al momento de construcción.
 * 
 * @class CreateOrderRequestCommand
 */
export class CreateOrderRequestCommand {
  constructor({
    // Client data
    clientName,
    clientLastName,
    clientDocumentType,
    clientDocumentNumber,
    clientPhoneNumber,
    clientHomeAddress,
    clientDepartment,
    clientProvince,
    clientDistrict,
    clientMapLocation = null,
    clientIsTenant = false,
    clientLandlordName = null,
    clientLandlordPhoneNumber = null,
    clientDocuments = [],
    // Applicant company data
    applicantCompanyId,
    applicantCompanyName,
    applicantCompanyRuc,
    applicantCompanyEmail,
    applicantCompanyPhone,
    applicantCompanyExecutiveName,
    applicantCompanyBrandName = null // Nombre de la marca (opcional)
  }) {
    // Validar datos del cliente (obligatorios)
    OrderRequestValidators.validateName(clientName, 'Nombre del cliente');
    OrderRequestValidators.validateName(clientLastName, 'Apellido del cliente');
    OrderRequestValidators.validateDocumentType(clientDocumentType);
    OrderRequestValidators.validateDocumentNumber(clientDocumentNumber, clientDocumentType);
    OrderRequestValidators.validatePhoneNumber(clientPhoneNumber, 'Teléfono del cliente');
    OrderRequestValidators.validateAddress(clientHomeAddress);
    OrderRequestValidators.validateRequiredField(clientDepartment, 'Departamento');
    OrderRequestValidators.validateRequiredField(clientProvince, 'Provincia');
    OrderRequestValidators.validateRequiredField(clientDistrict, 'Distrito');
    
    // Validar datos del arrendador si es inquilino
    if (clientIsTenant) {
      OrderRequestValidators.validateName(clientLandlordName, 'Nombre del arrendador');
      OrderRequestValidators.validatePhoneNumber(clientLandlordPhoneNumber, 'Teléfono del arrendador');
    }
    
    // Validar datos de la empresa solicitante (obligatorios)
    OrderRequestValidators.validateRequiredField(applicantCompanyId, 'ID de empresa solicitante');
    OrderRequestValidators.validateName(applicantCompanyName, 'Razón social');
    OrderRequestValidators.validateRuc(applicantCompanyRuc);
    OrderRequestValidators.validateEmail(applicantCompanyEmail);
    OrderRequestValidators.validatePhoneNumber(applicantCompanyPhone, 'Teléfono de empresa');
    OrderRequestValidators.validateName(applicantCompanyExecutiveName, 'Nombre del ejecutivo');
    
    // Asignar propiedades - Cliente
    this.clientName = clientName.trim();
    this.clientLastName = clientLastName.trim();
    this.clientDocumentType = clientDocumentType;
    this.clientDocumentNumber = clientDocumentNumber.toString().replace(/\s/g, '');
    this.clientPhoneNumber = clientPhoneNumber.toString().replace(/[\s-]/g, '');
    this.clientHomeAddress = clientHomeAddress.trim().substring(0, 300);
    this.clientDepartment = clientDepartment.trim();
    this.clientProvince = clientProvince.trim();
    this.clientDistrict = clientDistrict.trim();
    this.clientMapLocation = clientMapLocation;
    this.clientIsTenant = Boolean(clientIsTenant);
    this.clientLandlordName = clientIsTenant ? clientLandlordName?.trim() : null;
    this.clientLandlordPhoneNumber = clientIsTenant ? clientLandlordPhoneNumber?.toString().replace(/[\s-]/g, '') : null;
    this.clientDocuments = Array.isArray(clientDocuments) ? clientDocuments : [];
    
    // Asignar propiedades - Empresa solicitante
    this.applicantCompanyId = applicantCompanyId;
    this.applicantCompanyName = applicantCompanyName.trim();
    this.applicantCompanyRuc = applicantCompanyRuc.toString().replace(/\s/g, '');
    this.applicantCompanyEmail = applicantCompanyEmail.trim().toLowerCase();
    this.applicantCompanyPhone = applicantCompanyPhone.toString().replace(/[\s-]/g, '');
    this.applicantCompanyExecutiveName = applicantCompanyExecutiveName.trim();
    this.applicantCompanyBrandName = applicantCompanyBrandName ? applicantCompanyBrandName.trim() : null;
  }
}
