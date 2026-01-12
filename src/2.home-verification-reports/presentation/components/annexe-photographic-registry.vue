<script setup>
import { useImageViewer } from '../../../shared-v2/composables/use-image-viewer.js';
import ImageViewerModal from '../../../shared-v2/presentation/components/image-viewer-modal.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'pi-images'
  },
  description: {
    type: String,
    default: ''
  },
  descriptionLabel: {
    type: String,
    default: 'Descripción'
  },
  photos: {
    type: Array,
    default: () => []
  }
});

// Define emits (aunque no se usa actualmente en este componente)
defineEmits(['viewPhoto']);

// Use shared image viewer composable
const {
  showModal,
  currentImage,
  zoom,
  openImage,
  closeModal,
  zoomIn,
  zoomOut,
  resetZoom,
  downloadImage,
  downloadCurrentImage,
  handleImageError
} = useImageViewer();
</script>

<template>
  <pv-card class="w-full">
    <template #header>
      <h3 class="text-lg font-bold flex align-items-center gap-2 text-white p-3 m-0">
        <i :class="`pi ${icon} text-white`"></i>
        {{ title }}
      </h3>
    </template>
    <template #content>
      <div class="formgrid grid">
        <!-- Descripción (opcional) -->
        <div v-if="description" class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2">
            <i class="pi pi-info-circle text-primary"></i>
            {{ descriptionLabel }}
          </label>
          <p class="font-semibold text-dark m-0 white-space-pre-wrap">
            {{ description }}
          </p>
        </div>

        <!-- Fotos -->
        <div class="field col-12">
          <label class="font-semibold text-color-secondary flex align-items-center gap-2 mb-3">
            <i class="pi pi-images text-primary"></i>
            Fotografías ({{ photos.length }})
          </label>
          <div v-if="photos.length > 0" class="grid">
            <div 
              v-for="(photo, index) in photos" 
              :key="index"
              class="col-12 md:col-6 lg:col-4"
            >
              <div class="image-container p-2">
                <div class="image-wrapper border-1 surface-border border-round overflow-hidden">
                  <img
                    :src="photo.url"
                    :alt="photo.description || 'Fotografía'"
                    class="w-full h-12rem object-fit-cover cursor-pointer transition-all transition-duration-300 hover:scale-105"
                    @click="openImage(photo)"
                  />
                </div>
                <div class="image-actions mt-2 flex flex-column gap-2">
                  <pv-button
                    icon="pi pi-eye" 
                    label="Ver"
                    class="p-button-sm p-button-primary w-full"
                    v-tooltip.top="'Ver imagen en grande'"
                    @click="openImage(photo)"
                  />
                  <pv-button 
                    icon="pi pi-download" 
                    label="Descargar"
                    class="p-button-sm p-button-outlined w-full"
                    v-tooltip.top="'Descargar imagen'"
                    @click="downloadImage(photo)"
                  />
                </div>
                <p v-if="photo.description" class="text-sm text-center text-color mt-1 m-0">
                  {{ photo.description }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center p-4 surface-ground border-round">
            <i class="pi pi-info-circle text-4xl text-color-secondary mb-3"></i>
            <p class="text-color-secondary m-0">No hay fotografías disponibles</p>
          </div>
        </div>
      </div>
    </template>
  </pv-card>

  <!-- Modal compartido para visualizar imágenes -->
  <image-viewer-modal
    v-model:visible="showModal"
    :image-url="currentImage?.url"
    :image-name="currentImage?.name"
    :image-alt="currentImage?.alt"
    :zoom="zoom"
    @zoom-in="zoomIn"
    @zoom-out="zoomOut"
    @reset-zoom="resetZoom"
    @download="downloadCurrentImage"
    @error="handleImageError"
  />
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
</style>

