<template>
  <Card class="file-upload-card">
    <template #title>
      <div class="flex align-items-center gap-2">
        <i class="pi pi-cloud-upload text-2xl"></i>
        <span>{{ title }}</span>
      </div>
    </template>

    <template #content>
      <!-- Información de ayuda -->
      <div v-if="showHelp" class="upload-help mb-3">
        <i class="pi pi-info-circle mr-2"></i>
        <span>{{ helpText }}</span>
      </div>

      <!-- Área de Drag & Drop -->
      <div 
        class="upload-dropzone"
        :class="{ 'dragover': isDragging, 'disabled': disabled || uploading }"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <input 
          ref="fileInput"
          type="file"
          :accept="acceptedTypes"
          :multiple="multiple"
          style="display: none;"
          @change="handleFileSelect"
          :disabled="disabled || uploading"
        />

        <div class="upload-content">
          <i class="pi pi-cloud-upload upload-icon" :class="{ 'uploading': uploading }"></i>
          <h3 class="upload-title">{{ uploadTitle }}</h3>
          <p class="upload-subtitle">{{ uploadSubtitle }}</p>
          <Button 
            label="Seleccionar archivos" 
            icon="pi pi-folder-open"
            :disabled="disabled || uploading"
            @click.stop="triggerFileInput"
          />
          <p class="upload-restrictions mt-3">
            {{ restrictionsText }}
          </p>
        </div>
      </div>

      <!-- Lista de archivos seleccionados -->
      <div v-if="fileList.length > 0" class="files-list mt-4">
        <Divider />
        <h4 class="mb-3">Archivos seleccionados ({{ fileList.length }})</h4>
        
        <div class="file-items">
          <div v-for="(file, index) in fileList" :key="index" class="file-item">
            <div class="file-info">
              <i :class="getFileIcon(file)" class="file-icon"></i>
              <div class="file-details">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatSize(file.size) }}</span>
              </div>
            </div>

            <div class="file-actions">
              <!-- Estado de carga -->
              <div v-if="file.status === 'UPLOADING'" class="upload-progress">
                <ProgressBar :value="file.progress || 0" :showValue="false" style="width: 100px;" />
                <span class="progress-text">{{ file.progress || 0 }}%</span>
              </div>

              <!-- Estado exitoso -->
              <Tag v-else-if="file.status === 'SUCCESS'" value="Cargado" severity="success" />

              <!-- Estado de error -->
              <Tag v-else-if="file.status === 'ERROR'" :value="file.error || 'Error'" severity="danger" />

              <!-- Estado pendiente -->
              <Tag v-else value="Pendiente" severity="secondary" />

              <!-- Botón eliminar -->
              <Button 
                icon="pi pi-times" 
                severity="danger"
                text
                rounded
                size="small"
                @click="removeFile(index)"
                :disabled="file.status === 'UPLOADING'"
                v-tooltip.top="'Eliminar'"
              />
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="upload-actions mt-4">
          <Button 
            label="Cargar todos" 
            icon="pi pi-upload"
            severity="primary"
            :loading="uploading"
            :disabled="!canUpload"
            @click="uploadAll"
          />
          <Button 
            label="Limpiar lista" 
            icon="pi pi-trash"
            severity="secondary"
            outlined
            :disabled="uploading"
            @click="clearAll"
          />
        </div>
      </div>

      <!-- Validaciones -->
      <div v-if="validationErrors.length > 0" class="validation-errors mt-3">
        <Message v-for="(error, index) in validationErrors" :key="index" severity="warn" :closable="false">
          {{ error }}
        </Message>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import Divider from 'primevue/divider';
import Message from 'primevue/message';
import { 
  UploadStatus,
  FileValidationRules,
  UploadMessages,
  validateFileSize,
  validateFileType,
  formatFileSize
} from '../../domain/constants/upload.constants.js';

const props = defineProps({
  title: {
    type: String,
    default: 'Cargar archivos'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  acceptedTypes: {
    type: String,
    default: 'image/*,.pdf,.doc,.docx,.xls,.xlsx'
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showHelp: {
    type: Boolean,
    default: true
  },
  helpText: {
    type: String,
    default: 'Arrastra archivos aquí o haz clic para seleccionar'
  },
  uploadTitle: {
    type: String,
    default: 'Arrastra archivos aquí'
  },
  uploadSubtitle: {
    type: String,
    default: 'o haz clic para seleccionar desde tu computadora'
  }
});

const emit = defineEmits(['files-selected', 'upload-complete', 'upload-error']);

const fileInput = ref(null);
const fileList = ref([]);
const isDragging = ref(false);
const uploading = ref(false);
const validationErrors = ref([]);

const canUpload = computed(() => {
  return fileList.value.length > 0 && 
         fileList.value.some(f => f.status === 'PENDING') &&
         !uploading.value;
});

const restrictionsText = computed(() => {
  return `Máximo ${props.maxFiles} archivos. Tamaño máximo: 10MB por archivo`;
});

function triggerFileInput() {
  if (!props.disabled && !uploading.value) {
    fileInput.value?.click();
  }
}

function handleDragEnter(e) {
  if (!props.disabled && !uploading.value) {
    isDragging.value = true;
  }
}

function handleDragOver(e) {
  if (!props.disabled && !uploading.value) {
    isDragging.value = true;
  }
}

function handleDragLeave(e) {
  isDragging.value = false;
}

function handleDrop(e) {
  isDragging.value = false;
  if (props.disabled || uploading.value) return;

  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  processFiles(files);
  e.target.value = ''; // Reset input
}

function processFiles(files) {
  validationErrors.value = [];

  // Validar número de archivos
  if (fileList.value.length + files.length > props.maxFiles) {
    validationErrors.value.push(`Solo puedes cargar hasta ${props.maxFiles} archivos`);
    return;
  }

  const validFiles = [];
  const errors = [];

  files.forEach(file => {
    // Validar tamaño
    if (!validateFileSize(file)) {
      errors.push(`${file.name}: Archivo demasiado grande`);
      return;
    }

    // Validar tipo
    if (!validateFileType(file)) {
      errors.push(`${file.name}: Tipo de archivo no permitido`);
      return;
    }

    validFiles.push({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: 'PENDING',
      progress: 0,
      error: null
    });
  });

  if (errors.length > 0) {
    validationErrors.value = errors;
  }

  if (validFiles.length > 0) {
    fileList.value.push(...validFiles);
    emit('files-selected', validFiles);
  }
}

function removeFile(index) {
  if (fileList.value[index].status !== 'UPLOADING') {
    fileList.value.splice(index, 1);
  }
}

function clearAll() {
  fileList.value = fileList.value.filter(f => f.status === 'UPLOADING');
  validationErrors.value = [];
}

async function uploadAll() {
  uploading.value = true;
  const pendingFiles = fileList.value.filter(f => f.status === 'PENDING');

  for (const fileData of pendingFiles) {
    await uploadFile(fileData);
  }

  uploading.value = false;
  
  const allSuccess = fileList.value.every(f => f.status === 'SUCCESS');
  if (allSuccess) {
    emit('upload-complete', fileList.value);
  }
}

async function uploadFile(fileData) {
  fileData.status = 'UPLOADING';
  fileData.progress = 0;

  try {
    // Simular progreso de carga
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      fileData.progress = i;
    }

    // TODO: Implementar lógica real de carga al servidor
    // const result = await documentApi.upload(fileData.file);
    
    fileData.status = 'SUCCESS';
    fileData.progress = 100;
  } catch (error) {
    fileData.status = 'ERROR';
    fileData.error = error.message || 'Error al cargar';
    emit('upload-error', { file: fileData, error });
  }
}

function getFileIcon(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const iconMap = {
    pdf: 'pi pi-file-pdf text-red-500',
    doc: 'pi pi-file-word text-blue-500',
    docx: 'pi pi-file-word text-blue-500',
    xls: 'pi pi-file-excel text-green-500',
    xlsx: 'pi pi-file-excel text-green-500',
    jpg: 'pi pi-image text-purple-500',
    jpeg: 'pi pi-image text-purple-500',
    png: 'pi pi-image text-purple-500',
    gif: 'pi pi-image text-purple-500',
    webp: 'pi pi-image text-purple-500'
  };
  return iconMap[ext] || 'pi pi-file text-gray-500';
}

function formatSize(bytes) {
  return formatFileSize(bytes);
}

// Exponer métodos para uso externo
defineExpose({
  clearAll,
  uploadAll,
  getFiles: () => fileList.value
});
</script>

<style scoped>
.file-upload-card {
  margin-bottom: 1.5rem;
}

.upload-help {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: var(--primary-50);
  border-left: 4px solid var(--primary-500);
  border-radius: 6px;
  color: var(--primary-700);
  font-size: 0.9rem;
}

.upload-dropzone {
  border: 2px dashed var(--surface-300);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--surface-50);
}

.upload-dropzone:hover:not(.disabled) {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.upload-dropzone.dragover {
  border-color: var(--primary-500);
  background: var(--primary-100);
  transform: scale(1.02);
}

.upload-dropzone.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 4rem;
  color: var(--primary-500);
  margin-bottom: 1rem;
  display: block;
}

.upload-icon.uploading {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.upload-subtitle {
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
}

.upload-restrictions {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
  font-style: italic;
}

.files-list {
  margin-top: 1.5rem;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface-0);
  border: 1px solid var(--surface-200);
  border-radius: 8px;
  transition: all 0.2s;
}

.file-item:hover {
  background: var(--surface-50);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-500);
  min-width: 40px;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.validation-errors {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .upload-dropzone {
    padding: 2rem 1rem;
  }

  .upload-icon {
    font-size: 3rem;
  }

  .upload-title {
    font-size: 1.25rem;
  }

  .file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .file-actions {
    width: 100%;
    justify-content: space-between;
  }

  .upload-actions {
    flex-direction: column;
  }

  .upload-actions .p-button {
    width: 100%;
  }
}
</style>
