import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DocumentApi } from '../infrastructure/document.api.js';
import { DocumentAssembler } from '../infrastructure/document.assembler.js';
import { useNotification } from '../../shared-v2/composables/useNotification.js';

/**
 * Store de Pinia para gestión de documentos
 */
export const useDocumentStore = defineStore('document', () => {
  // API y Assembler
  const api = new DocumentApi();
  const assembler = DocumentAssembler;
  const { showSuccess, showError } = useNotification();

  // Estado
  const documents = ref([]);
  const currentDocument = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Computed
  const verifiedDocuments = computed(() => {
    return documents.value.filter(doc => doc.isVerified);
  });

  const pendingDocuments = computed(() => {
    return documents.value.filter(doc => !doc.isVerified);
  });

  const documentsByType = computed(() => {
    const grouped = {};
    documents.value.forEach(doc => {
      const type = doc.documentType || 'OTROS';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(doc);
    });
    return grouped;
  });

  const totalDocuments = computed(() => documents.value.length);
  const totalSize = computed(() => {
    return documents.value.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
  });

  // Actions
  /**
   * Obtiene todos los documentos de una orden
   */
  async function fetchByOrder(orderId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.getAllByOrder(orderId);
      documents.value = assembler.toEntities(response.data || []);

      return {
        success: true,
        data: documents.value,
        message: 'Documentos cargados exitosamente',
        code: 200
      };
    } catch (err) {
      error.value = err.message;
      showError('Error al cargar documentos', err.message);
      
      return {
        success: false,
        message: err.message,
        code: err.response?.status || 500
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtiene un documento específico
   */
  async function fetchById(orderId, documentId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.getById(orderId, documentId);
      currentDocument.value = assembler.toEntity(response.data);

      return {
        success: true,
        data: currentDocument.value,
        message: 'Documento cargado exitosamente',
        code: 200
      };
    } catch (err) {
      error.value = err.message;
      showError('Error al cargar documento', err.message);
      
      return {
        success: false,
        message: err.message,
        code: err.response?.status || 500
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Sube un nuevo documento
   */
  async function upload(orderId, file, documentType, documentNumber = null) {
    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      if (documentNumber) {
        formData.append('documentNumber', documentNumber);
      }

      const response = await api.upload(orderId, formData);
      const newDocument = assembler.toEntity(response.data);
      
      documents.value.push(newDocument);
      showSuccess('Éxito', 'Documento cargado correctamente');

      return {
        success: true,
        data: newDocument,
        message: 'Documento cargado exitosamente',
        code: 201
      };
    } catch (err) {
      error.value = err.message;
      showError('Error al cargar documento', err.message);
      
      return {
        success: false,
        message: err.message,
        code: err.response?.status || 500
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Actualiza un documento existente
   */
  async function update(orderId, documentId, updates) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.update(orderId, documentId, updates);
      const updatedDocument = assembler.toEntity(response.data);

      const index = documents.value.findIndex(doc => doc.id === documentId);
      if (index !== -1) {
        documents.value[index] = updatedDocument;
      }

      showSuccess('Éxito', 'Documento actualizado correctamente');

      return {
        success: true,
        data: updatedDocument,
        message: 'Documento actualizado exitosamente',
        code: 200
      };
    } catch (err) {
      error.value = err.message;
      showError('Error al actualizar documento', err.message);
      
      return {
        success: false,
        message: err.message,
        code: err.response?.status || 500
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Marca un documento como verificado
   */
  async function verify(orderId, documentId) {
    return await update(orderId, documentId, { isVerified: true });
  }

  /**
   * Marca un documento como no verificado
   */
  async function unverify(orderId, documentId) {
    return await update(orderId, documentId, { isVerified: false });
  }

  /**
   * Elimina un documento
   */
  async function remove(orderId, documentId) {
    loading.value = true;
    error.value = null;

    try {
      await api.delete(orderId, documentId);
      
      documents.value = documents.value.filter(doc => doc.id !== documentId);
      showSuccess('Éxito', 'Documento eliminado correctamente');

      return {
        success: true,
        message: 'Documento eliminado exitosamente',
        code: 200
      };
    } catch (err) {
      error.value = err.message;
      showError('Error al eliminar documento', err.message);
      
      return {
        success: false,
        message: err.message,
        code: err.response?.status || 500
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Descarga un documento
   */
  async function download(orderId, documentId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.download(orderId, documentId);
      
      // Crear un enlace temporal para descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const document = documents.value.find(doc => doc.id === documentId);
      link.setAttribute('download', document?.fileName || 'documento');
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess('Éxito', 'Documento descargado correctamente');

      return {
        success: true,
        message: 'Documento descargado exitosamente',
        code: 200
      };
    } catch (err) {
      error.value = err.message;
      showError('Error al descargar documento', err.message);
      
      return {
        success: false,
        message: err.message,
        code: err.response?.status || 500
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Limpia el estado
   */
  function clearDocuments() {
    documents.value = [];
    currentDocument.value = null;
    error.value = null;
  }

  return {
    // Estado
    documents,
    currentDocument,
    loading,
    error,

    // Computed
    verifiedDocuments,
    pendingDocuments,
    documentsByType,
    totalDocuments,
    totalSize,

    // Actions
    fetchByOrder,
    fetchById,
    upload,
    update,
    verify,
    unverify,
    remove,
    download,
    clearDocuments
  };
});

export default useDocumentStore;
