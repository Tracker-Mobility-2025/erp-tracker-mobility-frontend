/**
 * Constantes relacionadas con la entidad Document (Documento)
 */

export const DocumentType = {
  DNI: 'DNI',
  RECIBO_LUZ: 'RECIBO_LUZ',
  RECIBO_AGUA: 'RECIBO_AGUA',
  CONTRATO_ALQUILER: 'CONTRATO_ALQUILER',
  FOTO_FACHADA: 'FOTO_FACHADA',
  FOTO_INTERIOR: 'FOTO_INTERIOR',
  FOTO_CLIENTE: 'FOTO_CLIENTE',
  CROQUIS: 'CROQUIS',
  OTROS: 'OTROS'
};

export const DocumentTranslations = {
  [DocumentType.DNI]: 'DNI',
  [DocumentType.RECIBO_LUZ]: 'Recibo de Luz',
  [DocumentType.RECIBO_AGUA]: 'Recibo de Agua',
  [DocumentType.CONTRATO_ALQUILER]: 'Contrato de Alquiler',
  [DocumentType.FOTO_FACHADA]: 'Foto de Fachada',
  [DocumentType.FOTO_INTERIOR]: 'Foto Interior',
  [DocumentType.FOTO_CLIENTE]: 'Foto del Cliente',
  [DocumentType.CROQUIS]: 'Croquis',
  [DocumentType.OTROS]: 'Otros'
};

export const DocumentIcons = {
  [DocumentType.DNI]: 'pi pi-id-card',
  [DocumentType.RECIBO_LUZ]: 'pi pi-bolt',
  [DocumentType.RECIBO_AGUA]: 'pi pi-cloud',
  [DocumentType.CONTRATO_ALQUILER]: 'pi pi-file',
  [DocumentType.FOTO_FACHADA]: 'pi pi-image',
  [DocumentType.FOTO_INTERIOR]: 'pi pi-images',
  [DocumentType.FOTO_CLIENTE]: 'pi pi-user',
  [DocumentType.CROQUIS]: 'pi pi-map',
  [DocumentType.OTROS]: 'pi pi-paperclip'
};

export const AllowedFileExtensions = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  ALL: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx']
};

export const MaxFileSizes = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024 // 10MB
};
