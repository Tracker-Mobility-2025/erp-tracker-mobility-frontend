// =======================
// MODELOS PARA RESPUESTA DE ORDEN DE SERVICIO
// =======================

// Documento de identidad del cliente
export class IdentityDocument {
    constructor({
        documentNumber = null,
        documentType = null
    } = {}) {
        this.documentNumber = documentNumber;
        this.documentType = documentType;
    }
}

// Documento adjunto
export class Document {
    constructor({
        id = null,
        url = null,
        type = null
    } = {}) {
        this.id = id;
        this.url = url;
        this.type = type;
    }
}

// Referencia de contacto
export class ContactReference {
    constructor({
        id = null,
        fullName = null,
        phoneNumber = null,
        relation = null
    } = {}) {
        this.id = id;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.relation = relation;
    }
}

// Detalles de entrevista del arrendador
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
        this.servicesPaidByClient = servicesPaidByClient || [];
        this.isTheClientPunctualWithPayments = isTheClientPunctualWithPayments;
        this.time = time;
        this.timeType = timeType;
        this.floorOccupiedByClient = floorOccupiedByClient;
    }
}

// Información del arrendador
export class Landlord {
    constructor({
        fullName = null,
        phoneNumber = null,
        ownHome = null,
        interviewDetails = null
    } = {}) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.ownHome = ownHome;
        this.interviewDetails = interviewDetails ? new InterviewDetails(interviewDetails) : null;
    }
}

// Información del garaje
export class Garage {
    constructor({
        garageType = null,
        distanceToDwelling = null
    } = {}) {
        this.garageType = garageType;
        this.distanceToDwelling = distanceToDwelling;
    }
}

// Información de la vivienda
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

// Información de ubicación
export class Location {
    constructor({
        department = null,
        province = null,
        district = null,
        mapLocation = null
    } = {}) {
        this.department = department;
        this.province = province;
        this.district = district;
        this.mapLocation = mapLocation;
    }
}

// Información de residencia
export class Residence {
    constructor({
        livesWith = null,
        isResident = null,
        time = null,
        timeType = null,
        residenceType = null
    } = {}) {
        this.livesWith = livesWith;
        this.isResident = isResident;
        this.time = time;
        this.timeType = timeType;
        this.residenceType = residenceType;
    }
}

// Información de la zona
export class Zone {
    constructor({
        zoneType = null,
        zoneCharacteristics = [],
        accessType = null,
        riskLevel = null
    } = {}) {
        this.zoneType = zoneType;
        this.zoneCharacteristics = zoneCharacteristics || [];
        this.accessType = accessType;
        this.riskLevel = riskLevel;
    }
}

// Cliente completo con toda la información
export class ClientResponse {
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
        this.documents = (documents || []).map(doc => new Document(doc));
        this.contactReferences = (contactReferences || []).map(ref => new ContactReference(ref));
        this.landlord = landlord ? new Landlord(landlord) : null;
        this.dwelling = dwelling ? new Dwelling(dwelling) : null;
        this.location = location ? new Location(location) : null;
        this.residence = residence ? new Residence(residence) : null;
        this.zone = zone ? new Zone(zone) : null;
    }
}

// Empresa solicitante
export class ApplicantCompanyResponse {
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

// Detalles de visita domiciliaria
export class HomeVisitDetailsResponse {
    constructor({
        verifierId = null,
        visitDate = null,
        visitTime = null
    } = {}) {
        this.verifierId = verifierId;
        this.visitDate = visitDate;
        this.visitTime = visitTime;
    }
}

// Observaciones
export class ObservationResponse {
    constructor({
        id = null,
        documentType = null,
        description = null
    } = {}) {
        this.id = id;
        this.documentType = documentType;
        this.description = description;
    }
}

// =======================
// MODELO PRINCIPAL: RESPUESTA DE ORDEN
// =======================
export class OrderResponse {
    constructor({
        id = null,
        orderCode = null,
        status = null,
        requestDate = null,
        client = null,
        applicantCompany = null,
        homeVisitDetails = null,
        observations = []
    } = {}) {
        this.id = id;
        this.orderCode = orderCode;
        this.status = status;
        this.requestDate = requestDate;
        this.client = client ? new ClientResponse(client) : null;
        this.applicantCompany = applicantCompany ? new ApplicantCompanyResponse(applicantCompany) : null;
        this.homeVisitDetails = homeVisitDetails ? new HomeVisitDetailsResponse(homeVisitDetails) : null;
        this.observations = (observations || []).map(obs => new ObservationResponse(obs));
    }

    // Métodos utilitarios
    get clientFullName() {
        return this.client ? `${this.client.name || ''} ${this.client.lastName || ''}`.trim() : '';
    }

    get clientAddress() {
        if (!this.client?.location) return '';
        const { homeAddress } = this.client.dwelling || {};
        const { district, province, department } = this.client.location;
        
        const parts = [homeAddress, district, province, department].filter(Boolean);
        return parts.join(', ');
    }

    get isClientTenant() {
        return this.client?.isTenant || false;
    }

    get landlordInfo() {
        return this.client?.landlord || null;
    }

    get dwellingInfo() {
        return this.client?.dwelling || null;
    }

    get zoneInfo() {
        return this.client?.zone || null;
    }

    // Método para verificar si la orden está completada
    get isCompleted() {
        return this.status === 'COMPLETADO' || this.status === 'FINALIZADO';
    }

    // Método para verificar si está pendiente
    get isPending() {
        return this.status === 'PENDIENTE';
    }

    // Método para verificar si está asignado
    get isAssigned() {
        return this.status === 'ASIGNADO';
    }

    // Método para obtener la fecha formateada con manejo correcto de zona horaria
    get formattedRequestDate() {
        if (!this.requestDate) return '';
        
        try {
            let date;
            
            // Manejar diferentes formatos de fecha del backend
            if (typeof this.requestDate === 'string') {
                // Si la fecha no tiene información de zona horaria, asumir que es UTC
                if (!this.requestDate.includes('T') && !this.requestDate.includes('Z') && 
                    !this.requestDate.includes('+') && !this.requestDate.includes('-', 10)) {
                    // Fecha simple (YYYY-MM-DD), asumir medianoche UTC-5 (Perú)
                    date = new Date(this.requestDate + 'T00:00:00-05:00');
                } else {
                    date = new Date(this.requestDate);
                }
            } else {
                date = new Date(this.requestDate);
            }
            
            if (isNaN(date.getTime())) return this.requestDate;
            
            // Formatear específicamente para la zona horaria de Perú
            return date.toLocaleDateString('es-PE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'America/Lima'
            });
        } catch (error) {
            console.warn('Error al formatear fecha de solicitud:', error);
            // Si hay error, intentar un formato básico
            try {
                const fallbackDate = new Date(this.requestDate);
                if (!isNaN(fallbackDate.getTime())) {
                    return fallbackDate.toISOString().split('T')[0].split('-').reverse().join('/');
                }
            } catch (e) {
                // Si todo falla, devolver la fecha original
            }
            return this.requestDate;
        }
    }

    // Método para obtener documentos por tipo
    getDocumentsByType(type) {
        return this.client?.documents.filter(doc => doc.type === type) || [];
    }

    // Método para verificar si tiene un tipo específico de documento
    hasDocumentType(type) {
        return this.getDocumentsByType(type).length > 0;
    }
}