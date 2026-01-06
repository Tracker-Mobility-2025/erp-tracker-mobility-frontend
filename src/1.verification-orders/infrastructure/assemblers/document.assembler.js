import { Document } from '../../domain/models/document.entity.js';

/**
 * Assembler para transformar documentos entre HTTP y entidades de dominio.
 * Responsabilidad única: mapping bidireccional (resource ↔ entity).
 */
export class DocumentAssembler {
  /**
   * Convierte un recurso HTTP a entidad Document
   * @param {Object} resource - Recurso del backend
   * @returns {Document}
   */
  static toEntity(resource) {
    if (!resource) {
      throw new Error('Resource no puede ser null o undefined');
    }

    return new Document({
      id: resource.id,
      documentType: resource.documentType,
      documentNumber: resource.documentNumber,
      fileName: resource.fileName,
      fileUrl: resource.fileUrl,
      fileSize: resource.fileSize,
      uploadDate: resource.uploadDate ? new Date(resource.uploadDate) : null,
      isVerified: resource.isVerified || false,
      notes: resource.notes
    });
  }

  /**
   * Convierte un array de recursos a entidades
   * @param {Array<Object>} resources - Array de recursos del backend
   * @returns {Array<Document>}
   */
  static toEntities(resources) {
    if (!Array.isArray(resources)) {
      throw new Error('DocumentAssembler.toEntities: resources debe ser un array');
    }

    return resources
      .map(resource => {
        try {
          return this.toEntity(resource);
        } catch (error) {
          console.warn('[DocumentAssembler] Registro inválido omitido:', error.message);
          return null;
        }
      })
      .filter(item => item !== null);
  }

  /**
   * Convierte una entidad a formato HTTP
   * @param {Document} entity - Entidad de dominio
   * @returns {Object}
   */
  static toResource(entity) {
    return {
      id: entity.id,
      documentType: entity.documentType,
      documentNumber: entity.documentNumber,
      fileName: entity.fileName,
      fileUrl: entity.fileUrl,
      fileSize: entity.fileSize,
      uploadDate: entity.uploadDate?.toISOString(),
      isVerified: entity.isVerified,
      notes: entity.notes
    };
  }
}
