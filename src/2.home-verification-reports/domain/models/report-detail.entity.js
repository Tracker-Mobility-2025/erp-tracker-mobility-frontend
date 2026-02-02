/**
 * Sub-entidades y Value Objects para Report
 */

/**
 * Información de residencia del cliente
 */
export class ResidenceInfo {
  constructor({ livesWith, isResident, timeLivingText }) {
    this.livesWith = livesWith || '';
    this.isResident = isResident === true;
    this.timeLivingText = timeLivingText || '';
  }

  /**
   * Verifica si vive solo
   * @returns {boolean}
   */
  liveAlone() {
    return this.livesWith && this.livesWith.toLowerCase().includes('solo');
  }

  /**
   * Verifica si vive con familia
   * @returns {boolean}
   */
  livesWithFamily() {
    const familyKeywords = ['familia', 'padres', 'esposa', 'esposo', 'hijos', 'hijo', 'hermanos'];
    const livesWithLower = this.livesWith.toLowerCase();
    return familyKeywords.some(keyword => livesWithLower.includes(keyword));
  }

  /**
   * Obtiene el tiempo de residencia en formato legible
   * @returns {string}
   */
  getFormattedTime() {
    return this.timeLivingText || 'No especificado';
  }

  /**
   * Verifica si la información de residencia está completa
   * @returns {boolean}
   */
  isComplete() {
    return !!(this.livesWith && this.timeLivingText);
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
    this.residenceType = residenceType || '';
    this.dwellingType = dwellingType || '';
    this.apartmentInformation = apartmentInformation || '';
    this.typeFurnished = typeFurnished || '';
    this.roofType = roofType || '';
    this.dwellingMaterial = dwellingMaterial || '';
    this.dwellingCondition = dwellingCondition || '';
    this.facadeColor = facadeColor || '';
  }

  /**
   * Verifica si es vivienda propia
   * @returns {boolean}
   */
  isOwned() {
    return this.residenceType && this.residenceType.toUpperCase() === 'PROPIA';
  }

  /**
   * Verifica si es vivienda alquilada
   * @returns {boolean}
   */
  isRented() {
    return this.residenceType && this.residenceType.toUpperCase() === 'ALQUILADA';
  }

  /**
   * Verifica si es vivienda familiar
   * @returns {boolean}
   */
  isFamily() {
    return this.residenceType && this.residenceType.toUpperCase() === 'FAMILIAR';
  }

  /**
   * Verifica si la vivienda está en buenas condiciones
   * @returns {boolean}
   */
  isInGoodCondition() {
    return this.dwellingCondition && this.dwellingCondition.toUpperCase() === 'BUENO';
  }

  /**
   * Verifica si la vivienda tiene condiciones precarias
   * @returns {boolean}
   */
  isPrecarious() {
    return this.dwellingCondition && this.dwellingCondition.toUpperCase() === 'PRECARIA';
  }

  /**
   * Verifica si es de material noble
   * @returns {boolean}
   */
  isNoble() {
    return this.dwellingMaterial && this.dwellingMaterial.toUpperCase() === 'NOBLE';
  }

  /**
   * Obtiene una descripción resumida de la vivienda
   * @returns {string}
   */
  getSummary() {
    const parts = [
      this.dwellingType,
      this.residenceType,
      this.dwellingCondition
    ].filter(part => part && part.trim() !== '');
    return parts.join(' - ');
  }

  /**
   * Verifica si la información está completa
   * @returns {boolean}
   */
  isComplete() {
    return !!(
      this.residenceType &&
      this.dwellingType &&
      this.dwellingMaterial &&
      this.dwellingCondition
    );
  }
}

/**
 * Información de la zona
 */
export class ZoneInfo {
  constructor({ zoneType, zoneCharacteristics, areaRisk, accessType }) {
    this.zoneType = zoneType || '';
    this.zoneCharacteristics = zoneCharacteristics || [];
    this.areaRisk = areaRisk || [];
    this.accessType = accessType || '';
  }

  /**
   * Verifica si es zona urbana
   * @returns {boolean}
   */
  isUrban() {
    return this.zoneType && this.zoneType.toUpperCase() === 'URBANA';
  }

  /**
   * Verifica si es zona comercial
   * @returns {boolean}
   */
  isCommercial() {
    return this.zoneType && this.zoneType.toUpperCase() === 'COMERCIAL';
  }

  /**
   * Verifica si tiene riesgos de seguridad
   * @returns {boolean}
   */
  hasSecurityRisks() {
    const dangerousRisks = ['PRESENCIA_DELINCUENCIAL', 'ZONA_PELIGROSA', 'TRANSITA_CON_CAUTELA'];
    return this.areaRisk.some(risk => dangerousRisks.includes(risk));
  }

  /**
   * Verifica si es zona segura
   * @returns {boolean}
   */
  isSafe() {
    return this.areaRisk.includes('NINGUNO') || this.areaRisk.length === 0;
  }

  /**
   * Verifica si el acceso es fácil
   * @returns {boolean}
   */
  hasEasyAccess() {
    return this.accessType && this.accessType.toUpperCase() === 'FACIL';
  }

  /**
   * Verifica si el acceso es difícil o inaccesible
   * @returns {boolean}
   */
  hasDifficultAccess() {
    const difficult = ['DIFICIL', 'INACCESIBLE'];
    return this.accessType && difficult.includes(this.accessType.toUpperCase());
  }

  /**
   * Obtiene nivel de riesgo (1-5, siendo 5 el más alto)
   * @returns {number}
   */
  getRiskLevel() {
    if (this.areaRisk.includes('ZONA_PELIGROSA')) return 5;
    if (this.areaRisk.includes('PRESENCIA_DELINCUENCIAL')) return 4;
    if (this.areaRisk.includes('TRANSITA_CON_CAUTELA')) return 3;
    if (this.areaRisk.includes('NINGUNO')) return 1;
    return 2;
  }

  /**
   * Verifica si la información está completa
   * @returns {boolean}
   */
  isComplete() {
    return !!(this.zoneType && this.accessType);
  }
}

/**
 * Información del garaje
 */
export class GarageInfo {
  constructor({ garageType, distanceToDwelling }) {
    this.garageType = garageType || '';
    this.distanceToDwelling = distanceToDwelling || '';
  }

  /**
   * Verifica si tiene garaje
   * @returns {boolean}
   */
  hasGarage() {
    return this.garageType && this.garageType.toUpperCase() !== 'NO_TIENE';
  }

  /**
   * Verifica si el garaje es propio
   * @returns {boolean}
   */
  isOwned() {
    return this.garageType && this.garageType.toUpperCase() === 'PROPIA';
  }

  /**
   * Verifica si el garaje es alquilado
   * @returns {boolean}
   */
  isRented() {
    return this.garageType && this.garageType.toUpperCase() === 'ALQUILADA';
  }

  /**
   * Verifica si el garaje está cerca de la vivienda
   * @returns {boolean}
   */
  isNearby() {
    const nearbyDistances = ['INSIDE_DWELLING', 'SAME_BUILDING', 'NEARBY'];
    return this.distanceToDwelling && nearbyDistances.includes(this.distanceToDwelling);
  }
}

/**
 * Referencia de contacto
 */
export class ContactReference {
  constructor({ id, fullName, phoneNumber, relation }) {
    this.id = id;
    this.fullName = fullName || '';
    this.phoneNumber = phoneNumber || '';
    this.relation = relation || '';
  }

  /**
   * Verifica si es un familiar
   * @returns {boolean}
   */
  isFamily() {
    const familyRelations = ['padre', 'madre', 'hermano', 'hermana', 'hijo', 'hija', 'esposo', 'esposa', 'tio', 'tia'];
    const relationLower = this.relation.toLowerCase();
    return familyRelations.some(rel => relationLower.includes(rel));
  }

  /**
   * Verifica si la información está completa
   * @returns {boolean}
   */
  isComplete() {
    return !!(this.fullName && this.phoneNumber && this.relation);
  }

  /**
   * Obtiene representación formateada
   * @returns {string}
   */
  formatted() {
    return `${this.fullName} (${this.relation}) - ${this.phoneNumber}`;
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
    this.clientNameAccordingToLandlord = clientNameAccordingToLandlord || '';
    this.ownHome = ownHome || '';
    this.servicesPaidByClient = servicesPaidByClient || '';
    this.isTheClientPunctualWithPayments = isTheClientPunctualWithPayments || '';
    this.timeLivingAccordingToLandlord = timeLivingAccordingToLandlord || '';
    this.floorOccupiedByClient = floorOccupiedByClient || '';
    this.interviewObservation = interviewObservation || '';
  }

  /**
   * Verifica si la entrevista está completa
   * @returns {boolean}
   */
  isComplete() {
    return !!(
      this.clientNameAccordingToLandlord &&
      this.ownHome &&
      this.servicesPaidByClient &&
      this.isTheClientPunctualWithPayments &&
      this.timeLivingAccordingToLandlord &&
      this.floorOccupiedByClient
    );
  }

  /**
   * Verifica si el cliente es puntual con los pagos
   * @returns {boolean}
   */
  clientIsPunctual() {
    return this.isTheClientPunctualWithPayments && 
           this.isTheClientPunctualWithPayments.toLowerCase().includes('sí');
  }

  /**
   * Verifica si el arrendador es propietario
   * @returns {boolean}
   */
  landlordOwnsProperty() {
    return this.ownHome && this.ownHome.toLowerCase().includes('sí');
  }

  /**
   * Obtiene campos faltantes
   * @returns {string[]}
   */
  getMissingFields() {
    const fields = [];
    if (!this.clientNameAccordingToLandlord) fields.push('Nombre del cliente según arrendador');
    if (!this.ownHome) fields.push('Casa propia');
    if (!this.servicesPaidByClient) fields.push('Servicios pagados por el cliente');
    if (!this.isTheClientPunctualWithPayments) fields.push('Puntualidad en pagos');
    if (!this.timeLivingAccordingToLandlord) fields.push('Tiempo viviendo');
    if (!this.floorOccupiedByClient) fields.push('Piso ocupado');
    return fields;
  }
}

/**
 * Item genérico (observaciones, glosario, casuística)
 */
export class ReportItem {
  constructor({ id, value }) {
    this.id = id;
    this.value = value || '';
  }

  /**
   * Verifica si el item tiene contenido
   * @returns {boolean}
   */
  hasContent() {
    return this.value && this.value.trim() !== '';
  }

  /**
   * Obtiene la longitud del valor
   * @returns {number}
   */
  getLength() {
    return this.value ? this.value.length : 0;
  }

  /**
   * Verifica si el valor es largo (más de 100 caracteres)
   * @returns {boolean}
   */
  isLongText() {
    return this.getLength() > 100;
  }

  /**
   * Obtiene un resumen del valor (primeros 50 caracteres)
   * @returns {string}
   */
  getSummary() {
    if (this.getLength() <= 50) return this.value;
    return this.value.substring(0, 47) + '...';
  }

  /**
   * Verifica si está vacío
   * @returns {boolean}
   */
  isEmpty() {
    return !this.hasContent();
  }
}

/**
 * Adjunto del reporte
 */
export class ReportAttachment {
  constructor({ id, url, type }) {
    this.id = id;
    this.url = url || '';
    this.type = type || '';

    // Validar URL si está presente
    if (this.url && !this.isValidUrl()) {
      console.warn(`URL potencialmente inválida en adjunto ${id}: ${url}`);
    }
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

  /**
   * Verifica si la URL es válida
   * @returns {boolean}
   */
  isValidUrl() {
    if (!this.url) return false;
    try {
      new URL(this.url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene la extensión del archivo desde la URL
   * @returns {string}
   */
  getFileExtension() {
    if (!this.url) return '';
    const parts = this.url.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  /**
   * Verifica si el adjunto es accesible (tiene URL válida)
   * @returns {boolean}
   */
  isAccessible() {
    return this.isValidUrl() && this.url !== '';
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
    orderId,
    verifierName,
    addressLocation,
    visitDate,
    finalResult,
    isResultValid,
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
    // Validaciones básicas
    if (!reportId) {
      throw new Error('El ID del reporte es requerido');
    }
    if (!reportCode || reportCode.trim() === '') {
      throw new Error('El código del reporte es requerido');
    }

    this.reportId = reportId;
    this.reportCode = reportCode;
    this.orderId = orderId;
    this.verifierName = verifierName;
    this.addressLocation = addressLocation;
    this.visitDate = visitDate;
    this.finalResult = finalResult;
    this.isResultValid = isResultValid;
    
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

  /**
   * Obtiene fotos del anexo 01 (candidato)
   */
  get annexe01Photos() {
    return this.attachments.filter(att => att.type === 'ANEXO_1');
  }

  /**
   * Obtiene fotos del anexo 02 (domicilio)
   */
  get annexe02Photos() {
    return this.attachments.filter(att => att.type === 'ANEXO_2');
  }

  /**
   * Obtiene fotos del anexo 03 (cochera)
   */
  get annexe03Photos() {
    return this.attachments.filter(att => att.type === 'ANEXO_3');
  }

  /**
   * Obtiene fotos del anexo 04 (habitaciones)
   */
  get annexe04Photos() {
    return this.attachments.filter(att => att.type === 'ANEXO_4');
  }

  /**
   * Obtiene fotos del anexo 05 (alrededores)
   */
  get annexe05Photos() {
    return this.attachments.filter(att => att.type === 'ANEXO_5');
  }

  /**
   * Obtiene fotos del anexo 06 (otros)
   */
  get annexe06Photos() {
    return this.attachments.filter(att => att.type === 'ANEXO_6');
  }

  /**
   * Obtiene descripción del anexo 01
   */
  get annexe01Description() {
    return '';
  }

  /**
   * Obtiene descripción del anexo 02
   */
  get annexe02Description() {
    return '';
  }

  /**
   * Obtiene descripción del anexo 03
   */
  get annexe03Description() {
    return '';
  }

  /**
   * Obtiene descripción del anexo 04
   */
  get annexe04Description() {
    return '';
  }

  /**
   * Obtiene descripción del anexo 05
   */
  get annexe05Description() {
    return '';
  }

  /**
   * Obtiene descripción del anexo 06
   */
  get annexe06Description() {
    return '';
  }
}
