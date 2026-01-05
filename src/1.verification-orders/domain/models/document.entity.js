/**
 * Entidad de dominio: Document (Documento)
 * Representa un documento adjunto a la orden.
 */
export class Document {
  constructor({
    id = null,
    documentType = null,
    documentNumber = null,
    fileName = null,
    fileUrl = null,
    fileSize = null,
    uploadDate = null,
    isVerified = false,
    notes = null
  } = {}) {
    this.id = id;
    this.documentType = documentType;
    this.documentNumber = documentNumber;
    this.fileName = fileName;
    this.fileUrl = fileUrl;
    this.fileSize = fileSize;
    this.uploadDate = uploadDate ? new Date(uploadDate) : null;
    this.isVerified = isVerified;
    this.notes = notes;

    Object.freeze(this);
  }

  get hasFile() {
    return Boolean(this.fileUrl);
  }

  get fileSizeInKB() {
    if (!this.fileSize) return null;
    return Math.round(this.fileSize / 1024);
  }

  get fileSizeInMB() {
    if (!this.fileSize) return null;
    return (this.fileSize / (1024 * 1024)).toFixed(2);
  }

  get fileExtension() {
    if (!this.fileName) return null;
    const parts = this.fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : null;
  }

  get uploadDateFormatted() {
    if (!this.uploadDate) return null;
    return this.uploadDate.toLocaleDateString('es-PE');
  }

  toJSON() {
    return {
      id: this.id,
      documentType: this.documentType,
      documentNumber: this.documentNumber,
      fileName: this.fileName,
      fileUrl: this.fileUrl,
      fileSize: this.fileSize,
      uploadDate: this.uploadDate,
      isVerified: this.isVerified,
      notes: this.notes
    };
  }
}
