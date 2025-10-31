<script>
export default {
  name: 'request-documents-details',

  props: {
    documents: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      showDocumentModal: false,
      selectedDocument: null,
      imageZoom: 1
    };
  },

  methods: {
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

    getDocumentLabel(documentType) {
      const labels = {
        'identity': 'Documento de identidad',
        'receipt': 'Recibo de servicios',
        'contract': 'Contrato de alquiler',
        'other': 'Otro documento'
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
  }
}
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <div class="flex align-items-center gap-2 px-3 py-2 card-header">
        <i class="pi pi-paperclip"></i>
        <span class="text-lg font-bold">Documentos adjuntos</span>
      </div>
    </template>
    <template #content>
      <div v-if="documents && documents.length > 0" class="formgrid grid">
        <div
            v-for="document in documents"
            :key="document.id"
            class="field col-12 md:col-4"
        >
          <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-2">
            <i :class="`pi ${getFileIcon(document.url)} ${getFileColor(document.url)}`"></i>
            {{ getDocumentLabel(document.type) }}
          </label>
          <div class="flex flex-column align-items-center p-3 border-1 surface-border border-round hover:shadow-3 transition-all">
            <div v-if="isImageFile(document.url)" class="w-full flex justify-content-center mb-3">
              <img
                  :src="document.url"
                  :alt="getDocumentLabel(document.type)"
                  class="w-full max-w-10rem h-6rem object-fit-cover border-round shadow-2"
                  @error="handleImageError"
              />
            </div>
            <div v-else class="w-full flex flex-column align-items-center mb-3">
              <i :class="`pi ${getFileIcon(document.url)} ${getFileColor(document.url)} text-6xl mb-2`"></i>
              <span class="text-sm text-color-secondary font-medium uppercase">{{ getFileExtension(document.url) || 'Archivo' }}</span>
            </div>
            <div class="flex flex-column gap-2 w-full">
              <pv-button
                  icon="pi pi-eye"
                  label="Ver"
                  class="p-button-sm p-button-primary w-full"
                  @click="viewDocument(document)"
                  :disabled="!document.url"
              />
              <pv-button
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
        <span class="font-semibold">{{ getDocumentLabel(selectedDocument?.type) }}</span>
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
        <div class="image-container" style="overflow: auto; max-height: 60vh; border: 1px solid var(--surface-border); border-radius: 6px;">
          <img 
            :src="selectedDocument.url" 
            :alt="getDocumentLabel(selectedDocument.type)"
            :style="{ transform: `scale(${imageZoom})`, transformOrigin: 'top left', display: 'block' }"
            class="max-w-full h-auto"
            @error="handleImageError"
          />
        </div>
      </div>
      <div v-else class="text-center py-6">
        <i :class="`pi ${getFileIcon(selectedDocument.url)} ${getFileColor(selectedDocument.url)} text-8xl mb-3`"></i>
        <p class="text-color-secondary">Vista previa no disponible para este tipo de archivo</p>
      </div>
    </div>

    <template #footer>
      <pv-button 
        icon="pi pi-download" 
        label="Descargar"
        class="p-button-outlined"
        @click="downloadDocument(selectedDocument)"
      />
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
:deep(.p-card-content) {
  padding: 0.5rem;
}

.card-header {
  background-color: #4A60D0 !important;
  color: white !important;
}

:deep(.p-card .p-card-header) {
  background-color: #4A60D0 !important;
  color: white !important;
  border-top-left-radius: var(--border-radius) !important;
  border-top-right-radius: var(--border-radius) !important;
  padding: 0 !important;
  border-bottom: none !important;
}

:deep(.p-card) {
  border-radius: var(--border-radius) !important;
  overflow: hidden !important;
}
</style>
