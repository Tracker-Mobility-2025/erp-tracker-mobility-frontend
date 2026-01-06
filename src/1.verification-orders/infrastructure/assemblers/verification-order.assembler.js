import { VerificationOrder } from '../../domain/models/verification-order.entity.js';
import { OrderCode } from '../../domain/value-objects/order-code.vo.js';
import { Dwelling } from '../../domain/models/dwelling.entity.js';
import { Zone } from '../../domain/models/zone.entity.js';
import { Location } from '../../domain/models/location.entity.js';
import { Residence } from '../../domain/models/residence.entity.js';
import { ContactReference } from '../../domain/models/contact-reference.entity.js';
import { Document } from '../../domain/models/document.entity.js';
import { Landlord } from '../../domain/models/landlord.entity.js';

/**
 * Assembler para transformar recursos HTTP a entidades de dominio.
 * Responsabilidad única: mapping bidireccional (resource ↔ entity).
 * NO maneja errores HTTP, NO toma decisiones de negocio.
 */
export class VerificationOrderAssembler {
  /**
   * Convierte un recurso HTTP a entidad de dominio
   * @param {Object} resource - Objeto del backend
   * @returns {VerificationOrder}
   */
  static toEntity(resource) {
    if (!resource) {
      throw new Error('Resource no puede ser null o undefined');
    }

    return new VerificationOrder({
      id: resource.id,
      orderCode: resource.orderCode ? new OrderCode(resource.orderCode) : null,
      status: resource.status,
      requestDate: resource.requestDate ? new Date(resource.requestDate) : null,
      
      // Cliente
      client: resource.client ? {
        id: resource.client.id,
        name: resource.client.name,
        lastName: resource.client.lastName,
        phoneNumber: resource.client.phoneNumber,
        email: resource.client.email
      } : null,
      
      // Empresa solicitante
      applicantCompany: resource.applicantCompany ? {
        id: resource.applicantCompany.id,
        companyName: resource.applicantCompany.companyName,
        ruc: resource.applicantCompany.ruc
      } : null,
      
      // Detalles de visita
      homeVisitDetails: resource.homeVisitDetails ? {
        verifierId: resource.homeVisitDetails.verifierId,
        verifierName: resource.homeVisitDetails.verifierName,
        visitDate: resource.homeVisitDetails.visitDate ? new Date(resource.homeVisitDetails.visitDate) : null,
        visitTime: resource.homeVisitDetails.visitTime
      } : null,
      
      // Observaciones (array simplificado para Fase 1)
      observations: Array.isArray(resource.observations) 
        ? resource.observations.map(obs => ({
            id: obs.id,
            description: obs.description,
            status: obs.status
          }))
        : [],
      
      // Reporte (simplificado para Fase 1)
      report: resource.report ? {
        id: resource.report.id,
        status: resource.report.status,
        completedAt: resource.report.completedAt ? new Date(resource.report.completedAt) : null
      } : null,
      
      reportId: resource.reportId,
      
      // Nuevas entidades complejas (Fase 4)
      dwelling: resource.dwelling ? new Dwelling(resource.dwelling) : null,
      zone: resource.zone ? new Zone(resource.zone) : null,
      location: resource.location ? new Location(resource.location) : null,
      residence: resource.residence ? new Residence(resource.residence) : null,
      
      contactReferences: Array.isArray(resource.contactReferences)
        ? resource.contactReferences.map(ref => new ContactReference(ref))
        : [],
      
      documents: Array.isArray(resource.documents)
        ? resource.documents.map(doc => new Document(doc))
        : [],
      
      landlord: resource.landlord ? new Landlord(resource.landlord) : null,
      additionalNotes: resource.additionalNotes
    });
  }

  /**
   * Convierte un array de recursos a entidades
   * @param {Array} resources - Array de objetos del backend
   * @returns {VerificationOrder[]}
   */
  static toEntities(resources) {
    if (!Array.isArray(resources)) {
      throw new Error('VerificationOrderAssembler.toEntities: resources debe ser un array');
    }
    
    return resources
      .map(resource => {
        try {
          return this.toEntity(resource);
        } catch (error) {
          console.warn('[VerificationOrderAssembler] Registro inválido omitido:', error.message);
          return null;
        }
      })
      .filter(item => item !== null);
  }
}
