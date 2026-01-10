// Order Request Entity
// Domain layer - Core business entity

/**
 * Entidad que representa una solicitud de orden de verificación
 */
export class OrderRequest {
  constructor({
    id = null,
    orderCode = null,
    status = null,
    createdAt = null,
    // Client data
    clientName = null,
    clientLastName = null,
    clientDocumentType = null,
    clientDocumentNumber = null,
    clientPhoneNumber = null,
    clientHomeAddress = null,
    clientDepartment = null,
    clientProvince = null,
    clientDistrict = null,
    clientMapLocation = null,
    clientIsTenant = false,
    clientLandlordName = null,
    clientLandlordPhoneNumber = null,
    clientDocuments = [],
    // Applicant company data
    applicantCompanyId = null,
    applicantCompanyName = null,
    applicantCompanyRuc = null,
    applicantCompanyEmail = null,
    applicantCompanyPhone = null,
    applicantCompanyExecutiveName = null
  } = {}) {
    this.id = id;
    this.orderCode = orderCode;
    this.status = status;
    this.createdAt = createdAt;
    
    // Client info
    this.clientName = clientName;
    this.clientLastName = clientLastName;
    this.clientDocumentType = clientDocumentType;
    this.clientDocumentNumber = clientDocumentNumber;
    this.clientPhoneNumber = clientPhoneNumber;
    this.clientHomeAddress = clientHomeAddress;
    this.clientDepartment = clientDepartment;
    this.clientProvince = clientProvince;
    this.clientDistrict = clientDistrict;
    this.clientMapLocation = clientMapLocation;
    this.clientIsTenant = clientIsTenant;
    this.clientLandlordName = clientLandlordName;
    this.clientLandlordPhoneNumber = clientLandlordPhoneNumber;
    this.clientDocuments = clientDocuments;
    
    // Company info
    this.applicantCompanyId = applicantCompanyId;
    this.applicantCompanyName = applicantCompanyName;
    this.applicantCompanyRuc = applicantCompanyRuc;
    this.applicantCompanyEmail = applicantCompanyEmail;
    this.applicantCompanyPhone = applicantCompanyPhone;
    this.applicantCompanyExecutiveName = applicantCompanyExecutiveName;
  }
}

/**
 * Modelo para datos del cliente en el formulario
 */
export class ClientFormData {
  constructor({
    name = "",
    lastName = "",
    documentType = "",
    documentNumber = "",
    phoneNumber = "",
    homeAddress = "",
    department = "",
    province = "",
    district = "",
    mapLocation = "",
    isTenant = false,
    landlordName = "",
    landlordPhoneNumber = "",
    documents = []
  } = {}) {
    this.name = name;
    this.lastName = lastName;
    this.documentType = documentType;
    this.documentNumber = documentNumber;
    this.phoneNumber = phoneNumber;
    this.homeAddress = homeAddress;
    this.department = department;
    this.province = province;
    this.district = district;
    this.mapLocation = mapLocation;
    this.isTenant = isTenant;
    this.landlordName = landlordName;
    this.landlordPhoneNumber = landlordPhoneNumber;
    this.documents = documents;
  }
}

/**
 * Modelo para datos de la empresa solicitante
 */
export class ApplicantCompanyData {
  constructor({
    applicantCompanyId = null,
    companyName = null,
    executiveName = null,
    ruc = null,
    corporateEmail = null,
    contactPhoneNumber = null
  } = {}) {
    this.applicantCompanyId = applicantCompanyId;
    this.companyName = companyName;
    this.executiveName = executiveName;
    this.ruc = ruc;
    this.corporateEmail = corporateEmail;
    this.contactPhoneNumber = contactPhoneNumber;
  }
}
