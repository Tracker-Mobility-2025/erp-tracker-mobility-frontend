export class VerificationRequest {
    constructor(
        {
            id = 0,
            orderCode = "",
            status = "",
            requestDate = "",
            client = null,
            applicantCompany = null,
            observations = []
        } = {}
    ) {
        this.id = id;
        this.orderCode = orderCode;
        this.status = status;
        this.requestDate = requestDate;
        this.client = client ? new ClientDetails(client) : null;
        this.applicantCompany = applicantCompany ? new ApplicantCompanyDetails(applicantCompany) : null;
        this.observations = observations.map(obs => new Observation(obs));
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
            landlord = null,
            location = null
        } = {}
    ) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.identityDocument = identityDocument ? new IdentityDocument(identityDocument) : null;
        this.isTenant = isTenant;
        this.documents = documents.map(doc => new Document(doc));
        this.landlord = landlord ? new Landlord(landlord) : null;
        this.location = location ? new Location(location) : null;
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
            phoneNumber = ""
        } = {}
    ) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
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
            status = ""
        } = {}
    ) {
        this.id = id;
        this.orderId = orderId;
        this.observationType = observationType;
        this.description = description;
        this.status = status;
    }
}

