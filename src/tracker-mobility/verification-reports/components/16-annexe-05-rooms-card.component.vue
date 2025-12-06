<script>
import { ImageViewerMixin } from '../mixins/image-viewer.mixin.js';

export default {
  name: 'annexe-05-rooms-card',

  mixins: [ImageViewerMixin],

  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        title: 'ANEXO 05: Registro fotográfico de las habitaciones del domicilio',
        images: [
          {
            src: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Habitaci%C3%B3n+1',
            alt: 'Registro fotográfico de habitación - Cocina',
            description: 'Vista de la cocina del domicilio'
          },
          {
            src: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Habitaci%C3%B3n+2',
            alt: 'Registro fotográfico de habitación - Sala',
            description: 'Vista de la sala del domicilio'
          }
        ]
      })
    },
  }

};

</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i class="pi pi-home text-white"></i>
        {{ item?.title || 'ANEXO 05: Registro fotográfico de las habitaciones del domicilio' }}
      </h3>
    </template>
    <template #content>
      
      <div class="formgrid grid">
        <div class="field col-12">
          <div class="grid" v-if="item?.images && item.images.length > 0">
            <div 
              v-for="(image, index) in item.images" 
              :key="index" 
              class="col-12 md:col-6 lg:col-4"
            >
              <div class="image-container p-2">
                <div class="image-wrapper border-1 surface-border border-round overflow-hidden">
                  <img
                    :src="image.src"
                    :alt="image.alt"
                    class="w-full h-12rem object-fit-cover cursor-pointer transition-all transition-duration-300 hover:scale-105"
                    @click="openImageModal(image)"
                  />
                </div>
                <div class="image-actions mt-2 flex flex-column gap-2">
                  <pv-button
                    icon="pi pi-eye" 
                    label="Ver"
                    class="p-button-sm p-button-primary w-full"
                    v-tooltip.top="'Ver imagen en grande'"
                    @click="openImageModal(image)"
                  />
                  <pv-button 
                    icon="pi pi-download" 
                    label="Descargar"
                    class="p-button-sm p-button-outlined w-full"
                    v-tooltip.top="'Descargar imagen'"
                    @click="downloadImage(image)"
                  />
                </div>
                <p v-if="image.description" class="text-sm text-center text-color mt-1 m-0">
                  {{ image.description }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center p-4">
            <i class="pi pi-image text-4xl text-color-secondary mb-3"></i>
            <p class="text-color-secondary m-0">No hay imágenes disponibles</p>
          </div>
        </div>
      </div>
    </template>
  </pv-card>

  <!-- ====================== Modal para visualizar imágenes ====================== -->
  <pv-dialog
    v-model:visible="showDocumentModal"
    :modal="true"
    :closable="true"
    :draggable="false"
    :resizable="false"
    class="image-viewer-modal"
    :style="{ width: '90vw', maxWidth: '800px' }"
    @hide="closeModal"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <i :class="`pi ${getFileIcon(selectedDocument?.url)} ${getFileColor(selectedDocument?.url)}`"></i>
        <span class="font-semibold">{{ selectedDocument?.displayName || 'Imagen' }}</span>
      </div>
    </template>

    <div class="document-viewer-content" v-if="selectedDocument">
      <div class="image-viewer">
        <div class="image-controls mb-3 flex justify-content-between align-items-center">
          <div class="flex gap-2">
            <pv-button
              icon="pi pi-minus"
              class="p-button-sm p-button-outlined"
              @click="zoomOut"
              :disabled="imageZoom <= 0.5"
              title="Alejar"
            />
            <pv-button
              icon="pi pi-refresh"
              class="p-button-sm p-button-outlined"
              @click="resetZoom"
              title="Tamaño original"
            />
            <pv-button
              icon="pi pi-plus"
              class="p-button-sm p-button-outlined"
              @click="zoomIn"
              :disabled="imageZoom >= 3"
              title="Acercar"
            />
          </div>
          <span class="text-sm text-600">{{ Math.round(imageZoom * 100) }}%</span>
        </div>
        <div class="image-container-modal" style="overflow: auto; max-height: 60vh; border: 1px solid #e5e7eb; border-radius: 6px;">
          <img
            :src="selectedDocument.url"
            :alt="selectedDocument?.alt || selectedDocument?.displayName"
            :style="{ transform: `scale(${imageZoom})`, transformOrigin: 'top left', display: 'block' }"
            class="max-w-full h-auto"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer-container">
        <div class="footer-actions-left">
          <pv-button
            icon="pi pi-download"
            label="Descargar"
            class="p-button-outlined"
            @click="downloadImage({ src: selectedDocument?.url, description: selectedDocument?.displayName, alt: selectedDocument?.alt })"
            :disabled="!selectedDocument?.url"
          />
        </div>
        <div class="footer-actions-right">
          <pv-button
            icon="pi pi-times"
            label="Cerrar"
            class="p-button-text"
            @click="closeModal"
          />
        </div>
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
:deep(.p-card-content) {
  padding: 0.5rem;
}

:deep(.p-card-header) {
  background-color: #4A60D0;
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

:deep(.p-card) {
  overflow: hidden;
  border-radius: 0.375rem;
}

.image-container {
  text-align: center;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image-wrapper:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.transition-all {
  transition: all 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Estilos para el modal de imágenes */
:deep(.image-viewer-modal .p-dialog-header) {
  background-color: #4A60D0;
  color: white;
}

:deep(.image-viewer-modal .p-dialog-content) {
  padding: 1.5rem;
}

:deep(.image-viewer-modal .p-dialog-footer) {
  padding: 1rem 1.5rem;
}

.image-container-modal {
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.image-controls {
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.modal-footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.footer-actions-left {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.footer-actions-right {
  display: flex;
  gap: 0.5rem;
}

:deep(.image-viewer-modal) {
  max-height: 90vh;
}

:deep(.image-viewer-modal .p-dialog-content) {
  max-height: calc(90vh - 150px);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .modal-footer-container {
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-actions-left,
  .footer-actions-right {
    width: 100%;
    justify-content: center;
  }
}
</style>