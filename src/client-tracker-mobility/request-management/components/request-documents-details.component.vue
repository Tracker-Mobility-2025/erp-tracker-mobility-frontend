<script>
export default {
  name: 'request-documents-details',

  props: {
    documents: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showDocumentModal: false,
      selectedDocument: null,
      imageZoom: 1,
      newDocuments: [],
      selectedFiles: {}, // Archivos seleccionados para cada documento {documentId: File}
      previewUrls: {} // URLs de preview para archivos seleccionados {documentId: url}
    };
  },

  computed: {
    // Filtrar y mapear documentos según los tipos permitidos
    filteredDocuments() {
      if (!this.documents || this.documents.length === 0) return [];
      
      // Tipos de documentos permitidos
      const allowedTypes = ['FOTO_FACHADA_VIVIENDA', 'RECIBO_AGUA', 'DNI'];
      
      // Mapeo de nombres
      const typeMapping = {
        'FOTO_FACHADA_VIVIENDA': 'FACHADA DE VIVIENDA',
        'RECIBO_AGUA': 'RECIBO DE SERVICIO',
        'DNI': 'DOC. DE IDENTIDAD'
      };
      
      // Filtrar y transformar documentos
      return this.documents
        .filter(doc => allowedTypes.includes(doc.type))
        .map(doc => ({
          ...doc,
          displayName: typeMapping[doc.type] || doc.type
        }));
    }
  },

  methods: {
    // Manejar selección de archivo para reemplazar un documento específico
    handleFileSelect(event, document) {
      const file = event.files[0];
      if (file) {
        // Guardar el archivo seleccionado
        this.selectedFiles[document.id] = file;

        // Crear URL de preview si es imagen
        if (file.type.startsWith('image/')) {
          this.previewUrls[document.id] = URL.createObjectURL(file);
        }

        console.log(`Archivo seleccionado para ${document.type}:`, file.name);
      }
    },

    // Limpiar archivo seleccionado para un documento
    clearSelectedFile(documentId) {
      if (this.previewUrls[documentId]) {
        URL.revokeObjectURL(this.previewUrls[documentId]);
      }
      delete this.selectedFiles[documentId];
      delete this.previewUrls[documentId];
    },

    // Verificar si un documento tiene archivo seleccionado para reemplazo
    hasSelectedFile(documentId) {
      return !!this.selectedFiles[documentId];
    },

    // Obtener nombre del archivo seleccionado
    getSelectedFileName(documentId) {
      return this.selectedFiles[documentId]?.name || '';
    },

    viewDocument(document) {
      this.selectedDocument = document;
      this.imageZoom = 1;
      this.showDocumentModal = true;
    },

    closeModal() {
      this.showDocumentModal = false;
      this.selectedDocument = null;
      this.imageZoom = 1;
    },

    zoomIn() {
      if (this.imageZoom < 3) {
        this.imageZoom += 0.25;
      }
    },

    zoomOut() {
      if (this.imageZoom > 0.5) {
        this.imageZoom -= 0.25;
      }
    },

    resetZoom() {
      this.imageZoom = 1;
    },

    getDocumentLabel(documentTypeOrDocument) {
      // Si se pasa un objeto documento con displayName, usarlo
      if (typeof documentTypeOrDocument === 'object' && documentTypeOrDocument?.displayName) {
        return documentTypeOrDocument.displayName;
      }
      
      // Si es string, usar el tipo directamente
      const documentType = typeof documentTypeOrDocument === 'string' 
        ? documentTypeOrDocument 
        : documentTypeOrDocument?.type;
      
      const labels = {
        'identity': 'Documento de identidad',
        'receipt': 'Recibo de servicios',
        'contract': 'Contrato de alquiler',
        'other': 'Otro documento',
        'FOTO_FACHADA_VIVIENDA': 'FACHADA DE VIVIENDA',
        'RECIBO_AGUA': 'RECIBO DE SERVICIO',
        'DNI': 'DOCUMENTO DE IDENTIDAD'
      };
      return labels[documentType] || documentType || 'Documento';
    },

    isImageFile(url) {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    },

    getFileExtension(url) {
      if (!url) return '';
      const matches = url.match(/\.([^.]+)$/);
      return matches ? matches[1].toLowerCase() : '';
    },

    getFileIcon(url) {
      const extension = this.getFileExtension(url);
      const iconMap = {
        'pdf': 'pi-file-pdf',
        'doc': 'pi-file-word',
        'docx': 'pi-file-word',
        'jpg': 'pi-image',
        'jpeg': 'pi-image',
        'png': 'pi-image',
        'gif': 'pi-image'
      };
      return iconMap[extension] || 'pi-file';
    },

    getFileColor(url) {
      const extension = this.getFileExtension(url);
      const colorMap = {
        'pdf': 'text-red-500',
        'doc': 'text-blue-500',
        'docx': 'text-blue-500',
        'jpg': 'text-purple-500',
        'jpeg': 'text-purple-500',
        'png': 'text-purple-500'
      };
      return colorMap[extension] || 'text-gray-500';
    },

    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/150x100/f0f0f0/666666?text=Sin+imagen';
    },

    downloadDocument(document) {
      if (!document || !document.url) {
        console.warn('No se puede descargar el documento');
        return;
      }
      window.open(document.url, '_blank');
    }
  },

  beforeUnmount() {
    // Limpiar todas las URLs de preview para evitar fugas de memoria
    Object.values(this.previewUrls).forEach(url => {
      URL.revokeObjectURL(url);
    });
  }
}
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2" :style="editMode ? 'background-color: #d97706; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;' : 'background-color: #4A60D0; color: white; border-top-left-radius: 6px; border-top-right-radius: 6px;'">
        <i class="pi pi-paperclip" style="color: white;"></i>
        <span class="text-lg font-bold">Documentos adjuntos</span>
        <pv-badge v-if="editMode" value="EDITABLE" severity="warning" class="ml-auto" style="opacity: 0.85;" />
      </div>
    </template>
    <template #content>
      <!-- Mensaje de modo edición -->
      <pv-message v-if="editMode" severity="info" :closable="false" class="mb-3">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-info-circle"></i>
          <span>Puedes reemplazar cada documento individualmente seleccionando un nuevo archivo</span>
        </div>
      </pv-message>

      <div v-if="filteredDocuments && filteredDocuments.length > 0" class="formgrid grid">
        <div
            v-for="document in filteredDocuments"
            :key="document.id"
            class="field col-12 md:col-4"
        >
          <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
            <i :class="`pi ${getFileIcon(document.url)} ${getFileColor(document.url)}`"></i>
            {{ document.displayName }}
            <pv-tag v-if="hasSelectedFile(document.id) && editMode" value="Nuevo archivo" severity="success" class="ml-2" />
          </label>
          <div class="flex flex-column align-items-center p-3 border-1 surface-border border-round hover:shadow-3 transition-all" :class="{ 'border-primary': hasSelectedFile(document.id) && editMode }">

            <!-- Preview del archivo actual o nuevo -->
            <div v-if="hasSelectedFile(document.id) && previewUrls[document.id]" class="w-full flex justify-content-center mb-3">
              <div class="relative">
                <img
                    :src="previewUrls[document.id]"
                    :alt="document.displayName"
                    class="w-full max-w-10rem h-6rem object-fit-cover border-round shadow-2"
                />
                <pv-badge value="NUEVO" severity="success" class="absolute" style="top: 5px; right: 5px;" />
              </div>
            </div>
            <div v-else-if="isImageFile(document.url)" class="w-full flex justify-content-center mb-3">
              <img
                  :src="document.url"
                  :alt="document.displayName"
                  class="w-full max-w-10rem h-6rem object-fit-cover border-round shadow-2"
                  @error="handleImageError"
              />
            </div>
            <div v-else class="w-full flex flex-column align-items-center mb-3">
              <i :class="`pi ${getFileIcon(document.url)} ${getFileColor(document.url)} text-6xl mb-2`"></i>
              <span class="text-sm text-color-secondary font-medium uppercase">{{ getFileExtension(document.url) || 'Archivo' }}</span>
            </div>

            <!-- Información del nuevo archivo seleccionado -->
            <div v-if="hasSelectedFile(document.id) && editMode" class="w-full mb-2 p-2 bg-green-50 border-round">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-check-circle text-green-600"></i>
                <span class="text-sm text-green-800 font-medium">{{ getSelectedFileName(document.id) }}</span>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex flex-column gap-2 w-full">
              <!-- Selector de archivo en modo edición -->
              <pv-file-upload
                v-if="editMode"
                mode="basic"
                :name="`document-${document.id}`"
                accept="image/*,application/pdf"
                :maxFileSize="5000000"
                :auto="true"
                :chooseLabel="hasSelectedFile(document.id) ? 'Cambiar archivo' : 'Reemplazar documento'"
                :chooseIcon="hasSelectedFile(document.id) ? 'pi pi-refresh' : 'pi pi-upload'"
                class="w-full"
                :class="{ 'p-button-success': hasSelectedFile(document.id) }"
                @select="handleFileSelect($event, document)"
              />

              <!-- Botón para limpiar archivo seleccionado -->
              <pv-button
                v-if="editMode && hasSelectedFile(document.id)"
                icon="pi pi-times"
                label="Cancelar reemplazo"
                class="p-button-sm p-button-danger p-button-outlined w-full"
                @click="clearSelectedFile(document.id)"
              />

              <!-- Botones estándar (ver y descargar) -->
              <pv-button
                  v-if="!editMode"
                  icon="pi pi-eye"
                  label="Ver"
                  class="p-button-sm p-button-primary w-full"
                  @click="viewDocument(document)"
                  :disabled="!document.url"
              />
              <pv-button
                  v-if="!editMode"
                  icon="pi pi-download"
                  label="Descargar"
                  class="p-button-sm p-button-outlined w-full"
                  @click="downloadDocument(document)"
                  :disabled="!document.url"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <i class="pi pi-file-excel text-4xl text-color-secondary"></i>
        <p class="text-color-secondary mt-2 mb-0">No hay documentos adjuntos disponibles</p>
      </div>
    </template>
  </pv-card>

  <!-- Modal para visualizar documentos -->
  <pv-dialog
    v-model:visible="showDocumentModal"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="document-viewer-modal"
    :style="{ width: '90vw', maxWidth: '800px' }"
    @hide="closeModal"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <i :class="`pi ${getFileIcon(selectedDocument?.url)} ${getFileColor(selectedDocument?.url)}`"></i>
        <span class="font-semibold">{{ selectedDocument?.displayName || getDocumentLabel(selectedDocument?.type) }}</span>
      </div>
    </template>

    <div class="document-viewer-content" v-if="selectedDocument">
      <div v-if="isImageFile(selectedDocument.url)" class="image-viewer">
        <div class="image-controls mb-3 flex justify-content-between align-items-center">
          <div class="flex gap-2">
            <pv-button
              icon="pi pi-minus"
              class="p-button-sm p-button-outlined"
              @click="zoomOut"
              :disabled="imageZoom <= 0.5"
            />
            <pv-button
              icon="pi pi-refresh"
              class="p-button-sm p-button-outlined"
              @click="resetZoom"
            />
            <pv-button
              icon="pi pi-plus"
              class="p-button-sm p-button-outlined"
              @click="zoomIn"
              :disabled="imageZoom >= 3"
            />
          </div>
          <span class="text-sm text-color-secondary">{{ Math.round(imageZoom * 100) }}%</span>
        </div>
        <div class="image-container" style="overflow: auto; max-height: 60vh; border: 1px solid #dee2e6; border-radius: 6px;">
          <img
            :src="selectedDocument.url"
            :alt="selectedDocument?.displayName || getDocumentLabel(selectedDocument.type)"
            :style="{ transform: `scale(${imageZoom})`, transformOrigin: 'top left', display: 'block' }"
            class="w-full"
          />
        </div>
      </div>
      <div v-else class="document-preview text-center py-5">
        <i :class="`pi ${getFileIcon(selectedDocument.url)} ${getFileColor(selectedDocument.url)} text-6xl mb-3`"></i>
        <p class="text-lg font-semibold mb-2">{{ selectedDocument.url?.split('/').pop() || 'Documento' }}</p>
        <p class="text-color-secondary mb-3">Este tipo de archivo no se puede previsualizar</p>
        <pv-button
          icon="pi pi-download"
          label="Descargar archivo"
          @click="downloadDocument(selectedDocument)"
        />
      </div>
    </div>

    <template #footer>
      <pv-button
        icon="pi pi-times"
        label="Cerrar"
        class="p-button-text"
        @click="closeModal"
      />
    </template>
  </pv-dialog>
</template>

<style scoped>
:deep(.p-card) {
  border-radius: 6px !important;
  overflow: hidden !important;
}

:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  padding: 0 !important;
  border-bottom: none !important;
}

:deep(.p-card-content) {
  padding: 1.5rem;
}

.card-header {
  background-color: #4A60D0 !important;
  color: white !important;
}

.document-viewer-content {
  min-height: 200px;
}


@media (max-width: 768px) {
  .card-header :deep(.p-button) {
    flex: 1;
  }
}
</style>

