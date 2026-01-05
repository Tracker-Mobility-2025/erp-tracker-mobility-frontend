<template>
  <Card class="photo-gallery-card">
    <template #title>
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-images text-2xl"></i>
          <span>{{ title }}</span>
          <Badge v-if="photos && photos.length > 0" :value="photos.length" />
        </div>
        <Button 
          v-if="!readonly"
          label="Agregar fotos" 
          icon="pi pi-plus"
          size="small"
          @click="openUploadDialog"
        />
      </div>
    </template>

    <template #content>
      <div v-if="photos && photos.length > 0" class="gallery-grid">
        <div 
          v-for="(photo, index) in photos" 
          :key="photo.id || index"
          class="gallery-item"
          @click="openLightbox(index)"
        >
          <div class="photo-wrapper">
            <Image 
              :src="photo.fileUrl || photo.thumbnailUrl" 
              :alt="photo.fileName || `Foto ${index + 1}`"
              class="gallery-image"
              preview
            />
            <div class="photo-overlay">
              <Button 
                icon="pi pi-search-plus" 
                rounded
                text
                severity="secondary"
                class="overlay-button"
              />
            </div>
          </div>
          
          <div class="photo-info">
            <span class="photo-caption">{{ photo.caption || photo.fileName }}</span>
            <div class="photo-meta">
              <span class="photo-date" v-if="photo.uploadDate">
                {{ formatDate(photo.uploadDate) }}
              </span>
              <Tag 
                v-if="photo.isVerified" 
                value="Verificada" 
                severity="success" 
                size="small" 
              />
            </div>
          </div>

          <div v-if="!readonly" class="photo-actions">
            <Button 
              icon="pi pi-pencil" 
              size="small"
              text
              rounded
              severity="secondary"
              v-tooltip.top="'Editar'"
              @click.stop="editPhoto(photo)"
            />
            <Button 
              icon="pi pi-download" 
              size="small"
              text
              rounded
              severity="info"
              v-tooltip.top="'Descargar'"
              @click.stop="downloadPhoto(photo)"
            />
            <Button 
              icon="pi pi-trash" 
              size="small"
              text
              rounded
              severity="danger"
              v-tooltip.top="'Eliminar'"
              @click.stop="confirmDelete(photo)"
            />
          </div>
        </div>
      </div>

      <div v-else class="no-photos-message">
        <i class="pi pi-images text-6xl mb-3 text-400"></i>
        <h3>No hay fotos disponibles</h3>
        <p v-if="!readonly">Haz clic en "Agregar fotos" para comenzar</p>
      </div>
    </template>
  </Card>

  <!-- Dialog de carga de fotos -->
  <Dialog 
    v-model:visible="uploadDialogVisible" 
    header="Agregar fotos"
    :modal="true"
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
  >
    <FileUpload
      ref="fileUploadRef"
      title="Cargar fotos"
      :multiple="true"
      accepted-types="image/*"
      :max-files="20"
      help-text="Arrastra las fotos aquí o haz clic para seleccionar"
      upload-title="Arrastra tus fotos aquí"
      upload-subtitle="Formatos permitidos: JPG, PNG, GIF, WEBP"
      @files-selected="onFilesSelected"
      @upload-complete="onUploadComplete"
    />
  </Dialog>

  <!-- Dialog de edición de foto -->
  <Dialog 
    v-model:visible="editDialogVisible" 
    header="Editar foto"
    :modal="true"
    :style="{ width: '30vw' }"
    :breakpoints="{ '960px': '50vw', '640px': '95vw' }"
  >
    <div v-if="selectedPhoto" class="edit-photo-form">
      <div class="field">
        <label for="photo-caption">Descripción</label>
        <InputText 
          id="photo-caption"
          v-model="selectedPhoto.caption" 
          placeholder="Ingresa una descripción"
          class="w-full"
        />
      </div>

      <div class="field">
        <label>Estado de verificación</label>
        <div class="flex align-items-center gap-2">
          <Checkbox 
            v-model="selectedPhoto.isVerified" 
            :binary="true"
            inputId="photo-verified"
          />
          <label for="photo-verified">Foto verificada</label>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" severity="secondary" @click="editDialogVisible = false" />
      <Button label="Guardar" @click="savePhotoEdits" />
    </template>
  </Dialog>

  <!-- Confirm Dialog para eliminar -->
  <ConfirmDialog />
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Image from 'primevue/image';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import FileUpload from './file-upload.vue';

const props = defineProps({
  photos: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Galería de fotos'
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['photo-added', 'photo-updated', 'photo-deleted', 'photo-downloaded']);

const confirm = useConfirm();
const fileUploadRef = ref(null);
const uploadDialogVisible = ref(false);
const editDialogVisible = ref(false);
const selectedPhoto = ref(null);
const lightboxIndex = ref(0);

function openUploadDialog() {
  uploadDialogVisible.value = true;
}

function onFilesSelected(files) {
  console.log('Files selected:', files);
}

function onUploadComplete(files) {
  // TODO: Emitir evento con archivos cargados
  emit('photo-added', files);
  uploadDialogVisible.value = false;
}

function openLightbox(index) {
  lightboxIndex.value = index;
}

function editPhoto(photo) {
  selectedPhoto.value = { ...photo };
  editDialogVisible.value = true;
}

function savePhotoEdits() {
  if (selectedPhoto.value) {
    emit('photo-updated', selectedPhoto.value);
    editDialogVisible.value = false;
    selectedPhoto.value = null;
  }
}

function downloadPhoto(photo) {
  if (photo.fileUrl) {
    const link = document.createElement('a');
    link.href = photo.fileUrl;
    link.download = photo.fileName || 'foto';
    link.click();
    emit('photo-downloaded', photo);
  }
}

function confirmDelete(photo) {
  confirm.require({
    message: '¿Estás seguro de que deseas eliminar esta foto?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'Cancelar',
    accept: () => {
      emit('photo-deleted', photo);
    }
  });
}

function formatDate(date) {
  if (!date) return '';
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('es-PE', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}
</script>

<style scoped>
.photo-gallery-card {
  margin-bottom: 1.5rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  background: var(--surface-0);
  border: 1px solid var(--surface-200);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.photo-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* Aspect ratio 4:3 */
  overflow: hidden;
  background: var(--surface-100);
}

.gallery-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .photo-overlay {
  opacity: 1;
}

.overlay-button {
  color: white !important;
  font-size: 1.5rem;
}

.photo-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.photo-caption {
  font-weight: 500;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.photo-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.photo-date {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
}

.photo-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
  padding: 0 0.5rem 0.5rem;
  border-top: 1px solid var(--surface-200);
}

.no-photos-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-color-secondary);
}

.no-photos-message h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.no-photos-message p {
  margin: 0;
}

.edit-photo-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .photo-info {
    padding: 0.75rem;
  }

  .photo-actions {
    padding: 0 0.5rem 0.5rem;
  }
}
</style>
