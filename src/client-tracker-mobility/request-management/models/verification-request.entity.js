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

export class Landlord {
    constructor({ fullName = null, phoneNumber = null } = {}) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
    }
}

export class Location {
    constructor({
                    department = null,
                    province = null,
                    district = null,
                    homeAddress = null,
                    mapLocation = null
                } = {}) {
        this.department = department;
        this.province = province;
        this.district = district;
        this.homeAddress = homeAddress;
        this.mapLocation = mapLocation;
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
                    landlord = null,
                    location = null
                } = {}) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.identityDocument = identityDocument ? new IdentityDocument(identityDocument) : null;
        this.isTenant = isTenant;
        this.documents = documents.map(d => new Document(d));
        this.landlord = landlord ? new Landlord(landlord) : null;
        this.location = location ? new Location(location) : null;
    }

    // Retornar el nombre completo del cliente
    getFullName() {
        return `${this.name} ${this.lastName}`;
    }
}

export class ApplicantCompany {
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

// ---------------------
// CLASE PRINCIPAL
// ---------------------

export class VerificationRequest {
    constructor({
                    id = null,
                    orderCode = null,
                    status = null,
                    requestDate = null,
                    client = null,
                    applicantCompany = null,
                    observations = null
                } = {}) {
        this.id = id;
        this.orderCode = orderCode;
        this.status = status;
        this.requestDate = requestDate;
        this.client = client ? new Client(client) : null;
        this.applicantCompany = applicantCompany ? new ApplicantCompany(applicantCompany) : null;
        this.observations = observations;
    }
}
