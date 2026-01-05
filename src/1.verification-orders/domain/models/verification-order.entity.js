import { OrderStatus, OrderMessages } from '../constants/verification-order.constants.js';
import { OrderCode } from '../value-objects/order-code.vo.js';
import { Dwelling } from './dwelling.entity.js';
import { Zone } from './zone.entity.js';
import { Location } from './location.entity.js';
import { Residence } from './residence.entity.js';
import { ContactReference } from './contact-reference.entity.js';
import { Document } from './document.entity.js';
import { Landlord } from './landlord.entity.js';

/**
 * Entidad de dominio para Orden de Verificación.
 * Rich Domain Model con comportamiento encapsulado.
 */
export class VerificationOrder {
    constructor({
        id,
        orderCode,
        status,
        requestDate,
        client,
        applicantCompany,
        homeVisitDetails,
        observations = [],
        report = null,
        reportId = null,
        // Nuevas propiedades complejas para reportes
        dwelling = null,
        zone = null,
        location = null,
        residence = null,
        contactReferences = [],
        documents = [],
        landlord = null,
        additionalNotes = null
    }) {
        // Validaciones obligatorias
        if (!id) throw new Error(OrderMessages.ID_REQUIRED);
        if (!orderCode) throw new Error(OrderMessages.ORDER_CODE_REQUIRED);
        if (!status) throw new Error(OrderMessages.STATUS_REQUIRED);
        
        this.id = id;
        this.orderCode = orderCode instanceof OrderCode ? orderCode : new OrderCode(orderCode);
        this.status = status;
        this.requestDate = requestDate;
        this.client = client;
        this.applicantCompany = applicantCompany;
        this.homeVisitDetails = homeVisitDetails;
        this.observations = observations;
        this.report = report;
        this.reportId = reportId;
        
        // Propiedades complejas
        this.dwelling = dwelling instanceof Dwelling ? dwelling : (dwelling ? new Dwelling(dwelling) : null);
        this.zone = zone instanceof Zone ? zone : (zone ? new Zone(zone) : null);
        this.location = location instanceof Location ? location : (location ? new Location(location) : null);
        this.residence = residence instanceof Residence ? residence : (residence ? new Residence(residence) : null);
        this.contactReferences = Array.isArray(contactReferences) 
            ? contactReferences.map(ref => ref instanceof ContactReference ? ref : new ContactReference(ref))
            : [];
        this.documents = Array.isArray(documents)
            ? documents.map(doc => doc instanceof Document ? doc : new Document(doc))
            : [];
        this.landlord = landlord instanceof Landlord ? landlord : (landlord ? new Landlord(landlord) : null);
        this.additionalNotes = additionalNotes;
    }

    /**
     * Obtiene el código de orden como string
     */
    get orderCodeValue() {
        return this.orderCode?.value || this.orderCode;
    }

    /**
     * Verifica si la orden está pendiente
     */
    get isPending() {
        return this.status === OrderStatus.PENDIENTE;
    }

    /**
     * Verifica si la orden está asignada
     */
    get isAssigned() {
        return this.status === OrderStatus.ASIGNADO;
    }

    /**
     * Verifica si la orden está completada
     */
    get isCompleted() {
        return this.status === OrderStatus.COMPLETADA;
    }

    /**
     * Obtiene el nombre completo del cliente
     */
    get clientFullName() {
        if (!this.client) return '';
        return `${this.client.name || ''} ${this.client.lastName || ''}`.trim();
    }

    /**
     * Obtiene el nombre de la empresa solicitante
     */
    get companyName() {
        return this.applicantCompany?.companyName || '';
    }

    /**
     * Obtiene el ID del verificador asignado
     */
    get verifierId() {
        return this.homeVisitDetails?.verifierId || null;
    }

    /**
     * Obtiene la fecha de visita programada
     */
    get visitDate() {
        return this.homeVisitDetails?.visitDate || null;
    }

    /**
     * Verifica si la orden tiene información completa de ubicación
     */
    get hasCompleteLocation() {
        return this.location && this.location.hasCoordinates;
    }

    /**
     * Verifica si la orden tiene información de vivienda
     */
    get hasDwellingInfo() {
        return this.dwelling !== null;
    }

    /**
     * Verifica si la orden tiene información de zona
     */
    get hasZoneInfo() {
        return this.zone !== null;
    }

    /**
     * Obtiene el número de documentos adjuntos
     */
    get documentsCount() {
        return this.documents.length;
    }

    /**
     * Obtiene el número de referencias de contacto
     */
    get referencesCount() {
        return this.contactReferences.length;
    }

    /**
     * Verifica si tiene propietario registrado
     */
    get hasLandlord() {
        return this.landlord !== null;
    }

    /**
     * Obtiene documentos verificados
     */
    get verifiedDocuments() {
        return this.documents.filter(doc => doc.isVerified);
    }

    /**
     * Obtiene documentos pendientes de verificación
     */
    get pendingDocuments() {
        return this.documents.filter(doc => !doc.isVerified);
    }

    /**
     * Calcula el porcentaje de completitud del reporte
     */
    get reportCompleteness() {
        let totalFields = 7;
        let completedFields = 0;

        if (this.dwelling) completedFields++;
        if (this.zone) completedFields++;
        if (this.location && this.location.hasCoordinates) completedFields++;
        if (this.residence) completedFields++;
        if (this.contactReferences.length > 0) completedFields++;
        if (this.documents.length > 0) completedFields++;
        if (this.observations.length > 0) completedFields++;

        return Math.round((completedFields / totalFields) * 100);
    }

    /**
     * Verifica si el reporte está completo
     */
    get isReportComplete() {
        return this.reportCompleteness === 100;
    }
}
