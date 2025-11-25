export class VerificationRequest {
    constructor(
        {
            id = 0,
            orderCode = "",
            status = "",
            requestDate = "",
            client = null,
            applicantCompany = null,
            homeVisitDetails = null,
            observations = [],
            reportId = 0
        } = {}
    ) {
        this.id = id;
        this.orderCode = orderCode;
        this.status = status;
        this.requestDate = requestDate;
        this.client = client ? new ClientDetails(client) : null;
        this.applicantCompany = applicantCompany ? new ApplicantCompanyDetails(applicantCompany) : null;
        this.homeVisitDetails = homeVisitDetails ? new HomeVisitDetails(homeVisitDetails) : null;
        this.observations = observations.map(obs => new Observation(obs));
        this.reportId = reportId;
    }
}

export class ClientDetails {
    constructor(
        {
            id = 0,
            name = "",
            lastName = "",
            phoneNumber = "",
            identityDocument = null,
            isTenant = false,
            documents = [],
            contactReferences = [],
            landlord = null,
            dwelling = null,
            location = null,
            residence = null,
            zone = null
        } = {}
    ) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.identityDocument = identityDocument ? new IdentityDocument(identityDocument) : null;
        this.isTenant = isTenant;
        this.documents = documents.map(doc => new Document(doc));
        this.contactReferences = contactReferences.map(ref => new ContactReference(ref));
        this.landlord = landlord ? new Landlord(landlord) : null;
        this.dwelling = dwelling ? new Dwelling(dwelling) : null;
        this.location = location ? new Location(location) : null;
        this.residence = residence ? new Residence(residence) : null;
        this.zone = zone ? new Zone(zone) : null;
    }

    // Método helper para obtener el nombre completo del cliente
    getFullName() {
        return `${this.name} ${this.lastName}`.trim();
    }
}

export class IdentityDocument {
    constructor(
        {
            documentNumber = "",
            documentType = ""
        } = {}
    ) {
        this.documentNumber = documentNumber;
        this.documentType = documentType;
    }
}

export class Document {
    constructor(
        {
            id = 0,
            url = "",
            type = ""
        } = {}
    ) {
        this.id = id;
        this.url = url;
        this.type = type;
    }
}

export class Landlord {
    constructor(
        {
            fullName = "",
            phoneNumber = "",
            ownHome = false,
            interviewDetails = null
        } = {}
    ) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.ownHome = ownHome;
        this.interviewDetails = interviewDetails ? new InterviewDetails(interviewDetails) : null;
    }
}

export class Location {
    constructor(
        {
            department = "",
            province = "",
            district = "",
            homeAddress = "",
            mapLocation = ""
        } = {}
    ) {
        this.department = department;
        this.province = province;
        this.district = district;
        this.homeAddress = homeAddress;
        this.mapLocation = mapLocation;
    }
}

export class ApplicantCompanyDetails {
    constructor(
        {
            applicantCompanyId = 0,
            companyName = "",
            executiveName = "",
            ruc = "",
            corporateEmail = "",
            contactPhoneNumber = ""
        } = {}
    ) {
        this.applicantCompanyId = applicantCompanyId;
        this.companyName = companyName;
        this.executiveName = executiveName;
        this.ruc = ruc;
        this.corporateEmail = corporateEmail;
        this.contactPhoneNumber = contactPhoneNumber;
    }
}

export class Observation {
    constructor(
        {
            id = 0,
            orderId = 0,
            observationType = "",
            description = "",
            status = "",
            createdDate = null,
            resolvedDate = null
        } = {}
    ) {
        this.id = id;
        this.orderId = orderId;
        this.observationType = observationType;
        this.description = description;
        this.status = status;
        this.createdDate = createdDate;
        this.resolvedDate = resolvedDate;
    }
}

export class ContactReference {
    constructor(
        {
            id = 0,
            fullName = "",
            phoneNumber = "",
            relation = ""
        } = {}
    ) {
        this.id = id;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.relation = relation;
    }
}

export class InterviewDetails {
    constructor(
        {
            clientNameAccordingToLandlord = "",
            servicesPaidByClient = [],
            isTheClientPunctualWithPayments = false,
            time = 0,
            timeType = "",
            floorOccupiedByClient = 0
        } = {}
    ) {
        this.clientNameAccordingToLandlord = clientNameAccordingToLandlord;
        this.servicesPaidByClient = servicesPaidByClient;
        this.isTheClientPunctualWithPayments = isTheClientPunctualWithPayments;
        this.time = time;
        this.timeType = timeType;
        this.floorOccupiedByClient = floorOccupiedByClient;
    }
}

export class Dwelling {
    constructor(
        {
            dwellingType = "",
            numberFloors = 0,
            floorOccupied = 0,
            facadeColor = "",
            dwellingMaterial = "",
            dwellingCondition = "",
            typeFurnished = "",
            roofType = "",
            garage = null
        } = {}
    ) {
        this.dwellingType = dwellingType;
        this.numberFloors = numberFloors;
        this.floorOccupied = floorOccupied;
        this.facadeColor = facadeColor;
        this.dwellingMaterial = dwellingMaterial;
        this.dwellingCondition = dwellingCondition;
        this.typeFurnished = typeFurnished;
        this.roofType = roofType;
        this.garage = garage ? new Garage(garage) : null;
    }
}

export class Garage {
    constructor(
        {
            garageType = "",
            distanceToDwelling = ""
        } = {}
    ) {
        this.garageType = garageType;
        this.distanceToDwelling = distanceToDwelling;
    }
}

export class Residence {
    constructor(
        {
            livesWith = "",
            isResident = false,
            time = 0,
            timeType = "",
            residenceType = ""
        } = {}
    ) {
        this.livesWith = livesWith;
        this.isResident = isResident;
        this.time = time;
        this.timeType = timeType;
        this.residenceType = residenceType;
    }
}

export class Zone {
    constructor(
        {
            zoneType = "",
            zoneCharacteristics = [],
            accessType = "",
            riskLevel = ""
        } = {}
    ) {
        this.zoneType = zoneType;
        this.zoneCharacteristics = zoneCharacteristics;
        this.accessType = accessType;
        this.riskLevel = riskLevel;
    }
}

export class HomeVisitDetails {
    constructor(
        {
            verifierId = 0,
            verifierFullName = "",
            visitDate = "",
            visitTime = ""
        } = {}
    ) {
        this.verifierId = verifierId;
        this.verifierFullName = verifierFullName;
        this.visitDate = visitDate;
        this.visitTime = visitTime;
    }
}
