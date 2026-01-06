/**
 * Entidad de dominio: Document (Documento)
 * Representa un documento adjunto a la orden.
 * Rich Domain Model con comportamiento de negocio encapsulado.
 */
export class Document {
  /**
   * Crea una instancia de Document con validación obligatoria.
   * @param {Object} params - Parámetros del documento
   * @param {number} [params.id] - ID del documento
   * @param {string} [params.documentType] - Tipo de documento
   * @param {string} [params.documentNumber] - Número de documento
   * @param {string} [params.fileName] - Nombre del archivo
   * @param {string} [params.fileUrl] - URL del archivo
   * @param {number} [params.fileSize] - Tamaño del archivo en bytes
   * @param {Date|string} [params.uploadDate] - Fecha de carga
   * @param {boolean} [params.isVerified] - Estado de verificación
   * @param {string} [params.notes] - Notas adicionales
   */
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
  }

  /**
   * Verifica si el documento tiene un archivo adjunto
   * @returns {boolean} True si tiene archivo
   */
  get hasFile() {
    return Boolean(this.fileUrl);
  }

  /**
   * Obtiene el tamaño del archivo en KB
   * @returns {number|null} Tamaño en KB o null
   */
  get fileSizeInKB() {
    if (!this.fileSize) return null;
    return Math.round(this.fileSize / 1024);
  }

  /**
   * Obtiene el tamaño del archivo en MB
   * @returns {string|null} Tamaño en MB o null
   */
  get fileSizeInMB() {
    if (!this.fileSize) return null;
    return (this.fileSize / (1024 * 1024)).toFixed(2);
  }

  /**
   * Obtiene la extensión del archivo
   * @returns {string|null} Extensión en mayúsculas o null
   */
  get fileExtension() {
    if (!this.fileName) return null;
    const parts = this.fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : null;
  }

  /**
   * Obtiene la fecha de carga formateada
   * @returns {string|null} Fecha formateada o null
   */
  get uploadDateFormatted() {
    if (!this.uploadDate) return null;
    return this.uploadDate.toLocaleDateString('es-PE');
  }

  /**
   * Marca el documento como verificado
   */
  verify() {
    this.isVerified = true;
  }

  /**
   * Marca el documento como no verificado
   */
  unverify() {
    this.isVerified = false;
  }

  /**
   * Actualiza las notas del documento
   * @param {string} newNotes - Nuevas notas
   */
  updateNotes(newNotes) {
    this.notes = newNotes;
  }

  /**
   * Convierte la entidad a objeto plano para serialización
   * @returns {Object}
   */
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

