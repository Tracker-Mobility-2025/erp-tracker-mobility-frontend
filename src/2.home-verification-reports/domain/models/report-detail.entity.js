/**
 * Sub-entidades y Value Objects para Report
 */

/**
 * Información de residencia del cliente
 */
export class ResidenceInfo {
  constructor({ livesWith, isResident, timeLivingText }) {
    this.livesWith = livesWith;
    this.isResident = isResident;
    this.timeLivingText = timeLivingText;
  }
}

/**
 * Información de la vivienda
 */
export class DwellingInfo {
  constructor({
    residenceType,
    dwellingType,
    apartmentInformation,
    typeFurnished,
    roofType,
    dwellingMaterial,
    dwellingCondition,
    facadeColor
  }) {
    this.residenceType = residenceType;
    this.dwellingType = dwellingType;
    this.apartmentInformation = apartmentInformation;
    this.typeFurnished = typeFurnished;
    this.roofType = roofType;
    this.dwellingMaterial = dwellingMaterial;
    this.dwellingCondition = dwellingCondition;
    this.facadeColor = facadeColor;
  }
}

/**
 * Información de la zona
 */
export class ZoneInfo {
  constructor({ zoneType, zoneCharacteristics, areaRisk, accessType }) {
    this.zoneType = zoneType;
    this.zoneCharacteristics = zoneCharacteristics || [];
    this.areaRisk = areaRisk || [];
    this.accessType = accessType;
  }
}

/**
 * Información del garaje
 */
export class GarageInfo {
  constructor({ garageType, distanceToDwelling }) {
    this.garageType = garageType;
    this.distanceToDwelling = distanceToDwelling;
  }
}

/**
 * Referencia de contacto
 */
export class ContactReference {
  constructor({ id, fullName, phoneNumber, relation }) {
    this.id = id;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.relation = relation;
  }
}

/**
 * Detalles de entrevista con arrendador
 */
export class InterviewDetails {
  constructor({
    clientNameAccordingToLandlord,
    ownHome,
    servicesPaidByClient,
    isTheClientPunctualWithPayments,
    timeLivingAccordingToLandlord,
    floorOccupiedByClient,
    interviewObservation
  }) {
    this.clientNameAccordingToLandlord = clientNameAccordingToLandlord;
    this.ownHome = ownHome;
    this.servicesPaidByClient = servicesPaidByClient;
    this.isTheClientPunctualWithPayments = isTheClientPunctualWithPayments;
    this.timeLivingAccordingToLandlord = timeLivingAccordingToLandlord;
    this.floorOccupiedByClient = floorOccupiedByClient;
    this.interviewObservation = interviewObservation;
  }
}

/**
 * Item genérico (observaciones, glosario, casuística)
 */
export class ReportItem {
  constructor({ id, value }) {
    this.id = id;
    this.value = value;
  }
}

/**
 * Adjunto del reporte
 */
export class ReportAttachment {
  constructor({ id, url, type }) {
    this.id = id;
    this.url = url;
    this.type = type;
  }

  /**
   * Verifica si es una imagen
   */
  isImage() {
    return this.type && this.type.toLowerCase().includes('image');
  }

  /**
   * Verifica si es un PDF
   */
  isPdf() {
    return this.type && this.type.toLowerCase().includes('pdf');
  }
}

/**
 * Entidad de dominio para reporte de verificación completo.
 * Rich Domain Model con toda la información del reporte.
 */
export class Report {
  constructor({
    reportId,
    reportCode,
    verifierName,
    addressLocation,
    visitDate,
    finalResult,
    companyName,
    companyRuc,
    companyExecutiveName,
    requestDate,
    clientName,
    clientLastName,
    clientDocumentType,
    clientDocumentNumber,
    addressDepartment,
    addressProvince,
    addressDistrict,
    addressStreet,
    residence,
    dwelling,
    zone,
    garage,
    clientFullName,
    exactClientAddress,
    contactReferences,
    landlordName,
    landlordPhoneNumber,
    interviewDetails,
    summary,
    observations,
    glossary,
    casuistics,
    attachments
  }) {
    this.reportId = reportId;
    this.reportCode = reportCode;
    this.verifierName = verifierName;
    this.addressLocation = addressLocation;
    this.visitDate = visitDate;
    this.finalResult = finalResult;
    
    // Datos de la empresa solicitante
    this.companyName = companyName;
    this.companyRuc = companyRuc;
    this.companyExecutiveName = companyExecutiveName;
    this.requestDate = requestDate;
    
    // Datos del cliente
    this.clientName = clientName;
    this.clientLastName = clientLastName;
    this.clientDocumentType = clientDocumentType;
    this.clientDocumentNumber = clientDocumentNumber;
    this.clientFullName = clientFullName;
    
    // Dirección
    this.addressDepartment = addressDepartment;
    this.addressProvince = addressProvince;
    this.addressDistrict = addressDistrict;
    this.addressStreet = addressStreet;
    this.exactClientAddress = exactClientAddress;
    
    // Objetos complejos
    this.residence = residence ? new ResidenceInfo(residence) : null;
    this.dwelling = dwelling ? new DwellingInfo(dwelling) : null;
    this.zone = zone ? new ZoneInfo(zone) : null;
    this.garage = garage ? new GarageInfo(garage) : null;
    this.interviewDetails = interviewDetails ? new InterviewDetails(interviewDetails) : null;
    
    // Referencias y arrendador
    this.contactReferences = (contactReferences || []).map(ref => new ContactReference(ref));
    this.landlordName = landlordName;
    this.landlordPhoneNumber = landlordPhoneNumber;
    
    // Resumen y listas
    this.summary = summary;
    this.observations = (observations || []).map(obs => new ReportItem(obs));
    this.glossary = (glossary || []).map(item => new ReportItem(item));
    this.casuistics = (casuistics || []).map(item => new ReportItem(item));
    this.attachments = (attachments || []).map(att => new ReportAttachment(att));
  }

  /**
   * Valida si la entidad es válida
   */
  isValid() {
    return this.reportId && this.reportCode;
  }

  /**
   * Obtiene el nombre completo del cliente
   */
  getClientFullName() {
    return this.clientFullName || `${this.clientName} ${this.clientLastName}`.trim();
  }

  /**
   * Obtiene la dirección completa
   */
  getFullAddress() {
    return this.exactClientAddress || [
      this.addressStreet,
      this.addressDistrict,
      this.addressProvince,
      this.addressDepartment
    ].filter(Boolean).join(', ');
  }

  /**
   * Obtiene imágenes adjuntas
   */
  getImageAttachments() {
    return this.attachments.filter(att => att.isImage());
  }

  /**
   * Obtiene documentos PDF adjuntos
   */
  getPdfAttachments() {
    return this.attachments.filter(att => att.isPdf());
  }
}
