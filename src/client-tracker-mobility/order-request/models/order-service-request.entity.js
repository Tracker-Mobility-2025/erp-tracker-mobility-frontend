// ---------------------
// SUBCLASES
// ---------------------
export class IdentityDocument {
    constructor({ documentNumber = null, documentType = null } = {}) {
        this.documentNumber = documentNumber;
        this.documentType = documentType;
    }
}

export class Document {
    constructor({ id = null, url = null, type = null } = {}) {
        this.id = id;
        this.url = url;
        this.type = type;
    }
}

export class ContactReference {
    constructor({ id = null, fullName = null, phoneNumber = null, relation = null } = {}) {
        this.id = id;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.relation = relation;
    }
}

export class InterviewDetails {
    constructor({
                    clientNameAccordingToLandlord = null,
                    servicesPaidByClient = [],
                    isTheClientPunctualWithPayments = null,
                    time = null,
                    timeType = null,
                    floorOccupiedByClient = null
                } = {}) {
        this.clientNameAccordingToLandlord = clientNameAccordingToLandlord;
        this.servicesPaidByClient = servicesPaidByClient;
        this.isTheClientPunctualWithPayments = isTheClientPunctualWithPayments;
        this.time = time;
        this.timeType = timeType;
        this.floorOccupiedByClient = floorOccupiedByClient;
    }
}

export class Landlord {
    constructor({ fullName = null, phoneNumber = null, ownHome = null, interviewDetails = null } = {}) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.ownHome = ownHome;
        this.interviewDetails = interviewDetails ? new InterviewDetails(interviewDetails) : null;
    }
}

export class Garage {
    constructor({ garageType = null, distanceToDwelling = null } = {}) {
        this.garageType = garageType;
        this.distanceToDwelling = distanceToDwelling;
    }
}

export class Dwelling {
    constructor({
                    dwellingType = null,
                    numberFloors = null,
                    floorOccupied = null,
                    facadeColor = null,
                    dwellingMaterial = null,
                    dwellingCondition = null,
                    typeFurnished = null,
                    roofType = null,
                    homeAddress = null,
                    garage = null
                } = {}) {
        this.dwellingType = dwellingType;
        this.numberFloors = numberFloors;
        this.floorOccupied = floorOccupied;
        this.facadeColor = facadeColor;
        this.dwellingMaterial = dwellingMaterial;
        this.dwellingCondition = dwellingCondition;
        this.typeFurnished = typeFurnished;
        this.roofType = roofType;
        this.homeAddress = homeAddress;
        this.garage = garage ? new Garage(garage) : null;
    }
}

export class Location {
    constructor({ department = null, province = null, district = null, mapLocation = null } = {}) {
        this.department = department;
        this.province = province;
        this.district = district;
        this.mapLocation = mapLocation;
    }
}

export class Residence {
    constructor({ livesWith = null, isResident = null, time = null, timeType = null, residenceType = null } = {}) {
        this.livesWith = livesWith;
        this.isResident = isResident;
        this.time = time;
        this.timeType = timeType;
        this.residenceType = residenceType;
    }
}

export class Zone {
    constructor({ zoneType = null, zoneCharacteristics = [], accessType = null, riskLevel = null } = {}) {
        this.zoneType = zoneType;
        this.zoneCharacteristics = zoneCharacteristics;
        this.accessType = accessType;
        this.riskLevel = riskLevel;
    }
}

export class Client {
    constructor({
                    id = null,
                    name = null,
                    lastName = null,
                    phoneNumber = null,
                    identityDocument = null,
                    isTenant = null,
                    documents = [],
                    contactReferences = [],
                    landlord = null,
                    dwelling = null,
                    location = null,
                    residence = null,
                    zone = null
                } = {}) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.identityDocument = identityDocument ? new IdentityDocument(identityDocument) : null;
        this.isTenant = isTenant;
        this.documents = (documents || []).map(d => new Document(d));
        this.contactReferences = (contactReferences || []).map(c => new ContactReference(c));
        this.landlord = landlord ? new Landlord(landlord) : null;
        this.dwelling = dwelling ? new Dwelling(dwelling) : null;
        this.location = location ? new Location(location) : null;
        this.residence = residence ? new Residence(residence) : null;
        this.zone = zone ? new Zone(zone) : null;
    }
}

export class ApplicantCompany {
    constructor({
                    companyName = null,
                    executiveName = null,
                    ruc = null,
                    corporateEmail = null,
                    contactPhoneNumber = null
                } = {}) {
        this.companyName = companyName;
        this.executiveName = executiveName;
        this.ruc = ruc;
        this.corporateEmail = corporateEmail;
        this.contactPhoneNumber = contactPhoneNumber;
    }
}

export class HomeVisitDetails {
    constructor({ verifierId = null, visitDate = null, visitTime = null } = {}) {
        this.verifierId = verifierId;
        this.visitDate = visitDate;
        this.visitTime = visitTime;
    }
}

export class Observation {
    constructor({ id = null, documentType = null, description = null } = {}) {
        this.id = id;
        this.documentType = documentType;
        this.description = description;
    }
}

export class Report {
    constructor({
                    reportCode = null,
                    finalResult = null,
                    summary = null,
                    observations = [],
                    glossary = [],
                    casuistics = []
                } = {}) {
        this.reportCode = reportCode;
        this.finalResult = finalResult;
        this.summary = summary;
        this.observations = observations || [];
        this.glossary = glossary || [];
        this.casuistics = casuistics || [];
    }
}

// ---------------------
// CLASE PRINCIPAL: ORDER
// ---------------------
export class OrderServiceRequest {
    constructor({
                    id = null,
                    orderCode = null,
                    adminId = null,
                    status = null,
                    requestDate = null,
                    client = null,
                    applicantCompany = null,
                    homeVisitDetails = null,
                    observations = [],
                    report = null
                } = {}) {
        this.id = id;
        this.orderCode = orderCode;
        this.adminId = adminId;
        this.status = status;
        this.requestDate = requestDate;
        this.client = client ? new Client(client) : null;
        this.applicantCompany = applicantCompany ? new ApplicantCompany(applicantCompany) : null;
        this.homeVisitDetails = homeVisitDetails ? new HomeVisitDetails(homeVisitDetails) : null;
        this.observations = (observations || []).map(o => new Observation(o));
        this.report = report ? new Report(report) : null;
    }
}
