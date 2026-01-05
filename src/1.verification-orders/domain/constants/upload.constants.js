/**
 * Constantes para carga de archivos
 */

export const UploadStatus = {
  PENDING: 'PENDING',
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

export const FileCategory = {
  DOCUMENT: 'DOCUMENT',
  IMAGE: 'IMAGE',
  OTHER: 'OTHER'
};

export const AllowedMimeTypes = {
  IMAGES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};

export const MaxFileSizes = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  DEFAULT: 15 * 1024 * 1024 // 15MB
};

export const UploadMessages = {
  FILE_TOO_LARGE: 'El archivo excede el tamaño máximo permitido',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
  UPLOAD_SUCCESS: 'Archivo cargado exitosamente',
  UPLOAD_ERROR: 'Error al cargar el archivo',
  MAX_FILES_EXCEEDED: 'Se excedió el número máximo de archivos'
};

export const FileValidationRules = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024,
  MAX_FILES_PER_UPLOAD: 10,
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  ALLOWED_DOCUMENT_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
};

/**
 * Determina la categoría del archivo basado en su tipo MIME
 */
export function getFileCategory(mimeType) {
  if (AllowedMimeTypes.IMAGES.includes(mimeType)) {
    return FileCategory.IMAGE;
  }
  if (AllowedMimeTypes.DOCUMENTS.includes(mimeType)) {
    return FileCategory.DOCUMENT;
  }
  return FileCategory.OTHER;
}

/**
 * Valida el tamaño del archivo según su categoría
 */
export function validateFileSize(file) {
  const category = getFileCategory(file.type);
  const maxSize = category === FileCategory.IMAGE 
    ? MaxFileSizes.IMAGE 
    : category === FileCategory.DOCUMENT 
    ? MaxFileSizes.DOCUMENT 
    : MaxFileSizes.DEFAULT;

  return file.size <= maxSize;
}

/**
 * Valida el tipo de archivo
 */
export function validateFileType(file, allowedTypes = null) {
  if (!allowedTypes) {
    return [...AllowedMimeTypes.IMAGES, ...AllowedMimeTypes.DOCUMENTS].includes(file.type);
  }
  return allowedTypes.includes(file.type);
}

/**
 * Formatea el tamaño del archivo a string legible
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
