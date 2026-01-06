/**
 * Entidad de dominio: AttachedDocument
 * Representa un documento adjunto de la orden.
 */
export class AttachedDocument {
  constructor({
    id = null,
    url = null,
    type = null
  }) {
    if (!url) throw new Error('URL es requerida');
    if (!type) throw new Error('Tipo es requerido');

    this.id = id;
    this.url = url;
    this.type = type;
  }

  /**
   * Verifica si es una imagen.
   * @returns {boolean}
   */
  get isImage() {
    return this.type.toLowerCase().includes('image') || 
           this.type.toLowerCase().includes('foto') ||
           this.type.toLowerCase().includes('img');
  }

  /**
   * Verifica si es un PDF.
   * @returns {boolean}
   */
  get isPdf() {
    return this.type.toLowerCase().includes('pdf');
  }
}
